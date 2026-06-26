"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * A thin reading-progress bar pinned to the very top of the page that fills as
 * the visitor scrolls. Driven by the window scroll position, smoothed with a
 * spring. Accent-colored by default so it inherits each template's --accent.
 */
export function ScrollProgress({ color, height = 3 }: { color?: string; height?: number }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });

  return (
    <motion.div
      aria-hidden
      style={{
        scaleX,
        height,
        background: color ?? "var(--accent)",
      }}
      className="fixed top-0 inset-x-0 z-[55] origin-left"
    />
  );
}
