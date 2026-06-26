import { notFound } from "next/navigation";
import Link from "next/link";
import { readAdminSession } from "@/lib/auth";
import { getEnquiry, getLiveAuthState } from "@/lib/sheets";
import { AdminShell } from "../../AdminShell";
import { StatusPill } from "../../page";
import { EnquiryActions } from "./EnquiryActions";
import { RenameCode } from "./RenameCode";

export const dynamic = "force-dynamic";

export default async function EnquiryDetailPage({
  params,
}: {
  params: { code: string };
}) {
  const session = readAdminSession();
  const enquiry = await getEnquiry(params.code);
  if (!enquiry) notFound();
  const auth = await getLiveAuthState(params.code);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const editLink = auth?.accessToken ? `${siteUrl}/manage/${auth.accessToken}` : null;
  const liveLink = `${siteUrl}/e/${enquiry.eventCode}`;

  return (
    <AdminShell email={session?.email ?? ""}>
      <Link href="/admin/enquiries" className="text-sm opacity-70 hover:opacity-100">
        ← Back to enquiries
      </Link>

      <div className="mt-3 mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] opacity-60 mb-2">
            <span className="font-mono">{enquiry.eventCode}</span>
          </p>
          <h1 className="font-display text-4xl">{enquiry.fullName}</h1>
          <p className="opacity-70 mt-1">{enquiry.eventTitle || "(no event title)"}</p>
        </div>
        <StatusPill status={enquiry.status || "New"} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 bg-white rounded-2xl border border-black/10 p-6 space-y-5">
          <h2 className="font-display text-2xl">Contact & event details</h2>
          <Row label="Email">{enquiry.email}</Row>
          <Row label="Mobile">{enquiry.mobile}</Row>
          <Row label="Event type">
            <span className="capitalize">{enquiry.eventType}</span>
            {enquiry.eventSubtype && <span className="opacity-70"> · {enquiry.eventSubtype}</span>}
          </Row>
          <Row label="Template">
            <span className="font-mono text-xs">{enquiry.templateId}</span>
          </Row>
          <Row label="Person 1">{enquiry.person1Name}</Row>
          {enquiry.person2Name && <Row label="Person 2">{enquiry.person2Name}</Row>}
          <Row label="Tentative date">{enquiry.tentativeDate || <i className="opacity-50">—</i>}</Row>
          <Row label="City">{enquiry.city || <i className="opacity-50">—</i>}</Row>
          <Row label="Message">
            {enquiry.message ? (
              <p className="whitespace-pre-wrap">{enquiry.message}</p>
            ) : (
              <i className="opacity-50">No message</i>
            )}
          </Row>
        </section>

        <section className="space-y-6">
          <div className="bg-white rounded-2xl border border-black/10 p-6">
            <h2 className="font-display text-2xl mb-3">Actions</h2>
            <EnquiryActions
              code={enquiry.eventCode}
              currentStatus={enquiry.status || "New"}
              alreadyApproved={!!auth?.approved}
            />
          </div>

          <div className="bg-white rounded-2xl border border-black/10 p-6">
            <h2 className="font-display text-2xl mb-3">Danger zone</h2>
            <RenameCode currentCode={enquiry.eventCode} />
          </div>

          {auth?.approved && (
            <div className="bg-white rounded-2xl border border-black/10 p-6">
              <h2 className="font-display text-2xl mb-3">Customer links</h2>
              <p className="text-xs opacity-60 uppercase tracking-widest mb-1">Edit link (private)</p>
              <code className="block text-xs break-all bg-black/[0.03] p-2 rounded mb-4">
                {editLink}
              </code>
              <p className="text-xs opacity-60 uppercase tracking-widest mb-1">Live link (public)</p>
              <code className="block text-xs break-all bg-black/[0.03] p-2 rounded">{liveLink}</code>
              <p className="text-[11px] opacity-60 mt-4">
                The customer signs in with the email above + a 6-digit code sent to that
                inbox. Without that, the edit link alone won&apos;t grant access.
              </p>
            </div>
          )}
        </section>
      </div>
    </AdminShell>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-3 items-start">
      <span className="text-xs uppercase tracking-widest opacity-60">{label}</span>
      <div className="col-span-2">{children}</div>
    </div>
  );
}
