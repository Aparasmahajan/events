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

const SIGN_TOWERS = [
  { x: "6%", chars: ["東", "京", "夜"], width: 44, delay: 0, height: "72%" },
  { x: "24%", chars: ["光", "街"], width: 34, delay: 0.6, height: "58%" },
  { x: "74%", chars: ["夜", "光", "東"], width: 40, delay: 0.3, height: "66%" },
  { x: "90%", chars: ["街", "京"], width: 30, delay: 0.9, height: "50%" },
];

const RAIN = Array.from({ length: 36 }, (_, i) => ({
  x: `${(i * 17 + 3) % 100}%`,
  delay: (i % 12) * 0.13,
  dur: 0.9 + ((i * 7) % 6) * 0.12,
  height: 26 + ((i * 5) % 4) * 8,
  opacity: 0.18 + ((i % 5) * 0.05),
}));

const PUDDLE_DROPS = Array.from({ length: 8 }, (_, i) => ({
  x: `${(i * 13 + 7) % 100}%`,
  delay: (i % 4) * 0.4,
  dur: 3.2 + (i % 3) * 0.6,
}));

function TokyoField({ reduce }: { reduce: boolean }) {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden bg-[#020208]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#020208] via-[#060814] to-[#0a0e1a]" />
      {/* Sign towers — vertical neon-red kanji rectangles */}
      {SIGN_TOWERS.map((t, i) => (
        <div
          key={i}
          className="absolute top-0 flex flex-col items-center justify-start gap-2 pt-6"
          style={{
            left: t.x,
            width: t.width,
            height: t.height,
            background: "linear-gradient(180deg, rgba(255,40,48,0.14), rgba(255,40,48,0.02) 90%)",
            borderLeft: "1px solid rgba(255,40,48,0.25)",
            borderRight: "1px solid rgba(255,40,48,0.25)",
            boxShadow: "0 0 40px rgba(255,40,48,0.18), inset 0 0 20px rgba(255,40,48,0.08)",
          }}
        >
          {t.chars.map((c, j) => (
            <motion.span
              key={j}
              className="font-display text-lg font-black"
              style={{
                color: "#ff2830",
                textShadow: "0 0 8px #ff2830, 0 0 18px rgba(255,40,48,0.6)",
                writingMode: "vertical-rl",
              }}
              animate={reduce ? undefined : { opacity: [0.55, 1, 0.7, 1, 0.5] }}
              transition={{ duration: 2.4 + i * 0.5, delay: t.delay + j * 0.2, repeat: Infinity, ease: "easeInOut" }}
            >
              {c}
            </motion.span>
          ))}
        </div>
      ))}
      {/* Rain diagonal streaks */}
      {!reduce && (
        <div className="absolute inset-0">
          {RAIN.map((r, i) => (
            <motion.span
              key={i}
              className="absolute block"
              style={{
                left: r.x,
                top: "-10%",
                width: 1,
                height: r.height,
                background: "linear-gradient(180deg, transparent, rgba(62,232,255,0.55), transparent)",
                transform: "rotate(14deg)",
                opacity: r.opacity,
              }}
              animate={{ y: ["0vh", "115vh"] }}
              transition={{ duration: r.dur, delay: r.delay, repeat: Infinity, ease: "linear" }}
            />
          ))}
        </div>
      )}
      {/* Chrome puddle band at bottom of viewport */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40"
        style={{
          background: "linear-gradient(180deg, transparent, rgba(42,46,56,0.6) 40%, rgba(2,2,8,0.9))",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#020208]/40 via-transparent to-[#020208]/85" />
    </div>
  );
}

function KanjiGlow({ text, color }: { text: string; color: string }) {
  const reduce = useReducedMotion();
  return (
    <span className="inline-block">
      {Array.from(text).map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={reduce ? false : { opacity: 0, y: 14, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.05, ease: EASE }}
          style={{ textShadow: `0 0 18px ${color}, 0 0 36px ${color}66` }}
        >
          {ch === " " ? " " : ch}
        </motion.span>
      ))}
    </span>
  );
}

function PuddleReflection({ title, tagline, accent, reduce }: { title: string; tagline: string; accent: string; reduce: boolean }) {
  return (
    <div
      aria-hidden
      className="absolute bottom-0 left-0 right-0 h-40 overflow-hidden pointer-events-none"
      style={{
        transform: "scaleY(-1)",
        maskImage: "linear-gradient(180deg, transparent, black 60%)",
        WebkitMaskImage: "linear-gradient(180deg, transparent, black 60%)",
        opacity: 0.35,
        filter: "blur(2px)",
      }}
    >
      <div className="mx-auto max-w-6xl px-6 pt-8 text-center">
        <p className="mb-3 text-[10px] uppercase tracking-[0.8em]" style={{ color: accent }}>
          {tagline}
        </p>
        <div className="font-display text-[clamp(3rem,12vw,9rem)] font-black uppercase leading-[0.88] tracking-tight" style={{ color: "#f6e8ee" }}>
          {title}
        </div>
      </div>
      {!reduce &&
        PUDDLE_DROPS.map((p, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{ left: p.x, bottom: 8, width: 6, height: 6, border: "1px solid #3ee8ff88" }}
            animate={{ scale: [0, 3], opacity: [0.6, 0] }}
            transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeOut" }}
          />
        ))}
    </div>
  );
}

