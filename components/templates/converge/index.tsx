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
import { MusicToggle } from "@/components/ui/MusicToggle";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { useEditMode } from "@/components/edit/EditContext";
import type { TemplateComponent, SubEvent } from "@/lib/types";

const EASE = [0.16, 1, 0.3, 1] as const;

const BLOBS = [
  { cx: "15%", cy: "20%", r: "18vw", c: "#f5a623", d: 0 },
  { cx: "85%", cy: "30%", r: "14vw", c: "#1a7a7a", d: 4 },
  { cx: "50%", cy: "80%", r: "22vw", c: "#f7615f", d: 2 },
  { cx: "20%", cy: "70%", r: "12vw", c: "#f5a623", d: 6 },
  { cx: "75%", cy: "75%", r: "16vw", c: "#1a7a7a", d: 3 },
];

const FLOATING_DOTS = Array.from({ length: 50 }, (_, i) => ({
  x: `${(i * 37 + 13) % 100}%`,
  y: `${(i * 23 + 7) % 100}%`,
  size: 2 + (i % 4),
  delay: (i % 10) * 0.5,
  dur: 8 + (i % 12),
  hue: i % 3,
}));

function OrganicField({ reduce }: { reduce: boolean }) {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden bg-[#faf6f0]">
      {BLOBS.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-[0.07]"
          style={{
            left: b.cx, top: b.cy, width: b.r, height: b.r,
            marginLeft: `calc(-${b.r} / 2)`, marginTop: `calc(-${b.r} / 2)`,
            background: `radial-gradient(circle, ${b.c}, transparent 70%)`,
          }}
          animate={reduce ? undefined : {
            x: [0, 30, -20, 0], y: [0, -20, 25, 0], scale: [1, 1.08, 0.95, 1],
          }}
          transition={{ duration: 16 + i * 4, delay: b.d, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      {!reduce && FLOATING_DOTS.map((d, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{
            left: d.x, top: d.y, width: d.size, height: d.size,
            background: [ "#f5a623", "#1a7a7a", "#f7615f" ][d.hue],
          }}
          animate={{ y: ["0vh", "-15vh", "0vh"], opacity: [0, 0.6, 0], scale: [0, 1.5, 0] }}
          transition={{ duration: d.dur, delay: d.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-[#faf6f0]/60 via-transparent to-[#faf6f0]" />
    </div>
  );
}

function NodeConnection({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const pathRef = useRef<SVGPathElement>(null);
  const [length, setLength] = useState(0);

  useEffect(() => {
    if (pathRef.current) setLength(pathRef.current.getTotalLength());
  }, []);

  return (
    <svg className={className} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <motion.path
        ref={pathRef}
        d="M20 100 Q 50 20, 100 50 T 180 100"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="0.8"
        strokeDasharray={length}
        strokeDashoffset={reduce ? 0 : length}
        animate={reduce ? undefined : { strokeDashoffset: 0 }}
        transition={{ duration: 2, ease: EASE }}
      />
      {[20, 100, 180].map((x, i) => (
        <motion.circle
          key={i}
          cx={x} cy={x === 100 ? 50 : 100}
          r="4"
          fill="var(--accent)"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.3, 0.8] }}
          transition={{ delay: 0.5 + i * 0.3, duration: 0.6 }}
        />
      ))}
    </svg>
  );
}

function OrganicCard({
  children,
  className,
  delay = 0,
  index = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  index?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rot = useTransform(scrollYProgress, [0, 1], [index % 2 === 0 ? 3 : -3, index % 2 === 0 ? -3 : 3]);

  return (
    <motion.div
      ref={ref}
      style={reduce ? undefined : { rotate: rot }}
      initial={reduce ? false : { opacity: 0, y: 30, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      whileHover={reduce ? undefined : { y: -4, scale: 1.01 }}
      className={`relative rounded-3xl border border-black/[0.06] bg-white/70 p-6 backdrop-blur-md shadow-sm transition-all ${className ?? ""}`}
    >
      <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-white/60 to-transparent" />
      <div className="relative">{children}</div>
    </motion.div>
  );
}

function ConnectTimeline({ items }: { items: SubEvent[] }) {
  const reduce = useReducedMotion();
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <div className="mx-auto max-w-4xl px-6">
      <div className="grid gap-6 sm:grid-cols-2">
        {sorted.map((s, i) => (
          <motion.article
            key={s.order}
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className={i === sorted.length - 1 && sorted.length % 2 === 1 ? "sm:col-span-2 sm:mx-auto sm:max-w-md" : ""}
          >
            <OrganicCard delay={i * 0.05} index={i}>
              <div className="flex items-center gap-3 mb-3">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ background: "var(--accent)" }}
                >
                  {s.order}
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] opacity-50">
                  {[s.date, s.startTime].filter(Boolean).join(" \u00B7 ")}
                </span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl">{s.name}</h3>
              {s.venueName && <p className="mt-1 text-sm opacity-60">at {s.venueName}</p>}
              {s.description && <p className="mt-2 text-sm leading-relaxed opacity-65">{s.description}</p>}
              {s.dressCode && (
                <p className="mt-3 inline-block rounded-full bg-black/[0.04] px-3 py-1 text-[10px] uppercase tracking-[0.2em] opacity-50">
                  {s.dressCode}
                </p>
              )}
            </OrganicCard>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

export const ConvergeTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || "#f5a623";
  const tagline = event.tagline?.trim() || "Where connections find their moment.";
  const invitationMessage = event.invitationMessage?.trim() || "Come as you are. Leave with a network that believes in what you build.";
  const aboutStory = event.aboutStory?.trim() || "";
  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const hero = event.heroImageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1600&q=80";

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroP, [0, 1], [0, 80]);
  const heroOpacity = useTransform(heroP, [0, 0.5], [1, 0]);

  const showStory = !event.hideStory;
  const showJourney = !event.hideEvents && subEvents.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  return (
    <div
      className="relative min-h-screen overflow-x-clip bg-[#faf6f0] font-sans text-[#1a1a2e] antialiased"
      style={{ "--accent": accent } as React.CSSProperties}
    >
      <OrganicField reduce={reduce} />
      <ScrollProgress color={accent} />

      {/* ─── 01. WELCOME ─── */}
      <section ref={heroRef} className="relative h-[100svh] min-h-[620px] flex items-center justify-center overflow-hidden">
        <motion.div style={reduce ? undefined : { y: heroY }} className="absolute inset-0">
          <HeroMedia imageSrc={hero} videoSrc={event.heroVideoUrl || undefined} alt={event.eventTitle} className="opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#faf6f0]/40 via-[#faf6f0]/20 to-[#faf6f0]" />
        </motion.div>
        <motion.div style={reduce ? undefined : { opacity: heroOpacity }} className="relative z-10 text-center px-5 max-w-4xl">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-4 text-xs uppercase tracking-[0.5em] opacity-60"
            style={{ color: accent }}
          >
            {tagline}
          </motion.p>
          <h1 className="font-display text-[clamp(2.8rem,9vw,7rem)] font-bold leading-[0.92] tracking-tight">
            {event.eventTitle.split(" ").map((w, i) => (
              <span key={i} className="inline-block overflow-hidden pb-[0.04em]">
                <motion.span
                  className="inline-block"
                  initial={reduce ? false : { y: "120%", rotate: 8, opacity: 0 }}
                  animate={{ y: "0%", rotate: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 + i * 0.06, ease: EASE }}
                >
                  {w}&nbsp;
                </motion.span>
              </span>
            ))}
          </h1>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {["Connect", "Share", "Grow"].map((w, i) => (
              <motion.span
                key={w}
                initial={reduce ? false : { opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + i * 0.15, duration: 0.5 }}
                className="inline-block rounded-full px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-white"
                style={{ background: accent }}
              >
                {w}
              </motion.span>
            ))}
          </div>
          {event.mainDate && (
            <motion.p
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.8 }}
              className="mt-8 text-sm uppercase tracking-[0.4em] opacity-60"
            >
              {new Date(event.mainDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              {event.mainStartTime && ` \u00B7 ${event.mainStartTime}`}
              {event.city && ` \u00B7 ${event.city}`}
            </motion.p>
          )}
        </motion.div>
        {!reduce && (
          <motion.div
            animate={{ y: [0, 10, 0], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.4em] opacity-50"
          >
            Enter the circle
          </motion.div>
        )}
      </section>

      {/* ─── 02. THE GATHERING ─── */}
      {showStory && (
        <section className="relative mx-auto max-w-5xl px-6 py-28 sm:py-44">
          <div className="grid items-center gap-12 sm:grid-cols-2">
            <motion.div
              initial={reduce ? false : { opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: EASE }}
            >
              <p className="mb-3 text-[10px] uppercase tracking-[0.5em] opacity-50" style={{ color: accent }}>
                The Gathering
              </p>
              <h2 className="font-display text-3xl leading-[1.1] sm:text-4xl">{invitationMessage}</h2>
            </motion.div>
            <motion.div
              initial={reduce ? false : { opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2, ease: EASE }}
            >
              <p className="text-base leading-relaxed opacity-65 sm:text-lg">
                {aboutStory || "An evening designed for serendipity. No name tags, no awkward icebreakers. Just the right people, in the right room, at the right moment."}
              </p>
              <NodeConnection className="mt-8 h-24 w-full max-w-xs opacity-40" />
            </motion.div>
          </div>
        </section>
      )}

      {/* ─── 03. WHAT TO EXPECT ─── */}
      <section className="relative mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-10 text-center text-[10px] uppercase tracking-[0.5em] opacity-50"
          style={{ color: accent }}
        >
          What to expect
        </motion.p>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { icon: "○", title: "Warm Welcome", desc: "Arrive to a space that feels familiar. Coffee, conversation, community." },
            { icon: "◇", title: "Meaningful Exchange", desc: "Structured serendipity — conversations that go beyond the weather." },
            { icon: "◎", title: "Lasting Impact", desc: "Leave with contacts, ideas, and energy you didn't have when you arrived." },
          ].map((e, i) => (
            <OrganicCard key={e.title} delay={i * 0.12} index={i}>
              <span className="text-2xl opacity-60">{e.icon}</span>
              <h3 className="mt-3 font-display text-lg sm:text-xl">{e.title}</h3>
              <p className="mt-2 text-sm leading-relaxed opacity-60">{e.desc}</p>
            </OrganicCard>
          ))}
        </div>
      </section>

      {/* ─── 04. SCHEDULE ─── */}
      {showJourney && (
        <section className="relative py-24 sm:py-36">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-14 text-center text-[10px] uppercase tracking-[0.5em] opacity-50"
            style={{ color: accent }}
          >
            The Flow
          </motion.p>
          <ConnectTimeline items={subEvents} />
        </section>
      )}

      {/* ─── 05. GALLERY ─── */}
      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-20 sm:py-32">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-10 text-center text-[10px] uppercase tracking-[0.5em] opacity-50"
            style={{ color: accent }}
          >
            Past connections
          </motion.p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((m, i) => (
              <motion.div
                key={`${m.fileName}-${i}`}
                initial={reduce ? false : { opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.04 }}
                className="group relative overflow-hidden rounded-2xl"
              >
                <img
                  src={m.publicUrl}
                  alt={m.caption ?? ""}
                  className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e]/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                {m.caption && (
                  <p className="absolute bottom-3 left-3 right-3 text-sm text-white/90 opacity-0 transition-opacity group-hover:opacity-100">
                    {m.caption}
                  </p>
                )}
              </motion.div>
            ))}
            {editing && galleryItems.length === 0 && (
              <div className="col-span-full flex h-48 items-center justify-center rounded-2xl border border-dashed border-black/20 text-sm opacity-50">
                + Add photos
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── 06. VENUE ─── */}
      {showVenue && (
        <section className="relative mx-auto max-w-5xl px-6 py-20 sm:py-32">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-4 text-center text-[10px] uppercase tracking-[0.5em] opacity-50"
            style={{ color: accent }}
          >
            Where we meet
          </motion.p>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white/60 p-2 backdrop-blur-sm shadow-sm"
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

      {/* ─── 07. JOIN ─── */}
      <section className="relative px-6 py-28 text-center sm:py-44">
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: EASE }}
          className="mx-auto max-w-3xl"
        >
          <div
            aria-hidden
            className="mx-auto mb-10 h-24 w-24 rounded-full opacity-20 sm:h-32 sm:w-32"
            style={{
              background: `radial-gradient(circle, ${accent}, transparent 70%)`,
              filter: "blur(16px)",
            }}
          />
          <h2 className="font-display text-[clamp(2rem,6vw,4.5rem)] font-bold leading-[1.05]">
            {event.eventTitle}
          </h2>
          {event.person1Name && (
            <p className="mt-4 text-lg opacity-60">{event.person1Name}</p>
          )}
          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <motion.div
              whileHover={reduce ? undefined : { scale: 1.02 }}
              className="mt-10 inline-block"
            >
              <a
                href={event.rsvpLinkOrContact}
                target="_blank"
                rel="noreferrer"
                className="inline-block rounded-full border-2 px-12 py-4 text-sm uppercase tracking-[0.35em] transition-all hover:text-white"
                style={{ borderColor: accent, color: accent }}
                onMouseEnter={(e) => { e.currentTarget.style.background = accent; e.currentTarget.style.color = "white"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = accent; }}
              >
                Join the circle
              </a>
            </motion.div>
          )}
        </motion.div>
      </section>

      <footer className="border-t border-black/[0.04] py-8 text-center text-xs opacity-40">
        <p>{event.eventTitle}{event.person1Name ? ` \u00B7 ${event.person1Name}` : ""}</p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default ConvergeTemplate;
