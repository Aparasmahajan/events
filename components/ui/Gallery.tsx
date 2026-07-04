"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { MediaItem } from "@/lib/types";
import { useEditMode } from "@/components/edit/EditContext";
import { ImageEditor } from "@/components/edit/ImageEditor";
import { AddPhotosModal } from "@/components/edit/AddPhotosModal";

type Props = { items: MediaItem[]; columns?: 2 | 3 | 4 };

export function Gallery({ items, columns = 3 }: Props) {
  const [open, setOpen] = useState<number | null>(null);
  // Index (within `imageItems`) of the photo open in the crop editor.
  const [cropIndex, setCropIndex] = useState<number | null>(null);
  const editCtx = useEditMode();
  const editing = !!editCtx?.enabled;
  // Only still images can be cropped; the editor navigates among these.
  const imageItems = items.filter((m) => m.mediaType === "image");

  const close = useCallback(() => setOpen(null), []);
  const next = useCallback(
    () => setOpen((i) => (i === null ? null : (i + 1) % items.length)),
    [items.length],
  );
  const prev = useCallback(
    () => setOpen((i) => (i === null ? null : (i - 1 + items.length) % items.length)),
    [items.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, next, prev]);

  // When editing with zero items, still render — show just the "+" tile so the
  // customer has somewhere to upload to.
  if (!items.length && !editing) return null;

  const colClass =
    columns === 2
      ? "sm:grid-cols-2"
      : columns === 4
        ? "sm:grid-cols-2 lg:grid-cols-4"
        : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <>
      <div className={`grid grid-cols-1 ${colClass} gap-3 sm:gap-4`}>
        {items.map((item, i) => (
          <GalleryTile
            key={`${item.fileName}-${i}`}
            item={item}
            onOpen={() => setOpen(i)}
            onEditImage={
              item.mediaType === "image"
                ? () => setCropIndex(imageItems.indexOf(item))
                : undefined
            }
          />
        ))}
        {editing && <AddTile />}
      </div>

      {open !== null && (
        <Lightbox
          item={items[open]}
          onClose={close}
          onNext={next}
          onPrev={prev}
        />
      )}

      {cropIndex !== null && imageItems[cropIndex] && (
        <ImageEditor
          items={imageItems}
          index={cropIndex}
          recommended={{ ratio: 4 / 5, label: "gallery 4:5" }}
          onClose={() => setCropIndex(null)}
          onNavigate={setCropIndex}
          onApply={(result, original) => {
            if (result.mode === "transform") {
              // Non-destructive: same asset, just a cropped delivery URL.
              if (original.driveFileId)
                editCtx?.updateMedia?.(original.driveFileId, { publicUrl: result.publicUrl });
            } else if (original.driveFileId) {
              editCtx?.replaceMedia?.(original.driveFileId, result.item);
            } else {
              editCtx?.addMedia?.(result.item);
            }
          }}
        />
      )}
    </>
  );
}

