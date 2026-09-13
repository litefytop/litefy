// Dimension ④ memory/leak scan: repeated open/close + mount cycles per demo,
// then forced GC and three leak signals:
//   1. JS heap growth, sampled in two segments so plateau (warmup) and linear
//      growth (leak) are distinguishable.
//   2. detached DOM elements: every createElement is registered as a WeakRef;
//      after GC, alive-but-unconnected elements are counted.
//   3. live ResizeObserver / MutationObserver instances and net event-listener
//      adds (added - removed), so missing cleanup shows up as drift.
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startHarnessServer } from "./harness-server.mjs";

const REPO = path.resolve(import.meta.dirname, "../..");
const DEMOS_DIR = path.join(REPO, "app/demos");
const SKIP_DIRS = new Set(["use-drag", "use-pagination", "use-remote-pagination", "use-theme", "virtual-scroll"]);
const BASE = "http://localhost:5193";

// Overlay/observer-heavy demos get the full 1000-cycle treatment.
const RISK_ITERS = 1000;
const BASE_ITERS = 200;
const RISK = new Set([
  "popover", "dialog", "drawer", "dropdown-menu", "tooltip", "select", "combobox",
  "multi-select", "date-picker", "context-menu", "toast", "query-builder",
  "banner", "chart", "masonry", "scroll-shadow", "watermark", "sidebar",
]);
const LONG_TAIL_MS = { toast: 6000 }; // let auto-dismiss timers expire before sampling

const ONLY = process.argv.slice(2);

function manifest() {
  const out = [];
  for (const dir of fs.readdirSync(DEMOS_DIR).sort()) {
    const p = path.join(DEMOS_DIR, dir);
    if (!fs.statSync(p).isDirectory() || SKIP_DIRS.has(dir)) continue;
    if (ONLY.length && !ONLY.includes(dir)) continue;
    const files = fs.readdirSync(p).filter((f) => f.endsWith(".tsx")).sort();
    if (!files.length) continue;
    const pick = files.includes("basic.tsx") ? "basic.tsx" : files[0];
    out.push({ dir, demo: `${dir}/${pick.replace(/\.tsx$/, "")}` });
  }
  return out;
}

await fs.promises.writeFile(
  new URL("./results/.leak-init", import.meta.url),
  "",
).catch(() => {});

const server = await startHarnessServer(5193);
await server.listen();
console.log("harness up");

const browser = await chromium.launch({
  executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
});
const context = await browser.newContext();
await context.addInitScript(() => {
  window.__leak = {
    refs: [],
    listenersAdded: 0,
    listenersRemoved: 0,
    roCreated: 0,
    roDisconnected: 0,
    moCreated: 0,
    moDisconnected: 0,
  };
  const origCreate = document.createElement.bind(document);
  document.createElement = function (tag, opts) {
    const el = origCreate(tag, opts);
    try {
      if (window.__leak.refs.length < 400000) window.__leak.refs.push(new WeakRef(el));
    } catch {}
    return el;
  };
  const origAdd = EventTarget.prototype.addEventListener;
  const origRemove = EventTarget.prototype.removeEventListener;
  EventTarget.prototype.addEventListener = function (...a) {
    window.__leak.listenersAdded++;
    return origAdd.apply(this, a);
  };
  EventTarget.prototype.removeEventListener = function (...a) {
    window.__leak.listenersRemoved++;
    return origRemove.apply(this, a);
  };
  const wrapObserver = (name, createdKey, discKey) => {
    const Orig = window[name];
    if (!Orig) return;
    window[name] = function (...args) {
      const inst = new Orig(...args);
      window.__leak[createdKey]++;
      const origDisconnect = inst.disconnect.bind(inst);
      inst.disconnect = (...d) => {
        window.__leak[discKey]++;
        return origDisconnect(...d);
      };
      return inst;
    };
    window[name].prototype = Orig.prototype;
  };
  wrapObserver("ResizeObserver", "roCreated", "roDisconnected");
  wrapObserver("MutationObserver", "moCreated", "moDisconnected");
});

const page = await context.newPage();
const cdp = await context.newCDPSession(page);
// One collectGarbage pass can leave WeakRef clearing pending; two passes with a
// beat between them are the reliable way to force a full collection.
const gc = async () => {
  await cdp.send("HeapProfiler.collectGarbage");
  await page.waitForTimeout(120);
  await cdp.send("HeapProfiler.collectGarbage");
  await page.waitForTimeout(150);
};
const sample = () =>
  page.evaluate(() => ({
    heap: performance.memory ? performance.memory.usedJSHeapSize : 0,
    detached: window.__leak.refs.filter((r) => {
      const el = r.deref();
      return el && !el.isConnected;
    }).length,
    refs: window.__leak.refs.length,
    netListeners: window.__leak.listenersAdded - window.__leak.listenersRemoved,
    roLive: window.__leak.roCreated - window.__leak.roDisconnected,
    moLive: window.__leak.moCreated - window.__leak.moDisconnected,
  }));

