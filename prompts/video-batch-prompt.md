<!--
HOW TO RUN (pass an event type, get videos+audio for every template of that type):

  1.  node scripts/video-roster.mjs <eventType>        # e.g. wedding | corporate | party
      -> prints { eventType, count, templates:[...] }
  2.  Substitute that JSON into {{TEMPLATE_ROSTER}} and the type into {{EVENT_TYPE}} below.
  3.  Send the whole file (minus this comment) to your LLM.
  4.  Feed each template's RENDER_PACKAGE JSON to your video + TTS + music pipeline.

eventType is one of: wedding, engagement, anniversary, birthday, party,
corporate, product-launch, award-ceremony, networking-event.
-->

# ROLE
You are an elite Creative Director **and** Copywriter for premium short-form vertical video (Instagram Reels, TikTok, YouTube Shorts). You produce high-converting ad blueprints for a couture, template-based **event-website builder** — digital invitations that feel like a bespoke design-studio masterpiece, not a generic page.

# INPUTS
- `EVENT_TYPE` = **Wedding**
- `TEMPLATE_ROSTER` (every template to cover this run — JSON):
```json
{ "templates": [
    {
      "id": "royal",
      "name": "Royal Wedding",
      "codename": "Royal Heritage",
      "vibe": "Vintage Royal",
      "accent": "#a3792c",
      "tags": [
        "royal",
        "elegant",
        "luxurious",
        "traditional",
        "appealing"
      ],
      "keywords": [
        "indianwedding",
        "hinduwedding",
        "punjabiwedding",
        "muslimwedding",
        "shaadi",
        "mandap"
      ],
      "description": "The full big-fat-Indian-wedding treatment — ornate gold serifs, room for mehndi, haldi, sangeet and pheras across days."
    },
    {
      "id": "minimal",
      "name": "Minimal Editorial",
      "codename": "Minimal Mono",
      "vibe": "Modern Minimal",
      "accent": "#111111",
      "tags": [
        "minimal",
        "decent",
        "modern",
        "elegant",
        "monochrome"
      ],
      "keywords": [
        "smallwedding",
        "intimate",
        "elopement",
        "quiet",
        "clean",
        "minimal"
      ],
      "description": "Whitespace-heavy, black-and-white typography. When you want the day to feel quiet and precise — small weddings, corporate meetings, workshops."
    },
    {
      "id": "modern",
      "name": "Modern Bold",
      "codename": "Modern Noir",
      "vibe": "Avant-Garde",
      "accent": "#7c3aed",
      "tags": [
        "modern",
        "cool",
        "appealing",
        "bold"
      ],
      "keywords": [
        "dark",
        "cinematic",
        "bold",
        "modern",
        "edgy",
        "purple"
      ],
      "description": "Dark, cinematic, design-forward. Feels like the announcement for a new album — for events with attitude, not tradition."
    },
    {
      "id": "vibrant",
      "name": "Party Pop",
      "codename": "Vibrant Pop",
      "vibe": "Festive",
      "accent": "#ff5fa2",
      "tags": [
        "vibrant",
        "cool",
        "appealing",
        "playful",
        "festive"
      ],
      "keywords": [
        "birthday",
        "kidsbirthday",
        "firstbirthday",
        "party",
        "pink",
        "playful"
      ],
      "description": "Bright, chaotic, joyful. Confetti energy — for birthdays, kids' parties, and small engagements that want a lot of pink."
    },
    {
      "id": "pastel",
      "name": "Pastel Wedding",
      "codename": "Pastel Bloom",
      "vibe": "Soft Romance",
      "accent": "#e8a0a0",
      "tags": [
        "romantic",
        "pastel",
        "elegant",
        "decent",
        "appealing"
      ],
      "keywords": [
        "romantic",
        "soft",
        "pastel",
        "gardenwedding",
        "outdoorwedding",
        "gentle"
      ],
      "description": "Soft palette, gentle serifs, garden-wedding energy. For couples who want the day to feel unhurried and romantic, not loud."
    },
    {
      "id": "aurora",
      "name": "Cinematic Wedding",
      "codename": "Aurora",
      "vibe": "Celestial",
      "accent": "#d8b46a",
      "tags": [
        "cinematic",
        "interactive",
        "luxurious",
        "modern",
        "romantic"
      ],
      "keywords": [
        "cinematic",
        "luxurywedding",
        "celestial",
        "moonlight",
        "nightwedding",
        "romantic"
      ],
      "description": "A wedding rendered like a film — parallax names under a moonlight beam, a sideways photo reel, floating event islands. For weddings that want to feel like a moment."
    },
    {
      "id": "obsidian",
      "name": "Black-Tie Wedding",
      "codename": "Obsidian",
      "vibe": "Night Luxe",
      "accent": "#b5763a",
      "tags": [
        "cinematic",
        "editorial",
        "luxurious",
        "bold",
        "modern"
      ],
      "keywords": [
        "blacktie",
        "editorial",
        "bronze",
        "luxurywedding",
        "cinematic",
        "restrained"
      ],
      "description": "Burnt bronze on black, scenes that slide over each other, sliced typography. Editorial and restrained — for couples who want a black-tie night with weight."
    },
    {
      "id": "celestia",
      "name": "Ethereal Wedding",
      "codename": "Celestia",
      "vibe": "Ethereal",
      "accent": "#7c6bb0",
      "tags": [
        "elegant",
        "romantic",
        "luxurious",
        "cinematic",
        "cool"
      ],
      "keywords": [
        "ethereal",
        "romantic",
        "celestial",
        "lavender",
        "floating",
        "dreamy"
      ],
      "description": "Glass orb that turns as you scroll, floating photos, a ribbon that threads the day. Dusty lavender and ice blue — for weddings that feel weightless."
    },
    {
      "id": "empyrean",
      "name": "Divine Wedding",
      "codename": "Empyrean",
      "vibe": "Divine",
      "accent": "#c8a460",
      "tags": [
        "luxurious",
        "elegant",
        "romantic",
        "celestial",
        "premium"
      ],
      "keywords": [
        "divine",
        "heavenly",
        "chapel",
        "cathedral",
        "sacred",
        "marble"
      ],
      "description": "Alabaster marble, drifting clouds, a staircase to eternity. For weddings that want to feel sacred, otherworldly, chapel-quiet."
    },
    {
      "id": "prism",
      "name": "Crystal Wedding",
      "codename": "Prism",
      "vibe": "Crystalline",
      "accent": "#7ea8ff",
      "tags": [
        "luxurious",
        "elegant",
        "modern",
        "glass",
        "cinematic"
      ],
      "keywords": [
        "crystal",
        "prism",
        "glasswedding",
        "rainbow",
        "iridescent",
        "sapphire"
      ],
      "description": "Floating glass, prism refractions, rainbow light spilling across sapphire. For couples who want their day to feel like light itself."
    },
    {
      "id": "promise",
      "name": "Engagement Announcement",
      "codename": "Promise",
      "vibe": "Convergence",
      "accent": "#c89b8c",
      "tags": [
        "romantic",
        "elegant",
        "cinematic",
        "modern",
        "artistic"
      ],
      "keywords": [
        "engagement",
        "proposal",
        "roka",
        "engagementparty",
        "justengaged",
        "shesaidyes"
      ],
      "description": "Two lives, two typographic worlds, converging into one as the page scrolls. For engagements that want to feel like the exact moment."
    },
    {
      "id": "chapters",
      "name": "Anniversary Chronicles",
      "codename": "Chapters",
      "vibe": "Chronicles",
      "accent": "#a68b5b",
      "tags": [
        "editorial",
        "elegant",
        "romantic",
        "traditional",
        "artistic"
      ],
      "keywords": [
        "anniversary",
        "silveranniversary",
        "goldenanniversary",
        "25years",
        "50years",
        "vowrenewal"
      ],
      "description": "Parchment, ink serifs, a chapter-by-chapter walk through the years — with a small constellation of the moments that mattered."
    },
    {
      "id": "moonlit",
      "name": "Moonlit Kingdom",
      "codename": "Moonlit Kingdom",
      "vibe": "Moonlit Kingdom",
      "accent": "#c8d4e8",
      "tags": [
        "royal",
        "cinematic",
        "luxurious",
        "romantic",
        "celestial"
      ],
      "keywords": [
        "fantasywedding",
        "castlewedding",
        "moonlight",
        "lanterns",
        "royalnight",
        "kingdom"
      ],
      "description": "A kingdom under a giant full moon — castles in mist, floating lanterns, silver on still water. For weddings that want to feel like the greatest fantasy royal wedding ever held."
    },
    {
      "id": "skytemple",
      "name": "Sky Temple",
      "codename": "Sky Temple",
      "vibe": "Sky Temple",
      "accent": "#e6c988",
      "tags": [
        "celestial",
        "luxurious",
        "cinematic",
        "elegant",
        "artistic"
      ],
      "keywords": [
        "skywedding",
        "cloudwedding",
        "heavenly",
        "floatingtemple",
        "godly",
        "olympian"
      ],
      "description": "Marble temples floating between cloud islands, golden birds, waterfalls falling into infinite sky. For weddings that want the guest to feel they're attending among the gods."
    },
    {
      "id": "oceanpalace",
      "name": "Ocean Palace",
      "codename": "Ocean Palace",
      "vibe": "Ocean Palace",
      "accent": "#4fb0c6",
      "tags": [
        "luxurious",
        "elegant",
        "romantic",
        "artistic",
        "cinematic"
      ],
      "keywords": [
        "underwaterwedding",
        "oceanwedding",
        "beachwedding",
        "seawedding",
        "pearlwedding",
        "coral"
      ],
      "description": "A palace beneath the sea — rays of sun through crystal water, pearls rising, coral gardens, photos inside luminous bubbles. For weddings that want to feel weightless and magical."
    },
    {
      "id": "symphony",
      "name": "Celestial Symphony",
      "codename": "Symphony",
      "vibe": "Symphony",
      "accent": "#b48eff",
      "tags": [
        "cinematic",
        "artistic",
        "romantic",
        "celestial",
        "editorial"
      ],
      "keywords": [
        "symphonywedding",
        "musicalwedding",
        "orchestra",
        "operawedding",
        "concertwedding",
        "composer"
      ],
      "description": "The wedding as a piece of music — constellations pulse to orchestral rhythm, notes become stars, the story unfolds in movements. For couples whose love has a score."
    },
    {
      "id": "infinity",
      "name": "Infinity Rings",
      "codename": "Infinity",
      "vibe": "Infinity",
      "accent": "#d4a574",
      "tags": [
        "luxurious",
        "romantic",
        "cinematic",
        "modern",
        "editorial"
      ],
      "keywords": [
        "engagement",
        "ringceremony",
        "roka",
        "infinity",
        "eternalring",
        "engagementannouncement"
      ],
      "description": "Two glowing rings crossing universes, closing in on each other as the page scrolls, meeting in a single infinite ring. A cinematic engagement announcement."
    },
    {
      "id": "lovestars",
      "name": "Love Constellation",
      "codename": "Lovestars",
      "vibe": "Lovestars",
      "accent": "#8ea9ff",
      "tags": [
        "celestial",
        "romantic",
        "cinematic",
        "artistic",
        "interactive"
      ],
      "keywords": [
        "engagement",
        "astronomy",
        "constellation",
        "stars",
        "galaxy",
        "cosmicengagement"
      ],
      "description": "Memories drawn as stars that connect into a constellation as you scroll — the moment of the proposal becomes an exploding galaxy. Two destinies written in the sky."
    },
    {
      "id": "garden",
      "name": "Secret Garden",
      "codename": "Garden",
      "vibe": "Secret Garden",
      "accent": "#88b06a",
      "tags": [
        "romantic",
        "botanical",
        "pastel",
        "elegant",
        "artistic"
      ],
      "keywords": [
        "gardenengagement",
        "botanical",
        "flowers",
        "greenhouse",
        "florals",
        "secretgarden"
      ],
      "description": "A magical botanical garden — flowers bloom as you scroll, butterflies reveal photos, glass greenhouses hold memories. An intimate, naturally romantic engagement."
    },
    {
      "id": "horizon",
      "name": "Golden Horizon",
      "codename": "Horizon",
      "vibe": "Golden Horizon",
      "accent": "#e8a86a",
      "tags": [
        "romantic",
        "elegant",
        "pastel",
        "cinematic",
        "editorial"
      ],
      "keywords": [
        "sunsetengagement",
        "goldenhour",
        "beachengagement",
        "twilight",
        "warmengagement",
        "silhouetteengagement"
      ],
      "description": "Endless sunset — warm golden hour drifts into twilight as you scroll, clouds pink and orange, silhouettes on calm water. Warm, peaceful, deeply romantic."
    },
    {
      "id": "library",
      "name": "Eternal Library",
      "codename": "Library",
      "vibe": "Eternal Library",
      "accent": "#7c5a2e",
      "tags": [
        "editorial",
        "elegant",
        "traditional",
        "romantic",
        "artistic"
      ],
      "keywords": [
        "anniversarylibrary",
        "bookanniversary",
        "yearstogether",
        "silver",
        "goldenanniversary",
        "vowrenewal"
      ],
      "description": "An infinite library — each year of marriage is an illuminated book, letters become butterflies, grand staircases connect chapters. The greatest love story ever written."
    },
    {
      "id": "skyrealm",
      "name": "Floating Kingdom",
      "codename": "Skyrealm",
      "vibe": "Floating Kingdom",
      "accent": "#7ab8e8",
      "tags": [
        "celestial",
        "luxurious",
        "cinematic",
        "elegant",
        "romantic"
      ],
      "keywords": [
        "floatingislands",
        "skykingdom",
        "fantasywedding",
        "cloudwedding",
        "marblebridges",
        "goldenbirds"
      ],
      "description": "Floating marble islands joined by bridges, clouds drifting beneath, golden birds crossing the sky — for weddings that want a grand fantasy setting above the world."
    },
    {
      "id": "cathedral",
      "name": "Starlight Cathedral",
      "codename": "Cathedral of Stars",
      "vibe": "Starlight",
      "accent": "#4a5fc1",
      "tags": [
        "celestial",
        "cinematic",
        "luxurious",
        "elegant",
        "romantic"
      ],
      "keywords": [
        "cathedralwedding",
        "starlight",
        "constellation",
        "galaxyceiling",
        "stainedglass",
        "nightwedding"
      ],
      "description": "A cathedral built entirely of constellations — galaxy ceiling, photos glowing like stained glass. For night weddings and anniversaries that want sacred, cosmic scale."
    },
    {
      "id": "sakura",
      "name": "Sakura Dreams",
      "codename": "Sakura",
      "vibe": "Sakura",
      "accent": "#e88aa8",
      "tags": [
        "romantic",
        "pastel",
        "botanical",
        "elegant",
        "whimsical"
      ],
      "keywords": [
        "cherryblossom",
        "sakura",
        "japanesewedding",
        "springwedding",
        "petals",
        "blossomforest"
      ],
      "description": "An endless cherry-blossom forest — drifting petals, floating lanterns, seasons turning as you scroll. For weddings and engagements that want soft Japanese-spring romance."
    },
    {
      "id": "versailles",
      "name": "Royal Versailles",
      "codename": "Versailles",
      "vibe": "Palace Royal",
      "accent": "#c9a13b",
      "tags": [
        "royal",
        "luxurious",
        "traditional",
        "elegant",
        "premium"
      ],
      "keywords": [
        "palacewedding",
        "versailles",
        "frenchwedding",
        "chandelier",
        "goldenmirrors",
        "baroque"
      ],
      "description": "A tour through palace rooms — grand staircases, chandeliers, golden mirrors, royal gardens. For weddings and anniversaries that want full European-palace opulence."
    },
    {
      "id": "fresco",
      "name": "Renaissance Painting",
      "codename": "Fresco",
      "vibe": "Renaissance",
      "accent": "#b0722f",
      "tags": [
        "artistic",
        "traditional",
        "elegant",
        "romantic",
        "editorial"
      ],
      "keywords": [
        "renaissance",
        "paintingwedding",
        "artwedding",
        "museumwedding",
        "fresco",
        "oilpaint"
      ],
      "description": "The whole site is a living Renaissance painting — brush-stroke reveals, floating golden frames, a museum-gallery walk. For couples who want their day treated as art."
    },
    {
      "id": "mirage",
      "name": "Desert Mirage",
      "codename": "Mirage",
      "vibe": "Desert Luxe",
      "accent": "#d19a4f",
      "tags": [
        "luxurious",
        "cinematic",
        "romantic",
        "traditional",
        "bold"
      ],
      "keywords": [
        "desertwedding",
        "arabiannights",
        "dunes",
        "mirage",
        "firebowls",
        "moroccan"
      ],
      "description": "Arabian luxury — golden dunes, shimmering mirage transitions, fire bowls and geometric patterns. For weddings and engagements with warm desert-night drama."
    },
    {
      "id": "icepalace",
      "name": "Nordic Ice Palace",
      "codename": "Ice Palace",
      "vibe": "Ice Palace",
      "accent": "#8fd4e8",
      "tags": [
        "celestial",
        "elegant",
        "cinematic",
        "luxurious",
        "glass"
      ],
      "keywords": [
        "winterwedding",
        "icepalace",
        "nordic",
        "aurora",
        "northernlights",
        "snowwedding"
      ],
      "description": "A palace carved from glowing ice — aurora lighting, drifting snow, frozen-lake reflections. For winter weddings and engagements that want crystalline Nordic magic."
    },
    {
      "id": "galaxyopera",
      "name": "Galaxy Opera",
      "codename": "Opera Celeste",
      "vibe": "Galaxy Opera",
      "accent": "#8b5cf6",
      "tags": [
        "cinematic",
        "celestial",
        "luxurious",
        "artistic",
        "bold"
      ],
      "keywords": [
        "operawedding",
        "galaxy",
        "theatricalwedding",
        "velvetcurtains",
        "cosmic",
        "grandwedding"
      ],
      "description": "An opera house drifting through space — velvet curtains revealing galaxies, chandeliers made of planets. For weddings and award nights that want cosmic theatrical grandeur."
    },
    {
      "id": "tworivers",
      "name": "Two Rivers",
      "codename": "Confluence",
      "vibe": "Confluence",
      "accent": "#3f9e9b",
      "tags": [
        "romantic",
        "organic",
        "artistic",
        "elegant",
        "cinematic"
      ],
      "keywords": [
        "tworivers",
        "confluence",
        "engagement",
        "lotus",
        "river",
        "merging"
      ],
      "description": "Two rivers flow separately down the page and merge into one ocean as you scroll, lotus flowers drifting on the current. A gentle metaphor for engagements and anniversaries."
    },
    {
      "id": "mirrorworlds",
      "name": "Mirror Worlds",
      "codename": "Symmetry",
      "vibe": "Symmetry",
      "accent": "#8a93a5",
      "tags": [
        "modern",
        "editorial",
        "artistic",
        "romantic",
        "minimal"
      ],
      "keywords": [
        "splitscreen",
        "symmetry",
        "mirror",
        "twoworlds",
        "oppositesattract",
        "engagement"
      ],
      "description": "The page is split vertically into two distinct worlds that merge into perfect symmetry as you scroll. For engagements and weddings of two very different people who fit."
    },
    {
      "id": "infinitytrain",
      "name": "Infinity Train",
      "codename": "The Grand Line",
      "vibe": "Grand Line",
      "accent": "#b08d3f",
      "tags": [
        "cinematic",
        "luxurious",
        "romantic",
        "traditional",
        "artistic"
      ],
      "keywords": [
        "trainjourney",
        "orientexpress",
        "luxurytrain",
        "vintagetravel",
        "engagementjourney",
        "memories"
      ],
      "description": "A luxury train travelling through memories — each coach a chapter, windows showing changing landscapes. For engagements and anniversaries told as a journey."
    },
    {
      "id": "lanterns",
      "name": "Dream Lanterns",
      "codename": "Lanterns",
      "vibe": "Lantern Night",
      "accent": "#e8a545",
      "tags": [
        "romantic",
        "cinematic",
        "whimsical",
        "elegant",
        "appealing"
      ],
      "keywords": [
        "floatinglanterns",
        "skylanterns",
        "lake",
        "nightengagement",
        "lanternfestival",
        "warmnight"
      ],
      "description": "Thousands of floating lanterns carry memories over a still lake on a warm cinematic night. For engagements and weddings that want quiet, glowing wonder."
    },
    {
      "id": "glassrose",
      "name": "Glass Rose",
      "codename": "Rosaline",
      "vibe": "Crystal Rose",
      "accent": "#d66a8a",
      "tags": [
        "glass",
        "romantic",
        "elegant",
        "artistic",
        "luxurious"
      ],
      "keywords": [
        "crystalrose",
        "glassflower",
        "blooming",
        "roseengagement",
        "petals",
        "delicate"
      ],
      "description": "The entire site lives inside a giant crystal rose — petals become sections and the flower blooms open as you scroll. For engagements and anniversaries with delicate drama."
    },
    {
      "id": "secretgalaxy",
      "name": "Secret Galaxy",
      "codename": "Andromeda",
      "vibe": "Andromeda",
      "accent": "#7b5ce8",
      "tags": [
        "celestial",
        "romantic",
        "cinematic",
        "interactive",
        "artistic"
      ],
      "keywords": [
        "galaxyengagement",
        "secret",
        "andromeda",
        "constellationnames",
        "stars",
        "nebula"
      ],
      "description": "A hidden galaxy discovered by two people — stars form rings, constellations write your names across deep violet space. For engagements that feel like a private universe."
    },
    {
      "id": "treeoflife",
      "name": "Tree of Life",
      "codename": "Evergreen",
      "vibe": "Evergreen",
      "accent": "#5c8a4a",
      "tags": [
        "organic",
        "botanical",
        "romantic",
        "traditional",
        "artistic"
      ],
      "keywords": [
        "treeoflife",
        "familytree",
        "anniversary",
        "branches",
        "roots",
        "seasons"
      ],
      "description": "One giant tree — every anniversary a branch, photos hanging as leaves, seasons turning as you scroll. For anniversaries and weddings rooted in family."
    },
    {
      "id": "creatorscanvas",
      "name": "The Creator's Canvas",
      "codename": "Creator's Canvas",
      "vibe": "Studio Canvas",
      "accent": "#4a6fa5",
      "tags": [
        "artistic",
        "cinematic",
        "interactive",
        "editorial",
        "elegant"
      ],
      "keywords": [
        "artisticwedding",
        "sketchwedding",
        "painted",
        "hand-drawn",
        "illustration",
        "lineart"
      ],
      "description": "The wedding is painted into existence as you scroll — line-art drawn stroke by stroke, names handwritten live, photos revealed from pencil sketch to full colour."
    },
    {
      "id": "timefracture",
      "name": "Time Fracture",
      "codename": "Fracture",
      "vibe": "Time Fracture",
      "accent": "#d4a24e",
      "tags": [
        "cinematic",
        "interactive",
        "bold",
        "modern",
        "premium"
      ],
      "keywords": [
        "time",
        "fragments",
        "shatteredglass",
        "sci-fiwedding",
        "cinematic",
        "eras"
      ],
      "description": "A wedding where time is broken and repaired as you scroll — frozen fragments assemble, clocks reverse, and each section lives in a different era from childhood to forever."
    },
    {
      "id": "gravityzero",
      "name": "Gravity Zero",
      "codename": "Zero-G",
      "vibe": "Zero-G",
      "accent": "#7fb7d8",
      "tags": [
        "cinematic",
        "interactive",
        "cool",
        "bold",
        "premium"
      ],
      "keywords": [
        "spacewedding",
        "zerogravity",
        "floating",
        "weightless",
        "orbit",
        "sci-fi"
      ],
      "description": "A weightless wedding in another universe — floating architecture, photos orbiting a crystal core, scroll that changes gravity and a camera that leans with your cursor."
    },
    {
      "id": "memorydimension",
      "name": "Memory Dimension",
      "codename": "Memory Dimension",
      "vibe": "Memory Archive",
      "accent": "#9b8cff",
      "tags": [
        "cinematic",
        "interactive",
        "premium",
        "cool",
        "artistic"
      ],
      "keywords": [
        "memories",
        "archive",
        "crystal",
        "4D",
        "immersive",
        "volumetric"
      ],
      "description": "Memories float as glowing crystals in a four-dimensional archive — the camera drifts through them, each photograph a world you can open. Volumetric, cinematic, deep."
    },
    {
      "id": "infinitycathedral",
      "name": "Infinity Cathedral",
      "codename": "Infinity Cathedral",
      "vibe": "Infinity Cathedral",
      "accent": "#d8b46a",
      "tags": [
        "cinematic",
        "luxurious",
        "interactive",
        "premium",
        "bold"
      ],
      "keywords": [
        "cathedral",
        "impossiblearchitecture",
        "endlesscolumns",
        "stainedglass",
        "marble",
        "sacredwedding"
      ],
      "description": "A wedding inside an impossible cathedral that rebuilds itself as you scroll — columns to infinity, stained-glass galleries, marble timelines, and a final reveal into a universe of stars."
    }
  ]
}}
```
Each roster item has: `id, name, codename, vibe, accent (hex), tags[], keywords[], description`.

