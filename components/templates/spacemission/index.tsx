"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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

const NAVY = "#0a1936";
const NAVY_2 = "#1e3466";
const WHITE = "#f7f4ec";
const ORANGE = "#f7621b";
const YELLOW = "#ffcc00";
const HUD = "#3fe07f";

const STARS = Array.from({ length: 50 }, (_, i) => ({
  x: `${(i * 37 + 11) % 100}%`,
  y: `${(i * 53 + 17) % 100}%`,
  size: 0.8 + ((i * 7) % 5) * 0.4,
  delay: (i % 8) * 0.35,
  dur: 2.4 + ((i * 3) % 5) * 0.4,
}));

const PLANET_PALETTE = [
  { body: "#f7621b", ring: false },
  { body: "#3fe07f", ring: true },
  { body: "#ffcc00", ring: false },
  { body: "#7ab8ff", ring: true },
  { body: "#c86aff", ring: false },
  { body: "#ff5a8a", ring: true },
];

function Starfield({ reduce }: { reduce: boolean }) {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden" style={{ background: `linear-gradient(180deg, ${NAVY} 0%, ${NAVY_2} 60%, ${NAVY} 100%)` }}>
      {STARS.map((s, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{ left: s.x, top: s.y, width: s.size, height: s.size, background: WHITE, boxShadow: `0 0 ${s.size * 3}px ${WHITE}` }}
          animate={reduce ? undefined : { opacity: [0.15, 1, 0.15] }}
          transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 120%, ${ORANGE}22, transparent 60%)` }} />
    </div>
  );
}

function HudFrame({ readout }: { readout: string }) {
  const bracket = "absolute h-6 w-6 border-2";
  return (
    <div aria-hidden className="pointer-events-none fixed inset-4 z-30 sm:inset-6">
      <div className="absolute inset-0 rounded-2xl border" style={{ borderColor: `${HUD}55` }} />
      <span className={`${bracket} left-0 top-0 border-b-0 border-r-0`} style={{ borderColor: HUD }} />
      <span className={`${bracket} right-0 top-0 border-b-0 border-l-0`} style={{ borderColor: HUD }} />
      <span className={`${bracket} bottom-0 left-0 border-t-0 border-r-0`} style={{ borderColor: HUD }} />
      <span className={`${bracket} bottom-0 right-0 border-t-0 border-l-0`} style={{ borderColor: HUD }} />
      <div className="absolute left-3 top-1/2 flex -translate-y-1/2 flex-col gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="block h-px w-3" style={{ background: `${HUD}88` }} />
        ))}
      </div>
      <div className="absolute right-3 top-1/2 flex -translate-y-1/2 flex-col gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="block h-px w-3" style={{ background: `${HUD}88` }} />
        ))}
      </div>
      <div className="absolute left-4 top-3 font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: HUD }}>
        SYS.OK
      </div>
      <div className="absolute right-4 top-3 font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: HUD }}>
        {readout}
      </div>
      <div className="absolute bottom-3 left-4 font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: YELLOW }}>
        NAV.LOCK
      </div>
      <div className="absolute bottom-3 right-4 font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: HUD }}>
        BAY.03
      </div>
    </div>
  );
}

function Planet({ order, name, subEvent, accent }: { order: number; name: string; subEvent: SubEvent; accent: string }) {
  const p = PLANET_PALETTE[(order - 1) % PLANET_PALETTE.length];
  const reduce = useReducedMotion();
  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.7, delay: (order - 1) * 0.08, ease: EASE }}
      className="relative rounded-2xl border p-6 backdrop-blur-md"
      style={{ borderColor: `${HUD}22`, background: `${NAVY}cc` }}
    >
      <div className="flex items-start gap-4">
        <svg width="72" height="72" viewBox="0 0 72 72" className="shrink-0">
          <defs>
            <radialGradient id={`pl-${order}`} cx="35%" cy="35%">
              <stop offset="0%" stopColor={WHITE} stopOpacity="0.8" />
              <stop offset="45%" stopColor={p.body} />
              <stop offset="100%" stopColor="#000" />
            </radialGradient>
          </defs>
          {p.ring && (
            <ellipse cx="36" cy="36" rx="34" ry="10" fill="none" stroke={p.body} strokeOpacity="0.6" strokeWidth="1.5" transform="rotate(-18 36 36)" />
          )}
          <circle cx="36" cy="36" r="22" fill={`url(#pl-${order})`} />
          {p.ring && (
            <ellipse cx="36" cy="36" rx="34" ry="10" fill="none" stroke={p.body} strokeWidth="1.5" strokeDasharray="2 3" transform="rotate(-18 36 36)" />
          )}
        </svg>
        <div className="flex-1">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: HUD }}>
            <span>PLANET {String(order).padStart(2, "0")}</span>
            <span className="opacity-40">/</span>
            <span style={{ color: YELLOW }}>{[subEvent.date, subEvent.startTime].filter(Boolean).join(" · ") || "TBD"}</span>
          </div>
          <h3 className="mt-2 font-display text-xl uppercase tracking-tight" style={{ color: WHITE }}>{name}</h3>
          {subEvent.venueName && <p className="mt-1 text-sm opacity-70" style={{ color: WHITE }}>Docking bay: {subEvent.venueName}</p>}
          {subEvent.description && <p className="mt-2 text-sm leading-relaxed opacity-60" style={{ color: WHITE }}>{subEvent.description}</p>}
          {subEvent.dressCode && (
            <p className="mt-3 inline-block rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em]" style={{ borderColor: accent, color: accent }}>
              SUIT: {subEvent.dressCode}
            </p>
          )}
        </div>
      </div>
    </motion.article>
  );
}

