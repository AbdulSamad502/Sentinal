import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Section shell: consistent vertical rhythm, a semantic landmark, and a heading
 * that the anchor nav can target.
 *
 * `width` varies the section rhythm deliberately -- the page should not be the
 * same centred column all the way down.
 */
export function Section({
  id,
  eyebrow,
  title,
  lede,
  children,
  width = "default",
  className = "",
}: {
  id: string;
  eyebrow?: string;
  title?: string;
  lede?: ReactNode;
  children: ReactNode;
  width?: "default" | "wide" | "narrow" | "full";
  className?: string;
}) {
  const widths = {
    narrow: "max-w-2xl",
    default: "max-w-5xl",
    wide: "max-w-6xl",
    full: "max-w-none",
  };

  return (
    <section
      id={id}
      aria-labelledby={title ? `${id}-heading` : undefined}
      className={`px-5 py-20 sm:px-8 sm:py-28 ${className}`}
    >
      <div className={`mx-auto ${widths[width]}`}>
        {(eyebrow || title || lede) && (
          <Reveal className="mb-12 sm:mb-16">
            {eyebrow && (
              <p className="mb-3 font-mono text-xs tracking-[0.18em] text-ink-soft uppercase">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2
                id={`${id}-heading`}
                className="max-w-3xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
              >
                {title}
              </h2>
            )}
            {lede && (
              <div className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft text-pretty">
                {lede}
              </div>
            )}
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}

/**
 * Entrance transition. Reduced to nothing when the visitor asks for reduced
 * motion -- not weakened, removed.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
