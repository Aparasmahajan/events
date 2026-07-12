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

const PARTICLES = Array.from({ length: 54 }, (_, i) => {
  const a = (i * 137.508) % 360;
  const r = 30 + ((i * 17) % 55);
  const rad = (a * Math.PI) / 180;
  const sx = 50 + Math.cos(rad) * r;
  const sy = 50 + Math.sin(rad) * r;
  const tx = 50 + Math.cos(rad) * (6 + (i % 5) * 1.2);
  const ty = 50 + Math.sin(rad) * (14 + (i % 7) * 1.4);
  const highlight = i % 9 === 0;
  return { sx, sy, tx, ty, size: highlight ? 3 : 1.6, highlight, delay: (i % 12) * 0.03 };
});

const LAYERS = [
  { code: "L.01", label: "Foundation", desc: "Structural intent. The idea that carries every subsequent decision." },
  { code: "L.02", label: "Skeleton", desc: "The wireframe. Load paths, section spacing, the invisible geometry underneath." },
  { code: "L.03", label: "Surface", desc: "Materials selected. Palette, typography, the tactile character of the object." },
  { code: "L.04", label: "Circuitry", desc: "Motion, interaction, the systems that make it react to a hand or a gaze." },
  { code: "L.05", label: "Signal", desc: "Delivery. The moment it leaves the workshop and belongs to whoever is watching." },
];

function ParticleField({ progress, reduce, accent, highlight }: { progress: any; reduce: boolean; accent: string; highlight: string }) {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      {PARTICLES.map((p, i) => (
        <Particle key={i} p={p} progress={progress} reduce={reduce} accent={accent} highlight={highlight} i={i} />
      ))}
    </div>
  );
}

function Particle({ p, progress, reduce, accent, highlight, i }: any) {
  const x = useTransform(progress, [0, 0.9], [p.sx, p.tx]);
  const y = useTransform(progress, [0, 0.9], [p.sy, p.ty]);
  const op = useTransform(progress, [0, 0.15, 1], [0.35, 1, 0.85]);
  const color = p.highlight ? highlight : accent;
  return (
    <motion.span
      className="absolute rounded-full"
      style={reduce ? {
        left: `${p.tx}%`,
        top: `${p.ty}%`,
        width: p.size,
        height: p.size,
        background: color,
        boxShadow: `0 0 ${p.highlight ? 8 : 4}px ${color}`,
      } : {
        left: x as any,
        top: y as any,
        width: p.size,
        height: p.size,
        background: color,
        opacity: op as any,
        boxShadow: `0 0 ${p.highlight ? 8 : 4}px ${color}`,
        translateX: "-50%",
        translateY: "-50%",
      }}
    />
  );
}

function GenesisField({ reduce }: { reduce: boolean }) {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden bg-[#0a0a0a]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#111114] to-[#0a0a0a]" />
      <svg className="absolute inset-0 h-full w-full opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid-gen" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#3a4045" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-gen)" />
      </svg>
      {!reduce && (
        <svg className="absolute inset-0 h-full w-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <filter id="gen-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" />
          </filter>
          <rect width="100%" height="100%" filter="url(#gen-noise)" />
        </svg>
      )}
    </div>
  );
}

function SectionMeter({ progress, accent }: { progress: any; accent: string }) {
  const h = useTransform(progress, [0, 1], ["0%", "100%"]);
  return (
    <div aria-hidden className="fixed right-4 top-24 z-40 hidden h-[55vh] w-[2px] bg-white/[0.06] sm:block">
      <motion.div className="absolute inset-x-0 top-0" style={{ height: h as any, background: accent, boxShadow: `0 0 8px ${accent}` }} />
      {[0.2, 0.4, 0.6, 0.8].map((t) => (
        <span key={t} className="absolute -left-1 w-2 h-[1px] bg-[#3a4045]" style={{ top: `${t * 100}%` }} />
      ))}
    </div>
  );
}

