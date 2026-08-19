"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  TAG_LABELS,
  scoreTemplateMatch,
  sortTemplates,
  type TemplateSort,
} from "@/components/templates/metadata";
import { TemplateThumb } from "@/components/ui/TemplateThumb";
import type { EventType, TemplateMeta, TemplateTag } from "@/lib/types";

const SORT_OPTIONS: { key: TemplateSort; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "az", label: "A–Z" },
  { key: "random", label: "Surprise me" },
];

type Props = {
  eventType: EventType;
  initialTemplates: TemplateMeta[];
  /** Curated order for this event type (from the admin Featured sheet). */
  featuredIds?: string[];
};

export function TemplatePicker({ eventType, initialTemplates, featuredIds }: Props) {
  const allTags = useMemo(() => {
    const set = new Set<TemplateTag>();
    initialTemplates.forEach((t) => t.tags.forEach((tag) => set.add(tag)));
    return Array.from(set);
  }, [initialTemplates]);

  const [selected, setSelected] = useState<TemplateTag[]>([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<TemplateSort>("featured");

  const toggle = (tag: TemplateTag) =>
    setSelected((cur) =>
      cur.includes(tag) ? cur.filter((t) => t !== tag) : [...cur, tag],
    );

  const visible = useMemo(() => {
    // Tag filter first (any-of match), then search-score rank.
    const tagFiltered =
      selected.length === 0
        ? initialTemplates
        : initialTemplates.filter((t) =>
            selected.some((tag) => t.tags.includes(tag)),
          );

    // Default order follows the chosen sort. Search still ranks by relevance.
    if (!query.trim()) return sortTemplates(tagFiltered, sort, featuredIds);

    return tagFiltered
      .map((t) => ({ t, score: scoreTemplateMatch(t, query) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((x) => x.t);
  }, [selected, initialTemplates, query, sort, featuredIds]);

  return (
    <>
      {/* Sort control */}
      <div className="flex flex-wrap items-center gap-2 mb-4 text-xs">
        <span className="uppercase tracking-widest opacity-50 mr-1">Sort</span>
        {SORT_OPTIONS.map((o) => (
          <button
            key={o.key}
            onClick={() => setSort(o.key)}
            className={`px-3 py-1.5 rounded-full border transition ${
              sort === o.key
                ? "bg-neutral-900 text-white border-neutral-900"
                : "bg-white text-neutral-700 border-black/15 hover:border-black/40"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      {/* Search box — free-text describe-what-you-want */}
      <div className="mb-6">
        <label className="block">
          <span className="block text-xs uppercase tracking-widest opacity-70 mb-2">
            Describe your event
          </span>
          <div className="relative">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. black-tie wedding, kids birthday, tech product launch, afterparty…"
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
          <p className="text-[11px] opacity-60 mt-2">
            Type what you want and we&apos;ll rank the templates by relevance. Or use the tag chips below to filter by vibe.
          </p>
        </label>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs uppercase tracking-widest opacity-70">Filter by vibe</p>
          {selected.length > 0 && (
            <button
              onClick={() => setSelected([])}
              className="text-xs underline opacity-70 hover:opacity-100"
            >
              Clear filters
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => {
            const active = selected.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggle(tag)}
                className={`text-xs px-3 py-1.5 rounded-full border transition ${
                  active
                    ? "bg-neutral-900 text-white border-neutral-900"
                    : "bg-white text-neutral-700 border-black/15 hover:border-black/40"
                }`}
              >
                {TAG_LABELS[tag] ?? tag}
              </button>
            );
          })}
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="text-center py-16">
          <p className="opacity-70">
            {query
              ? `Nothing matches "${query}" for this event type.`
              : "No templates match those tags yet."}
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
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((t) => (
            <div
              key={t.id}
              className="group rounded-2xl overflow-hidden border border-black/10 hover:border-black/40 hover:shadow-lg transition bg-white flex flex-col"
            >
              <Link href={`/events/${eventType}/${t.id}`} className="block overflow-hidden">
                <TemplateThumb
                  eventType={eventType}
                  id={t.id}
                  fallback={t.previewImage}
                  alt={t.name}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Link>
              <div className="p-5 flex-1 flex flex-col">
                <Link href={`/events/${eventType}/${t.id}`} className="block">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-display text-2xl leading-tight truncate">
                        {t.icon} {t.name}
                      </h3>
                      {t.codename && (
                        <p className="text-[11px] uppercase tracking-widest opacity-50 mt-1">
                          {t.codename}
                        </p>
                      )}
                    </div>
                    <span className="text-xs opacity-60 mt-2 flex-none">→</span>
                  </div>
                  <p className="opacity-70 text-sm mt-2 leading-snug">{t.description}</p>
                </Link>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {t.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] uppercase tracking-widest px-2 py-1 rounded-full bg-black/5"
                    >
                      {TAG_LABELS[tag] ?? tag}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <Link
                    href={`/events/${eventType}/${t.id}/preview`}
                    target="_blank"
                    className="text-sm font-medium underline hover:no-underline"
                  >
                    Preview demo ↗
                  </Link>
                  <Link
                    href={`/events/${eventType}/${t.id}`}
                    className="text-sm font-medium px-4 py-2 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 transition"
                  >
                    Use this →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
