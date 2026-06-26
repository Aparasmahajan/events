import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  LIVE_COL,
  getLiveByToken,
  getLiveEvent,
  replaceSubEventsForCode,
  updateLiveFields,
} from "@/lib/sheets";
import type { EventData, SubEvent } from "@/lib/types";

type Body = {
  event?: Partial<EventData>;
  subEvents?: SubEvent[];
};

/* Map EventData field names → LIVE_COL keys. Only fields a customer is allowed
 * to edit appear here — eventCode/eventType/templateId are deliberately off
 * limits (template-switch is its own dedicated endpoint per spec). */
const EVENT_TO_COL: Partial<
  Record<keyof EventData, keyof typeof LIVE_COL>
> = {
  eventTitle: "EVENT_TITLE",
  person1Name: "PERSON_1",
  person2Name: "PERSON_2",
  city: "CITY",
  tagline: "TAGLINE",
  invitationMessage: "INVITATION_MESSAGE",
  aboutStory: "ABOUT_STORY",
  mainDate: "MAIN_DATE",
  mainStartTime: "MAIN_START",
  mainEndTime: "MAIN_END",
  themeAccentColor: "ACCENT",
  backgroundMusicUrl: "MUSIC",
  heroImageUrl: "HERO_IMAGE_URL",
  heroVideoUrl: "HERO_VIDEO_URL",
  venueName: "VENUE_NAME",
  venueAddress: "VENUE_ADDRESS",
  mapLink: "MAP_LINK",
  latitude: "LAT",
  longitude: "LNG",
  contactName: "CONTACT_NAME",
  contactPhone: "CONTACT_PHONE",
  contactEmail: "CONTACT_EMAIL",
  socialLink: "SOCIAL_LINK",
  rsvpEnabled: "RSVP_ENABLED",
  rsvpLinkOrContact: "RSVP_LINK",
  hideStory: "HIDE_STORY",
  hideEvents: "HIDE_EVENTS",
  hideGallery: "HIDE_GALLERY",
  hideVenue: "HIDE_VENUE",
};

const BOOL_COLS = new Set<keyof typeof LIVE_COL>([
  "RSVP_ENABLED",
  "HIDE_STORY",
  "HIDE_EVENTS",
  "HIDE_GALLERY",
  "HIDE_VENUE",
]);

export async function PATCH(req: Request, ctx: { params: { token: string } }) {
  let body: Body = {};
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const found = await getLiveByToken(ctx.params.token);
  if (!found || !found.auth.approved) {
    return NextResponse.json({ error: "Unknown event" }, { status: 404 });
  }
  const code = found.code;

  /* ── 1. event fields → Live row ── */
  if (body.event && typeof body.event === "object") {
    const updates: Record<string, string | number | boolean> = {};
    for (const [field, value] of Object.entries(body.event)) {
      const col = EVENT_TO_COL[field as keyof EventData];
      if (!col) continue; // silently drop disallowed fields
      if (BOOL_COLS.has(col)) {
        updates[col] = value ? "TRUE" : "FALSE";
      } else if (value === undefined || value === null) {
        updates[col] = "";
      } else {
        updates[col] = value as string | number;
      }
    }
    if (Object.keys(updates).length > 0) {
      await updateLiveFields(code, updates as never);
    }
  }

  /* ── 2. sub-events → SubEvents tab ── */
  if (Array.isArray(body.subEvents)) {
    await replaceSubEventsForCode(code, body.subEvents);
  }

  /* ── 3. publish-on-complete ── */
  // Re-read the row to evaluate required fields against what's now in Sheets.
  const fresh = await getLiveEvent(code);
  let published = false;
  if (fresh && !fresh.isActive) {
    const ready =
      !!fresh.eventTitle?.trim() &&
      !!fresh.mainDate?.trim() &&
      !!fresh.venueName?.trim();
    if (ready) {
      await updateLiveFields(code, {
        IS_ACTIVE: "TRUE",
        GO_LIVE_DATE: new Date().toISOString(),
      } as never);
      published = true;
    }
  }

  revalidatePath(`/e/${code}`);
  return NextResponse.json({ ok: true, code, published });
}
