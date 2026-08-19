import type { EventData, MediaItem, SubEvent } from "@/lib/types";

/** Props consumed by <DownloadVideoButton> to build the animation video. */
export type TemplateVideoProps = {
  title: string;
  names?: string;
  dateLabel?: string;
  place?: string;
  tagline?: string;
  heroUrl?: string;
  accent: string;
  plan?: { name: string; when?: string; where?: string; icon?: string }[];
  venueName?: string;
  venueAddress?: string;
  photos?: { url: string; caption?: string }[];
};

function fmt(s: string | undefined, opts: Intl.DateTimeFormatOptions): string {
  if (!s) return "";
  const d = new Date(/^\d{4}-\d{2}-\d{2}$/.test(s) ? `${s}T12:00:00` : s);
  if (Number.isNaN(d.getTime())) return s;
  return d.toLocaleDateString("en-GB", opts);
}

/**
 * Derive the video props from an event + its sub-events + media. Shared by the
 * demo preview page and the client's edit portal, so both build the same video
 * (one from demo data, one from the client's real data).
 */
export function buildVideoProps(opts: {
  event: EventData;
  subEvents: SubEvent[];
  media: MediaItem[];
  accent: string;
  heroUrl?: string;
  tagline?: string;
}): TemplateVideoProps {
  const { event, subEvents, media, accent, heroUrl, tagline } = opts;

  const dateLabel =
    fmt(event.mainDate || event.tentativeDate, {
      day: "numeric",
      month: "long",
      year: "numeric",
    }) || undefined;

  const names = event.person2Name
    ? `${event.person1Name} & ${event.person2Name}`
    : event.person1Name;

  const plan = [...subEvents]
    .sort((a, b) => a.order - b.order)
    .slice(0, 5)
    .map((se) => ({
      name: se.name,
      when: [fmt(se.date, { weekday: "short", day: "numeric", month: "short" }), se.startTime]
        .filter(Boolean)
        .join(" · "),
      where: se.venueName || "",
      icon: se.icon || "",
    }));

  const photos = media
    .filter((m) => m.section === "gallery" && m.mediaType === "image")
    .slice(0, 4)
    .map((m) => ({ url: m.publicUrl, caption: m.caption || "" }));

  return {
    title: event.eventTitle,
    names,
    dateLabel,
    place: event.city || event.venueName,
    tagline,
    heroUrl,
    accent,
    plan,
    venueName: event.venueName,
    venueAddress: event.venueAddress,
    photos,
  };
}
