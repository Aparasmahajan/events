"use client";

import { useMemo, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { HeroMedia } from "@/components/ui/HeroMedia";
import { MapEmbed } from "@/components/ui/MapEmbed";
import { MusicToggle } from "@/components/ui/MusicToggle";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { useEditMode } from "@/components/edit/EditContext";
import type { TemplateComponent, SubEvent } from "@/lib/types";

const EASE = [0.16, 1, 0.3, 1] as const;
const PAPER = "#fdf6f0";
const PLUM = "#4a2d3a";
const BRANCH = "#7a5a48";
const LEAF = "#8fb387";

const PETALS = Array.from({ length: 26 }, (_, i) => ({
  x: `${(i * 37 + 11) % 100}%`,
  delay: (i % 13) * 0.9,
  dur: 9 + (i % 5) * 2.5,
  size: 8 + (i % 4) * 3,
  drift: ((i % 7) - 3) * 28,
  spin: 180 + (i % 4) * 120,
}));

const CLUSTERS = [
  { cx: 62, cy: 58, r: 13 }, { cx: 118, cy: 92, r: 16 }, { cx: 168, cy: 60, r: 12 },
  { cx: 205, cy: 118, r: 15 }, { cx: 138, cy: 148, r: 11 }, { cx: 248, cy: 78, r: 13 },
  { cx: 92, cy: 30, r: 10 },
];

function PetalField({ reduce, accent }: { reduce: boolean; accent: string }) {
  if (reduce) return null;
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
      {PETALS.map((p, i) => (
        <motion.svg
          key={i}
          viewBox="0 0 12 12"
          className="absolute"
          style={{ left: p.x, top: "-4%", width: p.size, height: p.size }}
          animate={{ y: ["0vh", "110vh"], x: [0, p.drift, p.drift / 2], rotate: [0, p.spin], opacity: [0, 0.85, 0.7, 0] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "linear" }}
        >
          <ellipse cx="6" cy="6" rx="5" ry="3" fill={accent} opacity="0.75" transform="rotate(35 6 6)" />
        </motion.svg>
      ))}
    </div>
  );
}

function CherryBranch({ reduce, accent }: { reduce: boolean; accent: string }) {
  return (
    <svg aria-hidden viewBox="0 0 300 180" className="pointer-events-none absolute left-0 top-0 z-10 w-[60vw] max-w-[420px] opacity-90">
      <path d="M-10 8 C 60 30, 110 55, 160 70 M60 32 C 85 20, 100 24, 120 18 M120 55 C 150 90, 190 110, 215 122 M160 70 C 200 72, 235 80, 258 76" stroke={BRANCH} strokeWidth="5" strokeLinecap="round" fill="none" />
      {CLUSTERS.map((c, i) => (
        <motion.g
          key={i}
          initial={reduce ? false : { scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: reduce ? 0 : 0.4 + i * 0.22, ease: EASE }}
          style={{ transformOrigin: `${c.cx}px ${c.cy}px` }}
        >
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse
              key={a}
              cx={c.cx + Math.cos((a * Math.PI) / 180) * c.r * 0.55}
              cy={c.cy + Math.sin((a * Math.PI) / 180) * c.r * 0.55}
              rx={c.r * 0.5}
              ry={c.r * 0.38}
              fill={accent}
              opacity="0.85"
              transform={`rotate(${a} ${c.cx} ${c.cy})`}
            />
          ))}
          <circle cx={c.cx} cy={c.cy} r={c.r * 0.22} fill="#fff" opacity="0.9" />
        </motion.g>
      ))}
    </svg>
  );
}

function VerticalLabel({ text }: { text: string }) {
  return (
    <p
      className="mx-auto mb-8 w-fit text-[11px] uppercase tracking-[0.5em]"
      style={{ writingMode: "vertical-rl", color: BRANCH, minHeight: 90 }}
    >
      {text}
    </p>
  );
}

