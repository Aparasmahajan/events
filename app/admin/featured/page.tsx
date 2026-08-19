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
      options: TEMPLATES_META.map((t) => ({ id: t.id, name: t.name })),
    },
    ...EVENT_TYPES.map((t) => ({
      type: t.id,
      label: `${t.emoji} ${t.label}`,
      options: getTemplatesForEventType(t.id).map((m) => ({ id: m.id, name: m.name })),
    })),
  ];

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="font-display text-3xl mb-1">Featured templates</h1>
      <p className="text-sm opacity-70 mb-8">
        Curate which templates lead the <strong>Featured</strong> sort — separately for the
        landing page and each event type. Order top-to-bottom = the order shown.
      </p>
      <FeaturedEditor groups={groups} featured={featured} />
    </main>
  );
}
