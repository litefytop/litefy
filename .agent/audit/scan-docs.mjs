import { chromium } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";
import fs from "node:fs";

const BASE = "http://localhost:5199";
const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const routes = JSON.parse(fs.readFileSync(new URL("./routes.json", import.meta.url), "utf8"));

const browser = await chromium.launch({
  executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
});
const context = await browser.newContext();
await context.addInitScript(() => {
  window.__longtasks = [];
  document.addEventListener(
    "click",
    (e) => {
      const a = e.target && e.target.closest ? e.target.closest("a") : null;
      if (a) e.preventDefault();
    },
    true,
  );
  try {
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        window.__longtasks.push({
          duration: Math.round(e.duration),
          start: Math.round(e.startTime),
          name: e.name,
          attribution: (e.attribution || []).map((a) => a.name).join(","),
        });
      }
    }).observe({ entryTypes: ["longtask"] });
  } catch {}
});
const page = await context.newPage();
page.setDefaultTimeout(20000);
let currentRecord = null;
page.on("console", (msg) => {
  if (msg.type() === "error" && currentRecord) currentRecord.consoleErrors.push(msg.text().slice(0, 200));
});

const summary = [];
for (const route of routes) {
  const url = `${BASE}/en/docs/component/${route}`;
  const record = { route, url, axeError: null, violations: [], longtasks: [], interactions: [], consoleErrors: [] };
  currentRecord = record;
  try {
    await page.goto(url, { waitUntil: "load", timeout: 45000 });
    await page.waitForSelector(".preview", { timeout: 15000 });
    await page.waitForTimeout(900);
  } catch (e) {
    record.axeError = "nav/selector: " + String(e).slice(0, 150);
    summary.push(record);
    console.log(`SKIP ${route}: ${record.axeError}`);
    continue;
  }

  try {
    const axe = await new AxeBuilder({ page }).include(".preview").withTags(TAGS).analyze();
    record.violations = axe.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      help: v.help,
      wcag: v.tags.filter((t) => t.startsWith("wcag")),
      nodes: v.nodes.length,
      sampleTargets: v.nodes.slice(0, 3).map((n) => n.target.join(" ")),
    }));
    record.incomplete = axe.incomplete.length;
  } catch (e) {
    record.axeError = String(e).slice(0, 200);
  }

  try {
    await page.evaluate(() => { window.__longtasks = []; });
  } catch {
    await page.goto(url, { waitUntil: "load", timeout: 45000 }).catch(() => {});
    await page.evaluate(() => { window.__longtasks = []; }).catch(() => {});
  }
  try {
    const previews = await page.$$(".preview");
    for (const preview of previews) {
      const buttons = await preview.$$("button:not([disabled])");
      let clicks = 0;
      for (const b of buttons) {
        if (clicks >= 6) break;
        try {
          if (!(await b.isVisible())) continue;
          const t0 = Date.now();
          await b.click({ timeout: 1500 });
          await page.waitForTimeout(160);
          record.interactions.push({ action: "click", ms: Date.now() - t0 });
          clicks++;
        } catch {}
      }
      const inputs = await preview.$$("input:not([type=hidden]):not([disabled]):not([readonly]), textarea:not([disabled]):not([readonly])");
      let typed = 0;
      for (const inp of inputs) {
        if (typed >= 2) break;
        try {
          if (!(await inp.isVisible())) continue;
          const t0 = Date.now();
          await inp.click({ timeout: 1500 });
          await inp.type("Audit123", { delay: 15 });
          record.interactions.push({ action: "type", ms: Date.now() - t0 });
          await page.keyboard.press("Escape");
          typed++;
        } catch {}
      }
    }
  } catch {}
  record.longtasks = await page.evaluate(() => window.__longtasks.splice(0)).catch(() => []);

  summary.push(record);
  fs.writeFileSync(new URL(`./results/docs-${route}.json`, import.meta.url), JSON.stringify(record, null, 1));
  const vCount = record.violations.reduce((s, v) => s + v.nodes, 0);
  console.log(`${route.padEnd(16)} violations=${record.violations.length} (${vCount} nodes) longtasks=${record.longtasks.length}`);
}
fs.writeFileSync(new URL("./results/docs-summary.json", import.meta.url), JSON.stringify(summary, null, 1));
await browser.close();
console.log("DONE pages:", summary.length);
