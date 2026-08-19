"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { HeroMedia } from "@/components/ui/HeroMedia";
import { MapEmbed } from "@/components/ui/MapEmbed";
import { MusicToggle } from "@/components/ui/MusicToggle";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { useEditMode } from "@/components/edit/EditContext";
import type { TemplateComponent, SubEvent } from "@/lib/types";

/* ── Locker · sweet-sixteen scrapbook ─────────────────────────────────────
 * Palette   locker teal #2f8f8a · hot pink #ee4f8b · highlighter #f5e14b
 *           notebook white #f7f7f4 · graphite #2b2b2b
 * Type      Permanent Marker (name, age) / Inter (body) / Caveat (notes)
 * Layout    a deliberately messy collage sitting on a strict grid — every
 *           taped object is rotated 1–4° but column-aligned, so it reads
 *           hand-made instead of broken.
 * Signature taped Polaroids that peel: hover or tap lifts a photo off its
 *           tape and shows the note written underneath.
 * ──────────────────────────────────────────────────────────────────────── */

const EASE = [0.16, 1, 0.3, 1] as const;
const TEAL = "#2f8f8a";
const TEAL_DEEP = "#20655f";
const PINK = "#ee4f8b";
const HIGHLIGHT = "#f5e14b";
const PAPER = "#f7f7f4";
const GRAPHITE = "#2b2b2b";

const METAL =
  `linear-gradient(90deg, ${TEAL_DEEP} 0%, ${TEAL} 18%, ${TEAL} 82%, ${TEAL_DEEP} 100%),` +
  `repeating-linear-gradient(90deg, rgba(0,0,0,0.06) 0px, rgba(0,0,0,0.06) 1px, transparent 1px, transparent 5px)`;

/** Dotted notebook paper — keeps the collage from floating on dead white. */
const DOTTED = `radial-gradient(circle, ${GRAPHITE}14 1px, transparent 1.2px)`;

/** A strip of washi tape. */
function Tape({ className, rotate = 0, color = HIGHLIGHT }: { className?: string; rotate?: number; color?: string }) {
  return (
    <span
      aria-hidden
      className={`absolute h-6 w-20 ${className ?? ""}`}
      style={{
        background: `${color}d9`,
        transform: `rotate(${rotate}deg)`,
        boxShadow: "0 1px 3px rgba(0,0,0,0.18)",
        clipPath: "polygon(0 6%, 100% 0, 100% 94%, 0 100%)",
      }}
    />
  );
}

/** Combination dial on the locker door. */
function Dial({ reduce }: { reduce: boolean }) {
  return (
    <motion.svg
      aria-hidden
      viewBox="0 0 100 100"
      className="h-16 w-16 sm:h-20 sm:w-20"
      animate={reduce ? undefined : { rotate: [0, -32, 14, 0] }}
      transition={{ duration: 3.2, ease: "easeInOut", delay: 0.6 }}
    >
      {/* padlock shackle */}
      <path d="M34 22 V14 a16 16 0 0 1 32 0 V22" fill="none" stroke="#9aa39a" strokeWidth="6" strokeLinecap="round" />
      <circle cx="50" cy="54" r="40" fill="#7f8a86" />
      <circle cx="50" cy="54" r="33" fill="#c9d0cb" />
      <circle cx="50" cy="54" r="27" fill="#e6eae5" />
      {Array.from({ length: 20 }, (_, i) => {
        const a = (i / 20) * Math.PI * 2 - Math.PI / 2;
        // Rounded: raw trig gives server/client float drift and React then
        // reports a hydration mismatch on these attributes.
        const r = (n: number) => Number(n.toFixed(2));
        return (
          <line
            key={i}
            x1={r(50 + Math.cos(a) * 22)}
            y1={r(54 + Math.sin(a) * 22)}
            x2={r(50 + Math.cos(a) * 28)}
            y2={r(54 + Math.sin(a) * 28)}
            stroke="#6f7873"
            strokeWidth={i % 5 === 0 ? 2.6 : 1.1}
          />
        );
      })}
      <circle cx="50" cy="54" r="7" fill="#6f7873" />
      {/* the notch you line the number up with */}
      <path d="M50 12 L56 24 L44 24 Z" fill={PINK} />
    </motion.svg>
  );
}

