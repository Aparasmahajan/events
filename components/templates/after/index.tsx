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

const BEAMS = [
  { angle: 10, color: "#ff2d78", width: "8vw", x: "20%" },
  { angle: -8, color: "#8b5cf6", width: "6vw", x: "45%" },
  { angle: 12, color: "#00f0ff", width: "5vw", x: "70%" },
  { angle: -15, color: "#ff2d78", width: "7vw", x: "85%" },
];

const SPARKS = Array.from({ length: 30 }, (_, i) => ({
  x: `${(i * 31 + 7) % 100}%`,
  delay: (i % 10) * 0.2,
  dur: 1.5 + (i % 3) * 0.5,
  size: 1.5 + (i % 3) * 0.5,
}));

function ClubField({ reduce }: { reduce: boolean }) {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden bg-[#07070a]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#07070a] via-[#0c0c14] to-[#07070a]" />
      {!reduce && (
        <>
          {BEAMS.map((b, i) => (
            <motion.div
              key={i}
              className="absolute top-0 h-[120%] origin-top opacity-[0.06]"
              style={{ left: b.x, width: b.width, background: `linear-gradient(180deg, ${b.color}, transparent 80%)`, transform: `rotate(${b.angle}deg)` }}
              animate={{ opacity: [0.03, 0.1, 0.03] }}
              transition={{ duration: 3 + i, delay: i * 0.5, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
          <div className="absolute inset-0">
            {SPARKS.map((s, i) => (
              <motion.span
                key={i}
                className="absolute rounded-full"
                style={{ left: s.x, top: "100%", width: s.size, height: s.size, background: "#ff2d78", boxShadow: "0 0 6px #ff2d78" }}
                animate={{ y: ["0vh", "-100vh"], opacity: [0, 1, 0] }}
                transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: "linear" }}
              />
            ))}
          </div>
          <svg className="absolute inset-0 h-full w-full opacity-[0.02]" xmlns="http://www.w3.org/2000/svg">
            <filter id="after-noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" />
            </filter>
            <rect width="100%" height="100%" filter="url(#after-noise)" />
          </svg>
        </>
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-[#07070a]/40 via-transparent to-[#07070a]/80" />
    </div>
  );
}

function NeonReveal({ text, className, color }: { text: string; className?: string; color: string }) {
  const reduce = useReducedMotion();
  return (
    <span className={`inline-block ${className ?? ""}`}>
      {Array.from(text).map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={reduce ? false : { opacity: 0, filter: `blur(12px) drop-shadow(0 0 0 ${color})`, y: 10 }}
          whileInView={{ opacity: 1, filter: `blur(0px) drop-shadow(0 0 8px ${color})`, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.04, ease: EASE }}
          style={{ textShadow: `0 0 20px ${color}` }}
        >
          {ch === " " ? "\u00A0" : ch}
        </motion.span>
      ))}
    </span>
  );
}

function ClubCard({
  children,
  className,
  delay = 0,
  i = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  i?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 30, scale: 0.95, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      whileHover={reduce ? undefined : { y: -3, borderColor: "var(--accent)", boxShadow: "0 0 30px color-mix(in srgb, var(--accent) 20%, transparent)" }}
      className={`relative rounded-xl border border-white/[0.06] bg-white/[0.03] p-6 backdrop-blur-xl transition-all ${className ?? ""}`}
    >
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-white/[0.04] to-transparent" />
      <div className="relative">{children}</div>
    </motion.div>
  );
}

function AfterTimeline({ items, accent }: { items: SubEvent[]; accent: string }) {
  const reduce = useReducedMotion();
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <div className="mx-auto max-w-4xl px-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {sorted.map((s, i) => (
          <motion.article
            key={s.order}
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.5, delay: i * 0.07 }}
            className={i === sorted.length - 1 && sorted.length % 2 === 1 ? "sm:col-span-2 sm:mx-auto sm:max-w-md" : ""}
          >
            <ClubCard delay={i * 0.05} i={i}>
              <div className="flex items-center gap-3 mb-3">
                <span
                  className="flex h-7 w-7 items-center justify-center rounded text-[10px] font-bold"
                  style={{ background: accent, color: "#07070a" }}
                >
                  {String(s.order).padStart(2, "0")}
                </span>
                <span className="text-[10px] uppercase tracking-[0.25em] opacity-50">
                  {[s.date, s.startTime].filter(Boolean).join(" \u00B7 ")}
                </span>
              </div>
              <h3 className="font-display text-xl uppercase tracking-tight">{s.name}</h3>
              {s.venueName && <p className="mt-1 text-sm opacity-60">@ {s.venueName}</p>}
              {s.description && <p className="mt-2 text-sm leading-relaxed opacity-60">{s.description}</p>}
              {s.dressCode && (
                <p className="mt-3 inline-block border border-white/[0.06] px-3 py-1 text-[10px] uppercase tracking-[0.2em] opacity-50 rounded-full">
                  {s.dressCode}
                </p>
              )}
            </ClubCard>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

export const AfterTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;
  const [beat, setBeat] = useState(0);

  const accent = event.themeAccentColor || "#ff2d78";
  const tagline = event.tagline?.trim() || "The night is yours.";
  const invitationMessage = event.invitationMessage?.trim() || "You know the address. You know the vibe. The rest is up to the night.";
  const aboutStory = event.aboutStory?.trim() || "";
  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const hero = event.heroImageUrl || "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1600&q=80";

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setBeat((b) => (b + 1) % 4), 600);
    return () => clearInterval(id);
  }, [reduce]);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(heroP, [0, 1], [1, 0.9]);
  const heroTextY = useTransform(heroP, [0, 0.5], [0, -50]);
  const heroOpacity = useTransform(heroP, [0, 0.5], [1, 0]);

  const showStory = !event.hideStory;
  const showJourney = !event.hideEvents && subEvents.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  const pulseScale = [1, 1.03, 0.97, 1.02][beat];

  return (
    <div
      className="relative min-h-screen overflow-x-clip bg-[#07070a] font-sans text-[#f0f0f0] antialiased"
      style={{ "--accent": accent } as React.CSSProperties}
    >
      <ClubField reduce={reduce} />
      <ScrollProgress color={accent} />

      {/* ─── 01. DOOR ─── */}
      <section ref={heroRef} className="relative h-[100svh] min-h-[620px] flex items-center justify-center overflow-hidden">
        <motion.div style={reduce ? undefined : { scale: heroScale }} className="absolute inset-0">
          <HeroMedia imageSrc={hero} videoSrc={event.heroVideoUrl || undefined} alt={event.eventTitle} className="opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07070a] via-[#07070a]/40 to-[#07070a]/20" />
        </motion.div>

        <motion.div style={reduce ? undefined : { y: heroTextY, opacity: heroOpacity }} className="relative z-10 text-center px-5">
          <motion.p
            animate={reduce ? undefined : { scale: pulseScale }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="mb-6 text-[10px] uppercase tracking-[0.8em]"
            style={{ color: accent, textShadow: `0 0 30px ${accent}` }}
          >
            {tagline}
          </motion.p>
          <h1 className="font-display text-[clamp(3rem,12vw,9rem)] font-black uppercase leading-[0.88] tracking-tight">
            {event.eventTitle.split(" ").map((w, i) => (
              <span key={i} className="block">
                <NeonReveal text={w} color={accent} />
              </span>
            ))}
          </h1>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-8 flex flex-wrap justify-center gap-4 text-xs uppercase tracking-[0.4em]"
          >
            {event.mainDate && (
              <span className="opacity-70">
                {new Date(event.mainDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
              </span>
            )}
            {event.mainStartTime && <span className="opacity-50">/</span>}
            {event.mainStartTime && <span className="opacity-70">{event.mainStartTime}</span>}
            {event.city && <><span className="opacity-50">/</span><span className="opacity-70">{event.city}</span></>}
          </motion.div>
        </motion.div>

        {!reduce && (
          <motion.div
            animate={{ y: [0, 8, 0], opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.4em] opacity-50"
            style={{ color: accent }}
          >
            Enter
          </motion.div>
        )}
      </section>

      {/* ─── 02. THE VIBE ─── */}
      {showStory && (
        <section className="relative mx-auto max-w-5xl px-6 py-28 sm:py-36">
          <div className="grid items-center gap-12 sm:grid-cols-2">
            <motion.div
              initial={reduce ? false : { opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: EASE }}
            >
              <p className="mb-3 text-[10px] uppercase tracking-[0.5em] opacity-50" style={{ color: accent }}>
                The Vibe
              </p>
              <h2 className="font-display text-3xl uppercase leading-[1.05] tracking-tight sm:text-4xl">
                {invitationMessage}
              </h2>
            </motion.div>
            <motion.div
              initial={reduce ? false : { opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2, ease: EASE }}
            >
              <p className="text-base leading-relaxed opacity-60 sm:text-lg">
                {aboutStory || "No dress code but confidence. No entry policy but good energy. The music finds the level it needs to be. The rest is chemistry."}
              </p>
              <motion.div
                className="mt-6 h-px w-full"
                style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
                animate={reduce ? undefined : { opacity: [0.2, 0.8, 0.2] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* ─── 03. THE LINEUP ─── */}
      <section className="relative mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-10 text-center text-[10px] uppercase tracking-[0.5em] opacity-50"
          style={{ color: accent }}
        >
          The Lineup
        </motion.p>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { role: "Music", desc: "Curated sounds from dusk until dawn. Deep house, techno, afro, disco — the room decides." },
            { role: "Lighting", desc: "A living light sculpture. Beams, strobes, and shadows choreographed to the room's energy." },
            { role: "Vibe", desc: "The right people, the right space, the right moment. Everything else falls into place." },
          ].map((l, i) => (
            <ClubCard key={l.role} delay={i * 0.12} i={i}>
              <p className="text-[10px] uppercase tracking-[0.4em] opacity-40" style={{ color: accent }}>0{i + 1}</p>
              <h3 className="mt-2 font-display text-xl uppercase tracking-tight">{l.role}</h3>
              <p className="mt-2 text-sm leading-relaxed opacity-55">{l.desc}</p>
            </ClubCard>
          ))}
        </div>
      </section>

      {/* ─── 04. THE RUN OF SHOW ─── */}
      {showJourney && (
        <section className="relative py-24 sm:py-32">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-14 text-center text-[10px] uppercase tracking-[0.5em] opacity-50"
            style={{ color: accent }}
          >
            The Night Unfolds
          </motion.p>
          <AfterTimeline items={subEvents} accent={accent} />
        </section>
      )}

      {/* ─── 05. GALLERY ─── */}
      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-10 text-center text-[10px] uppercase tracking-[0.5em] opacity-50"
            style={{ color: accent }}
          >
            Last Time
          </motion.p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {galleryItems.map((m, i) => (
              <motion.div
                key={`${m.fileName}-${i}`}
                initial={reduce ? false : { opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="group relative overflow-hidden rounded-xl"
              >
                <img
                  src={m.publicUrl}
                  alt={m.caption ?? ""}
                  className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07070a]/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </motion.div>
            ))}
            {editing && galleryItems.length === 0 && (
              <div className="col-span-full flex h-48 items-center justify-center rounded-xl border border-dashed border-white/20 text-sm opacity-50">
                + Add photos
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── 06. LOCATION ─── */}
      {showVenue && (
        <section className="relative mx-auto max-w-5xl px-6 py-20 sm:py-28">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-4 text-center text-[10px] uppercase tracking-[0.5em] opacity-50"
            style={{ color: accent }}
          >
            The Spot
          </motion.p>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.03] p-1 backdrop-blur-xl"
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

      {/* ─── 07. THE AFTER ─── */}
      <section className="relative px-6 py-28 text-center sm:py-44">
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: EASE }}
          className="mx-auto max-w-3xl"
        >
          <motion.div
            aria-hidden
            animate={reduce ? undefined : { scale: [1, 1.05, 0.95, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="mx-auto mb-10 h-24 w-24 rounded-full opacity-30 sm:h-32 sm:w-32"
            style={{
              background: `radial-gradient(circle, ${accent}, transparent 70%)`,
              filter: "blur(20px)",
            }}
          />
          <h2 className="font-display text-[clamp(2.5rem,8vw,6rem)] font-black uppercase leading-[0.88] tracking-tight">
            <NeonReveal text={event.eventTitle.split(" ").join(" \u00B7 ")} color={accent} />
          </h2>
          {event.person1Name && (
            <p className="mt-4 text-sm uppercase tracking-[0.4em] opacity-60">{event.person1Name}</p>
          )}
          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <motion.div
              whileHover={reduce ? undefined : { scale: 1.03 }}
              className="mt-10 inline-block"
            >
              <a
                href={event.rsvpLinkOrContact}
                target="_blank"
                rel="noreferrer"
                className="inline-block rounded-full px-12 py-4 text-sm uppercase tracking-[0.35em] transition-all"
                style={{ background: accent, color: "#07070a" }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 0 40px ${accent}`; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}
              >
                Get on the list
              </a>
            </motion.div>
          )}
        </motion.div>
      </section>

      <footer className="border-t border-white/[0.04] py-8 text-center text-xs opacity-40">
        <p>{event.eventTitle}{event.person1Name ? ` \u00B7 ${event.person1Name}` : ""}</p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default AfterTemplate;
