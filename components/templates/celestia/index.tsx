"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { HeroMedia } from "@/components/ui/HeroMedia";
import { MapEmbed } from "@/components/ui/MapEmbed";
import { Countdown } from "@/components/ui/Countdown";
import { MusicToggle } from "@/components/ui/MusicToggle";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { AddToCalendar } from "@/components/ui/AddToCalendar";
import { RSVP } from "@/components/ui/RSVP";
import { EditableImage } from "@/components/edit/EditableImage";
import { useEditMode } from "@/components/edit/EditContext";
import { celestiaMeta } from "@/components/templates/metadata";
import { Magnetic, Reveal, WordReveal, useReduce } from "@/components/templates/_fx";
import type { MediaItem, TemplateComponent } from "@/lib/types";

const defaults = celestiaMeta.defaults;

const REFRACTION =
  "conic-gradient(from 0deg, transparent, #a9d3e6aa, transparent 30%, #c9b8f0aa 55%, transparent 75%, #ffffffcc, transparent)";

/* The signature: the couple's photograph sealed inside a glass orb — the photo
 * stays still while the refraction turns with scroll (and a faint band drifts). */
function GlassSphere({
  imageSrc,
  alt,
  scrollRot,
}: {
  imageSrc: string;
  alt: string;
  scrollRot: MotionValue<number>;
}) {
  const reduce = useReduce();
  return (
    <div className="relative mx-auto aspect-square w-[72vw] max-w-[520px]">
      <div
        aria-hidden
        className="absolute inset-[-8%] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle at 50% 45%, var(--accent), transparent 65%)", opacity: 0.4 }}
      />
      <div className="absolute inset-0 overflow-hidden rounded-full shadow-[0_40px_120px_-30px_rgba(80,70,120,0.6)] ring-1 ring-white/70">
        <HeroMedia imageSrc={imageSrc} alt={alt} className="opacity-95" />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: "radial-gradient(circle at 34% 26%, rgba(255,255,255,0.4), rgba(201,184,240,0.18) 55%, rgba(124,107,176,0.4))" }}
        />
        <motion.div
          aria-hidden
          className="absolute inset-[-25%] mix-blend-screen"
          style={reduce ? undefined : { rotate: scrollRot, background: REFRACTION }}
        />
        <motion.div
          aria-hidden
          className="absolute inset-[-25%] mix-blend-screen opacity-50"
          style={{ background: REFRACTION }}
          animate={reduce ? undefined : { rotate: 360 }}
          transition={reduce ? undefined : { duration: 26, repeat: Infinity, ease: "linear" }}
        />
        <div aria-hidden className="absolute left-[16%] top-[12%] h-1/4 w-1/4 rounded-full bg-white/70 blur-xl" />
      </div>
      <div aria-hidden className="absolute inset-0 rounded-full ring-1 ring-white/70" />
    </div>
  );
}

/* A floating, glass-framed photo with gentle scroll parallax. */
function FloatingPhoto({
  item,
  amount,
  className,
}: {
  item: MediaItem;
  amount: number;
  className?: string;
}) {
  const reduce = useReduce();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, amount]);
  return (
    <motion.figure
      ref={ref}
      style={reduce ? undefined : { y }}
      className={`relative ${className ?? ""}`}
      data-cursor
    >
      <div className="relative h-full w-full overflow-hidden rounded-[28px] border border-white/60 shadow-[0_30px_80px_-30px_rgba(80,70,120,0.5)] backdrop-blur-sm">
        <EditableImage
          section={item.section || "gallery"}
          replaceAssetId={item.driveFileId}
          src={item.publicUrl}
          alt={item.caption ?? "Moment"}
          fill
          sizes="(max-width: 640px) 80vw, 32vw"
          className="object-cover"
        />
      </div>
      {item.caption && (
        <figcaption className="mt-3 text-center text-xs uppercase tracking-[0.3em] text-[#2a2540]/55">
          {item.caption}
        </figcaption>
      )}
    </motion.figure>
  );
}

