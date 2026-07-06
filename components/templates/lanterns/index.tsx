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

const LANTERNS = Array.from({ length: 36 }, (_, i) => {
  const seed = i * 37 + 11;
  return {
    left: `${(seed * 7) % 100}%`,
    size: 14 + ((seed * 3) % 22),
    delay: (i % 12) * 1.4,
    duration: 22 + ((seed * 5) % 18),
    drift: -20 + ((seed * 11) % 40),
    hue: i % 5 === 0 ? "#e8608c" : "#f0b464",
  };
});

function Lantern({
  size,
  color,
  opacity = 1,
}: {
  size: number;
  color: string;
  opacity?: number;
}) {
  const w = size;
  const h = size * 1.25;
  return (
    <svg
      width={w}
      height={h + size * 0.9}
      viewBox={`0 0 ${w} ${h + size * 0.9}`}
      style={{ opacity }}
      aria-hidden
    >
      <defs>
        <radialGradient id={`glow-${color}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <stop offset="60%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse
        cx={w / 2}
        cy={h / 2 + size * 0.1}
        rx={w * 0.95}
        ry={h * 0.75}
        fill={`url(#glow-${color})`}
      />
      <rect
        x={w * 0.18}
        y={h * 0.12}
        width={w * 0.64}
        height={h * 0.7}
        rx={w * 0.14}
        fill={color}
        opacity="0.85"
      />
      <rect
        x={w * 0.18}
        y={h * 0.12}
        width={w * 0.64}
        height={h * 0.7}
        rx={w * 0.14}
        fill="none"
        stroke="#f6efdd"
        strokeWidth="0.6"
        opacity="0.5"
      />
      <line
        x1={w / 2}
        y1={h * 0.82}
        x2={w / 2}
        y2={h + size * 0.4}
        stroke="#f6efdd"
        strokeWidth="0.6"
        opacity="0.4"
      />
      <circle cx={w / 2} cy={h + size * 0.55} r={size * 0.06} fill="#f6efdd" opacity="0.7" />
    </svg>
  );
}

function LanternField({ reduce }: { reduce: boolean }) {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 20%, #1a1e3a 0%, #12162c 50%, #0e1224 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 70% 40%, rgba(240,180,100,0.08) 0%, transparent 55%)",
        }}
      />
      {!reduce && (
        <div className="absolute inset-0">
          {LANTERNS.map((l, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{ left: l.left, top: "100%" }}
              animate={{
                y: ["0vh", "-115vh"],
                x: [0, l.drift, l.drift * 0.4, l.drift],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: l.duration,
                delay: l.delay,
                repeat: Infinity,
                ease: "linear",
                times: [0, 0.1, 0.85, 1],
              }}
            >
              <Lantern size={l.size} color={l.hue} />
            </motion.div>
          ))}
        </div>
      )}
      <svg className="absolute inset-0 h-full w-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
        <filter id="lantern-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" />
        </filter>
        <rect width="100%" height="100%" filter="url(#lantern-noise)" />
      </svg>
    </div>
  );
}

function LakeReflection({ children }: { children: React.ReactNode }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-0 right-0 bottom-0 h-[38vh] overflow-hidden"
      style={{
        maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.55), transparent 85%)",
        WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.55), transparent 85%)",
      }}
    >
      <div
        style={{
          transform: "scaleY(-1)",
          filter: "blur(4px) brightness(0.55) saturate(0.9)",
          opacity: 0.5,
        }}
      >
        {children}
      </div>
      <motion.div
        className="absolute inset-0"
        animate={{ backgroundPositionX: ["0px", "40px", "0px"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "repeating-linear-gradient(180deg, rgba(168,176,200,0.08) 0px, transparent 3px, transparent 8px)",
          mixBlendMode: "screen",
        }}
      />
    </div>
  );
}

function WishCard({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
      className={`relative rounded-2xl border border-[#f0b464]/15 bg-[#1a1e3a]/40 p-6 backdrop-blur-md ${className ?? ""}`}
      style={{ boxShadow: "0 0 40px rgba(240,180,100,0.08) inset" }}
    >
      {children}
    </motion.div>
  );
}