function StorefrontCard({ s, i, accent }: { s: SubEvent; i: number; accent: string }) {
  const reduce = useReducedMotion();
  const barColors = ["#ff2830", "#3ee8ff", "#f5cc45"];
  const bar = barColors[i % barColors.length];
  const kanjiPool = ["夜", "光", "東", "京", "街"];
  const kanji = kanjiPool[i % kanjiPool.length];
  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.6, delay: i * 0.07, ease: EASE }}
      whileHover={reduce ? undefined : { y: -3 }}
      className="relative flex overflow-hidden rounded-md border border-white/[0.06] bg-[#0a0e1a]/70 backdrop-blur-xl"
      style={{ boxShadow: `0 0 30px ${bar}18` }}
    >
      <div
        className="w-2 shrink-0"
        style={{ background: bar, boxShadow: `0 0 20px ${bar}` }}
      />
      <div className="flex-1 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-2">
              <span
                className="font-display text-3xl font-black leading-none"
                style={{ color: bar, textShadow: `0 0 14px ${bar}` }}
              >
                {kanji}
              </span>
              <h3 className="font-display text-lg uppercase tracking-tight text-[#f6e8ee]">{s.name}</h3>
            </div>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.35em] opacity-50">
              {String(s.order).padStart(2, "0")} · {[s.date, s.startTime].filter(Boolean).join(" / ")}
            </p>
          </div>
        </div>
        {s.venueName && (
          <p className="mt-3 font-mono text-xs uppercase tracking-[0.2em] opacity-60">@ {s.venueName}</p>
        )}
        {s.description && (
          <p className="mt-3 text-sm leading-relaxed opacity-65">{s.description}</p>
        )}
        {s.dressCode && (
          <p
            className="mt-4 inline-block rounded-sm px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em]"
            style={{ borderLeft: `2px solid ${accent}`, background: "rgba(255,255,255,0.03)" }}
          >
            {s.dressCode}
          </p>
        )}
      </div>
    </motion.article>
  );
}

