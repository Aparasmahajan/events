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

const STARS = [
  { x: 6, y: 8, s: 1.2, d: 0.2 }, { x: 14, y: 22, s: 0.8, d: 1.1 },
  { x: 22, y: 11, s: 1.6, d: 0.6 }, { x: 31, y: 27, s: 0.9, d: 2.0 },
  { x: 39, y: 6, s: 1.1, d: 1.4 }, { x: 47, y: 18, s: 1.4, d: 0.9 },
  { x: 56, y: 9, s: 0.7, d: 2.4 }, { x: 63, y: 24, s: 1.3, d: 0.3 },
  { x: 71, y: 13, s: 1.0, d: 1.7 }, { x: 79, y: 28, s: 1.5, d: 0.8 },
  { x: 87, y: 7, s: 0.9, d: 2.2 }, { x: 94, y: 20, s: 1.2, d: 1.3 },
  { x: 4, y: 35, s: 1.4, d: 0.5 }, { x: 12, y: 48, s: 0.8, d: 1.9 },
  { x: 19, y: 41, s: 1.0, d: 1.0 }, { x: 27, y: 55, s: 1.3, d: 0.4 },
  { x: 35, y: 46, s: 0.7, d: 2.3 }, { x: 43, y: 38, s: 1.6, d: 0.7 },
  { x: 51, y: 52, s: 0.9, d: 1.6 }, { x: 59, y: 44, s: 1.1, d: 1.2 },
  { x: 67, y: 57, s: 1.4, d: 0.6 }, { x: 75, y: 40, s: 0.8, d: 2.1 },
  { x: 83, y: 51, s: 1.2, d: 0.9 }, { x: 91, y: 43, s: 1.5, d: 1.8 },
  { x: 3, y: 65, s: 1.0, d: 1.5 }, { x: 11, y: 78, s: 1.3, d: 0.3 },
  { x: 18, y: 71, s: 0.9, d: 2.5 }, { x: 25, y: 85, s: 1.4, d: 1.1 },
  { x: 33, y: 68, s: 0.7, d: 0.8 }, { x: 41, y: 82, s: 1.2, d: 1.9 },
  { x: 49, y: 74, s: 1.1, d: 0.4 }, { x: 57, y: 88, s: 1.5, d: 1.3 },
  { x: 65, y: 70, s: 0.8, d: 2.0 }, { x: 73, y: 83, s: 1.3, d: 0.7 },
  { x: 81, y: 76, s: 1.0, d: 1.6 }, { x: 89, y: 89, s: 1.4, d: 0.5 },
  { x: 96, y: 72, s: 0.9, d: 2.2 }, { x: 8, y: 92, s: 1.2, d: 1.0 },
  { x: 16, y: 15, s: 0.6, d: 1.8 }, { x: 24, y: 33, s: 1.1, d: 0.6 },
  { x: 44, y: 62, s: 0.8, d: 1.4 }, { x: 52, y: 25, s: 1.3, d: 2.1 },
  { x: 68, y: 36, s: 0.9, d: 0.9 }, { x: 76, y: 60, s: 1.5, d: 1.5 },
  { x: 84, y: 32, s: 1.0, d: 0.7 }, { x: 92, y: 58, s: 1.2, d: 1.9 },
  { x: 36, y: 76, s: 0.7, d: 2.3 }, { x: 60, y: 78, s: 1.4, d: 1.0 },
  { x: 88, y: 15, s: 0.8, d: 1.6 }, { x: 20, y: 60, s: 1.1, d: 0.4 },
];

const ORBITS = [
  { deg: 0, r: 60, size: 6 },
  { deg: 60, r: 72, size: 4 },
  { deg: 130, r: 55, size: 5 },
  { deg: 200, r: 78, size: 4 },
  { deg: 260, r: 64, size: 6 },
  { deg: 320, r: 70, size: 4 },
];

const BURST_LINES = Array.from({ length: 18 }, (_, i) => ({
  angle: (i * 360) / 18,
  delay: (i % 6) * 0.08,
}));