function LayerCard({ layer, i, accent, highlight }: { layer: typeof LAYERS[number]; i: number; accent: string; highlight: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
      className="relative overflow-hidden border border-[#3a4045] bg-[#0a0a0a]/60 p-6 backdrop-blur-sm"
    >
      <motion.div
        aria-hidden
        initial={reduce ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: i * 0.08 + 0.15, ease: EASE }}
        className="absolute inset-y-0 left-0 w-[3px] origin-top"
        style={{ background: accent }}
      />
      <div className="flex items-center gap-3">
        <span className="font-mono text-[10px] tracking-[0.25em]" style={{ color: highlight }}>{layer.code}</span>
        <span className="h-px flex-1 bg-[#3a4045]" />
        <span className="font-mono text-[10px] tracking-[0.25em] opacity-40">0{i + 1}/05</span>
      </div>
      <h3 className="mt-5 font-display text-2xl font-black uppercase leading-none tracking-tight text-[#f5f2ea]">
        {layer.label}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-[#f5f2ea]/60">{layer.desc}</p>
    </motion.article>
  );
}

function RunOfShow({ items, accent, highlight }: { items: SubEvent[]; accent: string; highlight: string }) {
  const reduce = useReducedMotion();
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <div className="mx-auto max-w-4xl px-6">
      <div className="border-y border-[#3a4045]">
        {sorted.map((s, i) => (
          <motion.div
            key={s.order}
            initial={reduce ? false : { opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className="grid grid-cols-[80px_1fr_auto] items-center gap-4 border-b border-[#3a4045] py-6 last:border-b-0 sm:grid-cols-[110px_1fr_auto]"
          >
            <span className="font-mono text-[10px] tracking-[0.25em]" style={{ color: highlight }}>
              T-{String(sorted.length - i).padStart(2, "0")}
            </span>
            <div>
              <h4 className="font-display text-lg uppercase tracking-tight text-[#f5f2ea]">{s.name}</h4>
              {s.venueName && <p className="mt-1 text-xs text-[#f5f2ea]/50">{s.venueName}</p>}
              {s.description && <p className="mt-1 text-xs leading-relaxed text-[#f5f2ea]/40">{s.description}</p>}
            </div>
            <div className="text-right font-mono text-[10px] tracking-[0.2em] text-[#f5f2ea]/60">
              {s.date && <div>{new Date(s.date).toLocaleDateString("en-US", { month: "short", day: "2-digit" })}</div>}
              {s.startTime && <div className="mt-1 opacity-60">{s.startTime}</div>}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export const GenesisTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || "#ff5147";
  const highlight = "#4dd0ff";
  const tagline = event.tagline?.trim() || "Something is being built.";
  const invitationMessage = event.invitationMessage?.trim() || "A launch, engineered layer by layer. You are invited to see the first unit leave the line.";
  const aboutStory = event.aboutStory?.trim() || "Every product carries the fingerprints of the people who assembled it. This one carries yours.";
  const hero = event.heroImageUrl || "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80";
  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);

  const showStory = !event.hideStory;
  const showEvents = !event.hideEvents && subEvents.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroTextY = useTransform(heroP, [0, 1], [0, -60]);
  const heroTextOp = useTransform(heroP, [0, 0.7], [1, 0]);

  const pageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: pageP } = useScroll({ target: pageRef, offset: ["start start", "end end"] });

  const ctaRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: ctaP } = useScroll({ target: ctaRef, offset: ["start end", "end start"] });
  const ctaDisperse = useTransform(ctaP, [0.2, 0.8], [0.9, 0]);

  return (
    <div
      ref={pageRef}
      className="relative min-h-screen overflow-x-clip bg-[#0a0a0a] font-sans text-[#f5f2ea] antialiased"
      style={{ "--accent": accent } as React.CSSProperties}
    >
      <GenesisField reduce={reduce} />
      <ScrollProgress color={accent} />
      <SectionMeter progress={pageP} accent={accent} />

      {/* HERO — particle field forming the object */}
      <section ref={heroRef} className="relative flex h-[100svh] min-h-[640px] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <HeroMedia imageSrc={hero} videoSrc={event.heroVideoUrl || undefined} alt={event.eventTitle} className="opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a]/50 to-[#0a0a0a]" />
        </div>

        <ParticleField progress={heroP} reduce={reduce} accent={accent} highlight={highlight} />

        <motion.div style={reduce ? undefined : { y: heroTextY, opacity: heroTextOp }} className="relative z-10 px-6 text-center">
          <div className="mb-6 flex items-center justify-center gap-3 font-mono text-[10px] tracking-[0.4em]">
            <span className="h-px w-8 bg-[#3a4045]" />
            <span style={{ color: highlight }}>SEQ.001</span>
            <span className="opacity-40">/</span>
            <span className="opacity-60">{tagline.toUpperCase()}</span>
            <span className="h-px w-8 bg-[#3a4045]" />
          </div>
          <h1 className="font-display text-[clamp(2.75rem,11vw,8rem)] font-black uppercase leading-[0.9] tracking-tight text-[#f5f2ea]">
            {event.eventTitle}
          </h1>
          <div className="mx-auto mt-8 flex max-w-md items-center justify-center gap-4 font-mono text-[10px] tracking-[0.3em] text-[#f5f2ea]/70">
            {event.mainDate && (
              <span>{new Date(event.mainDate).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }).toUpperCase()}</span>
            )}
            {event.mainStartTime && <span className="opacity-40">·</span>}
            {event.mainStartTime && <span>{event.mainStartTime}</span>}
            {event.city && <><span className="opacity-40">·</span><span>{event.city.toUpperCase()}</span></>}
          </div>
        </motion.div>

        {!reduce && (
          <motion.div
            animate={{ y: [0, 6, 0], opacity: [0.3, 0.9, 0.3] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.4em]"
            style={{ color: highlight }}
          >
            ASSEMBLING ↓
          </motion.div>
        )}
      </section>

      {/* STORY + ASSEMBLY LAYERS */}
      {showStory && (
        <section className="relative mx-auto max-w-6xl px-6 py-28 sm:py-36">
          <div className="mb-14 grid gap-10 sm:grid-cols-[1fr_1.4fr]">
            <div>
              <p className="font-mono text-[10px] tracking-[0.4em]" style={{ color: highlight }}>MANIFEST / 02</p>
              <div className="mt-3 h-px w-16" style={{ background: accent }} />
              <h2 className="mt-6 font-display text-3xl font-black uppercase leading-[1.05] tracking-tight sm:text-4xl">
                {invitationMessage}
              </h2>
            </div>
            <div className="sm:pt-14">
              <p className="text-base leading-relaxed text-[#f5f2ea]/60 sm:text-lg">{aboutStory}</p>
              <div className="mt-6 grid grid-cols-3 gap-3 font-mono text-[10px] tracking-[0.2em] text-[#f5f2ea]/50">
                <div><span className="block text-[#f5f2ea]/30">ITER.</span>V.01</div>
                <div><span className="block text-[#f5f2ea]/30">MODE</span>ASSEMBLY</div>
                <div><span className="block text-[#f5f2ea]/30">STATUS</span><span style={{ color: accent }}>ACTIVE</span></div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {LAYERS.map((l, i) => (
              <LayerCard key={l.code} layer={l} i={i} accent={accent} highlight={highlight} />
            ))}
          </div>
        </section>
      )}

      {/* RUN OF SHOW */}
      {showEvents && (
        <section className="relative py-24 sm:py-32">
          <div className="mx-auto mb-12 max-w-4xl px-6">
            <p className="font-mono text-[10px] tracking-[0.4em]" style={{ color: highlight }}>SEQUENCE / 03</p>
            <div className="mt-3 h-px w-16" style={{ background: accent }} />
            <h2 className="mt-6 font-display text-3xl font-black uppercase leading-[1.05] tracking-tight sm:text-4xl">The run of show</h2>
          </div>
          <RunOfShow items={subEvents} accent={accent} highlight={highlight} />
        </section>
      )}

      {/* GALLERY */}
      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <div className="mb-10">
            <p className="font-mono text-[10px] tracking-[0.4em]" style={{ color: highlight }}>ARCHIVE / 04</p>
            <div className="mt-3 h-px w-16" style={{ background: accent }} />
            <h2 className="mt-6 font-display text-3xl font-black uppercase leading-[1.05] tracking-tight sm:text-4xl">Behind the build</h2>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((m, i) => (
              <motion.figure
                key={`${m.fileName}-${i}`}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (i % 6) * 0.05 }}
                className="group relative overflow-hidden border border-[#3a4045]"
              >
                <img
                  src={m.publicUrl}
                  alt={m.caption ?? ""}
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-[#0a0a0a] to-transparent px-3 pb-2 pt-8 font-mono text-[9px] tracking-[0.3em] text-[#f5f2ea]/70">
                  <span>UNIT.{String(i + 1).padStart(3, "0")}</span>
                  <span style={{ color: highlight }}>·</span>
                </div>
              </motion.figure>
            ))}
            {editing && galleryItems.length === 0 && (
              <div className="col-span-full flex h-56 items-center justify-center border border-dashed border-white/20 font-mono text-xs tracking-[0.3em] opacity-50">
                + ADD PHOTOS
              </div>
            )}
          </div>
        </section>
      )}

      {/* VENUE */}
      {showVenue && (
        <section className="relative mx-auto max-w-5xl px-6 py-24 sm:py-32">
          <div className="mb-8">
            <p className="font-mono text-[10px] tracking-[0.4em]" style={{ color: highlight }}>COORDINATES / 05</p>
            <div className="mt-3 h-px w-16" style={{ background: accent }} />
            <h2 className="mt-6 font-display text-3xl font-black uppercase leading-[1.05] tracking-tight sm:text-4xl">
              {event.venueName || "The location"}
            </h2>
            {event.venueAddress && <p className="mt-3 font-mono text-xs tracking-[0.15em] text-[#f5f2ea]/50">{event.venueAddress}</p>}
          </div>
          <div className="overflow-hidden border border-[#3a4045] bg-[#0a0a0a]/60 p-1">
            <MapEmbed
              latitude={event.latitude}
              longitude={event.longitude}
              venueName={event.venueName}
              venueAddress={event.venueAddress}
              mapLink={event.mapLink}
            />
          </div>
        </section>
      )}

      {/* CTA — particles disperse */}
      <section ref={ctaRef} className="relative overflow-hidden px-6 py-32 text-center sm:py-44">
        <motion.div
          aria-hidden
          className="absolute inset-0 opacity-40"
          style={reduce ? undefined : { opacity: ctaDisperse as any }}
        >
          <ParticleField progress={heroP} reduce={reduce} accent={accent} highlight={highlight} />
        </motion.div>
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE }}
          className="relative mx-auto max-w-3xl"
        >
          <p className="font-mono text-[10px] tracking-[0.4em]" style={{ color: highlight }}>DISPATCH / 06</p>
          <div className="mx-auto mt-3 h-px w-16" style={{ background: accent }} />
          <h2 className="mt-6 font-display text-[clamp(2.25rem,7vw,5rem)] font-black uppercase leading-[0.95] tracking-tight">
            Get on the invite list
          </h2>
          {event.person1Name && (
            <p className="mt-4 font-mono text-[10px] tracking-[0.35em] text-[#f5f2ea]/60">
              HOSTED BY {event.person1Name.toUpperCase()}{event.person2Name ? ` · ${event.person2Name.toUpperCase()}` : ""}
            </p>
          )}
          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <a
              href={event.rsvpLinkOrContact}
              target="_blank"
              rel="noreferrer"
              className="mt-10 inline-block border px-10 py-4 font-mono text-xs tracking-[0.35em] transition-all"
              style={{ background: accent, color: "#0a0a0a", borderColor: accent }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 0 32px ${accent}`; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}
            >
              REQUEST INVITE →
            </a>
          )}
        </motion.div>
      </section>

      <footer className="border-t border-[#3a4045] px-6 py-8 text-center font-mono text-[10px] tracking-[0.3em] text-[#f5f2ea]/40">
        <p>{event.eventTitle.toUpperCase()}{event.person1Name ? ` · ${event.person1Name.toUpperCase()}` : ""} · GENESIS.V01</p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default GenesisTemplate;
