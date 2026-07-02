"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/* ─── Context ─── */

type Ctx = { active: boolean; activate: () => void; deactivate: () => void };
const Ctx = createContext<Ctx>({ active: false, activate: () => {}, deactivate: () => {} });
export const useUltimateMode = () => useContext(Ctx);

/* ─── Deterministic particles (SSR-safe) ─── */

const P_COUNT = 120;
const PARTICLES = Array.from({ length: P_COUNT }, (_, i) => ({
  x: `${(i * 37 + 13) % 100}%`,
  y: `${(i * 23 + 7) % 100}%`,
  s: 1 + (i % 3),
  d: (i % 15) * 0.25,
  t: 5 + (i % 12),
  dx: ((i % 7) - 3) * 0.6,
  dy: ((i % 5) - 2) * 0.6,
}));

const GRID_BEAMS = [
  { x: "15%", w: "2px", c: "#00f0ff", a: -6 },
  { x: "35%", w: "1px", c: "#8b5cf6", a: 4 },
  { x: "55%", w: "1px", c: "#ff2d78", a: -3 },
  { x: "75%", w: "2px", c: "#00f0ff", a: 7 },
  { x: "90%", w: "1px", c: "#8b5cf6", a: -5 },
];

/* ─── Infinite particle field ─── */

