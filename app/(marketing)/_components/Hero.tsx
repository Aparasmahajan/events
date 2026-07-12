"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { useUltimateMode } from "./UltimateMode";

const ROTATIONS = [
  { word: "wedding", color: "#a3792c" },
  { word: "birthday", color: "#ff5fa2" },
  { word: "engagement", color: "#e8a0a0" },
  { word: "summit", color: "#7c3aed" },
  { word: "anniversary", color: "#06d6a0" },
];

export function Hero({ demoCode }: { demoCode: string }) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [mouse, setMouse] = useState({ x: 50, y: 30 });

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setI((x) => (x + 1) % ROTATIONS.length), 2400);
    return () => clearInterval(id);
  }, [reduce]);

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce]);

  const cur = ROTATIONS[i];
  const { active: ultimate } = useUltimateMode();

  return (
    <section className="relative overflow-hidden min-h-[92svh] flex items-center">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 transition-[background] duration-700"
        style={{
          background: ultimate
            ? `
              radial-gradient(600px circle at ${mouse.x}% ${mouse.y}%, ${cur.color}22, transparent 60%),
              radial-gradient(800px circle at 20% 20%, #00f0ff11, transparent 50%),
              radial-gradient(800px circle at 80% 80%, #8b5cf611, transparent 50%),
              linear-gradient(180deg, #0a0a12, #12121e)`
            : `
              radial-gradient(600px circle at ${mouse.x}% ${mouse.y}%, ${cur.color}33, transparent 60%),
              radial-gradient(900px circle at 20% 20%, #a3792c22, transparent 55%),
              radial-gradient(900px circle at 80% 80%, #7c3aed1a, transparent 55%),
              linear-gradient(180deg, #ffffff, #faf7f0)`,
        }}
      />

      {/* Floating dots */}
      <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none">
        {[
          { left: "8%", top: "30%", size: 8, delay: 0 },
          { left: "85%", top: "20%", size: 10, delay: 0.6 },
          { left: "70%", top: "70%", size: 6, delay: 1.2 },
          { left: "15%", top: "78%", size: 12, delay: 0.3 },
          { left: "40%", top: "12%", size: 5, delay: 0.9 },
          ...(ultimate
            ? [
                { left: "30%", top: "60%", size: 4, delay: 0.2 },
                { left: "55%", top: "25%", size: 6, delay: 0.7 },
                { left: "90%", top: "50%", size: 3, delay: 1.0 },
                { left: "10%", top: "85%", size: 5, delay: 0.4 },
                { left: "45%", top: "90%", size: 4, delay: 1.5 },
              ]
            : []),
        ].map((p, idx) => (
          <motion.span
            key={idx}
            className="absolute rounded-full"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              background: ultimate ? (idx % 2 === 0 ? "#00f0ff" : "#8b5cf6") : cur.color,
              opacity: ultimate ? 0.5 : 0.35,
              boxShadow: ultimate ? `0 0 ${p.size * 3}px ${idx % 2 === 0 ? "#00f0ff" : "#8b5cf6"}` : "none",
            }}
            animate={reduce ? undefined : ultimate ? { y: [0, -24, 0], scale: [1, 1.3, 1] } : { y: [0, -16, 0] }}
            transition={{ duration: ultimate ? 4 : 5, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-20 sm:py-28 text-center w-full">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-xs uppercase tracking-[0.4em] opacity-60 mb-4"
        >
          Every event deserves a celebration
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.05 }}
          className="font-display text-4xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight"
        >
          {/* First line: "Beautiful [rotating-word]" — kept as one wrap-unit
           *  so the width is driven by the longest rotation word (see the
           *  invisible sizer span) and the layout never jitters when the
           *  animated word crossfades to a wider/narrower one. */}
          <span className="whitespace-nowrap">
            Beautiful{" "}
            <span className="relative inline-block align-baseline">
              <span aria-hidden className="invisible">anniversary</span>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={cur.word}
                  initial={{ y: 28, opacity: 0, filter: "blur(4px)" }}
                  animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                  exit={{ y: -28, opacity: 0, filter: "blur(4px)" }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  style={{ color: cur.color }}
                  className="absolute inset-0 font-display text-center"
                >
                  {cur.word}
                </motion.span>
              </AnimatePresence>
            </span>
          </span>
          <br />
          sites, live in minutes.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-6 max-w-2xl mx-auto text-lg opacity-80"
        >
          Pick your moment, choose a template that matches its soul, and we&apos;ll bring it to life — a live event site in minutes, no code needed.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex flex-col sm:flex-row gap-3 justify-center"
        >
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="#event-types"
              className="inline-block px-7 py-3 rounded-full bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition"
            >
              Start your enquiry
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              href={`/e/${demoCode}`}
              className="inline-block px-7 py-3 rounded-full border font-medium transition"
              style={{ borderColor: `${cur.color}66`, color: cur.color }}
            >
              See a live demo →
            </Link>
          </motion.div>
        </motion.div>

        <motion.a
          href="#how"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.3em] flex flex-col items-center gap-2"
          aria-label="Scroll to learn more"
        >
          Scroll
          <motion.span
            animate={reduce ? undefined : { y: [0, 6, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            className="text-base"
          >
            ↓
          </motion.span>
        </motion.a>
      </div>

      {/* Ultimate mode holographic watermarks */}
      {ultimate && !reduce && (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.p
            className="absolute left-6 top-1/3 text-[8px] font-mono uppercase tracking-[0.6em] text-[#00f0ff]/20"
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            SYSTEM ONLINE
          </motion.p>
          <motion.p
            className="absolute right-8 bottom-1/4 text-[8px] font-mono uppercase tracking-[0.6em] text-[#8b5cf6]/20"
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 4, delay: 1, repeat: Infinity }}
          >
            EVENT MATRIX v3.0
          </motion.p>
          <motion.div
            className="absolute left-1/2 top-0 h-full w-px"
            style={{ background: "linear-gradient(180deg, transparent, #00f0ff11, transparent)" }}
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 3, delay: 0.5, repeat: Infinity }}
          />
          <motion.div
            className="absolute left-1/3 top-0 h-full w-px"
            style={{ background: "linear-gradient(180deg, transparent, #8b5cf611, transparent)" }}
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ duration: 4, delay: 2, repeat: Infinity }}
          />
        </div>
      )}
    </section>
  );
}
