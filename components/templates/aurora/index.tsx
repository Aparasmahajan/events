"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { HeroMedia } from "@/components/ui/HeroMedia";
import { MapEmbed } from "@/components/ui/MapEmbed";
import { Countdown } from "@/components/ui/Countdown";
import { MusicToggle } from "@/components/ui/MusicToggle";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { AddToCalendar } from "@/components/ui/AddToCalendar";
import { RSVP } from "@/components/ui/RSVP";
import { EditableImage } from "@/components/edit/EditableImage";
import { useEditMode } from "@/components/edit/EditContext";
import { auroraMeta } from "@/components/templates/metadata";
import type { MediaItem, SubEvent, TemplateComponent } from "@/lib/types";

const defaults = auroraMeta.defaults;
const EASE = [0.16, 1, 0.3, 1] as const;

/* Deterministic so SSR and the client agree (no Math.random in render). */
const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  size: 1 + (i % 3),
  delay: (i % 10) * 0.7,
  dur: 9 + (i % 8),
}));

/* ── A glowing cursor that swells over interactive elements ── */
function CustomCursor() {
  const reduce = useReducedMotion();
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 450, damping: 38, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 450, damping: 38, mass: 0.4 });
  const [hot, setHot] = useState(false);
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (reduce || !window.matchMedia("(pointer: fine)").matches) return;
    setOn(true);
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      setHot(!!t?.closest("a,button,[data-cursor]"));
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
    };
  }, [reduce, x, y]);

  if (!on) return null;
  return (
    <motion.div
      aria-hidden
      style={{ left: sx, top: sy }}
      className="pointer-events-none fixed z-[60] -translate-x-1/2 -translate-y-1/2 mix-blend-screen hidden sm:block"
    >
      <motion.div
        animate={{ scale: hot ? 2.8 : 1, opacity: hot ? 0.95 : 0.55 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="h-7 w-7 rounded-full"
        style={{ background: "radial-gradient(circle, var(--accent), transparent 70%)" }}
      />
    </motion.div>
  );
}

/* ── Fixed aurora background: drifting light, film noise, rising motes ── */
function AuroraField({ reduce }: { reduce: boolean }) {
  const blobs = [
    { c: "#2546ff", x: "10%", y: "14%", s: "46vw", d: 0 },
    { c: "#16c79a", x: "72%", y: "20%", s: "40vw", d: 3 },
    { c: "#9b6bff", x: "32%", y: "72%", s: "52vw", d: 6 },
    { c: "var(--accent)", x: "82%", y: "78%", s: "34vw", d: 2 },
  ];
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden bg-[#06070d]">
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-50 blur-[80px]"
          style={{
            left: b.x,
            top: b.y,
            width: b.s,
            height: b.s,
            marginLeft: `calc(-${b.s} / 2)`,
            marginTop: `calc(-${b.s} / 2)`,
            background: `radial-gradient(circle, ${b.c}, transparent 70%)`,
            willChange: "transform",
          }}
          animate={reduce ? undefined : { x: [0, 34, -22, 0], y: [0, -26, 16, 0], scale: [1, 1.12, 0.94, 1] }}
          transition={reduce ? undefined : { duration: 18 + i * 4, delay: b.d, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      <svg
        aria-hidden
        className="absolute inset-0 h-full w-full opacity-[0.07] mix-blend-overlay"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="aurora-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#aurora-noise)" />
      </svg>
      {!reduce && (
        <div className="absolute inset-0">
          {PARTICLES.map((p, i) => (
            <motion.span
              key={i}
              className="absolute bottom-0 rounded-full bg-white/80"
              style={{ left: p.left, width: p.size, height: p.size }}
              animate={{ y: ["0vh", "-102vh"], opacity: [0, 0.7, 0] }}
              transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "linear" }}
            />
          ))}
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-[#06070d]/20 via-transparent to-[#06070d]" />
    </div>
  );
}

/* ── Words that rise into place on scroll ── */
function WordReveal({ text, className }: { text: string; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <p className={className}>
      {text.split(" ").map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            initial={reduce ? false : { y: "115%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true, margin: "-12% 0px" }}
            transition={{ duration: 0.8, delay: (i % 14) * 0.045, ease: EASE }}
          >
            {w}&nbsp;
          </motion.span>
        </span>
      ))}
    </p>
  );
}

/* ── Hero name: letters rise + tilt on load ── */
function NameReveal({ text, delay = 0 }: { text: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <span className="inline-block overflow-hidden pb-[0.12em]">
      <span className="inline-flex" style={{ perspective: 600 }}>
        {Array.from(text).map((ch, i) => (
          <motion.span
            key={i}
            className="inline-block"
            initial={reduce ? false : { y: "120%", opacity: 0, rotateX: -55 }}
            animate={{ y: "0%", opacity: 1, rotateX: 0 }}
            transition={{ duration: 0.95, delay: delay + i * 0.05, ease: EASE }}
          >
            {ch === " " ? " " : ch}
          </motion.span>
        ))}
      </span>
    </span>
  );
}

/* ── Button that leans toward the cursor ── */
function Magnetic({ children, className }: { children: React.ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });
  const ref = useRef<HTMLDivElement>(null);
  return (
    <motion.div
      ref={ref}
      data-cursor
      style={{ x: sx, y: sy }}
      className={className}
      onPointerMove={(e) => {
        if (reduce || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * 0.4);
        y.set((e.clientY - (r.top + r.height / 2)) * 0.4);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/* ── A single editorial photo plate (editable in edit mode) ── */
function Plate({ item, className }: { item: MediaItem; className?: string }) {
  return (
    <figure className={`relative overflow-hidden ${className ?? ""}`} data-cursor>
      <EditableImage
        section={item.section || "gallery"}
        replaceAssetId={item.driveFileId}
        src={item.publicUrl}
        alt={item.caption ?? "A moment"}
        fill
        sizes="(max-width: 640px) 90vw, 40vw"
        className="object-cover transition-transform duration-[1.2s] ease-out hover:scale-105"
      />
      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
      {item.caption && (
        <figcaption className="pointer-events-none absolute bottom-3 left-3 right-3 text-[11px] uppercase tracking-[0.28em] text-white/85">
          {item.caption}
        </figcaption>
      )}
    </figure>
  );
}

/* ── "Moments Frozen in Time": vertical scroll scrubs a sideways album ── */
function HorizontalMoments({
  items,
  reduce,
  editing,
}: {
  items: MediaItem[];
  reduce: boolean;
  editing: boolean;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  // Live shift in a ref so the scroll transform reads the measured value each
  // frame (useTransform's output range is captured at init and wouldn't update).
  const shiftRef = useRef(0);
  const [height, setHeight] = useState(0);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const xRaw = useTransform(scrollYProgress, (p) => -p * shiftRef.current);
  const x = useSpring(xRaw, { stiffness: 80, damping: 20, mass: 0.4 });

  useEffect(() => {
    if (reduce) return;
    const compute = () => {
      const t = trackRef.current;
      if (!t) return;
      const shift = Math.max(0, t.scrollWidth - window.innerWidth);
      shiftRef.current = shift;
      setHeight(shift + window.innerHeight);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [items.length, reduce]);

  // Mixed editorial sizes + slight rotations so nothing reads as a grid.
  const sizeFor = (i: number) =>
    [
      "h-[54vh] w-[78vw] sm:w-[34vw]",
      "h-[64vh] w-[78vw] sm:w-[26vw]",
      "h-[46vh] w-[78vw] sm:w-[40vw]",
      "h-[58vh] w-[78vw] sm:w-[30vw]",
    ][i % 4];
  const rotFor = (i: number) => [-2, 1.5, -1, 2.5][i % 4];

  if (reduce) {
    return (
      <div className="mx-auto grid max-w-5xl gap-5 px-6 sm:grid-cols-2">
        {items.map((m, i) => (
          <Plate key={`${m.fileName}-${i}`} item={m} className="aspect-[4/5]" />
        ))}
      </div>
    );
  }

  return (
    <div ref={sectionRef} style={{ height: height || "100vh" }} className="relative">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div
          ref={trackRef}
          style={{ x, willChange: "transform" }}
          className="flex items-center gap-[5vw] px-[10vw]"
        >
          {items.map((m, i) => (
            <Plate
              key={`${m.fileName}-${i}`}
              item={m}
              className={`shrink-0 ${sizeFor(i)}`}
            />
          ))}
          {editing && items.length === 0 && (
            <div className="relative h-[54vh] w-[78vw] sm:w-[34vw] shrink-0">
              <EditableImage section="gallery" src="" asAddTile alt="" />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

/* ── Events as floating islands that tilt in ── */
function Islands({ items }: { items: SubEvent[] }) {
  const reduce = useReducedMotion();
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <div className="mx-auto max-w-5xl px-6" style={{ perspective: 1200 }}>
      <div className="space-y-12 sm:space-y-24">
        {sorted.map((s, i) => {
          const left = i % 2 === 0;
          return (
            <motion.article
              key={`${s.eventCode}-${s.order}`}
              data-cursor
              initial={reduce ? false : { opacity: 0, y: 70, rotateX: 18, rotateY: left ? -10 : 10 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0, rotateY: 0 }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ duration: 1, ease: EASE }}
              whileHover={reduce ? undefined : { rotateY: left ? 5 : -5, rotateX: 4, scale: 1.015 }}
              style={{ transformStyle: "preserve-3d" }}
              className={`relative w-full max-w-xl rounded-[2px] border border-white/10 bg-white/[0.04] p-7 backdrop-blur-xl sm:p-10 ${
                left ? "sm:mr-auto" : "sm:ml-auto"
              }`}
            >
              <span className="font-display text-5xl leading-none text-[var(--accent)] sm:text-7xl">
                {String(s.order).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-display text-3xl sm:text-4xl">{s.name}</h3>
              <p className="mt-2 text-sm uppercase tracking-[0.25em] text-white/55">
                {[s.date, s.startTime && `${s.startTime}${s.endTime ? ` – ${s.endTime}` : ""}`]
                  .filter(Boolean)
                  .join("  ·  ")}
              </p>
              {s.venueName && (
                <p className="mt-3 text-white/80">
                  {s.venueName}
                  {s.venueAddress ? `, ${s.venueAddress}` : ""}
                </p>
              )}
              {s.dressCode && (
                <p className="mt-2 text-xs uppercase tracking-[0.3em] text-white/45">
                  Attire — {s.dressCode}
                </p>
              )}
              {s.description && <p className="mt-4 leading-relaxed text-white/70">{s.description}</p>}
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}

/* ── Constellation side-nav with scroll-spy ── */
function SideNav({ sections }: { sections: { id: string; label: string }[] }) {
  const [active, setActive] = useState(sections[0]?.id ?? "");
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [sections]);

  return (
    <nav
      aria-label="Sections"
      className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-4 md:flex"
    >
      {sections.map((s) => (
        <a key={s.id} href={`#${s.id}`} data-cursor className="group flex items-center gap-3">
          <span
            className={`text-[10px] uppercase tracking-[0.3em] transition-opacity duration-300 ${
              active === s.id ? "opacity-80" : "opacity-0 group-hover:opacity-60"
            }`}
          >
            {s.label}
          </span>
          <span
            className={`h-px transition-all duration-300 ${
              active === s.id ? "w-8 bg-[var(--accent)]" : "w-4 bg-white/30 group-hover:w-6"
            }`}
          />
        </a>
      ))}
    </nav>
  );
}

export const AuroraTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduceRaw = useReducedMotion();
  const reduce = !!reduceRaw;
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || defaults.accentColor;
  const hero = event.heroImageUrl || defaults.heroImage;
  const tagline = event.tagline?.trim() || defaults.tagline;
  const invitationMessage = event.invitationMessage?.trim() || defaults.invitationMessage;
  const aboutStory = event.aboutStory?.trim() || defaults.aboutStory || "";
  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const storyItems = galleryItems.slice(0, 2);

  const showStory = !event.hideStory;
  const showMoments = !event.hideGallery && (galleryItems.length > 0 || editing);
  const showJourney = !event.hideEvents && subEvents.length > 0;
  const showVenue = !event.hideVenue;

  const sections = [
    { id: "opening", label: "Opening" },
    ...(showStory ? [{ id: "promise", label: "The Promise" }] : []),
    ...(showMoments ? [{ id: "moments", label: "Moments" }] : []),
    ...(showJourney ? [{ id: "journey", label: "Journey" }] : []),
    ...(showVenue ? [{ id: "destiny", label: "Venue" }] : []),
    { id: "forever", label: "Forever" },
  ];

  // Hero: recede into a framed plate as you scroll.
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroScale = useTransform(heroP, [0, 1], [1, 0.86]);
  const heroRadius = useTransform(heroP, [0, 1], [0, 30]);
  const heroTextOpacity = useTransform(heroP, [0, 0.45], [1, 0]);
  const heroTextY = useTransform(heroP, [0, 0.6], [0, -90]);
  const beamY = useTransform(heroP, [0, 1], [0, 140]);

  const names = event.person2Name
    ? [event.person1Name, event.person2Name]
    : [event.eventTitle];

  return (
    <div
      className="relative min-h-screen overflow-x-clip bg-[#06070d] font-sans text-[#f3efe6] antialiased"
      style={{ "--accent": accent } as React.CSSProperties}
    >
      <AuroraField reduce={reduce} />
      <CustomCursor />
      <ScrollProgress color="var(--accent)" />
      <SideNav sections={sections} />

      {/* ─────────────── OPENING SCENE ─────────────── */}
      <section id="opening" ref={heroRef} className="relative h-[100svh] min-h-[620px]">
        <motion.div
          style={reduce ? undefined : { scale: heroScale, borderRadius: heroRadius }}
          className="absolute inset-0 overflow-hidden"
        >
          <HeroMedia
            imageSrc={hero}
            videoSrc={event.heroVideoUrl || undefined}
            alt={event.eventTitle}
            className="opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#06070d]/55 via-[#06070d]/25 to-[#06070d]" />
          {!reduce && (
            <motion.div
              aria-hidden
              style={{ y: beamY }}
              className="absolute left-1/2 top-0 h-[120%] w-[60vw] -translate-x-1/2"
            >
              <div className="h-full w-full bg-[radial-gradient(ellipse_at_top,rgba(243,239,230,0.18),transparent_60%)]" />
            </motion.div>
          )}
        </motion.div>

        <motion.div
          style={reduce ? undefined : { opacity: heroTextOpacity, y: heroTextY }}
          className="relative z-10 flex h-full flex-col items-center justify-center px-5 text-center"
        >
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="font-script text-3xl text-[var(--accent)] sm:text-5xl"
          >
            {tagline}
          </motion.p>
          <h1 className="mt-3 font-display font-semibold uppercase leading-[0.92] tracking-tight">
            {names.map((n, i) => (
              <span key={i} className="block text-[clamp(2.8rem,13vw,11rem)]">
                {i === 1 && (
                  <span className="mr-3 font-script text-[0.4em] lowercase text-[var(--accent)]">&amp;</span>
                )}
                <NameReveal text={n} delay={0.35 + i * 0.5} />
              </span>
            ))}
          </h1>
          {event.mainDate && (
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.8 }}
              className="mt-6 text-xs uppercase tracking-[0.5em] text-white/70 sm:text-sm"
            >
              {new Date(event.mainDate).toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
              {event.city && ` · ${event.city}`}
            </motion.p>
          )}
          {!event.hideTimer && event.mainDate && (
            <motion.div
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.8 }}
              className="mt-10"
            >
              <Countdown
                target={`${event.mainDate}T${event.mainStartTime || "18:00"}:00`}
                label="Until the light"
              />
            </motion.div>
          )}
        </motion.div>

        {!reduce && (
          <motion.div
            aria-hidden
            animate={{ y: [0, 10, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2 text-[10px] uppercase tracking-[0.4em] text-white/60"
          >
            Scroll
          </motion.div>
        )}
      </section>

      {/* ─────────────── THE PROMISE ─────────────── */}
      {showStory && (
        <section id="promise" className="relative mx-auto max-w-5xl px-6 py-32 sm:py-48">
          <p className="mb-10 text-[11px] uppercase tracking-[0.5em] text-[var(--accent)]">
            The Promise
          </p>
          <WordReveal
            text={invitationMessage}
            className="font-display text-[clamp(1.8rem,4.5vw,3.6rem)] leading-[1.15]"
          />
        </section>
      )}

      {/* ─────────────── OUR STORY (broken parallax grid) ─────────────── */}
      {showStory && (aboutStory || storyItems.length > 0) && (
        <section className="relative mx-auto max-w-6xl px-6 pb-32 sm:pb-48">
          <div className="grid items-center gap-y-10 sm:grid-cols-12">
            {storyItems[0] && (
              <ParallaxBlock className="sm:col-span-5 sm:col-start-1" amount={reduce ? 0 : -60}>
                <Plate item={storyItems[0]} className="aspect-[4/5]" />
              </ParallaxBlock>
            )}
            <div className="sm:col-span-6 sm:col-start-7">
              <p className="mb-6 text-[11px] uppercase tracking-[0.5em] text-[var(--accent)]">
                Our Story
              </p>
              <WordReveal
                text={aboutStory}
                className="font-display text-2xl leading-snug text-white/85 sm:text-3xl"
              />
            </div>
            {storyItems[1] && (
              <ParallaxBlock
                className="sm:col-span-4 sm:col-start-9 sm:-mt-24"
                amount={reduce ? 0 : 60}
              >
                {/* deliberately bleeds toward the edge */}
                <Plate item={storyItems[1]} className="aspect-[3/4] sm:translate-x-12" />
              </ParallaxBlock>
            )}
          </div>
        </section>
      )}

      {/* ─────────────── MOMENTS FROZEN IN TIME ─────────────── */}
      {showMoments && (
        <section id="moments" aria-label="Moments" className="relative py-10">
          <div className="mb-8 px-6 sm:mb-2 sm:px-10">
            <p className="text-[11px] uppercase tracking-[0.5em] text-[var(--accent)]">
              Moments Frozen in Time
            </p>
          </div>
          {galleryItems.length === 0 && editing ? (
            <div className="mx-auto max-w-md px-6 py-16 text-center text-white/60">
              <div className="relative mx-auto aspect-[4/5] max-w-xs">
                <EditableImage section="gallery" src="" asAddTile alt="" />
              </div>
              <p className="mt-4 text-sm">Add photos to build your moments reel.</p>
            </div>
          ) : (
            <HorizontalMoments items={galleryItems} reduce={reduce} editing={editing} />
          )}
        </section>
      )}

      {/* ─────────────── JOURNEY THROUGH EVENTS ─────────────── */}
      {showJourney && (
        <section id="journey" className="relative py-32 sm:py-48">
          <p className="mb-16 px-6 text-center text-[11px] uppercase tracking-[0.5em] text-[var(--accent)]">
            Journey Through the Night
          </p>
          <Islands items={subEvents} />
        </section>
      )}

      {/* ─────────────── WHERE DESTINY AWAITS ─────────────── */}
      {showVenue && (
        <section id="destiny" className="relative mx-auto max-w-4xl px-6 py-32 sm:py-44">
          <p className="mb-8 text-center text-[11px] uppercase tracking-[0.5em] text-[var(--accent)]">
            Where Destiny Awaits
          </p>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 50, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 1, ease: EASE }}
            className="rounded-[2px] border border-white/10 bg-white/[0.04] p-3 backdrop-blur-2xl sm:p-5"
            style={{ boxShadow: "0 0 80px -20px var(--accent)" }}
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

      {/* ─────────────── FOREVER BEGINS HERE ─────────────── */}
      <section id="forever" className="relative px-6 py-36 text-center sm:py-52">
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: EASE }}
          aria-hidden
          className="mx-auto mb-12 h-40 w-40 rounded-full sm:h-56 sm:w-56"
          style={{
            background:
              "radial-gradient(circle, var(--accent), transparent 65%), radial-gradient(circle at 60% 40%, #9b6bff66, transparent 60%)",
            filter: "blur(6px)",
          }}
        />
        <p className="text-[11px] uppercase tracking-[0.5em] text-[var(--accent)]">Forever Begins Here</p>
        <h2 className="mx-auto mt-6 max-w-3xl font-display text-[clamp(2rem,6vw,4.5rem)] leading-[1.05]">
          {event.eventTitle}
        </h2>

        {event.rsvpEnabled && (
          <div className="mt-12">
            {event.rsvpLinkOrContact?.startsWith("http") ? (
              <Magnetic className="inline-block">
                <a
                  href={event.rsvpLinkOrContact}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block rounded-full border border-[var(--accent)] px-10 py-4 text-sm uppercase tracking-[0.35em] text-[var(--accent)] transition-colors hover:bg-[var(--accent)] hover:text-[#06070d]"
                >
                  Witness our vow
                </a>
              </Magnetic>
            ) : (
              <RSVP
                enabled={event.rsvpEnabled}
                linkOrContact={event.rsvpLinkOrContact}
                contactName={event.contactName}
              />
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

        <p className="mt-16 font-script text-3xl text-white/80 sm:text-4xl">
          {names.join("  &  ")}
        </p>
      </section>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

/* ── small helper: a block that parallaxes as it passes the viewport ── */
function ParallaxBlock({
  children,
  className,
  amount,
}: {
  children: React.ReactNode;
  className?: string;
  amount: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, amount]);
  return (
    <motion.div ref={ref} style={amount ? { y } : undefined} className={className}>
      {children}
    </motion.div>
  );
}

export default AuroraTemplate;
