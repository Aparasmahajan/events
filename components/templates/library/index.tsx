"use client";

import { useMemo, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { HeroMedia } from "@/components/ui/HeroMedia";
import { MapEmbed } from "@/components/ui/MapEmbed";
import { MusicToggle } from "@/components/ui/MusicToggle";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { useEditMode } from "@/components/edit/EditContext";
import type { TemplateComponent, SubEvent } from "@/lib/types";

const EASE = [0.16, 1, 0.3, 1] as const;

const SPINE_PALETTE = [
  "#5e2320",
  "#3a2418",
  "#7a3a1a",
  "#2f1a10",
  "#8a5a2a",
  "#4a1e18",
  "#6a2a20",
  "#3d2818",
];

const BUTTERFLIES = [
  { top: "12%", left: "8%", delay: 0, dur: 7, amp: 24 },
  { top: "34%", left: "82%", delay: 1.4, dur: 9, amp: 32 },
  { top: "62%", left: "18%", delay: 2.6, dur: 8, amp: 20 },
  { top: "78%", left: "70%", delay: 0.6, dur: 10, amp: 28 },
];

const ROMAN = [
  "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X",
  "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX",
];

function toRoman(n: number): string {
  if (n <= 20 && n >= 0) return ROMAN[n] || String(n);
  return String(n);
}

function LibraryField() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #1a1006 0%, #2a1a0e 60%, #1a1006 100%)" }} />
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          background: "radial-gradient(ellipse at 20% 30%, rgba(232,154,90,0.35), transparent 55%), radial-gradient(ellipse at 80% 70%, rgba(200,164,96,0.25), transparent 60%)",
        }}
      />
      <svg className="absolute inset-0 h-full w-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
        <filter id="library-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" />
        </filter>
        <rect width="100%" height="100%" filter="url(#library-noise)" />
      </svg>
    </div>
  );
}

