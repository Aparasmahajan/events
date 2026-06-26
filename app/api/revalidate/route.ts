import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isValidEventCode } from "@/lib/eventCode";

export async function POST(req: Request) {
  const secret = req.headers.get("x-revalidate-secret");
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { code } = (await req.json().catch(() => ({}))) as { code?: string };
  if (!code || !isValidEventCode(code)) {
    return NextResponse.json({ error: "Invalid event code" }, { status: 400 });
  }

  revalidatePath(`/e/${code}`);
  return NextResponse.json({ ok: true, revalidated: `/e/${code}` });
}
