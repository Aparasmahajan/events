"use client";

import { useMemo, useRef, useState } from "react";
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
const WARM = "#f5e2d8";
const ROSE = "#c87878";
const COOL = "#dde4ee";
const BLUE = "#6888aa";
const PEARL = "#f2f0ec";
const INK = "#2e2a30";
const DUAL = `linear-gradient(90deg, ${ROSE}, ${BLUE})`;

function MirrorHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  const reduce = useReducedMotion();
  const ornament = (flip: boolean) => (
    <svg aria-hidden width="52" height="12" viewBox="0 0 52 12" className="shrink-0" style={{ transform: flip ? "scaleX(-1)" : undefined }}>
      <path d="M0 6 H38" stroke={flip ? BLUE : ROSE} strokeWidth="1" opacity="0.5" />
      <path d="M44 1 L50 6 L44 11 L38 6 Z" fill="none" stroke={flip ? BLUE : ROSE} strokeWidth="1" />
    </svg>
  );
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.8, ease: EASE }}
      className="mb-12 text-center"
    >
      <p className="mb-3 text-[10px] uppercase tracking-[0.5em]" style={{ color: BLUE }}>{eyebrow}</p>
      <div className="flex items-center justify-center gap-4">
        {ornament(false)}
        <h2 className="font-display text-3xl leading-tight sm:text-4xl" style={{ color: INK }}>{title}</h2>
        {ornament(true)}
      </div>
      <div className="mx-auto mt-5 h-[2px] w-24 rounded-full" style={{ background: DUAL }} />
    </motion.div>
  );
}

