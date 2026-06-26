import type { EventData, MediaItem, SubEvent } from "@/lib/types";
import { DEMO_EVENTS, getDemoBundle } from "@/lib/dummyData";
import { TEMPLATES_META } from "@/components/templates/metadata";

const HAS_SHEETS_CONFIG =
  !!process.env.GOOGLE_SHEETS_ID &&
  !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
  !!process.env.GOOGLE_PRIVATE_KEY;

/* ────────────────────────────────────────────────────────────────────────
 * Column maps (1-indexed)
 *
 * Live and Enquiries share columns 1–14. After that the layouts diverge.
 * Order matches what's in CLAUDE.md §4 + the existing sheet, with the new
 * auth + visibility columns APPENDED so we don't disturb the existing layout.
 * ──────────────────────────────────────────────────────────────────────── */

export const ENQ_COL = {
  EVENT_CODE: 1,
  SUBMITTED_AT: 2,
  FULL_NAME: 3,
  EMAIL: 4,
  MOBILE: 5,
  EVENT_TYPE: 6,
  EVENT_SUBTYPE: 7,
  TEMPLATE_ID: 8,
  EVENT_TITLE: 9,
  PERSON_1: 10,
  PERSON_2: 11,
  TENTATIVE_DATE: 12,
  CITY: 13,
  MESSAGE: 14,
  STATUS: 15,
  LAST_CONTACTED: 16,
  QUOTED_AMOUNT: 17,
  ASSIGNED_TO: 18,
  INTERNAL_NOTES: 19,
} as const;

export const LIVE_COL = {
  EVENT_CODE: 1,
  SUBMITTED_AT: 2,
  FULL_NAME: 3,
  EMAIL: 4,
  MOBILE: 5,
  EVENT_TYPE: 6,
  EVENT_SUBTYPE: 7,
  TEMPLATE_ID: 8,
  EVENT_TITLE: 9,
  PERSON_1: 10,
  PERSON_2: 11,
  TENTATIVE_DATE: 12,
  CITY: 13,
  MESSAGE: 14,
  IS_ACTIVE: 15,
  PAYMENT_STATUS: 16,
  AMOUNT_PAID: 17,
  PAYMENT_REF: 18,
  PAYMENT_DATE: 19,
  PLAN: 20,
  SLUG: 21,
  GO_LIVE_DATE: 22,
  ACTIVE_UNTIL: 23,
  HERO_IMAGE_URL: 24,
  HERO_VIDEO_URL: 25,
  TAGLINE: 26,
  INVITATION_MESSAGE: 27,
  ABOUT_STORY: 28,
  MAIN_DATE: 29,
  MAIN_START: 30,
  MAIN_END: 31,
  ACCENT: 32,
  MUSIC: 33,
  VENUE_NAME: 34,
  VENUE_ADDRESS: 35,
  MAP_LINK: 36,
  LAT: 37,
  LNG: 38,
  CONTACT_NAME: 39,
  CONTACT_PHONE: 40,
  CONTACT_EMAIL: 41,
  SOCIAL_LINK: 42,
  RSVP_ENABLED: 43,
  RSVP_LINK: 44,
  // New columns appended to the existing sheet — see CLAUDE.md §4
  APPROVED: 45,
  ACCESS_TOKEN: 46,
  CAN_CHANGE_TEMPLATE: 47,
  HIDE_STORY: 48,
  HIDE_EVENTS: 49,
  HIDE_GALLERY: 50,
  HIDE_VENUE: 51,
  OTP_HASH: 52,
  OTP_EXPIRES_AT: 53,
  OTP_ATTEMPTS: 54,
  OTP_LOCKED_UNTIL: 55,
} as const;

const LIVE_LAST_COL = LIVE_COL.OTP_LOCKED_UNTIL;
const LIVE_RANGE_FULL = `Live!A2:${colLetter(LIVE_LAST_COL)}`;

