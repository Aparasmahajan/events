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

const STEEL = "#3a5a8e";
const CHROME = "#c8d0da";
const NEON_ORANGE = "#ff8438";
const WARN_YELLOW = "#f5cd48";
const NAVY = "#111a2e";
const IVORY = "#f6f0e4";

const DRONES = [
  { top: "18%", startX: "-8%", endX: "108%", duration: 22, bob: 12, delay: 0 },
  { top: "42%", startX: "108%", endX: "-8%", duration: 28, bob: 8, delay: 4 },
  { top: "66%", startX: "-8%", endX: "108%", duration: 26, bob: 14, delay: 8 },
  { top: "82%", startX: "108%", endX: "-8%", duration: 30, bob: 10, delay: 2 },
];

const BAND_COLORS = [NEON_ORANGE, WARN_YELLOW, "#6ec5ff", "#ff8438", "#f5cd48"];

function RobotChar({ accent, reduce }: { accent: string; reduce: boolean }) {
  return (
    <div className="relative inline-block" aria-hidden>
      <svg width="140" height="180" viewBox="0 0 140 180" xmlns="http://www.w3.org/2000/svg">
        <line x1="70" y1="6" x2="70" y2="22" stroke={CHROME} strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="70" cy="6" r="4" fill={accent} />
        <rect x="30" y="22" width="80" height="60" rx="8" fill={CHROME} stroke={STEEL} strokeWidth="2" />
        <rect x="34" y="26" width="72" height="52" rx="6" fill="#1a2540" />
        <motion.circle
          cx="54" cy="52" r="7"
          fill={WARN_YELLOW}
          animate={reduce ? undefined : { opacity: [1, 1, 0.1, 1, 1] }}
          transition={{ duration: 3.5, repeat: Infinity, times: [0, 0.44, 0.5, 0.56, 1] }}
        />
        <motion.circle
          cx="86" cy="52" r="7"
          fill={WARN_YELLOW}
          animate={reduce ? undefined : { opacity: [1, 1, 0.1, 1, 1] }}
          transition={{ duration: 3.5, repeat: Infinity, times: [0, 0.44, 0.5, 0.56, 1] }}
        />
        <rect x="52" y="70" width="36" height="4" rx="2" fill={accent} opacity="0.7" />
        <rect x="24" y="86" width="92" height="68" rx="10" fill={CHROME} stroke={STEEL} strokeWidth="2" />
        <rect x="40" y="100" width="60" height="34" rx="6" fill="#0d1428" />
        <rect x="46" y="106" width="48" height="4" rx="2" fill={accent} />
        <rect x="46" y="114" width="30" height="3" rx="1.5" fill={WARN_YELLOW} opacity="0.85" />
        <rect x="46" y="121" width="40" height="3" rx="1.5" fill={CHROME} opacity="0.6" />
        <circle cx="34" cy="94" r="3" fill={STEEL} />
        <circle cx="106" cy="94" r="3" fill={STEEL} />
        <motion.g
          animate={reduce ? undefined : { rotate: [10, -20, 10] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "24px 96px" }}
        >
          <rect x="10" y="94" width="18" height="6" rx="3" fill={CHROME} stroke={STEEL} strokeWidth="1.5" />
          <circle cx="10" cy="97" r="4" fill={CHROME} stroke={STEEL} strokeWidth="1.5" />
        </motion.g>
        <rect x="112" y="106" width="18" height="6" rx="3" fill={CHROME} stroke={STEEL} strokeWidth="1.5" />
        <circle cx="130" cy="109" r="4" fill={CHROME} stroke={STEEL} strokeWidth="1.5" />
      </svg>
    </div>
  );
}

