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
const BRASS = "#a67b3c";
const PARCHMENT = "#f0e4c9";
const AMBER = "#f2c874";
const INK = "#2c1e0f";
const TEAL = "#3a5e60";

const ARTIFACTS = [
  { x: "12%", delay: 0, dur: 6, kind: "envelope" },
  { x: "28%", delay: 0.6, dur: 7, kind: "reel" },
  { x: "48%", delay: 1.1, dur: 6.5, kind: "photo" },
  { x: "66%", delay: 0.4, dur: 7.5, kind: "medal" },
  { x: "82%", delay: 1.4, dur: 6.2, kind: "envelope" },
];

function ArtifactIcon({ kind, size = 22 }: { kind: string; size?: number }) {
  const s = size;
  if (kind === "envelope") {
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="3" y="6" width="18" height="12" rx="1.2" stroke={BRASS} strokeWidth="1.4" fill={PARCHMENT} />
        <path d="M3.5 7l8.5 6 8.5-6" stroke={BRASS} strokeWidth="1.4" />
        <circle cx="12" cy="14" r="1" fill={AMBER} />
      </svg>
    );
  }
  if (kind === "reel") {
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="8.5" stroke={BRASS} strokeWidth="1.4" fill={PARCHMENT} />
        <circle cx="12" cy="12" r="1.6" fill={BRASS} />
        <circle cx="12" cy="6.5" r="1.4" fill={AMBER} />
        <circle cx="17.5" cy="12" r="1.4" fill={AMBER} />
        <circle cx="12" cy="17.5" r="1.4" fill={AMBER} />
        <circle cx="6.5" cy="12" r="1.4" fill={AMBER} />
      </svg>
    );
  }
  if (kind === "medal") {
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M9 3l3 6 3-6" stroke={BRASS} strokeWidth="1.4" />
        <circle cx="12" cy="15" r="5.5" fill={AMBER} stroke={BRASS} strokeWidth="1.4" />
        <path d="M12 12.5l0.9 2 2.2.3-1.6 1.5.4 2.2-2-1-2 1 .4-2.2-1.6-1.5 2.2-.3z" fill={INK} />
      </svg>
    );
  }
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="4" y="5" width="16" height="14" rx="1" fill={PARCHMENT} stroke={BRASS} strokeWidth="1.4" />
      <circle cx="9" cy="10" r="1.4" fill={AMBER} />
      <path d="M5 17l4-4 3 3 3-2 4 3" stroke={BRASS} strokeWidth="1.4" fill="none" />
    </svg>
  );
}

function CapsuleSVG({ open, reduce }: { open: number; reduce: boolean }) {
  const lidRot = reduce ? -30 : -30 - open * 55;
  const lidY = reduce ? -6 : -6 - open * 26;
  const glow = reduce ? 0.55 : 0.25 + open * 0.75;
  return (
    <div className="relative mx-auto" style={{ width: 200, height: 320 }}>
      <motion.div
        aria-hidden
        className="absolute left-1/2 top-6 -translate-x-1/2 rounded-full"
        style={{
          width: 220,
          height: 220,
          background: `radial-gradient(circle, ${AMBER}, transparent 65%)`,
          filter: "blur(18px)",
          opacity: glow,
        }}
      />
      <svg viewBox="0 0 200 320" width="200" height="320" className="relative">
        <defs>
          <linearGradient id="capsule-body" x1="0" x2="1">
            <stop offset="0" stopColor="#8a6229" />
            <stop offset="0.5" stopColor={BRASS} />
            <stop offset="1" stopColor="#6d4a1e" />
          </linearGradient>
          <linearGradient id="capsule-lid" x1="0" x2="1">
            <stop offset="0" stopColor="#c69a55" />
            <stop offset="1" stopColor="#7d5423" />
          </linearGradient>
        </defs>
        <rect x="42" y="80" width="116" height="220" rx="26" fill="url(#capsule-body)" stroke={INK} strokeWidth="1.5" />
        <rect x="52" y="92" width="96" height="196" rx="18" fill="none" stroke={AMBER} strokeWidth="0.6" opacity="0.55" />
        {[120, 160, 200, 240].map((y) => (
          <circle key={y} cx="100" cy={y} r="2.2" fill={AMBER} opacity="0.7" />
        ))}
        <text x="100" y="200" textAnchor="middle" fontFamily="serif" fontSize="10" fill={PARCHMENT} letterSpacing="4" opacity="0.7">EST · TIME · KEPT</text>
      </svg>
      <motion.svg
        viewBox="0 0 200 90"
        width="200"
        height="90"
        className="absolute left-0"
        style={{ top: 30, transformOrigin: "50% 90%" }}
        animate={{ rotate: lidRot, y: lidY }}
        transition={{ duration: 1.6, ease: EASE }}
      >
        <ellipse cx="100" cy="70" rx="60" ry="14" fill="url(#capsule-lid)" stroke={INK} strokeWidth="1.4" />
        <rect x="80" y="30" width="40" height="42" rx="6" fill="url(#capsule-lid)" stroke={INK} strokeWidth="1.2" />
        <circle cx="100" cy="42" r="4" fill={AMBER} stroke={INK} strokeWidth="0.8" />
      </motion.svg>
    </div>
  );
}

