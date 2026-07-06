"use client";

import { useEffect, useState } from "react";
import type { EventData } from "@/lib/types";

type State = { d: number; h: number; m: number; s: number; done: boolean };
type Design = NonNullable<EventData["timerDesign"]>;
type Cell = [value: string, label: string];

/** The selectable countdown designs (used by the editor picker). */
export const TIMER_DESIGNS: { key: Design; label: string }[] = [
  { key: "glass", label: "Glass" },
  { key: "minimal", label: "Minimal" },
  { key: "flip", label: "Flip clock" },
  { key: "rings", label: "Rings" },
  { key: "neon", label: "Neon" },
  { key: "elegant", label: "Elegant" },
];

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

/* ── Design renderers (each reads the accent via the CSS var --tc) ── */
function DesignBody({ design, cells }: { design: Design; cells: Cell[] }) {
  switch (design) {
    case "minimal":
      return (
        <div className="flex items-end gap-4 text-white [text-shadow:_0_2px_10px_rgb(0_0_0_/_55%)] sm:gap-7">
          {cells.map(([v, l]) => (
            <div key={l} className="flex flex-col items-center">
              <span className="font-display text-4xl tabular-nums leading-none sm:text-6xl">{v}</span>
              <span className="mt-1.5 text-[10px] uppercase tracking-[0.3em] opacity-80">{l}</span>
            </div>
          ))}
        </div>
      );

    case "flip":
      return (
        <div className="flex gap-2 sm:gap-3">
          {cells.map(([v, l]) => (
            <div key={l} className="flex flex-col items-center">
              <div className="relative overflow-hidden rounded-lg bg-neutral-900 px-3 py-2 text-white shadow-lg ring-1 ring-white/10 sm:px-4 sm:py-3">
                <span className="font-display text-2xl tabular-nums sm:text-4xl">{v}</span>
                <span className="absolute inset-x-0 top-1/2 h-px bg-black/50" />
              </div>
              <span className="mt-1 text-[9px] uppercase tracking-widest text-white/80 [text-shadow:_0_1px_4px_rgb(0_0_0_/_60%)]">{l}</span>
            </div>
          ))}
        </div>
      );

    case "rings":
      return (
        <div className="flex gap-3 sm:gap-4">
          {cells.map(([v, l]) => (
            <div key={l} className="flex flex-col items-center">
              <div className="relative h-16 w-16 sm:h-20 sm:w-20">
                <svg viewBox="0 0 36 36" className="h-full w-full">
                  <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                  <circle cx="18" cy="18" r="16" fill="none" stroke="var(--tc)" strokeWidth="2" strokeLinecap="round" strokeDasharray="72 28" transform="rotate(-90 18 18)" />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center font-display text-lg tabular-nums text-white sm:text-xl">{v}</span>
              </div>
              <span className="mt-1 text-[9px] uppercase tracking-widest text-white/80 [text-shadow:_0_1px_4px_rgb(0_0_0_/_60%)]">{l}</span>
            </div>
          ))}
        </div>
      );

    case "neon":
      return (
        <div className="flex items-end gap-3 font-mono sm:gap-5">
          {cells.map(([v, l]) => (
            <div key={l} className="flex flex-col items-center">
              <span
                className="text-3xl tabular-nums leading-none text-white sm:text-5xl"
                style={{ textShadow: "0 0 10px var(--tc), 0 0 26px var(--tc)" }}
              >
                {v}
              </span>
              <span className="mt-1.5 text-[9px] uppercase tracking-[0.3em]" style={{ color: "var(--tc)" }}>{l}</span>
            </div>
          ))}
        </div>
      );

    case "elegant":
      return (
        <div className="flex items-center gap-4 text-white [text-shadow:_0_2px_12px_rgb(0_0_0_/_55%)] sm:gap-6">
          {cells.map(([v, l], i) => (
            <div key={l} className="flex items-center gap-4 sm:gap-6">
              {i > 0 && <span className="h-10 w-px bg-white/30 sm:h-14" />}
              <div className="flex flex-col items-center">
                <span className="font-display text-4xl tabular-nums leading-none sm:text-6xl">{v}</span>
                <span className="mt-2 text-[10px] uppercase tracking-[0.4em]" style={{ color: "var(--tc)" }}>{l}</span>
              </div>
            </div>
          ))}
        </div>
      );

    case "glass":
    default:
      return (
        <div className="inline-flex items-center gap-3 rounded-full bg-black/55 px-4 py-2 shadow-xl ring-1 ring-white/15 backdrop-blur-md sm:gap-4 sm:px-5 sm:py-2.5">
          <span className="hidden text-[9px] font-medium uppercase tracking-[0.3em] sm:inline" style={{ color: "var(--tc)" }}>
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
}

/**
 * Universal countdown rendered by EditableShell. `timerStyle` chooses the
 * position (floating chip vs fixed on the hero bottom); `timerDesign` chooses
 * the look. Tinted by the event's accent color; hidden when `hideTimer` is set.
 */
export function EventCountdown({
  event,
  variant = "fixed",
}: {
  event: EventData;
  variant?: "floating" | "fixed";
}) {
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
  const design = event.timerDesign || "glass";
  const position = event.timerPosition || "center";
  const styleVar = { ["--tc" as string]: accent } as React.CSSProperties;

  // Horizontal placement. On mobile the "fixed" timer always centers so wide
  // designs never run off-screen; the chosen side kicks in from `sm:` up.
  const fixedJustify =
    position === "left"
      ? "justify-center sm:justify-start"
      : position === "right"
        ? "justify-center sm:justify-end"
        : "justify-center";
  const floatPos =
    position === "left"
      ? "left-1/2 -translate-x-1/2 sm:left-8 sm:translate-x-0"
      : position === "right"
        ? "left-1/2 -translate-x-1/2 sm:left-auto sm:right-8 sm:translate-x-0"
        : "left-1/2 -translate-x-1/2";

  let body: React.ReactNode;
  if (t?.done) {
    body = (
      <div className="rounded-full bg-black/60 px-5 py-2.5 text-white text-xs uppercase tracking-[0.3em] backdrop-blur-md shadow-lg">
        The day is here
      </div>
    );
  } else {
    const cells: Cell[] = t
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
    body = <DesignBody design={design} cells={cells} />;
  }

  if (variant === "fixed") {
    // Pinned to the bottom of the hero (first viewport), scrolls away with it.
    return (
      <div
        style={styleVar}
        className={`pointer-events-none absolute inset-x-0 top-0 z-30 flex h-[100svh] items-end px-6 pb-6 sm:px-12 sm:pb-8 ${fixedJustify}`}
      >
        <div className="pointer-events-auto max-w-full">{body}</div>
      </div>
    );
  }

  return (
    <div style={styleVar} className={`fixed bottom-4 z-40 max-w-[calc(100vw-2rem)] ${floatPos}`}>
      {body}
    </div>
  );
}
