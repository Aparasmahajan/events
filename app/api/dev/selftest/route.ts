import { NextResponse } from "next/server";
import { CELEBRATION_DAYS, EVENT_TYPES, getEventTypeConfig } from "@/config/eventTypes";
import {
  TEMPLATES_META,
  getTemplatesForEventType,
  templateLabelForType,
  TAG_LABELS,
} from "@/components/templates/metadata";
import { rebaseStarterSubEvents } from "@/lib/sheets";
import { celebrationDayCopy } from "@/lib/celebrationDay";
import { generateEventCode, isValidEventCode } from "@/lib/eventCode";
import { DEMO_EVENTS, getDemoCodeForTemplate } from "@/lib/dummyData";
import { PHOTO_FRAME_TEMPLATES } from "@/lib/types";
import type { EventType, SubEvent } from "@/lib/types";

/**
 * Dev-only assertions over the pure logic the E2E suite can't reach through the
 * UI: metadata invariants, starter-date rebasing, per-day copy, type-aware
 * labels, event codes and the demo registry.
 *
 * Consumed by `npm run e2e` (scripts/e2e.mjs). Returns 404 in production so it
 * is never a public surface.
 */

export const dynamic = "force-dynamic";

type Check = { name: string; ok: boolean; detail?: string };

function run(): Check[] {
  const out: Check[] = [];
  const check = (name: string, fn: () => true | string) => {
    try {
      const r = fn();
      out.push(r === true ? { name, ok: true } : { name, ok: false, detail: r });
    } catch (e) {
      out.push({ name, ok: false, detail: e instanceof Error ? e.message : String(e) });
    }
  };

  /* ── categories ──────────────────────────────────────────────────── */
  check("exactly 9 event categories", () =>
    EVENT_TYPES.length === 9 ? true : `found ${EVENT_TYPES.length}`);

  check("category ids and code prefixes are unique", () => {
    const ids = new Set<string>();
    const prefixes = new Set<string>();
    for (const t of EVENT_TYPES) {
      if (ids.has(t.id)) return `duplicate id ${t.id}`;
      if (prefixes.has(t.codePrefix)) return `duplicate prefix ${t.codePrefix}`;
      ids.add(t.id);
      prefixes.add(t.codePrefix);
    }
    return true;
  });

  check("product-launch is retired but still resolves", () => {
    const offered = EVENT_TYPES.some((t) => t.id === ("product-launch" as EventType));
    if (offered) return "still offered as its own category";
    const cfg = getEventTypeConfig("product-launch" as EventType);
    return cfg.id === "networking-event" ? true : `resolved to ${cfg.id}`;
  });

  check("every category has at least one template", () => {
    const empty = EVENT_TYPES.filter((t) => getTemplatesForEventType(t.id).length === 0);
    return empty.length === 0 ? true : `no templates for: ${empty.map((t) => t.id).join(", ")}`;
  });

  check("celebration-day offers 3+ templates", () => {
    const n = getTemplatesForEventType("celebration-day").length;
    return n >= 3 ? true : `only ${n}`;
  });

  /* ── template metadata invariants ────────────────────────────────── */
  check("template ids are unique", () => {
    const seen = new Set<string>();
    for (const t of TEMPLATES_META) {
      if (seen.has(t.id)) return `duplicate ${t.id}`;
      seen.add(t.id);
    }
    return true;
  });

  check("every template tag is a known TemplateTag", () => {
    const known = new Set(Object.keys(TAG_LABELS));
    const bad = TEMPLATES_META.flatMap((t) =>
      t.tags.filter((g) => !known.has(g)).map((g) => `${t.id}:${g}`));
    return bad.length === 0 ? true : bad.join(", ");
  });

  check("every template lists valid, non-empty event types", () => {
    const valid = new Set<string>(EVENT_TYPES.map((t) => t.id));
    const bad = TEMPLATES_META.filter(
      (t) => t.eventTypes.length === 0 || t.eventTypes.some((e) => !valid.has(e)));
    return bad.length === 0 ? true : bad.map((t) => t.id).join(", ");
  });

  check("every template has a preview image and defaults", () => {
    const bad = TEMPLATES_META.filter(
      (t) => !t.previewImage || !t.defaults?.accentColor || !t.defaults?.tagline);
    return bad.length === 0 ? true : bad.map((t) => t.id).join(", ");
  });

  // Not every template owns a DEMO-<ID> bundle: a few flagships render from the
  // shared per-type demo instead, which is legitimate. What must hold is that a
  // registered code always resolves. The unbundled ones are reported as a note.
  check("every registered demo code resolves to a bundle", () => {
    const bad = TEMPLATES_META.map((t) => getDemoCodeForTemplate(t.id))
      .filter((code): code is string => !!code)
      .filter((code) => !DEMO_EVENTS[code]);
    return bad.length === 0 ? true : bad.join(", ");
  });

  check("every demo bundle's templateId matches its registration", () => {
    const bad = Object.entries(DEMO_EVENTS).filter(
      ([code, b]) => getDemoCodeForTemplate(b.event.templateId) !== code);
    return bad.length === 0 ? true : bad.map(([c]) => c).join(", ");
  });

  check("demo sub-events all point at their own event code", () => {
    const bad = Object.entries(DEMO_EVENTS).filter(([code, b]) =>
      b.subEvents.some((s) => s.eventCode !== code));
    return bad.length === 0 ? true : bad.map(([c]) => c).join(", ");
  });

  /* ── type-aware labels ──────────────────────────────────────────── */
  check("a wedding-named template is renamed for a birthday", () => {
    const pastel = TEMPLATES_META.find((t) => t.id === "pastel");
    if (!pastel) return "pastel missing";
    if (!pastel.eventTypes.includes("birthday")) return true; // no longer offered there
    const shown = templateLabelForType(pastel, "birthday");
    return shown !== pastel.name ? true : `still "${shown}"`;
  });

  check("no template shows a mismatched occasion word in any category", () => {
    const words: Record<string, EventType> = {
      wedding: "wedding",
      birthday: "birthday",
      anniversary: "anniversary",
      engagement: "engagement",
    };
    const bad: string[] = [];
    for (const t of EVENT_TYPES) {
      for (const m of getTemplatesForEventType(t.id)) {
        const label = templateLabelForType(m, t.id);
        for (const [w, owner] of Object.entries(words)) {
          if (label.toLowerCase().includes(w) && owner !== t.id) {
            bad.push(`${t.id}/${m.id}:"${label}"`);
          }
        }
      }
    }
    return bad.length === 0 ? true : bad.slice(0, 4).join(", ");
  });

  check("'Party' in a name survives on birthday pages", () => {
    const ludo = TEMPLATES_META.find((t) => t.id === "ludo");
    if (!ludo) return true;
    return templateLabelForType(ludo, "birthday") === ludo.name
      ? true
      : "renamed unnecessarily";
  });

  /* ── celebration-day copy ───────────────────────────────────────── */
  check("every celebration day has its own greeting", () => {
    const generic = celebrationDayCopy(undefined).greeting;
    const bad = CELEBRATION_DAYS.filter((d) => celebrationDayCopy(d).greeting === generic);
    return bad.length === 0 ? true : bad.join(", ");
  });

  check("unknown subtype falls back instead of throwing", () =>
    celebrationDayCopy("Nonsense Day").greeting.length > 0 ? true : "empty greeting");

  /* ── starter schedule dates ─────────────────────────────────────── */
  const subs = (dates: string[]): SubEvent[] =>
    dates.map((d, i) => ({ eventCode: "X", order: i + 1, name: `s${i}`, date: d }));

  check("single-day starter lands on the event date", () => {
    const out = rebaseStarterSubEvents(subs(["2026-08-04", "2026-08-04"]), "2026-08-04", "2027-01-20");
    return out.every((s) => s.date === "2027-01-20") ? true : JSON.stringify(out.map((s) => s.date));
  });

  check("multi-day starter keeps its offsets around the event date", () => {
    const out = rebaseStarterSubEvents(
      subs(["2027-03-04", "2027-03-05", "2027-03-06", "2027-03-07"]),
      "2027-03-06",
      "2027-09-15",
    );
    const got = out.map((s) => s.date).join(",");
    return got === "2027-09-13,2027-09-14,2027-09-15,2027-09-16" ? true : got;
  });

  check("no event date anchors the starter in the future", () => {
    const out = rebaseStarterSubEvents(subs(["2020-01-01"]), "2020-01-01", undefined);
    const t = Date.parse(`${out[0].date}T00:00:00Z`);
    return t > Date.now() ? true : `got ${out[0].date}`;
  });

  check("undated starter rows stay undated", () => {
    const out = rebaseStarterSubEvents(
      [{ eventCode: "X", order: 1, name: "a" }, { eventCode: "X", order: 2, name: "b", date: "2026-08-04" }],
      "2026-08-04",
      "2027-01-20",
    );
    return out[0].date === undefined && out[1].date === "2027-01-20" ? true : JSON.stringify(out);
  });

  check("no demo bundle still carries another demo's dates", () => {
    // Every demo's sub-event dates should sit within a month of its own main date.
    const bad = Object.values(DEMO_EVENTS).filter((b) => {
      const main = b.event.mainDate ? Date.parse(`${b.event.mainDate}T00:00:00Z`) : null;
      if (!main) return false;
      return b.subEvents.some((s) => {
        if (!s.date) return false;
        const t = Date.parse(`${s.date}T00:00:00Z`);
        return Math.abs(t - main) > 45 * 86_400_000;
      });
    });
    return bad.length === 0 ? true : bad.map((b) => b.event.eventCode).join(", ");
  });

  /* ── event codes ────────────────────────────────────────────────── */
  check("event codes generate in the documented shape", () => {
    const code = generateEventCode("celebration-day", 7, 2027);
    return code === "DAY-2027-0007" && isValidEventCode(code) ? true : code;
  });

  check("every category generates a valid code", () => {
    const bad = EVENT_TYPES.filter((t) => !isValidEventCode(generateEventCode(t.id, 1, 2027)));
    return bad.length === 0 ? true : bad.map((t) => t.id).join(", ");
  });

  /* ── photo frame ────────────────────────────────────────────────── */
  check("photo-frame templates exist and offer a no-frame option", () => {
    const bad = Object.entries(PHOTO_FRAME_TEMPLATES).filter(
      ([id, opts]) =>
        !TEMPLATES_META.some((t) => t.id === id) || !opts.some((o) => o.key === "none"));
    return bad.length === 0 ? true : bad.map(([id]) => id).join(", ");
  });

  return out;
}

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const checks = run();
  const failed = checks.filter((c) => !c.ok);
  // Informational, not a failure: templates that ride on the shared per-type
  // demo rather than owning a DEMO-<ID> bundle. Fine today — worth closing if
  // anything ever links to /e/DEMO-<ID> for them.
  const withoutOwnDemo = TEMPLATES_META.filter((t) => !getDemoCodeForTemplate(t.id)).map(
    (t) => t.id,
  );
  return NextResponse.json(
    {
      ok: failed.length === 0,
      total: checks.length,
      failed: failed.length,
      checks,
      notes: withoutOwnDemo.length
        ? [`${withoutOwnDemo.length} templates have no dedicated demo bundle: ${withoutOwnDemo.join(", ")}`]
        : [],
    },
    { status: failed.length === 0 ? 200 : 500 },
  );
}
