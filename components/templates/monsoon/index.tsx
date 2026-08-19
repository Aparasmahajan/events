"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { HeroMedia } from "@/components/ui/HeroMedia";
import { MapEmbed } from "@/components/ui/MapEmbed";
import { MusicToggle } from "@/components/ui/MusicToggle";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { useEditMode } from "@/components/edit/EditContext";
import type { TemplateComponent, SubEvent } from "@/lib/types";

/* ── Monsoon Letters · wedding by post ────────────────────────────────────
 * Palette   rain grey #6d7683 · airmail blue #1f4e79 · airmail red #b3352b
 *           aged paper #f2ece0 · sealing wax #7c1f2b
 * Type      Cormorant (letter body) / Inter (utility) / mono (telegram,
 *           postmarks) / Caveat (signatures and captions only)
 * Layout    a stack of overlapping paper objects on wet glass, each arriving
 *           at a slightly different angle.
 * Signature envelopes that open on scroll — the flap lifts on its crease and
 *           the postmark stamps itself with a short ink bloom.
 * ──────────────────────────────────────────────────────────────────────── */

const EASE = [0.16, 1, 0.3, 1] as const;
const GLASS = "#2f3944";
const GREY = "#6d7683";
const BLUE = "#1f4e79";
const RED = "#b3352b";
const PAPER = "#f2ece0";
const WAX = "#7c1f2b";

const DROPS = Array.from({ length: 34 }, (_, i) => ({
  left: `${(i * 29 + 5) % 100}%`,
  delay: (i % 11) * 0.42,
  dur: 1.5 + (i % 6) * 0.32,
  len: 40 + (i % 5) * 26,
  op: 0.18 + (i % 4) * 0.09,
}));

