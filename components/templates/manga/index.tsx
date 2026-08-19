"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { HeroMedia } from "@/components/ui/HeroMedia";
import { MapEmbed } from "@/components/ui/MapEmbed";
import { MusicToggle } from "@/components/ui/MusicToggle";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { useEditMode } from "@/components/edit/EditContext";
import type { TemplateComponent, SubEvent } from "@/lib/types";

/* ── Manga Arc · birthday as a volume ─────────────────────────────────────
 * Palette   ink #0e0e10 · page white #f7f5f0 · screentone #c9c7c1
 *           spot accent #e6352b (the only colour on the page)
 * Type      Permanent Marker (chapter title, SFX) / Inter (lettering) /
 *           mono (panel numbers)
 * Layout    irregular panels with hard gutters; DOM order always matches
 *           reading order so a screen reader gets the same sequence.
 * Signature panels that ink themselves — each enters as flat tone, inks in,
 *           and speed lines converge on its focal point.
 * ──────────────────────────────────────────────────────────────────────── */

const EASE = [0.16, 1, 0.3, 1] as const;
const INK = "#0e0e10";
const PAGE = "#f7f5f0";
const TONE = "#c9c7c1";
const SPOT = "#e6352b";

const SCREENTONE = `radial-gradient(${INK}66 1px, transparent 1.3px)`;

/** Speed lines converging on a point. */
function SpeedLines({ reduce, className }: { reduce: boolean; className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 100 100" className={`pointer-events-none absolute inset-0 h-full w-full ${className ?? ""}`}>
      {Array.from({ length: 28 }, (_, i) => {
        const a = (i / 28) * Math.PI * 2;
        const r = (n: number) => Number(n.toFixed(2));
        return (
          <motion.line
            key={i}
            x1={r(50 + Math.cos(a) * 30)}
            y1={r(50 + Math.sin(a) * 30)}
            x2={r(50 + Math.cos(a) * 78)}
            y2={r(50 + Math.sin(a) * 78)}
            stroke={INK}
            strokeWidth={i % 3 === 0 ? 1.4 : 0.6}
            opacity="0.5"
            initial={reduce ? false : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: (i % 6) * 0.04, ease: "easeOut" }}
          />
        );
      })}
    </svg>
  );
}

/** SIGNATURE — a panel that inks itself in as it arrives. */
function Panel({
  children,
  className,
  n,
  reduce,
  tone,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  n?: string;
  reduce: boolean;
  tone?: boolean;
  delay?: number;
}) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0.25, filter: "contrast(0.4)", y: 12 }}
      whileInView={{ opacity: 1, filter: "contrast(1)", y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.55, delay, ease: EASE }}
      className={`relative overflow-hidden ${className ?? ""}`}
      style={{
        background: PAGE,
        border: `3px solid ${INK}`,
        boxShadow: `5px 5px 0 0 ${INK}`,
      }}
    >
      {tone && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: SCREENTONE, backgroundSize: "4px 4px", opacity: 0.5 }}
        />
      )}
      {n && (
        <span
          aria-hidden
          className="absolute right-1.5 top-1 font-mono text-[10px]"
          style={{ color: `${INK}88` }}
        >
          {n}
        </span>
      )}
      <div className="relative">{children}</div>
    </motion.div>
  );
}

/** SFX word that stamps in. */
function Sfx({ text, className, reduce }: { text: string; className?: string; reduce: boolean }) {
  return (
    <motion.span
      aria-hidden
      initial={reduce ? false : { scale: 1.6, opacity: 0, rotate: -8 }}
      whileInView={{ scale: 1, opacity: 1, rotate: -6 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, ease: "backOut" }}
      className={`font-marker text-4xl sm:text-6xl ${className ?? ""}`}
      style={{ color: SPOT, WebkitTextStroke: `2px ${INK}` }}
    >
      {text}
    </motion.span>
  );
}

