import type { EventType } from "@/lib/types";

export type EventTypeConfig = {
  id: EventType;
  label: string;
  codePrefix: string;
  description: string;
  emoji: string;
  conditionalFields: {
    showPerson2: boolean;
    person1Label: string;
    person2Label?: string;
  };
  subtypes?: string[];
};

/** The individual days offered inside the "Celebration Days" category. The
 *  chosen one is stored as `eventSubtype`, and templates read it to adapt their
 *  copy (a Father's Day page and a Valentine's page are the same machinery with
 *  different words). Order matters: it is the order shown in the form. */
export const CELEBRATION_DAYS = [
  "Father's Day",
  "Mother's Day",
  "Siblings Day / Rakhi",
  "Grandparents Day",
  "Friendship Day",
  "Valentine's Day",
  "Propose Day",
  "Baby Bump",
  "Teachers' Day",
] as const;

export const EVENT_TYPES: EventTypeConfig[] = [
  {
    id: "wedding",
    label: "Wedding",
    codePrefix: "WED",
    description: "Celebrate the union with a flagship template.",
    emoji: "💍",
    conditionalFields: {
      showPerson2: true,
      person1Label: "Groom / Host",
      person2Label: "Bride / Partner",
    },
    subtypes: ["Hindu", "Christian", "Muslim", "Sikh", "Court", "Destination"],
  },
  {
    id: "birthday",
    label: "Birthday",
    codePrefix: "BDY",
    description: "From milestone bashes to playful kids' parties.",
    emoji: "🎂",
    conditionalFields: {
      showPerson2: false,
      person1Label: "Celebrant",
    },
    subtypes: ["1st Birthday", "Sweet 16", "21st", "Milestone", "Kids"],
  },
  {
    id: "engagement",
    label: "Engagement",
    codePrefix: "ENG",
    description: "Announce the next chapter in style.",
    emoji: "💐",
    conditionalFields: {
      showPerson2: true,
      person1Label: "Partner 1",
      person2Label: "Partner 2",
    },
  },
  {
    id: "anniversary",
    label: "Anniversary",
    codePrefix: "ANV",
    description: "Honor the years with an elegant tribute.",
    emoji: "💞",
    conditionalFields: {
      showPerson2: true,
      person1Label: "Partner 1",
      person2Label: "Partner 2",
    },
    subtypes: ["Silver (25)", "Pearl (30)", "Ruby (40)", "Golden (50)"],
  },
  {
    id: "corporate",
    label: "Corporate / Conference",
    codePrefix: "CORP",
    description: "Professional event pages for launches and conferences.",
    emoji: "🏢",
    conditionalFields: {
      showPerson2: false,
      person1Label: "Host / Company",
    },
    subtypes: ["Launch", "Conference", "Summit", "Gala", "Townhall"],
  },
  {
    id: "award-ceremony",
    label: "Award Ceremony",
    codePrefix: "AWD",
    description: "Honouring excellence under the spotlight.",
    emoji: "⭐",
    conditionalFields: {
      showPerson2: false,
      person1Label: "Host / Organization",
    },
  },
  {
    // Product launches live here too — one category for "the industry is in the
    // room" events, rather than a near-duplicate of its own.
    id: "networking-event",
    label: "Networking & Launches",
    codePrefix: "NET",
    description: "Where connections are made and new things are revealed.",
    emoji: "🌐",
    conditionalFields: {
      showPerson2: false,
      person1Label: "Host / Company",
    },
    subtypes: ["Networking", "Product Launch", "Meetup", "Demo Day", "Summit"],
  },
  {
    id: "celebration-day",
    label: "Celebration Days",
    codePrefix: "DAY",
    description:
      "Father's Day, Mother's Day, Rakhi, Valentine's, a baby-bump reveal — a page for the one day that is about them.",
    emoji: "💝",
    conditionalFields: {
      showPerson2: true,
      person1Label: "Who it's for",
      person2Label: "From (optional)",
    },
    subtypes: [...CELEBRATION_DAYS],
  },
  {
    id: "party",
    label: "Party / Nightlife",
    codePrefix: "PAR",
    description: "Club nights, after-parties, and unforgettable nights out.",
    emoji: "🎉",
    conditionalFields: {
      showPerson2: false,
      person1Label: "Host / DJ",
    },
    subtypes: ["Club Night", "Afterparty", "House Party", "Cocktail Evening", "Rave", "Private Event"],
  },
];

/** Types that are no longer offered as their own category, mapped to the one
 *  that absorbed them. Live rows created before the merge still resolve, so an
 *  existing product-launch event keeps working. */
const RETIRED_TYPES: Record<string, EventType> = {
  "product-launch": "networking-event",
};

export function getEventTypeConfig(id: EventType): EventTypeConfig {
  const t = EVENT_TYPES.find((e) => e.id === id);
  if (t) return t;
  const successor = RETIRED_TYPES[id];
  const fallback = successor && EVENT_TYPES.find((e) => e.id === successor);
  if (fallback) return fallback;
  throw new Error(`Unknown event type: ${id}`);
}
