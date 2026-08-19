import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getFeaturedMap, setFeaturedForType } from "@/lib/sheets";
import { EVENT_TYPES } from "@/config/eventTypes";

// Protected by middleware (/api/admin/*). "all" drives the landing page order.
const VALID = new Set<string>([...EVENT_TYPES.map((t) => t.id), "all"]);

export async function GET() {
  const featured = await getFeaturedMap();
  return NextResponse.json({ featured });
}

export async function POST(req: Request) {
  let body: { eventType?: string; templateIds?: unknown } = {};
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventType = String(body.eventType ?? "");
  if (!VALID.has(eventType)) {
    return NextResponse.json({ error: "Unknown event type" }, { status: 400 });
  }
  if (
    !Array.isArray(body.templateIds) ||
    body.templateIds.some((x) => typeof x !== "string")
  ) {
    return NextResponse.json({ error: "templateIds must be string[]" }, { status: 400 });
  }
  const ids = [...new Set(body.templateIds as string[])];

  await setFeaturedForType(eventType, ids);

  // Reflect immediately on the affected listing(s).
  if (eventType === "all") revalidatePath("/");
  else revalidatePath(`/events/${eventType}`);

  return NextResponse.json({ ok: true, eventType, count: ids.length });
}
