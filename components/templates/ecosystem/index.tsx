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

const LEAVES = Array.from({ length: 18 }, (_, i) => ({
  x: `${(i * 53 + 11) % 100}%`,
  delay: (i % 6) * 1.4,
  dur: 14 + (i % 5) * 3,
  size: 8 + (i % 4) * 3,
  rot: (i * 47) % 360,
  drift: ((i % 3) - 1) * 40,
}));

const BRANCHES = [
  { d: "M 200 340 C 200 260 130 220 90 170", x: 90, y: 170 },
  { d: "M 200 340 C 200 250 170 200 150 130", x: 150, y: 130 },
  { d: "M 200 340 C 200 240 210 190 220 110", x: 220, y: 110 },
  { d: "M 200 340 C 200 250 260 210 290 150", x: 290, y: 150 },
  { d: "M 200 340 C 200 270 300 240 340 200", x: 340, y: 200 },
] as const;

function LeafField({ reduce, accent, highlight }: { reduce: boolean; accent: string; highlight: string }) {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, #f5f2ea 0%, #efe9d9 55%, #e8e2d0 100%)" }}
      />
      {!reduce && (
        <div className="absolute inset-0">
          {LEAVES.map((l, i) => (
            <motion.svg
              key={i}
              className="absolute"
              style={{ left: l.x, top: "-8%", width: l.size, height: l.size * 1.6 }}
              viewBox="0 0 10 16"
              animate={{
                y: ["0vh", "115vh"],
                x: [0, l.drift, -l.drift, 0],
                rotate: [l.rot, l.rot + 180, l.rot + 360],
                opacity: [0, 0.55, 0.55, 0],
              }}
              transition={{ duration: l.dur, delay: l.delay, repeat: Infinity, ease: "linear" }}
            >
              <path
                d="M5 0 C 8 4 10 8 5 16 C 0 8 2 4 5 0 Z"
                fill={i % 3 === 0 ? highlight : accent}
                opacity={0.35}
              />
            </motion.svg>
          ))}
        </div>
      )}
      <svg className="absolute inset-0 h-full w-full opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
        <filter id="eco-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" />
        </filter>
        <rect width="100%" height="100%" filter="url(#eco-noise)" />
      </svg>
    </div>
  );
}

function GrowingTree({ accent, terracotta, highlight, reduce }: { accent: string; terracotta: string; highlight: string; reduce: boolean }) {
  return (
    <svg viewBox="0 0 400 400" className="mx-auto h-64 w-64 sm:h-80 sm:w-80" aria-hidden>
      <motion.path
        d="M 200 400 L 200 340"
        stroke={accent}
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
        initial={reduce ? false : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, margin: "-15% 0px" }}
        transition={{ duration: 1.2, ease: EASE }}
      />
      {BRANCHES.map((b, i) => (
        <g key={i}>
          <motion.path
            d={b.d}
            stroke={accent}
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
            initial={reduce ? false : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 1.4, delay: 0.6 + i * 0.15, ease: EASE }}
          />
          <motion.circle
            cx={b.x}
            cy={b.y}
            r="8"
            fill={i % 2 === 0 ? terracotta : highlight}
            initial={reduce ? false : { scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 0.6, delay: 1.6 + i * 0.15, ease: EASE }}
          />
          <motion.circle
            cx={b.x}
            cy={b.y}
            r="14"
            fill="none"
            stroke={i % 2 === 0 ? terracotta : highlight}
            strokeWidth="1"
            opacity="0.4"
            initial={reduce ? false : { scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 0.4 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 0.8, delay: 1.8 + i * 0.15 }}
          />
        </g>
      ))}
      <motion.circle
        cx="200"
        cy="340"
        r="10"
        fill={accent}
        initial={reduce ? false : { scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "-15% 0px" }}
        transition={{ duration: 0.5, delay: 0.3 }}
      />
    </svg>
  );
}

