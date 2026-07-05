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
  weddingScene: UNSPLASH("photo-1494203484021-3c454daf695d", 1200),
  bouquet: UNSPLASH("photo-1583939003579-730e3918a45a", 1200),
  ringsClose: UNSPLASH("photo-1522337660859-02fbefca4702", 1200),
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

const ROYAL_CODE = "DEMO-ROYAL";
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

const MINIMAL_CODE = "DEMO-MINIMAL";
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

const MODERN_CODE = "DEMO-MODERN";
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

const VIBRANT_CODE = "DEMO-VIBRANT";
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

const PASTEL_CODE = "DEMO-PASTEL";
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

const AURORA_CODE = "DEMO-AURORA";
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

const OBSIDIAN_CODE = "DEMO-OBSIDIAN";
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

const CELESTIA_CODE = "DEMO-CELESTIA";
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

const NEXUS_CODE = "DEMO-NEXUS";
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

const PINNACLE_CODE = "DEMO-PINNACLE";
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

const LUMINARY_CODE = "DEMO-LUMINARY";
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

const CONVERGE_CODE = "DEMO-CONVERGE";
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

const AFTER_CODE = "DEMO-AFTER";
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
    heroImageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1600&q=80",
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

// ---------- EMPYREAN — DEMO-EMPYREAN ----------

const EMPYREAN_CODE = "DEMO-EMPYREAN";
const empyrean: DemoBundle = {
  event: {
    eventCode: EMPYREAN_CODE,
    eventType: "wedding",
    templateId: "empyrean",
    eventTitle: "Aditi & Rohan",
    person1Name: "Aditi",
    person2Name: "Rohan",
    tentativeDate: "2026-11-14",
    city: "Rome",
    isActive: true,
    slug: EMPYREAN_CODE,
    heroImageUrl: SAMPLES.coupleSunset,
    tagline: "A love ascending.",
    invitationMessage:
      "Beneath a sky that has watched every love that came before ours, we invite you to witness the one we are making now.",
    aboutStory:
      "Some love stories are written on paper. Ours was written in light — the kind that pours through stained glass at four in the afternoon, when nobody is watching but the room already knows.",
    mainDate: "2026-11-14",
    mainStartTime: "16:00",
    mainEndTime: "22:00",
    themeAccentColor: "#c8a460",
    venueName: "Basilica di Santa Maria",
    venueAddress: "Trastevere, Rome, Italy",
    mapLink: "https://maps.google.com/?q=Trastevere+Rome",
    latitude: 41.8896,
    longitude: 12.4695,
    contactName: "Aditi & Rohan",
    rsvpEnabled: true,
    rsvpLinkOrContact: "https://forms.example/empyrean-rsvp",
  },
  subEvents: [
    { eventCode: EMPYREAN_CODE, order: 1, name: "Blessing", date: "2026-11-13", startTime: "18:00", endTime: "20:00", venueName: "Piazza Navona", description: "A quiet family blessing at sunset.", icon: "☁" },
    { eventCode: EMPYREAN_CODE, order: 2, name: "Ceremony", date: "2026-11-14", startTime: "16:00", endTime: "17:30", venueName: "Basilica di Santa Maria", dressCode: "Ivory & gold", description: "Vows exchanged under stained glass.", icon: "✦" },
    { eventCode: EMPYREAN_CODE, order: 3, name: "Reception", date: "2026-11-14", startTime: "19:00", endTime: "22:00", venueName: "Villa Aurelia", dressCode: "Black-tie", description: "Dinner by candlelight in the marble hall.", icon: "♛" },
  ],
  media: [
    hero(EMPYREAN_CODE, "photo-1519741497674-611481863552"),
    ...gallery(EMPYREAN_CODE, [
      { url: SAMPLES.coupleEmbrace, caption: "The vow" },
      { url: SAMPLES.weddingRings, caption: "The rings" },
      { url: SAMPLES.coupleBehind, caption: "Ascension" },
      { url: SAMPLES.coupleSunset, caption: "Golden hour" },
      { url: SAMPLES.pinkFlowers, caption: "Marble" },
      { url: SAMPLES.bouquet, caption: "Bouquet" },
    ]),
  ],
};

// ---------- PRISM — DEMO-PRISM ----------

const PRISM_CODE = "DEMO-PRISM";
const prism: DemoBundle = {
  event: {
    eventCode: PRISM_CODE,
    eventType: "wedding",
    templateId: "prism",
    eventTitle: "Naina & Dev",
    person1Name: "Naina",
    person2Name: "Dev",
    tentativeDate: "2026-09-05",
    city: "Copenhagen",
    isActive: true,
    slug: PRISM_CODE,
    heroImageUrl: SAMPLES.coupleEmbrace,
    tagline: "Light meets light.",
    invitationMessage:
      "Light bends. Colors emerge. Two lives, refracted through one moment — we would love you there when it happens.",
    aboutStory:
      "A prism doesn't invent color — it reveals what was always in the light. Our years together have felt exactly like that.",
    mainDate: "2026-09-05",
    mainStartTime: "17:00",
    mainEndTime: "23:00",
    themeAccentColor: "#7ea8ff",
    venueName: "The Glass Pavilion",
    venueAddress: "Refshaleøen, Copenhagen",
    mapLink: "https://maps.google.com/?q=Refshaleoen+Copenhagen",
    latitude: 55.6934,
    longitude: 12.6111,
    contactName: "Naina & Dev",
    rsvpEnabled: true,
    rsvpLinkOrContact: "https://forms.example/prism-rsvp",
  },
  subEvents: [
    { eventCode: PRISM_CODE, order: 1, name: "Prism Welcome", date: "2026-09-04", startTime: "19:00", endTime: "22:00", venueName: "The Harbour", description: "Sundowners under the glass roof.", icon: "◈" },
    { eventCode: PRISM_CODE, order: 2, name: "The Ceremony", date: "2026-09-05", startTime: "17:00", endTime: "18:15", venueName: "Glass Pavilion", dressCode: "Modern formal", description: "Vows exchanged in a room made entirely of light.", icon: "💎" },
    { eventCode: PRISM_CODE, order: 3, name: "Reception", date: "2026-09-05", startTime: "19:00", endTime: "23:00", venueName: "Refshaleøen", description: "A long table under rainbow-refraction lighting.", icon: "✦" },
  ],
  media: [
    hero(PRISM_CODE, "photo-1519225421980-715cb0215aed"),
    ...gallery(PRISM_CODE, [
      { url: SAMPLES.ringsClose, caption: "Refraction" },
      { url: SAMPLES.coupleHands, caption: "Prism" },
      { url: SAMPLES.coupleBehind, caption: "Light bend" },
      { url: SAMPLES.weddingRings, caption: "Facets" },
      { url: SAMPLES.coupleSunset, caption: "Iridescence" },
    ]),
  ],
};

// ---------- ORBIT — DEMO-ORBIT ----------

const ORBIT_CODE = "DEMO-ORBIT";
const orbit: DemoBundle = {
  event: {
    eventCode: ORBIT_CODE,
    eventType: "birthday",
    templateId: "orbit",
    eventTitle: "Kabir turns 7!",
    person1Name: "Kabir",
    tentativeDate: "2026-08-10",
    city: "Bengaluru",
    isActive: true,
    slug: ORBIT_CODE,
    heroImageUrl: SAMPLES.confetti,
    tagline: "The birthday universe.",
    invitationMessage: "Blast off with us — cake, chaos, and a small human who's about to become one year more important.",
    aboutStory: "Every year they add a new orbit — new obsessions, new friends, new opinions on dinner. Come help us celebrate the whole galaxy of them.",
    mainDate: "2026-08-10",
    mainStartTime: "16:00",
    mainEndTime: "19:00",
    themeAccentColor: "#ff6f91",
    venueName: "Planet Play",
    venueAddress: "Indiranagar, Bengaluru",
    mapLink: "https://maps.google.com/?q=Indiranagar+Bengaluru",
    latitude: 12.9784,
    longitude: 77.6408,
    contactName: "Meera (Mum)",
    contactPhone: "+91-98xxxxxxx",
    rsvpEnabled: true,
    rsvpLinkOrContact: "+91-98xxxxxxx",
  },
  subEvents: [
    { eventCode: ORBIT_CODE, order: 1, name: "Launch Zone", date: "2026-08-10", startTime: "16:00", endTime: "16:45", venueName: "Play Cafe", description: "Face paint, alien slime, gravity-free bouncy castle.", icon: "🚀" },
    { eventCode: ORBIT_CODE, order: 2, name: "Planet Games", date: "2026-08-10", startTime: "17:00", endTime: "17:45", venueName: "Main hall", description: "Musical planets, meteor tag and one very committed magic show.", icon: "🪐" },
    { eventCode: ORBIT_CODE, order: 3, name: "Cake Countdown", date: "2026-08-10", startTime: "18:00", endTime: "18:30", venueName: "Cake corner", description: "3… 2… 1… cake.", icon: "🎂" },
  ],
  media: [
    hero(ORBIT_CODE, "photo-1530103862676-de8c9debad1d"),
    ...gallery(ORBIT_CODE, [
      { url: SAMPLES.confetti, caption: "Balloons" },
      { url: SAMPLES.pinkFlowers, caption: "Cake" },
      { url: PICSUM(`${ORBIT_CODE}-planets`, 1200, 1500), caption: "Planets" },
      { url: PICSUM(`${ORBIT_CODE}-stars`, 1200, 1500), caption: "Stars" },
    ]),
  ],
};

// ---------- ARCADE — DEMO-ARCADE ----------

