"use client";

import { useMemo, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { HeroMedia } from "@/components/ui/HeroMedia";
import { MapEmbed } from "@/components/ui/MapEmbed";
import { MusicToggle } from "@/components/ui/MusicToggle";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { useEditMode } from "@/components/edit/EditContext";
import type { TemplateComponent, SubEvent } from "@/lib/types";

/* ── Ludo · the party as a board game ─────────────────────────────────────
 * Palette   board cream #f7f1e3 · red #d94a3d · yellow #f2b13c
 *           green #3f9d63 · blue #2f6fb3 · ink #23201c
 * Type      Permanent Marker (name, numbers) / Inter (rules) / Caveat (asides)
 * Layout    a printed board — the plan IS the path, squares in sequence with
 *           a home square at the centre of the hero.
 * Signature the counter: a token that advances square by square down the board
 *           as you scroll, and dice that settle on the number of events.
 * ──────────────────────────────────────────────────────────────────────── */

const EASE = [0.16, 1, 0.3, 1] as const;
const BOARD = "#f7f1e3";
const RED = "#d94a3d";
const YELLOW = "#f2b13c";
const GREEN = "#3f9d63";
const BLUE = "#2f6fb3";
const INK = "#23201c";
const COLOURS = [RED, GREEN, YELLOW, BLUE];

/** A die showing `n` pips. */
function Die({ n, size = 56, spin, reduce }: { n: number; size?: number; spin?: boolean; reduce: boolean }) {
  const layouts: Record<number, [number, number][]> = {
    1: [[50, 50]],
    2: [[30, 30], [70, 70]],
    3: [[30, 30], [50, 50], [70, 70]],
    4: [[30, 30], [70, 30], [30, 70], [70, 70]],
    5: [[30, 30], [70, 30], [50, 50], [30, 70], [70, 70]],
    6: [[30, 25], [70, 25], [30, 50], [70, 50], [30, 75], [70, 75]],
  };
  const pips = layouts[Math.min(Math.max(n, 1), 6)] ?? layouts[1];
  return (
    <motion.svg
      aria-hidden
      viewBox="0 0 100 100"
      width={size}
      height={size}
      animate={reduce || !spin ? undefined : { rotate: [0, -14, 10, 0] }}
      transition={{ duration: 1.6, delay: 0.4, ease: "easeOut" }}
    >
      <rect x="4" y="4" width="92" height="92" rx="16" fill="#fff" stroke={INK} strokeWidth="4" />
      {pips.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="8" fill={INK} />
      ))}
    </motion.svg>
  );
}

