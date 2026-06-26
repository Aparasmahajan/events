type Props = { enabled?: boolean; linkOrContact?: string; contactName?: string };

export function RSVP({ enabled, linkOrContact, contactName }: Props) {
  if (!enabled) return null;
  const isUrl = linkOrContact?.startsWith("http");
  return (
    <div className="text-center">
      <h3 className="font-display text-3xl mb-3">Will you join us?</h3>
      <p className="opacity-80 max-w-md mx-auto mb-6">
        Your presence is the gift we&apos;re looking forward to. Please let us know if you can make it.
      </p>
      {linkOrContact ? (
        isUrl ? (
          <a
            href={linkOrContact}
            target="_blank"
            rel="noreferrer"
            className="inline-block px-7 py-3 rounded-full bg-[var(--accent)] text-white font-medium hover:opacity-90 transition"
          >
            RSVP now
          </a>
        ) : (
          <a
            href={`tel:${linkOrContact}`}
            className="inline-block px-7 py-3 rounded-full bg-[var(--accent)] text-white font-medium hover:opacity-90 transition"
          >
            RSVP — {linkOrContact}
          </a>
        )
      ) : (
        <p className="opacity-70 text-sm">RSVP coming soon{contactName ? ` — contact ${contactName}` : ""}.</p>
      )}
    </div>
  );
}
