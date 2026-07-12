// Cinematic site recorder — records your REAL rendered site (real fonts, real
// Framer Motion animations) with a smooth, eased, human-feeling scroll so the
// footage looks like a real screen recording, not a robotic capture.
//
// Setup (once):
//   npm i -D playwright
//   npx playwright install chromium
//   # optional, for .mp4 + reel upscaling: install ffmpeg and put it on PATH
//
// Run:
//   node scripts/record-site.mjs --url http://localhost:3000
//   node scripts/record-site.mjs --url https://1event.vercel.app --mode reel --cursor
//   node scripts/record-site.mjs --url https://1event.vercel.app/events/wedding/celestia/preview --mode reel --cursor --speed 1.3
//   node scripts/record-site.mjs --url https://1event.vercel.app
// # save to a specific file (relative to where you run the command)
// node scripts/record-site.mjs --url http://localhost:3000/promo.html?auto=1 --out recordings/promo.mp4
// A live URL (dev server or deployed):

// node scripts/record-site.mjs --url http://localhost:3000/promo.html?auto=1
// node scripts/record-site.mjs --url https://1event.vercel.app/events/wedding/aurora/preview
// A local HTML file (like your promo.html) — use a file:/// URL with forward slashes, and encode the space in "New folder" as %20:

// node scripts/record-site.mjs --url "file:///C:/Users/parmahaj/Documents/New%20folder/event/promo.html?auto=1"
// Full example (vertical reel, custom output)
// node scripts/record-site.mjs --url "file:///C:/Users/parmahaj/Documents/New%20folder/event/promo.html?auto=1&v=9x16" --mode reel --out "C:\Users\parmahaj\Videos\promo-reel.mp4"
// Tips
// # absolute Windows path (quote it because of the space):
// node scripts/record-site.mjs --url http://localhost:3000/promo.html?auto=1 --out "C:\Users\parmahaj\Videos\event-promo.mp4"
// Flags:
//   --url <url>        page to record (default: the Aurora preview on localhost)
//   --mode desktop|reel  desktop = 1920x1080, reel = 540x960 → upscaled to 1080x1920
//   --out <file>       output path (default: recordings/site-<mode>.mp4)
//   --cursor           show a soft fake cursor that drifts to the primary CTA
//   --speed <n>        scroll pacing multiplier (1 = default; 1.4 = slower/more cinematic)
//   --headed           show the browser window while recording

import { chromium } from "playwright";
import { spawnSync } from "node:child_process";
import { mkdirSync, existsSync, renameSync } from "node:fs";
import path from "node:path";

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, arr) => {
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const val = arr[i + 1] && !arr[i + 1].startsWith("--") ? arr[i + 1] : true;
      acc.push([key, val]);
    }
    return acc;
  }, []),
);

const URL = args.url || "http://localhost:3000";
const MODE = args.mode === "reel" ? "reel" : "desktop";
const SPEED = Number(args.speed) || 1;
const CURSOR = !!args.cursor;
const HEADED = !!args.headed;

const OUT = args.out || `recordings/site-${MODE}.mp4`;
const REC_DIR = "recordings/_raw";
mkdirSync(REC_DIR, { recursive: true });
mkdirSync(path.dirname(OUT), { recursive: true });

const SIZE = MODE === "reel" ? { width: 540, height: 960 } : { width: 1920, height: 1080 };

const easeInOutCubic = "(t) => (t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2)";

function hasFfmpeg() {
  try {
    return spawnSync("ffmpeg", ["-version"], { stdio: "ignore" }).status === 0;
  } catch {
    return false;
  }
}

