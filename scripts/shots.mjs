/**
 * Visual + layout verification pass.
 *
 * Walks the checklist the site has to hold: both themes, four widths, and
 * reduced motion on and off. Reports horizontal overflow (the page body must
 * never scroll sideways) and whether the WebGL hero mounted where it should.
 *
 * Usage: npm run dev, then `node scripts/shots.mjs [outDir]`
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const URL = process.env.SITE_URL ?? "http://localhost:5173";
const outDir = process.argv[2] ?? "shots";
await mkdir(outDir, { recursive: true });

const widths = [
  { name: "320", width: 320, height: 900 },
  { name: "768", width: 768, height: 1000 },
  { name: "1280", width: 1280, height: 900 },
  { name: "1920", width: 1920, height: 1000 },
];

const browser = await chromium.launch();
const problems = [];

for (const theme of ["light", "dark"]) {
  for (const motion of ["no-preference", "reduce"]) {
    for (const size of widths) {
      // The full matrix is 16 runs; only screenshot the informative ones.
      const capture = motion === "no-preference" || size.name === "1280";

      const context = await browser.newContext({
        viewport: { width: size.width, height: size.height },
        colorScheme: theme,
        reducedMotion: motion,
        deviceScaleFactor: 1,
      });
      const page = await context.newPage();

      const consoleErrors = [];
      page.on("console", (m) => {
        if (m.type() === "error") consoleErrors.push(m.text());
      });
      page.on("pageerror", (e) => consoleErrors.push(String(e)));

      await page.goto(URL, { waitUntil: "networkidle" });
      // Give lazy sections and the WebGL chunk a moment to settle.
      await page.waitForTimeout(motion === "reduce" ? 400 : 1400);

      // Scroll the whole page so every whileInView reveal has fired before the
      // capture -- otherwise a full-page screenshot catches them at opacity 0.
      await page.evaluate(async () => {
        const step = window.innerHeight * 0.8;
        for (let y = 0; y < document.body.scrollHeight; y += step) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 90));
        }
        window.scrollTo(0, 0);
        await new Promise((r) => setTimeout(r, 250));
      });

      const metrics = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        canvases: document.querySelectorAll("canvas").length,
        theme: document.documentElement.getAttribute("data-theme"),
      }));

      const label = `${theme}-${motion}-${size.name}`;

      if (metrics.scrollWidth > metrics.clientWidth + 1) {
        problems.push(
          `${label}: horizontal overflow (${metrics.scrollWidth} > ${metrics.clientWidth})`,
        );
      }

      const shouldHaveCanvas = motion === "no-preference" && size.width >= 768;
      if (shouldHaveCanvas && metrics.canvases === 0) {
        problems.push(`${label}: expected the WebGL hero, found no canvas`);
      }
      if (!shouldHaveCanvas && metrics.canvases > 0) {
        problems.push(`${label}: WebGL hero mounted when it should not have`);
      }
      for (const error of consoleErrors) {
        problems.push(`${label}: console error -- ${error}`);
      }

      if (capture) {
        await page.screenshot({
          path: `${outDir}/${label}.png`,
          fullPage: true,
        });
      }

      await context.close();
    }
  }
}

await browser.close();

if (problems.length) {
  console.error(`\n${problems.length} problem(s):`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exitCode = 1;
} else {
  console.log("\nNo overflow, no console errors, hero gating correct.");
}
console.log(`Screenshots in ${outDir}/`);
