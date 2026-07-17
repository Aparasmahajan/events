import Link from "next/link";
import { readAdminSession } from "@/lib/auth";
import { listEnquiries } from "@/lib/sheets";
import { AdminShell } from "../AdminShell";
import { StatusPill } from "../page";

export const dynamic = "force-dynamic";

type SortKey = "code" | "name" | "email" | "phone" | "type" | "submitted" | "status";
type SortDir = "asc" | "desc";

const SORT_ACCESSORS: Record<SortKey, (e: Awaited<ReturnType<typeof listEnquiries>>[number]) => string> = {
  code: (e) => e.eventCode ?? "",
  name: (e) => (e.fullName ?? "").toLowerCase(),
  email: (e) => (e.email ?? "").toLowerCase(),
  phone: (e) => (e.mobile ?? "").replace(/\D/g, ""),
  type: (e) => e.eventType ?? "",
  submitted: (e) => e.submittedAt ?? "",
  status: (e) => e.status || "New",
};

export default async function EnquiriesPage({
  searchParams,
}: {
  searchParams?: { status?: string; q?: string; sort?: string; dir?: string };
}) {
  const session = readAdminSession();
  const all = await listEnquiries();
  const statusFilter = searchParams?.status;
  const q = (searchParams?.q ?? "").trim().toLowerCase();
  const sortKey: SortKey =
    (["code", "name", "email", "phone", "type", "submitted", "status"] as const).find(
      (k) => k === searchParams?.sort,
    ) ?? "submitted";
  const sortDir: SortDir = searchParams?.dir === "asc" ? "asc" : "desc";

  const filtered = all.filter((e) => {
    if (statusFilter && (e.status || "New") !== statusFilter) return false;
    if (q) {
      const hay = [e.eventCode, e.fullName, e.email, e.mobile, e.eventTitle, e.city]
        .join(" ")
        .toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  const accessor = SORT_ACCESSORS[sortKey];
  const sorted = [...filtered].sort((a, b) => {
    const av = accessor(a);
    const bv = accessor(b);
    // Empty values always trail regardless of direction — otherwise blank
    // phone/name rows crowd the top of an ascending sort.
    if (!av && bv) return 1;
    if (av && !bv) return -1;
    const cmp = av < bv ? -1 : av > bv ? 1 : 0;
    return sortDir === "asc" ? cmp : -cmp;
  });

  const baseParams = new URLSearchParams();
  if (statusFilter) baseParams.set("status", statusFilter);
  if (q) baseParams.set("q", q);
  const sortHref = (key: SortKey) => {
    const nextDir: SortDir = sortKey === key && sortDir === "asc" ? "desc" : "asc";
    const p = new URLSearchParams(baseParams);
    p.set("sort", key);
    p.set("dir", nextDir);
    return `/admin/enquiries?${p.toString()}`;
  };
  const arrow = (key: SortKey) =>
    sortKey === key ? (sortDir === "asc" ? "↑" : "↓") : "";

  return (
    <AdminShell email={session?.email ?? ""}>
      <div className="flex items-end justify-between mb-6 gap-4 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] opacity-60 mb-2">CRM</p>
          <h1 className="font-display text-4xl">Enquiries</h1>
        </div>
        <form className="flex items-center gap-2">
          {statusFilter && (
            <input type="hidden" name="status" value={statusFilter} />
          )}
          {searchParams?.sort && (
            <input type="hidden" name="sort" value={searchParams.sort} />
          )}
          {searchParams?.dir && (
            <input type="hidden" name="dir" value={searchParams.dir} />
          )}
          <input
            name="q"
            defaultValue={q}
            placeholder="Search name, code, email, phone…"
            className="rounded-full border border-black/15 px-4 py-2 text-sm focus:outline-none focus:border-black/40 w-64"
          />
          <button className="text-sm px-4 py-2 rounded-full bg-neutral-900 text-white">Search</button>
        </form>
      </div>

      <div className="flex flex-wrap gap-2 mb-6 text-xs">
        <FilterPill href="/admin/enquiries" active={!statusFilter}>All</FilterPill>
        {["New", "Contacted", "Approved", "Not Interested"].map((s) => (
          <FilterPill
            key={s}
            href={`/admin/enquiries?status=${encodeURIComponent(s)}`}
            active={statusFilter === s}
          >
            {s}
          </FilterPill>
        ))}
      </div>

      {sorted.length === 0 ? (
        <div className="bg-white rounded-2xl border border-black/10 p-12 text-center opacity-70">
          <p>No enquiries match.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-black/10 overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-black/[0.03] text-left">
              <tr>
                <SortableTh href={sortHref("code")} active={sortKey === "code"}>Code {arrow("code")}</SortableTh>
                <SortableTh href={sortHref("name")} active={sortKey === "name"}>Name {arrow("name")}</SortableTh>
                <SortableTh href={sortHref("email")} active={sortKey === "email"}>Email {arrow("email")}</SortableTh>
                <SortableTh href={sortHref("phone")} active={sortKey === "phone"}>Phone {arrow("phone")}</SortableTh>
                <SortableTh href={sortHref("type")} active={sortKey === "type"}>Type {arrow("type")}</SortableTh>
                <SortableTh href={sortHref("submitted")} active={sortKey === "submitted"}>Submitted {arrow("submitted")}</SortableTh>
                <SortableTh href={sortHref("status")} active={sortKey === "status"}>Status {arrow("status")}</SortableTh>
              </tr>
            </thead>
            <tbody>
              {sorted.map((e) => (
                <tr key={e.eventCode} className="border-t border-black/5 hover:bg-black/[0.02]">
                  <Td>
                    <Link href={`/admin/enquiries/${e.eventCode}`} className="font-mono text-xs underline">
                      {e.eventCode}
                    </Link>
                  </Td>
                  <Td>{e.fullName}</Td>
                  <Td className="text-xs opacity-80">{e.email}</Td>
                  <Td className="text-xs opacity-80 whitespace-nowrap">
                    {e.mobile ? (
                      <a href={`tel:${e.mobile.replace(/\s+/g, "")}`} className="hover:underline">
                        {e.mobile}
                      </a>
                    ) : (
                      <span className="opacity-40">—</span>
                    )}
                  </Td>
                  <Td className="capitalize">{e.eventType}</Td>
                  <Td className="text-xs opacity-70 whitespace-nowrap">{e.submittedAt?.slice(0, 10)}</Td>
                  <Td><StatusPill status={e.status || "New"} /></Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}

function FilterPill({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`px-3 py-1.5 rounded-full border transition ${
        active
          ? "bg-neutral-900 text-white border-neutral-900"
          : "bg-white border-black/15 hover:border-black/40"
      }`}
    >
      {children}
    </Link>
  );
}

function SortableTh({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <th className="px-4 py-2.5 text-xs uppercase tracking-widest font-medium">
      <Link
        href={href}
        className={`inline-flex items-center gap-1 transition ${
          active ? "opacity-100" : "opacity-60 hover:opacity-100"
        }`}
      >
        {children}
      </Link>
    </th>
  );
}

function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 ${className}`}>{children}</td>;
}
