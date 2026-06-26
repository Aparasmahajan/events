import type { FC } from "react";

export type EventType =
  | "wedding"
  | "birthday"
  | "engagement"
  | "anniversary"
  | "corporate";

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
  | "whimsical";

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
};

export type TemplateDefaults = {
  invitationMessage: string;
  tagline: string;
  accentColor: string;
  heroImage: string;
  aboutStory?: string;
  galleryImages?: string[];
};

export type TemplateMeta = {
  id: string;
  name: string;
  description: string;
  eventTypes: EventType[];
  tags: TemplateTag[];
  previewImage: string;
  defaults: TemplateDefaults;
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