function SteppingStones({ items, accent, reduce }: { items: SubEvent[]; accent: string; reduce: boolean }) {
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <div className="relative mx-auto max-w-3xl px-6">
      <svg aria-hidden className="absolute inset-x-0 top-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 400">
        <path d="M0 60 Q 25 40, 50 55 T 100 50 M0 200 Q 25 180, 50 195 T 100 190 M0 340 Q 25 320, 50 335 T 100 330" stroke={accent} strokeWidth="0.4" fill="none" opacity="0.35" />
        <path d="M50 0 C 90 60, 10 130, 50 200 C 90 270, 10 340, 50 400" stroke={BRANCH} strokeWidth="0.6" strokeDasharray="2 3" fill="none" opacity="0.5" />
      </svg>
      <div className="relative space-y-10">
        {sorted.map((s, i) => (
          <motion.article
            key={s.order}
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
            className={`relative w-full max-w-md rounded-[1.5rem] border p-7 shadow-sm backdrop-blur-sm ${i % 2 === 0 ? "mr-auto" : "ml-auto"}`}
            style={{ background: "rgba(255,255,255,0.75)", borderColor: `${accent}55` }}
          >
            <span
              className="absolute -top-3 left-7 flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white shadow"
              style={{ background: accent }}
            >
              {s.order}
            </span>
            <p className="text-[10px] uppercase tracking-[0.3em]" style={{ color: BRANCH }}>
              {[s.date, s.startTime].filter(Boolean).join(" · ")}
            </p>
            <h3 className="mt-2 font-serif text-2xl tracking-wide" style={{ color: PLUM }}>{s.name}</h3>
            {s.venueName && <p className="mt-1 text-sm opacity-70">{s.venueName}</p>}
            {s.description && <p className="mt-2 text-sm leading-relaxed opacity-70">{s.description}</p>}
            {s.dressCode && (
              <p className="mt-3 inline-block rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em]" style={{ background: `${accent}22`, color: PLUM }}>
                {s.dressCode}
              </p>
            )}
          </motion.article>
        ))}
      </div>
    </div>
  );
}