function NetworkTimeline({ items, accent, terracotta }: { items: SubEvent[]; accent: string; terracotta: string }) {
  const reduce = useReducedMotion();
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <div className="relative mx-auto max-w-5xl px-6">
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden h-full w-full sm:block"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        {sorted.slice(0, -1).map((_, i) => {
          const startX = i % 2 === 0 ? 25 : 75;
          const endX = i % 2 === 0 ? 75 : 25;
          const y1 = 10 + (i * 80) / Math.max(sorted.length - 1, 1);
          const y2 = 10 + ((i + 1) * 80) / Math.max(sorted.length - 1, 1);
          const cx = 50;
          return (
            <motion.path
              key={i}
              d={`M ${startX} ${y1} Q ${cx} ${(y1 + y2) / 2} ${endX} ${y2}`}
              stroke={terracotta}
              strokeWidth="0.3"
              fill="none"
              strokeDasharray="1 1.5"
              initial={reduce ? false : { pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.55 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 1.3, delay: i * 0.2, ease: EASE }}
            />
          );
        })}
      </svg>
      <div className="relative space-y-8 sm:space-y-14">
        {sorted.map((s, i) => (
          <motion.article
            key={s.order}
            initial={reduce ? false : { opacity: 0, y: 24, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.7, delay: i * 0.12, ease: EASE }}
            className={`relative sm:w-1/2 ${i % 2 === 0 ? "sm:pr-10" : "sm:ml-auto sm:pl-10"}`}
          >
            <div
              className="rounded-2xl border p-6 shadow-sm backdrop-blur-sm"
              style={{ borderColor: `${accent}22`, background: "rgba(255, 253, 246, 0.72)" }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold"
                  style={{ background: accent, color: "#fdfaf1" }}
                >
                  {String(s.order).padStart(2, "0")}
                </span>
                <span className="text-[10px] uppercase tracking-[0.28em] text-[#2a2015]/60">
                  {[s.date, s.startTime].filter(Boolean).join(" · ")}
                </span>
              </div>
              <h3 className="mt-4 font-display text-2xl tracking-tight text-[#2a2015]">{s.name}</h3>
              {s.venueName && (
                <p className="mt-1 font-display italic text-sm text-[#2a2015]/70">at {s.venueName}</p>
              )}
              {s.description && <p className="mt-3 text-sm leading-relaxed text-[#2a2015]/70">{s.description}</p>}
              {s.dressCode && (
                <p
                  className="mt-4 inline-block rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.22em]"
                  style={{ background: `${terracotta}18`, color: terracotta }}
                >
                  {s.dressCode}
                </p>
              )}
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

export const EcosystemTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || "#1a5442";
  const terracotta = "#c4643c";
  const highlight = "#e8c458";
  const tagline = event.tagline?.trim() || "A living network takes root";
  const invitationMessage =
    event.invitationMessage?.trim() ||
    "Every connection is a seed. Every conversation, a root. Come help this ecosystem grow into something none of us could imagine alone.";
  const aboutStory = event.aboutStory?.trim() || "";
  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const hero =
    event.heroImageUrl ||
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1600&q=80";

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroTextY = useTransform(heroP, [0, 1], [0, -60]);
  const heroOpacity = useTransform(heroP, [0, 0.6], [1, 0]);

  const showStory = !event.hideStory;
  const showJourney = !event.hideEvents && subEvents.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-sans text-[#2a2015] antialiased"
      style={{ "--accent": accent, background: "#f5f2ea" } as React.CSSProperties}
    >
      <LeafField reduce={reduce} accent={accent} highlight={highlight} />
      <ScrollProgress color={accent} />

      {/* Hero — growing tree */}
      <section ref={heroRef} className="relative min-h-[100svh] overflow-hidden px-6 pt-24 pb-16 sm:pt-32">
        <div className="absolute inset-0 opacity-25">
          <HeroMedia
            imageSrc={hero}
            videoSrc={event.heroVideoUrl || undefined}
            alt={event.eventTitle}
            className="opacity-90"
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, rgba(245,242,234,0.7) 0%, rgba(245,242,234,0.95) 100%)" }}
          />
        </div>

        <motion.div
          style={reduce ? undefined : { y: heroTextY, opacity: heroOpacity }}
          className="relative z-10 mx-auto max-w-4xl text-center"
        >
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="mb-4 text-[11px] uppercase tracking-[0.5em]"
            style={{ color: terracotta }}
          >
            {tagline}
          </motion.p>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.15, ease: EASE }}
            className="font-display text-[clamp(2.6rem,8vw,5.5rem)] font-medium leading-[0.98] tracking-tight"
            style={{ color: accent }}
          >
            {event.eventTitle}
          </motion.h1>
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-3 font-display text-xl italic text-[#2a2015]/70 sm:text-2xl"
          >
            an ecosystem in bloom
          </motion.p>

          <GrowingTree accent={accent} terracotta={terracotta} highlight={highlight} reduce={reduce} />

          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.6, duration: 0.9 }}
            className="mt-2 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs uppercase tracking-[0.32em] text-[#2a2015]/70"
          >
            {event.mainDate && (
              <span>
                {new Date(event.mainDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            )}
            {event.mainStartTime && <span style={{ color: terracotta }}>❧</span>}
            {event.mainStartTime && <span>{event.mainStartTime}</span>}
            {event.city && <><span style={{ color: terracotta }}>❧</span><span>{event.city}</span></>}
          </motion.div>
        </motion.div>
      </section>

      {/* Story — invitation */}
      {showStory && (
        <section className="relative mx-auto max-w-5xl px-6 py-24 sm:py-32">
          <div className="grid items-center gap-14 sm:grid-cols-5">
            <motion.div
              initial={reduce ? false : { opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: EASE }}
              className="sm:col-span-2"
            >
              <p className="mb-3 text-[10px] uppercase tracking-[0.45em]" style={{ color: terracotta }}>
                The Invitation
              </p>
              <h2 className="font-display text-3xl leading-[1.15] tracking-tight sm:text-4xl" style={{ color: accent }}>
                Where nodes become
                <span className="italic"> forests.</span>
              </h2>
            </motion.div>
            <motion.div
              initial={reduce ? false : { opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.15, ease: EASE }}
              className="sm:col-span-3"
            >
              <p className="text-lg leading-relaxed text-[#2a2015]/80">{invitationMessage}</p>
              {aboutStory && (
                <p className="mt-5 border-l-2 pl-5 font-display text-base italic leading-relaxed text-[#2a2015]/70" style={{ borderColor: terracotta }}>
                  {aboutStory}
                </p>
              )}
              <motion.div
                className="mt-8 h-px w-full"
                style={{ background: `linear-gradient(90deg, transparent, ${accent}, ${terracotta}, transparent)` }}
                animate={reduce ? undefined : { opacity: [0.25, 0.85, 0.25] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* Sub-events — living network */}
      {showJourney && (
        <section className="relative py-24 sm:py-32">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="mb-16 text-center"
          >
            <p className="mb-2 text-[10px] uppercase tracking-[0.45em]" style={{ color: terracotta }}>
              The Network
            </p>
            <h2 className="font-display text-3xl tracking-tight sm:text-4xl" style={{ color: accent }}>
              How the days <span className="italic">connect</span>
            </h2>
          </motion.div>
          <NetworkTimeline items={subEvents} accent={accent} terracotta={terracotta} />
        </section>
      )}

      {/* Gallery — organic leaf-clipped tiles */}
      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-14 text-center"
          >
            <p className="mb-2 text-[10px] uppercase tracking-[0.45em]" style={{ color: terracotta }}>
              The Grove
            </p>
            <h2 className="font-display text-3xl tracking-tight sm:text-4xl" style={{ color: accent }}>
              Fragments <span className="italic">from the field</span>
            </h2>
          </motion.div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((m, i) => {
              const leafClip =
                i % 3 === 0
                  ? "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)"
                  : i % 3 === 1
                  ? "ellipse(50% 60% at 50% 50%)"
                  : "polygon(0 20%, 40% 0, 100% 15%, 100% 80%, 60% 100%, 0 85%)";
              return (
                <motion.figure
                  key={`${m.fileName}-${i}`}
                  initial={reduce ? false : { opacity: 0, scale: 0.9, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, margin: "-8% 0px" }}
                  transition={{ duration: 0.7, delay: i * 0.06, ease: EASE }}
                  className="group relative overflow-hidden"
                  style={{ clipPath: leafClip }}
                >
                  <img
                    src={m.publicUrl}
                    alt={m.caption ?? ""}
                    loading="lazy"
                    className="aspect-[4/5] w-full object-cover transition-transform duration-[900ms] group-hover:scale-105"
                  />
                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{ background: `linear-gradient(180deg, transparent 40%, ${accent}cc)` }}
                  />
                  {m.caption && (
                    <figcaption className="pointer-events-none absolute bottom-4 left-4 right-4 font-display text-sm italic text-[#fdfaf1] opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      {m.caption}
                    </figcaption>
                  )}
                </motion.figure>
              );
            })}
            {editing && galleryItems.length === 0 && (
              <div
                className="col-span-full flex h-48 items-center justify-center rounded-2xl border border-dashed text-sm"
                style={{ borderColor: `${accent}55`, color: `${accent}aa` }}
              >
                + Add photos
              </div>
            )}
          </div>
        </section>
      )}

      {/* Venue — the ground */}
      {showVenue && (
        <section className="relative mx-auto max-w-5xl px-6 py-24 sm:py-32">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="mb-10 text-center"
          >
            <p className="mb-2 text-[10px] uppercase tracking-[0.45em]" style={{ color: terracotta }}>
              The Ground
            </p>
            <h2 className="font-display text-3xl tracking-tight sm:text-4xl" style={{ color: accent }}>
              Where <span className="italic">roots take hold</span>
            </h2>
            {event.venueName && (
              <p className="mt-3 font-display text-xl italic text-[#2a2015]/80">{event.venueName}</p>
            )}
            {event.venueAddress && <p className="mt-1 text-sm text-[#2a2015]/60">{event.venueAddress}</p>}
          </motion.div>
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE }}
            className="overflow-hidden rounded-3xl border p-1 shadow-lg"
            style={{ borderColor: `${accent}33`, background: "rgba(255, 253, 246, 0.6)" }}
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
      <section className="relative px-6 py-28 text-center sm:py-40">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: EASE }}
          className="mx-auto max-w-3xl"
        >
          <motion.div
            aria-hidden
            animate={reduce ? undefined : { scale: [1, 1.08, 1], opacity: [0.35, 0.55, 0.35] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="mx-auto mb-8 h-24 w-24 rounded-full"
            style={{
              background: `radial-gradient(circle, ${highlight}, transparent 70%)`,
              filter: "blur(18px)",
            }}
          />
          <p className="mb-3 text-[10px] uppercase tracking-[0.45em]" style={{ color: terracotta }}>
            Join the ecosystem
          </p>
          <h2 className="font-display text-[clamp(2.2rem,6vw,4rem)] leading-[1.05] tracking-tight" style={{ color: accent }}>
            Become a <span className="italic">node.</span>
          </h2>
          {event.person1Name && (
            <p className="mt-6 font-display text-lg italic text-[#2a2015]/70">
              hosted by {event.person1Name}
              {event.person2Name ? ` & ${event.person2Name}` : ""}
            </p>
          )}
          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <motion.div whileHover={reduce ? undefined : { y: -2 }} className="mt-10 inline-block">
              <a
                href={event.rsvpLinkOrContact}
                target="_blank"
                rel="noreferrer"
                className="inline-block rounded-full px-12 py-4 text-sm uppercase tracking-[0.32em] shadow-md transition-all"
                style={{ background: accent, color: "#fdfaf1" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 12px 32px ${accent}55`;
                  e.currentTarget.style.background = terracotta;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "";
                  e.currentTarget.style.background = accent;
                }}
              >
                Take root with us
              </a>
            </motion.div>
          )}
        </motion.div>
      </section>

      <footer
        className="border-t py-8 text-center text-xs tracking-[0.25em]"
        style={{ borderColor: `${accent}22`, color: `${accent}99` }}
      >
        <p className="uppercase">
          {event.eventTitle}
          {event.person1Name ? ` · ${event.person1Name}` : ""}
        </p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default EcosystemTemplate;
