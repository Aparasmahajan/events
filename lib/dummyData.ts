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

// ---------- AURORA — WED-2026-0003 ----------

const AURORA_CODE = "WED-2026-0003";
const aurora: DemoBundle = {
  event: {
    eventCode: AURORA_CODE,
    eventType: "wedding",
    templateId: "aurora",
    eventTitle: "Arjun & Meera",
    person1Name: "Arjun",
    person2Name: "Meera",
    tentativeDate: "2026-12-20",
    city: "Udaipur",
    isActive: true,
    slug: AURORA_CODE,
    heroImageUrl: UNSPLASH("photo-1606216794074-735e91aa2c92"),
    tagline: "Two orbits, one light.",
    invitationMessage:
      "Beneath a sky we'll never forget, we ask you to witness the night two stories become one.",
    aboutStory:
      "It began as a small gravity — a glance that bent the evening. Years later the pull is a certainty, and we'd like the people we love around us when we name it out loud.",
    mainDate: "2026-12-20",
    mainStartTime: "19:00",
    mainEndTime: "23:59",
    themeAccentColor: "#d8b46a",
    venueName: "Sajjangarh Pavilion",
    venueAddress: "Aravalli Ridge, Udaipur, Rajasthan",
    mapLink: "https://maps.google.com/?q=Sajjangarh+Udaipur",
    latitude: 24.5979,
    longitude: 73.6716,
    contactName: "Arjun & Meera",
    socialLink: "https://instagram.com/",
    rsvpEnabled: true,
    rsvpLinkOrContact: "https://forms.example/aurora-rsvp",
  },
  subEvents: [
    { eventCode: AURORA_CODE, order: 1, name: "Moonrise Mehndi", date: "2026-12-18", startTime: "16:00", endTime: "20:00", venueName: "The Lake Terrace", venueAddress: "Udaipur", dressCode: "Dusk emerald", description: "Henna, qawwali and the first lights over the water.", icon: "🌙" },
    { eventCode: AURORA_CODE, order: 2, name: "The Sangeet", date: "2026-12-19", startTime: "20:00", endTime: "00:00", venueName: "Mirror Hall", venueAddress: "Udaipur", dressCode: "Midnight & metallics", description: "An evening choreographed like a film — music, mischief, family.", icon: "✦" },
    { eventCode: AURORA_CODE, order: 3, name: "The Vow", date: "2026-12-20", startTime: "19:00", endTime: "21:00", venueName: "Sajjangarh Pavilion", venueAddress: "Aravalli Ridge, Udaipur", dressCode: "Black-tie / traditional formal", description: "Under the open sky, the moment everything has been moving toward.", icon: "♾" },
    { eventCode: AURORA_CODE, order: 4, name: "Aurora Reception", date: "2026-12-20", startTime: "21:00", endTime: "23:59", venueName: "Skyfield Lawn", venueAddress: "Udaipur", dressCode: "Cocktail", description: "Champagne, light installations and dancing until the stars give up.", icon: "🥂" },
  ],
  media: [
    hero(AURORA_CODE, "photo-1606216794074-735e91aa2c92"),
    ...gallery(AURORA_CODE, [
      { url: SAMPLES.coupleBehind, caption: "The long way round" },
      { url: SAMPLES.coupleEmbrace, caption: "Certainty" },
      { url: SAMPLES.coupleSunset, caption: "Golden hour" },
      { url: SAMPLES.weddingScene, caption: "The pavilion" },
      { url: SAMPLES.ringsClose, caption: "The promise" },
      { url: SAMPLES.coupleHands, caption: "Held" },
      { url: SAMPLES.bouquet, caption: "Bloom" },
      { url: SAMPLES.pinkFlowers, caption: "After" },
    ]),
  ],
};

// ---------- OBSIDIAN — WED-2026-0004 ----------

