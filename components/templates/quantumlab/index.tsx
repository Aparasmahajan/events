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

const ATOMS = [
  { id: "a", cx: 300, cy: 200, r: 6 },
  { id: "b", cx: 460, cy: 140, r: 5 },
  { id: "c", cx: 600, cy: 240, r: 7 },
  { id: "d", cx: 520, cy: 360, r: 5 },
  { id: "e", cx: 360, cy: 400, r: 6 },
  { id: "f", cx: 220, cy: 320, r: 5 },
  { id: "g", cx: 700, cy: 380, r: 6 },
  { id: "h", cx: 180, cy: 180, r: 4 },
  { id: "i", cx: 640, cy: 120, r: 4 },
  { id: "j", cx: 400, cy: 280, r: 8 },
];

const BONDS: Array<[string, string]> = [
  ["a", "b"], ["b", "c"], ["c", "d"], ["d", "e"], ["e", "f"], ["f", "a"],
  ["a", "j"], ["c", "j"], ["e", "j"], ["c", "g"], ["d", "g"], ["b", "i"], ["a", "h"],
];

const PARTICLE_PATHS = [0, 1, 3, 5, 8, 10];

function LabField({ reduce, accent, cyan }: { reduce: boolean; accent: string; cyan: string }) {
  const bondCoords = BONDS.map(([from, to]) => {
    const a = ATOMS.find((n) => n.id === from)!;
    const b = ATOMS.find((n) => n.id === to)!;
    return { x1: a.cx, y1: a.cy, x2: b.cx, y2: b.cy };
  });

  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden bg-[#f4f8fc]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#f4f8fc] via-[#eef3f9] to-[#f4f8fc]" />
      <svg className="absolute inset-0 h-full w-full opacity-[0.25]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="qlab-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#c5cdd8" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#qlab-grid)" />
      </svg>

      <div className="absolute left-1/2 top-1/2 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2">
        <motion.svg
          viewBox="0 0 900 500"
          className="h-full w-full"
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
        >
          {bondCoords.map((b, i) => (
            <line
              key={i}
              x1={b.x1}
              y1={b.y1}
              x2={b.x2}
              y2={b.y2}
              stroke={cyan}
              strokeWidth="0.75"
              opacity="0.35"
            />
          ))}
          {ATOMS.map((n) => (
            <g key={n.id}>
              <circle cx={n.cx} cy={n.cy} r={n.r + 3} fill={accent} opacity="0.12" />
              <circle cx={n.cx} cy={n.cy} r={n.r} fill={accent} opacity="0.55" />
            </g>
          ))}
          {!reduce &&
            PARTICLE_PATHS.map((bi, i) => {
              const b = bondCoords[bi];
              return (
                <motion.circle
                  key={`p-${i}`}
                  r="2.5"
                  fill={accent}
                  animate={{ cx: [b.x1, b.x2, b.x1], cy: [b.y1, b.y2, b.y1] }}
                  transition={{ duration: 4 + (i % 3), delay: i * 0.5, repeat: Infinity, ease: "easeInOut" }}
                  style={{ filter: `drop-shadow(0 0 4px ${accent})` }}
                />
              );
            })}
        </motion.svg>
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-[#f4f8fc]/70 via-transparent to-[#f4f8fc]/90" />
    </div>
  );
}

function HologramPanel({
  children,
  className,
  delay = 0,
  accent,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  accent: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      whileHover={reduce ? undefined : { y: -3, boxShadow: `0 0 40px ${accent}33` }}
      className={`relative overflow-hidden rounded-xl border border-[#4dd0e1]/40 bg-white/60 p-6 backdrop-blur-xl transition-all ${className ?? ""}`}
      style={{ boxShadow: `0 8px 32px -12px ${accent}22, inset 0 1px 0 rgba(255,255,255,0.6)` }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background: `repeating-linear-gradient(0deg, transparent 0px, transparent 3px, ${accent}0d 3px, ${accent}0d 4px)`,
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
      <div className="relative">{children}</div>
    </motion.div>
  );
}

function BeakerIcon({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3h6" />
      <path d="M10 3v5L5 19a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 19L14 8V3" />
      <path d="M7 15h10" />
    </svg>
  );
}

function ExperimentGrid({ items, accent }: { items: SubEvent[]; accent: string }) {
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
            transition={{ duration: 0.5, delay: i * 0.07 }}
          >
            <HologramPanel delay={i * 0.05} accent={accent}>
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BeakerIcon accent={accent} />
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#8b5cf6]">
                    Experiment {String(s.order).padStart(2, "0")}
                  </span>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#1a2438]/50">
                  {[s.date, s.startTime].filter(Boolean).join(" · ")}
                </span>
              </div>
              <h3 className="font-display text-xl tracking-tight text-[#1a2438]">{s.name}</h3>
              {s.venueName && <p className="mt-1 text-sm text-[#1a2438]/60">{s.venueName}</p>}
              {s.description && <p className="mt-2 text-sm leading-relaxed text-[#1a2438]/70">{s.description}</p>}
              {s.dressCode && (
                <p className="mt-3 inline-block rounded-full border border-[#4dd0e1]/50 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[#1a2438]/60">
                  {s.dressCode}
                </p>
              )}
            </HologramPanel>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

export const QuantumlabTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || "#8b5cf6";
  const cyan = "#4dd0e1";
  const tagline = event.tagline?.trim() || "Where hypotheses become the future.";
  const invitationMessage =
    event.invitationMessage?.trim() ||
    "Step inside the lab. Meet the researchers, touch the prototypes, and see the questions we're chasing next.";
  const aboutStory = event.aboutStory?.trim() || "";
  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const hero =
    event.heroImageUrl ||
    "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1600&q=80";

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(heroP, [0, 1], [1, 0.92]);
  const heroTextY = useTransform(heroP, [0, 0.5], [0, -40]);
  const heroOpacity = useTransform(heroP, [0, 0.6], [1, 0]);

  const showStory = !event.hideStory;
  const showJourney = !event.hideEvents && subEvents.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  const specs = [
    { label: "Discipline", value: "Applied Research" },
    { label: "Access", value: "By invitation" },
    { label: "Format", value: "Open lab" },
  ];

  return (
    <div
      className="relative min-h-screen overflow-x-clip bg-[#f4f8fc] font-sans text-[#1a2438] antialiased"
      style={{ "--accent": accent } as React.CSSProperties}
    >
      <LabField reduce={reduce} accent={accent} cyan={cyan} />
      <ScrollProgress color={accent} />

      {/* 01 ENTRY */}
      <section ref={heroRef} className="relative flex h-[100svh] min-h-[620px] items-center justify-center overflow-hidden">
        <motion.div style={reduce ? undefined : { scale: heroScale }} className="absolute inset-0">
          <HeroMedia imageSrc={hero} videoSrc={event.heroVideoUrl || undefined} alt={event.eventTitle} className="opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#f4f8fc]/70 via-[#f4f8fc]/40 to-[#f4f8fc]" />
        </motion.div>

        <motion.div style={reduce ? undefined : { y: heroTextY, opacity: heroOpacity }} className="relative z-10 px-6 text-center">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="mb-6 font-mono text-[10px] uppercase tracking-[0.6em]"
            style={{ color: accent }}
          >
            {tagline}
          </motion.p>
          <motion.h1
            initial={reduce ? false : { opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.2, ease: EASE }}
            className="font-display text-[clamp(2.8rem,10vw,7.5rem)] font-black leading-[0.92] tracking-tight text-[#1a2438]"
          >
            {event.eventTitle}
          </motion.h1>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="mt-10 inline-flex flex-wrap items-center justify-center gap-x-6 gap-y-2 rounded-full border border-[#4dd0e1]/50 bg-white/60 px-6 py-3 backdrop-blur-xl"
          >
            {event.mainDate && (
              <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#1a2438]/80">
                {new Date(event.mainDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
              </span>
            )}
            {event.mainStartTime && <span className="font-mono text-[11px] tracking-[0.3em]" style={{ color: accent }}>//</span>}
            {event.mainStartTime && <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#1a2438]/80">{event.mainStartTime}</span>}
            {event.city && <><span className="font-mono text-[11px] tracking-[0.3em]" style={{ color: accent }}>//</span><span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#1a2438]/80">{event.city}</span></>}
          </motion.div>
        </motion.div>

        {!reduce && (
          <motion.div
            animate={{ y: [0, 6, 0], opacity: [0.3, 0.9, 0.3] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.4em]"
            style={{ color: accent }}
          >
            Descend into the lab
          </motion.div>
        )}
      </section>

      {/* 02 BRIEF (hologram panels) */}
      {showStory && (
        <section className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-4 text-center font-mono text-[10px] uppercase tracking-[0.5em]"
            style={{ color: accent }}
          >
            Field Brief
          </motion.p>
          <motion.h2
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE }}
            className="mx-auto mb-12 max-w-3xl text-center font-display text-3xl leading-[1.15] tracking-tight sm:text-4xl"
          >
            {invitationMessage}
          </motion.h2>

          <div className="grid gap-4 sm:grid-cols-3">
            {specs.map((s, i) => (
              <HologramPanel key={s.label} delay={i * 0.12} accent={accent}>
                <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#8b5cf6]">
                  0{i + 1} / {s.label}
                </p>
                <p className="mt-3 font-display text-lg tracking-tight">{s.value}</p>
                <div className="mt-4 h-px w-full" style={{ background: `linear-gradient(90deg, ${cyan}, transparent)` }} />
              </HologramPanel>
            ))}
          </div>

          {aboutStory && (
            <motion.p
              initial={reduce ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mx-auto mt-12 max-w-3xl text-center text-base leading-relaxed text-[#1a2438]/70 sm:text-lg"
            >
              {aboutStory}
            </motion.p>
          )}
        </section>
      )}

      {/* 03 EXPERIMENTS */}
      {showJourney && (
        <section className="relative py-24 sm:py-32">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-12 text-center font-mono text-[10px] uppercase tracking-[0.5em]"
            style={{ color: accent }}
          >
            Live Experiments
          </motion.p>
          <ExperimentGrid items={subEvents} accent={accent} />
        </section>
      )}

      {/* 04 SPECIMENS (gallery) */}
      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-10 text-center font-mono text-[10px] uppercase tracking-[0.5em]"
            style={{ color: accent }}
          >
            Specimen Archive
          </motion.p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((m, i) => (
              <motion.div
                key={`${m.fileName}-${i}`}
                initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="group relative overflow-hidden rounded-xl border border-[#4dd0e1]/40 bg-white/40 backdrop-blur-xl"
                style={{ boxShadow: `0 8px 24px -12px ${accent}33` }}
              >
                <img
                  src={m.publicUrl}
                  alt={m.caption ?? ""}
                  className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-0 opacity-30" style={{ background: `repeating-linear-gradient(0deg, transparent 0px, transparent 3px, ${accent}22 3px, ${accent}22 4px)` }} />
                {m.caption && (
                  <p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1a2438]/80 to-transparent p-3 font-mono text-[10px] uppercase tracking-[0.25em] text-white">
                    {m.caption}
                  </p>
                )}
              </motion.div>
            ))}
            {editing && galleryItems.length === 0 && (
              <div className="col-span-full flex h-48 items-center justify-center rounded-xl border border-dashed border-[#4dd0e1]/50 text-sm text-[#1a2438]/50">
                + Add specimens
              </div>
            )}
          </div>
        </section>
      )}

      {/* 05 SITE */}
      {showVenue && (
        <section className="relative mx-auto max-w-5xl px-6 py-20 sm:py-28">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-4 text-center font-mono text-[10px] uppercase tracking-[0.5em]"
            style={{ color: accent }}
          >
            Facility Coordinates
          </motion.p>
          {event.venueName && (
            <p className="mb-6 text-center font-display text-2xl tracking-tight">{event.venueName}</p>
          )}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="overflow-hidden rounded-xl border border-[#4dd0e1]/40 bg-white/60 p-1 backdrop-blur-xl"
            style={{ boxShadow: `0 12px 40px -16px ${accent}33` }}
          >
            <MapEmbed
              latitude={event.latitude}
              longitude={event.longitude}
              venueName={event.venueName}
              venueAddress={event.venueAddress}
              mapLink={event.mapLink}
            />
          </motion.div>
        </section>
      )}

      {/* 06 ADMIT */}
      <section className="relative px-6 py-28 text-center sm:py-40">
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE }}
          className="mx-auto max-w-3xl"
        >
          <motion.div
            aria-hidden
            animate={reduce ? undefined : { scale: [1, 1.08, 1], opacity: [0.35, 0.6, 0.35] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="mx-auto mb-8 h-24 w-24 rounded-full sm:h-32 sm:w-32"
            style={{
              background: `radial-gradient(circle, ${accent}, transparent 70%)`,
              filter: "blur(24px)",
            }}
          />
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.5em]" style={{ color: accent }}>
            Request Credentials
          </p>
          <h2 className="font-display text-[clamp(2.2rem,7vw,5rem)] font-black leading-[0.95] tracking-tight text-[#1a2438]">
            {event.eventTitle}
          </h2>
          {event.person1Name && (
            <p className="mt-4 font-mono text-xs uppercase tracking-[0.35em] text-[#1a2438]/60">
              {event.person1Name}
            </p>
          )}
          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <motion.div whileHover={reduce ? undefined : { scale: 1.03 }} className="mt-10 inline-block">
              <a
                href={event.rsvpLinkOrContact}
                target="_blank"
                rel="noreferrer"
                className="inline-block rounded-full px-12 py-4 font-mono text-xs uppercase tracking-[0.35em] text-white transition-all"
                style={{ background: accent, boxShadow: `0 0 0 1px ${cyan}, 0 8px 30px -8px ${accent}` }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 0 0 1px ${cyan}, 0 0 40px ${accent}`; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = `0 0 0 1px ${cyan}, 0 8px 30px -8px ${accent}`; }}
              >
                Request access
              </a>
            </motion.div>
          )}
        </motion.div>
      </section>

      <footer className="border-t border-[#c5cdd8]/60 py-8 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-[#1a2438]/50">
        <p>{event.eventTitle}{event.person1Name ? ` · ${event.person1Name}` : ""}</p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default QuantumlabTemplate;
