type Props = {
  enabled?: boolean;
  linkOrContact?: string;
  contactName?: string;
  type?: "email" | "phone" | "url" | "text";
};

function inferType(value: string): "email" | "phone" | "url" | "text" {
  const v = value.trim();
  if (/^https?:\/\//i.test(v)) return "url";
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "email";
  if (/^\+?[0-9][0-9\-\s()]{6,}$/.test(v)) return "phone";
  return "text";
}

export function RSVP({ enabled, linkOrContact, contactName, type }: Props) {
  if (!enabled) return null;
  const value = linkOrContact?.trim() ?? "";
  const resolvedType = type ?? (value ? inferType(value) : "text");

  return (
    <div className="text-center">
      <h3 className="font-display text-3xl mb-3">Will you join us?</h3>
      <p className="opacity-80 max-w-md mx-auto mb-6">
        Your presence is the gift we&apos;re looking forward to. Please let us know if you can make it.
      </p>

      {value ? (
        <RsvpAction value={value} type={resolvedType} />
      ) : (
        <p className="opacity-70 text-sm">
          RSVP coming soon{contactName ? ` — contact ${contactName}` : ""}.
        </p>
      )}
    </div>
  );
}

function RsvpAction({ value, type }: { value: string; type: "email" | "phone" | "url" | "text" }) {
  const className =
    "inline-block px-7 py-3 rounded-full bg-[var(--accent)] text-white font-medium hover:opacity-90 transition";

  if (type === "url") {
    return (
      <a href={value} target="_blank" rel="noreferrer" className={className}>
        RSVP now
      </a>
    );
  }
  if (type === "email") {
    return (
      <a href={`mailto:${value}`} className={className}>
        RSVP — {value}
      </a>
    );
  }
  if (type === "phone") {
    return (
      <a href={`tel:${value.replace(/\s/g, "")}`} className={className}>
        RSVP — {value}
      </a>
    );
  }
  // Plain text — no link, just present the instruction.
  return (
    <p className="text-base sm:text-lg font-medium opacity-90 max-w-md mx-auto whitespace-pre-wrap">
      {value}
    </p>
  );
}
