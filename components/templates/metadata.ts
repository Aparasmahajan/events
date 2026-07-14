import type { EventType, TemplateMeta, TemplateTag } from "@/lib/types";

/*  Naming convention:
 *  - `name`      = customer-friendly, describes what it's FOR ("Royal Heritage",
 *                  "Cinematic Wedding", "Cyberpunk Launch"). Shown big on the card.
 *  - `codename`  = the poetic one-word identity ("Aurora", "Obsidian", "Nexus")
 *                  we developed each template around. Shown small under the name.
 *                  Optional — omit when the name is already the identity.
 *  - `description` = plain English, one sentence, "who / when to use this".
 *                    Avoid poetic filler in this field; keep that in
 *                    `defaults.invitationMessage` where it belongs.
 *  - `keywords`  = search terms a customer might type — synonyms, use-case
 *                  phrases, culture / religion words. Powers relevance scoring
 *                  in the picker search box.
 */

export const royalMeta: TemplateMeta = {
  id: "royal",
  name: "Royal Wedding",
  codename: "Royal Heritage",
  description:
    "The full big-fat-Indian-wedding treatment — ornate gold serifs, room for mehndi, haldi, sangeet and pheras across days.",
  eventTypes: ["wedding", "engagement", "anniversary"],
  tags: ["royal", "elegant", "luxurious", "traditional", "appealing", "romantic"],
  keywords: [
    "indian wedding", "hindu wedding", "punjabi wedding", "muslim wedding",
    "shaadi", "mandap", "traditional", "gold", "big fat indian",
    "family wedding", "ritual", "grand", "regal", "opulent", "haldi",
    "mehndi", "sangeet", "pheras",
  ],
  icon: "👑",
  vibe: { label: "Vintage Royal", color: "#a3792c" },
  previewImage: "/template-previews/royal.jpg",
  defaults: {
    invitationMessage:
      "With the blessings of our families, we invite you to share in the joy of our wedding celebration.",
    tagline: "Two souls. One forever.",
    accentColor: "#a3792c",
    heroImage: "/samples/indian-mandap.jpg",
    aboutStory:
      "A love written in monsoons, mountains and quiet evenings. Today, we make it official.",
  },
};

export const minimalMeta: TemplateMeta = {
  id: "minimal",
  name: "Minimal Editorial",
  codename: "Minimal Mono",
  description:
    "Whitespace-heavy, black-and-white typography. When you want the day to feel quiet and precise — small weddings, corporate meetings, workshops.",
  eventTypes: ["wedding", "corporate", "anniversary", "engagement"],
  tags: ["minimal", "decent", "modern", "elegant", "monochrome"],
  keywords: [
    "small wedding", "intimate", "elopement", "quiet", "clean", "minimal",
    "black and white", "editorial", "understated", "beach wedding",
    "modern", "corporate meeting", "workshop", "town hall",
  ],
  icon: "◇",
  vibe: { label: "Modern Minimal", color: "#555555" },
  previewImage: "/template-previews/minimal.jpg",
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
  name: "Modern Bold",
  codename: "Modern Noir",
  description:
    "Dark, cinematic, design-forward. Feels like the announcement for a new album — for events with attitude, not tradition.",
  eventTypes: ["wedding", "birthday", "corporate", "engagement"],
  tags: ["modern", "cool", "appealing", "bold"],
  keywords: [
    "dark", "cinematic", "bold", "modern", "edgy", "purple", "attitude",
    "album drop", "urban", "cool", "millennial", "gen z", "sleek",
    "design forward",
  ],
  icon: "★",
  vibe: { label: "Avant-Garde", color: "#7c3aed" },
  previewImage: "/template-previews/modern.jpg",
  defaults: {
    invitationMessage: "Some moments deserve a soundtrack. This is one of them.",
    tagline: "It's happening.",
    accentColor: "#7c3aed",
    heroImage: "/samples/lotus-decor.jpg",
  },
};

export const vibrantMeta: TemplateMeta = {
  id: "vibrant",
  name: "Party Pop",
  codename: "Vibrant Pop",
  description:
    "Bright, chaotic, joyful. Confetti energy — for birthdays, kids' parties, and small engagements that want a lot of pink.",
  eventTypes: ["birthday", "engagement", "anniversary", "wedding"],
  tags: ["vibrant", "cool", "appealing", "playful", "festive", "bold"],
  keywords: [
    "birthday", "kids birthday", "first birthday", "party", "pink", "playful",
    "colorful", "fun", "engagement", "confetti", "loud", "cake", "balloon",
    "child", "children", "sweet sixteen", "milestone birthday",
  ],
  icon: "🎉",
  vibe: { label: "Festive", color: "#ff5fa2" },
  previewImage: "/template-previews/vibrant.jpg",
  defaults: {
    invitationMessage: "Confetti, cake and chaos — you're in.",
    tagline: "Let's party!",
    accentColor: "#ff5fa2",
    // Colourful rangoli — bright, festive and unmistakably a celebration, to
    // match this template's playful, high-energy palette.
    heroImage: "/samples/rangoli.jpg",
  },
};

export const pastelMeta: TemplateMeta = {
  id: "pastel",
  name: "Pastel Wedding",
  codename: "Pastel Bloom",
  description:
    "Soft palette, gentle serifs, garden-wedding energy. For couples who want the day to feel unhurried and romantic, not loud.",
  eventTypes: ["wedding", "engagement", "anniversary", "birthday"],
  tags: ["romantic", "pastel", "elegant", "decent", "appealing"],
  keywords: [
    "romantic", "soft", "pastel", "garden wedding", "outdoor wedding",
    "gentle", "floral", "rose", "engagement", "spring wedding", "delicate",
    "unhurried", "rose gold", "bridal shower",
  ],
  icon: "🌸",
  vibe: { label: "Soft Romance", color: "#e8a0a0" },
  previewImage: "/template-previews/pastel.jpg",
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
  name: "Cinematic Wedding",
  codename: "Aurora",
  description:
    "A wedding rendered like a film — parallax names under a moonlight beam, a sideways photo reel, floating event islands. For weddings that want to feel like a moment.",
  eventTypes: ["wedding", "engagement", "anniversary"],
  tags: ["cinematic", "interactive", "luxurious", "modern", "romantic", "bold", "cool"],
  keywords: [
    "cinematic", "luxury wedding", "celestial", "moonlight", "night wedding",
    "romantic", "premium", "champagne", "midnight", "starry", "moon",
    "poetic", "film like", "destination wedding",
  ],
  icon: "🌌",
  vibe: { label: "Celestial", color: "#6b4e9b" },
  previewImage: "/template-previews/aurora.jpg",
  defaults: {
    invitationMessage:
      "Beneath a sky we'll never forget, we ask you to witness the night two stories become one.",
    tagline: "Two orbits, one light.",
    accentColor: "#d8b46a",
    heroImage: "/samples/indian-mandap-decor.jpg",
    aboutStory:
      "It began as a small gravity — a glance that bent the evening. Years later the pull is a certainty, and we'd like the people we love around us when we name it out loud.",
  },
};

export const obsidianMeta: TemplateMeta = {
  id: "obsidian",
  name: "Black-Tie Wedding",
  codename: "Obsidian",
  description:
    "Burnt bronze on black, scenes that slide over each other, sliced typography. Editorial and restrained — for couples who want a black-tie night with weight.",
  eventTypes: ["wedding", "engagement", "anniversary"],
  tags: ["cinematic", "editorial", "luxurious", "bold", "modern", "cool"],
  keywords: [
    "black tie", "editorial", "bronze", "luxury wedding", "cinematic",
    "restrained", "night wedding", "moody", "premium", "dinner",
    "long table", "architectural", "formal", "cocktail wedding",
  ],
  icon: "🔥",
  vibe: { label: "Night Luxe", color: "#b5763a" },
  previewImage: "/template-previews/obsidian.jpg",
  defaults: {
    invitationMessage:
      "No grand announcement. Only the people who matter, in a room that will remember the night.",
    tagline: "An evening, in acts.",
    accentColor: "#b5763a",
    heroImage: "/samples/diya-lamps.jpg",
    aboutStory:
      "We are not for spectacle. We are for the long table, the low light, the last song — and the few who'll still be dancing when it plays.",
  },
};

export const celestiaMeta: TemplateMeta = {
  id: "celestia",
  name: "Ethereal Wedding",
  codename: "Celestia",
  description:
    "Glass orb that turns as you scroll, floating photos, a ribbon that threads the day. Dusty lavender and ice blue — for weddings that feel weightless.",
  eventTypes: ["wedding", "engagement", "anniversary"],
  tags: ["elegant", "romantic", "luxurious", "cinematic", "cool", "appealing"],
  keywords: [
    "ethereal", "romantic", "celestial", "lavender", "floating", "dreamy",
    "delicate", "wedding", "spring wedding", "pearl", "ice blue",
    "weightless", "otherworldly", "fairy tale",
  ],
  icon: "✦",
  vibe: { label: "Ethereal", color: "#7c6bb0" },
  previewImage: "/template-previews/celestia.jpg",
  defaults: {
    invitationMessage:
      "Somewhere between a wish and a certainty, we found each other — and we'd love you there when we make it real.",
    tagline: "Written in the stars.",
    accentColor: "#7c6bb0",
    heroImage: "/samples/lotus-decor.jpg",
    aboutStory:
      "A slow orbit of small coincidences that stopped feeling like coincidence. This is the part where two paths quietly become one.",
  },
};

export const nexusMeta: TemplateMeta = {
  id: "nexus",
  name: "Cyberpunk Launch",
  codename: "Nexus",
  description:
    "Neon cyan on midnight. Particles coalesce, a circuit-board timeline, holographic feature cards. For tech product reveals and futuristic launches.",
  eventTypes: ["product-launch", "corporate"],
  tags: ["cyberpunk", "tech", "bold", "modern", "cinematic", "interactive"],
  keywords: [
    "product launch", "tech launch", "cyberpunk", "neon", "futuristic",
    "startup launch", "reveal", "software launch", "hardware launch",
    "cyan", "roadmap", "keynote", "beta", "unveiling", "release",
  ],
  icon: "◆",
  vibe: { label: "Cyber", color: "#00f0ff" },
  previewImage: "/template-previews/nexus.jpg",
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
  name: "Executive Summit",
  codename: "Pinnacle",
  description:
    "Glass, deep navy, warm gold. For C-suite conferences, invite-only summits, and premium industry gatherings.",
  eventTypes: ["corporate"],
  tags: ["premium", "glass", "architectural", "minimal", "elegant", "modern"],
  keywords: [
    "conference", "summit", "executive", "leadership", "ceo", "premium",
    "corporate", "elite", "glass", "navy", "leaders", "invite only",
    "c-suite", "board", "industry", "keynote",
  ],
  icon: "⛰",
  vibe: { label: "Executive", color: "#1e3a5f" },
  previewImage: "/template-previews/pinnacle.jpg",
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
  name: "Awards Gala",
  codename: "Luminary",
  description:
    "Celestial glamour meets Hollywood's golden age. For award ceremonies, black-tie honours, and annual recognition nights.",
  eventTypes: ["award-ceremony", "corporate"],
  tags: ["celestial", "premium", "luxurious", "cinematic", "elegant", "artistic"],
  keywords: [
    "awards", "gala", "black tie", "glamour", "hollywood", "red carpet",
    "ceremony", "recognition", "celebration", "stars", "honor",
    "annual awards", "honours", "prize", "vip",
  ],
  icon: "⭐",
  vibe: { label: "Gala", color: "#f0cf7a" },
  previewImage: "/template-previews/luminary.jpg",
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
  name: "Underground Nightlife",
  codename: "After",
  description:
    "Underground club meets digital art. Laser beams, neon typography, UV purple. For DJ nights, afterparties, and warehouse events.",
  eventTypes: ["party", "birthday"],
  tags: ["neon", "bold", "vibrant", "festive", "playful", "modern"],
  keywords: [
    "nightlife", "party", "club night", "dj", "afterparty", "rave",
    "underground", "neon", "warehouse", "electronic", "techno", "house",
    "late night", "berghain", "boiler room", "renegade",
  ],
  icon: "💫",
  vibe: { label: "Nightlife", color: "#ff2d78" },
  previewImage: "/template-previews/after.jpg",
  defaults: {
    invitationMessage: "The address is in your phone. The vibe is in your head. The rest is up to the night.",
    tagline: "The night is yours.",
    accentColor: "#ff2d78",
    heroImage:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "No dress code but confidence. No entry policy but good energy. The music finds the level it needs to be. The rest is chemistry.",
  },
};

export const empyreanMeta: TemplateMeta = {
  id: "empyrean",
  name: "Divine Wedding",
  codename: "Empyrean",
  description:
    "Alabaster marble, drifting clouds, a staircase to eternity. For weddings that want to feel sacred, otherworldly, chapel-quiet.",
  eventTypes: ["wedding", "engagement", "anniversary"],
  tags: ["luxurious", "elegant", "romantic", "celestial", "premium", "artistic"],
  keywords: [
    "divine", "heavenly", "chapel", "cathedral", "sacred", "marble", "clouds",
    "alabaster", "gold leaf", "spiritual", "religious wedding", "church wedding",
    "ivory", "grand wedding", "sky", "angel", "ethereal wedding",
  ],
  icon: "☁",
  vibe: { label: "Divine", color: "#c8a460" },
  previewImage: "/template-previews/empyrean.jpg",
  defaults: {
    invitationMessage:
      "Beneath a sky that has watched every love that came before ours, we invite you to witness the one we are making now.",
    tagline: "A love ascending.",
    accentColor: "#c8a460",
    heroImage: "/samples/mandap-flowers.jpg",
    aboutStory:
      "Some love stories are written on paper. Ours was written in light — the kind that pours through stained glass at four in the afternoon, when nobody is watching but the room already knows.",
  },
};

