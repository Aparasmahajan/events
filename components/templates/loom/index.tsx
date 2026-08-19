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

/* ── Loom · handloom weave ────────────────────────────────────────────────
 * Palette   indigo #24365c · madder #a8323e · turmeric #d9a02b
 *           undyed cotton #efe7d7 · ink #221c18
 * Type      Playfair Display (names, section titles) / Inter (body) /
 *           tracked Inter caps (times, labels)
 * Layout    one continuous cloth — every section is a band of weave separated
 *           by thread-count rules, never by empty whitespace gaps.
 * Signature the loom actually weaves: two named threads cross on load, and the
 *           weft draws itself line by line as the page scrolls until the motif
 *           locks and becomes the border for everything below.
 * ──────────────────────────────────────────────────────────────────────── */

const EASE = [0.16, 1, 0.3, 1] as const;
const INDIGO = "#24365c";
const MADDER = "#a8323e";
const TURMERIC = "#d9a02b";
const COTTON = "#efe7d7";
const INK = "#221c18";

/** Warp hairlines — the cloth the whole page sits on. */
const THREAD_COUNT =
  `repeating-linear-gradient(90deg, ${INDIGO}0d 0px, ${INDIGO}0d 1px, transparent 1px, transparent 7px),` +
  `repeating-linear-gradient(0deg, ${INK}08 0px, ${INK}08 1px, transparent 1px, transparent 7px)`;

/** Eight-point weave motif — the unit the whole template repeats. */
function Motif({ size = 26, color, className }: { size?: number; color: string; className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" width={size} height={size} className={className}>
      <path d="M12 1 L14.6 9.4 L23 12 L14.6 14.6 L12 23 L9.4 14.6 L1 12 L9.4 9.4 Z" fill={color} opacity="0.9" />
      <path d="M12 6.5 L13.4 10.6 L17.5 12 L13.4 13.4 L12 17.5 L10.6 13.4 L6.5 12 L10.6 10.6 Z" fill={COTTON} opacity="0.75" />
    </svg>
  );
}

/** A single weft thread that draws itself across the warp as `p` advances. */
function Weft({
  p,
  index,
  total,
  color,
  reduce,
}: {
  p: MotionValue<number>;
  index: number;
  total: number;
  color: string;
  reduce: boolean;
}) {
  const from = (index / total) * 0.75;
  const drawn = useTransform(p, [from, from + 0.25], [0, 1]);
  const y = 6 + (index * 88) / total;
  return (
    <motion.line
      x1="0"
      y1={y}
      x2="100"
      y2={y}
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      style={reduce ? { pathLength: 1 } : { pathLength: drawn }}
      opacity="0.75"
    />
  );
}

/** The loom: static warp + weft that arrives with scroll. */
function LoomCloth({ p, reduce }: { p: MotionValue<number>; reduce: boolean }) {
  const WEFT = 11;
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="absolute inset-0 h-full w-full"
    >
      {Array.from({ length: 21 }, (_, i) => (
        <line
          key={`warp-${i}`}
          x1={2 + i * 4.8}
          y1="0"
          x2={2 + i * 4.8}
          y2="100"
          stroke={INDIGO}
          strokeWidth="0.8"
          opacity="0.16"
        />
      ))}
      {Array.from({ length: WEFT }, (_, i) => (
        <Weft
          key={`weft-${i}`}
          p={p}
          index={i}
          total={WEFT}
          color={i % 3 === 2 ? TURMERIC : MADDER}
          reduce={reduce}
        />
      ))}
    </svg>
  );
}

/** Hero signature — two threads come in from opposite sides, cross, and the
 *  weft fills the crossing. Deliberately a contained motif at a fixed aspect
 *  ratio: a full-bleed version distorts into unrelated arcs on wide screens. */
function CrossingThreads({ reduce, accent }: { reduce: boolean; accent: string }) {
  const draw = (delay: number) =>
    reduce
      ? { initial: false as const, animate: { pathLength: 1 } }
      : {
          initial: { pathLength: 0 },
          animate: { pathLength: 1 },
          transition: { duration: 1.6, delay, ease: EASE },
        };
  return (
    <svg
      aria-hidden
      viewBox="0 0 300 120"
      className="mx-auto h-[70px] w-[240px] sm:h-[100px] sm:w-[320px]"
    >
      <motion.path
        d="M4 18 C 90 18, 120 60, 150 60 C 180 60, 210 102, 296 102"
        fill="none"
        stroke={INDIGO}
        strokeWidth="2.4"
        strokeLinecap="round"
        {...draw(0.25)}
      />
      <motion.path
        d="M296 18 C 210 18, 180 60, 150 60 C 120 60, 90 102, 4 102"
        fill="none"
        stroke={accent}
        strokeWidth="2.4"
        strokeLinecap="round"
        {...draw(0.5)}
      />
      {/* The weft fills in where the two threads meet. */}
      {[46, 53, 67, 74].map((y, i) => (
        <motion.line
          key={y}
          x1="112"
          y1={y}
          x2="188"
          y2={y}
          stroke={TURMERIC}
          strokeWidth="2"
          strokeLinecap="round"
          initial={reduce ? false : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.9 }}
          transition={{ duration: 0.7, delay: reduce ? 0 : 1.5 + i * 0.12, ease: EASE }}
        />
      ))}
      {[
        [4, 18],
        [296, 18],
        [4, 102],
        [296, 102],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3" fill={INK} opacity="0.35" />
      ))}
    </svg>
  );
}

