"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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

const CONSTELLATIONS = Array.from({ length: 64 }, (_, i) => ({
  x: `${(i * 37 + 11) % 100}%`,
  y: `${(i * 53 + 17) % 100}%`,
  size: 1 + ((i * 7) % 3) * 0.6,
  glow: 4 + ((i * 3) % 5),
}));

const CONSTELLATION_LINES = [
  { x1: 12, y1: 22, x2: 22, y2: 30 },
  { x1: 22, y1: 30, x2: 31, y2: 24 },
  { x1: 31, y1: 24, x2: 40, y2: 34 },
  { x1: 66, y1: 58, x2: 74, y2: 66 },
  { x1: 74, y1: 66, x2: 82, y2: 61 },
  { x1: 82, y1: 61, x2: 88, y2: 72 },
  { x1: 18, y1: 74, x2: 27, y2: 82 },
  { x1: 27, y1: 82, x2: 36, y2: 76 },
];

const FLOATING_NOTES = [
  { glyph: "♪", x: "8%", delay: 0, dur: 6.5 },
  { glyph: "♫", x: "22%", delay: 1.4, dur: 7.2 },
  { glyph: "♬", x: "38%", delay: 2.6, dur: 6.1 },
  { glyph: "♪", x: "62%", delay: 0.8, dur: 7.8 },
  { glyph: "♫", x: "78%", delay: 2.1, dur: 6.6 },
  { glyph: "♬", x: "91%", delay: 3.2, dur: 7.4 },
];

const STAFF_NOTES = [
  { x: 8, line: 2, stem: "up" },
  { x: 16, line: 4, stem: "up" },
  { x: 24, line: 1, stem: "down" },
  { x: 32, line: 3, stem: "up" },
  { x: 40, line: 5, stem: "down" },
  { x: 48, line: 2, stem: "up" },
  { x: 56, line: 4, stem: "up" },
  { x: 64, line: 3, stem: "down" },
  { x: 72, line: 1, stem: "up" },
  { x: 80, line: 4, stem: "down" },
  { x: 88, line: 2, stem: "up" },
];

const ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
function toRoman(n: number): string {
  if (n >= 1 && n <= 10) return ROMAN[n];
  return String(n);
}

