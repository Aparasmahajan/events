"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Step = "email" | "code";

export function LoginForm({ token }: { token: string }) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const requestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage(null);
    try {
      const res = await fetch(`/api/manage/${token}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok && res.status === 429) {
        const body = await res.json();
        setMessage(body.error ?? "Too many attempts.");
      } else {
        // Always advance — server may return generic ok even if email didn't match.
        setStep("code");
        setMessage(
          "If that email matches our records, we just sent a 6-digit code. Check your inbox (and spam).",
        );
      }
    } catch {
      setMessage("Network error. Please try again.");
    } finally {
      setStatus("idle");
    }
  };

  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage(null);
    try {
      const res = await fetch(`/api/manage/${token}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const body = await res.json();
      if (!res.ok) {
        setMessage(body.error ?? "Couldn't verify the code.");
        return;
      }
      router.push(`/manage/${token}`);
      router.refresh();
    } catch {
      setMessage("Network error. Please try again.");
    } finally {
      setStatus("idle");
    }
  };

  if (step === "email") {
    return (
      <form onSubmit={requestCode} className="space-y-4">
        <label className="block">
          <span className="text-xs uppercase tracking-widest opacity-70">
            The email you used to enquire
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2.5 focus:outline-none focus:border-black/40"
            placeholder="you@example.com"
            autoFocus
          />
        </label>
        <button
          disabled={status === "loading"}
          className="w-full rounded-full bg-neutral-900 text-white py-3 font-medium hover:bg-neutral-800 transition disabled:opacity-50"
        >
          {status === "loading" ? "Sending…" : "Send code"}
        </button>
        {message && <p className="text-sm text-red-600">{message}</p>}
      </form>
    );
  }

  return (
    <form onSubmit={verifyCode} className="space-y-4">
      <p className="text-sm opacity-80">{message}</p>
      <label className="block">
        <span className="text-xs uppercase tracking-widest opacity-70">
          6-digit code
        </span>
        <input
          inputMode="numeric"
          pattern="\d{6}"
          required
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          className="mt-1 w-full rounded-lg border border-black/15 px-3 py-3 text-center text-2xl tracking-[0.5em] font-mono focus:outline-none focus:border-black/40"
          placeholder="••••••"
          autoFocus
        />
      </label>
      <button
        disabled={status === "loading" || code.length !== 6}
        className="w-full rounded-full bg-neutral-900 text-white py-3 font-medium hover:bg-neutral-800 transition disabled:opacity-50"
      >
        {status === "loading" ? "Checking…" : "Verify and continue"}
      </button>
      <button
        type="button"
        onClick={() => {
          setStep("email");
          setCode("");
          setMessage(null);
        }}
        className="w-full text-xs underline opacity-70 hover:opacity-100"
      >
        Use a different email
      </button>
    </form>
  );
}
