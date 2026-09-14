import { chromium } from "playwright";
import { startHarnessServer } from "./harness-server.mjs";

const server = await startHarnessServer(5209);
await server.listen();
const browser = await chromium.launch({ executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", headless: true });
const page = await browser.newPage();
await page.goto("http://localhost:5209/.agent/audit/harness/index.html?demo=table/basic", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(400);
const widths = await page.evaluate(() => {
  const W = 600;
  const mk = (style) => {
    const d = document.createElement("div");
    d.setAttribute("style", `width:${W}px;height:50px;overflow-y:${style.overflow};${style.extra || ""}`);
    const inner = document.createElement("div");
    inner.style.width = "100%";
    inner.textContent = "x";
    d.appendChild(inner);
    document.body.appendChild(d);
    return d.firstChild.getBoundingClientRect().width;
  };
  return {
    plain: mk({ overflow: "hidden" }),
    autoGutter: mk({ overflow: "auto", extra: "scrollbar-gutter:stable" }),
    hiddenGutter: mk({ overflow: "hidden", extra: "scrollbar-gutter:stable" }),
    scrollHiddenSb: mk({ overflow: "scroll", extra: "scrollbar-width:none" }),
    scrollGutterHiddenSb: mk({ overflow: "scroll", extra: "scrollbar-gutter:stable;scrollbar-width:none" }),
    scrollWithSb: mk({ overflow: "scroll" }),
  };
});
console.log(JSON.stringify(widths, null, 1));
await browser.close();
await server.close();
