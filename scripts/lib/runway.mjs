/**
 * Runway ML Gen-3 Alpha text-to-video adapter.
 *
 * Requires: RUNWAY_API_KEY env var.
 *
 * API flow:
 *   1. POST /v1/image_to_video  (yes, even text-only uses this endpoint)
 *      with { model: "gen3a_turbo", promptText, duration, ratio }
 *   2. Poll GET /v1/tasks/{id} until status is "SUCCEEDED" or "FAILED"
 *   3. Download the resulting video URL
 *
 * Docs: https://docs.dev.runwayml.com/
 */

const RUNWAY_BASE = "https://api.dev.runwayml.com/v1";

function apiKey() {
  const key = process.env.RUNWAY_API_KEY;
  if (!key) throw new Error("RUNWAY_API_KEY is not set. Get one at https://dev.runwayml.com/");
  return key;
}

function headers() {
  return {
    Authorization: `Bearer ${apiKey()}`,
    "Content-Type": "application/json",
    "X-Runway-Version": "2024-11-06",
  };
}

/**
 * Generate a video clip from a text prompt.
 *
 * @param {object} opts
 * @param {string} opts.prompt     - Text-to-video prompt
 * @param {number} opts.duration   - Duration in seconds (5 or 10 for Gen-3 Alpha Turbo)
 * @param {string} opts.aspect     - "9:16" or "16:9"
 * @param {string} opts.movement   - Camera movement hint (e.g. "push-in", "pan-left")
 * @param {string} opts.outPath    - Where to save the .mp4
 * @returns {Promise<string>}      - Path to saved video
 */
export async function generateScene({ prompt, duration, aspect, movement, outPath }) {
  const d = Math.min(Math.max(Math.round(duration), 5), 10);
  const ratio = aspect === "9:16" ? "768:1344" : "1344:768";

  console.log(`  [runway] Creating task: ${d}s clip, ${ratio}`);

  const createRes = await fetch(`${RUNWAY_BASE}/image_to_video`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      model: "gen3a_turbo",
      promptText: movement ? `${prompt}. Camera: ${movement}.` : prompt,
      duration: d,
      ratio,
    }),
  });

  if (!createRes.ok) {
    const body = await createRes.text();
    throw new Error(`Runway task creation failed (${createRes.status}): ${body}`);
  }

  const { id: taskId } = await createRes.json();
  console.log(`  [runway] Task ${taskId} submitted, polling...`);

  // Poll until done (max 10 min)
  const startTime = Date.now();
  const MAX_WAIT_MS = 10 * 60 * 1000;
  const POLL_INTERVAL_MS = 5_000;

  while (Date.now() - startTime < MAX_WAIT_MS) {
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));

    const pollRes = await fetch(`${RUNWAY_BASE}/tasks/${taskId}`, { headers: headers() });
    if (!pollRes.ok) {
      console.warn(`  [runway] Poll returned ${pollRes.status}, retrying...`);
      continue;
    }

    const task = await pollRes.json();
    const status = task.status;

    if (status === "SUCCEEDED") {
      const videoUrl = task.output?.[0];
      if (!videoUrl) throw new Error("Runway task succeeded but no output URL found");

      console.log(`  [runway] Task complete, downloading...`);
      const videoRes = await fetch(videoUrl);
      if (!videoRes.ok) throw new Error(`Failed to download video: ${videoRes.status}`);

      const buffer = Buffer.from(await videoRes.arrayBuffer());
      const { writeFileSync, mkdirSync } = await import("fs");
      const { dirname } = await import("path");
      mkdirSync(dirname(outPath), { recursive: true });
      writeFileSync(outPath, buffer);

      console.log(`  [runway] Saved ${outPath} (${(buffer.length / 1024 / 1024).toFixed(1)} MB)`);
      return outPath;
    }

    if (status === "FAILED") {
      throw new Error(`Runway task failed: ${JSON.stringify(task.failure)}`);
    }

    // Still running
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
    process.stdout.write(`  [runway] Status: ${status} (${elapsed}s)\r`);
  }

  throw new Error(`Runway task timed out after ${MAX_WAIT_MS / 1000}s`);
}

/**
 * Check if Runway API is configured.
 */
export function isConfigured() {
  return !!process.env.RUNWAY_API_KEY;
}
