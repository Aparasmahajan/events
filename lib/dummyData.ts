import type { EventData, MediaItem, SubEvent } from "@/lib/types";

const UNSPLASH = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

// Always-available fallback for items where no themed photo is curated yet.
const PICSUM = (seed: string, w = 1200, h = 1500) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;

// Curated, verified Unsplash photo IDs reused across demos. Adding a new
// sample is a one-line change — just append to this map and reference by key.
const SAMPLES = {
  coupleSunset: UNSPLASH("photo-1519741497674-611481863552", 1200),
  weddingRings: UNSPLASH("photo-1511795409834-ef04bbd61622", 1200),
  pinkFlowers: UNSPLASH("photo-1465495976277-4387d4b0b4c6", 1200),
  coupleBehind: UNSPLASH("photo-1606216794074-735e91aa2c92", 1200),
  coupleEmbrace: UNSPLASH("photo-1519225421980-715cb0215aed", 1200),
  weddingScene: UNSPLASH("photo-1513279014891-1d6cccc6a0a4", 1200),
  bouquet: UNSPLASH("photo-1583939003579-730e3918a45a", 1200),
  ringsClose: UNSPLASH("photo-1519010470956-9c2b29eb13ce", 1200),
  coupleHands: UNSPLASH("photo-1525258946800-98cfd641d0de", 1200),
  conference: UNSPLASH("photo-1540575467063-178a50c2df87", 1200),
  confetti: UNSPLASH("photo-1530103862676-de8c9debad1d", 1200),
} as const;

export type DemoBundle = {
  event: EventData;
  subEvents: SubEvent[];
  media: MediaItem[];
};

// ---------- helpers ----------

function gallery(code: string, items: { url: string; caption?: string }[]): MediaItem[] {
  return items.map((g, i) => ({
    eventCode: code,
    mediaType: "image",
    section: "gallery",
    fileName: `g${i + 1}.jpg`,
    publicUrl: g.url,
    caption: g.caption,
    sortOrder: i + 1,
  }));
}

function hero(code: string, id: string): MediaItem {
  return {
    eventCode: code,
    mediaType: "image",
    section: "hero",
    fileName: "hero.jpg",
    publicUrl: UNSPLASH(id),
    sortOrder: 0,
  };
}

// ---------- ROYAL — WED-2026-0001 ----------

