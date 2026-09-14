import { chromium } from "playwright";
import { startHarnessServer } from "./harness-server.mjs";

const server = await startHarnessServer(5212);
await server.listen();
const browser = await chromium.launch({
  executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  headless: true,
});
const page = await browser.newPage({ viewport: { width: 700, height: 600 } });
page.on("pageerror", (e) => console.log("[pageerror]", String(e).slice(0, 200)));
await page.goto("http://localhost:5212/.agent/audit/harness/index.html?demo=table/scroll", { waitUntil: "domcontentloaded" });
await page.waitForSelector("#root table", { timeout: 15000 });
await page.waitForTimeout(500);

const check = await page.evaluate(() => {
  const tables = document.querySelectorAll("#root table");
  const head = tables[0], body = tables[1];
  const ths = [...head.querySelectorAll("th")].map((t) => { const r = t.getBoundingClientRect(); return { l: +r.left.toFixed(1), w: +r.width.toFixed(1) }; });
  const tds = [...body.querySelectorAll("tbody tr:first-child td")].map((t) => { const r = t.getBoundingClientRect(); return { l: +r.left.toFixed(1), w: +r.width.toFixed(1) }; });
  const bodyWrap = body.parentElement;
  const headerWrap = head.parentElement;
  return {
    aligned: ths.every((t, i) => tds[i] && Math.abs(t.l - tds[i].l) < 1 && Math.abs(t.w - tds[i].w) < 1),
    bodyMaxH: getComputedStyle(bodyWrap).maxHeight,
    bodyOverflowY: getComputedStyle(bodyWrap).overflowY,
    headerOverflow: getComputedStyle(headerWrap).overflow,
    headerScrollbarReserve: headerWrap.offsetWidth - headerWrap.clientWidth,
  };
});
console.log("composite:", JSON.stringify(check));

// atoms assembly: custom two-table build via exported atoms
await page.evaluate(() => {
  document.getElementById("root").innerHTML = "";
});
const atomCheck = await page.evaluate(async () => {
  const ui = await import("/app/ui/index.ts").catch(() => null);
  return ui ? Object.keys(ui).filter((k) => k.startsWith("Table")) : "no-ui-import";
});
console.log("atom exports:", JSON.stringify(atomCheck));
await browser.close();
await server.close();
