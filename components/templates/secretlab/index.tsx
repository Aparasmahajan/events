"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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

const BUNKER = "#20242a";
const VOID = "#0e1014";
const WARN = "#e8d55c";
const ELECTRIC = "#42a8ff";
const DANGER = "#ff4b4b";
const IVORY = "#f2f4f8";

const LED_STATES: Array<"green" | "yellow" | "red"> = ["green", "green", "yellow", "green", "red", "yellow"];

function ScanField({ reduce }: { reduce: boolean }) {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden" style={{ background: `linear-gradient(180deg, ${BUNKER}, ${VOID} 60%, ${VOID})` }}>
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent 0px, transparent 2px, ${IVORY} 2px, ${IVORY} 3px)`,
        }}
      />
      <svg className="absolute inset-0 h-full w-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
        <filter id="secretlab-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" />
        </filter>
        <rect width="100%" height="100%" filter="url(#secretlab-noise)" />
      </svg>
      {!reduce && (
        <motion.div
          className="absolute right-6 top-0 h-full w-px"
          style={{ background: `linear-gradient(180deg, transparent, ${ELECTRIC}, transparent)` }}
          animate={{ opacity: [0.2, 0.9, 0.2] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 50% 20%, ${BUNKER}00 0%, ${VOID}cc 70%)` }} />
    </div>
  );
}

function ClassTag({ level, label, accent }: { level: string; label: string; accent: string }) {
  return (
    <p className="mb-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.35em] opacity-70">
      <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: accent, boxShadow: `0 0 8px ${accent}` }} />
      <span>[//DECLASSIFIED &mdash; LEVEL {level}]</span>
      <span className="opacity-60">{label}</span>
    </p>
  );
}

function VaultDoor({ unlocked, accent, reduce }: { unlocked: boolean; accent: string; reduce: boolean }) {
  return (
    <svg viewBox="0 0 320 320" className="h-72 w-72 sm:h-96 sm:w-96" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <radialGradient id="doorFace" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#2a2f36" />
          <stop offset="100%" stopColor="#0e1014" />
        </radialGradient>
      </defs>
      <circle cx="160" cy="160" r="150" fill="url(#doorFace)" stroke={IVORY} strokeOpacity="0.15" strokeWidth="2" />
      <circle cx="160" cy="160" r="130" fill="none" stroke={IVORY} strokeOpacity="0.08" strokeWidth="1" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
        const rad = (a * Math.PI) / 180;
        const x = 160 + Math.cos(rad) * 140;
        const y = 160 + Math.sin(rad) * 140;
        return <circle key={a} cx={x} cy={y} r="4" fill={IVORY} opacity="0.35" />;
      })}
      <motion.g
        style={{ transformOrigin: "160px 160px" }}
        animate={reduce ? undefined : { rotate: unlocked ? 220 : [0, 40, -20, 60, 0] }}
        transition={reduce ? undefined : unlocked ? { duration: 1.6, ease: EASE } : { duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <line x1="160" y1="160" x2="160" y2="70" stroke={unlocked ? "#5ce38a" : accent} strokeWidth="4" strokeLinecap="round" />
        <line x1="160" y1="160" x2="250" y2="160" stroke={unlocked ? "#5ce38a" : accent} strokeWidth="4" strokeLinecap="round" />
        <line x1="160" y1="160" x2="160" y2="250" stroke={unlocked ? "#5ce38a" : accent} strokeWidth="4" strokeLinecap="round" />
        <line x1="160" y1="160" x2="70" y2="160" stroke={unlocked ? "#5ce38a" : accent} strokeWidth="4" strokeLinecap="round" />
      </motion.g>
      <circle cx="160" cy="160" r="20" fill="#0e1014" stroke={unlocked ? "#5ce38a" : accent} strokeWidth="2" />
      <circle cx="160" cy="160" r="6" fill={unlocked ? "#5ce38a" : accent} />
    </svg>
  );
}

