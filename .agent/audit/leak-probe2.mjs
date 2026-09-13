// Exact mirror of leak-scan flow for one demo, with full sample dumps.
import { chromium } from "playwright";
import { startHarnessServer } from "./harness-server.mjs";

const demo = process.argv[2] || "calendar/basic";
const iters = Number(process.argv[3] || 1000);
const server = await startHarnessServer(5195);
await server.listen();
const browser = await chromium.launch({ executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" });
const context = await browser.newContext();
await context.addInitScript(() => {
  window.__leak = { refs: [], listenersAdded: 0, listenersRemoved: 0, roCreated: 0, roDisconnected: 0, moCreated: 0, moDisconnected: 0 };
  const origCreate = document.createElement.bind(document);
  document.createElement = function (tag, opts) {
    const el = origCreate(tag, opts);
    try { if (window.__leak.refs.length < 400000) window.__leak.refs.push(new WeakRef(el)); } catch {}
    return el;
  };
  const origAdd = EventTarget.prototype.addEventListener;
  const origRemove = EventTarget.prototype.removeEventListener;
  EventTarget.prototype.addEventListener = function (...a) { window.__leak.listenersAdded++; return origAdd.apply(this, a); };
  EventTarget.prototype.removeEventListener = function (...a) { window.__leak.listenersRemoved++; return origRemove.apply(this, a); };
  const wrapObserver = (name, ck, dk) => {
    const Orig = window[name];
    if (!Orig) return;
    window[name] = function (...args) {
      const inst = new Orig(...args);
      window.__leak[ck]++;
      const od = inst.disconnect.bind(inst);
      inst.disconnect = (...d) => { window.__leak[dk]++; return od(...d); };
      return inst;
    };
    window[name].prototype = Orig.prototype;
  };
  wrapObserver("ResizeObserver", "roCreated", "roDisconnected");
  wrapObserver("MutationObserver", "moCreated", "moDisconnected");
});
const page = await context.newPage();
const cdp = await context.newCDPSession(page);
const sample = async (label) => {
  await cdp.send("HeapProfiler.collectGarbage");
  await page.waitForTimeout(150);
  const s = await page.evaluate(() => ({
    heap: performance.memory.usedJSHeapSize,
    detached: window.__leak.refs.filter((r) => { const e = r.deref(); return e && !e.isConnected; }).length,
    net: window.__leak.listenersAdded - window.__leak.listenersRemoved,
    refs: window.__leak.refs.length,
  }));
  console.log(label, JSON.stringify(s));
  return s;
};
const toggleLoop = (n) =>
  page.evaluate(async (n) => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    let buttons = [];
    for (let i = 0; i < n; i++) {
      if (i % 20 === 0 || !buttons.length) buttons = [...document.querySelectorAll("#root button:not([disabled])")];
      const btn = buttons[i % buttons.length];
      try { btn.click(); } catch {}
      await sleep(4);
      const t = document.activeElement || document.body;
      t.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
      if (i % 5 === 0) document.body.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
      await sleep(4);
    }
  }, n);

await page.goto(`http://localhost:5195/.agent/audit/harness/index.html?demo=${demo}`, { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForSelector("#root > *", { timeout: 30000 });
await page.waitForTimeout(800);
const s0 = await sample("s0");
await toggleLoop(Math.floor(iters / 2));
const sMid = await sample("sMid");
await toggleLoop(iters - Math.floor(iters / 2));
await page.waitForTimeout(1200);
const s1 = await sample("s1");
// identify
const sig = await page.evaluate(() => {
  const els = window.__leak.refs.map((r) => r.deref()).filter((e) => e && !e.isConnected);
  const bySig = new Map();
  for (const el of els) {
    const cls = typeof el.className === "string" && el.className ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".") : "";
    const k = `${el.tagName.toLowerCase()}${cls}`;
    bySig.set(k, (bySig.get(k) || 0) + 1);
  }
  return [...bySig.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
});
for (const [k, c] of sig) console.log("  ", String(c).padStart(6), k);
await browser.close();
await server.close();
