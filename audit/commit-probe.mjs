// Detailed commit timeline for demos with suspicious commit counts.
// Usage: node commit-probe.mjs [demo ...]   (default: the four suspects)
import { chromium } from "playwright";
import path from "node:path";
import { startHarnessServer } from "./harness-server.mjs";

const REPO = path.resolve(import.meta.dirname, "../..");
const DEMOS = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ["masonry/basic", "chip-group/basic", "image/basic", "toast/basic"];
const PORT = 5190;

const server = await startHarnessServer(PORT);
await server.listen();

const browser = await chromium.launch({
  executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
});
const page = await browser.newPage();

for (const demo of DEMOS) {
  console.log(`\n=== ${demo} ===`);
  await page.goto(`http://localhost:${PORT}/.agent/audit/harness/index.html?demo=${demo}`, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await page.waitForSelector("#root > *", { timeout: 30000 });
  await page.waitForTimeout(1500);
  await page.evaluate(() => {
    window.__marks = [];
    const orig = window.__commits.splice(0);
    window.__marks.push(...orig.map((c) => ({ ...c, at: "mount-window" })));
  });
  // Click up to 3 buttons like the scan does, then dump the full timeline.
  const buttons = await page.$$("#root button:not([disabled])");
  let clicks = 0;
  for (const b of buttons) {
    if (clicks >= 3) break;
    try {
      if (!(await b.isVisible())) continue;
      await b.click({ timeout: 1500 });
      await page.waitForTimeout(600);
      clicks++;
    } catch {}
  }
  await page.waitForTimeout(1000);
  const marks = await page.evaluate(() => window.__marks.slice());
  const commits = await page.evaluate(() => window.__commits.slice());
  marks.forEach((c, i) => {
    console.log(
      `  mount#${i + 1} ${c.phase.padEnd(6)} dur=${String(c.actualDuration).padStart(7)}ms t=+${c.commitTime}ms`,
    );
  });
  commits.forEach((c, i) => {
    console.log(
      `  post#${i + 1} ${c.phase.padEnd(6)} dur=${String(c.actualDuration).padStart(7)}ms t=+${c.commitTime}ms`,
    );
  });
  console.log(`  total: mount=${marks.length} post=${commits.length}`);
}

await browser.close();
await server.close();
