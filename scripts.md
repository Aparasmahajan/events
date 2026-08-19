# Video pipeline — end-to-end guide (verified 2026-07-18)

Two scripts, three phases: **roster → RENDER_PACKAGE → rendered .mp4**. Every command below was executed against this repo and produced a real, playable video (14s, 540×960, H.264+AAC).

```
scripts/video-roster.mjs         → JSON list of templates for one event type
prompts/video-batch-prompt.md    → LLM prompt (you feed it the roster, get RENDER_PACKAGEs back)
scripts/render-pipeline.mjs      → renders each RENDER_PACKAGE into an .mp4
```

Output lands in `recordings/rendered/<package-id>/<package-id>_final.mp4`.

---

## 0. One-time setup

The pipeline needs Node ≥ 18, Playwright (for the no-API scene fallback), and ffmpeg (`ffmpeg-static` is already a dev dep — `node_modules/ffmpeg-static/ffmpeg.exe`).

```powershell
# Confirm the binary exists (should print a path ending in ffmpeg.exe)
node -e "console.log(require('ffmpeg-static'))"

# Playwright browsers — only needed for --backend playwright
npx playwright install chromium
```

**Always set FFMPEG_PATH** — the Playwright fallback shells out to raw `ffmpeg`, which isn't on PATH on Windows unless you installed one manually:

```powershell
$env:FFMPEG_PATH = "$PWD\node_modules\ffmpeg-static\ffmpeg.exe"
```

(Add it to your PowerShell profile once and forget it.)

Optional API keys (only if you want real Runway/ElevenLabs output instead of the local fallbacks):
```
RUNWAY_API_KEY=…           # --backend runway (cinematic scene video)
ELEVENLABS_API_KEY=…       # --voice elevenlabs (real TTS voiceover)
MUSIC_DIR=public/music     # folder of .mp3 files (used when unset)
```

---

## Step 1 — Generate the roster JSON

Reads [components/templates/metadata.ts](components/templates/metadata.ts) and emits every template registered for one event type.

```powershell
node scripts/video-roster.mjs wedding -o blueprints/wedding-roster.json
```

**Always use `-o <file>`, never `>`.** PowerShell 5.1's `>` writes UTF-16 LE with BOM, which `render-pipeline.mjs` refuses. The `-o` flag makes Node write the file itself as clean UTF-8.

Valid event types: `wedding | engagement | anniversary | birthday | party | corporate | product-launch | award-ceremony | networking-event`.

**Verify:**
```powershell
node -e "const j = require('./blueprints/wedding-roster.json'); console.log(j.eventType, j.count, j.templates[0].id)"
# → wedding 41 royal
```

Roster shape (one item per template):
```json
{
  "eventType": "wedding",
  "count": 41,
  "templates": [
    { "id": "royal", "name": "Royal Wedding", "codename": "Royal Heritage",
      "vibe": "Vintage Royal", "accent": "#a3792c",
      "tags": ["royal","elegant","luxurious"],
      "keywords": ["indianwedding","hinduwedding","shaadi","mandap"],
      "description": "The full big-fat-Indian-wedding treatment..." }
  ]
}
```

---

## Step 2 — Convert the roster into RENDER_PACKAGEs (LLM step)

The roster is the *input* to the batch prompt, not something the pipeline consumes directly. If you feed a roster to `render-pipeline.mjs` it now errors out with a clear message telling you this.

1. Open [prompts/video-batch-prompt.md](prompts/video-batch-prompt.md)
2. Paste `blueprints/wedding-roster.json` where the prompt says `{{TEMPLATE_ROSTER}}`
3. Set `{{EVENT_TYPE}} = Wedding`
4. Send the full prompt to Claude/GPT
5. For each template, the LLM returns a blueprint ending with a `RENDER_PACKAGE` JSON block
6. Save each block to `blueprints/wedding/<template-id>.json`

