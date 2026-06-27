"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/enquiries", label: "Enquiries" },
  { href: "/admin/events", label: "Live events" },
];

export function AdminShell({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const logout = async () => {
    setBusy(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b border-black/10">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center gap-6">
          <Link href="/admin" className="font-display text-lg">
            Event Platform · Admin
          </Link>
          <nav className="hidden sm:flex gap-4 text-sm flex-1">
            {NAV.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/admin" && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-full transition ${
                    active
                      ? "bg-neutral-900 text-white"
                      : "text-neutral-700 hover:bg-black/5"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden sm:inline opacity-70">{email}</span>
            <button
              onClick={logout}
              disabled={busy}
              className="text-xs px-3 py-1.5 rounded-full border border-black/15 hover:bg-black/5 disabled:opacity-50"
            >
              {busy ? "…" : "Sign out"}
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-10">{children}</main>
    </div>
  );
}
