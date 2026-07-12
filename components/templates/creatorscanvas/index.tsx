"use client";

import type { TemplateComponent, SubEvent } from "@/lib/types";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { HeroMedia } from "@/components/ui/HeroMedia";
import { MapEmbed } from "@/components/ui/MapEmbed";
import { RSVP } from "@/components/ui/RSVP";
import { MusicToggle } from "@/components/ui/MusicToggle";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { EditableImage } from "@/components/edit/EditableImage";
import { useEditMode } from "@/components/edit/EditContext";
import { creatorscanvasMeta } from "@/components/templates/metadata";

const defaults = creatorscanvasMeta.defaults;

/* ---- shared easing ---- */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ---- reusable SVG texture defs (paper grain + watercolor bloom filters) ---- */
function CanvasDefs() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-0 w-0"
      focusable="false"
    >
      <defs>
        <filter id="cc-paper" x="0" y="0" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves={2}
            stitchTiles="stitch"
            result="noise"
          />
          <feColorMatrix in="noise" type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.06" />
          </feComponentTransfer>
        </filter>
        <filter id="cc-bloom" x="-50%" y="-50%" width="200%" height="200%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012"
            numOctaves={2}
            seed={7}
            result="turb"
          />
          <feGaussianBlur stdDeviation="14" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.5" />
          </feComponentTransfer>
        </filter>
      </defs>
    </svg>
  );
}

/* ---- paper-grain overlay ---- */
function PaperGrain() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 opacity-70 mix-blend-multiply"
    >
      <svg className="h-full w-full" preserveAspectRatio="none">
        <rect width="100%" height="100%" filter="url(#cc-paper)" />
      </svg>
    </div>
  );
}

/* ---- a soft watercolor bloom in the accent color ---- */
function Bloom({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 200"
      className={className}
      style={{ color: "var(--accent)" }}
    >
      <circle
        cx="100"
        cy="100"
        r="80"
        fill="currentColor"
        filter="url(#cc-bloom)"
        opacity="0.35"
      />
    </svg>
  );
}

/* ---- generic self-drawing stroke path ---- */
function DrawPath({
  d,
  reduced,
  className,
  delay = 0,
  duration = 2,
  strokeWidth = 2,
}: {
  d: string;
  reduced: boolean;
  className?: string;
  delay?: number;
  duration?: number;
  strokeWidth?: number;
}) {
  return (
    <motion.path
      d={d}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={reduced ? false : { pathLength: 0, opacity: 0 }}
      whileInView={reduced ? undefined : { pathLength: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration, delay, ease: EASE }}
    />
  );
}

/* ---- line-art motifs ---- */
function CloudArt({ reduced }: { reduced: boolean }) {
  return (
    <svg
      viewBox="0 0 220 90"
      className="h-16 w-40 text-ink/60 sm:h-20 sm:w-52"
      aria-hidden="true"
    >
      <DrawPath
        reduced={reduced}
        d="M20 65 Q25 40 55 45 Q60 22 92 30 Q110 12 132 30 Q168 24 172 50 Q200 50 198 66 Q140 72 20 65 Z"
        duration={2.4}
      />
    </svg>
  );
}

function MountainArt({ reduced }: { reduced: boolean }) {
  return (
    <svg
      viewBox="0 0 320 120"
      className="h-24 w-72 text-ink/50 sm:w-96"
      aria-hidden="true"
    >
      <DrawPath
        reduced={reduced}
        d="M4 112 L70 44 L118 92 L172 30 L232 100 L280 58 L316 112"
        duration={2.6}
      />
      <DrawPath
        reduced={reduced}
        d="M150 46 L172 30 L196 52"
        className="text-[color:var(--accent)]"
        delay={0.4}
        duration={1.2}
      />
    </svg>
  );
}

function SprigArt({ reduced }: { reduced: boolean }) {
  return (
    <svg
      viewBox="0 0 120 160"
      className="h-40 w-28 text-ink/60"
      aria-hidden="true"
    >
      <DrawPath reduced={reduced} d="M60 156 C58 110 62 70 60 20" duration={2.2} />
      <DrawPath reduced={reduced} d="M60 120 C40 112 30 96 32 78" delay={0.3} />
      <DrawPath reduced={reduced} d="M60 100 C80 92 90 76 88 58" delay={0.5} />
      <DrawPath reduced={reduced} d="M60 78 C44 72 36 58 38 44" delay={0.7} />
      <DrawPath
        reduced={reduced}
        d="M60 24 C52 12 60 4 60 4 C60 4 70 14 60 24 Z"
        className="text-[color:var(--accent)]"
        delay={0.9}
        strokeWidth={2.5}
      />
    </svg>
  );
}

