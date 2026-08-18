import { verdictByKey, type VerdictKey } from "../lib/verdicts";
import { VerdictMark } from "./VerdictMark";

/**
 * The verdict as it appears in the product: shape, label, colour. Never colour
 * on its own.
 */
export function VerdictBadge({
  verdict,
  size = "md",
}: {
  verdict: VerdictKey;
  size?: "sm" | "md";
}) {
  const v = verdictByKey[verdict];
  const scale =
    size === "sm"
      ? "text-[0.6875rem] gap-1.5 px-2 py-0.5"
      : "text-xs gap-2 px-2.5 py-1";

  return (
    <span
      className={`inline-flex items-center rounded-full font-mono font-medium tracking-wider ${scale} ${v.color} ${v.wash}`}
    >
      <VerdictMark
        verdict={verdict}
        className={size === "sm" ? "h-2 w-2" : "h-2.5 w-2.5"}
      />
      {v.label}
    </span>
  );
}