# MISSION
Produce a **complete, production-ready blueprint for EVERY template** in `TEMPLATE_ROSTER` — in order, none skipped, merged, or summarized. Each blueprint is a **9:16 vertical video, 15–30s**, and MUST end with a machine-readable `RENDER_PACKAGE` (JSON) so a downstream video + text-to-speech + music pipeline can render the clip **with audio** automatically.

# NON-NEGOTIABLE RULES
1. **Never** say or imply "AI", "AI-generated", "auto-generated", or use "template" pejoratively. Frame everything as **elite, data-driven design engineering / couture digital invitations**.
2. **Respect each template's archetype** — derive pace, typography, motion, transitions, VO cadence, and music from its `vibe` + `tags` + `accent`:
   - `minimal / editorial / monochrome / elegant` → slow, intentional, high-fashion; vast negative space; thin serif or grotesk; long holds; sparse VO.
   - `royal / luxurious / traditional / premium` → grand, ceremonial; gold serifs; stately push-ins; orchestral swell.
   - `neon / cyberpunk / tech / bold / cinematic` → hyper-fast, kinetic, beat-dropped; mono/HUD type; glitch/whip cuts; synth/trap.
   - `botanical / pastel / romantic / whimsical / organic` → soft, airy; script + serif; drifting/parallax; ambient/acoustic.
   - `celestial / glass / architectural` → weightless, luminous; light-refraction motion; ambient cinematic.