function CelestialField({ reduce, pulse }: { reduce: boolean; pulse: number }) {
  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #0f0a2a 0%, #1c1442 55%, #0f0a2a 100%)" }}
    >
      <div className="absolute inset-0 opacity-70" style={{ background: "radial-gradient(ellipse at 30% 20%, rgba(180,142,255,0.18), transparent 55%), radial-gradient(ellipse at 75% 75%, rgba(232,196,88,0.10), transparent 55%)" }} />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {CONSTELLATION_LINES.map((l, i) => (
          <line
            key={i}
            x1={l.x1}
            y1={l.y1}
            x2={l.x2}
            y2={l.y2}
            stroke="#b48eff"
            strokeWidth="0.08"
            opacity="0.25"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      <motion.div
        className="absolute inset-0"
        animate={reduce ? undefined : { scale: pulse }}
        transition={{ duration: 0.9, ease: "easeInOut" }}
      >
        {CONSTELLATIONS.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              left: s.x,
              top: s.y,
              width: s.size,
              height: s.size,
              background: i % 5 === 0 ? "#e8c458" : i % 7 === 0 ? "#ffb8d0" : "#f6f2ff",
              boxShadow: `0 0 ${s.glow}px currentColor`,
              color: i % 5 === 0 ? "#e8c458" : "#f6f2ff",
              opacity: 0.85,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}

function MusicStaff({ accent, reduce }: { accent: string; reduce: boolean }) {
  const lines = [1, 2, 3, 4, 5];
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute left-0 right-0 top-1/2 -translate-y-1/2 w-full h-40 opacity-40"
      viewBox="0 0 100 20"
      preserveAspectRatio="none"
    >
      {lines.map((l, i) => (
        <motion.line
          key={i}
          x1="0"
          x2="100"
          y1={4 + i * 3}
          y2={4 + i * 3}
          stroke="#f6f2ff"
          strokeWidth="0.08"
          vectorEffect="non-scaling-stroke"
          initial={reduce ? undefined : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.2, delay: 0.15 * i, ease: EASE }}
        />
      ))}
      {STAFF_NOTES.map((n, i) => {
        const cy = 4 + (n.line - 1) * 3;
        const stemY2 = n.stem === "up" ? cy - 5 : cy + 5;
        return (
          <motion.g
            key={i}
            initial={reduce ? undefined : { opacity: 0, y: -1 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 + i * 0.09, ease: EASE }}
          >
            <ellipse cx={n.x} cy={cy} rx="0.9" ry="0.65" fill={accent} transform={`rotate(-18 ${n.x} ${cy})`} />
            <line x1={n.stem === "up" ? n.x + 0.8 : n.x - 0.8} x2={n.stem === "up" ? n.x + 0.8 : n.x - 0.8} y1={cy} y2={stemY2} stroke={accent} strokeWidth="0.15" vectorEffect="non-scaling-stroke" />
          </motion.g>
        );
      })}
    </svg>
  );
}

function FloatingNotes({ reduce, accent }: { reduce: boolean; accent: string }) {
  if (reduce) return null;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {FLOATING_NOTES.map((n, i) => (
        <motion.span
          key={i}
          className="absolute font-display text-3xl"
          style={{ left: n.x, bottom: "-10%", color: i % 2 === 0 ? accent : "#e8c458", textShadow: `0 0 12px ${accent}` }}
          animate={{ y: ["0vh", "-110vh"], opacity: [0, 0.9, 0], rotate: [0, 12, -8, 6] }}
          transition={{ duration: n.dur, delay: n.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          {n.glyph}
        </motion.span>
      ))}
    </div>
  );
}

function Movement({ item, index, accent, isLast }: { item: SubEvent; index: number; accent: string; isLast: boolean }) {
  const reduce = useReducedMotion();
  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: EASE }}
      className="relative grid grid-cols-[auto,1fr] gap-6 sm:gap-10 items-start pb-10"
    >
      <div className="flex flex-col items-center pt-1">
        <span
          className="font-display italic text-4xl sm:text-5xl leading-none"
          style={{ color: accent, textShadow: `0 0 18px ${accent}55` }}
        >
          {toRoman(item.order)}
        </span>
        <span className="mt-2 block h-16 w-px" style={{ background: `linear-gradient(180deg, ${accent}, transparent)` }} aria-hidden />
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-[0.45em] opacity-60" style={{ color: "#ffb8d0" }}>
          Movement {toRoman(item.order)}
        </p>
        <h3 className="mt-2 font-display text-2xl sm:text-3xl tracking-tight" style={{ color: "#f6f2ff" }}>
          {item.name}
        </h3>
        <p className="mt-1 text-sm italic opacity-70" style={{ color: "#e8c458" }}>
          {[item.date, item.startTime].filter(Boolean).join(" · ")}
        </p>
        {item.venueName && (
          <p className="mt-2 text-sm opacity-70">at {item.venueName}</p>
        )}
        {item.description && (
          <p className="mt-3 max-w-xl text-sm leading-relaxed opacity-70">{item.description}</p>
        )}
        {item.dressCode && (
          <p className="mt-4 inline-block rounded-full border px-4 py-1 text-[10px] uppercase tracking-[0.3em]" style={{ borderColor: `${accent}55`, color: accent }}>
            {item.dressCode}
          </p>
        )}
      </div>
      {!isLast && (
        <div className="col-span-2 h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${accent}55, transparent)` }} aria-hidden />
      )}
    </motion.article>
  );
}

