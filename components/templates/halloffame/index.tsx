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

const MARBLE = "#faf5ea";
const GOLD = "#c8a75c";
const BRONZE = "#8a5e2e";
const LAUREL = "#5c7440";
const INK = "#2a2418";

const ROMAN = [
  "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X",
  "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX",
];
const toRoman = (n: number) => (n >= 0 && n < ROMAN.length ? ROMAN[n] : String(n));

function LaurelWreath({ color = LAUREL, className = "" }: { color?: string; className?: string }) {
  return (
    <svg viewBox="0 0 240 60" className={className} aria-hidden>
      <g fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round">
        <path d="M110 30 Q60 6 12 22" />
        <path d="M130 30 Q180 6 228 22" />
        {Array.from({ length: 9 }).map((_, i) => {
          const t = i / 8;
          const lx = 110 - t * 98;
          const ly = 30 - Math.sin(t * Math.PI) * 18;
          const rx = 130 + t * 98;
          const ry = 30 - Math.sin(t * Math.PI) * 18;
          return (
            <g key={i}>
              <ellipse cx={lx} cy={ly - 3} rx="5" ry="2.2" fill={color} fillOpacity="0.55" transform={`rotate(${-30 - t * 20} ${lx} ${ly})`} />
              <ellipse cx={rx} cy={ry - 3} rx="5" ry="2.2" fill={color} fillOpacity="0.55" transform={`rotate(${30 + t * 20} ${rx} ${ry})`} />
            </g>
          );
        })}
        <circle cx="120" cy="30" r="2.4" fill={GOLD} />
      </g>
    </svg>
  );
}

function LaurelGarland({ color = BRONZE, className = "" }: { color?: string; className?: string }) {
  return (
    <svg viewBox="0 0 400 22" className={className} aria-hidden preserveAspectRatio="none">
      <g fill={color} fillOpacity="0.55">
        {Array.from({ length: 18 }).map((_, i) => {
          const x = 10 + i * 22;
          const up = i % 2 === 0;
          return (
            <ellipse key={i} cx={x} cy={up ? 8 : 14} rx="7" ry="2.2" transform={`rotate(${up ? -22 : 22} ${x} ${up ? 8 : 14})`} />
          );
        })}
      </g>
      <line x1="0" y1="11" x2="400" y2="11" stroke={color} strokeOpacity="0.35" strokeWidth="0.6" />
    </svg>
  );
}

