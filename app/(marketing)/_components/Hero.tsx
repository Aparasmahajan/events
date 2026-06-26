"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

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

  return (
    <section className="relative overflow-hidden min-h-[92svh] flex items-center">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 transition-[background] duration-700"
        style={{
          background: `
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
        ].map((p, idx) => (
          <motion.span
            key={idx}
            className="absolute rounded-full"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              background: cur.color,
              opacity: 0.35,
            }}
            animate={reduce ? undefined : { y: [0, -16, 0] }}
            transition={{ duration: 5, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
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
          A site for your big day
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.05 }}
          className="font-display text-5xl sm:text-7xl leading-[1.05] tracking-tight"
        >
          Beautiful{" "}
          <span className="relative inline-block align-baseline" style={{ minWidth: "5.5ch" }}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={cur.word}
                initial={{ y: 28, opacity: 0, filter: "blur(4px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                exit={{ y: -28, opacity: 0, filter: "blur(4px)" }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                style={{ color: cur.color }}
                className="inline-block font-display"
              >
                {cur.word}
              </motion.span>
            </AnimatePresence>
            <span aria-hidden className="invisible">anniversary</span>
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
          Pick an event type, choose a template, send us your details. We&apos;ll handle the rest.
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
    </section>
  );
}