function ModuleCard({ item, i, accent }: { item: SubEvent; i: number; accent: string }) {
  const reduce = useReducedMotion();
  const led = LED_STATES[i % LED_STATES.length];
  const ledColor = led === "green" ? "#5ce38a" : led === "yellow" ? WARN : DANGER;
  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.55, delay: i * 0.06, ease: EASE }}
      whileHover={reduce ? undefined : { x: 3, borderColor: accent }}
      className="relative flex gap-4 rounded-sm border border-white/[0.08] bg-white/[0.02] p-5 backdrop-blur-sm transition-colors"
      style={{ clipPath: "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))" }}
    >
      <div className="flex flex-col gap-2 pt-1">
        {[0, 1, 2].map((d) => (
          <span
            key={d}
            className="inline-block h-2 w-2 rounded-full"
            style={{
              background: d === 0 ? ledColor : "rgba(255,255,255,0.1)",
              boxShadow: d === 0 ? `0 0 6px ${ledColor}` : "none",
            }}
          />
        ))}
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-2 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] opacity-60">
          <span style={{ color: accent }}>MOD.{String(item.order).padStart(3, "0")}</span>
          {item.date && <span className="opacity-70">{item.date}</span>}
          {item.startTime && <span className="opacity-50">{item.startTime}</span>}
        </div>
        <h3 className="font-display text-lg font-semibold uppercase tracking-tight sm:text-xl">{item.name}</h3>
        {item.venueName && <p className="mt-1 font-mono text-xs opacity-55">// {item.venueName}</p>}
        {item.description && <p className="mt-2 text-sm leading-relaxed opacity-65">{item.description}</p>}
        {item.dressCode && (
          <p className="mt-3 inline-block border border-white/[0.1] px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] opacity-60">
            {item.dressCode}
          </p>
        )}
      </div>
    </motion.article>
  );
}

