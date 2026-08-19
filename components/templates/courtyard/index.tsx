"use client";

import { useMemo } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { HeroMedia } from "@/components/ui/HeroMedia";
import { MapEmbed } from "@/components/ui/MapEmbed";
import { MusicToggle } from "@/components/ui/MusicToggle";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { useEditMode } from "@/components/edit/EditContext";
import type { TemplateComponent, SubEvent } from "@/lib/types";

/* ── Courtyard · nalukettu ────────────────────────────────────────────────
 * Palette   laterite #9c4a2f · jackwood #4a3221 · brass #c08a3e
 *           banana leaf #3f6b3a · lime plaster #efe4d2
 * Type      Cormorant (names, room titles) / Inter (body) / tracked caps (times)
 * Layout    a square plan at every scale — the hero is the courtyard opening
 *           and each section is a room off the veranda.
 * Signature the travelling light: one warm shaft, driven by scroll, crossing
 *           the courtyard floor from dawn to lamplight.
 * ──────────────────────────────────────────────────────────────────────── */

const EASE = [0.16, 1, 0.3, 1] as const;
const LATERITE = "#9c4a2f";
const JACKWOOD = "#4a3221";
const BRASS = "#c08a3e";
const LEAF = "#3f6b3a";
const PLASTER = "#efe4d2";

/** Carved-into-plaster text. */
const CARVED = {
  color: "#7d6a52",
  textShadow: "0 1px 0 rgba(255,255,255,0.85), 0 -1px 1px rgba(0,0,0,0.35)",
} as const;

/** A turned jackwood column. */
function Column({ className }: { className?: string }) {
  return (
    <div aria-hidden className={`relative ${className ?? ""}`}>
      <div
        className="h-full w-full"
        style={{
          background: `linear-gradient(90deg, #2f2015 0%, ${JACKWOOD} 32%, #6b4b31 55%, ${JACKWOOD} 78%, #2a1d13 100%)`,
        }}
      />
      <div className="absolute inset-x-0 top-0 h-4" style={{ background: BRASS, opacity: 0.85 }} />
      <div className="absolute inset-x-0 bottom-0 h-6" style={{ background: "#2f2015" }} />
    </div>
  );
}

/** Brass oil lamp — the marker on every room. */
function Lamp({ lit, size = 26 }: { lit?: boolean; size?: number }) {
  return (
    <svg aria-hidden viewBox="0 0 32 32" width={size} height={size}>
      {lit && <circle cx="16" cy="9" r="9" fill={BRASS} opacity="0.28" />}
      <path d="M6 22 q10 -5 20 0 q-3 5 -10 5 q-7 0 -10 -5z" fill={BRASS} />
      <path d="M26 22 q4 -1 5 -3 q-3 -1 -5 0z" fill={BRASS} />
      {lit ? (
        <path d="M28 18 q2 -4 0 -7 q4 3 2 7z" fill="#f0b95d" />
      ) : (
        <path d="M28 18 q1 -3 0 -5 q2 2 1 5z" fill="#8a7048" />
      )}
      <rect x="14" y="26" width="4" height="4" fill="#8a6a3c" />
    </svg>
  );
}

/** Rooms arranged around the open square. */
const RING = [
  "col-start-1 row-start-1",
  "col-start-2 row-start-1",
  "col-start-3 row-start-1",
  "col-start-3 row-start-2",
  "col-start-3 row-start-3",
  "col-start-2 row-start-3",
  "col-start-1 row-start-3",
  "col-start-1 row-start-2",
];