/* ────────────────────────────────────────────────────────────────────────
 * Sheets client
 * ──────────────────────────────────────────────────────────────────────── */

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
      update: (args: {
        spreadsheetId: string;
        range: string;
        valueInputOption: string;
        requestBody: { values: (string | number | boolean)[][] };
      }) => Promise<unknown>;
      batchUpdate: (args: {
        spreadsheetId: string;
        requestBody: {
          valueInputOption: string;
          data: {
            range: string;
            values: (string | number | boolean)[][];
          }[];
        };
      }) => Promise<unknown>;
      clear: (args: {
        spreadsheetId: string;
        range: string;
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

/* ────────────────────────────────────────────────────────────────────────
 * Tiny helpers
 * ──────────────────────────────────────────────────────────────────────── */

export function colLetter(n: number): string {
  let s = "";
  while (n > 0) {
    n--;
    s = String.fromCharCode(65 + (n % 26)) + s;
    n = Math.floor(n / 26);
  }
  return s;
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

function spreadsheetId(): string {
  const id = process.env.GOOGLE_SHEETS_ID;
  if (!id) throw new Error("GOOGLE_SHEETS_ID not configured");
  return id;
}

/** Find the absolute sheet row (1-indexed; row 1 = headers) for a code. */
async function findRowNumber(tab: "Live" | "Enquiries", code: string): Promise<number | null> {
  const sheets = await getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId(),
    range: `${tab}!A2:A`,
  });
  const rows = res.data.values ?? [];
  const idx = rows.findIndex((r) => (r[0] ?? "").trim() === code);
  return idx < 0 ? null : idx + 2; // +2: row 1 is headers, +1 for 0→1 indexing
}

/* ────────────────────────────────────────────────────────────────────────
 * Read helpers — Live row, SubEvents, Media
 * ──────────────────────────────────────────────────────────────────────── */

export async function getLiveEvent(code: string): Promise<EventData | null> {
  if (!HAS_SHEETS_CONFIG) return getDemoBundle(code)?.event ?? null;
  try {
    const sheets = await getSheets();
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId(),
      range: LIVE_RANGE_FULL,
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
  if (!HAS_SHEETS_CONFIG) return getDemoBundle(code)?.subEvents ?? [];
  try {
    const sheets = await getSheets();
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId(),
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
  } catch (err) {
    console.error("[sheets] getSubEvents failed, falling back to demo:", err);
    return getDemoBundle(code)?.subEvents ?? [];
  }
}

export async function getMedia(code: string): Promise<MediaItem[]> {
  if (!HAS_SHEETS_CONFIG) return getDemoBundle(code)?.media ?? [];
  try {
    const sheets = await getSheets();
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId(),
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
  } catch (err) {
    console.error("[sheets] getMedia failed, falling back to demo:", err);
    return getDemoBundle(code)?.media ?? [];
  }
}

function liveRowToEvent(r: string[]): EventData {
  const get = (col: number) => r[col - 1];
  return {
    eventCode: get(LIVE_COL.EVENT_CODE),
    eventType: (get(LIVE_COL.EVENT_TYPE) || "wedding") as EventData["eventType"],
    eventSubtype: get(LIVE_COL.EVENT_SUBTYPE) || undefined,
    templateId: get(LIVE_COL.TEMPLATE_ID) || "royal",
    eventTitle: get(LIVE_COL.EVENT_TITLE) || "",
    person1Name: get(LIVE_COL.PERSON_1) || "",
    person2Name: get(LIVE_COL.PERSON_2) || undefined,
    tentativeDate: get(LIVE_COL.TENTATIVE_DATE) || undefined,
    city: get(LIVE_COL.CITY) || undefined,

    isActive: boolish(get(LIVE_COL.IS_ACTIVE)),
    slug: get(LIVE_COL.SLUG) || undefined,
    goLiveDate: get(LIVE_COL.GO_LIVE_DATE) || undefined,
    expiryDate: get(LIVE_COL.ACTIVE_UNTIL) || undefined,

    heroImageUrl: get(LIVE_COL.HERO_IMAGE_URL) || undefined,
    heroVideoUrl: get(LIVE_COL.HERO_VIDEO_URL) || undefined,
    tagline: get(LIVE_COL.TAGLINE) || undefined,
    invitationMessage: get(LIVE_COL.INVITATION_MESSAGE) || undefined,
    aboutStory: get(LIVE_COL.ABOUT_STORY) || undefined,
    mainDate: get(LIVE_COL.MAIN_DATE) || undefined,
    mainStartTime: get(LIVE_COL.MAIN_START) || undefined,
    mainEndTime: get(LIVE_COL.MAIN_END) || undefined,
    themeAccentColor: get(LIVE_COL.ACCENT) || undefined,
    backgroundMusicUrl: get(LIVE_COL.MUSIC) || undefined,

    venueName: get(LIVE_COL.VENUE_NAME) || undefined,
    venueAddress: get(LIVE_COL.VENUE_ADDRESS) || undefined,
    mapLink: get(LIVE_COL.MAP_LINK) || undefined,
    latitude: num(get(LIVE_COL.LAT)),
    longitude: num(get(LIVE_COL.LNG)),

    contactName: get(LIVE_COL.CONTACT_NAME) || undefined,
    contactPhone: get(LIVE_COL.CONTACT_PHONE) || undefined,
    contactEmail: get(LIVE_COL.CONTACT_EMAIL) || undefined,
    socialLink: get(LIVE_COL.SOCIAL_LINK) || undefined,

    rsvpEnabled: boolish(get(LIVE_COL.RSVP_ENABLED)),
    rsvpLinkOrContact: get(LIVE_COL.RSVP_LINK) || undefined,

    hideStory: boolish(get(LIVE_COL.HIDE_STORY)),
    hideEvents: boolish(get(LIVE_COL.HIDE_EVENTS)),
    hideGallery: boolish(get(LIVE_COL.HIDE_GALLERY)),
    hideVenue: boolish(get(LIVE_COL.HIDE_VENUE)),
  };
}

/* ────────────────────────────────────────────────────────────────────────
 * Enquiries (admin CRM + initial submit)
 * ──────────────────────────────────────────────────────────────────────── */

export async function appendEnquiry(values: (string | number | boolean)[]) {
  if (!HAS_SHEETS_CONFIG) return;
  const sheets = await getSheets();
  await sheets.spreadsheets.values.append({
    spreadsheetId: spreadsheetId(),
    range: "Enquiries!A2",
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [values] },
  });
}

export async function getNextSequence(yearPrefix: string): Promise<number> {
  if (!HAS_SHEETS_CONFIG) return 1;
  const sheets = await getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId(),
    range: "Enquiries!A2:A",
  });
  const codes = res.data.values ?? [];
  const count = codes.filter((r) => (r[0] ?? "").startsWith(yearPrefix)).length;
  return count + 1;
}

