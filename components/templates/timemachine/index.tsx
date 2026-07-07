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

const GEARS = [
  { size: 220, top: "8%", left: "-4%", dur: 60, dir: 1, teeth: 12, opacity: 0.14 },
  { size: 160, top: "22%", left: "88%", dur: 48, dir: -1, teeth: 10, opacity: 0.12 },
  { size: 300, top: "62%", left: "-6%", dur: 90, dir: -1, teeth: 14, opacity: 0.1 },
  { size: 140, top: "78%", left: "82%", dur: 40, dir: 1, teeth: 9, opacity: 0.16 },
  { size: 100, top: "44%", left: "50%", dur: 30, dir: 1, teeth: 8, opacity: 0.08 },
];

function Gear({
  size,
  teeth,
  color,
}: {
  size: number;
  teeth: number;
  color: string;
}) {
  const r = size / 2;
  const inner = r * 0.72;
  const toothH = r * 0.16;
  const points = Array.from({ length: teeth }, (_, i) => {
    const a = (i * 2 * Math.PI) / teeth;
    return { x: r + Math.cos(a) * (inner + toothH), y: r + Math.sin(a) * (inner + toothH), a };
  });
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      <circle cx={r} cy={r} r={inner} fill="none" stroke={color} strokeWidth={size * 0.03} />
      <circle cx={r} cy={r} r={inner * 0.55} fill="none" stroke={color} strokeWidth={size * 0.02} />
      <circle cx={r} cy={r} r={inner * 0.15} fill={color} />
      {points.map((p, i) => (
        <rect
          key={i}
          x={r - size * 0.03}
          y={r - inner - toothH}
          width={size * 0.06}
          height={toothH}
          fill={color}
          transform={`rotate(${(i * 360) / teeth} ${r} ${r})`}
        />
      ))}
    </svg>
  );
}

function GearField({ reduce }: { reduce: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #f0e6d2 0%, #ead9b8 45%, #e0c8a0 100%)",
        }}
      />
      {GEARS.map((g, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ top: g.top, left: g.left, width: g.size, height: g.size, opacity: g.opacity }}
          animate={reduce ? undefined : { rotate: g.dir * 360 }}
          transition={{ duration: g.dur, repeat: Infinity, ease: "linear" }}
        >
          <Gear size={g.size} teeth={g.teeth} color="#3a2a1a" />
        </motion.div>
      ))}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(58,42,26,0.06) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />
    </div>
  );
}

function ClockDial({ accent, reduce }: { accent: string; reduce: boolean }) {
  return (
    <div className="relative mx-auto aspect-square w-[min(78vw,520px)]">
      <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="tm-brass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0.9" />
            <stop offset="100%" stopColor="#c4885a" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <circle cx="200" cy="200" r="192" fill="url(#tm-brass)" opacity="0.35" />
        <circle cx="200" cy="200" r="192" fill="none" stroke={accent} strokeWidth="2" />
        <circle cx="200" cy="200" r="176" fill="none" stroke="#3a2a1a" strokeWidth="1" opacity="0.35" />
        <path d="M 200 8 A 192 192 0 0 1 392 200 L 200 200 Z" fill={accent} opacity="0.18" />
        {Array.from({ length: 60 }).map((_, i) => {
          const a = (i * Math.PI) / 30;
          const long = i % 5 === 0;
          const r1 = long ? 158 : 168;
          const r2 = 176;
          return (
            <line
              key={i}
              x1={200 + Math.cos(a) * r1}
              y1={200 + Math.sin(a) * r1}
              x2={200 + Math.cos(a) * r2}
              y2={200 + Math.sin(a) * r2}
              stroke="#3a2a1a"
              strokeWidth={long ? 2 : 1}
              opacity={long ? 0.8 : 0.35}
            />
          );
        })}
        {["XII", "III", "VI", "IX"].map((n, i) => {
          const a = (i * Math.PI) / 2 - Math.PI / 2;
          return (
            <text
              key={n}
              x={200 + Math.cos(a) * 138}
              y={200 + Math.sin(a) * 138 + 8}
              textAnchor="middle"
              fill="#3a2a1a"
              fontFamily="Georgia, serif"
              fontSize="22"
              fontStyle="italic"
            >
              {n}
            </text>
          );
        })}
      </svg>
      <motion.svg
        viewBox="0 0 400 400"
        className="absolute inset-0 h-full w-full"
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
      >
        <line x1="200" y1="200" x2="200" y2="80" stroke="#3a2a1a" strokeWidth="4" strokeLinecap="round" />
      </motion.svg>
      <motion.svg
        viewBox="0 0 400 400"
        className="absolute inset-0 h-full w-full"
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
      >
        <line x1="200" y1="200" x2="200" y2="50" stroke={accent} strokeWidth="6" strokeLinecap="round" />
      </motion.svg>
      <div
        className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: "#3a2a1a", boxShadow: `0 0 0 4px ${accent}` }}
      />
    </div>
  );
}

