"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { TAG_LABELS } from "@/components/templates/metadata";
import { getDemoCodeForTemplate } from "@/lib/dummyData";
import type { EventType, TemplateMeta, TemplateTag } from "@/lib/types";

type Props = {
  eventType: EventType;
  initialTemplates: TemplateMeta[];
};

export function TemplatePicker({ eventType, initialTemplates }: Props) {
  const allTags = useMemo(() => {
    const set = new Set<TemplateTag>();
    initialTemplates.forEach((t) => t.tags.forEach((tag) => set.add(tag)));
    return Array.from(set);
  }, [initialTemplates]);

  const [selected, setSelected] = useState<TemplateTag[]>([]);

  const toggle = (tag: TemplateTag) =>
    setSelected((cur) => (cur.includes(tag) ? cur.filter((t) => t !== tag) : [...cur, tag]));

  const visible = useMemo(() => {
    if (selected.length === 0) return initialTemplates;
    return initialTemplates.filter((t) => selected.some((tag) => t.tags.includes(tag)));
  }, [selected, initialTemplates]);

  return (
    <>
      <div className="mb-10">
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
        <p className="text-center py-16 opacity-70">No templates match those tags yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((t) => {
            const demoCode = getDemoCodeForTemplate(t.id);
            return (
              <div
                key={t.id}
                className="group rounded-2xl overflow-hidden border border-black/10 hover:border-black/40 hover:shadow-lg transition bg-white flex flex-col"
              >
                <Link href={`/events/${eventType}/${t.id}`} className="block">
                  <div
                    className="aspect-[4/3] bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url('${t.previewImage}')` }}
                  />
                </Link>
                <div className="p-5 flex-1 flex flex-col">
                  <Link href={`/events/${eventType}/${t.id}`} className="block">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display text-2xl">{t.name}</h3>
                      <span className="text-xs opacity-60 mt-1.5">→</span>
                    </div>
                    <p className="opacity-70 text-sm mt-1.5">{t.description}</p>
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
                    {demoCode ? (
                      <Link
                        href={`/e/${demoCode}`}
                        target="_blank"
                        className="text-sm font-medium underline hover:no-underline"
                      >
                        Preview demo ↗
                      </Link>
                    ) : (
                      <span />
                    )}
                    <Link
                      href={`/events/${eventType}/${t.id}`}
                      className="text-sm font-medium px-4 py-2 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 transition"
                    >
                      Use this →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
