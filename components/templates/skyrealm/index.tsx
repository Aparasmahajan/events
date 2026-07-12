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
const SKY = "#cfe3f5";
const SKY_DEEP = "#9dbfdd";
const MARBLE = "#faf7f0";
const GOLD = "#d4af6a";
const INK = "#243a52";

const CLOUDS = Array.from({ length: 6 }, (_, i) => ({
  top: `${8 + ((i * 17) % 78)}%`,
  scale: 0.7 + (i % 3) * 0.35,
  dur: 55 + i * 14,
  delay: -(i * 11),
  opacity: 0.5 + (i % 3) * 0.15,
}));

const BIRDS = Array.from({ length: 7 }, (_, i) => ({
  top: `${6 + ((i * 13) % 55)}%`,
  dur: 20 + (i % 4) * 6,
  delay: i * 4.5,
  size: 16 + (i % 3) * 7,
}));

function SkyField({ reduce }: { reduce: boolean }) {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden" style={{ background: `linear-gradient(180deg, ${SKY} 0%, ${SKY_DEEP} 100%)` }}>
      <div className="absolute inset-0" style={{ background: `radial-gradient(60% 40% at 50% 0%, rgba(255,255,255,0.7), transparent 70%)` }} />
      {CLOUDS.map((c, i) => (
        <motion.div
          key={i}
          className="absolute h-16 w-48 rounded-full sm:h-24 sm:w-72"
          style={{ top: c.top, left: "-30%", background: "rgba(255,255,255,0.9)", filter: "blur(18px)", opacity: c.opacity, scale: c.scale }}
          animate={reduce ? undefined : { x: ["0vw", "160vw"] }}
          transition={{ duration: c.dur, delay: c.delay, repeat: Infinity, ease: "linear" }}
        />
      ))}
      {BIRDS.map((b, i) => (
        <motion.svg
          key={`bird-${i}`}
          viewBox="0 0 24 10"
          style={{ top: b.top, left: "-6%", position: "absolute", width: b.size }}
          animate={reduce ? undefined : { x: ["0vw", "112vw"], y: [0, -14, 4, -10, 0] }}
          transition={{ duration: b.dur, delay: b.delay, repeat: Infinity, ease: "linear" }}
        >
          <path d="M1 7 Q6 1 12 6 Q18 1 23 7 Q18 4 12 8 Q6 4 1 7 Z" fill={GOLD} opacity={0.85} />
        </motion.svg>
      ))}
    </div>
  );
}

