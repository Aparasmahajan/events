"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

const DEFAULT_COLORS = ["#ff5fa2", "#ffd166", "#06d6a0", "#5b8def", "#c77dff", "#ff7b54"];

type Piece = {
  id: number;
  left: number; // start vw position (0–100)
  drift: number; // horizontal drift in vw
  size: number;
  delay: number;
  duration: number;
  color: string;
  round: boolean;
};

type BurstState = { id: number; pieces: Piece[] };

function makeBurst(count: number, colors: string[]): Piece[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    drift: (Math.random() - 0.5) * 36,
    size: 6 + Math.random() * 10,
    delay: Math.random() * 0.25,
    duration: 2 + Math.random() * 1.6,
    color: colors[i % colors.length],
    round: Math.random() > 0.5,
  }));
}

/** Full-viewport overlay that rains one set of confetti pieces, then unmounts. */
function Burst({ pieces }: { pieces: Piece[] }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-[70] overflow-hidden">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          initial={{ top: "-8%", opacity: 1, rotate: 0 }}
          animate={{
            top: "112%",
            left: `calc(${p.left}vw + ${p.drift}vw)`,
            rotate: 540,
            opacity: [1, 1, 0],
          }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeIn" }}
          style={{
            position: "absolute",
            left: `${p.left}vw`,
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: p.round ? "50%" : 2,
          }}
        />
      ))}
    </div>
  );
}

function useBursts(count: number, colors: string[]) {
  const [bursts, setBursts] = useState<BurstState[]>([]);
  const idRef = useRef(0);

  const fire = () => {
    const burst: BurstState = { id: idRef.current++, pieces: makeBurst(count, colors) };
    setBursts((b) => [...b, burst]);
    window.setTimeout(
      () => setBursts((b) => b.filter((x) => x.id !== burst.id)),
      4200,
    );
  };

  const layer = (
    <AnimatePresence>
      {bursts.map((b) => (
        <Burst key={b.id} pieces={b.pieces} />
      ))}
    </AnimatePresence>
  );

  return { fire, layer };
}

/**
 * Fires a single celebratory burst when it mounts (e.g. when the page loads).
 * Renders nothing when the visitor prefers reduced motion.
 */
export function Confetti({
  count = 90,
  colors = DEFAULT_COLORS,
  fireOnMount = true,
}: {
  count?: number;
  colors?: string[];
  fireOnMount?: boolean;
}) {
  const reduce = useReducedMotion();
  const { fire, layer } = useBursts(count, colors);

  useEffect(() => {
    if (!fireOnMount || reduce) return;
    fire();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (reduce) return null;
  return layer;
}

/**
 * A button that launches a fresh confetti burst on every click — an explicit,
 * playful "celebrate" affordance. No-ops (still renders the button) under
 * reduced motion.
 */
export function ConfettiButton({
  children,
  className,
  count = 80,
  colors = DEFAULT_COLORS,
}: {
  children: ReactNode;
  className?: string;
  count?: number;
  colors?: string[];
}) {
  const reduce = useReducedMotion();
  const { fire, layer } = useBursts(count, colors);

  return (
    <>
      <button type="button" onClick={() => !reduce && fire()} className={className}>
        {children}
      </button>
      {!reduce && layer}
    </>
  );
}
