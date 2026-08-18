import { useEffect, useState } from "react";
import type { Platform } from "./releases";

interface UserAgentData {
  platform?: string;
}

/**
 * Best-effort guess at the visitor's OS, used only to decide which installer is
 * the primary CTA. Both installers are always shown, so a wrong guess costs the
 * visitor one extra glance and nothing more.
 *
 * Returns null on Linux, mobile, or anything unrecognised -- the download
 * section treats null as "no strong preference" and presents both equally.
 */
export function useOS(): Platform | null {
  const [platform, setPlatform] = useState<Platform | null>(null);

  useEffect(() => {
    // Checked as separate, prioritised sources rather than one blended
    // string: navigator.platform is deprecated and can go stale independently
    // of userAgent (it did in testing), so whichever source answers first
    // must win outright instead of being merged with a weaker one.
    const sources = [
      (navigator as Navigator & { userAgentData?: UserAgentData }).userAgentData
        ?.platform,
      navigator.platform,
      navigator.userAgent,
    ];

    for (const source of sources) {
      if (!source) continue;
      const lower = source.toLowerCase();

      // iPhones and iPads are macOS-adjacent but cannot run a .dmg, so they
      // are deliberately excluded rather than folded into "macos".
      if (/iphone|ipad|ipod|android/.test(lower)) {
        setPlatform(null);
        return;
      }
      if (/win/.test(lower)) {
        setPlatform("windows");
        return;
      }
      if (/mac/.test(lower)) {
        setPlatform("macos");
        return;
      }
    }

    setPlatform(null);
  }, []);

  return platform;
}
