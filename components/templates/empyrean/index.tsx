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

const CLOUDS = [
  { top: "8%", left: "-10%", size: 520, delay: 0, dur: 60, opacity: 0.55 },
  { top: "22%", left: "60%", size: 640, delay: 6, dur: 82, opacity: 0.4 },
  { top: "52%", left: "-20%", size: 720, delay: 3, dur: 96, opacity: 0.35 },
  { top: "68%", left: "55%", size: 560, delay: 9, dur: 74, opacity: 0.5 },
  { top: "85%", left: "10%", size: 480, delay: 2, dur: 68, opacity: 0.45 },
];

function CloudField({ reduce }: { reduce: boolean }) {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden bg-[#f6f4ee]">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 0%, #fdfcf9 0%, #f6f4ee 45%, #ece7db 100%)",
        }}
      />
      <svg className="absolute inset-0 h-full w-full opacity-[0.35]" xmlns="http://www.w3.org/2000/svg">
        <filter id="empyrean-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" />
          <feColorMatrix values="0 0 0 0 0.24  0 0 0 0 0.23  0 0 0 0 0.21  0 0 0 0.08 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#empyrean-grain)" />
      </svg>
      {CLOUDS.map((c, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            top: c.top,
            left: c.left,
            width: c.size,
            height: c.size * 0.55,
            background:
              "radial-gradient(ellipse at center, rgba(253,252,249,0.95) 0%, rgba(253,252,249,0.6) 40%, rgba(253,252,249,0) 70%)",
            filter: "blur(40px)",
            opacity: c.opacity,
          }}
          animate={reduce ? undefined : { x: [0, 80, 0], y: [0, -20, 0] }}
          transition={{ duration: c.dur, delay: c.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-40"
        style={{ background: "linear-gradient(180deg, rgba(168,200,219,0.35), transparent)" }}
      />
    </div>
  );
}

function GoldRule({ delay = 0, accent }: { delay?: number; accent: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      aria-hidden
      initial={reduce ? false : { scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.4, delay, ease: EASE }}
      className="mx-auto h-px w-40 origin-center"
      style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
    />
  );
}

function SectionLabel({ children, accent }: { children: React.ReactNode; accent: string }) {
  return (
    <div className="mb-6 flex flex-col items-center gap-4">
      <GoldRule accent={accent} />
      <p className="text-[10px] uppercase tracking-[0.7em]" style={{ color: accent }}>
        {children}
      </p>
      <GoldRule accent={accent} delay={0.15} />
    </div>
  );
}

function StairCards({ items, accent }: { items: SubEvent[]; accent: string }) {
  const reduce = useReducedMotion();
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <ol className="mx-auto max-w-3xl px-6">
      {sorted.map((s, i) => (
        <motion.li
          key={s.order}
          initial={reduce ? false : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.9, delay: i * 0.12, ease: EASE }}
          style={{ marginLeft: `${Math.min(i, 5) * 22}px` }}
          className="relative mb-6 rounded-sm border border-[#e6dfcc] bg-[#fdfcf9]/80 p-7 shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_18px_40px_-30px_rgba(61,58,53,0.35)] backdrop-blur-sm"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-3 left-0 w-px"
            style={{ background: `linear-gradient(180deg, transparent, ${accent}, transparent)` }}
          />
          <div className="flex items-baseline gap-4">
            <span
              className="font-display text-3xl italic"
              style={{ color: accent }}
            >
              {String(s.order).padStart(2, "0")}
            </span>
            <div className="flex-1">
              <h3 className="font-display text-2xl tracking-wide text-[#3d3a35]">{s.name}</h3>
              <p className="mt-1 text-[11px] uppercase tracking-[0.35em] opacity-60">
                {[s.date, s.startTime].filter(Boolean).join(" · ")}
              </p>
            </div>
          </div>
          {s.venueName && <p className="mt-4 text-sm italic opacity-70">at {s.venueName}</p>}
          {s.description && <p className="mt-3 text-sm leading-relaxed opacity-70">{s.description}</p>}
          {s.dressCode && (
            <p className="mt-4 inline-block border-t border-b px-3 py-1 text-[10px] uppercase tracking-[0.35em] opacity-70" style={{ borderColor: accent, color: accent }}>
              {s.dressCode}
            </p>
          )}
        </motion.li>
      ))}
    </ol>
  );
}

