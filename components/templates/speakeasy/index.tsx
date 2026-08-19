"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { HeroMedia } from "@/components/ui/HeroMedia";
import { MapEmbed } from "@/components/ui/MapEmbed";
import { MusicToggle } from "@/components/ui/MusicToggle";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { useEditMode } from "@/components/edit/EditContext";
import type { TemplateComponent, SubEvent } from "@/lib/types";

/* ── Speakeasy · prohibition ──────────────────────────────────────────────
 * Palette   velvet oxblood #4a1220 · brass #c39a4d · cigar black #14100e
 *           absinthe #6f8f5e · ivory #ede3d0
 * Type      Poiret One (deco display) / Cormorant (menu copy) /
 *           tracked caps (times, prices)
 * Layout    symmetrical deco panels with stepped corners, stacked like the
 *           pages of a cocktail menu.
 * Signature the entry: the peephole slides open on the hero and the page
 *           performs one descent into the room. It happens exactly once.
 * ──────────────────────────────────────────────────────────────────────── */

const EASE = [0.16, 1, 0.3, 1] as const;
const OXBLOOD = "#4a1220";
const BRASS = "#c39a4d";
const CIGAR = "#14100e";
const ABSINTHE = "#6f8f5e";
const IVORY = "#ede3d0";

/** Stepped deco corners + brass hairline, the frame every panel uses. */
function DecoPanel({
  children,
  className,
  tone = "rgba(20,16,14,0.72)",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: string;
}) {
  return (
    <div
      className={`relative px-7 py-9 sm:px-10 ${className ?? ""}`}
      style={{
        background: tone,
        border: `1px solid ${BRASS}55`,
        boxShadow: `inset 0 0 0 4px rgba(0,0,0,0.35), inset 0 0 0 5px ${BRASS}33`,
        clipPath:
          "polygon(18px 0, calc(100% - 18px) 0, 100% 18px, 100% calc(100% - 18px), calc(100% - 18px) 100%, 18px 100%, 0 calc(100% - 18px), 0 18px)",
      }}
    >
      {children}
    </div>
  );
}

/** Deco sunburst — used at section heads and in the footer. */
function Sunburst({ size = 90, reduce }: { size?: number; reduce: boolean }) {
  return (
    <motion.svg
      aria-hidden
      viewBox="0 0 100 60"
      width={size}
      height={size * 0.6}
      initial={reduce ? false : { opacity: 0, scaleY: 0.4 }}
      whileInView={{ opacity: 1, scaleY: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, ease: EASE }}
      style={{ transformOrigin: "50% 100%" }}
    >
      {Array.from({ length: 13 }, (_, i) => {
        const a = Math.PI - (i / 12) * Math.PI;
        const r = (n: number) => Number(n.toFixed(2));
        return (
          <line
            key={i}
            x1="50"
            y1="58"
            x2={r(50 + Math.cos(a) * 48)}
            y2={r(58 - Math.sin(a) * 52)}
            stroke={BRASS}
            strokeWidth={i % 2 ? 1 : 2}
            opacity={i % 2 ? 0.5 : 0.85}
          />
        );
      })}
      <circle cx="50" cy="58" r="4" fill={BRASS} />
    </motion.svg>
  );
}

/** Chevron rule between panels. */
function Chevrons() {
  return (
    <div
      aria-hidden
      className="h-3 w-full"
      style={{
        background: `repeating-linear-gradient(135deg, ${BRASS}66 0 6px, transparent 6px 14px)`,
        opacity: 0.6,
      }}
    />
  );
}

/** Sub-events set as the night's running order. */
function RunningOrder({ items, accent, reduce }: { items: SubEvent[]; accent: string; reduce: boolean }) {
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <ol>
      {sorted.map((s, i) => (
        <motion.li
          key={`${s.order}-${s.name}`}
          initial={reduce ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.6, delay: (i % 5) * 0.06, ease: EASE }}
          className="flex flex-col gap-2 border-t py-6 sm:flex-row sm:items-baseline sm:gap-8"
          style={{ borderColor: `${BRASS}33` }}
        >
          <p className="w-28 shrink-0 font-sans text-[11px] uppercase tracking-[0.3em]" style={{ color: BRASS }}>
            {[s.startTime, s.endTime].filter(Boolean).join("–") || s.date}
          </p>
          <div className="min-w-0 flex-1">
            <h3 className="font-deco text-2xl tracking-[0.06em]" style={{ color: IVORY }}>
              {s.icon ? `${s.icon} ` : ""}
              {s.name}
            </h3>
            {s.description && (
              <p className="mt-1.5 font-serif text-base leading-relaxed" style={{ color: `${IVORY}bb` }}>
                {s.description}
              </p>
            )}
          </div>
          <div className="shrink-0 text-left sm:w-44 sm:text-right">
            {s.venueName && (
              <p className="font-serif text-base italic" style={{ color: accent }}>
                {s.venueName}
              </p>
            )}
            {s.dressCode && (
              <p className="mt-1 font-sans text-[10px] uppercase tracking-[0.22em]" style={{ color: `${IVORY}88` }}>
                {s.dressCode}
              </p>
            )}
          </div>
        </motion.li>
      ))}
    </ol>
  );
}

