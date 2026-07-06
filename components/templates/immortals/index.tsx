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
import { EventCountdown } from "@/components/ui/EventCountdown";
import { useEditMode } from "@/components/edit/EditContext";
import type { TemplateComponent, SubEvent } from "@/lib/types";

const EASE = [0.16, 1, 0.3, 1] as const;

const PILLARS = [
  { x: "8%", h: 78, delay: 0.0 },
  { x: "22%", h: 92, delay: 0.15 },
  { x: "36%", h: 70, delay: 0.3 },
  { x: "50%", h: 96, delay: 0.45 },
  { x: "64%", h: 74, delay: 0.6 },
  { x: "78%", h: 88, delay: 0.75 },
  { x: "92%", h: 82, delay: 0.9 },
];

const STARS = Array.from({ length: 30 }, (_, i) => ({
  x: `${(i * 37 + 11) % 100}%`,
  size: 6 + (i % 4) * 2,
  delay: (i % 12) * 0.4,
  dur: 8 + (i % 5) * 1.5,
  drift: ((i % 7) - 3) * 4,
}));

function MarbleField({ reduce }: { reduce: boolean }) {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden bg-[#050508]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#050508] via-[#100c0a] to-[#1a1614]" />
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 20% 15%, #e5c26a 0%, transparent 45%), radial-gradient(ellipse at 80% 90%, #a67b3c 0%, transparent 50%)",
        }}
      />
      {!reduce && (
        <svg className="absolute inset-0 h-full w-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
          <filter id="immortals-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" />
          </filter>
          <rect width="100%" height="100%" filter="url(#immortals-grain)" />
        </svg>
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050508]/40 via-transparent to-[#050508]/70" />
    </div>
  );
}

function Pillar({ x, h, delay, reduce }: { x: string; h: number; delay: number; reduce: boolean }) {
  return (
    <div className="absolute bottom-0" style={{ left: x, transform: "translateX(-50%)", height: `${h}%` }}>
      <div className="relative h-full w-[2.2vw] min-w-[14px] max-w-[36px]">
        <div
          className="absolute inset-x-0 top-0 h-[3%] rounded-t-sm"
          style={{ background: "linear-gradient(180deg, #f5f0e1, #e5c26a 60%, #a67b3c)" }}
        />
        <div
          className="absolute inset-x-[15%] top-[3%] bottom-0"
          style={{
            background:
              "linear-gradient(90deg, #a67b3c 0%, #e5c26a 20%, #f5f0e1 50%, #e5c26a 80%, #a67b3c 100%)",
            boxShadow: "0 0 40px rgba(229,194,106,0.25)",
          }}
        />
        {!reduce && (
          <motion.div
            className="absolute inset-x-[15%] top-[3%] bottom-0 mix-blend-overlay"
            style={{
              background: "linear-gradient(180deg, transparent, rgba(255,240,200,0.6), transparent)",
              backgroundSize: "100% 40%",
              backgroundRepeat: "no-repeat",
            }}
            animate={{ backgroundPositionY: ["-40%", "140%"] }}
            transition={{ duration: 6, delay, repeat: Infinity, ease: "linear" }}
          />
        )}
      </div>
    </div>
  );
}

function SectionLabel({ children, accent, reduce }: { children: React.ReactNode; accent: string; reduce: boolean }) {
  return (
    <motion.p
      initial={reduce ? false : { opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: EASE }}
      className="mb-6 text-center text-[10px] uppercase tracking-[0.55em]"
      style={{ color: accent }}
    >
      {children}
    </motion.p>
  );
}

