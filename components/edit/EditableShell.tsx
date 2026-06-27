"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { TemplateRouter } from "@/components/templates/TemplateRouter";
import { EditPanel } from "./EditPanel";
import { EditProvider } from "./EditContext";
import type { EventData, MediaItem, SubEvent } from "@/lib/types";

export type EditableData = {
  event: EventData;
  subEvents: SubEvent[];
  media: MediaItem[];
};

type Props = EditableData & {
  templateId: string;
  /** When true, the EditPanel is always shown and the user can't dismiss it
   *  via the panel chrome — used on /manage/[token] where the page is the
   *  editor. The only "exit" path is signing out via the page header. */
  forceEdit?: boolean;
  /** When set, the panel reserves vertical space at the top so it doesn't
   *  overlap a fixed header rendered above it (e.g. ManageHeader). px. */
  topOffset?: number;
  /** When provided, the panel renders a "Save and publish" button that
   *  PATCHes the current state to this endpoint. Used on /manage/[token]. */
  saveEndpoint?: string;
  /** When provided, the Reset button POSTs here to restore template defaults
   *  on the server (instead of just clearing the local draft). */
  resetEndpoint?: string;
  /** When provided, the panel exposes a template switcher that POSTs to this
   *  URL. Only set this if the admin granted Can Change Template = TRUE. */
  templateSwitchEndpoint?: string;
  /** When provided, the Media section shows upload buttons that POST multipart
   *  form data to this URL. */
  uploadEndpoint?: string;
};

const storageKey = (code: string) => `event-edit:${code}`;

export function EditableShell({
  templateId,
  event,
  subEvents,
  media,
  forceEdit = false,
  topOffset = 0,
  saveEndpoint,
  resetEndpoint,
  templateSwitchEndpoint,
  uploadEndpoint,
}: Props) {
  const searchParams = useSearchParams();
  const editParam = forceEdit || searchParams?.get("edit") === "1";
  const [mounted, setMounted] = useState(false);

  const initial = useMemo<EditableData>(
    () => ({ event, subEvents, media }),
    // Re-initialize whenever the server gives us a different code (route change).
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [event.eventCode],
  );

  const [data, setData] = useState<EditableData>(initial);

  // Mark mounted (still needed to defer rendering the panel until after hydration).
  useEffect(() => {
    setMounted(true);
  }, []);

  // localStorage is *only* used when the shell is actually being edited.
  // Without this guard, opening the public /e/[code] page in the same browser
  // that previously edited via /manage would surface the customer's unsaved
  // draft on the public preview — a real "did I publish?" foot-gun.
  useEffect(() => {
    if (!editParam) return;
    try {
      const raw = window.localStorage.getItem(storageKey(event.eventCode));
      if (raw) setData(JSON.parse(raw) as EditableData);
    } catch {
      // Ignore corrupt JSON.
    }
  }, [event.eventCode, editParam]);

  useEffect(() => {
    if (!mounted || !editParam) return;
    try {
      window.localStorage.setItem(storageKey(event.eventCode), JSON.stringify(data));
    } catch {
      // Quota or private-mode failure — silent.
    }
  }, [data, event.eventCode, mounted, editParam]);

  const reset = () => {
    try {
      window.localStorage.removeItem(storageKey(event.eventCode));
    } catch {
      // ignore
    }
    setData(initial);
  };

  const updateMedia = (assetId: string, patch: Partial<MediaItem>) => {
    setData((d) => ({
      ...d,
      media: d.media.map((m) =>
        m.driveFileId === assetId ? { ...m, ...patch } : m,
      ),
    }));
  };

  const deleteMedia = (assetId: string) => {
    setData((d) => ({
      ...d,
      media: d.media
        .filter((m) => m.driveFileId !== assetId)
        .map((m, i) => ({ ...m, sortOrder: i + 1 })),
    }));
  };

  const addMedia = (item: MediaItem) => {
    setData((d) => {
      const sameSectionCount = d.media.filter((m) => m.section === item.section).length;
      const withOrder: MediaItem = { ...item, sortOrder: sameSectionCount + 1 };
      return { ...d, media: [...d.media, withOrder] };
    });
  };

  const replaceMedia = (oldAssetId: string, next: MediaItem) => {
    setData((d) => ({
      ...d,
      media: d.media.map((m) => {
        if (m.driveFileId !== oldAssetId) return m;
        // Preserve the existing item's user-set metadata so a Replace doesn't
        // wipe the customer's caption / section choice / autoplay flag.
        return {
          ...next,
          caption: m.caption,
          section: m.section,
          autoplay: m.autoplay,
          sortOrder: m.sortOrder,
        };
      }),
    }));
  };

  const updateEvent = (patch: Partial<EventData>) => {
    setData((d) => ({ ...d, event: { ...d.event, ...patch } }));
  };

  const clearDraft = () => {
    try {
      window.localStorage.removeItem(storageKey(event.eventCode));
    } catch {
      // ignore quota / private-mode errors
    }
  };

  return (
    <EditProvider
      enabled={!!editParam && !!uploadEndpoint}
      uploadEndpoint={uploadEndpoint ?? ""}
      addMedia={addMedia}
      replaceMedia={replaceMedia}
      updateMedia={updateMedia}
      deleteMedia={deleteMedia}
      updateEvent={updateEvent}
      clearDraft={clearDraft}
    >
      <TemplateRouter
        templateId={templateId}
        event={data.event}
        subEvents={data.subEvents}
        media={data.media}
      />

      {editParam && mounted && (
        <EditPanel
          data={data}
          onChange={setData}
          onReset={reset}
          eventCode={event.eventCode}
          locked={forceEdit}
          topOffset={topOffset}
          saveEndpoint={saveEndpoint}
          resetEndpoint={resetEndpoint}
          templateSwitchEndpoint={templateSwitchEndpoint}
          currentTemplateId={templateId}
          eventType={event.eventType}
          uploadEndpoint={uploadEndpoint}
          onAfterSave={() => {
            // Server is now the source of truth — drop the local override so a
            // refresh pulls fresh data, not stale localStorage.
            try {
              window.localStorage.removeItem(storageKey(event.eventCode));
            } catch {}
          }}
        />
      )}
    </EditProvider>
  );
}
