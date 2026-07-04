"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { EventData, MediaItem } from "@/lib/types";

type EditContextValue = {
  /** When true, EditableImage / HeroMedia render the hover-to-replace UI. */
  enabled: boolean;
  /** /api/manage/<token>/upload — POST multipart `file` + `section`.
   *  Now staging-only: returns the new MediaItem with a Cloudinary URL but
   *  does NOT update the Media sheet. Caller adds the item to local state
   *  via the callbacks below; Save and publish commits to the sheet. */
  uploadEndpoint: string;
  /** Append a new media item to the local draft. */
  addMedia?: (item: MediaItem) => void;
  /** Replace an existing media item by Cloudinary public_id (driveFileId). */
  replaceMedia?: (oldAssetId: string, next: MediaItem) => void;
  /** Patch the caption / section / autoplay etc. on an existing item. */
  updateMedia?: (assetId: string, patch: Partial<MediaItem>) => void;
  /** Remove an item from the local draft. */
  deleteMedia?: (assetId: string) => void;
  /** Patch any event field — used by HeroMedia to set heroImageUrl /
   *  heroVideoUrl after a hero upload. */
  updateEvent?: (patch: Partial<EventData>) => void;
  /** Wipe the panel's localStorage draft so the next reload pulls fresh
   *  server data. Used by the "Discard changes" button. */
  clearDraft?: () => void;
};

const EditContext = createContext<EditContextValue | null>(null);

export function EditProvider({
  enabled,
  uploadEndpoint,
  addMedia,
  replaceMedia,
  updateMedia,
  deleteMedia,
  updateEvent,
  clearDraft,
  children,
}: {
  enabled: boolean;
  uploadEndpoint: string;
  addMedia?: EditContextValue["addMedia"];
  replaceMedia?: EditContextValue["replaceMedia"];
  updateMedia?: EditContextValue["updateMedia"];
  deleteMedia?: EditContextValue["deleteMedia"];
  updateEvent?: EditContextValue["updateEvent"];
  clearDraft?: EditContextValue["clearDraft"];
  children: ReactNode;
}) {
  return (
    <EditContext.Provider
      value={{
        enabled,
        uploadEndpoint,
        addMedia,
        replaceMedia,
        updateMedia,
        deleteMedia,
        updateEvent,
        clearDraft,
      }}
    >
      {children}
    </EditContext.Provider>
  );
}

export function useEditMode(): EditContextValue | null {
  return useContext(EditContext);
}
