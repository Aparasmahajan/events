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

const SKY = "#a8d8f0";
const SUN = "#ffd166";
const CHERRY = "#ff5a75";
const MINT = "#7fdfb8";
const COCOA = "#3a2015";

const CLOUDS = [
  { x: "6%", y: "14%", scale: 1, delay: 0, dur: 9 },
  { x: "28%", y: "8%", scale: 0.75, delay: 0.6, dur: 11 },
  { x: "58%", y: "18%", scale: 1.1, delay: 1.2, dur: 10 },
  { x: "78%", y: "10%", scale: 0.85, delay: 0.3, dur: 12 },
  { x: "44%", y: "30%", scale: 0.65, delay: 1.8, dur: 13 },
];

const BALLOONS = [
  { x: "8%", color: CHERRY, delay: 0, dur: 14, size: 64 },
  { x: "18%", color: SUN, delay: 1.5, dur: 16, size: 52 },
  { x: "32%", color: MINT, delay: 0.8, dur: 15, size: 58 },
  { x: "44%", color: CHERRY, delay: 2.4, dur: 17, size: 48 },
  { x: "58%", color: "#c8a2ff", delay: 0.4, dur: 18, size: 60 },
  { x: "70%", color: SUN, delay: 3.1, dur: 14, size: 54 },
  { x: "82%", color: MINT, delay: 1.9, dur: 15, size: 62 },
  { x: "92%", color: CHERRY, delay: 2.7, dur: 16, size: 50 },
];

function CloudFace({ scale = 1, breathing = true }: { scale?: number; breathing?: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 120 70"
      width={120 * scale}
      height={70 * scale}
      animate={breathing ? { scaleY: [1, 1.06, 0.96, 1], scaleX: [1, 0.98, 1.03, 1] } : undefined}
      transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
      style={{ filter: "drop-shadow(0 6px 12px rgba(58,32,21,0.12))" }}
    >
      <path
        d="M20,50 A18,18 0 0,1 40,32 A16,16 0 0,1 66,24 A18,18 0 0,1 96,36 A14,14 0 0,1 100,60 L22,60 A12,12 0 0,1 20,50 Z"
        fill="#ffffff"
        stroke={COCOA}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <circle cx="52" cy="44" r="2.6" fill={COCOA} />
      <circle cx="72" cy="44" r="2.6" fill={COCOA} />
      <path d="M56,50 Q62,55 68,50" stroke={COCOA} strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="46" cy="50" r="1.6" fill={CHERRY} opacity="0.6" />
      <circle cx="78" cy="50" r="1.6" fill={CHERRY} opacity="0.6" />
    </motion.svg>
  );
}

function BalloonFace({ color, size = 60 }: { color: string; size?: number }) {
  return (
    <motion.svg
      viewBox="0 0 80 110"
      width={size}
      height={size * 1.375}
      animate={{ scaleY: [1, 0.94, 1.05, 1], scaleX: [1, 1.05, 0.96, 1] }}
      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      style={{ filter: "drop-shadow(0 8px 10px rgba(58,32,21,0.18))" }}
    >
      <ellipse cx="40" cy="42" rx="30" ry="36" fill={color} stroke={COCOA} strokeWidth="2.5" />
      <ellipse cx="30" cy="30" rx="7" ry="10" fill="#ffffff" opacity="0.45" />
      <path d="M36,78 L44,78 L40,86 Z" fill={COCOA} />
      <path d="M40,86 Q34,96 42,104" stroke={COCOA} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <circle cx="32" cy="42" r="2.4" fill={COCOA} />
      <circle cx="48" cy="42" r="2.4" fill={COCOA} />
      <path d="M34,52 Q40,58 46,52" stroke={COCOA} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <circle cx="26" cy="50" r="2" fill="#ff9db0" />
      <circle cx="54" cy="50" r="2" fill="#ff9db0" />
    </motion.svg>
  );
}

function BouncyUnderline({ color, delay = 0 }: { color: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.svg
      viewBox="0 0 200 14"
      className="mt-2 h-3 w-full"
      preserveAspectRatio="none"
      initial={reduce ? false : { scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 220, damping: 12, delay }}
      style={{ transformOrigin: "left center" }}
    >
      <rect x="0" y="4" width="200" height="8" rx="4" fill={color} />
    </motion.svg>
  );
}

