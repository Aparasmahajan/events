"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { HeroMedia } from "@/components/ui/HeroMedia";
import { MapEmbed } from "@/components/ui/MapEmbed";
import { MusicToggle } from "@/components/ui/MusicToggle";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { useEditMode } from "@/components/edit/EditContext";
import type { TemplateComponent, SubEvent } from "@/lib/types";

/* ── New Game+ · the birthday as a save file ──────────────────────────────
 * Palette   void #0a0d18 · panel #1c2547 · window white #e9eef7
 *           gold #ffd166 · hp green #4ade80
 * Type      Press Start 2P (HUD only, never body) / mono (stats) /
 *           Inter (anything longer than a line)
 * Layout    RPG menu furniture — every section is a bordered window on a dark
 *           field, corners squared, nothing rounded.
 * Signature the dialogue box: the invitation types itself out one character at
 *           a time, with the little blinking advance arrow at the end.
 * ──────────────────────────────────────────────────────────────────────── */

const EASE = [0.16, 1, 0.3, 1] as const;
const VOID = "#0a0d18";
const PANEL = "#1c2547";
const WINDOW = "#e9eef7";
const GOLD = "#ffd166";
const HP = "#4ade80";

/** A bordered RPG window. */
function Win({
  children,
  className,
  title,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <div
      className={`relative ${className ?? ""}`}
      style={{
        background: `linear-gradient(180deg, ${PANEL}, #141b36)`,
        border: `3px solid ${WINDOW}`,
        boxShadow: `inset 0 0 0 3px ${PANEL}, 0 0 0 3px ${VOID}, 0 18px 40px -28px #000`,
      }}
    >
      {title && (
        <p
          className="absolute -top-3 left-4 px-2 font-pixel text-[9px] uppercase"
          style={{ background: VOID, color: GOLD }}
        >
          {title}
        </p>
      )}
      {children}
    </div>
  );
}

/** SIGNATURE — text that types itself, character by character. */
function Typed({
  text,
  className,
  reduce,
  charDelay = 0.012,
}: {
  text: string;
  className?: string;
  reduce: boolean;
  charDelay?: number;
}) {
  if (reduce) return <p className={className}>{text}</p>;
  return (
    <p className={className} aria-label={text}>
      {text.split("").map((ch, i) => (
        <motion.span
          key={`${ch}-${i}`}
          aria-hidden
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.01, delay: Math.min(i * charDelay, 3) }}
        >
          {ch}
        </motion.span>
      ))}
      <motion.span
        aria-hidden
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.7, repeat: Infinity, repeatType: "reverse" }}
        className="ml-1 inline-block"
        style={{ color: GOLD }}
      >
        ▼
      </motion.span>
    </p>
  );
}

/** A stat bar. */
function Bar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-10 shrink-0 font-pixel text-[8px]" style={{ color: WINDOW }}>
        {label}
      </span>
      <span className="h-3 flex-1" style={{ background: "#0c122a", border: `2px solid ${WINDOW}` }}>
        <span className="block h-full" style={{ width: `${Math.max(4, Math.min(value, 100))}%`, background: color }} />
      </span>
      <span className="w-10 shrink-0 text-right font-mono text-[11px]" style={{ color: `${WINDOW}aa` }}>
        {Math.round(value)}%
      </span>
    </div>
  );
}

/** Sub-events as the quest log. */
function QuestLog({ items, reduce }: { items: SubEvent[]; reduce: boolean }) {
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <ol className="space-y-3">
      {sorted.map((s, i) => (
        <motion.li
          key={`${s.order}-${s.name}`}
          initial={reduce ? false : { opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.5, delay: (i % 5) * 0.06, ease: EASE }}
        >
          <div className="flex gap-3 p-4" style={{ background: "#101733", border: `2px solid ${WINDOW}44` }}>
            <span className="mt-0.5 shrink-0 font-pixel text-[10px]" style={{ color: GOLD }}>
              {i === 0 ? "▶" : "□"}
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="font-pixel text-[11px] leading-relaxed sm:text-xs" style={{ color: WINDOW }}>
                {s.name.toUpperCase()}
              </h3>
              <p className="mt-2 font-mono text-[11px]" style={{ color: GOLD }}>
                {[s.date, [s.startTime, s.endTime].filter(Boolean).join("–")].filter(Boolean).join(" · ")}
                {s.venueName ? ` · ${s.venueName}` : ""}
              </p>
              {s.description && (
                <p className="mt-2 font-sans text-sm leading-relaxed" style={{ color: `${WINDOW}bb` }}>
                  {s.description}
                </p>
              )}
              {s.dressCode && (
                <p className="mt-2 font-mono text-[10px] uppercase" style={{ color: HP }}>
                  equip: {s.dressCode}
                </p>
              )}
            </div>
            {s.icon && <span className="shrink-0 text-lg">{s.icon}</span>}
          </div>
        </motion.li>
      ))}
    </ol>
  );
}

