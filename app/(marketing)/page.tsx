import Link from "next/link";
import { EVENT_TYPES } from "@/config/eventTypes";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Hero } from "./_components/Hero";
import { LandingTemplates } from "./_components/LandingTemplates";
import { EventTypeCard } from "./_components/EventTypeCard";
import { HowItWorks } from "./_components/HowItWorks";
import { TEMPLATES_META } from "@/components/templates/metadata";

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <Hero demoCode="WED-2026-0001" />

      {/* How it works */}
      <section id="how" className="py-24 px-6 max-w-6xl mx-auto">
        <ScrollReveal className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.4em] opacity-60 mb-3">How it works</p>
          <h2 className="font-display text-3xl sm:text-5xl">Three steps to live.</h2>
        </ScrollReveal>
        <HowItWorks />
      </section>

      {/* Event types */}
      <section id="event-types" className="py-24 px-6 max-w-6xl mx-auto border-t border-black/5">
        <ScrollReveal className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.4em] opacity-60 mb-3">Step 1</p>
          <h2 className="font-display text-3xl sm:text-5xl">What are we celebrating?</h2>
          <p className="opacity-70 mt-3 max-w-xl mx-auto">
            Each event type unlocks the templates designed for it.
          </p>
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {EVENT_TYPES.map((t, i) => (
            <EventTypeCard
              key={t.id}
              href={`/events/${t.id}`}
              emoji={t.emoji}
              label={t.label}
              description={t.description}
              index={i}
            />
          ))}
        </div>
      </section>

      {/* Templates */}
      <section id="templates" className="py-24 px-6 max-w-6xl mx-auto border-t border-black/5">
        <ScrollReveal className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.4em] opacity-60 mb-3">Step 2</p>
          <h2 className="font-display text-3xl sm:text-5xl">Templates for every mood</h2>
          <p className="opacity-70 mt-3 max-w-xl mx-auto">
            Filter by vibe — cool, decent, appealing, royal, minimal, playful and more. Tap any card
            to open a live preview.
          </p>
        </ScrollReveal>
        <LandingTemplates />
      </section>

      {/* CTA banner */}
      <section className="px-6 py-24">
        <ScrollReveal>
          <div
            className="max-w-5xl mx-auto rounded-3xl px-8 py-16 sm:px-16 sm:py-20 text-center text-white relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, #1a1a1a, #2a2a2a 60%, #3a2a4a), radial-gradient(circle at 20% 30%, #a3792c55, transparent 50%)",
            }}
          >
            <div
              aria-hidden
              className="absolute inset-0 opacity-30"
              style={{
                background:
                  "radial-gradient(600px circle at 80% 50%, #7c3aed66, transparent 50%), radial-gradient(400px circle at 10% 80%, #ff5fa233, transparent 60%)",
              }}
            />
            <p className="relative text-xs uppercase tracking-[0.4em] opacity-70 mb-4">Ready when you are</p>
            <h2 className="relative font-display text-3xl sm:text-5xl">
              A site your guests will actually open.
            </h2>
            <p className="relative opacity-80 mt-4 max-w-xl mx-auto">
              Five templates. Sixteen vibe tags. One short call. Send your enquiry now and we&apos;ll
              take it from there.
            </p>
            <div className="relative mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="#event-types"
                className="px-7 py-3 rounded-full bg-white text-neutral-900 font-medium hover:bg-neutral-100 transition"
              >
                Start your enquiry
              </Link>
              <Link
                href="#templates"
                className="px-7 py-3 rounded-full border border-white/30 hover:bg-white/10 transition"
              >
                Browse templates
              </Link>
            </div>
            <p className="relative mt-6 text-xs opacity-60">
              {TEMPLATES_META.length} templates · {EVENT_TYPES.length} event types · live in days
            </p>
          </div>
        </ScrollReveal>
      </section>

      <footer className="py-10 px-6 text-center text-sm opacity-60 border-t border-black/5">
        <p>Event Platform · MVP build</p>
      </footer>
    </main>
  );
}
