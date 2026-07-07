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
const IRIDESCENT = "linear-gradient(90deg, #ff6b8b, #ffd166, #7ff9c9, #7ea8ff, #b28eff)";

const SHARDS = Array.from({ length: 18 }, (_, i) => ({
  left: `${(i * 47 + 11) % 100}%`,
  top: `${(i * 29 + 7) % 100}%`,
  size: 40 + (i % 5) * 30,
  delay: (i % 6) * 0.8,
  rot: (i * 37) % 360,
}));

function PrismField({ reduce }: { reduce: boolean }) {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #0a1638 0%, #101c44 45%, #1a2340 100%)" }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 20% 10%, rgba(126,168,255,0.18), transparent 50%), radial-gradient(ellipse at 85% 80%, rgba(178,142,255,0.14), transparent 55%)" }} />
      {!reduce && (
        <>
          {SHARDS.map((s, i) => (
            <motion.div
              key={i}
              className="absolute opacity-[0.08]"
              style={{
                left: s.left,
                top: s.top,
                width: s.size,
                height: s.size,
                background: IRIDESCENT,
                clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                transform: `rotate(${s.rot}deg)`,
                filter: "blur(1px)",
              }}
              animate={{ rotate: [s.rot, s.rot + 360], opacity: [0.04, 0.12, 0.04] }}
              transition={{ duration: 24 + (i % 5) * 4, delay: s.delay, repeat: Infinity, ease: "linear" }}
            />
          ))}
          <svg className="absolute inset-0 h-full w-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
            <filter id="prism-noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" />
            </filter>
            <rect width="100%" height="100%" filter="url(#prism-noise)" />
          </svg>
        </>
      )}
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,22,56,0.3) 0%, transparent 30%, rgba(10,22,56,0.6) 100%)" }} />
    </div>
  );
}

function PrismBeam({ reduce }: { reduce: boolean }) {
  if (reduce) return null;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute top-[-20%] h-[140%] w-[35vw] opacity-[0.28] mix-blend-screen"
        style={{
          background: IRIDESCENT,
          filter: "blur(28px)",
          transform: "rotate(18deg)",
        }}
        initial={{ x: "-60vw" }}
        animate={{ x: ["-60vw", "120vw"] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.5 }}
      />
      <motion.div
        className="absolute top-[-10%] h-[120%] w-[10vw] opacity-[0.5] mix-blend-screen"
        style={{
          background: "linear-gradient(90deg, transparent, #ffffff, transparent)",
          filter: "blur(6px)",
          transform: "rotate(18deg)",
        }}
        initial={{ x: "-30vw" }}
        animate={{ x: ["-30vw", "120vw"] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.5 }}
      />
    </div>
  );
}

function GlassCard({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.8, delay, ease: EASE }}
      whileHover={reduce ? undefined : { y: -4 }}
      className={`group relative overflow-hidden rounded-2xl p-[1px] ${className ?? ""}`}
      style={{ background: "linear-gradient(160deg, rgba(255,255,255,0.14), rgba(255,255,255,0.02) 40%, rgba(255,255,255,0.08))" }}
    >
      <div
        aria-hidden
        className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: IRIDESCENT, filter: "blur(14px)", zIndex: 0 }}
      />
      <div className="relative rounded-2xl p-6 backdrop-blur-xl" style={{ background: "linear-gradient(160deg, rgba(20,32,72,0.72), rgba(15,24,58,0.58))" }}>
        {children}
      </div>
    </motion.div>
  );
}

function Diamond({ n, spinning }: { n: number; spinning: boolean }) {
  return (
    <div className="relative h-11 w-11 shrink-0">
      <motion.div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, rgba(126,168,255,0.35), rgba(178,142,255,0.2))",
          clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
          border: "1px solid rgba(232,236,247,0.25)",
        }}
        animate={spinning ? { rotate: [0, 360] } : undefined}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      />
      <div className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold tracking-widest" style={{ color: "#e8ecf7" }}>
        {String(n).padStart(2, "0")}
      </div>
    </div>
  );
}