export const NewgameTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || GOLD;
  const tagline = event.tagline?.trim() || "Continue?";
  const invitation =
    event.invitationMessage?.trim() ||
    "A new save file has appeared. Bring snacks, bring a controller, and do not talk during the cutscenes.";
  const story =
    event.aboutStory?.trim() ||
    "Level nineteen. Still has not finished the tutorial. Party members welcome.";
  const hero = event.heroImageUrl || "/samples/confetti.jpg";

  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);

  const showStory = !event.hideStory;
  const showQuests = !event.hideEvents && subEvents.length > 0;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);
  const showVenue = !event.hideVenue;

  const ageMatch = event.eventTitle.match(/\d{1,3}/);
  const age = ageMatch?.[0] ?? "1";
  const dateLine = event.mainDate
    ? new Date(event.mainDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase()
    : "";

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-sans antialiased"
      style={{ "--accent": accent, background: VOID, color: WINDOW } as React.CSSProperties}
    >
      <ScrollProgress color={accent} />
      {/* scanline field */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-20 opacity-[0.16]"
        style={{ background: `repeating-linear-gradient(180deg, transparent 0 2px, #000 2px 3px)` }}
      />

      {/* ── Hero: the file-select screen ───────────────────────────── */}
      <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-4 pb-24 sm:px-6 sm:pb-28">
        <div className="absolute inset-0">
          <HeroMedia
            imageSrc={hero}
            videoSrc={event.heroVideoUrl || undefined}
            alt={event.eventTitle}
            className="opacity-25"
          />
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${VOID}e6, #101733b8 45%, ${VOID}f5)` }} />
        </div>

        <div className="relative z-10 w-full max-w-2xl">
          <p className="mb-5 text-center font-pixel text-[10px]" style={{ color: GOLD }}>
            {tagline.toUpperCase()}
          </p>
          <Win title="save file 01" className="p-6 sm:p-8">
            <motion.h1
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
              className="font-pixel text-[clamp(0.9rem,4.2vw,1.7rem)] leading-relaxed"
              style={{ color: WINDOW }}
            >
              {(event.person1Name || event.eventTitle).toUpperCase()}
            </motion.h1>
            <p className="mt-4 font-pixel text-[10px]" style={{ color: GOLD }}>
              LV {age}
            </p>
            <div className="mt-6 space-y-2.5">
              <Bar label="HP" value={92} color={HP} />
              <Bar label="MP" value={64} color="#60a5fa" />
              <Bar label="EXP" value={Math.min(Number(age) * 4, 96)} color={GOLD} />
            </div>
            <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2 font-mono text-[11px]" style={{ color: `${WINDOW}bb` }}>
              <div className="flex justify-between gap-3">
                <dt>DATE</dt>
                <dd style={{ color: WINDOW }}>{dateLine || "TBA"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>START</dt>
                <dd style={{ color: WINDOW }}>{event.mainStartTime || "TBA"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>WORLD</dt>
                <dd style={{ color: WINDOW }}>{event.city || "—"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>PARTY</dt>
                <dd style={{ color: WINDOW }}>{subEvents.length || 0} quests</dd>
              </div>
            </dl>
          </Win>
          <motion.p
            animate={reduce ? undefined : { opacity: [1, 0.35, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="mt-6 text-center font-pixel text-[10px]"
            style={{ color: WINDOW }}
          >
            ▶ PRESS START
          </motion.p>
        </div>
      </section>

      {/* ── The dialogue box (story) ─────────────────────────────── */}
      {showStory && (
        <section className="relative z-10 mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
          <Win title="dialogue" className="p-6 sm:p-8">
            <Typed
              text={invitation}
              reduce={reduce}
              className="font-mono text-sm leading-relaxed sm:text-base"
            />
            <p className="mt-6 font-sans text-sm leading-relaxed" style={{ color: `${WINDOW}bb` }}>
              {story}
            </p>
          </Win>
        </section>
      )}

      {/* ── The quest log ────────────────────────────────────────── */}
      {showQuests && (
        <section className="relative z-10 mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          <Win title="quest log" className="p-5 sm:p-7">
            <QuestLog items={subEvents} reduce={reduce} />
          </Win>
        </section>
      )}

      {/* ── Inventory (gallery) ─────────────────────────────────── */}
      {showGallery && (
        <section className="relative z-10 mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
          <Win title="inventory" className="p-5 sm:p-7">
            {galleryItems.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {galleryItems.map((m, i) => (
                  <motion.figure
                    key={`${m.fileName}-${i}`}
                    initial={reduce ? false : { opacity: 0, scale: 0.94 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-8% 0px" }}
                    transition={{ duration: 0.5, delay: (i % 4) * 0.06, ease: EASE }}
                    className="p-1.5"
                    style={{ background: "#101733", border: `2px solid ${WINDOW}44` }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={m.publicUrl}
                      alt={m.caption ?? ""}
                      loading="lazy"
                      className="aspect-square w-full object-cover"
                      style={{ imageRendering: "auto" }}
                    />
                    <figcaption className="pt-2 font-mono text-[10px] leading-tight" style={{ color: GOLD }}>
                      {m.caption || `item ${String(i + 1).padStart(2, "0")}`}
                    </figcaption>
                  </motion.figure>
                ))}
              </div>
            ) : (
              <p className="py-10 text-center font-pixel text-[10px]" style={{ color: `${WINDOW}88` }}>
                INVENTORY EMPTY
              </p>
            )}
          </Win>
        </section>
      )}

      {/* ── World map (venue) ──────────────────────────────────── */}
      {showVenue && (
        <section className="relative z-10 mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
          <Win title="world map" className="p-5 sm:p-7">
            <h2 className="font-pixel text-[11px] leading-relaxed sm:text-xs" style={{ color: WINDOW }}>
              {(event.venueName || "UNKNOWN REGION").toUpperCase()}
            </h2>
            {event.venueAddress && (
              <p className="mt-3 font-mono text-[11px]" style={{ color: `${WINDOW}bb` }}>
                {event.venueAddress}
              </p>
            )}
            <div className="mt-5" style={{ border: `2px solid ${WINDOW}66` }}>
              <MapEmbed
                latitude={event.latitude}
                longitude={event.longitude}
                venueName={event.venueName}
                venueAddress={event.venueAddress}
                mapLink={event.mapLink}
              />
            </div>
          </Win>
        </section>
      )}

      {/* ── Join party (RSVP) ─────────────────────────────────── */}
      <section className="relative z-10 mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 sm:py-24">
        <Win title="join party" className="px-6 py-10 sm:px-10">
          <h2 className="font-pixel text-[11px] leading-relaxed sm:text-sm" style={{ color: WINDOW }}>
            JOIN THE PARTY?
          </h2>
          <p className="mt-4 font-mono text-sm" style={{ color: GOLD }}>
            {event.eventTitle}
          </p>
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
              className="mt-8 inline-block px-8 py-3.5 font-pixel text-[10px] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
              style={{ background: GOLD, color: VOID, outlineColor: WINDOW }}
            >
              ▶ YES
            </a>
          )}
          {(event.contactName || event.contactPhone) && (
            <p className="mt-6 font-mono text-[11px]" style={{ color: `${WINDOW}99` }}>
              {[event.contactName, event.contactPhone].filter(Boolean).join(" · ")}
            </p>
          )}
        </Win>
      </section>

      <footer className="relative z-10 border-t px-4 sm:px-6" style={{ borderColor: `${WINDOW}22` }}>
        <div className="flex flex-wrap items-center justify-between gap-3 py-6">
          <p className="font-pixel text-[9px]" style={{ color: `${WINDOW}aa` }}>
            {(event.eventTitle || "").toUpperCase()}
          </p>
          <p className="font-mono text-[10px]" style={{ color: GOLD }}>
            SAVED · {dateLine || "—"}
          </p>
        </div>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default NewgameTemplate;
