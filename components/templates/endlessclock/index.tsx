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

const ROMAN = ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"];

const GEMS = ["#b8874a", "#d8a852", "#8e4a2e", "#f5eddb", "#c9a26b"];

function ClockFace({
  size,
  strokeColor,
  dialColor,
  numeralColor,
  hourAngle,
  minuteAngle,
  reduce,
  duration,
}: {
  size: number;
  strokeColor: string;
  dialColor: string;
  numeralColor: string;
  hourAngle: number;
  minuteAngle: number;
  reduce: boolean;
  duration: number;
}) {
  const cx = size / 2;
  const r = size / 2 - 6;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <radialGradient id={`dial-${size}`} cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor={dialColor} stopOpacity="0.95" />
          <stop offset="100%" stopColor={dialColor} stopOpacity="0.55" />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cx} r={r} fill={`url(#dial-${size})`} stroke={strokeColor} strokeWidth={size * 0.04} />
      <circle cx={cx} cy={cx} r={r - size * 0.06} fill="none" stroke={strokeColor} strokeOpacity="0.5" strokeWidth="1" />
      {ROMAN.map((num, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const tr = r - size * 0.13;
        return (
          <text
            key={i}
            x={cx + Math.cos(angle) * tr}
            y={cx + Math.sin(angle) * tr}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={numeralColor}
            fontFamily="Georgia, serif"
            fontSize={size * 0.08}
            fontWeight="600"
          >
            {num}
          </text>
        );
      })}
      {Array.from({ length: 60 }, (_, i) => {
        const angle = (i * 6 - 90) * (Math.PI / 180);
        const isMajor = i % 5 === 0;
        const inner = r - size * 0.04;
        const outer = r - (isMajor ? size * 0.02 : size * 0.03);
        return (
          <line
            key={i}
            x1={cx + Math.cos(angle) * inner}
            y1={cx + Math.sin(angle) * inner}
            x2={cx + Math.cos(angle) * outer}
            y2={cx + Math.sin(angle) * outer}
            stroke={strokeColor}
            strokeWidth={isMajor ? 1.5 : 0.5}
            opacity={isMajor ? 0.9 : 0.5}
          />
        );
      })}
      <motion.g
        style={{ transformOrigin: `${cx}px ${cx}px` }}
        animate={reduce ? undefined : { rotate: [hourAngle, hourAngle + 360] }}
        transition={{ duration: duration * 12, repeat: Infinity, ease: "linear" }}
      >
        <line x1={cx} y1={cx} x2={cx} y2={cx - r * 0.5} stroke={strokeColor} strokeWidth={size * 0.02} strokeLinecap="round" />
      </motion.g>
      <motion.g
        style={{ transformOrigin: `${cx}px ${cx}px` }}
        animate={reduce ? undefined : { rotate: [minuteAngle, minuteAngle + 360] }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
      >
        <line x1={cx} y1={cx} x2={cx} y2={cx - r * 0.75} stroke={strokeColor} strokeWidth={size * 0.012} strokeLinecap="round" />
      </motion.g>
      <circle cx={cx} cy={cx} r={size * 0.025} fill={strokeColor} />
    </svg>
  );
}

function Gear({ size, color, duration, reverse }: { size: number; color: string; duration: number; reverse?: boolean }) {
  const teeth = 12;
  const cx = size / 2;
  const rOuter = size / 2 - 2;
  const rInner = rOuter * 0.72;
  const rHole = rOuter * 0.28;
  const reduce = useReducedMotion();
  const points = Array.from({ length: teeth * 2 }, (_, i) => {
    const angle = (i / (teeth * 2)) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 === 0 ? rOuter : rInner;
    return `${cx + Math.cos(angle) * r},${cx + Math.sin(angle) * r}`;
  }).join(" ");
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      animate={reduce ? undefined : { rotate: reverse ? -360 : 360 }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    >
      <polygon points={points} fill={color} opacity="0.4" />
      <circle cx={cx} cy={cx} r={rInner * 0.75} fill="none" stroke={color} strokeWidth="1" opacity="0.7" />
      <circle cx={cx} cy={cx} r={rHole} fill="#0d1e3a" />
    </motion.svg>
  );
}

