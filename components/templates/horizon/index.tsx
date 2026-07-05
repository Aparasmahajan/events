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

const SKY_STOPS = [
  "linear-gradient(180deg, #ffcc99 0%, #ff8b6a 45%, #c66aa3 75%, #5e4785 100%)",
  "linear-gradient(180deg, #f0a878 0%, #d97a70 45%, #a05a92 75%, #4a3a70 100%)",
  "linear-gradient(180deg, #8a6a80 0%, #6a5578 45%, #4a4470 75%, #2a2e58 100%)",
  "linear-gradient(180deg, #3a3560 0%, #2a2a50 45%, #22254a 75%, #1e2440 100%)",
];

function HorizonSilhouette({ opacity = 1, flip = false }: { opacity?: number; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 1440 200"
      preserveAspectRatio="none"
      className="absolute inset-x-0 h-[200px] w-full"
      style={{
        opacity,
        transform: flip ? "scaleY(-1)" : undefined,
      }}
      aria-hidden
    >
      <path
        d="M0,120 C120,80 240,140 360,110 C480,80 600,150 720,120 C840,90 960,150 1080,115 C1200,80 1320,140 1440,110 L1440,200 L0,200 Z"
        fill="#1a1428"
      />
      <path
        d="M0,150 C180,130 320,170 500,145 C680,120 820,175 1000,150 C1180,125 1320,170 1440,145 L1440,200 L0,200 Z"
        fill="#0f0a1e"
      />
    </svg>
  );
}

function ReflectedPhoto({
  src,
  alt,
  index,
  reduce,
}: {
  src: string;
  alt: string;
  index: number;
  reduce: boolean;
}) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.9, delay: index * 0.06, ease: EASE }}
      className="relative"
    >
      <div className="overflow-hidden rounded-sm shadow-[0_20px_50px_-15px_rgba(30,36,64,0.6)]">
        <img
          src={src}
          alt={alt}
          className="aspect-[4/5] w-full object-cover"
          loading="lazy"
        />
      </div>
      <div
        aria-hidden
        className="mt-[2px] overflow-hidden rounded-sm"
        style={{
          transform: "scaleY(-1)",
          opacity: 0.3,
          maskImage: "linear-gradient(180deg, rgba(0,0,0,0.7), transparent 90%)",
          WebkitMaskImage: "linear-gradient(180deg, rgba(0,0,0,0.7), transparent 90%)",
          filter: "blur(1px)",
        }}
      >
        <img
          src={src}
          alt=""
          className="aspect-[4/5] w-full object-cover"
          loading="lazy"
        />
      </div>
    </motion.div>
  );
}

