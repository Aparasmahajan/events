"use client";

import { motion } from "framer-motion";
import { Countdown } from "@/components/ui/Countdown";
import { Gallery } from "@/components/ui/Gallery";
import { HeroMedia } from "@/components/ui/HeroMedia";
import { MapEmbed } from "@/components/ui/MapEmbed";
import { MusicToggle } from "@/components/ui/MusicToggle";
import { RSVP } from "@/components/ui/RSVP";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { StickyNav } from "@/components/ui/StickyNav";
import { Timeline } from "@/components/ui/Timeline";
import { vibrantMeta } from "@/components/templates/metadata";
import { useEditMode } from "@/components/edit/EditContext";
import type { TemplateComponent } from "@/lib/types";

const defaults = vibrantMeta.defaults;

export const VibrantTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const accent = event.themeAccentColor || defaults.accentColor;
  const hero = event.heroImageUrl || defaults.heroImage;
  const tagline = event.tagline?.trim() || defaults.tagline;
  const invitationMessage = event.invitationMessage?.trim() || defaults.invitationMessage;
  const galleryItems = media.filter((m) => m.section === "gallery");
  // In edit mode, show the gallery section even when empty so the customer has
  // a "+ Add photos" entry to upload the first images into.
  const editing = !!useEditMode()?.enabled;

  const navItems = [
    ...(!event.hideStory ? [{ id: "intro", label: "What's up" }] : []),
    ...(!event.hideEvents && subEvents.length ? [{ id: "schedule", label: "Plan" }] : []),
    ...(!event.hideGallery && (galleryItems.length || editing) ? [{ id: "gallery", label: "Pics" }] : []),
    ...(!event.hideVenue ? [{ id: "venue", label: "Where" }] : []),
    ...(event.rsvpEnabled ? [{ id: "rsvp", label: "RSVP" }] : []),
  ];

  return (
    <div className="font-sans text-neutral-900 overflow-x-clip" style={{ "--accent": accent } as React.CSSProperties}>
      <section
        id="top"
        className="relative min-h-[100svh] flex items-center justify-center overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${accent}, #ffd166 60%, #06d6a0)`,
        }}
      >
        <div className="absolute inset-0 opacity-20">
          <HeroMedia
            imageSrc={hero}
            videoSrc={event.heroVideoUrl}
            alt=""
            className="mix-blend-overlay"
          />
        </div>
        {/* Floating confetti shapes */}
        <div className="absolute inset-0 pointer-events-none">
          {[
            { left: "10%", top: "20%", d: 0 },
            { left: "80%", top: "30%", d: 0.6 },
            { left: "25%", top: "70%", d: 1.2 },
            { left: "70%", top: "75%", d: 0.3 },
            { left: "50%", top: "15%", d: 0.9 },
          ].map((p, i) => (
            <motion.span
              key={i}
              className="absolute w-6 h-6 sm:w-10 sm:h-10 rounded-full bg-white/70"
              style={{ left: p.left, top: p.top }}
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, delay: p.d, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="relative z-10 text-center px-4 max-w-3xl text-white"
        >
          <p className="font-script text-4xl sm:text-6xl drop-shadow-md mb-4">{tagline}</p>
          <h1 className="font-display text-5xl sm:text-7xl drop-shadow-lg">{event.eventTitle}</h1>
          {event.mainDate && (
            <p className="mt-6 text-base sm:text-lg uppercase tracking-widest font-bold">
              {new Date(event.mainDate).toLocaleDateString("en-US", { dateStyle: "long" })}
              {event.city && ` · ${event.city}`}
            </p>
          )}
          {event.mainDate && (
            <div className="mt-10">
              <Countdown target={`${event.mainDate}T${event.mainStartTime || "16:00"}:00`} label="Party starts in" />
            </div>
          )}
        </motion.div>
      </section>

      <StickyNav items={navItems} brand={event.eventTitle} />

      {!event.hideStory && (
        <section id="intro" className="py-20 px-6 max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="font-display text-3xl sm:text-4xl mb-6" style={{ color: accent }}>
              {invitationMessage}
            </h2>
            {event.aboutStory && <p className="opacity-80 leading-relaxed">{event.aboutStory}</p>}
          </ScrollReveal>
        </section>
      )}

      {!event.hideEvents && subEvents.length > 0 && (
        <section id="schedule" className="py-20 px-6 max-w-3xl mx-auto">
          <ScrollReveal>
            <h2 className="font-display text-3xl sm:text-4xl mb-10 text-center">The Plan</h2>
          </ScrollReveal>
          <Timeline items={subEvents} />
        </section>
      )}

      {!event.hideGallery && (galleryItems.length > 0 || editing) && (
        <section id="gallery" className="py-20 px-6 max-w-6xl mx-auto">
          <ScrollReveal>
            <h2 className="font-display text-3xl sm:text-4xl mb-10 text-center">Highlights</h2>
          </ScrollReveal>
          <Gallery items={galleryItems} columns={3} />
        </section>
      )}

      {!event.hideVenue && (
        <section id="venue" className="py-20 px-6 max-w-4xl mx-auto">
          <ScrollReveal>
            <h2 className="font-display text-3xl sm:text-4xl mb-10 text-center">Where</h2>
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

      <footer className="py-10 px-4 text-center text-sm opacity-70" style={{ background: `${accent}11` }}>
        <p>Made with sparkle ✨ — {event.eventTitle}</p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default VibrantTemplate;
