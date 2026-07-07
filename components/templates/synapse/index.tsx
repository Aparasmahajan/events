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

const NODES: { x: number; y: number; r: number }[] = [
  { x: 6, y: 12, r: 1.6 }, { x: 14, y: 22, r: 2.2 }, { x: 21, y: 8, r: 1.4 },
  { x: 28, y: 30, r: 2.6 }, { x: 34, y: 15, r: 1.8 }, { x: 42, y: 24, r: 2.2 },
  { x: 48, y: 10, r: 1.6 }, { x: 55, y: 20, r: 2.4 }, { x: 62, y: 32, r: 2 },
  { x: 68, y: 14, r: 1.8 }, { x: 74, y: 26, r: 2.2 }, { x: 82, y: 12, r: 1.5 },
  { x: 88, y: 22, r: 1.9 }, { x: 94, y: 8, r: 1.4 }, { x: 4, y: 38, r: 1.8 },
  { x: 12, y: 48, r: 2.2 }, { x: 20, y: 42, r: 1.6 }, { x: 26, y: 54, r: 2.4 },
  { x: 34, y: 46, r: 2 }, { x: 40, y: 58, r: 1.8 }, { x: 48, y: 44, r: 2.6 },
  { x: 55, y: 55, r: 2 }, { x: 62, y: 48, r: 1.8 }, { x: 70, y: 60, r: 2.2 },
  { x: 78, y: 44, r: 1.6 }, { x: 84, y: 52, r: 2 }, { x: 92, y: 46, r: 1.8 },
  { x: 8, y: 68, r: 2 }, { x: 16, y: 78, r: 1.6 }, { x: 24, y: 72, r: 2.2 },
  { x: 32, y: 84, r: 1.8 }, { x: 40, y: 76, r: 2.4 }, { x: 48, y: 88, r: 2 },
  { x: 56, y: 74, r: 1.8 }, { x: 64, y: 82, r: 2.2 }, { x: 72, y: 76, r: 1.6 },
  { x: 80, y: 86, r: 2 }, { x: 88, y: 72, r: 1.8 }, { x: 96, y: 82, r: 1.6 },
  { x: 10, y: 90, r: 1.4 }, { x: 44, y: 5, r: 1.4 }, { x: 76, y: 4, r: 1.4 },
];

const LINKS: [number, number][] = [
  [0, 1], [1, 2], [2, 4], [3, 5], [4, 5], [5, 6], [5, 7], [7, 8], [7, 9],
  [9, 10], [10, 11], [11, 12], [12, 13], [1, 15], [3, 17], [5, 20], [7, 21],
  [9, 23], [11, 25], [14, 15], [15, 16], [16, 17], [17, 18], [18, 19], [19, 20],
  [20, 21], [21, 22], [22, 23], [23, 24], [24, 25], [25, 26], [15, 28], [17, 30],
  [19, 32], [21, 33], [23, 35], [25, 37], [27, 28], [28, 29], [29, 30], [30, 31],
  [31, 32], [32, 33], [33, 34], [34, 35], [35, 36], [36, 37], [37, 38], [27, 39],
  [2, 40], [11, 41], [4, 6], [16, 18], [22, 24], [30, 32],
];

const PULSES: number[] = [0, 4, 8, 12, 18, 24, 30, 38, 44, 50];

