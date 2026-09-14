import { CELEBRATION_DAYS } from "@/config/eventTypes";

/** Copy that changes with the day. The "Celebration Days" category is one event
 *  type with the specific day stored as `eventSubtype`, so a single template
 *  serves Father's Day, Valentine's and a baby-bump reveal — the words change,
 *  the machinery does not. Every field is a *fallback*: whatever the customer
 *  typed always wins. */
export type DayCopy = {
  /** The day itself, as a greeting: "Happy Father's Day". */
  greeting: string;
  /** Label above the honoured name: "For", "To", "Welcome". */
  forLabel: string;
  /** Small ornament used by templates that want one. */
  icon: string;
  tagline: string;
  invitation: string;
  story: string;
  /** What the schedule section is called for this day. */
  planLabel: string;
};

const GENERIC: DayCopy = {
  greeting: "Happy day",
  forLabel: "For",
  icon: "💝",
  tagline: "One day, entirely about you",
  invitation: "A small page for a big feeling — put together by the people who mean it.",
  story: "Some things are easier written down than said out loud. So here they are, written down.",
  planLabel: "The plan",
};

const BY_DAY: Record<string, Partial<DayCopy>> = {
  "Father's Day": {
    greeting: "Happy Father's Day",
    icon: "👔",
    tagline: "For the man who fixed everything",
    invitation:
      "You never asked for a fuss, so this is a small one. Thank you for the lifts, the lectures and the bicycle repairs.",
    story: "He taught us to check the tyre pressure, argue politely, and always carry cash. This page is the thank-you note he never let us say out loud.",
    planLabel: "How we're spending the day",
  },
  "Mother's Day": {
    greeting: "Happy Mother's Day",
    icon: "💐",
    tagline: "For the one who noticed everything",
    invitation:
      "You have been the first phone call for every good and bad day. Today the phone rings the other way.",
    story: "She remembers every allergy, every exam, every heartbreak. Today she gets to be looked after for a change.",
    planLabel: "How we're spending the day",
  },
  "Siblings Day / Rakhi": {
    greeting: "Happy Rakhi",
    forLabel: "For",
    icon: "🪢",
    tagline: "Partners in every crime, unpunished",
    invitation:
      "One thread, a great deal of history, and a running argument that will outlive us both. Tie it and take your sweets.",
    story: "We shared a room, a scooter and the blame. Somehow neither of us told on the other. That is the whole bond, really.",
    planLabel: "The order of the day",
  },
  "Grandparents Day": {
    greeting: "Happy Grandparents Day",
    icon: "🫖",
    tagline: "The originals",
    invitation:
      "You spoiled us properly and covered for us reliably. Come and be spoiled back — tea at four, as always.",
    story: "Two people, one veranda, sixty years of stories told slightly differently each time. We wrote a few of them down before they change again.",
    planLabel: "The afternoon",
  },
  "Friendship Day": {
    greeting: "Happy Friendship Day",
    icon: "🤝",
    tagline: "Chosen family, unpaid therapists",
    invitation:
      "Fourteen years, eleven cities and one group chat that has never once gone quiet. Same time, same table.",
    story: "Nobody remembers who spoke first. Everybody remembers who showed up — which is the part that counts.",
    planLabel: "The plan (loose, as usual)",
  },
  "Valentine's Day": {
    greeting: "Happy Valentine's Day",
    forLabel: "For",
    icon: "❤️",
    tagline: "Still you, still yes",
    invitation:
      "No restaurant, no reservation, no performance. Just the flat, the good plates, and the record you like.",
    story: "It was never fireworks. It was someone reliably on my side, every ordinary Tuesday for years.",
    planLabel: "Tonight",
  },
  "Propose Day": {
    greeting: "There's a question",
    forLabel: "For",
    icon: "💌",
    tagline: "One question, asked properly",
    invitation:
      "This page exists because saying it out loud went badly in rehearsal eleven times. So: read to the end.",
    story: "I have been carrying this around for a while, waiting for a day worth using. Today looked about right.",
    planLabel: "How today goes",
  },
  "Baby Bump": {
    greeting: "Coming soon",
    forLabel: "Welcome",
    icon: "🤍",
    tagline: "Two became three",
    invitation:
      "Someone very small is on the way and has already rearranged everything. Come meet the bump before it becomes a person.",
    story: "First a test, then a scan, then a name shortlist neither of us can agree on. Here is the story so far, in weeks.",
    planLabel: "What's ahead",
  },
  "Teachers' Day": {
    greeting: "Happy Teachers' Day",
    icon: "📚",
    tagline: "For the one who kept the class",
    invitation:
      "You marked everything twice and believed us before we did. From all of us, thank you.",
    story: "Nobody remembers the syllabus. Everybody remembers who made them want to sit at the front.",
    planLabel: "The programme",
  },
};

/** Resolve the copy set for a subtype. Unknown/blank falls back to generic. */
export function celebrationDayCopy(subtype?: string): DayCopy {
  if (!subtype?.trim()) return GENERIC;
  const key = CELEBRATION_DAYS.find(
    (d) => d.toLowerCase() === subtype.trim().toLowerCase(),
  );
  return { ...GENERIC, ...(key ? BY_DAY[key] : undefined) };
}
