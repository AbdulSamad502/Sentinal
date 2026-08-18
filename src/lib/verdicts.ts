/**
 * The four-rung verdict ladder. This is the spine of the product and the spine
 * of this site's visual language.
 *
 * Every verdict carries a label and a shape alongside its colour, because
 * status must never be conveyed by colour alone.
 */

export type VerdictKey = "safe" | "review" | "conditional" | "stop";

export interface Verdict {
  key: VerdictKey;
  label: string;
  meaning: string;
  /**
   * Text/icon colour, resolved from the *-text CSS custom properties. These
   * are darkened variants of the product's fixed swatch colours -- in light
   * mode, three of the four swatch colours (REVIEW worst, at 3.56:1) fall
   * short of WCAG AA's 4.5:1 for text against their own wash background. The
   * swatch identity is unchanged; only the shade used for actual text/icon
   * fill is adjusted. See src/index.css for the values and the contrast math.
   */
  color: string;
  wash: string;
}

export const verdicts: Verdict[] = [
  {
    key: "safe",
    label: "SAFE",
    meaning: "Nothing flagged, everything checked, ship it.",
    color: "text-safe-text",
    wash: "bg-safe-wash",
  },
  {
    key: "review",
    label: "REVIEW",
    meaning: "A human should look at this before it merges.",
    color: "text-review-text",
    wash: "bg-review-wash",
  },
  {
    key: "conditional",
    label: "CONDITIONAL",
    meaning: "Shippable once stated conditions are satisfied.",
    color: "text-conditional-text",
    wash: "bg-conditional-wash",
  },
  {
    key: "stop",
    label: "STOP",
    meaning: "Do not ship this as it stands.",
    color: "text-stop-text",
    wash: "bg-stop-wash",
  },
];

export const verdictByKey = Object.fromEntries(
  verdicts.map((v) => [v.key, v]),
) as Record<VerdictKey, Verdict>;

/** Hex values, needed by the WebGL hero where Tailwind classes do not reach. */
export const verdictHex: Record<VerdictKey, { light: string; dark: string }> = {
  safe: { light: "#2E7D5B", dark: "#6BC49A" },
  review: { light: "#A6720C", dark: "#E0A93C" },
  conditional: { light: "#B4571C", dark: "#EE9152" },
  stop: { light: "#A83228", dark: "#F07F72" },
};