const ARCADE_CODE = "DEMO-ARCADE";
const arcade: DemoBundle = {
  event: {
    eventCode: ARCADE_CODE,
    eventType: "birthday",
    templateId: "arcade",
    eventTitle: "Vikram's 30th",
    person1Name: "Vikram",
    tentativeDate: "2026-10-25",
    city: "Bangkok",
    isActive: true,
    slug: ARCADE_CODE,
    heroImageUrl: UNSPLASH("photo-1511512578047-dfb367046420"),
    tagline: "Player one is ready.",
    invitationMessage: "Insert coin, choose player one. The party is loading — hope you brought your high-score energy.",
    aboutStory: "A birthday where every song is a boss theme and every drink comes with a power-up. Extra life not guaranteed.",
    mainDate: "2026-10-25",
    mainStartTime: "21:00",
    mainEndTime: "03:00",
    themeAccentColor: "#ff006e",
    venueName: "Neon Alley",
    venueAddress: "Sukhumvit 11, Bangkok",
    mapLink: "https://maps.google.com/?q=Sukhumvit+11+Bangkok",
    latitude: 13.7396,
    longitude: 100.5606,
    contactName: "Vikram",
    socialLink: "https://instagram.com/",
    rsvpEnabled: true,
    rsvpLinkOrContact: "https://forms.example/arcade-rsvp",
  },
  subEvents: [
    { eventCode: ARCADE_CODE, order: 1, name: "Continue?", date: "2026-10-25", startTime: "21:00", endTime: "22:00", venueName: "Neon Alley", dressCode: "80s / neon", description: "Doors open. Arcade cabinets warmed up. Welcome drinks with dry-ice.", icon: "🕹" },
    { eventCode: ARCADE_CODE, order: 2, name: "Boss Fight", date: "2026-10-25", startTime: "22:30", endTime: "00:00", venueName: "Main Floor", description: "Live synthwave set + high-score competition.", icon: "👾" },
    { eventCode: ARCADE_CODE, order: 3, name: "Game Over", date: "2026-10-26", startTime: "00:00", endTime: "03:00", venueName: "Rooftop", description: "The afterhours part. No coins required.", icon: "✧" },
  ],
  media: [
    hero(ARCADE_CODE, "photo-1511512578047-dfb367046420"),
    ...gallery(ARCADE_CODE, [
      { url: PICSUM(`${ARCADE_CODE}-neon`, 1200, 1500), caption: "Neon" },
      { url: PICSUM(`${ARCADE_CODE}-arcade`, 1200, 1500), caption: "Arcade" },
      { url: PICSUM(`${ARCADE_CODE}-crowd`, 1200, 1500), caption: "Crowd" },
      { url: PICSUM(`${ARCADE_CODE}-lasers`, 1200, 1500), caption: "Lasers" },
    ]),
  ],
};

// ---------- PROMISE — DEMO-PROMISE ----------

const PROMISE_CODE = "DEMO-PROMISE";
const promise: DemoBundle = {
  event: {
    eventCode: PROMISE_CODE,
    eventType: "engagement",
    templateId: "promise",
    eventTitle: "Riya & Karan",
    person1Name: "Riya",
    person2Name: "Karan",
    tentativeDate: "2026-06-21",
    city: "Jaipur",
    isActive: true,
    slug: PROMISE_CODE,
    heroImageUrl: SAMPLES.coupleHands,
    tagline: "The moment two become us.",
    invitationMessage: "We said yes — to each other, and to a whole life still being written. Come stand in the room the first time we say it out loud.",
    aboutStory: "It wasn't a grand plan. It was a quiet Tuesday and a question that had been waiting a long time to be asked.",
    mainDate: "2026-06-21",
    mainStartTime: "17:00",
    mainEndTime: "22:00",
    themeAccentColor: "#c89b8c",
    venueName: "Rambagh Courtyard",
    venueAddress: "Rambagh, Jaipur",
    mapLink: "https://maps.google.com/?q=Rambagh+Jaipur",
    latitude: 26.8969,
    longitude: 75.8127,
    contactName: "Riya & Karan",
    rsvpEnabled: true,
    rsvpLinkOrContact: "https://forms.example/promise-rsvp",
  },
  subEvents: [
    { eventCode: PROMISE_CODE, order: 1, name: "Ring Ceremony", date: "2026-06-21", startTime: "17:30", endTime: "18:30", venueName: "Rambagh Courtyard", dressCode: "Rose gold & cream", description: "The exchange, the vow, the tears.", icon: "💗" },
    { eventCode: PROMISE_CODE, order: 2, name: "Dinner", date: "2026-06-21", startTime: "19:00", endTime: "22:00", venueName: "Palace Terrace", description: "Long tables under jasmine and fairy lights.", icon: "✦" },
  ],
  media: [
    hero(PROMISE_CODE, "photo-1525258946800-98cfd641d0de"),
    ...gallery(PROMISE_CODE, [
      { url: SAMPLES.coupleHands, caption: "Hands" },
      { url: SAMPLES.ringsClose, caption: "The ring" },
      { url: SAMPLES.coupleEmbrace, caption: "Yes" },
      { url: SAMPLES.pinkFlowers, caption: "Petals" },
      { url: SAMPLES.coupleSunset, caption: "Golden" },
    ]),
  ],
};

// ---------- CHAPTERS — DEMO-CHAPTERS ----------

const CHAPTERS_CODE = "DEMO-CHAPTERS";
const chapters: DemoBundle = {
  event: {
    eventCode: CHAPTERS_CODE,
    eventType: "anniversary",
    templateId: "chapters",
    eventTitle: "Sanjay & Anita — 25 years",
    person1Name: "Sanjay",
    person2Name: "Anita",
    tentativeDate: "2026-12-02",
    city: "Delhi",
    isActive: true,
    slug: CHAPTERS_CODE,
    heroImageUrl: SAMPLES.coupleSunset,
    tagline: "Volume the next.",
    invitationMessage: "A story worth its own book — and you're in almost every chapter. Come help us bind another year to the shelf.",
    aboutStory: "Twenty-five years of small mornings, wrong turns, right choices, and one shared soundtrack that has somehow held it all together.",
    mainDate: "2026-12-02",
    mainStartTime: "18:00",
    mainEndTime: "23:00",
    themeAccentColor: "#a68b5b",
    venueName: "The Imperial",
    venueAddress: "Janpath, New Delhi",
    mapLink: "https://maps.google.com/?q=The+Imperial+Delhi",
    latitude: 28.6247,
    longitude: 77.2187,
    contactName: "Sanjay & Anita",
    rsvpEnabled: true,
    rsvpLinkOrContact: "https://forms.example/chapters-rsvp",
  },
  subEvents: [
    { eventCode: CHAPTERS_CODE, order: 1, name: "Chapter I — The Toast", date: "2026-12-02", startTime: "18:00", endTime: "19:00", venueName: "The Library Bar", description: "Cocktails and a walk through the photo archive.", icon: "❦" },
    { eventCode: CHAPTERS_CODE, order: 2, name: "Chapter II — The Renewal", date: "2026-12-02", startTime: "19:30", endTime: "20:30", venueName: "The Palm Court", description: "Twenty-five years, one more promise.", icon: "❧" },
    { eventCode: CHAPTERS_CODE, order: 3, name: "Chapter III — The Dance", date: "2026-12-02", startTime: "21:00", endTime: "23:00", venueName: "The Ballroom", description: "The playlist they made in 2001. Somehow, it still works.", icon: "☙" },
  ],
  media: [
    hero(CHAPTERS_CODE, "photo-1465495976277-4387d4b0b4c6"),
    ...gallery(CHAPTERS_CODE, [
      { url: SAMPLES.coupleSunset, caption: "2001 — First trip" },
      { url: SAMPLES.coupleBehind, caption: "2007 — Bali" },
      { url: SAMPLES.pinkFlowers, caption: "2012 — Home" },
      { url: SAMPLES.coupleEmbrace, caption: "2019 — Anniversary" },
      { url: SAMPLES.coupleHands, caption: "2026 — Still here" },
    ]),
  ],
};

// ---------- NEURAL — DEMO-NEURAL ----------

const NEURAL_CODE = "DEMO-NEURAL";
const neural: DemoBundle = {
  event: {
    eventCode: NEURAL_CODE,
    eventType: "corporate",
    templateId: "neural",
    eventTitle: "Neural Summit 2026",
    person1Name: "Neural Foundation",
    tentativeDate: "2026-10-08",
    city: "Singapore",
    isActive: true,
    slug: NEURAL_CODE,
    heroImageUrl: UNSPLASH("photo-1620712943543-bcc4688e7485"),
    tagline: "Where the network meets.",
    invitationMessage: "Two days at the exact point where research becomes product. Come think out loud with the people building what's next.",
    aboutStory: "The room every year gets a little smaller — not because there's less interest, but because we're keeping it to the people whose work is actually shaping the field.",
    mainDate: "2026-10-08",
    mainStartTime: "09:00",
    mainEndTime: "18:00",
    themeAccentColor: "#00d4ff",
    venueName: "Marina Bay Sands Expo",
    venueAddress: "10 Bayfront Ave, Singapore",
    mapLink: "https://maps.google.com/?q=Marina+Bay+Sands+Expo",
    latitude: 1.2839,
    longitude: 103.8607,
    contactName: "Neural Team",
    contactEmail: "hello@neuralsummit.io",
    rsvpEnabled: true,
    rsvpLinkOrContact: "https://neuralsummit.io/register",
  },
  subEvents: [
    { eventCode: NEURAL_CODE, order: 1, name: "Registration & Coffee", date: "2026-10-08", startTime: "09:00", endTime: "10:00", venueName: "Foyer", description: "Badges, breakfast and the first quiet handshakes of the day.", icon: "◇" },
    { eventCode: NEURAL_CODE, order: 2, name: "Opening: The State of the Field", date: "2026-10-08", startTime: "10:00", endTime: "11:30", venueName: "Main Hall", description: "Where the frontier is, and where it isn't going.", icon: "◆" },
    { eventCode: NEURAL_CODE, order: 3, name: "Deep-Dive Tracks", date: "2026-10-08", startTime: "13:00", endTime: "17:00", venueName: "Halls A / B / C", description: "Alignment, agents, infrastructure. Pick your rabbit hole.", icon: "⚡" },
    { eventCode: NEURAL_CODE, order: 4, name: "Off-Record Dinner", date: "2026-10-08", startTime: "19:30", endTime: "22:30", venueName: "The Rooftop", dressCode: "Business casual", description: "Attendee-only, no press, no phones out.", icon: "✦" },
  ],
  media: [],
};