export const SecretlabTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;
  const [unlocked, setUnlocked] = useState(false);

  const accent = event.themeAccentColor || ELECTRIC;
  const tagline = event.tagline?.trim() || "Underground R&D. Restricted access.";
  const invitationMessage = event.invitationMessage?.trim() || "Beneath the surface, something has been quietly assembled. The vault is scheduled to open.";
  const aboutStory = event.aboutStory?.trim() || "";
  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const hero = event.heroImageUrl || "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80";

  useEffect(() => {
    if (reduce) {
      setUnlocked(true);
      return;
    }
    const id = setTimeout(() => setUnlocked(true), 1800);
    return () => clearTimeout(id);
  }, [reduce]);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroTextY = useTransform(heroP, [0, 0.6], [0, -60]);
  const heroOpacity = useTransform(heroP, [0, 0.6], [1, 0]);

  const showStory = !event.hideStory;
  const showModules = !event.hideEvents && subEvents.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  const sortedModules = [...subEvents].sort((a, b) => a.order - b.order);
  const dateLabel = event.mainDate
    ? new Date(event.mainDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })
    : "";

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-sans antialiased"
      style={{ background: VOID, color: IVORY, "--accent": accent } as React.CSSProperties}
    >
      <ScanField reduce={reduce} />
      <ScrollProgress color={accent} />

      {/* ─── 01. VAULT ─── */}
      <section ref={heroRef} className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6 py-24">
        <div className="absolute inset-0">
          <HeroMedia imageSrc={hero} videoSrc={event.heroVideoUrl || undefined} alt={event.eventTitle} className="opacity-25" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${VOID}dd 0%, ${VOID}88 40%, ${VOID}ee 100%)` }} />
        </div>

        <motion.div style={reduce ? undefined : { y: heroTextY, opacity: heroOpacity }} className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
          <ClassTag level="05" label="Facility Access" accent={unlocked ? "#5ce38a" : DANGER} />

          <VaultDoor unlocked={unlocked} accent={accent} reduce={reduce} />

          <motion.p
            key={unlocked ? "granted" : "pending"}
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mt-6 font-mono text-xs uppercase tracking-[0.55em]"
            style={{ color: unlocked ? "#5ce38a" : DANGER, textShadow: `0 0 12px ${unlocked ? "#5ce38a" : DANGER}` }}
          >
            {unlocked ? "// Access Granted" : "// Access Pending"}
          </motion.p>

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 18, filter: "blur(6px)" }}
            animate={unlocked ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
            transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
            className="mt-8 font-display text-[clamp(2.4rem,8vw,5.5rem)] font-black uppercase leading-[0.9] tracking-tight"
          >
            {event.eventTitle}
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={unlocked ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-4 max-w-xl font-mono text-xs uppercase tracking-[0.35em] opacity-70"
            style={{ color: accent }}
          >
            {tagline}
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={unlocked ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.3em] opacity-75"
          >
            {dateLabel && <span>{dateLabel}</span>}
            {event.mainStartTime && <span style={{ color: WARN }}>{event.mainStartTime}</span>}
            {event.city && <span>&mdash; {event.city}</span>}
          </motion.div>
        </motion.div>
      </section>

      {/* ─── 02. BRIEF ─── */}
      {showStory && (
        <section className="relative mx-auto max-w-4xl px-6 py-24 sm:py-32">
          <ClassTag level="03" label="Operational Brief" accent={accent} />
          <div className="grid gap-10 sm:grid-cols-5">
            <div className="sm:col-span-3">
              <h2 className="font-display text-2xl uppercase leading-tight tracking-tight sm:text-4xl">
                {invitationMessage}
              </h2>
            </div>
            <div className="relative sm:col-span-2">
              <div className="absolute -left-2 top-0 h-full w-px" style={{ background: `linear-gradient(180deg, ${accent}, transparent)` }} />
              <p className="pl-4 text-base leading-relaxed opacity-70">
                {aboutStory || "Prototypes have been rerouted through channels we do not name. What arrives at the launch is the version that survived. Everything else stays behind."}
              </p>
              <p className="mt-5 pl-4 font-mono text-[10px] uppercase tracking-[0.3em] opacity-50">
                &gt; File: {event.eventTitle.replace(/\s+/g, "_").toLowerCase()}.brief
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ─── 03. MODULES ─── */}
      {showModules && (
        <section className="relative mx-auto max-w-5xl px-6 py-20 sm:py-28">
          <ClassTag level="04" label="Assembly Sequence" accent={accent} />
          <p className="mb-10 max-w-xl font-mono text-xs uppercase tracking-[0.3em] opacity-55">
            &gt; Server modules online. Read from top to bottom.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {sortedModules.map((s, i) => (
              <ModuleCard key={s.order} item={s} i={i} accent={accent} />
            ))}
          </div>
        </section>
      )}

      {/* ─── 04. GALLERY ─── */}
      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <ClassTag level="02" label="Surveillance Feed" accent={accent} />
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {galleryItems.map((m, i) => (
              <motion.figure
                key={`${m.fileName}-${i}`}
                initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.05 }}
                className="group relative overflow-hidden rounded-sm border border-white/[0.06]"
                style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))" }}
              >
                <img
                  src={m.publicUrl}
                  alt={m.caption ?? ""}
                  className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0e1014]/80 via-transparent to-transparent" />
                <figcaption className="absolute bottom-2 left-2 font-mono text-[9px] uppercase tracking-[0.3em] opacity-70">
                  CAM.{String(i + 1).padStart(2, "0")}
                </figcaption>
              </motion.figure>
            ))}
            {editing && galleryItems.length === 0 && (
              <div className="col-span-full flex h-48 items-center justify-center rounded-sm border border-dashed border-white/20 font-mono text-xs uppercase tracking-[0.3em] opacity-50">
                + Add photos
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── 05. COORDINATES ─── */}
      {showVenue && (
        <section className="relative mx-auto max-w-5xl px-6 py-20 sm:py-28">
          <ClassTag level="01" label="Coordinates" accent={accent} />
          {event.venueName && (
            <p className="mb-2 font-display text-2xl uppercase tracking-tight sm:text-3xl">{event.venueName}</p>
          )}
          {event.venueAddress && (
            <p className="mb-6 font-mono text-xs uppercase tracking-[0.25em] opacity-60">&gt; {event.venueAddress}</p>
          )}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            className="overflow-hidden rounded-sm border border-white/[0.08] bg-white/[0.02] p-1"
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

      {/* ─── 06. RELEASE ─── */}
      <section className="relative px-6 py-28 text-center sm:py-40">
        <ClassTag level="00" label="Public Release" accent={accent} />
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE }}
          className="mx-auto max-w-3xl"
        >
          <motion.div
            aria-hidden
            animate={reduce ? undefined : { opacity: [0.15, 0.4, 0.15] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="mx-auto mb-8 h-24 w-24 rounded-full"
            style={{ background: `radial-gradient(circle, ${accent}, transparent 70%)`, filter: "blur(24px)" }}
          />
          <h2 className="font-display text-[clamp(2rem,6vw,4.5rem)] font-black uppercase leading-[0.9] tracking-tight">
            {event.eventTitle}
          </h2>
          {event.person1Name && (
            <p className="mt-4 font-mono text-xs uppercase tracking-[0.4em] opacity-60">Lead: {event.person1Name}</p>
          )}
          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <motion.div whileHover={reduce ? undefined : { scale: 1.03 }} className="mt-10 inline-block">
              <a
                href={event.rsvpLinkOrContact}
                target="_blank"
                rel="noreferrer"
                className="inline-block rounded-sm px-10 py-4 font-mono text-xs uppercase tracking-[0.4em] transition-all"
                style={{ background: accent, color: VOID, boxShadow: `0 0 0 1px ${accent}` }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 0 32px ${accent}`; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = `0 0 0 1px ${accent}`; }}
              >
                Request Clearance
              </a>
            </motion.div>
          )}
        </motion.div>
      </section>

      <footer className="border-t border-white/[0.06] py-8 text-center font-mono text-[10px] uppercase tracking-[0.3em] opacity-50">
        <p>&gt; {event.eventTitle}{event.person1Name ? ` &middot; ${event.person1Name}` : ""} &middot; EOF</p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default SecretlabTemplate;
