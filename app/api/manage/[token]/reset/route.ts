import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { applyTemplateStarter, getLiveByToken, type ResetSection } from "@/lib/sheets";

const VALID: ResetSection[] = ["all", "details", "story", "visibility", "subEvents"];

export async function POST(req: Request, ctx: { params: { token: string } }) {
  const found = await getLiveByToken(ctx.params.token);
  if (!found || !found.auth.approved) {
    return NextResponse.json({ error: "Unknown event" }, { status: 404 });
  }

  let sections: ResetSection[] = ["all"];
  try {
    const body = (await req.json()) as { sections?: string[] };
    if (Array.isArray(body.sections) && body.sections.length > 0) {
      const requested = body.sections.filter((s): s is ResetSection =>
        VALID.includes(s as ResetSection),
      );
      if (requested.length > 0) sections = requested;
    }
  } catch {
    // No body / invalid JSON → fall back to full reset.
  }

  const ok = await applyTemplateStarter(found.code, sections);
  if (!ok) return NextResponse.json({ error: "Reset failed" }, { status: 500 });
  revalidatePath(`/e/${found.code}`);
  return NextResponse.json({ ok: true, code: found.code, sections });
}