// ---------- UNVEIL — DEMO-UNVEIL ----------

const UNVEIL_CODE = "DEMO-UNVEIL";
const unveil: DemoBundle = {
  event: {
    eventCode: UNVEIL_CODE,
    eventType: "product-launch",
    templateId: "unveil",
    eventTitle: "Onyx — Reveal",
    person1Name: "Onyx Systems",
    tentativeDate: "2026-09-18",
    city: "Los Angeles",
    isActive: true,
    slug: UNVEIL_CODE,
    heroImageUrl: UNSPLASH("photo-1492684223066-81342ee5ff30"),
    tagline: "Nothing you're expecting.",
    invitationMessage: "One evening. One reveal. Everything you thought about this category is about to change.",
    aboutStory: "We've been quiet for a while. That was on purpose. What we're showing you is the reason.",
    mainDate: "2026-09-18",
    mainStartTime: "19:00",
    mainEndTime: "22:00",
    themeAccentColor: "#ff2d55",
    venueName: "Ace Theatre",
    venueAddress: "929 S Broadway, Los Angeles, CA",
    mapLink: "https://maps.google.com/?q=Ace+Theatre+Los+Angeles",
    latitude: 34.0447,
    longitude: -118.2568,
    contactName: "Onyx Events",
    contactEmail: "events@onyx.dev",
    rsvpEnabled: true,
    rsvpLinkOrContact: "https://onyx.dev/reveal",
  },
  subEvents: [
    { eventCode: UNVEIL_CODE, order: 1, name: "Doors", date: "2026-09-18", startTime: "18:30", endTime: "19:00", venueName: "Ace Lobby", description: "Silent entry. No phones from this point.", icon: "◈" },
    { eventCode: UNVEIL_CODE, order: 2, name: "The Reveal", date: "2026-09-18", startTime: "19:00", endTime: "20:00", venueName: "Ace Theatre — Main Stage", description: "Sixty minutes. One product. Nothing extra.", icon: "◆" },
    { eventCode: UNVEIL_CODE, order: 3, name: "Hands-On", date: "2026-09-18", startTime: "20:00", endTime: "22:00", venueName: "Mezzanine Floor", description: "Talk to the team. Touch the thing.", icon: "✦" },
  ],
  media: [],
};

// ---------- ODEON — DEMO-ODEON ----------

const ODEON_CODE = "DEMO-ODEON";
const odeon: DemoBundle = {
  event: {
    eventCode: ODEON_CODE,
    eventType: "award-ceremony",
    templateId: "odeon",
    eventTitle: "The Golden Reel Awards",
    person1Name: "The Golden Reel Academy",
    tentativeDate: "2026-11-22",
    city: "New York",
    isActive: true,
    slug: ODEON_CODE,
    heroImageUrl: UNSPLASH("photo-1470229722913-7c0e2dbbafd3"),
    tagline: "Where legends are named.",
    invitationMessage: "A room built for the moments a career remembers. Join us for an evening honouring the very best of the year.",
    aboutStory: "Every year the carpet rolls out, the lights find one face at a time, and the industry decides which stories deserved to be told louder.",
    mainDate: "2026-11-22",
    mainStartTime: "19:00",
    mainEndTime: "23:59",
    themeAccentColor: "#d4af37",
    venueName: "Radio City Music Hall",
    venueAddress: "1260 Avenue of the Americas, New York, NY",
    mapLink: "https://maps.google.com/?q=Radio+City+Music+Hall",
    latitude: 40.7599,
    longitude: -73.98,
    contactName: "Academy Office",
    contactEmail: "awards@goldenreel.org",
    rsvpEnabled: true,
    rsvpLinkOrContact: "https://goldenreel.org/tickets",
  },
  subEvents: [
    { eventCode: ODEON_CODE, order: 1, name: "Red Carpet", date: "2026-11-22", startTime: "18:00", endTime: "19:00", venueName: "Radio City Steps", dressCode: "Black tie", description: "Arrivals, press wall, the wait before the walk.", icon: "◆" },
    { eventCode: ODEON_CODE, order: 2, name: "Opening Reel", date: "2026-11-22", startTime: "19:00", endTime: "19:30", venueName: "Main Auditorium", description: "A cinematic tribute — every nominee, one frame at a time.", icon: "✦" },
    { eventCode: ODEON_CODE, order: 3, name: "The Ceremony", date: "2026-11-22", startTime: "19:30", endTime: "22:00", venueName: "Main Auditorium", description: "Fourteen categories. Fourteen legends made in one night.", icon: "🏆" },
    { eventCode: ODEON_CODE, order: 4, name: "Gold Room Afterparty", date: "2026-11-22", startTime: "22:30", endTime: "23:59", venueName: "Rainbow Room", dressCode: "Black tie", description: "The photograph everyone remembers.", icon: "★" },
  ],
  media: [],
};

// ---------- CONSTELLA — DEMO-CONSTELLA ----------

const CONSTELLA_CODE = "DEMO-CONSTELLA";
const constella: DemoBundle = {
  event: {
    eventCode: CONSTELLA_CODE,
    eventType: "networking-event",
    templateId: "constella",
    eventTitle: "Constella Founders Night",
    person1Name: "Constella Network",
    tentativeDate: "2026-09-30",
    city: "Amsterdam",
    isActive: true,
    slug: CONSTELLA_CODE,
    heroImageUrl: UNSPLASH("photo-1519681393784-d120267933ba"),
    tagline: "Every star, its own line.",
    invitationMessage: "An evening where the room is the point — and the connections you leave with are the whole return on investment.",
    aboutStory: "A network isn't a list. It's a shape — a constellation you draw one conversation at a time. Tonight we add a few more lines.",
    mainDate: "2026-09-30",
    mainStartTime: "18:30",
    mainEndTime: "22:00",
    themeAccentColor: "#7ff9ff",
    venueName: "De School",
    venueAddress: "Dr. Jan van Breemenstraat 1, Amsterdam",
    mapLink: "https://maps.google.com/?q=De+School+Amsterdam",
    latitude: 52.3563,
    longitude: 4.8377,
    contactName: "Constella Team",
    contactEmail: "hello@constella.club",
    socialLink: "https://linkedin.com/",
    rsvpEnabled: true,
    rsvpLinkOrContact: "https://constella.club/rsvp",
  },
  subEvents: [
    { eventCode: CONSTELLA_CODE, order: 1, name: "Arrival", date: "2026-09-30", startTime: "18:30", endTime: "19:30", venueName: "The Foyer", description: "Coats off, first drinks in, first orbits form.", icon: "◇" },
    { eventCode: CONSTELLA_CODE, order: 2, name: "Star Rounds", date: "2026-09-30", startTime: "19:30", endTime: "21:00", venueName: "The Main Room", description: "Structured five-minute one-on-ones with three people we thought you should meet.", icon: "✦" },
    { eventCode: CONSTELLA_CODE, order: 3, name: "Late Conversation", date: "2026-09-30", startTime: "21:00", endTime: "22:00", venueName: "The Garden", description: "The unstructured hour. Where the actual work happens.", icon: "◎" },
  ],
  media: [],
};

// ---------- METROPOLIS — DEMO-METROPOLIS ----------

const METROPOLIS_CODE = "DEMO-METROPOLIS";
const metropolis: DemoBundle = {
  event: {
    eventCode: METROPOLIS_CODE,
    eventType: "party",
    templateId: "metropolis",
    eventTitle: "METROPOLIS: Skyline",
    person1Name: "Skyline Collective",
    tentativeDate: "2026-12-13",
    city: "Tokyo",
    isActive: true,
    slug: METROPOLIS_CODE,
    heroImageUrl: UNSPLASH("photo-1519677100203-a0e668c92439"),
    tagline: "Enter the city.",
    invitationMessage: "The city has a soundtrack tonight and we have the address. Doors at ten, dress code is whatever makes you unrecognisable in the morning.",
    aboutStory: "Ten floors, three rooms, one sound. Somewhere between the elevator and the roof, the night becomes what it wants to be.",
    mainDate: "2026-12-13",
    mainStartTime: "22:00",
    mainEndTime: "05:00",
    themeAccentColor: "#ff0080",
    venueName: "Shibuya Sky Complex",
    venueAddress: "Shibuya, Tokyo, Japan",
    mapLink: "https://maps.google.com/?q=Shibuya+Sky+Tokyo",
    latitude: 35.6595,
    longitude: 139.7005,
    contactName: "Skyline Collective",
    socialLink: "https://instagram.com/",
    rsvpEnabled: true,
    rsvpLinkOrContact: "https://ra.co/events/tokyo",
  },
  subEvents: [
    { eventCode: METROPOLIS_CODE, order: 1, name: "Street Level", date: "2026-12-13", startTime: "22:00", endTime: "23:30", venueName: "Ground floor", dressCode: "Cyber / streetwear", description: "Warm-up, drinks, first floor opens.", icon: "◈" },
    { eventCode: METROPOLIS_CODE, order: 2, name: "Skyline Peak", date: "2026-12-14", startTime: "00:00", endTime: "02:30", venueName: "Rooftop", description: "Headliner set. Laser sweeps over Shibuya.", icon: "✦" },
    { eventCode: METROPOLIS_CODE, order: 3, name: "Undercity", date: "2026-12-14", startTime: "02:30", endTime: "05:00", venueName: "Basement Level", description: "Doors keep going. So does the sound.", icon: "◆" },
  ],
  media: [],
};

