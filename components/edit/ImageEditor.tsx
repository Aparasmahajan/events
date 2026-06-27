"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useEditMode } from "@/components/edit/EditContext";
import type { MediaItem } from "@/lib/types";

/** Crop aspect presets. `ratio` is width / height; null = the image's own. */
const ASPECTS = [
  { key: "orig", label: "Original", ratio: null as number | null },
  { key: "1:1", label: "1:1", ratio: 1 },
  { key: "4:5", label: "4:5", ratio: 4 / 5 },
  { key: "3:2", label: "3:2", ratio: 3 / 2 },
  { key: "16:9", label: "16:9", ratio: 16 / 9 },
] as const;

const MAX_OUTPUT_EDGE = 1600; // cap the exported crop's longest side
const MIN_ZOOM = 1;
const MAX_ZOOM = 6;

type Props = {
  /** All editable (image) items, in display order — used for prev/next. */
  items: MediaItem[];
  /** Index into `items` of the photo currently open. */
  index: number;
  onClose: () => void;
  /** Switch which photo is open (prev/next, keyboard). */
  onNavigate: (nextIndex: number) => void;
  /** Commit the freshly-uploaded crop into the draft. The caller decides how:
   *  the gallery replaces/appends a Media item; the hero writes heroImageUrl. */
  onUploaded: (uploaded: MediaItem, original: MediaItem) => void;
};

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/**
 * Full-screen crop / zoom / rotate editor. Scroll to zoom, drag to pan, pick an
 * aspect, rotate in 90° steps, then Apply: the visible crop is rendered to a
 * canvas, re-uploaded through the staging upload endpoint, and handed to
 * `onUploaded` so the caller folds it into the local draft (shown immediately,
 * committed on "Save and publish"). Prev/Next moves between photos.
 */
