import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startHarnessServer } from "./harness-server.mjs";

const REPO = path.resolve(import.meta.dirname, "../..");
const DEMOS_DIR = path.join(REPO, "app/demos");
const SKIP_DIRS = new Set(["use-drag", "use-pagination", "use-remote-pagination", "use-theme", "virtual-scroll"]);
const BASE = "http://localhost:5188";

function manifest() {
  const out = [];
  for (const dir of fs.readdirSync(DEMOS_DIR).sort()) {
    const p = path.join(DEMOS_DIR, dir);
    if (!fs.statSync(p).isDirectory() || SKIP_DIRS.has(dir)) continue;
    const files = fs.readdirSync(p).filter((f) => f.endsWith(".tsx")).sort();
    if (!files.length) continue;
    const pick = files.includes("basic.tsx") ? "basic.tsx" : files[0];
    out.push({ dir, variant: pick.replace(/\.tsx$/, ""), demo: `${dir}/${pick.replace(/\.tsx$/, "")}` });
  }
  return out;
}

function parseWdyr(raw) {
  const groups = [];
  let current = null;
  for (const msg of raw) {
    const text = msg.text || "";
    if (text.includes("[why-did-you-render]")) {
      if (current) groups.push(current);
      current = { component: text.split("[why-did-you-render]")[0].trim().replace(/^.*\]\s*/, ""), phase: msg.phase, reasons: [] };
    } else if (current && (msg.type === "log" || msg.type === "warning" || msg.type === "error")) {
      if (text.trim() && !text.includes("%c")) current.reasons.push(text.trim().slice(0, 200));
      else if (text.trim()) current.reasons.push(text.replace(/%c/g, "").trim().slice(0, 200));
    }
  }
  if (current) groups.push(current);
  const merged = new Map();
  for (const g of groups) {
    const key = `${g.component}|${g.phase}`;
    const prev = merged.get(key);
    if (prev) prev.count++;
    else merged.set(key, { component: g.component, phase: g.phase, count: 1, reasons: [...new Set(g.reasons)].slice(0, 4) });
  }
  return [...merged.values()].sort((a, b) => b.count - a.count);
}

const server = await startHarnessServer(5188);
await server.listen();
console.log("harness up");

const browser = await chromium.launch({
  executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
});
const context = await browser.newContext();
const results = [];

for (const item of manifest()) {
  const page = await context.newPage();
  const wdyrRaw = [];
  let phase = "mount";
  page.on("console", (msg) => {
    const type = msg.type();
    if (type === "startGroupCollapsed" || type === "startGroup" || type === "log" || type === "warning" || type === "error") {
      wdyrRaw.push({ type, text: msg.text().slice(0, 300), phase });
    }
  });
  const record = { demo: item.demo, mountError: null, mountCommits: 0, interactionCommits: 0, interactionDurations: [], wdyr: [], mountConsole: [] };
  page.on("pageerror", (e) => wdyrRaw.push({ type: "pageerror", text: String(e).slice(0, 300), phase }));
  try {
    await page.goto(`${BASE}/.agent/audit/harness/index.html?demo=${item.demo}`, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForSelector("#root > *", { timeout: 30000 });
    await page.waitForTimeout(800);
    record.mountConsole = wdyrRaw.filter((m) => m.type === "error" || m.type === "pageerror").map((m) => m.text.slice(0, 200)).slice(0, 3);
    wdyrRaw.length = 0;
    phase = "interact";
    const mountCommits = await page.evaluate(() => window.__commits.slice());
    record.mountCommits = mountCommits.length;

    const root = await page.$("#root");
    if (root) {
      const buttons = await root.$$("button:not([disabled])");
      let clicks = 0;
      for (const b of buttons) {
        if (clicks >= 5) break;
        try {
          if (!(await b.isVisible())) continue;
          const t0 = Date.now();
          await b.click({ timeout: 1500 });
          record.interactionDurations.push(Date.now() - t0);
          await page.waitForTimeout(140);
          clicks++;
        } catch {}
      }
      const inputs = await root.$$("input:not([type=hidden]):not([disabled]):not([readonly]), textarea:not([disabled]):not([readonly])");
      let typed = 0;
      for (const inp of inputs) {
        if (typed >= 2) break;
        try {
          if (!(await inp.isVisible())) continue;
          const t0 = Date.now();
          await inp.click({ timeout: 1500 });
          await inp.type("Audit123", { delay: 12 });
          record.interactionDurations.push(Date.now() - t0);
          await page.keyboard.press("Escape");
          typed++;
        } catch {}
      }
    }
    await page.waitForTimeout(400);
    const commits = await page.evaluate(() => window.__commits.slice()).catch(() => []);
    record.interactionCommits = commits.length;
    record.interactionDurationsSample = record.interactionDurations.slice(0, 8);
    record.wdyr = parseWdyr(wdyrRaw);
  } catch (e) {
    record.mountError = String(e).slice(0, 200);
  }
  results.push(record);
  const top = record.wdyr.slice(0, 3).map((w) => `${w.component}×${w.count}`).join(", ");
  const err = record.mountError || (record.mountCommits === 0 && record.mountConsole[0]) || "";
  console.log(`${item.demo.padEnd(24)} mount=${record.mountCommits} interact=${record.interactionCommits} wdyr: ${top || "-"}${err ? "  ERR: " + err.slice(0, 120) : ""}`);
  await page.close();
}

fs.writeFileSync(new URL("./results/wdyr.json", import.meta.url), JSON.stringify(results, null, 1));
await browser.close();
await server.close();
console.log("DONE demos:", results.length);
