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
  name: "Aurora",
  description:
    "A futuristic luxury wedding rendered as a cinematic experience — a hero that recedes into an editorial plate, names that letter-reveal under a moonlight beam, a sideways album of moments, and events as floating islands. Midnight, aurora light, champagne.",
  eventTypes: ["wedding", "engagement", "anniversary"],
  tags: ["cinematic", "interactive", "luxurious", "modern", "romantic", "bold", "cool"],
  previewImage:
    "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=800&q=80",
  defaults: {
    invitationMessage:
      "Beneath a sky we'll never forget, we ask you to witness the night two stories become one.",
    tagline: "Two orbits, one light.",
    accentColor: "#d8b46a",
    heroImage:
      "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "It began as a small gravity — a glance that bent the evening. Years later the pull is a certainty, and we'd like the people we love around us when we name it out loud.",
  },
};

export const obsidianMeta: TemplateMeta = {
  id: "obsidian",
  name: "Obsidian",
  description:
    "A cinematic film in burnt bronze on black — acts that slide over one another, sliced kinetic typography and clip-path photo reveals. Editorial, architectural, restrained.",
  eventTypes: ["wedding", "engagement", "anniversary"],
  tags: ["cinematic", "editorial", "luxurious", "bold", "modern", "cool"],
  previewImage:
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80",
  defaults: {
    invitationMessage:
      "No grand announcement. Only the people who matter, in a room that will remember the night.",
    tagline: "An evening, in acts.",
    accentColor: "#b5763a",
    heroImage:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "We are not for spectacle. We are for the long table, the low light, the last song — and the few who'll still be dancing when it plays.",
  },
};

export const celestiaMeta: TemplateMeta = {
  id: "celestia",
  name: "Celestia",
  description:
    "Ethereal and weightless — a glass orb that turns as you scroll, photographs that float, and a ribbon that threads the day together. Dusty lavender, ice blue, pearl.",
  eventTypes: ["wedding", "engagement", "anniversary"],
  tags: ["elegant", "romantic", "luxurious", "cinematic", "cool", "appealing"],
  previewImage:
    "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80",
  defaults: {
    invitationMessage:
      "Somewhere between a wish and a certainty, we found each other — and we'd love you there when we make it real.",
    tagline: "Written in the stars.",
    accentColor: "#7c6bb0",
    heroImage:
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "A slow orbit of small coincidences that stopped feeling like coincidence. This is the part where two paths quietly become one.",
  },
};

export const nexusMeta: TemplateMeta = {
  id: "nexus",
  name: "Nexus",
  description:
    "A futuristic product reveal rendered as a cyberpunk experience — particles coalesce into meaning, a circuit-board timeline maps the roadmap, and features float as holographic glass cards. Midnight void, neon cyan, electric violet.",
  eventTypes: ["product-launch", "corporate"],
  tags: ["cyberpunk", "tech", "bold", "modern", "cinematic", "interactive"],
  previewImage:
    "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80",
  defaults: {
    invitationMessage: "The future isn't waiting. Neither should you.",
    tagline: "The future is arriving.",
    accentColor: "#00f0ff",
    heroImage:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "Every great product begins with a question. We asked ours. The answer changed everything we thought possible — and we're ready to share it.",
  },
};

export const pinnacleMeta: TemplateMeta = {
  id: "pinnacle",
  name: "Pinnacle",
  description:
    "Where leaders ascend — a glass-and-light summit experience. Crystal whites, deep navy, warm gold. Elevated typography, a climb-through agenda, and the light of a mountain peak at sunrise.",
  eventTypes: ["corporate"],
  tags: ["premium", "glass", "architectural", "minimal", "elegant", "modern"],
  previewImage:
    "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80",
  defaults: {
    invitationMessage: "Join the brightest minds at the peak of industry conversation.",
    tagline: "Where leaders ascend.",
    accentColor: "#d4a853",
    heroImage:
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "A gathering of pioneers, builders, and visionaries — three days of conversations that will define the next decade.",
  },
};

export const luminaryMeta: TemplateMeta = {
  id: "luminary",
  name: "Luminary",
  description:
    "Celestial glamour meets Hollywood's golden age — constellations form from award categories, portraits float in dark velvet, and every scroll reveals another star. Midnight velvet, celestial gold, rose glow.",
  eventTypes: ["award-ceremony", "corporate"],
  tags: ["celestial", "premium", "luxurious", "cinematic", "elegant", "artistic"],
  previewImage:
    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80",
  defaults: {
    invitationMessage: "A night among the stars — celebrating those who dare to shine brightest.",
    tagline: "A night among the stars.",
    accentColor: "#f0cf7a",
    heroImage:
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "Every year, we gather to honour the visionaries, the risk-takers, the ones who refuse to blend in. This year, the constellation grows brighter still.",
  },
};

export const afterMeta: TemplateMeta = {
  id: "after",
  name: "After",
  description:
    "Underground club meets digital art — a nightlife template that breathes. Laser beams sweep across a void canvas, neon typography pulses to an imaginary beat, and the night unfolds in waves. Void black, electric pink, UV purple.",
  eventTypes: ["party", "birthday"],
  tags: ["neon", "bold", "vibrant", "festive", "playful", "modern"],
  previewImage:
    "https://images.unsplash.com/photo-1578645635737-6a88f7060a3e?auto=format&fit=crop&w=800&q=80",
  defaults: {
    invitationMessage: "The address is in your phone. The vibe is in your head. The rest is up to the night.",
    tagline: "The night is yours.",
    accentColor: "#ff2d78",
    heroImage:
      "https://images.unsplash.com/photo-1578645635737-6a88f7060a3e?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "No dress code but confidence. No entry policy but good energy. The music finds the level it needs to be. The rest is chemistry.",
  },
};

export const convergeMeta: TemplateMeta = {
  id: "converge",
  name: "Converge",
  description:
    "Organic, warm, alive — a networking experience that feels like a living organism. Amber blobs drift in cream space, floating dots pulse like a neural network, and connection cards glow with warmth.",
  eventTypes: ["networking-event", "corporate"],
  tags: ["organic", "artistic", "modern", "appealing", "cool", "playful"],
  previewImage:
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
  defaults: {
    invitationMessage: "Come as you are. Leave with a network that believes in what you build.",
    tagline: "Where connections find their moment.",
    accentColor: "#f5a623",
    heroImage:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "An evening designed for serendipity. No name tags, no awkward icebreakers. Just the right people, in the right room, at the right moment.",
  },
};

export const TEMPLATES_META: TemplateMeta[] = [
  nexusMeta,
  pinnacleMeta,
  luminaryMeta,
  convergeMeta,
  afterMeta,
  auroraMeta,
  obsidianMeta,
  celestiaMeta,
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
  cinematic: "Cinematic",
  interactive: "Interactive",
  botanical: "Botanical",
  editorial: "Editorial",
  neon: "Neon",
  whimsical: "Whimsical",
  cyberpunk: "Cyberpunk",
  glass: "Glass",
  premium: "Premium",
  organic: "Organic",
  celestial: "Celestial",
  architectural: "Architectural",
  tech: "Tech",
  artistic: "Artistic",
};
