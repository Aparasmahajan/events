"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import { TAG_LABELS, TEMPLATES_META } from "@/components/templates/metadata";
import type { TemplateTag } from "@/lib/types";

const FEATURED_TAGS: TemplateTag[] = [
  "cool",
  "decent",
  "appealing",
  "elegant",
  "royal",
  "minimal",
  "modern",
  "vibrant",
  "romantic",
  "luxurious",
  "playful",
  "bold",
];

export function LandingTemplates() {
  const reduce = useReducedMotion();
  const [tag, setTag] = useState<TemplateTag | "all">("all");

  const filtered = useMemo(() => {
    if (tag === "all") return TEMPLATES_META;
    return TEMPLATES_META.filter((t) => t.tags.includes(tag));
  }, [tag]);

  return (
    <>
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        <FilterPill active={tag === "all"} onClick={() => setTag("all")}>
          All
        </FilterPill>
        {FEATURED_TAGS.map((t) => (
          <FilterPill key={t} active={tag === t} onClick={() => setTag(t)}>
            {TAG_LABELS[t] ?? t}
          </FilterPill>
        ))}
      </div>

      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence mode="popLayout">
          {filtered.map((t, i) => {
            // Preview each template with a demo of its primary event type, so
            // e.g. Modern shows a wedding rather than its corporate seed event.
            const previewHref = `/events/${t.eventTypes[0]}/${t.id}/preview`;
            return (
              <motion.div
                key={t.id}
                layout
                initial={reduce ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.45, delay: i * 0.05, ease: "easeOut" }}
                whileHover={reduce ? undefined : { y: -4 }}
                className="rounded-2xl overflow-hidden border border-black/10 bg-white flex flex-col group"
              >
                <Link href={previewHref} className="block overflow-hidden">
                  <div
                    className="aspect-[4/3] bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url('${t.previewImage}')` }}
                  />
                </Link>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-2xl">{t.name}</h3>
                    <div
                      className="w-3 h-3 rounded-full flex-none mt-2"
                      style={{ background: t.defaults.accentColor }}
                      title="Accent color"
                    />
                  </div>
                  <p className="opacity-70 text-sm mt-1">{t.description}</p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {t.tags.slice(0, 5).map((tg) => (
                      <span
                        key={tg}
                        className="text-[10px] uppercase tracking-widest px-2 py-1 rounded-full bg-black/5"
                      >
                        {TAG_LABELS[tg] ?? tg}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3 pt-3 border-t border-black/5">
                    <Link
                      href={previewHref}
                      className="text-sm font-medium underline hover:no-underline"
                    >
                      Preview demo ↗
                    </Link>
                    <Link
                      href={`${previewHref}?edit=1`}
                      className="text-xs px-2.5 py-1 rounded-full border border-black/15 hover:bg-black/5"
                      title="Open the demo with the edit panel"
                    >
                      ✎ Try editing
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <p className="text-center py-12 opacity-70">No templates with that vibe yet.</p>
      )}
    </>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`text-xs px-3 py-1.5 rounded-full border transition ${
        active
          ? "bg-neutral-900 text-white border-neutral-900"
          : "bg-white text-neutral-700 border-black/15 hover:border-black/40"
      }`}
    >
      {children}
    </motion.button>
  );
}
