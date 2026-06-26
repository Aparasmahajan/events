import crypto from "crypto";
import { cookies } from "next/headers";

/* ──────────────────────────────────────────────────────────────────────────
 * Session tokens — compact, HMAC-signed (no JWT library needed)
 * Format: base64url(payload).base64url(hmac)
 * ────────────────────────────────────────────────────────────────────────── */

function b64url(buf: Buffer | string): string {
  return Buffer.from(buf)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function b64urlDecode(s: string): Buffer {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  return Buffer.from(s, "base64");
}

function authSecret(): string {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 32) {
    throw new Error("AUTH_SECRET is missing or too short (need ≥ 32 chars).");
  }
  return s;
}

function hmac(payload: string): string {
  return b64url(
    crypto.createHmac("sha256", authSecret()).update(payload).digest(),
  );
}

export function signSession(payload: Record<string, unknown>): string {
  const body = b64url(JSON.stringify(payload));
  return `${body}.${hmac(body)}`;
}

export function verifySession<T = Record<string, unknown>>(
  token: string | undefined,
): T | null {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  // Constant-time signature check
  const expected = hmac(body);
  if (
    sig.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
  ) {
    return null;
  }
  try {
    const obj = JSON.parse(b64urlDecode(body).toString("utf8")) as {
      exp?: number;
    } & T;
    if (typeof obj.exp === "number" && obj.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return obj as T;
  } catch {
    return null;
  }
}

/* ──────────────────────────────────────────────────────────────────────────
 * Password hashing — scrypt (built-in, no bcrypt dep)
 * Stored as "salt(hex):hash(hex)"
 * ────────────────────────────────────────────────────────────────────────── */

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  if (!stored || !stored.includes(":")) return false;
  const [salt, expected] = stored.split(":");
  const actual = crypto.scryptSync(password, salt, 64).toString("hex");
  return (
    actual.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(actual, "hex"), Buffer.from(expected, "hex"))
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * OTP — 6-digit codes, hashed for storage
 * ────────────────────────────────────────────────────────────────────────── */

export function generateOTP(): string {
  // 6 digits, leading zeros preserved
  return String(crypto.randomInt(0, 1_000_000)).padStart(6, "0");
}

export function hashOTP(code: string): string {
  // Same scrypt scheme as passwords — short input, but cheap and safe.
  return hashPassword(code);
}

export function verifyOTP(code: string, stored: string): boolean {
  return verifyPassword(code, stored);
}

/* ──────────────────────────────────────────────────────────────────────────
 * Access tokens — long random strings stored on Live.Access Token
 * ────────────────────────────────────────────────────────────────────────── */

export function generateAccessToken(): string {
  // 32 bytes of randomness → 64-char hex. URL-safe.
  return crypto.randomBytes(32).toString("hex");
}

/* ──────────────────────────────────────────────────────────────────────────
 * Cookie helpers (server components / route handlers)
 * ────────────────────────────────────────────────────────────────────────── */

const ADMIN_COOKIE = "admin_session";

export function customerCookieName(eventCode: string): string {
  return `cust_session_${eventCode}`;
}

export type AdminSession = { email: string; exp: number };
export type CustomerSession = {
  code: string;
  tokSnapshot: string;
  exp: number;
};

export function setAdminSessionCookie(email: string) {
  const ttlHours = Number(process.env.SESSION_TTL_ADMIN_HOURS ?? 8);
  const exp = Math.floor(Date.now() / 1000) + ttlHours * 3600;
  const token = signSession({ email, exp });
  cookies().set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ttlHours * 3600,
  });
}

export function clearAdminSessionCookie() {
  cookies().delete(ADMIN_COOKIE);
}

export function readAdminSession(): AdminSession | null {
  return verifySession<AdminSession>(cookies().get(ADMIN_COOKIE)?.value);
}

export function setCustomerSessionCookie(code: string, tokSnapshot: string) {
  const ttlDays = Number(process.env.SESSION_TTL_CUSTOMER_DAYS ?? 30);
  const exp = Math.floor(Date.now() / 1000) + ttlDays * 86400;
  const token = signSession({ code, tokSnapshot, exp });
  cookies().set(customerCookieName(code), token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ttlDays * 86400,
  });
}

export function clearCustomerSessionCookie(code: string) {
  cookies().delete(customerCookieName(code));
}

export function readCustomerSession(code: string): CustomerSession | null {
  return verifySession<CustomerSession>(
    cookies().get(customerCookieName(code))?.value,
  );
}