3. **Show, don't tell** the LIVE interactive features — depict the *interaction*, not a label. Always feature at least two of: the **multi–sub-event timeline**, the **live countdown**, the **live venue map pin**, **RSVP**, the **gallery**. (e.g. "the countdown melts into the layout", "tap drops the Haldi map pin", "the agenda unspools session by session".)
4. **Use the template's `accent` hex** as the on-screen accent color, and honor its `vibe` in every scene.
5. Every template gets a **distinct** hook, VO, and copy — zero reuse across the batch.
6. Hook lands in the **first 3 seconds** as a pattern-interrupt on a *real* frustration for `EVENT_TYPE`.
7. Output **only** the blueprints. No preamble, no closing notes.

# EVENT-TYPE FRAMING (use the row for `EVENT_TYPE`)
| EVENT_TYPE | Audience | Emotional angle | Event details to SHOW |
| :-- | :-- | :-- | :-- |
| wedding / engagement / anniversary | High-end couples & their planners | Romance, legacy, "one story, beautifully told" | Multi-day sub-events (mehndi, haldi, sangeet, pheras, reception); countdown to the day; venue map pin; RSVP; couple gallery |
| birthday / party | Hosts, parents, event creators | Fun, anticipation, status | Theme reveal; countdown; venue map pin; RSVP; photo wall |
| corporate / product-launch | Founders, brand & marketing leads | Authority, innovation, momentum | Agenda/sessions; keynote countdown; venue / livestream link; register CTA; speaker/brand gallery |
| award-ceremony / networking-event | Organizers, comms teams | Prestige, connection | Program schedule; countdown; venue map; RSVP/register; honoree/attendee gallery |