export const prismMeta: TemplateMeta = {
  id: "prism",
  name: "Crystal Wedding",
  codename: "Prism",
  description:
    "Floating glass, prism refractions, rainbow light spilling across sapphire. For couples who want their day to feel like light itself.",
  eventTypes: ["wedding", "engagement", "anniversary"],
  tags: ["luxurious", "elegant", "modern", "glass", "cinematic", "artistic", "premium"],
  keywords: [
    "crystal", "prism", "glass wedding", "rainbow", "iridescent", "sapphire",
    "diamond wedding", "modern luxury wedding", "clear", "translucent",
    "reflective", "art wedding", "contemporary wedding",
  ],
  icon: "💎",
  vibe: { label: "Crystalline", color: "#7ea8ff" },
  previewImage: "/samples/rings-roses.jpg",
  defaults: {
    invitationMessage:
      "Light bends. Colors emerge. Two lives, refracted through one moment — we would love you there when it happens.",
    tagline: "Light meets light.",
    accentColor: "#7ea8ff",
    heroImage: "/samples/rings-roses.jpg",
    aboutStory:
      "A prism doesn't invent color — it reveals what was always in the light. Our years together have felt exactly like that.",
  },
};

export const orbitMeta: TemplateMeta = {
  id: "orbit",
  name: "Cosmic Birthday",
  codename: "Orbit",
  description:
    "Balloons become planets, confetti becomes shooting stars. A playful little universe built around the birthday kid.",
  eventTypes: ["birthday"],
  tags: ["playful", "vibrant", "cool", "festive", "whimsical", "celestial", "bold"],
  keywords: [
    "kids birthday", "space birthday", "planet party", "astronaut", "rocket",
    "cosmic", "playful", "colorful", "child", "children", "5th birthday",
    "10th birthday", "space theme", "solar system", "stars",
  ],
  icon: "🪐",
  vibe: { label: "Cosmic Play", color: "#ff6f91" },
  previewImage: "/template-previews/orbit.jpg",
  defaults: {
    invitationMessage:
      "Blast off with us — cake, chaos, and a small human who's about to become one year more important.",
    tagline: "The birthday universe.",
    accentColor: "#ff6f91",
    heroImage:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "Every year they add a new orbit — new obsessions, new friends, new opinions on dinner. Come help us celebrate the whole galaxy of them.",
  },
};

export const arcadeMeta: TemplateMeta = {
  id: "arcade",
  name: "Retro Arcade Party",
  codename: "Arcade",
  description:
    "Synthwave gridlines, pixel typography, VCR scanlines and neon pink glow. For milestone birthdays that want '80s-future energy.",
  eventTypes: ["birthday", "party"],
  tags: ["neon", "bold", "vibrant", "playful", "cyberpunk", "cool", "modern"],
  keywords: [
    "80s", "retro", "synthwave", "arcade", "gaming birthday", "pixel", "neon",
    "vaporwave", "retrowave", "nostalgic", "milestone birthday", "30th",
    "40th", "gamer", "video game party",
  ],
  icon: "🕹",
  vibe: { label: "Synthwave", color: "#ff006e" },
  previewImage: "/template-previews/arcade.jpg",
  defaults: {
    invitationMessage:
      "Insert coin, choose player one. The party is loading — hope you brought your high-score energy.",
    tagline: "Player one is ready.",
    accentColor: "#ff006e",
    heroImage:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "A birthday where every song is a boss theme and every drink comes with a power-up. Extra life not guaranteed.",
  },
};

export const promiseMeta: TemplateMeta = {
  id: "promise",
  name: "Engagement Announcement",
  codename: "Promise",
  description:
    "Two lives, two typographic worlds, converging into one as the page scrolls. For engagements that want to feel like the exact moment.",
  eventTypes: ["engagement", "anniversary", "wedding"],
  tags: ["romantic", "elegant", "cinematic", "modern", "artistic", "editorial"],
  keywords: [
    "engagement", "proposal", "roka", "engagement party", "just engaged",
    "she said yes", "promise", "commitment", "vow", "propose",
    "engagement announcement", "we're engaged",
  ],
  icon: "💗",
  vibe: { label: "Convergence", color: "#c89b8c" },
  previewImage: "/template-previews/promise.jpg",
  defaults: {
    invitationMessage:
      "We said yes — to each other, and to a whole life still being written. Come stand in the room the first time we say it out loud.",
    tagline: "The moment two become us.",
    accentColor: "#c89b8c",
    heroImage:
      "https://images.unsplash.com/photo-1525258946800-98cfd641d0de?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "It wasn't a grand plan. It was a quiet Tuesday and a question that had been waiting a long time to be asked.",
  },
};

export const chaptersMeta: TemplateMeta = {
  id: "chapters",
  name: "Anniversary Chronicles",
  codename: "Chapters",
  description:
    "Parchment, ink serifs, a chapter-by-chapter walk through the years — with a small constellation of the moments that mattered.",
  eventTypes: ["anniversary", "wedding"],
  tags: ["editorial", "elegant", "romantic", "traditional", "artistic", "decent"],
  keywords: [
    "anniversary", "silver anniversary", "golden anniversary", "25 years",
    "50 years", "vow renewal", "wedding anniversary", "milestone",
    "years together", "chronicles", "journal", "memoir",
  ],
  icon: "📖",
  vibe: { label: "Chronicles", color: "#a68b5b" },
  previewImage: "/template-previews/chapters.jpg",
  defaults: {
    invitationMessage:
      "A story worth its own book — and you're in almost every chapter. Come help us bind another year to the shelf.",
    tagline: "Volume the next.",
    accentColor: "#a68b5b",
    heroImage: "/samples/wedding-cake.jpg",
    aboutStory:
      "Twenty-five years of small mornings, wrong turns, right choices, and one shared soundtrack that has somehow held it all together.",
  },
};

export const neuralMeta: TemplateMeta = {
  id: "neural",
  name: "AI Summit",
  codename: "Neural",
  description:
    "Nodes, edges, streaming data lines and holographic panels. For AI conferences, tech summits and research symposia.",
  eventTypes: ["corporate", "product-launch"],
  tags: ["tech", "modern", "cyberpunk", "bold", "cinematic", "interactive"],
  keywords: [
    "ai conference", "ai summit", "artificial intelligence", "ml conference",
    "machine learning", "research", "symposium", "developer conference",
    "devcon", "data conference", "neural", "llm", "generative ai",
  ],
  icon: "🧠",
  vibe: { label: "Neural", color: "#00d4ff" },
  previewImage: "/template-previews/neural.jpg",
  defaults: {
    invitationMessage:
      "Two days at the exact point where research becomes product. Come think out loud with the people building what's next.",
    tagline: "Where the network meets.",
    accentColor: "#00d4ff",
    heroImage:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "The room every year gets a little smaller — not because there's less interest, but because we're keeping it to the people whose work is actually shaping the field.",
  },
};

export const unveilMeta: TemplateMeta = {
  id: "unveil",
  name: "Product Reveal",
  codename: "Unveil",
  description:
    "Absolute black, a single spotlight, a slow deliberate reveal. For product announcements that want the room to hold its breath.",
  eventTypes: ["product-launch", "corporate"],
  tags: ["cinematic", "bold", "premium", "editorial", "minimal", "modern"],
  keywords: [
    "product launch", "product reveal", "unveiling", "keynote", "announcement",
    "flagship", "reveal", "one more thing", "premiere", "debut", "release event",
    "hardware launch", "unveil",
  ],
  icon: "🎭",
  vibe: { label: "Reveal", color: "#ff2d55" },
  previewImage: "/template-previews/unveil.jpg",
  defaults: {
    invitationMessage: "One evening. One reveal. Everything you thought about this category is about to change.",
    tagline: "Nothing you're expecting.",
    accentColor: "#ff2d55",
    heroImage:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "We've been quiet for a while. That was on purpose. What we're showing you is the reason.",
  },
};

export const odeonMeta: TemplateMeta = {
  id: "odeon",
  name: "Golden Awards",
  codename: "Odeon",
  description:
    "Deep burgundy velvet, spotlight sweeps, gold leaf typography, a red carpet unrolling as you scroll. Hollywood-Oscars gravitas.",
  eventTypes: ["award-ceremony", "corporate"],
  tags: ["luxurious", "premium", "cinematic", "elegant", "artistic", "traditional"],
  keywords: [
    "awards", "oscars style", "gala", "red carpet", "trophy", "hollywood",
    "black tie", "recognition", "ceremony", "honors", "gold", "prize",
    "annual awards", "industry awards", "recognition night",
  ],
  icon: "🏆",
  vibe: { label: "Hall of Legends", color: "#d4af37" },
  previewImage: "/template-previews/odeon.jpg",
  defaults: {
    invitationMessage:
      "A room built for the moments a career remembers. Join us for an evening honouring the very best of the year.",
    tagline: "Where legends are named.",
    accentColor: "#d4af37",
    heroImage:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "Every year the carpet rolls out, the lights find one face at a time, and the industry decides which stories deserved to be told louder.",
  },
};

export const constellaMeta: TemplateMeta = {
  id: "constella",
  name: "Constellation Networking",
  codename: "Constella",
  description:
    "Individual stars that draw connection lines to their nearest neighbors as the page scrolls — a networking event that looks like the network it makes.",
  eventTypes: ["networking-event", "corporate"],
  tags: ["cool", "modern", "interactive", "artistic", "celestial", "premium"],
  keywords: [
    "networking", "connections", "founders dinner", "operators", "meetup",
    "professional networking", "salon", "community night", "constellation",
    "startup networking", "alumni night", "peer group",
  ],
  icon: "🌟",
  vibe: { label: "Constellation", color: "#7ff9ff" },
  previewImage: "/template-previews/constella.jpg",
  defaults: {
    invitationMessage:
      "An evening where the room is the point — and the connections you leave with are the whole return on investment.",
    tagline: "Every star, its own line.",
    accentColor: "#7ff9ff",
    heroImage:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "A network isn't a list. It's a shape — a constellation you draw one conversation at a time. Tonight we add a few more lines.",
  },
};

export const metropolisMeta: TemplateMeta = {
  id: "metropolis",
  name: "Neon City Party",
  codename: "Metropolis",
  description:
    "Cyberpunk skyline, laser sweeps, holographic billboards, rain on chrome. For parties that want to feel like the third act of a sci-fi film.",
  eventTypes: ["party", "birthday"],
  tags: ["neon", "cyberpunk", "bold", "vibrant", "modern", "playful", "festive"],
  keywords: [
    "cyberpunk", "neon", "city party", "warehouse", "rooftop party",
    "underground", "rave", "afterparty", "electronic", "sci-fi",
    "futuristic party", "night city", "megaparty", "big party",
  ],
  icon: "🌆",
  vibe: { label: "Cyber City", color: "#ff0080" },
  previewImage: "/template-previews/metropolis.jpg",
  defaults: {
    invitationMessage:
      "The city has a soundtrack tonight and we have the address. Doors at ten, dress code is whatever makes you unrecognisable in the morning.",
    tagline: "Enter the city.",
    accentColor: "#ff0080",
    heroImage:
      "https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "Ten floors, three rooms, one sound. Somewhere between the elevator and the roof, the night becomes what it wants to be.",
  },
};

// ─── Wedding: Moonlit Kingdom ────────────────────────────────
export const moonlitMeta: TemplateMeta = {
  id: "moonlit",
  name: "Moonlit Kingdom",
  codename: "Moonlit Kingdom",
  description:
    "A kingdom under a giant full moon — castles in mist, floating lanterns, silver on still water. For weddings that want to feel like the greatest fantasy royal wedding ever held.",
  eventTypes: ["wedding", "engagement", "anniversary"],
  tags: ["royal", "cinematic", "luxurious", "romantic", "celestial", "traditional"],
  keywords: [
    "fantasy wedding", "castle wedding", "moonlight", "lanterns", "royal night",
    "kingdom", "cinematic wedding", "epic wedding", "fairy tale wedding",
    "mist", "midnight ceremony", "gothic romance",
  ],
  icon: "🏰",
  vibe: { label: "Moonlit Kingdom", color: "#c8d4e8" },
  previewImage: "/template-previews/moonlit.jpg",
  defaults: {
    invitationMessage:
      "Beneath a moon that has lit every love before ours, and every kingdom before ours, we invite you into the night we've been walking toward.",
    tagline: "Under one silver sky.",
    accentColor: "#c8d4e8",
    heroImage:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "Two names carved into a glowing stone gate. A pathway lit by ten thousand candles. A kingdom holding its breath for the words that turn a promise into a covenant.",
  },
};

