type SendOTPOpts = {
  to: string;
  code: string;
  eventCode: string;
  expiresInMin: number;
};

type AccessAlertOpts = {
  to: string;
  eventCode: string;
  attemptedEmail: string;
  ip?: string;
  userAgent?: string;
};

function isTrue(v: string | undefined): boolean {
  if (!v) return false;
  const s = v.trim().toLowerCase();
  return s === "1" || s === "true" || s === "yes" || s === "on";
}

async function sendViaResend(opts: {
  to: string;
  subject: string;
  text: string;
  html: string;
  fallbackDevLog: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM || "Event Platform <no-reply@example.com>";

  if (!apiKey) {
    console.log(opts.fallbackDevLog);
    return { ok: true, dev: true };
  }

  // Optional admin visibility in prod — set LOG_OTP=1 (or "true") in your
  // env to also print the code alongside the successful send. Useful when
  // support has to help a customer who can't find the email. Off by
  // default because OTPs in logs weaken the "one-time secret" guarantee.
  if (isTrue(process.env.LOG_OTP)) {
    console.log(opts.fallbackDevLog + "  [SENT via Resend]");
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: opts.to,
        subject: opts.subject,
        text: opts.text,
        html: opts.html,
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error("[email] Resend failed:", res.status, body);
      return { ok: false };
    }
    return { ok: true, dev: false };
  } catch (err) {
    console.error("[email] Resend request errored:", err);
    return { ok: false };
  }
}

export async function sendOTPEmail({ to, code, eventCode, expiresInMin }: SendOTPOpts) {
  return sendViaResend({
    to,
    subject: `Your edit code: ${code}`,
    text: [
      `Your 6-digit code for editing ${eventCode} is:`,
      "",
      `    ${code}`,
      "",
      `It expires in ${expiresInMin} minutes. If you didn't request this, you can ignore this email.`,
    ].join("\n"),
    html: `
      <div style="font-family:system-ui,Segoe UI,Roboto,sans-serif;max-width:480px;margin:auto;padding:24px;color:#111">
        <p>Your 6-digit code for editing <strong>${eventCode}</strong>:</p>
        <p style="font-size:32px;letter-spacing:8px;font-weight:600;background:#f5f5f5;padding:16px;border-radius:8px;text-align:center">${code}</p>
        <p style="color:#666;font-size:14px">It expires in ${expiresInMin} minutes. If you didn't request this, ignore this email.</p>
      </div>
    `,
    fallbackDevLog: `[DEV OTP] ${eventCode} → ${to}  code=${code}  expires=${expiresInMin}min`,
  });
}

/** Notifies the registered customer when someone tried to sign in to their
 *  edit page with a different email. Throttling is the caller's job — this
 *  function just sends. */
export async function sendAccessAlertEmail({
  to,
  eventCode,
  attemptedEmail,
  ip,
  userAgent,
}: AccessAlertOpts) {
  // Don't leak the full attempted email in the body if it looks like a probe —
  // mask the local part beyond the first character. Domain stays visible so
  // the customer can spot which domain was tried.
  const masked = attemptedEmail.replace(
    /^([^@]{1})[^@]*(@.+)$/,
    (_m, head: string, tail: string) => `${head}***${tail}`,
  );

  const lines = [
    `Hi,`,
    ``,
    `Someone just tried to sign in to your event edit page for ${eventCode} using a different email address.`,
    ``,
    `Attempted email: ${masked}`,
    ip ? `IP: ${ip}` : "",
    userAgent ? `Device: ${userAgent.slice(0, 120)}` : "",
    ``,
    `If this was you with a typo, you can ignore this — the code is only ever sent to ${to}.`,
    ``,
    `If it wasn't you and you want to be extra safe, contact admin to rotate your access link.`,
  ].filter(Boolean);

  return sendViaResend({
    to,
    subject: `Heads up: a sign-in attempt on your event site (${eventCode})`,
    text: lines.join("\n"),
    html: `
      <div style="font-family:system-ui,Segoe UI,Roboto,sans-serif;max-width:520px;margin:auto;padding:24px;color:#111">
        <p>Hi,</p>
        <p>Someone just tried to sign in to your event edit page for <strong>${eventCode}</strong> using a different email address.</p>
        <table style="font-size:14px;background:#f7f7f7;border-radius:8px;padding:12px;margin:16px 0">
          <tr><td style="opacity:0.7;padding:4px 12px 4px 0">Attempted email</td><td style="padding:4px 0"><code>${masked}</code></td></tr>
          ${ip ? `<tr><td style="opacity:0.7;padding:4px 12px 4px 0">IP</td><td style="padding:4px 0"><code>${ip}</code></td></tr>` : ""}
          ${userAgent ? `<tr><td style="opacity:0.7;padding:4px 12px 4px 0">Device</td><td style="padding:4px 0">${userAgent.slice(0, 120)}</td></tr>` : ""}
        </table>
        <p style="color:#444;font-size:14px">If this was you with a typo, ignore this — codes are only ever sent to <strong>${to}</strong>.</p>
        <p style="color:#444;font-size:14px">If it wasn't you and you want to be extra safe, ask admin to rotate your access link.</p>
      </div>
    `,
    fallbackDevLog: `[DEV ALERT] ${eventCode} attempted=${masked} ip=${ip ?? "?"} → notify ${to}`,
  });
}
