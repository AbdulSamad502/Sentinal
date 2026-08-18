import { Reveal } from "../components/Section";
import { Parallax } from "../components/Parallax";
import { principles } from "../content";

/**
 * The three principles get a section of their own, full-bleed and set large.
 * They are the most credible thing about the project and the brief is explicit
 * that they must not be buried.
 */
export function Principles() {
  return (
    <section
      id="principles"
      aria-labelledby="principles-heading"
      className="border-y border-rule bg-surface px-5 py-24 sm:px-8 sm:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-16 sm:mb-20">
          <p className="mb-3 font-mono text-xs tracking-[0.18em] text-ink-soft uppercase">
            Principles
          </p>
          <h2
            id="principles-heading"
            className="max-w-3xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
          >
            Three rules that decide what Sentinel is allowed to be.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft text-pretty">
            These are constraints on the tool, not features of it. Each one closes
            off a way that a supervisor could quietly become useless.
          </p>
        </Reveal>

        <div className="space-y-14 sm:space-y-16">
          {principles.map((principle, index) => (
            <Reveal key={principle.id} delay={index * 0.06}>
              <article className="grid gap-x-10 gap-y-4 border-t border-rule pt-8 lg:grid-cols-[auto_1fr_1fr]">
                <Parallax distance={16} className="lg:w-10">
                  <span
                    aria-hidden="true"
                    className="font-mono text-xs text-ink-soft tabular-nums"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </Parallax>

                <h3 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
                  {principle.title}
                </h3>

                <div className="space-y-4">
                  <p className="text-lg leading-relaxed text-ink-soft text-pretty">
                    {principle.body}
                  </p>
                  <p className="border-l-2 border-accent pl-4 text-ink text-pretty">
                    {principle.consequence}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