const OBSIDIAN_CODE = "WED-2026-0004";
const obsidian: DemoBundle = {
  event: {
    eventCode: OBSIDIAN_CODE,
    eventType: "wedding",
    templateId: "obsidian",
    eventTitle: "Kabir & Saira",
    person1Name: "Kabir",
    person2Name: "Saira",
    tentativeDate: "2026-11-21",
    city: "Mumbai",
    isActive: true,
    slug: OBSIDIAN_CODE,
    heroImageUrl: UNSPLASH("photo-1519225421980-715cb0215aed"),
    tagline: "An evening, in acts.",
    invitationMessage:
      "No grand announcement. Only the people who matter, in a room that will remember the night.",
    aboutStory:
      "We are not for spectacle. We are for the long table, the low light, the last song — and the few who'll still be dancing when it plays.",
    mainDate: "2026-11-21",
    mainStartTime: "19:30",
    mainEndTime: "23:59",
    themeAccentColor: "#b5763a",
    venueName: "The Foundry",
    venueAddress: "Ballard Estate, Mumbai",
    mapLink: "https://maps.google.com/?q=Ballard+Estate+Mumbai",
    latitude: 18.9387,
    longitude: 72.8419,
    contactName: "Kabir & Saira",
    rsvpEnabled: true,
    rsvpLinkOrContact: "https://forms.example/obsidian-rsvp",
  },
  subEvents: [
    { eventCode: OBSIDIAN_CODE, order: 1, name: "Cocktail Hour", date: "2026-11-21", startTime: "19:30", endTime: "20:30", venueName: "The Mezzanine", description: "Smoke, brass, a negroni cart.", icon: "🥃" },
    { eventCode: OBSIDIAN_CODE, order: 2, name: "The Ceremony", date: "2026-11-21", startTime: "20:30", endTime: "21:15", venueName: "The Foundry Floor", dressCode: "Black tie", description: "Short, exact, unforgettable.", icon: "◆" },
    { eventCode: OBSIDIAN_CODE, order: 3, name: "Dinner & Speeches", date: "2026-11-21", startTime: "21:15", endTime: "22:30", venueName: "Long Table", description: "Seven courses, four toasts, one cry.", icon: "✦" },
    { eventCode: OBSIDIAN_CODE, order: 4, name: "After Dark", date: "2026-11-21", startTime: "22:30", endTime: "23:59", venueName: "The Vault", description: "The lights drop. The room opens.", icon: "♫" },
  ],
  media: [
    hero(OBSIDIAN_CODE, "photo-1519225421980-715cb0215aed"),
    ...gallery(OBSIDIAN_CODE, [
      { url: SAMPLES.coupleEmbrace, caption: "01 — The look" },
      { url: SAMPLES.weddingScene, caption: "02 — The room" },
      { url: SAMPLES.coupleBehind, caption: "03 — The exit" },
      { url: SAMPLES.ringsClose, caption: "04 — The vow" },
      { url: SAMPLES.coupleHands, caption: "05 — Held" },
      { url: SAMPLES.coupleSunset, caption: "06 — After" },
    ]),
  ],
};

// ---------- CELESTIA — WED-2026-0005 ----------

