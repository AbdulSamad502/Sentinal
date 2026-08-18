/** Captures the hero at viewport size, both themes, motion enabled. */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const outDir = process.argv[2] ?? "shots";
const anchor = process.argv[3] ?? "";
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();

for (const theme of ["light", "dark"]) {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    colorScheme: theme,
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  await page.goto(`${process.env.SITE_URL ?? "http://localhost:5173"}${anchor}`, {
    waitUntil: "networkidle",
  });
  await page.waitForTimeout(2200);
  const name = anchor ? anchor.replace("#", "") : "hero";
  await page.screenshot({ path: `${outDir}/${name}-${theme}.png` });
  await context.close();
}

await browser.close();
console.log(`captured into ${outDir}/`);
