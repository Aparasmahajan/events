import { createHash } from "crypto";
import fs from "fs";
import path from "path";

/**
 * Media uploads go to Cloudinary in production. On local dev (when Cloudinary
 * isn't configured), files are saved to `public/uploads/` and served by Next's
 * static file handler — no cloud account needed for Windows laptops.
 */

const HAS_CLOUDINARY_CONFIG =
  !!process.env.CLOUDINARY_CLOUD_NAME &&
  !!process.env.CLOUDINARY_API_KEY &&
  !!process.env.CLOUDINARY_API_SECRET;

export { HAS_CLOUDINARY_CONFIG };

export type UploadedMedia = {
  driveFileId: string;
  publicUrl: string;
  fileName: string;
  resourceType?: "image" | "video" | "raw";
  width?: number;
  height?: number;
  duration?: number;
  bytes?: number;
};

type CloudinaryResponse = {
  public_id: string;
  secure_url: string;
  resource_type: "image" | "video" | "raw";
  width?: number;
  height?: number;
  duration?: number;
  bytes?: number;
  format?: string;
  original_filename?: string;
};

function signParams(params: Record<string, string>, apiSecret: string): string {
  const toSign = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return createHash("sha1").update(toSign + apiSecret).digest("hex");
}

/** Upload via Cloudinary signed API. */
async function uploadToCloudinary(
  eventCode: string,
  section: string,
  file: { name: string; mimeType: string; buffer: Buffer },
): Promise<UploadedMedia | null> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME!;
  const apiKey = process.env.CLOUDINARY_API_KEY!;
  const apiSecret = process.env.CLOUDINARY_API_SECRET!;

  const folder = `EventSites/${eventCode}/${section}`;
  const timestamp = String(Math.floor(Date.now() / 1000));

  const signed = { folder, timestamp };
  const signature = signParams(signed, apiSecret);

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

  const form = new FormData();
  form.append(
    "file",
    new Blob([new Uint8Array(file.buffer)], { type: file.mimeType }),
    file.name,
  );
  form.append("api_key", apiKey);
  form.append("timestamp", timestamp);
  form.append("folder", folder);
  form.append("signature", signature);

  let res: Response;
  try {
    res = await fetch(url, { method: "POST", body: form });
  } catch (err) {
    console.error("[cloudinary] network error:", err);
    return null;
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error("[cloudinary] upload failed:", res.status, body);
    return null;
  }

  const json = (await res.json()) as CloudinaryResponse;
  return {
    driveFileId: json.public_id,
    publicUrl: json.secure_url,
    fileName: file.name,
    resourceType: json.resource_type,
    width: json.width,
    height: json.height,
    duration: json.duration,
    bytes: json.bytes,
  };
}

/** Upload to local `public/uploads/{eventCode}/{section}/` — for dev on
 *  Windows laptops where Cloudinary isn't set up. Files are served by Next's
 *  static file handler at `/uploads/...`. */
async function uploadToLocal(
  eventCode: string,
  section: string,
  file: { name: string; mimeType: string; buffer: Buffer },
): Promise<UploadedMedia | null> {
  const ext = path.extname(file.name) || ".bin";
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const ts = Date.now();
  const outName = `${ts}-${safeName}`;
  const relDir = `uploads/${eventCode}/${section}`;
  const absDir = path.join(process.cwd(), "public", relDir);

  try {
    fs.mkdirSync(absDir, { recursive: true });
    const dest = path.join(absDir, outName);
    fs.writeFileSync(dest, file.buffer);
    console.log(`[local media] saved → ${dest} (${file.buffer.length} bytes)`);
  } catch (err) {
    console.error("[local media] write failed:", err);
    return null;
  }

  const isVideo = file.mimeType.startsWith("video/");
  return {
    driveFileId: `local:${relDir}/${outName}`,
    publicUrl: `/${relDir}/${outName}`,
    fileName: file.name,
    resourceType: isVideo ? "video" : "image",
    bytes: file.buffer.length,
  };
}

/**
 * Upload a single file — Cloudinary in prod, local disk in dev.
 *
 * Returns null if no storage backend is available (shouldn't happen: local
 * always works unless the filesystem is readonly).
 */
export async function uploadToEvent(
  eventCode: string,
  section: string,
  file: { name: string; mimeType: string; buffer: Buffer },
): Promise<UploadedMedia | null> {
  if (HAS_CLOUDINARY_CONFIG) {
    return uploadToCloudinary(eventCode, section, file);
  }
  return uploadToLocal(eventCode, section, file);
}
