import { NextResponse } from "next/server";
import { uploadToEvent } from "@/lib/media";
import { isValidEventCode } from "@/lib/eventCode";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const form = await req.formData();
  const eventCode = String(form.get("eventCode") ?? "");
  const section = String(form.get("section") ?? "gallery");
  const file = form.get("file");

  if (!isValidEventCode(eventCode)) {
    return NextResponse.json({ error: "Invalid event code" }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const uploaded = await uploadToEvent(eventCode, section, {
    name: file.name,
    mimeType: file.type || "application/octet-stream",
    buffer,
  });

  if (!uploaded) {
    return NextResponse.json(
      { error: "Drive not configured. Set Google credentials in env to enable uploads." },
      { status: 503 },
    );
  }

  // TODO (Phase 4 follow-up): append to Media sheet with publicUrl, sortOrder etc.

  return NextResponse.json({ ok: true, ...uploaded });
}