function GalleryTile({
  item,
  onOpen,
  onEditImage,
}: {
  item: MediaItem;
  onOpen: () => void;
  /** Open the crop/zoom editor. Provided for images only. */
  onEditImage?: () => void;
}) {
  const editCtx = useEditMode();
  const editing = !!editCtx?.enabled;
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing_, setEditing] = useState(false); // edit-details modal

  // In edit mode, clicking the tile shows an action menu instead of going
  // straight to lightbox. The user picks: View / Edit details / Replace / Delete.
  const handleTileClick = () => {
    if (editing) setMenuOpen(true);
    else onOpen();
  };

  if (item.mediaType === "video") {
    if (item.autoplay) {
      // Instagram-style inline silent loop.
      return (
        <div className="relative overflow-hidden rounded-lg aspect-[4/5] group">
          <video
            src={item.publicUrl}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
          {editing && (
            <button
              onClick={handleTileClick}
              className="absolute inset-0 z-0"
              aria-label="Open media menu"
            />
          )}
          {item.caption && (
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent text-white text-sm p-3 opacity-0 group-hover:opacity-100 transition pointer-events-none">
              {item.caption}
            </span>
          )}
          <span className="absolute top-2 left-2 text-[10px] uppercase tracking-widest text-white/80 bg-black/40 backdrop-blur px-2 py-0.5 rounded-full pointer-events-none">
            ● Live
          </span>
          {editing && (
            <TileMenuTrigger item={item} accept="video/*" onEditDetails={() => setEditing(true)} onView={onOpen} />
          )}
          {menuOpen && (
            <TileActionMenu
              item={item}
              accept="video/*"
              onClose={() => setMenuOpen(false)}
              onView={() => { setMenuOpen(false); onOpen(); }}
              onEditDetails={() => { setMenuOpen(false); setEditing(true); }}
            />
          )}
          {editing_ && (
            <EditDetailsModal item={item} onClose={() => setEditing(false)} />
          )}
        </div>
      );
    }
    // Press-to-play: thumbnail + play badge, opens in lightbox with controls.
    return (
      <div className="group relative overflow-hidden rounded-lg aspect-[4/5] bg-black">
        <button
          onClick={handleTileClick}
          className="absolute inset-0 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
          aria-label={editing ? "Open media menu" : `Play video${item.caption ? `: ${item.caption}` : ""}`}
        >
          <video
            src={item.publicUrl}
            muted
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition"
          />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="w-14 h-14 rounded-full bg-white/90 text-neutral-900 flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition">
              ▶
            </span>
          </span>
          {item.caption && (
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent text-white text-sm p-3 opacity-0 group-hover:opacity-100 transition">
              {item.caption}
            </span>
          )}
        </button>
        {editing && <TileMenuTrigger item={item} accept="video/*" onEditDetails={() => setEditing(true)} onView={onOpen} />}
        {menuOpen && (
          <TileActionMenu
            item={item}
            accept="video/*"
            onClose={() => setMenuOpen(false)}
            onView={() => { setMenuOpen(false); onOpen(); }}
            onEditDetails={() => { setMenuOpen(false); setEditing(true); }}
          />
        )}
        {editing_ && (
          <EditDetailsModal item={item} onClose={() => setEditing(false)} />
        )}
      </div>
    );
  }

  return (
    <div className="group relative overflow-hidden rounded-lg aspect-[4/5]">
      <button
        onClick={handleTileClick}
        className="absolute inset-0 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
        aria-label={editing ? "Open media menu" : `Open image${item.caption ? `: ${item.caption}` : ""}`}
      >
        <Image
          src={item.publicUrl}
          alt={item.caption ?? "Gallery image"}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        {item.caption && (
          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent text-white text-sm p-3 opacity-0 group-hover:opacity-100 transition">
            {item.caption}
          </span>
        )}
      </button>
      {editing && <TileMenuTrigger item={item} accept="image/*" onEditDetails={() => setEditing(true)} onView={onOpen} />}
      {menuOpen && (
        <TileActionMenu
          item={item}
          accept="image/*"
          onClose={() => setMenuOpen(false)}
          onView={() => { setMenuOpen(false); onOpen(); }}
          onEditDetails={() => { setMenuOpen(false); setEditing(true); }}
          onEditImage={
            onEditImage
              ? () => {
                  setMenuOpen(false);
                  onEditImage();
                }
              : undefined
          }
        />
      )}
      {editing_ && (
        <EditDetailsModal item={item} onClose={() => setEditing(false)} />
      )}
    </div>
  );
}

/** Small "Edit" pill in the top-right corner — always visible in edit mode.
 *  Clicking it opens the action menu (View / Edit details / Replace / Delete).
 *  Hovering still gives a peek of options via the menu trigger. */
function TileMenuTrigger({
  item,
  accept,
  onEditDetails,
  onView,
}: {
  item: MediaItem;
  accept: string;
  onEditDetails: () => void;
  onView: () => void;
}) {
  // Just renders the pill; the parent owns menu open state. Suppressed unused
  // params kept on the API in case we want this to be self-contained later.
  void item;
  void accept;
  void onEditDetails;
  void onView;
  return (
    <span className="absolute top-2 right-2 z-10 bg-white/95 backdrop-blur text-neutral-900 text-[10px] font-medium uppercase tracking-widest px-2.5 py-1.5 rounded-full shadow-md flex items-center gap-1.5 pointer-events-none">
      <span aria-hidden>✎</span>
      Edit
    </span>
  );
}

