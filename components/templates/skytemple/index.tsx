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

const CLOUDS = [
  { x: "5%", y: "12%", w: 420, h: 140, dur: 48, delay: 0, opacity: 0.85 },
  { x: "28%", y: "62%", w: 520, h: 170, dur: 62, delay: 4, opacity: 0.7 },
  { x: "55%", y: "22%", w: 360, h: 120, dur: 54, delay: 2, opacity: 0.9 },
  { x: "72%", y: "70%", w: 480, h: 160, dur: 70, delay: 6, opacity: 0.75 },
  { x: "82%", y: "8%", w: 300, h: 110, dur: 44, delay: 3, opacity: 0.8 },
  { x: "12%", y: "80%", w: 400, h: 140, dur: 58, delay: 5, opacity: 0.65 },
];

const BIRDS = Array.from({ length: 9 }, (_, i) => ({
  startX: (i * 137) % 100,
  startY: (i * 53) % 80,
  dur: 22 + (i % 4) * 5,
  delay: (i % 6) * 2.4,
  size: 14 + (i % 3) * 4,
}));

function SkyField({ reduce }: { reduce: boolean }) {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #dfeaf6 0%, #d3e0ee 45%, #c8dae8 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, rgba(250,247,240,0.55), transparent 55%), radial-gradient(ellipse at 75% 80%, rgba(230,201,136,0.18), transparent 60%)",
        }}
      />
      {!reduce && (
        <>
          {CLOUDS.map((c, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                left: c.x,
                top: c.y,
                width: c.w,
                height: c.h,
                background:
                  "radial-gradient(ellipse at 40% 45%, rgba(255,255,255,0.95), rgba(250,247,240,0.6) 55%, rgba(173,195,216,0.0) 78%)",
                filter: "blur(6px)",
                opacity: c.opacity,
              }}
              animate={{ x: [0, 60, 0], y: [0, -12, 0] }}
              transition={{
                duration: c.dur,
                delay: c.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
          {BIRDS.map((b, i) => (
            <motion.svg
              key={i}
              className="absolute"
              style={{ left: `${b.startX}%`, top: `${b.startY}%` }}
              width={b.size}
              height={b.size * 0.6}
              viewBox="0 0 24 14"
              animate={{ x: ["-4vw", "108vw"], y: [0, -40, 20, -10] }}
              transition={{
                duration: b.dur,
                delay: b.delay,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <path
                d="M1 8 Q6 1 12 7 Q18 1 23 8"
                stroke="#e6c988"
                strokeWidth="1.6"
                fill="none"
                strokeLinecap="round"
              />
            </motion.svg>
          ))}
        </>
      )}
    </div>
  );
}

function TempleDoors({ accent, reduce }: { accent: string; reduce: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const leftRot = useTransform(scrollYProgress, [0, 0.6], [0, -85]);
  const rightRot = useTransform(scrollYProgress, [0, 0.6], [0, 85]);
  const glow = useTransform(scrollYProgress, [0, 0.5], [0.2, 0.9]);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
      style={{ perspective: "1400px" }}
    >
      <motion.div
        style={{
          opacity: reduce ? 0.6 : glow,
          width: "60%",
          height: "80%",
          background:
            `radial-gradient(ellipse at center, ${accent}55, ${accent}22 45%, transparent 70%)`,
          filter: "blur(30px)",
        }}
        className="absolute"
      />
      <motion.div
        style={{
          rotateY: reduce ? 0 : leftRot,
          transformOrigin: "left center",
          background:
            "linear-gradient(180deg, #faf7f0 0%, #f0e9d8 50%, #d9cba4 100%)",
          boxShadow: "inset -20px 0 40px rgba(38,54,78,0.15), 0 20px 60px rgba(38,54,78,0.2)",
        }}
        className="relative h-[70%] w-[26%] rounded-t-[50%] border-r-2"
      >
        <div
          className="absolute inset-x-4 top-6 bottom-8 rounded-t-[50%] border"
          style={{ borderColor: `${accent}66` }}
        />
      </motion.div>
      <motion.div
        style={{
          rotateY: reduce ? 0 : rightRot,
          transformOrigin: "right center",
          background:
            "linear-gradient(180deg, #faf7f0 0%, #f0e9d8 50%, #d9cba4 100%)",
          boxShadow: "inset 20px 0 40px rgba(38,54,78,0.15), 0 20px 60px rgba(38,54,78,0.2)",
        }}
        className="relative h-[70%] w-[26%] rounded-t-[50%] border-l-2"
      >
        <div
          className="absolute inset-x-4 top-6 bottom-8 rounded-t-[50%] border"
          style={{ borderColor: `${accent}66` }}
        />
      </motion.div>
    </div>
  );
}

function SkyBridge({ items, accent }: { items: SubEvent[]; accent: string }) {
  const reduce = useReducedMotion();
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <div className="relative mx-auto max-w-5xl px-6">
      <div className="grid gap-16 sm:gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((s, i) => (
          <motion.div
            key={s.order}
            initial={reduce ? false : { opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8% 0px" }}
            transition={{ duration: 0.8, delay: i * 0.12, ease: EASE }}
            className="relative"
          >
            <div
              aria-hidden
              className="absolute -bottom-6 left-1/2 h-8 w-[110%] -translate-x-1/2 rounded-[50%]"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(255,255,255,0.95), rgba(173,195,216,0.35) 55%, transparent 78%)",
                filter: "blur(4px)",
              }}
            />
            {i < sorted.length - 1 && (
              <svg
                aria-hidden
                className="absolute -right-8 top-1/2 hidden h-16 w-16 -translate-y-1/2 lg:block"
                viewBox="0 0 60 60"
              >
                <path
                  d="M4 44 Q30 4 56 44"
                  stroke={accent}
                  strokeWidth="1"
                  fill="none"
                  strokeDasharray="3 4"
                  opacity="0.65"
                />
              </svg>
            )}
            <article
              className="relative rounded-t-[40%] rounded-b-2xl border p-6 pt-8 shadow-[0_20px_60px_-20px_rgba(38,54,78,0.35)] backdrop-blur-sm"
              style={{
                background:
                  "linear-gradient(180deg, rgba(250,247,240,0.95), rgba(250,247,240,0.78))",
                borderColor: "rgba(230,201,136,0.5)",
              }}
            >
              <span
                className="mx-auto mb-4 flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-semibold"
                style={{
                  background: accent,
                  color: "#26364e",
                  boxShadow: `0 0 24px ${accent}66`,
                }}
              >
                {String(s.order).padStart(2, "0")}
              </span>
              <p
                className="text-center text-[10px] uppercase tracking-[0.35em]"
                style={{ color: "#26364e", opacity: 0.55 }}
              >
                {[s.date, s.startTime].filter(Boolean).join(" · ")}
              </p>
              <h3
                className="mt-2 text-center font-display text-2xl tracking-tight"
                style={{ color: "#26364e" }}
              >
                {s.name}
              </h3>
              {s.venueName && (
                <p className="mt-1 text-center text-sm" style={{ color: "#26364e", opacity: 0.65 }}>
                  {s.venueName}
                </p>
              )}
              {s.description && (
                <p
                  className="mt-3 text-center text-sm leading-relaxed"
                  style={{ color: "#26364e", opacity: 0.7 }}
                >
                  {s.description}
                </p>
              )}
              {s.dressCode && (
                <p
                  className="mx-auto mt-4 inline-block rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.25em]"
                  style={{ borderColor: `${accent}88`, color: "#26364e" }}
                >
                  {s.dressCode}
                </p>
              )}
            </article>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export const SkytempleTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || "#e6c988";
  const tagline = event.tagline?.trim() || "Above the clouds, two souls meet.";
  const invitationMessage =
    event.invitationMessage?.trim() ||
    "Beyond the veil of clouds, where marble sanctuaries drift in golden light, we open our doors to you.";
  const aboutStory = event.aboutStory?.trim() || "";
  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const [frame1, frame2, frame3] = event.showHeroFrames ? galleryItems : [];
  const hero =
    event.heroImageUrl ||
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1800&q=80";

  // Deterministic gold-bird flight paths across the hero
  const HERO_BIRDS = [
    { left: "8%", top: "18%", size: 18, rot: -12, delay: 0 },
    { left: "22%", top: "62%", size: 14, rot: 8, delay: 1.2 },
    { left: "38%", top: "10%", size: 20, rot: -6, delay: 2.4 },
    { left: "55%", top: "48%", size: 12, rot: 14, delay: 0.6 },
    { left: "68%", top: "22%", size: 16, rot: -10, delay: 3.0 },
    { left: "82%", top: "58%", size: 14, rot: 6, delay: 1.8 },
    { left: "90%", top: "14%", size: 12, rot: -4, delay: 2.2 },
  ];

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroTextY = useTransform(heroP, [0, 1], [0, -80]);
  const heroTextOpacity = useTransform(heroP, [0, 0.6], [1, 0]);

  const showStory = !event.hideStory;
  const showJourney = !event.hideEvents && subEvents.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  const mainDate = event.mainDate
    ? new Date(event.mainDate).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-sans antialiased"
      style={{
        "--accent": accent,
        color: "#26364e",
      } as React.CSSProperties}
    >
      <SkyField reduce={reduce} />
      <ScrollProgress color={accent} />

      {/* ─── 01. TEMPLES ABOVE THE CLOUDS ─── */}
      <section
        ref={heroRef}
        className="relative flex min-h-[100svh] items-center justify-center overflow-hidden pb-24 sm:pb-28"
      >
        <div className="absolute inset-0">
          <HeroMedia
            imageSrc={hero}
            videoSrc={event.heroVideoUrl || undefined}
            alt={event.eventTitle}
            className="opacity-60"
          />
          {/* Pale sky-blue vignette — light, never dark */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(250,247,240,0.55) 0%, rgba(223,234,246,0.35) 45%, rgba(200,218,232,0.7) 100%), radial-gradient(circle at 50% 42%, transparent 30%, rgba(200,218,232,0.35) 100%)",
            }}
          />
        </div>

        {/* ─── Gold birds — deterministic diagonal flights ─── */}
        {!reduce &&
          HERO_BIRDS.map((b, i) => (
            <motion.svg
              key={`bird-${i}`}
              aria-hidden
              className="pointer-events-none absolute z-[5]"
              style={{ left: b.left, top: b.top, transform: `rotate(${b.rot}deg)` }}
              width={b.size}
              height={b.size * 0.55}
              viewBox="0 0 24 14"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.9, 0.9, 0],
                x: [0, 60, 120],
                y: [0, -18, -6],
              }}
              transition={{
                duration: 9 + (i % 3) * 2,
                delay: b.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <path
                d="M1 8 Q6 1 12 7 Q18 1 23 8"
                stroke="#c9a45a"
                strokeWidth="1.7"
                fill="none"
                strokeLinecap="round"
              />
            </motion.svg>
          ))}

        {/* ─── Frame 1 · cloud-island (top-left) ─── */}
        {frame1 && (
          <motion.figure
            initial={reduce ? false : { opacity: 0, y: -20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.3, ease: EASE }}
            className="pointer-events-none absolute left-[5%] top-[12%] hidden md:block w-40 h-48 lg:w-56 lg:h-64 z-[4]"
          >
            {/* Cloud-outline pane */}
            <div
              className="relative h-full w-full overflow-hidden"
              style={{
                borderRadius: "60% 40% 55% 45% / 45% 60% 40% 55%",
                background: "rgba(250,247,240,0.92)",
                border: `1px solid ${accent}88`,
                boxShadow: `0 24px 60px -20px rgba(38,54,78,0.35), 0 0 0 8px rgba(255,255,255,0.55), 0 0 40px -12px ${accent}55`,
                padding: 6,
              }}
            >
              <motion.img
                src={frame1.publicUrl}
                alt={frame1.caption ?? ""}
                loading="lazy"
                className="h-full w-full object-cover"
                style={{ borderRadius: "60% 40% 55% 45% / 45% 60% 40% 55%" }}
                animate={reduce ? undefined : { y: [0, -8, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
            {frame1.caption && (
              <figcaption
                className="mt-2 text-center text-[9px] uppercase tracking-[0.35em]"
                style={{ color: "#26364e", opacity: 0.7 }}
              >
                {frame1.caption}
              </figcaption>
            )}
          </motion.figure>
        )}

        {/* ─── Frame 2 · temple-arch (top-right) ─── */}
        {frame2 && (
          <motion.figure
            initial={reduce ? false : { opacity: 0, y: 20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.55, ease: EASE }}
            className="pointer-events-none absolute right-[6%] top-[18%] hidden md:block w-40 h-56 lg:w-52 lg:h-72 z-[4]"
          >
            <motion.div
              className="relative h-full w-full"
              animate={reduce ? undefined : { y: [0, 6, 0] }}
              transition={{ duration: 8, delay: 1, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Temple-arch SVG — two pillars + semi-circle capital */}
              <svg
                aria-hidden
                viewBox="0 0 100 140"
                preserveAspectRatio="none"
                className="absolute inset-0 h-full w-full"
              >
                {/* Capital semi-circle */}
                <path
                  d="M8 40 Q50 -6 92 40 L92 44 Q50 4 8 44 Z"
                  fill="rgba(250,247,240,0.95)"
                  stroke={accent}
                  strokeWidth="1.2"
                />
                {/* Left pillar */}
                <rect x="6" y="40" width="6" height="96" fill="rgba(250,247,240,0.95)" stroke={accent} strokeWidth="0.8" />
                {/* Right pillar */}
                <rect x="88" y="40" width="6" height="96" fill="rgba(250,247,240,0.95)" stroke={accent} strokeWidth="0.8" />
                {/* Base plinth */}
                <rect x="2" y="132" width="96" height="6" fill="rgba(250,247,240,0.95)" stroke={accent} strokeWidth="0.8" />
                {/* Small gold finial */}
                <circle cx="50" cy="8" r="2.5" fill={accent} />
              </svg>
              {/* Photo inside the arch */}
              <div
                className="absolute overflow-hidden"
                style={{
                  left: "16%",
                  right: "16%",
                  top: "12%",
                  bottom: "10%",
                  borderRadius: "50% 50% 6% 6% / 22% 22% 6% 6%",
                  boxShadow: `inset 0 0 0 1px ${accent}66, 0 12px 30px -12px rgba(38,54,78,0.35)`,
                }}
              >
                <img
                  src={frame2.publicUrl}
                  alt={frame2.caption ?? ""}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
            </motion.div>
            {frame2.caption && (
              <figcaption
                className="mt-2 text-center text-[9px] uppercase tracking-[0.35em]"
                style={{ color: "#26364e", opacity: 0.7 }}
              >
                {frame2.caption}
              </figcaption>
            )}
          </motion.figure>
        )}

        {/* ─── Frame 3 · stone-bridge tile (bottom-left, landscape) ─── */}
        {frame3 && (
          <motion.figure
            initial={reduce ? false : { opacity: 0, y: 20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.8, ease: EASE }}
            className="pointer-events-none absolute left-[8%] bottom-[14%] hidden lg:block w-60 z-[4]"
          >
            <motion.div
              className="relative"
              animate={reduce ? undefined : { y: [0, -6, 0] }}
              transition={{ duration: 9, delay: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Landscape marble tile */}
              <div
                className="relative overflow-hidden rounded-md"
                style={{
                  background: "rgba(250,247,240,0.95)",
                  border: `1px solid ${accent}88`,
                  boxShadow: `0 24px 55px -22px rgba(38,54,78,0.4), 0 0 0 6px rgba(255,255,255,0.5)`,
                  padding: 6,
                }}
              >
                <img
                  src={frame3.publicUrl}
                  alt={frame3.caption ?? ""}
                  loading="lazy"
                  className="h-32 w-full rounded-sm object-cover"
                />
              </div>
              {/* Bridge-arch SVG anchored to base */}
              <svg
                aria-hidden
                viewBox="0 0 240 40"
                className="mt-[-2px] block w-full"
                preserveAspectRatio="none"
                height={26}
              >
                <path
                  d="M0 4 Q120 44 240 4 L240 40 L0 40 Z"
                  fill="rgba(250,247,240,0.9)"
                  stroke={accent}
                  strokeWidth="1"
                />
                <path
                  d="M0 4 Q120 44 240 4"
                  fill="none"
                  stroke={accent}
                  strokeWidth="1"
                  opacity="0.7"
                />
              </svg>
            </motion.div>
            {frame3.caption && (
              <figcaption
                className="mt-2 text-center text-[9px] uppercase tracking-[0.35em]"
                style={{ color: "#26364e", opacity: 0.7 }}
              >
                {frame3.caption}
              </figcaption>
            )}
          </motion.figure>
        )}

        <motion.div
          style={reduce ? undefined : { y: heroTextY, opacity: heroTextOpacity }}
          className="relative z-10 px-6 text-center"
        >
          {/* Top ornament */}
          <div className="mb-6 flex items-center justify-center gap-4 opacity-85">
            <span className="h-px w-10 sm:w-16" style={{ background: accent }} />
            <span
              className="text-lg"
              style={{ color: accent, textShadow: `0 0 12px ${accent}88` }}
            >
              ❃
            </span>
            <span className="h-px w-10 sm:w-16" style={{ background: accent }} />
          </div>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-6 text-[10px] uppercase tracking-[0.6em]"
            style={{ color: "#26364e", opacity: 0.7 }}
          >
            {tagline}
          </motion.p>
          <motion.h1
            initial={reduce ? false : { opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease: EASE }}
            className="font-display text-[clamp(3rem,11vw,8.5rem)] font-light leading-[0.95] tracking-tight"
            style={{
              color: "#26364e",
              textShadow: "0 4px 40px rgba(250,247,240,0.8)",
            }}
          >
            {event.eventTitle}
          </motion.h1>
          {(event.person1Name || event.person2Name) && (
            <motion.p
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="mt-6 font-display text-xl tracking-[0.2em] sm:text-2xl"
              style={{ color: accent }}
            >
              {event.person1Name}
              {event.person2Name ? (
                <span style={{ color: "#26364e", opacity: 0.5 }}> &amp; </span>
              ) : null}
              {event.person2Name}
            </motion.p>
          )}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4 text-[11px] uppercase tracking-[0.4em]"
            style={{ color: "#26364e", opacity: 0.7 }}
          >
            {mainDate && <span>{mainDate}</span>}
            {event.mainStartTime && <span style={{ opacity: 0.4 }}>|</span>}
            {event.mainStartTime && <span>{event.mainStartTime}</span>}
            {event.city && (
              <>
                <span style={{ opacity: 0.4 }}>|</span>
                <span>{event.city}</span>
              </>
            )}
          </motion.div>

          {/* Bottom ornament */}
          <div className="mt-8 flex items-center justify-center gap-4 opacity-75">
            <span className="h-px w-14" style={{ background: accent }} />
            <span
              className="text-sm"
              style={{ color: accent, textShadow: `0 0 10px ${accent}77` }}
            >
              ❋
            </span>
            <span className="h-px w-14" style={{ background: accent }} />
          </div>

          {/* Mobile cloud-outline thumbs */}
          {(frame1 || frame2 || frame3) && (
            <div className="mt-8 flex items-center justify-center gap-3 md:hidden">
              {[frame1, frame2, frame3].filter(Boolean).slice(0, 3).map((f, i) => (
                <motion.figure
                  key={`sky-mob-${i}`}
                  initial={reduce ? false : { opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, delay: 0.4 + i * 0.15 }}
                  className="h-16 w-16 overflow-hidden"
                  style={{
                    borderRadius: "60% 40% 55% 45% / 45% 60% 40% 55%",
                    background: "rgba(250,247,240,0.9)",
                    border: `1px solid ${accent}88`,
                    boxShadow: `0 8px 22px -8px rgba(38,54,78,0.4), 0 0 0 3px rgba(255,255,255,0.55)`,
                    padding: 3,
                  }}
                >
                  <img
                    src={f!.publicUrl}
                    alt={f!.caption ?? ""}
                    loading="lazy"
                    className="h-full w-full object-cover"
                    style={{ borderRadius: "60% 40% 55% 45% / 45% 60% 40% 55%" }}
                  />
                </motion.figure>
              ))}
            </div>
          )}
        </motion.div>
      </section>

      {/* ─── 02. THE INVITATION ─── */}
      {showStory && (
        <section className="relative mx-auto max-w-5xl px-6 py-28 sm:py-36">
          <div className="grid items-center gap-14 sm:grid-cols-2">
            <motion.div
              initial={reduce ? false : { opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, ease: EASE }}
            >
              <p
                className="mb-4 text-[10px] uppercase tracking-[0.5em]"
                style={{ color: accent }}
              >
                An Invitation
              </p>
              <h2
                className="font-display text-3xl leading-[1.15] tracking-tight sm:text-4xl"
                style={{ color: "#26364e" }}
              >
                {invitationMessage}
              </h2>
            </motion.div>
            <motion.div
              initial={reduce ? false : { opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, delay: 0.2, ease: EASE }}
            >
              <p
                className="text-base leading-relaxed sm:text-lg"
                style={{ color: "#26364e", opacity: 0.75 }}
              >
                {aboutStory ||
                  "Our story began on quiet ground, and rose slowly toward the sky. Now we invite you to cross the bridge with us, where cloud meets marble and light writes its own vows."}
              </p>
              <motion.div
                className="mt-8 h-px w-full"
                style={{
                  background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
                }}
                animate={reduce ? undefined : { opacity: [0.3, 0.9, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* ─── 03. SANCTUARIES (SUB-EVENTS) ─── */}
      {showJourney && (
        <section className="relative py-24 sm:py-32">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-3 text-center text-[10px] uppercase tracking-[0.5em]"
            style={{ color: accent }}
          >
            Sanctuaries
          </motion.p>
          <h2
            className="mb-16 text-center font-display text-3xl tracking-tight sm:text-4xl"
            style={{ color: "#26364e" }}
          >
            The Bridge of Days
          </h2>
          <SkyBridge items={subEvents} accent={accent} />
        </section>
      )}

      {/* ─── 04. GALLERY ─── */}
      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-3 text-center text-[10px] uppercase tracking-[0.5em]"
            style={{ color: accent }}
          >
            Reflections
          </motion.p>
          <h2
            className="mb-12 text-center font-display text-3xl tracking-tight sm:text-4xl"
            style={{ color: "#26364e" }}
          >
            Moments in the Clouds
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((m, i) => (
              <motion.div
                key={`${m.fileName}-${i}`}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.06 }}
                className="group relative overflow-hidden rounded-t-[40%] rounded-b-2xl border shadow-[0_20px_50px_-20px_rgba(38,54,78,0.35)]"
                style={{ borderColor: "rgba(230,201,136,0.45)" }}
              >
                <img
                  src={m.publicUrl}
                  alt={m.caption ?? ""}
                  className="aspect-[3/4] w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  loading="lazy"
                />
                <div
                  className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent 50%, rgba(38,54,78,0.55))",
                  }}
                />
                {m.caption && (
                  <p className="absolute bottom-4 left-4 right-4 text-[11px] uppercase tracking-[0.3em] text-[#faf7f0] opacity-0 transition-opacity group-hover:opacity-100">
                    {m.caption}
                  </p>
                )}
              </motion.div>
            ))}
            {editing && galleryItems.length === 0 && (
              <div
                className="col-span-full flex h-48 items-center justify-center rounded-2xl border border-dashed text-sm"
                style={{ borderColor: `${accent}88`, color: "#26364e", opacity: 0.6 }}
              >
                + Add photos
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── 05. VENUE ─── */}
      {showVenue && (
        <section className="relative mx-auto max-w-5xl px-6 py-24 sm:py-32">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-3 text-center text-[10px] uppercase tracking-[0.5em]"
            style={{ color: accent }}
          >
            The Temple
          </motion.p>
          <h2
            className="mb-10 text-center font-display text-3xl tracking-tight sm:text-4xl"
            style={{ color: "#26364e" }}
          >
            {event.venueName || "Where the Clouds Gather"}
          </h2>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: EASE }}
            className="overflow-hidden rounded-t-[10%] rounded-b-3xl border p-2 shadow-[0_30px_80px_-30px_rgba(38,54,78,0.4)] backdrop-blur"
            style={{
              background: "rgba(250,247,240,0.85)",
              borderColor: "rgba(230,201,136,0.55)",
            }}
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

      {/* ─── 06. RSVP / CTA ─── */}
      <section className="relative px-6 py-32 text-center sm:py-44">
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: EASE }}
          className="mx-auto max-w-3xl"
        >
          <motion.div
            aria-hidden
            animate={reduce ? undefined : { scale: [1, 1.08, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="mx-auto mb-10 h-32 w-32 rounded-full sm:h-40 sm:w-40"
            style={{
              background: `radial-gradient(circle, ${accent}, transparent 65%)`,
              filter: "blur(24px)",
            }}
          />
          <p
            className="mb-4 text-[10px] uppercase tracking-[0.5em]"
            style={{ color: accent }}
          >
            Cross the Bridge
          </p>
          <h2
            className="font-display text-[clamp(2.5rem,7vw,5rem)] leading-[1] tracking-tight"
            style={{ color: "#26364e" }}
          >
            {event.eventTitle}
          </h2>
          {mainDate && (
            <p
              className="mt-6 text-xs uppercase tracking-[0.5em]"
              style={{ color: "#26364e", opacity: 0.65 }}
            >
              {mainDate}
            </p>
          )}
          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <motion.div
              whileHover={reduce ? undefined : { scale: 1.04, y: -2 }}
              className="mt-12 inline-block"
            >
              <a
                href={event.rsvpLinkOrContact}
                target="_blank"
                rel="noreferrer"
                className="inline-block rounded-full px-14 py-4 text-xs uppercase tracking-[0.4em] transition-all"
                style={{
                  background: accent,
                  color: "#26364e",
                  boxShadow: `0 10px 40px ${accent}66`,
                }}
              >
                Reply with Grace
              </a>
            </motion.div>
          )}
        </motion.div>
      </section>

      <footer
        className="border-t py-10 text-center text-xs"
        style={{ borderColor: "rgba(38,54,78,0.15)", color: "#26364e", opacity: 0.6 }}
      >
        <p className="tracking-[0.3em] uppercase">
          {event.eventTitle}
          {event.person1Name ? ` · ${event.person1Name}` : ""}
          {event.person2Name ? ` &amp; ${event.person2Name}` : ""}
        </p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default SkytempleTemplate;
