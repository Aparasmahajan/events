"use client";

import { useState } from "react";

type Props = {
  title: string;
  /** YYYY-MM-DD */
  date?: string;
  /** HH:MM (24h) */
  startTime?: string;
  /** HH:MM (24h) */
  endTime?: string;
  venueName?: string;
  venueAddress?: string;
  description?: string;
  className?: string;
};

/** Pads + strips a YYYY-MM-DD + HH:MM into the YYYYMMDDTHHMMSS shape both
 * Google Calendar and the iCal spec accept (floating local time, no zone). */
function stamp(date: string, time: string): string {
  const [y, m, d] = date.split("-");
  const [hh = "00", mm = "00"] = time.split(":");
  return `${y}${m}${d}T${hh.padStart(2, "0")}${mm.padStart(2, "0")}00`;
}

function addHours(time: string, hours: number): string {
  const [hh, mm] = time.split(":").map((n) => parseInt(n, 10));
  const total = (hh * 60 + mm + hours * 60) % (24 * 60);
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/**
 * "Add to calendar" control. Offers a Google Calendar link plus a downloadable
 * .ics file generated entirely client-side from the event's date/time/venue —
 * works with any calendar app, no backend, no API key.
 */
export function AddToCalendar({
  title,
  date,
  startTime,
  endTime,
  venueName,
  venueAddress,
  description,
  className,
}: Props) {
  const [done, setDone] = useState(false);
  if (!date) return null;

  const start = startTime || "18:00";
  const end = endTime || addHours(start, 2);
  const location = [venueName, venueAddress].filter(Boolean).join(", ");
  const startStamp = stamp(date, start);
  const endStamp = stamp(date, end);

  const googleHref =
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    `&text=${encodeURIComponent(title)}` +
    `&dates=${startStamp}/${endStamp}` +
    (description ? `&details=${encodeURIComponent(description)}` : "") +
    (location ? `&location=${encodeURIComponent(location)}` : "");

  const downloadIcs = () => {
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Event Platform//EN",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      `UID:${startStamp}-${encodeURIComponent(title)}@event-platform`,
      `DTSTART:${startStamp}`,
      `DTEND:${endStamp}`,
      `SUMMARY:${title}`,
      description ? `DESCRIPTION:${description.replace(/\n/g, "\\n")}` : "",
      location ? `LOCATION:${location}` : "",
      "END:VEVENT",
      "END:VCALENDAR",
    ]
      .filter(Boolean)
      .join("\r\n");

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.ics`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setDone(true);
    window.setTimeout(() => setDone(false), 2500);
  };

  return (
    <div className={`flex flex-wrap items-center justify-center gap-3 ${className ?? ""}`}>
      <a
        href={googleHref}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--accent)]"
      >
        <span aria-hidden>📅</span> Add to Google Calendar
      </a>
      <button
        type="button"
        onClick={downloadIcs}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-current/30 text-sm font-medium hover:bg-current/5 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--accent)]"
      >
        {done ? "Saved ✓" : "Download .ics"}
      </button>
    </div>
  );
}
