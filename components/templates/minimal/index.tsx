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
import { minimalMeta } from "@/components/templates/metadata";
import { useEditMode } from "@/components/edit/EditContext";
import type { TemplateComponent } from "@/lib/types";

const defaults = minimalMeta.defaults;

export const MinimalTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = useReducedMotion();
  const accent = event.themeAccentColor || defaults.accentColor;
  const hero = event.heroImageUrl || defaults.heroImage;
  const tagline = event.tagline?.trim() || defaults.tagline;
  const invitationMessage = event.invitationMessage?.trim() || defaults.invitationMessage;
  const galleryItems = media.filter((m) => m.section === "gallery");
  // In edit mode, show the gallery section even when empty so the customer has
  // a "+ Add photos" entry to upload the first images into.
  const editing = !!useEditMode()?.enabled;

  // Editorial hero collage — three plates arranged like a magazine layout.
  // Subtractive composition: hairline borders, no shadows, no rotation.
  // frame1 = top-left caption plate, frame2 = top-right mirrored plate,
  // frame3 = full-bleed landscape band across the bottom of the hero.
  const [frame1, frame2, frame3] = event.showHeroFrames ? galleryItems : [];
  const editorialFilter = "grayscale(0.7) contrast(1.05)";

  const navItems = [
    ...(!event.hideStory ? [{ id: "about", label: "About" }] : []),
    ...(!event.hideEvents && subEvents.length ? [{ id: "events", label: "Schedule" }] : []),
    ...(!event.hideGallery && (galleryItems.length || editing) ? [{ id: "gallery", label: "Gallery" }] : []),
    ...(!event.hideVenue ? [{ id: "venue", label: "Venue" }] : []),
    ...(event.rsvpEnabled ? [{ id: "rsvp", label: "RSVP" }] : []),
  ];

  return (
    <div className="font-sans text-neutral-900 bg-white overflow-x-clip" style={{ "--accent": accent } as React.CSSProperties}>
      <section id="top" className="relative min-h-[100svh] pb-24 sm:pb-28 overflow-hidden bg-white text-neutral-900">
        {/* Base hero image, held in a wide upper band. The bottom of the
         *  hero is reserved for the frame3 landscape strip + hero copy. */}
        <div className="absolute inset-0" style={{ filter: editorialFilter }}>
          <HeroMedia
            imageSrc={hero}
            videoSrc={event.heroVideoUrl}
            alt={event.eventTitle}
          />
        </div>
        {/* Light wash so type sits cleanly on any customer photo — this is a
         *  cream/white template, not a dark one, so keep the overlay subtle. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.15) 35%, rgba(255,255,255,0.75) 100%)",
          }}
        />

        {/* Left-margin index — vertical hairline labels, one per plate.
         *  Rendered as a subtle editorial system marker, not decoration. */}
        <div className="hidden md:flex absolute left-6 top-24 flex-col gap-10 text-[9px] uppercase tracking-[0.4em] text-neutral-500 select-none pointer-events-none" style={{ writingMode: "vertical-rl" }}>
          <span>Plate 1</span>
          <span>Plate 2</span>
          <span>Plate 3</span>
        </div>

        {/* Frame 1 — small rectangular chip, top-left. Hard-edged hairline. */}
        {frame1 && (
          <motion.figure
            initial={reduce ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="hidden md:block absolute left-20 top-16 w-40 h-28 lg:w-52 lg:h-36 overflow-hidden border border-black bg-white"
          >
            <img
              src={frame1.publicUrl}
              alt={frame1.caption ?? ""}
              loading="lazy"
              className="w-full h-full object-cover"
              style={{ filter: editorialFilter }}
            />
          </motion.figure>
        )}

        {/* Frame 2 — mirrored rectangular chip, top-right. Slightly larger. */}
        {frame2 && (
          <motion.figure
            initial={reduce ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="hidden md:block absolute right-8 top-16 w-48 h-32 lg:w-60 lg:h-40 overflow-hidden border border-black bg-white"
          >
            <img
              src={frame2.publicUrl}
              alt={frame2.caption ?? ""}
              loading="lazy"
              className="w-full h-full object-cover"
              style={{ filter: editorialFilter }}
            />
          </motion.figure>
        )}

        {/* Central title block — quiet, precise, editorial. */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center justify-center min-h-[100svh] px-6 pb-40 text-center"
        >
          <p className="text-[10px] uppercase tracking-[0.5em] opacity-70 mb-6">{tagline}</p>
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl leading-[1.05] max-w-3xl">
            {event.eventTitle}
          </h1>
          <div className="mt-6 flex items-center justify-center opacity-70">
            <span className="text-sm tracking-[0.4em]">—</span>
          </div>
          {event.mainDate && (
            <p className="mt-6 text-xs sm:text-sm uppercase tracking-[0.4em] opacity-80">
              {new Date(event.mainDate).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}
              {event.city && ` · ${event.city}`}
            </p>
          )}
          {!event.hideTimer && !(event.timerCustom && event.timerStyle === "floating") && event.mainDate && (
            <div className="mt-10 text-neutral-900">
              <Countdown target={`${event.mainDate}T${event.mainStartTime || "10:00"}:00`} label="" />
            </div>
          )}

          {/* Mobile-only compact plates — three tiny squares, hairline only. */}
          {(frame1 || frame2 || frame3) && (
            <div className="md:hidden mt-10 flex items-center justify-center gap-3">
              {[frame1, frame2, frame3].filter(Boolean).slice(0, 3).map((f, i) => (
                <motion.figure
                  key={`mob-${i}`}
                  initial={reduce ? false : { opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className="w-14 h-14 overflow-hidden border border-black bg-white"
                >
                  <img
                    src={f!.publicUrl}
                    alt={f!.caption ?? ""}
                    loading="lazy"
                    className="w-full h-full object-cover"
                    style={{ filter: editorialFilter }}
                  />
                </motion.figure>
              ))}
            </div>
          )}
        </motion.div>

        {/* Frame 3 — wide landscape strip, full-bleed edge-to-edge, ~120px
         *  tall, pinned to the bottom of the hero with a hairline top border. */}
        {frame3 && (
          <motion.figure
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="hidden md:block absolute inset-x-0 bottom-24 sm:bottom-28 h-[120px] overflow-hidden border-t border-black bg-white"
          >
            <img
              src={frame3.publicUrl}
              alt={frame3.caption ?? ""}
              loading="lazy"
              className="w-full h-full object-cover"
              style={{ filter: editorialFilter }}
            />
          </motion.figure>
        )}
      </section>

      <StickyNav items={navItems} brand={event.eventTitle} />

      {!event.hideStory && (
        <section id="about" className="py-24 px-6 max-w-2xl mx-auto">
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.3em] opacity-60 mb-3">Invitation</p>
            <p className="text-2xl sm:text-3xl font-display leading-snug">{invitationMessage}</p>
            {event.aboutStory && <p className="mt-6 opacity-80 leading-relaxed">{event.aboutStory}</p>}
          </ScrollReveal>
        </section>
      )}

      {!event.hideEvents && subEvents.length > 0 && (
        <section id="events" className="py-24 px-6 max-w-3xl mx-auto border-t border-black/5">
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.3em] opacity-60 mb-8">Schedule</p>
          </ScrollReveal>
          <Timeline items={subEvents} />
        </section>
      )}

      {!event.hideGallery && (galleryItems.length > 0 || editing) && (
        <section id="gallery" className="py-24 px-6 max-w-6xl mx-auto border-t border-black/5">
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.3em] opacity-60 mb-8">Gallery</p>
          </ScrollReveal>
          <Gallery items={galleryItems} columns={4} />
        </section>
      )}

      {!event.hideVenue && (
        <section id="venue" className="py-24 px-6 max-w-4xl mx-auto border-t border-black/5">
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.3em] opacity-60 mb-8">Venue</p>
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
        <section id="rsvp" className="py-24 px-6 max-w-3xl mx-auto border-t border-black/5">
          <ScrollReveal>
            <RSVP enabled={event.rsvpEnabled} linkOrContact={event.rsvpLinkOrContact} contactName={event.contactName} type={event.rsvpType} />
          </ScrollReveal>
        </section>
      )}

      <footer className="py-10 px-4 text-center border-t border-black/5 text-sm opacity-70">
        <p>{event.person1Name}{event.person2Name ? ` & ${event.person2Name}` : ""}</p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default MinimalTemplate;