export const MidnighttokyoTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || "#ff2830";
  const cyan = "#3ee8ff";
  const yellow = "#f5cc45";
  const tagline = event.tagline?.trim() || "Shibuya after midnight.";
  const invitationMessage =
    event.invitationMessage?.trim() ||
    "The crossing empties. The signs stay on. Rain finds the chrome and the night finds you.";
  const aboutStory = event.aboutStory?.trim() || "";
  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const hero =
    event.heroImageUrl ||
    "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1600&q=80";

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(heroP, [0, 1], [1, 0.92]);
  const heroTextY = useTransform(heroP, [0, 0.5], [0, -40]);
  const heroOpacity = useTransform(heroP, [0, 0.5], [1, 0]);

  const showStory = !event.hideStory;
  const showJourney = !event.hideEvents && subEvents.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  const sortedSubs = [...subEvents].sort((a, b) => a.order - b.order);

  return (
    <div
      className="relative min-h-screen overflow-x-clip bg-[#020208] font-sans text-[#f6e8ee] antialiased"
      style={{ "--accent": accent } as React.CSSProperties}
    >
      <TokyoField reduce={reduce} />
      <ScrollProgress color={accent} />

      {/* ─── 01. SHIBUYA CROSSING ─── */}
      <section
        ref={heroRef}
        className="relative min-h-[100svh] flex items-center justify-center overflow-hidden pb-24 sm:pb-28"
      >
        <motion.div style={reduce ? undefined : { scale: heroScale }} className="absolute inset-0">
          <HeroMedia
            imageSrc={hero}
            videoSrc={event.heroVideoUrl || undefined}
            alt={event.eventTitle}
            className="opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020208] via-[#020208]/50 to-[#020208]/10" />
          <div
            className="absolute inset-0"
            style={{ background: `radial-gradient(ellipse at 50% 40%, ${accent}18, transparent 60%)` }}
          />
        </motion.div>

        <motion.div
          style={reduce ? undefined : { y: heroTextY, opacity: heroOpacity }}
          className="relative z-10 text-center px-5"
        >
          <div className="mb-5 flex items-center justify-center gap-3">
            <span
              className="font-display text-2xl font-black"
              style={{ color: accent, textShadow: `0 0 18px ${accent}` }}
            >
              東京
            </span>
            <span className="h-px w-10" style={{ background: cyan, boxShadow: `0 0 8px ${cyan}` }} />
            <span
              className="font-mono text-[10px] uppercase tracking-[0.8em]"
              style={{ color: cyan, textShadow: `0 0 14px ${cyan}` }}
            >
              {tagline}
            </span>
            <span className="h-px w-10" style={{ background: cyan, boxShadow: `0 0 8px ${cyan}` }} />
            <span
              className="font-display text-2xl font-black"
              style={{ color: accent, textShadow: `0 0 18px ${accent}` }}
            >
              夜
            </span>
          </div>
          <h1 className="font-display text-[clamp(3rem,12vw,9rem)] font-black uppercase leading-[0.88] tracking-tight">
            {event.eventTitle.split(" ").map((w, i) => (
              <span key={i} className="block">
                <KanjiGlow text={w} color={accent} />
              </span>
            ))}
          </h1>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4 font-mono text-xs uppercase tracking-[0.4em]"
          >
            {event.mainDate && (
              <span className="opacity-75">
                {new Date(event.mainDate).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            )}
            {event.mainStartTime && <span style={{ color: accent }}>//</span>}
            {event.mainStartTime && <span className="opacity-75">{event.mainStartTime}</span>}
            {event.city && (
              <>
                <span style={{ color: accent }}>//</span>
                <span className="opacity-75">{event.city}</span>
              </>
            )}
          </motion.div>
        </motion.div>

        <PuddleReflection title={event.eventTitle} tagline={tagline} accent={accent} reduce={reduce} />
      </section>

      {/* ─── 02. THE STREET ─── */}
      {showStory && (
        <section className="relative mx-auto max-w-5xl px-6 py-24 sm:py-32">
          <div className="grid items-start gap-10 sm:grid-cols-[1fr_2fr]">
            <motion.div
              initial={reduce ? false : { opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.5em]" style={{ color: cyan }}>
                01 / The Street
              </p>
              <div
                className="mt-3 font-display text-6xl font-black leading-none"
                style={{ color: accent, textShadow: `0 0 20px ${accent}` }}
              >
                街
              </div>
            </motion.div>
            <motion.div
              initial={reduce ? false : { opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
            >
              <h2 className="font-display text-3xl uppercase leading-[1.1] tracking-tight sm:text-4xl">
                {invitationMessage}
              </h2>
              {aboutStory && (
                <p className="mt-6 text-base leading-relaxed opacity-65 sm:text-lg">{aboutStory}</p>
              )}
              <motion.div
                className="mt-8 h-px w-full"
                style={{ background: `linear-gradient(90deg, ${accent}, ${cyan}, transparent)` }}
                animate={reduce ? undefined : { opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2.4, repeat: Infinity }}
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* ─── 03. STOREFRONT SIGNS ─── */}
      {showJourney && (
        <section className="relative mx-auto max-w-5xl px-6 py-20 sm:py-28">
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-12 flex items-center justify-center gap-3"
          >
            <span className="font-display text-xl font-black" style={{ color: accent, textShadow: `0 0 12px ${accent}` }}>
              光
            </span>
            <p className="font-mono text-[10px] uppercase tracking-[0.5em]" style={{ color: cyan }}>
              02 / The Signs
            </p>
          </motion.div>
          <div className="grid gap-4 sm:grid-cols-2">
            {sortedSubs.map((s, i) => (
              <StorefrontCard key={s.order} s={s} i={i} accent={accent} />
            ))}
          </div>
        </section>
      )}

      {/* ─── 04. NEON GALLERY ─── */}
      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-10 text-center font-mono text-[10px] uppercase tracking-[0.5em]"
            style={{ color: cyan }}
          >
            03 / Reels · 記録
          </motion.p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {galleryItems.map((m, i) => (
              <motion.div
                key={`${m.fileName}-${i}`}
                initial={reduce ? false : { opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.04 }}
                className="group relative overflow-hidden rounded-md border border-white/[0.05]"
                style={{ boxShadow: `0 0 22px ${accent}12` }}
              >
                <img
                  src={m.publicUrl}
                  alt={m.caption ?? ""}
                  className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020208]/80 via-transparent to-transparent" />
                <div
                  className="absolute left-0 top-0 h-full w-1"
                  style={{ background: i % 2 ? cyan : accent, boxShadow: `0 0 12px ${i % 2 ? cyan : accent}` }}
                />
                {m.caption && (
                  <p className="absolute bottom-2 left-3 right-3 font-mono text-[10px] uppercase tracking-[0.25em] opacity-80">
                    {m.caption}
                  </p>
                )}
              </motion.div>
            ))}
            {editing && galleryItems.length === 0 && (
              <div className="col-span-full flex h-48 items-center justify-center rounded-md border border-dashed border-white/20 font-mono text-xs uppercase tracking-[0.3em] opacity-50">
                + Add photos
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── 05. VENUE / 現在営業中 ─── */}
      {showVenue && (
        <section className="relative mx-auto max-w-5xl px-6 py-20 sm:py-28">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.5em]" style={{ color: cyan }}>
                04 / The Spot
              </p>
              {event.venueName && (
                <h3 className="mt-2 font-display text-2xl uppercase tracking-tight">{event.venueName}</h3>
              )}
            </div>
            <motion.span
              animate={reduce ? undefined : { opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              className="rounded-sm px-3 py-1 font-display text-xs font-black"
              style={{
                background: yellow,
                color: "#020208",
                boxShadow: `0 0 18px ${yellow}88`,
              }}
            >
              現在営業中
            </motion.span>
          </div>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="overflow-hidden rounded-md border border-white/[0.06] bg-[#0a0e1a]/70 p-1 backdrop-blur-xl"
            style={{ boxShadow: `0 0 30px ${accent}14` }}
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

      {/* ─── 06. LAST TRAIN ─── */}
      <section className="relative px-6 py-28 text-center sm:py-40">
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: EASE }}
          className="mx-auto max-w-3xl"
        >
          <div className="mb-8 flex items-center justify-center gap-3">
            <span
              className="font-display text-3xl font-black"
              style={{ color: accent, textShadow: `0 0 20px ${accent}` }}
            >
              夜
            </span>
            <span className="h-px w-14" style={{ background: cyan, boxShadow: `0 0 8px ${cyan}` }} />
            <span
              className="font-display text-3xl font-black"
              style={{ color: accent, textShadow: `0 0 20px ${accent}` }}
            >
              光
            </span>
          </div>
          <h2 className="font-display text-[clamp(2.4rem,7.5vw,5.5rem)] font-black uppercase leading-[0.9] tracking-tight">
            <KanjiGlow text={event.eventTitle} color={accent} />
          </h2>
          {event.person1Name && (
            <p className="mt-4 font-mono text-sm uppercase tracking-[0.4em] opacity-70">
              {event.person1Name}
            </p>
          )}
          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <motion.div whileHover={reduce ? undefined : { scale: 1.03 }} className="mt-10 inline-block">
              <a
                href={event.rsvpLinkOrContact}
                target="_blank"
                rel="noreferrer"
                className="inline-block rounded-sm px-12 py-4 font-mono text-xs uppercase tracking-[0.4em] transition-all"
                style={{
                  background: accent,
                  color: "#020208",
                  boxShadow: `0 0 24px ${accent}66`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 0 44px ${accent}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = `0 0 24px ${accent}66`;
                }}
              >
                Catch the last train
              </a>
            </motion.div>
          )}
        </motion.div>
      </section>

      <footer className="border-t border-white/[0.05] py-8 text-center font-mono text-xs uppercase tracking-[0.3em] opacity-50">
        <p>
          {event.eventTitle}
          {event.person1Name ? ` · ${event.person1Name}` : ""} · 東京
        </p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default MidnighttokyoTemplate;
