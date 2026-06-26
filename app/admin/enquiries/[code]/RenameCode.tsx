"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const SAFE = /^[A-Z0-9-]+$/;

export function RenameCode({ currentCode }: { currentCode: string }) {
  const router = useRouter();
  const [next, setNext] = useState(currentCode);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const normalized = next.trim().toUpperCase();
  const valid = SAFE.test(normalized) && normalized !== currentCode;

  const submit = async () => {
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/rename-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldCode: currentCode, newCode: normalized }),
      });
      const body = await res.json();
      if (!res.ok) {
        setMessage({ kind: "err", text: body.error ?? "Rename failed" });
        return;
      }
      // Navigate to the new detail URL since the route param changed.
      router.replace(`/admin/enquiries/${normalized}`);
      router.refresh();
    } catch {
      setMessage({ kind: "err", text: "Network error." });
    } finally {
      setBusy(false);
      setConfirmOpen(false);
    }
  };

  return (
    <div>
      <p className="text-xs uppercase tracking-widest opacity-60 mb-2">Rename event code</p>
      <div className="flex gap-2">
        <input
          value={next}
          onChange={(e) => setNext(e.target.value)}
          placeholder="WED-2026-0042"
          className="flex-1 rounded-lg border border-black/15 px-3 py-2 text-sm font-mono uppercase focus:outline-none focus:border-black/40"
        />
        <button
          onClick={() => setConfirmOpen(true)}
          disabled={!valid || busy}
          className="text-xs px-4 py-2 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-50"
        >
          Rename
        </button>
      </div>
      <p className="text-[11px] opacity-60 mt-2">
        URL-safe chars only (A–Z, 0–9, dash). Updates Live + Enquiries + SubEvents + Media rows
        in one batch, then revalidates both old and new public URLs.
      </p>
      {!valid && next !== currentCode && (
        <p className="text-[11px] text-amber-700 mt-1">
          Must be uppercase A–Z, digits, or dashes.
        </p>
      )}
      {message && (
        <p className={`text-xs mt-2 ${message.kind === "ok" ? "text-green-700" : "text-red-600"}`}>
          {message.text}
        </p>
      )}

      {confirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => !busy && setConfirmOpen(false)}>
          <div
            className="bg-white rounded-2xl border border-black/10 max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display text-2xl mb-2">Rename this event?</h3>
            <p className="text-sm opacity-80 mb-4">
              <code className="font-mono bg-black/[0.04] px-1 py-0.5 rounded">{currentCode}</code>{" "}
              →{" "}
              <code className="font-mono bg-black/[0.04] px-1 py-0.5 rounded">{normalized}</code>
            </p>
            <ul className="text-sm opacity-80 space-y-1 mb-5 list-disc pl-5">
              <li>The public URL changes to <code className="font-mono">/e/{normalized}</code>. The old URL will 404.</li>
              <li>Existing customer edit links still work — the Access Token isn&apos;t affected.</li>
              <li>If you&apos;ve used the Drive folder for media, you&apos;ll need to rename that folder manually (the Drive ID stays linked via the Media sheet).</li>
            </ul>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setConfirmOpen(false)}
                disabled={busy}
                className="text-xs px-4 py-2 rounded-full border border-black/15 hover:bg-black/5"
              >
                Cancel
              </button>
              <button
                onClick={submit}
                disabled={busy}
                className="text-xs px-4 py-2 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-50"
              >
                {busy ? "Renaming…" : "Yes, rename"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
