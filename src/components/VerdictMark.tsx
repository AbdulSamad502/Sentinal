import type { VerdictKey } from "../lib/verdicts";

/**
 * A distinct shape per verdict. Status is never carried by colour alone, so
 * every place a verdict colour appears, this shape appears with it -- which
 * also means the ladder still reads correctly in greyscale.
 */
export function VerdictMark({
  verdict,
  className = "",
}: {
  verdict: VerdictKey;
  className?: string;
}) {
  const shapes: Record<VerdictKey, React.ReactNode> = {
    // Circle: closed, complete.
    safe: <circle cx="8" cy="8" r="6" />,
    // Triangle: look here.
    review: <path d="M8 1.5 L15 14.5 L1 14.5 Z" />,
    // Diamond: conditional, balanced on a point.
    conditional: <path d="M8 1 L15 8 L8 15 L1 8 Z" />,
    // Square: hard edges, stop. An octagon reads as a circle at this size --
    // straight parallel sides are what actually stays distinct from SAFE's
    // circle down to a few pixels.
    stop: <rect x="2" y="2" width="12" height="12" rx="1.5" />,
  };

  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      focusable="false"
      className={className}
      fill="currentColor"
    >
      {shapes[verdict]}
    </svg>
  );
}
