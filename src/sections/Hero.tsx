import { lazy, Suspense } from "react";
import { useReducedMotion } from "framer-motion";
import { useMediaQuery } from "../lib/useMediaQuery";
import { useThemeContext } from "../lib/theme";
import { Parallax } from "../components/Parallax";
import { LensHeroStatic } from "../three/LensHeroStatic";
import { config } from "../config";

/**
 * three.js is loaded only when it will actually be used -- never on mobile,
 * never under reduced motion, and always as a separate chunk so it cannot block
 * first paint.
 */
const LensHero = lazy(() => import("../three/LensHero"));

export function Hero() {
  const reduced = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { theme } = useThemeContext();

  const useWebGL = isDesktop && !reduced;

  return (
    <section id="top" className="border-b border-rule">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <div>
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-rule px-3 py-1 font-mono text-[0.6875rem] tracking-[0.16em] text-ink-soft uppercase">
            AWS Agents for Humans · Professional Agents
          </p>

          <h1 className="text-4xl leading-[1.08] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            A supervisor for the agent writing your code.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft text-pretty">
            Sentinel watches an AI coding agent while it works and answers one
            question continuously: is what this agent is doing safe, correct, and
            shippable? It does not write code. It reports.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#download"
              className="rounded-md bg-ink px-5 py-2.5 text-sm font-medium text-ground transition-opacity hover:opacity-88 active:opacity-75"
            >
              Download Sentinel
            </a>
            <a
              href={config.repoUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="rounded-md border border-rule px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent active:bg-accent-wash"
            >
              View the source
            </a>
          </div>

          <p className="mt-6 font-mono text-xs text-ink-soft">
            Apache 2.0 · Windows and macOS · runs local, on your AWS, or hosted
          </p>
        </div>

        {/* The stream. Decorative -- everything it conveys is stated in text
            above and in the verdict ladder below. A small parallax drift as
            the hero scrolls past gives it the same sense of depth as the
            scene itself, without anything moving while it's actually being
            read -- Parallax degrades to a plain div under reduced motion. */}
        <Parallax distance={28} className="relative h-[22rem] sm:h-[26rem] lg:h-[32rem]">
          {useWebGL ? (
            <Suspense fallback={<LensHeroStatic />}>
              <LensHero theme={theme} />
            </Suspense>
          ) : (
            <LensHeroStatic />
          )}
        </Parallax>
      </div>
    </section>
  );
}