function Drone({ accent, reduce, index }: { accent: string; reduce: boolean; index: number }) {
  const d = DRONES[index % DRONES.length];
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute"
      style={{ top: d.top, left: 0, width: 70, height: 30 }}
      initial={{ x: d.startX }}
      animate={reduce ? undefined : { x: [d.startX, d.endX], y: [0, -d.bob, 0, d.bob, 0] }}
      transition={{
        x: { duration: d.duration, repeat: Infinity, ease: "linear", delay: d.delay },
        y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
      }}
    >
      <svg width="70" height="30" viewBox="0 0 70 30" xmlns="http://www.w3.org/2000/svg">
        <motion.circle
          cx="10" cy="8" r="6"
          fill={CHROME} opacity="0.65"
          animate={reduce ? undefined : { opacity: [0.4, 0.85, 0.4] }}
          transition={{ duration: 0.4, repeat: Infinity }}
        />
        <motion.circle
          cx="60" cy="8" r="6"
          fill={CHROME} opacity="0.65"
          animate={reduce ? undefined : { opacity: [0.4, 0.85, 0.4] }}
          transition={{ duration: 0.4, repeat: Infinity, delay: 0.1 }}
        />
        <motion.circle
          cx="10" cy="22" r="6"
          fill={CHROME} opacity="0.65"
          animate={reduce ? undefined : { opacity: [0.4, 0.85, 0.4] }}
          transition={{ duration: 0.4, repeat: Infinity, delay: 0.2 }}
        />
        <motion.circle
          cx="60" cy="22" r="6"
          fill={CHROME} opacity="0.65"
          animate={reduce ? undefined : { opacity: [0.4, 0.85, 0.4] }}
          transition={{ duration: 0.4, repeat: Infinity, delay: 0.3 }}
        />
        <rect x="18" y="10" width="34" height="10" rx="2" fill={STEEL} stroke={CHROME} strokeWidth="1" />
        <circle cx="24" cy="15" r="2" fill={accent} />
      </svg>
    </motion.div>
  );
}

function CityBackdrop({ reduce }: { reduce: boolean }) {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden" style={{ background: NAVY }}>
      <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${NAVY} 0%, #17223e 60%, ${NAVY} 100%)` }} />
      <svg className="absolute bottom-0 left-0 w-full opacity-30" height="240" viewBox="0 0 1200 240" preserveAspectRatio="none">
        <g fill="#1a2540">
          <rect x="0" y="120" width="80" height="120" />
          <rect x="90" y="80" width="60" height="160" />
          <rect x="160" y="140" width="100" height="100" />
          <rect x="270" y="60" width="70" height="180" />
          <rect x="350" y="100" width="90" height="140" />
          <rect x="450" y="40" width="60" height="200" />
          <rect x="520" y="120" width="110" height="120" />
          <rect x="640" y="70" width="80" height="170" />
          <rect x="730" y="130" width="90" height="110" />
          <rect x="830" y="90" width="70" height="150" />
          <rect x="910" y="50" width="80" height="190" />
          <rect x="1000" y="110" width="100" height="130" />
          <rect x="1110" y="80" width="90" height="160" />
        </g>
        <g fill={WARN_YELLOW} opacity="0.7">
          {Array.from({ length: 40 }, (_, i) => (
            <rect key={i} x={20 + i * 30} y={100 + ((i * 37) % 100)} width="3" height="3" />
          ))}
        </g>
      </svg>
      {!reduce && DRONES.map((_, i) => <Drone key={i} accent={NEON_ORANGE} reduce={reduce} index={i} />)}
    </div>
  );
}

function Barcode() {
  return (
    <svg width="70" height="14" viewBox="0 0 70 14" aria-hidden>
      {[2, 3, 2, 4, 2, 3, 5, 2, 3, 2, 4, 3, 2, 5, 2, 3].map((w, i, arr) => {
        const x = arr.slice(0, i).reduce((s, n) => s + n + 1, 0);
        return <rect key={i} x={x} y="0" width={w} height="14" fill={NAVY} />;
      })}
    </svg>
  );
}