function DeepSpace({ reduce }: { reduce: boolean }) {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #08061c 0%, #160d33 50%, #08061c 100%)" }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 30% 20%, rgba(180,142,255,0.12), transparent 55%), radial-gradient(ellipse at 75% 70%, rgba(255,139,176,0.10), transparent 55%)" }} />
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        {STARS.map((s, i) => (
          <motion.circle
            key={i}
            cx={s.x} cy={s.y} r={s.s / 22}
            fill="#ffffff"
            initial={reduce ? undefined : { opacity: 0.2 }}
            animate={reduce ? { opacity: 0.7 } : { opacity: [0.25, 1, 0.25] }}
            transition={{ duration: 3 + (i % 5) * 0.6, delay: s.d, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </svg>
    </div>
  );
}

function MemoryStarCard({ index, title, body, accent, connectPrev }: { index: number; title: string; body: string; accent: string; connectPrev: boolean }) {
  const reduce = useReducedMotion();
  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.9, delay: index * 0.08, ease: EASE }}
      className="relative rounded-2xl border border-white/[0.08] p-7 backdrop-blur-xl"
      style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,139,176,0.03))" }}
    >
      {connectPrev && !reduce && (
        <svg aria-hidden className="pointer-events-none absolute -top-16 left-6 h-16 w-16">
          <motion.line
            x1="8" y1="0" x2="8" y2="64"
            stroke={accent} strokeWidth={1.2}
            strokeDasharray={64}
            initial={{ strokeDashoffset: 64, opacity: 0 }}
            whileInView={{ strokeDashoffset: 0, opacity: 0.6 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: index * 0.08 + 0.2, ease: EASE }}
          />
        </svg>
      )}
      <span aria-hidden className="absolute -left-2 -top-2 flex h-6 w-6 items-center justify-center">
        <svg viewBox="0 0 24 24" className="h-full w-full" style={{ filter: `drop-shadow(0 0 6px ${accent})` }}>
          <path d="M12 2 L14 9 L21 10 L15.5 14.5 L17 22 L12 18 L7 22 L8.5 14.5 L3 10 L10 9 Z" fill="#ffffff" opacity="0.95" />
        </svg>
      </span>
      <p className="mb-2 text-[10px] uppercase tracking-[0.45em]" style={{ color: accent }}>
        Memory {String(index + 1).padStart(2, "0")}
      </p>
      <h3 className="font-display text-2xl text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-white/70">{body}</p>
    </motion.article>
  );
}

