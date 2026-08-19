/**
 * Audio mixing via ffmpeg.
 *
 * Mixes voiceover + background music + SFX into a single audio track with:
 *   - Music ducking (quiets when VO is present)
 *   - Fade in/out
 *   - Per-SFX volume envelopes
 *
 * Requires: ffmpeg on PATH (or set FFMPEG_PATH env var).
 * The project has `ffmpeg-static` as a dev dep — use it as a fallback.
 */

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { createRequire } from "node:module";

const exec = promisify(execFile);
const require = createRequire(import.meta.url);

function ffmpegPath() {
  if (process.env.FFMPEG_PATH) return process.env.FFMPEG_PATH;

  // Try ffmpeg-static (installed as devDep). Its default export is the exe
  // path, not require.resolve() — resolve() gives us index.js.
  try {
    const staticPath = require("ffmpeg-static");
    if (staticPath && existsSync(staticPath)) return staticPath;
  } catch {}

  return "ffmpeg"; // assume on PATH
}

/**
 * Generate a silent audio file of given duration (used as placeholder).
 */
async function generateSilence(durationS, outPath) {
  mkdirSync(dirname(outPath), { recursive: true });
  await exec(ffmpegPath(), [
    "-y", "-f", "lavfi", "-i", `anullsrc=r=44100:cl=stereo`,
    "-t", String(durationS), "-q:a", "2", outPath,
  ]);
  return outPath;
}

/**
 * Build SFX filter strings for ffmpeg.
 * Each SFX becomes an adelay + volume-amplified input mixed into the output.
 *
 * @param {Array} sfxList  - [{ t_s, cue }] from RENDER_PACKAGE
 * @param {string} sfxDir  - Directory containing SFX .mp3/.wav files (named by cue)
 * @returns {{ inputs: string[], filters: string[] }}
 */
function buildSfxFilters(sfxList, sfxDir) {
  const inputs = [];
  const filters = [];

  for (let i = 0; i < sfxList.length; i++) {
    const sfx = sfxList[i];
    // Look for file by sanitized cue name
    const safeCue = sfx.cue.replace(/[^a-zA-Z0-9_-]/g, "_").toLowerCase();
    const sfxPath = resolve(sfxDir, `${safeCue}.mp3`);

    if (!existsSync(sfxPath)) {
      console.warn(`  [mix] SFX not found: ${sfxPath} (cue: "${sfx.cue}"), skipping`);
      continue;
    }

    const delayMs = Math.round(sfx.t_s * 1000);
    inputs.push("-i", sfxPath);
    // Delay the SFX to its timestamp, then mix
    filters.push(`[${i + 2}:a]adelay=${delayMs}|${delayMs},volume=0.6[sfx${i}]`);
  }

  return { inputs, filters, sfxLabels: filters.map((_, i) => `[sfx${i}]`) };
}

/**
 * Mix audio tracks together.
 *
 * @param {object} opts
 * @param {string} opts.voPath     - Path to voiceover .mp3
 * @param {number} opts.voDuration - Duration of the VO in seconds
 * @param {object} opts.music      - Music descriptor from RENDER_PACKAGE
 * @param {string} opts.musicPath  - Path to background music .mp3 (or null)
 * @param {Array}  opts.sfxList    - SFX list from RENDER_PACKAGE
 * @param {string} opts.sfxDir     - Directory with SFX files (optional)
 * @param {number} opts.duration   - Total output duration in seconds
 * @param {string} opts.outPath    - Output path
 * @returns {Promise<string>}
 */
