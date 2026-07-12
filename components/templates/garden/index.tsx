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

const CREAM = "#faf7ee";
const LEAF = "#2a3d24";
const SAGE = "#88b06a";
const BLUSH = "#e8b7b0";
const GOLD = "#c8a460";

const BLOOMS = Array.from({ length: 18 }, (_, i) => ({
  x: `${(i * 53 + 7) % 96}%`,
  y: `${(i * 37 + 11) % 92}%`,
  size: 14 + ((i * 5) % 22),
  hue: i % 3 === 0 ? BLUSH : i % 3 === 1 ? GOLD : SAGE,
  delay: (i % 8) * 0.08,
  rot: (i * 23) % 360,
}));

const BUTTERFLIES = Array.from({ length: 8 }, (_, i) => ({
  startX: (i * 17) % 90,
  startY: (i * 29) % 80,
  dx: 18 + (i % 4) * 6,
  dy: 12 + (i % 3) * 5,
  dur: 14 + (i % 5) * 3,
  delay: (i % 6) * 1.4,
  scale: 0.7 + (i % 4) * 0.15,
  hue: i % 2 === 0 ? BLUSH : GOLD,
}));

function Bloom({ size, hue }: { size: number; hue: string }) {
  return (
    <svg width={size} height={size} viewBox="-20 -20 40 40" xmlns="http://www.w3.org/2000/svg">
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse
          key={a}
          cx="0"
          cy="-9"
          rx="5.2"
          ry="8"
          fill={hue}
          opacity="0.9"
          transform={`rotate(${a})`}
        />
      ))}
      <circle cx="0" cy="0" r="3.4" fill={GOLD} />
    </svg>
  );
}

function Butterfly({ hue, scale }: { hue: string; scale: number }) {
  const reduce = useReducedMotion();
  return (
    <svg width={22 * scale} height={18 * scale} viewBox="-12 -10 24 20" xmlns="http://www.w3.org/2000/svg">
      <motion.g
        animate={reduce ? undefined : { rotate: [-18, 18, -18] }}
        transition={{ duration: 0.35, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "0px 0px" }}
      >
        <path d="M0 0 C -3 -9 -10 -9 -11 -3 C -12 3 -6 5 0 0 Z" fill={hue} opacity="0.85" />
        <path d="M0 0 C -3 8 -9 8 -10 3 C -11 -1 -5 -3 0 0 Z" fill={hue} opacity="0.7" />
      </motion.g>
      <motion.g
        animate={reduce ? undefined : { rotate: [18, -18, 18] }}
        transition={{ duration: 0.35, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "0px 0px" }}
      >
        <path d="M0 0 C 3 -9 10 -9 11 -3 C 12 3 6 5 0 0 Z" fill={hue} opacity="0.85" />
        <path d="M0 0 C 3 8 9 8 10 3 C 11 -1 5 -3 0 0 Z" fill={hue} opacity="0.7" />
      </motion.g>
      <line x1="0" y1="-7" x2="0" y2="7" stroke={LEAF} strokeWidth="0.8" strokeLinecap="round" />
    </svg>
  );
}

function BloomField({ reduce }: { reduce: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {BLOOMS.map((b, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: b.x, top: b.y, transform: `rotate(${b.rot}deg)` }}
          initial={reduce ? false : { scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 0.85 }}
          viewport={{ once: true, margin: "-5% 0px" }}
          transition={{ duration: 0.9, delay: b.delay, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <Bloom size={b.size} hue={b.hue} />
        </motion.div>
      ))}
    </div>
  );
}

function ButterflySwarm({ reduce }: { reduce: boolean }) {
  if (reduce) return null;
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
      {BUTTERFLIES.map((bf, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: `${bf.startX}%`, top: `${bf.startY}%` }}
          animate={{
            x: [0, bf.dx * 6, bf.dx * 3, bf.dx * 8, 0],
            y: [0, -bf.dy * 4, -bf.dy * 8, -bf.dy * 5, 0],
            rotate: [0, 12, -8, 15, 0],
          }}
          transition={{ duration: bf.dur, delay: bf.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          <Butterfly hue={bf.hue} scale={bf.scale} />
        </motion.div>
      ))}
    </div>
  );
}