const ROYAL_CODE = "WED-2026-0001";
const royal: DemoBundle = {
  event: {
    eventCode: ROYAL_CODE,
    eventType: "wedding",
    templateId: "royal",
    eventTitle: "Rahul weds Priya",
    person1Name: "Rahul",
    person2Name: "Priya",
    tentativeDate: "2026-12-14",
    city: "Udaipur",
    isActive: true,
    slug: ROYAL_CODE,
    heroImageUrl: UNSPLASH("photo-1519741497674-611481863552"),
    tagline: "Two souls. One forever.",
    invitationMessage:
      "With the blessings of our families, we joyfully invite you to celebrate the beginning of our forever.",
    aboutStory:
      "From a chance meeting in a Mumbai monsoon to a promise made under the Aravalli sky — our journey has been written in every shared smile.",
    mainDate: "2026-12-14",
    mainStartTime: "18:30",
    mainEndTime: "23:00",
    themeAccentColor: "#a3792c",
    venueName: "The Leela Palace, Udaipur",
    venueAddress: "Lake Pichola, Udaipur, Rajasthan",
    mapLink: "https://maps.google.com/?q=The+Leela+Palace+Udaipur",
    latitude: 24.5854,
    longitude: 73.6818,
    contactName: "Anita (Family)",
    contactPhone: "+91-98xxxxxxx",
    contactEmail: "rsvp@example.com",
    socialLink: "https://instagram.com/",
    rsvpEnabled: true,
    rsvpLinkOrContact: "https://forms.example/rsvp",
  },
  subEvents: [
    { eventCode: ROYAL_CODE, order: 1, name: "Mehndi", date: "2026-12-12", startTime: "11:00", endTime: "15:00", venueName: "Lawn at the Leela", venueAddress: "Lake Pichola, Udaipur", dressCode: "Mustard & emerald", description: "Intimate henna ceremony with live qawwali.", icon: "🌿" },
    { eventCode: ROYAL_CODE, order: 2, name: "Haldi", date: "2026-12-13", startTime: "10:00", endTime: "13:00", venueName: "Courtyard", venueAddress: "Lake Pichola, Udaipur", dressCode: "Yellow", description: "Traditional turmeric ceremony — bring your dancing shoes.", icon: "☀️" },
    { eventCode: ROYAL_CODE, order: 3, name: "Sangeet", date: "2026-12-13", startTime: "19:00", endTime: "23:00", venueName: "Durbar Hall", venueAddress: "Lake Pichola, Udaipur", dressCode: "Royal blue & gold", description: "An evening of music, mischief and family choreography.", icon: "🎶" },
    { eventCode: ROYAL_CODE, order: 4, name: "Wedding", date: "2026-12-14", startTime: "18:30", endTime: "23:00", venueName: "Pavilion by the lake", venueAddress: "Lake Pichola, Udaipur", dressCode: "Traditional formal", description: "Phere under the stars — the heart of it all.", icon: "💍" },
    { eventCode: ROYAL_CODE, order: 5, name: "Reception", date: "2026-12-15", startTime: "20:00", endTime: "00:00", venueName: "Grand Ballroom", venueAddress: "Lake Pichola, Udaipur", dressCode: "Black-tie / Indo-western", description: "Cocktails, dinner and dancing.", icon: "🥂" },
  ],
  media: [
    hero(ROYAL_CODE, "photo-1519741497674-611481863552"),
    ...gallery(ROYAL_CODE, [
      { url: SAMPLES.coupleEmbrace, caption: "First look" },
      { url: SAMPLES.weddingScene, caption: "Mandap" },
      { url: SAMPLES.coupleBehind, caption: "Family" },
      { url: SAMPLES.ringsClose, caption: "Pheras" },
      { url: SAMPLES.pinkFlowers, caption: "Reception" },
      { url: SAMPLES.bouquet, caption: "Bride" },
      { url: SAMPLES.coupleHands, caption: "Groom" },
      { url: SAMPLES.coupleSunset, caption: "Together" },
    ]),
  ],
};

// ---------- MINIMAL — WED-2026-0002 ----------

