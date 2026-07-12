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

const ERAS = [
  { key: "PRIMITIVE", color: "#e8dcc4", label: "Fire & Stone" },
  { key: "INDUSTRIAL", color: "#3a4550", label: "Steam & Steel" },
  { key: "DIGITAL", color: "#3a9ce8", label: "Silicon & Signal" },
  { key: "AI", color: "#a054d8", label: "Mind & Model" },
  { key: "TODAY", color: "#f4ecdd", label: "The Destination" },
] as const;

const ERA_ICONS: Record<string, React.ReactNode> = {
  primitive: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M4 20 L14 6 L20 12 L10 20 Z" />
      <path d="M14 6 L16 4" />
    </svg>
  ),
  industrial: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 4 v3 M12 17 v3 M4 12 h3 M17 12 h3 M6.3 6.3 l2 2 M15.7 15.7 l2 2 M6.3 17.7 l2-2 M15.7 8.3 l2-2" />
    </svg>
  ),
  digital: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <rect x="6" y="6" width="12" height="12" rx="1" />
      <path d="M9 3 v3 M12 3 v3 M15 3 v3 M9 18 v3 M12 18 v3 M15 18 v3 M3 9 h3 M3 12 h3 M3 15 h3 M18 9 h3 M18 12 h3 M18 15 h3" />
    </svg>
  ),
  ai: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <circle cx="12" cy="12" r="2" />
      <circle cx="5" cy="6" r="1.5" />
      <circle cx="5" cy="18" r="1.5" />
      <circle cx="19" cy="6" r="1.5" />
      <circle cx="19" cy="18" r="1.5" />
      <path d="M6.4 6.9 L10.5 11.2 M6.4 17.1 L10.5 12.8 M17.6 6.9 L13.5 11.2 M17.6 17.1 L13.5 12.8" />
    </svg>
  ),
  today: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
      <path d="M12 3 L19 10 L12 21 L5 10 Z" />
      <path d="M5 10 h14 M12 3 v18" />
    </svg>
  ),
};

function EvolutionField({
  reduce,
  colorProgress,
}: {
  reduce: boolean;
  colorProgress: ReturnType<typeof useTransform<number, string>>;
}) {
  return (
    <motion.div
      aria-hidden
      className="fixed inset-0 -z-10 overflow-hidden"
      style={{ background: reduce ? "#1a1e2c" : colorProgress }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.05),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(0,0,0,0.4),transparent_60%)]" />
      <svg className="absolute inset-0 h-full w-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
        <filter id="evo-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" />
        </filter>
        <rect width="100%" height="100%" filter="url(#evo-noise)" />
      </svg>
    </motion.div>
  );
}