export const SakuraTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || "#f4b8c8";
  const tagline = event.tagline?.trim() || "Beneath a thousand blossoms";
  const invitationMessage = event.invitationMessage?.trim() || "As petals drift on the spring wind, two paths become one. We would be honored to have you walk this garden with us.";
  const aboutStory = event.aboutStory?.trim() || "Every spring the blossoms return, and every year they remind us: the most beautiful things are worth waiting for. Our story bloomed the same way — slowly, then all at once.";
  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const [frame1, frame2, frame3] = event.showHeroFrames ? galleryItems : [];
  const hero = event.heroImageUrl || "https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&w=1600&q=80";

  // Deterministic falling petals across the hero (separate from the sitewide PetalField)
  const HERO_PETALS = Array.from({ length: 28 }, (_, i) => ({
    left: `${(i * 41 + 7) % 100}%`,
    delay: (i % 11) * 0.7,
    dur: 10 + (i % 6) * 1.9,
    size: 7 + (i % 4) * 3,
    drift: ((i % 9) - 4) * 22,
    spin: 200 + (i % 5) * 90,
    rot: (i * 47) % 360,
  }));

  const rootRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const seasonBg = useTransform(scrollYProgress, [0, 0.7, 1], [PAPER, PAPER, "#f2f6ec"]);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroP, [0, 1], [0, 80]);
  const heroOpacity = useTransform(heroP, [0, 0.6], [1, 0]);

  const showStory = !event.hideStory;
  const showJourney = !event.hideEvents && subEvents.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  return (
    <motion.div
      ref={rootRef}
      className="relative min-h-screen overflow-x-clip font-serif antialiased"
      style={{ "--accent": accent, color: PLUM, background: reduce ? PAPER : seasonBg } as React.CSSProperties}
    >
      <ScrollProgress color={accent} />
      <PetalField reduce={reduce} accent={accent} />

      <section ref={heroRef} className="relative flex min-h-[100svh] items-center justify-center overflow-hidden pb-24 sm:pb-28">
        <div className="absolute inset-0">
          <HeroMedia imageSrc={hero} videoSrc={event.heroVideoUrl || undefined} alt={event.eventTitle} className="opacity-55" />
          {/* Warm-paper vignette — blush + cream, never dark */}
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${PAPER}66 0%, ${accent}18 30%, ${PAPER}dd 70%, ${PAPER} 100%)` }} />
          <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 45%, transparent 30%, ${PAPER}55 85%)` }} />
        </div>
        <CherryBranch reduce={reduce} accent={accent} />

        {/* Hero-only falling petals (deterministic, drift + spin) */}
        {!reduce && (
          <div aria-hidden className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
            {HERO_PETALS.map((p, i) => (
              <motion.svg
                key={`hp-${i}`}
                viewBox="0 0 12 12"
                className="absolute"
                style={{ left: p.left, top: "-6%", width: p.size, height: p.size }}
                animate={{ y: ["0svh", "110svh"], x: [0, p.drift, p.drift * 0.4], rotate: [p.rot, p.rot + p.spin], opacity: [0, 0.9, 0.75, 0] }}
                transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "linear" }}
              >
                <ellipse cx="6" cy="6" rx="5" ry="3" fill={accent} opacity="0.85" transform="rotate(35 6 6)" />
              </motion.svg>
            ))}
          </div>
        )}

        {/* Vertical SAKURA label along the left margin */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-4 top-1/4 z-10 hidden select-none sm:block"
          style={{ writingMode: "vertical-rl", color: accent, opacity: 0.35, letterSpacing: "0.6em", fontSize: 12 }}
        >
          桜 · SAKURA · 桜
        </div>

        {/* ─── Frame 1 (top-left): photo hanging from a cherry branch */}
        {frame1 && (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.35, ease: EASE }}
            className="hidden md:block absolute left-[5%] top-[9%] z-20 w-40 lg:w-52"
          >
            {/* Cherry branch above the photo */}
            <svg aria-hidden viewBox="0 0 200 40" className="w-full">
              <line x1="6" y1="20" x2="194" y2="20" stroke={BRANCH} strokeWidth="2" strokeLinecap="round" />
              {[38, 82, 128, 168].map((cx, k) => (
                <g key={k}>
                  {[0, 72, 144, 216, 288].map((a) => (
                    <ellipse
                      key={a}
                      cx={cx + Math.cos((a * Math.PI) / 180) * 4}
                      cy={20 + Math.sin((a * Math.PI) / 180) * 4 - 4}
                      rx="2.8"
                      ry="2"
                      fill={accent}
                      opacity="0.9"
                      transform={`rotate(${a} ${cx} ${20 - 4})`}
                    />
                  ))}
                  <circle cx={cx} cy={16} r="1" fill="#fff" opacity="0.95" />
                </g>
              ))}
              {/* Two hairline strings descending to top corners of photo */}
              <line x1="18" y1="20" x2="12" y2="38" stroke={BRANCH} strokeWidth="0.6" opacity="0.75" />
              <line x1="182" y1="20" x2="188" y2="38" stroke={BRANCH} strokeWidth="0.6" opacity="0.75" />
            </svg>
            <motion.figure
              animate={reduce ? undefined : { rotate: [0, 1, 0, -0.6, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="relative -mt-1 overflow-hidden rounded-md shadow-xl"
              style={{
                border: `3px solid ${accent}`,
                background: "#fff",
                padding: 4,
                boxShadow: `0 18px 40px -14px rgba(74,45,58,0.35), 0 0 32px -12px ${accent}77`,
                transformOrigin: "50% 0%",
              }}
            >
              <img
                src={frame1.publicUrl}
                alt={frame1.caption ?? ""}
                loading="lazy"
                className="block h-40 w-full object-cover lg:h-52"
              />
              <figcaption className="mt-1 text-center text-[10px] uppercase tracking-[0.3em]" style={{ color: BRANCH }}>
                {frame1.caption ?? "First bloom"}
              </figcaption>
            </motion.figure>
          </motion.div>
        )}

        {/* ─── Frame 2 (top-right): paper-lantern medallion */}
        {frame2 && (
          <motion.figure
            initial={reduce ? false : { opacity: 0, y: 16, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.55, ease: EASE }}
            className="hidden md:block absolute right-[6%] top-[16%] z-20 w-40 lg:w-52"
          >
            <motion.div
              animate={reduce ? undefined : { y: [0, -5, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              {/* Lantern silhouette — rounded rectangle behind the circle */}
              <div
                aria-hidden
                className="absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 rounded-[45%]"
                style={{
                  width: "108%",
                  height: "118%",
                  background: `radial-gradient(ellipse at 50% 50%, ${accent}55 0%, ${accent}22 55%, transparent 80%)`,
                  border: `1.5px solid ${accent}aa`,
                  boxShadow: `0 0 40px 4px ${accent}55`,
                }}
              />
              {/* Paper ribbing hairlines */}
              <svg aria-hidden viewBox="0 0 100 120" className="absolute inset-0 -z-10 h-full w-full">
                {[22, 34, 46, 58, 70, 82, 94].map((y) => (
                  <line key={y} x1="6" y1={y} x2="94" y2={y} stroke={accent} strokeWidth="0.35" opacity="0.55" />
                ))}
                {/* Lantern top & tassel */}
                <rect x="42" y="4" width="16" height="6" rx="1" fill={PLUM} opacity="0.55" />
                <line x1="50" y1="112" x2="50" y2="120" stroke={PLUM} strokeWidth="0.8" opacity="0.6" />
              </svg>
              <div
                className="mx-auto aspect-square overflow-hidden rounded-full"
                style={{
                  width: "88%",
                  border: `2px solid ${accent}`,
                  boxShadow: `0 0 0 4px ${PAPER}, 0 14px 30px -12px rgba(74,45,58,0.4)`,
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
            <figcaption className="mt-3 text-center text-[10px] uppercase tracking-[0.3em]" style={{ color: BRANCH }}>
              {frame2.caption ?? "Lantern light"}
            </figcaption>
          </motion.figure>
        )}

        {/* ─── Frame 3 (bottom-left): bamboo scroll rectangle */}
        {frame3 && (
          <motion.figure
            initial={reduce ? false : { opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.1, delay: 0.8, ease: EASE }}
            className="hidden lg:flex absolute left-[8%] bottom-[10%] z-20 w-64 items-center gap-1"
          >
            {/* Left bamboo end */}
            <svg aria-hidden viewBox="0 0 12 90" className="h-24 w-3 shrink-0">
              <rect x="1" y="4" width="10" height="82" rx="5" fill={BRANCH} />
              <ellipse cx="6" cy="6" rx="5" ry="2" fill={BRANCH} />
              <ellipse cx="6" cy="84" rx="5" ry="2" fill={BRANCH} />
              <line x1="6" y1="10" x2="6" y2="82" stroke="#000" strokeWidth="0.4" opacity="0.25" />
            </svg>
            <div
              className="relative flex-1 overflow-hidden shadow-lg"
              style={{
                background: "#fff",
                border: `1px solid ${accent}66`,
                boxShadow: `0 12px 30px -14px rgba(74,45,58,0.4)`,
              }}
            >
              <img
                src={frame3.publicUrl}
                alt={frame3.caption ?? ""}
                loading="lazy"
                className="block h-24 w-full object-cover"
              />
              <div
                className="absolute left-2 top-2 rounded-sm px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.2em]"
                style={{ background: `${PAPER}dd`, color: PLUM, border: `0.5px solid ${accent}66` }}
              >
                巻一 · Chapter One
              </div>
            </div>
            {/* Right bamboo end */}
            <svg aria-hidden viewBox="0 0 12 90" className="h-24 w-3 shrink-0">
              <rect x="1" y="4" width="10" height="82" rx="5" fill={BRANCH} />
              <ellipse cx="6" cy="6" rx="5" ry="2" fill={BRANCH} />
              <ellipse cx="6" cy="84" rx="5" ry="2" fill={BRANCH} />
              <line x1="6" y1="10" x2="6" y2="82" stroke="#000" strokeWidth="0.4" opacity="0.25" />
            </svg>
          </motion.figure>
        )}

        <motion.div style={reduce ? undefined : { y: heroY, opacity: heroOpacity }} className="relative z-20 px-6 text-center">
          {/* Top blossom ornament */}
          <div className="mb-5 flex items-center justify-center gap-3 opacity-90">
            <span className="h-px w-10 sm:w-16" style={{ background: accent }} />
            <span className="text-lg" style={{ color: accent }}>❀</span>
            <span className="h-px w-10 sm:w-16" style={{ background: accent }} />
          </div>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
            className="mb-6 text-xs uppercase tracking-[0.6em]"
            style={{ color: BRANCH }}
          >
            {tagline}
          </motion.p>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.5, ease: EASE }}
            className="text-[clamp(2.6rem,9vw,6.5rem)] leading-[1.05] tracking-[0.08em]"
            style={{ color: PLUM }}
          >
            {event.eventTitle}
          </motion.h1>
          <motion.div initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.9 }}>
            {(event.person1Name || event.person2Name) && (
              <p className="mt-5 text-lg tracking-[0.3em]">{[event.person1Name, event.person2Name].filter(Boolean).join("  ・  ")}</p>
            )}
            {event.mainDate && (
              <p className="mt-8 text-sm uppercase tracking-[0.4em]" style={{ color: BRANCH }}>
                {new Date(event.mainDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                {event.city ? ` · ${event.city}` : ""}
              </p>
            )}
          </motion.div>
          {/* Bottom blossom ornament */}
          <div className="mt-8 flex items-center justify-center gap-3 opacity-80">
            <span className="h-px w-12" style={{ background: accent }} />
            <span className="text-sm" style={{ color: accent }}>✿</span>
            <span className="h-px w-12" style={{ background: accent }} />
          </div>

          {/* Mobile: 3 branch-hanging thumbs */}
          {(frame1 || frame2 || frame3) && (
            <div className="md:hidden mt-10 flex items-start justify-center gap-4">
              {[frame1, frame2, frame3].filter(Boolean).slice(0, 3).map((f, i) => (
                <motion.div
                  key={`mob-${i}`}
                  initial={reduce ? false : { opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + i * 0.14, ease: EASE }}
                  className="w-16"
                >
                  {/* Tiny branch bit above each thumb */}
                  <svg aria-hidden viewBox="0 0 60 18" className="w-full">
                    <line x1="2" y1="10" x2="58" y2="10" stroke={BRANCH} strokeWidth="1.4" strokeLinecap="round" />
                    <circle cx="18" cy="8" r="2" fill={accent} />
                    <circle cx="42" cy="8" r="2" fill={accent} />
                    <line x1="10" y1="10" x2="8" y2="17" stroke={BRANCH} strokeWidth="0.4" />
                    <line x1="50" y1="10" x2="52" y2="17" stroke={BRANCH} strokeWidth="0.4" />
                  </svg>
                  <div
                    className="-mt-1 aspect-square w-full overflow-hidden rounded-sm shadow-md"
                    style={{ border: `2px solid ${accent}`, background: "#fff", padding: 2 }}
                  >
                    <img src={f!.publicUrl} alt={f!.caption ?? ""} loading="lazy" className="h-full w-full object-cover" />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </section>

      {showStory && (
        <section className="relative mx-auto max-w-3xl px-6 py-24 text-center sm:py-32">
          <VerticalLabel text="Our story" />
          <motion.h2
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE }}
            className="text-2xl leading-relaxed tracking-wide sm:text-3xl"
          >
            {invitationMessage}
          </motion.h2>
          <motion.div initial={reduce ? false : { scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.3, ease: EASE }} className="mx-auto my-8 h-px w-24" style={{ background: accent }} />
          <motion.p initial={reduce ? false : { opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.4 }} className="text-base leading-loose opacity-75 sm:text-lg">
            {aboutStory}
          </motion.p>
        </section>
      )}

      {showJourney && (
        <section className="relative py-20 sm:py-28">
          <VerticalLabel text="Stepping stones" />
          <SteppingStones items={subEvents} accent={accent} reduce={reduce} />
        </section>
      )}

      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <VerticalLabel text="Lantern memories" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((m, i) => (
              <motion.figure
                key={`${m.fileName}-${i}`}
                initial={reduce ? false : { opacity: 0, y: 30, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-8% 0px" }}
                transition={{ duration: 0.7, delay: (i % 3) * 0.12, ease: EASE }}
                className="group relative overflow-hidden rounded-t-[3rem] rounded-b-xl border shadow-sm"
                style={{ borderColor: `${accent}66`, background: "rgba(255,255,255,0.7)" }}
              >
                <div aria-hidden className="mx-auto mt-3 h-2 w-10 rounded-full" style={{ background: BRANCH, opacity: 0.5 }} />
                <img
                  src={m.publicUrl}
                  alt={m.caption ?? ""}
                  className="mt-3 aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                {m.caption && (
                  <figcaption className="px-4 py-3 text-center text-xs tracking-[0.2em] opacity-70">{m.caption}</figcaption>
                )}
              </motion.figure>
            ))}
            {editing && galleryItems.length === 0 && (
              <div className="col-span-full flex h-48 items-center justify-center rounded-2xl border border-dashed text-sm opacity-60" style={{ borderColor: BRANCH }}>
                + Add photos
              </div>
            )}
          </div>
        </section>
      )}

      {showVenue && (
        <section className="relative mx-auto max-w-4xl px-6 py-20 sm:py-28">
          <VerticalLabel text="The garden" />
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="overflow-hidden rounded-3xl border p-1 shadow-sm"
            style={{ borderColor: `${accent}66`, background: "rgba(255,255,255,0.7)" }}
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

      <section className="relative px-6 py-24 text-center sm:py-36">
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE }}
          className="mx-auto max-w-2xl"
        >
          <p className="text-xs uppercase tracking-[0.5em]" style={{ color: LEAF }}>Spring turns to summer</p>
          <h2 className="mt-4 text-3xl leading-snug tracking-wide sm:text-4xl">{event.eventTitle}</h2>
          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <motion.a
              whileHover={reduce ? undefined : { scale: 1.04, y: -2 }}
              href={event.rsvpLinkOrContact}
              target="_blank"
              rel="noreferrer"
              className="mt-10 inline-block rounded-full px-12 py-4 text-sm uppercase tracking-[0.3em] text-white shadow-md"
              style={{ background: `linear-gradient(120deg, ${accent}, ${LEAF})` }}
            >
              Join us in bloom
            </motion.a>
          )}
        </motion.div>
      </section>

      <footer className="border-t py-8 text-center text-xs opacity-60" style={{ borderColor: `${LEAF}44` }}>
        <p>{event.eventTitle}{event.person1Name && event.person2Name ? ` · ${event.person1Name} & ${event.person2Name}` : ""}</p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </motion.div>
  );
};

export default SakuraTemplate;
