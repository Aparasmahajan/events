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

const BG_DEEP = "#0f2818";
const BG_MID = "#1e4a2e";
const STONE = "#6b6960";
const CREAM = "#f6ecdb";
const SUNSET = "#e87a3c";
const GOLD = "#c9a446";

const VINES = [
  { x: "4%", d: "M0,0 C 20,60 -20,120 10,200 S 30,320 -10,440 T 10,620", leaves: [80, 200, 360, 520] },
  { x: "22%", d: "M0,0 C -15,50 25,110 -5,190 S -30,300 15,420 T -5,580", leaves: [110, 260, 400] },
  { x: "44%", d: "M0,0 C 25,70 -30,140 10,220 S 20,350 -20,460 T 10,600", leaves: [90, 230, 390, 540] },
  { x: "66%", d: "M0,0 C -20,55 20,125 -10,210 S 25,330 -15,440 T 5,600", leaves: [140, 300, 470] },
  { x: "82%", d: "M0,0 C 15,65 -25,130 5,215 S 25,340 -15,460 T 10,620", leaves: [100, 250, 420, 560] },
  { x: "94%", d: "M0,0 C -10,50 20,115 -15,205 S -25,320 15,440 T -10,600", leaves: [130, 290, 450] },
];

function VineDrapes({ reduce }: { reduce: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-[720px] overflow-hidden">
      {VINES.map((v, i) => (
        <motion.svg
          key={i}
          className="absolute top-0"
          style={{ left: v.x, width: 60, height: 720, transformOrigin: "top center" }}
          viewBox="-40 0 80 720"
          animate={reduce ? undefined : { rotate: [-1.2, 1.4, -1.2] }}
          transition={{ duration: 6 + i * 0.7, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
        >
          <path d={v.d} fill="none" stroke="#3a6a3a" strokeWidth="2.2" strokeLinecap="round" opacity="0.85" />
          <path d={v.d} fill="none" stroke="#5b8f4a" strokeWidth="0.7" strokeLinecap="round" opacity="0.6" />
          {v.leaves.map((y, li) => (
            <g key={li} transform={`translate(${li % 2 === 0 ? -8 : 8}, ${y})`}>
              <ellipse
                cx="0" cy="0" rx="10" ry="4"
                fill="#4a7a3a"
                transform={`rotate(${li % 2 === 0 ? -35 : 35})`}
                opacity="0.9"
              />
              <ellipse
                cx="0" cy="0" rx="8" ry="2.6"
                fill="#6ba050"
                transform={`rotate(${li % 2 === 0 ? -35 : 35})`}
                opacity="0.6"
              />
            </g>
          ))}
        </motion.svg>
      ))}
    </div>
  );
}

function TempleSilhouette({ y }: { y: import("framer-motion").MotionValue<number> }) {
  return (
    <motion.svg
      aria-hidden
      viewBox="0 0 900 500"
      className="absolute inset-x-0 bottom-0 z-[1] w-full opacity-[0.55]"
      style={{ y }}
      preserveAspectRatio="xMidYEnd meet"
    >
      <defs>
        <linearGradient id="templeGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#1a3620" stopOpacity="0.95" />
          <stop offset="1" stopColor="#07160c" stopOpacity="1" />
        </linearGradient>
      </defs>
      <polygon points="450,60 260,340 640,340" fill="url(#templeGrad)" />
      <polygon points="450,110 300,340 600,340" fill="#0f2818" opacity="0.7" />
      <rect x="180" y="340" width="60" height="160" fill="url(#templeGrad)" />
      <rect x="260" y="340" width="60" height="160" fill="url(#templeGrad)" />
      <rect x="580" y="340" width="60" height="160" fill="url(#templeGrad)" />
      <rect x="660" y="340" width="60" height="160" fill="url(#templeGrad)" />
      <rect x="150" y="320" width="600" height="30" fill="url(#templeGrad)" />
      <rect x="140" y="470" width="620" height="30" fill="url(#templeGrad)" />
      <line x1="180" y1="380" x2="240" y2="380" stroke="#0a1a10" strokeWidth="2" opacity="0.6" />
      <line x1="180" y1="420" x2="240" y2="420" stroke="#0a1a10" strokeWidth="2" opacity="0.6" />
      <line x1="580" y1="380" x2="640" y2="380" stroke="#0a1a10" strokeWidth="2" opacity="0.6" />
      <line x1="660" y1="380" x2="720" y2="420" stroke="#0a1a10" strokeWidth="2" opacity="0" />
      <circle cx="450" cy="220" r="18" fill={GOLD} opacity="0.4" />
      <path d="M 435 220 L 450 200 L 465 220 L 450 240 Z" fill={SUNSET} opacity="0.5" />
    </motion.svg>
  );
}

function Waterfall({ reduce }: { reduce: boolean }) {
  const streams = Array.from({ length: 7 }, (_, i) => i);
  return (
    <div aria-hidden className="pointer-events-none absolute right-0 top-0 z-[2] h-full w-24 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(120,180,220,0.05) 40%, rgba(180,220,240,0.10))",
        }}
      />
      {!reduce &&
        streams.map((i) => (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{
              right: `${8 + i * 12}%`,
              top: -40,
              width: 1.5,
              height: 60 + (i % 3) * 30,
              background:
                "linear-gradient(180deg, rgba(220,240,255,0.5), rgba(150,210,240,0.15) 70%, transparent)",
            }}
            animate={{ y: ["-10%", "110vh"] }}
            transition={{
              duration: 2.4 + (i % 4) * 0.6,
              delay: i * 0.25,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
    </div>
  );
}

function ChiseledIcon({ kind }: { kind: string }) {
  return (
    <span
      className="flex h-11 w-11 items-center justify-center rounded-full border"
      style={{
        background: `linear-gradient(145deg, ${STONE}, #4a4842)`,
        borderColor: "#3a3832",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -2px 4px rgba(0,0,0,0.4)",
      }}
    >
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke={GOLD} strokeWidth="1.6">
        {kind === "paw" && (
          <g>
            <circle cx="8" cy="10" r="1.6" fill={GOLD} />
            <circle cx="16" cy="10" r="1.6" fill={GOLD} />
            <circle cx="6" cy="14" r="1.3" fill={GOLD} />
            <circle cx="18" cy="14" r="1.3" fill={GOLD} />
            <path d="M 8 17 Q 12 21 16 17 Q 15 14 12 14 Q 9 14 8 17 Z" fill={GOLD} />
          </g>
        )}
        {kind === "torch" && (
          <g>
            <path d="M 12 4 Q 9 8 12 12 Q 15 8 12 4 Z" fill={SUNSET} stroke="none" />
            <rect x="10.5" y="12" width="3" height="8" fill={GOLD} stroke="none" />
          </g>
        )}
        {kind === "compass" && (
          <g>
            <circle cx="12" cy="12" r="8" />
            <path d="M 12 6 L 14 12 L 12 18 L 10 12 Z" fill={GOLD} stroke="none" />
          </g>
        )}
        {kind === "gem" && (
          <g>
            <path d="M 6 10 L 12 4 L 18 10 L 12 20 Z" fill={SUNSET} stroke={GOLD} />
            <path d="M 6 10 L 18 10" />
          </g>
        )}
      </svg>
    </span>
  );
}

const ICONS = ["paw", "torch", "compass", "gem"];

function StoneTablet({
  s,
  i,
  accent,
}: {
  s: SubEvent;
  i: number;
  accent: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
      whileHover={reduce ? undefined : { y: -4, rotate: -0.4 }}
      className="relative"
    >
      <div
        className="relative overflow-hidden p-6 sm:p-7"
        style={{
          background: "linear-gradient(155deg, #efe1c4 0%, #e2d0a8 55%, #cbb98d 100%)",
          borderRadius: "6px",
          boxShadow: "inset 0 0 0 2px #b6a377, inset 0 0 40px rgba(90,60,20,0.18), 0 12px 30px rgba(0,0,0,0.45)",
          color: "#2b2418",
        }}
      >
        <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="none">
          <path d="M 0 8 L 10 2 L 24 10 L 40 3 L 60 9 L 80 4 L 100% 8 L 100% 0 L 0 0 Z" fill="#efe1c4" />
          <path d="M 0 100% L 14 96% L 30 100% L 50 96% L 74 100% L 94 96% L 100% 100% L 100% 100% L 0 100% Z" fill="#efe1c4" />
          <path d="M 12 26 L 20 34 M 68 18 L 74 24 M 40 60 L 46 66 M 88 70 L 94 76" stroke="#a8935e" strokeWidth="0.8" opacity="0.55" />
        </svg>

        <div className="relative flex items-start gap-3">
          <ChiseledIcon kind={ICONS[i % ICONS.length]} />
          <div className="min-w-0 flex-1">
            <p
              className="text-[10px] uppercase tracking-[0.3em]"
              style={{ color: accent, opacity: 0.9 }}
            >
              Chapter {String(s.order).padStart(2, "0")}
            </p>
            <h3
              className="font-display mt-1 text-xl uppercase tracking-wide"
              style={{ color: "#2b2418", letterSpacing: "0.04em" }}
            >
              {s.name}
            </h3>
            <p className="mt-1 text-[11px] uppercase tracking-[0.22em] opacity-70">
              {[s.date, s.startTime].filter(Boolean).join(" · ")}
            </p>
          </div>
        </div>

        {s.venueName && (
          <p className="relative mt-3 text-sm opacity-80" style={{ color: "#3a2f1c" }}>
            @ {s.venueName}
          </p>
        )}
        {s.description && (
          <p className="relative mt-2 text-sm leading-relaxed opacity-75">{s.description}</p>
        )}
        {s.dressCode && (
          <p
            className="relative mt-4 inline-block px-3 py-1 text-[10px] uppercase tracking-[0.22em]"
            style={{
              background: "rgba(200,164,70,0.18)",
              border: "1px solid rgba(140,110,40,0.4)",
              color: "#5a4218",
              borderRadius: "2px",
            }}
          >
            {s.dressCode}
          </p>
        )}
      </div>
    </motion.article>
  );
}

export const JungleTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || SUNSET;
  const tagline = event.tagline?.trim() || "Into the wild we go";
  const invitationMessage =
    event.invitationMessage?.trim() ||
    "Beyond the ruins of an ancient temple, hidden by vines and lit by torchlight, a birthday adventure begins.";
  const aboutStory = event.aboutStory?.trim() || "";
  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const hero =
    event.heroImageUrl ||
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80";

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const templeY = useTransform(heroP, [0, 1], [0, -60]);
  const heroTextY = useTransform(heroP, [0, 1], [0, -80]);
  const heroOpacity = useTransform(heroP, [0, 0.6], [1, 0]);

  const showStory = !event.hideStory;
  const showJourney = !event.hideEvents && subEvents.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);
  const sortedEvents = [...subEvents].sort((a, b) => a.order - b.order);

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-sans antialiased"
      style={{
        background: `radial-gradient(1200px 800px at 50% 0%, ${BG_MID} 0%, ${BG_DEEP} 60%, #07160c 100%)`,
        color: CREAM,
        "--accent": accent,
      } as React.CSSProperties}
    >
      <ScrollProgress color={accent} />
      <Waterfall reduce={reduce} />

      <section
        ref={heroRef}
        className="relative h-[100svh] min-h-[640px] overflow-hidden"
      >
        <VineDrapes reduce={reduce} />
        <div className="absolute inset-0 z-[0]">
          <HeroMedia
            imageSrc={hero}
            videoSrc={event.heroVideoUrl || undefined}
            alt={event.eventTitle}
            className="opacity-40"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, rgba(15,40,24,0.55) 0%, rgba(15,40,24,0.7) 50%, ${BG_DEEP} 100%)`,
            }}
          />
        </div>

        <TempleSilhouette y={templeY} />

        <motion.div
          style={reduce ? undefined : { y: heroTextY, opacity: heroOpacity }}
          className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
        >
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="mb-5 text-[11px] uppercase tracking-[0.55em]"
            style={{ color: GOLD }}
          >
            {tagline}
          </motion.p>

          <h1
            className="font-display font-black uppercase leading-[0.9] tracking-tight"
            style={{
              fontSize: "clamp(2.75rem, 11vw, 8rem)",
              color: CREAM,
              textShadow: `0 2px 0 rgba(0,0,0,0.35), 0 0 40px rgba(232,122,60,0.35)`,
              letterSpacing: "0.01em",
            }}
          >
            {event.eventTitle.split(" ").map((w, i) => (
              <motion.span
                key={i}
                className="mr-3 inline-block"
                initial={reduce ? false : { opacity: 0, y: 40, rotate: -3 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ duration: 0.9, delay: 0.25 + i * 0.12, ease: EASE }}
              >
                {w}
              </motion.span>
            ))}
          </h1>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3 text-[11px] uppercase tracking-[0.4em]"
            style={{ color: CREAM, opacity: 0.85 }}
          >
            {event.mainDate && (
              <span>
                {new Date(event.mainDate).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            )}
            {event.mainStartTime && <span style={{ color: GOLD }}>~</span>}
            {event.mainStartTime && <span>{event.mainStartTime}</span>}
            {event.city && <span style={{ color: GOLD }}>~</span>}
            {event.city && <span>{event.city}</span>}
          </motion.div>
        </motion.div>
      </section>

      {showStory && (
        <section className="relative z-10 mx-auto max-w-5xl px-6 py-24 sm:py-32">
          <div className="grid items-center gap-12 sm:grid-cols-2">
            <motion.div
              initial={reduce ? false : { opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: EASE }}
            >
              <p className="mb-3 text-[10px] uppercase tracking-[0.5em]" style={{ color: GOLD }}>
                The Legend
              </p>
              <h2
                className="font-display text-3xl uppercase leading-[1.05] tracking-tight sm:text-4xl"
                style={{ color: CREAM, textShadow: "0 1px 0 rgba(0,0,0,0.3)" }}
              >
                {invitationMessage}
              </h2>
            </motion.div>
            <motion.div
              initial={reduce ? false : { opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.15, ease: EASE }}
            >
              <p className="text-base leading-relaxed sm:text-lg" style={{ color: CREAM, opacity: 0.8 }}>
                {aboutStory ||
                  "Follow the vine-wrapped path through the canopy. Torches flicker along the way, waterfalls hum in the distance, and somewhere past the ruins a cake waits under lantern light."}
              </p>
              <div
                className="mt-6 h-[2px] w-24"
                style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
              />
            </motion.div>
          </div>
        </section>
      )}

      {showJourney && (
        <section className="relative z-10 mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-3 text-center text-[10px] uppercase tracking-[0.5em]"
            style={{ color: GOLD }}
          >
            The Expedition
          </motion.p>
          <h2
            className="font-display mb-12 text-center text-3xl uppercase tracking-tight sm:text-4xl"
            style={{ color: CREAM }}
          >
            Chart the path
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {sortedEvents.map((s, i) => (
              <StoneTablet key={s.order} s={s} i={i} accent={accent} />
            ))}
          </div>
        </section>
      )}

      {showGallery && (
        <section className="relative z-10 mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-10 text-center text-[10px] uppercase tracking-[0.5em]"
            style={{ color: GOLD }}
          >
            Field Notes
          </motion.p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((m, i) => (
              <motion.div
                key={`${m.fileName}-${i}`}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="group relative overflow-hidden"
                style={{
                  borderRadius: "4px",
                  border: `2px solid ${STONE}`,
                  boxShadow: "0 12px 24px rgba(0,0,0,0.45)",
                }}
              >
                <img
                  src={m.publicUrl}
                  alt={m.caption ?? ""}
                  className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div
                  className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
                  style={{ background: "linear-gradient(180deg, transparent 50%, rgba(15,40,24,0.85))" }}
                />
                {m.caption && (
                  <div
                    className="absolute inset-x-0 bottom-0 translate-y-2 p-3 text-xs uppercase tracking-[0.2em] opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100"
                    style={{ color: CREAM }}
                  >
                    {m.caption}
                  </div>
                )}
              </motion.div>
            ))}
            {editing && galleryItems.length === 0 && (
              <div
                className="col-span-full flex h-56 items-center justify-center border-2 border-dashed text-sm"
                style={{ borderColor: STONE, color: CREAM, opacity: 0.6, borderRadius: "4px" }}
              >
                + Add photos
              </div>
            )}
          </div>
        </section>
      )}

      {showVenue && (
        <section className="relative z-10 mx-auto max-w-5xl px-6 py-20 sm:py-28">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-3 text-center text-[10px] uppercase tracking-[0.5em]"
            style={{ color: GOLD }}
          >
            The Clearing
          </motion.p>
          {event.venueName && (
            <h2
              className="font-display mb-8 text-center text-3xl uppercase tracking-tight"
              style={{ color: CREAM }}
            >
              {event.venueName}
            </h2>
          )}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="overflow-hidden p-1"
            style={{
              background: `linear-gradient(145deg, ${STONE}, #3a3832)`,
              borderRadius: "6px",
              boxShadow: "inset 0 0 0 2px rgba(0,0,0,0.35), 0 16px 32px rgba(0,0,0,0.5)",
            }}
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

      <section className="relative z-10 px-6 py-24 text-center sm:py-36">
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: EASE }}
          className="mx-auto max-w-3xl"
        >
          <div
            aria-hidden
            className="mx-auto mb-8 h-24 w-24 rounded-full"
            style={{
              background: `radial-gradient(circle, ${SUNSET}, transparent 70%)`,
              filter: "blur(24px)",
              opacity: 0.55,
            }}
          />
          <h2
            className="font-display uppercase leading-[0.9] tracking-tight"
            style={{
              fontSize: "clamp(2.25rem, 7vw, 5rem)",
              color: CREAM,
              textShadow: "0 2px 0 rgba(0,0,0,0.35)",
            }}
          >
            Join the adventure
          </h2>
          {event.person1Name && (
            <p className="mt-4 text-sm uppercase tracking-[0.4em]" style={{ color: GOLD }}>
              For {event.person1Name}
            </p>
          )}
          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <motion.a
              whileHover={reduce ? undefined : { scale: 1.04 }}
              href={event.rsvpLinkOrContact}
              target="_blank"
              rel="noreferrer"
              className="mt-10 inline-block px-12 py-4 text-sm uppercase tracking-[0.35em] transition-all"
              style={{
                background: `linear-gradient(180deg, ${accent}, #b95a25)`,
                color: CREAM,
                borderRadius: "3px",
                border: `1px solid ${GOLD}`,
                boxShadow: "0 8px 24px rgba(232,122,60,0.35), inset 0 1px 0 rgba(255,255,255,0.2)",
              }}
            >
              Answer the call
            </motion.a>
          )}
        </motion.div>
      </section>

      <footer
        className="relative z-10 border-t py-8 text-center text-xs"
        style={{ borderColor: "rgba(107,105,96,0.35)", color: CREAM, opacity: 0.55 }}
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

export default JungleTemplate;
