"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Countdown } from "@/components/ui/Countdown";
import { Gallery } from "@/components/ui/Gallery";
import { HeroMedia } from "@/components/ui/HeroMedia";
import { MapEmbed } from "@/components/ui/MapEmbed";
import { MusicToggle } from "@/components/ui/MusicToggle";
import { RSVP } from "@/components/ui/RSVP";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { StickyNav } from "@/components/ui/StickyNav";
import { Timeline } from "@/components/ui/Timeline";
import { pastelMeta } from "@/components/templates/metadata";
import { useEditMode } from "@/components/edit/EditContext";
import type { TemplateComponent } from "@/lib/types";

const defaults = pastelMeta.defaults;

// Scalloped circle mask — 10 semicircle bumps around the perimeter.
// Used by Frame 1 to give the medallion a soft, hand-cut edge.
const SCALLOP_MASK_ID = "pastel-scallop-mask";

// Deterministic petal positions so SSR + client render the same nodes.
const PETALS = [
  { left: "8%", top: "12%", rotate: -18, size: 22, delay: 0, duration: 14 },
  { left: "22%", top: "68%", rotate: 34, size: 16, delay: 2.4, duration: 17 },
  { left: "38%", top: "18%", rotate: -52, size: 20, delay: 1.1, duration: 15 },
  { left: "54%", top: "74%", rotate: 12, size: 24, delay: 3.2, duration: 18 },
  { left: "69%", top: "22%", rotate: -6, size: 18, delay: 0.8, duration: 16 },
  { left: "82%", top: "58%", rotate: 44, size: 22, delay: 2.1, duration: 15 },
  { left: "12%", top: "40%", rotate: 68, size: 14, delay: 4, duration: 19 },
  { left: "90%", top: "36%", rotate: -30, size: 18, delay: 1.8, duration: 16 },
];

// Wreath leaves — 12 leaves + tiny flowers positioned around a circle.
const WREATH_LEAVES = Array.from({ length: 12 }, (_, i) => ({
  angle: (i / 12) * 360,
  flip: i % 2 === 0,
  flower: i % 3 === 0,
}));

