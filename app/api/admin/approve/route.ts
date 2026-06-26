import { NextResponse } from "next/server";
import { generateAccessToken } from "@/lib/auth";
import {
  getEnquiry,
  getLiveAuthState,
  promoteEnquiryToLive,
  updateEnquiryFields,
} from "@/lib/sheets";

type Body = { code?: string; canChangeTemplate?: boolean };

export async function POST(req: Request) {
  let body: Body = {};
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const code = (body.code ?? "").trim();
  if (!code) return NextResponse.json({ error: "Missing code" }, { status: 400 });

  const enquiry = await getEnquiry(code);
  if (!enquiry) return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });

  // Idempotency — don't double-promote.
  const existing = await getLiveAuthState(code);
  if (existing?.approved) {
    return NextResponse.json({
      ok: true,
      alreadyApproved: true,
      accessToken: existing.accessToken,
    });
  }

  const accessToken = generateAccessToken();
  const ok = await promoteEnquiryToLive(enquiry, {
    accessToken,
    canChangeTemplate: !!body.canChangeTemplate,
  });
  if (!ok) {
    return NextResponse.json(
      { error: "Failed to write to Live tab. Is Sheets configured?" },
      { status: 500 },
    );
  }

  await updateEnquiryFields(code, { STATUS: "Approved" });
  return NextResponse.json({ ok: true, accessToken });
}
