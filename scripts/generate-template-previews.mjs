/* eslint-disable no-console */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

/**
 * Screenshot each template's TYPE-AWARE preview route
 * (`/events/<type>/<templateId>/preview`) and save as
 * `public/template-previews/<templateId>.jpg`.
 *
 * Usage:
 *   Local:    npm run dev   then   npm run previews
 *   Deployed: npm run previews -- --base https://1event.vercel.app
 *   Mobile:   npm run previews:mobile -- --base https://1event.vercel.app
 *
 * Flags:
 *   --base <url>   base URL (default http://localhost:3000). Use the deployed
 *                  site to avoid running a local dev server.
 *   --mobile       phone viewport (390×844)
 *   --out <dir>    output folder
 * Env:
 *   PREVIEW_BASE_URL   same as --base
 *   PREVIEW_ONLY       comma-separated templateIds to regenerate
 */

// Demo codes live in the DEMO-<TEMPLATE> namespace so they can't collide with
// real customer enquiries (which are always <PREFIX>-<YEAR>-<SEQ>). Change
// these together with the *_CODE constants in lib/dummyData.ts.
const TEMPLATES = [
  { id: "royal", code: "DEMO-ROYAL", type: "wedding" },
  { id: "minimal", code: "DEMO-MINIMAL", type: "wedding" },
  { id: "modern", code: "DEMO-MODERN", type: "wedding" },
  { id: "vibrant", code: "DEMO-VIBRANT", type: "birthday" },
  { id: "pastel", code: "DEMO-PASTEL", type: "wedding" },
  { id: "aurora", code: "DEMO-AURORA", type: "wedding" },
  { id: "obsidian", code: "DEMO-OBSIDIAN", type: "wedding" },
  { id: "celestia", code: "DEMO-CELESTIA", type: "wedding" },
  { id: "nexus", code: "DEMO-NEXUS", type: "product-launch" },
  { id: "pinnacle", code: "DEMO-PINNACLE", type: "corporate" },
  { id: "luminary", code: "DEMO-LUMINARY", type: "award-ceremony" },
  { id: "converge", code: "DEMO-CONVERGE", type: "networking-event" },
  { id: "after", code: "DEMO-AFTER", type: "party" },
  { id: "empyrean", code: "DEMO-EMPYREAN", type: "wedding" },
  { id: "prism", code: "DEMO-PRISM", type: "wedding" },
  { id: "orbit", code: "DEMO-ORBIT", type: "birthday" },
  { id: "arcade", code: "DEMO-ARCADE", type: "birthday" },
  { id: "promise", code: "DEMO-PROMISE", type: "engagement" },
  { id: "chapters", code: "DEMO-CHAPTERS", type: "anniversary" },
  { id: "neural", code: "DEMO-NEURAL", type: "corporate" },
  { id: "unveil", code: "DEMO-UNVEIL", type: "product-launch" },
  { id: "odeon", code: "DEMO-ODEON", type: "award-ceremony" },
  { id: "constella", code: "DEMO-CONSTELLA", type: "networking-event" },
  { id: "metropolis", code: "DEMO-METROPOLIS", type: "party" },
  { id: "moonlit", code: "DEMO-MOONLIT", type: "wedding" },
  { id: "skytemple", code: "DEMO-SKYTEMPLE", type: "wedding" },
  { id: "oceanpalace", code: "DEMO-OCEANPALACE", type: "wedding" },
  { id: "symphony", code: "DEMO-SYMPHONY", type: "wedding" },
  { id: "infinity", code: "DEMO-INFINITY", type: "engagement" },
  { id: "lovestars", code: "DEMO-LOVESTARS", type: "engagement" },
  { id: "garden", code: "DEMO-GARDEN", type: "engagement" },
  { id: "horizon", code: "DEMO-HORIZON", type: "engagement" },
  { id: "toybox", code: "DEMO-TOYBOX", type: "birthday" },
  { id: "timemachine", code: "DEMO-TIMEMACHINE", type: "birthday" },
  { id: "carnival", code: "DEMO-CARNIVAL", type: "birthday" },
  { id: "dreamfactory", code: "DEMO-DREAMFACTORY", type: "birthday" },
  { id: "library", code: "DEMO-LIBRARY", type: "anniversary" },
  { id: "quantum", code: "DEMO-QUANTUM", type: "corporate" },
  { id: "genesis", code: "DEMO-GENESIS", type: "product-launch" },
  { id: "immortals", code: "DEMO-IMMORTALS", type: "award-ceremony" },
  { id: "ecosystem", code: "DEMO-ECOSYSTEM", type: "networking-event" },
  { id: "infinityclub", code: "DEMO-INFINITYCLUB", type: "party" },
  { id: "skyrealm", code: "DEMO-SKYREALM", type: "wedding" },
  { id: "cathedral", code: "DEMO-CATHEDRAL", type: "wedding" },
  { id: "sakura", code: "DEMO-SAKURA", type: "wedding" },
  { id: "versailles", code: "DEMO-VERSAILLES", type: "wedding" },
  { id: "fresco", code: "DEMO-FRESCO", type: "wedding" },
  { id: "mirage", code: "DEMO-MIRAGE", type: "wedding" },
  { id: "icepalace", code: "DEMO-ICEPALACE", type: "wedding" },
  { id: "galaxyopera", code: "DEMO-GALAXYOPERA", type: "wedding" },
  { id: "tworivers", code: "DEMO-TWORIVERS", type: "engagement" },
  { id: "mirrorworlds", code: "DEMO-MIRRORWORLDS", type: "engagement" },
  { id: "infinitytrain", code: "DEMO-INFINITYTRAIN", type: "engagement" },
  { id: "lanterns", code: "DEMO-LANTERNS", type: "engagement" },
  { id: "glassrose", code: "DEMO-GLASSROSE", type: "engagement" },
  { id: "secretgalaxy", code: "DEMO-SECRETGALAXY", type: "engagement" },
  { id: "cartoon", code: "DEMO-CARTOON", type: "birthday" },
  { id: "bricktown", code: "DEMO-BRICKTOWN", type: "birthday" },
  { id: "treasure", code: "DEMO-TREASURE", type: "birthday" },
  { id: "themepark", code: "DEMO-THEMEPARK", type: "birthday" },
  { id: "candyland", code: "DEMO-CANDYLAND", type: "birthday" },
  { id: "robocity", code: "DEMO-ROBOCITY", type: "birthday" },
  { id: "spacemission", code: "DEMO-SPACEMISSION", type: "birthday" },
  { id: "jungle", code: "DEMO-JUNGLE", type: "birthday" },
  { id: "timecapsule", code: "DEMO-TIMECAPSULE", type: "anniversary" },
  { id: "treeoflife", code: "DEMO-TREEOFLIFE", type: "anniversary" },
  { id: "endlessclock", code: "DEMO-ENDLESSCLOCK", type: "anniversary" },
  { id: "digitalcity", code: "DEMO-DIGITALCITY", type: "corporate" },
  { id: "quantumlab", code: "DEMO-QUANTUMLAB", type: "corporate" },
  { id: "missioncontrol", code: "DEMO-MISSIONCONTROL", type: "corporate" },
  { id: "secretlab", code: "DEMO-SECRETLAB", type: "product-launch" },
  { id: "portal", code: "DEMO-PORTAL", type: "product-launch" },
  { id: "evolution", code: "DEMO-EVOLUTION", type: "product-launch" },
  { id: "goldenuniverse", code: "DEMO-GOLDENUNIVERSE", type: "award-ceremony" },
  { id: "halloffame", code: "DEMO-HALLOFFAME", type: "award-ceremony" },
  { id: "synapse", code: "DEMO-SYNAPSE", type: "networking-event" },
  { id: "futurecity", code: "DEMO-FUTURECITY", type: "networking-event" },
  { id: "festival", code: "DEMO-FESTIVAL", type: "party" },
  { id: "neonjungle", code: "DEMO-NEONJUNGLE", type: "party" },
  { id: "midnighttokyo", code: "DEMO-MIDNIGHTTOKYO", type: "party" },
];

