"use client";

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
  const accent = event.themeAccentColor || defaults.accentColor;
  const hero = event.heroImageUrl || defaults.heroImage;
  const tagline = event.tagline?.trim() || defaults.tagline;
  const invitationMessage = event.invitationMessage?.trim() || defaults.invitationMessage;
  const galleryItems = media.filter((m) => m.section === "gallery");
  // In edit mode, show the gallery section even when empty so the customer has
  // a "+ Add photos" entry to upload the first images into.
  const editing = !!useEditMode()?.enabled;

  const navItems = [
    ...(!event.hideStory ? [{ id: "about", label: "About" }] : []),
    ...(!event.hideEvents && subEvents.length ? [{ id: "events", label: "Schedule" }] : []),
    ...(!event.hideGallery && (galleryItems.length || editing) ? [{ id: "gallery", label: "Gallery" }] : []),
    ...(!event.hideVenue ? [{ id: "venue", label: "Venue" }] : []),
    ...(event.rsvpEnabled ? [{ id: "rsvp", label: "RSVP" }] : []),
  ];

  return (
    <div className="font-sans text-neutral-900 bg-white overflow-x-clip" style={{ "--accent": accent } as React.CSSProperties}>
      <section id="top" className="grid lg:grid-cols-2 min-h-[100svh]">
        <div className="flex items-center px-6 sm:px-12 lg:px-20 py-16">
          <div className="max-w-md">
            <p className="text-xs uppercase tracking-[0.4em] opacity-60 mb-4">{tagline}</p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-tight">
              {event.eventTitle}
            </h1>
            {event.mainDate && (
              <p className="mt-6 text-base opacity-80">
                {new Date(event.mainDate).toLocaleDateString("en-US", { dateStyle: "long" })}
                {event.city && ` · ${event.city}`}
              </p>
            )}
            <div className="mt-10 inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-neutral-900 text-white text-sm">
              <span className="w-2 h-2 rounded-full" style={{ background: accent }} />
              {event.venueName ?? "Venue details below"}
            </div>
            {!event.hideTimer && !(event.timerCustom && event.timerStyle === "floating") && event.mainDate && (
              <div className="mt-12 text-neutral-900">
                <Countdown target={`${event.mainDate}T${event.mainStartTime || "10:00"}:00`} label="" />
              </div>
            )}
          </div>
        </div>
        <div className="relative min-h-[400px] lg:min-h-full overflow-hidden">
          <HeroMedia
            imageSrc={hero}
            videoSrc={event.heroVideoUrl}
            alt={event.eventTitle}
          />
        </div>
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
