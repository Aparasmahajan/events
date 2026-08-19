"use client";

import { useMemo, useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { HeroMedia } from "@/components/ui/HeroMedia";
import { MapEmbed } from "@/components/ui/MapEmbed";
import { MusicToggle } from "@/components/ui/MusicToggle";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { useEditMode } from "@/components/edit/EditContext";
import type { TemplateComponent, SubEvent } from "@/lib/types";

/* ── Analog · shot on film ────────────────────────────────────────────────
 * Palette   darkroom #17181a · safelight red #c0392f · Portra warm #e6c8a8
 *           emulsion cream #f3efe6 · silver #b9bec4
 * Type      Bebas Neue (film-edge printing, names) / Inter (body) /
 *           mono (frame numbers, ISO markings)
 * Layout    the page IS a filmstrip — a sprocket rail runs the full height,
 *           sections are frames, edge printing runs vertically alongside.
 * Signature frames develop: every photo enters flat and grey and resolves to
 *           full tone as it crosses the viewport, with one light leak on the
 *           hero that never repeats.
 * ──────────────────────────────────────────────────────────────────────── */

const EASE = [0.16, 1, 0.3, 1] as const;
const DARK = "#17181a";
const RED = "#c0392f";
const WARM = "#e6c8a8";
const CREAM = "#f3efe6";
const SILVER = "#b9bec4";

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='0.42'/%3E%3C/svg%3E\")";

/** The sprocket rail — persistent film edge down the left of the page. */
function SprocketRail({ text }: { text: string }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-30 h-full w-6 sm:w-10"
      style={{ background: "#0d0e0f", borderRight: `1px solid ${SILVER}22` }}
    >
      <div
        className="absolute inset-y-0 left-1/2 w-3 -translate-x-1/2 sm:w-5"
        style={{
          background: `repeating-linear-gradient(180deg, ${DARK} 0px, ${DARK} 10px, ${CREAM}22 10px, ${CREAM}22 22px)`,
          borderRadius: 2,
        }}
      />
      <p
        className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-[9px] tracking-[0.3em] sm:block"
        style={{ writingMode: "vertical-rl", color: `${WARM}77` }}
      >
        {text}
      </p>
    </div>
  );
}

/** Horizontal sprocket band used as a frame edge. */
function SprocketBand() {
  return (
    <div
      aria-hidden
      className="h-4 w-full"
      style={{
        background: `repeating-linear-gradient(90deg, transparent 0px, transparent 8px, ${CREAM}1f 8px, ${CREAM}1f 20px)`,
      }}
    />
  );
}

