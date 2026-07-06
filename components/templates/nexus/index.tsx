"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { HeroMedia } from "@/components/ui/HeroMedia";
import { MapEmbed } from "@/components/ui/MapEmbed";
import { MusicToggle } from "@/components/ui/MusicToggle";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { useEditMode } from "@/components/edit/EditContext";
import type { TemplateComponent, SubEvent } from "@/lib/types";

const EASE = [0.16, 1, 0.3, 1] as const;

const GRID_PARTICLES = Array.from({ length: 80 }, (_, i) => ({
  x: `${(i * 31 + 7) % 100}%`,
  y: `${(i * 17 + 13) % 100}%`,
  size: 1 + (i % 3),
  delay: (i % 12) * 0.3,
  dur: 6 + (i % 10),
  driftX: (i % 7) - 3,
  driftY: (i % 5) - 2,
}));

const LINE_POINTS = [
  { x1: "0%", y1: "0%", x2: "100%", y2: "30%" },
  { x1: "20%", y1: "100%", x2: "80%", y2: "0%" },
  { x1: "50%", y1: "0%", x2: "70%", y2: "100%" },
];

function BackgroundField({ reduce }: { reduce: boolean }) {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden bg-[#0a0a0f]">
      <svg className="absolute inset-0 h-full w-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="nexus-grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="var(--accent)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#nexus-grid)" />
      </svg>
      {LINE_POINTS.map((l, i) => (
        <svg key={i} className="absolute inset-0 h-full w-full opacity-[0.08]">
          <motion.line
            x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
            stroke="var(--accent)" strokeWidth="1"
            animate={reduce ? undefined : { opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 4 + i * 2, delay: i * 1.5, repeat: Infinity }}
          />
        </svg>
      ))}
      {!reduce && (
        <div className="absolute inset-0">
          {GRID_PARTICLES.map((p, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full"
              style={{ left: p.x, top: p.y, width: p.size, height: p.size, background: "var(--accent)" }}
              animate={{ x: [0, p.driftX * 3, 0], y: [0, p.driftY * 3, 0], opacity: [0, 0.9, 0] }}
              transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/30 via-transparent to-[#0a0a0f]" />
    </div>
  );
}

function ParticleReveal({ text, className }: { text: string; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <span className={`inline-block ${className ?? ""}`}>
      {Array.from(text).map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={reduce ? false : { opacity: 0, scale: 0.3, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: i * 0.03, ease: EASE }}
        >
          {ch === " " ? "\u00A0" : ch}
        </motion.span>
      ))}
    </span>
  );
}

function HolographicCard({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 40, rotateX: 10, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
      whileHover={reduce ? undefined : { y: -6, scale: 1.02 }}
      className={`relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl transition-colors hover:border-[var(--accent)]/40 ${className ?? ""}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 to-transparent" />
      {children}
    </motion.div>
  );
}

function CircuitTimeline({ items }: { items: SubEvent[] }) {
  const reduce = useReducedMotion();
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <div className="relative mx-auto max-w-4xl px-6">
      <svg className="absolute left-[23px] top-0 h-full w-[2px] sm:left-1/2 sm:-translate-x-px" aria-hidden>
        <motion.line
          x1="0" y1="0" x2="0" y2="100%"
          stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="4 6"
          initial={reduce ? false : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: EASE }}
        />
      </svg>
      <div className="space-y-16">
        {sorted.map((s, i) => {
          const left = i % 2 === 0;
          return (
            <motion.article
              key={`${s.eventCode}-${s.order}`}
              initial={reduce ? false : { opacity: 0, x: left ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: EASE }}
              className={`relative flex items-start gap-6 sm:gap-0 ${left ? "sm:flex-row" : "sm:flex-row-reverse"}`}
            >
              <div className="hidden sm:block sm:w-[calc(50%-2rem)]" />
              <motion.div
                className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--accent)] bg-[#0a0a0f] sm:absolute sm:left-1/2 sm:-translate-x-1/2"
                whileHover={reduce ? undefined : { scale: 1.2, boxShadow: "0 0 30px var(--accent)" }}
              >
                <span className="text-xs font-bold" style={{ color: "var(--accent)" }}>{s.order}</span>
              </motion.div>
              <div className={`flex-1 sm:w-[calc(50%-2rem)] ${left ? "sm:text-right" : ""}`}>
                <HolographicCard delay={i * 0.05}>
                  <h3 className="font-display text-xl sm:text-2xl">{s.name}</h3>
                  {s.date && (
                    <p className="mt-1 text-xs uppercase tracking-[0.25em] opacity-60">
                      {s.date}{s.startTime ? ` · ${s.startTime}${s.endTime ? `–${s.endTime}` : ""}` : ""}
                    </p>
                  )}
                  {s.venueName && <p className="mt-2 text-sm opacity-80">{s.venueName}</p>}
                  {s.description && <p className="mt-3 text-sm leading-relaxed opacity-70">{s.description}</p>}
                </HolographicCard>
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}

function GlassCard({
  children,
  className,
  index = 0,
}: {
  children: React.ReactNode;
  className?: string;
  index?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [30 + index * 10, -30 - index * 10]);
  const rot = useTransform(scrollYProgress, [0, 1], [index % 2 === 0 ? 2 : -2, index % 2 === 0 ? -2 : 2]);
  return (
    <motion.div
      ref={ref}
      style={reduce ? undefined : { y, rotate: rot }}
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md ${className ?? ""}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.06] to-transparent" />
      {children}
    </motion.div>
  );
}

export const NexusTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;
  const [countdown, setCountdown] = useState({ d: 0, h: 0, m: 0, s: 0 });

  const accent = event.themeAccentColor || "#00f0ff";
  const tagline = event.tagline?.trim() || "The future is arriving.";
  const invitationMessage = event.invitationMessage?.trim() || "Witness the dawn of a new paradigm.";
  const aboutStory = event.aboutStory?.trim() || "";
  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const hero = event.heroImageUrl || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1600&q=80";

  useEffect(() => {
    if (!event.mainDate) return;
    const target = new Date(`${event.mainDate}T${event.mainStartTime || "09:00"}:00`).getTime();
    const tick = () => {
      const d = target - Date.now();
      if (d <= 0) return setCountdown({ d: 0, h: 0, m: 0, s: 0 });
      setCountdown({
        d: Math.floor(d / 86400000),
        h: Math.floor((d % 86400000) / 3600000),
        m: Math.floor((d % 3600000) / 60000),
        s: Math.floor((d % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [event.mainDate, event.mainStartTime]);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(heroP, [0, 1], [1, 0.92]);
  const heroTextY = useTransform(heroP, [0, 0.5], [0, -60]);
  const heroOpacity = useTransform(heroP, [0, 0.6], [1, 0]);

  const showStory = !event.hideStory;
  const showJourney = !event.hideEvents && subEvents.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  const units = [
    { label: "Days", value: countdown.d },
    { label: "Hours", value: countdown.h },
    { label: "Minutes", value: countdown.m },
    { label: "Seconds", value: countdown.s },
  ];

  return (
    <div
      className="relative min-h-screen overflow-x-clip bg-[#0a0a0f] font-sans text-[#e8e8f0] antialiased"
      style={{ "--accent": accent } as React.CSSProperties}
    >
      <BackgroundField reduce={reduce} />
      <ScrollProgress color={accent} />

      {/* ─── 01. HERO — THE COUNTDOWN ─── */}
      <section ref={heroRef} className="relative h-[100svh] min-h-[620px] flex items-center justify-center overflow-hidden">
        <motion.div style={reduce ? undefined : { scale: heroScale }} className="absolute inset-0">
          <HeroMedia imageSrc={hero} videoSrc={event.heroVideoUrl || undefined} alt={event.eventTitle} className="opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/70 via-[#0a0a0f]/40 to-[#0a0a0f]" />
        </motion.div>
        <motion.div style={reduce ? undefined : { y: heroTextY, opacity: heroOpacity }} className="relative z-10 text-center px-5">
          {event.mainDate && (
            <div className="mb-8 sm:mb-12">
              <div className="flex justify-center gap-3 sm:gap-6">
                {units.map((u) => (
                  <div key={u.label} className="text-center">
                    <motion.span
                      key={u.value}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="block font-display text-4xl sm:text-6xl lg:text-7xl tabular-nums"
                      style={{ color: accent }}
                    >
                      {String(u.value).padStart(2, "0")}
                    </motion.span>
                    <span className="mt-1 block text-[10px] uppercase tracking-[0.3em] opacity-50">{u.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-4 text-xs uppercase tracking-[0.5em] opacity-60"
          >
            {tagline}
          </motion.p>
          <h1 className="font-display text-[clamp(2.5rem,8vw,7rem)] font-bold leading-[0.92] tracking-tight">
            <ParticleReveal text={event.eventTitle} />
          </h1>
          {event.city && (
            <motion.p
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="mt-6 text-sm opacity-60"
            >
              {event.city}
            </motion.p>
          )}
          {!reduce && (
            <motion.div
              animate={{ y: [0, 8, 0], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.4em] opacity-50"
            >
              Scroll to reveal
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* ─── 02. MANIFESTO ─── */}
      {showStory && (
        <section className="relative mx-auto max-w-6xl px-6 py-28 sm:py-44">
          <div className="grid items-center gap-12 sm:grid-cols-2">
            <motion.div
              initial={reduce ? false : { opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: EASE }}
            >
              <p className="mb-4 text-[10px] uppercase tracking-[0.5em]" style={{ color: accent }}>The Vision</p>
              <h2 className="font-display text-3xl sm:text-5xl leading-[1.08]">{invitationMessage}</h2>
            </motion.div>
            <motion.div
              initial={reduce ? false : { opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2, ease: EASE }}
            >
              {aboutStory ? (
                <p className="text-lg leading-relaxed opacity-75">{aboutStory}</p>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { stat: "10×", label: "Faster iteration" },
                    { stat: "99.9%", label: "Uptime guarantee" },
                    { stat: "24/7", label: "Concierge support" },
                    { stat: "∞", label: "Possibilities" },
                  ].map((s, i) => (
                    <motion.div
                      key={s.label}
                      initial={reduce ? false : { opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
                      className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center backdrop-blur-sm"
                    >
                      <span className="block font-display text-2xl sm:text-3xl" style={{ color: accent }}>{s.stat}</span>
                      <span className="mt-1 block text-[11px] uppercase tracking-[0.2em] opacity-50">{s.label}</span>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* ─── 03. FEATURES / CAPABILITIES ─── */}
      <section className="relative mx-auto max-w-6xl px-6 py-20 sm:py-32">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-4 text-center text-[10px] uppercase tracking-[0.5em]" style={{ color: accent }}
        >
          Capabilities
        </motion.p>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { title: "Seamless Integration", desc: "Connects with your entire ecosystem. Zero friction, infinite possibility.", icon: "⚡" },
            { title: "Real-time Intelligence", desc: "Live analytics, instant feedback loops, predictive workflows.", icon: "◆" },
            { title: "Enterprise Security", desc: "End-to-end encryption, SOC 2, GDPR. Your data, your terms.", icon: "◈" },
          ].map((f, i) => (
            <HolographicCard key={f.title} delay={i * 0.15}>
              <span className="text-2xl">{f.icon}</span>
              <h3 className="mt-4 font-display text-lg sm:text-xl">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed opacity-65">{f.desc}</p>
            </HolographicCard>
          ))}
        </div>
      </section>

      {/* ─── 04. ROADMAP / TIMELINE ─── */}
      {showJourney && (
        <section className="relative py-24 sm:py-36">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-16 text-center text-[10px] uppercase tracking-[0.5em]" style={{ color: accent }}
          >
            Roadmap
          </motion.p>
          <CircuitTimeline items={subEvents} />
        </section>
      )}

      {/* ─── 05. GALLERY — FLOATING GLASS CARDS ─── */}
      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-20 sm:py-32">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-12 text-center text-[10px] uppercase tracking-[0.5em]" style={{ color: accent }}
          >
            Moments
          </motion.p>
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {galleryItems.map((m, i) => (
              <GlassCard key={`${m.fileName}-${i}`} index={i} className="mb-4 break-inside-avoid overflow-hidden p-0">
                <img src={m.publicUrl} alt={m.caption ?? "Gallery"} className="w-full object-cover" loading="lazy" />
                {m.caption && (
                  <div className="p-4">
                    <p className="text-sm opacity-70">{m.caption}</p>
                  </div>
                )}
              </GlassCard>
            ))}
            {editing && galleryItems.length === 0 && (
              <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-white/20 text-sm opacity-50">
                + Add photos
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── 06. VENUE ─── */}
      {showVenue && (
        <section className="relative mx-auto max-w-5xl px-6 py-20 sm:py-32">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-4 text-center text-[10px] uppercase tracking-[0.5em]" style={{ color: accent }}
          >
            Location
          </motion.p>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 30, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: EASE }}
            className="overflow-hidden rounded-2xl border border-white/10"
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

      {/* ─── 07. FINALE — CTA ─── */}
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
            className="mx-auto mb-10 h-32 w-32 rounded-full opacity-30 sm:h-44 sm:w-44"
            style={{
              background: `radial-gradient(circle, ${accent}, transparent 70%)`,
              filter: "blur(20px)",
            }}
          />
          <h2 className="font-display text-[clamp(2rem,6vw,5rem)] leading-[1.05] font-bold">
            {event.eventTitle}
          </h2>
          {event.person1Name && (
            <p className="mt-6 text-lg opacity-70">{event.person1Name}</p>
          )}
          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <motion.div
              whileHover={reduce ? undefined : { scale: 1.02 }}
              className="mt-10 inline-block"
            >
              <a
                href={event.rsvpLinkOrContact}
                target="_blank"
                rel="noreferrer"
                className="inline-block rounded-full border px-10 py-4 text-sm uppercase tracking-[0.35em] transition-all hover:bg-[var(--accent)] hover:text-[#0a0a0f]"
                style={{ borderColor: accent, color: accent }}
              >
                {event.rsvpType === "email" ? "Get early access" : "Reserve your seat"}
              </a>
            </motion.div>
          )}
        </motion.div>
      </section>

      <footer className="border-t border-white/5 py-8 text-center text-xs opacity-40">
        <p>{event.eventTitle}{event.person1Name ? ` by ${event.person1Name}` : ""}</p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default NexusTemplate;
