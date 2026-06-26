import Link from "next/link";
import { readAdminSession } from "@/lib/auth";
import { listEnquiries } from "@/lib/sheets";
import { AdminShell } from "../AdminShell";
import { StatusPill } from "../page";

export const dynamic = "force-dynamic";

export default async function EnquiriesPage({
  searchParams,
}: {
  searchParams?: { status?: string; q?: string };
}) {
  const session = readAdminSession();
  const all = await listEnquiries();
  const statusFilter = searchParams?.status;
  const q = (searchParams?.q ?? "").trim().toLowerCase();

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
          <input
            name="q"
            defaultValue={q}
            placeholder="Search name, code, email…"
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

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-black/10 p-12 text-center opacity-70">
          <p>No enquiries match.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-black/[0.03] text-left">
              <tr>
                <Th>Code</Th>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Type</Th>
                <Th>Submitted</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.eventCode} className="border-t border-black/5 hover:bg-black/[0.02]">
                  <Td>
                    <Link href={`/admin/enquiries/${e.eventCode}`} className="font-mono text-xs underline">
                      {e.eventCode}
                    </Link>
                  </Td>
                  <Td>{e.fullName}</Td>
                  <Td className="text-xs opacity-80">{e.email}</Td>
                  <Td className="capitalize">{e.eventType}</Td>
                  <Td className="text-xs opacity-70">{e.submittedAt?.slice(0, 10)}</Td>
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
function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-2.5 text-xs uppercase tracking-widest opacity-60 font-medium">{children}</th>;
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 ${className}`}>{children}</td>;
}
