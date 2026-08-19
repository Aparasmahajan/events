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

const RAYS = [
  { x: "8%", width: "6vw", delay: 0 },
  { x: "22%", width: "4vw", delay: 0.8 },
  { x: "38%", width: "7vw", delay: 1.6 },
  { x: "55%", width: "5vw", delay: 0.4 },
  { x: "72%", width: "6vw", delay: 2.1 },
  { x: "88%", width: "4vw", delay: 1.2 },
];

const PEARLS = Array.from({ length: 18 }, (_, i) => ({
  x: `${(i * 37 + 5) % 100}%`,
  size: 4 + (i % 4) * 2,
  delay: (i % 6) * 1.4,
  dur: 9 + (i % 5) * 2,
  drift: ((i % 3) - 1) * 20,
}));

const JELLIES = [
  { x: "12%", y: "22%", size: 420, hue: "#4fb0c6", delay: 0 },
  { x: "78%", y: "58%", size: 520, hue: "#ff9a8a", delay: 2 },
  { x: "40%", y: "82%", size: 380, hue: "#4fb0c6", delay: 4 },
];

function OceanField({ reduce }: { reduce: boolean }) {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #052a3a 0%, #073d50 50%, #0a4d5e 100%)" }} />
      {!reduce && (
        <>
          {JELLIES.map((j, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                left: j.x,
                top: j.y,
                width: j.size,
                height: j.size,
                background: `radial-gradient(circle, ${j.hue}55 0%, ${j.hue}22 30%, transparent 65%)`,
                filter: "blur(30px)",
                transform: "translate(-50%, -50%)",
              }}
              animate={{ scale: [1, 1.15, 0.95, 1], x: [0, 30, -20, 0], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 14 + i * 2, delay: j.delay, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
          <div className="absolute inset-0">
            {PEARLS.map((p, i) => (
              <motion.span
                key={i}
                className="absolute rounded-full"
                style={{
                  left: p.x,
                  bottom: "-4%",
                  width: p.size,
                  height: p.size,
                  background: "radial-gradient(circle at 30% 30%, #ffffff, #f5f4ec 40%, #b7dce6 100%)",
                  boxShadow: "0 0 12px rgba(230,250,255,0.6), inset -1px -1px 3px rgba(10,77,94,0.3)",
                }}
                animate={{ y: ["0vh", "-110vh"], x: [0, p.drift, -p.drift, 0], opacity: [0, 0.9, 0.9, 0] }}
                transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
              />
            ))}
          </div>
        </>
      )}
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at top, rgba(230,250,255,0.08), transparent 55%)" }} />
    </div>
  );
}

function SunRays({ reduce }: { reduce: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[100%] overflow-hidden">
      {RAYS.map((r, i) => (
        <motion.div
          key={i}
          className="absolute top-[-10%] h-[120%] origin-top"
          style={{
            left: r.x,
            width: r.width,
            background: "linear-gradient(180deg, rgba(230,250,255,0.35), rgba(79,176,198,0.15) 40%, transparent 85%)",
            transform: "rotate(15deg)",
            filter: "blur(6px)",
          }}
          animate={reduce ? undefined : { opacity: [0.15, 0.5, 0.2, 0.4, 0.15] }}
          transition={{ duration: 7 + i, delay: r.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function PearlDivider({ accent }: { accent: string }) {
  return (
    <div aria-hidden className="mx-auto my-2 flex items-center justify-center gap-2 opacity-70">
      <span className="h-px w-16" style={{ background: `linear-gradient(90deg, transparent, ${accent})` }} />
      <span className="h-2 w-2 rounded-full" style={{ background: "radial-gradient(circle at 30% 30%, #ffffff, #f5f4ec 40%, #b7dce6)" }} />
      <span className="h-px w-16" style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }} />
    </div>
  );
}

function OceanTimeline({ items, accent }: { items: SubEvent[]; accent: string }) {
  const reduce = useReducedMotion();
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <div className="mx-auto max-w-4xl px-6">
      <div className="relative">
        <div
          aria-hidden
          className="absolute left-4 top-2 bottom-2 w-px sm:left-1/2"
          style={{ background: `linear-gradient(180deg, transparent, ${accent}66, transparent)` }}
        />
        <div className="space-y-8">
          {sorted.map((s, i) => (
            <motion.article
              key={s.order}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
              className={`relative pl-12 sm:w-1/2 sm:pl-0 ${i % 2 === 0 ? "sm:pr-10" : "sm:ml-auto sm:pl-10"}`}
            >
              <span
                aria-hidden
                className="absolute left-2 top-3 h-5 w-5 rounded-full sm:left-auto sm:right-[-10px]"
                style={{
                  background: "radial-gradient(circle at 30% 30%, #ffffff, #f5f4ec 45%, #b7dce6)",
                  boxShadow: `0 0 18px ${accent}88`,
                  ...(i % 2 === 1 ? { left: "-10px", right: "auto" } : {}),
                }}
              />
              <div
                className="rounded-2xl border p-6 backdrop-blur-md"
                style={{
                  background: "linear-gradient(140deg, rgba(230,250,255,0.08), rgba(10,77,94,0.25))",
                  borderColor: "rgba(230,250,255,0.12)",
                }}
              >
                <p className="text-[10px] uppercase tracking-[0.35em]" style={{ color: accent }}>
                  {[s.date, s.startTime].filter(Boolean).join(" · ")}
                </p>
                <h3 className="mt-2 font-display text-2xl tracking-tight" style={{ color: "#f5f4ec" }}>{s.name}</h3>
                {s.venueName && <p className="mt-1 text-sm opacity-70">{s.venueName}</p>}
                {s.description && <p className="mt-3 text-sm leading-relaxed opacity-70">{s.description}</p>}
                {s.dressCode && (
                  <p
                    className="mt-4 inline-block rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.25em]"
                    style={{ borderColor: `${accent}66`, color: accent }}
                  >
                    {s.dressCode}
                  </p>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}

export const OceanpalaceTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || "#4fb0c6";
  const pearl = "#f5f4ec";
  const aqua = "#e6faff";
  const coral = "#ff9a8a";

  const tagline = event.tagline?.trim() || "Beneath the tides, a promise.";
  const invitationMessage = event.invitationMessage?.trim() || "Descend into a palace of coral and light, where two souls are pledged in the quiet of the deep.";
  const aboutStory = event.aboutStory?.trim() || "";
  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const [frame1, frame2, frame3] = event.showHeroFrames ? galleryItems : [];
  const hero = event.heroImageUrl || "https://images.unsplash.com/photo-1518877593221-1f28583780b4?auto=format&fit=crop&w=1600&q=80";

  // Deterministic drifting pearls across the hero (bubbles rising).
  const heroPearls = Array.from({ length: 10 }, (_, i) => ({
    left: `${(i * 41 + 7) % 100}%`,
    top: `${(i * 53 + 12) % 90}%`,
    size: 6 + (i % 4) * 3,
    delay: (i % 5) * 0.9,
    dur: 8 + (i % 4) * 2,
  }));

  // Diagonal sun-ray beams — light through water.
  const heroRays = [
    { left: "10%", width: "5vw", delay: 0 },
    { left: "34%", width: "7vw", delay: 1.1 },
    { left: "62%", width: "4vw", delay: 0.6 },
    { left: "82%", width: "6vw", delay: 1.8 },
  ];

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(heroP, [0, 1], [1, 1.08]);
  const heroY = useTransform(heroP, [0, 1], [0, 80]);
  const heroOpacity = useTransform(heroP, [0, 0.7], [1, 0]);

  const showStory = !event.hideStory;
  const showJourney = !event.hideEvents && subEvents.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-sans antialiased"
      style={{ "--accent": accent, color: aqua } as React.CSSProperties}
    >
      <OceanField reduce={reduce} />
      <ScrollProgress color={accent} />

      {/* ─── HERO ─── */}
      <section ref={heroRef} className="relative flex min-h-[100svh] items-center justify-center overflow-hidden pb-24 sm:pb-28">
        <motion.div style={reduce ? undefined : { scale: heroScale, y: heroY }} className="absolute inset-0">
          <HeroMedia imageSrc={hero} videoSrc={event.heroVideoUrl || undefined} alt={event.eventTitle} className="opacity-40" />
          {/* Deep aquamarine vignette */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(5,42,58,0.45) 0%, rgba(5,42,58,0.55) 50%, #052a3a 100%), radial-gradient(ellipse at 50% 40%, transparent 30%, rgba(5,20,32,0.55) 100%)",
            }}
          />
        </motion.div>

        {/* Diagonal sun-ray beams — light through water */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          {heroRays.map((r, i) => (
            <motion.div
              key={`ray-${i}`}
              className="absolute top-[-15%] h-[130%] origin-top"
              style={{
                left: r.left,
                width: r.width,
                background: "linear-gradient(180deg, rgba(230,250,255,0.25), rgba(79,176,198,0.10) 45%, transparent 90%)",
                transform: "rotate(15deg)",
                filter: "blur(8px)",
                opacity: 0.35,
              }}
              animate={reduce ? undefined : { opacity: [0.15, 0.4, 0.15] }}
              transition={{ duration: 8 + i, delay: r.delay, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>

        {/* Rising pearls — deterministic positions */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          {heroPearls.map((p, i) => (
            <motion.span
              key={`pearl-${i}`}
              className="absolute rounded-full"
              style={{
                left: p.left,
                top: p.top,
                width: p.size,
                height: p.size,
                background: "radial-gradient(circle at 30% 30%, #ffffff, #f5f4ec 45%, #b7dce6 100%)",
                boxShadow: "0 0 8px rgba(230,250,255,0.7), inset -1px -1px 2px rgba(10,77,94,0.35)",
              }}
              animate={reduce ? undefined : { y: [0, -30, 0], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>

        {/* ─── Underwater bubble & shell collage ───
         *  frame1: luminous bubble (top-left)
         *  frame2: larger bubble (top-right)
         *  frame3: seashell-scalloped rectangle (bottom-left) */}
        {frame1 && (
          <motion.figure
            initial={reduce ? false : { opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="hidden md:block absolute left-[6%] top-[14%] w-40 h-40 lg:w-52 lg:h-52 rounded-full overflow-hidden"
            style={{
              boxShadow: `0 0 0 1px rgba(230,250,255,0.5), 0 0 40px ${accent}66, 0 20px 40px -12px rgba(0,0,0,0.5)`,
            }}
          >
            <motion.img
              src={frame1.publicUrl}
              alt={frame1.caption ?? ""}
              loading="lazy"
              className="w-full h-full object-cover"
              animate={reduce ? undefined : { y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* translucent white sheen — light catching the bubble */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 25% 22%, rgba(255,255,255,0.55), rgba(255,255,255,0.18) 22%, transparent 45%)",
              }}
            />
            {/* aquamarine outer glow ring */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-full"
              style={{ boxShadow: `inset 0 0 30px ${accent}55` }}
            />
          </motion.figure>
        )}

        {frame2 && (
          <motion.figure
            initial={reduce ? false : { opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="hidden md:block absolute right-[6%] top-[24%] w-48 h-48 lg:w-64 lg:h-64 rounded-full overflow-hidden"
            style={{
              boxShadow: `0 0 0 1px rgba(230,250,255,0.5), 0 0 50px ${accent}77, 0 24px 50px -14px rgba(0,0,0,0.55)`,
            }}
          >
            <motion.img
              src={frame2.publicUrl}
              alt={frame2.caption ?? ""}
              loading="lazy"
              className="w-full h-full object-cover"
              animate={reduce ? undefined : { y: [0, 10, 0] }}
              transition={{ duration: 7, delay: 1, repeat: Infinity, ease: "easeInOut" }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 28% 20%, rgba(255,255,255,0.55), rgba(255,255,255,0.18) 24%, transparent 48%)",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-full"
              style={{ boxShadow: `inset 0 0 34px ${accent}55` }}
            />
          </motion.figure>
        )}

        {frame3 && (
          <motion.figure
            initial={reduce ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block absolute left-[9%] bottom-[18%] w-44 h-56"
            style={{ filter: `drop-shadow(0 20px 40px rgba(0,0,0,0.55)) drop-shadow(0 0 24px ${accent}44)` }}
          >
            {/* SVG shell-scalloped card */}
            <svg viewBox="0 0 176 224" className="absolute inset-0 w-full h-full" preserveAspectRatio="none" aria-hidden>
              <defs>
                <clipPath id="oceanShellClip">
                  <path d="M0,32 Q14.6,0 29.3,32 Q44,0 58.6,32 Q73.3,0 88,32 Q102.6,0 117.3,32 Q132,0 146.6,32 Q161.3,0 176,32 L176,224 L0,224 Z" />
                </clipPath>
              </defs>
              <path
                d="M0,32 Q14.6,0 29.3,32 Q44,0 58.6,32 Q73.3,0 88,32 Q102.6,0 117.3,32 Q132,0 146.6,32 Q161.3,0 176,32 L176,224 L0,224 Z"
                fill={pearl}
              />
              <path
                d="M0,32 Q14.6,0 29.3,32 Q44,0 58.6,32 Q73.3,0 88,32 Q102.6,0 117.3,32 Q132,0 146.6,32 Q161.3,0 176,32 L176,224 L0,224 Z"
                fill="none"
                stroke={coral}
                strokeWidth="1"
                opacity="0.7"
              />
            </svg>
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: "url(#oceanShellClip)", WebkitClipPath: "url(#oceanShellClip)" }}
            >
              <img
                src={frame3.publicUrl}
                alt={frame3.caption ?? ""}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
                style={{ paddingTop: 24, paddingLeft: 8, paddingRight: 8, paddingBottom: 24 }}
              />
            </div>
            <figcaption
              className="absolute bottom-2 inset-x-0 text-center text-[10px] uppercase tracking-[0.3em]"
              style={{ color: coral }}
            >
              {frame3.caption ?? "Pearl I"}
            </figcaption>
          </motion.figure>
        )}

        <motion.div style={reduce ? undefined : { opacity: heroOpacity }} className="relative z-10 px-6 text-center max-w-3xl">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="mb-4 text-2xl"
            style={{ color: accent }}
            aria-hidden
          >
            ❍
          </motion.p>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="mb-6 text-[10px] uppercase tracking-[0.7em]"
            style={{ color: pearl }}
          >
            {tagline}
          </motion.p>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 20, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.4, duration: 1.6, ease: EASE }}
            className="font-display text-[clamp(2.75rem,10vw,7.5rem)] font-light leading-[0.95] tracking-[-0.02em]"
            style={{ color: pearl, textShadow: `0 0 40px ${accent}55, 0 2px 20px rgba(0,0,0,0.35)` }}
          >
            {event.eventTitle}
          </motion.h1>
          <PearlDivider accent={accent} />
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 1 }}
            className="mt-2 text-lg"
            style={{ color: accent }}
            aria-hidden
          >
            ~
          </motion.p>
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs uppercase tracking-[0.4em] opacity-80"
          >
            {event.mainDate && (
              <span>
                {new Date(event.mainDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              </span>
            )}
            {event.city && <><span className="opacity-50">•</span><span>{event.city}</span></>}
          </motion.div>

          {/* Mobile-only bubble-thumb row */}
          {(frame1 || frame2 || frame3) && (
            <div className="md:hidden mt-8 flex items-center justify-center gap-3">
              {[frame1, frame2, frame3].filter(Boolean).slice(0, 3).map((f, i) => (
                <motion.figure
                  key={`mob-bubble-${i}`}
                  initial={reduce ? false : { opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 + i * 0.15 }}
                  className="relative w-16 h-16 rounded-full overflow-hidden"
                  style={{
                    boxShadow: `0 0 0 1px rgba(230,250,255,0.5), 0 0 20px ${accent}66, 0 8px 20px -6px rgba(0,0,0,0.6)`,
                  }}
                >
                  <img src={f!.publicUrl} alt={f!.caption ?? ""} className="w-full h-full object-cover" loading="lazy" />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-full"
                    style={{
                      background:
                        "radial-gradient(circle at 26% 22%, rgba(255,255,255,0.55), rgba(255,255,255,0.15) 26%, transparent 50%)",
                    }}
                  />
                </motion.figure>
              ))}
            </div>
          )}
        </motion.div>

        {!reduce && (
          <motion.div
            animate={{ y: [0, 10, 0], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.5em]"
            style={{ color: aqua }}
          >
            Descend
          </motion.div>
        )}
      </section>

      {/* ─── STORY ─── */}
      {showStory && (
        <section className="relative mx-auto max-w-4xl px-6 py-28 text-center sm:py-40">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-6 text-[10px] uppercase tracking-[0.6em]"
            style={{ color: accent }}
          >
            The Invitation
          </motion.p>
          <motion.h2
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: EASE }}
            className="font-display text-[clamp(1.6rem,3.5vw,2.6rem)] font-light leading-[1.35] tracking-tight"
            style={{ color: pearl }}
          >
            {invitationMessage}
          </motion.h2>
          {aboutStory && (
            <>
              <PearlDivider accent={accent} />
              <motion.p
                initial={reduce ? false : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 1 }}
                className="mx-auto mt-4 max-w-2xl text-base leading-relaxed opacity-75 sm:text-lg"
              >
                {aboutStory}
              </motion.p>
            </>
          )}
          {(event.person1Name || event.person2Name) && (
            <motion.p
              initial={reduce ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 1 }}
              className="mt-10 font-display text-2xl tracking-[0.15em] sm:text-3xl"
              style={{ color: coral }}
            >
              {[event.person1Name, event.person2Name].filter(Boolean).join(" ✧ ")}
            </motion.p>
          )}
        </section>
      )}

      {/* ─── SUB-EVENTS ─── */}
      {showJourney && (
        <section className="relative py-24 sm:py-32">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-4 text-center text-[10px] uppercase tracking-[0.6em]"
            style={{ color: accent }}
          >
            The Currents
          </motion.p>
          <motion.h2
            initial={reduce ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14 text-center font-display text-3xl font-light tracking-tight sm:text-4xl"
            style={{ color: pearl }}
          >
            A journey through the deep
          </motion.h2>
          <OceanTimeline items={subEvents} accent={accent} />
        </section>
      )}

      {/* ─── GALLERY ─── */}
      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-4 text-center text-[10px] uppercase tracking-[0.6em]"
            style={{ color: accent }}
          >
            Moments in the Deep
          </motion.p>
          <motion.h2
            initial={reduce ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14 text-center font-display text-3xl font-light tracking-tight sm:text-4xl"
            style={{ color: pearl }}
          >
            Captured in bubbles
          </motion.h2>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 sm:gap-10 lg:grid-cols-4">
            {galleryItems.map((m, i) => (
              <motion.div
                key={`${m.fileName}-${i}`}
                initial={reduce ? false : { opacity: 0, scale: 0.85, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-8% 0px" }}
                transition={{ duration: 0.8, delay: i * 0.06, ease: EASE }}
                whileHover={reduce ? undefined : { y: -6, scale: 1.03 }}
                className="group relative aspect-square overflow-hidden rounded-full"
                style={{
                  boxShadow: `0 0 0 1px rgba(230,250,255,0.35), 0 0 30px ${accent}55, inset 0 0 30px rgba(230,250,255,0.15)`,
                  background: "radial-gradient(circle at 30% 30%, rgba(230,250,255,0.15), transparent 60%)",
                }}
              >
                <img
                  src={m.publicUrl}
                  alt={m.caption ?? ""}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-full"
                  style={{ background: "radial-gradient(circle at 28% 24%, rgba(255,255,255,0.35), transparent 30%)" }}
                />
                <div className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: `radial-gradient(circle, transparent 55%, ${accent}44 100%)` }} />
              </motion.div>
            ))}
            {editing && galleryItems.length === 0 && (
              <div className="col-span-full flex h-48 items-center justify-center rounded-3xl border border-dashed text-sm opacity-60" style={{ borderColor: `${accent}55` }}>
                + Add photos
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── VENUE ─── */}
      {showVenue && (
        <section className="relative mx-auto max-w-5xl px-6 py-24 sm:py-32">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-4 text-center text-[10px] uppercase tracking-[0.6em]"
            style={{ color: accent }}
          >
            The Palace
          </motion.p>
          {event.venueName && (
            <h2 className="mb-2 text-center font-display text-3xl font-light tracking-tight" style={{ color: pearl }}>
              {event.venueName}
            </h2>
          )}
          {event.venueAddress && (
            <p className="mb-10 text-center text-sm opacity-70">{event.venueAddress}</p>
          )}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: EASE }}
            className="overflow-hidden rounded-3xl border p-1 backdrop-blur-md"
            style={{ borderColor: "rgba(230,250,255,0.15)", background: "rgba(230,250,255,0.05)", boxShadow: `0 0 40px ${accent}33` }}
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

      {/* ─── RSVP / CTA ─── */}
      <section className="relative px-6 py-28 text-center sm:py-40">
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: EASE }}
          className="mx-auto max-w-3xl"
        >
          <motion.div
            aria-hidden
            animate={reduce ? undefined : { scale: [1, 1.12, 0.96, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="mx-auto mb-10 h-40 w-40 rounded-full sm:h-56 sm:w-56"
            style={{
              background: `radial-gradient(circle, ${accent}88, ${coral}33 40%, transparent 70%)`,
              filter: "blur(30px)",
            }}
          />
          <h2 className="font-display text-[clamp(2rem,6vw,4.5rem)] font-light leading-[1] tracking-tight" style={{ color: pearl, textShadow: `0 0 30px ${accent}44` }}>
            Join us beneath the surface
          </h2>
          <PearlDivider accent={accent} />
          {event.mainDate && (
            <p className="mt-4 text-sm uppercase tracking-[0.4em] opacity-80">
              {new Date(event.mainDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
            </p>
          )}
          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <motion.div
              whileHover={reduce ? undefined : { scale: 1.04 }}
              className="mt-12 inline-block"
            >
              <a
                href={event.rsvpLinkOrContact}
                target="_blank"
                rel="noreferrer"
                className="inline-block rounded-full px-14 py-4 text-sm uppercase tracking-[0.35em] transition-all"
                style={{
                  background: `linear-gradient(135deg, ${accent}, ${coral})`,
                  color: "#052a3a",
                  boxShadow: `0 0 30px ${accent}88`,
                }}
              >
                Accept the tide
              </a>
            </motion.div>
          )}
          {event.contactName && (
            <p className="mt-10 text-xs uppercase tracking-[0.35em] opacity-60">
              {event.contactName}{event.contactPhone ? ` · ${event.contactPhone}` : ""}
            </p>
          )}
        </motion.div>
      </section>

      <footer className="relative border-t py-10 text-center text-xs opacity-60" style={{ borderColor: "rgba(230,250,255,0.08)" }}>
        <p style={{ color: pearl }}>
          {event.eventTitle}{event.person1Name ? ` · ${event.person1Name}` : ""}{event.person2Name ? ` & ${event.person2Name}` : ""}
        </p>
        <p className="mt-2 opacity-70">Beneath the sea, forever.</p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default OceanpalaceTemplate;