// ─── Wedding: Sky Temple ─────────────────────────────────────
export const skytempleMeta: TemplateMeta = {
  id: "skytemple",
  name: "Sky Temple",
  codename: "Sky Temple",
  description:
    "Marble temples floating between cloud islands, golden birds, waterfalls falling into infinite sky. For weddings that want the guest to feel they're attending among the gods.",
  eventTypes: ["wedding", "engagement", "anniversary"],
  tags: ["celestial", "luxurious", "cinematic", "elegant", "artistic", "premium"],
  keywords: [
    "sky wedding", "cloud wedding", "heavenly", "floating temple", "godly",
    "olympian", "cloud kingdom", "spiritual wedding", "temple wedding",
    "orchestral", "divine",
  ],
  icon: "⛩",
  vibe: { label: "Sky Temple", color: "#e6c988" },
  previewImage: "/template-previews/skytemple.jpg",
  defaults: {
    invitationMessage:
      "Above the world we knew, we found a room the sky agreed to hold for us. Come stand in it while we make our promise.",
    tagline: "A wedding among the gods.",
    accentColor: "#e6c988",
    heroImage: "/samples/indian-mandap.jpg",
    aboutStory:
      "Doors of marble opening onto cloud, a bridge of light between the two of us, and a small orchestra somewhere behind the sun. This is the day the sky lends us its temples.",
  },
};

// ─── Wedding: Ocean Palace ───────────────────────────────────
export const oceanpalaceMeta: TemplateMeta = {
  id: "oceanpalace",
  name: "Ocean Palace",
  codename: "Ocean Palace",
  description:
    "A palace beneath the sea — rays of sun through crystal water, pearls rising, coral gardens, photos inside luminous bubbles. For weddings that want to feel weightless and magical.",
  eventTypes: ["wedding", "engagement", "anniversary"],
  tags: ["luxurious", "elegant", "romantic", "artistic", "cinematic", "premium"],
  keywords: [
    "underwater wedding", "ocean wedding", "beach wedding", "sea wedding",
    "pearl wedding", "coral", "aquamarine", "atlantis", "mermaid",
    "island wedding", "destination wedding",
  ],
  icon: "🐚",
  vibe: { label: "Ocean Palace", color: "#4fb0c6" },
  previewImage: "/template-previews/oceanpalace.jpg",
  defaults: {
    invitationMessage:
      "Somewhere between the surface and the deep, the light writes its own kind of vow. Come see it with us.",
    tagline: "Two tides, one shore.",
    accentColor: "#4fb0c6",
    heroImage:
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "A palace nobody built and everyone can feel. The room hums like a shell. Every promise arrives on a slow current.",
  },
};

// ─── Wedding: Celestial Symphony ─────────────────────────────
export const symphonyMeta: TemplateMeta = {
  id: "symphony",
  name: "Celestial Symphony",
  codename: "Symphony",
  description:
    "The wedding as a piece of music — constellations pulse to orchestral rhythm, notes become stars, the story unfolds in movements. For couples whose love has a score.",
  eventTypes: ["wedding", "anniversary"],
  tags: ["cinematic", "artistic", "romantic", "celestial", "editorial", "luxurious"],
  keywords: [
    "symphony wedding", "musical wedding", "orchestra", "opera wedding",
    "concert wedding", "composer", "instrumental", "artistic wedding",
    "score", "movements", "notes",
  ],
  icon: "🎼",
  vibe: { label: "Symphony", color: "#b48eff" },
  previewImage: "/template-previews/symphony.jpg",
  defaults: {
    invitationMessage:
      "Every love has a score. Ours has been rehearsing since the day we met. Come hear the first performance.",
    tagline: "In four movements.",
    accentColor: "#b48eff",
    heroImage: "/samples/lotus-decor.jpg",
    aboutStory:
      "Movement I — the meeting. Movement II — the long slow verse. Movement III — the crescendo. Movement IV — you, walking down the aisle, all instruments held on the same note.",
  },
};

// ─── Engagement: Infinity Rings ──────────────────────────────
export const infinityMeta: TemplateMeta = {
  id: "infinity",
  name: "Infinity Rings",
  codename: "Infinity",
  description:
    "Two glowing rings crossing universes, closing in on each other as the page scrolls, meeting in a single infinite ring. A cinematic engagement announcement.",
  eventTypes: ["engagement", "anniversary", "wedding"],
  tags: ["luxurious", "romantic", "cinematic", "modern", "editorial", "premium"],
  keywords: [
    "engagement", "ring ceremony", "roka", "infinity", "eternal ring",
    "engagement announcement", "commitment", "propose", "she said yes",
    "we're engaged", "vow",
  ],
  icon: "∞",
  vibe: { label: "Infinity", color: "#d4a574" },
  previewImage: "/template-previews/infinity.jpg",
  defaults: {
    invitationMessage:
      "Two paths, drawn separately for a long time, closing into one line. We're calling that a promise. Come sign your name to it.",
    tagline: "One line, forever.",
    accentColor: "#d4a574",
    heroImage:
      "https://images.unsplash.com/photo-1525258946800-98cfd641d0de?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "A ring is a circle that keeps its own promise — no start, no end, only more of itself. So is this.",
  },
};

// ─── Engagement: Love Constellation ──────────────────────────
export const lovestarsMeta: TemplateMeta = {
  id: "lovestars",
  name: "Love Constellation",
  codename: "Lovestars",
  description:
    "Memories drawn as stars that connect into a constellation as you scroll — the moment of the proposal becomes an exploding galaxy. Two destinies written in the sky.",
  eventTypes: ["engagement", "anniversary", "wedding"],
  tags: ["celestial", "romantic", "cinematic", "artistic", "interactive", "modern"],
  keywords: [
    "engagement", "astronomy", "constellation", "stars", "galaxy",
    "cosmic engagement", "space engagement", "we're engaged", "destinies",
    "written in stars", "zodiac",
  ],
  icon: "✨",
  vibe: { label: "Lovestars", color: "#8ea9ff" },
  previewImage: "/template-previews/lovestars.jpg",
  defaults: {
    invitationMessage:
      "Somewhere between two accidents, a pattern showed up. We've been staring at it for years. Come see it named out loud.",
    tagline: "Two destinies, one line.",
    accentColor: "#8ea9ff",
    heroImage:
      "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "Every memory that mattered turned out to be a star. Only now, standing far enough back, we can see the shape they were making all along.",
  },
};

// ─── Engagement: Secret Garden ───────────────────────────────
export const gardenMeta: TemplateMeta = {
  id: "garden",
  name: "Secret Garden",
  codename: "Garden",
  description:
    "A magical botanical garden — flowers bloom as you scroll, butterflies reveal photos, glass greenhouses hold memories. An intimate, naturally romantic engagement.",
  eventTypes: ["engagement", "wedding", "anniversary"],
  tags: ["romantic", "botanical", "pastel", "elegant", "artistic", "whimsical"],
  keywords: [
    "garden engagement", "botanical", "flowers", "greenhouse", "florals",
    "secret garden", "spring engagement", "romantic garden", "outdoor engagement",
    "butterfly", "conservatory",
  ],
  icon: "🌿",
  vibe: { label: "Secret Garden", color: "#88b06a" },
  previewImage: "/template-previews/garden.jpg",
  defaults: {
    invitationMessage:
      "There's a garden we've been growing for a long time without noticing. Today it flowers. Come stand in it with us.",
    tagline: "Something quiet is blooming.",
    accentColor: "#88b06a",
    heroImage:
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "The garden was here first. It knew before we did. Butterflies drift over the memories, and every flower has a footnote nobody planted.",
  },
};

// ─── Engagement: Golden Horizon ──────────────────────────────
export const horizonMeta: TemplateMeta = {
  id: "horizon",
  name: "Golden Horizon",
  codename: "Horizon",
  description:
    "Endless sunset — warm golden hour drifts into twilight as you scroll, clouds pink and orange, silhouettes on calm water. Warm, peaceful, deeply romantic.",
  eventTypes: ["engagement", "anniversary", "wedding"],
  tags: ["romantic", "elegant", "pastel", "cinematic", "editorial", "appealing"],
  keywords: [
    "sunset engagement", "golden hour", "beach engagement", "twilight",
    "warm engagement", "silhouette engagement", "horizon", "coastal",
    "peaceful engagement", "romantic sunset",
  ],
  icon: "🌇",
  vibe: { label: "Golden Horizon", color: "#e8a86a" },
  previewImage: "/template-previews/horizon.jpg",
  defaults: {
    invitationMessage:
      "Between the last light of day and the first quiet of night, we asked one question — and the answer became a life. Come stand at that edge with us.",
    tagline: "Between two lights.",
    accentColor: "#e8a86a",
    heroImage:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "Every sunset is a small conclusion the sky lets us watch. This one felt like a promise we couldn't stop looking at.",
  },
};

// ─── Birthday: Toy Universe ──────────────────────────────────
export const toyboxMeta: TemplateMeta = {
  id: "toybox",
  name: "Toy Universe",
  codename: "Toybox",
  description:
    "A gigantic toy universe — blocks are buildings, trains run between sections, balloons carry memories. Playful animation and joyful chaos for a kid's birthday.",
  eventTypes: ["birthday"],
  tags: ["playful", "vibrant", "whimsical", "festive", "cool", "bold"],
  keywords: [
    "kids birthday", "toy party", "lego", "playroom", "block party",
    "toddler birthday", "first birthday", "2nd birthday", "3rd birthday",
    "child birthday", "playful",
  ],
  icon: "🧸",
  vibe: { label: "Toybox", color: "#ff9f4a" },
  previewImage: "/template-previews/toybox.jpg",
  defaults: {
    invitationMessage:
      "Blocks, trains, balloons, cake and one very important small human. Come play in the tiny universe we're building for a day.",
    tagline: "A whole city for one day.",
    accentColor: "#ff9f4a",
    heroImage:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "A city made of blocks. Trains that go where their engineers point. And one birthday that everyone else in the toybox is celebrating.",
  },
};

// ─── Birthday: Time Machine ──────────────────────────────────
export const timemachineMeta: TemplateMeta = {
  id: "timemachine",
  name: "Time Machine",
  codename: "Time Machine",
  description:
    "Scrolling travels through years — childhood, teens, adulthood — photos fly out of floating clocks, memories become pages of a giant mechanical calendar. For milestone birthdays.",
  eventTypes: ["birthday", "anniversary"],
  tags: ["editorial", "cinematic", "playful", "artistic", "modern", "traditional"],
  keywords: [
    "milestone birthday", "30th birthday", "40th birthday", "50th birthday",
    "60th birthday", "retirement", "life journey", "years of", "vintage",
    "throwback", "life story", "big birthday",
  ],
  icon: "⏳",
  vibe: { label: "Time Machine", color: "#a67b3c" },
  previewImage: "/template-previews/timemachine.jpg",
  defaults: {
    invitationMessage:
      "A whole life, worth toasting. Come walk through the years with us — the awkward ones included.",
    tagline: "Every year, a chapter.",
    accentColor: "#a67b3c",
    heroImage:
      "https://images.unsplash.com/photo-1494203484021-3c454daf695d?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "A calendar the size of a room. Clocks that only run forward when you scroll. Everything that's happened, waiting on the right page.",
  },
};

// ─── Birthday: Neon Carnival ─────────────────────────────────
export const carnivalMeta: TemplateMeta = {
  id: "carnival",
  name: "Neon Carnival",
  codename: "Carnival",
  description:
    "A futuristic carnival — ferris wheels rotate behind headings, fireworks react to scroll, arcade games become gallery sections. Energetic, exciting, unforgettable.",
  eventTypes: ["birthday", "party"],
  tags: ["vibrant", "neon", "playful", "festive", "bold", "modern"],
  keywords: [
    "carnival birthday", "fair", "ferris wheel", "arcade birthday",
    "neon party", "sweet sixteen", "18th birthday", "21st birthday",
    "big birthday", "photo booth", "fireworks",
  ],
  icon: "🎡",
  vibe: { label: "Carnival", color: "#ff4dd2" },
  previewImage: "/template-previews/carnival.jpg",
  defaults: {
    invitationMessage:
      "The rides are running, the popcorn is warm and the fireworks are on standby. Bring cash for the games and nothing to prove.",
    tagline: "The lights are on for you.",
    accentColor: "#ff4dd2",
    heroImage:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "A ferris wheel turning above the neon. Booths with prizes nobody needs. Fireworks the sky agreed to spend on one person tonight.",
  },
};

// ─── Birthday: Dream Factory ─────────────────────────────────
export const dreamfactoryMeta: TemplateMeta = {
  id: "dreamfactory",
  name: "Dream Factory",
  codename: "Dream Factory",
  description:
    "An imagination factory — conveyor belts making balloons, robots delivering memories, gears powering every scroll. Creative, playful and surprisingly futuristic.",
  eventTypes: ["birthday"],
  tags: ["playful", "modern", "whimsical", "vibrant", "artistic", "interactive"],
  keywords: [
    "birthday factory", "machine birthday", "robots", "steampunk birthday",
    "invention", "creator birthday", "maker", "imagination", "confetti factory",
    "gears", "workshop",
  ],
  icon: "⚙",
  vibe: { label: "Dream Factory", color: "#f77c3c" },
  previewImage: "/template-previews/dreamfactory.jpg",
  defaults: {
    invitationMessage:
      "The factory ran overtime this week — balloons, cake and one very custom-built birthday, packed and ready. Come pick yours up.",
    tagline: "Assembly required.",
    accentColor: "#f77c3c",
    heroImage:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "Conveyor belts humming, robots making executive decisions about frosting, and every gear turning toward the same happy shipment.",
  },
};