/** The mission briefing — sub-events as numbered panels. */
function Briefing({ items, reduce }: { items: SubEvent[]; reduce: boolean }) {
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <ol className="grid gap-6 sm:grid-cols-2">
      {sorted.map((s, i) => (
        <li key={`${s.order}-${s.name}`}>
          <Panel n={`PANEL ${String(s.order).padStart(2, "0")}`} reduce={reduce} delay={(i % 4) * 0.07} tone={i % 2 === 1}>
            <div className="p-5 pt-7">
              <div className="flex items-center gap-3">
                <span
                  className="flex h-9 w-9 items-center justify-center font-marker text-lg"
                  style={{ background: INK, color: PAGE }}
                >
                  {s.order}
                </span>
                {s.icon && <span className="text-xl">{s.icon}</span>}
                <p className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: `${INK}aa` }}>
                  {[s.startTime, s.endTime].filter(Boolean).join("–") || s.date}
                </p>
              </div>
              <h3 className="mt-3 font-marker text-2xl leading-tight" style={{ color: INK }}>
                {s.name}
              </h3>
              {s.venueName && (
                <p className="mt-1 font-sans text-sm font-semibold" style={{ color: SPOT }}>
                  {s.venueName}
                </p>
              )}
              {s.description && (
                <p className="mt-2 font-sans text-sm leading-relaxed" style={{ color: `${INK}c8` }}>
                  {s.description}
                </p>
              )}
              {s.dressCode && (
                <p className="mt-3 inline-block px-2 py-0.5 font-mono text-[10px] uppercase" style={{ background: INK, color: PAGE }}>
                  {s.dressCode}
                </p>
              )}
            </div>
          </Panel>
        </li>
      ))}
    </ol>
  );
}

