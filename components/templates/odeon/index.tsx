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
const GOLD = "#d4af37";
const IVORY = "#f5f0e1";
const BURGUNDY = "#3d0a12";
const BURGUNDY_DEEP = "#500914";
const NIGHT = "#0a0507";

function VelvetField({ reduce }: { reduce: boolean }) {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden" style={{ background: BURGUNDY }}>
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(120% 80% at 50% 0%, ${BURGUNDY_DEEP} 0%, ${BURGUNDY} 45%, ${NIGHT} 100%)`,
        }}
      />
      <svg className="absolute inset-0 h-full w-full opacity-[0.08]" xmlns="http://www.w3.org/2000/svg">
        <filter id="odeon-velvet">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" />
          <feColorMatrix values="0 0 0 0 0.3  0 0 0 0 0.05  0 0 0 0 0.07  0 0 0 0.6 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#odeon-velvet)" />
      </svg>
      {!reduce && (
        <div className="absolute inset-0 opacity-40 mix-blend-screen">
          <motion.div
            className="absolute -top-[30%] left-[10%] h-[160%] w-[40%] origin-top"
            style={{
              background: `conic-gradient(from 180deg at 50% 0%, transparent 0deg, ${GOLD}22 8deg, transparent 16deg)`,
              filter: "blur(2px)",
            }}
            animate={{ rotate: [-8, 8, -8] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -top-[30%] right-[10%] h-[160%] w-[40%] origin-top"
            style={{
              background: `conic-gradient(from 180deg at 50% 0%, transparent 0deg, ${IVORY}18 8deg, transparent 16deg)`,
              filter: "blur(2px)",
            }}
            animate={{ rotate: [8, -8, 8] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      )}
    </div>
  );
}

function GoldShimmer({ children, className }: { children: React.ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <span
      className={`relative inline-block bg-clip-text text-transparent ${className ?? ""}`}
      style={{
        backgroundImage: `linear-gradient(100deg, ${GOLD} 0%, #fff3c4 25%, ${GOLD} 45%, #8a6a1a 65%, ${GOLD} 100%)`,
        backgroundSize: "300% 100%",
      }}
    >
      <motion.span
        aria-hidden
        className="absolute inset-0 bg-clip-text text-transparent"
        style={{
          backgroundImage: `linear-gradient(100deg, transparent 20%, ${IVORY} 50%, transparent 80%)`,
          backgroundSize: "300% 100%",
          WebkitBackgroundClip: "text",
        }}
        animate={reduce ? undefined : { backgroundPosition: ["200% 0%", "-100% 0%"] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      >
        {children}
      </motion.span>
      {children}
    </span>
  );
}

function RedCarpet({ reduce }: { reduce: boolean }) {
  return (
    <div className="mx-auto flex max-w-5xl items-center gap-4 px-6">
      <span className="h-px flex-1" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}66)` }} />
      <motion.div
        initial={reduce ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-15% 0px" }}
        transition={{ duration: 1.4, ease: EASE }}
        className="relative h-3 flex-[2] origin-left overflow-hidden rounded-sm"
        style={{
          background: `linear-gradient(180deg, #7a0d1c 0%, #a11423 50%, #7a0d1c 100%)`,
          boxShadow: `0 0 24px ${GOLD}55, inset 0 0 12px ${NIGHT}`,
        }}
      >
        <div
          className="absolute inset-y-0 left-0 w-px"
          style={{ background: GOLD, boxShadow: `0 0 8px ${GOLD}` }}
        />
        <div
          className="absolute inset-y-0 right-0 w-px"
          style={{ background: GOLD, boxShadow: `0 0 8px ${GOLD}` }}
        />
      </motion.div>
      <span className="h-px flex-1" style={{ background: `linear-gradient(-90deg, transparent, ${GOLD}66)` }} />
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="mb-6 text-center text-[10px] uppercase tracking-[0.6em]"
      style={{ color: GOLD, fontVariantCaps: "all-small-caps" }}
    >
      {children}
    </p>
  );
}

