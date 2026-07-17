// Prints the template roster for one event type as JSON — the input the
// video-batch prompt needs. Grounded in components/templates/metadata.ts so it
// never goes stale as templates change.
//
//   node scripts/video-roster.mjs wedding
//   node scripts/video-roster.mjs corporate > roster.json
//
// Pipe the JSON into the {{TEMPLATE_ROSTER}} slot of prompts/video-batch-prompt.md.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const type = (process.argv[2] || "").trim();
const VALID = [
  "wedding", "engagement", "anniversary", "birthday", "party",
  "corporate", "product-launch", "award-ceremony", "networking-event",
];
if (!VALID.includes(type)) {
  console.error(`Usage: node scripts/video-roster.mjs <eventType>\n  eventType one of: ${VALID.join(", ")}`);
  process.exit(1);
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const s = fs.readFileSync(path.join(root, "components/templates/metadata.ts"), "utf8");

const starts = [];
const re = /\n  id:\s*"([a-z0-9]+)",/g;
let m;
while ((m = re.exec(s))) starts.push(m.index);

const roster = [];
for (let i = 0; i < starts.length; i++) {
  const seg = s.slice(starts[i], starts[i + 1] || starts[i] + 1600);
  const g = (r) => {
    const x = seg.match(r);
    return x ? x[1] : "";
  };
  const arr = (r) => (g(r) || "").replace(/["\s]/g, "").split(",").filter(Boolean);
  const ets = arr(/eventTypes:\s*\[([^\]]*)\]/);
  if (!ets.includes(type)) continue;
  roster.push({
    id: g(/\n  id:\s*"([a-z0-9]+)"/),
    name: g(/\n  name:\s*"([^"]+)"/),
    codename: g(/\n  codename:\s*"([^"]+)"/),
    vibe: g(/vibe:\s*\{\s*label:\s*"([^"]+)"/),
    accent: g(/accentColor:\s*"([^"]+)"/),
    tags: arr(/tags:\s*\[([^\]]*)\]/).slice(0, 5),
    keywords: arr(/keywords:\s*\[([^\]]*)\]/).slice(0, 6),
    description: (g(/\n    description:\s*\n?\s*"([^"]+)"/) || g(/\n  description:\s*\n?\s*"([^"]+)"/)),
  });
}

console.log(JSON.stringify({ eventType: type, count: roster.length, templates: roster }, null, 2));
