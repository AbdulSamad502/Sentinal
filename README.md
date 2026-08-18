# Sentinel — launch site

The public marketing site for Sentinel, a supervisory agent for AI coding
agents. React, Vite, TypeScript, Tailwind, `react-three-fiber` for the hero,
Framer Motion for everything else. Deployed to GitHub Pages.

## Running locally

```bash
npm install
npm run dev
```

## Building

```bash
npm run build   # type-checks, then builds to dist/
npm run preview # serve the production build locally
```

## Once the Sentinel repository is public

Everything unknown about the code repo lives in one file:
[`src/config.ts`](src/config.ts). Nothing else in the codebase hardcodes an
owner, a repo name, a version, a filename, or a download URL — the download
section reads all of that from the GitHub Releases API at runtime.

Fill in exactly these four values:

| Value | What to put there |
| --- | --- |
| `githubOwner` | The GitHub account or org that owns the Sentinel code repo |
| `githubRepo` | The repo name. This also sets the Vite `base` path (`/{repo}/`), since GitHub Pages project sites are served from that path |
| `repoUrl` | `https://github.com/<owner>/<repo>` — keep in sync with the two values above |
| `demoVideoUrl` | A YouTube/Vimeo embed URL or a direct `.mp4` path, once the demo exists. Leave empty to keep showing the designed placeholder |
| `architectureDiagram` | An image URL or a path under `public/`, once the diagram exists. Leave empty to keep showing the designed placeholder |

Nothing else needs to change. The GitHub Actions workflow at
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds and
publishes to Pages on every push to `main` — no secrets required, since the
site only ever makes unauthenticated GitHub API requests.

If the site later moves to a custom domain (or `<owner>.github.io` itself),
it's served from the root instead of `/<repo>/`. Override `base` in
[`vite.config.ts`](vite.config.ts) by setting `SENTINEL_BASE=/` at build time,
or edit the fallback there directly.

## Regenerating the Open Graph image

The card at `public/og.png` is rendered from `scripts/og-card.svg`. Edit the
SVG, then:

```bash
npm run og
```

## Verification scripts

Written for this project, not part of the normal build:

- `node scripts/shots.mjs [outDir]` — full-page screenshots across both
  themes, four widths, and `prefers-reduced-motion` on/off. Fails (non-zero
  exit) on any horizontal overflow, a console error, or the WebGL hero
  mounting/not-mounting where it shouldn't.
- `node scripts/shot-hero.mjs [outDir] [anchor]` — viewport screenshots of the
  hero alone, both themes, for reviewing the WebGL scene directly.
- `node scripts/shot-sections.mjs [outDir] [width] [height] [theme]` —
  viewport screenshots of every anchor section.
- `node scripts/find-overflow.mjs [width]` — lists any element causing
  horizontal overflow at a given viewport width (ignores content that is
  correctly inside its own `overflow-x` container).
- `node scripts/check-keyboard.mjs` — tabs through the whole page and reports
  any stop with no visible focus indicator, or a stuck focus loop.
- `node scripts/check-contrast.mjs` — the verdict/accent palette's WCAG
  contrast math in isolation (no browser needed).
- `node scripts/check-verdict-contrast-live.mjs` — the same check against the
  actual rendered DOM and CSS custom properties, both themes. Re-run this
  after touching any colour token in `src/index.css`.
- `node scripts/shot-ready-state.mjs [outDir]` and
  `node scripts/shot-error-state.mjs [outDir]` — exercise the download
  section's "ready" and "offline" states with a mocked/aborted Releases API
  response, since a real un-launched repo can't produce either. **Both
  require `src/config.ts` to be off its placeholder values first** (the app
  skips the network call entirely while `isPlaceholderRepo` is true) — flip
  `githubOwner`/`githubRepo` to any non-placeholder string, run the script,
  then put the placeholders back.

All of them expect `npm run dev` running at `http://localhost:5173` (override
with the `SITE_URL` env var).
