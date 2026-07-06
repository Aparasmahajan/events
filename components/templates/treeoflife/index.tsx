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

const BARK = "#5a3e26";
const LEAF = "#5e8e42";
const AMBER = "#c4894c";
const BLOSSOM = "#e6c66e";
const CREAM = "#faf5e6";
const EARTH = "#2a1e12";

const FALLING_LEAVES = [
  { x: "6%", y: "8%", rot: 12, size: 22, dur: 14, delay: 0, color: LEAF },
  { x: "18%", y: "24%", rot: -18, size: 16, dur: 18, delay: 2, color: AMBER },
  { x: "82%", y: "12%", rot: 30, size: 20, dur: 16, delay: 1, color: LEAF },
  { x: "72%", y: "38%", rot: -8, size: 14, dur: 20, delay: 3, color: BLOSSOM },
  { x: "10%", y: "52%", rot: 24, size: 18, dur: 15, delay: 4, color: AMBER },
  { x: "88%", y: "62%", rot: -22, size: 22, dur: 17, delay: 2.5, color: LEAF },
  { x: "26%", y: "76%", rot: 6, size: 15, dur: 19, delay: 5, color: AMBER },
  { x: "60%", y: "84%", rot: -30, size: 20, dur: 16, delay: 1.5, color: BLOSSOM },
  { x: "44%", y: "18%", rot: 18, size: 12, dur: 22, delay: 6, color: LEAF },
  { x: "36%", y: "58%", rot: -14, size: 17, dur: 15, delay: 0.5, color: AMBER },
];

function LeafGlyph({ size = 20, color = LEAF }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 2 C6 6 3 12 4 20 C12 21 18 18 20 10 C21 6 18 3 12 2 Z"
        fill={color}
        opacity="0.85"
      />
      <path d="M12 3 C10 9 9 15 8 20" stroke={EARTH} strokeWidth="0.6" strokeLinecap="round" opacity="0.4" />
    </svg>
  );
}

function FallingLeaves({ reduce }: { reduce: boolean }) {
  if (reduce) return null;
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-[5] overflow-hidden">
      {FALLING_LEAVES.map((l, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: l.x, top: l.y }}
          animate={{
            y: [0, 40, 0, -20, 0],
            x: [0, 20, -10, 15, 0],
            rotate: [l.rot, l.rot + 60, l.rot - 30, l.rot + 20, l.rot],
          }}
          transition={{ duration: l.dur, delay: l.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          <LeafGlyph size={l.size} color={l.color} />
        </motion.div>
      ))}
    </div>
  );
}

function CentralTree({ progress, reduce }: { progress: number; reduce: boolean }) {
  const dash = 2400;
  return (
    <div aria-hidden className="pointer-events-none fixed inset-y-0 left-1/2 -z-[6] hidden w-[520px] -translate-x-1/2 md:block">
      <svg viewBox="0 0 400 1600" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="tol-bark" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor={BARK} stopOpacity="0.35" />
            <stop offset="1" stopColor={BARK} stopOpacity="0.18" />
          </linearGradient>
          <radialGradient id="tol-root-glow" cx="0.5" cy="1" r="0.5">
            <stop offset="0" stopColor={BLOSSOM} stopOpacity="0.35" />
            <stop offset="1" stopColor={BLOSSOM} stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse cx="200" cy="1560" rx="220" ry="80" fill="url(#tol-root-glow)" />
        <path
          d="M200 1560 C170 1500 120 1470 70 1490 M200 1560 C230 1500 280 1470 330 1490 M200 1560 C190 1490 150 1440 100 1430 M200 1560 C210 1490 250 1440 300 1430"
          stroke={BARK}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          opacity="0.55"
        />

        <path d="M180 1560 L192 200 Q196 120 210 60" stroke="url(#tol-bark)" strokeWidth="34" fill="none" strokeLinecap="round" />
        <path d="M188 1400 Q190 900 200 400" stroke={BARK} strokeWidth="1.2" fill="none" opacity="0.35" />
        <path d="M204 1400 Q208 900 216 400" stroke={BARK} strokeWidth="1.2" fill="none" opacity="0.35" />

        <motion.path
          d="M195 1300 Q120 1250 60 1200 M205 1200 Q290 1160 350 1130 M195 1050 Q110 1010 40 990 M205 900 Q300 870 370 860 M198 750 Q140 720 80 710 M210 600 Q290 580 350 590 M200 450 Q160 400 130 340 M204 350 Q240 300 260 240"
          stroke={BARK}
          strokeWidth="2.4"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={dash}
          strokeDashoffset={reduce ? 0 : dash * (1 - Math.min(1, progress * 1.4))}
          opacity="0.75"
        />

        {[
          { cx: 60, cy: 1200, c: LEAF },
          { cx: 350, cy: 1130, c: LEAF },
          { cx: 40, cy: 990, c: LEAF },
          { cx: 370, cy: 860, c: AMBER },
          { cx: 80, cy: 710, c: AMBER },
          { cx: 350, cy: 590, c: AMBER },
          { cx: 130, cy: 340, c: BLOSSOM },
          { cx: 260, cy: 240, c: BLOSSOM },
        ].map((p, i) => (
          <circle key={i} cx={p.cx} cy={p.cy} r="7" fill={p.c} opacity="0.7" />
        ))}
      </svg>
    </div>
  );
}