function EvolutionTimelineBar({ accent }: { accent: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const dash = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <div ref={ref} className="relative mx-auto mt-16 max-w-5xl px-4">
      <svg viewBox="0 0 1000 120" className="w-full">
        <defs>
          <linearGradient id="evo-timeline" x1="0" x2="1" y1="0" y2="0">
            {ERAS.map((e, i) => (
              <stop key={e.key} offset={`${(i / (ERAS.length - 1)) * 100}%`} stopColor={e.color} />
            ))}
          </linearGradient>
        </defs>
        <line x1="60" y1="60" x2="940" y2="60" stroke="#f4ecdd" strokeOpacity="0.12" strokeWidth="1" />
        <motion.line
          x1="60"
          y1="60"
          x2="940"
          y2="60"
          stroke="url(#evo-timeline)"
          strokeWidth="2"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={reduce ? 0 : dash}
        />
        {ERAS.map((e, i) => {
          const x = 60 + (880 * i) / (ERAS.length - 1);
          return (
            <g key={e.key}>
              <motion.circle
                cx={x}
                cy={60}
                r={8}
                fill={e.color}
                initial={reduce ? undefined : { scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12, ease: EASE }}
                style={{ transformOrigin: `${x}px 60px`, filter: `drop-shadow(0 0 10px ${e.color})` }}
              />
              <text
                x={x}
                y={30}
                textAnchor="middle"
                fill="#f4ecdd"
                fontSize="10"
                fontFamily="ui-monospace, monospace"
                letterSpacing="3"
                opacity={0.6}
              >
                0{i + 1}
              </text>
              <text
                x={x}
                y={88}
                textAnchor="middle"
                fill={e.color}
                fontSize="11"
                fontFamily="ui-monospace, monospace"
                letterSpacing="2"
                fontWeight="700"
              >
                {e.key}
              </text>
              <text
                x={x}
                y={104}
                textAnchor="middle"
                fill="#f4ecdd"
                fontSize="9"
                opacity={0.45}
              >
                {e.label}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="pointer-events-none absolute inset-x-0 -bottom-6 mx-auto h-6 max-w-5xl">
        <div
          className="mx-auto h-full w-1/2 opacity-40"
          style={{ background: `radial-gradient(ellipse at center, ${accent}, transparent 70%)`, filter: "blur(18px)" }}
        />
      </div>
    </div>
  );
}

function EraCard({ item, index, accent }: { item: SubEvent; index: number; accent: string }) {
  const reduce = useReducedMotion();
  const era = ERAS[index % ERAS.length];
  const iconKey = ["primitive", "industrial", "digital", "ai", "today"][index % 5];
  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 32, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: EASE }}
      className="group relative overflow-hidden rounded-xl border border-white/[0.06] bg-[#0f1220]/60 p-6 backdrop-blur-xl"
      style={{ boxShadow: `inset 0 1px 0 rgba(255,255,255,0.04), 0 20px 60px -30px ${era.color}` }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full opacity-30"
        style={{ background: `radial-gradient(circle, ${era.color}, transparent 65%)`, filter: "blur(30px)" }}
      />
      <div className="relative flex items-center gap-3">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-md border"
          style={{ borderColor: `${era.color}55`, color: era.color, background: `${era.color}10` }}
        >
          <span className="block h-5 w-5">{ERA_ICONS[iconKey]}</span>
        </span>
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] opacity-60" style={{ color: era.color }}>
            Era {String(index + 1).padStart(2, "0")} &middot; {era.key}
          </p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.25em] opacity-40">
            {[item.date, item.startTime].filter(Boolean).join(" · ")}
          </p>
        </div>
      </div>
      <h3 className="mt-5 font-display text-xl font-black uppercase leading-tight tracking-tight">{item.name}</h3>
      {item.venueName && <p className="mt-1 text-sm opacity-60">@ {item.venueName}</p>}
      {item.description && <p className="mt-3 text-sm leading-relaxed opacity-65">{item.description}</p>}
      {item.dressCode && (
        <p
          className="mt-4 inline-block rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em]"
          style={{ borderColor: `${accent}44`, color: accent }}
        >
          {item.dressCode}
        </p>
      )}
    </motion.article>
  );
}

