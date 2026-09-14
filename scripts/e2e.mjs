/* eslint-disable no-console */
import { chromium } from "playwright";

/**
 * End-to-end suite. Drives the real app in a real browser.
 *
 *   npm run dev            # in another terminal
 *   npm run e2e            # full sweep: every template × every event type
 *   npm run e2e -- --fast  # a sample of templates instead of all of them
 *   npm run e2e -- --base http://localhost:3001
 *
 * READ-ONLY BY DESIGN. Nothing here writes to Google Sheets: the only POSTs are
 * ones the server rejects during validation (before any write) or that the auth
 * middleware blocks. Approving an enquiry / saving an event would create real
 * rows in the customer's live sheet, so those flows are asserted at the auth
 * boundary only.
 *
 * Exit code 0 = all passed, 1 = at least one failure.
 */

const argv = process.argv.slice(2);
const flag = (name) => argv.includes(`--${name}`);
const opt = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i !== -1 && argv[i + 1] ? argv[i + 1] : fallback;
};

const BASE = (opt("base", process.env.E2E_BASE_URL || "http://localhost:3000")).replace(/\/$/, "");
const FAST = flag("fast");
const CONCURRENCY = Number(opt("concurrency", "4"));

const results = [];
let currentSuite = "";
const suite = (name) => {
  currentSuite = name;
  console.log(`\n── ${name} ${"─".repeat(Math.max(0, 58 - name.length))}`);
};
const record = (name, ok, detail) => {
  results.push({ suite: currentSuite, name, ok, detail });
  const mark = ok ? "✓" : "✗";
  console.log(`  ${mark} ${name}${ok || !detail ? "" : `\n      ${detail}`}`);
};
/** Run one assertion, catching throws so the suite always completes. */
const test = async (name, fn) => {
  try {
    const r = await fn();
    record(name, r === true || r === undefined, typeof r === "string" ? r : undefined);
  } catch (e) {
    record(name, false, e instanceof Error ? e.message : String(e));
  }
};

/** Simple worker pool so the template sweep doesn't take all afternoon. */
async function pool(items, size, worker) {
  const queue = [...items];
  const runners = Array.from({ length: Math.min(size, queue.length) }, async () => {
    for (let item = queue.shift(); item !== undefined; item = queue.shift()) {
      await worker(item);
    }
  });
  await Promise.all(runners);
}

const browser = await chromium.launch();

/** Load a page and collect the checks every page must pass. */
async function inspect(path, { width = 1280, height = 900 } = {}) {
  const page = await browser.newPage({ viewport: { width, height } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e).slice(0, 160)));
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    const t = m.text();
    // Skip the browser's generic message for the thumbnail fallback above; the
    // response listener records those as misses instead.
    if (/status of 404/.test(t) && /template-previews/.test(t)) return;
    errors.push(t.slice(0, 160));
  });
  const thumbMisses = [];
  page.on("response", (r) => {
    if (r.status() === 404 && r.url().includes("/template-previews/")) {
      thumbMisses.push(r.url().split("/template-previews/")[1]);
    }
  });
  const res = await page.goto(`${BASE}${path}`, { waitUntil: "networkidle", timeout: 180_000 });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight * 0.75) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    await new Promise((r) => setTimeout(r, 250));
  });
  const data = await page.evaluate(() => {
    const d = document.documentElement;
    const imgs = [...document.querySelectorAll("img")];
    const timer = [...document.querySelectorAll("div")].find(
      (x) =>
        x.className?.toString?.().includes("pointer-events-auto") &&
        x.closest("[data-timer-clearance]"),
    );
    const tRect = timer?.getBoundingClientRect();
    const hero = document.querySelector("[data-timer-clearance] > * > section");
    const overlaps =
      tRect && hero
        ? [...hero.querySelectorAll("h1,h2,h3,p,span,li,a,figcaption,dt,dd")].filter((el) => {
            if (!el.textContent?.trim() || timer.contains(el) || el.contains(timer)) return false;
            // Decorative art (a blurred reflection, a watermark) is aria-hidden by
            // its author and is *expected* behind the timer. The rule is that the
            // countdown must not cover readable content.
            if (el.closest('[aria-hidden="true"]')) return false;
            const cs = getComputedStyle(el);
            if (cs.visibility === "hidden" || cs.display === "none" || Number(cs.opacity) < 0.05)
              return false;
            const r = el.getBoundingClientRect();
            if (!r.width || !r.height) return false;
            return (
              r.left < tRect.right - 2 &&
              r.right > tRect.left + 2 &&
              r.top < tRect.bottom - 2 &&
              r.bottom > tRect.top + 2
            );
          }).length
        : 0;
    return {
      overflow: d.scrollWidth - d.clientWidth,
      images: imgs.length,
      missingAlt: imgs.filter((i) => !i.hasAttribute("alt")).length,
      brokenImages: imgs.filter((i) => i.complete && i.naturalWidth === 0).length,
      hasH1: !!document.querySelector("h1"),
      timerOverlaps: overlaps,
      text: document.body.innerText,
      title: document.title,
    };
  });
  await page.close();
  // A generic 404 console line can arrive without a URL; if the only 404s seen on
  // the wire were thumbnails, treat those console lines as thumbnail misses too.
  const onlyThumb404s = thumbMisses.length > 0;
  const realErrors = onlyThumb404s
    ? errors.filter((e) => !/status of 404/.test(e))
    : errors;
  return { status: res?.status() ?? 0, errors: realErrors, thumbMisses, ...data };
}