// ─── Anniversary: Eternal Library ────────────────────────────
export const libraryMeta: TemplateMeta = {
  id: "library",
  name: "Eternal Library",
  codename: "Library",
  description:
    "An infinite library — each year of marriage is an illuminated book, letters become butterflies, grand staircases connect chapters. The greatest love story ever written.",
  eventTypes: ["anniversary", "wedding"],
  tags: ["editorial", "elegant", "traditional", "romantic", "artistic", "premium"],
  keywords: [
    "anniversary library", "book anniversary", "years together", "silver",
    "golden anniversary", "vow renewal", "memoir", "chronicle",
    "letter anniversary", "literary anniversary", "hardcover",
  ],
  icon: "📚",
  vibe: { label: "Eternal Library", color: "#7c5a2e" },
  previewImage: "/template-previews/library.jpg",
  defaults: {
    invitationMessage:
      "Twenty-something books, one shelf, one very long argument about whose fault the good years were. Come read a few chapters with us.",
    tagline: "Volume the next.",
    accentColor: "#7c5a2e",
    heroImage: "/samples/wedding-shoes.jpg",
    aboutStory:
      "Books lined up like the years that made them. Butterflies escaping the letters. A staircase to the next chapter that only opens when both of us walk on it.",
  },
};

// ─── Corporate: Quantum City ─────────────────────────────────
export const quantumMeta: TemplateMeta = {
  id: "quantum",
  name: "Quantum City",
  codename: "Quantum",
  description:
    "A smart-city conference — buildings visualize tracks, speakers appear as holographic skyscrapers, data streams flow through transparent roads. For the biggest tech conferences.",
  eventTypes: ["corporate", "product-launch"],
  tags: ["tech", "premium", "modern", "architectural", "cyberpunk", "interactive"],
  keywords: [
    "quantum computing", "tech conference", "developer conference",
    "smart city", "future of tech", "hackathon", "innovation summit",
    "keynote", "world tech conference", "flagship",
  ],
  icon: "🏙",
  vibe: { label: "Quantum City", color: "#3ea6ff" },
  previewImage: "/template-previews/quantum.jpg",
  defaults: {
    invitationMessage:
      "One week. Every track a district. Every speaker a landmark. Come navigate the future with us.",
    tagline: "The city, indexed.",
    accentColor: "#3ea6ff",
    heroImage:
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "A smart city as a conference map. Every session is an address. Every network cable is a road. Every idea, a building somebody is standing under.",
  },
};

// ─── Product Launch: Genesis ─────────────────────────────────
export const genesisMeta: TemplateMeta = {
  id: "genesis",
  name: "Genesis",
  codename: "Genesis",
  description:
    "The product assembling itself in real time — raw particles becoming components, each scroll adding a layer, cinematic suspense to the final reveal. Rivals the best product keynotes.",
  eventTypes: ["product-launch", "corporate"],
  tags: ["cinematic", "tech", "bold", "premium", "modern", "interactive"],
  keywords: [
    "product launch", "keynote", "reveal", "flagship launch", "hardware launch",
    "unveiling", "genesis", "product story", "manufacturing", "assembly",
    "cinematic launch",
  ],
  icon: "◯",
  vibe: { label: "Genesis", color: "#ff5147" },
  previewImage: "/template-previews/genesis.jpg",
  defaults: {
    invitationMessage:
      "You will see it built in front of you. Particle by particle. Layer by layer. Until the moment we can't hide it any more.",
    tagline: "Watch it come together.",
    accentColor: "#ff5147",
    heroImage:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "Every prototype we ever threw away. Every meeting that ran long. Every quiet decision to remove one more thing. All of it walked us to the object you'll meet on stage.",
  },
};

// ─── Award Ceremony: Hall of Immortals ───────────────────────
export const immortalsMeta: TemplateMeta = {
  id: "immortals",
  name: "Hall of Immortals",
  codename: "Immortals",
  description:
    "A hall for legendary achievements — golden pillars on reflective floors, spotlights following winners, monumentally scaled award cards. Sky filled with golden stars for the finale.",
  eventTypes: ["award-ceremony", "corporate"],
  tags: ["premium", "luxurious", "cinematic", "traditional", "artistic", "elegant"],
  keywords: [
    "hall of fame", "lifetime achievement", "immortals", "legends",
    "industry awards", "founders awards", "legacy", "grand awards",
    "sports hall", "science awards", "arts awards", "honours",
  ],
  icon: "🏛",
  vibe: { label: "Immortals", color: "#e5c26a" },
  previewImage: "/template-previews/immortals.jpg",
  defaults: {
    invitationMessage:
      "A room built to remember. Tonight we add another set of names to a list nobody will forget.",
    tagline: "Where names stay.",
    accentColor: "#e5c26a",
    heroImage:
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "Golden pillars, reflective floors, one spotlight per soul. Above it all a sky of golden stars, each one a story that decided to keep going.",
  },
};

// ─── Networking: Digital Ecosystem ───────────────────────────
export const ecosystemMeta: TemplateMeta = {
  id: "ecosystem",
  name: "Digital Ecosystem",
  codename: "Ecosystem",
  description:
    "Every attendee is a living digital organism — profiles grow and connect, communities form forests of nodes, relationship paths animate organically. A living ecosystem of innovation.",
  eventTypes: ["networking-event", "corporate"],
  tags: ["organic", "modern", "tech", "interactive", "artistic", "cool"],
  keywords: [
    "networking", "community", "ecosystem", "organic network", "living network",
    "communities of practice", "salon", "meetup", "founders community",
    "operator community", "collective",
  ],
  icon: "🕸",
  vibe: { label: "Ecosystem", color: "#4bc27a" },
  previewImage: "/template-previews/ecosystem.jpg",
  defaults: {
    invitationMessage:
      "A community is not a list. It's a shape that changes shape when the right people are in the room. Tonight the room is you.",
    tagline: "A room that grows.",
    accentColor: "#4bc27a",
    heroImage:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "Every person a node. Every conversation a new edge. The network isn't built when we walk in — it's built while we're here.",
  },
};

// ─── Party: Infinity Club ────────────────────────────────────
export const infinityclubMeta: TemplateMeta = {
  id: "infinityclub",
  name: "Infinity Club",
  codename: "Infinity Club",
  description:
    "An endless megaclub — multiple arenas linked by glowing tunnels, LED walls reacting to scroll, laser architecture, gallery as digital billboards. The most futuristic night in the city.",
  eventTypes: ["party", "birthday"],
  tags: ["neon", "cyberpunk", "vibrant", "bold", "playful", "festive", "modern"],
  keywords: [
    "megaclub", "warehouse party", "afterparty", "rave", "nightlife",
    "club night", "laser show", "led wall", "electronic party",
    "underground", "boiler room", "infinity",
  ],
  icon: "♾",
  vibe: { label: "Infinity Club", color: "#00e5ff" },
  previewImage: "/template-previews/infinityclub.jpg",
  defaults: {
    invitationMessage:
      "One club, several rooms, no end. Take the elevator, the corridor, the wrong turn — every route ends at the same night.",
    tagline: "Every room leads here.",
    accentColor: "#00e5ff",
    heroImage:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "Tunnels of light joining rooms that shouldn't fit in one building. LED walls that answer when you look at them. The kind of night that quietly forgets to end.",
  },
};

