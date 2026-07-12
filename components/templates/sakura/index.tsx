"use client";

import { useMemo, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { HeroMedia } from "@/components/ui/HeroMedia";
import { MapEmbed } from "@/components/ui/MapEmbed";
import { MusicToggle } from "@/components/ui/MusicToggle";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { useEditMode } from "@/components/edit/EditContext";
import type { TemplateComponent, SubEvent } from "@/lib/types";

const EASE = [0.16, 1, 0.3, 1] as const;
const PAPER = "#fdf6f0";
const PLUM = "#4a2d3a";
const BRANCH = "#7a5a48";
const LEAF = "#8fb387";

const PETALS = Array.from({ length: 26 }, (_, i) => ({
  x: `${(i * 37 + 11) % 100}%`,
  delay: (i % 13) * 0.9,
  dur: 9 + (i % 5) * 2.5,
  size: 8 + (i % 4) * 3,
  drift: ((i % 7) - 3) * 28,
  spin: 180 + (i % 4) * 120,
}));

const CLUSTERS = [
  { cx: 62, cy: 58, r: 13 }, { cx: 118, cy: 92, r: 16 }, { cx: 168, cy: 60, r: 12 },
  { cx: 205, cy: 118, r: 15 }, { cx: 138, cy: 148, r: 11 }, { cx: 248, cy: 78, r: 13 },
  { cx: 92, cy: 30, r: 10 },
];

function PetalField({ reduce, accent }: { reduce: boolean; accent: string }) {
  if (reduce) return null;
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
      {PETALS.map((p, i) => (
        <motion.svg
          key={i}
          viewBox="0 0 12 12"
          className="absolute"
          style={{ left: p.x, top: "-4%", width: p.size, height: p.size }}
          animate={{ y: ["0vh", "110vh"], x: [0, p.drift, p.drift / 2], rotate: [0, p.spin], opacity: [0, 0.85, 0.7, 0] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "linear" }}
        >
          <ellipse cx="6" cy="6" rx="5" ry="3" fill={accent} opacity="0.75" transform="rotate(35 6 6)" />
        </motion.svg>
      ))}
    </div>
  );
}

function CherryBranch({ reduce, accent }: { reduce: boolean; accent: string }) {
  return (
    <svg aria-hidden viewBox="0 0 300 180" className="pointer-events-none absolute left-0 top-0 z-10 w-[60vw] max-w-[420px] opacity-90">
      <path d="M-10 8 C 60 30, 110 55, 160 70 M60 32 C 85 20, 100 24, 120 18 M120 55 C 150 90, 190 110, 215 122 M160 70 C 200 72, 235 80, 258 76" stroke={BRANCH} strokeWidth="5" strokeLinecap="round" fill="none" />
      {CLUSTERS.map((c, i) => (
        <motion.g
          key={i}
          initial={reduce ? false : { scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: reduce ? 0 : 0.4 + i * 0.22, ease: EASE }}
          style={{ transformOrigin: `${c.cx}px ${c.cy}px` }}
        >
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse
              key={a}
              cx={c.cx + Math.cos((a * Math.PI) / 180) * c.r * 0.55}
              cy={c.cy + Math.sin((a * Math.PI) / 180) * c.r * 0.55}
              rx={c.r * 0.5}
              ry={c.r * 0.38}
              fill={accent}
              opacity="0.85"
              transform={`rotate(${a} ${c.cx} ${c.cy})`}
            />
          ))}
          <circle cx={c.cx} cy={c.cy} r={c.r * 0.22} fill="#fff" opacity="0.9" />
        </motion.g>
      ))}
    </svg>
  );
}

function VerticalLabel({ text }: { text: string }) {
  return (
    <p
      className="mx-auto mb-8 w-fit text-[11px] uppercase tracking-[0.5em]"
      style={{ writingMode: "vertical-rl", color: BRANCH, minHeight: 90 }}
    >
      {text}
    </p>
  );
}