export type EnquiryRow = {
  rowNumber: number; // sheet row (1-indexed, row 1 = headers)
  eventCode: string;
  submittedAt: string;
  fullName: string;
  email: string;
  mobile: string;
  eventType: string;
  eventSubtype: string;
  templateId: string;
  eventTitle: string;
  person1Name: string;
  person2Name: string;
  tentativeDate: string;
  city: string;
  message: string;
  status: string;
  lastContacted: string;
  quotedAmount: string;
  assignedTo: string;
  internalNotes: string;
};

function enqRowFromCells(rowNumber: number, r: string[]): EnquiryRow {
  const get = (col: number) => r[col - 1] ?? "";
  return {
    rowNumber,
    eventCode: get(ENQ_COL.EVENT_CODE),
    submittedAt: get(ENQ_COL.SUBMITTED_AT),
    fullName: get(ENQ_COL.FULL_NAME),
    email: get(ENQ_COL.EMAIL),
    mobile: get(ENQ_COL.MOBILE),
    eventType: get(ENQ_COL.EVENT_TYPE),
    eventSubtype: get(ENQ_COL.EVENT_SUBTYPE),
    templateId: get(ENQ_COL.TEMPLATE_ID),
    eventTitle: get(ENQ_COL.EVENT_TITLE),
    person1Name: get(ENQ_COL.PERSON_1),
    person2Name: get(ENQ_COL.PERSON_2),
    tentativeDate: get(ENQ_COL.TENTATIVE_DATE),
    city: get(ENQ_COL.CITY),
    message: get(ENQ_COL.MESSAGE),
    status: get(ENQ_COL.STATUS),
    lastContacted: get(ENQ_COL.LAST_CONTACTED),
    quotedAmount: get(ENQ_COL.QUOTED_AMOUNT),
    assignedTo: get(ENQ_COL.ASSIGNED_TO),
    internalNotes: get(ENQ_COL.INTERNAL_NOTES),
  };
}

export async function listEnquiries(): Promise<EnquiryRow[]> {
  if (!HAS_SHEETS_CONFIG) return [];
  try {
    const sheets = await getSheets();
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId(),
      range: `Enquiries!A2:${colLetter(ENQ_COL.INTERNAL_NOTES)}`,
    });
    const rows = res.data.values ?? [];
    return rows.map((r, i) => enqRowFromCells(i + 2, r));
  } catch (err) {
    console.error("[sheets] listEnquiries failed:", err);
    return [];
  }
}

