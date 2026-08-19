"use client";

import type { TemplateComponent, SubEvent } from "@/lib/types";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { useRef } from "react";
import { HeroMedia } from "@/components/ui/HeroMedia";
import { MapEmbed } from "@/components/ui/MapEmbed";
import { RSVP } from "@/components/ui/RSVP";
import { MusicToggle } from "@/components/ui/MusicToggle";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { EditableImage } from "@/components/edit/EditableImage";
import { useEditMode } from "@/components/edit/EditContext";
import { timefractureMeta } from "@/components/templates/metadata";

const defaults = timefractureMeta.defaults;

const EASE = [0.16, 1, 0.3, 1] as const;

// Angular shard definitions for the hero fracture. Each piece is a clip-path
// polygon of the SAME hero image, offset/rotated/blurred until it "assembles".
type Shard = {
  clip: string;
  x: number;
  y: number;
  rotate: number;
  blur: number;
};

const HERO_SHARDS: Shard[] = [
  { clip: "polygon(0% 0%, 52% 0%, 40% 46%, 0% 60%)", x: -120, y: -80, rotate: -14, blur: 10 },
  { clip: "polygon(52% 0%, 100% 0%, 100% 38%, 40% 46%)", x: 140, y: -70, rotate: 12, blur: 12 },
  { clip: "polygon(0% 60%, 40% 46%, 46% 100%, 0% 100%)", x: -110, y: 110, rotate: 10, blur: 9 },
  { clip: "polygon(40% 46%, 100% 38%, 100% 74%, 62% 70%)", x: 130, y: 40, rotate: -9, blur: 11 },
  { clip: "polygon(46% 100%, 62% 70%, 100% 74%, 100% 100%)", x: 90, y: 130, rotate: 8, blur: 10 },
  { clip: "polygon(40% 46%, 62% 70%, 46% 100%)", x: -30, y: 90, rotate: -6, blur: 8 },
];

// Eras that tint the page as time is repaired.
// A cohesive deep-purple progression — indigo → violet → royal → plum (the
// wedding, the richest note) → settling back to violet. All kept dark for
// strong contrast against the amber/gold/white type.
const ERAS = [
  { key: "childhood", label: "Childhood", tint: "rgba(24, 20, 55, 0.62)" },
  { key: "proposal", label: "The Proposal", tint: "rgba(43, 26, 71, 0.72)" },
  { key: "engagement", label: "The Engagement", tint: "rgba(58, 30, 84, 0.70)" },
  { key: "wedding", label: "The Wedding", tint: "rgba(78, 38, 100, 0.66)" },
  { key: "forever", label: "Forever", tint: "rgba(48, 28, 78, 0.70)" },
] as const;

