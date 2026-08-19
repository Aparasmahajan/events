"use client";

import { useMemo, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { HeroMedia } from "@/components/ui/HeroMedia";
import { MapEmbed } from "@/components/ui/MapEmbed";
import { MusicToggle } from "@/components/ui/MusicToggle";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { useEditMode } from "@/components/edit/EditContext";
import type { TemplateComponent, SubEvent } from "@/lib/types";

/* ── Panchang · the almanac wedding ───────────────────────────────────────
 * Palette   saffron #e08a1e · vermilion #b3271f · indigo ink #22314f
 *           palm leaf #e7dcc0 · deep ink #1a1712
 * Type      Playfair (names) / Tiro Devanagari (numerals, seals) /
 *           Inter (body) / mono (timings)
 * Layout    a ruled almanac page — everything sits in a table or a chart, and
 *           the twelve-house square is the grid the whole page obeys.
 * Signature the two charts converge: each family's square slides in from its
 *           own side and locks into a single chart as the hero scrolls away.
 * ──────────────────────────────────────────────────────────────────────── */

const EASE = [0.16, 1, 0.3, 1] as const;
const SAFFRON = "#e08a1e";
const VERMILION = "#b3271f";
const INDIGO = "#22314f";
const PALM = "#e7dcc0";
const INK = "#1a1712";

const RULED = `repeating-linear-gradient(180deg, transparent 0 31px, ${INK}12 31px 32px)`;

/** North-Indian twelve-house chart. */
function Kundli({
  size = 200,
  color,
  label,
  numerals,
}: {
  size?: number;
  color: string;
  label?: string;
  numerals?: boolean;
}) {
  const DEVA = ["१", "२", "३", "४", "५", "६", "७", "८", "९", "१०", "११", "१२"];
  const spots = [
    [50, 22], [26, 12], [12, 26], [22, 50], [12, 74], [26, 88],
    [50, 78], [74, 88], [88, 74], [78, 50], [88, 26], [74, 12],
  ];
  return (
    <svg aria-hidden viewBox="0 0 100 100" width={size} height={size}>
      <rect x="2" y="2" width="96" height="96" fill="none" stroke={color} strokeWidth="1.6" />
      <line x1="2" y1="2" x2="98" y2="98" stroke={color} strokeWidth="0.9" />
      <line x1="98" y1="2" x2="2" y2="98" stroke={color} strokeWidth="0.9" />
      <polygon points="50,2 98,50 50,98 2,50" fill="none" stroke={color} strokeWidth="0.9" />
      {numerals &&
        spots.map(([x, y], i) => (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor="middle"
            fontSize="6"
            fill={color}
            opacity="0.75"
            className="font-deva"
          >
            {DEVA[i]}
          </text>
        ))}
      {label && (
        <text x="50" y="54" textAnchor="middle" fontSize="8" fill={color} className="font-deva">
          {label}
        </text>
      )}
    </svg>
  );
}

/** Vermilion seal, stamped. */
function Seal({ text, reduce, className }: { text: string; reduce: boolean; className?: string }) {
  return (
    <motion.div
      aria-hidden
      initial={reduce ? false : { scale: 1.4, opacity: 0, rotate: -14 }}
      whileInView={{ scale: 1, opacity: 0.85, rotate: -8 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: "backOut" }}
      className={`flex h-20 w-20 items-center justify-center rounded-full text-center ${className ?? ""}`}
      style={{ border: `2px solid ${VERMILION}`, color: VERMILION }}
    >
      <span className="px-2 font-deva text-[11px] leading-tight">{text}</span>
    </motion.div>
  );
}

/** An almanac table row. */
function Row({ k, v, accent }: { k: string; v: string; accent: string }) {
  return (
    <div
      className="grid gap-1 border-b py-3 sm:grid-cols-[10rem,1fr] sm:gap-6"
      style={{ borderColor: `${INK}22` }}
    >
      <dt className="font-sans text-[10px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {k}
      </dt>
      <dd className="font-serif text-lg" style={{ color: INK }}>
        {v}
      </dd>
    </div>
  );
}

/** Sub-events as the timings table. */
function Timings({ items, accent, reduce }: { items: SubEvent[]; accent: string; reduce: boolean }) {
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <ol>
      {sorted.map((s, i) => (
        <motion.li
          key={`${s.order}-${s.name}`}
          initial={reduce ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.55, delay: (i % 5) * 0.06, ease: EASE }}
          className="flex flex-col gap-3 border-b py-5 sm:flex-row sm:items-center sm:gap-6"
          style={{ borderColor: `${INK}22` }}
        >
          <span className="shrink-0">
            <Kundli size={46} color={i % 2 ? INDIGO : SAFFRON} />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-2xl leading-tight" style={{ color: INDIGO }}>
              {s.icon ? `${s.icon} ` : ""}
              {s.name}
            </h3>
            {s.description && (
              <p className="mt-1.5 max-w-prose font-sans text-sm leading-relaxed" style={{ color: `${INK}c4` }}>
                {s.description}
              </p>
            )}
            {s.dressCode && (
              <p className="mt-2 font-sans text-[10px] uppercase tracking-[0.22em]" style={{ color: accent }}>
                {s.dressCode}
              </p>
            )}
          </div>
          <div className="shrink-0 sm:w-44 sm:text-right">
            <p className="font-mono text-sm" style={{ color: VERMILION }}>
              {[s.startTime, s.endTime].filter(Boolean).join(" – ") || s.date}
            </p>
            {s.venueName && (
              <p className="mt-1 font-serif text-base" style={{ color: `${INK}b0` }}>
                {s.venueName}
              </p>
            )}
          </div>
        </motion.li>
      ))}
    </ol>
  );
}

