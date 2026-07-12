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

const BRASS = "#a67b3c";
const FOREST = "#1e3a2e";
const LAMP = "#e8b95a";
const IVORY = "#f5ecdb";
const MAHOGANY = "#3a1e14";

const ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
const toRoman = (n: number) => ROMAN[n] || String(n);

const COACH_ICONS = ["☘", "☀", "☕", "⚘", "☄", "⚓", "✦", "❀"];

const HILLS = Array.from({ length: 6 }, (_, i) => ({
  x: i * 220,
  h: 60 + ((i * 37) % 40),
  w: 260 + ((i * 53) % 80),
}));

const POLES = Array.from({ length: 10 }, (_, i) => ({ x: i * 160 + 40 }));

function TrainScape({ reduce, accent }: { reduce: boolean; accent: string }) {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, #0d1f18 0%, ${FOREST} 55%, ${MAHOGANY} 100%)`,
        }}
      />
      <motion.svg
        className="absolute bottom-0 left-0 h-[55%] w-[300%]"
        viewBox="0 0 1600 300"
        preserveAspectRatio="none"
        animate={reduce ? undefined : { x: ["0%", "-33.3%"] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        {HILLS.map((h, i) => (
          <path
            key={`h-${i}`}
            d={`M${h.x},300 Q${h.x + h.w / 2},${300 - h.h * 1.4} ${h.x + h.w},300 Z`}
            fill={i % 2 ? "#12271d" : "#0a1a13"}
            opacity={0.85}
          />
        ))}
        {POLES.map((p, i) => (
          <g key={`p-${i}`} opacity={0.6}>
            <line x1={p.x} y1={180} x2={p.x} y2={260} stroke={BRASS} strokeWidth={1.5} />
            <line x1={p.x - 12} y1={190} x2={p.x + 12} y2={190} stroke={BRASS} strokeWidth={1} />
          </g>
        ))}
        <line x1={0} y1={278} x2={1600} y2={278} stroke={accent} strokeWidth={2} opacity={0.4} />
        <line x1={0} y1={286} x2={1600} y2={286} stroke={accent} strokeWidth={1} opacity={0.25} />
      </motion.svg>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a1a13]/70 via-transparent to-[#0a1a13]/40" />
    </div>
  );
}