const CELESTIA_CODE = "WED-2026-0005";
const celestia: DemoBundle = {
  event: {
    eventCode: CELESTIA_CODE,
    eventType: "wedding",
    templateId: "celestia",
    eventTitle: "Ishaan & Noor",
    person1Name: "Ishaan",
    person2Name: "Noor",
    tentativeDate: "2026-10-04",
    city: "Pondicherry",
    isActive: true,
    slug: CELESTIA_CODE,
    heroImageUrl: UNSPLASH("photo-1465495976277-4387d4b0b4c6"),
    tagline: "Written in the stars.",
    invitationMessage:
      "Somewhere between a wish and a certainty, we found each other — and we'd love you there when we make it real.",
    aboutStory:
      "A slow orbit of small coincidences that stopped feeling like coincidence. This is the part where two paths quietly become one.",
    mainDate: "2026-10-04",
    mainStartTime: "17:00",
    mainEndTime: "22:00",
    themeAccentColor: "#7c6bb0",
    venueName: "Maison de la Mer",
    venueAddress: "White Town, Pondicherry",
    mapLink: "https://maps.google.com/?q=White+Town+Pondicherry",
    latitude: 11.9338,
    longitude: 79.8367,
    contactName: "Ishaan & Noor",
    rsvpEnabled: true,
    rsvpLinkOrContact: "https://forms.example/celestia-rsvp",
  },
  subEvents: [
    { eventCode: CELESTIA_CODE, order: 1, name: "Seaside Welcome", date: "2026-10-03", startTime: "18:00", endTime: "21:00", venueName: "The Pier", dressCode: "Linen & pastels", description: "Sundowners as the tide comes in.", icon: "🌊" },
    { eventCode: CELESTIA_CODE, order: 2, name: "The Vows", date: "2026-10-04", startTime: "17:00", endTime: "18:00", venueName: "Garden of Maison de la Mer", description: "Golden hour, barefoot, a circle of the people we love.", icon: "✦" },
    { eventCode: CELESTIA_CODE, order: 3, name: "Dinner Under Stars", date: "2026-10-04", startTime: "19:00", endTime: "22:00", venueName: "Courtyard", description: "Long tables, fairy lights, a sky full of reasons.", icon: "✧" },
  ],
  media: [
    hero(CELESTIA_CODE, "photo-1465495976277-4387d4b0b4c6"),
    ...gallery(CELESTIA_CODE, [
      { url: SAMPLES.pinkFlowers, caption: "Bloom" },
      { url: SAMPLES.coupleSunset, caption: "Orbit" },
      { url: SAMPLES.bouquet, caption: "Gather" },
      { url: SAMPLES.coupleEmbrace, caption: "Certainty" },
      { url: SAMPLES.weddingRings, caption: "Promise" },
      { url: SAMPLES.coupleHands, caption: "Held" },
    ]),
  ],
};

// ---------- NEXUS — LCH-2026-0001 ----------

const NEXUS_CODE = "LCH-2026-0001";
const nexus: DemoBundle = {
  event: {
    eventCode: NEXUS_CODE,
    eventType: "product-launch",
    templateId: "nexus",
    eventTitle: "Orion OS v3",
    person1Name: "Orion Technologies",
    tentativeDate: "2026-10-15",
    city: "San Francisco",
    isActive: true,
    slug: NEXUS_CODE,
    heroImageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1600&q=80",
    tagline: "The future is arriving.",
    invitationMessage: "Witness the dawn of a new paradigm in operating intelligence.",
    aboutStory: "Three years of silent engineering. A thousand prototypes. One moment that changes everything. We invite you to be the first to see what's next.",
    mainDate: "2026-10-15",
    mainStartTime: "10:00",
    mainEndTime: "18:00",
    themeAccentColor: "#00f0ff",
    venueName: "The War Memorial Opera House",
    venueAddress: "301 Van Ness Ave, San Francisco, CA",
    mapLink: "https://maps.google.com/?q=War+Memorial+Opera+House+San+Francisco",
    latitude: 37.7793,
    longitude: -122.4192,
    contactName: "Orion Events",
    contactEmail: "events@orion.io",
    socialLink: "https://twitter.com/",
    rsvpEnabled: true,
    rsvpLinkOrContact: "https://events.orion.io/launch",
  },
  subEvents: [
    { eventCode: NEXUS_CODE, order: 1, name: "Check-in & Immersion", date: "2026-10-15", startTime: "09:00", endTime: "10:00", venueName: "Grand Foyer", description: "Augmented-reality welcome. Grab your badge and step into the experience.", icon: "◆" },
    { eventCode: NEXUS_CODE, order: 2, name: "The Reveal", date: "2026-10-15", startTime: "10:00", endTime: "11:30", venueName: "Main Auditorium", description: "Keynote: the story behind Orion OS v3 and a live demonstration that will redefine expectations.", icon: "✦" },
    { eventCode: NEXUS_CODE, order: 3, name: "Deep Dive Labs", date: "2026-10-15", startTime: "13:00", endTime: "16:00", venueName: "Innovation Hall", description: "Hands-on sessions with the engineering team. Bring your questions.", icon: "⚡" },
    { eventCode: NEXUS_CODE, order: 4, name: "Launch Gala", date: "2026-10-15", startTime: "19:00", endTime: "23:00", venueName: "Skyline Terrace", dressCode: "Cocktail / cyber-formal", description: "Celebrate with the team. Live music, immersive installations, and a view of the bay.", icon: "★" },
  ],
  media: [],
};

