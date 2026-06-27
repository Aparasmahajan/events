type SendOTPOpts = {
  to: string;
  code: string;
  eventCode: string;
  expiresInMin: number;
};

export async function sendOTPEmail({ to, code, eventCode, expiresInMin }: SendOTPOpts) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM || "Event Platform <no-reply@example.com>";
  const subject = `Your edit code: ${code}`;
  const text = [
    `Your 6-digit code for editing ${eventCode} is:`,
    "",
    `    ${code}`,
    "",
    `It expires in ${expiresInMin} minutes. If you didn't request this, you can ignore this email.`,
  ].join("\n");
  const html = `
    <div style="font-family:system-ui,Segoe UI,Roboto,sans-serif;max-width:480px;margin:auto;padding:24px;color:#111">
      <p>Your 6-digit code for editing <strong>${eventCode}</strong>:</p>
      <p style="font-size:32px;letter-spacing:8px;font-weight:600;background:#f5f5f5;padding:16px;border-radius:8px;text-align:center">${code}</p>
      <p style="color:#666;font-size:14px">It expires in ${expiresInMin} minutes. If you didn't request this, ignore this email.</p>
    </div>
  `;

  if (!apiKey) {
    // Dev fallback — no real email sent, log to server console.
    console.log(`[DEV OTP] ${eventCode} → ${to}  code=${code}  expires=${expiresInMin}min`);
    return { ok: true, dev: true };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, text, html }),
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
