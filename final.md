# Event Platform — Complete Feature & Implementation Guide

> A comprehensive reference for understanding, enhancing, and extending the event platform. This document serves as the single source of truth for all features, flows, UI components, and technical implementation.

**Generated:** 2026-07-26  
**Platform:** Next.js (App Router) + TypeScript + Tailwind CSS  
**Data Store:** Google Sheets | **Media:** Cloudinary | **Deploy:** Vercel

---

## Table of Contents

1. [Platform Overview](#platform-overview)
2. [User Roles & Surfaces](#user-roles--surfaces)
3. [Complete Feature List](#complete-feature-list)
4. [All Templates (80 Total)](#all-templates-80-total)
5. [User Flows & Journeys](#user-flows--journeys)
6. [Data Model & Sheets Structure](#data-model--sheets-structure)
7. [All UI Components & Parts](#all-ui-components--parts)
8. [Authentication & Security](#authentication--security)
9. [API Routes (Complete Reference)](#api-routes-complete-reference)
10. [Media Handling Pipeline](#media-handling-pipeline)
11. [Environment Variables](#environment-variables)
12. [File Structure & Key Files](#file-structure--key-files)
13. [Design System & Tokens](#design-system--tokens)
14. [Advanced Features & Patterns](#advanced-features--patterns)
15. [Testing & QA Checklist](#testing--qa-checklist)
16. [Performance & Optimization](#performance--optimization)

---

## Platform Overview

The Event Platform is a **no-always-on-server**, **serverless template-driven event website builder** where:

1. **Visitors** pick an event type (Wedding, Birthday, Engagement, Anniversary, Corporate) and template, then submit an enquiry.
2. **Admin** reviews enquiries in a CRM portal, approves qualified leads, and issues approval.
3. **Approved customers** access a private editor via magic-link token (+ email OTP) where they fill in event details, upload media, and publish.
4. **Guests** view the live public event site with countdown, gallery, venue map, RSVP, and timeline.
5. **Admin** can stop/resume active events or edit event details on behalf of the customer.

**Core Principles:**
- **Data-driven templates:** All templates are pure presentation components; content is stored in Google Sheets.
- **Staging model:** Media uploads are staged locally until the customer explicitly publishes.
- **No accounts:** Customers use magic-link tokens + email OTP (two-factor auth).
- **ISR + on-demand revalidate:** Public event sites are cached but refresh instantly when edited.
- **Admin override:** Admin can edit any event detail without involving the customer.

---

## User Roles & Surfaces

| Role | Primary Surface | What They Do | Auth Method |
|------|-----------------|--------------|-------------|
| **Visitor** | Landing + template picker + enquiry form | Discover event types, pick a template, submit an enquiry | None (public) |
| **Customer** (approved) | `/manage/[token]` (private editor) | Fill event info, upload media, manage sub-events, publish | Magic-link token + email OTP (6-digit code, 2FA) |
| **Admin** | `/admin/*` (portal) | Review enquiries, approve leads, edit live events, stop/resume | Email + password (credentials in env) |
| **Guest** | `/e/[code]` (public end portal) | View the live event site, see countdown, gallery, RSVP | Public (no auth) |

---

## Complete Feature List

### A. Visitor Features (Landing → Enquiry)

1. **Landing page** (`/`) — showcase all event types with hero imagery and CTAs.
2. **Event type browser** (`/events/[type]`) — filter templates by event type (Wedding/Birthday/Engagement/Anniversary/Corporate/Party/Product Launch/Awards).
3. **Template picker grid** — curated first page (6 desktop / 2 mobile) + "View all" toggle; search + tag filters.
4. **Template preview** — hover/tap a template thumbnail to see:
   - Name, description, event types it supports
   - Visual preview (static screenshot or live demo)
   - "Choose this template" button
5. **Enquiry form** (`/enquiry`) — collects:
   - Full Name, Email (validated), Mobile (with country code)
   - Event Type (radio: Wedding/Birthday/Engagement/Anniversary/Corporate)
   - Event Sub-type (optional; depends on type)
   - Template selection (picker carries through)
   - Event Title, Person 1 Name, Person 2 Name (optional)
   - Tentative Date (date picker)
   - City
   - Message (optional internal note)
   - Submit → generates Event Code, creates Drive folder, writes to Enquiries sheet.
6. **Confirmation page** (`/enquiry/thanks`) — shows Event Code, thanks message, set expectations ("Admin will be in touch").

### B. Customer Features (After Approval)

1. **Magic-link token access** — email contains secret link `/manage/<token>`.
2. **Email OTP login** — two-factor gate:
   - Enter the email used in the enquiry
   - Receive 6-digit OTP via email (or log to console in dev)
   - Enter the OTP to unlock the editor
   - Session cookie set for 30 days (or until customer signs out or admin rotates the token)
   - Rate limits: max 5 OTP requests/email/hour; max 5 wrong codes before 15-min lockout.
3. **Inline text editors** — every public string is editable:
   - Title, tagline, person 1/2 names
   - Invitation message, about/story
   - Event date, start/end time, city
   - Venue name, address, map link, latitude/longitude
   - Contact name, phone, email, social link
   - RSVP link/contact
4. **Section toggles** — show/hide blocks:
   - Hide Story (invitation/about block)
   - Hide Events (sub-events timeline)
   - Hide Gallery
   - Hide Venue (venue card + map)
   - RSVP Enabled
5. **Sub-events CRUD** — manage timeline entries:
   - Add new sub-event (Haldi / Mehendi / Sangeet / Reception, etc.)
   - Edit name, date, start/end time, venue (per sub-event), dress code, description, icon
   - Reorder with up/down arrows
   - Delete individual events
   - Map link + lat/long for each (each sub-event can have its own venue + map pin)
6. **Media management** — upload, crop, caption, reorder, delete:
   - **Upload:** "Add photos" tile in gallery or panel button → multi-file modal → per-file caption
   - **Crop & adjust:** image editor (crop, zoom/pan, rotate 90°, aspect presets, best-fit default)
   - **Non-destructive cropping:** Cloudinary transforms keep the original; can re-crop later
   - **Replace:** swap an image/video without reordering
   - **Captions & sections:** assign each media to a section (hero / gallery / couple / sub-event)
   - **Autoplay toggle:** for videos
   - **Reorder:** drag-up/down or via the side panel
   - **Delete:** remove from gallery
   - **Staging:** all edits are local drafts; nothing commits to the sheet until **Save and publish**
7. **Look & feel** — customize appearance:
   - Accent color picker (hex) → drives CSS `--accent` variable
   - Optional background music URL toggle
8. **Template switcher** — if `Can Change Template = TRUE` (admin grants):
   - Lists templates that support this event's type
   - Switching updates `Template ID` and revalidates the public site
   - Content + media + sub-events carry over (templates are pure presentation)
9. **Publish workflow** — two paths:
   - **Auto-publish on complete:** first save where required fields are present (Title, Date, Venue) sets `Is Active = TRUE` and revalidates `/e/<code>`
   - **Manual republish:** explicit "Save and publish" button forces revalidate
10. **Site control** — customer can stop/resume their own event:
    - Toggle button in the editor panel (no admin intervention needed)
    - Sets `Is Active` directly; revalidates immediately
11. **Edit window** — editable until `Active Until` date (defaults to Main Date + grace). After that, editor is read-only.
12. **Sign out** — clears the session cookie; next visit requires OTP login again.
13. **Session timeout** — 30-day TTL; can be extended by activity or refreshed by sign-out + re-login.

### C. Admin Features (CRM & Event Control)

1. **Admin login** (`/admin/login`) — email + password:
   - Credentials checked against env (`ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`)
   - Single admin for v1; format is `email:bcrypt` (CSV-ready for multi-admin)
   - Rate limit: 5 failed attempts per email per 15 min → lockout
   - Session cookie (8-hour TTL); re-login required after
2. **Dashboard** (`/admin`) — executive overview:
   - Counts by Status (New / Contacted / Approved / Not Interested)
   - Live event status (Active / Stopped / Expired)
   - Total Paid Amount (all enquiries)
   - Recent enquiries (last 10)
3. **Enquiries CRM** (`/admin/enquiries`) — lead pipeline:
   - Table: Code, Name, Type, Template, Date, Status, Interested, Paid Amount
   - Filter by Status / Interested / Paid status
   - Search by name / code / mobile
   - Click row → detail view
4. **Enquiry detail** (`/admin/enquiries/[code]`) — work the lead:
   - View all enquiry fields (read-only: Name, Email, Mobile, Type, Subtype, Date, City, Message)
   - Edit operational columns:
     - `Query Addressed` (TRUE/FALSE)
     - `Interested` (Yes / No / Maybe)
     - `Paid Amount` (number)
     - `Payment Status` (Pending / Paid)
     - `Payment Date`
     - `Last Contacted On` (auto-updated on edit)
     - `Internal Notes` (call notes, observations)
   - Actions:
     - **Mark Not Interested:** sets Interested=No, Status=Not Interested (lead is lost)
     - **Approve:** allowed only when Interested=Yes AND Payment Status=Paid
       - Copies shared cols 1–14 to Live tab
       - Generates random `Access Token`
       - Prompts for `Can Change Template` (yes/no)
       - Sets `Status = Approved`, `Approved = TRUE`
       - Shows two links to copy or email to customer:
         - Edit link: `/manage/<token>`
         - Live link: `/e/<code>` (public, goes live when Is Active=TRUE)
5. **Live events list** (`/admin/events`) — active event control:
   - Table: Code, Name, Type, Template, Date, Status (Active/Stopped/Expired), Active Until
   - Click → event detail
   - **Stop button:** sets `Is Active = FALSE`, revalidates `/e/<code>` (shows "not currently available" placeholder)
   - **Resume button:** sets `Is Active = TRUE`, revalidates (site goes live again)
   - Quick links to `/e/<code>` and `/manage/<token>` (if issued)
6. **Event detail / admin editor** (`/admin/events/[code]`) — full override:
   - Inline editor for any `Live` row column:
     - Content: title, tagline, person names, message, about, date/time, city
     - Venue: name, address, map link, lat/long
     - Contact: name, phone, email, social
     - Theme: accent color, background music
     - RSVP: link/contact, type
     - Sections: all hide toggles
   - Full CRUD on SubEvents (add/edit/delete/reorder)
   - Full CRUD on Media (upload/crop/caption/reorder/delete) — same pipeline as customer
   - Save triggers `/api/revalidate /e/<code]`
   - Admin can do all customer editor operations without issuing a token
7. **Token rotation** (`/api/admin/rotate-token/route.ts`) — security:
   - Admin button regenerates `Access Token`
   - Invalidates any existing customer session (forces fresh OTP login)
   - Used if token is suspected compromised or to lock out a customer
8. **Logout** — clears admin session cookie; redirects to `/admin/login`.

### D. Guest Features (Public Event Site `/e/[code]`)

1. **Countdown timer** — displays remaining time to `Main Date`:
   - Five customizable design options: glass / minimal / flip / rings / neon / elegant
   - Sticky or fixed (scrolls away with hero)
   - Positioned: left / center / right
   - Auto-hidden after event date (configurable grace period)
   - Styled per-template default or customer override
2. **Hero section** — cinematic first impression:
   - Image + optional video (muted by default; hover/tap to play with sound)
   - Parallax or fade-in on scroll
   - Overlay: tagline, couple names, "Save the date" CTA
3. **Invitation block** — custom message:
   - Defaults to template default if customer hasn't provided one
   - Full-width, centered, elegant typography
4. **Story / About section** — customer's narrative:
   - Rich text (from the `About/Story` field)
   - Optional placeholder if empty
   - Toggle: can be hidden if `Hide Story = TRUE`
5. **Sub-events timeline** — visual sequence:
   - Ordered by `SubEvents.Order`
   - Card per event: name, date, start/end time, venue, dress code, description, icon
   - Embedded map for each sub-event's venue (if `Latitude` + `Longitude` populated)
   - "Get directions" link (from `Map Link` or parsed coordinates)
   - Toggle: hidden if `Hide Events = TRUE`
6. **Gallery lightbox** — image carousel:
   - Lazy-loaded `next/image` with blur-up placeholders
   - Swipe/arrow nav
   - Captions per image
   - Video support (embedded with autoplay toggle)
   - Toggle: hidden if `Hide Gallery = TRUE`
7. **Venue section** — location details:
   - Venue name, address, map link
   - Embedded map (from Latitude/Longitude or parsed Google Maps link)
   - "Get directions" button (tel: / maps: / external link)
   - Toggle: hidden if `Hide Venue = TRUE`
8. **Contact block** — guest communication:
   - Contact name, phone, email
   - Optional social link (Instagram / Twitter / etc.)
   - All clickable (tel:, mailto:, social links)
9. **RSVP block** — four rendering modes:
   - **URL:** "RSVP now" button → opens link in new tab
   - **Email:** "RSVP — email@…" → opens `mailto:`
   - **Phone:** "RSVP — +91-…" → opens `tel:`
   - **Text:** plain text instructions (e.g., "Call John at +91-XXXXXXXXXX")
   - Visibility: toggled by `RSVP Enabled` (customer or admin controls)
10. **Background music** — optional ambient track:
    - Muted on page load (respect autoplay rules)
    - Toggle button (respects `prefers-reduced-motion`)
    - Loops seamlessly
    - URL-based (Cloudinary or external CDN)
11. **Sticky navigation** — fixed header with scroll-spy:
    - Links to each visible section (Story, Events, Gallery, Venue, RSVP)
    - Highlights current section on scroll
    - Collapses to hamburger on mobile
    - No section appears in nav if it's hidden
12. **Responsive design** — works at 375 / 768 / 1280 px (mobile / tablet / desktop):
    - No horizontal scroll
    - Touch-friendly tap targets
    - Images scale + fill without distortion
    - Gallery: columns auto-adjust (1 on mobile, 2 on tablet, 3+ on desktop)
13. **Keyboard nav** — accessible:
    - Tab through links + buttons with visible focus
    - Lightbox: arrow keys + Escape to close
    - All interactive elements keyboard-operable
14. **Status states:**
    - **Active (Is Active=TRUE):** full template + content rendered
    - **Preparing (Is Active=FALSE before publish):** placeholder: "We're preparing your special site. Check back soon."
    - **Stopped (admin Stop):** "This event is not currently available."
    - **Expired (after Active Until + grace):** "This event has concluded."

---

## All Templates (80 Total)

Every template is a **pure presentational component** receiving `{ event: EventData, subEvents: SubEvent[], media: MediaItem[] }` and rendering the data with its own aesthetic. Templates are registered in `components/templates/TemplateRouter.tsx` and their metadata in `components/templates/metadata.ts`. Each has demo data in `lib/dummyData.ts` (keyed as `DEMO-<TEMPLATE_ID>`) and a preview bundle generated by `scripts/generate-template-previews.mjs`.

### Wedding Templates (20)

| ID | Name | Character | Signature Element | Event Types | Note |
|---|---|---|---|---|---|
| `royal` | Royal | Big-fat-Indian wedding | Ornate typography + lotus motifs + gold accents | Wedding | **Flagship—build first** |
| `minimal` | Minimal | Editorial whitespace | Generous margins + serif type + line dividers | Wedding | Reference for restraint |
| `aurora` | Aurora | Cinematic celestial | Gradient sky (pink→indigo) + particle effects | Wedding | Scroll-driven color morphing |
| `obsidian` | Obsidian | Black-tie elegance | Dark background + chrome accents + art-deco geometry | Wedding | Formal sophistication |
| `celestia` | Celestia | Ethereal divine | Soft clouds + constellation backdrop + glow effects | Wedding | Dreamlike + romantic |
| `pastel` | Pastel | Soft romance | Muted palette (blush / cream / sage) + watercolor accents | Wedding | Delicate + intimate |
| `empyrean` | Empyrean | Divine marble | Marble textures + gold leaf + classical proportions | Wedding | Luxurious + timeless |
| `prism` | Prism | Crystal iridescent | Kaleidoscopic color shifts + glass-morphism cards | Wedding | Modern + vibrant |
| `moonlit` | Moonlit | Fantasy kingdom | Moon + lanterns + silhouette trees + magical atmosphere | Wedding | Whimsical + nighttime |
| `skytemple` | Skytemple | Floating clouds | Cloud temples + stairs between realms + serene scroll | Wedding | Otherworldly architecture |
| `oceanpalace` | Oceanpalace | Underwater palace | Pearl bubbles + bioluminescent glow + water animations | Wedding | Ethereal aquatic |
| `symphony` | Symphony | Musical score | Staff lines + note glyphs + tempo-driven animations | Wedding | Artistic + rhythmic |
| `skyrealm` | Skyrealm | Floating kingdoms | Floating islands + marble bridges + golden birds on scroll | Wedding | Epic + grand |
| `cathedral` | Cathedral | Constellation cathedral | Stained-glass gallery + constellation backdrop + divine light | Wedding | Sacred + ornate |
| `sakura` | Sakura | Cherry-blossom forest | Cherry trees + seasons morphing on scroll + petals fall | Wedding | Seasonal + poetic |
| `versailles` | Versailles | French-baroque palace | Gold frames + room transitions + gilt mirrors + opulent layout | Wedding | Historical grandeur |
| `fresco` | Fresco | Renaissance painting | Brush-stroke reveals + museum plaques + frescoed backgrounds | Wedding | Artistic heritage |
| `mirage` | Mirage | Arabian desert | Desert dunes (day→night) + khatam star patterns + indigo moonrise | Wedding | Exotic + romantic |
| `icepalace` | Icepalace | Nordic aurora | Aurora borealis + ice-block cards + snowfall effects | Wedding | Cool + ethereal |
| `galaxyopera` | Galaxyopera | Opera in space | Curtain reveal + planet chandelier + acts (I–IV structure) | Wedding | Theatrical + cosmic |

### Engagement Templates (11)

| ID | Name | Character | Signature Element | Supported Types |
|---|---|---|---|---|
| `promise` | Promise | Split converge | Two names split-screen → converge on scroll | Engagement, Anniversary |
| `infinity` | Infinity | Eternal loop | Two rings → merge into ∞ symbol on scroll | Engagement, Anniversary |
| `lovestars` | Lovestars | Constellation love | Memories as constellations + proposal galaxy-burst | Engagement |
| `garden` | Garden | Botanical bloom | Botanical illustrations + butterfly animations | Engagement |
| `horizon` | Horizon | Sunset to twilight | Sky morphs sunset→twilight as user scrolls | Engagement |
| `tworivers` | Tworivers | River confluence | Two rivers merge + lotus blooms + flowing water FX | Engagement |
| `mirrorworlds` | Mirrorworlds | Duality | Split warm/cool worlds → merge into symmetry | Engagement |
| `infinitytrain` | Infinitytrain | Orient-Express | Memory train cars appear on scroll + vintage tickets | Engagement |
| `lanterns` | Lanterns | Floating lights | Lanterns rise from lake + reflection ripples | Engagement |
| `glassrose` | Glassrose | Crystal bloom | Rose made of glass/crystal + blooms on scroll | Engagement |
| `secretgalaxy` | Secretgalaxy | Hidden stars | Nebula + star-dot engagement rings + orbiting asteroids | Engagement |

### Anniversary Templates (6)

| ID | Name | Character | Signature Element | Supported Types |
|---|---|---|---|---|
| `chapters` | Chapters | Parchment journal | Book pages + pen strokes + chapter headings per year | Anniversary |
| `library` | Library | Infinite shelf | Endless bookcase + pull-out spine gallery + literary aesthetic | Anniversary |
| `timemachine` | Timemachine | Clock dial | Central clock hero + decade badges as you scroll | Anniversary |
| `timecapsule` | Timecapsule | Brass vessel | Capsule opens on scroll + artifacts float up + dust particles | Anniversary |
| `treeoflife` | Treeoflife | Growing tree | Central tree + branches grow per year + leaf galleries | Anniversary |
| `endlessclock` | Endlessclock | Porthole time | Multiple bronze clocks + roman-numeral dials + porthole gallery | Anniversary |

### Birthday Templates (10)

| ID | Name | Character | Signature Element | Supported Types |
|---|---|---|---|---|
| `vibrant` | Vibrant | Kids / pink | Confetti bursts + bouncy typography + playful colors | Birthday |
| `orbit` | Orbit | Cosmic kids | Planets orbit + star sparkles + space exploration | Birthday |
| `arcade` | Arcade | 80s synthwave | Neon scanlines + arcade cabinets + electro color palette | Birthday |
| `toybox` | Toybox | Toy city | Toy-train track + present-box gallery + whimsical scale shifts | Birthday |
| `carnival` | Carnival | Neon fair | Ferris wheel animation + fireworks + neon text glow | Birthday |
| `dreamfactory` | Dreamfactory | Imagination factory | Conveyor belt of gifts + spinning gears + fantastical machines | Birthday |
| `cartoon` | Cartoon | Pixar-ish | Puffy clouds + balloon buddies + bouncy underlines + rounded geometry | Birthday |
| `bricktown` | Bricktown | Toy blocks | Interlocking brick aesthetic + brick-letter wordmark + modular cards | Birthday |
| `spacemission` | Spacemission | Cockpit HUD | Cockpit hero + orbiting planets + rocket-launch CTA | Birthday |
| `candyland` | Candyland | Chocolate river | Chocolate river + cookie frames + candy-wrapper cards + sugar palette | Birthday |

### Party Templates (7)

| ID | Name | Character | Signature Element | Supported Types |
|---|---|---|---|---|
| `modern` | Modern | Dark bold | Dark background + bold sans serif + high contrast accents | Party |
| `after` | After | Berlin nightlife | Gritty urban aesthetic + graffiti textures + moody lighting | Party |
| `metropolis` | Metropolis | Tokyo cyberpunk | Neon kanji + cyberpunk skyline + high-tech grid | Party |
| `infinityclub` | Infinityclub | Endless megaclub | Tunnel perspective + LED wall animations + deep bass visuals | Party |
| `festival` | Festival | Tomorrowland | Arch stage + LED flower animations + laser tunnels | Party |
| `neonjungle` | Neonjungle | Neon forest | Neon-outline leaves + peeking animals + waterfall cascade | Party |
| `midnighttokyo` | Midnighttokyo | Shibuya rain | Shibuya rain effects + neon sign towers + puddle reflections | Party |

### Corporate & Tech Templates (7)

| ID | Name | Character | Signature Element | Supported Types |
|---|---|---|---|---|
| `pinnacle` | Pinnacle | Executive summit | Mountain silhouette hero + ascending steps + CEO-speak typography | Corporate |
| `nexus` | Nexus | Cyberpunk launch | Cyberpunk grid + particle effects + tech taglines | Corporate |
| `neural` | Neural | AI summit | Neural network diagram + molecule nodes + data visualization | Corporate |
| `quantum` | Quantum | Smart city | Isometric skyline + data tracks + flowing network lines | Corporate |
| `digitalcity` | Digitalcity | Isometric grid | Isometric buildings + address cards + modular data presentation | Corporate |
| `quantumlab` | Quantumlab | Research lab | Molecular hologram + Petri-dish experiments + lab aesthetic | Corporate |
| `missioncontrol` | Missioncontrol | Control room | Control-room dashboard + satellite map venue + real-time metrics | Corporate |

### Product Launch Templates (5)

| ID | Name | Character | Signature Element | Supported Types |
|---|---|---|---|---|
| `unveil` | Unveil | Dramatic reveal | Dramatic keynote stage + spotlight hero + reveal animation | Product Launch |
| `genesis` | Genesis | Particles assemble | Particles coalesce into product form on load + genesis narrative | Product Launch |
| `secretlab` | Secretlab | Vault unlock | Vault door opens + declassified brief + server-module cards | Product Launch |
| `portal` | Portal | Portal ring | Chromatic-aberration portal + energy tendrils + sci-fi reveal | Product Launch |
| `evolution` | Evolution | Era gradient | Scroll-driven timeline + primitive→AI evolution + era badges | Product Launch |

### Awards & Networking Templates (11)

| ID | Name | Character | Signature Element | Supported Types |
|---|---|---|---|---|
| `luminary` | Luminary | Celestial gala | Celestial gala + golden stars + spotlight effects | Awards |
| `odeon` | Odeon | Red-carpet Oscars | Red carpet hero + marquee lights + gold statues | Awards |
| `immortals` | Immortals | Monumental hall | Monumental marble statues + laurel wreaths + reflective floor | Awards |
| `goldenuniverse` | Goldenuniverse | Golden planets | Golden planets on stage + crossed spotlights + cosmic theater | Awards |
| `halloffame` | Halloffame | Museum hall | Marble columns + laurel-wreath headings + museum plaques | Awards |
| `converge` | Converge | Warm network | Warm color palette + network lines + human connection aesthetic | Networking |
| `constella` | Constella | Constellation net | Constellation networking + connected stars + pulsing nodes | Networking |
| `ecosystem` | Ecosystem | Living organism | Growing tree organism + interconnected branches + life cycle | Networking |
| `synapse` | Synapse | Neuron graph | Deterministic neuron network + pulse impulses + brain-adjacent FX | Networking |
| `futurecity` | Futurecity | Growing skyline | Growing-skyline SVG + highway arcs + district address cards | Networking |

### Template Metadata

Each template's metadata (in `components/templates/metadata.ts` or registry) includes:

```typescript
type TemplateConfig = {
  id: string;
  name: string;
  description: string;
  eventTypes: EventType[];        // Which event types this template supports
  category: 'wedding' | 'engagement' | 'birthday' | ...;
  tier: 'basic' | 'premium';       // For future monetization
  thumbnail: string;               // URL or imported image
  previewUrl: string;              // Link to live preview
  defaults: {
    invitationMessage: string;      // Fallback copy
    tagline: string;
    accentColor: string;           // Hex
    heroImage: string;             // Placeholder URL
  };
  Component: React.FC<{ event: EventData; subEvents: SubEvent[]; media: MediaItem[] }>;
  defaultTimerDesign?: 'glass' | 'minimal' | 'flip' | 'rings' | 'neon' | 'elegant';
  inlineTimer?: boolean;           // Whether this template has a built-in timer
};
```

### Template Selection Rules

- **Landing grid** (`app/(marketing)/_components/LandingTemplates.tsx`): Curated first page with 6 templates on desktop / 2 on mobile. "View all templates" toggle expands to the full list. Search + tag filters bypass the cap.
- **Event type browser** (`/events/[type]`): Shows only templates with `eventTypes` including the selected type.
- **Enquiry form** → **Choose template**: Full list filtered by event type selected in the form.
- **Customer template switch** (`/manage/[token]`): Listed only if `Can Change Template = TRUE` (admin grant) and `eventTypes` includes this event's type.

---

## User Flows & Journeys

### Flow 1: Visitor → Enquiry → Approval → Customer Editor → Published Site

```
1. Visitor lands on /
2. Browse event types (/events/[type]) or search templates
3. Click "Choose template" → redirects to /enquiry with template pre-selected
4. Fill enquiry form + submit → /api/enquiry generates Event Code, creates Drive folder, writes Enquiries sheet
5. Confirmation page /enquiry/thanks shows code + "Admin will contact you"
6.
7. [Admin work]
8. Admin opens /admin/enquiries/[code], reviews, marks Interested + Paid → clicks "Approve"
9. Access Token generated, Status → Approved, two links shown:
    - /manage/<token> (private edit link)
    - /e/<code> (public site, shows "preparing" placeholder until Is Active=TRUE)
10. Admin copies or emails the /manage link to customer
11.
12. [Customer work]
13. Customer visits /manage/<token>, enters email + receives OTP
14. Enters OTP → logged in, sees editor panel with live preview
15. Fills: title, date, venue, person names, invitation message, uploads media, adds sub-events
16. Clicks "Save and publish" (or auto-publishes on complete)
    - Sets Is Active = TRUE
    - /api/revalidate /e/<code> triggers
17. Customer can keep editing until Active Until date
18. After Active Until: editor locks, live link stays accessible but marked "event concluded"
19.
20. [Guest experience]
21. Guest visits /e/<code>, sees countdown + hero + content + gallery + RSVP block
22. Countdown ticks down to Main Date
23. After Main Date: countdown hidden, "event concluded" message (optional)
24. Admin can manually stop/resume the event at any time via /admin/events
```

### Flow 2: Admin CRM Workflow

```
1. Admin logs in to /admin/login (email + password)
2. Dashboard (/admin) shows counts, recent enquiries, active events
3. Admin clicks "Enquiries" → list view (/admin/enquiries)
4. Filters by Status=New to see fresh leads
5. Clicks a row → detail view (/admin/enquiries/[code])
6. Reviews customer details (read-only: name, email, type, date, message)
7. Contacts customer (via email or phone from the record)
8. Returns to detail view, updates:
   - Query Addressed = TRUE
   - Interested = Yes / No / Maybe
   - Paid Amount = <number>
   - Payment Status = Paid / Pending
   - Internal Notes = call transcript / observations
9. If Interested=No → clicks "Mark Not Interested" → Status → Not Interested, lead closed
10. If Interested=Yes + Payment Status=Paid → clicks "Approve"
    - Copies shared cols 1–14 to Live
    - Generates Access Token
    - Prompts "Allow template switch? (Yes/No)"
    - Sets Can Change Template = TRUE/FALSE accordingly
    - Shows links to send to customer:
      - Edit: /manage/<token>
      - Live: /e/<code>
    - Copies link to clipboard or sends email directly
11. Admin moves to next lead or goes back to list
```

### Flow 3: Admin Event Control (Live Events)

```
1. Admin logs in, navigates to /admin/events (live events list)
2. Sees table: Code, Name, Type, Status (Active/Stopped/Expired), Active Until
3. Sees a "Stop" button on an active event
4. Clicks Stop → Is Active = FALSE, /api/revalidate /e/<code] triggered
5. Guest visits /e/<code], sees "This event is not currently available"
6. Admin clicks "Resume" → Is Active = TRUE, /api/revalidate triggered
7. Guest sees content again
8. Alternatively, admin clicks row → event detail editor (/admin/events/[code])
9. Can edit any Live row field directly (title, date, venue, content, RSVP, etc.)
10. Can edit SubEvents (add/delete/reorder)
11. Can upload/crop/caption/reorder media same as customer editor
12. Each save revalidates the public site
13. Can rotate the Access Token (forces customer to re-login with OTP)
14. Can issue a new magic link if the original was lost
```

### Flow 4: Customer Editor Workflow

```
1. Customer receives /manage/<token> link in email (from admin or shown in /admin portal)
2. Visits /manage/<token], sees "Enter your email to access" login
3. Enters email → receives OTP via email (or console log in dev)
4. Enters OTP → session cookie set, redirected to /manage/<token]
5. Editor panel appears on right (full-screen on mobile)
6. Canvas shows live preview of the template on left
7. Panel has sections: Story, Events, Gallery, Venue, Contact, RSVP, Look, etc.
8. **Content editing:**
   - Click field → inline edit
   - Title, date, venue, person names, message, about
   - Each field has "clear" affordance (removes the field from page)
9. **Section toggles:**
   - Hide Story / Hide Events / Hide Gallery / Hide Venue / RSVP Enabled
10. **Sub-events:**
    - "+ Add sub-event" button
    - Each event shows: name, date, time, venue, dress code, description, icon
    - Up/down arrows to reorder
    - Delete button
    - Edit inline
11. **Media:**
    - "Add photos" tile in gallery or side panel button
    - Multi-file uploader
    - Each photo: caption + section selector (hero / gallery / couple / sub-event:Name)
    - Crop & adjust (image editor opens)
    - Replace / delete buttons
    - Reorder via drag or arrows
    - All changes are local drafts (staging model)
12. **Look:**
    - Accent color picker (hex input + color swatch)
    - Background music URL toggle
13. **Template switch** (if allowed):
    - Grid of compatible templates
    - Click → switches Template ID
    - Content + media + sub-events carry over
    - Public site revalidates
14. **Publish:**
    - Auto-publish on complete (first save with Title + Date + Venue)
    - Or "Save and publish" button for manual save
    - Status: "Published" toast
15. **Site control:**
    - "Stop/Resume" toggle in the panel
    - Immediately sets Is Active
    - Public site goes dark / reappears
16. **Edit window:**
    - Editable until Active Until (defaults to Main Date + 7 days)
    - After Active Until: panel goes read-only, shows live link
17. **Session:**
    - Expires in 30 days
    - "Sign out" button clears cookie
    - Next visit requires OTP again
```

---

## Data Model & Sheets Structure

The event platform uses five Google Sheets tabs. **The first 14 columns are identical between `Enquiries` and `Live`** — approval copies this block without remapping.

### Tab 1: Enquiries (Lead Pipeline / CRM)

| # | Column | Type | Required? | Description |
|---|--------|------|-----------|-------------|
| 1 | Event Code | Text | YES | Generated at enquiry. Format: `{TYPE}-{YEAR}-{SEQ4}`. URL-safe. Join key for Drive folder + URL slug. |
| 2 | Submitted At | Timestamp | YES | Auto-set on enquiry submission. ISO 8601. |
| 3 | Full Name | Text | YES | Contact person for admin follow-up. |
| 4 | Email | Text | YES | Customer email. Validated regex. Used for magic-link + OTP. |
| 5 | Mobile | Text | YES | With country code. Validated regex. Admin reference. |
| 6 | Event Type | Enum | YES | Wedding / Birthday / Engagement / Anniversary / Corporate / Party / Product Launch / Awards. Drives template filter. |
| 7 | Event Sub-type | Text | NO | Optional. Mehndi / Haldi / etc. for weddings; Day 1/2 for multi-day. |
| 8 | Template ID | Text | YES | Selected template (e.g., "royal", "minimal"). Validates against registry. |
| 9 | Event Title | Text | YES | Public event title (e.g., "Sarah & Michael's Wedding"). |
| 10 | Person 1 Name | Text | YES | Groom / host / celebrant. Appears on site if populated. |
| 11 | Person 2 Name | Text | NO | Bride / partner. Blank if N/A (e.g., solo birthday). |
| 12 | Tentative Date | Date | YES | From enquiry form. Format: YYYY-MM-DD. |
| 13 | City | Text | YES | Event location (e.g., "Mumbai"). |
| 14 | Message | Text | NO | **Internal note from customer (NOT shown on site).** Admin can see this; never displayed to guests. |
| 15 | Status | Enum | YES | New / Contacted / Not Interested / Approved. Admin updates. |
| 16 | Query Addressed | Boolean | NO | TRUE if admin answered customer questions. |
| 17 | Interested | Enum | NO | Yes / No / Maybe. Admin decision. No → status becomes Not Interested. |
| 18 | Paid Amount | Number | NO | Amount customer paid (currency implied or stored separately). |
| 19 | Payment Status | Enum | NO | Pending / Paid. Admin updates. Required before Approve. |
| 20 | Payment Date | Date | NO | When payment was received. |
| 21 | Last Contacted On | Date | NO | Auto-updated when admin edits the row. |
| 22 | Internal Notes | Text | NO | Call notes, observations, reminders. Admin only. |

**Admin workflow (cols 15–22):**
1. Set `Query Addressed`, `Interested`, `Paid Amount`, `Payment Status`.
2. If `Interested = No` → `Status = Not Interested` (lead lost).
3. If `Interested = Yes` + `Payment Status = Paid` → **Approve**: copy cols 1–14 to Live, generate Access Token, set `Status = Approved`.

### Tab 2: Live (Event — Lifecycle, Content, Permissions)

**Columns 1–14:** Identical to Enquiries (copied on approval; never contains CRM cols 15–22).

| Column | Type | Required? | Description |
|--------|------|-----------|-------------|
| **Lifecycle & permissions** |
| Approved | Boolean | YES | TRUE/FALSE. Gates customer editor access via `/manage/<token]`. |
| Access Token | Text | YES | Long random secret (e.g., 64-char base58). Validates `/manage/[token]`. Rotatable by admin. |
| Can Change Template | Boolean | YES | TRUE/FALSE. Admin sets at approval. If TRUE, customer can switch templates. |
| Is Active | Boolean | YES | TRUE/FALSE. **The public site switch.** Customer publish-on-complete sets TRUE. Admin can Stop (FALSE) / Resume (TRUE). |
| Go Live Date | Timestamp | NO | When first published (Is Active set to TRUE). |
| Active Until | Date | NO | Event deadline. Defaults to `Main Date + 7 days`. After this, editor locks; site may show "event concluded". |
| **Section visibility** (all default FALSE = visible; TRUE = hidden) |
| Hide Story | Boolean | NO | TRUE → omits invitation + about block + nav item. |
| Hide Events | Boolean | NO | TRUE → omits sub-events timeline + nav item. |
| Hide Gallery | Boolean | NO | TRUE → omits gallery + nav item. |
| Hide Venue | Boolean | NO | TRUE → omits venue card + map + nav item. |
| **Customer auth state** (written by login route, never edited by hand) |
| OTP Hash | Text | NO | bcrypt(6-digit code). Cleared on success. |
| OTP Expires At | Timestamp | NO | ISO 8601. OTP rejected after this. |
| OTP Attempts | Number | NO | Count of wrong codes. Resets to 0 on success or new OTP request. Locks after 5 attempts (15 min). |
| OTP Locked Until | Timestamp | NO | ISO 8601. Login rejects with "try again later" while in the future. |
| **Content** (editable by customer or admin) |
| Hero Image URL | Text | NO | Cloudinary URL or external CDN. Renders as hero background. |
| Hero Video URL | Text | NO | Muted video for hero (optional overlay). |
| Tagline/Hashtag | Text | NO | Subtitle or call-to-action. Defaults to template default if blank. |
| Invitation Message | Text | NO | Custom message overlaying hero / invitation block. Defaults to template default if blank. |
| About/Story | Text | NO | Longer narrative text. Rich text or markdown (render as-is or parse). |
| Main Date | Date | YES | Event date. Used for countdown + Active Until default. |
| Main Start Time | Time | NO | ISO 8601 time (e.g., "14:00"). |
| Main End Time | Time | NO | Event end time. |
| Theme/Accent Color | Text | NO | Hex color (e.g., "#FFD700"). Drives CSS `--accent` variable + component theming. |
| Background Music URL | Text | NO | Cloudinary or external CDN URL. Optional ambient track. |
| **Main venue** |
| Venue Name | Text | YES | Event location name (e.g., "Taj Lake Palace"). |
| Venue Address | Text | YES | Full address for "Get directions" link. |
| Map Link | Text | NO | Google Maps URL or coordinates link. Parsed for `@lat,lng`. |
| Latitude | Number | NO | Decimal (e.g., 28.5244). If provided, pins the venue on embedded map. |
| Longitude | Number | NO | Decimal (e.g., 77.1855). |
| **Public contact** |
| Contact Name | Text | NO | Name of person guests can reach. |
| Contact Phone | Text | NO | Phone number (with country code). Rendered as `tel:` link. |
| Contact Email | Text | NO | Email for contact. Rendered as `mailto:` link. |
| Instagram/Social Link | Text | NO | Social media handle or URL. Rendered as link. |
| **RSVP** |
| RSVP Enabled | Boolean | NO | TRUE/FALSE. Shows/hides RSVP block on site. |
| RSVP Link/Contact | Text | NO | URL, email, phone, or text instructions. Rendered per RSVP Type. |
| RSVP Type | Enum | NO | `url` (default if starts with `http`) / `email` / `phone` / `text`. Determines how RSVP Link is rendered. |

**Defaults for new Live rows (on approval):**
- `Approved = TRUE`
- `Access Token = randomLongString()`
- `Can Change Template = FALSE` (admin choice at approval)
- `Is Active = FALSE` (customer must publish to go live)
- `Active Until = Main Date + 7 days`
- All section visibility toggles = FALSE (sections visible by default)
- OTP fields empty
- Content fields copy from Enquiries 1–14; customer can edit

### Tab 3: SubEvents (1 row per sub-event, joined by Event Code)

| Column | Type | Description |
|--------|------|-------------|
| Event Code | Text | Join key to `Live.Event Code`. |
| Order | Number | Sequence number (1, 2, 3…). Ascending sort = display order. |
| Sub-event Name | Text | E.g., "Mehndi", "Haldi", "Reception". |
| Date | Date | YYYY-MM-DD. |
| Start Time | Time | ISO 8601 time (e.g., "18:00"). |
| End Time | Time | ISO 8601 time (e.g., "22:00"). |
| Venue Name | Text | Sub-event location (can differ from Main Venue). |
| Venue Address | Text | Full address for directions. |
| Map Link | Text | Google Maps URL or coordinates. |
| Latitude | Number | Decimal. If populated, pins sub-event venue on embedded map. |
| Longitude | Number | Decimal. |
| Dress Code | Text | E.g., "Traditional", "Black Tie". Optional. |
| Description | Text | Optional narrative or special notes. |
| Icon | Text | Icon name or emoji (e.g., "🎉", "💒"). Renders in timeline. |

**Customer operations:**
- Add: "+ Add sub-event" → defaults to next `Order`, blank fields.
- Edit: inline edit any column.
- Reorder: up/down buttons renumber `Order` to stay contiguous.
- Delete: remove row; renumber remaining rows.
- Clear field: individual fields can be left blank (template hides empty values).

### Tab 4: Media (1 row per file, joined by Event Code)

| Column | Type | Description |
|--------|------|-------------|
| Event Code | Text | Join key to `Live.Event Code`. |
| Media Type | Enum | `image` / `video`. |
| Section | Text | Where it appears: `hero` / `gallery` / `couple` / `about` / `sub-event:<name>`. Multiple sections possible (sort/section per row). |
| File Name | Text | Original filename (e.g., "photo_001.jpg"). Info only. |
| Drive File ID | Text | If on Drive: Drive file ID. If on Cloudinary: `public_id`. |
| Public URL | Text | **The host-agnostic seam.** Cloudinary `secure_url` or external CDN URL. Site reads this, not Drive links. |
| Caption | Text | Description shown under/over the image in gallery or hero. |
| Sort Order | Number | Ascending = display order within a section. |
| Uploaded At | Timestamp | ISO 8601. Auto-set on upload. |
| Width | Number | Pixels (image only). Set by upload pipeline (sharp resize). |
| Height | Number | Pixels (image only). Set by upload pipeline. |
| Duration | Number | Seconds (video only). Extracted by ffmpeg or stored from metadata. |
| File Size | Number | Bytes. Used to show "480 KB" in editor. |

**Upload pipeline:**
- `/api/manage/[token]/upload` (POST multipart: `file` + `section`)
- Validates size (images ≤ 12 MB, videos ≤ 100 MB)
- For images: server-side sharp resize to section target width, strip EXIF, convert to JPEG/WebP
- Uploads to Cloudinary via signed server-side request
- Returns `{ ok, item }` with `Public URL` + metadata (Width, Height)
- **Staging:** item folds into local draft; nothing writes to the `Media` sheet until **Save and publish**
- **Save and publish:** calls `/api/manage/[token]` (PATCH) → `replaceMediaForCode()` writes all rows to `Media` sheet, then `/api/revalidate /e/<code]`

**Customer operations:**
- Upload: "Add photos" modal → multi-file + per-file caption.
- Crop: "Crop & adjust" → image editor (non-destructive for Cloudinary via transforms, baked for others).
- Caption: inline edit in the side panel's media list.
- Section reassign: move image from gallery to couple, etc.
- Reorder: up/down buttons update `Sort Order`.
- Delete: remove row from draft, then save.

### Tab 5: CustomBlocks (Optional, Post-MVP)

| Column | Type | Description |
|--------|------|-------------|
| Event Code | Text | Join key. |
| Section ID | Text | Where block appears (e.g., "after-story", "before-events"). |
| Type | Enum | `rich-text` / `image-row` / `quote` / `cta`. |
| Title | Text | Block heading. |
| Body | Text | Block content (markdown or rich HTML). |
| Sort Order | Number | Ascending = position. |
| Visible | Boolean | FALSE = hidden; template skips rendering it. |

**Use case:** Customer wants to "add anything" beyond the schema (custom callout, extra story, third venue, ad banner). Templates render any blocks they recognize (sorted by `Sort Order`) and ignore unknown `Type`s.

---

## All UI Components & Parts

### Core Primitives (`/components/ui`)

| Component | Props | Purpose | Notes |
|-----------|-------|---------|-------|
| **`EventCountdown`** | `{ event: EventData, style?: 'glass' \| 'minimal' \| 'flip' \| 'rings' \| 'neon' \| 'elegant', position?: 'left' \| 'center' \| 'right', layout?: 'fixed' \| 'floating' }` | Universal countdown timer. Shows days/hours/min/sec to Main Date. | Hidden if `Hide Timer = TRUE`. Auto-hidden after event date + grace period. Flagship templates may have inline timer instead. |
| **`Gallery`** | `{ media: MediaItem[], templateId: string, onEdit?: () => void }` | Lightbox image carousel + lazy-load blur-up. Swipe/arrow nav, captions, video support. | Mobile: 1 col, tablet: 2, desktop: 3+. In edit mode, shows "Add photos" tile. |
| **`MapEmbed`** | `{ latitude: number, longitude: number, address: string, mapLink?: string, title?: string }` | Embedded Leaflet map with venue pin + "Get directions" button. | Parses Google Maps short links to extract coordinates. Fallback to directions-only if no coords. |
| **`Timeline`** | `{ subEvents: SubEvent[], templateId: string, onEdit?: () => void }` | Vertical or horizontal sequence of sub-events. Cards: name, date, time, venue, dress code, icon. Each can have its own map. | Ordered by `SubEvents.Order`. In edit mode, "+ Add sub-event" button. Reorder with arrows. |
| **`MusicToggle`** | `{ url: string, autoplay?: boolean }` | Button to play/mute background music. Respects `prefers-reduced-motion`. | Loops seamlessly. Starts muted (respect autoplay policy). |
| **`RSVP`** | `{ type: 'url' \| 'email' \| 'phone' \| 'text', link: string, label?: string }` | Renders RSVP call-to-action per type. | URL → button opens link. Email → button with email. Phone → button with tel:. Text → plain instruction. |
| **`StickyNav`** | `{ sections: { id: string, label: string, ref?: RefObject }[], hideTimer?: boolean, accentColor?: string }` | Fixed header with scroll-spy links. Highlights active section. | No nav item if section is hidden. Collapses to hamburger on mobile. Uses `accentColor` for active indicator. |
| **`HeroSection`** | `{ imageUrl?: string, videoUrl?: string, title: string, tagline?: string, overlay?: React.ReactNode, parallax?: boolean }` | Cinematic opening. Image/video background with optional overlay. | Full `100svh` height (not fixed px). Parallax or fade-in on scroll per template. Bottom padding reserved for timer. |
| **`ImageEditor`** | `{ src: string, aspect?: number, onSave: (crop: CropData) => void, onCancel: () => void }` | Crop / zoom / pan / rotate 90°. Shows aspect presets. | Default "Best fit" aspect = template's display ratio. Non-destructive (Cloudinary transforms) or baked. |
| **`AddPhotosModal`** | `{ onUpload: (files: File[], captions: string[]) => Promise<void>, onCancel: () => void }` | Multi-file uploader with per-file caption field. Progress bar + error handling. | Validates client-side size; server enforces caps. Returns `Public URL` + metadata on success. |
| **`Countdown` (simple)** | `{ targetDate: string, hidden?: boolean }` | Low-spec timer for simple templates. Days / Hours / Min / Sec. | Falls back to this if `EventCountdown` is overkill. |

### Page-Level Components

| Path | Component | Responsibility |
|------|-----------|-----------------|
| `/` | `app/(marketing)/page.tsx` | Landing page. Hero + featured event types + template grid (curated first 6) + CTA buttons. |
| `/events/[type]` | `app/(marketing)/events/[type]/page.tsx` | Event type browser. Hero + template list filtered by type + search/tag filters. |
| `/enquiry` | `app/enquiry/page.tsx` | Enquiry form. Multi-step or single: name, email, mobile, event type, subtype, template picker, title, names, date, city, message. Client-side validation. |
| `/enquiry/thanks` | `app/enquiry/thanks/page.tsx` | Confirmation. Shows Event Code, thanks message, set expectations. |
| `/manage/[token]/login` | `app/manage/[token]/login/page.tsx` | Email + OTP login gate. Form: email input + OTP form (initially hidden, shown after email submit). |
| `/manage/[token]` | `app/manage/[token]/page.tsx` | **Customer editor.** Split-screen: canvas (left) + editable panel (right). Inline field editors + section toggles + sub-event CRUD + media uploader + template switcher + save/publish buttons + stop/resume toggle. |
| `/e/[code]` | `app/e/[code]/page.tsx` | **End portal.** Renders the template component with live data (ISR + on-demand revalidate). Shows countdown, hero, story, sub-events timeline, gallery, venue, contact, RSVP. States: active / preparing / stopped / expired. |
| `/admin/login` | `app/admin/login/page.tsx` | Email + password login. Rate limit (5 fails per 15 min). |
| `/admin` | `app/admin/page.tsx` | Dashboard. Counts by status + live state. Recent enquiries. Total paid. |
| `/admin/enquiries` | `app/admin/enquiries/page.tsx` | CRM list view. Table: Code, Name, Type, Template, Date, Status, Interested, Paid. Filter + search. Click row → detail. |
| `/admin/enquiries/[code]` | `app/admin/enquiries/[code]/page.tsx` | Enquiry detail. View enquiry fields (read-only). Edit operational cols. Actions: Mark Not Interested / Approve (with Can Change Template choice). |
| `/admin/events` | `app/admin/events/page.tsx` | Live events list. Table: Code, Name, Type, Status (Active/Stopped/Expired), Active Until. Stop/Resume buttons. Click → detail editor. |
| `/admin/events/[code]` | `app/admin/events/[code]/page.tsx` | Admin event override editor. Full CRUD on Live row + SubEvents + Media. Same fields as customer editor. Saves trigger revalidate. |

### Edit Mode Components (`/components/edit`)

| Component | Responsibility |
|-----------|-----------------|
| **`EditableShell`** | Wraps template + editor panel. Manages panel open/closed state. Canvas inset on desktop (`pr-[420px]`), full-screen overlay on mobile. Collapsible panel with floating "Edit" button on close. |
| **`EditPanel`** | Right sidebar panel. Sections: Story (text editors), Events (sub-event CRUD), Gallery (media list + "Add photos"), Venue, Contact, RSVP, Look (color + music). |
| **`InlineEditor`** | Contenteditable div for text fields. Blurs to save. Shows "Clear" button for optional fields. |
| **`ColorPicker`** | Hex input + color swatch. Outputs `Theme/Accent Color` to Live row. |
| **`SubEventEditor`** | Row-level editor. Name, date, start/end time, venue, dress code, description, icon fields. Up/down arrows. Delete. Icon picker / emoji selector. |
| **`SectionToggle`** | Checkbox + label for Hide* columns. Updates Live row on change. |
| **`TemplateGrid`** | Grid of compatible templates (filtered by event type). Thumbnail + name + "Switch" button. |
| **`MediaList`** | Sortable list of uploaded media. Per-item: thumbnail + caption + section label + reorder arrows + crop/replace/delete buttons. |
| **`SavePublishButton`** | Large button: "Save and publish" or (if published) "Saved" + update time. On click: PATCH /api/manage/<token> (all staged changes) + revalidate. Toast: "Published". |
| **`StopResumeToggle`** | Pill toggle: Is Active → "Live" / "Stopped". On change: PATCH Is Active + revalidate immediately. |

### Admin UI Components

| Component | Responsibility |
|-----------|---|
| **`EnquiriesTable`** | Sortable, filterable table. Code, Name, Type, Template, Date, Status, Interested, Paid. Click row → detail. |
| **`EnquiryDetail`** | View all enquiry fields. Edit CRM fields (Query Addressed, Interested, Paid, Payment Status, Notes). Actions: Mark Not Interested / Approve. |
| **`ApproveModal`** | On "Approve" click. Confirmation + toggle "Allow template switch? (Yes/No)". Shows the two links to copy/email: /manage/<token> + /e/<code>. Copy-to-clipboard buttons. Send email button. |
| **`LiveEventsTable`** | Code, Name, Type, Status, Active Until. Stop / Resume buttons. Click → detail editor. |
| **`AdminEventEditor`** | Same as customer editor but for admin. Full inline edit on Live row + SubEvents + Media CRUD. No token validation (admin can edit any event). |

---

## Authentication & Security

### Customer Authentication (Two-Factor: Token + Email OTP)

1. **Token validation (magic link):**
   - Token = long random secret (e.g., 64-char base58) stored in `Live.Access Token`.
   - URL = `/manage/<token>`.
   - Middleware validates token against `Live` row; if missing or invalid, redirect to login.
   - Token is rotatable by admin (regenerates, invalidates existing session).

2. **Email OTP (2FA):**
   - Customer enters email → backend looks up `Live.Email` for this Event Code.
   - Generates 6-digit code, emails it (Resend or SMTP), stores `bcrypt(code)` in `OTP Hash`, sets `OTP Expires At = now + 10 min`.
   - Customer enters code → backend compares against `OTP Hash`.
   - On success: clears OTP fields, sets signed HTTP-only session cookie `cust_session_<code>` with 30-day TTL.
   - On mismatch: increments `OTP Attempts`; after 5, sets `OTP Locked Until = now + 15 min`.
   - Rate limit: max 5 OTP requests per email per hour (soft limit in memory; persists to `OTP Attempts` for detection).

3. **Session management:**
   - Cookie: `cust_session_<code>` (scoped per event, signed, HTTP-only, secure flag on HTTPS).
   - TTL: 30 days (customer can extend by staying active or refresh by sign-out + re-login).
   - Middleware checks `/manage/[token]/*` + `/api/manage/[token]/*` routes for valid session.
   - Sign out: clears cookie; next visit requires OTP login.
   - Admin rotate token: invalidates all existing sessions for this event (forces re-login on next visit).

4. **Dev mode (no email provider):**
   - If `RESEND_API_KEY` is empty, OTP logs to console: `[DEV OTP] 482301`.
   - Allows local testing without mail account.

### Admin Authentication

1. **Login:**
   - Email + password form.
   - Credentials checked against env (`ADMIN_EMAIL` + `ADMIN_PASSWORD_HASH` bcrypt).
   - Validate using bcryptjs: `bcryptjs.compareSync(inputPassword, envHash)`.
   - Format for multi-admin (future): CSV `email:bcrypt_hash` pairs, parsed and checked.
   - Rate limit: 5 failed attempts per email per 15 min → lockout (IP-based or email-based).

2. **Session:**
   - Signed HTTP-only cookie `admin_session` with 8-hour TTL.
   - TTL is deliberately short (re-login required after 8 hours for security).
   - Middleware protects `/admin/*` + `/api/admin/*` routes.
   - Missing/expired session → redirect to `/admin/login?next=<original>`.

3. **Rate limiting & logging:**
   - Failed login attempt logs IP + email + timestamp (for audit trail).
   - After 5 failures per 15 min: send HTTP 429 + "too many attempts" message.

### API Route Security

1. **Middleware** (`middleware.ts`):
   - Protects `/admin/*` and `/api/admin/*`: check `admin_session` cookie; redirect if missing.
   - Protects `/manage/[token]/*` and `/api/manage/[token]/*`: validate `[token]` against `Live.Access Token`; reject if invalid or approved=FALSE.
   - Also checks customer session cookie for edit operations.

2. **No secrets in client:**
   - Google Sheets service account (email + private key) NEVER reaches client code.
   - `AUTH_SECRET` (signs session cookies) NEVER in client-side code.
   - `TOKEN_SALT` (generates Access Tokens) server-side only.
   - All sheet reads/writes go through API routes (server-side only).

3. **API route validation:**
   - `/api/enquiry`: validate email + mobile format; generate Event Code (format validated).
   - `/api/manage/[token]/upload`: validate file size + type; authenticate with token + session.
   - `/api/manage/[token]/route.ts`: validate token; check customer session; validate field updates (e.g., no editing `Approved` or `OTP Hash`).
   - `/api/admin/*`: validate admin session; check request method (GET/POST/PATCH per route).
   - All responses should be JSON; error responses include `{ error: "message" }` + appropriate HTTP status.

4. **CORS + CSP:**
   - No CORS needed (all requests are same-origin).
   - CSP strict: no inline scripts, no external resources except Cloudinary + Google Fonts (if used).

### Data Privacy

1. **Private contact data (never public):**
   - Enquiry Email, Mobile, Message → stored in `Enquiries` sheet; never rendered on `/e/<code]`.
   - Internal Notes → admin only.
   - Only `Live` row public fields (Contact Name, Phone, Email, Instagram) appear on site — customer can edit/clear these.

2. **Access token confidentiality:**
   - Access Token is the credential; treat `/manage/<token>` URL as sensitive.
   - Do not log the full token in error messages; log only the first 8 chars + `****`.
   - Tokens are long (64+ chars) and randomly generated; entropy >> brute-force risk.

3. **Audit trail:**
   - Log admin login attempts (successful + failed).
   - Log admin edits (which fields, old → new values, timestamp, admin email).
   - Log customer OTP requests + verify attempts (success/failure).
   - Logs to stdout or a file (depends on hosting; Vercel captures stdout).

---

## API Routes (Complete Reference)

### Public Routes

| Method | Route | Auth | Request | Response | Trigger |
|--------|-------|------|---------|----------|---------|
| POST | `/api/enquiry` | None | `{ fullName, email, mobile, eventType, eventSubtype, templateId, eventTitle, person1Name, person2Name, tentativeDate, city, message }` | `{ ok: boolean, eventCode: string, message: string }` OR `{ error: string }` | Create Event Code, Drive folder, write Enquiries sheet. Email customer confirmation (optional). |

### Customer Routes (Token-Gated)

| Method | Route | Auth | Request | Response | Notes |
|--------|-------|------|---------|----------|-------|
| POST | `/api/manage/[token]/login` | Token | `{ email: string }` | `{ ok: boolean, message: "OTP sent" }` OR `{ error: string }` | Generate OTP, email it (or log to console in dev). Store `OTP Hash` + `OTP Expires At` on `Live` row. |
| POST | `/api/manage/[token]/verify` | Token | `{ email, code: string }` | `{ ok: boolean, sessionToken?: string }` OR `{ error: string }` | Verify OTP. On success: clear OTP fields, set session cookie. On failure: increment `OTP Attempts`, check lockout. |
| POST | `/api/manage/[token]/logout` | Token + Session | None | `{ ok: boolean }` | Clear session cookie. |
| PATCH | `/api/manage/[token]` | Token + Session | `{ title?, date?, message?, story?, accentColor?, templateId?, subEvents?: SubEvent[], media?: MediaItem[], hideStory?, hideEvents?, hideGallery?, hideVenue?, isActive? }` | `{ ok: boolean, data: { updated: string[], message: string } }` OR `{ error: string }` | Bulk update Live row + write SubEvents + write Media. Auto-publish if required fields complete. Revalidate /e/[code]. |
| GET | `/api/manage/[token]` | Token + Session | None | `{ event: EventData, subEvents: SubEvent[], media: MediaItem[], templates: TemplateConfig[] }` | Fetch Live row + SubEvents + Media for canvas. Return compatible templates for switcher. |
| POST | `/api/manage/[token]/upload` | Token + Session | multipart: `file` + `section` | `{ ok: boolean, item: MediaItem }` OR `{ error: string }` | Upload to Cloudinary (server-side signed request). Return staging-ready item (does NOT write to Media sheet). |

### Admin Routes (Admin-Authenticated)

| Method | Route | Auth | Request | Response | Notes |
|--------|-------|------|---------|----------|-------|
| POST | `/api/admin/login` | None | `{ email, password }` | `{ ok: boolean, sessionToken?: string }` OR `{ error: string, message: "incorrect" \| "too many attempts" }` | Bcryptjs compare. Rate limit: 5 fails / 15 min. |
| POST | `/api/admin/logout` | Admin session | None | `{ ok: boolean }` | Clear admin session cookie. |
| GET | `/api/admin/enquiries` | Admin session | Query: `?status=New&interested=Yes&search=...` | `{ enquiries: Enquiry[] }` | Fetch filtered list from Enquiries sheet. |
| GET | `/api/admin/enquiries/[code]` | Admin session | None | `{ enquiry: Enquiry }` | Fetch single enquiry row. |
| PATCH | `/api/admin/enquiries/[code]` | Admin session | `{ queryAddressed?, interested?, paidAmount?, paymentStatus?, paymentDate?, internalNotes? }` | `{ ok: boolean, data: Enquiry }` | Update CRM fields on Enquiries row. Auto-set `Last Contacted On`. |
| POST | `/api/admin/approve` | Admin session | `{ code: string, canChangeTemplate: boolean }` | `{ ok: boolean, accessToken: string, links: { edit, live } }` | Copy Enquiries cols 1–14 to Live. Generate Access Token. Set Approved=TRUE, Can Change Template. Set Status=Approved. Return links to show/email customer. |
| GET | `/api/admin/events` | Admin session | Query: `?status=active&search=...` | `{ events: LiveEvent[] }` | Fetch all Live rows (active, stopped, expired). |
| GET | `/api/admin/events/[code]` | Admin session | None | `{ event: EventData, subEvents: SubEvent[], media: MediaItem[] }` | Fetch Live row + SubEvents + Media for admin editor. |
| PATCH | `/api/admin/events/[code]` | Admin session | `{ ...any Live columns }` | `{ ok: boolean, data: { updated: string[], message: string } }` | Bulk update Live row. Can edit content + theme + RSVP + section toggles. Revalidate /e/<code>. |
| POST | `/api/admin/events/[code]/stop` | Admin session | None | `{ ok: boolean }` | Set Is Active=FALSE. Revalidate /e/[code]. |
| POST | `/api/admin/events/[code]/resume` | Admin session | None | `{ ok: boolean }` | Set Is Active=TRUE. Revalidate /e/[code]. |
| POST | `/api/admin/rotate-token` | Admin session | `{ code: string }` | `{ ok: boolean, newToken: string }` | Generate new Access Token. Invalidate customer session (force OTP re-login). |
| POST | `/api/admin/upload` | Admin session | multipart: `file` + `code` + `section` | `{ ok: boolean, item: MediaItem }` | Same as customer upload but for admin editor. |
| CRUD | `/api/admin/subevents` | Admin session | POST `{ code, subEvent }` \| PATCH `{ code, order, updates }` \| DELETE `{ code, order }` | `{ ok, subEvents: [] }` | Create, update, delete SubEvents rows. |

### Revalidation Routes

| Method | Route | Auth | Request | Response | Notes |
|--------|-------|------|---------|----------|-------|
| POST | `/api/revalidate` | Secret header `revalidate-secret` | `{ paths: ["/e/<code>", ...] }` OR `{ path: "/e/<code>" }` | `{ ok: boolean, revalidated: string[] }` | On-demand ISR. Revalidates static pages. Called after publish, edit, stop, resume. |

---

## Media Handling Pipeline

### Upload Flow (Staging Model)

```
Customer clicks "Add photos" or Admin uploads
  ↓
AddPhotosModal / AdminEventEditor
  ↓ (POST /api/manage/[token]/upload or /api/admin/upload)
Server receives multipart: file + section
  ↓
Validate: filesize ≤ limit (12 MB image, 100 MB video), MIME type
  ↓
If image: sharp resize to section target width (2400 for hero, 1800 for gallery, etc.)
          Strip EXIF, convert to JPEG/WebP, preserve aspect ratio
          Generate placeholder (blurhash or low-res version)
  ↓
Upload to Cloudinary:
  POST https://api.cloudinary.com/v1_1/{cloud_name}/upload
    auth: api_key + api_secret
    file: resized binary
    folder: EventSites/{EventCode}/{section}/
    eager: [ { width: X, height: Y, crop: fill }, ... ]  (optional variants)
  ↓
Response: { secure_url, public_id, width, height, format, ... }
  ↓
Return to client:
  { ok: true, item: {
      id: public_id,
      url: secure_url,
      section: section,
      width, height,
      caption: "",
      sortOrder: maxOrder + 1
    }
  }
  ↓
Client-side (EditContext):
  Local draft state ← [ ...existing, newItem ]
  Preview updates immediately
  Nothing written to Media sheet yet
  ↓
Customer clicks "Save and publish"
  ↓ (PATCH /api/manage/[token])
Server receives { media: [ { id, url, caption, section, sortOrder }, ... ] }
  ↓
Validate: all items have public_url, section ∈ allowed list
  ↓
Write all rows to Media sheet (match by Event Code + public_id if exists, else append)
  ↓
Call /api/revalidate /e/[code]
  ↓
Response: { ok, data: { updated: ["Media"], message: "Published" } }
  ↓
Client: toast "Published", lock panel if Active Until reached
```

### Image Editor (Crop & Adjust)

When customer clicks "Crop & adjust" on a gallery photo or hero image:

```
ImageEditor component opens
  ↓ Props: { src, aspect: 4/5 (e.g.), onSave, onCancel }
  ↓
User: Crop / Zoom (scroll-wheel) / Pan (drag) / Rotate 90°
      Aspect presets: "Best fit" (4:5), "Square" (1:1), "Landscape" (16:9), "Custom"
      Toggle: "Keep full photo" (default TRUE for Cloudinary)
  ↓ onSave click
If "Keep full photo" (non-destructive, Cloudinary only):
  Extract crop bounds { x, y, w, h } + rotation { angle }
  Compose Cloudinary transform suffix:
    /upload/a_{angle}/c_crop,x_{x},y_{y},w_{w},h_{h}/{public_id}
  Return new URL (same public_id, new transform)
  Media row's Public URL updated; public_id stays (can re-crop later)
  ↓
Else (baked, for non-Cloudinary or if toggled off):
  Render crop region to canvas
  Export canvas as JPEG/WebP
  POST /api/manage/[token]/upload with baked image
  Returns new item (new public_id, new URL)
  Old item's row may be deleted or replaced
  ↓
Client-side:
  Draft media item updated with new URL
  Preview redraws immediately
  On save: updated row written to Media sheet
```

### Size & Performance Rules

| Section | Type | Target Aspect | Resize Width | Compression | Max File | Notes |
|---------|------|----------------|--------------|-------------|----------|-------|
| `hero` (image) | JPG/WebP | 16:9 or 9:16 | 2400 px | 80% quality | 12 MB | Placeholder blur-up for next/image |
| `hero` (video) | MP4/WebM | 16:9 | 1080p max | H.264, ≤ 8 Mbps | 60 MB | Muted by default; poster frame from 00:00 |
| `gallery` | JPG/WebP | 4:5 portrait (rec.) | 1800 px | 75% quality | 10 MB | Lazy-load + blur-up. Sort by Sort Order. |
| `couple` | JPG/WebP | 1:1 or 4:5 | 1600 px | 75% quality | 10 MB | Square grid or portrait cards. |
| `sub-event:{name}` | JPG/WebP | 4:5 portrait | 1600 px | 75% quality | 10 MB | One image per sub-event (timeline card). |
| `video` (general) | MP4/WebM | 16:9 | 1080p | H.264, ≤ 12 Mbps | 100 MB | Embedded in gallery or section. |

### Cloudinary Configuration

```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**Server-side upload:**
```typescript
import { v2 as cloudinary } from 'cloudinary';

const uploadStream = cloudinary.uploader.upload_stream(
  {
    folder: `EventSites/${eventCode}/${section}`,
    resource_type: 'auto',  // auto-detect image / video
    eager: [ /* optional variants */ ],
    overwrite: false,
  },
  (error, result) => {
    if (error) throw error;
    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      width: result.width,
      height: result.height,
      duration: result.duration,  // video
      bytes: result.bytes,
    };
  }
);

fs.createReadStream(resizedImagePath).pipe(uploadStream);
```

### Cleanup (Optional, Post-MVP)

Periodically scan Cloudinary for orphaned assets (uploads not saved to the Media sheet after N days) and delete them. Command-line script or cloud function triggered by CRON.

---

## Environment Variables

```bash
# --- Google Sheets (data store) ---
GOOGLE_SHEETS_ID=                       # Spreadsheet ID from URL
GOOGLE_SERVICE_ACCOUNT_EMAIL=           # service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=                     # Private key (JSON, replace \n with actual newlines)

# --- Cloudinary (media host) ---
CLOUDINARY_CLOUD_NAME=                  # Your Cloudinary account name
CLOUDINARY_API_KEY=                     # Cloudinary API key
CLOUDINARY_API_SECRET=                  # Cloudinary API secret (server-side only, never client)

# --- Authentication ---
ADMIN_EMAIL=admin@example.com           # Single admin email v1
ADMIN_PASSWORD_HASH=                    # bcryptjs hash. Generate: node -e "console.log(require('bcryptjs').hashSync('password', 12))"
AUTH_SECRET=                            # Random string (≥ 32 chars). Signs session cookies. Generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
TOKEN_SALT=                             # Random string. Used to generate Access Tokens. Generate: node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"

# --- Email (OTP delivery) ---
RESEND_API_KEY=                         # Resend email service API key. Leave blank for dev mode (logs OTP to console).
MAIL_FROM=Event Platform <no-reply@example.com>  # From address for emails

# --- OTP & Session TTL ---
OTP_TTL_MIN=10                          # OTP valid for this many minutes
SESSION_TTL_CUSTOMER_DAYS=30            # Customer session cookie TTL
SESSION_TTL_ADMIN_HOURS=8               # Admin session cookie TTL (short for security)

# --- Misc ---
REVALIDATE_SECRET=                      # Secret header for /api/revalidate. Generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
NEXT_PUBLIC_SITE_URL=https://your-domain.com  # Public site URL (used for OG tags, email links)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=      # Cloudinary cloud name (public, for rendering)
```

**Generate secure values:**
```bash
# bcrypt hash
node -e "console.log(require('bcryptjs').hashSync('your-password', 12))"

# Random secrets (32 chars)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or use openssl
openssl rand -hex 32
```

Commit `.env.example` with all keys listed (values blank or dummy). Never commit `.env.local` or `.env.production.local`.

---

## File Structure & Key Files

```
/event-platform
├── /app
│   ├── /(marketing)/
│   │   ├── page.tsx                    # Landing page
│   │   ├── events/[type]/page.tsx      # Event type browser
│   │   └── _components/
│   │       ├── LandingTemplates.tsx    # Curated template grid
│   │       └── TemplateCard.tsx        # Template preview card
│   ├── /enquiry
│   │   ├── page.tsx                    # Enquiry form
│   │   └── thanks/page.tsx             # Confirmation
│   ├── /manage/[token]/
│   │   ├── login/page.tsx              # Email + OTP login
│   │   ├── page.tsx                    # Customer editor (EditableShell + panel)
│   │   └── layout.tsx                  # Token validation wrapper
│   ├── /e/[code]/
│   │   ├── page.tsx                    # End portal (template renderer)
│   │   ├── not-found.tsx               # No such event
│   │   └── loading.tsx                 # ISR placeholder
│   ├── /admin/
│   │   ├── login/page.tsx              # Admin email + password login
│   │   ├── page.tsx                    # Dashboard
│   │   ├── enquiries/
│   │   │   ├── page.tsx                # CRM list
│   │   │   └── [code]/page.tsx         # Enquiry detail + actions
│   │   ├── events/
│   │   │   ├── page.tsx                # Live events list (stop/resume)
│   │   │   └── [code]/page.tsx         # Admin event editor
│   │   └── layout.tsx                  # Admin session guard
│   └── /api/
│       ├── enquiry/route.ts            # POST /api/enquiry
│       ├── manage/[token]/
│       │   ├── login/route.ts          # POST OTP request + verify
│       │   ├── logout/route.ts
│       │   ├── route.ts                # GET / PATCH event data
│       │   ├── upload/route.ts         # POST file upload (Cloudinary)
│       │   └── template/route.ts       # POST template switch
│       ├── admin/
│       │   ├── login/route.ts
│       │   ├── logout/route.ts
│       │   ├── enquiries/
│       │   │   ├── route.ts            # GET list / PATCH bulk
│       │   │   └── [code]/route.ts     # GET / PATCH single
│       │   ├── approve/route.ts        # POST approve enquiry
│       │   ├── events/
│       │   │   ├── route.ts            # GET list
│       │   │   └── [code]/
│       │   │       ├── route.ts        # GET / PATCH event detail
│       │   │       ├── stop/route.ts   # POST stop
│       │   │       ├── resume/route.ts # POST resume
│       │   │       └── upload/route.ts # POST admin media upload
│       │   ├── subevents/route.ts      # CRUD sub-events
│       │   ├── rotate-token/route.ts   # POST regenerate access token
│       │   └── media/route.ts          # CRUD media rows (for bulk ops)
│       └── revalidate/route.ts         # POST /api/revalidate (ISR)
├── /components
│   ├── /templates
│   │   ├── TemplateRouter.tsx          # Main template renderer (switch on templateId)
│   │   ├── registry.ts                 # { templateId → TemplateConfig }
│   │   ├── metadata.ts                 # Template picker metadata (name, desc, category, etc.)
│   │   ├── royal/
│   │   │   ├── index.tsx               # Royal wedding template component
│   │   │   └── styles.module.css
│   │   ├── minimal/index.tsx
│   │   ├── aurora/index.tsx
│   │   └── ... (80 total)
│   ├── /ui
│   │   ├── EventCountdown.tsx          # Universal countdown timer
│   │   ├── Gallery.tsx                 # Lightbox carousel
│   │   ├── MapEmbed.tsx                # Leaflet map (venue + directions)
│   │   ├── Timeline.tsx                # Sub-events sequence
│   │   ├── MusicToggle.tsx             # Background music toggle
│   │   ├── RSVP.tsx                    # RSVP block (4 rendering modes)
│   │   ├── StickyNav.tsx               # Fixed header + scroll-spy
│   │   ├── HeroSection.tsx             # Cinematic hero (image/video + overlay)
│   │   ├── ImageEditor.tsx             # Crop & adjust (client-side)
│   │   ├── AddPhotosModal.tsx          # Multi-file uploader modal
│   │   └── ... (other primitives)
│   ├── /edit
│   │   ├── EditableShell.tsx           # Wraps template + side panel
│   │   ├── EditPanel.tsx               # Right sidebar (content + media + toggles)
│   │   ├── InlineEditor.tsx            # Contenteditable wrapper
│   │   ├── ColorPicker.tsx             # Accent color input
│   │   ├── SubEventEditor.tsx          # Row-level sub-event edit
│   │   ├── SectionToggle.tsx           # Hide Story / Hide Events, etc.
│   │   ├── TemplateGrid.tsx            # Compatible templates (for switch)
│   │   ├── MediaList.tsx               # Upload media manager list
│   │   ├── SavePublishButton.tsx       # Commit & publish button
│   │   └── StopResumeToggle.tsx        # Is Active toggle
│   ├── /admin
│   │   ├── EnquiriesTable.tsx          # CRM list table
│   │   ├── EnquiryDetail.tsx           # Single enquiry view + edit
│   │   ├── ApproveModal.tsx            # Approval flow (template switch choice + link display)
│   │   ├── LiveEventsTable.tsx         # Active events list
│   │   ├── AdminEventEditor.tsx        # Full event override editor
│   │   └── Dashboard.tsx               # Stats + recent
│   └── /shared
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── ... (layout components)
├── /lib
│   ├── types.ts                        # All TypeScript interfaces (EventData, SubEvent, MediaItem, TemplateConfig, etc.)
│   ├── sheets.ts                       # Google Sheets API wrapper (read + write for all tabs)
│   ├── media.ts                        # Cloudinary upload + transform helpers
│   ├── eventCode.ts                    # Event Code generation + validation
│   ├── auth.ts                         # Bcryptjs wrapper + session helpers
│   ├── token.ts                        # Access Token generation + validation
│   ├── otp.ts                          # OTP generation + email sending (Resend)
│   ├── dummyData.ts                    # Mock event data per template (DEMO-<TEMPLATE> entries)
│   └── constants.ts                    # Event types, template list, time limits, etc.
├── /config
│   ├── eventTypes.ts                   # Event types + their defaults (Wedding, Birthday, etc.)
│   └── templates.ts                    # (Optional) centralized template registry
├── /middleware.ts                      # Auth guards (admin + customer token/session)
├── /public
│   ├── placeholders/                   # Default hero images per template
│   ├── icons/                          # Icon sets (sub-event icons, section icons)
│   └── ... (static assets)
├── /scripts
│   ├── generate-template-previews.mjs  # Generates preview screenshots/bundles per template
│   └── seed-sheets.mjs                 # (Dev) initializes Google Sheet with structure
├── CLAUDE.md                           # Project spec (this file)
├── final.md                            # (THIS FILE) Comprehensive feature + flow guide
├── .env.example                        # Environment variables template
├── .eslintrc.json
├── .prettierrc.json
├── tsconfig.json                       # TypeScript strict mode
├── tailwind.config.ts                  # Tailwind CSS config
├── next.config.ts
└── package.json
```

---

## Design System & Tokens

### Color Palette (Brand-Neutral Base)

Define in `tailwind.config.ts` or a CSS custom-properties file:

```css
:root {
  --primary: #3B82F6;          /* Accent (customer picks via color picker) */
  --secondary: #1F2937;         /* Dark text */
  --tertiary: #F3F4F6;          /* Light background */
  --success: #10B981;           /* Positive/approved state */
  --warning: #F59E0B;           /* Caution (rate limit, etc.) */
  --danger: #EF4444;            /* Error (failed OTP, validation) */
  --accent: var(--primary);     /* Driven by Theme/Accent Color from Live */
  --muted: #D1D5DB;             /* Dividers, disabled states */
  --overlay: rgba(0, 0, 0, 0.5); /* Modal / lightbox backdrop */
}

@media (prefers-color-scheme: dark) {
  :root {
    --secondary: #F9FAFB;
    --tertiary: #111827;
    --muted: #4B5563;
  }
}
```

Each template can override these for its own identity. Use CSS variables, not hardcoded hex, so theme switching is fast.

### Typography

```css
:root {
  /* Font families */
  --font-display: "Playfair Display", serif;  /* Headlines (template-specific) */
  --font-body: "Inter", sans-serif;            /* Body text */
  --font-mono: "Fira Code", monospace;        /* Code / technical fields */

  /* Type scale */
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  --text-4xl: 2.25rem;
  --text-5xl: 3rem;
  --text-6xl: 3.75rem;

  /* Line heights */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-loose: 1.75;

  /* Letter spacing */
  --tracking-tight: -0.02em;
  --tracking-normal: 0;
  --tracking-wide: 0.05em;
}
```

Tailor `--font-display` per template (e.g., royal uses an ornate serif; modern uses a clean sans-serif).

### Spacing & Layout

Use Tailwind's default scale (4px increments) unless the template brief calls for custom gutters. Consistent spacing between components is a good default.

```
4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 96px, 128px
(sx, sm, base, lg, xl, 2xl, 3xl, 4xl, 6xl, 8xl in Tailwind)
```

Responsive breakpoints (Tailwind defaults):
- **Mobile:** 375 px (min viewport)
- **Tablet:** 768 px (md in Tailwind)
- **Desktop:** 1280 px (lg in Tailwind)
- **Wide:** 1920 px (2xl in Tailwind)

### Shadow & Elevation

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-base: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
```

Reserved for modals, cards, floating buttons. Avoid over-use; restraint reads as quality.

### Motion

```css
--transition-fast: 150ms ease;
--transition-base: 200ms ease;
--transition-slow: 300ms ease;

--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

**Principles:**
- One orchestrated page-load + scroll-reveal (Framer Motion).
- Micro-interactions on hover/focus (button highlight, label float).
- Respect `prefers-reduced-motion`: disable all animations if set.
- No auto-playing animations; user-triggered only.

### Accessibility (Invariant)

- **Keyboard focus:** visible outline on all interactive elements (4px offset, `--accent` color).
- **Color contrast:** WCAG AA minimum (4.5:1 text, 3:1 UI components).
- **Alt text:** all images have meaningful alt (empty alt for decorative).
- **Semantic HTML:** `<button>` for actions, `<a>` for navigation, `<form>` for input.
- **ARIA labels:** for icon-only buttons, modals, live regions.
- **Skip link:** skip to main content on page load.

---

## Advanced Features & Patterns

### Countdown Timer Customization

Every template has a countdown. Controlled by five `Live` columns:

1. **`hideTimer`** — TRUE hides countdown everywhere.
2. **`timerCustom`** — TRUE = customer settings below apply; FALSE = template default.
3. **`timerStyle`** — `fixed` (scrolls away with hero) or `floating` (sticky chip).
4. **`timerDesign`** — `glass / minimal / flip / rings / neon / elegant`.
5. **`timerPosition`** — `left / center / right` on the hero bottom.

**Implementation:**
```typescript
// EventCountdown.tsx
const EventCountdown: React.FC<EventCountdownProps> = ({
  event,
  style = event.timerCustom ? event.timerDesign : defaultTimerDesign(event.templateId),
  position = event.timerPosition ?? 'center',
  layout = event.timerStyle ?? 'fixed',
}) => {
  if (event.hideTimer) return null;
  
  // Render timer based on style / position / layout
  // Flagship templates (royal, minimal, etc.) may override with inline timer
  return (
    <div className={`timer-${style} timer-${layout}`}>
      {/* countdown UI */}
    </div>
  );
};
```

**Flagship templates** (listed in `TEMPLATES_WITH_INLINE_TIMER`) build the timer into their hero component and hide `EventCountdown` when `layout = fixed`. When customer picks `floating`, the shell renders `EventCountdown` as a sticky chip.

### Message Default + Override Pattern

Every template ships a default invitation message. Customer override replaces it.

```typescript
// In template component
const invitationMessage =
  event.invitationMessage?.trim() ? event.invitationMessage : template.defaults.invitationMessage;

const tagline = event.tagline?.trim() ? event.tagline : template.defaults.tagline;
const accentColor = event.accentColor?.trim() ? event.accentColor : template.defaults.accentColor;
const heroImage = event.heroImageUrl?.trim() ? event.heroImageUrl : template.defaults.heroImage;
```

Apply the same `customValue || templateDefault` fallback to every optional field so a sparse event row still renders a complete page.

### Template Switching Without Losing Data

Templates are pure presentation; all data is in the `Live` row + SubEvents + Media sheets. Switching `Template ID` updates the component rendering but keeps:
- All text content (title, message, story, etc.)
- All sub-events
- All media (reordered automatically if the new template has different section slots)
- Theme (accent color, background music)

**Implementation:**
```typescript
// Customer clicks a new template in the switcher
const switchTemplate = async (newTemplateId: string) => {
  // Validate that new template supports this event type
  const newTemplate = TEMPLATE_REGISTRY[newTemplateId];
  if (!newTemplate.eventTypes.includes(event.eventType)) {
    toast.error('Template does not support this event type');
    return;
  }

  // Update Live.Template ID
  await patch(`/api/manage/${token}`, { templateId: newTemplateId });
  
  // Revalidate public site
  await fetch(`/api/revalidate`, {
    method: 'POST',
    headers: { 'revalidate-secret': secret },
    body: JSON.stringify({ paths: [`/e/${event.eventCode}`] }),
  });

  // Reload canvas (no data loss)
  setEvent({ ...event, templateId: newTemplateId });
  toast.success('Template updated');
};
```

### Staging Model for Media

All uploads are **local drafts until save**. This prevents guests from seeing unsaved (orphaned) uploads and allows "Discard changes" to work.

```typescript
// EditContext manages draft state
const [draftMedia, setDraftMedia] = useState<MediaItem[]>(initialMedia);

const addMedia = (item: MediaItem) => {
  setDraftMedia([...draftMedia, item]);
  // Canvas preview updates immediately; sheet not written
};

const onSave = async () => {
  // Batch write all draft media to Media sheet
  const response = await patch(`/api/manage/${token}`, {
    media: draftMedia,
  });

  // Set confirmed = draft
  setConfirmedMedia(draftMedia);
  setDraftMedia(draftMedia);
};

const onDiscard = () => {
  // Revert draft to confirmed
  setDraftMedia(confirmedMedia);
};
```

### Event Code Generation & Format

Event Code is **URL-safe, immutable, and generated once at enquiry**.

```typescript
// lib/eventCode.ts
export const generateEventCode = (eventType: string, year: number): string => {
  const TYPE_PREFIX = {
    wedding: 'WED',
    birthday: 'BDY',
    engagement: 'ENG',
    anniversary: 'ANV',
    corporate: 'CORP',
    party: 'PTY',
    productLaunch: 'PROD',
    awards: 'AWD',
  }[eventType];

  // Generate 4-digit sequence number (stored in Sheets or in-memory counter)
  const seq = String(nextSequenceForType(eventType, year)).padStart(4, '0');
  
  return `${TYPE_PREFIX}-${year}-${seq}`;
  // Example: WED-2026-0001, BDY-2026-0042
};

export const isValidEventCode = (code: string): boolean => {
  return /^(WED|BDY|ENG|ANV|CORP|PTY|PROD|AWD)-\d{4}-\d{4}$/.test(code);
};
```

### Access Token Generation & Validation

Access Tokens are **long, random, scoped per event**.

```typescript
// lib/token.ts
import { randomBytes } from 'crypto';

export const generateAccessToken = (): string => {
  return randomBytes(32).toString('hex');  // 64-char hex string
};

export const validateAccessToken = async (token: string, eventCode: string, sheets: any): Promise<boolean> => {
  const row = await sheets.getEventByCode(eventCode);
  if (!row) return false;
  if (!row.Approved) return false;
  return row['Access Token'] === token;
};
```

**Rotation** (admin):
```typescript
export const rotateAccessToken = async (eventCode: string, sheets: any): Promise<string> => {
  const newToken = generateAccessToken();
  await sheets.updateEvent(eventCode, { 'Access Token': newToken });
  
  // Invalidate customer session (force OTP re-login)
  // (done via middleware clearing cust_session_<code> cookie)
  
  return newToken;
};
```

### ISR + On-Demand Revalidate

The end portal `/e/[code]` is **statically generated** and **revalidated on demand**.

```typescript
// app/e/[code]/page.tsx
export const generateStaticParams = async () => {
  // At build time: fetch all Live events (or a subset)
  const events = await sheets.getAllLiveEvents();
  return events.map(e => ({ code: e['Event Code'] }));
};

export const revalidate = 86400; // ISR: revalidate every 24 hours

export default async function EndPortalPage({ params: { code } }) {
  const event = await sheets.getEventByCode(code);
  if (!event) notFound();

  // Render template with live data
  return <TemplateRenderer event={event} />;
}
```

**On-demand revalidate** (called after publish, edit, stop, resume):
```typescript
// app/api/revalidate/route.ts
export const POST = async (req: NextRequest) => {
  const secret = req.headers.get('revalidate-secret');
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { paths } = await req.json();
  
  try {
    for (const path of paths) {
      await revalidatePath(path);  // Next.js revalidatePath
    }
    return NextResponse.json({ ok: true, revalidated: paths });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
};
```

---

## Testing & QA Checklist

### Functional Testing (Happy Path)

- [ ] **Visitor → Enquiry:**
  - [ ] Landing page loads, event types visible
  - [ ] Click event type → template grid filters by type
  - [ ] Click template → enquiry form pre-fills template
  - [ ] Fill enquiry form (all fields) → submit
  - [ ] Confirmation page shows Event Code
  - [ ] Email confirmation sent (or logged to console in dev)
  - [ ] Event Code written to Enquiries sheet ✓

- [ ] **Admin CRM:**
  - [ ] Admin logs in (email + password)
  - [ ] Dashboard shows counts + recent enquiries
  - [ ] Enquiries list shows new enquiry
  - [ ] Click enquiry → detail view
  - [ ] Edit Query Addressed, Interested, Paid Amount, Payment Status
  - [ ] Click "Approve" → copies to Live, generates Access Token
  - [ ] Two links shown: /manage/<token> + /e/<code>
  - [ ] Copy-to-clipboard works
  - [ ] Email send works (Resend or console in dev)

- [ ] **Customer Editor:**
  - [ ] Visit /manage/<token] → login form (email + OTP)
  - [ ] Enter email → OTP sent (logged to console in dev)
  - [ ] Enter OTP → session cookie set, editor loads
  - [ ] Canvas shows template with defaults (message, image, etc.)
  - [ ] Edit title → canvas updates, auto-saved
  - [ ] Upload image → crop editor opens, save non-destructively
  - [ ] Add sub-event → row appears, reorder works
  - [ ] Click "Save and publish" → Is Active = TRUE, public site revalidates
  - [ ] Toast "Published" shows

- [ ] **Public Site:**
  - [ ] Visit /e/<code] → template renders with customer data
  - [ ] Countdown ticks down
  - [ ] Hero, story, events timeline, gallery, venue map, RSVP all visible
  - [ ] Gallery lightbox works (arrow nav, swipe on mobile)
  - [ ] Map zoom/pan works, "Get directions" button works
  - [ ] All links (email, phone, social, RSVP) are clickable

### Edge Cases & Validation

- [ ] **Enquiry form validation:**
  - [ ] Email validation (invalid → error shown)
  - [ ] Mobile validation (invalid → error shown)
  - [ ] Required fields: name, email, type, date, venue (title) all enforced
  - [ ] Submission without all required → button disabled or error toast

- [ ] **Customer auth:**
  - [ ] Wrong OTP → error toast, attempts incremented
  - [ ] After 5 wrong attempts → lockout message "try again later"
  - [ ] OTP expires after 10 min → re-request
  - [ ] Max 5 OTP requests per hour → rate limit message
  - [ ] Session expires after 30 days → re-login required
  - [ ] Sign out → session cleared, next visit requires OTP

- [ ] **Admin auth:**
  - [ ] Wrong password → "incorrect" message
  - [ ] After 5 failures per 15 min → lockout
  - [ ] Session expires after 8 hours → re-login required

- [ ] **Data integrity:**
  - [ ] Enquiry cols 1–14 match Live cols 1–14 exactly after approval
  - [ ] Event Code is URL-safe (only alphanumeric + hyphen)
  - [ ] Access Token is long + random (no guessing)
  - [ ] Customer cannot edit Approved, Access Token, Is Active directly (server-validates)
  - [ ] Admin cannot see private customer data (Email, Mobile, Message, OTP Hash) on the public site

- [ ] **Media:**
  - [ ] Upload oversized file → error ("Max 10 MB")
  - [ ] Unsupported MIME type → error
  - [ ] Image crop non-destructively (Cloudinary) → re-crop works
  - [ ] Hero image resize (2400 px longest edge) without distortion
  - [ ] Gallery images lazy-load + blur-up
  - [ ] Video plays muted by default, sound on user interaction
  - [ ] Orphaned uploads on Cloudinary (uploaded but never saved) can be cleaned up

- [ ] **Template switching:**
  - [ ] Switch to incompatible event type template → error ("not supported")
  - [ ] Switch template → content carries over (same title, date, media)
  - [ ] New template renders immediately, no reload
  - [ ] Public site reflects new template on next revalidate

- [ ] **Section visibility:**
  - [ ] Toggle Hide Story → nav item disappears, section hidden
  - [ ] Same for Hide Events, Hide Gallery, Hide Venue
  - [ ] RSVP Enabled toggle controls visibility

### Mobile Responsiveness

- [ ] Viewport 375 px:
  - [ ] No horizontal scroll anywhere
  - [ ] Tap targets ≥ 44×44 px
  - [ ] Images scale + fit (object-cover)
  - [ ] Gallery → 1 column, touch swipe works
  - [ ] Edit panel → full-screen overlay (not side panel)
  - [ ] Menu → hamburger collapses to list
  - [ ] Forms stack vertically
  - [ ] Countdown timer fits without overflow

- [ ] Viewport 768 px (tablet):
  - [ ] Gallery → 2 columns
  - [ ] Side panel appears (narrow)
  - [ ] All interactive elements touch-friendly

- [ ] Viewport 1280+ px (desktop):
  - [ ] Gallery → 3 columns
  - [ ] Side panel full width
  - [ ] All spacing proportional

### Accessibility (a11y)

- [ ] **Keyboard nav:**
  - [ ] Tab through all links + buttons (visible focus outline)
  - [ ] Can submit forms with Enter key
  - [ ] Lightbox arrow keys work (← → to navigate, Esc to close)
  - [ ] Skip link present to jump to main content

- [ ] **Color contrast:**
  - [ ] All text ≥ 4.5:1 (normal) / ≥ 3:1 (large)
  - [ ] UI components (buttons) ≥ 3:1
  - [ ] Test with a contrast checker (axe DevTools, WAVE)

- [ ] **Semantic HTML:**
  - [ ] `<button>` for actions, not styled `<div>`
  - [ ] `<a>` for navigation links
  - [ ] Form inputs have `<label>` associated
  - [ ] Modals are `<dialog>` or have `role=dialog`

- [ ] **ARIA labels:**
  - [ ] Icon-only buttons have `aria-label` (e.g., close button)
  - [ ] Modal headings linked via `aria-labelledby`
  - [ ] Live regions (toasts) have `role=alert` + `aria-live=polite`
  - [ ] Image alt text is meaningful (not "image1.jpg")

- [ ] **prefers-reduced-motion:**
  - [ ] Animations disabled when `prefers-reduced-motion: reduce` is set
  - [ ] Page still fully functional (no interactions depend on animation)
  - [ ] Test with OS accessibility settings

### Performance

- [ ] **Lighthouse mobile:**
  - [ ] Performance ≥ 80
  - [ ] Accessibility = 100
  - [ ] Best Practices ≥ 90
  - [ ] SEO ≥ 90

- [ ] **Image optimization:**
  - [ ] `next/image` used everywhere (not `<img>`)
  - [ ] Proper `width` + `height` attributes (prevents layout shift)
  - [ ] Lazy loading on gallery + below-fold sections
  - [ ] Cloudinary transforms applied (f_auto, q_auto, w_*)

- [ ] **Bundle size:**
  - [ ] Total JS < 200 KB (gzipped)
  - [ ] No unused dependencies
  - [ ] Heavy libraries lazy-loaded (image editor, map)

- [ ] **API performance:**
  - [ ] `/api/manage/[token]` PATCH completes in < 2 sec
  - [ ] Media upload completes in < 5 sec (depends on file size + Cloudinary)
  - [ ] Revalidate triggers within 1 sec

### Security Testing

- [ ] **Auth bypass:**
  - [ ] Cannot access `/admin` without session → redirects to login
  - [ ] Cannot access `/manage/<token>` without valid token → 403
  - [ ] Cannot access `/api/admin/*` without session → 401
  - [ ] Cannot edit another event's data (CSRF / authorization check)

- [ ] **Data exposure:**
  - [ ] Private data (Email, Mobile, Message, OTP Hash) never rendered on public site
  - [ ] Service account credentials not in client code (confirm in browser DevTools)
  - [ ] Cloudinary API secret never sent to client
  - [ ] Auth secret never in git (committed as .env.example blank)

- [ ] **Injection attacks:**
  - [ ] Title / message / story fields: HTML injection prevented (sanitize or use textContent)
  - [ ] URLs: validated (prevent javascript: / data: URIs)
  - [ ] Database: parameterized queries (Google Sheets API handles this)

- [ ] **Rate limiting:**
  - [ ] Admin login: 5 fails per 15 min → 429
  - [ ] Customer OTP: 5 requests per hour → 429
  - [ ] Customer OTP verify: 5 fails per session → lockout 15 min

- [ ] **CSRF protection:**
  - [ ] All POST/PATCH routes validate origin + method (Next.js handles this by default)
  - [ ] Session cookies: SameSite=Lax (or Strict for admin)

---

## Performance & Optimization

### Next.js Configuration

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // Enable ISR
  isr: {
    maxMemoryUsed: 512 * 1024 * 1024, // 512 MB
  },

  // Compression
  compress: true,

  // Environment variables
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  },

  // Headers
  async headers() {
    return [
      {
        source: '/e/:code',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=604800, stale-while-revalidate=2592000' },
        ],
      },
      {
        source: '/api/revalidate',
        headers: [
          { key: 'Cache-Control', value: 'no-store' },
        ],
      },
    ];
  },

  // Redirects & rewrites
  async redirects() {
    return [];
  },

  async rewrites() {
    return [];
  },

  // Build settings
  typescript: {
    strict: true,
  },

  eslint: {
    dirs: ['app', 'lib', 'components'],
  },

  swcMinify: true,
};

export default nextConfig;
```

### Image Optimization

```typescript
// Component example
import Image from 'next/image';

<Image
  src={heroImageUrl}
  alt="Event hero"
  width={2400}
  height={1350}
  priority       // Hero image is above fold
  quality={85}   // Slight compression acceptable
  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px"
  className="object-cover w-full h-full"
/>
```

### Cloudinary Transforms

```typescript
// Optimize delivery
const optimizeUrl = (url: string): string => {
  if (!url.includes('cloudinary.com')) return url;

  // Insert transform between /upload/ and the asset
  return url.replace(
    '/upload/',
    '/upload/f_auto,q_auto,w_2400,c_fill/'
  );
};

// Example: https://res.cloudinary.com/…/upload/f_auto,q_auto,w_2400,c_fill/…
```

### Bundle Optimization

```typescript
// Code split heavy components
import dynamic from 'next/dynamic';

const ImageEditor = dynamic(() => import('@/components/edit/ImageEditor'), {
  loading: () => <div>Loading editor…</div>,
});

// Reduce @react-three/fiber, chart libraries, etc. to lazy imports
```

### Caching Strategy

```
/e/[code]
├─ ISR: revalidate every 24 hours (background)
├─ On-demand: revalidate after publish / edit / stop / resume (immediate)
├─ CDN: 1 week cache (s-maxage=604800)
└─ Stale-while-revalidate: serve stale for 30 days while regenerating

/api/manage/[token]
├─ Cache-Control: no-store (customer edits must be fresh)

/api/admin/*
├─ Cache-Control: no-store (admin data must be fresh)
```

---

## Summary

This comprehensive guide documents:

1. **All four user surfaces** (visitor, customer, admin, guest)
2. **80 templates** across 8 event categories
3. **Complete data model** (5 Google Sheets tabs)
4. **All UI components** (primitives, page-level, edit mode)
5. **Authentication** (token + OTP for customers, password for admin)
6. **Every API route** (enquiry, manage, admin, revalidate)
7. **Media pipeline** (staging, Cloudinary upload, crop)
8. **Design system** (colors, typography, motion, accessibility)
9. **Advanced patterns** (countdown customization, message defaults, template switching, ISR)
10. **Testing & QA checklist** (functional, edge cases, mobile, a11y, performance, security)

**Use this document to:**
- Onboard new team members
- Plan enhancements (search for the relevant section)
- Implement missing features (all flows are mapped)
- Debug issues (cross-reference flows + data model)
- Extend to new event types / templates (template registry pattern is clear)
- Set up CI/CD, monitoring, or scaling (architecture is serverless)

---

**Last Updated:** 2026-07-26  
**Status:** Ready for Implementation Phase 0 (Scaffold)
