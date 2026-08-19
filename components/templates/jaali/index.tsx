"use client";

import { useMemo, useRef } from "react";
import type { MotionValue } from "framer-motion";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { HeroMedia } from "@/components/ui/HeroMedia";
import { MapEmbed } from "@/components/ui/MapEmbed";
import { MusicToggle } from "@/components/ui/MusicToggle";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { useEditMode } from "@/components/edit/EditContext";
import type { TemplateComponent, SubEvent } from "@/lib/types";

/* ── Jaali · lattice screen + blue pottery ────────────────────────────────
 * Palette   cobalt #1f4b8f · turquoise #2f9aa8 · sandstone #d8b98c
 *           glaze white #f6f4ef · night indigo #16224a
 * Type      Playfair (names, arches) / Inter (body) / tracked caps (times)
 * Layout    an eight-point-star grid; sections are arches, and the carved
 *           screen stays present down both margins of the page.
 * Signature the jaali opens: the lattice bars thin and the apertures widen as
 *           the page scrolls, so the hero is read *through* the screen first.
 * ──────────────────────────────────────────────────────────────────────── */

const EASE = [0.16, 1, 0.3, 1] as const;
const COBALT = "#1f4b8f";
const TURQ = "#2f9aa8";
const SAND = "#d8b98c";
const GLAZE = "#f6f4ef";
const NIGHT = "#16224a";

/** The carved screen. `bar` is the stone thickness — smaller = more open. */
function JaaliPattern({ id, bar, color }: { id: string; bar: MotionValue<number> | number; color: string }) {
  const isMotion = typeof bar !== "number";
  const Rect = isMotion ? motion.rect : "rect";
  const barProps = isMotion ? { style: { width: bar as MotionValue<number> } } : { width: bar as number };
  const barPropsV = isMotion ? { style: { height: bar as MotionValue<number> } } : { height: bar as number };
  return (
    <defs>
      <pattern id={id} width="48" height="48" patternUnits="userSpaceOnUse">
        {/* the frame of each cell */}
        <Rect x="0" y="0" height="48" fill={color} {...(barProps as object)} />
        <Rect x="0" y="0" width="48" fill={color} {...(barPropsV as object)} />
        {/* the eight-point star at the centre of the cell */}
        <path
          d="M24 8 L28 20 L40 24 L28 28 L24 40 L20 28 L8 24 L20 20 Z"
          fill={color}
          opacity="0.92"
        />
        <path d="M24 15 L26 22 L33 24 L26 26 L24 33 L22 26 L15 24 L22 22 Z" fill={GLAZE} opacity="0.55" />
      </pattern>
    </defs>
  );
}