function NeuronGraph({ reduce, accent }: { reduce: boolean; accent: string }) {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <radialGradient id="syn-node-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={accent} stopOpacity="0.9" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </radialGradient>
        </defs>
        {LINKS.map(([a, b], i) => {
          const n1 = NODES[a], n2 = NODES[b];
          return (
            <line
              key={i}
              x1={n1.x} y1={n1.y} x2={n2.x} y2={n2.y}
              stroke={accent}
              strokeWidth="0.08"
              strokeOpacity="0.22"
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
        {NODES.map((n, i) => (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r={n.r * 0.7} fill={accent} opacity="0.75" />
            <circle cx={n.x} cy={n.y} r={n.r * 1.8} fill="url(#syn-node-glow)" opacity="0.35" />
          </g>
        ))}
        {!reduce && PULSES.map((linkIdx, i) => {
          const link = LINKS[linkIdx % LINKS.length];
          const n1 = NODES[link[0]], n2 = NODES[link[1]];
          return (
            <motion.circle
              key={i}
              r="0.45"
              fill="#ff5eac"
              initial={{ cx: n1.x, cy: n1.y, opacity: 0 }}
              animate={{ cx: [n1.x, n2.x], cy: [n1.y, n2.y], opacity: [0, 1, 0] }}
              transition={{ duration: 2.4 + (i % 4) * 0.4, delay: i * 0.35, repeat: Infinity, ease: "linear" }}
              style={{ filter: "drop-shadow(0 0 1px #ff5eac)" }}
            />
          );
        })}
      </svg>
    </div>
  );
}

function SynapseField({ reduce, accent }: { reduce: boolean; accent: string }) {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #0d0f2a 0%, #14163a 45%, #1c1e46 100%)" }} />
      <div className="absolute inset-0 opacity-40">
        <NeuronGraph reduce={reduce} accent={accent} />
      </div>
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(77,208,255,0.08), transparent 60%)" }} />
    </div>
  );
}

function DrawLine({ delay = 0, className }: { delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.svg viewBox="0 0 400 2" preserveAspectRatio="none" className={`h-[2px] w-full ${className ?? ""}`}>
      <motion.line
        x1="0" y1="1" x2="400" y2="1"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="400"
        initial={reduce ? false : { strokeDashoffset: 400 }}
        whileInView={{ strokeDashoffset: 0 }}
        viewport={{ once: true, margin: "-15% 0px" }}
        transition={{ duration: 1.6, delay, ease: EASE }}
      />
    </motion.svg>
  );
}

function NodeCard({ s, i, accent }: { s: SubEvent; i: number; accent: string }) {
  const reduce = useReducedMotion();
  const label = `NODE.${String(s.order).padStart(2, "0")}`;
  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 24, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
      className="relative"
    >
      <div
        className="relative overflow-hidden p-6 backdrop-blur-md"
        style={{
          background: "linear-gradient(140deg, rgba(77,208,255,0.06), rgba(255,94,172,0.03))",
          border: "1px solid rgba(77,208,255,0.18)",
          clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)",
        }}
      >
        <div className="flex items-center gap-2">
          <motion.span
            aria-hidden
            className="h-2 w-2 rounded-full"
            style={{ background: accent, boxShadow: `0 0 8px ${accent}` }}
            animate={reduce ? undefined : { opacity: [0.4, 1, 0.4], scale: [0.9, 1.2, 0.9] }}
            transition={{ duration: 1.6 + (i % 3) * 0.3, repeat: Infinity, ease: "easeInOut" }}
          />
          <span className="font-mono text-[10px] uppercase tracking-[0.35em]" style={{ color: accent }}>
            {label} &mdash; connection
          </span>
        </div>
        <h3 className="mt-4 font-display text-xl font-semibold tracking-tight text-[#e8ecfc]">{s.name}</h3>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-[#e8ecfc]/50">
          {[s.date, s.startTime].filter(Boolean).join(" · ")}
        </p>
        {s.venueName && <p className="mt-3 text-sm text-[#e8ecfc]/70">@ {s.venueName}</p>}
        {s.description && <p className="mt-2 text-sm leading-relaxed text-[#e8ecfc]/60">{s.description}</p>}
        {s.dressCode && (
          <p className="mt-3 inline-block border border-[#f4c060]/40 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[#f4c060]">
            {s.dressCode}
          </p>
        )}
      </div>
    </motion.article>
  );
}

