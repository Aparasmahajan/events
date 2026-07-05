"use client";

import { useMemo, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { HeroMedia } from "@/components/ui/HeroMedia";
import { MapEmbed } from "@/components/ui/MapEmbed";
import { MusicToggle } from "@/components/ui/MusicToggle";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { useEditMode } from "@/components/edit/EditContext";
import type { TemplateComponent, SubEvent } from "@/lib/types";

const EASE = [0.16, 1, 0.3, 1] as const;

const PARCHMENT = "#f0e6d2";
const INK = "#1e2a3a";
const SEPIA = "#8b6f47";

const ROMAN_MAP: [number, string][] = [
  [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
];

function toRoman(n: number): string {
  if (n <= 0) return "";
  if (n > 20) return String(n);
  let num = n;
  let out = "";
  for (const [v, s] of ROMAN_MAP) {
    while (num >= v) {
      out += s;
      num -= v;
    }
  }
  return out;
}

const CONSTELLATION = Array.from({ length: 14 }, (_, i) => ({
  x: 5 + ((i * 37) % 90),
  y: 8 + ((i * 53) % 84),
  delay: i * 0.15,
}));

const CONSTELLATION_LINES: [number, number][] = [
  [0, 1], [1, 2], [2, 4], [3, 5], [4, 6], [5, 7], [7, 9], [8, 10], [9, 11], [10, 12], [11, 13],
];

function ParchmentBackdrop() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10" style={{ background: PARCHMENT }}>
      <svg className="absolute inset-0 h-full w-full opacity-[0.09]" xmlns="http://www.w3.org/2000/svg">
        <filter id="chapters-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" />
          <feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 0 0.15  0 0 0 0.7 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#chapters-grain)" />
      </svg>
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(139,111,71,0.18) 100%)" }}
      />
    </div>
  );
}

function Flourish({ color, className }: { color: string; className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className ?? ""}`} style={{ color }}>
      <span className="h-px w-16" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
      <span className="text-lg" aria-hidden>❦</span>
      <span className="h-px w-16" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
    </div>
  );
}

function Constellation({ accent, reduce }: { accent: string; reduce: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {CONSTELLATION_LINES.map(([a, b], i) => {
          const p1 = CONSTELLATION[a];
          const p2 = CONSTELLATION[b];
          if (!p1 || !p2) return null;
          return (
            <motion.line
              key={i}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke={accent}
              strokeWidth="0.12"
              strokeOpacity="0.35"
              initial={reduce ? false : { pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ duration: 1.6, delay: 0.4 + i * 0.08, ease: EASE }}
            />
          );
        })}
      </svg>
      {CONSTELLATION.map((d, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${d.x}%`,
            top: `${d.y}%`,
            width: 4,
            height: 4,
            background: accent,
            boxShadow: `0 0 6px ${accent}`,
          }}
          initial={reduce ? false : { opacity: 0, scale: 0 }}
          whileInView={{ opacity: 0.7, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: d.delay, ease: EASE }}
        />
      ))}
    </div>
  );
}

function ChapterBlock({ s, index, accent }: { s: SubEvent; index: number; accent: string }) {
  const reduce = useReducedMotion();
  const dateStr = s.date
    ? new Date(s.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "";
  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 60, rotate: -1.5 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.9, delay: index * 0.05, ease: EASE }}
      className="relative mx-auto max-w-2xl border-b py-14"
      style={{ borderColor: `${SEPIA}33` }}
    >
      <div className="text-center">
        <p
          className="text-[11px] uppercase"
          style={{ color: SEPIA, letterSpacing: "0.4em", fontVariant: "small-caps" }}
        >
          Chapter {toRoman(s.order || index + 1)}
        </p>
        <h3
          className="font-display mt-3 text-3xl italic sm:text-4xl"
          style={{ color: INK }}
        >
          {s.name}
        </h3>
        <Flourish color={accent} className="mt-4" />
        {(dateStr || s.startTime) && (
          <p className="mt-4 text-xs tracking-[0.25em]" style={{ color: SEPIA, fontVariant: "small-caps" }}>
            {[dateStr, s.startTime].filter(Boolean).join(" · ")}
          </p>
        )}
        {s.venueName && (
          <p className="mt-2 text-sm italic" style={{ color: `${INK}b3` }}>
            at {s.venueName}
          </p>
        )}
        {s.description && (
          <p className="mx-auto mt-6 max-w-lg text-[15px] leading-[1.9]" style={{ color: `${INK}cc` }}>
            {s.description}
          </p>
        )}
        {s.dressCode && (
          <p
            className="mt-5 inline-block border px-4 py-1 text-[10px] uppercase"
            style={{ borderColor: `${SEPIA}66`, color: SEPIA, letterSpacing: "0.3em", fontVariant: "small-caps" }}
          >
            {s.dressCode}
          </p>
        )}
      </div>
    </motion.article>
  );
}

