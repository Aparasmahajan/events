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

const BG = "#0a1929";
const CYAN = "#00d4ff";
const PINK = "#ff2d92";
const GREEN = "#00ff9c";
const TEXT = "#d8f0ff";

// Deterministic node positions across a 1000x600 viewBox.
const NODES: { x: number; y: number; r: number }[] = [
  { x: 80, y: 90, r: 3 },
  { x: 180, y: 200, r: 4 },
  { x: 260, y: 60, r: 2.5 },
  { x: 340, y: 320, r: 3.5 },
  { x: 420, y: 140, r: 3 },
  { x: 500, y: 260, r: 4 },
  { x: 580, y: 80, r: 3 },
  { x: 620, y: 380, r: 3 },
  { x: 700, y: 210, r: 4 },
  { x: 780, y: 120, r: 3 },
  { x: 840, y: 300, r: 3.5 },
  { x: 920, y: 180, r: 3 },
  { x: 140, y: 420, r: 3 },
  { x: 300, y: 500, r: 2.5 },
  { x: 460, y: 460, r: 3 },
  { x: 620, y: 540, r: 3.5 },
  { x: 780, y: 460, r: 3 },
  { x: 900, y: 520, r: 3 },
];

const EDGES: [number, number][] = [
  [0, 1], [1, 2], [1, 4], [2, 4], [3, 5], [4, 5], [4, 6],
  [5, 8], [6, 8], [6, 9], [8, 9], [8, 10], [9, 11], [10, 11],
  [0, 12], [12, 13], [13, 14], [3, 14], [14, 15], [7, 15],
  [15, 16], [10, 16], [16, 17], [11, 17], [5, 7], [7, 10],
];

function NeuralField({ reduce }: { reduce: boolean }) {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden" style={{ background: BG }}>
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 30% 20%, ${CYAN}14, transparent 55%), radial-gradient(ellipse at 80% 80%, ${PINK}0e, transparent 55%)`,
        }}
      />
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1000 600"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="node-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={CYAN} stopOpacity="0.9" />
            <stop offset="100%" stopColor={CYAN} stopOpacity="0" />
          </radialGradient>
        </defs>
        {EDGES.map(([a, b], i) => {
          const A = NODES[a];
          const B = NODES[b];
          return (
            <line
              key={i}
              x1={A.x}
              y1={A.y}
              x2={B.x}
              y2={B.y}
              stroke={CYAN}
              strokeOpacity="0.18"
              strokeWidth="0.6"
              strokeDasharray="4 6"
            >
              {!reduce && (
                <animate
                  attributeName="stroke-dashoffset"
                  from="0"
                  to="-40"
                  dur={`${3 + (i % 5)}s`}
                  repeatCount="indefinite"
                />
              )}
            </line>
          );
        })}
        {NODES.map((n, i) => (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r={n.r * 4} fill="url(#node-glow)" opacity="0.35" />
            <circle cx={n.x} cy={n.y} r={n.r} fill={CYAN} opacity="0.85">
              {!reduce && (
                <animate
                  attributeName="opacity"
                  values="0.5;1;0.5"
                  dur={`${2 + (i % 4) * 0.5}s`}
                  repeatCount="indefinite"
                />
              )}
            </circle>
          </g>
        ))}
      </svg>
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, ${CYAN}, ${CYAN} 1px, transparent 1px, transparent 3px)`,
        }}
      />
    </div>
  );
}

