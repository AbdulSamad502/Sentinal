import { Section, Reveal } from "../components/Section";

export function Purpose() {
  return (
    <Section id="purpose" width="narrow">
      <Reveal>
        <p className="mb-3 font-mono text-xs tracking-[0.18em] text-ink-soft uppercase">
          Purpose
        </p>
        <h2
          id="purpose-heading"
          className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
        >
          For the developer who is now responsible for code they did not write.
        </h2>
        <div className="mt-7 space-y-5 text-lg leading-relaxed text-ink-soft text-pretty">
          <p>
            Supervision used to be a code review between two people who both
            understood the change. Delegation to agents broke that: the volume went
            up, the author cannot be questioned in good faith, and the reviewer is
            one person reading faster than they can think.
          </p>
          <p>
            Sentinel exists because the missing piece is not a better coding agent.
            It is an accountable observer — one that checks the same way every time,
            says plainly what it could not check, and never quietly decides it knows
            best.
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
