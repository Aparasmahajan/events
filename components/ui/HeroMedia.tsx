"use client";

import Image, { type ImageProps } from "next/image";
import { useRef, useState } from "react";
import { useEditMode } from "@/components/edit/EditContext";

type Props = {
  imageSrc: string;
  videoSrc?: string;
  alt: string;
  /** Pass any of Image's layout props. Defaults to fill + object-cover. */
  imageProps?: Partial<Omit<ImageProps, "src" | "alt">>;
  /** Extra Tailwind classes applied to both the <Image> and <video> — used by
   *  templates that need blend modes / opacity overlays on the hero. */
  className?: string;
  /** When set, the video plays muted on loop. Default true (hero is ambient). */
  autoplay?: boolean;
};

/**
 * Hero slot. Shows a still <Image> normally, or a silent autoplaying loop
 * <video> when `videoSrc` is set. In edit mode (EditContext.enabled), a hover
 * overlay lets the customer click to replace the hero with a new file.
 */
export function HeroMedia({
  imageSrc,
  videoSrc,
  alt,
  imageProps,
  className,
  autoplay = true,
}: Props) {
  const ctx = useEditMode();
  const editable = !!ctx?.enabled && !!ctx.uploadEndpoint;
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const pick = () => {
    if (!editable || busy) return;
    fileRef.current?.click();
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !ctx?.uploadEndpoint) return;
    setBusy(true);
    setErr(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("section", "hero");
      const res = await fetch(ctx.uploadEndpoint, { method: "POST", body: fd });
      const body = (await res.json().catch(() => ({}))) as
        | { ok: true; item: { mediaType: "image" | "video"; publicUrl: string } }
        | { error: string };
      if (!res.ok || !("item" in body)) {
        const message =
          "error" in body ? body.error : `Upload failed (${res.status})`;
        console.error("[upload] hero failed", res.status, body);
        throw new Error(message);
      }
      // Stage the new hero locally — public /e/<code> still shows the old hero
      // until the customer clicks Save and publish.
      if (body.item.mediaType === "video") {
        ctx.updateEvent?.({ heroVideoUrl: body.item.publicUrl });
      } else {
        ctx.updateEvent?.({
          heroImageUrl: body.item.publicUrl,
          // Clear any previous hero video so the new image actually shows
          // (video takes precedence in HeroMedia).
          heroVideoUrl: "",
        });
      }
    } catch (er) {
      const message = er instanceof Error ? er.message : "Upload failed";
      setErr(message);
      window.alert(`Couldn't replace the hero:\n\n${message}`);
      if (fileRef.current) fileRef.current.value = "";
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {videoSrc ? (
        <video
          src={videoSrc}
          poster={imageSrc}
          autoPlay={autoplay}
          muted
          loop
          playsInline
          className={`absolute inset-0 w-full h-full object-cover ${className ?? ""}`}
          aria-label={alt}
        />
      ) : (
        <Image
          src={imageSrc}
          alt={alt}
          fill
          sizes="100vw"
          priority
          className={`object-cover ${className ?? ""}`}
          {...imageProps}
        />
      )}

      {editable && (
        <>
          <button
            onClick={pick}
            disabled={busy}
            className="absolute inset-0 z-20 group flex items-end justify-end p-5 sm:p-8"
            aria-label="Replace hero media"
          >
            <span className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition pointer-events-none" />
            <span className="relative bg-white text-neutral-900 text-xs font-medium uppercase tracking-widest px-3.5 py-2 rounded-full shadow-lg flex items-center gap-2 opacity-80 group-hover:opacity-100 transition">
              <span aria-hidden>📷</span>
              {busy ? "Uploading…" : "Replace hero"}
            </span>
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*,video/*"
            onChange={onFile}
            className="hidden"
          />
          {err && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs px-3 py-1.5 rounded-full z-30">
              {err}
            </div>
          )}
        </>
      )}
    </>
  );
}
