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
  sky: "#a8d8f0",
  orange: "#ff9f4a",
  mint: "#4fd1a5",
  yellow: "#ffd166",
  cherry: "#ff5a75",
  navy: "#1e3a5f",
};

const BLOCKS = [
  { x: 6, y: 62, w: 90, h: 70, color: PALETTE.orange, rot: -6, delay: 0 },
  { x: 82, y: 20, w: 76, h: 76, color: PALETTE.cherry, rot: 8, delay: 0.4 },
  { x: 18, y: 15, w: 60, h: 90, color: PALETTE.yellow, rot: 3, delay: 0.8 },
  { x: 68, y: 68, w: 96, h: 60, color: PALETTE.mint, rot: -10, delay: 0.2 },
  { x: 45, y: 8, w: 54, h: 54, color: PALETTE.mint, rot: 12, delay: 1.0 },
  { x: 88, y: 55, w: 48, h: 80, color: PALETTE.orange, rot: -4, delay: 0.6 },
  { x: 3, y: 32, w: 42, h: 42, color: PALETTE.cherry, rot: 14, delay: 1.2 },
  { x: 55, y: 78, w: 72, h: 46, color: PALETTE.yellow, rot: -8, delay: 0.3 },
];

const BALLOONS = Array.from({ length: 10 }, (_, i) => ({
  x: (i * 37 + 5) % 100,
  color: [PALETTE.cherry, PALETTE.orange, PALETTE.yellow, PALETTE.mint][i % 4],
  size: 26 + (i % 3) * 8,
  delay: (i % 5) * 1.4,
  dur: 14 + (i % 4) * 3,
}));

