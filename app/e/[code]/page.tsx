import { notFound } from "next/navigation";
import { getLiveEvent, getMedia, getSubEvents } from "@/lib/sheets";
import { getTemplateMeta } from "@/components/templates/metadata";
import { EditableShell } from "@/components/edit/EditableShell";
import { isValidEventCode } from "@/lib/eventCode";

export const revalidate = 3600; // ISR — also revalidated on demand via /api/revalidate
export const dynamicParams = true;

type Params = { code: string };

export default async function LiveEventPage({ params }: { params: Params }) {
  const code = params.code;
  if (!isValidEventCode(code)) notFound();

  const event = await getLiveEvent(code);
  if (!event || !event.isActive) notFound();

  const [subEvents, media] = await Promise.all([getSubEvents(code), getMedia(code)]);
  const meta = getTemplateMeta(event.templateId) ?? getTemplateMeta("royal");
  if (!meta) notFound();

  return (
    <EditableShell
      templateId={meta.id}
      event={event}
      subEvents={subEvents}
      media={media}
    />
  );
}

export async function generateMetadata({ params }: { params: Params }) {
  if (!isValidEventCode(params.code)) return {};
  const event = await getLiveEvent(params.code);
  if (!event) return {};
  return {
    title: event.eventTitle,
    description: event.invitationMessage || event.tagline || "You're invited.",
    openGraph: {
      title: event.eventTitle,
      description: event.invitationMessage || event.tagline,
      images: event.heroImageUrl ? [event.heroImageUrl] : undefined,
    },
  };
}
