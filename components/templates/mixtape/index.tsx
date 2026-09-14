"use client";

import { useMemo } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { HeroMedia } from "@/components/ui/HeroMedia";
import { MapEmbed } from "@/components/ui/MapEmbed";
import { MusicToggle } from "@/components/ui/MusicToggle";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { useEditMode } from "@/components/edit/EditContext";
import { celebrationDayCopy } from "@/lib/celebrationDay";
import type { TemplateComponent, SubEvent } from "@/lib/types";

/* ── Mixtape · side A / side B ────────────────────────────────────────────
 * Palette   shell black #1d1d1f · tape cream #efe7d4 · hi-lite #ff7a45
 *           teal #1fb6a6 · label grey #b6b2a8
 * Type      Bebas Neue (J-card labels) / Caveat (the hand-written label) /
 *           mono (track times) / Inter (liner notes)
 * Layout    a cassette J-card unfolded — spool window at the top, Side A and
 *           Side B tracklists, liner notes on the back panel.
 * Signature the reels actually turn: spool rotation is driven by scroll, and
 *           the tape counter ticks up with it.
 * Reads     event.eventSubtype — a mixtape for a dad, a sibling, a friend or
 *           a valentine, with the words changing per day.
 * ──────────────────────────────────────────────────────────────────────── */

const EASE = [0.16, 1, 0.3, 1] as const;
const SHELL = "#1d1d1f";
const TAPE = "#efe7d4";
const HILITE = "#ff7a45";
const TEAL = "#1fb6a6";
const LABEL = "#b6b2a8";

/** Cassette shell with reels that turn on scroll. */
function Cassette({
  title,
  side,
  reduce,
  accent,
}: {
  title: string;
  side: string;
  reduce: boolean;
  accent: string;
}) {
  const { scrollYProgress } = useScroll();
  const spin = useTransform(scrollYProgress, [0, 1], [0, 900]);
  // Top-level, never inside a branch: hooks have to run in the same order every
  // render.
  const counter = useTransform(scrollYProgress, [0, 1], [0, 999]);
  const counterText = useTransform(counter, (v) =>
    String(Math.round(v)).padStart(3, "0"),
  );
  const reel = (cx: number) => (
    <motion.g style={reduce ? undefined : { rotate: spin, originX: `${cx}px`, originY: "62px" }}>
      <circle cx={cx} cy="62" r="19" fill="#2a2a2d" stroke={LABEL} strokeWidth="2" />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <rect
          key={a}
          x={cx - 1.6}
          y="45"
          width="3.2"
          height="10"
          rx="1.5"
          fill={LABEL}
          transform={`rotate(${a} ${cx} 62)`}
        />
      ))}
      <circle cx={cx} cy="62" r="6" fill="#4a4a4e" />
    </motion.g>
  );
  return (
    <div className="relative mx-auto w-full max-w-xl">
      <svg aria-hidden viewBox="0 0 320 200" className="w-full">
        {/* shell */}
        <rect x="6" y="6" width="308" height="188" rx="10" fill={SHELL} stroke="#3a3a3e" strokeWidth="3" />
        {/* paper label */}
        <rect x="22" y="20" width="276" height="72" rx="4" fill={TAPE} />
        <rect x="22" y="20" width="276" height="12" fill={accent} opacity="0.85" />
        {/* spool window */}
        <rect x="70" y="102" width="180" height="60" rx="6" fill="#111113" stroke="#3a3a3e" strokeWidth="2" />
        {/* tape between the reels */}
        <rect x="92" y="58" width="136" height="8" fill="#2f2f33" />
        {reel(112)}
        {reel(208)}
        {/* screws */}
        {[[20, 178], [300, 178], [20, 20], [300, 20]].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="3" fill="#4a4a4e" />
        ))}
      </svg>

      {/* label text sits over the paper label */}
      <div className="pointer-events-none absolute left-[7%] right-[7%] top-[11%]">
        <p className="font-condensed text-[clamp(0.9rem,2.6vw,1.3rem)] tracking-[0.22em]" style={{ color: SHELL }}>
          {side}
        </p>
        <p className="mt-0.5 truncate font-hand text-[clamp(1.4rem,5vw,2.4rem)] leading-tight" style={{ color: SHELL }}>
          {title}
        </p>
      </div>

      {/* tape counter */}
      <div
        className="absolute bottom-[6%] left-1/2 -translate-x-1/2 px-3 py-1 font-mono text-[11px]"
        style={{ background: "#111113", color: HILITE, border: `1px solid #3a3a3e` }}
      >
        {reduce ? "000" : <motion.span>{counterText}</motion.span>}
      </div>
    </div>
  );
}