function Butterfly({ top, left, delay, dur, amp, reduce, color }: { top: string; left: string; delay: number; dur: number; amp: number; reduce: boolean; color: string }) {
  if (reduce) return null;
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute"
      style={{ top, left }}
      animate={{ x: [0, amp, -amp, 0], y: [0, -amp * 0.7, amp * 0.5, 0] }}
      transition={{ duration: dur, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      <motion.svg
        width="22"
        height="18"
        viewBox="0 0 22 18"
        animate={{ scaleX: [1, 0.4, 1] }}
        transition={{ duration: 0.35, repeat: Infinity, ease: "easeInOut" }}
      >
        <path d="M11 9 L2 2 L4 10 L11 9 Z" fill={color} opacity="0.85" />
        <path d="M11 9 L20 2 L18 10 L11 9 Z" fill={color} opacity="0.85" />
        <path d="M11 9 L3 15 L6 12 L11 9 Z" fill={color} opacity="0.6" />
        <path d="M11 9 L19 15 L16 12 L11 9 Z" fill={color} opacity="0.6" />
        <line x1="11" y1="4" x2="11" y2="14" stroke={color} strokeWidth="0.6" />
      </motion.svg>
    </motion.div>
  );
}

function Flourish({ color }: { color: string }) {
  return (
    <svg width="120" height="14" viewBox="0 0 120 14" className="mx-auto opacity-60" aria-hidden>
      <path d="M2 7 Q30 -2 60 7 T118 7" stroke={color} strokeWidth="0.8" fill="none" />
      <circle cx="60" cy="7" r="1.6" fill={color} />
      <circle cx="10" cy="7" r="1" fill={color} opacity="0.6" />
      <circle cx="110" cy="7" r="1" fill={color} opacity="0.6" />
    </svg>
  );
}

function OpeningBook({ title, accent, gold, reduce }: { title: string; accent: string; gold: string; reduce: boolean }) {
  // Book opens automatically on mount — a one-shot cinematic reveal. Previously
  // this was scroll-driven, but at scrollY=0 the book was closed and the
  // hero looked like an empty burgundy rectangle. Now visitors see the
  // title from the first frame; the reveal takes ~1.4s.
  const openTiming = { duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] as const };
  return (
    <div className="relative mx-auto flex items-center justify-center" style={{ perspective: 1400, width: "min(90vw, 720px)", height: "min(70vw, 520px)" }}>
      <motion.div
        aria-hidden
        className="absolute inset-0 rounded-md"
        style={{
          background: "radial-gradient(ellipse at center, rgba(232,154,90,0.35), transparent 70%)",
          filter: "blur(30px)",
        }}
        initial={reduce ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...openTiming, delay: 0.7 }}
      />
      <div className="relative flex h-full w-full" style={{ transformStyle: "preserve-3d" }}>
        <motion.div
          className="relative h-full w-1/2 origin-right rounded-l-sm"
          style={{ background: `linear-gradient(90deg, ${accent} 0%, #3a1a14 100%)`, boxShadow: "inset -8px 0 20px rgba(0,0,0,0.5)" }}
          initial={reduce ? { rotateY: -78 } : { rotateY: 0 }}
          animate={{ rotateY: -78 }}
          transition={openTiming}
        >
          <div className="absolute inset-3 rounded-l-sm border" style={{ borderColor: gold, opacity: 0.5 }} />
          <div className="absolute inset-x-6 top-8 text-center" style={{ color: gold }}>
            <p className="text-[9px] uppercase tracking-[0.5em] opacity-80">Volume</p>
            <p className="font-display text-4xl mt-2">I</p>
          </div>
        </motion.div>
        <motion.div
          className="relative h-full w-1/2 origin-left rounded-r-sm"
          style={{ background: `linear-gradient(270deg, ${accent} 0%, #3a1a14 100%)`, boxShadow: "inset 8px 0 20px rgba(0,0,0,0.5)" }}
          initial={reduce ? { rotateY: 78 } : { rotateY: 0 }}
          animate={{ rotateY: 78 }}
          transition={openTiming}
        >
          <div className="absolute inset-3 rounded-r-sm border" style={{ borderColor: gold, opacity: 0.5 }} />
        </motion.div>
        <motion.div
          className="pointer-events-none absolute inset-0 flex items-center justify-center px-6"
          initial={reduce ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...openTiming, delay: 0.9, duration: 1 }}
        >
          <div className="text-center" style={{ color: "#f0e6d2" }}>
            <p className="text-[10px] uppercase tracking-[0.6em]" style={{ color: gold }}>Chronicles of</p>
            <h1 className="mt-4 font-display italic text-[clamp(2rem,7vw,5rem)] leading-[1.02]">
              {title}
            </h1>
            <div className="mt-6"><Flourish color={gold} /></div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function BookSpine({ index, caption, url, accent, gold }: { index: number; caption: string; url: string; accent: string; gold: string }) {
  const color = SPINE_PALETTE[index % SPINE_PALETTE.length];
  return (
    <div className="group relative flex-shrink-0" style={{ width: 68, height: 260 }}>
      <div
        className="absolute inset-0 rounded-sm transition-all duration-500 group-hover:opacity-0"
        style={{
          background: `linear-gradient(90deg, ${color} 0%, ${color} 70%, rgba(0,0,0,0.35) 100%)`,
          boxShadow: "inset -4px 0 8px rgba(0,0,0,0.4), inset 4px 0 6px rgba(255,255,255,0.05)",
        }}
      >
        <div className="absolute inset-x-2 top-4 h-px" style={{ background: gold, opacity: 0.7 }} />
        <div className="absolute inset-x-2 bottom-4 h-px" style={{ background: gold, opacity: 0.7 }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="whitespace-nowrap font-display text-[13px] uppercase tracking-[0.3em]"
            style={{ color: "#f0e6d2", transform: "rotate(-90deg)", transformOrigin: "center" }}
          >
            {caption || `Chapter ${toRoman(index + 1)}`}
          </span>
        </div>
        <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 text-center" style={{ color: gold }}>
          <span className="font-display italic text-xs opacity-70">{toRoman(index + 1)}</span>
        </div>
      </div>
      <div
        className="absolute inset-0 overflow-hidden rounded-sm opacity-0 transition-all duration-500 group-hover:opacity-100"
        style={{ transform: "scale(1.05)", boxShadow: `0 12px 30px rgba(0,0,0,0.6), 0 0 0 1px ${gold}` }}
      >
        <img src={url} alt={caption} loading="lazy" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        {caption && (
          <p className="absolute inset-x-2 bottom-2 text-center text-[10px] uppercase tracking-[0.2em]" style={{ color: "#f0e6d2" }}>
            {caption}
          </p>
        )}
      </div>
      <div aria-hidden className="absolute -bottom-2 left-1 right-1 h-2 rounded-sm" style={{ background: "rgba(0,0,0,0.5)", filter: "blur(3px)" }} />
    </div>
  );
}

function ChapterEntry({ s, i, accent, gold }: { s: SubEvent; i: number; accent: string; gold: string }) {
  const reduce = useReducedMotion();
  const initial = (s.name || "?").trim().charAt(0).toUpperCase();
  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
      className="relative grid gap-6 border-t py-10 sm:grid-cols-[120px_1fr]"
      style={{ borderColor: "rgba(200,164,96,0.2)" }}
    >
      <div className="flex flex-col items-center sm:items-start">
        <span className="text-[9px] uppercase tracking-[0.5em]" style={{ color: gold, opacity: 0.7 }}>Chapter</span>
        <span className="mt-1 font-display italic text-4xl" style={{ color: gold }}>{toRoman(s.order)}</span>
      </div>
      <div>
        <div className="flex items-start gap-4">
          <div
            className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-sm font-display italic text-3xl"
            style={{ background: accent, color: "#f0e6d2", boxShadow: `inset 0 0 0 1px ${gold}` }}
          >
            {initial}
          </div>
          <div className="flex-1">
            <h3 className="font-display text-2xl italic leading-tight" style={{ color: "#f0e6d2" }}>{s.name}</h3>
            <p className="mt-1 text-[10px] uppercase tracking-[0.35em]" style={{ color: gold, opacity: 0.7 }}>
              {[s.date, s.startTime].filter(Boolean).join(" · ")}
            </p>
          </div>
        </div>
        {s.description && (
          <p className="mt-4 max-w-xl text-base leading-relaxed" style={{ color: "#f0e6d2", opacity: 0.75 }}>
            {s.description}
          </p>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px]" style={{ color: "#f0e6d2" }}>
          {s.venueName && (
            <span className="opacity-70">@ {s.venueName}</span>
          )}
          {s.dressCode && (
            <span className="rounded-full border px-3 py-1 text-[9px] uppercase tracking-[0.3em]" style={{ borderColor: "rgba(200,164,96,0.4)", color: gold }}>
              {s.dressCode}
            </span>
          )}
        </div>
        <div className="mt-6"><Flourish color={gold} /></div>
      </div>
    </motion.article>
  );
}

export const LibraryTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || "#c8a460";
  const gold = "#c8a460";
  const wine = "#5e2320";
  const parchment = "#f0e6d2";
  const lamp = "#e89a5a";

  const tagline = event.tagline?.trim() || "A story bound in years";
  const invitationMessage = event.invitationMessage?.trim() || "Between these pages, a lifetime is kept. Each year an illuminated chapter, each memory a letter still warm from the lamp. Turn slowly.";
  const aboutStory = event.aboutStory?.trim() || "";
  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const hero = event.heroImageUrl || "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1600&q=80";

  const heroRef = useRef<HTMLDivElement>(null);

  const showStory = !event.hideStory;
  const showJourney = !event.hideEvents && subEvents.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  const storyParagraphs = useMemo(() => {
    const src = aboutStory || invitationMessage;
    return src.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  }, [aboutStory, invitationMessage]);

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-serif antialiased"
      style={{ "--accent": accent, background: "#1a1006", color: parchment } as React.CSSProperties}
    >
      <LibraryField />
      <ScrollProgress color={accent} />

      {/* ─── I. THE OPENING BOOK ─── */}
      <section ref={heroRef} className="relative min-h-[100svh] flex flex-col items-center justify-center px-6 py-24">
        <div className="absolute inset-0 opacity-40">
          <HeroMedia imageSrc={hero} videoSrc={event.heroVideoUrl || undefined} alt={event.eventTitle} className="opacity-30" />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 20%, #1a1006 75%)" }} />
        </div>
        <div className="relative z-10 flex flex-col items-center">
          <p className="mb-6 text-[10px] uppercase tracking-[0.7em]" style={{ color: gold }}>{tagline}</p>
          <OpeningBook title={event.eventTitle} accent={wine} gold={gold} reduce={reduce} />
          <div className="mt-10 flex flex-wrap justify-center gap-5 text-xs uppercase tracking-[0.4em]" style={{ color: parchment }}>
            {event.mainDate && (
              <span className="opacity-80">
                {new Date(event.mainDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              </span>
            )}
            {event.mainStartTime && <span style={{ color: gold }}>•</span>}
            {event.mainStartTime && <span className="opacity-80">{event.mainStartTime}</span>}
            {event.city && <><span style={{ color: gold }}>•</span><span className="opacity-80">{event.city}</span></>}
          </div>
          {event.person1Name && (
            <p className="mt-6 font-display italic text-lg" style={{ color: gold }}>
              {event.person1Name}{event.person2Name ? ` & ${event.person2Name}` : ""}
            </p>
          )}
        </div>
        {!reduce && (
          <motion.div
            animate={{ y: [0, 8, 0], opacity: [0.3, 0.9, 0.3] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.5em]"
            style={{ color: gold }}
          >
            Turn the page
          </motion.div>
        )}
      </section>

      {/* ─── II. THE READING ROOM ─── */}
      {showStory && (
        <section className="relative mx-auto max-w-3xl px-6 py-28 sm:py-36">
          <div className="pointer-events-none absolute inset-0">
            {BUTTERFLIES.map((b, i) => (
              <Butterfly key={i} top={b.top} left={b.left} delay={b.delay} dur={b.dur} amp={b.amp} reduce={reduce} color={lamp} />
            ))}
          </div>
          <div className="relative">
            <p className="text-center text-[10px] uppercase tracking-[0.6em]" style={{ color: gold }}>The Reading Room</p>
            <div className="mt-4"><Flourish color={gold} /></div>
            <div className="mt-12 space-y-6 font-serif text-lg leading-[1.9] sm:text-xl" style={{ color: parchment }}>
              {storyParagraphs.map((p, i) => (
                <motion.p
                  key={i}
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ duration: 0.9, delay: i * 0.15, ease: EASE }}
                  className={i === 0 ? "first-letter:font-display first-letter:italic first-letter:text-7xl first-letter:leading-[0.9] first-letter:mr-3 first-letter:float-left" : ""}
                  style={i === 0 ? { color: parchment } : undefined}
                >
                  <span style={i === 0 ? { color: gold } : undefined}>{p.charAt(0)}</span>{p.slice(1)}
                </motion.p>
              ))}
            </div>
            <div className="mt-12"><Flourish color={gold} /></div>
          </div>
        </section>
      )}

      {/* ─── III. THE CHAPTERS ─── */}
      {showJourney && (
        <section className="relative mx-auto max-w-4xl px-6 py-24 sm:py-32">
          <p className="text-center text-[10px] uppercase tracking-[0.6em]" style={{ color: gold }}>Chapters of the Year</p>
          <h2 className="mt-4 text-center font-display italic text-4xl sm:text-5xl" style={{ color: parchment }}>The Ceremony Unfolds</h2>
          <div className="mt-4"><Flourish color={gold} /></div>
          <div className="mt-12">
            {[...subEvents].sort((a, b) => a.order - b.order).map((s, i) => (
              <ChapterEntry key={s.order} s={s} i={i} accent={wine} gold={gold} />
            ))}
          </div>
        </section>
      )}

      {/* ─── IV. THE SHELF (GALLERY) ─── */}
      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <p className="text-center text-[10px] uppercase tracking-[0.6em]" style={{ color: gold }}>The Shelf</p>
          <h2 className="mt-4 text-center font-display italic text-4xl sm:text-5xl" style={{ color: parchment }}>Volumes of Memory</h2>
          <div className="mt-4"><Flourish color={gold} /></div>
          <p className="mx-auto mt-6 max-w-xl text-center text-sm opacity-70" style={{ color: parchment }}>Hover any spine to open its cover.</p>
          <div className="relative mt-14">
            <div
              className="mx-auto flex items-end justify-center gap-1 overflow-x-auto pb-6"
              style={{ maxWidth: "100%" }}
            >
              {galleryItems.map((m, i) => (
                <motion.div
                  key={`${m.fileName}-${i}`}
                  initial={reduce ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05, ease: EASE }}
                >
                  <BookSpine index={i} caption={m.caption || ""} url={m.publicUrl} accent={wine} gold={gold} />
                </motion.div>
              ))}
              {editing && galleryItems.length === 0 && (
                <div className="flex h-[260px] w-full items-center justify-center rounded-sm border border-dashed text-sm" style={{ borderColor: "rgba(200,164,96,0.4)", color: parchment }}>
                  + Add photos
                </div>
              )}
            </div>
            <div
              aria-hidden
              className="mx-auto mt-1 h-3 rounded-sm"
              style={{ background: "linear-gradient(180deg, #4a2818, #1a1006)", boxShadow: "0 8px 20px rgba(0,0,0,0.6)", maxWidth: "min(1100px, 100%)" }}
            />
          </div>
        </section>
      )}

      {/* ─── V. THE READING ROOM ADDRESS ─── */}
      {showVenue && (
        <section className="relative mx-auto max-w-5xl px-6 py-24 sm:py-32">
          <p className="text-center text-[10px] uppercase tracking-[0.6em]" style={{ color: gold }}>The Reading Room</p>
          <h2 className="mt-4 text-center font-display italic text-4xl sm:text-5xl" style={{ color: parchment }}>Where the Book is Kept</h2>
          <div className="mt-4"><Flourish color={gold} /></div>
          {event.venueName && (
            <p className="mt-8 text-center font-display italic text-2xl" style={{ color: parchment }}>{event.venueName}</p>
          )}
          {event.venueAddress && (
            <p className="mx-auto mt-2 max-w-md text-center text-sm opacity-70" style={{ color: parchment }}>{event.venueAddress}</p>
          )}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="mt-10 overflow-hidden rounded-sm border p-1"
            style={{ borderColor: "rgba(200,164,96,0.3)", background: "rgba(232,154,90,0.05)" }}
          >
            <MapEmbed
              latitude={event.latitude}
              longitude={event.longitude}
              venueName={event.venueName}
              venueAddress={event.venueAddress}
              mapLink={event.mapLink}
            />
          </motion.div>
        </section>
      )}

      {/* ─── VI. RESERVE YOUR SEAT ─── */}
      <section className="relative px-6 py-32 text-center sm:py-44">
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: EASE }}
          className="mx-auto max-w-2xl"
        >
          <div
            aria-hidden
            className="mx-auto mb-10 h-20 w-20 rounded-full"
            style={{ background: `radial-gradient(circle, ${lamp}, transparent 70%)`, filter: "blur(18px)", opacity: 0.55 }}
          />
          <p className="text-[10px] uppercase tracking-[0.6em]" style={{ color: gold }}>Colophon</p>
          <h2 className="mt-6 font-display italic text-[clamp(2.4rem,7vw,5rem)] leading-[1] tracking-tight" style={{ color: parchment }}>
            Reserve your seat at the reading
          </h2>
          <div className="mt-6"><Flourish color={gold} /></div>
          {event.person1Name && (
            <p className="mt-8 font-display italic text-xl" style={{ color: gold }}>
              {event.person1Name}{event.person2Name ? ` & ${event.person2Name}` : ""}
            </p>
          )}
          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <motion.div whileHover={reduce ? undefined : { scale: 1.03 }} className="mt-10 inline-block">
              <a
                href={event.rsvpLinkOrContact}
                target="_blank"
                rel="noreferrer"
                className="inline-block rounded-sm border-2 px-12 py-4 text-xs uppercase tracking-[0.4em] transition-all"
                style={{ borderColor: gold, color: gold, background: "rgba(232,154,90,0.05)" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = gold; e.currentTarget.style.color = "#1a1006"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(232,154,90,0.05)"; e.currentTarget.style.color = gold; }}
              >
                Reserve your seat
              </a>
            </motion.div>
          )}
        </motion.div>
      </section>

      <footer className="border-t py-8 text-center text-xs" style={{ borderColor: "rgba(200,164,96,0.15)", color: parchment }}>
        <div className="mb-3"><Flourish color={gold} /></div>
        <p className="font-display italic opacity-70">
          {event.eventTitle}{event.person1Name ? ` · ${event.person1Name}` : ""}
        </p>
        <p className="mt-1 text-[10px] uppercase tracking-[0.4em] opacity-40" style={{ color: gold }}>Finis</p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default LibraryTemplate;
