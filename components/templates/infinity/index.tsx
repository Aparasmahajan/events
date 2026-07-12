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

const CREAM = "#f7ede0";
const PLUM = "#3d1f2f";
const ROSE_GOLD = "#d4a574";
const WARM_ROSE = "#c89b8c";
const WARM_WHITE = "#faf5ec";

function ConvergingRings({ accent }: { accent: string }) {
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end start"],
  });

  const leftX = useTransform(scrollYProgress, [0, 0.8, 1], ["-24vw", "-2vw", "-2vw"]);
  const rightX = useTransform(scrollYProgress, [0, 0.8, 1], ["24vw", "2vw", "2vw"]);
  const mergeOpacity = useTransform(scrollYProgress, [0.7, 0.85, 1], [0, 0.9, 1]);
  const ringsOpacity = useTransform(scrollYProgress, [0.7, 0.9], [1, 0.35]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 12]);

  return (
    <div ref={wrapRef} aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <motion.div
        style={reduce ? undefined : { x: leftX, opacity: ringsOpacity, rotate }}
        className="absolute"
      >
        <svg width="46vmin" height="46vmin" viewBox="0 0 200 200" className="block">
          <defs>
            <radialGradient id="ring-left-glow" cx="50%" cy="50%" r="50%">
              <stop offset="60%" stopColor={ROSE_GOLD} stopOpacity="0" />
              <stop offset="90%" stopColor={ROSE_GOLD} stopOpacity="0.35" />
              <stop offset="100%" stopColor={ROSE_GOLD} stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="100" cy="100" r="80" fill="none" stroke={accent} strokeWidth="1.2" opacity="0.9" />
          <circle cx="100" cy="100" r="80" fill="none" stroke="url(#ring-left-glow)" strokeWidth="14" />
          <circle cx="100" cy="100" r="74" fill="none" stroke={accent} strokeWidth="0.4" opacity="0.5" />
        </svg>
      </motion.div>

      <motion.div
        style={reduce ? undefined : { x: rightX, opacity: ringsOpacity, rotate }}
        className="absolute"
      >
        <svg width="46vmin" height="46vmin" viewBox="0 0 200 200" className="block">
          <defs>
            <radialGradient id="ring-right-glow" cx="50%" cy="50%" r="50%">
              <stop offset="60%" stopColor={WARM_ROSE} stopOpacity="0" />
              <stop offset="90%" stopColor={WARM_ROSE} stopOpacity="0.35" />
              <stop offset="100%" stopColor={WARM_ROSE} stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="100" cy="100" r="80" fill="none" stroke={WARM_ROSE} strokeWidth="1.2" opacity="0.9" />
          <circle cx="100" cy="100" r="80" fill="none" stroke="url(#ring-right-glow)" strokeWidth="14" />
          <circle cx="100" cy="100" r="74" fill="none" stroke={WARM_ROSE} strokeWidth="0.4" opacity="0.5" />
        </svg>
      </motion.div>

      <motion.div
        style={reduce ? undefined : { opacity: mergeOpacity }}
        className="absolute"
      >
        <svg width="70vmin" height="34vmin" viewBox="0 0 400 200" className="block">
          <defs>
            <linearGradient id="infinity-stroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={accent} />
              <stop offset="50%" stopColor={WARM_ROSE} />
              <stop offset="100%" stopColor={accent} />
            </linearGradient>
          </defs>
          <path
            d="M 100 100 C 100 40, 180 40, 200 100 C 220 160, 300 160, 300 100 C 300 40, 220 40, 200 100 C 180 160, 100 160, 100 100 Z"
            fill="none"
            stroke="url(#infinity-stroke)"
            strokeWidth="1.6"
            opacity="0.95"
          />
        </svg>
      </motion.div>
    </div>
  );
}

