"use client";

import { useMemo, useState } from "react";

export type FeaturedOption = {
  id: string;
  name: string;
  /** Canonical public route for this template within this group. */
  path: string;
  /** Every event type this template supports — used to resolve pasted paths. */
  types: string[];
};

export type FeaturedGroup = {
  type: string;
  label: string;
  options: FeaturedOption[];
};

type SaveState = { kind: "idle" } | { kind: "saving" } | { kind: "ok" } | { kind: "err"; msg: string };

/** Normalise "how did they type it" into { type, id, text }.
 *  Accepts a bare name or id ("Woven Vows", "loom"), a context path
 *  ("/events/wedding/loom", "events/wedding/loom/preview") or a full URL. */
function parseRef(raw: string): { type?: string; id?: string; text: string } {
  const text = raw.trim();
  if (!text) return { text };
  let candidate = text;
  try {
    if (/^https?:\/\//i.test(text)) candidate = new URL(text).pathname;
  } catch {
    /* not a URL — fall through and treat it as a path or a name */
  }
  const segments = candidate.split("?")[0].split("#")[0].split("/").filter(Boolean);
  const at = segments.indexOf("events");
  if (at !== -1 && segments[at + 1]) {
    return { type: segments[at + 1], id: segments[at + 2], text };
  }
  return { text };
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

export function FeaturedEditor({
  groups,
  featured,
}: {
  groups: FeaturedGroup[];
  featured: Record<string, string[]>;
}) {
  const [active, setActive] = useState(groups[0]?.type ?? "all");
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);

  // Featured id lists per event type (local draft), seeded from the sheet.
  const seed = () => {
    const m: Record<string, string[]> = {};
    for (const g of groups) {
      m[g.type] = (featured[g.type] ?? []).filter((id) => g.options.some((o) => o.id === id));
    }
    return m;
  };
  const [map, setMap] = useState<Record<string, string[]>>(seed);
  // What is currently in the sheet — the comparison point for "unsaved".
  const [baseline, setBaseline] = useState<Record<string, string[]>>(seed);
  const [save, setSave] = useState<SaveState>({ kind: "idle" });

  const group = groups.find((g) => g.type === active) ?? groups[0];
  const optionOf = useMemo(() => {
    const dict = new Map(group.options.map((o) => [o.id, o]));
    return (id: string) => dict.get(id);
  }, [group]);

  const featuredIds = map[active] ?? [];
  const available = group.options.filter((o) => !featuredIds.includes(o.id));

  // Search matches the display name, the id, AND the context path, so an admin
  // can paste "/events/wedding/loom" straight out of the browser bar.
  const matches = useMemo(() => {
    const parsed = parseRef(query);
    const needle = norm(parsed.id ?? parsed.text);
    if (!needle) return available;
    return available.filter(
      (o) => norm(o.name).includes(needle) || norm(o.id).includes(needle) || norm(o.path).includes(needle),
    );
  }, [available, query]);

  // Nothing in this tab? The template may simply belong to another event type.
  // Offer it there rather than reporting a dead end.
  const elsewhere = useMemo(() => {
    const parsed = parseRef(query);
    const needle = norm(parsed.id ?? parsed.text);
    if (!needle || matches.length > 0) return [];
    const out: { group: FeaturedGroup; opt: FeaturedOption }[] = [];
    for (const g of groups) {
      if (g.type === active) continue;
      for (const o of g.options) {
        if (norm(o.name).includes(needle) || norm(o.id).includes(needle) || norm(o.path).includes(needle)) {
          out.push({ group: g, opt: o });
        }
        if (out.length >= 6) return out;
      }
    }
    return out;
  }, [groups, active, query, matches.length]);

  const dirty = (type: string) =>
    (map[type] ?? []).join("|") !== (baseline[type] ?? []).join("|");
  const otherDirty = groups.filter((g) => g.type !== active && dirty(g.type));

  const setFor = (type: string, ids: string[]) => setMap((m) => ({ ...m, [type]: ids }));
  /** Add to a specific tab (and switch to it) — used by path pastes and by the
   *  "available under another event type" suggestions. */
  const addTo = (target: FeaturedGroup, opt: FeaturedOption) => {
    const existing = map[target.type] ?? [];
    setActive(target.type);
    setQuery("");
    if (existing.includes(opt.id)) {
      setNotice({ kind: "ok", msg: `${opt.name} is already featured in ${target.label}.` });
      return;
    }
    setFor(target.type, [...existing, opt.id]);
    setNotice({ kind: "ok", msg: `Added ${opt.name} to ${target.label}.` });
  };
  const addId = (id: string) => {
    if (!id || featuredIds.includes(id)) return;
    setFor(active, [...featuredIds, id]);
    setQuery("");
    setNotice(null);
  };
  const removeId = (id: string) => setFor(active, featuredIds.filter((x) => x !== id));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= featuredIds.length) return;
    const next = [...featuredIds];
    [next[i], next[j]] = [next[j], next[i]];
    setFor(active, next);
  };

  /** Enter in the search box: resolve name-or-path to exactly one template. */
  const addFromQuery = () => {
    const parsed = parseRef(query);
    if (!parsed.text) return;

    // A pasted context path names its own event type — honour it, switching tabs.
    if (parsed.type && parsed.id) {
      const target = groups.find((g) => g.type === parsed.type);
      if (!target) {
        setNotice({ kind: "err", msg: `No tab for event type "${parsed.type}".` });
        return;
      }
      const opt = target.options.find((o) => o.id === parsed.id);
      if (!opt) {
        setNotice({ kind: "err", msg: `"${parsed.id}" isn't available for ${target.label}.` });
        return;
      }
      addTo(target, opt);
      return;
    }

    // Otherwise resolve within the current tab: exact id, exact name, then a
    // single fuzzy hit.
    const needle = norm(parsed.text);
    const exact =
      available.find((o) => norm(o.id) === needle) ?? available.find((o) => norm(o.name) === needle);
    if (exact) {
      addId(exact.id);
      setNotice({ kind: "ok", msg: `Added ${exact.name}.` });
      return;
    }
    if (matches.length === 1) {
      addId(matches[0].id);
      setNotice({ kind: "ok", msg: `Added ${matches[0].name}.` });
      return;
    }
    if (elsewhere.length === 1) {
      addTo(elsewhere[0].group, elsewhere[0].opt);
      return;
    }
    setNotice({
      kind: "err",
      msg: matches.length
        ? `${matches.length} templates match — pick one below.`
        : elsewhere.length
          ? "Not available for this event type — see the suggestions below."
          : "No template matches that name or path.",
    });
  };

  const persist = async () => {
    setSave({ kind: "saving" });
    try {
      const res = await fetch("/api/admin/featured", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventType: active, templateIds: featuredIds }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? "Save failed");
      setBaseline((b) => ({ ...b, [active]: [...featuredIds] }));
      setSave({ kind: "ok" });
      setTimeout(() => setSave({ kind: "idle" }), 2500);
    } catch (e) {
      setSave({ kind: "err", msg: e instanceof Error ? e.message : "Save failed" });
    }
  };

  return (
    <div className="pb-36 sm:pb-0">
      {/* ── Group picker: a select on phones, chips from sm up ───────── */}
      <div className="mb-5 sm:mb-6">
        <label className="sm:hidden">
          <span className="mb-1.5 block text-[11px] uppercase tracking-[0.24em] opacity-60">
            Editing
          </span>
          <select
            value={active}
            onChange={(e) => {
              setActive(e.target.value);
              setNotice(null);
            }}
            className="w-full rounded-lg border border-black/15 bg-white px-3 py-2.5 text-sm"
          >
            {groups.map((g) => (
              <option key={g.type} value={g.type}>
                {g.label}
                {(map[g.type]?.length ?? 0) > 0 ? ` (${map[g.type].length})` : ""}
                {dirty(g.type) ? " • unsaved" : ""}
              </option>
            ))}
          </select>
        </label>

        <div className="hidden flex-wrap gap-2 sm:flex">
          {groups.map((g) => (
            <button
              key={g.type}
              onClick={() => {
                setActive(g.type);
                setNotice(null);
              }}
              aria-pressed={active === g.type}
              className={`rounded-full border px-3 py-1.5 text-sm transition ${
                active === g.type
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-black/15 bg-white hover:border-black/40"
              }`}
            >
              {g.label}
              {(map[g.type]?.length ?? 0) > 0 && (
                <span className="ml-1.5 opacity-60">({map[g.type].length})</span>
              )}
              {dirty(g.type) && (
                <span
                  className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-amber-500 align-middle"
                  title="Unsaved changes"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* ── Featured (ordered) ─────────────────────────────────────── */}
        <section>
          <h2 className="mb-3 text-xs uppercase tracking-[0.3em] opacity-60">Featured — in order</h2>
          {featuredIds.length === 0 ? (
            <p className="text-sm opacity-60">
              None yet — add one from <span className="lg:hidden">below</span>
              <span className="hidden lg:inline">the right</span>.
            </p>
          ) : (
            <ol className="space-y-2">
              {featuredIds.map((id, i) => {
                const opt = optionOf(id);
                return (
                  <li
                    key={id}
                    className="flex flex-wrap items-center gap-x-2 gap-y-2 rounded-lg border border-black/10 bg-white px-3 py-2 sm:flex-nowrap"
                  >
                    <span className="w-5 shrink-0 text-xs opacity-50">{i + 1}</span>
                    <span className="min-w-0 flex-1 basis-full sm:basis-auto">
                      <span className="block truncate text-sm">{opt?.name ?? id}</span>
                      <span className="block truncate font-mono text-[10px] opacity-50">
                        {opt?.path ?? id}
                      </span>
                    </span>
                    <span className="ml-auto flex shrink-0 items-center gap-1">
                      <button
                        onClick={() => move(i, -1)}
                        disabled={i === 0}
                        aria-label={`Move ${opt?.name ?? id} up`}
                        className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-black/5 disabled:opacity-30"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => move(i, 1)}
                        disabled={i === featuredIds.length - 1}
                        aria-label={`Move ${opt?.name ?? id} down`}
                        className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-black/5 disabled:opacity-30"
                      >
                        ▼
                      </button>
                      <button
                        onClick={() => removeId(id)}
                        aria-label={`Remove ${opt?.name ?? id}`}
                        className="flex h-9 items-center rounded-md px-2 text-xs text-red-600 hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </span>
                  </li>
                );
              })}
            </ol>
          )}
        </section>

        {/* ── Add: by name or by context path ────────────────────────── */}
        <section>
          <h2 className="mb-3 text-xs uppercase tracking-[0.3em] opacity-60">
            Add a template ({available.length})
          </h2>

          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setNotice(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addFromQuery();
                }
              }}
              placeholder="Name, id, or /events/wedding/loom"
              aria-label="Find a template by name, id or context path"
              className="min-w-0 flex-1 rounded-lg border border-black/15 bg-white px-3 py-2.5 text-sm focus:border-black/40 focus:outline-none"
            />
            <button
              onClick={addFromQuery}
              disabled={!query.trim()}
              className="rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-40"
            >
              Add
            </button>
          </div>
          <p className="mt-2 text-[11px] leading-snug opacity-60">
            Paste a page path and the matching tab is selected for you — e.g.{" "}
            <code className="font-mono">/events/birthday/matchday</code> adds Match Day under
            Birthday.
          </p>
          {notice && (
            <p
              role="status"
              className={`mt-2 text-xs ${notice.kind === "ok" ? "text-green-700" : "text-red-600"}`}
            >
              {notice.msg}
            </p>
          )}

          <div className="mt-4 max-h-[22rem] space-y-1.5 overflow-y-auto pr-1 sm:grid sm:grid-cols-2 sm:gap-1.5 sm:space-y-0 lg:grid-cols-1">
            {matches.map((o) => (
              <button
                key={o.id}
                onClick={() => addId(o.id)}
                className="flex w-full items-baseline gap-2 rounded-lg border border-black/10 bg-white px-3 py-2 text-left hover:border-black/40"
              >
                <span className="shrink-0 text-xs opacity-50">+</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm">{o.name}</span>
                  <span className="block truncate font-mono text-[10px] opacity-50">{o.path}</span>
                </span>
              </button>
            ))}
            {matches.length === 0 && (
              <p className="text-sm opacity-60">
                {available.length === 0
                  ? "Every template here is featured."
                  : "Nothing matches that name or path in this tab."}
              </p>
            )}
          </div>

          {elsewhere.length > 0 && (
            <div className="mt-4 rounded-lg border border-black/10 bg-black/[0.02] p-3">
              <p className="mb-2 text-[11px] uppercase tracking-[0.24em] opacity-60">
                Available under another event type
              </p>
              <ul className="space-y-1.5">
                {elsewhere.map(({ group: g, opt }) => (
                  <li key={`${g.type}-${opt.id}`}>
                    <button
                      onClick={() => addTo(g, opt)}
                      className="flex w-full items-baseline gap-2 rounded-md px-2 py-1.5 text-left hover:bg-black/5"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm">{opt.name}</span>
                        <span className="block truncate font-mono text-[10px] opacity-50">
                          {opt.path}
                        </span>
                      </span>
                      <span className="shrink-0 text-xs opacity-70">{g.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>

      {/* ── Save bar: sticky on phones, inline from sm up ───────────── */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-black/10 bg-white/95 px-4 py-3 backdrop-blur sm:static sm:mt-8 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-3">
          <button
            onClick={persist}
            disabled={save.kind === "saving"}
            className="w-full rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50 sm:w-auto sm:py-2.5"
          >
            {save.kind === "saving" ? "Saving…" : `Save “${group.label}”`}
          </button>
          {save.kind === "ok" && <span className="text-sm text-green-700">Saved ✓</span>}
          {save.kind === "err" && <span className="text-sm text-red-600">{save.msg}</span>}
          {otherDirty.length > 0 && (
            <span className="text-[11px] leading-snug opacity-70">
              {otherDirty.length} other tab{otherDirty.length > 1 ? "s" : ""} still unsaved — each
              tab saves on its own.
            </span>
          )}
        </div>
      </div>

      <p className="mt-6 text-[11px] leading-snug opacity-60">
        Saves to the <strong>Featured</strong> sheet tab (columns: Event Type · Template ID ·
        Rank). Listings pick it up within ~2 minutes (ISR). Templates not listed here fall back to
        alphabetical after the featured ones.
      </p>
    </div>
  );
}