// CLI flags (cross-platform — no env-var prefixes needed on Windows):
//   --mobile          capture a phone-shaped viewport (390×844) instead of 1200×900
//   --out <dir>       output folder (default depends on --mobile)
const argv = process.argv.slice(2);
const argVal = (name) => {
  const i = argv.indexOf(name);
  return i >= 0 ? argv[i + 1] : undefined;
};
const MOBILE = argv.includes("--mobile") || process.env.PREVIEW_MOBILE === "1";

const BASE_URL =
  argVal("--base") ?? process.env.PREVIEW_BASE_URL ?? "http://localhost:3000";
const OUT_DIR = path.resolve(
  argVal("--out") ??
    process.env.PREVIEW_OUT_DIR ??
    (MOBILE ? "public/template-previews-mobile" : "public/template-previews"),
);
// Mobile = a tall phone frame (portrait); desktop = the 4:3 card crop.
const VIEWPORT = MOBILE ? { width: 390, height: 844 } : { width: 1200, height: 900 };
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

  // Fetch each template's full event-type list so we can render a preview per
  // (template × event type) — festival's birthday card ≠ its party card.
  const typeMap = {};
  try {
    const res = await fetch(`${BASE_URL}/api/templates`);
    const json = await res.json();
    for (const t of json.templates ?? []) typeMap[t.id] = t.eventTypes ?? [];
  } catch (err) {
    console.warn(`! Couldn't fetch /api/templates (${err.message}); using each entry's single type.`);
  }

  const browser = await chromium.launch({ headless: true });
  const failures = [];

  // goto → settle → hide dev chrome → screenshot into outPath (creating dirs).
  const capture = async (page, url, outPath) => {
    await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 });
    await page.waitForTimeout(1500);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    await page.addStyleTag({
      content: `nextjs-portal,#__next-build-watcher,[data-nextjs-toast]{display:none!important}`,
    });
    await page.waitForTimeout(150);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    await page.screenshot({ path: outPath, type: "jpeg", quality: 88, fullPage: false });
  };

  try {
    for (const entry of TEMPLATES) {
      const { id } = entry;
      if (ONLY && !ONLY.has(id)) continue;

      // All event types this template supports (from the API), else its entry type.
      const types =
        typeMap[id] && typeMap[id].length ? typeMap[id] : [entry.type ?? "wedding"];
      // The "shared" (type-agnostic, used on the landing) copy comes from this one.
      const primary = entry.type && types.includes(entry.type) ? entry.type : types[0];

      console.log(`→ ${id.padEnd(14)} [${types.join(", ")}]`);

      const context = await browser.newContext({
        viewport: VIEWPORT,
        deviceScaleFactor: 2, // retina so the JPEG stays crisp in cards
        reducedMotion: "reduce", // skip entrance animations — capture the settled state
      });
      const page = await context.newPage();

      try {
        for (const type of types) {
          // Per-type preview: public/template-previews[/-mobile]/<type>/<id>.jpg
          const out = path.join(OUT_DIR, type, `${id}.jpg`);
          await capture(page, `${BASE_URL}/events/${type}/${id}/preview`, out);
          // Shared default (public/template-previews/<id>.jpg) = the primary type.
          if (type === primary) fs.copyFileSync(out, path.join(OUT_DIR, `${id}.jpg`));
          console.log(`   ✓ ${type}/${id}.jpg`);
        }
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
