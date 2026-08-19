#!/usr/bin/env node
/**
 * render-pipeline.mjs — Main orchestrator for the video render pipeline.
 *
 * Consumes RENDER_PACKAGE JSON files (output from the AI batch prompt)
 * and produces a final rendered video with voiceover, music, and captions.
 *
 * Usage:
 *   node scripts/render-pipeline.mjs <render-package.json> [options]
 *
 * Options:
 *   --output-dir <dir>    Output directory (default: recordings/rendered/<id>)
 *   --backend <name>      Video backend: runway | pika | playwright (default: runway)
 *   --voice <name>        Voice backend: elevenlabs | edge-tts | none (default: elevenlabs)
 *   --concurrency <n>     Parallel scene renders (default: 2)
 *   --dry-run             Print render plan without executing
 *   --skip-scenes         Skip video generation (use existing clips)
 *   --skip-audio          Skip TTS/music generation
 *   --list-voices         List available ElevenLabs voices
 *   --batch <dir>         Process all .json files in a directory
 *
 * Environment:
 *   RUNWAY_API_KEY        Runway ML API key (for --backend=runway)
 *   ELEVENLABS_API_KEY    ElevenLabs API key (for --voice=elevenlabs)
 *   FFMPEG_PATH           Path to ffmpeg binary (default: auto-detect)
 *   MUSIC_DIR             Directory containing music .mp3 files
 *   SFX_DIR               Directory containing SFX .mp3 files
 *
 * Pipeline stages:
 *   1. Parse + validate RENDER_PACKAGE
 *   2. Generate scene videos (Runway/Pika/Playwright)
 *   3. Generate voiceover (ElevenLabs/edge-tts)
 *   4. Source background music
 *   5. Mix audio (VO + music + SFX via ffmpeg)
 *   6. Composite final video (scenes + audio + captions via ffmpeg)
 */

import { readFileSync, readdirSync, existsSync, mkdirSync } from "node:fs";
import { resolve, join, basename, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// ─── Lazy imports (loaded after arg parsing) ───────────────────────────────────

let adapters = null;

// ─── JSON reader that survives PowerShell ──────────────────────────────────────
//
// `node scripts/video-roster.mjs > file.json` on Windows writes UTF-16 LE with
// BOM by default (PS 5.1) — Node's readFileSync(_, "utf8") then hands us
// `��{…` and JSON.parse dies with "Unexpected token '�'". This helper detects
// the BOM/encoding, decodes correctly, and also gives a friendlier error when
// someone feeds a *roster* to the pipeline instead of a RENDER_PACKAGE.

function readJson(filePath) {
  const buf = readFileSync(filePath);
  let text;
  if (buf[0] === 0xff && buf[1] === 0xfe) {
    // UTF-16 LE with BOM
    text = buf.subarray(2).toString("utf16le");
  } else if (buf[0] === 0xfe && buf[1] === 0xff) {
    // UTF-16 BE with BOM — swap bytes then decode as LE
    const swapped = Buffer.alloc(buf.length - 2);
    for (let i = 2; i < buf.length; i += 2) {
      swapped[i - 2] = buf[i + 1];
      swapped[i - 1] = buf[i];
    }
    text = swapped.toString("utf16le");
  } else if (buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) {
    // UTF-8 with BOM
    text = buf.subarray(3).toString("utf8");
  } else {
    text = buf.toString("utf8");
  }
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (err) {
    throw new Error(
      `Failed to parse JSON at ${filePath}: ${err.message}\n` +
      `  Tip: if you generated this on Windows with 'node script.mjs > file.json',\n` +
      `       PowerShell saved it as UTF-16 LE with BOM. Regenerate with:\n` +
      `         node script.mjs | Out-File -Encoding utf8NoBOM file.json\n` +
      `       or on Node ≥ 18: node script.mjs > file.json  (from cmd.exe, not PS)`,
    );
  }
  // Reject rosters fed as render packages. The roster looks like
  // { eventType, count, templates: [...] } — no scenes/vo/id.
  const looksLikeRoster =
    parsed && typeof parsed === "object" &&
    Array.isArray(parsed.templates) &&
    !parsed.scenes && !parsed.voiceover && !parsed.id;
  if (looksLikeRoster) {
    throw new Error(
      `${filePath} looks like a TEMPLATE_ROSTER (${parsed.templates.length} templates), not a RENDER_PACKAGE.\n` +
      `  The roster is the *input* to prompts/video-batch-prompt.md — feed it to your LLM,\n` +
      `  save the RENDER_PACKAGE JSON that comes back for each template, then run the pipeline on those.`,
    );
  }
  return parsed;
}

// ─── Argument parsing ──────────────────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {
    input: null,
    outputDir: null,
    backend: process.env.VIDEO_BACKEND || "runway",
    voice: process.env.VOICE_BACKEND || "elevenlabs",
    concurrency: 2,
    dryRun: false,
    skipScenes: false,
    skipAudio: false,
    listVoices: false,
    batch: null,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case "--output-dir": case "-o":
        opts.outputDir = args[++i];
        break;
      case "--backend": case "-b":
        opts.backend = args[++i];
        break;
      case "--voice": case "-v":
        opts.voice = args[++i];
        break;
      case "--concurrency": case "-c":
        opts.concurrency = parseInt(args[++i]) || 2;
        break;
      case "--dry-run":
        opts.dryRun = true;
        break;
      case "--skip-scenes":
        opts.skipScenes = true;
        break;
      case "--skip-audio":
        opts.skipAudio = true;
        break;
      case "--list-voices":
        opts.listVoices = true;
        break;
      case "--batch":
        opts.batch = args[++i];
        break;
      case "--help": case "-h":
        printUsage();
        process.exit(0);
      default:
        if (!arg.startsWith("-")) {
          opts.input = arg;
        } else {
          console.error(`Unknown option: ${arg}`);
          process.exit(1);
        }
    }
  }

  return opts;
}

