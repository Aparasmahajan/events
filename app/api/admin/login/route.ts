import { NextResponse } from "next/server";
import { setAdminSessionCookie, verifyPassword } from "@/lib/auth";

type Body = { email?: string; password?: string };

// Simple in-memory rate limit. 5 fails per email per 15 min → lockout.
const attempts = new Map<string, { count: number; lockedUntil: number }>();
const MAX = 5;
const WINDOW_MS = 15 * 60_000;

function check(email: string): { locked: boolean; remaining: number } {
  const a = attempts.get(email);
  if (!a) return { locked: false, remaining: MAX };
  if (a.lockedUntil > Date.now()) return { locked: true, remaining: 0 };
  return { locked: false, remaining: MAX - a.count };
}

function fail(email: string) {
  const a = attempts.get(email) ?? { count: 0, lockedUntil: 0 };
  a.count += 1;
  if (a.count >= MAX) a.lockedUntil = Date.now() + WINDOW_MS;
  attempts.set(email, a);
}

function clear(email: string) {
  attempts.delete(email);
}

export async function POST(req: Request) {
  let body: Body = {};
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";
  if (!email || !password) {
    return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
  }

  const { locked } = check(email);
  if (locked) {
    return NextResponse.json(
      { error: "Too many attempts. Try again in 15 minutes." },
      { status: 429 },
    );
  }

  const expectedEmail = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
  const hash = process.env.ADMIN_PASSWORD_HASH ?? "";
  if (!expectedEmail || !hash) {
    return NextResponse.json(
      { error: "Admin auth not configured. Set ADMIN_EMAIL + ADMIN_PASSWORD_HASH." },
      { status: 500 },
    );
  }

  if (email !== expectedEmail || !verifyPassword(password, hash)) {
    fail(email);
    console.warn(`[admin] failed login attempt for ${email}`);
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  clear(email);
  setAdminSessionCookie(email);
  return NextResponse.json({ ok: true });
}