export const EvolutionTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || "#a054d8";
  const tagline = event.tagline?.trim() || "The evolution ends here.";
  const invitationMessage =
    event.invitationMessage?.trim() ||
    "From fire and flint to circuits and code, every leap led here. Witness the next.";
  const aboutStory =
    event.aboutStory?.trim() ||
    "Five eras. One arc. Progress is not accidental — it is engineered, iterated, and refined. Each generation of tools rewrote what was possible, and each rewrote what came next. Tonight, we mark the point where the arc bends again.";
  const hero =
    event.heroImageUrl ||
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80";

  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const sortedSubEvents = useMemo(() => [...subEvents].sort((a, b) => a.order - b.order), [subEvents]);

  const showStory = !event.hideStory;
  const showEvents = !event.hideEvents && sortedSubEvents.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  const rootRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: rootRef, offset: ["start start", "end end"] });
  const bgColor = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    ["#e8dcc4", "#3a4550", "#3a9ce8", "#a054d8", "#1a1e2c"],
  );

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(heroP, [0, 1], [1, 0.94]);
  const heroTextY = useTransform(heroP, [0, 0.6], [0, -60]);
  const heroOpacity = useTransform(heroP, [0, 0.7], [1, 0]);

  return (
    <div
      ref={rootRef}
      className="relative min-h-screen overflow-x-clip font-sans text-[#f4ecdd] antialiased"
      style={{ "--accent": accent, background: "#1a1e2c" } as React.CSSProperties}
    >
      <EvolutionField reduce={reduce} colorProgress={bgColor} />
      <ScrollProgress color={accent} />

      {/* 01. HERO — evolution begins */}
      <section
        ref={heroRef}
        className="relative min-h-[100svh] flex items-center justify-center overflow-hidden"
      >
        <motion.div style={reduce ? undefined : { scale: heroScale }} className="absolute inset-0">
          <HeroMedia
            imageSrc={hero}
            videoSrc={event.heroVideoUrl || undefined}
            alt={event.eventTitle}
            className="opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1a1e2c]/40 to-[#1a1e2c]" />
        </motion.div>

        <motion.div
          style={reduce ? undefined : { y: heroTextY, opacity: heroOpacity }}
          className="relative z-10 mx-auto max-w-5xl px-6 pb-24 sm:pb-28 text-center"
        >
          <motion.p
            initial={reduce ? false : { opacity: 0, letterSpacing: "0.2em" }}
            animate={{ opacity: 1, letterSpacing: "0.8em" }}
            transition={{ duration: 1.4, ease: EASE }}
            className="mb-8 font-mono text-[10px] uppercase"
            style={{ color: accent, textShadow: `0 0 24px ${accent}` }}
          >
            {tagline}
          </motion.p>
          <h1 className="font-display text-[clamp(2.75rem,10vw,8rem)] font-black uppercase leading-[0.9] tracking-tight">
            {event.eventTitle.split(" ").map((word, i) => (
              <motion.span
                key={i}
                initial={reduce ? false : { opacity: 0, y: 40, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.9, delay: 0.3 + i * 0.12, ease: EASE }}
                className="block"
              >
                {word}
              </motion.span>
            ))}
          </h1>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-[0.35em] opacity-75"
          >
            {event.mainDate && (
              <span>
                {new Date(event.mainDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            )}
            {event.mainStartTime && <span aria-hidden>&mdash;</span>}
            {event.mainStartTime && <span>{event.mainStartTime}</span>}
            {event.city && <span aria-hidden>&mdash;</span>}
            {event.city && <span>{event.city}</span>}
          </motion.div>
        </motion.div>
      </section>

      {/* 02. STORY — evolution timeline */}
      {showStory && (
        <section className="relative mx-auto max-w-6xl px-6 py-28 sm:py-36">
          <div className="grid items-start gap-12 sm:grid-cols-12">
            <motion.div
              initial={reduce ? false : { opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: EASE }}
              className="sm:col-span-5"
            >
              <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.5em]" style={{ color: accent }}>
                The Arc &middot; 05 Eras
              </p>
              <h2 className="font-display text-3xl font-black uppercase leading-[1.05] tracking-tight sm:text-4xl">
                {invitationMessage}
              </h2>
            </motion.div>
            <motion.div
              initial={reduce ? false : { opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2, ease: EASE }}
              className="sm:col-span-7"
            >
              <p className="text-base leading-relaxed opacity-70 sm:text-lg">{aboutStory}</p>
            </motion.div>
          </div>
          <EvolutionTimelineBar accent={accent} />
        </section>
      )}

      {/* 03. ERAS — sub-events */}
      {showEvents && (
        <section className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-3 text-center font-mono text-[10px] uppercase tracking-[0.5em]"
            style={{ color: accent }}
          >
            The Program
          </motion.p>
          <motion.h2
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE }}
            className="mb-14 text-center font-display text-3xl font-black uppercase tracking-tight sm:text-4xl"
          >
            One arc, told in eras.
          </motion.h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sortedSubEvents.map((s, i) => (
              <EraCard key={`${s.order}-${s.name}`} item={s} index={i} accent={accent} />
            ))}
          </div>
        </section>
      )}

      {/* 04. GALLERY — archive of iterations */}
      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-10 text-center font-mono text-[10px] uppercase tracking-[0.5em]"
            style={{ color: accent }}
          >
            The Archive
          </motion.p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((m, i) => (
              <motion.figure
                key={`${m.fileName}-${i}`}
                initial={reduce ? false : { opacity: 0, y: 20, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.05, ease: EASE }}
                className="group relative overflow-hidden rounded-xl border border-white/[0.06]"
              >
                <img
                  src={m.publicUrl}
                  alt={m.caption ?? ""}
                  className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div
                  className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t opacity-0 transition-opacity group-hover:opacity-100"
                  style={{ backgroundImage: `linear-gradient(to top, ${accent}55, transparent)` }}
                />
                <figcaption className="absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-[0.3em] opacity-0 transition-opacity group-hover:opacity-90">
                  Iteration {String(i + 1).padStart(2, "0")}
                </figcaption>
              </motion.figure>
            ))}
            {editing && galleryItems.length === 0 && (
              <div className="col-span-full flex h-48 items-center justify-center rounded-xl border border-dashed border-white/20 font-mono text-xs uppercase tracking-[0.3em] opacity-60">
                + Add photos
              </div>
            )}
          </div>
        </section>
      )}

      {/* 05. VENUE */}
      {showVenue && (
        <section className="relative mx-auto max-w-5xl px-6 py-24 sm:py-32">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-4 text-center font-mono text-[10px] uppercase tracking-[0.5em]"
            style={{ color: accent }}
          >
            The Coordinates
          </motion.p>
          {event.venueName && (
            <motion.h2
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: EASE }}
              className="mb-8 text-center font-display text-2xl font-black uppercase tracking-tight sm:text-3xl"
            >
              {event.venueName}
            </motion.h2>
          )}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.03] p-1 backdrop-blur-xl"
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

      {/* 06. DESTINATION — CTA / RSVP */}
      <section className="relative overflow-hidden px-6 py-32 text-center sm:py-44">
        <motion.div
          aria-hidden
          initial={reduce ? false : { opacity: 0, scale: 0.6 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: EASE }}
          className="pointer-events-none absolute left-1/2 top-1/2 h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background: "radial-gradient(circle, #f4ecdd 0%, rgba(244,236,221,0.3) 30%, transparent 65%)",
            filter: "blur(40px)",
            opacity: 0.35,
          }}
        />
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: EASE }}
          className="relative mx-auto max-w-3xl"
        >
          <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.5em]" style={{ color: accent }}>
            05 &middot; Destination
          </p>
          <h2 className="font-display text-[clamp(2.25rem,7vw,5.5rem)] font-black uppercase leading-[0.9] tracking-tight">
            {event.eventTitle}
          </h2>
          {event.person1Name && (
            <p className="mt-6 font-mono text-sm uppercase tracking-[0.4em] opacity-70">
              Presented by {event.person1Name}
            </p>
          )}
          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <motion.div
              whileHover={reduce ? undefined : { scale: 1.04 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="mt-12 inline-block"
            >
              <a
                href={event.rsvpLinkOrContact}
                target="_blank"
                rel="noreferrer"
                className="inline-block rounded-full px-14 py-4 font-mono text-xs uppercase tracking-[0.4em] transition-shadow"
                style={{ background: "#f4ecdd", color: "#1a1e2c", boxShadow: `0 0 60px ${accent}55` }}
              >
                Reserve your seat
              </a>
            </motion.div>
          )}
        </motion.div>
      </section>

      <footer className="relative border-t border-white/[0.06] py-8 text-center font-mono text-[10px] uppercase tracking-[0.4em] opacity-50">
        <p>
          {event.eventTitle}
          {event.person1Name ? ` · ${event.person1Name}` : ""}
        </p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default EvolutionTemplate;
