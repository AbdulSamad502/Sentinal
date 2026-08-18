/** Diagnostic: lists elements wider than the viewport at a given width. */
import { chromium } from "playwright";

const width = Number(process.argv[2] ?? 320);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height: 900 } });
await page.goto(process.env.SITE_URL ?? "http://localhost:5173", {
  waitUntil: "networkidle",
});

const offenders = await page.evaluate((vw) => {
  const out = [];

  // Content inside a scroll container is allowed to be wider than the viewport
  // -- that is the whole point of the container. Only unscrolled overflow is a
  // real problem.
  const inScroller = (el) => {
    for (let node = el.parentElement; node; node = node.parentElement) {
      const overflowX = getComputedStyle(node).overflowX;
      if (overflowX === "auto" || overflowX === "scroll" || overflowX === "hidden") {
        return true;
      }
    }
    return false;
  };

  for (const el of document.querySelectorAll("*")) {
    if (inScroller(el)) continue;
    const rect = el.getBoundingClientRect();
    if (rect.right > vw + 1 || rect.left < -1) {
      out.push({
        tag: el.tagName.toLowerCase(),
        cls: (el.getAttribute("class") ?? "").slice(0, 90),
        left: Math.round(rect.left),
        right: Math.round(rect.right),
        text: (el.textContent ?? "").trim().slice(0, 50),
      });
    }
  }
  // Only the outermost offenders matter; children inherit the problem.
  return out.slice(0, 15);
}, width);

console.log(JSON.stringify(offenders, null, 2));
await browser.close();
