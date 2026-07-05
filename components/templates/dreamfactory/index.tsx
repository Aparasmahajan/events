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

const CREAM = "#f5eee0";
const TEAL = "#3a8a92";
const ORANGE = "#f77c3c";
const MUSTARD = "#e8b02c";
const COFFEE = "#3e2a1a";
const CARDBOARD = "#c69565";

const GEARS = [
  { top: "-6%", left: "-6%", size: 220, dur: 22, dir: 1, teeth: 12, color: TEAL },
  { top: "4%", right: "-4%", size: 160, dur: 14, dir: -1, teeth: 10, color: MUSTARD },
  { bottom: "-8%", left: "10%", size: 180, dur: 18, dir: -1, teeth: 11, color: ORANGE },
  { bottom: "2%", right: "6%", size: 130, dur: 10, dir: 1, teeth: 9, color: TEAL },
  { top: "40%", left: "45%", size: 90, dur: 8, dir: 1, teeth: 8, color: COFFEE },
];

const PIPES = [
  { d: "M-40,120 C 200,60 380,240 640,140 S 1040,60 1280,180", color: TEAL, particles: 4, dur: 9 },
  { d: "M-40,320 C 220,420 460,240 720,340 S 1080,420 1280,300", color: ORANGE, particles: 3, dur: 11 },
  { d: "M-40,520 C 260,460 500,600 780,520 S 1080,460 1280,540", color: MUSTARD, particles: 5, dur: 13 },
  { d: "M-40,720 C 240,780 520,660 800,740 S 1080,820 1280,700", color: TEAL, particles: 3, dur: 15 },
];

function Gear({ size, teeth, color }: { size: number; teeth: number; color: string }) {
  const r = size / 2;
  const inner = r * 0.62;
  const toothH = r * 0.16;
  const points = Array.from({ length: teeth * 2 }, (_, i) => {
    const angle = (i / (teeth * 2)) * Math.PI * 2;
    const rad = i % 2 === 0 ? r : r - toothH;
    return `${Math.cos(angle) * rad + r},${Math.sin(angle) * rad + r}`;
  }).join(" ");
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      <polygon points={points} fill={color} opacity="0.18" />
      <circle cx={r} cy={r} r={inner * 0.9} fill="none" stroke={color} strokeWidth="2" opacity="0.35" />
      <circle cx={r} cy={r} r={inner * 0.35} fill={color} opacity="0.4" />
    </svg>
  );
}

function FactoryField({ reduce }: { reduce: boolean }) {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden" style={{ background: CREAM }}>
      <svg className="absolute inset-0 h-full w-full opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
        <filter id="df-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" />
        </filter>
        <rect width="100%" height="100%" filter="url(#df-noise)" />
      </svg>
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1280 900"
        preserveAspectRatio="none"
      >
        {PIPES.map((p, i) => (
          <g key={i}>
            <path
              d={p.d}
              stroke={p.color}
              strokeWidth={14}
              fill="none"
              opacity="0.12"
              strokeLinecap="round"
            />
            <path
              d={p.d}
              stroke={p.color}
              strokeWidth={2}
              fill="none"
              opacity="0.35"
              strokeDasharray="4 8"
            />
            {!reduce &&
              Array.from({ length: p.particles }).map((_, k) => (
                <circle key={k} r={3} fill={p.color}>
                  <animateMotion
                    dur={`${p.dur + k}s`}
                    repeatCount="indefinite"
                    begin={`${k * (p.dur / p.particles)}s`}
                    path={p.d}
                  />
                </circle>
              ))}
          </g>
        ))}
      </svg>
    </div>
  );
}

