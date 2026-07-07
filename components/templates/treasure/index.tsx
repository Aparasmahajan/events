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

const PARCHMENT = "#f4e4c1";
const JUNGLE = "#3d7a4a";
const GOLD = "#e0a638";
const BROWN = "#5a3a24";
const NAVY = "#2a4a6e";

const MAP_MARKS = [
  { x: 12, y: 28 },
  { x: 34, y: 62 },
  { x: 58, y: 22 },
  { x: 78, y: 68 },
];

function ParchmentField({ reduce }: { reduce: boolean }) {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden" style={{ background: PARCHMENT }}>
      <svg className="absolute inset-0 h-full w-full opacity-[0.18]" xmlns="http://www.w3.org/2000/svg">
        <filter id="treasure-aged">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" />
          <feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.22  0 0 0 0 0.08  0 0 0 0.6 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#treasure-aged)" />
      </svg>
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, transparent 45%, ${BROWN}22 100%)`,
        }}
      />
      {!reduce && (
        <svg className="absolute inset-0 h-full w-full opacity-[0.08]" xmlns="http://www.w3.org/2000/svg">
          <filter id="treasure-stain">
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" />
            <feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.22  0 0 0 0 0.08  0 0 0 0.9 0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#treasure-stain)" />
        </svg>
      )}
    </div>
  );
}

function CompassRose({ size = 88 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden>
      <circle cx="50" cy="50" r="46" fill="none" stroke={BROWN} strokeWidth="1" strokeDasharray="2 3" />
      <circle cx="50" cy="50" r="38" fill="none" stroke={BROWN} strokeWidth="0.8" />
      <polygon points="50,8 54,50 50,92 46,50" fill={NAVY} opacity="0.75" />
      <polygon points="8,50 50,46 92,50 50,54" fill={GOLD} opacity="0.85" />
      <circle cx="50" cy="50" r="3" fill={BROWN} />
      <text x="50" y="18" textAnchor="middle" fontSize="8" fill={BROWN} fontFamily="serif" fontWeight="bold">N</text>
      <text x="82" y="53" textAnchor="middle" fontSize="8" fill={BROWN} fontFamily="serif" fontWeight="bold">E</text>
      <text x="50" y="88" textAnchor="middle" fontSize="8" fill={BROWN} fontFamily="serif" fontWeight="bold">S</text>
      <text x="18" y="53" textAnchor="middle" fontSize="8" fill={BROWN} fontFamily="serif" fontWeight="bold">W</text>
    </svg>
  );
}

function TreasureMap({ reduce }: { reduce: boolean }) {
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id="tm-path" x1="0" x2="1">
          <stop offset="0" stopColor={BROWN} stopOpacity="0.9" />
          <stop offset="1" stopColor={BROWN} stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <motion.path
        d="M 12 28 Q 24 44 34 62 T 58 22 T 78 68"
        fill="none"
        stroke="url(#tm-path)"
        strokeWidth="0.5"
        strokeDasharray="1.2 1.2"
        initial={reduce ? undefined : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 3.2, ease: EASE }}
      />
      {MAP_MARKS.map((m, i) => (
        <motion.g
          key={i}
          initial={reduce ? undefined : { opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 + i * 0.4, duration: 0.6, ease: EASE }}
        >
          <line x1={m.x - 2} y1={m.y - 2} x2={m.x + 2} y2={m.y + 2} stroke={BROWN} strokeWidth="0.6" strokeLinecap="round" />
          <line x1={m.x - 2} y1={m.y + 2} x2={m.x + 2} y2={m.y - 2} stroke={BROWN} strokeWidth="0.6" strokeLinecap="round" />
        </motion.g>
      ))}
      <g opacity="0.4">
        <path d="M 5 8 Q 12 5 20 8 T 32 10" fill="none" stroke={JUNGLE} strokeWidth="0.4" />
        <path d="M 62 5 Q 74 8 88 6" fill="none" stroke={JUNGLE} strokeWidth="0.4" />
        <path d="M 40 52 Q 50 55 62 53" fill="none" stroke={JUNGLE} strokeWidth="0.4" />
      </g>
      <g opacity="0.5" fill={JUNGLE}>
        <circle cx="18" cy="12" r="0.9" />
        <circle cx="20" cy="14" r="0.7" />
        <circle cx="68" cy="10" r="0.9" />
        <circle cx="44" cy="52" r="0.8" />
        <circle cx="88" cy="50" r="0.9" />
      </g>
    </svg>
  );
}

function CoinFlip({ order, delay }: { order: number; delay: number }) {
  const reduce = useReducedMotion();
  return (
    <div className="relative h-14 w-14" style={{ perspective: 600 }}>
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        initial={reduce ? undefined : { rotateY: 0 }}
        whileInView={reduce ? undefined : { rotateY: 540 }}
        viewport={{ once: true, margin: "-15% 0px" }}
        transition={{ duration: 1.1, delay, ease: EASE }}
      >
        {/* back — covered */}
        <div
          className="absolute inset-0 flex items-center justify-center rounded-full font-display text-xl font-black"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${BROWN}, #2c1a0c)`,
            color: PARCHMENT,
            boxShadow: `inset 0 0 8px #00000060`,
            backfaceVisibility: "hidden",
          }}
        >
          ?
        </div>
        {/* front — gold coin */}
        <div
          className="absolute inset-0 flex items-center justify-center rounded-full font-display text-xl font-black"
          style={{
            background: `radial-gradient(circle at 32% 30%, #fbe08a, ${GOLD} 55%, #a77518)`,
            color: BROWN,
            boxShadow: `inset 0 0 6px #00000040, 0 3px 8px #0000003a`,
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
          }}
        >
          {String(order).padStart(2, "0")}
        </div>
      </motion.div>
    </div>
  );
}

