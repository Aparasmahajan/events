"use client";

import type { TemplateComponent, SubEvent, MediaItem } from "@/lib/types";
import { memorydimensionMeta } from "@/components/templates/metadata";
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
import { useEditMode } from "@/components/edit/EditContext";

const defaults = memorydimensionMeta.defaults;

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/* ------------------------------------------------------------------ */
/* Deterministic scatter layout for glass memory cards                */
/* ------------------------------------------------------------------ */

type CardLayout = {
  /** horizontal position, 0..100 (%) */
  left: number;
  /** vertical position, 0..100 (%) */
  top: number;
  /** apparent depth, 0 (far) .. 1 (near) */
  depth: number;
  /** rotation in degrees */
  rotate: number;
};

const CARD_LAYOUTS: CardLayout[] = [
  { left: 12, top: 8, depth: 0.35, rotate: -6 },
  { left: 68, top: 4, depth: 0.9, rotate: 5 },
  { left: 40, top: 20, depth: 0.6, rotate: -2 },
  { left: 84, top: 26, depth: 0.25, rotate: 8 },
  { left: 6, top: 40, depth: 0.75, rotate: 4 },
  { left: 52, top: 48, depth: 1.0, rotate: -4 },
  { left: 28, top: 60, depth: 0.45, rotate: 7 },
  { left: 74, top: 62, depth: 0.7, rotate: -8 },
  { left: 14, top: 78, depth: 0.55, rotate: 3 },
  { left: 60, top: 82, depth: 0.3, rotate: -5 },
  { left: 88, top: 74, depth: 0.85, rotate: 6 },
  { left: 44, top: 90, depth: 0.5, rotate: -3 },
];

function layoutFor(i: number): CardLayout {
  return CARD_LAYOUTS[i % CARD_LAYOUTS.length];
}

/* Depth → visual scale / blur / opacity */
function depthScale(d: number): number {
  return 0.6 + d * 0.7; // 0.6 .. 1.3
}
function depthBlur(d: number): number {
  // near (d~1) and far (d~0) both a little soft; mid is sharpest
  const dist = Math.abs(d - 0.62);
  return Math.round(dist * 10); // 0 .. ~4px
}
function depthOpacity(d: number): number {
  return 0.55 + d * 0.45; // 0.55 .. 1
}

/* Card pixel size scaled by depth */
function cardWidth(d: number): number {
  return Math.round(150 + d * 130); // 150 .. 280
}

/* ------------------------------------------------------------------ */
/* Floating dust particles                                            */
/* ------------------------------------------------------------------ */

const PARTICLES = Array.from({ length: 26 }, (_, i) => {
  const seed = (i * 9301 + 49297) % 233280;
  const rnd = seed / 233280;
  const seed2 = (i * 4021 + 12345) % 65536;
  const rnd2 = seed2 / 65536;
  return {
    left: Math.round(rnd * 100),
    top: Math.round(rnd2 * 100),
    size: 1 + Math.round(rnd2 * 3),
    delay: (i % 8) * 0.7,
    duration: 6 + (i % 5) * 2,
    drift: (i % 2 === 0 ? 1 : -1) * (10 + (i % 4) * 8),
  };
});

/* ================================================================== */

