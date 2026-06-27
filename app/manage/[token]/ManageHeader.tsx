"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = { eventCode: string; publicHref: string; token: string };

export function ManageHeader({ eventCode, publicHref, token }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const logout = async () => {
    setBusy(true);
    try {
      await fetch(`/api/manage/${token}/logout`, { method: "POST" });
      router.push(`/manage/${token}/login`);
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed top-0 inset-x-0 z-[70] bg-neutral-900 text-white text-sm">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 truncate">
          <span className="px-2 py-0.5 rounded-full bg-white/15 text-[10px] uppercase tracking-widest">
            Edit mode
          </span>
          <span className="truncate opacity-80">{eventCode}</span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={publicHref}
            target="_blank"
            rel="noreferrer"
            className="text-xs px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 transition"
          >
            View live ↗
          </a>
          <button
            onClick={logout}
            disabled={busy}
            className="text-xs px-3 py-1.5 rounded-full bg-white text-neutral-900 hover:bg-neutral-200 transition disabled:opacity-50"
          >
            {busy ? "…" : "Sign out"}
          </button>
        </div>
      </div>
    </div>
  );
}