/** A cusped Mughal arch as a container. */
function Arch({
  children,
  className,
  tone = GLAZE,
}: {
  children: React.ReactNode;
  className?: string;
  tone?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-t-[999px] px-6 pb-7 pt-12 sm:px-8 ${className ?? ""}`}
      style={{
        background: tone,
        border: `1px solid ${COBALT}33`,
        boxShadow: `inset 0 0 0 4px ${GLAZE}, inset 0 0 0 5px ${TURQ}44, 0 20px 40px -32px ${NIGHT}`,
      }}
    >
      {children}
    </div>
  );
}

/** Hairline crackle-glaze tile background. */
const CRACKLE =
  `radial-gradient(circle at 30% 20%, rgba(47,154,168,0.10), transparent 45%),` +
  `radial-gradient(circle at 75% 70%, rgba(31,75,143,0.10), transparent 50%)`;

function Tile({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`relative p-6 ${className ?? ""}`}
      style={{
        background: GLAZE,
        backgroundImage: CRACKLE,
        border: `1px solid ${COBALT}22`,
        boxShadow: `0 14px 30px -26px ${NIGHT}`,
      }}
    >
      {children}
    </div>
  );
}

/** Sub-events as a row of arches. */
function ArchRow({ items, accent, reduce }: { items: SubEvent[]; accent: string; reduce: boolean }) {
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <ol className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
      {sorted.map((s, i) => (
        <motion.li
          key={`${s.order}-${s.name}`}
          initial={reduce ? false : { opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.7, delay: (i % 3) * 0.09, ease: EASE }}
        >
          <Arch className="h-full">
            <div className="text-center">
              <span
                className="mx-auto flex h-9 w-9 items-center justify-center rounded-full font-sans text-xs text-white"
                style={{ background: COBALT }}
              >
                {String(s.order).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-display text-2xl leading-tight" style={{ color: COBALT }}>
                {s.name}
              </h3>
              <p className="mt-2 font-sans text-[10px] uppercase tracking-[0.26em]" style={{ color: accent }}>
                {[s.date, [s.startTime, s.endTime].filter(Boolean).join("–")].filter(Boolean).join(" · ")}
              </p>
              {s.venueName && (
                <p className="mt-2 font-display text-lg" style={{ color: TURQ }}>
                  {s.venueName}
                </p>
              )}
              {s.description && (
                <p className="mt-3 font-sans text-sm leading-relaxed" style={{ color: "#4a5164" }}>
                  {s.description}
                </p>
              )}
              {s.dressCode && (
                <p
                  className="mt-4 inline-block px-2.5 py-1 font-sans text-[10px] uppercase tracking-[0.2em]"
                  style={{ background: `${SAND}55`, color: NIGHT }}
                >
                  {s.dressCode}
                </p>
              )}
            </div>
          </Arch>
        </motion.li>
      ))}
    </ol>
  );
}

export const JaaliTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || COBALT;
  const tagline = event.tagline?.trim() || "Light through carved stone";
  const invitation =
    event.invitationMessage?.trim() ||
    "With the blessings of both our families, we invite you to the courtyard — for the nikah, and for everything after it.";
  const story =
    event.aboutStory?.trim() ||
    "Geometry, patience and a great deal of tea. Our families took their time; the pattern that came out of it fits perfectly.";
  const hero = event.heroImageUrl || "/samples/stained-glass.jpg";

  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const names = [event.person1Name, event.person2Name].filter(Boolean).join(" & ");

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  // SIGNATURE — the stone thins from 16 to 3 as the hero scrolls away.
  const bar = useTransform(heroP, [0, 1], [16, 3]);
  const screenFade = useTransform(heroP, [0, 0.85], [0.92, 0.25]);

  const showStory = !event.hideStory;
  const showArches = !event.hideEvents && subEvents.length > 0;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);
  const showVenue = !event.hideVenue;

  const dateLine = event.mainDate
    ? new Date(event.mainDate).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : "";

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-sans antialiased"
      style={{ "--accent": accent, background: GLAZE, color: NIGHT } as React.CSSProperties}
    >
      <ScrollProgress color={accent} />

      {/* the screen stays present down both margins */}
      {[0, 1].map((side) => (
        <svg
          key={side}
          aria-hidden
          className={`pointer-events-none fixed top-0 z-20 hidden h-full w-8 sm:block ${side ? "right-0" : "left-0"}`}
          style={{ opacity: 0.5 }}
        >
          <JaaliPattern id={`jaali-edge-${side}`} bar={6} color={`${COBALT}66`} />
          <rect width="100%" height="100%" fill={`url(#jaali-edge-${side})`} />
        </svg>
      ))}

      {/* ── Hero: read through the closed jaali ─────────────────────── */}
      <section
        ref={heroRef}
        className="relative flex min-h-[100svh] items-center justify-center overflow-hidden pb-24 sm:pb-28"
        style={{ background: NIGHT }}
      >
        <div className="absolute inset-0">
          <HeroMedia
            imageSrc={hero}
            videoSrc={event.heroVideoUrl || undefined}
            alt={event.eventTitle}
            className="opacity-55"
          />
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(180deg, ${NIGHT}c4 0%, ${NIGHT}80 40%, ${NIGHT}f0 100%)` }}
          />
        </div>

        {/* the carved screen itself */}
        <motion.svg
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full"
          style={reduce ? { opacity: 0.55 } : { opacity: screenFade }}
        >
          <JaaliPattern id="jaali-hero" bar={reduce ? 8 : bar} color={SAND} />
          <rect width="100%" height="100%" fill="url(#jaali-hero)" />
        </motion.svg>

        {/* light falling through the screen onto the floor */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
          style={{ background: `linear-gradient(0deg, ${SAND}33, transparent)` }}
        />

        <div className="relative z-10 px-8 text-center">
          <p className="font-sans text-[10px] uppercase tracking-[0.46em]" style={{ color: SAND }}>
            {tagline}
          </p>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.3, ease: EASE }}
            className="mt-7 font-display text-[clamp(2.5rem,9vw,5.8rem)] leading-[1.02]"
            style={{ color: GLAZE, textShadow: `0 2px 24px ${NIGHT}` }}
          >
            {names || event.eventTitle}
          </motion.h1>
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="mt-9"
          >
            <div aria-hidden className="mx-auto mb-7 h-8 w-8 rotate-45" style={{ background: TURQ, opacity: 0.85 }} />
            {dateLine && (
              <p className="font-sans text-[11px] uppercase tracking-[0.34em]" style={{ color: SAND }}>
                {dateLine}
                {event.city ? ` · ${event.city}` : ""}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── The niche: story on blue pottery ───────────────────────── */}
      {showStory && (
        <section className="relative px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-3xl">
            <Arch>
              <div className="text-center">
                <p className="font-sans text-[10px] uppercase tracking-[0.4em]" style={{ color: TURQ }}>
                  In the niche
                </p>
                <motion.h2
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, ease: EASE }}
                  className="mt-5 font-display text-2xl leading-snug sm:text-3xl"
                  style={{ color: COBALT }}
                >
                  {invitation}
                </motion.h2>
                <div className="mx-auto my-8 flex items-center justify-center gap-3">
                  <span className="h-px w-12" style={{ background: `${COBALT}55` }} />
                  <span className="h-3 w-3 rotate-45" style={{ background: SAND }} />
                  <span className="h-px w-12" style={{ background: `${COBALT}55` }} />
                </div>
                <p className="font-sans text-sm leading-loose sm:text-base" style={{ color: "#4a5164" }}>
                  {story}
                </p>
              </div>
            </Arch>
          </div>
        </section>
      )}

      {/* ── The arcade of days ─────────────────────────────────────── */}
      {showArches && (
        <section className="relative mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <header className="mb-10 text-center">
            <p className="font-sans text-[10px] uppercase tracking-[0.4em]" style={{ color: TURQ }}>
              The arcade
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl" style={{ color: COBALT }}>
              Every day, an arch
            </h2>
          </header>
          <ArchRow items={subEvents} accent={accent} reduce={reduce} />
        </section>
      )}

      {/* ── Photographs in cusped frames ──────────────────────────── */}
      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <h2 className="mb-9 text-center font-display text-3xl" style={{ color: COBALT }}>
            Framed in stone
          </h2>
          {galleryItems.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {galleryItems.map((m, i) => (
                <motion.figure
                  key={`${m.fileName}-${i}`}
                  initial={reduce ? false : { opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-8% 0px" }}
                  transition={{ duration: 0.7, delay: (i % 3) * 0.09, ease: EASE }}
                  className="group text-center"
                >
                  <div
                    className="overflow-hidden rounded-t-[999px] p-2"
                    style={{ background: GLAZE, border: `2px solid ${COBALT}44` }}
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
                    <figcaption className="mt-3 font-sans text-[10px] uppercase tracking-[0.26em]" style={{ color: TURQ }}>
                      {m.caption}
                    </figcaption>
                  )}
                </motion.figure>
              ))}
            </div>
          ) : (
            <div
              className="flex h-44 items-center justify-center rounded-t-[999px] border-2 border-dashed font-sans text-sm"
              style={{ borderColor: `${COBALT}44`, color: "#5b6274" }}
            >
              + Add photographs
            </div>
          )}
        </section>
      )}

      {/* ── The glazed plaque ─────────────────────────────────────── */}
      {showVenue && (
        <section className="relative mx-auto max-w-4xl px-6 py-16 sm:py-20">
          <Tile>
            <div className="text-center">
              <p className="font-sans text-[10px] uppercase tracking-[0.36em]" style={{ color: TURQ }}>
                The courtyard
              </p>
              <h2 className="mt-3 font-display text-3xl" style={{ color: COBALT }}>
                {event.venueName || "The venue"}
              </h2>
              {event.venueAddress && (
                <p className="mt-2 font-sans text-sm" style={{ color: "#4a5164" }}>
                  {event.venueAddress}
                </p>
              )}
            </div>
            <div className="mt-6" style={{ border: `1px solid ${COBALT}33` }}>
              <MapEmbed
                latitude={event.latitude}
                longitude={event.longitude}
                venueName={event.venueName}
                venueAddress={event.venueAddress}
                mapLink={event.mapLink}
              />
            </div>
          </Tile>
        </section>
      )}

      {/* ── The pressed tile (RSVP) ───────────────────────────────── */}
      <section className="relative px-6 py-20 text-center sm:py-28">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mx-auto max-w-md px-8 py-12"
          style={{
            background: `linear-gradient(160deg, ${COBALT}, #17356a)`,
            boxShadow: `inset 0 0 0 5px ${GLAZE}22, 0 26px 50px -34px ${NIGHT}`,
          }}
        >
          <div aria-hidden className="mx-auto mb-6 h-7 w-7 rotate-45" style={{ background: SAND }} />
          <p className="font-sans text-[10px] uppercase tracking-[0.38em]" style={{ color: SAND }}>
            Join us
          </p>
          <h2 className="mt-4 font-display text-3xl" style={{ color: GLAZE }}>
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
              className="mt-8 inline-block px-10 py-3.5 font-sans text-[11px] uppercase tracking-[0.3em] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
              style={{ background: SAND, color: NIGHT, outlineColor: GLAZE }}
            >
              Accept with pleasure
            </a>
          )}
          {(event.contactName || event.contactPhone) && (
            <p className="mt-6 font-sans text-xs" style={{ color: `${GLAZE}b0` }}>
              {[event.contactName, event.contactPhone].filter(Boolean).join(" · ")}
            </p>
          )}
        </motion.div>
      </section>

      {/* ── The screen, fully open ───────────────────────────────── */}
      <footer className="relative" style={{ background: NIGHT }}>
        <svg aria-hidden className="h-16 w-full">
          <JaaliPattern id="jaali-footer" bar={3} color={`${SAND}99`} />
          <rect width="100%" height="100%" fill="url(#jaali-footer)" />
        </svg>
        <p className="py-6 text-center font-sans text-[11px] tracking-[0.22em]" style={{ color: `${GLAZE}99` }}>
          {event.eventTitle}
          {names ? ` · ${names}` : ""}
        </p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default JaaliTemplate;
