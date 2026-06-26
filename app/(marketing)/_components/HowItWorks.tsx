"use client";

import { motion, useReducedMotion } from "framer-motion";

const STEPS = [
  {
    n: 1,
    title: "Pick a template",
    body: "Browse vibes — royal, minimal, vibrant, modern, pastel — and preview each as a live demo.",
    color: "#a3792c",
  },
  {
    n: 2,
    title: "Send us the details",
    body: "A short enquiry form. We'll call to confirm, lock in copy, and collect media.",
    color: "#7c3aed",
  },
  {
    n: 3,
    title: "Your site goes live",
    body: "We publish at /e/your-event-code, share the QR with your guests, and you're done.",
    color: "#ff5fa2",
  },
];

export function HowItWorks() {
  const reduce = useReducedMotion();
  return (
    <div className="grid sm:grid-cols-3 gap-6">
      {STEPS.map((s, i) => (
        <motion.div
          key={s.n}
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, delay: i * 0.12, ease: "easeOut" }}
          className="relative p-6 rounded-2xl border border-black/10 bg-white overflow-hidden"
        >
          <div
            className="absolute -top-12 -left-12 w-32 h-32 rounded-full opacity-25"
            style={{ background: `radial-gradient(circle, ${s.color}, transparent 70%)` }}
          />
          <div
            className="relative h-12 w-12 rounded-full flex items-center justify-center font-display text-xl text-white mb-4"
            style={{ background: s.color }}
          >
            {s.n}
          </div>
          <h3 className="font-display text-2xl mb-2 relative">{s.title}</h3>
          <p className="opacity-70 text-sm leading-relaxed relative">{s.body}</p>
        </motion.div>
      ))}
    </div>
  );
}
