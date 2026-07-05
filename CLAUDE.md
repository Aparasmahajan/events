# Event Platform — Project Spec

> Template-based event website. A visitor picks an event type + template and sends an **enquiry**. Admin works the lead in an **admin portal** (query addressed? interested? paid?), then **approves** it. Approval unlocks a private **customer editor** ("after-enquiry page") where the customer fills/edits their event info — and, if permitted, swaps templates. Completing the info publishes the **end portal** (the live site at `/e/{EventCode}`). Admin can **stop or resume** any live event. Data lives in Google Sheets; media in Drive (MVP). No always-on server — only serverless API routes.

This file is written for **Claude Code**. Build in the phase order at the bottom, one phase per review. Keep templates presentational and data-driven.

---

## 0. Assumptions (change any and tell Claude Code)

- **Data store:** Google Sheets (recommended). Exports to `.xlsx` anytime. _A local Excel file would change the whole data layer — say so if that's a hard requirement._
- **Media:** **Cloudinary** for storage + CDN delivery. Google Drive was the original MVP plan but service accounts on personal Google accounts have zero storage quota (only Workspace + Shared Drives works around this), so we moved to Cloudinary. The site only reads `Public URL` from the Media sheet, so any other host (S3, Vercel Blob, etc.) is still a one-function swap inside `lib/media.ts`.
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
| 9 | Event Title | Public title (e.g. "Celebration Title") |
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

**Section visibility** (all default FALSE = visible; customer toggles in editor)
| Column | Notes |
|---|---|
| Hide Story | TRUE → drop the invitation / about block + nav item |
| Hide Events | TRUE → drop the sub-events timeline + nav item |
| Hide Gallery | TRUE → drop the gallery + nav item |
| Hide Venue | TRUE → drop the venue card + map + nav item |

(RSVP visibility uses the existing `RSVP Enabled`.)

**Customer-auth state** (written/cleared by the login route — never edited by hand)
| Column | Notes |
|---|---|
| OTP Hash | bcrypt of the currently-issued 6-digit code; cleared on success |
| OTP Expires At | ISO timestamp; OTP rejected after this |
| OTP Attempts | Integer; resets to 0 on success or on a new OTP request |
| OTP Locked Until | ISO timestamp; while in the future, login rejects with "try again later" |

**Content** (drives the template, all editable by the customer): `Hero Image URL`, `Hero Video URL`, `Tagline/Hashtag`, **`Invitation Message`**, `About/Story`, `Main Date`, `Main Start Time`, `Main End Time`, `Theme/Accent Color` (hex), `Background Music URL`

**Main venue:** `Venue Name`, `Venue Address`, `Map Link`, `Latitude`, `Longitude`
**Public contact:** `Contact Name`, `Contact Phone`, `Contact Email`, `Instagram/Social Link`
**RSVP:** `RSVP Enabled` (TRUE/FALSE), `RSVP Link/Contact`, `RSVP Type`

| `RSVP Type` value | How `RSVP Link/Contact` is rendered |
|---|---|
| `url` (default if value starts with `http`) | Button: "RSVP now" → opens URL in a new tab |
| `email` | Button: "RSVP — name@…" → opens `mailto:` |
| `phone` | Button: "RSVP — +91-…" → opens `tel:` |
| `text` | Plain text block (no link) — for free-form instructions like "Call Person at +91-…" |

### Tab: `SubEvents` (1 row per sub-event, joined by Event Code)
`Event Code | Order | Sub-event Name | Date | Start Time | End Time | Venue Name | Venue Address | Map Link | Latitude | Longitude | Dress Code | Description | Icon`
(Mehndi / Haldi / Sangeet / Reception, or Day 1 / Day 2 sessions.)

### Tab: `Media` (1 row per file, joined by Event Code)
`Event Code | Media Type (image/video) | Section (hero/gallery/couple/sub-event:<name>) | File Name | Drive File ID | Public URL | Caption | Sort Order | Uploaded At | Width | Height | Duration | File Size`

The site reads `Public URL` only — the host-agnostic seam. `Width`/`Height` (px) and `Duration` (seconds, videos) and `File Size` (bytes) are written by the upload pipeline (§12) and used by `next/image` for layout stability and by the customer editor to show "1200×1500 · 480 KB" alongside each item.

