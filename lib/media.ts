import { createHash } from "crypto";

/**
 * Media uploads now go to Cloudinary instead of Google Drive.
 *
 * Why: service accounts on personal Google accounts have zero Drive quota,
 * making Drive uploads impossible without Workspace + Shared Drives. Cloudinary
 * has a free tier, real CDN delivery, on-the-fly transformations, and works
 * the same on every Google account.
 *
 * The exported `uploadToEvent` keeps the same signature it had under Drive, so
 * the rest of the app (upload route, Media sheet writes) is unchanged. The
 * `driveFileId` field on `UploadedMedia` now stores Cloudinary's `public_id`
 * — same role (vendor-specific asset reference), different vendor.
 */

const HAS_CLOUDINARY_CONFIG =
  !!process.env.CLOUDINARY_CLOUD_NAME &&
  !!process.env.CLOUDINARY_API_KEY &&
  !!process.env.CLOUDINARY_API_SECRET;

export type UploadedMedia = {
  /** Cloudinary public_id. Stored in the Media sheet's "Drive File ID" column
   *  for now (rename when we drop Drive completely). */
  driveFileId: string;
  /** secure_url from Cloudinary — https-only, CDN-backed. */
  publicUrl: string;
  fileName: string;
  /** Cloudinary's `resource_type` — "image", "video", or "raw". */
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

/** Cloudinary signed-upload signature: SHA-1 of sorted form params + api_secret. */
function signParams(params: Record<string, string>, apiSecret: string): string {
  const toSign = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return createHash("sha1").update(toSign + apiSecret).digest("hex");
}

/**
 * Upload a single file to Cloudinary under `EventSites/{eventCode}/{section}/`.
 *
 * Returns null if Cloudinary isn't configured (so the upload route can return
 * a clean 503 instead of crashing).
 */
export async function uploadToEvent(
  eventCode: string,
  section: string,
  file: { name: string; mimeType: string; buffer: Buffer },
): Promise<UploadedMedia | null> {
  if (!HAS_CLOUDINARY_CONFIG) return null;

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME!;
  const apiKey = process.env.CLOUDINARY_API_KEY!;
  const apiSecret = process.env.CLOUDINARY_API_SECRET!;

  const folder = `EventSites/${eventCode}/${section}`;
  const timestamp = String(Math.floor(Date.now() / 1000));

  // Cloudinary signs over the params it actually receives (minus file,
  // signature, api_key, resource_type). For our minimal payload that's:
  //   folder, timestamp
  // If we ever add more (tags, context, public_id), include them here too.
  const signed = { folder, timestamp };
  const signature = signParams(signed, apiSecret);

  // `auto` lets Cloudinary detect image vs video from the file's content type.
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

  const form = new FormData();
  form.append(
    "file",
    // Copy into a Uint8Array<ArrayBuffer> so it's a valid BlobPart — a Node
    // Buffer's underlying store is ArrayBufferLike (possibly SharedArrayBuffer),
    // which the Blob/BlobPart types reject.
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
