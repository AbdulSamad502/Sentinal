/**
 * Rasterises scripts/og-card.svg to public/og.png (1200x630).
 *
 * Run with `npm run og` after editing the SVG. The PNG is committed, so this
 * does not run during the normal build -- link previews must work without a
 * build step having succeeded.
 */
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import sharp from "sharp";

const here = dirname(fileURLToPath(import.meta.url));
const svg = await readFile(join(here, "og-card.svg"));

const png = await sharp(svg, { density: 144 })
  .resize(1200, 630, { fit: "fill" })
  .png({ compressionLevel: 9 })
  .toBuffer();

await writeFile(join(here, "..", "public", "og.png"), png);
console.log(`public/og.png written (${(png.length / 1024).toFixed(1)} KB)`);