// ---------- PINNACLE — SMT-2026-0001 ----------

const PINNACLE_CODE = "SMT-2026-0001";
const pinnacle: DemoBundle = {
  event: {
    eventCode: PINNACLE_CODE,
    eventType: "corporate",
    templateId: "pinnacle",
    eventTitle: "Apex Global Summit",
    person1Name: "Apex Leadership Forum",
    tentativeDate: "2026-11-03",
    city: "Zurich",
    isActive: true,
    slug: PINNACLE_CODE,
    heroImageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1600&q=80",
    tagline: "Where leaders ascend.",
    invitationMessage: "Three days that will reshape how you lead, build, and think about the future.",
    aboutStory: "Apex brings together 800 decision-makers from the world's most influential companies. No booths. No pitches. Only conversations that move industries forward.",
    mainDate: "2026-11-03",
    mainStartTime: "08:00",
    mainEndTime: "18:30",
    themeAccentColor: "#d4a853",
    venueName: "The Dolder Grand",
    venueAddress: "Kurhausstrasse 65, 8032 Zurich, Switzerland",
    mapLink: "https://maps.google.com/?q=The+Dolder+Grand+Zurich",
    latitude: 47.3723,
    longitude: 8.5809,
    contactName: "Apex Secretariat",
    contactEmail: "summit@apexforum.com",
    rsvpEnabled: true,
    rsvpLinkOrContact: "https://apexforum.com/register",
  },
  subEvents: [
    { eventCode: PINNACLE_CODE, order: 1, name: "Opening Address", date: "2026-11-03", startTime: "08:30", endTime: "09:30", venueName: "Grand Hall", description: "State of the world — a fireside with the CEO of Apex.", icon: "✦" },
    { eventCode: PINNACLE_CODE, order: 2, name: "Breakout: AI & Ethics", date: "2026-11-03", startTime: "10:00", endTime: "11:30", venueName: "Alpine Room", description: "How to lead responsibly in the age of autonomous systems.", icon: "◇" },
    { eventCode: PINNACLE_CODE, order: 3, name: "Roundtable: The New Global Supply Chain", date: "2026-11-03", startTime: "14:00", endTime: "15:30", venueName: "Crystal Room", description: "Closed-door conversation with 30 industry heads.", icon: "◎" },
    { eventCode: PINNACLE_CODE, order: 4, name: "Summit Gala Dinner", date: "2026-11-03", startTime: "19:30", endTime: "23:00", venueName: "The Rooftop", dressCode: "Black tie", description: "An evening of connection under the Swiss stars.", icon: "★" },
  ],
  media: [],
};

// ---------- LUMINARY — AWD-2026-0001 ----------

