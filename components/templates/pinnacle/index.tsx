"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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

const SPARKLES = Array.from({ length: 40 }, (_, i) => ({
  x: `${(i * 29 + 11) % 100}%`,
  y: `${(i * 13 + 23) % 100}%`,
  size: 1 + (i % 2),
  delay: (i % 8) * 0.4,
}));

function LightField({ reduce }: { reduce: boolean }) {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden bg-[#f8f9fc]">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-[#f0f4ff] to-[#e8edf5]" />
      {!reduce && (
        <>
          {SPARKLES.map((s, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full"
              style={{
                left: s.x, top: s.y, width: s.size, height: s.size,
                background: i % 2 === 0 ? "#d4a853" : "#a8c8f0",
              }}
              animate={{ opacity: [0, 0.8, 0], scale: [0, 1.5, 0] }}
              transition={{ duration: 3 + (i % 5), delay: s.delay, repeat: Infinity }}
            />
          ))}
          <svg className="absolute inset-0 h-full w-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="pinnacle-glow" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#d4a853" stopOpacity="0.3" />
                <stop offset="50%" stopColor="transparent" />
                <stop offset="100%" stopColor="#a8c8f0" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#pinnacle-glow)" />
          </svg>
        </>
      )}
    </div>
  );
}

function ElevatedTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <span className={`inline-block overflow-hidden ${className ?? ""}`}>
      <motion.span
        className="inline-block"
        initial={reduce ? false : { y: "120%", opacity: 0, rotateX: 25 }}
        whileInView={{ y: "0%", opacity: 1, rotateX: 0 }}
        viewport={{ once: true, margin: "-8% 0px" }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

function GlassCard({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      whileHover={reduce ? undefined : { y: -3, boxShadow: "0 20px 60px -20px rgba(212, 168, 83, 0.2)" }}
      className={`rounded-2xl border border-black/[0.04] bg-white/70 p-6 backdrop-blur-xl shadow-lg shadow-black/[0.02] transition-all ${className ?? ""}`}
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/80 to-transparent" />
      <div className="relative">{children}</div>
    </motion.div>
  );
}

function SummitTimeline({ items }: { items: SubEvent[] }) {
  const reduce = useReducedMotion();
  const sorted = [...items].sort((a, b) => a.order - b.order);
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setActive(Number(e.target.getAttribute("data-order")));
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px" },
    );
    const els = sectionRef.current?.querySelectorAll("[data-order]");
    els?.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={sectionRef} className="mx-auto max-w-5xl px-6">
      <div className="flex gap-6 sm:gap-10">
        <div className="relative flex flex-col items-center">
          <div className="h-full w-px bg-black/[0.06]" />
          {sorted.map((s) => (
            <motion.button
              key={s.order}
              data-order={s.order}
              animate={{ scale: active === s.order ? 1 : 0.7, opacity: active === s.order ? 1 : 0.3 }}
              className="absolute h-3 w-3 rounded-full border-2"
              style={{ top: `${(s.order / (sorted.length + 1)) * 100}%`, borderColor: "var(--accent)", background: active === s.order ? "var(--accent)" : "white" }}
              onClick={() => document.getElementById(`summit-event-${s.order}`)?.scrollIntoView({ behavior: "smooth" })}
            />
          ))}
        </div>
        <div className="flex-1 space-y-20">
          {sorted.map((s, i) => (
            <motion.div
              key={s.order}
              id={`summit-event-${s.order}`}
              data-order={s.order}
              initial={reduce ? false : { opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
            >
              <GlassCard delay={i * 0.05}>
                <div className="flex items-start gap-4">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
                    style={{ background: "var(--accent)" }}
                  >
                    {String(s.order).padStart(2, "0")}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-display text-2xl sm:text-3xl">{s.name}</h3>
                    <p className="mt-1 text-sm uppercase tracking-[0.2em] opacity-50">
                      {[s.date, s.startTime && `${s.startTime}${s.endTime ? `\u2013${s.endTime}` : ""}`].filter(Boolean).join("  \u00B7  ")}
                    </p>
                    {s.venueName && <p className="mt-2 text-sm opacity-70">at {s.venueName}</p>}
                    {s.description && <p className="mt-3 leading-relaxed opacity-70">{s.description}</p>}
                    {s.dressCode && <p className="mt-2 text-xs uppercase tracking-[0.25em] opacity-50">Dress code: {s.dressCode}</p>}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const PinnacleTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || "#d4a853";
  const tagline = event.tagline?.trim() || "Where leaders ascend.";
  const invitationMessage = event.invitationMessage?.trim() || "Join the brightest minds at the peak of industry conversation.";
  const aboutStory = event.aboutStory?.trim() || "";
  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const hero = event.heroImageUrl || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1600&q=80";

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroP, [0, 1], [0, 120]);
  const heroOpacity = useTransform(heroP, [0, 0.5], [1, 0]);
  const titleY = useTransform(heroP, [0, 0.6], [0, -80]);

  const showStory = !event.hideStory;
  const showJourney = !event.hideEvents && subEvents.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  return (
    <div
      className="relative min-h-screen overflow-x-clip bg-[#f8f9fc] font-sans text-[#0f172a] antialiased"
      style={{ "--accent": accent } as React.CSSProperties}
    >
      <LightField reduce={reduce} />
      <ScrollProgress color={accent} />

      {/* ─── 01. SUMMIT HERO ─── */}
      <section ref={heroRef} className="relative h-[100svh] min-h-[620px] flex items-center justify-center overflow-hidden">
        <motion.div style={reduce ? undefined : { y: heroY }} className="absolute inset-0">
          <HeroMedia imageSrc={hero} videoSrc={event.heroVideoUrl || undefined} alt={event.eventTitle} />
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/20 to-white" />
        </motion.div>
        <motion.div style={reduce ? undefined : { opacity: heroOpacity, y: titleY }} className="relative z-10 text-center px-5 max-w-5xl">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-5 text-xs uppercase tracking-[0.6em] opacity-60"
          >
            {tagline}
          </motion.p>
          <h1 className="font-display text-[clamp(2.8rem,9vw,8rem)] font-light leading-[0.95] tracking-tight text-[#0f172a]">
            {event.eventTitle.split(" ").map((w, i) => (
              <span key={i} className="inline-block overflow-hidden pb-[0.08em]">
                <motion.span
                  className="inline-block"
                  initial={reduce ? false : { y: "120%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  transition={{ duration: 0.9, delay: 0.3 + i * 0.08, ease: EASE }}
                >
                  {w}&nbsp;
                </motion.span>
              </span>
            ))}
          </h1>
          {event.city && (
            <motion.p
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="mt-6 text-sm tracking-[0.3em] uppercase opacity-50"
            >
              {event.city}
            </motion.p>
          )}
        </motion.div>
        {!reduce && (
          <motion.div
            animate={{ y: [0, 8, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.4em] opacity-40"
          >
            Ascend
          </motion.div>
        )}
      </section>

      {/* ─── 02. MANIFESTO ─── */}
      {showStory && (
        <section className="relative mx-auto max-w-5xl px-6 py-28 sm:py-44">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-3 text-[10px] uppercase tracking-[0.5em] opacity-50"
          >
            The Summit
          </motion.p>
          <div className="grid gap-10 sm:grid-cols-5">
            <div className="sm:col-span-3">
              <h2 className="font-display text-3xl leading-[1.1] sm:text-5xl">
                {invitationMessage.split(" ").map((w, i) => (
                  <ElevatedTitle key={i}>{w}&nbsp;</ElevatedTitle>
                ))}
              </h2>
            </div>
            <div className="sm:col-span-2 sm:self-end">
              <p className="text-base leading-relaxed opacity-60 sm:text-lg">
                {aboutStory || "A gathering of pioneers, builders, and visionaries — three days of conversations that will define the next decade."}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ─── 03. AT A GLANCE ─── */}
      <section className="relative mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <div className="grid gap-4 sm:grid-cols-4">
          {[
            { label: "Speakers", value: "24+" },
            { label: "Attendees", value: "800" },
            { label: "Days", value: "3" },
            { label: "Tracks", value: "4" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
              className="rounded-2xl border border-black/[0.04] bg-white/60 p-6 text-center backdrop-blur-sm"
            >
              <span className="block font-display text-3xl sm:text-4xl" style={{ color: accent }}>{s.value}</span>
              <span className="mt-1 block text-xs uppercase tracking-[0.2em] opacity-50">{s.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── 04. AGENDA ─── */}
      {showJourney && (
        <section className="relative py-24 sm:py-36">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-16 text-center text-[10px] uppercase tracking-[0.5em] opacity-50"
          >
            Agenda
          </motion.p>
          <SummitTimeline items={subEvents} />
        </section>
      )}

      {/* ─── 05. GALLERY ─── */}
      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-20 sm:py-32">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-4 text-center text-[10px] uppercase tracking-[0.5em] opacity-50"
          >
            From the summit
          </motion.p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((m, i) => (
              <motion.div
                key={`${m.fileName}-${i}`}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="group relative overflow-hidden rounded-2xl"
              >
                <img
                  src={m.publicUrl}
                  alt={m.caption ?? ""}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                {m.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                    <p className="text-sm text-white/90">{m.caption}</p>
                  </div>
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
          >
            Venue
          </motion.p>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: EASE }}
            className="overflow-hidden rounded-2xl border border-black/[0.04] bg-white/60 p-2 backdrop-blur-sm shadow-lg"
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

      {/* ─── 07. REGISTER ─── */}
      <section className="relative px-6 py-28 text-center sm:py-44">
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: EASE }}
          className="mx-auto max-w-3xl"
        >
          <h2 className="font-display text-[clamp(2rem,6vw,5rem)] font-light leading-[1.05]">
            {event.eventTitle}
          </h2>
          {event.person1Name && (
            <p className="mt-4 text-lg opacity-50">{event.person1Name}</p>
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
                Register now
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

export default PinnacleTemplate;
