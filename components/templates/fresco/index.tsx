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
const CANVAS = "#e8dcc4";
const SIENNA = "#a0522d";
const UMBER = "#5e4530";
const GOLD = "#b8923c";
const OXBLOOD = "#7a2e2a";
const INK = "#2e2418";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

function CanvasTexture() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-40 mix-blend-multiply opacity-[0.35]">
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <filter id="fresco-canvas">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" seed="7" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.36 0 0 0 0 0.28 0 0 0 0 0.18 0 0 0 0.08 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#fresco-canvas)" />
      </svg>
    </div>
  );
}

function BrushHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  const reduce = useReducedMotion();
  return (
    <div className="relative mx-auto mb-12 max-w-2xl px-6 text-center">
      <div className="relative inline-block px-8 py-4">
        <motion.svg
          aria-hidden
          viewBox="0 0 400 90"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          initial={reduce ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.9, ease: EASE }}
          style={{ originX: 0 }}
        >
          <path
            d="M8 46 C 30 22, 90 14, 160 18 C 240 22, 330 12, 388 30 C 398 42, 394 58, 380 66 C 310 82, 220 74, 140 78 C 80 80, 24 76, 10 62 C 2 56, 3 50, 8 46 Z"
            fill={SIENNA}
            opacity="0.92"
          />
          <path
            d="M20 40 C 70 28, 180 24, 300 28 C 350 32, 380 40, 376 52 C 320 64, 180 66, 60 64 C 30 60, 16 50, 20 40 Z"
            fill={OXBLOOD}
            opacity="0.45"
          />
        </motion.svg>
        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="relative"
        >
          <p className="text-[10px] uppercase tracking-[0.5em]" style={{ color: CANVAS }}>{eyebrow}</p>
          <h2 className="font-display mt-1 text-2xl tracking-wide sm:text-3xl" style={{ color: "#f3ead6" }}>{title}</h2>
        </motion.div>
      </div>
    </div>
  );
}

function MuseumFrame({ src, alt, caption, i }: { src: string; alt: string; caption?: string | null; i: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.figure
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.6, delay: (i % 4) * 0.08, ease: EASE }}
      className="group"
    >
      <div
        className="p-[10px] shadow-[0_14px_30px_rgba(46,36,24,0.35)]"
        style={{ background: `linear-gradient(135deg, ${GOLD}, #8a6a24 45%, #d9b96a 70%, ${GOLD})` }}
      >
        <div className="border p-[5px]" style={{ borderColor: "#f0e0ae", background: "#8a6a24" }}>
          <img
            src={src}
            alt={alt}
            className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            loading="lazy"
          />
        </div>
      </div>
      <figcaption
        className="mx-auto -mt-1 w-fit max-w-[85%] px-4 py-1.5 text-center font-serif text-[11px] italic shadow-md"
        style={{ background: `linear-gradient(180deg, #d9b96a, ${GOLD})`, color: INK, border: "1px solid #8a6a24" }}
      >
        {caption?.trim() || `Study ${ROMAN[Math.min(i, 9)]}`}
      </figcaption>
    </motion.figure>
  );
}

