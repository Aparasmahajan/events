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
    heroImage:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80",
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
    heroImage:
      "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=1600&q=80",
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
  eventTypes: ["engagement", "anniversary"],
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
  eventTypes: ["engagement", "anniversary"],
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
    heroImage:
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1600&q=80",
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

export const TEMPLATES_META: TemplateMeta[] = [
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
  // Engagement
  infinityMeta,
  lovestarsMeta,
  gardenMeta,
  horizonMeta,
  promiseMeta,
  // Anniversary
  libraryMeta,
  chaptersMeta,
  // Birthday
  toyboxMeta,
  timemachineMeta,
  carnivalMeta,
  dreamfactoryMeta,
  orbitMeta,
  arcadeMeta,
  vibrantMeta,
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
  // Networking / Party
  ecosystemMeta,
  constellaMeta,
  convergeMeta,
  infinityclubMeta,
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
