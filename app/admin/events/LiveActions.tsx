"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = { code: string; active: boolean };

export function LiveActions({ code, active }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const toggle = async () => {
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/admin/active", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, active: !active }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? "Failed");
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <span className="inline-flex items-center gap-2">
      <button
        onClick={toggle}
        disabled={busy}
        className={`text-xs px-3 py-1.5 rounded-full font-medium transition disabled:opacity-50 ${
          active
            ? "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
            : "bg-green-700 text-white hover:bg-green-800"
        }`}
      >
        {busy ? "…" : active ? "Stop" : "Resume"}
      </button>
      {err && <span className="text-[11px] text-red-600">{err}</span>}
    </span>
  );
}