function TriptychPanels({ items }: { items: SubEvent[] }) {
  const reduce = useReducedMotion();
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <div className="mx-auto grid max-w-5xl gap-6 px-6 sm:grid-cols-2 lg:grid-cols-3">
      {sorted.map((s, i) => (
        <motion.article
          key={s.order}
          initial={reduce ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8% 0px" }}
          transition={{ duration: 0.6, delay: (i % 3) * 0.12, ease: EASE }}
          className="relative border-2 px-6 pb-7 pt-10 text-center shadow-[0_10px_24px_rgba(46,36,24,0.2)]"
          style={{
            borderColor: GOLD,
            background: "linear-gradient(180deg, #f2e8d2, #e8dcc4 40%, #e2d3b4)",
            borderRadius: "48% 48% 4px 4px / 26% 26% 4px 4px",
          }}
        >
          <span
            className="absolute left-1/2 top-3 -translate-x-1/2 font-serif text-sm italic"
            style={{ color: OXBLOOD }}
          >
            {ROMAN[Math.min(s.order - 1, 9)] ?? s.order}
          </span>
          <h3 className="font-display text-xl tracking-wide" style={{ color: UMBER }}>{s.name}</h3>
          <p className="mt-1 text-[11px] uppercase tracking-[0.25em]" style={{ color: SIENNA }}>
            {[s.date, s.startTime].filter(Boolean).join(" · ")}
          </p>
          <div className="mx-auto my-3 h-px w-16" style={{ background: GOLD }} />
          {s.venueName && <p className="text-sm" style={{ color: INK }}>{s.venueName}</p>}
          {s.description && <p className="mt-2 font-serif text-sm italic leading-relaxed" style={{ color: UMBER }}>{s.description}</p>}
          {s.dressCode && (
            <p className="mt-3 inline-block border px-3 py-1 text-[10px] uppercase tracking-[0.2em]" style={{ borderColor: GOLD, color: SIENNA }}>
              {s.dressCode}
            </p>
          )}
        </motion.article>
      ))}
    </div>
  );
}

