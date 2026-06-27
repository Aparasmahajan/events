import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { updateLiveFields } from "@/lib/sheets";

type Body = { code?: string; active?: boolean };

export async function POST(req: Request) {
  let body: Body = {};
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const code = (body.code ?? "").trim();
  if (!code) return NextResponse.json({ error: "Missing code" }, { status: 400 });
  if (typeof body.active !== "boolean") {
    return NextResponse.json({ error: "active must be a boolean" }, { status: 400 });
  }

  const updates: Record<string, string> = {
    IS_ACTIVE: body.active ? "TRUE" : "FALSE",
  };
  if (body.active) updates.GO_LIVE_DATE = new Date().toISOString();

  const ok = await updateLiveFields(code, updates as never);
  if (!ok) return NextResponse.json({ error: "Live row not found" }, { status: 404 });

  // Bust ISR so the public site reflects the new state immediately.
  revalidatePath(`/e/${code}`);
  return NextResponse.json({ ok: true, active: body.active });
}
