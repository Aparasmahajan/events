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
import { modernMeta } from "@/components/templates/metadata";
import type { TemplateComponent } from "@/lib/types";

const defaults = modernMeta.defaults;

export const ModernTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const accent = event.themeAccentColor || defaults.accentColor;
  const hero = event.heroImageUrl || defaults.heroImage;
  const invitationMessage = event.invitationMessage?.trim() || defaults.invitationMessage;
  const galleryItems = media.filter((m) => m.section === "gallery");

  const navItems = [
    ...(!event.hideStory ? [{ id: "intro", label: "Intro" }] : []),
    ...(!event.hideEvents && subEvents.length ? [{ id: "schedule", label: "Schedule" }] : []),
    ...(!event.hideGallery && galleryItems.length ? [{ id: "gallery", label: "Gallery" }] : []),
    ...(!event.hideVenue ? [{ id: "venue", label: "Venue" }] : []),
    ...(event.rsvpEnabled ? [{ id: "rsvp", label: "RSVP" }] : []),
  ];

  return (
    <div className="font-sans text-white bg-neutral-950" style={{ "--accent": accent } as React.CSSProperties}>
      <section id="top" className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
        <HeroMedia
          imageSrc={hero}
          videoSrc={event.heroVideoUrl}
          alt={event.eventTitle}
          className="opacity-50"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 30% 20%, ${accent}55, transparent 50%), radial-gradient(circle at 70% 70%, #00000099, #000000ee)`,
          }}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 text-center max-w-4xl px-4"
        >
          <span className="inline-block px-3 py-1 rounded-full border border-white/20 text-xs uppercase tracking-[0.3em] mb-6">
            {event.eventType}
          </span>
          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl tracking-tight leading-none">
            {event.eventTitle}
          </h1>
          {event.mainDate && (
            <p className="mt-8 text-lg sm:text-xl opacity-90 font-mono">
              {new Date(event.mainDate).toLocaleDateString("en-US", { dateStyle: "long" })}
              {event.city && ` // ${event.city.toUpperCase()}`}
            </p>
          )}
          {event.mainDate && (
            <div className="mt-12">
              <Countdown target={`${event.mainDate}T${event.mainStartTime || "19:00"}:00`} label="T-minus" />
            </div>
          )}
        </motion.div>
      </section>

      <div className="bg-white text-neutral-900">
        <StickyNav items={navItems} brand={event.eventTitle} />

        {!event.hideStory && (
          <section id="intro" className="py-24 px-6 max-w-3xl mx-auto">
            <ScrollReveal>
              <p
                className="text-xs uppercase tracking-[0.4em] mb-4"
                style={{ color: accent }}
              >
                The invitation
              </p>
              <p className="text-3xl sm:text-4xl font-display leading-tight">{invitationMessage}</p>
              {event.aboutStory && <p className="mt-6 opacity-80 leading-relaxed">{event.aboutStory}</p>}
            </ScrollReveal>
          </section>
        )}

        {!event.hideEvents && subEvents.length > 0 && (
          <section id="schedule" className="py-24 px-6 max-w-3xl mx-auto">
            <ScrollReveal>
              <h2 className="font-display text-3xl sm:text-4xl mb-10">Schedule</h2>
            </ScrollReveal>
            <Timeline items={subEvents} />
          </section>
        )}

        {!event.hideGallery && galleryItems.length > 0 && (
          <section id="gallery" className="py-24 px-6 max-w-6xl mx-auto">
            <ScrollReveal>
              <h2 className="font-display text-3xl sm:text-4xl mb-10">Gallery</h2>
            </ScrollReveal>
            <Gallery items={galleryItems} columns={3} />
          </section>
        )}

        {!event.hideVenue && (
          <section id="venue" className="py-24 px-6 max-w-4xl mx-auto">
            <ScrollReveal>
              <h2 className="font-display text-3xl sm:text-4xl mb-10">Venue</h2>
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
          <section id="rsvp" className="py-24 px-6 max-w-3xl mx-auto">
            <ScrollReveal>
              <RSVP enabled={event.rsvpEnabled} linkOrContact={event.rsvpLinkOrContact} contactName={event.contactName} type={event.rsvpType} />
            </ScrollReveal>
          </section>
        )}

        <footer className="py-10 px-4 text-center text-sm opacity-70">
          <p>{event.eventTitle}</p>
        </footer>
      </div>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default ModernTemplate;