const MINIMAL_CODE = "WED-2026-0002";
const minimal: DemoBundle = {
  event: {
    eventCode: MINIMAL_CODE,
    eventType: "wedding",
    templateId: "minimal",
    eventTitle: "Mira & Theo",
    person1Name: "Mira",
    person2Name: "Theo",
    tentativeDate: "2026-11-08",
    city: "Goa",
    isActive: true,
    slug: MINIMAL_CODE,
    heroImageUrl: UNSPLASH("photo-1511795409834-ef04bbd61622"),
    tagline: "A quiet kind of joy.",
    invitationMessage:
      "Two of us, our closest people, the sea. We'd love you to be there.",
    aboutStory:
      "We met over a shared playlist and stayed for the long quiet mornings. Eight years on, we're making it official — barefoot, by the water.",
    mainDate: "2026-11-08",
    mainStartTime: "16:30",
    mainEndTime: "22:00",
    themeAccentColor: "#111111",
    venueName: "Casa da Praia",
    venueAddress: "Anjuna, Goa",
    mapLink: "https://maps.google.com/?q=Anjuna+Goa",
    latitude: 15.5731,
    longitude: 73.7406,
    contactName: "Mira & Theo",
    rsvpEnabled: true,
    rsvpLinkOrContact: "rsvp@miraandtheo.com",
  },
  subEvents: [
    { eventCode: MINIMAL_CODE, order: 1, name: "Welcome drinks", date: "2026-11-07", startTime: "19:00", endTime: "22:00", venueName: "Beachside terrace", venueAddress: "Casa da Praia, Anjuna", description: "An easy evening to say hello.", icon: "🍸" },
    { eventCode: MINIMAL_CODE, order: 2, name: "The ceremony", date: "2026-11-08", startTime: "16:30", endTime: "17:30", venueName: "On the sand", venueAddress: "Casa da Praia, Anjuna", dressCode: "Linen & light tones", description: "A short, intentional ceremony at golden hour.", icon: "🌊" },
    { eventCode: MINIMAL_CODE, order: 3, name: "Dinner", date: "2026-11-08", startTime: "19:30", endTime: "22:00", venueName: "Long table on the terrace", venueAddress: "Casa da Praia, Anjuna", description: "One long table, candlelight, the people we love.", icon: "🕯️" },
  ],
  media: [
    hero(MINIMAL_CODE, "photo-1511795409834-ef04bbd61622"),
    ...gallery(MINIMAL_CODE, [
      { url: SAMPLES.coupleSunset, caption: "Together" },
      { url: SAMPLES.weddingRings, caption: "Slow morning" },
      { url: SAMPLES.coupleHands, caption: "First look" },
      { url: SAMPLES.bouquet, caption: "By the sea" },
    ]),
  ],
};

// ---------- MODERN — CORP-2026-0001 ----------

const MODERN_CODE = "CORP-2026-0001";
const modern: DemoBundle = {
  event: {
    eventCode: MODERN_CODE,
    eventType: "corporate",
    templateId: "modern",
    eventTitle: "Azalio Summit 2026",
    person1Name: "Azalio",
    tentativeDate: "2026-09-22",
    city: "Mumbai",
    isActive: true,
    slug: MODERN_CODE,
    heroImageUrl: UNSPLASH("photo-1540575467063-178a50c2df87"),
    tagline: "Build · Ship · Scale",
    invitationMessage:
      "A full day of keynotes, case studies and candid hallway conversations with product leaders.",
    aboutStory:
      "Azalio Summit returns for its third year. 600 attendees, 18 speakers, one shared agenda — ship faster without breaking what matters.",
    mainDate: "2026-09-22",
    mainStartTime: "09:00",
    mainEndTime: "21:00",
    themeAccentColor: "#7c3aed",
    venueName: "BKC Convention Center",
    venueAddress: "Bandra Kurla Complex, Mumbai",
    mapLink: "https://maps.google.com/?q=BKC+Convention+Center+Mumbai",
    latitude: 19.0596,
    longitude: 72.8656,
    contactName: "Azalio events team",
    contactEmail: "events@azalio.io",
    rsvpEnabled: true,
    rsvpLinkOrContact: "https://summit.azalio.io/register",
  },
  subEvents: [
    { eventCode: MODERN_CODE, order: 1, name: "Registration & breakfast", date: "2026-09-22", startTime: "09:00", endTime: "10:00", venueName: "Foyer", venueAddress: "BKC Convention Center", description: "Pick up your badge and a flat white.", icon: "☕" },
    { eventCode: MODERN_CODE, order: 2, name: "Opening keynote", date: "2026-09-22", startTime: "10:00", endTime: "11:00", venueName: "Hall A", venueAddress: "BKC Convention Center", description: "Where the next decade of product work is heading.", icon: "🎤" },
    { eventCode: MODERN_CODE, order: 3, name: "Case-study tracks", date: "2026-09-22", startTime: "11:30", endTime: "17:00", venueName: "Halls B/C/D", venueAddress: "BKC Convention Center", description: "Three parallel tracks — engineering, design, growth.", icon: "📊" },
    { eventCode: MODERN_CODE, order: 4, name: "After-hours mixer", date: "2026-09-22", startTime: "19:00", endTime: "21:00", venueName: "Rooftop", venueAddress: "BKC Convention Center", dressCode: "Smart casual", description: "Drinks, food trucks, a DJ. The actual best part.", icon: "🍹" },
  ],
  media: [
    hero(MODERN_CODE, "photo-1540575467063-178a50c2df87"),
    ...gallery(MODERN_CODE, [
      { url: SAMPLES.conference, caption: "Last year's keynote" },
      { url: PICSUM(`${MODERN_CODE}-workshop`, 1200, 1500), caption: "Workshop floor" },
      { url: PICSUM(`${MODERN_CODE}-hallway`, 1200, 1500), caption: "Hallway track" },
      { url: PICSUM(`${MODERN_CODE}-mixer`, 1200, 1500), caption: "Mixer" },
    ]),
  ],
};