function BalloonField({ reduce }: { reduce: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" style={{ background: `linear-gradient(180deg, ${PALETTE.sky} 0%, #cbe8f7 100%)` }}>
      {!reduce && BALLOONS.map((b, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: `${b.x}%`, bottom: "-15%" }}
          animate={{ y: ["0vh", "-130vh"], x: [0, 15, -10, 0] }}
          transition={{ duration: b.dur, delay: b.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width={b.size} height={b.size * 1.6} viewBox="0 0 40 64">
            <ellipse cx="20" cy="22" rx="18" ry="22" fill={b.color} />
            <ellipse cx="14" cy="14" rx="4" ry="6" fill="white" opacity="0.4" />
            <polygon points="17,43 23,43 20,48" fill={b.color} />
            <path d="M 20 48 Q 22 54 18 58 Q 22 62 20 64" stroke={PALETTE.navy} strokeWidth="1" fill="none" opacity="0.4" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

function ToyTrain({ reduce, accent }: { reduce: boolean; accent: string }) {
  return (
    <div aria-hidden className="pointer-events-none relative h-24 w-full overflow-hidden">
      <motion.div
        className="absolute top-4"
        style={{ left: 0 }}
        animate={reduce ? undefined : { x: ["-30%", "130%"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      >
        <svg width="260" height="70" viewBox="0 0 260 70">
          {/* Locomotive */}
          <rect x="8" y="20" width="48" height="30" rx="6" fill={accent} stroke={PALETTE.navy} strokeWidth="2.5" />
          <rect x="38" y="8" width="14" height="14" rx="2" fill={accent} stroke={PALETTE.navy} strokeWidth="2.5" />
          <circle cx="18" cy="54" r="8" fill={PALETTE.navy} />
          <circle cx="46" cy="54" r="8" fill={PALETTE.navy} />
          <circle cx="18" cy="54" r="3" fill={PALETTE.yellow} />
          <circle cx="46" cy="54" r="3" fill={PALETTE.yellow} />
          {/* Wagons */}
          <rect x="70" y="26" width="42" height="24" rx="4" fill={PALETTE.yellow} stroke={PALETTE.navy} strokeWidth="2.5" />
          <circle cx="80" cy="54" r="7" fill={PALETTE.navy} />
          <circle cx="102" cy="54" r="7" fill={PALETTE.navy} />
          <rect x="122" y="26" width="42" height="24" rx="4" fill={PALETTE.mint} stroke={PALETTE.navy} strokeWidth="2.5" />
          <circle cx="132" cy="54" r="7" fill={PALETTE.navy} />
          <circle cx="154" cy="54" r="7" fill={PALETTE.navy} />
          <rect x="174" y="26" width="42" height="24" rx="4" fill={PALETTE.cherry} stroke={PALETTE.navy} strokeWidth="2.5" />
          <circle cx="184" cy="54" r="7" fill={PALETTE.navy} />
          <circle cx="206" cy="54" r="7" fill={PALETTE.navy} />
        </svg>
      </motion.div>
      <div className="absolute bottom-6 left-0 right-0 h-1 border-b-4 border-dotted" style={{ borderColor: PALETTE.navy, opacity: 0.35 }} />
    </div>
  );
}

function PresentBox({ children, ribbon, i }: { children: React.ReactNode; ribbon: string; i: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 20, rotate: -2 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.6, delay: i * 0.06, ease: EASE }}
      whileHover={reduce ? undefined : { y: -6, rotate: 1 }}
      className="relative overflow-hidden rounded-3xl border-[5px] shadow-[0_8px_0_rgba(30,58,95,0.2)]"
      style={{ borderColor: PALETTE.navy, background: "white" }}
    >
      <div className="relative">
        {children}
        {/* Ribbon overlay */}
        <div className="pointer-events-none absolute inset-y-0 left-1/2 w-6 -translate-x-1/2" style={{ background: ribbon, opacity: 0.85 }} />
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-6 -translate-y-1/2" style={{ background: ribbon, opacity: 0.85 }} />
        {/* Bow */}
        <svg className="pointer-events-none absolute -top-3 left-1/2 -translate-x-1/2" width="60" height="40" viewBox="0 0 60 40">
          <ellipse cx="18" cy="20" rx="14" ry="10" fill={ribbon} stroke={PALETTE.navy} strokeWidth="2.5" />
          <ellipse cx="42" cy="20" rx="14" ry="10" fill={ribbon} stroke={PALETTE.navy} strokeWidth="2.5" />
          <rect x="26" y="14" width="8" height="14" rx="2" fill={ribbon} stroke={PALETTE.navy} strokeWidth="2.5" />
        </svg>
      </div>
    </motion.div>
  );
}

function ToyTimeline({ items, accent }: { items: SubEvent[]; accent: string }) {
  const reduce = useReducedMotion();
  const sorted = [...items].sort((a, b) => a.order - b.order);
  const colors = [PALETTE.orange, PALETTE.mint, PALETTE.cherry, PALETTE.yellow];
  return (
    <div className="mx-auto max-w-5xl px-6">
      <div className="grid gap-6 sm:grid-cols-2">
        {sorted.map((s, i) => {
          const c = colors[i % colors.length];
          return (
            <motion.article
              key={s.order}
              initial={reduce ? false : { opacity: 0, y: 24, rotate: i % 2 ? 2 : -2 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: EASE }}
              whileHover={reduce ? undefined : { y: -4, rotate: i % 2 ? -1 : 1 }}
              className="relative rounded-[28px] border-[5px] p-6 shadow-[0_10px_0_rgba(30,58,95,0.18)]"
              style={{ borderColor: PALETTE.navy, background: c }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-2xl border-[3px] font-display text-xl font-black"
                  style={{ borderColor: PALETTE.navy, background: "white", color: PALETTE.navy }}
                >
                  {String(s.order).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-2xl font-black leading-tight" style={{ color: PALETTE.navy }}>{s.name}</h3>
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: PALETTE.navy, opacity: 0.7 }}>
                    {[s.date, s.startTime].filter(Boolean).join(" · ")}
                  </p>
                </div>
              </div>
              {s.venueName && <p className="mt-3 text-sm font-semibold" style={{ color: PALETTE.navy }}>@ {s.venueName}</p>}
              {s.description && <p className="mt-2 text-sm leading-relaxed" style={{ color: PALETTE.navy, opacity: 0.8 }}>{s.description}</p>}
              {s.dressCode && (
                <span
                  className="mt-4 inline-block rounded-full border-[3px] bg-white px-4 py-1 text-[11px] font-bold uppercase tracking-widest"
                  style={{ borderColor: PALETTE.navy, color: PALETTE.navy }}
                >
                  {s.dressCode}
                </span>
              )}
              <span className="absolute -right-3 -top-3 text-3xl" aria-hidden>{["🎈", "🎁", "🧸", "⭐"][i % 4]}</span>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}

export const ToyboxTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || PALETTE.orange;
  const tagline = event.tagline?.trim() || "Welcome to the toy universe!";
  const invitationMessage = event.invitationMessage?.trim() || "Blocks stacked as tall as buildings, trains chugging past presents bigger than you, balloons carrying every silly wish — come play in the toy city we built for the birthday kid.";
  const aboutStory = event.aboutStory?.trim() || "";
  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const hero = event.heroImageUrl || "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=1600&q=80";

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroTextY = useTransform(heroP, [0, 0.5], [0, -60]);
  const heroOpacity = useTransform(heroP, [0, 0.6], [1, 0]);

  const showStory = !event.hideStory;
  const showJourney = !event.hideEvents && subEvents.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  const ribbonColors = [PALETTE.cherry, PALETTE.orange, PALETTE.mint, PALETTE.yellow];

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-sans antialiased"
      style={{ "--accent": accent, color: PALETTE.navy } as React.CSSProperties}
    >
      <BalloonField reduce={reduce} />
      <ScrollProgress color={accent} />

      {/* HERO — TOY CITY */}
      <section ref={heroRef} className="relative flex min-h-[720px] items-center justify-center overflow-hidden px-6 pb-24 pt-32">
        <div aria-hidden className="absolute inset-0">
          {BLOCKS.map((b, i) => (
            <motion.div
              key={i}
              className="absolute rounded-2xl border-[5px] shadow-[0_8px_0_rgba(30,58,95,0.25)]"
              style={{
                left: `${b.x}%`,
                top: `${b.y}%`,
                width: b.w,
                height: b.h,
                background: b.color,
                borderColor: PALETTE.navy,
                transform: `rotate(${b.rot}deg)`,
              }}
              animate={reduce ? undefined : { y: [0, -14, 0] }}
              transition={{ duration: 3 + (i % 4) * 0.6, delay: b.delay, repeat: Infinity, ease: "easeInOut" }}
            >
              {i % 2 === 0 && (
                <div className="absolute inset-3 flex items-center justify-center font-display text-2xl font-black" style={{ color: PALETTE.navy, opacity: 0.55 }}>
                  {["A", "B", "★", "1", "♥", "2", "☀", "3"][i]}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div style={reduce ? undefined : { y: heroTextY, opacity: heroOpacity }} className="relative z-10 mx-auto max-w-4xl text-center">
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="mb-6 inline-block rounded-full border-[4px] bg-white px-6 py-2 font-display text-sm font-black uppercase tracking-widest shadow-[0_6px_0_rgba(30,58,95,0.2)]"
            style={{ borderColor: PALETTE.navy, color: accent }}
          >
            {tagline}
          </motion.div>
          <h1 className="font-display text-[clamp(3rem,11vw,7.5rem)] font-black leading-[0.9]" style={{ color: PALETTE.navy, textShadow: `4px 4px 0 ${PALETTE.yellow}` }}>
            {event.eventTitle}
          </h1>
          {event.person1Name && (
            <p className="mt-4 font-display text-2xl font-bold sm:text-3xl" style={{ color: accent }}>
              is turning bigger! <span aria-hidden>🎂</span>
            </p>
          )}
          <div className="mt-8 inline-flex flex-wrap justify-center gap-3 rounded-3xl border-[4px] bg-white px-6 py-4 font-display text-base font-bold sm:text-lg" style={{ borderColor: PALETTE.navy }}>
            {event.mainDate && (
              <span>
                {new Date(event.mainDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </span>
            )}
            {event.mainStartTime && <span style={{ color: accent }}>·</span>}
            {event.mainStartTime && <span>{event.mainStartTime}</span>}
            {event.city && <><span style={{ color: accent }}>·</span><span>{event.city}</span></>}
          </div>
        </motion.div>

        <div className="absolute inset-x-0 bottom-0 h-6" style={{ background: `repeating-linear-gradient(90deg, ${PALETTE.cherry} 0 24px, ${PALETTE.yellow} 24px 48px, ${PALETTE.mint} 48px 72px, ${PALETTE.orange} 72px 96px)` }} />
      </section>

      {/* HERO PHOTO CARD */}
      <section className="relative mx-auto -mt-8 max-w-4xl px-6">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 30, rotate: -2 }}
          whileInView={{ opacity: 1, y: 0, rotate: -1.5 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          className="overflow-hidden rounded-[32px] border-[6px] shadow-[0_14px_0_rgba(30,58,95,0.2)]"
          style={{ borderColor: PALETTE.navy, background: "white" }}
        >
          <HeroMedia imageSrc={hero} videoSrc={event.heroVideoUrl || undefined} alt={event.eventTitle} className="aspect-[16/9]" />
        </motion.div>
      </section>

      {/* STORY */}
      {showStory && (
        <section className="relative mx-auto max-w-5xl px-6 py-24 sm:py-32">
          <div className="grid items-center gap-10 sm:grid-cols-2">
            <motion.div
              initial={reduce ? false : { opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              <p className="mb-3 font-display text-sm font-black uppercase tracking-widest" style={{ color: accent }}>
                A note from the toy box
              </p>
              <h2 className="font-display text-4xl font-black leading-[1.05] sm:text-5xl" style={{ color: PALETTE.navy }}>
                {invitationMessage}
              </h2>
            </motion.div>
            <motion.div
              initial={reduce ? false : { opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
              className="rounded-[28px] border-[5px] p-8 shadow-[0_10px_0_rgba(30,58,95,0.18)]"
              style={{ borderColor: PALETTE.navy, background: PALETTE.yellow }}
            >
              <p className="text-lg font-semibold leading-relaxed" style={{ color: PALETTE.navy }}>
                {aboutStory || "There will be cake as tall as a castle, games loud enough to hear from the moon, and a whole street of toys waiting for you to press their buttons. Bring your loudest laugh."}
              </p>
              <div className="mt-4 flex gap-2 text-3xl" aria-hidden>
                <span>🧸</span><span>🎈</span><span>🎁</span><span>🚂</span><span>⭐</span>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* SUB EVENTS */}
      {showJourney && (
        <section className="relative py-20 sm:py-28">
          <ToyTrain reduce={reduce} accent={accent} />
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 mt-4 text-center font-display text-4xl font-black sm:text-5xl"
            style={{ color: PALETTE.navy }}
          >
            The party <span style={{ color: accent }}>schedule</span>
          </motion.p>
          <ToyTimeline items={subEvents} accent={accent} />
        </section>
      )}

      {/* GALLERY — PRESENT BOXES */}
      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-24 sm:py-28">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-12 text-center font-display text-4xl font-black sm:text-5xl"
            style={{ color: PALETTE.navy }}
          >
            Memory <span style={{ color: accent }}>presents</span> 🎁
          </motion.p>
          <div className="grid gap-8 pt-6 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((m, i) => (
              <PresentBox key={`${m.fileName}-${i}`} ribbon={ribbonColors[i % ribbonColors.length]} i={i}>
                <img
                  src={m.publicUrl}
                  alt={m.caption ?? ""}
                  className="aspect-[4/5] w-full object-cover"
                  loading="lazy"
                />
              </PresentBox>
            ))}
            {editing && galleryItems.length === 0 && (
              <div
                className="col-span-full flex h-64 items-center justify-center rounded-[28px] border-[5px] border-dashed font-display text-lg font-bold"
                style={{ borderColor: PALETTE.navy, color: PALETTE.navy, background: "white" }}
              >
                + Add photos to the toy box
              </div>
            )}
          </div>
        </section>
      )}

      {/* VENUE */}
      {showVenue && (
        <section className="relative mx-auto max-w-5xl px-6 py-24 sm:py-28">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-8 text-center font-display text-4xl font-black sm:text-5xl"
            style={{ color: PALETTE.navy }}
          >
            Find the <span style={{ color: accent }}>toy city</span>
          </motion.p>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="overflow-hidden rounded-[32px] border-[6px] p-2 shadow-[0_12px_0_rgba(30,58,95,0.2)]"
            style={{ borderColor: PALETTE.navy, background: "white" }}
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
          initial={reduce ? false : { opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE }}
          className="mx-auto max-w-3xl"
        >
          <div className="mb-6 flex justify-center gap-3 text-5xl" aria-hidden>
            <motion.span animate={reduce ? undefined : { rotate: [-8, 8, -8] }} transition={{ duration: 2, repeat: Infinity }}>🎈</motion.span>
            <motion.span animate={reduce ? undefined : { y: [0, -10, 0] }} transition={{ duration: 1.6, repeat: Infinity, delay: 0.3 }}>🎂</motion.span>
            <motion.span animate={reduce ? undefined : { rotate: [8, -8, 8] }} transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}>🎁</motion.span>
          </div>
          <h2 className="font-display text-[clamp(2.5rem,8vw,5.5rem)] font-black leading-[0.9]" style={{ color: PALETTE.navy, textShadow: `4px 4px 0 ${PALETTE.mint}` }}>
            Come play with us!
          </h2>
          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <motion.a
              whileHover={reduce ? undefined : { scale: 1.05, rotate: -1 }}
              href={event.rsvpLinkOrContact}
              target="_blank"
              rel="noreferrer"
              className="mt-10 inline-block rounded-full border-[5px] px-12 py-5 font-display text-lg font-black uppercase tracking-wider shadow-[0_8px_0_rgba(30,58,95,0.3)]"
              style={{ borderColor: PALETTE.navy, background: accent, color: PALETTE.navy }}
            >
              RSVP — I&apos;ll be there!
            </motion.a>
          )}
        </motion.div>
      </section>

      <footer className="border-t-4 py-8 text-center font-display text-sm font-bold" style={{ borderColor: PALETTE.navy, background: "white", color: PALETTE.navy }}>
        <p>{event.eventTitle}{event.person1Name ? ` · ${event.person1Name}` : ""} · built in the toy city</p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default ToyboxTemplate;
