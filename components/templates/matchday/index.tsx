"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { HeroMedia } from "@/components/ui/HeroMedia";
import { MapEmbed } from "@/components/ui/MapEmbed";
import { MusicToggle } from "@/components/ui/MusicToggle";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { useEditMode } from "@/components/edit/EditContext";
import type { TemplateComponent, SubEvent } from "@/lib/types";

/* ── Match Day · the birthday as a fixture ────────────────────────────────
 * Palette   pitch green #1f7a3f · floodlight #f4f7f4 · night stand #0d1b16
 *           kit gold #e8b53a · chalk #dfe6df
 * Type      Bebas Neue (name, squad number, scoreboard) / Inter (body) /
 *           mono (kick-off times)
 * Layout    pitch geometry — chalk-line dividers, centre-circle hero framing,
 *           penalty-box grids, a scoreboard strip that never leaves.
 * Signature the tunnel walk-out: the walls slide past and the floodlights
 *           bloom once, then the fixture list runs like a match schedule.
 * ──────────────────────────────────────────────────────────────────────── */

const EASE = [0.16, 1, 0.3, 1] as const;
const PITCH = "#1f7a3f";
const FLOOD = "#f4f7f4";
const NIGHT = "#0d1b16";
const GOLD = "#e8b53a";
const CHALK = "#dfe6df";

const TURF =
  `repeating-linear-gradient(90deg, rgba(255,255,255,0.035) 0 42px, transparent 42px 84px)`;

/** Chalk line divider. */
function ChalkLine({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`h-px w-full ${className ?? ""}`}
      style={{ background: `repeating-linear-gradient(90deg, ${CHALK}88 0 14px, transparent 14px 24px)` }}
    />
  );
}

/** Scoreboard cell. */
function Score({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4 py-2 text-center" style={{ background: NIGHT, border: `1px solid ${GOLD}55` }}>
      <p className="font-mono text-[9px] uppercase tracking-[0.24em]" style={{ color: `${GOLD}cc` }}>
        {label}
      </p>
      <p className="font-condensed text-2xl leading-none tracking-[0.06em]" style={{ color: FLOOD }}>
        {value}
      </p>
    </div>
  );
}

/** The shirt with the name and squad number. */
function Shirt({ name, number, reduce }: { name: string; number: string; reduce: boolean }) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 26, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
      className="relative mx-auto w-full max-w-sm"
    >
      <svg aria-hidden viewBox="0 0 200 220" className="w-full">
        <path
          d="M60 18 L84 8 q16 12 32 0 L140 18 l24 22 -20 24 -8 -8 v138 q-36 10 -72 0 V56 l-8 8 -20 -24z"
          fill={PITCH}
          stroke={GOLD}
          strokeWidth="2.5"
        />
        <path d="M84 8 q16 20 32 0" fill="none" stroke={GOLD} strokeWidth="2.5" />
      </svg>
      <h1 className="absolute inset-x-0 top-[26%] text-center">
        <span className="block font-condensed text-[clamp(1rem,4vw,1.6rem)] tracking-[0.22em]" style={{ color: FLOOD }}>
          {name.toUpperCase()}
        </span>
        <span className="block font-condensed text-[clamp(3.5rem,14vw,6rem)] leading-[0.9]" style={{ color: GOLD }}>
          {number}
        </span>
      </h1>
    </motion.div>
  );
}

/** Sub-events as the fixture list. */
function FixtureList({ items, reduce }: { items: SubEvent[]; reduce: boolean }) {
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <ol>
      {sorted.map((s, i) => (
        <motion.li
          key={`${s.order}-${s.name}`}
          initial={reduce ? false : { opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.55, delay: (i % 5) * 0.06, ease: EASE }}
          className="grid gap-2 border-b py-5 sm:grid-cols-[6.5rem,1fr,auto] sm:items-baseline sm:gap-7"
          style={{ borderColor: `${CHALK}33` }}
        >
          <p className="font-mono text-sm tracking-[0.14em]" style={{ color: GOLD }}>
            {[s.startTime, s.endTime].filter(Boolean).join("–") || s.date}
          </p>
          <div className="min-w-0">
            <h3 className="font-condensed text-2xl tracking-[0.06em]" style={{ color: FLOOD }}>
              {s.icon ? `${s.icon} ` : ""}
              {s.name}
            </h3>
            {s.description && (
              <p className="mt-1 font-sans text-sm leading-relaxed" style={{ color: `${CHALK}bb` }}>
                {s.description}
              </p>
            )}
          </div>
          <div className="sm:text-right">
            {s.venueName && (
              <p className="font-condensed text-lg tracking-[0.08em]" style={{ color: CHALK }}>
                {s.venueName}
              </p>
            )}
            {s.dressCode && (
              <p className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: `${CHALK}99` }}>
                {s.dressCode}
              </p>
            )}
          </div>
        </motion.li>
      ))}
    </ol>
  );
}