// ---------- VIBRANT — BDY-2026-0001 ----------

const VIBRANT_CODE = "BDY-2026-0001";
const vibrant: DemoBundle = {
  event: {
    eventCode: VIBRANT_CODE,
    eventType: "birthday",
    templateId: "vibrant",
    eventTitle: "Aarav turns 5!",
    person1Name: "Aarav",
    tentativeDate: "2026-07-19",
    city: "Pune",
    isActive: true,
    slug: VIBRANT_CODE,
    heroImageUrl: UNSPLASH("photo-1530103862676-de8c9debad1d"),
    tagline: "Five and fabulous",
    invitationMessage:
      "Cupcakes, confetti and chaos — you're invited to make our little superhero's day epic.",
    aboutStory:
      "Aarav has very firm opinions on dinosaurs, ice cream and who is and isn't his best friend. Come help him add 'birthday' to that list.",
    mainDate: "2026-07-19",
    mainStartTime: "16:00",
    mainEndTime: "19:00",
    themeAccentColor: "#ff5fa2",
    venueName: "Sunshine Play Cafe",
    venueAddress: "Koregaon Park, Pune",
    mapLink: "https://maps.google.com/?q=Koregaon+Park+Pune",
    latitude: 18.5362,
    longitude: 73.8939,
    contactName: "Riya (Mum)",
    contactPhone: "+91-98xxxxxxx",
    rsvpEnabled: true,
    rsvpLinkOrContact: "+91-98xxxxxxx",
  },
  subEvents: [
    { eventCode: VIBRANT_CODE, order: 1, name: "Arrival & games", date: "2026-07-19", startTime: "16:00", endTime: "16:45", venueName: "Sunshine Play Cafe", description: "Free play, face paint, an obstacle course built by a five-year-old.", icon: "🎈" },
    { eventCode: VIBRANT_CODE, order: 2, name: "Magic show", date: "2026-07-19", startTime: "17:00", endTime: "17:45", venueName: "Main hall", description: "A real magician. Or so we're told.", icon: "🎩" },
    { eventCode: VIBRANT_CODE, order: 3, name: "Cake!", date: "2026-07-19", startTime: "18:00", endTime: "18:30", venueName: "Main hall", description: "Bring stretchy pants.", icon: "🎂" },
  ],
  media: [
    hero(VIBRANT_CODE, "photo-1530103862676-de8c9debad1d"),
    ...gallery(VIBRANT_CODE, [
      { url: SAMPLES.confetti, caption: "Last year's cake" },
      { url: SAMPLES.pinkFlowers, caption: "Balloons!" },
      { url: PICSUM(`${VIBRANT_CODE}-confetti`, 1200, 1500), caption: "Confetti" },
      { url: PICSUM(`${VIBRANT_CODE}-the-boss`, 1200, 1500), caption: "The boss" },
    ]),
  ],
};

// ---------- PASTEL — ENG-2026-0001 ----------