function printUsage() {
  console.log(`
render-pipeline.mjs — Video render pipeline

Usage:
  node scripts/render-pipeline.mjs <render-package.json> [options]
  node scripts/render-pipeline.mjs --batch <directory/> [options]

Options:
  --output-dir, -o <dir>   Output directory (default: recordings/rendered/<id>)
  --backend, -b <name>     Video backend: runway | pika | playwright (default: runway)
  --voice, -v <name>       Voice backend: elevenlabs | edge-tts | none (default: elevenlabs)
  --concurrency, -c <n>    Parallel scene renders (default: 2)
  --dry-run                Print render plan without executing
  --skip-scenes            Skip video generation (use existing scene clips)
  --skip-audio             Skip TTS/music generation
  --list-voices            List available ElevenLabs voices
  --batch <dir>            Process all .json files in a directory

Environment variables:
  RUNWAY_API_KEY           Runway ML API key
  ELEVENLABS_API_KEY       ElevenLabs API key
  FFMPEG_PATH              Path to ffmpeg binary
  MUSIC_DIR                Directory with background music .mp3 files
  SFX_DIR                  Directory with SFX .mp3 files

Examples:
  # Render a single template
  node scripts/render-pipeline.mjs blueprints/royal.json

  # Render with Playwright fallback (no API keys needed)
  node scripts/render-pipeline.mjs blueprints/royal.json --backend playwright --voice none

  # Dry run — just print the plan
  node scripts/render-pipeline.mjs blueprints/royal.json --dry-run

  # Batch render all templates
  node scripts/render-pipeline.mjs --batch blueprints/

  # List available TTS voices
  node scripts/render-pipeline.mjs --list-voices
`);
}

// ─── Load adapters ─────────────────────────────────────────────────────────────

async function loadAdapters() {
  if (adapters) return adapters;
  const runway = await import("./lib/runway.mjs");
  const elevenlabs = await import("./lib/elevenlabs.mjs");
  const mixer = await import("./lib/audio-mixer.mjs");
  const comp = await import("./lib/compositor.mjs");

  adapters = { runway, elevenlabs, mixer, comp };
  return adapters;
}

// ─── Validation ────────────────────────────────────────────────────────────────