// ---------- 18 additional demo bundles (Moonlit, Sky Temple, etc.) ----------

const MOONLIT_CODE = "DEMO-MOONLIT";
const moonlit: DemoBundle = {
  event: {
    eventCode: MOONLIT_CODE, eventType: "wedding", templateId: "moonlit",
    eventTitle: "Yuvraj & Ishika", person1Name: "Yuvraj", person2Name: "Ishika",
    tentativeDate: "2026-11-15", city: "Jaisalmer", isActive: true, slug: MOONLIT_CODE,
    heroImageUrl: SAMPLES.coupleEmbrace, tagline: "Under one silver sky.",
    invitationMessage: "Beneath a moon that has lit every love before ours, and every kingdom before ours, we invite you into the night we've been walking toward.",
    aboutStory: "Two names carved into a glowing stone gate. A pathway lit by ten thousand candles. A kingdom holding its breath for the words that turn a promise into a covenant.",
    mainDate: "2026-11-15", mainStartTime: "19:00", mainEndTime: "23:59",
    themeAccentColor: "#c8d4e8",
    venueName: "Suryagarh Fort", venueAddress: "Kahala Phata, Jaisalmer, Rajasthan",
    mapLink: "https://maps.google.com/?q=Suryagarh+Jaisalmer", latitude: 26.9091, longitude: 70.9053,
    contactName: "Yuvraj & Ishika", rsvpEnabled: true, rsvpLinkOrContact: "https://forms.example/moonlit-rsvp",
  },
  subEvents: [
    { eventCode: MOONLIT_CODE, order: 1, name: "Lantern Rise", date: "2026-11-14", startTime: "19:00", endTime: "21:00", venueName: "Fort Courtyard", description: "A thousand lanterns released as the moon climbs.", icon: "🏮" },
    { eventCode: MOONLIT_CODE, order: 2, name: "The Vow", date: "2026-11-15", startTime: "20:00", endTime: "21:30", venueName: "Moon Pavilion", dressCode: "Ivory & silver", description: "Pheras beneath a full moon.", icon: "🌕" },
    { eventCode: MOONLIT_CODE, order: 3, name: "The Long Table", date: "2026-11-15", startTime: "22:00", endTime: "23:59", venueName: "Candle Corridor", description: "Dinner along a corridor of ten thousand candles.", icon: "🕯" },
  ],
  media: [hero(MOONLIT_CODE, "photo-1519741497674-611481863552"), ...gallery(MOONLIT_CODE, [
    { url: SAMPLES.coupleEmbrace, caption: "Silver light" },
    { url: SAMPLES.coupleBehind, caption: "The path" },
    { url: SAMPLES.coupleSunset, caption: "Moonrise" },
    { url: SAMPLES.weddingScene, caption: "The gate" },
  ])],
};

const SKYTEMPLE_CODE = "DEMO-SKYTEMPLE";
const skytemple: DemoBundle = {
  event: {
    eventCode: SKYTEMPLE_CODE, eventType: "wedding", templateId: "skytemple",
    eventTitle: "Advait & Divya", person1Name: "Advait", person2Name: "Divya",
    tentativeDate: "2026-10-11", city: "Santorini", isActive: true, slug: SKYTEMPLE_CODE,
    heroImageUrl: SAMPLES.coupleSunset, tagline: "A wedding among the gods.",
    invitationMessage: "Above the world we knew, we found a room the sky agreed to hold for us. Come stand in it while we make our promise.",
    aboutStory: "Doors of marble opening onto cloud, a bridge of light between the two of us, and a small orchestra somewhere behind the sun. This is the day the sky lends us its temples.",
    mainDate: "2026-10-11", mainStartTime: "17:00", mainEndTime: "23:00",
    themeAccentColor: "#e6c988",
    venueName: "Temple Terrace", venueAddress: "Oia, Santorini, Greece",
    mapLink: "https://maps.google.com/?q=Oia+Santorini", latitude: 36.4614, longitude: 25.3753,
    contactName: "Advait & Divya", rsvpEnabled: true, rsvpLinkOrContact: "https://forms.example/skytemple-rsvp",
  },
  subEvents: [
    { eventCode: SKYTEMPLE_CODE, order: 1, name: "Opening the Doors", date: "2026-10-11", startTime: "17:00", endTime: "17:30", venueName: "Marble Gate", description: "Marble doors part as the sun begins its descent.", icon: "⛩" },
    { eventCode: SKYTEMPLE_CODE, order: 2, name: "The Ceremony", date: "2026-10-11", startTime: "18:00", endTime: "19:30", venueName: "Sky Terrace", dressCode: "Ivory & gold", description: "Vows exchanged on a bridge above the clouds.", icon: "✦" },
    { eventCode: SKYTEMPLE_CODE, order: 3, name: "Feast Above the Clouds", date: "2026-10-11", startTime: "20:00", endTime: "23:00", venueName: "The Sanctuary", description: "A long dinner among the temples.", icon: "🕊" },
  ],
  media: [hero(SKYTEMPLE_CODE, "photo-1519741497674-611481863552"), ...gallery(SKYTEMPLE_CODE, [
    { url: SAMPLES.coupleSunset, caption: "Ascent" }, { url: SAMPLES.coupleEmbrace, caption: "The vow" },
    { url: SAMPLES.pinkFlowers, caption: "Clouds" }, { url: SAMPLES.coupleBehind, caption: "The bridge" },
  ])],
};

const OCEANPALACE_CODE = "DEMO-OCEANPALACE";
const oceanpalace: DemoBundle = {
  event: {
    eventCode: OCEANPALACE_CODE, eventType: "wedding", templateId: "oceanpalace",
    eventTitle: "Vihaan & Anaya", person1Name: "Vihaan", person2Name: "Anaya",
    tentativeDate: "2026-08-22", city: "Maldives", isActive: true, slug: OCEANPALACE_CODE,
    heroImageUrl: SAMPLES.coupleHands, tagline: "Two tides, one shore.",
    invitationMessage: "Somewhere between the surface and the deep, the light writes its own kind of vow. Come see it with us.",
    aboutStory: "A palace nobody built and everyone can feel. The room hums like a shell. Every promise arrives on a slow current.",
    mainDate: "2026-08-22", mainStartTime: "16:00", mainEndTime: "22:00",
    themeAccentColor: "#4fb0c6",
    venueName: "Coral Reef Pavilion", venueAddress: "Baa Atoll, Maldives",
    mapLink: "https://maps.google.com/?q=Baa+Atoll+Maldives", latitude: 5.2043, longitude: 73.0669,
    contactName: "Vihaan & Anaya", rsvpEnabled: true, rsvpLinkOrContact: "https://forms.example/oceanpalace-rsvp",
  },
  subEvents: [
    { eventCode: OCEANPALACE_CODE, order: 1, name: "Pearl Welcome", date: "2026-08-21", startTime: "18:00", endTime: "21:00", venueName: "Beach", description: "Sundowners on the sand.", icon: "🐚" },
    { eventCode: OCEANPALACE_CODE, order: 2, name: "The Ceremony", date: "2026-08-22", startTime: "16:00", endTime: "17:30", venueName: "Reef Deck", dressCode: "Aquamarine & pearl", description: "Vows over the water at high tide.", icon: "🌊" },
    { eventCode: OCEANPALACE_CODE, order: 3, name: "Bioluminescent Dinner", date: "2026-08-22", startTime: "19:00", endTime: "22:00", venueName: "The Lagoon", description: "Long table lit by the water itself.", icon: "✧" },
  ],
  media: [hero(OCEANPALACE_CODE, "photo-1465495976277-4387d4b0b4c6"), ...gallery(OCEANPALACE_CODE, [
    { url: SAMPLES.coupleHands, caption: "Beneath the surface" }, { url: SAMPLES.coupleSunset, caption: "Golden water" },
    { url: SAMPLES.coupleEmbrace, caption: "Two tides" }, { url: SAMPLES.pinkFlowers, caption: "Coral" },
  ])],
};

