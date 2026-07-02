import type { FC } from "react";

export type EventType =
  | "wedding"
  | "birthday"
  | "engagement"
  | "anniversary"
  | "corporate"
  | "product-launch"
  | "award-ceremony"
  | "networking-event"
  | "party";

export type TemplateTag =
  | "cool"
  | "decent"
  | "appealing"
  | "elegant"
  | "royal"
  | "minimal"
  | "modern"
  | "traditional"
  | "vibrant"
  | "romantic"
  | "luxurious"
  | "playful"
  | "festive"
  | "monochrome"
  | "pastel"
  | "bold"
  | "cinematic"
  | "interactive"
  | "botanical"
  | "editorial"
  | "neon"
  | "whimsical"
  | "cyberpunk"
  | "glass"
  | "premium"
  | "organic"
  | "celestial"
  | "architectural"
  | "tech"
  | "artistic";

export type EventData = {
  eventCode: string;
  eventType: EventType;
  eventSubtype?: string;
  templateId: string;
  eventTitle: string;
  person1Name: string;
  person2Name?: string;
  tentativeDate?: string;
  city?: string;

  isActive: boolean;
  slug?: string;
  goLiveDate?: string;
  expiryDate?: string;

  heroImageUrl?: string;
  heroVideoUrl?: string;
  tagline?: string;
  invitationMessage?: string;
  aboutStory?: string;
  mainDate?: string;
  mainStartTime?: string;
  mainEndTime?: string;
  themeAccentColor?: string;
  backgroundMusicUrl?: string;

  venueName?: string;
  venueAddress?: string;
  mapLink?: string;
  latitude?: number;
  longitude?: number;

  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  socialLink?: string;

  rsvpEnabled?: boolean;
  rsvpLinkOrContact?: string;
  /** How the value in rsvpLinkOrContact should be rendered:
   *  - "email": wrap in mailto: link, show "RSVP — email@…"
   *  - "phone": wrap in tel: link, show "RSVP — +91-…"
   *  - "url": full external link, button reads "RSVP now"
   *  - "text": plain text (default — no link)
   *  Defaults to "url" if rsvpLinkOrContact starts with http, otherwise "text". */
  rsvpType?: "email" | "phone" | "url" | "text";

  // Section visibility overrides (set true to hide). Default is to show.
  hideStory?: boolean;
  hideEvents?: boolean;
  hideGallery?: boolean;
  hideVenue?: boolean;
};

export type SubEvent = {
  eventCode: string;
  order: number;
  name: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  venueName?: string;
  venueAddress?: string;
  mapLink?: string;
  latitude?: number;
  longitude?: number;
  dressCode?: string;
  description?: string;
  icon?: string;
};

export type MediaItem = {
  eventCode: string;
  mediaType: "image" | "video";
  section: string;
  fileName: string;
  driveFileId?: string;
  publicUrl: string;
  caption?: string;
  sortOrder: number;
  uploadedAt?: string;
  /** Videos only. When true, the video plays inline muted on loop (instagram-
   *  style). When false/undefined, the template renders a play-controls
   *  player that opens on click. Hero videos always autoplay regardless. */
  autoplay?: boolean;
};

export type TemplateDefaults = {
  invitationMessage: string;
  tagline: string;
  accentColor: string;
  heroImage: string;
  aboutStory?: string;
  galleryImages?: string[];
};

export type TemplateVibe = {
  /** Human-readable category label, e.g. "Night Luxe", "Vintage Royal" */
  label: string;
  /** Color used for the vibe dot on template cards */
  color: string;
};

export type TemplateMeta = {
  id: string;
  name: string;
  description: string;
  eventTypes: EventType[];
  tags: TemplateTag[];
  previewImage: string;
  defaults: TemplateDefaults;
  /** Emoji / symbol for the template card visual */
  icon: string;
  /** Vibe category shown as a colored dot on template tiles */
  vibe: TemplateVibe;
};

export type TemplateProps = {
  event: EventData;
  subEvents: SubEvent[];
  media: MediaItem[];
};

export type TemplateComponent = FC<TemplateProps>;

export type EnquiryPayload = {
  fullName: string;
  email: string;
  mobile: string;
  eventType: EventType;
  eventSubtype?: string;
  templateId: string;
  eventTitle: string;
  person1Name: string;
  person2Name?: string;
  tentativeDate?: string;
  city?: string;
  message?: string;
};
