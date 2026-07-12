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
const IVORY = "#f7f2e8";
const GOLD = "#c8a02c";
const POWDER = "#a8bede";
const GARDEN = "#5e7a52";
const INK = "#332e26";

const SPARKLES = Array.from({ length: 14 }, (_, i) => ({
  x: 12 + ((i * 41 + 9) % 76),
  y: 8 + ((i * 29 + 5) % 34),
  delay: (i % 7) * 0.45,
  size: 2 + (i % 3),
}));

function Chandelier({ reduce }: { reduce: boolean }) {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-0 z-20 -translate-x-1/2 origin-top"
      animate={reduce ? undefined : { rotate: [-1.6, 1.6, -1.6] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg width="180" height="170" viewBox="0 0 180 170" fill="none">
        <line x1="90" y1="0" x2="90" y2="42" stroke={GOLD} strokeWidth="1.5" />
        <circle cx="90" cy="48" r="6" stroke={GOLD} strokeWidth="1.5" />
        <path d="M90 54 C 40 60, 22 84, 22 104" stroke={GOLD} strokeWidth="1.5" />
        <path d="M90 54 C 140 60, 158 84, 158 104" stroke={GOLD} strokeWidth="1.5" />
        <path d="M90 54 C 62 62, 52 82, 52 100" stroke={GOLD} strokeWidth="1.2" />
        <path d="M90 54 C 118 62, 128 82, 128 100" stroke={GOLD} strokeWidth="1.2" />
        <line x1="90" y1="54" x2="90" y2="96" stroke={GOLD} strokeWidth="1.2" />
        {[
          { x: 22, y: 104 }, { x: 52, y: 100 }, { x: 90, y: 96 }, { x: 128, y: 100 }, { x: 158, y: 104 },
        ].map((c, i) => (
          <g key={i}>
            <ellipse cx={c.x} cy={c.y + 4} rx="7" ry="4" stroke={GOLD} strokeWidth="1.4" />
            <path d={`M${c.x} ${c.y - 6} l3 6 h-6 z`} fill={GOLD} opacity="0.85" />
            <path d={`M${c.x} ${c.y + 12} l3 7 -3 7 -3 -7 z`} fill={POWDER} opacity="0.9" />
            <path d={`M${c.x} ${c.y + 28} l2 5 -2 5 -2 -5 z`} fill={GOLD} opacity="0.7" />
          </g>
        ))}
      </svg>
      {!reduce &&
        SPARKLES.map((s, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{ left: `${s.x}%`, top: `${s.y + 55}%`, width: s.size, height: s.size, background: "#fff", boxShadow: `0 0 8px 2px ${GOLD}` }}
            animate={{ opacity: [0, 1, 0], scale: [0.6, 1.2, 0.6] }}
            transition={{ duration: 2.4, delay: s.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
    </motion.div>
  );
}

function CornerCurl({ className }: { className: string }) {
  return (
    <svg aria-hidden className={`absolute h-10 w-10 ${className}`} viewBox="0 0 40 40" fill="none">
      <path d="M2 38 C 2 16, 8 6, 30 4 C 18 8, 16 14, 20 18 C 24 22, 30 18, 27 13 C 34 18, 26 30, 14 26 C 8 24, 4 30, 2 38 Z" fill={GOLD} opacity="0.85" />
      <circle cx="33" cy="7" r="2" fill={GOLD} />
    </svg>
  );
}

function PalaceRoom({ label, children }: { label: string; children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.section
      initial={reduce ? false : { opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.9, ease: EASE }}
      className="relative mx-auto my-16 w-[min(72rem,calc(100%-2.5rem))] sm:my-24"
    >
      <div className="relative border p-1.5" style={{ borderColor: GOLD }}>
        <div className="relative border px-5 py-14 sm:px-12 sm:py-20" style={{ borderColor: `${GOLD}88` }}>
          <CornerCurl className="left-1 top-1" />
          <CornerCurl className="right-1 top-1 -scale-x-100" />
          <CornerCurl className="bottom-1 left-1 -scale-y-100" />
          <CornerCurl className="bottom-1 right-1 -scale-x-100 -scale-y-100" />
          <p className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap px-4 font-serif text-[11px] uppercase tracking-[0.45em]" style={{ background: IVORY, color: GOLD }}>
            {label}
          </p>
          {children}
        </div>
      </div>
    </motion.section>
  );
}

function RoomHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-10 text-center">
      <h2 className="font-serif text-[clamp(1.8rem,4.5vw,3rem)] tracking-[0.14em]" style={{ color: INK }}>{children}</h2>
      <div className="mx-auto mt-4 h-px w-24" style={{ background: GOLD }} />
    </div>
  );
}

function Programme({ items }: { items: SubEvent[] }) {
  const reduce = useReducedMotion();
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <div className="mx-auto max-w-3xl">
      {sorted.map((s, i) => (
        <motion.article
          key={s.order}
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
          className="relative border-b py-8 text-center last:border-b-0"
          style={{ borderColor: `${GOLD}44` }}
        >
          <p className="font-serif text-xs tracking-[0.5em]" style={{ color: GOLD }}>
            {["I", "II", "III", "IV", "V", "VI", "VII", "VIII"][i] ?? s.order}
          </p>
          <h3 className="mt-2 font-serif text-2xl tracking-[0.12em]" style={{ color: INK }}>{s.name}</h3>
          <p className="mt-2 text-[11px] uppercase tracking-[0.3em]" style={{ color: GARDEN }}>
            {[s.date, [s.startTime, s.endTime].filter(Boolean).join(" – ")].filter(Boolean).join(" · ")}
          </p>
          {s.venueName && <p className="mt-2 text-sm italic" style={{ color: `${INK}b3` }}>{s.venueName}{s.venueAddress ? `, ${s.venueAddress}` : ""}</p>}
          {s.description && <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed" style={{ color: `${INK}99` }}>{s.description}</p>}
          {s.dressCode && (
            <p className="mt-4 inline-block border px-4 py-1 text-[10px] uppercase tracking-[0.3em]" style={{ borderColor: GOLD, color: GOLD }}>
              Tenue · {s.dressCode}
            </p>
          )}
        </motion.article>
      ))}
    </div>
  );
}

export const VersaillesTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || GOLD;
  const tagline = event.tagline?.trim() || "Une célébration royale";
  const invitationMessage = event.invitationMessage?.trim() || "With hearts full of joy, we request the honour of your presence as we exchange vows beneath chandeliers and gilded skies. Come walk the palace halls with us on the first day of our forever.";
  const aboutStory = event.aboutStory?.trim() || "Every love story deserves a palace. Ours began quietly and grew into something grand — and now the doors are thrown open, the mirrors polished, and the gardens in bloom, waiting for you.";
  const hero = event.heroImageUrl || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1600&q=80";
  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const [frame1, frame2, frame3] = event.showHeroFrames ? galleryItems : [];

  // Tiny drifting gilt sparkles around the hero — deterministic so SSR matches.
  const HERO_SPARKLES = [
    { x: 8, y: 18, s: 10, d: 0.2 },
    { x: 22, y: 68, s: 8, d: 1.1 },
    { x: 46, y: 12, s: 12, d: 0.6 },
    { x: 62, y: 74, s: 9, d: 1.6 },
    { x: 78, y: 24, s: 11, d: 0.4 },
    { x: 90, y: 60, s: 8, d: 1.3 },
    { x: 36, y: 84, s: 10, d: 0.9 },
  ];

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroP, [0, 1], [0, 90]);
  const heroOpacity = useTransform(heroP, [0, 0.6], [1, 0]);

  const showStory = !event.hideStory;
  const showJourney = !event.hideEvents && subEvents.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  const names = [event.person1Name, event.person2Name].filter(Boolean).join(" & ");
  const dateLine = event.mainDate
    ? new Date(event.mainDate).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
    : "";

  return (
    <div className="relative min-h-screen overflow-x-clip font-serif antialiased" style={{ background: IVORY, color: INK, "--accent": accent } as React.CSSProperties}>
      <ScrollProgress color={accent} />

      <section ref={heroRef} className="relative flex min-h-[100svh] items-center justify-center overflow-hidden pb-24 sm:pb-28">
        <div className="absolute inset-0">
          <HeroMedia imageSrc={hero} videoSrc={event.heroVideoUrl || undefined} alt={event.eventTitle} className="opacity-40" />
          {/* Warm ivory + gilt vignette — soft cream, never dark. */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, ${IVORY}f2 0%, ${IVORY}80 45%, ${IVORY} 96%), radial-gradient(circle at 50% 40%, ${GOLD}22 0%, transparent 55%)`,
            }}
          />
        </div>
        <Chandelier reduce={reduce} />

        {/* Drifting gilt sparkles */}
        {!reduce && HERO_SPARKLES.map((sp, i) => (
          <motion.svg
            key={`sp-${i}`}
            aria-hidden
            className="pointer-events-none absolute z-10"
            style={{ left: `${sp.x}%`, top: `${sp.y}%`, width: sp.s, height: sp.s }}
            viewBox="0 0 20 20"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: [0, 1, 0], scale: [0.6, 1.15, 0.6], y: [0, -12, 0] }}
            transition={{ duration: 4.5, delay: sp.d, repeat: Infinity, ease: "easeInOut" }}
          >
            <path d="M10 0 L11.4 8.6 L20 10 L11.4 11.4 L10 20 L8.6 11.4 L0 10 L8.6 8.6 Z" fill={GOLD} opacity="0.85" />
          </motion.svg>
        ))}

        {/* Frame 1 — Oval golden-mirror (top-left) */}
        {frame1 && (
          <motion.figure
            initial={reduce ? false : { opacity: 0, y: -18, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.35, ease: EASE }}
            className="hidden md:block absolute left-[5%] top-[13%] w-44 h-56 lg:w-56 lg:h-72 z-10"
          >
            <motion.div
              className="relative w-full h-full"
              animate={reduce ? undefined : { y: [0, -8, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Outer double gold border, elliptical */}
              <div
                className="absolute inset-0"
                style={{
                  borderRadius: "50%",
                  border: `3px solid ${GOLD}`,
                  boxShadow: `0 20px 40px -12px ${GOLD}66, inset 0 0 0 6px ${IVORY}, inset 0 0 0 8px ${GOLD}aa`,
                  background: IVORY,
                }}
              />
              <div className="absolute inset-[10px] overflow-hidden" style={{ borderRadius: "50%" }}>
                <img src={frame1.publicUrl} alt={frame1.caption ?? ""} loading="lazy" className="w-full h-full object-cover" />
              </div>
              {/* 4 corner flourish curls */}
              <CornerCurl className="-left-3 -top-3" />
              <CornerCurl className="-right-3 -top-3 -scale-x-100" />
              <CornerCurl className="-left-3 -bottom-3 -scale-y-100" />
              <CornerCurl className="-right-3 -bottom-3 -scale-x-100 -scale-y-100" />
            </motion.div>
          </motion.figure>
        )}

        {/* Frame 2 — Rectangular gold-frame portrait (top-right) */}
        {frame2 && (
          <motion.figure
            initial={reduce ? false : { opacity: 0, y: -12, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.55, ease: EASE }}
            className="hidden md:block absolute right-[6%] top-[16%] w-40 h-56 lg:w-52 lg:h-72 z-10"
          >
            <motion.div
              className="relative w-full h-full"
              animate={reduce ? undefined : { y: [0, 8, 0] }}
              transition={{ duration: 8, delay: 0.6, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Outer thick + inner thin gold border */}
              <div
                className="absolute inset-0"
                style={{
                  border: `3px solid ${GOLD}`,
                  boxShadow: `0 20px 40px -12px ${GOLD}66, inset 0 0 0 5px ${IVORY}, inset 0 0 0 6px ${GOLD}99`,
                  background: IVORY,
                }}
              />
              <div className="absolute inset-[9px] overflow-hidden">
                <img src={frame2.publicUrl} alt={frame2.caption ?? ""} loading="lazy" className="w-full h-full object-cover" />
              </div>
              <CornerCurl className="-left-3 -top-3" />
              <CornerCurl className="-right-3 -top-3 -scale-x-100" />
              <CornerCurl className="-left-3 -bottom-3 -scale-y-100" />
              <CornerCurl className="-right-3 -bottom-3 -scale-x-100 -scale-y-100" />
            </motion.div>
          </motion.figure>
        )}

        {/* Frame 3 — Crystal-chandelier medallion (bottom-left) */}
        {frame3 && (
          <motion.figure
            initial={reduce ? false : { opacity: 0, y: 22, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.8, ease: EASE }}
            className="hidden lg:block absolute left-[9%] bottom-[15%] w-44 z-10"
          >
            {/* Chandelier silhouette above the photo */}
            <svg width="100%" height="60" viewBox="0 0 180 60" fill="none" className="mb-1">
              <line x1="90" y1="0" x2="90" y2="12" stroke={GOLD} strokeWidth="1.4" />
              <path d="M20 16 Q 90 8 160 16" stroke={GOLD} strokeWidth="1.6" fill="none" />
              {[24, 48, 72, 96, 120, 144].map((cx, i) => (
                <g key={i}>
                  <line x1={cx} y1="16" x2={cx} y2={26 + (i % 2) * 6} stroke={GOLD} strokeWidth="0.9" />
                  <path
                    d={`M${cx - 3} ${26 + (i % 2) * 6} l3 10 l3 -10 z`}
                    fill={POWDER}
                    opacity="0.9"
                  />
                  <motion.circle
                    cx={cx}
                    cy={30 + (i % 2) * 6}
                    r="1.6"
                    fill="#fff59d"
                    initial={{ opacity: 0.5 }}
                    animate={reduce ? undefined : { opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2.2, delay: i * 0.3, repeat: Infinity, ease: "easeInOut" }}
                    style={{ filter: `drop-shadow(0 0 3px ${GOLD})` }}
                  />
                </g>
              ))}
            </svg>
            <motion.div
              className="relative mx-auto w-40 h-40 rounded-full overflow-hidden"
              style={{
                border: `3px solid ${GOLD}`,
                boxShadow: `0 20px 40px -12px ${GOLD}55, inset 0 0 0 4px ${IVORY}, inset 0 0 0 5px ${GOLD}88`,
              }}
              animate={reduce ? undefined : { y: [0, -6, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <img src={frame3.publicUrl} alt={frame3.caption ?? ""} loading="lazy" className="w-full h-full object-cover" />
            </motion.div>
          </motion.figure>
        )}

        <motion.div style={reduce ? undefined : { y: heroY, opacity: heroOpacity }} className="relative z-20 px-6 pt-24 text-center">
          {/* Fleur-de-lis above */}
          <div className="flex items-center justify-center gap-3 mb-4 opacity-90">
            <span className="h-px w-10 sm:w-16" style={{ background: GOLD }} />
            <span className="text-xl" style={{ color: GOLD }}>⚜</span>
            <span className="h-px w-10 sm:w-16" style={{ background: GOLD }} />
          </div>
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="text-[11px] uppercase tracking-[0.6em]"
            style={{ color: GARDEN }}
          >
            {tagline}
          </motion.p>
          <div className="mx-auto mt-8 h-px w-40 sm:w-64" style={{ background: accent }} />
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 24, letterSpacing: "0.4em" }}
            animate={{ opacity: 1, y: 0, letterSpacing: "0.18em" }}
            transition={{ duration: 1.4, delay: 0.4, ease: EASE }}
            className="my-6 text-[clamp(2.6rem,9vw,7rem)] leading-[1.05]"
            style={{ color: INK }}
          >
            {names || event.eventTitle}
          </motion.h1>
          <div className="mx-auto mb-4 h-px w-40 sm:w-64" style={{ background: accent }} />
          {/* Ornament below */}
          <div className="flex items-center justify-center gap-3 mb-6 opacity-80">
            <span className="text-base" style={{ color: GOLD }}>❦</span>
          </div>
          {names && <p className="text-sm uppercase tracking-[0.4em]" style={{ color: `${INK}99` }}>{event.eventTitle}</p>}
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-6 text-xs uppercase tracking-[0.35em]"
            style={{ color: accent }}
          >
            {[dateLine, event.city].filter(Boolean).join(" · ")}
          </motion.p>

          {/* Mobile: 3 oval gold-mirror thumbs */}
          {(frame1 || frame2 || frame3) && (
            <div className="md:hidden mt-10 flex items-center justify-center gap-4">
              {[frame1, frame2, frame3].filter(Boolean).slice(0, 3).map((f, i) => (
                <motion.figure
                  key={`mob-${i}`}
                  initial={reduce ? false : { opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 + i * 0.15 }}
                  className="relative w-16 h-20"
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      borderRadius: "50%",
                      border: `2px solid ${GOLD}`,
                      boxShadow: `0 8px 20px -8px ${GOLD}88, inset 0 0 0 3px ${IVORY}, inset 0 0 0 4px ${GOLD}88`,
                      background: IVORY,
                    }}
                  />
                  <div className="absolute inset-[4px] overflow-hidden" style={{ borderRadius: "50%" }}>
                    <img src={f!.publicUrl} alt={f!.caption ?? ""} className="w-full h-full object-cover" />
                  </div>
                </motion.figure>
              ))}
            </div>
          )}
        </motion.div>
      </section>

      {showStory && (
        <PalaceRoom label="Salon I — L'Invitation">
          <RoomHeading>The Invitation</RoomHeading>
          <p className="mx-auto max-w-2xl text-center text-lg leading-loose italic" style={{ color: `${INK}cc` }}>{invitationMessage}</p>
          <div className="mx-auto mt-10 max-w-2xl border-t pt-8 text-center" style={{ borderColor: `${GOLD}44` }}>
            <p className="text-base leading-relaxed" style={{ color: `${INK}99` }}>{aboutStory}</p>
          </div>
        </PalaceRoom>
      )}

      {showJourney && (
        <PalaceRoom label="Salon II — Le Programme">
          <RoomHeading>The Programme</RoomHeading>
          <Programme items={subEvents} />
        </PalaceRoom>
      )}

      {showGallery && (
        <PalaceRoom label="Salon III — La Galerie des Glaces">
          <RoomHeading>Hall of Mirrors</RoomHeading>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((m, i) => (
              <motion.figure
                key={`${m.fileName}-${i}`}
                initial={reduce ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.1, ease: EASE }}
                className="group p-2 rounded-t-[9rem]"
                style={{ border: `1.5px solid ${GOLD}` }}
              >
                <div className="overflow-hidden rounded-t-[8.5rem] p-1.5" style={{ border: `1px solid ${GOLD}88`, background: `${POWDER}22` }}>
                  <img
                    src={m.publicUrl}
                    alt={m.caption ?? ""}
                    className="aspect-[3/4] w-full rounded-t-[8rem] object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                {m.caption && <figcaption className="py-3 text-center text-xs italic tracking-[0.15em]" style={{ color: `${INK}99` }}>{m.caption}</figcaption>}
              </motion.figure>
            ))}
            {editing && galleryItems.length === 0 && (
              <div className="col-span-full flex h-48 items-center justify-center rounded-t-[6rem] border border-dashed text-sm" style={{ borderColor: GOLD, color: `${INK}80` }}>
                + Add photos
              </div>
            )}
          </div>
        </PalaceRoom>
      )}

      {showVenue && (
        <PalaceRoom label="Salon IV — Les Jardins">
          <RoomHeading>The Palace Grounds</RoomHeading>
          {event.venueName && (
            <p className="mb-2 text-center font-serif text-2xl tracking-[0.12em]" style={{ color: GARDEN }}>{event.venueName}</p>
          )}
          {event.venueAddress && <p className="mb-8 text-center text-sm italic" style={{ color: `${INK}99` }}>{event.venueAddress}</p>}
          <div className="overflow-hidden p-1" style={{ border: `1px solid ${GOLD}88` }}>
            <MapEmbed
              latitude={event.latitude}
              longitude={event.longitude}
              venueName={event.venueName}
              venueAddress={event.venueAddress}
              mapLink={event.mapLink}
            />
          </div>
        </PalaceRoom>
      )}

      <section className="relative px-6 py-24 text-center sm:py-32">
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE }}
          className="mx-auto max-w-2xl"
        >
          <p className="text-[11px] uppercase tracking-[0.6em]" style={{ color: GARDEN }}>Répondez s'il vous plaît</p>
          <h2 className="mt-5 font-serif text-[clamp(2rem,6vw,4rem)] tracking-[0.14em]" style={{ color: INK }}>{names || event.eventTitle}</h2>
          {dateLine && <p className="mt-4 text-sm uppercase tracking-[0.3em]" style={{ color: accent }}>{dateLine}</p>}
          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <motion.a
              whileHover={reduce ? undefined : { scale: 1.04 }}
              href={event.rsvpLinkOrContact}
              target="_blank"
              rel="noreferrer"
              className="mt-10 inline-block px-14 py-4 text-xs uppercase tracking-[0.4em] transition-shadow"
              style={{ background: accent, color: IVORY, boxShadow: `0 8px 30px ${accent}55` }}
            >
              Accept the Invitation
            </motion.a>
          )}
        </motion.div>
      </section>

      <footer className="border-t py-10 text-center" style={{ borderColor: `${GOLD}44` }}>
        <p className="text-xs uppercase tracking-[0.4em]" style={{ color: `${INK}80` }}>
          {event.eventTitle}{event.city ? ` · ${event.city}` : ""}
        </p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default VersaillesTemplate;