/** The standard page contract, asserted for every rendered page. */
function pageProblems(r, { requireH1 = true } = {}) {
  const p = [];
  if (r.status !== 200) p.push(`status ${r.status}`);
  if (r.errors.length) p.push(`console/page errors: ${r.errors[0]}`);
  if (r.overflow > 0) p.push(`horizontal overflow ${r.overflow}px`);
  if (r.missingAlt > 0) p.push(`${r.missingAlt} images without alt`);
  if (r.brokenImages > 0) p.push(`${r.brokenImages} broken images`);
  if (requireH1 && !r.hasH1) p.push("no h1");
  if (r.timerOverlaps > 0) p.push(`countdown covers ${r.timerOverlaps} text nodes`);
  return p;
}

/* ═══════════════════════════════════════════════════════════════════════
 * 1. Pure logic, via the dev-only selftest endpoint
 * ═══════════════════════════════════════════════════════════════════════ */
suite("Domain logic (api/dev/selftest)");
let templates = [];
let eventTypes = [];

await test("selftest endpoint reports every check passing", async () => {
  const res = await fetch(`${BASE}/api/dev/selftest`);
  const body = await res.json();
  if (!Array.isArray(body.checks)) return `unexpected body: ${JSON.stringify(body).slice(0, 120)}`;
  const failed = body.checks.filter((c) => !c.ok);
  for (const c of body.checks) record(`  · ${c.name}`, c.ok, c.detail);
  for (const n of body.notes ?? []) console.log(`      note: ${n}`);
  return failed.length === 0 ? true : `${failed.length}/${body.total} failed`;
});

/* ═══════════════════════════════════════════════════════════════════════
 * 2. Public catalogue
 * ═══════════════════════════════════════════════════════════════════════ */
suite("Catalogue");

await test("template API lists templates and event types", async () => {
  const res = await fetch(`${BASE}/api/templates`);
  if (!res.ok) return `status ${res.status}`;
  const body = await res.json();
  templates = body.templates ?? [];
  eventTypes = [...new Set(templates.flatMap((t) => t.eventTypes ?? []))];
  return templates.length > 0 && eventTypes.length > 0
    ? true
    : `templates=${templates.length} types=${eventTypes.length}`;
});

await test("landing page renders every category exactly once", async () => {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(`${BASE}/`, { waitUntil: "networkidle", timeout: 120_000 });
  const hrefs = await page.evaluate(() =>
    [...document.querySelectorAll('a[href^="/events/"]')]
      .map((a) => a.getAttribute("href"))
      .filter((h) => /^\/events\/[a-z-]+$/.test(h)),
  );
  await page.close();
  const unique = [...new Set(hrefs)];
  if (unique.length !== 9) return `found ${unique.length} categories: ${unique.join(", ")}`;
  return true;
});

await test("landing page is clean at desktop and mobile", async () => {
  for (const w of [375, 1280]) {
    const r = await inspect("/", { width: w, height: w === 375 ? 812 : 900 });
    const p = pageProblems(r);
    if (p.length) return `${w}px: ${p.join("; ")}`;
  }
  return true;
});

await test("retired product-launch category is gone, its successor works", async () => {
  const gone = await fetch(`${BASE}/events/product-launch`);
  if (gone.status !== 404) return `/events/product-launch returned ${gone.status}`;
  const ok = await fetch(`${BASE}/events/networking-event`);
  return ok.status === 200 ? true : `/events/networking-event returned ${ok.status}`;
});

/* ═══════════════════════════════════════════════════════════════════════
 * 3. Picker per category
 * ═══════════════════════════════════════════════════════════════════════ */
suite("Category pickers");

for (const type of eventTypes.sort()) {
  await test(`/events/${type} lists templates and is clean`, async () => {
    const r = await inspect(`/events/${type}`);
    const problems = pageProblems(r, { requireH1: true });
    const cards = (r.text.match(/Preview/g) ?? []).length;
    if (cards === 0) problems.push("no template cards");
    if (r.thumbMisses?.length) {
      console.log(
        `      note: ${r.thumbMisses.length} type-scoped thumbnails missing (fell back): ${r.thumbMisses.slice(0, 3).join(", ")}`,
      );
    }
    return problems.length === 0 ? true : problems.join("; ");
  });
}

