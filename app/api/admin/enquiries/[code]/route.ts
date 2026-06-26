import { NextResponse } from "next/server";
import { ENQ_COL, updateEnquiryFields } from "@/lib/sheets";

type Body = Partial<Record<keyof typeof ENQ_COL, string | number | boolean>>;

export async function PATCH(req: Request, ctx: { params: { code: string } }) {
  let body: Body = {};
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  // Whitelist updatable fields
  const allowed: (keyof typeof ENQ_COL)[] = [
    "STATUS",
    "LAST_CONTACTED",
    "QUOTED_AMOUNT",
    "ASSIGNED_TO",
    "INTERNAL_NOTES",
  ];
  const updates: Body = {};
  for (const key of allowed) {
    if (key in body) updates[key] = body[key] as never;
  }
  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No allowed fields in payload" }, { status: 400 });
  }
  const ok = await updateEnquiryFields(ctx.params.code, updates);
  if (!ok) return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