function PackageCard({ item, accent, index }: { item: SubEvent; accent: string; index: number }) {
  const reduce = useReducedMotion();
  const band = BAND_COLORS[index % BAND_COLORS.length];
  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 24, rotate: -1 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: EASE }}
      whileHover={reduce ? undefined : { y: -4, rotate: 0.5 }}
      className="relative overflow-hidden shadow-lg"
      style={{
        background: CHROME,
        color: NAVY,
        clipPath: "polygon(6% 0, 94% 0, 100% 6%, 100% 94%, 94% 100%, 6% 100%, 0 94%, 0 6%)",
        border: `2px solid ${STEEL}`,
      }}
    >
      <div className="h-3 w-full" style={{ background: band }} />
      <span className="absolute left-2 top-6 h-2.5 w-2.5 rounded-full" style={{ background: STEEL, boxShadow: `inset 0 0 0 1px ${NAVY}` }} />
      <span className="absolute right-2 top-6 h-2.5 w-2.5 rounded-full" style={{ background: STEEL, boxShadow: `inset 0 0 0 1px ${NAVY}` }} />
      <div className="px-6 pb-4 pt-6">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: STEEL }}>
            PKG-{String(item.order).padStart(3, "0")}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: STEEL }}>
            {[item.date, item.startTime].filter(Boolean).join(" · ")}
          </span>
        </div>
        <h3 className="font-display text-xl font-bold uppercase tracking-tight" style={{ color: NAVY }}>{item.name}</h3>
        {item.venueName && <p className="mt-1 text-sm" style={{ color: STEEL }}>@ {item.venueName}</p>}
        {item.description && <p className="mt-2 text-sm leading-relaxed" style={{ color: "#3d4a63" }}>{item.description}</p>}
        {item.dressCode && (
          <p className="mt-3 inline-block rounded-sm px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em]" style={{ background: accent, color: NAVY }}>
            DRESS: {item.dressCode}
          </p>
        )}
      </div>
      <div className="flex items-center justify-between border-t px-4 py-2" style={{ borderColor: STEEL, background: "#dee4ec" }}>
        <Barcode />
        <span className="font-mono text-[9px] tracking-[0.15em]" style={{ color: STEEL }}>ROBO.POST</span>
      </div>
    </motion.article>
  );
}

function DroneCamTile({ url, caption, index, reduce }: { url: string; caption?: string; index: number; reduce: boolean }) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, scale: 0.94 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group relative overflow-hidden"
      style={{ border: `2px solid ${CHROME}`, background: NAVY, borderRadius: 6 }}
    >
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-2 py-1 font-mono text-[9px] uppercase tracking-[0.2em]" style={{ color: CHROME, background: "linear-gradient(180deg, rgba(17,26,46,0.9), transparent)" }}>
        <span className="flex items-center gap-1.5">
          <motion.span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: "#ff4433" }}
            animate={reduce ? undefined : { opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
          REC
        </span>
        <span>CAM-{String(index + 1).padStart(2, "0")}</span>
      </div>
      <img src={url} alt={caption ?? ""} loading="lazy" className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
      <div className="pointer-events-none absolute inset-2 border" style={{ borderColor: "rgba(200,208,218,0.25)" }} />
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-2 py-1 font-mono text-[9px] uppercase tracking-[0.2em]" style={{ color: CHROME, background: "linear-gradient(0deg, rgba(17,26,46,0.9), transparent)" }}>
        <span>{caption?.slice(0, 20) || "DRONE FEED"}</span>
        <span>[LIVE]</span>
      </div>
    </motion.div>
  );
}

