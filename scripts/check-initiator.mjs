import { chromium } from "playwright";

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 412, height: 823 } });
const page = await context.newPage();
const cdp = await context.newCDPSession(page);
await cdp.send("Network.enable");

cdp.on("Network.requestWillBeSent", (e) => {
  if (e.request.url.includes("three-") || e.request.url.includes("LensHero")) {
    console.log("REQUEST:", e.request.url);
    console.log("full initiator:", JSON.stringify(e.initiator, null, 2));
    console.log("---");
  }
});

await page.goto(process.env.SITE_URL ?? "http://localhost:4175/PLACEHOLDER_REPO/", {
  waitUntil: "networkidle",
});
await page.waitForTimeout(1000);

await browser.close();
