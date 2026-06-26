import { Readable } from "stream";

const HAS_DRIVE_CONFIG =
  !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
  !!process.env.GOOGLE_PRIVATE_KEY &&
  !!process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;

export type UploadedMedia = {
  driveFileId: string;
  publicUrl: string;
  fileName: string;
};

async function getDrive() {
  const { google } = await import("googleapis");
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: (process.env.GOOGLE_PRIVATE_KEY ?? "").replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/drive"],
  });
  return google.drive({ version: "v3", auth });
}

export async function ensureEventFolder(eventCode: string): Promise<string | null> {
  if (!HAS_DRIVE_CONFIG) return null;
  const drive = await getDrive();
  const rootId = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID!;
  const q = `mimeType='application/vnd.google-apps.folder' and name='${eventCode}' and '${rootId}' in parents and trashed=false`;
  const existing = await drive.files.list({ q, fields: "files(id, name)" });
  if (existing.data.files && existing.data.files.length > 0) return existing.data.files[0].id ?? null;
  const created = await drive.files.create({
    requestBody: {
      name: eventCode,
      mimeType: "application/vnd.google-apps.folder",
      parents: [rootId],
    },
    fields: "id",
  });
  return created.data.id ?? null;
}

export async function uploadToEvent(
  eventCode: string,
  section: string,
  file: { name: string; mimeType: string; buffer: Buffer },
): Promise<UploadedMedia | null> {
  if (!HAS_DRIVE_CONFIG) return null;
  const drive = await getDrive();
  const folderId = await ensureEventFolder(eventCode);
  if (!folderId) return null;

  // section sub-folder
  const subQ = `mimeType='application/vnd.google-apps.folder' and name='${section}' and '${folderId}' in parents and trashed=false`;
  const subList = await drive.files.list({ q: subQ, fields: "files(id)" });
  let subId = subList.data.files?.[0]?.id ?? null;
  if (!subId) {
    const sub = await drive.files.create({
      requestBody: {
        name: section,
        mimeType: "application/vnd.google-apps.folder",
        parents: [folderId],
      },
      fields: "id",
    });
    subId = sub.data.id ?? null;
  }
  if (!subId) return null;

  const created = await drive.files.create({
    requestBody: { name: file.name, parents: [subId] },
    media: { mimeType: file.mimeType, body: bufferToStream(file.buffer) },
    fields: "id",
  });
  const fileId = created.data.id;
  if (!fileId) return null;

  await drive.permissions.create({
    fileId,
    requestBody: { role: "reader", type: "anyone" },
  });

  return {
    driveFileId: fileId,
    publicUrl: `https://drive.google.com/uc?id=${fileId}`,
    fileName: file.name,
  };
}

function bufferToStream(buf: Buffer) {
  return Readable.from(buf);
}
