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

const BRICK_RED = "#e63946";
const BRICK_YELLOW = "#f6b930";
const BRICK_BLUE = "#3d7dd8";
const BRICK_GREEN = "#3caf72";
const CREAM = "#faf5e6";
const INK = "#1e2a3a";

const BRICK_COLORS = [BRICK_RED, BRICK_YELLOW, BRICK_BLUE, BRICK_GREEN];

const CONFETTI = Array.from({ length: 14 }, (_, i) => ({
  left: `${(i * 137 + 11) % 96}%`,
  color: BRICK_COLORS[i % 4],
  w: 22 + (i % 3) * 10,
  h: 12 + (i % 2) * 4,
  delay: (i % 7) * 0.4,
  dur: 8 + (i % 5),
  rot: (i * 37) % 40 - 20,
}));

const ALBUM_BRICKS = Array.from({ length: 20 }, (_, i) => {
  const col = i % 5;
  const row = Math.floor(i / 5);
  return {
    left: `${8 + col * 17}%`,
    top: `${10 + row * 22}%`,
    color: BRICK_COLORS[(i * 3) % 4],
    w: 74 + (i % 3) * 12,
    h: 32,
    delay: (i * 0.05) % 0.9,
  };
});

function BrickStud({ color, size = 10 }: { color: string; size?: number }) {
  return (
    <span
      aria-hidden
      className="inline-block rounded-full"
      style={{
        width: size,
        height: size,
        background: color,
        boxShadow: `inset 0 -${Math.max(1, size / 6)}px 0 rgba(0,0,0,0.18), inset 0 ${Math.max(1, size / 8)}px 0 rgba(255,255,255,0.4)`,
      }}
    />
  );
}

function BrickLetter({ char, color, delay }: { char: string; color: string; delay: number }) {
  const reduce = useReducedMotion();
  if (char === " ") return <span className="inline-block w-3 sm:w-5" aria-hidden />;
  return (
    <motion.span
      initial={reduce ? false : { y: -80, opacity: 0, rotate: -8 }}
      animate={{ y: 0, opacity: 1, rotate: 0 }}
      transition={{ delay, duration: 0.55, ease: EASE, type: "spring", bounce: 0.45 }}
      className="relative inline-flex items-end justify-center align-bottom mx-[2px] sm:mx-[3px]"
      style={{
        background: color,
        color: INK,
        padding: "0.35em 0.32em 0.22em",
        borderRadius: "0.28em",
        boxShadow: `inset 0 -0.14em 0 rgba(0,0,0,0.18), inset 0 0.1em 0 rgba(255,255,255,0.35), 0 0.18em 0 rgba(0,0,0,0.15)`,
        lineHeight: 0.9,
        fontWeight: 900,
      }}
    >
      <span
        aria-hidden
        className="absolute -top-[0.22em] left-0 right-0 flex justify-around pointer-events-none"
        style={{ padding: "0 22%" }}
      >
        <BrickStud color={color} size={12} />
        <BrickStud color={color} size={12} />
      </span>
      {char}
    </motion.span>
  );
}

function BrickWordmark({ text }: { text: string }) {
  let idx = 0;
  return (
    <span className="inline-flex flex-wrap justify-center">
      {text.split(" ").map((word, wi) => (
        <span key={wi} className="inline-flex mx-1 sm:mx-2 my-1">
          {Array.from(word).map((ch) => {
            const color = BRICK_COLORS[idx % 4];
            const delay = 0.15 + idx * 0.07;
            idx += 1;
            return <BrickLetter key={`${wi}-${idx}`} char={ch} color={color} delay={delay} />;
          })}
        </span>
      ))}
    </span>
  );
}

