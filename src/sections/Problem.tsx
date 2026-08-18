import { Section, Reveal } from "../components/Section";

export function Problem() {
  return (
    <Section
      id="problem"
      eyebrow="The problem"
      title="An agent rewrites twelve files in ninety seconds. The review burden lands on you."
      width="wide"
      className="bg-surface-sunk border-y border-rule"
    >
      <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        <Reveal className="space-y-5 text-lg leading-relaxed text-ink-soft text-pretty">
          <p>
            Developers now delegate real work to AI coding agents, and those agents
            are capable of things nobody asked for. They touch files they were
            never meant to touch. They delete or overwrite things quietly. They
            report success on changes that do not actually work, make
            security-sensitive edits with nobody reviewing them, and drift off-task
            from what was actually requested.
          </p>
          <p>
            Reading twelve files of machine-written diff by hand is slow, and it is
            the part of the loop that does not scale. The obvious shortcut — asking
            the coding agent to summarise its own work — is asking the suspect to
            write the report.
          </p>
          <p className="text-ink">
            Sentinel is the second opinion. It observes independently, and it has
            no stake in the change looking good.
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="rounded-xl border border-rule bg-surface p-6 shadow-[var(--shadow-card)]">
            <p className="mb-5 font-mono text-xs tracking-[0.16em] text-ink-soft uppercase">
              What goes wrong
            </p>
            <ul className="space-y-4 text-sm">
              {[
                "Touches files it was never meant to touch",
                "Deletes or overwrites silently",
                'Claims "done" when the change does not work',
                "Makes security-sensitive changes unreviewed",
                "Drifts off-task from what was asked",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-2 h-px w-4 shrink-0 bg-rule"
                  />
                  <span className="text-ink-soft">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
