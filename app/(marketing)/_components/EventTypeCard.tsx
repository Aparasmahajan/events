"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

type Props = {
  href: string;
  emoji: string;
  label: string;
  description: string;
  index: number;
};

export function EventTypeCard({ href, emoji, label, description, index }: Props) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: "easeOut" }}
    >
      <Link
        href={href}
        className="group block rounded-2xl border border-black/10 p-6 bg-white hover:border-black/40 hover:shadow-lg transition relative overflow-hidden"
      >
        <motion.span
          className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100 transition"
          style={{ background: "radial-gradient(circle, #a3792c33, transparent 70%)" }}
        />
        <motion.div
          whileHover={reduce ? undefined : { scale: 1.15, rotate: -5 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="text-4xl mb-3 inline-block"
        >
          {emoji}
        </motion.div>
        <h3 className="font-display text-2xl">{label}</h3>
        <p className="opacity-70 mt-2 text-sm">{description}</p>
        <p className="mt-4 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
          Browse templates <span>→</span>
        </p>
      </Link>
    </motion.div>
  );
}