export async function getEnquiry(code: string): Promise<EnquiryRow | null> {
  const all = await listEnquiries();
  return all.find((e) => e.eventCode === code) ?? null;
}

export async function updateEnquiryFields(
  code: string,
  updates: Partial<Record<keyof typeof ENQ_COL, string | number | boolean>>,
): Promise<boolean> {
  if (!HAS_SHEETS_CONFIG) return false;
  const rowNum = await findRowNumber("Enquiries", code);
  if (!rowNum) return false;
  const sheets = await getSheets();
  const data = Object.entries(updates).map(([key, value]) => {
    const col = ENQ_COL[key as keyof typeof ENQ_COL];
    return {
      range: `Enquiries!${colLetter(col)}${rowNum}`,
      values: [[value as string | number | boolean]],
    };
  });
  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId: spreadsheetId(),
    requestBody: { valueInputOption: "USER_ENTERED", data },
  });
  return true;
}

/* ────────────────────────────────────────────────────────────────────────
 * Live row reads + writes
 * ──────────────────────────────────────────────────────────────────────── */

export type LiveAuthState = {
  approved: boolean;
  accessToken: string;
  canChangeTemplate: boolean;
  otpHash: string;
  otpExpiresAt: string;
  otpAttempts: number;
  otpLockedUntil: string;
};

async function getLiveRow(code: string): Promise<{ row: string[]; rowNumber: number } | null> {
  if (!HAS_SHEETS_CONFIG) return null;
  const sheets = await getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId(),
    range: LIVE_RANGE_FULL,
  });
  const rows = res.data.values ?? [];
  const idx = rows.findIndex((r) => (r[0] ?? "").trim() === code);
  if (idx < 0) return null;
  return { row: rows[idx], rowNumber: idx + 2 };
}

export async function getLiveAuthState(code: string): Promise<LiveAuthState | null> {
  const found = await getLiveRow(code);
  if (!found) return null;
  const r = found.row;
  const get = (col: number) => r[col - 1] ?? "";
  return {
    approved: boolish(get(LIVE_COL.APPROVED)),
    accessToken: get(LIVE_COL.ACCESS_TOKEN),
    canChangeTemplate: boolish(get(LIVE_COL.CAN_CHANGE_TEMPLATE)),
    otpHash: get(LIVE_COL.OTP_HASH),
    otpExpiresAt: get(LIVE_COL.OTP_EXPIRES_AT),
    otpAttempts: Number(get(LIVE_COL.OTP_ATTEMPTS)) || 0,
    otpLockedUntil: get(LIVE_COL.OTP_LOCKED_UNTIL),
  };
}

/** Find a Live row by Access Token. Used by /manage/[token]. */
export async function getLiveByToken(token: string): Promise<{
  code: string;
  auth: LiveAuthState;
} | null> {
  if (!HAS_SHEETS_CONFIG || !token) return null;
  try {
    const sheets = await getSheets();
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId(),
      range: LIVE_RANGE_FULL,
    });
    const rows = res.data.values ?? [];
    const row = rows.find((r) => (r[LIVE_COL.ACCESS_TOKEN - 1] ?? "").trim() === token);
    if (!row) return null;
    return {
      code: row[LIVE_COL.EVENT_CODE - 1],
      auth: {
        approved: boolish(row[LIVE_COL.APPROVED - 1]),
        accessToken: row[LIVE_COL.ACCESS_TOKEN - 1] ?? "",
        canChangeTemplate: boolish(row[LIVE_COL.CAN_CHANGE_TEMPLATE - 1]),
        otpHash: row[LIVE_COL.OTP_HASH - 1] ?? "",
        otpExpiresAt: row[LIVE_COL.OTP_EXPIRES_AT - 1] ?? "",
        otpAttempts: Number(row[LIVE_COL.OTP_ATTEMPTS - 1]) || 0,
        otpLockedUntil: row[LIVE_COL.OTP_LOCKED_UNTIL - 1] ?? "",
      },
    };
  } catch (err) {
    console.error("[sheets] getLiveByToken failed:", err);
    return null;
  }
}

