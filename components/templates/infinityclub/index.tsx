"use client";

import { useMemo, useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { HeroMedia } from "@/components/ui/HeroMedia";
import { MapEmbed } from "@/components/ui/MapEmbed";
import { MusicToggle } from "@/components/ui/MusicToggle";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { useEditMode } from "@/components/edit/EditContext";
import type { TemplateComponent, SubEvent } from "@/lib/types";

const EASE = [0.16, 1, 0.3, 1] as const;
const VOID = "#000005";

const TUNNEL_RINGS = Array.from({ length: 12 }, (_, i) => {
  const t = i / 11;
  return {
    scale: 1 - t * 0.92,
    opacity: 0.15 + t * 0.75,
    delay: i * 0.08,
  };
});

const LASERS = [
  { angle: 18, color: "#00e5ff", top: "12%", width: "140%", left: "-20%", dur: 6 },
  { angle: -22, color: "#ff0080", top: "38%", width: "140%", left: "-20%", dur: 8 },
  { angle: 14, color: "#00ff9c", top: "68%", width: "140%", left: "-20%", dur: 7 },
  { angle: -10, color: "#00e5ff", top: "86%", width: "140%", left: "-20%", dur: 9 },
];

const LED_COLORS = ["#00e5ff", "#ff0080", "#00ff9c"];

function LedWall({
  cols,
  rows,
  colorIndex,
  reduce,
}: {
  cols: number;
  rows: number;
  colorIndex: number;
  reduce: boolean;
}) {
  const cells = useMemo(() => {
    const list: { r: number; c: number; delay: number }[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        list.push({ r, c, delay: ((r + c) % (cols + rows)) * 0.08 });
      }
    }
    return list;
  }, [cols, rows]);
  const base = LED_COLORS[colorIndex % LED_COLORS.length];
  return (
    <div
      className="pointer-events-none absolute grid opacity-[0.28]"
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gap: 3,
        inset: 0,
      }}
      aria-hidden
    >
      {cells.map((cell, i) => (
        <motion.span
          key={i}
          className="block h-full w-full rounded-[1px]"
          style={{ background: base, boxShadow: `0 0 6px ${base}` }}
          animate={reduce ? undefined : { opacity: [0.15, 0.85, 0.15] }}
          transition={{ duration: 2.4, delay: cell.delay % 3, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function InfinityField({ reduce }: { reduce: boolean }) {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden" style={{ background: VOID }}>
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 40%, rgba(0,229,255,0.08), transparent 60%)` }} />
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 20% 80%, rgba(255,0,128,0.06), transparent 55%)` }} />
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 85% 15%, rgba(0,255,156,0.05), transparent 55%)` }} />
      {!reduce && LASERS.map((l, i) => (
        <motion.div
          key={i}
          className="absolute h-[2px] origin-left"
          style={{
            top: l.top,
            left: l.left,
            width: l.width,
            background: `linear-gradient(90deg, transparent, ${l.color}, transparent)`,
            transform: `rotate(${l.angle}deg)`,
            boxShadow: `0 0 12px ${l.color}`,
          }}
          animate={{ opacity: [0.1, 0.7, 0.1], scaleX: [0.9, 1, 0.9] }}
          transition={{ duration: l.dur, delay: i * 0.6, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${VOID}00, ${VOID}cc)` }} />
    </div>
  );
}