const run = async () => {
  console.log(`● Recording ${URL}  (${MODE} ${SIZE.width}x${SIZE.height})`);

  const browser = await chromium.launch({
    headless: !HEADED,
    args: ["--force-color-profile=srgb", "--hide-scrollbars", "--disable-features=IsolateOrigins"],
  });

  const context = await browser.newContext({
    viewport: SIZE,
    deviceScaleFactor: 2, // sharper rendering
    recordVideo: { dir: REC_DIR, size: SIZE },
    // Do NOT emulate reduced motion — we want the animations to play.
    reducedMotion: "no-preference",
    colorScheme: "light",
  });

  const page = await context.newPage();

  // Kill any residual scrollbar + smooth the browser's own scroll anchoring.
  await page.addInitScript(() => {
    const s = document.createElement("style");
    s.textContent =
      "::-webkit-scrollbar{width:0!important;height:0!important} html{scrollbar-width:none}";
    document.documentElement.appendChild(s);
  });

  await page.goto(URL, { waitUntil: "networkidle", timeout: 60000 });

  // Let fonts + hero entrance animation settle before we start moving.
  await page.evaluate(() => document.fonts && document.fonts.ready);
  await page.waitForTimeout(400);

  if (CURSOR) {
    await page.evaluate(() => {
      const c = document.createElement("div");
      c.id = "__fakecursor";
      Object.assign(c.style, {
        position: "fixed",
        left: "0",
        top: "0",
        width: "22px",
        height: "22px",
        borderRadius: "999px",
        background: "radial-gradient(circle,rgba(255,255,255,.9),rgba(255,255,255,.15) 60%,transparent)",
        boxShadow: "0 0 18px rgba(255,255,255,.5)",
        transform: "translate(-50%,-50%)",
        transition: "transform .05s linear",
        zIndex: "999999",
        pointerEvents: "none",
        mixBlendMode: "difference",
      });
      c.style.left = "50%";
      c.style.top = "42%";
      document.body.appendChild(c);
    });
  }

  // Hold on the hero so its entrance reveal plays fully.
  await page.waitForTimeout(2600 * SPEED);

  // Build a cinematic scroll timeline: eased glides to a few "stops",
  // holding at each so section reveals land, then a slow drift to the end.
  const maxScroll = await page.evaluate(
    () => document.documentElement.scrollHeight - window.innerHeight,
  );
  const stops = [0.16, 0.34, 0.52, 0.7, 0.86, 1].map((f) => Math.round(f * maxScroll));

  const glideTo = async (to, dur) => {
    await page.evaluate(
      async ({ to, dur, ease }) => {
        const easeFn = eval(ease);
        const from = window.scrollY;
        const start = performance.now();
        await new Promise((res) => {
          const step = (now) => {
            const t = Math.min(1, (now - start) / dur);
            window.scrollTo(0, from + (to - from) * easeFn(t));
            if (t < 1) requestAnimationFrame(step);
            else res();
          };
          requestAnimationFrame(step);
        });
      },
      { to, dur: dur, ease: easeInOutCubic },
    );
  };

  for (const target of stops) {
    await glideTo(target, 2200 * SPEED); // slow, eased glide
    await page.waitForTimeout(1300 * SPEED); // hold so reveals play
  }

  // A last calm beat at the bottom.
  await page.waitForTimeout(900 * SPEED);

  // Flush the video: closing the context finalizes the file.
  const rawPath = await page.video().path();
  await context.close();
  await browser.close();

  const webmOut = OUT.replace(/\.mp4$/, ".webm");

  if (hasFfmpeg()) {
    const scale =
      MODE === "reel"
        ? ["-vf", "scale=1080:1920:flags=lanczos"]
        : ["-vf", "scale=1920:1080:flags=lanczos"];
    const r = spawnSync(
      "ffmpeg",
      ["-y", "-i", rawPath, ...scale, "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18", "-preset", "slow", OUT],
      { stdio: "inherit" },
    );
    if (r.status === 0) {
      console.log(`\n✓ Done → ${OUT}`);
      return;
    }
    console.warn("ffmpeg failed; keeping the raw .webm instead.");
  }

  if (!existsSync(webmOut)) renameSync(rawPath, webmOut);
  console.log(`\n✓ Done → ${webmOut}` + (hasFfmpeg() ? "" : "\n  (install ffmpeg for a polished .mp4 / reel upscale)"));
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
