"use client";

import { useMemo, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { HeroMedia } from "@/components/ui/HeroMedia";
import { MapEmbed } from "@/components/ui/MapEmbed";
import { MusicToggle } from "@/components/ui/MusicToggle";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { useEditMode } from "@/components/edit/EditContext";
import type { TemplateComponent, SubEvent } from "@/lib/types";

/* ── Feast · the wedding as a family cookbook ─────────────────────────────
 * Palette   turmeric #d9982b · tamarind #7a3b23 · banana leaf #3f7a3a
 *           ghee cream #f6efdd · ink #2b2118
 * Type      Playfair (dish names) / Inter (method) / Caveat (margin notes)
 * Layout    recipe cards laid on a kitchen table — every section is a card
 *           with an ingredient rail and a handwritten note in the margin.
 * Signature the masala dabba: a seven-compartment spice tin that turns as the
 *           page scrolls, each compartment a course of the day.
 * ──────────────────────────────────────────────────────────────────────── */

const EASE = [0.16, 1, 0.3, 1] as const;
const TURMERIC = "#d9982b";
const TAMARIND = "#7a3b23";
const LEAF = "#3f7a3a";
const GHEE = "#f6efdd";
const INK = "#2b2118";

const SPICES = ["#d9982b", "#a8342a", "#7a3b23", "#3f7a3a", "#c96a1e", "#5e4632", "#b9963f"];

/** SIGNATURE — the spice tin, turning with the scroll. */
function MasalaDabba({ labels, reduce }: { labels: string[]; reduce: boolean }) {
  const { scrollYProgress } = useScroll();
  const spin = useTransform(scrollYProgress, [0, 1], [0, 240]);
  const wells = labels.slice(0, 7);
  return (
    <motion.div
      aria-hidden
      className="relative mx-auto h-56 w-56 rounded-full sm:h-64 sm:w-64"
      style={{
        background: `radial-gradient(circle at 32% 28%, #e9e4d8, #b9b3a4 60%, #8d887b)`,
        boxShadow: `inset 0 0 0 8px #cfcabb, 0 24px 44px -28px ${INK}`,
        rotate: reduce ? 0 : spin,
      }}
    >
      {wells.map((label, i) => {
        const a = (i / Math.max(wells.length, 1)) * Math.PI * 2 - Math.PI / 2;
        const x = 50 + Math.cos(a) * 30;
        const y = 50 + Math.sin(a) * 30;
        return (
          <span
            key={`${label}-${i}`}
            className="absolute flex h-[26%] w-[26%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-center"
            style={{
              left: `${x.toFixed(2)}%`,
              top: `${y.toFixed(2)}%`,
              background: SPICES[i % SPICES.length],
              boxShadow: `inset 0 -4px 8px rgba(0,0,0,0.35), 0 0 0 3px #cfcabb`,
            }}
          />
        );
      })}
      <span
        className="absolute left-1/2 top-1/2 flex h-[24%] w-[24%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
        style={{ background: "#e9e4d8", boxShadow: `inset 0 0 0 3px #cfcabb` }}
      />
    </motion.div>
  );
}

/** A ghee-stain blot, used sparingly as texture. */
function Stain({ className, color = TURMERIC }: { className?: string; color?: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute rounded-full ${className ?? ""}`}
      style={{ background: `radial-gradient(circle, ${color}44, transparent 70%)` }}
    />
  );
}

/** A recipe card. */
function Card({
  children,
  className,
  note,
}: {
  children: React.ReactNode;
  className?: string;
  note?: string;
}) {
  return (
    <div
      className={`relative ${className ?? ""}`}
      style={{
        background: "#fffdf6",
        border: `1px solid ${TAMARIND}22`,
        boxShadow: `0 18px 36px -28px ${INK}`,
        backgroundImage: `repeating-linear-gradient(180deg, transparent 0 27px, ${TAMARIND}14 27px 28px)`,
      }}
    >
      <span aria-hidden className="absolute inset-y-0 left-8 w-px" style={{ background: `${TURMERIC}66` }} />
      {children}
      {note && (
        <p
          className="mt-4 pl-10 font-hand text-xl"
          style={{ color: TAMARIND, transform: "rotate(-1.2deg)" }}
        >
          {note}
        </p>
      )}
    </div>
  );
}

/** Sub-events as the courses of the day. */
function Courses({ items, accent, reduce }: { items: SubEvent[]; accent: string; reduce: boolean }) {
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <ol className="space-y-6">
      {sorted.map((s, i) => (
        <motion.li
          key={`${s.order}-${s.name}`}
          initial={reduce ? false : { opacity: 0, y: 20, rotate: 0 }}
          whileInView={{ opacity: 1, y: 0, rotate: i % 2 ? 0.5 : -0.6 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.65, delay: (i % 4) * 0.06, ease: EASE }}
        >
          <Card className="p-6 sm:p-8">
            <div className="pl-10">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <p className="font-sans text-[10px] uppercase tracking-[0.32em]" style={{ color: LEAF }}>
                  Course {String(s.order).padStart(2, "0")}
                </p>
                <p className="font-sans text-[11px] uppercase tracking-[0.24em]" style={{ color: accent }}>
                  {[s.date, [s.startTime, s.endTime].filter(Boolean).join("–")].filter(Boolean).join(" · ")}
                </p>
              </div>
              <h3 className="mt-2 font-display text-2xl leading-tight sm:text-3xl" style={{ color: TAMARIND }}>
                {s.icon ? `${s.icon} ` : ""}
                {s.name}
              </h3>
              {s.venueName && (
                <p className="mt-1 font-hand text-xl" style={{ color: LEAF }}>
                  served at {s.venueName}
                </p>
              )}
              {s.description && (
                <p className="mt-3 max-w-prose font-sans text-sm leading-relaxed" style={{ color: `${INK}c8` }}>
                  {s.description}
                </p>
              )}
              {s.dressCode && (
                <p
                  className="mt-4 inline-block px-2.5 py-1 font-sans text-[10px] uppercase tracking-[0.2em]"
                  style={{ background: `${TURMERIC}33`, color: INK }}
                >
                  {s.dressCode}
                </p>
              )}
            </div>
          </Card>
        </motion.li>
      ))}
    </ol>
  );
}

export const FeastTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || TAMARIND;
  const tagline = event.tagline?.trim() || "Handed down, never written down";
  const invitation =
    event.invitationMessage?.trim() ||
    "Both our families argue about food and agree about very little else. Come eat with us while we settle it for good.";
  const story =
    event.aboutStory?.trim() ||
    "Her grandmother's rasam, his mother's kadhi, one shared kitchen and eleven years of borrowed pots. This is the menu that came out of it.";
  const hero = event.heroImageUrl || "/samples/puja-offerings.jpg";

  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const names = [event.person1Name, event.person2Name].filter(Boolean);
  const courseNames = useMemo(
    () => [...subEvents].sort((a, b) => a.order - b.order).map((s) => s.name),
    [subEvents],
  );

  const showStory = !event.hideStory;
  const showCourses = !event.hideEvents && subEvents.length > 0;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);
  const showVenue = !event.hideVenue;

  const tableRef = useRef<HTMLDivElement>(null);
  const dateLine = event.mainDate
    ? new Date(event.mainDate).toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : "";

  return (
    <div
      ref={tableRef}
      className="relative min-h-screen overflow-x-clip font-sans antialiased"
      style={{ "--accent": accent, background: GHEE, color: INK } as React.CSSProperties}
    >
      <ScrollProgress color={accent} />

      {/* ── Hero: the leaf is laid ─────────────────────────────────── */}
      <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden pb-24 sm:pb-28">
        <div className="absolute inset-0">
          <HeroMedia
            imageSrc={hero}
            videoSrc={event.heroVideoUrl || undefined}
            alt={event.eventTitle}
            className="opacity-55"
          />
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(180deg, ${GHEE}d9 0%, ${GHEE}a8 45%, ${GHEE}f2 100%)` }}
          />
        </div>
        <Stain className="left-[8%] top-[18%] h-40 w-40" />
        <Stain className="right-[12%] bottom-[22%] h-32 w-32" color={LEAF} />

        <div className="relative z-10 px-6 text-center">
          {/* the banana leaf */}
          <div
            aria-hidden
            className="mx-auto mb-8 h-3 w-40 rounded-full sm:w-56"
            style={{ background: `linear-gradient(90deg, transparent, ${LEAF}, transparent)` }}
          />
          <p className="font-sans text-[10px] uppercase tracking-[0.46em]" style={{ color: LEAF }}>
            {tagline}
          </p>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.25, ease: EASE }}
            className="mt-6 font-display text-[clamp(2.5rem,9vw,5.6rem)] leading-[1.02]"
            style={{ color: TAMARIND }}
          >
            {names.length === 2 ? (
              <>
                {names[0]}
                <span className="mx-3 align-middle text-[0.38em]" style={{ color: TURMERIC }}>
                  &amp;
                </span>
                {names[1]}
              </>
            ) : (
              event.eventTitle
            )}
          </motion.h1>
          <p className="mt-5 font-hand text-2xl" style={{ color: `${INK}b0` }}>
            are laying one long table
          </p>
          {dateLine && (
            <p className="mt-8 font-sans text-[11px] uppercase tracking-[0.34em]" style={{ color: TAMARIND }}>
              {dateLine}
              {event.city ? ` · ${event.city}` : ""}
            </p>
          )}
        </div>
      </section>

      {/* ── The recipe (story) ─────────────────────────────────────── */}
      {showStory && (
        <section className="relative px-6 py-20 sm:py-28">
          <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1fr,auto] lg:items-center">
            <Card className="p-7 sm:p-10" note="— and yes, both mothers supervised">
              <div className="pl-10">
                <p className="font-sans text-[10px] uppercase tracking-[0.36em]" style={{ color: LEAF }}>
                  The recipe
                </p>
                <motion.h2
                  initial={reduce ? false : { opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, ease: EASE }}
                  className="mt-4 font-display text-2xl leading-snug sm:text-3xl"
                  style={{ color: TAMARIND }}
                >
                  {invitation}
                </motion.h2>
                <ul className="mt-6 space-y-1.5 font-sans text-sm" style={{ color: `${INK}c8` }}>
                  {[
                    "2 families, generously heaped",
                    "1 long table, well seasoned",
                    "11 years, reduced slowly",
                    "salt, to taste",
                  ].map((line) => (
                    <li key={line} className="flex gap-2">
                      <span aria-hidden style={{ color: TURMERIC }}>
                        ·
                      </span>
                      {line}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 font-sans text-sm leading-relaxed" style={{ color: `${INK}c8` }}>
                  {story}
                </p>
              </div>
            </Card>
            <div className="justify-self-center">
              <MasalaDabba labels={courseNames.length ? courseNames : ["one", "two", "three"]} reduce={reduce} />
              <p className="mt-4 text-center font-hand text-xl" style={{ color: TAMARIND }}>
                seven tins, one kitchen
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ── The courses ───────────────────────────────────────────── */}
      {showCourses && (
        <section className="relative mx-auto max-w-3xl px-6 py-16 sm:py-20">
          <header className="mb-9">
            <p className="font-sans text-[10px] uppercase tracking-[0.36em]" style={{ color: LEAF }}>
              The menu
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl" style={{ color: TAMARIND }}>
              Served in this order
            </h2>
          </header>
          <Courses items={subEvents} accent={accent} reduce={reduce} />
        </section>
      )}

      {/* ── The binder (gallery) ─────────────────────────────────── */}
      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <h2 className="mb-9 font-display text-3xl" style={{ color: TAMARIND }}>
            Pinned in the binder
          </h2>
          {galleryItems.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {galleryItems.map((m, i) => (
                <motion.figure
                  key={`${m.fileName}-${i}`}
                  initial={reduce ? false : { opacity: 0, y: 22, rotate: 0 }}
                  whileInView={{ opacity: 1, y: 0, rotate: i % 3 === 1 ? 1.4 : -1.1 }}
                  viewport={{ once: true, margin: "-8% 0px" }}
                  transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: EASE }}
                  className="relative p-3 pb-10"
                  style={{ background: "#fffdf6", boxShadow: `0 20px 40px -30px ${INK}` }}
                >
                  <span
                    aria-hidden
                    className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full"
                    style={{ background: TAMARIND, boxShadow: `0 2px 4px rgba(0,0,0,0.4)` }}
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={m.publicUrl}
                    alt={m.caption ?? ""}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <figcaption className="absolute bottom-2 left-0 right-0 px-3 text-center font-hand text-lg" style={{ color: TAMARIND }}>
                    {m.caption || "untitled dish"}
                  </figcaption>
                </motion.figure>
              ))}
            </div>
          ) : (
            <div
              className="flex h-44 items-center justify-center border-2 border-dashed font-hand text-2xl"
              style={{ borderColor: `${TAMARIND}44`, color: `${INK}88` }}
            >
              + pin some photographs in
            </div>
          )}
        </section>
      )}

      {/* ── The kitchen (venue) ──────────────────────────────────── */}
      {showVenue && (
        <section className="relative mx-auto max-w-4xl px-6 py-16 sm:py-20">
          <Card className="p-6 sm:p-8">
            <div className="pl-10">
              <p className="font-sans text-[10px] uppercase tracking-[0.36em]" style={{ color: LEAF }}>
                The kitchen
              </p>
              <h2 className="mt-3 font-display text-3xl" style={{ color: TAMARIND }}>
                {event.venueName || "The venue"}
              </h2>
              {event.venueAddress && (
                <p className="mt-2 font-sans text-sm" style={{ color: `${INK}b8` }}>
                  {event.venueAddress}
                </p>
              )}
              <div className="mt-6" style={{ border: `4px solid ${TURMERIC}66` }}>
                <MapEmbed
                  latitude={event.latitude}
                  longitude={event.longitude}
                  venueName={event.venueName}
                  venueAddress={event.venueAddress}
                  mapLink={event.mapLink}
                />
              </div>
            </div>
          </Card>
        </section>
      )}

      {/* ── How many plates? (RSVP) ─────────────────────────────── */}
      <section className="relative px-6 py-20 text-center sm:py-28">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mx-auto max-w-lg px-8 py-12"
          style={{
            background: "#fffdf6",
            border: `2px solid ${TURMERIC}`,
            boxShadow: `0 26px 50px -34px ${INK}`,
          }}
        >
          <p className="font-sans text-[10px] uppercase tracking-[0.36em]" style={{ color: LEAF }}>
            One question only
          </p>
          <h2 className="mt-4 font-display text-3xl leading-snug" style={{ color: TAMARIND }}>
            How many plates should we lay?
          </h2>
          <p className="mt-3 font-hand text-xl" style={{ color: `${INK}a8` }}>
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
              className="mt-8 inline-block px-10 py-3.5 font-sans text-[11px] uppercase tracking-[0.3em] text-white transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
              style={{ background: TAMARIND, outlineColor: TURMERIC }}
            >
              Count us in
            </a>
          )}
          {(event.contactName || event.contactPhone) && (
            <p className="mt-6 font-sans text-xs" style={{ color: `${INK}99` }}>
              {[event.contactName, event.contactPhone].filter(Boolean).join(" · ")}
            </p>
          )}
        </motion.div>
      </section>

      <footer className="relative">
        <div aria-hidden className="flex h-8">
          {SPICES.map((c, i) => (
            <span key={i} className="flex-1" style={{ background: c, opacity: 0.75 }} />
          ))}
        </div>
        <p className="py-6 text-center font-sans text-[11px] tracking-[0.2em]" style={{ color: `${INK}8a` }}>
          {event.eventTitle}
          {names.length === 2 ? ` · ${names.join(" & ")}` : ""}
        </p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default FeastTemplate;
