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

const TENDRILS = [
  { d: "M-100,120 C200,60 400,240 900,140 C1200,80 1500,220 1700,160", dur: 14, delay: 0 },
  { d: "M-80,300 C240,220 520,420 880,320 C1180,240 1460,400 1720,340", dur: 18, delay: 1.5 },
  { d: "M-60,500 C260,420 540,620 940,520 C1220,460 1520,600 1740,540", dur: 16, delay: 0.8 },
  { d: "M-120,700 C220,640 460,820 860,720 C1180,660 1500,800 1720,760", dur: 20, delay: 2.2 },
  { d: "M-80,900 C260,820 520,1020 900,920 C1200,860 1500,1000 1740,940", dur: 15, delay: 1.1 },
  { d: "M-100,1100 C240,1040 480,1220 880,1120 C1180,1060 1500,1200 1720,1160", dur: 22, delay: 0.4 },
  { d: "M-90,1300 C260,1240 540,1420 900,1320 C1200,1260 1500,1400 1740,1360", dur: 17, delay: 2.8 },
  { d: "M-60,1500 C240,1420 520,1620 900,1520 C1200,1460 1520,1600 1720,1560", dur: 19, delay: 1.9 },
];

function EnergyField({ reduce, cyan, magenta }: { reduce: boolean; cyan: string; magenta: string }) {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden bg-[#000005]">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 20% 30%, rgba(0,229,255,0.08), transparent 55%), radial-gradient(ellipse at 80% 70%, rgba(255,0,255,0.06), transparent 55%), linear-gradient(180deg, #000005 0%, #0a1836 60%, #000005 100%)",
        }}
      />
      {!reduce && (
        <svg
          className="absolute inset-0 h-full w-full opacity-40"
          viewBox="0 0 1600 1600"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="portal-tendril" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={cyan} stopOpacity="0" />
              <stop offset="50%" stopColor={cyan} stopOpacity="0.7" />
              <stop offset="100%" stopColor={magenta} stopOpacity="0" />
            </linearGradient>
          </defs>
          {TENDRILS.map((t, i) => (
            <motion.path
              key={i}
              d={t.d}
              fill="none"
              stroke="url(#portal-tendril)"
              strokeWidth="0.8"
              strokeDasharray="8 14"
              initial={{ strokeDashoffset: 0 }}
              animate={{ strokeDashoffset: [0, -220] }}
              transition={{ duration: t.dur, delay: t.delay, repeat: Infinity, ease: "linear" }}
            />
          ))}
        </svg>
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-[#000005]/40 via-transparent to-[#000005]/85" />
    </div>
  );
}

function ChromaticTitle({ text, cyan, magenta }: { text: string; cyan: string; magenta: string }) {
  return (
    <span className="relative inline-block">
      <span aria-hidden className="absolute inset-0 select-none" style={{ color: cyan, transform: "translate(-2px, 0)", mixBlendMode: "screen" }}>
        {text}
      </span>
      <span aria-hidden className="absolute inset-0 select-none" style={{ color: magenta, transform: "translate(2px, 0)", mixBlendMode: "screen" }}>
        {text}
      </span>
      <span className="relative" style={{ color: "#f0f0ff" }}>
        {text}
      </span>
    </span>
  );
}

function PortalRing({ reduce, cyan, magenta, scale }: { reduce: boolean; cyan: string; magenta: string; scale: import("framer-motion").MotionValue<number> }) {
  return (
    <motion.svg
      style={reduce ? undefined : { scale }}
      viewBox="0 0 400 400"
      className="absolute inset-0 mx-auto my-auto h-[85vmin] w-[85vmin] max-h-[720px] max-w-[720px]"
      aria-hidden
    >
      <defs>
        <radialGradient id="portal-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={cyan} stopOpacity="0.9" />
          <stop offset="40%" stopColor={magenta} stopOpacity="0.35" />
          <stop offset="70%" stopColor="#0a1836" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#000005" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="portal-swirl" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#f0f0ff" stopOpacity="0.3" />
          <stop offset="45%" stopColor={cyan} stopOpacity="0.15" />
          <stop offset="100%" stopColor={magenta} stopOpacity="0" />
        </radialGradient>
      </defs>

      <motion.g
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "200px 200px" }}
      >
        <circle cx="200" cy="200" r="190" fill="none" stroke={cyan} strokeWidth="0.6" strokeOpacity="0.5" strokeDasharray="2 6" />
        <circle cx="200" cy="200" r="178" fill="none" stroke={magenta} strokeWidth="0.4" strokeOpacity="0.35" strokeDasharray="1 10" />
      </motion.g>

      <motion.g
        animate={reduce ? undefined : { rotate: -360 }}
        transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "200px 200px" }}
      >
        <circle cx="200" cy="200" r="160" fill="none" stroke={cyan} strokeWidth="1.2" strokeOpacity="0.7" />
        <circle cx="200" cy="200" r="152" fill="none" stroke={magenta} strokeWidth="0.5" strokeOpacity="0.4" strokeDasharray="4 4" />
      </motion.g>

      <motion.g
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "200px 200px" }}
      >
        <circle cx="200" cy="200" r="128" fill="url(#portal-swirl)" />
        <circle cx="200" cy="200" r="128" fill="none" stroke={cyan} strokeWidth="0.4" strokeOpacity="0.5" strokeDasharray="1 3" />
      </motion.g>

      <circle cx="200" cy="200" r="118" fill="url(#portal-core)" />

      <motion.circle
        cx="200"
        cy="200"
        r="120"
        fill="none"
        stroke={cyan}
        strokeWidth="1.5"
        animate={reduce ? undefined : { opacity: [0.4, 0.9, 0.4], r: [118, 124, 118] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        style={{ filter: `drop-shadow(0 0 16px ${cyan})` }}
      />
    </motion.svg>
  );
}

