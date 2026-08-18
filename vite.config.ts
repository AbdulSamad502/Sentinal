import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { config } from "./src/config";

// GitHub Pages project pages are served from https://<owner>.github.io/<repo>/,
// so every asset URL needs the repo name as a prefix. `base` is derived from
// src/config.ts so there is exactly one place to edit when the repo is named.
//
// If you move the site to a custom domain (or to <owner>.github.io), the site
// is served from the domain root instead -- set BASE to "/" below by setting
// the SENTINEL_BASE env var at build time, or edit this line.
const base = process.env.SENTINEL_BASE ?? `/${config.githubRepo}/`;

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  build: {
    // No custom manualChunks here, on purpose: an earlier version of this
    // config grouped every "three"/"@react-three" module into one named
    // chunk by substring match. That accidentally defeated Vite's own
    // dynamic-import code-splitting -- Rollup ended up emitting a *static*
    // `import ... from "./three-*.js"` at the top of the main entry chunk,
    // so three.js (~900 KB) was fetched on every page load, including
    // mobile, regardless of the runtime gate in Hero.tsx that's supposed to
    // keep it desktop-and-motion-allowed only. Vite's default behaviour
    // already isolates a dynamically-imported module (and whatever only it
    // depends on) into its own chunk correctly -- that default is what
    // actually keeps three.js out of the critical path; do not reintroduce
    // manual grouping without re-verifying with scripts/check-three-fetch.mjs
    // that the chunk is NOT fetched at a mobile viewport width.
  },
});
