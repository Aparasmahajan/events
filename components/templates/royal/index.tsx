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
import { royalMeta } from "@/components/templates/metadata";
import { useEditMode } from "@/components/edit/EditContext";
import type { TemplateComponent } from "@/lib/types";

const defaults = royalMeta.defaults;

export const RoyalTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = useReducedMotion();
  const accent = event.themeAccentColor || defaults.accentColor;
  const hero = event.heroImageUrl || defaults.heroImage;
  const tagline = event.tagline?.trim() || defaults.tagline;
  const invitationMessage =
    event.invitationMessage?.trim() || defaults.invitationMessage;
  const aboutStory = event.aboutStory?.trim() || defaults.aboutStory!;
  const galleryItems = media.filter((m) => m.section === "gallery");
  // In edit mode, show the gallery section even when empty so the customer has
  // a "+ Add photos" entry to upload the first images into.
  const editing = !!useEditMode()?.enabled;

  // Art-directed hero collage — up to 3 additional gallery photos overlay the
  // main hero as ceremony "moments" (a varmala closeup, a bride/jewelry frame,
  // a mehendi/fire detail). When the customer has fewer than 3 gallery photos
  // uploaded, we degrade gracefully to just the main hero.
  const [frame1, frame2, frame3] = event.showHeroFrames ? galleryItems : [];

  const navItems = [
    ...(!event.hideStory ? [{ id: "story", label: "Our Story" }] : []),
    ...(!event.hideEvents && subEvents.length ? [{ id: "events", label: "Events" }] : []),
    ...(!event.hideGallery && (galleryItems.length || editing) ? [{ id: "gallery", label: "Gallery" }] : []),
    ...(!event.hideVenue ? [{ id: "venue", label: "Venue" }] : []),
    ...(event.rsvpEnabled ? [{ id: "rsvp", label: "RSVP" }] : []),
  ];

  return (
    <div className="font-serif text-neutral-900 overflow-x-clip" style={{ "--accent": accent } as React.CSSProperties}>
      <section id="top" className="relative min-h-[100svh] flex items-center justify-center text-white overflow-hidden pb-24 sm:pb-28">
        <HeroMedia
          imageSrc={hero}
          videoSrc={event.heroVideoUrl}
          alt={event.eventTitle}
        />
        {/* Cinematic vignette + warm gold wash so text stays legible over
         *  any customer-uploaded photo. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(20,10,4,0.55) 0%, rgba(20,10,4,0.25) 40%, rgba(20,10,4,0.8) 100%), radial-gradient(circle at 50% 40%, transparent 30%, rgba(0,0,0,0.35) 100%)",
          }}
        />

        {/* ─── Ceremony frames — art-directed collage of Indian-wedding
         *  moments. On desktop: two circular medallions flank the title
         *  (top-left varmala, bottom-right jewelry) plus a small polaroid-
         *  style tilted photo at bottom-left. On mobile/tablet the frames
         *  scale down and cluster below the title. */}
        {frame1 && (
          <motion.figure
            initial={reduce ? false : { opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="hidden md:block absolute left-[6%] top-[14%] w-40 h-40 lg:w-56 lg:h-56 rounded-full overflow-hidden shadow-2xl"
            style={{
              border: `2px solid ${accent}`,
              boxShadow: `0 0 0 6px rgba(0,0,0,0.15), 0 20px 40px -12px rgba(0,0,0,0.5), 0 0 60px -12px ${accent}88`,
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
            <figcaption
              className="absolute bottom-1 inset-x-0 text-center text-[10px] uppercase tracking-[0.3em] py-1"
              style={{ color: accent, textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}
            >
              {frame1.caption ?? "Moment I"}
            </figcaption>
          </motion.figure>
        )}

        {frame2 && (
          <motion.figure
            initial={reduce ? false : { opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="hidden md:block absolute right-[7%] top-[22%] w-36 h-36 lg:w-52 lg:h-52 rounded-full overflow-hidden shadow-2xl"
            style={{
              border: `2px solid ${accent}`,
              boxShadow: `0 0 0 6px rgba(0,0,0,0.15), 0 20px 40px -12px rgba(0,0,0,0.5), 0 0 60px -12px ${accent}88`,
            }}
          >
            <motion.img
              src={frame2.publicUrl}
              alt={frame2.caption ?? ""}
              loading="lazy"
              className="w-full h-full object-cover"
              animate={reduce ? undefined : { y: [0, 6, 0] }}
              transition={{ duration: 7, delay: 1, repeat: Infinity, ease: "easeInOut" }}
            />
            <figcaption
              className="absolute bottom-1 inset-x-0 text-center text-[10px] uppercase tracking-[0.3em] py-1"
              style={{ color: accent, textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}
            >
              {frame2.caption ?? "Moment II"}
            </figcaption>
          </motion.figure>
        )}

        {frame3 && (
          <motion.figure
            initial={reduce ? false : { opacity: 0, rotate: -8, y: 30 }}
            animate={{ opacity: 1, rotate: -6, y: 0 }}
            transition={{ duration: 1.1, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            whileHover={reduce ? undefined : { rotate: -3, scale: 1.03 }}
            className="hidden lg:block absolute left-[10%] bottom-[16%] w-40 h-52 bg-white p-2 pb-8 shadow-2xl"
            style={{
              boxShadow: `0 20px 40px -12px rgba(0,0,0,0.6), 0 0 40px -12px ${accent}44`,
            }}
          >
            <img
              src={frame3.publicUrl}
              alt={frame3.caption ?? ""}
              loading="lazy"
              className="w-full h-40 object-cover"
            />
            <figcaption className="mt-1 text-center text-[10px] uppercase tracking-[0.25em] text-neutral-700 font-sans">
              {frame3.caption ?? "Moment III"}
            </figcaption>
          </motion.figure>
        )}

        {/* Central title card — sits above the collage, anchored with
         *  gold hairline flourishes. */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative text-center px-4 max-w-3xl z-10"
        >
          {/* Top hairline + ornament */}
          <div className="flex items-center justify-center gap-3 mb-6 opacity-80">
            <span className="h-px w-10 sm:w-16" style={{ background: accent }} />
            <span className="text-lg" style={{ color: accent }}>❦</span>
            <span className="h-px w-10 sm:w-16" style={{ background: accent }} />
          </div>

          <p className="font-script text-3xl sm:text-5xl mb-4" style={{ color: accent }}>
            {tagline}
          </p>
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl tracking-wide leading-[1.05]">
            {event.eventTitle}
          </h1>
          {event.mainDate && (
            <p className="mt-6 text-sm sm:text-base uppercase tracking-[0.4em] opacity-90">
              {new Date(event.mainDate).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}
              {event.city && ` · ${event.city}`}
            </p>
          )}

          {/* Bottom hairline */}
          <div className="flex items-center justify-center gap-3 mt-6 opacity-70">
            <span className="h-px w-16" style={{ background: accent }} />
            <span className="text-xs" style={{ color: accent }}>◈</span>
            <span className="h-px w-16" style={{ background: accent }} />
          </div>

          {/* Mobile-only compact collage — the desktop side frames hide on
           *  small screens, so bring the moments together as a tight row of
           *  circular thumbs under the title. */}
          {(frame1 || frame2 || frame3) && (
            <div className="md:hidden mt-8 flex items-center justify-center gap-3">
              {[frame1, frame2, frame3].filter(Boolean).slice(0, 3).map((f, i) => (
                <motion.figure
                  key={`mob-${i}`}
                  initial={reduce ? false : { opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 + i * 0.15 }}
                  className="w-16 h-16 rounded-full overflow-hidden"
                  style={{
                    border: `2px solid ${accent}`,
                    boxShadow: `0 8px 20px -8px rgba(0,0,0,0.6)`,
                  }}
                >
                  <img
                    src={f!.publicUrl}
                    alt={f!.caption ?? ""}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </motion.figure>
              ))}
            </div>
          )}

          {!event.hideTimer && !(event.timerCustom && event.timerStyle === "floating") && event.mainDate && (
            <div className="mt-10">
              <Countdown target={`${event.mainDate}T${event.mainStartTime || "18:00"}:00`} label="Until the big day" />
            </div>
          )}
        </motion.div>
      </section>

      <StickyNav items={navItems} brand={event.eventTitle} />

      {!event.hideStory && (
        <section id="story" className="py-20 sm:py-28 px-4 sm:px-6 max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <p className="font-script text-3xl mb-3" style={{ color: accent }}>Our Story</p>
            <h2 className="font-display text-3xl sm:text-4xl mb-8">{invitationMessage}</h2>
            <p className="text-lg leading-relaxed opacity-90">{aboutStory}</p>
          </ScrollReveal>
        </section>
      )}

      {!event.hideEvents && subEvents.length > 0 && (
        <section id="events" className="py-20 sm:py-28 px-4 sm:px-6 max-w-3xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <p className="font-script text-3xl mb-2" style={{ color: accent }}>Wedding Functions</p>
              <h2 className="font-display text-3xl sm:text-4xl">Join us across the days</h2>
            </div>
          </ScrollReveal>
          <Timeline items={subEvents} />
        </section>
      )}

      {!event.hideGallery && (galleryItems.length > 0 || editing) && (
        <section id="gallery" className="py-20 sm:py-28 px-4 sm:px-6 max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <p className="font-script text-3xl mb-2" style={{ color: accent }}>Moments</p>
              <h2 className="font-display text-3xl sm:text-4xl">A look back, with love</h2>
            </div>
          </ScrollReveal>
          <Gallery items={galleryItems} columns={3} />
        </section>
      )}

      {!event.hideVenue && (
        <section id="venue" className="py-20 sm:py-28 px-4 sm:px-6 max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-10">
              <p className="font-script text-3xl mb-2" style={{ color: accent }}>The Venue</p>
              <h2 className="font-display text-3xl sm:text-4xl">Where we&apos;ll celebrate</h2>
            </div>
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
        <section id="rsvp" className="py-20 sm:py-28 px-4 sm:px-6 max-w-3xl mx-auto">
          <ScrollReveal>
            <RSVP enabled={event.rsvpEnabled} linkOrContact={event.rsvpLinkOrContact} contactName={event.contactName} type={event.rsvpType} />
          </ScrollReveal>
        </section>
      )}

      <footer className="py-10 px-4 text-center border-t border-black/5 text-sm opacity-70">
        <p>With love, {event.person1Name}{event.person2Name ? ` & ${event.person2Name}` : ""}</p>
        {event.contactName && <p className="mt-1">For queries: {event.contactName}</p>}
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default RoyalTemplate;
