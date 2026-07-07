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

const COLORS = {
  bg: "#0d1420",
  bg2: "#1a2438",
  green: "#33ff88",
  amber: "#ffb03a",
  red: "#ff5a5a",
  ivory: "#e6ecf5",
  grid: "#2a3a52",
};

const PANELS = [
  { type: "bars", label: "TELEMETRY 01" },
  { type: "wave", label: "AUDIO CH-A" },
  { type: "dots", label: "SIGNAL MAP" },
  { type: "map", label: "GLOBAL VIEW" },
  { type: "bars", label: "PWR SYS" },
  { type: "wave", label: "COMMS UPLINK" },
  { type: "dots", label: "TRAJECTORY" },
  { type: "map", label: "ORBIT PATH" },
];

function GridBackdrop({ reduce }: { reduce: boolean }) {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden" style={{ background: `linear-gradient(180deg, ${COLORS.bg} 0%, ${COLORS.bg2} 55%, ${COLORS.bg} 100%)` }}>
      <svg className="absolute inset-0 h-full w-full opacity-40" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="mc-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke={COLORS.grid} strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#mc-grid)" />
      </svg>
      {!reduce && (
        <motion.div
          aria-hidden
          className="absolute inset-x-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${COLORS.green}, transparent)`, opacity: 0.35 }}
          animate={{ y: ["0vh", "100vh"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
      )}
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 0%, ${COLORS.bg2}55, transparent 60%)` }} />
    </div>
  );
}

function MiniPanel({ type, label, i, reduce, accent }: { type: string; label: string; i: number; reduce: boolean; accent: string }) {
  const seed = i * 7 + 3;
  const bars = Array.from({ length: 8 }, (_, k) => 20 + ((seed * (k + 1) * 13) % 55));
  const dots = Array.from({ length: 12 }, (_, k) => ({
    cx: 8 + ((seed * (k + 1) * 11) % 84),
    cy: 8 + ((seed * (k + 2) * 17) % 44),
  }));

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
      className="relative overflow-hidden rounded border border-[color:var(--grid)] bg-black/40 p-2 backdrop-blur-sm"
      style={{ ["--grid" as string]: COLORS.grid }}
    >
      <div className="mb-1 flex items-center justify-between">
        <span className="font-mono text-[8px] uppercase tracking-widest" style={{ color: COLORS.green }}>{label}</span>
        <motion.span
          aria-hidden
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: accent }}
          animate={reduce ? undefined : { opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.4 + (i % 3) * 0.3, repeat: Infinity }}
        />
      </div>
      <svg viewBox="0 0 100 60" className="h-16 w-full">
        {type === "bars" && bars.map((h, k) => (
          <rect key={k} x={k * 12 + 2} y={60 - h} width="8" height={h} fill={accent} opacity={0.7} />
        ))}
        {type === "wave" && (
          <polyline
            fill="none"
            stroke={accent}
            strokeWidth="1.2"
            points={Array.from({ length: 40 }, (_, k) => {
              const x = k * 2.5;
              const y = 30 + Math.sin((k + seed) * 0.6) * 18 * (0.5 + (k % 5) * 0.1);
              return `${x},${y}`;
            }).join(" ")}
          />
        )}
        {type === "dots" && dots.map((d, k) => (
          <circle key={k} cx={d.cx} cy={d.cy} r={1.6} fill={accent} opacity={0.7} />
        ))}
        {type === "map" && (
          <>
            <ellipse cx="50" cy="30" rx="44" ry="24" fill="none" stroke={COLORS.grid} strokeWidth="0.5" />
            <ellipse cx="50" cy="30" rx="30" ry="16" fill="none" stroke={COLORS.grid} strokeWidth="0.5" />
            <path d="M12 30 Q30 20, 50 30 T88 30" fill="none" stroke={accent} strokeWidth="1" opacity="0.8" />
            <circle cx="66" cy="26" r="1.8" fill={COLORS.amber} />
          </>
        )}
      </svg>
      <div className="mt-1 flex items-center justify-between font-mono text-[8px]" style={{ color: COLORS.ivory, opacity: 0.55 }}>
        <span>NOM</span>
        <span>{String((seed * 17) % 100).padStart(2, "0")}.{String((seed * 41) % 100).padStart(2, "0")}%</span>
      </div>
    </motion.div>
  );
}

function RadarSweep({ reduce, accent }: { reduce: boolean; accent: string }) {
  return (
    <svg aria-hidden viewBox="0 0 100 100" className="h-40 w-40 sm:h-52 sm:w-52">
      <defs>
        <linearGradient id="mc-sweep" x1="50%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.9" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill="none" stroke={accent} strokeWidth="0.4" opacity="0.4" />
      <circle cx="50" cy="50" r="34" fill="none" stroke={accent} strokeWidth="0.3" opacity="0.3" />
      <circle cx="50" cy="50" r="20" fill="none" stroke={accent} strokeWidth="0.3" opacity="0.3" />
      <circle cx="50" cy="50" r="6" fill="none" stroke={accent} strokeWidth="0.3" opacity="0.5" />
      <line x1="50" y1="2" x2="50" y2="98" stroke={accent} strokeWidth="0.2" opacity="0.25" />
      <line x1="2" y1="50" x2="98" y2="50" stroke={accent} strokeWidth="0.2" opacity="0.25" />
      <motion.g
        style={{ transformOrigin: "50px 50px" }}
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
      >
        <path d="M 50 50 L 98 50 A 48 48 0 0 0 82 16 Z" fill="url(#mc-sweep)" opacity="0.6" />
      </motion.g>
      <circle cx="70" cy="34" r="1.2" fill={COLORS.amber} />
      <circle cx="30" cy="62" r="1" fill={COLORS.amber} opacity="0.7" />
    </svg>
  );
}

function StatusPill({ status, accent }: { status: string; accent: string }) {
  const color = status === "LIVE" ? COLORS.red : status === "SCHEDULED" ? accent : COLORS.grid;
  const label = status === "LIVE" ? "LIVE" : status === "SCHEDULED" ? "SCHEDULED" : "DONE";
  return (
    <span className="inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest"
      style={{ borderColor: `${color}55`, color, background: `${color}12` }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
      {label}
    </span>
  );
}

function MissionTimeline({ items, accent }: { items: SubEvent[]; accent: string }) {
  const reduce = useReducedMotion();
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <div className="mx-auto max-w-4xl px-6">
      <div className="grid gap-3">
        {sorted.map((s, i) => {
          const status = i === 0 ? "LIVE" : i < sorted.length - 1 ? "SCHEDULED" : "DONE";
          const offset = `T+${String(i).padStart(2, "0")}:${String((i * 27) % 60).padStart(2, "0")}`;
          return (
            <motion.article
              key={s.order}
              initial={reduce ? false : { opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
              className="relative overflow-hidden rounded border border-[#2a3a52] bg-black/40 p-5 backdrop-blur-sm"
            >
              <div className="mb-3 flex flex-wrap items-center gap-3 border-b border-[#2a3a52]/60 pb-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.28em]" style={{ color: accent }}>
                  MISSION TIMELINE {offset}
                </span>
                <StatusPill status={status} accent={accent} />
                <span className="ml-auto font-mono text-[10px] uppercase tracking-widest opacity-50">
                  SEQ {String(s.order).padStart(3, "0")}
                </span>
              </div>
              <h3 className="font-display text-xl uppercase tracking-tight" style={{ color: COLORS.ivory }}>{s.name}</h3>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-wider opacity-70">
                {s.date && <span>{s.date}</span>}
                {s.startTime && <span style={{ color: accent }}>{s.startTime}{s.endTime ? ` → ${s.endTime}` : ""}</span>}
                {s.venueName && <span>@ {s.venueName}</span>}
              </div>
              {s.description && <p className="mt-3 text-sm leading-relaxed opacity-70">{s.description}</p>}
              {s.dressCode && (
                <p className="mt-3 inline-block border border-[#2a3a52] px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.24em] opacity-60">
                  DRESS {s.dressCode}
                </p>
              )}
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}

function SatelliteMap({ accent, reduce }: { accent: string; reduce: boolean }) {
  return (
    <svg aria-hidden viewBox="0 0 400 200" className="h-40 w-full sm:h-56">
      <rect width="400" height="200" fill={COLORS.bg} />
      <g opacity="0.35" stroke={COLORS.grid} strokeWidth="0.4" fill="none">
        {Array.from({ length: 9 }, (_, i) => (
          <line key={`v${i}`} x1={i * 50} y1={0} x2={i * 50} y2={200} />
        ))}
        {Array.from({ length: 5 }, (_, i) => (
          <line key={`h${i}`} x1={0} y1={i * 50} x2={400} y2={i * 50} />
        ))}
      </g>
      <g fill={COLORS.grid} opacity="0.55">
        <path d="M40,80 L90,70 L110,95 L95,130 L60,140 L35,115 Z" />
        <path d="M140,60 L200,55 L240,80 L235,130 L180,150 L145,120 Z" />
        <path d="M260,50 L330,60 L360,90 L340,140 L280,145 L255,110 Z" />
      </g>
      <g stroke={accent} strokeWidth="0.5" fill="none" opacity="0.55">
        <path d="M0,120 Q100,60 200,110 T400,90" />
      </g>
      <circle cx="245" cy="100" r="12" fill="none" stroke={accent} strokeWidth="0.8" opacity="0.4" />
      <circle cx="245" cy="100" r="6" fill="none" stroke={accent} strokeWidth="0.8" opacity="0.7" />
      <motion.circle
        cx="245"
        cy="100"
        r="2.5"
        fill={COLORS.amber}
        animate={reduce ? undefined : { opacity: [0.4, 1, 0.4], r: [2.5, 3.5, 2.5] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      />
      <text x="252" y="96" fill={COLORS.ivory} fontSize="7" fontFamily="monospace" opacity="0.7">TGT-01</text>
    </svg>
  );
}

export const MissioncontrolTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || COLORS.green;
  const tagline = event.tagline?.trim() || "T-minus. All systems nominal.";
  const invitationMessage = event.invitationMessage?.trim() || "Mission control is calling. Coordinates locked, telemetry green, launch window open. Report to console at the appointed hour.";
  const aboutStory = event.aboutStory?.trim() || "A working room, not a stage. Ops-grade conversations between engineers, operators, and decision-makers running the systems the world depends on.";
  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const hero = event.heroImageUrl || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80";

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroP, [0, 1], [0, -80]);
  const heroOpacity = useTransform(heroP, [0, 0.6], [1, 0]);

  const showStory = !event.hideStory;
  const showMissions = !event.hideEvents && subEvents.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  const dateStr = event.mainDate
    ? new Date(event.mainDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })
    : "";

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-sans antialiased"
      style={{ "--accent": accent, background: COLORS.bg, color: COLORS.ivory } as React.CSSProperties}
    >
      <GridBackdrop reduce={reduce} />
      <ScrollProgress color={accent} />

      {/* HERO — control room dashboard */}
      <section ref={heroRef} className="relative min-h-[100svh] overflow-hidden pt-16 pb-24">
        <motion.div style={reduce ? undefined : { y: heroY, opacity: heroOpacity }} className="absolute inset-0 opacity-30">
          <HeroMedia imageSrc={hero} videoSrc={event.heroVideoUrl || undefined} alt={event.eventTitle} className="opacity-60" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${COLORS.bg}CC, ${COLORS.bg}FF)` }} />
        </motion.div>

        <div className="relative mx-auto max-w-6xl px-6">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[#2a3a52] pb-3 font-mono text-[10px] uppercase tracking-[0.28em]"
          >
            <span style={{ color: accent }}>[ MC-01 // HOUSTON ]</span>
            <span className="opacity-60">STATUS: NOMINAL</span>
            <span className="opacity-60">{dateStr || "AWAITING WINDOW"}</span>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-center">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
            >
              <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.4em]" style={{ color: accent }}>
                {tagline}
              </p>
              <h1 className="font-display text-[clamp(2.6rem,8vw,6rem)] font-black uppercase leading-[0.9] tracking-tight" style={{ color: COLORS.ivory }}>
                {event.eventTitle}
              </h1>
              {event.person1Name && (
                <p className="mt-3 font-mono text-xs uppercase tracking-[0.32em] opacity-70">
                  FLIGHT DIRECTOR – {event.person1Name}
                </p>
              )}
              <div className="mt-8 grid max-w-md grid-cols-3 gap-3 font-mono text-[10px] uppercase tracking-widest">
                {[
                  { k: "DATE", v: event.mainDate ? new Date(event.mainDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "TBD" },
                  { k: "T-ZERO", v: event.mainStartTime || "TBD" },
                  { k: "SITE", v: event.city || "TBD" },
                ].map((c) => (
                  <div key={c.k} className="rounded border border-[#2a3a52] bg-black/30 p-3">
                    <p className="opacity-50">{c.k}</p>
                    <p className="mt-1 text-sm" style={{ color: accent }}>{c.v}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="relative">
              <div className="grid grid-cols-4 gap-2 rounded-lg border border-[#2a3a52] bg-black/50 p-3 backdrop-blur-md">
                {PANELS.map((p, i) => (
                  <MiniPanel key={i} type={p.type} label={p.label} i={i} reduce={reduce} accent={accent} />
                ))}
              </div>
              <div className="pointer-events-none absolute -right-4 -bottom-6 sm:-right-8 sm:-bottom-8">
                <RadarSweep reduce={reduce} accent={accent} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION BRIEF */}
      {showStory && (
        <section className="relative mx-auto max-w-5xl px-6 py-24 sm:py-32">
          <div className="grid gap-10 sm:grid-cols-[auto_1fr] sm:items-start">
            <div className="font-mono text-[10px] uppercase tracking-[0.32em]" style={{ color: accent }}>
              <p>// 02</p>
              <p className="mt-1 opacity-60">MISSION BRIEF</p>
            </div>
            <div>
              <motion.h2
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: EASE }}
                className="font-display text-2xl uppercase leading-[1.1] tracking-tight sm:text-3xl"
              >
                {invitationMessage}
              </motion.h2>
              <motion.p
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
                className="mt-6 text-base leading-relaxed opacity-75 sm:text-lg"
              >
                {aboutStory}
              </motion.p>
              <div className="mt-8 h-px w-full" style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }} />
            </div>
          </div>
        </section>
      )}

      {/* MISSION TIMELINE */}
      {showMissions && (
        <section className="relative py-20 sm:py-28">
          <div className="mx-auto mb-10 flex max-w-4xl items-center gap-3 px-6 font-mono text-[10px] uppercase tracking-[0.32em]">
            <span style={{ color: accent }}>// 03</span>
            <span className="opacity-60">MISSION SEQUENCE</span>
            <span className="ml-auto opacity-50">{sorted_count(subEvents)} EVENTS</span>
          </div>
          <MissionTimeline items={subEvents} accent={accent} />
        </section>
      )}

      {/* GALLERY — telemetry feed */}
      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <div className="mb-8 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.32em]">
            <span style={{ color: accent }}>// 04</span>
            <span className="opacity-60">FEED / VISUAL TELEMETRY</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((m, i) => (
              <motion.div
                key={`${m.fileName}-${i}`}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="group relative overflow-hidden rounded border border-[#2a3a52] bg-black/40"
              >
                <img
                  src={m.publicUrl}
                  alt={m.caption ?? ""}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-[#2a3a52] bg-black/70 px-3 py-1.5 font-mono text-[9px] uppercase tracking-widest">
                  <span style={{ color: accent }}>CH-{String(i + 1).padStart(2, "0")}</span>
                  <span className="opacity-60">{m.caption || "TELEMETRY"}</span>
                </div>
              </motion.div>
            ))}
            {editing && galleryItems.length === 0 && (
              <div className="col-span-full flex h-48 items-center justify-center rounded border border-dashed border-[#2a3a52] font-mono text-xs uppercase tracking-widest opacity-50">
                + ADD PHOTOS
              </div>
            )}
          </div>
        </section>
      )}

      {/* VENUE — satellite target + map */}
      {showVenue && (
        <section className="relative mx-auto max-w-5xl px-6 py-20 sm:py-28">
          <div className="mb-8 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.32em]">
            <span style={{ color: accent }}>// 05</span>
            <span className="opacity-60">GROUND STATION</span>
          </div>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            className="overflow-hidden rounded-lg border border-[#2a3a52] bg-black/40 backdrop-blur-sm"
          >
            <div className="border-b border-[#2a3a52] p-4">
              <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest">
                <span style={{ color: accent }}>SATELLITE VIEW / TGT-01</span>
                <span className="opacity-60">
                  {event.latitude && event.longitude
                    ? `${Number(event.latitude).toFixed(3)}°, ${Number(event.longitude).toFixed(3)}°`
                    : "COORDS PENDING"}
                </span>
              </div>
              <SatelliteMap accent={accent} reduce={reduce} />
              {event.venueName && (
                <p className="mt-3 font-display text-lg uppercase tracking-tight">{event.venueName}</p>
              )}
              {event.venueAddress && <p className="mt-1 text-sm opacity-65">{event.venueAddress}</p>}
            </div>
            <div className="p-1">
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

      {/* CTA */}
      <section className="relative px-6 py-24 text-center sm:py-32">
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: EASE }}
          className="mx-auto max-w-3xl"
        >
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.4em]" style={{ color: accent }}>
            READY FOR LAUNCH
          </p>
          <h2 className="font-display text-[clamp(2rem,6vw,4.5rem)] font-black uppercase leading-[0.95] tracking-tight">
            {event.eventTitle}
          </h2>
          {dateStr && (
            <p className="mt-4 font-mono text-xs uppercase tracking-[0.4em] opacity-70">
              {dateStr}{event.mainStartTime ? ` · T−${event.mainStartTime}` : ""}
            </p>
          )}
          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <motion.div whileHover={reduce ? undefined : { scale: 1.02 }} className="mt-10 inline-block">
              <a
                href={event.rsvpLinkOrContact}
                target="_blank"
                rel="noreferrer"
                className="inline-block rounded-sm px-10 py-4 font-mono text-xs uppercase tracking-[0.4em] transition-all"
                style={{ background: accent, color: COLORS.bg, boxShadow: `0 0 0 1px ${accent}` }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 0 32px ${accent}`; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = `0 0 0 1px ${accent}`; }}
              >
                CONFIRM ATTENDANCE
              </a>
            </motion.div>
          )}
        </motion.div>
      </section>

      <footer className="border-t border-[#2a3a52] py-6 text-center font-mono text-[10px] uppercase tracking-[0.32em] opacity-50">
        <p>{event.eventTitle}{event.person1Name ? ` · ${event.person1Name}` : ""} · END OF TRANSMISSION</p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

function sorted_count(items: SubEvent[]) {
  return String(items.length).padStart(2, "0");
}

export default MissioncontrolTemplate;