function ArchArt({ reduced }: { reduced: boolean }) {
  return (
    <svg
      viewBox="0 0 160 180"
      className="h-44 w-40 text-ink/55"
      aria-hidden="true"
    >
      <DrawPath
        reduced={reduced}
        d="M30 176 L30 70 Q30 20 80 20 Q130 20 130 70 L130 176"
        duration={2.6}
      />
      <DrawPath reduced={reduced} d="M18 176 L142 176" delay={0.6} />
      <DrawPath
        reduced={reduced}
        d="M80 20 L80 4"
        className="text-[color:var(--accent)]"
        delay={0.9}
      />
    </svg>
  );
}

/* ---- handwritten "painted-in" heading ---- */
function WrittenTitle({
  text,
  reduced,
  className = "",
}: {
  text: string;
  reduced: boolean;
  className?: string;
}) {
  return (
    <motion.span
      className={`block ${className}`}
      style={{ willChange: "clip-path, opacity" }}
      initial={reduced ? false : { clipPath: "inset(0 100% 0 0)", opacity: 0 }}
      whileInView={
        reduced ? undefined : { clipPath: "inset(0 0% 0 0)", opacity: 1 }
      }
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 1.6, ease: EASE }}
    >
      {text}
    </motion.span>
  );
}

/* ---- a gallery photo that sketches then paints in ---- */
function PaintedPhoto({
  item,
  reduced,
  index,
}: {
  item: { driveFileId?: string | null; publicUrl: string; caption?: string | null };
  reduced: boolean;
  index: number;
}) {
  return (
    <motion.figure
      className="group relative aspect-[4/5] overflow-hidden rounded-sm bg-paper shadow-[0_1px_0_rgba(26,26,26,0.08)]"
      initial={reduced ? false : { clipPath: "inset(100% 0 0 0)" }}
      whileInView={reduced ? undefined : { clipPath: "inset(0% 0 0 0)" }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 1.1, ease: EASE, delay: (index % 3) * 0.12 }}
    >
      <EditableImage
        section="gallery"
        replaceAssetId={item.driveFileId ?? undefined}
        src={item.publicUrl}
        alt={item.caption ?? ""}
        fill
        sizes="(max-width:640px) 90vw, 40vw"
        className="object-cover"
      />
      {/* desaturated "sketch" layer that fades to reveal full colour */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-paper/70 backdrop-grayscale"
        initial={reduced ? false : { opacity: 1 }}
        whileInView={reduced ? undefined : { opacity: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 1.4, ease: EASE, delay: (index % 3) * 0.12 + 0.2 }}
      />
      {item.caption ? (
        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/60 to-transparent p-3 font-serif text-sm text-paper">
          {item.caption}
        </figcaption>
      ) : null}
    </motion.figure>
  );
}