export const convergeMeta: TemplateMeta = {
  id: "converge",
  name: "Warm Networking",
  codename: "Converge",
  description:
    "Organic and warm — amber blobs, floating dots that pulse like a neural network. For meetups and networking events that shouldn't feel corporate.",
  eventTypes: ["networking-event", "corporate"],
  tags: ["organic", "artistic", "modern", "appealing", "cool", "playful"],
  keywords: [
    "networking", "meetup", "warm", "organic", "friendly", "community",
    "small event", "professional", "founders", "workshop", "salon",
    "startup meetup", "coffee chat", "roundtable", "conference dinner",
  ],
  icon: "🌀",
  vibe: { label: "Organic", color: "#f5a623" },
  previewImage: "/template-previews/converge.jpg",
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

// ─── Wedding: Floating Kingdom ───────────────────────────────
export const skyrealmMeta: TemplateMeta = {
  id: "skyrealm",
  name: "Floating Kingdom",
  codename: "Skyrealm",
  description:
    "Floating marble islands joined by bridges, clouds drifting beneath, golden birds crossing the sky — for weddings that want a grand fantasy setting above the world.",
  eventTypes: ["wedding", "engagement"],
  tags: ["celestial", "luxurious", "cinematic", "elegant", "romantic", "premium"],
  keywords: [
    "floating islands", "sky kingdom", "fantasy wedding", "cloud wedding",
    "marble bridges", "golden birds", "heavenly wedding", "epic wedding",
    "sky blue", "destination wedding", "fairy tale", "kingdom in the sky",
  ],
  icon: "🕊",
  vibe: { label: "Floating Kingdom", color: "#7ab8e8" },
  previewImage: "/template-previews/skyrealm.jpg",
  defaults: {
    invitationMessage:
      "We found a place above the clouds where two islands meet by one bridge. Come cross it with us.",
    tagline: "Above the world, together.",
    accentColor: "#7ab8e8",
    heroImage:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "Two islands drifted for years on separate winds. Then a bridge of white marble appeared, and the golden birds began circling as if they knew.",
  },
};

// ─── Wedding: Starlight Cathedral ────────────────────────────
export const cathedralMeta: TemplateMeta = {
  id: "cathedral",
  name: "Starlight Cathedral",
  codename: "Cathedral of Stars",
  description:
    "A cathedral built entirely of constellations — galaxy ceiling, photos glowing like stained glass. For night weddings and anniversaries that want sacred, cosmic scale.",
  eventTypes: ["wedding", "anniversary"],
  tags: ["celestial", "cinematic", "luxurious", "elegant", "romantic", "artistic"],
  keywords: [
    "cathedral wedding", "starlight", "constellation", "galaxy ceiling",
    "stained glass", "night wedding", "sacred", "church wedding",
    "cosmic wedding", "midnight ceremony", "stars", "celestial vows",
  ],
  icon: "⛪",
  vibe: { label: "Starlight", color: "#4a5fc1" },
  previewImage: "/template-previews/cathedral.jpg",
  defaults: {
    invitationMessage:
      "We are building a cathedral out of the stars we met under. Come sit in the front pew of the sky.",
    tagline: "Vows under a galaxy ceiling.",
    accentColor: "#4a5fc1",
    heroImage: "/samples/mandap-flowers.jpg",
    aboutStory:
      "Every window in this cathedral is a memory lit from behind. The ceiling is the night we first named the constellations wrong, on purpose.",
  },
};

// ─── Wedding: Sakura Dreams ──────────────────────────────────
export const sakuraMeta: TemplateMeta = {
  id: "sakura",
  name: "Sakura Dreams",
  codename: "Sakura",
  description:
    "An endless cherry-blossom forest — drifting petals, floating lanterns, seasons turning as you scroll. For weddings and engagements that want soft Japanese-spring romance.",
  eventTypes: ["wedding", "engagement"],
  tags: ["romantic", "pastel", "botanical", "elegant", "whimsical", "appealing"],
  keywords: [
    "cherry blossom", "sakura", "japanese wedding", "spring wedding",
    "petals", "blossom forest", "lanterns", "pink wedding", "garden wedding",
    "hanami", "blush", "soft romance", "outdoor wedding",
  ],
  icon: "🌸",
  vibe: { label: "Sakura", color: "#e88aa8" },
  previewImage: "/template-previews/sakura.jpg",
  defaults: {
    invitationMessage:
      "The blossoms only stay a few weeks each year — so we chose them to hold our forever. Come walk the petal path with us.",
    tagline: "A season made to stay.",
    accentColor: "#e88aa8",
    heroImage: "/samples/mehndi-detail.jpg",
    aboutStory:
      "We met when the trees were bare and stayed until they flowered. Every spring since has felt like the forest applauding.",
  },
};

// ─── Wedding: Royal Versailles ───────────────────────────────
export const versaillesMeta: TemplateMeta = {
  id: "versailles",
  name: "Royal Versailles",
  codename: "Versailles",
  description:
    "A tour through palace rooms — grand staircases, chandeliers, golden mirrors, royal gardens. For weddings and anniversaries that want full European-palace opulence.",
  eventTypes: ["wedding", "anniversary"],
  tags: ["royal", "luxurious", "traditional", "elegant", "premium", "appealing"],
  keywords: [
    "palace wedding", "versailles", "french wedding", "chandelier",
    "golden mirrors", "baroque", "grand staircase", "royal garden",
    "opulent", "regal", "european wedding", "castle", "ballroom wedding",
  ],
  icon: "🪞",
  vibe: { label: "Palace Royal", color: "#c9a13b" },
  previewImage: "/template-previews/versailles.jpg",
  defaults: {
    invitationMessage:
      "The palace doors are open, the chandeliers are lit, and one seat in the hall of mirrors has your name on it.",
    tagline: "A palace for one evening.",
    accentColor: "#c9a13b",
    heroImage: "/samples/wedding-cake.jpg",
    aboutStory:
      "Room by gilded room, our story walks ahead of us — up the staircase, past the mirrors, out into a garden that has been waiting three hundred years for this dance.",
  },
};

// ─── Wedding: Renaissance Painting ───────────────────────────
export const frescoMeta: TemplateMeta = {
  id: "fresco",
  name: "Renaissance Painting",
  codename: "Fresco",
  description:
    "The whole site is a living Renaissance painting — brush-stroke reveals, floating golden frames, a museum-gallery walk. For couples who want their day treated as art.",
  eventTypes: ["wedding", "anniversary"],
  tags: ["artistic", "traditional", "elegant", "romantic", "editorial", "luxurious"],
  keywords: [
    "renaissance", "painting wedding", "art wedding", "museum wedding",
    "fresco", "oil paint", "golden frames", "gallery", "classical",
    "italian wedding", "baroque art", "masterpiece", "brush stroke",
  ],
  icon: "🎨",
  vibe: { label: "Renaissance", color: "#b0722f" },
  previewImage: "/template-previews/fresco.jpg",
  defaults: {
    invitationMessage:
      "Some loves get painted; ours insisted on it. Come stand inside the frame with us for one afternoon.",
    tagline: "A love, painted.",
    accentColor: "#b0722f",
    heroImage: "/samples/mehndi-detail.jpg",
    aboutStory:
      "The first brush stroke was a glance across a crowded room. Every year since has added another layer of gold leaf.",
  },
};

// ─── Wedding: Desert Mirage ──────────────────────────────────
export const mirageMeta: TemplateMeta = {
  id: "mirage",
  name: "Desert Mirage",
  codename: "Mirage",
  description:
    "Arabian luxury — golden dunes, shimmering mirage transitions, fire bowls and geometric patterns. For weddings and engagements with warm desert-night drama.",
  eventTypes: ["wedding", "engagement"],
  tags: ["luxurious", "cinematic", "romantic", "traditional", "bold", "elegant"],
  keywords: [
    "desert wedding", "arabian nights", "dunes", "mirage", "fire bowls",
    "moroccan", "middle eastern wedding", "gold", "terracotta",
    "geometric patterns", "oasis", "nikah", "destination wedding", "sunset dunes",
  ],
  icon: "🏜",
  vibe: { label: "Desert Luxe", color: "#d19a4f" },
  previewImage: "/template-previews/mirage.jpg",
  defaults: {
    invitationMessage:
      "At the edge of the dunes, where the heat turns light into water, we found something real. Come toast it by firelight.",
    tagline: "Real as the desert night.",
    accentColor: "#d19a4f",
    heroImage:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "Everyone said it was a mirage. We walked toward it anyway — and it turned out to be an oasis with room for everyone we love.",
  },
};

// ─── Wedding: Nordic Ice Palace ──────────────────────────────
export const icepalaceMeta: TemplateMeta = {
  id: "icepalace",
  name: "Nordic Ice Palace",
  codename: "Ice Palace",
  description:
    "A palace carved from glowing ice — aurora lighting, drifting snow, frozen-lake reflections. For winter weddings and engagements that want crystalline Nordic magic.",
  eventTypes: ["wedding", "engagement"],
  tags: ["celestial", "elegant", "cinematic", "luxurious", "glass", "cool"],
  keywords: [
    "winter wedding", "ice palace", "nordic", "aurora", "northern lights",
    "snow wedding", "frozen lake", "scandinavian", "crystal", "december wedding",
    "ice blue", "arctic", "snowflake",
  ],
  icon: "❄",
  vibe: { label: "Ice Palace", color: "#8fd4e8" },
  previewImage: "/template-previews/icepalace.jpg",
  defaults: {
    invitationMessage:
      "In a palace of ice under a green-lit sky, we're making the warmest promise of our lives. Bring your coat and your best toast.",
    tagline: "Warmth, kept in ice.",
    accentColor: "#8fd4e8",
    // An elegant tiered wedding cake in a candlelit ballroom — a clear, premium
    // wedding scene in place of the old abstract winter shot.
    heroImage: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "The lake froze the winter we met, and we walked on it anyway. Some things hold when you trust them.",
  },
};

// ─── Wedding: Galaxy Opera ───────────────────────────────────
export const galaxyoperaMeta: TemplateMeta = {
  id: "galaxyopera",
  name: "Galaxy Opera",
  codename: "Opera Celeste",
  description:
    "An opera house drifting through space — velvet curtains revealing galaxies, chandeliers made of planets. For weddings and award nights that want cosmic theatrical grandeur.",
  eventTypes: ["wedding", "award-ceremony"],
  tags: ["cinematic", "celestial", "luxurious", "artistic", "bold", "premium"],
  keywords: [
    "opera wedding", "galaxy", "theatrical wedding", "velvet curtains",
    "cosmic", "grand wedding", "space opera", "planet chandelier",
    "dramatic wedding", "stage", "crimson and gold", "awards night", "gala",
  ],
  icon: "🎻",
  vibe: { label: "Galaxy Opera", color: "#8b5cf6" },
  previewImage: "/template-previews/galaxyopera.jpg",
  defaults: {
    invitationMessage:
      "The curtain rises on the one performance we've rehearsed our whole lives. Your seat is in the front row of the universe.",
    tagline: "The curtain rises tonight.",
    accentColor: "#8b5cf6",
    heroImage:
      "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "Act one was a chance meeting. Act two, a long duet. Tonight the orchestra of planets tunes up for the finale that is really a beginning.",
  },
};

// ─── Engagement: Two Rivers ──────────────────────────────────
export const tworiversMeta: TemplateMeta = {
  id: "tworivers",
  name: "Two Rivers",
  codename: "Confluence",
  description:
    "Two rivers flow separately down the page and merge into one ocean as you scroll, lotus flowers drifting on the current. A gentle metaphor for engagements and anniversaries.",
  eventTypes: ["engagement", "anniversary", "wedding"],
  tags: ["romantic", "organic", "artistic", "elegant", "cinematic", "appealing"],
  keywords: [
    "two rivers", "confluence", "engagement", "lotus", "river",
    "merging", "ocean", "nature engagement", "teal", "sangam",
    "journey together", "flowing", "anniversary",
  ],
  icon: "🌊",
  vibe: { label: "Confluence", color: "#3f9e9b" },
  previewImage: "/template-previews/tworivers.jpg",
  defaults: {
    invitationMessage:
      "Two rivers ran a long way alone before they found the same sea. Come stand on the shore the day they meet.",
    tagline: "Two currents, one sea.",
    accentColor: "#3f9e9b",
    heroImage:
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "One of us started in the mountains, one in the plains. The map never planned a confluence — the water found it anyway.",
  },
};

// ─── Engagement: Mirror Worlds ───────────────────────────────
export const mirrorworldsMeta: TemplateMeta = {
  id: "mirrorworlds",
  name: "Mirror Worlds",
  codename: "Symmetry",
  description:
    "The page is split vertically into two distinct worlds that merge into perfect symmetry as you scroll. For engagements and weddings of two very different people who fit.",
  eventTypes: ["engagement", "wedding"],
  tags: ["modern", "editorial", "artistic", "romantic", "minimal", "cinematic"],
  keywords: [
    "split screen", "symmetry", "mirror", "two worlds", "opposites attract",
    "engagement", "modern engagement", "design forward", "his and hers",
    "two stories", "converging", "duality",
  ],
  icon: "◫",
  vibe: { label: "Symmetry", color: "#8a93a5" },
  previewImage: "/template-previews/mirrorworlds.jpg",
  defaults: {
    invitationMessage:
      "We lived in two different worlds that turned out to be reflections. Come watch them line up.",
    tagline: "Two halves, one frame.",
    accentColor: "#8a93a5",
    heroImage:
      "https://images.unsplash.com/photo-1525258946800-98cfd641d0de?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "One of us likes mornings, one likes midnight. Somehow the days meet exactly in the middle, every single time.",
  },
};

// ─── Engagement: Infinity Train ──────────────────────────────
export const infinitytrainMeta: TemplateMeta = {
  id: "infinitytrain",
  name: "Infinity Train",
  codename: "The Grand Line",
  description:
    "A luxury train travelling through memories — each coach a chapter, windows showing changing landscapes. For engagements and anniversaries told as a journey.",
  eventTypes: ["engagement", "anniversary", "wedding"],
  tags: ["cinematic", "luxurious", "romantic", "traditional", "artistic", "premium"],
  keywords: [
    "train journey", "orient express", "luxury train", "vintage travel",
    "engagement journey", "memories", "coaches", "brass", "anniversary trip",
    "railway", "grand tour", "chapters", "voyage",
  ],
  icon: "🚂",
  vibe: { label: "Grand Line", color: "#b08d3f" },
  previewImage: "/template-previews/infinitytrain.jpg",
  defaults: {
    invitationMessage:
      "Our train leaves from the platform where we first met and doesn't stop until forever. Your ticket is attached.",
    tagline: "All aboard, no last stop.",
    accentColor: "#b08d3f",
    heroImage: "/samples/wedding-shoes.jpg",
    aboutStory:
      "Coach one holds the first hello. Coach two, the long slow years. Keep walking toward the lamp-lit dining car — that's where we are now.",
  },
};

// ─── Engagement: Dream Lanterns ──────────────────────────────
export const lanternsMeta: TemplateMeta = {
  id: "lanterns",
  name: "Dream Lanterns",
  codename: "Lanterns",
  description:
    "Thousands of floating lanterns carry memories over a still lake on a warm cinematic night. For engagements and weddings that want quiet, glowing wonder.",
  eventTypes: ["engagement", "wedding"],
  tags: ["romantic", "cinematic", "whimsical", "elegant", "appealing", "festive"],
  keywords: [
    "floating lanterns", "sky lanterns", "lake", "night engagement",
    "lantern festival", "warm night", "diya", "candlelight", "wish lanterns",
    "romantic night", "tangled", "glow", "reflection",
  ],
  icon: "🏮",
  vibe: { label: "Lantern Night", color: "#e8a545" },
  previewImage: "/template-previews/lanterns.jpg",
  defaults: {
    invitationMessage:
      "We're sending a thousand lanterns up with one wish inside each of them — and the wish is the same in every one. Come light yours with us.",
    tagline: "One wish, a thousand lights.",
    accentColor: "#e8a545",
    heroImage: "/samples/diya-lamps.jpg",
    aboutStory:
      "Every memory we've made is warm enough to fly. Tonight we let them all go at once and watch the lake double the sky.",
  },
};

// ─── Engagement: Glass Rose ──────────────────────────────────
export const glassroseMeta: TemplateMeta = {
  id: "glassrose",
  name: "Glass Rose",
  codename: "Rosaline",
  description:
    "The entire site lives inside a giant crystal rose — petals become sections and the flower blooms open as you scroll. For engagements and anniversaries with delicate drama.",
  eventTypes: ["engagement", "anniversary", "wedding"],
  tags: ["glass", "romantic", "elegant", "artistic", "luxurious", "pastel"],
  keywords: [
    "crystal rose", "glass flower", "blooming", "rose engagement",
    "petals", "delicate", "blush", "beauty and the beast", "enchanted rose",
    "romantic engagement", "crystalline", "flower",
  ],
  icon: "🌹",
  vibe: { label: "Crystal Rose", color: "#d66a8a" },
  previewImage: "/template-previews/glassrose.jpg",
  defaults: {
    invitationMessage:
      "Some flowers wilt; we grew one out of glass instead. Come watch it open, one petal at a time.",
    tagline: "A rose that keeps.",
    accentColor: "#d66a8a",
    heroImage: "/samples/rings-roses.jpg",
    aboutStory:
      "Petal by petal we built something transparent enough to see all the way through, and strong enough to keep the light inside.",
  },
};

// ─── Engagement: Secret Galaxy ───────────────────────────────
export const secretgalaxyMeta: TemplateMeta = {
  id: "secretgalaxy",
  name: "Secret Galaxy",
  codename: "Andromeda",
  description:
    "A hidden galaxy discovered by two people — stars form rings, constellations write your names across deep violet space. For engagements that feel like a private universe.",
  eventTypes: ["engagement", "wedding"],
  tags: ["celestial", "romantic", "cinematic", "interactive", "artistic", "cool"],
  keywords: [
    "galaxy engagement", "secret", "andromeda", "constellation names",
    "stars", "nebula", "space engagement", "hidden universe", "cosmic rings",
    "violet", "stargazing", "she said yes", "astronomy",
  ],
  icon: "🔭",
  vibe: { label: "Andromeda", color: "#7b5ce8" },
  previewImage: "/template-previews/secretgalaxy.jpg",
  defaults: {
    invitationMessage:
      "We found a galaxy nobody else had named, so we gave it both our names. Come see the coordinates.",
    tagline: "A universe of two.",
    accentColor: "#7b5ce8",
    heroImage: "/samples/lotus-decor.jpg",
    aboutStory:
      "Astronomers say most galaxies go undiscovered. Ours stayed hidden until the night two telescopes pointed at the same patch of sky.",
  },
};

// ─── Birthday: Cartoon Universe ──────────────────────────────
export const cartoonMeta: TemplateMeta = {
  id: "cartoon",
  name: "Cartoon Universe",
  codename: "Toonverse",
  description:
    "A bouncy animated world — squashy clouds, balloon characters, everything moving with cartoon squash-and-stretch. For kids' birthdays that want maximum giggles.",
  eventTypes: ["birthday"],
  tags: ["playful", "whimsical", "vibrant", "festive", "bold", "cool"],
  keywords: [
    "cartoon birthday", "kids birthday", "animated", "pixar", "balloon characters",
    "bouncy", "toddler party", "first birthday", "fun", "clouds",
    "children", "colorful party", "silly",
  ],
  icon: "🎈",
  vibe: { label: "Toonverse", color: "#38b6ff" },
  previewImage: "/template-previews/cartoon.jpg",
  defaults: {
    invitationMessage:
      "The clouds are bouncy, the balloons have faces, and the birthday kid is the main character. Come join the episode.",
    tagline: "Today's episode: the birthday!",
    accentColor: "#38b6ff",
    heroImage:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "In this universe gravity is optional, cake is mandatory, and every friend who walks in gets their own theme song.",
  },
};

// ─── Birthday: Brick City ────────────────────────────────────
export const bricktownMeta: TemplateMeta = {
  id: "bricktown",
  name: "Brick City",
  codename: "Bricktown",
  description:
    "A whole city built from toy bricks — blocks click together as you scroll and photos sit in brick frames. For builder kids' birthdays.",
  eventTypes: ["birthday"],
  tags: ["playful", "vibrant", "whimsical", "bold", "interactive", "festive"],
  keywords: [
    "lego birthday", "brick party", "building blocks", "toy bricks",
    "kids birthday", "builder", "construction party", "block city",
    "5th birthday", "6th birthday", "primary colors", "master builder",
  ],
  icon: "🧱",
  vibe: { label: "Bricktown", color: "#d64545" },
  previewImage: "/template-previews/bricktown.jpg",
  defaults: {
    invitationMessage:
      "We're building a whole city for one birthday — brick by brick, snack by snack. Bring your best builder energy.",
    tagline: "Everything clicks today.",
    accentColor: "#d64545",
    heroImage:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "Every year we add a new floor to the tower. This year's blueprint calls for cake on every level and friends in every window.",
  },
};

// ─── Birthday: Treasure Hunt ─────────────────────────────────
export const treasureMeta: TemplateMeta = {
  id: "treasure",
  name: "Treasure Hunt",
  codename: "El Dorado",
  description:
    "Each section unlocks a new treasure — old maps, jungle ruins, gold coins and hidden surprises. For birthdays and parties that want an adventure to follow.",
  eventTypes: ["birthday", "party"],
  tags: ["playful", "whimsical", "festive", "interactive", "bold", "appealing"],
  keywords: [
    "treasure hunt", "pirate party", "adventure birthday", "map",
    "gold coins", "el dorado", "jungle", "scavenger hunt", "explorer",
    "kids adventure", "hidden treasure", "quest", "ruins",
  ],
  icon: "🗺",
  vibe: { label: "El Dorado", color: "#c9942e" },
  previewImage: "/template-previews/treasure.jpg",
  defaults: {
    invitationMessage:
      "X marks the party. Follow the map, dodge the traps, and the treasure at the end is cake. Probably. Come find out.",
    tagline: "X marks the party.",
    accentColor: "#c9942e",
    heroImage:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "The map is old, the coins are chocolate, and the greatest treasure in the ruins is turning one year braver.",
  },
};

// ─── Birthday: Theme Park ────────────────────────────────────
export const themeparkMeta: TemplateMeta = {
  id: "themepark",
  name: "Theme Park",
  codename: "Wonderland",
  description:
    "A full theme park — rollercoasters, ferris wheels, carnival games and night fireworks. For birthdays and parties that want big-ride energy.",
  eventTypes: ["birthday", "party"],
  tags: ["playful", "festive", "vibrant", "whimsical", "bold", "appealing"],
  keywords: [
    "theme park", "rollercoaster", "ferris wheel", "amusement park",
    "carnival games", "fireworks", "fair", "kids birthday", "fun fair",
    "rides", "cotton candy", "wonderland", "night park",
  ],
  icon: "🎢",
  vibe: { label: "Wonderland", color: "#e0433f" },
  previewImage: "/template-previews/themepark.jpg",
  defaults: {
    invitationMessage:
      "The gates open, the rides are free, and the fireworks are timed to the candles. You must be this excited to enter.",
    tagline: "You must be this fun to ride.",
    accentColor: "#e0433f",
    heroImage:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "One day a year the whole park runs for a single guest of honor — every ride, every game, every burst of light over the ferris wheel.",
  },
};

// ─── Birthday: Candy Factory ─────────────────────────────────
export const candylandMeta: TemplateMeta = {
  id: "candyland",
  name: "Candy Factory",
  codename: "Candyland",
  description:
    "Chocolate rivers, cookie mountains and candy machines with sweet colorful transitions. For kids' birthdays with a serious sweet tooth.",
  eventTypes: ["birthday"],
  tags: ["playful", "whimsical", "vibrant", "pastel", "festive", "appealing"],
  keywords: [
    "candy party", "chocolate factory", "willy wonka", "sweets",
    "kids birthday", "candyland", "dessert party", "cookie", "lollipop",
    "sugar", "mint", "pink party", "sweet sixteen",
  ],
  icon: "🍭",
  vibe: { label: "Candyland", color: "#f06ea9" },
  previewImage: "/template-previews/candyland.jpg",
  defaults: {
    invitationMessage:
      "The chocolate river is flowing and the cookie mountains are fresh out of the oven. Golden ticket attached — don't lose it.",
    tagline: "Sweetness at full production.",
    accentColor: "#f06ea9",
    heroImage:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "The factory makes one thing better than candy: birthdays. Today's batch is extra sweet and comes with sprinkles of everyone we love.",
  },
};

// ─── Birthday: Robot City ────────────────────────────────────
export const robocityMeta: TemplateMeta = {
  id: "robocity",
  name: "Robot City",
  codename: "Robo City",
  description:
    "Cute robots run the whole birthday — mechanical gifts, delivery drones, neon factories humming. For kids who love machines that beep.",
  eventTypes: ["birthday"],
  tags: ["playful", "tech", "modern", "vibrant", "interactive", "cool"],
  keywords: [
    "robot birthday", "robots", "kids tech party", "drones", "machines",
    "neon factory", "science party", "stem birthday", "gears",
    "future kid", "beep boop", "android", "mechanical",
  ],
  icon: "🤖",
  vibe: { label: "Robo City", color: "#ff7a2f" },
  previewImage: "/template-previews/robocity.jpg",
  defaults: {
    invitationMessage:
      "The robots have been programmed with one directive: best birthday ever. Systems are green — we just need you.",
    tagline: "Party protocol: activated.",
    accentColor: "#ff7a2f",
    heroImage:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "In Robo City the drones carry balloons, the factories print confetti, and every machine in town knows exactly whose day it is.",
  },
};

// ─── Birthday: Space Mission ─────────────────────────────────
export const spacemissionMeta: TemplateMeta = {
  id: "spacemission",
  name: "Space Mission",
  codename: "Commander",
  description:
    "The guest becomes commander of the birthday spaceship — planets to visit, a live countdown, and a rocket-launch finale. For kids who dream in rocket fuel.",
  eventTypes: ["birthday"],
  tags: ["playful", "interactive", "cinematic", "bold", "tech", "cool"],
  keywords: [
    "space birthday", "rocket party", "astronaut", "mission control",
    "countdown", "planets", "spaceship", "nasa kids", "launch",
    "kids birthday", "commander", "galaxy party", "solar system",
  ],
  icon: "🚀",
  vibe: { label: "Commander", color: "#ff6a2b" },
  previewImage: "/template-previews/spacemission.jpg",
  defaults: {
    invitationMessage:
      "Commander, your mission: one birthday, several planets, unlimited cake. The countdown has already started — report to the launchpad.",
    tagline: "T-minus one birthday.",
    accentColor: "#ff6a2b",
    heroImage:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "Every mission needs a crew. Ours is made of best friends, grandparents and one very excited commander with frosting on the flight suit.",
  },
};

// ─── Birthday: Jungle Adventure ──────────────────────────────
export const jungleMeta: TemplateMeta = {
  id: "jungle",
  name: "Jungle Adventure",
  codename: "Wildheart",
  description:
    "Ancient temples, waterfalls, vines and wildlife told as an adventure story. For birthdays and parties that want explorer energy.",
  eventTypes: ["birthday", "party"],
  tags: ["playful", "organic", "bold", "whimsical", "festive", "interactive"],
  keywords: [
    "jungle birthday", "safari party", "adventure", "temple", "waterfall",
    "wildlife", "explorer", "animals", "kids birthday", "wild one",
    "tarzan", "vines", "expedition",
  ],
  icon: "🦁",
  vibe: { label: "Wildheart", color: "#2e7d4f" },
  previewImage: "/template-previews/jungle.jpg",
  defaults: {
    invitationMessage:
      "Deep in the jungle, past the waterfall and one very opinionated parrot, a birthday is waiting. Pack your sense of adventure.",
    tagline: "Into the wild we go.",
    accentColor: "#2e7d4f",
    heroImage:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "The temple map says the treasure room is guarded by balloons. The waterfall says lunch is at noon. The jungle has been rehearsing all week.",
  },
};

// ─── Anniversary: Time Capsule ───────────────────────────────
export const timecapsuleMeta: TemplateMeta = {
  id: "timecapsule",
  name: "Time Capsule",
  codename: "The Capsule",
  description:
    "A giant time capsule opens and memories emerge as glowing artifacts on a decade-by-decade journey. For anniversaries built on years of kept things.",
  eventTypes: ["anniversary"],
  tags: ["traditional", "editorial", "romantic", "artistic", "elegant", "decent"],
  keywords: [
    "time capsule", "anniversary", "memories", "decades", "keepsakes",
    "artifacts", "25 years", "50 years", "milestone anniversary",
    "nostalgia", "vintage", "years together", "golden anniversary",
  ],
  icon: "🗝",
  vibe: { label: "The Capsule", color: "#a97e3f" },
  previewImage: "/template-previews/timecapsule.jpg",
  defaults: {
    invitationMessage:
      "Years ago we started keeping the small things. Tonight we open the capsule and let them glow. Come see what we saved.",
    tagline: "Everything we kept, opened.",
    accentColor: "#a97e3f",
    heroImage:
      "https://images.unsplash.com/photo-1494203484021-3c454daf695d?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "A cinema stub, a bad polaroid, a note passed under a door. None of it was valuable — until you stack the decades and realize it was everything.",
  },
};

// ─── Anniversary: Tree of Life ───────────────────────────────
export const treeoflifeMeta: TemplateMeta = {
  id: "treeoflife",
  name: "Tree of Life",
  codename: "Evergreen",
  description:
    "One giant tree — every anniversary a branch, photos hanging as leaves, seasons turning as you scroll. For anniversaries and weddings rooted in family.",
  eventTypes: ["anniversary", "wedding"],
  tags: ["organic", "botanical", "romantic", "traditional", "artistic", "elegant"],
  keywords: [
    "tree of life", "family tree", "anniversary", "branches", "roots",
    "seasons", "nature anniversary", "green", "growth", "leaves",
    "vow renewal", "generations", "evergreen", "garden",
  ],
  icon: "🌳",
  vibe: { label: "Evergreen", color: "#5c8a4a" },
  previewImage: "/template-previews/treeoflife.jpg",
  defaults: {
    invitationMessage:
      "We planted something the day we married, and it has grown a new branch every year since. Come sit under it with us.",
    tagline: "Still growing, together.",
    accentColor: "#5c8a4a",
    heroImage:
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "The roots are the two of us. The branches are the years. The leaves are every face that ever sat at our table — and there's room on the branch for more.",
  },
};

// ─── Anniversary: Endless Clock ──────────────────────────────
export const endlessclockMeta: TemplateMeta = {
  id: "endlessclock",
  name: "Endless Clock",
  codename: "Horologium",
  description:
    "Gigantic floating clocks — years as turning gears, photos set inside luxury bronze time mechanisms. For anniversaries that want time itself as the guest of honor.",
  eventTypes: ["anniversary"],
  tags: ["luxurious", "cinematic", "elegant", "traditional", "artistic", "premium"],
  keywords: [
    "clock anniversary", "time", "gears", "bronze", "horology",
    "milestone anniversary", "25th anniversary", "50th anniversary",
    "years together", "clockwork", "timeless", "mechanism", "vintage luxury",
  ],
  icon: "🕰",
  vibe: { label: "Horologium", color: "#b3823c" },
  previewImage: "/template-previews/endlessclock.jpg",
  defaults: {
    invitationMessage:
      "The clocks have counted every year for us, gear by patient gear. Come hear them all strike at once.",
    tagline: "Time, well spent.",
    accentColor: "#b3823c",
    heroImage:
      "https://images.unsplash.com/photo-1494203484021-3c454daf695d?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "People say time flies. Ours was built like a bronze movement — every year a gear, every gear still turning, none of them wasted.",
  },
};

// ─── Corporate: Digital City ─────────────────────────────────
export const digitalcityMeta: TemplateMeta = {
  id: "digitalcity",
  name: "Digital City",
  codename: "Metrogrid",
  description:
    "A futuristic megacity conference — buildings represent speakers, roads carry the agenda, data streams flow between districts. For large tech conferences and networking summits.",
  eventTypes: ["corporate", "networking-event"],
  tags: ["tech", "modern", "architectural", "interactive", "cyberpunk", "bold"],
  keywords: [
    "tech conference", "digital city", "smart city", "agenda",
    "speakers", "data streams", "networking summit", "developer event",
    "futuristic conference", "grid", "corporate summit", "innovation",
  ],
  icon: "🌐",
  vibe: { label: "Metrogrid", color: "#2f7dff" },
  previewImage: "/template-previews/digitalcity.jpg",
  defaults: {
    invitationMessage:
      "The city boots up at nine. Every district is a track, every road an agenda, every light a conversation waiting to happen.",
    tagline: "A city built to connect.",
    accentColor: "#2f7dff",
    heroImage:
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "We mapped the conference like a city: keynotes downtown, workshops in the maker district, and the best conversations — as always — in the streets between.",
  },
};

// ─── Corporate: Quantum Lab ──────────────────────────────────
export const quantumlabMeta: TemplateMeta = {
  id: "quantumlab",
  name: "Quantum Lab",
  codename: "The Lab",
  description:
    "An advanced research lab — floating holograms, glass interfaces, interactive experiments per section. For R&D showcases, science-forward corporate events and launches.",
  eventTypes: ["corporate", "product-launch"],
  tags: ["tech", "glass", "modern", "minimal", "interactive", "premium"],
  keywords: [
    "research lab", "quantum", "holograms", "science event", "r&d",
    "innovation day", "experiments", "glass interface", "deep tech",
    "laboratory", "demo day", "showcase", "prototype",
  ],
  icon: "🧪",
  vibe: { label: "The Lab", color: "#9d5cf0" },
  previewImage: "/template-previews/quantumlab.jpg",
  defaults: {
    invitationMessage:
      "The lab doors open for one day. Touch the holograms, question the researchers, break nothing expensive.",
    tagline: "Hypothesis: you'll be impressed.",
    accentColor: "#9d5cf0",
    heroImage:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "Most of what happens here stays behind glass. Once a year we open the doors and let the experiments explain themselves.",
  },
};

// ─── Corporate: Mission Control ──────────────────────────────
export const missioncontrolMeta: TemplateMeta = {
  id: "missioncontrol",
  name: "Mission Control",
  codename: "Houston",
  description:
    "NASA-style mission control — live countdown, control panels, satellite maps and a mission timeline. For launches and corporate events run like a flight program.",
  eventTypes: ["corporate", "product-launch"],
  tags: ["tech", "cinematic", "bold", "interactive", "modern", "cool"],
  keywords: [
    "mission control", "nasa", "countdown", "launch event", "telemetry",
    "control room", "satellite", "flight program", "go for launch",
    "houston", "command center", "mission timeline", "space program",
  ],
  icon: "🛰",
  vibe: { label: "Houston", color: "#3ddc84" },
  previewImage: "/template-previews/missioncontrol.jpg",
  defaults: {
    invitationMessage:
      "All stations report go. The countdown is live, the telemetry is green, and the only thing missing from the control room is you.",
    tagline: "We are go for launch.",
    accentColor: "#3ddc84",
    heroImage:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "Years of quiet checklists led to this console. When the clock hits zero, everyone in the room will know exactly why we built it.",
  },
};

// ─── Product Launch: Secret Laboratory ───────────────────────
export const secretlabMeta: TemplateMeta = {
  id: "secretlab",
  name: "Secret Laboratory",
  codename: "The Vault",
  description:
    "An underground lab discovered section by section — robots assembling the product, a secret behind every door, a dramatic final reveal. For launches that want suspense.",
  eventTypes: ["product-launch"],
  tags: ["tech", "bold", "cinematic", "interactive", "modern", "cyberpunk"],
  keywords: [
    "secret lab", "underground", "vault", "classified", "product reveal",
    "robots", "assembly", "bunker", "restricted access", "top secret",
    "launch suspense", "prototype", "warning yellow",
  ],
  icon: "🔬",
  vibe: { label: "The Vault", color: "#f5c518" },
  previewImage: "/template-previews/secretlab.jpg",
  defaults: {
    invitationMessage:
      "Clearance granted. What we've been building below ground is ready to surface — and you're on the access list.",
    tagline: "Clearance: granted.",
    accentColor: "#f5c518",
    heroImage:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "Behind the last blast door, the robots are tightening the final bolts. Every secret in this facility points at one object — and one evening.",
  },
};

// ─── Product Launch: Portal ──────────────────────────────────
export const portalMeta: TemplateMeta = {
  id: "portal",
  name: "Portal",
  codename: "The Threshold",
  description:
    "A portal slowly opening in the void — unknown energy leaking through until the product arrives from another dimension. For launches that want pure mystery.",
  eventTypes: ["product-launch"],
  tags: ["cinematic", "bold", "tech", "cyberpunk", "modern", "premium"],
  keywords: [
    "portal", "threshold", "mystery launch", "dimension", "teaser",
    "product reveal", "void", "energy", "sci-fi launch", "arrival",
    "cyan", "magenta", "unknown", "unveiling",
  ],
  icon: "◉",
  vibe: { label: "Threshold", color: "#00d9e8" },
  previewImage: "/template-previews/portal.jpg",
  defaults: {
    invitationMessage:
      "Something is coming through, and we can't fully explain it yet. Stand with us at the threshold when it arrives.",
    tagline: "It's coming through.",
    accentColor: "#00d9e8",
    heroImage:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "First a hairline of light. Then a hum the instruments couldn't name. The portal has been widening for months — on launch night, it opens all the way.",
  },
};

// ─── Product Launch: Evolution ───────────────────────────────
export const evolutionMeta: TemplateMeta = {
  id: "evolution",
  name: "Evolution",
  codename: "Ascent",
  description:
    "The evolution of technology told as one scroll — primitive to industrial to digital to AI, with the product as the destination. For launches with a lineage story.",
  eventTypes: ["product-launch", "corporate"],
  tags: ["editorial", "tech", "cinematic", "artistic", "modern", "bold"],
  keywords: [
    "evolution", "timeline", "history of technology", "industrial",
    "digital", "ai", "product story", "lineage", "progress",
    "launch narrative", "ascent", "from stone to silicon", "generations",
  ],
  icon: "🧬",
  vibe: { label: "Ascent", color: "#3aa8c9" },
  previewImage: "/template-previews/evolution.jpg",
  defaults: {
    invitationMessage:
      "Everything before this was a draft — stone, steam, silicon. Come see what all of it was evolving toward.",
    tagline: "The next stage, revealed.",
    accentColor: "#3aa8c9",
    heroImage:
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "Every era solved one problem and handed the next one forward. We picked up the last unsolved piece — and on launch night, we hand back the answer.",
  },
};

// ─── Awards: Golden Universe ─────────────────────────────────
export const goldenuniverseMeta: TemplateMeta = {
  id: "goldenuniverse",
  name: "Golden Universe",
  codename: "Aurum",
  description:
    "Awards floating in deep space — golden planets, sweeping spotlights, a cosmic theater finale. For award ceremonies that want celestial scale with pure gold glamour.",
  eventTypes: ["award-ceremony"],
  tags: ["celestial", "luxurious", "premium", "cinematic", "elegant", "bold"],
  keywords: [
    "awards", "golden", "gala", "cosmic awards", "spotlights",
    "trophy", "ceremony", "recognition night", "space gala",
    "annual awards", "black tie", "gold planets", "prestige",
  ],
  icon: "🥇",
  vibe: { label: "Aurum", color: "#e3b74a" },
  previewImage: "/template-previews/goldenuniverse.jpg",
  defaults: {
    invitationMessage:
      "Tonight the spotlights leave the stage and search the whole universe. Join us as the year's brightest are given their own orbit.",
    tagline: "Gold, at cosmic scale.",
    accentColor: "#e3b74a",
    heroImage:
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "Somewhere past the last row of seats, the theater becomes sky. Every award tonight is a planet — and every winner, the reason it shines.",
  },
};

// ─── Awards: Hall of Fame ────────────────────────────────────
export const halloffameMeta: TemplateMeta = {
  id: "halloffame",
  name: "Hall of Fame",
  codename: "Pantheon",
  description:
    "A gigantic marble museum — interactive statues, achievements carved as monuments, bronze and laurel throughout. For award ceremonies and corporate honors built to last.",
  eventTypes: ["award-ceremony", "corporate"],
  tags: ["architectural", "premium", "traditional", "elegant", "artistic", "luxurious"],
  keywords: [
    "hall of fame", "pantheon", "marble", "monuments", "statues",
    "laurel", "bronze", "lifetime achievement", "legacy awards",
    "museum", "honors", "induction", "recognition", "greek",
  ],
  icon: "🗿",
  vibe: { label: "Pantheon", color: "#a87f4f" },
  previewImage: "/template-previews/halloffame.jpg",
  defaults: {
    invitationMessage:
      "Marble remembers what applause forgets. Join us the evening this year's names are carved into the hall.",
    tagline: "Carved to be remembered.",
    accentColor: "#a87f4f",
    heroImage:
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "Every statue in this hall started as a person who refused to stop. Tonight we hand the sculptors a few more names.",
  },
};

// ─── Networking: Neural Network ──────────────────────────────
export const synapseMeta: TemplateMeta = {
  id: "synapse",
  name: "Neural Network",
  codename: "Synapse",
  description:
    "Attendees rendered as neurons — connections firing into a collective intelligence, knowledge flowing visibly across the page. For networking events and idea-dense meetups.",
  eventTypes: ["networking-event", "corporate"],
  tags: ["tech", "interactive", "modern", "artistic", "cool", "bold"],
  keywords: [
    "networking", "neurons", "synapse", "connections", "collective intelligence",
    "knowledge sharing", "meetup", "brain", "ai community", "indigo",
    "thinkers", "idea exchange", "community night",
  ],
  icon: "⚡",
  vibe: { label: "Synapse", color: "#22d3ee" },
  previewImage: "/template-previews/synapse.jpg",
  defaults: {
    invitationMessage:
      "One neuron is a spark; a room of them is a mind. Come fire a few connections with us.",
    tagline: "Where sparks become thought.",
    accentColor: "#22d3ee",
    heroImage:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "No single person in the room has the answer. But watch the connections light up over one evening, and the room starts thinking things nobody brought in.",
  },
};

// ─── Networking: Future City ─────────────────────────────────
export const futurecityMeta: TemplateMeta = {
  id: "futurecity",
  name: "Future City",
  codename: "Urbania",
  description:
    "People become buildings, companies become districts, connections become highways — the city grows as the networking happens. For community and ecosystem events with scale.",
  eventTypes: ["networking-event", "corporate"],
  tags: ["architectural", "modern", "tech", "interactive", "premium", "cool"],
  keywords: [
    "networking", "future city", "skyline", "districts", "highways",
    "ecosystem event", "community building", "growth", "urban",
    "startup city", "connections", "corporate mixer", "expansion",
  ],
  icon: "🏗",
  vibe: { label: "Urbania", color: "#4f8fd9" },
  previewImage: "/template-previews/futurecity.jpg",
  defaults: {
    invitationMessage:
      "Every handshake tonight lays a road; every conversation raises a floor. Come help us build the skyline.",
    tagline: "A skyline built by hand.",
    accentColor: "#4f8fd9",
    heroImage:
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "The city starts empty at dawn. By the last drink, there are towers where strangers stood — and highways between people who arrived alone.",
  },
};

// ─── Party: Festival of Lights ───────────────────────────────
export const festivalMeta: TemplateMeta = {
  id: "festival",
  name: "Festival of Lights",
  codename: "Lumina",
  description:
    "Tomorrowland energy — floating stages, fireworks, laser tunnels, LED flowers and music visualizers. For big parties and birthdays that want main-stage spectacle.",
  eventTypes: ["party", "birthday"],
  tags: ["festive", "neon", "vibrant", "bold", "interactive", "playful"],
  keywords: [
    "festival", "tomorrowland", "edm", "main stage", "fireworks",
    "laser tunnel", "led", "music festival", "rave", "visualizer",
    "big party", "dance", "lights", "open air",
  ],
  icon: "🎆",
  vibe: { label: "Lumina", color: "#e935c1" },
  previewImage: "/template-previews/festival.jpg",
  defaults: {
    invitationMessage:
      "The stages are floating, the lasers are warm, and the sky has been booked for fireworks. All we need now is your hands in the air.",
    tagline: "Lights up. Volume up.",
    accentColor: "#e935c1",
    heroImage:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "Somewhere between the laser tunnel and the LED garden, the crowd stops being strangers. That's the moment we build the whole night around.",
  },
};

// ─── Party: Neon Jungle ──────────────────────────────────────
export const neonjungleMeta: TemplateMeta = {
  id: "neonjungle",
  name: "Neon Jungle",
  codename: "Neon Jungle",
  description:
    "A cyberpunk rainforest — neon animals, glowing plants, interactive waterfalls of light. For parties that want wild nature rendered in electric color.",
  eventTypes: ["party"],
  tags: ["neon", "cyberpunk", "vibrant", "bold", "organic", "festive"],
  keywords: [
    "neon jungle", "cyberpunk party", "rainforest", "glowing plants",
    "neon animals", "jungle rave", "tropical night", "electric pink",
    "uv party", "blacklight", "wild night", "exotic party",
  ],
  icon: "🐆",
  vibe: { label: "Neon Jungle", color: "#39ff6e" },
  previewImage: "/template-previews/neonjungle.jpg",
  defaults: {
    invitationMessage:
      "Past the glowing vines and the waterfall made of light, the jungle is already dancing. Follow the neon panther — she knows the way.",
    tagline: "The wild glows tonight.",
    accentColor: "#39ff6e",
    heroImage:
      "https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "Nobody planted this jungle; it grew out of bass lines and blacklight. The animals are friendly, the plants hum, and the waterfall answers when you touch it.",
  },
};

// ─── Party: Midnight Tokyo ───────────────────────────────────
export const midnighttokyoMeta: TemplateMeta = {
  id: "midnighttokyo",
  name: "Midnight Tokyo",
  codename: "Shibuya",
  description:
    "Tokyo nightlife — rain reflections on black streets, animated signs, arcades and rooftop clubs in luxury neon. For parties and birthdays with big-city midnight energy.",
  eventTypes: ["party", "birthday"],
  tags: ["neon", "cyberpunk", "bold", "modern", "cinematic", "festive"],
  keywords: [
    "tokyo", "shibuya", "japanese nightlife", "neon signs", "rain",
    "rooftop club", "arcade", "city night", "izakaya", "karaoke",
    "night out", "urban party", "midnight", "vending machine",
  ],
  icon: "🗼",
  vibe: { label: "Shibuya", color: "#ff3b4e" },
  previewImage: "/template-previews/midnighttokyo.jpg",
  defaults: {
    invitationMessage:
      "The rain has polished the streets, the signs are singing, and there's a rooftop with your name in neon. Meet us after the last train.",
    tagline: "After the last train.",
    accentColor: "#ff3b4e",
    heroImage:
      "https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=1600&q=80",
    aboutStory:
      "The night starts at a vending machine and ends on a rooftop above the crossing. Everything in between is arcades, ramen and songs nobody admits to knowing.",
  },
};

// ─── Signature wedding experiences (Awwwards-tier) ───
export const creatorscanvasMeta: TemplateMeta = {
  id: "creatorscanvas",
  name: "The Creator's Canvas",
  codename: "Creator's Canvas",
  description:
    "The wedding is painted into existence as you scroll — line-art drawn stroke by stroke, names handwritten live, photos revealed from pencil sketch to full colour.",
  eventTypes: ["wedding", "engagement", "anniversary"],
  tags: ["artistic", "cinematic", "interactive", "editorial", "elegant", "premium"],
  keywords: [
    "artistic wedding", "sketch wedding", "painted", "hand-drawn", "illustration",
    "line art", "pencil", "watercolor", "gallery wedding", "art studio",
  ],
  icon: "🎨",
  vibe: { label: "Studio Canvas", color: "#4a6fa5" },
  previewImage: "/samples/mehndi-hands.jpg",
  defaults: {
    invitationMessage:
      "Some love stories are written. Ours is being drawn — one stroke at a time, with you in every frame.",
    tagline: "Painted into being.",
    accentColor: "#4a6fa5",
    // Bridal henna — intricate line-work drawn by hand, the literal wedding
    // expression of this template's sketch→paint, drawn-by-hand aesthetic.
    heroImage: "/samples/mehndi-hands.jpg",
    aboutStory:
      "A blank page, a first line, and years of colour since. We'd love you in the picture as we sign the final stroke.",
  },
};

export const timefractureMeta: TemplateMeta = {
  id: "timefracture",
  name: "Time Fracture",
  codename: "Fracture",
  description:
    "A wedding where time is broken and repaired as you scroll — frozen fragments assemble, clocks reverse, and each section lives in a different era from childhood to forever.",
  eventTypes: ["wedding", "engagement", "anniversary"],
  tags: ["cinematic", "interactive", "bold", "modern", "premium", "cool"],
  keywords: [
    "time", "fragments", "shattered glass", "sci-fi wedding", "cinematic",
    "eras", "past to future", "frozen", "reverse time", "epic wedding",
  ],
  icon: "⏳",
  vibe: { label: "Time Fracture", color: "#d4a24e" },
  previewImage: "/samples/diya-lamps.jpg",
  defaults: {
    invitationMessage:
      "Every moment led here. Scroll back through the fractures of time with us — and forward, into the day it all mends.",
    tagline: "Time, rewritten.",
    accentColor: "#d4a24e",
    // Rows of diya flames glowing on black — a wedding ritual in the template's
    // exact gold-on-dark palette, warm and cinematic.
    heroImage: "/samples/diya-lamps.jpg",
    aboutStory:
      "Rewind far enough and it's two strangers on the same street. Fast-forward and it's forever. This is the moment the timeline knots.",
  },
};

export const gravityzeroMeta: TemplateMeta = {
  id: "gravityzero",
  name: "Gravity Zero",
  codename: "Zero-G",
  description:
    "A weightless wedding in another universe — floating architecture, photos orbiting a crystal core, scroll that changes gravity and a camera that leans with your cursor.",
  eventTypes: ["wedding", "engagement", "anniversary"],
  tags: ["cinematic", "interactive", "cool", "bold", "premium", "modern"],
  keywords: [
    "space wedding", "zero gravity", "floating", "weightless", "orbit",
    "sci-fi", "astronaut", "levitation", "cosmic wedding", "otherworldly",
  ],
  icon: "🌀",
  vibe: { label: "Zero-G", color: "#7fb7d8" },
  previewImage: "/samples/rings-roses.jpg",
  defaults: {
    invitationMessage:
      "Leave the ground behind. Come float with us where nothing falls — least of all, us.",
    tagline: "Nothing touches the ground.",
    accentColor: "#7fb7d8",
    // Gold rings with roses on a bright white ground — clean, light and airy to
    // suit this template's weightless pale-blue palette.
    heroImage: "/samples/rings-roses.jpg",
    aboutStory:
      "Somewhere gravity gave up and we just kept rising. Orbit our little universe for an evening — dress code: astronaut-formal.",
  },
};

export const memorydimensionMeta: TemplateMeta = {
  id: "memorydimension",
  name: "Memory Dimension",
  codename: "Memory Dimension",
  description:
    "Memories float as glowing crystals in a four-dimensional archive — the camera drifts through them, each photograph a world you can open. Volumetric, cinematic, deep.",
  eventTypes: ["wedding", "engagement", "anniversary"],
  tags: ["cinematic", "interactive", "premium", "cool", "artistic", "bold"],
  keywords: [
    "memories", "archive", "crystal", "4D", "immersive", "volumetric",
    "cinematic wedding", "gallery wedding", "time capsule wedding", "photo dimension",
  ],
  icon: "🔮",
  vibe: { label: "Memory Archive", color: "#9b8cff" },
  previewImage: "/samples/lotus-decor.jpg",
  defaults: {
    invitationMessage:
      "Step inside the archive of us — every crystal a memory, every memory a reason we're saying yes.",
    tagline: "Walk through our memories.",
    accentColor: "#9b8cff",
    // Lotus and roses in deep shadow — dreamy blooms suspended in the dark, for
    // this template's deep, memory-archive mood.
    heroImage: "/samples/lotus-decor.jpg",
    aboutStory:
      "Each memory is kept in its own light — the first look, the long drive, the quiet yes. Drift through them and end at the brightest one.",
  },
};

export const infinitycathedralMeta: TemplateMeta = {
  id: "infinitycathedral",
  name: "Infinity Cathedral",
  codename: "Infinity Cathedral",
  description:
    "A wedding inside an impossible cathedral that rebuilds itself as you scroll — columns to infinity, stained-glass galleries, marble timelines, and a final reveal into a universe of stars.",
  eventTypes: ["wedding", "engagement", "anniversary"],
  tags: ["cinematic", "luxurious", "interactive", "premium", "bold", "elegant"],
  keywords: [
    "cathedral", "impossible architecture", "endless columns", "stained glass",
    "marble", "sacred wedding", "grand wedding", "epic wedding", "constellation",
    "starry ceiling",
  ],
  icon: "⛪",
  vibe: { label: "Infinity Cathedral", color: "#d8b46a" },
  previewImage: "/samples/mandap-flowers.jpg",
  defaults: {
    invitationMessage:
      "Enter a cathedral that was never built and cannot fall — and stay until the ceiling opens onto forever.",
    tagline: "Where forever is the architecture.",
    accentColor: "#d8b46a",
    // A grand pillared wedding hall — carved gold mandap columns and a long
    // aisle, the wedding echo of this template's endless-columns architecture.
    heroImage: "/samples/mandap-flowers.jpg",
    aboutStory:
      "Every column is a year, every window a memory of light. Walk the nave with us to the altar, and watch the roof give way to stars.",
  },
};

export const TEMPLATES_META: TemplateMeta[] = [
  // Signature wedding experiences
  creatorscanvasMeta,
  timefractureMeta,
  gravityzeroMeta,
  memorydimensionMeta,
  infinitycathedralMeta,
  // Wedding & romantic
  moonlitMeta,
  skytempleMeta,
  oceanpalaceMeta,
  symphonyMeta,
  empyreanMeta,
  prismMeta,
  auroraMeta,
  obsidianMeta,
  celestiaMeta,
  royalMeta,
  minimalMeta,
  modernMeta,
  pastelMeta,
  skyrealmMeta,
  cathedralMeta,
  sakuraMeta,
  versaillesMeta,
  frescoMeta,
  mirageMeta,
  icepalaceMeta,
  galaxyoperaMeta,
  // Engagement
  infinityMeta,
  lovestarsMeta,
  gardenMeta,
  horizonMeta,
  promiseMeta,
  tworiversMeta,
  mirrorworldsMeta,
  infinitytrainMeta,
  lanternsMeta,
  glassroseMeta,
  secretgalaxyMeta,
  // Anniversary
  libraryMeta,
  chaptersMeta,
  timecapsuleMeta,
  treeoflifeMeta,
  endlessclockMeta,
  // Birthday
  toyboxMeta,
  timemachineMeta,
  carnivalMeta,
  dreamfactoryMeta,
  orbitMeta,
  arcadeMeta,
  vibrantMeta,
  cartoonMeta,
  bricktownMeta,
  treasureMeta,
  themeparkMeta,
  candylandMeta,
  robocityMeta,
  spacemissionMeta,
  jungleMeta,
  // Corporate / Launch / Awards
  quantumMeta,
  neuralMeta,
  genesisMeta,
  unveilMeta,
  nexusMeta,
  pinnacleMeta,
  immortalsMeta,
  odeonMeta,
  luminaryMeta,
  digitalcityMeta,
  quantumlabMeta,
  missioncontrolMeta,
  secretlabMeta,
  portalMeta,
  evolutionMeta,
  goldenuniverseMeta,
  halloffameMeta,
  // Networking / Party
  ecosystemMeta,
  constellaMeta,
  convergeMeta,
  infinityclubMeta,
  metropolisMeta,
  afterMeta,
  synapseMeta,
  futurecityMeta,
  festivalMeta,
  neonjungleMeta,
  midnighttokyoMeta,
];

export function getTemplateMeta(id: string): TemplateMeta | undefined {
  return TEMPLATES_META.find((t) => t.id === id);
}

/** Alphabetical A–Z by display name — the default order for every listing. */
const byName = (a: TemplateMeta, b: TemplateMeta) => a.name.localeCompare(b.name);

/** Curated "featured" order — the most attention-grabbing templates lead, then
 *  everything else falls in A–Z. Reorder / extend this to promote templates. */
export const FEATURED_ORDER: string[] = [
  "aurora",
  "obsidian",
  "celestia",
  "royal",
  "galaxyopera",
  "luminary",
  "immortals",
  "midnighttokyo",
  "vibrant",
  "cartoon",
  "modern",
  "minimal",
  "pastel",
];

export type TemplateSort = "featured" | "az" | "random";

/** Order a list of templates by the chosen strategy (used by the listings).
 *  `featuredIds` (from the admin-managed Featured sheet, per event type) wins
 *  for the "featured" mode; otherwise the built-in FEATURED_ORDER is used. */
export function sortTemplates(
  list: TemplateMeta[],
  mode: TemplateSort,
  featuredIds?: string[],
): TemplateMeta[] {
  if (mode === "az") return [...list].sort(byName);
  if (mode === "random") return [...list].sort(() => Math.random() - 0.5);
  const order = featuredIds && featuredIds.length > 0 ? featuredIds : FEATURED_ORDER;
  const rank = new Map(order.map((id, i) => [id, i]));
  return [...list].sort((a, b) => {
    const ra = rank.has(a.id) ? (rank.get(a.id) as number) : Infinity;
    const rb = rank.has(b.id) ? (rank.get(b.id) as number) : Infinity;
    return ra !== rb ? ra - rb : byName(a, b);
  });
}

export function getTemplatesForEventType(eventType: EventType): TemplateMeta[] {
  return TEMPLATES_META.filter((t) => t.eventTypes.includes(eventType)).sort(byName);
}

export function filterTemplates(opts: {
  eventType?: EventType;
  tags?: TemplateTag[];
}): TemplateMeta[] {
  return TEMPLATES_META.filter((t) => {
    if (opts.eventType && !t.eventTypes.includes(opts.eventType)) return false;
    if (opts.tags && opts.tags.length > 0 && !opts.tags.some((tag) => t.tags.includes(tag))) return false;
    return true;
  }).sort(byName);
}

/**
 * Score how well a template matches a free-text query. Higher = better match.
 * Empty query → 1 (all templates equally "match"). Zero result → template
 * doesn't contain any query word anywhere.
 *
 * Weights are tuned so that:
 *   - matching the name / codename beats matching a tag (name is stronger)
 *   - matching a keyword phrase is worth more than a generic tag hit
 *   - description hits are the weakest signal (lots of common English words)
 */
export function scoreTemplateMatch(t: TemplateMeta, query: string): number {
  const q = query.trim().toLowerCase();
  if (!q) return 1;
  const tokens = q.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return 1;

  // Field bag with per-field weight.
  const fields: { text: string; weight: number }[] = [
    { text: t.name.toLowerCase(), weight: 5 },
    { text: (t.codename ?? "").toLowerCase(), weight: 3 },
    { text: t.description.toLowerCase(), weight: 2 },
    { text: t.tags.join(" ").toLowerCase(), weight: 3 },
    { text: (t.keywords ?? []).join(" | ").toLowerCase(), weight: 4 },
    { text: t.vibe.label.toLowerCase(), weight: 3 },
    { text: t.eventTypes.join(" ").toLowerCase(), weight: 3 },
  ];

  let score = 0;
  for (const token of tokens) {
    for (const f of fields) {
      if (!f.text) continue;
      if (f.text.includes(token)) score += f.weight;
    }
  }
  return score;
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
