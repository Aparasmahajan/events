import type { EventType, TemplateMeta, TemplateTag } from "@/lib/types";

export const royalMeta: TemplateMeta = {
  id: "royal",
  name: "Royal Heritage",
  description: "Ornate, luxurious, traditional — built for grand Indian weddings.",
  eventTypes: ["wedding", "engagement", "anniversary"],
  tags: ["royal", "elegant", "luxurious", "traditional", "appealing", "romantic"],
  previewImage:
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
  defaults: {
    invitationMessage:
      "With the blessings of our families, we invite you to share in the joy of our wedding celebration.",
    tagline: "Two souls. One forever.",
    accentColor: "#a3792c",
    heroImage:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "A love written in monsoons, mountains and quiet evenings. Today, we make it official.",
  },
};

export const minimalMeta: TemplateMeta = {
  id: "minimal",
  name: "Minimal Mono",
  description: "Clean, editorial, whitespace-led — equally at home for weddings or corporate.",
  eventTypes: ["wedding", "corporate", "anniversary", "engagement"],
  tags: ["minimal", "decent", "modern", "elegant", "monochrome"],
  previewImage:
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80",
  defaults: {
    invitationMessage: "We'd be honored by your presence.",
    tagline: "A quiet kind of joy.",
    accentColor: "#111111",
    heroImage:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1600&q=80",
  },
};

export const modernMeta: TemplateMeta = {
  id: "modern",
  name: "Modern Noir",
  description: "Dark, cinematic and design-forward. For events that want to feel like an album drop.",
  eventTypes: ["wedding", "birthday", "corporate", "engagement"],
  tags: ["modern", "cool", "appealing", "bold"],
  previewImage:
    "https://images.unsplash.com/photo-1513279014891-1d6cccc6a0a4?auto=format&fit=crop&w=800&q=80",
  defaults: {
    invitationMessage: "Some moments deserve a soundtrack. This is one of them.",
    tagline: "It's happening.",
    accentColor: "#7c3aed",
    heroImage:
      "https://images.unsplash.com/photo-1513279014891-1d6cccc6a0a4?auto=format&fit=crop&w=1600&q=80",
  },
};

export const vibrantMeta: TemplateMeta = {
  id: "vibrant",
  name: "Vibrant Pop",
  description: "Bright, playful and full of confetti energy. Perfect for birthdays and engagements.",
  eventTypes: ["birthday", "engagement", "anniversary"],
  tags: ["vibrant", "cool", "appealing", "playful", "festive", "bold"],
  previewImage:
    "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80",
  defaults: {
    invitationMessage: "Confetti, cake and chaos — you're in.",
    tagline: "Let's party!",
    accentColor: "#ff5fa2",
    heroImage:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1600&q=80",
  },
};

export const pastelMeta: TemplateMeta = {
  id: "pastel",
  name: "Pastel Bloom",
  description: "Soft palette and gentle typography — romantic without being heavy.",
  eventTypes: ["wedding", "engagement", "anniversary", "birthday"],
  tags: ["romantic", "pastel", "elegant", "decent", "appealing"],
  previewImage:
    "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80",
  defaults: {
    invitationMessage: "A soft hello, a warm welcome — we'd love you to be there.",
    tagline: "Soft beginnings.",
    accentColor: "#e8a0a0",
    heroImage:
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1600&q=80",
  },
};

export const TEMPLATES_META: TemplateMeta[] = [
  royalMeta,
  minimalMeta,
  modernMeta,
  vibrantMeta,
  pastelMeta,
];

export function getTemplateMeta(id: string): TemplateMeta | undefined {
  return TEMPLATES_META.find((t) => t.id === id);
}

export function getTemplatesForEventType(eventType: EventType): TemplateMeta[] {
  return TEMPLATES_META.filter((t) => t.eventTypes.includes(eventType));
}

export function filterTemplates(opts: {
  eventType?: EventType;
  tags?: TemplateTag[];
}): TemplateMeta[] {
  return TEMPLATES_META.filter((t) => {
    if (opts.eventType && !t.eventTypes.includes(opts.eventType)) return false;
    if (opts.tags && opts.tags.length > 0 && !opts.tags.some((tag) => t.tags.includes(tag))) return false;
    return true;
  });
}

export const TAG_LABELS: Record<TemplateTag, string> = {
  cool: "Cool",
  decent: "Decent",
  appealing: "Appealing",
  elegant: "Elegant",
  royal: "Royal",
  minimal: "Minimal",
  modern: "Modern",
  traditional: "Traditional",
  vibrant: "Vibrant",
  romantic: "Romantic",
  luxurious: "Luxurious",
  playful: "Playful",
  festive: "Festive",
  monochrome: "Monochrome",
  pastel: "Pastel",
  bold: "Bold",
};
