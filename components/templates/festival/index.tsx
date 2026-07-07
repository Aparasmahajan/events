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

const PALETTE = {
  midnight: "#0e0722",
  magenta: "#ff2eaa",
  cyan: "#00e5ff",
  gold: "#f4c34d",
  violet: "#8a4ad8",
  ivory: "#f6f2ff",
};

const LED_FLOWERS = [
  { top: "8%", left: "6%", size: 140, color: "#ff2eaa", delay: 0, dur: 28 },
  { top: "22%", left: "82%", size: 110, color: "#00e5ff", delay: 1.2, dur: 32 },
  { top: "48%", left: "3%", size: 90, color: "#f4c34d", delay: 0.6, dur: 30 },
  { top: "62%", left: "78%", size: 130, color: "#8a4ad8", delay: 1.8, dur: 34 },
  { top: "78%", left: "12%", size: 100, color: "#00e5ff", delay: 2.4, dur: 29 },
  { top: "88%", left: "72%", size: 120, color: "#ff2eaa", delay: 3.0, dur: 31 },
];

const STAGE_COLORS = ["#ff2eaa", "#00e5ff", "#f4c34d", "#8a4ad8", "#ff2eaa", "#00e5ff"];
const STAGE_NAMES = ["Main Stage", "Neon Grove", "Laser Dome", "Sunset Deck", "Bass Cathedral", "Skyline"];
const VIS_HEIGHTS = [
  [40, 70, 55, 85, 45],
  [60, 45, 80, 55, 70],
  [75, 55, 40, 70, 60],
  [50, 80, 65, 45, 75],
];

function LedFlower({ size, color, delay, dur }: { size: number; color: string; delay: number; dur: number }) {
  const reduce = useReducedMotion();
  const petals = 8;
  return (
    <motion.svg
      viewBox="-60 -60 120 120"
      width={size}
      height={size}
      style={{ filter: `drop-shadow(0 0 18px ${color})` }}
      animate={reduce ? undefined : { rotate: 360 }}
      transition={{ duration: dur, repeat: Infinity, ease: "linear", delay }}
    >
      {Array.from({ length: petals }).map((_, i) => {
        const a = (i / petals) * 360;
        return (
          <ellipse
            key={i}
            cx={0}
            cy={-32}
            rx={9}
            ry={22}
            fill={color}
            opacity={0.55}
            transform={`rotate(${a})`}
          />
        );
      })}
      <circle cx={0} cy={0} r={14} fill={PALETTE.ivory} opacity={0.85} />
      <circle cx={0} cy={0} r={7} fill={color} />
    </motion.svg>
  );
}

function FestivalField({ reduce }: { reduce: boolean }) {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden" style={{ background: PALETTE.midnight }}>
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 20% 10%, ${PALETTE.violet}33, transparent 55%), radial-gradient(ellipse at 80% 90%, ${PALETTE.magenta}22, transparent 55%)` }} />
      {!reduce && (
        <div className="absolute inset-0">
          {LED_FLOWERS.map((f, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{ top: f.top, left: f.left, opacity: 0.35 }}
              animate={{ scale: [0.85, 1.05, 0.85] }}
              transition={{ duration: 6 + (i % 3), delay: f.delay, repeat: Infinity, ease: "easeInOut" }}
            >
              <LedFlower size={f.size} color={f.color} delay={f.delay} dur={f.dur} />
            </motion.div>
          ))}
        </div>
      )}
      <svg className="absolute inset-0 h-full w-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
        <filter id="lumina-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" />
        </filter>
        <rect width="100%" height="100%" filter="url(#lumina-noise)" />
      </svg>
      <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${PALETTE.midnight}00 0%, ${PALETTE.midnight}cc 100%)` }} />
    </div>
  );
}