function CapsuleField({ reduce }: { reduce: boolean }) {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden" style={{ background: PARCHMENT }}>
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 20%, ${AMBER}22, transparent 55%), radial-gradient(ellipse at 20% 80%, ${TEAL}18, transparent 60%)` }} />
      <svg className="absolute inset-0 h-full w-full opacity-[0.08]" xmlns="http://www.w3.org/2000/svg">
        <filter id="tc-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" />
        </filter>
        <rect width="100%" height="100%" filter="url(#tc-noise)" />
      </svg>
      {!reduce &&
        ARTIFACTS.map((a, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: a.x, bottom: "-4rem" }}
            animate={{ y: ["0vh", "-110vh"], opacity: [0, 0.55, 0], rotate: [0, 8, -6, 4] }}
            transition={{ duration: a.dur, delay: a.delay, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArtifactIcon kind={a.kind} size={26} />
          </motion.div>
        ))}
    </div>
  );
}

function ArtifactCard({ s, i, decade }: { s: SubEvent; i: number; decade: string }) {
  const reduce = useReducedMotion();
  const kinds = ["envelope", "reel", "photo", "medal"];
  const kind = kinds[i % kinds.length];
  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 30, rotate: -1.5 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
      whileHover={reduce ? undefined : { y: -4, boxShadow: `0 18px 40px -20px ${BRASS}88` }}
      className="relative rounded-md border p-6 pt-8"
      style={{ background: `linear-gradient(180deg, #fbf3dc, ${PARCHMENT})`, borderColor: `${BRASS}55`, color: INK }}
    >
      <div className="absolute -left-2 -top-3 flex items-center gap-2">
        <span className="rounded-full p-1.5 shadow-md" style={{ background: PARCHMENT, boxShadow: `0 0 14px ${AMBER}88, inset 0 0 0 1px ${BRASS}66` }}>
          <ArtifactIcon kind={kind} size={22} />
        </span>
        <span className="rounded-sm px-2 py-0.5 text-[10px] font-bold tracking-[0.3em]" style={{ background: INK, color: AMBER }}>
          {decade}
        </span>
      </div>
      <p className="mt-2 text-[10px] uppercase tracking-[0.35em]" style={{ color: TEAL }}>
        {[s.date, s.startTime].filter(Boolean).join(" · ")}
      </p>
      <h3 className="mt-2 font-display text-2xl leading-tight" style={{ color: INK }}>{s.name}</h3>
      {s.venueName && (
        <p className="mt-1 font-display italic text-sm" style={{ color: TEAL }}>at {s.venueName}</p>
      )}
      {s.description && <p className="mt-3 text-sm leading-relaxed opacity-80">{s.description}</p>}
      {s.dressCode && (
        <p className="mt-4 inline-block rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.25em]" style={{ borderColor: `${BRASS}66`, color: BRASS }}>
          {s.dressCode}
        </p>
      )}
    </motion.article>
  );
}

