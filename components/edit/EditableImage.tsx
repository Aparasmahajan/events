"use client";

import Image, { type ImageProps } from "next/image";
import { useRef, useState } from "react";
import { useEditMode } from "./EditContext";

type Props = Omit<ImageProps, "src"> & {
  src: string;
  /** Where the upload should be stored — `hero`, `gallery`, `couple`, etc. */
  section: string;
  /** If set, the upload replaces the Media row whose `driveFileId` matches.
   *  Leave blank to append a new row (use this for "+ Add" tiles). */
  replaceAssetId?: string;
  /** Backwards-compat fallback when no asset id is available. */
  replaceFileName?: string;
  /** Show as a square-ish placeholder with a "+" affordance instead of an
   *  image. Used for the trailing "add a new gallery item" tile. */
  asAddTile?: boolean;
  /** Accept attribute for the file picker. Default `image/*`. */
  accept?: string;
};

/**
 * Editable image / "+ add" tile. Renders a plain <Image> when no EditContext
 * is present (i.e. on the public /e/[code] page). In edit mode (/manage/...)
 * it shows a hover overlay; click → file picker → upload → page reload.
 */
export function EditableImage({
  section,
  replaceAssetId,
  replaceFileName,
  asAddTile = false,
  accept = "image/*",
  alt,
  ...imageProps
}: Props) {
  const ctx = useEditMode();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const editable = !!ctx?.enabled && !!ctx.uploadEndpoint;

  const pick = () => {
    if (!editable || busy) return;
    inputRef.current?.click();
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !ctx?.uploadEndpoint) return;
    setBusy(true);
    setErr(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("section", section);
      if (replaceAssetId) fd.append("replaceAssetId", replaceAssetId);
      else if (replaceFileName) fd.append("replaceFileName", replaceFileName);
      const res = await fetch(ctx.uploadEndpoint, { method: "POST", body: fd });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? "Upload failed");
      window.location.reload();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed");
      setBusy(false);
    }
  };

  if (asAddTile) {
    return (
      <button
        onClick={pick}
        disabled={!editable || busy}
        className="relative w-full h-full rounded-lg border-2 border-dashed border-black/15 hover:border-black/40 hover:bg-black/[0.02] transition flex items-center justify-center text-neutral-500"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-3xl">+</span>
          <span className="text-xs uppercase tracking-widest">
            {busy ? "Uploading…" : "Add photo / video"}
          </span>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={`${accept},video/*`}
          onChange={onFile}
          className="hidden"
        />
      </button>
    );
  }

  return (
    <>
      <Image {...imageProps} alt={alt} src={imageProps.src as string} />
      {editable && (
        <>
          <button
            onClick={pick}
            disabled={busy}
            className="absolute inset-0 group z-10 flex items-center justify-center"
            aria-label="Replace this image"
          >
            <span className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition" />
            <span className="relative bg-white text-neutral-900 text-xs font-medium uppercase tracking-widest px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition shadow-lg">
              {busy ? "Uploading…" : "Replace"}
            </span>
          </button>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={onFile}
            className="hidden"
          />
        </>
      )}
      {err && (
        <div className="absolute bottom-0 inset-x-0 bg-red-600 text-white text-[11px] px-2 py-1 text-center z-20">
          {err}
        </div>
      )}
    </>
  );
}