export const MangaTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || SPOT;
  const tagline = event.tagline?.trim() || "The arc begins";
  const invitation =
    event.invitationMessage?.trim() ||
    "Every good arc has a filler episode. This is not one of them — show up, eat everything, lose at the tournament.";
  const story =
    event.aboutStory?.trim() ||
    "Eighteen volumes in and the protagonist still refuses to train. Somehow it keeps working out.";
  const hero = event.heroImageUrl || "/samples/confetti.jpg";

  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);

  const showStory = !event.hideStory;
  const showBriefing = !event.hideEvents && subEvents.length > 0;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);
  const showVenue = !event.hideVenue;

  const ageMatch = event.eventTitle.match(/\d{1,3}/);
  const age = ageMatch?.[0] ?? "";
  const dateLine = event.mainDate
    ? new Date(event.mainDate).toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short", year: "numeric" })
    : "";

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-sans antialiased"
      style={{ "--accent": accent, background: TONE, color: INK } as React.CSSProperties}
    >
      <ScrollProgress color={accent} />

      {/* ── Chapter cover ─────────────────────────────────────────── */}
      <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-4 pb-24 pt-10 sm:px-6 sm:pb-28">
        <div className="absolute inset-0">
          <HeroMedia
            imageSrc={hero}
            videoSrc={event.heroVideoUrl || undefined}
            alt={event.eventTitle}
            className="opacity-40 grayscale contrast-[1.2]"
          />
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${PAGE}c4, ${TONE}b0 50%, ${PAGE}e6)` }} />
          <span
            aria-hidden
            className="absolute inset-0 mix-blend-multiply"
            style={{ backgroundImage: SCREENTONE, backgroundSize: "5px 5px", opacity: 0.4 }}
          />
        </div>

        <div className="relative z-10 w-full max-w-3xl">
          <Panel reduce={reduce} n="COVER">
            <SpeedLines reduce={reduce} />
            <div className="relative px-6 py-12 text-center sm:px-10 sm:py-16">
              <p className="font-mono text-[11px] uppercase tracking-[0.34em]" style={{ color: `${INK}aa` }}>
                {age ? `Chapter ${age}` : "New chapter"} · {tagline}
              </p>
              <motion.h1
                initial={reduce ? false : { opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
                className="mt-5 font-marker text-[clamp(2.6rem,11vw,6rem)] leading-[0.95]"
                style={{ color: INK }}
              >
                {event.person1Name || event.eventTitle}
              </motion.h1>
              <div className="mt-4 flex items-center justify-center">
                <Sfx text="DOKI!" reduce={reduce} />
              </div>
              {dateLine && (
                <p className="mt-7 inline-block px-3 py-1 font-mono text-[11px] uppercase tracking-[0.22em]" style={{ background: INK, color: PAGE }}>
                  {[dateLine, event.mainStartTime, event.city].filter(Boolean).join(" · ")}
                </p>
              )}
            </div>
          </Panel>
        </div>
      </section>

      {/* ── Character panel ──────────────────────────────────────── */}
      {showStory && (
        <section className="relative mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="grid gap-6 md:grid-cols-[1.2fr,0.8fr]">
            <Panel reduce={reduce} n="PANEL 01">
              <div className="p-6 sm:p-8">
                <p className="font-mono text-[10px] uppercase tracking-[0.28em]" style={{ color: SPOT }}>
                  The call
                </p>
                <h2 className="mt-4 font-marker text-3xl leading-tight sm:text-4xl" style={{ color: INK }}>
                  {invitation}
                </h2>
              </div>
            </Panel>
            <Panel reduce={reduce} n="STATS" tone delay={0.1}>
              <div className="p-6">
                <h3 className="font-marker text-2xl" style={{ color: INK }}>
                  Character sheet
                </h3>
                <dl className="mt-4 space-y-2 font-sans text-sm">
                  {[
                    ["Name", event.person1Name || event.eventTitle],
                    ["Level", age || "—"],
                    ["Base", event.city || "—"],
                    ["Special move", "starting things"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-4 border-b pb-1.5" style={{ borderColor: `${INK}33` }}>
                      <dt className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: `${INK}99` }}>
                        {k}
                      </dt>
                      <dd className="text-right font-semibold" style={{ color: INK }}>
                        {v}
                      </dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-4 font-sans text-sm leading-relaxed" style={{ color: `${INK}c8` }}>
                  {story}
                </p>
              </div>
            </Panel>
          </div>
        </section>
      )}

      {/* ── Mission briefing ─────────────────────────────────────── */}
      {showBriefing && (
        <section className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="mb-8 flex items-center gap-4">
            <h2 className="font-marker text-3xl sm:text-4xl" style={{ color: INK }}>
              Mission briefing
            </h2>
            <span aria-hidden className="h-1 flex-1" style={{ background: INK }} />
          </div>
          <Briefing items={subEvents} reduce={reduce} />
        </section>
      )}

      {/* ── The page of memories ────────────────────────────────── */}
      {showGallery && (
        <section className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="mb-8 flex items-center gap-4">
            <span aria-hidden className="h-1 flex-1" style={{ background: INK }} />
            <h2 className="font-marker text-3xl sm:text-4xl" style={{ color: INK }}>
              Previously
            </h2>
          </div>
          {galleryItems.length > 0 ? (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
              {galleryItems.map((m, i) => (
                <Panel key={`${m.fileName}-${i}`} reduce={reduce} delay={(i % 3) * 0.07} n={String(i + 1).padStart(2, "0")}>
                  <figure>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={m.publicUrl}
                      alt={m.caption ?? ""}
                      loading="lazy"
                      className="aspect-square w-full object-cover grayscale contrast-[1.25]"
                    />
                    {m.caption && (
                      <figcaption
                        className="border-t-[3px] px-2 py-1.5 font-sans text-xs font-semibold"
                        style={{ borderColor: INK, color: INK }}
                      >
                        {m.caption}
                      </figcaption>
                    )}
                  </figure>
                </Panel>
              ))}
            </div>
          ) : (
            <div
              className="flex h-44 items-center justify-center border-[3px] border-dashed font-marker text-2xl"
              style={{ borderColor: INK, color: `${INK}88`, background: PAGE }}
            >
              + add panels
            </div>
          )}
        </section>
      )}

      {/* ── Establishing shot: the venue ────────────────────────── */}
      {showVenue && (
        <section className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
          <Panel reduce={reduce} n="ESTABLISHING SHOT">
            <div className="p-6 sm:p-8">
              <h2 className="font-marker text-3xl" style={{ color: INK }}>
                {event.venueName || "The location"}
              </h2>
              {event.venueAddress && (
                <p className="mt-2 font-sans text-sm" style={{ color: `${INK}c0` }}>
                  {event.venueAddress}
                </p>
              )}
              <div className="mt-5" style={{ border: `3px solid ${INK}` }}>
                <MapEmbed
                  latitude={event.latitude}
                  longitude={event.longitude}
                  venueName={event.venueName}
                  venueAddress={event.venueAddress}
                  mapLink={event.mapLink}
                />
              </div>
            </div>
          </Panel>
        </section>
      )}

      {/* ── Join the party (RSVP) ──────────────────────────────── */}
      <section className="relative mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 sm:py-20">
        <Panel reduce={reduce} n="CALL TO ACTION">
          <SpeedLines reduce={reduce} />
          <div className="relative px-6 py-12 sm:px-10">
            <Sfx text="JOIN!" reduce={reduce} />
            <h2 className="mt-5 font-marker text-3xl" style={{ color: INK }}>
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
                className="mt-7 inline-block px-9 py-3.5 font-marker text-xl transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
                style={{ background: accent, color: PAGE, border: `3px solid ${INK}`, boxShadow: `4px 4px 0 0 ${INK}`, outlineColor: INK }}
              >
                I'm in
              </a>
            )}
            {(event.contactName || event.contactPhone) && (
              <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: `${INK}99` }}>
                {[event.contactName, event.contactPhone].filter(Boolean).join(" · ")}
              </p>
            )}
          </div>
        </Panel>
      </section>

      <footer className="relative px-4 pb-10 sm:px-6">
        <div
          className="flex flex-wrap items-center justify-between gap-3 px-5 py-5"
          style={{ background: INK, color: PAGE }}
        >
          <p className="font-marker text-lg">{event.eventTitle}</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em]">To be continued →</p>
        </div>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default MangaTemplate;
