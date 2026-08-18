/**
 * Verifies the "ready" download state by mocking the GitHub Releases API
 * response before the page's own fetch runs -- more reliable than depending
 * on a real public repo happening to ship .exe/.dmg assets with the naming
 * this site expects.
 */
import { chromium } from "playwright";

const outDir = process.argv[2] ?? process.env.SHOTS_DIR ?? "shots";
const browser = await chromium.launch();

const mockRelease = {
  tag_name: "v0.3.1",
  published_at: "2026-08-01T10:00:00Z",
  draft: false,
  prerelease: false,
  assets: [
    {
      name: "Sentinel-0.3.1-setup.exe",
      size: 84_500_000,
      download_count: 412,
      browser_download_url: "https://example-releases.test/Sentinel-0.3.1-setup.exe",
    },
    {
      name: "Sentinel-0.3.1.dmg",
      size: 91_200_000,
      download_count: 205,
      browser_download_url: "https://example-releases.test/Sentinel-0.3.1.dmg",
    },
  ],
};

for (const [theme, os] of [
  ["dark", "Windows"],
  ["light", "Macintosh"],
]) {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    colorScheme: theme,
    userAgent:
      os === "Windows"
        ? "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        : "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15",
  });
  const page = await context.newPage();

  // Playwright's `userAgent` context option only spoofs navigator.userAgent --
  // navigator.platform and navigator.userAgentData keep reporting the real
  // host OS unless overridden separately. useOS() reads all three, so a
  // faithful test has to stub them all or it silently tests the host OS
  // instead of the one it claims to.
  const platformString = os === "Windows" ? "Win32" : "MacIntel";
  const uaDataPlatform = os === "Windows" ? "Windows" : "macOS";
  await page.addInitScript(
    ([platformValue, uaDataValue]) => {
      Object.defineProperty(window.navigator, "platform", {
        get: () => platformValue,
      });
      Object.defineProperty(window.navigator, "userAgentData", {
        get: () => ({ platform: uaDataValue }),
      });
    },
    [platformString, uaDataPlatform],
  );

  await page.route("https://api.github.com/repos/**/releases/latest", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(mockRelease) }),
  );

  await page.goto(process.env.SITE_URL ?? "http://localhost:5173", {
    waitUntil: "networkidle",
  });
  await page.evaluate(() => document.getElementById("download")?.scrollIntoView());
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${outDir}/ready-${theme}-${os}.png` });
  await context.close();
}

await browser.close();
console.log(`captured into ${outDir}/`);