function Rooms({ items, accent, reduce }: { items: SubEvent[]; accent: string; reduce: boolean }) {
  const sorted = [...items].sort((a, b) => a.order - b.order);
  const ring = sorted.slice(0, 8);
  const rest = sorted.slice(8);

  const Room = ({ s, i, cls }: { s: SubEvent; i: number; cls?: string }) => (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.6, delay: (i % 4) * 0.08, ease: EASE }}
      className={`p-5 ${cls ?? ""}`}
      style={{
        background: PLASTER,
        border: `1px solid ${LATERITE}33`,
        boxShadow: `inset 0 0 0 4px ${PLASTER}, 0 14px 30px -24px ${JACKWOOD}`,
      }}
    >
      <div className="flex items-center gap-2">
        <Lamp lit size={22} />
        <span className="font-sans text-[10px] uppercase tracking-[0.28em]" style={{ color: LATERITE }}>
          Room {String(s.order).padStart(2, "0")}
        </span>
      </div>
      <h3 className="mt-3 font-serif text-2xl leading-tight" style={{ color: JACKWOOD }}>
        {s.name}
      </h3>
      <p className="mt-1.5 font-sans text-[11px] uppercase tracking-[0.22em]" style={{ color: accent }}>
        {[s.date, [s.startTime, s.endTime].filter(Boolean).join("–")].filter(Boolean).join(" · ")}
      </p>
      {s.venueName && (
        <p className="mt-2 font-serif text-lg" style={{ color: LEAF }}>
          {s.venueName}
        </p>
      )}
      {s.description && (
        <p className="mt-2 font-sans text-sm leading-relaxed" style={{ color: "#5b4f42" }}>
          {s.description}
        </p>
      )}
      {s.dressCode && (
        <p
          className="mt-3 inline-block px-2 py-1 font-sans text-[10px] uppercase tracking-[0.2em]"
          style={{ background: `${BRASS}2e`, color: JACKWOOD }}
        >
          {s.dressCode}
        </p>
      )}
    </motion.article>
  );

  return (
    <>
      {/* mobile: a plain vertical sequence */}
      <ol className="grid gap-5 lg:hidden">
        {sorted.map((s, i) => (
          <li key={`m-${s.order}-${s.name}`}>
            <Room s={s} i={i} />
          </li>
        ))}
      </ol>

      {/* desktop: rooms ringing the open courtyard, clockwise */}
      <div className="hidden gap-5 lg:grid lg:grid-cols-3 lg:grid-rows-3">
        {ring.map((s, i) => (
          <div key={`d-${s.order}-${s.name}`} className={RING[i]}>
            <Room s={s} i={i} cls="h-full" />
          </div>
        ))}
        <div
          className="col-start-2 row-start-2 flex flex-col items-center justify-center p-6 text-center"
          style={{
            background: `radial-gradient(ellipse at 50% 40%, #fff6e2 0%, ${PLASTER} 60%, #e3d5bd 100%)`,
            border: `1px solid ${LATERITE}22`,
          }}
        >
          <Lamp lit size={34} />
          <p className="mt-3 font-serif text-xl" style={{ color: JACKWOOD }}>
            The open square
          </p>
          <p className="mt-1 font-sans text-[10px] uppercase tracking-[0.26em]" style={{ color: LATERITE }}>
            Everything happens around it
          </p>
        </div>
      </div>

      {rest.length > 0 && (
        <ol className="mt-5 hidden gap-5 lg:grid lg:grid-cols-3">
          {rest.map((s, i) => (
            <li key={`r-${s.order}-${s.name}`}>
              <Room s={s} i={i} />
            </li>
          ))}
        </ol>
      )}
    </>
  );
}