function formatEventDate(value?: string | null): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export const TimeFractureTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const accent = event.themeAccentColor || defaults.accentColor;
  const hero = event.heroImageUrl || defaults.heroImage;
  const tagline = event.tagline?.trim() || defaults.tagline;
  const invitationMessage = event.invitationMessage?.trim() || defaults.invitationMessage;
  const aboutStory = event.aboutStory?.trim() || defaults.aboutStory || "";
  const galleryItems = media.filter((m) => m.section === "gallery");

  const editing = !!useEditMode()?.enabled;
  const reduce = useReducedMotion();

  const heroRef = useRef<HTMLElement | null>(null);
  const pageRef = useRef<HTMLDivElement | null>(null);

  // Hero assembly progress: 0 = whole (assembled), 1 = scattered as we scroll away.
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  // As the hero leaves, the assembled image shatters + fades away.
  const shardsOpacity = useTransform(heroProgress, [0, 0.7, 1], [1, 1, 0]);
  const shardsScale = useTransform(heroProgress, [0, 1], [1, 1.15]);

  // Whole-page era progress drives the morphing sky.
  const { scrollYProgress: pageProgress } = useScroll({
    target: pageRef,
    offset: ["start start", "end end"],
  });
  const smoothPage = useSpring(pageProgress, { stiffness: 60, damping: 20, mass: 0.6 });

  // Morphing sky: day -> sunset -> night -> sunrise across stacked layers.
  const dayOpacity = useTransform(smoothPage, [0, 0.25, 0.55], [1, 0.4, 0]);
  const sunsetOpacity = useTransform(smoothPage, [0.15, 0.4, 0.65], [0, 1, 0.2]);
  const nightOpacity = useTransform(smoothPage, [0.45, 0.7, 0.85], [0, 1, 0.5]);
  const dawnOpacity = useTransform(smoothPage, [0.75, 1], [0, 1]);

  const sortedEvents: SubEvent[] = [...subEvents].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  );

  const showStory = !event.hideStory;
  const showEvents = !event.hideEvents && sortedEvents.length > 0;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);
  const showVenue = !event.hideVenue;
  const showRsvp = event.rsvpEnabled;

  return (
    <div
      ref={pageRef}
      className="relative min-h-[100svh] overflow-x-clip bg-[#0b0a1f] font-sans text-amber-50 selection:bg-[var(--accent)] selection:text-black"
      style={{ "--accent": accent } as React.CSSProperties}
    >
      <ScrollProgress color="var(--accent)" />
      <MusicToggle src={event.backgroundMusicUrl} />

      {/* ===== Morphing era sky (fixed, full-screen) ===== */}
      {reduce ? (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-10"
          style={{
            background:
              "linear-gradient(180deg, #14122e 0%, #2b1a47 42%, #3e1f5c 72%, #241436 100%)",
          }}
        />
      ) : (
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
          <motion.div
            className="absolute inset-0"
            style={{
              opacity: dayOpacity,
              background:
                "linear-gradient(180deg, #bfe3ff 0%, #eaf6ff 55%, #fff6e6 100%)",
            }}
          />
          <motion.div
            className="absolute inset-0"
            style={{
              opacity: sunsetOpacity,
              background:
                "linear-gradient(180deg, #4c1d5a 0%, #b23a48 45%, #f39237 80%, #ffd27f 100%)",
            }}
          />
          <motion.div
            className="absolute inset-0"
            style={{
              opacity: nightOpacity,
              background:
                "radial-gradient(120% 90% at 70% 15%, #2a2660 0%, #0b0a1f 60%, #05040f 100%)",
            }}
          />
          <motion.div
            className="absolute inset-0"
            style={{
              opacity: dawnOpacity,
              background:
                "linear-gradient(180deg, #2c2350 0%, #7a5a7f 40%, #e8a06a 75%, #f6e3c5 100%)",
            }}
          />
        </div>
      )}

      {/* ===== HERO — the couple in scattered fragments that assemble ===== */}
      <section
        ref={heroRef}
        className="relative flex min-h-[100svh] flex-col items-center justify-center px-4 pb-28 pt-20 text-center"
      >
        {/* Ambient full-bleed hero — fills the wide-desktop margins so the
            fractured card never floats in an empty navy sea. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <img src={hero} alt="" className="h-full w-full scale-125 object-cover opacity-20 blur-3xl" />
          <div className="absolute inset-0" style={{ background: "rgba(11,10,31,0.6)" }} />
        </div>

        <div className="relative z-10 mx-auto aspect-[4/5] w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
          {/* Base whole image (assembled state / reduced-motion fallback) */}
          <div className="absolute inset-0 overflow-hidden rounded-[2rem] ring-1 ring-white/10 shadow-2xl">
            <HeroMedia
              imageSrc={hero}
              videoSrc={event.heroVideoUrl || undefined}
              alt={event.eventTitle}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Fracture shards layered on top; each starts scattered and
              assembles on load. As the hero scrolls away, the whole layer
              shatters + fades via scroll-driven values (no per-shard hooks). */}
          {!reduce && (
            <motion.div
              aria-hidden
              className="absolute inset-0 will-change-transform"
              style={{ opacity: shardsOpacity, scale: shardsScale }}
            >
              {HERO_SHARDS.map((s, i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 will-change-transform"
                  initial={{ x: s.x, y: s.y, rotate: s.rotate, opacity: 0.9, filter: `blur(${s.blur}px)` }}
                  animate={{ x: 0, y: 0, rotate: 0, opacity: 1, filter: "blur(0px)" }}
                  transition={{ duration: 1.4, delay: 0.08 * i, ease: EASE }}
                >
                  <div
                    className="absolute inset-0 overflow-hidden rounded-[2rem]"
                    style={{ clipPath: s.clip }}
                  >
                    <Image
                      src={hero}
                      alt=""
                      fill
                      priority
                      sizes="(max-width: 640px) 90vw, 40vw"
                      className="object-cover"
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Fracture seams */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[2rem] mix-blend-overlay"
            style={{
              background:
                "conic-gradient(from 210deg at 45% 46%, transparent, rgba(255,255,255,0.12) 20%, transparent 40%, rgba(0,0,0,0.15) 70%, transparent)",
            }}
          />
        </div>

        <motion.div
          className="relative z-10 mt-10"
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9, ease: EASE }}
        >
          <p className="font-script text-2xl text-[var(--accent)] sm:text-3xl">
            {tagline}
          </p>
          <h1 className="mt-3 font-display text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl md:text-7xl">
            {event.eventTitle}
          </h1>
          <p className="mx-auto mt-5 max-w-xl font-serif text-base text-amber-100/80 sm:text-lg">
            {invitationMessage}
          </p>
        </motion.div>
      </section>

      {/* ===== STORY — era: The Proposal ===== */}
      {showStory && (
        <EraSection era={ERAS[1]} reduce={reduce}>
          <div className="mx-auto max-w-3xl text-center">
            <EraLabel>{ERAS[1].label}</EraLabel>
            <h2 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
              Our Story
            </h2>
            {aboutStory && (
              <p className="mx-auto mt-8 max-w-2xl whitespace-pre-line font-serif text-lg leading-relaxed text-amber-100/85">
                {aboutStory}
              </p>
            )}
          </div>
        </EraSection>
      )}

      {/* ===== EVENTS — era: The Engagement — coiled SPIRAL timeline ===== */}
      {showEvents && (
        <EraSection era={ERAS[2]} reduce={reduce}>
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <EraLabel>{ERAS[2].label}</EraLabel>
              <h2 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
                The Timeline Uncoils
              </h2>
            </div>

            <ol className="relative mx-auto mt-14 flex max-w-md flex-col gap-6 md:mt-16">
              {sortedEvents.map((se, i) => {
                return (
                  <motion.li
                    key={`${se.order}-${i}`}
                    className="w-full"
                    initial={reduce ? false : { opacity: 0, y: 24 }}
                    animate={reduce ? undefined : { opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: EASE, delay: Math.min(i * 0.12, 0.6) }}
                  >
                    <div className="rounded-2xl border border-white/12 bg-white/5 p-5 backdrop-blur-sm">
                      <div className="flex items-center gap-2 text-[var(--accent)]">
                        {se.icon && <span aria-hidden className="text-lg">{se.icon}</span>}
                        <h3 className="font-display text-xl font-semibold text-amber-50">
                          {se.name}
                        </h3>
                      </div>
                      {(se.date || se.startTime || se.endTime) && (
                        <p className="mt-2 font-serif text-sm text-amber-100/80">
                          {formatEventDate(se.date)}
                          {(se.startTime || se.endTime) && (
                            <>
                              {" · "}
                              {se.startTime}
                              {se.endTime ? ` – ${se.endTime}` : ""}
                            </>
                          )}
                        </p>
                      )}
                      {(se.venueName || se.venueAddress) && (
                        <p className="mt-1 text-sm text-amber-100/70">
                          {se.venueName}
                          {se.venueName && se.venueAddress ? ", " : ""}
                          {se.venueAddress}
                        </p>
                      )}
                      {se.dressCode && (
                        <p className="mt-2 text-xs uppercase tracking-widest text-[var(--accent)]">
                          Dress: {se.dressCode}
                        </p>
                      )}
                      {se.description && (
                        <p className="mt-3 font-serif text-sm leading-relaxed text-amber-100/75">
                          {se.description}
                        </p>
                      )}
                    </div>
                  </motion.li>
                );
              })}
            </ol>
          </div>
        </EraSection>
      )}

      {/* ===== GALLERY — era: The Wedding — photos assemble from fragments ===== */}
      {showGallery && (
        <EraSection era={ERAS[3]} reduce={reduce}>
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <EraLabel>{ERAS[3].label}</EraLabel>
              <h2 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
                Moments, Reassembled
              </h2>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4">
              {galleryItems.length > 0
                ? galleryItems.map((m, i) => (
                    <motion.div
                      key={m.driveFileId ?? m.fileName ?? i}
                      className="relative aspect-square overflow-hidden rounded-xl ring-1 ring-white/10 will-change-transform"
                      initial={reduce ? false : { opacity: 0, scale: 0.92, rotate: i % 2 ? 4 : -4 }}
                      animate={reduce ? undefined : { opacity: 1, scale: 1, rotate: 0 }}
                      transition={{ duration: 0.7, ease: EASE, delay: Math.min(i * 0.08, 0.5) }}
                    >
                      <EditableImage
                        section="gallery"
                        src={m.publicUrl}
                        replaceAssetId={m.driveFileId}
                        alt={m.caption || `Gallery photo ${i + 1}`}
                        fill
                        sizes="(max-width: 640px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </motion.div>
                  ))
                : editing && (
                    <div className="relative aspect-square overflow-hidden rounded-xl ring-1 ring-white/10">
                      <EditableImage section="gallery" src="" asAddTile alt="" />
                    </div>
                  )}
            </div>
          </div>
        </EraSection>
      )}

      {/* ===== VENUE — era: Forever ===== */}
      {showVenue && (
        <EraSection era={ERAS[4]} reduce={reduce}>
          <div className="mx-auto max-w-4xl text-center">
            <EraLabel>{ERAS[4].label}</EraLabel>
            <h2 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
              Where Time Stops
            </h2>
            {(event.venueName || event.venueAddress) && (
              <p className="mt-6 font-serif text-lg text-amber-100/85">
                {event.venueName}
                {event.venueName && event.venueAddress ? " · " : ""}
                {event.venueAddress}
              </p>
            )}
            <div className="mt-10 overflow-hidden rounded-2xl ring-1 ring-white/10">
              <MapEmbed
                latitude={event.latitude}
                longitude={event.longitude}
                venueName={event.venueName}
                venueAddress={event.venueAddress}
                mapLink={event.mapLink}
              />
            </div>
          </div>
        </EraSection>
      )}

      {/* ===== RSVP ===== */}
      {showRsvp && (
        <section className="relative px-4 py-24">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="font-display text-4xl font-bold sm:text-5xl">
              Join Us in Forever
            </h2>
            <div className="mt-8">
              <RSVP
                enabled={event.rsvpEnabled}
                linkOrContact={event.rsvpLinkOrContact}
                contactName={event.contactName}
              />
            </div>
          </div>
        </section>
      )}

      {/* ===== Footer ===== */}
      <footer className="relative px-4 py-12 text-center">
        <p className="font-script text-2xl text-[var(--accent)]">{event.eventTitle}</p>
        <p className="mt-2 text-xs uppercase tracking-[0.3em] text-amber-100/50">
          Time, repaired
        </p>
      </footer>
    </div>
  );
};

/* ---------- Local presentational helpers ---------- */

function EraLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block font-script text-2xl text-[var(--accent)] sm:text-3xl">
      {children}
    </span>
  );
}

function EraSection({
  era,
  reduce,
  children,
}: {
  era: (typeof ERAS)[number];
  reduce: boolean | null;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      className="relative px-4 py-24 md:py-32"
      style={{ backgroundColor: era.tint }}
      // Reveal on mount (not whileInView) — the scroll-triggered variant proved
      // unreliable on this page and left whole sections invisible. This always
      // shows the content.
      initial={reduce ? false : { opacity: 0, y: 40 }}
      animate={reduce ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: EASE }}
    >
      {children}
    </motion.section>
  );
}

export default TimeFractureTemplate;
