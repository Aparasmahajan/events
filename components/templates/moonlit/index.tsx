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

const LANTERNS = Array.from({ length: 32 }, (_, i) => ({
  x: `${(i * 37 + 11) % 100}%`,
  delay: (i % 8) * 1.3,
  dur: 18 + (i % 5) * 3,
  size: 6 + (i % 4) * 2,
  drift: ((i % 7) - 3) * 4,
}));

const STARS = Array.from({ length: 60 }, (_, i) => ({
  x: `${(i * 53 + 3) % 100}%`,
  y: `${(i * 29 + 7) % 70}%`,
  size: 1 + (i % 3) * 0.4,
  delay: (i % 6) * 0.7,
}));

function MoonlitField({ reduce }: { reduce: boolean }) {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden bg-[#0d1a2f]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d1a2f] via-[#131f38] to-[#1a2540]" />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 110%, rgba(200,212,232,0.08), transparent 60%)" }} />
      <div className="absolute inset-0">
        {STARS.map((s, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-[#f0f3f8]"
            style={{ left: s.x, top: s.y, width: s.size, height: s.size, boxShadow: "0 0 4px rgba(240,243,248,0.6)" }}
            animate={reduce ? undefined : { opacity: [0.2, 0.9, 0.2] }}
            transition={{ duration: 3, delay: s.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>
      {!reduce && (
        <div className="absolute inset-0">
          {LANTERNS.map((l, i) => (
            <motion.span
              key={i}
              className="absolute rounded-[40%]"
              style={{
                left: l.x,
                bottom: "-4vh",
                width: l.size,
                height: l.size * 1.4,
                background: "radial-gradient(circle at 50% 40%, #ffe0a8, #f4c67a 55%, #b3823a 100%)",
                boxShadow: "0 0 12px #f4c67a, 0 0 28px rgba(244,198,122,0.5)",
              }}
              animate={{ y: [0, -window_h()], x: [0, l.drift * 4, l.drift * -2], opacity: [0, 0.9, 0.9, 0] }}
              transition={{ duration: l.dur, delay: l.delay, repeat: Infinity, ease: "linear", times: [0, 0.15, 0.85, 1] }}
            />
          ))}
        </div>
      )}
      <svg aria-hidden viewBox="0 0 1440 400" preserveAspectRatio="none" className="absolute bottom-0 left-0 w-full opacity-60" style={{ height: "42vh" }}>
        <defs>
          <linearGradient id="moonlit-castle" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#0a1224" stopOpacity="0.95" />
            <stop offset="1" stopColor="#0a1224" stopOpacity="1" />
          </linearGradient>
        </defs>
        <path fill="url(#moonlit-castle)" d="M0,400 L0,260 L60,260 L60,220 L90,200 L120,220 L120,180 L160,150 L200,180 L200,240 L260,240 L260,190 L310,160 L360,190 L360,230 L430,230 L430,170 L480,140 L530,170 L530,220 L620,220 L620,150 L680,110 L740,150 L740,210 L830,210 L830,170 L890,140 L950,170 L950,230 L1030,230 L1030,180 L1090,150 L1150,180 L1150,240 L1230,240 L1230,200 L1290,175 L1350,200 L1350,250 L1440,250 L1440,400 Z" />
      </svg>
      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(13,26,47,0) 60%, rgba(13,26,47,0.6) 100%)" }} />
    </div>
  );
}

function window_h() {
  if (typeof window === "undefined") return 1000;
  return window.innerHeight + 200;
}

function CarvedTitle({ text }: { text: string }) {
  const reduce = useReducedMotion();
  return (
    <span className="inline-block">
      {Array.from(text).map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={reduce ? false : { opacity: 0, y: 20, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: i * 0.05, ease: EASE }}
          style={{
            background: "linear-gradient(180deg, #ffffff 0%, #f0f3f8 40%, #a8b4c8 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            textShadow: "0 1px 0 rgba(255,255,255,0.15), 0 -1px 2px rgba(0,0,0,0.5)",
            filter: "drop-shadow(0 0 18px rgba(200,212,232,0.35))",
          }}
        >
          {ch === " " ? " " : ch}
        </motion.span>
      ))}
    </span>
  );
}

function CandleIcon({ accent, reduce }: { accent: string; reduce: boolean }) {
  return (
    <div className="relative flex h-10 w-6 flex-col items-center">
      <motion.div
        className="h-2 w-1.5 rounded-full"
        style={{ background: `radial-gradient(circle, #ffe0a8, ${accent} 60%, transparent 100%)`, boxShadow: `0 0 10px ${accent}` }}
        animate={reduce ? undefined : { scaleY: [1, 1.25, 0.9, 1.1, 1], scaleX: [1, 0.9, 1.05, 0.95, 1], opacity: [0.85, 1, 0.9, 1, 0.85] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="mt-0.5 h-6 w-1.5 rounded-sm bg-gradient-to-b from-[#f0f3f8] to-[#a8b4c8]" />
    </div>
  );
}

function StoneCard({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
      className={`relative rounded-md border border-[#c8d4e8]/15 bg-[#0d1a2f]/50 p-6 backdrop-blur-xl ${className ?? ""}`}
      style={{ boxShadow: "inset 0 1px 0 rgba(240,243,248,0.08), 0 20px 40px rgba(0,0,0,0.4)" }}
    >
      <div className="pointer-events-none absolute inset-0 rounded-md" style={{ background: "linear-gradient(140deg, rgba(240,243,248,0.05), transparent 40%)" }} />
      <div className="relative">{children}</div>
    </motion.div>
  );
}

function MoonlitTimeline({ items, accent }: { items: SubEvent[]; accent: string }) {
  const reduce = !!useReducedMotion();
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <div className="mx-auto max-w-4xl px-6">
      <div className="relative">
        <div
          aria-hidden
          className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2"
          style={{ background: `linear-gradient(to bottom, transparent, ${accent}55, transparent)` }}
        />
        <div className="space-y-8">
          {sorted.map((s, i) => (
            <motion.article
              key={s.order}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
              className={`relative flex items-center gap-6 ${i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"} flex-col`}
            >
              <div className="hidden sm:flex sm:w-1/2 sm:justify-end">
                {i % 2 === 0 && <div className="w-full max-w-sm"><StoneCard delay={i * 0.05}><CardContents s={s} accent={accent} /></StoneCard></div>}
              </div>
              <div className="relative flex flex-col items-center">
                <CandleIcon accent="#f4c67a" reduce={reduce} />
              </div>
              <div className="hidden sm:flex sm:w-1/2">
                {i % 2 === 1 && <div className="w-full max-w-sm"><StoneCard delay={i * 0.05}><CardContents s={s} accent={accent} /></StoneCard></div>}
              </div>
              <div className="w-full sm:hidden">
                <StoneCard delay={i * 0.05}><CardContents s={s} accent={accent} /></StoneCard>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}

function CardContents({ s, accent }: { s: SubEvent; accent: string }) {
  return (
    <>
      <p className="text-[10px] uppercase tracking-[0.35em]" style={{ color: accent }}>
        {[s.date, s.startTime].filter(Boolean).join(" · ")}
      </p>
      <h3 className="mt-2 font-display text-2xl tracking-wide" style={{ color: "#f0f3f8" }}>{s.name}</h3>
      {s.venueName && <p className="mt-1 text-sm italic opacity-70">at {s.venueName}</p>}
      {s.description && <p className="mt-3 text-sm leading-relaxed opacity-70">{s.description}</p>}
      {s.dressCode && (
        <p className="mt-4 inline-block rounded-full border border-[#c8d4e8]/25 px-3 py-1 text-[10px] uppercase tracking-[0.25em] opacity-70">
          {s.dressCode}
        </p>
      )}
    </>
  );
}

export const MoonlitTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || "#c8d4e8";
  const tagline = event.tagline?.trim() || "Under the light of a thousand lanterns";
  const invitationMessage = event.invitationMessage?.trim() || "Two hearts are called to the moonlit court. Beneath silver skies, we ask you to stand as witness to a union written in the stars.";
  const aboutStory = event.aboutStory?.trim() || "A love story spun beneath the same moon that has watched every royal court, every quiet promise, every lantern set adrift. Tonight, ours joins that endless sky.";
  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const hero = event.heroImageUrl || "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80";

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(heroP, [0, 1], [1, 0.94]);
  const heroTextY = useTransform(heroP, [0, 0.6], [0, -60]);
  const heroOpacity = useTransform(heroP, [0, 0.6], [1, 0]);
  const moonY = useTransform(heroP, [0, 1], [0, 80]);

  const showStory = !event.hideStory;
  const showJourney = !event.hideEvents && subEvents.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  const names = [event.person1Name, event.person2Name].filter(Boolean).join("  ❀  ");

  return (
    <div
      className="relative min-h-screen overflow-x-clip bg-[#0d1a2f] font-serif text-[#f0f3f8] antialiased"
      style={{ "--accent": accent } as React.CSSProperties}
    >
      <MoonlitField reduce={reduce} />
      <ScrollProgress color={accent} />

      {/* ─── HERO ─── */}
      <section ref={heroRef} className="relative flex h-[100svh] min-h-[680px] items-center justify-center overflow-hidden">
        <motion.div style={reduce ? undefined : { scale: heroScale }} className="absolute inset-0">
          <HeroMedia imageSrc={hero} videoSrc={event.heroVideoUrl || undefined} alt={event.eventTitle} className="opacity-35" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1a2f] via-[#0d1a2f]/60 to-[#0d1a2f]/30" />
        </motion.div>

        <motion.div
          aria-hidden
          style={reduce ? undefined : { y: moonY }}
          className="pointer-events-none absolute right-[8%] top-[10%] h-[38vw] max-h-[520px] w-[38vw] max-w-[520px]"
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: "radial-gradient(circle at 42% 42%, #ffffff 0%, #f0f3f8 40%, #c8d4e8 70%, transparent 100%)",
              boxShadow: "0 0 120px 40px rgba(200,212,232,0.35), inset -30px -40px 80px rgba(120,140,180,0.35)",
            }}
          />
          <motion.div
            className="absolute inset-[-25%] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(200,212,232,0.25), transparent 60%)" }}
            animate={reduce ? undefined : { opacity: [0.6, 0.9, 0.6] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        <motion.div style={reduce ? undefined : { y: heroTextY, opacity: heroOpacity }} className="relative z-10 px-6 text-center">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: EASE }}
            className="mb-8 text-[11px] uppercase tracking-[0.6em]"
            style={{ color: accent }}
          >
            {tagline}
          </motion.p>
          <h1 className="font-display text-[clamp(2.8rem,10vw,7.5rem)] font-semibold leading-[0.95] tracking-wide">
            {event.eventTitle.split(" ").map((w, i) => (
              <span key={i} className="block">
                <CarvedTitle text={w} />
              </span>
            ))}
          </h1>
          {names && (
            <motion.p
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="mt-8 text-sm uppercase tracking-[0.55em]"
              style={{ color: "#f4c67a" }}
            >
              {names}
            </motion.p>
          )}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="mt-10 flex flex-wrap justify-center gap-4 text-xs uppercase tracking-[0.4em] opacity-75"
          >
            {event.mainDate && (
              <span>{new Date(event.mainDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</span>
            )}
            {event.mainStartTime && <span className="opacity-60">❀</span>}
            {event.mainStartTime && <span>{event.mainStartTime}</span>}
            {event.city && <><span className="opacity-60">❀</span><span>{event.city}</span></>}
          </motion.div>
        </motion.div>
      </section>

      {/* ─── STORY ─── */}
      {showStory && (
        <section className="relative mx-auto max-w-5xl px-6 py-28 sm:py-40">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: EASE }}
            className="text-center"
          >
            <p className="mb-6 text-[10px] uppercase tracking-[0.6em]" style={{ color: accent }}>An Invitation</p>
            <h2 className="font-display text-[clamp(1.7rem,3.6vw,2.6rem)] italic leading-[1.35] tracking-wide" style={{ color: "#f0f3f8" }}>
              &ldquo;{invitationMessage}&rdquo;
            </h2>
            <motion.div
              className="mx-auto mt-10 h-px w-40"
              style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
              animate={reduce ? undefined : { opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <p className="mx-auto mt-10 max-w-2xl text-base leading-relaxed opacity-75 sm:text-lg">{aboutStory}</p>
          </motion.div>
        </section>
      )}

      {/* ─── SUB-EVENTS ─── */}
      {showJourney && (
        <section className="relative py-24 sm:py-32">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-16 text-center text-[10px] uppercase tracking-[0.6em] opacity-80"
            style={{ color: accent }}
          >
            A Royal Pathway
          </motion.p>
          <MoonlitTimeline items={subEvents} accent={accent} />
        </section>
      )}

      {/* ─── GALLERY ─── */}
      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-12 text-center text-[10px] uppercase tracking-[0.6em] opacity-80"
            style={{ color: accent }}
          >
            Moments in Moonlight
          </motion.p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((m, i) => (
              <motion.div
                key={`${m.fileName}-${i}`}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.06, ease: EASE }}
                className="group relative overflow-hidden rounded-md border border-[#c8d4e8]/10"
                style={{ boxShadow: "0 20px 40px rgba(0,0,0,0.35)" }}
              >
                <img
                  src={m.publicUrl}
                  alt={m.caption ?? ""}
                  className="aspect-[4/5] w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1a2f] via-transparent to-transparent opacity-70" />
                {m.caption && (
                  <p className="absolute bottom-3 left-4 right-4 text-[11px] uppercase tracking-[0.3em] opacity-80">{m.caption}</p>
                )}
              </motion.div>
            ))}
            {editing && galleryItems.length === 0 && (
              <div className="col-span-full flex h-56 items-center justify-center rounded-md border border-dashed border-[#c8d4e8]/30 text-sm opacity-60">
                + Add photos
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── VENUE ─── */}
      {showVenue && (
        <section className="relative mx-auto max-w-5xl px-6 py-24 sm:py-32">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-4 text-center text-[10px] uppercase tracking-[0.6em] opacity-80"
            style={{ color: accent }}
          >
            The Kingdom Awaits
          </motion.p>
          {event.venueName && (
            <h3 className="mb-8 text-center font-display text-2xl tracking-wide sm:text-3xl">{event.venueName}</h3>
          )}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE }}
            className="overflow-hidden rounded-md border border-[#c8d4e8]/15 bg-[#0d1a2f]/60 p-1 backdrop-blur-xl"
            style={{ boxShadow: "inset 0 1px 0 rgba(240,243,248,0.08), 0 30px 60px rgba(0,0,0,0.5)" }}
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

      {/* ─── CTA / RSVP ─── */}
      <section className="relative px-6 py-28 text-center sm:py-40">
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: EASE }}
          className="mx-auto max-w-3xl"
        >
          <motion.div
            aria-hidden
            animate={reduce ? undefined : { scale: [1, 1.08, 1], opacity: [0.4, 0.75, 0.4] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="mx-auto mb-12 h-32 w-32 rounded-full sm:h-40 sm:w-40"
            style={{
              background: `radial-gradient(circle, #f4c67a, ${accent} 40%, transparent 75%)`,
              filter: "blur(18px)",
            }}
          />
          <h2 className="font-display text-[clamp(2.2rem,6vw,4.5rem)] leading-[0.95] tracking-wide">
            <CarvedTitle text={names || event.eventTitle} />
          </h2>
          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <motion.div whileHover={reduce ? undefined : { scale: 1.03 }} className="mt-14 inline-block">
              <a
                href={event.rsvpLinkOrContact}
                target="_blank"
                rel="noreferrer"
                className="inline-block rounded-full border px-14 py-4 text-sm uppercase tracking-[0.4em] transition-all"
                style={{
                  borderColor: `${accent}55`,
                  color: "#f0f3f8",
                  background: "rgba(240,243,248,0.04)",
                  boxShadow: `0 0 40px rgba(200,212,232,0.15), inset 0 1px 0 rgba(240,243,248,0.1)`,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 0 60px ${accent}, inset 0 1px 0 rgba(240,243,248,0.2)`; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = `0 0 40px rgba(200,212,232,0.15), inset 0 1px 0 rgba(240,243,248,0.1)`; }}
              >
                Grace us with your presence
              </a>
            </motion.div>
          )}
        </motion.div>
      </section>

      <footer className="border-t border-[#c8d4e8]/10 py-10 text-center text-xs tracking-[0.3em] opacity-50">
        <p className="uppercase">{event.eventTitle}{names ? ` · ${names}` : ""}</p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default MoonlitTemplate;
