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

const CLOUDS = [
  { x: "5%", y: "12%", w: 420, h: 140, dur: 48, delay: 0, opacity: 0.85 },
  { x: "28%", y: "62%", w: 520, h: 170, dur: 62, delay: 4, opacity: 0.7 },
  { x: "55%", y: "22%", w: 360, h: 120, dur: 54, delay: 2, opacity: 0.9 },
  { x: "72%", y: "70%", w: 480, h: 160, dur: 70, delay: 6, opacity: 0.75 },
  { x: "82%", y: "8%", w: 300, h: 110, dur: 44, delay: 3, opacity: 0.8 },
  { x: "12%", y: "80%", w: 400, h: 140, dur: 58, delay: 5, opacity: 0.65 },
];

const BIRDS = Array.from({ length: 9 }, (_, i) => ({
  startX: (i * 137) % 100,
  startY: (i * 53) % 80,
  dur: 22 + (i % 4) * 5,
  delay: (i % 6) * 2.4,
  size: 14 + (i % 3) * 4,
}));

function SkyField({ reduce }: { reduce: boolean }) {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #dfeaf6 0%, #d3e0ee 45%, #c8dae8 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, rgba(250,247,240,0.55), transparent 55%), radial-gradient(ellipse at 75% 80%, rgba(230,201,136,0.18), transparent 60%)",
        }}
      />
      {!reduce && (
        <>
          {CLOUDS.map((c, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                left: c.x,
                top: c.y,
                width: c.w,
                height: c.h,
                background:
                  "radial-gradient(ellipse at 40% 45%, rgba(255,255,255,0.95), rgba(250,247,240,0.6) 55%, rgba(173,195,216,0.0) 78%)",
                filter: "blur(6px)",
                opacity: c.opacity,
              }}
              animate={{ x: [0, 60, 0], y: [0, -12, 0] }}
              transition={{
                duration: c.dur,
                delay: c.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
          {BIRDS.map((b, i) => (
            <motion.svg
              key={i}
              className="absolute"
              style={{ left: `${b.startX}%`, top: `${b.startY}%` }}
              width={b.size}
              height={b.size * 0.6}
              viewBox="0 0 24 14"
              animate={{ x: ["-4vw", "108vw"], y: [0, -40, 20, -10] }}
              transition={{
                duration: b.dur,
                delay: b.delay,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <path
                d="M1 8 Q6 1 12 7 Q18 1 23 8"
                stroke="#e6c988"
                strokeWidth="1.6"
                fill="none"
                strokeLinecap="round"
              />
            </motion.svg>
          ))}
        </>
      )}
    </div>
  );
}

function TempleDoors({ accent, reduce }: { accent: string; reduce: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const leftRot = useTransform(scrollYProgress, [0, 0.6], [0, -85]);
  const rightRot = useTransform(scrollYProgress, [0, 0.6], [0, 85]);
  const glow = useTransform(scrollYProgress, [0, 0.5], [0.2, 0.9]);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
      style={{ perspective: "1400px" }}
    >
      <motion.div
        style={{
          opacity: reduce ? 0.6 : glow,
          width: "60%",
          height: "80%",
          background:
            `radial-gradient(ellipse at center, ${accent}55, ${accent}22 45%, transparent 70%)`,
          filter: "blur(30px)",
        }}
        className="absolute"
      />
      <motion.div
        style={{
          rotateY: reduce ? 0 : leftRot,
          transformOrigin: "left center",
          background:
            "linear-gradient(180deg, #faf7f0 0%, #f0e9d8 50%, #d9cba4 100%)",
          boxShadow: "inset -20px 0 40px rgba(38,54,78,0.15), 0 20px 60px rgba(38,54,78,0.2)",
        }}
        className="relative h-[70%] w-[26%] rounded-t-[50%] border-r-2"
      >
        <div
          className="absolute inset-x-4 top-6 bottom-8 rounded-t-[50%] border"
          style={{ borderColor: `${accent}66` }}
        />
      </motion.div>
      <motion.div
        style={{
          rotateY: reduce ? 0 : rightRot,
          transformOrigin: "right center",
          background:
            "linear-gradient(180deg, #faf7f0 0%, #f0e9d8 50%, #d9cba4 100%)",
          boxShadow: "inset 20px 0 40px rgba(38,54,78,0.15), 0 20px 60px rgba(38,54,78,0.2)",
        }}
        className="relative h-[70%] w-[26%] rounded-t-[50%] border-l-2"
      >
        <div
          className="absolute inset-x-4 top-6 bottom-8 rounded-t-[50%] border"
          style={{ borderColor: `${accent}66` }}
        />
      </motion.div>
    </div>
  );
}

function SkyBridge({ items, accent }: { items: SubEvent[]; accent: string }) {
  const reduce = useReducedMotion();
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <div className="relative mx-auto max-w-5xl px-6">
      <div className="grid gap-16 sm:gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((s, i) => (
          <motion.div
            key={s.order}
            initial={reduce ? false : { opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8% 0px" }}
            transition={{ duration: 0.8, delay: i * 0.12, ease: EASE }}
            className="relative"
          >
            <div
              aria-hidden
              className="absolute -bottom-6 left-1/2 h-8 w-[110%] -translate-x-1/2 rounded-[50%]"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(255,255,255,0.95), rgba(173,195,216,0.35) 55%, transparent 78%)",
                filter: "blur(4px)",
              }}
            />
            {i < sorted.length - 1 && (
              <svg
                aria-hidden
                className="absolute -right-8 top-1/2 hidden h-16 w-16 -translate-y-1/2 lg:block"
                viewBox="0 0 60 60"
              >
                <path
                  d="M4 44 Q30 4 56 44"
                  stroke={accent}
                  strokeWidth="1"
                  fill="none"
                  strokeDasharray="3 4"
                  opacity="0.65"
                />
              </svg>
            )}
            <article
              className="relative rounded-t-[40%] rounded-b-2xl border p-6 pt-8 shadow-[0_20px_60px_-20px_rgba(38,54,78,0.35)] backdrop-blur-sm"
              style={{
                background:
                  "linear-gradient(180deg, rgba(250,247,240,0.95), rgba(250,247,240,0.78))",
                borderColor: "rgba(230,201,136,0.5)",
              }}
            >
              <span
                className="mx-auto mb-4 flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-semibold"
                style={{
                  background: accent,
                  color: "#26364e",
                  boxShadow: `0 0 24px ${accent}66`,
                }}
              >
                {String(s.order).padStart(2, "0")}
              </span>
              <p
                className="text-center text-[10px] uppercase tracking-[0.35em]"
                style={{ color: "#26364e", opacity: 0.55 }}
              >
                {[s.date, s.startTime].filter(Boolean).join(" · ")}
              </p>
              <h3
                className="mt-2 text-center font-display text-2xl tracking-tight"
                style={{ color: "#26364e" }}
              >
                {s.name}
              </h3>
              {s.venueName && (
                <p className="mt-1 text-center text-sm" style={{ color: "#26364e", opacity: 0.65 }}>
                  {s.venueName}
                </p>
              )}
              {s.description && (
                <p
                  className="mt-3 text-center text-sm leading-relaxed"
                  style={{ color: "#26364e", opacity: 0.7 }}
                >
                  {s.description}
                </p>
              )}
              {s.dressCode && (
                <p
                  className="mx-auto mt-4 inline-block rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.25em]"
                  style={{ borderColor: `${accent}88`, color: "#26364e" }}
                >
                  {s.dressCode}
                </p>
              )}
            </article>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export const SkytempleTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const reduce = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || "#e6c988";
  const tagline = event.tagline?.trim() || "Above the clouds, two souls meet.";
  const invitationMessage =
    event.invitationMessage?.trim() ||
    "Beyond the veil of clouds, where marble sanctuaries drift in golden light, we open our doors to you.";
  const aboutStory = event.aboutStory?.trim() || "";
  const galleryItems = useMemo(() => media.filter((m) => m.section === "gallery"), [media]);
  const hero =
    event.heroImageUrl ||
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1800&q=80";

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroTextY = useTransform(heroP, [0, 1], [0, -80]);
  const heroTextOpacity = useTransform(heroP, [0, 0.6], [1, 0]);

  const showStory = !event.hideStory;
  const showJourney = !event.hideEvents && subEvents.length > 0;
  const showVenue = !event.hideVenue;
  const showGallery = !event.hideGallery && (galleryItems.length > 0 || editing);

  const mainDate = event.mainDate
    ? new Date(event.mainDate).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div
      className="relative min-h-screen overflow-x-clip font-sans antialiased"
      style={{
        "--accent": accent,
        color: "#26364e",
      } as React.CSSProperties}
    >
      <SkyField reduce={reduce} />
      <ScrollProgress color={accent} />

      {/* ─── 01. DOORS OF LIGHT ─── */}
      <section
        ref={heroRef}
        className="relative flex h-[100svh] min-h-[640px] items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 opacity-40">
          <HeroMedia
            imageSrc={hero}
            videoSrc={event.heroVideoUrl || undefined}
            alt={event.eventTitle}
            className="opacity-90"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(223,234,246,0.5), rgba(200,218,232,0.75))",
            }}
          />
        </div>

        <TempleDoors accent={accent} reduce={reduce} />

        <motion.div
          style={reduce ? undefined : { y: heroTextY, opacity: heroTextOpacity }}
          className="relative z-10 px-6 text-center"
        >
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-6 text-[10px] uppercase tracking-[0.6em]"
            style={{ color: "#26364e", opacity: 0.7 }}
          >
            {tagline}
          </motion.p>
          <motion.h1
            initial={reduce ? false : { opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease: EASE }}
            className="font-display text-[clamp(3rem,11vw,8.5rem)] font-light leading-[0.95] tracking-tight"
            style={{
              color: "#26364e",
              textShadow: "0 4px 40px rgba(250,247,240,0.8)",
            }}
          >
            {event.eventTitle}
          </motion.h1>
          {(event.person1Name || event.person2Name) && (
            <motion.p
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="mt-6 font-display text-xl tracking-[0.2em] sm:text-2xl"
              style={{ color: accent }}
            >
              {event.person1Name}
              {event.person2Name ? (
                <span style={{ color: "#26364e", opacity: 0.5 }}> &amp; </span>
              ) : null}
              {event.person2Name}
            </motion.p>
          )}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4 text-[11px] uppercase tracking-[0.4em]"
            style={{ color: "#26364e", opacity: 0.7 }}
          >
            {mainDate && <span>{mainDate}</span>}
            {event.mainStartTime && <span style={{ opacity: 0.4 }}>|</span>}
            {event.mainStartTime && <span>{event.mainStartTime}</span>}
            {event.city && (
              <>
                <span style={{ opacity: 0.4 }}>|</span>
                <span>{event.city}</span>
              </>
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* ─── 02. THE INVITATION ─── */}
      {showStory && (
        <section className="relative mx-auto max-w-5xl px-6 py-28 sm:py-36">
          <div className="grid items-center gap-14 sm:grid-cols-2">
            <motion.div
              initial={reduce ? false : { opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, ease: EASE }}
            >
              <p
                className="mb-4 text-[10px] uppercase tracking-[0.5em]"
                style={{ color: accent }}
              >
                An Invitation
              </p>
              <h2
                className="font-display text-3xl leading-[1.15] tracking-tight sm:text-4xl"
                style={{ color: "#26364e" }}
              >
                {invitationMessage}
              </h2>
            </motion.div>
            <motion.div
              initial={reduce ? false : { opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, delay: 0.2, ease: EASE }}
            >
              <p
                className="text-base leading-relaxed sm:text-lg"
                style={{ color: "#26364e", opacity: 0.75 }}
              >
                {aboutStory ||
                  "Our story began on quiet ground, and rose slowly toward the sky. Now we invite you to cross the bridge with us, where cloud meets marble and light writes its own vows."}
              </p>
              <motion.div
                className="mt-8 h-px w-full"
                style={{
                  background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
                }}
                animate={reduce ? undefined : { opacity: [0.3, 0.9, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* ─── 03. SANCTUARIES (SUB-EVENTS) ─── */}
      {showJourney && (
        <section className="relative py-24 sm:py-32">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-3 text-center text-[10px] uppercase tracking-[0.5em]"
            style={{ color: accent }}
          >
            Sanctuaries
          </motion.p>
          <h2
            className="mb-16 text-center font-display text-3xl tracking-tight sm:text-4xl"
            style={{ color: "#26364e" }}
          >
            The Bridge of Days
          </h2>
          <SkyBridge items={subEvents} accent={accent} />
        </section>
      )}

      {/* ─── 04. GALLERY ─── */}
      {showGallery && (
        <section className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-3 text-center text-[10px] uppercase tracking-[0.5em]"
            style={{ color: accent }}
          >
            Reflections
          </motion.p>
          <h2
            className="mb-12 text-center font-display text-3xl tracking-tight sm:text-4xl"
            style={{ color: "#26364e" }}
          >
            Moments in the Clouds
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((m, i) => (
              <motion.div
                key={`${m.fileName}-${i}`}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.06 }}
                className="group relative overflow-hidden rounded-t-[40%] rounded-b-2xl border shadow-[0_20px_50px_-20px_rgba(38,54,78,0.35)]"
                style={{ borderColor: "rgba(230,201,136,0.45)" }}
              >
                <img
                  src={m.publicUrl}
                  alt={m.caption ?? ""}
                  className="aspect-[3/4] w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  loading="lazy"
                />
                <div
                  className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent 50%, rgba(38,54,78,0.55))",
                  }}
                />
                {m.caption && (
                  <p className="absolute bottom-4 left-4 right-4 text-[11px] uppercase tracking-[0.3em] text-[#faf7f0] opacity-0 transition-opacity group-hover:opacity-100">
                    {m.caption}
                  </p>
                )}
              </motion.div>
            ))}
            {editing && galleryItems.length === 0 && (
              <div
                className="col-span-full flex h-48 items-center justify-center rounded-2xl border border-dashed text-sm"
                style={{ borderColor: `${accent}88`, color: "#26364e", opacity: 0.6 }}
              >
                + Add photos
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── 05. VENUE ─── */}
      {showVenue && (
        <section className="relative mx-auto max-w-5xl px-6 py-24 sm:py-32">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-3 text-center text-[10px] uppercase tracking-[0.5em]"
            style={{ color: accent }}
          >
            The Temple
          </motion.p>
          <h2
            className="mb-10 text-center font-display text-3xl tracking-tight sm:text-4xl"
            style={{ color: "#26364e" }}
          >
            {event.venueName || "Where the Clouds Gather"}
          </h2>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: EASE }}
            className="overflow-hidden rounded-t-[10%] rounded-b-3xl border p-2 shadow-[0_30px_80px_-30px_rgba(38,54,78,0.4)] backdrop-blur"
            style={{
              background: "rgba(250,247,240,0.85)",
              borderColor: "rgba(230,201,136,0.55)",
            }}
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

      {/* ─── 06. RSVP / CTA ─── */}
      <section className="relative px-6 py-32 text-center sm:py-44">
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: EASE }}
          className="mx-auto max-w-3xl"
        >
          <motion.div
            aria-hidden
            animate={reduce ? undefined : { scale: [1, 1.08, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="mx-auto mb-10 h-32 w-32 rounded-full sm:h-40 sm:w-40"
            style={{
              background: `radial-gradient(circle, ${accent}, transparent 65%)`,
              filter: "blur(24px)",
            }}
          />
          <p
            className="mb-4 text-[10px] uppercase tracking-[0.5em]"
            style={{ color: accent }}
          >
            Cross the Bridge
          </p>
          <h2
            className="font-display text-[clamp(2.5rem,7vw,5rem)] leading-[1] tracking-tight"
            style={{ color: "#26364e" }}
          >
            {event.eventTitle}
          </h2>
          {mainDate && (
            <p
              className="mt-6 text-xs uppercase tracking-[0.5em]"
              style={{ color: "#26364e", opacity: 0.65 }}
            >
              {mainDate}
            </p>
          )}
          {event.rsvpEnabled && event.rsvpLinkOrContact && (
            <motion.div
              whileHover={reduce ? undefined : { scale: 1.04, y: -2 }}
              className="mt-12 inline-block"
            >
              <a
                href={event.rsvpLinkOrContact}
                target="_blank"
                rel="noreferrer"
                className="inline-block rounded-full px-14 py-4 text-xs uppercase tracking-[0.4em] transition-all"
                style={{
                  background: accent,
                  color: "#26364e",
                  boxShadow: `0 10px 40px ${accent}66`,
                }}
              >
                Reply with Grace
              </a>
            </motion.div>
          )}
        </motion.div>
      </section>

      <footer
        className="border-t py-10 text-center text-xs"
        style={{ borderColor: "rgba(38,54,78,0.15)", color: "#26364e", opacity: 0.6 }}
      >
        <p className="tracking-[0.3em] uppercase">
          {event.eventTitle}
          {event.person1Name ? ` · ${event.person1Name}` : ""}
          {event.person2Name ? ` &amp; ${event.person2Name}` : ""}
        </p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default SkytempleTemplate;