function Waypoints({ items }: { items: SubEvent[] }) {
  const reduce = useReducedMotion();
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <div className="mx-auto max-w-4xl px-6">
      <div className="relative">
        <div
          aria-hidden
          className="absolute left-7 top-0 bottom-0 hidden w-px sm:block"
          style={{ background: `repeating-linear-gradient(180deg, ${BROWN} 0 4px, transparent 4px 10px)` }}
        />
        <div className="grid gap-6">
          {sorted.map((s, i) => (
            <motion.article
              key={s.order}
              initial={reduce ? false : { opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
              className="relative flex items-start gap-4 sm:gap-6"
            >
              <div className="relative z-10">
                <CoinFlip order={s.order} delay={i * 0.08} />
              </div>
              <div
                className="flex-1 rounded-sm border p-5"
                style={{
                  background: "#fbf1d8",
                  borderColor: `${BROWN}55`,
                  boxShadow: `0 6px 18px #5a3a2418, inset 0 0 40px #e0a63820`,
                }}
              >
                <p className="mb-1 text-[10px] uppercase tracking-[0.32em]" style={{ color: JUNGLE }}>
                  Waypoint {String(s.order).padStart(2, "0")} · {[s.date, s.startTime].filter(Boolean).join(" · ")}
                </p>
                <h3 className="font-display text-2xl leading-tight" style={{ color: BROWN }}>{s.name}</h3>
                {s.venueName && <p className="mt-1 text-sm italic" style={{ color: `${BROWN}cc` }}>at {s.venueName}</p>}
                {s.description && <p className="mt-3 text-sm leading-relaxed" style={{ color: `${BROWN}cc` }}>{s.description}</p>}
                {s.dressCode && (
                  <p
                    className="mt-3 inline-block rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.28em]"
                    style={{ borderColor: `${GOLD}`, color: BROWN, background: `${GOLD}20` }}
                  >
                    {s.dressCode}
                  </p>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}

function ChestFrame({ src, alt, i, reduce }: { src: string; alt: string; i: number; reduce: boolean }) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: i * 0.06, ease: EASE }}
      className="group relative"
    >
      <div
        className="relative overflow-hidden"
        style={{
          borderTopLeftRadius: "50% 22%",
          borderTopRightRadius: "50% 22%",
          borderRadius: "50% 50% 6px 6px / 22% 22% 6px 6px",
          border: `2px solid ${BROWN}`,
          boxShadow: `0 10px 24px #5a3a2440, inset 0 0 24px #5a3a2455`,
          background: BROWN,
        }}
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* brass corner brackets */}
        {[
          { top: 4, left: 4, rot: 0 },
          { top: 4, right: 4, rot: 90 },
          { bottom: 4, left: 4, rot: -90 },
          { bottom: 4, right: 4, rot: 180 },
        ].map((c, k) => (
          <svg
            key={k}
            width="18"
            height="18"
            viewBox="0 0 18 18"
            className="absolute"
            style={{ ...c, transform: `rotate(${c.rot}deg)` }}
            aria-hidden
          >
            <path d="M2 2 L14 2 L14 5 L5 5 L5 14 L2 14 Z" fill={GOLD} stroke={BROWN} strokeWidth="0.8" />
          </svg>
        ))}
        {/* keyhole */}
        <svg
          width="14"
          height="20"
          viewBox="0 0 14 20"
          className="absolute left-1/2 top-2 -translate-x-1/2"
          aria-hidden
        >
          <circle cx="7" cy="6" r="3.2" fill={BROWN} stroke={GOLD} strokeWidth="0.8" />
          <path d="M5 8 L7 16 L9 8 Z" fill={BROWN} stroke={GOLD} strokeWidth="0.8" />
        </svg>
      </div>
    </motion.div>
  );
}

function OpeningChest({ accent, reduce }: { accent: string; reduce: boolean }) {
  return (
    <svg width="240" height="180" viewBox="0 0 240 180" className="mx-auto" aria-hidden>
      <defs>
        <linearGradient id="chest-body" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#7a4d2e" />
          <stop offset="1" stopColor="#3a220f" />
        </linearGradient>
        <radialGradient id="chest-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={accent} stopOpacity="0.9" />
          <stop offset="1" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* glow inside */}
      <motion.ellipse
        cx="120"
        cy="110"
        rx="70"
        ry="18"
        fill="url(#chest-glow)"
        initial={reduce ? undefined : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8, duration: 1.2 }}
      />
      {/* body */}
      <rect x="30" y="90" width="180" height="80" rx="6" fill="url(#chest-body)" stroke={BROWN} strokeWidth="2" />
      <rect x="30" y="130" width="180" height="4" fill={GOLD} opacity="0.85" />
      <rect x="30" y="150" width="180" height="4" fill={GOLD} opacity="0.85" />
      <rect x="110" y="120" width="20" height="26" fill={GOLD} stroke={BROWN} strokeWidth="1" />
      {/* coins spilling */}
      {[
        { cx: 70, cy: 108, d: 0.4 },
        { cx: 92, cy: 118, d: 0.55 },
        { cx: 148, cy: 116, d: 0.7 },
        { cx: 170, cy: 110, d: 0.5 },
        { cx: 120, cy: 104, d: 0.85 },
      ].map((c, i) => (
        <motion.circle
          key={i}
          cx={c.cx}
          cy={c.cy}
          r="6"
          fill={GOLD}
          stroke={BROWN}
          strokeWidth="0.8"
          initial={reduce ? undefined : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: c.d, duration: 0.5, ease: EASE }}
        />
      ))}
      {/* lid — rotates open */}
      <motion.g
        style={{ transformOrigin: "30px 90px" }}
        initial={reduce ? undefined : { rotate: 0 }}
        whileInView={{ rotate: -55 }}
        viewport={{ once: true, margin: "-20% 0px" }}
        transition={{ delay: 0.2, duration: 1.1, ease: EASE, type: "spring", stiffness: 60 }}
      >
        <path d="M 30 90 Q 120 40 210 90 L 210 100 Q 120 55 30 100 Z" fill="url(#chest-body)" stroke={BROWN} strokeWidth="2" />
        <circle cx="120" cy="75" r="4" fill={GOLD} stroke={BROWN} strokeWidth="1" />
      </motion.g>
    </svg>
  );
}