export const ChaptersTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || "#a68b5b";
  const tagline = event.tagline?.trim() || "A story written in years, read in a single evening.";
  const invitationMessage =
    event.invitationMessage?.trim() ||
    "Open the book. Turn each page slowly. What began as one chapter has become a library — and tonight we add another spine to the shelf.";
  const aboutStory =
    event.aboutStory?.trim() ||
    "We measure the years not in seasons but in small, luminous moments — a shared coffee at dawn, a whispered joke in a crowded room, the quiet weight of a hand held through a long night.";
  const heroImage =
    event.heroImageUrl ||
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80";

  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const sortedChapters = useMemo(() => [...subEvents].sort((a, b) => a.order - b.order), [subEvents]);

  const showStory = !event.hideStory;
  const showEvents = !event.hideEvents && sortedChapters.length > 0;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);
  const showVenue = !event.hideVenue;

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroTextY = useTransform(heroP, [0, 1], [0, -80]);
  const heroOpacity = useTransform(heroP, [0, 0.7], [1, 0]);

  const dateStr = event.mainDate
    ? new Date(event.mainDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
    : "";

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-sans antialiased"
      style={{ "--accent": accent, color: INK, background: PARCHMENT } as React.CSSProperties}
    >
      <ParchmentBackdrop />
      <ScrollProgress color={accent} />

      {/* HERO */}
      <section ref={heroRef} className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6">
        <div className="absolute inset-0">
          <HeroMedia imageSrc={heroImage} videoSrc={event.heroVideoUrl || undefined} alt={event.eventTitle} className="opacity-40" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${PARCHMENT}cc 0%, ${PARCHMENT}80 40%, ${PARCHMENT} 100%)` }} />
        </div>

        <motion.div style={reduce ? undefined : { y: heroTextY, opacity: heroOpacity }} className="relative z-10 max-w-4xl text-center">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE }}
            className="mb-6 text-[11px]"
            style={{ color: SEPIA, letterSpacing: "0.5em", fontVariant: "small-caps" }}
          >
            A memoir in chapters
          </motion.p>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: EASE }}
            className="font-display text-[clamp(3rem,10vw,7rem)] italic leading-[0.95]"
            style={{ color: INK }}
          >
            {event.eventTitle}
          </motion.h1>
          {(event.person1Name || event.person2Name) && (
            <motion.p
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="font-display mt-4 text-lg italic sm:text-xl"
              style={{ color: `${INK}b3` }}
            >
              {[event.person1Name, event.person2Name].filter(Boolean).join(" & ")}
            </motion.p>
          )}
          <Flourish color={accent} className="mt-8" />
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mx-auto mt-6 max-w-xl text-sm italic sm:text-base"
            style={{ color: `${INK}cc` }}
          >
            {tagline}
          </motion.p>
          {(dateStr || event.city) && (
            <motion.p
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="mt-10 text-[11px]"
              style={{ color: SEPIA, letterSpacing: "0.35em", fontVariant: "small-caps" }}
            >
              {[dateStr, event.city].filter(Boolean).join(" · ")}
            </motion.p>
          )}
        </motion.div>
      </section>

      {/* STORY — invitation + about, with constellation */}
      {showStory && (
        <section className="relative mx-auto max-w-3xl px-6 py-28 sm:py-36">
          <Constellation accent={accent} reduce={reduce} />
          <div className="relative">
            <motion.p
              initial={reduce ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-4 text-center text-[11px]"
              style={{ color: SEPIA, letterSpacing: "0.5em", fontVariant: "small-caps" }}
            >
              The Preface
            </motion.p>
            <motion.h2
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: EASE }}
              className="font-display text-center text-3xl italic sm:text-4xl"
              style={{ color: INK }}
            >
              An invitation
            </motion.h2>
            <Flourish color={accent} className="mt-6" />
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
              className="mt-10 text-[17px] leading-[2]"
              style={{ color: `${INK}e0` }}
            >
              <span
                className="font-display float-left mr-3 text-[5.5rem] leading-[0.8] italic"
                style={{ color: accent, marginTop: "0.35rem" }}
              >
                {invitationMessage.charAt(0)}
              </span>
              {invitationMessage.slice(1)}
            </motion.p>

            {aboutStory && (
              <motion.p
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
                className="mt-10 text-[15px] leading-[1.95] italic"
                style={{ color: `${INK}b3` }}
              >
                {aboutStory}
              </motion.p>
            )}
          </div>
        </section>
      )}

      {/* CHAPTERS */}
      {showEvents && (
        <section className="relative py-20 sm:py-28">
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <p className="text-[11px]" style={{ color: SEPIA, letterSpacing: "0.5em", fontVariant: "small-caps" }}>
              The Chronicles
            </p>
            <h2 className="font-display mt-3 text-3xl italic sm:text-4xl" style={{ color: INK }}>
              Years, in chapters
            </h2>
            <Flourish color={accent} className="mt-5" />
          </motion.div>
          <div className="px-6">
            {sortedChapters.map((s, i) => (
              <ChapterBlock key={`${s.order}-${i}`} s={s} index={i} accent={accent} />
            ))}
          </div>
        </section>
      )}

      {/* GALLERY — photo plates with sepia border */}
      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <div className="mb-12 text-center">
            <p className="text-[11px]" style={{ color: SEPIA, letterSpacing: "0.5em", fontVariant: "small-caps" }}>
              Plates & Portraits
            </p>
            <h2 className="font-display mt-3 text-3xl italic sm:text-4xl" style={{ color: INK }}>
              A small archive
            </h2>
            <Flourish color={accent} className="mt-5" />
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((m, i) => (
              <motion.figure
                key={`${m.fileName}-${i}`}
                initial={reduce ? false : { opacity: 0, y: 24, rotate: i % 2 === 0 ? -1 : 1 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true, margin: "-6% 0px" }}
                transition={{ duration: 0.8, delay: (i % 6) * 0.05, ease: EASE }}
                className="group relative p-3"
                style={{
                  background: "#faf3e0",
                  border: `1px solid ${SEPIA}55`,
                  boxShadow: `0 12px 30px -18px ${INK}66`,
                }}
              >
                <div className="overflow-hidden" style={{ border: `1px solid ${SEPIA}33` }}>
                  <img
                    src={m.publicUrl}
                    alt={m.caption ?? ""}
                    className="aspect-[4/5] w-full object-cover transition-all duration-[1200ms] group-hover:scale-[1.03]"
                    style={{ filter: "sepia(0.18) contrast(0.98)" }}
                    loading="lazy"
                  />
                </div>
                {m.caption && (
                  <figcaption
                    className="mt-3 text-center text-xs italic"
                    style={{ color: SEPIA, fontVariant: "small-caps", letterSpacing: "0.15em" }}
                  >
                    {m.caption}
                  </figcaption>
                )}
              </motion.figure>
            ))}
            {editing && galleryItems.length === 0 && (
              <div
                className="col-span-full flex h-48 items-center justify-center border border-dashed text-sm italic"
                style={{ borderColor: `${SEPIA}66`, color: SEPIA }}
              >
                + Add photos
              </div>
            )}
          </div>
        </section>
      )}

      {/* VENUE */}
      {showVenue && (event.venueName || event.venueAddress || event.mapLink) && (
        <section className="relative mx-auto max-w-5xl px-6 py-24 sm:py-32">
          <div className="mb-10 text-center">
            <p className="text-[11px]" style={{ color: SEPIA, letterSpacing: "0.5em", fontVariant: "small-caps" }}>
              The Setting
            </p>
            <h2 className="font-display mt-3 text-3xl italic sm:text-4xl" style={{ color: INK }}>
              Where the page turns
            </h2>
            <Flourish color={accent} className="mt-5" />
          </div>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE }}
            className="grid gap-8 sm:grid-cols-5"
          >
            <div className="sm:col-span-2">
              {event.venueName && (
                <p className="font-display text-2xl italic" style={{ color: INK }}>{event.venueName}</p>
              )}
              {event.venueAddress && (
                <p className="mt-3 text-sm leading-[1.9]" style={{ color: `${INK}b3` }}>{event.venueAddress}</p>
              )}
              {event.mapLink && (
                <a
                  href={event.mapLink}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-block border-b text-xs"
                  style={{ color: accent, borderColor: accent, letterSpacing: "0.3em", fontVariant: "small-caps" }}
                >
                  Get directions
                </a>
              )}
            </div>
            <div
              className="sm:col-span-3 overflow-hidden p-2"
              style={{ background: "#faf3e0", border: `1px solid ${SEPIA}55` }}
            >
              <MapEmbed
                latitude={event.latitude}
                longitude={event.longitude}
                venueName={event.venueName}
                venueAddress={event.venueAddress}
                mapLink={event.mapLink}
              />
            </div>
          </motion.div>
        </section>
      )}

      {/* CTA / RSVP */}
      <section className="relative px-6 py-28 text-center sm:py-40">
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: EASE }}
          className="mx-auto max-w-3xl"
        >
          <p className="text-[11px]" style={{ color: SEPIA, letterSpacing: "0.5em", fontVariant: "small-caps" }}>
            Epilogue
          </p>
          <h2 className="font-display mt-4 text-[clamp(2.5rem,7vw,5rem)] italic leading-[1]" style={{ color: INK }}>
            Turn the page with us
          </h2>
          <Flourish color={accent} className="mt-6" />
          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <a
              href={event.rsvpLinkOrContact}
              target="_blank"
              rel="noreferrer"
              className="mt-10 inline-block border px-10 py-4 text-xs transition-all hover:opacity-90"
              style={{
                borderColor: accent,
                color: accent,
                letterSpacing: "0.4em",
                fontVariant: "small-caps",
                background: "#faf3e0",
              }}
            >
              Reply to the invitation
            </a>
          )}
        </motion.div>
      </section>

      <footer className="border-t py-10 text-center text-xs italic" style={{ borderColor: `${SEPIA}33`, color: SEPIA }}>
        <p>
          {event.eventTitle}
          {event.person1Name ? ` · ${event.person1Name}` : ""}
          {event.person2Name ? ` & ${event.person2Name}` : ""}
        </p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default ChaptersTemplate;
