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
const IVORY = "#f8f0e2";
const DUSK = "#3e2440";
const INDIGO = "#2a2a5e";
const TERRACOTTA = "#b8683c";

const DUNES = [
  { fill: "#d9a95e", d: "M0 90 Q 260 30 560 78 T 1440 60 V 160 H 0 Z", opacity: 0.55 },
  { fill: "#c08a48", d: "M0 110 Q 340 60 720 104 T 1440 92 V 160 H 0 Z", opacity: 0.75 },
  { fill: "#9c6538", d: "M0 132 Q 420 86 880 124 T 1440 116 V 160 H 0 Z", opacity: 0.9 },
  { fill: "#6e4030", d: "M0 148 Q 500 116 980 144 T 1440 138 V 160 H 0 Z", opacity: 1 },
];

const STARS = Array.from({ length: 42 }, (_, i) => ({
  x: `${(i * 37 + 11) % 100}%`,
  y: `${(i * 53 + 7) % 90}%`,
  size: 1 + (i % 3),
  delay: (i % 7) * 0.4,
  dur: 2 + (i % 4) * 0.7,
}));

function KhatamStar({ size, reduce }: { size: number; reduce: boolean }) {
  return (
    <motion.svg
      aria-hidden
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      animate={reduce ? undefined : { rotate: 360 }}
      transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
    >
      <g fill="none" stroke="#d9a95e" strokeWidth="0.6" opacity="0.5">
        <rect x="18" y="18" width="64" height="64" />
        <rect x="18" y="18" width="64" height="64" transform="rotate(45 50 50)" />
        <circle cx="50" cy="50" r="20" opacity="0.6" />
      </g>
    </motion.svg>
  );
}

function Flame({ reduce }: { reduce: boolean }) {
  return (
    <motion.svg
      aria-hidden
      viewBox="0 0 24 24"
      className="h-5 w-5"
      animate={reduce ? undefined : { scaleY: [1, 1.15, 0.92, 1.08, 1], opacity: [0.85, 1, 0.8, 1, 0.85] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: "50% 100%" }}
    >
      <path d="M12 2c1 4-4 6-4 11a4 4 0 0 0 8 0c0-2-1-3-1.5-4.5C16 10 17 11.5 17 13a5 5 0 1 1-10 0C7 7.5 11 6 12 2Z" fill="#d9a95e" />
      <path d="M12 9c.5 2.2-2 3.2-2 5.4a2 2 0 0 0 4 0c0-2.2-2.5-3.2-2-5.4Z" fill={TERRACOTTA} />
    </motion.svg>
  );
}

