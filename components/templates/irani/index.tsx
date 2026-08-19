"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { HeroMedia } from "@/components/ui/HeroMedia";
import { MapEmbed } from "@/components/ui/MapEmbed";
import { MusicToggle } from "@/components/ui/MusicToggle";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { useEditMode } from "@/components/edit/EditContext";
import type { TemplateComponent, SubEvent } from "@/lib/types";

/* ── Irani · Bombay café deco ─────────────────────────────────────────────
 * Palette   mint wall #a8c8b8 · bentwood #6b3f22 · signage red #c0392b
 *           cream #f4eee2 · floor black #1c1a17
 * Type      Bebas Neue (signage, board) / Cormorant (menu copy) /
 *           mono (timings) / Inter (utility)
 * Layout    a café interior — chequered floor band, mint panelled walls, and
 *           a board on the wall that holds the schedule.
 * Signature the split-flap board: each row flips down on its hinge as the
 *           board comes into view, the way a station board changes.
 * ──────────────────────────────────────────────────────────────────────── */

const EASE = [0.16, 1, 0.3, 1] as const;
const MINT = "#a8c8b8";
const MINT_DEEP = "#7fa894";
const WOOD = "#6b3f22";
const RED = "#c0392b";
const CREAM = "#f4eee2";
const FLOOR = "#1c1a17";

const CHEQUER =
  `repeating-conic-gradient(${FLOOR} 0% 25%, ${CREAM} 0% 50%) 50% / 34px 34px`;

/** Chequered floor band. */
function Chequer({ className }: { className?: string }) {
  return <div aria-hidden className={`h-8 w-full ${className ?? ""}`} style={{ background: CHEQUER }} />;
}

/** Bentwood chair silhouette, used as a small ornament. */
function Chair({ size = 46, color = WOOD }: { size?: number; color?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 40 60" width={size} height={size * 1.4}>
      <path d="M8 6 q12 -6 24 0" fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
      <path d="M9 14 q11 -5 22 0" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="8" y1="6" x2="9" y2="30" stroke={color} strokeWidth="2.6" />
      <line x1="32" y1="6" x2="31" y2="30" stroke={color} strokeWidth="2.6" />
      <ellipse cx="20" cy="32" rx="14" ry="4.5" fill={color} />
      <line x1="9" y1="34" x2="6" y2="56" stroke={color} strokeWidth="2.4" />
      <line x1="31" y1="34" x2="34" y2="56" stroke={color} strokeWidth="2.4" />
      <line x1="15" y1="35" x2="14" y2="56" stroke={color} strokeWidth="1.8" opacity="0.7" />
      <line x1="25" y1="35" x2="26" y2="56" stroke={color} strokeWidth="1.8" opacity="0.7" />
    </svg>
  );
}

/** SIGNATURE — a split-flap row that flips down on its hinge. */
function Flap({
  left,
  right,
  sub,
  delay,
  reduce,
}: {
  left: string;
  right: string;
  sub?: string;
  delay: number;
  reduce: boolean;
}) {
  return (
    <div style={{ perspective: 800 }}>
      <motion.div
        initial={reduce ? false : { rotateX: -88, opacity: 0 }}
        whileInView={{ rotateX: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.5, delay, ease: EASE }}
        style={{ transformOrigin: "50% 0%", transformStyle: "preserve-3d" }}
        className="relative flex items-baseline justify-between gap-4 px-4 py-3 sm:px-6"
      >
        <span
          aria-hidden
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, #2b2a26 0 49%, #201f1c 49% 100%)" }}
        />
        <span
          aria-hidden
          className="absolute inset-x-0 top-1/2 h-px"
          style={{ background: "rgba(0,0,0,0.6)" }}
        />
        <span className="relative min-w-0">
          <span className="block truncate font-condensed text-2xl tracking-[0.1em]" style={{ color: CREAM }}>
            {left}
          </span>
          {sub && (
            <span className="block truncate font-sans text-[11px]" style={{ color: `${MINT}cc` }}>
              {sub}
            </span>
          )}
        </span>
        <span className="relative shrink-0 font-mono text-sm" style={{ color: "#f0b429" }}>
          {right}
        </span>
      </motion.div>
    </div>
  );
}