export const PanchangTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || VERMILION;
  const tagline = event.tagline?.trim() || "Written in the almanac";
  const invitation =
    event.invitationMessage?.trim() ||
    "The pandit checked twice and the families checked four times. The hour is fixed — please be seated before it.";
  const story =
    event.aboutStory?.trim() ||
    "Two charts, one auspicious hour, and a great deal of paperwork. What the almanac calls a match, we had already decided.";
  const hero = event.heroImageUrl || "/samples/puja-offerings.jpg";

  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const names = [event.person1Name, event.person2Name].filter(Boolean);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  // SIGNATURE — the two charts slide together and lock.
  const leftX = useTransform(heroP, [0, 0.8], ["-38%", "0%"]);
  const rightX = useTransform(heroP, [0, 0.8], ["38%", "0%"]);
  const mergeGlow = useTransform(heroP, [0.55, 0.9], [0, 0.55]);

  const showStory = !event.hideStory;
  const showTimings = !event.hideEvents && subEvents.length > 0;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);
  const showVenue = !event.hideVenue;

  const dateLine = event.mainDate
    ? new Date(event.mainDate).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : "";
  const muhurat = [event.mainStartTime, event.mainEndTime].filter(Boolean).join(" – ");

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-sans antialiased"
      style={{ "--accent": accent, background: PALM, color: INK } as React.CSSProperties}
    >
      <ScrollProgress color={accent} />
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0" style={{ background: RULED }} />

      {/* ── Hero: the two charts converge ──────────────────────────── */}
      <section
        ref={heroRef}
        className="relative z-10 flex min-h-[100svh] items-center justify-center overflow-hidden pb-24 sm:pb-28"
      >
        <div className="absolute inset-0">
          <HeroMedia
            imageSrc={hero}
            videoSrc={event.heroVideoUrl || undefined}
            alt={event.eventTitle}
            className="opacity-25 sepia"
          />
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(180deg, ${PALM}f0 0%, ${PALM}cc 45%, ${PALM}fa 100%)` }}
          />
        </div>

        <div className="relative z-10 w-full max-w-3xl px-6 text-center">
          <p className="font-sans text-[10px] uppercase tracking-[0.46em]" style={{ color: VERMILION }}>
            {tagline}
          </p>

          <div className="relative mx-auto mt-8 flex h-[210px] items-center justify-center sm:h-[260px]">
            <motion.div
              aria-hidden
              className="absolute"
              style={reduce ? { x: "-8%" } : { x: leftX }}
            >
              <Kundli size={190} color={INDIGO} numerals />
            </motion.div>
            <motion.div
              aria-hidden
              className="absolute"
              style={reduce ? { x: "8%" } : { x: rightX }}
            >
              <Kundli size={190} color={SAFFRON} numerals />
            </motion.div>
            <motion.div
              aria-hidden
              className="absolute h-[190px] w-[190px] rounded-full"
              style={{
                background: `radial-gradient(circle, ${SAFFRON}66, transparent 70%)`,
                opacity: reduce ? 0.3 : mergeGlow,
              }}
            />
          </div>

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: EASE }}
            className="mt-8 font-display text-[clamp(2.3rem,8vw,5rem)] leading-[1.04]"
            style={{ color: INDIGO }}
          >
            {names.length === 2 ? (
              <>
                {names[0]}
                <span className="mx-3 align-middle font-deva text-[0.36em]" style={{ color: VERMILION }}>
                  ॐ
                </span>
                {names[1]}
              </>
            ) : (
              event.eventTitle
            )}
          </motion.h1>

          {(dateLine || muhurat) && (
            <p className="mt-7 font-mono text-[11px] uppercase tracking-[0.26em]" style={{ color: INK }}>
              {[dateLine, muhurat && `muhurat ${muhurat}`, event.city].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
      </section>

      {/* ── The entry (story) ─────────────────────────────────────── */}
      {showStory && (
        <section className="relative z-10 px-6 py-20 sm:py-28">
          <div
            className="mx-auto max-w-3xl p-8 sm:p-12"
            style={{ background: "rgba(255,252,244,0.9)", border: `1px solid ${INK}22` }}
          >
            <div className="flex flex-wrap items-start justify-between gap-6">
              <p className="font-sans text-[10px] uppercase tracking-[0.36em]" style={{ color: VERMILION }}>
                The entry
              </p>
              <Seal text="शुभ मुहूर्त" reduce={reduce} />
            </div>
            <motion.h2
              initial={reduce ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: EASE }}
              className="mt-2 font-display text-2xl leading-snug sm:text-3xl"
              style={{ color: INDIGO }}
            >
              {invitation}
            </motion.h2>
            <p className="mt-6 font-serif text-lg leading-loose" style={{ color: `${INK}cc` }}>
              {story}
            </p>
            <dl className="mt-8">
              <Row k="Date" v={dateLine || "To be fixed"} accent={SAFFRON} />
              <Row k="Muhurat" v={muhurat || "Announced closer to the day"} accent={SAFFRON} />
              <Row k="Place" v={[event.venueName, event.city].filter(Boolean).join(", ") || "—"} accent={SAFFRON} />
            </dl>
          </div>
        </section>
      )}

      {/* ── The timings ───────────────────────────────────────────── */}
      {showTimings && (
        <section className="relative z-10 mx-auto max-w-4xl px-6 py-16 sm:py-20">
          <header className="mb-8">
            <p className="font-sans text-[10px] uppercase tracking-[0.36em]" style={{ color: VERMILION }}>
              The timings
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl" style={{ color: INDIGO }}>
              Every hour, accounted for
            </h2>
          </header>
          <Timings items={subEvents} accent={accent} reduce={reduce} />
        </section>
      )}

      {/* ── Photographs in the twelve houses ─────────────────────── */}
      {showGallery && (
        <section className="relative z-10 mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <h2 className="mb-9 font-display text-3xl" style={{ color: INDIGO }}>
            Plates &amp; portraits
          </h2>
          {galleryItems.length > 0 ? (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {galleryItems.map((m, i) => (
                <motion.figure
                  key={`${m.fileName}-${i}`}
                  initial={reduce ? false : { opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-8% 0px" }}
                  transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: EASE }}
                  className="group relative"
                  style={{ background: "rgba(255,252,244,0.9)", border: `1px solid ${INK}22`, padding: 10 }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={m.publicUrl}
                    alt={m.caption ?? ""}
                    loading="lazy"
                    className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-2.5"
                    style={{ border: `1px solid ${SAFFRON}88` }}
                  />
                  {m.caption && (
                    <figcaption className="pt-3 text-center font-serif text-base" style={{ color: `${INK}b0` }}>
                      {m.caption}
                    </figcaption>
                  )}
                </motion.figure>
              ))}
            </div>
          ) : (
            <div
              className="flex h-44 items-center justify-center border border-dashed font-serif text-lg"
              style={{ borderColor: `${INK}44`, color: `${INK}99` }}
            >
              + Add photographs
            </div>
          )}
        </section>
      )}

      {/* ── The place ─────────────────────────────────────────────── */}
      {showVenue && (
        <section className="relative z-10 mx-auto max-w-4xl px-6 py-16 sm:py-20">
          <div className="p-6 sm:p-8" style={{ background: "rgba(255,252,244,0.9)", border: `1px solid ${INK}22` }}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-sans text-[10px] uppercase tracking-[0.36em]" style={{ color: VERMILION }}>
                  The place
                </p>
                <h2 className="mt-3 font-display text-3xl" style={{ color: INDIGO }}>
                  {event.venueName || "The venue"}
                </h2>
                {event.venueAddress && (
                  <p className="mt-2 font-sans text-sm" style={{ color: `${INK}b8` }}>
                    {event.venueAddress}
                  </p>
                )}
              </div>
              <Kundli size={72} color={INDIGO} />
            </div>
            <div className="mt-6" style={{ border: `1px solid ${INK}33` }}>
              <MapEmbed
                latitude={event.latitude}
                longitude={event.longitude}
                venueName={event.venueName}
                venueAddress={event.venueAddress}
                mapLink={event.mapLink}
              />
            </div>
          </div>
        </section>
      )}

      {/* ── Your name in the book (RSVP) ─────────────────────────── */}
      <section className="relative z-10 px-6 py-20 text-center sm:py-28">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mx-auto max-w-lg px-8 py-12"
          style={{ background: "rgba(255,252,244,0.95)", border: `2px solid ${SAFFRON}` }}
        >
          <p className="font-sans text-[10px] uppercase tracking-[0.36em]" style={{ color: VERMILION }}>
            The register
          </p>
          <h2 className="mt-4 font-display text-3xl" style={{ color: INDIGO }}>
            Put your name in the book
          </h2>
          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <a
              href={
                event.rsvpLinkOrContact.startsWith("http")
                  ? event.rsvpLinkOrContact
                  : event.rsvpLinkOrContact.includes("@")
                    ? `mailto:${event.rsvpLinkOrContact}`
                    : `tel:${event.rsvpLinkOrContact}`
              }
              target={event.rsvpLinkOrContact.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="mt-8 inline-block px-10 py-3.5 font-sans text-[11px] uppercase tracking-[0.3em] text-white transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
              style={{ background: VERMILION, outlineColor: INDIGO }}
            >
              Confirm your seat
            </a>
          )}
          {(event.contactName || event.contactPhone) && (
            <p className="mt-6 font-sans text-xs" style={{ color: `${INK}99` }}>
              {[event.contactName, event.contactPhone].filter(Boolean).join(" · ")}
            </p>
          )}
        </motion.div>
      </section>

      <footer className="relative z-10 border-t" style={{ borderColor: `${INK}22` }}>
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-6">
          <Kundli size={40} color={SAFFRON} />
          <p className="font-serif text-base" style={{ color: `${INK}a8` }}>
            {event.eventTitle}
            {names.length === 2 ? ` · ${names.join(" & ")}` : ""}
          </p>
          <p className="font-deva text-sm" style={{ color: VERMILION }}>
            शुभम्
          </p>
        </div>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default PanchangTemplate;