function Island({ children, className, delay = 0, bob = 0 }: { children: React.ReactNode; className?: string; delay?: number; bob?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 46 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
      className={`relative z-10 ${className ?? ""}`}
    >
      <motion.div
        animate={reduce ? undefined : { y: [0, -7, 0] }}
        transition={{ duration: 6 + bob, delay: bob * 0.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          className="relative rounded-t-3xl rounded-b-[3.5rem] border px-6 py-8 sm:px-10 sm:py-10"
          style={{ background: MARBLE, borderColor: `${GOLD}55`, boxShadow: `0 34px 50px -24px ${INK}59, inset 0 1px 0 #fff` }}
        >
          {children}
        </div>
        <svg viewBox="0 0 220 46" aria-hidden className="mx-auto -mt-3 block w-44 sm:w-56">
          <path d="M34 4 L186 4 L162 18 L128 27 L112 44 L94 33 L64 24 L44 14 Z" fill="#8ba9c4" />
          <path d="M34 4 L186 4 L158 15 L104 11 L60 15 Z" fill={SKY_DEEP} />
          <path d="M112 44 L120 30 L104 32 Z" fill="#7595b2" />
        </svg>
      </motion.div>
    </motion.div>
  );
}

function Bridge() {
  const reduce = useReducedMotion();
  return (
    <motion.svg
      viewBox="0 0 140 44"
      aria-hidden
      className="relative z-0 mx-auto -my-2 block h-12 w-36"
      initial={reduce ? false : { opacity: 0, scaleX: 0.6 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: EASE }}
    >
      <path d="M4 44 Q70 -4 136 44" fill="none" stroke={MARBLE} strokeWidth="7" strokeLinecap="round" />
      <path d="M4 44 Q70 -4 136 44" fill="none" stroke={GOLD} strokeWidth="1.5" strokeDasharray="3 7" />
    </motion.svg>
  );
}

function KingdomTimeline({ items, accent }: { items: SubEvent[]; accent: string }) {
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <div className="mx-auto max-w-xl px-6">
      {sorted.map((s, i) => (
        <div key={s.order}>
          {i > 0 && <Bridge />}
          <Island delay={i * 0.08} bob={i % 4}>
            <p className="text-[10px] uppercase tracking-[0.45em]" style={{ color: accent }}>
              Isle {String(s.order).padStart(2, "0")}
              {[s.date, s.startTime].filter(Boolean).length > 0 && ` · ${[s.date, s.startTime].filter(Boolean).join(" · ")}`}
            </p>
            <h3 className="mt-2 font-display text-2xl" style={{ color: INK }}>{s.name}</h3>
            {s.venueName && <p className="mt-1 text-sm opacity-70" style={{ color: INK }}>{s.venueName}</p>}
            {s.description && <p className="mt-3 text-sm leading-relaxed opacity-75" style={{ color: INK }}>{s.description}</p>}
            {s.dressCode && (
              <p className="mt-4 inline-block rounded-full border px-4 py-1 text-[10px] uppercase tracking-[0.25em]" style={{ borderColor: `${accent}66`, color: accent }}>
                {s.dressCode}
              </p>
            )}
          </Island>
        </div>
      ))}
    </div>
  );
}

export const SkyrealmTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || GOLD;
  const tagline = event.tagline?.trim() || "A kingdom above the clouds";
  const invitationMessage = event.invitationMessage?.trim() || "Two realms, long separated by sky, are joined at last. Cross the marble bridges, walk among the clouds, and witness the day two kingdoms become one.";
  const aboutStory = event.aboutStory?.trim() || "Every love story builds its own world. Ours floats a little higher — island by island, bridge by bridge — until the whole sky is home.";
  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const hero = event.heroImageUrl || "https://images.unsplash.com/photo-1505142468610-359e7d316be0?auto=format&fit=crop&w=1600&q=80";

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroP, [0, 1], [0, 90]);
  const heroOpacity = useTransform(heroP, [0, 0.6], [1, 0]);

  const showStory = !event.hideStory;
  const showJourney = !event.hideEvents && subEvents.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-sans antialiased"
      style={{ "--accent": accent, color: INK } as React.CSSProperties}
    >
      <SkyField reduce={reduce} />
      <ScrollProgress color={accent} />

      <section ref={heroRef} className="relative flex h-[100svh] min-h-[620px] items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <HeroMedia imageSrc={hero} videoSrc={event.heroVideoUrl || undefined} alt={event.eventTitle} className="opacity-40" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${SKY}cc 0%, transparent 45%, ${SKY}f2 100%)` }} />
        </div>
        <motion.div style={reduce ? undefined : { y: heroY, opacity: heroOpacity }} className="relative z-10 px-5 text-center">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="mb-5 text-[11px] uppercase tracking-[0.6em]"
            style={{ color: accent }}
          >
            {tagline}
          </motion.p>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 26, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.1, delay: 0.15, ease: EASE }}
            className="font-display text-[clamp(2.6rem,9vw,6.5rem)] leading-[1.02]"
          >
            {event.person1Name && event.person2Name ? (
              <>
                {event.person1Name}
                <span className="mx-3 inline-block sm:mx-5" style={{ color: accent }}>&amp;</span>
                {event.person2Name}
              </>
            ) : (
              event.eventTitle
            )}
          </motion.h1>
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 1 }}
            className="mt-7 flex flex-wrap items-center justify-center gap-3 text-xs uppercase tracking-[0.35em] opacity-80"
          >
            {event.mainDate && (
              <span>{new Date(event.mainDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</span>
            )}
            {event.city && <><span style={{ color: accent }}>✦</span><span>{event.city}</span></>}
          </motion.div>
        </motion.div>
        {!reduce && (
          <motion.div
            animate={{ y: [0, 9, 0], opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.45em]"
            style={{ color: INK }}
          >
            Descend to the isles
          </motion.div>
        )}
      </section>

      {showStory && (
        <section className="relative mx-auto max-w-2xl px-6 py-24 sm:py-32">
          <Island bob={1}>
            <p className="text-center text-[10px] uppercase tracking-[0.5em]" style={{ color: accent }}>The First Isle</p>
            <h2 className="mt-4 text-center font-display text-2xl leading-snug sm:text-3xl">{invitationMessage}</h2>
            <div className="mx-auto my-6 h-px w-24" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
            <p className="text-center text-base leading-relaxed opacity-80">{aboutStory}</p>
          </Island>
        </section>
      )}

      {showJourney && (
        <section className="relative py-16 sm:py-24">
          <p className="mb-12 text-center text-[10px] uppercase tracking-[0.5em]" style={{ color: accent }}>Cross the Bridges</p>
          <KingdomTimeline items={subEvents} accent={accent} />
        </section>
      )}

      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <p className="mb-12 text-center text-[10px] uppercase tracking-[0.5em]" style={{ color: accent }}>The Row of Castles</p>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {galleryItems.map((m, i) => (
              <Island key={`${m.fileName}-${i}`} delay={i * 0.06} bob={i % 5} className="group">
                <svg viewBox="0 0 100 12" aria-hidden className="mx-auto -mt-4 mb-3 block w-24" style={{ color: accent }}>
                  <path d="M10 12 V4 H18 V12 M30 12 V2 H38 V12 M46 12 V0 H54 V12 M62 12 V2 H70 V12 M82 12 V4 H90 V12" fill="none" stroke="currentColor" strokeWidth="3" />
                </svg>
                <div className="overflow-hidden rounded-xl">
                  <img
                    src={m.publicUrl}
                    alt={m.caption ?? ""}
                    className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                {m.caption && <p className="mt-3 text-center text-xs uppercase tracking-[0.2em] opacity-70">{m.caption}</p>}
              </Island>
            ))}
            {editing && galleryItems.length === 0 && (
              <div className="col-span-full flex h-48 items-center justify-center rounded-3xl border border-dashed text-sm opacity-60" style={{ borderColor: `${INK}55` }}>
                + Add photos
              </div>
            )}
          </div>
        </section>
      )}

      {showVenue && (
        <section className="relative mx-auto max-w-3xl px-6 py-20 sm:py-28">
          <p className="mb-12 text-center text-[10px] uppercase tracking-[0.5em]" style={{ color: accent }}>The Final Kingdom</p>
          <Island bob={2}>
            {event.venueName && <h3 className="text-center font-display text-3xl">{event.venueName}</h3>}
            {event.venueAddress && <p className="mt-2 text-center text-sm opacity-75">{event.venueAddress}</p>}
            <div className="mt-6 overflow-hidden rounded-2xl border" style={{ borderColor: `${GOLD}55` }}>
              <MapEmbed
                latitude={event.latitude}
                longitude={event.longitude}
                venueName={event.venueName}
                venueAddress={event.venueAddress}
                mapLink={event.mapLink}
              />
            </div>
          </Island>
        </section>
      )}

      <section className="relative px-6 py-24 text-center sm:py-36">
        <Island className="mx-auto max-w-xl" bob={3}>
          <p className="text-[10px] uppercase tracking-[0.5em]" style={{ color: accent }}>Take Flight With Us</p>
          <h2 className="mt-4 font-display text-3xl leading-snug sm:text-4xl">{event.eventTitle}</h2>
          {event.mainDate && (
            <p className="mt-3 text-sm uppercase tracking-[0.3em] opacity-75">
              {new Date(event.mainDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
          )}
          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <motion.a
              whileHover={reduce ? undefined : { scale: 1.04, y: -2 }}
              href={event.rsvpLinkOrContact}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-block rounded-full px-12 py-4 text-sm uppercase tracking-[0.3em]"
              style={{ background: accent, color: MARBLE, boxShadow: `0 14px 30px -10px ${INK}66` }}
            >
              RSVP now
            </motion.a>
          )}
        </Island>
      </section>

      <footer className="relative z-10 py-10 text-center text-xs opacity-60">
        <p>{event.eventTitle}{event.person1Name && event.person2Name ? ` · ${event.person1Name} & ${event.person2Name}` : ""}</p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default SkyrealmTemplate;
