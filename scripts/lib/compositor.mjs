/**
 * Video compositing via ffmpeg.
 *
 * Assembles generated scene clips + audio track + burned-in captions
 * into the final 9:16 vertical video.
 *
 * Pipeline:
 *   1. Concatenate scene clips (with crossfade transitions)
 *   2. Overlay mixed audio track
 *   3. Burn in captions from the captions array
 *   4. Apply final encode (H.264, AAC)
 *
 * Requires: ffmpeg on PATH (or FFMPEG_PATH env var).
 */

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { createRequire } from "node:module";

const exec = promisify(execFile);
const require = createRequire(import.meta.url);

function ffmpegPath() {
  if (process.env.FFMPEG_PATH) return process.env.FFMPEG_PATH;
  // ffmpeg-static's default export is the exe path; require.resolve returns index.js.
  try {
    const staticPath = require("ffmpeg-static");
    if (staticPath && existsSync(staticPath)) return staticPath;
  } catch {}
  return "ffmpeg";
}

/**
 * Write a captions .srt file from the captions array.
 */
function writeSrt(captions, outPath) {
  const lines = [];
  for (let i = 0; i < captions.length; i++) {
    const c = captions[i];
    const start = formatSrtTime(c.in_s);
    const end = formatSrtTime(c.out_s);
    lines.push(`${i + 1}`);
    lines.push(`${start} --> ${end}`);
    lines.push(c.text);
    lines.push("");
  }
  writeFileSync(outPath, lines.join("\n"), "utf8");
  return outPath;
}

function formatSrtTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.round((seconds % 1) * 1000);
  return (
    String(h).padStart(2, "0") + ":" +
    String(m).padStart(2, "0") + ":" +
    String(s).padStart(2, "0") + "," +
    String(ms).padStart(3, "0")
  );
}

/**
 * Concatenate scene video clips into a single video.
 *
 * @param {string[]} scenePaths - Ordered paths to scene .mp4 files
 * @param {number} crossfadeS   - Crossfade duration between scenes
 * @param {string} outPath      - Output path
 */
export async function concatenateScenes(scenePaths, crossfadeS, outPath, sceneDurations) {
  mkdirSync(dirname(outPath), { recursive: true });
  const ff = ffmpegPath();

  if (scenePaths.length === 1) {
    // Just copy the single file
    await exec(ff, ["-y", "-i", scenePaths[0], "-c", "copy", outPath], { timeout: 60_000 });
    return outPath;
  }

  // Probe durations if the caller didn't pass them.
  const durations = sceneDurations && sceneDurations.length === scenePaths.length
    ? sceneDurations
    : await Promise.all(scenePaths.map(getVideoDuration));

  // Build concat filter with crossfade
  // For N scenes: [0:v][1:v]xfade=transition=fade:duration=D:offset=O[v01];
  //               [v01][2:v]xfade=...
  const inputs = [];
  for (const p of scenePaths) {
    inputs.push("-i", p);
  }

  const filters = [];
  let prevLabel = "[0:v]";
  // xfade offset = point (in the running composite) where the fade STARTS —
  // must land inside the previous stream (offset < prev length) so the two
  // clips actually overlap. After each fade the composite length grows by
  // (nextDuration - crossfade).
  let runningLen = durations[0];

  for (let i = 1; i < scenePaths.length; i++) {
    const outLabel = i === scenePaths.length - 1 ? "[vout]" : `[v${i}]`;
    const offset = Math.max(0, runningLen - crossfadeS);
    filters.push(
      `${prevLabel}[${i}:v]xfade=transition=fade:duration=${crossfadeS}:offset=${offset}${outLabel}`
    );
    runningLen = runningLen + durations[i] - crossfadeS;
    prevLabel = outLabel;
  }

  const args = [
    "-y",
    ...inputs,
    "-filter_complex", filters.join(";"),
    "-map", "[vout]",
    "-c:v", "libx264",
    "-preset", "medium",
    "-crf", "18",
    "-pix_fmt", "yuv420p",
    outPath,
  ];

  console.log(`  [compose] Concatenating ${scenePaths.length} scenes with ${crossfadeS}s crossfade`);
  try {
    await exec(ff, args, { timeout: 300_000 });
  } catch (err) {
    console.error(`  [compose] ffmpeg stderr:\n${err.stderr?.slice(-1000)}`);
    // Fallback: simple concat without crossfade
    console.log(`  [compose] Falling back to simple concat...`);
    await simpleConcat(scenePaths, outPath);
  }

  return outPath;
}

/**
 * Simple concat (no crossfade) — fallback.
 */
async function simpleConcat(scenePaths, outPath) {
  const ff = ffmpegPath();
  const concatFile = resolve(dirname(outPath), "_concat.txt");
  const content = scenePaths.map((p) => `file '${p.replace(/'/g, "'\\''")}'`).join("\n");
  writeFileSync(concatFile, content, "utf8");

  await exec(ff, [
    "-y", "-f", "concat", "-safe", "0", "-i", concatFile,
    "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
    outPath,
  ], { timeout: 300_000 });
}