export const SpeakeasyTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || BRASS;
  const tagline = event.tagline?.trim() || "No sign on the door";
  const invitation =
    event.invitationMessage?.trim() ||
    "There is a door with nothing written on it. Knock, say the name, and come down the stairs — the quartet starts at ten.";
  const story =
    event.aboutStory?.trim() ||
    "One night, one basement, one very good bartender. Dress like the decade and leave your phone in your pocket.";
  const hero = event.heroImageUrl || "/samples/chandelier.jpg";

  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const firstDress = subEvents.find((s) => s.dressCode)?.dressCode;

  const showStory = !event.hideStory;
  const showBill = !event.hideEvents && subEvents.length > 0;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);
  const showVenue = !event.hideVenue;

  const ageMatch = event.eventTitle.match(/\d{1,3}/);
  const age = ageMatch?.[0] ?? "";
  const dateLine = event.mainDate
    ? new Date(event.mainDate).toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : "";

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-sans antialiased"
      style={{ "--accent": accent, background: CIGAR, color: IVORY } as React.CSSProperties}
    >
      <ScrollProgress color={accent} />

      {/* ── Hero: the unmarked door, then the room ─────────────────── */}
      <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden pb-24 sm:pb-28">
        <div className="absolute inset-0">
          <HeroMedia
            imageSrc={hero}
            videoSrc={event.heroVideoUrl || undefined}
            alt={event.eventTitle}
            className="opacity-45"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse at 50% 35%, ${OXBLOOD}66 0%, ${CIGAR}e6 62%, ${CIGAR} 100%)`,
            }}
          />
        </div>

        {/* velvet drapes down the sides */}
        {[0, 1].map((side) => (
          <div
            key={side}
            aria-hidden
            className={`absolute inset-y-0 w-16 sm:w-28 ${side ? "right-0" : "left-0"}`}
            style={{
              background: `repeating-linear-gradient(90deg, ${OXBLOOD} 0 10px, #350d17 10px 20px)`,
              opacity: 0.85,
              boxShadow: side ? `inset 18px 0 30px -18px #000` : `inset -18px 0 30px -18px #000`,
            }}
          />
        ))}

        <div className="relative z-10 px-8 text-center">
          {/* SIGNATURE — the peephole slides open, once. */}
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="mx-auto mb-9 flex h-24 w-36 items-center justify-center overflow-hidden rounded-sm sm:h-28 sm:w-44"
            style={{ background: "#1d1713", border: `2px solid ${BRASS}88`, boxShadow: `0 0 40px -10px ${BRASS}55` }}
          >
            {/* brass grille behind the shutter — what you actually peer through */}
            <span
              aria-hidden
              className="absolute inset-0"
              style={{
                background: `repeating-linear-gradient(90deg, transparent 0 12px, ${BRASS}55 12px 15px)`,
              }}
            />
            <motion.div
              aria-hidden
              className="absolute inset-0"
              style={{ background: `linear-gradient(90deg, #241c17, #120e0c)` }}
              initial={reduce ? false : { x: 0 }}
              animate={{ x: "102%" }}
              transition={{ duration: 1.4, delay: 0.8, ease: EASE }}
            />
            <span
              className="absolute font-sans text-[10px] uppercase tracking-[0.4em]"
              style={{ color: BRASS }}
            >
              {tagline}
            </span>
          </motion.div>

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5, ease: EASE }}
            className="font-deco text-[clamp(2.6rem,10vw,6.4rem)] leading-[1] tracking-[0.08em]"
            style={{ color: IVORY }}
          >
            {event.person1Name || event.eventTitle}
          </motion.h1>

          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2 }}
            className="mt-7"
          >
            {age && (
              <p className="font-deco text-3xl tracking-[0.3em]" style={{ color: BRASS }}>
                {age}
              </p>
            )}
            {dateLine && (
              <p className="mt-5 font-sans text-[11px] uppercase tracking-[0.34em]" style={{ color: `${IVORY}cc` }}>
                {dateLine}
                {event.mainStartTime ? ` · ${event.mainStartTime}` : ""}
                {event.city ? ` · ${event.city}` : ""}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      <Chevrons />

      {/* ── The room ──────────────────────────────────────────────── */}
      {showStory && (
        <section className="relative px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <Sunburst reduce={reduce} />
            <DecoPanel className="mt-6" tone={`${OXBLOOD}bb`}>
              <p className="font-sans text-[10px] uppercase tracking-[0.4em]" style={{ color: BRASS }}>
                You're in
              </p>
              <motion.h2
                initial={reduce ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: EASE }}
                className="mt-5 font-deco text-2xl leading-snug tracking-[0.04em] sm:text-3xl"
                style={{ color: IVORY }}
              >
                {invitation}
              </motion.h2>
              <div aria-hidden className="mx-auto my-7 h-px w-24" style={{ background: `${BRASS}88` }} />
              <p className="font-serif text-lg leading-loose" style={{ color: `${IVORY}c4` }}>
                {story}
              </p>
            </DecoPanel>
          </div>
        </section>
      )}

      {/* ── The bill ──────────────────────────────────────────────── */}
      {showBill && (
        <section className="relative mx-auto max-w-4xl px-6 py-16 sm:py-20">
          <DecoPanel>
            <header className="mb-2 text-center">
              <p className="font-sans text-[10px] uppercase tracking-[0.4em]" style={{ color: BRASS }}>
                Tonight's bill
              </p>
              <h2 className="mt-3 font-deco text-3xl tracking-[0.08em]" style={{ color: IVORY }}>
                Running order
              </h2>
            </header>
            <RunningOrder items={subEvents} accent={accent} reduce={reduce} />
          </DecoPanel>
        </section>
      )}

      {/* ── The house rules (menu card) ───────────────────────────── */}
      <section className="relative mx-auto max-w-4xl px-6 py-12">
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            ["Dress", firstDress || "1920s, or your best attempt"],
            ["House pour", "Something brown, something cold"],
            ["The password", event.person1Name || event.eventTitle],
          ].map(([k, v]) => (
            <DecoPanel key={k} className="text-center" tone="rgba(20,16,14,0.6)">
              <p className="font-sans text-[10px] uppercase tracking-[0.32em]" style={{ color: BRASS }}>
                {k}
              </p>
              <p className="mt-3 font-serif text-lg italic" style={{ color: IVORY }}>
                {v}
              </p>
            </DecoPanel>
          ))}
        </div>
      </section>

      {/* ── Brass frames ─────────────────────────────────────────── */}
      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <h2 className="mb-9 text-center font-deco text-3xl tracking-[0.08em]" style={{ color: IVORY }}>
            On the walls
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
                      background: "#191410",
                      border: `4px solid ${BRASS}`,
                      boxShadow: `0 20px 40px -28px #000, inset 0 0 0 1px #000`,
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
                    <figcaption className="mt-3 text-center font-sans text-[10px] uppercase tracking-[0.26em]" style={{ color: BRASS }}>
                      {m.caption}
                    </figcaption>
                  )}
                </motion.figure>
              ))}
            </div>
          ) : (
            <div
              className="flex h-44 items-center justify-center border border-dashed font-sans text-xs uppercase tracking-[0.28em]"
              style={{ borderColor: `${BRASS}55`, color: `${IVORY}88` }}
            >
              + hang some portraits
            </div>
          )}
        </section>
      )}

      {/* ── The address ─────────────────────────────────────────── */}
      {showVenue && (
        <section className="relative mx-auto max-w-4xl px-6 py-16 sm:py-20">
          <DecoPanel>
            <div className="text-center">
              <p className="font-sans text-[10px] uppercase tracking-[0.38em]" style={{ color: BRASS }}>
                Tell them who sent you
              </p>
              <h2 className="mt-3 font-deco text-3xl tracking-[0.06em]" style={{ color: IVORY }}>
                {event.venueName || "The address"}
              </h2>
              {event.venueAddress && (
                <p className="mt-2 font-serif text-base italic" style={{ color: `${IVORY}bb` }}>
                  {event.venueAddress}
                </p>
              )}
            </div>
            <div className="mt-7" style={{ border: `2px solid ${BRASS}66` }}>
              <MapEmbed
                latitude={event.latitude}
                longitude={event.longitude}
                venueName={event.venueName}
                venueAddress={event.venueAddress}
                mapLink={event.mapLink}
              />
            </div>
          </DecoPanel>
        </section>
      )}

      {/* ── The guest list ─────────────────────────────────────── */}
      <section className="relative px-6 py-20 text-center sm:py-28">
        <div className="mx-auto max-w-xl">
          <Sunburst reduce={reduce} size={110} />
          <DecoPanel className="mt-6" tone={`${OXBLOOD}cc`}>
            <p className="font-sans text-[10px] uppercase tracking-[0.4em]" style={{ color: BRASS }}>
              The guest list
            </p>
            <h2 className="mt-4 font-deco text-3xl tracking-[0.06em]" style={{ color: IVORY }}>
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
                className="mt-8 inline-block px-10 py-3.5 font-sans text-[11px] uppercase tracking-[0.32em] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
                style={{ background: BRASS, color: CIGAR, outlineColor: IVORY }}
              >
                Put me down
              </a>
            )}
            {(event.contactName || event.contactPhone) && (
              <p className="mt-6 font-serif text-base italic" style={{ color: `${IVORY}99` }}>
                {[event.contactName, event.contactPhone].filter(Boolean).join(" · ")}
              </p>
            )}
          </DecoPanel>
        </div>
      </section>

      <footer className="relative">
        <Chevrons />
        <p className="py-7 text-center font-deco text-lg tracking-[0.3em]" style={{ color: `${BRASS}cc` }}>
          {event.eventTitle}
        </p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default SpeakeasyTemplate;
