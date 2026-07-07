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

const BG = "#062018";
const NEON_GREEN = "#38ff7a";
const NEON_PINK = "#ff2b8f";
const NEON_YELLOW = "#f8de3a";
const NEON_TEAL = "#12b6a0";
const IVORY = "#e6f8ea";

const LEAVES = [
  { d: "M50 5 C 20 30 15 70 50 95 C 85 70 80 30 50 5 Z M50 15 L50 90", color: NEON_GREEN, x: "6%", y: "8%", size: 240, rot: -18, dur: 14, delay: 0 },
  { d: "M10 50 Q 30 10 90 20 Q 70 50 90 80 Q 30 90 10 50 Z", color: NEON_TEAL, x: "78%", y: "12%", size: 300, rot: 24, dur: 18, delay: 1 },
  { d: "M50 5 L 55 45 L 95 50 L 55 55 L 50 95 L 45 55 L 5 50 L 45 45 Z", color: NEON_PINK, x: "18%", y: "62%", size: 220, rot: 12, dur: 16, delay: 2 },
  { d: "M20 20 Q 50 5 80 20 Q 95 50 80 80 Q 50 95 20 80 Q 5 50 20 20 Z M50 15 L50 85", color: NEON_YELLOW, x: "70%", y: "68%", size: 260, rot: -22, dur: 20, delay: 0.6 },
  { d: "M15 45 C 25 15 75 15 85 45 C 75 75 25 75 15 45 Z M15 45 L 85 45", color: NEON_GREEN, x: "42%", y: "80%", size: 200, rot: 8, dur: 15, delay: 1.4 },
  { d: "M50 5 C 30 25 30 50 50 50 C 70 50 70 25 50 5 Z M50 50 L50 95", color: NEON_TEAL, x: "48%", y: "2%", size: 180, rot: -6, dur: 17, delay: 2.2 },
];

const ANIMALS = [
  {
    label: "panther",
    color: NEON_PINK,
    x: "12%",
    y: "32%",
    size: 120,
    d: "M10 60 Q 15 40 30 40 Q 35 25 45 30 L50 22 L55 30 Q 65 25 70 40 Q 90 45 88 62 Q 85 72 70 72 L60 72 L58 82 L52 82 L52 72 L38 72 L36 82 L30 82 L30 72 Q 15 72 10 60 Z M32 45 L36 50 M60 45 L64 50",
  },
  {
    label: "bird",
    color: NEON_GREEN,
    x: "82%",
    y: "40%",
    size: 100,
    d: "M20 55 Q 35 30 55 40 L70 30 L68 45 L82 42 L74 55 Q 82 60 78 70 Q 60 78 40 72 Q 25 68 20 55 Z M60 52 L64 55",
  },
  {
    label: "snake",
    color: NEON_YELLOW,
    x: "24%",
    y: "84%",
    size: 140,
    d: "M10 50 Q 25 20 45 50 Q 65 80 85 50 Q 90 40 82 35 M78 40 L82 30 M86 40 L90 32",
  },
  {
    label: "butterfly",
    color: NEON_TEAL,
    x: "68%",
    y: "82%",
    size: 90,
    d: "M50 50 L50 70 M50 40 Q 20 20 15 40 Q 20 60 50 55 Q 80 60 85 40 Q 80 20 50 40 Z M46 48 L46 55 L54 55 L54 48",
  },
];

const WATERFALL_STRIPES = Array.from({ length: 7 }, (_, i) => ({
  x: i * 14,
  delay: (i % 4) * 0.3,
  dur: 2 + (i % 3) * 0.6,
  op: 0.15 + (i % 3) * 0.08,
}));

