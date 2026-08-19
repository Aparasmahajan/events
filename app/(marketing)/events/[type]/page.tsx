import Link from "next/link";
import { notFound } from "next/navigation";
import { EVENT_TYPES, getEventTypeConfig } from "@/config/eventTypes";
import { TemplatePicker } from "./TemplatePicker";
import { filterTemplates } from "@/components/templates/metadata";
import { getFeaturedMap } from "@/lib/sheets";
import type { EventType } from "@/lib/types";

export function generateStaticParams() {
  return EVENT_TYPES.map((t) => ({ type: t.id }));
}

// Re-fetch the admin-curated featured order periodically (ISR).
export const revalidate = 120;

type Params = { type: string };

export default async function EventTypePage({ params }: { params: Params }) {
  const isKnown = EVENT_TYPES.some((t) => t.id === params.type);
  if (!isKnown) notFound();
  const eventType = params.type as EventType;
  const config = getEventTypeConfig(eventType);
  const templates = filterTemplates({ eventType });
  const featured = await getFeaturedMap();

  return (
    <main className="min-h-screen">
      <header className="border-b border-black/5">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link href="/" className="font-display text-xl">Event Platform</Link>
          <Link href="/" className="text-sm opacity-70 hover:opacity-100">← Change event type</Link>
        </div>
      </header>

      <section className="px-6 py-16 max-w-6xl mx-auto">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.4em] opacity-60 mb-3">{config.emoji} {config.label}</p>
          <h1 className="font-display text-4xl sm:text-5xl">Pick a template you love</h1>
          <p className="mt-3 opacity-70 max-w-2xl">
            Filter by tag — cool, decent, appealing, royal and more. Click a template to start your enquiry.
          </p>
        </div>

        <TemplatePicker
          eventType={eventType}
          initialTemplates={templates}
          featuredIds={featured[eventType] ?? []}
        />
      </section>
    </main>
  );
}