export const CourtyardTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || LATERITE;
  const tagline = event.tagline?.trim() || "Four generations, one courtyard";
  const invitation =
    event.invitationMessage?.trim() ||
    "The house has seen every wedding in our family. Come sit on its veranda while it sees one more.";
  const story =
    event.aboutStory?.trim() ||
    "Laterite walls, a jackwood roof, and a square of open sky in the middle. Every important thing our family has decided was decided in that square.";
  const hero = event.heroImageUrl || "/samples/diya-lamps.jpg";

  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const names = [event.person1Name, event.person2Name].filter(Boolean).join("  ·  ");

  const { scrollYProgress } = useScroll();
  // SIGNATURE — the light crosses the floor and cools as the day passes.
  const lightX = useTransform(scrollYProgress, [0, 1], ["8%", "82%"]);
  const lightSkew = useTransform(scrollYProgress, [0, 0.5, 1], [-16, 0, 14]);
  const lightOpacity = useTransform(scrollYProgress, [0, 0.55, 1], [0.5, 0.62, 0.26]);

  const showStory = !event.hideStory;
  const showRooms = !event.hideEvents && subEvents.length > 0;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);
  const showVenue = !event.hideVenue;

  const dateLine = event.mainDate
    ? new Date(event.mainDate).toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : "";

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-sans antialiased"
      style={{ "--accent": accent, background: PLASTER, color: "#4a4238" } as React.CSSProperties}
    >
      <ScrollProgress color={accent} />

      {/* The travelling shaft of light. */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-y-0 z-0 w-[42vw] max-w-[520px]"
        style={
          reduce
            ? { left: "46%", opacity: 0.5, background: `linear-gradient(100deg, transparent, #fff3d9 45%, transparent)` }
            : {
                left: lightX,
                opacity: lightOpacity,
                skewX: lightSkew,
                background: `linear-gradient(100deg, transparent, #fff3d9 45%, transparent)`,
              }
        }
      />

      {/* ── Hero: the courtyard from above ──────────────────────────── */}
      <section className="relative z-10 flex min-h-[100svh] items-center justify-center overflow-hidden pb-24 sm:pb-28">
        <div className="absolute inset-0">
          <HeroMedia
            imageSrc={hero}
            videoSrc={event.heroVideoUrl || undefined}
            alt={event.eventTitle}
            className="opacity-45"
          />
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(180deg, ${PLASTER}e0 0%, ${PLASTER}a8 40%, ${PLASTER}f0 100%)` }}
          />
        </div>

        {/* the four columns of the inner square */}
        <Column className="absolute bottom-0 left-[6%] top-0 w-4 sm:w-6" />
        <Column className="absolute bottom-0 right-[6%] top-0 w-4 sm:w-6" />
        <div
          aria-hidden
          className="absolute inset-x-[6%] top-0 h-6"
          style={{ background: `linear-gradient(180deg, #2f2015, ${JACKWOOD})` }}
        />

        <div className="relative z-10 px-8 text-center">
          {/* the open square of sky */}
          <motion.div
            aria-hidden
            initial={reduce ? false : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: EASE }}
            className="mx-auto mb-9 h-24 w-24 sm:h-32 sm:w-32"
            style={{
              background: `linear-gradient(160deg, #fff7e6, #f3dfb8)`,
              boxShadow: `0 0 60px 18px rgba(255,240,206,0.7), inset 0 0 0 6px ${PLASTER}`,
              border: `2px solid ${JACKWOOD}55`,
            }}
          />
          <p className="font-sans text-[10px] uppercase tracking-[0.46em]" style={{ color: LATERITE }}>
            {tagline}
          </p>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.25, ease: EASE }}
            className="mt-6 font-serif text-[clamp(2.5rem,9vw,5.6rem)] leading-[1.02]"
            style={CARVED}
          >
            {names || event.eventTitle}
          </motion.h1>
          {dateLine && (
            <p className="mt-8 font-sans text-[11px] uppercase tracking-[0.34em]" style={{ color: JACKWOOD }}>
              {dateLine}
              {event.city ? ` · ${event.city}` : ""}
            </p>
          )}
          <div className="mt-8 flex items-center justify-center gap-5">
            <Lamp lit size={28} />
            <Lamp size={28} />
            <Lamp lit size={28} />
          </div>
        </div>
      </section>

      {/* ── The veranda ─────────────────────────────────────────────── */}
      {showStory && (
        <section className="relative z-10 px-6 py-20 sm:py-28">
          <div className="mx-auto flex max-w-4xl items-stretch gap-6">
            <Column className="hidden w-5 shrink-0 sm:block" />
            <div className="flex-1 text-center">
              <p className="font-sans text-[10px] uppercase tracking-[0.4em]" style={{ color: LATERITE }}>
                On the veranda
              </p>
              <motion.h2
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: EASE }}
                className="mt-5 font-serif text-2xl leading-snug sm:text-3xl"
                style={{ color: JACKWOOD }}
              >
                {invitation}
              </motion.h2>
              <div aria-hidden className="mx-auto my-8 h-px w-24" style={{ background: `${LATERITE}55` }} />
              <p className="mx-auto max-w-2xl font-sans text-sm leading-loose sm:text-base" style={{ color: "#5b4f42" }}>
                {story}
              </p>
            </div>
            <Column className="hidden w-5 shrink-0 sm:block" />
          </div>
        </section>
      )}

      {/* ── The rooms ───────────────────────────────────────────────── */}
      {showRooms && (
        <section className="relative z-10 mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <header className="mb-10">
            <p className="font-sans text-[10px] uppercase tracking-[0.4em]" style={{ color: LATERITE }}>
              Around the square
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl" style={{ color: JACKWOOD }}>
              The days, room by room
            </h2>
          </header>
          <Rooms items={subEvents} accent={accent} reduce={reduce} />
        </section>
      )}

      {/* ── Photographs on the plaster wall ────────────────────────── */}
      {showGallery && (
        <section className="relative z-10 mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <h2 className="mb-9 font-serif text-3xl" style={{ color: JACKWOOD }}>
            Hung on the wall
          </h2>
          {galleryItems.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {galleryItems.map((m, i) => (
                <motion.figure
                  key={`${m.fileName}-${i}`}
                  initial={reduce ? false : { opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-8% 0px" }}
                  transition={{ duration: 0.7, delay: (i % 3) * 0.09, ease: EASE }}
                  className="group"
                >
                  <div
                    className="overflow-hidden p-2"
                    style={{
                      background: PLASTER,
                      border: `6px solid ${JACKWOOD}`,
                      boxShadow: `12px 16px 30px -22px ${JACKWOOD}, inset 0 0 0 1px ${BRASS}55`,
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={m.publicUrl}
                      alt={m.caption ?? ""}
                      loading="lazy"
                      className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  </div>
                  {m.caption && (
                    <figcaption className="mt-3 font-sans text-[10px] uppercase tracking-[0.26em]" style={{ color: LATERITE }}>
                      {m.caption}
                    </figcaption>
                  )}
                </motion.figure>
              ))}
            </div>
          ) : (
            <div
              className="flex h-44 items-center justify-center border-2 border-dashed font-sans text-sm"
              style={{ borderColor: `${LATERITE}55`, color: "#6b6053" }}
            >
              + Add photographs for the wall
            </div>
          )}
        </section>
      )}

      {/* ── The laterite plaque ────────────────────────────────────── */}
      {showVenue && (
        <section className="relative z-10 mx-auto max-w-4xl px-6 py-16 sm:py-20">
          <div
            className="mb-6 p-7"
            style={{
              background: `linear-gradient(160deg, ${LATERITE}, #7d3a24)`,
              boxShadow: `inset 0 0 0 3px ${LATERITE}, 0 20px 40px -30px ${JACKWOOD}`,
            }}
          >
            <p className="font-sans text-[10px] uppercase tracking-[0.36em]" style={{ color: "#f6dfc9" }}>
              The house
            </p>
            <h2 className="mt-3 font-serif text-3xl" style={{ color: "#fff4e4" }}>
              {event.venueName || "The venue"}
            </h2>
            {event.venueAddress && (
              <p className="mt-2 font-sans text-sm" style={{ color: "#f1d9c2" }}>
                {event.venueAddress}
              </p>
            )}
          </div>
          <div style={{ border: `6px solid ${JACKWOOD}` }}>
            <MapEmbed
              latitude={event.latitude}
              longitude={event.longitude}
              venueName={event.venueName}
              venueAddress={event.venueAddress}
              mapLink={event.mapLink}
            />
          </div>
        </section>
      )}

      {/* ── RSVP, carved into the door ─────────────────────────────── */}
      <section className="relative z-10 px-6 py-20 text-center sm:py-28">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mx-auto max-w-xl px-8 py-12"
          style={{
            background: `linear-gradient(180deg, #56391f, ${JACKWOOD})`,
            boxShadow: `inset 0 0 0 6px #3a2717, 0 26px 50px -34px ${JACKWOOD}`,
          }}
        >
          <p className="font-sans text-[10px] uppercase tracking-[0.4em]" style={{ color: BRASS }}>
            Come to the house
          </p>
          <h2 className="mt-4 font-serif text-3xl" style={{ color: "#f7e7cf" }}>
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
              className="mt-9 inline-block px-10 py-3.5 font-sans text-[11px] uppercase tracking-[0.3em] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
              style={{ background: BRASS, color: "#2f2015", outlineColor: PLASTER }}
            >
              Tell us you're coming
            </a>
          )}
          {(event.contactName || event.contactPhone) && (
            <p className="mt-6 font-sans text-xs" style={{ color: "#d8c3a5" }}>
              {[event.contactName, event.contactPhone].filter(Boolean).join(" · ")}
            </p>
          )}
        </motion.div>
      </section>

      <footer className="relative z-10" style={{ background: `linear-gradient(180deg, ${PLASTER}, #e2d0b4)` }}>
        <div className="flex items-center justify-center gap-6 py-6">
          {[0, 1, 2, 3, 4].map((i) => (
            <Lamp key={i} lit size={22} />
          ))}
        </div>
        <p className="pb-7 text-center font-sans text-[11px] tracking-[0.2em]" style={{ color: "#6b6053" }}>
          {event.eventTitle}
          {names ? ` · ${names}` : ""}
        </p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default CourtyardTemplate;