function Plaque({ item, i, accent, reduce }: { item: SubEvent; i: number; accent: string; reduce: boolean }) {
  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
      className="relative"
    >
      <div
        className="relative rounded-sm p-7 sm:p-8"
        style={{
          background: "linear-gradient(180deg, rgba(26,22,20,0.85), rgba(10,8,7,0.9))",
          boxShadow: "inset 0 0 0 1px rgba(229,194,106,0.55), inset 0 0 0 3px rgba(10,8,7,0.9), inset 0 0 0 4px rgba(166,123,60,0.35)",
        }}
      >
        <div className="flex items-center gap-3">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: accent, boxShadow: `0 0 10px ${accent}` }}
          />
          <span className="text-[10px] uppercase tracking-[0.35em]" style={{ color: "#a67b3c" }}>
            No. {String(item.order).padStart(2, "0")}
          </span>
        </div>
        <h3
          className="mt-4 font-display text-2xl uppercase tracking-[0.08em] sm:text-3xl"
          style={{ color: "#f5f0e1" }}
        >
          {item.name}
        </h3>
        <div
          className="my-4 h-px w-16"
          style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
        />
        <div className="space-y-1 text-[11px] uppercase tracking-[0.3em]" style={{ color: "#e5c26a" }}>
          {item.date && <p>{item.date}</p>}
          {(item.startTime || item.endTime) && (
            <p style={{ color: "#a67b3c" }}>
              {[item.startTime, item.endTime].filter(Boolean).join(" — ")}
            </p>
          )}
          {item.venueName && <p style={{ color: "#a67b3c" }}>{item.venueName}</p>}
        </div>
        {item.description && (
          <p className="mt-4 text-sm leading-relaxed" style={{ color: "rgba(245,240,225,0.65)" }}>
            {item.description}
          </p>
        )}
        {item.dressCode && (
          <p
            className="mt-5 inline-block rounded-full px-3 py-1 text-[9px] uppercase tracking-[0.35em]"
            style={{ border: "1px solid rgba(229,194,106,0.35)", color: "#e5c26a" }}
          >
            {item.dressCode}
          </p>
        )}
      </div>
    </motion.article>
  );
}