function HorizonAgenda({ items, accent }: { items: SubEvent[]; accent: string }) {
  const reduce = useReducedMotion();
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <div className="mx-auto max-w-4xl px-6">
      <ol className="relative space-y-10 border-l border-[color:var(--accent)]/40 pl-8">
        {sorted.map((s, i) => (
          <motion.li
            key={s.order}
            initial={reduce ? false : { opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
            className="relative"
          >
            <span
              className="absolute -left-[41px] top-1 flex h-5 w-5 items-center justify-center rounded-full"
              style={{ background: accent, boxShadow: `0 0 24px ${accent}` }}
              aria-hidden
            />
            <p className="text-[11px] uppercase tracking-[0.35em] text-[#e8a86a]">
              {[s.date, s.startTime].filter(Boolean).join(" · ")}
            </p>
            <h3 className="mt-1 font-display text-2xl italic text-[#faf3e8]">{s.name}</h3>
            {s.venueName && (
              <p className="mt-1 text-sm text-[#faf3e8]/70">{s.venueName}</p>
            )}
            {s.description && (
              <p className="mt-2 text-sm leading-relaxed text-[#faf3e8]/60">{s.description}</p>
            )}
            {s.dressCode && (
              <p className="mt-3 inline-block rounded-full border border-[#e8a86a]/50 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-[#e8a86a]">
                {s.dressCode}
              </p>
            )}
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

export const HorizonTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || "#e8a86a";
  const tagline = event.tagline?.trim() || "As the sun sets, forever begins.";
  const invitationMessage =
    event.invitationMessage?.trim() ||
    "Where the sky meets the water, two lives meet the horizon. Come watch the light change with us.";
  const aboutStory = event.aboutStory?.trim() || "";
  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const hero =
    event.heroImageUrl ||
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1800&q=80";

  const pageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: pageRef, offset: ["start start", "end end"] });

  const skyGradient = useTransform(scrollYProgress, [0, 0.33, 0.66, 1], SKY_STOPS);
  const sunY = useTransform(scrollYProgress, [0, 0.5], ["10%", "72%"]);
  const sunOpacity = useTransform(scrollYProgress, [0, 0.4, 0.6], [1, 0.7, 0]);
  const twilightVeil = useTransform(scrollYProgress, [0.3, 1], [0, 0.8]);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroTextY = useTransform(heroP, [0, 1], [0, -80]);
  const heroTextOpacity = useTransform(heroP, [0, 0.7], [1, 0]);

  const showStory = !event.hideStory;
  const showAgenda = !event.hideEvents && subEvents.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  return (
    <div
      ref={pageRef}
      className="relative min-h-screen overflow-x-clip font-sans text-[#faf3e8] antialiased"
      style={{ "--accent": accent } as React.CSSProperties}
    >
      <motion.div
        aria-hidden
        className="fixed inset-0 -z-20"
        style={reduce ? { background: SKY_STOPS[0] } : { background: skyGradient }}
      />
      <motion.div
        aria-hidden
        className="fixed inset-0 -z-10"
        style={{ background: "#1e2440", opacity: reduce ? 0 : twilightVeil }}
      />

      <ScrollProgress color={accent} />

      {/* ─── 01. HORIZON ─── */}
      <section ref={heroRef} className="relative h-[100svh] min-h-[640px] overflow-hidden">
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-1/2 h-[42vh] w-[42vh] -translate-x-1/2 rounded-full"
          style={{
            top: reduce ? "40%" : sunY,
            opacity: reduce ? 1 : sunOpacity,
            background:
              "radial-gradient(circle, #fff2d6 0%, #ffcc99 25%, #ff8b6a 55%, rgba(255,139,106,0) 72%)",
            filter: "blur(2px)",
          }}
        />

        <div
          aria-hidden
          className="absolute inset-x-0"
          style={{ top: "60%", height: "1px", background: `linear-gradient(90deg, transparent, ${accent}, transparent)`, opacity: 0.7 }}
        />

        <div className="absolute inset-x-0" style={{ top: "60%", height: "40%" }}>
          <HorizonSilhouette opacity={0.95} />
        </div>

        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0"
          style={{
            height: "18%",
            background:
              "linear-gradient(180deg, rgba(94,71,133,0.2), rgba(30,36,64,0.9))",
          }}
        >
          <div className="absolute inset-x-0 top-0" style={{ opacity: 0.3 }}>
            <HorizonSilhouette opacity={1} flip />
          </div>
        </div>

        <div className="absolute inset-0 opacity-30 mix-blend-overlay">
          <HeroMedia
            imageSrc={hero}
            videoSrc={event.heroVideoUrl || undefined}
            alt={event.eventTitle}
            className=""
          />
        </div>

        <motion.div
          style={reduce ? undefined : { y: heroTextY, opacity: heroTextOpacity }}
          className="relative z-10 flex h-full flex-col items-center justify-center px-5 text-center"
        >
          <p
            className="mb-4 text-[11px] uppercase tracking-[0.6em]"
            style={{ color: "#faf3e8", textShadow: "0 2px 20px rgba(30,36,64,0.5)" }}
          >
            {tagline}
          </p>
          <h1
            className="font-display text-[clamp(2.8rem,10vw,7.5rem)] font-light italic leading-[0.95] tracking-tight"
            style={{ color: "#faf3e8", textShadow: "0 4px 40px rgba(30,36,64,0.4)" }}
          >
            {event.eventTitle}
          </h1>
          {(event.person1Name || event.person2Name) && (
            <p className="mt-4 text-lg tracking-[0.3em] text-[#faf3e8]/90">
              {event.person1Name}
              {event.person1Name && event.person2Name && <span className="mx-3 text-[#e8a86a]">&</span>}
              {event.person2Name}
            </p>
          )}
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-xs uppercase tracking-[0.4em] text-[#faf3e8]/85">
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
            {event.city && (
              <>
                <span className="opacity-60">·</span>
                <span>{event.city}</span>
              </>
            )}
          </div>
        </motion.div>
      </section>

      {/* ─── 02. INVITATION (silhouettes) ─── */}
      {showStory && (
        <section className="relative px-6 py-32 sm:py-40">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-40 -translate-y-full opacity-70"
          >
            <HorizonSilhouette opacity={0.9} />
          </div>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 1.1, ease: EASE }}
            className="mx-auto max-w-3xl text-center"
          >
            <p className="text-[11px] uppercase tracking-[0.5em]" style={{ color: accent }}>
              An Invitation
            </p>
            <p className="mt-6 font-display text-3xl italic leading-[1.35] text-[#faf3e8] sm:text-4xl">
              &ldquo;{invitationMessage}&rdquo;
            </p>
            {aboutStory && (
              <p className="mt-10 text-base leading-relaxed text-[#faf3e8]/75 sm:text-lg">
                {aboutStory}
              </p>
            )}
            <motion.div
              aria-hidden
              className="mx-auto mt-10 h-px w-40"
              style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
              animate={reduce ? undefined : { opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </section>
      )}

      {/* ─── 03. SUB-EVENTS ─── */}
      {showAgenda && (
        <section className="relative px-6 py-24 sm:py-32">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-14 text-center text-[11px] uppercase tracking-[0.5em]"
            style={{ color: accent }}
          >
            The Day Unfolds
          </motion.p>
          <HorizonAgenda items={subEvents} accent={accent} />
        </section>
      )}

      {/* ─── 04. GALLERY (reflected) ─── */}
      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-12 text-center text-[11px] uppercase tracking-[0.5em]"
            style={{ color: accent }}
          >
            Reflections
          </motion.p>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((m, i) => (
              <ReflectedPhoto
                key={`${m.fileName}-${i}`}
                src={m.publicUrl}
                alt={m.caption ?? ""}
                index={i}
                reduce={reduce}
              />
            ))}
            {editing && galleryItems.length === 0 && (
              <div className="col-span-full flex h-56 items-center justify-center rounded-sm border border-dashed border-[#faf3e8]/30 text-sm text-[#faf3e8]/60">
                + Add photos
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── 05. VENUE ─── */}
      {showVenue && (
        <section className="relative mx-auto max-w-5xl px-6 py-24 sm:py-32">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-4 text-center text-[11px] uppercase tracking-[0.5em]"
            style={{ color: accent }}
          >
            Where We Gather
          </motion.p>
          {event.venueName && (
            <h3 className="text-center font-display text-3xl italic text-[#faf3e8]">
              {event.venueName}
            </h3>
          )}
          {event.venueAddress && (
            <p className="mt-2 text-center text-sm tracking-[0.15em] text-[#faf3e8]/70">
              {event.venueAddress}
            </p>
          )}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE }}
            className="mt-8 overflow-hidden rounded-sm border border-[#e8a86a]/25 bg-[#1e2440]/40 p-1 backdrop-blur-xl"
          >
            <MapEmbed
              latitude={event.latitude}
              longitude={event.longitude}
              venueName={event.venueName}
              venueAddress={event.venueAddress}
              mapLink={event.mapLink}
            />
          </motion.div>
        </section>
      )}

      {/* ─── 06. RSVP / CTA ─── */}
      <section className="relative px-6 py-32 text-center sm:py-40">
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: EASE }}
          className="mx-auto max-w-3xl"
        >
          <motion.div
            aria-hidden
            className="mx-auto mb-10 h-28 w-28 rounded-full sm:h-36 sm:w-36"
            style={{
              background: `radial-gradient(circle, ${accent} 0%, transparent 70%)`,
              filter: "blur(16px)",
              opacity: 0.6,
            }}
            animate={reduce ? undefined : { scale: [1, 1.08, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <h2 className="font-display text-[clamp(2.2rem,7vw,5rem)] font-light italic leading-[0.95] text-[#faf3e8]">
            Watch the horizon with us
          </h2>
          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <motion.div whileHover={reduce ? undefined : { scale: 1.03 }} className="mt-10 inline-block">
              <a
                href={event.rsvpLinkOrContact}
                target="_blank"
                rel="noreferrer"
                className="inline-block rounded-full px-12 py-4 text-sm uppercase tracking-[0.35em] transition-all"
                style={{ background: accent, color: "#3e2540" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 0 40px ${accent}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                RSVP
              </a>
            </motion.div>
          )}
        </motion.div>
      </section>

      <footer className="border-t border-[#faf3e8]/10 py-8 text-center text-xs text-[#faf3e8]/50">
        <p>
          {event.eventTitle}
          {event.person1Name && event.person2Name
            ? ` · ${event.person1Name} & ${event.person2Name}`
            : event.person1Name
            ? ` · ${event.person1Name}`
            : ""}
        </p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default HorizonTemplate;
