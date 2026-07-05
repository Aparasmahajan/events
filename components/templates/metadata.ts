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
    heroImage:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80",
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
    heroImage:
      "https://images.unsplash.com/photo-1494203484021-3c454daf695d?auto=format&fit=crop&w=1600&q=80",
  },
};

export const vibrantMeta: TemplateMeta = {
  id: "vibrant",
  name: "Party Pop",
  codename: "Vibrant Pop",
  description:
    "Bright, chaotic, joyful. Confetti energy — for birthdays, kids' parties, and small engagements that want a lot of pink.",
  eventTypes: ["birthday", "engagement", "anniversary"],
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
    heroImage:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1600&q=80",
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
    heroImage:
      "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=1600&q=80",
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
    heroImage:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1600&q=80",
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
    heroImage:
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1600&q=80",
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
    heroImage:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80",
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
  previewImage: "/template-previews/prism.jpg",
  defaults: {
    invitationMessage:
      "Light bends. Colors emerge. Two lives, refracted through one moment — we would love you there when it happens.",
    tagline: "Light meets light.",
    accentColor: "#7ea8ff",
    heroImage:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1600&q=80",
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
  eventTypes: ["engagement", "anniversary"],
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
    heroImage:
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1600&q=80",
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

export const TEMPLATES_META: TemplateMeta[] = [
  empyreanMeta,
  prismMeta,
  auroraMeta,
  obsidianMeta,
  celestiaMeta,
  royalMeta,
  minimalMeta,
  modernMeta,
  pastelMeta,
  promiseMeta,
  chaptersMeta,
  orbitMeta,
  arcadeMeta,
  vibrantMeta,
  neuralMeta,
  unveilMeta,
  nexusMeta,
  pinnacleMeta,
  odeonMeta,
  luminaryMeta,
  constellaMeta,
  convergeMeta,
  metropolisMeta,
  afterMeta,
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
