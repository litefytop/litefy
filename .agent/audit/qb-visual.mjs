import { chromium } from "playwright";
import { startHarnessServer } from "./harness-server.mjs";

const server = await startHarnessServer(5191);
await server.listen();
const browser = await chromium.launch({ executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" });
const page = await browser.newPage({ viewport: { width: 800, height: 900 } });
await page.goto("http://localhost:5191/.agent/audit/harness/index.html?demo=query-builder/basic", { waitUntil: "domcontentloaded" });
await page.waitForSelector("#root > *", { timeout: 30000 });
await page.waitForTimeout(800);
await page.screenshot({ path: "/tmp/qb-initial.png", fullPage: true });

// Add a condition to Name (first +), type a value
const addButtons = page.locator('button[aria-label^="Add condition to"]');
await addButtons.nth(0).click(); // Name
await page.locator("#root input[placeholder='Value']").first().fill("fung");
await addButtons.nth(1).click(); // Price
const priceInput = page.locator("#root input[placeholder='Value']").nth(1);
await priceInput.fill("30");
// Check two status options (Status field rows: All + 3 options)
const statusBox = page.getByText("Active", { exact: true });
await statusBox.click();
await page.getByText("Archived", { exact: true }).click();
await page.waitForTimeout(400);
await page.screenshot({ path: "/tmp/qb-filled.png", fullPage: true });
const preview = await page.locator("pre").textContent();
console.log("PREVIEW:", preview);
await browser.close();
await server.close();