function PlanetOrbit({ items, accent }: { items: SubEvent[]; accent: string }) {
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <div className="relative mx-auto max-w-5xl px-6">
      <svg aria-hidden className="absolute inset-x-0 -top-4 mx-auto h-12 w-full opacity-40" viewBox="0 0 800 60" preserveAspectRatio="none">
        <path d="M0 40 Q 200 0 400 30 T 800 20" fill="none" stroke={HUD} strokeWidth="1" strokeDasharray="4 6" />
      </svg>
      <div className="grid gap-5 sm:grid-cols-2">
        {sorted.map((s) => (
          <Planet key={s.order} order={s.order} name={s.name} subEvent={s} accent={accent} />
        ))}
      </div>
    </div>
  );
}

function Rocket({ launching, reduce }: { launching: boolean; reduce: boolean }) {
  return (
    <motion.div
      aria-hidden
      className="relative mx-auto h-56 w-24"
      animate={reduce || launching ? undefined : { x: [0, -1, 1, -1, 0] }}
      transition={{ duration: 0.15, repeat: Infinity }}
    >
      <motion.div
        className="absolute inset-0"
        animate={reduce ? undefined : launching ? { y: -300 } : { y: 0 }}
        transition={{ duration: 1.6, ease: [0.5, 0, 0.75, 0] }}
      >
        <svg viewBox="0 0 100 200" className="h-full w-full">
          <path d="M50 8 C 62 30 68 60 68 100 L 68 150 L 32 150 L 32 100 C 32 60 38 30 50 8 Z" fill={WHITE} stroke={NAVY} strokeWidth="2" />
          <path d="M32 120 L 12 155 L 32 150 Z" fill={ORANGE} />
          <path d="M68 120 L 88 155 L 68 150 Z" fill={ORANGE} />
          <circle cx="50" cy="80" r="10" fill={HUD} stroke={NAVY} strokeWidth="2" />
          <circle cx="50" cy="80" r="5" fill={NAVY} />
          <rect x="42" y="150" width="16" height="10" fill={NAVY} />
        </svg>
      </motion.div>
      <motion.div
        className="absolute left-1/2 top-[150px] -translate-x-1/2"
        animate={reduce ? undefined : launching ? { height: [10, 200, 240], opacity: [0.6, 1, 0.9] } : { height: [8, 14, 8], opacity: [0.6, 0.9, 0.6] }}
        transition={launching ? { duration: 1.6, ease: "easeOut" } : { duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ width: 28 }}
      >
        <div className="h-full w-full rounded-b-full" style={{ background: `linear-gradient(180deg, ${YELLOW}, ${ORANGE} 45%, transparent)` }} />
      </motion.div>
    </motion.div>
  );
}

