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
];

export function getEventTypeConfig(id: EventType): EventTypeConfig {
  const t = EVENT_TYPES.find((e) => e.id === id);
  if (!t) throw new Error(`Unknown event type: ${id}`);
  return t;
}
