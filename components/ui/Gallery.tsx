"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { MediaItem } from "@/lib/types";

type Props = { items: MediaItem[]; columns?: 2 | 3 | 4 };

export function Gallery({ items, columns = 3 }: Props) {
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const next = useCallback(
    () => setOpen((i) => (i === null ? null : (i + 1) % items.length)),
    [items.length],
  );
  const prev = useCallback(
    () => setOpen((i) => (i === null ? null : (i - 1 + items.length) % items.length)),
    [items.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, next, prev]);

  if (!items.length) return null;

  const colClass =
    columns === 2 ? "sm:grid-cols-2" : columns === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <>
      <div className={`grid grid-cols-1 ${colClass} gap-3 sm:gap-4`}>
        {items.map((item, i) => (
          <button
            key={`${item.fileName}-${i}`}
            onClick={() => setOpen(i)}
            className="group relative overflow-hidden rounded-lg aspect-[4/5] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
            aria-label={`Open image ${i + 1}${item.caption ? `: ${item.caption}` : ""}`}
          >
            <Image
              src={item.publicUrl}
              alt={item.caption ?? `Gallery image ${i + 1}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            {item.caption && (
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent text-white text-sm p-3 opacity-0 group-hover:opacity-100 transition">
                {item.caption}
              </span>
            )}
          </button>
        ))}
      </div>

      {open !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 sm:left-8 text-white text-3xl p-2 hover:scale-110 transition"
            aria-label="Previous image"
          >‹</button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 sm:right-8 text-white text-3xl p-2 hover:scale-110 transition"
            aria-label="Next image"
          >›</button>
          <button
            onClick={(e) => { e.stopPropagation(); close(); }}
            className="absolute top-4 right-4 text-white text-2xl p-2"
            aria-label="Close lightbox"
          >×</button>
          <div className="relative w-full max-w-5xl aspect-[3/2]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={items[open].publicUrl}
              alt={items[open].caption ?? `Image ${open + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
            {items[open].caption && (
              <p className="absolute -bottom-10 inset-x-0 text-center text-white/90 text-sm">
                {items[open].caption}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
