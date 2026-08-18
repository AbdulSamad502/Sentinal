import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { useReducedMotion } from "framer-motion";

/**
 * Site-wide inertial scrolling -- the "buttery" momentum feel that makes a
 * scroll-driven page read as considered rather than default-browser-flat.
 *
 * Lenis intercepts wheel/touch input and eases the native scroll position
 * toward it (still calling window.scrollTo under the hood), so it keeps
 * firing real `scroll` events -- Framer Motion's useScroll and the browser's
 * own scroll-linked APIs keep working without extra wiring.
 *
 * Disabled outright under prefers-reduced-motion: momentum/overshoot easing
 * is exactly the kind of motion that preference exists to turn off. This is
 * not a visual downgrade -- native scroll is not a lesser fallback, it's the
 * correct behaviour for a visitor who asked for less motion.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      touchMultiplier: 1.4,
    });
    lenisRef.current = lenis;

    let frame: number;
    function raf(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    }
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduced]);

  // Anchor-link jumps (nav, skip-link) use native scrollIntoView, which
  // fights Lenis's own scroll ownership if left alone -- route them through
  // Lenis's scrollTo so the same easing applies to those jumps too.
  useEffect(() => {
    if (reduced) return;

    function onClick(e: MouseEvent) {
      const target = (e.target as HTMLElement)?.closest?.('a[href^="#"]');
      if (!target) return;
      const id = target.getAttribute("href")?.slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      if (!el || !lenisRef.current) return;
      e.preventDefault();
      lenisRef.current.scrollTo(el, { offset: -64 });
      history.pushState(null, "", `#${id}`);
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [reduced]);

  return <>{children}</>;
}