function RibbonTimeline({ items, accent }: { items: SubEvent[]; accent: string }) {
  const reduce = useReducedMotion();
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <div className="relative mx-auto max-w-4xl px-6">
      <div
        aria-hidden
        className="absolute left-1/2 top-6 hidden h-[calc(100%-3rem)] w-px -translate-x-1/2 sm:block"
        style={{
          background: `linear-gradient(180deg, transparent, ${accent} 20%, ${WARM_ROSE} 80%, transparent)`,
          filter: "blur(0.4px)",
          opacity: 0.65,
        }}
      />
      <div className="grid gap-8 sm:gap-12">
        {sorted.map((s, i) => (
          <motion.article
            key={s.order}
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
            className={`relative sm:w-[46%] ${i % 2 === 0 ? "sm:ml-0" : "sm:ml-auto"}`}
          >
            <div
              className="rounded-2xl border p-6 backdrop-blur-sm"
              style={{
                background: WARM_WHITE,
                borderColor: `${ROSE_GOLD}55`,
                boxShadow: `0 12px 40px -20px ${accent}55`,
              }}
            >
              <div className="flex items-baseline justify-between gap-3">
                <span
                  className="font-display text-2xl italic"
                  style={{ color: accent }}
                >
                  {String(s.order).padStart(2, "0")}
                </span>
                <span className="text-[10px] uppercase tracking-[0.3em]" style={{ color: `${PLUM}99` }}>
                  {[s.date, s.startTime].filter(Boolean).join(" · ")}
                </span>
              </div>
              <h3 className="mt-2 font-display text-2xl leading-snug" style={{ color: PLUM }}>{s.name}</h3>
              {s.venueName && <p className="mt-1 text-sm italic" style={{ color: `${PLUM}aa` }}>at {s.venueName}</p>}
              {s.description && <p className="mt-3 text-sm leading-relaxed" style={{ color: `${PLUM}bb` }}>{s.description}</p>}
              {s.dressCode && (
                <p className="mt-4 inline-block rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.25em]" style={{ borderColor: `${ROSE_GOLD}88`, color: accent }}>
                  {s.dressCode}
                </p>
              )}
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

export const InfinityTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || ROSE_GOLD;
  const tagline = event.tagline?.trim() || "Two worlds, one horizon.";
  const invitationMessage =
    event.invitationMessage?.trim() ||
    "From different constellations, our orbits found each other. Please join us as we complete the circle.";
  const aboutStory =
    event.aboutStory?.trim() ||
    "Rings from separate universes drift toward the same centre. This is the story of that quiet, inevitable meeting.";
  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const hero =
    event.heroImageUrl ||
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800&q=80";

  const showStory = !event.hideStory;
  const showJourney = !event.hideEvents && subEvents.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  const couple = [event.person1Name, event.person2Name].filter(Boolean).join(" & ");

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-serif antialiased"
      style={{
        background: CREAM,
        color: PLUM,
        "--accent": accent,
        fontFamily: '"Cormorant Garamond", "Playfair Display", Georgia, serif',
      } as React.CSSProperties}
    >
      <ScrollProgress color={accent} />

      {/* Hero — converging rings */}
      <section className="relative h-[130svh] min-h-[860px]">
        <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <HeroMedia imageSrc={hero} videoSrc={event.heroVideoUrl || undefined} alt={event.eventTitle} />
            <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${CREAM}cc, ${CREAM}f5 60%, ${CREAM})` }} />
          </div>
          <ConvergingRings accent={accent} />
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: EASE }}
            className="relative z-10 px-6 text-center"
          >
            <p className="mb-6 text-[10px] uppercase tracking-[0.6em]" style={{ color: accent }}>
              {tagline}
            </p>
            <h1 className="font-display text-[clamp(2.6rem,9vw,6.5rem)] italic leading-[0.95] tracking-tight" style={{ color: PLUM }}>
              {couple || event.eventTitle}
            </h1>
            {event.mainDate && (
              <p className="mt-8 text-sm uppercase tracking-[0.5em]" style={{ color: `${PLUM}b0` }}>
                {new Date(event.mainDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            )}
            {event.city && (
              <p className="mt-2 text-xs uppercase tracking-[0.4em]" style={{ color: `${PLUM}80` }}>{event.city}</p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Invitation / story */}
      {showStory && (
        <section className="relative mx-auto max-w-3xl px-6 py-28 text-center sm:py-40">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="mb-6 text-[10px] uppercase tracking-[0.5em]"
            style={{ color: accent }}
          >
            The Invitation
          </motion.p>
          <motion.blockquote
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: EASE }}
            className="font-display text-2xl italic leading-relaxed sm:text-3xl"
            style={{ color: PLUM }}
          >
            &ldquo;{invitationMessage}&rdquo;
          </motion.blockquote>
          <motion.div
            aria-hidden
            initial={reduce ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: EASE }}
            className="mx-auto my-10 h-px w-40 origin-center"
            style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
          />
          <p className="mx-auto max-w-2xl text-base leading-relaxed sm:text-lg" style={{ color: `${PLUM}c0` }}>
            {aboutStory}
          </p>
        </section>
      )}

      {/* Sub-events */}
      {showJourney && (
        <section className="relative py-24 sm:py-32">
          <div className="mb-14 text-center">
            <p className="text-[10px] uppercase tracking-[0.5em]" style={{ color: accent }}>The Sequence</p>
            <h2 className="mt-3 font-display text-3xl italic sm:text-4xl" style={{ color: PLUM }}>Moments in orbit</h2>
          </div>
          <RibbonTimeline items={subEvents} accent={accent} />
        </section>
      )}

      {/* Gallery — circular frames */}
      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <div className="mb-14 text-center">
            <p className="text-[10px] uppercase tracking-[0.5em]" style={{ color: accent }}>Together</p>
            <h2 className="mt-3 font-display text-3xl italic sm:text-4xl" style={{ color: PLUM }}>A gallery of orbits</h2>
          </div>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 sm:gap-10 lg:grid-cols-4">
            {galleryItems.map((m, i) => (
              <motion.div
                key={`${m.fileName}-${i}`}
                initial={reduce ? false : { opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-8% 0px" }}
                transition={{ duration: 0.6, delay: (i % 8) * 0.05, ease: EASE }}
                className="group relative mx-auto aspect-square w-full overflow-hidden rounded-full"
                style={{
                  boxShadow: `0 0 0 1px ${ROSE_GOLD}66, 0 20px 40px -22px ${accent}77`,
                }}
              >
                <img
                  src={m.publicUrl}
                  alt={m.caption ?? ""}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-full"
                  style={{ boxShadow: `inset 0 0 0 1px ${WARM_WHITE}88` }}
                />
              </motion.div>
            ))}
            {editing && galleryItems.length === 0 && (
              <div
                className="col-span-full mx-auto flex aspect-square w-full max-w-xs items-center justify-center rounded-full border border-dashed text-sm"
                style={{ borderColor: `${ROSE_GOLD}aa`, color: `${PLUM}99` }}
              >
                + Add photos
              </div>
            )}
          </div>
        </section>
      )}

      {/* Venue */}
      {showVenue && (
        <section className="relative mx-auto max-w-5xl px-6 py-24 sm:py-32">
          <div className="mb-8 text-center">
            <p className="text-[10px] uppercase tracking-[0.5em]" style={{ color: accent }}>Where</p>
            <h2 className="mt-3 font-display text-3xl italic sm:text-4xl" style={{ color: PLUM }}>{event.venueName || "The meeting point"}</h2>
            {event.venueAddress && (
              <p className="mt-3 text-sm italic" style={{ color: `${PLUM}aa` }}>{event.venueAddress}</p>
            )}
          </div>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE }}
            className="overflow-hidden rounded-3xl border p-1"
            style={{ borderColor: `${ROSE_GOLD}66`, background: WARM_WHITE }}
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

      {/* Final CTA — one glowing ring */}
      <section className="relative px-6 py-32 text-center sm:py-44">
        <div className="relative mx-auto max-w-3xl">
          <motion.div
            aria-hidden
            animate={reduce ? undefined : { scale: [1, 1.05, 1], opacity: [0.75, 1, 0.75] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
            className="mx-auto mb-12"
          >
            <svg width="220" height="220" viewBox="0 0 200 200" className="mx-auto">
              <defs>
                <radialGradient id="final-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="55%" stopColor={accent} stopOpacity="0" />
                  <stop offset="85%" stopColor={accent} stopOpacity="0.55" />
                  <stop offset="100%" stopColor={accent} stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="100" cy="100" r="82" fill="none" stroke="url(#final-glow)" strokeWidth="18" />
              <circle cx="100" cy="100" r="82" fill="none" stroke={accent} strokeWidth="1.2" />
              <circle cx="100" cy="100" r="76" fill="none" stroke={WARM_ROSE} strokeWidth="0.4" opacity="0.7" />
            </svg>
          </motion.div>
          <h2 className="font-display text-[clamp(2.4rem,7vw,5rem)] italic leading-[0.95]" style={{ color: PLUM }}>
            {couple || event.eventTitle}
          </h2>
          {event.mainDate && (
            <p className="mt-5 text-xs uppercase tracking-[0.5em]" style={{ color: `${PLUM}a0` }}>
              {new Date(event.mainDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
          )}
          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <motion.a
              href={event.rsvpLinkOrContact}
              target="_blank"
              rel="noreferrer"
              whileHover={reduce ? undefined : { scale: 1.03 }}
              className="mt-12 inline-block rounded-full px-12 py-4 text-xs uppercase tracking-[0.4em]"
              style={{
                background: accent,
                color: WARM_WHITE,
                boxShadow: `0 10px 30px -12px ${accent}`,
              }}
            >
              Complete the circle
            </motion.a>
          )}
        </div>
      </section>

      <footer
        className="border-t py-8 text-center text-xs"
        style={{ borderColor: `${ROSE_GOLD}44`, color: `${PLUM}80` }}
      >
        <p>
          {event.eventTitle}
          {couple ? ` · ${couple}` : ""}
        </p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default InfinityTemplate;