export async function listLiveEvents(): Promise<EventData[]> {
  if (!HAS_SHEETS_CONFIG) return [];
  try {
    const sheets = await getSheets();
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId(),
      range: LIVE_RANGE_FULL,
    });
    return (res.data.values ?? []).map(liveRowToEvent);
  } catch (err) {
    console.error("[sheets] listLiveEvents failed:", err);
    return [];
  }
}

/** Update specific cells of an existing Live row. Keys are LIVE_COL names. */
export async function updateLiveFields(
  code: string,
  updates: Partial<Record<keyof typeof LIVE_COL, string | number | boolean>>,
): Promise<boolean> {
  if (!HAS_SHEETS_CONFIG) return false;
  const rowNum = await findRowNumber("Live", code);
  if (!rowNum) return false;
  const sheets = await getSheets();
  const data = Object.entries(updates).map(([key, value]) => {
    const col = LIVE_COL[key as keyof typeof LIVE_COL];
    return {
      range: `Live!${colLetter(col)}${rowNum}`,
      values: [[value as string | number | boolean]],
    };
  });
  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId: spreadsheetId(),
    requestBody: { valueInputOption: "USER_ENTERED", data },
  });
  return true;
}

/** Find all sheet rows (1-indexed, row 1 = headers) where col A equals `code`. */
async function findRowNumbersByCode(tab: string, code: string): Promise<number[]> {
  const sheets = await getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId(),
    range: `${tab}!A2:A`,
  });
  const rows = res.data.values ?? [];
  return rows
    .map((r, i) => ((r[0] ?? "").trim() === code ? i + 2 : -1))
    .filter((n) => n > 0);
}

/**
 * Rename an event code across all four tabs (Live, Enquiries, SubEvents, Media).
 * The code is the join key, so every row that references the old code in
 * column A is rewritten.
 *
 * Throws if the new code already exists in any tab. Returns counts per tab.
 */
export async function renameEventCode(
  oldCode: string,
  newCode: string,
): Promise<{ live: number; enquiries: number; subEvents: number; media: number }> {
  if (!HAS_SHEETS_CONFIG) {
    throw new Error("Google Sheets is not configured.");
  }
  if (!/^[A-Z0-9-]+$/.test(newCode)) {
    throw new Error("New code must contain only A-Z, 0-9, and dashes.");
  }
  if (oldCode === newCode) {
    return { live: 0, enquiries: 0, subEvents: 0, media: 0 };
  }

  // Pre-flight: make sure newCode isn't already in use.
  const tabs = ["Live", "Enquiries", "SubEvents", "Media"] as const;
  for (const tab of tabs) {
    const clash = await findRowNumbersByCode(tab, newCode);
    if (clash.length > 0) {
      throw new Error(`New code "${newCode}" already exists in the ${tab} tab.`);
    }
  }

  // Collect updates per tab.
  const liveRows = await findRowNumbersByCode("Live", oldCode);
  const enqRows = await findRowNumbersByCode("Enquiries", oldCode);
  const subRows = await findRowNumbersByCode("SubEvents", oldCode);
  const mediaRows = await findRowNumbersByCode("Media", oldCode);

  const data: { range: string; values: string[][] }[] = [];
  for (const r of liveRows) data.push({ range: `Live!A${r}`, values: [[newCode]] });
  for (const r of enqRows) data.push({ range: `Enquiries!A${r}`, values: [[newCode]] });
  for (const r of subRows) data.push({ range: `SubEvents!A${r}`, values: [[newCode]] });
  for (const r of mediaRows) data.push({ range: `Media!A${r}`, values: [[newCode]] });

  // Also rewrite Live.Slug if it equals the old code (the default).
  if (liveRows.length > 0) {
    const sheets = await getSheets();
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId(),
      range: `Live!${colLetter(LIVE_COL.SLUG)}${liveRows[0]}`,
    });
    const slugVal = (res.data.values?.[0]?.[0] ?? "").trim();
    if (slugVal === oldCode || slugVal === "") {
      data.push({
        range: `Live!${colLetter(LIVE_COL.SLUG)}${liveRows[0]}`,
        values: [[newCode]],
      });
    }
  }

  if (data.length === 0) {
    throw new Error(`No rows found with code "${oldCode}".`);
  }

  const sheets = await getSheets();
  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId: spreadsheetId(),
    requestBody: { valueInputOption: "USER_ENTERED", data },
  });

  return {
    live: liveRows.length,
    enquiries: enqRows.length,
    subEvents: subRows.length,
    media: mediaRows.length,
  };
}