function BandRule({ color = INDIGO }: { color?: string }) {
  return (
    <div
      aria-hidden
      className="h-[6px] w-full"
      style={{
        background: `repeating-linear-gradient(90deg, ${color} 0px, ${color} 3px, transparent 3px, transparent 9px)`,
        opacity: 0.35,
      }}
    />
  );
}

function SectionTitle({ label, title, accent }: { label: string; title: string; accent: string }) {
  return (
    <header className="mb-10 flex items-center gap-4">
      <Motif size={22} color={accent} />
      <div>
        <p className="font-sans text-[10px] uppercase tracking-[0.42em]" style={{ color: `${INK}99` }}>
          {label}
        </p>
        <h2 className="font-display text-3xl leading-tight sm:text-4xl" style={{ color: INDIGO }}>
          {title}
        </h2>
      </div>
    </header>
  );
}

/** Sub-events as woven bands — the weft sweeps in as each band enters view. */
function WovenBands({ items, accent, reduce }: { items: SubEvent[]; accent: string; reduce: boolean }) {
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <ol className="mx-auto max-w-4xl">
      {sorted.map((s, i) => {
        const warp = i % 2 === 0 ? INDIGO : MADDER;
        return (
          <li key={`${s.order}-${s.name}`}>
            <BandRule color={warp} />
            <motion.article
              initial={reduce ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-12% 0px" }}
              transition={{ duration: 0.7, ease: EASE }}
              className="relative overflow-hidden px-5 py-8 sm:px-8"
            >
              <motion.div
                aria-hidden
                initial={reduce ? false : { scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: "-12% 0px" }}
                transition={{ duration: 1.1, ease: EASE }}
                className="absolute inset-0 origin-left"
                style={{
                  background: `repeating-linear-gradient(0deg, ${warp}12 0px, ${warp}12 2px, transparent 2px, transparent 8px)`,
                }}
              />
              <div className="relative flex flex-col gap-4 sm:flex-row sm:items-baseline sm:gap-8">
                <div className="flex shrink-0 items-center gap-3">
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-sm font-sans text-xs font-semibold text-white"
                    style={{ background: warp }}
                  >
                    {String(s.order).padStart(2, "0")}
                  </span>
                  {s.icon && <span className="text-xl">{s.icon}</span>}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-2xl" style={{ color: INDIGO }}>
                    {s.name}
                  </h3>
                  {s.description && (
                    <p className="mt-2 max-w-prose font-sans text-sm leading-relaxed" style={{ color: `${INK}c4` }}>
                      {s.description}
                    </p>
                  )}
                  {s.dressCode && (
                    <p
                      className="mt-3 inline-block rounded-sm px-2.5 py-1 font-sans text-[10px] uppercase tracking-[0.24em]"
                      style={{ background: `${TURMERIC}2e`, color: INK }}
                    >
                      {s.dressCode}
                    </p>
                  )}
                </div>
                <div className="shrink-0 sm:text-right">
                  <p className="font-sans text-[11px] uppercase tracking-[0.28em]" style={{ color: accent }}>
                    {[s.date, s.startTime].filter(Boolean).join(" · ")}
                  </p>
                  {s.venueName && (
                    <p className="mt-1 font-sans text-xs" style={{ color: `${INK}99` }}>
                      {s.venueName}
                    </p>
                  )}
                </div>
              </div>
            </motion.article>
          </li>
        );
      })}
      <BandRule />
    </ol>
  );
}

