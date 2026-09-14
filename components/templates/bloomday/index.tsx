"use client";

import { useMemo, useRef } from "react";
import type { MotionValue } from "framer-motion";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { HeroMedia } from "@/components/ui/HeroMedia";
import { MapEmbed } from "@/components/ui/MapEmbed";
import { MusicToggle } from "@/components/ui/MusicToggle";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { useEditMode } from "@/components/edit/EditContext";
import { celebrationDayCopy } from "@/lib/celebrationDay";
import type { TemplateComponent, SubEvent } from "@/lib/types";

/* ── Bloomday · one stem, opening ─────────────────────────────────────────
 * Palette   paper #fbf7f2 · stem green #6f8f5e · petal blush #e79aa6
 *           deep rose #b5566b · ink #3c3138
 * Type      Cormorant (names, section titles) / Inter (body) /
 *           tracked caps (labels)
 * Layout    one vertical stem runs the whole page; every section hangs off it
 *           as a leaf or a bloom, so the page reads as a single growing thing.
 * Signature the stem draws itself as you scroll and the flower opens petal by
 *           petal at the end of it.
 * Reads     event.eventSubtype — Mother's Day, Valentine's, Grandparents or a
 *           bump reveal, same stem, different words.
 * ──────────────────────────────────────────────────────────────────────── */

const EASE = [0.16, 1, 0.3, 1] as const;
const PAPER = "#fbf7f2";
const STEM = "#6f8f5e";
const BLUSH = "#e79aa6";
const ROSE = "#b5566b";
const INK = "#3c3138";