function validatePackage(pkg) {
  const errors = [];
  if (!pkg.id) errors.push("Missing 'id'");
  if (!pkg.scenes?.length) errors.push("Missing 'scenes' array");
  if (!pkg.voiceover?.script) errors.push("Missing 'voiceover.script'");
  if (!pkg.duration_s) errors.push("Missing 'duration_s'");
  if (pkg.duration_s < 5 || pkg.duration_s > 30) {
    errors.push(`duration_s must be 5–30, got ${pkg.duration_s}`);
  }
  if (pkg.scenes) {
    for (const s of pkg.scenes) {
      if (s.start_s == null || s.end_s == null) errors.push(`Scene missing start_s/end_s`);
      if (!s.visual_prompt) errors.push(`Scene at ${s.start_s}s missing visual_prompt`);
    }
  }
  return errors;
}

// ─── Stage 1: Generate scene videos ───────────────────────────────────────────

async function generateSceneVideos(pkg, outDir, adapters, opts) {
  const sceneDir = join(outDir, "scenes");
  mkdirSync(sceneDir, { recursive: true });

  const scenePaths = [];

  for (let i = 0; i < pkg.scenes.length; i++) {
    const scene = pkg.scenes[i];
    const outPath = join(sceneDir, `scene_${String(i).padStart(2, "0")}.mp4`);
    const duration = scene.end_s - scene.start_s;

    scenePaths.push(outPath);

    if (opts.skipScenes && existsSync(outPath)) {
      console.log(`  [pipeline] Scene ${i} exists, skipping`);
      continue;
    }

    if (opts.dryRun) {
      console.log(`  [dry-run] Scene ${i}: ${duration}s — "${scene.visual_prompt.slice(0, 80)}..."`);
      continue;
    }

    console.log(`\n  ═══ Scene ${i + 1}/${pkg.scenes.length} (${duration}s) ═══`);
    console.log(`  Visual: ${scene.visual_prompt.slice(0, 100)}...`);
    console.log(`  Motion: ${scene.motion}`);
    console.log(`  Caption: "${scene.caption}"`);

    switch (opts.backend) {
      case "runway":
        await adapters.runway.generateScene({
          prompt: scene.visual_prompt,
          duration,
          aspect: pkg.aspect,
          movement: scene.motion,
          outPath,
        });
        break;

      case "pika":
        // Pika adapter (similar API shape, placeholder)
        console.warn("  [pipeline] Pika backend not yet implemented, falling back to Playwright");
        await renderWithPlaywright(scene, pkg.accent, duration, outPath);
        break;

      case "playwright":
        await renderWithPlaywright(scene, pkg.accent, duration, outPath);
        break;

      default:
        throw new Error(`Unknown video backend: ${opts.backend}`);
    }
  }

  return scenePaths;
}

/**
 * Playwright fallback — renders the scene prompt as a styled text card to video.
 * No text-to-video API needed; produces a minimal but valid .mp4.
 */