export type ResetSection =
  | "all"
  | "details"   // Tagline, Accent, Hero Image, Main Start/End times
  | "story"     // Invitation Message, About Story
  | "visibility" // Hide flags + RSVP Enabled
  | "subEvents"; // Replace SubEvents tab with demo sub-events

const ALL_SECTIONS: ResetSection[] = ["details", "story", "visibility", "subEvents"];

/**
 * Apply the chosen template's demo content + defaults to a Live row.
 * Enquiry-derived columns (1–14) and auth/lifecycle columns (Approved, Access
 * Token, Is Active, etc.) are NEVER touched — only "content" columns.
 *
 * The `sections` argument lets the customer reset just one part (e.g. only the
 * invitation copy) without losing the rest of their edits. Pass `["all"]` (or
 * leave the default) to reset every section.
 *
 * Use cases:
 *  - First-time pre-fill at approval, so /manage opens looking complete.
 *  - Customer per-section Reset via the EditPanel.
 */
export async function applyTemplateStarter(
  code: string,
  sections: ResetSection[] = ["all"],
): Promise<boolean> {
  if (!HAS_SHEETS_CONFIG) return false;
  const found = await getLiveRow(code);
  if (!found) return false;

  const get = (col: number) => found.row[col - 1] ?? "";
  const templateId = get(LIVE_COL.TEMPLATE_ID) || "royal";
  const tentativeDate = get(LIVE_COL.TENTATIVE_DATE);
  const city = get(LIVE_COL.CITY);

  const meta = TEMPLATES_META.find((t) => t.id === templateId);
  // Look up the canonical demo bundle for this template (the visual reference
  // used on the landing/picker pages). Used for sub-events + a few content
  // hints like start/end times. Demo venue is intentionally *not* copied —
  // that's event-specific and the customer should fill it in.
  const demo = Object.values(DEMO_EVENTS).find(
    (d) => d.event.templateId === templateId,
  );

  const active = sections.includes("all")
    ? new Set<ResetSection>(ALL_SECTIONS)
    : new Set<ResetSection>(sections);

  const updates: Partial<Record<keyof typeof LIVE_COL, string>> = {};

  if (active.has("details")) {
    updates.TAGLINE = meta?.defaults.tagline ?? "";
    updates.ACCENT = meta?.defaults.accentColor ?? "";
    updates.HERO_IMAGE_URL = meta?.defaults.heroImage ?? "";
    if (demo) {
      updates.MAIN_START = demo.event.mainStartTime ?? "";
      updates.MAIN_END = demo.event.mainEndTime ?? "";
    }
  }
  if (active.has("story")) {
    updates.INVITATION_MESSAGE = meta?.defaults.invitationMessage ?? "";
    updates.ABOUT_STORY = meta?.defaults.aboutStory ?? "";
  }
  if (active.has("visibility")) {
    updates.RSVP_ENABLED = "TRUE";
    updates.HIDE_STORY = "FALSE";
    updates.HIDE_EVENTS = "FALSE";
    updates.HIDE_GALLERY = "FALSE";
    updates.HIDE_VENUE = "FALSE";
  }
  // Preserve enquiry-derived bits whenever we touch the Live row, regardless
  // of which section was reset.
  if (Object.keys(updates).length > 0) {
    if (tentativeDate) updates.MAIN_DATE = tentativeDate;
    if (city) updates.VENUE_ADDRESS = city;
    await updateLiveFields(code, updates as never);
  }

  if (active.has("subEvents")) {
    if (demo && demo.subEvents.length > 0) {
      const rebound: SubEvent[] = demo.subEvents.map((s) => ({
        ...s,
        eventCode: code,
      }));
      await replaceSubEventsForCode(code, rebound);
    } else {
      await replaceSubEventsForCode(code, []);
    }
  }

  return true;
}

/** Replace all SubEvents for a code with the given array (in-place overwrite
 *  for rows that exist, append the rest, clear any leftovers). */
