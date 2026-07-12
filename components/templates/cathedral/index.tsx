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
const GOLD = "#d8b46a";
const GLASS = ["#7ea8ff", "#ff8bb0", "#d8b46a"];

const ARCH_CLIP =
  "polygon(50% 0%, 58% 1.5%, 67% 4.5%, 75% 9%, 82% 15%, 88% 22%, 93% 30%, 97% 39%, 99% 48%, 100% 58%, 100% 100%, 0% 100%, 0% 58%, 1% 48%, 3% 39%, 7% 30%, 12% 22%, 18% 15%, 25% 9%, 33% 4.5%, 42% 1.5%)";

const STARS = [
  ...Array.from({ length: 20 }, (_, i) => ({
    x: 5.5 + ((i * 53) % 75) / 10,
    y: 5 + i * 4.6,
    s: 1.2 + (i % 3) * 0.7,
    delay: ((i * 53) % 100) / 40,
  })),
  ...Array.from({ length: 20 }, (_, i) => ({
    x: 87 + ((i * 41) % 75) / 10,
    y: 7 + i * 4.5,
    s: 1.2 + ((i + 1) % 3) * 0.7,
    delay: ((i * 61 + 17) % 100) / 40,
  })),
  ...Array.from({ length: 20 }, (_, i) => ({
    x: 17 + ((i * 89) % 660) / 10,
    y: 3 + ((i * 47) % 280) / 10,
    s: 0.9 + (i % 2) * 0.6,
    delay: ((i * 37 + 9) % 100) / 40,
  })),
];

