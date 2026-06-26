import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { renameEventCode } from "@/lib/sheets";

type Body = { oldCode?: string; newCode?: string };

export async function POST(req: Request) {
  let body: Body = {};
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const oldCode = (body.oldCode ?? "").trim();
  const newCode = (body.newCode ?? "").trim().toUpperCase();
  if (!oldCode || !newCode) {
    return NextResponse.json({ error: "Both oldCode and newCode are required" }, { status: 400 });
  }
  try {
    const counts = await renameEventCode(oldCode, newCode);
    // Bust ISR cache for both URLs so the old one 404s and the new one renders.
    revalidatePath(`/e/${oldCode}`);
    revalidatePath(`/e/${newCode}`);
    return NextResponse.json({ ok: true, newCode, counts });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Rename failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