const SYMPHONY_CODE = "DEMO-SYMPHONY";
const symphony: DemoBundle = {
  event: {
    eventCode: SYMPHONY_CODE, eventType: "wedding", templateId: "symphony",
    eventTitle: "Rehan & Zoya", person1Name: "Rehan", person2Name: "Zoya",
    tentativeDate: "2026-09-27", city: "Vienna", isActive: true, slug: SYMPHONY_CODE,
    heroImageUrl: SAMPLES.coupleBehind, tagline: "In four movements.",
    invitationMessage: "Every love has a score. Ours has been rehearsing since the day we met. Come hear the first performance.",
    aboutStory: "Movement I — the meeting. Movement II — the long slow verse. Movement III — the crescendo. Movement IV — you, walking down the aisle, all instruments held on the same note.",
    mainDate: "2026-09-27", mainStartTime: "18:00", mainEndTime: "23:00",
    themeAccentColor: "#b48eff",
    venueName: "Palais Ferstel", venueAddress: "Strauchgasse 4, Vienna, Austria",
    mapLink: "https://maps.google.com/?q=Palais+Ferstel+Vienna", latitude: 48.2115, longitude: 16.3672,
    contactName: "Rehan & Zoya", rsvpEnabled: true, rsvpLinkOrContact: "https://forms.example/symphony-rsvp",
  },
  subEvents: [
    { eventCode: SYMPHONY_CODE, order: 1, name: "I — Prelude", date: "2026-09-27", startTime: "18:00", endTime: "18:45", venueName: "The Foyer", description: "String quartet at the door.", icon: "♪" },
    { eventCode: SYMPHONY_CODE, order: 2, name: "II — Vows", date: "2026-09-27", startTime: "19:00", endTime: "20:00", venueName: "Concert Hall", dressCode: "Black tie", description: "The exchange, in the silence between movements.", icon: "♫" },
    { eventCode: SYMPHONY_CODE, order: 3, name: "III — Feast", date: "2026-09-27", startTime: "20:30", endTime: "22:00", venueName: "The Long Room", description: "Dinner scored by the full ensemble.", icon: "♬" },
    { eventCode: SYMPHONY_CODE, order: 4, name: "IV — Finale", date: "2026-09-27", startTime: "22:00", endTime: "23:00", venueName: "The Ballroom", description: "The last movement is a dance.", icon: "♩" },
  ],
  media: [hero(SYMPHONY_CODE, "photo-1606216794074-735e91aa2c92"), ...gallery(SYMPHONY_CODE, [
    { url: SAMPLES.coupleBehind, caption: "Prelude" }, { url: SAMPLES.coupleEmbrace, caption: "Crescendo" },
    { url: SAMPLES.weddingScene, caption: "Hall" }, { url: SAMPLES.coupleSunset, caption: "Finale" },
  ])],
};

const INFINITY_CODE = "DEMO-INFINITY";
const infinity: DemoBundle = {
  event: {
    eventCode: INFINITY_CODE, eventType: "engagement", templateId: "infinity",
    eventTitle: "Nihal & Sara", person1Name: "Nihal", person2Name: "Sara",
    tentativeDate: "2026-07-30", city: "Lisbon", isActive: true, slug: INFINITY_CODE,
    heroImageUrl: SAMPLES.ringsClose, tagline: "One line, forever.",
    invitationMessage: "Two paths, drawn separately for a long time, closing into one line. We're calling that a promise. Come sign your name to it.",
    aboutStory: "A ring is a circle that keeps its own promise — no start, no end, only more of itself. So is this.",
    mainDate: "2026-07-30", mainStartTime: "19:00", mainEndTime: "23:00",
    themeAccentColor: "#d4a574",
    venueName: "Rooftop of the Alfama", venueAddress: "Rua da Regueira, Lisbon, Portugal",
    mapLink: "https://maps.google.com/?q=Alfama+Lisbon", latitude: 38.7143, longitude: -9.1289,
    contactName: "Nihal & Sara", rsvpEnabled: true, rsvpLinkOrContact: "https://forms.example/infinity-rsvp",
  },
  subEvents: [
    { eventCode: INFINITY_CODE, order: 1, name: "Ring Exchange", date: "2026-07-30", startTime: "19:30", endTime: "20:00", venueName: "Rooftop Terrace", dressCode: "Warm gold", description: "The exchange, exactly one glass of champagne long.", icon: "∞" },
    { eventCode: INFINITY_CODE, order: 2, name: "Dinner", date: "2026-07-30", startTime: "20:30", endTime: "23:00", venueName: "The Terrace", description: "Long table under the Lisbon sky.", icon: "✦" },
  ],
  media: [hero(INFINITY_CODE, "photo-1525258946800-98cfd641d0de"), ...gallery(INFINITY_CODE, [
    { url: SAMPLES.ringsClose, caption: "The ring" }, { url: SAMPLES.coupleHands, caption: "Hands" },
    { url: SAMPLES.coupleEmbrace, caption: "Yes" }, { url: SAMPLES.coupleSunset, caption: "One line" },
  ])],
};

const LOVESTARS_CODE = "DEMO-LOVESTARS";
const lovestars: DemoBundle = {
  event: {
    eventCode: LOVESTARS_CODE, eventType: "engagement", templateId: "lovestars",
    eventTitle: "Kian & Amaya", person1Name: "Kian", person2Name: "Amaya",
    tentativeDate: "2026-11-11", city: "Reykjavik", isActive: true, slug: LOVESTARS_CODE,
    heroImageUrl: SAMPLES.coupleBehind, tagline: "Two destinies, one line.",
    invitationMessage: "Somewhere between two accidents, a pattern showed up. We've been staring at it for years. Come see it named out loud.",
    aboutStory: "Every memory that mattered turned out to be a star. Only now, standing far enough back, we can see the shape they were making all along.",
    mainDate: "2026-11-11", mainStartTime: "19:30", mainEndTime: "22:30",
    themeAccentColor: "#8ea9ff",
    venueName: "The Observatory Bar", venueAddress: "Laugavegur 22, Reykjavik, Iceland",
    mapLink: "https://maps.google.com/?q=Reykjavik+Iceland", latitude: 64.1466, longitude: -21.9426,
    contactName: "Kian & Amaya", rsvpEnabled: true, rsvpLinkOrContact: "https://forms.example/lovestars-rsvp",
  },
  subEvents: [
    { eventCode: LOVESTARS_CODE, order: 1, name: "Under the Aurora", date: "2026-11-11", startTime: "19:30", endTime: "20:30", venueName: "The Rooftop", description: "Champagne, sky-watching, quiet.", icon: "✧" },
    { eventCode: LOVESTARS_CODE, order: 2, name: "The Announcement", date: "2026-11-11", startTime: "20:30", endTime: "21:00", venueName: "The Observatory", description: "The room finally hears it.", icon: "✦" },
    { eventCode: LOVESTARS_CODE, order: 3, name: "Late Dinner", date: "2026-11-11", startTime: "21:00", endTime: "22:30", venueName: "The Long Room", description: "Everyone stays too long. Good.", icon: "★" },
  ],
  media: [hero(LOVESTARS_CODE, "photo-1606216794074-735e91aa2c92"), ...gallery(LOVESTARS_CODE, [
    { url: SAMPLES.coupleBehind, caption: "Constellation" }, { url: SAMPLES.coupleSunset, caption: "The pattern" },
    { url: SAMPLES.coupleEmbrace, caption: "Named" }, { url: SAMPLES.ringsClose, caption: "The ring" },
  ])],
};

const GARDEN_CODE = "DEMO-GARDEN";
const garden: DemoBundle = {
  event: {
    eventCode: GARDEN_CODE, eventType: "engagement", templateId: "garden",
    eventTitle: "Rian & Myra", person1Name: "Rian", person2Name: "Myra",
    tentativeDate: "2026-05-18", city: "Kyoto", isActive: true, slug: GARDEN_CODE,
    heroImageUrl: SAMPLES.pinkFlowers, tagline: "Something quiet is blooming.",
    invitationMessage: "There's a garden we've been growing for a long time without noticing. Today it flowers. Come stand in it with us.",
    aboutStory: "The garden was here first. It knew before we did. Butterflies drift over the memories, and every flower has a footnote nobody planted.",
    mainDate: "2026-05-18", mainStartTime: "16:00", mainEndTime: "20:30",
    themeAccentColor: "#88b06a",
    venueName: "Shosei-en Garden", venueAddress: "Shimogyo Ward, Kyoto, Japan",
    mapLink: "https://maps.google.com/?q=Shosei-en+Kyoto", latitude: 34.9902, longitude: 135.7622,
    contactName: "Rian & Myra", rsvpEnabled: true, rsvpLinkOrContact: "https://forms.example/garden-rsvp",
  },
  subEvents: [
    { eventCode: GARDEN_CODE, order: 1, name: "Garden Walk", date: "2026-05-18", startTime: "16:00", endTime: "17:00", venueName: "Shosei-en", dressCode: "Botanical pastels", description: "Petals underfoot, tea at the pavilion.", icon: "🌸" },
    { eventCode: GARDEN_CODE, order: 2, name: "The Ring", date: "2026-05-18", startTime: "17:30", endTime: "18:15", venueName: "The Greenhouse", description: "The exchange, indoors when the rain came.", icon: "🌿" },
    { eventCode: GARDEN_CODE, order: 3, name: "Garden Dinner", date: "2026-05-18", startTime: "18:30", endTime: "20:30", venueName: "The Terrace", description: "Long table under wisteria.", icon: "🦋" },
  ],
  media: [hero(GARDEN_CODE, "photo-1465495976277-4387d4b0b4c6"), ...gallery(GARDEN_CODE, [
    { url: SAMPLES.pinkFlowers, caption: "Bloom" }, { url: SAMPLES.bouquet, caption: "Petals" },
    { url: SAMPLES.coupleEmbrace, caption: "Under wisteria" }, { url: SAMPLES.coupleSunset, caption: "Golden hour" },
  ])],
};