/** A photo that develops as it crosses the viewport. */
function DevelopingImage({
  url,
  caption,
  className,
  reduce,
}: {
  url: string;
  caption?: string;
  className?: string;
  reduce: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const grey = useTransform(scrollYProgress, [0, 1], [0.85, 0]);
  const contrast = useTransform(scrollYProgress, [0, 1], [0.72, 1]);
  const filter = useMotionTemplate`grayscale(${grey}) contrast(${contrast})`;
  return (
    <motion.div ref={ref} style={reduce ? undefined : { filter }} className={className}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt={caption ?? ""} loading="lazy" className="h-full w-full object-cover" />
    </motion.div>
  );
}

/** Grease-pencil circle the way a photographer marks a keeper. */
function ChinagraphMark({ label, reduce }: { label: string; reduce: boolean }) {
  return (
    <span className="relative inline-block px-3 py-1">
      <svg
        aria-hidden
        viewBox="0 0 120 56"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
      >
        <motion.ellipse
          cx="60"
          cy="28"
          rx="55"
          ry="23"
          fill="none"
          stroke={RED}
          strokeWidth="2.4"
          strokeLinecap="round"
          transform="rotate(-3 60 28)"
          initial={reduce ? false : { pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.9 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: EASE }}
        />
      </svg>
      <span className="relative font-mono text-[11px] tracking-[0.2em]" style={{ color: RED }}>
        {label}
      </span>
    </span>
  );
}

function FrameLabel({ n, title }: { n: string; title: string }) {
  return (
    <div className="mb-8 flex items-baseline gap-4">
      <span className="font-mono text-[11px] tracking-[0.28em]" style={{ color: `${WARM}88` }}>
        FRAME {n}
      </span>
      <span aria-hidden className="h-px flex-1" style={{ background: `${SILVER}2e` }} />
      <h2 className="font-condensed text-2xl tracking-[0.12em] sm:text-3xl" style={{ color: CREAM }}>
        {title}
      </h2>
    </div>
  );
}

/** Sub-events as numbered exposures on the roll. */
function Exposures({ items, accent, reduce }: { items: SubEvent[]; accent: string; reduce: boolean }) {
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <ol className="divide-y" style={{ borderColor: `${SILVER}1f` }}>
      {sorted.map((s, i) => (
        <motion.li
          key={`${s.order}-${s.name}`}
          initial={reduce ? false : { opacity: 0, x: -14 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.6, delay: i * 0.05, ease: EASE }}
          className="flex flex-col gap-3 border-t py-7 sm:flex-row sm:items-baseline sm:gap-8"
          style={{ borderColor: `${SILVER}1f` }}
        >
          <div className="flex shrink-0 items-center gap-3 sm:w-28">
            <span className="font-mono text-xs" style={{ color: accent }}>
              {String(s.order).padStart(2, "0")}
            </span>
            <span aria-hidden className="h-3 w-3" style={{ background: `${CREAM}1f` }} />
            {s.icon && <span className="text-base">{s.icon}</span>}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-condensed text-2xl tracking-[0.08em]" style={{ color: CREAM }}>
              {s.name}
            </h3>
            {s.description && (
              <p className="mt-1.5 max-w-prose text-sm leading-relaxed" style={{ color: `${SILVER}cc` }}>
                {s.description}
              </p>
            )}
            {s.dressCode && (
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.24em]" style={{ color: `${WARM}aa` }}>
                {s.dressCode}
              </p>
            )}
          </div>
          <div className="shrink-0 text-left sm:w-40 sm:text-right">
            <p className="font-mono text-[11px] tracking-[0.2em]" style={{ color: WARM }}>
              {[s.startTime, s.endTime].filter(Boolean).join("–") || s.date}
            </p>
            {s.venueName && (
              <p className="mt-1 text-xs" style={{ color: `${SILVER}99` }}>
                {s.venueName}
              </p>
            )}
          </div>
        </motion.li>
      ))}
    </ol>
  );
}

