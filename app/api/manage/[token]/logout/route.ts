import { NextResponse } from "next/server";
import { clearCustomerSessionCookie } from "@/lib/auth";
import { getLiveByToken } from "@/lib/sheets";

export async function POST(_req: Request, ctx: { params: { token: string } }) {
  const found = await getLiveByToken(ctx.params.token);
  if (found?.code) clearCustomerSessionCookie(found.code);
  return NextResponse.json({ ok: true });
}
