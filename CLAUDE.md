# Event Platform — Project Spec

> Template-based event website. A visitor picks an event type + template and sends an **enquiry**. Admin works the lead in an **admin portal** (query addressed? interested? paid?), then **approves** it. Approval unlocks a private **customer editor** ("after-enquiry page") where the customer fills/edits their event info — and, if permitted, swaps templates. Completing the info publishes the **end portal** (the live site at `/e/{EventCode}`). Admin can **stop or resume** any live event. Data lives in Google Sheets; media in Drive (MVP). No always-on server — only serverless API routes.

This file is written for **Claude Code**. Build in the phase order at the bottom, one phase per review. Keep templates presentational and data-driven.

---

## 0. Assumptions (change any and tell Claude Code)

- **Data store:** Google Sheets (recommended). Exports to `.xlsx` anytime. _A local Excel file would change the whole data layer — say so if that's a hard requirement._
- **Media:** Google Drive for MVP, **host-agnostic** — the site only reads URLs from the Media sheet, so Cloudinary can replace Drive by changing one column.
- **v1 event types:** Wedding (flagship — build first), Birthday, Engagement/Anniversary, Corporate/Conference. Schema supports any type.
- **Maps:** `react-leaflet` (no API key). Swap to a Google Maps embed if preferred.
- **Customer access:** magic-link tokens (no customer accounts). Admin approval generates a secret link. _If you'd rather have email+password customer logins, say so._
- **Out of scope for v1:** online/automated payments (payment is recorded manually in admin). Auth for admin + token access for customers IS in scope.

---

## 1. Tech stack

- **Next.js (App Router) + TypeScript (strict) + Tailwind CSS**
- **Framer Motion** (animation / scroll reveal)
- **react-leaflet** (maps, keyless)
- **googleapis** (Sheets + Drive), server-side only via a service account
- Lightweight admin auth (NextAuth credentials or a signed-cookie password gate)
- Deploy on **Vercel** (serverless API routes + ISR)

---

## 2. The four surfaces + flow

```
VISITOR                         ADMIN                          CUSTOMER (approved)
  |                               |                                 |
  | 1. Landing: pick type+template|                                 |
  | 2. /enquiry  --------------->  Enquiries sheet (New)            |
  |                               | 3. Work lead in /admin:         |
  |                               |    Query Addressed? Interested? |
  |                               |    Paid amount? (or Not Interested -> Lost)
  |                               | 4. APPROVE  ------------------>  generates Access Token
  |                               |    (copies row to Live,          + emails/shows magic link
  |                               |     sets Can-Change-Template?)   |
  |                               |                                 | 5. /manage/<token>
  |                               |                                 |    fill/edit event info,
  |                               |                                 |    upload media, sub-events,
  |                               |                                 |    (switch template if allowed)
  |                               |                                 | 6. Completing info PUBLISHES
  |                               |                                 |    the END PORTAL  -> /e/<code>
  |                               | 7. /admin Live-events view:     |    editable until Active-Until
  |                               |    see Active events, STOP/RESUME|
```

**Page map**

