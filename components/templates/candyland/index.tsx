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

const PALETTE = {
  cream: "#fbf1e4",
  pink: "#ff8ec6",
  choc: "#6b3a1e",
  mint: "#7cd4b4",
  cherry: "#f24d61",
  text: "#3e1a1a",
};

const SPRINKLES = [
  { x: 6, y: 8, rot: 22, color: PALETTE.pink },
  { x: 18, y: 24, rot: -14, color: PALETTE.mint },
  { x: 31, y: 12, rot: 41, color: PALETTE.cherry },
  { x: 47, y: 30, rot: -28, color: PALETTE.choc },
  { x: 62, y: 6, rot: 12, color: PALETTE.pink },
  { x: 74, y: 20, rot: -36, color: PALETTE.mint },
  { x: 88, y: 14, rot: 48, color: PALETTE.cherry },
  { x: 12, y: 62, rot: -18, color: PALETTE.pink },
  { x: 38, y: 74, rot: 33, color: PALETTE.mint },
  { x: 66, y: 58, rot: -42, color: PALETTE.cherry },
  { x: 82, y: 78, rot: 20, color: PALETTE.choc },
  { x: 24, y: 90, rot: -8, color: PALETTE.pink },
];

function Sprinkles({ reduce }: { reduce: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
      {SPRINKLES.map((s, i) => (
        <motion.span
          key={i}
          className="absolute block"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: 14,
            height: 5,
            background: s.color,
            borderRadius: 6,
            transform: `rotate(${s.rot}deg)`,
            boxShadow: `0 2px 0 rgba(62,26,26,0.15)`,
          }}
          animate={reduce ? undefined : { y: [0, 14, 0], opacity: [0.75, 1, 0.75] }}
          transition={{ duration: 5 + (i % 4), delay: (i % 5) * 0.35, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function ChocolateRiver({ reduce, accent }: { reduce: boolean; accent: string }) {
  return (
    <div aria-hidden className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[38%] overflow-hidden">
      <svg viewBox="0 0 1440 200" preserveAspectRatio="none" className="h-full w-full">
        <defs>
          <linearGradient id="cl-choc" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#8a4a26" />
            <stop offset="0.5" stopColor={PALETTE.choc} />
            <stop offset="1" stopColor="#4a2612" />
          </linearGradient>
        </defs>
        <path
          d="M0,100 C180,40 320,160 540,100 C760,40 900,160 1100,100 C1260,52 1360,140 1440,100 L1440,200 L0,200 Z"
          fill="url(#cl-choc)"
        />
        <motion.path
          d="M0,100 C180,40 320,160 540,100 C760,40 900,160 1100,100 C1260,52 1360,140 1440,100"
          stroke={PALETTE.cream}
          strokeWidth="4"
          strokeOpacity="0.7"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="14 22"
          animate={reduce ? undefined : { strokeDashoffset: [0, -72] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
        <motion.path
          d="M0,118 C180,58 320,178 540,118 C760,58 900,178 1100,118 C1260,70 1360,158 1440,118"
          stroke={accent}
          strokeWidth="2"
          strokeOpacity="0.35"
          fill="none"
          strokeDasharray="6 30"
          animate={reduce ? undefined : { strokeDashoffset: [0, 72] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />
      </svg>
    </div>
  );
}

function WrapperCard({ s, i, reduce, color }: { s: SubEvent; i: number; reduce: boolean; color: string }) {
  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 26, rotate: i % 2 ? -2 : 2 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.65, delay: i * 0.08, ease: EASE }}
      whileHover={reduce ? undefined : { y: -4, rotate: i % 2 ? 1 : -1 }}
      className="relative mx-6 sm:mx-0"
      style={{ filter: "drop-shadow(0 10px 24px rgba(62,26,26,0.18))" }}
    >
      <div
        className="relative px-8 py-7"
        style={{
          background: color,
          color: PALETTE.text,
          clipPath: "polygon(6% 0%, 94% 0%, 100% 50%, 94% 100%, 6% 100%, 0% 50%)",
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(255,255,255,0.14) 0 2px, transparent 2px 8px), repeating-linear-gradient(-45deg, rgba(0,0,0,0.05) 0 2px, transparent 2px 8px)",
        }}
      >
        <div className="mx-auto max-w-md text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] opacity-70">
            Treat {String(s.order).padStart(2, "0")}
          </p>
          <h3 className="mt-2 font-display text-2xl font-black leading-tight">{s.name}</h3>
          {(s.date || s.startTime) && (
            <p className="mt-1 text-sm font-semibold opacity-80">
              {[s.date, s.startTime].filter(Boolean).join(" · ")}
            </p>
          )}
          {s.venueName && <p className="mt-1 text-xs opacity-75">at {s.venueName}</p>}
          {s.description && <p className="mt-3 text-sm leading-relaxed opacity-85">{s.description}</p>}
          {s.dressCode && (
            <span className="mt-4 inline-block rounded-full bg-white/70 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em]">
              {s.dressCode}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}

function Cookie({ url, caption, i, reduce }: { url: string; caption?: string; i: number; reduce: boolean }) {
  const chips = 10;
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: i * 0.05, ease: EASE }}
      whileHover={reduce ? undefined : { rotate: 4, scale: 1.03 }}
      className="relative mx-auto"
      style={{ width: "min(88%, 260px)" }}
    >
      <div
        className="relative aspect-square rounded-full p-3"
        style={{
          background: "radial-gradient(circle at 30% 30%, #b07a4e, #6b3a1e 70%, #4a2612)",
          boxShadow: "inset 0 -8px 16px rgba(0,0,0,0.35), 0 12px 26px rgba(62,26,26,0.25)",
        }}
      >
        <div className="h-full w-full overflow-hidden rounded-full ring-4 ring-[#4a2612]/60">
          <img
            src={url}
            alt={caption ?? "Sweet memory"}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
        {Array.from({ length: chips }).map((_, k) => {
          const a = (k / chips) * Math.PI * 2;
          const r = 46;
          const cx = 50 + Math.cos(a) * r;
          const cy = 50 + Math.sin(a) * r;
          const size = 9 + ((k * 7) % 5);
          return (
            <span
              key={k}
              aria-hidden
              className="absolute rounded-full"
              style={{
                left: `${cx}%`,
                top: `${cy}%`,
                width: size,
                height: size,
                background: "#2a1409",
                boxShadow: "inset -1px -1px 2px rgba(255,255,255,0.15)",
                transform: "translate(-50%, -50%)",
              }}
            />
          );
        })}
      </div>
      {caption && (
        <p className="mt-3 text-center text-sm font-semibold" style={{ color: PALETTE.text }}>
          {caption}
        </p>
      )}
    </motion.div>
  );
}

export const CandylandTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || PALETTE.pink;
  const tagline = event.tagline?.trim() || "Welcome to the sweetest little factory";
  const invitationMessage =
    event.invitationMessage?.trim() ||
    "Follow the chocolate river, past the cookie mountains, to a birthday made entirely of sugar and joy.";
  const aboutStory =
    event.aboutStory?.trim() ||
    "Every corner is a new flavor. Buttercream skies, gumdrop meadows, and a candy machine that only makes smiles. Bring your appetite for wonder.";
  const hero =
    event.heroImageUrl ||
    "https://images.unsplash.com/photo-1519415943484-9fa1873496d4?auto=format&fit=crop&w=1600&q=80";

  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const sortedSubs = useMemo(() => [...subEvents].sort((a, b) => a.order - b.order), [subEvents]);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroP, [0, 1], [0, -60]);
  const heroOpacity = useTransform(heroP, [0, 0.7], [1, 0]);

  const showStory = !event.hideStory;
  const showEvents = !event.hideEvents && sortedSubs.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  const wrapperColors = [PALETTE.pink, PALETTE.mint, PALETTE.cherry, "#f6c453", "#c58bff"];

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-sans antialiased"
      style={
        {
          "--accent": accent,
          background: `linear-gradient(180deg, ${PALETTE.cream} 0%, #fde7f0 50%, ${PALETTE.cream} 100%)`,
          color: PALETTE.text,
          fontFamily: "'Fraunces', 'Baloo 2', 'Nunito', ui-rounded, system-ui, sans-serif",
        } as React.CSSProperties
      }
    >
      <Sprinkles reduce={reduce} />
      <ScrollProgress color={accent} />

      {/* ─── HERO ─── */}
      <section
        ref={heroRef}
        className="relative flex min-h-[100svh] items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 opacity-30">
          <HeroMedia
            imageSrc={hero}
            videoSrc={event.heroVideoUrl || undefined}
            alt={event.eventTitle}
          />
        </div>
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 50% 30%, rgba(255,255,255,0.55), transparent 60%), linear-gradient(180deg, ${PALETTE.cream}f0, ${PALETTE.cream}c0 40%, ${PALETTE.cream}f5)`,
          }}
        />
        <ChocolateRiver reduce={reduce} accent={accent} />

        <motion.div
          style={reduce ? undefined : { y: heroY, opacity: heroOpacity }}
          className="relative z-10 mx-auto max-w-4xl px-6 text-center"
        >
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="mb-6 text-[11px] font-black uppercase tracking-[0.4em]"
            style={{ color: PALETTE.choc }}
          >
            {tagline}
          </motion.p>
          <motion.h1
            initial={reduce ? false : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: EASE, delay: 0.1 }}
            className="font-display text-[clamp(3rem,11vw,8rem)] font-black leading-[0.9] tracking-tight"
            style={{
              color: PALETTE.choc,
              textShadow: `4px 4px 0 ${accent}, 8px 8px 0 ${PALETTE.mint}`,
            }}
          >
            {event.eventTitle}
          </motion.h1>
          {event.person1Name && (
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="mt-6 font-display text-2xl font-bold"
              style={{ color: PALETTE.cherry }}
            >
              turning sweeter with {event.person1Name}
            </motion.p>
          )}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm font-bold"
          >
            {event.mainDate && (
              <span className="rounded-full bg-white px-5 py-2 shadow-md" style={{ color: PALETTE.choc }}>
                {new Date(event.mainDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            )}
            {event.mainStartTime && (
              <span
                className="rounded-full px-5 py-2 shadow-md"
                style={{ background: PALETTE.mint, color: PALETTE.text }}
              >
                {event.mainStartTime}
              </span>
            )}
            {event.city && (
              <span
                className="rounded-full px-5 py-2 shadow-md"
                style={{ background: accent, color: "#fff" }}
              >
                {event.city}
              </span>
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* ─── STORY ─── */}
      {showStory && (
        <section className="relative mx-auto max-w-4xl px-6 py-24 sm:py-32">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.9, ease: EASE }}
            className="relative rounded-[36px] px-8 py-14 text-center sm:px-14"
            style={{
              background: "rgba(255,255,255,0.75)",
              boxShadow: `0 20px 60px rgba(107,58,30,0.15), inset 0 0 0 2px ${accent}40`,
            }}
          >
            <p
              className="mb-4 text-xs font-black uppercase tracking-[0.5em]"
              style={{ color: PALETTE.cherry }}
            >
              A sweet invitation
            </p>
            <h2
              className="font-display text-3xl font-black leading-tight sm:text-4xl"
              style={{ color: PALETTE.choc }}
            >
              {invitationMessage}
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed sm:text-lg">{aboutStory}</p>
          </motion.div>
        </section>
      )}

      {/* ─── SUB-EVENTS ─── */}
      {showEvents && (
        <section className="relative py-20 sm:py-28">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-3 text-center text-xs font-black uppercase tracking-[0.5em]"
            style={{ color: PALETTE.cherry }}
          >
            Today's Menu
          </motion.p>
          <h2
            className="mb-14 text-center font-display text-4xl font-black"
            style={{ color: PALETTE.choc }}
          >
            Unwrap every moment
          </h2>
          <div className="mx-auto grid max-w-5xl gap-8 px-4 sm:grid-cols-2 sm:px-6">
            {sortedSubs.map((s, i) => (
              <WrapperCard
                key={s.order}
                s={s}
                i={i}
                reduce={reduce}
                color={wrapperColors[i % wrapperColors.length]}
              />
            ))}
          </div>
        </section>
      )}

      {/* ─── GALLERY ─── */}
      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-3 text-center text-xs font-black uppercase tracking-[0.5em]"
            style={{ color: PALETTE.cherry }}
          >
            The Cookie Jar
          </motion.p>
          <h2
            className="mb-14 text-center font-display text-4xl font-black"
            style={{ color: PALETTE.choc }}
          >
            Fresh from the oven
          </h2>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((m, i) => (
              <Cookie
                key={`${m.fileName}-${i}`}
                url={m.publicUrl}
                caption={m.caption ?? undefined}
                i={i}
                reduce={reduce}
              />
            ))}
            {editing && galleryItems.length === 0 && (
              <div
                className="col-span-full flex h-48 items-center justify-center rounded-3xl border-2 border-dashed text-sm font-bold"
                style={{ borderColor: PALETTE.choc, color: PALETTE.choc }}
              >
                + Add sweet memories
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── VENUE ─── */}
      {showVenue && (
        <section className="relative mx-auto max-w-5xl px-6 py-24 sm:py-32">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-3 text-center text-xs font-black uppercase tracking-[0.5em]"
            style={{ color: PALETTE.cherry }}
          >
            The Factory Gates
          </motion.p>
          <h2
            className="mb-10 text-center font-display text-4xl font-black"
            style={{ color: PALETTE.choc }}
          >
            {event.venueName || "Meet us here"}
          </h2>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="overflow-hidden rounded-[32px] p-2"
            style={{
              background: "rgba(255,255,255,0.7)",
              boxShadow: `0 20px 60px rgba(107,58,30,0.18), inset 0 0 0 3px ${PALETTE.mint}`,
            }}
          >
            <div className="overflow-hidden rounded-[24px]">
              <MapEmbed
                latitude={event.latitude}
                longitude={event.longitude}
                venueName={event.venueName}
                venueAddress={event.venueAddress}
                mapLink={event.mapLink}
              />
            </div>
          </motion.div>
          {event.venueAddress && (
            <p className="mt-6 text-center text-base font-semibold" style={{ color: PALETTE.choc }}>
              {event.venueAddress}
            </p>
          )}
        </section>
      )}

      {/* ─── RSVP / CTA ─── */}
      <section className="relative px-6 py-28 text-center sm:py-40">
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE }}
          className="mx-auto max-w-3xl"
        >
          <p
            className="text-xs font-black uppercase tracking-[0.5em]"
            style={{ color: PALETTE.cherry }}
          >
            One last treat
          </p>
          <h2
            className="mt-4 font-display text-[clamp(2.4rem,7vw,5rem)] font-black leading-[0.95]"
            style={{
              color: PALETTE.choc,
              textShadow: `3px 3px 0 ${accent}, 6px 6px 0 ${PALETTE.mint}`,
            }}
          >
            Save room for cake
          </h2>
          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <motion.a
              whileHover={reduce ? undefined : { scale: 1.05, rotate: -1 }}
              whileTap={{ scale: 0.97 }}
              href={event.rsvpLinkOrContact}
              target="_blank"
              rel="noreferrer"
              className="mt-10 inline-block rounded-full px-12 py-5 font-display text-lg font-black uppercase tracking-[0.2em]"
              style={{
                background: accent,
                color: "#fff",
                boxShadow: `0 10px 0 ${PALETTE.choc}, 0 14px 24px rgba(107,58,30,0.35)`,
              }}
            >
              RSVP with sprinkles
            </motion.a>
          )}
        </motion.div>
      </section>

      <footer
        className="relative border-t-2 py-8 text-center text-sm font-bold"
        style={{ borderColor: `${PALETTE.choc}20`, color: PALETTE.choc }}
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

export default CandylandTemplate;
