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
import { Reveal, WordReveal, EASE, Grain } from "@/components/templates/_fx";
import { useEditMode } from "@/components/edit/EditContext";
import type { TemplateComponent, SubEvent } from "@/lib/types";

const STARS = Array.from({ length: 60 }, (_, i) => ({
  x: `${(i * 23 + 17) % 100}%`,
  y: `${(i * 19 + 11) % 100}%`,
  size: 0.5 + (i % 3) * 0.5,
  delay: (i % 15) * 0.3,
  twinkle: 1.5 + (i % 4) * 0.8,
}));

const CONSTELLATIONS = [
  { cx: "30%", cy: "25%", points: 3 },
  { cx: "70%", cy: "40%", points: 4 },
  { cx: "50%", cy: "70%", points: 5 },
];

function StarField({ reduce }: { reduce: boolean }) {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden bg-[#0c0a1a]">
      <div className="absolute inset-0 bg-gradient-radial from-[#1a1535] via-[#0c0a1a] to-[#060510]" />
      {!reduce && STARS.map((s, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-white"
          style={{ left: s.x, top: s.y, width: s.size, height: s.size }}
          animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: s.twinkle, delay: s.delay, repeat: Infinity }}
        />
      ))}
      {CONSTELLATIONS.map((c, i) => (
        <svg key={i} className="absolute h-full w-full opacity-[0.08]" style={{ pointerEvents: "none" }}>
          {Array.from({ length: c.points }).map((_, j) => (
            <motion.circle
              key={j}
              cx={`calc(${c.cx} + ${Math.sin(j * (Math.PI * 2 / c.points)) * 8}%)`}
              cy={`calc(${c.cy} + ${Math.cos(j * (Math.PI * 2 / c.points)) * 8}%)`}
              r="1.5"
              fill="var(--accent)"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 3, delay: j * 0.5 + i * 2, repeat: Infinity }}
            />
          ))}
        </svg>
      ))}
      <Grain opacity={0.04} />
    </div>
  );
}

