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
import { pastelMeta } from "@/components/templates/metadata";
import { useEditMode } from "@/components/edit/EditContext";
import type { TemplateComponent } from "@/lib/types";

const defaults = pastelMeta.defaults;

export const PastelTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const accent = event.themeAccentColor || defaults.accentColor;
  const hero = event.heroImageUrl || defaults.heroImage;
  const tagline = event.tagline?.trim() || defaults.tagline;
  const invitationMessage = event.invitationMessage?.trim() || defaults.invitationMessage;
  const galleryItems = media.filter((m) => m.section === "gallery");
  // In edit mode, show the gallery section even when empty so the customer has
  // a "+ Add photos" entry to upload the first images into.
  const editing = !!useEditMode()?.enabled;

  const navItems = [
    ...(!event.hideStory ? [{ id: "intro", label: "Invitation" }] : []),
    ...(!event.hideEvents && subEvents.length ? [{ id: "events", label: "Events" }] : []),
    ...(!event.hideGallery && (galleryItems.length || editing) ? [{ id: "gallery", label: "Memories" }] : []),
    ...(!event.hideVenue ? [{ id: "venue", label: "Venue" }] : []),
    ...(event.rsvpEnabled ? [{ id: "rsvp", label: "RSVP" }] : []),
  ];

  return (
    <div className="font-serif text-neutral-800 overflow-x-clip" style={{ "--accent": accent, background: `${accent}10` } as React.CSSProperties}>
      <section id="top" className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, ${accent}22, #ffffff 60%, ${accent}15)` }} />
        <HeroMedia
          imageSrc={hero}
          videoSrc={event.heroVideoUrl}
          alt=""
          className="opacity-40 mix-blend-multiply"
        />
        <div className="relative z-10 text-center max-w-3xl px-4">
          <p className="font-script text-4xl sm:text-6xl mb-2" style={{ color: accent }}>{tagline}</p>
          <h1 className="font-display text-5xl sm:text-7xl text-neutral-800">{event.eventTitle}</h1>
          <div className="my-6 h-px w-24 mx-auto" style={{ background: accent }} />
          {event.mainDate && (
            <p className="text-sm sm:text-base uppercase tracking-[0.4em] opacity-70">
              {new Date(event.mainDate).toLocaleDateString("en-US", { dateStyle: "long" })}
              {event.city && ` · ${event.city}`}
            </p>
          )}
          {!event.hideTimer && event.timerStyle !== "floating" && event.mainDate && (
            <div className="mt-10">
              <Countdown target={`${event.mainDate}T${event.mainStartTime || "16:00"}:00`} label="Counting moments" />
            </div>
          )}
        </div>
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
