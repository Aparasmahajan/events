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

const PETAL_COUNT = 8;
const PETALS = Array.from({ length: PETAL_COUNT }, (_, i) => {
  const angle = (360 / PETAL_COUNT) * i;
  return { angle, delay: i * 0.06, id: i };
});

const DRIFT_PETALS = Array.from({ length: 14 }, (_, i) => ({
  left: `${(i * 37 + 11) % 100}%`,
  delay: (i % 7) * 0.6,
  dur: 12 + (i % 5) * 3,
  size: 14 + (i % 4) * 6,
  rotate: (i * 47) % 360,
}));

const PETAL_CLIP =
  "polygon(50% 0%, 78% 8%, 96% 32%, 100% 62%, 82% 92%, 50% 100%, 18% 92%, 0% 62%, 4% 32%, 22% 8%)";

function GlassField({ reduce }: { reduce: boolean }) {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 0%, #fde4ea 0%, #f8d0d8 40%, #f0b8c8 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(60% 40% at 80% 20%, rgba(255,255,255,0.7), transparent 60%), radial-gradient(50% 50% at 15% 75%, rgba(200,138,104,0.15), transparent 60%)",
        }}
      />
      {!reduce && (
        <div className="absolute inset-0">
          {DRIFT_PETALS.map((p, i) => (
            <motion.svg
              key={i}
              className="absolute"
              style={{ left: p.left, top: "-8%", width: p.size, height: p.size }}
              viewBox="0 0 24 24"
              animate={{
                y: ["0vh", "110vh"],
                rotate: [p.rotate, p.rotate + 220],
                opacity: [0, 0.7, 0],
              }}
              transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "linear" }}
            >
              <path
                d="M12 2 C 16 6, 20 10, 12 22 C 4 10, 8 6, 12 2 Z"
                fill="rgba(255,255,255,0.65)"
                stroke="#c88a68"
                strokeOpacity="0.25"
                strokeWidth="0.6"
              />
            </motion.svg>
          ))}
        </div>
      )}
    </div>
  );
}

function BloomingRose({
  progress,
  reduce,
  accent,
}: {
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  reduce: boolean;
  accent: string;
}) {
  const spread = useTransform(progress, [0, 1], [0, 90]);
  const scale = useTransform(progress, [0, 1], [0.3, 1]);
  const rot = useTransform(progress, [0, 1], [40, 0]);

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <motion.div
        className="relative"
        style={reduce ? { width: 480, height: 480 } : { width: 480, height: 480 }}
      >
        {PETALS.map((p) => {
          const rad = (p.angle * Math.PI) / 180;
          return (
            <motion.div
              key={p.id}
              className="absolute left-1/2 top-1/2"
              style={
                reduce
                  ? {
                      width: 160,
                      height: 210,
                      marginLeft: -80,
                      marginTop: -180,
                      transform: `rotate(${p.angle}deg) translateY(-90px)`,
                      clipPath: PETAL_CLIP,
                      background:
                        "linear-gradient(160deg, rgba(255,255,255,0.7), rgba(248,208,216,0.55))",
                      border: "1px solid rgba(200,138,104,0.35)",
                      backdropFilter: "blur(8px)",
                    }
                  : {
                      width: 160,
                      height: 210,
                      marginLeft: -80,
                      marginTop: -180,
                      clipPath: PETAL_CLIP,
                      background:
                        "linear-gradient(160deg, rgba(255,255,255,0.72), rgba(248,208,216,0.5))",
                      border: "1px solid rgba(200,138,104,0.35)",
                      backdropFilter: "blur(8px)",
                      transform: useTransform(
                        [spread, scale, rot],
                        ([s, sc, r]: number[]) =>
                          `rotate(${p.angle + r}deg) translateY(${-40 - s}px) scale(${sc})`,
                      ),
                    }
              }
            />
          );
        })}
        <div
          className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background: `radial-gradient(circle, ${accent} 0%, rgba(94,26,46,0.5) 60%, transparent 100%)`,
            boxShadow: `0 0 60px ${accent}`,
          }}
        />
      </motion.div>
    </div>
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
      initial={reduce ? false : { opacity: 0, y: 24, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.8, delay, ease: EASE }}
      className={`relative rounded-3xl border p-8 ${className ?? ""}`}
      style={{
        background: "rgba(255,255,255,0.4)",
        borderColor: "rgba(255,255,255,0.6)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.8), inset 0 0 40px rgba(240,184,200,0.35), 0 20px 60px -30px rgba(94,26,46,0.35)",
      }}
    >
      {children}
    </motion.div>
  );
}