function SteppingStones({ items, accent, reduce }: { items: SubEvent[]; accent: string; reduce: boolean }) {
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <div className="relative mx-auto max-w-3xl px-6">
      <svg aria-hidden className="absolute inset-x-0 top-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 400">
        <path d="M0 60 Q 25 40, 50 55 T 100 50 M0 200 Q 25 180, 50 195 T 100 190 M0 340 Q 25 320, 50 335 T 100 330" stroke={accent} strokeWidth="0.4" fill="none" opacity="0.35" />
        <path d="M50 0 C 90 60, 10 130, 50 200 C 90 270, 10 340, 50 400" stroke={BRANCH} strokeWidth="0.6" strokeDasharray="2 3" fill="none" opacity="0.5" />
      </svg>
      <div className="relative space-y-10">
        {sorted.map((s, i) => (
          <motion.article
            key={s.order}
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
            className={`relative w-full max-w-md rounded-[1.5rem] border p-7 shadow-sm backdrop-blur-sm ${i % 2 === 0 ? "mr-auto" : "ml-auto"}`}
            style={{ background: "rgba(255,255,255,0.75)", borderColor: `${accent}55` }}
          >
            <span
              className="absolute -top-3 left-7 flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white shadow"
              style={{ background: accent }}
            >
              {s.order}
            </span>
            <p className="text-[10px] uppercase tracking-[0.3em]" style={{ color: BRANCH }}>
              {[s.date, s.startTime].filter(Boolean).join(" · ")}
            </p>
            <h3 className="mt-2 font-serif text-2xl tracking-wide" style={{ color: PLUM }}>{s.name}</h3>
            {s.venueName && <p className="mt-1 text-sm opacity-70">{s.venueName}</p>}
            {s.description && <p className="mt-2 text-sm leading-relaxed opacity-70">{s.description}</p>}
            {s.dressCode && (
              <p className="mt-3 inline-block rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em]" style={{ background: `${accent}22`, color: PLUM }}>
                {s.dressCode}
              </p>
            )}
          </motion.article>
        ))}
      </div>
    </div>
  );
}