function BrickModule({
  index,
  color,
  children,
  delay = 0,
}: {
  index: number;
  color: string;
  children: React.ReactNode;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 40, rotate: -2 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.55, delay, ease: EASE, type: "spring", bounce: 0.35 }}
      whileHover={reduce ? undefined : { y: -4, rotate: 0.5 }}
      className="relative pt-6"
    >
      <div
        aria-hidden
        className="absolute top-0 left-6 right-6 flex justify-between px-2"
        style={{ pointerEvents: "none" }}
      >
        <BrickStud color={color} size={20} />
        <BrickStud color={color} size={20} />
        <BrickStud color={color} size={20} />
      </div>
      <div
        className="relative rounded-[22px] p-6 sm:p-7"
        style={{
          background: color,
          color: INK,
          boxShadow: `inset 0 -6px 0 rgba(0,0,0,0.16), inset 0 3px 0 rgba(255,255,255,0.28), 0 8px 0 rgba(0,0,0,0.12)`,
        }}
      >
        <span className="absolute top-3 right-4 font-display text-[11px] font-black tracking-widest opacity-70">
          {String(index).padStart(2, "0")}
        </span>
        {children}
      </div>
    </motion.article>
  );
}

function BrickTimeline({ items }: { items: SubEvent[] }) {
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <div className="mx-auto max-w-5xl px-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((s, i) => {
          const color = BRICK_COLORS[i % 4];
          return (
            <BrickModule key={s.order} index={s.order} color={color} delay={i * 0.08}>
              <h3 className="font-display text-2xl font-black leading-tight">{s.name}</h3>
              <p className="mt-1 text-sm font-bold opacity-80">
                {[s.date, s.startTime].filter(Boolean).join(" · ")}
              </p>
              {s.venueName && <p className="mt-2 text-sm font-semibold opacity-75">@ {s.venueName}</p>}
              {s.description && <p className="mt-3 text-sm leading-relaxed opacity-85">{s.description}</p>}
              {s.dressCode && (
                <p
                  className="mt-4 inline-block rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wider"
                  style={{ background: CREAM, color: INK }}
                >
                  {s.dressCode}
                </p>
              )}
            </BrickModule>
          );
        })}
      </div>
    </div>
  );
}

