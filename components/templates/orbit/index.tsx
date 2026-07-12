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

const PLANETS = [
  { color: "#ff6f91", ring: "#ffd166", size: 140, top: "12%", left: "8%", dur: 7, delay: 0 },
  { color: "#ffd166", ring: "#ff6f91", size: 90, top: "22%", left: "78%", dur: 6, delay: 0.8 },
  { color: "#06d6a0", ring: "#b28eff", size: 110, top: "62%", left: "14%", dur: 8, delay: 1.4 },
  { color: "#b28eff", ring: "#06d6a0", size: 80, top: "70%", left: "82%", dur: 6.5, delay: 0.3 },
  { color: "#ff6f91", ring: "#b28eff", size: 60, top: "40%", left: "48%", dur: 9, delay: 1.1 },
];

const STARS = Array.from({ length: 60 }, (_, i) => ({
  x: `${(i * 37 + 11) % 100}%`,
  y: `${(i * 53 + 7) % 100}%`,
  size: 1 + (i % 3) * 0.6,
  delay: (i % 8) * 0.4,
  dur: 2 + (i % 4) * 0.6,
}));

function CosmicField({ reduce }: { reduce: boolean }) {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #0a0e27 0%, #1a1e4a 60%, #0a0e27 100%)" }} />
      {!reduce && (
        <>
          <div className="absolute inset-0">
            {STARS.map((s, i) => (
              <motion.span
                key={i}
                className="absolute rounded-full bg-white"
                style={{ left: s.x, top: s.y, width: s.size, height: s.size, boxShadow: "0 0 4px #fff" }}
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: "easeInOut" }}
              />
            ))}
          </div>
          {PLANETS.map((p, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                top: p.top,
                left: p.left,
                width: p.size,
                height: p.size,
                background: `radial-gradient(circle at 30% 30%, #ffffff33, ${p.color} 40%, ${p.color} 70%)`,
                boxShadow: `0 0 60px ${p.color}55, inset -8px -12px 24px #00000033`,
                border: `1px dashed ${p.ring}88`,
              }}
              animate={{ y: [0, -20, 0, 18, 0], x: [0, 12, 0, -10, 0], rotate: [0, 4, 0, -4, 0] }}
              transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
            >
              <div
                className="absolute inset-[-14px] rounded-full"
                style={{ border: `1px dashed ${p.ring}55`, transform: "rotate(18deg)" }}
              />
            </motion.div>
          ))}
          <motion.div
            className="absolute h-[2px] w-[220px] origin-left"
            style={{ top: "18%", left: "-10%", background: "linear-gradient(90deg, transparent, #ffd166, #f8f4ff)", filter: "drop-shadow(0 0 6px #ffd166)", transform: "rotate(20deg)" }}
            animate={{ x: ["0vw", "130vw"], opacity: [0, 1, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 4, ease: "easeOut" }}
          />
          <motion.div
            className="absolute h-[2px] w-[180px] origin-left"
            style={{ top: "56%", left: "-10%", background: "linear-gradient(90deg, transparent, #06d6a0, #f8f4ff)", filter: "drop-shadow(0 0 6px #06d6a0)", transform: "rotate(15deg)" }}
            animate={{ x: ["0vw", "130vw"], opacity: [0, 1, 0] }}
            transition={{ duration: 2.8, delay: 2, repeat: Infinity, repeatDelay: 5, ease: "easeOut" }}
          />
        </>
      )}
    </div>
  );
}

function PlanetCard({ children, color, delay = 0 }: { children: React.ReactNode; color: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      whileHover={reduce ? undefined : { y: -6, rotate: -1 }}
      className="relative rounded-[28px] p-6 backdrop-blur-md"
      style={{
        background: "linear-gradient(160deg, #ffffff14, #ffffff06)",
        border: `2px solid ${color}55`,
        boxShadow: `0 10px 40px ${color}22, inset 0 0 30px ${color}11`,
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[-8px] rounded-[36px]"
        style={{ border: `1px dashed ${color}66` }}
      />
      <div className="relative">{children}</div>
    </motion.div>
  );
}

function OrbitTimeline({ items }: { items: SubEvent[] }) {
  const palette = ["#ff6f91", "#ffd166", "#06d6a0", "#b28eff"];
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <div className="mx-auto max-w-5xl px-6">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((s, i) => {
          const c = palette[i % palette.length];
          return (
            <PlanetCard key={s.order} color={c} delay={i * 0.08}>
              <div className="mb-4 flex items-center gap-3">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-black"
                  style={{ background: c, color: "#0a0e27", boxShadow: `0 0 20px ${c}` }}
                >
                  {String(s.order).padStart(2, "0")}
                </span>
                <span className="text-[10px] uppercase tracking-[0.25em] opacity-70" style={{ color: c }}>
                  {[s.date, s.startTime].filter(Boolean).join(" · ")}
                </span>
              </div>
              <h3 className="font-display text-2xl font-black leading-tight" style={{ transform: "rotate(-0.5deg)" }}>{s.name}</h3>
              {s.venueName && <p className="mt-2 text-sm opacity-70">@ {s.venueName}</p>}
              {s.description && <p className="mt-3 text-sm leading-relaxed opacity-70">{s.description}</p>}
              {s.dressCode && (
                <p
                  className="mt-4 inline-block rounded-full px-4 py-1 text-[10px] font-bold uppercase tracking-[0.2em]"
                  style={{ background: `${c}22`, color: c, border: `1px solid ${c}66` }}
                >
                  {s.dressCode}
                </p>
              )}
            </PlanetCard>
          );
        })}
      </div>
    </div>
  );
}

