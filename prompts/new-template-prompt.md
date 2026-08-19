<!--
HOW TO USE THIS FILE

  §1  WIRING CONTRACT   — the non-negotiable "how a template gets registered" block.
                          Every build prompt below refers to it. Don't paste it alone.
  §2  BUILD PROMPT      — generic template with {{SLOTS}}. Use for your own concepts.
  §3  WEDDING CONCEPTS  — 9 briefs, all built (kept as each template's record).
  §4  BIRTHDAY CONCEPTS — 9 briefs, all built (kept as each template's record).
  §5  BATCH + FOLLOW-UP — build several at once, generate previews, video blueprints, audit.

  Paste one §3/§4 prompt at a time into Claude Code from the repo root. One template per
  session/commit — they are 400–900 line files and reviewing them in isolation is the point.

  Roster check before you start (so you don't rebuild something that exists):
      node scripts/video-roster.mjs wedding
      node scripts/video-roster.mjs birthday
-->

# §1 — WIRING CONTRACT (referenced by every prompt below)

```
WIRING CONTRACT — a new template is not "done" until all of this is true.
Replace <id> with the lowercase single-word template id and <Id> with its PascalCase form.

1. components/templates/<id>/index.tsx
   - "use client" at the top. Named export `<Id>Template` typed as `TemplateComponent`.
   - Pure presentational: props are ONLY { event, subEvents, media }. No fetching, no
     Sheets access, no reading env vars.
   - Reuse the shared primitives where they fit instead of re-implementing:
     HeroMedia, MapEmbed, MusicToggle, ScrollProgress, Gallery, Countdown/EventCountdown,
     Timeline, AddToCalendar, RSVP, ScrollReveal, and components/templates/_fx.tsx.
   - Wrap editable text/images so the customer editor keeps working: use
     `useEditMode()` from components/edit/EditContext and EditableImage the same way
     the closest existing template does (read one first, copy its pattern exactly).
   - Drive colour from the `--accent` CSS variable with the template default as fallback,
     so `Theme/Accent Color` recolouring works.

2. components/templates/metadata.ts
   - `export const <id>Meta: TemplateMeta = { ... }` following the naming convention comment
     at the top of the file (name = what it's FOR, codename = the poetic identity,
     description = plain-English "who/when to use this", keywords = what a customer types).
   - `previewImage: "/template-previews/<id>.jpg"`.
   - `tags` may ONLY use values from the `TemplateTag` union in lib/types.ts. If a genuinely
     new tag is needed, add it to that union AND to `TAG_LABELS` at the bottom of metadata.ts.
   - Add `<id>Meta` to the `TEMPLATES_META` array under the correct section comment.

3. components/templates/TemplateRouter.tsx
   - Import `<Id>Template` and add `case "<id>": return <<Id>Template {...rest} />;`
     BEFORE the `case "royal": default:` fallback.

4. lib/dummyData.ts  (this is what the picker card and /e/DEMO-<ID> render)
   - `const <ID>_CODE = "DEMO-<ID>";` then a `DemoBundle` with a realistic event, 3–5
     subEvents with icons, and media using the existing SAMPLES/gallery helpers.
   - Register it in BOTH maps: `DEMO_EVENTS` (`[<ID>_CODE]: <id>,`) and
     `DEMO_CODE_BY_TEMPLATE` (`<id>: <ID>_CODE,`). Missing the second one silently
     breaks `getDemoCodeForTemplate()`.
   - **Append to the END of `DEMO_EVENTS`.** `dummyForEventType()` returns the FIRST
     bundle matching an event type, and `/events/<type>/<id>/preview` renders every
     template of that type with that one bundle. Inserting at the top hijacks the
     shared demo copy for all wedding (or birthday, …) previews site-wide.
   - Because of that same sharing, your own demo copy is NOT what the preview route
     shows — check `/e/DEMO-<ID>` for that. Write it well anyway: it is what a real
     customer's page looks like.

5. scripts/generate-template-previews.mjs
   - Add `{ id: "<id>", code: "DEMO-<ID>", type: "<primary event type>" }` to `TEMPLATES`.
   - Add `<id>: [...]` to `EVENT_TYPES_BY_TEMPLATE`, mirroring `eventTypes` in metadata.ts.

6. components/edit/EditableShell.tsx
   - Only if the hero draws its own countdown: add "<id>" to `TEMPLATES_WITH_INLINE_TIMER`.
   - Otherwise leave it out and let the shell render the universal timer.

7. Timer placement rules (CLAUDE.md §9a) — hero must be `min-h-[100svh]` (never a fixed px
   height) and reserve `pb-24`+ at the bottom so the fixed timer overlay sits on the image,
   never on text.

8. Fonts — the four Tailwind families (`font-serif` Cormorant, `font-display` Playfair,
   `font-sans` Inter, `font-script` Great Vibes, plus `font-condensed` / `font-marker` /
   `font-hand`) come from the `@import`s in app/globals.css. If a template needs another
   face, add it to that import and to `tailwind.config.ts`. Those `@import` lines MUST stay
   above the `@tailwind` directives — below them the compiled sheet puts the import after
   thousands of rules, where browsers drop it and every face silently falls back.
   Any full-bleed SVG using `preserveAspectRatio="none"` distorts into unrelated arcs at
   other aspect ratios: prefer a contained motif, or `vector-effect="non-scaling-stroke"`.
   Round any computed SVG coordinate (`Number(n.toFixed(2))`) — raw `Math.cos`/`sin` output
   differs between server and client render and React reports a hydration mismatch.

9. Design bar (CLAUDE.md §8) — plan the token system BEFORE coding: 4–6 named hex palette,
   a display + body + utility type trio, a one-line layout concept, and ONE signature element
   the template is remembered by. Do not fall back to the AI-default looks that section bans
   (cream + high-contrast serif + terracotta; near-black + one acid accent; hairline broadsheet
   rules with zero radius). Motion is one orchestrated load + scroll reveals + hover micro-
   interactions — not scattered effects.

10. Quality floor, non-negotiable: works at 375 / 768 / 1280 px with no horizontal scroll,
   visible keyboard focus, `prefers-reduced-motion` honoured (every animation has a reduced
   branch), alt text on images, AA contrast, and real empty states when media/subEvents are absent.

11. Before you report done:
    - `npx tsc --noEmit` clean and `npm run lint` clean.
    - Open `/events/<primary type>/<id>/preview` and `/e/DEMO-<ID>` and confirm both render.
    - Confirm the template appears in the picker for every type listed in `eventTypes`.
    - Report the file list you touched and anything you deliberately left out.
```

---

# §2 — GENERIC BUILD PROMPT (fill the slots)

```
Build a new event-website template for this repo: **{{TEMPLATE_NAME}}** (id `{{id}}`).

CONCEPT
{{2–4 sentences: the world the guest walks into, and why a customer picks this over the others}}

WHO IT'S FOR
{{the specific customer — culture, budget, age, occasion}}

TOKEN PLAN (use these, adjust only with a stated reason)
- Palette: {{4–6 named hex}}
- Type: display {{face}} / body {{face}} / utility {{face}}
- Layout concept: {{one line}}
- SIGNATURE ELEMENT: {{the one thing it's remembered by}}

SECTIONS, IN ORDER
{{hero → … → footer, with what each one does}}

METADATA
- eventTypes: {{[...]}}
- tags: {{only values from the TemplateTag union}}
- keywords: {{search phrases a customer would actually type}}
- icon: {{emoji}} · vibe: {{label}} + {{hex}} · accent: {{hex}}

DEMO DATA
{{names, city, date, 3–5 sub-events with icons, tagline, invitation message, about story}}

Then follow the WIRING CONTRACT verbatim: <paste §1 here>
```

---

# §3 — WEDDING TEMPLATE PROMPTS

Nine briefs, all BUILT - kept here as the record of what each template was asked to be.
Checked against the roster: no palace/celestial/glass/journey repeats.
Wedding templates should register `eventTypes: ["wedding", "engagement", "anniversary"]`
unless the concept only makes sense for one of them.

## 3.1 — Loom (`loom`) · handloom weave

```
Build a new wedding template for this repo: **Woven Vows** (id `loom`, codename "Loom").

CONCEPT
The wedding rendered as a handloom textile being woven in real time. Two coloured threads —
one per person — enter at the top of the page and, as the guest scrolls, cross into warp and
weft until the whole page is a finished Banarasi-weave panel. Every section sits inside the
fabric: sub-events are woven bands, the gallery is embroidery hoops, the map is a stitched
selvedge. For families whose wedding is about craft, inheritance and the sari that gets passed
down — the opposite of a palace fantasy.

WHO IT'S FOR
Indian weddings with a strong textile/heirloom story (Banarasi, Kanjeevaram, Patola, phulkari),
and design-literate couples who want warmth and handmade texture instead of gold-and-marble opulence.

TOKEN PLAN
- Palette: indigo #24365c · madder #a8323e · turmeric #d9a02b · undyed cotton #efe7d7 · ink #221c18
- Type: display = high-contrast serif with calligraphic stress, used only for names and section
  titles; body = humanist sans; utility = small-caps tracked sans for times/dates.
- Layout concept: one continuous vertical "cloth" — every section is a band of weave, separated
  by thread-count rules rather than whitespace gaps.
- SIGNATURE ELEMENT: an SVG loom that actually weaves. Two threads bearing the two names cross
  progressively with scroll progress; by the timeline section the interlace is complete and the
  motif locks into a repeating border that frames the rest of the page.

SECTIONS, IN ORDER
hero (min-h-[100svh], pb-24, threads entering + names) → the weave completes (couple intro,
about story on undyed ground) → sub-events as woven bands, ordered, each with a motif and dress
code → embroidery-hoop gallery (circular masks, lightbox) → venue on a stitched selvedge with
map + directions → RSVP as a hand-stamped label → footer with the finished motif.

METADATA
- eventTypes: ["wedding", "engagement", "anniversary"]
- tags: ["traditional", "artistic", "romantic", "organic", "elegant"]
- keywords: banarasi, handloom, saree wedding, textile, weave, heirloom wedding, craft wedding,
  indian wedding, patola, kanjeevaram, phulkari, artisanal
- icon: 🧵 · vibe: "Handloom" + #a8323e · accent: #a8323e

DEMO DATA
Aarav & Ishani, Varanasi, ghat-side haveli, March 2027. Sub-events: Thread Ceremony,
Mehndi on the Terrace, Sangeet, The Pheras, Vidaai Breakfast. Write the invitation message and
about story around a family loom and a sari woven for the bride's grandmother.

Then follow the WIRING CONTRACT verbatim: <paste §1 here>
```

## 3.2 — Monsoon Letters (`monsoon`) · postal correspondence

```
Build a new wedding template for this repo: **Letters in the Rain** (id `monsoon`, codename "Monsoon Letters").

CONCEPT
A wedding told entirely through paper correspondence during a monsoon. The hero is a
rain-streaked windowpane with an airmail envelope on the sill; scrolling opens the envelope,
and each section is a different piece of post — a telegram for the announcement, a folded
inland letter for the story, postcards for the sub-events, a wax-sealed card for the RSVP.
Rain runs down the glass throughout, and postmarks date-stamp each section.

WHO IT'S FOR
Couples doing an intimate, sentimental, long-distance or monsoon-season wedding — and anyone
who wants nostalgia and handwriting rather than cinematic spectacle.

TOKEN PLAN
- Palette: rain grey #6d7683 · airmail blue #1f4e79 · airmail red #b3352b · aged paper #f2ece0 ·
  sealing wax #7c1f2b
- Type: display = a warm slab or typewriter face for postmarks and telegram text; body = readable
  serif; utility = a restrained handwriting face used ONLY for signatures and captions (never body copy).
- Layout concept: a stack of overlapping paper objects on a dark wet-glass ground, each one
  arriving into place from a slightly different angle.
- SIGNATURE ELEMENT: envelopes that open on scroll — the flap lifts, the letter slides up and
  unfolds along its real crease lines, and the postmark stamps itself with a short ink bloom.

SECTIONS, IN ORDER
hero: window + rain + sealed envelope with the couple's names addressed on it (min-h-[100svh],
pb-24) → telegram: the announcement in monospace caps → inland letter, unfolding: about story →
postcard rack: sub-events, ordered, each a postcard with a stamp, time and venue on the reverse →
photo enclosures: gallery as prints tucked into a letter with corner mounts → address card:
venue, map, directions → wax-sealed RSVP → footer as a franked stamp strip.

METADATA
- eventTypes: ["wedding", "engagement", "anniversary"]
- tags: ["romantic", "editorial", "traditional", "artistic", "decent"]
- keywords: intimate wedding, monsoon wedding, letters, handwritten invitation, vintage postal,
  long distance love, telegram, nostalgic wedding, small wedding, elopement
- icon: ✉️ · vibe: "Monsoon Post" + #1f4e79 · accent: #1f4e79

DEMO DATA
Rohan & Tara, Kochi, July 2027 (deliberately monsoon season). Sub-events: Arrival Tea,
Mehndi Indoors, The Ceremony, Rain Dinner. Copy leans on eight years of letters between two cities.

Then follow the WIRING CONTRACT verbatim: <paste §1 here>
```

## 3.3 — Terracotta Courtyard (`courtyard`) · Kerala vernacular architecture

```
Build a new wedding template for this repo: **The Courtyard House** (id `courtyard`, codename "Nalukettu").

CONCEPT
The site is a traditional South Indian courtyard house seen from directly above its open
central square. Sunlight enters through that opening and, as the guest scrolls, the shaft of
light travels across the floor — dawn at the hero, high noon at the ceremony, lamplit dusk at
the dinner. Rooms around the courtyard hold the sections. Materials do the work: laterite,
jackfruit wood, brass, banana leaf, wet stone.

WHO IT'S FOR
South Indian, Kerala, Tamil and coastal weddings, and destination heritage-homestay weddings.
For couples who want rootedness and daylight rather than fantasy.

TOKEN PLAN
- Palette: laterite #9c4a2f · jackwood #4a3221 · brass #c08a3e · banana leaf #3f6b3a ·
  lime plaster #efe4d2
- Type: display = a serif with humid, slightly wide proportions for names; body = warm sans;
  utility = tracked caps for times.
- Layout concept: a square plan repeated at every scale — the hero is the courtyard opening,
  every section is a room off the veranda, and the timeline runs clockwise around the square.
- SIGNATURE ELEMENT: the travelling light. A single warm gradient shaft, driven by scroll
  progress, that moves across the courtyard floor and changes every section's ambient
  temperature as it passes — with a `prefers-reduced-motion` branch that simply sets a fixed
  midday position.

SECTIONS, IN ORDER
hero: overhead courtyard, names carved into the lime plaster, dawn light (min-h-[100svh], pb-24)
→ veranda: couple intro + about story between wooden columns → clockwise timeline of sub-events
as rooms, ordered, each with a brass lamp marker → gallery hung on the plaster wall with real
shadow → banana-leaf feast card (menu-style block) → venue: laterite plaque with map and
directions → RSVP carved into wood → footer at dusk with lit lamps.

METADATA
- eventTypes: ["wedding", "engagement", "anniversary"]
- tags: ["traditional", "architectural", "organic", "elegant", "romantic"]
- keywords: kerala wedding, south indian wedding, tamil wedding, nalukettu, heritage home,
  courtyard wedding, brass lamps, destination wedding india, homestay wedding, coastal wedding
- icon: 🪔 · vibe: "Courtyard" + #9c4a2f · accent: #9c4a2f

DEMO DATA
Vivek & Anjali, Thrissur, an ancestral tharavad, January 2027. Sub-events: Nalangu, Mehndi in
the Veranda, Muhurtham, Sadya Lunch, Reception. Copy about a house four generations have married in.

Then follow the WIRING CONTRACT verbatim: <paste §1 here>
```

## 3.4 — Spice Route (`spiceroute`) · cartographic voyage

```
Build a new wedding template for this repo: **The Spice Route** (id `spiceroute`, codename "Spice Route").

CONCEPT
A hand-drawn antique sea chart. The two families' home ports sit at opposite edges and a
dotted ink route is drawn between them as the guest scrolls, arriving at the wedding venue —
marked with an X. Each sub-event is a port of call along the route with its own compass
bearing and date. Sea monsters, rhumb lines, a compass rose, and paper that creases at the folds.

WHO IT'S FOR
Destination weddings, cross-city and cross-culture marriages, and couples who travel — a
journey metaphor that stays a map rather than becoming a vehicle.

TOKEN PLAN
- Palette: chart parchment #e8dcc0 · iron-gall ink #2f2a20 · sea teal #2c6e73 · cinnabar #b6452c ·
  gold leaf #b48a3c
- Type: display = engraved/copperplate-flavoured serif for place names; body = clean serif;
  utility = small caps for bearings and coordinates.
- Layout concept: one continuous chart that scrolls, with sections pinned to it as cartouches —
  no card stacks, everything is drawn ON the map.
- SIGNATURE ELEMENT: the route that draws itself — an SVG dotted path with a small ship or
  compass needle riding the scroll, each port lighting up as the ship passes and the wax X
  pressing itself onto the venue at the end.

SECTIONS, IN ORDER
hero: the full chart with two home ports and the couple's names as engraved place labels
(min-h-[100svh], pb-24) → cartouche: about story as a ship's-log entry → ports of call:
sub-events, ordered, each with bearing, time, venue, dress code → gallery as sketches pinned to
the chart margin → the X: venue cartouche with map embed and directions → RSVP as a manifest
sign-on → footer with compass rose and scale bar.

METADATA
- eventTypes: ["wedding", "engagement", "anniversary"]
- tags: ["traditional", "artistic", "editorial", "cinematic", "elegant"]
- keywords: destination wedding, travel wedding, map wedding, two cities, cross culture wedding,
  nautical, antique map, voyage, goa wedding, beach wedding
- icon: 🧭 · vibe: "Cartograph" + #2c6e73 · accent: #2c6e73

DEMO DATA
Kabir & Elena, Goa, November 2027, families from Lucknow and Lisbon. Sub-events: Welcome
Anchorage, Mehndi at the Fort, Beach Ceremony, Long Table Dinner, Sunrise Farewell.

Then follow the WIRING CONTRACT verbatim: <paste §1 here>
```

## 3.5 — Analog (`analog`) · 35mm film contact sheet

```
Build a new wedding template for this repo: **Shot on Film** (id `analog`, codename "Analog").

CONCEPT
The wedding as an undeveloped roll of 35mm film. The hero is a filmstrip with sprocket holes
running the full height of the viewport; the frames are blank at first and develop into images
as the guest scrolls, complete with light leaks, halation and a faint grain. The gallery is a
darkroom contact sheet with a chinagraph-marked selection. Sub-events are numbered exposures.
Warm, imperfect, human — the counterpoint to every polished cinematic template in the roster.

WHO IT'S FOR
Documentary-photography couples, small city weddings, second weddings, and anyone who wants
their site to feel like a photographer's own.

TOKEN PLAN
- Palette: darkroom black #17181a · safelight red #c0392f · Portra warm #e6c8a8 · emulsion cream
  #f3efe6 · silver #b9bec4
- Type: display = condensed grotesque set tight, like film-edge printing; body = neutral grotesque;
  utility = the tiny monospace of frame numbers and ISO markings.
- Layout concept: the page is a filmstrip. A persistent sprocket rail on one edge, frames as
  sections, edge-printing text running vertically alongside.
- SIGNATURE ELEMENT: frames that develop. Each image enters desaturated and low-contrast and
  resolves to full tone as it crosses the viewport centre, with a one-off light-leak flare on the
  hero; reduced-motion renders everything already developed.

SECTIONS, IN ORDER
hero: full-height filmstrip, names as edge-printing, one frame developing (min-h-[100svh], pb-24)
→ frame 01: couple intro + about story with a chinagraph circle → exposures: sub-events, ordered
and numbered as frames with times and venues → contact sheet gallery, grid of frames, lightbox
enlarges to a "print" → venue as a location slate with map + directions → RSVP as a lab order
form → footer with the end-of-roll leader and a frame count.

METADATA
- eventTypes: ["wedding", "engagement", "anniversary"]
- tags: ["editorial", "artistic", "modern", "monochrome", "cinematic"]
- keywords: film photography wedding, 35mm, analog, documentary wedding, contact sheet, grain,
  city wedding, photojournalistic, minimal wedding, darkroom
- icon: 🎞 · vibe: "Analog" + #c0392f · accent: #c0392f

DEMO DATA
Dev & Naina, Mumbai, February 2027, courthouse ceremony plus a rooftop dinner. Sub-events:
Registry at 11, Family Lunch, Rooftop Dinner, Late Walk. Keep copy dry, warm and specific.

Then follow the WIRING CONTRACT verbatim: <paste §1 here>
```

## 3.6 — Indigo Jaali (`jaali`) · lattice screens + blue pottery

```
Build a new wedding template for this repo: **Behind the Jaali** (id `jaali`, codename "Indigo Jaali").

CONCEPT
The whole page is seen through a carved sandstone jaali screen. Light falls through the lattice
in geometric patterns; as the guest scrolls, the screen's apertures widen and the pattern
resolves until the final section is fully open. Surfaces are Jaipur blue pottery — cobalt on
white with hairline crackle. Restrained, geometric, architectural: Mughal-Rajasthani order
rather than gold maximalism.

WHO IT'S FOR
North Indian, Rajasthani and Muslim weddings (nikah, walima), and couples wanting a cool
blue-and-white palette instead of the default gold.

TOKEN PLAN
- Palette: cobalt #1f4b8f · turquoise #2f9aa8 · sandstone #d8b98c · glaze white #f6f4ef ·
  night indigo #16224a
- Type: display = a geometric serif or a well-drawn Naskh-flavoured display for names;
  body = geometric sans; utility = tracked caps.
- Layout concept: everything sits on an eight-point-star grid; sections are arches, and the
  jaali overlay is a persistent, scroll-reactive layer above the page.
- SIGNATURE ELEMENT: the opening jaali — a real SVG lattice whose aperture size is driven by
  scroll, casting a matching pattern of light onto the content behind it. Reduced-motion pins it
  to a fixed half-open state.

SECTIONS, IN ORDER
hero: names read through the closed jaali, light pattern on the floor (min-h-[100svh], pb-24) →
arched niche: couple intro + about story on blue-pottery tiles → sub-events as a row of arches,
ordered, each with a tile motif, time, venue and dress code → gallery framed in cusped arches →
venue as a glazed plaque with map and directions → RSVP as a pressed tile → footer with the
lattice fully open.

METADATA
- eventTypes: ["wedding", "engagement", "anniversary"]
- tags: ["architectural", "elegant", "traditional", "royal", "artistic"]
- keywords: nikah, walima, muslim wedding, rajasthani wedding, jaipur, blue pottery, jaali,
  mughal, geometric wedding, blue and white wedding, udaipur
- icon: 🕌 · vibe: "Indigo Jaali" + #1f4b8f · accent: #1f4b8f

DEMO DATA
Zain & Alia, Jaipur, a haveli courtyard, December 2027. Sub-events: Mehndi, Nikah, Walima
Dinner, Qawwali Night. Copy respectful and specific; avoid generic "royal" language — this one
is about geometry and light.

Then follow the WIRING CONTRACT verbatim: <paste §1 here>
```

## 3.7 - Feast (`feast`) - the family cookbook  [BUILT]

```
Build a new wedding template for this repo: **One Long Table** (id `feast`, codename "Feast").

CONCEPT
The wedding as a family cookbook. Recipe cards on a kitchen table, an ingredient rail down
every card, handwritten notes in the margin, ghee stains where you'd expect them. For the
very large number of weddings where the food IS the event and nothing in the roster said so.

TOKEN PLAN
- Palette: turmeric #d9982b / tamarind #7a3b23 / banana leaf #3f7a3a / ghee cream #f6efdd / ink #2b2118
- Type: Playfair (dish names) / Inter (method) / Caveat (margin notes)
- Layout concept: ruled recipe cards, each with a left rule and a hand-written aside.
- SIGNATURE ELEMENT: the masala dabba - a seven-compartment spice tin that turns with scroll,
  one well per course.

SECTIONS  hero (a leaf is laid) -> the recipe, as an ingredient list + method -> the courses ->
photographs pinned in a binder -> the kitchen (venue) -> "how many plates should we lay?" (RSVP)
-> spice-strip footer.

METADATA  eventTypes ["wedding","engagement","anniversary"] / tags ["traditional","organic",
"artistic","romantic","appealing"] / icon food-pot / vibe "Kitchen Table" #7a3b23
```

## 3.8 - Panchang (`panchang`) - the almanac  [BUILT]

```
Build a new wedding template for this repo: **The Almanac Wedding** (id `panchang`).

CONCEPT
A ruled palm-leaf almanac page. Two North-Indian twelve-house charts slide in from opposite
sides and lock into a single chart; everything else lives in a table, because that is how a
muhurat wedding is actually organised. Diagrammatic, not starry - deliberately unlike the
celestial templates.

TOKEN PLAN
- Palette: saffron #e08a1e / vermilion #b3271f / indigo ink #22314f / palm leaf #e7dcc0 / ink #1a1712
- Type: Playfair (names) / Tiro Devanagari (numerals + seals) / Inter (body) / mono (timings)
- Layout concept: an almanac page - ruled lines, key/value rows, a stamped seal.
- SIGNATURE ELEMENT: the two charts converging and locking as the hero scrolls away.
- Invent no astrological data: derive every row from real event fields (date, muhurat window,
  place). A fabricated tithi is worse than none.

SECTIONS  hero (charts converge) -> the entry (story + date/muhurat/place rows + seal) ->
the timings table -> plates and portraits -> the place -> the register (RSVP) -> footer.

METADATA  eventTypes ["wedding","engagement","anniversary"] / tags ["traditional",
"architectural","editorial","elegant","artistic"] / vibe "Almanac" #b3271f
```

## 3.9 - Irani (`irani`) - Bombay cafe deco  [BUILT]

```
Build a new wedding template for this repo: **The Corner Cafe** (id `irani`).

CONCEPT
A Bombay Irani cafe booked out for the day - mint panelled walls, bentwood chairs, chequered
floor, mirror-etched signage, one very old ceiling fan. Warm and funny where the roster's
other city templates are cool and serious. Parsi lagan, or any wedding held in a room the
couple already loves.

TOKEN PLAN
- Palette: mint #a8c8b8 / bentwood #6b3f22 / signage red #c0392b / cream #f4eee2 / floor #1c1a17
- Type: Bebas Neue (signage + board) / Cormorant (menu copy) / mono (timings)
- Layout concept: a cafe interior read top to bottom, chequered bands closing each end.
- SIGNATURE ELEMENT: the split-flap board - each schedule row flips down on its hinge.

SECTIONS  hero (cafe front + etched signage) -> the corner table (story) + house rules board ->
on the board (schedule) -> framed on the wall -> the address -> the chit (RSVP) -> chequered footer.

METADATA  eventTypes ["wedding","engagement","anniversary"] / tags ["editorial","traditional",
"bold","artistic","cool"] / vibe "Cafe Deco" #c0392b
```

---

# §4 — BIRTHDAY TEMPLATE PROMPTS

Nine briefs, all BUILT - kept here as the record of what each template was asked to be.
Checked against the roster: no candy/arcade/toy/space/jungle/neon-city repeats.
Set `eventTypes: ["birthday"]`, plus `"party"` where the concept genuinely suits a party page.
Note the age target in each — the current birthday roster skews kids and clubbers; these fill
the 1st-birthday, teen, 21st and milestone gaps.

## 4.1 — Pop-Up Storybook (`popupbook`) · 1st birthday

```
Build a new birthday template for this repo: **First Year Storybook** (id `popupbook`, codename "Pop-Up").

CONCEPT
A paper pop-up children's book about the baby's first year. Each section is a spread that
lifts into 3D as it enters the viewport — cut-paper animals, layered hills, a felt sun on a
string. Twelve tiny month-cards form the "how we got here" strip. Sound-free, gentle, and
built for grandparents on a phone: big type, huge tap targets, nothing that flashes.

WHO IT'S FOR
First and second birthdays, naming ceremonies, and baby showers. Parents who want charm
without the sugar-rush maximalism of the candy/carnival templates.

TOKEN PLAN
- Palette: paper cream #fbf7ee · soft sky #a8cbe0 · leaf #8bbf7a · peach #f3b8a0 · ink brown #4b3a2f
- Type: display = a rounded friendly serif for the child's name and age; body = rounded sans;
  utility = handwritten-flavoured face for month labels only.
- Layout concept: paired spreads — every section is a left/right page with a visible gutter
  shadow and a soft page edge.
- SIGNATURE ELEMENT: pop-ups that stand up. Layered paper shapes rotate up along a hinge as
  their spread enters view (`transform-style: preserve-3d`, a real hinge origin), and fold flat
  again on exit. Reduced-motion keeps every pop-up standing, no rotation.

SECTIONS, IN ORDER
hero: the cover — child's name in large friendly type, a pop-up "1" standing up, age in months
(min-h-[100svh], pb-24) → spread: about the year, from the parents, in plain warm language →
twelve month-cards as a horizontal paper strip, photo per month, keyboard-scrollable → the party
spread: sub-events ordered, each with a paper icon, time, venue → gallery as photos tucked into
paper corner slots → venue spread with map, directions and a "bring nothing but yourselves" note →
RSVP as a reply card → back cover footer.

METADATA
- eventTypes: ["birthday"]
- tags: ["playful", "pastel", "whimsical", "appealing", "decent"]
- keywords: first birthday, 1st birthday, one year old, baby birthday, naming ceremony,
  storybook, pop up book, kids party, second birthday, cake smash
- icon: 📖 · vibe: "Pop-Up" + #f3b8a0 · accent: #f3b8a0

DEMO DATA
Ira turns One, Pune, a garden clubhouse, a Sunday brunch. Sub-events: Cake Smash, Puppet Show,
Garden Lunch, Nap Hour (yes, keep that one — it's the joke that sells the template).

Then follow the WIRING CONTRACT verbatim: <paste §1 here>
```

## 4.2 — Locker (`locker`) · Sweet 16 scrapbook

```
Build a new birthday template for this repo: **Sweet Sixteen Locker** (id `locker`, codename "Locker").

CONCEPT
The inside of a school locker door, decorated by the friend group. Polaroids taped at angles,
washi tape, a mirror, ticket stubs, gel-pen notes, a playlist taped to the shelf, a magnetic
countdown. Scrolling pulls the guest from the locker door into a full scrapbook spread of
pages. Loud, personal, hand-made — a birthday page that looks like the friends made it, not a studio.

WHO IT'S FOR
Sweet 16s, 13th–18th birthdays, and friend-group parties. The current roster has nothing in
this register — it jumps from kids' themes straight to club nights.

TOKEN PLAN
- Palette: locker teal #2f8f8a · hot pink #ee4f8b · highlighter yellow #f5e14b · notebook white
  #f7f7f4 · graphite #2b2b2b
- Type: display = a bold marker/brush face for the name and age; body = neat rounded sans;
  utility = a school-handwriting face for margin notes.
- Layout concept: a deliberately messy collage on a strict grid underneath — every taped object
  is rotated 1–4° but aligned to invisible columns so it never actually looks broken.
- SIGNATURE ELEMENT: taped Polaroids the guest can peel — hover/tap lifts a photo off the tape
  with a small spring, revealing a handwritten note underneath. Works on touch, and reduced-motion
  shows the note without the lift.

SECTIONS, IN ORDER
hero: locker door, name in marker, "16" magnets, countdown as magnetic digits (min-h-[100svh],
pb-24) → taped note: the invitation in the birthday kid's own voice → the plan: sub-events as
ticket stubs, ordered, with times and venue → peel-photo wall: gallery → playlist card taped to
the shelf (track list, no audio autoplay; music toggle stays opt-in) → getting there: map, a
hand-drawn arrow, directions → RSVP as a note passed in class → footer as the locker shutting.

METADATA
- eventTypes: ["birthday", "party"]
- tags: ["playful", "vibrant", "whimsical", "bold", "cool"]
- keywords: sweet 16, sweet sixteen, 16th birthday, teen birthday, 18th birthday, scrapbook,
  polaroid, friends party, high school, collage, 13th birthday
- icon: 🔓 · vibe: "Locker" + #ee4f8b · accent: #ee4f8b

DEMO DATA
Anaya turns 16, Bengaluru, a terrace party. Sub-events: Pre-Party Pizza, The Reveal, Dance Floor,
Sleepover. Copy in a 16-year-old's voice, not a parent's.

Then follow the WIRING CONTRACT verbatim: <paste §1 here>
```

## 4.3 — Speakeasy (`speakeasy`) · 21st / art deco

```
Build a new birthday template for this repo: **The Speakeasy** (id `speakeasy`, codename "Prohibition").

CONCEPT
A hidden 1920s bar behind an unmarked door. The hero is that door with a small sliding
peephole; opening it (scroll or click) admits the guest and the page descends into a brass-and-
velvet room. Art-deco geometry, a gramophone, a cocktail menu, a jazz-band bill for the
sub-events. Grown-up and stylish — the opposite of the existing neon club templates, which are
all modern EDM energy.

WHO IT'S FOR
21st and 30th birthdays, cocktail evenings and Gatsby-themed parties. Also doubles as a
sophisticated adult party page.

TOKEN PLAN
- Palette: velvet oxblood #4a1220 · brass #c39a4d · cigar black #14100e · absinthe #6f8f5e ·
  ivory #ede3d0
- Type: display = a geometric deco face (think chevrons and high waists) for the name and age;
  body = an elegant serif; utility = tracked deco caps for times and prices.
- Layout concept: symmetrical deco panels — every section is a framed panel with stepped corners
  and a centred axis, stacked like the pages of a cocktail menu.
- SIGNATURE ELEMENT: the entry. The peephole slides open on the hero, and the page performs one
  orchestrated descent — the door swings, brass fills in, the gramophone starts (muted, with an
  opt-in toggle). It happens exactly once; reduced-motion opens straight into the room.

SECTIONS, IN ORDER
hero: unmarked door, peephole, the guest's password (the birthday person's name) and age set in
deco type (min-h-[100svh], pb-24) → the room: invitation copy on velvet → the bill: sub-events as
a jazz-band running order, ordered, with times and venue → cocktail menu (dress code, house pour,
what to expect) → gallery as framed brass portraits → the address, "tell them who sent you", map
and directions → RSVP as a guest-list sign-in → footer with a deco sunburst.

METADATA
- eventTypes: ["birthday", "party"]
- tags: ["elegant", "luxurious", "premium", "bold", "cinematic"]
- keywords: 21st birthday, 30th birthday, speakeasy, gatsby party, art deco, roaring twenties,
  cocktail party, prohibition, jazz age, black tie birthday
- icon: 🥂 · vibe: "Prohibition" + #c39a4d · accent: #c39a4d

DEMO DATA
Kabir turns 21, Delhi, a basement bar in Mehrauli, 9pm onwards. Sub-events: Doors & Password,
Live Quartet, Cocktail Hour, Late Set. Dress code: "1920s, or your best attempt."

Then follow the WIRING CONTRACT verbatim: <paste §1 here>
```

## 4.4 — Almanac (`almanac`) · milestone 40/50/60

```
Build a new birthday template for this repo: **The Almanac** (id `almanac`, codename "Almanac").

CONCEPT
A newspaper front page from the day the birthday person was born, which then walks decade by
decade through their life as broadsheet spreads. Real editorial furniture: masthead, dateline,
column rules, a weather box, a crossword, small ads, a photo with a caption in italics.
Sub-events are printed as a schedule notice. Warm and funny rather than solemn.

WHO IT'S FOR
40th, 50th, 60th, 70th birthdays and retirement parties — usually organised by adult children
for a parent. Nothing in the current roster serves this customer.

TOKEN PLAN
- Palette: newsprint #eae5da · press black #1b1b1b · ink blue #24405e · stamp red #a3241f ·
  halftone grey #8d8b85
- Type: display = a proper newspaper display serif for the masthead and headlines; body = a
  compact reading serif in real columns; utility = condensed caps for kickers and captions.
- Layout concept: a genuine multi-column grid with vertical rules, one dominant headline per
  spread, and a photo whose caption sits directly beneath it.
- SIGNATURE ELEMENT: halftone photographs. Photos print in a dot pattern and resolve to full
  tone as they enter view, with the headline typing in above them one line at a time. Reduced-
  motion prints everything already resolved.

SECTIONS, IN ORDER
hero: front page — masthead with the birth date as the dateline, the name as the lead headline,
age as the edition number (min-h-[100svh], pb-24) → the lead story: about them, written by the
family → decade spreads: one per decade, each with a headline, photo and a two-column story →
schedule notice: sub-events, ordered, with times and venue, set as a printed public notice →
gallery as a picture desk contact page → the venue, as a classified ad with map and directions →
RSVP as a letter to the editor → footer with a print run and edition line.

METADATA
- eventTypes: ["birthday"]
- tags: ["editorial", "traditional", "monochrome", "decent", "elegant"]
- keywords: 50th birthday, 60th birthday, 40th birthday, milestone birthday, retirement party,
  newspaper, born on this day, decades, surprise party, dad birthday, mum birthday
- icon: 📰 · vibe: "Almanac" + #24405e · accent: #24405e

DEMO DATA
Sunil turns 60, Chandigarh, a garden lunch hosted by his children. Sub-events: Arrival & Tea,
The Toasts, Lunch, Slideshow. Decade headlines should be specific and affectionate — first job,
the move, the kids, the garden.

Then follow the WIRING CONTRACT verbatim: <paste §1 here>
```

## 4.5 — Manga Arc (`manga`) · teen shonen

```
Build a new birthday template for this repo: **Birthday Arc** (id `manga`, codename "Manga Arc").

CONCEPT
The birthday as a manga volume. Black-and-white panels with screentone, speed lines, action
onomatopoeia and a full-bleed chapter cover for the hero. Panels assemble on scroll like a page
being inked; the party details arrive as a "mission briefing" panel; one single spot colour (the
accent) is the only colour on the page and it lands on exactly one thing per section.

WHO IT'S FOR
Teen and young-adult birthdays (12–25) in the anime/manga fandom — a large, badly-served
audience. Distinct from the existing western-cartoon and neon-Tokyo-city templates: this is
print, monochrome and panel-driven.

TOKEN PLAN
- Palette: ink #0e0e10 · page white #f7f5f0 · screentone grey #c9c7c1 · spot accent #e6352b ·
  panel gutter #ffffff
- Type: display = a heavy brush/impact face for the chapter title and SFX; body = a clean
  comic-lettering sans in sentence case; utility = small caps for panel numbers.
- Layout concept: irregular panel grids — diagonal gutters, one full-bleed splash per section,
  reading order kept unambiguous and DOM order matching visual order for screen readers.
- SIGNATURE ELEMENT: panels that ink themselves. Each panel enters as rough pencil, then inks in
  and fills with screentone, with speed lines converging on the section's focal point; the hero
  splash gets an SFX word that stamps in at scale. Reduced-motion renders fully inked panels.

SECTIONS, IN ORDER
hero: chapter cover — "Chapter 18", the birthday name as the title, a splash portrait, one spot
of accent (min-h-[100svh], pb-24) → character panel: about them as a stats card (name, age,
special move) with the invitation copy → mission briefing: sub-events as numbered panels,
ordered, with times, venue, dress code → gallery as a manga page of photo panels with tone →
map panel: the venue drawn as an establishing shot, with the real map embed and directions →
RSVP as a "join the party" call-out → footer as a "to be continued" bumper.

METADATA
- eventTypes: ["birthday", "party"]
- tags: ["bold", "monochrome", "playful", "cool", "artistic"]
- keywords: anime birthday, manga birthday, teen birthday, 18th birthday, shonen, otaku,
  comic birthday, cosplay party, 16th birthday, gaming birthday
- icon: 💥 · vibe: "Manga Arc" + #e6352b · accent: #e6352b

DEMO DATA
Aryan turns 18, Hyderabad, an arcade-and-ramen night. Sub-events: Power-Up (arrival), Boss Fight
(games tournament), Ramen Feast, After-Credits. Keep the copy funny and in-universe.

Then follow the WIRING CONTRACT verbatim: <paste §1 here>
```

## 4.6 — Match Day (`matchday`) · stadium

```
Build a new birthday template for this repo: **Match Day** (id `matchday`, codename "Match Day").

CONCEPT
A stadium on the night of the big game, where the birthday person is the fixture. Hero is the
players' tunnel opening onto floodlights and a crowd, with the name on the back of a shirt and
the age as the squad number. Scoreboard countdown, a team sheet, a fixture list for the
sub-events, and a chant that scrolls across the stand as a tifo banner.

WHO IT'S FOR
Sports-mad birthdays across the whole age range — kids' football parties, cricket-mad teens,
and 30th/40ths for people whose weekend is a club. Nothing in the roster covers sport.

TOKEN PLAN
- Palette: pitch green #1f7a3f · floodlight white #f4f7f4 · night stand #0d1b16 · kit gold #e8b53a ·
  chalk line #dfe6df
- Type: display = a wide condensed sports face for the name, number and scoreboard; body =
  neutral grotesque; utility = a stencil/scoreboard face for times and scores.
- Layout concept: pitch geometry — chalk-line dividers, centre-circle framing for the hero,
  penalty-box grids for cards, and a persistent scoreboard strip.
- SIGNATURE ELEMENT: the tunnel walk-out. One orchestrated entrance where the tunnel walls slide
  past, floodlights bloom in, and crowd noise stays muted behind the opt-in music toggle; then a
  scoreboard countdown to kick-off (use the shared countdown so the customer's timer settings
  still apply). Reduced-motion opens on the pitch with lights already up.

SECTIONS, IN ORDER
hero: tunnel → pitch, shirt with name and squad-number age, scoreboard countdown to kick-off
(min-h-[100svh], pb-24) → team sheet: about the birthday person as a player profile plus the
invitation copy → fixture list: sub-events, ordered as a match schedule with kick-off times and
venue → tifo banner: a full-width chant/quote → gallery as a matchday programme spread → stadium
info: venue, gate, map and directions → RSVP as a ticket claim → footer as a full-time whistle.

METADATA
- eventTypes: ["birthday", "party"]
- tags: ["bold", "vibrant", "cool", "modern", "appealing"]
- keywords: football birthday, soccer party, cricket birthday, sports birthday, stadium,
  kids football party, jersey, matchday, 30th birthday, team party, ipl
- icon: ⚽ · vibe: "Match Day" + #1f7a3f · accent: #1f7a3f

DEMO DATA
Rehan turns 10, Mumbai, a five-a-side turf party. Sub-events: Warm-Up, Kick-Off (the match),
Half-Time Snacks, Trophy Ceremony, Full Time Cake. Team-sheet copy: position "striker",
special skill "never passes".

Then follow the WIRING CONTRACT verbatim: <paste §1 here>
```

## 4.7 - Ludo (`ludo`) - the board game  [BUILT]

```
Build a new birthday template for this repo: **Board Game Party** (id `ludo`).

CONCEPT
A printed board where the plan IS the path. Four corner bases, a home square holding the age,
dice that settle, and squares in sequence for the schedule. For kids' parties and family games
nights - distinct from Treasure Hunt (pirate map) and Toy Universe (toys).

TOKEN PLAN
- Palette: board cream #f7f1e3 / red #d94a3d / yellow #f2b13c / green #3f9d63 / blue #2f6fb3 / ink #23201c
- Type: Permanent Marker (name, numbers) / Inter (rules) / Caveat (asides)
- Layout concept: printed board furniture - hard offset shadows, no gradients, no glow.
- SIGNATURE ELEMENT: the counter - a token that advances down the track as you scroll.

SECTIONS  hero (board + home square + dice) -> the rules (story as a numbered list) ->
the board (schedule as squares) -> the players (gallery) -> the table (venue) -> roll to join
(RSVP) -> colour-strip footer.

METADATA  eventTypes ["birthday","party"] / tags ["playful","vibrant","whimsical","appealing",
"festive"] / vibe "Board Game" #d94a3d
```

## 4.8 - Tour (`tour`) - one-night tour  [BUILT]

```
Build a new birthday template for this repo: **One Night Only** (id `tour`, codename "The Tour").

CONCEPT
A fly-poster tour announcement. Stacked poster type on newsprint with torn edges, a setlist
instead of a schedule, a ticket stub for the venue, and an access-all-areas laminate on a
lanyard. Print-poster energy, not club-night neon - nothing in the roster occupied it.

TOKEN PLAN
- Palette: poster black #141414 / newsprint #efe9dd / hot ink #ff3b30 / electric #2b5fd9 / gold #d9a521
- Type: Bebas Neue (poster type) / Inter (body) / mono (dates)
- Layout concept: pasted-up posters, each rotated a degree or two, hard rules between.
- SIGNATURE ELEMENT: the laminate - swings once on its lanyard as it arrives, then hangs.

SECTIONS  hero (poster + THE {age} TOUR + laminate) -> backstage (story + house facts) ->
setlist -> the wall (gallery) -> the venue + ticket stub -> get on the list (RSVP) -> footer.

METADATA  eventTypes ["birthday","party"] / tags ["bold","editorial","cool","modern",
"monochrome"] / vibe "Tour Poster" #ff3b30
```

## 4.9 - New Game+ (`newgame`) - RPG save file  [BUILT]

```
Build a new birthday template for this repo: **New Game Plus** (id `newgame`, codename "Save File").

CONCEPT
An RPG save screen. Bordered windows on a dark field, HP/MP/EXP bars, a quest log for the
schedule, an inventory grid of photos, scanlines over everything. For gamers of any age -
distinct from Retro Arcade (synthwave) and Robot City (kids' robots) because it is menu UI.

TOKEN PLAN
- Palette: void #0a0d18 / panel #1c2547 / window white #e9eef7 / gold #ffd166 / hp green #4ade80
- Type: Press Start 2P (HUD only - never body copy) / mono (stats) / Inter (longer copy)
- Layout concept: RPG menu furniture, square corners, 3px borders, nothing rounded.
- SIGNATURE ELEMENT: the dialogue box - the invitation types itself out character by
  character with a blinking advance arrow. Keep the full string in aria-label so screen
  readers get it in one piece.

SECTIONS  hero (file select: name, LV, stat bars, PRESS START) -> dialogue box (story) ->
quest log (schedule) -> inventory (gallery) -> world map (venue) -> join party (RSVP) -> footer.

METADATA  eventTypes ["birthday","party"] / tags ["tech","playful","cool","bold",
"interactive"] / vibe "Save File" #ffd166
```

---

# §5 — BATCH + FOLLOW-UP PROMPTS

## 5.1 — Build several in one run (only when you'll review them together)

```
Build these <N> new templates, one at a time, committing after each:
  1. <id> — <name> (spec: prompts/new-template-prompt.md §<x.y>)
  2. <id> — <name> (spec: prompts/new-template-prompt.md §<x.y>)

Rules:
- Finish and verify template N completely (wiring contract step 10) before starting N+1.
- They must not converge. Before starting each one, state its palette, type trio and signature
  element, and confirm none of them repeat a previous template in this batch or in the existing
  roster (`node scripts/video-roster.mjs <type>`).
- Follow the WIRING CONTRACT in prompts/new-template-prompt.md §1 for every template.
- Report at the end: files touched per template, tsc/lint status, and anything you skipped.
```

## 5.2 — Generate the picker preview images

```
The new templates <ids> are wired up. Generate their preview images:
- Start the dev server, then run: npm run previews  (env PREVIEW_ONLY=<comma-separated ids>)
- Also run npm run previews:mobile for the same ids.
- Confirm public/template-previews/<id>.jpg exists for each and that the shot captures the
  hero's signature element (if it's mid-animation or blank, add a settle delay for that id
  rather than changing the template).
```

## 5.3 — Video ad blueprints for the new templates

```
Regenerate the roster and produce video blueprints for the new templates only:
  node scripts/video-roster.mjs <eventType> -o blueprints/<eventType>-roster.json
Then follow prompts/video-batch-prompt.md, substituting that JSON into {{TEMPLATE_ROSTER}} and
the type into {{EVENT_TYPE}}, and write each result to blueprints/<eventType>/<id>.json in the
same shape as blueprints/wedding/royal.json.
```

## 5.4 — Audit a template you just built (run this in a fresh session)

```
Audit components/templates/<id>/index.tsx against CLAUDE.md §8 (design bar), §9 (interactivity)
and §9a (timer placement), plus the wiring contract in prompts/new-template-prompt.md §1.

Check specifically, and report file:line for each failure:
- Is it registered in all five places (metadata.ts + TEMPLATES_META array, TemplateRouter.tsx,
  dummyData.ts + DEMO_EVENTS, generate-template-previews.mjs TEMPLATES + EVENT_TYPES_BY_TEMPLATE)?
- Do all `tags` exist in the TemplateTag union?
- Hero: `min-h-[100svh]` and `pb-24`+ bottom clearance so the timer overlay can't hit text?
- Does every animation have a `prefers-reduced-motion` branch?
- 375 / 768 / 1280 px with no horizontal scroll; visible focus rings; alt text; AA contrast?
- Does it still render with zero media and zero subEvents (real empty states, not gaps)?
- Does it read as its own identity, or is it a recolour of an existing template? Name the closest
  existing template and say what actually differentiates them.
Fix what you find, then re-verify with tsc and lint.
```