function ArchCard({ item, i }: { item: SubEvent; i: number }) {
  const reduce = !!useReducedMotion();
  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
      className="relative border border-[#d9a95e]/25 bg-[#f8f0e2]/[0.04] px-6 pb-7 pt-10 text-center backdrop-blur-sm"
      style={{ borderRadius: "50% 50% 14px 14px / 32% 32% 14px 14px" }}
    >
      <div className="mb-3 flex justify-center"><Flame reduce={reduce} /></div>
      <p className="text-[10px] uppercase tracking-[0.35em] text-[#d9a95e]/80">
        {[item.date, item.startTime].filter(Boolean).join(" · ")}
      </p>
      <h3 className="font-display mt-2 text-2xl tracking-[0.08em]" style={{ color: IVORY }}>{item.name}</h3>
      {item.venueName && <p className="mt-2 text-sm opacity-65">{item.venueName}</p>}
      {item.description && <p className="mt-3 text-sm leading-relaxed opacity-60">{item.description}</p>}
      {item.dressCode && (
        <p className="mt-4 inline-block rounded-full border border-[#d9a95e]/30 px-4 py-1 text-[10px] uppercase tracking-[0.25em] text-[#d9a95e]">
          {item.dressCode}
        </p>
      )}
    </motion.article>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  const reduce = !!useReducedMotion();
  return (
    <motion.p
      initial={reduce ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="mb-3 text-center text-[10px] uppercase tracking-[0.55em] text-[#d9a95e]"
    >
      {children}
    </motion.p>
  );
}

export const MirageTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || "#d9a95e";
  const tagline = event.tagline?.trim() || "Where the dunes meet the moon";
  const invitationMessage = event.invitationMessage?.trim() || "Beneath golden sands and a rising desert moon, two souls become one caravan. Join us for an evening of fire, fragrance, and forever.";
  const aboutStory = event.aboutStory?.trim() || "Our story began like a mirage — a glimpse across a crowded room that turned out to be beautifully, impossibly real. Now we cross the desert together, toward a palace of our own making.";
  const hero = event.heroImageUrl || "https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1600&q=80";
  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroTextY = useTransform(heroP, [0, 0.6], [0, -60]);
  const heroOpacity = useTransform(heroP, [0, 0.55], [1, 0]);

  const showStory = !event.hideStory;
  const showEvents = !event.hideEvents && subEvents.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);
  const sorted = [...subEvents].sort((a, b) => a.order - b.order);

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-sans antialiased"
      style={{ "--accent": accent, color: IVORY, background: `linear-gradient(180deg, #8a5a34 0%, ${DUSK} 45%, ${INDIGO} 100%)` } as React.CSSProperties}
    >
      <ScrollProgress color={accent} />

      <section ref={heroRef} className="relative flex h-[100svh] min-h-[620px] items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <HeroMedia imageSrc={hero} videoSrc={event.heroVideoUrl || undefined} alt={event.eventTitle} className="opacity-35" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${DUSK}66 0%, transparent 40%, #d9a95e26 70%, ${DUSK}cc 100%)` }} />
        </div>
        {!reduce && (
          <motion.div
            aria-hidden
            className="absolute inset-x-0 top-1/3 h-40"
            style={{ background: "linear-gradient(180deg, transparent, #f8f0e214, transparent)" }}
            animate={{ skewX: [-1.5, 1.5, -1.5], y: [0, 12, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
        <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="relative h-[min(72vw,540px)] w-[min(72vw,540px)]">
            <KhatamStar size={540} reduce={reduce} />
          </div>
        </div>
        <motion.div style={reduce ? undefined : { y: heroTextY, opacity: heroOpacity }} className="relative z-10 px-5 text-center">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE }}
            className="mb-6 text-[11px] uppercase tracking-[0.7em] text-[#d9a95e]"
          >
            {tagline}
          </motion.p>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 24, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.2, delay: 0.2, ease: EASE }}
            className="font-display text-[clamp(2.8rem,9vw,6.5rem)] leading-[1.02] tracking-[0.06em]"
            style={{ textShadow: `0 2px 40px ${DUSK}` }}
          >
            {event.eventTitle}
          </motion.h1>
          {(event.person1Name || event.person2Name) && (
            <motion.p
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="font-display mt-5 text-xl tracking-[0.3em] text-[#d9a95e]"
            >
              {[event.person1Name, event.person2Name].filter(Boolean).join(" ✦ ")}
            </motion.p>
          )}
          {event.mainDate && (
            <motion.p
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="mt-7 text-xs uppercase tracking-[0.45em] opacity-80"
            >
              {new Date(event.mainDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              {event.city ? ` · ${event.city}` : ""}
            </motion.p>
          )}
        </motion.div>
        <svg aria-hidden viewBox="0 0 1440 160" preserveAspectRatio="none" className="absolute bottom-0 left-0 h-40 w-full">
          {DUNES.map((d, i) => (
            <path key={i} d={d.d} fill={d.fill} opacity={d.opacity} />
          ))}
        </svg>
      </section>

      {showStory && (
        <section className="relative mx-auto max-w-3xl px-6 py-24 text-center sm:py-32">
          <SectionLabel>The Invitation</SectionLabel>
          <motion.h2
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE }}
            className="font-display text-2xl leading-relaxed tracking-[0.04em] sm:text-3xl"
          >
            {invitationMessage}
          </motion.h2>
          <motion.div
            aria-hidden
            initial={reduce ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3, ease: EASE }}
            className="mx-auto my-10 h-px w-40"
            style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
          />
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-base leading-loose opacity-70 sm:text-lg"
          >
            {aboutStory}
          </motion.p>
        </section>
      )}

      {showEvents && (
        <section className="relative mx-auto max-w-5xl px-6 py-20 sm:py-28">
          <SectionLabel>The Celebrations</SectionLabel>
          <h2 className="font-display mb-14 text-center text-3xl tracking-[0.08em]">A Caravan of Evenings</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((s, i) => (
              <ArchCard key={s.order} item={s} i={i} />
            ))}
          </div>
        </section>
      )}

      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <SectionLabel>Moments</SectionLabel>
          <h2 className="font-display mb-12 text-center text-3xl tracking-[0.08em]">Mirages Made Real</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((m, i) => (
              <motion.figure
                key={`${m.fileName}-${i}`}
                initial={reduce ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                className="group relative overflow-hidden border border-[#d9a95e]/20"
                style={{ borderRadius: "45% 45% 12px 12px / 20% 20% 12px 12px" }}
              >
                <img
                  src={m.publicUrl}
                  alt={m.caption ?? ""}
                  className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2a2a5e]/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                {m.caption && (
                  <figcaption className="absolute bottom-3 left-0 right-0 px-4 text-center text-xs tracking-wide opacity-0 transition-opacity group-hover:opacity-90">
                    {m.caption}
                  </figcaption>
                )}
              </motion.figure>
            ))}
            {editing && galleryItems.length === 0 && (
              <div className="col-span-full flex h-48 items-center justify-center rounded-xl border border-dashed border-[#d9a95e]/40 text-sm opacity-60">
                + Add photos
              </div>
            )}
          </div>
        </section>
      )}

      {showVenue && (
        <section className="relative mx-auto max-w-5xl px-6 py-20 sm:py-28">
          <SectionLabel>The Palace</SectionLabel>
          <h2 className="font-display mb-10 text-center text-3xl tracking-[0.08em]">{event.venueName || "Find Your Way"}</h2>
          {event.venueAddress && <p className="mb-8 text-center text-sm tracking-wide opacity-70">{event.venueAddress}</p>}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="overflow-hidden rounded-2xl border border-[#d9a95e]/25 bg-[#f8f0e2]/[0.04] p-1"
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

      <section className="relative overflow-hidden px-6 py-28 text-center sm:py-40">
        <div aria-hidden className="absolute inset-0">
          {STARS.map((s, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full"
              style={{ left: s.x, top: s.y, width: s.size, height: s.size, background: IVORY, boxShadow: `0 0 6px ${IVORY}` }}
              animate={reduce ? undefined : { opacity: [0.1, 0.9, 0.1] }}
              transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE }}
          className="relative mx-auto max-w-2xl"
        >
          <div className="relative mx-auto mb-8 h-28 w-28">
            <KhatamStar size={112} reduce={reduce} />
          </div>
          <h2 className="font-display text-[clamp(2rem,6vw,3.5rem)] leading-tight tracking-[0.06em]">Under the Desert Moon</h2>
          <p className="mt-4 text-sm uppercase tracking-[0.4em] text-[#d9a95e]">We await your presence</p>
          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <motion.a
              whileHover={reduce ? undefined : { scale: 1.04, boxShadow: `0 0 40px ${accent}55` }}
              href={event.rsvpLinkOrContact}
              target="_blank"
              rel="noreferrer"
              className="mt-10 inline-block rounded-full px-12 py-4 text-sm uppercase tracking-[0.3em]"
              style={{ background: accent, color: DUSK }}
            >
              RSVP now
            </motion.a>
          )}
          {event.contactName && (
            <p className="mt-8 text-xs tracking-[0.2em] opacity-60">
              {event.contactName}
              {event.contactPhone ? ` · ${event.contactPhone}` : ""}
            </p>
          )}
        </motion.div>
      </section>

      <footer className="relative border-t border-[#d9a95e]/15 py-8 text-center text-xs opacity-50">
        <p>
          {event.eventTitle}
          {event.person1Name && event.person2Name ? ` · ${event.person1Name} & ${event.person2Name}` : ""}
        </p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default MirageTemplate;
