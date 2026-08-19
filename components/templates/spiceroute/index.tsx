"use client";

import { useMemo, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { HeroMedia } from "@/components/ui/HeroMedia";
import { MapEmbed } from "@/components/ui/MapEmbed";
import { MusicToggle } from "@/components/ui/MusicToggle";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { useEditMode } from "@/components/edit/EditContext";
import type { TemplateComponent, SubEvent, EventData } from "@/lib/types";

/* ── Spice Route · antique sea chart ──────────────────────────────────────
 * Palette   parchment #e8dcc0 · iron-gall ink #2f2a20 · sea teal #2c6e73
 *           cinnabar #b6452c · gold leaf #b48a3c
 * Type      Playfair (engraved place names) / Cormorant (log entries) /
 *           tracked caps (bearings, coordinates)
 * Layout    one continuous chart — sections are cartouches drawn ON the map,
 *           never cards floating above it.
 * Signature the route draws itself: a dotted rhumb line down the page, each
 *           port lighting as it is reached, and a wax X pressed at the end.
 * ──────────────────────────────────────────────────────────────────────── */

const EASE = [0.16, 1, 0.3, 1] as const;
const PARCH = "#e8dcc0";
const INK = "#2f2a20";
const SEA = "#2c6e73";
const CINNABAR = "#b6452c";
const GOLD = "#b48a3c";

const CHART_TEXTURE =
  `radial-gradient(ellipse at 20% 12%, rgba(180,138,60,0.16), transparent 55%),` +
  `radial-gradient(ellipse at 82% 78%, rgba(47,42,32,0.12), transparent 60%),` +
  `repeating-linear-gradient(0deg, rgba(47,42,32,0.035) 0 1px, transparent 1px 46px),` +
  `repeating-linear-gradient(90deg, rgba(47,42,32,0.035) 0 1px, transparent 1px 46px)`;

/** True bearing from one coordinate to another, for the port labels. */
function bearing(a: { lat: number; lng: number }, b: { lat: number; lng: number }): string {
  const φ1 = (a.lat * Math.PI) / 180;
  const φ2 = (b.lat * Math.PI) / 180;
  const Δλ = ((b.lng - a.lng) * Math.PI) / 180;
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const deg = ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
  const points = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return `${points[Math.round(deg / 22.5) % 16]} ${deg.toFixed(0).padStart(3, "0")}°`;
}

function portBearing(event: EventData, s: SubEvent): string | null {
  if (
    typeof event.latitude !== "number" ||
    typeof event.longitude !== "number" ||
    typeof s.latitude !== "number" ||
    typeof s.longitude !== "number"
  )
    return null;
  return bearing({ lat: event.latitude, lng: event.longitude }, { lat: s.latitude, lng: s.longitude });
}

/** Compass rose, drawn in ink. */
function CompassRose({ size = 130, reduce }: { size?: number; reduce: boolean }) {
  return (
    <motion.svg
      aria-hidden
      viewBox="0 0 100 100"
      width={size}
      height={size}
      animate={reduce ? undefined : { rotate: [0, 3, -2, 0] }}
      transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
    >
      <circle cx="50" cy="50" r="46" fill="none" stroke={INK} strokeWidth="0.8" opacity="0.6" />
      <circle cx="50" cy="50" r="38" fill="none" stroke={INK} strokeWidth="0.5" strokeDasharray="2 3" opacity="0.5" />
      {Array.from({ length: 16 }, (_, i) => {
        const a = (i / 16) * Math.PI * 2;
        const r1 = i % 4 === 0 ? 24 : 34;
        const r = (n: number) => Number(n.toFixed(2));
        return (
          <line
            key={i}
            x1={r(50 + Math.cos(a) * r1)}
            y1={r(50 + Math.sin(a) * r1)}
            x2={r(50 + Math.cos(a) * 45)}
            y2={r(50 + Math.sin(a) * 45)}
            stroke={INK}
            strokeWidth={i % 4 === 0 ? 1.1 : 0.5}
            opacity="0.65"
          />
        );
      })}
      <polygon points="50,6 56,50 50,44 44,50" fill={CINNABAR} />
      <polygon points="50,94 44,50 50,56 56,50" fill={INK} opacity="0.8" />
      <polygon points="50,50 94,50 56,54" fill={GOLD} opacity="0.8" />
      <polygon points="50,50 6,50 44,54" fill={GOLD} opacity="0.55" />
      <circle cx="50" cy="50" r="3" fill={INK} />
    </motion.svg>
  );
}

/** Rhumb lines radiating across the chart. */
function RhumbLines() {
  return (
    <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
      {[
        [12, 20],
        [86, 34],
        [48, 74],
      ].map(([cx, cy], k) =>
        Array.from({ length: 16 }, (_, i) => {
          const a = (i / 16) * Math.PI * 2;
          const r = (n: number) => Number(n.toFixed(2));
          return (
            <line
              key={`${k}-${i}`}
              x1={cx}
              y1={cy}
              x2={r(cx + Math.cos(a) * 120)}
              y2={r(cy + Math.sin(a) * 120)}
              stroke={INK}
              strokeWidth="0.12"
              opacity="0.35"
              vectorEffect="non-scaling-stroke"
            />
          );
        }),
      )}
    </svg>
  );
}

/** An engraved cartouche frame. */
function Cartouche({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`relative p-7 sm:p-10 ${className ?? ""}`}
      style={{
        background: "rgba(240,231,209,0.88)",
        border: `1px solid ${INK}55`,
        boxShadow: `inset 0 0 0 4px rgba(240,231,209,0.9), inset 0 0 0 5px ${GOLD}55, 0 22px 44px -34px ${INK}`,
      }}
    >
      {[
        "left-1.5 top-1.5",
        "right-1.5 top-1.5",
        "left-1.5 bottom-1.5",
        "right-1.5 bottom-1.5",
      ].map((pos) => (
        <span
          key={pos}
          aria-hidden
          className={`absolute h-3 w-3 ${pos}`}
          style={{ border: `1px solid ${GOLD}aa` }}
        />
      ))}
      {children}
    </div>
  );
}

