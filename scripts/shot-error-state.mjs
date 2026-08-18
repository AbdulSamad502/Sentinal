/**
 * Verifies the download section's offline/error degradation: the brief's
 * checklist item "kill the network and confirm the download area degrades
 * gracefully." Simulates this by making the releases request fail outright,
 * which is what a real network drop looks like to fetch().
 */
import { chromium } from "playwright";

const outDir = process.argv[2] ?? process.env.SHOTS_DIR ?? "shots";
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();

await page.route("https://api.github.com/repos/**/releases/latest", (route) =>
  route.abort("internetdisconnected"),
);

const consoleErrors = [];
page.on("console", (m) => {
  if (m.type() === "error") consoleErrors.push(m.text());
});
page.on("pageerror", (e) => consoleErrors.push(String(e)));

await page.goto(process.env.SITE_URL ?? "http://localhost:5173", {
  waitUntil: "networkidle",
});
await page.evaluate(() => document.getElementById("download")?.scrollIntoView());
await page.waitForTimeout(1500);
await page.screenshot({ path: `${outDir}/error-state-offline.png` });

console.log(`console errors: ${consoleErrors.length}`);
for (const e of consoleErrors) console.log(`  - ${e}`);

await browser.close();
console.log(`captured into ${outDir}/`);