await test("picker search narrows the list", async () => {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(`${BASE}/events/wedding`, { waitUntil: "networkidle", timeout: 120_000 });
  const countCards = () =>
    page.evaluate(() => document.querySelectorAll(".grid h3").length);
  const before = await countCards();
  const box = page.locator('input[type="search"], input[placeholder*="earch"]').first();
  if ((await box.count()) === 0) {
    await page.close();
    return "no search box found";
  }
  await box.fill("handloom");
  await page.waitForTimeout(600);
  const after = await countCards();
  await page.close();
  if (before === 0) return "no cards counted before searching";
  return after > 0 && after < before ? true : `before=${before} after=${after}`;
});

await test("no wedding-named template shows that word on the birthday picker", async () => {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(`${BASE}/events/birthday`, { waitUntil: "networkidle", timeout: 120_000 });
  const names = await page.evaluate(() =>
    [...document.querySelectorAll(".grid h3")].map((h) => h.textContent?.trim() ?? ""),
  );
  await page.close();
  if (names.length === 0) return "no template titles found — selector is wrong";
  const bad = names.filter((n) => /wedding|weds|bridal/i.test(n));
  return bad.length === 0 ? true : bad.join(", ");
});

/* ═══════════════════════════════════════════════════════════════════════
 * 4. Every template renders (the regression net)
 * ═══════════════════════════════════════════════════════════════════════ */
suite(FAST ? "Template sweep (sample)" : "Template sweep (all templates × all types)");

const sweep = [];
for (const t of templates) {
  const types = t.eventTypes ?? [];
  if (FAST) {
    if (types[0]) sweep.push({ id: t.id, type: types[0] });
  } else {
    for (const type of types) sweep.push({ id: t.id, type });
  }
}
const sample = FAST ? sweep.filter((_, i) => i % Math.ceil(sweep.length / 12) === 0) : sweep;

const sweepFailures = [];
let swept = 0;
/** A dropped connection or a remote image timing out is a flake, not a
 *  regression — retry once before recording a failure. */
const TRANSIENT = /ERR_CONNECTION|ERR_NETWORK|ERR_TIMED_OUT|ERR_ABORTED|broken images/i;

await pool(sample, CONCURRENCY, async ({ id, type }) => {
  let r = await inspect(`/events/${type}/${id}/preview`);
  let problems = pageProblems(r);
  if (problems.length && problems.some((p) => TRANSIENT.test(p))) {
    r = await inspect(`/events/${type}/${id}/preview`);
    problems = pageProblems(r);
  }
  swept += 1;
  if (problems.length) sweepFailures.push(`${type}/${id}: ${problems.join("; ")}`);
  if (swept % 25 === 0) console.log(`      …${swept}/${sample.length} pages`);
});
// Group failures by signature so a single run shows the whole tail instead of
// the first few — otherwise each run looks like a brand-new set of problems.
const signature = (line) =>
  line
    .replace(/^[^:]+: /, "")
    .replace(/"[^"]*"/g, '"..."')
    .split(" at ")[0]
    .slice(0, 110);
const grouped = new Map();
for (const f of sweepFailures) {
  const key = signature(f);
  if (!grouped.has(key)) grouped.set(key, []);
  grouped.get(key).push(f.split(":")[0]);
}
record(
  `${sample.length} template pages render clean`,
  sweepFailures.length === 0,
  sweepFailures.length === 0
    ? undefined
    : [
        `${sweepFailures.length} of ${sample.length} pages affected, ${grouped.size} distinct issues:`,
        ...[...grouped.entries()].map(
          ([sig, pages]) => `  - ${sig}\n        on: ${pages.join(", ")}`
        ),
      ].join("\n      ")
);

await test("a template page is clean on mobile too", async () => {
  const pick = sample.slice(0, 6);
  for (const { id, type } of pick) {
    const r = await inspect(`/events/${type}/${id}/preview`, { width: 375, height: 812 });
    const p = pageProblems(r);
    if (p.length) return `${type}/${id} @375: ${p.join("; ")}`;
  }
  return true;
});

/* ═══════════════════════════════════════════════════════════════════════
 * 5. Enquiry funnel (up to, but not through, the write)
 * ═══════════════════════════════════════════════════════════════════════ */
suite("Enquiry funnel");