function CathedralSky({ reduce }: { reduce: boolean }) {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden bg-[#05060f]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#101a3a] via-[#05060f] to-[#05060f]" />
      <motion.div
        className="absolute -top-[10%] left-[8%] h-[45vh] w-[55vw] rounded-full opacity-25"
        style={{ background: "radial-gradient(ellipse, #7ea8ff33, transparent 70%)", filter: "blur(40px)" }}
        animate={reduce ? undefined : { x: [0, 60, 0], y: [0, 20, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -top-[6%] right-[4%] h-[40vh] w-[45vw] rounded-full opacity-20"
        style={{ background: "radial-gradient(ellipse, #ff8bb02e, transparent 70%)", filter: "blur(40px)" }}
        animate={reduce ? undefined : { x: [0, -50, 0], y: [0, 26, 0] }}
        transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#05060f]" />
    </div>
  );
}

function StarField({ reduce }: { reduce: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {STARS.map((st, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-white"
          style={{ left: `${st.x}%`, top: `${st.y}%`, width: st.s, height: st.s, boxShadow: "0 0 6px #ffffffcc" }}
          initial={reduce ? { opacity: 0.8 } : { opacity: 0 }}
          animate={reduce ? { opacity: 0.8 } : { opacity: [0, 0.9, 0.55, 0.9] }}
          transition={reduce ? undefined : { duration: 5, delay: 0.4 + st.delay, repeat: Infinity, repeatDelay: 1, times: [0, 0.12, 0.6, 1] }}
        />
      ))}
    </div>
  );
}

function GoldArch({ reduce }: { reduce: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 320 440"
      className="pointer-events-none absolute left-1/2 top-1/2 h-[86%] max-h-[600px] w-auto -translate-x-1/2 -translate-y-1/2"
      fill="none"
    >
      <motion.path
        d="M 26 440 L 26 176 Q 26 56 160 14 Q 294 56 294 176 L 294 440"
        stroke={GOLD}
        strokeWidth="1.2"
        initial={reduce ? { pathLength: 1 } : { pathLength: 0, opacity: 0.4 }}
        animate={{ pathLength: 1, opacity: 0.9 }}
        transition={{ duration: 2.6, delay: 0.6, ease: "easeInOut" }}
      />
      <motion.path
        d="M 48 440 L 48 184 Q 48 76 160 40 Q 272 76 272 184 L 272 440"
        stroke={GOLD}
        strokeWidth="0.6"
        initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
        animate={{ pathLength: 1, opacity: 0.45 }}
        transition={{ duration: 2.6, delay: 1, ease: "easeInOut" }}
      />
    </svg>
  );
}

function CathedralTimeline({ items }: { items: SubEvent[] }) {
  const reduce = useReducedMotion();
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <div className="mx-auto max-w-3xl px-6">
      <div className="relative space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-gradient-to-b before:from-transparent before:via-[#d8b46a66] before:to-transparent sm:before:left-1/2">
        {sorted.map((s, i) => (
          <motion.article
            key={s.order}
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
            className={`relative rounded-lg border border-white/[0.07] bg-white/[0.03] p-6 pl-10 backdrop-blur-sm sm:w-[calc(50%-2rem)] sm:pl-6 ${i % 2 === 0 ? "sm:mr-auto" : "sm:ml-auto"}`}
          >
            <span
              className="absolute left-[5px] top-7 h-2 w-2 rounded-full"
              style={{ background: GOLD, boxShadow: `0 0 10px ${GOLD}` }}
            />
            <p className="text-[10px] uppercase tracking-[0.35em]" style={{ color: GOLD }}>
              {[String(s.order).padStart(2, "0"), s.date, s.startTime].filter(Boolean).join(" · ")}
            </p>
            <h3 className="mt-2 font-display text-xl text-white">{s.name}</h3>
            {s.venueName && <p className="mt-1 text-sm text-white/55">{s.venueName}</p>}
            {s.description && <p className="mt-2 text-sm leading-relaxed text-white/55">{s.description}</p>}
            {s.dressCode && (
              <p className="mt-3 inline-block rounded-full border border-[#d8b46a4d] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[#d8b46a]">
                {s.dressCode}
              </p>
            )}
          </motion.article>
        ))}
      </div>
    </div>
  );
}

export const CathedralTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || GOLD;
  const tagline = event.tagline?.trim() || "Beneath a ceiling of stars";
  const invitationMessage =
    event.invitationMessage?.trim() ||
    "We invite you to gather in a cathedral built of starlight, where two lives are joined beneath a living sky.";
  const aboutStory =
    event.aboutStory?.trim() ||
    "Long before this night, two paths crossed under the same constellations. Now every star that watched the story unfold has come to stand as a pillar, and the sky itself arches into a nave to hold the vow.";
  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const hero = event.heroImageUrl || "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=1600&q=80";
  const names = [event.person1Name, event.person2Name].filter(Boolean).join(" & ");
  const [frame1, frame2, frame3] = event.showHeroFrames ? galleryItems : [];

  // Deterministic star field for the hero (two vertical column-clusters + a
  // scattered dust of pinpoints). Kept static so SSR + client render match.
  const HERO_STARS = useMemo(
    () => [
      ...Array.from({ length: 14 }, (_, i) => ({
        x: 4 + ((i * 37) % 60) / 12,
        y: 6 + i * 6.2,
        s: 0.9 + ((i * 7) % 3) * 0.4,
        d: ((i * 53) % 100) / 40,
      })),
      ...Array.from({ length: 14 }, (_, i) => ({
        x: 91 + ((i * 41) % 60) / 12,
        y: 8 + i * 6,
        s: 0.9 + ((i * 11) % 3) * 0.4,
        d: ((i * 61 + 17) % 100) / 40,
      })),
      ...Array.from({ length: 12 }, (_, i) => ({
        x: 20 + ((i * 71) % 600) / 10,
        y: 14 + ((i * 47) % 550) / 10,
        s: 0.7 + (i % 2) * 0.5,
        d: ((i * 29 + 5) % 100) / 40,
      })),
    ],
    [],
  );

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroTextY = useTransform(heroP, [0, 0.5], [0, -60]);
  const heroOpacity = useTransform(heroP, [0, 0.55], [1, 0]);

  const showStory = !event.hideStory;
  const showJourney = !event.hideEvents && subEvents.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  return (
    <div
      className="relative min-h-screen overflow-x-clip bg-[#05060f] font-sans text-[#eef1fa] antialiased"
      style={{ "--accent": accent } as React.CSSProperties}
    >
      <CathedralSky reduce={reduce} />
      <ScrollProgress color={accent} />

      <section
        ref={heroRef}
        className="relative flex min-h-[100svh] items-center justify-center overflow-hidden pb-24 sm:pb-28"
      >
        {/* Base image — near-black cathedral vignette on top so the hero
         *  reads as inky sky with faint architecture behind. */}
        <motion.div
          className="absolute inset-0"
          initial={reduce ? { opacity: 0.22 } : { opacity: 0.04 }}
          animate={{ opacity: 0.22 }}
          transition={{ duration: 3, ease: "easeOut" }}
        >
          <HeroMedia imageSrc={hero} videoSrc={event.heroVideoUrl || undefined} alt={event.eventTitle} />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_38%,rgba(16,26,58,0.35)_0%,rgba(5,6,15,0.85)_60%,#05060f_100%)]" />
        </motion.div>

        {/* SVG clip-path definitions for the two pointed-arch (Gothic)
         *  stained-glass window frames. Path drawn in a 100x140 viewBox and
         *  scaled with clipPathUnits="objectBoundingBox" so any frame ratio
         *  inherits the shape. */}
        <svg aria-hidden width="0" height="0" className="absolute">
          <defs>
            <clipPath id="cath-arch" clipPathUnits="objectBoundingBox">
              <path d="M 0.5,0 C 0.78,0 1,0.22 1,0.5 L 1,1 L 0,1 L 0,0.5 C 0,0.22 0.22,0 0.5,0 Z" />
            </clipPath>
            <clipPath id="cath-arch-tall" clipPathUnits="objectBoundingBox">
              <path d="M 0.5,0 C 0.82,0 1,0.16 1,0.36 L 1,1 L 0,1 L 0,0.36 C 0,0.16 0.18,0 0.5,0 Z" />
            </clipPath>
          </defs>
        </svg>

        {/* ~40 tiny deterministic star dots forming column-clusters left/right
         *  plus a scatter across the hero. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          {HERO_STARS.map((st, i) => (
            <motion.span
              key={`hs-${i}`}
              className="absolute rounded-full bg-white"
              style={{
                left: `${st.x}%`,
                top: `${st.y}%`,
                width: st.s,
                height: st.s,
                boxShadow: "0 0 5px #ffffffb0",
              }}
              initial={reduce ? { opacity: 0.55 } : { opacity: 0 }}
              animate={reduce ? { opacity: 0.55 } : { opacity: [0, 0.85, 0.35, 0.75] }}
              transition={
                reduce
                  ? undefined
                  : { duration: 5.5, delay: 0.4 + st.d, repeat: Infinity, repeatDelay: 1.2, times: [0, 0.15, 0.6, 1] }
              }
            />
          ))}
        </div>

        {/* Two thin gold pointed-arch outlines behind the title — reader
         *  stands inside the cathedral looking down the nave. */}
        <svg
          aria-hidden
          viewBox="0 0 400 520"
          preserveAspectRatio="xMidYMid meet"
          className="pointer-events-none absolute left-1/2 top-1/2 z-[1] h-[86%] max-h-[620px] w-auto -translate-x-1/2 -translate-y-1/2"
          fill="none"
        >
          <motion.path
            d="M 40 520 L 40 220 Q 40 60 200 20 Q 360 60 360 220 L 360 520"
            stroke={GOLD}
            strokeWidth="1"
            initial={reduce ? { pathLength: 1, opacity: 0.8 } : { pathLength: 0, opacity: 0.5 }}
            animate={{ pathLength: 1, opacity: 0.85 }}
            transition={{ duration: 2.4, delay: 0.5, ease: "easeInOut" }}
          />
          <motion.path
            d="M 78 520 L 78 232 Q 78 92 200 56 Q 322 92 322 232 L 322 520"
            stroke={GOLD}
            strokeWidth="0.55"
            initial={reduce ? { pathLength: 1, opacity: 0.4 } : { pathLength: 0, opacity: 0.2 }}
            animate={{ pathLength: 1, opacity: 0.4 }}
            transition={{ duration: 2.4, delay: 0.9, ease: "easeInOut" }}
          />
        </svg>

        {/* Frame 1 — top-left pointed-arch stained-glass window with lead-lines */}
        {frame1 && (
          <motion.figure
            initial={reduce ? false : { opacity: 0, y: -18, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-[5%] top-[10%] z-[2] hidden md:block"
            style={{ filter: `drop-shadow(0 18px 32px rgba(0,0,0,0.55)) drop-shadow(0 0 22px ${GOLD}55)` }}
          >
            <div
              className="relative"
              style={{
                width: "clamp(120px, 14vw, 200px)",
                height: "clamp(170px, 20vw, 280px)",
                background: `linear-gradient(180deg, ${GOLD}, #6d5324)`,
                padding: 3,
                clipPath: "url(#cath-arch)",
              }}
            >
              <div className="relative h-full w-full overflow-hidden" style={{ clipPath: "url(#cath-arch)" }}>
                <img
                  src={frame1.publicUrl}
                  alt={frame1.caption ?? ""}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                {/* Lead-lines overlay — thin dark bars evoking stained-glass caming */}
                <svg viewBox="0 0 100 140" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full">
                  <line x1="0" y1="46" x2="100" y2="46" stroke="#0a0d18" strokeWidth="1.2" opacity="0.75" />
                  <line x1="0" y1="86" x2="100" y2="86" stroke="#0a0d18" strokeWidth="1.2" opacity="0.75" />
                  <line x1="0" y1="112" x2="100" y2="112" stroke="#0a0d18" strokeWidth="1" opacity="0.65" />
                  <line x1="50" y1="0" x2="50" y2="140" stroke="#0a0d18" strokeWidth="1" opacity="0.6" />
                </svg>
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(126,168,255,0.18),transparent_40%,rgba(255,139,176,0.12))]" />
              </div>
            </div>
          </motion.figure>
        )}

        {/* Frame 2 — top-right taller/narrower pointed-arch with cross lead-lines
         *  and glass-blue radial glow behind it */}
        {frame2 && (
          <motion.figure
            initial={reduce ? false : { opacity: 0, y: 18, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-[5%] top-[14%] z-[2] hidden md:block"
          >
            <div
              aria-hidden
              className="absolute -inset-8 -z-10 rounded-full"
              style={{ background: "radial-gradient(circle, #7ea8ff55, transparent 65%)", filter: "blur(24px)" }}
            />
            <div
              className="relative"
              style={{
                width: "clamp(110px, 12.5vw, 180px)",
                height: "clamp(190px, 22vw, 320px)",
                background: `linear-gradient(180deg, ${GOLD}, #6d5324)`,
                padding: 3,
                clipPath: "url(#cath-arch-tall)",
                filter: `drop-shadow(0 18px 32px rgba(0,0,0,0.55)) drop-shadow(0 0 22px ${GOLD}55)`,
              }}
            >
              <div className="relative h-full w-full overflow-hidden" style={{ clipPath: "url(#cath-arch-tall)" }}>
                <img
                  src={frame2.publicUrl}
                  alt={frame2.caption ?? ""}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                {/* Cross lead-lines */}
                <svg viewBox="0 0 100 160" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full">
                  <line x1="50" y1="0" x2="50" y2="160" stroke="#0a0d18" strokeWidth="1.2" opacity="0.75" />
                  <line x1="0" y1="70" x2="100" y2="70" stroke="#0a0d18" strokeWidth="1.2" opacity="0.75" />
                  <line x1="0" y1="120" x2="100" y2="120" stroke="#0a0d18" strokeWidth="1" opacity="0.6" />
                </svg>
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(126,168,255,0.2),transparent_50%,rgba(255,139,176,0.1))]" />
              </div>
            </div>
          </motion.figure>
        )}

        {/* Frame 3 — bottom-left rose window (circular with 8-spoke divider) */}
        {frame3 && (
          <motion.figure
            initial={reduce ? false : { opacity: 0, scale: 0.85, rotate: -6 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-[8%] bottom-[10%] z-[2] hidden lg:block"
            style={{ filter: `drop-shadow(0 20px 40px rgba(0,0,0,0.6)) drop-shadow(0 0 26px ${GOLD}66)` }}
          >
            <div
              className="relative rounded-full"
              style={{
                width: "clamp(150px, 16vw, 220px)",
                height: "clamp(150px, 16vw, 220px)",
                background: `linear-gradient(180deg, ${GOLD}, #6d5324)`,
                padding: 4,
              }}
            >
              <div className="relative h-full w-full overflow-hidden rounded-full">
                <img
                  src={frame3.publicUrl}
                  alt={frame3.caption ?? ""}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                {/* 8-spoke rose-window divider + inner ring */}
                <svg viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 h-full w-full">
                  <circle cx="50" cy="50" r="49" fill="none" stroke={GOLD} strokeWidth="0.5" opacity="0.9" />
                  <circle cx="50" cy="50" r="18" fill="none" stroke={GOLD} strokeWidth="0.7" opacity="0.85" />
                  {Array.from({ length: 8 }).map((_, i) => {
                    const a = (i * Math.PI) / 4;
                    const x2 = 50 + Math.cos(a) * 49;
                    const y2 = 50 + Math.sin(a) * 49;
                    return (
                      <line
                        key={i}
                        x1="50"
                        y1="50"
                        x2={x2}
                        y2={y2}
                        stroke="#0a0d18"
                        strokeWidth="1"
                        opacity="0.7"
                      />
                    );
                  })}
                </svg>
                <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle,transparent_35%,rgba(126,168,255,0.18)_75%,rgba(255,139,176,0.15))]" />
              </div>
            </div>
          </motion.figure>
        )}

        {/* Title stack — centered, held between two gold arches */}
        <motion.div
          style={reduce ? undefined : { y: heroTextY, opacity: heroOpacity }}
          className="relative z-10 px-6 text-center"
        >
          <motion.span
            initial={reduce ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 0.9, y: 0 }}
            transition={{ delay: 1, duration: 1.2 }}
            className="mb-4 block text-lg"
            style={{ color: GOLD, textShadow: `0 0 10px ${GOLD}66` }}
          >
            ✦
          </motion.span>
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1.4 }}
            className="mb-6 text-[10px] uppercase tracking-[0.7em]"
            style={{ color: accent }}
          >
            {tagline}
          </motion.p>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 16, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 1.6, duration: 1.4, ease: EASE }}
            className="mx-auto max-w-[14ch] font-display text-[clamp(2.4rem,8vw,5.5rem)] leading-[1.05] text-white"
            style={{ textShadow: "0 0 40px #7ea8ff40" }}
          >
            {event.eventTitle}
          </motion.h1>
          {names && (
            <motion.p
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2, duration: 1.2 }}
              className="mt-5 font-display text-lg tracking-[0.2em] text-white/80"
            >
              {names}
            </motion.p>
          )}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.6, duration: 1 }}
            className="mt-8 flex flex-wrap justify-center gap-4 text-xs uppercase tracking-[0.4em] text-white/60"
          >
            {event.mainDate && (
              <span>{new Date(event.mainDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</span>
            )}
            {event.mainStartTime && <span style={{ color: accent }}>{event.mainStartTime}</span>}
            {event.city && <span>{event.city}</span>}
          </motion.div>
          <motion.span
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 0.85 }}
            transition={{ delay: 2.9, duration: 1.2 }}
            className="mt-6 block text-base"
            style={{ color: GOLD, textShadow: `0 0 8px ${GOLD}55` }}
          >
            ☩
          </motion.span>

          {/* Mobile-only cluster — three pointed-arch thumbs under the title */}
          {(frame1 || frame2 || frame3) && (
            <div className="mt-10 flex items-end justify-center gap-3 md:hidden">
              {[frame1, frame2, frame3].filter(Boolean).slice(0, 3).map((f, i) => (
                <motion.figure
                  key={`mob-arch-${i}`}
                  initial={reduce ? false : { opacity: 0, y: 12, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.7, delay: 0.9 + i * 0.15 }}
                  className="relative"
                  style={{
                    width: 66,
                    height: 90,
                    background: `linear-gradient(180deg, ${GOLD}, #6d5324)`,
                    padding: 2,
                    clipPath: "url(#cath-arch)",
                    filter: `drop-shadow(0 8px 16px rgba(0,0,0,0.6))`,
                  }}
                >
                  <div className="relative h-full w-full overflow-hidden" style={{ clipPath: "url(#cath-arch)" }}>
                    <img
                      src={f!.publicUrl}
                      alt={f!.caption ?? ""}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                    <svg viewBox="0 0 100 140" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full">
                      <line x1="0" y1="70" x2="100" y2="70" stroke="#0a0d18" strokeWidth="1.4" opacity="0.7" />
                      <line x1="50" y1="0" x2="50" y2="140" stroke="#0a0d18" strokeWidth="1" opacity="0.6" />
                    </svg>
                  </div>
                </motion.figure>
              ))}
            </div>
          )}
        </motion.div>

        {!reduce && (
          <motion.div
            animate={{ y: [0, 8, 0], opacity: [0.25, 0.7, 0.25] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-[10px] uppercase tracking-[0.4em]"
            style={{ color: accent }}
          >
            Enter the nave
          </motion.div>
        )}
      </section>

      {showStory && (
        <section className="relative mx-auto max-w-3xl px-6 py-28 text-center sm:py-36">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: EASE }}
          >
            <p className="mb-4 text-[10px] uppercase tracking-[0.5em]" style={{ color: accent }}>The Invitation</p>
            <h2 className="font-display text-2xl leading-snug text-white sm:text-3xl">{invitationMessage}</h2>
            <div className="mx-auto mt-10 h-px w-24" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
            <p className="mt-10 text-base leading-relaxed text-white/60 sm:text-lg">{aboutStory}</p>
          </motion.div>
        </section>
      )}

      {showJourney && (
        <section className="relative py-20 sm:py-28">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-14 text-center text-[10px] uppercase tracking-[0.5em]"
            style={{ color: accent }}
          >
            The Order of Ceremonies
          </motion.p>
          <CathedralTimeline items={subEvents} />
        </section>
      )}

      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-12 text-center text-[10px] uppercase tracking-[0.5em]"
            style={{ color: accent }}
          >
            The Windows
          </motion.p>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((m, i) => {
              const glass = GLASS[i % GLASS.length];
              return (
                <motion.figure
                  key={`${m.fileName}-${i}`}
                  initial={reduce ? false : { opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-8% 0px" }}
                  transition={{ duration: 0.7, delay: (i % 3) * 0.12, ease: EASE }}
                  className="group"
                  style={{ filter: `drop-shadow(0 0 18px ${glass}55)` }}
                >
                  <div className="p-[2px]" style={{ clipPath: ARCH_CLIP, background: `linear-gradient(180deg, ${glass}, #2a2f45)` }}>
                    <div className="overflow-hidden" style={{ clipPath: ARCH_CLIP }}>
                      <img
                        src={m.publicUrl}
                        alt={m.caption ?? ""}
                        className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  </div>
                  {m.caption && <figcaption className="mt-3 text-center text-xs tracking-[0.15em] text-white/50">{m.caption}</figcaption>}
                </motion.figure>
              );
            })}
            {editing && galleryItems.length === 0 && (
              <div className="col-span-full flex h-56 items-center justify-center border border-dashed border-[#d8b46a4d] text-sm text-white/50" style={{ clipPath: ARCH_CLIP }}>
                + Add photos
              </div>
            )}
          </div>
        </section>
      )}

      {showVenue && (
        <section className="relative mx-auto max-w-5xl px-6 py-20 sm:py-28">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-4 text-center text-[10px] uppercase tracking-[0.5em]"
            style={{ color: accent }}
          >
            The Sanctuary
          </motion.p>
          {event.venueName && <h2 className="mb-10 text-center font-display text-2xl text-white sm:text-3xl">{event.venueName}</h2>}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="overflow-hidden rounded-lg border border-[#d8b46a33] bg-white/[0.03] p-1"
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

      <section className="relative px-6 py-28 text-center sm:py-40">
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: EASE }}
          className="mx-auto max-w-2xl"
        >
          <div
            aria-hidden
            className="mx-auto mb-10 h-24 w-24 rounded-full opacity-40"
            style={{ background: `radial-gradient(circle, ${accent}, transparent 70%)`, filter: "blur(18px)" }}
          />
          <h2 className="font-display text-[clamp(2rem,6vw,4rem)] leading-tight text-white">{names || event.eventTitle}</h2>
          <p className="mt-4 text-xs uppercase tracking-[0.4em] text-white/50">
            {event.mainDate && new Date(event.mainDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <motion.div whileHover={reduce ? undefined : { scale: 1.03 }} className="mt-10 inline-block">
              <a
                href={event.rsvpLinkOrContact}
                target="_blank"
                rel="noreferrer"
                className="inline-block rounded-full border px-12 py-4 text-sm uppercase tracking-[0.35em] transition-all"
                style={{ borderColor: accent, color: accent }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 0 30px ${accent}66`; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}
              >
                Answer the invitation
              </a>
            </motion.div>
          )}
        </motion.div>
      </section>

      <footer className="border-t border-white/[0.05] py-8 text-center text-xs text-white/40">
        <p>{event.eventTitle}{names ? ` · ${names}` : ""}</p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default CathedralTemplate;