function TreeTimeline({ items, accent }: { items: SubEvent[]; accent: string }) {
  const reduce = useReducedMotion();
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <div className="mx-auto max-w-4xl px-6">
      <div className="relative space-y-10">
        <div
          aria-hidden
          className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2"
          style={{ background: `linear-gradient(180deg, ${BARK}, ${AMBER})`, opacity: 0.35 }}
        />
        {sorted.map((s, i) => {
          const left = i % 2 === 0;
          const leafColor = i < sorted.length / 2 ? LEAF : AMBER;
          return (
            <motion.article
              key={s.order}
              initial={reduce ? false : { opacity: 0, x: left ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.7, delay: i * 0.06, ease: EASE }}
              className={`relative flex ${left ? "sm:justify-start" : "sm:justify-end"}`}
            >
              <div className={`w-full sm:w-[46%] ${left ? "sm:pr-8" : "sm:pl-8"}`}>
                <div
                  aria-hidden
                  className={`absolute top-8 hidden h-px sm:block ${left ? "left-[46%] right-1/2" : "left-1/2 right-[46%]"}`}
                  style={{ background: BARK, opacity: 0.4 }}
                />
                <div
                  aria-hidden
                  className="absolute left-1/2 top-6 hidden -translate-x-1/2 sm:block"
                >
                  <LeafGlyph size={22} color={leafColor} />
                </div>
                <div
                  className="rounded-2xl border p-6 shadow-sm backdrop-blur-sm"
                  style={{
                    background: "rgba(255,253,244,0.75)",
                    borderColor: "rgba(90,62,38,0.18)",
                  }}
                >
                  <div className="mb-3 flex items-center gap-3">
                    <LeafGlyph size={18} color={leafColor} />
                    <span className="text-[10px] uppercase tracking-[0.35em]" style={{ color: BARK }}>
                      Branch {String(s.order).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="font-display text-2xl leading-tight" style={{ color: EARTH }}>
                    {s.name}
                  </h3>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em]" style={{ color: accent }}>
                    {[s.date, s.startTime].filter(Boolean).join(" · ")}
                  </p>
                  {s.venueName && (
                    <p className="mt-2 text-sm italic" style={{ color: BARK }}>
                      at {s.venueName}
                    </p>
                  )}
                  {s.description && (
                    <p className="mt-3 text-sm leading-relaxed" style={{ color: EARTH, opacity: 0.75 }}>
                      {s.description}
                    </p>
                  )}
                  {s.dressCode && (
                    <p
                      className="mt-4 inline-block rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.2em]"
                      style={{ borderColor: BARK, color: BARK, opacity: 0.7 }}
                    >
                      {s.dressCode}
                    </p>
                  )}
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}

export const TreeoflifeTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || LEAF;
  const tagline = event.tagline?.trim() || "Rooted in love, growing in time.";
  const invitationMessage =
    event.invitationMessage?.trim() ||
    "Every year adds a ring, every season a leaf. Join us as we mark another season under the same familiar sky.";
  const aboutStory =
    event.aboutStory?.trim() ||
    "From a single seed, a life together. Each anniversary a branch reaching further, each memory a leaf catching the light. The tree keeps growing, and so do we.";
  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const hero =
    event.heroImageUrl ||
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80";

  const rootRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: rootRef, offset: ["start start", "end end"] });
  const treeProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroP, [0, 1], [0, -80]);
  const heroFade = useTransform(heroP, [0, 0.6], [1, 0]);

  const showStory = !event.hideStory;
  const showJourney = !event.hideEvents && subEvents.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  const treeProgressValue = treeProgress.get?.() ?? 0;

  return (
    <div
      ref={rootRef}
      className="relative min-h-screen overflow-x-clip font-sans antialiased"
      style={{
        "--accent": accent,
        background: `radial-gradient(ellipse at top, #fffaee 0%, ${CREAM} 45%, #f0e6cf 100%)`,
        color: EARTH,
      } as React.CSSProperties}
    >
      <CentralTree progress={treeProgressValue} reduce={reduce} />
      <FallingLeaves reduce={reduce} />
      <ScrollProgress color={accent} />

      {/* Hero — canopy above roots */}
      <section ref={heroRef} className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6 py-24">
        <motion.div style={reduce ? undefined : { opacity: heroFade }} className="absolute inset-0">
          <HeroMedia imageSrc={hero} videoSrc={event.heroVideoUrl || undefined} alt={event.eventTitle} className="opacity-40" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${CREAM}CC 0%, transparent 40%, ${CREAM}EE 100%)` }} />
        </motion.div>

        <motion.div style={reduce ? undefined : { y: heroY }} className="relative z-10 text-center">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="mb-6 flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.45em]"
            style={{ color: BARK }}
          >
            <LeafGlyph size={14} color={accent} />
            {tagline}
            <LeafGlyph size={14} color={accent} />
          </motion.p>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15, ease: EASE }}
            className="font-display text-[clamp(2.8rem,10vw,7rem)] leading-[0.95]"
            style={{ color: EARTH }}
          >
            {event.eventTitle}
          </motion.h1>
          {(event.person1Name || event.person2Name) && (
            <motion.p
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.9 }}
              className="mt-5 font-display text-xl italic"
              style={{ color: BARK }}
            >
              {event.person1Name}
              {event.person2Name ? ` & ${event.person2Name}` : ""}
            </motion.p>
          )}
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.9 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs uppercase tracking-[0.35em]"
            style={{ color: BARK }}
          >
            {event.mainDate && (
              <span>
                {new Date(event.mainDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </span>
            )}
            {event.city && <><span aria-hidden>~</span><span>{event.city}</span></>}
          </motion.div>
        </motion.div>
      </section>

      {/* Story — near the roots */}
      {showStory && (
        <section className="relative mx-auto max-w-4xl px-6 py-28 sm:py-36">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE }}
            className="text-center"
          >
            <div className="mb-6 flex items-center justify-center gap-2">
              <LeafGlyph size={18} color={LEAF} />
              <p className="text-[11px] uppercase tracking-[0.45em]" style={{ color: BARK }}>
                Where the roots run deep
              </p>
              <LeafGlyph size={18} color={LEAF} />
            </div>
            <h2 className="font-display text-3xl italic leading-[1.2] sm:text-4xl" style={{ color: EARTH }}>
              &ldquo;{invitationMessage}&rdquo;
            </h2>
            <div className="mx-auto my-10 h-px w-24" style={{ background: BARK, opacity: 0.4 }} />
            <p className="mx-auto max-w-2xl text-base leading-relaxed sm:text-lg" style={{ color: EARTH, opacity: 0.78 }}>
              {aboutStory}
            </p>
          </motion.div>
        </section>
      )}

      {/* Sub-events — the branches */}
      {showJourney && (
        <section className="relative py-24 sm:py-32">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-4 text-center text-[11px] uppercase tracking-[0.45em]"
            style={{ color: BARK }}
          >
            The branches of the day
          </motion.p>
          <h2 className="mb-14 text-center font-display text-3xl italic" style={{ color: EARTH }}>
            Each moment, a new branch
          </h2>
          <TreeTimeline items={subEvents} accent={accent} />
        </section>
      )}

      {/* Gallery — the leaves */}
      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-4 text-center text-[11px] uppercase tracking-[0.45em]"
            style={{ color: BARK }}
          >
            The leaves we've grown
          </motion.p>
          <h2 className="mb-14 text-center font-display text-3xl italic" style={{ color: EARTH }}>
            Memories, catching the light
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((m, i) => {
              const rot = ((i * 37) % 7) - 3;
              const tone = i % 3 === 0 ? LEAF : i % 3 === 1 ? AMBER : BLOSSOM;
              return (
                <motion.figure
                  key={`${m.fileName}-${i}`}
                  initial={reduce ? false : { opacity: 0, y: 30, rotate: rot }}
                  whileInView={{ opacity: 1, y: 0, rotate: rot }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.05, ease: EASE }}
                  whileHover={reduce ? undefined : { y: -6, rotate: 0 }}
                  className="group relative overflow-hidden rounded-[40%_60%_55%_45%/50%_45%_55%_50%] border shadow-md"
                  style={{ borderColor: tone, background: CREAM }}
                >
                  <img
                    src={m.publicUrl}
                    alt={m.caption ?? ""}
                    className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  {m.caption && (
                    <figcaption
                      className="absolute inset-x-0 bottom-0 p-4 text-xs italic opacity-0 transition-opacity group-hover:opacity-100"
                      style={{ background: `linear-gradient(0deg, ${EARTH}CC, transparent)`, color: CREAM }}
                    >
                      {m.caption}
                    </figcaption>
                  )}
                </motion.figure>
              );
            })}
            {editing && galleryItems.length === 0 && (
              <div
                className="col-span-full flex h-48 items-center justify-center rounded-3xl border-2 border-dashed text-sm italic"
                style={{ borderColor: BARK, color: BARK, opacity: 0.6 }}
              >
                + Add photos to grow new leaves
              </div>
            )}
          </div>
        </section>
      )}

      {/* Venue */}
      {showVenue && (
        <section className="relative mx-auto max-w-5xl px-6 py-24 sm:py-32">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-4 text-center text-[11px] uppercase tracking-[0.45em]"
            style={{ color: BARK }}
          >
            Where we gather
          </motion.p>
          <h2 className="mb-10 text-center font-display text-3xl italic" style={{ color: EARTH }}>
            Under the same sky
          </h2>
          {(event.venueName || event.venueAddress) && (
            <div className="mb-6 text-center">
              <p className="font-display text-2xl" style={{ color: EARTH }}>
                {event.venueName}
              </p>
              {event.venueAddress && (
                <p className="mt-1 text-sm" style={{ color: BARK }}>
                  {event.venueAddress}
                </p>
              )}
            </div>
          )}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="overflow-hidden rounded-3xl border p-1 shadow-lg"
            style={{ borderColor: "rgba(90,62,38,0.25)", background: "rgba(255,253,244,0.8)" }}
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

      {/* CTA / RSVP */}
      <section className="relative px-6 py-28 text-center sm:py-40">
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE }}
          className="mx-auto max-w-3xl"
        >
          <div className="mb-8 flex items-center justify-center gap-3">
            <LeafGlyph size={20} color={LEAF} />
            <LeafGlyph size={28} color={AMBER} />
            <LeafGlyph size={20} color={BLOSSOM} />
          </div>
          <h2 className="font-display text-[clamp(2.2rem,7vw,4.8rem)] italic leading-[1.05]" style={{ color: EARTH }}>
            Come sit beneath our tree
          </h2>
          {event.mainDate && (
            <p className="mt-4 text-sm uppercase tracking-[0.4em]" style={{ color: BARK }}>
              {new Date(event.mainDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
            </p>
          )}
          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <motion.div whileHover={reduce ? undefined : { scale: 1.03 }} className="mt-10 inline-block">
              <a
                href={event.rsvpLinkOrContact}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 rounded-full px-12 py-4 text-sm uppercase tracking-[0.32em] shadow-md transition-all"
                style={{ background: accent, color: CREAM }}
              >
                <LeafGlyph size={16} color={CREAM} />
                RSVP with us
              </a>
            </motion.div>
          )}
        </motion.div>
      </section>

      <footer
        className="relative border-t py-10 text-center text-xs"
        style={{ borderColor: "rgba(90,62,38,0.2)", color: BARK }}
      >
        <div className="mb-3 flex items-center justify-center gap-2 opacity-80">
          <LeafGlyph size={14} color={LEAF} />
          <LeafGlyph size={14} color={AMBER} />
          <LeafGlyph size={14} color={BLOSSOM} />
        </div>
        <p className="italic">
          {event.eventTitle}
          {event.person1Name ? ` · ${event.person1Name}` : ""}
          {event.person2Name ? ` & ${event.person2Name}` : ""}
        </p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default TreeoflifeTemplate;
