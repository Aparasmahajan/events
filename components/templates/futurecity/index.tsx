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

const BUILDINGS = [
  { x: 4, w: 7, h: 32, roof: "flat", windows: 4 },
  { x: 12, w: 9, h: 48, roof: "antenna", windows: 6 },
  { x: 22, w: 6, h: 26, roof: "flat", windows: 3 },
  { x: 29, w: 11, h: 62, roof: "pyramid", windows: 8 },
  { x: 41, w: 8, h: 40, roof: "flat", windows: 5 },
  { x: 50, w: 12, h: 72, roof: "antenna", windows: 9 },
  { x: 63, w: 7, h: 36, roof: "flat", windows: 4 },
  { x: 71, w: 10, h: 54, roof: "pyramid", windows: 7 },
  { x: 82, w: 8, h: 44, roof: "flat", windows: 5 },
  { x: 91, w: 6, h: 30, roof: "antenna", windows: 3 },
];

const HIGHWAYS = [
  { d: "M -20 220 Q 400 140 820 220", delay: 0 },
  { d: "M -20 340 Q 500 260 820 340", delay: 0.3 },
  { d: "M -20 460 Q 300 400 820 460", delay: 0.6 },
];

function CityBackdrop({ reduce, progress, accent, growth }: { reduce: boolean; progress: any; accent: string; growth: string }) {
  return (
    <div aria-hidden className="absolute inset-x-0 bottom-0 h-[65%] overflow-hidden pointer-events-none">
      <svg viewBox="0 0 800 480" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c8d8e8" stopOpacity="0" />
            <stop offset="100%" stopColor="#88a4c2" stopOpacity="0.35" />
          </linearGradient>
          <linearGradient id="bldg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f4f2ec" />
            <stop offset="100%" stopColor="#d8dde5" />
          </linearGradient>
        </defs>
        <rect width="800" height="480" fill="url(#sky)" />
        <circle cx="640" cy="90" r="42" fill="#f4b640" opacity="0.28" />

        {BUILDINGS.map((b, i) => {
          const xPx = (b.x / 100) * 800;
          const wPx = (b.w / 100) * 800;
          const targetH = b.h * 4;
          const baseY = 480;
          return (
            <motion.g
              key={i}
              initial={reduce ? { y: 0 } : { y: targetH }}
              animate={reduce ? { y: 0 } : { y: 0 }}
              transition={{ duration: 1.4, delay: 0.15 + i * 0.08, ease: EASE }}
            >
              <rect x={xPx} y={baseY - targetH} width={wPx} height={targetH} fill="url(#bldg)" stroke="#2a2e3a" strokeWidth="0.6" opacity="0.85" />
              {Array.from({ length: b.windows }).map((_, wi) => (
                <rect
                  key={wi}
                  x={xPx + 3}
                  y={baseY - targetH + 8 + wi * 8}
                  width={wPx - 6}
                  height={3}
                  fill={wi % 3 === 0 ? accent : "#2a2e3a"}
                  opacity={wi % 3 === 0 ? 0.7 : 0.35}
                />
              ))}
              {b.roof === "antenna" && (
                <line x1={xPx + wPx / 2} y1={baseY - targetH} x2={xPx + wPx / 2} y2={baseY - targetH - 18} stroke="#2a2e3a" strokeWidth="1" />
              )}
              {b.roof === "pyramid" && (
                <polygon
                  points={`${xPx},${baseY - targetH} ${xPx + wPx / 2},${baseY - targetH - 14} ${xPx + wPx},${baseY - targetH}`}
                  fill={growth}
                  opacity="0.8"
                />
              )}
            </motion.g>
          );
        })}

        {HIGHWAYS.map((h, i) => (
          <motion.path
            key={i}
            d={h.d}
            fill="none"
            stroke={accent}
            strokeWidth="1.4"
            strokeDasharray="4 6"
            opacity="0.5"
            initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
            animate={reduce ? { pathLength: 1 } : { pathLength: 1 }}
            transition={{ duration: 2.2, delay: 1 + h.delay, ease: "easeInOut" }}
          />
        ))}
      </svg>
    </div>
  );
}

