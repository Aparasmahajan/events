"use client";

import { useEffect, useState } from "react";

/**
 * Template card thumbnail that prefers the per-event-type preview
 * (`/template-previews/<type>/<id>.jpg`) and falls back to the shared preview
 * if that file hasn't been generated yet. Plain <img> so onError can fall back
 * (a CSS background-image can't).
 */
export function TemplateThumb({
  eventType,
  id,
  fallback,
  alt,
  className,
}: {
  eventType: string;
  id: string;
  fallback: string;
  alt: string;
  className?: string;
}) {
  const typeSrc = `/template-previews/${eventType}/${id}.jpg`;
  const [src, setSrc] = useState(typeSrc);

  // Reset when the target changes (e.g. filtering re-renders the grid).
  useEffect(() => setSrc(typeSrc), [typeSrc]);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => {
        if (src !== fallback) setSrc(fallback);
      }}
      className={className}
    />
  );
}