function LaserTunnel({ reduce, delay = 0 }: { reduce: boolean; delay?: number }) {
  if (reduce) return null;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute -left-[20%] h-[3px] w-[140%] origin-left"
          style={{
            top: `${25 + i * 25}%`,
            background: `linear-gradient(90deg, transparent, ${[PALETTE.magenta, PALETTE.cyan, PALETTE.gold][i]}, transparent)`,
            transform: `rotate(${i % 2 === 0 ? -6 : 6}deg)`,
            filter: `blur(1px) drop-shadow(0 0 8px ${[PALETTE.magenta, PALETTE.cyan, PALETTE.gold][i]})`,
          }}
          animate={{ opacity: [0.15, 0.7, 0.15], scaleX: [0.9, 1, 0.9] }}
          transition={{ duration: 3 + i * 0.6, delay: delay + i * 0.4, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function StageArch({ accent }: { accent: string }) {
  const reduce = useReducedMotion();
  return (
    <svg viewBox="0 0 800 420" className="mx-auto w-full max-w-3xl" aria-hidden>
      <defs>
        <linearGradient id="archG" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.9" />
          <stop offset="100%" stopColor={PALETTE.violet} stopOpacity="0.2" />
        </linearGradient>
        <radialGradient id="beamG" cx="0.5" cy="0" r="0.7">
          <stop offset="0%" stopColor={PALETTE.ivory} stopOpacity="0.85" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>
      {!reduce && [-40, -20, 0, 20, 40].map((deg, i) => (
        <motion.polygon
          key={i}
          points={`400,80 ${400 + deg * 3},420 ${400 + deg * 3 + 30},420`}
          fill="url(#beamG)"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.1, 0.5, 0.1] }}
          transition={{ duration: 3 + i * 0.3, delay: i * 0.25, repeat: Infinity }}
        />
      ))}
      <path
        d="M 120 380 Q 120 120, 400 100 Q 680 120, 680 380"
        fill="none"
        stroke="url(#archG)"
        strokeWidth={8}
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 12px ${accent})` }}
      />
      <path
        d="M 170 380 Q 170 160, 400 145 Q 630 160, 630 380"
        fill="none"
        stroke={PALETTE.cyan}
        strokeOpacity={0.5}
        strokeWidth={3}
        style={{ filter: `drop-shadow(0 0 8px ${PALETTE.cyan})` }}
      />
      {Array.from({ length: 9 }).map((_, i) => {
        const x = 340 + i * 15;
        const h = 30 + (i % 3) * 12;
        return <rect key={i} x={x} y={380 - h} width={8} height={h} rx={2} fill={PALETTE.midnight} opacity={0.9} />;
      })}
      <ellipse cx={400} cy={385} rx={180} ry={8} fill={accent} opacity={0.15} />
    </svg>
  );
}

function VisualizerBars({ color, index }: { color: string; index: number }) {
  const reduce = useReducedMotion();
  const heights = VIS_HEIGHTS[index % VIS_HEIGHTS.length];
  return (
    <div className="flex h-8 items-end gap-1">
      {heights.map((h, i) => (
        <motion.span
          key={i}
          className="w-1 rounded-sm"
          style={{ background: color, boxShadow: `0 0 6px ${color}`, height: `${h}%` }}
          animate={reduce ? undefined : { scaleY: [1, 0.5, 1.15, 0.7, 1] }}
          transition={{ duration: 1.2, delay: i * 0.08, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function StageCard({ item, i, accent }: { item: SubEvent; i: number; accent: string }) {
  const reduce = useReducedMotion();
  const barColor = STAGE_COLORS[i % STAGE_COLORS.length];
  const stageName = STAGE_NAMES[i % STAGE_NAMES.length];
  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
      whileHover={reduce ? undefined : { y: -4 }}
      className="relative flex overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl"
    >
      <div className="w-2 flex-shrink-0" style={{ background: barColor, boxShadow: `0 0 20px ${barColor}` }} />
      <div className="flex-1 p-6">
        <div className="mb-3 flex items-center justify-between">
          <span
            className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em]"
            style={{ background: `${barColor}22`, color: barColor, border: `1px solid ${barColor}55` }}
          >
            {stageName}
          </span>
          <VisualizerBars color={barColor} index={i} />
        </div>
        <p className="text-[10px] uppercase tracking-[0.3em] opacity-50">
          {[item.date, item.startTime].filter(Boolean).join(" · ")}
        </p>
        <h3 className="mt-2 font-display text-2xl font-black uppercase leading-tight tracking-tight">{item.name}</h3>
        {item.venueName && <p className="mt-1 text-sm opacity-60">@ {item.venueName}</p>}
        {item.description && <p className="mt-3 text-sm leading-relaxed opacity-65">{item.description}</p>}
        {item.dressCode && (
          <p className="mt-4 inline-block rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.25em] opacity-70" style={{ color: accent }}>
            {item.dressCode}
          </p>
        )}
      </div>
    </motion.article>
  );
}

export const FestivalTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || PALETTE.magenta;
  const tagline = event.tagline?.trim() || "Lumina · Festival of Lights";
  const invitationMessage = event.invitationMessage?.trim() || "One night. Six stages. A skyline of lasers. Come lose yourself in the light.";
  const aboutStory = event.aboutStory?.trim() || "Lumina is where music becomes architecture and every beam of light is a hand raised to the sky. Every stage is its own world; every hour, a new key change.";
  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const hero = event.heroImageUrl || "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=2000&q=80";

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(heroP, [0, 1], [1, 0.92]);
  const heroY = useTransform(heroP, [0, 0.6], [0, -60]);
  const heroOpacity = useTransform(heroP, [0, 0.5], [1, 0]);

  const showStory = !event.hideStory;
  const showStages = !event.hideEvents && subEvents.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);
  const sortedStages = [...subEvents].sort((a, b) => a.order - b.order);

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-sans antialiased"
      style={{ background: PALETTE.midnight, color: PALETTE.ivory, "--accent": accent } as React.CSSProperties}
    >
      <FestivalField reduce={reduce} />
      <ScrollProgress color={accent} />

      {/* HERO */}
      <section ref={heroRef} className="relative flex min-h-[100svh] items-center justify-center overflow-hidden pb-24 sm:pb-28">
        <motion.div style={reduce ? undefined : { scale: heroScale }} className="absolute inset-0">
          <HeroMedia imageSrc={hero} videoSrc={event.heroVideoUrl || undefined} alt={event.eventTitle} className="opacity-35" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${PALETTE.midnight}66 0%, ${PALETTE.midnight}ee 100%)` }} />
        </motion.div>
        <LaserTunnel reduce={reduce} />

        <motion.div style={reduce ? undefined : { y: heroY, opacity: heroOpacity }} className="relative z-10 w-full px-6 text-center">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="mb-6 text-[11px] uppercase tracking-[0.7em]"
            style={{ color: accent, textShadow: `0 0 28px ${accent}` }}
          >
            {tagline}
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.15, ease: EASE }}
            className="mx-auto mb-8 w-full max-w-3xl"
          >
            <StageArch accent={accent} />
          </motion.div>

          <h1 className="font-display text-[clamp(2.75rem,11vw,8rem)] font-black uppercase leading-[0.9] tracking-tight" style={{ textShadow: `0 0 40px ${accent}55` }}>
            {event.eventTitle.split(" ").map((w, i) => (
              <motion.span
                key={i}
                className="block"
                initial={reduce ? false : { opacity: 0, y: 24, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.8, delay: 0.4 + i * 0.12, ease: EASE }}
              >
                {w}
              </motion.span>
            ))}
          </h1>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="mt-8 flex flex-wrap justify-center gap-3 text-[11px] uppercase tracking-[0.4em]"
          >
            {event.mainDate && (
              <span className="rounded-full border border-white/15 px-4 py-1.5" style={{ background: `${PALETTE.midnight}aa` }}>
                {new Date(event.mainDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
              </span>
            )}
            {event.mainStartTime && (
              <span className="rounded-full border border-white/15 px-4 py-1.5" style={{ background: `${PALETTE.midnight}aa` }}>{event.mainStartTime}</span>
            )}
            {event.city && (
              <span className="rounded-full border border-white/15 px-4 py-1.5" style={{ background: `${PALETTE.midnight}aa`, color: accent }}>{event.city}</span>
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* STORY */}
      {showStory && (
        <section className="relative mx-auto max-w-5xl px-6 py-28 sm:py-36">
          <LaserTunnel reduce={reduce} delay={0.5} />
          <div className="relative grid items-center gap-12 sm:grid-cols-2">
            <motion.div
              initial={reduce ? false : { opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: EASE }}
            >
              <p className="mb-4 text-[10px] uppercase tracking-[0.55em]" style={{ color: accent }}>
                The Invitation
              </p>
              <h2 className="font-display text-3xl font-black uppercase leading-[1.05] tracking-tight sm:text-4xl">
                {invitationMessage}
              </h2>
            </motion.div>
            <motion.div
              initial={reduce ? false : { opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2, ease: EASE }}
            >
              <p className="text-base leading-relaxed opacity-70 sm:text-lg">{aboutStory}</p>
              <div className="mt-6 flex gap-2">
                {[PALETTE.magenta, PALETTE.cyan, PALETTE.gold, PALETTE.violet].map((c, i) => (
                  <motion.span
                    key={i}
                    className="h-1 flex-1 rounded-full"
                    style={{ background: c, boxShadow: `0 0 10px ${c}` }}
                    animate={reduce ? undefined : { opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* STAGES */}
      {showStages && (
        <section className="relative py-24 sm:py-32">
          <LaserTunnel reduce={reduce} delay={1} />
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-3 text-center text-[10px] uppercase tracking-[0.55em]"
            style={{ color: accent }}
          >
            The Stages
          </motion.p>
          <motion.h2
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="mb-14 text-center font-display text-3xl font-black uppercase tracking-tight sm:text-5xl"
          >
            Every stage, a world.
          </motion.h2>
          <div className="mx-auto grid max-w-5xl gap-5 px-6 sm:grid-cols-2">
            {sortedStages.map((s, i) => (
              <StageCard key={s.order} item={s} i={i} accent={accent} />
            ))}
          </div>
        </section>
      )}

      {/* GALLERY */}
      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-3 text-center text-[10px] uppercase tracking-[0.55em]"
            style={{ color: accent }}
          >
            Postcards from the Field
          </motion.p>
          <h2 className="mb-12 text-center font-display text-3xl font-black uppercase tracking-tight sm:text-5xl">Moments in Light</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((m, i) => (
              <motion.div
                key={`${m.fileName}-${i}`}
                initial={reduce ? false : { opacity: 0, scale: 0.94 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.05, ease: EASE }}
                className="group relative overflow-hidden rounded-xl border"
                style={{ borderColor: `${accent}33` }}
              >
                <img
                  src={m.publicUrl}
                  alt={m.caption ?? ""}
                  className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100" style={{ background: `linear-gradient(180deg, transparent 50%, ${PALETTE.midnight}dd 100%)` }} />
                {m.caption && (
                  <p className="absolute bottom-3 left-4 right-4 translate-y-2 text-xs uppercase tracking-[0.3em] opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-90">
                    {m.caption}
                  </p>
                )}
              </motion.div>
            ))}
            {editing && galleryItems.length === 0 && (
              <div className="col-span-full flex h-48 items-center justify-center rounded-xl border border-dashed border-white/25 text-sm opacity-60">
                + Add photos
              </div>
            )}
          </div>
        </section>
      )}

      {/* VENUE */}
      {showVenue && (
        <section className="relative mx-auto max-w-5xl px-6 py-24 sm:py-32">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-3 text-center text-[10px] uppercase tracking-[0.55em]"
            style={{ color: accent }}
          >
            The Grounds
          </motion.p>
          <h2 className="mb-10 text-center font-display text-3xl font-black uppercase tracking-tight sm:text-5xl">Find the Field</h2>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="overflow-hidden rounded-2xl border border-white/10 p-1 backdrop-blur-xl"
            style={{ background: `linear-gradient(135deg, ${accent}22, ${PALETTE.violet}22)` }}
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
        <LaserTunnel reduce={reduce} delay={1.6} />
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: EASE }}
          className="relative mx-auto max-w-3xl"
        >
          <motion.div
            aria-hidden
            animate={reduce ? undefined : { scale: [1, 1.1, 1], opacity: [0.25, 0.5, 0.25] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="mx-auto mb-8 h-28 w-28 rounded-full sm:h-36 sm:w-36"
            style={{ background: `radial-gradient(circle, ${accent}, transparent 70%)`, filter: "blur(18px)" }}
          />
          <h2 className="font-display text-[clamp(2.25rem,7vw,5rem)] font-black uppercase leading-[0.9] tracking-tight" style={{ textShadow: `0 0 30px ${accent}66` }}>
            {event.eventTitle.split(" ").join(" · ")}
          </h2>
          {event.person1Name && (
            <p className="mt-4 text-sm uppercase tracking-[0.4em] opacity-70">Curated by {event.person1Name}</p>
          )}
          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <motion.a
              whileHover={reduce ? undefined : { scale: 1.04 }}
              href={event.rsvpLinkOrContact}
              target="_blank"
              rel="noreferrer"
              className="mt-10 inline-block rounded-full px-14 py-4 text-sm font-bold uppercase tracking-[0.35em]"
              style={{ background: accent, color: PALETTE.midnight, boxShadow: `0 0 40px ${accent}88` }}
            >
              Claim your wristband
            </motion.a>
          )}
        </motion.div>
      </section>

      <footer className="relative border-t border-white/[0.05] py-8 text-center text-xs opacity-50">
        <p>{event.eventTitle}{event.person1Name ? ` · ${event.person1Name}` : ""} · Lumina Festival of Lights</p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default FestivalTemplate;
