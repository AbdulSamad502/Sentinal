import { Section, Reveal } from "../components/Section";
import { runtimes } from "../content";

export function Runtime() {
  return (
    <Section
      id="runtime"
      eyebrow="Where it runs"
      title="One setting chooses the brain."
      lede="The model Sentinel reasons with is a configuration value, not an architectural commitment. Pick the one whose privacy story you can live with."
      width="wide"
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {runtimes.map((runtime, index) => (
          <Reveal key={runtime.id} delay={index * 0.06}>
            <div className="flex h-full flex-col rounded-xl border border-rule bg-surface p-6 shadow-[var(--shadow-card)]">
              <h3 className="text-lg font-semibold tracking-tight">
                {runtime.name}
              </h3>
              <p className="mt-2 text-sm text-ink-soft">{runtime.detail}</p>
              <p className="mt-auto pt-6 font-mono text-xs text-ink">
                {runtime.privacy}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