function TrainSVG({ reduce, accent }: { reduce: boolean; accent: string }) {
  return (
    <div aria-hidden className="relative h-16 w-full overflow-hidden">
      <div
        className="absolute inset-x-0 top-1/2 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
      />
      <div
        className="absolute inset-x-0 top-1/2 mt-2 h-px opacity-40"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
      />
      <motion.svg
        viewBox="0 0 400 60"
        className="absolute left-0 top-1/2 h-14 w-[420px] -translate-y-1/2"
        animate={reduce ? undefined : { x: ["-30%", "110%"] }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      >
        <rect x={0} y={20} width={70} height={22} rx={3} fill={MAHOGANY} stroke={accent} />
        <rect x={20} y={6} width={30} height={18} rx={2} fill={MAHOGANY} stroke={accent} />
        <circle cx={40} cy={12} r={3} fill={LAMP} />
        <circle cx={12} cy={46} r={5} fill="#111" stroke={accent} />
        <circle cx={58} cy={46} r={5} fill="#111" stroke={accent} />
        {[80, 155, 230, 305].map((x, i) => (
          <g key={i}>
            <rect x={x} y={22} width={65} height={20} rx={2} fill={FOREST} stroke={accent} />
            <rect x={x + 8} y={26} width={12} height={10} fill={LAMP} opacity={0.7} />
            <rect x={x + 26} y={26} width={12} height={10} fill={LAMP} opacity={0.7} />
            <rect x={x + 44} y={26} width={12} height={10} fill={LAMP} opacity={0.7} />
            <circle cx={x + 12} cy={46} r={4} fill="#111" stroke={accent} />
            <circle cx={x + 53} cy={46} r={4} fill="#111" stroke={accent} />
          </g>
        ))}
        {!reduce &&
          [0, 1, 2].map((i) => (
            <motion.circle
              key={i}
              cx={20 + i * 8}
              cy={4 - i * 2}
              r={3 + i}
              fill={IVORY}
              opacity={0.35}
              animate={{ opacity: [0.05, 0.4, 0], y: [-2, -14, -22] }}
              transition={{ duration: 2, delay: i * 0.3, repeat: Infinity, ease: "easeOut" }}
            />
          ))}
      </motion.svg>
    </div>
  );
}

function CoachCard({
  s,
  index,
  accent,
}: {
  s: SubEvent;
  index: number;
  accent: string;
}) {
  const reduce = useReducedMotion();
  const icon = COACH_ICONS[index % COACH_ICONS.length];
  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: EASE }}
      className="relative"
    >
      <div
        className="relative flex gap-5 rounded-md border p-5 sm:p-6"
        style={{
          background: `linear-gradient(180deg, ${MAHOGANY}, #2a140c)`,
          borderColor: `${accent}66`,
          boxShadow: `0 20px 40px -20px rgba(0,0,0,0.6), inset 0 1px 0 ${accent}33`,
        }}
      >
        {[[8, 8], [8, 92], [92, 8], [92, 92]].map(([tx, ty], i) => (
          <span
            key={i}
            aria-hidden
            className="absolute h-1.5 w-1.5 rounded-full"
            style={{
              left: `${tx}%`,
              top: `${ty}%`,
              transform: "translate(-50%, -50%)",
              background: LAMP,
              boxShadow: `0 0 6px ${LAMP}88, inset 0 -1px 1px ${MAHOGANY}`,
            }}
          />
        ))}
        <div
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-sm border text-2xl sm:h-20 sm:w-20 sm:text-3xl"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${LAMP}55, ${FOREST})`,
            borderColor: `${accent}88`,
            color: IVORY,
            boxShadow: `inset 0 0 10px rgba(0,0,0,0.5)`,
          }}
        >
          <span>{icon}</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-3">
            <span
              className="rounded-sm px-2 py-0.5 text-[10px] font-semibold tracking-[0.25em]"
              style={{
                background: accent,
                color: MAHOGANY,
                fontVariant: "small-caps",
              }}
            >
              Coach {toRoman(s.order)}
            </span>
            <span className="text-[10px] uppercase tracking-[0.3em]" style={{ color: `${IVORY}99` }}>
              {[s.date, s.startTime].filter(Boolean).join(" · ")}
            </span>
          </div>
          <h3
            className="font-display text-xl leading-tight sm:text-2xl"
            style={{ color: IVORY, fontVariant: "small-caps", letterSpacing: "0.02em" }}
          >
            {s.name}
          </h3>
          {s.venueName && (
            <p className="mt-1 text-sm italic" style={{ color: `${IVORY}aa` }}>
              at {s.venueName}
            </p>
          )}
          {s.description && (
            <p className="mt-2 text-sm leading-relaxed" style={{ color: `${IVORY}b0` }}>
              {s.description}
            </p>
          )}
          {s.dressCode && (
            <p
              className="mt-3 inline-block rounded-full border px-3 py-1 text-[10px] tracking-[0.25em]"
              style={{
                borderColor: `${accent}66`,
                color: LAMP,
                fontVariant: "small-caps",
              }}
            >
              {s.dressCode}
            </p>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export const InfinitytrainTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || BRASS;
  const tagline = event.tagline?.trim() || "All aboard the grand line";
  const invitationMessage =
    event.invitationMessage?.trim() ||
    "Board with us as our story rolls through carriage after carriage of memory, ending where every good journey should — a promise.";
  const aboutStory =
    event.aboutStory?.trim() ||
    "Each coach carries a chapter: the first meeting, the long letters, the shared cities, the quiet mornings. The last car is where the question was asked, and answered.";
  const heroFallback =
    "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1600&q=80";
  const hero = event.heroImageUrl || heroFallback;

  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const sortedCoaches = useMemo(
    () => [...subEvents].sort((a, b) => a.order - b.order),
    [subEvents],
  );

  const showStory = !event.hideStory;
  const showCoaches = !event.hideEvents && sortedCoaches.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroP, [0, 1], [0, -80]);
  const heroOpacity = useTransform(heroP, [0, 0.7], [1, 0]);

  const pair = event.person2Name?.trim()
    ? `${event.person1Name} & ${event.person2Name}`
    : event.person1Name;

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-sans antialiased"
      style={{
        background: `linear-gradient(180deg, #0a1a13, ${MAHOGANY} 60%, #0a1a13)`,
        color: IVORY,
        ["--accent" as string]: accent,
      } as React.CSSProperties}
    >
      <ScrollProgress color={accent} />

      {/* Hero */}
      <section ref={heroRef} className="relative flex h-[100svh] min-h-[640px] items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <HeroMedia
            imageSrc={hero}
            videoSrc={event.heroVideoUrl || undefined}
            alt={event.eventTitle}
            className="opacity-45"
          />
        </div>
        <TrainScape reduce={reduce} accent={accent} />
        <motion.div
          style={reduce ? undefined : { y: heroY, opacity: heroOpacity }}
          className="relative z-10 mx-auto max-w-4xl px-6 text-center"
        >
          <p
            className="mb-6 text-[10px] tracking-[0.6em]"
            style={{ color: LAMP, fontVariant: "small-caps" }}
          >
            {tagline}
          </p>
          <h1
            className="font-display text-[clamp(2.6rem,10vw,7rem)] font-semibold leading-[0.95]"
            style={{ color: IVORY, letterSpacing: "0.01em" }}
          >
            {pair}
          </h1>
          <div
            className="mx-auto mt-6 h-px w-32"
            style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
          />
          <p
            className="mt-6 font-display text-lg italic sm:text-xl"
            style={{ color: `${IVORY}cc` }}
          >
            {event.eventTitle}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 text-[11px] tracking-[0.35em]" style={{ color: `${IVORY}b0`, fontVariant: "small-caps" }}>
            {event.mainDate && (
              <span>
                {new Date(event.mainDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              </span>
            )}
            {event.city && (
              <>
                <span style={{ color: accent }}>―</span>
                <span>{event.city}</span>
              </>
            )}
          </div>
        </motion.div>
      </section>

      {/* Story */}
      {showStory && (
        <section className="relative mx-auto max-w-4xl px-6 py-24 sm:py-32">
          <div className="text-center">
            <p className="mb-4 text-[10px] tracking-[0.5em]" style={{ color: LAMP, fontVariant: "small-caps" }}>
              The Invitation
            </p>
            <div className="mx-auto mb-8 h-px w-16" style={{ background: accent }} />
            <motion.h2
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: EASE }}
              className="font-display text-2xl italic leading-relaxed sm:text-3xl"
              style={{ color: IVORY }}
            >
              &ldquo;{invitationMessage}&rdquo;
            </motion.h2>
            <motion.p
              initial={reduce ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.15 }}
              className="mx-auto mt-10 max-w-2xl text-base leading-relaxed"
              style={{ color: `${IVORY}b0` }}
            >
              {aboutStory}
            </motion.p>
          </div>
        </section>
      )}

      {/* Coaches */}
      {showCoaches && (
        <section className="relative px-6 py-24 sm:py-32">
          <div className="mx-auto mb-4 max-w-5xl text-center">
            <p className="mb-4 text-[10px] tracking-[0.5em]" style={{ color: LAMP, fontVariant: "small-caps" }}>
              The Grand Line
            </p>
            <h2
              className="font-display text-3xl sm:text-4xl"
              style={{ color: IVORY, fontVariant: "small-caps", letterSpacing: "0.03em" }}
            >
              Coach by coach
            </h2>
          </div>
          <div className="mx-auto max-w-5xl">
            <TrainSVG reduce={reduce} accent={accent} />
          </div>
          <div className="mx-auto mt-8 grid max-w-3xl gap-5">
            {sortedCoaches.map((s, i) => (
              <CoachCard key={s.order} s={s} index={i} accent={accent} />
            ))}
          </div>
        </section>
      )}

      {/* Gallery */}
      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-24 sm:py-28">
          <div className="mb-10 text-center">
            <p className="mb-3 text-[10px] tracking-[0.5em]" style={{ color: LAMP, fontVariant: "small-caps" }}>
              Window Views
            </p>
            <h2
              className="font-display text-3xl sm:text-4xl"
              style={{ color: IVORY, fontVariant: "small-caps", letterSpacing: "0.03em" }}
            >
              From the carriages
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((m, i) => (
              <motion.figure
                key={`${m.fileName}-${i}`}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.05, ease: EASE }}
                className="group relative"
              >
                <div
                  className="overflow-hidden rounded-xl border p-1.5"
                  style={{
                    borderColor: `${accent}88`,
                    background: `linear-gradient(180deg, ${MAHOGANY}, #1a0e08)`,
                    boxShadow: `0 15px 30px -15px rgba(0,0,0,0.7), inset 0 0 0 1px ${accent}33`,
                  }}
                >
                  <img
                    src={m.publicUrl}
                    alt={m.caption ?? ""}
                    loading="lazy"
                    className="aspect-[4/5] w-full rounded-lg object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <figcaption
                  className="mt-3 text-center text-[10px] tracking-[0.35em]"
                  style={{ color: `${IVORY}99`, fontVariant: "small-caps" }}
                >
                  Wagon {toRoman(i + 1)}
                  {m.caption ? ` · ${m.caption}` : ""}
                </figcaption>
              </motion.figure>
            ))}
            {editing && galleryItems.length === 0 && (
              <div
                className="col-span-full flex h-56 items-center justify-center rounded-xl border border-dashed text-sm"
                style={{ borderColor: `${accent}66`, color: `${IVORY}88` }}
              >
                + Add window views
              </div>
            )}
          </div>
        </section>
      )}

      {/* Venue */}
      {showVenue && (
        <section className="relative mx-auto max-w-5xl px-6 py-24 sm:py-28">
          <div className="mb-8 text-center">
            <p className="mb-3 text-[10px] tracking-[0.5em]" style={{ color: LAMP, fontVariant: "small-caps" }}>
              Final Station
            </p>
            {event.venueName && (
              <h2
                className="font-display text-2xl sm:text-3xl"
                style={{ color: IVORY, fontVariant: "small-caps", letterSpacing: "0.03em" }}
              >
                {event.venueName}
              </h2>
            )}
            {event.venueAddress && (
              <p className="mt-2 text-sm italic" style={{ color: `${IVORY}aa` }}>
                {event.venueAddress}
              </p>
            )}
          </div>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="overflow-hidden rounded-xl border p-1"
            style={{ borderColor: `${accent}66`, background: MAHOGANY }}
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

      {/* CTA / RSVP */}
      <section className="relative px-6 py-28 text-center sm:py-36">
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE }}
          className="mx-auto max-w-3xl"
        >
          <p className="mb-4 text-[10px] tracking-[0.6em]" style={{ color: LAMP, fontVariant: "small-caps" }}>
            Your seat awaits
          </p>
          <h2
            className="font-display text-[clamp(2rem,7vw,4.5rem)] leading-[1]"
            style={{ color: IVORY, fontVariant: "small-caps", letterSpacing: "0.02em" }}
          >
            {pair}
          </h2>
          <div className="mx-auto mt-6 h-px w-24" style={{ background: accent }} />
          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <a
              href={event.rsvpLinkOrContact}
              target="_blank"
              rel="noreferrer"
              className="mt-10 inline-block rounded-sm border px-10 py-3 text-xs tracking-[0.4em] transition-colors"
              style={{
                borderColor: accent,
                color: MAHOGANY,
                background: accent,
                fontVariant: "small-caps",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = LAMP;
                e.currentTarget.style.borderColor = LAMP;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = accent;
                e.currentTarget.style.borderColor = accent;
              }}
            >
              Reserve a seat
            </a>
          )}
        </motion.div>
      </section>

      <footer
        className="border-t py-8 text-center text-xs"
        style={{ borderColor: `${accent}33`, color: `${IVORY}80`, fontVariant: "small-caps", letterSpacing: "0.3em" }}
      >
        <p>{event.eventTitle}{pair ? ` · ${pair}` : ""}</p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default InfinitytrainTemplate;