export const SpacemissionTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;
  const [tick, setTick] = useState(180);
  const [launching, setLaunching] = useState(false);

  const accent = event.themeAccentColor || ORANGE;
  const tagline = event.tagline?.trim() || "All systems go, commander.";
  const invitationMessage = event.invitationMessage?.trim() || "You are cleared for launch. Coordinates locked. Bring your crew — this mission only flies once.";
  const aboutStory = event.aboutStory?.trim() || "";
  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const hero = event.heroImageUrl || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80";

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setTick((t) => (t <= 0 ? 180 : t - 1)), 1000);
    return () => clearInterval(id);
  }, [reduce]);

  const mm = String(Math.floor(tick / 60)).padStart(2, "0");
  const ss = String(tick % 60).padStart(2, "0");

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(heroP, [0, 1], [1, 0.94]);
  const heroTextY = useTransform(heroP, [0, 0.5], [0, -60]);
  const heroOpacity = useTransform(heroP, [0, 0.5], [1, 0]);

  const showStory = !event.hideStory;
  const showMission = !event.hideEvents && subEvents.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-sans antialiased"
      style={{ "--accent": accent, background: NAVY, color: WHITE } as React.CSSProperties}
    >
      <Starfield reduce={reduce} />
      <HudFrame readout={`T-MINUS ${mm}:${ss}`} />
      <ScrollProgress color={accent} />

      {/* 01. LAUNCH BRIEFING */}
      <section ref={heroRef} className="relative flex min-h-[720px] items-center justify-center overflow-hidden py-24">
        <motion.div style={reduce ? undefined : { scale: heroScale }} className="absolute inset-0">
          <HeroMedia imageSrc={hero} videoSrc={event.heroVideoUrl || undefined} alt={event.eventTitle} className="opacity-45" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${NAVY}dd 0%, ${NAVY}66 40%, ${NAVY} 100%)` }} />
        </motion.div>

        <motion.div style={reduce ? undefined : { y: heroTextY, opacity: heroOpacity }} className="relative z-10 px-8 text-center">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4 font-mono text-[11px] uppercase tracking-[0.5em]"
            style={{ color: HUD }}
          >
            MISSION BRIEFING // {tagline}
          </motion.p>
          <h1 className="font-display text-[clamp(3rem,11vw,8rem)] font-black uppercase leading-[0.9] tracking-tight" style={{ color: WHITE, textShadow: `0 0 40px ${accent}66` }}>
            {event.eventTitle}
          </h1>
          {event.person1Name && (
            <p className="mt-4 font-mono text-xs uppercase tracking-[0.4em]" style={{ color: YELLOW }}>
              COMMANDER: {event.person1Name}
            </p>
          )}
          <div className="mx-auto mt-8 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "STARDATE", value: event.mainDate ? new Date(event.mainDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "TBD" },
              { label: "LIFTOFF", value: event.mainStartTime || "T-00:00" },
              { label: "SECTOR", value: event.city || "EARTH" },
              { label: "STATUS", value: "CLEARED" },
            ].map((r) => (
              <div key={r.label} className="rounded-lg border px-3 py-2 backdrop-blur-md" style={{ borderColor: `${HUD}55`, background: `${NAVY}aa` }}>
                <p className="font-mono text-[9px] uppercase tracking-[0.3em]" style={{ color: HUD }}>{r.label}</p>
                <p className="mt-1 font-mono text-xs uppercase tracking-[0.15em]" style={{ color: WHITE }}>{r.value}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 02. TRANSMISSION */}
      {showStory && (
        <section className="relative mx-auto max-w-5xl px-8 py-28">
          <div className="grid items-center gap-12 sm:grid-cols-2">
            <motion.div
              initial={reduce ? false : { opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.5em]" style={{ color: HUD }}>
                &gt; TRANSMISSION.LOG
              </p>
              <h2 className="font-display text-3xl uppercase leading-[1.05] tracking-tight sm:text-4xl" style={{ color: WHITE }}>
                {invitationMessage}
              </h2>
            </motion.div>
            <motion.div
              initial={reduce ? false : { opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
              className="rounded-2xl border p-6 backdrop-blur-md"
              style={{ borderColor: `${HUD}33`, background: `${NAVY_2}88` }}
            >
              <p className="text-base leading-relaxed opacity-80" style={{ color: WHITE }}>
                {aboutStory || "Every commander needs a crew. This is yours — the ones who show up, strap in, and orbit the sun with you one more time around."}
              </p>
              <div className="mt-5 flex gap-1">
                {Array.from({ length: 12 }).map((_, i) => (
                  <span key={i} className="h-1 flex-1 rounded-full" style={{ background: i < 8 ? HUD : `${HUD}22` }} />
                ))}
              </div>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: HUD }}>FUEL 80% / OXYGEN OK</p>
            </motion.div>
          </div>
        </section>
      )}

      {/* 03. MISSION PLAN / PLANETS */}
      {showMission && (
        <section className="relative py-24">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-14 text-center font-mono text-[10px] uppercase tracking-[0.5em]"
            style={{ color: HUD }}
          >
            NAV.CHART // PLANETS TO VISIT
          </motion.p>
          <PlanetOrbit items={subEvents} accent={accent} />
        </section>
      )}

      {/* 04. FLIGHT RECORDER / GALLERY */}
      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-8 py-24">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-10 text-center font-mono text-[10px] uppercase tracking-[0.5em]"
            style={{ color: HUD }}
          >
            FLIGHT.RECORDER // MEMORIES UNLOCKED
          </motion.p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {galleryItems.map((m, i) => (
              <motion.div
                key={`${m.fileName}-${i}`}
                initial={reduce ? false : { opacity: 0, scale: 0.94 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="group relative overflow-hidden rounded-xl border"
                style={{ borderColor: `${HUD}33` }}
              >
                <img
                  src={m.publicUrl}
                  alt={m.caption ?? ""}
                  className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute left-2 top-2 rounded font-mono text-[9px] uppercase tracking-[0.2em] px-2 py-1" style={{ background: `${NAVY}cc`, color: HUD }}>
                  FRAME.{String(i + 1).padStart(3, "0")}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1936] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </motion.div>
            ))}
            {editing && galleryItems.length === 0 && (
              <div className="col-span-full flex h-48 items-center justify-center rounded-xl border border-dashed text-sm opacity-60" style={{ borderColor: `${HUD}66`, color: WHITE }}>
                + Add photos to the flight recorder
              </div>
            )}
          </div>
        </section>
      )}

      {/* 05. DOCKING BAY / VENUE */}
      {showVenue && (
        <section className="relative mx-auto max-w-5xl px-8 py-24">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-6 text-center font-mono text-[10px] uppercase tracking-[0.5em]"
            style={{ color: HUD }}
          >
            DOCKING.BAY // LANDING COORDINATES
          </motion.p>
          {(event.venueName || event.venueAddress) && (
            <div className="mx-auto mb-6 max-w-xl text-center">
              <h3 className="font-display text-2xl uppercase tracking-tight" style={{ color: WHITE }}>{event.venueName}</h3>
              {event.venueAddress && <p className="mt-1 text-sm opacity-70" style={{ color: WHITE }}>{event.venueAddress}</p>}
            </div>
          )}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="overflow-hidden rounded-2xl border p-1 backdrop-blur-md"
            style={{ borderColor: `${HUD}44`, background: `${NAVY_2}88` }}
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

      {/* 06. LAUNCH / RSVP */}
      <section className="relative overflow-hidden px-6 py-28 text-center sm:py-40">
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: EASE }}
          className="mx-auto max-w-3xl"
        >
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.5em]" style={{ color: HUD }}>
            IGNITION SEQUENCE // ALL SYSTEMS GO
          </p>
          <h2 className="font-display text-[clamp(2.5rem,8vw,5.5rem)] font-black uppercase leading-[0.9] tracking-tight" style={{ color: WHITE, textShadow: `0 0 30px ${ORANGE}88` }}>
            READY FOR LIFTOFF
          </h2>
          <div className="mt-10">
            <Rocket launching={launching} reduce={reduce} />
          </div>
          {event.rsvpEnabled && event.rsvpLinkOrContact ? (
            <motion.a
              href={event.rsvpLinkOrContact}
              target="_blank"
              rel="noreferrer"
              onClick={() => { if (!reduce) setLaunching(true); }}
              whileHover={reduce ? undefined : { scale: 1.05 }}
              className="mt-6 inline-block rounded-full px-12 py-4 font-mono text-sm uppercase tracking-[0.35em]"
              style={{ background: ORANGE, color: NAVY, boxShadow: `0 0 40px ${ORANGE}66` }}
            >
              &gt; INITIATE LAUNCH
            </motion.a>
          ) : (
            <p className="mt-6 font-mono text-xs uppercase tracking-[0.4em]" style={{ color: YELLOW }}>
              STANDBY / AWAITING CLEARANCE
            </p>
          )}
        </motion.div>
      </section>

      <footer className="border-t py-8 text-center font-mono text-[10px] uppercase tracking-[0.4em]" style={{ borderColor: `${HUD}22`, color: `${WHITE}66` }}>
        <p>{event.eventTitle}{event.person1Name ? ` · CMDR ${event.person1Name}` : ""} · MISSION.EOF</p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default SpacemissionTemplate;
