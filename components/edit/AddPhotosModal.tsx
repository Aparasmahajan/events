"use client";

import { useEffect, useRef, useState } from "react";
import { useEditMode } from "@/components/edit/EditContext";
import type { MediaItem } from "@/lib/types";

type NewPhoto = { id: number; file: File; url: string; caption: string; isVideo: boolean };

/**
 * Add several photos/videos at once, each with its own description, then upload
 * them all (staged) in one go. Used both from the on-page gallery "+ Add" tile
 * and from the side edit panel, so there's always an obvious way to upload.
 */
export function AddPhotosModal({
  onClose,
  section = "gallery",
}: {
  onClose: () => void;
  section?: string;
}) {
  const ctx = useEditMode();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const idRef = useRef(0);
  const [rows, setRows] = useState<NewPhoto[]>([]);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // Revoke any object URLs still around when the modal unmounts.
  const rowsRef = useRef<NewPhoto[]>([]);
  rowsRef.current = rows;
  useEffect(() => () => rowsRef.current.forEach((r) => URL.revokeObjectURL(r.url)), []);

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const next: NewPhoto[] = Array.from(files).map((f) => ({
      id: idRef.current++,
      file: f,
      url: URL.createObjectURL(f),
      caption: "",
      isVideo: f.type.startsWith("video/"),
    }));
    setRows((r) => [...r, ...next]);
  };

  const removeRow = (id: number) =>
    setRows((r) => {
      const hit = r.find((x) => x.id === id);
      if (hit) URL.revokeObjectURL(hit.url);
      return r.filter((x) => x.id !== id);
    });

  const setCaption = (id: number, caption: string) =>
    setRows((r) => r.map((x) => (x.id === id ? { ...x, caption } : x)));

  const uploadAll = async () => {
    if (!ctx?.uploadEndpoint || rows.length === 0) return;
    const endpoint = ctx.uploadEndpoint;
    setBusy(true);
    setErr(null);
    setProgress({ done: 0, total: rows.length });
    try {
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const fd = new FormData();
        fd.append("file", row.file);
        fd.append("section", section);
        const res = await fetch(endpoint, { method: "POST", body: fd });
        const body = (await res.json().catch(() => ({}))) as
          | { ok: true; item: MediaItem }
          | { error: string };
        if (!res.ok || !("item" in body)) {
          throw new Error(
            "error" in body ? body.error : `Upload failed (${res.status})`,
          );
        }
        const caption = row.caption.trim();
        ctx.addMedia?.({ ...body.item, caption: caption || undefined });
        setProgress({ done: i + 1, total: rows.length });
      }
      onClose();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed");
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[85] bg-black/60 flex items-center justify-center p-4"
      onClick={busy ? undefined : onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Add photos"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white text-neutral-900 rounded-2xl shadow-2xl border border-black/10 w-full max-w-lg max-h-[85vh] flex flex-col"
      >
        <header className="px-5 py-4 border-b border-black/10 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] opacity-60">Gallery</p>
            <p className="font-display text-lg leading-tight">Add photos &amp; videos</p>
          </div>
          <button
            onClick={onClose}
            disabled={busy}
            className="text-xl opacity-60 hover:opacity-100 disabled:opacity-30"
            aria-label="Close"
          >
            ×
          </button>
        </header>

        <div className="overflow-y-auto p-5 space-y-3">
          {rows.length === 0 && (
            <p className="text-sm opacity-60 text-center py-6">
              Choose one or more photos or videos, add a description to each, then
              upload them all together.
            </p>
          )}
          {rows.map((r) => (
            <div
              key={r.id}
              className="flex items-start gap-3 rounded-lg border border-black/10 p-2"
            >
              {r.isVideo ? (
                <div className="w-16 h-16 rounded bg-black text-white flex items-center justify-center text-lg flex-none">
                  ▶
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={r.url}
                  alt={r.file.name}
                  className="w-16 h-16 rounded object-cover flex-none"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs truncate opacity-70 mb-1">{r.file.name}</p>
                <input
                  value={r.caption}
                  onChange={(e) => setCaption(r.id, e.target.value)}
                  placeholder="Add a description (optional)"
                  className="w-full rounded-md border border-black/15 bg-white px-3 py-1.5 text-sm focus:outline-none focus:border-black/40"
                />
              </div>
              <button
                onClick={() => removeRow(r.id)}
                disabled={busy}
                className="text-xs text-red-600 hover:underline flex-none mt-1 disabled:opacity-50"
              >
                Remove
              </button>
            </div>
          ))}

          <button
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="w-full text-sm px-3 py-2 rounded-lg border border-dashed border-black/20 hover:border-black/40 hover:bg-black/[0.02] transition disabled:opacity-50"
          >
            + Choose {rows.length > 0 ? "more " : ""}photos / videos
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={(e) => {
              addFiles(e.target.files);
              if (inputRef.current) inputRef.current.value = "";
            }}
            className="hidden"
          />
          {err && <p className="text-xs text-red-600">{err}</p>}
        </div>

        <footer className="px-5 py-4 border-t border-black/10 flex items-center justify-between gap-3">
          <span className="text-xs opacity-60">
            {progress
              ? `Uploading ${progress.done}/${progress.total}…`
              : `${rows.length} selected`}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              disabled={busy}
              className="text-xs px-4 py-2 rounded-full border border-black/15 hover:bg-black/5 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={uploadAll}
              disabled={busy || rows.length === 0}
              className="text-xs px-5 py-2 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-50"
            >
              {busy
                ? "Uploading…"
                : `Add ${rows.length || ""} ${rows.length === 1 ? "photo" : "photos"}`.replace(
                    /\s+/g,
                    " ",
                  )}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
