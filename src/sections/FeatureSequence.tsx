import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { features, featureSequenceVerdict, type Feature } from "../content";
import { VerdictMark } from "../components/VerdictMark";
import { verdictByKey } from "../lib/verdicts";

const FEATURE_COUNT = features.length;
const resolvedVerdict = verdictByKey[featureSequenceVerdict.verdict];

/**
 * useTransform's input range must stay inside [0, 1] and non-decreasing, or
 * it throws and takes down the entire render (there's no error boundary
 * above this, so that crash was silently eating the whole page, hero
 * included). Padding a band's edges past 0 or 1 -- which every first/last
 * feature and the verdict threshold near 0.92 do -- needs this clamp.
 */
function clamp01(values: number[]): number[] {
  return values.map((v) => Math.min(1, Math.max(0, v)));
}

/**
 * The signature scroll-driven moment: the brief's own idea #3, a change's
 * risk signals accumulating as you scroll, resolving into one verdict at
 * the end.
 *
 * Only ever rendered on desktop with motion allowed -- Features.tsx decides
 * that, the same way Hero.tsx gates the WebGL scene. Under reduced motion
 * or on a narrow screen, Features.tsx renders the plain numbered list
 * instead, which is a complete section on its own, not a lesser version of
 * this one -- so this component does not need its own static/fallback mode.
 *
 * The six signals are one coherent example session (see content.ts), not
 * six unrelated illustrations, so the panel reads as a real run rather than
 * a slideshow of unconnected facts.
 *
 * Built entirely on native `position: sticky` and scroll-linked motion
 * values -- nothing intercepts the wheel or touch input, and nothing here
 * is "scroll-jacking": the reader's scroll always moves the page at its own
 * native speed, this just changes what's visible while it does.
 *
 * All sub-components are defined at module scope, not nested inside this
 * one -- a component defined inside another component's body is a new
 * function identity on every render, which makes React remount it (and
 * lose its Framer Motion animation state) instead of updating it in place.
 */
export function FeatureSequence() {
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={trackRef} className="grid gap-x-12 lg:grid-cols-[minmax(0,22rem)_1fr]">
      <div className="sticky top-24 hidden self-start lg:block">
        <SignalPanel scrollYProgress={scrollYProgress} />
      </div>

      <ol className="space-y-0">
        {features.map((feature, index) => (
          <FeatureBlock
            key={feature.id}
            feature={feature}
            index={index}
            scrollYProgress={scrollYProgress}
            bandStart={index / FEATURE_COUNT}
            bandEnd={(index + 1) / FEATURE_COUNT}
          />
        ))}
      </ol>
    </div>
  );
}

function FeatureBlock({
  feature,
  index,
  scrollYProgress,
  bandStart,
  bandEnd,
}: {
  feature: Feature;
  index: number;
  scrollYProgress: MotionValue<number>;
  bandStart: number;
  bandEnd: number;
}) {
  const mid = (bandStart + bandEnd) / 2;
  const opacity = useTransform(
    scrollYProgress,
    [bandStart - 0.06, mid - 0.08, mid + 0.14, bandEnd + 0.06],
    [0.4, 1, 1, 0.4],
  );

  return (
    <li className="flex min-h-[58vh] flex-col justify-center border-t border-rule py-10 first:border-t-0">
      <motion.div style={{ opacity }} className="grid gap-x-8 gap-y-4 sm:grid-cols-[auto_1fr]">
        <div className="flex items-baseline gap-4 sm:w-56 sm:flex-col sm:gap-2">
          <span className="font-mono text-xs text-ink-soft tabular-nums">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="text-xl font-semibold tracking-tight">{feature.name}</h3>
        </div>

        <div className="min-w-0">
          <p className="text-lg text-ink text-pretty">{feature.summary}</p>
          <p className="mt-3 leading-relaxed text-ink-soft text-pretty">{feature.body}</p>
          <div className="mt-5 overflow-x-auto rounded-md border border-rule bg-surface-sunk px-3.5 py-2.5">
            <code className="font-mono text-xs whitespace-pre text-ink-soft">
              {feature.detail}
            </code>
          </div>
        </div>
      </motion.div>
    </li>
  );
}

function SignalPanel({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  return (
    <div className="rounded-xl border border-rule bg-surface p-6 shadow-[var(--shadow-card)]">
      <p className="mb-1 font-mono text-xs tracking-[0.16em] text-ink-soft uppercase">
        One example session
      </p>
      <p className="mb-6 text-sm text-ink-soft">Six checks, one real change, as it happened.</p>

      <ul className="space-y-3">
        {features.map((feature, index) => (
          <SignalRow
            key={feature.id}
            signal={feature.signal}
            scrollYProgress={scrollYProgress}
            threshold={(index + 0.35) / FEATURE_COUNT}
          />
        ))}
      </ul>

      <VerdictReveal scrollYProgress={scrollYProgress} />
    </div>
  );
}

function SignalRow({
  signal,
  scrollYProgress,
  threshold,
}: {
  signal: string;
  scrollYProgress: MotionValue<number>;
  threshold: number;
}) {
  const opacity = useTransform(scrollYProgress, [threshold - 0.03, threshold + 0.03], [0, 1]);
  const x = useTransform(scrollYProgress, [threshold - 0.03, threshold + 0.03], [-8, 0]);

  return (
    <motion.li style={{ opacity, x }} className="flex gap-2.5 text-sm">
      <span aria-hidden="true" className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ink-soft" />
      <span className="text-ink-soft">{signal}</span>
    </motion.li>
  );
}

function VerdictReveal({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const threshold = 0.92;
  const opacity = useTransform(scrollYProgress, [threshold - 0.05, threshold + 0.03], [0, 1]);
  const scale = useTransform(scrollYProgress, [threshold - 0.05, threshold + 0.03], [0.96, 1]);

  return (
    <div className="mt-6 border-t border-rule pt-5">
      <motion.div style={{ opacity, scale }}>
        <div
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-sm font-medium tracking-wider ${resolvedVerdict.color} ${resolvedVerdict.wash}`}
        >
          <VerdictMark verdict={resolvedVerdict.key} className="h-3 w-3" />
          {resolvedVerdict.label}
        </div>
        <p className="mt-3 text-sm text-ink-soft">{featureSequenceVerdict.reason}</p>
      </motion.div>
    </div>
  );
}
