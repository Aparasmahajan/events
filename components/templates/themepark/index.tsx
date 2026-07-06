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

const NIGHT = "#0e1a3c";
const CREAM = "#faf1e2";
const CANDY = "#e64256";
const RIDE_YELLOW = "#f0c848";
const PARK_GREEN = "#3fa276";

const STAR_FIELD = Array.from({ length: 36 }, (_, i) => ({
  left: `${(i * 137) % 100}%`,
  top: `${(i * 53) % 70}%`,
  size: 1 + (i % 3) * 0.5,
  delay: (i % 8) * 0.25,
  dur: 2 + (i % 4) * 0.6,
}));

function NightSky({ reduce }: { reduce: boolean }) {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden" style={{ background: NIGHT }}>
      <div
        className="absolute inset-0"
        style={{ background: `radial-gradient(1200px 700px at 50% 100%, #1c2a5a, transparent 70%), linear-gradient(180deg, #0a1230 0%, #0e1a3c 60%, #1a2a5c 100%)` }}
      />
      {!reduce && (
        <div className="absolute inset-0">
          {STAR_FIELD.map((s, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full"
              style={{ left: s.left, top: s.top, width: s.size, height: s.size, background: CREAM, boxShadow: `0 0 4px ${CREAM}` }}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ParkSkyline({ accent, reduce }: { accent: string; reduce: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1200 340"
      preserveAspectRatio="xMidYEnd meet"
      className="absolute inset-x-0 bottom-0 h-[62%] w-full opacity-90"
    >
      <defs>
        <filter id="tp-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {/* rollercoaster arc, left */}
      <g filter="url(#tp-glow)" stroke={CANDY} strokeWidth="3" fill="none" opacity="0.9">
        <path d="M 40 300 Q 140 130 240 300 T 440 300" />
        <path d="M 40 305 Q 140 135 240 305 T 440 305" opacity="0.6" />
        {[70, 120, 170, 220, 270, 320, 370, 420].map((x) => (
          <line key={x} x1={x} y1={300 - Math.abs(Math.sin((x - 40) / 63.6) * 60)} x2={x} y2="320" stroke={CANDY} strokeWidth="2" opacity="0.55" />
        ))}
      </g>
      {/* ferris wheel, center */}
      <g transform="translate(600 210)" filter="url(#tp-glow)">
        <motion.g
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "0px 0px" }}
        >
          <circle r="110" fill="none" stroke={accent} strokeWidth="3" />
          <circle r="88" fill="none" stroke={accent} strokeWidth="1.5" opacity="0.5" />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            const x = Math.cos(a) * 110;
            const y = Math.sin(a) * 110;
            return (
              <g key={i}>
                <line x1="0" y1="0" x2={x} y2={y} stroke={accent} strokeWidth="1.5" opacity="0.7" />
                <circle cx={x} cy={y} r="6" fill={i % 2 ? CANDY : RIDE_YELLOW} />
              </g>
            );
          })}
        </motion.g>
        <circle r="9" fill={CREAM} />
        <rect x="-4" y="0" width="8" height="120" fill={NIGHT} stroke={accent} strokeWidth="2" />
      </g>
      {/* carousel dome, right */}
      <g transform="translate(880 300)" filter="url(#tp-glow)">
        <path d="M -70 0 Q 0 -90 70 0 Z" fill={CANDY} opacity="0.85" />
        <path d="M -70 0 Q 0 -90 70 0" fill="none" stroke={CREAM} strokeWidth="2" />
        <circle cx="0" cy="-90" r="5" fill={RIDE_YELLOW} />
        <line x1="0" y1="-85" x2="0" y2="-105" stroke={CREAM} strokeWidth="2" />
        {[-50, -25, 0, 25, 50].map((x) => (
          <line key={x} x1={x} y1="0" x2={x} y2="30" stroke={CREAM} strokeWidth="1.5" opacity="0.7" />
        ))}
        <rect x="-72" y="30" width="144" height="6" fill={RIDE_YELLOW} />
      </g>
      {/* drop tower, far right */}
      <g transform="translate(1080 300)" filter="url(#tp-glow)">
        <rect x="-8" y="-190" width="16" height="220" fill={NIGHT} stroke={PARK_GREEN} strokeWidth="2" />
        <circle cx="0" cy="-190" r="8" fill={PARK_GREEN} />
        <motion.rect
          x="-16" width="32" height="14" fill={RIDE_YELLOW}
          initial={{ y: -180 }}
          animate={reduce ? undefined : { y: [-180, 20, -180] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </g>
      {/* ground line */}
      <line x1="0" y1="325" x2="1200" y2="325" stroke={CREAM} strokeWidth="2" opacity="0.35" />
    </svg>
  );
}

function CoasterTrack({ accent, reduce }: { accent: string; reduce: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 h-24">
      <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className="h-full w-full">
        <path
          id="tp-coaster-path"
          d="M 0 70 Q 150 10 300 60 T 600 55 T 900 65 T 1200 40"
          fill="none"
          stroke={accent}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M 0 74 Q 150 14 300 64 T 600 59 T 900 69 T 1200 44"
          fill="none"
          stroke={accent}
          strokeWidth="1.5"
          opacity="0.4"
        />
        {Array.from({ length: 24 }).map((_, i) => (
          <line
            key={i}
            x1={i * 50 + 5}
            y1={72 - Math.sin(i * 0.5) * 8}
            x2={i * 50 + 5}
            y2={90}
            stroke={accent}
            strokeWidth="1.5"
            opacity="0.35"
          />
        ))}
        {!reduce && (
          <g>
            <motion.g
              animate={{ offsetDistance: ["0%", "100%"] }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              style={{ offsetPath: "path('M 0 70 Q 150 10 300 60 T 600 55 T 900 65 T 1200 40')" }}
            >
              <rect x="-10" y="-6" width="20" height="10" rx="2" fill={CANDY} />
              <circle cx="-6" cy="6" r="3" fill={NIGHT} stroke={CREAM} strokeWidth="1" />
              <circle cx="6" cy="6" r="3" fill={NIGHT} stroke={CREAM} strokeWidth="1" />
            </motion.g>
          </g>
        )}
      </svg>
    </div>
  );
}

function RideSign({ item, i, accent }: { item: SubEvent; i: number; accent: string }) {
  const reduce = useReducedMotion();
  const bulbs = Array.from({ length: 13 });
  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
      className="relative"
    >
      <div
        className="relative rounded-t-[140px] border-4 px-6 pt-10 pb-6"
        style={{ borderColor: accent, background: `linear-gradient(180deg, ${NIGHT}, #12245a)`, boxShadow: `0 0 32px ${accent}55` }}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40">
          <svg viewBox="0 0 260 160" className="h-full w-full">
            <path d="M 20 150 Q 130 -10 240 150" fill="none" stroke="transparent" id={`arch-${i}`} />
            {bulbs.map((_, b) => {
              const t = b / (bulbs.length - 1);
              const x = 20 + (240 - 20) * t;
              const arch = 150 - Math.sin(t * Math.PI) * 160;
              return (
                <motion.circle
                  key={b}
                  cx={x}
                  cy={arch}
                  r="5"
                  fill={b % 2 ? RIDE_YELLOW : CREAM}
                  animate={reduce ? undefined : { opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.6, delay: b * 0.12, repeat: Infinity, ease: "easeInOut" }}
                  style={{ filter: `drop-shadow(0 0 4px ${b % 2 ? RIDE_YELLOW : CREAM})` }}
                />
              );
            })}
          </svg>
        </div>
        <div
          className="relative mx-auto mb-4 w-fit rounded-md border-2 px-4 py-1 text-[10px] font-bold uppercase tracking-[0.35em]"
          style={{ borderColor: RIDE_YELLOW, color: RIDE_YELLOW, background: NIGHT }}
        >
          Ride {String(i + 1).padStart(2, "0")}
        </div>
        <h3 className="text-center font-display text-2xl uppercase tracking-tight" style={{ color: CREAM }}>
          {item.name}
        </h3>
        <div className="mx-auto mt-3 flex flex-wrap justify-center gap-2 text-[10px] uppercase tracking-[0.25em]" style={{ color: CREAM }}>
          {item.date && <span className="opacity-80">{item.date}</span>}
          {item.startTime && <span className="opacity-60">{item.startTime}</span>}
        </div>
        {item.venueName && (
          <p className="mt-3 text-center text-sm" style={{ color: CREAM, opacity: 0.75 }}>
            @ {item.venueName}
          </p>
        )}
        {item.description && (
          <p className="mt-2 text-center text-sm leading-relaxed" style={{ color: CREAM, opacity: 0.7 }}>
            {item.description}
          </p>
        )}
        {item.dressCode && (
          <div className="mt-4 flex justify-center">
            <span
              className="rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.25em]"
              style={{ borderColor: PARK_GREEN, color: PARK_GREEN }}
            >
              {item.dressCode}
            </span>
          </div>
        )}
        <div
          className="mt-5 rounded-md border-2 px-3 py-1.5 text-center text-[10px] font-black uppercase tracking-[0.4em]"
          style={{ borderColor: CANDY, background: CANDY, color: CREAM, boxShadow: `0 4px 0 ${NIGHT}` }}
        >
          Board Here
        </div>
      </div>
    </motion.article>
  );
}

function PhotoStrip({ url, caption, i, reduce }: { url: string; caption?: string; i: number; reduce: boolean }) {
  const holes = Array.from({ length: 8 });
  return (
    <motion.figure
      initial={reduce ? false : { opacity: 0, y: 30, rotate: i % 2 ? -2 : 2 }}
      whileInView={{ opacity: 1, y: 0, rotate: i % 2 ? -1.5 : 1.5 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.6, delay: i * 0.06, ease: EASE }}
      whileHover={reduce ? undefined : { rotate: 0, scale: 1.03 }}
      className="relative flex flex-col items-center rounded-lg px-2.5 py-3"
      style={{ background: NIGHT, border: `2px solid ${RIDE_YELLOW}`, boxShadow: "0 10px 30px rgba(0,0,0,0.35)" }}
    >
      <div className="pointer-events-none absolute inset-y-3 left-1 flex flex-col justify-between">
        {holes.map((_, h) => (
          <span key={h} className="block h-2 w-2 rounded-full" style={{ background: CREAM }} />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-3 right-1 flex flex-col justify-between">
        {holes.map((_, h) => (
          <span key={h} className="block h-2 w-2 rounded-full" style={{ background: CREAM }} />
        ))}
      </div>
      <div className="w-full space-y-2 px-2">
        <img
          src={url}
          alt={caption ?? ""}
          className="aspect-[4/5] w-full rounded-sm object-cover"
          style={{ border: `2px solid ${CREAM}` }}
          loading="lazy"
        />
      </div>
      {caption && (
        <figcaption
          className="mt-3 max-w-[85%] text-center font-display text-[11px] uppercase tracking-[0.2em]"
          style={{ color: CREAM }}
        >
          {caption}
        </figcaption>
      )}
    </motion.figure>
  );
}

export const ThemeparkTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || RIDE_YELLOW;
  const tagline = event.tagline?.trim() || "The gates are open. The night is a ride.";
  const invitationMessage =
    event.invitationMessage?.trim() ||
    "Step through the gates. The rides are running, the lights are up, the cotton candy is spun. Bring your loudest laugh.";
  const aboutStory = event.aboutStory?.trim() || "";
  const hero =
    event.heroImageUrl ||
    "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&w=1600&q=80";
  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(heroP, [0, 1], [1, 0.92]);
  const heroY = useTransform(heroP, [0, 0.5], [0, -40]);
  const heroOpacity = useTransform(heroP, [0, 0.6], [1, 0]);

  const sortedEvents = useMemo(() => [...subEvents].sort((a, b) => a.order - b.order), [subEvents]);

  const showStory = !event.hideStory;
  const showEvents = !event.hideEvents && sortedEvents.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-sans antialiased"
      style={{ "--accent": accent, color: CREAM, background: NIGHT } as React.CSSProperties}
    >
      <NightSky reduce={reduce} />
      <ScrollProgress color={accent} />

      {/* ─── 01. GATES ─── */}
      <section ref={heroRef} className="relative flex min-h-[720px] h-[100svh] items-center justify-center overflow-hidden">
        <motion.div style={reduce ? undefined : { scale: heroScale }} className="absolute inset-0">
          <HeroMedia imageSrc={hero} videoSrc={event.heroVideoUrl || undefined} alt={event.eventTitle} className="opacity-40" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${NIGHT}cc 0%, ${NIGHT}66 40%, ${NIGHT} 100%)` }} />
        </motion.div>

        <ParkSkyline accent={accent} reduce={reduce} />

        <motion.div style={reduce ? undefined : { y: heroY, opacity: heroOpacity }} className="relative z-10 px-6 text-center">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="mb-6 text-[10px] uppercase tracking-[0.55em]"
            style={{ color: accent, textShadow: `0 0 18px ${accent}` }}
          >
            {tagline}
          </motion.p>
          <h1
            className="font-display font-black uppercase leading-[0.9] tracking-tight"
            style={{
              fontSize: "clamp(3rem, 11vw, 8.5rem)",
              color: CREAM,
              textShadow: `0 4px 0 ${CANDY}, 0 8px 24px ${NIGHT}`,
            }}
          >
            {event.eventTitle}
          </h1>
          {event.person1Name && (
            <p className="mt-6 font-display text-xl uppercase tracking-[0.4em]" style={{ color: RIDE_YELLOW }}>
              {event.person1Name}
            </p>
          )}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            className="mt-8 flex flex-wrap justify-center gap-3 text-xs uppercase tracking-[0.35em]"
          >
            {event.mainDate && (
              <span
                className="rounded-full border-2 px-4 py-1"
                style={{ borderColor: accent, color: CREAM, background: `${NIGHT}aa` }}
              >
                {new Date(event.mainDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
              </span>
            )}
            {event.mainStartTime && (
              <span className="rounded-full border-2 px-4 py-1" style={{ borderColor: CANDY, color: CREAM, background: `${NIGHT}aa` }}>
                {event.mainStartTime}
              </span>
            )}
            {event.city && (
              <span className="rounded-full border-2 px-4 py-1" style={{ borderColor: PARK_GREEN, color: CREAM, background: `${NIGHT}aa` }}>
                {event.city}
              </span>
            )}
          </motion.div>
        </motion.div>

        {!reduce && (
          <motion.div
            animate={{ y: [0, 8, 0], opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.45em]"
            style={{ color: RIDE_YELLOW }}
          >
            Step Right Up
          </motion.div>
        )}
      </section>

      {/* ─── 02. INVITATION ─── */}
      {showStory && (
        <section className="relative mx-auto max-w-5xl px-6 py-28 sm:py-36">
          <div className="grid items-center gap-12 sm:grid-cols-2">
            <motion.div
              initial={reduce ? false : { opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              <p className="mb-3 text-[10px] uppercase tracking-[0.5em]" style={{ color: RIDE_YELLOW }}>
                From the Ticket Booth
              </p>
              <h2 className="font-display text-3xl uppercase leading-[1.05] tracking-tight sm:text-4xl" style={{ color: CREAM }}>
                {invitationMessage}
              </h2>
            </motion.div>
            <motion.div
              initial={reduce ? false : { opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
              className="relative rounded-2xl border-4 p-6"
              style={{ borderColor: accent, background: `${NIGHT}` }}
            >
              <p className="text-base leading-relaxed sm:text-lg" style={{ color: CREAM, opacity: 0.85 }}>
                {aboutStory ||
                  "One night, one park, every ride open. Popcorn in one hand, sparklers in the other. Under a sky full of fireworks, this is the birthday you'll be telling stories about."}
              </p>
            </motion.div>
          </div>
        </section>
      )}

      {/* ─── 03. RIDES / SUB-EVENTS ─── */}
      {showEvents && (
        <section className="relative py-24 sm:py-32">
          <CoasterTrack accent={accent} reduce={reduce} />
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-14 text-center text-[10px] uppercase tracking-[0.5em]"
            style={{ color: RIDE_YELLOW }}
          >
            Tonight's Attractions
          </motion.p>
          <div className="mx-auto grid max-w-6xl gap-8 px-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedEvents.map((s, i) => (
              <RideSign key={s.order} item={s} i={i} accent={accent} />
            ))}
          </div>
        </section>
      )}

      {/* ─── 04. PHOTO BOOTH GALLERY ─── */}
      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-10 text-center text-[10px] uppercase tracking-[0.5em]"
            style={{ color: RIDE_YELLOW }}
          >
            The Photo Booth
          </motion.p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {galleryItems.map((m, i) => (
              <PhotoStrip key={`${m.fileName}-${i}`} url={m.publicUrl} caption={m.caption} i={i} reduce={reduce} />
            ))}
            {editing && galleryItems.length === 0 && (
              <div
                className="col-span-full flex h-48 items-center justify-center rounded-xl border-2 border-dashed text-sm"
                style={{ borderColor: `${CREAM}55`, color: CREAM }}
              >
                + Add photos
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── 05. THE PARK / VENUE ─── */}
      {showVenue && (
        <section className="relative mx-auto max-w-5xl px-6 py-24 sm:py-32">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-4 text-center text-[10px] uppercase tracking-[0.5em]"
            style={{ color: RIDE_YELLOW }}
          >
            The Park Gates
          </motion.p>
          {event.venueName && (
            <h3 className="mb-6 text-center font-display text-2xl uppercase tracking-tight" style={{ color: CREAM }}>
              {event.venueName}
            </h3>
          )}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="overflow-hidden rounded-2xl border-4 p-1"
            style={{ borderColor: accent, background: NIGHT }}
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

      {/* ─── 06. RSVP / CTA ─── */}
      <section className="relative px-6 py-28 text-center sm:py-40">
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE }}
          className="mx-auto max-w-3xl"
        >
          <p className="mb-6 text-[10px] uppercase tracking-[0.5em]" style={{ color: RIDE_YELLOW }}>
            Grab a Ticket
          </p>
          <h2
            className="font-display font-black uppercase leading-[0.9] tracking-tight"
            style={{
              fontSize: "clamp(2.5rem, 8vw, 5.5rem)",
              color: CREAM,
              textShadow: `0 3px 0 ${CANDY}, 0 6px 20px ${NIGHT}`,
            }}
          >
            See you at the gates
          </h2>
          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <motion.div whileHover={reduce ? undefined : { scale: 1.04, rotate: -1 }} className="mt-10 inline-block">
              <a
                href={event.rsvpLinkOrContact}
                target="_blank"
                rel="noreferrer"
                className="inline-block rounded-full border-4 px-12 py-4 font-display text-sm uppercase tracking-[0.4em] transition-all"
                style={{
                  borderColor: CREAM,
                  background: CANDY,
                  color: CREAM,
                  boxShadow: `0 6px 0 ${NIGHT}, 0 0 30px ${accent}55`,
                }}
              >
                RSVP now
              </a>
            </motion.div>
          )}
        </motion.div>
      </section>

      <footer
        className="border-t py-8 text-center text-xs"
        style={{ borderColor: `${CREAM}22`, color: `${CREAM}99` }}
      >
        <p>
          {event.eventTitle}
          {event.person1Name ? ` · ${event.person1Name}` : ""}
        </p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default ThemeparkTemplate;