export const MatchdayTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || PITCH;
  const tagline = event.tagline?.trim() || "Kick-off at five";
  const invitation =
    event.invitationMessage?.trim() ||
    "One match, one cake, one trophy that cost very little. Boots optional, shouting encouraged.";
  const story =
    event.aboutStory?.trim() ||
    "Plays up front, refuses to pass, celebrates like it's a final every single time. Today he gets the whole stadium.";
  const hero = event.heroImageUrl || "/samples/confetti.jpg";

  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);

  const showStory = !event.hideStory;
  const showFixtures = !event.hideEvents && subEvents.length > 0;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);
  const showVenue = !event.hideVenue;

  const ageMatch = event.eventTitle.match(/\d{1,3}/);
  const age = ageMatch?.[0] ?? "1";
  const dateLine = event.mainDate
    ? new Date(event.mainDate).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }).toUpperCase()
    : "";

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-sans antialiased"
      style={{ "--accent": accent, background: NIGHT, color: FLOOD } as React.CSSProperties}
    >
      <ScrollProgress color={GOLD} />

      {/* ── Hero: tunnel → pitch ───────────────────────────────────── */}
      <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden pb-24 sm:pb-28">
        <div className="absolute inset-0">
          <HeroMedia
            imageSrc={hero}
            videoSrc={event.heroVideoUrl || undefined}
            alt={event.eventTitle}
            className="opacity-35"
          />
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${NIGHT}e6, ${PITCH}59 55%, ${NIGHT}f2)` }} />
          <div aria-hidden className="absolute inset-0" style={{ background: TURF }} />
        </div>

        {/* SIGNATURE — the tunnel walls slide away, floodlights bloom once. */}
        {!reduce && (
          <>
            {[0, 1].map((side) => (
              <motion.div
                key={side}
                aria-hidden
                className={`absolute inset-y-0 z-20 w-1/2 ${side ? "right-0" : "left-0"}`}
                style={{ background: `linear-gradient(${side ? "270deg" : "90deg"}, #050b08, #0d1b16)` }}
                initial={{ x: 0 }}
                animate={{ x: side ? "100%" : "-100%" }}
                transition={{ duration: 1.6, delay: 0.35, ease: EASE }}
              />
            ))}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-10"
              style={{ background: `radial-gradient(ellipse at 50% 8%, ${FLOOD}cc, transparent 55%)` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.55, 0.16] }}
              transition={{ duration: 2.4, times: [0, 0.4, 1], delay: 1.2, ease: "easeOut" }}
            />
          </>
        )}

        {/* centre circle */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[78vmin] w-[78vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ border: `2px solid ${CHALK}33` }}
        />

        <div className="relative z-30 w-full max-w-xl px-6 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.34em]" style={{ color: GOLD }}>
            {tagline}
          </p>
          <Shirt name={event.person1Name || event.eventTitle} number={age} reduce={reduce} />
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {dateLine && <Score label="Date" value={dateLine} />}
            {event.mainStartTime && <Score label="Kick-off" value={event.mainStartTime} />}
            {event.city && <Score label="Venue" value={event.city.slice(0, 10).toUpperCase()} />}
          </div>
        </div>
      </section>

      {/* ── Team sheet ─────────────────────────────────────────────── */}
      {showStory && (
        <section className="relative mx-auto max-w-5xl px-6 py-16 sm:py-20">
          <ChalkLine className="mb-10" />
          <div className="grid gap-10 md:grid-cols-[1fr,1fr]">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: GOLD }}>
                Team sheet
              </p>
              <motion.h2
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: EASE }}
                className="mt-4 font-condensed text-[clamp(1.8rem,4vw,3rem)] leading-[1.05] tracking-[0.04em]"
                style={{ color: FLOOD }}
              >
                {invitation}
              </motion.h2>
            </div>
            <div
              className="p-6"
              style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${CHALK}22` }}
            >
              <dl className="space-y-3">
                {[
                  ["Player", event.person1Name || event.eventTitle],
                  ["Squad number", age],
                  ["Position", "Striker"],
                  ["Home ground", event.city || "—"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-4 border-b pb-2" style={{ borderColor: `${CHALK}22` }}>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: `${CHALK}99` }}>
                      {k}
                    </dt>
                    <dd className="font-condensed text-xl tracking-[0.06em]" style={{ color: FLOOD }}>
                      {v}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-5 font-sans text-sm leading-relaxed" style={{ color: `${CHALK}bb` }}>
                {story}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ── Fixture list ───────────────────────────────────────────── */}
      {showFixtures && (
        <section className="relative mx-auto max-w-5xl px-6 py-14 sm:py-18">
          <ChalkLine className="mb-9" />
          <header className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="font-condensed text-3xl tracking-[0.08em] sm:text-4xl" style={{ color: FLOOD }}>
              Fixture list
            </h2>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em]" style={{ color: GOLD }}>
              {subEvents.length} in the squad
            </p>
          </header>
          <FixtureList items={subEvents} reduce={reduce} />
        </section>
      )}

      {/* ── The tifo banner ───────────────────────────────────────── */}
      <section className="relative overflow-hidden py-14" style={{ background: PITCH }}>
        <div aria-hidden className="absolute inset-0" style={{ background: TURF }} />
        <motion.p
          initial={reduce ? false : { opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          className="relative px-6 text-center font-condensed text-[clamp(1.8rem,7vw,4.5rem)] leading-none tracking-[0.06em]"
          style={{ color: GOLD, textShadow: `0 3px 0 ${NIGHT}` }}
        >
          {(event.person1Name || event.eventTitle).toUpperCase()} · {age} · ALL DAY
        </motion.p>
      </section>

      {/* ── Matchday programme ───────────────────────────────────── */}
      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <header className="mb-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: GOLD }}>
              Matchday programme
            </p>
            <h2 className="mt-2 font-condensed text-3xl tracking-[0.08em]" style={{ color: FLOOD }}>
              Season highlights
            </h2>
          </header>
          {galleryItems.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {galleryItems.map((m, i) => (
                <motion.figure
                  key={`${m.fileName}-${i}`}
                  initial={reduce ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-8% 0px" }}
                  transition={{ duration: 0.65, delay: (i % 3) * 0.08, ease: EASE }}
                  className="group overflow-hidden"
                  style={{ border: `1px solid ${CHALK}22`, background: "rgba(255,255,255,0.04)" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={m.publicUrl}
                    alt={m.caption ?? ""}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <figcaption
                    className="flex items-center justify-between gap-3 px-4 py-3 font-condensed text-lg tracking-[0.06em]"
                    style={{ color: FLOOD }}
                  >
                    <span>{m.caption || "Highlight"}</span>
                    <span className="font-mono text-[10px]" style={{ color: GOLD }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </figcaption>
                </motion.figure>
              ))}
            </div>
          ) : (
            <div
              className="flex h-44 items-center justify-center border border-dashed font-condensed text-2xl tracking-[0.08em]"
              style={{ borderColor: `${CHALK}44`, color: `${CHALK}99` }}
            >
              + Add season highlights
            </div>
          )}
        </section>
      )}

      {/* ── Stadium info ─────────────────────────────────────────── */}
      {showVenue && (
        <section className="relative mx-auto max-w-5xl px-6 py-14 sm:py-18">
          <ChalkLine className="mb-9" />
          <div className="grid gap-7 sm:grid-cols-[1fr,1.3fr]">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: GOLD }}>
                The ground
              </p>
              <h2 className="mt-3 font-condensed text-3xl tracking-[0.06em]" style={{ color: FLOOD }}>
                {event.venueName || "The stadium"}
              </h2>
              {event.venueAddress && (
                <p className="mt-2 font-sans text-sm" style={{ color: `${CHALK}bb` }}>
                  {event.venueAddress}
                </p>
              )}
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: `${CHALK}99` }}>
                Gates open 20 minutes before kick-off
              </p>
            </div>
            <div style={{ border: `1px solid ${CHALK}33` }}>
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

      {/* ── Claim your ticket ───────────────────────────────────── */}
      <section className="relative px-6 py-16 text-center sm:py-24">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mx-auto max-w-md px-8 py-10"
          style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${GOLD}66` }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: GOLD }}>
            Claim your ticket
          </p>
          <h2 className="mt-4 font-condensed text-3xl tracking-[0.06em]" style={{ color: FLOOD }}>
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
              className="mt-7 inline-block px-10 py-3.5 font-condensed text-xl tracking-[0.14em] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
              style={{ background: GOLD, color: NIGHT, outlineColor: FLOOD }}
            >
              I'll be there
            </a>
          )}
          {(event.contactName || event.contactPhone) && (
            <p className="mt-6 font-mono text-[11px] tracking-[0.18em]" style={{ color: `${CHALK}99` }}>
              {[event.contactName, event.contactPhone].filter(Boolean).join(" · ")}
            </p>
          )}
        </motion.div>
      </section>

      <footer className="relative" style={{ background: PITCH }}>
        <div aria-hidden className="absolute inset-0" style={{ background: TURF }} />
        <div className="relative flex flex-wrap items-center justify-between gap-3 px-6 py-6">
          <p className="font-condensed text-xl tracking-[0.08em]" style={{ color: FLOOD }}>
            {event.eventTitle}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em]" style={{ color: GOLD }}>
            Full time
          </p>
        </div>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default MatchdayTemplate;