export const ImmortalsTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || "#e5c26a";
  const tagline = event.tagline?.trim() || "A ceremony of the immortals";
  const invitationMessage =
    event.invitationMessage?.trim() ||
    "Gather within these hallowed halls as legends are honored, achievements enshrined, and the extraordinary is set in gold.";
  const aboutStory =
    event.aboutStory?.trim() ||
    "Every recipient tonight carved their name into permanence. The pillars stand for their work; the light stands for their courage.";
  const hero =
    event.heroImageUrl ||
    "https://images.unsplash.com/photo-1519750157634-b6d493a0f77c?auto=format&fit=crop&w=1800&q=80";

  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const sortedSub = useMemo(() => [...subEvents].sort((a, b) => a.order - b.order), [subEvents]);

  const showStory = !event.hideStory;
  const showEvents = !event.hideEvents && sortedSub.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroP, [0, 1], [0, -80]);
  const heroOpacity = useTransform(heroP, [0, 0.7], [1, 0]);

  return (
    <div
      className="relative min-h-screen overflow-x-clip bg-[#050508] font-sans antialiased"
      style={{ "--accent": accent, color: "#f5f0e1" } as React.CSSProperties}
    >
      <MarbleField reduce={reduce} />
      <ScrollProgress color={accent} />

      {/* HERO — pillars + reflective floor */}
      <section ref={heroRef} className="relative flex min-h-[100svh] items-center justify-center overflow-hidden pb-[25vh] pt-24 sm:pt-28">
        <div className="absolute inset-0">
          <HeroMedia
            imageSrc={hero}
            videoSrc={event.heroVideoUrl || undefined}
            alt={event.eventTitle}
            className="opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050508]/70 via-[#050508]/50 to-[#050508]" />
        </div>

        <div aria-hidden className="absolute inset-x-0 bottom-[25%] top-0 pointer-events-none">
          {PILLARS.map((p, i) => (
            <Pillar key={i} x={p.x} h={p.h} delay={p.delay} reduce={reduce} />
          ))}
        </div>

        <div aria-hidden className="absolute inset-x-0 bottom-0 h-[25%] overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(180deg, rgba(229,194,106,0.06), rgba(5,5,8,1))",
            }}
          />
          <div
            className="absolute inset-x-0 top-0 h-full"
            style={{
              transform: "scaleY(-1)",
              opacity: 0.2,
              maskImage: "linear-gradient(180deg, black, transparent 80%)",
              WebkitMaskImage: "linear-gradient(180deg, black, transparent 80%)",
            }}
          >
            <div className="mx-auto max-w-4xl px-6 pt-6 text-center">
              <p className="font-display text-[clamp(2rem,7vw,5rem)] uppercase leading-none tracking-[0.12em]" style={{ color: "#e5c26a" }}>
                {event.eventTitle}
              </p>
            </div>
          </div>
        </div>

        <motion.div
          style={reduce ? undefined : { y: heroY, opacity: heroOpacity }}
          className="relative z-10 max-w-5xl px-6 text-center"
        >
          <motion.p
            initial={reduce ? false : { opacity: 0, letterSpacing: "0.2em" }}
            animate={{ opacity: 1, letterSpacing: "0.6em" }}
            transition={{ duration: 1.4, ease: EASE }}
            className="mb-8 text-[10px] uppercase"
            style={{ color: accent }}
          >
            {tagline}
          </motion.p>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: EASE }}
            className="font-display text-[clamp(2.75rem,10vw,7.5rem)] font-light uppercase leading-[0.95] tracking-[0.06em]"
            style={{
              backgroundImage: "linear-gradient(180deg, #f5f0e1 0%, #e5c26a 55%, #a67b3c 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              textShadow: "0 0 60px rgba(229,194,106,0.15)",
            }}
          >
            {event.eventTitle}
          </motion.h1>
          {event.person1Name && (
            <motion.p
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 1 }}
              className="mt-6 text-sm uppercase tracking-[0.5em]"
              style={{ color: "#a67b3c" }}
            >
              Honoring {event.person1Name}
              {event.person2Name ? ` & ${event.person2Name}` : ""}
            </motion.p>
          )}
          <motion.div
            initial={reduce ? false : { opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 1.2, duration: 1.2, ease: EASE }}
            className="mx-auto mt-10 h-px w-48"
            style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
          />
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 1 }}
            className="mt-6 flex flex-wrap justify-center gap-4 text-[10px] uppercase tracking-[0.4em]"
            style={{ color: "#e5c26a" }}
          >
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
            {event.mainStartTime && <span style={{ color: "#a67b3c" }}>✦</span>}
            {event.mainStartTime && <span>{event.mainStartTime}</span>}
            {event.city && <><span style={{ color: "#a67b3c" }}>✦</span><span>{event.city}</span></>}
          </motion.div>
          {!event.hideTimer && !(event.timerCustom && event.timerStyle === "floating") && event.mainDate && (
            <div className="mt-12">
              <EventCountdown
                event={event}
                variant="inline"
                design={event.timerCustom ? event.timerDesign ?? "glass" : "elegant"}
              />
            </div>
          )}
        </motion.div>
      </section>

      {/* STORY */}
      {showStory && (
        <section className="relative mx-auto max-w-4xl px-6 py-28 sm:py-36 text-center">
          <SectionLabel accent={accent} reduce={reduce}>Invocation</SectionLabel>
          <motion.blockquote
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: EASE }}
            className="font-display text-2xl leading-[1.45] tracking-[0.02em] sm:text-3xl"
            style={{ color: "#f5f0e1" }}
          >
            “{invitationMessage}”
          </motion.blockquote>
          <motion.div
            initial={reduce ? false : { opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 1.1, ease: EASE }}
            className="mx-auto my-10 h-px w-40"
            style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
          />
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 1 }}
            className="mx-auto max-w-2xl text-base leading-relaxed"
            style={{ color: "rgba(245,240,225,0.7)" }}
          >
            {aboutStory}
          </motion.p>
        </section>
      )}

      {/* SUB-EVENTS — museum plaques */}
      {showEvents && (
        <section className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <SectionLabel accent={accent} reduce={reduce}>Order of the Ceremony</SectionLabel>
          <div className="mx-auto mb-14 h-px w-24" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedSub.map((s, i) => (
              <Plaque key={s.order} item={s} i={i} accent={accent} reduce={reduce} />
            ))}
          </div>
        </section>
      )}

      {/* GALLERY — museum frames */}
      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <SectionLabel accent={accent} reduce={reduce}>The Exhibition</SectionLabel>
          <div className="mx-auto mb-14 h-px w-24" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((m, i) => (
              <motion.figure
                key={`${m.fileName}-${i}`}
                initial={reduce ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8% 0px" }}
                transition={{ duration: 0.7, delay: i * 0.05, ease: EASE }}
                className="group relative"
                style={{
                  padding: "18px",
                  background: "linear-gradient(180deg, #f5f0e1, #d9cfb4)",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(229,194,106,0.7)",
                }}
              >
                <div style={{ boxShadow: "inset 0 0 0 1px rgba(166,123,60,0.6)" }} className="overflow-hidden">
                  <img
                    src={m.publicUrl}
                    alt={m.caption ?? ""}
                    loading="lazy"
                    className="aspect-[4/5] w-full object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
                  />
                </div>
                {m.caption && (
                  <figcaption
                    className="mt-4 text-center text-[10px] uppercase tracking-[0.35em]"
                    style={{ color: "#1a1614" }}
                  >
                    {m.caption}
                  </figcaption>
                )}
              </motion.figure>
            ))}
            {editing && galleryItems.length === 0 && (
              <div
                className="col-span-full flex h-56 items-center justify-center rounded-sm border border-dashed text-sm uppercase tracking-[0.3em]"
                style={{ borderColor: "rgba(229,194,106,0.4)", color: "#e5c26a" }}
              >
                + Add photos
              </div>
            )}
          </div>
        </section>
      )}

      {/* VENUE */}
      {showVenue && (
        <section className="relative mx-auto max-w-5xl px-6 py-24 sm:py-32">
          <SectionLabel accent={accent} reduce={reduce}>The Hall</SectionLabel>
          {event.venueName && (
            <h3
              className="text-center font-display text-3xl uppercase tracking-[0.1em] sm:text-4xl"
              style={{ color: "#f5f0e1" }}
            >
              {event.venueName}
            </h3>
          )}
          {event.venueAddress && (
            <p
              className="mt-3 text-center text-sm uppercase tracking-[0.35em]"
              style={{ color: "#a67b3c" }}
            >
              {event.venueAddress}
            </p>
          )}
          <div
            className="mx-auto my-10 h-px w-32"
            style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
          />
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE }}
            className="overflow-hidden rounded-sm p-1"
            style={{
              background: "linear-gradient(180deg, #e5c26a, #a67b3c)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
            }}
          >
            <div className="overflow-hidden rounded-sm">
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

      {/* FINALE — sky of golden stars */}
      <section className="relative overflow-hidden px-6 py-32 text-center sm:py-44">
        {!reduce && (
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            {STARS.map((s, i) => (
              <motion.svg
                key={i}
                className="absolute"
                style={{ left: s.x, bottom: -20, width: s.size, height: s.size, color: "#e5c26a" }}
                viewBox="0 0 24 24"
                fill="currentColor"
                animate={{
                  y: ["0vh", "-95vh"],
                  x: [0, s.drift, 0],
                  opacity: [0, 1, 1, 0],
                  rotate: [0, 180],
                }}
                transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: "linear" }}
              >
                <path d="M12 2l2.6 6.6L22 10l-5.5 4.4L18.3 22 12 18.2 5.7 22l1.8-7.6L2 10l7.4-1.4z" />
              </motion.svg>
            ))}
          </div>
        )}
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: EASE }}
          className="relative mx-auto max-w-3xl"
        >
          <p className="mb-6 text-[10px] uppercase tracking-[0.6em]" style={{ color: accent }}>
            To the Immortals
          </p>
          <h2
            className="font-display text-[clamp(2.25rem,7vw,5.5rem)] font-light uppercase leading-[0.95] tracking-[0.08em]"
            style={{
              backgroundImage: "linear-gradient(180deg, #f5f0e1, #e5c26a 60%, #a67b3c)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {event.eventTitle}
          </h2>
          <div
            className="mx-auto my-8 h-px w-40"
            style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
          />
          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <motion.a
              href={event.rsvpLinkOrContact}
              target="_blank"
              rel="noreferrer"
              whileHover={reduce ? undefined : { scale: 1.04, boxShadow: `0 0 60px ${accent}` }}
              className="mt-8 inline-block rounded-full px-14 py-4 text-xs uppercase tracking-[0.45em] transition-all"
              style={{
                background: "linear-gradient(180deg, #f5f0e1, #e5c26a 60%, #a67b3c)",
                color: "#1a1614",
                boxShadow: "0 10px 40px rgba(229,194,106,0.35)",
              }}
            >
              Accept the invitation
            </motion.a>
          )}
          {event.contactName && (
            <p className="mt-10 text-[10px] uppercase tracking-[0.4em]" style={{ color: "#a67b3c" }}>
              Curated by {event.contactName}
            </p>
          )}
        </motion.div>
      </section>

      <footer
        className="relative border-t py-10 text-center text-[10px] uppercase tracking-[0.5em]"
        style={{ borderColor: "rgba(229,194,106,0.15)", color: "#a67b3c" }}
      >
        <p>
          {event.eventTitle}
          {event.person1Name ? ` ✦ ${event.person1Name}` : ""}
        </p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default ImmortalsTemplate;