function MeetingNucleus({ reduce, accent }: { reduce: boolean; accent: string }) {
  const rays = Array.from({ length: 12 }, (_, i) => (i * Math.PI * 2) / 12);
  return (
    <svg viewBox="-100 -100 200 200" className="mx-auto h-56 w-56 sm:h-72 sm:w-72" aria-hidden>
      <defs>
        <radialGradient id="syn-nucleus-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={accent} stopOpacity="1" />
          <stop offset="60%" stopColor={accent} stopOpacity="0.25" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>
      {rays.map((a, i) => {
        const x = Math.cos(a) * 90;
        const y = Math.sin(a) * 90;
        return (
          <g key={i}>
            <line x1={x} y1={y} x2="0" y2="0" stroke={accent} strokeWidth="0.6" strokeOpacity="0.35" />
            <circle cx={x} cy={y} r="2.2" fill="#ff5eac" opacity="0.85" />
          </g>
        );
      })}
      <circle cx="0" cy="0" r="45" fill="url(#syn-nucleus-glow)" />
      <motion.circle
        cx="0" cy="0"
        r="14"
        fill={accent}
        animate={reduce ? undefined : { r: [14, 18, 14], opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        style={{ filter: `drop-shadow(0 0 12px ${accent})` }}
      />
      <circle cx="0" cy="0" r="7" fill="#f4c060" />
    </svg>
  );
}

export const SynapseTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || "#4dd0ff";
  const tagline = event.tagline?.trim() || "Where minds connect.";
  const invitationMessage = event.invitationMessage?.trim() || "Every attendee is a neuron. Every conversation, a synapse. Together, we build intelligence.";
  const aboutStory = event.aboutStory?.trim() || "";
  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const hero = event.heroImageUrl || "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1600&q=80";

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroTextY = useTransform(heroP, [0, 0.5], [0, -40]);
  const heroOpacity = useTransform(heroP, [0, 0.6], [1, 0]);

  const showStory = !event.hideStory;
  const showEvents = !event.hideEvents && subEvents.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-sans text-[#e8ecfc] antialiased"
      style={{ "--accent": accent, background: "#0d0f2a" } as React.CSSProperties}
    >
      <SynapseField reduce={reduce} accent={accent} />
      <ScrollProgress color={accent} />

      <section ref={heroRef} className="relative min-h-[100svh] pb-24 sm:pb-28 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-25">
          <HeroMedia imageSrc={hero} videoSrc={event.heroVideoUrl || undefined} alt={event.eventTitle} className="opacity-40" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(13,15,42,0.85) 0%, rgba(13,15,42,0.65) 50%, rgba(13,15,42,0.95) 100%)" }} />
        </div>
        <div className="absolute inset-0">
          <NeuronGraph reduce={reduce} accent={accent} />
        </div>

        <motion.div style={reduce ? undefined : { y: heroTextY, opacity: heroOpacity }} className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="mb-6 font-mono text-[10px] uppercase tracking-[0.6em]"
            style={{ color: accent }}
          >
            {tagline}
          </motion.p>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: EASE }}
            className="font-display text-[clamp(2.6rem,9vw,6.5rem)] font-semibold leading-[0.95] tracking-tight"
            style={{ color: "#e8ecfc" }}
          >
            {event.eventTitle}
          </motion.h1>
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="mx-auto mt-8 max-w-lg"
            style={{ color: accent }}
          >
            <DrawLine delay={0.4} />
          </motion.div>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="mt-6 flex flex-wrap justify-center gap-4 font-mono text-[11px] uppercase tracking-[0.35em] text-[#e8ecfc]/70"
          >
            {event.mainDate && (
              <span>
                {new Date(event.mainDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
              </span>
            )}
            {event.mainStartTime && <span className="opacity-40">/</span>}
            {event.mainStartTime && <span>{event.mainStartTime}</span>}
            {event.city && <><span className="opacity-40">/</span><span>{event.city}</span></>}
          </motion.div>
        </motion.div>
      </section>

      {showStory && (
        <section className="relative mx-auto max-w-5xl px-6 py-24 sm:py-32">
          <div className="grid items-start gap-12 sm:grid-cols-5">
            <motion.div
              initial={reduce ? false : { opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: EASE }}
              className="sm:col-span-2"
            >
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.5em]" style={{ color: accent }}>
                Signal &mdash; 01
              </p>
              <h2 className="font-display text-3xl leading-[1.1] tracking-tight sm:text-4xl">
                {invitationMessage}
              </h2>
              <div className="mt-6" style={{ color: accent }}>
                <DrawLine />
              </div>
            </motion.div>
            <motion.div
              initial={reduce ? false : { opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
              className="sm:col-span-3"
            >
              <p className="text-base leading-relaxed text-[#e8ecfc]/70 sm:text-lg">
                {aboutStory || "A gathering built on the physics of introduction. Each conversation is a connection formed; each connection, a signal that echoes into the next room. The graph gets denser as the night goes on."}
              </p>
            </motion.div>
          </div>
        </section>
      )}

      {showEvents && (
        <section className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <div className="mb-14 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.5em]" style={{ color: accent }}>
              Network &mdash; sequence
            </p>
            <h2 className="mt-3 font-display text-3xl tracking-tight sm:text-4xl">The Connections</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[...subEvents].sort((a, b) => a.order - b.order).map((s, i) => (
              <NodeCard key={s.order} s={s} i={i} accent={accent} />
            ))}
          </div>
        </section>
      )}

      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-24 sm:py-28">
          <div className="mb-12 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.5em]" style={{ color: accent }}>
              Impulses &mdash; captured
            </p>
            <h2 className="mt-3 font-display text-3xl tracking-tight sm:text-4xl">The Room, Firing</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((m, i) => (
              <motion.figure
                key={`${m.fileName}-${i}`}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.6, delay: (i % 6) * 0.05 }}
                className="group relative overflow-hidden"
                style={{ border: "1px solid rgba(77,208,255,0.18)" }}
              >
                <img
                  src={m.publicUrl}
                  alt={m.caption ?? ""}
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0d0f2a]/70 via-transparent to-transparent" />
                {m.caption && (
                  <figcaption className="absolute inset-x-0 bottom-0 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#e8ecfc]/80">
                    {m.caption}
                  </figcaption>
                )}
              </motion.figure>
            ))}
            {editing && galleryItems.length === 0 && (
              <div className="col-span-full flex h-48 items-center justify-center border border-dashed border-[#4dd0ff]/40 font-mono text-sm text-[#e8ecfc]/50">
                + Add photos
              </div>
            )}
          </div>
        </section>
      )}

      {showVenue && (
        <section className="relative mx-auto max-w-5xl px-6 py-24 sm:py-32">
          <div className="mb-10 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.5em]" style={{ color: accent }}>
              Nucleus &mdash; the meeting point
            </p>
            <h2 className="mt-3 font-display text-3xl tracking-tight sm:text-4xl">{event.venueName || "The Venue"}</h2>
            {event.venueAddress && <p className="mt-2 text-sm text-[#e8ecfc]/60">{event.venueAddress}</p>}
          </div>
          <MeetingNucleus reduce={reduce} accent={accent} />
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="mt-10 overflow-hidden"
            style={{ border: "1px solid rgba(77,208,255,0.2)" }}
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

      <section className="relative px-6 py-28 text-center sm:py-40">
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE }}
          className="mx-auto max-w-2xl"
        >
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.6em]" style={{ color: accent }}>
            Signal to receive
          </p>
          <h2 className="font-display text-[clamp(2.2rem,6.5vw,4.6rem)] font-semibold leading-[1] tracking-tight">
            Join the network.
          </h2>
          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <motion.div whileHover={reduce ? undefined : { scale: 1.03 }} className="mt-10 inline-block">
              <a
                href={event.rsvpLinkOrContact}
                target="_blank"
                rel="noreferrer"
                className="inline-block px-10 py-3.5 font-mono text-xs uppercase tracking-[0.4em] transition-all"
                style={{ background: accent, color: "#0d0f2a", boxShadow: `0 0 0 1px ${accent}` }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 0 40px ${accent}`; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = `0 0 0 1px ${accent}`; }}
              >
                Confirm connection
              </a>
            </motion.div>
          )}
          {(event.contactName || event.contactEmail) && (
            <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.3em] text-[#e8ecfc]/60">
              {[event.contactName, event.contactEmail].filter(Boolean).join(" · ")}
            </p>
          )}
        </motion.div>
      </section>

      <footer className="relative border-t border-[#4dd0ff]/15 py-8 text-center font-mono text-[11px] uppercase tracking-[0.35em] text-[#e8ecfc]/40">
        <p>{event.eventTitle}{event.person1Name ? ` · ${event.person1Name}` : ""}</p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default SynapseTemplate;
