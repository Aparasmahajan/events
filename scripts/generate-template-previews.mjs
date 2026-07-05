/* eslint-disable no-console */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

/**
 * Render each template's built-in demo, screenshot the hero, and save as
 * `public/template-previews/<templateId>.jpg`. Point every `TemplateMeta`
 * `previewImage` at that path and the marketing surfaces stop depending on
 * Unsplash for template thumbnails.
 *
 * Usage:
 *   1. Start dev server:   npm run dev
 *   2. In another terminal: npm run previews
 *
 * Env:
 *   PREVIEW_BASE_URL   Override the base URL (default http://localhost:3000)
 *   PREVIEW_ONLY       Comma-separated list of templateIds to regenerate.
 *                      Handy after redesigning a single template.
 */

// Demo codes live in the DEMO-<TEMPLATE> namespace so they can't collide with
// real customer enquiries (which are always <PREFIX>-<YEAR>-<SEQ>). Change
// these together with the *_CODE constants in lib/dummyData.ts.
const TEMPLATES = [
  { id: "royal", code: "DEMO-ROYAL" },
  { id: "minimal", code: "DEMO-MINIMAL" },
  { id: "modern", code: "DEMO-MODERN" },
  { id: "vibrant", code: "DEMO-VIBRANT" },
  { id: "pastel", code: "DEMO-PASTEL" },
  { id: "aurora", code: "DEMO-AURORA" },
  { id: "obsidian", code: "DEMO-OBSIDIAN" },
  { id: "celestia", code: "DEMO-CELESTIA" },
  { id: "nexus", code: "DEMO-NEXUS" },
  { id: "pinnacle", code: "DEMO-PINNACLE" },
  { id: "luminary", code: "DEMO-LUMINARY" },
  { id: "converge", code: "DEMO-CONVERGE" },
  { id: "after", code: "DEMO-AFTER" },
  { id: "empyrean", code: "DEMO-EMPYREAN" },
  { id: "prism", code: "DEMO-PRISM" },
  { id: "orbit", code: "DEMO-ORBIT" },
  { id: "arcade", code: "DEMO-ARCADE" },
  { id: "promise", code: "DEMO-PROMISE" },
  { id: "chapters", code: "DEMO-CHAPTERS" },
  { id: "neural", code: "DEMO-NEURAL" },
  { id: "unveil", code: "DEMO-UNVEIL" },
  { id: "odeon", code: "DEMO-ODEON" },
  { id: "constella", code: "DEMO-CONSTELLA" },
  { id: "metropolis", code: "DEMO-METROPOLIS" },
];

const BASE_URL = process.env.PREVIEW_BASE_URL ?? "http://localhost:3000";
const OUT_DIR = path.resolve("public/template-previews");
const VIEWPORT = { width: 1200, height: 900 };
const ONLY = process.env.PREVIEW_ONLY
  ? new Set(process.env.PREVIEW_ONLY.split(",").map((s) => s.trim()))
  : null;

async function checkServer() {
  try {
    const res = await fetch(BASE_URL, { method: "HEAD" });
    return res.ok || res.status === 404; // 404 on / is fine — dev server is up
  } catch {
    return false;
  }
}

async function main() {
  if (!(await checkServer())) {
    console.error(
      `\n✗ Can't reach ${BASE_URL}. Start the dev server in another terminal:\n    npm run dev\n`,
    );
    process.exit(1);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const failures = [];

  try {
    for (const { id, code } of TEMPLATES) {
      if (ONLY && !ONLY.has(id)) continue;

      const url = `${BASE_URL}/e/${code}`;
      console.log(`→ ${id.padEnd(10)} ${code.padEnd(16)} ${url}`);

      const context = await browser.newContext({
        viewport: VIEWPORT,
        // Retina so the JPEG stays crisp inside 400px template cards.
        deviceScaleFactor: 2,
        // Skip framer-motion's entrance animations so the screenshot is what
        // guests see after everything settles.
        reducedMotion: "reduce",
      });
      const page = await context.newPage();

      try {
        await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 });
        // Give any lazy-loading images / fonts one more beat.
        await page.waitForTimeout(1500);
        // Scroll back to top in case waitUntil moved us.
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(300);

        // Hide Next.js dev-mode chrome so it doesn't get baked into the
        // screenshot. Two knobs: the shadow-DOM <nextjs-portal> (dev overlay
        // + error toast) and the older __next-build-watcher badge.
        await page.addStyleTag({
          content: `
            nextjs-portal,
            #__next-build-watcher,
            [data-nextjs-toast] { display: none !important; }
          `,
        });
        await page.waitForTimeout(150);

        const out = path.join(OUT_DIR, `${id}.jpg`);
        await page.screenshot({
          path: out,
          type: "jpeg",
          quality: 88,
          fullPage: false, // just the 1200×900 viewport → matches 4:3 card
        });
        const size = fs.statSync(out).size;
        console.log(
          `   ✓ ${out.replace(process.cwd() + path.sep, "")}  (${(size / 1024).toFixed(0)} KB)`,
        );
      } catch (err) {
        console.error(`   ✗ ${id}: ${err.message}`);
        failures.push(id);
      } finally {
        await context.close();
      }
    }
  } finally {
    await browser.close();
  }

  if (failures.length > 0) {
    console.error(`\nFinished with ${failures.length} failure(s): ${failures.join(", ")}`);
    process.exit(1);
  }
  console.log(`\nAll previews written to ${OUT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
