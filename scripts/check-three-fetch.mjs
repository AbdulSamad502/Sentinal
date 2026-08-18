/** Ground-truth check: does the three.js chunk get requested at mobile width? */
import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 412, height: 823 } });

const threeRequests = [];
page.on("request", (req) => {
  if (req.url().includes("three-")) threeRequests.push(req.url());
});

await page.goto(process.env.SITE_URL ?? "http://localhost:4175/PLACEHOLDER_REPO/", {
  waitUntil: "networkidle",
});
await page.waitForTimeout(2000);

const canvasCount = await page.evaluate(() => document.querySelectorAll("canvas").length);

console.log("three.js requests:", threeRequests.length, threeRequests);
console.log("canvas elements:", canvasCount);

await browser.close();
