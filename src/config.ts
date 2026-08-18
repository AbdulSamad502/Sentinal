/**
 * Every unknown in this site lives here.
 *
 * When the Sentinel repository goes public, edit THIS FILE ONLY -- nothing else
 * in the codebase hardcodes an owner, a repo name, a version, a filename, or a
 * download URL. See README.md for the checklist.
 */
export const config = {
  /** GitHub account or org that owns the Sentinel code repo. */
  githubOwner: "PLACEHOLDER_OWNER",

  /**
   * Repo name. This is also used as the Vite `base` path, because GitHub Pages
   * project sites are served from /<repo>/. Changing it here changes both.
   */
  githubRepo: "PLACEHOLDER_REPO",

  /** Full URL to the repo. Keep in sync with the two values above. */
  repoUrl: "https://github.com/PLACEHOLDER_OWNER/PLACEHOLDER_REPO",

  /**
   * Demo video (<=5 min). Empty string renders the designed placeholder.
   * Accepts a YouTube embed URL, a Vimeo embed URL, or a direct .mp4 path.
   */
  demoVideoUrl: "",

  /**
   * Architecture diagram. Empty string renders the designed placeholder.
   * Accepts any image URL or a path under /public.
   */
  architectureDiagram: "",
} as const;

/** Releases page, used as the fallback link whenever the API cannot be reached. */
export const releasesUrl = `${config.repoUrl}/releases`;

/** True while the placeholders above are untouched. */
export const isPlaceholderRepo =
  config.githubOwner === "PLACEHOLDER_OWNER" ||
  config.githubRepo === "PLACEHOLDER_REPO";