/** Centered action menu overlay that pops over the clicked tile.
 *  Options: View / Edit details / Replace / Delete. */
function TileActionMenu({
  item,
  accept,
  onClose,
  onView,
  onEditDetails,
  onEditImage,
}: {
  item: MediaItem;
  accept: string;
  onClose: () => void;
  onView: () => void;
  onEditDetails: () => void;
  /** Open the crop/zoom editor (images only). */
  onEditImage?: () => void;
}) {
  const ctx = useEditMode();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);

  const pickReplacement = () => {
    if (busy) return;
    inputRef.current?.click();
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !ctx?.uploadEndpoint) return;
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("section", item.section);
      const res = await fetch(ctx.uploadEndpoint, { method: "POST", body: fd });
      const body = (await res.json().catch(() => ({}))) as
        | { ok: true; item: MediaItem }
        | { error: string };
      if (!res.ok || !("item" in body)) {
        const message =
          "error" in body ? body.error : `Upload failed (${res.status})`;
        console.error("[upload] failed", res.status, body);
        throw new Error(message);
      }
      // Stage the replacement locally — public site stays on the OLD media
      // until the customer hits Save and publish.
      if (item.driveFileId) ctx.replaceMedia?.(item.driveFileId, body.item);
      else ctx.addMedia?.(body.item);
      onClose();
    } catch (err) {
      window.alert(
        `Couldn't replace this media:\n\n${
          err instanceof Error ? err.message : "Upload failed"
        }`,
      );
      if (inputRef.current) inputRef.current.value = "";
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = () => {
    if (!ctx?.deleteMedia || !item.driveFileId) {
      window.alert("Can't delete — no asset id stored on this row.");
      return;
    }
    if (
      !window.confirm(
        `Delete ${item.caption || item.fileName}?\n\nIt'll be removed from your site on the next Save and publish.`,
      )
    )
      return;
    ctx.deleteMedia(item.driveFileId);
    onClose();
  };

  return (
    <div
      className="absolute inset-0 z-30 bg-black/60 flex items-center justify-center p-3"
      onClick={onClose}
      role="dialog"
      aria-label="Media actions"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl shadow-2xl border border-black/10 w-full max-w-[240px] p-2 flex flex-col gap-1"
      >
        <button
          onClick={onView}
          className="text-left text-sm px-3 py-2 rounded-md hover:bg-black/[0.04] flex items-center gap-2.5"
        >
          <span aria-hidden>👁</span> View full size
        </button>
        <button
          onClick={onEditDetails}
          className="text-left text-sm px-3 py-2 rounded-md hover:bg-black/[0.04] flex items-center gap-2.5"
        >
          <span aria-hidden>✏️</span> Edit details
          <span className="ml-auto text-[10px] uppercase tracking-widest opacity-50">
            caption{item.mediaType === "video" ? ", autoplay" : ""}
          </span>
        </button>
        {onEditImage && (
          <button
            onClick={onEditImage}
            className="text-left text-sm px-3 py-2 rounded-md hover:bg-black/[0.04] flex items-center gap-2.5"
          >
            <span aria-hidden>✂️</span> Crop &amp; adjust
            <span className="ml-auto text-[10px] uppercase tracking-widest opacity-50">
              zoom
            </span>
          </button>
        )}
        <button
          onClick={pickReplacement}
          disabled={busy}
          className="text-left text-sm px-3 py-2 rounded-md hover:bg-black/[0.04] flex items-center gap-2.5 disabled:opacity-50"
        >
          <span aria-hidden>📷</span>
          {busy ? "Uploading…" : "Replace with a new upload"}
        </button>
        <button
          onClick={handleDelete}
          className="text-left text-sm px-3 py-2 rounded-md hover:bg-red-50 text-red-700 flex items-center gap-2.5"
        >
          <span aria-hidden>🗑</span> Delete
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={onFile}
          className="hidden"
        />
      </div>
    </div>
  );
}

/** Inline form to edit caption + (for videos) autoplay flag. Saves into the
 *  panel's local state via EditContext.updateMedia — gets persisted with the
 *  next Save and publish. */