/** The stem that draws itself down the page. */
function Stem({ p, reduce }: { p: MotionValue<number>; reduce: boolean }) {
  const drawn = useTransform(p, [0, 0.92], [0, 1]);
  return (
    <svg
      aria-hidden
      viewBox="0 0 40 1000"
      preserveAspectRatio="none"
      className="pointer-events-none absolute bottom-0 left-4 top-0 h-full w-10 sm:left-10 sm:w-14"
    >
      <motion.path
        d="M20 0 C 8 120, 32 240, 20 360 C 8 480, 32 620, 20 760 C 12 860, 26 940, 20 1000"
        fill="none"
        stroke={STEM}
        strokeWidth="3"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        style={reduce ? { pathLength: 1 } : { pathLength: drawn }}
      />
      {[140, 330, 520, 720, 880].map((y, i) => (
        <motion.path
          key={y}
          d={i % 2 === 0 ? `M20 ${y} q 26 -18 34 -2 q -20 18 -34 2` : `M20 ${y} q -26 -18 -34 -2 q 20 18 34 2`}
          fill={STEM}
          opacity="0.5"
          initial={reduce ? false : { scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 0.5 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          style={{ originX: "20px", originY: `${y}px` }}
        />
      ))}
    </svg>
  );
}

/** SIGNATURE — the bloom, opening petal by petal. */
function Bloom({
  size = 220,
  reduce,
  accent,
  petals = 8,
}: {
  size?: number;
  reduce: boolean;
  accent: string;
  petals?: number;
}) {
  return (
    <svg aria-hidden viewBox="0 0 200 200" width={size} height={size}>
      {Array.from({ length: petals }, (_, i) => {
        const angle = (i / petals) * 360;
        return (
          <motion.ellipse
            key={i}
            cx="100"
            cy="58"
            rx="26"
            ry="44"
            fill={i % 2 === 0 ? accent : BLUSH}
            opacity="0.82"
            initial={reduce ? false : { scale: 0.2, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 0.82 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 + i * 0.09, ease: "backOut" }}
            style={{ originX: "100px", originY: "100px", rotate: angle }}
          />
        );
      })}
      <circle cx="100" cy="100" r="20" fill="#f2d08a" />
      <circle cx="100" cy="100" r="11" fill="#e0b062" />
    </svg>
  );
}

function Label({ children, color = ROSE }: { children: React.ReactNode; color?: string }) {
  return (
    <p className="font-sans text-[10px] uppercase tracking-[0.42em]" style={{ color }}>
      {children}
    </p>
  );
}

/** Sub-events as blooms along the stem. */
function Blooms({ items, accent, reduce }: { items: SubEvent[]; accent: string; reduce: boolean }) {
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <ol className="space-y-7">
      {sorted.map((s, i) => (
        <motion.li
          key={`${s.order}-${s.name}`}
          initial={reduce ? false : { opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.65, delay: (i % 4) * 0.07, ease: EASE }}
          className="relative"
        >
          <span
            aria-hidden
            className="absolute -left-[38px] top-6 hidden h-3 w-3 rounded-full sm:block"
            style={{ background: i % 2 ? BLUSH : accent }}
          />
          <div
            className="rounded-[1.5rem] p-6 sm:p-7"
            style={{ background: "#fff", border: `1px solid ${INK}14`, boxShadow: `0 18px 38px -30px ${INK}` }}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-5 gap-y-1">
              <Label color={STEM}>Moment {String(s.order).padStart(2, "0")}</Label>
              <p className="font-sans text-[11px] uppercase tracking-[0.24em]" style={{ color: accent }}>
                {[s.date, [s.startTime, s.endTime].filter(Boolean).join(" – ")].filter(Boolean).join(" · ")}
              </p>
            </div>
            <h3 className="mt-2.5 font-serif text-2xl leading-tight sm:text-3xl" style={{ color: INK }}>
              {s.icon ? `${s.icon} ` : ""}
              {s.name}
            </h3>
            {s.venueName && (
              <p className="mt-1 font-serif text-lg italic" style={{ color: STEM }}>
                {s.venueName}
              </p>
            )}
            {s.description && (
              <p className="mt-2.5 max-w-prose font-sans text-sm leading-relaxed" style={{ color: `${INK}bb` }}>
                {s.description}
              </p>
            )}
          </div>
        </motion.li>
      ))}
    </ol>
  );
}

export const BloomdayTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;
  const day = celebrationDayCopy(event.eventSubtype);

  const accent = event.themeAccentColor || ROSE;
  const tagline = event.tagline?.trim() || day.tagline;
  const invitation = event.invitationMessage?.trim() || day.invitation;
  const story = event.aboutStory?.trim() || day.story;
  const hero = event.heroImageUrl || "/samples/wedding-flowers.jpg";

  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const honoured = event.person1Name?.trim() || event.eventTitle;
  const from = event.person2Name?.trim();

  const rootRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: rootRef, offset: ["start start", "end end"] });

  const showStory = !event.hideStory;
  const showMoments = !event.hideEvents && subEvents.length > 0;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);
  const showVenue = !event.hideVenue && !!(event.venueName || event.mapLink);

  const dateLine = event.mainDate
    ? new Date(event.mainDate).toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : "";

  return (
    <div
      ref={rootRef}
      className="relative min-h-screen overflow-x-clip font-sans antialiased"
      style={{ "--accent": accent, background: PAPER, color: INK } as React.CSSProperties}
    >
      <ScrollProgress color={accent} />
      <Stem p={scrollYProgress} reduce={reduce} />

      <div className="relative pl-14 pr-5 sm:pl-28 sm:pr-8">
        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section className="relative flex min-h-[100svh] items-center overflow-hidden pb-24 sm:pb-28">
          <div className="absolute inset-0 -left-14 sm:-left-28">
            <HeroMedia
              imageSrc={hero}
              videoSrc={event.heroVideoUrl || undefined}
              alt={event.eventTitle}
              className="opacity-30"
            />
            <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${PAPER}ee, ${PAPER}c0 45%, ${PAPER}f8)` }} />
          </div>

          <div className="relative z-10 max-w-2xl">
            <Label>{day.greeting}</Label>
            <motion.h1
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: EASE }}
              className="mt-5 font-serif text-[clamp(2.6rem,10vw,6rem)] leading-[1.01]"
              style={{ color: INK }}
            >
              {honoured}
            </motion.h1>
            <p className="mt-4 font-serif text-xl italic sm:text-2xl" style={{ color: STEM }}>
              {tagline}
            </p>
            {(dateLine || from) && (
              <p className="mt-8 font-sans text-[11px] uppercase tracking-[0.34em]" style={{ color: `${INK}a0` }}>
                {[dateLine, from && `${day.forLabel === "Welcome" ? "from" : "from"} ${from}`]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            )}
            <div className="mt-6">
              <Bloom size={170} reduce={reduce} accent={accent} />
            </div>
          </div>
        </section>

        {/* ── The note ─────────────────────────────────────────────── */}
        {showStory && (
          <section className="relative py-16 sm:py-24">
            <div className="max-w-2xl">
              <Label color={STEM}>What this is</Label>
              <motion.h2
                initial={reduce ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: EASE }}
                className="mt-5 font-serif text-2xl leading-snug sm:text-3xl"
                style={{ color: INK }}
              >
                {invitation}
              </motion.h2>
              <div aria-hidden className="my-7 flex items-center gap-3">
                <span className="h-px w-16" style={{ background: `${STEM}66` }} />
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: BLUSH }} />
              </div>
              <p className="max-w-prose font-sans text-base leading-loose" style={{ color: `${INK}bb` }}>
                {story}
              </p>
            </div>
          </section>
        )}

        {/* ── The moments ─────────────────────────────────────────── */}
        {showMoments && (
          <section className="relative py-14 sm:py-20">
            <header className="mb-9 max-w-2xl">
              <Label color={STEM}>{day.planLabel}</Label>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl" style={{ color: INK }}>
                One thing after another
              </h2>
            </header>
            <div className="max-w-3xl">
              <Blooms items={subEvents} accent={accent} reduce={reduce} />
            </div>
          </section>
        )}

        {/* ── Pressed flowers (gallery) ───────────────────────────── */}
        {showGallery && (
          <section className="relative py-14 sm:py-20">
            <Label color={STEM}>Kept</Label>
            <h2 className="mb-9 mt-2 font-serif text-3xl" style={{ color: INK }}>
              Pressed between the pages
            </h2>
            {galleryItems.length > 0 ? (
              <div className="grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {galleryItems.map((m, i) => (
                  <motion.figure
                    key={`${m.fileName}-${i}`}
                    initial={reduce ? false : { opacity: 0, y: 20, scale: 0.97 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-8% 0px" }}
                    transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: EASE }}
                    className="group"
                  >
                    <div
                      className="overflow-hidden rounded-t-[999px] p-2"
                      style={{ background: "#fff", border: `1px solid ${INK}14` }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={m.publicUrl}
                        alt={m.caption ?? ""}
                        loading="lazy"
                        className="aspect-[3/4] w-full rounded-t-[999px] object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                    </div>
                    {m.caption && (
                      <figcaption className="mt-3 text-center font-serif text-base italic" style={{ color: `${INK}a8` }}>
                        {m.caption}
                      </figcaption>
                    )}
                  </motion.figure>
                ))}
              </div>
            ) : (
              <div
                className="flex h-44 max-w-2xl items-center justify-center rounded-t-[999px] border border-dashed font-serif text-lg italic"
                style={{ borderColor: `${INK}33`, color: `${INK}88` }}
              >
                + add a few photographs
              </div>
            )}
          </section>
        )}

        {/* ── Where (only when there is one) ──────────────────────── */}
        {showVenue && (
          <section className="relative py-14 sm:py-20">
            <div className="max-w-3xl">
              <Label color={STEM}>Where</Label>
              <h2 className="mt-2 font-serif text-3xl" style={{ color: INK }}>
                {event.venueName}
              </h2>
              {event.venueAddress && (
                <p className="mt-2 font-sans text-sm" style={{ color: `${INK}b0` }}>
                  {event.venueAddress}
                </p>
              )}
              <div className="mt-6 overflow-hidden rounded-[1.5rem]" style={{ border: `1px solid ${INK}18` }}>
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

        {/* ── The bloom, fully open (RSVP) ────────────────────────── */}
        <section className="relative py-16 sm:py-24">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease: EASE }}
            className="max-w-xl rounded-[1.75rem] px-8 py-12 text-center"
            style={{ background: "#fff", border: `1px solid ${INK}14`, boxShadow: `0 26px 52px -38px ${INK}` }}
          >
            <div className="mx-auto w-fit">
              <Bloom size={130} reduce={reduce} accent={accent} petals={10} />
            </div>
            <h2 className="mt-4 font-serif text-3xl" style={{ color: INK }}>
              {event.eventTitle}
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
                className="mt-7 inline-block rounded-full px-10 py-3.5 font-sans text-[11px] uppercase tracking-[0.3em] text-white transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
                style={{ background: accent, outlineColor: STEM }}
              >
                Reply with love
              </a>
            )}
            {(event.contactName || event.contactPhone) && (
              <p className="mt-6 font-serif text-base italic" style={{ color: `${INK}99` }}>
                {[event.contactName, event.contactPhone].filter(Boolean).join(" · ")}
              </p>
            )}
          </motion.div>
        </section>
      </div>

      <footer className="relative border-t" style={{ borderColor: `${INK}12` }}>
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-7 sm:px-10">
          <p className="font-serif text-lg" style={{ color: INK }}>
            {day.greeting}, {honoured}
          </p>
          <span aria-hidden className="flex items-center gap-2">
            {[accent, BLUSH, STEM].map((c) => (
              <span key={c} className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />
            ))}
          </span>
        </div>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default BloomdayTemplate;
