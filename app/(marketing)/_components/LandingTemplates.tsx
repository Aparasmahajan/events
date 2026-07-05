"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import { TAG_LABELS, TEMPLATES_META, scoreTemplateMatch } from "@/components/templates/metadata";
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
  "cinematic",
  "cyberpunk",
  "premium",
  "celestial",
  "organic",
  "tech",
  "artistic",
];

export function LandingTemplates() {
  const reduce = useReducedMotion();
  const [tag, setTag] = useState<TemplateTag | "all">("all");
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);

  const filtered = useMemo(() => {
    const tagFiltered =
      tag === "all"
        ? TEMPLATES_META
        : TEMPLATES_META.filter((t) => t.tags.includes(tag));
    if (!query.trim()) return tagFiltered;
    return tagFiltered
      .map((t) => ({ t, score: scoreTemplateMatch(t, query) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((x) => x.t);
  }, [tag, query]);

  // When user is actively searching or filtering by tag, show every match.
  // Otherwise show a curated first page — 2 on mobile, 6 on desktop —
  // with a "View all" toggle underneath. On mobile, items past index 1 are
  // hidden via `hidden sm:flex` on the card so the desktop grid still gets 6.
  const isBrowsing = tag === "all" && !query.trim();
  const visible =
    isBrowsing && !showAll ? filtered.slice(0, 6) : filtered;

  return (
    <>
      <div className="max-w-2xl mx-auto mb-8">
        <label className="block">
          <span className="block text-xs uppercase tracking-widest opacity-70 mb-2 text-center">
            Describe your event
          </span>
          <div className="relative">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. black-tie wedding, kids birthday, product launch, afterparty…"
              className="w-full rounded-full border border-black/15 bg-white px-5 py-3 text-sm pr-24 focus:outline-none focus:border-black/40 shadow-sm"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-widest opacity-60 hover:opacity-100 underline"
              >
                clear
              </button>
            )}
          </div>
        </label>
      </div>

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
          {visible.map((t, i) => {
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
                className={`rounded-2xl overflow-hidden border border-black/10 bg-white flex flex-col group ${
                  isBrowsing && !showAll && i >= 2 ? "hidden sm:flex" : ""
                }`}
              >
                <Link href={previewHref} className="block overflow-hidden">
                  <div
                    className="aspect-[4/3] bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url('${t.previewImage}')` }}
                  />
                </Link>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xl flex-none" aria-hidden>{t.icon}</span>
                        <h3 className="font-display text-2xl truncate">{t.name}</h3>
                      </div>
                      {t.codename && (
                        <p className="text-[10px] uppercase tracking-widest opacity-50 mt-1 ml-8">
                          {t.codename}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 flex-none mt-1.5">
                      <div
                        className="w-2.5 h-2.5 rounded-full flex-none"
                        style={{ background: t.vibe.color }}
                        title={t.vibe.label}
                      />
                      <span className="text-[9px] uppercase tracking-wider opacity-60 hidden sm:inline">{t.vibe.label}</span>
                    </div>
                  </div>
                  <p className="opacity-70 text-sm mt-2 leading-snug">{t.description}</p>
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

      {isBrowsing && !showAll && filtered.length > 6 && (
        <div className="text-center mt-10">
          <button
            onClick={() => setShowAll(true)}
            className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-6 py-3 text-sm font-medium hover:border-black/40 hover:shadow-sm transition"
          >
            View all templates <span className="opacity-60">({filtered.length})</span>
          </button>
        </div>
      )}

      {isBrowsing && showAll && (
        <div className="text-center mt-10">
          <button
            onClick={() => setShowAll(false)}
            className="text-sm underline opacity-70 hover:opacity-100"
          >
            Show fewer
          </button>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="opacity-70">
            {query
              ? `Nothing matches "${query}" yet.`
              : "No templates with that vibe yet."}
          </p>
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-sm underline mt-3 opacity-70 hover:opacity-100"
            >
              Clear search
            </button>
          )}
        </div>
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
