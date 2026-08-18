import type { VerdictKey } from "../lib/verdicts";

/**
 * The file stream shown in the hero: a plausible run over this very site's
 * repository. Real paths, real verdicts, real reasons -- nothing invented to
 * look impressive, and nothing claiming a check that Sentinel does not make.
 */
export interface StreamRow {
  path: string;
  verdict: VerdictKey;
  reason: string;
}

export const streamRows: StreamRow[] = [
  { path: "src/config.ts", verdict: "safe", reason: "declared scope, tests unaffected" },
  { path: "src/lib/releases.ts", verdict: "safe", reason: "declared scope" },
  { path: "src/components/Nav.tsx", verdict: "safe", reason: "declared scope" },
  { path: ".env.local", verdict: "stop", reason: "deny-listed path" },
  { path: "src/lib/useTheme.ts", verdict: "safe", reason: "declared scope" },
  { path: "package-lock.json", verdict: "review", reason: "dependency change, 3 packages added" },
  { path: ".github/workflows/deploy.yml", verdict: "review", reason: "CI configuration touched" },
  { path: "src/index.css", verdict: "safe", reason: "declared scope" },
  { path: "scripts/release.sh", verdict: "conditional", reason: "large diff, no test touched" },
  { path: "src/three/LensHero.tsx", verdict: "safe", reason: "declared scope" },
  { path: "README.md", verdict: "safe", reason: "documentation only" },
  { path: "src/lib/verdicts.ts", verdict: "safe", reason: "declared scope" },
];
