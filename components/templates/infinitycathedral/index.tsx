"use client";

import type { TemplateComponent, SubEvent, MediaItem } from "@/lib/types";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { HeroMedia } from "@/components/ui/HeroMedia";
import { MapEmbed } from "@/components/ui/MapEmbed";
import { RSVP } from "@/components/ui/RSVP";
import { MusicToggle } from "@/components/ui/MusicToggle";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { useEditMode } from "@/components/edit/EditContext";
import { infinitycathedralMeta } from "@/components/templates/metadata";
import { useRef } from "react";

const defaults = infinitycathedralMeta.defaults;

// Jewel tones for stained glass
const JEWELS = ["#2f5fbf", "#1f8f6a", "#b23446", "#7a4bb0", "#c99a2e"];

function fmtDate(value?: string): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function fmtTime(value?: string): string {
  if (!value) return "";
  const m = value.match(/^(\d{1,2}):(\d{2})/);
  if (m) {
    const h = Number(m[1]);
    const min = m[2];
    const ampm = h >= 12 ? "PM" : "AM";
    const hr = h % 12 === 0 ? 12 : h % 12;
    return `${hr}:${min} ${ampm}`;
  }
  return value;
}

/* ---------- Ambient layers ---------- */

function Fog({ still }: { still: boolean }) {
  const layers = [
    { top: "8%", left: "-10%", size: 520, hue: "255,255,255", op: 0.05, dur: 34, x: 90 },
    { top: "42%", left: "60%", size: 640, hue: "216,180,106", op: 0.06, dur: 46, x: -120 },
    { top: "70%", left: "10%", size: 560, hue: "120,110,200", op: 0.05, dur: 40, x: 70 },
  ];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {layers.map((l, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full will-change-transform"
          style={{
            top: l.top,
            left: l.left,
            width: l.size,
            height: l.size,
            background: `radial-gradient(circle, rgba(${l.hue},${l.op}) 0%, rgba(${l.hue},0) 70%)`,
            filter: "blur(40px)",
          }}
          animate={
            still
              ? undefined
              : { x: [0, l.x, 0], y: [0, -30, 0], opacity: [0.7, 1, 0.7] }
          }
          transition={
            still ? undefined : { duration: l.dur, repeat: Infinity, ease: "easeInOut" }
          }
        />
      ))}
    </div>
  );
}

function Petals({ still, count = 16 }: { still: boolean; count?: number }) {
  const items = Array.from({ length: count }, (_, i) => ({
    left: (i * 61.8) % 100,
    delay: (i % 8) * 1.3,
    dur: 11 + (i % 6) * 2.5,
    size: 5 + (i % 4) * 3,
    drift: (i % 2 === 0 ? 1 : -1) * (20 + (i % 5) * 14),
    op: 0.35 + (i % 4) * 0.12,
  }));
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((p, i) => (
        <motion.span
          key={i}
          className="absolute block rounded-[60%_40%_60%_40%] will-change-transform"
          style={{
            left: `${p.left}%`,
            top: still ? `${(i * 17) % 90}%` : "-6%",
            width: p.size,
            height: p.size * 1.3,
            background: "var(--accent)",
            opacity: still ? p.op : 0,
            filter: "blur(0.4px)",
          }}
          animate={
            still
              ? undefined
              : {
                  y: ["-6%", "112%"],
                  x: [0, p.drift, 0],
                  rotate: [0, 220],
                  opacity: [0, p.op, p.op, 0],
                }
          }
          transition={
            still
              ? undefined
              : { duration: p.dur, repeat: Infinity, delay: p.delay, ease: "linear" }
          }
        />
      ))}
    </div>
  );
}

/* ---------- Perspective column field ---------- */