/** Gallery photo in an embroidery hoop. */
function Hoop({
  url,
  caption,
  accent,
  delay,
  reduce,
}: {
  url: string;
  caption?: string;
  accent: string;
  delay: number;
  reduce: boolean;
}) {
  return (
    <motion.figure
      initial={reduce ? false : { opacity: 0, scale: 0.94 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      className="group text-center"
    >
      <div className="relative mx-auto aspect-square w-full max-w-[260px]">
        <div
          aria-hidden
          className="absolute left-1/2 top-0 h-4 w-8 -translate-x-1/2 rounded-t-sm"
          style={{ background: TURMERIC, opacity: 0.85 }}
        />
        <div
          className="h-full w-full overflow-hidden rounded-full"
          style={{ border: `6px solid ${TURMERIC}`, boxShadow: `0 0 0 2px ${accent}66, 0 16px 34px -20px ${INK}` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt={caption ?? ""}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      </div>
      {caption && (
        <figcaption className="mt-3 font-sans text-[11px] uppercase tracking-[0.24em]" style={{ color: `${INK}99` }}>
          {caption}
        </figcaption>
      )}
    </motion.figure>
  );
}

/** Hand-stitched selvedge border. */
function Selvedge({ children, accent }: { children: React.ReactNode; accent: string }) {
  return (
    <div className="relative p-3" style={{ background: `${COTTON}` }}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          border: `2px dashed ${accent}88`,
          borderRadius: 2,
        }}
      />
      <div className="relative overflow-hidden" style={{ boxShadow: `0 18px 40px -28px ${INK}` }}>
        {children}
      </div>
    </div>
  );
}

export const LoomTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || MADDER;
  const tagline = event.tagline?.trim() || "Two threads, one cloth";
  const invitation =
    event.invitationMessage?.trim() ||
    "Our families have been weaving toward this day for a long time. Come stand with us while the last thread goes in.";
  const story =
    event.aboutStory?.trim() ||
    "One loom, two names, and a pattern neither of us could have drawn alone. Every thread in it belongs to someone who got us here.";
  const hero = event.heroImageUrl || "/samples/bridal-lehenga.jpg";

  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);

  const clothRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: clothP } = useScroll({
    target: clothRef,
    offset: ["start end", "center center"],
  });

  const showStory = !event.hideStory;
  const showBands = !event.hideEvents && subEvents.length > 0;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);
  const showVenue = !event.hideVenue;

  const dateLine = event.mainDate
    ? new Date(event.mainDate).toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-sans antialiased"
      style={{ "--accent": accent, background: COTTON, color: INK } as React.CSSProperties}
    >
      <ScrollProgress color={accent} />
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0" style={{ background: THREAD_COUNT }} />

      {/* ── Hero: the threads enter ─────────────────────────────────── */}
      <section className="relative z-10 flex min-h-[100svh] items-center justify-center overflow-hidden pb-24 sm:pb-28">
        <div className="absolute inset-0">
          <HeroMedia
            imageSrc={hero}
            videoSrc={event.heroVideoUrl || undefined}
            alt={event.eventTitle}
            className="opacity-30"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, ${COTTON}ee 0%, ${COTTON}cc 42%, ${COTTON}f6 100%)`,
            }}
          />
        </div>

        <div className="relative z-10 px-6 text-center">
          <CrossingThreads reduce={reduce} accent={accent} />

          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="mb-8 mt-6 font-sans text-[10px] uppercase tracking-[0.5em]"
            style={{ color: `${INK}a8` }}
          >
            {tagline}
          </motion.p>

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: EASE }}
            className="font-display text-[clamp(2.4rem,8vw,5.6rem)] leading-[1.02]"
            style={{ color: INDIGO }}
          >
            {event.person1Name || event.eventTitle}
            {event.person2Name && (
              <>
                <span className="mx-3 align-middle text-[0.42em]" style={{ color: accent }}>
                  ✕
                </span>
                {event.person2Name}
              </>
            )}
          </motion.h1>

          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 1.6 }}
            className="mt-9 flex flex-col items-center gap-4"
          >
            <Motif size={30} color={accent} />
            {dateLine && (
              <p className="font-sans text-[11px] uppercase tracking-[0.38em]" style={{ color: `${INK}b0` }}>
                {dateLine}
                {event.city ? ` · ${event.city}` : ""}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      <BandRule />

      {/* ── The weave completes: story on the loom ──────────────────── */}
      {showStory && (
        <section ref={clothRef} className="relative z-10 overflow-hidden px-6 py-24 sm:py-32">
          <div aria-hidden className="absolute inset-0 opacity-70">
            <LoomCloth p={clothP} reduce={reduce} />
          </div>
          <div
            className="relative mx-auto max-w-2xl p-8 text-center sm:p-12"
            style={{ background: `${COTTON}f2`, boxShadow: `0 20px 60px -40px ${INK}` }}
          >
            <p className="font-sans text-[10px] uppercase tracking-[0.42em]" style={{ color: accent }}>
              On the loom
            </p>
            <motion.h2
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: EASE }}
              className="mt-5 font-display text-2xl leading-snug sm:text-3xl"
              style={{ color: INDIGO }}
            >
              {invitation}
            </motion.h2>
            <div aria-hidden className="mx-auto my-8 flex items-center justify-center gap-3">
              <span className="h-px w-12" style={{ background: `${INDIGO}66` }} />
              <Motif size={18} color={TURMERIC} />
              <span className="h-px w-12" style={{ background: `${INDIGO}66` }} />
            </div>
            <p className="font-sans text-sm leading-relaxed sm:text-base" style={{ color: `${INK}c4` }}>
              {story}
            </p>
          </div>
        </section>
      )}

      {/* ── Sub-events: woven bands ─────────────────────────────────── */}
      {showBands && (
        <section className="relative z-10 px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-4xl">
            <SectionTitle label="Band by band" title="The days, in order" accent={accent} />
          </div>
          <WovenBands items={subEvents} accent={accent} reduce={reduce} />
        </section>
      )}

      {/* ── Gallery: embroidery hoops ───────────────────────────────── */}
      {showGallery && (
        <section className="relative z-10 mx-auto max-w-6xl px-6 py-20 sm:py-24">
          <SectionTitle label="Held in the hoop" title="Photographs" accent={accent} />
          {galleryItems.length > 0 ? (
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {galleryItems.map((m, i) => (
                <Hoop
                  key={`${m.fileName}-${i}`}
                  url={m.publicUrl}
                  caption={m.caption}
                  accent={accent}
                  delay={(i % 3) * 0.1}
                  reduce={reduce}
                />
              ))}
            </div>
          ) : (
            <div
              className="flex h-48 items-center justify-center border-2 border-dashed font-sans text-sm"
              style={{ borderColor: `${INDIGO}55`, color: `${INK}99` }}
            >
              + Add photos to fill the hoops
            </div>
          )}
        </section>
      )}

      {/* ── Venue on a stitched selvedge ────────────────────────────── */}
      {showVenue && (
        <section className="relative z-10 mx-auto max-w-4xl px-6 py-20 sm:py-24">
          <SectionTitle label="Where the cloth is finished" title={event.venueName || "The venue"} accent={accent} />
          {event.venueAddress && (
            <p className="mb-6 font-sans text-sm" style={{ color: `${INK}b0` }}>
              {event.venueAddress}
            </p>
          )}
          <Selvedge accent={accent}>
            <MapEmbed
              latitude={event.latitude}
              longitude={event.longitude}
              venueName={event.venueName}
              venueAddress={event.venueAddress}
              mapLink={event.mapLink}
            />
          </Selvedge>
        </section>
      )}

      {/* ── RSVP: a hand-stamped label ──────────────────────────────── */}
      <section className="relative z-10 px-6 py-24 text-center sm:py-32">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mx-auto max-w-xl"
        >
          <div
            className="relative mx-auto inline-block px-10 py-8"
            style={{ background: "#fff", border: `1px solid ${INDIGO}33`, boxShadow: `0 22px 50px -34px ${INK}` }}
          >
            <div
              aria-hidden
              className="absolute -right-4 -top-4 flex h-16 w-16 -rotate-12 items-center justify-center rounded-full font-sans text-[9px] uppercase tracking-[0.16em]"
              style={{ border: `2px solid ${accent}aa`, color: accent, background: `${COTTON}ee` }}
            >
              handwoven
            </div>
            <p className="font-sans text-[10px] uppercase tracking-[0.42em]" style={{ color: `${INK}99` }}>
              With our families
            </p>
            <h2 className="mt-4 font-display text-3xl" style={{ color: INDIGO }}>
              {event.eventTitle}
            </h2>
            {event.rsvpEnabled && event.rsvpLinkOrContact && (
              <a
                href={
                  event.rsvpLinkOrContact.startsWith("http")
                    ? event.rsvpLinkOrContact
                    : `tel:${event.rsvpLinkOrContact}`
                }
                target={event.rsvpLinkOrContact.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="mt-8 inline-block rounded-sm px-10 py-3.5 font-sans text-xs uppercase tracking-[0.3em] text-white transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
                style={{ background: accent, outlineColor: INDIGO }}
              >
                Tell us you're coming
              </a>
            )}
            {event.contactName && (
              <p className="mt-6 font-sans text-xs" style={{ color: `${INK}99` }}>
                {event.contactName}
                {event.contactPhone ? ` · ${event.contactPhone}` : ""}
              </p>
            )}
          </div>
        </motion.div>
      </section>

      <footer className="relative z-10">
        <div
          aria-hidden
          className="flex h-10 items-center justify-center gap-4 overflow-hidden"
          style={{ background: `${INDIGO}12` }}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <Motif key={i} size={16} color={i % 2 ? accent : TURMERIC} />
          ))}
        </div>
        <p className="py-6 text-center font-sans text-[11px] tracking-[0.2em]" style={{ color: `${INK}8a` }}>
          {event.eventTitle}
          {event.person1Name && event.person2Name ? ` · ${event.person1Name} & ${event.person2Name}` : ""}
        </p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default LoomTemplate;