function FloatingClocks({ reduce }: { reduce: boolean }) {
  const clocks = [
    { top: "8%", left: "-4%", size: 340, dur: 60, stroke: "#b8874a", dial: "#f5eddb", numeral: "#4a2f18", h: 40, m: 220 },
    { top: "58%", left: "82%", size: 260, dur: 45, stroke: "#d8a852", dial: "#f5eddb", numeral: "#4a2f18", h: 140, m: 60 },
    { top: "38%", left: "60%", size: 180, dur: 30, stroke: "#8e4a2e", dial: "#e8dcc0", numeral: "#3a1f10", h: 260, m: 340 },
    { top: "78%", left: "6%", size: 220, dur: 55, stroke: "#b8874a", dial: "#efe3c9", numeral: "#4a2f18", h: 100, m: 180 },
  ];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {clocks.map((c, i) => (
        <div
          key={i}
          className="absolute opacity-[0.14]"
          style={{ top: c.top, left: c.left, width: c.size, height: c.size, filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.5))" }}
        >
          <ClockFace
            size={c.size}
            strokeColor={c.stroke}
            dialColor={c.dial}
            numeralColor={c.numeral}
            hourAngle={c.h}
            minuteAngle={c.m}
            reduce={reduce}
            duration={c.dur}
          />
        </div>
      ))}
    </div>
  );
}

function HorologiumField({ reduce }: { reduce: boolean }) {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d1e3a] via-[#152949] to-[#0d1e3a]" />
      <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(ellipse at 30% 20%, #b8874a20, transparent 60%), radial-gradient(ellipse at 70% 80%, #d8a85218, transparent 55%)" }} />
      <svg className="absolute inset-0 h-full w-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
        <filter id="horo-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" />
        </filter>
        <rect width="100%" height="100%" filter="url(#horo-noise)" />
      </svg>
    </div>
  );
}

function GearCorner({ className, size = 40, color = "#b8874a", duration = 24, reverse }: { className?: string; size?: number; color?: string; duration?: number; reverse?: boolean }) {
  return (
    <div className={`pointer-events-none absolute opacity-40 ${className ?? ""}`}>
      <Gear size={size} color={color} duration={duration} reverse={reverse} />
    </div>
  );
}

