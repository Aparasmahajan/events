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

const VIOLET = "#0f0724";
const MAGENTA = "#c53b7e";
const GOLD = "#f4d060";
const ROSE = "#e88fb0";
const IVORY = "#f6f0ff";

const RING_DOTS = Array.from({ length: 44 }, (_, i) => {
  const a = (i / 44) * Math.PI * 2;
  return { x: Math.cos(a) * 46, y: Math.sin(a) * 46, i };
});

const ASTEROIDS = [
  { rx: 220, ry: 90, dur: 24, size: 14, delay: 0, seed: 0 },
  { rx: 240, ry: 100, dur: 30, size: 10, delay: 4, seed: 1 },
  { rx: 260, ry: 110, dur: 36, size: 18, delay: 8, seed: 2 },
  { rx: 200, ry: 80, dur: 20, size: 12, delay: 12, seed: 3 },
  { rx: 280, ry: 120, dur: 42, size: 8, delay: 16, seed: 4 },
  { rx: 230, ry: 95, dur: 28, size: 16, delay: 20, seed: 5 },
];

const STAR_FIELD = Array.from({ length: 80 }, (_, i) => ({
  left: `${(i * 41 + 13) % 100}%`,
  top: `${(i * 67 + 7) % 100}%`,
  size: 1 + ((i * 13) % 3) * 0.6,
  delay: ((i * 17) % 40) / 10,
  dur: 2 + ((i * 7) % 30) / 10,
}));

const CONSTELLATIONS: { pts: [number, number][] }[] = [
  { pts: [[10, 20], [30, 10], [50, 25], [70, 15], [85, 35]] },
  { pts: [[15, 15], [15, 40], [40, 55], [65, 40], [85, 20]] },
  { pts: [[10, 50], [30, 30], [50, 45], [70, 25], [90, 40]] },
  { pts: [[20, 10], [45, 30], [30, 55], [60, 70], [85, 45]] },
];

function asteroidPath(seed: number, size: number) {
  const pts: string[] = [];
  const n = 7;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const r = size * (0.65 + ((seed * 31 + i * 17) % 40) / 100);
    pts.push(`${(Math.cos(a) * r).toFixed(2)},${(Math.sin(a) * r).toFixed(2)}`);
  }
  return pts.join(" ");
}

