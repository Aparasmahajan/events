"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { HeroMedia } from "@/components/ui/HeroMedia";
import { MapEmbed } from "@/components/ui/MapEmbed";
import { MusicToggle } from "@/components/ui/MusicToggle";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { useEditMode } from "@/components/edit/EditContext";
import type { TemplateComponent, SubEvent } from "@/lib/types";

/* ── Tour · the birthday as a one-night tour ───────────────────────────────
 * Palette   poster black #141414 · newsprint #efe9dd · hot ink #ff3b30
 *           electric #2b5fd9 · gold #d9a521
 * Type      Bebas Neue (poster type) / Inter (body) / mono (dates, times)
 * Layout    a fly-poster wall — big stacked type, hard rules, everything
 *           printed on newsprint and pasted slightly crooked.
 * Signature the laminate: an access-all-areas pass on a lanyard that swings
 *           once as it arrives, then hangs; the setlist counts the night off.
 * ──────────────────────────────────────────────────────────────────────── */

const EASE = [0.16, 1, 0.3, 1] as const;
const POSTER = "#141414";
const NEWS = "#efe9dd";
const HOT = "#ff3b30";
const ELECTRIC = "#2b5fd9";
const GOLD = "#d9a521";

/** Torn-paper edge for pasted posters. */
const TORN =
  "polygon(0 2%, 4% 0, 12% 2%, 24% 0, 38% 2%, 52% 0, 68% 2%, 82% 0, 94% 2%, 100% 1%, 100% 98%, 92% 100%, 78% 98%, 62% 100%, 46% 98%, 30% 100%, 16% 98%, 6% 100%, 0 99%)";