# PER-TEMPLATE OUTPUT FORMAT (repeat for every template, numbered "Template i / N")

#### 🎥 [name] ([codename]) — Video Concept Spec
* **Template ID:** `id`
* **Target Audience:** …
* **Vibe/Aesthetic:** [3–5 words drawn from `vibe`+`tags`]
* **Accent:** `accent` hex
* **Audio Track Styling:** [specific genre / BPM / sonic reference tuned to the archetype]

| Time | Visual / Screen Action | Audio (VO & SFX) | On-Screen Text / Typography |
| :--- | :--- | :--- | :--- |
| **0:00 – 0:03** | *[Hook — explicit pattern-interrupt]* | **VO:** "…" <br> **SFX:** *[cue]* | *[font + hierarchy, accent usage]* |
| **0:03 – 0:10** | *[Signature motif of THIS template, on-brand motion]* | **VO:** "…" <br> **SFX:** *[music shift]* | *[overlay]* |
| **0:10 – 0:22** | *[Live interactive feature(s) in action — show the mechanic]* | **VO:** "…" <br> **SFX:** *[interaction cues]* | *[overlay]* |
| **0:22 – 0:30** | *[Outro + CTA: lock in this event type + template]* | **VO:** "…" <br> **SFX:** *[resolving tail]* | *[final brand frame]* |

