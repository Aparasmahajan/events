import Link from "next/link";
import { notFound } from "next/navigation";
import { EVENT_TYPES, getEventTypeConfig } from "@/config/eventTypes";
import { getTemplateMeta } from "@/components/templates/metadata";
import { EnquiryForm } from "./EnquiryForm";
import type { EventType } from "@/lib/types";

type Params = { type: string; templateId: string };

export default function EnquiryPage({ params }: { params: Params }) {
  const isKnown = EVENT_TYPES.some((t) => t.id === params.type);
  if (!isKnown) notFound();
  const eventType = params.type as EventType;
  const template = getTemplateMeta(params.templateId);
  if (!template || !template.eventTypes.includes(eventType)) notFound();

  const config = getEventTypeConfig(eventType);

  return (
    <main className="min-h-screen">
      <header className="border-b border-black/5 sticky top-0 bg-white/80 backdrop-blur z-20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-display text-xl">Event Platform</Link>
          <Link href={`/events/${eventType}`} className="text-sm opacity-70 hover:opacity-100">
            ← Back to templates
          </Link>
        </div>
      </header>

      <section className="px-6 py-12 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] opacity-60 mb-3">{config.emoji} {config.label}</p>
            <h1 className="font-display text-4xl sm:text-5xl">{template.name}</h1>
            <p className="opacity-70 mt-3">{template.description}</p>
            <div className="flex flex-wrap gap-1.5 mt-4">
              {template.tags.map((tag) => (
                <span key={tag} className="text-[10px] uppercase tracking-widest px-2 py-1 rounded-full bg-black/5">
                  {tag}
                </span>
              ))}
            </div>
            <div
              className="aspect-[4/3] mt-6 rounded-2xl bg-cover bg-center"
              style={{ backgroundImage: `url('${template.previewImage}')` }}
            />
            <p className="text-xs opacity-60 mt-3">
              <Link
                href={`/events/${eventType}/${template.id}/preview`}
                target="_blank"
                className="underline"
              >
                Preview this template with a {config.label.toLowerCase()} demo ↗
              </Link>
            </p>
          </div>

          <div>
            <h2 className="font-display text-3xl mb-4">Tell us about your event</h2>
            <p className="opacity-70 mb-6 text-sm">
              We&apos;ll review and call you to confirm details. Nothing is published until you say go.
            </p>
            <EnquiryForm
              eventType={eventType}
              templateId={template.id}
              person1Label={config.conditionalFields.person1Label}
              person2Label={config.conditionalFields.person2Label}
              showPerson2={config.conditionalFields.showPerson2}
              subtypes={config.subtypes}
            />
          </div>
        </div>
      </section>

    </main>
  );
}

export function generateStaticParams() {
  // Allow the route to be statically discovered; runtime validates fully
  return [];
}
