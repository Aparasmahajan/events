import { NextResponse } from "next/server";
import { TEMPLATES_META } from "@/components/templates/metadata";

/**
 * Public, read-only list of templates with their event types. Used by
 * scripts/generate-template-previews.mjs so it can screenshot one preview per
 * (template × event type) without duplicating the metadata.
 */
export function GET() {
  return NextResponse.json({
    templates: TEMPLATES_META.map((t) => ({
      id: t.id,
      name: t.name,
      eventTypes: t.eventTypes,
    })),
  });
}