const LUMINARY_CODE = "AWD-2026-0001";
const luminary: DemoBundle = {
  event: {
    eventCode: LUMINARY_CODE,
    eventType: "award-ceremony",
    templateId: "luminary",
    eventTitle: "The Luminary Awards",
    person1Name: "The Luminary Foundation",
    tentativeDate: "2026-12-08",
    city: "London",
    isActive: true,
    slug: LUMINARY_CODE,
    heroImageUrl: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1600&q=80",
    tagline: "A night among the stars.",
    invitationMessage: "An extraordinary evening celebrating those who dare to shine the brightest.",
    aboutStory: "The Luminary Awards honour the innovators, creators, and changemakers whose work has illuminated the year. Join us for a black-tie ceremony at the Royal Albert Hall.",
    mainDate: "2026-12-08",
    mainStartTime: "19:00",
    mainEndTime: "23:30",
    themeAccentColor: "#f0cf7a",
    venueName: "Royal Albert Hall",
    venueAddress: "Kensington Gore, South Kensington, London SW7 2AP",
    mapLink: "https://maps.google.com/?q=Royal+Albert+Hall+London",
    latitude: 51.5008,
    longitude: -0.1774,
    contactName: "Awards Secretariat",
    contactEmail: "awards@luminaryfoundation.org",
    socialLink: "https://instagram.com/",
    rsvpEnabled: true,
    rsvpLinkOrContact: "https://luminaryfoundation.org/tickets",
  },
  subEvents: [
    { eventCode: LUMINARY_CODE, order: 1, name: "Red Carpet Arrivals", date: "2026-12-08", startTime: "18:00", endTime: "19:00", venueName: "Royal Albert Hall Steps", dressCode: "Black tie", description: "Photography, champagne, the anticipation of a room about to witness greatness.", icon: "✦" },
    { eventCode: LUMINARY_CODE, order: 2, name: "Opening Act", date: "2026-12-08", startTime: "19:00", endTime: "19:30", venueName: "Main Hall", description: "A cinematic tribute to the year's most remarkable achievements.", icon: "◇" },
    { eventCode: LUMINARY_CODE, order: 3, name: "Award Presentations", date: "2026-12-08", startTime: "19:30", endTime: "22:00", venueName: "Main Hall", description: "12 categories. 12 moments that define excellence.", icon: "★" },
    { eventCode: LUMINARY_CODE, order: 4, name: "Afterparty", date: "2026-12-08", startTime: "22:30", endTime: "01:00", venueName: "The Conservatory", dressCode: "Black tie", description: "DJ, champagne tower, and the conversations everyone's been waiting for.", icon: "♫" },
  ],
  media: [],
};

// ---------- CONVERGE — NET-2026-0001 ----------

const CONVERGE_CODE = "NET-2026-0001";
const converge: DemoBundle = {
  event: {
    eventCode: CONVERGE_CODE,
    eventType: "networking-event",
    templateId: "converge",
    eventTitle: "Converge: Founders & Friends",
    person1Name: "Converge Network",
    tentativeDate: "2026-09-16",
    city: "Berlin",
    isActive: true,
    slug: CONVERGE_CODE,
    heroImageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1600&q=80",
    tagline: "Where connections find their moment.",
    invitationMessage: "An evening for founders, investors, and the people building tomorrow — no pitches, just people.",
    aboutStory: "Converge is Berlin's most intentional networking evening. 150 carefully curated founders, operators, and investors. Warm lighting, good wine, better conversations. No stage. No agenda. Only connection.",
    mainDate: "2026-09-16",
    mainStartTime: "18:30",
    mainEndTime: "22:00",
    themeAccentColor: "#f5a623",
    venueName: "Soho House Berlin",
    venueAddress: "Torstrasse 1, 10119 Berlin, Germany",
    mapLink: "https://maps.google.com/?q=Soho+House+Berlin",
    latitude: 52.5295,
    longitude: 13.4074,
    contactName: "Converge Team",
    contactEmail: "hello@converge.network",
    socialLink: "https://linkedin.com/",
    rsvpEnabled: true,
    rsvpLinkOrContact: "https://converge.network/rsvp",
  },
  subEvents: [
    { eventCode: CONVERGE_CODE, order: 1, name: "Welcome Hour", date: "2026-09-16", startTime: "18:30", endTime: "19:30", venueName: "The Library Bar", description: "Arrive, check your coat, grab a drink. The evening begins exactly as it means to go on — easy.", icon: "○" },
    { eventCode: CONVERGE_CODE, order: 2, name: "Free Flow Conversations", date: "2026-09-16", startTime: "19:30", endTime: "21:00", venueName: "Throughout the House", description: "No name tags. No icebreakers. Just warm rooms full of interesting people.", icon: "◇" },
    { eventCode: CONVERGE_CODE, order: 3, name: "Late Lounge", date: "2026-09-16", startTime: "21:00", endTime: "22:00", venueName: "Rooftop Terrace", description: "The conversation continues under the Berlin sky. The best connections are the ones you didn't plan.", icon: "◎" },
  ],
  media: [],
};

// ---------- AFTER — PAR-2026-0001 ----------

