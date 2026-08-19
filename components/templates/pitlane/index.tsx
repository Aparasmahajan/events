"use client";

import { useMemo, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { HeroMedia } from "@/components/ui/HeroMedia";
import { MapEmbed } from "@/components/ui/MapEmbed";
import { MusicToggle } from "@/components/ui/MusicToggle";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { useEditMode } from "@/components/edit/EditContext";
import type { TemplateComponent, SubEvent } from "@/lib/types";

/* ── Pit Lane · the birthday as a race weekend ────────────────────────────
 * Palette   tarmac #15171b · kerb red #d92b2b · kerb white #f2f2f0
 *           racing yellow #ffcc00 · pit blue #1f6fd0
 * Type      Bebas Neue (race numbers, boards) / Inter (body) / mono (lap times)
 * Layout    circuit furniture — kerb stripes divide the page, everything sits
 *           on tarmac, boards and cards are pit-wall equipment.
 * Signature the car drives: start lights go out and the car launches on load,
 *           road dashes stream continuously, wheels spin, and a second car
 *           advances down the pit-stop list as you scroll.
 * Motion    everything continuous is CSS/transform-only and has a
 *           prefers-reduced-motion branch that parks the car and stops the road.
 * ──────────────────────────────────────────────────────────────────────── */

const EASE = [0.16, 1, 0.3, 1] as const;
const TARMAC = "#15171b";
const KERB_RED = "#d92b2b";
const KERB_WHITE = "#f2f2f0";
const YELLOW = "#ffcc00";
const PIT_BLUE = "#1f6fd0";

const ASPHALT =
  `radial-gradient(circle at 20% 30%, rgba(255,255,255,0.035), transparent 40%),` +
  `radial-gradient(circle at 75% 65%, rgba(255,255,255,0.03), transparent 45%),` +
  `linear-gradient(180deg, #1b1e23, ${TARMAC})`;

/** Red/white kerb stripe that streams sideways. */
function Kerb({ reduce, height = 14 }: { reduce: boolean; height?: number }) {
  return (
    <div aria-hidden className="relative w-full overflow-hidden" style={{ height }}>
      <motion.div
        className="absolute inset-y-0 -left-1/2 w-[200%]"
        style={{
          background: `repeating-linear-gradient(90deg, ${KERB_RED} 0 28px, ${KERB_WHITE} 28px 56px)`,
        }}
        animate={reduce ? undefined : { x: ["0%", "14%"] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

/** Side-view race car. `speed` drives how fast the wheels turn. */
function Car({
  size = 190,
  body,
  number,
  reduce,
  speed = 0.9,
}: {
  size?: number;
  body: string;
  number?: string;
  reduce: boolean;
  speed?: number;
}) {
  const wheel = (cx: number) => (
    <motion.g
      animate={reduce ? undefined : { rotate: 360 }}
      transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      style={{ originX: `${cx}px`, originY: "62px" }}
    >
      <circle cx={cx} cy="62" r="13" fill="#0c0d0f" stroke="#2c2f36" strokeWidth="3" />
      <circle cx={cx} cy="62" r="5" fill="#8b9099" />
      <rect x={cx - 1.4} y="50" width="2.8" height="24" rx="1" fill="#5c6270" />
      <rect x={cx - 12} y="60.6" width="24" height="2.8" rx="1" fill="#5c6270" />
    </motion.g>
  );
  return (
    <svg aria-hidden viewBox="0 0 200 80" width={size} height={size * 0.4}>
      {/* floor + diffuser */}
      <path d="M14 58 L186 58 L182 64 L18 64 Z" fill="#0f1115" />
      {/* body */}
      <path
        d="M20 58 L34 42 L74 38 Q92 26 116 30 L140 40 L176 44 L184 54 L184 58 Z"
        fill={body}
        stroke="#0c0d0f"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* cockpit + halo */}
      <path d="M84 38 Q100 24 118 32" fill="none" stroke="#0c0d0f" strokeWidth="3.5" />
      <ellipse cx="102" cy="36" rx="9" ry="6" fill="#20242b" />
      {/* front + rear wing */}
      <rect x="176" y="30" width="18" height="4" rx="1.5" fill={body} stroke="#0c0d0f" strokeWidth="2" />
      <rect x="180" y="34" width="4" height="12" fill="#0c0d0f" />
      <rect x="8" y="54" width="20" height="4.5" rx="1.5" fill={body} stroke="#0c0d0f" strokeWidth="2" />
      {/* door number */}
      {number && (
        <text
          x="128"
          y="52"
          textAnchor="middle"
          className="font-condensed"
          fontSize="20"
          fill={KERB_WHITE}
          stroke="#0c0d0f"
          strokeWidth="0.6"
        >
          {number}
        </text>
      )}
      {wheel(52)}
      {wheel(152)}
    </svg>
  );
}

/** Tarmac with dashes that stream past. */
function Road({ reduce, className, height = 96 }: { reduce: boolean; className?: string; height?: number }) {
  return (
    <div
      aria-hidden
      className={`relative w-full overflow-hidden ${className ?? ""}`}
      style={{ height, background: "linear-gradient(180deg, #23262c, #14161a)" }}
    >
      <motion.div
        className="absolute -left-1/2 top-1/2 h-[6px] w-[200%] -translate-y-1/2"
        style={{
          background: `repeating-linear-gradient(90deg, ${KERB_WHITE} 0 46px, transparent 46px 104px)`,
          opacity: 0.85,
        }}
        animate={reduce ? undefined : { x: ["0%", "-26%"] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

/** The five-light gantry, going out once on load. */
function StartLights({ reduce, onGreen }: { reduce: boolean; onGreen?: boolean }) {
  return (
    <div
      aria-hidden
      className="mx-auto flex w-fit items-center gap-2 rounded-lg px-3 py-2.5"
      style={{ background: "#0b0c0e", border: `2px solid #2c2f36` }}
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.span
          key={i}
          className="block h-5 w-5 rounded-full sm:h-6 sm:w-6"
          style={{ background: "#3a1113" }}
          initial={reduce ? { background: onGreen ? "#1fbf5a" : "#3a1113" } : { background: "#3a1113" }}
          animate={
            reduce
              ? undefined
              : { background: ["#3a1113", KERB_RED, KERB_RED, "#3a1113", "#1fbf5a"] }
          }
          transition={
            reduce
              ? undefined
              : { duration: 3.4, times: [0, 0.12 + i * 0.1, 0.62, 0.68, 0.8], ease: "easeInOut" }
          }
        />
      ))}
    </div>
  );
}

/** SIGNATURE (second half) — the pit-stop list with a car that advances. */
function PitStops({ items, reduce }: { items: SubEvent[]; reduce: boolean }) {
  const sorted = [...items].sort((a, b) => a.order - b.order);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 75%"] });
  const carTop = useTransform(scrollYProgress, [0, 1], ["0%", "94%"]);
  const colours = [KERB_RED, YELLOW, PIT_BLUE, "#1fbf5a"];

  return (
    <div ref={ref} className="relative pl-16 sm:pl-24">
      {/* the pit lane the car runs down */}
      <div
        aria-hidden
        className="absolute bottom-0 left-5 top-0 w-10 sm:left-8"
        style={{ background: "linear-gradient(90deg, #20242b, #2a2f37, #20242b)" }}
      >
        <motion.div
          className="absolute -top-1/2 left-1/2 h-[200%] w-[4px] -translate-x-1/2"
          style={{
            background: `repeating-linear-gradient(180deg, ${KERB_WHITE} 0 22px, transparent 22px 48px)`,
            opacity: 0.7,
          }}
          animate={reduce ? undefined : { y: ["0%", "12%"] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
        />
      </div>
      <motion.div
        aria-hidden
        className="absolute left-5 z-10 -ml-[26px] sm:left-8"
        style={reduce ? { top: "46%" } : { top: carTop }}
      >
        <div className="rotate-90">
          <Car size={92} body={YELLOW} reduce={reduce} speed={0.7} />
        </div>
      </motion.div>

      <ol className="space-y-5">
        {sorted.map((s, i) => {
          const c = colours[i % colours.length];
          return (
            <motion.li
              key={`${s.order}-${s.name}`}
              initial={reduce ? false : { opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-12% 0px" }}
              transition={{ duration: 0.55, delay: (i % 4) * 0.06, ease: EASE }}
              whileHover={reduce ? undefined : { x: 6 }}
              className="relative overflow-hidden"
              style={{ background: "#1c2027", borderLeft: `6px solid ${c}` }}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-5 gap-y-1 p-5 sm:p-6">
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-[11px] uppercase tracking-[0.28em]" style={{ color: c }}>
                    Lap {String(s.order).padStart(2, "0")}
                  </p>
                  <h3 className="mt-1.5 font-condensed text-2xl tracking-[0.06em] sm:text-3xl" style={{ color: KERB_WHITE }}>
                    {s.icon ? `${s.icon} ` : ""}
                    {s.name}
                  </h3>
                  {s.description && (
                    <p className="mt-2 max-w-prose font-sans text-sm leading-relaxed" style={{ color: "#9aa1ad" }}>
                      {s.description}
                    </p>
                  )}
                  {s.dressCode && (
                    <p className="mt-3 inline-block px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em]" style={{ background: `${c}26`, color: KERB_WHITE }}>
                      {s.dressCode}
                    </p>
                  )}
                </div>
                <div className="shrink-0 text-left sm:text-right">
                  <p className="font-mono text-base" style={{ color: YELLOW }}>
                    {[s.startTime, s.endTime].filter(Boolean).join("–") || s.date}
                  </p>
                  {s.venueName && (
                    <p className="mt-1 font-condensed text-lg tracking-[0.08em]" style={{ color: "#b9c0cb" }}>
                      {s.venueName}
                    </p>
                  )}
                </div>
              </div>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}

/** A pit board — the kind held over the wall. */
function PitBoard({ rows }: { rows: [string, string][] }) {
  return (
    <div
      className="w-full max-w-xs p-4"
      style={{ background: "#0f1115", border: `4px solid #2c2f36` }}
    >
      {rows.map(([k, v]) => (
        <div key={k} className="flex items-baseline justify-between gap-4 border-b py-2 last:border-0" style={{ borderColor: "#2c2f36" }}>
          <span className="font-mono text-[10px] uppercase tracking-[0.24em]" style={{ color: "#7d8595" }}>
            {k}
          </span>
          <span className="font-condensed text-xl tracking-[0.06em]" style={{ color: YELLOW }}>
            {v}
          </span>
        </div>
      ))}
    </div>
  );
}

export const PitlaneTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || KERB_RED;
  const tagline = event.tagline?.trim() || "Lights out and away we go";
  const invitation =
    event.invitationMessage?.trim() ||
    "Helmets on. There will be karts, there will be a podium, and there will be an argument about who cut whose corner.";
  const story =
    event.aboutStory?.trim() ||
    "Knows every car on the road by its headlights. Has opinions about tyre compounds. Today he gets the whole circuit.";
  const hero = event.heroImageUrl || "/samples/confetti.jpg";

  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);

  const showStory = !event.hideStory;
  const showStops = !event.hideEvents && subEvents.length > 0;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);
  const showVenue = !event.hideVenue;

  const ageMatch = event.eventTitle.match(/\d{1,3}/);
  const age = ageMatch?.[0] ?? "1";
  const dateLine = event.mainDate
    ? new Date(event.mainDate)
        .toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short" })
        .toUpperCase()
    : "";

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-sans antialiased"
      style={{ "--accent": accent, background: TARMAC, color: KERB_WHITE } as React.CSSProperties}
    >
      <ScrollProgress color={YELLOW} />
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0" style={{ background: ASPHALT }} />

      {/* ── Hero: the start line ───────────────────────────────────── */}
      <section className="relative z-10 flex min-h-[100svh] flex-col justify-center overflow-hidden pb-24 sm:pb-28">
        <div className="absolute inset-0">
          <HeroMedia
            imageSrc={hero}
            videoSrc={event.heroVideoUrl || undefined}
            alt={event.eventTitle}
            className="opacity-25"
          />
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${TARMAC}e6, #1b1e23a6 45%, ${TARMAC}f5)` }} />
        </div>

        <Kerb reduce={reduce} />

        <div className="relative px-5 py-10 text-center sm:px-8 sm:py-14">
          <StartLights reduce={reduce} />

          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-7 font-mono text-[11px] uppercase tracking-[0.4em]"
            style={{ color: YELLOW }}
          >
            {tagline}
          </motion.p>

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease: EASE }}
            className="mt-4 font-condensed text-[clamp(3rem,14vw,8.5rem)] leading-[0.88] tracking-[0.02em]"
            style={{ color: KERB_WHITE }}
          >
            {(event.person1Name || event.eventTitle).toUpperCase()}
          </motion.h1>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <span
              className="flex h-16 w-16 items-center justify-center font-condensed text-4xl sm:h-20 sm:w-20 sm:text-5xl"
              style={{ background: accent, color: KERB_WHITE, clipPath: "polygon(12% 0, 100% 0, 88% 100%, 0 100%)" }}
            >
              {age}
            </span>
            <span className="font-condensed text-xl tracking-[0.2em]" style={{ color: "#9aa1ad" }}>
              CAR NUMBER
            </span>
          </div>

          {/* the car launches off the line */}
          <motion.div
            className="mt-6 flex justify-center"
            initial={reduce ? false : { x: "-46vw", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.5, delay: 2.6, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <Car size={260} body={accent} number={age} reduce={reduce} speed={0.55} />
          </motion.div>

          {dateLine && (
            <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "#b9c0cb" }}>
              {[dateLine, event.mainStartTime, event.city].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>

        <Road reduce={reduce} height={72} />
      </section>

      {/* ── The driver (story) ─────────────────────────────────────── */}
      {showStory && (
        <section className="relative z-10 mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="grid gap-10 md:grid-cols-[1.2fr,0.8fr] md:items-start">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.32em]" style={{ color: accent }}>
                Driver briefing
              </p>
              <motion.h2
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: EASE }}
                className="mt-4 font-condensed text-[clamp(1.9rem,5vw,3.2rem)] leading-[1.04] tracking-[0.03em]"
                style={{ color: KERB_WHITE }}
              >
                {invitation.toUpperCase()}
              </motion.h2>
              <p className="mt-6 max-w-prose font-sans text-base leading-relaxed" style={{ color: "#9aa1ad" }}>
                {story}
              </p>
            </div>
            <div className="justify-self-start md:justify-self-end">
              <PitBoard
                rows={[
                  ["Driver", (event.person1Name || event.eventTitle).slice(0, 14)],
                  ["No.", age],
                  ["Circuit", (event.city || "—").slice(0, 12)],
                  ["Laps", String(subEvents.length || 0)],
                ]}
              />
            </div>
          </div>
        </section>
      )}

      <Kerb reduce={reduce} height={12} />

      {/* ── The pit stops (schedule) ──────────────────────────────── */}
      {showStops && (
        <section className="relative z-10 mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-20">
          <header className="mb-9 flex flex-wrap items-end justify-between gap-3">
            <h2 className="font-condensed text-[clamp(2rem,6vw,3.4rem)] leading-none tracking-[0.05em]">
              RACE ORDER
            </h2>
            <p className="font-mono text-[11px] uppercase tracking-[0.28em]" style={{ color: YELLOW }}>
              {subEvents.length} laps
            </p>
          </header>
          <PitStops items={subEvents} reduce={reduce} />
        </section>
      )}

      {/* ── The garage wall (gallery) ─────────────────────────────── */}
      {showGallery && (
        <section className="relative z-10 mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <h2 className="mb-9 font-condensed text-[clamp(2rem,6vw,3.4rem)] leading-none tracking-[0.05em]">
            THE GARAGE
          </h2>
          {galleryItems.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {galleryItems.map((m, i) => (
                <motion.figure
                  key={`${m.fileName}-${i}`}
                  initial={reduce ? false : { opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-8% 0px" }}
                  transition={{ duration: 0.6, delay: (i % 3) * 0.07, ease: EASE }}
                  whileHover={reduce ? undefined : { y: -8 }}
                  className="group overflow-hidden"
                  style={{ background: "#1c2027", border: `2px solid #2c2f36` }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={m.publicUrl}
                    alt={m.caption ?? ""}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  />
                  <figcaption className="flex items-center justify-between gap-3 px-4 py-3">
                    <span className="font-condensed text-lg tracking-[0.06em]">
                      {m.caption || "Garage shot"}
                    </span>
                    <span className="font-mono text-[10px]" style={{ color: YELLOW }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </figcaption>
                  <div
                    aria-hidden
                    className="h-1.5 w-full"
                    style={{ background: `repeating-linear-gradient(90deg, #2c2f36 0 8px, #1c2027 8px 16px)` }}
                  />
                </motion.figure>
              ))}
            </div>
          ) : (
            <div
              className="flex h-44 items-center justify-center border-2 border-dashed font-condensed text-2xl tracking-[0.08em]"
              style={{ borderColor: "#3a3f49", color: "#7d8595" }}
            >
              + ADD GARAGE PHOTOS
            </div>
          )}
        </section>
      )}

      {/* ── The circuit (venue) ──────────────────────────────────── */}
      {showVenue && (
        <section className="relative z-10 mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="grid gap-7 sm:grid-cols-[1fr,1.3fr]">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
                The circuit
              </p>
              <h2 className="mt-3 font-condensed text-[clamp(1.8rem,5vw,3rem)] leading-none tracking-[0.05em]">
                {(event.venueName || "TBA").toUpperCase()}
              </h2>
              {event.venueAddress && (
                <p className="mt-2 font-sans text-sm" style={{ color: "#9aa1ad" }}>
                  {event.venueAddress}
                </p>
              )}
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.24em]" style={{ color: "#7d8595" }}>
                Pit gates open 20 minutes before lights out
              </p>
              <div className="mt-5">
                <Car size={150} body={PIT_BLUE} reduce={reduce} speed={1.2} />
              </div>
            </div>
            <div style={{ border: `2px solid #2c2f36` }}>
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

      {/* ── Join the grid (RSVP) ─────────────────────────────────── */}
      <section className="relative z-10 px-5 py-16 text-center sm:px-8 sm:py-24">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mx-auto max-w-lg p-8 sm:p-10"
          style={{ background: "#1c2027", border: `2px solid ${YELLOW}66` }}
        >
          {/* chequered flag, waving */}
          <motion.div
            aria-hidden
            className="mx-auto mb-6 h-12 w-20"
            style={{
              background: `repeating-conic-gradient(${KERB_WHITE} 0% 25%, #0c0d0f 0% 50%) 50% / 16px 16px`,
            }}
            animate={reduce ? undefined : { skewY: [0, -6, 4, 0], scaleX: [1, 0.94, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
          <p className="font-mono text-[11px] uppercase tracking-[0.32em]" style={{ color: YELLOW }}>
            Grid slots
          </p>
          <h2 className="mt-4 font-condensed text-[clamp(1.8rem,6vw,3rem)] leading-none tracking-[0.05em]">
            JOIN THE GRID
          </h2>
          <p className="mt-3 font-sans text-sm" style={{ color: "#9aa1ad" }}>
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
              className="mt-7 inline-block px-10 py-3.5 font-condensed text-xl tracking-[0.14em] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
              style={{ background: accent, color: KERB_WHITE, outlineColor: YELLOW }}
            >
              I&apos;M RACING
            </a>
          )}
          {(event.contactName || event.contactPhone) && (
            <p className="mt-6 font-mono text-[11px]" style={{ color: "#7d8595" }}>
              {[event.contactName, event.contactPhone].filter(Boolean).join(" · ")}
            </p>
          )}
        </motion.div>
      </section>

      {/* ── Chequered flag footer ───────────────────────────────── */}
      <footer className="relative z-10">
        <Road reduce={reduce} height={56} />
        <div
          aria-hidden
          className="h-8 w-full"
          style={{ background: `repeating-conic-gradient(${KERB_WHITE} 0% 25%, #0c0d0f 0% 50%) 50% / 28px 28px` }}
        />
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-6 sm:px-8">
          <p className="font-condensed text-xl tracking-[0.08em]">{(event.eventTitle || "").toUpperCase()}</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em]" style={{ color: YELLOW }}>
            Chequered flag
          </p>
        </div>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default PitlaneTemplate;