function ConfettiBricks({ reduce }: { reduce: boolean }) {
  if (reduce) return null;
  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 h-32 z-[5] overflow-hidden">
      {CONFETTI.map((c, i) => (
        <motion.span
          key={i}
          className="absolute rounded-[4px]"
          style={{
            left: c.left,
            top: -20,
            width: c.w,
            height: c.h,
            background: c.color,
            boxShadow: "inset 0 -3px 0 rgba(0,0,0,0.18)",
          }}
          animate={{ x: [0, 30, -20, 0], y: [0, 40, 90, 30], rotate: [c.rot, c.rot + 180, c.rot + 360] }}
          transition={{ duration: c.dur, delay: c.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

export const BricktownTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || BRICK_RED;
  const tagline = event.tagline?.trim() || "Snap. Stack. Celebrate.";
  const invitationMessage =
    event.invitationMessage?.trim() ||
    "Grab your bricks and join us — we're building the best day ever, one block at a time.";
  const aboutStory = event.aboutStory?.trim() || "";
  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const hero =
    event.heroImageUrl ||
    "https://images.unsplash.com/photo-1558877385-8c1c1c1b26ae?auto=format&fit=crop&w=1600&q=80";

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroP, [0, 1], [0, 80]);
  const heroOpacity = useTransform(heroP, [0, 0.7], [1, 0]);

  const galleryRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: galleryP } = useScroll({
    target: galleryRef,
    offset: ["start end", "end start"],
  });
  const albumProgress = useTransform(galleryP, [0, 0.5], [0, 1]);

  const showStory = !event.hideStory;
  const showEvents = !event.hideEvents && subEvents.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-sans antialiased"
      style={{ "--accent": accent, background: CREAM, color: INK } as React.CSSProperties}
    >
      <ScrollProgress color={accent} />
      <ConfettiBricks reduce={reduce} />

      {/* HERO */}
      <section
        ref={heroRef}
        className="relative min-h-[100svh] flex items-center justify-center px-5 py-24 overflow-hidden"
      >
        <div className="absolute inset-0 opacity-25">
          <HeroMedia
            imageSrc={hero}
            videoSrc={event.heroVideoUrl || undefined}
            alt={event.eventTitle}
          />
          <div className="absolute inset-0" style={{ background: `${CREAM}cc` }} />
        </div>

        <motion.div
          style={reduce ? undefined : { y: heroY, opacity: heroOpacity }}
          className="relative z-10 text-center max-w-5xl mx-auto"
        >
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6 inline-block rounded-full px-5 py-2 font-display text-[11px] font-black uppercase tracking-[0.35em]"
            style={{ background: INK, color: CREAM }}
          >
            {tagline}
          </motion.p>
          <h1 className="font-display text-[clamp(2.4rem,10vw,7rem)] font-black leading-[0.95]">
            <BrickWordmark text={event.eventTitle} />
          </h1>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="mt-10 flex flex-wrap justify-center gap-3 text-sm font-bold"
          >
            {event.mainDate && (
              <span className="rounded-full px-5 py-2" style={{ background: BRICK_YELLOW, color: INK }}>
                {new Date(event.mainDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            )}
            {event.mainStartTime && (
              <span className="rounded-full px-5 py-2" style={{ background: BRICK_BLUE, color: CREAM }}>
                {event.mainStartTime}
              </span>
            )}
            {event.city && (
              <span className="rounded-full px-5 py-2" style={{ background: BRICK_GREEN, color: CREAM }}>
                {event.city}
              </span>
            )}
          </motion.div>
          {event.person1Name && (
            <p className="mt-6 font-display text-2xl font-black" style={{ color: BRICK_RED }}>
              For {event.person1Name}
            </p>
          )}
        </motion.div>
      </section>

      {/* STORY */}
      {showStory && (
        <section className="relative mx-auto max-w-5xl px-6 py-24">
          <div className="grid gap-10 sm:grid-cols-5 items-center">
            <div className="sm:col-span-3">
              <p className="mb-3 font-display text-[11px] font-black uppercase tracking-[0.4em]" style={{ color: BRICK_RED }}>
                The Blueprint
              </p>
              <h2 className="font-display text-3xl sm:text-5xl font-black leading-[1.05]">
                {invitationMessage}
              </h2>
              {aboutStory && (
                <p className="mt-6 text-lg leading-relaxed opacity-80">{aboutStory}</p>
              )}
            </div>
            <div className="sm:col-span-2">
              <BrickModule index={1} color={BRICK_YELLOW}>
                <p className="font-display text-lg font-black">Building blocks</p>
                <ul className="mt-3 space-y-2 text-sm font-bold">
                  <li>+ Games and giggles</li>
                  <li>+ Cake as tall as a tower</li>
                  <li>+ A million tiny bricks</li>
                  <li>+ You, obviously</li>
                </ul>
              </BrickModule>
            </div>
          </div>
        </section>
      )}

      {/* SUB-EVENTS */}
      {showEvents && (
        <section className="relative py-20 sm:py-28" style={{ background: INK, color: CREAM }}>
          <p className="mb-12 text-center font-display text-[11px] font-black uppercase tracking-[0.4em]" style={{ color: BRICK_YELLOW }}>
            The Build Order
          </p>
          <BrickTimeline items={subEvents} />
        </section>
      )}

      {/* GALLERY */}
      {showGallery && (
        <section ref={galleryRef} className="relative mx-auto max-w-6xl px-6 py-24 overflow-hidden">
          <p className="mb-10 text-center font-display text-[11px] font-black uppercase tracking-[0.4em]" style={{ color: BRICK_BLUE }}>
            The Album
          </p>
          <div className="relative">
            <div aria-hidden className="pointer-events-none absolute inset-0">
              {ALBUM_BRICKS.map((b, i) => (
                <motion.span
                  key={i}
                  className="absolute rounded-[6px]"
                  style={{
                    left: b.left,
                    top: b.top,
                    width: b.w,
                    height: b.h,
                    background: b.color,
                    opacity: 0.18,
                    boxShadow: "inset 0 -3px 0 rgba(0,0,0,0.2)",
                    scale: reduce ? 1 : (albumProgress as unknown as number),
                  }}
                  initial={reduce ? false : { scale: 0, y: -30, opacity: 0 }}
                  whileInView={{ scale: 1, y: 0, opacity: 0.18 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ duration: 0.4, delay: b.delay, ease: EASE }}
                />
              ))}
            </div>
            <div className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {galleryItems.map((m, i) => {
                const color = BRICK_COLORS[i % 4];
                return (
                  <motion.figure
                    key={`${m.fileName}-${i}`}
                    initial={reduce ? false : { opacity: 0, y: 24, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-8% 0px" }}
                    transition={{ duration: 0.5, delay: (i % 6) * 0.06, ease: EASE, type: "spring", bounce: 0.3 }}
                    className="relative pt-4"
                  >
                    <div
                      aria-hidden
                      className="absolute top-0 left-6 right-6 flex justify-between px-2"
                    >
                      <BrickStud color={color} size={16} />
                      <BrickStud color={color} size={16} />
                      <BrickStud color={color} size={16} />
                    </div>
                    <div
                      className="rounded-[18px] p-2"
                      style={{
                        background: color,
                        boxShadow: `inset 0 -5px 0 rgba(0,0,0,0.18), 0 6px 0 rgba(0,0,0,0.1)`,
                      }}
                    >
                      <img
                        src={m.publicUrl}
                        alt={m.caption ?? ""}
                        className="block aspect-[4/5] w-full rounded-[12px] object-cover"
                        loading="lazy"
                      />
                      {m.caption && (
                        <figcaption
                          className="mt-2 px-2 pb-1 font-display text-xs font-black uppercase tracking-wider"
                          style={{ color: INK }}
                        >
                          {m.caption}
                        </figcaption>
                      )}
                    </div>
                  </motion.figure>
                );
              })}
              {editing && galleryItems.length === 0 && (
                <div
                  className="col-span-full flex h-56 items-center justify-center rounded-[18px] text-sm font-bold"
                  style={{ border: `3px dashed ${INK}40`, color: `${INK}80` }}
                >
                  + Add photos
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* VENUE */}
      {showVenue && (
        <section className="relative mx-auto max-w-5xl px-6 py-24">
          <p className="mb-4 text-center font-display text-[11px] font-black uppercase tracking-[0.4em]" style={{ color: BRICK_GREEN }}>
            The Building Site
          </p>
          {event.venueName && (
            <h2 className="mb-8 text-center font-display text-3xl sm:text-4xl font-black">
              {event.venueName}
            </h2>
          )}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            className="rounded-[22px] p-3"
            style={{
              background: BRICK_YELLOW,
              boxShadow: `inset 0 -5px 0 rgba(0,0,0,0.16), 0 8px 0 rgba(0,0,0,0.1)`,
            }}
          >
            <div className="overflow-hidden rounded-[14px]">
              <MapEmbed
                latitude={event.latitude}
                longitude={event.longitude}
                venueName={event.venueName}
                venueAddress={event.venueAddress}
                mapLink={event.mapLink}
              />
            </div>
          </motion.div>
        </section>
      )}

      {/* RSVP / CTA */}
      <section className="relative px-6 py-24 text-center">
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE, type: "spring", bounce: 0.35 }}
          className="mx-auto max-w-3xl"
        >
          <h2 className="font-display text-[clamp(2rem,7vw,4.5rem)] font-black leading-[1]">
            <BrickWordmark text="Come Build With Us" />
          </h2>
          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <motion.a
              whileHover={reduce ? undefined : { y: -3, scale: 1.03 }}
              whileTap={reduce ? undefined : { y: 2, scale: 0.98 }}
              href={event.rsvpLinkOrContact}
              target="_blank"
              rel="noreferrer"
              className="mt-10 inline-block rounded-full px-10 py-4 font-display text-sm font-black uppercase tracking-[0.35em]"
              style={{
                background: BRICK_RED,
                color: CREAM,
                boxShadow: `inset 0 -5px 0 rgba(0,0,0,0.22), 0 6px 0 rgba(0,0,0,0.15)`,
              }}
            >
              RSVP now
            </motion.a>
          )}
        </motion.div>
      </section>

      <footer
        className="py-8 text-center text-xs font-bold"
        style={{ background: INK, color: `${CREAM}b0` }}
      >
        <p>
          {event.eventTitle}
          {event.person1Name ? ` · ${event.person1Name}` : ""}
        </p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default BricktownTemplate;
