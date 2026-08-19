"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import type {
  TemplateComponent,
  SubEvent,
  MediaItem,
} from "@/lib/types";
import { gravityzeroMeta } from "@/components/templates/metadata";
import { HeroMedia } from "@/components/ui/HeroMedia";
import { MapEmbed } from "@/components/ui/MapEmbed";
import { RSVP } from "@/components/ui/RSVP";
import { MusicToggle } from "@/components/ui/MusicToggle";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { EditableImage } from "@/components/edit/EditableImage";
import { useEditMode } from "@/components/edit/EditContext";

const defaults = gravityzeroMeta.defaults;

const FLOAT_EASE = [0.45, 0, 0.55, 1] as const;
const DRIFT_EASE = [0.16, 1, 0.3, 1] as const;

/* Upward-flowing particle field. */
function Particles({ reduce }: { reduce: boolean }) {
  if (reduce) return null;
  const dots = [
    { left: "12%", delay: 0, dur: 9, size: 3 },
    { left: "26%", delay: 2.5, dur: 12, size: 2 },
    { left: "41%", delay: 1.2, dur: 10, size: 4 },
    { left: "58%", delay: 3.8, dur: 13, size: 2 },
    { left: "72%", delay: 0.8, dur: 11, size: 3 },
    { left: "86%", delay: 2.1, dur: 14, size: 2 },
    { left: "48%", delay: 5, dur: 10, size: 3 },
  ];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {dots.map((d, i) => (
        <motion.span
          key={i}
          className="absolute bottom-[-10px] rounded-full"
          style={{
            left: d.left,
            width: d.size,
            height: d.size,
            background: "var(--accent)",
            boxShadow: "0 0 8px var(--accent)",
          }}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: ["0%", "-1400%"], opacity: [0, 0.9, 0] }}
          transition={{
            duration: d.dur,
            delay: d.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

/* Floating marble architecture silhouettes. */
function MarbleSilhouettes({ reduce }: { reduce: boolean }) {
  const floatA = reduce
    ? {}
    : {
        animate: { y: [0, -18, 0], rotate: [0, 1.5, 0] },
        transition: { duration: 12, repeat: Infinity, ease: FLOAT_EASE },
      };
  const floatB = reduce
    ? {}
    : {
        animate: { y: [0, 22, 0], rotate: [0, -2, 0] },
        transition: { duration: 15, repeat: Infinity, ease: FLOAT_EASE },
      };
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <motion.svg
        {...floatA}
        className="absolute left-[-4%] top-[12%] w-40 opacity-20 sm:w-56"
        viewBox="0 0 200 300"
        fill="none"
      >
        <defs>
          <linearGradient id="gz-marble-a" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f6f4ef" stopOpacity="0.9" />
            <stop offset="1" stopColor="#8f9bb3" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <path
          d="M40 300 L40 90 Q40 60 70 60 L70 40 L130 40 L130 60 Q160 60 160 90 L160 300 Z"
          fill="url(#gz-marble-a)"
        />
        <rect x="90" y="70" width="20" height="230" fill="#070a16" opacity="0.25" />
      </motion.svg>
      <motion.svg
        {...floatB}
        className="absolute right-[-3%] top-[46%] w-32 opacity-20 sm:w-48"
        viewBox="0 0 200 260"
        fill="none"
      >
        <defs>
          <linearGradient id="gz-marble-b" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#eef0f6" stopOpacity="0.85" />
            <stop offset="1" stopColor="#6f7da3" stopOpacity="0.25" />
          </linearGradient>
        </defs>
        <path
          d="M20 260 L60 20 Q100 -10 140 20 L180 260 Z"
          fill="url(#gz-marble-b)"
        />
      </motion.svg>
    </div>
  );
}

export const GravityZeroTemplate: TemplateComponent = ({ event, subEvents, media }) => {
  const editing = !!useEditMode()?.enabled;
  const prefersReduced = useReducedMotion();
  const reduce = !!prefersReduced;

  const accent = event.themeAccentColor || defaults.accentColor;
  const hero = event.heroImageUrl || defaults.heroImage;
  const tagline = event.tagline?.trim() || defaults.tagline;
  const invitationMessage = event.invitationMessage?.trim() || defaults.invitationMessage;
  const aboutStory = event.aboutStory?.trim() || defaults.aboutStory || "";
  const galleryItems = media.filter((m) => m.section === "gallery");

  const sortedSubEvents: SubEvent[] = [...subEvents].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  );

  /* Camera tilt following the pointer. */
  const tiltXRaw = useMotionValue(0);
  const tiltYRaw = useMotionValue(0);
  const rotateX = useSpring(tiltXRaw, { stiffness: 60, damping: 18 });
  const rotateY = useSpring(tiltYRaw, { stiffness: 60, damping: 18 });
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduce) return;
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
      return;
    }
    const handle = (e: PointerEvent) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      const nx = e.clientX / w - 0.5;
      const ny = e.clientY / h - 0.5;
      tiltYRaw.set(nx * 12);
      tiltXRaw.set(-ny * 12);
    };
    window.addEventListener("pointermove", handle, { passive: true });
    return () => window.removeEventListener("pointermove", handle);
  }, [reduce, tiltXRaw, tiltYRaw]);

  const float = (delay = 0, amp = 12) =>
    reduce
      ? {}
      : {
          animate: { y: [0, -amp, 0] },
          transition: { duration: 6 + delay, delay, repeat: Infinity, ease: FLOAT_EASE },
        };

  const drift = (x: number, y: number, rot: number) =>
    reduce
      ? { initial: { opacity: 0 }, whileInView: { opacity: 1 } }
      : {
          initial: { opacity: 0, x, y, rotate: rot },
          whileInView: { opacity: 1, x: 0, y: 0, rotate: 0 },
        };

  return (
    <div
      className="relative overflow-x-clip bg-[#070a16] text-[#eef0f6] font-sans selection:bg-white/20"
      style={{ "--accent": accent } as React.CSSProperties}
    >
      <ScrollProgress color="var(--accent)" />
      <MusicToggle />

      <div
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(120% 80% at 50% -10%, rgba(120,150,220,0.18), transparent 60%), radial-gradient(80% 60% at 90% 30%, rgba(90,120,200,0.12), transparent 55%)",
        }}
      />

      {/* HERO */}
      <header className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-6 pb-28 pt-24 text-center">
        <div className="absolute inset-0 -z-10">
          <HeroMedia imageSrc={hero} videoSrc={event.heroVideoUrl} alt={`${event.eventTitle} hero`} />
          <div className="absolute inset-0 bg-[#070a16]/70" aria-hidden />
        </div>
        <MarbleSilhouettes reduce={reduce} />
        <Particles reduce={reduce} />

        <motion.div {...float(0.4, 16)} className="relative will-change-transform">
          <p className="mb-6 font-serif text-sm uppercase tracking-[0.5em] text-[color:var(--accent)]">
            {tagline}
          </p>
          <h1 className="font-display text-5xl leading-[1.05] tracking-tight sm:text-7xl lg:text-8xl">
            {event.eventTitle}
          </h1>
          <p className="mx-auto mt-8 max-w-xl font-sans text-base leading-relaxed text-white/75 sm:text-lg">
            {invitationMessage}
          </p>
        </motion.div>

        <motion.span
          {...float(1.6, 8)}
          className="absolute bottom-10 font-serif text-xs uppercase tracking-[0.4em] text-white/50"
          aria-hidden
        >
          Weightless below
        </motion.span>
      </header>

      {/* STORY */}
      {!event.hideStory && (
        <motion.section
          {...drift(-60, 30, -4)}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease: DRIFT_EASE }}
          className="relative z-10 mx-auto max-w-3xl px-6 py-28 text-center"
        >
          <h2 className="font-display text-3xl tracking-tight sm:text-4xl">Our Orbit</h2>
          <div className="mx-auto my-6 h-px w-16 bg-[color:var(--accent)]" />
          <p className="whitespace-pre-line font-serif text-lg leading-relaxed text-white/80">
            {aboutStory}
          </p>
        </motion.section>
      )}

      {/* EVENTS */}
      {!event.hideEvents && sortedSubEvents.length > 0 && (
        <section className="relative z-10 mx-auto max-w-5xl px-6 py-24">
          <h2 className="mb-14 text-center font-display text-3xl tracking-tight sm:text-4xl">
            The Ceremonies
          </h2>
          <div className="grid gap-8 sm:grid-cols-2">
            {sortedSubEvents.map((se: SubEvent, i) => (
              <motion.article
                key={`${se.order}-${i}`}
                {...drift(i % 2 === 0 ? -50 : 50, 40, i % 2 === 0 ? -3 : 3)}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.9, ease: DRIFT_EASE, delay: (i % 2) * 0.08 }}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm"
              >
                <div className="mb-3 flex items-center gap-3">
                  {se.icon && (
                    <span className="text-2xl" aria-hidden>
                      {se.icon}
                    </span>
                  )}
                  <h3 className="font-display text-2xl">{se.name}</h3>
                </div>
                <dl className="space-y-1 font-sans text-sm text-white/75">
                  {se.date && (
                    <div>
                      <dt className="sr-only">Date</dt>
                      <dd>{se.date}</dd>
                    </div>
                  )}
                  {(se.startTime || se.endTime) && (
                    <div>
                      <dt className="sr-only">Time</dt>
                      <dd>
                        {se.startTime}
                        {se.endTime ? ` – ${se.endTime}` : ""}
                      </dd>
                    </div>
                  )}
                  {se.venueName && (
                    <div>
                      <dt className="sr-only">Venue</dt>
                      <dd className="text-white/90">{se.venueName}</dd>
                    </div>
                  )}
                  {se.venueAddress && (
                    <div>
                      <dt className="sr-only">Address</dt>
                      <dd>{se.venueAddress}</dd>
                    </div>
                  )}
                  {se.dressCode && (
                    <div>
                      <dt className="sr-only">Dress code</dt>
                      <dd className="text-[color:var(--accent)]">{se.dressCode}</dd>
                    </div>
                  )}
                </dl>
                {se.description && (
                  <p className="mt-3 font-serif text-sm leading-relaxed text-white/65">
                    {se.description}
                  </p>
                )}
              </motion.article>
            ))}
          </div>
        </section>
      )}

      {/* GALLERY — photos orbit a glowing crystal sphere */}
      {!event.hideGallery && (galleryItems.length > 0 || editing) && (
        <section className="relative z-10 px-6 py-28">
          <h2 className="mb-16 text-center font-display text-3xl tracking-tight sm:text-4xl">
            In Suspension
          </h2>

          {galleryItems.length === 0 && editing ? (
            <div className="mx-auto flex max-w-xs items-center justify-center">
              <div className="relative flex aspect-square w-56 items-center justify-center overflow-hidden rounded-full border border-dashed border-white/25 text-sm text-white/60">
                + Add photos
              </div>
            </div>
          ) : (
            <OrbitRing items={galleryItems} reduce={reduce} tiltX={rotateX} tiltY={rotateY} stageRef={stageRef} />
          )}
        </section>
      )}

      {/* VENUE */}
      {!event.hideVenue && (
        <motion.section
          {...drift(0, 60, 0)}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease: DRIFT_EASE }}
          className="relative z-10 mx-auto max-w-4xl px-6 py-24"
        >
          <h2 className="mb-3 text-center font-display text-3xl tracking-tight sm:text-4xl">
            The Landing
          </h2>
          {event.venueName && (
            <p className="mb-1 text-center font-serif text-lg text-white/85">{event.venueName}</p>
          )}
          {event.venueAddress && (
            <p className="mb-8 text-center font-sans text-sm text-white/60">{event.venueAddress}</p>
          )}
          <div className="overflow-hidden rounded-3xl border border-white/10">
            <MapEmbed
              latitude={event.latitude}
              longitude={event.longitude}
              venueName={event.venueName}
              venueAddress={event.venueAddress}
              mapLink={event.mapLink}
            />
          </div>
        </motion.section>
      )}

      {/* RSVP */}
      {event.rsvpEnabled && (
        <section className="relative z-10 mx-auto max-w-2xl px-6 py-24">
          <h2 className="mb-10 text-center font-display text-3xl tracking-tight sm:text-4xl">
            Join Us in Orbit
          </h2>
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm sm:p-8">
            <RSVP
              enabled={event.rsvpEnabled}
              linkOrContact={event.rsvpLinkOrContact}
              type={event.rsvpType}
            />
          </div>
        </section>
      )}

      <footer className="relative z-10 border-t border-white/10 px-6 py-10 text-center font-serif text-xs uppercase tracking-[0.35em] text-white/40">
        {event.eventTitle} · Gravity Zero
      </footer>
    </div>
  );
};