export const CreatorsCanvasTemplate: TemplateComponent = ({
  event,
  subEvents,
  media,
}) => {
  const reduced = !!useReducedMotion();
  const editing = !!useEditMode()?.enabled;

  const accent = event.themeAccentColor || defaults.accentColor;
  const hero = event.heroImageUrl || defaults.heroImage;
  const tagline = event.tagline?.trim() || defaults.tagline;
  const invitationMessage =
    event.invitationMessage?.trim() || defaults.invitationMessage;
  const aboutStory = event.aboutStory?.trim() || defaults.aboutStory || "";
  const galleryItems = media.filter((m) => m.section === "gallery");

  const orderedEvents = [...subEvents].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  );

  /* scroll-scrubbed brushstroke for the timeline */
  const { scrollYProgress } = useScroll();
  const heroTitle = event.eventTitle;

  return (
    <div
      className="relative min-h-screen overflow-x-clip bg-paper font-serif text-ink antialiased"
      style={{ "--accent": accent } as React.CSSProperties}
    >
      <CanvasDefs />
      <PaperGrain />
      <ScrollProgress color="var(--accent)" />

      {/* ============ HERO ============ */}
      <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 pb-32 pt-24 text-center">
        <HeroMedia
          imageSrc={hero}
          videoSrc={event.heroVideoUrl || undefined}
          alt={heroTitle}
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-paper/60" aria-hidden="true" />
        <Bloom className="pointer-events-none absolute -left-16 top-10 h-64 w-64" />
        <Bloom className="pointer-events-none absolute -right-10 bottom-24 h-72 w-72" />

        <div className="relative z-10 flex flex-col items-center">
          <motion.p
            className="mb-6 font-sans text-xs uppercase tracking-[0.4em] text-ink/60"
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE }}
          >
            {tagline}
          </motion.p>

          <CloudArt reduced={reduced} />

          <h1 className="mt-4 font-script text-[clamp(3rem,12vw,7rem)] leading-[0.95] text-ink">
            <WrittenTitle text={heroTitle} reduced={reduced} />
          </h1>

          <motion.div
            className="mt-8 max-w-xl font-serif text-lg text-ink/75 sm:text-xl"
            initial={reduced ? false : { opacity: 0 }}
            animate={reduced ? undefined : { opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.6, ease: EASE }}
          >
            {invitationMessage}
          </motion.div>
        </div>
      </section>

      {/* ============ STORY ============ */}
      {!event.hideStory ? (
        <section className="relative mx-auto max-w-3xl px-6 py-24 text-center sm:py-32">
          <div className="mb-10 flex justify-center text-ink">
            <SprigArt reduced={reduced} />
          </div>
          <h2 className="font-display text-3xl tracking-tight text-ink sm:text-5xl">
            <WrittenTitle text="Our Story" reduced={reduced} />
          </h2>
          <div className="mx-auto mt-6 h-px w-24 bg-[color:var(--accent)]" />
          {aboutStory ? (
            <p className="mx-auto mt-8 max-w-2xl whitespace-pre-line font-serif text-lg leading-relaxed text-ink/80 sm:text-xl">
              {aboutStory}
            </p>
          ) : null}
          <div className="mt-12 flex justify-center text-ink">
            <MountainArt reduced={reduced} />
          </div>
        </section>
      ) : null}

      {/* ============ EVENTS / TIMELINE ============ */}
      {!event.hideEvents && orderedEvents.length > 0 ? (
        <section className="relative mx-auto max-w-4xl px-6 py-24 sm:py-32">
          <h2 className="text-center font-display text-3xl tracking-tight text-ink sm:text-5xl">
            <WrittenTitle text="The Celebration" reduced={reduced} />
          </h2>
          <div className="mx-auto mt-6 h-px w-24 bg-[color:var(--accent)]" />

          <div className="relative mt-16">
            {/* flowing brushstroke drawn down the timeline (scroll-scrubbed) */}
            <svg
              aria-hidden="true"
              viewBox="0 0 40 1000"
              preserveAspectRatio="none"
              className="absolute left-4 top-0 h-full w-10 text-[color:var(--accent)] sm:left-1/2 sm:-translate-x-1/2"
            >
              {reduced ? (
                <path
                  d="M20 0 C10 160 30 320 18 480 C8 640 30 800 20 1000"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={4}
                  strokeLinecap="round"
                  opacity={0.7}
                />
              ) : (
                <motion.path
                  d="M20 0 C10 160 30 320 18 480 C8 640 30 800 20 1000"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={4}
                  strokeLinecap="round"
                  opacity={0.75}
                  style={{ pathLength: scrollYProgress }}
                />
              )}
            </svg>

            <ol className="relative space-y-16">
              {orderedEvents.map((sub: SubEvent, i) => (
                <li
                  key={`${sub.order}-${i}`}
                  className={`relative pl-16 sm:w-1/2 ${
                    i % 2 === 0
                      ? "sm:ml-auto sm:pl-16 sm:pr-0"
                      : "sm:mr-auto sm:pl-0 sm:pr-16 sm:text-right"
                  }`}
                >
                  {/* ink dot on the stroke */}
                  <span
                    aria-hidden="true"
                    className={`absolute top-2 h-3 w-3 rounded-full bg-[color:var(--accent)] left-[10px] sm:left-auto ${
                      i % 2 === 0
                        ? "sm:-left-[7px]"
                        : "sm:-right-[7px] sm:left-auto"
                    }`}
                  />
                  <motion.div
                    initial={reduced ? false : { opacity: 0, y: 24 }}
                    whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.8, ease: EASE }}
                  >
                    {sub.icon ? (
                      <span className="mb-2 block text-2xl" aria-hidden="true">
                        {sub.icon}
                      </span>
                    ) : null}
                    {sub.name ? (
                      <h3 className="font-display text-2xl text-ink">
                        {sub.name}
                      </h3>
                    ) : null}
                    <div className="mt-1 font-sans text-sm uppercase tracking-[0.2em] text-ink/60">
                      {sub.date ? <span>{sub.date}</span> : null}
                      {sub.startTime ? (
                        <span>
                          {sub.date ? " · " : ""}
                          {sub.startTime}
                          {sub.endTime ? `–${sub.endTime}` : ""}
                        </span>
                      ) : null}
                    </div>
                    {sub.venueName ? (
                      <p className="mt-2 font-serif text-lg text-ink/85">
                        {sub.venueName}
                      </p>
                    ) : null}
                    {sub.venueAddress ? (
                      <p className="font-serif text-base text-ink/60">
                        {sub.venueAddress}
                      </p>
                    ) : null}
                    {sub.dressCode ? (
                      <p className="mt-2 font-sans text-xs uppercase tracking-[0.2em] text-[color:var(--accent)]">
                        Dress code · {sub.dressCode}
                      </p>
                    ) : null}
                    {sub.description ? (
                      <p className="mt-2 font-serif text-base leading-relaxed text-ink/75">
                        {sub.description}
                      </p>
                    ) : null}
                  </motion.div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      {/* ============ GALLERY ============ */}
      {!event.hideGallery && (galleryItems.length > 0 || editing) ? (
        <section className="relative mx-auto max-w-5xl px-6 py-24 sm:py-32">
          <h2 className="text-center font-display text-3xl tracking-tight text-ink sm:text-5xl">
            <WrittenTitle text="Painted Moments" reduced={reduced} />
          </h2>
          <div className="mx-auto mt-6 mb-14 h-px w-24 bg-[color:var(--accent)]" />

          {editing && galleryItems.length === 0 ? (
            <div className="relative mx-auto aspect-[4/5] max-w-sm">
              <EditableImage
                section="gallery"
                src=""
                asAddTile
                alt=""
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
              {galleryItems.map((item, i) => (
                <PaintedPhoto
                  key={item.driveFileId ?? item.publicUrl ?? i}
                  item={item}
                  index={i}
                  reduced={reduced}
                />
              ))}
            </div>
          )}
        </section>
      ) : null}

      {/* ============ VENUE ============ */}
      {!event.hideVenue ? (
        <section className="relative mx-auto max-w-4xl px-6 py-24 text-center sm:py-32">
          <div className="mb-8 flex justify-center text-ink">
            <ArchArt reduced={reduced} />
          </div>
          <h2 className="font-display text-3xl tracking-tight text-ink sm:text-5xl">
            <WrittenTitle text="Where" reduced={reduced} />
          </h2>
          <div className="mx-auto mt-6 mb-4 h-px w-24 bg-[color:var(--accent)]" />
          {event.venueName ? (
            <p className="font-serif text-xl text-ink/85">{event.venueName}</p>
          ) : null}
          {event.venueAddress ? (
            <p className="mb-8 font-serif text-base text-ink/60">
              {event.venueAddress}
            </p>
          ) : null}
          <div className="mx-auto mt-6 overflow-hidden rounded-sm border border-ink/10">
            <MapEmbed
              latitude={event.latitude}
              longitude={event.longitude}
              venueName={event.venueName}
              venueAddress={event.venueAddress}
              mapLink={event.mapLink}
            />
          </div>
        </section>
      ) : null}

      {/* ============ RSVP ============ */}
      {event.rsvpEnabled ? (
        <section className="relative mx-auto max-w-2xl px-6 py-24 text-center sm:py-32">
          <Bloom className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2" />
          <div className="relative z-10">
            <h2 className="font-script text-5xl text-ink sm:text-6xl">
              <WrittenTitle text="Join us" reduced={reduced} />
            </h2>
            <div className="mx-auto mt-6 mb-8 h-px w-24 bg-[color:var(--accent)]" />
            <RSVP
              enabled={event.rsvpEnabled}
              linkOrContact={event.rsvpLinkOrContact}
              contactName={event.contactName}
            />
          </div>
        </section>
      ) : null}

      {/* ============ FOOTER ============ */}
      <footer className="relative border-t border-ink/10 px-6 py-16 text-center">
        <p className="font-script text-3xl text-ink">{heroTitle}</p>
        <p className="mt-3 font-sans text-xs uppercase tracking-[0.3em] text-ink/50">
          {tagline}
        </p>
      </footer>

      <MusicToggle src={event.backgroundMusicUrl} />
    </div>
  );
};

export default CreatorsCanvasTemplate;