export const EmpyreanTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || "#c8a460";
  const tagline = event.tagline?.trim() || "Two souls, ascending.";
  const invitationMessage =
    event.invitationMessage?.trim() ||
    "With grace, gratitude, and the quiet blessing of the heavens, we invite you to the joining of our lives.";
  const aboutStory = event.aboutStory?.trim() || "";
  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const hero =
    event.heroImageUrl ||
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800&q=80";

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(heroP, [0, 1], [1, 1.06]);
  const heroTextY = useTransform(heroP, [0, 0.6], [0, -30]);
  const heroOpacity = useTransform(heroP, [0, 0.6], [1, 0]);

  const showStory = !event.hideStory;
  const showJourney = !event.hideEvents && subEvents.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  return (
    <div
      className="relative min-h-screen overflow-x-clip bg-[#f6f4ee] font-sans text-[#3d3a35] antialiased"
      style={{ "--accent": accent } as React.CSSProperties}
    >
      <CloudField reduce={reduce} />
      <ScrollProgress color={accent} />

      <section ref={heroRef} className="relative flex h-[100svh] min-h-[640px] items-center justify-center overflow-hidden">
        <motion.div style={reduce ? undefined : { scale: heroScale }} className="absolute inset-0">
          <HeroMedia imageSrc={hero} videoSrc={event.heroVideoUrl || undefined} alt={event.eventTitle} className="opacity-70" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(246,244,238,0.35) 0%, rgba(246,244,238,0.15) 40%, rgba(246,244,238,0.9) 100%)" }} />
        </motion.div>

        <motion.div style={reduce ? undefined : { y: heroTextY, opacity: heroOpacity }} className="relative z-10 px-6 text-center">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: EASE }}
            className="mb-8 text-[10px] uppercase tracking-[0.8em]"
            style={{ color: accent }}
          >
            {tagline}
          </motion.p>
          <h1 className="relative font-display text-[clamp(3rem,11vw,8.5rem)] font-light leading-[0.95] tracking-[0.02em] text-[#3d3a35]">
            {!reduce && (
              <motion.span
                aria-hidden
                initial={{ x: "-120%" }}
                animate={{ x: "120%" }}
                transition={{ duration: 3.4, delay: 1.2, ease: "easeInOut", repeat: Infinity, repeatDelay: 5 }}
                className="pointer-events-none absolute inset-0 -z-0"
                style={{
                  background: `linear-gradient(105deg, transparent 40%, ${accent}55 50%, transparent 60%)`,
                  mixBlendMode: "screen",
                }}
              />
            )}
            {event.eventTitle.split(" ").map((w, i, arr) => (
              <span key={i} className="relative block italic">
                {w}
                {i < arr.length - 1 && arr.length > 1 && (
                  <span aria-hidden className="mx-4 text-2xl" style={{ color: accent }}>&</span>
                )}
              </span>
            ))}
          </h1>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1.2 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4 text-[11px] uppercase tracking-[0.5em] opacity-70"
          >
            {event.mainDate && (
              <span>{new Date(event.mainDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</span>
            )}
            {event.city && <span aria-hidden style={{ color: accent }}>✦</span>}
            {event.city && <span>{event.city}</span>}
          </motion.div>
        </motion.div>
      </section>

      {showStory && (
        <section className="relative mx-auto max-w-3xl px-6 py-28 text-center sm:py-40">
          <SectionLabel accent={accent}>Invitation</SectionLabel>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: EASE }}
            className="font-display text-2xl italic leading-[1.5] tracking-wide sm:text-3xl"
          >
            {invitationMessage}
          </motion.p>
          {aboutStory && (
            <motion.p
              initial={reduce ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.3, ease: EASE }}
              className="mx-auto mt-10 max-w-xl text-base leading-relaxed opacity-70"
            >
              {aboutStory}
            </motion.p>
          )}
          <div className="mt-12">
            <GoldRule accent={accent} delay={0.4} />
          </div>
        </section>
      )}

      {showJourney && (
        <section className="relative py-24 sm:py-32">
          <div className="mb-14 text-center">
            <SectionLabel accent={accent}>The Ascent</SectionLabel>
          </div>
          <StairCards items={subEvents} accent={accent} />
        </section>
      )}

      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <div className="mb-12 text-center">
            <SectionLabel accent={accent}>Moments</SectionLabel>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((m, i) => (
              <motion.figure
                key={`${m.fileName}-${i}`}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.06, ease: EASE }}
                className="group relative overflow-hidden rounded-sm border border-[#e6dfcc] bg-[#fdfcf9] p-2 shadow-[0_18px_40px_-30px_rgba(61,58,53,0.4)]"
              >
                <img
                  src={m.publicUrl}
                  alt={m.caption ?? ""}
                  className="aspect-[4/5] w-full object-cover transition-transform duration-[1400ms] group-hover:scale-[1.03]"
                  loading="lazy"
                />
                {m.caption && (
                  <figcaption className="mt-2 text-center text-[10px] uppercase tracking-[0.35em] opacity-60">
                    {m.caption}
                  </figcaption>
                )}
              </motion.figure>
            ))}
            {editing && galleryItems.length === 0 && (
              <div className="col-span-full flex h-48 items-center justify-center rounded-sm border border-dashed border-[#c8a46080] text-sm opacity-60">
                + Add photos
              </div>
            )}
          </div>
        </section>
      )}

      {showVenue && (
        <section className="relative mx-auto max-w-5xl px-6 py-24 sm:py-32">
          <div className="mb-10 text-center">
            <SectionLabel accent={accent}>The Chapel</SectionLabel>
            {event.venueName && (
              <h3 className="mt-4 font-display text-3xl italic">{event.venueName}</h3>
            )}
            {event.venueAddress && (
              <p className="mt-2 text-sm opacity-70">{event.venueAddress}</p>
            )}
          </div>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE }}
            className="overflow-hidden rounded-sm border border-[#e6dfcc] bg-[#fdfcf9] p-2 shadow-[0_18px_40px_-30px_rgba(61,58,53,0.4)]"
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

      <section className="relative px-6 py-32 text-center sm:py-44">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: EASE }}
          className="mx-auto max-w-2xl"
        >
          <div
            aria-hidden
            className="mx-auto mb-10 h-24 w-24 rounded-full"
            style={{
              background: `radial-gradient(circle, ${accent}66 0%, transparent 65%)`,
              filter: "blur(4px)",
            }}
          />
          <SectionLabel accent={accent}>With Grace</SectionLabel>
          <h2 className="font-display text-[clamp(2.2rem,6vw,4.5rem)] font-light italic leading-[1.05]">
            {event.person1Name}
            {event.person2Name && (
              <>
                <span aria-hidden className="mx-3" style={{ color: accent }}>&</span>
                {event.person2Name}
              </>
            )}
          </h2>
          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <motion.a
              whileHover={reduce ? undefined : { y: -2 }}
              href={event.rsvpLinkOrContact}
              target="_blank"
              rel="noreferrer"
              className="mt-12 inline-block border px-14 py-4 text-[11px] uppercase tracking-[0.5em] transition-colors"
              style={{ borderColor: accent, color: accent }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = accent;
                e.currentTarget.style.color = "#fdfcf9";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = accent;
              }}
            >
              Kindly reply
            </motion.a>
          )}
        </motion.div>
      </section>

      <footer className="relative border-t border-[#e6dfcc] py-10 text-center text-xs tracking-[0.3em] opacity-60">
        <p className="uppercase">
          {event.eventTitle}
          {event.person1Name ? ` · ${event.person1Name}` : ""}
        </p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default EmpyreanTemplate;
