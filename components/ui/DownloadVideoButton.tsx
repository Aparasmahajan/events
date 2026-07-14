"use client";

import { useState } from "react";

type PlanItem = { name: string; when?: string; where?: string; icon?: string };
type Photo = { url: string; caption?: string };

type Props = {
  templateId: string;
  title: string;
  names?: string;
  /** Event DATE (not a countdown), e.g. "14 December 2026". */
  dateLabel?: string;
  place?: string;
  tagline?: string;
  heroUrl?: string;
  accent: string;
  /** The schedule / plan — same sub-events the live page lists. */
  plan?: PlanItem[];
  venueName?: string;
  venueAddress?: string;
  /** Gallery photos. */
  photos?: Photo[];
};

type OrientKey = "landscape" | "portrait";
const ORIENTS: Record<OrientKey, { w: number; h: number; label: string; icon: string }> = {
  landscape: { w: 1280, h: 720, label: "Landscape", icon: "🖥" },
  portrait: { w: 720, h: 1280, label: "Mobile", icon: "📱" },
};

type Motion = "cinematic" | "gentle" | "static";
type Length = "short" | "standard" | "long";

const FPS = 30;
const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const easeInOut = (t: number) => 0.5 - 0.5 * Math.cos(Math.PI * clamp(t));
const easeOut = (t: number) => 1 - Math.pow(1 - clamp(t), 3);

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

