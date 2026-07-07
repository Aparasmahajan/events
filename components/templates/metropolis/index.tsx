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

// Deterministic building silhouette — [x, width, height] per building, x/w in %, height in svg-units of 100.
const BUILDINGS: [number, number, number][] = [
  [0, 6, 42], [6, 4, 58], [10, 7, 34], [17, 5, 66], [22, 4, 48], [26, 8, 78],
  [34, 5, 40], [39, 6, 62], [45, 4, 30], [49, 7, 74], [56, 5, 50], [61, 4, 88],
  [65, 7, 44], [72, 5, 60], [77, 4, 36], [81, 8, 70], [89, 4, 46], [93, 7, 56],
];

// Fixed lit-window grid per building (deterministic, hydration-safe).
const WINDOW_SEED = [3, 7, 2, 11, 5, 13, 4, 8, 6, 10, 1, 12, 9, 14, 15, 3, 7, 5];

const LASERS = [
  { angle: 18, color: "#ff0080", top: "12%", delay: 0 },
  { angle: -22, color: "#00d9ff", top: "35%", delay: 1.2 },
  { angle: 14, color: "#b026ff", top: "58%", delay: 2.4 },
  { angle: -12, color: "#ff2fa0", top: "78%", delay: 3.6 },
];

function CityBackground({ reduce, accent }: { reduce: boolean; accent: string }) {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden bg-[#06060f]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#06060f] via-[#0a081a] to-[#06060f]" />
      <div
        className="absolute inset-0 opacity-[0.5]"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 20% 30%, ${accent}22, transparent), radial-gradient(ellipse 50% 40% at 80% 60%, #00d9ff22, transparent), radial-gradient(ellipse 40% 30% at 50% 100%, #b026ff33, transparent)`,
        }}
      />
      {!reduce && LASERS.map((l, i) => (
        <motion.div
          key={i}
          className="absolute left-[-20%] h-[2px] w-[140%] origin-left opacity-70"
          style={{
            top: l.top,
            background: `linear-gradient(90deg, transparent, ${l.color}, transparent)`,
            transform: `rotate(${l.angle}deg)`,
            boxShadow: `0 0 20px ${l.color}, 0 0 40px ${l.color}`,
          }}
          animate={{ opacity: [0, 0.8, 0], x: ["-10%", "10%", "-10%"] }}
          transition={{ duration: 6, delay: l.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#06060f]" />
    </div>
  );
}

function Skyline({ reduce }: { reduce: boolean }) {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="pointer-events-none absolute bottom-0 left-0 h-[55%] w-full"
      aria-hidden
    >
      <defs>
        <linearGradient id="metro-bldg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0e0d1c" />
          <stop offset="1" stopColor="#06060f" />
        </linearGradient>
      </defs>
      {BUILDINGS.map(([x, w, h], i) => {
        const seed = WINDOW_SEED[i % WINDOW_SEED.length];
        return (
          <g key={i}>
            <rect x={x} y={100 - h} width={w} height={h} fill="url(#metro-bldg)" stroke="#ff0080" strokeWidth={0.05} strokeOpacity={0.25} />
            {[...Array(4)].map((_, row) => (
              [...Array(3)].map((_, col) => {
                const lit = ((row * 3 + col + seed) % 5) < 2;
                if (!lit) return null;
                const wx = x + 0.8 + col * (w - 1.6) / 3;
                const wy = 100 - h + 4 + row * (h - 8) / 4;
                const ww = Math.max(0.4, (w - 1.6) / 3 * 0.5);
                const wh = Math.max(0.5, (h - 8) / 4 * 0.4);
                const delay = (i * 0.13 + row * 0.4 + col * 0.2) % 4;
                return (
                  <motion.rect
                    key={`${row}-${col}`}
                    x={wx} y={wy} width={ww} height={wh}
                    fill="#ffe680"
                    initial={reduce ? undefined : { opacity: 0.6 }}
                    animate={reduce ? { opacity: 0.6 } : { opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2.5 + (i % 3), delay, repeat: Infinity, ease: "easeInOut" }}
                  />
                );
              })
            ))}
          </g>
        );
      })}
    </svg>
  );
}

function FloorCard({
  s,
  i,
  accent,
}: {
  s: SubEvent;
  i: number;
  accent: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
      whileHover={reduce ? undefined : { y: -3 }}
      className="relative overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-xl"
      style={{ boxShadow: `inset 0 0 0 1px rgba(255,0,128,0.06), 0 0 40px ${accent}18` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] opacity-60" style={{ color: accent }}>
          FLOOR — {String(s.order).padStart(2, "0")}
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] opacity-50">
          {[s.startTime, s.endTime].filter(Boolean).join(" → ")}
        </div>
      </div>
      <h3 className="mt-3 font-display text-2xl uppercase tracking-tight text-white">{s.name}</h3>
      {s.venueName && <p className="mt-1 font-mono text-xs opacity-60">[ {s.venueName} ]</p>}
      {s.description && <p className="mt-3 text-sm leading-relaxed opacity-70">{s.description}</p>}
      {s.dressCode && (
        <p className="mt-4 inline-block border border-white/[0.1] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] opacity-60">
          {s.dressCode}
        </p>
      )}
    </motion.article>
  );
}

export const MetropolisTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || "#ff0080";
  const tagline = event.tagline?.trim() || "Enter the city.";
  const invitationMessage = event.invitationMessage?.trim()
    || "The city has a soundtrack tonight and we have the address.";
  const aboutStory = event.aboutStory?.trim()
    || "Ten floors, three rooms, one sound. Somewhere between the elevator and the roof, the night becomes what it wants to be.";
  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const hero = event.heroImageUrl
    || "https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=1600&q=80";

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroTextY = useTransform(heroP, [0, 1], [0, -80]);
  const heroOpacity = useTransform(heroP, [0, 0.6], [1, 0]);
  const skylineY = useTransform(heroP, [0, 1], [0, 40]);

  const sorted = [...subEvents].sort((a, b) => a.order - b.order);
  const showStory = !event.hideStory;
  const showJourney = !event.hideEvents && sorted.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  return (
    <div
      className="relative min-h-screen overflow-x-clip bg-[#06060f] font-sans text-[#f0e8ff] antialiased"
      style={{ "--accent": accent } as React.CSSProperties}
    >
      <CityBackground reduce={reduce} accent={accent} />
      <ScrollProgress color={accent} />

      <section ref={heroRef} className="relative flex min-h-[100svh] items-end overflow-hidden px-5 pb-32 sm:items-center sm:pb-0">
        <div aria-hidden className="absolute inset-0">
          <HeroMedia imageSrc={hero} videoSrc={event.heroVideoUrl || undefined} alt={event.eventTitle} className="opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#06060f]/70 via-[#06060f]/40 to-[#06060f]" />
        </div>

        <motion.div style={reduce ? undefined : { y: skylineY }} className="pointer-events-none absolute inset-x-0 bottom-0 z-0">
          <Skyline reduce={reduce} />
        </motion.div>

        <motion.div style={reduce ? undefined : { y: heroTextY, opacity: heroOpacity }} className="relative z-10 mx-auto max-w-5xl text-center">
          <motion.p
            initial={reduce ? false : { opacity: 0, letterSpacing: "0.2em" }}
            animate={{ opacity: 1, letterSpacing: "0.6em" }}
            transition={{ duration: 1.4, ease: EASE }}
            className="mb-6 font-mono text-[10px] uppercase"
            style={{ color: accent, textShadow: `0 0 20px ${accent}` }}
          >
            {tagline}
          </motion.p>
          <h1
            className="font-display text-[clamp(3rem,13vw,10rem)] font-black uppercase leading-[0.85] tracking-tight"
            style={{
              backgroundImage: `linear-gradient(180deg, #ffffff 0%, #f0e8ff 40%, ${accent} 100%)`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              textShadow: `0 0 40px ${accent}55`,
            }}
          >
            {event.eventTitle}
          </h1>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7 }}
            className="mt-8 flex flex-wrap justify-center gap-4 font-mono text-xs uppercase tracking-[0.4em] opacity-75"
          >
            {event.mainDate && (
              <span>{new Date(event.mainDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</span>
            )}
            {event.mainStartTime && <><span className="opacity-40">·</span><span>{event.mainStartTime}</span></>}
            {event.city && <><span className="opacity-40">·</span><span>{event.city}</span></>}
          </motion.div>
        </motion.div>
      </section>

      {showStory && (
        <section className="relative mx-auto max-w-5xl px-6 py-24 sm:py-32">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-6 text-center font-mono text-[10px] uppercase tracking-[0.5em]"
            style={{ color: accent }}
          >
            [ TRANSMISSION 01 ]
          </motion.p>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE }}
            whileHover={reduce ? undefined : { boxShadow: `0 0 60px ${accent}44, inset 0 0 0 1px ${accent}66` }}
            className="mx-auto max-w-3xl overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.02] p-8 backdrop-blur-xl transition-shadow sm:p-12"
            style={{ boxShadow: `inset 0 0 0 1px rgba(255,0,128,0.08), 0 0 40px ${accent}18` }}
          >
            <p className="font-display text-2xl leading-[1.35] text-white sm:text-3xl" style={{ textShadow: `0 0 20px ${accent}22` }}>
              {invitationMessage}
            </p>
            <p className="mt-6 text-base leading-relaxed opacity-70 sm:text-lg">{aboutStory}</p>
          </motion.div>
        </section>
      )}

      {showJourney && (
        <section className="relative mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-14 text-center font-mono text-[10px] uppercase tracking-[0.5em]"
            style={{ color: accent }}
          >
            [ THE TIMELINE ]
          </motion.p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((s, i) => <FloorCard key={s.order} s={s} i={i} accent={accent} />)}
          </div>
        </section>
      )}

      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-10 text-center font-mono text-[10px] uppercase tracking-[0.5em]"
            style={{ color: accent }}
          >
            [ ARCHIVE ]
          </motion.p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {galleryItems.map((m, i) => (
              <motion.div
                key={`${m.fileName}-${i}`}
                initial={reduce ? false : { opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="group relative overflow-hidden rounded-lg"
                style={{ boxShadow: `0 0 0 1px rgba(255,0,128,0.15), 0 0 30px ${accent}22` }}
              >
                <img
                  src={m.publicUrl}
                  alt={m.caption ?? ""}
                  className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06060f]/70 to-transparent" />
              </motion.div>
            ))}
            {editing && galleryItems.length === 0 && (
              <div className="col-span-full flex h-48 items-center justify-center rounded-lg border border-dashed border-white/20 text-sm opacity-50">
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
            className="mb-6 text-center font-mono text-[10px] uppercase tracking-[0.5em]"
            style={{ color: accent }}
          >
            [ COORDINATES ]
          </motion.p>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.02] p-1 backdrop-blur-xl"
            style={{ boxShadow: `0 0 40px ${accent}22` }}
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
        <motion.h2
          initial={reduce ? false : { opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE }}
          className="font-display text-[clamp(2.5rem,9vw,6rem)] font-black uppercase leading-[0.9] tracking-tight text-white"
          style={{ textShadow: `0 0 30px ${accent}66` }}
        >
          Enter The City
        </motion.h2>
        {event.rsvpEnabled && event.rsvpLinkOrContact && (
          <motion.a
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            whileHover={reduce ? undefined : { scale: 1.03 }}
            href={event.rsvpLinkOrContact}
            target="_blank"
            rel="noreferrer"
            className="mt-10 inline-block rounded-full px-12 py-4 font-mono text-xs uppercase tracking-[0.35em] text-black transition-all"
            style={{ background: accent, boxShadow: `0 0 40px ${accent}` }}
          >
            Get on the list
          </motion.a>
        )}
      </section>

      <footer className="border-t border-white/[0.05] py-8 text-center font-mono text-[10px] uppercase tracking-[0.3em] opacity-40">
        <p>{event.eventTitle}{event.person1Name ? ` · ${event.person1Name}` : ""}</p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default MetropolisTemplate;