function Highway({ delay = 0, accent }: { delay?: number; accent: string }) {
  const reduce = useReducedMotion();
  return (
    <svg viewBox="0 0 800 60" preserveAspectRatio="none" className="my-10 h-12 w-full opacity-70">
      <motion.path
        d="M -20 30 Q 400 -20 820 30"
        fill="none"
        stroke={accent}
        strokeWidth="1.2"
        strokeDasharray="4 5"
        initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
        whileInView={reduce ? undefined : { pathLength: 1 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 1.6, delay, ease: "easeInOut" }}
      />
      <motion.circle
        cx="400" cy="15" r="3" fill={accent}
        initial={reduce ? { opacity: 1 } : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: delay + 1.4 }}
      />
    </svg>
  );
}

function DistrictCard({ s, i, accent, growth }: { s: SubEvent; i: number; accent: string; growth: string }) {
  const reduce = useReducedMotion();
  const hBars = [22, 34, 18, 28, 40, 24, 32].slice(0, 4 + (i % 3));
  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
      whileHover={reduce ? undefined : { y: -3, borderColor: accent }}
      className="group relative flex gap-4 rounded-lg border border-[#2a2e3a]/15 bg-[#f4f2ec] p-5 transition-colors"
    >
      <div className="flex w-16 shrink-0 items-end justify-around gap-0.5 border-r border-[#2a2e3a]/10 pr-3">
        {hBars.map((h, bi) => (
          <div
            key={bi}
            className="w-1.5 rounded-t-sm"
            style={{
              height: `${h}px`,
              background: bi === hBars.length - 1 ? accent : "#2a2e3a",
              opacity: bi === hBars.length - 1 ? 0.85 : 0.35,
            }}
          />
        ))}
      </div>
      <div className="flex-1">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em]" style={{ color: growth }}>
          District {String(s.order).padStart(2, "0")}
        </p>
        <h3 className="mt-1 font-display text-lg font-semibold tracking-tight text-[#2a2e3a]">{s.name}</h3>
        <p className="mt-1 font-mono text-[11px] tracking-wide text-[#2a2e3a]/60">
          {[s.date, s.startTime].filter(Boolean).join(" · ")}
        </p>
        {s.venueName && <p className="mt-2 text-sm text-[#2a2e3a]/70">@ {s.venueName}</p>}
        {s.description && <p className="mt-2 text-sm leading-relaxed text-[#2a2e3a]/70">{s.description}</p>}
        <div className="mt-3 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[#2a2e3a]/50">
          <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
          {8 + i * 3} connections
        </div>
      </div>
    </motion.article>
  );
}