export const TreasureTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || GOLD;
  const tagline = event.tagline?.trim() || "X marks the spot";
  const invitationMessage =
    event.invitationMessage?.trim() ||
    "The map is drawn, the compass points true — join the expedition to claim a day of gold, laughter, and legend.";
  const aboutStory =
    event.aboutStory?.trim() ||
    "Long ago, a birthday was buried beneath jungle vines and river-bends. Now the trail has been re-drawn, the coins re-minted, and the party waits at the final X.";
  const hero =
    event.heroImageUrl ||
    "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80";

  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroTextY = useTransform(heroP, [0, 1], [0, -60]);
  const heroOpacity = useTransform(heroP, [0, 0.7], [1, 0]);

  const showStory = !event.hideStory;
  const showJourney = !event.hideEvents && subEvents.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  const mainDateStr = event.mainDate
    ? new Date(event.mainDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
    : "";

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-sans antialiased"
      style={{ "--accent": accent, color: BROWN } as React.CSSProperties}
    >
      <ParchmentField reduce={reduce} />
      <ScrollProgress color={accent} />

      {/* ─── 01. THE MAP ─── */}
      <section ref={heroRef} className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6 py-24">
        <div className="absolute inset-0">
          <HeroMedia imageSrc={hero} videoSrc={event.heroVideoUrl || undefined} alt={event.eventTitle} className="opacity-25" />
          <div className="absolute inset-0" style={{ background: `${PARCHMENT}dd` }} />
          <TreasureMap reduce={reduce} />
        </div>

        <motion.div
          className="absolute right-6 top-6 sm:right-10 sm:top-10"
          initial={reduce ? undefined : { rotate: -20, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.4 }}
        >
          <CompassRose />
        </motion.div>

        <motion.div style={reduce ? undefined : { y: heroTextY, opacity: heroOpacity }} className="relative z-10 max-w-3xl text-center">
          <p
            className="mb-5 inline-block border px-4 py-1 text-[10px] uppercase tracking-[0.5em]"
            style={{ borderColor: `${BROWN}55`, color: JUNGLE, background: `${PARCHMENT}bb` }}
          >
            {tagline}
          </p>
          <h1
            className="font-display text-[clamp(2.6rem,10vw,7rem)] font-black leading-[0.9] tracking-tight"
            style={{ color: BROWN, textShadow: `2px 2px 0 ${GOLD}55` }}
          >
            {event.eventTitle}
          </h1>
          {(event.person1Name || event.person2Name) && (
            <p className="mt-5 font-display text-lg italic" style={{ color: JUNGLE }}>
              — the expedition of {[event.person1Name, event.person2Name].filter(Boolean).join(" & ")}
            </p>
          )}
          {mainDateStr && (
            <p className="mt-4 text-xs uppercase tracking-[0.4em]" style={{ color: `${BROWN}bb` }}>
              {mainDateStr}
              {event.city ? ` · ${event.city}` : ""}
            </p>
          )}
        </motion.div>

        {!reduce && (
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.4em]"
            style={{ color: JUNGLE }}
            animate={{ y: [0, 6, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          >
            Follow the trail ↓
          </motion.div>
        )}
      </section>

      {/* ─── 02. THE LEGEND ─── */}
      {showStory && (
        <section className="relative mx-auto max-w-5xl px-6 py-24 sm:py-32">
          <div className="grid items-start gap-12 sm:grid-cols-[1fr_1.4fr]">
            <motion.div
              initial={reduce ? false : { opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              <p className="mb-3 text-[10px] uppercase tracking-[0.5em]" style={{ color: JUNGLE }}>
                The Legend
              </p>
              <h2 className="font-display text-3xl leading-[1.1] sm:text-4xl" style={{ color: BROWN }}>
                {invitationMessage}
              </h2>
            </motion.div>
            <motion.div
              initial={reduce ? false : { opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
              className="relative rounded-sm border p-6"
              style={{ background: "#fbf1d8", borderColor: `${BROWN}44`, boxShadow: `0 8px 22px #5a3a2418` }}
            >
              <div className="absolute -left-3 top-6 h-6 w-6 rotate-45" style={{ background: GOLD, border: `1px solid ${BROWN}` }} />
              <p className="text-base leading-relaxed" style={{ color: `${BROWN}dd` }}>
                {aboutStory}
              </p>
            </motion.div>
          </div>
        </section>
      )}

      {/* ─── 03. THE WAYPOINTS ─── */}
      {showJourney && (
        <section className="relative py-20 sm:py-28">
          <div className="mb-14 text-center">
            <p className="text-[10px] uppercase tracking-[0.5em]" style={{ color: JUNGLE }}>The Route</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl" style={{ color: BROWN }}>Waypoints on the map</h2>
            <p className="mt-2 text-sm italic" style={{ color: `${BROWN}aa` }}>Flip each coin to reveal the next stop.</p>
          </div>
          <Waypoints items={subEvents} />
        </section>
      )}

      {/* ─── 04. THE CHESTS ─── */}
      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <p className="mb-3 text-center text-[10px] uppercase tracking-[0.5em]" style={{ color: JUNGLE }}>The Loot</p>
          <h2 className="mb-10 text-center font-display text-3xl sm:text-4xl" style={{ color: BROWN }}>Moments in the vault</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {galleryItems.map((m, i) => (
              <ChestFrame key={`${m.fileName}-${i}`} src={m.publicUrl} alt={m.caption ?? ""} i={i} reduce={reduce} />
            ))}
            {editing && galleryItems.length === 0 && (
              <div
                className="col-span-full flex h-48 items-center justify-center rounded-sm border border-dashed text-sm"
                style={{ borderColor: `${BROWN}66`, color: `${BROWN}aa` }}
              >
                + Add photos to the vault
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── 05. THE X ─── */}
      {showVenue && (
        <section className="relative mx-auto max-w-5xl px-6 py-20 sm:py-28">
          <div className="mb-8 text-center">
            <p className="text-[10px] uppercase tracking-[0.5em]" style={{ color: JUNGLE }}>The Final X</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl" style={{ color: BROWN }}>
              {event.venueName || "Where the trail ends"}
            </h2>
            {event.venueAddress && (
              <p className="mt-2 text-sm italic" style={{ color: `${BROWN}bb` }}>{event.venueAddress}</p>
            )}
          </div>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="overflow-hidden rounded-sm border p-1"
            style={{ borderColor: `${BROWN}55`, background: "#fbf1d8", boxShadow: `0 10px 26px #5a3a241f` }}
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

      {/* ─── 06. OPEN THE CHEST ─── */}
      <section className="relative px-6 py-28 text-center sm:py-40">
        <OpeningChest accent={accent} reduce={reduce} />
        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
          className="mt-10 font-display text-[clamp(2rem,7vw,4.5rem)] font-black leading-[0.95]"
          style={{ color: BROWN }}
        >
          Claim your seat at the {event.eventTitle}
        </motion.h2>
        {event.contactName && (
          <p className="mt-4 text-sm italic" style={{ color: `${BROWN}bb` }}>
            Sealed by {event.contactName}
            {event.contactPhone ? ` · ${event.contactPhone}` : ""}
          </p>
        )}
        {event.rsvpEnabled && event.rsvpLinkOrContact && (
          <motion.a
            href={event.rsvpLinkOrContact}
            target="_blank"
            rel="noreferrer"
            whileHover={reduce ? undefined : { scale: 1.04, y: -2 }}
            className="mt-10 inline-block rounded-full px-10 py-4 font-display text-sm uppercase tracking-[0.35em]"
            style={{
              background: `linear-gradient(180deg, ${GOLD}, #b0801f)`,
              color: BROWN,
              border: `2px solid ${BROWN}`,
              boxShadow: `0 6px 18px #5a3a2440`,
            }}
          >
            Claim the treasure
          </motion.a>
        )}
      </section>

      <footer
        className="border-t py-8 text-center text-xs"
        style={{ borderColor: `${BROWN}33`, color: `${BROWN}88` }}
      >
        <p className="uppercase tracking-[0.35em]">
          {event.eventTitle}
          {event.person1Name ? ` · ${event.person1Name}` : ""}
        </p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default TreasureTemplate;
