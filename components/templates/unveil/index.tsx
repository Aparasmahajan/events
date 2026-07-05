"use client";

import { useMemo, useRef } from "react";
import {
  motion,
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

const EASE = [0.16, 1, 0.3, 1] as const;
const INK = "#f5f2ea";
const GUN = "#111114";

function KeynoteLine({ accent }: { accent: string }) {
  const { scrollYProgress } = useScroll();
  const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed left-6 top-0 z-20 hidden h-screen w-px sm:block"
      style={{ background: "rgba(255,255,255,0.04)" }}
    >
      <motion.div
        className="w-full origin-top"
        style={{ height, background: accent, boxShadow: `0 0 12px ${accent}` }}
      />
    </div>
  );
}

function Spotlight({ reduce, accent }: { reduce: boolean; accent: string }) {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      {!reduce && (
        <motion.div
          className="absolute inset-y-0 w-[70vw]"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(245,242,234,0.14), rgba(245,242,234,0.03) 40%, transparent 70%)",
            filter: "blur(20px)",
          }}
          initial={{ x: "-40vw" }}
          animate={{ x: ["-40vw", "110vw"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 90%, ${accent}22, transparent 55%)`,
        }}
      />
    </div>
  );
}

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, filter: "blur(8px)", y: 12 }}
      whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1.1, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({ text, accent }: { text: string; accent: string }) {
  return (
    <Reveal>
      <p
        className="mb-8 text-[10px] uppercase tracking-[0.5em]"
        style={{ color: accent }}
      >
        {text}
      </p>
    </Reveal>
  );
}

function KeynoteAgenda({ items, accent }: { items: SubEvent[]; accent: string }) {
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <ol className="mx-auto max-w-3xl space-y-px">
      {sorted.map((s, i) => (
        <Reveal key={s.order} delay={i * 0.08}>
          <li
            className="grid grid-cols-[auto_1fr_auto] items-baseline gap-6 border-t border-white/[0.06] py-8 last:border-b"
          >
            <span
              className="font-display text-3xl font-black tabular-nums"
              style={{ color: accent }}
            >
              {String(s.order).padStart(2, "0")}
            </span>
            <div>
              <h3 className="font-display text-2xl font-black uppercase tracking-tight sm:text-3xl">
                {s.name}
              </h3>
              {s.venueName && (
                <p className="mt-1 text-xs uppercase tracking-[0.3em] opacity-50">
                  {s.venueName}
                </p>
              )}
              {s.description && (
                <p className="mt-3 max-w-xl text-sm leading-relaxed opacity-60">
                  {s.description}
                </p>
              )}
              {s.dressCode && (
                <p className="mt-3 text-[10px] uppercase tracking-[0.35em] opacity-40">
                  Dress {s.dressCode}
                </p>
              )}
            </div>
            <span className="text-right text-[10px] uppercase tracking-[0.3em] opacity-60">
              {[s.date, s.startTime].filter(Boolean).join(" · ")}
            </span>
          </li>
        </Reveal>
      ))}
    </ol>
  );
}

export const UnveilTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || "#ff2d55";
  const tagline = event.tagline?.trim() || "Something new is about to be revealed.";
  const invitationMessage =
    event.invitationMessage?.trim() ||
    "In a moment, the lights come up. Until then, hold the silence.";
  const aboutStory = event.aboutStory?.trim() || "";
  const hero =
    event.heroImageUrl ||
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1800&q=80";
  const galleryItems = useMemo(
    () => media.filter((m) => m.section === "gallery"),
    [media]
  );

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(heroP, [0, 0.6], [1, 0]);
  const heroY = useTransform(heroP, [0, 1], [0, -80]);

  const showStory = !event.hideStory;
  const showEvents = !event.hideEvents && subEvents.length > 0;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);
  const showVenue = !event.hideVenue;

  return (
    <div
      className="relative min-h-screen overflow-x-clip bg-black font-sans antialiased"
      style={{ "--accent": accent, color: INK, background: "#000000" } as React.CSSProperties}
    >
      <ScrollProgress color={accent} />
      <KeynoteLine accent={accent} />

      {/* ─── 01. HERO — silence before the reveal ─── */}
      <section
        ref={heroRef}
        className="relative flex h-[100svh] min-h-[640px] items-end overflow-hidden"
      >
        <div className="absolute inset-0">
          <HeroMedia
            imageSrc={hero}
            videoSrc={event.heroVideoUrl || undefined}
            alt={event.eventTitle}
            className="opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
        </div>
        <Spotlight reduce={reduce} accent={accent} />

        <motion.div
          style={reduce ? undefined : { opacity: heroOpacity, y: heroY }}
          className="relative z-10 mx-auto w-full max-w-[90vw] px-6 pb-20 sm:pb-28"
        >
          <Reveal>
            <p
              className="mb-8 text-[10px] uppercase tracking-[0.5em]"
              style={{ color: accent }}
            >
              {tagline}
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <h1 className="font-display text-[clamp(3rem,14vw,11rem)] font-black uppercase leading-[0.86] tracking-[-0.02em]">
              {event.eventTitle}
            </h1>
          </Reveal>
          <Reveal delay={0.5}>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.4em] opacity-70">
              {event.mainDate && (
                <span>
                  {new Date(event.mainDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              )}
              {event.mainStartTime && <span className="opacity-40">|</span>}
              {event.mainStartTime && <span>{event.mainStartTime}</span>}
              {event.city && <span className="opacity-40">|</span>}
              {event.city && <span>{event.city}</span>}
            </div>
          </Reveal>
        </motion.div>
      </section>

      {/* ─── 02. STORY — the thesis ─── */}
      {showStory && (
        <section className="relative mx-auto max-w-5xl px-6 py-32 sm:py-48">
          <SectionLabel text="The Announcement" accent={accent} />
          <Reveal delay={0.15}>
            <p className="font-display text-[clamp(1.75rem,4.5vw,3.5rem)] font-black uppercase leading-[1.02] tracking-tight">
              {invitationMessage}
            </p>
          </Reveal>
          {aboutStory && (
            <Reveal delay={0.35}>
              <p className="mt-14 max-w-2xl text-base leading-relaxed opacity-60 sm:text-lg">
                {aboutStory}
              </p>
            </Reveal>
          )}
        </section>
      )}

      {/* ─── 03. THE EVENING — agenda ─── */}
      {showEvents && (
        <section className="relative px-6 py-28 sm:py-40" style={{ background: GUN }}>
          <div className="mx-auto max-w-5xl">
            <SectionLabel text="The Evening" accent={accent} />
            <KeynoteAgenda items={subEvents} accent={accent} />
          </div>
        </section>
      )}

      {/* ─── 04. GALLERY ─── */}
      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-28 sm:py-40">
          <SectionLabel text="Frames" accent={accent} />
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((m, i) => (
              <Reveal key={`${m.fileName}-${i}`} delay={i * 0.05}>
                <div className="group relative overflow-hidden">
                  <img
                    src={m.publicUrl}
                    alt={m.caption ?? ""}
                    loading="lazy"
                    className="aspect-[4/5] w-full object-cover grayscale transition-all duration-[1200ms] group-hover:grayscale-0 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-black/30 transition-opacity duration-700 group-hover:opacity-0" />
                </div>
              </Reveal>
            ))}
            {editing && galleryItems.length === 0 && (
              <div className="col-span-full flex h-48 items-center justify-center border border-dashed border-white/20 text-sm opacity-50">
                + Add photos
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── 05. VENUE ─── */}
      {showVenue && (
        <section className="relative mx-auto max-w-5xl px-6 py-28 sm:py-40">
          <SectionLabel text="The Venue" accent={accent} />
          <div className="grid gap-8 sm:grid-cols-[1fr_1.4fr]">
            <Reveal>
              <div>
                {event.venueName && (
                  <h3 className="font-display text-2xl font-black uppercase tracking-tight sm:text-3xl">
                    {event.venueName}
                  </h3>
                )}
                {event.venueAddress && (
                  <p className="mt-4 max-w-sm text-sm leading-relaxed opacity-60">
                    {event.venueAddress}
                  </p>
                )}
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="overflow-hidden border border-white/[0.06]" style={{ background: GUN }}>
                <MapEmbed
                  latitude={event.latitude}
                  longitude={event.longitude}
                  venueName={event.venueName}
                  venueAddress={event.venueAddress}
                  mapLink={event.mapLink}
                />
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* ─── 06. RSVP — secure your seat ─── */}
      <section className="relative px-6 py-32 text-center sm:py-48">
        <Reveal>
          <p className="mb-8 text-[10px] uppercase tracking-[0.5em]" style={{ color: accent }}>
            Reserved Seating
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <h2 className="mx-auto max-w-3xl font-display text-[clamp(2rem,6vw,4.5rem)] font-black uppercase leading-[0.95] tracking-tight">
            {event.eventTitle}
          </h2>
        </Reveal>
        {event.person1Name && (
          <Reveal delay={0.25}>
            <p className="mt-5 text-xs uppercase tracking-[0.5em] opacity-60">
              {event.person1Name}
            </p>
          </Reveal>
        )}
        {event.rsvpEnabled && event.rsvpLinkOrContact && (
          <Reveal delay={0.4}>
            <motion.a
              whileHover={reduce ? undefined : { scale: 1.02 }}
              whileTap={reduce ? undefined : { scale: 0.98 }}
              href={event.rsvpLinkOrContact}
              target="_blank"
              rel="noreferrer"
              className="mt-12 inline-block px-14 py-5 text-xs uppercase tracking-[0.5em] transition-all"
              style={{ background: accent, color: "#000000" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 0 60px ${accent}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Secure your seat
            </motion.a>
          </Reveal>
        )}
      </section>

      <footer className="border-t border-white/[0.06] px-6 py-10 text-center text-[10px] uppercase tracking-[0.4em] opacity-40">
        <p>
          {event.eventTitle}
          {event.person1Name ? ` · ${event.person1Name}` : ""}
        </p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default UnveilTemplate;
