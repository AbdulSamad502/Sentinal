import { useRef } from "react";
import { useScroll, useTransform, useReducedMotion, type MotionValue } from "framer-motion";

/**
 * Scroll-linked vertical offset for one element, tracking its own position
 * through the viewport rather than global scroll position -- so the effect
 * is the same whether the element is near the top of the page or far down
 * it.
 *
 * Returns `undefined` under prefers-reduced-motion so callers can drop the
 * `style` prop entirely rather than passing a zeroed motion value.
 */
export function useParallax(distance = 40) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);

  return { ref, y: reduced ? undefined : y } as {
    ref: React.RefObject<HTMLDivElement | null>;
    y: MotionValue<number> | undefined;
  };
}
