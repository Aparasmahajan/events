"use client";

import { useMemo, useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { HeroMedia } from "@/components/ui/HeroMedia";
import { MapEmbed } from "@/components/ui/MapEmbed";
import { MusicToggle } from "@/components/ui/MusicToggle";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { useEditMode } from "@/components/edit/EditContext";
import type { TemplateComponent, SubEvent } from "@/lib/types";

const EASE = [0.16, 1, 0.3, 1] as const;

const HIGHWAYS = [
  { top: "18%", cars: 5, speed: 14, color: "#1c9dff" },
  { top: "36%", cars: 4, speed: 18, color: "#40ff9a" },
  { top: "54%", cars: 6, speed: 12, color: "#ffaa2e" },
  { top: "72%", cars: 3, speed: 22, color: "#1c9dff" },
  { top: "88%", cars: 5, speed: 16, color: "#40ff9a" },
];

const GRID_PULSE_PATH = [
  { x: 10, y: 10 },
  { x: 70, y: 10 },
  { x: 70, y: 40 },
  { x: 30, y: 40 },
  { x: 30, y: 80 },
  { x: 90, y: 80 },
];

function CityField({ reduce, accent }: { reduce: boolean; accent: string }) {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden bg-[#0a121e]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a121e] via-[#111c2e] to-[#1a2438]" />
      <svg className="absolute inset-0 h-full w-full opacity-[0.18]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="dc-grid" width="80" height="80" patternUnits="userSpaceOnUse" patternTransform="skewX(-20) scale(1,0.55)">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#1c9dff" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dc-grid)" />
      </svg>
      {!reduce && (
        <>
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <motion.circle
              r="0.9"
              fill={accent}
              filter="drop-shadow(0 0 3px currentColor)"
              style={{ color: accent }}
              initial={{ cx: GRID_PULSE_PATH[0].x, cy: GRID_PULSE_PATH[0].y, opacity: 0 }}
              animate={{
                cx: GRID_PULSE_PATH.map((p) => p.x),
                cy: GRID_PULSE_PATH.map((p) => p.y),
                opacity: [0, 1, 1, 1, 1, 0],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear", repeatDelay: 1.5 }}
            />
          </svg>
          <div className="absolute inset-0">
            {HIGHWAYS.map((h, i) => (
              <div key={i} className="absolute inset-x-0 h-px" style={{ top: h.top, background: `linear-gradient(90deg, transparent, ${h.color}30, transparent)` }}>
                {Array.from({ length: h.cars }).map((_, c) => (
                  <motion.span
                    key={c}
                    className="absolute -top-[2px] h-[4px] w-3 rounded-sm"
                    style={{ background: h.color, boxShadow: `0 0 6px ${h.color}` }}
                    initial={{ left: `${-10 + (c * 100) / h.cars}%` }}
                    animate={{ left: ["-10%", "110%"] }}
                    transition={{ duration: h.speed, delay: (c * h.speed) / h.cars, repeat: Infinity, ease: "linear" }}
                  />
                ))}
              </div>
            ))}
          </div>
        </>
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a121e]/60 via-transparent to-[#0a121e]/90" />
    </div>
  );
}

function CityBlockIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke={color} strokeWidth="1.5" aria-hidden>
      <rect x="3" y="10" width="5" height="10" />
      <rect x="10" y="4" width="5" height="16" />
      <rect x="17" y="8" width="4" height="12" />
      <line x1="11.5" y1="8" x2="13.5" y2="8" />
      <line x1="11.5" y1="12" x2="13.5" y2="12" />
      <line x1="11.5" y1="16" x2="13.5" y2="16" />
    </svg>
  );
}

function BlockCard({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      whileHover={reduce ? undefined : { y: -3, borderColor: "var(--accent)" }}
      className="relative rounded-lg border border-[#1c9dff]/20 bg-[#0a121e]/70 p-6 backdrop-blur-md transition-colors"
    >
      <div className="pointer-events-none absolute -inset-px rounded-lg" style={{ background: "linear-gradient(135deg, rgba(28,157,255,0.08), transparent 50%)" }} />
      <div className="relative">{children}</div>
    </motion.div>
  );
}

function addressFor(s: SubEvent, i: number) {
  const sector = String((i % 9) + 1).padStart(2, "0");
  const block = String(((i * 7) % 20) + 1).padStart(2, "0");
  const time = s.startTime || "00:00";
  return `SECTOR ${sector} / BLOCK ${block} / ${time}`;
}

function AgendaGrid({ items, accent }: { items: SubEvent[]; accent: string }) {
  const reduce = useReducedMotion();
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <div className="mx-auto max-w-5xl px-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {sorted.map((s, i) => (
          <motion.article
            key={s.order}
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
          >
            <BlockCard delay={i * 0.04}>
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <CityBlockIcon color={accent} />
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: accent }}>
                    {addressFor(s, i)}
                  </span>
                </div>
                <span className="font-mono text-[10px] tracking-wider opacity-40">#{String(s.order).padStart(3, "0")}</span>
              </div>
              <h3 className="font-display text-xl font-semibold tracking-tight text-[#e6ecf5]">{s.name}</h3>
              {s.venueName && <p className="mt-1 font-mono text-xs opacity-55">// {s.venueName}</p>}
              {s.description && <p className="mt-3 text-sm leading-relaxed opacity-65">{s.description}</p>}
              {s.dressCode && (
                <p className="mt-4 inline-block rounded-sm border border-[#40ff9a]/30 bg-[#40ff9a]/5 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: "#40ff9a" }}>
                  {s.dressCode}
                </p>
              )}
              {(s.date || s.endTime) && (
                <div className="mt-4 flex items-center gap-2 border-t border-[#1c9dff]/10 pt-3 font-mono text-[10px] opacity-50">
                  {s.date && <span>{s.date}</span>}
                  {s.date && s.endTime && <span>·</span>}
                  {s.endTime && <span>ends {s.endTime}</span>}
                </div>
              )}
            </BlockCard>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

function VenueMap({ accent }: { accent: string }) {
  const reduce = useReducedMotion();
  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border border-[#1c9dff]/20 bg-[#0a121e]">
      <svg viewBox="0 0 400 225" className="absolute inset-0 h-full w-full">
        <defs>
          <pattern id="mini-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1c9dff" strokeWidth="0.4" opacity="0.35" />
          </pattern>
        </defs>
        <rect width="400" height="225" fill="url(#mini-grid)" />
        <g stroke="#1c9dff" strokeWidth="0.6" opacity="0.5" fill="none">
          <path d="M 0 80 L 400 80" />
          <path d="M 0 150 L 400 150" />
          <path d="M 120 0 L 120 225" />
          <path d="M 260 0 L 260 225" />
        </g>
        <g fill="#1c9dff" opacity="0.2">
          <rect x="30" y="30" width="60" height="35" />
          <rect x="140" y="20" width="90" height="45" />
          <rect x="280" y="35" width="80" height="30" />
          <rect x="30" y="100" width="70" height="35" />
          <rect x="280" y="100" width="90" height="35" />
          <rect x="30" y="170" width="80" height="35" />
          <rect x="140" y="170" width="70" height="35" />
          <rect x="280" y="170" width="80" height="35" />
        </g>
        <g>
          {!reduce && (
            <motion.circle
              cx="200"
              cy="112"
              r="12"
              fill={accent}
              opacity="0.3"
              animate={{ r: [10, 22, 10], opacity: [0.35, 0, 0.35] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
            />
          )}
          <circle cx="200" cy="112" r="4" fill={accent} />
          <circle cx="200" cy="112" r="2" fill="#0a121e" />
        </g>
      </svg>
      <div className="absolute left-4 top-4 font-mono text-[10px] uppercase tracking-[0.25em] opacity-60">
        <span style={{ color: accent }}>◉</span> Live venue · sector 05
      </div>
      <div className="absolute bottom-4 right-4 font-mono text-[10px] tracking-wider opacity-50">
        40.7128° N / 74.0060° W
      </div>
    </div>
  );
}

export const DigitalcityTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || "#1c9dff";
  const tagline = event.tagline?.trim() || "The city runs on ideas.";
  const invitationMessage =
    event.invitationMessage?.trim() ||
    "Enter a megacity built for conversation — signals, streets, and speakers routed to converge on one place.";
  const aboutStory = event.aboutStory?.trim() || "";
  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const hero =
    event.heroImageUrl ||
    "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1600&q=80";

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(heroP, [0, 1], [1, 0.92]);
  const heroTextY = useTransform(heroP, [0, 0.5], [0, -40]);
  const heroOpacity = useTransform(heroP, [0, 0.6], [1, 0]);

  const showStory = !event.hideStory;
  const showAgenda = !event.hideEvents && subEvents.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  const heroDate = event.mainDate
    ? new Date(event.mainDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })
    : "";

  return (
    <div
      className="relative min-h-screen overflow-x-clip bg-[#0a121e] font-sans text-[#e6ecf5] antialiased"
      style={{ "--accent": accent } as React.CSSProperties}
    >
      <CityField reduce={reduce} accent={accent} />
      <ScrollProgress color={accent} />

      {/* ─── 01. SKYLINE ─── */}
      <section ref={heroRef} className="relative flex min-h-[640px] items-center justify-center overflow-hidden py-24">
        <motion.div style={reduce ? undefined : { scale: heroScale }} className="absolute inset-0">
          <HeroMedia imageSrc={hero} videoSrc={event.heroVideoUrl || undefined} alt={event.eventTitle} className="opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a121e] via-[#0a121e]/70 to-[#0a121e]/40" />
        </motion.div>

        <motion.div style={reduce ? undefined : { y: heroTextY, opacity: heroOpacity }} className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.5em]" style={{ color: accent }}>
            <span className="opacity-60">▚</span> DIGITAL CITY / GRID 2026 <span className="opacity-60">▞</span>
          </p>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="font-display text-[clamp(2.6rem,9vw,7rem)] font-black uppercase leading-[0.9] tracking-tight"
            style={{ textShadow: `0 0 40px ${accent}30` }}
          >
            {event.eventTitle}
          </motion.h1>
          <p className="mt-6 font-mono text-sm uppercase tracking-[0.35em] opacity-70" style={{ color: accent }}>
            {tagline}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-[0.25em]">
            {heroDate && <span className="opacity-75">{heroDate}</span>}
            {event.mainStartTime && <span className="opacity-40">/</span>}
            {event.mainStartTime && <span className="opacity-75">{event.mainStartTime}</span>}
            {event.city && (
              <>
                <span className="opacity-40">/</span>
                <span className="opacity-75">{event.city}</span>
              </>
            )}
          </div>
          {event.person1Name && (
            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.3em] opacity-50">
              hosted by · {event.person1Name}
            </p>
          )}
        </motion.div>

        {!reduce && (
          <motion.div
            animate={{ y: [0, 6, 0], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.4em]"
            style={{ color: accent }}
          >
            ↓ Enter grid
          </motion.div>
        )}
      </section>

      {/* ─── 02. SIGNAL ─── */}
      {showStory && (
        <section className="relative mx-auto max-w-5xl px-6 py-24 sm:py-32">
          <div className="grid items-center gap-12 sm:grid-cols-5">
            <motion.div
              initial={reduce ? false : { opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: EASE }}
              className="sm:col-span-3"
            >
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.4em]" style={{ color: accent }}>
                ◐ Signal / 001
              </p>
              <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                {invitationMessage}
              </h2>
            </motion.div>
            <motion.div
              initial={reduce ? false : { opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
              className="sm:col-span-2"
            >
              <p className="text-base leading-relaxed opacity-70">
                {aboutStory ||
                  "One day. Every district reporting in. The city becomes a stage, the streets become an agenda, and every signal in the grid points to one address."}
              </p>
              <div className="mt-6 grid grid-cols-3 gap-3 font-mono text-[10px] uppercase tracking-wider">
                {[
                  { k: "Districts", v: "12" },
                  { k: "Speakers", v: "48" },
                  { k: "Sessions", v: String(Math.max(subEvents.length, 6)).padStart(2, "0") },
                ].map((s) => (
                  <div key={s.k} className="rounded-sm border border-[#1c9dff]/15 bg-[#1c9dff]/5 px-3 py-2">
                    <div className="text-lg font-bold tracking-tight" style={{ color: accent }}>{s.v}</div>
                    <div className="mt-0.5 opacity-50">{s.k}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ─── 03. AGENDA / DISTRICTS ─── */}
      {showAgenda && (
        <section className="relative py-20 sm:py-28">
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-14 text-center"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.5em]" style={{ color: accent }}>
              ▤ Districts of the day
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Route the agenda</h2>
          </motion.div>
          <AgendaGrid items={subEvents} accent={accent} />
        </section>
      )}

      {/* ─── 04. GALLERY / SNAPSHOTS ─── */}
      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-10 text-center font-mono text-[10px] uppercase tracking-[0.5em]"
            style={{ color: accent }}
          >
            ◫ Broadcast archive
          </motion.p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((m, i) => (
              <motion.div
                key={`${m.fileName}-${i}`}
                initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="group relative overflow-hidden rounded-lg border border-[#1c9dff]/15"
              >
                <img
                  src={m.publicUrl}
                  alt={m.caption ?? ""}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a121e]/80 via-transparent to-transparent" />
                <div className="absolute bottom-2 left-3 font-mono text-[10px] uppercase tracking-widest opacity-70">
                  frame_{String(i + 1).padStart(3, "0")}
                </div>
              </motion.div>
            ))}
            {editing && galleryItems.length === 0 && (
              <div className="col-span-full flex h-48 items-center justify-center rounded-lg border border-dashed border-[#1c9dff]/30 font-mono text-sm opacity-60">
                + Add photos
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── 05. VENUE / MAP VIEW ─── */}
      {showVenue && (
        <section className="relative mx-auto max-w-5xl px-6 py-20 sm:py-28">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-6 text-center font-mono text-[10px] uppercase tracking-[0.5em]"
            style={{ color: accent }}
          >
            ✚ Coordinates
          </motion.p>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <VenueMap accent={"#40ff9a"} />
            {event.venueName && (
              <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2 font-mono text-xs uppercase tracking-widest">
                <span className="text-base font-semibold tracking-tight" style={{ color: accent }}>
                  {event.venueName}
                </span>
                {event.venueAddress && <span className="opacity-60">{event.venueAddress}</span>}
              </div>
            )}
            <div className="mt-4 overflow-hidden rounded-lg border border-[#1c9dff]/20">
              <MapEmbed
                latitude={event.latitude}
                longitude={event.longitude}
                venueName={event.venueName}
                venueAddress={event.venueAddress}
                mapLink={event.mapLink}
              />
            </div>
          </motion.div>
        </section>
      )}

      {/* ─── 06. TRANSMISSION / RSVP ─── */}
      <section className="relative px-6 py-24 text-center sm:py-36">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE }}
          className="mx-auto max-w-3xl"
        >
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.5em]" style={{ color: accent }}>
            ◈ Transmission
          </p>
          <h2 className="font-display text-[clamp(2.2rem,6vw,4.5rem)] font-black uppercase leading-[0.95] tracking-tight">
            Route yourself in.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed opacity-70">
            The grid remembers every arrival. Add your signal and the city plans the rest.
          </p>
          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <motion.div whileHover={reduce ? undefined : { scale: 1.03 }} className="mt-10 inline-block">
              <a
                href={event.rsvpLinkOrContact}
                target="_blank"
                rel="noreferrer"
                className="inline-block rounded-sm px-10 py-4 font-mono text-xs uppercase tracking-[0.4em] transition-all"
                style={{ background: accent, color: "#0a121e" }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 0 40px ${accent}70`; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}
              >
                Confirm access →
              </a>
            </motion.div>
          )}
        </motion.div>
      </section>

      <footer className="border-t border-[#1c9dff]/10 py-8 text-center font-mono text-[10px] uppercase tracking-[0.3em] opacity-45">
        <p>
          {event.eventTitle} · sector 05 · block 12 · <span style={{ color: accent }}>online</span>
        </p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default DigitalcityTemplate;