function RunOfShow({ items, accent }: { items: SubEvent[]; accent: string }) {
  const reduce = useReducedMotion();
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <ol className="mx-auto max-w-3xl px-6">
      {sorted.map((s, i) => (
        <motion.li
          key={s.order}
          initial={reduce ? false : { opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
          className="relative flex gap-6 border-b py-6 last:border-b-0"
          style={{ borderColor: `${GOLD}22` }}
        >
          <div className="w-16 shrink-0 text-right">
            <span
              className="font-display text-3xl italic"
              style={{ color: GOLD, textShadow: `0 0 12px ${GOLD}55` }}
            >
              {String(s.order).padStart(2, "0")}
            </span>
          </div>
          <div className="flex-1">
            <h3
              className="font-display text-xl tracking-wide"
              style={{ color: IVORY, textShadow: `0 1px 0 ${NIGHT}` }}
            >
              {s.name}
            </h3>
            <p className="mt-1 text-[11px] uppercase tracking-[0.35em]" style={{ color: `${GOLD}dd` }}>
              {[s.date, s.startTime].filter(Boolean).join(" · ")}
            </p>
            {s.venueName && (
              <p className="mt-2 text-sm italic opacity-70" style={{ color: IVORY }}>
                at {s.venueName}
              </p>
            )}
            {s.description && (
              <p className="mt-2 text-sm leading-relaxed opacity-65" style={{ color: IVORY }}>
                {s.description}
              </p>
            )}
            {s.dressCode && (
              <p
                className="mt-3 inline-block border px-3 py-1 text-[10px] uppercase tracking-[0.3em]"
                style={{ borderColor: `${GOLD}55`, color: GOLD }}
              >
                Dress: {s.dressCode}
              </p>
            )}
          </div>
        </motion.li>
      ))}
    </ol>
  );
}

export const OdeonTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || GOLD;
  const tagline = event.tagline?.trim() || "The 47th Annual Ceremony";
  const invitationMessage =
    event.invitationMessage?.trim() ||
    "An evening honoring the artistry, courage, and legacy of a remarkable year in cinema.";
  const aboutStory =
    event.aboutStory?.trim() ||
    "The Odeon Foundation was established to celebrate storytellers whose work has moved audiences across generations. Each year we gather beneath the marquee to recognize the craft and the community that keeps the art alive.";
  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const hero =
    event.heroImageUrl ||
    "https://images.unsplash.com/photo-1594908900066-3f47337549d8?auto=format&fit=crop&w=1800&q=80";

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(heroP, [0, 1], [1, 1.08]);
  const heroTextY = useTransform(heroP, [0, 0.6], [0, -60]);
  const heroOpacity = useTransform(heroP, [0, 0.6], [1, 0]);
  const beamRotL = useTransform(heroP, [0, 1], [-14, 6]);
  const beamRotR = useTransform(heroP, [0, 1], [14, -6]);

  const showStory = !event.hideStory;
  const showJourney = !event.hideEvents && subEvents.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-sans antialiased"
      style={{ color: IVORY, background: BURGUNDY, "--accent": accent } as React.CSSProperties}
    >
      <VelvetField reduce={reduce} />
      <ScrollProgress color={accent} />

      {/* HERO — the marquee */}
      <section ref={heroRef} className="relative flex h-[100svh] min-h-[640px] items-center justify-center overflow-hidden">
        <motion.div style={reduce ? undefined : { scale: heroScale }} className="absolute inset-0">
          <HeroMedia imageSrc={hero} videoSrc={event.heroVideoUrl || undefined} alt={event.eventTitle} className="opacity-30" />
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(60% 55% at 50% 60%, transparent 0%, ${BURGUNDY}cc 55%, ${NIGHT} 100%)`,
            }}
          />
        </motion.div>

        {!reduce && (
          <>
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -top-1/4 left-1/2 h-[160%] w-[90vw] -translate-x-1/2 origin-top"
              style={{
                background: `conic-gradient(from 180deg at 50% 0%, transparent 172deg, ${IVORY}22 180deg, transparent 188deg)`,
                rotate: beamRotL,
                filter: "blur(6px)",
              }}
              animate={{ opacity: [0.35, 0.7, 0.35] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -top-1/4 left-1/2 h-[160%] w-[90vw] -translate-x-1/2 origin-top"
              style={{
                background: `conic-gradient(from 180deg at 50% 0%, transparent 172deg, ${GOLD}20 180deg, transparent 188deg)`,
                rotate: beamRotR,
                filter: "blur(6px)",
              }}
              animate={{ opacity: [0.55, 0.25, 0.55] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
          </>
        )}

        <motion.div style={reduce ? undefined : { y: heroTextY, opacity: heroOpacity }} className="relative z-10 px-6 text-center">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-6 text-[10px] uppercase tracking-[0.7em] italic"
            style={{ color: `${GOLD}dd`, fontVariantCaps: "all-small-caps" }}
          >
            {tagline}
          </motion.p>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 20, letterSpacing: "0.1em" }}
            animate={{ opacity: 1, y: 0, letterSpacing: "-0.01em" }}
            transition={{ duration: 1.4, ease: EASE }}
            className="font-display text-[clamp(3rem,11vw,8.5rem)] font-bold leading-[0.9]"
          >
            <GoldShimmer>{event.eventTitle}</GoldShimmer>
          </motion.h1>
          {(event.person1Name || event.person2Name) && (
            <motion.p
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 1 }}
              className="mt-6 font-display text-lg italic"
              style={{ color: IVORY }}
            >
              presenting{" "}
              <span style={{ color: GOLD }}>
                {[event.person1Name, event.person2Name].filter(Boolean).join(" & ")}
              </span>
            </motion.p>
          )}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.9 }}
            className="mt-10 flex flex-wrap justify-center gap-5 text-xs uppercase tracking-[0.5em]"
            style={{ color: `${IVORY}bb` }}
          >
            {event.mainDate && (
              <span>
                {new Date(event.mainDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            )}
            {event.mainStartTime && <span style={{ color: `${GOLD}88` }}>|</span>}
            {event.mainStartTime && <span>{event.mainStartTime}</span>}
            {event.city && <span style={{ color: `${GOLD}88` }}>|</span>}
            {event.city && <span>{event.city}</span>}
          </motion.div>
        </motion.div>
      </section>

      {/* THE FOUNDATION */}
      {showStory && (
        <section className="relative mx-auto max-w-4xl px-6 py-28 sm:py-36">
          <SectionLabel>About the Ceremony</SectionLabel>
          <motion.blockquote
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: EASE }}
            className="mx-auto max-w-3xl text-center font-display text-2xl italic leading-[1.4] sm:text-3xl"
            style={{ color: IVORY }}
          >
            &ldquo;{invitationMessage}&rdquo;
          </motion.blockquote>
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mx-auto mt-8 max-w-2xl text-center text-sm leading-relaxed opacity-75"
          >
            {aboutStory}
          </motion.p>
          <div className="mx-auto mt-10 h-px w-40" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />
        </section>
      )}

      {/* RUN OF SHOW */}
      {showJourney && (
        <section className="relative py-24 sm:py-32">
          <SectionLabel>The Run of Show</SectionLabel>
          <div className="mb-12">
            <RedCarpet reduce={reduce} />
          </div>
          <RunOfShow items={subEvents} accent={accent} />
        </section>
      )}

      {/* GALLERY — red carpet moments */}
      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <SectionLabel>Past Winners &amp; Red Carpet</SectionLabel>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((m, i) => (
              <motion.figure
                key={`${m.fileName}-${i}`}
                initial={reduce ? false : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: (i % 6) * 0.06, ease: EASE }}
                className="group relative"
              >
                <div
                  className="relative overflow-hidden"
                  style={{
                    padding: "10px",
                    background: `linear-gradient(135deg, #6a4d15, ${GOLD}, #8a6a1a, ${GOLD})`,
                    boxShadow: `0 20px 40px -20px ${NIGHT}, inset 0 0 20px ${NIGHT}44`,
                  }}
                >
                  <img
                    src={m.publicUrl}
                    alt={m.caption ?? ""}
                    className="aspect-[3/4] w-full object-cover transition-all duration-700 group-hover:scale-105"
                    loading="lazy"
                    style={{ filter: "sepia(0.35) saturate(0.85) contrast(1.05)" }}
                  />
                </div>
                {m.caption && (
                  <figcaption
                    className="mt-3 text-center text-[11px] uppercase tracking-[0.35em]"
                    style={{ color: `${GOLD}dd` }}
                  >
                    {m.caption}
                  </figcaption>
                )}
              </motion.figure>
            ))}
            {editing && galleryItems.length === 0 && (
              <div
                className="col-span-full flex h-56 items-center justify-center border border-dashed text-sm"
                style={{ borderColor: `${GOLD}55`, color: `${GOLD}dd` }}
              >
                + Add red carpet photographs
              </div>
            )}
          </div>
        </section>
      )}

      {/* THE THEATRE */}
      {showVenue && (
        <section className="relative mx-auto max-w-5xl px-6 py-24 sm:py-32">
          <SectionLabel>The Theatre</SectionLabel>
          {event.venueName && (
            <h3 className="mb-2 text-center font-display text-3xl">
              <GoldShimmer>{event.venueName}</GoldShimmer>
            </h3>
          )}
          {event.venueAddress && (
            <p className="mb-8 text-center text-sm italic opacity-70">{event.venueAddress}</p>
          )}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE }}
            className="overflow-hidden"
            style={{
              padding: "6px",
              background: `linear-gradient(135deg, ${GOLD}, #6a4d15, ${GOLD})`,
              boxShadow: `0 24px 50px -20px ${NIGHT}`,
            }}
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

      {/* RSVP — Request an invitation */}
      <section className="relative px-6 py-32 text-center sm:py-44">
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: EASE }}
          className="mx-auto max-w-3xl"
        >
          <p className="mb-4 text-[10px] uppercase tracking-[0.6em]" style={{ color: `${GOLD}dd` }}>
            By Invitation
          </p>
          <h2 className="font-display text-[clamp(2rem,6vw,4.5rem)] leading-[1]">
            <GoldShimmer>An Evening to Remember</GoldShimmer>
          </h2>
          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <motion.a
              href={event.rsvpLinkOrContact}
              target="_blank"
              rel="noreferrer"
              whileHover={reduce ? undefined : { scale: 1.03, letterSpacing: "0.4em" }}
              transition={{ duration: 0.3 }}
              className="mt-12 inline-block border-2 px-14 py-5 text-xs uppercase tracking-[0.35em]"
              style={{
                borderColor: GOLD,
                color: GOLD,
                background: `linear-gradient(180deg, ${NIGHT}88, transparent)`,
                boxShadow: `0 0 30px ${GOLD}33, inset 0 0 20px ${NIGHT}66`,
              }}
            >
              Request an Invitation
            </motion.a>
          )}
          {event.contactName && (
            <p className="mt-10 text-xs italic opacity-70">
              R.S.V.P. {event.contactName}
              {event.contactEmail ? ` — ${event.contactEmail}` : ""}
            </p>
          )}
        </motion.div>
      </section>

      <footer
        className="border-t py-10 text-center text-[11px] uppercase tracking-[0.5em]"
        style={{ borderColor: `${GOLD}22`, color: `${IVORY}66` }}
      >
        <p>
          <span style={{ color: GOLD }}>&#10022;</span> {event.eventTitle}
          {event.person1Name ? `  ·  ${event.person1Name}` : ""}
          <span style={{ color: GOLD }}> &#10022;</span>
        </p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default OdeonTemplate;