export const SakuraTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || "#f4b8c8";
  const tagline = event.tagline?.trim() || "Beneath a thousand blossoms";
  const invitationMessage = event.invitationMessage?.trim() || "As petals drift on the spring wind, two paths become one. We would be honored to have you walk this garden with us.";
  const aboutStory = event.aboutStory?.trim() || "Every spring the blossoms return, and every year they remind us: the most beautiful things are worth waiting for. Our story bloomed the same way — slowly, then all at once.";
  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const hero = event.heroImageUrl || "https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&w=1600&q=80";

  const rootRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const seasonBg = useTransform(scrollYProgress, [0, 0.7, 1], [PAPER, PAPER, "#f2f6ec"]);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroP, [0, 1], [0, 80]);
  const heroOpacity = useTransform(heroP, [0, 0.6], [1, 0]);

  const showStory = !event.hideStory;
  const showJourney = !event.hideEvents && subEvents.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  return (
    <motion.div
      ref={rootRef}
      className="relative min-h-screen overflow-x-clip font-serif antialiased"
      style={{ "--accent": accent, color: PLUM, background: reduce ? PAPER : seasonBg } as React.CSSProperties}
    >
      <ScrollProgress color={accent} />
      <PetalField reduce={reduce} accent={accent} />

      <section ref={heroRef} className="relative flex h-[100svh] min-h-[620px] items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <HeroMedia imageSrc={hero} videoSrc={event.heroVideoUrl || undefined} alt={event.eventTitle} className="opacity-60" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${PAPER}55 0%, ${PAPER}22 40%, ${PAPER} 96%)` }} />
        </div>
        <CherryBranch reduce={reduce} accent={accent} />
        <motion.div style={reduce ? undefined : { y: heroY, opacity: heroOpacity }} className="relative z-20 px-6 text-center">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
            className="mb-6 text-xs uppercase tracking-[0.6em]"
            style={{ color: BRANCH }}
          >
            {tagline}
          </motion.p>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.5, ease: EASE }}
            className="text-[clamp(2.6rem,9vw,6.5rem)] leading-[1.05] tracking-[0.08em]"
            style={{ color: PLUM }}
          >
            {event.eventTitle}
          </motion.h1>
          <motion.div initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.9 }}>
            {(event.person1Name || event.person2Name) && (
              <p className="mt-5 text-lg tracking-[0.3em]">{[event.person1Name, event.person2Name].filter(Boolean).join("  ・  ")}</p>
            )}
            {event.mainDate && (
              <p className="mt-8 text-sm uppercase tracking-[0.4em]" style={{ color: BRANCH }}>
                {new Date(event.mainDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                {event.city ? ` · ${event.city}` : ""}
              </p>
            )}
          </motion.div>
        </motion.div>
      </section>

      {showStory && (
        <section className="relative mx-auto max-w-3xl px-6 py-24 text-center sm:py-32">
          <VerticalLabel text="Our story" />
          <motion.h2
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE }}
            className="text-2xl leading-relaxed tracking-wide sm:text-3xl"
          >
            {invitationMessage}
          </motion.h2>
          <motion.div initial={reduce ? false : { scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.3, ease: EASE }} className="mx-auto my-8 h-px w-24" style={{ background: accent }} />
          <motion.p initial={reduce ? false : { opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.4 }} className="text-base leading-loose opacity-75 sm:text-lg">
            {aboutStory}
          </motion.p>
        </section>
      )}

      {showJourney && (
        <section className="relative py-20 sm:py-28">
          <VerticalLabel text="Stepping stones" />
          <SteppingStones items={subEvents} accent={accent} reduce={reduce} />
        </section>
      )}

      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <VerticalLabel text="Lantern memories" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((m, i) => (
              <motion.figure
                key={`${m.fileName}-${i}`}
                initial={reduce ? false : { opacity: 0, y: 30, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-8% 0px" }}
                transition={{ duration: 0.7, delay: (i % 3) * 0.12, ease: EASE }}
                className="group relative overflow-hidden rounded-t-[3rem] rounded-b-xl border shadow-sm"
                style={{ borderColor: `${accent}66`, background: "rgba(255,255,255,0.7)" }}
              >
                <div aria-hidden className="mx-auto mt-3 h-2 w-10 rounded-full" style={{ background: BRANCH, opacity: 0.5 }} />
                <img
                  src={m.publicUrl}
                  alt={m.caption ?? ""}
                  className="mt-3 aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                {m.caption && (
                  <figcaption className="px-4 py-3 text-center text-xs tracking-[0.2em] opacity-70">{m.caption}</figcaption>
                )}
              </motion.figure>
            ))}
            {editing && galleryItems.length === 0 && (
              <div className="col-span-full flex h-48 items-center justify-center rounded-2xl border border-dashed text-sm opacity-60" style={{ borderColor: BRANCH }}>
                + Add photos
              </div>
            )}
          </div>
        </section>
      )}

      {showVenue && (
        <section className="relative mx-auto max-w-4xl px-6 py-20 sm:py-28">
          <VerticalLabel text="The garden" />
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="overflow-hidden rounded-3xl border p-1 shadow-sm"
            style={{ borderColor: `${accent}66`, background: "rgba(255,255,255,0.7)" }}
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

      <section className="relative px-6 py-24 text-center sm:py-36">
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE }}
          className="mx-auto max-w-2xl"
        >
          <p className="text-xs uppercase tracking-[0.5em]" style={{ color: LEAF }}>Spring turns to summer</p>
          <h2 className="mt-4 text-3xl leading-snug tracking-wide sm:text-4xl">{event.eventTitle}</h2>
          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <motion.a
              whileHover={reduce ? undefined : { scale: 1.04, y: -2 }}
              href={event.rsvpLinkOrContact}
              target="_blank"
              rel="noreferrer"
              className="mt-10 inline-block rounded-full px-12 py-4 text-sm uppercase tracking-[0.3em] text-white shadow-md"
              style={{ background: `linear-gradient(120deg, ${accent}, ${LEAF})` }}
            >
              Join us in bloom
            </motion.a>
          )}
        </motion.div>
      </section>

      <footer className="border-t py-8 text-center text-xs opacity-60" style={{ borderColor: `${LEAF}44` }}>
        <p>{event.eventTitle}{event.person1Name && event.person2Name ? ` · ${event.person1Name} & ${event.person2Name}` : ""}</p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </motion.div>
  );
};

export default SakuraTemplate;
