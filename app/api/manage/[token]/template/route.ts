import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getLiveByToken, getLiveEvent, updateLiveFields } from "@/lib/sheets";
import { getTemplateMeta } from "@/components/templates/metadata";

type Body = { templateId?: string };

export async function POST(req: Request, ctx: { params: { token: string } }) {
  let body: Body = {};
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const templateId = (body.templateId ?? "").trim();
  if (!templateId) {
    return NextResponse.json({ error: "Missing templateId" }, { status: 400 });
  }

  const found = await getLiveByToken(ctx.params.token);
  if (!found || !found.auth.approved) {
    return NextResponse.json({ error: "Unknown event" }, { status: 404 });
  }
  if (!found.auth.canChangeTemplate) {
    return NextResponse.json(
      { error: "Template switching is not enabled for this event." },
      { status: 403 },
    );
  }

  const meta = getTemplateMeta(templateId);
  if (!meta) {
    return NextResponse.json({ error: "Unknown templateId" }, { status: 400 });
  }

  const current = await getLiveEvent(found.code);
  if (!current) {
    return NextResponse.json({ error: "Live row missing" }, { status: 404 });
  }
  if (!meta.eventTypes.includes(current.eventType)) {
    return NextResponse.json(
      { error: `Template "${meta.name}" doesn't support ${current.eventType} events.` },
      { status: 400 },
    );
  }

  await updateLiveFields(found.code, { TEMPLATE_ID: templateId } as never);
  revalidatePath(`/e/${found.code}`);
  return NextResponse.json({ ok: true, templateId });
}
