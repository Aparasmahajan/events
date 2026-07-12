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
const SPACE = "#0d0a1e";
const CRIMSON = "#6e1424";
const GOLD = "#d8a848";
const IVORY = "#f8f2e6";
const VIOLET = "#8a5ab8";
const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

const STARS = Array.from({ length: 60 }, (_, i) => ({
  x: `${(i * 37 + 11) % 100}%`,
  y: `${(i * 53 + 23) % 100}%`,
  size: 1 + (i % 3) * 0.7,
  delay: (i % 8) * 0.4,
  dur: 2 + (i % 4) * 0.8,
}));

const CURTAIN_FOLDS = `repeating-linear-gradient(90deg, ${CRIMSON} 0px, #4a0d19 26px, #8a1c30 52px, ${CRIMSON} 78px)`;

function StarField({ reduce }: { reduce: boolean }) {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden" style={{ background: SPACE }}>
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 70% 50% at 50% 30%, ${VIOLET}22, transparent 65%), radial-gradient(ellipse 50% 40% at 80% 80%, ${CRIMSON}33, transparent 70%)` }} />
      {STARS.map((s, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{ left: s.x, top: s.y, width: s.size, height: s.size, background: IVORY }}
          animate={reduce ? undefined : { opacity: [0.15, 0.9, 0.15] }}
          transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function ChandelierPlanet({ reduce }: { reduce: boolean }) {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-0 z-20 origin-top -translate-x-1/2"
      animate={reduce ? undefined : { rotate: [-3, 3, -3] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg width="120" height="190" viewBox="0 0 120 190" fill="none">
        <line x1="60" y1="0" x2="60" y2="86" stroke={GOLD} strokeWidth="1" opacity="0.7" />
        <circle cx="60" cy="122" r="30" fill={`url(#gp-glow)`} />
        <circle cx="60" cy="122" r="30" fill="none" stroke={GOLD} strokeWidth="1.5" />
        <ellipse cx="60" cy="122" rx="52" ry="13" fill="none" stroke={GOLD} strokeWidth="1.5" opacity="0.85" />
        <ellipse cx="60" cy="122" rx="44" ry="10" fill="none" stroke={IVORY} strokeWidth="0.6" opacity="0.4" />
        {[24, 60, 96].map((x) => (
          <circle key={x} cx={x} cy="164" r="2.5" fill={GOLD} opacity="0.9" />
        ))}
        <defs>
          <radialGradient id="gp-glow" cx="0.35" cy="0.3" r="1">
            <stop offset="0%" stopColor={GOLD} stopOpacity="0.9" />
            <stop offset="60%" stopColor={VIOLET} stopOpacity="0.5" />
            <stop offset="100%" stopColor={SPACE} />
          </radialGradient>
        </defs>
      </svg>
    </motion.div>
  );
}

function Curtain({ side, reduce }: { side: "left" | "right"; reduce: boolean }) {
  return (
    <motion.div
      aria-hidden
      className="absolute inset-y-0 z-10 w-[58%]"
      style={{
        [side]: 0,
        background: CURTAIN_FOLDS,
        boxShadow: `inset 0 -60px 80px ${SPACE}aa`,
        borderRadius: side === "left" ? "0 45% 45% 0 / 0 30% 30% 0" : "45% 0 0 45% / 30% 0 0 30%",
      }}
      initial={reduce ? { x: side === "left" ? "-96%" : "96%" } : false}
      animate={{ x: side === "left" ? "-96%" : "96%" }}
      transition={{ duration: 2.2, delay: 0.6, ease: EASE }}
    >
      <div
        className="absolute inset-y-0 w-3"
        style={{ [side === "left" ? "right" : "left"]: 0, background: `linear-gradient(180deg, ${GOLD}, #a87c2c, ${GOLD})` }}
      />
    </motion.div>
  );
}

