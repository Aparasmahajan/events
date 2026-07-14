"use client";

import { useState } from "react";

type Props = {
  templateId: string;
  /** Big title, e.g. "Arjun weds Meera". */
  title: string;
  /** Couple line, e.g. "Arjun & Meera". */
  names?: string;
  /** The event DATE (not a live countdown), pre-formatted e.g. "14 December 2026". */
  dateLabel?: string;
  /** City / venue line (optional). */
  place?: string;
  /** Small eyebrow line, e.g. the template tagline. */
  tagline?: string;
  /** Hero image URL (same-origin /samples or a CORS-enabled host). */
  heroUrl?: string;
  /** Template accent colour (hex). */
  accent: string;
};

type OrientKey = "landscape" | "portrait";
const ORIENTS: Record<OrientKey, { w: number; h: number; label: string; icon: string }> = {
  landscape: { w: 1280, h: 720, label: "Landscape", icon: "🖥" },
  portrait: { w: 720, h: 1280, label: "Mobile", icon: "📱" },
};

// Effects are pluggable; for now only a static hold is offered. Fade in/out can
// be added later by redrawing per frame with an alpha derived from progress.
type Effect = "static";
const EFFECT: Effect = "static";

function loadImage(src?: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    if (!src) return resolve(null);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export function DownloadVideoButton(props: Props) {
  const { templateId, title, names, dateLabel, place, tagline, heroUrl, accent } = props;
  const [busy, setBusy] = useState<OrientKey | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const drawFrame = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    img: HTMLImageElement | null,
    alpha: number,
  ) => {
    ctx.clearRect(0, 0, w, h);
    ctx.save();
    ctx.globalAlpha = alpha;

    // Background: cover-fit hero, else an accent-tinted gradient.
    if (img && img.width) {
      const scale = Math.max(w / img.width, h / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
    } else {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, "#12121a");
      g.addColorStop(1, accent);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    }

    // Legibility scrim.
    ctx.fillStyle = "rgba(0,0,0,0.28)";
    ctx.fillRect(0, 0, w, h);
    const grad = ctx.createLinearGradient(0, h * 0.35, 0, h);
    grad.addColorStop(0, "rgba(0,0,0,0)");
    grad.addColorStop(1, "rgba(0,0,0,0.72)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    const cx = w / 2;
    const maxTextW = w * 0.84;
    const unit = Math.min(w, h);
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";

    let y = h * (w > h ? 0.5 : 0.52);
    if (tagline) {
      ctx.font = `${Math.round(unit * 0.028)}px Georgia, "Times New Roman", serif`;
      ctx.fillStyle = accent;
      const eyebrow = tagline.toUpperCase();
      const ls = unit * 0.006;
      const total = eyebrow.split("").reduce((a, c) => a + ctx.measureText(c).width + ls, -ls);
      let x = cx - total / 2;
      for (const c of eyebrow) {
        ctx.fillText(c, x + ctx.measureText(c).width / 2, y);
        x += ctx.measureText(c).width + ls;
      }
      y += unit * 0.08;
    }

    const titleSize = Math.round(unit * (w > h ? 0.075 : 0.085));
    ctx.font = `${titleSize}px Georgia, "Times New Roman", serif`;
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = unit * 0.02;
    for (const ln of wrapLines(ctx, title || names || "", maxTextW)) {
      ctx.fillText(ln, cx, y);
      y += titleSize * 1.05;
    }
    ctx.shadowBlur = 0;

    if (dateLabel) {
      y += unit * 0.02;
      ctx.font = `${Math.round(unit * 0.034)}px Georgia, "Times New Roman", serif`;
      ctx.fillStyle = accent;
      ctx.fillText(dateLabel.toUpperCase(), cx, y);
      y += unit * 0.045;
    }
    if (place) {
      ctx.font = `${Math.round(unit * 0.026)}px Georgia, "Times New Roman", serif`;
      ctx.fillStyle = "rgba(255,255,255,0.82)";
      ctx.fillText(place, cx, y);
    }

    ctx.restore();
  };

  const generate = async (orient: OrientKey) => {
    if (busy) return;
    setErr(null);
    setBusy(orient);
    try {
      if (typeof VideoEncoder === "undefined") {
        throw new Error("This browser can't build video here — try Chrome or Edge.");
      }
      const { w, h } = ORIENTS[orient];
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported");
      const img = await loadImage(heroUrl);

      const fps = 30;
      const seconds = 3;
      const totalFrames = fps * seconds;

      // Pick a supported codec: H.264 first (widest playback), else VP9.
      const cands: { codec: string; mux: "avc" | "vp9" }[] = [
        { codec: "avc1.42001f", mux: "avc" },
        { codec: "vp09.00.10.08", mux: "vp9" },
      ];
      let chosen: { codec: string; mux: "avc" | "vp9" } | null = null;
      for (const c of cands) {
        const ok = await VideoEncoder.isConfigSupported({
          codec: c.codec,
          width: w,
          height: h,
          bitrate: 6_000_000,
          framerate: fps,
        })
          .then((r) => !!r.supported)
          .catch(() => false);
        if (ok) {
          chosen = c;
          break;
        }
      }
      if (!chosen) throw new Error("No supported video codec in this browser.");

      const { Muxer, ArrayBufferTarget } = await import("mp4-muxer");
      const muxer = new Muxer({
        target: new ArrayBufferTarget(),
        video: { codec: chosen.mux, width: w, height: h },
        fastStart: "in-memory",
      });
      let encodeError: unknown = null;
      const encoder = new VideoEncoder({
        output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
        error: (e) => {
          encodeError = e;
        },
      });
      encoder.configure({
        codec: chosen.codec,
        width: w,
        height: h,
        bitrate: 6_000_000,
        framerate: fps,
      });

      // Static effect: draw once, hold. (Fade would redraw per frame with alpha.)
      drawFrame(ctx, w, h, img, 1);
      for (let i = 0; i < totalFrames; i++) {
        if (encodeError) throw encodeError;
        const frame = new VideoFrame(canvas, {
          timestamp: Math.round((i * 1_000_000) / fps),
          duration: Math.round(1_000_000 / fps),
        });
        encoder.encode(frame, { keyFrame: i % fps === 0 });
        frame.close();
      }
      await encoder.flush();
      encoder.close();
      if (encodeError) throw encodeError;
      muxer.finalize();

      const blob = new Blob([muxer.target.buffer], { type: "video/mp4" });
      if (blob.size < 1000) throw new Error("Generation produced no data.");

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const safe = (title || templateId).replace(/[^\w-]+/g, "-").replace(/^-+|-+$/g, "");
      a.download = `${safe}-${orient}.mp4`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Couldn't generate the video");
    } finally {
      setBusy(null);
    }
  };

  return (
    <section className="border-t border-white/10 bg-neutral-950 px-6 py-16 text-center text-white">
      <p className="text-[11px] uppercase tracking-[0.35em] text-white/45">Preview</p>
      <h2 className="mt-3 font-display text-2xl sm:text-3xl">
        Download this template&apos;s animation
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/60">
        Generated live, right here in your browser, from this page — with your
        event date. Pick a shape.
      </p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        {(Object.keys(ORIENTS) as OrientKey[]).map((key) => {
          const o = ORIENTS[key];
          const isBusy = busy === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => generate(key)}
              disabled={!!busy}
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-neutral-900 shadow-lg transition hover:bg-white/90 disabled:opacity-60"
              aria-label={`Generate and download the ${o.label.toLowerCase()} video`}
            >
              <span aria-hidden>{o.icon}</span>
              {isBusy ? "Generating…" : o.label}
              {!isBusy && <span aria-hidden className="opacity-50">↓</span>}
            </button>
          );
        })}
      </div>
      {err && <p className="mt-4 text-xs text-red-300">{err}</p>}
    </section>
  );
}
