import { notFound } from "next/navigation";
import { getLiveByToken, getLiveEvent, getMedia, getSubEvents } from "@/lib/sheets";
import { getTemplateMeta } from "@/components/templates/metadata";
import { EditableShell } from "@/components/edit/EditableShell";
import { DownloadVideoButton } from "@/components/ui/DownloadVideoButton";
import { buildVideoProps } from "@/lib/videoProps";
import { ManageHeader } from "./ManageHeader";

export default async function ManagePage({
  params,
}: {
  params: { token: string };
}) {
  const found = await getLiveByToken(params.token);
  if (!found) notFound();

  const [event, subEvents, media] = await Promise.all([
    getLiveEvent(found.code),
    getSubEvents(found.code),
    getMedia(found.code),
  ]);
  if (!event) notFound();

  const meta = getTemplateMeta(event.templateId) ?? getTemplateMeta("royal");
  if (!meta) notFound();

  // Build the animation video from the client's OWN event data.
  const videoProps = buildVideoProps({
    event,
    subEvents,
    media,
    accent: event.themeAccentColor || meta.defaults.accentColor,
    heroUrl: event.heroImageUrl || meta.defaults.heroImage,
    tagline: event.tagline || meta.defaults.tagline,
  });

  return (
    <>
      <ManageHeader
        eventCode={found.code}
        publicHref={`/e/${found.code}`}
        token={params.token}
      />
      <EditableShell
        templateId={meta.id}
        event={event}
        subEvents={subEvents}
        media={media}
        forceEdit
        topOffset={48}
        saveEndpoint={`/api/manage/${params.token}`}
        resetEndpoint={`/api/manage/${params.token}/reset`}
        templateSwitchEndpoint={
          found.auth.canChangeTemplate
            ? `/api/manage/${params.token}/template`
            : undefined
        }
        uploadEndpoint={`/api/manage/${params.token}/upload`}
      />
      {/* Client portal: download an animation video of their own page. */}
      <DownloadVideoButton templateId={meta.id} {...videoProps} />
    </>
  );
}
