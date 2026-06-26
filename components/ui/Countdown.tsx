"use client";

import { useEffect, useState } from "react";

type State = { d: number; h: number; m: number; s: number; done: boolean };
type Props = { target: string; label?: string };

function calc(target: string): State {
  const diff = new Date(target).getTime() - Date.now();
  if (!Number.isFinite(diff) || diff <= 0) {
    return { d: 0, h: 0, m: 0, s: 0, done: true };
  }
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { d, h, m, s, done: false };
}

export function Countdown({ target, label = "Counting down" }: Props) {
  // Null on first paint (server + first client render) so SSR and hydration
  // produce the same HTML. The real values fill in after mount.
  const [t, setT] = useState<State | null>(null);

  useEffect(() => {
    setT(calc(target));
    const id = setInterval(() => setT(calc(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (t?.done) {
    return (
      <div className="text-center">
        <p className="text-sm uppercase tracking-[0.3em] opacity-70">It&apos;s today</p>
      </div>
    );
  }

  const cells: { v: string; l: string }[] = t
    ? [
        { v: String(t.d).padStart(2, "0"), l: "days" },
        { v: String(t.h).padStart(2, "0"), l: "hours" },
        { v: String(t.m).padStart(2, "0"), l: "min" },
        { v: String(t.s).padStart(2, "0"), l: "sec" },
      ]
    : [
        { v: "--", l: "days" },
        { v: "--", l: "hours" },
        { v: "--", l: "min" },
        { v: "--", l: "sec" },
      ];

  return (
    <div className="text-center">
      {label && (
        <p className="text-xs sm:text-sm uppercase tracking-[0.3em] opacity-70 mb-3">{label}</p>
      )}
      <div className="grid grid-cols-4 gap-2 sm:gap-6 max-w-md mx-auto">
        {cells.map((x) => (
          <div
            key={x.l}
            className="rounded-lg bg-white/10 backdrop-blur-sm px-2 py-3 sm:px-4 sm:py-5 border border-white/20"
          >
            <div className="text-2xl sm:text-4xl font-display tabular-nums">{x.v}</div>
            <div className="text-[10px] sm:text-xs uppercase tracking-widest opacity-80 mt-1">{x.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
