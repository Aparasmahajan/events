"use client";

import { useMemo, useState } from "react";

export type FeaturedGroup = {
  type: string;
  label: string;
  options: { id: string; name: string }[];
};

type SaveState = { kind: "idle" } | { kind: "saving" } | { kind: "ok" } | { kind: "err"; msg: string };

export function FeaturedEditor({
  groups,
  featured,
}: {
  groups: FeaturedGroup[];
  featured: Record<string, string[]>;
}) {
  const [active, setActive] = useState(groups[0]?.type ?? "all");
  // Featured id lists per event type (local draft), seeded from the sheet.
  const [map, setMap] = useState<Record<string, string[]>>(() => {
    const m: Record<string, string[]> = {};
    for (const g of groups) m[g.type] = (featured[g.type] ?? []).filter((id) => g.options.some((o) => o.id === id));
    return m;
  });
  const [save, setSave] = useState<SaveState>({ kind: "idle" });

  const group = groups.find((g) => g.type === active)!;
  const nameOf = useMemo(() => {
    const dict = new Map(group.options.map((o) => [o.id, o.name]));
    return (id: string) => dict.get(id) ?? id;
  }, [group]);

  const featuredIds = map[active] ?? [];
  const available = group.options.filter((o) => !featuredIds.includes(o.id));

  const setFor = (ids: string[]) => setMap((m) => ({ ...m, [active]: ids }));
  const addId = (id: string) => id && setFor([...featuredIds, id]);
  const removeId = (id: string) => setFor(featuredIds.filter((x) => x !== id));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= featuredIds.length) return;
    const next = [...featuredIds];
    [next[i], next[j]] = [next[j], next[i]];
    setFor(next);
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
      setSave({ kind: "ok" });
      setTimeout(() => setSave({ kind: "idle" }), 2500);
    } catch (e) {
      setSave({ kind: "err", msg: e instanceof Error ? e.message : "Save failed" });
    }
  };

  return (
    <div>
      {/* Event-type tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {groups.map((g) => (
          <button
            key={g.type}
            onClick={() => setActive(g.type)}
            className={`text-sm px-3 py-1.5 rounded-full border transition ${
              active === g.type
                ? "bg-neutral-900 text-white border-neutral-900"
                : "bg-white border-black/15 hover:border-black/40"
            }`}
          >
            {g.label}
            {(map[g.type]?.length ?? 0) > 0 && (
              <span className="ml-1.5 opacity-60">({map[g.type].length})</span>
            )}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-8">
        {/* Featured (ordered) */}
        <div>
          <h2 className="text-xs uppercase tracking-[0.3em] opacity-60 mb-3">
            Featured — in order
          </h2>
          {featuredIds.length === 0 ? (
            <p className="text-sm opacity-60">None yet. Add from the right →</p>
          ) : (
            <ol className="space-y-2">
              {featuredIds.map((id, i) => (
                <li
                  key={id}
                  className="flex items-center gap-2 rounded-lg border border-black/10 px-3 py-2 bg-white"
                >
                  <span className="w-5 text-xs opacity-50">{i + 1}</span>
                  <span className="flex-1 text-sm truncate">{nameOf(id)}</span>
                  <button onClick={() => move(i, -1)} disabled={i === 0} className="px-1.5 disabled:opacity-30" title="Up">▲</button>
                  <button onClick={() => move(i, 1)} disabled={i === featuredIds.length - 1} className="px-1.5 disabled:opacity-30" title="Down">▼</button>
                  <button onClick={() => removeId(id)} className="text-red-600 text-xs hover:underline ml-1">Remove</button>
                </li>
              ))}
            </ol>
          )}
        </div>

        {/* Available to add */}
        <div>
          <h2 className="text-xs uppercase tracking-[0.3em] opacity-60 mb-3">
            Add a template ({available.length})
          </h2>
          <div className="flex flex-wrap gap-2">
            {available.map((o) => (
              <button
                key={o.id}
                onClick={() => addId(o.id)}
                className="text-xs px-3 py-1.5 rounded-full border border-black/15 hover:border-black/40 bg-white"
              >
                + {o.name}
              </button>
            ))}
            {available.length === 0 && (
              <p className="text-sm opacity-60">Every template here is featured.</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-3">
        <button
          onClick={persist}
          disabled={save.kind === "saving"}
          className="px-6 py-2.5 rounded-full bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 disabled:opacity-50"
        >
          {save.kind === "saving" ? "Saving…" : `Save “${group.label}”`}
        </button>
        {save.kind === "ok" && <span className="text-sm text-green-700">Saved ✓</span>}
        {save.kind === "err" && <span className="text-sm text-red-600">{save.msg}</span>}
      </div>

      <p className="mt-6 text-[11px] opacity-60 leading-snug">
        Saves to the <strong>Featured</strong> sheet tab (columns: Event Type · Template ID ·
        Rank). Listings pick it up within ~2 minutes (ISR). Templates not listed here fall
        back to alphabetical after the featured ones.
      </p>
    </div>
  );
}