function MirrorTimeline({ items }: { items: SubEvent[] }) {
  const reduce = useReducedMotion();
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <div className="relative mx-auto max-w-4xl px-6">
      <div aria-hidden className="absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 sm:block" style={{ background: `linear-gradient(180deg, ${ROSE}, ${BLUE})`, opacity: 0.35 }} />
      <div className="space-y-8">
        {sorted.map((s, i) => {
          const warm = i % 2 === 0;
          return (
            <motion.article
              key={s.order}
              initial={reduce ? false : { opacity: 0, x: warm ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.7, delay: i * 0.06, ease: EASE }}
              className={`sm:w-[calc(50%-2rem)] ${warm ? "sm:mr-auto" : "sm:ml-auto"}`}
            >
              <div className="rounded-2xl border p-6" style={{ background: warm ? WARM : COOL, borderColor: warm ? `${ROSE}55` : `${BLUE}55` }}>
                <p className="text-[10px] uppercase tracking-[0.35em]" style={{ color: warm ? ROSE : BLUE }}>
                  {String(s.order).padStart(2, "0")}
                  {[s.date, s.startTime].filter(Boolean).length > 0 && ` · ${[s.date, s.startTime].filter(Boolean).join(" · ")}`}
                </p>
                <h3 className="mt-2 font-display text-2xl" style={{ color: INK }}>{s.name}</h3>
                {s.venueName && <p className="mt-1 text-sm" style={{ color: INK, opacity: 0.65 }}>{s.venueName}</p>}
                {s.description && <p className="mt-2 text-sm leading-relaxed" style={{ color: INK, opacity: 0.7 }}>{s.description}</p>}
                {s.dressCode && (
                  <p className="mt-3 inline-block rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.2em]" style={{ borderColor: warm ? ROSE : BLUE, color: warm ? ROSE : BLUE }}>
                    {s.dressCode}
                  </p>
                )}
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}

export const MirrorworldsTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;
  const [hovered, setHovered] = useState<number | null>(null);

  const accent = event.themeAccentColor || ROSE;
  const tagline = event.tagline?.trim() || "Two worlds, one reflection.";
  const invitationMessage = event.invitationMessage?.trim() || "From opposite sides of the glass, two lives leaned closer — until the seam between them disappeared. Join us where our worlds become one.";
  const aboutStory = event.aboutStory?.trim() || "One of us arrived from the warm side of everything; the other from the cool. Somewhere in the middle we found a color neither of us had a name for, and decided to live there.";
  const hero = event.heroImageUrl || "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1600&q=80";
  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const twoWorlds = !!event.person2Name?.trim();

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const warmTint = useTransform(heroP, [0, 0.85], [0.92, 0]);
  const coolTint = useTransform(heroP, [0, 0.85], [0.92, 0]);
  const seamOpacity = useTransform(heroP, [0, 0.7], [1, 0]);
  const leftX = useTransform(heroP, [0, 1], ["0%", "6%"]);
  const rightX = useTransform(heroP, [0, 1], ["0%", "-6%"]);
  const heroTextOpacity = useTransform(heroP, [0, 0.6], [1, 0]);

  const showStory = !event.hideStory;
  const showEvents = !event.hideEvents && subEvents.length > 0;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);
  const showVenue = !event.hideVenue;

  const mirrorOf = (i: number) => galleryItems.length - 1 - i;

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-sans antialiased"
      style={{ "--accent": accent, background: PEARL, color: INK } as React.CSSProperties}
    >
      <ScrollProgress color={accent} />

      {/* ─── Hero: split worlds ─── */}
      <section ref={heroRef} className="relative flex h-[100svh] min-h-[620px] items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <HeroMedia imageSrc={hero} videoSrc={event.heroVideoUrl || undefined} alt={event.eventTitle} className="opacity-60" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 40%, ${PEARL})` }} />
        </div>
        {twoWorlds ? (
          <>
            <motion.div aria-hidden className="absolute inset-y-0 left-0 w-1/2" style={{ opacity: reduce ? 0.92 : warmTint, background: `linear-gradient(135deg, ${WARM}, ${ROSE}cc)` }} />
            <motion.div aria-hidden className="absolute inset-y-0 right-0 w-1/2" style={{ opacity: reduce ? 0.92 : coolTint, background: `linear-gradient(225deg, ${COOL}, ${BLUE}cc)` }} />
            <motion.div aria-hidden className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2" style={{ opacity: reduce ? 1 : seamOpacity, background: `linear-gradient(180deg, transparent, ${INK}66, transparent)` }} />
          </>
        ) : (
          <div aria-hidden className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${WARM}dd, ${PEARL}cc, ${COOL}dd)` }} />
        )}
        <motion.div style={reduce ? undefined : { opacity: heroTextOpacity }} className="relative z-10 w-full px-6 text-center">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="mb-8 text-[11px] uppercase tracking-[0.6em]"
            style={{ color: INK, opacity: 0.7 }}
          >
            {tagline}
          </motion.p>
          {twoWorlds ? (
            <div className="grid items-center gap-4 sm:grid-cols-[1fr_auto_1fr]">
              <motion.h1 style={reduce ? undefined : { x: leftX }} className="font-display text-[clamp(2.4rem,7vw,5.5rem)] leading-none sm:text-right" >
                <span style={{ color: ROSE }}>{event.person1Name}</span>
              </motion.h1>
              <motion.span
                initial={reduce ? false : { opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.8, ease: EASE }}
                className="font-display text-2xl sm:text-3xl"
                style={{ color: INK, opacity: 0.55 }}
              >
                &amp;
              </motion.span>
              <motion.h1 style={reduce ? undefined : { x: rightX }} className="font-display text-[clamp(2.4rem,7vw,5.5rem)] leading-none sm:text-left">
                <span style={{ color: BLUE }}>{event.person2Name}</span>
              </motion.h1>
            </div>
          ) : (
            <h1 className="font-display text-[clamp(2.8rem,9vw,6.5rem)] leading-none" style={{ color: INK }}>
              {event.person1Name || event.eventTitle}
            </h1>
          )}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4 text-xs uppercase tracking-[0.35em]"
            style={{ color: INK, opacity: 0.75 }}
          >
            {event.mainDate && <span>{new Date(event.mainDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</span>}
            {event.city && <><span aria-hidden style={{ background: DUAL, width: 24, height: 2, borderRadius: 2, display: "inline-block" }} /><span>{event.city}</span></>}
          </motion.div>
        </motion.div>
      </section>

      {/* ─── Story: fully merged ─── */}
      {showStory && (
        <section className="relative mx-auto max-w-3xl px-6 py-24 sm:py-32 text-center">
          <MirrorHeading eyebrow="Where the seam disappears" title="Our two worlds" />
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE }}
            className="font-display text-2xl leading-snug sm:text-3xl"
            style={{ color: INK }}
          >
            {invitationMessage}
          </motion.p>
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 0.7 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="mt-8 text-base leading-relaxed sm:text-lg"
            style={{ color: INK }}
          >
            {aboutStory}
          </motion.p>
        </section>
      )}

      {/* ─── Sub-events ─── */}
      {showEvents && (
        <section className="relative py-20 sm:py-28">
          <MirrorHeading eyebrow="Reflections in sequence" title="The celebrations" />
          <MirrorTimeline items={subEvents} />
        </section>
      )}

      {/* ─── Gallery: symmetric, mirrored hover ─── */}
      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <MirrorHeading eyebrow="Connected across dimensions" title="Moments in the mirror" />
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {galleryItems.map((m, i) => {
              const lit = hovered !== null && (i === hovered || i === mirrorOf(hovered));
              return (
                <motion.figure
                  key={`${m.fileName}-${i}`}
                  initial={reduce ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.04, ease: EASE }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  className="group relative m-0 overflow-hidden rounded-2xl transition-all duration-500"
                  style={{ boxShadow: lit ? `0 0 0 2px ${i <= mirrorOf(i) ? ROSE : BLUE}, 0 12px 30px ${INK}22` : "none", transform: lit && !reduce ? "translateY(-4px)" : undefined }}
                >
                  <img src={m.publicUrl} alt={m.caption ?? ""} loading="lazy" className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  {m.caption && (
                    <figcaption className="absolute inset-x-0 bottom-0 p-3 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100" style={{ background: `linear-gradient(0deg, ${INK}cc, transparent)` }}>
                      {m.caption}
                    </figcaption>
                  )}
                </motion.figure>
              );
            })}
            {editing && galleryItems.length === 0 && (
              <div className="col-span-full flex h-48 items-center justify-center rounded-2xl border border-dashed text-sm" style={{ borderColor: `${INK}44`, color: INK, opacity: 0.6 }}>
                + Add photos
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── Venue ─── */}
      {showVenue && (
        <section className="relative mx-auto max-w-5xl px-6 py-20 sm:py-28">
          <MirrorHeading eyebrow="One meeting point" title={event.venueName || "The venue"} />
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="overflow-hidden rounded-2xl p-[2px]"
            style={{ background: DUAL }}
          >
            <div className="overflow-hidden rounded-[14px]" style={{ background: PEARL }}>
              <MapEmbed latitude={event.latitude} longitude={event.longitude} venueName={event.venueName} venueAddress={event.venueAddress} mapLink={event.mapLink} />
            </div>
          </motion.div>
        </section>
      )}

      {/* ─── CTA / RSVP: the gradient ring ─── */}
      <section className="relative px-6 py-24 text-center sm:py-36">
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE }}
          className="mx-auto flex max-w-md flex-col items-center"
        >
          <div className="rounded-full p-[3px]" style={{ background: `conic-gradient(from 180deg, ${ROSE}, ${BLUE}, ${ROSE})` }}>
            <div className="flex h-44 w-44 flex-col items-center justify-center rounded-full sm:h-52 sm:w-52" style={{ background: PEARL }}>
              <span className="font-display text-3xl sm:text-4xl" style={{ color: INK }}>
                <span style={{ color: ROSE }}>{(event.person1Name || "A").charAt(0)}</span>
                <span className="mx-1" style={{ opacity: 0.4 }}>&amp;</span>
                <span style={{ color: BLUE }}>{(event.person2Name || event.eventTitle).charAt(0)}</span>
              </span>
              {event.mainDate && (
                <span className="mt-2 text-[10px] uppercase tracking-[0.3em]" style={{ color: INK, opacity: 0.6 }}>
                  {new Date(event.mainDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              )}
            </div>
          </div>
          <h2 className="mt-10 font-display text-3xl sm:text-4xl" style={{ color: INK }}>{event.eventTitle}</h2>
          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <motion.a
              whileHover={reduce ? undefined : { scale: 1.04, y: -2 }}
              href={event.rsvpLinkOrContact}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-block rounded-full px-12 py-4 text-sm uppercase tracking-[0.3em] text-white"
              style={{ background: DUAL, boxShadow: `0 10px 30px ${BLUE}44` }}
            >
              Be there when they meet
            </motion.a>
          )}
        </motion.div>
      </section>

      <footer className="py-8 text-center text-xs" style={{ color: INK, opacity: 0.5, borderTop: `1px solid ${INK}18` }}>
        <p>{[event.person1Name, event.person2Name].filter(Boolean).join(" · ") || event.eventTitle}</p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default MirrorworldsTemplate;
