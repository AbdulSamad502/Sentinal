import { config, isPlaceholderRepo } from "../config";

/**
 * Fetches the latest release from the GitHub API and picks out the installers
 * by file extension.
 *
 * Nothing here is hardcoded: version, filename, size and URL all come from the
 * API response, so publishing a new release on the code repo updates this site
 * with no code change and no redeploy.
 *
 * Unauthenticated requests only -- this is a public static site, so a token
 * would be readable by anyone. That caps us at 60 requests/hour/IP, hence the
 * sessionStorage cache below.
 */

export type Platform = "windows" | "macos";

export interface Installer {
  platform: Platform;
  /** Asset filename exactly as published, e.g. "Sentinel-0.1.0-setup.exe". */
  name: string;
  url: string;
  /** Bytes, straight from the API. Format with formatBytes for display. */
  size: number;
  downloadCount: number;
}

export interface ReleaseInfo {
  /** Release tag, shown as the version. Not parsed or reformatted. */
  version: string;
  publishedAt: string;
  installers: Installer[];
}

export type ReleaseState =
  | { status: "loading" }
  /** A release exists and at least one installer asset was found. */
  | { status: "ready"; release: ReleaseInfo }
  /** No release yet, or a release with no .exe/.dmg. The expected early state. */
  | { status: "no-release" }
  /** Network failure, rate limit, or anything else. Falls back to a repo link. */
  | { status: "error"; reason: string };

const CACHE_KEY = "sentinel:latest-release";
const CACHE_TTL_MS = 10 * 60 * 1000;
const FETCH_TIMEOUT_MS = 8000;

interface GitHubAsset {
  name: string;
  size: number;
  download_count: number;
  browser_download_url: string;
}

interface GitHubRelease {
  tag_name: string;
  published_at: string;
  draft: boolean;
  prerelease: boolean;
  assets: GitHubAsset[];
}

/** Maps an asset to a platform by extension, or null if it is not an installer. */
function platformFor(assetName: string): Platform | null {
  const lower = assetName.toLowerCase();
  if (lower.endsWith(".exe")) return "windows";
  if (lower.endsWith(".dmg")) return "macos";
  return null;
}

function toReleaseInfo(release: GitHubRelease): ReleaseInfo {
  const installers: Installer[] = [];

  for (const asset of release.assets ?? []) {
    const platform = platformFor(asset.name);
    if (!platform) continue;
    // If a release ships several builds for one platform, keep the first.
    if (installers.some((i) => i.platform === platform)) continue;

    installers.push({
      platform,
      name: asset.name,
      url: asset.browser_download_url,
      size: asset.size,
      downloadCount: asset.download_count,
    });
  }

  return {
    version: release.tag_name,
    publishedAt: release.published_at,
    installers,
  };
}

function readCache(): ReleaseState | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { at, state } = JSON.parse(raw) as { at: number; state: ReleaseState };
    if (Date.now() - at > CACHE_TTL_MS) return null;
    return state;
  } catch {
    // Private browsing, disabled storage, or corrupt entry. Not worth failing over.
    return null;
  }
}

function writeCache(state: ReleaseState) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), state }));
  } catch {
    /* storage unavailable -- caching is an optimisation, not a requirement */
  }
}

export async function fetchLatestRelease(): Promise<ReleaseState> {
  // Before the repo is public there is nothing to ask about. Skip the request
  // entirely rather than burning a rate-limit slot on a guaranteed 404.
  if (isPlaceholderRepo) return { status: "no-release" };

  const cached = readCache();
  if (cached) return cached;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(
      `https://api.github.com/repos/${config.githubOwner}/${config.githubRepo}/releases/latest`,
      {
        headers: { Accept: "application/vnd.github+json" },
        signal: controller.signal,
      },
    );

    // 404 means the repo is private, or has no published release yet. Both are
    // "no release", not an error -- the empty state is the correct response.
    if (response.status === 404) {
      const state: ReleaseState = { status: "no-release" };
      writeCache(state);
      return state;
    }

    if (response.status === 403 || response.status === 429) {
      return { status: "error", reason: "rate-limited" };
    }

    if (!response.ok) {
      return { status: "error", reason: `HTTP ${response.status}` };
    }

    const release = (await response.json()) as GitHubRelease;
    const info = toReleaseInfo(release);

    const state: ReleaseState =
      info.installers.length > 0
        ? { status: "ready", release: info }
        : { status: "no-release" };

    writeCache(state);
    return state;
  } catch (error) {
    const reason =
      error instanceof DOMException && error.name === "AbortError"
        ? "timed out"
        : "offline";
    return { status: "error", reason };
  } finally {
    clearTimeout(timer);
  }
}

/** 12345678 -> "11.8 MB". Binary units, one decimal, matching what installers report. */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toFixed(1)} ${units[unit]}`;
}

export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export const platformLabel: Record<Platform, string> = {
  windows: "Windows",
  macos: "macOS",
};
