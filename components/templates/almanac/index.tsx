"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { HeroMedia } from "@/components/ui/HeroMedia";
import { MapEmbed } from "@/components/ui/MapEmbed";
import { MusicToggle } from "@/components/ui/MusicToggle";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { useEditMode } from "@/components/edit/EditContext";
import type { TemplateComponent, SubEvent, MediaItem } from "@/lib/types";

/* ── Almanac · milestone broadsheet ───────────────────────────────────────
 * Palette   newsprint #eae5da · press black #1b1b1b · ink blue #24405e
 *           stamp red #a3241f · halftone grey #8d8b85
 * Type      Playfair (masthead, headlines) / Cormorant (column copy) /
 *           tracked condensed caps (kickers, captions)
 * Layout    a real multi-column grid with vertical rules, one dominant
 *           headline per spread, captions directly under their photo.
 * Signature halftone printing — photographs carry a dot screen and headlines
 *           set themselves word by word, the way a page is composed.
 * ──────────────────────────────────────────────────────────────────────── */

const EASE = [0.16, 1, 0.3, 1] as const;
const NEWS = "#eae5da";
const PRESS = "#1b1b1b";
const INKBLUE = "#24405e";
const STAMP = "#a3241f";
const HALFTONE = "#8d8b85";

const DOTS = `radial-gradient(${PRESS}55 1px, transparent 1.4px)`;