function LeafShadows({ reduce }: { reduce: boolean }) {
  const leaves = [
    { d: "M0 40 C 20 -10 60 -10 80 40 C 60 90 20 90 0 40 Z", x: "5%", y: "8%", scale: 1.4, dur: 8 },
    { d: "M0 40 C 20 -10 60 -10 80 40 C 60 90 20 90 0 40 Z", x: "70%", y: "20%", scale: 1.1, dur: 11 },
    { d: "M0 40 C 20 -10 60 -10 80 40 C 60 90 20 90 0 40 Z", x: "35%", y: "60%", scale: 1.6, dur: 9 },
    { d: "M0 40 C 20 -10 60 -10 80 40 C 60 90 20 90 0 40 Z", x: "82%", y: "70%", scale: 0.9, dur: 12 },
  ];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {leaves.map((l, i) => (
        <motion.svg
          key={i}
          width={140 * l.scale}
          height={100 * l.scale}
          viewBox="0 0 80 80"
          className="absolute"
          style={{ left: l.x, top: l.y, opacity: 0.18, filter: "blur(2px)" }}
          animate={reduce ? undefined : { rotate: [0, 6, -4, 0], x: [0, 8, -6, 0] }}
          transition={{ duration: l.dur, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d={l.d} fill={LEAF} />
        </motion.svg>
      ))}
    </div>
  );
}

function SteppingStones({ items, accent }: { items: SubEvent[]; accent: string }) {
  const reduce = useReducedMotion();
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <div className="relative mx-auto max-w-3xl px-6">
      <svg aria-hidden className="absolute inset-x-0 top-0 h-full w-full" preserveAspectRatio="none">
        <line
          x1="50%"
          y1="0"
          x2="50%"
          y2="100%"
          stroke={SAGE}
          strokeWidth="2"
          strokeDasharray="4 8"
          strokeLinecap="round"
          opacity="0.55"
        />
      </svg>
      <div className="relative flex flex-col gap-10">
        {sorted.map((s, i) => (
          <motion.article
            key={s.order}
            initial={reduce ? false : { opacity: 0, y: 24, scale: 0.94 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-8% 0px" }}
            transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
            className={`relative w-full sm:w-[68%] ${i % 2 === 0 ? "sm:self-start" : "sm:self-end"}`}
          >
            <div
              className="relative rounded-[999px_999px_999px_999px/60%_60%_60%_60%] border px-8 py-6 shadow-[0_10px_30px_-18px_rgba(42,61,36,0.45)]"
              style={{ background: "#fffdf6", borderColor: `${SAGE}55` }}
            >
              <div className="flex items-baseline gap-3">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-semibold"
                  style={{ background: accent, color: CREAM }}
                >
                  {String(s.order).padStart(2, "0")}
                </span>
                <span className="text-[10px] uppercase tracking-[0.32em]" style={{ color: `${LEAF}99` }}>
                  {[s.date, s.startTime].filter(Boolean).join(" · ")}
                </span>
              </div>
              <h3 className="mt-3 font-display text-2xl leading-tight" style={{ color: LEAF }}>
                {s.name}
              </h3>
              {s.venueName && (
                <p className="mt-1 text-sm italic" style={{ color: `${LEAF}b0` }}>
                  under the trellis at {s.venueName}
                </p>
              )}
              {s.description && (
                <p className="mt-3 text-sm leading-relaxed" style={{ color: `${LEAF}c0` }}>
                  {s.description}
                </p>
              )}
              {s.dressCode && (
                <p
                  className="mt-4 inline-block rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.24em]"
                  style={{ borderColor: `${GOLD}80`, color: GOLD }}
                >
                  {s.dressCode}
                </p>
              )}
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

export const GardenTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || SAGE;
  const tagline = event.tagline?.trim() || "In the garden, we said forever.";
  const invitationMessage =
    event.invitationMessage?.trim() ||
    "Wander with us through a garden in full bloom — where two hearts, tangled like ivy, promise the rest of their days.";
  const aboutStory =
    event.aboutStory?.trim() ||
    "It began on a Sunday afternoon among the roses, and grew — slowly, patiently — the way the best things do. Now we're planting the next chapter, and asking those we love most to stand among the blooms with us.";
  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const hero =
    event.heroImageUrl ||
    "https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=1800&q=80";

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(heroP, [0, 1], [1, 1.08]);
  const heroTextY = useTransform(heroP, [0, 0.6], [0, -60]);
  const heroOpacity = useTransform(heroP, [0, 0.6], [1, 0]);

  const showStory = !event.hideStory;
  const showJourney = !event.hideEvents && subEvents.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  const bloomDate = event.mainDate
    ? new Date(event.mainDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "";

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-sans antialiased"
      style={{ "--accent": accent, background: CREAM, color: LEAF } as React.CSSProperties}
    >
      <ScrollProgress color={accent} />
      <ButterflySwarm reduce={reduce} />

      {/* ─── 01. GATE ─── */}
      <section ref={heroRef} className="relative h-[100svh] min-h-[640px] overflow-hidden">
        <motion.div style={reduce ? undefined : { scale: heroScale }} className="absolute inset-0">
          <HeroMedia
            imageSrc={hero}
            videoSrc={event.heroVideoUrl || undefined}
            alt={event.eventTitle}
            className="opacity-80"
          />
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(180deg, ${CREAM}22 0%, ${CREAM}55 60%, ${CREAM} 100%)` }}
          />
        </motion.div>
        <LeafShadows reduce={reduce} />

        <motion.div
          style={reduce ? undefined : { y: heroTextY, opacity: heroOpacity }}
          className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
        >
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: EASE }}
            className="mb-8 text-[10px] uppercase tracking-[0.55em]"
            style={{ color: GOLD }}
          >
            An engagement in the garden
          </motion.p>
          <h1
            className="font-display text-[clamp(3rem,10vw,7.5rem)] leading-[0.94]"
            style={{ color: LEAF }}
          >
            {event.person1Name || event.eventTitle}
            {event.person2Name && (
              <>
                <span className="mx-4 italic font-normal" style={{ color: GOLD }}>
                  &amp;
                </span>
                {event.person2Name}
              </>
            )}
          </h1>
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="mt-6 font-display italic text-lg sm:text-xl"
            style={{ color: `${LEAF}c0` }}
          >
            {tagline}
          </motion.p>
          {bloomDate && (
            <motion.p
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 1 }}
              className="mt-10 text-[11px] uppercase tracking-[0.5em]"
              style={{ color: `${LEAF}90` }}
            >
              bloomed on {bloomDate}
              {event.city && ` · ${event.city}`}
            </motion.p>
          )}
        </motion.div>

        {!reduce && (
          <motion.div
            animate={{ y: [0, 8, 0], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.45em]"
            style={{ color: GOLD }}
          >
            wander in
          </motion.div>
        )}
      </section>

      {/* ─── 02. THE STORY ─── */}
      {showStory && (
        <section className="relative mx-auto max-w-4xl px-6 py-28 sm:py-36">
          <BloomField reduce={reduce} />
          <div className="relative text-center">
            <p className="mb-4 text-[10px] uppercase tracking-[0.5em]" style={{ color: GOLD }}>
              A love in bloom
            </p>
            <motion.h2
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: EASE }}
              className="font-display text-3xl leading-[1.2] sm:text-4xl"
              style={{ color: LEAF }}
            >
              {invitationMessage}
            </motion.h2>
            <motion.p
              initial={reduce ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, delay: 0.2 }}
              className="mx-auto mt-8 max-w-2xl text-base leading-relaxed sm:text-lg"
              style={{ color: `${LEAF}b8` }}
            >
              {aboutStory}
            </motion.p>
            <motion.div
              initial={reduce ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.3, delay: 0.4, ease: EASE }}
              className="mx-auto mt-10 h-px w-40 origin-left"
              style={{ background: `linear-gradient(90deg, transparent, ${SAGE}, transparent)` }}
            />
          </div>
        </section>
      )}

      {/* ─── 03. GARDEN PATH ─── */}
      {showJourney && (
        <section className="relative py-24 sm:py-32">
          <BloomField reduce={reduce} />
          <div className="relative">
            <motion.p
              initial={reduce ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-3 text-center text-[10px] uppercase tracking-[0.5em]"
              style={{ color: GOLD }}
            >
              follow the path
            </motion.p>
            <h2
              className="mb-14 text-center font-display italic text-2xl sm:text-3xl"
              style={{ color: LEAF }}
            >
              along the stepping stones
            </h2>
            <SteppingStones items={subEvents} accent={accent} />
          </div>
        </section>
      )}

      {/* ─── 04. GLASSHOUSE (GALLERY) ─── */}
      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-3 text-center text-[10px] uppercase tracking-[0.5em]"
            style={{ color: GOLD }}
          >
            the glasshouse
          </motion.p>
          <h2
            className="mb-12 text-center font-display italic text-2xl sm:text-3xl"
            style={{ color: LEAF }}
          >
            memories, pressed like petals
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((m, i) => (
              <motion.figure
                key={`${m.fileName}-${i}`}
                initial={reduce ? false : { opacity: 0, y: 20, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-6% 0px" }}
                transition={{ duration: 0.7, delay: i * 0.05, ease: EASE }}
                className="group relative overflow-hidden rounded-[24px] border"
                style={{ borderColor: `${SAGE}44`, background: "#fffdf6" }}
              >
                <img
                  src={m.publicUrl}
                  alt={m.caption ?? ""}
                  className="aspect-[4/5] w-full object-cover transition-transform duration-[900ms] group-hover:scale-105"
                  loading="lazy"
                />
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: `linear-gradient(180deg, transparent 55%, ${LEAF}bb)` }}
                />
                {m.caption && (
                  <figcaption
                    className="absolute inset-x-0 bottom-0 translate-y-3 px-5 pb-5 font-display italic text-sm opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
                    style={{ color: CREAM }}
                  >
                    {m.caption}
                  </figcaption>
                )}
              </motion.figure>
            ))}
            {editing && galleryItems.length === 0 && (
              <div
                className="col-span-full flex h-56 items-center justify-center rounded-[24px] border border-dashed text-sm"
                style={{ borderColor: `${SAGE}80`, color: `${LEAF}90` }}
              >
                + Add photos to the glasshouse
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
            className="mb-3 text-center text-[10px] uppercase tracking-[0.5em]"
            style={{ color: GOLD }}
          >
            find the garden
          </motion.p>
          <h2
            className="mb-2 text-center font-display text-3xl sm:text-4xl"
            style={{ color: LEAF }}
          >
            {event.venueName || "The Garden"}
          </h2>
          {event.venueAddress && (
            <p
              className="mb-10 text-center font-display italic text-base"
              style={{ color: `${LEAF}a0` }}
            >
              {event.venueAddress}
            </p>
          )}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE }}
            className="overflow-hidden rounded-[28px] border p-1 shadow-[0_18px_50px_-30px_rgba(42,61,36,0.55)]"
            style={{ borderColor: `${SAGE}55`, background: "#fffdf6" }}
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

      {/* ─── 06. RSVP / GATE ─── */}
      <section className="relative px-6 py-28 text-center sm:py-40">
        <BloomField reduce={reduce} />
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: EASE }}
          className="relative mx-auto max-w-3xl"
        >
          <p className="mb-4 text-[10px] uppercase tracking-[0.5em]" style={{ color: GOLD }}>
            you are invited
          </p>
          <h2
            className="font-display text-[clamp(2.4rem,7vw,4.8rem)] leading-[0.98]"
            style={{ color: LEAF }}
          >
            {event.eventTitle}
          </h2>
          <p
            className="mx-auto mt-6 max-w-xl font-display italic text-base sm:text-lg"
            style={{ color: `${LEAF}b0` }}
          >
            step through the hedge — a chair among the roses is waiting for you.
          </p>
          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <motion.div whileHover={reduce ? undefined : { scale: 1.03 }} className="mt-10 inline-block">
              <a
                href={event.rsvpLinkOrContact}
                target="_blank"
                rel="noreferrer"
                className="inline-block rounded-full border px-12 py-4 text-xs uppercase tracking-[0.4em] transition-all"
                style={{ background: accent, borderColor: accent, color: CREAM }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 14px 34px -14px ${accent}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                reply with joy
              </a>
            </motion.div>
          )}
        </motion.div>
      </section>

      <footer
        className="border-t py-10 text-center text-xs"
        style={{ borderColor: `${SAGE}40`, color: `${LEAF}90` }}
      >
        <p className="font-display italic text-sm">
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

export default GardenTemplate;
