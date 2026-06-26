"use client";

import { useState } from "react";
import type { EventType } from "@/lib/types";

type Props = {
  eventType: EventType;
  templateId: string;
  person1Label: string;
  person2Label?: string;
  showPerson2: boolean;
  subtypes?: string[];
};

type Status = "idle" | "submitting" | "success" | "error";

export function EnquiryForm({ eventType, templateId, person1Label, person2Label, showPerson2, subtypes }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("");
  const [eventCode, setEventCode] = useState<string | null>(null);

  const validateEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const validateMobile = (v: string) => /^\+?[0-9\-\s()]{8,}$/.test(v);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    const form = new FormData(e.currentTarget);
    const data = {
      fullName: String(form.get("fullName") || "").trim(),
      email: String(form.get("email") || "").trim(),
      mobile: String(form.get("mobile") || "").trim(),
      eventType,
      eventSubtype: String(form.get("eventSubtype") || "") || undefined,
      templateId,
      eventTitle: String(form.get("eventTitle") || "").trim(),
      person1Name: String(form.get("person1Name") || "").trim(),
      person2Name: String(form.get("person2Name") || "").trim() || undefined,
      tentativeDate: String(form.get("tentativeDate") || "") || undefined,
      city: String(form.get("city") || "").trim() || undefined,
      message: String(form.get("message") || "").trim() || undefined,
    };

    if (!data.fullName || !data.email || !data.mobile || !data.eventTitle || !data.person1Name) {
      setStatus("error");
      setMessage("Please fill all required fields.");
      return;
    }
    if (!validateEmail(data.email)) {
      setStatus("error");
      setMessage("Please enter a valid email.");
      return;
    }
    if (!validateMobile(data.mobile)) {
      setStatus("error");
      setMessage("Please enter a valid mobile number with country code.");
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error || "Submission failed");
      setStatus("success");
      setEventCode(body.eventCode);
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Submission failed");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-6">
        <h3 className="font-display text-2xl text-green-900">Enquiry received 🎉</h3>
        <p className="mt-2 text-green-900/80">
          Your event code is{" "}
          <code className="px-1.5 py-0.5 rounded bg-white border border-green-200">{eventCode}</code>.
          We&apos;ll call within a working day to confirm details.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Field label="Your full name" name="fullName" required />
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Email" name="email" type="email" required />
        <Field label="Mobile (with country code)" name="mobile" placeholder="+91-9XXXXXXXXX" required />
      </div>
      {subtypes && subtypes.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-1">Sub-type</label>
          <select
            name="eventSubtype"
            className="w-full rounded-lg border border-black/15 px-3 py-2.5 bg-white"
          >
            <option value="">— Select (optional) —</option>
            {subtypes.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      )}
      <Field label="Event title (shown publicly)" name="eventTitle" placeholder="Rahul weds Priya" required />
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label={person1Label} name="person1Name" required />
        {showPerson2 && person2Label && <Field label={person2Label} name="person2Name" />}
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Tentative date" name="tentativeDate" type="date" />
        <Field label="City" name="city" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Anything we should know? (private)</label>
        <textarea
          name="message"
          rows={4}
          className="w-full rounded-lg border border-black/15 px-3 py-2.5 bg-white"
          placeholder="Internal note for our team — not shown on your site."
        />
      </div>

      {status === "error" && message && (
        <p className="text-sm text-red-600">{message}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full px-7 py-3 rounded-full bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Send enquiry"}
      </button>
      <p className="text-xs opacity-60 text-center">
        Your contact details stay private. They&apos;re never shown on your site.
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium mb-1">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-lg border border-black/15 px-3 py-2.5 bg-white focus:outline-none focus:border-black/40"
      />
    </div>
  );
}