// What are the surviving detached elements? Top signatures + a sample node.
const detachedSignatures = () =>
  page.evaluate(() => {
    const els = window.__leak.refs
      .map((r) => r.deref())
      .filter((e) => e && !e.isConnected);
    const bySig = new Map();
    for (const el of els) {
      const cls = typeof el.className === "string" && el.className
        ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".")
        : "";
      const sig = `${el.tagName.toLowerCase()}${cls}${el.hasAttribute("popover") ? "[popover]" : ""}`;
      bySig.set(sig, (bySig.get(sig) || 0) + 1);
    }
    return {
      total: els.length,
      top: [...bySig.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8),
      sample: els[0] ? els[0].outerHTML.slice(0, 200) : "",
    };
  });

const toggleLoop = async (iters) =>
  page.evaluate(
    async (n) => {
      const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
      const esc = () => {
        const target = document.activeElement || document.body;
        target.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
      };
      const outsideDown = () =>
        document.body.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
      let buttons = [];
      for (let i = 0; i < n; i++) {
        if (i % 20 === 0 || !buttons.length) {
          buttons = [...document.querySelectorAll("#root button:not([disabled])")];
        }
        const btn = buttons[i % buttons.length];
        try {
          btn.click();
        } catch {}
        await sleep(4);
        esc();
        if (i % 5 === 0) outsideDown();
        await sleep(4);
      }
    },
    iters,
  );

const mb = (bytes) => (bytes / 1048576).toFixed(2);
const summary = [];
for (const item of manifest()) {
  const iters = RISK.has(item.dir) ? RISK_ITERS : BASE_ITERS;
  const record = { demo: item.demo, iters, error: null };
  try {
    // Dev servers recompile on demand and can abort navigation with a reload;
    // retry so a reload doesn't pollute or kill the measurement.
    let ready = false;
    for (let attempt = 0; attempt < 3 && !ready; attempt++) {
      try {
        await page.goto(`${BASE}/.agent/audit/harness/index.html?demo=${item.demo}`, {
          waitUntil: "domcontentloaded",
          timeout: 60000,
        });
        await page.waitForSelector("#root > *", { timeout: 30000 });
        ready = true;
      } catch (e) {
        if (attempt === 2) throw e;
        await page.waitForTimeout(1500);
      }
    }
    await page.waitForTimeout(800);
    const s0 = await sample();
    await toggleLoop(Math.floor(iters / 2));
    const sMid = await sample();
    await toggleLoop(iters - Math.floor(iters / 2));
    await page.waitForTimeout(LONG_TAIL_MS[item.dir] ?? 1200);
    const s1 = await sample();
    const segA = sMid.heap - s0.heap;
    const segB = s1.heap - sMid.heap;
    const growth = s1.heap - s0.heap;
    const roDelta = s1.roLive - s0.roLive;
    const detachedDelta = s1.detached - s0.detached;
    const listenerDelta = s1.netListeners - s0.netListeners;
    let verdict = "ok";
    if (segB > 1.5 * 1048576 && segB > segA * 0.7) verdict = "LEAK? linear heap growth";
    else if (growth > 3 * 1048576) verdict = "warmup-heavy";
    const flags = [];
    if (detachedDelta > 20) flags.push("detached");
    if (roDelta > 2) flags.push("observers");
    if (listenerDelta > 20) flags.push("listeners");
    if (flags.length) {
      const sig = await detachedSignatures();
      record.leakedNodes = sig.top;
      record.leakedSample = sig.sample;
      verdict = `LEAK? ${flags.join("+")} drift`;
    }
    Object.assign(record, {
      heap0MB: +mb(s0.heap), heapMidMB: +mb(sMid.heap), heap1MB: +mb(s1.heap),
      growthMB: +(growth / 1048576).toFixed(2),
      segAMB: +(segA / 1048576).toFixed(2), segBMB: +(segB / 1048576).toFixed(2),
      detached0: s0.detached, detached1: s1.detached, detachedDelta,
      refs1: s1.refs,
      listenerDelta, roDelta, moDelta: s1.moLive - s0.moLive, verdict,
    });
  } catch (e) {
    record.error = String(e).slice(0, 160);
  }
  summary.push(record);
  fs.writeFileSync(
    new URL(`./results/leak-${item.dir}.json`, import.meta.url),
    JSON.stringify(record, null, 1),
  );
  const r = record;
  console.log(
    r.error
      ? `${item.demo.padEnd(22)} ERROR ${r.error}`
      : `${item.demo.padEnd(22)} heap +${String(r.growthMB).padStart(6)}MB (A ${r.segAMB} / B ${r.segBMB}) detached +${String(r.detachedDelta).padStart(5)} ro +${r.roDelta} listeners +${r.listenerDelta}  ${r.verdict}`,
  );
  if (r.leakedNodes) {
    for (const [sig, count] of r.leakedNodes) console.log(`    ${String(count).padStart(6)}  ${sig}`);
    if (r.leakedSample) console.log(`    SAMPLE: ${String(r.leakedSample).replace(/\s+/g, " ").slice(0, 160)}`);
  }
}
if (!ONLY.length) {
  fs.writeFileSync(new URL("./results/leak-summary.json", import.meta.url), JSON.stringify(summary, null, 1));
}
await browser.close();
await server.close();
const flagged = summary.filter((r) => r.verdict && r.verdict.startsWith("LEAK"));
console.log(`DONE demos: ${summary.length}, flagged: ${flagged.length}${flagged.length ? " → " + flagged.map((f) => f.demo).join(", ") : ""}`);
