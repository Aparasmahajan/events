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
import type { TemplateComponent } from "@/lib/types";

const EASE = [0.16, 1, 0.3, 1] as const;

const CREAM = "#f7ede2";
const PLUM = "#4a2d3f";
const ROSE_GOLD = "#d4a574";
const DUSTY_ROSE = "#c89b8c";

export const PromiseTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || ROSE_GOLD;
  const tagline = event.tagline?.trim() || "Two lives, one promise.";
  const invitationMessage =
    event.invitationMessage?.trim() ||
    "With joy in our hearts and stars in our eyes, we invite you to witness the moment two stories become one.";
  const aboutStory = event.aboutStory?.trim() || "";
  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const hero =
    event.heroImageUrl ||
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800&q=80";

  const showStory = !event.hideStory;
  const showEvents = !event.hideEvents && subEvents.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  const hasPartner = !!event.person2Name?.trim();
  const p1 = event.person1Name || "";
  const p2 = event.person2Name || "";

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });

  // Signature motif: names slide from opposite edges toward center.
  const leftX = useTransform(heroP, [0, 0.6], ["-22vw", "0vw"]);
  const rightX = useTransform(heroP, [0, 0.6], ["22vw", "0vw"]);
  const dividerH = useTransform(heroP, [0, 0.6], ["70%", "0%"]);
  const dividerOpacity = useTransform(heroP, [0, 0.55, 0.6], [1, 1, 0]);
  const ampOpacity = useTransform(heroP, [0.4, 0.7], [0, 1]);
  const ampScale = useTransform(heroP, [0.4, 0.7], [0.6, 1]);
  const ringScale = useTransform(heroP, [0.45, 0.85], [0.4, 1.15]);
  const ringOpacity = useTransform(heroP, [0.45, 0.7, 1], [0, 1, 0.6]);

  const dateLabel = event.mainDate
    ? new Date(event.mainDate).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-sans antialiased"
      style={{
        "--accent": accent,
        background: CREAM,
        color: PLUM,
      } as React.CSSProperties}
    >
      <ScrollProgress color={accent} />

      {/* ─── 01. HERO — TWO LIVES CONVERGE ─── */}
      <section ref={heroRef} className="relative h-[140svh] min-h-[900px]">
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          <div className="absolute inset-0">
            <HeroMedia
              imageSrc={hero}
              videoSrc={event.heroVideoUrl || undefined}
              alt={event.eventTitle}
              className="opacity-25"
            />
            <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${CREAM}cc, ${CREAM}99 50%, ${CREAM})` }} />
          </div>

          <div className="relative z-10 flex h-full flex-col items-center justify-center px-6">
            <motion.p
              initial={reduce ? false : { opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: EASE }}
              className="mb-10 text-[10px] uppercase tracking-[0.6em]"
              style={{ color: DUSTY_ROSE }}
            >
              The Promise
            </motion.p>

            {hasPartner ? (
              <div className="relative flex w-full max-w-6xl items-center justify-center">
                <motion.h1
                  style={reduce ? undefined : { x: leftX }}
                  className="font-display text-[clamp(2.5rem,8vw,6.5rem)] leading-[0.95] tracking-tight text-right flex-1"
                >
                  {p1}
                </motion.h1>

                <div className="relative mx-3 flex h-[50vh] w-16 items-center justify-center sm:w-24">
                  <motion.div
                    aria-hidden
                    style={reduce ? undefined : { height: dividerH, opacity: dividerOpacity }}
                    className="absolute w-px"
                    initial={{ height: "70%" }}
                  >
                    <div className="h-full w-full" style={{ background: `linear-gradient(180deg, transparent, ${accent}, transparent)` }} />
                  </motion.div>

                  <motion.div
                    style={reduce ? undefined : { opacity: ampOpacity, scale: ampScale }}
                    className="relative flex items-center justify-center"
                  >
                    <motion.span
                      aria-hidden
                      style={reduce ? undefined : { scale: ringScale, opacity: ringOpacity }}
                      className="absolute rounded-full"
                      initial={{ width: 90, height: 90 }}
                    >
                      <span
                        className="block h-[90px] w-[90px] rounded-full sm:h-[130px] sm:w-[130px]"
                        style={{ border: `1px solid ${accent}`, boxShadow: `0 0 40px ${accent}55` }}
                      />
                    </motion.span>
                    <span
                      className="font-display italic"
                      style={{ color: accent, fontSize: "clamp(2rem, 6vw, 4rem)" }}
                    >
                      &amp;
                    </span>
                  </motion.div>
                </div>

                <motion.h1
                  style={reduce ? undefined : { x: rightX }}
                  className="font-display text-[clamp(2.5rem,8vw,6.5rem)] leading-[0.95] tracking-tight text-left flex-1"
                >
                  {p2}
                </motion.h1>
              </div>
            ) : (
              <h1 className="font-display text-center text-[clamp(3rem,10vw,7.5rem)] leading-[0.95] tracking-tight">
                {p1 || event.eventTitle}
              </h1>
            )}

            <motion.p
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 1 }}
              className="mt-12 max-w-xl text-center font-display italic text-lg sm:text-xl"
              style={{ color: DUSTY_ROSE }}
            >
              {tagline}
            </motion.p>

            {dateLabel && (
              <motion.p
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="mt-8 text-[10px] uppercase tracking-[0.5em]"
                style={{ color: PLUM, opacity: 0.6 }}
              >
                {dateLabel}
                {event.city ? ` · ${event.city}` : ""}
              </motion.p>
            )}
          </div>
        </div>
      </section>

      {/* ─── 02. THE STORY ─── */}
      {showStory && (
        <section className="relative mx-auto max-w-4xl px-6 py-32 sm:py-40">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-8 text-center text-[10px] uppercase tracking-[0.5em]"
            style={{ color: accent }}
          >
            Chapter One
          </motion.p>

          <motion.blockquote
            initial={reduce ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 1.1, ease: EASE }}
            className="font-display text-center text-2xl leading-[1.4] italic sm:text-3xl md:text-4xl"
            style={{ color: PLUM }}
          >
            &ldquo;{invitationMessage}&rdquo;
          </motion.blockquote>

          {aboutStory && (
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2, ease: EASE }}
              className="mx-auto mt-14 max-w-2xl text-center text-base leading-[1.9] sm:text-lg"
              style={{ color: PLUM, opacity: 0.75 }}
            >
              {aboutStory}
            </motion.p>
          )}

          <div className="mt-16 flex items-center justify-center gap-4">
            <span className="h-px w-16" style={{ background: accent }} />
            <span className="text-[10px] uppercase tracking-[0.5em]" style={{ color: DUSTY_ROSE }}>
              &amp;
            </span>
            <span className="h-px w-16" style={{ background: accent }} />
          </div>
        </section>
      )}

      {/* ─── 03. SUB-EVENTS ─── */}
      {showEvents && (
        <section className="relative mx-auto max-w-5xl px-6 py-24 sm:py-32">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-16 text-center text-[10px] uppercase tracking-[0.5em]"
            style={{ color: accent }}
          >
            The Occasions
          </motion.p>

          <ol className="relative mx-auto max-w-3xl">
            <div
              aria-hidden
              className="absolute left-4 top-2 bottom-2 w-px sm:left-1/2"
              style={{ background: `linear-gradient(180deg, transparent, ${accent}66, transparent)` }}
            />
            {[...subEvents].sort((a, b) => a.order - b.order).map((s, i) => (
              <motion.li
                key={s.order}
                initial={reduce ? false : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8% 0px" }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
                className={`relative mb-14 pl-14 sm:mb-20 sm:pl-0 sm:flex ${i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"}`}
              >
                <span
                  className="absolute left-4 top-3 -translate-x-1/2 sm:left-1/2 sm:top-4"
                  aria-hidden
                >
                  <span
                    className="block h-3 w-3 rounded-full"
                    style={{ background: CREAM, border: `2px solid ${accent}`, boxShadow: `0 0 0 4px ${CREAM}` }}
                  />
                </span>

                <div className={`sm:w-1/2 ${i % 2 === 0 ? "sm:pr-16 sm:text-right" : "sm:pl-16 sm:text-left"}`}>
                  <p className="mb-2 font-display italic text-sm" style={{ color: DUSTY_ROSE }}>
                    {[s.date, s.startTime].filter(Boolean).join(" · ")}
                  </p>
                  <h3 className="font-display text-2xl leading-tight sm:text-3xl">{s.name}</h3>
                  {s.venueName && (
                    <p className="mt-2 text-sm italic" style={{ opacity: 0.6 }}>
                      {s.venueName}
                    </p>
                  )}
                  {s.description && (
                    <p className="mt-3 text-sm leading-[1.7]" style={{ opacity: 0.7 }}>
                      {s.description}
                    </p>
                  )}
                  {s.dressCode && (
                    <p className="mt-4 inline-block text-[10px] uppercase tracking-[0.35em]" style={{ color: accent }}>
                      Attire &middot; {s.dressCode}
                    </p>
                  )}
                </div>
              </motion.li>
            ))}
          </ol>
        </section>
      )}

      {/* ─── 04. GALLERY ─── */}
      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-12 text-center text-[10px] uppercase tracking-[0.5em]"
            style={{ color: accent }}
          >
            Fragments
          </motion.p>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {galleryItems.map((m, i) => (
              <motion.figure
                key={`${m.fileName}-${i}`}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.05, ease: EASE }}
                className={`group overflow-hidden ${i % 5 === 0 ? "md:col-span-2 md:row-span-2" : ""}`}
                style={{ border: `1px solid ${accent}33` }}
              >
                <img
                  src={m.publicUrl}
                  alt={m.caption ?? ""}
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover transition-transform duration-[1400ms] group-hover:scale-[1.04]"
                />
                {m.caption && (
                  <figcaption
                    className="px-4 py-3 font-display italic text-sm"
                    style={{ color: DUSTY_ROSE, background: `${CREAM}` }}
                  >
                    {m.caption}
                  </figcaption>
                )}
              </motion.figure>
            ))}
            {editing && galleryItems.length === 0 && (
              <div
                className="col-span-full flex h-56 items-center justify-center text-sm"
                style={{ border: `1px dashed ${accent}66`, color: DUSTY_ROSE }}
              >
                + Add photos
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── 05. VENUE ─── */}
      {showVenue && (
        <section className="relative mx-auto max-w-5xl px-6 py-24 sm:py-32">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-4 text-center text-[10px] uppercase tracking-[0.5em]"
            style={{ color: accent }}
          >
            Where
          </motion.p>
          <motion.h2
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: EASE }}
            className="mb-3 text-center font-display text-3xl sm:text-4xl"
          >
            {event.venueName || "The Venue"}
          </motion.h2>
          {event.venueAddress && (
            <p className="mb-10 text-center font-display italic text-base" style={{ color: DUSTY_ROSE }}>
              {event.venueAddress}
            </p>
          )}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: EASE }}
            className="overflow-hidden"
            style={{ border: `1px solid ${accent}55` }}
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

      {/* ─── 06. RSVP / CTA ─── */}
      <section className="relative px-6 py-32 text-center sm:py-44">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: EASE }}
          className="mx-auto max-w-2xl"
        >
          <div className="mb-8 flex items-center justify-center gap-4">
            <span className="h-px w-20" style={{ background: accent }} />
            <span className="text-[10px] uppercase tracking-[0.55em]" style={{ color: accent }}>
              With love
            </span>
            <span className="h-px w-20" style={{ background: accent }} />
          </div>
          <h2 className="font-display text-[clamp(2rem,6vw,4rem)] leading-[1.05]">
            {hasPartner ? (
              <>
                {p1}
                <span className="mx-4 italic" style={{ color: accent }}>&amp;</span>
                {p2}
              </>
            ) : (
              p1 || event.eventTitle
            )}
          </h2>
          <p className="mt-6 font-display italic text-lg" style={{ color: DUSTY_ROSE }}>
            request the pleasure of your company
          </p>

          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <motion.div
              whileHover={reduce ? undefined : { y: -2 }}
              className="mt-12 inline-block"
            >
              <a
                href={event.rsvpLinkOrContact}
                target="_blank"
                rel="noreferrer"
                className="inline-block px-14 py-4 font-display italic text-base tracking-wide transition-all"
                style={{ background: PLUM, color: CREAM, border: `1px solid ${accent}` }}
              >
                Kindly respond
              </a>
            </motion.div>
          )}
        </motion.div>
      </section>

      <footer className="relative border-t py-10 text-center" style={{ borderColor: `${accent}44` }}>
        <p className="font-display italic text-sm" style={{ color: DUSTY_ROSE }}>
          {event.eventTitle}
          {hasPartner ? ` · ${p1} & ${p2}` : p1 ? ` · ${p1}` : ""}
        </p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default PromiseTemplate;