/** Sub-events as the board. */
function Board({ items, reduce }: { items: SubEvent[]; reduce: boolean }) {
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <div
      className="overflow-hidden rounded-sm p-3"
      style={{ background: "#141311", border: `10px solid ${WOOD}`, boxShadow: `0 26px 50px -34px ${FLOOR}` }}
    >
      <div className="mb-2 flex items-center justify-between px-3">
        <p className="font-condensed text-lg tracking-[0.28em]" style={{ color: "#f0b429" }}>
          TODAY&apos;S ORDER
        </p>
        <p className="font-mono text-[10px]" style={{ color: `${MINT}aa` }}>
          {sorted.length} items
        </p>
      </div>
      <div className="space-y-1.5">
        {sorted.map((s, i) => (
          <Flap
            key={`${s.order}-${s.name}`}
            left={`${String(s.order).padStart(2, "0")} · ${s.name}`}
            right={[s.startTime, s.endTime].filter(Boolean).join("–") || s.date || ""}
            sub={[s.venueName, s.dressCode].filter(Boolean).join(" · ") || s.description}
            delay={(i % 6) * 0.08}
            reduce={reduce}
          />
        ))}
      </div>
    </div>
  );
}

/** Mirror-etched signage panel. */
function Signage({ lines }: { lines: string[] }) {
  return (
    <div
      className="px-5 py-4"
      style={{
        background: "linear-gradient(160deg, rgba(255,255,255,0.5), rgba(255,255,255,0.14) 45%, rgba(255,255,255,0.42))",
        border: `3px solid ${WOOD}`,
        boxShadow: `inset 0 0 0 2px ${CREAM}88`,
      }}
    >
      {lines.map((l) => (
        <p
          key={l}
          className="text-center font-condensed text-sm tracking-[0.28em]"
          style={{ color: WOOD }}
        >
          {l}
        </p>
      ))}
    </div>
  );
}