function PortalCard({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.8, delay, ease: EASE }}
      whileHover={reduce ? undefined : { y: -3, boxShadow: "0 0 40px color-mix(in srgb, var(--accent) 25%, transparent)" }}
      className={`group relative overflow-hidden rounded-lg border p-6 backdrop-blur-md ${className ?? ""}`}
      style={{ borderColor: "rgba(0,229,255,0.22)", background: "linear-gradient(180deg, rgba(10,24,54,0.55), rgba(0,0,5,0.6))" }}
    >
      <div className="pointer-events-none absolute inset-[1px] rounded-lg" style={{ boxShadow: "inset 0 0 20px rgba(0,229,255,0.12)" }} />
      <div className="pointer-events-none absolute right-3 top-3 h-6 w-6 rounded-full opacity-70" style={{ background: "radial-gradient(circle at 40% 40%, #00e5ff, #ff00ff 55%, transparent 75%)", filter: "blur(0.5px)" }} />
      <div className="relative">{children}</div>
    </motion.div>
  );
}

function PortalTimeline({ items, cyan }: { items: SubEvent[]; cyan: string }) {
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <div className="mx-auto max-w-5xl px-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {sorted.map((s, i) => (
          <PortalCard key={s.order} delay={i * 0.08}>
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded text-[10px] font-bold" style={{ background: cyan, color: "#000005" }}>
                {String(s.order).padStart(2, "0")}
              </span>
              <span className="text-[10px] uppercase tracking-[0.3em] opacity-60">
                {[s.date, s.startTime].filter(Boolean).join(" · ")}
              </span>
            </div>
            <h3 className="font-display text-xl font-black uppercase tracking-[0.08em]">{s.name}</h3>
            {s.venueName && <p className="mt-1 text-sm uppercase tracking-[0.2em] opacity-60">@ {s.venueName}</p>}
            {s.description && <p className="mt-3 text-sm leading-relaxed opacity-70">{s.description}</p>}
            {s.dressCode && (
              <p className="mt-4 inline-block rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.28em] opacity-70" style={{ borderColor: "rgba(0,229,255,0.4)" }}>
                {s.dressCode}
              </p>
            )}
          </PortalCard>
        ))}
      </div>
    </div>
  );
}

