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

const SKYLINE = [
  { h: 42, track: "AI", x: 4 },
  { h: 68, track: "SEC", x: 10 },
  { h: 30, track: "IOT", x: 16 },
  { h: 88, track: "AI", x: 22 },
  { h: 54, track: "BIO", x: 28 },
  { h: 76, track: "QNT", x: 34 },
  { h: 46, track: "SEC", x: 40 },
  { h: 96, track: "QNT", x: 46 },
  { h: 60, track: "AI", x: 52 },
  { h: 38, track: "BIO", x: 58 },
  { h: 82, track: "SEC", x: 64 },
  { h: 50, track: "IOT", x: 70 },
  { h: 72, track: "AI", x: 76 },
  { h: 44, track: "QNT", x: 82 },
  { h: 64, track: "BIO", x: 88 },
  { h: 34, track: "SEC", x: 94 },
];

const STREAMS = [
  { top: "18%", delay: 0, dur: 6, color: "#3ea6ff" },
  { top: "37%", delay: 1.2, dur: 7.5, color: "#ff3d8b" },
  { top: "56%", delay: 0.6, dur: 5.5, color: "#ffa94d" },
  { top: "74%", delay: 2, dur: 8, color: "#3ea6ff" },
  { top: "88%", delay: 0.4, dur: 6.8, color: "#ff3d8b" },
];

function CityField({ reduce }: { reduce: boolean }) {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d1826] via-[#122038] to-[#152845]" />
      <svg className="absolute inset-0 h-full w-full opacity-[0.08]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid-quantum" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#3ea6ff" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-quantum)" />
      </svg>
      {!reduce &&
        STREAMS.map((s, i) => (
          <div key={i} className="absolute left-0 right-0" style={{ top: s.top, height: 1 }}>
            <div
              className="absolute inset-0 opacity-40"
              style={{ background: `linear-gradient(90deg, transparent, ${s.color}, transparent)` }}
            />
            <motion.span
              className="absolute h-[3px] w-[3px] rounded-sm"
              style={{ top: -1, background: s.color, boxShadow: `0 0 8px ${s.color}` }}
              animate={{ x: ["-5vw", "105vw"] }}
              transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: "linear" }}
            />
          </div>
        ))}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d1826]/60 via-transparent to-[#0d1826]/80" />
    </div>
  );
}

function DistrictTag({ label, accent }: { label: string; accent: string }) {
  return (
    <span
      className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.4em]"
      style={{ color: accent }}
    >
      <span style={{ color: accent }}>{"❯"}</span>
      <span className="border-y border-l px-2 py-1" style={{ borderColor: `${accent}55` }}>
        {label}
      </span>
    </span>
  );
}

