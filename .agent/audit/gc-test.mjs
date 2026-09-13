import { chromium } from "playwright";
import { startHarnessServer } from "./harness-server.mjs";

const server = await startHarnessServer(5196);
await server.listen();
const browser = await chromium.launch({ executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" });
const context = await browser.newContext();
await context.addInitScript(() => {
  window.__leak = { refs: [] };
  const orig = document.createElement.bind(document);
  document.createElement = function (tag, opts) {
    const el = orig(tag, opts);
    try { window.__leak.refs.push(new WeakRef(el)); } catch {}
    return el;
  };
});
const page = await context.newPage();
const cdp = await context.newCDPSession(page);
await page.goto("http://localhost:5196/.agent/audit/harness/index.html?demo=calendar/basic", { waitUntil: "domcontentloaded" });
await page.waitForSelector("#root > *", { timeout: 30000 });
await page.waitForTimeout(800);

const count = () => page.evaluate(() => window.__leak.refs.filter((r) => { const e = r.deref(); return e && !e.isConnected; }).length);
const gcOnce = async () => { await cdp.send("HeapProfiler.collectGarbage"); await page.waitForTimeout(150); };

await page.evaluate(async (n) => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  let buttons = [];
  for (let i = 0; i < n; i++) {
    if (i % 20 === 0 || !buttons.length) buttons = [...document.querySelectorAll("#root button:not([disabled])")];
    try { buttons[i % buttons.length].click(); } catch {}
    await sleep(4);
    const t = document.activeElement || document.body;
    t.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    if (i % 5 === 0) document.body.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    await sleep(4);
  }
}, 200);
await page.waitForTimeout(1200);
await gcOnce();
console.log("after 1st GC:", await count());
await gcOnce();
console.log("after 2nd GC:", await count());
await gcOnce();
await page.waitForTimeout(500);
console.log("after 3rd GC + 500ms:", await count());
await browser.close();
await server.close();