export const IraniTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || RED;
  const tagline = event.tagline?.trim() || "Est. this Saturday";
  const invitation =
    event.invitationMessage?.trim() ||
    "We have booked the whole café — bentwood chairs, chequered floor, one very old ceiling fan. Come for the lagan, stay for the berry pulao.";
  const story =
    event.aboutStory?.trim() ||
    "We met at a corner table over bun maska and stayed until the cashier switched the lights off. Nine years later, the same table is reserved.";
  const hero = event.heroImageUrl || "/samples/wedding-cake.jpg";

  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const names = [event.person1Name, event.person2Name].filter(Boolean);
  const firstDress = subEvents.find((s) => s.dressCode)?.dressCode;

  const showStory = !event.hideStory;
  const showBoard = !event.hideEvents && subEvents.length > 0;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);
  const showVenue = !event.hideVenue;

  const dateLine = event.mainDate
    ? new Date(event.mainDate).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : "";

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-sans antialiased"
      style={{ "--accent": accent, background: MINT, color: FLOOR } as React.CSSProperties}
    >
      <ScrollProgress color={accent} />

      {/* ── Hero: the café front ───────────────────────────────────── */}
      <section className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pb-24 sm:pb-28">
        <div className="absolute inset-0">
          <HeroMedia
            imageSrc={hero}
            videoSrc={event.heroVideoUrl || undefined}
            alt={event.eventTitle}
            className="opacity-30"
          />
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(180deg, ${MINT}f0 0%, ${MINT_DEEP}c8 55%, ${MINT}f5 100%)` }}
          />
          {/* mint wall panelling */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background: `repeating-linear-gradient(90deg, transparent 0 118px, ${MINT_DEEP}66 118px 120px)`,
              opacity: 0.7,
            }}
          />
        </div>

        <div className="relative z-10 px-6 text-center">
          <p className="font-condensed text-sm tracking-[0.44em]" style={{ color: WOOD }}>
            {tagline.toUpperCase()}
          </p>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
            className="mx-auto mt-5 max-w-4xl font-condensed text-[clamp(2.8rem,12vw,7rem)] leading-[0.92] tracking-[0.03em]"
            style={{ color: RED, textShadow: `2px 2px 0 ${CREAM}` }}
          >
            {names.length === 2 ? `${names[0]} & ${names[1]}` : event.eventTitle}
          </motion.h1>

          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.7 }}
            className="mx-auto mt-8 max-w-md"
          >
            <Signage
              lines={[
                dateLine || "DATE TO BE FIXED",
                [event.mainStartTime, event.city].filter(Boolean).join(" · ") || "",
              ].filter(Boolean)}
            />
          </motion.div>

          <div className="mt-9 flex items-end justify-center gap-6 opacity-90">
            <Chair size={38} />
            <Chair size={46} />
            <Chair size={38} />
          </div>
        </div>
        <Chequer className="absolute bottom-0 left-0" />
      </section>

      {/* ── The corner table (story) ──────────────────────────────── */}
      {showStory && (
        <section className="relative px-6 py-20 sm:py-28">
          <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1.2fr,0.8fr]">
            <div
              className="p-8 sm:p-10"
              style={{ background: CREAM, border: `1px solid ${WOOD}33`, boxShadow: `0 20px 40px -32px ${FLOOR}` }}
            >
              <p className="font-condensed text-sm tracking-[0.34em]" style={{ color: RED }}>
                THE CORNER TABLE
              </p>
              <motion.h2
                initial={reduce ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: EASE }}
                className="mt-4 font-serif text-2xl leading-snug sm:text-3xl"
                style={{ color: FLOOR }}
              >
                {invitation}
              </motion.h2>
              <p className="mt-5 font-serif text-lg leading-loose" style={{ color: `${FLOOR}c4` }}>
                {story}
              </p>
            </div>
            <div className="space-y-4">
              <div
                className="p-6"
                style={{ background: "#141311", border: `6px solid ${WOOD}` }}
              >
                <p className="font-condensed text-sm tracking-[0.3em]" style={{ color: "#f0b429" }}>
                  HOUSE RULES
                </p>
                <ul className="mt-3 space-y-2 font-condensed text-lg tracking-[0.08em]" style={{ color: CREAM }}>
                  <li>NO SITTING WITHOUT ORDERING</li>
                  <li>{(firstDress || "COME AS YOU ARE").toUpperCase()}</li>
                  <li>ONE SPEECH ONLY</li>
                  <li>DANCING AFTER DESSERT</li>
                </ul>
              </div>
              <div className="flex items-end justify-center gap-4">
                <Chair size={40} />
                <Chair size={52} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── The board ─────────────────────────────────────────────── */}
      {showBoard && (
        <section className="relative mx-auto max-w-4xl px-6 py-16 sm:py-20">
          <h2 className="mb-8 font-condensed text-3xl tracking-[0.14em] sm:text-4xl" style={{ color: WOOD }}>
            ON THE BOARD
          </h2>
          <Board items={subEvents} reduce={reduce} />
        </section>
      )}

      {/* ── Framed on the mint wall ──────────────────────────────── */}
      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <h2 className="mb-9 font-condensed text-3xl tracking-[0.14em]" style={{ color: WOOD }}>
            ON THE WALL
          </h2>
          {galleryItems.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {galleryItems.map((m, i) => (
                <motion.figure
                  key={`${m.fileName}-${i}`}
                  initial={reduce ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-8% 0px" }}
                  transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: EASE }}
                  className="group"
                >
                  <div
                    className="p-2"
                    style={{
                      background: CREAM,
                      border: `8px solid ${WOOD}`,
                      boxShadow: `10px 12px 26px -22px ${FLOOR}`,
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={m.publicUrl}
                      alt={m.caption ?? ""}
                      loading="lazy"
                      className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                  {m.caption && (
                    <figcaption className="mt-3 font-condensed text-base tracking-[0.16em]" style={{ color: WOOD }}>
                      {m.caption.toUpperCase()}
                    </figcaption>
                  )}
                </motion.figure>
              ))}
            </div>
          ) : (
            <div
              className="flex h-44 items-center justify-center border-4 border-dashed font-condensed text-2xl tracking-[0.14em]"
              style={{ borderColor: `${WOOD}66`, color: `${FLOOR}88` }}
            >
              + FRAME SOME PHOTOGRAPHS
            </div>
          )}
        </section>
      )}

      {/* ── The address ──────────────────────────────────────────── */}
      {showVenue && (
        <section className="relative mx-auto max-w-4xl px-6 py-16 sm:py-20">
          <div style={{ background: CREAM, border: `1px solid ${WOOD}33` }}>
            <div className="flex flex-wrap items-start justify-between gap-4 p-6 sm:p-8">
              <div>
                <p className="font-condensed text-sm tracking-[0.34em]" style={{ color: RED }}>
                  THE CAFÉ
                </p>
                <h2 className="mt-3 font-condensed text-3xl tracking-[0.08em]" style={{ color: FLOOR }}>
                  {(event.venueName || "The venue").toUpperCase()}
                </h2>
                {event.venueAddress && (
                  <p className="mt-2 font-serif text-lg" style={{ color: `${FLOOR}b8` }}>
                    {event.venueAddress}
                  </p>
                )}
              </div>
              <Chair size={44} />
            </div>
            <div className="px-3 pb-3" style={{ borderTop: `1px solid ${WOOD}22` }}>
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

      {/* ── The chit (RSVP) ─────────────────────────────────────── */}
      <section className="relative px-6 py-20 text-center sm:py-28">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18, rotate: 0 }}
          whileInView={{ opacity: 1, y: 0, rotate: -1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mx-auto max-w-xs px-6 py-8"
          style={{
            background: CREAM,
            boxShadow: `0 22px 40px -30px ${FLOOR}`,
            backgroundImage: `repeating-linear-gradient(180deg, transparent 0 25px, ${WOOD}14 25px 26px)`,
          }}
        >
          <p className="font-condensed text-sm tracking-[0.3em]" style={{ color: RED }}>
            BILL, PLEASE
          </p>
          <h2 className="mt-3 font-condensed text-2xl tracking-[0.08em]" style={{ color: FLOOR }}>
            {(event.eventTitle || "").toUpperCase()}
          </h2>
          <div className="mt-4 space-y-1 font-mono text-xs" style={{ color: `${FLOOR}b0` }}>
            <p className="flex justify-between">
              <span>Table for</span>
              <span>you + guests</span>
            </p>
            <p className="flex justify-between">
              <span>Service</span>
              <span>included</span>
            </p>
          </div>
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
              className="mt-6 inline-block px-8 py-3 font-condensed text-lg tracking-[0.2em] text-white transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
              style={{ background: RED, outlineColor: WOOD }}
            >
              RESERVE A CHAIR
            </a>
          )}
          {(event.contactName || event.contactPhone) && (
            <p className="mt-5 font-mono text-[11px]" style={{ color: `${FLOOR}99` }}>
              {[event.contactName, event.contactPhone].filter(Boolean).join(" · ")}
            </p>
          )}
        </motion.div>
      </section>

      <footer className="relative">
        <Chequer />
        <p className="py-6 text-center font-condensed text-base tracking-[0.2em]" style={{ color: WOOD }}>
          {(event.eventTitle || "").toUpperCase()}
          {names.length === 2 ? ` · ${names.join(" & ").toUpperCase()}` : ""}
        </p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default IraniTemplate;
