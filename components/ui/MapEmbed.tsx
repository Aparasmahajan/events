"use client";

import dynamic from "next/dynamic";

type Props = {
  latitude?: number;
  longitude?: number;
  venueName?: string;
  venueAddress?: string;
  mapLink?: string;
};

const LeafletMap = dynamic(() => import("./LeafletMap").then((m) => m.LeafletMap), {
  ssr: false,
  loading: () => (
    <div className="h-72 rounded-xl bg-neutral-100 animate-pulse" aria-label="Loading map" />
  ),
});

/**
 * Pull lat/long out of a pasted Google Maps URL so customers who only paste a
 * link still get a pinned map (most full Maps links embed the coordinates).
 * Handles: `@lat,lng`, `q=/query=/ll=/destination=/daddr=lat,lng`, and the
 * `!3dlat!4dlng` form found in place URLs. Returns null for short links
 * (maps.app.goo.gl / goo.gl/maps) that carry no coordinates.
 */
export function parseLatLng(link?: string): { lat: number; lng: number } | null {
  if (!link) return null;
  const patterns = [
    /@(-?\d{1,3}\.\d+),(-?\d{1,3}\.\d+)/,
    /[?&](?:q|query|ll|sll|center|destination|daddr)=(-?\d{1,3}\.\d+),(-?\d{1,3}\.\d+)/i,
    /!3d(-?\d{1,3}\.\d+)!4d(-?\d{1,3}\.\d+)/,
  ];
  for (const re of patterns) {
    const m = link.match(re);
    if (m) {
      const lat = parseFloat(m[1]);
      const lng = parseFloat(m[2]);
      if (
        Number.isFinite(lat) &&
        Number.isFinite(lng) &&
        Math.abs(lat) <= 90 &&
        Math.abs(lng) <= 180
      ) {
        return { lat, lng };
      }
    }
  }
  return null;
}

export function MapEmbed({ latitude, longitude, venueName, venueAddress, mapLink }: Props) {
  // Prefer explicit coordinates; otherwise try to recover them from the link.
  const fromLink = latitude == null || longitude == null ? parseLatLng(mapLink) : null;
  const lat = latitude ?? fromLink?.lat;
  const lng = longitude ?? fromLink?.lng;
  const hasPin = lat != null && lng != null;

  const directionsHref =
    mapLink ??
    (hasPin
      ? `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
      : venueAddress
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venueAddress)}`
        : undefined);

  return (
    <div className="space-y-4">
      {lat != null && lng != null && (
        <div className="rounded-xl overflow-hidden border border-black/10">
          <LeafletMap lat={lat} lng={lng} label={venueName ?? "Venue"} />
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          {venueName && <p className="font-display text-xl">{venueName}</p>}
          {venueAddress && <p className="text-sm opacity-70">{venueAddress}</p>}
        </div>
        {directionsHref && (
          <a
            href={directionsHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 transition"
          >
            Get directions →
          </a>
        )}
      </div>
    </div>
  );
}