export const PastelTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = useReducedMotion();
  const accent = event.themeAccentColor || defaults.accentColor;
  const hero = event.heroImageUrl || defaults.heroImage;
  const tagline = event.tagline?.trim() || defaults.tagline;
  const invitationMessage = event.invitationMessage?.trim() || defaults.invitationMessage;
  const galleryItems = media.filter((m) => m.section === "gallery");
  // In edit mode, show the gallery section even when empty so the customer has
  // a "+ Add photos" entry to upload the first images into.
  const editing = !!useEditMode()?.enabled;

  // Art-directed hero — three pastel frames layered over a soft blush wash:
  // scalloped-circle medallion (frame1), watercolor-splash rectangle (frame2),
  // and a botanical wreath medallion (frame3). Degrades gracefully when the
  // customer has fewer than three gallery photos.
  const [frame1, frame2, frame3] = event.showHeroFrames ? galleryItems : [];

  const navItems = [
    ...(!event.hideStory ? [{ id: "intro", label: "Invitation" }] : []),
    ...(!event.hideEvents && subEvents.length ? [{ id: "events", label: "Events" }] : []),
    ...(!event.hideGallery && (galleryItems.length || editing) ? [{ id: "gallery", label: "Memories" }] : []),
    ...(!event.hideVenue ? [{ id: "venue", label: "Venue" }] : []),
    ...(event.rsvpEnabled ? [{ id: "rsvp", label: "RSVP" }] : []),
  ];

  return (
    <div className="font-serif text-neutral-800 overflow-x-clip" style={{ "--accent": accent, background: `${accent}10` } as React.CSSProperties}>
      <section id="top" className="relative min-h-[100svh] flex items-center justify-center overflow-hidden pb-24 sm:pb-28">
        <HeroMedia
          imageSrc={hero}
          videoSrc={event.heroVideoUrl}
          alt=""
          className="opacity-35 mix-blend-multiply"
        />
        {/* Soft blush + cream wash — NEVER darkens; keeps the pastel dream. */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(160deg, ${accent}33 0%, #fff8f4 45%, ${accent}22 100%), radial-gradient(circle at 30% 30%, #ffffff88 0%, transparent 55%)`,
          }}
        />

        {/* Shared SVG defs — scallop mask for frame1, petal shape for the drift */}
        <svg width="0" height="0" className="absolute" aria-hidden>
          <defs>
            <mask id={SCALLOP_MASK_ID} maskUnits="objectBoundingBox" maskContentUnits="objectBoundingBox">
              <rect width="1" height="1" fill="black" />
              <circle cx="0.5" cy="0.5" r="0.42" fill="white" />
              {Array.from({ length: 10 }, (_, i) => {
                const a = (i / 10) * Math.PI * 2;
                const cx = 0.5 + Math.cos(a) * 0.42;
                const cy = 0.5 + Math.sin(a) * 0.42;
                return <circle key={i} cx={cx} cy={cy} r="0.07" fill="white" />;
              })}
            </mask>
          </defs>
        </svg>

        {/* ─── Falling rose petals — 8 SVG ellipses drifting slowly across
         *  the hero. Deterministic positions so no hydration mismatch. */}
        {PETALS.map((p, i) => (
          <motion.svg
            key={`petal-${i}`}
            aria-hidden
            viewBox="0 0 20 12"
            width={p.size}
            height={p.size * 0.6}
            className="absolute pointer-events-none"
            style={{ left: p.left, top: p.top, transform: `rotate(${p.rotate}deg)` }}
            animate={
              reduce
                ? undefined
                : { y: [0, 40, 0], x: [0, 12, -8, 0], rotate: [p.rotate, p.rotate + 20, p.rotate - 10, p.rotate] }
            }
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
          >
            <ellipse cx="10" cy="6" rx="9" ry="5" fill={accent} fillOpacity="0.35" />
            <ellipse cx="10" cy="6" rx="6" ry="3" fill="#ffffff" fillOpacity="0.4" />
          </motion.svg>
        ))}

        {/* ─── Frame 1 — scalloped-edge circular medallion (top-left).
         *  Rose-gold pastel border. Slow float. A tiny rose petal drifts near it. */}
        {frame1 && (
          <motion.figure
            initial={reduce ? false : { opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="hidden md:block absolute left-[5%] top-[12%] w-44 h-44 lg:w-60 lg:h-60"
          >
            <motion.div
              className="relative w-full h-full"
              animate={reduce ? undefined : { y: [0, -6, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Scalloped rose-gold border ring, sitting slightly larger than the photo */}
              <div
                className="absolute -inset-2 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${accent}55, ${accent}00 70%)`,
                  mask: `url(#${SCALLOP_MASK_ID})`,
                  WebkitMask: `url(#${SCALLOP_MASK_ID})`,
                }}
              />
              <div
                className="absolute inset-0 overflow-hidden shadow-xl"
                style={{
                  mask: `url(#${SCALLOP_MASK_ID})`,
                  WebkitMask: `url(#${SCALLOP_MASK_ID})`,
                  boxShadow: `0 20px 40px -14px ${accent}66`,
                }}
              >
                <img
                  src={frame1.publicUrl}
                  alt={frame1.caption ?? ""}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Tiny drifting rose petal next to the scallop frame */}
              <motion.svg
                aria-hidden
                viewBox="0 0 20 12"
                width={18}
                height={12}
                className="absolute -right-4 top-6"
                animate={reduce ? undefined : { y: [0, 20, 0], rotate: [0, 30, -10, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              >
                <ellipse cx="10" cy="6" rx="9" ry="5" fill={accent} fillOpacity="0.55" />
              </motion.svg>
            </motion.div>
          </motion.figure>
        )}

        {/* ─── Frame 2 — watercolor-splash rectangular frame (top-right).
         *  A blurred blush ellipse extends past the photo edges to create
         *  the "painted" aura. Rounded corners. */}
        {frame2 && (
          <motion.figure
            initial={reduce ? false : { opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="hidden md:block absolute right-[6%] top-[18%] w-44 h-56 lg:w-56 lg:h-72"
          >
            {/* Watercolor aura — larger blurred ellipse behind the photo */}
            <div
              aria-hidden
              className="absolute -inset-8 rounded-[45%] blur-2xl opacity-70"
              style={{
                background: `radial-gradient(ellipse at 40% 40%, ${accent}66 0%, ${accent}22 45%, transparent 75%)`,
              }}
            />
            <div
              aria-hidden
              className="absolute -inset-4 rounded-[35%] blur-xl opacity-60"
              style={{
                background: `radial-gradient(ellipse at 60% 55%, #fce4ec99 0%, transparent 65%)`,
              }}
            />
            <motion.div
              className="relative w-full h-full rounded-3xl overflow-hidden"
              animate={reduce ? undefined : { y: [0, 6, 0] }}
              transition={{ duration: 7, delay: 1, repeat: Infinity, ease: "easeInOut" }}
              style={{
                border: `1px solid ${accent}55`,
                boxShadow: `0 24px 50px -18px ${accent}55`,
              }}
            >
              <img
                src={frame2.publicUrl}
                alt={frame2.caption ?? ""}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </motion.figure>
        )}

        {/* ─── Frame 3 — botanical wreath medallion (bottom-left).
         *  Circular photo surrounded by a thin SVG wreath of leaves +
         *  tiny flowers in blush-green. */}
        {frame3 && (
          <motion.figure
            initial={reduce ? false : { opacity: 0, scale: 0.85, rotate: -6 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.1, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block absolute left-[9%] bottom-[14%] w-56 h-56"
          >
            <motion.div
              className="relative w-full h-full"
              animate={reduce ? undefined : { rotate: [0, 3, -3, 0] }}
              transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* SVG wreath ring — 12 leaves + tiny flowers positioned by angle */}
              <svg
                viewBox="0 0 200 200"
                className="absolute inset-0 w-full h-full"
                aria-hidden
              >
                {WREATH_LEAVES.map((l, i) => {
                  const rad = (l.angle * Math.PI) / 180;
                  const cx = 100 + Math.cos(rad) * 92;
                  const cy = 100 + Math.sin(rad) * 92;
                  return (
                    <g key={i} transform={`translate(${cx} ${cy}) rotate(${l.angle + 90}) ${l.flip ? "scale(-1,1)" : ""}`}>
                      {/* Leaf: an almond shape */}
                      <path
                        d="M0,-10 C6,-6 6,6 0,10 C-6,6 -6,-6 0,-10 Z"
                        fill="#b7c9a8"
                        opacity="0.85"
                      />
                      <path d="M0,-8 L0,8" stroke="#8ea67f" strokeWidth="0.6" opacity="0.7" />
                      {l.flower && (
                        <g transform="translate(6 0)">
                          <circle r="2.4" fill={accent} opacity="0.9" />
                          <circle r="1" fill="#fff8f4" />
                        </g>
                      )}
                    </g>
                  );
                })}
              </svg>
              {/* Photo inside the wreath */}
              <div
                className="absolute inset-6 rounded-full overflow-hidden"
                style={{
                  border: `2px solid #fff8f4`,
                  boxShadow: `0 18px 36px -14px ${accent}77, inset 0 0 0 2px ${accent}44`,
                }}
              >
                <img
                  src={frame3.publicUrl}
                  alt={frame3.caption ?? ""}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </motion.figure>
        )}

        {/* Central title card — soft dusty-rose ornaments frame it. */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative z-10 text-center max-w-3xl px-4"
        >
          <div className="mb-4 text-2xl sm:text-3xl opacity-70" style={{ color: accent }} aria-hidden>❀</div>
          <p className="font-script text-4xl sm:text-6xl mb-2" style={{ color: accent }}>{tagline}</p>
          <h1 className="font-display text-5xl sm:text-7xl text-neutral-800">{event.eventTitle}</h1>
          <div className="my-6 h-px w-24 mx-auto" style={{ background: accent }} />
          {event.mainDate && (
            <p className="text-sm sm:text-base uppercase tracking-[0.4em] opacity-70">
              {new Date(event.mainDate).toLocaleDateString("en-US", { dateStyle: "long" })}
              {event.city && ` · ${event.city}`}
            </p>
          )}
          <div className="mt-4 text-xl sm:text-2xl opacity-60" style={{ color: accent }} aria-hidden>✿</div>

          {/* Mobile-only compact collage — three scalloped-circle thumbs */}
          {(frame1 || frame2 || frame3) && (
            <div className="md:hidden mt-6 flex items-center justify-center gap-3">
              {[frame1, frame2, frame3].filter(Boolean).slice(0, 3).map((f, i) => (
                <motion.div
                  key={`mob-${i}`}
                  initial={reduce ? false : { opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 + i * 0.15 }}
                  className="w-16 h-16 relative"
                >
                  <div
                    className="absolute -inset-1 rounded-full"
                    style={{
                      background: `radial-gradient(circle, ${accent}55, ${accent}00 70%)`,
                      mask: `url(#${SCALLOP_MASK_ID})`,
                      WebkitMask: `url(#${SCALLOP_MASK_ID})`,
                    }}
                  />
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{
                      mask: `url(#${SCALLOP_MASK_ID})`,
                      WebkitMask: `url(#${SCALLOP_MASK_ID})`,
                    }}
                  >
                    <img src={f!.publicUrl} alt="" loading="lazy" className="w-full h-full object-cover" />
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {!event.hideTimer && !(event.timerCustom && event.timerStyle === "floating") && event.mainDate && (
            <div className="mt-10">
              <Countdown target={`${event.mainDate}T${event.mainStartTime || "16:00"}:00`} label="Counting moments" />
            </div>
          )}
        </motion.div>
      </section>

      <StickyNav items={navItems} brand={event.eventTitle} />

      {!event.hideStory && (
        <section id="intro" className="py-20 px-6 max-w-2xl mx-auto text-center">
          <ScrollReveal>
            <p className="font-script text-3xl mb-4" style={{ color: accent }}>An invitation</p>
            <p className="text-2xl sm:text-3xl font-display leading-snug">{invitationMessage}</p>
            {event.aboutStory && <p className="mt-6 opacity-80 leading-relaxed">{event.aboutStory}</p>}
          </ScrollReveal>
        </section>
      )}

      {!event.hideEvents && subEvents.length > 0 && (
        <section id="events" className="py-20 px-6 max-w-3xl mx-auto">
          <ScrollReveal>
            <h2 className="font-display text-3xl sm:text-4xl text-center mb-10">Our gatherings</h2>
          </ScrollReveal>
          <Timeline items={subEvents} />
        </section>
      )}

      {!event.hideGallery && (galleryItems.length > 0 || editing) && (
        <section id="gallery" className="py-20 px-6 max-w-6xl mx-auto">
          <ScrollReveal>
            <h2 className="font-display text-3xl sm:text-4xl text-center mb-10">Memories</h2>
          </ScrollReveal>
          <Gallery items={galleryItems} columns={3} />
        </section>
      )}

      {!event.hideVenue && (
        <section id="venue" className="py-20 px-6 max-w-4xl mx-auto">
          <ScrollReveal>
            <h2 className="font-display text-3xl sm:text-4xl text-center mb-10">Where</h2>
            <MapEmbed
              latitude={event.latitude}
              longitude={event.longitude}
              venueName={event.venueName}
              venueAddress={event.venueAddress}
              mapLink={event.mapLink}
            />
          </ScrollReveal>
        </section>
      )}

      {event.rsvpEnabled && (
        <section id="rsvp" className="py-20 px-6 max-w-3xl mx-auto">
          <ScrollReveal>
            <RSVP enabled={event.rsvpEnabled} linkOrContact={event.rsvpLinkOrContact} contactName={event.contactName} type={event.rsvpType} />
          </ScrollReveal>
        </section>
      )}

      <footer className="py-10 px-4 text-center text-sm opacity-70">
        <p>With love, {event.person1Name}{event.person2Name ? ` & ${event.person2Name}` : ""}</p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default PastelTemplate;