function PrismTimeline({ items }: { items: SubEvent[] }) {
  const reduce = !!useReducedMotion();
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <div className="mx-auto max-w-4xl px-6">
      <div className="grid gap-5 sm:grid-cols-2">
        {sorted.map((s, i) => (
          <GlassCard key={s.order} delay={i * 0.08}>
            <div className="flex items-start gap-4">
              <Diamond n={s.order} spinning={!reduce} />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] uppercase tracking-[0.3em]" style={{ color: "#7ea8ff" }}>
                  {[s.date, s.startTime].filter(Boolean).join(" · ")}
                </p>
                <h3 className="mt-1 font-display text-xl tracking-tight" style={{ color: "#e8ecf7" }}>{s.name}</h3>
                {s.venueName && <p className="mt-1 text-sm" style={{ color: "rgba(232,236,247,0.65)" }}>{s.venueName}</p>}
                {s.description && <p className="mt-2 text-sm leading-relaxed" style={{ color: "rgba(232,236,247,0.55)" }}>{s.description}</p>}
                {s.dressCode && (
                  <p className="mt-3 inline-block rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.2em]" style={{ borderColor: "rgba(232,236,247,0.2)", color: "rgba(232,236,247,0.7)" }}>
                    {s.dressCode}
                  </p>
                )}
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

export const PrismTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || "#7ea8ff";
  const tagline = event.tagline?.trim() || "Light. Refracted through love.";
  const invitationMessage = event.invitationMessage?.trim() || "Two lives meet, and the world catches every color at once.";
  const aboutStory = event.aboutStory?.trim() || "";
  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const hero = event.heroImageUrl || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800&q=80";

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(heroP, [0, 1], [1, 1.08]);
  const heroTextY = useTransform(heroP, [0, 0.6], [0, -60]);
  const heroOpacity = useTransform(heroP, [0, 0.6], [1, 0]);

  const showStory = !event.hideStory;
  const showJourney = !event.hideEvents && subEvents.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-sans antialiased"
      style={{ "--accent": accent, color: "#e8ecf7", background: "#0a1638" } as React.CSSProperties}
    >
      <PrismField reduce={reduce} />
      <ScrollProgress color={accent} />

      <section ref={heroRef} className="relative flex h-[100svh] min-h-[640px] items-center justify-center overflow-hidden">
        <motion.div style={reduce ? undefined : { scale: heroScale }} className="absolute inset-0">
          <HeroMedia imageSrc={hero} videoSrc={event.heroVideoUrl || undefined} alt={event.eventTitle} className="opacity-45" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,22,56,0.5) 0%, rgba(10,22,56,0.3) 40%, rgba(10,22,56,0.9) 100%)" }} />
        </motion.div>

        <PrismBeam reduce={reduce} />

        <motion.div style={reduce ? undefined : { y: heroTextY, opacity: heroOpacity }} className="relative z-10 px-6 text-center">
          <motion.p
            initial={reduce ? false : { opacity: 0, letterSpacing: "0.2em" }}
            animate={{ opacity: 1, letterSpacing: "0.6em" }}
            transition={{ duration: 1.4, ease: EASE }}
            className="mb-8 text-[11px] uppercase"
            style={{ color: "#b28eff" }}
          >
            {tagline}
          </motion.p>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.2, ease: EASE }}
            className="font-display text-[clamp(3rem,12vw,9rem)] font-light leading-[0.92] tracking-tight"
            style={{
              background: IRIDESCENT,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              backgroundSize: "200% 100%",
            }}
          >
            {event.eventTitle}
          </motion.h1>
          {(event.person1Name || event.person2Name) && (
            <motion.p
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="mt-4 font-display text-lg tracking-[0.3em]"
              style={{ color: "rgba(232,236,247,0.85)" }}
            >
              {[event.person1Name, event.person2Name].filter(Boolean).join("  ✦  ")}
            </motion.p>
          )}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-10 flex flex-wrap justify-center gap-4 text-xs uppercase tracking-[0.4em]"
            style={{ color: "rgba(232,236,247,0.7)" }}
          >
            {event.mainDate && (
              <span>
                {new Date(event.mainDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              </span>
            )}
            {event.city && <><span style={{ color: "#7ea8ff" }}>◇</span><span>{event.city}</span></>}
          </motion.div>
        </motion.div>

        <div aria-hidden className="absolute bottom-0 left-0 right-0 h-px" style={{ background: IRIDESCENT, opacity: 0.5 }} />
      </section>

      {showStory && (
        <section className="relative mx-auto max-w-5xl px-6 py-28 sm:py-36">
          <div className="grid items-start gap-14 sm:grid-cols-5">
            <motion.div
              initial={reduce ? false : { opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: EASE }}
              className="sm:col-span-2"
            >
              <p className="mb-4 text-[10px] uppercase tracking-[0.5em]" style={{ color: "#b28eff" }}>Refraction I</p>
              <div aria-hidden className="mb-6 h-px w-16" style={{ background: IRIDESCENT }} />
              <h2 className="font-display text-3xl leading-[1.1] tracking-tight sm:text-4xl" style={{ color: "#e8ecf7" }}>
                {invitationMessage}
              </h2>
            </motion.div>
            <motion.div
              initial={reduce ? false : { opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.15, ease: EASE }}
              className="sm:col-span-3"
            >
              <p className="text-base leading-[1.85] sm:text-lg" style={{ color: "rgba(232,236,247,0.72)" }}>
                {aboutStory || "A single beam of white light, when it meets a crystal, becomes every color at once. That is what love does. It takes the ordinary and refracts it — the way we wake up, the way we speak, the way we count the days — into something luminous."}
              </p>
            </motion.div>
          </div>
        </section>
      )}

      {showJourney && (
        <section className="relative py-24 sm:py-32">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-4 text-center text-[10px] uppercase tracking-[0.5em]"
            style={{ color: "#b28eff" }}
          >
            Refraction II
          </motion.p>
          <h2 className="mb-14 text-center font-display text-3xl tracking-tight sm:text-4xl" style={{
            background: IRIDESCENT,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}>
            The Celebration
          </h2>
          <PrismTimeline items={subEvents} />
        </section>
      )}

      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-4 text-center text-[10px] uppercase tracking-[0.5em]"
            style={{ color: "#b28eff" }}
          >
            Refraction III
          </motion.p>
          <h2 className="mb-12 text-center font-display text-3xl tracking-tight sm:text-4xl" style={{ color: "#e8ecf7" }}>
            Fragments of Light
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((m, i) => (
              <motion.div
                key={`${m.fileName}-${i}`}
                initial={reduce ? false : { opacity: 0, y: 20, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.05, ease: EASE }}
                className="group relative overflow-hidden rounded-2xl p-[1px]"
                style={{ background: "linear-gradient(160deg, rgba(255,255,255,0.14), rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.1))" }}
              >
                <div className="relative overflow-hidden rounded-2xl">
                  <img
                    src={m.publicUrl}
                    alt={m.caption ?? ""}
                    loading="lazy"
                    className="aspect-[4/5] w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                  />
                  <div aria-hidden className="absolute inset-0 opacity-0 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-40" style={{ background: IRIDESCENT }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a1638] via-transparent to-transparent" />
                </div>
              </motion.div>
            ))}
            {editing && galleryItems.length === 0 && (
              <div className="col-span-full flex h-48 items-center justify-center rounded-2xl border border-dashed text-sm" style={{ borderColor: "rgba(232,236,247,0.25)", color: "rgba(232,236,247,0.6)" }}>
                + Add photos
              </div>
            )}
          </div>
        </section>
      )}

      {showVenue && (
        <section className="relative mx-auto max-w-5xl px-6 py-20 sm:py-28">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-4 text-center text-[10px] uppercase tracking-[0.5em]"
            style={{ color: "#b28eff" }}
          >
            Refraction IV
          </motion.p>
          <h2 className="mb-10 text-center font-display text-3xl tracking-tight sm:text-4xl" style={{ color: "#e8ecf7" }}>
            {event.venueName || "The Place"}
          </h2>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE }}
            className="overflow-hidden rounded-2xl p-[1px]"
            style={{ background: "linear-gradient(160deg, rgba(255,255,255,0.18), rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.12))" }}
          >
            <div className="overflow-hidden rounded-2xl backdrop-blur-xl" style={{ background: "linear-gradient(160deg, rgba(20,32,72,0.72), rgba(15,24,58,0.58))" }}>
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

      <section className="relative px-6 py-28 text-center sm:py-40">
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: EASE }}
          className="mx-auto max-w-3xl"
        >
          <motion.div
            aria-hidden
            className="mx-auto mb-10 h-24 w-24"
            style={{
              background: IRIDESCENT,
              clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
              filter: "blur(2px)",
            }}
            animate={reduce ? undefined : { rotate: [0, 360] }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          />
          <h2 className="font-display text-[clamp(2rem,7vw,5rem)] font-light leading-[0.95] tracking-tight" style={{
            background: IRIDESCENT,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}>
            Be part of the light
          </h2>
          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <motion.div whileHover={reduce ? undefined : { scale: 1.03 }} className="mt-12 inline-block p-[1px] rounded-full" style={{ background: IRIDESCENT }}>
              <a
                href={event.rsvpLinkOrContact}
                target="_blank"
                rel="noreferrer"
                className="inline-block rounded-full px-12 py-4 text-sm uppercase tracking-[0.4em] backdrop-blur-xl"
                style={{ background: "rgba(10,22,56,0.85)", color: "#e8ecf7" }}
              >
                RSVP
              </a>
            </motion.div>
          )}
        </motion.div>
      </section>

      <footer className="relative border-t py-10 text-center text-xs" style={{ borderColor: "rgba(232,236,247,0.08)", color: "rgba(232,236,247,0.45)" }}>
        <div aria-hidden className="mx-auto mb-4 h-px w-24" style={{ background: IRIDESCENT }} />
        <p>{event.eventTitle}{event.person1Name ? ` · ${event.person1Name}` : ""}{event.person2Name ? ` & ${event.person2Name}` : ""}</p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default PrismTemplate;