function ConveyorBelt({ reduce }: { reduce: boolean }) {
  const items = ["\u{1F388}", "\u{1F381}", "\u{1F382}", "\u{1F389}", "\u{1F36D}", "\u{1F388}", "\u{1F381}"];
  return (
    <div className="relative mx-auto mb-14 max-w-6xl px-6">
      <div
        className="relative h-20 overflow-hidden rounded-full border-2"
        style={{ borderColor: COFFEE, background: `linear-gradient(180deg, ${COFFEE} 0%, #2a1a0e 100%)` }}
      >
        <div className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2" style={{ background: MUSTARD, opacity: 0.4 }} />
        {!reduce && (
          <motion.div
            className="absolute inset-y-0 flex items-center gap-14 pl-6"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          >
            {[...items, ...items].map((ic, i) => (
              <span
                key={i}
                className="flex h-12 w-12 flex-none items-center justify-center rounded-lg text-2xl shadow-md"
                style={{ background: CREAM, border: `2px solid ${MUSTARD}` }}
              >
                {ic}
              </span>
            ))}
          </motion.div>
        )}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 pb-1">
          {Array.from({ length: 16 }).map((_, i) => (
            <span key={i} className="h-2 w-2 rounded-full" style={{ background: MUSTARD, opacity: 0.5 }} />
          ))}
        </div>
      </div>
      <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.4em]" style={{ color: COFFEE, opacity: 0.55 }}>
        BELT 07 // OUTPUT: JOY UNITS
      </p>
    </div>
  );
}

function FactoryTimeline({ items }: { items: SubEvent[] }) {
  const reduce = useReducedMotion();
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <div className="mx-auto max-w-5xl px-6">
      <ConveyorBelt reduce={!!reduce} />
      <div className="grid gap-5 sm:grid-cols-2">
        {sorted.map((s, i) => (
          <motion.article
            key={s.order}
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="relative rounded-2xl border-2 p-6"
            style={{ borderColor: COFFEE, background: "#fdf7ea", boxShadow: `6px 6px 0 ${COFFEE}` }}
          >
            <div className="mb-3 flex items-center justify-between">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full font-mono text-xs font-bold"
                style={{ background: ORANGE, color: CREAM }}
              >
                {String(s.order).padStart(2, "0")}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em]" style={{ color: TEAL }}>
                STATION {String(s.order).padStart(2, "0")} / QUALITY CHECK
              </span>
            </div>
            <h3 className="font-display text-2xl font-black tracking-tight" style={{ color: COFFEE }}>
              {s.name}
            </h3>
            <p className="mt-1 font-mono text-xs" style={{ color: TEAL }}>
              {[s.date, s.startTime].filter(Boolean).join(" • ")}
            </p>
            {s.venueName && (
              <p className="mt-2 text-sm" style={{ color: COFFEE, opacity: 0.75 }}>
                @ {s.venueName}
              </p>
            )}
            {s.description && (
              <p className="mt-2 text-sm leading-relaxed" style={{ color: COFFEE, opacity: 0.7 }}>
                {s.description}
              </p>
            )}
            {s.dressCode && (
              <p
                className="mt-4 inline-block rounded-full border-2 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em]"
                style={{ borderColor: MUSTARD, color: MUSTARD }}
              >
                DRESS: {s.dressCode}
              </p>
            )}
          </motion.article>
        ))}
      </div>
    </div>
  );
}

function Crate({
  src,
  caption,
  index,
  reduce,
}: {
  src: string;
  caption?: string;
  index: number;
  reduce: boolean;
}) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group relative p-3"
      style={{ background: CARDBOARD, border: `2px solid ${COFFEE}`, boxShadow: `5px 5px 0 ${COFFEE}` }}
    >
      <div className="absolute left-2 top-2 z-10 rounded-sm border-2 px-1.5 py-0.5 font-mono text-[8px] font-black uppercase tracking-widest" style={{ borderColor: ORANGE, color: ORANGE, background: CREAM }}>
        FRAGILE
      </div>
      <div className="absolute right-2 top-2 z-10 font-mono text-[8px] font-bold" style={{ color: COFFEE, opacity: 0.6 }}>
        #{String(index + 1).padStart(3, "0")}
      </div>
      <div className="overflow-hidden" style={{ background: COFFEE }}>
        <img
          src={src}
          alt={caption ?? ""}
          className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="mt-2 flex items-center justify-between font-mono text-[9px] uppercase tracking-widest" style={{ color: COFFEE }}>
        <span>MEMORY</span>
        <span>QC ✓</span>
      </div>
    </motion.div>
  );
}