function Skyline({ accent, magenta, amber }: { accent: string; magenta: string; amber: string }) {
  const reduce = useReducedMotion();
  const colorFor = (t: string) => (t === "AI" || t === "QNT" ? accent : t === "SEC" || t === "IOT" ? magenta : amber);
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[48%] sm:h-[52%]">
      <div className="relative mx-auto h-full max-w-6xl">
        {SKYLINE.map((b, i) => {
          const color = colorFor(b.track);
          return (
            <motion.div
              key={i}
              className="absolute bottom-0"
              style={{ left: `${b.x}%`, width: "3.4%" }}
              initial={reduce ? false : { height: 0, opacity: 0 }}
              animate={{ height: `${b.h}%`, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.1 + i * 0.04, ease: EASE }}
            >
              <div className="relative h-full w-full">
                <div
                  className="absolute inset-x-0 bottom-0 h-full"
                  style={{
                    background: `linear-gradient(180deg, ${color}44, ${color}18 40%, transparent)`,
                    borderLeft: `1px solid ${color}66`,
                    borderRight: `1px solid ${color}66`,
                    borderTop: `2px solid ${color}`,
                    boxShadow: `0 -8px 30px -6px ${color}88`,
                  }}
                />
                <span
                  className="absolute -top-5 left-1/2 -translate-x-1/2 font-mono text-[8px] uppercase tracking-[0.25em]"
                  style={{ color }}
                >
                  {b.track}
                </span>
                <motion.span
                  className="absolute left-1/2 top-0 h-1 w-1 -translate-x-1/2 rounded-full"
                  style={{ background: color, boxShadow: `0 0 8px ${color}` }}
                  animate={reduce ? undefined : { opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.4, delay: i * 0.08, repeat: Infinity }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function HoloBuilding({
  children,
  delay = 0,
  accent,
}: {
  children: React.ReactNode;
  delay?: number;
  accent: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.8, delay, ease: EASE }}
      whileHover={reduce ? undefined : { y: -4, boxShadow: `0 0 40px ${accent}44` }}
      className="group relative overflow-hidden rounded-sm border p-6 backdrop-blur-md"
      style={{
        borderColor: `${accent}33`,
        background: "linear-gradient(160deg, rgba(62,166,255,0.08), rgba(13,24,38,0.6))",
      }}
    >
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-30" aria-hidden>
        <defs>
          <pattern id={`wire-${delay}`} width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke={accent} strokeWidth="0.4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#wire-${delay})`} />
      </svg>
      <motion.span
        className="absolute right-4 top-4 h-1.5 w-1.5 rounded-full"
        style={{ background: accent, boxShadow: `0 0 8px ${accent}` }}
        animate={reduce ? undefined : { opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      />
      <div className="pointer-events-none absolute -left-px top-0 h-6 w-px" style={{ background: accent }} />
      <div className="pointer-events-none absolute -left-px top-0 h-px w-6" style={{ background: accent }} />
      <div className="pointer-events-none absolute -right-px bottom-0 h-6 w-px" style={{ background: accent }} />
      <div className="pointer-events-none absolute -right-px bottom-0 h-px w-6" style={{ background: accent }} />
      <div className="relative">{children}</div>
    </motion.div>
  );
}

function Districts({ items, accent, magenta }: { items: SubEvent[]; accent: string; magenta: string }) {
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <div className="mx-auto max-w-5xl px-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {sorted.map((s, i) => (
          <HoloBuilding key={s.order} delay={i * 0.08} accent={accent}>
            <div className="mb-3 flex items-center justify-between">
              <span
                className="font-mono text-[10px] uppercase tracking-[0.3em]"
                style={{ color: magenta }}
              >
                DIST-{String(s.order).padStart(2, "0")}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] opacity-60">
                {[s.date, s.startTime].filter(Boolean).join(" · ")}
              </span>
            </div>
            <h3 className="font-display text-xl font-semibold uppercase tracking-tight">{s.name}</h3>
            {s.venueName && (
              <p className="mt-1 font-mono text-xs opacity-60">// {s.venueName}</p>
            )}
            {s.description && (
              <p className="mt-3 text-sm leading-relaxed opacity-70">{s.description}</p>
            )}
            {s.dressCode && (
              <p
                className="mt-4 inline-block px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em]"
                style={{ border: `1px solid ${accent}55`, color: accent }}
              >
                {s.dressCode}
              </p>
            )}
          </HoloBuilding>
        ))}
      </div>
    </div>
  );
}

export const QuantumTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || "#3ea6ff";
  const magenta = "#ff3d8b";
  const amber = "#ffa94d";
  const tagline = event.tagline?.trim() || "Signal. Systems. Skyline.";
  const invitationMessage =
    event.invitationMessage?.trim() ||
    "The city of ideas is coming online. Four tracks, one skyline, and every district open.";
  const aboutStory =
    event.aboutStory?.trim() ||
    "Quantum City is where builders, researchers, and operators converge for two days of concentrated bandwidth. Every tower is a session, every avenue a conversation, every packet a new lead.";
  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const hero =
    event.heroImageUrl ||
    "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1600&q=80";

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroP, [0, 1], [0, -80]);
  const heroOpacity = useTransform(heroP, [0, 0.6], [1, 0]);

  const showStory = !event.hideStory;
  const showDistricts = !event.hideEvents && subEvents.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  return (
    <div
      className="relative min-h-screen overflow-x-clip bg-[#0d1826] font-sans text-[#e2ecfa] antialiased"
      style={{ "--accent": accent } as React.CSSProperties}
    >
      <CityField reduce={reduce} />
      <ScrollProgress color={accent} />

      {/* ─── HERO / SKYLINE ─── */}
      <section ref={heroRef} className="relative flex min-h-[720px] items-center justify-center overflow-hidden py-24 sm:min-h-[820px]">
        <div className="absolute inset-0 opacity-[0.18]">
          <HeroMedia imageSrc={hero} videoSrc={event.heroVideoUrl || undefined} alt={event.eventTitle} className="opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d1826]/60 via-[#0d1826]/40 to-[#0d1826]" />
        </div>

        <motion.div style={reduce ? undefined : { y: heroY, opacity: heroOpacity }} className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="mb-6 inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.5em]"
            style={{ color: accent }}
          >
            <span className="h-px w-8" style={{ background: accent }} />
            <span>{"QUANTUM // CITY-OS v2.4"}</span>
            <span className="h-px w-8" style={{ background: accent }} />
          </motion.div>

          <h1 className="font-display text-[clamp(2.6rem,10vw,7.5rem)] font-bold uppercase leading-[0.9] tracking-tight">
            <motion.span
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE }}
              className="block"
              style={{ textShadow: `0 0 40px ${accent}44` }}
            >
              {event.eventTitle}
            </motion.span>
          </h1>

          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="mt-6 font-mono text-xs uppercase tracking-[0.45em]"
            style={{ color: amber }}
          >
            {tagline}
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.3em] opacity-80"
          >
            {event.mainDate && (
              <span>
                {new Date(event.mainDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
              </span>
            )}
            {event.mainStartTime && <span style={{ color: magenta }}>{"//"}</span>}
            {event.mainStartTime && <span>{event.mainStartTime}</span>}
            {event.city && <span style={{ color: magenta }}>{"//"}</span>}
            {event.city && <span>{event.city}</span>}
          </motion.div>
        </motion.div>

        <Skyline accent={accent} magenta={magenta} amber={amber} />
      </section>

      {/* ─── MISSION ─── */}
      {showStory && (
        <section className="relative mx-auto max-w-5xl px-6 py-24 sm:py-32">
          <DistrictTag label="Mission Brief" accent={accent} />
          <div className="mt-6 grid gap-10 sm:grid-cols-5">
            <motion.h2
              initial={reduce ? false : { opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: EASE }}
              className="font-display text-3xl font-semibold uppercase leading-[1.1] tracking-tight sm:col-span-3 sm:text-4xl"
            >
              {invitationMessage}
            </motion.h2>
            <motion.div
              initial={reduce ? false : { opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
              className="sm:col-span-2"
            >
              <div
                className="relative rounded-sm border p-5"
                style={{
                  borderColor: `${accent}33`,
                  background: "linear-gradient(160deg, rgba(62,166,255,0.06), transparent)",
                }}
              >
                <span
                  className="mb-3 block font-mono text-[10px] uppercase tracking-[0.35em]"
                  style={{ color: magenta }}
                >
                  {"> transmission.log"}
                </span>
                <p className="text-sm leading-relaxed opacity-80">{aboutStory}</p>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ─── SESSION DISTRICTS ─── */}
      {showDistricts && (
        <section className="relative py-24 sm:py-32">
          <div className="mx-auto max-w-5xl px-6">
            <DistrictTag label="Session Districts" accent={accent} />
            <p className="mt-3 font-mono text-xs uppercase tracking-[0.3em] opacity-60">
              Route your day through the city
            </p>
          </div>
          <div className="mt-10">
            <Districts items={subEvents} accent={accent} magenta={magenta} />
          </div>
        </section>
      )}

      {/* ─── GALLERY / HOLO TOWERS ─── */}
      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <DistrictTag label="Skyline Archive" accent={accent} />
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {galleryItems.map((m, i) => (
              <motion.div
                key={`${m.fileName}-${i}`}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="group relative overflow-hidden rounded-sm border"
                style={{ borderColor: `${accent}33` }}
              >
                <img
                  src={m.publicUrl}
                  alt={m.caption ?? ""}
                  className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div
                  className="pointer-events-none absolute inset-0 opacity-40 mix-blend-screen"
                  style={{ background: `linear-gradient(180deg, transparent 60%, ${accent}55)` }}
                />
                <span
                  className="pointer-events-none absolute right-2 top-2 h-1.5 w-1.5 rounded-full"
                  style={{ background: magenta, boxShadow: `0 0 8px ${magenta}` }}
                />
                <span className="pointer-events-none absolute bottom-2 left-2 font-mono text-[9px] uppercase tracking-[0.3em]" style={{ color: accent }}>
                  T-{String(i + 1).padStart(3, "0")}
                </span>
              </motion.div>
            ))}
            {editing && galleryItems.length === 0 && (
              <div
                className="col-span-full flex h-48 items-center justify-center rounded-sm border border-dashed text-sm opacity-60"
                style={{ borderColor: `${accent}55` }}
              >
                + Add transmissions
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── VENUE / GRID POINT ─── */}
      {showVenue && (
        <section className="relative mx-auto max-w-5xl px-6 py-24 sm:py-32">
          <DistrictTag label="Grid Coordinates" accent={accent} />
          <div className="mt-8 grid gap-6 sm:grid-cols-5">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: EASE }}
              className="sm:col-span-2"
            >
              {event.venueName && (
                <h3 className="font-display text-2xl font-semibold uppercase tracking-tight">{event.venueName}</h3>
              )}
              {event.venueAddress && (
                <p className="mt-2 text-sm leading-relaxed opacity-70">{event.venueAddress}</p>
              )}
              {(event.latitude || event.longitude) && (
                <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
                  {event.latitude?.toFixed(4)}° N // {event.longitude?.toFixed(4)}° E
                </p>
              )}
              <div className="mt-6 h-px w-full" style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }} />
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.35em] opacity-60">
                {"> node.status = ONLINE"}
              </p>
            </motion.div>
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
              className="overflow-hidden rounded-sm border p-1 sm:col-span-3"
              style={{ borderColor: `${accent}33`, background: "rgba(13,24,38,0.4)" }}
            >
              <MapEmbed
                latitude={event.latitude}
                longitude={event.longitude}
                venueName={event.venueName}
                venueAddress={event.venueAddress}
                mapLink={event.mapLink}
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* ─── CTA / RSVP UPLINK ─── */}
      <section className="relative px-6 py-28 text-center sm:py-40">
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE }}
          className="mx-auto max-w-3xl"
        >
          <div
            aria-hidden
            className="mx-auto mb-8 h-24 w-24 rounded-full opacity-40"
            style={{ background: `radial-gradient(circle, ${accent}, transparent 65%)`, filter: "blur(24px)" }}
          />
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.5em]" style={{ color: magenta }}>
            {"// uplink.request"}
          </p>
          <h2 className="font-display text-[clamp(2.2rem,7vw,5rem)] font-bold uppercase leading-[0.9] tracking-tight">
            Join the grid
          </h2>
          {event.person1Name && (
            <p className="mt-4 font-mono text-xs uppercase tracking-[0.35em] opacity-70">
              hosted by {event.person1Name}
            </p>
          )}
          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <motion.div whileHover={reduce ? undefined : { scale: 1.02 }} className="mt-10 inline-block">
              <a
                href={event.rsvpLinkOrContact}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 rounded-sm px-10 py-4 font-mono text-xs uppercase tracking-[0.4em] transition-all"
                style={{ background: accent, color: "#0d1826", boxShadow: `0 0 24px ${accent}55` }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 0 48px ${accent}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = `0 0 24px ${accent}55`;
                }}
              >
                <span>Request access</span>
                <span>{"❯"}</span>
              </a>
            </motion.div>
          )}
        </motion.div>
      </section>

      <footer
        className="border-t py-8 text-center font-mono text-[10px] uppercase tracking-[0.4em] opacity-50"
        style={{ borderColor: `${accent}22` }}
      >
        <p>
          {event.eventTitle} // node.{event.city || "grid"} // {new Date().getFullYear()}
        </p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default QuantumTemplate;
