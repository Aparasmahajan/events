import { NextResponse } from "next/server";
import { uploadToEvent, HAS_CLOUDINARY_CONFIG } from "@/lib/media";
import { getLiveByToken } from "@/lib/sheets";
import type { MediaItem } from "@/lib/types";

export const runtime = "nodejs";

const ALLOWED_SECTIONS = new Set([
  "hero",
  "gallery",
  "couple",
  "about",
  "videos",
]);

const MAX_BYTES = {
  image: 12 * 1024 * 1024,
  video: 100 * 1024 * 1024,
} as const;

/**
 * STAGING-ONLY upload. The file goes to Cloudinary and we hand the URL +
 * public_id back to the client. We **don't** touch the Live row, the Media
 * sheet, or call revalidate — that all happens later when the customer hits
 * "Save and publish" and the panel PATCHes /api/manage/[token] with the full
 * batch (event + subEvents + media).
 *
 * Why: previously this route published instantly, so guests on /e/<code> saw
 * unsaved uploads. Customers also lost the ability to "discard changes" for
 * media. With staging, the customer's editor shows a local preview but the
 * public site stays untouched until Save.
 *
 * The one cost: files uploaded but never saved become orphans on Cloudinary.
 * The free tier easily absorbs that; if it ever matters, we can periodically
 * sweep Cloudinary for assets that aren't referenced in any Media row.
 */
export async function POST(req: Request, ctx: { params: { token: string } }) {
  const found = await getLiveByToken(ctx.params.token);
  if (!found || !found.auth.approved) {
    return NextResponse.json({ error: "Unknown event" }, { status: 404 });
  }
  const code = found.code;

  const form = await req.formData();
  const file = form.get("file");
  const sectionRaw = String(form.get("section") ?? "gallery");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }
  const section = sectionRaw.startsWith("sub-event:")
    ? sectionRaw
    : ALLOWED_SECTIONS.has(sectionRaw)
      ? sectionRaw
      : "gallery";

  const isVideo = file.type.startsWith("video/");
  const mediaType: MediaItem["mediaType"] = isVideo ? "video" : "image";

  const cap = isVideo ? MAX_BYTES.video : MAX_BYTES.image;
  if (file.size > cap) {
    return NextResponse.json(
      {
        error: `File is too large — max ${(cap / 1024 / 1024).toFixed(0)} MB for ${mediaType}s.`,
      },
      { status: 413 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const uploaded = await uploadToEvent(code, section, {
    name: file.name,
    mimeType: file.type || (isVideo ? "video/mp4" : "image/jpeg"),
    buffer,
  });

  if (!uploaded) {
    return NextResponse.json(
      {
        error:
          "No storage backend available. Tried Cloudinary (not configured) and local disk (failed). Check server logs.",
      },
      { status: 503 },
    );
  }

  const warning = HAS_CLOUDINARY_CONFIG
    ? undefined
    : "Using local file storage (no Cloudinary config). Files are not backed up.";

  const item: MediaItem = {
    eventCode: code,
    mediaType,
    section,
    fileName: file.name,
    driveFileId: uploaded.driveFileId, // Cloudinary public_id
    publicUrl: uploaded.publicUrl,
    sortOrder: 0, // client sets the real sort order before saving
    uploadedAt: new Date().toISOString(),
  };

  return NextResponse.json({ ok: true, item, warning });
}
