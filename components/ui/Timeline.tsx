import type { SubEvent } from "@/lib/types";
import { ScrollReveal } from "./ScrollReveal";

export function Timeline({ items }: { items: SubEvent[] }) {
  if (!items.length) return null;
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <ol className="relative border-l-2 border-[var(--accent)]/40 pl-6 sm:pl-10 space-y-10">
      {sorted.map((s, i) => (
        <ScrollReveal key={`${s.eventCode}-${s.order}`} delay={i * 0.05}>
          <li className="relative">
            <span className="absolute -left-[35px] sm:-left-[51px] top-1 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[var(--accent)] text-white flex items-center justify-center text-sm sm:text-base shadow-md">
              {s.icon ?? s.order}
            </span>
            <h3 className="font-display text-2xl">{s.name}</h3>
            <p className="text-sm opacity-70 mt-1">
              {[s.date, s.startTime && `${s.startTime}${s.endTime ? ` – ${s.endTime}` : ""}`]
                .filter(Boolean)
                .join(" · ")}
            </p>
            {s.venueName && <p className="text-sm mt-1">{s.venueName}{s.venueAddress ? `, ${s.venueAddress}` : ""}</p>}
            {s.dressCode && (
              <p className="text-xs uppercase tracking-widest opacity-70 mt-2">Dress: {s.dressCode}</p>
            )}
            {s.description && <p className="mt-3 opacity-90">{s.description}</p>}
          </li>
        </ScrollReveal>
      ))}
    </ol>
  );
}