function RoseTimeline({ items, accent }: { items: SubEvent[]; accent: string }) {
  const reduce = useReducedMotion();
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <div className="mx-auto max-w-4xl px-6">
      <div className="grid gap-6 sm:grid-cols-2">
        {sorted.map((s, i) => (
          <motion.article
            key={s.order}
            initial={reduce ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
          >
            <GlassCard delay={i * 0.05}>
              <div className="flex items-center gap-3 mb-3">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-semibold"
                  style={{ background: accent, color: "#fff" }}
                >
                  {String(s.order).padStart(2, "0")}
                </span>
                <span className="text-[10px] uppercase tracking-[0.28em]" style={{ color: "#5e1a2e", opacity: 0.6 }}>
                  {[s.date, s.startTime].filter(Boolean).join(" · ")}
                </span>
              </div>
              <h3 className="font-display text-2xl tracking-tight" style={{ color: "#5e1a2e" }}>
                {s.name}
              </h3>
              {s.venueName && (
                <p className="mt-1 text-sm italic" style={{ color: "#5e1a2e", opacity: 0.7 }}>
                  at {s.venueName}
                </p>
              )}
              {s.description && (
                <p className="mt-3 text-sm leading-relaxed" style={{ color: "#5e1a2e", opacity: 0.75 }}>
                  {s.description}
                </p>
              )}
              {s.dressCode && (
                <p
                  className="mt-4 inline-block rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.22em]"
                  style={{ borderColor: "rgba(200,138,104,0.5)", color: "#c88a68" }}
                >
                  {s.dressCode}
                </p>
              )}
            </GlassCard>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

export const GlassroseTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || "#c88a68";
  const tagline = event.tagline?.trim() || "A promise, sealed in petals of light";
  const invitationMessage =
    event.invitationMessage?.trim() ||
    "Step into a rose of crystal and love — where every petal holds a moment, and every moment holds our forever.";
  const aboutStory =
    event.aboutStory?.trim() ||
    "We met like two petals drifting on the same breeze, and now we bloom together. What began as a quiet whisper has grown into a garden of shared dreams — and today, we invite you inside the rose we've built.";
  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const hero =
    event.heroImageUrl ||
    "https://images.unsplash.com/photo-1521543387203-e1e69f6fc06e?auto=format&fit=crop&w=1600&q=80";

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroTextY = useTransform(heroP, [0, 0.5], [0, -60]);
  const heroOpacity = useTransform(heroP, [0, 0.7], [1, 0]);
  const bloomP = useTransform(heroP, [0, 1], [0, 1]);

  const showStory = !event.hideStory;
  const showJourney = !event.hideEvents && subEvents.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  const coupleLine = event.person2Name
    ? `${event.person1Name} · ${event.person2Name}`
    : event.person1Name;

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-sans antialiased"
      style={{ "--accent": accent, color: "#5e1a2e" } as React.CSSProperties}
    >
      <GlassField reduce={reduce} />
      <ScrollProgress color={accent} />

      <section ref={heroRef} className="relative h-[110svh] min-h-[720px] overflow-hidden">
        <div className="absolute inset-0">
          <HeroMedia
            imageSrc={hero}
            videoSrc={event.heroVideoUrl || undefined}
            alt={event.eventTitle}
            className="opacity-30"
          />
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(60% 60% at 50% 50%, transparent, rgba(248,208,216,0.85))" }}
          />
        </div>

        <BloomingRose progress={bloomP} reduce={reduce} accent={accent} />

        <motion.div
          style={reduce ? undefined : { y: heroTextY, opacity: heroOpacity }}
          className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
        >
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="mb-8 font-display text-xs uppercase italic tracking-[0.55em]"
            style={{ color: accent }}
          >
            {tagline}
          </motion.p>
          <h1 className="font-display text-[clamp(3rem,10vw,7.5rem)] leading-[0.92] tracking-tight" style={{ color: "#5e1a2e" }}>
            <span className="block italic font-light">{event.person1Name}</span>
            {event.person2Name && (
              <>
                <motion.span
                  initial={reduce ? false : { opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, duration: 0.8, ease: EASE }}
                  className="mx-6 inline-block align-middle text-3xl italic"
                  style={{ color: accent }}
                >
                  &
                </motion.span>
                <span className="block italic font-light">{event.person2Name}</span>
              </>
            )}
          </h1>
          {event.mainDate && (
            <motion.p
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="mt-10 text-xs uppercase tracking-[0.5em]"
              style={{ color: "#5e1a2e", opacity: 0.7 }}
            >
              {new Date(event.mainDate).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
              {event.city ? ` · ${event.city}` : ""}
            </motion.p>
          )}
        </motion.div>

        {!reduce && (
          <motion.div
            animate={{ y: [0, 8, 0], opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 font-display text-[10px] uppercase italic tracking-[0.5em]"
            style={{ color: accent }}
          >
            scroll to bloom
          </motion.div>
        )}
      </section>

      {showStory && (
        <section className="relative mx-auto max-w-5xl px-6 py-28 sm:py-36">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-4 text-center font-display text-[11px] uppercase italic tracking-[0.55em]"
            style={{ color: accent }}
          >
            The First Petal
          </motion.p>
          <GlassCard>
            <p className="mx-auto max-w-2xl text-center font-display text-2xl italic leading-relaxed sm:text-3xl" style={{ color: "#5e1a2e" }}>
              &ldquo;{invitationMessage}&rdquo;
            </p>
            <motion.div
              className="mx-auto mt-8 h-px w-24"
              style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
              animate={reduce ? undefined : { opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2.4, repeat: Infinity }}
            />
            <p className="mx-auto mt-8 max-w-2xl text-center text-base leading-relaxed" style={{ color: "#5e1a2e", opacity: 0.78 }}>
              {aboutStory}
            </p>
          </GlassCard>
        </section>
      )}

      {showJourney && (
        <section className="relative py-24 sm:py-32">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-12 text-center font-display text-[11px] uppercase italic tracking-[0.55em]"
            style={{ color: accent }}
          >
            Petals of the Day
          </motion.p>
          <RoseTimeline items={subEvents} accent={accent} />
        </section>
      )}

      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-12 text-center font-display text-[11px] uppercase italic tracking-[0.55em]"
            style={{ color: accent }}
          >
            Memories in Bloom
          </motion.p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((m, i) => (
              <motion.div
                key={`${m.fileName}-${i}`}
                initial={reduce ? false : { opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.06, ease: EASE }}
                className="group relative"
                style={{ padding: 6, background: "rgba(255,255,255,0.5)", border: "1px solid rgba(200,138,104,0.4)", clipPath: PETAL_CLIP, backdropFilter: "blur(10px)" }}
              >
                <div className="relative overflow-hidden" style={{ clipPath: PETAL_CLIP }}>
                  <img
                    src={m.publicUrl}
                    alt={m.caption ?? ""}
                    className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              </motion.div>
            ))}
            {editing && galleryItems.length === 0 && (
              <div
                className="col-span-full flex h-56 items-center justify-center rounded-3xl border border-dashed text-sm italic"
                style={{ borderColor: accent, color: "#5e1a2e", opacity: 0.6, background: "rgba(255,255,255,0.35)" }}
              >
                + Add petals to your gallery
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
            className="mb-6 text-center font-display text-[11px] uppercase italic tracking-[0.55em]"
            style={{ color: accent }}
          >
            Where the Rose Opens
          </motion.p>
          <GlassCard className="!p-3">
            {event.venueName && (
              <p className="px-4 pt-3 pb-2 text-center font-display text-2xl italic" style={{ color: "#5e1a2e" }}>
                {event.venueName}
              </p>
            )}
            {event.venueAddress && (
              <p className="px-4 pb-4 text-center text-sm" style={{ color: "#5e1a2e", opacity: 0.7 }}>
                {event.venueAddress}
              </p>
            )}
            <div className="overflow-hidden rounded-2xl">
              <MapEmbed
                latitude={event.latitude}
                longitude={event.longitude}
                venueName={event.venueName}
                venueAddress={event.venueAddress}
                mapLink={event.mapLink}
              />
            </div>
          </GlassCard>
        </section>
      )}

      <section className="relative px-6 py-28 text-center sm:py-40">
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: EASE }}
          className="mx-auto max-w-3xl"
        >
          <motion.div
            aria-hidden
            animate={reduce ? undefined : { scale: [1, 1.08, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="mx-auto mb-8 h-28 w-28 rounded-full opacity-70"
            style={{
              background: `radial-gradient(circle, ${accent} 0%, rgba(248,208,216,0.4) 55%, transparent 80%)`,
              filter: "blur(16px)",
            }}
          />
          <h2 className="font-display text-[clamp(2.5rem,7vw,5.5rem)] italic font-light leading-[1] tracking-tight" style={{ color: "#5e1a2e" }}>
            {coupleLine}
          </h2>
          {event.mainDate && (
            <p className="mt-6 text-xs uppercase tracking-[0.5em]" style={{ color: accent }}>
              {new Date(event.mainDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
          )}
          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <motion.div whileHover={reduce ? undefined : { scale: 1.04 }} className="mt-12 inline-block">
              <a
                href={event.rsvpLinkOrContact}
                target="_blank"
                rel="noreferrer"
                className="inline-block rounded-full px-14 py-4 font-display text-sm uppercase italic tracking-[0.4em] transition-all"
                style={{
                  background: "rgba(255,255,255,0.55)",
                  color: "#5e1a2e",
                  border: `1px solid ${accent}`,
                  backdropFilter: "blur(10px)",
                  boxShadow: `0 10px 30px -12px ${accent}`,
                }}
              >
                Accept the Rose
              </a>
            </motion.div>
          )}
        </motion.div>
      </section>

      <footer className="border-t py-8 text-center text-xs italic" style={{ borderColor: "rgba(200,138,104,0.3)", color: "#5e1a2e", opacity: 0.55 }}>
        <p>
          {event.eventTitle}
          {event.person1Name ? ` · ${coupleLine}` : ""}
        </p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default GlassroseTemplate;