function MechanismCard({ item, i, accent }: { item: SubEvent; i: number; accent: string }) {
  const reduce = useReducedMotion();
  const gem = GEMS[i % GEMS.length];
  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
      className="relative"
    >
      <div className="relative rounded-lg p-[2px]" style={{ background: `linear-gradient(140deg, ${accent}, #4a2f18 40%, ${accent} 80%)` }}>
        <div className="relative rounded-[6px] bg-[#0d1e3a] p-7 overflow-hidden">
          <GearCorner className="top-2 right-2" size={28} color={accent} duration={20} />
          <GearCorner className="bottom-2 left-2" size={22} color="#8e4a2e" duration={28} reverse />
          <div className="absolute inset-3 pointer-events-none rounded-[4px] border border-[#b8874a]/25" />
          <div className="relative flex items-start gap-4">
            <div
              className="mt-1 h-3 w-3 rounded-full shrink-0"
              style={{ background: gem, boxShadow: `0 0 12px ${gem}, inset 0 0 3px rgba(255,255,255,0.5)` }}
            />
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.4em]" style={{ color: accent }}>
                Movement {String(item.order).padStart(2, "0")}
              </p>
              <h3 className="mt-2 font-display text-2xl tracking-tight" style={{ color: "#f5eddb" }}>
                {item.name}
              </h3>
              <p className="mt-1 text-xs italic tracking-wider" style={{ color: "#d8a852" }}>
                {[item.date, item.startTime].filter(Boolean).join(" · ")}
              </p>
              {item.venueName && <p className="mt-3 text-sm" style={{ color: "#e8dcc0", opacity: 0.85 }}>{item.venueName}</p>}
              {item.description && <p className="mt-2 text-sm leading-relaxed" style={{ color: "#e8dcc0", opacity: 0.65 }}>{item.description}</p>}
              {item.dressCode && (
                <p className="mt-4 inline-block border px-3 py-1 text-[10px] uppercase tracking-[0.25em] rounded-full" style={{ borderColor: accent, color: accent }}>
                  {item.dressCode}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function PortholePhoto({ url, caption, i }: { url: string; caption: string; i: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-6% 0px" }}
      transition={{ duration: 0.7, delay: i * 0.06, ease: EASE }}
      className="relative aspect-square"
    >
      <div
        className="absolute inset-0 rounded-full p-[3px]"
        style={{ background: "conic-gradient(from 90deg, #b8874a, #d8a852, #8e4a2e, #b8874a)" }}
      >
        <div className="relative h-full w-full rounded-full bg-[#0d1e3a] p-2">
          <div className="relative h-full w-full overflow-hidden rounded-full border border-[#b8874a]/50">
            <img src={url} alt={caption} loading="lazy" className="h-full w-full object-cover" />
            <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full">
              {Array.from({ length: 24 }, (_, k) => {
                const angle = (k * 15 - 90) * (Math.PI / 180);
                const cx = 50, cy = 50;
                const inner = 47, outer = 49.5;
                return (
                  <line
                    key={k}
                    x1={`${cx + Math.cos(angle) * inner}%`}
                    y1={`${cy + Math.sin(angle) * inner}%`}
                    x2={`${cx + Math.cos(angle) * outer}%`}
                    y2={`${cy + Math.sin(angle) * outer}%`}
                    stroke="#f5eddb"
                    strokeWidth="1"
                    opacity="0.7"
                  />
                );
              })}
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export const EndlessclockTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || "#b8874a";
  const tagline = event.tagline?.trim() || "A love measured in movements";
  const invitationMessage = event.invitationMessage?.trim() || "Time keeps its own counsel. Ours has been kind. Join us as another turn of the mechanism carries us onward — together, as ever.";
  const aboutStory = event.aboutStory?.trim() || "Every hour a promise wound, every year a gear engaged. What began as a single spark of intention now runs like clockwork — precise, patient, ours.";
  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const hero = event.heroImageUrl || "https://images.unsplash.com/photo-1509048191080-d2e2678e67b7?auto=format&fit=crop&w=1600&q=80";

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroTextY = useTransform(heroP, [0, 0.6], [0, -60]);
  const heroOpacity = useTransform(heroP, [0, 0.6], [1, 0]);

  const showStory = !event.hideStory;
  const showEvents = !event.hideEvents && subEvents.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  const sortedSubs = [...subEvents].sort((a, b) => a.order - b.order);

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-sans antialiased"
      style={{ "--accent": accent, color: "#f5eddb", background: "#0d1e3a" } as React.CSSProperties}
    >
      <HorologiumField reduce={reduce} />
      <ScrollProgress color={accent} />

      {/* HERO — floating clocks */}
      <section ref={heroRef} className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6 py-24">
        <FloatingClocks reduce={reduce} />
        <div className="absolute inset-0">
          <HeroMedia imageSrc={hero} videoSrc={event.heroVideoUrl || undefined} alt={event.eventTitle} className="opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d1e3a]/70 via-[#152949]/50 to-[#0d1e3a]" />
        </div>

        <motion.div style={reduce ? undefined : { y: heroTextY, opacity: heroOpacity }} className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-8 flex justify-center">
            <ClockFace size={160} strokeColor={accent} dialColor="#f5eddb" numeralColor="#3a1f10" hourAngle={30} minuteAngle={210} reduce={reduce} duration={reduce ? 999 : 40} />
          </div>
          <p className="mb-6 text-[10px] uppercase tracking-[0.7em]" style={{ color: "#d8a852" }}>
            {tagline}
          </p>
          <h1 className="font-display text-[clamp(2.75rem,10vw,7rem)] font-semibold leading-[0.95] tracking-tight" style={{ color: "#f5eddb", textShadow: "0 4px 30px rgba(0,0,0,0.5)" }}>
            {event.person1Name || event.eventTitle}
            {event.person2Name && (
              <>
                <span className="mx-4 italic font-light" style={{ color: accent }}>&amp;</span>
                {event.person2Name}
              </>
            )}
          </h1>
          {event.mainDate && (
            <p className="mt-8 text-sm uppercase tracking-[0.5em]" style={{ color: "#d8a852" }}>
              {new Date(event.mainDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
            </p>
          )}
          {event.city && (
            <p className="mt-2 text-xs uppercase tracking-[0.4em]" style={{ color: "#b8874a" }}>{event.city}</p>
          )}
        </motion.div>
      </section>

      {/* STORY */}
      {showStory && (
        <section className="relative mx-auto max-w-4xl px-6 py-28">
          <GearCorner className="top-6 left-4" size={36} color={accent} duration={26} />
          <GearCorner className="top-14 left-10" size={22} color="#8e4a2e" duration={20} reverse />
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE }}
            className="text-center"
          >
            <p className="mb-4 text-[10px] uppercase tracking-[0.5em]" style={{ color: accent }}>The Mechanism</p>
            <h2 className="font-display text-3xl italic sm:text-4xl" style={{ color: "#f5eddb" }}>
              {invitationMessage}
            </h2>
            <div className="mx-auto mt-10 h-px w-24" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
            <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed" style={{ color: "#e8dcc0", opacity: 0.75 }}>
              {aboutStory}
            </p>
          </motion.div>
        </section>
      )}

      {/* SUB-EVENTS — time mechanism cards */}
      {showEvents && (
        <section className="relative mx-auto max-w-6xl px-6 py-24">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-14 text-center text-[10px] uppercase tracking-[0.5em]"
            style={{ color: accent }}
          >
            The Movements
          </motion.p>
          <div className="grid gap-6 sm:grid-cols-2">
            {sortedSubs.map((s, i) => (
              <MechanismCard key={s.order} item={s} i={i} accent={accent} />
            ))}
          </div>
        </section>
      )}

      {/* GALLERY — porthole dials */}
      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-24">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-14 text-center text-[10px] uppercase tracking-[0.5em]"
            style={{ color: accent }}
          >
            Moments Preserved
          </motion.p>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((m, i) => (
              <PortholePhoto key={`${m.fileName}-${i}`} url={m.publicUrl} caption={m.caption ?? ""} i={i} />
            ))}
            {editing && galleryItems.length === 0 && (
              <div className="col-span-full flex h-56 items-center justify-center rounded-full border border-dashed text-sm" style={{ borderColor: accent, color: accent }}>
                + Add photos
              </div>
            )}
          </div>
        </section>
      )}

      {/* VENUE */}
      {showVenue && (
        <section className="relative mx-auto max-w-5xl px-6 py-24">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-4 text-center text-[10px] uppercase tracking-[0.5em]"
            style={{ color: accent }}
          >
            The Chamber
          </motion.p>
          {event.venueName && (
            <h3 className="mb-8 text-center font-display text-2xl italic" style={{ color: "#f5eddb" }}>{event.venueName}</h3>
          )}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="relative rounded-lg p-[2px]"
            style={{ background: `linear-gradient(140deg, ${accent}, #4a2f18 40%, ${accent} 80%)` }}
          >
            <div className="overflow-hidden rounded-[6px] bg-[#0d1e3a] p-1">
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

      {/* CTA / RSVP */}
      <section className="relative px-6 py-28 text-center">
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: EASE }}
          className="mx-auto max-w-3xl"
        >
          <div className="mx-auto mb-10 flex justify-center">
            <ClockFace size={120} strokeColor={accent} dialColor="#f5eddb" numeralColor="#3a1f10" hourAngle={330} minuteAngle={90} reduce={reduce} duration={reduce ? 999 : 36} />
          </div>
          <h2 className="font-display text-[clamp(2rem,6vw,4rem)] italic tracking-tight" style={{ color: "#f5eddb" }}>
            Endless, still ticking.
          </h2>
          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <motion.div whileHover={reduce ? undefined : { scale: 1.03 }} className="mt-10 inline-block">
              <a
                href={event.rsvpLinkOrContact}
                target="_blank"
                rel="noreferrer"
                className="inline-block rounded-full px-12 py-4 text-sm uppercase tracking-[0.35em] transition-shadow"
                style={{ background: `linear-gradient(140deg, ${accent}, #d8a852)`, color: "#0d1e3a", boxShadow: "0 10px 30px rgba(184,135,74,0.25)" }}
              >
                Wind the mechanism
              </a>
            </motion.div>
          )}
        </motion.div>
      </section>

      <footer className="border-t py-8 text-center text-xs" style={{ borderColor: `${accent}30`, color: "#d8a852", opacity: 0.7 }}>
        <p>{event.eventTitle}{event.person1Name ? ` · ${event.person1Name}` : ""}{event.person2Name ? ` &amp; ${event.person2Name}` : ""}</p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default EndlessclockTemplate;
