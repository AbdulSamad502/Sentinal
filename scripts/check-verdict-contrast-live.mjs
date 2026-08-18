/**
 * Reads the actual rendered colour of verdict badges/labels in the live page
 * (not the source hex) and computes contrast against their actual computed
 * background, for both themes. This is the real integration check --
 * confirms the CSS custom property wiring, not just the arithmetic.
 */
import { chromium } from "playwright";

function relLuminance([r, g, b]) {
  const lin = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}
function parseRgb(str) {
  const m = str.match(/[\d.]+/g);
  return [Number(m[0]), Number(m[1]), Number(m[2])];
}
function ratio(a, b) {
  const [l1, l2] = [relLuminance(a), relLuminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

const browser = await chromium.launch();

for (const theme of ["light", "dark"]) {
  const page = await browser.newPage({ colorScheme: theme });
  await page.goto(process.env.SITE_URL ?? "http://localhost:5173", {
    waitUntil: "networkidle",
  });
  await page.evaluate(() => document.getElementById("what-it-is")?.scrollIntoView());
  await page.waitForTimeout(400);

  const results = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll("ol li"));
    return rows
      .filter((r) => r.querySelector("svg"))
      .map((row) => {
        const label = row.querySelector("span > span") ?? row.querySelector("span");
        const style = getComputedStyle(label);
        // Walk up for the effective background (first non-transparent ancestor).
        let bgEl = row;
        let bg = "rgba(0, 0, 0, 0)";
        while (bgEl) {
          const c = getComputedStyle(bgEl).backgroundColor;
          if (c && !c.startsWith("rgba(0, 0, 0, 0)") && c !== "transparent") {
            bg = c;
            break;
          }
          bgEl = bgEl.parentElement;
        }
        return { text: label.textContent.trim(), color: style.color, bg };
      });
  });

  console.log(`\n-- ${theme} theme, verdict ladder --`);
  for (const r of results) {
    const ratioValue = ratio(parseRgb(r.color), parseRgb(r.bg));
    console.log(
      `  ${r.text.padEnd(14)} color=${r.color.padEnd(20)} bg=${r.bg.padEnd(20)} ratio=${ratioValue.toFixed(2)} ${ratioValue >= 4.5 ? "PASS" : "FAIL <--"}`,
    );
  }

  // Also inject a standalone VerdictBadge-shaped element for each verdict
  // wash/text pair by reading the CSS custom properties directly -- the real
  // component isn't on this page, but the tokens it resolves through are.
  const badgeResults = await page.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    const keys = ["safe", "review", "conditional", "stop"];
    return keys.map((k) => ({
      key: k,
      text: root.getPropertyValue(`--${k}-text`).trim(),
      wash: root.getPropertyValue(`--${k}-wash`).trim(),
    }));
  });

  function hexToRgb(hex) {
    const c = hex.replace("#", "");
    return [0, 2, 4].map((i) => parseInt(c.slice(i, i + 2), 16));
  }

  console.log(`\n-- ${theme} theme, badge (text token on wash token) --`);
  for (const b of badgeResults) {
    const ratioValue = ratio(hexToRgb(b.text), hexToRgb(b.wash));
    console.log(
      `  ${b.key.padEnd(14)} text=${b.text.padEnd(10)} wash=${b.wash.padEnd(10)} ratio=${ratioValue.toFixed(2)} ${ratioValue >= 4.5 ? "PASS" : "FAIL <--"}`,
    );
  }

  await page.close();
}

await browser.close();
