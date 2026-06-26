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

export const auroraMeta: TemplateMeta = {
  id: "aurora",
  name: "Aurora Scroll",
  description:
    "A scroll-choreographed wedding journey — the page transforms as you move, with a sideways photo reel and parallax names. Our most interactive template.",
  eventTypes: ["wedding", "engagement", "anniversary"],
  tags: ["cinematic", "interactive", "modern", "luxurious", "romantic", "cool", "bold"],
  previewImage:
    "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=800&q=80",
  defaults: {
    invitationMessage:
      "Scroll with us through the story that brought us here — and the day we say forever.",
    tagline: "A love, unfolding.",
    accentColor: "#22d3ee",
    heroImage:
      "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "Every scroll is a chapter — the first hello, the long way round, and the moment we both knew. Keep going; the best part is still ahead.",
  },
};

export const botanicalMeta: TemplateMeta = {
  id: "botanical",
  name: "Botanical Garden",
  description:
    "Editorial, organic and modern — arched frames, a hand-set monogram and warm sage tones for a garden wedding.",
  eventTypes: ["wedding", "engagement", "anniversary"],
  tags: ["botanical", "editorial", "romantic", "elegant", "decent", "appealing"],
  previewImage:
    "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
  defaults: {
    invitationMessage:
      "Under open skies and good company, we'd love to gather the people we love.",
    tagline: "Grow together.",
    accentColor: "#6f7d54",
    heroImage:
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "We're the kind of couple who plans the whole evening around the garden light. Come share a long table, slow conversation and one very good sunset.",
  },
};

export const fiestaMeta: TemplateMeta = {
  id: "fiesta",
  name: "Neon Fiesta",
  description:
    "After-dark party energy — glowing type, an animated gradient and tap-to-celebrate confetti. Built for milestone and grown-up birthdays.",
  eventTypes: ["birthday", "engagement"],
  tags: ["neon", "vibrant", "bold", "festive", "playful", "cool", "interactive"],
  previewImage:
    "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80",
  defaults: {
    invitationMessage:
      "Clear your Saturday. We're turning the lights down and the music up.",
    tagline: "Let's glow.",
    accentColor: "#ff2e9a",
    heroImage:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "One night, your favorite people, a playlist that has no business being this good. Come dressed to be photographed.",
  },
};

export const storybookMeta: TemplateMeta = {
  id: "storybook",
  name: "Storybook",
  description:
    "A bright, illustrated kids' party page — bunting, floating balloons and a pop-for-confetti surprise. Playful, warm and impossible to resist.",
  eventTypes: ["birthday"],
  tags: ["whimsical", "playful", "festive", "vibrant", "appealing", "interactive"],
  previewImage:
    "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80",
  defaults: {
    invitationMessage:
      "There will be cake, there will be games, and there will absolutely be too much sugar. Come play!",
    tagline: "Hip hip hooray!",
    accentColor: "#3aaed8",
    heroImage:
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "Our favorite little human is leveling up. Expect balloons, a bouncy castle's worth of energy, and a birthday wish made at exactly the right moment.",
  },
};

export const TEMPLATES_META: TemplateMeta[] = [
  auroraMeta,
  royalMeta,
  botanicalMeta,
  minimalMeta,
  modernMeta,
  fiestaMeta,
  vibrantMeta,
  storybookMeta,
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
  cinematic: "Cinematic",
  interactive: "Interactive",
  botanical: "Botanical",
  editorial: "Editorial",
  neon: "Neon",
  whimsical: "Whimsical",
};
