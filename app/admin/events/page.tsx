import Link from "next/link";
import { readAdminSession } from "@/lib/auth";
import { listLiveEvents } from "@/lib/sheets";
import { AdminShell } from "../AdminShell";
import { LiveActions } from "./LiveActions";

export const dynamic = "force-dynamic";

export default async function LiveEventsPage() {
  const session = readAdminSession();
  const events = await listLiveEvents();
  return (
    <AdminShell email={session?.email ?? ""}>
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.4em] opacity-60 mb-2">Live</p>
        <h1 className="font-display text-4xl">Live events</h1>
        <p className="opacity-70 mt-2 text-sm max-w-xl">
          Everything that&apos;s been approved. Active sites are public at /e/&lt;code&gt;.
          Use Stop / Resume to flip <code>Is Active</code> + revalidate.
        </p>
      </div>

      {events.length === 0 ? (
        <div className="bg-white rounded-2xl border border-black/10 p-12 text-center opacity-70">
          <p>No live events yet.</p>
          <p className="text-xs mt-1">
            Approve an enquiry to promote it to the Live tab.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-black/[0.03] text-left">
              <tr>
                <Th>Code</Th>
                <Th>Title</Th>
                <Th>Template</Th>
                <Th>Main date</Th>
                <Th>State</Th>
                <Th />
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.eventCode} className="border-t border-black/5 hover:bg-black/[0.02]">
                  <Td>
                    <span className="font-mono text-xs">{e.eventCode}</span>
                  </Td>
                  <Td>{e.eventTitle}</Td>
                  <Td className="text-xs opacity-70">{e.templateId}</Td>
                  <Td className="text-xs opacity-70">{e.mainDate || e.tentativeDate || "—"}</Td>
                  <Td>
                    {e.isActive ? (
                      <span className="text-[10px] uppercase tracking-widest px-2 py-1 rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    ) : (
                      <span className="text-[10px] uppercase tracking-widest px-2 py-1 rounded-full bg-neutral-200 text-neutral-700">
                        Stopped
                      </span>
                    )}
                  </Td>
                  <Td>
                    <div className="flex items-center gap-3 flex-wrap">
                      <LiveActions code={e.eventCode} active={e.isActive} />
                      <Link
                        href={`/e/${e.eventCode}`}
                        target="_blank"
                        className="text-xs underline"
                      >
                        View
                      </Link>
                      <Link
                        href={`/admin/enquiries/${e.eventCode}`}
                        className="text-xs underline"
                      >
                        Enquiry
                      </Link>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-2.5 text-xs uppercase tracking-widest opacity-60 font-medium">{children}</th>;
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 ${className}`}>{children}</td>;
}