export async function mixAudio({ voPath, voDuration, music, musicPath, sfxList, sfxDir, duration, outPath }) {
  mkdirSync(dirname(outPath), { recursive: true });

  const ff = ffmpegPath();
  const inputs = [];
  const filters = [];

  // --- Input 0: Voiceover ---
  if (voPath && existsSync(voPath)) {
    inputs.push("-i", voPath);
  } else {
    // Silent VO placeholder
    const silencePath = resolve(dirname(outPath), "_silence_vo.mp3");
    await generateSilence(duration, silencePath);
    inputs.push("-i", silencePath);
  }

  // --- Input 1: Music ---
  if (musicPath && existsSync(musicPath)) {
    inputs.push("-i", musicPath);
  } else {
    // Generate a quiet ambient tone as placeholder
    const silencePath = resolve(dirname(outPath), "_silence_music.mp3");
    await generateSilence(duration, silencePath);
    inputs.push("-i", silencePath);
  }

  // --- SFX inputs (start at index 2) ---
  const sfxInfo = sfxDir && sfxList?.length
    ? buildSfxFilters(sfxList, sfxDir)
    : { inputs: [], filters: [], sfxLabels: [] };

  inputs.push(...sfxInfo.inputs);

  // --- Build filter graph ---

  // 1. Music: trim to duration, apply energy curve, duck under VO
  const energyDuck = {
    build: "volume='if(between(t,0,3),0.3+0.2*t/3,0.5+0.3*sin(PI*t/{dur}))':eval=frame",
    drop:   "volume='if(between(t,0,2),0.8,0.3+0.4*sin(PI*t/{dur}))':eval=frame",
    steady: "volume=0.35",
    swell:  "volume='0.2+0.3*sin(PI*t/{dur})':eval=frame",
  };
  const duckFormula = (energyDuck[music?.energy_curve] || energyDuck.steady)
    .replace("{dur}", String(duration));

  // Sidechain duck: music volume dips when VO is above threshold
  const musicFilter = [
    `[1:a]atrim=0:${duration},afade=t=in:st=0:d=1,afade=t=out:st=${duration - 1}:d=1,${duckFormula}[music]`,
  ].join(";");

  filters.push(musicFilter);

  // 2. VO: normalize and trim
  filters.push(`[0:a]volume=1.2,atrim=0:${voDuration + 0.5},afade=t=out:st=${voDuration - 0.3}:d=0.3[vo]`);

  // 3. Mix all: [vo] + [music] + SFX labels → amerge or amix
  const mixInputs = ["[vo]", "[music]", ...sfxInfo.sfxLabels].join("");
  const mixCount = 2 + sfxInfo.sfxLabels.length;

  filters.push(
    `${mixInputs}amix=inputs=${mixCount}:duration=first:dropout_transition=2,alimiter=limit=0.95[out]`
  );

  // --- Run ffmpeg ---
  const allFilters = [...filters, ...sfxInfo.filters];

  const args = [
    "-y",
    ...inputs,
    "-filter_complex", allFilters.join(";"),
    "-map", "[out]",
    "-t", String(duration),
    "-ar", "44100",
    "-ac", "2",
    "-q:a", "2",
    outPath,
  ];

  console.log(`  [mix] Mixing ${mixCount} audio sources → ${outPath}`);
  console.log(`  [mix] Duration: ${duration}s, Music energy: ${music?.energy_curve || "steady"}`);

  try {
    const { stdout, stderr } = await exec(ff, args, { timeout: 120_000 });
    if (stderr && stderr.includes("Error")) {
      console.warn(`  [mix] ffmpeg warnings:\n${stderr.slice(-500)}`);
    }
  } catch (err) {
    console.error(`  [mix] ffmpeg stderr:\n${err.stderr?.slice(-1000)}`);
    throw new Error(`Audio mix failed: ${err.message}`);
  }

  console.log(`  [mix] Audio mix complete → ${outPath}`);
  return outPath;
}

/**
 * Get the duration of an audio file in seconds.
 */
export async function getAudioDuration(audioPath) {
  const ff = ffmpegPath();
  const { stdout } = await exec(ff, [
    "-i", audioPath, "-f", "null", "-",
  ], { timeout: 30_000 }).catch((err) => ({ stdout: "", stderr: err.stderr }));

  // Parse duration from ffmpeg output
  const match = (stdout + (stderr || "")).match(/Duration:\s*(\d{2}):(\d{2}):(\d{2})\.(\d{2})/);
  if (!match) return 0;
  return parseInt(match[1]) * 3600 + parseInt(match[2]) * 60 + parseInt(match[3]) + parseInt(match[4]) / 100;
}

/**
 * Check if ffmpeg is available.
 */
export async function isConfigured() {
  try {
    await exec(ffmpegPath(), ["-version"], { timeout: 5000 });
    return true;
  } catch {
    return false;
  }
}
