"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Countdown } from "@/components/ui/Countdown";
import { Gallery } from "@/components/ui/Gallery";
import { MapEmbed } from "@/components/ui/MapEmbed";
import { MusicToggle } from "@/components/ui/MusicToggle";
import { RSVP } from "@/components/ui/RSVP";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { StickyNav } from "@/components/ui/StickyNav";
import { Timeline } from "@/components/ui/Timeline";
import { royalMeta } from "@/components/templates/metadata";
import type { TemplateComponent } from "@/lib/types";

const defaults = royalMeta.defaults;

export const RoyalTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const accent = event.themeAccentColor || defaults.accentColor;
  const hero = event.heroImageUrl || defaults.heroImage;
  const tagline = event.tagline?.trim() || defaults.tagline;
  const invitationMessage =
    event.invitationMessage?.trim() || defaults.invitationMessage;
  const aboutStory = event.aboutStory?.trim() || defaults.aboutStory!;
  const galleryItems = media.filter((m) => m.section === "gallery");

  const navItems = [
    ...(!event.hideStory ? [{ id: "story", label: "Our Story" }] : []),
    ...(!event.hideEvents && subEvents.length ? [{ id: "events", label: "Events" }] : []),
    ...(!event.hideGallery && galleryItems.length ? [{ id: "gallery", label: "Gallery" }] : []),
    ...(!event.hideVenue ? [{ id: "venue", label: "Venue" }] : []),
    ...(event.rsvpEnabled ? [{ id: "rsvp", label: "RSVP" }] : []),
  ];

  return (
    <div className="font-serif text-neutral-900 overflow-x-hidden" style={{ "--accent": accent } as React.CSSProperties}>
      <section id="top" className="relative h-[100svh] min-h-[600px] flex items-center justify-center text-white overflow-hidden">
        <Image
          src={hero}
          alt={event.eventTitle}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative text-center px-4 max-w-3xl"
        >
          <p className="font-script text-3xl sm:text-5xl mb-4" style={{ color: accent }}>
            {tagline}
          </p>
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl tracking-wide">
            {event.eventTitle}
          </h1>
          {event.mainDate && (
            <p className="mt-6 text-sm sm:text-base uppercase tracking-[0.4em] opacity-90">
              {new Date(event.mainDate).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}
              {event.city && ` · ${event.city}`}
            </p>
          )}
          {event.mainDate && (
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

      {!event.hideGallery && galleryItems.length > 0 && (
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