/** Rain running down the window. */
function Rain({ reduce }: { reduce: boolean }) {
  if (reduce) return null;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {DROPS.map((d, i) => (
        <motion.span
          key={i}
          className="absolute w-px"
          style={{
            left: d.left,
            height: d.len,
            background: `linear-gradient(180deg, transparent, rgba(255,255,255,${d.op}))`,
          }}
          initial={{ y: "-20%" }}
          animate={{ y: "120vh" }}
          transition={{ duration: d.dur, delay: d.delay, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  );
}

/** Airmail stripe border — the red/blue chevrons on an aerogramme. */
function AirmailEdge({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`block h-2 w-full ${className ?? ""}`}
      style={{
        background: `repeating-linear-gradient(115deg, ${RED} 0 10px, ${PAPER} 10px 20px, ${BLUE} 20px 30px, ${PAPER} 30px 40px)`,
      }}
    />
  );
}

/** A postmark that stamps itself into place. */
function Postmark({ text, reduce, className }: { text: string; reduce: boolean; className?: string }) {
  return (
    <motion.div
      aria-hidden
      initial={reduce ? false : { scale: 1.35, opacity: 0, rotate: -18 }}
      whileInView={{ scale: 1, opacity: 0.72, rotate: -11 }}
      viewport={{ once: true }}
      transition={{ duration: 0.42, ease: "backOut" }}
      className={`pointer-events-none select-none ${className ?? ""}`}
    >
      <svg viewBox="0 0 120 120" className="h-24 w-24">
        <circle cx="60" cy="60" r="52" fill="none" stroke={BLUE} strokeWidth="2.5" strokeDasharray="5 4" />
        <circle cx="60" cy="60" r="42" fill="none" stroke={BLUE} strokeWidth="1.2" />
        <text
          x="60"
          y="52"
          textAnchor="middle"
          fill={BLUE}
          className="font-mono"
          fontSize="12"
          letterSpacing="1.5"
        >
          {text.slice(0, 9).toUpperCase()}
        </text>
        <line x1="22" y1="60" x2="98" y2="60" stroke={BLUE} strokeWidth="1.2" />
        <text x="60" y="78" textAnchor="middle" fill={BLUE} className="font-mono" fontSize="10" letterSpacing="2">
          POSTED
        </text>
      </svg>
    </motion.div>
  );
}

/** SIGNATURE — an envelope whose flap lifts and letter rises, on scroll. */
function OpeningEnvelope({
  children,
  reduce,
  label,
}: {
  children: React.ReactNode;
  reduce: boolean;
  label: string;
}) {
  return (
    <div className="relative mx-auto max-w-2xl" style={{ perspective: 1200 }}>
      {/* the envelope body */}
      <div
        className="relative px-6 pb-8 pt-14 sm:px-10"
        style={{ background: PAPER, boxShadow: `0 30px 60px -34px rgba(0,0,0,0.7)` }}
      >
        {/* the flap, hinged along its top crease */}
        <motion.div
          aria-hidden
          className="absolute inset-x-0 top-0 origin-top"
          initial={reduce ? false : { rotateX: 0 }}
          whileInView={{ rotateX: -168 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 1.3, ease: EASE }}
          style={{ transformStyle: "preserve-3d", height: 90 }}
        >
          <svg viewBox="0 0 400 90" preserveAspectRatio="none" className="h-full w-full">
            <polygon points="0,0 400,0 200,88" fill="#e6dcc9" />
            <polyline points="0,0 200,88 400,0" fill="none" stroke={GREY} strokeWidth="1" opacity="0.5" />
          </svg>
          <span
            className="absolute left-1/2 top-[52px] h-7 w-7 -translate-x-1/2 rounded-full"
            style={{ background: WAX, boxShadow: `inset 0 -2px 4px rgba(0,0,0,0.35)` }}
          />
        </motion.div>

        <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.32em]" style={{ color: GREY }}>
          {label}
        </p>
        <motion.div
          initial={reduce ? false : { y: 26, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 1, delay: 0.45, ease: EASE }}
        >
          {children}
        </motion.div>
      </div>
      <AirmailEdge />
    </div>
  );
}

/** Sub-events as a rack of postcards. */
function PostcardRack({ items, accent, reduce }: { items: SubEvent[]; accent: string; reduce: boolean }) {
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <ol className="grid gap-8 sm:grid-cols-2">
      {sorted.map((s, i) => (
        <motion.li
          key={`${s.order}-${s.name}`}
          initial={reduce ? false : { opacity: 0, y: 26, rotate: 0 }}
          whileInView={{ opacity: 1, y: 0, rotate: i % 2 ? 1.1 : -1.3 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.7, delay: (i % 4) * 0.07, ease: EASE }}
          className="relative"
          style={{ background: PAPER, boxShadow: "0 20px 40px -28px rgba(0,0,0,0.75)" }}
        >
          <AirmailEdge />
          <div className="grid grid-cols-[1fr,auto] gap-4 p-6">
            <div className="min-w-0">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: GREY }}>
                {[s.date, s.startTime].filter(Boolean).join(" · ")}
              </p>
              <h3 className="mt-2 font-serif text-2xl leading-tight" style={{ color: BLUE }}>
                {s.name}
              </h3>
              {s.venueName && (
                <p className="mt-1 font-hand text-lg" style={{ color: WAX }}>
                  {s.venueName}
                </p>
              )}
              {s.description && (
                <p className="mt-3 font-serif text-base leading-relaxed" style={{ color: "#3c3833" }}>
                  {s.description}
                </p>
              )}
              {s.dressCode && (
                <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: accent }}>
                  {s.dressCode}
                </p>
              )}
            </div>
            {/* the stamp */}
            <div
              className="flex h-16 w-12 shrink-0 flex-col items-center justify-center border text-center"
              style={{ borderColor: `${GREY}88`, borderStyle: "dashed", background: "#fff" }}
            >
              <span className="text-lg">{s.icon || "✉"}</span>
              <span className="font-mono text-[8px]" style={{ color: GREY }}>
                {String(s.order).padStart(2, "0")}
              </span>
            </div>
          </div>
        </motion.li>
      ))}
    </ol>
  );
}