export const CelestiaTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = useReduce();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || defaults.accentColor;
  const hero = event.heroImageUrl || defaults.heroImage;
  const tagline = event.tagline?.trim() || defaults.tagline;
  const invitationMessage = event.invitationMessage?.trim() || defaults.invitationMessage;
  const aboutStory = event.aboutStory?.trim() || defaults.aboutStory || "";
  const gallery = media.filter((m) => m.section === "gallery");

  const showStory = !event.hideStory;
  const showGallery = !event.hideGallery && (gallery.length > 0 || editing);
  const showEvents = !event.hideEvents && subEvents.length > 0;
  const showVenue = !event.hideVenue;

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const sphereRot = useTransform(heroP, [0, 1], [0, 240]);
  const heroTextY = useTransform(heroP, [0, 1], [0, -60]);

  // Ribbon timeline
  const ribbonRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: ribbonP } = useScroll({
    target: ribbonRef,
    offset: ["start center", "end center"],
  });
  const pathLength = useSpring(ribbonP, { stiffness: 90, damping: 25 });

  const sorted = [...subEvents].sort((a, b) => a.order - b.order);

  const galleryItems = gallery;
  const [frame1, frame2, frame3] = event.showHeroFrames ? galleryItems : [];
  const rmotion = useReducedMotion();

  // 6 deterministic wish-orb positions along the bottom of the hero
  const wishOrbs = [
    { left: "8%",  size: 4, delay: 0, dur: 9,  color: "#c9b8f0" },
    { left: "22%", size: 3, delay: 1.4, dur: 11, color: "#a9d3e6" },
    { left: "36%", size: 5, delay: 0.6, dur: 10, color: "#c9b8f0" },
    { left: "54%", size: 3, delay: 2.1, dur: 12, color: "#a9d3e6" },
    { left: "70%", size: 6, delay: 0.9, dur: 9.5, color: "#c9b8f0" },
    { left: "86%", size: 4, delay: 1.7, dur: 10.5, color: "#a9d3e6" },
  ];

  return (
    <div
      className="relative overflow-x-clip font-sans text-[#2a2540] antialiased"
      style={{
        "--accent": accent,
        background: "linear-gradient(180deg, #f5f3f9 0%, #eaeefb 40%, #f3f0f8 100%)",
      } as React.CSSProperties}
    >
      <ScrollProgress color="var(--accent)" />

      {/* soft drifting light field */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute left-[12%] top-[18%] h-[40vw] w-[40vw] rounded-full blur-[90px]"
          style={{ background: "radial-gradient(circle,#c9b8f0,transparent 70%)", opacity: 0.5 }}
          animate={reduce ? undefined : { x: [0, 30, 0], y: [0, -20, 0] }}
          transition={reduce ? undefined : { duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-[10%] bottom-[14%] h-[36vw] w-[36vw] rounded-full blur-[90px]"
          style={{ background: "radial-gradient(circle,#a9d3e6,transparent 70%)", opacity: 0.5 }}
          animate={reduce ? undefined : { x: [0, -26, 0], y: [0, 22, 0] }}
          transition={reduce ? undefined : { duration: 19, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* ── PRELUDE — glass sphere + floating photo collage ── */}
      <section ref={heroRef} className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 py-20 pb-24 text-center sm:pb-28">
        {/* Base hero image with dusty-lavender vignette */}
        <div aria-hidden className="absolute inset-0 -z-10">
          <HeroMedia imageSrc={hero} videoSrc={event.heroVideoUrl} alt={event.eventTitle} />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(201,184,240,0.35) 0%, rgba(169,211,230,0.18) 45%, rgba(42,37,64,0.55) 100%), radial-gradient(circle at 50% 42%, transparent 30%, rgba(42,37,64,0.35) 100%)",
            }}
          />
        </div>

        {/* Frame 1 — crystal orb (top-left) */}
        {frame1 && (
          <motion.figure
            initial={rmotion ? false : { opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none absolute left-[6%] top-[14%] hidden md:block"
          >
            {/* diffused violet glow ring */}
            <div
              aria-hidden
              className="absolute inset-[-22%] rounded-full blur-3xl"
              style={{ background: "radial-gradient(circle,#c9b8f0aa,transparent 65%)" }}
            />
            <motion.div
              className="relative h-40 w-40 overflow-hidden rounded-full lg:h-56 lg:w-56"
              style={{
                border: "1px solid rgba(201,184,240,0.7)",
                boxShadow:
                  "0 20px 60px -20px rgba(80,70,120,0.5), inset 0 0 40px rgba(255,255,255,0.35)",
              }}
              animate={rmotion ? undefined : { y: [0, -10, 0], rotate: [0, 3, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            >
              <img
                src={frame1.publicUrl}
                alt={frame1.caption ?? "Moment"}
                loading="lazy"
                className="h-full w-full object-cover"
              />
              {/* inner sheen */}
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle at 32% 24%, rgba(255,255,255,0.55), rgba(255,255,255,0.05) 45%, transparent 65%)",
                  opacity: 0.9,
                }}
              />
              <div aria-hidden className="absolute inset-0 rounded-full ring-1 ring-white/60" />
            </motion.div>
          </motion.figure>
        )}

        {/* Frame 2 — oval capsule (top-right) */}
        {frame2 && (
          <motion.figure
            initial={rmotion ? false : { opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none absolute right-[7%] top-[18%] hidden md:block"
          >
            <div
              aria-hidden
              className="absolute inset-[-20%] blur-3xl"
              style={{
                background: "radial-gradient(circle,#a9d3e6aa,transparent 65%)",
                borderRadius: "50% / 40%",
              }}
            />
            <motion.div
              className="relative h-56 w-40 overflow-hidden lg:h-72 lg:w-52"
              style={{
                borderRadius: "50% / 40%",
                border: "1px solid rgba(169,211,230,0.75)",
                boxShadow:
                  "0 20px 60px -20px rgba(80,110,140,0.45), inset 0 0 30px rgba(255,255,255,0.25)",
              }}
              animate={rmotion ? undefined : { x: [0, 6, 0], y: [0, -4, 0] }}
              transition={{ duration: 9, delay: 1, repeat: Infinity, ease: "easeInOut" }}
            >
              <img
                src={frame2.publicUrl}
                alt={frame2.caption ?? "Moment"}
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.4), transparent 60%)",
                }}
              />
            </motion.div>
          </motion.figure>
        )}

        {/* Frame 3 — feather-edged rectangle (bottom-left) */}
        {frame3 && (
          <motion.figure
            initial={rmotion ? false : { opacity: 0, y: 30, rotate: -4 }}
            animate={{ opacity: 1, y: 0, rotate: -2 }}
            transition={{ duration: 1.2, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            whileHover={rmotion ? undefined : { rotate: 1, scale: 1.03 }}
            className="pointer-events-none absolute bottom-[18%] left-[8%] hidden lg:block"
          >
            <motion.div
              className="relative h-52 w-40 overflow-hidden rounded-[28px]"
              style={{
                WebkitMaskImage:
                  "radial-gradient(closest-side, black 78%, transparent)",
                maskImage:
                  "radial-gradient(closest-side, black 78%, transparent)",
                filter: "drop-shadow(0 20px 40px rgba(80,70,120,0.35))",
              }}
              animate={rmotion ? undefined : { y: [0, -6, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            >
              <img
                src={frame3.publicUrl}
                alt={frame3.caption ?? "Moment"}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </motion.div>
          </motion.figure>
        )}

        {/* Wish orbs — 6 tiny lavender/ice-blue circles drifting up */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          {wishOrbs.map((o, i) => (
            <motion.span
              key={`wish-${i}`}
              className="absolute rounded-full"
              style={{
                left: o.left,
                bottom: "-2%",
                width: o.size,
                height: o.size,
                background: o.color,
                boxShadow: `0 0 8px ${o.color}, 0 0 16px ${o.color}88`,
              }}
              animate={rmotion ? undefined : { y: [0, -520], opacity: [0, 0.9, 0] }}
              transition={{
                duration: o.dur,
                delay: o.delay,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          ))}
        </div>

        {/* Central title card with ornaments */}
        <motion.div
          initial={rmotion ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative z-10 max-w-3xl text-center"
        >
          <div className="mb-5 flex items-center justify-center gap-3 opacity-80">
            <span className="h-px w-10 sm:w-16" style={{ background: "#c9b8f0" }} />
            <span className="text-lg" style={{ color: "#c9b8f0" }}>✧</span>
            <span className="h-px w-10 sm:w-16" style={{ background: "#c9b8f0" }} />
          </div>

          <motion.p
            initial={rmotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="font-script text-3xl text-[var(--accent)] sm:text-5xl"
          >
            {tagline}
          </motion.p>

          <div className="relative my-8 flex items-center justify-center">
            <GlassSphere imageSrc={hero} alt={event.eventTitle} scrollRot={sphereRot} />
          </div>

          <motion.h1
            style={rmotion ? undefined : { y: heroTextY }}
            className="font-display text-[clamp(2.4rem,9vw,6.5rem)] font-medium leading-[0.92] text-white drop-shadow-[0_4px_20px_rgba(42,37,64,0.6)]"
          >
            <span>{event.person1Name}</span>
            {event.person2Name && <span className="mx-3 font-script text-[0.5em] text-[var(--accent)]">and</span>}
            {event.person2Name && <span>{event.person2Name}</span>}
          </motion.h1>

          {event.mainDate && (
            <p className="mt-6 text-xs uppercase tracking-[0.5em] text-white/80">
              {new Date(event.mainDate).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}
              {event.city && ` · ${event.city}`}
            </p>
          )}

          <div className="mt-6 flex items-center justify-center gap-3 opacity-70">
            <span className="h-px w-16" style={{ background: "#a9d3e6" }} />
            <span className="text-xs" style={{ color: "#a9d3e6" }}>⋆</span>
            <span className="h-px w-16" style={{ background: "#a9d3e6" }} />
          </div>

          {/* Mobile-only trio — small glass-orb thumbs */}
          {(frame1 || frame2 || frame3) && (
            <div className="mt-8 flex items-center justify-center gap-4 md:hidden">
              {[frame1, frame2, frame3].filter(Boolean).slice(0, 3).map((f, i) => (
                <motion.figure
                  key={`mob-${i}`}
                  initial={rmotion ? false : { opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 + i * 0.15 }}
                  className="relative h-16 w-16 overflow-hidden rounded-full"
                  style={{
                    border: "1px solid rgba(201,184,240,0.7)",
                    boxShadow:
                      "0 8px 20px -8px rgba(80,70,120,0.55), inset 0 0 20px rgba(255,255,255,0.3)",
                  }}
                >
                  <img
                    src={f!.publicUrl}
                    alt={f!.caption ?? ""}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(circle at 32% 24%, rgba(255,255,255,0.55), transparent 60%)",
                    }}
                  />
                </motion.figure>
              ))}
            </div>
          )}

          {!event.hideTimer && !(event.timerCustom && event.timerStyle === "floating") && event.mainDate && (
            <div className="mt-10 inline-block rounded-3xl bg-[#2a2540]/85 px-6 py-5 shadow-xl backdrop-blur-md">
              <Countdown target={`${event.mainDate}T${event.mainStartTime || "16:00"}:00`} label="Until we say yes" />
            </div>
          )}
        </motion.div>
      </section>

      {/* ── INVITATION ── */}
      {showStory && (
        <section className="relative mx-auto max-w-4xl px-6 py-28 text-center sm:py-40">
          <p className="mb-8 text-[10px] uppercase tracking-[0.5em] text-[var(--accent)]">An Invitation</p>
          <WordReveal text={invitationMessage} className="font-display text-[clamp(1.7rem,4.4vw,3.4rem)] leading-[1.18]" />
          {aboutStory && (
            <Reveal delay={0.1} className="mx-auto mt-10 max-w-xl text-[#2a2540]/65">
              <p className="leading-relaxed">{aboutStory}</p>
            </Reveal>
          )}
        </section>
      )}

      {/* ── MOMENTS — floating glass photos ── */}
      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-20 sm:py-32">
          <Reveal className="mb-14 text-center">
            <h2 className="font-display text-4xl sm:text-6xl">Moments, Suspended</h2>
          </Reveal>
          {gallery.length === 0 && editing ? (
            <div className="relative mx-auto aspect-[4/5] max-w-xs">
              <EditableImage section="gallery" src="" asAddTile alt="" />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-3">
              {gallery.map((m, i) => {
                const col = ["sm:mt-0", "sm:mt-20", "sm:mt-8"][i % 3];
                const amt = reduce ? 0 : [-50, 50, -30][i % 3];
                const ar = ["aspect-[3/4]", "aspect-[4/5]", "aspect-square"][i % 3];
                return (
                  <FloatingPhoto key={`${m.fileName}-${i}`} item={m} amount={amt} className={`${col} ${ar}`} />
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* ── JOURNEY — ribbon timeline ── */}
      {showEvents && (
        <section ref={ribbonRef} className="relative mx-auto max-w-4xl px-6 py-24 sm:py-36">
          <Reveal className="mb-16 text-center">
            <h2 className="font-display text-4xl sm:text-6xl">The Thread of the Day</h2>
          </Reveal>

          {/* the self-drawing ribbon */}
          <svg
            aria-hidden
            className="absolute left-1/2 top-32 hidden h-[calc(100%-9rem)] w-24 -translate-x-1/2 sm:block"
            viewBox="0 0 100 1000"
            preserveAspectRatio="none"
            fill="none"
          >
            <motion.path
              d="M50 0 C 90 120, 10 240, 50 360 C 90 480, 10 600, 50 720 C 90 840, 30 940, 50 1000"
              stroke="var(--accent)"
              strokeWidth="2"
              strokeLinecap="round"
              style={{ pathLength: reduce ? 1 : pathLength }}
            />
          </svg>

          <div className="relative space-y-12 sm:space-y-20">
            {sorted.map((s, i) => {
              const left = i % 2 === 0;
              return (
                <Reveal key={`${s.eventCode}-${s.order}`} className={`sm:w-[42%] ${left ? "sm:mr-auto sm:text-right" : "sm:ml-auto"}`}>
                  <div className="rounded-[24px] border border-white/70 bg-white/55 p-6 shadow-[0_24px_60px_-30px_rgba(80,70,120,0.45)] backdrop-blur-md sm:p-8" data-cursor>
                    <span className="font-script text-3xl text-[var(--accent)]">{s.name}</span>
                    <p className="mt-2 text-xs uppercase tracking-[0.25em] text-[#2a2540]/55">
                      {[s.date, s.startTime && `${s.startTime}${s.endTime ? ` – ${s.endTime}` : ""}`].filter(Boolean).join("  ·  ")}
                    </p>
                    {s.venueName && <p className="mt-3 text-[#2a2540]/80">{s.venueName}{s.venueAddress ? `, ${s.venueAddress}` : ""}</p>}
                    {s.dressCode && <p className="mt-2 text-xs uppercase tracking-[0.3em] text-[#2a2540]/45">{s.dressCode}</p>}
                    {s.description && <p className="mt-3 text-sm leading-relaxed text-[#2a2540]/70">{s.description}</p>}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>
      )}

      {/* ── VENUE ── */}
      {showVenue && (
        <section className="relative mx-auto max-w-4xl px-6 py-24 sm:py-36">
          <Reveal className="mb-8 text-center">
            <p className="text-[10px] uppercase tracking-[0.5em] text-[var(--accent)]">Where We Gather</p>
          </Reveal>
          <Reveal className="rounded-[28px] border border-white/70 bg-white/55 p-3 shadow-xl backdrop-blur-md sm:p-5">
            <MapEmbed
              latitude={event.latitude}
              longitude={event.longitude}
              venueName={event.venueName}
              venueAddress={event.venueAddress}
              mapLink={event.mapLink}
            />
          </Reveal>
        </section>
      )}

      {/* ── FOREVER ── */}
      <section className="relative px-6 py-32 text-center sm:py-44">
        <Reveal>
          <p className="text-[10px] uppercase tracking-[0.5em] text-[var(--accent)]">With All Our Love</p>
          <h2 className="mx-auto mt-6 max-w-3xl font-display text-[clamp(2rem,7vw,5rem)] leading-[1]">
            {event.eventTitle}
          </h2>
        </Reveal>

        {event.rsvpEnabled && (
          <div className="mt-12">
            {event.rsvpLinkOrContact?.startsWith("http") ? (
              <Magnetic className="inline-block">
                <a
                  href={event.rsvpLinkOrContact}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block rounded-full bg-[var(--accent)] px-10 py-4 text-sm uppercase tracking-[0.3em] text-white shadow-lg transition hover:opacity-90"
                >
                  Save us a seat
                </a>
              </Magnetic>
            ) : (
              <RSVP enabled={event.rsvpEnabled} linkOrContact={event.rsvpLinkOrContact} contactName={event.contactName} />
            )}
          </div>
        )}

        {event.mainDate && (
          <div className="mt-12">
            <AddToCalendar
              title={event.eventTitle}
              date={event.mainDate}
              startTime={event.mainStartTime}
              endTime={event.mainEndTime}
              venueName={event.venueName}
              venueAddress={event.venueAddress}
              description={invitationMessage}
            />
          </div>
        )}

        <p className="mt-16 font-script text-3xl text-[var(--accent)] sm:text-4xl">
          {[event.person1Name, event.person2Name].filter(Boolean).join("  &  ")}
        </p>
      </section>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default CelestiaTemplate;