const HORIZON_CODE = "DEMO-HORIZON";
const horizon: DemoBundle = {
  event: {
    eventCode: HORIZON_CODE, eventType: "engagement", templateId: "horizon",
    eventTitle: "Kabir & Ira", person1Name: "Kabir", person2Name: "Ira",
    tentativeDate: "2026-06-14", city: "Big Sur", isActive: true, slug: HORIZON_CODE,
    heroImageUrl: SAMPLES.coupleSunset, tagline: "Between two lights.",
    invitationMessage: "Between the last light of day and the first quiet of night, we asked one question — and the answer became a life. Come stand at that edge with us.",
    aboutStory: "Every sunset is a small conclusion the sky lets us watch. This one felt like a promise we couldn't stop looking at.",
    mainDate: "2026-06-14", mainStartTime: "18:30", mainEndTime: "22:00",
    themeAccentColor: "#e8a86a",
    venueName: "Bixby Cliffside", venueAddress: "Big Sur, California",
    mapLink: "https://maps.google.com/?q=Bixby+Bridge+Big+Sur", latitude: 36.3722, longitude: -121.9017,
    contactName: "Kabir & Ira", rsvpEnabled: true, rsvpLinkOrContact: "https://forms.example/horizon-rsvp",
  },
  subEvents: [
    { eventCode: HORIZON_CODE, order: 1, name: "Golden Hour", date: "2026-06-14", startTime: "18:30", endTime: "19:30", venueName: "The Cliff", dressCode: "Warm tones", description: "Champagne, silhouettes, one very committed sunset.", icon: "🌇" },
    { eventCode: HORIZON_CODE, order: 2, name: "Twilight Dinner", date: "2026-06-14", startTime: "20:00", endTime: "22:00", venueName: "The Terrace", description: "Long table as the sky rotates through everything.", icon: "✦" },
  ],
  media: [hero(HORIZON_CODE, "photo-1519741497674-611481863552"), ...gallery(HORIZON_CODE, [
    { url: SAMPLES.coupleSunset, caption: "Golden hour" }, { url: SAMPLES.coupleBehind, caption: "The edge" },
    { url: SAMPLES.coupleEmbrace, caption: "Twilight" }, { url: SAMPLES.pinkFlowers, caption: "Silhouettes" },
  ])],
};

const TOYBOX_CODE = "DEMO-TOYBOX";
const toybox: DemoBundle = {
  event: {
    eventCode: TOYBOX_CODE, eventType: "birthday", templateId: "toybox",
    eventTitle: "Riaan turns 4!", person1Name: "Riaan",
    tentativeDate: "2026-08-04", city: "Mumbai", isActive: true, slug: TOYBOX_CODE,
    heroImageUrl: SAMPLES.confetti, tagline: "A whole city for one day.",
    invitationMessage: "Blocks, trains, balloons, cake and one very important small human. Come play in the tiny universe we're building for a day.",
    aboutStory: "A city made of blocks. Trains that go where their engineers point. And one birthday that everyone else in the toybox is celebrating.",
    mainDate: "2026-08-04", mainStartTime: "15:30", mainEndTime: "18:30",
    themeAccentColor: "#ff9f4a",
    venueName: "Playhouse Mumbai", venueAddress: "Bandra West, Mumbai",
    mapLink: "https://maps.google.com/?q=Bandra+Mumbai", latitude: 19.0596, longitude: 72.8295,
    contactName: "Priya (Mum)", contactPhone: "+91-98xxxxxxx", rsvpEnabled: true, rsvpLinkOrContact: "+91-98xxxxxxx",
  },
  subEvents: [
    { eventCode: TOYBOX_CODE, order: 1, name: "Block City", date: "2026-08-04", startTime: "15:30", endTime: "16:15", venueName: "Play zone", description: "Build a city, knock it down, build it again.", icon: "🧱" },
    { eventCode: TOYBOX_CODE, order: 2, name: "Toy Train", date: "2026-08-04", startTime: "16:15", endTime: "17:00", venueName: "The tunnel", description: "The train arrives on time. This is important.", icon: "🚂" },
    { eventCode: TOYBOX_CODE, order: 3, name: "Cake Time", date: "2026-08-04", startTime: "17:30", endTime: "18:30", venueName: "Main hall", description: "Bring napkins.", icon: "🎂" },
  ],
  media: [hero(TOYBOX_CODE, "photo-1530103862676-de8c9debad1d"), ...gallery(TOYBOX_CODE, [
    { url: SAMPLES.confetti, caption: "Blocks" }, { url: SAMPLES.pinkFlowers, caption: "Cake" },
    { url: PICSUM(`${TOYBOX_CODE}-train`, 1200, 1500), caption: "Train" },
    { url: PICSUM(`${TOYBOX_CODE}-balloons`, 1200, 1500), caption: "Balloons" },
  ])],
};

const TIMEMACHINE_CODE = "DEMO-TIMEMACHINE";
const timemachine: DemoBundle = {
  event: {
    eventCode: TIMEMACHINE_CODE, eventType: "birthday", templateId: "timemachine",
    eventTitle: "Aparna turns 50", person1Name: "Aparna",
    tentativeDate: "2026-09-08", city: "Bengaluru", isActive: true, slug: TIMEMACHINE_CODE,
    heroImageUrl: SAMPLES.coupleSunset, tagline: "Every year, a chapter.",
    invitationMessage: "A whole life, worth toasting. Come walk through the years with us — the awkward ones included.",
    aboutStory: "A calendar the size of a room. Clocks that only run forward when you scroll. Everything that's happened, waiting on the right page.",
    mainDate: "2026-09-08", mainStartTime: "19:00", mainEndTime: "23:00",
    themeAccentColor: "#a67b3c",
    venueName: "The Grand Ballroom", venueAddress: "Taj West End, Bengaluru",
    mapLink: "https://maps.google.com/?q=Taj+West+End+Bengaluru", latitude: 12.9884, longitude: 77.5844,
    contactName: "Family", rsvpEnabled: true, rsvpLinkOrContact: "https://forms.example/timemachine-rsvp",
  },
  subEvents: [
    { eventCode: TIMEMACHINE_CODE, order: 1, name: "The Early Years", date: "2026-09-08", startTime: "19:00", endTime: "19:45", venueName: "Foyer", description: "Photographs, cocktails, embarrassing yearbook pages.", icon: "⏳" },
    { eventCode: TIMEMACHINE_CODE, order: 2, name: "The Middle", date: "2026-09-08", startTime: "20:00", endTime: "21:15", venueName: "The Long Table", description: "Dinner, toasts, the years everyone remembers differently.", icon: "🗝" },
    { eventCode: TIMEMACHINE_CODE, order: 3, name: "The Now", date: "2026-09-08", startTime: "21:30", endTime: "23:00", venueName: "The Ballroom", description: "Dance floor, playlist assembled by family, no phones out.", icon: "✦" },
  ],
  media: [hero(TIMEMACHINE_CODE, "photo-1465495976277-4387d4b0b4c6"), ...gallery(TIMEMACHINE_CODE, [
    { url: SAMPLES.coupleSunset, caption: "1976" }, { url: SAMPLES.coupleEmbrace, caption: "1994" },
    { url: SAMPLES.pinkFlowers, caption: "2005" }, { url: SAMPLES.coupleBehind, caption: "2019" },
  ])],
};

const CARNIVAL_CODE = "DEMO-CARNIVAL";
const carnival: DemoBundle = {
  event: {
    eventCode: CARNIVAL_CODE, eventType: "birthday", templateId: "carnival",
    eventTitle: "Zara turns 21!", person1Name: "Zara",
    tentativeDate: "2026-10-04", city: "Bengaluru", isActive: true, slug: CARNIVAL_CODE,
    heroImageUrl: SAMPLES.confetti, tagline: "The lights are on for you.",
    invitationMessage: "The rides are running, the popcorn is warm and the fireworks are on standby. Bring cash for the games and nothing to prove.",
    aboutStory: "A ferris wheel turning above the neon. Booths with prizes nobody needs. Fireworks the sky agreed to spend on one person tonight.",
    mainDate: "2026-10-04", mainStartTime: "20:00", mainEndTime: "01:00",
    themeAccentColor: "#ff4dd2",
    venueName: "The Rooftop Fairground", venueAddress: "Indiranagar, Bengaluru",
    mapLink: "https://maps.google.com/?q=Indiranagar+Bengaluru", latitude: 12.9784, longitude: 77.6408,
    contactName: "Zara", socialLink: "https://instagram.com/", rsvpEnabled: true, rsvpLinkOrContact: "https://forms.example/carnival-rsvp",
  },
  subEvents: [
    { eventCode: CARNIVAL_CODE, order: 1, name: "Gates Open", date: "2026-10-04", startTime: "20:00", endTime: "21:00", venueName: "The Rooftop", description: "Ticket booth, welcome drinks, first photo-booth queue.", icon: "🎡" },
    { eventCode: CARNIVAL_CODE, order: 2, name: "Fireworks", date: "2026-10-04", startTime: "22:00", endTime: "22:30", venueName: "The Sky", description: "Look up, don't check your phone.", icon: "🎆" },
    { eventCode: CARNIVAL_CODE, order: 3, name: "After Rides", date: "2026-10-04", startTime: "22:30", endTime: "01:00", venueName: "The Dance Floor", description: "The last ride is the loudest.", icon: "✧" },
  ],
  media: [hero(CARNIVAL_CODE, "photo-1530103862676-de8c9debad1d"), ...gallery(CARNIVAL_CODE, [
    { url: SAMPLES.confetti, caption: "Neon" }, { url: PICSUM(`${CARNIVAL_CODE}-ferris`, 1200, 1500), caption: "Ferris wheel" },
    { url: PICSUM(`${CARNIVAL_CODE}-booth`, 1200, 1500), caption: "Photo booth" }, { url: PICSUM(`${CARNIVAL_CODE}-fireworks`, 1200, 1500), caption: "Fireworks" },
  ])],
};