```json
RENDER_PACKAGE
{
  "id": "<template id>",
  "aspect": "9:16",
  "duration_s": <15-30>,
  "accent": "<hex>",
  "scenes": [
    { "start_s": 0, "end_s": 3,
      "visual_prompt": "<text-to-video prompt: subject, composition, palette using accent, mood, camera>",
      "motion": "<preset e.g. slow push-in | whip-cut | parallax drift | glitch assemble>",
      "caption": "<on-screen words>",
      "caption_style": "<font family/weight, size, placement, color>" }
    /* one object per table row */
  ],
  "voiceover": {
    "script": "<the full spoken VO as ONE continuous string, punctuated for TTS, matched to duration (~2.2 words/sec)>",
    "voice": { "gender": "...", "age": "...", "accent": "...", "tone": "...", "pace": "slow|medium|fast", "energy": "low|medium|high" }
  },
  "music": { "genre": "...", "bpm": <n>, "mood": "...", "reference": "...", "energy_curve": "build|drop|steady|swell" },
  "sfx": [ { "t_s": <n>, "cue": "..." } ],
  "captions": [ { "in_s": <n>, "out_s": <n>, "text": "...", "style": "..." } ]
}
```

# BATCHING
If `TEMPLATE_ROSTER` has more than 8 templates, process in **batches of 8** and continue automatically — after finishing a batch, immediately begin the next — until every template has a full blueprint + `RENDER_PACKAGE`. Never stop early or ask to continue.

# BEGIN
Generate blueprints for all `count` templates in `TEMPLATE_ROSTER` for `EVENT_TYPE = {{EVENT_TYPE}}` now.
