"use client";

import { useMemo, useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { HeroMedia } from "@/components/ui/HeroMedia";
import { MapEmbed } from "@/components/ui/MapEmbed";
import { MusicToggle } from "@/components/ui/MusicToggle";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { useEditMode } from "@/components/edit/EditContext";
import type { TemplateComponent, SubEvent } from "@/lib/types";

const EASE = [0.22, 1, 0.36, 1] as const;
const TEAL = "#3a8a92";
const DEEP = "#1e4e5a";
const SAND = "#f0e6d0";
const PINK = "#e8a0b0";
const INK = "#22333a";

const LOTUSES = [
  { left: "6%", top: "14%", size: 44, dur: 11, delay: 0 },
  { left: "88%", top: "22%", size: 34, dur: 13, delay: 1.4 },
  { left: "4%", top: "44%", size: 30, dur: 12, delay: 0.8 },
  { left: "91%", top: "52%", size: 42, dur: 14, delay: 2.2 },
  { left: "10%", top: "70%", size: 36, dur: 10, delay: 1.1 },
  { left: "85%", top: "78%", size: 28, dur: 15, delay: 0.4 },
  { left: "48%", top: "88%", size: 40, dur: 12, delay: 1.8 },
];

function Lotus({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} aria-hidden>
      {[-50, -25, 0, 25, 50].map((deg, i) => (
        <path
          key={deg}
          d="M20 6 C26 14 26 23 20 28 C14 23 14 14 20 6"
          transform={`rotate(${deg} 20 28)`}
          fill={i === 2 ? PINK : "#f2b9c4"}
          opacity={i === 2 ? 0.95 : 0.7}
        />
      ))}
      <circle cx="20" cy="27" r="3" fill="#f8d8de" />
    </svg>
  );
}

function RiverField({ reduce, progress }: { reduce: boolean; progress: MotionValue<number> }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <motion.path
          d="M10 0 C16 12 4 24 14 36 C24 46 42 50 50 58"
          fill="none" stroke={TEAL} strokeWidth={7} strokeLinecap="round"
          vectorEffect="non-scaling-stroke" opacity={0.3}
          style={reduce ? { pathLength: 1 } : { pathLength: progress }}
        />
        <motion.path
          d="M90 0 C84 12 96 24 86 36 C76 46 58 50 50 58"
          fill="none" stroke={DEEP} strokeWidth={7} strokeLinecap="round"
          vectorEffect="non-scaling-stroke" opacity={0.3}
          style={reduce ? { pathLength: 1 } : { pathLength: progress }}
        />
        <motion.path
          d="M50 58 C50 70 44 82 50 92 C53 97 50 99 50 100"
          fill="none" stroke={TEAL} strokeWidth={16} strokeLinecap="round"
          vectorEffect="non-scaling-stroke" opacity={0.22}
          style={reduce ? { pathLength: 1 } : { pathLength: progress }}
        />
      </svg>
      {LOTUSES.map((l, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: l.left, top: l.top }}
          animate={reduce ? undefined : { y: [0, -10, 0], rotate: [0, 8, -6, 0] }}
          transition={{ duration: l.dur, delay: l.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          <Lotus size={l.size} />
        </motion.div>
      ))}
    </div>
  );
}

