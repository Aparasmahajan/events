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

const BG = "#0a0014";
const PINK = "#ff006e";
const PURPLE = "#3a0ca3";
const CYAN = "#4cc9f0";
const CREAM = "#ffe6f2";

function Scanlines() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60] mix-blend-overlay"
      style={{
        background:
          "repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 2px, transparent 4px)",
      }}
    />
  );
}

function VCRNoise({ reduce }: { reduce: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[59] opacity-[0.08]">
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <filter id="arcade-noise">
          <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix values="0 0 0 0 1  0 0 0 0 0.4  0 0 0 0 0.7  0 0 0 0.5 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#arcade-noise)" />
      </svg>
      {!reduce && (
        <motion.div
          className="absolute inset-x-0 h-24"
          style={{ background: `linear-gradient(180deg, transparent, ${CYAN}22, transparent)` }}
          animate={{ y: ["-10%", "110%"] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />
      )}
    </div>
  );
}

function SynthGrid({ reduce }: { reduce: boolean }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] overflow-hidden"
      style={{ perspective: "600px", perspectiveOrigin: "50% 0%" }}
    >
      <div
        className="absolute inset-x-[-20%] bottom-0 h-[140%]"
        style={{
          transform: "rotateX(65deg)",
          transformOrigin: "50% 100%",
          background: `
            linear-gradient(180deg, transparent 0%, ${BG} 90%),
            linear-gradient(90deg, ${PINK} 1px, transparent 1px) 0 0 / 60px 100%,
            linear-gradient(180deg, ${CYAN} 1px, transparent 1px) 0 0 / 100% 60px,
            linear-gradient(180deg, ${PURPLE}, ${BG})
          `,
        }}
      >
        {!reduce && (
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(180deg, ${CYAN} 1px, transparent 1px)`,
              backgroundSize: "100% 60px",
            }}
            animate={{ backgroundPositionY: ["0px", "60px"] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
          />
        )}
      </div>
      <div
        className="absolute inset-x-0 top-0 h-32"
        style={{ background: `radial-gradient(ellipse at 50% 100%, ${PINK}66, transparent 70%)` }}
      />
    </div>
  );
}

function Sun({ reduce }: { reduce: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute left-1/2 top-[38%] -translate-x-1/2">
      <motion.div
        className="h-[42vh] w-[42vh] rounded-full"
        style={{
          background: `linear-gradient(180deg, ${CYAN} 0%, ${PINK} 55%, ${PURPLE} 100%)`,
          boxShadow: `0 0 100px ${PINK}, 0 0 200px ${PURPLE}`,
          maskImage:
            "linear-gradient(180deg, #000 0 50%, transparent 52%, #000 54%, transparent 56%, #000 58%, transparent 60%, #000 62%, transparent 65%, #000 68%, transparent 72%, #000 76%)",
          WebkitMaskImage:
            "linear-gradient(180deg, #000 0 50%, transparent 52%, #000 54%, transparent 56%, #000 58%, transparent 60%, #000 62%, transparent 65%, #000 68%, transparent 72%, #000 76%)",
        }}
        animate={reduce ? undefined : { filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </div>
  );
}

function GlitchTitle({ text }: { text: string }) {
  return (
    <span className="relative inline-block" style={{ color: CREAM }}>
      <span
        aria-hidden
        className="absolute inset-0"
        style={{ color: PINK, transform: "translate(3px, 0)", mixBlendMode: "screen", opacity: 0.85 }}
      >
        {text}
      </span>
      <span
        aria-hidden
        className="absolute inset-0"
        style={{ color: CYAN, transform: "translate(-3px, 0)", mixBlendMode: "screen", opacity: 0.85 }}
      >
        {text}
      </span>
      <span className="relative" style={{ textShadow: `0 0 20px ${PINK}, 0 0 40px ${PURPLE}` }}>
        {text}
      </span>
    </span>
  );
}

function PixelCard({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.6, delay, ease: EASE }}
      className={`relative border-2 p-5 ${className ?? ""}`}
      style={{
        background: `${BG}cc`,
        borderColor: CYAN,
        boxShadow: `4px 4px 0 ${PINK}, 8px 8px 0 ${PURPLE}`,
      }}
    >
      {children}
    </motion.div>
  );
}

function ArcadeTimeline({ items }: { items: SubEvent[] }) {
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <div className="mx-auto max-w-4xl px-6">
      <div className="grid gap-6 sm:grid-cols-2">
        {sorted.map((s, i) => (
          <PixelCard key={s.order} delay={i * 0.08}>
            <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest" style={{ color: CYAN }}>
              <span>LOAD LEVEL {String(s.order).padStart(2, "0")}</span>
              <span style={{ color: PINK }}>
                {[s.date, s.startTime].filter(Boolean).join(" / ")}
              </span>
            </div>
            <h3 className="font-display text-2xl font-black uppercase leading-tight" style={{ color: CREAM, letterSpacing: "0.02em" }}>
              {s.name}
            </h3>
            {s.venueName && <p className="mt-1 font-mono text-xs opacity-70" style={{ color: CYAN }}>@ {s.venueName}</p>}
            {s.description && <p className="mt-3 text-sm leading-relaxed" style={{ color: CREAM, opacity: 0.75 }}>{s.description}</p>}
            {s.dressCode && (
              <p className="mt-4 inline-block border px-3 py-1 font-mono text-[10px] uppercase tracking-widest" style={{ borderColor: PINK, color: PINK }}>
                DRESS CODE: {s.dressCode}
              </p>
            )}
          </PixelCard>
        ))}
      </div>
    </div>
  );
}

export const ArcadeTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || PINK;
  const tagline = event.tagline?.trim() || "PRESS START TO CONTINUE";
  const invitationMessage =
    event.invitationMessage?.trim() ||
    "Insert coin. High score unlocked. You're cordially invited to level up with us in glorious 8-bit style.";
  const aboutStory = event.aboutStory?.trim() || "";
  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const hero =
    event.heroImageUrl ||
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=80";

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroP, [0, 1], [0, -80]);
  const heroOpacity = useTransform(heroP, [0, 0.6], [1, 0]);

  const showStory = !event.hideStory;
  const showJourney = !event.hideEvents && subEvents.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-sans antialiased"
      style={{ background: BG, color: CREAM, "--accent": accent } as React.CSSProperties}
    >
      <VCRNoise reduce={reduce} />
      <Scanlines />
      <ScrollProgress color={accent} />

      {/* ─── 01. TITLE SCREEN ─── */}
      <section ref={heroRef} className="relative h-[100svh] min-h-[640px] overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <HeroMedia imageSrc={hero} videoSrc={event.heroVideoUrl || undefined} alt={event.eventTitle} className="opacity-40" />
        </div>
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 30%, ${PURPLE}55, ${BG} 70%)` }} />
        <Sun reduce={reduce} />
        <SynthGrid reduce={reduce} />

        <motion.div
          style={reduce ? undefined : { y: heroY, opacity: heroOpacity }}
          className="relative z-10 flex h-full flex-col items-center justify-center px-5 text-center"
        >
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0.4, 1] }}
            transition={{ duration: 1.4, delay: 0.2 }}
            className="mb-8 font-mono text-[11px] uppercase tracking-[0.6em]"
            style={{ color: CYAN, textShadow: `0 0 12px ${CYAN}` }}
          >
            ▸ {tagline} ◂
          </motion.p>

          <motion.h1
            initial={reduce ? false : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="font-display font-black uppercase leading-[0.85]"
            style={{ fontSize: "clamp(3.5rem, 13vw, 10rem)", letterSpacing: "0.02em" }}
          >
            {event.eventTitle.split(" ").map((w, i) => (
              <span key={i} className="block">
                <GlitchTitle text={w} />
              </span>
            ))}
          </motion.h1>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7 }}
            className="mt-10 flex flex-wrap justify-center gap-3 font-mono text-xs uppercase"
          >
            {event.mainDate && (
              <span className="border px-3 py-1.5" style={{ borderColor: PINK, color: PINK }}>
                {new Date(event.mainDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
              </span>
            )}
            {event.mainStartTime && (
              <span className="border px-3 py-1.5" style={{ borderColor: CYAN, color: CYAN }}>
                {event.mainStartTime}
              </span>
            )}
            {event.city && (
              <span className="border px-3 py-1.5" style={{ borderColor: CREAM, color: CREAM }}>
                {event.city}
              </span>
            )}
          </motion.div>

          {!reduce && (
            <motion.p
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="mt-14 font-mono text-[10px] uppercase tracking-[0.5em]"
              style={{ color: CREAM }}
            >
              ● INSERT COIN ●
            </motion.p>
          )}
        </motion.div>
      </section>

      {/* ─── 02. STORY / README.TXT ─── */}
      {showStory && (
        <section className="relative mx-auto max-w-5xl px-6 py-28 sm:py-36">
          <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.5em]" style={{ color: CYAN }}>
            &gt; README.TXT_
          </p>
          <div className="grid items-start gap-10 sm:grid-cols-5">
            <motion.h2
              initial={reduce ? false : { opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: EASE }}
              className="font-display text-3xl font-black uppercase leading-[1.05] sm:col-span-3 sm:text-5xl"
              style={{ color: CREAM, textShadow: `0 0 18px ${PINK}88` }}
            >
              {invitationMessage}
            </motion.h2>
            <motion.p
              initial={reduce ? false : { opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
              className="sm:col-span-2 font-mono text-sm leading-relaxed"
              style={{ color: CREAM, opacity: 0.8 }}
            >
              {aboutStory ||
                "// A milestone birthday party. // BYOB (bring your own bandana). // Dress code: neon. // Cheat codes accepted at the door."}
            </motion.p>
          </div>
          <div
            className="mt-10 h-[2px] w-full"
            style={{ background: `linear-gradient(90deg, ${PINK}, ${CYAN}, ${PURPLE})` }}
          />
        </section>
      )}

      {/* ─── 03. LEVELS / SUB-EVENTS ─── */}
      {showJourney && (
        <section className="relative py-24 sm:py-32">
          <p className="mb-14 text-center font-mono text-[10px] uppercase tracking-[0.5em]" style={{ color: CYAN }}>
            ▸ SELECT LEVEL ◂
          </p>
          <ArcadeTimeline items={subEvents} />
        </section>
      )}

      {/* ─── 04. GALLERY / HIGH SCORES ─── */}
      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <p className="mb-10 text-center font-mono text-[10px] uppercase tracking-[0.5em]" style={{ color: PINK }}>
            ★ HIGH SCORES ★
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((m, i) => (
              <motion.div
                key={`${m.fileName}-${i}`}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="group relative overflow-hidden border-2"
                style={{ borderColor: CYAN, boxShadow: `4px 4px 0 ${PINK}` }}
              >
                <img
                  src={m.publicUrl}
                  alt={m.caption ?? ""}
                  className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  style={{ filter: "saturate(1.2) contrast(1.05)" }}
                  loading="lazy"
                />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{ background: `linear-gradient(180deg, transparent 60%, ${BG}cc)` }}
                />
                <p
                  className="absolute bottom-2 left-2 font-mono text-[10px] uppercase tracking-widest"
                  style={{ color: CYAN }}
                >
                  P{String(i + 1).padStart(2, "0")} · {String((i + 1) * 1337).padStart(6, "0")}
                </p>
              </motion.div>
            ))}
            {editing && galleryItems.length === 0 && (
              <div
                className="col-span-full flex h-56 items-center justify-center border-2 border-dashed font-mono text-xs uppercase tracking-widest"
                style={{ borderColor: PINK, color: PINK }}
              >
                + INSERT MEMORY CARD
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── 05. LOCATION / MAP ─── */}
      {showVenue && (
        <section className="relative mx-auto max-w-5xl px-6 py-24 sm:py-32">
          <p className="mb-6 text-center font-mono text-[10px] uppercase tracking-[0.5em]" style={{ color: CYAN }}>
            ⌂ WORLD 1-1 · COORDINATES ⌂
          </p>
          {event.venueName && (
            <h3 className="mb-6 text-center font-display text-3xl font-black uppercase" style={{ color: CREAM, textShadow: `0 0 14px ${PINK}` }}>
              {event.venueName}
            </h3>
          )}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="overflow-hidden border-2 p-1"
            style={{ borderColor: PINK, boxShadow: `6px 6px 0 ${PURPLE}` }}
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

      {/* ─── 06. CTA / RSVP ─── */}
      <section className="relative px-6 py-28 text-center sm:py-40">
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE }}
          className="mx-auto max-w-3xl"
        >
          <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.6em]" style={{ color: CYAN }}>
            ▸ GAME OVER? NOT YET ◂
          </p>
          <h2 className="font-display font-black uppercase leading-[0.9]" style={{ fontSize: "clamp(2.5rem, 8vw, 5.5rem)", letterSpacing: "0.02em" }}>
            <GlitchTitle text={event.eventTitle} />
          </h2>
          {event.person1Name && (
            <p className="mt-6 font-mono text-sm uppercase tracking-[0.4em]" style={{ color: PINK }}>
              PLAYER 1: {event.person1Name}
            </p>
          )}
          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <motion.a
              href={event.rsvpLinkOrContact}
              target="_blank"
              rel="noreferrer"
              whileHover={reduce ? undefined : { scale: 1.04, y: -2 }}
              className="mt-10 inline-block border-2 px-10 py-4 font-mono text-sm font-bold uppercase tracking-[0.35em]"
              style={{
                background: PINK,
                borderColor: CYAN,
                color: BG,
                boxShadow: `6px 6px 0 ${PURPLE}, 0 0 30px ${PINK}88`,
              }}
            >
              ▸ PRESS START ◂
            </motion.a>
          )}
        </motion.div>
      </section>

      <footer
        className="border-t-2 py-8 text-center font-mono text-xs uppercase tracking-[0.3em]"
        style={{ borderColor: PINK, color: CYAN, opacity: 0.7 }}
      >
        <p>© {new Date().getFullYear()} · {event.eventTitle}{event.person1Name ? ` · ${event.person1Name}` : ""} · 100% COMPLETE</p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default ArcadeTemplate;
