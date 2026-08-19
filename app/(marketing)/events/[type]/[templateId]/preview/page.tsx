import { notFound } from "next/navigation";
import { EVENT_TYPES } from "@/config/eventTypes";
import { getTemplateMeta } from "@/components/templates/metadata";
import { EditableShell } from "@/components/edit/EditableShell";
import { DownloadVideoButton } from "@/components/ui/DownloadVideoButton";
import { dummyForEventType } from "@/lib/dummyData";
import { buildVideoProps } from "@/lib/videoProps";
import type { EventType } from "@/lib/types";

type Params = { type: string; templateId: string };

/**
 * Type-aware template preview. Renders the chosen template with demo content
 * that matches the chosen event type — so /events/birthday/modern shows the
 * Modern template with a *birthday* story, not the corporate Mahajan demo that
 * happens to be Modern's seed event.
 */
export default function TemplatePreviewPage({ params }: { params: Params }) {
  if (!EVENT_TYPES.some((t) => t.id === params.type)) notFound();
  const eventType = params.type as EventType;
  const meta = getTemplateMeta(params.templateId);
  if (!meta || !meta.eventTypes.includes(eventType)) notFound();

  const bundle = dummyForEventType(eventType);

  // The demo bundle is shared across every template of this event type, so its
  // hero (e.g. the wedding mandap) would otherwise appear on ALL wedding
  // templates — burying each template's own aesthetic. For the romance family,
  // show the template's signature hero (meta.defaults.heroImage) instead, so
  // every preview looks like *itself* (Time Fracture gets its cosmic twilight,
  // Gravity Zero its crystal chandelier, and so on).
  const ROMANCE = ["wedding", "engagement", "anniversary"];
  const heroOverride =
    ROMANCE.includes(eventType) && meta.defaults.heroImage
      ? meta.defaults.heroImage
      : bundle.event.heroImageUrl;

  const event = {
    ...bundle.event,
    eventType,
    templateId: meta.id,
    heroImageUrl: heroOverride,
    // Drop the source demo's accent so the template renders in its own palette.
    themeAccentColor: undefined,
  };

  // Data for the live (client-side) video generator — built from this page's
  // demo content (event DATE not a countdown, couple, schedule, venue, photos).
  const videoProps = buildVideoProps({
    event,
    subEvents: bundle.subEvents,
    media: bundle.media,
    accent: meta.defaults.accentColor,
    heroUrl: heroOverride,
    tagline: event.tagline || meta.defaults.tagline,
  });

  return (
    <>
      <EditableShell
        templateId={meta.id}
        event={event}
        subEvents={bundle.subEvents}
        media={bundle.media}
      />
      {/* Live, in-browser video built from this page's data. */}
      <DownloadVideoButton templateId={meta.id} {...videoProps} />
    </>
  );
}