function OrbitTimeline({ items, accent }: { items: SubEvent[]; accent: string }) {
  const reduce = useReducedMotion();
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <div className="mx-auto max-w-3xl px-6">
      <ol className="relative space-y-10">
        <motion.span
          aria-hidden
          className="absolute left-3 top-2 bottom-2 w-px"
          style={{ background: `linear-gradient(180deg, transparent, ${accent}66, #e8c45866, transparent)`, transformOrigin: "top" }}
          initial={reduce ? undefined : { scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: EASE }}
        />
        {sorted.map((s, i) => (
          <motion.li
            key={s.order}
            initial={reduce ? false : { opacity: 0, x: 10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-8% 0px" }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: EASE }}
            className="relative pl-12"
          >
            <span
              aria-hidden
              className="absolute left-1 top-1 h-5 w-5 rounded-full"
              style={{ background: "#ffffff", boxShadow: `0 0 10px ${accent}, 0 0 22px ${accent}99, 0 0 34px #e8c45855` }}
            />
            <p className="text-[10px] uppercase tracking-[0.4em]" style={{ color: "#e8c458" }}>
              {[s.date, s.startTime].filter(Boolean).join(" · ")}
            </p>
            <h3 className="mt-1 font-display text-2xl text-white">{s.name}</h3>
            {s.venueName && <p className="mt-1 text-sm text-white/70">{s.venueName}</p>}
            {s.description && <p className="mt-2 text-sm leading-relaxed text-white/60">{s.description}</p>}
            {s.dressCode && (
              <p className="mt-3 inline-block rounded-full border border-white/15 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-white/70">
                {s.dressCode}
              </p>
            )}
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

export const LovestarsTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || "#ff8bb0";
  const gold = "#e8c458";
  const tagline = event.tagline?.trim() || "Two stars, one orbit.";
  const invitationMessage = event.invitationMessage?.trim()
    || "A quiet universe conspired, and one soft evening the answer was yes. Come stand under the same sky and celebrate the promise.";
  const aboutStory = event.aboutStory?.trim()
    || "Every love story is a constellation waiting to be drawn — each memory a star, each promise the line between them.";
  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const hero = event.heroImageUrl
    || "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80";

  const memories = [
    { title: "The first look", body: "A room full of people and only one you could see. The rest of the night had to try harder." },
    { title: "The quiet everything", body: "Ordinary Tuesdays, shared playlists, cold coffee. The little orbit that turned into a life." },
    { title: "The proposal", body: "One knee. One question. A universe rearranging itself into a yes." },
  ];

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
      className="relative min-h-screen overflow-x-clip font-sans text-[#f0eaff] antialiased"
      style={{ background: "#08061c", "--accent": accent } as React.CSSProperties}
    >
      <DeepSpace reduce={reduce} />
      <ScrollProgress color={accent} />

      <section ref={heroRef} className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-5">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <HeroMedia imageSrc={hero} videoSrc={event.heroVideoUrl || undefined} alt={event.eventTitle} className="opacity-25" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(8,6,28,0.6), rgba(8,6,28,0.3) 40%, rgba(8,6,28,0.95))" }} />
        </div>

        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 sm:h-[380px] sm:w-[380px]"
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle at 40% 35%, #fff2c1 0%, ${gold} 22%, #c48f2c 55%, transparent 78%)`,
              boxShadow: `0 0 80px ${gold}88, 0 0 160px ${accent}55, inset -20px -30px 60px rgba(0,0,0,0.4)`,
            }}
          />
          <div
            className="absolute inset-[-14%] rounded-full border"
            style={{ borderColor: `${gold}44`, transform: "rotateX(70deg)" }}
          />
          <div
            className="absolute inset-[-8%] rounded-full border"
            style={{ borderColor: `${accent}44`, transform: "rotateX(70deg) rotate(20deg)" }}
          />
          {ORBITS.map((o, i) => {
            const rad = (o.deg * Math.PI) / 180;
            const cx = 50 + (o.r / 2) * Math.cos(rad);
            const cy = 50 + (o.r / 2) * Math.sin(rad);
            return (
              <span
                key={i}
                aria-hidden
                className="absolute rounded-full"
                style={{
                  left: `${cx}%`, top: `${cy}%`,
                  width: o.size, height: o.size,
                  transform: "translate(-50%,-50%)",
                  background: i % 2 === 0 ? "#ffffff" : accent,
                  boxShadow: `0 0 10px ${i % 2 === 0 ? "#ffffff" : accent}`,
                }}
              />
            );
          })}
        </motion.div>

        <motion.div style={reduce ? undefined : { y: heroTextY, opacity: heroOpacity }} className="relative z-10 max-w-3xl text-center">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="mb-6 text-[10px] uppercase tracking-[0.6em]"
            style={{ color: accent, textShadow: `0 0 20px ${accent}` }}
          >
            {tagline}
          </motion.p>
          <h1 className="font-display text-[clamp(2.4rem,8vw,5.8rem)] font-light leading-[1.02] tracking-tight text-white">
            {event.eventTitle}
          </h1>
          {(event.person1Name || event.person2Name) && (
            <motion.p
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 1.1 }}
              className="mt-5 font-serif italic text-lg text-white/80 sm:text-xl"
            >
              {[event.person1Name, event.person2Name].filter(Boolean).join(" · ")}
            </motion.p>
          )}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.5 }}
            className="mt-10 flex flex-wrap justify-center gap-4 text-xs uppercase tracking-[0.4em] text-white/70"
          >
            {event.mainDate && (
              <span>{new Date(event.mainDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</span>
            )}
            {event.mainStartTime && <><span className="opacity-40">·</span><span>{event.mainStartTime}</span></>}
            {event.city && <><span className="opacity-40">·</span><span>{event.city}</span></>}
          </motion.div>
        </motion.div>
      </section>

      {showStory && (
        <section className="relative mx-auto max-w-5xl px-6 py-24 sm:py-32">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-4 text-center text-[10px] uppercase tracking-[0.5em]"
            style={{ color: accent }}
          >
            Our Constellation
          </motion.p>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE }}
            className="mx-auto max-w-3xl text-center font-display text-2xl leading-[1.35] text-white sm:text-3xl"
          >
            {invitationMessage}
          </motion.p>
          <p className="mx-auto mt-8 max-w-2xl text-center text-base leading-relaxed text-white/70">
            {aboutStory}
          </p>

          <div className="mt-16 grid gap-14 sm:grid-cols-3 sm:gap-8">
            {memories.map((m, i) => (
              <MemoryStarCard
                key={i}
                index={i}
                title={m.title}
                body={m.body}
                accent={accent}
                connectPrev={i > 0}
              />
            ))}
          </div>

          <div className="relative mx-auto mt-24 flex h-56 max-w-md items-center justify-center">
            <div aria-hidden className="absolute inset-0">
              {BURST_LINES.map((b, i) => (
                <motion.span
                  key={i}
                  className="absolute left-1/2 top-1/2 h-px origin-left"
                  style={{
                    width: "42%",
                    background: `linear-gradient(90deg, ${gold}, transparent)`,
                    transform: `translate(0,-50%) rotate(${b.angle}deg)`,
                  }}
                  initial={reduce ? undefined : { scaleX: 0, opacity: 0 }}
                  whileInView={{ scaleX: 1, opacity: 0.7 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: b.delay, ease: EASE }}
                />
              ))}
              <motion.span
                className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{ background: `radial-gradient(circle, ${gold}cc, ${accent}66 40%, transparent 75%)`, filter: "blur(4px)" }}
                initial={reduce ? undefined : { scale: 0.4, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: EASE }}
              />
            </div>
            <div className="relative text-center">
              <p className="text-[10px] uppercase tracking-[0.55em]" style={{ color: gold }}>The moment</p>
              <p className="mt-3 font-display text-3xl italic text-white">Yes.</p>
            </div>
          </div>
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
            The Nights We’re Planning
          </motion.p>
          <OrbitTimeline items={subEvents} accent={accent} />
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
            Frames From Our Orbit
          </motion.p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((m, i) => (
              <motion.div
                key={`${m.fileName}-${i}`}
                initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.05, ease: EASE }}
                className="group relative overflow-hidden rounded-2xl"
                style={{ boxShadow: `0 0 0 1px rgba(255,255,255,0.06), 0 0 40px ${accent}22` }}
              >
                <img
                  src={m.publicUrl}
                  alt={m.caption ?? ""}
                  className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08061c]/70 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </motion.div>
            ))}
            {editing && galleryItems.length === 0 && (
              <div className="col-span-full flex h-48 items-center justify-center rounded-2xl border border-dashed border-white/20 text-sm opacity-60">
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
            Where The Sky Opens
          </motion.p>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE }}
            className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-1 backdrop-blur-xl"
            style={{ boxShadow: `0 0 40px ${accent}22` }}
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
          aria-hidden
          animate={reduce ? undefined : { scale: [1, 1.08, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          className="mx-auto mb-10 h-28 w-28 rounded-full sm:h-36 sm:w-36"
          style={{
            background: `radial-gradient(circle, ${gold}, ${accent}55 45%, transparent 75%)`,
            filter: "blur(14px)",
          }}
        />
        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE }}
          className="mx-auto max-w-2xl font-display text-[clamp(2rem,6vw,4rem)] font-light leading-[1.1] text-white"
        >
          Come draw a star with us.
        </motion.h2>
        {event.rsvpEnabled && event.rsvpLinkOrContact && (
          <motion.a
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            whileHover={reduce ? undefined : { scale: 1.04 }}
            href={event.rsvpLinkOrContact}
            target="_blank"
            rel="noreferrer"
            className="mt-10 inline-block rounded-full px-12 py-4 text-xs uppercase tracking-[0.4em] text-[#08061c] transition-all"
            style={{ background: `linear-gradient(90deg, ${gold}, ${accent})`, boxShadow: `0 0 40px ${accent}77` }}
          >
            RSVP to our sky
          </motion.a>
        )}
        {event.contactName && (
          <p className="mt-10 text-xs uppercase tracking-[0.4em] text-white/50">
            {event.contactName}{event.contactPhone ? ` · ${event.contactPhone}` : ""}
          </p>
        )}
      </section>

      <footer className="border-t border-white/[0.05] py-8 text-center text-xs text-white/40">
        <p>{event.eventTitle}{event.person1Name ? ` · ${event.person1Name}` : ""}{event.person2Name ? ` & ${event.person2Name}` : ""}</p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default LovestarsTemplate;
