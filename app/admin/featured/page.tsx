import { EVENT_TYPES } from "@/config/eventTypes";
import { TEMPLATES_META, getTemplatesForEventType } from "@/components/templates/metadata";
import { getFeaturedMap } from "@/lib/sheets";
import { FeaturedEditor, type FeaturedGroup } from "./FeaturedEditor";

// Admin should always see the latest saved featured lists.
export const dynamic = "force-dynamic";

export default async function AdminFeaturedPage() {
  const featured = await getFeaturedMap();

  const groups: FeaturedGroup[] = [
    {
      type: "all",
      label: "Landing page (all templates)",
      options: TEMPLATES_META.map((t) => ({
        id: t.id,
        name: t.name,
        // On the landing tab a template has no single event type, so show the
        // route a visitor would actually land on — its primary type.
        path: `/events/${t.eventTypes[0]}/${t.id}`,
        types: t.eventTypes,
      })),
    },
    ...EVENT_TYPES.map((t) => ({
      type: t.id,
      label: `${t.emoji} ${t.label}`,
      options: getTemplatesForEventType(t.id).map((m) => ({
        id: m.id,
        name: m.name,
        path: `/events/${t.id}/${m.id}`,
        types: m.eventTypes,
      })),
    })),
  ];

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="mb-1 font-display text-2xl sm:text-3xl">Featured templates</h1>
      <p className="mb-6 text-sm opacity-70 sm:mb-8">
        Curate which templates lead the <strong>Featured</strong> sort — separately for the landing
        page and each event type. Order top-to-bottom = the order shown. You can add by name or by
        pasting a page path.
      </p>
      <FeaturedEditor groups={groups} featured={featured} />
    </main>
  );
}