/** SIGNATURE — the ports of call, joined by a route that draws on scroll. */
function PortsOfCall({
  items,
  event,
  reduce,
}: {
  items: SubEvent[];
  event: EventData;
  reduce: boolean;
}) {
  const sorted = [...items].sort((a, b) => a.order - b.order);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 60%"] });
  const drawn = useTransform(scrollYProgress, [0, 0.9], [0, 1]);

  return (
    <div ref={ref} className="relative mx-auto max-w-4xl pl-10 sm:pl-16">
      {/* the route itself */}
      <svg
        aria-hidden
        viewBox="0 0 20 1000"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-2 top-0 h-full w-8"
      >
        <motion.path
          d="M10 0 C 2 120, 18 240, 10 360 C 2 480, 18 620, 10 760 C 4 860, 14 940, 10 1000"
          fill="none"
          stroke={CINNABAR}
          strokeWidth="2"
          strokeDasharray="7 9"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={reduce ? { pathLength: 1 } : { pathLength: drawn }}
          opacity="0.85"
        />
      </svg>

      <ol className="space-y-8">
        {sorted.map((s, i) => {
          const bear = portBearing(event, s);
          return (
            <motion.li
              key={`${s.order}-${s.name}`}
              initial={reduce ? false : { opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-12% 0px" }}
              transition={{ duration: 0.65, delay: (i % 4) * 0.06, ease: EASE }}
              className="relative"
            >
              {/* the port marker on the route */}
              <span
                aria-hidden
                className="absolute -left-[34px] top-6 flex h-4 w-4 items-center justify-center rounded-full sm:-left-[54px]"
                style={{ background: PARCH, border: `2px solid ${SEA}` }}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: CINNABAR }} />
              </span>
              <Cartouche>
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <p className="font-sans text-[10px] uppercase tracking-[0.34em]" style={{ color: SEA }}>
                    Port {String(s.order).padStart(2, "0")}
                    {bear ? ` · bearing ${bear}` : ""}
                  </p>
                  <p className="font-sans text-[10px] uppercase tracking-[0.24em]" style={{ color: CINNABAR }}>
                    {[s.date, [s.startTime, s.endTime].filter(Boolean).join("–")].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <h3 className="mt-3 font-display text-2xl tracking-[0.04em] sm:text-3xl" style={{ color: INK }}>
                  {s.name}
                </h3>
                {s.venueName && (
                  <p className="mt-1.5 font-serif text-lg" style={{ color: SEA }}>
                    {s.venueName}
                  </p>
                )}
                {s.description && (
                  <p className="mt-3 font-serif text-base leading-relaxed" style={{ color: `${INK}cc` }}>
                    {s.description}
                  </p>
                )}
                {s.dressCode && (
                  <p
                    className="mt-4 inline-block px-2.5 py-1 font-sans text-[10px] uppercase tracking-[0.22em]"
                    style={{ background: `${GOLD}33`, color: INK }}
                  >
                    {s.dressCode}
                  </p>
                )}
              </Cartouche>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}

export const SpicerouteTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || SEA;
  const tagline = event.tagline?.trim() || "Two ports, one crossing";
  const invitation =
    event.invitationMessage?.trim() ||
    "Our families set out from opposite coasts. The chart says they meet here — come watch us make landfall.";
  const story =
    event.aboutStory?.trim() ||
    "Two cities, four airports and one very patient set of parents. Everything since has been a slow, deliberate voyage toward the same harbour.";
  const hero = event.heroImageUrl || "/samples/rings-roses.jpg";

  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const names = [event.person1Name, event.person2Name].filter(Boolean);

  const showStory = !event.hideStory;
  const showPorts = !event.hideEvents && subEvents.length > 0;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);
  const showVenue = !event.hideVenue;

  const dateLine = event.mainDate
    ? new Date(event.mainDate).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })
    : "";
  const coords =
    typeof event.latitude === "number" && typeof event.longitude === "number"
      ? `${Math.abs(event.latitude).toFixed(2)}°${event.latitude >= 0 ? "N" : "S"} ${Math.abs(event.longitude).toFixed(2)}°${event.longitude >= 0 ? "E" : "W"}`
      : "";

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-sans antialiased"
      style={{ "--accent": accent, background: PARCH, color: INK } as React.CSSProperties}
    >
      <ScrollProgress color={accent} />
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0" style={{ background: CHART_TEXTURE }} />

      {/* ── Hero: the chart ─────────────────────────────────────────── */}
      <section className="relative z-10 flex min-h-[100svh] items-center justify-center overflow-hidden pb-24 sm:pb-28">
        <div className="absolute inset-0">
          <HeroMedia
            imageSrc={hero}
            videoSrc={event.heroVideoUrl || undefined}
            alt={event.eventTitle}
            className="opacity-25 sepia"
          />
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(180deg, ${PARCH}ee 0%, ${PARCH}c4 45%, ${PARCH}f5 100%)` }}
          />
          <RhumbLines />
        </div>

        <div className="relative z-10 w-full max-w-4xl px-6 text-center">
          {/* the two home ports */}
          <div className="mb-10 flex items-center justify-center gap-4 sm:gap-10">
            {names.map((n, i) => (
              <motion.div
                key={n}
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 + i * 0.2, ease: EASE }}
                className="flex items-center gap-2"
              >
                <span className="h-2 w-2 rotate-45" style={{ background: CINNABAR }} />
                <span className="font-sans text-[10px] uppercase tracking-[0.34em]" style={{ color: SEA }}>
                  {i === 0 ? "Home port" : "Far port"}
                </span>
              </motion.div>
            ))}
          </div>

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: EASE }}
            className="font-display text-[clamp(2.3rem,8vw,5.2rem)] leading-[1.05] tracking-[0.03em]"
            style={{ color: INK }}
          >
            {names.length === 2 ? (
              <>
                {names[0]}
                <span className="mx-4 align-middle text-[0.4em]" style={{ color: CINNABAR }}>
                  ⚓
                </span>
                {names[1]}
              </>
            ) : (
              event.eventTitle
            )}
          </motion.h1>

          <p className="mt-6 font-serif text-lg italic" style={{ color: `${INK}b0` }}>
            {tagline}
          </p>

          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="mt-9 flex flex-col items-center gap-5"
          >
            <CompassRose size={104} reduce={reduce} />
            <p className="font-sans text-[11px] uppercase tracking-[0.32em]" style={{ color: SEA }}>
              {[dateLine, event.city, coords].filter(Boolean).join(" · ")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── The log entry ───────────────────────────────────────────── */}
      {showStory && (
        <section className="relative z-10 px-6 py-20 sm:py-28">
          <Cartouche className="mx-auto max-w-2xl text-center">
            <p className="font-sans text-[10px] uppercase tracking-[0.36em]" style={{ color: CINNABAR }}>
              From the ship's log
            </p>
            <motion.h2
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: EASE }}
              className="mt-5 font-display text-2xl leading-snug sm:text-3xl"
              style={{ color: INK }}
            >
              {invitation}
            </motion.h2>
            <div aria-hidden className="mx-auto my-7 h-px w-20" style={{ background: `${INK}55` }} />
            <p className="font-serif text-lg leading-loose" style={{ color: `${INK}cc` }}>
              {story}
            </p>
          </Cartouche>
        </section>
      )}

      {/* ── Ports of call ───────────────────────────────────────────── */}
      {showPorts && (
        <section className="relative z-10 px-5 py-16 sm:px-6 sm:py-20">
          <header className="mx-auto mb-10 max-w-4xl pl-10 sm:pl-16">
            <p className="font-sans text-[10px] uppercase tracking-[0.36em]" style={{ color: CINNABAR }}>
              The crossing
            </p>
            <h2 className="mt-2 font-display text-3xl tracking-[0.03em] sm:text-4xl" style={{ color: INK }}>
              Ports of call
            </h2>
          </header>
          <PortsOfCall items={subEvents} event={event} reduce={reduce} />
        </section>
      )}

      {/* ── Sketches in the margin ─────────────────────────────────── */}
      {showGallery && (
        <section className="relative z-10 mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <h2 className="mb-9 font-display text-3xl tracking-[0.03em]" style={{ color: INK }}>
            Sketched in the margin
          </h2>
          {galleryItems.length > 0 ? (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {galleryItems.map((m, i) => (
                <motion.figure
                  key={`${m.fileName}-${i}`}
                  initial={reduce ? false : { opacity: 0, y: 20, rotate: 0 }}
                  whileInView={{ opacity: 1, y: 0, rotate: i % 3 === 1 ? 1.2 : -1 }}
                  viewport={{ once: true, margin: "-8% 0px" }}
                  transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: EASE }}
                  className="p-2"
                  style={{
                    background: "rgba(240,231,209,0.9)",
                    border: `1px solid ${INK}44`,
                    boxShadow: `0 18px 34px -28px ${INK}`,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={m.publicUrl}
                    alt={m.caption ?? ""}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover sepia-[0.35]"
                  />
                  <figcaption
                    className="pt-2.5 text-center font-serif text-base italic"
                    style={{ color: `${INK}b0` }}
                  >
                    {m.caption || "unnamed shore"}
                  </figcaption>
                </motion.figure>
              ))}
            </div>
          ) : (
            <div
              className="flex h-44 items-center justify-center border border-dashed font-serif text-base italic"
              style={{ borderColor: `${INK}55`, color: `${INK}99` }}
            >
              + Add sketches to the margin
            </div>
          )}
        </section>
      )}

      {/* ── The X, pressed in wax ─────────────────────────────────── */}
      {showVenue && (
        <section className="relative z-10 mx-auto max-w-4xl px-6 py-16 sm:py-20">
          <Cartouche>
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div>
                <p className="font-sans text-[10px] uppercase tracking-[0.36em]" style={{ color: CINNABAR }}>
                  Landfall
                </p>
                <h2 className="mt-3 font-display text-3xl tracking-[0.03em]" style={{ color: INK }}>
                  {event.venueName || "The venue"}
                </h2>
                {event.venueAddress && (
                  <p className="mt-2 font-serif text-base" style={{ color: `${INK}c0` }}>
                    {event.venueAddress}
                  </p>
                )}
                {coords && (
                  <p className="mt-2 font-sans text-[10px] uppercase tracking-[0.28em]" style={{ color: SEA }}>
                    {coords}
                  </p>
                )}
              </div>
              {/* the wax X */}
              <motion.div
                aria-hidden
                initial={reduce ? false : { scale: 1.5, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, ease: "backOut" }}
                className="flex h-20 w-20 items-center justify-center rounded-full"
                style={{ background: CINNABAR, boxShadow: "inset 0 -3px 8px rgba(0,0,0,0.4)" }}
              >
                <span className="font-display text-3xl text-white">✕</span>
              </motion.div>
            </div>
            <div className="mt-7" style={{ border: `1px solid ${INK}44` }}>
              <MapEmbed
                latitude={event.latitude}
                longitude={event.longitude}
                venueName={event.venueName}
                venueAddress={event.venueAddress}
                mapLink={event.mapLink}
              />
            </div>
          </Cartouche>
        </section>
      )}

      {/* ── The manifest ──────────────────────────────────────────── */}
      <section className="relative z-10 px-6 py-20 text-center sm:py-28">
        <Cartouche className="mx-auto max-w-xl">
          <p className="font-sans text-[10px] uppercase tracking-[0.36em]" style={{ color: SEA }}>
            Sign the manifest
          </p>
          <h2 className="mt-4 font-display text-3xl tracking-[0.03em]" style={{ color: INK }}>
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
              className="mt-8 inline-block px-10 py-3.5 font-sans text-[11px] uppercase tracking-[0.3em] text-white transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
              style={{ background: SEA, outlineColor: CINNABAR }}
            >
              Come aboard
            </a>
          )}
          {(event.contactName || event.contactPhone) && (
            <p className="mt-6 font-serif text-base italic" style={{ color: `${INK}a8` }}>
              {[event.contactName, event.contactPhone].filter(Boolean).join(" · ")}
            </p>
          )}
        </Cartouche>
      </section>

      <footer className="relative z-10 border-t" style={{ borderColor: `${INK}33` }}>
        <div className="flex flex-wrap items-center justify-between gap-5 px-6 py-7">
          <CompassRose size={54} reduce={reduce} />
          <p className="font-display text-sm tracking-[0.16em]" style={{ color: `${INK}b0` }}>
            {event.eventTitle}
          </p>
          <div aria-hidden className="flex items-end gap-1">
            {[10, 16, 10, 16, 10].map((h, i) => (
              <span key={i} className="w-6" style={{ height: h, background: i % 2 ? INK : "transparent", border: `1px solid ${INK}` }} />
            ))}
          </div>
        </div>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default SpicerouteTemplate;
