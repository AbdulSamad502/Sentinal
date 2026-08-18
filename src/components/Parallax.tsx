import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useParallax } from "../lib/useParallax";

/**
 * Continuous scroll-linked drift, separate from Reveal's one-time entrance.
 * Compose them when a moment should both fade in AND carry parallax depth
 * as the page keeps scrolling past it.
 *
 * `distance` is in pixels each direction -- kept small (24-60px) everywhere
 * this is used. The brief's own rule applies here as much as to the 3D:
 * restraint reads as confidence, and nothing should fight text the reader is
 * trying to read.
 */
export function Parallax({
  children,
  distance = 32,
  className = "",
}: {
  children: ReactNode;
  distance?: number;
  className?: string;
}) {
  const { ref, y } = useParallax(distance);

  if (!y) return <div className={className}>{children}</div>;

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