function extractYear(caption: string | null | undefined, fallback: number): string {
  const s = caption?.match(/(19|20)\d{2}/);
  return s ? s[0] : String(fallback);
}

function ArcTimeline({ items, accent }: { items: SubEvent[]; accent: string }) {
  const reduce = useReducedMotion();
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <div className="relative mx-auto max-w-4xl px-6">
      <div className="pointer-events-none absolute left-1/2 top-0 h-full w-px -translate-x-1/2" style={{ background: `linear-gradient(180deg, transparent, ${accent}, transparent)` }} />
      <ol className="relative space-y-14">
        {sorted.map((s, i) => {
          const side = i % 2 === 0;
          return (
            <motion.li
              key={s.order}
              initial={reduce ? false : { opacity: 0, x: side ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
              className={`relative flex ${side ? "sm:justify-start" : "sm:justify-end"}`}
            >
              <div className="pointer-events-none absolute left-1/2 top-6 hidden h-4 w-4 -translate-x-1/2 rounded-full sm:block" style={{ background: accent, boxShadow: "0 0 0 4px #f0e6d2" }} />
              <article className={`w-full sm:w-[46%] rounded-lg border p-6 backdrop-blur-sm`} style={{ borderColor: "rgba(58,42,26,0.15)", background: "rgba(255,250,240,0.6)" }}>
                <p className="font-mono text-xs uppercase tracking-[0.35em]" style={{ color: accent }}>
                  {String(s.order).padStart(2, "0")} <span style={{ color: "#5aa89a" }}>{s.date ? new Date(s.date).getFullYear() : ""}</span>
                </p>
                <h3 className="mt-2 font-display text-2xl leading-tight" style={{ color: "#3a2a1a" }}>{s.name}</h3>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.25em]" style={{ color: "#c4885a" }}>
                  {[s.date, s.startTime].filter(Boolean).join(" · ")}
                </p>
                {s.venueName && <p className="mt-2 italic text-sm" style={{ color: "#3a2a1a" }}>at {s.venueName}</p>}
                {s.description && <p className="mt-3 text-sm leading-relaxed" style={{ color: "rgba(58,42,26,0.75)" }}>{s.description}</p>}
                {s.dressCode && (
                  <p className="mt-4 inline-block rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em]" style={{ borderColor: accent, color: accent }}>
                    {s.dressCode}
                  </p>
                )}
              </article>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}

export const TimemachineTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || "#a67b3c";
  const tagline = event.tagline?.trim() || "A journey through the years";
  const invitationMessage =
    event.invitationMessage?.trim() ||
    "Set the dials. Wind the springs. We are travelling back through every chapter that led to this milestone.";
  const aboutStory = event.aboutStory?.trim() || "";
  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const hero =
    event.heroImageUrl ||
    "https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=1600&q=80";

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroTextY = useTransform(heroP, [0, 1], [0, -80]);
  const heroOpacity = useTransform(heroP, [0, 0.7], [1, 0]);

  const showStory = !event.hideStory;
  const showJourney = !event.hideEvents && subEvents.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  const anchorYear = event.mainDate ? new Date(event.mainDate).getFullYear() : new Date().getFullYear();

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-sans antialiased"
      style={{ "--accent": accent, color: "#3a2a1a" } as React.CSSProperties}
    >
      <GearField reduce={reduce} />
      <ScrollProgress color={accent} />

      {/* ─── 01. THE DIAL ─── */}
      <section ref={heroRef} className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-5 py-24">
        <div className="absolute inset-0 opacity-25">
          <HeroMedia imageSrc={hero} videoSrc={event.heroVideoUrl || undefined} alt={event.eventTitle} className="mix-blend-multiply" />
        </div>
        <motion.div style={reduce ? undefined : { y: heroTextY, opacity: heroOpacity }} className="relative z-10 grid w-full max-w-6xl items-center gap-10 sm:grid-cols-2">
          <div>
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE }}
              className="font-mono text-[11px] uppercase tracking-[0.6em]"
              style={{ color: accent }}
            >
              {tagline}
            </motion.p>
            <h1 className="mt-5 font-display text-[clamp(2.6rem,8vw,5.5rem)] font-bold leading-[0.95] tracking-tight" style={{ color: "#3a2a1a" }}>
              {event.eventTitle}
            </h1>
            {event.person1Name && (
              <p className="mt-4 font-display text-2xl italic" style={{ color: "#c4885a" }}>
                for {event.person1Name}
              </p>
            )}
            <div className="mt-8 flex flex-wrap items-center gap-4 font-mono text-xs uppercase tracking-[0.35em]">
              {event.mainDate && (
                <span>
                  {new Date(event.mainDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
                </span>
              )}
              {event.mainStartTime && <span style={{ color: accent }}>◇</span>}
              {event.mainStartTime && <span>{event.mainStartTime}</span>}
              {event.city && <><span style={{ color: accent }}>◇</span><span>{event.city}</span></>}
            </div>
          </div>
          <div className="relative">
            <ClockDial accent={accent} reduce={reduce} />
          </div>
        </motion.div>
      </section>

      {/* ─── 02. THE INVITATION ─── */}
      {showStory && (
        <section className="relative mx-auto max-w-4xl px-6 py-28 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.5em]" style={{ color: accent }}>Chapter One</p>
          <h2 className="mt-6 font-display text-3xl italic leading-[1.2] sm:text-4xl" style={{ color: "#3a2a1a" }}>
            &ldquo;{invitationMessage}&rdquo;
          </h2>
          {aboutStory && (
            <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed" style={{ color: "rgba(58,42,26,0.75)" }}>
              {aboutStory}
            </p>
          )}
          <motion.div
            className="mx-auto mt-10 h-px w-40"
            style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
            animate={reduce ? undefined : { opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </section>
      )}

      {/* ─── 03. THE JOURNEY ─── */}
      {showJourney && (
        <section className="relative py-24">
          <div className="mb-16 text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.5em]" style={{ color: accent }}>The Arc of Years</p>
            <h2 className="mt-4 font-display text-4xl" style={{ color: "#3a2a1a" }}>Every tick, a memory</h2>
          </div>
          <ArcTimeline items={subEvents} accent={accent} />
        </section>
      )}

      {/* ─── 04. POLAROID GALLERY ─── */}
      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-24">
          <div className="mb-14 text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.5em]" style={{ color: accent }}>Developed Frames</p>
            <h2 className="mt-4 font-display text-4xl italic" style={{ color: "#3a2a1a" }}>Snapshots from the road</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((m, i) => {
              const tilt = ((i * 37) % 7) - 3;
              const year = extractYear(m.caption, anchorYear - (galleryItems.length - i) * 3);
              return (
                <motion.figure
                  key={`${m.fileName}-${i}`}
                  initial={reduce ? false : { opacity: 0, y: 30, rotate: 0 }}
                  whileInView={{ opacity: 1, y: 0, rotate: tilt }}
                  whileHover={reduce ? undefined : { rotate: 0, y: -6, scale: 1.02 }}
                  viewport={{ once: true, margin: "-8% 0px" }}
                  transition={{ duration: 0.7, delay: i * 0.06, ease: EASE }}
                  className="mx-auto w-full max-w-xs bg-white p-3 pb-6 shadow-[0_20px_40px_-20px_rgba(58,42,26,0.55)]"
                  style={{ transformOrigin: "center" }}
                >
                  <p className="mb-2 text-center font-mono text-[11px] uppercase tracking-[0.35em]" style={{ color: accent }}>
                    {year}
                  </p>
                  <div className="relative overflow-hidden" style={{ background: "#f0e6d2" }}>
                    <img
                      src={m.publicUrl}
                      alt={m.caption ?? ""}
                      loading="lazy"
                      className="aspect-square w-full object-cover"
                      style={{ filter: "sepia(0.15) contrast(1.02)" }}
                    />
                  </div>
                  {m.caption && (
                    <figcaption className="mt-3 text-center font-display text-sm italic" style={{ color: "#3a2a1a" }}>
                      {m.caption.replace(/(19|20)\d{2}/, "").trim() || "—"}
                    </figcaption>
                  )}
                </motion.figure>
              );
            })}
            {editing && galleryItems.length === 0 && (
              <div className="col-span-full flex h-56 items-center justify-center border border-dashed text-sm" style={{ borderColor: "rgba(58,42,26,0.3)", color: "rgba(58,42,26,0.6)" }}>
                + Add photos
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── 05. THE DESTINATION ─── */}
      {showVenue && (
        <section className="relative mx-auto max-w-5xl px-6 py-24">
          <div className="mb-8 text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.5em]" style={{ color: accent }}>Coordinates</p>
            <h2 className="mt-4 font-display text-4xl" style={{ color: "#3a2a1a" }}>{event.venueName || "The Landing"}</h2>
            {event.venueAddress && (
              <p className="mt-2 italic" style={{ color: "rgba(58,42,26,0.7)" }}>{event.venueAddress}</p>
            )}
          </div>
          <div className="overflow-hidden rounded-lg border p-1" style={{ borderColor: "rgba(58,42,26,0.2)", background: "rgba(255,250,240,0.6)" }}>
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

      {/* ─── 06. ARRIVE ─── */}
      <section className="relative px-6 py-32 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.5em]" style={{ color: accent }}>Now Boarding</p>
        <h2 className="mx-auto mt-6 max-w-3xl font-display text-[clamp(2.2rem,6vw,4.2rem)] leading-[1.05]" style={{ color: "#3a2a1a" }}>
          Travel with us through {anchorYear}
        </h2>
        {event.person1Name && (
          <p className="mt-4 font-display text-xl italic" style={{ color: "#c4885a" }}>
            in honour of {event.person1Name}
          </p>
        )}
        {event.rsvpEnabled && event.rsvpLinkOrContact && (
          <motion.a
            href={event.rsvpLinkOrContact}
            target="_blank"
            rel="noreferrer"
            whileHover={reduce ? undefined : { scale: 1.04 }}
            className="mt-10 inline-block rounded-full px-12 py-4 font-mono text-sm uppercase tracking-[0.35em] transition-all"
            style={{ background: accent, color: "#f0e6d2", boxShadow: "0 12px 30px -12px rgba(58,42,26,0.6)" }}
          >
            Reserve your seat
          </motion.a>
        )}
        {event.rsvpEnabled && event.rsvpLinkOrContact && (
          <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.35em]" style={{ color: "#5aa89a" }}>
            time-machine departs on schedule
          </p>
        )}
      </section>

      <footer className="border-t py-8 text-center font-mono text-xs uppercase tracking-[0.3em]" style={{ borderColor: "rgba(58,42,26,0.15)", color: "rgba(58,42,26,0.55)" }}>
        <p>
          {event.eventTitle}
          {event.person1Name ? ` · ${event.person1Name}` : ""}
          {event.mainDate ? ` · ${new Date(event.mainDate).toLocaleDateString("en-US", { year: "numeric" })}` : ""}
        </p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default TimemachineTemplate;