const DREAMFACTORY_CODE = "DEMO-DREAMFACTORY";
const dreamfactory: DemoBundle = {
  event: {
    eventCode: DREAMFACTORY_CODE, eventType: "birthday", templateId: "dreamfactory",
    eventTitle: "Kabir turns 8", person1Name: "Kabir",
    tentativeDate: "2026-07-12", city: "Pune", isActive: true, slug: DREAMFACTORY_CODE,
    heroImageUrl: SAMPLES.confetti, tagline: "Assembly required.",
    invitationMessage: "The factory ran overtime this week — balloons, cake and one very custom-built birthday, packed and ready. Come pick yours up.",
    aboutStory: "Conveyor belts humming, robots making executive decisions about frosting, and every gear turning toward the same happy shipment.",
    mainDate: "2026-07-12", mainStartTime: "15:00", mainEndTime: "18:00",
    themeAccentColor: "#f77c3c",
    venueName: "The Workshop", venueAddress: "Koregaon Park, Pune",
    mapLink: "https://maps.google.com/?q=Koregaon+Park+Pune", latitude: 18.5362, longitude: 73.8939,
    contactName: "Family", contactPhone: "+91-98xxxxxxx", rsvpEnabled: true, rsvpLinkOrContact: "+91-98xxxxxxx",
  },
  subEvents: [
    { eventCode: DREAMFACTORY_CODE, order: 1, name: "Line Start", date: "2026-07-12", startTime: "15:00", endTime: "15:45", venueName: "Workshop floor", description: "Assembly stations, robot assistants, safety glasses (optional).", icon: "⚙" },
    { eventCode: DREAMFACTORY_CODE, order: 2, name: "Quality Control", date: "2026-07-12", startTime: "16:00", endTime: "17:00", venueName: "Cake bay", description: "The cake is inspected. Repeatedly.", icon: "🎂" },
    { eventCode: DREAMFACTORY_CODE, order: 3, name: "Shipping", date: "2026-07-12", startTime: "17:00", endTime: "18:00", venueName: "Delivery bay", description: "Everyone leaves with something.", icon: "📦" },
  ],
  media: [hero(DREAMFACTORY_CODE, "photo-1530103862676-de8c9debad1d"), ...gallery(DREAMFACTORY_CODE, [
    { url: SAMPLES.confetti, caption: "Assembly" }, { url: PICSUM(`${DREAMFACTORY_CODE}-robot`, 1200, 1500), caption: "Robot" },
    { url: PICSUM(`${DREAMFACTORY_CODE}-belt`, 1200, 1500), caption: "Conveyor" }, { url: SAMPLES.pinkFlowers, caption: "Cake" },
  ])],
};

const LIBRARY_CODE = "DEMO-LIBRARY";
const library: DemoBundle = {
  event: {
    eventCode: LIBRARY_CODE, eventType: "anniversary", templateId: "library",
    eventTitle: "Sohini & Arjun — 30 years", person1Name: "Sohini", person2Name: "Arjun",
    tentativeDate: "2026-12-19", city: "Kolkata", isActive: true, slug: LIBRARY_CODE,
    heroImageUrl: SAMPLES.coupleSunset, tagline: "Volume the next.",
    invitationMessage: "Twenty-something books, one shelf, one very long argument about whose fault the good years were. Come read a few chapters with us.",
    aboutStory: "Books lined up like the years that made them. Butterflies escaping the letters. A staircase to the next chapter that only opens when both of us walk on it.",
    mainDate: "2026-12-19", mainStartTime: "18:30", mainEndTime: "23:00",
    themeAccentColor: "#7c5a2e",
    venueName: "The Grand Reading Room", venueAddress: "Park Street, Kolkata",
    mapLink: "https://maps.google.com/?q=Park+Street+Kolkata", latitude: 22.5535, longitude: 88.352,
    contactName: "Sohini & Arjun", rsvpEnabled: true, rsvpLinkOrContact: "https://forms.example/library-rsvp",
  },
  subEvents: [
    { eventCode: LIBRARY_CODE, order: 1, name: "The Toast", date: "2026-12-19", startTime: "18:30", endTime: "19:30", venueName: "Reading Room", description: "One glass, thirty years, several unfair jokes.", icon: "📖" },
    { eventCode: LIBRARY_CODE, order: 2, name: "The Reading", date: "2026-12-19", startTime: "19:30", endTime: "21:00", venueName: "The Terrace", description: "Letters read aloud by the people who know.", icon: "❦" },
    { eventCode: LIBRARY_CODE, order: 3, name: "The Dance", date: "2026-12-19", startTime: "21:30", endTime: "23:00", venueName: "The Ballroom", description: "The playlist from 1996. Still works.", icon: "❧" },
  ],
  media: [hero(LIBRARY_CODE, "photo-1465495976277-4387d4b0b4c6"), ...gallery(LIBRARY_CODE, [
    { url: SAMPLES.coupleSunset, caption: "Chapter I" }, { url: SAMPLES.coupleEmbrace, caption: "Chapter V" },
    { url: SAMPLES.coupleBehind, caption: "Chapter XV" }, { url: SAMPLES.coupleHands, caption: "Chapter XXX" },
  ])],
};

const QUANTUM_CODE = "DEMO-QUANTUM";
const quantum: DemoBundle = {
  event: {
    eventCode: QUANTUM_CODE, eventType: "corporate", templateId: "quantum",
    eventTitle: "Quantum City 2026", person1Name: "Quantum Foundation",
    tentativeDate: "2026-11-05", city: "Seoul", isActive: true, slug: QUANTUM_CODE,
    heroImageUrl: UNSPLASH("photo-1486312338219-ce68d2c6f44d"), tagline: "The city, indexed.",
    invitationMessage: "One week. Every track a district. Every speaker a landmark. Come navigate the future with us.",
    aboutStory: "A smart city as a conference map. Every session is an address. Every network cable is a road. Every idea, a building somebody is standing under.",
    mainDate: "2026-11-05", mainStartTime: "09:00", mainEndTime: "18:00",
    themeAccentColor: "#3ea6ff",
    venueName: "Coex Convention Center", venueAddress: "Yeongdong-daero, Gangnam-gu, Seoul",
    mapLink: "https://maps.google.com/?q=Coex+Seoul", latitude: 37.5116, longitude: 127.0596,
    contactName: "Quantum Ops", contactEmail: "hello@quantumcity.io", rsvpEnabled: true, rsvpLinkOrContact: "https://quantumcity.io/register",
  },
  subEvents: [
    { eventCode: QUANTUM_CODE, order: 1, name: "Opening Keynote", date: "2026-11-05", startTime: "09:30", endTime: "10:30", venueName: "Main Hall", description: "The state of the map — where the districts are moving.", icon: "🏙" },
    { eventCode: QUANTUM_CODE, order: 2, name: "District Tracks", date: "2026-11-05", startTime: "11:00", endTime: "16:00", venueName: "Halls A-F", description: "Six parallel tracks — AI, robotics, biotech, quantum, climate, security.", icon: "◈" },
    { eventCode: QUANTUM_CODE, order: 3, name: "City Lights Reception", date: "2026-11-05", startTime: "19:00", endTime: "22:00", venueName: "Skyline Terrace", description: "Cocktails and unstructured hallway conversations.", icon: "✦" },
  ],
  media: [],
};

const GENESIS_CODE = "DEMO-GENESIS";
const genesis: DemoBundle = {
  event: {
    eventCode: GENESIS_CODE, eventType: "product-launch", templateId: "genesis",
    eventTitle: "Project Genesis", person1Name: "Genesis Labs",
    tentativeDate: "2026-10-24", city: "Cupertino", isActive: true, slug: GENESIS_CODE,
    heroImageUrl: UNSPLASH("photo-1492684223066-81342ee5ff30"), tagline: "Watch it come together.",
    invitationMessage: "You will see it built in front of you. Particle by particle. Layer by layer. Until the moment we can't hide it any more.",
    aboutStory: "Every prototype we ever threw away. Every meeting that ran long. Every quiet decision to remove one more thing. All of it walked us to the object you'll meet on stage.",
    mainDate: "2026-10-24", mainStartTime: "10:00", mainEndTime: "13:00",
    themeAccentColor: "#ff5147",
    venueName: "Steve Jobs Theater", venueAddress: "One Apple Park Way, Cupertino, CA",
    mapLink: "https://maps.google.com/?q=Steve+Jobs+Theater", latitude: 37.3346, longitude: -122.009,
    contactName: "Genesis Team", contactEmail: "hello@genesis.dev", rsvpEnabled: true, rsvpLinkOrContact: "https://genesis.dev/launch",
  },
  subEvents: [
    { eventCode: GENESIS_CODE, order: 1, name: "Doors", date: "2026-10-24", startTime: "09:30", endTime: "10:00", venueName: "Theater Lobby", description: "Silent entry. Coffee, no press.", icon: "◈" },
    { eventCode: GENESIS_CODE, order: 2, name: "The Assembly", date: "2026-10-24", startTime: "10:00", endTime: "11:15", venueName: "Main Stage", description: "The product built in front of the room.", icon: "◆" },
    { eventCode: GENESIS_CODE, order: 3, name: "Hands-On", date: "2026-10-24", startTime: "11:30", endTime: "13:00", venueName: "The Atrium", description: "Talk to the engineers. Touch the thing.", icon: "✦" },
  ],
  media: [],
};

