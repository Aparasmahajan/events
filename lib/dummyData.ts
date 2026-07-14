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
  // Indian / Hindu wedding photos — the platform's primary market. Hosted
  // locally in public/samples/ because Wikimedia rate-limits hotlinks and
  // Unsplash's random-ID scheme kept giving us false positives.
  //
  // DEMO POLICY: only *non-people* ritual/decoration photos are used in
  // demos and gallery (customers upload their own pre-wedding-shoot photos
  // for the people shots). The `indianCouple`/`indianBride`/etc. entries
  // remain here so templates that reference them by name don't break, but
  // are not used by `indianWeddingGallery()` below.
  indianMandap: "/samples/indian-mandap.jpg",
  indianMandapDecor: "/samples/indian-mandap-decor.jpg",
  indianMandapFlowers: "/samples/mandap-flowers.jpg",
  indianMehndi: "/samples/mehndi-hands.jpg",
  indianMehndiDetail: "/samples/mehndi-detail.jpg",
  indianLotus: "/samples/lotus-decor.jpg",
  indianRangoli: "/samples/rangoli.jpg",
  indianDiya: "/samples/diya-lamps.jpg",
  indianFlowers: "/samples/wedding-flowers.jpg",
  indianPuja: "/samples/puja-offerings.jpg",
  indianFire: "/samples/indian-fire.jpg",
  // Variety hero photos — universal wedding details / atmospheric shots
  // that imply human joy without showing specific faces. Used to give
  // each wedding template a distinct hero matching its aesthetic.
  weddingRingsRoses: "/samples/rings-roses.jpg",
  weddingShoes: "/samples/wedding-shoes.jpg",
  bridalLehenga: "/samples/bridal-lehenga.jpg",
  weddingCake: "/samples/wedding-cake.jpg",
  chandelier: "/samples/chandelier.jpg",
  stainedGlass: "/samples/stained-glass.jpg",
  auroraSky: "/samples/aurora-sky.jpg",
  sakuraBranch: "/samples/sakura-branch.jpg",
  desertDunes: "/samples/desert-dunes.jpg",
  marbleColumns: "/samples/marble-columns.jpg",
  coralReef: "/samples/coral-reef.jpg",
  roseWindow: "/samples/rose-window.jpg",
  // People-shots — retained for back-compat with any template that reads
  // them by name, but NOT surfaced in the demo gallery. Customers replace
  // these with their own pre-wedding shoot.
  indianCouple: "/samples/indian-couple.jpg",
  indianBride: "/samples/indian-bride.jpg",
  indianVarmala: "/samples/indian-varmala.jpg",
  indianVarmalaRitual: "/samples/indian-varmala-ritual.jpg",
  indianJaimala: "/samples/indian-jaimala.jpg",
  indianSaatPhere: "/samples/indian-saat-phere.jpg",
  indianCeremony: "/samples/indian-ceremony.jpg",
  indianBrideGroom: "/samples/indian-bride-groom.jpg",
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

// Same shape as `hero()` but takes a full URL — used when the hero image
// lives outside Unsplash (e.g. Wikimedia Commons for the Indian wedding demo).
function heroUrl(code: string, url: string): MediaItem {
  return {
    eventCode: code,
    mediaType: "image",
    section: "hero",
    fileName: "hero.jpg",
    publicUrl: url,
    sortOrder: 0,
  };
}

// Curated 8-photo Indian wedding gallery reused across every wedding demo.
// Order matters: the first three feed art-directed hero collages downstream
// (circular medallion + circular medallion + polaroid detail).
// Curated 8-photo demo gallery — ritual + decoration details only, no faces.
// Customers upload their own pre-wedding-shoot people photos through the
// editor; the demo shows what a *decorated* wedding site looks like without
// pretending to be a specific couple.
function indianWeddingGallery(
  code: string,
  extra?: { url: string; caption?: string }[],
): MediaItem[] {
  // A clean, aesthetic set — no mehndi/henna, no cluttered snapshots. Elegant
  // wedding detail + decor shots that look good in any template's gallery.
  return gallery(code, [
    { url: SAMPLES.weddingRingsRoses, caption: "The rings" },
    { url: SAMPLES.indianMandapFlowers, caption: "The mandap" },
    { url: SAMPLES.indianDiya, caption: "Diyas at dusk" },
    { url: SAMPLES.indianLotus, caption: "Blooms" },
    { url: SAMPLES.weddingCake, caption: "The celebration" },
    { url: SAMPLES.indianRangoli, caption: "Rangoli" },
    ...(extra ?? []),
  ]);
}

// ---------- ROYAL — WED-2026-0001 ----------

const ROYAL_CODE = "DEMO-ROYAL";
const royal: DemoBundle = {
  event: {
    eventCode: ROYAL_CODE,
    eventType: "wedding",
    templateId: "royal",
    eventTitle: "Arjun weds Meera",
    person1Name: "Arjun",
    person2Name: "Meera",
    tentativeDate: "2026-12-14",
    city: "Udaipur",
    isActive: true,
    slug: ROYAL_CODE,
    heroImageUrl: SAMPLES.indianMandap, tagline: "Two souls. One forever.",
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
    heroUrl(ROYAL_CODE, SAMPLES.indianMandap),
    ...indianWeddingGallery(ROYAL_CODE),
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
    heroImageUrl: SAMPLES.weddingShoes, tagline: "A quiet kind of joy.",
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
    heroUrl(MINIMAL_CODE, SAMPLES.indianCouple),
    ...indianWeddingGallery(MINIMAL_CODE),
  ],
};

// ---------- MODERN — CORP-2026-0001 ----------

