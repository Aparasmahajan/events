"use client";

import { useEffect, useState } from "react";

type Item = { id: string; label: string };

export function StickyNav({ items, brand }: { items: Item[]; brand: string }) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    items.forEach((i) => {
      const el = document.getElementById(i.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav className="sticky top-0 z-30 backdrop-blur bg-white/70 border-b border-black/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <a href="#top" className="font-display text-lg truncate">{brand}</a>
        <button
          className="sm:hidden p-2"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle nav"
          aria-expanded={open}
        >
          <span className="block w-5 h-0.5 bg-black mb-1" />
          <span className="block w-5 h-0.5 bg-black mb-1" />
          <span className="block w-5 h-0.5 bg-black" />
        </button>
        <ul className="hidden sm:flex gap-6 text-sm">
          {items.map((i) => (
            <li key={i.id}>
              <a
                href={`#${i.id}`}
                className={`hover:text-[var(--accent)] transition ${active === i.id ? "text-[var(--accent)] font-medium" : ""}`}
              >
                {i.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
      {open && (
        <ul className="sm:hidden border-t border-black/5 bg-white px-4 py-2">
          {items.map((i) => (
            <li key={i.id}>
              <a
                href={`#${i.id}`}
                onClick={() => setOpen(false)}
                className="block py-2 text-sm"
              >
                {i.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