function EditDetailsModal({
  item,
  onClose,
}: {
  item: MediaItem;
  onClose: () => void;
}) {
  const ctx = useEditMode();
  const [caption, setCaption] = useState(item.caption ?? "");
  const [section, setSection] = useState(item.section);
  const [autoplay, setAutoplay] = useState(!!item.autoplay);

  const apply = () => {
    if (!ctx?.updateMedia || !item.driveFileId) {
      window.alert("Can't save — no asset id stored on this row.");
      return;
    }
    ctx.updateMedia(item.driveFileId, {
      caption: caption.trim() ? caption.trim() : undefined,
      section,
      autoplay: item.mediaType === "video" ? autoplay : undefined,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[80] bg-black/60 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl border border-black/10 w-full max-w-md p-6 space-y-4"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] opacity-60">
              Edit details
            </p>
            <p className="font-display text-xl mt-1 truncate">
              {item.fileName}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-xl opacity-60 hover:opacity-100"
          >
            ×
          </button>
        </div>

        <label className="block">
          <span className="block text-xs uppercase tracking-widest opacity-70 mb-1">
            Caption
          </span>
          <input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="e.g. First look, mandap, reception…"
            className="w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm focus:outline-none focus:border-black/40"
          />
        </label>

        <label className="block">
          <span className="block text-xs uppercase tracking-widest opacity-70 mb-1">
            Section
          </span>
          <select
            value={section}
            onChange={(e) => setSection(e.target.value)}
            className="w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm focus:outline-none focus:border-black/40"
          >
            {["hero", "gallery", "couple", "about", "videos"].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        {item.mediaType === "video" && (
          <label className="flex items-center justify-between gap-3 cursor-pointer py-1">
            <span className="text-sm">
              Autoplay (silent loop)
              <span className="block text-[11px] opacity-60">
                Off = press-to-play with controls.
              </span>
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={autoplay}
              onClick={() => setAutoplay(!autoplay)}
              className={`relative w-10 h-6 rounded-full transition-colors ${
                autoplay ? "bg-neutral-900" : "bg-neutral-300"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  autoplay ? "translate-x-4" : ""
                }`}
              />
            </button>
          </label>
        )}

        <p className="text-[11px] opacity-60">
          Changes save into your draft now. Click <strong>Save and publish</strong> in
          the side panel to push them to the live site.
        </p>

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="text-xs px-4 py-2 rounded-full border border-black/15 hover:bg-black/5"
          >
            Cancel
          </button>
          <button
            onClick={apply}
            className="text-xs px-4 py-2 rounded-full bg-neutral-900 text-white hover:bg-neutral-800"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

/** Trailing "+ add" tile for adding a new gallery item. */
function AddTile() {
  const ctx = useEditMode();
  const [open, setOpen] = useState(false);

  if (!ctx?.uploadEndpoint) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative rounded-lg aspect-[4/5] border-2 border-dashed border-black/15 hover:border-black/40 hover:bg-black/[0.02] transition flex items-center justify-center text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-4xl leading-none">+</span>
          <span className="text-[11px] uppercase tracking-widest">Add photos</span>
        </div>
      </button>
      {open && <AddPhotosModal onClose={() => setOpen(false)} />}
    </>
  );
}

function Lightbox({
  item,
  onClose,
  onNext,
  onPrev,
}: {
  item: MediaItem;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        className="absolute left-4 sm:left-8 text-white text-3xl p-2 hover:scale-110 transition"
        aria-label="Previous"
      >
        ‹
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        className="absolute right-4 sm:right-8 text-white text-3xl p-2 hover:scale-110 transition"
        aria-label="Next"
      >
        ›
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-4 right-4 text-white text-2xl p-2"
        aria-label="Close"
      >
        ×
      </button>
      <div
        className="relative w-full max-w-5xl aspect-[16/9]"
        onClick={(e) => e.stopPropagation()}
      >
        {item.mediaType === "video" ? (
          <video
            src={item.publicUrl}
            controls
            autoPlay
            playsInline
            className="w-full h-full object-contain bg-black"
          />
        ) : (
          <Image
            src={item.publicUrl}
            alt={item.caption ?? "Image"}
            fill
            sizes="100vw"
            className="object-contain"
            priority
          />
        )}
        {item.caption && (
          <p className="absolute -bottom-10 inset-x-0 text-center text-white/90 text-sm">
            {item.caption}
          </p>
        )}
      </div>
    </div>
  );
}