const AFTER_CODE = "PAR-2026-0001";
const after: DemoBundle = {
  event: {
    eventCode: AFTER_CODE,
    eventType: "party",
    templateId: "after",
    eventTitle: "AFTER: Midnight Society",
    person1Name: "Midnight Collective",
    tentativeDate: "2026-11-28",
    city: "Berlin",
    isActive: true,
    slug: AFTER_CODE,
    heroImageUrl: "https://images.unsplash.com/photo-1578645635737-6a88f7060a3e?auto=format&fit=crop&w=1600&q=80",
    tagline: "The night is yours.",
    invitationMessage: "The address drops at 11. The dress code is confidence. The rest is up to the night.",
    aboutStory: "Midnight Society is a roaming party for the insomniacs, the dancers, and the ones who find themselves in the dark. Each edition is a new location, a new sound, a new memory.",
    mainDate: "2026-11-28",
    mainStartTime: "23:00",
    mainEndTime: "05:00",
    themeAccentColor: "#ff2d78",
    venueName: "://aboutblank",
    venueAddress: "Markgrafendamm 24c, 10245 Berlin, Germany",
    mapLink: "https://maps.google.com/?q=://aboutblank+Berlin",
    latitude: 52.5036,
    longitude: 13.4598,
    contactName: "Midnight Collective",
    socialLink: "https://instagram.com/",
    rsvpEnabled: true,
    rsvpLinkOrContact: "https://ra.co/events/berlin",
  },
  subEvents: [
    { eventCode: AFTER_CODE, order: 1, name: "Door Opens", date: "2026-11-28", startTime: "23:00", endTime: "23:59", venueName: "://aboutblank", dressCode: "All black / UV ready", description: "The queue is part of the experience. Warm-up begins.", icon: "◈" },
    { eventCode: AFTER_CODE, order: 2, name: "Warm-Up Set", date: "2026-11-28", startTime: "23:59", endTime: "01:30", venueName: "Room 1", description: "Deep house and slow burners. The room finds its rhythm.", icon: "◇" },
    { eventCode: AFTER_CODE, order: 3, name: "Headliner", date: "2026-11-29", startTime: "01:30", endTime: "03:30", venueName: "Main Room", description: "The peak. Lights drop. The room becomes one organism.", icon: "✦" },
    { eventCode: AFTER_CODE, order: 4, name: "Afterglow", date: "2026-11-29", startTime: "03:30", endTime: "05:00", venueName: "Lounge", description: "The comedown. Good conversation, low lights, last drinks.", icon: "◎" },
  ],
  media: [],
};

// ---------- registry ----------

export const DEMO_EVENTS: Record<string, DemoBundle> = {
  [NEXUS_CODE]: nexus,
  [PINNACLE_CODE]: pinnacle,
  [LUMINARY_CODE]: luminary,
  [CONVERGE_CODE]: converge,
  [AFTER_CODE]: after,
  [PINNACLE_CODE]: pinnacle,
  [LUMINARY_CODE]: luminary,
  [CONVERGE_CODE]: converge,
  [ROYAL_CODE]: royal,
  [MINIMAL_CODE]: minimal,
  [MODERN_CODE]: modern,
  [VIBRANT_CODE]: vibrant,
  [PASTEL_CODE]: pastel,
  [AURORA_CODE]: aurora,
  [OBSIDIAN_CODE]: obsidian,
  [CELESTIA_CODE]: celestia,
};

export const DEMO_CODE_BY_TEMPLATE: Record<string, string> = {
  nexus: NEXUS_CODE,
  pinnacle: PINNACLE_CODE,
  luminary: LUMINARY_CODE,
  converge: CONVERGE_CODE,
  after: AFTER_CODE,
  royal: ROYAL_CODE,
  minimal: MINIMAL_CODE,
  modern: MODERN_CODE,
  vibrant: VIBRANT_CODE,
  pastel: PASTEL_CODE,
  aurora: AURORA_CODE,
  obsidian: OBSIDIAN_CODE,
  celestia: CELESTIA_CODE,
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