function Sparkles({ color }: { color: string }) {
  const dots = [
    { cx: 8, cy: 8, d: 0 },
    { cx: 92, cy: 6, d: 0.3 },
    { cx: 6, cy: 88, d: 0.6 },
    { cx: 94, cy: 90, d: 0.9 },
  ];
  return (
    <svg viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
      {dots.map((s, i) => (
        <motion.g
          key={i}
          animate={{ scale: [0.6, 1.1, 0.6], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.8, delay: s.d, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: `${s.cx}px ${s.cy}px` }}
        >
          <path
            d={`M${s.cx},${s.cy - 4} L${s.cx + 1.2},${s.cy - 1.2} L${s.cx + 4},${s.cy} L${s.cx + 1.2},${s.cy + 1.2} L${s.cx},${s.cy + 4} L${s.cx - 1.2},${s.cy + 1.2} L${s.cx - 4},${s.cy} L${s.cx - 1.2},${s.cy - 1.2} Z`}
            fill={color}
          />
        </motion.g>
      ))}
    </svg>
  );
}

const CARD_COLORS = [SUN, CHERRY, MINT, "#c8a2ff", "#ffa26b"];

function ToonCard({ s, i }: { s: SubEvent; i: number }) {
  const reduce = useReducedMotion();
  const bg = CARD_COLORS[i % CARD_COLORS.length];
  const meta = [s.date, s.startTime].filter(Boolean).join(" • ");
  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 30, scale: 0.85 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ type: "spring", stiffness: 180, damping: 14, delay: i * 0.08 }}
      whileHover={reduce ? undefined : { y: -6, rotate: i % 2 === 0 ? -1.5 : 1.5 }}
      className="relative rounded-[28px] p-6 shadow-[0_10px_0_rgba(58,32,21,0.15)]"
      style={{ background: bg, border: `3px solid ${COCOA}` }}
    >
      <div
        className="pointer-events-none absolute inset-2 rounded-[22px]"
        style={{ border: `2px solid rgba(58,32,21,0.22)` }}
      />
      <Sparkles color={COCOA} />
      <div className="relative">
        <div className="mb-2 flex items-center gap-2">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-black"
            style={{ background: "#fff", color: COCOA, border: `2.5px solid ${COCOA}` }}
          >
            {String(s.order).padStart(2, "0")}
          </span>
          {meta && (
            <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: COCOA }}>
              {meta}
            </span>
          )}
        </div>
        <h3 className="font-display text-2xl font-black leading-tight" style={{ color: COCOA }}>
          {s.name}
        </h3>
        {s.venueName && (
          <p className="mt-1 text-sm font-semibold" style={{ color: COCOA, opacity: 0.75 }}>
            @ {s.venueName}
          </p>
        )}
        {s.description && (
          <p className="mt-3 text-sm leading-relaxed" style={{ color: COCOA, opacity: 0.85 }}>
            {s.description}
          </p>
        )}
        {s.dressCode && (
          <p
            className="mt-4 inline-block rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider"
            style={{ background: "#fff", color: COCOA, border: `2px solid ${COCOA}` }}
          >
            {s.dressCode}
          </p>
        )}
      </div>
    </motion.article>
  );
}

