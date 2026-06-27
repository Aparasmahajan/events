import Link from "next/link";
import { readAdminSession } from "@/lib/auth";
import { listEnquiries, listLiveEvents } from "@/lib/sheets";
import { AdminShell } from "./AdminShell";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const session = readAdminSession();
  const [enquiries, events] = await Promise.all([listEnquiries(), listLiveEvents()]);

  const counts = {
    enqNew: enquiries.filter((e) => (e.status || "New") === "New").length,
    enqContacted: enquiries.filter((e) => e.status === "Contacted").length,
    enqApproved: enquiries.filter((e) => e.status === "Approved").length,
    enqLost: enquiries.filter((e) => e.status === "Not Interested").length,
    liveActive: events.filter((e) => e.isActive).length,
    liveStopped: events.filter((e) => !e.isActive).length,
  };

  return (
    <AdminShell email={session?.email ?? ""}>
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.4em] opacity-60 mb-2">Overview</p>
        <h1 className="font-display text-4xl">Dashboard</h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Stat label="New enquiries" value={counts.enqNew} href="/admin/enquiries?status=New" />
        <Stat label="Contacted" value={counts.enqContacted} href="/admin/enquiries?status=Contacted" />
        <Stat label="Approved" value={counts.enqApproved} href="/admin/enquiries?status=Approved" />
        <Stat label="Not interested" value={counts.enqLost} href="/admin/enquiries?status=Not%20Interested" />
        <Stat label="Live: active" value={counts.liveActive} href="/admin/events" />
        <Stat label="Live: stopped" value={counts.liveStopped} href="/admin/events" />
      </div>

      <section className="mt-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-2xl">Recent enquiries</h2>
          <Link href="/admin/enquiries" className="text-sm underline">
            See all →
          </Link>
        </div>
        {enquiries.length === 0 ? (
          <div className="bg-white rounded-2xl border border-black/10 p-8 text-center opacity-70">
            <p>No enquiries yet.</p>
            <p className="text-xs mt-1">
              Submit a test enquiry from <Link href="/" className="underline">the landing page</Link> to see it land here.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-black/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-black/[0.03] text-left">
                <tr>
                  <Th>Code</Th>
                  <Th>Name</Th>
                  <Th>Type</Th>
                  <Th>Submitted</Th>
                  <Th>Status</Th>
                </tr>
              </thead>
              <tbody>
                {enquiries.slice(0, 8).map((e) => (
                  <tr key={e.eventCode} className="border-t border-black/5 hover:bg-black/[0.02]">
                    <Td>
                      <Link href={`/admin/enquiries/${e.eventCode}`} className="font-mono text-xs underline">
                        {e.eventCode}
                      </Link>
                    </Td>
                    <Td>{e.fullName}</Td>
                    <Td className="capitalize">{e.eventType}</Td>
                    <Td className="text-xs opacity-70">{e.submittedAt?.slice(0, 10)}</Td>
                    <Td>
                      <StatusPill status={e.status || "New"} />
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AdminShell>
  );
}

function Stat({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link
      href={href}
      className="bg-white rounded-2xl border border-black/10 p-5 hover:border-black/30 hover:shadow-sm transition block"
    >
      <p className="text-xs uppercase tracking-widest opacity-60">{label}</p>
      <p className="font-display text-4xl mt-2 tabular-nums">{value}</p>
    </Link>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-2.5 text-xs uppercase tracking-widest opacity-60 font-medium">{children}</th>;
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 ${className}`}>{children}</td>;
}

export function StatusPill({ status }: { status: string }) {
  const color =
    status === "Approved"
      ? "bg-green-100 text-green-800"
      : status === "Not Interested"
        ? "bg-neutral-200 text-neutral-700"
        : status === "Contacted"
          ? "bg-amber-100 text-amber-800"
          : "bg-blue-100 text-blue-800";
  return (
    <span className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded-full ${color}`}>
      {status}
    </span>
  );
}