const PASTEL_CODE = "ENG-2026-0001";
const pastel: DemoBundle = {
  event: {
    eventCode: PASTEL_CODE,
    eventType: "engagement",
    templateId: "pastel",
    eventTitle: "Ananya & Vikram",
    person1Name: "Ananya",
    person2Name: "Vikram",
    tentativeDate: "2026-08-30",
    city: "Bengaluru",
    isActive: true,
    slug: PASTEL_CODE,
    heroImageUrl: UNSPLASH("photo-1465495976277-4387d4b0b4c6"),
    tagline: "Soft beginnings.",
    invitationMessage:
      "We're saying yes — and we'd love you there for the moment we tell everyone.",
    aboutStory:
      "Six years, two cities, one very patient cat. Today we begin the bit where we promise out loud.",
    mainDate: "2026-08-30",
    mainStartTime: "17:00",
    mainEndTime: "21:00",
    themeAccentColor: "#e8a0a0",
    venueName: "The Conservatory",
    venueAddress: "Cubbon Park, Bengaluru",
    mapLink: "https://maps.google.com/?q=Cubbon+Park+Bengaluru",
    latitude: 12.9763,
    longitude: 77.5929,
    contactName: "Ananya",
    rsvpEnabled: true,
    rsvpLinkOrContact: "rsvp@ananyaandvikram.com",
  },
  subEvents: [
    { eventCode: PASTEL_CODE, order: 1, name: "Tea & garden walk", date: "2026-08-30", startTime: "17:00", endTime: "18:00", venueName: "The Conservatory lawns", dressCode: "Pastels", description: "Wander, sip, mingle.", icon: "🌸" },
    { eventCode: PASTEL_CODE, order: 2, name: "The exchange", date: "2026-08-30", startTime: "18:15", endTime: "18:45", venueName: "Glasshouse", description: "Rings, vows, a few happy tears.", icon: "💍" },
    { eventCode: PASTEL_CODE, order: 3, name: "Dinner under the trees", date: "2026-08-30", startTime: "19:00", endTime: "21:00", venueName: "Garden terrace", description: "Long tables, slow conversation, dessert worth lingering for.", icon: "🌿" },
  ],
  media: [
    hero(PASTEL_CODE, "photo-1465495976277-4387d4b0b4c6"),
    ...gallery(PASTEL_CODE, [
      { url: SAMPLES.coupleEmbrace, caption: "Engaged!" },
      { url: SAMPLES.bouquet, caption: "Six years in" },
      { url: SAMPLES.pinkFlowers, caption: "Our garden" },
      { url: SAMPLES.ringsClose, caption: "The proposal" },
    ]),
  ],
};

// ---------- registry ----------

export const DEMO_EVENTS: Record<string, DemoBundle> = {
  [ROYAL_CODE]: royal,
  [MINIMAL_CODE]: minimal,
  [MODERN_CODE]: modern,
  [VIBRANT_CODE]: vibrant,
  [PASTEL_CODE]: pastel,
};

export const DEMO_CODE_BY_TEMPLATE: Record<string, string> = {
  royal: ROYAL_CODE,
  minimal: MINIMAL_CODE,
  modern: MODERN_CODE,
  vibrant: VIBRANT_CODE,
  pastel: PASTEL_CODE,
};

export function getDemoBundle(code: string): DemoBundle | undefined {
  return DEMO_EVENTS[code];
}

export function getDemoCodeForTemplate(templateId: string): string | undefined {
  return DEMO_CODE_BY_TEMPLATE[templateId];
}

// Back-compat exports used by the enquiry page preview
export const DUMMY_EVENT: EventData = royal.event;
export const DUMMY_SUB_EVENTS: SubEvent[] = royal.subEvents;
export const DUMMY_MEDIA: MediaItem[] = royal.media;

export function dummyForEventType(eventType: EventData["eventType"]): DemoBundle {
  // Prefer a demo whose event matches the type, else fall back to royal.
  const match = Object.values(DEMO_EVENTS).find((d) => d.event.eventType === eventType);
  return match ?? royal;
}
