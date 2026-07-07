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
const SPOKES = 12;
const CABINS = Array.from({ length: SPOKES }, (_, i) => ({
  angle: (360 / SPOKES) * i,
  color: i % 3 === 0 ? "#ff4dd2" : i % 3 === 1 ? "#00e5ff" : "#ffd166",
}));

const FIREWORK_RAYS = Array.from({ length: 14 }, (_, i) => ({
  angle: (360 / 14) * i,
  delay: (i % 5) * 0.04,
}));

function CarnivalField({ reduce }: { reduce: boolean }) {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a0630] via-[#22084a] to-[#2b0a4a]" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at 20% 30%, #ff4dd2 0%, transparent 40%), radial-gradient(ellipse at 80% 70%, #00e5ff 0%, transparent 45%)",
        }}
      />
      {!reduce && (
        <svg className="absolute inset-0 h-full w-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <filter id="carnival-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" />
          </filter>
          <rect width="100%" height="100%" filter="url(#carnival-noise)" />
        </svg>
      )}
    </div>
  );
}

function FerrisWheel({ reduce, accent }: { reduce: boolean; accent: string }) {
  return (
    <motion.svg
      aria-hidden
      viewBox="-160 -160 320 320"
      className="absolute -right-[18vw] -top-[18vw] h-[70vw] w-[70vw] max-h-[720px] max-w-[720px] opacity-70 sm:-right-[10vw] sm:-top-[10vw]"
      animate={reduce ? undefined : { rotate: 360 }}
      transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
    >
      <circle r="140" fill="none" stroke={accent} strokeWidth="1.2" opacity="0.55" />
      <circle r="126" fill="none" stroke="#00e5ff" strokeWidth="0.6" opacity="0.4" />
      {CABINS.map((c) => (
        <g key={c.angle} transform={`rotate(${c.angle})`}>
          <line x1="0" y1="0" x2="0" y2="-132" stroke="#fff2f7" strokeWidth="0.6" opacity="0.35" />
          <g transform="translate(0,-140)">
            <rect x="-9" y="-6" width="18" height="12" rx="3" fill={c.color} opacity="0.9" />
            <circle r="3" fill="#fff2f7" opacity="0.9" style={{ filter: `drop-shadow(0 0 6px ${c.color})` }} />
          </g>
        </g>
      ))}
      <circle r="10" fill="#ffd166" />
      <circle r="4" fill="#1a0630" />
    </motion.svg>
  );
}

function FireworkBurst({ color, size = 140 }: { color: string; size?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.svg
      aria-hidden
      viewBox="-100 -100 200 200"
      style={{ width: size, height: size }}
      initial={reduce ? false : { opacity: 0, scale: 0.2 }}
      whileInView={{ opacity: [0, 1, 0.6, 0], scale: [0.2, 1.1, 1.25, 1.35] }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ duration: 1.4, ease: "easeOut" }}
    >
      {FIREWORK_RAYS.map((r) => (
        <motion.line
          key={r.angle}
          x1="0"
          y1="0"
          x2="0"
          y2="-80"
          stroke={color}
          strokeWidth="1.4"
          strokeLinecap="round"
          transform={`rotate(${r.angle})`}
          initial={reduce ? false : { pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: [0, 1, 1], opacity: [0, 1, 0] }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: r.delay, ease: "easeOut" }}
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
      ))}
      <circle r="4" fill={color} style={{ filter: `drop-shadow(0 0 10px ${color})` }} />
    </motion.svg>
  );
}

function NeonGlow({ text, color, className }: { text: string; color: string; className?: string }) {
  return (
    <span
      className={className}
      style={{
        color: "#fff2f7",
        textShadow: `0 0 12px ${color}, 0 0 28px ${color}, 0 0 48px color-mix(in srgb, ${color} 40%, transparent)`,
      }}
    >
      {text}
    </span>
  );
}

