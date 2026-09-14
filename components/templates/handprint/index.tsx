"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { HeroMedia } from "@/components/ui/HeroMedia";
import { MapEmbed } from "@/components/ui/MapEmbed";
import { MusicToggle } from "@/components/ui/MusicToggle";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { useEditMode } from "@/components/edit/EditContext";
import { celebrationDayCopy } from "@/lib/celebrationDay";
import type { TemplateComponent, SubEvent } from "@/lib/types";

/* ── Handprint · the homemade card ────────────────────────────────────────
 * Palette   kraft #e5d4b8 · crayon red #e2574c · crayon blue #3f7fbf
 *           crayon yellow #f2c14e · pencil #3a352f
 * Type      Permanent Marker (headings) / Caveat (the written bits) / Inter
 * Layout    pages torn from a scrapbook — kraft paper, taped photos, ruled
 *           fill-in lines, everything a degree or two off square.
 * Signature crayon strokes that draw themselves, and a handprint that presses
 *           into the page when the hero arrives.
 * Reads     event.eventSubtype — the same page serves Father's Day, Rakhi,
 *           Teachers' Day or a bump reveal, with the words changing.
 * ──────────────────────────────────────────────────────────────────────── */

const EASE = [0.16, 1, 0.3, 1] as const;
const KRAFT = "#e5d4b8";
const KRAFT_DEEP = "#d6c09c";
const RED = "#e2574c";
const BLUE = "#3f7fbf";
const YELLOW = "#f2c14e";
const PENCIL = "#3a352f";
const CRAYONS = [RED, BLUE, YELLOW, "#5fa860"];

const PAPER_TEXTURE =
  `radial-gradient(circle at 18% 22%, rgba(255,255,255,0.35), transparent 42%),` +
  `radial-gradient(circle at 78% 68%, rgba(0,0,0,0.05), transparent 45%)`;

/** A crayon stroke that draws itself. */
function Crayon({
  d,
  color,
  delay = 0,
  width = 9,
  reduce,
  className,
}: {
  d: string;
  color: string;
  delay?: number;
  width?: number;
  reduce: boolean;
  className?: string;
}) {
  return (
    <svg aria-hidden viewBox="0 0 300 60" className={className} preserveAspectRatio="none">
      <motion.path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        opacity="0.85"
        initial={reduce ? false : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay, ease: EASE }}
      />
    </svg>
  );
}

/** SIGNATURE — a small hand pressing into the page. */
function Handprint({ color, reduce, size = 150 }: { color: string; reduce: boolean; size?: number }) {
  return (
    <motion.svg
      aria-hidden
      viewBox="0 0 100 120"
      width={size}
      height={size * 1.2}
      initial={reduce ? false : { scale: 1.25, opacity: 0, rotate: -8 }}
      animate={{ scale: 1, opacity: 0.9, rotate: -4 }}
      transition={{ duration: 0.6, delay: 0.5, ease: "backOut" }}
    >
      {/* four fingers + thumb, each its own capsule so they read as fingers */}
      {[
        { x: 33, y: 40, w: 13, h: 40, r: -14 },
        { x: 47, y: 30, w: 13, h: 50, r: -4 },
        { x: 61, y: 33, w: 13, h: 47, r: 5 },
        { x: 74, y: 44, w: 12, h: 36, r: 14 },
      ].map((f) => (
        <rect
          key={f.x}
          x={f.x}
          y={f.y}
          width={f.w}
          height={f.h}
          rx={f.w / 2}
          fill={color}
          transform={`rotate(${f.r} ${f.x + f.w / 2} ${f.y + f.h})`}
        />
      ))}
      <rect x="14" y="62" width="12" height="30" rx="6" fill={color} transform="rotate(38 20 92)" />
      {/* palm */}
      <rect x="30" y="66" width="56" height="40" rx="19" fill={color} />
    </motion.svg>
  );
}