export const AnalogTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || RED;
  const tagline = event.tagline?.trim() || "One roll, one day";
  const invitation =
    event.invitationMessage?.trim() ||
    "No stage, no spectacle — just the people who matter in the room where we sign. Come be in the frame.";
  const story =
    event.aboutStory?.trim() ||
    "We are not the couple who plans. We are the couple who shows up with a loaded camera and lets the day happen. This is that day.";
  const hero = event.heroImageUrl || "/samples/wedding-shoes.jpg";

  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const names = [event.person1Name, event.person2Name].filter(Boolean).join(" + ");
  const edgeText = `${(names || event.eventTitle).toUpperCase()} · 400TX · ${
    galleryItems.length ? galleryItems.length + 12 : 36
  } EXP`;

  const showStory = !event.hideStory;
  const showExposures = !event.hideEvents && subEvents.length > 0;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);
  const showVenue = !event.hideVenue;

  const dateLine = event.mainDate
    ? new Date(event.mainDate)
        .toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
        .toUpperCase()
    : "";

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-sans antialiased"
      style={{ "--accent": accent, background: DARK, color: CREAM } as React.CSSProperties}
    >
      <ScrollProgress color={accent} />
      <SprocketRail text={edgeText} />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-20 opacity-[0.05] mix-blend-screen"
        style={{ backgroundImage: GRAIN, backgroundSize: "120px 120px" }}
      />

      <div className="relative z-10 pl-6 sm:pl-10">
        {/* ── Hero: frame 01, developing, with one light leak ────────── */}
        <section className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pb-24 sm:pb-28">
          <div className="absolute inset-0">
            <HeroMedia
              imageSrc={hero}
              videoSrc={event.heroVideoUrl || undefined}
              alt={event.eventTitle}
              className="opacity-60 grayscale-[0.3]"
            />
            <div
              className="absolute inset-0"
              style={{ background: `linear-gradient(180deg, ${DARK}b3 0%, ${DARK}59 42%, ${DARK}f0 100%)` }}
            />
          </div>

          {/* One-off light leak — halation bleeding in from the film edge */}
          {!reduce && (
            <motion.div
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.85, 0.18] }}
              transition={{ duration: 2.6, times: [0, 0.35, 1], ease: "easeOut" }}
              className="pointer-events-none absolute inset-y-0 left-0 w-1/2"
              style={{
                background: `linear-gradient(90deg, ${accent}66 0%, ${WARM}33 35%, transparent 75%)`,
                mixBlendMode: "screen",
              }}
            />
          )}

          <SprocketBand />
          <div className="relative px-5 py-14 sm:px-10">
            <motion.p
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-mono text-[11px] tracking-[0.34em]"
              style={{ color: accent }}
            >
              01 · {tagline.toUpperCase()}
            </motion.p>
            <motion.h1
              initial={reduce ? false : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.35, ease: EASE }}
              className="mt-6 font-condensed text-[clamp(3rem,13vw,8.5rem)] leading-[0.92] tracking-[0.02em]"
              style={{ color: CREAM }}
            >
              {names || event.eventTitle}
            </motion.h1>
            <motion.div
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.9 }}
              className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] tracking-[0.24em]"
              style={{ color: `${SILVER}cc` }}
            >
              {dateLine && <span>{dateLine}</span>}
              {event.city && <span>{event.city.toUpperCase()}</span>}
              {event.mainStartTime && <span>{event.mainStartTime}</span>}
              <span style={{ color: `${WARM}99` }}>f/2 · 1/125 · ISO 400</span>
            </motion.div>
          </div>
          <SprocketBand />
        </section>

        {/* ── Frame 02: the story ─────────────────────────────────────── */}
        {showStory && (
          <section className="mx-auto max-w-5xl px-5 py-24 sm:px-10 sm:py-32">
            <FrameLabel n="02" title="THE SHOT LIST" />
            <div className="grid gap-10 md:grid-cols-[1.1fr,0.9fr] md:items-start">
              <div>
                <ChinagraphMark label="KEEPER" reduce={reduce} />
                <motion.p
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: EASE }}
                  className="mt-6 font-condensed text-[clamp(1.6rem,3.4vw,2.6rem)] leading-[1.15] tracking-[0.03em]"
                  style={{ color: CREAM }}
                >
                  {invitation}
                </motion.p>
                <p className="mt-7 max-w-prose text-sm leading-relaxed sm:text-base" style={{ color: `${SILVER}cc` }}>
                  {story}
                </p>
              </div>
              {galleryItems[0] && (
                <figure>
                  <DevelopingImage
                    url={galleryItems[0].publicUrl}
                    caption={galleryItems[0].caption}
                    reduce={reduce}
                    className="aspect-[4/5] w-full overflow-hidden"
                  />
                  <figcaption className="mt-3 font-mono text-[10px] tracking-[0.2em]" style={{ color: `${SILVER}88` }}>
                    {(galleryItems[0].caption || "UNTITLED").toUpperCase()} · FRAME 02A
                  </figcaption>
                </figure>
              )}
            </div>
          </section>
        )}

        {/* ── Frame 03: the exposures ─────────────────────────────────── */}
        {showExposures && (
          <section className="mx-auto max-w-5xl px-5 py-20 sm:px-10 sm:py-24">
            <FrameLabel n="03" title="EXPOSURES" />
            <Exposures items={subEvents} accent={accent} reduce={reduce} />
          </section>
        )}

        {/* ── Frame 04: contact sheet ─────────────────────────────────── */}
        {showGallery && (
          <section className="mx-auto max-w-6xl px-5 py-20 sm:px-10 sm:py-24">
            <FrameLabel n="04" title="CONTACT SHEET" />
            {galleryItems.length > 0 ? (
              <div
                className="grid grid-cols-2 gap-[3px] p-[3px] sm:grid-cols-3 lg:grid-cols-4"
                style={{ background: "#0b0c0d" }}
              >
                {galleryItems.map((m, i) => (
                  <figure key={`${m.fileName}-${i}`} className="group relative">
                    <DevelopingImage
                      url={m.publicUrl}
                      caption={m.caption}
                      reduce={reduce}
                      className="aspect-square w-full overflow-hidden"
                    />
                    <figcaption
                      className="absolute bottom-1 left-1.5 font-mono text-[9px] tracking-[0.16em] opacity-80"
                      style={{ color: WARM, textShadow: `0 1px 2px ${DARK}` }}
                    >
                      {String(i + 1).padStart(2, "0")}
                      {m.caption ? ` · ${m.caption.toUpperCase()}` : ""}
                    </figcaption>
                  </figure>
                ))}
              </div>
            ) : (
              <div
                className="flex h-48 items-center justify-center border border-dashed font-mono text-xs tracking-[0.2em]"
                style={{ borderColor: `${SILVER}44`, color: `${SILVER}99` }}
              >
                + ADD PHOTOS TO PRINT THE SHEET
              </div>
            )}
          </section>
        )}

        {/* ── Frame 05: the location slate ────────────────────────────── */}
        {showVenue && (
          <section className="mx-auto max-w-4xl px-5 py-20 sm:px-10 sm:py-24">
            <FrameLabel n="05" title="LOCATION" />
            <div
              className="mb-6 grid grid-cols-2 gap-px sm:grid-cols-4"
              style={{ background: `${SILVER}22`, border: `1px solid ${SILVER}22` }}
            >
              {[
                ["SCENE", event.eventTitle],
                ["LOCATION", event.venueName || "—"],
                ["DATE", dateLine || "—"],
                ["CALL", event.mainStartTime || "—"],
              ].map(([k, v]) => (
                <div key={k} className="p-4" style={{ background: "#101112" }}>
                  <p className="font-mono text-[9px] tracking-[0.28em]" style={{ color: `${WARM}88` }}>
                    {k}
                  </p>
                  <p className="mt-1.5 font-condensed text-lg tracking-[0.06em]" style={{ color: CREAM }}>
                    {v}
                  </p>
                </div>
              ))}
            </div>
            {event.venueAddress && (
              <p className="mb-5 text-sm" style={{ color: `${SILVER}bb` }}>
                {event.venueAddress}
              </p>
            )}
            <div style={{ border: `1px solid ${SILVER}22` }}>
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

        {/* ── Frame 06: the lab order (RSVP) ──────────────────────────── */}
        <section className="mx-auto max-w-3xl px-5 py-24 sm:px-10 sm:py-32">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="p-8 sm:p-10"
            style={{ background: "#101112", border: `1px solid ${SILVER}26` }}
          >
            <p className="font-mono text-[10px] tracking-[0.3em]" style={{ color: `${WARM}99` }}>
              DEVELOP · PRINT · SHARE
            </p>
            <h2 className="mt-4 font-condensed text-3xl tracking-[0.06em] sm:text-4xl" style={{ color: CREAM }}>
              {event.eventTitle}
            </h2>
            <p className="mt-4 max-w-prose text-sm leading-relaxed" style={{ color: `${SILVER}cc` }}>
              Tell us you're coming and we'll keep a frame for you.
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
                className="mt-8 inline-block px-9 py-3.5 font-mono text-[11px] uppercase tracking-[0.28em] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
                style={{ background: accent, color: CREAM, outlineColor: WARM }}
              >
                RSVP
              </a>
            )}
            {(event.contactName || event.contactPhone) && (
              <p className="mt-6 font-mono text-[11px] tracking-[0.18em]" style={{ color: `${SILVER}99` }}>
                {[event.contactName, event.contactPhone].filter(Boolean).join(" · ")}
              </p>
            )}
          </motion.div>
        </section>

        {/* ── End of roll ─────────────────────────────────────────────── */}
        <footer className="pb-10">
          <SprocketBand />
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-6 sm:px-10">
            <p className="font-mono text-[10px] tracking-[0.28em]" style={{ color: `${WARM}77` }}>
              END OF ROLL · {edgeText}
            </p>
            <p className="font-condensed text-sm tracking-[0.16em]" style={{ color: `${SILVER}aa` }}>
              {event.eventTitle}
            </p>
          </div>
        </footer>
      </div>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default AnalogTemplate;
