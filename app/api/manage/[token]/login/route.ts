import { NextResponse } from "next/server";
import {
  generateOTP,
  hashOTP,
  setCustomerSessionCookie,
  verifyOTP,
} from "@/lib/auth";
import { sendOTPEmail } from "@/lib/email";
import {
  getEnquiry,
  getLiveAuthState,
  getLiveByToken,
  updateLiveFields,
} from "@/lib/sheets";

const OTP_TTL_MIN = Number(process.env.OTP_TTL_MIN ?? 10);
const MAX_OTP_ATTEMPTS = 5;
const LOCKOUT_MIN = 15;

type Body = { email?: string; code?: string };

export async function POST(req: Request, ctx: { params: { token: string } }) {
  const token = ctx.params.token;
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