export const FuturecityTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || "#3fc088";
  const growth = "#3fc088";
  const warm = "#f4b640";
  const tagline = event.tagline?.trim() || "Where connections build the skyline.";
  const invitationMessage =
    event.invitationMessage?.trim() ||
    "One evening. Every conversation adds a floor. Every handshake paves a road. By the time we leave, we've built a city together.";
  const aboutStory = event.aboutStory?.trim() || "";
  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const hero =
    event.heroImageUrl ||
    "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1800&q=80";

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroTextY = useTransform(heroP, [0, 1], [0, -60]);
  const heroOpacity = useTransform(heroP, [0, 0.7], [1, 0]);

  const showStory = !event.hideStory;
  const showDistricts = !event.hideEvents && subEvents.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  return (
    <div
      className="relative min-h-screen overflow-x-clip bg-[#f4f2ec] font-sans text-[#2a2e3a] antialiased"
      style={{ "--accent": accent } as React.CSSProperties}
    >
      <ScrollProgress color={accent} />

      {/* ─── 01. SKYLINE HERO ─── */}
      <section
        ref={heroRef}
        className="relative min-h-[100svh] flex items-start justify-center overflow-hidden pb-24 sm:pb-28"
        style={{ background: "linear-gradient(180deg, #c8d8e8 0%, #dbe5ee 55%, #f4f2ec 100%)" }}
      >
        <div className="absolute inset-0 opacity-25">
          <HeroMedia imageSrc={hero} videoSrc={event.heroVideoUrl || undefined} alt={event.eventTitle} />
        </div>

        <CityBackdrop reduce={reduce} progress={heroP} accent={accent} growth={growth} />

        <motion.div
          style={reduce ? undefined : { y: heroTextY, opacity: heroOpacity }}
          className="relative z-10 mx-auto max-w-4xl px-6 pt-20 text-center sm:pt-28"
        >
          <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.4em]" style={{ color: growth }}>
            {tagline}
          </p>
          <h1 className="font-display text-[clamp(2.6rem,8vw,5.6rem)] font-black leading-[0.95] tracking-tight text-[#2a2e3a]">
            {event.eventTitle}
          </h1>
          <div className="mt-6 flex flex-wrap justify-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-[#2a2e3a]/70">
            {event.mainDate && (
              <span>
                {new Date(event.mainDate).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            )}
            {event.mainStartTime && (
              <>
                <span className="opacity-40">/</span>
                <span>{event.mainStartTime}</span>
              </>
            )}
            {event.city && (
              <>
                <span className="opacity-40">/</span>
                <span>{event.city}</span>
              </>
            )}
          </div>
          <div className="mt-5 flex justify-center gap-1.5">
            <span className="inline-block h-1 w-8 rounded-full" style={{ background: accent }} />
            <span className="inline-block h-1 w-3 rounded-full" style={{ background: warm }} />
            <span className="inline-block h-1 w-5 rounded-full bg-[#2a2e3a]/40" />
          </div>
        </motion.div>
      </section>

      {/* ─── 02. INVITATION / STORY ─── */}
      {showStory && (
        <section className="relative mx-auto max-w-5xl px-6 py-24 sm:py-32">
          <Highway accent={accent} />
          <div className="grid items-start gap-10 sm:grid-cols-[1fr_1.4fr] sm:gap-16">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.4em]" style={{ color: growth }}>
                Blueprint 01
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold leading-[1.1] tracking-tight sm:text-4xl">
                {invitationMessage}
              </h2>
            </div>
            <div>
              <p className="text-base leading-relaxed text-[#2a2e3a]/70 sm:text-lg">
                {aboutStory ||
                  "Every guest is a landmark. Every introduction opens a street. We're not just meeting tonight — we're mapping something that stays on the horizon long after the lights come down."}
              </p>
              <div className="mt-8 grid grid-cols-3 gap-3">
                {[
                  { k: "Districts", v: subEvents.length || 4 },
                  { k: "Highways", v: 3 },
                  { k: "Skyline", v: "∞" },
                ].map((s) => (
                  <div key={s.k} className="rounded-lg border border-[#2a2e3a]/15 bg-white/60 p-3 text-center">
                    <p className="font-display text-2xl font-bold" style={{ color: accent }}>{s.v}</p>
                    <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.28em] text-[#2a2e3a]/60">{s.k}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── 03. DISTRICTS (sub-events) ─── */}
      {showDistricts && (
        <section className="relative mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <Highway delay={0.1} accent={accent} />
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.4em]" style={{ color: growth }}>
                The Districts
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                Neighborhoods of the night
              </h2>
            </div>
            <p className="hidden sm:block font-mono text-[10px] uppercase tracking-[0.28em] text-[#2a2e3a]/50">
              {subEvents.length} zones · 1 city
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[...subEvents].sort((a, b) => a.order - b.order).map((s, i) => (
              <DistrictCard key={s.order} s={s} i={i} accent={accent} growth={growth} />
            ))}
          </div>
        </section>
      )}

      {/* ─── 04. GALLERY ─── */}
      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <p className="mb-8 text-center font-mono text-[10px] uppercase tracking-[0.4em]" style={{ color: growth }}>
            Postcards from the skyline
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((m, i) => (
              <motion.figure
                key={`${m.fileName}-${i}`}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="group overflow-hidden rounded-lg border border-[#2a2e3a]/10 bg-white"
              >
                <img
                  src={m.publicUrl}
                  alt={m.caption ?? ""}
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {m.caption && (
                  <figcaption className="border-t border-[#2a2e3a]/10 bg-[#f4f2ec] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[#2a2e3a]/60">
                    {m.caption}
                  </figcaption>
                )}
              </motion.figure>
            ))}
            {editing && galleryItems.length === 0 && (
              <div className="col-span-full flex h-48 items-center justify-center rounded-lg border border-dashed border-[#2a2e3a]/30 font-mono text-xs uppercase tracking-[0.3em] text-[#2a2e3a]/50">
                + Add photos
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── 05. VENUE ─── */}
      {showVenue && (
        <section className="relative mx-auto max-w-5xl px-6 py-20 sm:py-28">
          <Highway delay={0.2} accent={accent} />
          <div className="mb-6 flex items-baseline justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.4em]" style={{ color: growth }}>
                City Center
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                {event.venueName || "The venue"}
              </h2>
            </div>
            {event.latitude != null && event.longitude != null && (
              <p className="hidden sm:block font-mono text-[10px] tracking-[0.2em] text-[#2a2e3a]/50">
                {event.latitude.toFixed(4)}° / {event.longitude.toFixed(4)}°
              </p>
            )}
          </div>
          <div className="overflow-hidden rounded-xl border border-[#2a2e3a]/15 bg-white">
            <MapEmbed
              latitude={event.latitude}
              longitude={event.longitude}
              venueName={event.venueName}
              venueAddress={event.venueAddress}
              mapLink={event.mapLink}
            />
          </div>
        </section>
      )}

      {/* ─── 06. CTA / RSVP — the city we built ─── */}
      <section className="relative overflow-hidden px-6 py-28 text-center sm:py-40" style={{ background: "linear-gradient(180deg, #f4f2ec 0%, #dbe5ee 100%)" }}>
        <svg viewBox="0 0 800 200" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-40 w-full">
          {BUILDINGS.map((b, i) => {
            const xPx = (b.x / 100) * 800;
            const wPx = (b.w / 100) * 800;
            const targetH = b.h * 2.4;
            return (
              <motion.rect
                key={i}
                x={xPx}
                width={wPx}
                fill="#2a2e3a"
                opacity="0.85"
                initial={reduce ? { y: 200 - targetH, height: targetH } : { y: 200, height: 0 }}
                whileInView={reduce ? undefined : { y: 200 - targetH, height: targetH }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 1.2, delay: i * 0.08, ease: EASE }}
              />
            );
          })}
        </svg>
        <div className="relative z-10 mx-auto max-w-3xl">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.5em]" style={{ color: growth }}>
            The city we built tonight
          </p>
          <h2 className="font-display text-[clamp(2rem,6vw,4rem)] font-black leading-[0.95] tracking-tight">
            {event.eventTitle}
          </h2>
          {event.person1Name && (
            <p className="mt-3 font-mono text-xs uppercase tracking-[0.35em] text-[#2a2e3a]/70">
              hosted by {event.person1Name}
            </p>
          )}
          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <motion.div whileHover={reduce ? undefined : { y: -2 }} className="mt-10 inline-block">
              <a
                href={event.rsvpLinkOrContact}
                target="_blank"
                rel="noreferrer"
                className="inline-block rounded-full px-10 py-3.5 font-mono text-xs uppercase tracking-[0.35em] transition-shadow"
                style={{ background: accent, color: "#f4f2ec", boxShadow: `0 8px 24px -12px ${accent}` }}
              >
                Claim your plot
              </a>
            </motion.div>
          )}
        </div>
      </section>

      <footer className="border-t border-[#2a2e3a]/10 bg-[#f4f2ec] py-8 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-[#2a2e3a]/50">
        <p>
          {event.eventTitle}
          {event.person1Name ? ` · ${event.person1Name}` : ""} · A city built in one evening
        </p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default FuturecityTemplate;
