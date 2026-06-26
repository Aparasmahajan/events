"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { TemplateRouter } from "@/components/templates/TemplateRouter";
import { EditPanel } from "./EditPanel";
import type { EventData, MediaItem, SubEvent } from "@/lib/types";

export type EditableData = {
  event: EventData;
  subEvents: SubEvent[];
  media: MediaItem[];
};

type Props = EditableData & { templateId: string };

const storageKey = (code: string) => `event-edit:${code}`;

export function EditableShell({ templateId, event, subEvents, media }: Props) {
  const searchParams = useSearchParams();
  const editParam = searchParams?.get("edit") === "1";
  const [mounted, setMounted] = useState(false);

  const initial = useMemo<EditableData>(
    () => ({ event, subEvents, media }),
    // Re-initialize whenever the server gives us a different code (route change).
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [event.eventCode],
  );

  const [data, setData] = useState<EditableData>(initial);

  // Load from localStorage on mount.
  useEffect(() => {
    setMounted(true);
    try {
      const raw = window.localStorage.getItem(storageKey(event.eventCode));
      if (raw) {
        const saved = JSON.parse(raw) as EditableData;
        setData(saved);
      }
    } catch {
      // Ignore corrupt JSON.
    }
  }, [event.eventCode]);

  // Persist on every change.
  useEffect(() => {
    if (!mounted) return;
    try {
      window.localStorage.setItem(storageKey(event.eventCode), JSON.stringify(data));
    } catch {
      // Quota or private-mode failure — silent.
    }
  }, [data, event.eventCode, mounted]);

  const reset = () => {
    try {
      window.localStorage.removeItem(storageKey(event.eventCode));
    } catch {
      // ignore
    }
    setData(initial);
  };

  return (
    <>
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
        />
      )}
    </>
  );
}
