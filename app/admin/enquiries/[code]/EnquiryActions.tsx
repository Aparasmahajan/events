"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  code: string;
  currentStatus: string;
  alreadyApproved: boolean;
};

export function EnquiryActions({ code, currentStatus, alreadyApproved }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [canChangeTemplate, setCanChangeTemplate] = useState(true);

  const setStatus = async (status: string) => {
    setBusy(status);
    setError(null);
    try {
      const res = await fetch(`/api/admin/enquiries/${code}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ STATUS: status }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Update failed");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(null);
    }
  };

  const approve = async () => {
    setBusy("approve");
    setError(null);
    try {
      const res = await fetch(`/api/admin/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, canChangeTemplate }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? "Approve failed");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <p className="text-xs uppercase tracking-widest opacity-60 mb-2">Update status</p>
        <div className="flex flex-wrap gap-2">
          {["New", "Contacted", "Not Interested"].map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              disabled={busy === s || currentStatus === s}
              className="text-xs px-3 py-1.5 rounded-full border border-black/15 hover:bg-black/5 disabled:opacity-50"
            >
              {busy === s ? "…" : s}
            </button>
          ))}
        </div>
      </div>

      {!alreadyApproved ? (
        <div className="pt-3 border-t border-black/5 space-y-3">
          <p className="text-xs uppercase tracking-widest opacity-60">Promote to Live</p>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={canChangeTemplate}
              onChange={(e) => setCanChangeTemplate(e.target.checked)}
            />
            Customer can switch template later
          </label>
          <button
            onClick={approve}
            disabled={busy === "approve"}
            className="w-full px-4 py-2.5 rounded-full bg-green-700 text-white text-sm font-medium hover:bg-green-800 transition disabled:opacity-50"
          >
            {busy === "approve" ? "Approving…" : "Approve & generate edit link"}
          </button>
          <p className="text-[11px] opacity-60">
            Copies columns 1–14 to the Live tab, generates a one-off Access Token, and
            surfaces the customer&apos;s edit link below.
          </p>
        </div>
      ) : (
        <div className="pt-3 border-t border-black/5">
          <p className="text-xs uppercase tracking-widest opacity-60 mb-2">Already approved</p>
          <p className="text-sm opacity-80">
            The customer&apos;s edit + live links are shown on the right. Use Rotate token
            (coming soon) if the edit link leaks.
          </p>
        </div>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
