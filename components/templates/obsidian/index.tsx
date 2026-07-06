"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { HeroMedia } from "@/components/ui/HeroMedia";
import { MapEmbed } from "@/components/ui/MapEmbed";
import { Countdown } from "@/components/ui/Countdown";
import { MusicToggle } from "@/components/ui/MusicToggle";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { AddToCalendar } from "@/components/ui/AddToCalendar";
import { RSVP } from "@/components/ui/RSVP";
import { EditableImage } from "@/components/edit/EditableImage";
import { useEditMode } from "@/components/edit/EditContext";
import { obsidianMeta } from "@/components/templates/metadata";
import { EASE, Grain, Magnetic, Reveal, WordReveal, useReduce } from "@/components/templates/_fx";
import type { MediaItem, TemplateComponent } from "@/lib/types";

const defaults = obsidianMeta.defaults;

/* Display type that arrives as three offset horizontal slices. */
function SlicedTitle({ text, className }: { text: string; className?: string }) {
  const reduce = useReduce();
  const slices = [
    { clip: "inset(0 0 66.6% 0)", from: -70 },
    { clip: "inset(33.3% 0 33.3% 0)", from: 70 },
    { clip: "inset(66.6% 0 0 0)", from: -50 },
  ];
  return (
    <span className={`relative inline-block ${className ?? ""}`}>
      <span className="opacity-0">{text}</span>
      {slices.map((s, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="absolute inset-0"
          style={{ clipPath: s.clip }}
          initial={reduce ? false : { x: s.from, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: i * 0.12, ease: EASE }}
        >
          {text}
        </motion.span>
      ))}
    </span>
  );
}

/* Image that wipes open with a clip-path as it enters. */
function ClipImage({ item, className }: { item: MediaItem; className?: string }) {
  const reduce = useReduce();
  return (
    <motion.div
      initial={reduce ? false : { clipPath: "inset(100% 0 0 0)" }}
      whileInView={{ clipPath: "inset(0% 0 0 0)" }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1.1, ease: EASE }}
      className={`relative overflow-hidden ${className ?? ""}`}
      data-cursor
    >
      <EditableImage
        section={item.section || "gallery"}
        replaceAssetId={item.driveFileId}
        src={item.publicUrl}
        alt={item.caption ?? "Moment"}
        fill
        sizes="(max-width: 640px) 90vw, 45vw"
        className="object-cover"
      />
      {item.caption && (
        <span className="pointer-events-none absolute bottom-3 left-3 text-[10px] uppercase tracking-[0.3em] text-white/80">
          {item.caption}
        </span>
      )}
    </motion.div>
  );
}

/* Panel that stays pinned while the next one slides up over it. */
function Panel({
  id,
  children,
  className,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`sticky top-0 min-h-[100svh] overflow-hidden border-t border-white/10 bg-[#0a0a0c] ${className ?? ""}`}
    >
      {children}
    </section>
  );
}