export const MonsoonTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || BLUE;
  const tagline = event.tagline?.trim() || "Eight years of letters";
  const invitation =
    event.invitationMessage?.trim() ||
    "This is the last letter we send as two addresses. Come stand in the rain with us and watch it become one.";
  const story =
    event.aboutStory?.trim() ||
    "Two cities, one post office each, and a habit neither of us could break. Everything worth saying, we said on paper first.";
  const hero = event.heroImageUrl || "/samples/wedding-flowers.jpg";

  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const names = [event.person1Name, event.person2Name].filter(Boolean).join(" & ");

  const showStory = !event.hideStory;
  const showRack = !event.hideEvents && subEvents.length > 0;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);
  const showVenue = !event.hideVenue;

  const dateLine = event.mainDate
    ? new Date(event.mainDate).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })
    : "";

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-sans antialiased"
      style={{ "--accent": accent, background: GLASS, color: "#3c3833" } as React.CSSProperties}
    >
      <ScrollProgress color={accent} />

      {/* ── Hero: the window, the rain, the sealed envelope ─────────── */}
      <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden pb-24 sm:pb-28">
        <div className="absolute inset-0">
          <HeroMedia
            imageSrc={hero}
            videoSrc={event.heroVideoUrl || undefined}
            alt={event.eventTitle}
            className="opacity-40 blur-[2px]"
          />
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(180deg, ${GLASS}d9 0%, ${GLASS}a6 45%, ${GLASS}f2 100%)` }}
          />
        </div>
        <Rain reduce={reduce} />

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 30, rotate: -3 }}
          animate={{ opacity: 1, y: 0, rotate: -1.5 }}
          transition={{ duration: 1.1, delay: 0.25, ease: EASE }}
          className="relative z-10 mx-6 w-full max-w-xl"
          style={{ background: PAPER, boxShadow: "0 40px 80px -40px rgba(0,0,0,0.9)" }}
        >
          <AirmailEdge />
          <div className="px-7 py-10 text-center sm:px-12 sm:py-14">
            <p className="font-mono text-[10px] uppercase tracking-[0.34em]" style={{ color: GREY }}>
              {tagline}
            </p>
            <h1 className="mt-6 font-serif text-[clamp(2.4rem,8vw,4.6rem)] leading-[1.05]" style={{ color: BLUE }}>
              {names || event.eventTitle}
            </h1>
            <div aria-hidden className="mx-auto my-7 h-px w-24" style={{ background: `${GREY}66` }} />
            {dateLine && (
              <p className="font-mono text-[11px] uppercase tracking-[0.28em]" style={{ color: WAX }}>
                {dateLine}
                {event.city ? ` · ${event.city}` : ""}
              </p>
            )}
            <p className="mt-6 font-hand text-2xl" style={{ color: GREY }}>
              by hand, by post, by monsoon
            </p>
          </div>
          <AirmailEdge />
          <span
            aria-hidden
            className="absolute -bottom-5 left-1/2 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full font-serif text-sm text-white"
            style={{ background: WAX, boxShadow: "inset 0 -3px 6px rgba(0,0,0,0.4)" }}
          >
            {(event.person1Name?.[0] || "") + (event.person2Name?.[0] || "")}
          </span>
        </motion.div>
      </section>

      {/* ── The telegram ────────────────────────────────────────────── */}
      <section className="relative px-6 py-20 sm:py-24">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mx-auto max-w-2xl p-7 sm:p-10"
          style={{ background: "#e8e2d3", boxShadow: "0 24px 50px -34px rgba(0,0,0,0.8)" }}
        >
          <div className="mb-5 flex items-center justify-between border-b pb-3" style={{ borderColor: `${GREY}55` }}>
            <p className="font-mono text-[10px] tracking-[0.28em]" style={{ color: GREY }}>
              TELEGRAM · {(event.city || "INDIA").toUpperCase()}
            </p>
            <p className="font-mono text-[10px] tracking-[0.28em]" style={{ color: RED }}>
              URGENT
            </p>
          </div>
          <p
            className="font-mono text-sm uppercase leading-[2] tracking-[0.12em] sm:text-base"
            style={{ color: BLUE }}
          >
            {invitation}
          </p>
          <p className="mt-6 text-right font-hand text-2xl" style={{ color: WAX }}>
            — {names || event.eventTitle}
          </p>
        </motion.div>
      </section>

      {/* ── The letter, unfolding ───────────────────────────────────── */}
      {showStory && (
        <section className="relative px-6 py-16 sm:py-20">
          <OpeningEnvelope reduce={reduce} label="Enclosed · our side of it">
            <p className="font-serif text-lg leading-loose sm:text-xl" style={{ color: "#3c3833" }}>
              {story}
            </p>
            <p className="mt-6 font-hand text-2xl" style={{ color: BLUE }}>
              See you when the rain does.
            </p>
          </OpeningEnvelope>
        </section>
      )}

      {/* ── The postcards ───────────────────────────────────────────── */}
      {showRack && (
        <section className="relative mx-auto max-w-5xl px-6 py-16 sm:py-20">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.32em]" style={{ color: `${PAPER}99` }}>
                Enclosures
              </p>
              <h2 className="mt-2 font-serif text-3xl" style={{ color: PAPER }}>
                Every card in the envelope
              </h2>
            </div>
            <Postmark text={event.city || "posted"} reduce={reduce} className="hidden sm:block" />
          </div>
          <PostcardRack items={subEvents} accent={accent} reduce={reduce} />
        </section>
      )}

      {/* ── Photo enclosures ───────────────────────────────────────── */}
      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <h2 className="mb-9 font-serif text-3xl" style={{ color: PAPER }}>
            Photographs, enclosed
          </h2>
          {galleryItems.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {galleryItems.map((m, i) => (
                <motion.figure
                  key={`${m.fileName}-${i}`}
                  initial={reduce ? false : { opacity: 0, y: 24, rotate: 0 }}
                  whileInView={{ opacity: 1, y: 0, rotate: i % 3 === 1 ? 1.6 : -1.2 }}
                  viewport={{ once: true, margin: "-8% 0px" }}
                  transition={{ duration: 0.7, delay: (i % 3) * 0.09, ease: EASE }}
                  className="relative p-3 pb-10"
                  style={{ background: PAPER, boxShadow: "0 22px 44px -30px rgba(0,0,0,0.8)" }}
                >
                  {/* paper corner mounts */}
                  {[
                    "left-2 top-2 rotate-45",
                    "right-2 top-2 -rotate-45",
                    "left-2 bottom-9 -rotate-45",
                    "right-2 bottom-9 rotate-45",
                  ].map((pos) => (
                    <span
                      key={pos}
                      aria-hidden
                      className={`absolute h-4 w-4 ${pos}`}
                      style={{ background: `${GREY}55` }}
                    />
                  ))}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={m.publicUrl}
                    alt={m.caption ?? ""}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <figcaption className="absolute bottom-2 left-0 right-0 px-3 text-center font-hand text-lg" style={{ color: GREY }}>
                    {m.caption || "unlabelled"}
                  </figcaption>
                </motion.figure>
              ))}
            </div>
          ) : (
            <div
              className="flex h-44 items-center justify-center border border-dashed font-mono text-xs tracking-[0.2em]"
              style={{ borderColor: `${PAPER}55`, color: `${PAPER}99` }}
            >
              + ENCLOSE SOME PHOTOGRAPHS
            </div>
          )}
        </section>
      )}

      {/* ── The address card ───────────────────────────────────────── */}
      {showVenue && (
        <section className="relative mx-auto max-w-4xl px-6 py-16 sm:py-20">
          <div className="relative" style={{ background: PAPER, boxShadow: "0 26px 54px -34px rgba(0,0,0,0.8)" }}>
            <AirmailEdge />
            <div className="grid gap-6 p-7 sm:grid-cols-[1fr,auto] sm:p-10">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: GREY }}>
                  Deliver to
                </p>
                <h2 className="mt-3 font-serif text-3xl" style={{ color: BLUE }}>
                  {event.venueName || "The venue"}
                </h2>
                {event.venueAddress && (
                  <p className="mt-2 font-mono text-xs leading-relaxed" style={{ color: "#4a453f" }}>
                    {event.venueAddress}
                  </p>
                )}
              </div>
              <Postmark text={dateLine.slice(0, 9) || "posted"} reduce={reduce} />
            </div>
            <div className="px-3 pb-3">
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

      {/* ── The wax-sealed reply ───────────────────────────────────── */}
      <section className="relative px-6 py-20 text-center sm:py-28">
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          className="relative mx-auto max-w-lg px-8 py-12"
          style={{ background: PAPER, boxShadow: "0 30px 60px -38px rgba(0,0,0,0.85)" }}
        >
          <span
            aria-hidden
            className="absolute -top-6 left-1/2 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full font-serif text-white"
            style={{ background: WAX, boxShadow: "inset 0 -3px 6px rgba(0,0,0,0.4)" }}
          >
            R
          </span>
          <p className="font-mono text-[10px] uppercase tracking-[0.32em]" style={{ color: GREY }}>
            Reply requested
          </p>
          <h2 className="mt-4 font-serif text-3xl leading-snug" style={{ color: BLUE }}>
            {event.eventTitle}
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
              className="mt-8 inline-block px-10 py-3.5 font-mono text-[11px] uppercase tracking-[0.28em] text-white transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
              style={{ background: BLUE, outlineColor: WAX }}
            >
              Write back
            </a>
          )}
          {(event.contactName || event.contactPhone) && (
            <p className="mt-6 font-hand text-xl" style={{ color: GREY }}>
              {[event.contactName, event.contactPhone].filter(Boolean).join(" · ")}
            </p>
          )}
        </motion.div>
      </section>

      <footer className="relative">
        <AirmailEdge />
        <p className="py-7 text-center font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: `${PAPER}88` }}>
          {event.eventTitle}
          {names ? ` · ${names}` : ""}
        </p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default MonsoonTemplate;