export function DownloadVideoButton(props: Props) {
  const { templateId, title, names, dateLabel, place, tagline, heroUrl, accent, plan, venueName, venueAddress, photos } = props;
  const [busy, setBusy] = useState<OrientKey | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const hasPlan = !!(plan && plan.length);
  const hasVenue = !!(venueName || venueAddress);
  const hasPhotos = !!(photos && photos.length);

  // ---- client-configurable video settings ----
  const [includePlan, setIncludePlan] = useState(true);
  const [includeVenue, setIncludeVenue] = useState(true);
  const [includePhotos, setIncludePhotos] = useState(true);
  const [motion, setMotion] = useState<Motion>("cinematic");
  const [length, setLength] = useState<Length>("standard");

  const generate = async (orient: OrientKey) => {
    if (busy) return;
    setErr(null);
    setBusy(orient);
    try {
      if (typeof VideoEncoder === "undefined") {
        throw new Error("This browser can't build video here — try Chrome or Edge.");
      }
      const { w, h } = ORIENTS[orient];
      const unit = Math.min(w, h);

      // Motion / pace derived from settings.
      const kb = motion === "cinematic" ? 1 : motion === "gentle" ? 0.45 : 0; // ken-burns strength
      const trans = motion === "static" ? 6 : 14; // crossfade frames
      const stagger = motion !== "static";
      const paceMul = length === "short" ? 0.7 : length === "long" ? 1.4 : 1;
      const fr = (n: number) => Math.max(8, Math.round(n * paceMul));

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      const off = document.createElement("canvas");
      off.width = w;
      off.height = h;
      const octx = off.getContext("2d")!;

      const hero = await loadImage(heroUrl);
      const photoPairs = await Promise.all(
        (photos ?? []).map(async (p) => ({ img: await loadImage(p.url), caption: p.caption })),
      );
      const loadedPhotos = photoPairs.filter((p) => p.img && p.img.width);

      // ---------- drawing helpers ----------
      const cover = (c: CanvasRenderingContext2D, img: HTMLImageElement | null, zoom = 1, panX = 0, panY = 0) => {
        if (!img || !img.width) {
          const g = c.createLinearGradient(0, 0, 0, h);
          g.addColorStop(0, "#111119");
          g.addColorStop(1, accent);
          c.fillStyle = g;
          c.fillRect(0, 0, w, h);
          return;
        }
        const base = Math.max(w / img.width, h / img.height) * zoom;
        const dw = img.width * base;
        const dh = img.height * base;
        c.drawImage(img, (w - dw) / 2 + panX, (h - dh) / 2 + panY, dw, dh);
      };
      const scrim = (c: CanvasRenderingContext2D, flat: number, botFrom: number, bot: number) => {
        c.fillStyle = `rgba(0,0,0,${flat})`;
        c.fillRect(0, 0, w, h);
        const g = c.createLinearGradient(0, h * botFrom, 0, h);
        g.addColorStop(0, "rgba(0,0,0,0)");
        g.addColorStop(1, `rgba(0,0,0,${bot})`);
        c.fillStyle = g;
        c.fillRect(0, 0, w, h);
      };
      const spaced = (c: CanvasRenderingContext2D, str: string, cx: number, y: number, ls: number) => {
        const total = [...str].reduce((a, ch) => a + c.measureText(ch).width + ls, -ls);
        let x = cx - total / 2;
        for (const ch of str) {
          const cw = c.measureText(ch).width;
          c.fillText(ch, x + cw / 2, y);
          x += cw + ls;
        }
      };
      const wrap = (c: CanvasRenderingContext2D, text: string, maxW: number) => {
        const words = text.split(/\s+/);
        const lines: string[] = [];
        let line = "";
        for (const word of words) {
          const t = line ? `${line} ${word}` : word;
          if (c.measureText(t).width > maxW && line) {
            lines.push(line);
            line = word;
          } else line = t;
        }
        if (line) lines.push(line);
        return lines;
      };
      const eyebrow = (c: CanvasRenderingContext2D, text: string, y: number) => {
        c.textAlign = "center";
        c.font = `${Math.round(unit * 0.026)}px Georgia, serif`;
        c.fillStyle = accent;
        spaced(c, text.toUpperCase(), w / 2, y, unit * 0.007);
      };

      // ---------- scenes ----------
      const titleScene = (c: CanvasRenderingContext2D, p: number) => {
        cover(c, hero, 1 + 0.06 * kb * easeOut(p));
        scrim(c, 0.3, 0.35, 0.75);
        let y = h * (w > h ? 0.5 : 0.52);
        if (tagline) {
          eyebrow(c, tagline, y);
          y += unit * 0.08;
        }
        const ts = Math.round(unit * (w > h ? 0.075 : 0.085));
        c.font = `${ts}px Georgia, serif`;
        c.fillStyle = "#fff";
        c.textAlign = "center";
        c.shadowColor = "rgba(0,0,0,0.5)";
        c.shadowBlur = unit * 0.02;
        for (const ln of wrap(c, title || names || "", w * 0.84)) {
          c.fillText(ln, w / 2, y);
          y += ts * 1.05;
        }
        c.shadowBlur = 0;
        if (dateLabel) {
          y += unit * 0.02;
          c.font = `${Math.round(unit * 0.034)}px Georgia, serif`;
          c.fillStyle = accent;
          c.fillText(dateLabel.toUpperCase(), w / 2, y);
          y += unit * 0.045;
        }
        if (place) {
          c.font = `${Math.round(unit * 0.026)}px Georgia, serif`;
          c.fillStyle = "rgba(255,255,255,0.85)";
          c.fillText(place, w / 2, y);
        }
      };

      const planScene = (c: CanvasRenderingContext2D, p: number) => {
        cover(c, hero, 1 + 0.03 * kb);
        scrim(c, 0.6, 0.0, 0.72);
        c.textAlign = "center";
        eyebrow(c, "The Plan", h * 0.15);
        c.font = `bold ${Math.round(unit * 0.058)}px Georgia, serif`;
        c.fillStyle = "#fff";
        c.fillText("The Celebrations", w / 2, h * 0.15 + unit * 0.08);
        const items = plan ?? [];
        const rowH = h * 0.12;
        const startY = h * 0.34;
        items.forEach((it, i) => {
          const appear = stagger ? easeOut((p - (0.08 + i * 0.13)) / 0.2) : 1;
          if (appear <= 0) return;
          const yy = startY + i * rowH - (1 - appear) * unit * 0.03;
          c.globalAlpha = appear;
          c.font = `${Math.round(unit * 0.04)}px Georgia, serif`;
          c.fillStyle = "#fff";
          c.fillText(`${it.icon ? it.icon + "  " : ""}${it.name}`, w / 2, yy);
          const sub = [it.when, it.where].filter(Boolean).join("   ·   ");
          if (sub) {
            c.font = `${Math.round(unit * 0.024)}px Georgia, serif`;
            c.fillStyle = accent;
            c.fillText(sub, w / 2, yy + unit * 0.038);
          }
          c.globalAlpha = 1;
        });
      };

      const venueScene = (c: CanvasRenderingContext2D, p: number) => {
        cover(c, loadedPhotos[0]?.img ?? hero, 1 + 0.05 * kb * easeOut(p));
        scrim(c, 0.5, 0.2, 0.8);
        c.textAlign = "center";
        eyebrow(c, "Where", h * 0.4);
        let y = h * 0.4 + unit * 0.09;
        c.font = `bold ${Math.round(unit * 0.058)}px Georgia, serif`;
        c.fillStyle = "#fff";
        for (const ln of wrap(c, venueName || "The Venue", w * 0.8)) {
          c.fillText(ln, w / 2, y);
          y += unit * 0.065;
        }
        if (venueAddress) {
          y += unit * 0.01;
          c.font = `${Math.round(unit * 0.028)}px Georgia, serif`;
          c.fillStyle = "rgba(255,255,255,0.85)";
          for (const ln of wrap(c, venueAddress, w * 0.72)) {
            c.fillText(ln, w / 2, y);
            y += unit * 0.04;
          }
        }
      };

      const photoScene = (img: HTMLImageElement | null, caption?: string) => (c: CanvasRenderingContext2D, p: number) => {
        const z = 1 + (0.05 + 0.12 * easeInOut(p)) * kb;
        const panX = (easeInOut(p) - 0.5) * unit * 0.05 * kb;
        cover(c, img, z, panX, 0);
        scrim(c, 0.12, 0.55, 0.72);
        if (caption) {
          c.textAlign = "center";
          c.font = `${Math.round(unit * 0.036)}px Georgia, serif`;
          c.fillStyle = "#fff";
          c.shadowColor = "rgba(0,0,0,0.6)";
          c.shadowBlur = unit * 0.02;
          c.fillText(caption, w / 2, h * 0.9);
          c.shadowBlur = 0;
        }
      };

      const closingScene = (c: CanvasRenderingContext2D, p: number) => {
        cover(c, hero, 1 + 0.05 * kb * easeOut(p));
        scrim(c, 0.42, 0.3, 0.78);
        c.textAlign = "center";
        let y = h * 0.44;
        eyebrow(c, "Save the date", y);
        y += unit * 0.09;
        c.font = `${Math.round(unit * 0.07)}px Georgia, serif`;
        c.fillStyle = "#fff";
        c.shadowColor = "rgba(0,0,0,0.5)";
        c.shadowBlur = unit * 0.02;
        for (const ln of wrap(c, names || title, w * 0.84)) {
          c.fillText(ln, w / 2, y);
          y += unit * 0.075;
        }
        c.shadowBlur = 0;
        if (dateLabel) {
          y += unit * 0.015;
          c.font = `${Math.round(unit * 0.032)}px Georgia, serif`;
          c.fillStyle = accent;
          c.fillText(dateLabel.toUpperCase(), w / 2, y);
        }
      };

      // ---------- timeline (respects the settings) ----------
      type Scene = { frames: number; render: (c: CanvasRenderingContext2D, p: number) => void };
      const scenes: Scene[] = [];
      scenes.push({ frames: fr(78), render: titleScene });
      if (hasPlan && includePlan) scenes.push({ frames: fr(120), render: planScene });
      if (hasVenue && includeVenue) scenes.push({ frames: fr(78), render: venueScene });
      if (includePhotos) for (const ph of loadedPhotos) scenes.push({ frames: fr(50), render: photoScene(ph.img, ph.caption) });
      scenes.push({ frames: fr(72), render: closingScene });

      const offsets: number[] = [];
      let acc = 0;
      for (const s of scenes) {
        offsets.push(acc);
        acc += s.frames;
      }
      const totalFrames = acc;

      // ---------- encoder ----------
      const cands: { codec: string; mux: "avc" | "vp9" }[] = [
        { codec: "avc1.42001f", mux: "avc" },
        { codec: "vp09.00.10.08", mux: "vp9" },
      ];
      let chosen: { codec: string; mux: "avc" | "vp9" } | null = null;
      for (const cand of cands) {
        const ok = await VideoEncoder.isConfigSupported({ codec: cand.codec, width: w, height: h, bitrate: 5_000_000, framerate: FPS })
          .then((r) => !!r.supported)
          .catch(() => false);
        if (ok) {
          chosen = cand;
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
        output: (chunk, m) => muxer.addVideoChunk(chunk, m),
        error: (e) => {
          encodeError = e;
        },
      });
      encoder.configure({ codec: chosen.codec, width: w, height: h, bitrate: 5_000_000, framerate: FPS });

      // ---------- render + encode ----------
      for (let gi = 0; gi < totalFrames; gi++) {
        if (encodeError) throw encodeError;
        let si = 0;
        while (si < scenes.length - 1 && gi >= offsets[si] + scenes[si].frames) si++;
        const local = gi - offsets[si];
        const sf = scenes[si].frames;
        const p = sf > 1 ? local / (sf - 1) : 1;

        scenes[si].render(ctx, clamp(p));

        const remain = sf - local;
        if (si < scenes.length - 1 && remain <= trans) {
          const a = clamp((trans - remain + 1) / trans);
          scenes[si + 1].render(octx, 0);
          ctx.save();
          ctx.globalAlpha = a;
          ctx.drawImage(off, 0, 0);
          ctx.restore();
        }

        if (gi < trans) {
          ctx.fillStyle = `rgba(0,0,0,${1 - gi / trans})`;
          ctx.fillRect(0, 0, w, h);
        } else if (gi >= totalFrames - trans) {
          ctx.fillStyle = `rgba(0,0,0,${(gi - (totalFrames - trans)) / trans})`;
          ctx.fillRect(0, 0, w, h);
        }

        const frame = new VideoFrame(canvas, {
          timestamp: Math.round((gi * 1_000_000) / FPS),
          duration: Math.round(1_000_000 / FPS),
        });
        encoder.encode(frame, { keyFrame: gi % FPS === 0 });
        frame.close();
        if (gi % 30 === 29) await new Promise((r) => setTimeout(r, 0));
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

  const chip = (active: boolean) =>
    `rounded-full border px-3 py-1.5 text-xs transition ${
      active ? "border-white bg-white text-neutral-900" : "border-white/25 bg-white/5 text-white/70 hover:border-white/50"
    }`;
  const selectCls =
    "rounded-full border border-white/25 bg-white/5 px-3 py-1.5 text-xs text-white outline-none focus:border-white/60 [&>option]:text-black";

  return (
    <section className="border-t border-white/10 bg-neutral-950 px-6 py-16 text-center text-white">
      <p className="text-[11px] uppercase tracking-[0.35em] text-white/45">Preview</p>
      <h2 className="mt-3 font-display text-2xl sm:text-3xl">
        Download this template&apos;s animation
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/60">
        A short animated film — your couple, date, plan, venue and photos — built
        live in your browser from this page. Set it up, then pick a shape.
      </p>

      {/* ---- configurable settings ---- */}
      <div className="mx-auto mt-8 flex max-w-2xl flex-col items-center gap-4">
        {(hasPlan || hasVenue || hasPhotos) && (
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="mr-1 text-[11px] uppercase tracking-widest text-white/40">Include</span>
            {hasPlan && (
              <button type="button" onClick={() => setIncludePlan((v) => !v)} className={chip(includePlan)} aria-pressed={includePlan}>
                Schedule
              </button>
            )}
            {hasVenue && (
              <button type="button" onClick={() => setIncludeVenue((v) => !v)} className={chip(includeVenue)} aria-pressed={includeVenue}>
                Venue
              </button>
            )}
            {hasPhotos && (
              <button type="button" onClick={() => setIncludePhotos((v) => !v)} className={chip(includePhotos)} aria-pressed={includePhotos}>
                Photos
              </button>
            )}
          </div>
        )}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <label className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-white/40">
            Motion
            <select value={motion} onChange={(e) => setMotion(e.target.value as Motion)} className={selectCls}>
              <option value="cinematic">Cinematic</option>
              <option value="gentle">Gentle</option>
              <option value="static">Static</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-white/40">
            Length
            <select value={length} onChange={(e) => setLength(e.target.value as Length)} className={selectCls}>
              <option value="short">Short</option>
              <option value="standard">Standard</option>
              <option value="long">Long</option>
            </select>
          </label>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
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