export async function replaceSubEventsForCode(
  code: string,
  subs: SubEvent[],
): Promise<void> {
  if (!HAS_SHEETS_CONFIG) return;
  const sheets = await getSheets();
  const existing = await findRowNumbersByCode("SubEvents", code);

  const toRow = (s: SubEvent): (string | number)[] => [
    code,
    s.order,
    s.name ?? "",
    s.date ?? "",
    s.startTime ?? "",
    s.endTime ?? "",
    s.venueName ?? "",
    s.venueAddress ?? "",
    s.mapLink ?? "",
    s.latitude ?? "",
    s.longitude ?? "",
    s.dressCode ?? "",
    s.description ?? "",
    s.icon ?? "",
  ];

  const newRows = subs.map(toRow);
  const blankRow = Array(14).fill("");
  const data: { range: string; values: (string | number)[][] }[] = [];

  // Overwrite or clear each existing row.
  for (let i = 0; i < existing.length; i++) {
    const rowNum = existing[i];
    data.push({
      range: `SubEvents!A${rowNum}:N${rowNum}`,
      values: [i < newRows.length ? newRows[i] : blankRow],
    });
  }

  if (data.length > 0) {
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: spreadsheetId(),
      requestBody: { valueInputOption: "USER_ENTERED", data },
    });
  }

  // Append rows beyond what existed.
  if (newRows.length > existing.length) {
    const extras = newRows.slice(existing.length);
    await sheets.spreadsheets.values.append({
      spreadsheetId: spreadsheetId(),
      range: "SubEvents!A2",
      valueInputOption: "USER_ENTERED",
      requestBody: { values: extras },
    });
  }
}

/** Copy an enquiry's shared columns 1–14 into a new Live row. */
export async function promoteEnquiryToLive(
  enquiry: EnquiryRow,
  opts: { accessToken: string; canChangeTemplate: boolean },
): Promise<boolean> {
  if (!HAS_SHEETS_CONFIG) return false;
  const sheets = await getSheets();
  // Build a row with cols 1–14 from enquiry, blanks through to APPROVED/ACCESS_TOKEN slots.
  const row: (string | number | boolean)[] = new Array(LIVE_LAST_COL).fill("");
  const set = (col: number, value: string | number | boolean) => {
    row[col - 1] = value;
  };
  set(LIVE_COL.EVENT_CODE, enquiry.eventCode);
  set(LIVE_COL.SUBMITTED_AT, enquiry.submittedAt);
  set(LIVE_COL.FULL_NAME, enquiry.fullName);
  set(LIVE_COL.EMAIL, enquiry.email);
  set(LIVE_COL.MOBILE, enquiry.mobile);
  set(LIVE_COL.EVENT_TYPE, enquiry.eventType);
  set(LIVE_COL.EVENT_SUBTYPE, enquiry.eventSubtype);
  set(LIVE_COL.TEMPLATE_ID, enquiry.templateId);
  set(LIVE_COL.EVENT_TITLE, enquiry.eventTitle);
  set(LIVE_COL.PERSON_1, enquiry.person1Name);
  set(LIVE_COL.PERSON_2, enquiry.person2Name);
  set(LIVE_COL.TENTATIVE_DATE, enquiry.tentativeDate);
  set(LIVE_COL.CITY, enquiry.city);
  set(LIVE_COL.MESSAGE, enquiry.message);
  set(LIVE_COL.IS_ACTIVE, "FALSE"); // customer publishes via /manage
  set(LIVE_COL.APPROVED, "TRUE");
  set(LIVE_COL.ACCESS_TOKEN, opts.accessToken);
  set(LIVE_COL.CAN_CHANGE_TEMPLATE, opts.canChangeTemplate ? "TRUE" : "FALSE");

  // Sensible pre-fills so the customer doesn't land on an entirely blank
  // editor — they can still change any of these.
  if (enquiry.tentativeDate) set(LIVE_COL.MAIN_DATE, enquiry.tentativeDate);
  if (enquiry.city) set(LIVE_COL.VENUE_ADDRESS, enquiry.city);
  set(LIVE_COL.RSVP_ENABLED, "TRUE");
  set(LIVE_COL.SLUG, enquiry.eventCode);

  await sheets.spreadsheets.values.append({
    spreadsheetId: spreadsheetId(),
    range: "Live!A2",
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [row] },
  });

  // Pre-fill the chosen template's demo content + sub-events so /manage opens
  // looking complete. The customer can edit anything; the auth/CRM columns
  // we just wrote above are not touched.
  await applyTemplateStarter(enquiry.eventCode);

  return true;
}
