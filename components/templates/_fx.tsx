"use client";

import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import type { ReactNode } from "react";

/** Shared motion vocabulary for the high-craft templates (Obsidian, Celestia). */
export const EASE = [0.16, 1, 0.3, 1] as const;

export function useReduce(): boolean {
  return !!useReducedMotion();
}

/** Fixed film-grain / noise overlay. */
export function Grain({ opacity = 0.06, blend = "overlay" }: { opacity?: number; blend?: string }) {
  return (
    <svg
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-0 h-full w-full"
      style={{ opacity, mixBlendMode: blend as React.CSSProperties["mixBlendMode"] }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <filter id="fx-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#fx-grain)" />
    </svg>
  );
}

/** Generic fade/slide-in on scroll into view. */
export function Reveal({
  children,
  y = 36,
  delay = 0,
  className,
}: {
  children: ReactNode;
  y?: number;
  delay?: number;
  className?: string;
}) {
  const reduce = useReduce();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Words that rise into place, one after another. */
export function WordReveal({ text, className }: { text: string; className?: string }) {
  const reduce = useReduce();
  return (
    <p className={className}>
      {text.split(" ").map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            initial={reduce ? false : { y: "115%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true, margin: "-12% 0px" }}
            transition={{ duration: 0.8, delay: (i % 14) * 0.045, ease: EASE }}
          >
            {w}&nbsp;
          </motion.span>
        </span>
      ))}
    </p>
  );
}

/** Button/element that leans toward the cursor. */
export function Magnetic({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReduce();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });
  const ref = useRef<HTMLDivElement>(null);
  return (
    <motion.div
      ref={ref}
      data-cursor
      style={{ x: sx, y: sy }}
      className={className}
      onPointerMove={(e) => {
        if (reduce || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * 0.4);
        y.set((e.clientY - (r.top + r.height / 2)) * 0.4);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
