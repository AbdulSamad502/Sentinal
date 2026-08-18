/** Viewport-sized screenshots of each anchor section, for readable review. */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const outDir = process.argv[2] ?? "shots";
const width = Number(process.argv[3] ?? 1280);
const height = Number(process.argv[4] ?? 900);
const theme = process.argv[5] ?? "dark";
await mkdir(outDir, { recursive: true });

const sections = [
  "top",
  "what-it-is",
  "problem",
  "purpose",
  "features",
  "principles",
  "runtime",
  "install",
  "download",
  "demo",
];

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width, height },
  colorScheme: theme,
});
const page = await context.newPage();
await page.goto(process.env.SITE_URL ?? "http://localhost:5173", {
  waitUntil: "networkidle",
});
await page.waitForTimeout(600);

for (const id of sections) {
  await page.evaluate((sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ block: "start" });
  }, id);
  await page.waitForTimeout(650);
  await page.screenshot({ path: `${outDir}/sec-${id}-${width}-${theme}.png` });
}

await browser.close();
console.log(`captured ${sections.length} sections into ${outDir}/`);