async function renderWithPlaywright(scene, accent, durationS, outPath) {
  const { chromium } = await import("playwright");
  const { writeFileSync } = await import("node:fs");

  console.log(`  [playwright] Rendering scene card...`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 540, height: 960 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  // Build a styled HTML page for this scene
  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 540px; height: 960px;
    background: #0a0a0f;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    font-family: Georgia, 'Times New Roman', serif;
    color: white; overflow: hidden; position: relative;
  }
  .accent-bar {
    position: absolute; top: 0; left: 0; right: 0;
    height: 4px; background: ${accent};
  }
  .caption {
    font-size: 32px; font-weight: bold;
    text-align: center; padding: 0 40px;
    line-height: 1.4;
    opacity: 0; animation: fadeIn 1s ease 0.3s forwards;
  }
  .motion {
    font-size: 14px; letter-spacing: 0.3em;
    text-transform: uppercase; color: ${accent};
    margin-top: 24px;
    opacity: 0; animation: fadeIn 0.8s ease 0.6s forwards;
  }
  .prompt {
    font-size: 11px; color: rgba(255,255,255,0.3);
    position: absolute; bottom: 40px;
    padding: 0 40px; text-align: center;
    font-family: monospace;
    opacity: 0; animation: fadeIn 0.5s ease 1s forwards;
  }
  @keyframes fadeIn { to { opacity: 1; } }
</style>
</head>
<body>
  <div class="accent-bar"></div>
  <div class="caption">${escapeHtml(scene.caption)}</div>
  <div class="motion">${escapeHtml(scene.motion)}</div>
  <div class="prompt">${escapeHtml(scene.visual_prompt.slice(0, 200))}</div>
</body>
</html>`;

  await page.setContent(html, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500); // Let animations play

  // Screenshot as PNG, then convert to video with ffmpeg
  const screenshotPath = outPath.replace(".mp4", ".png");
  await page.screenshot({ path: screenshotPath, type: "png" });
  await browser.close();

  // Convert static image to video with ffmpeg
  const { execFile: execCb } = await import("node:child_process");
  const { promisify } = await import("node:util");
  const exec = promisify(execCb);

  const ff = process.env.FFMPEG_PATH || "ffmpeg";
  await exec(ff, [
    "-y",
    "-loop", "1",
    "-i", screenshotPath,
    "-c:v", "libx264",
    "-t", String(durationS),
    "-pix_fmt", "yuv420p",
    "-vf", "scale=540:960",
    "-r", "24",
    outPath,
  ], { timeout: 30_000 });

  console.log(`  [playwright] Scene card → ${outPath}`);
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// ─── Stage 2: Generate voiceover ──────────────────────────────────────────────

async function generateVoiceover(pkg, outDir, adapters, opts) {
  const voPath = join(outDir, "voiceover.mp3");

  if (opts.skipAudio) {
    console.log(`  [pipeline] Skipping voiceover (--skip-audio)`);
    return null;
  }

  if (opts.dryRun) {
    const words = pkg.voiceover.script.split(/\s+/).length;
    const estDuration = (words / 2.2).toFixed(1);
    console.log(`  [dry-run] VO: ${words} words (~${estDuration}s), voice: ${pkg.voiceover.voice.gender}/${pkg.voiceover.voice.pace}`);
    return null;
  }

  if (existsSync(voPath)) {
    console.log(`  [pipeline] Voiceover exists, skipping`);
    return voPath;
  }

  console.log(`\n  ═══ Voiceover ═══`);

  switch (opts.voice) {
    case "elevenlabs":
      await adapters.elevenlabs.generateSpeech({
        text: pkg.voiceover.script,
        voice: pkg.voiceover.voice,
        outPath: voPath,
      });
      break;

    case "edge-tts": {
      // Use edge-tts (free, no API key) as fallback
      console.log(`  [tts] Using edge-tts (free fallback)`);
      const { execFile: execCb } = await import("node:child_process");
      const { promisify } = await import("node:util");
      const exec = promisify(execCb);

      const voiceName = pkg.voiceover.voice.gender === "male" ? "en-GB-RyanNeural" : "en-GB-SoniaNeural";
      await exec("edge-tts", [
        "--voice", voiceName,
        "--text", pkg.voiceover.script,
        "--write-media", voPath,
      ], { timeout: 60_000 });
      console.log(`  [tts] Saved ${voPath}`);
      break;
    }

    case "none":
      console.log(`  [tts] Voice generation disabled (--voice none)`);
      return null;

    default:
      throw new Error(`Unknown voice backend: ${opts.voice}`);
  }

  return voPath;
}

// ─── Stage 3: Source background music ─────────────────────────────────────────

function sourceMusic(pkg, outDir, opts) {
  if (opts.skipAudio) return null;

  const musicDir = process.env.MUSIC_DIR || join(ROOT, "public", "music");
  if (!existsSync(musicDir)) {
    console.warn(`  [music] Music directory not found: ${musicDir}`);
    console.warn(`  [music] Set MUSIC_DIR env var or place .mp3 files in public/music/`);
    return null;
  }

  // Try to match by genre/mood keywords
  const files = readdirSync(musicDir).filter((f) => f.endsWith(".mp3"));
  if (!files.length) {
    console.warn(`  [music] No .mp3 files found in ${musicDir}`);
    return null;
  }

  // Simple matching: look for genre keywords in filename
  const genreWords = (pkg.music?.genre || "").toLowerCase().split(/[\s+/]+/);
  let bestMatch = files[0];
  let bestScore = 0;

  for (const file of files) {
    const name = file.toLowerCase();
    let score = 0;
    for (const word of genreWords) {
      if (word.length > 2 && name.includes(word)) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = file;
    }
  }

  const musicPath = join(musicDir, bestMatch);
  console.log(`  [music] Selected: ${bestMatch} (genre: ${pkg.music?.genre})`);
  return musicPath;
}

// ─── Stage 4: Mix audio ───────────────────────────────────────────────────────

async function mixAudioTrack(pkg, voPath, musicPath, outDir, adapters, opts) {
  const audioPath = join(outDir, "mixed_audio.mp3");

  if (opts.skipAudio) {
    console.log(`  [pipeline] Skipping audio mix (--skip-audio)`);
    return null;
  }

  if (opts.dryRun) {
    console.log(`  [dry-run] Audio mix: VO + music (${pkg.music?.genre}) + ${pkg.sfx?.length || 0} SFX`);
    return null;
  }

  console.log(`\n  ═══ Audio Mix ═══`);

  const sfxDir = process.env.SFX_DIR || join(ROOT, "public", "sfx");

  await adapters.mixer.mixAudio({
    voPath,
    voDuration: pkg.duration_s, // Approximate; actual VO length may differ
    music: pkg.music,
    musicPath,
    sfxList: pkg.sfx || [],
    sfxDir: existsSync(sfxDir) ? sfxDir : null,
    duration: pkg.duration_s,
    outPath: audioPath,
  });

  return audioPath;
}

// ─── Stage 5: Composite final video ───────────────────────────────────────────

async function compositeFinal(pkg, scenePaths, audioPath, outDir, adapters, opts) {
  if (opts.dryRun) {
    console.log(`  [dry-run] Composite: ${scenePaths.length} scenes + audio + ${pkg.captions?.length || 0} captions`);
    console.log(`  [dry-run] Output: ${join(outDir, `${pkg.id}_final.mp4`)}`);
    return null;
  }

  console.log(`\n  ═══ Final Composite ═══`);

  return adapters.comp.composite({
    scenePaths,
    audioPath,
    captions: pkg.captions || [],
    duration: pkg.duration_s,
    accent: pkg.accent,
    outDir,
    templateId: pkg.id,
    sceneDurations: pkg.scenes.map((s) => s.end_s - s.start_s),
  });
}

// ─── Main pipeline ────────────────────────────────────────────────────────────

async function runPipeline(pkg, opts) {
  const errors = validatePackage(pkg);
  if (errors.length) {
    console.error(`\n  ✗ Invalid RENDER_PACKAGE for "${pkg.id}":`);
    errors.forEach((e) => console.error(`    - ${e}`));
    process.exit(1);
  }

  const outDir = opts.outputDir || join(ROOT, "recordings", "rendered", pkg.id);
  mkdirSync(outDir, { recursive: true });

  console.log(`\n╔══════════════════════════════════════════════════════════╗`);
  console.log(`║  RENDER PIPELINE: ${pkg.id.padEnd(38)}║`);
  console.log(`╠══════════════════════════════════════════════════════════╣`);
  console.log(`║  Template:    ${(pkg.id).padEnd(42)}║`);
  console.log(`║  Duration:    ${(pkg.duration_s + "s").padEnd(42)}║`);
  console.log(`║  Scenes:      ${(pkg.scenes.length).toString().padEnd(42)}║`);
  console.log(`║  Accent:      ${(pkg.accent).padEnd(42)}║`);
  console.log(`║  Video:       ${(opts.backend).padEnd(42)}║`);
  console.log(`║  Voice:       ${(opts.voice).padEnd(42)}║`);
  console.log(`║  Output:      ${outDir.slice(-42).padEnd(42)}║`);
  console.log(`╚══════════════════════════════════════════════════════════╝\n`);

  const adapters = await loadAdapters();

  // Stage 1: Generate scene videos
  console.log(`\n── Stage 1: Scene Videos ──────────────────────────────────`);
  const scenePaths = await generateSceneVideos(pkg, outDir, adapters, opts);

  // Stage 2: Generate voiceover
  console.log(`\n── Stage 2: Voiceover ────────────────────────────────────`);
  const voPath = await generateVoiceover(pkg, outDir, adapters, opts);

  // Stage 3: Source music
  console.log(`\n── Stage 3: Background Music ─────────────────────────────`);
  const musicPath = sourceMusic(pkg, outDir, opts);

  // Stage 4: Mix audio
  console.log(`\n── Stage 4: Audio Mix ────────────────────────────────────`);
  const audioPath = await mixAudioTrack(pkg, voPath, musicPath, outDir, adapters, opts);

  // Stage 5: Composite
  console.log(`\n── Stage 5: Final Composite ──────────────────────────────`);
  const finalPath = await compositeFinal(pkg, scenePaths, audioPath, outDir, adapters, opts);

  if (!opts.dryRun && finalPath) {
    console.log(`\n╔══════════════════════════════════════════════════════════╗`);
    console.log(`║  ✓ COMPLETE                                             ║`);
    console.log(`║  ${finalPath.slice(-56).padEnd(56)}║`);
    console.log(`╚══════════════════════════════════════════════════════════╝`);
  }

  return finalPath;
}

// ─── Entry point ──────────────────────────────────────────────────────────────

async function main() {
  const opts = parseArgs();

  // Handle --list-voices
  if (opts.listVoices) {
    const { elevenlabs } = await loadAdapters();
    if (!elevenlabs.isConfigured()) {
      console.error("ELEVENLABS_API_KEY is not set. Get one at https://elevenlabs.io/");
      process.exit(1);
    }
    const voices = await elevenlabs.listVoices();
    console.log("\nAvailable ElevenLabs voices:\n");
    for (const v of voices) {
      console.log(`  ${v.id}  ${v.name} (${v.gender || "?"})`);
    }
    return;
  }

  // Handle --batch
  if (opts.batch) {
    const batchDir = resolve(opts.batch);
    if (!existsSync(batchDir)) {
      console.error(`Batch directory not found: ${batchDir}`);
      process.exit(1);
    }
    const files = readdirSync(batchDir).filter((f) => f.endsWith(".json"));
    console.log(`\nBatch mode: ${files.length} packages in ${batchDir}\n`);

    const results = [];
    for (const file of files) {
      let pkg;
      try {
        pkg = readJson(join(batchDir, file));
      } catch (err) {
        console.error(`\n  ✗ ${file}: ${err.message}\n`);
        results.push({ id: file, status: "error", error: err.message });
        continue;
      }
      try {
        const result = await runPipeline(pkg, { ...opts, outputDir: join(opts.outputDir || join(ROOT, "recordings", "rendered"), pkg.id) });
        results.push({ id: pkg.id, status: "ok", path: result });
      } catch (err) {
        console.error(`\n  ✗ Failed: ${pkg.id} — ${err.message}\n`);
        results.push({ id: pkg.id, status: "error", error: err.message });
      }
    }

    console.log(`\n\n═══════════════════════════════════════════════════════════`);
    console.log(`BATCH RESULTS:`);
    for (const r of results) {
      const icon = r.status === "ok" ? "✓" : "✗";
      console.log(`  ${icon} ${r.id} — ${r.status}${r.error ? ` (${r.error})` : ""}`);
    }
    const ok = results.filter((r) => r.status === "ok").length;
    console.log(`\n  ${ok}/${results.length} succeeded`);
    return;
  }

  // Single file mode
  if (!opts.input) {
    console.error("No input file specified. Use --help for usage.");
    process.exit(1);
  }

  const inputPath = resolve(opts.input);
  if (!existsSync(inputPath)) {
    console.error(`File not found: ${inputPath}`);
    process.exit(1);
  }

  const pkg = readJson(inputPath);
  await runPipeline(pkg, opts);
}

main().catch((err) => {
  console.error(`\n  ✗ Pipeline failed: ${err.message}`);
  if (err.stack) console.error(err.stack);
  process.exit(1);
});