export const OrbitTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || "#ff6f91";
  const tagline = event.tagline?.trim() || "A little universe for a big day";
  const invitationMessage = event.invitationMessage?.trim() || "Blast off with us for a birthday among the stars — balloons, cake, and cosmic wonder await.";
  const aboutStory = event.aboutStory?.trim() || "";
  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const hero = event.heroImageUrl || "https://images.unsplash.com/photo-1520034475321-cbe63696469a?auto=format&fit=crop&w=1600&q=80";

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(heroP, [0, 1], [1, 0.92]);
  const heroTextY = useTransform(heroP, [0, 0.5], [0, -60]);
  const heroOpacity = useTransform(heroP, [0, 0.6], [1, 0]);

  const showStory = !event.hideStory;
  const showJourney = !event.hideEvents && subEvents.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-sans antialiased"
      style={{ "--accent": accent, color: "#f8f4ff", background: "#0a0e27" } as React.CSSProperties}
    >
      <CosmicField reduce={reduce} />
      <ScrollProgress color={accent} />

      {/* HERO */}
      <section ref={heroRef} className="relative flex min-h-[640px] h-[100svh] items-center justify-center overflow-hidden">
        <motion.div style={reduce ? undefined : { scale: heroScale }} className="absolute inset-0">
          <HeroMedia imageSrc={hero} videoSrc={event.heroVideoUrl || undefined} alt={event.eventTitle} className="opacity-40" />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 30%, #0a0e27 90%)" }} />
        </motion.div>

        <motion.div style={reduce ? undefined : { y: heroTextY, opacity: heroOpacity }} className="relative z-10 px-6 text-center">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6 inline-block rounded-full px-5 py-2 text-[11px] font-bold uppercase tracking-[0.4em]"
            style={{ background: `${accent}22`, color: accent, border: `1px solid ${accent}66` }}
          >
            {tagline}
          </motion.p>
          <motion.h1
            initial={reduce ? false : { opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: EASE }}
            className="font-display text-[clamp(3rem,13vw,10rem)] font-black leading-[0.9] tracking-tight"
            style={{ transform: "rotate(-1deg)", textShadow: `0 0 40px ${accent}66, 0 6px 0 #00000033` }}
          >
            {event.eventTitle}
          </motion.h1>
          {event.person1Name && (
            <motion.p
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mt-4 font-display text-2xl font-bold sm:text-3xl"
              style={{ color: "#ffd166" }}
            >
              turns another year brighter ✨
            </motion.p>
          )}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="mt-8 flex flex-wrap justify-center gap-3 text-sm font-bold"
          >
            {event.mainDate && (
              <span className="rounded-full px-5 py-2" style={{ background: "#06d6a022", color: "#06d6a0", border: "1px solid #06d6a066" }}>
                {new Date(event.mainDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </span>
            )}
            {event.mainStartTime && (
              <span className="rounded-full px-5 py-2" style={{ background: "#b28eff22", color: "#b28eff", border: "1px solid #b28eff66" }}>
                {event.mainStartTime}
              </span>
            )}
            {event.city && (
              <span className="rounded-full px-5 py-2" style={{ background: "#ffd16622", color: "#ffd166", border: "1px solid #ffd16666" }}>
                {event.city}
              </span>
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* STORY */}
      {showStory && (
        <section className="relative mx-auto max-w-5xl px-6 py-24 sm:py-32">
          <div className="grid items-center gap-12 sm:grid-cols-2">
            <motion.div
              initial={reduce ? false : { opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.5em]" style={{ color: "#ffd166" }}>
                Mission Briefing
              </p>
              <h2 className="font-display text-3xl font-black leading-tight sm:text-4xl" style={{ transform: "rotate(-0.5deg)" }}>
                {invitationMessage}
              </h2>
            </motion.div>
            <motion.div
              initial={reduce ? false : { opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
              className="relative"
            >
              <p className="text-base leading-relaxed opacity-80 sm:text-lg">
                {aboutStory || "Pack your imagination and your party hat. We are gathering the crew for cake, games, and a whole galaxy of fun. Wear something starry — the more sparkle, the better."}
              </p>
              <motion.div
                aria-hidden
                className="absolute -right-4 -top-6 h-16 w-16 rounded-full"
                style={{ background: "radial-gradient(circle at 30% 30%, #ffffff55, #ff6f91 70%)", boxShadow: "0 0 40px #ff6f9188" }}
                animate={reduce ? undefined : { y: [0, -10, 0], rotate: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* SUB-EVENTS TIMELINE */}
      {showJourney && (
        <section className="relative py-24 sm:py-32">
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-14 text-center"
          >
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.5em]" style={{ color: "#06d6a0" }}>
              The Orbit
            </p>
            <h2 className="font-display text-4xl font-black sm:text-5xl" style={{ transform: "rotate(-0.5deg)" }}>Plan your flight path</h2>
          </motion.div>
          <OrbitTimeline items={subEvents} />
        </section>
      )}

      {/* GALLERY */}
      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-10 text-center text-[11px] font-bold uppercase tracking-[0.5em]"
            style={{ color: "#b28eff" }}
          >
            Constellation of memories
          </motion.p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((m, i) => (
              <motion.div
                key={`${m.fileName}-${i}`}
                initial={reduce ? false : { opacity: 0, scale: 0.9, rotate: -2 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                whileHover={reduce ? undefined : { rotate: 1, y: -4 }}
                className="group relative overflow-hidden rounded-[24px]"
                style={{ border: `2px solid ${["#ff6f91", "#ffd166", "#06d6a0", "#b28eff"][i % 4]}66`, boxShadow: `0 8px 30px ${["#ff6f91", "#ffd166", "#06d6a0", "#b28eff"][i % 4]}33` }}
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
              <div className="col-span-full flex h-48 items-center justify-center rounded-[24px] border-2 border-dashed border-white/30 text-sm opacity-60">
                + Add photos
              </div>
            )}
          </div>
        </section>
      )}

      {/* VENUE */}
      {showVenue && (
        <section className="relative mx-auto max-w-5xl px-6 py-20 sm:py-28">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-6 text-center text-[11px] font-bold uppercase tracking-[0.5em]"
            style={{ color: "#ffd166" }}
          >
            Landing zone
          </motion.p>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="overflow-hidden rounded-[28px] p-1"
            style={{ background: "linear-gradient(135deg, #ff6f9155, #b28eff55, #06d6a055)" }}
          >
            <div className="overflow-hidden rounded-[24px] bg-[#0a0e27]">
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
      <section className="relative px-6 py-28 text-center sm:py-40">
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE }}
          className="mx-auto max-w-3xl"
        >
          <motion.div
            aria-hidden
            animate={reduce ? undefined : { scale: [1, 1.08, 0.94, 1], rotate: [0, 6, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="mx-auto mb-8 h-28 w-28 rounded-full sm:h-36 sm:w-36"
            style={{
              background: `radial-gradient(circle at 30% 30%, #ffffff88, ${accent} 60%, ${accent})`,
              boxShadow: `0 0 80px ${accent}, inset -14px -18px 30px #00000044`,
              border: "2px dashed #ffd16688",
            }}
          />
          <h2 className="font-display text-[clamp(2.5rem,9vw,6rem)] font-black leading-[0.9]" style={{ transform: "rotate(-1deg)", textShadow: `0 0 40px ${accent}66` }}>
            Join the orbit
          </h2>
          {event.person1Name && (
            <p className="mt-4 font-display text-xl font-bold" style={{ color: "#ffd166" }}>
              for {event.person1Name}
            </p>
          )}
          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <motion.div whileHover={reduce ? undefined : { scale: 1.05, rotate: -1 }} className="mt-10 inline-block">
              <a
                href={event.rsvpLinkOrContact}
                target="_blank"
                rel="noreferrer"
                className="inline-block rounded-full px-12 py-5 text-sm font-black uppercase tracking-[0.3em] transition-all"
                style={{ background: accent, color: "#0a0e27", boxShadow: `0 8px 0 ${accent}55, 0 12px 40px ${accent}66` }}
              >
                RSVP to the launch
              </a>
            </motion.div>
          )}
        </motion.div>
      </section>

      <footer className="relative border-t py-8 text-center text-xs opacity-70" style={{ borderColor: "#ffffff11" }}>
        <p>{event.eventTitle}{event.person1Name ? ` · ${event.person1Name}` : ""}</p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default OrbitTemplate;