const MODERN_CODE = "DEMO-MODERN";
const modern: DemoBundle = {
  event: {
    eventCode: MODERN_CODE,
    eventType: "corporate",
    templateId: "modern",
    eventTitle: "Mahajan Summit 2026",
    person1Name: "Mahajan",
    tentativeDate: "2026-09-22",
    city: "Mumbai",
    isActive: true,
    slug: MODERN_CODE,
    heroImageUrl: UNSPLASH("photo-1540575467063-178a50c2df87"),
    tagline: "Build · Ship · Scale",
    invitationMessage:
      "A full day of keynotes, case studies and candid hallway conversations with product leaders.",
    aboutStory:
      "Mahajan Summit returns for its third year. 600 attendees, 18 speakers, one shared agenda — ship faster without breaking what matters.",
    mainDate: "2026-09-22",
    mainStartTime: "09:00",
    mainEndTime: "21:00",
    themeAccentColor: "#7c3aed",
    venueName: "BKC Convention Center",
    venueAddress: "Bandra Kurla Complex, Mumbai",
    mapLink: "https://maps.google.com/?q=BKC+Convention+Center+Mumbai",
    latitude: 19.0596,
    longitude: 72.8656,
    contactName: "Mahajan events team",
    contactEmail: "events@Mahajan.io",
    rsvpEnabled: true,
    rsvpLinkOrContact: "https://summit.Mahajan.io/register",
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
    heroImageUrl: SAMPLES.auroraSky, tagline: "Two orbits, one light.",
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
    heroUrl(AURORA_CODE, SAMPLES.indianCeremony),
    ...indianWeddingGallery(AURORA_CODE),
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
    heroImageUrl: SAMPLES.chandelier, tagline: "An evening, in acts.",
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
    heroUrl(OBSIDIAN_CODE, SAMPLES.indianSaatPhere),
    ...indianWeddingGallery(OBSIDIAN_CODE),
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
    heroImageUrl: SAMPLES.indianLotus, tagline: "Written in the stars.",
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
    heroUrl(CELESTIA_CODE, SAMPLES.indianVarmalaRitual),
    ...indianWeddingGallery(CELESTIA_CODE),
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
    heroImageUrl: SAMPLES.marbleColumns, tagline: "A love ascending.",
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
    heroUrl(EMPYREAN_CODE, SAMPLES.indianMandapDecor),
    ...indianWeddingGallery(EMPYREAN_CODE),
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
    heroImageUrl: SAMPLES.stainedGlass, tagline: "Light meets light.",
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
    heroUrl(PRISM_CODE, SAMPLES.indianBride),
    ...indianWeddingGallery(PRISM_CODE),
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
    heroImageUrl: SAMPLES.indianDiya, tagline: "Under one silver sky.",
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
  media: [heroUrl(MOONLIT_CODE, SAMPLES.indianFire), ...indianWeddingGallery(MOONLIT_CODE)],
};

const SKYTEMPLE_CODE = "DEMO-SKYTEMPLE";
const skytemple: DemoBundle = {
  event: {
    eventCode: SKYTEMPLE_CODE, eventType: "wedding", templateId: "skytemple",
    eventTitle: "Advait & Divya", person1Name: "Advait", person2Name: "Divya",
    tentativeDate: "2026-10-11", city: "Santorini", isActive: true, slug: SKYTEMPLE_CODE,
    heroImageUrl: SAMPLES.indianMandapDecor, tagline: "A wedding among the gods.",
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
  media: [heroUrl(SKYTEMPLE_CODE, SAMPLES.indianMandap), ...indianWeddingGallery(SKYTEMPLE_CODE)],
};

const OCEANPALACE_CODE = "DEMO-OCEANPALACE";
const oceanpalace: DemoBundle = {
  event: {
    eventCode: OCEANPALACE_CODE, eventType: "wedding", templateId: "oceanpalace",
    eventTitle: "Vihaan & Anaya", person1Name: "Vihaan", person2Name: "Anaya",
    tentativeDate: "2026-08-22", city: "Maldives", isActive: true, slug: OCEANPALACE_CODE,
    heroImageUrl: SAMPLES.coralReef, tagline: "Two tides, one shore.",
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
  media: [heroUrl(OCEANPALACE_CODE, SAMPLES.indianBride), ...indianWeddingGallery(OCEANPALACE_CODE)],
};

const SYMPHONY_CODE = "DEMO-SYMPHONY";
const symphony: DemoBundle = {
  event: {
    eventCode: SYMPHONY_CODE, eventType: "wedding", templateId: "symphony",
    eventTitle: "Rehan & Zoya", person1Name: "Rehan", person2Name: "Zoya",
    tentativeDate: "2026-09-27", city: "Vienna", isActive: true, slug: SYMPHONY_CODE,
    heroImageUrl: SAMPLES.indianFire, tagline: "In four movements.",
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
  media: [heroUrl(SYMPHONY_CODE, SAMPLES.indianCeremony), ...indianWeddingGallery(SYMPHONY_CODE)],
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

// ---------- 38 additional demo bundles (Skyrealm … Midnight Tokyo) ----------

const SKYREALM_CODE = "DEMO-SKYREALM";
const skyrealm: DemoBundle = {
  event: {
    eventCode: SKYREALM_CODE, eventType: "wedding", templateId: "skyrealm",
    eventTitle: "Aarav & Niyati", person1Name: "Aarav", person2Name: "Niyati",
    tentativeDate: "2026-09-19", city: "Interlaken", isActive: true, slug: SKYREALM_CODE,
    heroImageUrl: SAMPLES.indianMandapFlowers, tagline: "Above the world, together.",
    invitationMessage: "We found a place above the clouds where two islands meet by one bridge. Come cross it with us.",
    aboutStory: "Two islands drifted on separate winds for years. Then a marble bridge appeared between them, and the golden birds started circling like they'd been expecting this.",
    mainDate: "2026-09-19", mainStartTime: "16:00", mainEndTime: "22:00",
    themeAccentColor: "#7ab8e8",
    venueName: "Harder Kulm Terrace", venueAddress: "Harder Kulm, Interlaken, Switzerland",
    mapLink: "https://maps.google.com/?q=Harder+Kulm+Interlaken", latitude: 46.6997, longitude: 7.8632,
    contactName: "Aarav & Niyati", rsvpEnabled: true, rsvpLinkOrContact: "https://forms.example/skyrealm-rsvp",
  },
  subEvents: [
    { eventCode: SKYREALM_CODE, order: 1, name: "The Ascent", date: "2026-09-19", startTime: "16:00", endTime: "17:00", venueName: "Funicular Station", description: "The ride above the clouds — window seats for everyone.", icon: "☁" },
    { eventCode: SKYREALM_CODE, order: 2, name: "The Bridge Ceremony", date: "2026-09-19", startTime: "17:30", endTime: "19:00", venueName: "Sky Terrace", dressCode: "Sky blue & ivory", description: "Vows on the bridge between two kingdoms.", icon: "🕊" },
    { eventCode: SKYREALM_CODE, order: 3, name: "Dinner in the Clouds", date: "2026-09-19", startTime: "19:30", endTime: "22:00", venueName: "The Pavilion", description: "A long table with the Alps for wallpaper.", icon: "✦" },
  ],
  media: [heroUrl(SKYREALM_CODE, SAMPLES.indianMandapDecor), ...indianWeddingGallery(SKYREALM_CODE)],
};

const CATHEDRAL_CODE = "DEMO-CATHEDRAL";
const cathedral: DemoBundle = {
  event: {
    eventCode: CATHEDRAL_CODE, eventType: "wedding", templateId: "cathedral",
    eventTitle: "Dev & Elena", person1Name: "Dev", person2Name: "Elena",
    tentativeDate: "2026-11-21", city: "Prague", isActive: true, slug: CATHEDRAL_CODE,
    heroImageUrl: SAMPLES.roseWindow, tagline: "Vows under a galaxy ceiling.",
    invitationMessage: "We are building a cathedral out of the stars we met under. Come sit in the front pew of the sky.",
    aboutStory: "Every window in this cathedral is a memory lit from behind. The ceiling is the night we first named the constellations wrong, on purpose.",
    mainDate: "2026-11-21", mainStartTime: "19:00", mainEndTime: "23:30",
    themeAccentColor: "#4a5fc1",
    venueName: "Clementinum Hall", venueAddress: "Mariánské námestí, Prague, Czech Republic",
    mapLink: "https://maps.google.com/?q=Clementinum+Prague", latitude: 50.0866, longitude: 14.4166,
    contactName: "Dev & Elena", rsvpEnabled: true, rsvpLinkOrContact: "https://forms.example/cathedral-rsvp",
  },
  subEvents: [
    { eventCode: CATHEDRAL_CODE, order: 1, name: "Candlelight Arrival", date: "2026-11-21", startTime: "19:00", endTime: "19:45", venueName: "The Nave", description: "A thousand candles, one aisle.", icon: "🕯" },
    { eventCode: CATHEDRAL_CODE, order: 2, name: "Vows Under the Stars", date: "2026-11-21", startTime: "20:00", endTime: "21:00", venueName: "The Great Hall", dressCode: "Midnight formal", description: "The exchange, beneath the galaxy ceiling.", icon: "✦" },
    { eventCode: CATHEDRAL_CODE, order: 3, name: "Midnight Feast", date: "2026-11-21", startTime: "21:30", endTime: "23:30", venueName: "The Crypt Hall", description: "Dinner where the echoes are kind.", icon: "★" },
  ],
  media: [heroUrl(CATHEDRAL_CODE, SAMPLES.indianFire), ...indianWeddingGallery(CATHEDRAL_CODE)],
};

const SAKURA_CODE = "DEMO-SAKURA";
const sakura: DemoBundle = {
  event: {
    eventCode: SAKURA_CODE, eventType: "wedding", templateId: "sakura",
    eventTitle: "Haruki & Meera", person1Name: "Haruki", person2Name: "Meera",
    tentativeDate: "2026-04-04", city: "Kyoto", isActive: true, slug: SAKURA_CODE,
    heroImageUrl: SAMPLES.sakuraBranch, tagline: "A season made to stay.",
    invitationMessage: "The blossoms only stay a few weeks each year — so we chose them to hold our forever. Come walk the petal path with us.",
    aboutStory: "We met when the trees were bare and stayed until they flowered. Every spring since has felt like the forest applauding.",
    mainDate: "2026-04-04", mainStartTime: "15:00", mainEndTime: "21:00",
    themeAccentColor: "#e88aa8",
    venueName: "Maruyama Park Pavilion", venueAddress: "Higashiyama Ward, Kyoto, Japan",
    mapLink: "https://maps.google.com/?q=Maruyama+Park+Kyoto", latitude: 35.0037, longitude: 135.7809,
    contactName: "Haruki & Meera", rsvpEnabled: true, rsvpLinkOrContact: "https://forms.example/sakura-rsvp",
  },
  subEvents: [
    { eventCode: SAKURA_CODE, order: 1, name: "Petal Walk", date: "2026-04-04", startTime: "15:00", endTime: "16:00", venueName: "The Blossom Path", dressCode: "Blush & cream", description: "A slow walk under full bloom.", icon: "🌸" },
    { eventCode: SAKURA_CODE, order: 2, name: "The Ceremony", date: "2026-04-04", startTime: "16:30", endTime: "18:00", venueName: "The Pavilion", description: "Vows while the petals do the confetti's job.", icon: "🏮" },
    { eventCode: SAKURA_CODE, order: 3, name: "Lantern Dinner", date: "2026-04-04", startTime: "18:30", endTime: "21:00", venueName: "The Garden Terrace", description: "Lanterns on, season noted, dinner long.", icon: "🕯" },
  ],
  media: [heroUrl(SAKURA_CODE, SAMPLES.indianBride), ...indianWeddingGallery(SAKURA_CODE)],
};

const VERSAILLES_CODE = "DEMO-VERSAILLES";
const versailles: DemoBundle = {
  event: {
    eventCode: VERSAILLES_CODE, eventType: "wedding", templateId: "versailles",
    eventTitle: "Armaan & Céline", person1Name: "Armaan", person2Name: "Céline",
    tentativeDate: "2026-06-20", city: "Paris", isActive: true, slug: VERSAILLES_CODE,
    heroImageUrl: SAMPLES.weddingCake, tagline: "A palace for one evening.",
    invitationMessage: "The palace doors are open, the chandeliers are lit, and one seat in the hall of mirrors has your name on it.",
    aboutStory: "Some love stories rent a hall. Ours borrowed a palace — grand staircases, golden mirrors, and gardens that were clearly showing off.",
    mainDate: "2026-06-20", mainStartTime: "17:00", mainEndTime: "23:59",
    themeAccentColor: "#c9a13b",
    venueName: "Château Ballroom", venueAddress: "Avenue de Paris, Versailles, France",
    mapLink: "https://maps.google.com/?q=Versailles+France", latitude: 48.8049, longitude: 2.1204,
    contactName: "Armaan & Céline", rsvpEnabled: true, rsvpLinkOrContact: "https://forms.example/versailles-rsvp",
  },
  subEvents: [
    { eventCode: VERSAILLES_CODE, order: 1, name: "Garden Reception", date: "2026-06-20", startTime: "17:00", endTime: "18:30", venueName: "The Royal Gardens", dressCode: "Baroque formal", description: "Champagne among fountains that never learned modesty.", icon: "⚜" },
    { eventCode: VERSAILLES_CODE, order: 2, name: "Hall of Mirrors Ceremony", date: "2026-06-20", startTime: "19:00", endTime: "20:30", venueName: "Hall of Mirrors", description: "Vows, reflected seventeen times.", icon: "👑" },
    { eventCode: VERSAILLES_CODE, order: 3, name: "The Royal Banquet", date: "2026-06-20", startTime: "21:00", endTime: "23:59", venueName: "Grand Ballroom", description: "Dinner under chandeliers, dancing under orders.", icon: "🥂" },
  ],
  media: [heroUrl(VERSAILLES_CODE, SAMPLES.indianMandapDecor), ...indianWeddingGallery(VERSAILLES_CODE)],
};

const FRESCO_CODE = "DEMO-FRESCO";
const fresco: DemoBundle = {
  event: {
    eventCode: FRESCO_CODE, eventType: "wedding", templateId: "fresco",
    eventTitle: "Luca & Aisha", person1Name: "Luca", person2Name: "Aisha",
    tentativeDate: "2026-05-30", city: "Florence", isActive: true, slug: FRESCO_CODE,
    heroImageUrl: SAMPLES.weddingRingsRoses, tagline: "A love, painted.",
    invitationMessage: "Some loves get painted; ours insisted on it. Come stand inside the frame with us for one afternoon.",
    aboutStory: "The brush strokes started years ago — a café, a missed train, an argument about Caravaggio. Today the painting finally gets its gold frame.",
    mainDate: "2026-05-30", mainStartTime: "16:00", mainEndTime: "22:30",
    themeAccentColor: "#b0722f",
    venueName: "Palazzo Vecchio Courtyard", venueAddress: "Piazza della Signoria, Florence, Italy",
    mapLink: "https://maps.google.com/?q=Palazzo+Vecchio+Florence", latitude: 43.7696, longitude: 11.2558,
    contactName: "Luca & Aisha", rsvpEnabled: true, rsvpLinkOrContact: "https://forms.example/fresco-rsvp",
  },
  subEvents: [
    { eventCode: FRESCO_CODE, order: 1, name: "The Gallery Walk", date: "2026-05-30", startTime: "16:00", endTime: "17:00", venueName: "The Loggia", description: "Our story, hung frame by frame.", icon: "🖼" },
    { eventCode: FRESCO_CODE, order: 2, name: "The Ceremony", date: "2026-05-30", startTime: "17:30", endTime: "19:00", venueName: "The Courtyard", dressCode: "Renaissance warm tones", description: "Vows under a ceiling someone spent a decade on.", icon: "🎨" },
    { eventCode: FRESCO_CODE, order: 3, name: "The Banquet", date: "2026-05-30", startTime: "19:30", endTime: "22:30", venueName: "The Long Hall", description: "Tuscan dinner, painted light, no dress rehearsal.", icon: "🍷" },
  ],
  media: [heroUrl(FRESCO_CODE, SAMPLES.indianCouple), ...indianWeddingGallery(FRESCO_CODE)],
};

const MIRAGE_CODE = "DEMO-MIRAGE";
const mirage: DemoBundle = {
  event: {
    eventCode: MIRAGE_CODE, eventType: "wedding", templateId: "mirage",
    eventTitle: "Zayd & Mariam", person1Name: "Zayd", person2Name: "Mariam",
    tentativeDate: "2026-11-27", city: "Dubai", isActive: true, slug: MIRAGE_CODE,
    heroImageUrl: SAMPLES.desertDunes, tagline: "Real as the desert night.",
    invitationMessage: "At the edge of the dunes, where the heat turns light into water, we found something real. Come toast it by firelight.",
    aboutStory: "The desert shows you things that aren't there. It showed us each other — and for once, the mirage stayed.",
    mainDate: "2026-11-27", mainStartTime: "17:00", mainEndTime: "23:59",
    themeAccentColor: "#d19a4f",
    venueName: "Al Marmoom Oasis", venueAddress: "Al Marmoom Desert, Dubai, UAE",
    mapLink: "https://maps.google.com/?q=Al+Marmoom+Dubai", latitude: 24.8607, longitude: 55.3781,
    contactName: "Zayd & Mariam", rsvpEnabled: true, rsvpLinkOrContact: "https://forms.example/mirage-rsvp",
  },
  subEvents: [
    { eventCode: MIRAGE_CODE, order: 1, name: "Sunset on the Dunes", date: "2026-11-27", startTime: "17:00", endTime: "18:30", venueName: "The High Dune", dressCode: "Gold & terracotta", description: "Arrive before the light does its trick.", icon: "🌅" },
    { eventCode: MIRAGE_CODE, order: 2, name: "The Nikah", date: "2026-11-27", startTime: "19:00", endTime: "20:30", venueName: "The Oasis Pavilion", description: "Vows by firelight, witnessed by the dunes.", icon: "🔥" },
    { eventCode: MIRAGE_CODE, order: 3, name: "Feast Under the Stars", date: "2026-11-27", startTime: "21:00", endTime: "23:59", venueName: "The Majlis", description: "Long carpets, low tables, high spirits.", icon: "✦" },
  ],
  media: [heroUrl(MIRAGE_CODE, SAMPLES.indianVarmala), ...indianWeddingGallery(MIRAGE_CODE)],
};

const ICEPALACE_CODE = "DEMO-ICEPALACE";
const icepalace: DemoBundle = {
  event: {
    eventCode: ICEPALACE_CODE, eventType: "wedding", templateId: "icepalace",
    eventTitle: "Erik & Priya", person1Name: "Erik", person2Name: "Priya",
    tentativeDate: "2026-12-12", city: "Tromsø", isActive: true, slug: ICEPALACE_CODE,
    heroImageUrl: SAMPLES.auroraSky, tagline: "Warmth, kept in ice.",
    invitationMessage: "In a palace of ice under a green-lit sky, we're making the warmest promise of our lives. Bring your coat and your best toast.",
    aboutStory: "One of us grew up with snow, the other met it at 25 and took its side immediately. The aurora agreed to do the lighting.",
    mainDate: "2026-12-12", mainStartTime: "17:00", mainEndTime: "22:30",
    themeAccentColor: "#8fd4e8",
    venueName: "The Ice Dome", venueAddress: "Tamokdalen, Tromsø, Norway",
    mapLink: "https://maps.google.com/?q=Tromso+Norway", latitude: 69.6496, longitude: 18.956,
    contactName: "Erik & Priya", rsvpEnabled: true, rsvpLinkOrContact: "https://forms.example/icepalace-rsvp",
  },
  subEvents: [
    { eventCode: ICEPALACE_CODE, order: 1, name: "Aurora Watch", date: "2026-12-11", startTime: "21:00", endTime: "23:00", venueName: "The Frozen Lake", description: "Blankets, cocoa, and the sky doing its thing.", icon: "❄" },
    { eventCode: ICEPALACE_CODE, order: 2, name: "The Ceremony", date: "2026-12-12", startTime: "17:00", endTime: "18:30", venueName: "The Ice Dome", dressCode: "Winter white & silver", description: "Vows in a hall carved from the lake itself.", icon: "💠" },
    { eventCode: ICEPALACE_CODE, order: 3, name: "The Warm Feast", date: "2026-12-12", startTime: "19:00", endTime: "22:30", venueName: "The Lodge", description: "Fireplaces, long tables, extremely committed soup.", icon: "🔥" },
  ],
  media: [heroUrl(ICEPALACE_CODE, SAMPLES.indianBride), ...indianWeddingGallery(ICEPALACE_CODE)],
};

const GALAXYOPERA_CODE = "DEMO-GALAXYOPERA";
const galaxyopera: DemoBundle = {
  event: {
    eventCode: GALAXYOPERA_CODE, eventType: "wedding", templateId: "galaxyopera",
    eventTitle: "Vikram & Sofia", person1Name: "Vikram", person2Name: "Sofia",
    tentativeDate: "2026-10-17", city: "Milan", isActive: true, slug: GALAXYOPERA_CODE,
    heroImageUrl: SAMPLES.chandelier, tagline: "The curtain rises tonight.",
    invitationMessage: "The curtain rises on the one performance we've rehearsed our whole lives. Your seat is in the front row of the universe.",
    aboutStory: "An opera house adrift in space — velvet curtains parting on nebulae, chandeliers made of small patient planets. We supply the duet.",
    mainDate: "2026-10-17", mainStartTime: "18:30", mainEndTime: "23:59",
    themeAccentColor: "#8b5cf6",
    venueName: "Teatro Grande", venueAddress: "Via Filodrammatici, Milan, Italy",
    mapLink: "https://maps.google.com/?q=Teatro+alla+Scala+Milan", latitude: 45.4669, longitude: 9.19,
    contactName: "Vikram & Sofia", rsvpEnabled: true, rsvpLinkOrContact: "https://forms.example/galaxyopera-rsvp",
  },
  subEvents: [
    { eventCode: GALAXYOPERA_CODE, order: 1, name: "Overture", date: "2026-10-17", startTime: "18:30", endTime: "19:30", venueName: "The Grand Foyer", dressCode: "Black tie & stardust", description: "Champagne while the orchestra tunes the cosmos.", icon: "♪" },
    { eventCode: GALAXYOPERA_CODE, order: 2, name: "The Duet", date: "2026-10-17", startTime: "20:00", endTime: "21:30", venueName: "Main Stage", description: "Vows, center stage, curtain up.", icon: "🎭" },
    { eventCode: GALAXYOPERA_CODE, order: 3, name: "The Encore", date: "2026-10-17", startTime: "22:00", endTime: "23:59", venueName: "The Ballroom", description: "Dinner and dancing until the house lights give up.", icon: "✦" },
  ],
  media: [heroUrl(GALAXYOPERA_CODE, SAMPLES.indianCeremony), ...indianWeddingGallery(GALAXYOPERA_CODE)],
};

const TWORIVERS_CODE = "DEMO-TWORIVERS";
const tworivers: DemoBundle = {
  event: {
    eventCode: TWORIVERS_CODE, eventType: "engagement", templateId: "tworivers",
    eventTitle: "Arnav & Tara", person1Name: "Arnav", person2Name: "Tara",
    tentativeDate: "2026-03-14", city: "Rishikesh", isActive: true, slug: TWORIVERS_CODE,
    heroImageUrl: SAMPLES.coupleHands, tagline: "Two currents, one sea.",
    invitationMessage: "Two rivers ran a long way alone before they found the same sea. Come stand on the shore the day they meet.",
    aboutStory: "One of us moves fast and loud, the other slow and certain. Somewhere downstream it stopped mattering which was which.",
    mainDate: "2026-03-14", mainStartTime: "16:00", mainEndTime: "21:00",
    themeAccentColor: "#3f9e9b",
    venueName: "Ganga View Terrace", venueAddress: "Tapovan, Rishikesh, Uttarakhand",
    mapLink: "https://maps.google.com/?q=Tapovan+Rishikesh", latitude: 30.1265, longitude: 78.3089,
    contactName: "Arnav & Tara", rsvpEnabled: true, rsvpLinkOrContact: "https://forms.example/tworivers-rsvp",
  },
  subEvents: [
    { eventCode: TWORIVERS_CODE, order: 1, name: "Riverside Aarti", date: "2026-03-14", startTime: "16:00", endTime: "17:00", venueName: "The Ghat", description: "Lamps on the water, one from each family.", icon: "🪔" },
    { eventCode: TWORIVERS_CODE, order: 2, name: "The Ring Exchange", date: "2026-03-14", startTime: "17:30", endTime: "18:30", venueName: "The Terrace", dressCode: "River teal & ivory", description: "Two currents, formally introduced.", icon: "💍" },
    { eventCode: TWORIVERS_CODE, order: 3, name: "Dinner by the Water", date: "2026-03-14", startTime: "19:00", endTime: "21:00", venueName: "The Riverbank", description: "Long table, river soundtrack, lotus centrepieces.", icon: "🌊" },
  ],
  media: [hero(TWORIVERS_CODE, "photo-1525258946800-98cfd641d0de"), ...gallery(TWORIVERS_CODE, [
    { url: SAMPLES.coupleHands, caption: "The meeting" }, { url: SAMPLES.coupleSunset, caption: "Downstream" },
    { url: SAMPLES.ringsClose, caption: "The rings" }, { url: SAMPLES.coupleEmbrace, caption: "One current" },
  ])],
};

const MIRRORWORLDS_CODE = "DEMO-MIRRORWORLDS";
const mirrorworlds: DemoBundle = {
  event: {
    eventCode: MIRRORWORLDS_CODE, eventType: "engagement", templateId: "mirrorworlds",
    eventTitle: "Dhruv & Alia", person1Name: "Dhruv", person2Name: "Alia",
    tentativeDate: "2026-09-05", city: "Prague", isActive: true, slug: MIRRORWORLDS_CODE,
    heroImageUrl: SAMPLES.coupleBehind, tagline: "Two halves, one frame.",
    invitationMessage: "We lived in two different worlds that turned out to be reflections. Come watch them line up.",
    aboutStory: "He alphabetises his bookshelf; she uses colour. Both systems, it turns out, file the same person under 'home'.",
    mainDate: "2026-09-05", mainStartTime: "18:00", mainEndTime: "22:30",
    themeAccentColor: "#8a93a5",
    venueName: "The Mirror Chapel", venueAddress: "Malá Strana, Prague, Czech Republic",
    mapLink: "https://maps.google.com/?q=Mala+Strana+Prague", latitude: 50.0875, longitude: 14.4213,
    contactName: "Dhruv & Alia", rsvpEnabled: true, rsvpLinkOrContact: "https://forms.example/mirrorworlds-rsvp",
  },
  subEvents: [
    { eventCode: MIRRORWORLDS_CODE, order: 1, name: "His Side, Her Side", date: "2026-09-05", startTime: "18:00", endTime: "19:00", venueName: "The Twin Foyers", description: "Two entrances, two playlists, one bar in the middle.", icon: "◧" },
    { eventCode: MIRRORWORLDS_CODE, order: 2, name: "The Alignment", date: "2026-09-05", startTime: "19:30", endTime: "20:30", venueName: "The Mirror Hall", dressCode: "Monochrome, your pick", description: "The rings, exchanged where the two rooms meet.", icon: "💍" },
    { eventCode: MIRRORWORLDS_CODE, order: 3, name: "One Table", date: "2026-09-05", startTime: "21:00", endTime: "22:30", venueName: "The Long Room", description: "Dinner with the seating plans finally merged.", icon: "✦" },
  ],
  media: [hero(MIRRORWORLDS_CODE, "photo-1606216794074-735e91aa2c92"), ...gallery(MIRRORWORLDS_CODE, [
    { url: SAMPLES.coupleBehind, caption: "Two worlds" }, { url: SAMPLES.coupleHands, caption: "The seam" },
    { url: SAMPLES.coupleEmbrace, caption: "Aligned" }, { url: SAMPLES.ringsClose, caption: "The rings" },
  ])],
};

const INFINITYTRAIN_CODE = "DEMO-INFINITYTRAIN";
const infinitytrain: DemoBundle = {
  event: {
    eventCode: INFINITYTRAIN_CODE, eventType: "engagement", templateId: "infinitytrain",
    eventTitle: "Kabir & Naomi", person1Name: "Kabir", person2Name: "Naomi",
    tentativeDate: "2026-10-10", city: "Venice", isActive: true, slug: INFINITYTRAIN_CODE,
    heroImageUrl: SAMPLES.coupleSunset, tagline: "All aboard, no last stop.",
    invitationMessage: "Our train leaves from the platform where we first met and doesn't stop until forever. Your ticket is attached.",
    aboutStory: "Coach one is the year we met. Coach two, the year we almost didn't. The windows show every landscape we crossed to get here — and the bar car is fully stocked.",
    mainDate: "2026-10-10", mainStartTime: "17:00", mainEndTime: "22:00",
    themeAccentColor: "#b08d3f",
    venueName: "Venezia Santa Lucia — Royal Platform", venueAddress: "Fondamenta Santa Lucia, Venice, Italy",
    mapLink: "https://maps.google.com/?q=Venezia+Santa+Lucia", latitude: 45.4408, longitude: 12.3155,
    contactName: "Kabir & Naomi", rsvpEnabled: true, rsvpLinkOrContact: "https://forms.example/infinitytrain-rsvp",
  },
  subEvents: [
    { eventCode: INFINITYTRAIN_CODE, order: 1, name: "Boarding", date: "2026-10-10", startTime: "17:00", endTime: "17:45", venueName: "The Royal Platform", dressCode: "Vintage travel", description: "Tickets checked, coats taken, brass polished.", icon: "🎫" },
    { eventCode: INFINITYTRAIN_CODE, order: 2, name: "The Proposal Coach", date: "2026-10-10", startTime: "18:30", endTime: "19:30", venueName: "Coach No. 8", description: "The question, asked between stations.", icon: "💍" },
    { eventCode: INFINITYTRAIN_CODE, order: 3, name: "Dining Car Dinner", date: "2026-10-10", startTime: "20:00", endTime: "22:00", venueName: "The Dining Car", description: "White linen, moving scenery, no arrival time.", icon: "🚂" },
  ],
  media: [hero(INFINITYTRAIN_CODE, "photo-1519741497674-611481863552"), ...gallery(INFINITYTRAIN_CODE, [
    { url: SAMPLES.coupleSunset, caption: "The window seat" }, { url: SAMPLES.coupleEmbrace, caption: "Coach No. 8" },
    { url: SAMPLES.ringsClose, caption: "The ticket" }, { url: SAMPLES.coupleBehind, caption: "The platform" },
  ])],
};

const LANTERNS_CODE = "DEMO-LANTERNS";
const lanterns: DemoBundle = {
  event: {
    eventCode: LANTERNS_CODE, eventType: "engagement", templateId: "lanterns",
    eventTitle: "Ishan & Mai", person1Name: "Ishan", person2Name: "Mai",
    tentativeDate: "2026-02-28", city: "Hoi An", isActive: true, slug: LANTERNS_CODE,
    heroImageUrl: SAMPLES.coupleEmbrace, tagline: "One wish, a thousand lights.",
    invitationMessage: "We're sending a thousand lanterns up with one wish inside each of them — and the wish is the same in every one. Come light yours with us.",
    aboutStory: "We met on a night market bridge, arguing over the last paper lantern. We bought it together. It's still on the shelf — tonight it gets a thousand siblings.",
    mainDate: "2026-02-28", mainStartTime: "18:00", mainEndTime: "22:00",
    themeAccentColor: "#e8a545",
    venueName: "Thu Bon Riverside", venueAddress: "Old Town, Hoi An, Vietnam",
    mapLink: "https://maps.google.com/?q=Hoi+An+Old+Town", latitude: 15.8801, longitude: 108.338,
    contactName: "Ishan & Mai", rsvpEnabled: true, rsvpLinkOrContact: "https://forms.example/lanterns-rsvp",
  },
  subEvents: [
    { eventCode: LANTERNS_CODE, order: 1, name: "Lantern Making", date: "2026-02-28", startTime: "18:00", endTime: "19:00", venueName: "The Riverside Workshop", description: "Fold your own, write your wish inside.", icon: "🏮" },
    { eventCode: LANTERNS_CODE, order: 2, name: "The Ring, The River", date: "2026-02-28", startTime: "19:30", endTime: "20:15", venueName: "The Bridge", dressCode: "Warm lantern tones", description: "The question, asked where we first argued.", icon: "💍" },
    { eventCode: LANTERNS_CODE, order: 3, name: "The Release", date: "2026-02-28", startTime: "20:30", endTime: "22:00", venueName: "The Riverbank", description: "A thousand lanterns up, dinner after.", icon: "✨" },
  ],
  media: [hero(LANTERNS_CODE, "photo-1519225421980-715cb0215aed"), ...gallery(LANTERNS_CODE, [
    { url: SAMPLES.coupleEmbrace, caption: "Lantern light" }, { url: SAMPLES.coupleSunset, caption: "The river" },
    { url: SAMPLES.coupleHands, caption: "One wish" }, { url: SAMPLES.ringsClose, caption: "The ring" },
  ])],
};

const GLASSROSE_CODE = "DEMO-GLASSROSE";
const glassrose: DemoBundle = {
  event: {
    eventCode: GLASSROSE_CODE, eventType: "engagement", templateId: "glassrose",
    eventTitle: "Rey & Anya", person1Name: "Rey", person2Name: "Anya",
    tentativeDate: "2026-05-09", city: "Vienna", isActive: true, slug: GLASSROSE_CODE,
    heroImageUrl: SAMPLES.bouquet, tagline: "A rose that keeps.",
    invitationMessage: "Some flowers wilt; we grew one out of glass instead. Come watch it open, one petal at a time.",
    aboutStory: "He gave her a rose on the first date. She pressed it in a book she never returned. This one is made of crystal, so the library is safe.",
    mainDate: "2026-05-09", mainStartTime: "17:30", mainEndTime: "22:00",
    themeAccentColor: "#d66a8a",
    venueName: "Palmenhaus", venueAddress: "Burggarten 1, Vienna, Austria",
    mapLink: "https://maps.google.com/?q=Palmenhaus+Vienna", latitude: 48.2049, longitude: 16.3665,
    contactName: "Rey & Anya", rsvpEnabled: true, rsvpLinkOrContact: "https://forms.example/glassrose-rsvp",
  },
  subEvents: [
    { eventCode: GLASSROSE_CODE, order: 1, name: "The Glasshouse Hour", date: "2026-05-09", startTime: "17:30", endTime: "18:30", venueName: "The Palm House", dressCode: "Blush & crystal", description: "Champagne under glass and greenery.", icon: "🌹" },
    { eventCode: GLASSROSE_CODE, order: 2, name: "The Bloom", date: "2026-05-09", startTime: "19:00", endTime: "20:00", venueName: "The Rose Atrium", description: "The ring, offered as the last petal opens.", icon: "💍" },
    { eventCode: GLASSROSE_CODE, order: 3, name: "Petal Dinner", date: "2026-05-09", startTime: "20:30", endTime: "22:00", venueName: "The Conservatory", description: "Dinner inside the flower. Mind the stems.", icon: "✧" },
  ],
  media: [hero(GLASSROSE_CODE, "photo-1465495976277-4387d4b0b4c6"), ...gallery(GLASSROSE_CODE, [
    { url: SAMPLES.bouquet, caption: "The rose" }, { url: SAMPLES.pinkFlowers, caption: "Petals" },
    { url: SAMPLES.coupleEmbrace, caption: "The bloom" }, { url: SAMPLES.ringsClose, caption: "The ring" },
  ])],
};

const SECRETGALAXY_CODE = "DEMO-SECRETGALAXY";
const secretgalaxy: DemoBundle = {
  event: {
    eventCode: SECRETGALAXY_CODE, eventType: "engagement", templateId: "secretgalaxy",
    eventTitle: "Neil & Aria", person1Name: "Neil", person2Name: "Aria",
    tentativeDate: "2026-08-15", city: "Ladakh", isActive: true, slug: SECRETGALAXY_CODE,
    heroImageUrl: SAMPLES.coupleBehind, tagline: "A universe of two.",
    invitationMessage: "We found a galaxy nobody else had named, so we gave it both our names. Come see the coordinates.",
    aboutStory: "At 3,500 metres the sky stops pretending to be a ceiling. We looked up, picked an unnamed smudge of stars, and filed the paperwork ourselves.",
    mainDate: "2026-08-15", mainStartTime: "19:00", mainEndTime: "23:30",
    themeAccentColor: "#7b5ce8",
    venueName: "Stargazers' Camp, Nubra", venueAddress: "Nubra Valley, Ladakh",
    mapLink: "https://maps.google.com/?q=Nubra+Valley+Ladakh", latitude: 34.6868, longitude: 77.5661,
    contactName: "Neil & Aria", rsvpEnabled: true, rsvpLinkOrContact: "https://forms.example/secretgalaxy-rsvp",
  },
  subEvents: [
    { eventCode: SECRETGALAXY_CODE, order: 1, name: "Telescope Hour", date: "2026-08-15", startTime: "19:00", endTime: "20:30", venueName: "The Ridge", description: "Hot chai, cold air, borrowed telescopes.", icon: "🔭" },
    { eventCode: SECRETGALAXY_CODE, order: 2, name: "The Naming", date: "2026-08-15", startTime: "21:00", endTime: "21:45", venueName: "The Dome Tent", dressCode: "Layers. Trust us.", description: "The ring, and the coordinates, announced together.", icon: "✦" },
    { eventCode: SECRETGALAXY_CODE, order: 3, name: "Bonfire Supper", date: "2026-08-15", startTime: "22:00", endTime: "23:30", venueName: "The Camp", description: "Fire, blankets, one extremely smug couple.", icon: "🔥" },
  ],
  media: [hero(SECRETGALAXY_CODE, "photo-1606216794074-735e91aa2c92"), ...gallery(SECRETGALAXY_CODE, [
    { url: SAMPLES.coupleBehind, caption: "The smudge of stars" }, { url: SAMPLES.coupleSunset, caption: "Last light" },
    { url: SAMPLES.coupleEmbrace, caption: "Named" }, { url: SAMPLES.ringsClose, caption: "Coordinates" },
  ])],
};

const CARTOON_CODE = "DEMO-CARTOON";
const cartoon: DemoBundle = {
  event: {
    eventCode: CARTOON_CODE, eventType: "birthday", templateId: "cartoon",
    eventTitle: "Vivaan turns 6!", person1Name: "Vivaan",
    tentativeDate: "2026-08-09", city: "Mumbai", isActive: true, slug: CARTOON_CODE,
    heroImageUrl: SAMPLES.confetti, tagline: "Today's episode: the birthday!",
    invitationMessage: "The clouds are bouncy, the balloons have faces, and the birthday kid is the main character. Come join the episode.",
    aboutStory: "Season six of the Vivaan show is the best one yet — more jokes, more jumping, and a season finale with cake.",
    mainDate: "2026-08-09", mainStartTime: "16:00", mainEndTime: "19:00",
    themeAccentColor: "#38b6ff",
    venueName: "Funhouse Studio", venueAddress: "Juhu, Mumbai",
    mapLink: "https://maps.google.com/?q=Juhu+Mumbai", latitude: 19.1075, longitude: 72.8263,
    contactName: "Neha (Mum)", contactPhone: "+91-98xxxxxxx", rsvpEnabled: true, rsvpLinkOrContact: "+91-98xxxxxxx",
  },
  subEvents: [
    { eventCode: CARTOON_CODE, order: 1, name: "Opening Credits", date: "2026-08-09", startTime: "16:00", endTime: "16:45", venueName: "The Bouncy Zone", description: "Face paint, balloon characters, warm-up giggles.", icon: "🎈" },
    { eventCode: CARTOON_CODE, order: 2, name: "The Big Episode", date: "2026-08-09", startTime: "16:45", endTime: "17:45", venueName: "Main Stage", description: "Games, a magician, and one plot twist.", icon: "🎬" },
    { eventCode: CARTOON_CODE, order: 3, name: "Season Finale: Cake", date: "2026-08-09", startTime: "18:00", endTime: "19:00", venueName: "Party Hall", description: "Six candles. Zero suspense about the wish.", icon: "🎂" },
  ],
  media: [hero(CARTOON_CODE, "photo-1530103862676-de8c9debad1d"), ...gallery(CARTOON_CODE, [
    { url: SAMPLES.confetti, caption: "Confetti" }, { url: PICSUM(`${CARTOON_CODE}-balloons`, 1200, 1500), caption: "Balloon friends" },
    { url: PICSUM(`${CARTOON_CODE}-games`, 1200, 1500), caption: "Games" }, { url: SAMPLES.pinkFlowers, caption: "Cake table" },
  ])],
};

const BRICKTOWN_CODE = "DEMO-BRICKTOWN";
const bricktown: DemoBundle = {
  event: {
    eventCode: BRICKTOWN_CODE, eventType: "birthday", templateId: "bricktown",
    eventTitle: "Advik turns 5!", person1Name: "Advik",
    tentativeDate: "2026-06-07", city: "Pune", isActive: true, slug: BRICKTOWN_CODE,
    heroImageUrl: SAMPLES.confetti, tagline: "Everything clicks today.",
    invitationMessage: "We're building a whole city for one birthday — brick by brick, snack by snack. Bring your best builder energy.",
    aboutStory: "The master builder turns five, and the city needs towers, a fire station, and — by executive order — a dinosaur enclosure.",
    mainDate: "2026-06-07", mainStartTime: "15:00", mainEndTime: "18:00",
    themeAccentColor: "#d64545",
    venueName: "The Builder Barn", venueAddress: "Baner, Pune",
    mapLink: "https://maps.google.com/?q=Baner+Pune", latitude: 18.559, longitude: 73.7868,
    contactName: "Rohit (Dad)", contactPhone: "+91-98xxxxxxx", rsvpEnabled: true, rsvpLinkOrContact: "+91-98xxxxxxx",
  },
  subEvents: [
    { eventCode: BRICKTOWN_CODE, order: 1, name: "City Planning", date: "2026-06-07", startTime: "15:00", endTime: "16:00", venueName: "The Build Tables", description: "Teams, bricks, and very serious zoning debates.", icon: "🧱" },
    { eventCode: BRICKTOWN_CODE, order: 2, name: "The Grand Opening", date: "2026-06-07", startTime: "16:15", endTime: "17:00", venueName: "Brick City", description: "Ribbon cut by the mayor (age five).", icon: "🏗" },
    { eventCode: BRICKTOWN_CODE, order: 3, name: "Cake Demolition", date: "2026-06-07", startTime: "17:15", endTime: "18:00", venueName: "Main Hall", description: "The only demolition on today's permit.", icon: "🎂" },
  ],
  media: [hero(BRICKTOWN_CODE, "photo-1530103862676-de8c9debad1d"), ...gallery(BRICKTOWN_CODE, [
    { url: SAMPLES.confetti, caption: "The city" }, { url: PICSUM(`${BRICKTOWN_CODE}-towers`, 1200, 1500), caption: "Towers" },
    { url: PICSUM(`${BRICKTOWN_CODE}-build`, 1200, 1500), caption: "Build tables" }, { url: PICSUM(`${BRICKTOWN_CODE}-cake`, 1200, 1500), caption: "Cake" },
  ])],
};

const TREASURE_CODE = "DEMO-TREASURE";
const treasure: DemoBundle = {
  event: {
    eventCode: TREASURE_CODE, eventType: "birthday", templateId: "treasure",
    eventTitle: "Anika turns 9!", person1Name: "Anika",
    tentativeDate: "2026-10-11", city: "Goa", isActive: true, slug: TREASURE_CODE,
    heroImageUrl: SAMPLES.confetti, tagline: "X marks the party.",
    invitationMessage: "X marks the party. Follow the map, dodge the traps, and the treasure at the end is cake. Probably. Come find out.",
    aboutStory: "Captain Anika has a map, a crew, and nine years of experience finding hidden snacks. This expedition is her biggest yet.",
    mainDate: "2026-10-11", mainStartTime: "10:00", mainEndTime: "13:30",
    themeAccentColor: "#c9942e",
    venueName: "Coco Beach Shack", venueAddress: "Nerul, Goa",
    mapLink: "https://maps.google.com/?q=Nerul+Goa", latitude: 15.5167, longitude: 73.7833,
    contactName: "Sameera (Mum)", contactPhone: "+91-98xxxxxxx", rsvpEnabled: true, rsvpLinkOrContact: "+91-98xxxxxxx",
  },
  subEvents: [
    { eventCode: TREASURE_CODE, order: 1, name: "Crew Muster", date: "2026-10-11", startTime: "10:00", endTime: "10:45", venueName: "The Shack", description: "Bandanas issued, maps distributed, parrots optional.", icon: "🏴‍☠️" },
    { eventCode: TREASURE_CODE, order: 2, name: "The Hunt", date: "2026-10-11", startTime: "10:45", endTime: "12:15", venueName: "The Beach", description: "Five clues, three traps, one buried chest.", icon: "🗺" },
    { eventCode: TREASURE_CODE, order: 3, name: "The Treasure Feast", date: "2026-10-11", startTime: "12:30", endTime: "13:30", venueName: "The Shack", description: "The treasure was cake. It's always cake.", icon: "💰" },
  ],
  media: [hero(TREASURE_CODE, "photo-1530103862676-de8c9debad1d"), ...gallery(TREASURE_CODE, [
    { url: SAMPLES.confetti, caption: "The crew" }, { url: PICSUM(`${TREASURE_CODE}-map`, 1200, 1500), caption: "The map" },
    { url: PICSUM(`${TREASURE_CODE}-chest`, 1200, 1500), caption: "The chest" }, { url: SAMPLES.coupleSunset, caption: "The cove" },
  ])],
};

const THEMEPARK_CODE = "DEMO-THEMEPARK";
const themepark: DemoBundle = {
  event: {
    eventCode: THEMEPARK_CODE, eventType: "birthday", templateId: "themepark",
    eventTitle: "Ishaan turns 12!", person1Name: "Ishaan",
    tentativeDate: "2026-11-01", city: "Delhi", isActive: true, slug: THEMEPARK_CODE,
    heroImageUrl: SAMPLES.confetti, tagline: "You must be this fun to ride.",
    invitationMessage: "The gates open, the rides are free, and the fireworks are timed to the candles. You must be this excited to enter.",
    aboutStory: "Twelve years old and finally tall enough for everything. The park stays open late for exactly one commander of the ferris wheel.",
    mainDate: "2026-11-01", mainStartTime: "17:00", mainEndTime: "21:30",
    themeAccentColor: "#e0433f",
    venueName: "Wonder Park", venueAddress: "Rohini, Delhi",
    mapLink: "https://maps.google.com/?q=Rohini+Delhi", latitude: 28.7041, longitude: 77.1025,
    contactName: "Family", contactPhone: "+91-98xxxxxxx", rsvpEnabled: true, rsvpLinkOrContact: "https://forms.example/themepark-rsvp",
  },
  subEvents: [
    { eventCode: THEMEPARK_CODE, order: 1, name: "Gates Open", date: "2026-11-01", startTime: "17:00", endTime: "18:00", venueName: "Main Gate", description: "Wristbands on, sugar levels rising.", icon: "🎟" },
    { eventCode: THEMEPARK_CODE, order: 2, name: "Ride Marathon", date: "2026-11-01", startTime: "18:00", endTime: "20:00", venueName: "The Midway", description: "Coasters, bumper cars, and one haunted house dare.", icon: "🎢" },
    { eventCode: THEMEPARK_CODE, order: 3, name: "Cake & Fireworks", date: "2026-11-01", startTime: "20:30", endTime: "21:30", venueName: "The Ferris Plaza", description: "Twelve candles, then the sky takes over.", icon: "🎆" },
  ],
  media: [hero(THEMEPARK_CODE, "photo-1530103862676-de8c9debad1d"), ...gallery(THEMEPARK_CODE, [
    { url: SAMPLES.confetti, caption: "The midway" }, { url: PICSUM(`${THEMEPARK_CODE}-ferris`, 1200, 1500), caption: "Ferris wheel" },
    { url: PICSUM(`${THEMEPARK_CODE}-coaster`, 1200, 1500), caption: "The coaster" }, { url: PICSUM(`${THEMEPARK_CODE}-fireworks`, 1200, 1500), caption: "Fireworks" },
  ])],
};

const CANDYLAND_CODE = "DEMO-CANDYLAND";
const candyland: DemoBundle = {
  event: {
    eventCode: CANDYLAND_CODE, eventType: "birthday", templateId: "candyland",
    eventTitle: "Myra turns 7!", person1Name: "Myra",
    tentativeDate: "2026-09-13", city: "Mumbai", isActive: true, slug: CANDYLAND_CODE,
    heroImageUrl: SAMPLES.pinkFlowers, tagline: "Sweetness at full production.",
    invitationMessage: "The chocolate river is flowing and the cookie mountains are fresh out of the oven. Golden ticket attached — don't lose it.",
    aboutStory: "The factory has been running all week: gumdrop hills polished, marshmallow clouds fluffed, and one birthday girl promoted to Chief Taste Officer.",
    mainDate: "2026-09-13", mainStartTime: "15:30", mainEndTime: "18:30",
    themeAccentColor: "#f06ea9",
    venueName: "The Sweet Factory", venueAddress: "Powai, Mumbai",
    mapLink: "https://maps.google.com/?q=Powai+Mumbai", latitude: 19.1176, longitude: 72.906,
    contactName: "Tanvi (Mum)", contactPhone: "+91-98xxxxxxx", rsvpEnabled: true, rsvpLinkOrContact: "+91-98xxxxxxx",
  },
  subEvents: [
    { eventCode: CANDYLAND_CODE, order: 1, name: "Golden Ticket Check", date: "2026-09-13", startTime: "15:30", endTime: "16:00", venueName: "Factory Gates", description: "Tickets in, sugar expectations up.", icon: "🎫" },
    { eventCode: CANDYLAND_CODE, order: 2, name: "The Tasting Tour", date: "2026-09-13", startTime: "16:00", endTime: "17:15", venueName: "The Factory Floor", description: "Candy stations, cookie decorating, quality control by committee.", icon: "🍭" },
    { eventCode: CANDYLAND_CODE, order: 3, name: "The Cake Reveal", date: "2026-09-13", startTime: "17:30", endTime: "18:30", venueName: "The Chocolate Hall", description: "Seven layers. One per year. Obviously.", icon: "🎂" },
  ],
  media: [hero(CANDYLAND_CODE, "photo-1465495976277-4387d4b0b4c6"), ...gallery(CANDYLAND_CODE, [
    { url: SAMPLES.pinkFlowers, caption: "Sugar blooms" }, { url: SAMPLES.confetti, caption: "Sprinkles" },
    { url: PICSUM(`${CANDYLAND_CODE}-candy`, 1200, 1500), caption: "Candy stations" }, { url: PICSUM(`${CANDYLAND_CODE}-cake`, 1200, 1500), caption: "The cake" },
  ])],
};

const ROBOCITY_CODE = "DEMO-ROBOCITY";
const robocity: DemoBundle = {
  event: {
    eventCode: ROBOCITY_CODE, eventType: "birthday", templateId: "robocity",
    eventTitle: "Arjun turns 10!", person1Name: "Arjun",
    tentativeDate: "2026-07-26", city: "Hyderabad", isActive: true, slug: ROBOCITY_CODE,
    heroImageUrl: SAMPLES.confetti, tagline: "Party protocol: activated.",
    invitationMessage: "The robots have been programmed with one directive: best birthday ever. Systems are green — we just need you.",
    aboutStory: "Double digits unlocked. The city's robots have run the diagnostics twice: balloons charged, games loaded, cake module standing by.",
    mainDate: "2026-07-26", mainStartTime: "16:00", mainEndTime: "19:30",
    themeAccentColor: "#ff7a2f",
    venueName: "Circuit Arena", venueAddress: "Gachibowli, Hyderabad",
    mapLink: "https://maps.google.com/?q=Gachibowli+Hyderabad", latitude: 17.4401, longitude: 78.3489,
    contactName: "Kavya (Mum)", contactPhone: "+91-98xxxxxxx", rsvpEnabled: true, rsvpLinkOrContact: "+91-98xxxxxxx",
  },
  subEvents: [
    { eventCode: ROBOCITY_CODE, order: 1, name: "Boot Sequence", date: "2026-07-26", startTime: "16:00", endTime: "16:45", venueName: "The Arena", description: "Robot badge assembly and team assignments.", icon: "🤖" },
    { eventCode: ROBOCITY_CODE, order: 2, name: "Robot Games", date: "2026-07-26", startTime: "16:45", endTime: "18:15", venueName: "The Circuit Floor", description: "Bot races, laser mazes, one rogue vacuum.", icon: "⚡" },
    { eventCode: ROBOCITY_CODE, order: 3, name: "Cake Protocol", date: "2026-07-26", startTime: "18:30", endTime: "19:30", venueName: "Command Deck", description: "Ten candles extinguished in a single pass. Efficient.", icon: "🎂" },
  ],
  media: [hero(ROBOCITY_CODE, "photo-1530103862676-de8c9debad1d"), ...gallery(ROBOCITY_CODE, [
    { url: SAMPLES.confetti, caption: "Systems green" }, { url: PICSUM(`${ROBOCITY_CODE}-bots`, 1200, 1500), caption: "The bots" },
    { url: PICSUM(`${ROBOCITY_CODE}-maze`, 1200, 1500), caption: "Laser maze" }, { url: PICSUM(`${ROBOCITY_CODE}-cake`, 1200, 1500), caption: "Cake module" },
  ])],
};

const SPACEMISSION_CODE = "DEMO-SPACEMISSION";
const spacemission: DemoBundle = {
  event: {
    eventCode: SPACEMISSION_CODE, eventType: "birthday", templateId: "spacemission",
    eventTitle: "Reyansh turns 8!", person1Name: "Reyansh",
    tentativeDate: "2026-08-23", city: "Bengaluru", isActive: true, slug: SPACEMISSION_CODE,
    heroImageUrl: SAMPLES.confetti, tagline: "T-minus one birthday.",
    invitationMessage: "Commander, your mission: one birthday, several planets, unlimited cake. The countdown has already started — report to the launchpad.",
    aboutStory: "Mission year eight. The commander has logged 2,920 days of training and is cleared for the biggest launch of his career: the candle sequence.",
    mainDate: "2026-08-23", mainStartTime: "15:00", mainEndTime: "18:30",
    themeAccentColor: "#ff6a2b",
    venueName: "Launchpad Play Center", venueAddress: "Whitefield, Bengaluru",
    mapLink: "https://maps.google.com/?q=Whitefield+Bengaluru", latitude: 12.9698, longitude: 77.7499,
    contactName: "Deepa (Mum)", contactPhone: "+91-98xxxxxxx", rsvpEnabled: true, rsvpLinkOrContact: "+91-98xxxxxxx",
  },
  subEvents: [
    { eventCode: SPACEMISSION_CODE, order: 1, name: "Crew Suit-Up", date: "2026-08-23", startTime: "15:00", endTime: "15:45", venueName: "Mission Prep Bay", description: "Helmets, badges, and mission patches for every astronaut.", icon: "🧑‍🚀" },
    { eventCode: SPACEMISSION_CODE, order: 2, name: "Planet Hop", date: "2026-08-23", startTime: "15:45", endTime: "17:15", venueName: "The Star Field", description: "Games across four planets. Gravity varies.", icon: "🪐" },
    { eventCode: SPACEMISSION_CODE, order: 3, name: "The Candle Launch", date: "2026-08-23", startTime: "17:30", endTime: "18:30", venueName: "Mission Control", description: "Eight candles. Ignition on the count of three.", icon: "🚀" },
  ],
  media: [hero(SPACEMISSION_CODE, "photo-1530103862676-de8c9debad1d"), ...gallery(SPACEMISSION_CODE, [
    { url: SAMPLES.confetti, caption: "Launch day" }, { url: PICSUM(`${SPACEMISSION_CODE}-crew`, 1200, 1500), caption: "The crew" },
    { url: PICSUM(`${SPACEMISSION_CODE}-planets`, 1200, 1500), caption: "Planet hop" }, { url: PICSUM(`${SPACEMISSION_CODE}-cake`, 1200, 1500), caption: "Ignition" },
  ])],
};

const JUNGLE_CODE = "DEMO-JUNGLE";
const jungle: DemoBundle = {
  event: {
    eventCode: JUNGLE_CODE, eventType: "birthday", templateId: "jungle",
    eventTitle: "Kiara turns 6!", person1Name: "Kiara",
    tentativeDate: "2026-06-21", city: "Kochi", isActive: true, slug: JUNGLE_CODE,
    heroImageUrl: SAMPLES.confetti, tagline: "Into the wild we go.",
    invitationMessage: "Deep in the jungle, past the waterfall and one very opinionated parrot, a birthday is waiting. Pack your sense of adventure.",
    aboutStory: "The expedition leader turns six. The trail is marked, the monkeys have been briefed, and the parrot has opinions about the cake flavour.",
    mainDate: "2026-06-21", mainStartTime: "10:00", mainEndTime: "13:00",
    themeAccentColor: "#2e7d4f",
    venueName: "The Canopy Garden", venueAddress: "Fort Kochi, Kochi",
    mapLink: "https://maps.google.com/?q=Fort+Kochi", latitude: 9.9658, longitude: 76.2422,
    contactName: "Anju (Mum)", contactPhone: "+91-98xxxxxxx", rsvpEnabled: true, rsvpLinkOrContact: "+91-98xxxxxxx",
  },
  subEvents: [
    { eventCode: JUNGLE_CODE, order: 1, name: "Explorer Sign-In", date: "2026-06-21", startTime: "10:00", endTime: "10:45", venueName: "Base Camp", description: "Safari hats, binoculars, animal face paint.", icon: "🦜" },
    { eventCode: JUNGLE_CODE, order: 2, name: "The Trail", date: "2026-06-21", startTime: "10:45", endTime: "12:00", venueName: "The Canopy", description: "Treasure trail, animal spotting, waterfall crossing (paddling pool).", icon: "🌿" },
    { eventCode: JUNGLE_CODE, order: 3, name: "Feast at Base Camp", date: "2026-06-21", startTime: "12:15", endTime: "13:00", venueName: "Base Camp", description: "Cake shaped like a lion. The parrot approves.", icon: "🦁" },
  ],
  media: [hero(JUNGLE_CODE, "photo-1530103862676-de8c9debad1d"), ...gallery(JUNGLE_CODE, [
    { url: SAMPLES.confetti, caption: "Base camp" }, { url: PICSUM(`${JUNGLE_CODE}-trail`, 1200, 1500), caption: "The trail" },
    { url: PICSUM(`${JUNGLE_CODE}-waterfall`, 1200, 1500), caption: "The waterfall" }, { url: PICSUM(`${JUNGLE_CODE}-cake`, 1200, 1500), caption: "Lion cake" },
  ])],
};

const TIMECAPSULE_CODE = "DEMO-TIMECAPSULE";
const timecapsule: DemoBundle = {
  event: {
    eventCode: TIMECAPSULE_CODE, eventType: "anniversary", templateId: "timecapsule",
    eventTitle: "Rajiv & Sunita — 40 years", person1Name: "Rajiv", person2Name: "Sunita",
    tentativeDate: "2026-11-29", city: "Chandigarh", isActive: true, slug: TIMECAPSULE_CODE,
    heroImageUrl: SAMPLES.coupleSunset, tagline: "Everything we kept, opened.",
    invitationMessage: "Years ago we started keeping the small things. Tonight we open the capsule and let them glow. Come see what we saved.",
    aboutStory: "Cinema stubs from 1986. A wedding card printed on a typewriter. Forty years of small things, sealed and saved — opened tonight, one at a time.",
    mainDate: "2026-11-29", mainStartTime: "18:30", mainEndTime: "22:30",
    themeAccentColor: "#a97e3f",
    venueName: "The Rose Garden Pavilion", venueAddress: "Sector 16, Chandigarh",
    mapLink: "https://maps.google.com/?q=Rose+Garden+Chandigarh", latitude: 30.7484, longitude: 76.7797,
    contactName: "The Kids", rsvpEnabled: true, rsvpLinkOrContact: "https://forms.example/timecapsule-rsvp",
  },
  subEvents: [
    { eventCode: TIMECAPSULE_CODE, order: 1, name: "The Unsealing", date: "2026-11-29", startTime: "18:30", endTime: "19:30", venueName: "The Pavilion", description: "The capsule opens. Handkerchiefs recommended.", icon: "🗝" },
    { eventCode: TIMECAPSULE_CODE, order: 2, name: "Dinner Through the Decades", date: "2026-11-29", startTime: "19:45", endTime: "21:15", venueName: "The Long Table", description: "A course for each decade, toasts in between.", icon: "🥂" },
    { eventCode: TIMECAPSULE_CODE, order: 3, name: "The New Capsule", date: "2026-11-29", startTime: "21:30", endTime: "22:30", venueName: "The Garden", description: "Everyone adds one thing for the 50th. Sealed at ten.", icon: "⏳" },
  ],
  media: [hero(TIMECAPSULE_CODE, "photo-1519741497674-611481863552"), ...gallery(TIMECAPSULE_CODE, [
    { url: SAMPLES.coupleSunset, caption: "1986" }, { url: SAMPLES.coupleEmbrace, caption: "1998" },
    { url: SAMPLES.coupleBehind, caption: "2010" }, { url: SAMPLES.coupleHands, caption: "Tonight" },
  ])],
};

const TREEOFLIFE_CODE = "DEMO-TREEOFLIFE";
const treeoflife: DemoBundle = {
  event: {
    eventCode: TREEOFLIFE_CODE, eventType: "anniversary", templateId: "treeoflife",
    eventTitle: "Mohan & Lakshmi — 50 years", person1Name: "Mohan", person2Name: "Lakshmi",
    tentativeDate: "2026-12-13", city: "Coimbatore", isActive: true, slug: TREEOFLIFE_CODE,
    heroImageUrl: SAMPLES.coupleHands, tagline: "Still growing, together.",
    invitationMessage: "We planted something the day we married, and it has grown a new branch every year since. Come sit under it with us.",
    aboutStory: "Fifty rings in the trunk now. Children on one branch, grandchildren on the newer ones, and the shade wide enough for everyone we love.",
    mainDate: "2026-12-13", mainStartTime: "17:00", mainEndTime: "21:30",
    themeAccentColor: "#5c8a4a",
    venueName: "The Banyan Courtyard", venueAddress: "Race Course Road, Coimbatore",
    mapLink: "https://maps.google.com/?q=Race+Course+Coimbatore", latitude: 11.0018, longitude: 76.9629,
    contactName: "The Family", rsvpEnabled: true, rsvpLinkOrContact: "https://forms.example/treeoflife-rsvp",
  },
  subEvents: [
    { eventCode: TREEOFLIFE_CODE, order: 1, name: "Blessings Under the Tree", date: "2026-12-13", startTime: "17:00", endTime: "18:00", venueName: "The Banyan", description: "The elders first, then everyone the branches hold.", icon: "🌳" },
    { eventCode: TREEOFLIFE_CODE, order: 2, name: "The Golden Feast", date: "2026-12-13", startTime: "18:30", endTime: "20:30", venueName: "The Courtyard", description: "Banana leaves, fifty dishes, no shortcuts.", icon: "🍃" },
    { eventCode: TREEOFLIFE_CODE, order: 3, name: "Planting the Next", date: "2026-12-13", startTime: "20:45", endTime: "21:30", venueName: "The Garden", description: "The grandchildren plant a sapling. The cycle continues.", icon: "🌱" },
  ],
  media: [hero(TREEOFLIFE_CODE, "photo-1525258946800-98cfd641d0de"), ...gallery(TREEOFLIFE_CODE, [
    { url: SAMPLES.coupleHands, caption: "Fifty rings" }, { url: SAMPLES.coupleSunset, caption: "The shade" },
    { url: SAMPLES.coupleEmbrace, caption: "Still growing" }, { url: SAMPLES.pinkFlowers, caption: "New blooms" },
  ])],
};

const ENDLESSCLOCK_CODE = "DEMO-ENDLESSCLOCK";
const endlessclock: DemoBundle = {
  event: {
    eventCode: ENDLESSCLOCK_CODE, eventType: "anniversary", templateId: "endlessclock",
    eventTitle: "Farhan & Nadia — 20 years", person1Name: "Farhan", person2Name: "Nadia",
    tentativeDate: "2026-10-25", city: "Lucknow", isActive: true, slug: ENDLESSCLOCK_CODE,
    heroImageUrl: SAMPLES.coupleEmbrace, tagline: "Time, well spent.",
    invitationMessage: "The clocks have counted every year for us, gear by patient gear. Come hear them all strike at once.",
    aboutStory: "Twenty years measured in small mechanisms — morning tea at seven, the same song every anniversary, arguments that resolve by dinner. The clocks kept score; we kept going.",
    mainDate: "2026-10-25", mainStartTime: "19:00", mainEndTime: "23:00",
    themeAccentColor: "#b3823c",
    venueName: "The Clock Tower Hall", venueAddress: "Husainabad, Lucknow",
    mapLink: "https://maps.google.com/?q=Husainabad+Clock+Tower+Lucknow", latitude: 26.875, longitude: 80.9046,
    contactName: "Farhan & Nadia", rsvpEnabled: true, rsvpLinkOrContact: "https://forms.example/endlessclock-rsvp",
  },
  subEvents: [
    { eventCode: ENDLESSCLOCK_CODE, order: 1, name: "The Winding Hour", date: "2026-10-25", startTime: "19:00", endTime: "20:00", venueName: "The Gallery", description: "Cocktails among twenty clocks, each set to a year.", icon: "🕰" },
    { eventCode: ENDLESSCLOCK_CODE, order: 2, name: "The Strike", date: "2026-10-25", startTime: "20:00", endTime: "20:30", venueName: "The Main Hall", description: "All clocks strike together. Once. For us.", icon: "🔔" },
    { eventCode: ENDLESSCLOCK_CODE, order: 3, name: "Dinner Out of Time", date: "2026-10-25", startTime: "20:45", endTime: "23:00", venueName: "The Long Room", description: "Awadhi dinner, no watches allowed.", icon: "✦" },
  ],
  media: [hero(ENDLESSCLOCK_CODE, "photo-1519225421980-715cb0215aed"), ...gallery(ENDLESSCLOCK_CODE, [
    { url: SAMPLES.coupleEmbrace, caption: "Year one" }, { url: SAMPLES.coupleBehind, caption: "Year ten" },
    { url: SAMPLES.coupleSunset, caption: "Year twenty" }, { url: SAMPLES.coupleHands, caption: "All hours" },
  ])],
};

const DIGITALCITY_CODE = "DEMO-DIGITALCITY";
const digitalcity: DemoBundle = {
  event: {
    eventCode: DIGITALCITY_CODE, eventType: "corporate", templateId: "digitalcity",
    eventTitle: "Metrogrid Summit 2026", person1Name: "Metrogrid Forum",
    tentativeDate: "2026-09-16", city: "Singapore", isActive: true, slug: DIGITALCITY_CODE,
    heroImageUrl: UNSPLASH("photo-1486312338219-ce68d2c6f44d"), tagline: "A city built to connect.",
    invitationMessage: "The city boots up at nine. Every district is a track, every road an agenda, every light a conversation waiting to happen.",
    aboutStory: "Metrogrid maps the summit like a megacity — districts for AI, mobility, climate and finance, with the skyline lighting up as the sessions fill.",
    mainDate: "2026-09-16", mainStartTime: "09:00", mainEndTime: "19:00",
    themeAccentColor: "#2f7dff",
    venueName: "Marina Bay Sands Expo", venueAddress: "10 Bayfront Avenue, Singapore",
    mapLink: "https://maps.google.com/?q=Marina+Bay+Sands+Singapore", latitude: 1.2834, longitude: 103.8607,
    contactName: "Metrogrid Ops", contactEmail: "hello@metrogrid.io", rsvpEnabled: true, rsvpLinkOrContact: "https://metrogrid.io/register",
  },
  subEvents: [
    { eventCode: DIGITALCITY_CODE, order: 1, name: "City Boot-Up", date: "2026-09-16", startTime: "09:00", endTime: "10:00", venueName: "The Grid Hall", description: "Badges, coffee, the skyline coming online.", icon: "🏙" },
    { eventCode: DIGITALCITY_CODE, order: 2, name: "District Tracks", date: "2026-09-16", startTime: "10:30", endTime: "17:00", venueName: "Halls A–D", description: "Four districts, forty sessions, one map.", icon: "◈" },
    { eventCode: DIGITALCITY_CODE, order: 3, name: "Skyline Reception", date: "2026-09-16", startTime: "17:30", endTime: "19:00", venueName: "The Observation Deck", description: "Drinks where the whole grid is visible.", icon: "✦" },
  ],
  media: [],
};

const QUANTUMLAB_CODE = "DEMO-QUANTUMLAB";
const quantumlab: DemoBundle = {
  event: {
    eventCode: QUANTUMLAB_CODE, eventType: "corporate", templateId: "quantumlab",
    eventTitle: "The Lab: Open Research Day", person1Name: "Quantum Institute",
    tentativeDate: "2026-10-08", city: "Zurich", isActive: true, slug: QUANTUMLAB_CODE,
    heroImageUrl: UNSPLASH("photo-1486312338219-ce68d2c6f44d"), tagline: "Hypothesis: you'll be impressed.",
    invitationMessage: "The lab doors open for one day. Touch the holograms, question the researchers, break nothing expensive.",
    aboutStory: "Once a year the institute lets the outside in — live experiments, unpublished results, and researchers who genuinely want to be interrupted.",
    mainDate: "2026-10-08", mainStartTime: "10:00", mainEndTime: "18:00",
    themeAccentColor: "#9d5cf0",
    venueName: "Quantum Institute Campus", venueAddress: "Rämistrasse, Zurich, Switzerland",
    mapLink: "https://maps.google.com/?q=ETH+Zurich", latitude: 47.3769, longitude: 8.5417,
    contactName: "Institute Outreach", contactEmail: "openday@quantuminstitute.ch", rsvpEnabled: true, rsvpLinkOrContact: "https://quantuminstitute.ch/openday",
  },
  subEvents: [
    { eventCode: QUANTUMLAB_CODE, order: 1, name: "Clean Room Tours", date: "2026-10-08", startTime: "10:00", endTime: "12:30", venueName: "Lab Wing B", description: "Suits provided. Curiosity assumed.", icon: "🧪" },
    { eventCode: QUANTUMLAB_CODE, order: 2, name: "Live Experiments", date: "2026-10-08", startTime: "13:30", endTime: "16:00", venueName: "The Demonstration Hall", description: "Six benches, six experiments, zero guarantees.", icon: "⚛" },
    { eventCode: QUANTUMLAB_CODE, order: 3, name: "Ask the Researchers", date: "2026-10-08", startTime: "16:30", endTime: "18:00", venueName: "The Atrium", description: "Open Q&A, coffee, whiteboards that fill fast.", icon: "✦" },
  ],
  media: [],
};

const MISSIONCONTROL_CODE = "DEMO-MISSIONCONTROL";
const missioncontrol: DemoBundle = {
  event: {
    eventCode: MISSIONCONTROL_CODE, eventType: "corporate", templateId: "missioncontrol",
    eventTitle: "Launch Ops Summit", person1Name: "Orbital Systems",
    tentativeDate: "2026-11-12", city: "Houston", isActive: true, slug: MISSIONCONTROL_CODE,
    heroImageUrl: UNSPLASH("photo-1492684223066-81342ee5ff30"), tagline: "We are go for launch.",
    invitationMessage: "All stations report go. The countdown is live, the telemetry is green, and the only thing missing from the control room is you.",
    aboutStory: "One day of flight directors, launch engineers and the people who say 'go' out loud — sharing what the consoles taught them.",
    mainDate: "2026-11-12", mainStartTime: "08:30", mainEndTime: "18:00",
    themeAccentColor: "#3ddc84",
    venueName: "Space Center Houston", venueAddress: "1601 E NASA Pkwy, Houston, TX",
    mapLink: "https://maps.google.com/?q=Space+Center+Houston", latitude: 29.5519, longitude: -95.0972,
    contactName: "Orbital Ops", contactEmail: "summit@orbitalsystems.com", rsvpEnabled: true, rsvpLinkOrContact: "https://orbitalsystems.com/summit",
  },
  subEvents: [
    { eventCode: MISSIONCONTROL_CODE, order: 1, name: "Station Check-In", date: "2026-11-12", startTime: "08:30", endTime: "09:30", venueName: "Mission Lobby", description: "Badges, consoles assigned, coffee at every station.", icon: "🛰" },
    { eventCode: MISSIONCONTROL_CODE, order: 2, name: "Flight Director Panels", date: "2026-11-12", startTime: "10:00", endTime: "16:00", venueName: "Control Room A", description: "Real launches, real anomalies, real debriefs.", icon: "🚀" },
    { eventCode: MISSIONCONTROL_CODE, order: 3, name: "Splashdown Reception", date: "2026-11-12", startTime: "16:30", endTime: "18:00", venueName: "The Rocket Garden", description: "Drinks under actual rockets.", icon: "✦" },
  ],
  media: [],
};

const SECRETLAB_CODE = "DEMO-SECRETLAB";
const secretlab: DemoBundle = {
  event: {
    eventCode: SECRETLAB_CODE, eventType: "product-launch", templateId: "secretlab",
    eventTitle: "Project Vault", person1Name: "Vault Robotics",
    tentativeDate: "2026-10-29", city: "Berlin", isActive: true, slug: SECRETLAB_CODE,
    heroImageUrl: UNSPLASH("photo-1492684223066-81342ee5ff30"), tagline: "Clearance: granted.",
    invitationMessage: "Clearance granted. What we've been building below ground is ready to surface — and you're on the access list.",
    aboutStory: "Three years, one basement, no leaks. Tonight the freight elevator comes up for the first time with the lights on.",
    mainDate: "2026-10-29", mainStartTime: "19:00", mainEndTime: "23:00",
    themeAccentColor: "#f5c518",
    venueName: "Kraftwerk Berlin", venueAddress: "Köpenicker Str. 70, Berlin, Germany",
    mapLink: "https://maps.google.com/?q=Kraftwerk+Berlin", latitude: 52.5104, longitude: 13.4265,
    contactName: "Vault Comms", contactEmail: "access@vaultrobotics.com", rsvpEnabled: true, rsvpLinkOrContact: "https://vaultrobotics.com/access",
  },
  subEvents: [
    { eventCode: SECRETLAB_CODE, order: 1, name: "Security Check", date: "2026-10-29", startTime: "19:00", endTime: "19:45", venueName: "Ground Level", description: "NDAs signed, phones sleeved, badges issued.", icon: "🔒" },
    { eventCode: SECRETLAB_CODE, order: 2, name: "The Descent", date: "2026-10-29", startTime: "20:00", endTime: "21:00", venueName: "Sub-Level 3", description: "The freight elevator, then the thing itself.", icon: "🧬" },
    { eventCode: SECRETLAB_CODE, order: 3, name: "Debrief & Drinks", date: "2026-10-29", startTime: "21:00", endTime: "23:00", venueName: "The Turbine Hall", description: "Questions allowed. Some answers, too.", icon: "✦" },
  ],
  media: [],
};

const PORTAL_CODE = "DEMO-PORTAL";
const portal: DemoBundle = {
  event: {
    eventCode: PORTAL_CODE, eventType: "product-launch", templateId: "portal",
    eventTitle: "The Threshold", person1Name: "Portal Dynamics",
    tentativeDate: "2026-09-30", city: "San Francisco", isActive: true, slug: PORTAL_CODE,
    heroImageUrl: UNSPLASH("photo-1492684223066-81342ee5ff30"), tagline: "It's coming through.",
    invitationMessage: "Something is coming through, and we can't fully explain it yet. Stand with us at the threshold when it arrives.",
    aboutStory: "Every demo we've given ended with the same question: 'wait, how?' On the 30th, we open the frame all the way and let you walk through.",
    mainDate: "2026-09-30", mainStartTime: "18:00", mainEndTime: "22:00",
    themeAccentColor: "#00d9e8",
    venueName: "Fort Mason Center", venueAddress: "2 Marina Blvd, San Francisco, CA",
    mapLink: "https://maps.google.com/?q=Fort+Mason+San+Francisco", latitude: 37.8065, longitude: -122.4312,
    contactName: "Portal Team", contactEmail: "rsvp@portaldynamics.com", rsvpEnabled: true, rsvpLinkOrContact: "https://portaldynamics.com/threshold",
  },
  subEvents: [
    { eventCode: PORTAL_CODE, order: 1, name: "Approach", date: "2026-09-30", startTime: "18:00", endTime: "19:00", venueName: "The Pier", description: "Doors, drinks, a low hum you'll ask about.", icon: "◎" },
    { eventCode: PORTAL_CODE, order: 2, name: "The Opening", date: "2026-09-30", startTime: "19:30", endTime: "20:30", venueName: "Main Hall", description: "The frame activates. Front rows feel the breeze.", icon: "🌀" },
    { eventCode: PORTAL_CODE, order: 3, name: "Walkthroughs", date: "2026-09-30", startTime: "20:30", endTime: "22:00", venueName: "The Annex", description: "Hands-on. One at a time. Mind the step.", icon: "✦" },
  ],
  media: [],
};

const EVOLUTION_CODE = "DEMO-EVOLUTION";
const evolution: DemoBundle = {
  event: {
    eventCode: EVOLUTION_CODE, eventType: "product-launch", templateId: "evolution",
    eventTitle: "Ascent Keynote", person1Name: "Ascent Technologies",
    tentativeDate: "2026-11-18", city: "London", isActive: true, slug: EVOLUTION_CODE,
    heroImageUrl: UNSPLASH("photo-1492684223066-81342ee5ff30"), tagline: "The next stage, revealed.",
    invitationMessage: "Everything before this was a draft — stone, steam, silicon. Come see what all of it was evolving toward.",
    aboutStory: "The keynote walks the whole lineage — every generation of the product on stage, ending with the one nobody outside the building has seen.",
    mainDate: "2026-11-18", mainStartTime: "10:00", mainEndTime: "14:00",
    themeAccentColor: "#3aa8c9",
    venueName: "The Barbican Hall", venueAddress: "Silk Street, London, UK",
    mapLink: "https://maps.google.com/?q=Barbican+Centre+London", latitude: 51.5202, longitude: -0.0937,
    contactName: "Ascent Events", contactEmail: "keynote@ascent.tech", rsvpEnabled: true, rsvpLinkOrContact: "https://ascent.tech/keynote",
  },
  subEvents: [
    { eventCode: EVOLUTION_CODE, order: 1, name: "The Lineage", date: "2026-11-18", startTime: "10:00", endTime: "11:00", venueName: "The Gallery", description: "Every generation, displayed in order. Touch the old ones.", icon: "🦴" },
    { eventCode: EVOLUTION_CODE, order: 2, name: "The Keynote", date: "2026-11-18", startTime: "11:30", endTime: "13:00", venueName: "Main Hall", description: "The next stage, on stage.", icon: "◆" },
    { eventCode: EVOLUTION_CODE, order: 3, name: "Hands-On Lab", date: "2026-11-18", startTime: "13:00", endTime: "14:00", venueName: "The Foyer", description: "Meet the new one. It's friendlier than it looks.", icon: "✦" },
  ],
  media: [],
};

const GOLDENUNIVERSE_CODE = "DEMO-GOLDENUNIVERSE";
const goldenuniverse: DemoBundle = {
  event: {
    eventCode: GOLDENUNIVERSE_CODE, eventType: "award-ceremony", templateId: "goldenuniverse",
    eventTitle: "The Aurum Awards", person1Name: "Aurum Society",
    tentativeDate: "2026-12-05", city: "Dubai", isActive: true, slug: GOLDENUNIVERSE_CODE,
    heroImageUrl: UNSPLASH("photo-1501281668745-f7f57925c3b4"), tagline: "Gold, at cosmic scale.",
    invitationMessage: "Tonight the spotlights leave the stage and search the whole universe. Join us as the year's brightest are given their own orbit.",
    aboutStory: "Twelve categories, twelve golden orbits. The Aurum Awards put this year's brightest names where they belong — among the constellations.",
    mainDate: "2026-12-05", mainStartTime: "19:30", mainEndTime: "23:59",
    themeAccentColor: "#e3b74a",
    venueName: "Museum of the Future", venueAddress: "Sheikh Zayed Road, Dubai, UAE",
    mapLink: "https://maps.google.com/?q=Museum+of+the+Future+Dubai", latitude: 25.2191, longitude: 55.2823,
    contactName: "Aurum Society", contactEmail: "gala@aurumsociety.org", rsvpEnabled: true, rsvpLinkOrContact: "https://aurumsociety.org/tickets",
  },
  subEvents: [
    { eventCode: GOLDENUNIVERSE_CODE, order: 1, name: "The Golden Carpet", date: "2026-12-05", startTime: "19:30", endTime: "20:30", venueName: "The Atrium", dressCode: "Black tie, gold welcome", description: "Arrivals, photographs, orbital small talk.", icon: "✨" },
    { eventCode: GOLDENUNIVERSE_CODE, order: 2, name: "The Ceremony", date: "2026-12-05", startTime: "20:30", endTime: "22:30", venueName: "The Sphere Hall", description: "Twelve awards, each with its own constellation.", icon: "🏆" },
    { eventCode: GOLDENUNIVERSE_CODE, order: 3, name: "The After-Orbit", date: "2026-12-05", startTime: "22:30", endTime: "23:59", venueName: "The Sky Terrace", description: "Champagne with the newly orbited.", icon: "✦" },
  ],
  media: [],
};

const HALLOFFAME_CODE = "DEMO-HALLOFFAME";
const halloffame: DemoBundle = {
  event: {
    eventCode: HALLOFFAME_CODE, eventType: "award-ceremony", templateId: "halloffame",
    eventTitle: "The Pantheon Honors", person1Name: "Pantheon Committee",
    tentativeDate: "2026-11-07", city: "Athens", isActive: true, slug: HALLOFFAME_CODE,
    heroImageUrl: UNSPLASH("photo-1501281668745-f7f57925c3b4"), tagline: "Carved to be remembered.",
    invitationMessage: "Marble remembers what applause forgets. Join us the evening this year's names are carved into the hall.",
    aboutStory: "The hall gains eight names this year. The chisels are ceremonial; the permanence is not.",
    mainDate: "2026-11-07", mainStartTime: "19:00", mainEndTime: "23:30",
    themeAccentColor: "#a87f4f",
    venueName: "Zappeion Hall", venueAddress: "Vasilissis Olgas Avenue, Athens, Greece",
    mapLink: "https://maps.google.com/?q=Zappeion+Athens", latitude: 37.9715, longitude: 23.7367,
    contactName: "The Committee", contactEmail: "honors@pantheon.org", rsvpEnabled: true, rsvpLinkOrContact: "https://pantheon.org/honors",
  },
  subEvents: [
    { eventCode: HALLOFFAME_CODE, order: 1, name: "The Colonnade Hour", date: "2026-11-07", startTime: "19:00", endTime: "20:00", venueName: "The Colonnade", dressCode: "White tie", description: "Aperitifs among the pillars, past honorees among the guests.", icon: "🏛" },
    { eventCode: HALLOFFAME_CODE, order: 2, name: "The Carving", date: "2026-11-07", startTime: "20:00", endTime: "22:00", venueName: "The Great Hall", description: "Eight names, read aloud and set in stone.", icon: "🏆" },
    { eventCode: HALLOFFAME_CODE, order: 3, name: "The Marble Banquet", date: "2026-11-07", startTime: "22:00", endTime: "23:30", venueName: "The East Wing", description: "Dinner beside the newest inscriptions.", icon: "✦" },
  ],
  media: [],
};

const SYNAPSE_CODE = "DEMO-SYNAPSE";
const synapse: DemoBundle = {
  event: {
    eventCode: SYNAPSE_CODE, eventType: "networking-event", templateId: "synapse",
    eventTitle: "Synapse Night", person1Name: "Synapse Collective",
    tentativeDate: "2026-08-28", city: "Bengaluru", isActive: true, slug: SYNAPSE_CODE,
    heroImageUrl: UNSPLASH("photo-1540575467063-178a50c2df87"), tagline: "Where sparks become thought.",
    invitationMessage: "One neuron is a spark; a room of them is a mind. Come fire a few connections with us.",
    aboutStory: "A hundred and fifty builders, researchers and founders in one room, wired for exactly one thing: the conversation you didn't know you needed.",
    mainDate: "2026-08-28", mainStartTime: "18:30", mainEndTime: "22:30",
    themeAccentColor: "#22d3ee",
    venueName: "The Loft, Koramangala", venueAddress: "80 Feet Road, Koramangala, Bengaluru",
    mapLink: "https://maps.google.com/?q=Koramangala+Bengaluru", latitude: 12.9352, longitude: 77.6245,
    contactName: "Synapse Team", contactEmail: "hello@synapse.club", socialLink: "https://linkedin.com/", rsvpEnabled: true, rsvpLinkOrContact: "https://synapse.club/rsvp",
  },
  subEvents: [
    { eventCode: SYNAPSE_CODE, order: 1, name: "First Impulse", date: "2026-08-28", startTime: "18:30", endTime: "19:30", venueName: "The Bar", description: "Name tags with prompts instead of titles.", icon: "⚡" },
    { eventCode: SYNAPSE_CODE, order: 2, name: "Firing Rounds", date: "2026-08-28", startTime: "19:30", endTime: "21:30", venueName: "The Main Floor", description: "Curated introductions every twenty minutes. Resistance is allowed but rare.", icon: "🧠" },
    { eventCode: SYNAPSE_CODE, order: 3, name: "Long-Term Potentiation", date: "2026-08-28", startTime: "21:30", endTime: "22:30", venueName: "The Terrace", description: "The unstructured hour where the real synapses form.", icon: "✦" },
  ],
  media: [],
};

const FUTURECITY_CODE = "DEMO-FUTURECITY";
const futurecity: DemoBundle = {
  event: {
    eventCode: FUTURECITY_CODE, eventType: "networking-event", templateId: "futurecity",
    eventTitle: "Urbania Mixer", person1Name: "Urbania Network",
    tentativeDate: "2026-09-24", city: "Amsterdam", isActive: true, slug: FUTURECITY_CODE,
    heroImageUrl: UNSPLASH("photo-1540575467063-178a50c2df87"), tagline: "A skyline built by hand.",
    invitationMessage: "Every handshake tonight lays a road; every conversation raises a floor. Come help us build the skyline.",
    aboutStory: "Urbania's wall-sized city grows all evening — every new connection adds a building, and by last call there's a skyline nobody built alone.",
    mainDate: "2026-09-24", mainStartTime: "18:00", mainEndTime: "22:00",
    themeAccentColor: "#4f8fd9",
    venueName: "A'DAM Toren", venueAddress: "Overhoeksplein 1, Amsterdam, Netherlands",
    mapLink: "https://maps.google.com/?q=A'DAM+Toren+Amsterdam", latitude: 52.3841, longitude: 4.9024,
    contactName: "Urbania Team", contactEmail: "hello@urbania.network", socialLink: "https://linkedin.com/", rsvpEnabled: true, rsvpLinkOrContact: "https://urbania.network/mixer",
  },
  subEvents: [
    { eventCode: FUTURECITY_CODE, order: 1, name: "Groundbreaking", date: "2026-09-24", startTime: "18:00", endTime: "19:00", venueName: "The Lookout", description: "Doors, drinks, the empty city grid on the wall.", icon: "🏗" },
    { eventCode: FUTURECITY_CODE, order: 2, name: "Construction Hours", date: "2026-09-24", startTime: "19:00", endTime: "21:00", venueName: "The Main Floor", description: "Every intro adds a building. The skyline keeps score.", icon: "🌆" },
    { eventCode: FUTURECITY_CODE, order: 3, name: "City Lights", date: "2026-09-24", startTime: "21:00", endTime: "22:00", venueName: "The Rooftop", description: "The finished skyline, lit — plus the real one behind it.", icon: "✦" },
  ],
  media: [],
};

const FESTIVAL_CODE = "DEMO-FESTIVAL";
const festival: DemoBundle = {
  event: {
    eventCode: FESTIVAL_CODE, eventType: "party", templateId: "festival",
    eventTitle: "LUMINA Festival", person1Name: "Lumina Collective",
    tentativeDate: "2026-12-19", city: "Goa", isActive: true, slug: FESTIVAL_CODE,
    heroImageUrl: UNSPLASH("photo-1470229722913-7c0e2dbbafd3"), tagline: "Lights up. Volume up.",
    invitationMessage: "The stages are floating, the lasers are warm, and the sky has been booked for fireworks. All we need now is your hands in the air.",
    aboutStory: "Three stages, one beach, and a lighting rig that took four days to hang. LUMINA ends the year the only correct way — loudly, and glowing.",
    mainDate: "2026-12-19", mainStartTime: "16:00", mainEndTime: "04:00",
    themeAccentColor: "#e935c1",
    venueName: "Vagator Cliffside", venueAddress: "Vagator Beach, Goa",
    mapLink: "https://maps.google.com/?q=Vagator+Beach+Goa", latitude: 15.5989, longitude: 73.7444,
    contactName: "Lumina Collective", socialLink: "https://instagram.com/", rsvpEnabled: true, rsvpLinkOrContact: "https://lumina.fest/tickets",
  },
  subEvents: [
    { eventCode: FESTIVAL_CODE, order: 1, name: "Sunset Stage", date: "2026-12-19", startTime: "16:00", endTime: "19:00", venueName: "The Cliff Stage", description: "Openers with the ocean as backdrop.", icon: "🌅" },
    { eventCode: FESTIVAL_CODE, order: 2, name: "The Light Show", date: "2026-12-19", startTime: "20:00", endTime: "00:00", venueName: "Main Stage", description: "Headliners under the full rig. Look up often.", icon: "🎆" },
    { eventCode: FESTIVAL_CODE, order: 3, name: "Sunrise Set", date: "2026-12-20", startTime: "00:00", endTime: "04:00", venueName: "The Beach Floor", description: "The set that ends when the sky says so.", icon: "✦" },
  ],
  media: [],
};

const NEONJUNGLE_CODE = "DEMO-NEONJUNGLE";
const neonjungle: DemoBundle = {
  event: {
    eventCode: NEONJUNGLE_CODE, eventType: "party", templateId: "neonjungle",
    eventTitle: "Neon Jungle Night", person1Name: "Jungle Kru",
    tentativeDate: "2026-10-31", city: "Bangkok", isActive: true, slug: NEONJUNGLE_CODE,
    heroImageUrl: UNSPLASH("photo-1470229722913-7c0e2dbbafd3"), tagline: "The wild glows tonight.",
    invitationMessage: "Past the glowing vines and the waterfall made of light, the jungle is already dancing. Follow the neon panther — she knows the way.",
    aboutStory: "A warehouse rainforest where the vines are LED, the canopy pulses with the bassline, and the wildlife is exclusively on the dance floor.",
    mainDate: "2026-10-31", mainStartTime: "21:00", mainEndTime: "05:00",
    themeAccentColor: "#39ff6e",
    venueName: "The Greenhouse Warehouse", venueAddress: "Thonglor, Bangkok, Thailand",
    mapLink: "https://maps.google.com/?q=Thonglor+Bangkok", latitude: 13.7305, longitude: 100.5697,
    contactName: "Jungle Kru", socialLink: "https://instagram.com/", rsvpEnabled: true, rsvpLinkOrContact: "https://ra.co/events/bangkok",
  },
  subEvents: [
    { eventCode: NEONJUNGLE_CODE, order: 1, name: "Into the Undergrowth", date: "2026-10-31", startTime: "21:00", endTime: "23:00", venueName: "The Vine Tunnel", dressCode: "Glow encouraged", description: "Entry through the LED canopy. UV paint station on the left.", icon: "🌿" },
    { eventCode: NEONJUNGLE_CODE, order: 2, name: "The Canopy Set", date: "2026-10-31", startTime: "23:00", endTime: "02:00", venueName: "Main Floor", description: "Headliner under the pulsing canopy.", icon: "🐆" },
    { eventCode: NEONJUNGLE_CODE, order: 3, name: "The Waterfall Room", date: "2026-11-01", startTime: "02:00", endTime: "05:00", venueName: "Back Room", description: "Slower, deeper, lit by falling light.", icon: "✦" },
  ],
  media: [],
};

const MIDNIGHTTOKYO_CODE = "DEMO-MIDNIGHTTOKYO";
const midnighttokyo: DemoBundle = {
  event: {
    eventCode: MIDNIGHTTOKYO_CODE, eventType: "party", templateId: "midnighttokyo",
    eventTitle: "Midnight Shibuya", person1Name: "Shibuya Underground",
    tentativeDate: "2026-11-14", city: "Tokyo", isActive: true, slug: MIDNIGHTTOKYO_CODE,
    heroImageUrl: UNSPLASH("photo-1470229722913-7c0e2dbbafd3"), tagline: "After the last train.",
    invitationMessage: "The rain has polished the streets, the signs are singing, and there's a rooftop with your name in neon. Meet us after the last train.",
    aboutStory: "The night starts when the station closes — noodles at the counter, neon down every alley, and a rooftop that only the regulars can find.",
    mainDate: "2026-11-14", mainStartTime: "23:30", mainEndTime: "06:00",
    themeAccentColor: "#ff3b4e",
    venueName: "Rooftop Ichiban", venueAddress: "Dogenzaka, Shibuya, Tokyo, Japan",
    mapLink: "https://maps.google.com/?q=Dogenzaka+Shibuya+Tokyo", latitude: 35.6595, longitude: 139.6986,
    contactName: "Shibuya Underground", socialLink: "https://instagram.com/", rsvpEnabled: true, rsvpLinkOrContact: "https://ra.co/events/tokyo",
  },
  subEvents: [
    { eventCode: MIDNIGHTTOKYO_CODE, order: 1, name: "Last Train Missed", date: "2026-11-14", startTime: "23:30", endTime: "00:30", venueName: "The Alley Bar", description: "Highballs and the good kind of bad decisions.", icon: "🏮" },
    { eventCode: MIDNIGHTTOKYO_CODE, order: 2, name: "Rooftop Hours", date: "2026-11-15", startTime: "00:30", endTime: "04:00", venueName: "Rooftop Ichiban", description: "DJ over the crossing, neon below, city awake.", icon: "🌃" },
    { eventCode: MIDNIGHTTOKYO_CODE, order: 3, name: "First Train Ramen", date: "2026-11-15", startTime: "04:30", endTime: "06:00", venueName: "The Counter", description: "The traditional closing ceremony. Slurping mandatory.", icon: "🍜" },
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
  [SKYREALM_CODE]: skyrealm,
  [CATHEDRAL_CODE]: cathedral,
  [SAKURA_CODE]: sakura,
  [VERSAILLES_CODE]: versailles,
  [FRESCO_CODE]: fresco,
  [MIRAGE_CODE]: mirage,
  [ICEPALACE_CODE]: icepalace,
  [GALAXYOPERA_CODE]: galaxyopera,
  [TWORIVERS_CODE]: tworivers,
  [MIRRORWORLDS_CODE]: mirrorworlds,
  [INFINITYTRAIN_CODE]: infinitytrain,
  [LANTERNS_CODE]: lanterns,
  [GLASSROSE_CODE]: glassrose,
  [SECRETGALAXY_CODE]: secretgalaxy,
  [CARTOON_CODE]: cartoon,
  [BRICKTOWN_CODE]: bricktown,
  [TREASURE_CODE]: treasure,
  [THEMEPARK_CODE]: themepark,
  [CANDYLAND_CODE]: candyland,
  [ROBOCITY_CODE]: robocity,
  [SPACEMISSION_CODE]: spacemission,
  [JUNGLE_CODE]: jungle,
  [TIMECAPSULE_CODE]: timecapsule,
  [TREEOFLIFE_CODE]: treeoflife,
  [ENDLESSCLOCK_CODE]: endlessclock,
  [DIGITALCITY_CODE]: digitalcity,
  [QUANTUMLAB_CODE]: quantumlab,
  [MISSIONCONTROL_CODE]: missioncontrol,
  [SECRETLAB_CODE]: secretlab,
  [PORTAL_CODE]: portal,
  [EVOLUTION_CODE]: evolution,
  [GOLDENUNIVERSE_CODE]: goldenuniverse,
  [HALLOFFAME_CODE]: halloffame,
  [SYNAPSE_CODE]: synapse,
  [FUTURECITY_CODE]: futurecity,
  [FESTIVAL_CODE]: festival,
  [NEONJUNGLE_CODE]: neonjungle,
  [MIDNIGHTTOKYO_CODE]: midnighttokyo,
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
  skyrealm: SKYREALM_CODE,
  cathedral: CATHEDRAL_CODE,
  sakura: SAKURA_CODE,
  versailles: VERSAILLES_CODE,
  fresco: FRESCO_CODE,
  mirage: MIRAGE_CODE,
  icepalace: ICEPALACE_CODE,
  galaxyopera: GALAXYOPERA_CODE,
  tworivers: TWORIVERS_CODE,
  mirrorworlds: MIRRORWORLDS_CODE,
  infinitytrain: INFINITYTRAIN_CODE,
  lanterns: LANTERNS_CODE,
  glassrose: GLASSROSE_CODE,
  secretgalaxy: SECRETGALAXY_CODE,
  cartoon: CARTOON_CODE,
  bricktown: BRICKTOWN_CODE,
  treasure: TREASURE_CODE,
  themepark: THEMEPARK_CODE,
  candyland: CANDYLAND_CODE,
  robocity: ROBOCITY_CODE,
  spacemission: SPACEMISSION_CODE,
  jungle: JUNGLE_CODE,
  timecapsule: TIMECAPSULE_CODE,
  treeoflife: TREEOFLIFE_CODE,
  endlessclock: ENDLESSCLOCK_CODE,
  digitalcity: DIGITALCITY_CODE,
  quantumlab: QUANTUMLAB_CODE,
  missioncontrol: MISSIONCONTROL_CODE,
  secretlab: SECRETLAB_CODE,
  portal: PORTAL_CODE,
  evolution: EVOLUTION_CODE,
  goldenuniverse: GOLDENUNIVERSE_CODE,
  halloffame: HALLOFFAME_CODE,
  synapse: SYNAPSE_CODE,
  futurecity: FUTURECITY_CODE,
  festival: FESTIVAL_CODE,
  neonjungle: NEONJUNGLE_CODE,
  midnighttokyo: MIDNIGHTTOKYO_CODE,
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