function Spotlight({ children, className }: { children: React.ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, clipPath: "inset(0 50% 0 50%)" }}
      whileInView={{ opacity: 1, clipPath: "inset(0 0% 0 0%)" }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1.2, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function GlassCardLuminary({
  children,
  className,
  delay = 0,
  accent,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  accent: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 30, filter: "blur(2px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.8, delay, ease: EASE }}
      whileHover={reduce ? undefined : { y: -4, boxShadow: `0 20px 60px -15px ${accent}40` }}
      className={`relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] p-6 backdrop-blur-xl transition-all ${className ?? ""}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.06] to-transparent" />
      <div className="relative">{children}</div>
    </motion.div>
  );
}

function AwardsTimeline({ items, accent }: { items: SubEvent[]; accent: string }) {
  const reduce = useReducedMotion();
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <div className="mx-auto max-w-4xl px-6">
      <div className="space-y-16">
        {sorted.map((s, i) => (
          <motion.article
            key={s.order}
            initial={reduce ? false : { opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-12% 0px" }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: EASE }}
            className="relative pl-12 sm:pl-16"
          >
            <motion.div
              className="absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold sm:h-10 sm:w-10"
              style={{ borderColor: accent, color: accent }}
              whileHover={reduce ? undefined : { scale: 1.15, boxShadow: `0 0 30px ${accent}` }}
            >
              {s.order}
            </motion.div>
            <GlassCardLuminary delay={i * 0.05} accent={accent}>
              <h3 className="font-display text-2xl sm:text-3xl">{s.name}</h3>
              <p className="mt-1 text-xs uppercase tracking-[0.3em] opacity-50">
                {[s.date, s.startTime && `${s.startTime}${s.endTime ? `\u2013${s.endTime}` : ""}`].filter(Boolean).join("  \u00B7  ")}
              </p>
              {s.venueName && <p className="mt-2 text-sm opacity-70">{s.venueName}</p>}
              {s.description && <p className="mt-3 leading-relaxed opacity-65">{s.description}</p>}
              {s.dressCode && (
                <p className="mt-3 inline-block rounded-full border border-white/[0.08] px-3 py-1 text-[10px] uppercase tracking-[0.25em] opacity-60">
                  {s.dressCode}
                </p>
              )}
            </GlassCardLuminary>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

export const LuminaryTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;
  const [time, setTime] = useState("");

  const accent = event.themeAccentColor || "#f0cf7a";
  const tagline = event.tagline?.trim() || "A night among the stars.";
  const invitationMessage = event.invitationMessage?.trim() || "Join us for an unforgettable evening celebrating the brightest.";
  const aboutStory = event.aboutStory?.trim() || "";
  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const hero = event.heroImageUrl || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1600&q=80";

  useEffect(() => {
    setTime(new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }));
  }, []);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroGlow = useTransform(heroP, [0, 0.8], [1, 0.3]);
  const heroTextOpacity = useTransform(heroP, [0, 0.5], [1, 0]);

  const showStory = !event.hideStory;
  const showJourney = !event.hideEvents && subEvents.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  const names = event.person2Name
    ? `${event.person1Name} & ${event.person2Name}`
    : event.person1Name;

  return (
    <div
      className="relative min-h-screen overflow-x-clip bg-[#0c0a1a] font-sans text-[#faf8f4] antialiased"
      style={{ "--accent": accent } as React.CSSProperties}
    >
      <StarField reduce={reduce} />
      <ScrollProgress color={accent} />

      {/* ─── 01. RED CARPET HERO ─── */}
      <section ref={heroRef} className="relative h-[100svh] min-h-[620px] flex items-center justify-center overflow-hidden">
        <motion.div style={reduce ? undefined : { opacity: heroGlow }} className="absolute inset-0">
          <HeroMedia imageSrc={hero} videoSrc={event.heroVideoUrl || undefined} alt={event.eventTitle} className="opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a1a] via-[#0c0a1a]/50 to-[#0c0a1a]/20" />
        </motion.div>
        <motion.div style={reduce ? undefined : { opacity: heroTextOpacity }} className="relative z-10 text-center px-5">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-4 text-[10px] uppercase tracking-[0.6em] opacity-60"
            style={{ color: accent }}
          >
            {tagline}
          </motion.p>
          <h1 className="font-display text-[clamp(2.5rem,8vw,7rem)] font-bold leading-[0.92] tracking-tight">
            {event.eventTitle.split(" ").map((w, i) => (
              <span key={i} className="inline-block overflow-hidden pb-[0.06em]">
                <motion.span
                  className="inline-block"
                  initial={reduce ? false : { y: "120%", opacity: 0, rotateX: -30 }}
                  animate={{ y: "0%", opacity: 1, rotateX: 0 }}
                  transition={{ duration: 0.9, delay: 0.4 + i * 0.07, ease: EASE }}
                >
                  {w}&nbsp;
                </motion.span>
              </span>
            ))}
          </h1>
          {event.mainDate && (
            <motion.p
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="mt-6 text-sm uppercase tracking-[0.5em] opacity-60"
            >
              {new Date(event.mainDate).toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              {event.city && ` \u00B7 ${event.city}`}
            </motion.p>
          )}
          {event.mainDate && (
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="mt-10"
            >
              <div className="flex justify-center gap-6 text-center">
                {[
                  { label: "DATE", value: new Date(event.mainDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) },
                  { label: "TIME", value: event.mainStartTime || "7:00 PM" },
                  { label: "VENUE", value: event.venueName || "TBA" },
                ].map((d) => (
                  <div key={d.label}>
                    <p className="text-[10px] uppercase tracking-[0.3em] opacity-40">{d.label}</p>
                    <p className="mt-1 text-sm font-medium">{d.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
        {!reduce && (
          <motion.div
            animate={{ y: [0, 10, 0], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.4em] opacity-50"
          >
            Enter the night
          </motion.div>
        )}
      </section>

      {/* ─── 02. INVOCATION ─── */}
      {showStory && (
        <Spotlight className="relative mx-auto max-w-5xl px-6 py-28 sm:py-44">
          <p className="mb-4 text-[10px] uppercase tracking-[0.6em] opacity-50" style={{ color: accent }}>
            Tonight
          </p>
          <h2 className="font-display text-2xl leading-[1.15] sm:text-4xl sm:leading-[1.1] lg:text-5xl">
            <WordReveal text={invitationMessage} className="" />
          </h2>
          {aboutStory && (
            <p className="mt-8 max-w-2xl text-base leading-relaxed opacity-60 sm:text-lg">
              {aboutStory}
            </p>
          )}
        </Spotlight>
      )}

      {/* ─── 03. CATEGORIES / STATS ─── */}
      <section className="relative mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <Reveal>
          <p className="mb-8 text-center text-[10px] uppercase tracking-[0.5em] opacity-50" style={{ color: accent }}>
            Categories
          </p>
        </Reveal>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Innovation", sub: "Pushing boundaries" },
            { title: "Excellence", sub: "Mastery in craft" },
            { title: "Impact", sub: "Change that matters" },
            { title: "Vision", sub: "Seeing beyond" },
          ].map((c, i) => (
            <GlassCardLuminary key={c.title} delay={i * 0.1} accent={accent}>
              <span className="font-display text-3xl sm:text-4xl" style={{ color: accent }}>{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-2 font-display text-xl">{c.title}</h3>
              <p className="mt-1 text-sm opacity-50">{c.sub}</p>
            </GlassCardLuminary>
          ))}
        </div>
      </section>

      {/* ─── 04. PROGRAM ─── */}
      {showJourney && (
        <section className="relative py-24 sm:py-36">
          <Reveal>
            <p className="mb-2 text-center text-[10px] uppercase tracking-[0.5em] opacity-50" style={{ color: accent }}>
              The Program
            </p>
          </Reveal>
          <AwardsTimeline items={subEvents} accent={accent} />
        </section>
      )}

      {/* ─── 05. GALLERY ─── */}
      {showGallery && (
        <section className="relative mx-auto max-w-7xl px-6 py-20 sm:py-32">
          <Reveal>
            <p className="mb-12 text-center text-[10px] uppercase tracking-[0.5em] opacity-50" style={{ color: accent }}>
              Portraits of the night
            </p>
          </Reveal>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {galleryItems.map((m, i) => (
              <motion.div
                key={`${m.fileName}-${i}`}
                initial={reduce ? false : { opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="group relative overflow-hidden rounded-xl"
              >
                <img
                  src={m.publicUrl}
                  alt={m.caption ?? ""}
                  className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                {m.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0c0a1a]/80 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                    <p className="text-sm text-white/90">{m.caption}</p>
                  </div>
                )}
              </motion.div>
            ))}
            {editing && galleryItems.length === 0 && (
              <div className="col-span-full flex h-48 items-center justify-center rounded-2xl border border-dashed border-white/20 text-sm opacity-50">
                + Add photos
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── 06. VENUE ─── */}
      {showVenue && (
        <section className="relative mx-auto max-w-5xl px-6 py-20 sm:py-32">
          <Reveal>
            <p className="mb-4 text-center text-[10px] uppercase tracking-[0.5em] opacity-50" style={{ color: accent }}>
              The Venue
            </p>
          </Reveal>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: EASE }}
            className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] p-2 backdrop-blur-xl"
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

      {/* ─── 07. FINALE ─── */}
      <section className="relative px-6 py-28 text-center sm:py-44">
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: EASE }}
          className="mx-auto max-w-3xl"
        >
          <div
            aria-hidden
            className="mx-auto mb-12 h-28 w-28 rounded-full opacity-40 sm:h-36 sm:w-36"
            style={{
              background: `radial-gradient(circle, ${accent}, transparent 70%)`,
              filter: "blur(12px)",
            }}
          />
          <h2 className="font-display text-[clamp(2rem,7vw,5rem)] leading-[1.05]">
            {event.eventTitle}
          </h2>
          <p className="mt-4 font-script text-2xl opacity-70 sm:text-3xl" style={{ color: accent }}>
            {names}
          </p>
          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <motion.div
              whileHover={reduce ? undefined : { scale: 1.02 }}
              className="mt-10 inline-block"
            >
              <a
                href={event.rsvpLinkOrContact}
                target="_blank"
                rel="noreferrer"
                className="inline-block rounded-full border px-10 py-4 text-sm uppercase tracking-[0.35em] transition-all hover:bg-[var(--accent)] hover:text-[#0c0a1a]"
                style={{ borderColor: accent, color: accent }}
              >
                Reserve your seat
              </a>
            </motion.div>
          )}
        </motion.div>
      </section>

      <footer className="border-t border-white/[0.04] py-8 text-center text-xs opacity-40">
        <p>{event.eventTitle}</p>
        {event.person1Name && <p className="mt-0.5 opacity-60">{event.person1Name}</p>}
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default LuminaryTemplate;