export const CartoonTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || CHERRY;
  const tagline = event.tagline?.trim() || "Come play in our cartoon world!";
  const invitationMessage =
    event.invitationMessage?.trim() ||
    "You're invited to the biggest, bounciest, most colorful birthday bash in the whole universe.";
  const aboutStory =
    event.aboutStory?.trim() ||
    "Puffy clouds. Balloon buddies. Cake mountains taller than the sky. Every laugh here echoes in a place called Toonverse — and we saved a seat just for you.";
  const heroFallback =
    "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1600&q=80";
  const hero = event.heroImageUrl || heroFallback;

  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const showStory = !event.hideStory;
  const showJourney = !event.hideEvents && subEvents.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroP, [0, 1], [0, -60]);
  const heroOpacity = useTransform(heroP, [0, 0.6], [1, 0.2]);

  const formattedDate = event.mainDate
    ? new Date(event.mainDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
    : "";

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-sans antialiased"
      style={{ "--accent": accent, background: SKY, color: COCOA } as React.CSSProperties}
    >
      <ScrollProgress color={accent} />

      {/* Floating balloons across whole page */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        {!reduce &&
          BALLOONS.map((b, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{ left: b.x, bottom: -140 }}
              animate={{ y: ["0vh", "-140vh"], x: [0, 20, -20, 0] }}
              transition={{ duration: b.dur, delay: b.delay, repeat: Infinity, ease: "linear" }}
            >
              <BalloonFace color={b.color} size={b.size} />
            </motion.div>
          ))}
      </div>

      {/* HERO */}
      <section ref={heroRef} className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6 pb-16 pt-24">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {CLOUDS.map((c, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{ left: c.x, top: c.y }}
              animate={reduce ? undefined : { x: [0, 20, -10, 0] }}
              transition={{ duration: c.dur, delay: c.delay, repeat: Infinity, ease: "easeInOut" }}
            >
              <CloudFace scale={c.scale} breathing={!reduce} />
            </motion.div>
          ))}
        </div>

        <motion.div
          className="absolute inset-x-6 top-16 mx-auto max-w-4xl overflow-hidden rounded-[36px]"
          style={{ border: `4px solid ${COCOA}` }}
          initial={reduce ? false : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 140, damping: 16 }}
        >
          <div className="aspect-[16/9] w-full">
            <HeroMedia imageSrc={hero} videoSrc={event.heroVideoUrl || undefined} alt={event.eventTitle} className="opacity-80" />
          </div>
        </motion.div>

        <motion.div
          style={reduce ? undefined : { y: heroY, opacity: heroOpacity }}
          className="relative z-10 mt-[38vh] max-w-3xl text-center"
        >
          <motion.p
            initial={reduce ? false : { scale: 0, rotate: -8 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.2 }}
            className="mb-4 inline-block rounded-full px-5 py-2 text-xs font-black uppercase tracking-widest"
            style={{ background: SUN, color: COCOA, border: `3px solid ${COCOA}` }}
          >
            {tagline}
          </motion.p>
          <motion.h1
            initial={reduce ? false : { y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 160, damping: 14, delay: 0.4 }}
            className="font-display text-[clamp(3rem,11vw,7rem)] font-black leading-[0.9]"
            style={{ color: COCOA, textShadow: `4px 4px 0 ${SUN}, 8px 8px 0 ${CHERRY}` }}
          >
            {event.eventTitle}
          </motion.h1>
          {event.person1Name && (
            <motion.p
              initial={reduce ? false : { scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.7 }}
              className="mt-6 inline-block rounded-full px-6 py-3 text-lg font-black"
              style={{ background: MINT, color: COCOA, border: `3px solid ${COCOA}` }}
            >
              turning up for {event.person1Name}!
            </motion.p>
          )}
          {(formattedDate || event.city) && (
            <p className="mt-6 text-base font-bold" style={{ color: COCOA }}>
              {[formattedDate, event.mainStartTime, event.city].filter(Boolean).join("  ·  ")}
            </p>
          )}
        </motion.div>
      </section>

      {/* STORY */}
      {showStory && (
        <section className="relative mx-auto max-w-4xl px-6 py-24">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 140, damping: 16 }}
            className="relative rounded-[32px] p-8 sm:p-12"
            style={{ background: "#fff", border: `4px solid ${COCOA}`, boxShadow: `0 12px 0 ${CHERRY}` }}
          >
            <h2 className="font-display text-4xl font-black leading-tight sm:text-5xl" style={{ color: COCOA }}>
              The Invitation
              <BouncyUnderline color={SUN} />
            </h2>
            <p className="mt-6 text-xl font-bold leading-relaxed sm:text-2xl" style={{ color: COCOA }}>
              {invitationMessage}
            </p>
            <p className="mt-4 text-base leading-relaxed" style={{ color: COCOA, opacity: 0.8 }}>
              {aboutStory}
            </p>
          </motion.div>
        </section>
      )}

      {/* SUB-EVENTS */}
      {showJourney && (
        <section className="relative mx-auto max-w-6xl px-6 py-20">
          <div className="mb-12 text-center">
            <h2 className="inline-block font-display text-4xl font-black sm:text-5xl" style={{ color: COCOA }}>
              The Adventure
              <BouncyUnderline color={CHERRY} />
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...subEvents].sort((a, b) => a.order - b.order).map((s, i) => (
              <ToonCard key={s.order} s={s} i={i} />
            ))}
          </div>
        </section>
      )}

      {/* GALLERY */}
      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-20">
          <div className="mb-12 text-center">
            <h2 className="inline-block font-display text-4xl font-black sm:text-5xl" style={{ color: COCOA }}>
              Snapshots
              <BouncyUnderline color={MINT} />
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((m, i) => (
              <motion.div
                key={`${m.fileName}-${i}`}
                initial={reduce ? false : { opacity: 0, scale: 0.8, rotate: i % 2 === 0 ? -3 : 3 }}
                whileInView={{ opacity: 1, scale: 1, rotate: i % 2 === 0 ? -1.5 : 1.5 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 160, damping: 14, delay: i * 0.05 }}
                whileHover={reduce ? undefined : { rotate: 0, scale: 1.03 }}
                className="overflow-hidden rounded-[24px] bg-white p-2"
                style={{ border: `3px solid ${COCOA}`, boxShadow: `0 8px 0 ${SUN}` }}
              >
                <img
                  src={m.publicUrl}
                  alt={m.caption ?? ""}
                  className="aspect-[4/5] w-full rounded-[18px] object-cover"
                  loading="lazy"
                />
                {m.caption && (
                  <p className="mt-2 px-2 pb-1 text-center text-sm font-bold" style={{ color: COCOA }}>
                    {m.caption}
                  </p>
                )}
              </motion.div>
            ))}
            {editing && galleryItems.length === 0 && (
              <div
                className="col-span-full flex h-48 items-center justify-center rounded-[24px] text-base font-bold"
                style={{ border: `3px dashed ${COCOA}`, color: COCOA, background: "#fff" }}
              >
                + Add photos
              </div>
            )}
          </div>
        </section>
      )}

      {/* VENUE */}
      {showVenue && (
        <section className="relative mx-auto max-w-5xl px-6 py-20">
          <div className="mb-8 text-center">
            <h2 className="inline-block font-display text-4xl font-black sm:text-5xl" style={{ color: COCOA }}>
              The Playground
              <BouncyUnderline color={SUN} />
            </h2>
            {event.venueName && (
              <p className="mt-4 text-xl font-black" style={{ color: COCOA }}>
                {event.venueName}
              </p>
            )}
            {event.venueAddress && (
              <p className="mt-1 text-sm font-semibold" style={{ color: COCOA, opacity: 0.75 }}>
                {event.venueAddress}
              </p>
            )}
          </div>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 140, damping: 16 }}
            className="overflow-hidden rounded-[28px] bg-white p-2"
            style={{ border: `4px solid ${COCOA}`, boxShadow: `0 12px 0 ${MINT}` }}
          >
            <div className="overflow-hidden rounded-[20px]">
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

      {/* CTA / RSVP */}
      <section className="relative px-6 py-24 text-center">
        <motion.div
          initial={reduce ? false : { scale: 0.7, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 150, damping: 12 }}
          className="mx-auto max-w-2xl"
        >
          <h2 className="font-display text-[clamp(2.5rem,8vw,5rem)] font-black leading-[0.95]" style={{ color: COCOA, textShadow: `4px 4px 0 ${SUN}` }}>
            Say you'll come!
          </h2>
          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <motion.a
              href={event.rsvpLinkOrContact}
              target="_blank"
              rel="noreferrer"
              whileHover={reduce ? undefined : { scale: 1.06, rotate: -2 }}
              whileTap={reduce ? undefined : { scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 12 }}
              className="mt-10 inline-block rounded-full px-12 py-5 text-lg font-black uppercase tracking-wider"
              style={{ background: CHERRY, color: "#fff", border: `4px solid ${COCOA}`, boxShadow: `0 8px 0 ${COCOA}` }}
            >
              RSVP now!
            </motion.a>
          )}
          {event.contactName && (
            <p className="mt-8 text-base font-bold" style={{ color: COCOA }}>
              Questions? Ask {event.contactName}
              {event.contactPhone ? ` • ${event.contactPhone}` : ""}
            </p>
          )}
        </motion.div>
      </section>

      <footer
        className="relative border-t-4 py-8 text-center text-sm font-black"
        style={{ borderColor: COCOA, background: SUN, color: COCOA }}
      >
        <p>
          {event.eventTitle}
          {event.person1Name ? ` • ${event.person1Name}` : ""} • Made in Toonverse
        </p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default CartoonTemplate;