function JungleField({ reduce }: { reduce: boolean }) {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden" style={{ background: BG }}>
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 30% 20%, ${NEON_TEAL}18, transparent 55%), radial-gradient(ellipse at 80% 70%, ${NEON_PINK}14, transparent 60%), linear-gradient(180deg, ${BG}, #041510 80%)` }} />

      <svg aria-hidden className="absolute inset-0 h-full w-full">
        <defs>
          <filter id="njungle-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {LEAVES.map((l, i) => (
          <motion.g
            key={i}
            transform={`translate(0,0)`}
            style={{ transformOrigin: "center" }}
            animate={reduce ? undefined : { rotate: [l.rot - 3, l.rot + 3, l.rot - 3], y: [0, -8, 0] }}
            transition={{ duration: l.dur, delay: l.delay, repeat: Infinity, ease: "easeInOut" }}
          >
            <g transform={`translate(${l.x} ${l.y})`} opacity={0.55}>
              <svg width={l.size} height={l.size} viewBox="0 0 100 100" style={{ overflow: "visible" }}>
                <path d={l.d} fill="none" stroke={l.color} strokeWidth={1.4} filter="url(#njungle-glow)" style={{ filter: `drop-shadow(0 0 8px ${l.color})` }} />
                <path d={l.d} fill={l.color} opacity={0.06} />
              </svg>
            </g>
          </motion.g>
        ))}
      </svg>

      <div className="absolute right-0 top-0 h-full w-[10vw] overflow-hidden opacity-70">
        {WATERFALL_STRIPES.map((s, i) => (
          <motion.span
            key={i}
            className="absolute top-0 h-full"
            style={{ left: `${s.x}%`, width: 3, background: `linear-gradient(180deg, transparent, ${NEON_TEAL}, ${NEON_GREEN}, transparent)`, opacity: s.op, filter: `blur(1px) drop-shadow(0 0 6px ${NEON_TEAL})` }}
            animate={reduce ? undefined : { y: ["-40%", "40%"], opacity: [s.op * 0.3, s.op * 1.4, s.op * 0.3] }}
            transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </div>

      <svg aria-hidden className="absolute inset-0 h-full w-full" style={{ mixBlendMode: "screen" }}>
        {ANIMALS.map((a, i) => (
          <motion.g
            key={a.label}
            animate={reduce ? undefined : { opacity: [0.35, 0.9, 0.35] }}
            transition={{ duration: 2.4 + i * 0.6, delay: i * 0.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <g transform={`translate(${a.x} ${a.y})`}>
              <svg width={a.size} height={a.size} viewBox="0 0 100 100" style={{ overflow: "visible" }}>
                <path d={a.d} fill="none" stroke={a.color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 10px ${a.color}) drop-shadow(0 0 20px ${a.color})` }} />
              </svg>
            </g>
          </motion.g>
        ))}
      </svg>

      <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${BG}55 0%, transparent 25%, transparent 75%, ${BG}dd 100%)` }} />
    </div>
  );
}

function GlowText({ text, color, className }: { text: string; color: string; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <span className={`inline-block ${className ?? ""}`} style={{ textShadow: `0 0 12px ${color}, 0 0 28px ${color}88` }}>
      {Array.from(text).map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={reduce ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.035, ease: EASE }}
        >
          {ch === " " ? " " : ch}
        </motion.span>
      ))}
    </span>
  );
}

const CARD_COLORS = [NEON_GREEN, NEON_PINK, NEON_YELLOW, NEON_TEAL];
const CARD_GLYPHS = ["⚘", "✿", "✤", "❀"];

function JungleTimeline({ items }: { items: SubEvent[] }) {
  const reduce = useReducedMotion();
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <div className="mx-auto max-w-5xl px-6">
      <div className="grid gap-5 sm:grid-cols-2">
        {sorted.map((s, i) => {
          const color = CARD_COLORS[i % CARD_COLORS.length];
          const glyph = CARD_GLYPHS[i % CARD_GLYPHS.length];
          return (
            <motion.article
              key={s.order}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
              whileHover={reduce ? undefined : { y: -4 }}
              className="relative rounded-2xl p-6"
              style={{
                border: `2px solid ${color}`,
                background: `linear-gradient(160deg, ${BG}dd, ${BG}aa)`,
                boxShadow: `0 0 18px ${color}55, inset 0 0 24px ${color}18`,
              }}
            >
              <div className="flex items-center justify-between">
                <span className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold" style={{ background: `${color}22`, color, border: `1px solid ${color}` }}>
                  {String(s.order).padStart(2, "0")}
                </span>
                <span className="text-lg leading-none" style={{ color, textShadow: `0 0 8px ${color}` }} aria-hidden>
                  {glyph}
                </span>
              </div>
              <p className="mt-4 text-[10px] uppercase tracking-[0.3em]" style={{ color: `${color}cc` }}>
                {[s.date, s.startTime].filter(Boolean).join(" · ")}
              </p>
              <h3 className="mt-2 font-display text-xl font-black uppercase tracking-tight" style={{ color: IVORY, textShadow: `0 0 8px ${color}66` }}>
                {s.name}
              </h3>
              {s.venueName && <p className="mt-1 text-sm opacity-70" style={{ color: IVORY }}>@ {s.venueName}</p>}
              {s.description && <p className="mt-2 text-sm leading-relaxed opacity-70" style={{ color: IVORY }}>{s.description}</p>}
              {s.dressCode && (
                <p className="mt-4 inline-block rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em]" style={{ border: `1px solid ${color}`, color, background: `${color}12` }}>
                  {s.dressCode}
                </p>
              )}
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}

export const NeonjungleTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || NEON_GREEN;
  const tagline = event.tagline?.trim() || "Enter the neon canopy.";
  const invitationMessage = event.invitationMessage?.trim() || "Where the wild things glow. A rainforest rewired in neon, alive with sound and light.";
  const aboutStory = event.aboutStory?.trim() || "Vines drip electric. Panthers pulse pink through the leaves. The waterfall runs in stripes of teal. Come get lost in the current.";
  const hero = event.heroImageUrl || "https://images.unsplash.com/photo-1552083375-1447ce886485?auto=format&fit=crop&w=1600&q=80";
  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);

  const showStory = !event.hideStory;
  const showEvents = !event.hideEvents && subEvents.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(heroP, [0, 1], [1, 0.94]);
  const heroTextY = useTransform(heroP, [0, 0.5], [0, -40]);
  const heroOpacity = useTransform(heroP, [0, 0.6], [1, 0]);

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-sans antialiased"
      style={{ "--accent": accent, background: BG, color: IVORY } as React.CSSProperties}
    >
      <JungleField reduce={reduce} />
      <ScrollProgress color={accent} />

      {/* HERO */}
      <section ref={heroRef} className="relative flex min-h-[100svh] items-center justify-center overflow-hidden pb-24 sm:pb-28">
        <motion.div style={reduce ? undefined : { scale: heroScale }} className="absolute inset-0">
          <HeroMedia imageSrc={hero} videoSrc={event.heroVideoUrl || undefined} alt={event.eventTitle} className="opacity-30" />
          <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at center, transparent 30%, ${BG} 85%)` }} />
        </motion.div>

        <motion.div style={reduce ? undefined : { y: heroTextY, opacity: heroOpacity }} className="relative z-10 px-6 text-center">
          <motion.p
            initial={reduce ? false : { opacity: 0, letterSpacing: "0.2em" }}
            animate={{ opacity: 1, letterSpacing: "0.7em" }}
            transition={{ duration: 1.4, ease: EASE }}
            className="mb-8 text-[10px] uppercase"
            style={{ color: NEON_GREEN, textShadow: `0 0 18px ${NEON_GREEN}` }}
          >
            {tagline}
          </motion.p>
          <h1 className="font-display text-[clamp(2.8rem,11vw,8rem)] font-black uppercase leading-[0.9] tracking-tight" style={{ color: IVORY }}>
            {event.eventTitle.split(" ").map((w, i) => (
              <span key={i} className="block">
                <GlowText text={w} color={i % 2 === 0 ? NEON_GREEN : NEON_PINK} />
              </span>
            ))}
          </h1>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.9 }}
            className="mt-10 flex flex-wrap justify-center gap-4 text-[11px] uppercase tracking-[0.4em]"
          >
            {event.mainDate && (
              <span style={{ color: NEON_YELLOW, textShadow: `0 0 10px ${NEON_YELLOW}88` }}>
                {new Date(event.mainDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
              </span>
            )}
            {event.mainStartTime && <span className="opacity-40">/</span>}
            {event.mainStartTime && <span style={{ color: NEON_TEAL, textShadow: `0 0 10px ${NEON_TEAL}88` }}>{event.mainStartTime}</span>}
            {event.city && (
              <>
                <span className="opacity-40">/</span>
                <span style={{ color: NEON_PINK, textShadow: `0 0 10px ${NEON_PINK}88` }}>{event.city}</span>
              </>
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* STORY */}
      {showStory && (
        <section className="relative mx-auto max-w-5xl px-6 py-24 sm:py-32">
          <div className="grid items-center gap-12 sm:grid-cols-2">
            <motion.div
              initial={reduce ? false : { opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              <p className="mb-3 text-[10px] uppercase tracking-[0.5em]" style={{ color: NEON_PINK, textShadow: `0 0 10px ${NEON_PINK}` }}>The Canopy</p>
              <h2 className="font-display text-3xl font-black uppercase leading-[1.05] tracking-tight sm:text-4xl" style={{ textShadow: `0 0 10px ${NEON_GREEN}55` }}>
                {invitationMessage}
              </h2>
            </motion.div>
            <motion.div
              initial={reduce ? false : { opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
            >
              <p className="text-base leading-relaxed opacity-80 sm:text-lg">{aboutStory}</p>
              <motion.div
                className="mt-6 h-px w-full"
                style={{ background: `linear-gradient(90deg, transparent, ${NEON_GREEN}, ${NEON_PINK}, transparent)` }}
                animate={reduce ? undefined : { opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2.6, repeat: Infinity }}
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* SUB-EVENTS */}
      {showEvents && (
        <section className="relative py-20 sm:py-28">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-12 text-center text-[10px] uppercase tracking-[0.5em]"
            style={{ color: NEON_YELLOW, textShadow: `0 0 10px ${NEON_YELLOW}` }}
          >
            The Undergrowth
          </motion.p>
          <JungleTimeline items={subEvents} />
        </section>
      )}

      {/* GALLERY */}
      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-10 text-center text-[10px] uppercase tracking-[0.5em]"
            style={{ color: NEON_TEAL, textShadow: `0 0 10px ${NEON_TEAL}` }}
          >
            Glimpses in the Leaves
          </motion.p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {galleryItems.map((m, i) => {
              const color = CARD_COLORS[i % CARD_COLORS.length];
              return (
                <motion.div
                  key={`${m.fileName}-${i}`}
                  initial={reduce ? false : { opacity: 0, scale: 0.94 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="group relative overflow-hidden rounded-xl"
                  style={{ border: `1.5px solid ${color}88`, boxShadow: `0 0 14px ${color}44` }}
                >
                  <img
                    src={m.publicUrl}
                    alt={m.caption ?? ""}
                    className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 60%, ${BG}dd)` }} />
                </motion.div>
              );
            })}
            {editing && galleryItems.length === 0 && (
              <div className="col-span-full flex h-48 items-center justify-center rounded-xl border border-dashed text-sm opacity-60" style={{ borderColor: `${NEON_GREEN}66`, color: NEON_GREEN }}>
                + Add photos
              </div>
            )}
          </div>
        </section>
      )}

      {/* VENUE */}
      {showVenue && (
        <section className="relative mx-auto max-w-5xl px-6 py-20 sm:py-28">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-4 text-center text-[10px] uppercase tracking-[0.5em]"
            style={{ color: NEON_PINK, textShadow: `0 0 10px ${NEON_PINK}` }}
          >
            The Clearing
          </motion.p>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="overflow-hidden rounded-2xl p-1"
            style={{ border: `2px solid ${NEON_GREEN}`, boxShadow: `0 0 22px ${NEON_GREEN}44, inset 0 0 32px ${NEON_TEAL}22` }}
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

      {/* CTA */}
      <section className="relative px-6 py-28 text-center sm:py-40">
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: EASE }}
          className="mx-auto max-w-3xl"
        >
          <motion.div
            aria-hidden
            animate={reduce ? undefined : { scale: [1, 1.08, 1], opacity: [0.4, 0.75, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="mx-auto mb-10 h-28 w-28 rounded-full sm:h-36 sm:w-36"
            style={{ background: `radial-gradient(circle, ${NEON_GREEN}, ${NEON_TEAL}44 45%, transparent 72%)`, filter: "blur(18px)" }}
          />
          <h2 className="font-display text-[clamp(2.2rem,7vw,5.5rem)] font-black uppercase leading-[0.9] tracking-tight">
            <GlowText text={event.eventTitle.split(" ").join(" · ")} color={NEON_GREEN} />
          </h2>
          {event.person1Name && (
            <p className="mt-5 text-sm uppercase tracking-[0.4em]" style={{ color: NEON_PINK, textShadow: `0 0 10px ${NEON_PINK}88` }}>
              {event.person1Name}
            </p>
          )}
          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <motion.div whileHover={reduce ? undefined : { scale: 1.04 }} className="mt-10 inline-block">
              <a
                href={event.rsvpLinkOrContact}
                target="_blank"
                rel="noreferrer"
                className="inline-block rounded-full px-12 py-4 text-sm font-bold uppercase tracking-[0.35em] transition-all"
                style={{ background: NEON_GREEN, color: BG, boxShadow: `0 0 24px ${NEON_GREEN}88` }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 0 44px ${NEON_GREEN}, 0 0 80px ${NEON_PINK}66`; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = `0 0 24px ${NEON_GREEN}88`; }}
              >
                Step into the jungle
              </a>
            </motion.div>
          )}
        </motion.div>
      </section>

      <footer className="border-t py-8 text-center text-xs opacity-50" style={{ borderColor: `${NEON_GREEN}22`, color: IVORY }}>
        <p>{event.eventTitle}{event.person1Name ? ` · ${event.person1Name}` : ""}</p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default NeonjungleTemplate;