| Surface | Routes | Who |
|---|---|---|
| Landing + template picker | `/`, `/events/[type]` | Visitor |
| Enquiry form | `/enquiry`, `/enquiry/thanks` | Visitor |
| Customer editor ("after-enquiry page") | `/manage/[token]` | Approved customer (token-gated) |
| End portal (live site) | `/e/[code]` | Public (the customer's guests) |
| Admin | `/admin/login`, `/admin`, `/admin/enquiries`, `/admin/enquiries/[code]`, `/admin/events` | Admin only |

---

## 3. Architecture (data + auth)

```
Visitor ──> Next pages (SSG/ISR) ──> Google Sheets (read, server-side only)
   ├─ /api/enquiry              -> Enquiries sheet (+ generate Event Code, create Drive folder)
Customer (token) ──> /manage/[token]
   ├─ /api/manage/[token]       -> read/write Live row (validated by Access Token)
   ├─ /api/manage/[token]/upload-> Drive folder by code -> Media sheet
   └─ /api/manage/[token]/template -> change Template ID (only if Can Change Template)
Admin (session) ──> /admin/*
   ├─ /api/admin/enquiries[/code] -> read/update CRM fields
   ├─ /api/admin/approve        -> copy to Live, set Approved, gen Access Token, set perms
   └─ /api/admin/active         -> set Is Active true/false (+ /api/revalidate /e/[code])
/middleware.ts                  -> protect /admin + /api/admin; validate token on /manage + /api/manage
```

- Sheets/Drive credentials never reach the client. All reads/writes go through API routes or server components.
- The end portal `/e/[code]` is statically generated and **revalidated on demand** when published, edited, stopped, or resumed.

---

## 4. Data model (Google Sheets)

Five tabs. **The first 14 columns are byte-for-byte identical in `Enquiries` and `Live`** — approval copies that block across, no remapping.

### Tab: `Enquiries` (the CRM / lead pipeline)
Shared columns 1–14, then admin-managed operational columns:

| # | Column | Notes |
|---|--------|-------|
| 1 | Event Code | Generated at enquiry. Join key + Drive folder + URL slug. **URL/folder-safe only.** |
| 2 | Submitted At | Auto timestamp |
| 3 | Full Name | Contact person |
| 4 | Email | Validate (used for the magic link) |
| 5 | Mobile | With country code |
| 6 | Event Type | Drives conditional fields + which templates show |
| 7 | Event Sub-type | Optional |
| 8 | Template ID | Chosen template |
| 9 | Event Title | Public title (e.g. "Rahul weds Priya") |
| 10 | Person 1 Name | Groom / host / celebrant |
| 11 | Person 2 Name | Bride / partner (blank if N/A) |
| 12 | Tentative Date | From enquiry |
| 13 | City | |
| 14 | Message | **Internal** note from customer (NOT shown on site) |
| 15 | Status | New / Contacted / Not Interested / Approved |
| 16 | Query Addressed | TRUE/FALSE |
| 17 | Interested | Yes / No / Maybe |
| 18 | Paid Amount | Number |
| 19 | Payment Status | Pending / Paid |
| 20 | Payment Date | |
| 21 | Last Contacted On | |
| 22 | Internal Notes | Call notes |

> Admin's daily job lives in cols 15–22: address the query, mark interested or **Not Interested** (-> Lost), record the **paid amount**, then **Approve**.

### Tab: `Live` (the event — lifecycle, permissions, content)
Columns 1–14 identical to Enquiries (copied on approval; CRM cols 15–22 are NOT copied), then:

**Lifecycle & permissions**
| Column | Notes |
|---|---|
| Approved | TRUE/FALSE — gates customer editor access |
| Access Token | Long random secret -> `/manage/<token>`. Rotatable. |
| Can Change Template | TRUE/FALSE — admin grants template switching |
| Is Active | TRUE/FALSE — the **end portal live switch**. Admin Stop/Resume; customer publish-on-complete sets TRUE |
| Go Live Date | When first published |
| Active Until | Defaults to Main Date (+ optional grace). After this: editing locks and the site may auto-stop |

**Content** (drives the template, all editable by the customer): `Hero Image URL`, `Hero Video URL`, `Tagline/Hashtag`, **`Invitation Message`**, `About/Story`, `Main Date`, `Main Start Time`, `Main End Time`, `Theme/Accent Color` (hex), `Background Music URL`

**Main venue:** `Venue Name`, `Venue Address`, `Map Link`, `Latitude`, `Longitude`
**Public contact:** `Contact Name`, `Contact Phone`, `Contact Email`, `Instagram/Social Link`
**RSVP:** `RSVP Enabled` (TRUE/FALSE), `RSVP Link/Contact`

### Tab: `SubEvents` (1 row per sub-event, joined by Event Code)
`Event Code | Order | Sub-event Name | Date | Start Time | End Time | Venue Name | Venue Address | Map Link | Latitude | Longitude | Dress Code | Description | Icon`
(Mehndi / Haldi / Sangeet / Reception, or Day 1 / Day 2 sessions.)

### Tab: `Media` (1 row per file, joined by Event Code)
`Event Code | Media Type (image/video) | Section (hero/gallery/couple/sub-event:<name>) | File Name | Drive File ID | Public URL | Caption | Sort Order | Uploaded At`
The site reads `Public URL` only — the host-agnostic seam.

---

## 5. Lifecycle & permission rules (implement exactly)

1. Enquiry submitted -> `Status = New`.
2. Admin sets `Query Addressed`, `Interested`, `Paid Amount`, `Payment Status`.
   - `Interested = No` -> `Status = Not Interested` (Lost). End.
3. **Approve** (admin) — allowed when `Interested = Yes` and `Payment Status = Paid`:
   - copy shared cols 1–14 into `Live`,
   - set `Approved = TRUE`, generate a random `Access Token`, set `Can Change Template` per admin choice,
   - surface/email the link `/manage/<token>`, set `Status = Approved`.
4. **Customer editor** (`/manage/<token>`): editable only if `Approved = TRUE`. Customer fills content, sub-events, media. When the **required fields** are present (`Event Title`, `Main Date`, `Venue Name`), publishing sets `Is Active = TRUE` and the end portal goes live at `/e/<code>` (call revalidate).
5. **Editing window:** customer may keep editing until `Active Until` (the event date). Template switching only if `Can Change Template = TRUE`. After `Active Until`, editor locks; site can auto-stop or show an "event concluded" state.
6. **Admin control:** the `/admin/events` view lists Active events with **Stop** (`Is Active = FALSE`) and **Resume** (`Is Active = TRUE`), each followed by revalidate. A stopped `/e/<code>` renders a friendly "not currently available" page.

**Template switch behavior:** content is data; switching `Template ID` only swaps the rendering Component. Existing content + the message/override fallback carry over unchanged.

---

## 6. Message default + override (REQUIRED)

Every template ships its own default copy (incl. a default invitation message + placeholder images). The customer's `Invitation Message` overrides the template default when present; otherwise the default renders so the page is never empty.

```ts
// lib/types.ts
export type TemplateConfig = {
  id: string;
  name: string;
  eventTypes: EventType[];
  defaults: {
    invitationMessage: string;   // default/dummy message
    tagline: string;
    accentColor: string;         // hex
    heroImage: string;           // placeholder
  };
  Component: React.FC<{ event: EventData; subEvents: SubEvent[]; media: MediaItem[] }>;
};

// the override rule, applied to message + other optional copy:
const invitationMessage =
  event.invitationMessage?.trim() ? event.invitationMessage
                                  : template.defaults.invitationMessage;
```

Apply the same `customValue || templateDefault` fallback to tagline, accent color, and hero image, so a sparse row still produces a complete page.

---

## 7. Template system

- Each template is a **pure presentational component** receiving `{ event, subEvents, media }` — no data fetching inside.
- `components/templates/registry.ts` maps `templateId -> TemplateConfig` and exposes supported `eventTypes` (the picker and the customer's switcher filter by event type).
- **Theming:** drive an `--accent` CSS variable from `Theme/Accent Color` (fallback to template default). Recoloring multiplies apparent variety cheaply.
- Build the **Royal wedding** template first, fully; it's the reference for the rest.

---

## 8. Design bar — make every template exceptional

Treat this like a studio whose clients reject anything that looks templated. Each template must read as its own visual identity, not a theme swap.

- **Avoid the AI-default looks.** Don't default to: cream (#F4F1EA) + high-contrast serif + terracotta; near-black + one acid/vermilion accent; or broadsheet hairline rules with zero radius. Use one only if a specific template brief truly calls for it.
- **Plan a token system per template before coding:** palette (4–6 named hex), type (a characterful display face used with restraint + a complementary body face + a utility face), a one-line layout concept (sketch ASCII wireframes), and **one signature element** the template is remembered by.
- **Hero is a thesis** — open with the most characteristic moment (a treatment of the couple's names, a cinematic full-bleed image/video, an animated entrance), not a generic big-number block.
- **Typography carries personality** — deliberate pairings and a clear scale; make the type treatment memorable, not a neutral delivery vehicle.
- **Structure encodes meaning** — numbered markers (01/02/03) are only honest where order matters; the **sub-events timeline is a real sequence**, so numbering there is fine. Don't decorate elsewhere with it.
- **Motion is deliberate** — one orchestrated page-load + scroll-reveals + hover micro-interactions beat scattered effects. Restraint reads as quality; over-animation reads as AI-generated.
- **Match complexity to vision** — maximalist needs elaborate execution; minimal needs precision in spacing, type, and detail.
- **Copy is design material** — write invitation defaults and UI labels from the end-user's side, active voice, sentence case, consistent vocabulary; give empty/error states real direction, not mood.
- **Quality floor (non-negotiable):** responsive down to mobile, visible keyboard focus, `prefers-reduced-motion` respected, alt text, good contrast.
- **Process:** brainstorm the token plan -> critique it against the brief (if any part is the generic default, revise and note why) -> build -> self-critique with screenshots -> remove one accessory. Ship **2–3 visually distinct templates** (e.g. opulent/Royal, editorial/Minimal, and one with a different POV) so they never feel like one theme.

---

## 9. Interactivity & responsiveness

All client-side, zero server cost. Each must work at **375 / 768 / 1280** px:
- Cinematic hero (parallax / staged fade-in)
- **Countdown** to `Main Date`
- **Gallery** lightbox + lazy-loaded `next/image` with blur-up
- **Sub-events timeline** (ordered from the SubEvents tab)
- **Embedded map** + "Get Directions" (lat/long + Map Link)
- Sticky nav with scroll-spy
- Optional **background-music** toggle (off by default; respects autoplay rules)
- Scroll-reveal (Framer Motion)
- RSVP block (links/contact for v1)
- No horizontal scroll on mobile; skeleton/loading states

---

## 10. Customer editor — "after-enquiry page" (`/manage/[token]`)

- **Gate:** validate `token` server-side against `Live.Access Token`; require `Approved = TRUE`. Reject expired/unknown tokens with a clear message.
- **Sections:** Basics (title, names, hashtag), Story (Invitation Message + About), When & Where (main date/time, venue + map pin, lat/long), Sub-events (add/reorder/delete rows), Media (upload hero + gallery; per-section), Look (accent color), Contact + RSVP.
- **Template switcher:** shown only if `Can Change Template = TRUE`; lists templates for this event type; switching updates `Template ID` and re-renders the end portal with existing data.
- **Save = publish:** saving with required fields present sets `Is Active = TRUE` and revalidates `/e/[code]`. A "Preview" link opens the end portal.
- **Edit window:** fully editable until `Active Until`; after that the form is read-only and shows the live link.
- Use active-voice labels: "Save and publish", toast "Published"; "Stopped" matches the admin Stop action.

---

## 11. Admin portal (`/admin`)

- **Auth:** credentials/session; `middleware.ts` protects `/admin/*` and `/api/admin/*`. Single admin for v1 (env password) — upgradeable.
- **Dashboard:** counts by Status (New / Contacted / Approved / Not Interested) and live state (Active / Stopped / Expired); total Paid Amount; recent enquiries.
- **Enquiries** (`/admin/enquiries`): table (Code, Name, Type, Template, Date, Status, Interested, Paid Amount); filter by Status/Interested; search by name/code/mobile.
- **Enquiry detail** (`/admin/enquiries/[code]`): view all fields; edit `Query Addressed`, `Interested`, `Paid Amount`, `Payment Status`, `Payment Date`, `Internal Notes`. Actions: **Mark Not Interested** (Interested=No, Status=Not Interested) and **Approve** (Interested=Yes + Paid) -> copies to Live, generates Access Token + `Can Change Template` choice, shows/sends the `/manage/<token>` link.
- **Live events** (`/admin/events`): list of events with `Is Active`, `Active Until`, template, and a link to `/e/[code]`. **Stop** / **Resume** buttons (toggle `Is Active`, then revalidate). This is the "which event is active / which to stop" view.
- **Event detail / override editor** (`/admin/events/[code]`): inline editor for any `Live` row field (content, venue, RSVP, theme), plus full CRUD on that event's `SubEvents` and `Media` rows. Same field shapes as `/manage/[token]`, but admin-only — used to fix customer mistakes, fill in details on the customer's behalf, or run an admin-managed event without ever issuing a magic link. Every save triggers `/api/revalidate /e/[code]`.

---

## 12. Media handling

- `POST /api/manage/[token]/upload` -> `EventSites/{EventCode}/{section}/` on Drive -> append to `Media` with the resulting `Public URL`.
```
EventSites/
└── WED-2026-0001/
    ├── hero/  ├── gallery/  ├── videos/
    └── sub-events/{mehndi,haldi,reception}/
```
- Drive is **not** a CDN and its public direct-links are unreliable for a polished site. Keep `lib/media.ts` host-agnostic so Cloudinary can replace Drive by only changing how `Public URL` is produced.

---

## 13. Environment variables

```
GOOGLE_SHEETS_ID=
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=
GOOGLE_DRIVE_ROOT_FOLDER_ID=
ADMIN_PASSWORD=            # admin login (v1)
AUTH_SECRET=              # session + token signing
TOKEN_SALT=               # for generating Access Tokens
REVALIDATE_SECRET=
NEXT_PUBLIC_SITE_URL=
# Later (Cloudinary): CLOUDINARY_URL=
```
Ship a committed `.env.example` listing every key.

---

## 14. Conventions & constraints

- **No secrets in client code.** Sheet/Drive access is server-side only. Never expose the service account, `AUTH_SECRET`, or any token beyond the customer's own magic-link URL.
- **Access tokens** are long, random, server-validated, and rotatable; treat the link as the credential.
- **Never render private contact data.** Only the `Public contact` fields appear on `/e/[code]`; enquiry Mobile/Email/Message and Internal Notes stay internal.
- Validate email + mobile on the enquiry form.
- Treat §4 as the contract — don't rename shared columns; keep cols 1–14 identical across Enquiries and Live.
- `next/image` everywhere; lazy-load gallery; keep Lighthouse mobile healthy.
- Templates stay presentational; data arrives via props.
- Event Code strictly `[A-Z0-9-]`; format `{PREFIX}-{YEAR}-{SEQ4}` (WED/BDY/ENG/ANV/CORP) from `config/eventTypes.ts`.

---

## 15. Working with Claude Code — use the full potential

- **Plan, then build.** At the start of each phase, produce a short written plan + task list, confirm it, then execute. Stop at phase boundaries for review; one phase per commit (conventional commits).
- **Tooling from day one:** TypeScript strict, ESLint + Prettier, path aliases. Fail the build on type/lint errors.
- **Component-driven:** build `/components/ui` primitives first, reuse across every template.
- **Visual iteration loop:** run the dev server, take screenshots, critique against §8, refine. A screenshot is worth a thousand tokens — look before declaring done.
- **Use the frontend-design skill** for each template's aesthetic pass; do the token-plan + self-critique it describes.
- **Test the high-risk logic:** the message/override fallback (§6), Event Code generation, the Enquiries->Live shared-column mapping, Access Token validation, and the publish/stop state transitions (§5).
- **Mock the data first:** seed dummy events + a local stub of `lib/sheets.ts` so templates and the editor can be built before Sheets is wired.
- **Self-review passes** for accessibility, reduced-motion, keyboard focus, and mobile before moving on.
- Keep a short `NOTES.md` of aesthetic directions tried per template so later passes don't repeat them.

---

## 16. Build plan (do in order, review between phases)

- **Phase 0 — Scaffold:** Next + TS strict + Tailwind + ESLint/Prettier; repo structure (§ below); `lib/types.ts`; `config/eventTypes.ts`; `.env.example`; dummy data + `lib/sheets.ts` stub.
- **Phase 1 — Design system + UI primitives:** tokens, type scale, motion utils, and `Countdown`, `Gallery`, `MapEmbed`, `Timeline`, `MusicToggle`, `RSVP`.
- **Phase 2 — Templates (static, exceptional):** registry + Royal wedding fully, plus 1–2 distinct templates; message/override + theming on dummy data; hit the §8 bar.
- **Phase 3 — Data layer:** `lib/sheets.ts` reads Live + SubEvents + Media; `/e/[code]` with ISR + on-demand revalidate.
- **Phase 4 — Enquiry:** landing + `/events/[type]` picker + `/enquiry` form + `/api/enquiry` (validate, gen Event Code, create Drive folder) + `/enquiry/thanks`.
- **Phase 5 — Admin portal:** auth + middleware; dashboard; enquiries CRM (query addressed / interested / paid / not interested); **Approve** (copy to Live, gen token, set Can-Change-Template); **Live events** view with **Stop/Resume** + revalidate; **event detail / override editor** (`/admin/events/[code]`) for editing Live content + SubEvents + Media without going through the customer link.
- **Phase 6 — Customer editor:** `/manage/[token]` token gate; edit content + sub-events + media upload; **publish-on-complete** (Is Active); **template switch if allowed**; lock after `Active Until`.
- **Phase 7 — Polish:** per-event QR + OG image, performance + a11y pass, more templates.

---

## 17. Repo structure (target)

```
/app
  /(marketing)/page.tsx
  /(marketing)/events/[type]/page.tsx
  /enquiry/page.tsx
  /enquiry/thanks/page.tsx
  /manage/[token]/page.tsx            # customer editor ("after-enquiry page")
  /e/[code]/page.tsx                  # END PORTAL (ISR)
  /admin/login/page.tsx
  /admin/page.tsx                     # dashboard
  /admin/enquiries/page.tsx
  /admin/enquiries/[code]/page.tsx
  /admin/events/page.tsx              # active / stop control
  /admin/events/[code]/page.tsx       # admin override editor (content + SubEvents + Media)
  /api/enquiry/route.ts
  /api/manage/[token]/route.ts
  /api/manage/[token]/upload/route.ts
  /api/manage/[token]/template/route.ts
  /api/admin/enquiries/route.ts
  /api/admin/enquiries/[code]/route.ts
  /api/admin/approve/route.ts
  /api/admin/active/route.ts
  /api/admin/events/[code]/route.ts   # GET/PATCH Live row
  /api/admin/subevents/route.ts       # CRUD SubEvents rows by Event Code
  /api/admin/media/route.ts           # CRUD Media rows by Event Code (also wraps Drive ops)
  /api/revalidate/route.ts
/middleware.ts                        # protect /admin + /api/admin; validate /manage token
/components
  /templates/registry.ts
  /templates/royal/index.tsx
  /templates/minimal/index.tsx
  /ui/*
/lib
  sheets.ts  media.ts  eventCode.ts  auth.ts  token.ts  types.ts
/config/eventTypes.ts
```

---

## 18. Getting started

```bash
npx create-next-app@latest event-platform --ts --tailwind --app --eslint
cd event-platform
# place this file at the repo root as CLAUDE.md, then start Phase 0
```