/** Torn kraft page. */
function Page({
  children,
  className,
  rotate = 0,
}: {
  children: React.ReactNode;
  className?: string;
  rotate?: number;
}) {
  return (
    <div
      className={`relative ${className ?? ""}`}
      style={{
        background: `${KRAFT}`,
        backgroundImage: PAPER_TEXTURE,
        transform: `rotate(${rotate}deg)`,
        boxShadow: "0 22px 44px -30px rgba(58,53,47,0.75)",
      }}
    >
      {children}
    </div>
  );
}

/** Washi tape strip. */
function Tape({ className, rotate = 0, color = YELLOW }: { className?: string; rotate?: number; color?: string }) {
  return (
    <span
      aria-hidden
      className={`absolute h-6 w-24 ${className ?? ""}`}
      style={{
        background: `${color}cc`,
        transform: `rotate(${rotate}deg)`,
        clipPath: "polygon(0 8%, 100% 0, 100% 92%, 0 100%)",
      }}
    />
  );
}

/** A fill-in-the-blank line — the thing every school card has. */
function FillIn({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <p className="mt-4 flex flex-wrap items-end gap-2 font-hand text-2xl" style={{ color: PENCIL }}>
      <span>{label}</span>
      <span
        className="min-w-[8rem] flex-1 border-b-2 pb-0.5 text-center"
        style={{ borderColor: `${color}aa`, color }}
      >
        {value}
      </span>
    </p>
  );
}

/** Sub-events as taped-in plan cards. */
function PlanCards({ items, reduce }: { items: SubEvent[]; reduce: boolean }) {
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <ol className="grid gap-7 sm:grid-cols-2">
      {sorted.map((s, i) => {
        const c = CRAYONS[i % CRAYONS.length];
        return (
          <motion.li
            key={`${s.order}-${s.name}`}
            initial={reduce ? false : { opacity: 0, y: 22, rotate: 0 }}
            whileInView={{ opacity: 1, y: 0, rotate: i % 2 ? 1.2 : -1.4 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.6, delay: (i % 4) * 0.07, ease: EASE }}
          >
            <div className="relative px-6 pb-6 pt-9" style={{ background: "#fffdf7", boxShadow: "0 16px 32px -26px rgba(58,53,47,0.8)" }}>
              <Tape className="-top-3 left-6" rotate={-7} color={c} />
              <p className="font-hand text-xl" style={{ color: c }}>
                {[s.date, [s.startTime, s.endTime].filter(Boolean).join(" – ")].filter(Boolean).join(" · ")}
              </p>
              <h3 className="mt-1 font-marker text-2xl leading-tight" style={{ color: PENCIL }}>
                {s.icon ? `${s.icon} ` : ""}
                {s.name}
              </h3>
              {s.venueName && (
                <p className="mt-1.5 font-hand text-xl" style={{ color: BLUE }}>
                  at {s.venueName}
                </p>
              )}
              {s.description && (
                <p className="mt-2 font-sans text-sm leading-relaxed" style={{ color: `${PENCIL}c8` }}>
                  {s.description}
                </p>
              )}
            </div>
          </motion.li>
        );
      })}
    </ol>
  );
}