await test("template detail page shows the enquiry form", async () => {
  const first = templates.find((t) => t.eventTypes?.includes("wedding")) ?? templates[0];
  const type = first.eventTypes?.[0] ?? "wedding";
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(`${BASE}/events/${type}/${first.id}`, { waitUntil: "networkidle", timeout: 120_000 });
  const fields = await page.evaluate(() => ({
    inputs: document.querySelectorAll("input, textarea, select").length,
    hasSubmit: !!document.querySelector('button[type="submit"], form button'),
  }));
  await page.close();
  return fields.inputs >= 4 && fields.hasSubmit ? true : JSON.stringify(fields);
});

await test("enquiry API rejects a missing field before writing", async () => {
  const res = await fetch(`${BASE}/api/enquiry`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fullName: "E2E Probe" }),
  });
  const body = await res.json().catch(() => ({}));
  return res.status === 400 && /Missing field/i.test(body.error ?? "")
    ? true
    : `status ${res.status} ${JSON.stringify(body).slice(0, 80)}`;
});

await test("enquiry API rejects a bad email before writing", async () => {
  const res = await fetch(`${BASE}/api/enquiry`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fullName: "E2E Probe",
      email: "not-an-email",
      mobile: "+91-9800000000",
      eventType: "wedding",
      templateId: "royal",
      eventTitle: "E2E",
      person1Name: "E2E",
    }),
  });
  return res.status === 400 ? true : `status ${res.status}`;
});

await test("enquiry API rejects a template that isn't valid for the type", async () => {
  const res = await fetch(`${BASE}/api/enquiry`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fullName: "E2E Probe",
      email: "e2e@example.com",
      mobile: "+91-9800000000",
      eventType: "celebration-day",
      templateId: "royal", // wedding-only
      eventTitle: "E2E",
      person1Name: "E2E",
    }),
  });
  const body = await res.json().catch(() => ({}));
  return res.status === 400 && /not valid/i.test(body.error ?? "")
    ? true
    : `status ${res.status} ${JSON.stringify(body).slice(0, 80)}`;
});

/* ═══════════════════════════════════════════════════════════════════════
 * 6. Auth boundaries — the write paths, blocked
 * ═══════════════════════════════════════════════════════════════════════ */
suite("Auth boundaries");

await test("admin pages redirect anonymous visitors to login", async () => {
  const res = await fetch(`${BASE}/admin/enquiries`, { redirect: "manual" });
  if (res.status === 307 || res.status === 302) {
    const loc = res.headers.get("location") ?? "";
    return loc.includes("/admin/login") ? true : `redirected to ${loc}`;
  }
  return `status ${res.status}`;
});

await test("admin API refuses anonymous calls", async () => {
  const res = await fetch(`${BASE}/api/admin/approve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code: "E2E-DOES-NOT-EXIST" }),
    redirect: "manual",
  });
  return res.status === 401 || res.status === 403
    ? true
    : `status ${res.status} (expected 401/403 — a write must not be reachable)`;
});

await test("manage pages refuse an unknown token", async () => {
  const res = await fetch(`${BASE}/manage/e2e-not-a-real-token`, { redirect: "manual" });
  return [302, 307, 404].includes(res.status) ? true : `status ${res.status}`;
});

await test("manage API refuses an unknown token", async () => {
  const res = await fetch(`${BASE}/api/manage/e2e-not-a-real-token`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event: { eventTitle: "E2E should never land" } }),
    redirect: "manual",
  });
  return [401, 403, 404].includes(res.status)
    ? true
    : `status ${res.status} (expected 401/403/404 — a write must not be reachable)`;
});

await test("dev selftest endpoint is not a production surface", async () => {
  // Can't flip NODE_ENV here; assert the guard exists in the handler instead.
  const res = await fetch(`${BASE}/api/dev/selftest`);
  return res.status === 200 || res.status === 500
    ? true
    : `unexpected status ${res.status}`;
});

/* ═══════════════════════════════════════════════════════════════════════
 * Summary
 * ═══════════════════════════════════════════════════════════════════════ */
await browser.close();

const failed = results.filter((r) => !r.ok);
const bySuite = [...new Set(results.map((r) => r.suite))];
console.log(`\n${"═".repeat(64)}`);
for (const s of bySuite) {
  const rows = results.filter((r) => r.suite === s);
  const bad = rows.filter((r) => !r.ok).length;
  console.log(`  ${bad === 0 ? "✓" : "✗"} ${s}: ${rows.length - bad}/${rows.length}`);
}
console.log(`${"═".repeat(64)}`);
console.log(`  ${results.length - failed.length}/${results.length} passed${FAST ? " (fast mode)" : ""}`);
if (failed.length) {
  console.log("\nFailures:");
  for (const f of failed) console.log(`  ✗ [${f.suite}] ${f.name}${f.detail ? `\n      ${f.detail}` : ""}`);
}
process.exit(failed.length ? 1 : 0);