function ColumnField({
  still,
  tint,
  progress,
}: {
  still: boolean;
  tint: string;
  progress: import("framer-motion").MotionValue<number>;
}) {
  const cols = [
    { left: "3%", w: 70, base: 0.55 },
    { left: "16%", w: 96, base: 0.72 },
    { left: "31%", w: 60, base: 0.5 },
    { left: "62%", w: 66, base: 0.52 },
    { left: "78%", w: 100, base: 0.75 },
    { left: "92%", w: 72, base: 0.58 },
  ];
  const grow = useTransform(progress, [0, 1], [0.25, 1]);
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ perspective: "1000px" }}
    >
      <div
        className="absolute inset-0"
        style={{ transformStyle: "preserve-3d", transform: "rotateX(4deg)" }}
      >
        {cols.map((c, i) => (
          <motion.div
            key={i}
            className="absolute bottom-0 origin-bottom will-change-transform"
            style={{
              left: c.left,
              width: c.w,
              height: "120%",
              scaleY: still ? c.base : grow,
              background: `linear-gradient(to top, rgba(20,20,26,0.95) 0%, ${tint}22 45%, rgba(20,20,26,0) 100%)`,
              boxShadow: `inset 0 0 40px rgba(0,0,0,0.6), 0 0 30px ${tint}18`,
              borderRadius: "40% 40% 0 0 / 6% 6% 0 0",
              opacity: 0.9,
            }}
          >
            {/* capital / flute detail */}
            <div
              className="absolute inset-x-0 top-0 h-6"
              style={{
                background: `linear-gradient(to bottom, var(--accent), transparent)`,
                opacity: 0.4,
              }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Stained glass arch window ---------- */

function ArchWindow({
  jewel,
  children,
  delay,
  still,
}: {
  jewel: string;
  children: React.ReactNode;
  delay: number;
  still: boolean;
}) {
  return (
    <motion.figure
      className="relative m-0"
      initial={still ? false : { opacity: 0, y: 46, scale: 0.94 }}
      whileInView={still ? undefined : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className="relative aspect-[3/4.4] w-full overflow-hidden"
        style={{
          borderRadius: "50% 50% 0 0 / 30% 30% 0 0",
          border: `3px solid ${jewel}`,
          boxShadow: `0 0 0 1px rgba(0,0,0,0.5), 0 0 34px ${jewel}55, inset 0 0 40px rgba(0,0,0,0.45)`,
        }}
      >
        {children}
        {/* leading / mullion overlay */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: `linear-gradient(115deg, ${jewel}30 0%, transparent 40%, transparent 60%, ${jewel}22 100%)`,
            mixBlendMode: "overlay",
          }}
        />
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
          viewBox="0 0 100 150"
        >
          <line x1="50" y1="0" x2="50" y2="150" stroke={jewel} strokeWidth="0.7" opacity="0.5" />
          <line x1="0" y1="60" x2="100" y2="60" stroke={jewel} strokeWidth="0.7" opacity="0.45" />
          <line x1="0" y1="105" x2="100" y2="105" stroke={jewel} strokeWidth="0.7" opacity="0.4" />
          <path
            d="M2 40 Q50 -2 98 40"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="0.9"
            opacity="0.6"
          />
        </svg>
      </div>
    </motion.figure>
  );
}

/* =========================================================== */

export const InfinityCathedralTemplate: TemplateComponent = ({
  event,
  subEvents,
  media,
}) => {
  const reduce = useReducedMotion();
  const still = !!reduce;
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || defaults.accentColor;
  const hero = event.heroImageUrl || defaults.heroImage;
  const tagline = event.tagline?.trim() || defaults.tagline;
  const invitationMessage =
    event.invitationMessage?.trim() || defaults.invitationMessage;
  const aboutStory = event.aboutStory?.trim() || defaults.aboutStory || "";
  const galleryItems = media.filter((m: MediaItem) => m.section === "gallery");

  const orderedEvents: SubEvent[] = [...subEvents].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );

  const rootRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start start", "end end"],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 24,
    restDelta: 0.001,
  });

  // Hero parallax
  const heroRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress: heroP } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroLift = useTransform(heroP, [0, 1], ["0%", still ? "0%" : "-16%"]);
  const heroFade = useTransform(heroP, [0, 0.85], [1, still ? 1 : 0]);
  const shaftScale = useTransform(smooth, [0, 0.5], [still ? 1 : 0.6, 1]);

  return (
    <div
      ref={rootRef}
      className="relative min-h-screen overflow-x-clip bg-[#111116] text-stone-100 antialiased"
      style={{ "--accent": accent } as React.CSSProperties}
    >
      <ScrollProgress color="var(--accent)" />
      <MusicToggle />

      {/* ============ HERO ============ */}
      <section
        ref={heroRef}
        className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 pb-28 pt-24"
      >
        <motion.div className="absolute inset-0" style={{ y: heroLift }}>
          <HeroMedia
            imageSrc={hero}
            videoSrc={event.heroVideoUrl || undefined}
            alt={event.eventTitle ? `${event.eventTitle} — cathedral hero` : "Cathedral hero"}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0b0b10]/70 via-[#0b0b10]/55 to-[#111116]" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 90% at 50% 30%, transparent 30%, rgba(11,11,16,0.85) 100%)",
            }}
          />
        </motion.div>

        <ColumnField still={still} tint={JEWELS[0]} progress={heroP} />

        {/* shaft of light */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-full w-[46vw] -translate-x-1/2 will-change-transform"
          style={{
            scaleY: shaftScale,
            transformOrigin: "top",
            background:
              "linear-gradient(to bottom, var(--accent) 0%, rgba(216,180,106,0.12) 30%, transparent 70%)",
            opacity: 0.28,
            filter: "blur(22px)",
            clipPath: "polygon(38% 0, 62% 0, 82% 100%, 18% 100%)",
          }}
          animate={still ? undefined : { opacity: [0.2, 0.34, 0.2] }}
          transition={still ? undefined : { duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />

        <Petals still={still} count={12} />

        <motion.div
          className="relative z-10 max-w-3xl text-center"
          style={{ opacity: heroFade }}
        >
          <motion.p
            initial={still ? false : { opacity: 0, y: 16 }}
            animate={still ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-6 font-script text-2xl text-[var(--accent)] sm:text-3xl"
          >
            {tagline}
          </motion.p>
          <motion.h1
            initial={still ? false : { opacity: 0, y: 30, letterSpacing: "0.4em" }}
            animate={still ? undefined : { opacity: 1, y: 0, letterSpacing: "0.06em" }}
            transition={{ duration: 1.4, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-5xl font-semibold leading-[0.95] tracking-tight text-transparent sm:text-7xl md:text-8xl"
            style={{
              backgroundImage:
                "linear-gradient(180deg, #fff 0%, var(--accent) 60%, #9c7b34 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              textShadow: "0 0 40px rgba(216,180,106,0.25)",
            }}
          >
            {event.eventTitle || "Infinity Cathedral"}
          </motion.h1>
          {event.mainDate && (
            <motion.p
              initial={still ? false : { opacity: 0 }}
              animate={still ? undefined : { opacity: 1 }}
              transition={{ duration: 1, delay: 0.9 }}
              className="mt-8 font-serif text-sm uppercase tracking-[0.35em] text-stone-300 sm:text-base"
            >
              {fmtDate(event.mainDate)}
            </motion.p>
          )}
        </motion.div>

        <div
          aria-hidden
          className="absolute bottom-10 left-1/2 -translate-x-1/2 font-serif text-xs uppercase tracking-[0.3em] text-stone-400"
        >
          Enter ↓
        </div>
      </section>

      {/* ============ INVITATION ============ */}
      <section className="relative overflow-hidden px-6 py-28 sm:py-36">
        <Fog still={still} />
        <ColumnField still={still} tint={JEWELS[3]} progress={smooth} />
        <div className="relative z-10 mx-auto max-w-2xl text-center">
          <svg
            aria-hidden
            viewBox="0 0 120 80"
            className="mx-auto mb-10 h-16 w-24"
            fill="none"
          >
            <path
              d="M60 6 L112 46 L112 74 L8 74 L8 46 Z"
              stroke="var(--accent)"
              strokeWidth="1.4"
              opacity="0.7"
            />
            <path d="M60 6 L60 74" stroke="var(--accent)" strokeWidth="1" opacity="0.4" />
            <path
              d="M30 74 Q30 40 60 40 Q90 40 90 74"
              stroke="var(--accent)"
              strokeWidth="1"
              opacity="0.5"
            />
          </svg>
          <motion.p
            initial={still ? false : { opacity: 0, y: 24 }}
            whileInView={still ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-2xl leading-relaxed text-stone-100 sm:text-3xl md:text-4xl"
          >
            {invitationMessage}
          </motion.p>
        </div>
      </section>

      {/* ============ STORY ============ */}
      {!event.hideStory && aboutStory && (
        <section className="relative overflow-hidden px-6 py-28 sm:py-36">
          <ColumnField still={still} tint={JEWELS[1]} progress={smooth} />
          <Petals still={still} count={8} />
          <div className="relative z-10 mx-auto max-w-3xl">
            <motion.h2
              initial={still ? false : { opacity: 0, y: 20 }}
              whileInView={still ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              className="mb-12 text-center font-display text-4xl font-semibold text-[var(--accent)] sm:text-5xl"
            >
              Our Story
            </motion.h2>
            <div
              className="relative rounded-sm border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm sm:p-12"
              style={{ boxShadow: "inset 0 0 60px rgba(216,180,106,0.06)" }}
            >
              <div
                aria-hidden
                className="absolute -left-px top-6 bottom-6 w-px"
                style={{ background: "var(--accent)", opacity: 0.5 }}
              />
              {aboutStory.split(/\n{2,}/).map((para, i) => (
                <motion.p
                  key={i}
                  initial={still ? false : { opacity: 0, y: 18 }}
                  whileInView={still ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                  className="mb-5 font-serif text-lg leading-relaxed text-stone-300 last:mb-0"
                >
                  {para}
                </motion.p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ EVENTS — marble pillars ============ */}
      {!event.hideEvents && orderedEvents.length > 0 && (
        <section className="relative overflow-hidden px-6 py-28 sm:py-36">
          <Fog still={still} />
          <div className="relative z-10 mx-auto max-w-5xl">
            <motion.h2
              initial={still ? false : { opacity: 0, y: 20 }}
              whileInView={still ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              className="mb-4 text-center font-display text-4xl font-semibold text-[var(--accent)] sm:text-5xl"
            >
              The Procession
            </motion.h2>
            <p className="mb-16 text-center font-serif text-sm uppercase tracking-[0.3em] text-stone-400">
              Carved into the pillars of the day
            </p>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {orderedEvents.map((se, i) => {
                const jewel = JEWELS[i % JEWELS.length];
                return (
                  <motion.article
                    key={se.order ?? i}
                    initial={still ? false : { opacity: 0, y: 60 }}
                    whileInView={still ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-70px" }}
                    transition={{ duration: 0.9, delay: (i % 3) * 0.12, ease: [0.16, 1, 0.3, 1] }}
                    className="group relative flex flex-col overflow-hidden rounded-t-[3rem] border border-white/10 pb-8 pt-10"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(28,28,36,0.92), rgba(44,44,54,0.6))",
                      boxShadow: `inset 0 0 50px rgba(0,0,0,0.5), 0 0 24px ${jewel}22`,
                    }}
                  >
                    {/* fluting */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-y-0 left-0 right-0"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0 2px, transparent 2px 22px)",
                        opacity: 0.5,
                      }}
                    />
                    {/* gold capital */}
                    <div
                      aria-hidden
                      className="absolute inset-x-0 top-0 h-2"
                      style={{
                        background:
                          "linear-gradient(to right, transparent, var(--accent), transparent)",
                      }}
                    />
                    <div className="relative z-10 px-7">
                      <div className="mb-5 flex items-center gap-3">
                        <span
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border font-display text-lg"
                          style={{ borderColor: "var(--accent)", color: "var(--accent)" }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {se.icon && (
                          <span aria-hidden className="text-2xl">
                            {se.icon}
                          </span>
                        )}
                      </div>
                      <h3 className="font-display text-2xl font-semibold leading-tight text-stone-50">
                        {se.name}
                      </h3>
                      <div className="mt-3 space-y-1 font-serif text-sm text-stone-300">
                        {se.date && <p>{fmtDate(se.date)}</p>}
                        {(se.startTime || se.endTime) && (
                          <p className="text-[var(--accent)]">
                            {fmtTime(se.startTime)}
                            {se.endTime ? ` – ${fmtTime(se.endTime)}` : ""}
                          </p>
                        )}
                        {se.venueName && (
                          <p className="text-stone-200">{se.venueName}</p>
                        )}
                        {se.venueAddress && (
                          <p className="text-stone-400">{se.venueAddress}</p>
                        )}
                        {se.dressCode && (
                          <p className="italic text-stone-400">
                            Attire: {se.dressCode}
                          </p>
                        )}
                      </div>
                      {se.description && (
                        <p className="mt-4 font-serif text-sm leading-relaxed text-stone-400">
                          {se.description}
                        </p>
                      )}
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ============ STAINED GLASS GALLERY ============ */}
      {!event.hideGallery && (galleryItems.length > 0 || editing) && (
        <section className="relative overflow-hidden px-6 py-28 sm:py-36">
          <ColumnField still={still} tint={JEWELS[2]} progress={smooth} />
          <Fog still={still} />
          <div className="relative z-10 mx-auto max-w-6xl">
            <motion.h2
              initial={still ? false : { opacity: 0, y: 20 }}
              whileInView={still ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              className="mb-4 text-center font-display text-4xl font-semibold text-[var(--accent)] sm:text-5xl"
            >
              The Rose Windows
            </motion.h2>
            <p className="mb-16 text-center font-serif text-sm uppercase tracking-[0.3em] text-stone-400">
              Light through coloured glass
            </p>

            {galleryItems.length > 0 ? (
              <div className="grid grid-cols-2 gap-5 sm:gap-8 md:grid-cols-3">
                {galleryItems.map((item: MediaItem, i: number) => (
                  <div
                    key={`${item.fileName}-${i}`}
                    className={i % 3 === 1 ? "md:mt-14" : i % 3 === 2 ? "md:mt-6" : ""}
                  >
                    <ArchWindow
                      jewel={JEWELS[i % JEWELS.length]}
                      delay={(i % 3) * 0.1}
                      still={still}
                    >
                      <img
                        src={item.publicUrl}
                        alt={item.caption ?? `Gallery window ${i + 1}`}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </ArchWindow>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mx-auto max-w-xs">
                <ArchWindow jewel={JEWELS[0]} delay={0} still={still}>
                  <div className="flex h-full w-full items-center justify-center rounded-xl border border-dashed border-white/20 text-sm opacity-60">
                    + Add photos
                  </div>
                </ArchWindow>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ============ VENUE — THE ALTAR ============ */}
      {!event.hideVenue && (
        <section className="relative overflow-hidden px-6 py-28 sm:py-36">
          <ColumnField still={still} tint={JEWELS[4]} progress={smooth} />
          <Petals still={still} count={10} />
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <motion.h2
              initial={still ? false : { opacity: 0, y: 20 }}
              whileInView={still ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              className="mb-4 font-display text-4xl font-semibold text-[var(--accent)] sm:text-5xl"
            >
              The Altar
            </motion.h2>
            {event.venueName && (
              <p className="font-serif text-xl text-stone-100">{event.venueName}</p>
            )}
            {event.venueAddress && (
              <p className="mb-12 font-serif text-sm text-stone-400">
                {event.venueAddress}
              </p>
            )}

            <motion.div
              initial={still ? false : { opacity: 0, scale: 0.95 }}
              whileInView={still ? undefined : { opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative mx-auto mt-8 max-w-3xl"
            >
              {/* rising glow */}
              <div
                aria-hidden
                className="absolute -inset-6 -z-10 rounded-t-[6rem]"
                style={{
                  background:
                    "radial-gradient(60% 80% at 50% 100%, rgba(216,180,106,0.35), transparent 70%)",
                  filter: "blur(24px)",
                }}
              />
              <div
                className="overflow-hidden rounded-t-[4rem] border-2 p-2"
                style={{
                  borderColor: "var(--accent)",
                  boxShadow:
                    "0 0 40px rgba(216,180,106,0.4), inset 0 0 40px rgba(0,0,0,0.4)",
                }}
              >
                <div className="overflow-hidden rounded-t-[3.5rem]">
                  <MapEmbed
                    latitude={event.latitude}
                    longitude={event.longitude}
                    venueName={event.venueName}
                    venueAddress={event.venueAddress}
                    mapLink={event.mapLink}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ============ FINALE — THE UNIVERSE OPENS ============ */}
      <section className="relative overflow-hidden bg-[#050510] px-6 py-32 sm:py-44">
        {/* starfield */}
        <Starfield still={still} />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(70% 60% at 50% 40%, rgba(122,75,176,0.18), transparent 60%), radial-gradient(50% 50% at 50% 80%, rgba(216,180,106,0.12), transparent 70%)",
          }}
        />
        <Petals still={still} count={14} />

        <div className="relative z-10 mx-auto max-w-2xl text-center">
          <motion.p
            initial={still ? false : { opacity: 0, y: 20 }}
            whileInView={still ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="mb-6 font-script text-2xl text-[var(--accent)] sm:text-3xl"
          >
            forever &amp; always
          </motion.p>
          <motion.h2
            initial={still ? false : { opacity: 0, scale: 0.9 }}
            whileInView={still ? undefined : { opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-5xl font-semibold text-transparent sm:text-7xl"
            style={{
              backgroundImage:
                "linear-gradient(180deg, #fff, var(--accent) 70%, #8a6a2c)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              textShadow: "0 0 50px rgba(216,180,106,0.3)",
            }}
          >
            {event.eventTitle || "Infinity"}
          </motion.h2>

          {event.rsvpEnabled && (
            <motion.div
              initial={still ? false : { opacity: 0, y: 30 }}
              whileInView={still ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 1, delay: 0.2 }}
              className="mx-auto mt-14 max-w-lg rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md sm:p-8"
              style={{ boxShadow: "0 0 50px rgba(216,180,106,0.12)" }}
            >
              <RSVP
                enabled={event.rsvpEnabled}
                linkOrContact={event.rsvpLinkOrContact}
                contactName={event.contactName}
                type={event.rsvpType}
              />
            </motion.div>
          )}
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="relative bg-[#050510] px-6 pb-16 pt-4 text-center">
        <p className="font-script text-xl text-[var(--accent)]">
          {event.eventTitle || "Infinity Cathedral"}
        </p>
        <p className="mt-2 font-serif text-xs uppercase tracking-[0.3em] text-stone-500">
          {fmtDate(event.mainDate) || tagline}
        </p>
      </footer>
    </div>
  );
};

/* ---------- Starfield (finale) ---------- */

function Starfield({ still }: { still: boolean }) {
  const stars = Array.from({ length: 90 }, (_, i) => ({
    top: (i * 37.3) % 100,
    left: (i * 61.7) % 100,
    size: 1 + (i % 3),
    delay: (i % 10) * 0.4,
    dur: 2.4 + (i % 5) * 0.9,
    base: 0.25 + (i % 4) * 0.15,
  }));
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {stars.map((s, i) => (
        <motion.span
          key={i}
          className="absolute block rounded-full bg-white will-change-[opacity]"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            opacity: s.base,
            boxShadow: `0 0 ${s.size * 2}px rgba(255,255,255,0.6)`,
          }}
          animate={still ? undefined : { opacity: [s.base, 1, s.base] }}
          transition={
            still
              ? undefined
              : { duration: s.dur, repeat: Infinity, delay: s.delay, ease: "easeInOut" }
          }
        />
      ))}
    </div>
  );
}

export default InfinityCathedralTemplate;