export const RobocityTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || NEON_ORANGE;
  const tagline = event.tagline?.trim() || "The robots are ready to party.";
  const invitationMessage =
    event.invitationMessage?.trim() ||
    "Beep-boop! Our friendly circuits have organized a birthday like no other. Come plug in for cake, confetti, and a whole lot of joy.";
  const aboutStory =
    event.aboutStory?.trim() ||
    "Deep in Robo City, the drones have polished the streetlights, the delivery bots have wrapped the gifts, and the factories are humming out balloons by the thousand. The party is fully automated — the fun is entirely up to you.";
  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const hero =
    event.heroImageUrl ||
    "https://images.unsplash.com/photo-1535378620166-273708d44e4c?auto=format&fit=crop&w=1600&q=80";
  const sorted = [...subEvents].sort((a, b) => a.order - b.order);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroTextY = useTransform(heroP, [0, 0.5], [0, -40]);
  const heroOpacity = useTransform(heroP, [0, 0.6], [1, 0]);

  const showStory = !event.hideStory;
  const showEvents = !event.hideEvents && sorted.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  const dateStr = event.mainDate
    ? new Date(event.mainDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
    : "";

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-sans antialiased"
      style={{ "--accent": accent, color: IVORY, background: NAVY } as React.CSSProperties}
    >
      <CityBackdrop reduce={reduce} />
      <ScrollProgress color={accent} />

      {/* ─── 01. ROBOT WELCOME ─── */}
      <section ref={heroRef} className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6 py-24">
        <div className="absolute inset-0 opacity-25">
          <HeroMedia imageSrc={hero} videoSrc={event.heroVideoUrl || undefined} alt={event.eventTitle} className="opacity-90" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${NAVY}cc, ${NAVY}ee 60%, ${NAVY})` }} />
        </div>

        <motion.div style={reduce ? undefined : { y: heroTextY, opacity: heroOpacity }} className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 sm:grid-cols-[auto_1fr]">
          <motion.div
            initial={reduce ? false : { opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="flex justify-center sm:justify-start"
          >
            <RobotChar accent={accent} reduce={reduce} />
          </motion.div>

          <div className="text-center sm:text-left">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.5em]" style={{ color: accent }}>
              {"//"} ROBO CITY BROADCAST
            </p>
            <p className="mb-6 font-mono text-xs uppercase tracking-[0.35em]" style={{ color: WARN_YELLOW }}>
              {tagline}
            </p>
            <h1 className="font-display text-[clamp(2.6rem,9vw,6.5rem)] font-black uppercase leading-[0.92] tracking-tight" style={{ color: IVORY }}>
              {event.eventTitle}
            </h1>
            {(event.person1Name || event.person2Name) && (
              <p className="mt-4 font-mono text-sm uppercase tracking-[0.3em]" style={{ color: CHROME }}>
                UNIT: {[event.person1Name, event.person2Name].filter(Boolean).join(" + ")}
              </p>
            )}
            <div className="mt-8 flex flex-wrap justify-center gap-3 sm:justify-start">
              {dateStr && (
                <span className="rounded-sm px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em]" style={{ background: accent, color: NAVY }}>
                  {dateStr}
                </span>
              )}
              {event.mainStartTime && (
                <span className="rounded-sm border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em]" style={{ borderColor: CHROME, color: CHROME }}>
                  T-MINUS {event.mainStartTime}
                </span>
              )}
              {event.city && (
                <span className="rounded-sm border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em]" style={{ borderColor: WARN_YELLOW, color: WARN_YELLOW }}>
                  SECTOR {event.city}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── 02. TRANSMISSION ─── */}
      {showStory && (
        <section className="relative mx-auto max-w-4xl px-6 py-24 sm:py-32">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE }}
            className="relative"
            style={{ background: "rgba(200,208,218,0.06)", border: `1px solid ${STEEL}`, borderRadius: 10, padding: "2.5rem" }}
          >
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.4em]" style={{ color: accent }}>
              {">>"} INCOMING TRANSMISSION
            </p>
            <h2 className="font-display text-2xl uppercase leading-tight tracking-tight sm:text-3xl" style={{ color: IVORY }}>
              {invitationMessage}
            </h2>
            <div className="my-6 h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
            <p className="text-base leading-relaxed sm:text-lg" style={{ color: CHROME }}>
              {aboutStory}
            </p>
            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: STEEL }}>
              [ END OF TRANSMISSION ]
            </p>
          </motion.div>
        </section>
      )}

      {/* ─── 03. DELIVERY SCHEDULE ─── */}
      {showEvents && (
        <section className="relative mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-3 text-center font-mono text-[10px] uppercase tracking-[0.5em]"
            style={{ color: accent }}
          >
            ROBO.POST // SCHEDULED DELIVERIES
          </motion.p>
          <h2 className="mb-12 text-center font-display text-3xl uppercase tracking-tight sm:text-4xl" style={{ color: IVORY }}>
            Packages Inbound
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((s, i) => (
              <PackageCard key={s.order} item={s} accent={accent} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* ─── 04. DRONE FOOTAGE ─── */}
      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-3 text-center font-mono text-[10px] uppercase tracking-[0.5em]"
            style={{ color: accent }}
          >
            DRONE.CAM // ARCHIVE FEED
          </motion.p>
          <h2 className="mb-12 text-center font-display text-3xl uppercase tracking-tight sm:text-4xl" style={{ color: IVORY }}>
            From The Skies
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {galleryItems.map((m, i) => (
              <DroneCamTile key={`${m.fileName}-${i}`} url={m.publicUrl} caption={m.caption} index={i} reduce={reduce} />
            ))}
            {editing && galleryItems.length === 0 && (
              <div className="col-span-full flex h-48 items-center justify-center rounded-md border border-dashed font-mono text-xs uppercase tracking-[0.3em]" style={{ borderColor: CHROME, color: CHROME }}>
                + Add drone footage
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── 05. COORDINATES ─── */}
      {showVenue && (
        <section className="relative mx-auto max-w-5xl px-6 py-20 sm:py-28">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-3 text-center font-mono text-[10px] uppercase tracking-[0.5em]"
            style={{ color: accent }}
          >
            NAV.LINK // LANDING COORDINATES
          </motion.p>
          <h2 className="mb-10 text-center font-display text-3xl uppercase tracking-tight sm:text-4xl" style={{ color: IVORY }}>
            {event.venueName || "Docking Bay"}
          </h2>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="overflow-hidden p-1"
            style={{ background: CHROME, border: `2px solid ${STEEL}`, borderRadius: 10 }}
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

      {/* ─── 06. INITIATE PARTY ─── */}
      <section className="relative px-6 py-24 text-center sm:py-36">
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE }}
          className="mx-auto max-w-3xl"
        >
          <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.5em]" style={{ color: accent }}>
            {"//"} SYSTEM READY
          </p>
          <h2 className="font-display text-[clamp(2.2rem,7vw,5rem)] font-black uppercase leading-[0.9] tracking-tight" style={{ color: IVORY }}>
            Initiate Party Protocol
          </h2>
          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <motion.div whileHover={reduce ? undefined : { scale: 1.04 }} className="mt-10 inline-block">
              <a
                href={event.rsvpLinkOrContact}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 px-10 py-4 font-mono text-sm uppercase tracking-[0.35em] transition-all"
                style={{ background: accent, color: NAVY, border: `2px solid ${CHROME}`, borderRadius: 4 }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 0 32px ${accent}`; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}
              >
                <span className="inline-block h-2 w-2 rounded-full" style={{ background: NAVY }} />
                RSVP // Confirm
              </a>
            </motion.div>
          )}
          {(event.contactName || event.contactPhone) && (
            <p className="mt-8 font-mono text-xs uppercase tracking-[0.3em]" style={{ color: CHROME }}>
              CONTROL TOWER: {[event.contactName, event.contactPhone].filter(Boolean).join(" · ")}
            </p>
          )}
        </motion.div>
      </section>

      <footer className="relative border-t py-8 text-center font-mono text-[10px] uppercase tracking-[0.3em]" style={{ borderColor: STEEL, color: CHROME }}>
        <p>{event.eventTitle} {"//"} POWERED BY ROBO CITY {"//"} v1.0</p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default RobocityTemplate;