export const TimecapsuleTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || BRASS;
  const tagline = event.tagline?.trim() || "Sealed in time, opened with love";
  const invitationMessage =
    event.invitationMessage?.trim() ||
    "Every year we tucked another memory into the capsule. Tonight we open it — and add one more.";
  const aboutStory =
    event.aboutStory?.trim() ||
    "A capsule holds what matters most: the letters we wrote, the songs we danced to, the promises we kept. Come sit with us as we unseal the years.";
  const heroImage =
    event.heroImageUrl ||
    "https://images.unsplash.com/photo-1519750157634-b6d493a0f77c?auto=format&fit=crop&w=1600&q=80";

  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const sorted = useMemo(() => [...subEvents].sort((a, b) => a.order - b.order), [subEvents]);

  const baseYear = useMemo(() => {
    if (event.mainDate) {
      const y = new Date(event.mainDate).getFullYear();
      if (!Number.isNaN(y)) return y - Math.max(subEvents.length - 1, 0) * 5;
    }
    return 1985;
  }, [event.mainDate, subEvents.length]);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const openProgress = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const showStory = !event.hideStory;
  const showJourney = !event.hideEvents && sorted.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  const dateFormatted = event.mainDate
    ? new Date(event.mainDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
    : "";

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-sans antialiased"
      style={{ "--accent": accent, color: INK, background: PARCHMENT } as React.CSSProperties}
    >
      <CapsuleField reduce={reduce} />
      <ScrollProgress color={accent} />

      {/* ─── HERO — capsule opens ─── */}
      <section ref={heroRef} className="relative min-h-[100svh] overflow-hidden pt-16">
        <motion.div style={reduce ? undefined : { opacity: heroOpacity }} className="absolute inset-0">
          <HeroMedia imageSrc={heroImage} videoSrc={event.heroVideoUrl || undefined} alt={event.eventTitle} className="opacity-25" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${PARCHMENT}dd, ${PARCHMENT}f2 70%, ${PARCHMENT})` }} />
        </motion.div>

        <motion.div style={reduce ? undefined : { y: heroY }} className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 pt-8 text-center">
          <p className="mb-6 text-[11px] uppercase tracking-[0.65em]" style={{ color: BRASS }}>
            The Capsule Opens
          </p>
          <CapsuleSVG open={reduce ? 1 : (openProgress.get?.() ?? 0)} reduce={reduce} />
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: EASE }}
            className="mt-10"
          >
            <p className="font-display italic text-lg" style={{ color: TEAL }}>{tagline}</p>
            <h1 className="mt-3 font-display text-[clamp(2.6rem,8vw,6rem)] font-semibold leading-[0.95]" style={{ color: INK }}>
              {event.eventTitle}
            </h1>
            {(event.person1Name || event.person2Name) && (
              <p className="mt-4 text-sm uppercase tracking-[0.5em]" style={{ color: BRASS }}>
                {[event.person1Name, event.person2Name].filter(Boolean).join(" · ")}
              </p>
            )}
            <div className="mt-6 flex flex-wrap justify-center gap-3 text-xs uppercase tracking-[0.35em]" style={{ color: INK }}>
              {dateFormatted && <span>{dateFormatted}</span>}
              {event.mainStartTime && <span style={{ color: BRASS }}>·</span>}
              {event.mainStartTime && <span>{event.mainStartTime}</span>}
              {event.city && <span style={{ color: BRASS }}>·</span>}
              {event.city && <span>{event.city}</span>}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ─── STORY ─── */}
      {showStory && (
        <section className="relative mx-auto max-w-5xl px-6 py-24 sm:py-32">
          <div className="grid items-start gap-12 sm:grid-cols-5">
            <motion.div
              initial={reduce ? false : { opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: EASE }}
              className="sm:col-span-2"
            >
              <p className="mb-3 text-[10px] uppercase tracking-[0.5em]" style={{ color: BRASS }}>The Letter Inside</p>
              <h2 className="font-display text-3xl leading-[1.15] sm:text-4xl" style={{ color: INK }}>
                {invitationMessage}
              </h2>
            </motion.div>
            <motion.div
              initial={reduce ? false : { opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.15, ease: EASE }}
              className="sm:col-span-3 rounded-md border p-8 shadow-sm"
              style={{ background: "#fbf3dc", borderColor: `${BRASS}44` }}
            >
              <p className="font-display italic text-base leading-relaxed sm:text-lg" style={{ color: INK }}>
                {aboutStory}
              </p>
              <div className="mt-6 h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${BRASS}, transparent)` }} />
              <p className="mt-4 font-display italic text-sm" style={{ color: TEAL }}>— sealed with care</p>
            </motion.div>
          </div>
        </section>
      )}

      {/* ─── SUB-EVENTS — artifact cards ─── */}
      {showJourney && (
        <section className="relative py-20 sm:py-28">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-12 text-center text-[10px] uppercase tracking-[0.55em]"
            style={{ color: BRASS }}
          >
            Artifacts, In Order
          </motion.p>
          <div className="mx-auto grid max-w-5xl gap-6 px-6 sm:grid-cols-2">
            {sorted.map((s, i) => (
              <ArtifactCard key={s.order} s={s} i={i} decade={String(baseYear + i * 5)} />
            ))}
          </div>
        </section>
      )}

      {/* ─── GALLERY — archived photographs ─── */}
      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-12 text-center text-[10px] uppercase tracking-[0.55em]"
            style={{ color: BRASS }}
          >
            The Archive
          </motion.p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((m, i) => {
              const label = m.caption?.trim() || `Kept · ${String(baseYear + (i % 8)).padStart(4, "0")}`;
              return (
                <motion.figure
                  key={`${m.fileName}-${i}`}
                  initial={reduce ? false : { opacity: 0, y: 20, rotate: i % 2 === 0 ? -1.5 : 1.2 }}
                  whileInView={{ opacity: 1, y: 0, rotate: i % 2 === 0 ? -1 : 0.8 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.05, ease: EASE }}
                  whileHover={reduce ? undefined : { rotate: 0, scale: 1.02, boxShadow: `0 20px 40px -18px ${BRASS}88` }}
                  className="relative rounded-sm p-3 pb-10"
                  style={{ background: "#fbf3dc", boxShadow: `0 10px 26px -18px ${INK}66, inset 0 0 0 1px ${BRASS}33` }}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={m.publicUrl}
                      alt={m.caption ?? ""}
                      loading="lazy"
                      className="aspect-[4/5] w-full object-cover"
                      style={{ filter: "sepia(0.15) contrast(0.98)" }}
                    />
                    <div className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(ellipse at center, transparent 55%, ${INK}22)` }} />
                  </div>
                  <figcaption className="absolute bottom-2 left-4 right-4 flex items-center justify-between font-display italic text-sm" style={{ color: INK }}>
                    <span>{label}</span>
                    <span className="text-[10px] uppercase not-italic tracking-[0.3em]" style={{ color: BRASS }}>kept</span>
                  </figcaption>
                </motion.figure>
              );
            })}
            {editing && galleryItems.length === 0 && (
              <div
                className="col-span-full flex h-48 items-center justify-center rounded-sm border border-dashed text-sm"
                style={{ borderColor: `${BRASS}66`, color: TEAL }}
              >
                + Add photos to the archive
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── VENUE ─── */}
      {showVenue && (
        <section className="relative mx-auto max-w-5xl px-6 py-20 sm:py-28">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-4 text-center text-[10px] uppercase tracking-[0.55em]"
            style={{ color: BRASS }}
          >
            Where We Reopen It
          </motion.p>
          {event.venueName && (
            <h3 className="mb-6 text-center font-display text-2xl" style={{ color: INK }}>{event.venueName}</h3>
          )}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="overflow-hidden rounded-md border p-1"
            style={{ background: "#fbf3dc", borderColor: `${BRASS}55` }}
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

      {/* ─── CTA / RSVP ─── */}
      <section className="relative px-6 py-24 text-center sm:py-36">
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: EASE }}
          className="mx-auto max-w-3xl"
        >
          <div className="mx-auto mb-6 flex items-center justify-center gap-3" aria-hidden>
            <ArtifactIcon kind="envelope" size={26} />
            <span className="h-px w-16" style={{ background: BRASS }} />
            <ArtifactIcon kind="medal" size={26} />
          </div>
          <h2 className="font-display text-[clamp(2rem,6vw,4rem)] leading-tight" style={{ color: INK }}>
            Come open the capsule with us
          </h2>
          {event.person1Name && (
            <p className="mt-4 font-display italic text-sm" style={{ color: TEAL }}>
              {[event.person1Name, event.person2Name].filter(Boolean).join(" & ")}
            </p>
          )}
          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <motion.a
              whileHover={reduce ? undefined : { scale: 1.03, boxShadow: `0 0 30px ${AMBER}` }}
              href={event.rsvpLinkOrContact}
              target="_blank"
              rel="noreferrer"
              className="mt-10 inline-block rounded-full px-10 py-4 text-sm uppercase tracking-[0.35em] transition-all"
              style={{ background: INK, color: AMBER, border: `1px solid ${BRASS}` }}
            >
              Reserve your seat
            </motion.a>
          )}
        </motion.div>
      </section>

      <footer className="border-t py-8 text-center text-xs" style={{ borderColor: `${BRASS}33`, color: `${INK}99` }}>
        <p className="font-display italic">
          {event.eventTitle}
          {event.person1Name ? ` · ${event.person1Name}` : ""}
          {event.person2Name ? ` & ${event.person2Name}` : ""}
        </p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default TimecapsuleTemplate;
