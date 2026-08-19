"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { HeroMedia } from "@/components/ui/HeroMedia";
import { MapEmbed } from "@/components/ui/MapEmbed";
import { MusicToggle } from "@/components/ui/MusicToggle";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { useEditMode } from "@/components/edit/EditContext";
import type { TemplateComponent, SubEvent } from "@/lib/types";

/* ── Pop-Up · first-year storybook ────────────────────────────────────────
 * Palette   paper cream #fbf7ee · soft sky #a8cbe0 · leaf #8bbf7a
 *           peach #f3b8a0 · ink brown #4b3a2f
 * Type      Cormorant (name, spread titles) / Inter (body) / Caveat (labels)
 * Layout    paired spreads — every section is a left/right page with a real
 *           gutter shadow and a soft page edge.
 * Signature pop-ups that stand up: layered paper rotates up on its hinge as
 *           each spread enters view. Nothing flashes; nothing plays sound.
 * ──────────────────────────────────────────────────────────────────────── */

const EASE = [0.16, 1, 0.3, 1] as const;
const PAPER = "#fbf7ee";
const SKY = "#a8cbe0";
const LEAF = "#8bbf7a";
const PEACH = "#f3b8a0";
const INK = "#4b3a2f";

/** SIGNATURE — paper that rotates up along a hinge as the spread arrives. */
function PopUp({
  children,
  delay = 0,
  reduce,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  reduce: boolean;
  className?: string;
}) {
  return (
    <div className={className} style={{ perspective: 900 }}>
      <motion.div
        initial={reduce ? false : { rotateX: 82, y: 14, opacity: 0.4 }}
        whileInView={{ rotateX: 0, y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-12% 0px" }}
        transition={{ duration: 0.9, delay, ease: EASE }}
        style={{ transformOrigin: "50% 100%", transformStyle: "preserve-3d" }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/** A cut-paper hill / cloud / sun set, used as scenery on a spread. */
function Scenery({ reduce }: { reduce: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40 overflow-hidden">
      <PopUp reduce={reduce} className="absolute bottom-0 left-[-6%] w-2/3">
        <div className="h-28 rounded-t-[100%]" style={{ background: LEAF, opacity: 0.85 }} />
      </PopUp>
      <PopUp reduce={reduce} delay={0.12} className="absolute bottom-0 right-[-8%] w-3/5">
        <div className="h-20 rounded-t-[100%]" style={{ background: `${LEAF}bb` }} />
      </PopUp>
      <PopUp reduce={reduce} delay={0.2} className="absolute bottom-6 left-[46%] w-16">
        <div className="h-16 w-16 rounded-full" style={{ background: PEACH }} />
      </PopUp>
    </div>
  );
}

/** A book spread: two pages with a gutter between them. */
function Spread({
  children,
  className,
  label,
}: {
  children: React.ReactNode;
  className?: string;
  label?: string;
}) {
  return (
    <div
      className={`relative mx-auto max-w-5xl overflow-hidden rounded-[18px] ${className ?? ""}`}
      style={{
        background: PAPER,
        boxShadow: `0 26px 50px -34px rgba(75,58,47,0.55), inset 0 0 0 1px rgba(75,58,47,0.08)`,
      }}
    >
      {/* the gutter */}
      <span
        aria-hidden
        className="absolute inset-y-0 left-1/2 hidden w-8 -translate-x-1/2 md:block"
        style={{ background: "linear-gradient(90deg, rgba(75,58,47,0.14), transparent 45%, rgba(75,58,47,0.14))" }}
      />
      {label && (
        <p
          className="absolute right-5 top-4 font-hand text-lg"
          style={{ color: `${INK}88` }}
        >
          {label}
        </p>
      )}
      {children}
    </div>
  );
}

/** The party plan as paper strips. */
function PlanStrips({ items, accent, reduce }: { items: SubEvent[]; accent: string; reduce: boolean }) {
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <ol className="grid gap-5">
      {sorted.map((s, i) => (
        <PopUp key={`${s.order}-${s.name}`} reduce={reduce} delay={(i % 4) * 0.08}>
          <li
            className="flex items-center gap-4 rounded-2xl p-5"
            style={{
              background: i % 2 ? `${SKY}33` : `${PEACH}33`,
              border: `2px solid ${i % 2 ? SKY : PEACH}`,
            }}
          >
            <span
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl"
              style={{ background: PAPER, border: `2px solid ${INK}22` }}
            >
              {s.icon || "🎈"}
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="font-serif text-2xl leading-tight" style={{ color: INK }}>
                {s.name}
              </h3>
              <p className="mt-1 font-hand text-xl" style={{ color: accent }}>
                {[s.startTime, s.endTime].filter(Boolean).join(" – ") || s.date}
                {s.venueName ? ` · ${s.venueName}` : ""}
              </p>
              {s.description && (
                <p className="mt-2 font-sans text-base leading-relaxed" style={{ color: `${INK}c4` }}>
                  {s.description}
                </p>
              )}
            </div>
          </li>
        </PopUp>
      ))}
    </ol>
  );
}

export const PopupbookTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || PEACH;
  const tagline = event.tagline?.trim() || "One whole year of you";
  const invitation =
    event.invitationMessage?.trim() ||
    "It has been a year of firsts, and we would like to spend the next few hours of it with the people who made it soft. Come for cake, stay for the nap.";
  const story =
    event.aboutStory?.trim() ||
    "Twelve months, four teeth, one small person with very firm opinions about dogs. This is the short version, in paper.";
  const hero = event.heroImageUrl || "/samples/wedding-cake.jpg";

  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const months = galleryItems.slice(0, 12);

  const showStory = !event.hideStory;
  const showPlan = !event.hideEvents && subEvents.length > 0;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);
  const showVenue = !event.hideVenue;

  const ageMatch = event.eventTitle.match(/\d{1,2}/);
  const age = ageMatch?.[0] ?? "1";
  const dateLine = event.mainDate
    ? new Date(event.mainDate).toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" })
    : "";

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-sans antialiased"
      style={{ "--accent": accent, background: `${SKY}2e`, color: INK } as React.CSSProperties}
    >
      <ScrollProgress color={accent} />

      {/* ── The cover ──────────────────────────────────────────────── */}
      <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden pb-24 sm:pb-28">
        <div className="absolute inset-0">
          <HeroMedia
            imageSrc={hero}
            videoSrc={event.heroVideoUrl || undefined}
            alt={event.eventTitle}
            className="opacity-30"
          />
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(180deg, ${PAPER}e8 0%, ${SKY}55 55%, ${PAPER}f2 100%)` }}
          />
        </div>
        <Scenery reduce={reduce} />

        <div className="relative z-10 px-6 text-center">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="font-hand text-2xl"
            style={{ color: `${INK}aa` }}
          >
            {tagline}
          </motion.p>

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
            className="mt-5 font-serif text-[clamp(2.8rem,11vw,6rem)] leading-[1.02]"
            style={{ color: INK }}
          >
            {event.person1Name || event.eventTitle}
          </motion.h1>

          {/* the pop-up number standing off the page */}
          <PopUp reduce={reduce} delay={0.5} className="mt-8">
            <div
              className="mx-auto flex h-32 w-28 items-center justify-center rounded-3xl font-serif text-6xl sm:h-40 sm:w-36 sm:text-7xl"
              style={{
                background: PAPER,
                color: accent,
                border: `4px solid ${accent}`,
                boxShadow: `0 20px 30px -18px rgba(75,58,47,0.5)`,
              }}
            >
              {age}
            </div>
          </PopUp>

          {dateLine && (
            <p className="mt-8 font-sans text-sm uppercase tracking-[0.28em]" style={{ color: `${INK}b0` }}>
              {dateLine}
              {event.city ? ` · ${event.city}` : ""}
            </p>
          )}
        </div>
      </section>

      {/* ── Spread one: the year ───────────────────────────────────── */}
      {showStory && (
        <section className="relative px-4 py-16 sm:px-6 sm:py-24">
          <Spread label="page one">
            <div className="grid gap-8 p-8 md:grid-cols-2 md:p-12">
              <div>
                <h2 className="font-serif text-3xl leading-snug" style={{ color: INK }}>
                  {invitation}
                </h2>
              </div>
              <div className="md:pl-6">
                <p className="font-sans text-base leading-loose" style={{ color: `${INK}c4` }}>
                  {story}
                </p>
                <PopUp reduce={reduce} delay={0.2} className="mt-7">
                  <div
                    className="rounded-2xl p-5 text-center"
                    style={{ background: `${LEAF}2e`, border: `2px solid ${LEAF}` }}
                  >
                    <p className="font-hand text-2xl" style={{ color: INK }}>
                      bring nothing but yourselves
                    </p>
                  </div>
                </PopUp>
              </div>
            </div>
          </Spread>
        </section>
      )}

      {/* ── Spread two: month by month ─────────────────────────────── */}
      {showGallery && (
        <section className="relative px-4 py-12 sm:px-6 sm:py-16">
          <Spread label="the year, in twelve">
            <div className="p-8 md:p-12">
              <h2 className="mb-8 font-serif text-3xl" style={{ color: INK }}>
                Month by month
              </h2>
              {months.length > 0 ? (
                <ol className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
                  {months.map((m, i) => (
                    <PopUp key={`${m.fileName}-${i}`} reduce={reduce} delay={(i % 4) * 0.06}>
                      <li>
                        <figure
                          className="rounded-2xl p-2"
                          style={{ background: PAPER, border: `3px solid ${i % 2 ? SKY : PEACH}` }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={m.publicUrl}
                            alt={m.caption ?? ""}
                            loading="lazy"
                            className="aspect-square w-full rounded-xl object-cover"
                          />
                          <figcaption className="pt-2 text-center font-hand text-lg" style={{ color: INK }}>
                            {m.caption || `month ${i + 1}`}
                          </figcaption>
                        </figure>
                      </li>
                    </PopUp>
                  ))}
                </ol>
              ) : (
                <div
                  className="flex h-44 items-center justify-center rounded-2xl border-2 border-dashed font-hand text-2xl"
                  style={{ borderColor: `${INK}33`, color: `${INK}88` }}
                >
                  + add a photo for each month
                </div>
              )}
            </div>
          </Spread>
        </section>
      )}

      {/* ── Spread three: the party ───────────────────────────────── */}
      {showPlan && (
        <section className="relative px-4 py-12 sm:px-6 sm:py-16">
          <Spread label="the party">
            <div className="p-8 md:p-12">
              <h2 className="mb-8 font-serif text-3xl" style={{ color: INK }}>
                How the day goes
              </h2>
              <PlanStrips items={subEvents} accent={accent} reduce={reduce} />
            </div>
          </Spread>
        </section>
      )}

      {/* ── Spread four: where ────────────────────────────────────── */}
      {showVenue && (
        <section className="relative px-4 py-12 sm:px-6 sm:py-16">
          <Spread label="where">
            <div className="p-8 md:p-12">
              <h2 className="font-serif text-3xl" style={{ color: INK }}>
                {event.venueName || "The place"}
              </h2>
              {event.venueAddress && (
                <p className="mt-2 font-sans text-base" style={{ color: `${INK}b8` }}>
                  {event.venueAddress}
                </p>
              )}
              <div
                className="mt-6 overflow-hidden rounded-2xl"
                style={{ border: `3px solid ${SKY}` }}
              >
                <MapEmbed
                  latitude={event.latitude}
                  longitude={event.longitude}
                  venueName={event.venueName}
                  venueAddress={event.venueAddress}
                  mapLink={event.mapLink}
                />
              </div>
            </div>
          </Spread>
        </section>
      )}

      {/* ── The reply card ───────────────────────────────────────── */}
      <section className="relative px-6 py-16 text-center sm:py-24">
        <PopUp reduce={reduce}>
          <div
            className="mx-auto max-w-md rounded-3xl px-8 py-12"
            style={{ background: PAPER, border: `4px solid ${accent}`, boxShadow: "0 22px 44px -30px rgba(75,58,47,0.6)" }}
          >
            <p className="font-hand text-3xl" style={{ color: INK }}>
              will you come?
            </p>
            <p className="mt-3 font-sans text-base" style={{ color: `${INK}b8` }}>
              Let us know so there's enough cake.
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
                className="mt-8 inline-block rounded-full px-10 py-4 font-serif text-xl text-white transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
                style={{ background: accent, outlineColor: INK }}
              >
                Yes, we'll be there
              </a>
            )}
            {(event.contactName || event.contactPhone) && (
              <p className="mt-6 font-hand text-xl" style={{ color: `${INK}99` }}>
                {[event.contactName, event.contactPhone].filter(Boolean).join(" · ")}
              </p>
            )}
          </div>
        </PopUp>
      </section>

      {/* ── The back cover ──────────────────────────────────────── */}
      <footer className="relative" style={{ background: `${LEAF}33` }}>
        <p className="py-8 text-center font-serif text-xl" style={{ color: INK }}>
          {event.eventTitle}
        </p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default PopupbookTemplate;