/** SIGNATURE — sub-events as board squares with a token that advances. */
function BoardPath({ items, reduce }: { items: SubEvent[]; reduce: boolean }) {
  const sorted = [...items].sort((a, b) => a.order - b.order);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 70%"] });
  const tokenTop = useTransform(scrollYProgress, [0, 1], ["0%", "92%"]);

  return (
    <div ref={ref} className="relative pl-12 sm:pl-16">
      {/* the track the token runs down */}
      <div
        aria-hidden
        className="absolute bottom-0 left-4 top-0 w-3 rounded-full sm:left-6"
        style={{ background: `repeating-linear-gradient(180deg, ${INK}22 0 10px, transparent 10px 20px)` }}
      />
      <motion.div
        aria-hidden
        className="absolute left-4 z-10 -ml-[9px] sm:left-6"
        style={reduce ? { top: "46%" } : { top: tokenTop }}
      >
        {/* the counter */}
        <span
          className="block h-8 w-8 rounded-full"
          style={{
            background: `radial-gradient(circle at 34% 30%, #fff8, ${RED} 60%)`,
            border: `3px solid ${INK}`,
            boxShadow: `0 6px 10px -4px ${INK}`,
          }}
        />
      </motion.div>

      <ol className="space-y-5">
        {sorted.map((s, i) => {
          const c = COLOURS[i % COLOURS.length];
          return (
            <motion.li
              key={`${s.order}-${s.name}`}
              initial={reduce ? false : { opacity: 0, x: 18, rotate: 0 }}
              whileInView={{ opacity: 1, x: 0, rotate: i % 2 ? 0.6 : -0.7 }}
              viewport={{ once: true, margin: "-12% 0px" }}
              transition={{ duration: 0.6, delay: (i % 4) * 0.06, ease: EASE }}
              className="relative rounded-2xl p-5 sm:p-6"
              style={{
                background: "#fff",
                border: `4px solid ${c}`,
                boxShadow: `6px 6px 0 0 ${c}44`,
              }}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <p className="font-marker text-xl" style={{ color: c }}>
                  Square {s.order}
                </p>
                <p className="font-sans text-[11px] uppercase tracking-[0.22em]" style={{ color: `${INK}99` }}>
                  {[s.date, [s.startTime, s.endTime].filter(Boolean).join("–")].filter(Boolean).join(" · ")}
                </p>
              </div>
              <h3 className="mt-2 flex items-center gap-2 font-marker text-2xl leading-tight" style={{ color: INK }}>
                {s.icon && <span className="text-2xl">{s.icon}</span>}
                {s.name}
              </h3>
              {s.venueName && (
                <p className="mt-1 font-hand text-xl" style={{ color: c }}>
                  {s.venueName}
                </p>
              )}
              {s.description && (
                <p className="mt-2 font-sans text-sm leading-relaxed" style={{ color: `${INK}c4` }}>
                  {s.description}
                </p>
              )}
              {s.dressCode && (
                <p
                  className="mt-3 inline-block rounded-full px-3 py-1 font-sans text-[10px] uppercase tracking-[0.2em]"
                  style={{ background: `${c}22`, color: INK }}
                >
                  {s.dressCode}
                </p>
              )}
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}

export const LudoTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || RED;
  const tagline = event.tagline?.trim() || "Four players, one afternoon";
  const invitation =
    event.invitationMessage?.trim() ||
    "Roll a six and you're in. There will be teams, there will be arguing about the rules, and there will be cake at the end.";
  const story =
    event.aboutStory?.trim() ||
    "Undefeated at Ludo since the age of five, largely because he changes the rules mid-game. Come try your luck.";
  const hero = event.heroImageUrl || "/samples/confetti.jpg";

  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);

  const showStory = !event.hideStory;
  const showBoard = !event.hideEvents && subEvents.length > 0;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);
  const showVenue = !event.hideVenue;

  const ageMatch = event.eventTitle.match(/\d{1,3}/);
  const age = ageMatch?.[0] ?? "";
  const dateLine = event.mainDate
    ? new Date(event.mainDate).toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" })
    : "";

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-sans antialiased"
      style={{ "--accent": accent, background: BOARD, color: INK } as React.CSSProperties}
    >
      <ScrollProgress color={accent} />

      {/* ── Hero: the board, with home at the centre ───────────────── */}
      <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden pb-24 sm:pb-28">
        <div className="absolute inset-0">
          <HeroMedia
            imageSrc={hero}
            videoSrc={event.heroVideoUrl || undefined}
            alt={event.eventTitle}
            className="opacity-25"
          />
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${BOARD}f2, ${BOARD}cc 45%, ${BOARD}fa)` }} />
        </div>

        {/* four corner bases */}
        {[
          ["left-4 top-4 sm:left-10 sm:top-10", RED],
          ["right-4 top-4 sm:right-10 sm:top-10", GREEN],
          ["left-4 bottom-28 sm:left-10 sm:bottom-32", BLUE],
          ["right-4 bottom-28 sm:right-10 sm:bottom-32", YELLOW],
        ].map(([pos, c]) => (
          <div
            key={pos}
            aria-hidden
            className={`absolute h-20 w-20 rounded-2xl sm:h-28 sm:w-28 ${pos}`}
            style={{ background: `${c}33`, border: `4px solid ${c}` }}
          >
            <span
              className="absolute left-1/2 top-1/2 block h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-8 sm:w-8"
              style={{ background: c as string, border: `3px solid ${INK}` }}
            />
          </div>
        ))}

        <div className="relative z-10 px-6 text-center">
          <p className="font-hand text-2xl" style={{ color: `${INK}aa` }}>
            {tagline}
          </p>
          <motion.h1
            initial={reduce ? false : { opacity: 0, scale: 0.94, rotate: -3 }}
            animate={{ opacity: 1, scale: 1, rotate: -1.5 }}
            transition={{ duration: 0.8, delay: 0.25, ease: EASE }}
            className="mt-4 font-marker text-[clamp(2.6rem,11vw,6rem)] leading-[0.96]"
            style={{ color: INK, textShadow: `4px 4px 0 ${YELLOW}` }}
          >
            {event.person1Name || event.eventTitle}
          </motion.h1>

          {/* home square with the age */}
          {age && (
            <motion.div
              initial={reduce ? false : { opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.55, ease: EASE }}
              className="mx-auto mt-8 flex h-28 w-28 rotate-45 items-center justify-center sm:h-32 sm:w-32"
              style={{ background: "#fff", border: `5px solid ${INK}` }}
            >
              <span className="-rotate-45 font-marker text-5xl sm:text-6xl" style={{ color: RED }}>
                {age}
              </span>
            </motion.div>
          )}

          <div className="mt-9 flex items-center justify-center gap-4">
            <Die n={Math.max(1, Math.min(subEvents.length || 3, 6))} spin reduce={reduce} />
            <Die n={Math.max(1, Math.min(Number(age) % 7 || 4, 6))} spin reduce={reduce} />
          </div>

          {dateLine && (
            <p className="mt-8 font-sans text-[11px] uppercase tracking-[0.3em]" style={{ color: `${INK}b0` }}>
              {[dateLine, event.mainStartTime, event.city].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
      </section>

      {/* ── The rules (story) ─────────────────────────────────────── */}
      {showStory && (
        <section className="relative px-6 py-20 sm:py-28">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20, rotate: 0 }}
            whileInView={{ opacity: 1, y: 0, rotate: -0.8 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, ease: EASE }}
            className="mx-auto max-w-2xl rounded-3xl p-8 sm:p-12"
            style={{ background: "#fff", border: `5px solid ${BLUE}`, boxShadow: `8px 8px 0 0 ${BLUE}33` }}
          >
            <p className="font-marker text-xl" style={{ color: BLUE }}>
              The rules
            </p>
            <h2 className="mt-4 font-marker text-2xl leading-snug sm:text-3xl" style={{ color: INK }}>
              {invitation}
            </h2>
            <ol className="mt-6 space-y-2 font-sans text-sm" style={{ color: `${INK}c8` }}>
              {[
                "Everybody plays. Nobody sits out.",
                "The birthday player always goes first.",
                "Cake counts as a shortcut.",
                "House rules beat real rules.",
              ].map((r, i) => (
                <li key={r} className="flex gap-3">
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-sans text-[11px] font-semibold text-white"
                    style={{ background: COLOURS[i % COLOURS.length] }}
                  >
                    {i + 1}
                  </span>
                  {r}
                </li>
              ))}
            </ol>
            <p className="mt-6 font-hand text-xl" style={{ color: BLUE }}>
              {story}
            </p>
          </motion.div>
        </section>
      )}

      {/* ── The board (plan) ─────────────────────────────────────── */}
      {showBoard && (
        <section className="relative mx-auto max-w-3xl px-5 py-16 sm:px-6 sm:py-20">
          <h2 className="mb-9 font-marker text-3xl sm:text-4xl" style={{ color: INK }}>
            The board
          </h2>
          <BoardPath items={subEvents} reduce={reduce} />
        </section>
      )}

      {/* ── Player cards (gallery) ───────────────────────────────── */}
      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <h2 className="mb-9 font-marker text-3xl" style={{ color: GREEN }}>
            The players
          </h2>
          {galleryItems.length > 0 ? (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {galleryItems.map((m, i) => {
                const c = COLOURS[i % COLOURS.length];
                return (
                  <motion.figure
                    key={`${m.fileName}-${i}`}
                    initial={reduce ? false : { opacity: 0, y: 20, rotate: 0 }}
                    whileInView={{ opacity: 1, y: 0, rotate: i % 2 ? 1.4 : -1.4 }}
                    viewport={{ once: true, margin: "-8% 0px" }}
                    transition={{ duration: 0.65, delay: (i % 3) * 0.08, ease: EASE }}
                    className="rounded-2xl p-3"
                    style={{ background: "#fff", border: `4px solid ${c}`, boxShadow: `6px 6px 0 0 ${c}33` }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={m.publicUrl}
                      alt={m.caption ?? ""}
                      loading="lazy"
                      className="aspect-square w-full rounded-xl object-cover"
                    />
                    <figcaption className="pt-3 text-center font-hand text-xl" style={{ color: INK }}>
                      {m.caption || "player joined"}
                    </figcaption>
                  </motion.figure>
                );
              })}
            </div>
          ) : (
            <div
              className="flex h-44 items-center justify-center rounded-2xl border-4 border-dashed font-hand text-2xl"
              style={{ borderColor: `${GREEN}88`, color: `${INK}88` }}
            >
              + add the players
            </div>
          )}
        </section>
      )}

      {/* ── Where the board is set up ───────────────────────────── */}
      {showVenue && (
        <section className="relative mx-auto max-w-4xl px-6 py-16 sm:py-20">
          <div
            className="rounded-3xl p-6 sm:p-8"
            style={{ background: "#fff", border: `5px solid ${YELLOW}`, boxShadow: `8px 8px 0 0 ${YELLOW}33` }}
          >
            <h2 className="font-marker text-3xl" style={{ color: INK }}>
              {event.venueName || "The table"}
            </h2>
            {event.venueAddress && (
              <p className="mt-2 font-sans text-sm" style={{ color: `${INK}b8` }}>
                {event.venueAddress}
              </p>
            )}
            <div className="mt-5 overflow-hidden rounded-2xl" style={{ border: `4px solid ${INK}22` }}>
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

      {/* ── Roll to join (RSVP) ────────────────────────────────── */}
      <section className="relative px-6 py-20 text-center sm:py-28">
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mx-auto max-w-md rounded-3xl px-8 py-12"
          style={{ background: "#fff", border: `5px solid ${RED}`, boxShadow: `8px 8px 0 0 ${RED}33` }}
        >
          <div className="mx-auto mb-5 flex justify-center">
            <Die n={6} size={64} reduce={reduce} />
          </div>
          <h2 className="font-marker text-3xl" style={{ color: INK }}>
            Roll a six and join
          </h2>
          <p className="mt-3 font-hand text-xl" style={{ color: `${INK}a8` }}>
            {event.eventTitle}
          </p>
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
              className="mt-7 inline-block rounded-full px-9 py-3.5 font-marker text-xl text-white transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
              style={{ background: RED, outlineColor: INK }}
            >
              I&apos;m playing
            </a>
          )}
          {(event.contactName || event.contactPhone) && (
            <p className="mt-6 font-sans text-xs" style={{ color: `${INK}99` }}>
              {[event.contactName, event.contactPhone].filter(Boolean).join(" · ")}
            </p>
          )}
        </motion.div>
      </section>

      <footer className="relative">
        <div aria-hidden className="flex h-6">
          {Array.from({ length: 16 }, (_, i) => (
            <span key={i} className="flex-1" style={{ background: COLOURS[i % COLOURS.length], opacity: 0.85 }} />
          ))}
        </div>
        <p className="py-6 text-center font-marker text-lg" style={{ color: INK }}>
          {event.eventTitle}
        </p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default LudoTemplate;
