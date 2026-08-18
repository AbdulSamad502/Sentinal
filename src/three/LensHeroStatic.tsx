import { verdictByKey } from "../lib/verdicts";
import { VerdictMark } from "../components/VerdictMark";
import { streamRows } from "./streamData";

/**
 * The still version of the hero, used on mobile, under prefers-reduced-motion,
 * and as the Suspense fallback while the WebGL chunk loads.
 *
 * It is the same composition -- a stream of files caught mid-pass through the
 * lens, each tagged with its verdict -- held at one frame. It is meant to be
 * good on its own, not a degraded placeholder.
 */
export function LensHeroStatic() {
  // A window onto the stream: the rows nearest the lens, already resolved.
  const rows = streamRows.slice(0, 7);

  return (
    <div
      aria-hidden="true"
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
    >
      {/* The lens */}
      <svg
        viewBox="0 0 400 400"
        className="pointer-events-none absolute h-[min(100%,26rem)] w-[min(100%,26rem)] text-ink-soft"
        fill="none"
        stroke="currentColor"
      >
        <circle cx="200" cy="200" r="150" strokeWidth="1.5" opacity="0.5" />
        <circle cx="200" cy="200" r="168" strokeWidth="1" opacity="0.22" />
        <path
          d="M200 32v28M368 200h-28M200 368v-28M32 200h28"
          strokeWidth="1.5"
          opacity="0.45"
        />
      </svg>

      {/* The stream, receding */}
      <ul className="relative w-full max-w-md space-y-1.5 px-2">
        {rows.map((row, index) => {
          // Rows further from centre sit further back.
          const distance = Math.abs(index - 3);
          const opacity = 1 - distance * 0.17;
          const scale = 1 - distance * 0.035;
          const verdict = verdictByKey[row.verdict];

          return (
            <li
              key={row.path}
              style={{ opacity, transform: `scale(${scale})` }}
              className="flex items-center gap-2.5 rounded-md border border-rule bg-surface px-3 py-2 shadow-[var(--shadow-card)]"
            >
              <span className={`shrink-0 ${verdict.color}`}>
                <VerdictMark verdict={row.verdict} className="h-2.5 w-2.5" />
              </span>
              <code className="min-w-0 flex-1 truncate font-mono text-xs text-ink">
                {row.path}
              </code>
              <span
                className={`hidden shrink-0 font-mono text-[0.625rem] tracking-wider sm:inline ${verdict.color}`}
              >
                {verdict.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