export const SymphonyTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;
  const [beat, setBeat] = useState(0);

  const accent = event.themeAccentColor || "#b48eff";
  const gold = "#e8c458";
  const ivory = "#f6f2ff";
  const tagline = event.tagline?.trim() || "A symphony of two souls beneath the stars";
  const invitationMessage = event.invitationMessage?.trim() || "Under a sky rehearsed for centuries, two melodies find their harmony. You are invited to witness the score come alive.";
  const aboutStory = event.aboutStory?.trim() || "Every love is composed in movements — an overture of first glances, an adagio of quiet mornings, a crescendo of vows. Ours has arrived at its finale, and we would be honoured to have you in the audience.";
  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  // Opt-in hero collage — gated on event.showHeroFrames so demos and the
  // default customer experience show a clean hero, not photos overlaid on it.
  const frame1 = event.showHeroFrames ? galleryItems[0] : undefined;
  const frame2 = event.showHeroFrames ? galleryItems[1] : undefined;
  const frame3 = event.showHeroFrames ? galleryItems[2] : undefined;
  const hero = event.heroImageUrl || "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1800&q=80";

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setBeat((b) => (b + 1) % 2), 2000);
    return () => clearInterval(id);
  }, [reduce]);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(heroP, [0, 1], [1, 0.92]);
  const heroTextY = useTransform(heroP, [0, 0.5], [0, -40]);
  const heroOpacity = useTransform(heroP, [0, 0.6], [1, 0]);

  const showStory = !event.hideStory;
  const showEvents = !event.hideEvents && subEvents.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  const pulse = beat === 0 ? 1 : 1.04;
  const sorted = [...subEvents].sort((a, b) => a.order - b.order);

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-sans antialiased"
      style={{ "--accent": accent, background: "#0f0a2a", color: ivory } as React.CSSProperties}
    >
      <CelestialField reduce={reduce} pulse={pulse} />
      <ScrollProgress color={accent} />

      {/* Hero — celestial symphony collage */}
      <section ref={heroRef} className="relative min-h-[100svh] flex items-center justify-center overflow-hidden pb-24 sm:pb-28">
        <motion.div style={reduce ? undefined : { scale: heroScale }} className="absolute inset-0">
          <HeroMedia imageSrc={hero} videoSrc={event.heroVideoUrl || undefined} alt={event.eventTitle} className="opacity-40" />
          {/* Deep-space vignette */}
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 15%, rgba(15,10,42,0.75) 65%, #0f0a2a 100%)" }} />
        </motion.div>

        <MusicStaff accent={accent} reduce={reduce} />
        <FloatingNotes reduce={reduce} accent={accent} />

        {/* Frame 1 — medallion sitting ON a music-staff line (top-left) */}
        {frame1 && (
          <div className="hidden md:block absolute left-[5%] top-[16%] w-44 lg:w-60 pointer-events-none">
            {/* Staff lines running behind & through the medallion, extending past frame */}
            <svg
              aria-hidden
              className="absolute left-[-40%] right-[-40%] top-1/2 -translate-y-1/2 h-24 w-[180%]"
              viewBox="0 0 180 20"
              preserveAspectRatio="none"
            >
              {[0, 1, 2, 3, 4].map((i) => (
                <line
                  key={i}
                  x1="0"
                  x2="180"
                  y1={4 + i * 3}
                  y2={4 + i * 3}
                  stroke={gold}
                  strokeWidth="0.12"
                  opacity="0.55"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </svg>
            <motion.figure
              initial={reduce ? false : { opacity: 0, y: -18, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.1, delay: 0.3, ease: EASE }}
              className="relative w-full aspect-square rounded-full overflow-hidden pointer-events-auto"
              style={{
                border: `2px solid ${gold}`,
                boxShadow: `0 0 0 4px rgba(15,10,42,0.6), 0 20px 40px -12px rgba(0,0,0,0.6), 0 0 50px -10px ${accent}88`,
              }}
            >
              <motion.img
                src={frame1.publicUrl}
                alt={frame1.caption ?? ""}
                loading="lazy"
                className="w-full h-full object-cover"
                animate={reduce ? undefined : { y: [0, -5, 0] }}
                transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
              />
              <figcaption
                className="absolute bottom-1 inset-x-0 text-center text-[9px] uppercase tracking-[0.3em] py-1"
                style={{ color: gold, textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}
              >
                {frame1.caption ?? "Adagio"}
              </figcaption>
            </motion.figure>
          </div>
        )}

        {/* Frame 2 — whole-note glyph frame (top-right), slow rotate */}
        {frame2 && (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.55, ease: EASE }}
            className="hidden md:block absolute right-[6%] top-[20%] w-40 lg:w-52"
          >
            <motion.div
              animate={reduce ? undefined : { rotate: 360 }}
              transition={{ duration: 720, repeat: Infinity, ease: "linear" }}
              className="relative w-full aspect-square"
            >
              {/* Stem + flag SVG attached to top-right of the circle */}
              <svg
                aria-hidden
                className="absolute inset-0 w-full h-full overflow-visible"
                viewBox="0 0 100 100"
              >
                {/* stem */}
                <line
                  x1="88"
                  y1="18"
                  x2="88"
                  y2="-24"
                  stroke={gold}
                  strokeWidth="1.2"
                  vectorEffect="non-scaling-stroke"
                />
                {/* flag */}
                <path
                  d="M88,-24 C96,-18 100,-10 96,-2"
                  stroke={gold}
                  strokeWidth="1.6"
                  fill="none"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              <figure
                className="relative w-full h-full rounded-full overflow-hidden"
                style={{
                  border: `2px solid ${gold}`,
                  boxShadow: `0 0 0 4px rgba(15,10,42,0.6), 0 20px 40px -12px rgba(0,0,0,0.6), 0 0 50px -10px ${accent}88`,
                }}
              >
                <img
                  src={frame2.publicUrl}
                  alt={frame2.caption ?? ""}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                <figcaption
                  className="absolute bottom-1 inset-x-0 text-center text-[9px] uppercase tracking-[0.3em] py-1"
                  style={{ color: gold, textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}
                >
                  {frame2.caption ?? "Andante"}
                </figcaption>
              </figure>
            </motion.div>
          </motion.div>
        )}

        {/* Frame 3 — treble-clef-flanked rectangular frame (bottom-left) */}
        {frame3 && (
          <motion.figure
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.8, ease: EASE }}
            className="hidden lg:flex absolute left-[7%] bottom-[14%] items-center gap-3"
          >
            {/* Treble clef glyph */}
            <span
              aria-hidden
              className="font-display leading-none select-none"
              style={{
                fontSize: "6rem",
                color: gold,
                textShadow: `0 0 20px ${accent}88`,
                lineHeight: 0.85,
              }}
            >
              𝄞
            </span>
            <div
              className="relative w-40 h-52 overflow-hidden rounded-sm"
              style={{
                border: `1.5px solid ${gold}`,
                boxShadow: `0 20px 40px -12px rgba(0,0,0,0.7), 0 0 40px -10px ${accent}66`,
              }}
            >
              <img
                src={frame3.publicUrl}
                alt={frame3.caption ?? ""}
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 55%, rgba(15,10,42,0.85) 100%)" }} />
              <figcaption
                className="absolute bottom-2 inset-x-0 text-center text-[9px] uppercase tracking-[0.3em]"
                style={{ color: gold }}
              >
                {frame3.caption ?? "Cadenza"}
              </figcaption>
            </div>
          </motion.figure>
        )}

        <motion.div style={reduce ? undefined : { y: heroTextY, opacity: heroOpacity }} className="relative z-10 px-6 text-center">
          {/* Ornament: ♪ above title */}
          <motion.div
            aria-hidden
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 0.85 }}
            transition={{ duration: 1, delay: 0.15 }}
            className="mb-3 flex items-center justify-center gap-3"
          >
            <span className="h-px w-10 sm:w-14" style={{ background: `linear-gradient(90deg, transparent, ${accent})` }} />
            <span className="font-display text-xl" style={{ color: accent, textShadow: `0 0 12px ${accent}` }}>♪</span>
            <span className="h-px w-10 sm:w-14" style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }} />
          </motion.div>
          <motion.p
            initial={reduce ? false : { opacity: 0, letterSpacing: "0.2em" }}
            animate={{ opacity: 1, letterSpacing: "0.55em" }}
            transition={{ duration: 1.4, ease: EASE }}
            className="mb-6 text-[11px] uppercase"
            style={{ color: gold }}
          >
            {tagline}
          </motion.p>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6, delay: 0.3, ease: EASE }}
            className="font-display italic text-[clamp(3rem,10vw,7.5rem)] leading-[0.95] tracking-tight"
            style={{ color: ivory, textShadow: `0 0 40px ${accent}77` }}
          >
            {event.person1Name || event.eventTitle}
            {event.person2Name && (
              <>
                <span className="block my-2 text-2xl not-italic tracking-[0.5em]" style={{ color: gold }}>&amp;</span>
                {event.person2Name}
              </>
            )}
          </motion.h1>
          {/* Ornament: ♫ below title */}
          <motion.div
            aria-hidden
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 0.75 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="mt-6 flex items-center justify-center gap-3"
          >
            <span className="h-px w-12 sm:w-16" style={{ background: `linear-gradient(90deg, transparent, ${gold})` }} />
            <span className="font-display text-lg" style={{ color: gold }}>♫</span>
            <span className="h-px w-12 sm:w-16" style={{ background: `linear-gradient(90deg, ${gold}, transparent)` }} />
          </motion.div>
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="mt-8 flex flex-wrap justify-center gap-6 text-xs uppercase tracking-[0.4em] opacity-80"
          >
            {event.mainDate && (
              <span>{new Date(event.mainDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
            )}
            {event.mainStartTime && <span style={{ color: accent }}>✦</span>}
            {event.mainStartTime && <span>{event.mainStartTime}</span>}
            {event.city && (<><span style={{ color: accent }}>✦</span><span>{event.city}</span></>)}
          </motion.div>

          {/* Mobile-only compact collage — 3 gold-ring circular thumbs */}
          {(frame1 || frame2 || frame3) && (
            <div className="md:hidden mt-10 flex items-center justify-center gap-4">
              {[frame1, frame2, frame3].filter(Boolean).slice(0, 3).map((f, i) => (
                <motion.figure
                  key={`mob-${i}`}
                  initial={reduce ? false : { opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 + i * 0.15 }}
                  className="w-16 h-16 rounded-full overflow-hidden"
                  style={{
                    border: `2px solid ${gold}`,
                    boxShadow: `0 8px 20px -8px rgba(0,0,0,0.7), 0 0 24px -6px ${accent}88`,
                  }}
                >
                  <img src={f!.publicUrl} alt={f!.caption ?? ""} loading="lazy" className="w-full h-full object-cover" />
                </motion.figure>
              ))}
            </div>
          )}
        </motion.div>

        {!reduce && (
          <motion.div
            animate={{ opacity: [0.3, 0.9, 0.3], y: [0, 6, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 font-display italic text-xs tracking-[0.5em]"
            style={{ color: gold }}
          >
            Overture
          </motion.div>
        )}
      </section>

      {/* Story */}
      {showStory && (
        <section className="relative mx-auto max-w-4xl px-6 py-28 sm:py-40">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-8 text-center text-[10px] uppercase tracking-[0.55em]"
            style={{ color: gold }}
          >
            Prelude
          </motion.p>
          <motion.blockquote
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: EASE }}
            className="font-display italic text-center text-2xl sm:text-3xl md:text-4xl leading-[1.35]"
            style={{ color: ivory }}
          >
            <span className="block text-6xl leading-none" style={{ color: accent }}>&ldquo;</span>
            {invitationMessage}
          </motion.blockquote>
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.25, ease: EASE }}
            className="mx-auto mt-12 max-w-2xl text-center text-base leading-relaxed opacity-75"
          >
            {aboutStory}
          </motion.p>
          <div className="mx-auto mt-12 h-px w-40" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
        </section>
      )}

      {/* Sub-events / movements */}
      {showEvents && (
        <section className="relative mx-auto max-w-4xl px-6 py-24 sm:py-32">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-4 text-center text-[10px] uppercase tracking-[0.55em]"
            style={{ color: gold }}
          >
            The Composition
          </motion.p>
          <h2 className="mb-14 text-center font-display italic text-4xl sm:text-5xl tracking-tight" style={{ color: ivory }}>
            Movements of the Evening
          </h2>
          <div className="relative">
            {sorted.map((s, i) => (
              <Movement key={s.order} item={s} index={i} accent={accent} isLast={i === sorted.length - 1} />
            ))}
          </div>
        </section>
      )}

      {/* Gallery */}
      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-4 text-center text-[10px] uppercase tracking-[0.55em]"
            style={{ color: gold }}
          >
            Interlude
          </motion.p>
          <h2 className="mb-12 text-center font-display italic text-4xl sm:text-5xl tracking-tight" style={{ color: ivory }}>
            Notes from our score
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((m, i) => (
              <motion.figure
                key={`${m.fileName}-${i}`}
                initial={reduce ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.05, ease: EASE }}
                className="group relative overflow-hidden rounded-sm"
                style={{ border: `1px solid ${accent}33` }}
              >
                <img
                  src={m.publicUrl}
                  alt={m.caption ?? ""}
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 55%, #0f0a2acc 100%)" }} />
                {m.caption && (
                  <figcaption className="absolute bottom-3 left-4 right-4 text-xs italic opacity-90" style={{ color: ivory }}>
                    {m.caption}
                  </figcaption>
                )}
              </motion.figure>
            ))}
            {editing && galleryItems.length === 0 && (
              <div className="col-span-full flex h-56 items-center justify-center rounded-sm border border-dashed text-sm opacity-60" style={{ borderColor: `${accent}66` }}>
                + Add photos
              </div>
            )}
          </div>
        </section>
      )}

      {/* Venue */}
      {showVenue && (
        <section className="relative mx-auto max-w-5xl px-6 py-24 sm:py-32">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-4 text-center text-[10px] uppercase tracking-[0.55em]"
            style={{ color: gold }}
          >
            The Concert Hall
          </motion.p>
          <h2 className="mb-3 text-center font-display italic text-4xl sm:text-5xl tracking-tight" style={{ color: ivory }}>
            {event.venueName || "Where the score is heard"}
          </h2>
          {event.venueAddress && (
            <p className="mb-10 text-center text-sm opacity-70">{event.venueAddress}</p>
          )}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE }}
            className="overflow-hidden rounded-sm p-1 backdrop-blur-md"
            style={{ border: `1px solid ${accent}44`, background: "rgba(28,20,66,0.5)" }}
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

      {/* CTA / RSVP */}
      <section className="relative px-6 py-28 text-center sm:py-40">
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: EASE }}
          className="mx-auto max-w-3xl"
        >
          <motion.div
            aria-hidden
            animate={reduce ? undefined : { scale: [1, 1.06, 1], opacity: [0.35, 0.55, 0.35] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            className="mx-auto mb-10 h-28 w-28 rounded-full sm:h-36 sm:w-36"
            style={{ background: `radial-gradient(circle, ${accent} 0%, transparent 70%)`, filter: "blur(18px)" }}
          />
          <p className="mb-4 text-[10px] uppercase tracking-[0.6em]" style={{ color: gold }}>
            Finale
          </p>
          <h2 className="font-display italic text-[clamp(2.5rem,7vw,5.5rem)] leading-[1] tracking-tight" style={{ color: ivory, textShadow: `0 0 40px ${accent}55` }}>
            Join the symphony
          </h2>
          {event.mainDate && (
            <p className="mt-6 text-sm uppercase tracking-[0.45em] opacity-75">
              {new Date(event.mainDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
            </p>
          )}
          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <motion.div whileHover={reduce ? undefined : { scale: 1.04 }} className="mt-12 inline-block">
              <a
                href={event.rsvpLinkOrContact}
                target="_blank"
                rel="noreferrer"
                className="inline-block rounded-full border px-14 py-4 text-sm uppercase tracking-[0.4em] transition-all"
                style={{ borderColor: accent, color: ivory, background: `linear-gradient(135deg, ${accent}22, transparent)`, boxShadow: `0 0 30px ${accent}44` }}
              >
                Reserve your seat
              </a>
            </motion.div>
          )}
        </motion.div>
      </section>

      <footer className="relative border-t py-10 text-center text-xs opacity-60" style={{ borderColor: `${accent}22` }}>
        <p className="font-display italic tracking-[0.35em]" style={{ color: gold }}>
          {event.eventTitle}
          {event.person1Name && event.person2Name ? ` ✦ ${event.person1Name} & ${event.person2Name}` : event.person1Name ? ` ✦ ${event.person1Name}` : ""}
        </p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default SymphonyTemplate;
