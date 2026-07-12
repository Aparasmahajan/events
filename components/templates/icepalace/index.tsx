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
const FJORD = "#1e3844";
const GLACIAL = "#eef4f8";
const ICE = "#b8d8e8";
const AURORA_GREEN = "#7fe8c0";
const AURORA_VIOLET = "#b8a0e8";

const CHAMFER =
  "polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px)";

const SNOW = Array.from({ length: 26 }, (_, i) => ({
  x: `${(i * 37 + 11) % 100}%`,
  size: 2 + (i % 3),
  dur: 9 + (i % 5) * 2.2,
  delay: (i % 8) * 1.1,
  drift: (i % 2 === 0 ? 1 : -1) * (14 + (i % 4) * 8),
}));

function SnowField({ reduce }: { reduce: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" style={{ background: `linear-gradient(180deg, ${GLACIAL}, #e2edf4 55%, ${GLACIAL})` }}>
      <div className="absolute inset-0 opacity-40" style={{ background: `radial-gradient(60% 40% at 50% 108%, ${ICE}, transparent 70%)` }} />
      {!reduce &&
        SNOW.map((s, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{ left: s.x, top: "-2%", width: s.size, height: s.size, background: "#ffffff", boxShadow: `0 0 6px ${ICE}` }}
            animate={{ y: ["0vh", "104vh"], x: [0, s.drift], opacity: [0, 0.9, 0.9, 0] }}
            transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: "linear" }}
          />
        ))}
    </div>
  );
}

function IceBlock({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 26, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      className={`relative p-6 backdrop-blur-xl ${className ?? ""}`}
      style={{ clipPath: CHAMFER, background: "rgba(255,255,255,0.55)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.95), 0 12px 30px rgba(30,56,68,0.08)" }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-white/80 to-transparent" />
      <div className="relative">{children}</div>
    </motion.div>
  );
}

function Kicker({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.p
      initial={reduce ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="mb-10 text-center text-[10px] uppercase tracking-[0.5em]"
      style={{ color: "var(--accent)" }}
    >
      {children}
    </motion.p>
  );
}

function FrozenTimeline({ items }: { items: SubEvent[] }) {
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <div className="mx-auto max-w-4xl px-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {sorted.map((s, i) => (
          <article key={s.order} className={i === sorted.length - 1 && sorted.length % 2 === 1 ? "sm:col-span-2 sm:mx-auto sm:w-full sm:max-w-md" : ""}>
            <IceBlock delay={i * 0.06}>
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center text-[10px] font-semibold text-white" style={{ background: FJORD, clipPath: CHAMFER }}>
                  {String(s.order).padStart(2, "0")}
                </span>
                <span className="text-[10px] uppercase tracking-[0.25em] opacity-60">
                  {[s.date, s.startTime].filter(Boolean).join(" · ")}
                </span>
              </div>
              <h3 className="font-display text-xl tracking-wide">{s.name}</h3>
              {s.venueName && <p className="mt-1 text-sm opacity-65">{s.venueName}</p>}
              {s.description && <p className="mt-2 text-sm leading-relaxed opacity-65">{s.description}</p>}
              {s.dressCode && (
                <p className="mt-3 inline-block px-3 py-1 text-[10px] uppercase tracking-[0.2em] opacity-70" style={{ border: `1px solid ${ICE}`, clipPath: CHAMFER }}>
                  {s.dressCode}
                </p>
              )}
            </IceBlock>
          </article>
        ))}
      </div>
    </div>
  );
}

