import { useReducedMotion } from "framer-motion";
import { Section, Reveal } from "../components/Section";
import { useMediaQuery } from "../lib/useMediaQuery";
import { features } from "../content";
import { FeatureSequence } from "./FeatureSequence";

/**
 * Six features. On desktop with motion allowed, this is the site's
 * signature scroll-driven moment (FeatureSequence) -- a running example
 * session's signals accumulate in a sticky panel as the six features scroll
 * past, resolving into one verdict. Everywhere else, a plain numbered list:
 * a complete section on its own, not a stripped-down version of the other
 * one, laid out as a list rather than a card grid so each feature still
 * gets a real explanation and a concrete detail.
 */
export function Features() {
  const reduced = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const useSequence = isDesktop && !reduced;

  return (
    <Section
      id="features"
      eyebrow="Features"
      title="Six things Sentinel does while the agent works."
      width="wide"
    >
      {useSequence ? <FeatureSequence /> : <PlainList />}
    </Section>
  );
}

function PlainList() {
  return (
    // Reveal has to sit inside the <li>, not wrap it -- wrapping it puts a
    // <div> between <ol> and <li>, which breaks list semantics for screen
    // readers (list/listitem a11y audit).
    <ol className="space-y-0">
      {features.map((feature, index) => (
        <li key={feature.id} className="border-t border-rule py-10 sm:py-12">
          <Reveal
            delay={index * 0.04}
            className="grid gap-x-8 gap-y-4 sm:grid-cols-[auto_1fr]"
          >
            <div className="flex items-baseline gap-4 sm:w-56 sm:flex-col sm:gap-2">
              <span className="font-mono text-xs text-ink-soft tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-xl font-semibold tracking-tight">{feature.name}</h3>
            </div>

            <div className="min-w-0">
              <p className="text-lg text-ink text-pretty">{feature.summary}</p>
              <p className="mt-3 leading-relaxed text-ink-soft text-pretty">
                {feature.body}
              </p>
              <div className="mt-5 overflow-x-auto rounded-md border border-rule bg-surface-sunk px-3.5 py-2.5">
                <code className="font-mono text-xs whitespace-pre text-ink-soft">
                  {feature.detail}
                </code>
              </div>
            </div>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
