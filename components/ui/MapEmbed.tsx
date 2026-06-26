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

export function MapEmbed({ latitude, longitude, venueName, venueAddress, mapLink }: Props) {
  const directionsHref =
    mapLink ??
    (latitude != null && longitude != null
      ? `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
      : venueAddress
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venueAddress)}`
        : undefined);

  return (
    <div className="space-y-4">
      {latitude != null && longitude != null && (
        <div className="rounded-xl overflow-hidden border border-black/10">
          <LeafletMap lat={latitude} lng={longitude} label={venueName ?? "Venue"} />
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
