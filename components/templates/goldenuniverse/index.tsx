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

const PLANETS = [
  { cx: "12%", cy: "22%", r: 90, depth: 0.35, ring: true, hueA: "#f5d97a", hueB: "#a67c1c", tilt: -18 },
  { cx: "82%", cy: "18%", r: 62, depth: 0.6, ring: false, hueA: "#ffe89d", hueB: "#8a5f10", tilt: 12 },
  { cx: "72%", cy: "68%", r: 128, depth: 0.2, ring: true, hueA: "#f2c34d", hueB: "#7a5510", tilt: 24 },
  { cx: "22%", cy: "78%", r: 48, depth: 0.75, ring: false, hueA: "#fff0c2", hueB: "#a67c1c", tilt: -6 },
  { cx: "50%", cy: "40%", r: 30, depth: 0.9, ring: false, hueA: "#ffe89d", hueB: "#6a4a10", tilt: 0 },
];

const STARS = Array.from({ length: 60 }, (_, i) => ({
  x: `${(i * 53 + 11) % 100}%`,
  y: `${(i * 37 + 7) % 100}%`,
  size: 1 + (i % 3) * 0.6,
  delay: (i % 12) * 0.25,
  dur: 2 + (i % 4) * 0.7,
}));

function CosmicField({ reduce }: { reduce: boolean }) {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 30% 10%, #14102a 0%, #0a0716 40%, #050508 100%)" }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 80% 90%, rgba(74,42,104,0.35), transparent 55%)" }} />
      {!reduce && (
        <div className="absolute inset-0">
          {STARS.map((s, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full"
              style={{ left: s.x, top: s.y, width: s.size, height: s.size, background: "#f5eddb", boxShadow: "0 0 4px #f2c34d" }}
              animate={{ opacity: [0.15, 0.9, 0.15] }}
              transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>
      )}
      <svg className="absolute inset-0 h-full w-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
        <filter id="au-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="2" />
        </filter>
        <rect width="100%" height="100%" filter="url(#au-noise)" />
      </svg>
    </div>
  );
}

function Spotlights({ reduce }: { reduce: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -left-[20%] -top-[20%] h-[140%] w-[70%] origin-top-left"
        style={{
          background: "linear-gradient(160deg, rgba(242,195,77,0.22), rgba(242,195,77,0) 60%)",
          filter: "blur(20px)",
          clipPath: "polygon(0 0, 100% 0, 60% 100%, 0 40%)",
        }}
        animate={reduce ? undefined : { rotate: [0, 4, 0], opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-[20%] -bottom-[20%] h-[140%] w-[70%] origin-bottom-right"
        style={{
          background: "linear-gradient(-20deg, rgba(255,232,157,0.18), rgba(255,232,157,0) 60%)",
          filter: "blur(20px)",
          clipPath: "polygon(100% 100%, 0 100%, 40% 0, 100% 60%)",
        }}
        animate={reduce ? undefined : { rotate: [0, -4, 0], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
    </div>
  );
}

function Planet({
  cx,
  cy,
  r,
  ring,
  hueA,
  hueB,
  tilt,
  depth,
  reduce,
  i,
}: {
  cx: string;
  cy: string;
  r: number;
  ring: boolean;
  hueA: string;
  hueB: string;
  tilt: number;
  depth: number;
  reduce: boolean;
  i: number;
}) {
  const size = r * 2;
  const bob = 8 + i * 3;
  return (
    <motion.div
      className="absolute"
      style={{ left: cx, top: cy, width: size, height: size, transform: "translate(-50%,-50%)", opacity: 0.7 + depth * 0.3 }}
      animate={reduce ? undefined : { y: [-bob, bob, -bob], x: [-bob / 2, bob / 2, -bob / 2] }}
      transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle at 32% 30%, ${hueA} 0%, ${hueB} 55%, #2a1a08 100%)`,
          boxShadow: `0 0 ${r * 0.6}px ${hueA}55, inset -${r * 0.25}px -${r * 0.25}px ${r * 0.4}px rgba(0,0,0,0.6)`,
        }}
      />
      {ring && (
        <div
          className="absolute left-1/2 top-1/2"
          style={{
            width: size * 1.9,
            height: size * 0.35,
            transform: `translate(-50%,-50%) rotate(${tilt}deg)`,
            borderRadius: "50%",
            border: `2px solid ${hueA}`,
            boxShadow: `0 0 24px ${hueA}66, inset 0 0 12px ${hueA}44`,
            opacity: 0.75,
          }}
        />
      )}
    </motion.div>
  );
}

function TrophyIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" aria-hidden>
      <defs>
        <linearGradient id="au-tro" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#ffe89d" />
          <stop offset="1" stopColor={color} />
        </linearGradient>
      </defs>
      <path d="M7 3h10v3a5 5 0 0 1-10 0V3Z" stroke="url(#au-tro)" strokeWidth="1.2" fill="url(#au-tro)" fillOpacity="0.15" />
      <path d="M7 5H4a2 2 0 0 0 2 3M17 5h3a2 2 0 0 1-2 3" stroke="url(#au-tro)" strokeWidth="1.2" />
      <path d="M10 12v3M14 12v3M8 18h8" stroke="url(#au-tro)" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function AwardCard({
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
      initial={reduce ? false : { opacity: 0, y: 24, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
      whileHover={reduce ? undefined : { y: -4, boxShadow: `0 0 40px ${accent}33` }}
      className="relative overflow-hidden rounded-2xl border border-[#f2c34d]/20 p-6 backdrop-blur-md"
      style={{ background: "linear-gradient(160deg, rgba(242,195,77,0.06), rgba(10,7,22,0.6))" }}
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full" style={{ background: `radial-gradient(circle, ${accent}22, transparent 70%)` }} />
      <div className="relative">
        <div className="mb-4 flex items-center gap-3">
          <TrophyIcon color="#a67c1c" />
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#f5eddb]/50">Category {String(s.order).padStart(2, "0")}</span>
        </div>
        <h3
          className="font-display text-2xl font-semibold tracking-tight"
          style={{
            background: "linear-gradient(120deg, #fff0c2 0%, #f2c34d 45%, #a67c1c 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {s.name}
        </h3>
        {(s.date || s.startTime) && (
          <p className="mt-2 text-[11px] uppercase tracking-[0.3em] text-[#f5eddb]/50">
            {[s.date, s.startTime].filter(Boolean).join(" · ")}
          </p>
        )}
        {s.venueName && <p className="mt-2 text-sm text-[#f5eddb]/70">@ {s.venueName}</p>}
        {s.description && <p className="mt-3 text-sm leading-relaxed text-[#f5eddb]/60">{s.description}</p>}
        {s.dressCode && (
          <p className="mt-4 inline-block rounded-full border border-[#f2c34d]/30 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-[#f2c34d]/80">
            {s.dressCode}
          </p>
        )}
      </div>
    </motion.article>
  );
}

export const GoldenuniverseTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || "#f2c34d";
  const tagline = event.tagline?.trim() || "A cosmic evening of honor";
  const invitationMessage =
    event.invitationMessage?.trim() ||
    "Among galaxies of achievement, tonight we gather where light bends toward brilliance. Every award a planet, every honoree a star.";
  const aboutStory = event.aboutStory?.trim() || "";
  const hero =
    event.heroImageUrl ||
    "https://images.unsplash.com/photo-1465101162946-4377e57745c3?auto=format&fit=crop&w=1800&q=80";

  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroP, [0, 1], [0, -80]);
  const heroOpacity = useTransform(heroP, [0, 0.7], [1, 0]);

  const showStory = !event.hideStory;
  const showJourney = !event.hideEvents && subEvents.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  const goldText = {
    background: "linear-gradient(120deg, #fff0c2 0%, #f2c34d 40%, #a67c1c 100%)",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
  } as React.CSSProperties;

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-sans text-[#f5eddb] antialiased"
      style={{ "--accent": accent, background: "#050508" } as React.CSSProperties}
    >
      <CosmicField reduce={reduce} />
      <ScrollProgress color={accent} />

      {/* HERO */}
      <section
        ref={heroRef}
        className="relative flex min-h-[100svh] items-center justify-center overflow-hidden pb-24 sm:pb-28"
      >
        <div className="absolute inset-0 opacity-30">
          <HeroMedia imageSrc={hero} videoSrc={event.heroVideoUrl || undefined} alt={event.eventTitle} className="opacity-60" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(5,5,8,0.4) 0%, rgba(5,5,8,0.85) 100%)" }} />
        </div>

        <Spotlights reduce={reduce} />

        <div className="pointer-events-none absolute inset-0">
          {PLANETS.map((p, i) => (
            <Planet key={i} {...p} reduce={reduce} i={i} />
          ))}
        </div>

        <motion.div style={reduce ? undefined : { y: heroY, opacity: heroOpacity }} className="relative z-10 px-6 text-center">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE }}
            className="mb-6 text-[11px] uppercase tracking-[0.6em]"
            style={{ color: "#f2c34d", textShadow: "0 0 24px rgba(242,195,77,0.55)" }}
          >
            {tagline}
          </motion.p>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.2, delay: 0.2, ease: EASE }}
            className="font-display text-[clamp(3rem,10vw,7.5rem)] font-semibold leading-[0.95] tracking-tight"
            style={goldText}
          >
            {event.eventTitle}
          </motion.h1>
          {(event.person1Name || event.person2Name) && (
            <motion.p
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="mt-6 font-display text-lg tracking-[0.3em] text-[#f5eddb]/80 sm:text-xl"
            >
              {[event.person1Name, event.person2Name].filter(Boolean).join(" · ")}
            </motion.p>
          )}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.9 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4 text-[11px] uppercase tracking-[0.4em] text-[#f5eddb]/70"
          >
            {event.mainDate && (
              <span>
                {new Date(event.mainDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              </span>
            )}
            {event.mainStartTime && <span className="text-[#f2c34d]/60">✦</span>}
            {event.mainStartTime && <span>{event.mainStartTime}</span>}
            {event.city && (
              <>
                <span className="text-[#f2c34d]/60">✦</span>
                <span>{event.city}</span>
              </>
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* STORY */}
      {showStory && (
        <section className="relative mx-auto max-w-5xl px-6 py-28 sm:py-36">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-6 text-center text-[10px] uppercase tracking-[0.55em]"
            style={{ color: accent }}
          >
            The Invitation
          </motion.p>
          <motion.h2
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: EASE }}
            className="mx-auto max-w-3xl text-center font-display text-2xl leading-[1.4] sm:text-3xl"
            style={goldText}
          >
            {invitationMessage}
          </motion.h2>
          {aboutStory && (
            <motion.p
              initial={reduce ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
              className="mx-auto mt-8 max-w-2xl text-center text-base leading-relaxed text-[#f5eddb]/65 sm:text-lg"
            >
              {aboutStory}
            </motion.p>
          )}
          <motion.div
            className="mx-auto mt-10 h-px w-40"
            style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
            animate={reduce ? undefined : { opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </section>
      )}

      {/* AWARD CATEGORIES / SUB-EVENTS */}
      {showJourney && (
        <section className="relative mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-4 text-center text-[10px] uppercase tracking-[0.55em]"
            style={{ color: accent }}
          >
            The Constellation
          </motion.p>
          <h2 className="mb-14 text-center font-display text-3xl tracking-tight sm:text-4xl" style={goldText}>
            Categories of Honor
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...subEvents]
              .sort((a, b) => a.order - b.order)
              .map((s, i) => (
                <AwardCard key={s.order} s={s} i={i} accent={accent} />
              ))}
          </div>
        </section>
      )}

      {/* GALLERY */}
      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-4 text-center text-[10px] uppercase tracking-[0.55em]"
            style={{ color: accent }}
          >
            Moments in Orbit
          </motion.p>
          <h2 className="mb-12 text-center font-display text-3xl tracking-tight sm:text-4xl" style={goldText}>
            The Gallery
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((m, i) => (
              <motion.div
                key={`${m.fileName}-${i}`}
                initial={reduce ? false : { opacity: 0, scale: 0.94 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.05, ease: EASE }}
                whileHover={reduce ? undefined : { y: -4 }}
                className="group relative overflow-hidden rounded-2xl border border-[#f2c34d]/15"
              >
                <img
                  src={m.publicUrl}
                  alt={m.caption ?? ""}
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover transition-transform duration-[900ms] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050508]/80 via-transparent to-transparent opacity-70 transition-opacity group-hover:opacity-40" />
                {m.caption && (
                  <p className="absolute bottom-3 left-4 right-4 text-xs uppercase tracking-[0.3em] text-[#f5eddb]/90">{m.caption}</p>
                )}
              </motion.div>
            ))}
            {editing && galleryItems.length === 0 && (
              <div className="col-span-full flex h-56 items-center justify-center rounded-2xl border border-dashed border-[#f2c34d]/30 text-sm text-[#f5eddb]/50">
                + Add photos
              </div>
            )}
          </div>
        </section>
      )}

      {/* VENUE */}
      {showVenue && (
        <section className="relative mx-auto max-w-5xl px-6 py-20 sm:py-28">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-4 text-center text-[10px] uppercase tracking-[0.55em]"
            style={{ color: accent }}
          >
            The Coordinates
          </motion.p>
          <h2 className="mb-10 text-center font-display text-3xl tracking-tight sm:text-4xl" style={goldText}>
            {event.venueName || "The Venue"}
          </h2>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE }}
            className="overflow-hidden rounded-2xl border border-[#f2c34d]/20 bg-[#0a0716]/60 p-1 backdrop-blur-md"
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

      {/* COSMIC THEATER / CTA */}
      <section className="relative overflow-hidden px-6 py-32 text-center sm:py-44">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%]">
          <div
            className="absolute inset-x-[-10%] bottom-[-40%] h-[120%]"
            style={{
              background: "radial-gradient(ellipse at 50% 0%, rgba(242,195,77,0.18) 0%, rgba(242,195,77,0.05) 30%, transparent 60%)",
              borderTopLeftRadius: "50%",
              borderTopRightRadius: "50%",
              border: "1px solid rgba(242,195,77,0.2)",
            }}
          />
          <div
            className="absolute inset-x-[5%] bottom-[-20%] h-[80%]"
            style={{
              background: "linear-gradient(180deg, transparent 0%, rgba(74,42,104,0.25) 60%, rgba(5,5,8,0.9) 100%)",
              borderTopLeftRadius: "50%",
              borderTopRightRadius: "50%",
              border: "1px solid rgba(242,195,77,0.15)",
            }}
          />
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.85, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: EASE }}
          className="relative mx-auto mb-12 h-32 w-32 sm:h-40 sm:w-40"
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: "radial-gradient(circle at 30% 30%, #fff0c2 0%, #f2c34d 45%, #6a4a10 100%)",
              boxShadow: "0 0 80px rgba(242,195,77,0.6), inset -20px -20px 40px rgba(0,0,0,0.5)",
            }}
          />
          {!reduce && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ boxShadow: "0 0 100px rgba(242,195,77,0.4)" }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
        </motion.div>

        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE }}
          className="relative mx-auto max-w-3xl font-display text-[clamp(2.25rem,6vw,4.5rem)] leading-[1.05] tracking-tight"
          style={goldText}
        >
          {event.eventTitle}
        </motion.h2>

        {event.mainDate && (
          <p className="relative mt-6 text-sm uppercase tracking-[0.45em] text-[#f5eddb]/70">
            {new Date(event.mainDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        )}

        {event.rsvpEnabled && event.rsvpLinkOrContact && (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.3 }}
            whileHover={reduce ? undefined : { scale: 1.04 }}
            className="relative mt-12 inline-block"
          >
            <a
              href={event.rsvpLinkOrContact}
              target="_blank"
              rel="noreferrer"
              className="inline-block rounded-full px-12 py-4 text-xs uppercase tracking-[0.4em]"
              style={{
                background: "linear-gradient(120deg, #fff0c2 0%, #f2c34d 45%, #a67c1c 100%)",
                color: "#1a1206",
                boxShadow: "0 0 40px rgba(242,195,77,0.45)",
              }}
            >
              Reserve your place
            </a>
          </motion.div>
        )}
      </section>

      <footer className="relative border-t border-[#f2c34d]/15 py-8 text-center text-xs uppercase tracking-[0.35em] text-[#f5eddb]/40">
        <p>{event.eventTitle}{event.person1Name ? ` · ${event.person1Name}` : ""}</p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default GoldenuniverseTemplate;