function ArcadeBooth({ children, accent, i }: { children: React.ReactNode; accent: string; i: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 30, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
      whileHover={reduce ? undefined : { y: -4 }}
      className="relative rounded-[28px] border-[6px] p-[3px]"
      style={{ borderColor: accent, boxShadow: `0 0 24px color-mix(in srgb, ${accent} 45%, transparent), inset 0 0 20px rgba(0,0,0,0.5)` }}
    >
      <div className="rounded-[22px] bg-[#0f0322] p-5 sm:p-6">{children}</div>
    </motion.div>
  );
}

function CarnivalTimeline({ items, accent }: { items: SubEvent[]; accent: string }) {
  const reduce = useReducedMotion();
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <div className="mx-auto max-w-5xl px-6">
      <div className="grid gap-5 sm:grid-cols-2">
        {sorted.map((s, i) => (
          <motion.article
            key={s.order}
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.5, delay: i * 0.07 }}
          >
            <ArcadeBooth accent={accent} i={i}>
              <div className="flex items-center gap-3">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-full font-mono text-xs font-bold"
                  style={{ background: "#ffd166", color: "#1a0630", boxShadow: "0 0 14px #ffd166" }}
                >
                  {String(s.order).padStart(2, "0")}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#00e5ff]">
                  {[s.date, s.startTime].filter(Boolean).join(" · ")}
                </span>
              </div>
              <h3 className="font-display mt-3 text-xl uppercase tracking-tight">
                <NeonGlow text={s.name} color={accent} />
              </h3>
              {s.venueName && <p className="mt-1 text-sm text-[#fff2f7]/70">@ {s.venueName}</p>}
              {s.description && <p className="mt-2 text-sm leading-relaxed text-[#fff2f7]/60">{s.description}</p>}
              {s.dressCode && (
                <p className="mt-3 inline-block rounded-full border border-[#ffd166]/60 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-[#ffd166]">
                  {s.dressCode}
                </p>
              )}
            </ArcadeBooth>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

function SectionLabel({ text, accent, coin }: { text: string; accent: string; coin?: string }) {
  return (
    <div className="mb-10 flex items-center justify-center gap-3">
      <FireworkBurst color={accent} size={72} />
      <div className="text-center">
        {coin && <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#ffd166]">{coin}</p>}
        <p className="font-mono text-[11px] uppercase tracking-[0.5em] text-[#00e5ff]">{text}</p>
      </div>
      <FireworkBurst color="#ffd166" size={72} />
    </div>
  );
}

export const CarnivalTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || "#ff4dd2";
  const tagline = event.tagline?.trim() || "Step right up · the future never tasted this sweet";
  const invitationMessage =
    event.invitationMessage?.trim() ||
    "Neon lights. Popcorn skies. A wheel that never stops. You're invited to the loudest, brightest, happiest night of the year.";
  const aboutStory = event.aboutStory?.trim() || "";
  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const hero =
    event.heroImageUrl ||
    "https://images.unsplash.com/photo-1508997449629-303059a039c0?auto=format&fit=crop&w=1600&q=80";

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(heroP, [0, 1], [1, 0.92]);
  const heroTextY = useTransform(heroP, [0, 0.6], [0, -60]);
  const heroOpacity = useTransform(heroP, [0, 0.6], [1, 0]);

  const showStory = !event.hideStory;
  const showJourney = !event.hideEvents && subEvents.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  return (
    <div
      className="relative min-h-screen overflow-x-clip bg-[#1a0630] font-sans text-[#fff2f7] antialiased"
      style={{ "--accent": accent } as React.CSSProperties}
    >
      <CarnivalField reduce={reduce} />
      <ScrollProgress color={accent} />

      {/* ─── 01. MIDWAY ─── */}
      <section ref={heroRef} className="relative flex h-[100svh] min-h-[640px] items-center justify-center overflow-hidden">
        <motion.div style={reduce ? undefined : { scale: heroScale }} className="absolute inset-0">
          <HeroMedia imageSrc={hero} videoSrc={event.heroVideoUrl || undefined} alt={event.eventTitle} className="opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a0630] via-[#1a0630]/60 to-[#1a0630]/30" />
        </motion.div>

        <FerrisWheel reduce={reduce} accent={accent} />

        <motion.div style={reduce ? undefined : { y: heroTextY, opacity: heroOpacity }} className="relative z-10 px-5 text-center">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-mono mb-6 text-[10px] uppercase tracking-[0.6em]"
            style={{ color: "#ffd166", textShadow: "0 0 18px #ffd166" }}
          >
            {tagline}
          </motion.p>
          <h1 className="font-display text-[clamp(3rem,13vw,10rem)] font-black uppercase leading-[0.86] tracking-tight">
            {event.eventTitle.split(" ").map((w, i) => (
              <motion.span
                key={i}
                initial={reduce ? false : { opacity: 0, y: 40, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.8, delay: 0.2 + i * 0.15, ease: EASE }}
                className="block"
              >
                <NeonGlow text={w} color={i % 2 ? "#00e5ff" : accent} />
              </motion.span>
            ))}
          </h1>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="font-mono mt-8 flex flex-wrap justify-center gap-4 text-xs uppercase tracking-[0.4em]"
          >
            {event.mainDate && (
              <span className="text-[#fff2f7]/80">
                {new Date(event.mainDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
              </span>
            )}
            {event.mainStartTime && <span className="text-[#ffd166]">✦</span>}
            {event.mainStartTime && <span className="text-[#fff2f7]/80">{event.mainStartTime}</span>}
            {event.city && (
              <>
                <span className="text-[#ffd166]">✦</span>
                <span className="text-[#fff2f7]/80">{event.city}</span>
              </>
            )}
          </motion.div>
        </motion.div>

        {!reduce && (
          <motion.div
            animate={{ y: [0, 8, 0], opacity: [0.3, 0.9, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="font-mono absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.5em]"
            style={{ color: accent }}
          >
            Ride On
          </motion.div>
        )}
      </section>

      {/* ─── 02. THE INVITATION ─── */}
      {showStory && (
        <section className="relative mx-auto max-w-5xl px-6 py-28 sm:py-36">
          <SectionLabel text="The Invitation" accent={accent} coin="◎ Insert Coin" />
          <div className="grid items-center gap-12 sm:grid-cols-2">
            <motion.div
              initial={reduce ? false : { opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: EASE }}
            >
              <h2 className="font-display text-3xl uppercase leading-[1.05] tracking-tight sm:text-4xl">
                <NeonGlow text={invitationMessage} color={accent} />
              </h2>
            </motion.div>
            <motion.div
              initial={reduce ? false : { opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2, ease: EASE }}
            >
              <p className="text-base leading-relaxed text-[#fff2f7]/70 sm:text-lg">
                {aboutStory ||
                  "Bring your loudest laugh, your best sneakers, and every friend who still believes in confetti. The ferris wheel is warming up, the popcorn is buttered, and the fireworks are counting the seconds."}
              </p>
              <motion.div
                className="mt-6 h-px w-full"
                style={{ background: `linear-gradient(90deg, transparent, ${accent}, #ffd166, #00e5ff, transparent)` }}
                animate={reduce ? undefined : { opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2.4, repeat: Infinity }}
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* ─── 03. BOOTHS ─── */}
      <section className="relative mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <SectionLabel text="The Booths" accent="#00e5ff" coin="◎ 03 Games" />
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { role: "Ring Toss", desc: "Neon rings, glowing bottles, prizes you didn't know you needed." },
            { role: "Photo Booth", desc: "Instant memories, holographic frames, and stickers that never fade." },
            { role: "Sweet Stand", desc: "Cotton candy clouds, popcorn constellations, sodas that fizz in ultraviolet." },
          ].map((l, i) => (
            <ArcadeBooth key={l.role} accent={i === 0 ? accent : i === 1 ? "#00e5ff" : "#ffd166"} i={i}>
              <p className="font-mono text-[10px] uppercase tracking-[0.4em]" style={{ color: "#ffd166" }}>
                ◎ 0{i + 1}
              </p>
              <h3 className="font-display mt-2 text-xl uppercase tracking-tight">
                <NeonGlow text={l.role} color={i === 0 ? accent : i === 1 ? "#00e5ff" : "#ffd166"} />
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#fff2f7]/70">{l.desc}</p>
            </ArcadeBooth>
          ))}
        </div>
      </section>

      {/* ─── 04. RUN OF SHOW ─── */}
      {showJourney && (
        <section className="relative py-24 sm:py-32">
          <SectionLabel text="Tonight's Program" accent="#ffd166" coin="◎ Now Playing" />
          <CarnivalTimeline items={subEvents} accent={accent} />
        </section>
      )}

      {/* ─── 05. GALLERY / PHOTO BOOTHS ─── */}
      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <SectionLabel text="Photo Booths" accent={accent} coin="◎ Memories" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((m, i) => {
              const frame = i % 3 === 0 ? accent : i % 3 === 1 ? "#00e5ff" : "#ffd166";
              return (
                <motion.div
                  key={`${m.fileName}-${i}`}
                  initial={reduce ? false : { opacity: 0, scale: 0.94 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="group relative"
                >
                  <p className="font-mono mb-2 text-center text-[10px] uppercase tracking-[0.4em]" style={{ color: frame }}>
                    ◎ Coin · {String(i + 1).padStart(2, "0")}
                  </p>
                  <div
                    className="overflow-hidden rounded-[24px] border-[6px] p-[3px]"
                    style={{ borderColor: frame, boxShadow: `0 0 22px color-mix(in srgb, ${frame} 55%, transparent)` }}
                  >
                    <div className="overflow-hidden rounded-[18px] bg-[#0f0322]">
                      <img
                        src={m.publicUrl}
                        alt={m.caption ?? ""}
                        className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
            {editing && galleryItems.length === 0 && (
              <div className="col-span-full flex h-48 items-center justify-center rounded-[24px] border-2 border-dashed border-white/25 text-sm text-[#fff2f7]/60">
                + Add photos
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── 06. THE FAIRGROUND ─── */}
      {showVenue && (
        <section className="relative mx-auto max-w-5xl px-6 py-20 sm:py-28">
          <SectionLabel text="The Fairground" accent="#00e5ff" coin="◎ Find Us" />
          {event.venueName && (
            <p className="font-display mb-4 text-center text-2xl uppercase tracking-tight">
              <NeonGlow text={event.venueName} color={accent} />
            </p>
          )}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="overflow-hidden rounded-[28px] border-[6px] p-[3px]"
            style={{ borderColor: accent, boxShadow: `0 0 28px color-mix(in srgb, ${accent} 45%, transparent)` }}
          >
            <div className="overflow-hidden rounded-[22px] bg-[#0f0322] p-1">
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

      {/* ─── 07. FIREWORKS FINALE ─── */}
      <section className="relative px-6 py-28 text-center sm:py-44">
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: EASE }}
          className="mx-auto max-w-3xl"
        >
          <div className="mx-auto mb-6 flex justify-center gap-4">
            <FireworkBurst color={accent} size={110} />
            <FireworkBurst color="#00e5ff" size={110} />
            <FireworkBurst color="#ffd166" size={110} />
          </div>
          <h2 className="font-display text-[clamp(2.5rem,9vw,6.5rem)] font-black uppercase leading-[0.88] tracking-tight">
            <NeonGlow text={event.eventTitle} color={accent} />
          </h2>
          {event.person1Name && (
            <p className="font-mono mt-4 text-sm uppercase tracking-[0.5em] text-[#ffd166]">
              For {event.person1Name}
            </p>
          )}
          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <motion.div whileHover={reduce ? undefined : { scale: 1.04 }} className="mt-10 inline-block">
              <a
                href={event.rsvpLinkOrContact}
                target="_blank"
                rel="noreferrer"
                className="font-mono inline-block rounded-full px-12 py-4 text-sm uppercase tracking-[0.35em] transition-all"
                style={{
                  background: `linear-gradient(90deg, ${accent}, #ffd166)`,
                  color: "#1a0630",
                  boxShadow: `0 0 28px ${accent}`,
                }}
              >
                Claim Your Ticket
              </a>
            </motion.div>
          )}
        </motion.div>
      </section>

      <footer className="border-t border-white/[0.06] py-8 text-center font-mono text-xs uppercase tracking-[0.35em] text-[#fff2f7]/50">
        <p>
          {event.eventTitle}
          {event.person1Name ? ` · ${event.person1Name}` : ""}
        </p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default CarnivalTemplate;
