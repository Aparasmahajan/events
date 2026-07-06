"use client";

import { useEffect, useState } from "react";
import type { EventData } from "@/lib/types";

type State = { d: number; h: number; m: number; s: number; done: boolean };

function calc(target: string): State {
  const diff = new Date(target).getTime() - Date.now();
  if (!Number.isFinite(diff) || diff <= 0) return { d: 0, h: 0, m: 0, s: 0, done: true };
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff % 86400000) / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
    done: false,
  };
}

/**
 * A universal, theme-aware countdown rendered by EditableShell for every
 * template that doesn't already build its own timer into the design. Floats at
 * the bottom-center as a glass chip, tinted by the event's accent color.
 * Hidden entirely when `event.hideTimer` is set or there's no date yet.
 */
export function EventCountdown({ event }: { event: EventData }) {
  const target = event.mainDate
    ? `${event.mainDate}T${event.mainStartTime || "18:00"}:00`
    : "";
  const [t, setT] = useState<State | null>(null);

  useEffect(() => {
    if (!target) return;
    setT(calc(target));
    const id = setInterval(() => setT(calc(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (event.hideTimer || !event.mainDate) return null;

  const accent = event.themeAccentColor || "#a3792c";

  if (t?.done) {
    return (
      <div className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 rounded-full bg-black/60 px-5 py-2.5 text-white text-xs uppercase tracking-[0.3em] backdrop-blur-md shadow-lg">
        The day is here
      </div>
    );
  }

  const cells: [string, string][] = t
    ? [
        [String(t.d), "days"],
        [String(t.h).padStart(2, "0"), "hrs"],
        [String(t.m).padStart(2, "0"), "min"],
        [String(t.s).padStart(2, "0"), "sec"],
      ]
    : [
        ["--", "days"],
        ["--", "hrs"],
        ["--", "min"],
        ["--", "sec"],
      ];

  return (
    <div
      className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 flex items-center gap-3 rounded-full bg-black/55 px-4 py-2 backdrop-blur-md shadow-xl ring-1 ring-white/15 sm:gap-4 sm:px-5 sm:py-2.5"
      style={{ ["--tc" as string]: accent }}
      aria-label="Countdown to the event"
    >
      <span
        className="hidden text-[9px] font-medium uppercase tracking-[0.3em] sm:inline"
        style={{ color: "var(--tc)" }}
      >
        Counting down
      </span>
      {cells.map(([v, l]) => (
        <div key={l} className="flex flex-col items-center leading-none">
          <span className="font-display text-base tabular-nums text-white sm:text-lg">{v}</span>
          <span className="mt-0.5 text-[8px] uppercase tracking-widest text-white/60">{l}</span>
        </div>
      ))}
    </div>
  );
}