const IMMORTALS_CODE = "DEMO-IMMORTALS";
const immortals: DemoBundle = {
  event: {
    eventCode: IMMORTALS_CODE, eventType: "award-ceremony", templateId: "immortals",
    eventTitle: "The Immortals — 2026", person1Name: "The Immortals Foundation",
    tentativeDate: "2026-12-06", city: "Paris", isActive: true, slug: IMMORTALS_CODE,
    heroImageUrl: UNSPLASH("photo-1501281668745-f7f57925c3b4"), tagline: "Where names stay.",
    invitationMessage: "A room built to remember. Tonight we add another set of names to a list nobody will forget.",
    aboutStory: "Golden pillars, reflective floors, one spotlight per soul. Above it all a sky of golden stars, each one a story that decided to keep going.",
    mainDate: "2026-12-06", mainStartTime: "19:00", mainEndTime: "23:59",
    themeAccentColor: "#e5c26a",
    venueName: "Palais Garnier", venueAddress: "Place de l'Opéra, 75009 Paris, France",
    mapLink: "https://maps.google.com/?q=Palais+Garnier+Paris", latitude: 48.8719, longitude: 2.3316,
    contactName: "The Foundation", contactEmail: "awards@immortals.foundation", rsvpEnabled: true, rsvpLinkOrContact: "https://immortals.foundation/tickets",
  },
  subEvents: [
    { eventCode: IMMORTALS_CODE, order: 1, name: "The Arrival", date: "2026-12-06", startTime: "19:00", endTime: "20:00", venueName: "The Grand Staircase", dressCode: "White tie", description: "The staircase, the coats, the first photograph of the night.", icon: "🏛" },
    { eventCode: IMMORTALS_CODE, order: 2, name: "The Naming", date: "2026-12-06", startTime: "20:00", endTime: "22:00", venueName: "Main Auditorium", description: "Twelve pillars added to the hall this year.", icon: "★" },
    { eventCode: IMMORTALS_CODE, order: 3, name: "The Room After", date: "2026-12-06", startTime: "22:30", endTime: "23:59", venueName: "The Salon", dressCode: "White tie", description: "The photograph everyone remembers, taken by someone who wasn't invited.", icon: "✦" },
  ],
  media: [],
};

const ECOSYSTEM_CODE = "DEMO-ECOSYSTEM";
const ecosystem: DemoBundle = {
  event: {
    eventCode: ECOSYSTEM_CODE, eventType: "networking-event", templateId: "ecosystem",
    eventTitle: "Ecosystem — Founders Forest", person1Name: "Ecosystem",
    tentativeDate: "2026-10-19", city: "Stockholm", isActive: true, slug: ECOSYSTEM_CODE,
    heroImageUrl: UNSPLASH("photo-1540575467063-178a50c2df87"), tagline: "A room that grows.",
    invitationMessage: "A community is not a list. It's a shape that changes shape when the right people are in the room. Tonight the room is you.",
    aboutStory: "Every person a node. Every conversation a new edge. The network isn't built when we walk in — it's built while we're here.",
    mainDate: "2026-10-19", mainStartTime: "18:00", mainEndTime: "22:00",
    themeAccentColor: "#4bc27a",
    venueName: "Fotografiska", venueAddress: "Stadsgårdshamnen 22, Stockholm, Sweden",
    mapLink: "https://maps.google.com/?q=Fotografiska+Stockholm", latitude: 59.3183, longitude: 18.086,
    contactName: "Ecosystem Team", contactEmail: "hello@ecosystem.dev", socialLink: "https://linkedin.com/", rsvpEnabled: true, rsvpLinkOrContact: "https://ecosystem.dev/rsvp",
  },
  subEvents: [
    { eventCode: ECOSYSTEM_CODE, order: 1, name: "Growth Hour", date: "2026-10-19", startTime: "18:00", endTime: "19:00", venueName: "The Foyer", description: "Coats, drinks, first roots.", icon: "🌱" },
    { eventCode: ECOSYSTEM_CODE, order: 2, name: "Living Network", date: "2026-10-19", startTime: "19:00", endTime: "21:00", venueName: "The Main Room", description: "Fluid rounds, no name tags, actual conversations.", icon: "🕸" },
    { eventCode: ECOSYSTEM_CODE, order: 3, name: "Late Grove", date: "2026-10-19", startTime: "21:00", endTime: "22:00", venueName: "The Terrace", description: "The unstructured hour. The best one.", icon: "✦" },
  ],
  media: [],
};

const INFINITYCLUB_CODE = "DEMO-INFINITYCLUB";
const infinityclub: DemoBundle = {
  event: {
    eventCode: INFINITYCLUB_CODE, eventType: "party", templateId: "infinityclub",
    eventTitle: "INFINITY: The Long Room", person1Name: "Infinity",
    tentativeDate: "2026-12-27", city: "Ibiza", isActive: true, slug: INFINITYCLUB_CODE,
    heroImageUrl: UNSPLASH("photo-1470229722913-7c0e2dbbafd3"), tagline: "Every room leads here.",
    invitationMessage: "One club, several rooms, no end. Take the elevator, the corridor, the wrong turn — every route ends at the same night.",
    aboutStory: "Tunnels of light joining rooms that shouldn't fit in one building. LED walls that answer when you look at them. The kind of night that quietly forgets to end.",
    mainDate: "2026-12-27", mainStartTime: "23:00", mainEndTime: "07:00",
    themeAccentColor: "#00e5ff",
    venueName: "Amnesia", venueAddress: "Ctra. Ibiza a San Antonio, Ibiza, Spain",
    mapLink: "https://maps.google.com/?q=Amnesia+Ibiza", latitude: 38.9611, longitude: 1.4137,
    contactName: "Infinity Collective", socialLink: "https://instagram.com/", rsvpEnabled: true, rsvpLinkOrContact: "https://ra.co/events/ibiza",
  },
  subEvents: [
    { eventCode: INFINITYCLUB_CODE, order: 1, name: "Room A", date: "2026-12-27", startTime: "23:00", endTime: "01:00", venueName: "Main Floor", dressCode: "Anything", description: "Warm-up set. Doors, drinks, first tunnel opens.", icon: "◈" },
    { eventCode: INFINITYCLUB_CODE, order: 2, name: "Room B — The Long Corridor", date: "2026-12-28", startTime: "01:00", endTime: "03:30", venueName: "Corridor Room", description: "Headliner. LED walls answer back.", icon: "✦" },
    { eventCode: INFINITYCLUB_CODE, order: 3, name: "Room C — Sunrise", date: "2026-12-28", startTime: "03:30", endTime: "07:00", venueName: "Rooftop", description: "The room the sun finds us in.", icon: "☀" },
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
  [ROYAL_CODE]: royal,
  [MINIMAL_CODE]: minimal,
  [MODERN_CODE]: modern,
  [VIBRANT_CODE]: vibrant,
  [PASTEL_CODE]: pastel,
  [AURORA_CODE]: aurora,
  [OBSIDIAN_CODE]: obsidian,
  [CELESTIA_CODE]: celestia,
  [EMPYREAN_CODE]: empyrean,
  [PRISM_CODE]: prism,
  [ORBIT_CODE]: orbit,
  [ARCADE_CODE]: arcade,
  [PROMISE_CODE]: promise,
  [CHAPTERS_CODE]: chapters,
  [NEURAL_CODE]: neural,
  [UNVEIL_CODE]: unveil,
  [ODEON_CODE]: odeon,
  [CONSTELLA_CODE]: constella,
  [METROPOLIS_CODE]: metropolis,
  [MOONLIT_CODE]: moonlit,
  [SKYTEMPLE_CODE]: skytemple,
  [OCEANPALACE_CODE]: oceanpalace,
  [SYMPHONY_CODE]: symphony,
  [INFINITY_CODE]: infinity,
  [LOVESTARS_CODE]: lovestars,
  [GARDEN_CODE]: garden,
  [HORIZON_CODE]: horizon,
  [TOYBOX_CODE]: toybox,
  [TIMEMACHINE_CODE]: timemachine,
  [CARNIVAL_CODE]: carnival,
  [DREAMFACTORY_CODE]: dreamfactory,
  [LIBRARY_CODE]: library,
  [QUANTUM_CODE]: quantum,
  [GENESIS_CODE]: genesis,
  [IMMORTALS_CODE]: immortals,
  [ECOSYSTEM_CODE]: ecosystem,
  [INFINITYCLUB_CODE]: infinityclub,
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
  empyrean: EMPYREAN_CODE,
  prism: PRISM_CODE,
  orbit: ORBIT_CODE,
  arcade: ARCADE_CODE,
  promise: PROMISE_CODE,
  chapters: CHAPTERS_CODE,
  neural: NEURAL_CODE,
  unveil: UNVEIL_CODE,
  odeon: ODEON_CODE,
  constella: CONSTELLA_CODE,
  metropolis: METROPOLIS_CODE,
  moonlit: MOONLIT_CODE,
  skytemple: SKYTEMPLE_CODE,
  oceanpalace: OCEANPALACE_CODE,
  symphony: SYMPHONY_CODE,
  infinity: INFINITY_CODE,
  lovestars: LOVESTARS_CODE,
  garden: GARDEN_CODE,
  horizon: HORIZON_CODE,
  toybox: TOYBOX_CODE,
  timemachine: TIMEMACHINE_CODE,
  carnival: CARNIVAL_CODE,
  dreamfactory: DREAMFACTORY_CODE,
  library: LIBRARY_CODE,
  quantum: QUANTUM_CODE,
  genesis: GENESIS_CODE,
  immortals: IMMORTALS_CODE,
  ecosystem: ECOSYSTEM_CODE,
  infinityclub: INFINITYCLUB_CODE,
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