### Tab: `CustomBlocks` (optional, post-MVP) — 1 row per custom block
`Event Code | Section ID | Type | Title | Body | Sort Order | Visible`

For customers who want to add content beyond the schema (an extra story, a quote, a third venue, etc.). `Type` ∈ {`rich-text`, `image-row`, `quote`, `cta`}. Templates render any blocks they recognize (sorted by `Sort Order`) and ignore unknown `Type`s. Adding/removing blocks is fully managed in `/manage/[token]`.

---

## 5. Lifecycle & permission rules (implement exactly)

1. Enquiry submitted -> `Status = New`.
2. Admin sets `Query Addressed`, `Interested`, `Paid Amount`, `Payment Status`.
   - `Interested = No` -> `Status = Not Interested` (Lost). End.
3. **Approve** (admin) — allowed when `Interested = Yes` and `Payment Status = Paid`:
   - copy shared cols 1–14 into `Live`,
   - set `Approved = TRUE`, generate a random `Access Token`, set `Can Change Template` per admin choice,
   - set `Status = Approved`, and **surface two links to the customer** (admin UI shows both, copy-to-clipboard, plus an email-send button):
     - **Edit link:** `/manage/<token>` — private, token-gated, customer's editing portal.
     - **Live link:** `/e/<code>` — public end portal. Stays a "preparing your site" placeholder until `Is Active = TRUE`, then renders the template. The URL itself is stable from approval onwards, so customers can share it ahead of go-live.
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
- **Embedded map** + "Get Directions" — pins from explicit lat/long *or* coordinates parsed out of a pasted Google Maps link (`@lat,lng`, `q=/ll=/destination=lat,lng`, `!3d..!4d..`); short links with no coordinates fall back to a directions-only button (`parseLatLng` in `components/ui/MapEmbed.tsx`)
- Sticky nav with scroll-spy
- Optional **background-music** toggle (off by default; respects autoplay rules)
- Scroll-reveal (Framer Motion)
- RSVP block (links/contact for v1)
- No horizontal scroll on mobile; skeleton/loading states

---

## 10. Customer editor — "after-enquiry page" (`/manage/[token]`)

The customer's own editing portal. Every change here updates the `Live` row (or `SubEvents` / `Media`) and triggers `/api/revalidate /e/[code]` so the public site reflects edits within seconds — no admin in the loop.

### Auth — token + email OTP (two-factor)

A magic-link token alone isn't enough — URLs leak (browser history on a shared laptop, screenshots, WhatsApp). Layer an email OTP on top so the visitor must also prove they're the person who filed the enquiry.

- **Token (`/manage/<token>`)** = addressing key. Identifies which event. Validates against `Live.Access Token`; must be present and `Approved = TRUE`. Token alone never grants edit access.
- **OTP** = proof of identity. On first visit (or expired session), `/manage/<token>` renders a small login form. The customer enters the **email they enquired with**. Backend looks up `Enquiries.Email` for this Event Code, generates a 6-digit OTP, emails it (Resend / SMTP), and stores `OTP Hash` + `OTP Expires At` on the `Live` row. Customer enters the code; on match, server clears the OTP fields and sets a signed HTTP-only session cookie (`cust_session_<code>`) with a 30-day TTL.
- **Session check** runs in `middleware.ts` for `/manage/[token]/*` and `/api/manage/[token]/*`. Missing/invalid session → redirect to login. Cookie is scoped per event code so a logged-in customer for event A can't open event B without a fresh OTP.
- **Rate limit**: max 5 OTP requests per email per hour; max 5 wrong codes per session before lockout (15 min). Store counters in-memory with a small persistent fallback (`Live` row columns are fine for v1).
- **Sign out** button clears the cookie. **Admin rotate**: admin button regenerates `Access Token` and invalidates any existing session (forces fresh login).
- **Dev mode:** if no email provider is configured, log the OTP to the server console with a clear `[DEV OTP] 482301` line so the spec is testable locally.

### What the customer can do

**Text** — inline-editable fields for every public string:
- Title, tagline/hashtag, person 1/2 names
- Invitation message, about/story
- Main date, start time, end time, city
- Venue name, address, map link, lat/long
- Contact name, contact phone, contact email, social link
- RSVP link / contact

Each text field has a "clear" affordance — clearing a non-required field is how the customer "removes" it from the page. Templates already render every optional field as `{value && (...)}`, so a cleared field disappears from the live site automatically.