function Particles() {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-50">
      {PARTICLES.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{
            left: p.x, top: p.y, width: p.s, height: p.s,
            background: i % 3 === 0 ? "#00f0ff" : i % 3 === 1 ? "#8b5cf6" : "#ff2d78",
            boxShadow: `0 0 ${p.s * 3}px ${i % 3 === 0 ? "#00f0ff" : i % 3 === 1 ? "#8b5cf6" : "#ff2d78"}`,
          }}
          animate={{ x: [0, p.dx * 20, 0], y: [0, p.dy * 20, 0], opacity: [0, 0.8, 0], scale: [0, 1.5, 0] }}
          transition={{ duration: p.t, delay: p.d, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/* ─── Scanning lines overlay ─── */

function ScanLines() {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <motion.div
        className="absolute inset-x-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, #00f0ff44, transparent)" }}
        animate={{ top: ["-2%", "102%"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-x-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, #8b5cf644, transparent)" }}
        animate={{ top: ["-2%", "102%"] }}
        transition={{ duration: 5.5, delay: 1.5, repeat: Infinity, ease: "linear" }}
      />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,240,255,0.1) 2px, rgba(0,240,255,0.1) 3px)" }}
      />
    </div>
  );
}

/* ─── Grid overlay ─── */

function GridOverlay() {
  return (
    <svg aria-hidden className="pointer-events-none fixed inset-0 z-40 h-full w-full opacity-[0.04]">
      <defs>
        <pattern id="ultimate-grid" width="48" height="48" patternUnits="userSpaceOnUse">
          <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#00f0ff" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#ultimate-grid)" />
      {GRID_BEAMS.map((b, i) => (
        <motion.line
          key={i}
          x1={b.x} y1="0" x2={b.x} y2="100%"
          stroke={b.c} strokeWidth={b.w} opacity="0.15"
          style={{ rotate: `${b.a}deg`, transformOrigin: "50% 0%" }}
          animate={{ opacity: [0.05, 0.2, 0.05] }}
          transition={{ duration: 3 + i, delay: i * 0.8, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </svg>
  );
}

/* ─── Glitch text effect ─── */

function GlitchText({ children, className, as = "span" }: { children: string; className?: string; as?: "span" | "p" | "h1" | "h2" }) {
  const [glitching, setGlitching] = useState(false);
  useEffect(() => {
    const ids = [0.8, 2.4, 4.2, 7.1].map((delay) =>
      setTimeout(() => { setGlitching(true); setTimeout(() => setGlitching(false), 180); }, delay * 1000)
    );
    const interval = setInterval(() => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 120 + Math.random() * 120);
    }, 4000 + Math.random() * 3000);
    return () => { ids.forEach(clearTimeout); clearInterval(interval); };
  }, []);
  const Tag = as;
  return (
    <Tag className={`relative inline-block ${className ?? ""}`}>
      <span className={glitching ? "opacity-0" : ""}>{children}</span>
      {glitching && (
        <span aria-hidden className="absolute inset-0" style={{ color: "#00f0ff", clipPath: "inset(20% 0 60% 0)" }}>
          {children}
        </span>
      )}
      {glitching && (
        <span aria-hidden className="absolute inset-0" style={{ color: "#ff2d78", clipPath: "inset(60% 0 10% 0)", transform: "translateX(2px)" }}>
          {children}
        </span>
      )}
    </Tag>
  );
}

/* ─── The secret trigger button ─── */

function TriggerButton({ onTrigger }: { onTrigger: () => void }) {
  const [visible, setVisible] = useState(false);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {hover && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-black/80 px-3 py-1.5 text-[10px] uppercase tracking-[0.3em] text-white backdrop-blur-md"
          >
            Unlock something
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.3 }}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={onTrigger}
        className="relative flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/60 text-lg backdrop-blur-xl transition-all hover:border-[#00f0ff]/60"
        style={{ boxShadow: "0 0 20px rgba(0,240,255,0.15)" }}
        aria-label="Unlock ultimate mode"
      >
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="text-[#00f0ff]"
        >
          ◇
        </motion.span>
        <motion.span
          className="absolute inset-0 rounded-full"
          animate={{ boxShadow: ["0 0 10px rgba(0,240,255,0.2)", "0 0 30px rgba(0,240,255,0.4)", "0 0 10px rgba(0,240,255,0.2)"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.button>
    </div>
  );
}

/* ─── Cinematic confirmation modal ─── */

function ConfirmationModal({ onConfirm, onDismiss }: { onConfirm: () => void; onDismiss: () => void; }) {
  const reduce = useReducedMotion();

  const chars = "αβγδεζηθικλμνξοπρστυφχψω∞ΔΛΨΩ∑∏";
  const [scrambled, setScrambled] = useState("ACTIVATE ULTIMATE MODE");
  const [revealed, setRevealed] = useState(false);
  const target = "ACTIVATE ULTIMATE MODE";

  useEffect(() => {
    if (reduce) { setRevealed(true); setScrambled(target); return; }
    let frame = 0;
    const id = setInterval(() => {
      frame++;
      if (frame > 20) { setRevealed(true); setScrambled(target); clearInterval(id); return; }
      setScrambled(
        target
          .split("")
          .map((ch, i) => (i < frame * 1.5 ? ch : chars[Math.floor(Math.random() * chars.length)]))
          .join(""),
      );
    }, 60);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onDismiss(); }}
    >
      <div aria-hidden className="absolute inset-0 bg-black/80 backdrop-blur-2xl" />

      <motion.div
        initial={reduce ? undefined : { scale: 0.85, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={reduce ? undefined : { scale: 0.9, opacity: 0, y: -20 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0a12]/95 p-8 backdrop-blur-2xl sm:p-10"
        style={{ boxShadow: "0 0 80px -20px rgba(0,240,255,0.15), inset 0 0 80px -40px rgba(139,92,246,0.1)" }}
      >
        {/* Decorative corner glows */}
        <div aria-hidden className="pointer-events-none absolute -top-20 -left-20 h-40 w-40 rounded-full bg-[#00f0ff]/10 blur-[60px]" />
        <div aria-hidden className="pointer-events-none absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-[#8b5cf6]/10 blur-[60px]" />

        <div className="relative">
          <motion.p
        initial={reduce ? undefined : { opacity: 0 }}
        animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-2 text-[10px] uppercase tracking-[0.6em] text-[#00f0ff]/60"
          >
            System access
          </motion.p>

          <h2 className="font-display text-2xl leading-[1.1] tracking-tight sm:text-3xl" style={{ fontVariantNumeric: "tabular-nums" }}>
            {revealed ? (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="inline-block text-white"
                style={{ textShadow: "0 0 20px rgba(0,240,255,0.3)" }}
              >
                {target}
              </motion.span>
            ) : (
              <span className="font-mono text-sm tracking-[0.15em] text-[#00f0ff] sm:text-base">
                {scrambled}
              </span>
            )}
          </h2>

          <motion.p
            initial={reduce ? undefined : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-4 text-sm leading-relaxed text-white/60"
          >
            This will transform the interface into a cinematic experience.
            <br />Particles, light beams, holographic grids — the works.
          </motion.p>

          <motion.div
            initial={reduce ? undefined : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end"
          >
            <button
              onClick={onDismiss}
              className="rounded-xl border border-white/[0.08] px-6 py-3 text-sm uppercase tracking-[0.25em] text-white/50 transition-colors hover:border-white/20 hover:text-white/80"
            >
              Cancel
            </button>
            <motion.button
              whileHover={reduce ? undefined : { scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onConfirm}
              className="rounded-xl px-6 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#0a0a12] transition-all"
              style={{ background: "linear-gradient(135deg, #00f0ff, #8b5cf6)" }}
            >
              <motion.span
                animate={reduce ? undefined : { opacity: [1, 0.7, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Activate
              </motion.span>
            </motion.button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-4 text-[10px] text-white/30"
          >
            You can toggle it off anytime from the same button.
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Top bar indicator when ultimate is active ─── */

function UltimateBar({ onDeactivate }: { onDeactivate: () => void }) {
  return (
    <motion.div
      initial={{ y: -40 }}
      animate={{ y: 0 }}
      className="fixed inset-x-0 top-0 z-[70] flex h-9 items-center justify-center gap-3 border-b border-[#00f0ff]/20 bg-[#0a0a12]/90 px-4 backdrop-blur-xl"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[#00f0ff]" />
      <span className="text-[10px] uppercase tracking-[0.4em] text-[#00f0ff]/80">Ultimate Mode</span>
      <button
        onClick={onDeactivate}
        className="ml-4 rounded px-2.5 py-0.5 text-[9px] uppercase tracking-[0.3em] text-[#ff2d78]/60 transition-colors hover:text-[#ff2d78] hover:bg-[#ff2d78]/10 border border-[#ff2d78]/20 hover:border-[#ff2d78]/50"
      >
        ✕ Exit
      </button>
    </motion.div>
  );
}

/* ─── Provider + orchestration ─── */

export function UltimateModeWrapper({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const activate = useCallback(() => { setActive(true); setShowModal(false); }, []);
  const deactivate = useCallback(() => setActive(false), []);

  return (
    <Ctx.Provider value={{ active, activate, deactivate }}>
      {active && <UltimateBar onDeactivate={deactivate} />}

      {/* The trigger is always present but only interactive when modal isn't showing */}
      {!active && <TriggerButton onTrigger={() => setShowModal(true)} />}

      {/* Re-trigger if already active — show a mini toggle */}
      {active && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 right-6 z-[100]"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { deactivate(); }}
            className="group flex items-center gap-2 rounded-full border border-[#ff2d78]/50 bg-[#0a0a12]/90 px-4 py-2.5 text-xs backdrop-blur-xl transition-all hover:border-[#ff2d78] hover:bg-[#ff2d78]/10 hover:shadow-[0_0_24px_-4px_#ff2d78]"
            aria-label="Deactivate ultimate mode"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ff2d78] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#ff2d78]" />
            </span>
            <span className="font-medium tracking-wide text-[#ff2d78]/90 group-hover:text-[#ff2d78]">
              Exit Ultimate
            </span>
            <span className="text-[#ff2d78]/60 text-base leading-none group-hover:text-[#ff2d78]">✕</span>
          </motion.button>
        </motion.div>
      )}

      <AnimatePresence>
        {showModal && (
          <ConfirmationModal
            onConfirm={activate}
            onDismiss={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>

      {active && (
        <>
          <Particles />
          <ScanLines />
          <GridOverlay />
        </>
      )}

      {/* The page content wrapped with a data attribute for CSS hooks */}
      <div data-ultimate={active ? "true" : undefined} className={active ? "ultimate-active" : ""}>
        {children}
      </div>

      {/* Inject CSS overrides for ultimate mode */}
      {active && <UltimateStyles />}
    </Ctx.Provider>
  );
}

/* ─── Injected CSS to transform the page ─── */

function UltimateStyles() {
  return (
    <style>{`
      .ultimate-active {
        background: #0a0a12 !important;
        color: #f0f0f0 !important;
      }
      .ultimate-active .font-display {
        letter-spacing: -0.02em;
      }
      .ultimate-active main > section {
        position: relative;
        z-index: 10;
      }
      .ultimate-active main > section:first-of-type {
        background: transparent !important;
      }
      .ultimate-active section:nth-child(even) {
        background: rgba(10,10,18,0.6);
      }
      .ultimate-active .rounded-2xl {
        border-color: rgba(0,240,255,0.12) !important;
        background: rgba(255,255,255,0.03) !important;
        backdrop-filter: blur(12px) !important;
        box-shadow: 0 0 30px -15px rgba(0,240,255,0.1) !important;
        transition: all 0.4s ease;
      }
      .ultimate-active .rounded-2xl:hover {
        border-color: rgba(0,240,255,0.3) !important;
        box-shadow: 0 0 50px -15px rgba(0,240,255,0.2) !important;
      }
      .ultimate-active a {
        transition: all 0.3s ease;
      }
      .ultimate-active .rounded-full {
        border-color: rgba(0,240,255,0.2) !important;
      }
      .ultimate-active [class*="border-black"],
      .ultimate-active [class*="border-neutral"] {
        border-color: rgba(255,255,255,0.08) !important;
      }
      .ultimate-active h1, .ultimate-active h2, .ultimate-active h3 {
        color: #f0f0f0 !important;
      }
      .ultimate-active p {
        color: rgba(240,240,240,0.8) !important;
      }
      .ultimate-active .text-black, .ultimate-active .text-neutral-900 {
        color: #f0f0f0 !important;
      }
      .ultimate-active .opacity-70, .ultimate-active .opacity-60 {
        opacity: 0.6 !important;
      }
      .ultimate-active .bg-white {
        background: rgba(255,255,255,0.04) !important;
      }
      .ultimate-active .bg-neutral-900 {
        background: rgba(0,240,255,0.15) !important;
      }
      .ultimate-active .bg-neutral-900:hover {
        background: rgba(0,240,255,0.25) !important;
      }
      .ultimate-active footer {
        border-color: rgba(255,255,255,0.05) !important;
      }
      .ultimate-active [style*="--accent"] {
        --accent: #00f0ff;
      }
      .ultimate-active .group:hover .group-hover\\:gap-2,
      .ultimate-active .group:hover span {
        transition: all 0.3s ease;
      }
      /* Ensure flex children fill space properly in ultimate mode */
      .ultimate-active .flex-1 {
        min-height: 0;
      }
      .ultimate-active .grid {
        align-items: stretch;
      }
      .ultimate-active .grid > * {
        display: flex;
        flex-direction: column;
      }
      @keyframes ultimate-glitch {
        0% { transform: translate(0); }
        20% { transform: translate(-1px, 1px); }
        40% { transform: translate(1px, -1px); }
        60% { transform: translate(-1px, -1px); }
        80% { transform: translate(1px, 1px); }
        100% { transform: translate(0); }
      }
    `}</style>
  );
}