**RENDER_PACKAGE shape** (schema in [prompts/video-batch-prompt.md:1011](prompts/video-batch-prompt.md#L1011)):

```json
{
  "id": "royal",
  "aspect": "9:16",
  "duration_s": 15,
  "accent": "#a3792c",
  "scenes": [
    { "start_s": 0, "end_s": 5,
      "visual_prompt": "Ornate Indian mandap draped in marigold, brass diyas...",
      "motion": "slow push-in",
      "caption": "A Royal Beginning",
      "caption_style": "serif display, gold on cream, centered" }
  ],
  "voiceover": {
    "script": "Every royal love story deserves a stage worthy of its grandeur...",
    "voice": { "gender": "female", "pace": "medium", "energy": "medium" }
  },
  "music": { "genre": "cinematic indian classical", "bpm": 70, "mood": "regal", "energy_curve": "swell" },
  "sfx": [],
  "captions": [
    { "in_s": 0.5, "out_s": 4.5, "text": "A Royal Beginning" }
  ]
}
```

Validator requirements (from [scripts/render-pipeline.mjs:227](scripts/render-pipeline.mjs#L227)):
- `id` — used as output folder + filename
- `scenes[]` — each with `start_s`, `end_s`, `visual_prompt`
- `voiceover.script` — the spoken track
- `duration_s` — total, must be 5–30

You can also **hand-write** a package for a quick smoke test — that's exactly what [blueprints/wedding/royal.json](blueprints/wedding/royal.json) is (checked in).

---

## Step 3 — Dry-run (sanity check, no API cost)

```powershell
node scripts/render-pipeline.mjs blueprints/wedding/royal.json --backend playwright --voice none --dry-run
```

Expected tail:
```
── Stage 5: Final Composite ──────────────────────────────
  [dry-run] Composite: 3 scenes + audio + 3 captions
  [dry-run] Output: …\recordings\rendered\royal\royal_final.mp4
```

If it prints "Missing 'scenes' array" or the roster-vs-package error, stop and fix the JSON before spending scene/TTS credits.

---

## Step 4 — Render for real

Zero-API local render (Playwright text-card scenes, silence + music-if-present audio track):

```powershell
node scripts/render-pipeline.mjs blueprints/wedding/royal.json --backend playwright --voice none
```

Full production render (needs both API keys and .mp3s in `public/music/`):

```powershell
node scripts/render-pipeline.mjs blueprints/wedding/royal.json --backend runway --voice elevenlabs
```

Batch every package in a folder:

```powershell
node scripts/render-pipeline.mjs --batch blueprints/wedding/
```

Iteration flags:

| Flag | Use |
|---|---|
| `--dry-run` | Print the plan, don't touch APIs |
| `--skip-scenes` | Reuse already-generated `scenes/scene_*.mp4` |
| `--skip-audio` | Skip TTS + music mix (produces silent video) |
| `--output-dir <path>` | Override `recordings/rendered/<id>/` |
| `--concurrency <n>` | Parallel scene renders (default 2) |
| `--list-voices` | Enumerate ElevenLabs voices |

---

## Step 5 — Verify the output

Successful runs print a banner ending with `✓ COMPLETE` and the final path. Then:

```powershell
# Directory listing
ls recordings/rendered/royal/

# File duration + streams
& "$PWD\node_modules\ffmpeg-static\ffmpeg.exe" -i recordings/rendered/royal/royal_final.mp4
```

Expected artifacts:
```
recordings/rendered/royal/
├── scenes/
│   ├── scene_00.mp4          per-scene clip
│   ├── scene_00.png          screenshot (Playwright backend)
│   ├── scene_01.mp4
│   └── scene_02.mp4
├── _silence_vo.mp3           only when --voice none
├── _silence_music.mp3        only when MUSIC_DIR is empty
├── mixed_audio.mp3           voiceover + music (ducked)
├── royal_scenes.mp4          concatenated video, no audio
├── royal_audio.mp4           video + mixed audio, no captions
├── royal_captions.srt        subtitle timing
└── royal_final.mp4     ← ship this
```

For the checked-in royal package (3 scenes × 5s − 2 crossfades × 0.5s):

```
Duration: 00:00:14.00, 540x960, 24 fps, H.264 + AAC
```

Open the mp4 in any player — it should show three fade-transitioning cards on a dark background with the accent bar at the top and captions burned in at the bottom.

---

## Common failures & fixes

| Symptom | Cause | Fix |
|---|---|---|
| `Unexpected token '�', "��{`… | PS `>` wrote UTF-16 LE + BOM | Use `node scripts/video-roster.mjs wedding -o path.json` |
| `spawn ffmpeg ENOENT` | ffmpeg not on PATH | `$env:FFMPEG_PATH = "$PWD\node_modules\ffmpeg-static\ffmpeg.exe"` |
| `looks like a TEMPLATE_ROSTER` | Fed roster to pipeline | Run the LLM step 2 first; feed the returned RENDER_PACKAGE, not the roster |
| Final video is only ~5s when duration_s is 15 | (Fixed 2026-07-18) xfade offsets used a hard-coded 5s; scene durations now pass through from the package | Rebuild `node_modules` if you're on an old checkout |
| `Music directory not found` | `public/music/` empty (warning only) | Drop a few `.mp3` files in `public/music/` or set `MUSIC_DIR` |
| Playwright launch times out | Chromium not installed | `npx playwright install chromium` |

---

## What each pipeline stage actually does

Reference: [scripts/render-pipeline.mjs:29-35](scripts/render-pipeline.mjs#L29-L35)

1. **Parse + validate** the RENDER_PACKAGE (schema above)
2. **Scene videos** — for each scene:
   - `--backend runway` — Runway ML text-to-video ([scripts/lib/runway.mjs](scripts/lib/runway.mjs))
   - `--backend playwright` — a styled HTML card screenshotted then wrapped by ffmpeg loop-image (no API, free)
3. **Voiceover** — `elevenlabs` | `edge-tts` | `none`
4. **Music** — picks the best filename match from `MUSIC_DIR` against `music.genre` keywords
5. **Audio mix** ([scripts/lib/audio-mixer.mjs](scripts/lib/audio-mixer.mjs)) — VO + music-with-ducking + SFX
6. **Composite** ([scripts/lib/compositor.mjs](scripts/lib/compositor.mjs)) — concat scenes with 0.5s crossfade → overlay audio → burn SRT captions

---

## Bonus: record the live template instead

For "reel of the actual site scrolling", skip the AI pipeline entirely and use [scripts/record-site.mjs](scripts/record-site.mjs):

```powershell
node scripts/record-site.mjs `
  --url http://localhost:3001/events/wedding/royal/preview `
  --mode reel --cursor --speed 1.3 `
  --out recordings/royal-reel.mp4
```

Requires the Next dev server on the given port.

---

## End-to-end, all in one flow

```powershell
# Prereq
$env:FFMPEG_PATH = "$PWD\node_modules\ffmpeg-static\ffmpeg.exe"

# 1. Roster
node scripts/video-roster.mjs wedding -o blueprints/wedding-roster.json

# 2. → Paste roster into prompts/video-batch-prompt.md, LLM returns RENDER_PACKAGEs,
#      save each to blueprints/wedding/<id>.json  (or hand-write one for testing)

# 3. Dry-run
node scripts/render-pipeline.mjs blueprints/wedding/royal.json --backend playwright --voice none --dry-run

# 4. Real render (zero-API path)
node scripts/render-pipeline.mjs blueprints/wedding/royal.json --backend playwright --voice none

# 5. Verify
& $env:FFMPEG_PATH -i recordings/rendered/royal/royal_final.mp4
```

Final file: `recordings/rendered/royal/royal_final.mp4`.