function LanternTimeline({ items, accent }: { items: SubEvent[]; accent: string }) {
  const reduce = useReducedMotion();
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <div className="mx-auto max-w-4xl px-6">
      <div className="grid gap-5 sm:grid-cols-2">
        {sorted.map((s, i) => (
          <motion.article
            key={s.order}
            initial={reduce ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
          >
            <WishCard delay={i * 0.05}>
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center">
                  <Lantern size={16} color={accent} />
                </div>
                <span className="text-[10px] uppercase tracking-[0.35em] text-[#a8b0c8]">
                  {[s.date, s.startTime].filter(Boolean).join(" · ")}
                </span>
              </div>
              <h3 className="font-display text-2xl leading-tight text-[#f6efdd]">{s.name}</h3>
              {s.venueName && <p className="mt-1 text-sm text-[#a8b0c8]">at {s.venueName}</p>}
              {s.description && (
                <p className="mt-3 text-sm leading-relaxed text-[#f6efdd]/70">{s.description}</p>
              )}
              {s.dressCode && (
                <p
                  className="mt-4 inline-block rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.25em]"
                  style={{ borderColor: `${accent}40`, color: accent }}
                >
                  {s.dressCode}
                </p>
              )}
            </WishCard>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

export const LanternsTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || "#f0b464";
  const tagline = event.tagline?.trim() || "A wish, sent skyward";
  const invitationMessage =
    event.invitationMessage?.trim() ||
    "We wrote our hopes on paper, lit them softly, and let them drift over the water — join us as they rise.";
  const aboutStory = event.aboutStory?.trim() || "";
  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const hero =
    event.heroImageUrl ||
    "https://images.unsplash.com/photo-1509824227185-9c5a01ceba0d?auto=format&fit=crop&w=1600&q=80";

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroTextY = useTransform(heroP, [0, 1], [0, -80]);
  const heroOpacity = useTransform(heroP, [0, 0.7], [1, 0]);

  const showStory = !event.hideStory;
  const showJourney = !event.hideEvents && subEvents.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  const names = event.person2Name?.trim()
    ? [event.person1Name, event.person2Name].filter(Boolean).join(" • ")
    : event.person1Name || "";

  const heroDate = event.mainDate
    ? new Date(event.mainDate).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-sans text-[#f6efdd] antialiased"
      style={{ "--accent": accent, background: "#0e1224" } as React.CSSProperties}
    >
      <LanternField reduce={reduce} />
      <ScrollProgress color={accent} />

      <section ref={heroRef} className="relative flex h-[100svh] min-h-[640px] items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <HeroMedia
            imageSrc={hero}
            videoSrc={event.heroVideoUrl || undefined}
            alt={event.eventTitle}
            className="opacity-40"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(14,18,36,0.55) 0%, rgba(14,18,36,0.75) 60%, #0e1224 100%)",
            }}
          />
        </div>

        <motion.div
          style={reduce ? undefined : { y: heroTextY, opacity: heroOpacity }}
          className="relative z-10 px-6 text-center"
        >
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: EASE }}
            className="mb-8 text-[10px] uppercase tracking-[0.7em]"
            style={{ color: accent }}
          >
            {tagline}
          </motion.p>

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2.2, ease: EASE }}
            className="font-display text-[clamp(2.75rem,9vw,7rem)] leading-[1] tracking-tight"
            style={{ textShadow: `0 0 40px ${accent}55` }}
          >
            {event.person1Name || event.eventTitle}
            {event.person2Name?.trim() && (
              <>
                <span className="mx-4 inline-block align-middle text-[0.6em]" style={{ color: accent }}>
                  &amp;
                </span>
                {event.person2Name}
              </>
            )}
          </motion.h1>

          {event.eventTitle && (event.person1Name || event.person2Name) && (
            <motion.p
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 1.4 }}
              className="mt-6 font-display text-lg italic text-[#f6efdd]/70"
            >
              {event.eventTitle}
            </motion.p>
          )}

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 1.2 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4 text-xs uppercase tracking-[0.4em] text-[#a8b0c8]"
          >
            {heroDate && <span>{heroDate}</span>}
            {event.mainStartTime && (
              <>
                <span style={{ color: accent }}>•</span>
                <span>{event.mainStartTime}</span>
              </>
            )}
            {event.city && (
              <>
                <span style={{ color: accent }}>•</span>
                <span>{event.city}</span>
              </>
            )}
          </motion.div>
        </motion.div>

        <LakeReflection>
          <div className="px-6 pt-24 text-center">
            <p className="mb-8 text-[10px] uppercase tracking-[0.7em]" style={{ color: accent }}>
              {tagline}
            </p>
            <h1 className="font-display text-[clamp(2.75rem,9vw,7rem)] leading-[1] tracking-tight">
              {names || event.eventTitle}
            </h1>
          </div>
        </LakeReflection>
      </section>

      {showStory && (
        <section className="relative mx-auto max-w-4xl px-6 py-28 sm:py-36">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-8 text-center text-[10px] uppercase tracking-[0.5em]"
            style={{ color: accent }}
          >
            A Wish on the Water
          </motion.p>
          <motion.blockquote
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: EASE }}
            className="mx-auto max-w-3xl text-center font-display text-2xl leading-relaxed text-[#f6efdd]/90 sm:text-3xl"
          >
            {invitationMessage}
          </motion.blockquote>
          {aboutStory && (
            <motion.p
              initial={reduce ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 }}
              className="mx-auto mt-10 max-w-2xl text-center text-base leading-relaxed text-[#a8b0c8]"
            >
              {aboutStory}
            </motion.p>
          )}
          <motion.div
            className="mx-auto mt-12 h-px w-40"
            style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
            animate={reduce ? undefined : { opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </section>
      )}

      {showJourney && (
        <section className="relative py-24 sm:py-32">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-14 text-center text-[10px] uppercase tracking-[0.5em]"
            style={{ color: accent }}
          >
            The Evening, Adrift
          </motion.p>
          <LanternTimeline items={subEvents} accent={accent} />
        </section>
      )}

      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-12 text-center text-[10px] uppercase tracking-[0.5em]"
            style={{ color: accent }}
          >
            Lanterns Aloft
          </motion.p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((m, i) => (
              <motion.figure
                key={`${m.fileName}-${i}`}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.06, ease: EASE }}
                className="group relative"
              >
                <div className="absolute -top-6 left-1/2 z-10 -translate-x-1/2">
                  <Lantern size={20} color={accent} opacity={0.85} />
                </div>
                <div className="relative overflow-hidden rounded-2xl border border-[#f0b464]/15">
                  <img
                    src={m.publicUrl}
                    alt={m.caption ?? ""}
                    className="aspect-[4/5] w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e1224]/85 via-transparent to-transparent" />
                  <figcaption
                    className="absolute inset-x-0 bottom-0 p-5 text-center font-display italic text-[#f6efdd] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{ textShadow: `0 0 12px ${accent}80` }}
                  >
                    {m.caption || "a quiet wish"}
                  </figcaption>
                </div>
              </motion.figure>
            ))}
            {editing && galleryItems.length === 0 && (
              <div className="col-span-full flex h-56 items-center justify-center rounded-2xl border border-dashed border-[#f0b464]/30 text-sm text-[#a8b0c8]">
                + Add photos
              </div>
            )}
          </div>
        </section>
      )}

      {showVenue && (
        <section className="relative mx-auto max-w-5xl px-6 py-24 sm:py-32">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-6 text-center text-[10px] uppercase tracking-[0.5em]"
            style={{ color: accent }}
          >
            By the Water
          </motion.p>
          {event.venueName && (
            <motion.h3
              initial={reduce ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-8 text-center font-display text-3xl text-[#f6efdd]"
            >
              {event.venueName}
            </motion.h3>
          )}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE }}
            className="overflow-hidden rounded-2xl border border-[#f0b464]/15 bg-[#1a1e3a]/40 p-1 backdrop-blur-md"
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

      <section className="relative px-6 py-28 text-center sm:py-40">
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: EASE }}
          className="mx-auto max-w-3xl"
        >
          <motion.div
            aria-hidden
            animate={reduce ? undefined : { y: [0, -20, 0], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="mx-auto mb-8 flex justify-center"
          >
            <Lantern size={36} color={accent} />
          </motion.div>
          <h2 className="font-display text-[clamp(2rem,6vw,4.5rem)] leading-tight text-[#f6efdd]">
            Let your light rise with ours
          </h2>
          {names && (
            <p className="mt-5 text-sm uppercase tracking-[0.5em] text-[#a8b0c8]">{names}</p>
          )}
          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <motion.a
              whileHover={reduce ? undefined : { scale: 1.04, boxShadow: `0 0 40px ${accent}80` }}
              href={event.rsvpLinkOrContact}
              target="_blank"
              rel="noreferrer"
              className="mt-12 inline-block rounded-full px-12 py-4 text-sm uppercase tracking-[0.35em] transition-all"
              style={{ background: accent, color: "#0e1224" }}
            >
              Send your wish
            </motion.a>
          )}
        </motion.div>
      </section>

      <footer className="relative border-t border-[#f0b464]/10 py-10 text-center text-xs text-[#a8b0c8]">
        <p>
          {event.eventTitle}
          {names ? ` · ${names}` : ""}
        </p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default LanternsTemplate;