function HoloCard({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      className={`relative rounded-lg border p-6 backdrop-blur-md transition-all ${className ?? ""}`}
      style={{
        borderColor: `${CYAN}40`,
        background: `linear-gradient(135deg, ${CYAN}0a, ${BG}cc)`,
        boxShadow: `inset 0 0 30px ${CYAN}0a, 0 0 20px ${CYAN}12`,
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-lg opacity-[0.07]"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, ${TEXT}, ${TEXT} 1px, transparent 1px, transparent 4px)`,
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -top-px left-4 right-4 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${CYAN}, transparent)` }}
      />
      <div className="relative">{children}</div>
    </motion.div>
  );
}

function SectionLabel({ index, label }: { index: string; label: string }) {
  return (
    <p
      className="mb-6 font-mono text-[11px] uppercase tracking-[0.35em]"
      style={{ color: CYAN }}
    >
      [ {index} / {label} ]
    </p>
  );
}

function Sessions({ items }: { items: SubEvent[] }) {
  const reduce = useReducedMotion();
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <div className="mx-auto max-w-4xl px-6">
      <div className="grid gap-4">
        {sorted.map((s, i) => (
          <motion.article
            key={s.order}
            initial={reduce ? false : { opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
          >
            <HoloCard>
              <div className="flex flex-wrap items-baseline gap-3">
                <span
                  className="font-mono text-[11px] tracking-[0.2em]"
                  style={{ color: GREEN }}
                >
                  #{String(s.order).padStart(2, "0")}
                </span>
                <span
                  className="font-mono text-[11px] uppercase tracking-[0.25em] opacity-60"
                  style={{ color: CYAN }}
                >
                  {[s.date, s.startTime].filter(Boolean).join(" // ")}
                </span>
              </div>
              <h3 className="mt-3 font-display text-2xl tracking-tight" style={{ color: TEXT }}>
                {s.name}
              </h3>
              {s.venueName && (
                <p className="mt-1 font-mono text-xs opacity-60">&gt; venue: {s.venueName}</p>
              )}
              {s.description && (
                <p className="mt-3 text-sm leading-relaxed opacity-75">{s.description}</p>
              )}
              {s.dressCode && (
                <p
                  className="mt-4 inline-block rounded border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em]"
                  style={{ borderColor: `${PINK}66`, color: PINK }}
                >
                  {s.dressCode}
                </p>
              )}
            </HoloCard>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

export const NeuralTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || CYAN;
  const tagline = event.tagline?.trim() || "Signals from the frontier of intelligence.";
  const invitationMessage =
    event.invitationMessage?.trim() ||
    "A convening of researchers, builders, and thinkers charting what learning systems become next.";
  const aboutStory =
    event.aboutStory?.trim() ||
    "Two days of talks, workshops, and quiet corridors where the next generation of models, methods, and questions take shape. Bring your papers, your priors, and your open problems.";
  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const hero =
    event.heroImageUrl ||
    "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80";

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroP, [0, 1], [0, -80]);
  const heroOpacity = useTransform(heroP, [0, 0.6], [1, 0]);

  const showStory = !event.hideStory;
  const showSessions = !event.hideEvents && subEvents.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-sans antialiased"
      style={{ background: BG, color: TEXT, "--accent": accent } as React.CSSProperties}
    >
      <NeuralField reduce={reduce} />
      <ScrollProgress color={accent} />

      {/* HERO */}
      <section
        ref={heroRef}
        className="relative flex min-h-[720px] items-center justify-center overflow-hidden px-6 py-24 sm:py-32"
      >
        <motion.div style={reduce ? undefined : { y: heroY, opacity: heroOpacity }} className="absolute inset-0">
          <HeroMedia
            imageSrc={hero}
            videoSrc={event.heroVideoUrl || undefined}
            alt={event.eventTitle}
            className="opacity-25"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, ${BG}dd 0%, ${BG}66 40%, ${BG}ee 100%)`,
            }}
          />
        </motion.div>

        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="mb-6 font-mono text-[11px] uppercase tracking-[0.5em]"
            style={{ color: CYAN }}
          >
            [ neural / summit / {new Date().getFullYear()} ]
          </motion.p>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15, ease: EASE }}
            className="font-display text-[clamp(2.5rem,8vw,6rem)] font-bold leading-[0.95] tracking-tight"
            style={{ color: TEXT, textShadow: `0 0 40px ${CYAN}66` }}
          >
            {event.eventTitle}
          </motion.h1>
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mx-auto mt-8 max-w-2xl text-base leading-relaxed opacity-80 sm:text-lg"
          >
            {tagline}
          </motion.p>
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-[0.3em]"
          >
            {event.mainDate && (
              <span style={{ color: CYAN }}>
                {new Date(event.mainDate).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            )}
            {event.mainStartTime && (
              <span className="opacity-70">
                <span className="opacity-40">// </span>
                {event.mainStartTime}
              </span>
            )}
            {event.city && (
              <span className="opacity-70">
                <span className="opacity-40">// </span>
                {event.city}
              </span>
            )}
          </motion.div>

          {!reduce && (
            <motion.div
              aria-hidden
              animate={{ opacity: [0.3, 0.9, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="mx-auto mt-16 h-px w-40"
              style={{ background: `linear-gradient(90deg, transparent, ${GREEN}, transparent)` }}
            />
          )}
        </div>
      </section>

      {/* MISSION + CONTEXT */}
      {showStory && (
        <section className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <SectionLabel index="01" label="ABSTRACT" />
          <div className="grid gap-6 md:grid-cols-2">
            <HoloCard>
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: PINK }}>
                mission
              </p>
              <p className="font-display text-2xl leading-snug tracking-tight" style={{ color: TEXT }}>
                {invitationMessage}
              </p>
            </HoloCard>
            <HoloCard delay={0.1}>
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: PINK }}>
                context
              </p>
              <p className="text-base leading-relaxed opacity-80">{aboutStory}</p>
            </HoloCard>
          </div>
        </section>
      )}

      {/* SESSIONS */}
      {showSessions && (
        <section className="relative py-24 sm:py-32">
          <div className="mx-auto max-w-4xl px-6">
            <SectionLabel index="02" label="SESSIONS" />
          </div>
          <Sessions items={subEvents} />
        </section>
      )}

      {/* GALLERY */}
      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <SectionLabel index="03" label="ARCHIVE" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((m, i) => (
              <motion.div
                key={`${m.fileName}-${i}`}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="group relative overflow-hidden rounded-lg border"
                style={{ borderColor: `${CYAN}40`, boxShadow: `0 0 20px ${CYAN}10` }}
              >
                <img
                  src={m.publicUrl}
                  alt={m.caption ?? ""}
                  className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div
                  className="pointer-events-none absolute inset-0 opacity-40 mix-blend-screen"
                  style={{
                    background: `linear-gradient(180deg, transparent 60%, ${BG})`,
                  }}
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-px"
                  style={{ background: `linear-gradient(90deg, transparent, ${CYAN}, transparent)` }}
                />
                {m.caption && (
                  <p
                    className="absolute inset-x-0 bottom-0 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] opacity-80"
                    style={{ color: TEXT }}
                  >
                    &gt; {m.caption}
                  </p>
                )}
              </motion.div>
            ))}
            {editing && galleryItems.length === 0 && (
              <div
                className="col-span-full flex h-48 items-center justify-center rounded-lg border border-dashed font-mono text-sm opacity-60"
                style={{ borderColor: `${CYAN}66`, color: CYAN }}
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
          <SectionLabel index="04" label="LOCATION" />
          <HoloCard>
            {event.venueName && (
              <h3 className="font-display text-2xl tracking-tight" style={{ color: TEXT }}>
                {event.venueName}
              </h3>
            )}
            {event.venueAddress && (
              <p className="mt-2 font-mono text-xs uppercase tracking-[0.2em] opacity-70">
                {event.venueAddress}
              </p>
            )}
            <div
              className="mt-6 overflow-hidden rounded border"
              style={{ borderColor: `${CYAN}33` }}
            >
              <MapEmbed
                latitude={event.latitude}
                longitude={event.longitude}
                venueName={event.venueName}
                venueAddress={event.venueAddress}
                mapLink={event.mapLink}
              />
            </div>
          </HoloCard>
        </section>
      )}

      {/* CTA */}
      <section className="relative px-6 py-28 text-center sm:py-40">
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE }}
          className="mx-auto max-w-3xl"
        >
          <SectionLabel index="05" label="REGISTRATION" />
          <h2
            className="font-display text-[clamp(2rem,6vw,4rem)] font-bold leading-[1] tracking-tight"
            style={{ color: TEXT, textShadow: `0 0 40px ${CYAN}44` }}
          >
            Join the network.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base opacity-70">
            Attendance is by invitation. Request yours below.
          </p>
          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <motion.a
              href={event.rsvpLinkOrContact}
              target="_blank"
              rel="noreferrer"
              whileHover={reduce ? undefined : { scale: 1.03 }}
              className="mt-10 inline-block rounded-full border px-10 py-4 font-mono text-xs uppercase tracking-[0.35em] transition-all"
              style={{
                borderColor: CYAN,
                color: CYAN,
                boxShadow: `0 0 20px ${CYAN}33, inset 0 0 20px ${CYAN}11`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `${CYAN}18`;
                e.currentTarget.style.boxShadow = `0 0 40px ${CYAN}66, inset 0 0 20px ${CYAN}22`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.boxShadow = `0 0 20px ${CYAN}33, inset 0 0 20px ${CYAN}11`;
              }}
            >
              &gt; request access
            </motion.a>
          )}
        </motion.div>
      </section>

      <footer
        className="border-t py-8 text-center font-mono text-[11px] uppercase tracking-[0.3em] opacity-50"
        style={{ borderColor: `${CYAN}22`, color: TEXT }}
      >
        <p>
          <span style={{ color: GREEN }}>&gt;</span> {event.eventTitle}
          {event.person1Name ? ` // ${event.person1Name}` : ""} // signal.stable
        </p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default NeuralTemplate;