/** A headline that composes itself, word by word. */
function Headline({
  text,
  className,
  reduce,
  style,
}: {
  text: string;
  className?: string;
  reduce: boolean;
  style?: React.CSSProperties;
}) {
  const words = text.split(" ");
  return (
    <h2 className={className} style={style}>
      {words.map((w, i) => (
        <motion.span
          key={`${w}-${i}`}
          initial={reduce ? false : { opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: Math.min(i * 0.05, 1.2), ease: EASE }}
          className="inline-block"
        >
          {w}
          {i < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </h2>
  );
}

/** A printed photograph — dot screen over the image. */
function Halftone({
  item,
  ratio = "aspect-[4/3]",
}: {
  item: MediaItem;
  ratio?: string;
}) {
  return (
    <figure>
      <div className={`relative w-full overflow-hidden ${ratio}`} style={{ background: HALFTONE }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.publicUrl}
          alt={item.caption ?? ""}
          loading="lazy"
          className="h-full w-full object-cover grayscale contrast-[1.15]"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 mix-blend-multiply"
          style={{ backgroundImage: DOTS, backgroundSize: "3px 3px", opacity: 0.55 }}
        />
      </div>
      {item.caption && (
        <figcaption
          className="mt-2 border-b pb-2 font-sans text-[11px] italic"
          style={{ color: `${PRESS}b0`, borderColor: `${PRESS}33` }}
        >
          {item.caption}
        </figcaption>
      )}
    </figure>
  );
}

function Rule({ thick }: { thick?: boolean }) {
  return <div aria-hidden className="w-full" style={{ height: thick ? 4 : 1, background: PRESS, opacity: thick ? 1 : 0.4 }} />;
}

function Kicker({ children, color = STAMP }: { children: React.ReactNode; color?: string }) {
  return (
    <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.32em]" style={{ color }}>
      {children}
    </p>
  );
}

/** Sub-events, set as a printed public notice. */
function ScheduleNotice({ items, reduce }: { items: SubEvent[]; reduce: boolean }) {
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <div
      className="p-6 sm:p-8"
      style={{ border: `3px double ${PRESS}`, background: "rgba(255,255,255,0.45)" }}
    >
      <div className="mb-5 text-center">
        <Kicker color={INKBLUE}>Public notice</Kicker>
        <h3 className="mt-2 font-display text-2xl" style={{ color: PRESS }}>
          Order of the day
        </h3>
      </div>
      <ol className="divide-y" style={{ borderColor: `${PRESS}33` }}>
        {sorted.map((s, i) => (
          <motion.li
            key={`${s.order}-${s.name}`}
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: (i % 5) * 0.06 }}
            className="grid gap-1 border-t py-4 sm:grid-cols-[8rem,1fr,auto] sm:gap-6"
            style={{ borderColor: `${PRESS}33` }}
          >
            <p className="font-sans text-[11px] uppercase tracking-[0.24em]" style={{ color: INKBLUE }}>
              {[s.startTime, s.endTime].filter(Boolean).join("–") || s.date}
            </p>
            <div>
              <h4 className="font-display text-xl" style={{ color: PRESS }}>
                {s.icon ? `${s.icon} ` : ""}
                {s.name}
              </h4>
              {s.description && (
                <p className="mt-1 font-serif text-base leading-relaxed" style={{ color: `${PRESS}c0` }}>
                  {s.description}
                </p>
              )}
            </div>
            <p className="font-serif text-base italic sm:text-right" style={{ color: `${PRESS}a8` }}>
              {[s.venueName, s.dressCode].filter(Boolean).join(" · ")}
            </p>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

export const AlmanacTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || INKBLUE;
  const tagline = event.tagline?.trim() || "Sixty years, one edition";
  const invitation =
    event.invitationMessage?.trim() ||
    "The family is throwing a lunch, and the guest of honour has been told it is a quiet one. Please arrive before he does.";
  const story =
    event.aboutStory?.trim() ||
    "He has fixed every bicycle on the street, argued with every neighbour about cricket, and never once missed a birthday. This is the paper's tribute.";
  const hero = event.heroImageUrl || "/samples/marble-columns.jpg";

  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const lead = galleryItems[0];
  const decadePhotos = galleryItems.slice(1);

  const showStory = !event.hideStory;
  const showNotice = !event.hideEvents && subEvents.length > 0;
  const showDecades = !event.hideGallery && (decadePhotos.length > 0 || editing);
  const showVenue = !event.hideVenue;

  const ageMatch = event.eventTitle.match(/\d{1,3}/);
  const age = ageMatch ? Number(ageMatch[0]) : null;
  const partyYear = event.mainDate ? new Date(event.mainDate).getFullYear() : new Date().getFullYear();
  const birthYear = age ? partyYear - age : null;

  // Decade headings run from the birth decade forward — one per filed photo.
  const decades = decadePhotos.map((p, i) => ({
    photo: p,
    label: birthYear ? `The ${Math.floor((birthYear + i * 10) / 10) * 10}s` : `Chapter ${i + 1}`,
  }));

  const dateLine = event.mainDate
    ? new Date(event.mainDate).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : "";

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-sans antialiased"
      style={{ "--accent": accent, background: NEWS, color: PRESS } as React.CSSProperties}
    >
      <ScrollProgress color={accent} />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.35]"
        style={{ backgroundImage: DOTS, backgroundSize: "4px 4px" }}
      />

      {/* ── The front page ─────────────────────────────────────────── */}
      <section className="relative z-10 flex min-h-[100svh] flex-col justify-center overflow-hidden px-5 pb-24 pt-10 sm:px-8 sm:pb-28">
        <div className="absolute inset-0">
          <HeroMedia
            imageSrc={hero}
            videoSrc={event.heroVideoUrl || undefined}
            alt={event.eventTitle}
            className="opacity-[0.14] grayscale"
          />
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${NEWS}f2, ${NEWS}d9 45%, ${NEWS}fa)` }} />
        </div>

        <div className="relative mx-auto w-full max-w-5xl">
          {/* masthead */}
          <Rule thick />
          <div className="flex flex-wrap items-baseline justify-between gap-2 py-2">
            <p className="font-sans text-[10px] uppercase tracking-[0.3em]" style={{ color: `${PRESS}b0` }}>
              {birthYear ? `Est. ${birthYear}` : "Special edition"}
            </p>
            <p className="font-sans text-[10px] uppercase tracking-[0.3em]" style={{ color: `${PRESS}b0` }}>
              {event.city || ""}
            </p>
            <p className="font-sans text-[10px] uppercase tracking-[0.3em]" style={{ color: STAMP }}>
              {age ? `Edition No. ${age}` : "Special edition"}
            </p>
          </div>
          <Rule />
          <h1
            className="py-5 text-center font-display text-[clamp(2.2rem,8vw,5.4rem)] uppercase leading-[0.98] tracking-[0.02em]"
            style={{ color: PRESS }}
          >
            {event.eventTitle}
          </h1>
          <Rule />
          <p className="py-2 text-center font-sans text-[10px] uppercase tracking-[0.34em]" style={{ color: INKBLUE }}>
            {[dateLine, event.mainStartTime].filter(Boolean).join(" · ")}
          </p>
          <Rule thick />

          {/* lead */}
          <div className="grid gap-7 pt-7 md:grid-cols-[1.4fr,1fr]">
            <div className="md:border-r md:pr-7" style={{ borderColor: `${PRESS}33` }}>
              <Kicker>{tagline}</Kicker>
              <Headline
                text={invitation}
                reduce={reduce}
                className="mt-4 font-display text-2xl leading-[1.2] sm:text-3xl"
                style={{ color: PRESS }}
              />
            </div>
            {lead ? (
              <Halftone item={lead} ratio="aspect-[4/5]" />
            ) : (
              <div
                className="flex aspect-[4/5] items-center justify-center border border-dashed font-sans text-xs uppercase tracking-[0.22em]"
                style={{ borderColor: `${PRESS}55`, color: `${PRESS}88` }}
              >
                photo not filed
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── The lead story ────────────────────────────────────────── */}
      {showStory && (
        <section className="relative z-10 mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-20">
          <Rule thick />
          <Kicker color={INKBLUE}>The lead story</Kicker>
          <Headline
            text={`A life, filed in ${age ? Math.max(1, Math.round(age / 10)) : 6} decades`}
            reduce={reduce}
            className="mt-3 font-display text-3xl leading-tight sm:text-4xl"
            style={{ color: PRESS }}
          />
          <div className="mt-6 columns-1 gap-8 font-serif text-lg leading-relaxed sm:columns-2" style={{ color: `${PRESS}d0` }}>
            <p className="mb-4">
              <span className="float-left mr-2 font-display text-5xl leading-[0.8]" style={{ color: STAMP }}>
                {story.trim().charAt(0)}
              </span>
              {story.trim().slice(1)}
            </p>
          </div>
        </section>
      )}

      {/* ── The decades ───────────────────────────────────────────── */}
      {showDecades && (
        <section className="relative z-10 mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
          <Rule thick />
          <Kicker color={INKBLUE}>Decade by decade</Kicker>
          {decades.length > 0 ? (
            <div className="mt-7 grid gap-10 sm:grid-cols-2">
              {decades.map(({ photo, label }, i) => (
                <motion.article
                  key={`${photo.fileName}-${i}`}
                  initial={reduce ? false : { opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ duration: 0.6, delay: (i % 2) * 0.08, ease: EASE }}
                  className="sm:border-l sm:pl-7 sm:first:border-l-0 sm:first:pl-0"
                  style={{ borderColor: `${PRESS}33` }}
                >
                  <h3 className="font-display text-2xl" style={{ color: INKBLUE }}>
                    {label}
                  </h3>
                  <div className="mt-3">
                    <Halftone item={photo} />
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <div
              className="mt-7 flex h-40 items-center justify-center border border-dashed font-sans text-xs uppercase tracking-[0.22em]"
              style={{ borderColor: `${PRESS}55`, color: `${PRESS}88` }}
            >
              + file one photo per decade
            </div>
          )}
        </section>
      )}

      {/* ── The notice ───────────────────────────────────────────── */}
      {showNotice && (
        <section className="relative z-10 mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
          <ScheduleNotice items={subEvents} reduce={reduce} />
        </section>
      )}

      {/* ── The classified ───────────────────────────────────────── */}
      {showVenue && (
        <section className="relative z-10 mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
          <Rule thick />
          <div className="grid gap-6 pt-7 sm:grid-cols-[1fr,1.2fr]">
            <div>
              <Kicker>Classified</Kicker>
              <h2 className="mt-3 font-display text-2xl" style={{ color: PRESS }}>
                {event.venueName || "The venue"}
              </h2>
              {event.venueAddress && (
                <p className="mt-2 font-serif text-base" style={{ color: `${PRESS}c0` }}>
                  {event.venueAddress}
                </p>
              )}
              <p className="mt-4 font-sans text-[11px] uppercase tracking-[0.24em]" style={{ color: INKBLUE }}>
                Parking limited · come early
              </p>
            </div>
            <div style={{ border: `1px solid ${PRESS}55` }}>
              <MapEmbed
                latitude={event.latitude}
                longitude={event.longitude}
                venueName={event.venueName}
                venueAddress={event.venueAddress}
                mapLink={event.mapLink}
              />
            </div>
          </div>
        </section>
      )}

      {/* ── Letter to the editor (RSVP) ─────────────────────────── */}
      <section className="relative z-10 mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          className="p-7 text-center sm:p-10"
          style={{ border: `3px double ${PRESS}`, background: "rgba(255,255,255,0.5)" }}
        >
          <Kicker>Letters to the editor</Kicker>
          <h2 className="mt-4 font-display text-3xl" style={{ color: PRESS }}>
            Write in and say you're coming
          </h2>
          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <a
              href={
                event.rsvpLinkOrContact.startsWith("http")
                  ? event.rsvpLinkOrContact
                  : event.rsvpLinkOrContact.includes("@")
                    ? `mailto:${event.rsvpLinkOrContact}`
                    : `tel:${event.rsvpLinkOrContact}`
              }
              target={event.rsvpLinkOrContact.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="mt-7 inline-block px-9 py-3.5 font-sans text-[11px] uppercase tracking-[0.3em] text-white transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
              style={{ background: INKBLUE, outlineColor: STAMP }}
            >
              Reply to the desk
            </a>
          )}
          {(event.contactName || event.contactPhone) && (
            <p className="mt-6 font-serif text-base italic" style={{ color: `${PRESS}a8` }}>
              {[event.contactName, event.contactPhone].filter(Boolean).join(" · ")}
            </p>
          )}
        </motion.div>
      </section>

      <footer className="relative z-10 px-5 sm:px-8">
        <Rule thick />
        <div className="flex flex-wrap items-center justify-between gap-3 py-6">
          <p className="font-sans text-[10px] uppercase tracking-[0.3em]" style={{ color: `${PRESS}99` }}>
            {event.eventTitle}
          </p>
          <p className="font-sans text-[10px] uppercase tracking-[0.3em]" style={{ color: `${PRESS}99` }}>
            {birthYear ? `${birthYear} – ${partyYear}` : ""} · printed with love
          </p>
        </div>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default AlmanacTemplate;
