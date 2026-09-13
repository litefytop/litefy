// Identify WHAT the leaked detached elements are for a given demo.
import { chromium } from "playwright";
import { startHarnessServer } from "./harness-server.mjs";

const demo = process.argv[2] || "calendar/basic";
const iters = Number(process.argv[3] || 300);
const server = await startHarnessServer(5194);
await server.listen();
const browser = await chromium.launch({ executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" });
const context = await browser.newContext();
await context.addInitScript(() => {
  window.__refs = [];
  const orig = document.createElement.bind(document);
  document.createElement = function (tag, opts) {
    const el = orig(tag, opts);
    try { if (window.__refs.length < 400000) window.__refs.push(new WeakRef(el)); } catch {}
    return el;
  };
});
const page = await context.newPage();
const cdp = await context.newCDPSession(page);
await page.goto(`http://localhost:5194/.agent/audit/harness/index.html?demo=${demo}`, { waitUntil: "domcontentloaded" });
await page.waitForSelector("#root > *", { timeout: 30000 });
await page.waitForTimeout(800);
await cdp.send("HeapProfiler.collectGarbage");
await page.waitForTimeout(200);

const detachedInfo = () =>
  page.evaluate(() => {
    const detached = window.__refs.filter((r) => { const e = r.deref(); return e && !e.isConnected; }).map((r) => r.deref());
    const bySig = new Map();
    for (const el of detached) {
      const sig = `${el.tagName.toLowerCase()}${el.className && typeof el.className === "string" ? "." + el.className.trim().split(/\s+/).slice(0, 3).join(".") : ""}${el.hasAttribute("popover") ? "[popover]" : ""}`;
      bySig.set(sig, (bySig.get(sig) || 0) + 1);
    }
    return {
      total: detached.length,
      bySig: [...bySig.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12),
      samples: detached.slice(0, 3).map((el) => el.outerHTML.slice(0, 160)),
    };
  });

console.log("before:", JSON.stringify((await detachedInfo()).bySig));
await page.evaluate(
  async (n) => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    let buttons = [];
    for (let i = 0; i < n; i++) {
      if (i % 20 === 0 || !buttons.length) buttons = [...document.querySelectorAll("#root button:not([disabled])")];
      try { buttons[i % buttons.length].click(); } catch {}
      await sleep(4);
      if (i % 5 === 0) document.body.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
      const t = document.activeElement || document.body;
      t.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
      await sleep(4);
    }
  },
  iters,
);
await page.waitForTimeout(1500);
await cdp.send("HeapProfiler.collectGarbage");
await page.waitForTimeout(300);
const info = await detachedInfo();
console.log("after:", info.total);
for (const [sig, count] of info.bySig) console.log(`  ${String(count).padStart(6)}  ${sig}`);
for (const s of info.samples) console.log("  SAMPLE:", s.replace(/\n/g, " ").slice(0, 150));
await browser.close();
await server.close();
