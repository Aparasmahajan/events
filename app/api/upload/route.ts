import { NextResponse } from "next/server";
import { uploadToEvent, HAS_CLOUDINARY_CONFIG } from "@/lib/media";
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
      { error: "No storage backend available. Check server logs." },
      { status: 503 },
    );
  }

  const warning = HAS_CLOUDINARY_CONFIG
    ? undefined
    : "Using local file storage (no Cloudinary config). Files are not backed up.";

  return NextResponse.json({ ok: true, ...uploaded, warning });
}