function Nebula({ reduce }: { reduce: boolean }) {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden" style={{ background: VIOLET }}>
      <motion.div
        className="absolute -top-1/3 -left-1/4 h-[80vmax] w-[80vmax] rounded-full opacity-70"
        style={{ background: `radial-gradient(circle at center, ${MAGENTA}55, transparent 60%)`, filter: "blur(40px)" }}
        animate={reduce ? undefined : { x: [0, 40, 0], y: [0, 20, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-1/3 -right-1/4 h-[70vmax] w-[70vmax] rounded-full opacity-60"
        style={{ background: `radial-gradient(circle at center, ${ROSE}44, transparent 60%)`, filter: "blur(50px)" }}
        animate={reduce ? undefined : { x: [0, -30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 left-1/2 h-[50vmax] w-[50vmax] -translate-x-1/2 rounded-full opacity-40"
        style={{ background: `radial-gradient(circle at center, ${GOLD}33, transparent 65%)`, filter: "blur(60px)" }}
        animate={reduce ? undefined : { opacity: [0.25, 0.5, 0.25], scale: [1, 1.05, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0">
        {STAR_FIELD.map((s, i) => (
          <motion.span
            key={i}
            aria-hidden
            className="absolute rounded-full"
            style={{ left: s.left, top: s.top, width: s.size, height: s.size, background: IVORY, boxShadow: `0 0 ${s.size * 3}px ${IVORY}` }}
            animate={reduce ? undefined : { opacity: [0.3, 1, 0.3] }}
            transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>
      <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${VIOLET}00 0%, ${VIOLET}66 60%, ${VIOLET} 100%)` }} />
    </div>
  );
}

function StarRing({ accent, delay = 0, reduce }: { accent: string; delay?: number; reduce: boolean }) {
  return (
    <motion.svg
      viewBox="-60 -60 120 120"
      className="h-40 w-40 sm:h-56 sm:w-56"
      animate={reduce ? undefined : { rotate: 360 }}
      transition={{ duration: 90, delay, repeat: Infinity, ease: "linear" }}
    >
      <circle cx="0" cy="0" r="46" fill="none" stroke={`${accent}22`} strokeWidth="0.4" />
      {RING_DOTS.map((d) => (
        <circle
          key={d.i}
          cx={d.x}
          cy={d.y}
          r={d.i % 5 === 0 ? 1.6 : 0.9}
          fill={d.i % 5 === 0 ? GOLD : IVORY}
          style={{ filter: `drop-shadow(0 0 3px ${d.i % 5 === 0 ? GOLD : accent})` }}
        />
      ))}
      <circle cx="0" cy="0" r="4" fill={GOLD} style={{ filter: `drop-shadow(0 0 8px ${GOLD})` }} />
    </motion.svg>
  );
}

function AsteroidBelt({ reduce }: { reduce: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div className="relative h-[520px] w-[520px] sm:h-[640px] sm:w-[640px]">
        {ASTEROIDS.map((a, i) => (
          <motion.svg
            key={i}
            className="absolute left-1/2 top-1/2"
            width={a.size * 2 + 6}
            height={a.size * 2 + 6}
            viewBox={`${-a.size - 3} ${-a.size - 3} ${a.size * 2 + 6} ${a.size * 2 + 6}`}
            style={{ marginLeft: -(a.size + 3), marginTop: -(a.size + 3) }}
            animate={reduce ? undefined : {
              x: [a.rx, 0, -a.rx, 0, a.rx],
              y: [0, -a.ry, 0, a.ry, 0],
              rotate: [0, 180, 360],
            }}
            transition={{ duration: a.dur, delay: a.delay, repeat: Infinity, ease: "linear" }}
          >
            <polygon
              points={asteroidPath(a.seed, a.size)}
              fill={`${MAGENTA}88`}
              stroke={GOLD}
              strokeWidth="0.5"
              style={{ filter: `drop-shadow(0 0 6px ${MAGENTA})` }}
            />
          </motion.svg>
        ))}
      </div>
    </div>
  );
}

function Constellation({ index, accent }: { index: number; accent: string }) {
  const c = CONSTELLATIONS[index % CONSTELLATIONS.length];
  const lines = c.pts.slice(0, -1).map((p, i) => ({ x1: p[0], y1: p[1], x2: c.pts[i + 1][0], y2: c.pts[i + 1][1] }));
  return (
    <svg viewBox="0 0 100 70" className="h-16 w-24 opacity-90">
      {lines.map((l, i) => (
        <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={`${accent}88`} strokeWidth="0.35" />
      ))}
      {c.pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={i === 0 || i === c.pts.length - 1 ? 1.6 : 1.1} fill={i % 2 === 0 ? GOLD : IVORY} style={{ filter: `drop-shadow(0 0 3px ${accent})` }} />
      ))}
    </svg>
  );
}

function GalaxyTimeline({ items, accent }: { items: SubEvent[]; accent: string }) {
  const reduce = useReducedMotion();
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <div className="mx-auto max-w-5xl px-6">
      <div className="grid gap-5 sm:grid-cols-2">
        {sorted.map((s, i) => (
          <motion.article
            key={s.order}
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8% 0px" }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
            className="relative overflow-hidden rounded-2xl border p-6 backdrop-blur-xl"
            style={{ borderColor: `${accent}33`, background: `linear-gradient(135deg, ${VIOLET}cc, ${MAGENTA}18)` }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em]" style={{ color: GOLD }}>
                  Constellation {String(s.order).padStart(2, "0")}
                </p>
                <h3 className="mt-2 font-display text-2xl leading-tight" style={{ color: IVORY }}>{s.name}</h3>
              </div>
              <Constellation index={i} accent={accent} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.25em]" style={{ color: `${IVORY}aa` }}>
              {s.date && <span>{new Date(s.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>}
              {s.startTime && <span style={{ color: `${IVORY}55` }}>·</span>}
              {s.startTime && <span>{s.startTime}</span>}
            </div>
            {s.venueName && <p className="mt-3 text-sm" style={{ color: `${IVORY}aa` }}>at {s.venueName}</p>}
            {s.description && <p className="mt-3 text-sm leading-relaxed" style={{ color: `${IVORY}88` }}>{s.description}</p>}
            {s.dressCode && (
              <p className="mt-4 inline-block rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.3em]" style={{ borderColor: `${accent}55`, color: ROSE }}>
                {s.dressCode}
              </p>
            )}
          </motion.article>
        ))}
      </div>
    </div>
  );
}

export const SecretgalaxyTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || MAGENTA;
  const tagline = event.tagline?.trim() || "A galaxy discovered by two";
  const invitationMessage = event.invitationMessage?.trim() || "We wandered the dark and found a galaxy that was always ours. Come chart it with us.";
  const aboutStory = event.aboutStory?.trim() || "Somewhere between constellations, a promise took shape. This is the beginning of an orbit only we can trace.";
  const hero = event.heroImageUrl || "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1800&q=80";
  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);

  const showStory = !event.hideStory;
  const showEvents = !event.hideEvents && subEvents.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroP, [0, 1], [0, -80]);
  const heroOpacity = useTransform(heroP, [0, 0.7], [1, 0]);

  const names = [event.person1Name, event.person2Name].filter(Boolean).join(" & ");

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-sans antialiased"
      style={{ "--accent": accent, color: IVORY, background: VIOLET } as React.CSSProperties}
    >
      <Nebula reduce={reduce} />
      <ScrollProgress color={accent} />

      <section ref={heroRef} className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <HeroMedia imageSrc={hero} videoSrc={event.heroVideoUrl || undefined} alt={event.eventTitle} className="opacity-30" />
          <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at center, transparent 20%, ${VIOLET} 80%)` }} />
        </div>

        <AsteroidBelt reduce={reduce} />

        <motion.div style={reduce ? undefined : { y: heroY, opacity: heroOpacity }} className="relative z-10 px-6 text-center">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE }}
            className="mb-6 text-[10px] uppercase tracking-[0.7em]"
            style={{ color: GOLD, textShadow: `0 0 20px ${GOLD}66` }}
          >
            {tagline}
          </motion.p>

          <div className="flex items-center justify-center gap-2 sm:gap-6">
            <StarRing accent={accent} reduce={reduce} />
            <div className="flex flex-col items-center">
              <motion.h1
                initial={reduce ? false : { opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.4, delay: 0.2, ease: EASE }}
                className="font-display text-[clamp(2.4rem,8vw,6rem)] leading-[0.9] tracking-tight"
                style={{ color: IVORY, textShadow: `0 0 40px ${MAGENTA}88` }}
              >
                {event.person1Name || event.eventTitle}
                {event.person2Name && (
                  <>
                    <span className="mx-3 sm:mx-5" style={{ color: GOLD }}>&</span>
                    {event.person2Name}
                  </>
                )}
              </motion.h1>
              <motion.p
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 1 }}
                className="mt-4 text-xs uppercase tracking-[0.5em]"
                style={{ color: `${IVORY}cc` }}
              >
                {event.eventTitle}
              </motion.p>
            </div>
            <StarRing accent={accent} delay={2} reduce={reduce} />
          </div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 1 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-3 text-[11px] uppercase tracking-[0.4em]"
            style={{ color: `${IVORY}cc` }}
          >
            {event.mainDate && (
              <span>{new Date(event.mainDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</span>
            )}
            {event.city && <span style={{ color: GOLD }}>·</span>}
            {event.city && <span>{event.city}</span>}
          </motion.div>
        </motion.div>
      </section>

      {showStory && (
        <section className="relative mx-auto max-w-4xl px-6 py-28 sm:py-40">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 1.1, ease: EASE }}
            className="text-center"
          >
            <p className="mb-6 text-[10px] uppercase tracking-[0.6em]" style={{ color: GOLD }}>Our Discovery</p>
            <h2 className="font-display text-3xl leading-snug sm:text-5xl" style={{ color: IVORY, textShadow: `0 0 30px ${MAGENTA}55` }}>
              {invitationMessage}
            </h2>
            <div className="mx-auto mt-10 h-px w-40" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />
            <p className="mx-auto mt-10 max-w-2xl text-base leading-relaxed sm:text-lg" style={{ color: `${IVORY}bb` }}>
              {aboutStory}
            </p>
          </motion.div>
        </section>
      )}

      {showEvents && (
        <section className="relative py-24 sm:py-32">
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-14 text-center"
          >
            <p className="text-[10px] uppercase tracking-[0.6em]" style={{ color: GOLD }}>The Star Chart</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl" style={{ color: IVORY }}>Named for each moment</h2>
          </motion.div>
          <GalaxyTimeline items={subEvents} accent={accent} />
        </section>
      )}

      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-10 text-center text-[10px] uppercase tracking-[0.6em]"
            style={{ color: GOLD }}
          >
            Asteroid Memories
          </motion.p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((m, i) => (
              <motion.div
                key={`${m.fileName}-${i}`}
                initial={reduce ? false : { opacity: 0, scale: 0.94, rotate: -1 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.05, ease: EASE }}
                className="group relative overflow-hidden rounded-2xl border"
                style={{ borderColor: `${accent}33` }}
              >
                <img
                  src={m.publicUrl}
                  alt={m.caption ?? ""}
                  className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 55%, ${VIOLET}dd)` }} />
                {m.caption && (
                  <p className="absolute bottom-4 left-4 right-4 text-xs uppercase tracking-[0.3em]" style={{ color: IVORY }}>
                    {m.caption}
                  </p>
                )}
              </motion.div>
            ))}
            {editing && galleryItems.length === 0 && (
              <div className="col-span-full flex h-52 items-center justify-center rounded-2xl border border-dashed text-sm" style={{ borderColor: `${accent}55`, color: `${IVORY}77` }}>
                + Add photos
              </div>
            )}
          </div>
        </section>
      )}

      {showVenue && (
        <section className="relative mx-auto max-w-5xl px-6 py-24 sm:py-32">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: EASE }}
            className="text-center"
          >
            <p className="mb-3 text-[10px] uppercase tracking-[0.6em]" style={{ color: GOLD }}>Coordinates</p>
            {event.venueName && (
              <h2 className="font-display text-3xl sm:text-4xl" style={{ color: IVORY }}>{event.venueName}</h2>
            )}
            {event.venueAddress && (
              <p className="mt-2 text-sm" style={{ color: `${IVORY}99` }}>{event.venueAddress}</p>
            )}
          </motion.div>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
            className="mt-10 overflow-hidden rounded-2xl border p-1 backdrop-blur-xl"
            style={{ borderColor: `${accent}33`, background: `${VIOLET}88` }}
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
          initial={reduce ? false : { opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: EASE }}
          className="mx-auto max-w-3xl"
        >
          <motion.div
            aria-hidden
            animate={reduce ? undefined : { scale: [1, 1.08, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="mx-auto mb-10 h-28 w-28 rounded-full sm:h-36 sm:w-36"
            style={{ background: `radial-gradient(circle, ${GOLD}, ${MAGENTA}66 40%, transparent 70%)`, filter: "blur(18px)" }}
          />
          <h2 className="font-display text-[clamp(2.2rem,6.5vw,4.6rem)] leading-tight" style={{ color: IVORY, textShadow: `0 0 40px ${MAGENTA}77` }}>
            {names || event.eventTitle}
          </h2>
          {event.mainDate && (
            <p className="mt-6 text-xs uppercase tracking-[0.5em]" style={{ color: `${IVORY}bb` }}>
              {new Date(event.mainDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
          )}
          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <motion.a
              href={event.rsvpLinkOrContact}
              target="_blank"
              rel="noreferrer"
              whileHover={reduce ? undefined : { scale: 1.04 }}
              className="mt-10 inline-block rounded-full px-12 py-4 text-xs uppercase tracking-[0.4em] transition-all"
              style={{ background: `linear-gradient(90deg, ${MAGENTA}, ${GOLD})`, color: VIOLET, boxShadow: `0 0 40px ${MAGENTA}55` }}
            >
              Chart your orbit
            </motion.a>
          )}
        </motion.div>
      </section>

      <footer className="relative border-t py-8 text-center text-xs" style={{ borderColor: `${accent}22`, color: `${IVORY}55` }}>
        <p>{event.eventTitle}{names ? ` · ${names}` : ""}</p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default SecretgalaxyTemplate;
