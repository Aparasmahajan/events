import { NextRequest, NextResponse } from "next/server";

/* ─────────────────────────────────────────────────────────────────────
 * Edge-compatible session verification (Web Crypto, no node:crypto).
 * Format produced by lib/auth.ts: base64url(JSON).base64url(HMAC-SHA256)
 * ───────────────────────────────────────────────────────────────────── */

function b64urlDecodeToBytes(s: string): Uint8Array {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function b64urlFromBytes(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

async function hmacB64Url(payload: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return b64urlFromBytes(new Uint8Array(sig));
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function verifySession<T extends { exp?: number }>(
  token: string | undefined,
): Promise<T | null> {
  const secret = process.env.AUTH_SECRET;
  if (!token || !secret) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = await hmacB64Url(body, secret);
  if (!timingSafeEqual(sig, expected)) return null;
  try {
    const json = new TextDecoder().decode(b64urlDecodeToBytes(body));
    const obj = JSON.parse(json) as T;
    if (typeof obj.exp === "number" && obj.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return obj;
  } catch {
    return null;
  }
}

/* ─────────────────────────────────────────────────────────────────────
 * Route gating
 * ───────────────────────────────────────────────────────────────────── */

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Admin gate ──────────────────────────────────────────────────────
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    // The login page + the login POST are public.
    if (pathname === "/admin/login" || pathname === "/api/admin/login") {
      return NextResponse.next();
    }
    const cookie = req.cookies.get("admin_session")?.value;
    const session = await verifySession<{ email: string; exp: number }>(cookie);
    if (!session) {
      if (pathname.startsWith("/api/admin")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // ── Customer (token) gate ──────────────────────────────────────────
  const customerMatch =
    pathname.match(/^\/manage\/([^/]+)(\/.*)?$/) ||
    pathname.match(/^\/api\/manage\/([^/]+)(\/.*)?$/);
  if (customerMatch) {
    const token = customerMatch[1];
    const sub = customerMatch[2] ?? "";

    // The login page + login POST + logout POST are public (they exist to
    // create/destroy the session itself).
    if (sub === "/login" || sub.startsWith("/login") || sub === "/logout") {
      return NextResponse.next();
    }

    // We don't yet know the event code at the edge (it's stored in Live), so
    // the middleware checks: do you have ANY signed customer cookie whose
    // tokSnapshot matches this URL's token? Find by iterating cust_session_*
    // cookies.
    const cookies = req.cookies.getAll().filter((c) => c.name.startsWith("cust_session_"));
    let ok = false;
    for (const c of cookies) {
      const session = await verifySession<{
        code: string;
        tokSnapshot: string;
        exp: number;
      }>(c.value);
      if (session && session.tokSnapshot === token) {
        ok = true;
        break;
      }
    }
    if (!ok) {
      if (pathname.startsWith("/api/manage")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const url = req.nextUrl.clone();
      url.pathname = `/manage/${token}/login`;
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/manage/:path*", "/api/manage/:path*"],
};
