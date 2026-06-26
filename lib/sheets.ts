import type { EventData, MediaItem, SubEvent } from "@/lib/types";
import { DEMO_EVENTS, getDemoBundle } from "@/lib/dummyData";

const HAS_SHEETS_CONFIG =
  !!process.env.GOOGLE_SHEETS_ID &&
  !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
  !!process.env.GOOGLE_PRIVATE_KEY;

type SheetsClient = {
  spreadsheets: {
    values: {
      get: (args: { spreadsheetId: string; range: string }) => Promise<{
        data: { values?: string[][] };
      }>;
      append: (args: {
        spreadsheetId: string;
        range: string;
        valueInputOption: string;
        requestBody: { values: (string | number | boolean)[][] };
      }) => Promise<unknown>;
    };
  };
};

let cached: SheetsClient | null = null;

async function getSheets(): Promise<SheetsClient> {
  if (cached) return cached;
  const { google } = await import("googleapis");
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: (process.env.GOOGLE_PRIVATE_KEY ?? "").replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets", "https://www.googleapis.com/auth/drive"],
  });
  cached = google.sheets({ version: "v4", auth }) as unknown as SheetsClient;
  return cached;
}

function pickRow<T extends string>(headers: T[], row: string[]): Record<T, string> {
  const out = {} as Record<T, string>;
  headers.forEach((h, i) => (out[h] = (row[i] ?? "").trim()));
  return out;
}

function boolish(v?: string) {
  if (!v) return false;
  return /^(true|yes|y|1)$/i.test(v.trim());
}

function num(v?: string): number | undefined {
  if (!v) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

export async function getLiveEvent(code: string): Promise<EventData | null> {
  if (!HAS_SHEETS_CONFIG) {
    return getDemoBundle(code)?.event ?? null;
  }
  try {
    const sheets = await getSheets();
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID!,
      range: "Live!A2:AZ",
    });
    const rows = res.data.values ?? [];
    const row = rows.find((r) => (r[0] ?? "").trim() === code);
    if (!row) return getDemoBundle(code)?.event ?? null;
    return liveRowToEvent(row);
  } catch (err) {
    console.error("[sheets] getLiveEvent failed, falling back to demo:", err);
    return getDemoBundle(code)?.event ?? null;
  }
}

export async function getSubEvents(code: string): Promise<SubEvent[]> {
  if (!HAS_SHEETS_CONFIG) {
    return getDemoBundle(code)?.subEvents ?? [];
  }
  const sheets = await getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEETS_ID!,
    range: "SubEvents!A2:N",
  });
  const rows = res.data.values ?? [];
  const found = rows.filter((r) => (r[0] ?? "").trim() === code);
  if (found.length === 0 && DEMO_EVENTS[code]) return DEMO_EVENTS[code].subEvents;
  return found
    .map<SubEvent>((r) => ({
      eventCode: r[0],
      order: Number(r[1]) || 0,
      name: r[2] ?? "",
      date: r[3] || undefined,
      startTime: r[4] || undefined,
      endTime: r[5] || undefined,
      venueName: r[6] || undefined,
      venueAddress: r[7] || undefined,
      mapLink: r[8] || undefined,
      latitude: num(r[9]),
      longitude: num(r[10]),
      dressCode: r[11] || undefined,
      description: r[12] || undefined,
      icon: r[13] || undefined,
    }))
    .sort((a, b) => a.order - b.order);
}

export async function getMedia(code: string): Promise<MediaItem[]> {
  if (!HAS_SHEETS_CONFIG) {
    return getDemoBundle(code)?.media ?? [];
  }
  const sheets = await getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEETS_ID!,
    range: "Media!A2:I",
  });
  const rows = res.data.values ?? [];
  const found = rows.filter((r) => (r[0] ?? "").trim() === code);
  if (found.length === 0 && DEMO_EVENTS[code]) return DEMO_EVENTS[code].media;
  return found
    .map<MediaItem>((r) => ({
      eventCode: r[0],
      mediaType: (r[1] === "video" ? "video" : "image") as MediaItem["mediaType"],
      section: r[2] ?? "gallery",
      fileName: r[3] ?? "",
      driveFileId: r[4] || undefined,
      publicUrl: r[5] ?? "",
      caption: r[6] || undefined,
      sortOrder: Number(r[7]) || 0,
      uploadedAt: r[8] || undefined,
    }))
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function appendEnquiry(values: (string | number | boolean)[]) {
  if (!HAS_SHEETS_CONFIG) return;
  const sheets = await getSheets();
  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEETS_ID!,
    range: "Enquiries!A2",
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [values] },
  });
}

export async function getNextSequence(yearPrefix: string): Promise<number> {
  if (!HAS_SHEETS_CONFIG) return 1;
  const sheets = await getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEETS_ID!,
    range: "Enquiries!A2:A",
  });
  const codes = res.data.values ?? [];
  const count = codes.filter((r) => (r[0] ?? "").startsWith(yearPrefix)).length;
  return count + 1;
}

function liveRowToEvent(r: string[]): EventData {
  // Columns 1–14 match Enquiries; columns 15+ are Live-only.
  // We map by index here for clarity.
  return {
    eventCode: r[0],
    eventType: (r[5] || "wedding") as EventData["eventType"],
    eventSubtype: r[6] || undefined,
    templateId: r[7] || "royal",
    eventTitle: r[8] || "",
    person1Name: r[9] || "",
    person2Name: r[10] || undefined,
    tentativeDate: r[11] || undefined,
    city: r[12] || undefined,

    isActive: boolish(r[14]),
    slug: r[20] || undefined,
    goLiveDate: r[21] || undefined,
    expiryDate: r[22] || undefined,

    heroImageUrl: r[23] || undefined,
    heroVideoUrl: r[24] || undefined,
    tagline: r[25] || undefined,
    invitationMessage: r[26] || undefined,
    aboutStory: r[27] || undefined,
    mainDate: r[28] || undefined,
    mainStartTime: r[29] || undefined,
    mainEndTime: r[30] || undefined,
    themeAccentColor: r[31] || undefined,
    backgroundMusicUrl: r[32] || undefined,

    venueName: r[33] || undefined,
    venueAddress: r[34] || undefined,
    mapLink: r[35] || undefined,
    latitude: num(r[36]),
    longitude: num(r[37]),

    contactName: r[38] || undefined,
    contactPhone: r[39] || undefined,
    contactEmail: r[40] || undefined,
    socialLink: r[41] || undefined,

    rsvpEnabled: boolish(r[42]),
    rsvpLinkOrContact: r[43] || undefined,
  };
}

// Re-export for use in pick helpers if needed later.
export { pickRow };