function ActCard({ s, i, count }: { s: SubEvent; i: number; count: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.7, delay: (i % 2) * 0.1, ease: EASE }}
      className={`relative px-7 pb-7 pt-12 text-center ${i === count - 1 && count % 2 === 1 ? "sm:col-span-2 sm:mx-auto sm:w-full sm:max-w-md" : ""}`}
      style={{
        border: `1.5px solid ${GOLD}88`,
        borderRadius: "10rem 10rem 0.75rem 0.75rem",
        background: `linear-gradient(180deg, ${CRIMSON}30, ${SPACE}cc)`,
        boxShadow: `inset 0 0 40px ${SPACE}`,
      }}
    >
      <div aria-hidden className="absolute inset-x-6 top-3 h-px" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />
      <p className="font-display text-xs tracking-[0.5em]" style={{ color: GOLD }}>
        {"ACT " + (ROMAN[i] ?? String(i + 1))}
      </p>
      <h3 className="font-display mt-3 text-2xl" style={{ color: IVORY }}>{s.name}</h3>
      <p className="mt-2 text-[11px] uppercase tracking-[0.3em] opacity-60">
        {[s.date, s.startTime].filter(Boolean).join(" · ")}
      </p>
      {s.venueName && <p className="mt-2 text-sm opacity-70">{s.venueName}</p>}
      {s.description && <p className="mt-3 text-sm leading-relaxed opacity-60">{s.description}</p>}
      {s.dressCode && (
        <p className="mt-4 inline-block px-4 py-1 text-[10px] uppercase tracking-[0.25em]" style={{ border: `1px solid ${GOLD}66`, color: GOLD, borderRadius: "9999px" }}>
          {s.dressCode}
        </p>
      )}
    </motion.article>
  );
}