/**
 * Overlay audio track onto video.
 *
 * @param {string} videoPath - Input video (no audio or has silent audio)
 * @param {string} audioPath - Mixed audio track
 * @param {string} outPath   - Final output with audio
 */
export async function overlayAudio(videoPath, audioPath, outPath) {
  const ff = ffmpegPath();
  mkdirSync(dirname(outPath), { recursive: true });

  const args = [
    "-y",
    "-i", videoPath,
    "-i", audioPath,
    "-c:v", "copy",
    "-c:a", "aac",
    "-b:a", "192k",
    "-map", "0:v:0",
    "-map", "1:a:0",
    "-shortest",
    outPath,
  ];

  console.log(`  [compose] Overlaying audio → ${outPath}`);
  await exec(ff, args, { timeout: 120_000 });
  return outPath;
}

/**
 * Burn in SRT captions using ffmpeg subtitles filter.
 *
 * @param {string} videoPath - Input video
 * @param {string} srtPath   - SRT subtitle file
 * @param {object} style     - Caption styling
 * @param {string} outPath   - Output with burned captions
 */
export async function burnCaptions(videoPath, srtPath, style, outPath) {
  const ff = ffmpegPath();
  mkdirSync(dirname(outPath), { recursive: true });

  // Escape path for ffmpeg subtitles filter (forward slashes, colons)
  const escapedPath = srtPath.replace(/\\/g, "/").replace(/:/g, "\\:");

  // Default style: white text, semi-transparent background, centered bottom
  const defaultStyle = "FontName=Arial,FontSize=18,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,BackColour=&H80000000,BorderStyle=4,Outline=1,Shadow=0,Alignment=2,MarginV=60";
  const styleStr = style || defaultStyle;

  const args = [
    "-y",
    "-i", videoPath,
    "-vf", `subtitles='${escapedPath}':force_style='${styleStr}'`,
    "-c:v", "libx264",
    "-preset", "medium",
    "-crf", "18",
    "-pix_fmt", "yuv420p",
    "-c:a", "copy",
    outPath,
  ];

  console.log(`  [compose] Burning captions → ${outPath}`);
  try {
    await exec(ff, args, { timeout: 300_000 });
  } catch (err) {
    console.error(`  [compose] Caption burn failed, skipping captions: ${err.message}`);
    // Copy without captions as fallback
    await exec(ff, ["-y", "-i", videoPath, "-c", "copy", outPath], { timeout: 60_000 });
  }
  return outPath;
}

/**
 * Full composite pipeline: concat scenes → overlay audio → burn captions.
 *
 * @param {object} opts
 * @param {string[]} opts.scenePaths   - Ordered scene video paths
 * @param {string}   opts.audioPath    - Mixed audio track path
 * @param {Array}    opts.captions     - Captions from RENDER_PACKAGE
 * @param {number}   opts.duration     - Total duration in seconds
 * @param {string}   opts.accent       - Accent hex color (for caption styling)
 * @param {string}   opts.outDir       - Output directory
 * @param {string}   opts.templateId   - Template ID (for filename)
 * @param {number[]} [opts.sceneDurations] - Per-scene durations in seconds
 * @returns {Promise<string>}          - Path to final video
 */
export async function composite({ scenePaths, audioPath, captions, duration, accent, outDir, templateId, sceneDurations }) {
  mkdirSync(outDir, { recursive: true });

  const step1 = join(outDir, `${templateId}_scenes.mp4`);
  const step2 = join(outDir, `${templateId}_audio.mp4`);
  const srtPath = join(outDir, `${templateId}_captions.srt`);
  const finalOut = join(outDir, `${templateId}_final.mp4`);

  // Step 1: Concatenate scenes with crossfade
  const crossfadeS = 0.5;
  await concatenateScenes(scenePaths, crossfadeS, step1, sceneDurations);

  // Step 2: Write SRT and overlay audio
  if (captions?.length) {
    writeSrt(captions, srtPath);
    console.log(`  [compose] Captions written → ${srtPath}`);
  }

  if (audioPath && existsSync(audioPath)) {
    await overlayAudio(step1, audioPath, step2);
  } else {
    // No audio, just use the video
    await exec(ffmpegPath(), ["-y", "-i", step1, "-c", "copy", step2], { timeout: 60_000 });
  }

  // Step 3: Burn captions (if SRT exists)
  if (captions?.length && existsSync(srtPath)) {
    await burnCaptions(step2, srtPath, null, finalOut);
  } else {
    await exec(ffmpegPath(), ["-y", "-i", step2, "-c", "copy", finalOut], { timeout: 60_000 });
  }

  console.log(`  [compose] Final video → ${finalOut}`);
  return finalOut;
}

/**
 * Get video duration in seconds.
 */
export async function getVideoDuration(videoPath) {
  const ff = ffmpegPath();
  try {
    const { stderr } = await exec(ff, ["-i", videoPath], { timeout: 10_000 });
    const match = stderr.match(/Duration:\s*(\d{2}):(\d{2}):(\d{2})\.(\d{2})/);
    if (!match) return 0;
    return parseInt(match[1]) * 3600 + parseInt(match[2]) * 60 + parseInt(match[3]) + parseInt(match[4]) / 100;
  } catch {
    return 0;
  }
}