/** Tracklist row. */
function Track({
  n,
  name,
  meta,
  note,
  delay,
  reduce,
  color,
}: {
  n: number;
  name: string;
  meta: string;
  note?: string;
  delay: number;
  reduce: boolean;
  color: string;
}) {
  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, x: -14 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.5, delay, ease: EASE }}
      className="flex items-baseline gap-3 border-b py-3.5"
      style={{ borderColor: `${LABEL}33` }}
    >
      <span className="w-6 shrink-0 font-mono text-xs" style={{ color }}>
        {String(n).padStart(2, "0")}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-condensed text-xl tracking-[0.06em]" style={{ color: TAPE }}>
          {name}
        </span>
        {note && (
          <span className="mt-0.5 block font-sans text-[13px] leading-snug" style={{ color: `${LABEL}dd` }}>
            {note}
          </span>
        )}
      </span>
      <span className="shrink-0 font-mono text-xs" style={{ color: `${LABEL}cc` }}>
        {meta}
      </span>
    </motion.li>
  );
}

export const MixtapeTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;
  const day = celebrationDayCopy(event.eventSubtype);

  const accent = event.themeAccentColor || HILITE;
  const tagline = event.tagline?.trim() || day.tagline;
  const invitation = event.invitationMessage?.trim() || day.invitation;
  const story = event.aboutStory?.trim() || day.story;
  const hero = event.heroImageUrl || "/samples/confetti.jpg";

  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const honoured = event.person1Name?.trim() || event.eventTitle;
  const from = event.person2Name?.trim();

  const sorted = useMemo(() => [...subEvents].sort((a, b) => a.order - b.order), [subEvents]);
  const half = Math.ceil(sorted.length / 2);
  const sideA = sorted.slice(0, half);
  const sideB = sorted.slice(half);

  const showStory = !event.hideStory;
  const showTracks = !event.hideEvents && sorted.length > 0;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);
  const showVenue = !event.hideVenue && !!(event.venueName || event.mapLink);

  const dateLine = event.mainDate
    ? new Date(event.mainDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : "";

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-sans antialiased"
      style={{ "--accent": accent, background: "#141416", color: TAPE } as React.CSSProperties}
    >
      <ScrollProgress color={accent} />

      {/* ── Hero: the cassette ─────────────────────────────────────── */}
      <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 pb-24 pt-14 sm:px-8 sm:pb-28">
        <div className="absolute inset-0">
          <HeroMedia
            imageSrc={hero}
            videoSrc={event.heroVideoUrl || undefined}
            alt={event.eventTitle}
            className="opacity-20 grayscale"
          />
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, #141416e6, #1d1d1fb0 45%, #141416f5)` }} />
        </div>

        <div className="relative z-10 w-full text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.4em]" style={{ color: accent }}>
            {day.icon} {day.greeting}
          </p>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
            className="mx-auto mt-4 max-w-3xl font-condensed text-[clamp(2.6rem,11vw,6.5rem)] leading-[0.9] tracking-[0.02em]"
          >
            {`A MIXTAPE FOR ${honoured}`.toUpperCase()}
          </motion.h1>
          <p className="mt-4 font-hand text-2xl" style={{ color: `${LABEL}ee` }}>
            {tagline}
          </p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45, ease: EASE }}
            className="mt-9"
          >
            <Cassette title={honoured} side={`SIDE A · ${dateLine || "TODAY"}`} reduce={reduce} accent={accent} />
          </motion.div>

          {from && (
            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: `${LABEL}cc` }}>
              recorded by {from}
            </p>
          )}
        </div>
      </section>

      {/* ── Liner notes ───────────────────────────────────────────── */}
      {showStory && (
        <section className="relative mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="p-7 sm:p-10" style={{ background: TAPE, color: SHELL }}>
            <p className="font-mono text-[11px] uppercase tracking-[0.32em]" style={{ color: HILITE }}>
              Liner notes
            </p>
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: EASE }}
              className="mt-4 font-condensed text-[clamp(1.6rem,4.4vw,2.6rem)] leading-[1.1] tracking-[0.02em]"
            >
              {invitation.toUpperCase()}
            </motion.p>
            <p className="mt-6 font-sans text-base leading-relaxed" style={{ color: `${SHELL}c4` }}>
              {story}
            </p>
            <p className="mt-7 font-hand text-2xl" style={{ color: TEAL }}>
              press play whenever
            </p>
          </div>
        </section>
      )}

      {/* ── Side A / Side B ───────────────────────────────────────── */}
      {showTracks && (
        <section className="relative mx-auto max-w-5xl px-5 py-14 sm:px-8 sm:py-20">
          <div className="grid gap-10 md:grid-cols-2">
            {[
              ["SIDE A", sideA, HILITE],
              ["SIDE B", sideB, TEAL],
            ].map(([label, items, colour], si) =>
              (items as SubEvent[]).length > 0 ? (
                <div key={label as string}>
                  <header className="mb-3 flex items-baseline justify-between gap-3 border-b pb-2" style={{ borderColor: `${LABEL}44` }}>
                    <h2 className="font-condensed text-2xl tracking-[0.18em]" style={{ color: colour as string }}>
                      {label as string}
                    </h2>
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: `${LABEL}aa` }}>
                      {(items as SubEvent[]).length} tracks
                    </span>
                  </header>
                  <ol>
                    {(items as SubEvent[]).map((s, i) => (
                      <Track
                        key={`${s.order}-${s.name}`}
                        n={s.order}
                        name={s.name}
                        meta={[s.startTime, s.endTime].filter(Boolean).join("–") || s.date || ""}
                        note={[s.venueName, s.description].filter(Boolean).join(" · ")}
                        delay={(i % 5) * 0.06 + si * 0.05}
                        reduce={reduce}
                        color={colour as string}
                      />
                    ))}
                  </ol>
                </div>
              ) : null,
            )}
          </div>
        </section>
      )}

      {/* ── Sleeve photos ────────────────────────────────────────── */}
      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <h2 className="mb-8 font-condensed text-[clamp(1.8rem,5vw,3rem)] leading-none tracking-[0.06em]">
            SLEEVE
          </h2>
          {galleryItems.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {galleryItems.map((m, i) => (
                <motion.figure
                  key={`${m.fileName}-${i}`}
                  initial={reduce ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-8% 0px" }}
                  transition={{ duration: 0.6, delay: (i % 3) * 0.07, ease: EASE }}
                  className="group p-2.5"
                  style={{ background: SHELL, border: `1px solid ${LABEL}33` }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={m.publicUrl}
                    alt={m.caption ?? ""}
                    loading="lazy"
                    className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <figcaption className="flex items-center justify-between gap-3 pt-2.5">
                    <span className="truncate font-hand text-xl" style={{ color: TAPE }}>
                      {m.caption || "untitled"}
                    </span>
                    <span className="shrink-0 font-mono text-[10px]" style={{ color: accent }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </figcaption>
                </motion.figure>
              ))}
            </div>
          ) : (
            <div
              className="flex h-44 items-center justify-center border border-dashed font-hand text-2xl"
              style={{ borderColor: `${LABEL}55`, color: `${LABEL}aa` }}
            >
              + add sleeve photos
            </div>
          )}
        </section>
      )}

      {/* ── Where (only if there is one) ──────────────────────────── */}
      {showVenue && (
        <section className="relative mx-auto max-w-4xl px-5 py-14 sm:px-8 sm:py-20">
          <div className="p-5 sm:p-7" style={{ background: SHELL, border: `1px solid ${LABEL}33` }}>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
              Where
            </p>
            <h2 className="mt-2 font-condensed text-2xl tracking-[0.06em]">
              {(event.venueName || "").toUpperCase()}
            </h2>
            {event.venueAddress && (
              <p className="mt-1.5 font-sans text-sm" style={{ color: `${LABEL}dd` }}>
                {event.venueAddress}
              </p>
            )}
            <div className="mt-5" style={{ border: `1px solid ${LABEL}33` }}>
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

      {/* ── B-side note (RSVP) ──────────────────────────────────── */}
      <section className="relative px-5 py-16 text-center sm:py-24">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mx-auto max-w-md px-8 py-11"
          style={{ background: TAPE, color: SHELL }}
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.32em]" style={{ color: HILITE }}>
            Hidden track
          </p>
          <h2 className="mt-3 font-condensed text-3xl tracking-[0.04em]">{event.eventTitle}</h2>
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
              className="mt-6 inline-block px-9 py-3.5 font-condensed text-lg tracking-[0.14em] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
              style={{ background: SHELL, color: TAPE, outlineColor: HILITE }}
            >
              WRITE BACK
            </a>
          )}
          {(event.contactName || event.contactPhone) && (
            <p className="mt-5 font-hand text-xl" style={{ color: `${SHELL}aa` }}>
              {[event.contactName, event.contactPhone].filter(Boolean).join(" · ")}
            </p>
          )}
        </motion.div>
      </section>

      <footer className="relative border-t" style={{ borderColor: `${LABEL}22` }}>
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-6 sm:px-8">
          <p className="font-condensed text-lg tracking-[0.1em]">{(event.eventTitle || "").toUpperCase()}</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.26em]" style={{ color: accent }}>
            {sorted.length} tracks · side b ends
          </p>
        </div>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default MixtapeTemplate;