export const PortalTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || "#00e5ff";
  const cyan = "#00e5ff";
  const magenta = "#ff00ff";
  const tagline = event.tagline?.trim() || "The threshold opens.";
  const invitationMessage = event.invitationMessage?.trim() || "A signal from beyond. A shape you cannot yet name. Step through — the future is already waiting.";
  const aboutStory = event.aboutStory?.trim() || "";
  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const hero = event.heroImageUrl || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80";

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const ringScale = useTransform(heroP, [0, 1], [1, 1.35]);
  const heroTextY = useTransform(heroP, [0, 0.6], [0, -60]);
  const heroOpacity = useTransform(heroP, [0, 0.6], [1, 0]);

  const showStory = !event.hideStory;
  const showJourney = !event.hideEvents && subEvents.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  return (
    <div
      className="relative min-h-screen overflow-x-clip bg-[#000005] font-sans text-[#f0f0ff] antialiased"
      style={{ "--accent": accent } as React.CSSProperties}
    >
      <EnergyField reduce={reduce} cyan={cyan} magenta={magenta} />
      <ScrollProgress color={accent} />

      {/* HERO — THE THRESHOLD */}
      <section ref={heroRef} className="relative flex h-[100svh] min-h-[640px] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <HeroMedia imageSrc={hero} videoSrc={event.heroVideoUrl || undefined} alt={event.eventTitle} className="opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#000005]/70 via-[#000005]/40 to-[#000005]" />
        </div>

        <PortalRing reduce={reduce} cyan={cyan} magenta={magenta} scale={ringScale} />

        <motion.div style={reduce ? undefined : { y: heroTextY, opacity: heroOpacity }} className="relative z-10 px-5 text-center">
          <motion.p
            initial={reduce ? false : { opacity: 0, letterSpacing: "1em" }}
            animate={{ opacity: 1, letterSpacing: "0.8em" }}
            transition={{ duration: 1.6, ease: EASE }}
            className="mb-8 text-[10px] uppercase"
            style={{ color: cyan, textShadow: `0 0 24px ${cyan}` }}
          >
            {tagline}
          </motion.p>
          <h1 className="font-display text-[clamp(2.6rem,11vw,8.5rem)] font-black uppercase leading-[0.86] tracking-[0.02em]">
            {event.eventTitle.split(" ").map((w, i) => (
              <motion.span
                key={i}
                initial={reduce ? false : { opacity: 0, y: 20, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.9, delay: 0.3 + i * 0.12, ease: EASE }}
                className="block"
              >
                <ChromaticTitle text={w} cyan={cyan} magenta={magenta} />
              </motion.span>
            ))}
          </h1>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="mt-10 flex flex-wrap justify-center gap-4 text-xs uppercase tracking-[0.45em]"
          >
            {event.mainDate && (
              <span className="opacity-80">
                {new Date(event.mainDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
              </span>
            )}
            {event.mainStartTime && <span className="opacity-40">|</span>}
            {event.mainStartTime && <span className="opacity-80">{event.mainStartTime}</span>}
            {event.city && (<><span className="opacity-40">|</span><span className="opacity-80">{event.city}</span></>)}
          </motion.div>
        </motion.div>

        {!reduce && (
          <motion.div
            animate={{ y: [0, 10, 0], opacity: [0.3, 0.9, 0.3] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.45em]"
            style={{ color: cyan, textShadow: `0 0 12px ${cyan}` }}
          >
            Cross the threshold
          </motion.div>
        )}
      </section>

      {/* STORY — THE TRANSMISSION */}
      {showStory && (
        <section className="relative mx-auto max-w-5xl px-6 py-28 sm:py-36">
          <div className="grid items-center gap-12 sm:grid-cols-2">
            <motion.div initial={reduce ? false : { opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1, ease: EASE }}>
              <p className="mb-4 text-[10px] uppercase tracking-[0.55em]" style={{ color: cyan }}>Transmission 01</p>
              <h2 className="font-display text-3xl font-black uppercase leading-[1.05] tracking-[0.04em] sm:text-4xl">
                {invitationMessage}
              </h2>
            </motion.div>
            <motion.div initial={reduce ? false : { opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.2, ease: EASE }}>
              <p className="text-base leading-relaxed opacity-75 sm:text-lg">
                {aboutStory || "We built a doorway. Behind it, a product that shouldn't exist yet. Tonight the seal breaks. What arrives is not iteration — it's arrival."}
              </p>
              <motion.div
                className="mt-6 h-px w-full"
                style={{ background: `linear-gradient(90deg, transparent, ${cyan}, ${magenta}, transparent)` }}
                animate={reduce ? undefined : { opacity: [0.3, 0.9, 0.3] }}
                transition={{ duration: 2.4, repeat: Infinity }}
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* SUB-EVENTS — PORTAL WINDOWS */}
      {showJourney && (
        <section className="relative py-24 sm:py-32">
          <motion.p initial={reduce ? false : { opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-14 text-center text-[10px] uppercase tracking-[0.55em]" style={{ color: cyan }}>
            Sequence of Arrival
          </motion.p>
          <PortalTimeline items={subEvents} cyan={cyan} />
        </section>
      )}

      {/* GALLERY — ARTIFACTS */}
      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <motion.p initial={reduce ? false : { opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-10 text-center text-[10px] uppercase tracking-[0.55em]" style={{ color: cyan }}>
            Artifacts from Beyond
          </motion.p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((m, i) => (
              <motion.div
                key={`${m.fileName}-${i}`}
                initial={reduce ? false : { opacity: 0, scale: 0.94, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.05, ease: EASE }}
                className="group relative overflow-hidden rounded-lg border"
                style={{ borderColor: "rgba(0,229,255,0.28)" }}
              >
                <img src={m.publicUrl} alt={m.caption ?? ""} className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                <div className="pointer-events-none absolute inset-0 opacity-40 mix-blend-screen" style={{ background: `linear-gradient(135deg, ${cyan}22, transparent 40%, ${magenta}22)` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#000005]/80 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </motion.div>
            ))}
            {editing && galleryItems.length === 0 && (
              <div className="col-span-full flex h-48 items-center justify-center rounded-lg border border-dashed text-sm opacity-60" style={{ borderColor: "rgba(0,229,255,0.35)" }}>
                + Add photos
              </div>
            )}
          </div>
        </section>
      )}

      {/* VENUE — ANCHOR POINT */}
      {showVenue && (
        <section className="relative mx-auto max-w-5xl px-6 py-20 sm:py-28">
          <motion.p initial={reduce ? false : { opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-4 text-center text-[10px] uppercase tracking-[0.55em]" style={{ color: cyan }}>
            Anchor Point
          </motion.p>
          {event.venueName && (
            <h3 className="mb-6 text-center font-display text-2xl font-black uppercase tracking-[0.12em]">
              <ChromaticTitle text={event.venueName} cyan={cyan} magenta={magenta} />
            </h3>
          )}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="overflow-hidden rounded-lg border p-1 backdrop-blur-md"
            style={{ borderColor: "rgba(0,229,255,0.28)", background: "linear-gradient(180deg, rgba(10,24,54,0.5), rgba(0,0,5,0.6))" }}
          >
            <MapEmbed latitude={event.latitude} longitude={event.longitude} venueName={event.venueName} venueAddress={event.venueAddress} mapLink={event.mapLink} />
          </motion.div>
        </section>
      )}

      {/* CTA — STEP THROUGH */}
      <section className="relative px-6 py-28 text-center sm:py-40">
        <motion.div initial={reduce ? false : { opacity: 0, scale: 0.92 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, ease: EASE }} className="mx-auto max-w-3xl">
          <motion.div
            aria-hidden
            animate={reduce ? undefined : { scale: [1, 1.08, 0.95, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            className="mx-auto mb-10 h-32 w-32 rounded-full sm:h-40 sm:w-40"
            style={{ background: `radial-gradient(circle, ${cyan}, ${magenta} 55%, transparent 75%)`, filter: "blur(24px)" }}
          />
          <h2 className="font-display text-[clamp(2.2rem,7.5vw,5.5rem)] font-black uppercase leading-[0.9] tracking-[0.02em]">
            <ChromaticTitle text={event.eventTitle.split(" ").join(" · ")} cyan={cyan} magenta={magenta} />
          </h2>
          {event.person1Name && (
            <p className="mt-5 text-sm uppercase tracking-[0.45em] opacity-70">{event.person1Name}</p>
          )}
          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <motion.div whileHover={reduce ? undefined : { scale: 1.04 }} className="mt-12 inline-block">
              <a
                href={event.rsvpLinkOrContact}
                target="_blank"
                rel="noreferrer"
                className="inline-block rounded-full px-12 py-4 text-sm uppercase tracking-[0.4em] transition-all"
                style={{ background: cyan, color: "#000005", boxShadow: `0 0 32px ${cyan}66` }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 0 48px ${cyan}, 0 0 12px ${magenta}`; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = `0 0 32px ${cyan}66`; }}
              >
                Step through
              </a>
            </motion.div>
          )}
        </motion.div>
      </section>

      <footer className="border-t py-8 text-center text-xs opacity-50" style={{ borderColor: "rgba(0,229,255,0.15)" }}>
        <p className="uppercase tracking-[0.35em]">{event.eventTitle}{event.person1Name ? ` · ${event.person1Name}` : ""}</p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default PortalTemplate;