/** SIGNATURE — the access pass, swinging once on its lanyard. */
function Laminate({ name, age, reduce }: { name: string; age: string; reduce: boolean }) {
  return (
    <div className="mx-auto w-40 origin-top sm:w-48" style={{ perspective: 700 }}>
      {/* lanyard */}
      <svg aria-hidden viewBox="0 0 100 60" className="mx-auto h-12 w-24">
        <path d="M14 0 L48 52 L52 52 L86 0" fill="none" stroke={NEWS} strokeWidth="7" opacity="0.85" />
        <circle cx="50" cy="55" r="4" fill="#b9bec4" />
      </svg>
      <motion.div
        initial={reduce ? false : { rotate: -9, opacity: 0 }}
        animate={{ rotate: [-9, 6, -3, 0], opacity: 1 }}
        transition={{ duration: 2.2, delay: 0.5, ease: "easeOut" }}
        className="-mt-1 px-3 py-4 text-center"
        style={{ transformOrigin: "50% 0%", background: NEWS, border: `2px solid ${POSTER}` }}
      >
        <p className="font-mono text-[9px] uppercase tracking-[0.24em]" style={{ color: HOT }}>
          access all areas
        </p>
        <p className="mt-1.5 font-condensed text-2xl leading-none tracking-[0.08em]" style={{ color: POSTER }}>
          {name.toUpperCase()}
        </p>
        {age && (
          <p className="mt-1 font-condensed text-4xl leading-none" style={{ color: ELECTRIC }}>
            {age}
          </p>
        )}
        <div aria-hidden className="mt-2 flex justify-center gap-[2px]">
          {Array.from({ length: 18 }, (_, i) => (
            <span key={i} className="h-4" style={{ width: i % 3 ? 1 : 2, background: POSTER }} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/** Sub-events as the setlist. */
function Setlist({ items, reduce }: { items: SubEvent[]; reduce: boolean }) {
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <ol>
      {sorted.map((s, i) => (
        <motion.li
          key={`${s.order}-${s.name}`}
          initial={reduce ? false : { opacity: 0, x: -18 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.55, delay: (i % 6) * 0.05, ease: EASE }}
          className="group flex flex-col gap-1 border-b py-5 sm:flex-row sm:items-baseline sm:gap-6"
          style={{ borderColor: `${NEWS}26` }}
        >
          <span className="w-10 shrink-0 font-mono text-sm" style={{ color: GOLD }}>
            {String(s.order).padStart(2, "0")}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-condensed text-[clamp(1.5rem,4vw,2.4rem)] leading-none tracking-[0.04em]" style={{ color: NEWS }}>
              {s.name.toUpperCase()}
            </span>
            {s.description && (
              <span className="mt-1.5 block font-sans text-sm" style={{ color: `${NEWS}99` }}>
                {s.description}
              </span>
            )}
          </span>
          <span className="shrink-0 text-left sm:w-48 sm:text-right">
            <span className="block font-mono text-sm" style={{ color: HOT }}>
              {[s.startTime, s.endTime].filter(Boolean).join("–") || s.date}
            </span>
            {(s.venueName || s.dressCode) && (
              <span className="block font-sans text-[11px] uppercase tracking-[0.18em]" style={{ color: `${NEWS}88` }}>
                {[s.venueName, s.dressCode].filter(Boolean).join(" · ")}
              </span>
            )}
          </span>
        </motion.li>
      ))}
    </ol>
  );
}

export const TourTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || HOT;
  const tagline = event.tagline?.trim() || "One night only";
  const invitation =
    event.invitationMessage?.trim() ||
    "Doors at nine, headliner at eleven, and no support act. Bring the pass, bring the shouting.";
  const story =
    event.aboutStory?.trim() ||
    "Twenty-five years on the road, mostly in the same city, always the loudest person in the room. This is the anniversary show.";
  const hero = event.heroImageUrl || "/samples/confetti.jpg";

  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);

  const showStory = !event.hideStory;
  const showSetlist = !event.hideEvents && subEvents.length > 0;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);
  const showVenue = !event.hideVenue;

  const ageMatch = event.eventTitle.match(/\d{1,3}/);
  const age = ageMatch?.[0] ?? "";
  const dateLine = event.mainDate
    ? new Date(event.mainDate)
        .toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })
        .toUpperCase()
    : "";

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-sans antialiased"
      style={{ "--accent": accent, background: POSTER, color: NEWS } as React.CSSProperties}
    >
      <ScrollProgress color={accent} />

      {/* ── Hero: the poster ───────────────────────────────────────── */}
      <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden pb-24 sm:pb-28">
        <div className="absolute inset-0">
          <HeroMedia
            imageSrc={hero}
            videoSrc={event.heroVideoUrl || undefined}
            alt={event.eventTitle}
            className="opacity-40 grayscale contrast-[1.3]"
          />
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${POSTER}d9, ${POSTER}a6 45%, ${POSTER}f5)` }} />
        </div>

        <div className="relative z-10 w-full max-w-4xl px-5 text-center sm:px-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.4em]" style={{ color: HOT }}>
            {tagline}
          </p>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
            className="mt-4 font-condensed text-[clamp(3rem,15vw,9rem)] leading-[0.86] tracking-[0.01em]"
            style={{ color: NEWS }}
          >
            {(event.person1Name || event.eventTitle).toUpperCase()}
          </motion.h1>
          {age && (
            <motion.p
              initial={reduce ? false : { opacity: 0, scaleY: 0.6 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ duration: 0.8, delay: 0.45, ease: EASE }}
              className="font-condensed text-[clamp(2.4rem,11vw,6.5rem)] leading-[0.9]"
              style={{ color: HOT }}
            >
              THE {age} TOUR
            </motion.p>
          )}
          <div
            aria-hidden
            className="mx-auto my-7 h-1 w-full max-w-sm"
            style={{ background: `repeating-linear-gradient(90deg, ${GOLD} 0 14px, transparent 14px 22px)` }}
          />
          <p className="font-mono text-[11px] uppercase tracking-[0.28em]" style={{ color: `${NEWS}cc` }}>
            {[dateLine, event.mainStartTime, event.city].filter(Boolean).join(" · ")}
          </p>
          <div className="mt-8">
            <Laminate name={event.person1Name || event.eventTitle} age={age} reduce={reduce} />
          </div>
        </div>
      </section>

      {/* ── Backstage (story) ──────────────────────────────────────── */}
      {showStory && (
        <section className="relative px-5 py-20 sm:px-8 sm:py-28">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20, rotate: 0 }}
            whileInView={{ opacity: 1, y: 0, rotate: -0.8 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="mx-auto max-w-3xl p-8 sm:p-12"
            style={{ background: NEWS, color: POSTER, clipPath: TORN }}
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.32em]" style={{ color: HOT }}>
              Backstage
            </p>
            <h2 className="mt-4 font-condensed text-[clamp(1.9rem,5vw,3.2rem)] leading-[1.02]">
              {invitation.toUpperCase()}
            </h2>
            <p className="mt-6 font-sans text-base leading-relaxed" style={{ color: `${POSTER}c4` }}>
              {story}
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {["NO SUPPORT ACT", "ONE ENCORE", "CAKE AT MIDNIGHT"].map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em]"
                  style={{ background: POSTER, color: NEWS }}
                >
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* ── The setlist ───────────────────────────────────────────── */}
      {showSetlist && (
        <section className="relative mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-20">
          <header className="mb-8 flex flex-wrap items-end justify-between gap-3">
            <h2 className="font-condensed text-[clamp(2rem,6vw,3.5rem)] leading-none tracking-[0.04em]" style={{ color: NEWS }}>
              SETLIST
            </h2>
            <p className="font-mono text-[11px] uppercase tracking-[0.28em]" style={{ color: GOLD }}>
              {subEvents.length} tracks
            </p>
          </header>
          <Setlist items={subEvents} reduce={reduce} />
        </section>
      )}

      {/* ── The poster wall (gallery) ────────────────────────────── */}
      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <h2 className="mb-9 font-condensed text-[clamp(2rem,6vw,3.5rem)] leading-none tracking-[0.04em]">
            THE WALL
          </h2>
          {galleryItems.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {galleryItems.map((m, i) => (
                <motion.figure
                  key={`${m.fileName}-${i}`}
                  initial={reduce ? false : { opacity: 0, y: 22, rotate: 0 }}
                  whileInView={{ opacity: 1, y: 0, rotate: i % 3 === 1 ? 1.6 : -1.4 }}
                  viewport={{ once: true, margin: "-8% 0px" }}
                  transition={{ duration: 0.65, delay: (i % 3) * 0.08, ease: EASE }}
                  className="p-2"
                  style={{ background: NEWS, clipPath: TORN }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={m.publicUrl}
                    alt={m.caption ?? ""}
                    loading="lazy"
                    className="aspect-[3/4] w-full object-cover grayscale contrast-[1.2]"
                  />
                  <figcaption
                    className="px-1 pt-2 font-condensed text-lg leading-tight tracking-[0.06em]"
                    style={{ color: POSTER }}
                  >
                    {(m.caption || "UNTITLED").toUpperCase()}
                  </figcaption>
                </motion.figure>
              ))}
            </div>
          ) : (
            <div
              className="flex h-44 items-center justify-center border border-dashed font-condensed text-2xl tracking-[0.1em]"
              style={{ borderColor: `${NEWS}44`, color: `${NEWS}88` }}
            >
              + PASTE UP SOME POSTERS
            </div>
          )}
        </section>
      )}

      {/* ── The venue ────────────────────────────────────────────── */}
      {showVenue && (
        <section className="relative mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="grid gap-7 sm:grid-cols-[1fr,1.3fr]">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: HOT }}>
                The venue
              </p>
              <h2 className="mt-3 font-condensed text-[clamp(1.8rem,5vw,3rem)] leading-none tracking-[0.04em]">
                {(event.venueName || "TBA").toUpperCase()}
              </h2>
              {event.venueAddress && (
                <p className="mt-2 font-sans text-sm" style={{ color: `${NEWS}aa` }}>
                  {event.venueAddress}
                </p>
              )}
              {/* ticket stub */}
              <div
                className="mt-6 flex items-center justify-between gap-4 p-4"
                style={{ background: NEWS, color: POSTER }}
              >
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em]" style={{ color: HOT }}>
                    admit one
                  </p>
                  <p className="font-condensed text-xl tracking-[0.06em]">{dateLine || "DATE TBA"}</p>
                </div>
                <div aria-hidden className="flex gap-[2px]">
                  {Array.from({ length: 14 }, (_, i) => (
                    <span key={i} className="h-8" style={{ width: i % 3 ? 1 : 2, background: POSTER }} />
                  ))}
                </div>
              </div>
            </div>
            <div style={{ border: `1px solid ${NEWS}33` }}>
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

      {/* ── Get on the list (RSVP) ─────────────────────────────── */}
      <section className="relative px-5 py-20 text-center sm:px-8 sm:py-28">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mx-auto max-w-lg p-8 sm:p-10"
          style={{ background: NEWS, color: POSTER, clipPath: TORN }}
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.32em]" style={{ color: HOT }}>
            Guest list
          </p>
          <h2 className="mt-4 font-condensed text-[clamp(1.8rem,6vw,3rem)] leading-none tracking-[0.04em]">
            GET ON THE LIST
          </h2>
          <p className="mt-3 font-sans text-sm" style={{ color: `${POSTER}b8` }}>
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
              className="mt-7 inline-block px-10 py-3.5 font-condensed text-xl tracking-[0.14em] text-white transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
              style={{ background: POSTER, outlineColor: HOT }}
            >
              CLAIM A SPOT
            </a>
          )}
          {(event.contactName || event.contactPhone) && (
            <p className="mt-6 font-mono text-[11px]" style={{ color: `${POSTER}99` }}>
              {[event.contactName, event.contactPhone].filter(Boolean).join(" · ")}
            </p>
          )}
        </motion.div>
      </section>

      <footer className="relative border-t" style={{ borderColor: `${NEWS}22` }}>
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-6 sm:px-8">
          <p className="font-condensed text-xl tracking-[0.08em]">{(event.eventTitle || "").toUpperCase()}</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em]" style={{ color: GOLD }}>
            {dateLine || "one night only"} · {event.city || ""}
          </p>
        </div>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default TourTemplate;