function WaveLine({ color, className }: { color: string; className?: string }) {
  return (
    <svg viewBox="0 0 120 10" className={className} aria-hidden preserveAspectRatio="none">
      <path d="M0 5 Q10 0 20 5 T40 5 T60 5 T80 5 T100 5 T120 5" fill="none" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

function Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function ConfluenceTimeline({ items }: { items: SubEvent[] }) {
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <div className="mx-auto max-w-3xl px-6">
      <div className="relative space-y-8">
        <div aria-hidden className="absolute left-4 top-2 bottom-2 w-px sm:left-1/2" style={{ background: `linear-gradient(180deg, ${TEAL}, ${DEEP})`, opacity: 0.35 }} />
        {sorted.map((s, i) => (
          <Reveal key={s.order} delay={i * 0.08} className={`relative pl-12 sm:w-1/2 sm:pl-0 ${i % 2 === 0 ? "sm:pr-12 sm:text-right" : "sm:ml-auto sm:pl-12"}`}>
            <span aria-hidden className="absolute left-2.5 top-2 h-3 w-3 rounded-full sm:left-auto" style={{ background: PINK, boxShadow: `0 0 0 4px ${SAND}, 0 0 0 5px ${TEAL}55`, [i % 2 === 0 ? "right" : "left"]: "-6px" } as React.CSSProperties} />
            <div className="rounded-2xl border bg-white/60 p-6 backdrop-blur-sm" style={{ borderColor: `${TEAL}33` }}>
              <p className="text-[11px] uppercase tracking-[0.3em]" style={{ color: TEAL }}>
                {[s.date, s.startTime].filter(Boolean).join(" · ")}
              </p>
              <h3 className="font-display mt-1 text-2xl" style={{ color: INK }}>{s.name}</h3>
              {s.venueName && <p className="mt-1 text-sm" style={{ color: `${INK}aa` }}>{s.venueName}</p>}
              {s.description && <p className="mt-2 text-sm leading-relaxed" style={{ color: `${INK}99` }}>{s.description}</p>}
              {s.dressCode && (
                <p className="mt-3 inline-block rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em]" style={{ background: `${PINK}33`, color: INK }}>
                  {s.dressCode}
                </p>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export const TworiversTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || TEAL;
  const tagline = event.tagline?.trim() || "Two rivers, one ocean";
  const invitationMessage = event.invitationMessage?.trim() || "Two rivers rose in different hills, wandered their own valleys, and found the same sea. Come stand with us at the confluence.";
  const aboutStory = event.aboutStory?.trim() || "Every river carries the story of where it began. Ours met slowly — a bend here, a season there — until the currents ran side by side and there was no telling one from the other.";
  const hero = event.heroImageUrl || "https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=1600&q=80";
  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);

  const pageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: pageRef, offset: ["start start", "end end"] });
  const riverDraw = useTransform(scrollYProgress, [0, 0.85], [0.12, 1]);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroP, [0, 1], [0, -60]);
  const dividerOpacity = useTransform(heroP, [0, 0.4], [1, 0]);
  const waveOpacity = useTransform(heroP, [0, 0.4], [0.4, 1]);

  const showStory = !event.hideStory;
  const showEvents = !event.hideEvents && subEvents.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);
  const twoNames = !!event.person2Name?.trim();

  return (
    <div ref={pageRef} className="relative min-h-screen overflow-x-clip font-sans antialiased" style={{ background: SAND, color: INK, "--accent": accent } as React.CSSProperties}>
      <RiverField reduce={reduce} progress={riverDraw} />
      <ScrollProgress color={accent} />

      <section ref={heroRef} className="relative flex min-h-[100svh] flex-col items-center justify-center px-6 py-24 text-center">
        <div aria-hidden className="absolute inset-0 opacity-[0.14]">
          <HeroMedia imageSrc={hero} videoSrc={event.heroVideoUrl || undefined} alt={event.eventTitle} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${SAND}66, ${SAND})` }} />
        </div>
        <motion.div style={reduce ? undefined : { y: heroY }} className="relative z-10">
          <motion.p initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="text-[11px] uppercase tracking-[0.5em]" style={{ color: accent }}>
            {tagline}
          </motion.p>
          <div className={`mt-8 flex items-center justify-center gap-5 sm:gap-10 ${twoNames ? "" : "flex-col"}`}>
            <motion.h1 initial={reduce ? false : { opacity: 0, x: twoNames ? -34 : 0, y: twoNames ? 0 : 20 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ duration: 1.1, ease: EASE }} className="font-display text-[clamp(2.4rem,7vw,5.5rem)] leading-[1.05]" style={{ color: DEEP }}>
              {event.person1Name || event.eventTitle}
            </motion.h1>
            {twoNames && (
              <div className="relative flex h-[clamp(5rem,14vw,10rem)] w-8 items-center justify-center">
                <motion.div className="h-full w-px" style={{ background: `linear-gradient(180deg, transparent, ${TEAL}, transparent)`, opacity: reduce ? 1 : dividerOpacity }} />
                <motion.div className="absolute inset-x-[-24px] top-1/2 -translate-y-1/2" style={{ opacity: reduce ? 0.6 : waveOpacity }}>
                  <WaveLine color={TEAL} className="h-4 w-full" />
                </motion.div>
              </div>
            )}
            {twoNames && (
              <motion.h1 initial={reduce ? false : { opacity: 0, x: 34 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.1, ease: EASE }} className="font-display text-[clamp(2.4rem,7vw,5.5rem)] leading-[1.05]" style={{ color: TEAL }}>
                {event.person2Name}
              </motion.h1>
            )}
          </div>
          <motion.div initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.9 }} className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs uppercase tracking-[0.35em]" style={{ color: `${INK}bb` }}>
            {event.mainDate && <span>{new Date(event.mainDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</span>}
            {event.city && <><span style={{ color: PINK }}>❀</span><span>{event.city}</span></>}
          </motion.div>
        </motion.div>
      </section>

      {showStory && (
        <section className="relative mx-auto max-w-3xl px-6 py-24 text-center sm:py-32">
          <Reveal>
            <WaveLine color={PINK} className="mx-auto mb-8 h-3 w-28" />
            <h2 className="font-display text-3xl leading-snug sm:text-4xl" style={{ color: DEEP }}>{invitationMessage}</h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed sm:text-lg" style={{ color: `${INK}aa` }}>{aboutStory}</p>
          </Reveal>
        </section>
      )}

      {showEvents && (
        <section className="relative py-20 sm:py-28">
          <Reveal className="mb-14 text-center">
            <p className="text-[11px] uppercase tracking-[0.5em]" style={{ color: accent }}>At the confluence</p>
            <h2 className="font-display mt-3 text-3xl sm:text-4xl" style={{ color: DEEP }}>Where the waters meet</h2>
          </Reveal>
          <ConfluenceTimeline items={subEvents} />
        </section>
      )}

      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <Reveal className="mb-10 text-center">
            <p className="text-[11px] uppercase tracking-[0.5em]" style={{ color: accent }}>Along the banks</p>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((m, i) => (
              <Reveal key={`${m.fileName}-${i}`} delay={(i % 3) * 0.08} className="group overflow-hidden rounded-2xl border" >
                <img src={m.publicUrl} alt={m.caption ?? ""} loading="lazy" className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </Reveal>
            ))}
            {editing && galleryItems.length === 0 && (
              <div className="col-span-full flex h-48 items-center justify-center rounded-2xl border border-dashed text-sm" style={{ borderColor: `${TEAL}66`, color: `${INK}88` }}>
                + Add photos
              </div>
            )}
          </div>
        </section>
      )}

      {showVenue && (
        <section className="relative mx-auto max-w-4xl px-6 py-20 sm:py-28">
          <Reveal className="mb-8 text-center">
            <p className="text-[11px] uppercase tracking-[0.5em]" style={{ color: accent }}>The meeting point</p>
            {event.venueName && <h2 className="font-display mt-3 text-3xl" style={{ color: DEEP }}>{event.venueName}</h2>}
          </Reveal>
          <Reveal delay={0.1} className="overflow-hidden rounded-2xl border bg-white/60 p-1 backdrop-blur-sm">
            <MapEmbed latitude={event.latitude} longitude={event.longitude} venueName={event.venueName} venueAddress={event.venueAddress} mapLink={event.mapLink} />
          </Reveal>
        </section>
      )}

      <section className="relative mt-16 overflow-hidden px-6 py-28 text-center sm:py-36" style={{ background: `linear-gradient(180deg, ${TEAL}, ${DEEP})` }}>
        <div aria-hidden className="absolute inset-x-0 top-0">
          {[0, 1, 2].map((i) => (
            <motion.div key={i} className="mb-2" style={{ opacity: 0.25 - i * 0.07 }} animate={reduce ? undefined : { x: [i % 2 === 0 ? -30 : 30, i % 2 === 0 ? 30 : -30] }} transition={{ duration: 8 + i * 3, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}>
              <WaveLine color={SAND} className="h-4 w-full" />
            </motion.div>
          ))}
        </div>
        <Reveal className="relative mx-auto max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.5em]" style={{ color: PINK }}>The ocean</p>
          <h2 className="font-display mt-6 text-[clamp(2rem,6vw,4rem)] leading-tight" style={{ color: SAND }}>
            {twoNames ? `${event.person1Name} & ${event.person2Name}` : event.eventTitle}
          </h2>
          <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed" style={{ color: `${SAND}cc` }}>
            Where the two rivers become one water, we would love for you to be there.
          </p>
          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <motion.a whileHover={reduce ? undefined : { scale: 1.04, y: -2 }} href={event.rsvpLinkOrContact} target="_blank" rel="noreferrer" className="mt-10 inline-block rounded-full px-12 py-4 text-xs uppercase tracking-[0.35em] shadow-lg" style={{ background: SAND, color: DEEP }}>
              Join us at the shore
            </motion.a>
          )}
        </Reveal>
      </section>

      <footer className="relative py-8 text-center text-xs" style={{ background: DEEP, color: `${SAND}88` }}>
        <p>{event.eventTitle}{twoNames ? ` · ${event.person1Name} & ${event.person2Name}` : event.person1Name ? ` · ${event.person1Name}` : ""}</p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default TworiversTemplate;