function StatueSilhouette({ variant = 0, color = INK }: { variant?: number; color?: string }) {
  const paths = [
    "M32 6 C 24 6 20 12 20 18 C 20 24 26 26 26 32 L 22 42 L 14 78 L 20 78 L 26 60 L 26 78 L 38 78 L 38 60 L 44 78 L 50 78 L 42 42 L 38 32 C 38 26 44 24 44 18 C 44 12 40 6 32 6 Z",
    "M32 6 C 26 6 22 10 22 16 C 22 22 26 24 26 30 L 18 44 L 10 82 L 18 82 L 26 56 L 28 82 L 36 82 L 38 56 L 46 82 L 54 82 L 46 44 L 38 30 C 38 24 42 22 42 16 C 42 10 38 6 32 6 Z",
    "M32 4 C 24 4 20 10 20 18 C 20 24 24 26 24 32 L 16 40 L 12 76 L 18 76 L 24 60 L 22 78 L 42 78 L 40 60 L 46 76 L 52 76 L 48 40 L 40 32 C 40 26 44 24 44 18 C 44 10 40 4 32 4 Z",
  ];
  return (
    <svg viewBox="0 0 64 90" aria-hidden className="h-full w-full">
      <defs>
        <linearGradient id={`stat-${variant}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.9" />
          <stop offset="1" stopColor={color} stopOpacity="0.55" />
        </linearGradient>
      </defs>
      <path d={paths[variant % paths.length]} fill={`url(#stat-${variant})`} />
      <rect x="6" y="82" width="52" height="8" fill={color} fillOpacity="0.7" />
      <rect x="2" y="88" width="60" height="4" fill={color} fillOpacity="0.85" />
    </svg>
  );
}

function MarbleField({ reduce }: { reduce: boolean }) {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden" style={{ background: MARBLE }}>
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 20% 10%, rgba(200,167,92,0.12), transparent 55%), radial-gradient(ellipse at 80% 90%, rgba(138,94,46,0.08), transparent 55%)` }} />
      <svg className="absolute inset-0 h-full w-full opacity-[0.08]" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <filter id="marble-veins">
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="7" />
          <feDisplacementMap in="SourceGraphic" scale="20" />
        </filter>
        <rect width="100%" height="100%" fill={INK} filter="url(#marble-veins)" />
      </svg>
      {!reduce && (
        <motion.div
          className="absolute inset-x-0 top-0 h-40 opacity-40"
          style={{ background: `linear-gradient(180deg, rgba(255,255,255,0.5), transparent)` }}
          animate={{ opacity: [0.25, 0.5, 0.25] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </div>
  );
}

function SectionHeading({ eyebrow, title, accent }: { eyebrow: string; title: string; accent: string }) {
  const reduce = useReducedMotion();
  return (
    <div className="mx-auto mb-14 flex max-w-3xl flex-col items-center text-center">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: EASE }}
        className="w-full max-w-md"
      >
        <LaurelWreath color={LAUREL} className="mx-auto h-12 w-full" />
      </motion.div>
      <p className="mt-3 text-[10px] uppercase tracking-[0.5em]" style={{ color: accent }}>
        {eyebrow}
      </p>
      <h2 className="mt-2 font-display text-3xl leading-[1.1] sm:text-4xl" style={{ color: INK }}>
        {title}
      </h2>
    </div>
  );
}

function PlaqueCard({ item, accent }: { item: SubEvent; accent: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.7, ease: EASE }}
      whileHover={reduce ? undefined : { y: -3 }}
      className="relative"
      style={{ background: "#fbf7ec", border: `1px solid ${BRONZE}`, boxShadow: `inset 0 0 0 1px rgba(200,167,92,0.35), 0 20px 40px -30px rgba(42,36,24,0.4)` }}
    >
      <div className="absolute inset-x-4 top-2">
        <LaurelGarland color={BRONZE} className="h-3 w-full opacity-70" />
      </div>
      <div className="flex flex-col items-center px-6 pb-8 pt-10 text-center">
        <span
          className="mb-4 flex h-10 w-10 items-center justify-center rounded-full font-display text-sm"
          style={{ background: MARBLE, color: BRONZE, border: `1px solid ${BRONZE}` }}
        >
          {toRoman(item.order)}
        </span>
        <div
          className="mb-3 inline-block px-3 py-1"
          style={{ background: "#efe4c8", color: INK, border: `1px solid ${BRONZE}`, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -1px 0 rgba(0,0,0,0.15)" }}
        >
          <h3 className="font-display text-lg tracking-wide">{item.name}</h3>
        </div>
        <div className="mb-4 text-[10px] uppercase tracking-[0.4em]" style={{ color: BRONZE }}>
          {[item.date, item.startTime].filter(Boolean).join(" • ")}
        </div>
        {item.venueName && (
          <p className="text-sm" style={{ color: INK, opacity: 0.75 }}>
            {item.venueName}
          </p>
        )}
        {item.description && (
          <p className="mt-3 max-w-xs text-sm leading-relaxed" style={{ color: INK, opacity: 0.7 }}>
            {item.description}
          </p>
        )}
        {item.dressCode && (
          <p className="mt-4 border px-3 py-1 text-[10px] uppercase tracking-[0.3em]" style={{ borderColor: BRONZE, color: BRONZE }}>
            Attire · {item.dressCode}
          </p>
        )}
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
    </motion.article>
  );
}

export const HalloffameTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || GOLD;
  const tagline = event.tagline?.trim() || "Enshrined in the Hall of Fame.";
  const invitationMessage =
    event.invitationMessage?.trim() ||
    "Between marble columns and laurel crowns, we gather to honor legacy — the quiet greatness that outlives applause.";
  const aboutStory = event.aboutStory?.trim() || "";
  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const hero =
    event.heroImageUrl ||
    "https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=1600&q=80";

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const statueY = useTransform(heroP, [0, 1], [0, -80]);
  const heroTextY = useTransform(heroP, [0, 0.5], [0, -40]);
  const heroOpacity = useTransform(heroP, [0, 0.6], [1, 0]);

  const showStory = !event.hideStory;
  const showEvents = !event.hideEvents && subEvents.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  const statues = [0, 1, 2, 0, 1];
  const sortedSubs = [...subEvents].sort((a, b) => a.order - b.order);

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-sans antialiased"
      style={{ "--accent": accent, background: MARBLE, color: INK } as React.CSSProperties}
    >
      <MarbleField reduce={reduce} />
      <ScrollProgress color={accent} />

      {/* HERO — PANTHEON */}
      <section
        ref={heroRef}
        className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden pb-24 sm:pb-28"
      >
        <div className="absolute inset-0">
          <HeroMedia
            imageSrc={hero}
            videoSrc={event.heroVideoUrl || undefined}
            alt={event.eventTitle}
            className="opacity-20"
          />
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${MARBLE} 0%, rgba(250,245,234,0.6) 45%, ${MARBLE} 100%)` }} />
        </div>

        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-16 mx-auto flex w-full max-w-6xl items-end justify-between px-8 sm:bottom-24"
          style={reduce ? undefined : { y: statueY }}
        >
          {statues.map((v, i) => {
            const scale = i === 2 ? 1.15 : i === 1 || i === 3 ? 0.95 : 0.82;
            const opacity = i === 2 ? 0.85 : i === 1 || i === 3 ? 0.6 : 0.4;
            return (
              <motion.div
                key={i}
                initial={reduce ? false : { opacity: 0, y: 40 }}
                animate={{ opacity, y: 0 }}
                transition={{ duration: 1.4, delay: 0.2 + i * 0.12, ease: EASE }}
                className="relative"
                style={{ width: `${scale * 12}%`, minWidth: 60, height: `${scale * 220}px` }}
              >
                <StatueSilhouette variant={v} color={INK} />
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          style={reduce ? undefined : { y: heroTextY, opacity: heroOpacity }}
          className="relative z-10 px-6 text-center"
        >
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mx-auto mb-6 max-w-xs"
          >
            <LaurelWreath color={LAUREL} className="mx-auto h-14 w-full" />
          </motion.div>
          <p className="mb-6 text-[10px] uppercase tracking-[0.55em]" style={{ color: BRONZE }}>
            {tagline}
          </p>
          <h1 className="font-display text-[clamp(2.75rem,10vw,7.5rem)] leading-[0.95]" style={{ color: INK }}>
            {event.eventTitle}
          </h1>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-8 flex flex-wrap justify-center gap-4 text-[11px] uppercase tracking-[0.4em]"
            style={{ color: BRONZE }}
          >
            {event.mainDate && (
              <span>
                {new Date(event.mainDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              </span>
            )}
            {event.city && (
              <>
                <span style={{ color: GOLD }}>✦</span>
                <span>{event.city}</span>
              </>
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* STORY — THE ORATION */}
      {showStory && (
        <section className="relative mx-auto max-w-4xl px-6 py-28 sm:py-36">
          <SectionHeading eyebrow="The Oration" title="A Ceremony of Legacy" accent={accent} />
          <motion.blockquote
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE }}
            className="mx-auto max-w-2xl text-center"
          >
            <p className="font-display text-2xl leading-relaxed sm:text-3xl" style={{ color: INK }}>
              “{invitationMessage}”
            </p>
            {aboutStory && (
              <p className="mt-8 text-base leading-relaxed" style={{ color: INK, opacity: 0.72 }}>
                {aboutStory}
              </p>
            )}
            <div className="mx-auto mt-10 h-px w-40" style={{ background: `linear-gradient(90deg, transparent, ${BRONZE}, transparent)` }} />
          </motion.blockquote>
        </section>
      )}

      {/* SUB-EVENTS — THE MONUMENTS */}
      {showEvents && (
        <section className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <SectionHeading eyebrow="The Monuments" title="Order of Ceremonies" accent={accent} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedSubs.map((s) => (
              <PlaqueCard key={s.order} item={s} accent={accent} />
            ))}
          </div>
        </section>
      )}

      {/* GALLERY — THE ARCHIVE */}
      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <SectionHeading eyebrow="The Archive" title="Chronicles in Marble" accent={accent} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((m, i) => (
              <motion.figure
                key={`${m.fileName}-${i}`}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-6% 0px" }}
                transition={{ duration: 0.6, delay: (i % 6) * 0.05, ease: EASE }}
                className="group relative"
                style={{ background: "#fbf7ec", border: `1px solid ${BRONZE}`, padding: 12, boxShadow: `inset 0 0 0 1px rgba(200,167,92,0.35), 0 20px 40px -30px rgba(42,36,24,0.35)` }}
              >
                <div className="pointer-events-none absolute inset-x-3 top-3">
                  <LaurelGarland color={BRONZE} className="h-3 w-full opacity-70" />
                </div>
                <div className="mt-4 overflow-hidden" style={{ border: `1px solid ${BRONZE}` }}>
                  <img
                    src={m.publicUrl}
                    alt={m.caption ?? ""}
                    loading="lazy"
                    className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                {m.caption && (
                  <figcaption className="mt-3 text-center text-[10px] uppercase tracking-[0.35em]" style={{ color: BRONZE }}>
                    {m.caption}
                  </figcaption>
                )}
              </motion.figure>
            ))}
            {editing && galleryItems.length === 0 && (
              <div
                className="col-span-full flex h-48 items-center justify-center border border-dashed text-sm"
                style={{ borderColor: BRONZE, color: BRONZE, background: "#fbf7ec" }}
              >
                + Add photos to the archive
              </div>
            )}
          </div>
        </section>
      )}

      {/* VENUE — THE HALL */}
      {showVenue && (
        <section className="relative mx-auto max-w-5xl px-6 py-24 sm:py-32">
          <SectionHeading eyebrow="The Hall" title="Where We Convene" accent={accent} />
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE }}
            className="overflow-hidden"
            style={{ background: "#fbf7ec", border: `1px solid ${BRONZE}`, padding: 6, boxShadow: `inset 0 0 0 1px rgba(200,167,92,0.35)` }}
          >
            <div className="pointer-events-none">
              <LaurelGarland color={BRONZE} className="h-3 w-full opacity-70" />
            </div>
            <div style={{ border: `1px solid ${BRONZE}` }}>
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

      {/* CTA — THE INDUCTION */}
      <section className="relative px-6 py-28 text-center sm:py-40">
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: EASE }}
          className="mx-auto max-w-3xl"
        >
          <LaurelWreath color={LAUREL} className="mx-auto mb-8 h-16 w-full max-w-md" />
          <h2 className="font-display text-[clamp(2rem,6vw,4.5rem)] leading-[1.05]" style={{ color: INK }}>
            Take Your Place Among the Immortalized
          </h2>
          {event.person1Name && (
            <p className="mt-6 text-xs uppercase tracking-[0.5em]" style={{ color: BRONZE }}>
              Honoring · {event.person1Name}
              {event.person2Name ? ` · ${event.person2Name}` : ""}
            </p>
          )}
          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <motion.div whileHover={reduce ? undefined : { y: -2 }} className="mt-10 inline-block">
              <a
                href={event.rsvpLinkOrContact}
                target="_blank"
                rel="noreferrer"
                className="inline-block px-14 py-4 text-xs uppercase tracking-[0.4em] transition-all"
                style={{ background: INK, color: MARBLE, border: `1px solid ${GOLD}`, boxShadow: `inset 0 0 0 1px rgba(200,167,92,0.4)` }}
              >
                Accept the Invitation
              </a>
            </motion.div>
          )}
        </motion.div>
      </section>

      <footer className="relative py-10 text-center text-xs" style={{ color: BRONZE, borderTop: `1px solid ${BRONZE}33` }}>
        <div className="mx-auto mb-4 max-w-xs">
          <LaurelWreath color={LAUREL} className="mx-auto h-8 w-full opacity-70" />
        </div>
        <p className="uppercase tracking-[0.4em]">
          {event.eventTitle}
          {event.person1Name ? ` · ${event.person1Name}` : ""}
        </p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default HalloffameTemplate;