function TunnelHero({ reduce, accent }: { reduce: boolean; accent: string }) {
  return (
    <div aria-hidden className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <div className="relative aspect-square w-[140%] max-w-none">
        {TUNNEL_RINGS.map((ring, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 border rounded-sm"
            style={{
              borderColor: accent,
              boxShadow: `0 0 ${8 + i * 3}px ${accent}, inset 0 0 ${6 + i * 2}px ${accent}`,
              opacity: ring.opacity,
              transform: `scale(${ring.scale})`,
            }}
            animate={reduce ? undefined : { opacity: [ring.opacity * 0.6, ring.opacity, ring.opacity * 0.6] }}
            transition={{ duration: 3, delay: ring.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
        <div
          className="absolute left-1/2 top-1/2 h-[6%] w-[6%] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "#ffffff", boxShadow: `0 0 60px #ffffff, 0 0 120px ${accent}` }}
        />
      </div>
    </div>
  );
}

function Ticker({ text, color }: { text: string; color: string }) {
  const reduce = !!useReducedMotion();
  const line = `${text}   //   `.repeat(6);
  return (
    <div className="relative overflow-hidden border-y" style={{ borderColor: `${color}55`, background: "#00000055" }}>
      <motion.div
        className="whitespace-nowrap py-1 font-mono text-[10px] uppercase tracking-[0.3em]"
        style={{ color }}
        animate={reduce ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <span>{line}</span>
        <span>{line}</span>
      </motion.div>
    </div>
  );
}

function Rooms({ items, accent }: { items: SubEvent[]; accent: string }) {
  const reduce = !!useReducedMotion();
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <div className="mx-auto grid max-w-6xl gap-4 px-6 sm:grid-cols-2 lg:grid-cols-3">
      {sorted.map((s, i) => {
        const roomColor = LED_COLORS[i % LED_COLORS.length];
        return (
          <motion.article
            key={s.order}
            initial={reduce ? false : { opacity: 0, y: 24, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
            className="group relative overflow-hidden rounded-lg border p-6"
            style={{ borderColor: `${roomColor}55`, background: "#00000088", boxShadow: `inset 0 0 40px ${roomColor}22` }}
          >
            <div className="absolute inset-0 opacity-30">
              <LedWall cols={14} rows={8} colorIndex={i} reduce={reduce} />
            </div>
            <div className="relative">
              <div className="mb-4 flex items-center justify-between">
                <span
                  className="font-mono text-[10px] uppercase tracking-[0.3em]"
                  style={{ color: roomColor, textShadow: `0 0 8px ${roomColor}` }}
                >
                  Floor {String(s.order).padStart(2, "0")}
                </span>
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: roomColor, boxShadow: `0 0 10px ${roomColor}` }}
                />
              </div>
              <h3
                className="font-display text-2xl font-black uppercase leading-[0.95] tracking-tight"
                style={{ textShadow: `0 0 12px ${accent}55` }}
              >
                {s.name}
              </h3>
              <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.25em] opacity-70">
                {[s.date, s.startTime].filter(Boolean).join(" // ")}
              </div>
              {s.venueName && (
                <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] opacity-60">// {s.venueName}</p>
              )}
              {s.description && <p className="mt-3 text-sm leading-relaxed opacity-70">{s.description}</p>}
              {s.dressCode && (
                <p
                  className="mt-4 inline-block border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em]"
                  style={{ borderColor: `${roomColor}66`, color: roomColor }}
                >
                  Dress: {s.dressCode}
                </p>
              )}
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}

export const InfinityclubTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || "#00e5ff";
  const tagline = event.tagline?.trim() || "Enter the endless floor";
  const invitationMessage =
    event.invitationMessage?.trim() ||
    "Twelve rooms. One current. Follow the tunnels until the lasers run out.";
  const aboutStory =
    event.aboutStory?.trim() ||
    "Infinity Club is a megaclub without walls. Arenas link into arenas, LED corridors bend the geometry, and every floor keeps its own tempo. There is no last room.";
  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const hero =
    event.heroImageUrl ||
    "https://images.unsplash.com/photo-1571266028243-d220bc5c0e5f?auto=format&fit=crop&w=1600&q=80";

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(heroP, [0, 1], [1, 1.25]);
  const heroOpacity = useTransform(heroP, [0, 0.7], [1, 0]);
  const heroTextY = useTransform(heroP, [0, 1], [0, -80]);

  const showStory = !event.hideStory;
  const showRooms = !event.hideEvents && subEvents.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-sans antialiased"
      style={{ "--accent": accent, background: VOID, color: "#ffffff" } as React.CSSProperties}
    >
      <InfinityField reduce={reduce} />
      <ScrollProgress color={accent} />

      <section ref={heroRef} className="relative flex h-[100svh] min-h-[640px] items-center justify-center overflow-hidden">
        <motion.div style={reduce ? undefined : { scale: heroScale, opacity: heroOpacity }} className="absolute inset-0">
          <HeroMedia
            imageSrc={hero}
            videoSrc={event.heroVideoUrl || undefined}
            alt={event.eventTitle}
            className="opacity-30"
          />
          <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at center, transparent, ${VOID} 70%)` }} />
        </motion.div>

        <TunnelHero reduce={reduce} accent={accent} />

        <motion.div style={reduce ? undefined : { y: heroTextY }} className="relative z-10 px-6 text-center">
          <motion.p
            initial={reduce ? false : { opacity: 0, letterSpacing: "0.2em" }}
            animate={{ opacity: 1, letterSpacing: "0.6em" }}
            transition={{ duration: 1.2, ease: EASE }}
            className="mb-6 font-mono text-[10px] uppercase"
            style={{ color: accent, textShadow: `0 0 20px ${accent}` }}
          >
            {tagline}
          </motion.p>
          <h1
            className="font-display text-[clamp(3rem,13vw,10rem)] font-black uppercase leading-[0.85] tracking-tight"
            style={{ textShadow: `0 0 40px ${accent}, 0 0 80px ${accent}55` }}
          >
            {event.eventTitle.split(" ").map((word, i) => (
              <motion.span
                key={i}
                initial={reduce ? false : { opacity: 0, y: 40, filter: "blur(20px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.9, delay: 0.3 + i * 0.15, ease: EASE }}
                className="block"
              >
                {word}
              </motion.span>
            ))}
          </h1>
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.4em] opacity-80"
          >
            {event.mainDate && (
              <span>
                {new Date(event.mainDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
              </span>
            )}
            {event.mainStartTime && <span style={{ color: accent }}>//</span>}
            {event.mainStartTime && <span>{event.mainStartTime}</span>}
            {event.city && (
              <>
                <span style={{ color: accent }}>//</span>
                <span>{event.city}</span>
              </>
            )}
          </motion.div>
        </motion.div>

        {!reduce && (
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.5em]"
            style={{ color: accent }}
            animate={{ opacity: [0.3, 1, 0.3], y: [0, 6, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          >
            Descend
          </motion.div>
        )}
      </section>

      {showStory && (
        <section className="relative mx-auto max-w-6xl px-6 py-28 sm:py-40">
          <div className="pointer-events-none absolute right-0 top-16 hidden h-[420px] w-[45%] sm:block">
            <LedWall cols={22} rows={14} colorIndex={0} reduce={reduce} />
          </div>
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-6 font-mono text-[10px] uppercase tracking-[0.5em]"
            style={{ color: accent }}
          >
            // Signal
          </motion.p>
          <motion.h2
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: EASE }}
            className="max-w-3xl font-display text-4xl font-black uppercase leading-[1] tracking-tight sm:text-6xl"
            style={{ textShadow: `0 0 24px ${accent}44` }}
          >
            {invitationMessage}
          </motion.h2>
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 1 }}
            className="mt-8 max-w-2xl text-base leading-relaxed opacity-70 sm:text-lg"
          >
            {aboutStory}
          </motion.p>
        </section>
      )}

      {showRooms && (
        <section className="relative py-24 sm:py-32">
          <Ticker text={`${event.eventTitle} // floor map // enter any door`} color={accent} />
          <div className="mx-auto max-w-6xl px-6 pt-16">
            <motion.p
              initial={reduce ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-10 font-mono text-[10px] uppercase tracking-[0.5em]"
              style={{ color: accent }}
            >
              // The Rooms
            </motion.p>
          </div>
          <Rooms items={subEvents} accent={accent} />
        </section>
      )}

      {showGallery && (
        <section className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-10 font-mono text-[10px] uppercase tracking-[0.5em]"
            style={{ color: accent }}
          >
            // Billboards
          </motion.p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((m, i) => {
              const frame = LED_COLORS[i % LED_COLORS.length];
              return (
                <motion.figure
                  key={`${m.fileName}-${i}`}
                  initial={reduce ? false : { opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.06, ease: EASE }}
                  className="relative overflow-hidden rounded-md p-[3px]"
                  style={{ background: `linear-gradient(135deg, ${frame}, ${accent})`, boxShadow: `0 0 30px ${frame}44` }}
                >
                  <div className="relative overflow-hidden rounded-[3px]" style={{ background: VOID }}>
                    <img
                      src={m.publicUrl}
                      alt={m.caption ?? ""}
                      className="aspect-[4/5] w-full object-cover"
                      loading="lazy"
                    />
                    <div className="pointer-events-none absolute inset-0" style={{ boxShadow: `inset 0 0 40px ${frame}88` }} />
                  </div>
                  <Ticker text={m.caption || `Frame ${String(i + 1).padStart(3, "0")} // live feed`} color={frame} />
                </motion.figure>
              );
            })}
            {editing && galleryItems.length === 0 && (
              <div
                className="col-span-full flex h-56 items-center justify-center rounded-md border border-dashed font-mono text-sm uppercase tracking-[0.3em] opacity-60"
                style={{ borderColor: `${accent}66`, color: accent }}
              >
                + Add photos
              </div>
            )}
          </div>
        </section>
      )}

      {showVenue && (
        <section className="relative mx-auto max-w-5xl px-6 py-24 sm:py-32">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-6 font-mono text-[10px] uppercase tracking-[0.5em]"
            style={{ color: accent }}
          >
            // Location
          </motion.p>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="overflow-hidden rounded-md p-[2px]"
            style={{ background: `linear-gradient(135deg, ${accent}, #ff0080, #00ff9c)` }}
          >
            <div className="rounded-[4px] p-1" style={{ background: VOID }}>
              <MapEmbed
                latitude={event.latitude}
                longitude={event.longitude}
                venueName={event.venueName}
                venueAddress={event.venueAddress}
                mapLink={event.mapLink}
              />
            </div>
          </motion.div>
        </section>
      )}

      <section className="relative px-6 py-32 text-center sm:py-48">
        <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-full w-full max-w-3xl opacity-40">
          <LedWall cols={30} rows={20} colorIndex={2} reduce={reduce} />
        </div>
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: EASE }}
          className="relative mx-auto max-w-3xl"
        >
          <h2
            className="font-display text-[clamp(2.5rem,9vw,6.5rem)] font-black uppercase leading-[0.9] tracking-tight"
            style={{ textShadow: `0 0 40px ${accent}` }}
          >
            {event.eventTitle}
          </h2>
          {event.person1Name && (
            <p className="mt-6 font-mono text-xs uppercase tracking-[0.5em] opacity-70">// {event.person1Name}</p>
          )}
          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <motion.a
              href={event.rsvpLinkOrContact}
              target="_blank"
              rel="noreferrer"
              whileHover={reduce ? undefined : { scale: 1.04 }}
              className="mt-12 inline-block rounded-full px-14 py-5 font-mono text-xs uppercase tracking-[0.5em]"
              style={{ background: accent, color: VOID, boxShadow: `0 0 40px ${accent}, 0 0 80px ${accent}55` }}
            >
              Get on the list
            </motion.a>
          )}
        </motion.div>
      </section>

      <Ticker text={`${event.eventTitle} // no last room // no last song // no last room`} color={accent} />

      <footer className="border-t py-8 text-center font-mono text-[10px] uppercase tracking-[0.4em] opacity-50" style={{ borderColor: `${accent}22` }}>
        <p>
          {event.eventTitle}
          {event.person1Name ? ` // ${event.person1Name}` : ""}
        </p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default InfinityclubTemplate;