export function ImageEditor({ items, index, onClose, onNavigate, onUploaded }: Props) {
  const ctx = useEditMode();
  const item = items[index];

  const vpRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const dragRef = useRef<{ x: number; y: number } | null>(null);

  const [nat, setNat] = useState({ w: 0, h: 0 });
  const [vp, setVp] = useState({ w: 0, h: 0 });
  const [aspectKey, setAspectKey] = useState<(typeof ASPECTS)[number]["key"]>("orig");
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0); // 0 | 90 | 180 | 270
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const ratio = ASPECTS.find((a) => a.key === aspectKey)?.ratio ?? null;

  // Load the original under a distinct URL (extra query param) so the browser
  // fetches a fresh CORS-enabled copy instead of reusing the gallery's cached
  // non-CORS response — otherwise the canvas taints and the crop can't export.
  const editSrc =
    item.publicUrl + (item.publicUrl.includes("?") ? "&" : "?") + "xcors=1";

  // The original, CORS-clean image element — kept separately so rotation always
  // composes from the source (not from an already-rotated copy).
  const [baseImg, setBaseImg] = useState<HTMLImageElement | null>(null);
  // What the <img> actually shows: the original at rotation 0, or a rotated
  // data: URL (same-origin → canvas-safe) at 90/180/270.
  const [displaySrc, setDisplaySrc] = useState("");

  // cover-scale so the image always fills the crop frame, then user zoom on top
  const baseScale =
    nat.w && nat.h && vp.w && vp.h ? Math.max(vp.w / nat.w, vp.h / nat.h) : 1;
  const scale = baseScale * zoom;

  // Latest geometry for use inside imperative event handlers (avoids stale closures).
  const live = useRef({ scale, vpW: vp.w, vpH: vp.h, natW: nat.w, natH: nat.h });
  live.current = { scale, vpW: vp.w, vpH: vp.h, natW: nat.w, natH: nat.h };

  const clampPan = useCallback((x: number, y: number) => {
    const { scale: s, vpW, vpH, natW, natH } = live.current;
    const dispW = natW * s;
    const dispH = natH * s;
    const maxX = Math.max(0, (dispW - vpW) / 2);
    const maxY = Math.max(0, (dispH - vpH) / 2);
    return { x: clamp(x, -maxX, maxX), y: clamp(y, -maxY, maxY) };
  }, []);

  // Load the source image (CORS-enabled) for rotation composition.
  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => setBaseImg(img);
    img.onerror = () => setErr("Couldn't load this image.");
    img.src = editSrc;
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [editSrc]);

  // Produce the displayed src for the current rotation.
  useEffect(() => {
    if (rotation % 360 === 0) {
      setDisplaySrc(editSrc);
      return;
    }
    if (!baseImg) return;
    const w = baseImg.naturalWidth;
    const h = baseImg.naturalHeight;
    const swap = rotation % 180 !== 0;
    const cw = swap ? h : w;
    const ch = swap ? w : h;
    const cv = document.createElement("canvas");
    cv.width = cw;
    cv.height = ch;
    const c = cv.getContext("2d");
    if (!c) return;
    c.translate(cw / 2, ch / 2);
    c.rotate((rotation * Math.PI) / 180);
    c.drawImage(baseImg, -w / 2, -h / 2);
    try {
      setDisplaySrc(cv.toDataURL("image/jpeg", 0.92));
    } catch {
      setErr("This image can't be edited here (it's hosted without cross-origin access).");
    }
  }, [baseImg, rotation, editSrc]);

  // Reset transform when the photo changes (navigation).
  useEffect(() => {
    setRotation(0);
    setAspectKey("orig");
  }, [item.publicUrl]);

  // Reset zoom/pan when the photo, aspect, or rotation changes.
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setErr(null);
  }, [item.publicUrl, aspectKey, rotation]);

  // Re-clamp pan after a zoom / viewport change so we never reveal gaps.
  useEffect(() => {
    setPan((p) => clampPan(p.x, p.y));
  }, [zoom, vp.w, vp.h, nat.w, nat.h, clampPan]);

  // Size the crop frame to fit the screen for the chosen aspect.
  useEffect(() => {
    const compute = () => {
      const availW = Math.min(window.innerWidth - 40, 760);
      const availH = Math.max(220, window.innerHeight * 0.6);
      const r = ratio ?? (nat.w && nat.h ? nat.w / nat.h : 1);
      let w = availW;
      let h = w / r;
      if (h > availH) {
        h = availH;
        w = h * r;
      }
      setVp({ w: Math.round(w), h: Math.round(h) });
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [ratio, nat.w, nat.h]);

  // Scroll-to-zoom (native non-passive listener so we can prevent page scroll).
  useEffect(() => {
    const el = vpRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const factor = e.deltaY > 0 ? 0.9 : 1.1;
      setZoom((z) => clamp(z * factor, MIN_ZOOM, MAX_ZOOM));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // Keyboard: Esc closes, ←/→ navigate photos.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && items.length > 1)
        onNavigate((index + 1) % items.length);
      if (e.key === "ArrowLeft" && items.length > 1)
        onNavigate((index - 1 + items.length) % items.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, items.length, onClose, onNavigate]);

  const onPointerDown = (e: React.PointerEvent) => {
    dragRef.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.x;
    const dy = e.clientY - dragRef.current.y;
    dragRef.current = { x: e.clientX, y: e.clientY };
    setPan((p) => clampPan(p.x + dx, p.y + dy));
  };
  const onPointerUp = () => {
    dragRef.current = null;
  };

  const apply = () => {
    const img = imgRef.current;
    if (!img || !ctx?.uploadEndpoint) return;
    const { scale: s, vpW, vpH, natW, natH } = live.current;
    if (!s || !natW || !natH) return;

    const dispW = natW * s;
    const dispH = natH * s;
    const imgLeft = (vpW - dispW) / 2 + pan.x;
    const imgTop = (vpH - dispH) / 2 + pan.y;

    let srcX = -imgLeft / s;
    let srcY = -imgTop / s;
    let srcW = vpW / s;
    let srcH = vpH / s;
    srcX = clamp(srcX, 0, Math.max(0, natW - 1));
    srcY = clamp(srcY, 0, Math.max(0, natH - 1));
    srcW = Math.min(srcW, natW - srcX);
    srcH = Math.min(srcH, natH - srcY);

    const outScale = Math.min(1, MAX_OUTPUT_EDGE / Math.max(srcW, srcH));
    const outW = Math.max(1, Math.round(srcW * outScale));
    const outH = Math.max(1, Math.round(srcH * outScale));

    const canvas = document.createElement("canvas");
    canvas.width = outW;
    canvas.height = outH;
    const c = canvas.getContext("2d");
    if (!c) {
      setErr("Your browser couldn't open a canvas to crop with.");
      return;
    }

    const uploadEndpoint = ctx.uploadEndpoint;
    setBusy(true);
    setErr(null);
    try {
      c.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, outW, outH);
      canvas.toBlob(
        (blob) => {
          void (async () => {
            try {
              if (!blob) throw new Error("Couldn't render the crop.");
              const base = item.fileName.replace(/\.[^.]+$/, "") || "image";
              const file = new File([blob], `${base}-edited.jpg`, {
                type: "image/jpeg",
              });
              const fd = new FormData();
              fd.append("file", file);
              fd.append("section", item.section);
              const res = await fetch(uploadEndpoint, { method: "POST", body: fd });
              const body = (await res.json().catch(() => ({}))) as
                | { ok: true; item: MediaItem }
                | { error: string };
              if (!res.ok || !("item" in body)) {
                throw new Error(
                  "error" in body ? body.error : `Upload failed (${res.status})`,
                );
              }
              onUploaded(body.item, item);
              onClose();
            } catch (e) {
              setErr(e instanceof Error ? e.message : "Save failed.");
            } finally {
              setBusy(false);
            }
          })();
        },
        "image/jpeg",
        0.9,
      );
    } catch {
      // Tainted canvas (cross-origin image without CORS headers).
      setBusy(false);
      setErr(
        "This image can't be cropped here (it's hosted without cross-origin access). Re-upload it, then crop.",
      );
    }
  };

  const dispW = nat.w * scale;
  const dispH = nat.h * scale;

  return (
    <div
      className="fixed inset-0 z-[90] bg-black/90 flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label="Edit image"
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 text-white border-b border-white/10">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.3em] opacity-60">
            Edit image · crop &amp; rotate
          </p>
          <p className="text-sm truncate max-w-[40vw]">{item.fileName}</p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-1.5">
          {ASPECTS.map((a) => (
            <button
              key={a.key}
              onClick={() => setAspectKey(a.key)}
              className={`text-xs px-2.5 py-1.5 rounded-full border transition ${
                aspectKey === a.key
                  ? "bg-white text-neutral-900 border-white"
                  : "border-white/25 hover:border-white/60 text-white"
              }`}
            >
              {a.label}
            </button>
          ))}
          <button
            onClick={() => setRotation((r) => (r + 90) % 360)}
            className="text-xs px-2.5 py-1.5 rounded-full border border-white/25 hover:border-white/60 text-white flex items-center gap-1.5"
            aria-label="Rotate 90 degrees"
          >
            <span aria-hidden>⟳</span> Rotate
          </button>
          <button
            onClick={onClose}
            aria-label="Close editor"
            className="ml-1 text-2xl leading-none px-2 text-white/80 hover:text-white"
          >
            ×
          </button>
        </div>
      </div>

      {/* Stage */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden select-none">
        {items.length > 1 && (
          <>
            <button
              onClick={() => onNavigate((index - 1 + items.length) % items.length)}
              aria-label="Previous photo"
              className="absolute left-3 sm:left-6 z-10 text-white text-3xl p-2 hover:scale-110 transition"
            >
              ‹
            </button>
            <button
              onClick={() => onNavigate((index + 1) % items.length)}
              aria-label="Next photo"
              className="absolute right-3 sm:right-6 z-10 text-white text-3xl p-2 hover:scale-110 transition"
            >
              ›
            </button>
          </>
        )}

        <div
          ref={vpRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          style={{ width: vp.w || 1, height: vp.h || 1, touchAction: "none" }}
          className="relative overflow-hidden rounded-lg bg-black/40 ring-1 ring-white/30 cursor-grab active:cursor-grabbing"
        >
          {displaySrc ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imgRef}
                src={displaySrc}
                alt={item.caption ?? item.fileName}
                crossOrigin="anonymous"
                draggable={false}
                onLoad={(e) =>
                  setNat({
                    w: e.currentTarget.naturalWidth,
                    h: e.currentTarget.naturalHeight,
                  })
                }
                onError={() => setErr("Couldn't load this image.")}
                style={{
                  position: "absolute",
                  width: dispW || "auto",
                  height: dispH || "auto",
                  left: (vp.w - dispW) / 2 + pan.x,
                  top: (vp.h - dispH) / 2 + pan.y,
                  maxWidth: "none",
                }}
              />
              {/* rule-of-thirds guides */}
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute top-1/3 inset-x-0 h-px bg-white/30" />
                <div className="absolute top-2/3 inset-x-0 h-px bg-white/30" />
                <div className="absolute left-1/3 inset-y-0 w-px bg-white/30" />
                <div className="absolute left-2/3 inset-y-0 w-px bg-white/30" />
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-white/60 text-sm">
              Loading…
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="px-4 py-3 border-t border-white/10 text-white">
        {err && <p className="text-xs text-red-300 mb-2 text-center">{err}</p>}
        <div className="flex items-center gap-4 max-w-xl mx-auto">
          <span className="text-xs opacity-70 w-12">Zoom</span>
          <input
            type="range"
            min={MIN_ZOOM}
            max={MAX_ZOOM}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1 accent-[var(--accent)]"
            aria-label="Zoom"
          />
          <button
            onClick={onClose}
            disabled={busy}
            className="text-xs px-4 py-2 rounded-full border border-white/25 hover:border-white/60 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={apply}
            disabled={busy || !nat.w}
            className="text-xs px-5 py-2 rounded-full bg-white text-neutral-900 font-medium hover:bg-white/90 disabled:opacity-50"
          >
            {busy ? "Saving…" : "Apply"}
          </button>
        </div>
        <p className="text-[11px] opacity-50 text-center mt-2">
          Scroll to zoom · drag to reposition · ⟳ to rotate
          {items.length > 1 ? " · ← / → to switch photos" : ""}. Saves to your
          draft and commits on Save and publish.
        </p>
      </div>
    </div>
  );
}