export const IcepalaceTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || "#4a8ab0";
  const tagline = event.tagline?.trim() || "Carved in ice, warmed by love";
  const invitationMessage = event.invitationMessage?.trim() || "Under the northern lights, in a palace of glass and snow, we begin our forever. Come stand with us where the winter glows.";
  const aboutStory = event.aboutStory?.trim() || "Two winters ago we walked out onto a frozen lake and knew we would never let go of each other's hands. Now the ice holds our promise — clear, bright, and made to last.";
  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const [frame1, frame2, frame3] = event.showHeroFrames ? galleryItems : [];
  const hero = event.heroImageUrl || "https://images.unsplash.com/photo-1483664852095-d6cc6870702d?auto=format&fit=crop&w=1600&q=80";

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroP, [0, 1], [0, 90]);
  const heroOpacity = useTransform(heroP, [0, 0.55], [1, 0]);

  const showStory = !event.hideStory;
  const showJourney = !event.hideEvents && subEvents.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-sans antialiased"
      style={{ "--accent": accent, color: FJORD, background: GLACIAL } as React.CSSProperties}
    >
      <SnowField reduce={reduce} />
      <ScrollProgress color={accent} />

      <section ref={heroRef} className="relative flex min-h-[100svh] items-center justify-center overflow-hidden pb-24 sm:pb-28">
        <div className="absolute inset-0">
          <HeroMedia imageSrc={hero} videoSrc={event.heroVideoUrl || undefined} alt={event.eventTitle} className="opacity-70" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${GLACIAL}66 0%, transparent 40%, ${GLACIAL} 96%)` }} />
        </div>

        {/* Ceremony frames — ice-block, crystal-shard, frozen-lake mirror */}
        {frame1 && (
          <motion.figure
            initial={reduce ? false : { opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.4, ease: EASE }}
            className="hidden md:block absolute left-[6%] top-[16%] w-40 h-52 lg:w-52 lg:h-64 z-20 overflow-hidden shadow-2xl"
            style={{
              clipPath: "polygon(6% 0, 94% 0, 100% 6%, 100% 94%, 94% 100%, 6% 100%, 0 94%, 0 6%)",
              border: `1px solid ${ICE}`,
              boxShadow: `0 0 0 1px ${accent}44 inset, 0 20px 40px -12px rgba(30,56,68,0.5), 0 0 60px -20px ${AURORA_GREEN}`,
            }}
          >
            <motion.img
              src={frame1.publicUrl}
              alt={frame1.caption ?? ""}
              loading="lazy"
              className="w-full h-full object-cover"
              animate={reduce ? undefined : { y: [0, -6, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="absolute inset-x-0 top-0 h-8" style={{ background: `linear-gradient(180deg, rgba(255,255,255,0.35), transparent)` }} />
          </motion.figure>
        )}

        {frame2 && (
          <motion.figure
            initial={reduce ? false : { opacity: 0, rotate: -8 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ duration: 1.1, delay: 0.6, ease: EASE }}
            className="hidden md:block absolute right-[6%] top-[20%] w-40 h-48 lg:w-48 lg:h-56 z-20 overflow-hidden shadow-2xl"
            style={{
              clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
              boxShadow: `0 0 40px -8px ${AURORA_VIOLET}, 0 0 0 1px ${accent}44 inset`,
            }}
          >
            <motion.img
              src={frame2.publicUrl}
              alt={frame2.caption ?? ""}
              loading="lazy"
              className="w-full h-full object-cover"
              animate={reduce ? undefined : { rotate: [0, 2, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.figure>
        )}

        {frame3 && (
          <motion.figure
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.85, ease: EASE }}
            className="hidden lg:block absolute left-[8%] bottom-[26%] w-52 z-20"
          >
            <div
              className="w-full h-32 overflow-hidden"
              style={{
                border: `1px solid ${ICE}`,
                boxShadow: `0 0 0 1px ${accent}33 inset, 0 8px 20px -8px rgba(30,56,68,0.6)`,
                clipPath: "polygon(4% 0, 96% 0, 100% 8%, 100% 92%, 96% 100%, 4% 100%, 0 92%, 0 8%)",
              }}
            >
              <img src={frame3.publicUrl} alt={frame3.caption ?? ""} loading="lazy" className="w-full h-full object-cover" />
            </div>
            <div
              aria-hidden
              className="w-full h-16"
              style={{
                transform: "scaleY(-1)",
                opacity: 0.35,
                maskImage: "linear-gradient(to bottom, black, transparent)",
                WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
                clipPath: "polygon(4% 0, 96% 0, 100% 8%, 100% 100%, 0 100%, 0 8%)",
                overflow: "hidden",
              }}
            >
              <img src={frame3.publicUrl} alt="" loading="lazy" className="w-full h-32 object-cover" style={{ filter: "blur(2px)" }} />
            </div>
          </motion.figure>
        )}
        <motion.div
          aria-hidden
          className="absolute inset-x-[-20%] top-[-6%] h-[34vh]"
          style={{
            background: `linear-gradient(100deg, transparent 5%, ${AURORA_GREEN} 30%, ${AURORA_VIOLET} 55%, ${ICE} 78%, transparent 95%)`,
            backgroundSize: "200% 100%",
            filter: "blur(46px)",
            opacity: 0.55,
          }}
          animate={reduce ? undefined : { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"], skewY: [-2, 2, -2] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div style={reduce ? undefined : { y: heroY, opacity: heroOpacity }} className="relative z-10 px-5 text-center">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="mb-6 text-[10px] uppercase tracking-[0.6em]"
            style={{ color: accent }}
          >
            {tagline}
          </motion.p>
          <motion.h1
            initial={reduce ? false : { opacity: 0, letterSpacing: "0.01em", filter: "blur(8px)" }}
            animate={{ opacity: 1, letterSpacing: "0.09em", filter: "blur(0px)" }}
            transition={{ duration: 1.6, delay: 0.2, ease: EASE }}
            className="font-display text-[clamp(2.6rem,9vw,6.5rem)] font-light uppercase leading-[1.02] text-white"
            style={{ textShadow: `0 2px 24px ${ICE}, 0 0 60px rgba(184,216,232,0.7), 0 1px 2px ${FJORD}55` }}
          >
            {event.eventTitle}
          </motion.h1>
          {(event.person1Name || event.person2Name) && (
            <motion.p
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 1 }}
              className="mt-5 text-sm uppercase tracking-[0.4em] text-white/90"
              style={{ textShadow: `0 1px 12px ${FJORD}88` }}
            >
              {[event.person1Name, event.person2Name].filter(Boolean).join(" · ")}
            </motion.p>
          )}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="mx-auto mt-9 inline-flex flex-wrap items-center justify-center gap-4 px-6 py-3 text-xs uppercase tracking-[0.35em] backdrop-blur-md"
            style={{ clipPath: CHAMFER, background: "rgba(255,255,255,0.45)", color: FJORD }}
          >
            {event.mainDate && (
              <span>{new Date(event.mainDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</span>
            )}
            {event.mainStartTime && <span className="opacity-50">/</span>}
            {event.mainStartTime && <span>{event.mainStartTime}</span>}
            {event.city && <><span className="opacity-50">/</span><span>{event.city}</span></>}
          </motion.div>
        </motion.div>
      </section>

      {showStory && (
        <section className="relative mx-auto max-w-4xl px-6 py-24 sm:py-32">
          <Kicker>Our Story</Kicker>
          <IceBlock className="p-8 sm:p-12">
            <p className="text-center font-display text-2xl leading-snug sm:text-3xl">{invitationMessage}</p>
            <div className="mx-auto my-8 h-px w-24" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
            <p className="mx-auto max-w-2xl text-center text-base leading-relaxed opacity-70">{aboutStory}</p>
          </IceBlock>
        </section>
      )}

      {showJourney && (
        <section className="relative py-20 sm:py-28">
          <Kicker>The Celebrations</Kicker>
          <FrozenTimeline items={subEvents} />
        </section>
      )}

      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <Kicker>Frozen Moments</Kicker>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {galleryItems.map((m, i) => (
              <motion.div
                key={`${m.fileName}-${i}`}
                initial={reduce ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05, ease: EASE }}
                className="group relative overflow-hidden"
                style={{ clipPath: CHAMFER }}
              >
                <img
                  src={m.publicUrl}
                  alt={m.caption ?? ""}
                  className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-white/50 to-transparent" />
              </motion.div>
            ))}
            {editing && galleryItems.length === 0 && (
              <div className="col-span-full flex h-48 items-center justify-center text-sm opacity-60" style={{ border: `1px dashed ${accent}`, clipPath: CHAMFER }}>
                + Add photos
              </div>
            )}
          </div>
        </section>
      )}

      {showVenue && (
        <section className="relative mx-auto max-w-5xl px-6 py-20 sm:py-28">
          <Kicker>Find the Palace</Kicker>
          <IceBlock className="p-2">
            <MapEmbed
              latitude={event.latitude}
              longitude={event.longitude}
              venueName={event.venueName}
              venueAddress={event.venueAddress}
              mapLink={event.mapLink}
            />
          </IceBlock>
        </section>
      )}

      <section className="relative px-6 py-28 text-center sm:py-40">
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: EASE }}
          className="mx-auto max-w-3xl"
        >
          <div aria-hidden className="mx-auto mb-10 h-20 w-64 opacity-50" style={{ background: `linear-gradient(90deg, ${AURORA_GREEN}, ${AURORA_VIOLET}, ${ICE})`, filter: "blur(34px)" }} />
          <h2 className="font-display text-[clamp(2rem,6vw,4rem)] font-light uppercase tracking-[0.12em]">{event.eventTitle}</h2>
          {event.mainDate && (
            <p className="mt-4 text-xs uppercase tracking-[0.4em] opacity-60">
              {new Date(event.mainDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
          )}
          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <motion.a
              whileHover={reduce ? undefined : { scale: 1.03, y: -2 }}
              href={event.rsvpLinkOrContact}
              target="_blank"
              rel="noreferrer"
              className="mt-10 inline-block px-12 py-4 text-sm uppercase tracking-[0.3em] text-white"
              style={{ background: FJORD, clipPath: CHAMFER, boxShadow: `0 10px 30px ${ICE}` }}
            >
              Join us in the snow
            </motion.a>
          )}
        </motion.div>
      </section>

      <footer className="py-8 text-center text-xs opacity-50" style={{ borderTop: `1px solid ${ICE}` }}>
        <p>{event.eventTitle}{event.person1Name ? ` · ${event.person1Name}` : ""}{event.person2Name ? ` & ${event.person2Name}` : ""}</p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default IcepalaceTemplate;