export const FrescoTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || SIENNA;
  const tagline = event.tagline?.trim() || "A love painted for the ages";
  const invitationMessage = event.invitationMessage?.trim() || "As the old masters set eternity in pigment and gold, so do we set this day. You are invited to step inside the painting and celebrate with us.";
  const aboutStory = event.aboutStory?.trim() || "Every great fresco begins with a single stroke. Ours began the day we met — and each year since has added another layer of color, until the wall of our life became a scene worth framing.";
  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const hero = event.heroImageUrl || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80";

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(heroP, [0, 1], [1, 1.08]);
  const heroTextY = useTransform(heroP, [0, 0.5], [0, -40]);
  const heroOpacity = useTransform(heroP, [0, 0.5], [1, 0]);

  const [frame1, frame2, frame3] = event.showHeroFrames ? galleryItems : [];

  const showStory = !event.hideStory;
  const showJourney = !event.hideEvents && subEvents.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-sans antialiased"
      style={{ "--accent": accent, background: CANVAS, color: INK } as React.CSSProperties}
    >
      <CanvasTexture />
      <ScrollProgress color={accent} />

      {/* ─── I. THE HERO CANVAS ─── */}
      <section ref={heroRef} className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-4 py-10 pb-24 sm:pb-28">
        <div
          className="relative h-full w-full max-w-6xl overflow-hidden p-2 shadow-[0_30px_60px_rgba(46,36,24,0.45)] sm:p-3"
          style={{ background: `linear-gradient(135deg, ${GOLD}, #8a6a24 40%, #d9b96a 65%, ${GOLD})` }}
        >
          <div className="relative h-full w-full overflow-hidden border-2" style={{ borderColor: "#f0e0ae" }}>
            <motion.div style={reduce ? undefined : { scale: heroScale }} className="absolute inset-0">
              <HeroMedia imageSrc={hero} videoSrc={event.heroVideoUrl || undefined} alt={event.eventTitle} className="sepia-[0.25]" />
              <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, rgba(46,36,24,0.15), rgba(46,36,24,0.05) 40%, rgba(46,36,24,0.65))` }} />
            </motion.div>

            {/* Ceremony frames — 3 oil-painting "plates" on the wall */}
            {frame1 && (
              <motion.figure
                initial={reduce ? false : { opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, delay: 0.4, ease: EASE }}
                className="hidden md:flex absolute left-[4%] top-[8%] gap-1 z-20 p-2 shadow-2xl"
                style={{ background: `linear-gradient(135deg, ${GOLD}, #8a6a24 60%, ${GOLD})` }}
              >
                <div className="w-6 h-24 lg:h-32 flex items-center justify-center opacity-70" style={{ background: CANVAS, color: UMBER, fontFamily: "serif", fontSize: 8 }}>❦</div>
                <div className="w-24 lg:w-32 h-24 lg:h-32 border" style={{ borderColor: "#f0e0ae" }}>
                  <img src={frame1.publicUrl} alt={frame1.caption ?? ""} loading="lazy" className="w-full h-full object-cover sepia-[0.15]" />
                </div>
                <div className="w-6 h-24 lg:h-32 flex items-center justify-center opacity-70" style={{ background: CANVAS, color: UMBER, fontFamily: "serif", fontSize: 8 }}>❦</div>
              </motion.figure>
            )}

            {frame2 && (
              <motion.figure
                initial={reduce ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, delay: 0.6, ease: EASE }}
                whileHover={reduce ? undefined : { rotate: -1 }}
                className="hidden md:block absolute right-[5%] top-[10%] w-32 lg:w-40 z-20"
              >
                <div
                  className="p-3 shadow-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${GOLD}, #8a6a24 60%, ${GOLD})`,
                    borderRadius: "50%",
                  }}
                >
                  <div className="w-full aspect-[3/4] overflow-hidden border" style={{ borderRadius: "50%", borderColor: "#f0e0ae" }}>
                    <img src={frame2.publicUrl} alt={frame2.caption ?? ""} loading="lazy" className="w-full h-full object-cover sepia-[0.15]" />
                  </div>
                </div>
                <div className="mt-1 mx-auto w-24 text-center text-[9px] uppercase tracking-[0.3em] py-1 px-2" style={{ background: "#8a6a24", color: CANVAS, fontFamily: "serif" }}>
                  Plate II
                </div>
              </motion.figure>
            )}

            {frame3 && (
              <motion.figure
                initial={reduce ? false : { opacity: 0, rotate: -6 }}
                animate={{ opacity: 1, rotate: -2 }}
                transition={{ duration: 1.1, delay: 0.85, ease: EASE }}
                className="hidden lg:block absolute left-[6%] bottom-[18%] w-40 z-20 p-2 shadow-2xl"
                style={{ background: `linear-gradient(135deg, ${GOLD}, #8a6a24 60%, ${GOLD})` }}
              >
                <div className="overflow-hidden border" style={{ borderColor: "#f0e0ae", clipPath: "path('M0,32 A80,32 0 0 1 160,32 L160,192 L0,192 Z')", height: 168 }}>
                  <img src={frame3.publicUrl} alt={frame3.caption ?? ""} loading="lazy" className="w-full h-full object-cover sepia-[0.15]" />
                </div>
                <div className="mt-1 text-center text-[9px] uppercase tracking-[0.3em] py-1" style={{ color: CANVAS, fontFamily: "serif" }}>Plate III</div>
              </motion.figure>
            )}
            <motion.div style={reduce ? undefined : { y: heroTextY, opacity: heroOpacity }} className="relative z-10 flex h-full flex-col items-center justify-end pb-14 text-center">
              <motion.p
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
                className="mb-4 font-serif text-sm italic tracking-wide"
                style={{ color: "#f0e0ae" }}
              >
                {tagline}
              </motion.p>
              <motion.h1
                initial={reduce ? false : { opacity: 0, y: 20, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1.1, delay: 0.5, ease: EASE }}
                className="font-display text-[clamp(2.6rem,8vw,6rem)] leading-[1.02] tracking-wide"
                style={{ color: CANVAS, textShadow: "0 3px 20px rgba(46,36,24,0.7)" }}
              >
                {event.eventTitle}
              </motion.h1>
              {(event.person1Name || event.person2Name) && (
                <motion.p
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1 }}
                  className="mt-3 font-serif text-lg italic sm:text-xl"
                  style={{ color: "#f0e0ae" }}
                >
                  {[event.person1Name, event.person2Name].filter(Boolean).join(" & ")}
                </motion.p>
              )}
              <motion.div
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="mt-6 flex flex-wrap items-center justify-center gap-3 text-[11px] uppercase tracking-[0.35em]"
                style={{ color: CANVAS }}
              >
                {event.mainDate && (
                  <span>{new Date(event.mainDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</span>
                )}
                {event.city && <><span style={{ color: GOLD }}>❦</span><span>{event.city}</span></>}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── II. THE INVITATION ─── */}
      {showStory && (
        <section className="relative py-24 sm:py-32">
          <BrushHeading eyebrow="The Invitation" title="A Scene Begins" />
          <div className="mx-auto max-w-3xl px-6 text-center">
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: EASE }}
              className="font-serif text-xl italic leading-relaxed sm:text-2xl"
              style={{ color: UMBER }}
            >
              {invitationMessage}
            </motion.p>
            <motion.div
              initial={reduce ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="mx-auto mt-8 max-w-2xl border-t pt-8 text-base leading-relaxed"
              style={{ borderColor: GOLD, color: INK }}
            >
              {aboutStory}
            </motion.div>
          </div>
        </section>
      )}

      {/* ─── III. MOVEMENTS OF THE FRESCO ─── */}
      {showJourney && (
        <section className="relative py-20 sm:py-28" style={{ background: "linear-gradient(180deg, transparent, rgba(160,82,45,0.08), transparent)" }}>
          <BrushHeading eyebrow="Movements of the Fresco" title="The Days Unfold" />
          <TriptychPanels items={subEvents} />
        </section>
      )}

      {/* ─── IV. THE GALLERY WING ─── */}
      {showGallery && (
        <section className="relative py-20 sm:py-28" style={{ background: `linear-gradient(180deg, ${CANVAS}, #4a3826 18%, #3d2f20 82%, ${CANVAS})` }}>
          <BrushHeading eyebrow="The Gallery Wing" title="Portraits & Studies" />
          <div className="mx-auto grid max-w-6xl gap-8 px-6 sm:grid-cols-2 lg:grid-cols-4">
            {galleryItems.map((m, i) => (
              <MuseumFrame key={`${m.fileName}-${i}`} src={m.publicUrl} alt={m.caption ?? ""} caption={m.caption} i={i} />
            ))}
            {editing && galleryItems.length === 0 && (
              <div className="col-span-full flex h-48 items-center justify-center border-2 border-dashed text-sm" style={{ borderColor: GOLD, color: CANVAS }}>
                + Add photos
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── V. THE SETTING ─── */}
      {showVenue && (
        <section className="relative py-20 sm:py-28">
          <BrushHeading eyebrow="The Setting" title={event.venueName || "Where We Gather"} />
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="mx-auto max-w-4xl px-6"
          >
            <div className="p-2" style={{ background: `linear-gradient(135deg, ${GOLD}, #8a6a24 45%, #d9b96a)` }}>
              <MapEmbed
                latitude={event.latitude}
                longitude={event.longitude}
                venueName={event.venueName}
                venueAddress={event.venueAddress}
                mapLink={event.mapLink}
              />
            </div>
            {event.venueAddress && (
              <p className="mt-4 text-center font-serif text-sm italic" style={{ color: UMBER }}>{event.venueAddress}</p>
            )}
          </motion.div>
        </section>
      )}

      {/* ─── VI. THE FINAL STROKE ─── */}
      <section className="relative px-6 py-24 text-center sm:py-36">
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE }}
          className="mx-auto max-w-2xl"
        >
          <p className="font-serif text-lg italic" style={{ color: SIENNA }}>{"❦"}</p>
          <h2 className="font-display mt-4 text-3xl tracking-wide sm:text-4xl" style={{ color: UMBER }}>
            Be part of the painting
          </h2>
          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <motion.a
              whileHover={reduce ? undefined : { scale: 1.04, boxShadow: `0 10px 30px rgba(122,46,42,0.35)` }}
              href={event.rsvpLinkOrContact}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-block px-12 py-4 text-xs uppercase tracking-[0.35em] shadow-lg transition-all"
              style={{ background: OXBLOOD, color: CANVAS, border: `1px solid ${GOLD}` }}
            >
              RSVP now
            </motion.a>
          )}
          {event.contactName && (
            <p className="mt-8 font-serif text-sm italic" style={{ color: UMBER }}>
              With love, {event.contactName}{event.contactPhone ? ` · ${event.contactPhone}` : ""}
            </p>
          )}
        </motion.div>
      </section>

      <footer className="border-t py-8 text-center font-serif text-xs italic" style={{ borderColor: GOLD, color: SIENNA }}>
        <p>{event.eventTitle}{event.person1Name && event.person2Name ? ` · ${event.person1Name} & ${event.person2Name}` : ""}</p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default FrescoTemplate;
