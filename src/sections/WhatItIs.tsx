import { Section, Reveal } from "../components/Section";
import { Parallax } from "../components/Parallax";
import { VerdictMark } from "../components/VerdictMark";
import { verdicts } from "../lib/verdicts";

export function WhatItIs() {
  return (
    <Section
      id="what-it-is"
      eyebrow="What it is"
      title="An independent, skeptical observer sitting next to your coding agent."
      lede={
        <>
          Sentinel watches Claude Code, Cursor, or Copilot Workspace as it works on
          a codebase — every file write, every dependency change, every git
          command — and delivers a verdict with its reasons. It has no authority
          to change anything. That is the point.
        </>
      }
      width="wide"
    >
      <Reveal>
        <Parallax
          distance={24}
          className="rounded-xl border border-rule bg-surface p-6 shadow-[var(--shadow-card)] sm:p-8"
        >
          <h3 className="mb-1 text-sm font-semibold tracking-tight">
            The verdict ladder
          </h3>
          <p className="mb-7 text-sm text-ink-soft">
            Four rungs. Every run ends on exactly one of them.
          </p>

          <ol className="space-y-0">
            {verdicts.map((verdict, index) => (
              <li
                key={verdict.key}
                className={`flex flex-col gap-1.5 py-4 sm:flex-row sm:items-baseline sm:gap-6 ${
                  index > 0 ? "border-t border-rule" : ""
                }`}
              >
                <div
                  className={`flex shrink-0 items-center gap-2.5 sm:w-44 ${verdict.color}`}
                >
                  <VerdictMark verdict={verdict.key} className="h-3 w-3 shrink-0" />
                  <span className="font-mono text-sm font-medium tracking-wider">
                    {verdict.label}
                  </span>
                </div>
                <p className="text-ink-soft">{verdict.meaning}</p>
              </li>
            ))}
          </ol>

          <p className="mt-7 border-t border-rule pt-5 text-sm text-ink-soft">
            These four are the only saturated colours in the product, and on this
            page. If something is strongly coloured here, it means something.
          </p>
        </Parallax>
      </Reveal>
    </Section>
  );
}