function Marquee({ children, accent }: { children: React.ReactNode; accent: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.p
      initial={reduce ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="mb-12 text-center font-display text-xs uppercase tracking-[0.6em]"
      style={{ color: accent }}
    >
      {children}
    </motion.p>
  );
}

export const GalaxyoperaTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || GOLD;
  const tagline = event.tagline?.trim() || "A love story, staged among the stars";
  const invitationMessage = event.invitationMessage?.trim() || "The house lights dim, the curtains part, and two names share one marquee. Take your seat in the cosmos — the overture of our forever begins.";
  const aboutStory = event.aboutStory?.trim() || "Every great opera begins with two voices finding the same key. Ours met in an ordinary scene and turned it into a libretto — and now the finale becomes an opening night.";
  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const hero = event.heroImageUrl || "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80";
  const sortedActs = useMemo(() => [...subEvents].sort((a, b) => a.order - b.order), [subEvents]);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroTextY = useTransform(heroP, [0, 0.5], [0, -60]);
  const heroOpacity = useTransform(heroP, [0, 0.5], [1, 0]);

  const showStory = !event.hideStory;
  const showActs = !event.hideEvents && subEvents.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  const names = [event.person1Name, event.person2Name].filter(Boolean).join(" & ");

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-sans antialiased"
      style={{ "--accent": accent, background: SPACE, color: IVORY } as React.CSSProperties}
    >
      <StarField reduce={reduce} />
      <ScrollProgress color={accent} />

      <section ref={heroRef} className="relative flex h-[100svh] min-h-[640px] items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <HeroMedia imageSrc={hero} videoSrc={event.heroVideoUrl || undefined} alt={event.eventTitle} className="opacity-40" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${SPACE}cc, transparent 40%, ${SPACE})` }} />
        </div>
        <Curtain side="left" reduce={reduce} />
        <Curtain side="right" reduce={reduce} />
        <ChandelierPlanet reduce={reduce} />

        <motion.div style={reduce ? undefined : { y: heroTextY, opacity: heroOpacity }} className="relative z-[5] px-5 pt-24 text-center">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 1 }}
            className="font-display mb-5 text-[11px] uppercase tracking-[0.7em]"
            style={{ color: accent }}
          >
            Opera Celeste presents
          </motion.p>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1.7, duration: 1.1, ease: EASE }}
            className="font-display text-[clamp(2.6rem,9vw,7rem)] leading-[1.02]"
            style={{ color: IVORY, textShadow: `0 0 50px ${VIOLET}99` }}
          >
            {event.eventTitle}
          </motion.h1>
          {names && (
            <motion.p
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2, duration: 1 }}
              className="font-display mt-5 text-lg tracking-[0.25em] sm:text-2xl"
              style={{ color: accent }}
            >
              {names}
            </motion.p>
          )}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5, duration: 0.9 }}
            className="mt-7 flex flex-wrap items-center justify-center gap-3 text-[11px] uppercase tracking-[0.4em] opacity-80"
          >
            <span aria-hidden style={{ color: accent }}>&#9670;</span>
            <span>{tagline}</span>
            <span aria-hidden style={{ color: accent }}>&#9670;</span>
          </motion.div>
          {event.mainDate && (
            <motion.p
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.8, duration: 0.9 }}
              className="mt-4 text-xs uppercase tracking-[0.35em] opacity-70"
            >
              {new Date(event.mainDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              {event.mainStartTime ? ` · Curtain ${event.mainStartTime}` : ""}
              {event.city ? ` · ${event.city}` : ""}
            </motion.p>
          )}
        </motion.div>
      </section>

      {showStory && (
        <section className="relative mx-auto max-w-3xl px-6 py-24 text-center sm:py-32">
          <Marquee accent={accent}>The Libretto</Marquee>
          <motion.blockquote
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE }}
            className="font-display text-2xl leading-snug sm:text-3xl"
            style={{ color: IVORY }}
          >
            &ldquo;{invitationMessage}&rdquo;
          </motion.blockquote>
          <motion.div
            aria-hidden
            className="mx-auto my-8 h-px w-40"
            style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
            initial={reduce ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: EASE }}
          />
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-base leading-relaxed opacity-70 sm:text-lg"
          >
            {aboutStory}
          </motion.p>
        </section>
      )}

      {showActs && (
        <section className="relative mx-auto max-w-4xl px-6 py-20 sm:py-28">
          <Marquee accent={accent}>The Programme</Marquee>
          <div className="grid gap-8 sm:grid-cols-2">
            {sortedActs.map((s, i) => (
              <ActCard key={s.order} s={s} i={i} count={sortedActs.length} />
            ))}
          </div>
        </section>
      )}

      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <Marquee accent={accent}>From the Box Seats</Marquee>
          <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((m, i) => (
              <motion.figure
                key={`${m.fileName}-${i}`}
                initial={reduce ? false : { opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: EASE }}
                className={i % 3 === 1 ? "lg:mt-10" : ""}
              >
                <div className="overflow-hidden" style={{ borderRadius: "5rem 5rem 0.5rem 0.5rem", border: `1px solid ${GOLD}55` }}>
                  <img src={m.publicUrl} alt={m.caption ?? ""} className="aspect-[4/5] w-full object-cover transition-transform duration-700 hover:scale-105" loading="lazy" />
                </div>
                <div aria-hidden className="mx-auto mt-2 h-2 w-[86%] rounded-full" style={{ background: `linear-gradient(180deg, ${GOLD}, #7a5a1e)`, boxShadow: `0 4px 12px ${SPACE}` }} />
                {m.caption && <figcaption className="mt-3 text-center text-xs uppercase tracking-[0.25em] opacity-60">{m.caption}</figcaption>}
              </motion.figure>
            ))}
            {editing && galleryItems.length === 0 && (
              <div className="col-span-full flex h-48 items-center justify-center text-sm opacity-60" style={{ border: `1px dashed ${GOLD}66`, borderRadius: "1rem" }}>
                + Add photos
              </div>
            )}
          </div>
        </section>
      )}

      {showVenue && (
        <section className="relative mx-auto max-w-5xl px-6 py-20 sm:py-28">
          <Marquee accent={accent}>The House</Marquee>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="overflow-hidden p-1"
            style={{ border: `1.5px solid ${GOLD}77`, borderRadius: "1rem", background: `${CRIMSON}22` }}
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
          initial={reduce ? false : { opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE }}
          className="mx-auto max-w-2xl"
        >
          <p className="font-display text-xs uppercase tracking-[0.6em]" style={{ color: accent }}>Encore</p>
          <h2 className="font-display mt-5 text-[clamp(2rem,6vw,4rem)] leading-tight" style={{ color: IVORY }}>
            {names || event.eventTitle}
          </h2>
          <p className="mt-4 text-sm uppercase tracking-[0.35em] opacity-70">Your applause completes the score</p>
          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <motion.div whileHover={reduce ? undefined : { scale: 1.04 }} className="mt-10 inline-block">
              <a
                href={event.rsvpLinkOrContact}
                target="_blank"
                rel="noreferrer"
                className="font-display inline-block px-12 py-4 text-sm uppercase tracking-[0.35em] transition-all"
                style={{ background: `linear-gradient(180deg, ${GOLD}, #b0852f)`, color: SPACE, borderRadius: "9999px", boxShadow: `0 0 40px ${GOLD}44` }}
              >
                Reserve your box
              </a>
            </motion.div>
          )}
        </motion.div>
      </section>

      <footer className="py-8 text-center text-xs opacity-50" style={{ borderTop: `1px solid ${GOLD}33` }}>
        <p>{event.eventTitle}{names ? ` · ${names}` : ""} · Opera Celeste</p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default GalaxyoperaTemplate;