export const ObsidianTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = useReduce();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || defaults.accentColor;
  const hero = event.heroImageUrl || defaults.heroImage;
  const tagline = event.tagline?.trim() || defaults.tagline;
  const invitationMessage = event.invitationMessage?.trim() || defaults.invitationMessage;
  const aboutStory = event.aboutStory?.trim() || defaults.aboutStory || "";
  const gallery = media.filter((m) => m.section === "gallery");

  const showStory = !event.hideStory;
  const showMoments = !event.hideGallery && (gallery.length > 0 || editing);
  const showEvents = !event.hideEvents && subEvents.length > 0;
  const showVenue = !event.hideVenue;

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroScale = useTransform(heroP, [0, 1], [1, 1.12]);
  const heroOpacity = useTransform(heroP, [0, 0.8], [1, 0.2]);

  const sorted = [...subEvents].sort((a, b) => a.order - b.order);

  return (
    <div
      className="relative overflow-x-clip bg-[#0a0a0c] font-sans text-[#ece7df] antialiased"
      style={{ "--accent": accent } as React.CSSProperties}
    >
      <Grain opacity={0.05} />
      <ScrollProgress color="var(--accent)" />

      {/* ── ACT I — TITLE ── */}
      <Panel id="title" className="border-t-0">
        <div ref={heroRef} className="absolute inset-0">
          <motion.div style={reduce ? undefined : { scale: heroScale, opacity: heroOpacity }} className="absolute inset-0">
            <HeroMedia imageSrc={hero} videoSrc={event.heroVideoUrl || undefined} alt={event.eventTitle} className="opacity-60 grayscale-[30%]" />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/40 to-[#0a0a0c]/70" />
        </div>
        <div className="relative z-10 flex min-h-[100svh] flex-col justify-between px-6 py-16 sm:px-12">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.4em] text-white/50">
            <span>{tagline}</span>
            {event.mainDate && (
              <span>
                {new Date(event.mainDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
              </span>
            )}
          </div>
          <h1 className="font-display text-[clamp(3rem,15vw,13rem)] font-semibold uppercase leading-[0.86] tracking-tight">
            <SlicedTitle text={event.person1Name} className="block" />
            {event.person2Name && (
              <span className="block">
                <span className="text-[0.4em] text-[var(--accent)]">&amp;&nbsp;</span>
                <SlicedTitle text={event.person2Name} className="inline-block" />
              </span>
            )}
          </h1>
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <p className="max-w-sm text-sm leading-relaxed text-white/60">{event.city}</p>
            {!event.hideTimer && event.timerStyle !== "floating" && event.mainDate && (
              <Countdown target={`${event.mainDate}T${event.mainStartTime || "18:00"}:00`} label="" />
            )}
          </div>
        </div>
      </Panel>

      {/* ── ACT II — INVITATION ── */}
      {showStory && (
        <Panel id="invitation" className="flex items-center bg-[#0c0c10]">
          <div className="mx-auto w-full max-w-5xl px-6 py-28">
            <p className="mb-10 text-[10px] uppercase tracking-[0.5em] text-[var(--accent)]">The Invitation</p>
            <WordReveal text={invitationMessage} className="font-display text-[clamp(1.7rem,4.6vw,3.6rem)] leading-[1.12]" />
            {aboutStory && (
              <Reveal delay={0.1} className="mt-12 max-w-xl text-white/55">
                <p className="leading-relaxed">{aboutStory}</p>
              </Reveal>
            )}
          </div>
        </Panel>
      )}

      {/* ── ACT III — MOMENTS (broken editorial grid, clip reveals) ── */}
      {showMoments && (
        <Panel id="moments" className="bg-[#0a0a0c]">
          <div className="mx-auto w-full max-w-6xl px-6 py-28">
            <div className="mb-14 flex items-end justify-between">
              <h2 className="font-display text-4xl sm:text-6xl">Moments</h2>
              <span className="text-[10px] uppercase tracking-[0.4em] text-white/40">
                {String(gallery.length).padStart(2, "0")} frames
              </span>
            </div>
            {gallery.length === 0 && editing ? (
              <div className="relative mx-auto aspect-[4/5] max-w-xs">
                <EditableImage section="gallery" src="" asAddTile alt="" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-12 sm:gap-6">
                {gallery.map((m, i) => {
                  // Broken layout: cycle through asymmetric spans + offsets.
                  const layout = [
                    "sm:col-span-7 aspect-[4/3]",
                    "sm:col-span-5 sm:mt-16 aspect-[3/4]",
                    "sm:col-span-5 aspect-[3/4]",
                    "sm:col-span-7 sm:-mt-10 aspect-[16/10]",
                    "sm:col-span-6 aspect-square",
                    "sm:col-span-6 sm:mt-12 aspect-[4/3]",
                  ][i % 6];
                  return <ClipImage key={`${m.fileName}-${i}`} item={m} className={layout} />;
                })}
              </div>
            )}
          </div>
        </Panel>
      )}

      {/* ── ACT IV — EVENTS (a bronze ledger) ── */}
      {showEvents && (
        <Panel id="events" className="flex items-center bg-[#0c0c10]">
          <div className="mx-auto w-full max-w-5xl px-6 py-28">
            <h2 className="mb-14 font-display text-4xl sm:text-6xl">The Order of the Day</h2>
            <ul>
              {sorted.map((s) => (
                <li key={`${s.eventCode}-${s.order}`} className="group relative border-t border-white/12">
                  <div className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-[var(--accent)]/10 transition-transform duration-500 group-hover:scale-x-100" />
                  <div className="relative flex flex-col gap-2 py-7 sm:flex-row sm:items-baseline sm:gap-8">
                    <span className="font-display text-2xl text-[var(--accent)] sm:w-16">{String(s.order).padStart(2, "0")}</span>
                    <span className="font-display text-2xl sm:text-3xl sm:flex-1">{s.name}</span>
                    <span className="text-sm uppercase tracking-[0.2em] text-white/50 sm:w-48">
                      {[s.date, s.startTime].filter(Boolean).join(" · ")}
                    </span>
                    <span className="text-sm text-white/60 sm:w-56">{s.venueName}</span>
                  </div>
                </li>
              ))}
              <li className="border-t border-white/12" />
            </ul>
          </div>
        </Panel>
      )}

      {/* ── ACT V — VENUE ── */}
      {showVenue && (
        <Panel id="venue" className="flex items-center bg-[#0a0a0c]">
          <div className="mx-auto w-full max-w-4xl px-6 py-28">
            <p className="mb-8 text-[10px] uppercase tracking-[0.5em] text-[var(--accent)]">The Place</p>
            <Reveal className="rounded-[2px] border border-[var(--accent)]/30 bg-white/[0.03] p-3 sm:p-5">
              <MapEmbed
                latitude={event.latitude}
                longitude={event.longitude}
                venueName={event.venueName}
                venueAddress={event.venueAddress}
                mapLink={event.mapLink}
              />
            </Reveal>
          </div>
        </Panel>
      )}

      {/* ── ACT VI — FOREVER ── */}
      <Panel id="forever" className="flex items-center bg-[#0c0c10]">
        <div className="mx-auto w-full max-w-4xl px-6 py-28 text-center">
          <p className="text-[10px] uppercase tracking-[0.5em] text-[var(--accent)]">And Then, Always</p>
          <h2 className="mt-6 font-display text-[clamp(2rem,8vw,6rem)] uppercase leading-[0.9]">
            {event.person1Name}
            {event.person2Name ? <span className="text-[var(--accent)]"> · </span> : ""}
            {event.person2Name}
          </h2>
          {event.rsvpEnabled && (
            <div className="mt-12">
              {event.rsvpLinkOrContact?.startsWith("http") ? (
                <Magnetic className="inline-block">
                  <a
                    href={event.rsvpLinkOrContact}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block border border-[var(--accent)] px-10 py-4 text-sm uppercase tracking-[0.35em] text-[var(--accent)] transition-colors hover:bg-[var(--accent)] hover:text-[#0a0a0c]"
                  >
                    Reply
                  </a>
                </Magnetic>
              ) : (
                <RSVP enabled={event.rsvpEnabled} linkOrContact={event.rsvpLinkOrContact} contactName={event.contactName} />
              )}
            </div>
          )}
          {event.mainDate && (
            <div className="mt-12">
              <AddToCalendar
                title={event.eventTitle}
                date={event.mainDate}
                startTime={event.mainStartTime}
                endTime={event.mainEndTime}
                venueName={event.venueName}
                venueAddress={event.venueAddress}
                description={invitationMessage}
              />
            </div>
          )}
        </div>
      </Panel>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default ObsidianTemplate;
