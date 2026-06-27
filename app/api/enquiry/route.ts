import { NextResponse } from "next/server";
import { appendEnquiry, getNextSequence } from "@/lib/sheets";
import { generateEventCode } from "@/lib/eventCode";
import { getEventTypeConfig } from "@/config/eventTypes";
import { getTemplateMeta } from "@/components/templates/metadata";
import type { EnquiryPayload } from "@/lib/types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_RE = /^\+?[0-9\-\s()]{8,}$/;

export async function POST(req: Request) {
  let data: EnquiryPayload;
  try {
    data = (await req.json()) as EnquiryPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const required: (keyof EnquiryPayload)[] = [
    "fullName",
    "email",
    "mobile",
    "eventType",
    "templateId",
    "eventTitle",
    "person1Name",
  ];
  for (const k of required) {
    if (!data[k] || String(data[k]).trim() === "") {
      return NextResponse.json({ error: `Missing field: ${k}` }, { status: 400 });
    }
  }
  if (!EMAIL_RE.test(data.email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
  if (!MOBILE_RE.test(data.mobile)) {
    return NextResponse.json({ error: "Invalid mobile" }, { status: 400 });
  }

  let typeConfig;
  try {
    typeConfig = getEventTypeConfig(data.eventType);
  } catch {
    return NextResponse.json({ error: "Unknown event type" }, { status: 400 });
  }

  const template = getTemplateMeta(data.templateId);
  if (!template || !template.eventTypes.includes(data.eventType)) {
    return NextResponse.json({ error: "Template not valid for this event type" }, { status: 400 });
  }

  const year = new Date().getFullYear();
  const prefix = `${typeConfig.codePrefix}-${year}-`;
  const seq = await getNextSequence(prefix);
  const eventCode = generateEventCode(data.eventType, seq, year);

  const row = [
    eventCode,
    new Date().toISOString(),
    data.fullName,
    data.email,
    data.mobile,
    data.eventType,
    data.eventSubtype ?? "",
    data.templateId,
    data.eventTitle,
    data.person1Name,
    data.person2Name ?? "",
    data.tentativeDate ?? "",
    data.city ?? "",
    data.message ?? "",
    "New", // Status
    "",    // Last Contacted On
    "",    // Quoted Amount
    "",    // Assigned To
    "",    // Internal Call Notes
  ];

  try {
    await appendEnquiry(row);
  } catch (err) {
    console.error("appendEnquiry failed", err);
    return NextResponse.json({ error: "Failed to save enquiry" }, { status: 500 });
  }

  // Note: media host (Cloudinary) creates folders on-demand at first upload,
  // so no pre-provisioning step is needed at approval/enquiry time.

  return NextResponse.json({ ok: true, eventCode });
}