export const HandprintTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;
  const day = celebrationDayCopy(event.eventSubtype);

  const accent = event.themeAccentColor || RED;
  const tagline = event.tagline?.trim() || day.tagline;
  const invitation = event.invitationMessage?.trim() || day.invitation;
  const story = event.aboutStory?.trim() || day.story;
  const hero = event.heroImageUrl || "/samples/wedding-flowers.jpg";

  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const honoured = event.person1Name?.trim() || event.eventTitle;
  const from = event.person2Name?.trim();

  const showStory = !event.hideStory;
  const showPlan = !event.hideEvents && subEvents.length > 0;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);
  // A Father's Day page usually has no venue at all — only show the map when
  // there is genuinely somewhere to go.
  const showVenue = !event.hideVenue && !!(event.venueName || event.mapLink);

  const dateLine = event.mainDate
    ? new Date(event.mainDate).toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" })
    : "";

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-sans antialiased"
      style={{ "--accent": accent, background: KRAFT_DEEP, color: PENCIL } as React.CSSProperties}
    >
      <ScrollProgress color={accent} />

      {/* ── Hero: the card, made by hand ───────────────────────────── */}
      <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-4 pb-24 pt-12 sm:px-6 sm:pb-28">
        <div className="absolute inset-0">
          <HeroMedia
            imageSrc={hero}
            videoSrc={event.heroVideoUrl || undefined}
            alt={event.eventTitle}
            className="opacity-25"
          />
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${KRAFT_DEEP}e0, ${KRAFT_DEEP}b8 45%, ${KRAFT_DEEP}f2)` }} />
        </div>

        <Page className="relative z-10 w-full max-w-2xl px-6 py-10 sm:px-12 sm:py-14" rotate={-1}>
          <Tape className="-top-3 left-8" rotate={-6} color={BLUE} />
          <Tape className="-top-3 right-10" rotate={5} color={RED} />

          <p className="text-center font-marker text-lg" style={{ color: accent }}>
            {day.icon} {day.greeting}
          </p>

          <motion.h1
            initial={reduce ? false : { opacity: 0, scale: 0.95, rotate: -3 }}
            animate={{ opacity: 1, scale: 1, rotate: -1.5 }}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
            className="mt-4 text-center font-marker text-[clamp(2.4rem,10vw,5rem)] leading-[0.98]"
            style={{ color: PENCIL }}
          >
            {honoured}
          </motion.h1>

          <Crayon
            d="M6 34 q70 -18 140 -4 q70 14 148 -6"
            color={accent}
            delay={0.6}
            reduce={reduce}
            className="mx-auto mt-1 h-6 w-full max-w-md"
          />

          <p className="mt-3 text-center font-hand text-2xl" style={{ color: `${PENCIL}b8` }}>
            {tagline}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
            <Handprint color={`${accent}dd`} reduce={reduce} size={120} />
            <div className="text-left">
              <FillIn label={`${day.forLabel}:`} value={honoured} color={BLUE} />
              {from && <FillIn label="From:" value={from} color={RED} />}
              {dateLine && <FillIn label="Date:" value={dateLine} color={YELLOW} />}
            </div>
          </div>
        </Page>
      </section>

      {/* ── The letter ─────────────────────────────────────────────── */}
      {showStory && (
        <section className="relative px-4 py-16 sm:px-6 sm:py-24">
          <Page className="mx-auto max-w-3xl px-7 py-10 sm:px-12 sm:py-14" rotate={0.8}>
            <Tape className="-top-3 left-1/2 -translate-x-1/2" rotate={-4} />
            <p className="font-marker text-xl" style={{ color: accent }}>
              What we wanted to say
            </p>
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: EASE }}
              className="mt-5 font-hand text-[1.7rem] leading-snug sm:text-3xl"
              style={{ color: PENCIL }}
            >
              {invitation}
            </motion.p>
            <Crayon
              d="M4 30 q80 -14 150 0 q66 12 142 -4"
              color={BLUE}
              delay={0.3}
              width={7}
              reduce={reduce}
              className="my-6 h-5 w-full"
            />
            <p className="font-sans text-sm leading-relaxed sm:text-base" style={{ color: `${PENCIL}c4` }}>
              {story}
            </p>
            {from && (
              <p className="mt-7 text-right font-marker text-xl" style={{ color: RED }}>
                — {from}
              </p>
            )}
          </Page>
        </section>
      )}

      {/* ── The plan ──────────────────────────────────────────────── */}
      {showPlan && (
        <section className="relative mx-auto max-w-4xl px-5 py-14 sm:px-6 sm:py-18">
          <h2 className="mb-8 font-marker text-3xl sm:text-4xl" style={{ color: PENCIL, transform: "rotate(-1deg)" }}>
            {day.planLabel}
          </h2>
          <PlanCards items={subEvents} reduce={reduce} />
        </section>
      )}

      {/* ── Photos, taped in ─────────────────────────────────────── */}
      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-5 py-14 sm:px-6 sm:py-18">
          <h2 className="mb-9 font-marker text-3xl" style={{ color: accent, transform: "rotate(1deg)" }}>
            Stuck in with tape
          </h2>
          {galleryItems.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {galleryItems.map((m, i) => {
                const c = CRAYONS[i % CRAYONS.length];
                return (
                  <motion.figure
                    key={`${m.fileName}-${i}`}
                    initial={reduce ? false : { opacity: 0, y: 20, rotate: 0 }}
                    whileInView={{ opacity: 1, y: 0, rotate: i % 3 === 1 ? 1.8 : -1.6 }}
                    viewport={{ once: true, margin: "-8% 0px" }}
                    transition={{ duration: 0.65, delay: (i % 3) * 0.08, ease: EASE }}
                    className="relative p-3 pb-10"
                    style={{ background: "#fffdf7", boxShadow: "0 18px 36px -28px rgba(58,53,47,0.8)" }}
                  >
                    <Tape className="-top-3 left-1/2 -translate-x-1/2" rotate={-5} color={c} />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={m.publicUrl}
                      alt={m.caption ?? ""}
                      loading="lazy"
                      className="aspect-[4/3] w-full object-cover"
                    />
                    <figcaption className="absolute bottom-2.5 left-0 right-0 px-3 text-center font-hand text-xl" style={{ color: PENCIL }}>
                      {m.caption || "no caption needed"}
                    </figcaption>
                  </motion.figure>
                );
              })}
            </div>
          ) : (
            <div
              className="flex h-44 items-center justify-center border-4 border-dashed font-hand text-2xl"
              style={{ borderColor: `${PENCIL}44`, color: `${PENCIL}99`, background: "#fffdf740" }}
            >
              + tape some photos in
            </div>
          )}
        </section>
      )}

      {/* ── Where (only when there is a where) ─────────────────────── */}
      {showVenue && (
        <section className="relative mx-auto max-w-4xl px-5 py-14 sm:px-6 sm:py-18">
          <Page className="p-5 sm:p-7" rotate={-0.6}>
            <h2 className="font-marker text-2xl" style={{ color: PENCIL }}>
              {event.venueName || "Where"}
            </h2>
            {event.venueAddress && (
              <p className="mt-2 font-hand text-xl" style={{ color: BLUE }}>
                {event.venueAddress}
              </p>
            )}
            <div className="mt-5" style={{ border: `4px solid ${PENCIL}22` }}>
              <MapEmbed
                latitude={event.latitude}
                longitude={event.longitude}
                venueName={event.venueName}
                venueAddress={event.venueAddress}
                mapLink={event.mapLink}
              />
            </div>
          </Page>
        </section>
      )}

      {/* ── Reply ─────────────────────────────────────────────────── */}
      <section className="relative px-5 py-16 text-center sm:py-24">
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative mx-auto max-w-md px-8 py-11"
          style={{ background: "#fffdf7", transform: "rotate(-1.4deg)", boxShadow: "0 20px 40px -30px rgba(58,53,47,0.8)" }}
        >
          <Tape className="-top-3 left-10" rotate={-8} color={RED} />
          <Handprint color={`${YELLOW}cc`} reduce={reduce} size={78} />
          <p className="mt-2 font-marker text-2xl" style={{ color: PENCIL }}>
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
              className="mt-6 inline-block rounded-full px-9 py-3.5 font-marker text-lg text-white transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
              style={{ background: accent, outlineColor: PENCIL }}
            >
              Say something back
            </a>
          )}
          {(event.contactName || event.contactPhone) && (
            <p className="mt-5 font-hand text-xl" style={{ color: `${PENCIL}99` }}>
              {[event.contactName, event.contactPhone].filter(Boolean).join(" · ")}
            </p>
          )}
        </motion.div>
      </section>

      <footer className="relative" style={{ background: KRAFT }}>
        <div aria-hidden className="flex h-3">
          {CRAYONS.map((c, i) => (
            <span key={i} className="flex-1" style={{ background: c, opacity: 0.8 }} />
          ))}
        </div>
        <p className="py-7 text-center font-hand text-2xl" style={{ color: PENCIL }}>
          {day.greeting}, {honoured}
        </p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default HandprintTemplate;