/** Locker vents. */
function Vents() {
  return (
    <div aria-hidden className="flex flex-col gap-1.5">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="block h-1.5 w-16 rounded-full sm:w-24"
          style={{ background: "rgba(0,0,0,0.28)", boxShadow: "inset 0 1px 1px rgba(255,255,255,0.25)" }}
        />
      ))}
    </div>
  );
}

/** SIGNATURE — a taped photo that peels up to show the note underneath. */
function PeelPhoto({
  url,
  note,
  rotate,
  reduce,
}: {
  url: string;
  note: string;
  rotate: number;
  reduce: boolean;
}) {
  const [lifted, setLifted] = useState(false);
  return (
    <div className="relative pt-4">
      <div
        className="absolute inset-x-3 bottom-3 top-8 flex items-end justify-center p-4 text-center"
        style={{ background: PAPER, border: `1px dashed ${GRAPHITE}44`, transform: `rotate(${rotate * 0.4}deg)` }}
      >
        <p className="font-hand text-lg leading-snug" style={{ color: GRAPHITE }}>
          {note}
        </p>
      </div>
      <motion.button
        type="button"
        aria-expanded={lifted}
        onClick={() => setLifted((v) => !v)}
        whileHover={reduce ? undefined : { y: -26, rotate: rotate - 3 }}
        animate={lifted && !reduce ? { y: -26, rotate: rotate - 3 } : { y: 0, rotate }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="relative block w-full cursor-pointer rounded-sm p-2.5 pb-8 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
        style={{
          background: "#fff",
          boxShadow: "0 10px 24px -14px rgba(0,0,0,0.55)",
          outlineColor: PINK,
          transformOrigin: "50% 100%",
        }}
      >
        <Tape className="-top-3 left-1/2 -translate-x-1/2" rotate={-4} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt={note} loading="lazy" className="aspect-square w-full object-cover" />
        <span className="mt-2 block font-hand text-base" style={{ color: GRAPHITE }}>
          {lifted ? "tap to stick it back" : "tap to peel"}
        </span>
      </motion.button>
    </div>
  );
}

/** Sub-events as ticket stubs. */
function TicketStubs({ items, reduce }: { items: SubEvent[]; reduce: boolean }) {
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {sorted.map((s, i) => (
        <motion.article
          key={`${s.order}-${s.name}`}
          initial={reduce ? false : { opacity: 0, y: 20, rotate: 0 }}
          whileInView={{ opacity: 1, y: 0, rotate: i % 2 ? 1.4 : -1.6 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.6, delay: (i % 4) * 0.07, ease: EASE }}
          className="relative"
        >
          <div
            className="relative overflow-hidden"
            style={{
              background: PAPER,
              boxShadow: "0 12px 26px -18px rgba(0,0,0,0.6)",
              // perforated left edge
              backgroundImage: `radial-gradient(circle at 0 50%, transparent 6px, ${PAPER} 6px)`,
            }}
          >
            <div className="flex">
              <div
                className="flex w-16 shrink-0 flex-col items-center justify-center gap-1 py-6"
                style={{ background: i % 2 ? PINK : TEAL, color: "#fff" }}
              >
                <span className="font-marker text-2xl leading-none">{s.order}</span>
                {s.icon && <span className="text-lg">{s.icon}</span>}
              </div>
              <div
                aria-hidden
                className="w-px"
                style={{
                  background: `repeating-linear-gradient(180deg, ${GRAPHITE}55 0px, ${GRAPHITE}55 4px, transparent 4px, transparent 9px)`,
                }}
              />
              <div className="min-w-0 flex-1 p-5">
                <p className="font-sans text-[10px] uppercase tracking-[0.24em]" style={{ color: `${GRAPHITE}99` }}>
                  {[s.date, [s.startTime, s.endTime].filter(Boolean).join("–")].filter(Boolean).join(" · ")}
                </p>
                <h3 className="mt-1.5 font-marker text-xl leading-tight" style={{ color: GRAPHITE }}>
                  {s.name}
                </h3>
                {s.venueName && (
                  <p className="mt-1 font-hand text-lg" style={{ color: TEAL_DEEP }}>
                    {s.venueName}
                  </p>
                )}
                {s.description && (
                  <p className="mt-2 font-sans text-sm leading-relaxed" style={{ color: `${GRAPHITE}c0` }}>
                    {s.description}
                  </p>
                )}
                {s.dressCode && (
                  <p
                    className="mt-3 inline-block px-2 py-0.5 font-sans text-[10px] uppercase tracking-[0.2em]"
                    style={{ background: HIGHLIGHT, color: GRAPHITE }}
                  >
                    {s.dressCode}
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  );
}

/** A shelf card — small pinned note used for dress code / requests / contact. */
function ShelfCard({
  label,
  value,
  rotate,
  color,
}: {
  label: string;
  value: string;
  rotate: number;
  color: string;
}) {
  return (
    <div
      className="relative px-5 pb-5 pt-7"
      style={{
        background: PAPER,
        transform: `rotate(${rotate}deg)`,
        boxShadow: "0 10px 22px -16px rgba(0,0,0,0.6)",
      }}
    >
      <Tape className="-top-3 left-6" rotate={-6} color={color} />
      <p className="font-sans text-[10px] uppercase tracking-[0.26em]" style={{ color: `${GRAPHITE}99` }}>
        {label}
      </p>
      <p className="mt-2 font-hand text-xl leading-snug" style={{ color: GRAPHITE }}>
        {value}
      </p>
    </div>
  );
}

export const LockerTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || PINK;
  const tagline = event.tagline?.trim() || "the group chat has been planning this for weeks";
  const invitation =
    event.invitationMessage?.trim() ||
    "Okay so — it's happening. Come loud, come late if you must, but come. Bring nothing except yourself and a song request.";
  const story =
    event.aboutStory?.trim() ||
    "Sixteen years of being the one who starts things. This is the party for everyone who joined in.";
  const hero = event.heroImageUrl || "/samples/wedding-cake.jpg";

  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const firstDressCode = subEvents.find((s) => s.dressCode)?.dressCode;

  const showStory = !event.hideStory;
  const showPlan = !event.hideEvents && subEvents.length > 0;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);
  const showVenue = !event.hideVenue;

  const dateLine = event.mainDate
    ? new Date(event.mainDate).toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "long" })
    : "";
  const ageMatch = event.eventTitle.match(/\d{1,3}/);
  const age = ageMatch?.[0] ?? "";

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-sans antialiased"
      style={{ "--accent": accent, background: PAPER, color: GRAPHITE } as React.CSSProperties}
    >
      <ScrollProgress color={accent} />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{ backgroundImage: DOTTED, backgroundSize: "22px 22px" }}
      />

      {/* ── Hero: the locker door itself ───────────────────────────── */}
      <section
        className="relative flex min-h-[100svh] items-center overflow-hidden pb-24 sm:pb-28"
        style={{ background: METAL }}
      >
        {/* Door furniture: hinge column, top light, edge shadow */}
        <div
          aria-hidden
          className="absolute inset-y-0 left-0 w-3 sm:w-5"
          style={{ background: `linear-gradient(90deg, rgba(0,0,0,0.45), transparent)` }}
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, rgba(255,255,255,0.14) 0%, transparent 22%, transparent 70%, rgba(0,0,0,0.28) 100%)`,
          }}
        />
        <div aria-hidden className="absolute left-5 top-7 sm:left-12 sm:top-12">
          <Vents />
        </div>
        {/* Mirror strip taped inside the door */}
        <div
          aria-hidden
          className="absolute right-6 top-16 hidden h-40 w-12 lg:block"
          style={{
            background: "linear-gradient(150deg, rgba(255,255,255,0.55), rgba(255,255,255,0.12) 45%, rgba(255,255,255,0.4))",
            border: "2px solid rgba(255,255,255,0.5)",
            transform: "rotate(1.5deg)",
          }}
        />

        <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-10 px-6 pt-24 sm:pt-16 md:grid-cols-[1.15fr,0.85fr] md:items-center md:gap-14">
          {/* Left: the marker-written identity */}
          <div className="text-center md:text-left">
            <motion.p
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="mx-auto max-w-sm font-hand text-2xl leading-tight md:mx-0"
              style={{ color: HIGHLIGHT }}
            >
              {tagline}
            </motion.p>

            <motion.h1
              initial={reduce ? false : { opacity: 0, scale: 0.94, rotate: -4 }}
              animate={{ opacity: 1, scale: 1, rotate: -2 }}
              transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
              className="mt-6 font-marker text-[clamp(2.6rem,10vw,5.5rem)] leading-[0.95]"
              style={{ color: "#fff", textShadow: `4px 4px 0 ${PINK}` }}
            >
              {event.person1Name || event.eventTitle}
            </motion.h1>

            {age && (
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.6, ease: EASE }}
                className="mt-7 flex items-center justify-center gap-2 md:justify-start"
              >
                {age.split("").map((d, i) => (
                  <span
                    key={i}
                    className="flex h-16 w-14 items-center justify-center rounded-md font-marker text-4xl sm:h-20 sm:w-16 sm:text-5xl"
                    style={{
                      background: i % 2 ? HIGHLIGHT : "#fff",
                      color: GRAPHITE,
                      transform: `rotate(${i % 2 ? 3 : -3}deg)`,
                      boxShadow: "0 8px 18px -10px rgba(0,0,0,0.6)",
                    }}
                  >
                    {d}
                  </span>
                ))}
                <span className="ml-2 font-hand text-2xl" style={{ color: "#fff" }}>
                  and counting
                </span>
              </motion.div>
            )}

            <motion.div
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.85 }}
              className="mt-8 inline-block px-5 py-2"
              style={{ background: "#fff", transform: "rotate(1.5deg)", boxShadow: "0 8px 18px -12px rgba(0,0,0,0.6)" }}
            >
              <p className="font-sans text-[11px] uppercase tracking-[0.28em]" style={{ color: GRAPHITE }}>
                {[dateLine, event.mainStartTime, event.city].filter(Boolean).join(" · ")}
              </p>
            </motion.div>
          </div>

          {/* Right: the hero photo, taped up like everything else on this door */}
          <motion.figure
            initial={reduce ? false : { opacity: 0, y: 24, rotate: 0 }}
            animate={{ opacity: 1, y: 0, rotate: 2.5 }}
            transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
            className="relative mx-auto w-full max-w-[340px] p-3 pb-12"
            style={{ background: "#fff", boxShadow: "0 22px 44px -22px rgba(0,0,0,0.65)" }}
          >
            <Tape className="-top-3 left-1/2 -translate-x-1/2" rotate={-5} />
            <Tape className="-bottom-2 right-4" rotate={7} color={PINK} />
            <div className="relative aspect-[4/5] w-full overflow-hidden">
              <HeroMedia
                imageSrc={hero}
                videoSrc={event.heroVideoUrl || undefined}
                alt={event.eventTitle}
              />
            </div>
            <figcaption className="absolute bottom-3 left-0 right-0 px-4 text-center font-hand text-xl" style={{ color: GRAPHITE }}>
              {event.eventTitle}
            </figcaption>
          </motion.figure>
        </div>

        <div aria-hidden className="absolute bottom-32 right-6 sm:right-14">
          <Dial reduce={reduce} />
        </div>
      </section>

      {/* ── The taped note ─────────────────────────────────────────── */}
      {showStory && (
        <section className="relative mx-auto max-w-3xl px-6 py-14 sm:py-20">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 22, rotate: 0 }}
            whileInView={{ opacity: 1, y: 0, rotate: -1.2 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            className="relative px-7 py-10 sm:px-12"
            style={{
              background: "#fff",
              boxShadow: "0 18px 40px -28px rgba(0,0,0,0.7)",
              backgroundImage: `repeating-linear-gradient(180deg, transparent 0px, transparent 31px, ${TEAL}22 31px, ${TEAL}22 32px)`,
            }}
          >
            <Tape className="-top-3 left-8" rotate={-7} />
            <Tape className="-top-3 right-8" rotate={5} color={PINK} />
            <span aria-hidden className="absolute inset-y-0 left-10 w-px" style={{ background: `${PINK}66` }} />
            <p className="pl-6 font-hand text-[1.7rem] leading-snug sm:text-3xl" style={{ color: GRAPHITE }}>
              {invitation}
            </p>
            <p className="mt-6 pl-6 font-sans text-sm leading-relaxed" style={{ color: `${GRAPHITE}b8` }}>
              {story}
            </p>
            <p className="mt-8 pl-6 font-marker text-lg" style={{ color: PINK }}>
              — {event.person1Name || event.eventTitle}
            </p>
          </motion.div>
        </section>
      )}

      {/* ── The plan: ticket stubs ─────────────────────────────────── */}
      {showPlan && (
        <section className="relative mx-auto max-w-4xl px-6 py-10 sm:py-14">
          <h2 className="mb-8 font-marker text-3xl" style={{ color: TEAL_DEEP, transform: "rotate(-1.5deg)" }}>
            the plan
          </h2>
          <TicketStubs items={subEvents} reduce={reduce} />
        </section>
      )}

      {/* ── The shelf ──────────────────────────────────────────────── */}
      <section className="relative mx-auto max-w-4xl px-6 py-8">
        <div className="grid gap-6 sm:grid-cols-3">
          <ShelfCard label="Dress code" value={firstDressCode || "whatever makes you dance"} rotate={-1.6} color={HIGHLIGHT} />
          <ShelfCard
            label="Song requests"
            value={event.socialLink ? "drop it on the shared playlist" : "text one to the number below"}
            rotate={1.4}
            color={TEAL}
          />
          <ShelfCard
            label="Ask for"
            value={[event.contactName, event.contactPhone].filter(Boolean).join(" · ") || "anyone at the door"}
            rotate={-1}
            color={PINK}
          />
        </div>
      </section>

      {/* ── Peel-photo wall ───────────────────────────────────────── */}
      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-12 sm:py-16">
          <h2 className="mb-10 font-marker text-3xl" style={{ color: PINK, transform: "rotate(1.5deg)" }}>
            the wall
          </h2>
          {galleryItems.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {galleryItems.map((m, i) => (
                <PeelPhoto
                  key={`${m.fileName}-${i}`}
                  url={m.publicUrl}
                  note={m.caption || "no context, just chaos"}
                  rotate={i % 3 === 0 ? -2.5 : i % 3 === 1 ? 2 : -1}
                  reduce={reduce}
                />
              ))}
            </div>
          ) : (
            <div
              className="flex h-44 items-center justify-center border-2 border-dashed font-hand text-xl"
              style={{ borderColor: `${TEAL}88`, color: `${GRAPHITE}99` }}
            >
              + tape some photos up here
            </div>
          )}
        </section>
      )}

      {/* ── Getting there ─────────────────────────────────────────── */}
      {showVenue && (
        <section className="relative mx-auto max-w-4xl px-6 py-12 sm:py-16">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-marker text-3xl" style={{ color: TEAL_DEEP }}>
                {event.venueName || "the spot"}
              </h2>
              {event.venueAddress && (
                <p className="mt-2 font-sans text-sm" style={{ color: `${GRAPHITE}b0` }}>
                  {event.venueAddress}
                </p>
              )}
            </div>
            <svg aria-hidden viewBox="0 0 120 40" className="h-10 w-28">
              <path
                d="M4 30 C 40 8, 70 8, 108 22"
                fill="none"
                stroke={PINK}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path d="M108 22 L96 16 M108 22 L98 29" fill="none" stroke={PINK} strokeWidth="2.5" strokeLinecap="round" />
              <text x="10" y="14" fill={GRAPHITE} className="font-hand" fontSize="13">
                here
              </text>
            </svg>
          </div>
          <div
            className="p-2"
            style={{ background: "#fff", boxShadow: "0 16px 34px -26px rgba(0,0,0,0.7)", transform: "rotate(-0.6deg)" }}
          >
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

      {/* ── RSVP: the note passed in class ────────────────────────── */}
      <section className="relative px-6 py-16 text-center sm:py-20">
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mx-auto max-w-md px-8 py-10"
          style={{
            background: HIGHLIGHT,
            transform: "rotate(-1.8deg)",
            boxShadow: "0 18px 40px -28px rgba(0,0,0,0.7)",
          }}
        >
          <p className="font-hand text-3xl leading-tight" style={{ color: GRAPHITE }}>
            are you in?
          </p>
          <p className="mt-3 font-sans text-sm" style={{ color: `${GRAPHITE}c0` }}>
            circle yes and send it back.
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
              className="mt-7 inline-block rounded-full px-9 py-3.5 font-marker text-lg text-white transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
              style={{ background: accent, outlineColor: GRAPHITE }}
            >
              YES obviously
            </a>
          )}
        </motion.div>
      </section>

      {/* ── Locker shuts ─────────────────────────────────────────── */}
      <footer className="relative" style={{ background: METAL }}>
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-8">
          <p className="font-marker text-lg" style={{ color: "#fff" }}>
            {event.eventTitle}
          </p>
          <p className="font-hand text-xl" style={{ color: HIGHLIGHT }}>
            see you there
          </p>
        </div>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default LockerTemplate;
