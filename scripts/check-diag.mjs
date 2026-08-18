import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 412, height: 823 } });
page.on("console", (m) => console.log("CONSOLE:", m.text()));

await page.goto(process.env.SITE_URL ?? "http://localhost:4175/PLACEHOLDER_REPO/", {
  waitUntil: "networkidle",
});
await page.waitForTimeout(1000);

await browser.close();