/* Orbit ring: gallery photos circle a glowing crystal sphere inside a mouse-tilt stage. */
function OrbitRing({
  items,
  reduce,
  tiltX,
  tiltY,
  stageRef,
}: {
  items: MediaItem[];
  reduce: boolean;
  tiltX: ReturnType<typeof useSpring>;
  tiltY: ReturnType<typeof useSpring>;
  stageRef: React.RefObject<HTMLDivElement>;
}) {
  const count = Math.max(items.length, 1);
  const radius = 190;

  const ringSpin = reduce
    ? {}
    : {
        animate: { rotate: 360 },
        transition: { duration: 44, repeat: Infinity, ease: "linear" as const },
      };
  const photoCounter = reduce
    ? {}
    : {
        animate: { rotate: -360 },
        transition: { duration: 44, repeat: Infinity, ease: "linear" as const },
      };

  return (
    <div className="mx-auto flex max-w-4xl justify-center" style={{ perspective: 1000 }}>
      <motion.div
        ref={stageRef}
        className="relative"
        style={
          reduce
            ? { transformStyle: "preserve-3d" }
            : { transformStyle: "preserve-3d", rotateX: tiltX, rotateY: tiltY }
        }
      >
        <div className="relative flex h-[26rem] w-[26rem] max-w-[90vw] items-center justify-center sm:h-[30rem] sm:w-[30rem]">
          {/* Central crystal sphere */}
          <div
            className="absolute h-40 w-40 rounded-full sm:h-48 sm:w-48"
            aria-hidden
            style={{
              background:
                "radial-gradient(circle at 35% 30%, #ffffff 0%, var(--accent) 35%, rgba(30,50,110,0.9) 75%, #070a16 100%)",
              boxShadow:
                "0 0 60px 10px var(--accent), inset 0 0 40px rgba(255,255,255,0.4)",
            }}
          />
          <div
            className="absolute h-40 w-40 rounded-full opacity-60 sm:h-48 sm:w-48"
            aria-hidden
            style={{
              background:
                "conic-gradient(from 0deg, transparent, rgba(255,255,255,0.35), transparent 40%, rgba(255,255,255,0.2), transparent 70%)",
              mixBlendMode: "screen",
            }}
          />

          {/* Rotating photo ring */}
          <motion.div
            {...ringSpin}
            className="absolute inset-0 will-change-transform"
            style={{ transformStyle: "preserve-3d" }}
          >
            {items.map((m, i) => {
              const angle = (i / count) * Math.PI * 2;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              return (
                <div
                  key={`${m.fileName}-${i}`}
                  className="absolute left-1/2 top-1/2"
                  style={{ transform: `translate(-50%, -50%) translate(${x}px, ${y}px)` }}
                >
                  <motion.div
                    {...photoCounter}
                    className="relative h-24 w-24 overflow-hidden rounded-2xl border border-white/20 shadow-[0_10px_40px_rgba(0,0,0,0.5)] sm:h-28 sm:w-28"
                  >
                    <img
                      loading="lazy"
                      src={m.publicUrl}
                      alt={m.caption ?? ""}
                      className="h-full w-full object-cover"
                    />
                  </motion.div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default GravityZeroTemplate;
