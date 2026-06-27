import { NextResponse } from "next/server";
import {
  generateOTP,
  hashOTP,
  setCustomerSessionCookie,
  verifyOTP,
} from "@/lib/auth";
import { sendAccessAlertEmail, sendOTPEmail } from "@/lib/email";
import {
  getEnquiry,
  getLiveAuthState,
  getLiveByToken,
  updateLiveFields,
} from "@/lib/sheets";

const OTP_TTL_MIN = Number(process.env.OTP_TTL_MIN ?? 10);
const MAX_OTP_ATTEMPTS = 5;
const LOCKOUT_MIN = 15;

/* ────────────────────────────────────────────────────────────────────
 * In-memory rate limit + alert-throttle stores.
 *
 * In-memory is fine for this dev/MVP — on serverless cold starts the
 * counter resets, which means a determined attacker can bypass it. For
 * stricter limits move these to a Redis / Upstash-backed store later.
 * ──────────────────────────────────────────────────────────────────── */

const IP_LIMIT = Math.max(1, Number(process.env.LOGIN_IP_LIMIT_PER_HOUR ?? 5));
const IP_WINDOW_MS = 60 * 60 * 1000; // OTP requests per IP per hour (count = IP_LIMIT)
const ipBuckets = new Map<string, { count: number; resetAt: number }>();

const ALERT_THROTTLE_MS = 60 * 60 * 1000; // 1 alert per event per hour
const lastAlertAt = new Map<string, number>();

function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  const xri = req.headers.get("x-real-ip");
  if (xri) return xri.trim();
  return "unknown";
}

function checkIpLimit(ip: string): { ok: boolean } {
  const now = Date.now();
  const a = ipBuckets.get(ip);
  if (!a || a.resetAt < now) {
    ipBuckets.set(ip, { count: 1, resetAt: now + IP_WINDOW_MS });
    return { ok: true };
  }
  if (a.count >= IP_LIMIT) return { ok: false };
  a.count += 1;
  return { ok: true };
}

function shouldSendAlert(eventCode: string): boolean {
  const last = lastAlertAt.get(eventCode) ?? 0;
  if (Date.now() - last < ALERT_THROTTLE_MS) return false;
  lastAlertAt.set(eventCode, Date.now());
  return true;
}

type Body = { email?: string; code?: string };

export async function POST(req: Request, ctx: { params: { token: string } }) {
  const token = ctx.params.token;
  const ip = getClientIp(req);

  // Stop runaway requesters before doing any work. Applies to both the email
  // request step AND the code-verify step — both are POSTs to this route.
  if (!checkIpLimit(ip).ok) {
    return NextResponse.json(
      { error: "Too many requests from your network. Try again in an hour." },
      { status: 429 },
    );
  }

  let body: Body = {};
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const found = await getLiveByToken(token);
  if (!found || !found.auth.approved) {
    // Don't leak token validity. Same generic response either way.
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const { code, auth } = found;

  // Lockout check
  if (auth.otpLockedUntil) {
    const lockedUntil = new Date(auth.otpLockedUntil).getTime();
    if (Number.isFinite(lockedUntil) && lockedUntil > Date.now()) {
      return NextResponse.json(
        { error: "Too many attempts. Try again later." },
        { status: 429 },
      );
    }
  }

  /* ───────────── Step 1: request OTP via email ───────────── */
  if (typeof body.email === "string" && body.email.length > 0) {
    const enquiry = await getEnquiry(code);
    const expected = (enquiry?.email ?? "").trim().toLowerCase();
    const submitted = body.email.trim().toLowerCase();
    if (!expected || expected !== submitted) {
      // Generic response — don't reveal whether the email is right.
      //
      // If there IS a registered email and someone typed a different one, the
      // registered customer is notified — throttled to once per hour per event
      // so we don't spam them when an attacker probes many addresses.
      if (expected && shouldSendAlert(code)) {
        sendAccessAlertEmail({
          to: expected,
          eventCode: code,
          attemptedEmail: submitted,
          ip,
          userAgent: req.headers.get("user-agent") ?? undefined,
        }).catch(() => {
          // Notification failure shouldn't impact the response. Already logged.
        });
      }
      return NextResponse.json({ ok: true, sent: true });
    }
    const otp = generateOTP();
    const otpHash = hashOTP(otp);
    const expiresAt = new Date(Date.now() + OTP_TTL_MIN * 60_000).toISOString();
    await updateLiveFields(code, {
      OTP_HASH: otpHash,
      OTP_EXPIRES_AT: expiresAt,
      OTP_ATTEMPTS: 0,
      OTP_LOCKED_UNTIL: "",
    });
    await sendOTPEmail({
      to: expected,
      code: otp,
      eventCode: code,
      expiresInMin: OTP_TTL_MIN,
    });
    return NextResponse.json({ ok: true, sent: true });
  }

  /* ───────────── Step 2: verify the code ───────────── */
  if (typeof body.code === "string" && /^\d{6}$/.test(body.code)) {
    const fresh = await getLiveAuthState(code);
    if (!fresh || !fresh.otpHash) {
      return NextResponse.json({ error: "No code requested" }, { status: 400 });
    }
    const expiresAt = new Date(fresh.otpExpiresAt).getTime();
    if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) {
      return NextResponse.json({ error: "Code expired" }, { status: 400 });
    }
    const match = verifyOTP(body.code, fresh.otpHash);
    if (!match) {
      const next = fresh.otpAttempts + 1;
      const updates: Record<string, string | number> = { OTP_ATTEMPTS: next };
      if (next >= MAX_OTP_ATTEMPTS) {
        updates.OTP_LOCKED_UNTIL = new Date(
          Date.now() + LOCKOUT_MIN * 60_000,
        ).toISOString();
        updates.OTP_HASH = "";
        updates.OTP_EXPIRES_AT = "";
      }
      await updateLiveFields(code, updates as never);
      return NextResponse.json({ error: "Wrong code" }, { status: 400 });
    }
    // Success — clear OTP state, mint cookie
    await updateLiveFields(code, {
      OTP_HASH: "",
      OTP_EXPIRES_AT: "",
      OTP_ATTEMPTS: 0,
      OTP_LOCKED_UNTIL: "",
    });
    setCustomerSessionCookie(code, fresh.accessToken);
    return NextResponse.json({ ok: true, code });
  }

  return NextResponse.json({ error: "Missing email or code" }, { status: 400 });
}
