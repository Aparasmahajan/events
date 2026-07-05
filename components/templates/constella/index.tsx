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

// Fixed deterministic star positions — hydration-safe.
const STARS = Array.from({ length: 60 }, (_, i) => {
  const x = ((i * 37 + 13) * 131) % 1000 / 10;
  const y = ((i * 71 + 29) * 89) % 1000 / 10;
  const size = 1 + (i % 4) * 0.4;
  const twinkleDelay = (i % 12) * 0.35;
  return { x, y, size, twinkleDelay };
});

// Hand-picked constellation lines between star indices.
const LINES: [number, number][] = [
  [3, 12], [12, 27], [27, 41], [41, 55],
  [7, 18], [18, 31], [31, 22],
  [5, 15], [15, 44], [44, 33],
  [9, 24], [24, 38], [38, 49],
  [1, 11], [11, 21], [21, 34],
  [2, 17], [17, 29],
  [6, 20], [20, 40], [40, 58],
];

function StarField({ reduce, accent }: { reduce: boolean; accent: string }) {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a2e] via-[#131347] to-[#0a0a2e]" />
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        {LINES.map(([a, b], i) => {
          const A = STARS[a];
          const B = STARS[b];
          if (!A || !B) return null;
          return (
            <motion.line
              key={i}
              x1={A.x} y1={A.y} x2={B.x} y2={B.y}
              stroke={accent}
              strokeWidth={0.08}
              strokeDasharray={30}
              initial={reduce ? undefined : { strokeDashoffset: 30, opacity: 0 }}
              animate={{ strokeDashoffset: 0, opacity: 0.35 }}
              transition={{ duration: 2.4, delay: 0.3 + i * 0.15, ease: EASE }}
            />
          );
        })}
        {STARS.map((s, i) => (
          <motion.circle
            key={i}
            cx={s.x} cy={s.y} r={s.size / 20}
            fill="#ffffff"
            initial={reduce ? undefined : { opacity: 0 }}
            animate={reduce ? { opacity: 0.7 } : { opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 3 + (i % 4), delay: s.twinkleDelay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </svg>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a2e]/70" />
    </div>
  );
}

function StarCard({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.8, delay, ease: EASE }}
      className={`relative rounded-2xl border border-white/[0.08] bg-white/[0.02] p-7 backdrop-blur-xl ${className ?? ""}`}
    >
      <span aria-hidden className="pointer-events-none absolute -left-1 -top-1 h-2 w-2 rounded-full bg-white/80" />
      <span aria-hidden className="pointer-events-none absolute -right-1 -top-1 h-2 w-2 rounded-full bg-white/80" />
      <span aria-hidden className="pointer-events-none absolute -left-1 -bottom-1 h-2 w-2 rounded-full bg-white/80" />
      <span aria-hidden className="pointer-events-none absolute -right-1 -bottom-1 h-2 w-2 rounded-full bg-white/80" />
      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-2xl" style={{ boxShadow: "inset 0 0 0 1px rgba(127,249,255,0.06)" }} />
      <div className="relative">{children}</div>
    </motion.div>
  );
}

function ConstellationTimeline({ items, accent }: { items: SubEvent[]; accent: string }) {
  const reduce = useReducedMotion();
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <div className="mx-auto max-w-3xl px-6">
      <div className="relative">
        <motion.span
          aria-hidden
          className="absolute left-4 top-2 bottom-2 w-px"
          style={{ background: `linear-gradient(180deg, transparent, ${accent}55, transparent)`, transformOrigin: "top" }}
          initial={reduce ? undefined : { scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: EASE }}
        />
        <ol className="space-y-8">
          {sorted.map((s, i) => (
            <motion.li
              key={s.order}
              initial={reduce ? false : { opacity: 0, x: 12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: EASE }}
              className="relative pl-14"
            >
              <span
                aria-hidden
                className="absolute left-2 top-2 h-5 w-5 rounded-full"
                style={{
                  background: "#ffffff",
                  boxShadow: `0 0 12px ${accent}, 0 0 24px ${accent}77`,
                }}
              />
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] opacity-60">
                  {[s.date, s.startTime].filter(Boolean).join(" · ")}
                </p>
                <h3 className="mt-1 font-display text-2xl">{s.name}</h3>
                {s.venueName && <p className="mt-1 text-sm opacity-70">{s.venueName}</p>}
                {s.description && <p className="mt-2 text-sm leading-relaxed opacity-65">{s.description}</p>}
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export const ConstellaTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || "#7ff9ff";
  const tagline = event.tagline?.trim() || "Every star, its own line.";
  const invitationMessage = event.invitationMessage?.trim()
    || "An evening where the room is the point — and the connections you leave with are the whole return on investment.";
  const aboutStory = event.aboutStory?.trim()
    || "A network isn't a list. It's a shape — a constellation you draw one conversation at a time.";
  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const hero = event.heroImageUrl
    || "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80";

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroTextY = useTransform(heroP, [0, 1], [0, -60]);
  const heroOpacity = useTransform(heroP, [0, 0.7], [1, 0]);

  const showStory = !event.hideStory;
  const showJourney = !event.hideEvents && subEvents.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  return (
    <div
      className="relative min-h-screen overflow-x-clip bg-[#0a0a2e] font-sans text-[#c8c8e6] antialiased"
      style={{ "--accent": accent } as React.CSSProperties}
    >
      <StarField reduce={reduce} accent={accent} />
      <ScrollProgress color={accent} />

      <section ref={heroRef} className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-5">
        <motion.div style={reduce ? undefined : { y: heroTextY, opacity: heroOpacity }} className="relative z-10 max-w-4xl text-center">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-6 text-[10px] uppercase tracking-[0.6em]"
            style={{ color: accent, textShadow: `0 0 20px ${accent}` }}
          >
            {tagline}
          </motion.p>
          <h1 className="font-display text-[clamp(2.5rem,8vw,6rem)] font-light leading-[1.05] tracking-tight text-white">
            {event.eventTitle}
          </h1>
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mt-6 font-serif italic text-lg opacity-70 sm:text-xl"
          >
            {event.person1Name}
          </motion.p>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="mt-10 flex flex-wrap justify-center gap-4 text-xs uppercase tracking-[0.4em] opacity-70"
          >
            {event.mainDate && (
              <span>{new Date(event.mainDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</span>
            )}
            {event.mainStartTime && <><span className="opacity-40">·</span><span>{event.mainStartTime}</span></>}
            {event.city && <><span className="opacity-40">·</span><span>{event.city}</span></>}
          </motion.div>
        </motion.div>

        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <HeroMedia imageSrc={hero} videoSrc={event.heroVideoUrl || undefined} alt={event.eventTitle} className="opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a2e]/70 via-[#0a0a2e]/40 to-[#0a0a2e]" />
        </div>
      </section>

      {showStory && (
        <section className="relative mx-auto max-w-4xl px-6 py-24 sm:py-32">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-6 text-center text-[10px] uppercase tracking-[0.5em]"
            style={{ color: accent }}
          >
            The Invitation
          </motion.p>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE }}
            className="text-center font-display text-2xl leading-[1.35] text-white sm:text-3xl"
          >
            {invitationMessage}
          </motion.p>
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="mx-auto mt-10 max-w-2xl text-center text-base leading-relaxed opacity-70"
          >
            {aboutStory}
          </motion.p>
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
            The Arc of the Night
          </motion.p>
          <ConstellationTimeline items={subEvents} accent={accent} />
        </section>
      )}

      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-24">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-10 text-center text-[10px] uppercase tracking-[0.5em]"
            style={{ color: accent }}
          >
            Signals From Previous Rooms
          </motion.p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((m, i) => (
              <motion.div
                key={`${m.fileName}-${i}`}
                initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="group relative overflow-hidden rounded-xl"
                style={{ boxShadow: `0 0 0 1px rgba(255,255,255,0.06), 0 0 30px ${accent}22` }}
              >
                <img
                  src={m.publicUrl}
                  alt={m.caption ?? ""}
                  className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
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

      {showVenue && (
        <section className="relative mx-auto max-w-5xl px-6 py-24">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-6 text-center text-[10px] uppercase tracking-[0.5em]"
            style={{ color: accent }}
          >
            The Room
          </motion.p>
          <StarCard>
            <MapEmbed
              latitude={event.latitude}
              longitude={event.longitude}
              venueName={event.venueName}
              venueAddress={event.venueAddress}
              mapLink={event.mapLink}
            />
          </StarCard>
        </section>
      )}

      <section className="relative px-6 py-28 text-center sm:py-40">
        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE }}
          className="mx-auto max-w-2xl font-display text-[clamp(2rem,6vw,4rem)] font-light leading-[1.1] text-white"
        >
          Draw a line with us.
        </motion.h2>
        {event.rsvpEnabled && event.rsvpLinkOrContact && (
          <motion.a
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            whileHover={reduce ? undefined : { scale: 1.03 }}
            href={event.rsvpLinkOrContact}
            target="_blank"
            rel="noreferrer"
            className="mt-10 inline-block rounded-full border border-white/20 px-10 py-3 text-xs uppercase tracking-[0.35em] transition-all"
            style={{ color: accent, boxShadow: `0 0 30px ${accent}44` }}
          >
            Reserve a seat
          </motion.a>
        )}
      </section>

      <footer className="border-t border-white/[0.05] py-8 text-center text-xs opacity-40">
        <p>{event.eventTitle}{event.person1Name ? ` · ${event.person1Name}` : ""}</p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default ConstellaTemplate;