export const MemoryDimensionTemplate: TemplateComponent = ({
  event,
  subEvents,
  media,
}) => {
  const prefersReduced = useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || defaults.accentColor;
  const hero = event.heroImageUrl || defaults.heroImage;
  const tagline = event.tagline?.trim() || defaults.tagline;
  const invitationMessage =
    event.invitationMessage?.trim() || defaults.invitationMessage;
  const aboutStory = event.aboutStory?.trim() || defaults.aboutStory || "";
  const galleryItems = media.filter((m) => m.section === "gallery");

  const sortedEvents = [...subEvents].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  );

  const showStory = !event.hideStory;
  const showEvents = !event.hideEvents && sortedEvents.length > 0;
  const showGallery =
    !event.hideGallery && (galleryItems.length > 0 || editing);
  const showVenue = !event.hideVenue;
  const showRsvp = event.rsvpEnabled;

  /* Fly-through scroll driver for the memory field */
  const fieldRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: fieldRef,
    offset: ["start end", "end start"],
  });
  const rawFieldScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.78, 1.15, 1.6]);
  const rawFieldY = useTransform(scrollYProgress, [0, 1], [80, -180]);
  const rawBgY = useTransform(scrollYProgress, [0, 1], [-40, 90]);
  const rawFieldOpacity = useTransform(
    scrollYProgress,
    [0, 0.12, 0.85, 1],
    [0, 1, 1, 0.35],
  );

  const fieldScale = useSpring(rawFieldScale, { stiffness: 60, damping: 20 });
  const fieldY = useSpring(rawFieldY, { stiffness: 60, damping: 20 });
  const bgY = useSpring(rawBgY, { stiffness: 40, damping: 24 });

  const animate = !prefersReduced;

  return (
    <div
      className="relative min-h-screen overflow-x-clip bg-[#06060a] font-sans text-white/90 antialiased"
      style={{ "--accent": accent } as React.CSSProperties}
    >
      <ScrollProgress color="var(--accent)" />
      <MusicToggle />

      {/* Global volumetric ambience */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute -left-1/4 top-[-10%] h-[70vh] w-[70vh] rounded-full opacity-40 blur-[120px]"
          style={{
            background:
              "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute -right-1/4 bottom-[-10%] h-[60vh] w-[60vh] rounded-full opacity-30 blur-[120px]"
          style={{
            background:
              "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,#06060a_90%)]" />
      </div>

      {/* ---------------------------------------------------------- */}
      {/* HERO                                                       */}
      {/* ---------------------------------------------------------- */}
      <section className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 pb-28 pt-24 text-center">
        <div className="absolute inset-0 -z-10">
          <HeroMedia
            imageSrc={hero}
            videoSrc={event.heroVideoUrl || undefined}
            alt={`${event.eventTitle ?? "Event"} hero backdrop`}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#06060a]/70 via-[#06060a]/40 to-[#06060a]" />
        </div>

        {/* Floating dust */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          {PARTICLES.map((p, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full bg-white/70"
              style={{
                left: `${p.left}%`,
                top: `${p.top}%`,
                width: p.size,
                height: p.size,
                boxShadow: "0 0 6px var(--accent)",
              }}
              animate={
                animate
                  ? { y: [0, p.drift, 0], opacity: [0.2, 0.9, 0.2] }
                  : { opacity: 0.4 }
              }
              transition={
                animate
                  ? {
                      duration: p.duration,
                      delay: p.delay,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }
                  : undefined
              }
            />
          ))}
        </div>

        <motion.div
          initial={animate ? { opacity: 0, y: 30 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE_OUT }}
          className="relative max-w-3xl"
        >
          <p
            className="mb-6 font-script text-2xl md:text-3xl"
            style={{ color: "var(--accent)" }}
          >
            {tagline}
          </p>
          <h1 className="font-display text-5xl leading-[0.95] tracking-tight drop-shadow-[0_0_30px_rgba(0,0,0,0.6)] sm:text-6xl md:text-8xl">
            {event.eventTitle ?? "A Memory Dimension"}
          </h1>
          <p className="mx-auto mt-8 max-w-xl font-serif text-base leading-relaxed text-white/70 md:text-lg">
            {invitationMessage}
          </p>
        </motion.div>

        <motion.div
          aria-hidden
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={animate ? { y: [0, 10, 0], opacity: [0.4, 1, 0.4] } : { opacity: 0.6 }}
          transition={
            animate
              ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
              : undefined
          }
        >
          <div className="h-10 w-6 rounded-full border border-white/30 p-1">
            <div
              className="mx-auto h-2 w-1 rounded-full"
              style={{ background: "var(--accent)" }}
            />
          </div>
        </motion.div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* STORY                                                      */}
      {/* ---------------------------------------------------------- */}
      {showStory && (
        <section className="relative z-10 mx-auto max-w-3xl px-6 py-28 text-center">
          <SectionKicker label="Origin" />
          <motion.h2
            initial={animate ? { opacity: 0, y: 24 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: EASE_OUT }}
            className="mt-4 font-display text-3xl md:text-5xl"
          >
            Our Story
          </motion.h2>
          {aboutStory && (
            <motion.p
              initial={animate ? { opacity: 0, y: 24 } : false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: 0.1, ease: EASE_OUT }}
              className="mt-8 whitespace-pre-line font-serif text-lg leading-relaxed text-white/70"
            >
              {aboutStory}
            </motion.p>
          )}
        </section>
      )}

      {/* ---------------------------------------------------------- */}
      {/* GALLERY — the memory field / fly-through                   */}
      {/* ---------------------------------------------------------- */}
      {showGallery && (
        <section className="relative z-10 py-16">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <SectionKicker label="The Archive" />
            <h2 className="mt-4 font-display text-3xl md:text-5xl">
              Memories in Suspension
            </h2>
            <p className="mx-auto mt-4 max-w-md font-serif text-white/60">
              Each memory hangs as glass, glowing in the dark. Scroll to drift
              through them.
            </p>
          </div>

          {animate ? (
            <div
              ref={fieldRef}
              className="relative mx-auto mt-8 h-[220vh] w-full max-w-6xl"
            >
              {/* sticky viewport we "fly" through */}
              <div
                className="sticky top-0 flex h-screen items-center justify-center overflow-hidden"
                style={{ perspective: "1200px" }}
              >
                {/* parallax background glow layer */}
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{ y: bgY }}
                >
                  <div
                    className="absolute left-1/2 top-1/2 h-[80vh] w-[80vh] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-[100px]"
                    style={{
                      background:
                        "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
                    }}
                  />
                </motion.div>

                <motion.div
                  className="relative h-full w-full will-change-transform"
                  style={{
                    scale: fieldScale,
                    y: fieldY,
                    opacity: rawFieldOpacity,
                    transformStyle: "preserve-3d",
                  }}
                >
                  {galleryItems.map((item, i) => (
                    <GlassCard
                      key={`${item.fileName}-${i}`}
                      item={item}
                      index={i}
                      editing={editing}
                    />
                  ))}
                  {editing && galleryItems.length === 0 && (
                    <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2">
                      <GlassShell depth={0.9}>
                        <div className="flex h-full w-full items-center justify-center text-sm opacity-60">
                          + Add photos
                        </div>
                      </GlassShell>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          ) : (
            /* Reduced motion: calm static grid */
            <div className="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-4 px-6 sm:grid-cols-3 md:grid-cols-4">
              {galleryItems.map((item, i) => (
                <div
                  key={`${item.fileName}-${i}`}
                  className="relative aspect-square overflow-hidden rounded-2xl bg-white/[0.08] ring-1 ring-white/10 backdrop-blur"
                  style={{ boxShadow: "0 0 30px -8px var(--accent)" }}
                >
                  <img
                    loading="lazy"
                    src={item.publicUrl}
                    alt={item.caption ?? ""}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
              {editing && galleryItems.length === 0 && (
                <div className="col-span-full flex h-48 items-center justify-center rounded-2xl border border-dashed border-white/20 text-sm opacity-60">
                  + Add photos
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* ---------------------------------------------------------- */}
      {/* EVENTS — receding tunnel of memory nodes                   */}
      {/* ---------------------------------------------------------- */}
      {showEvents && (
        <section className="relative z-10 mx-auto max-w-4xl px-6 py-28">
          <div className="text-center">
            <SectionKicker label="The Sequence" />
            <h2 className="mt-4 font-display text-3xl md:text-5xl">
              A Tunnel of Moments
            </h2>
          </div>

          {animate ? (
            <div
              className="relative mx-auto mt-16 flex flex-col items-center"
              style={{ perspective: "800px" }}
            >
              {/* vanishing-point glow */}
              <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full opacity-40 blur-3xl"
                style={{
                  background:
                    "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
                }}
              />
              {sortedEvents.map((sub, i) => {
                const total = sortedEvents.length;
                const t = total > 1 ? i / (total - 1) : 0;
                const scale = 1 - t * 0.42; // shrink toward the distance
                const opacity = 1 - t * 0.5;
                const blur = t * 3;
                return (
                  <motion.div
                    key={sub.order}
                    initial={{ opacity: 0, scale: scale * 0.9, y: 30 }}
                    whileInView={{ opacity, scale, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.7, ease: EASE_OUT }}
                    style={{
                      filter: `blur(${blur}px)`,
                      zIndex: total - i,
                      marginTop: i === 0 ? 0 : -8,
                    }}
                    className="w-full max-w-xl origin-top"
                  >
                    <TunnelNode sub={sub} />
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="mx-auto mt-12 flex max-w-xl flex-col gap-4">
              {sortedEvents.map((sub) => (
                <TunnelNode key={sub.order} sub={sub} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* ---------------------------------------------------------- */}
      {/* VENUE                                                      */}
      {/* ---------------------------------------------------------- */}
      {showVenue && (
        <section className="relative z-10 mx-auto max-w-5xl px-6 py-28">
          <div className="text-center">
            <SectionKicker label="The Place" />
            <h2 className="mt-4 font-display text-3xl md:text-5xl">
              Where It Happens
            </h2>
            {event.venueName && (
              <p className="mt-4 font-serif text-lg text-white/70">
                {event.venueName}
              </p>
            )}
            {event.venueAddress && (
              <p className="mt-1 font-sans text-sm text-white/50">
                {event.venueAddress}
              </p>
            )}
          </div>
          <div
            className="mt-10 overflow-hidden rounded-3xl ring-1 ring-white/10"
            style={{ boxShadow: "0 0 60px -20px var(--accent)" }}
          >
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

      {/* ---------------------------------------------------------- */}
      {/* RSVP                                                       */}
      {/* ---------------------------------------------------------- */}
      {showRsvp && (
        <section className="relative z-10 mx-auto max-w-2xl px-6 py-28">
          <div className="text-center">
            <SectionKicker label="Join Us" />
            <h2 className="mt-4 font-display text-3xl md:text-5xl">
              Step Into the Dimension
            </h2>
          </div>
          <div
            className="mt-10 rounded-3xl bg-white/[0.05] p-6 ring-1 ring-white/10 backdrop-blur-xl md:p-10"
            style={{ boxShadow: "0 0 60px -24px var(--accent)" }}
          >
            <RSVP
              enabled={event.rsvpEnabled}
              linkOrContact={event.rsvpLinkOrContact}
              contactName={event.contactName}
              type={event.rsvpType}
            />
          </div>
        </section>
      )}

      {/* ---------------------------------------------------------- */}
      {/* FOOTER                                                     */}
      {/* ---------------------------------------------------------- */}
      <footer className="relative z-10 border-t border-white/10 px-6 py-10 text-center">
        <p className="font-script text-xl" style={{ color: "var(--accent)" }}>
          {event.eventTitle ?? "Memory Dimension"}
        </p>
        <p className="mt-2 font-sans text-xs text-white/40">
          A memory dimension, preserved in glass.
        </p>
      </footer>
    </div>
  );
};

export default MemoryDimensionTemplate;

/* ================================================================== */
/* Sub-components                                                      */
/* ================================================================== */

function SectionKicker({ label }: { label: string }) {
  return (
    <span
      className="inline-block text-xs font-medium uppercase tracking-[0.3em] text-white/50"
      style={{ color: "var(--accent)" }}
    >
      {label}
    </span>
  );
}

/* Reusable glass shell for a memory */
function GlassShell({
  depth,
  children,
}: {
  depth: number;
  children: React.ReactNode;
}) {
  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-2xl bg-white/[0.08] ring-1 ring-white/15 backdrop-blur-md"
      style={{
        boxShadow: `0 0 ${Math.round(20 + depth * 50)}px -6px var(--accent), inset 0 0 40px rgba(255,255,255,0.06)`,
      }}
    >
      {children}
      {/* glossy highlight */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-40" />
    </div>
  );
}

/* A scattered, depth-mapped glass card holding one memory photo */
function GlassCard({
  item,
  index,
  editing,
}: {
  item: MediaItem;
  index: number;
  editing: boolean;
}) {
  const l = layoutFor(index);
  const scale = depthScale(l.depth);
  const blur = depthBlur(l.depth);
  const opacity = depthOpacity(l.depth);
  const w = cardWidth(l.depth);

  return (
    <motion.div
      className="absolute will-change-transform"
      style={{
        left: `${l.left}%`,
        top: `${l.top}%`,
        width: w,
        height: Math.round(w * 1.15),
        opacity,
        filter: blur ? `blur(${blur}px)` : undefined,
        zIndex: Math.round(l.depth * 100),
      }}
      initial={{ scale: scale * 0.85, opacity: 0 }}
      whileInView={{ scale, opacity }}
      viewport={{ margin: "-10%" }}
      whileHover={{
        scale: scale * 1.08,
        opacity: 1,
        filter: "blur(0px)",
        zIndex: 200,
      }}
      transition={{ type: "spring", stiffness: 120, damping: 18 }}
    >
      <div
        style={{ transform: `rotate(${l.rotate}deg)` }}
        className="h-full w-full"
      >
        <GlassShell depth={l.depth}>
          <div className="relative h-full w-full">
            <img
              loading="lazy"
              src={item.publicUrl}
              alt={item.caption?.trim() || `Memory ${index + 1}`}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          {item.caption?.trim() && (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
              <p className="truncate font-serif text-xs text-white/85">
                {item.caption}
              </p>
            </div>
          )}
        </GlassShell>
      </div>
    </motion.div>
  );
}

/* One event node in the receding tunnel */
function TunnelNode({ sub }: { sub: SubEvent }) {
  const timeLabel = [sub.startTime, sub.endTime].filter(Boolean).join(" – ");
  return (
    <div
      className="rounded-3xl bg-white/[0.06] px-6 py-6 ring-1 ring-white/10 backdrop-blur-xl"
      style={{ boxShadow: "0 0 50px -18px var(--accent)" }}
    >
      <div className="flex items-start gap-4">
        {sub.icon && (
          <span
            aria-hidden
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/[0.08] text-lg ring-1 ring-white/15"
            style={{ boxShadow: "0 0 24px -6px var(--accent)" }}
          >
            {sub.icon}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-xl md:text-2xl">{sub.name}</h3>
          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 font-sans text-sm text-white/60">
            {sub.date && <span>{sub.date}</span>}
            {timeLabel && (
              <span style={{ color: "var(--accent)" }}>{timeLabel}</span>
            )}
          </div>
          {(sub.venueName || sub.venueAddress) && (
            <p className="mt-2 font-serif text-sm text-white/55">
              {[sub.venueName, sub.venueAddress].filter(Boolean).join(", ")}
            </p>
          )}
          {sub.dressCode && (
            <p className="mt-1 font-sans text-xs uppercase tracking-wider text-white/45">
              Dress: {sub.dressCode}
            </p>
          )}
          {sub.description && (
            <p className="mt-3 font-serif text-sm leading-relaxed text-white/65">
              {sub.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