**Sections** — show/hide whole blocks via toggles backed by sheet columns (§4):
- `Hide Story` (the invitation/about block)
- `Hide Events` (the sub-events timeline)
- `Hide Gallery`
- `Hide Venue` (venue card + embedded map)
- `RSVP Enabled` (the existing RSVP toggle)

Hidden sections also drop out of the sticky nav. To "remove a column" the customer just flips the toggle.

**Sub-events** — full CRUD on the `SubEvents` tab for this Event Code:
- **Add** a new row via the "+ Add sub-event" button (defaults: next `Order`, name "New event", blank everything else).
- Edit any column (name, date, start/end time, venue, dress code, description, icon, **map link**, **latitude/longitude**) — each sub-event can have its own venue and map pin, so Haldi at the courtyard and Wedding at the lake render with distinct embedded maps + "Get directions" links.
- **Reorder** via the up/down arrows in each row header (drag-and-drop is a future enhancement) — the UI renumbers `Order` to stay contiguous.
- Clear an individual field (e.g. just the Dress Code) — the template auto-hides empty fields.
- Delete a sub-event row entirely; remaining rows are renumbered.

**Media** — managed mostly inline on the rendered page (the EditPanel keeps a "Manage media" list for fine edits). See §12 for the full pipeline.
- **Add photos/videos** — the gallery's **"+ Add photos"** tile *or* the side panel's **Photos & gallery → + Add photos** button opens a modal (`AddPhotosModal`) to pick **several files at once, each with its own description**, and upload them together. The gallery section renders in edit mode even when empty (templates read `useEditMode().enabled`), so there's always somewhere to add the first photo.
- **Edit / crop a photo** — click any photo for its menu: View · Edit details (caption / section / video autoplay) · **Crop & adjust** · Replace · Delete. The crop editor (`components/edit/ImageEditor.tsx`) does scroll-to-zoom, drag-to-pan, 90° **rotate**, aspect presets, and a default **"Best fit"** chip set to the ratio the current template displays that slot at (overridable — it's only a suggestion).
- **Non-destructive crop** — for Cloudinary assets, **"Keep full photo"** (on by default) saves the crop as a Cloudinary *transformation on the original*, so the complete image is preserved and can be re-cropped later; turning it off bakes a flattened copy. Demo/placeholder (non-Cloudinary) images only support the baked path.
- **Hero** — hover the hero → **Replace** (image/video) or **✂️ Crop** (image only); writes `Live.HERO_IMAGE_URL` / `HERO_VIDEO_URL`.
- **Reorder / caption / autoplay / delete** existing items from the panel's "Manage media" list (up/down arrows for order).
- **Staging:** every upload/crop/replace stages into the local draft and shows immediately; nothing reaches the `Media` sheet or the public site until **Save and publish**.

**Look** — accent color picker (writes `Theme/Accent Color` hex). Optional background music URL.

**Template switcher** — shown only if `Can Change Template = TRUE`; lists templates whose `eventTypes` include this event's type (each rendered as a thumbnail card). Switching POSTs to `/api/manage/[token]/template` which validates the new template supports the event type, updates `Template ID`, and revalidates the public site. All content + media + sub-events carry over because templates are pure presentational components (§7).

**Site status (Stop / Resume)** — the customer can flip `Is Active` from their panel without needing admin intervention. The same operation that powers the admin's `/admin/events` Stop/Resume buttons, but exposed in `/manage` as a single toggle pill. Useful when a customer needs to take the page down temporarily without losing the data. The PATCH applies immediately (not batched with other saves) so the public site goes dark / re-appears the second they click.

### Editor canvas & panel layout

The editor (`EditableShell`) owns the panel's open/collapsed state so the page never renders under the chrome:
- While the panel is open, the template canvas is inset on desktop (`sm:pr-[420px]`) so nothing — map, gallery, hero — sits behind the fixed side panel; on mobile the panel is a full-screen overlay.
- The canvas also reserves the fixed top bar's height (`paddingTop: topOffset`, 48px on `/manage`).
- **Close** collapses the panel (works even on the locked `/manage` editor) for a full-width preview; a floating **✎ Edit** button reopens it. (`?edit=1` previews additionally get **Exit**, which drops the query param.)

### Save / publish / edit-window

- **Auto-save** on each successful field commit (debounced). The current `Live` row is the source of truth.
- **Publish-on-complete:** the first save where the required fields are present (`Event Title`, `Main Date`, `Venue Name`) sets `Is Active = TRUE` and revalidates `/e/[code]`.
- **Manual republish:** explicit "Save and publish" button that forces a revalidate — useful after an admin Stop.
- **Edit window:** editable until `Active Until` (defaults to `Main Date` + grace). After that the editor is read-only and shows the live link.
- Use active-voice labels: "Save and publish", toast "Published"; "Stopped" matches the admin Stop action.

### Add custom content blocks (optional, post-MVP)

If the customer wants to "add anything" beyond the schema (a custom callout, an extra story section), use the `CustomBlocks` tab (§4) — one row per block, with `Section ID`, `Type` (rich-text / image-row / quote), `Title`, `Body`, `Sort Order`, `Visible`. Templates render any blocks they recognize for their layout, sorted by `Sort Order`. Ignore unknown types gracefully.

---

## 11. Admin portal (`/admin`)

### Auth

- **Login at `/admin/login`.** Email + password, credentials checked against env (`ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`). Single admin for v1; the allow-list format (CSV of `email:bcrypt` pairs) is upgrade-ready for multi-admin without code changes.
- Successful login sets a signed HTTP-only session cookie (`admin_session`) with an 8-hour TTL (re-login required after that — admin sessions are deliberately shorter than customer sessions).
- **`middleware.ts`** protects all `/admin/*` pages and `/api/admin/*` routes. Missing/expired session → redirect to `/admin/login?next=<original>`.
- **Rate limit:** 5 failed login attempts per email per 15 min → lockout. Log every failed attempt with IP for review.
- **Sign out** button on every admin page; also fired automatically on Stop/Resume if the session was about to expire (extends the cookie).
- No password reset flow in v1 — admin rotates by updating the env var. Document this in the runbook.
- **Dashboard:** counts by Status (New / Contacted / Approved / Not Interested) and live state (Active / Stopped / Expired); total Paid Amount; recent enquiries.
- **Enquiries** (`/admin/enquiries`): table (Code, Name, Type, Template, Date, Status, Interested, Paid Amount); filter by Status/Interested; search by name/code/mobile.
- **Enquiry detail** (`/admin/enquiries/[code]`): view all fields; edit `Query Addressed`, `Interested`, `Paid Amount`, `Payment Status`, `Payment Date`, `Internal Notes`. Actions: **Mark Not Interested** (Interested=No, Status=Not Interested) and **Approve** (Interested=Yes + Paid) -> copies to Live, generates Access Token + `Can Change Template` choice, shows/sends the `/manage/<token>` link.
- **Live events** (`/admin/events`): list of events with `Is Active`, `Active Until`, template, and a link to `/e/[code]`. **Stop** / **Resume** buttons (toggle `Is Active`, then revalidate). This is the "which event is active / which to stop" view.
- **Event detail / override editor** (`/admin/events/[code]`): inline editor for any `Live` row field (content, venue, RSVP, theme), plus full CRUD on that event's `SubEvents` and `Media` rows. Same field shapes as `/manage/[token]`, but admin-only — used to fix customer mistakes, fill in details on the customer's behalf, or run an admin-managed event without ever issuing a magic link. Every save triggers `/api/revalidate /e/[code]`.

---

## 12. Media handling

### Upload pipeline (Cloudinary) — staging model

Uploads are **staging-only**. `POST /api/manage/[token]/upload` (multipart: `file` + `section`) pushes the file to Cloudinary via a signed server upload and returns `{ ok, item }` — a ready-to-stage `MediaItem` with the `secure_url` and `public_id`. It does **not** write the `Live` row or `Media` sheet, and does **not** revalidate. The client folds the returned item into its local draft (so it shows immediately) and everything commits together on **Save and publish** (`PATCH /api/manage/[token]` → `replaceMediaForCode` + `updateLiveFields`, which then revalidates).

Why: a previous version published instantly, so guests on `/e/<code>` saw unsaved uploads and "Discard changes" couldn't undo media. Trade-off: files uploaded but never saved are orphaned on Cloudinary — fine for v1 (a periodic sweep can reclaim them).

Entry points — all stage via `EditContext` callbacks, none reload the page:
- Gallery **"+ Add photos"** tile / panel **Photos & gallery** button → `AddPhotosModal` (multi-file, per-file caption) → `addMedia` per item.
- Click a gallery photo → **Replace** → `replaceMedia`; **Crop & adjust** → image editor (below).
- Hero hover → **Replace** / **Crop** → `updateEvent({ heroImageUrl | heroVideoUrl })` (hero lives on the `Live` row, not the Media tab; no Media row is written for hero).
- Folder structure on Cloudinary: `EventSites/{EventCode}/{section}/`. `Public URL` = `secure_url`; the `Drive File ID` column stores Cloudinary's `public_id`.

### Image editor (`components/edit/ImageEditor.tsx`)

Crop / zoom / pan / 90° **rotate**, opened from a gallery photo's "Crop & adjust" or the hero's "Crop". Shows a default **"Best fit"** aspect chip equal to the slot's display ratio (gallery 4:5, hero 16:9), passed in by the caller and overridable. Two save modes, surfaced as a "Keep full photo" toggle:
- **Non-destructive** (default for Cloudinary) — the crop is encoded as a Cloudinary transform (`/upload/a_<deg>/c_crop,x_,y_,w_,h_/…`) on the **original** asset. The full image is preserved; re-opening the editor strips the transform and crops from the full photo again. Only `Public URL` changes; `public_id` stays.
- **Baked** — renders the visible region to a canvas and uploads a new flat image. Used when the toggle is off, and the only option for non-Cloudinary/demo images (those have no `/upload/` transform support).

### Caps + auto-fit

- Image: 12 MB max. Video: 100 MB max. Enforced in the upload route before the file leaves the server.
- All images render with CSS `object-cover`, so a portrait dropped into a landscape hero or vice versa fills the slot without distortion — Cloudinary stores the original; the cropping happens at render time.
- Future polish: pass a Cloudinary transformation suffix to the URL (`f_auto,q_auto,w_2400,c_fill`) to serve already-optimized assets per device. Doesn't require a code change to add later — just template-level URL composition.

### Reordering / captions / autoplay / delete

All non-upload edits are handled inside the EditPanel (caption, section reassignment, drag-up/down sort, autoplay toggle for videos, delete) and batched into the next **Save and publish** via `PATCH /api/manage/[token]` (handled by `replaceMediaForCode` in `lib/sheets.ts`).

### Original Drive notes (kept for historical context)

We initially planned Google Drive for media. It didn't work because service accounts on personal Google accounts have zero storage quota — every upload returns 403 `storageQuotaExceeded`. Workspace + Shared Drives solves that but requires a paid plan. Switching to Cloudinary was less effort and gives us a real CDN.

### Per-section size + dimension rules

The upload route validates and (for images) server-side resizes via `sharp` so the live site always loads sane assets. Reject anything over the cap with a clear error.

| Section | Type | Target aspect | Resize to (longest edge) | Max file | Notes |
|---|---|---|---|---|---|
| `hero` (image) | image | 16:9 (landscape) or 9:16 (portrait, for portrait-hero templates) | 2400 px | 12 MB | Generate a `_blur` placeholder for `next/image` blur-up |
| `hero` (video) | video | 16:9 | 1080p, ≤ 30 s, ≤ 8 Mbps | 60 MB | Auto-mute by default; show poster from first frame |
| `gallery` | image | 4:5 portrait recommended; any allowed | 1800 px | 10 MB | Sorted by `Sort Order` in `Media` |
| `couple` / `about` | image | square or 4:5 | 1600 px | 10 MB | |
| `sub-event:{name}` | image | 4:5 portrait | 1600 px | 10 MB | Joined to sub-event row by `Section` |
| `videos` | video | 16:9 | 1080p, ≤ 60 s, ≤ 12 Mbps | 100 MB | |

Implementation notes:
- **Images:** server-side via `sharp` — strip EXIF, convert to JPEG (≥ 80% quality) or WebP/AVIF, resize keeping aspect, write `Width`/`Height` back into the `Media` row.
- **Videos (MVP):** accept as-is within the caps, store the file. Optional later: ffmpeg transcode to mp4/h264 + generate poster image.
- **Client-side guard:** show the limits in the upload UI and validate before POSTing so users don't wait for a 413.
- **Display:** all `<Image>` calls use the recorded `Width`/`Height` (or known section ratios) so layout is stable; gallery uses `next/image` with `sizes` matching the column count.

### Reordering

- `Media.Sort Order` (number) is the canonical order — gallery is sorted ascending.
- Customer editor exposes drag-and-drop; on drop, PATCH the affected rows' `Sort Order` in one batch call.
- Same pattern for `SubEvents.Order`.

---

## 13. Environment variables

```
# --- Google Sheets (data store) ---
GOOGLE_SHEETS_ID=
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=

# --- Cloudinary (media host) ---
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# --- Auth ---
ADMIN_EMAIL=                       # single admin v1; CSV-ready for multi
ADMIN_PASSWORD_HASH=               # bcrypt of the admin password
AUTH_SECRET=                       # signs admin + customer session cookies, JWT-style
TOKEN_SALT=                        # for generating Access Tokens (Live.Access Token)
OTP_TTL_MIN=10                     # customer OTP lifetime
SESSION_TTL_CUSTOMER_DAYS=30
SESSION_TTL_ADMIN_HOURS=8

# --- Email (for customer OTP delivery) ---
RESEND_API_KEY=                    # Resend is the recommended provider
MAIL_FROM=Event Platform <no-reply@example.com>
# DEV: if RESEND_API_KEY is empty, the OTP is logged to the server console as
# [DEV OTP] <code> so local testing works without a mail account.

# --- Misc ---
REVALIDATE_SECRET=
NEXT_PUBLIC_SITE_URL=
# Later (Cloudinary): CLOUDINARY_URL=
```
Ship a committed `.env.example` listing every key. Generate `ADMIN_PASSWORD_HASH` with `node -e "console.log(require('bcryptjs').hashSync(process.argv[1], 12))" 'your-password'`.

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
  - **Template catalog (24, as of 2026-07-05):** all live under `components/templates/<id>/index.tsx`, registered in `components/templates/TemplateRouter.tsx`, discoverable via `components/templates/metadata.ts`. Each has a demo bundle in `lib/dummyData.ts` keyed by `DEMO-<TEMPLATE>` and previewed by `scripts/generate-template-previews.mjs`.
    - Wedding & romantic: **royal** (big-fat-Indian), **minimal** (whitespace/editorial), **aurora** (cinematic-celestial), **obsidian** (black-tie), **celestia** (ethereal), **pastel** (soft-romance), **empyrean** (divine-marble), **prism** (crystal-iridescent), **promise** (engagement, split-names converge on scroll), **chapters** (anniversary chronicles).
    - Birthday & party: **vibrant** (kids/pink-confetti), **orbit** (cosmic-kids), **arcade** (80s synthwave), **modern** (dark bold), **after** (Berlin nightlife), **metropolis** (Tokyo-cyberpunk skyline).
    - Corporate, launch, awards, networking: **pinnacle** (executive summit), **nexus** (cyberpunk launch), **neural** (AI-summit / research), **unveil** (dramatic reveal keynote), **luminary** (celestial gala), **odeon** (Oscars/red-carpet awards), **converge** (warm networking), **constella** (constellation networking).
  - Signature-motif intent per template is documented in each file's opening block — keep in mind when regenerating previews or redesigning that the intended motif (staircase-of-clouds for empyrean, prism-beam for prism, laser-sweeps for metropolis, etc.) is what makes each template distinct in the picker grid.
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
  /manage/[token]/login/page.tsx      # email + OTP login (customer)
  /manage/[token]/page.tsx            # customer editor ("after-enquiry page")
  /e/[code]/page.tsx                  # END PORTAL (ISR)
  /admin/login/page.tsx
  /admin/page.tsx                     # dashboard
  /admin/enquiries/page.tsx
  /admin/enquiries/[code]/page.tsx
  /admin/events/page.tsx              # active / stop control
  /admin/events/[code]/page.tsx       # admin override editor (content + SubEvents + Media)
  /api/enquiry/route.ts
  /api/manage/[token]/login/route.ts        # request OTP (POST email) + verify OTP (POST code)
  /api/manage/[token]/logout/route.ts
  /api/manage/[token]/route.ts
  /api/manage/[token]/upload/route.ts
  /api/manage/[token]/template/route.ts
  /api/admin/login/route.ts
  /api/admin/logout/route.ts
  /api/admin/enquiries/route.ts
  /api/admin/enquiries/[code]/route.ts
  /api/admin/approve/route.ts
  /api/admin/active/route.ts
  /api/admin/rotate-token/route.ts          # regenerate Live.Access Token, invalidate customer sessions
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