export const DreamfactoryTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || TEAL;
  const tagline = event.tagline?.trim() || "Where wishes get manufactured.";
  const invitationMessage =
    event.invitationMessage?.trim() ||
    "The factory floor is warming up. Assembly lines humming, gears turning, cakes rolling off belt seven. Your presence completes the production line.";
  const aboutStory = event.aboutStory?.trim() || "";
  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const hero =
    event.heroImageUrl ||
    "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1600&q=80";

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroP, [0, 1], [0, -80]);

  const showStory = !event.hideStory;
  const showEvents = !event.hideEvents && subEvents.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-sans antialiased"
      style={{ "--accent": accent, background: CREAM, color: COFFEE } as React.CSSProperties}
    >
      <FactoryField reduce={reduce} />
      <ScrollProgress color={accent} />

      {/* HERO — MAIN FLOOR */}
      <section ref={heroRef} className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6 py-24">
        {GEARS.map((g, i) => (
          <div
            key={i}
            className="pointer-events-none absolute"
            style={{ top: g.top, left: g.left, right: g.right, bottom: g.bottom }}
          >
            <motion.div
              animate={reduce ? undefined : { rotate: g.dir * 360 }}
              transition={{ duration: g.dur, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: "center" }}
            >
              <Gear size={g.size} teeth={g.teeth} color={g.color} />
            </motion.div>
          </div>
        ))}

        <motion.div style={reduce ? undefined : { y: heroY }} className="relative z-10 mx-auto max-w-4xl text-center">
          <div
            className="mx-auto mb-8 inline-flex items-center gap-3 rounded-full border-2 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.35em]"
            style={{ borderColor: COFFEE, background: CREAM, color: COFFEE }}
          >
            <span className="h-2 w-2 animate-pulse rounded-full" style={{ background: ORANGE }} />
            DREAM FACTORY — SHIFT ACTIVE
          </div>

          <h1
            className="font-display font-black uppercase leading-[0.9] tracking-tight"
            style={{ fontSize: "clamp(3rem, 11vw, 8.5rem)", color: COFFEE }}
          >
            {event.eventTitle}
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg italic" style={{ color: TEAL }}>
            {tagline}
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em]" style={{ color: COFFEE }}>
            {event.mainDate && (
              <span className="rounded-md border-2 px-4 py-2" style={{ borderColor: COFFEE, background: MUSTARD }}>
                {new Date(event.mainDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
              </span>
            )}
            {event.mainStartTime && (
              <span className="rounded-md border-2 px-4 py-2" style={{ borderColor: COFFEE, background: ORANGE, color: CREAM }}>
                {event.mainStartTime}
              </span>
            )}
            {event.city && (
              <span className="rounded-md border-2 px-4 py-2" style={{ borderColor: COFFEE, background: CREAM }}>
                {event.city}
              </span>
            )}
          </div>

          <div className="mx-auto mt-12 max-w-md overflow-hidden rounded-2xl border-2" style={{ borderColor: COFFEE, boxShadow: `6px 6px 0 ${COFFEE}` }}>
            <HeroMedia imageSrc={hero} videoSrc={event.heroVideoUrl || undefined} alt={event.eventTitle} className="aspect-video" />
          </div>
        </motion.div>
      </section>

      {/* STORY — BLUEPRINT */}
      {showStory && (
        <section className="relative mx-auto max-w-5xl px-6 py-24 sm:py-32">
          <div className="grid items-start gap-12 sm:grid-cols-5">
            <motion.div
              initial={reduce ? false : { opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: EASE }}
              className="sm:col-span-2"
            >
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.4em]" style={{ color: ORANGE }}>
                BLUEPRINT / DOC 01
              </p>
              <h2 className="font-display text-4xl font-black uppercase leading-[1] tracking-tight sm:text-5xl" style={{ color: COFFEE }}>
                Assembly instructions.
              </h2>
              <div className="mt-6 h-1 w-24" style={{ background: ORANGE }} />
            </motion.div>
            <motion.div
              initial={reduce ? false : { opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
              className="sm:col-span-3"
            >
              <div
                className="rounded-2xl border-2 p-8"
                style={{ borderColor: COFFEE, background: "#fdf7ea", boxShadow: `6px 6px 0 ${TEAL}` }}
              >
                <p className="text-lg leading-relaxed" style={{ color: COFFEE }}>
                  {invitationMessage}
                </p>
                {aboutStory && (
                  <p className="mt-4 text-base leading-relaxed" style={{ color: COFFEE, opacity: 0.75 }}>
                    {aboutStory}
                  </p>
                )}
                <div className="mt-6 flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: TEAL }}>
                  <span>APPROVED</span>
                  <span className="h-px flex-1" style={{ background: TEAL, opacity: 0.4 }} />
                  <span>SHIP TO GUESTS</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* SUB-EVENTS — PRODUCTION LINE */}
      {showEvents && (
        <section className="relative py-24 sm:py-28">
          <div className="mb-10 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.5em]" style={{ color: ORANGE }}>
              PRODUCTION SCHEDULE
            </p>
            <h2 className="mt-3 font-display text-4xl font-black uppercase tracking-tight sm:text-5xl" style={{ color: COFFEE }}>
              The line runs.
            </h2>
          </div>
          <FactoryTimeline items={subEvents} />
        </section>
      )}

      {/* GALLERY — CRATES */}
      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-24 sm:py-28">
          <div className="mb-10 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.5em]" style={{ color: ORANGE }}>
              WAREHOUSE / OUTBOUND
            </p>
            <h2 className="mt-3 font-display text-4xl font-black uppercase tracking-tight sm:text-5xl" style={{ color: COFFEE }}>
              Packed memories.
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {galleryItems.map((m, i) => (
              <Crate key={`${m.fileName}-${i}`} src={m.publicUrl} caption={m.caption} index={i} reduce={reduce} />
            ))}
            {editing && galleryItems.length === 0 && (
              <div
                className="col-span-full flex h-56 items-center justify-center rounded-lg border-2 border-dashed font-mono text-sm uppercase tracking-widest"
                style={{ borderColor: COFFEE, color: COFFEE, opacity: 0.55 }}
              >
                + Load crates
              </div>
            )}
          </div>
        </section>
      )}

      {/* VENUE — LOADING DOCK */}
      {showVenue && (
        <section className="relative mx-auto max-w-5xl px-6 py-24 sm:py-28">
          <div className="mb-8 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.5em]" style={{ color: ORANGE }}>
              LOADING DOCK / GPS PIN
            </p>
            <h2 className="mt-3 font-display text-4xl font-black uppercase tracking-tight sm:text-5xl" style={{ color: COFFEE }}>
              {event.venueName || "The factory floor"}
            </h2>
            {event.venueAddress && (
              <p className="mt-2 font-mono text-xs uppercase tracking-widest" style={{ color: TEAL }}>
                {event.venueAddress}
              </p>
            )}
          </div>
          <div
            className="overflow-hidden rounded-2xl border-2 p-1"
            style={{ borderColor: COFFEE, background: "#fdf7ea", boxShadow: `8px 8px 0 ${MUSTARD}` }}
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

      {/* CTA / RSVP — SHIPPING LABEL */}
      <section className="relative px-6 py-28 text-center sm:py-36">
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: EASE }}
          className="mx-auto max-w-3xl"
        >
          <div
            className="mx-auto rounded-2xl border-4 border-dashed p-10"
            style={{ borderColor: COFFEE, background: "#fdf7ea" }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.45em]" style={{ color: ORANGE }}>
              OUTGOING PARCEL / DELIVER BY
            </p>
            <h2 className="mt-4 font-display text-5xl font-black uppercase leading-[1] tracking-tight sm:text-6xl" style={{ color: COFFEE }}>
              You are the missing part.
            </h2>
            {event.person1Name && (
              <p className="mt-4 font-mono text-xs uppercase tracking-[0.4em]" style={{ color: TEAL }}>
                RECIPIENT: {event.person1Name}
                {event.person2Name ? ` & ${event.person2Name}` : ""}
              </p>
            )}
            {event.rsvpEnabled && event.rsvpLinkOrContact && (
              <a
                href={event.rsvpLinkOrContact}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-block rounded-full border-2 px-10 py-4 font-mono text-sm font-bold uppercase tracking-[0.3em] transition-transform hover:-translate-y-0.5"
                style={{ background: ORANGE, borderColor: COFFEE, color: CREAM, boxShadow: `4px 4px 0 ${COFFEE}` }}
              >
                Confirm delivery →
              </a>
            )}
          </div>
        </motion.div>
      </section>

      <footer className="border-t-2 py-8 text-center font-mono text-[10px] uppercase tracking-[0.4em]" style={{ borderColor: COFFEE, color: COFFEE, opacity: 0.6 }}>
        <p>
          DREAM FACTORY · {event.eventTitle}
          {event.person1Name ? ` · ${event.person1Name}` : ""} · PLANT NO. 07
        </p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default DreamfactoryTemplate;
