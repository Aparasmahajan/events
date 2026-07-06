"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { EventData, EventType, MediaItem, SubEvent } from "@/lib/types";
import type { EditableData } from "./EditableShell";
import { TEMPLATES_META } from "@/components/templates/metadata";
import { AddPhotosModal } from "./AddPhotosModal";

type Props = {
  data: EditableData;
  onChange: (next: EditableData) => void;
  onReset: () => void;
  eventCode: string;
  /** When true, the user can't collapse or exit the panel from inside it.
   *  Used on /manage/[token] where the panel is the page. */
  locked?: boolean;
  /** Push the panel down by N px so it doesn't sit under a fixed top bar. */
  topOffset?: number;
  /** When set, renders a "Save and publish" button that PATCHes to this URL. */
  saveEndpoint?: string;
  /** When set, "Reset" calls this URL to restore template defaults on the
   *  server (instead of just clearing the local draft). */
  resetEndpoint?: string;
  /** When set, the template switcher section is shown. POSTs the chosen
   *  templateId to this URL. */
  templateSwitchEndpoint?: string;
  /** Current template ID — used to highlight the active option in the switcher. */
  currentTemplateId?: string;
  /** Event type — used to filter templates the switcher offers. */
  eventType?: EventType;
  /** When set, the Media section is shown with upload buttons that POST
   *  multipart form data to this URL. */
  uploadEndpoint?: string;
  /** Called after a successful save (e.g. to clear localStorage). */
  onAfterSave?: () => void;
  /** Controlled open/collapsed state. When provided, the shell owns it so it
   *  can reserve page width for the panel. Falls back to internal state. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

type SaveState =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "ok"; published: boolean }
  | { kind: "err"; message: string };

export function EditPanel({
  data,
  onChange,
  onReset,
  eventCode,
  locked = false,
  topOffset = 0,
  saveEndpoint,
  resetEndpoint,
  templateSwitchEndpoint,
  currentTemplateId,
  eventType,
  uploadEndpoint,
  onAfterSave,
  open: openProp,
  onOpenChange,
}: Props) {
  const [openInternal, setOpenInternal] = useState(true);
  const open = openProp ?? openInternal;
  const setOpen = onOpenChange ?? setOpenInternal;
  const [addingPhotos, setAddingPhotos] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>({ kind: "idle" });
  const [resetting, setResetting] = useState(false);

  const handleReset = async (
    sections: ("all" | "details" | "story" | "visibility" | "subEvents")[] = ["all"],
    confirmMessage?: string,
  ) => {
    if (!resetEndpoint) {
      onReset();
      return;
    }
    const msg =
      confirmMessage ??
      "Reset all template content back to defaults?\n\n" +
        "Your title, names, contact email and tentative date are kept. " +
        "Everything else (tagline, invitation, venue, sub-events, accent color) " +
        "is restored to the template's starter content.";
    if (!window.confirm(msg)) return;
    setResetting(true);
    try {
      const res = await fetch(resetEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Reset failed");
      }
      onReset(); // clears localStorage so reload pulls fresh sheet state
      window.location.reload();
    } catch (e) {
      setSaveState({
        kind: "err",
        message: e instanceof Error ? e.message : "Reset failed",
      });
    } finally {
      setResetting(false);
    }
  };

  const switchTemplate = async (templateId: string) => {
    if (!templateSwitchEndpoint || templateId === currentTemplateId) return;
    if (!window.confirm(
      "Switch to this template?\n\n" +
      "Your content (title, names, dates, sub-events, RSVP) is preserved. " +
      "The new template will re-render with your data — accent colors and " +
      "tagline may change to fit the new look.",
    )) return;
    try {
      const res = await fetch(templateSwitchEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? "Switch failed");
      onReset();
      window.location.reload();
    } catch (e) {
      setSaveState({
        kind: "err",
        message: e instanceof Error ? e.message : "Switch failed",
      });
    }
  };

  /** Stop/Resume fires a focused PATCH (just isActive) and updates locally so
   *  the button reflects state instantly — admin Stop/Resume works the same. */
  const toggleActive = async () => {
    if (!saveEndpoint) {
      patchEvent({ isActive: !data.event.isActive });
      return;
    }
    const next = !data.event.isActive;
    patchEvent({ isActive: next });
    setSaveState({ kind: "saving" });
    try {
      const res = await fetch(saveEndpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: { isActive: next } }),
      });
      if (!res.ok) throw new Error("Failed");
      setSaveState({ kind: "ok", published: next });
      setTimeout(() => setSaveState({ kind: "idle" }), 3000);
    } catch (e) {
      // Roll back the local toggle on failure.
      patchEvent({ isActive: !next });
      setSaveState({
        kind: "err",
        message: e instanceof Error ? e.message : "Failed",
      });
    }
  };

  const save = async () => {
    if (!saveEndpoint) return;
    setSaveState({ kind: "saving" });
    try {
      const res = await fetch(saveEndpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: data.event,
          subEvents: data.subEvents,
          media: data.media,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? "Save failed");
      setSaveState({ kind: "ok", published: !!body.published });
      onAfterSave?.();
      // Auto-clear the success state after a few seconds.
      setTimeout(() => setSaveState({ kind: "idle" }), 4000);
    } catch (e) {
      setSaveState({
        kind: "err",
        message: e instanceof Error ? e.message : "Save failed",
      });
    }
  };

  const discardChanges = () => {
    if (
      !window.confirm(
        "Discard all unsaved changes and reload?\n\n" +
          "This reverts any text edits, sub-event tweaks, media uploads or " +
          "swaps that you haven't pushed live yet. Already-published content " +
          "stays as-is.",
      )
    )
      return;
    onReset(); // clears localStorage
    window.location.reload();
  };

  const required = {
    title: !!data.event.eventTitle?.trim(),
    date: !!data.event.mainDate?.trim(),
    venue: !!data.event.venueName?.trim(),
  };
  const readyToPublish = required.title && required.date && required.venue;

  const patchEvent = (patch: Partial<EventData>) =>
    onChange({ ...data, event: { ...data.event, ...patch } });

  const patchSubEvent = (index: number, patch: Partial<SubEvent>) =>
    onChange({
      ...data,
      subEvents: data.subEvents.map((s, i) => (i === index ? { ...s, ...patch } : s)),
    });

  const deleteSubEvent = (index: number) =>
    onChange({
      ...data,
      subEvents: data.subEvents
        .filter((_, i) => i !== index)
        // Re-number remaining sub-events so Order stays 1..N contiguous.
        .map((s, i) => ({ ...s, order: i + 1 })),
    });

  const addSubEvent = () =>
    onChange({
      ...data,
      subEvents: [
        ...data.subEvents,
        {
          eventCode: data.event.eventCode,
          order: data.subEvents.length + 1,
          name: "New event",
          icon: "•",
        },
      ],
    });

  const moveSubEvent = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= data.subEvents.length) return;
    const next = [...data.subEvents];
    [next[index], next[target]] = [next[target], next[index]];
    onChange({
      ...data,
      // Re-number to keep Order contiguous regardless of array position.
      subEvents: next.map((s, i) => ({ ...s, order: i + 1 })),
    });
  };

  /* ── Media helpers (local-state — actual writes via Save and publish). ── */
  const patchMedia = (index: number, patch: Partial<MediaItem>) =>
    onChange({
      ...data,
      media: data.media.map((m, i) => (i === index ? { ...m, ...patch } : m)),
    });

  const deleteMedia = (index: number) =>
    onChange({
      ...data,
      media: data.media
        .filter((_, i) => i !== index)
        .map((m, i) => ({ ...m, sortOrder: i + 1 })),
    });

  const moveMedia = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= data.media.length) return;
    const next = [...data.media];
    [next[index], next[target]] = [next[target], next[index]];
    onChange({
      ...data,
      media: next.map((m, i) => ({ ...m, sortOrder: i + 1 })),
    });
  };

  // Uploads now happen inline on the rendered template (click any photo /
  // video / "+ add" tile in the page itself). The panel only handles
  // caption / sort order / autoplay / delete on existing items.

  const exitEdit = () => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.delete("edit");
    window.location.assign(url.toString());
  };

  return (
    <>
      {/* Floating "reopen" toggle whenever the panel is collapsed — available
          even when locked (on /manage) so the customer can preview their page
          full-width and bring the editor back. */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="reopen"
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 80 }}
            onClick={() => setOpen(true)}
            style={{ top: topOffset + 16 }}
            className="fixed right-4 z-[60] px-4 py-2 rounded-full bg-neutral-900 text-white text-sm shadow-lg hover:bg-neutral-800"
          >
            ✎ Edit
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.aside
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 220, damping: 26 }}
            style={{ top: topOffset }}
            className="fixed right-0 bottom-0 z-[60] w-full sm:w-[420px] bg-white text-neutral-900 shadow-2xl border-l border-black/10 flex flex-col"
          >
            <header
              style={{ top: topOffset }}
              className="px-5 py-4 border-b border-black/10 flex items-center justify-between gap-3 sticky bg-white z-10"
            >
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] opacity-60">Edit mode</p>
                <p className="font-display text-lg leading-tight">{eventCode}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleReset(["all"])}
                  disabled={resetting}
                  className="text-xs px-3 py-1.5 rounded-full border border-black/15 hover:bg-black/5 disabled:opacity-50"
                  title={resetEndpoint
                    ? "Restore template defaults (keeps your name, title, date)"
                    : "Discard local edits"}
                >
                  {resetting ? "…" : "Reset all"}
                </button>
                {/* Collapse the panel — always available, including on the
                    locked /manage editor, so edit mode can be closed to preview. */}
                <button
                  onClick={() => setOpen(false)}
                  className="text-xs px-3 py-1.5 rounded-full hover:bg-black/5"
                  aria-label="Close edit panel"
                >
                  Close
                </button>
                {/* "Exit" strips ?edit=1; only meaningful on the preview, not on
                    the locked /manage page (where you leave by signing out). */}
                {!locked && (
                  <button
                    onClick={exitEdit}
                    className="text-xs px-3 py-1.5 rounded-full bg-neutral-900 text-white hover:bg-neutral-800"
                  >
                    Exit
                  </button>
                )}
              </div>
            </header>

            <div className="overflow-y-auto p-5 space-y-6 font-sans text-sm">
              {saveEndpoint && (
                <section className="rounded-xl border border-black/10 p-4 flex items-center justify-between gap-3 bg-white">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] opacity-60">
                      Site status
                    </p>
                    <p className="text-sm mt-1">
                      {data.event.isActive ? (
                        <span className="text-green-700 font-medium">Live on /e/{eventCode}</span>
                      ) : (
                        <span className="opacity-70">Stopped — not visible to guests</span>
                      )}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={toggleActive}
                    disabled={saveState.kind === "saving"}
                    className={`text-xs px-4 py-2 rounded-full font-medium transition disabled:opacity-50 ${
                      data.event.isActive
                        ? "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                        : "bg-green-700 text-white hover:bg-green-800"
                    }`}
                  >
                    {saveState.kind === "saving"
                      ? "…"
                      : data.event.isActive
                        ? "Stop"
                        : "Resume"}
                  </button>
                </section>
              )}

              {saveEndpoint && (
                <section className="rounded-xl border border-black/10 bg-neutral-50 p-4">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <p className="text-[10px] uppercase tracking-[0.3em] opacity-60">
                      Save changes
                    </p>
                    <SaveStatusPill state={saveState} />
                  </div>
                  <button
                    onClick={save}
                    disabled={saveState.kind === "saving"}
                    className="w-full px-4 py-2.5 rounded-full bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition disabled:opacity-50"
                  >
                    {saveState.kind === "saving"
                      ? "Saving…"
                      : readyToPublish
                        ? "Save and publish"
                        : "Save draft"}
                  </button>
                  <button
                    onClick={discardChanges}
                    disabled={saveState.kind === "saving"}
                    className="w-full mt-2 px-4 py-2 rounded-full border border-black/15 text-neutral-700 text-xs hover:bg-black/5 transition disabled:opacity-50"
                  >
                    ↩ Discard unsaved changes
                  </button>
                  {!readyToPublish && (
                    <p className="text-[11px] opacity-70 mt-2 leading-snug">
                      Add the {[
                        !required.title && "event title",
                        !required.date && "main date",
                        !required.venue && "venue name",
                      ]
                        .filter(Boolean)
                        .join(", ")}{" "}
                      to publish the live site. Until then your changes save as a
                      draft.
                    </p>
                  )}
                </section>
              )}

              <Section
                title="Visible sections"
                onReset={
                  resetEndpoint
                    ? () =>
                        handleReset(
                          ["visibility"],
                          "Show all sections again and re-enable RSVP?",
                        )
                    : undefined
                }
                resetTitle="Show all sections; re-enable RSVP"
              >
                <Toggle
                  label="Story / Invitation"
                  checked={!data.event.hideStory}
                  onChange={(v) => patchEvent({ hideStory: !v })}
                />
                <Toggle
                  label="Events / Schedule"
                  checked={!data.event.hideEvents}
                  onChange={(v) => patchEvent({ hideEvents: !v })}
                />
                <Toggle
                  label="Gallery"
                  checked={!data.event.hideGallery}
                  onChange={(v) => patchEvent({ hideGallery: !v })}
                />
                <Toggle
                  label="Venue + Map"
                  checked={!data.event.hideVenue}
                  onChange={(v) => patchEvent({ hideVenue: !v })}
                />
                <Toggle
                  label="Countdown timer"
                  checked={!data.event.hideTimer}
                  onChange={(v) => patchEvent({ hideTimer: !v })}
                />
                <Toggle
                  label="RSVP"
                  checked={!!data.event.rsvpEnabled}
                  onChange={(v) => patchEvent({ rsvpEnabled: v })}
                />
              </Section>

              <Section
                title="Event details"
                onReset={
                  resetEndpoint
                    ? () =>
                        handleReset(
                          ["details"],
                          "Reset tagline, accent color, hero image, and start/end times to the template's defaults?\n\nYour event title, names, main date, and city are kept.",
                        )
                    : undefined
                }
                resetTitle="Reset tagline, accent, hero image, times"
              >
                <Field label="Title" value={data.event.eventTitle} onChange={(v) => patchEvent({ eventTitle: v })} />
                <Field label="Tagline / hashtag" value={data.event.tagline ?? ""} onChange={(v) => patchEvent({ tagline: v })} />
                <Row>
                  <Field label="Main date" type="date" value={data.event.mainDate ?? ""} onChange={(v) => patchEvent({ mainDate: v })} />
                  <Field label="City" value={data.event.city ?? ""} onChange={(v) => patchEvent({ city: v })} />
                </Row>
                <Row>
                  <Field label="Start time" type="time" value={data.event.mainStartTime ?? ""} onChange={(v) => patchEvent({ mainStartTime: v })} />
                  <Field label="End time" type="time" value={data.event.mainEndTime ?? ""} onChange={(v) => patchEvent({ mainEndTime: v })} />
                </Row>
                <ColorField
                  label="Accent color"
                  value={data.event.themeAccentColor ?? ""}
                  onChange={(v) => patchEvent({ themeAccentColor: v })}
                  placeholder="#a3792c"
                />
              </Section>

              <Section
                title="Invitation"
                onReset={
                  resetEndpoint
                    ? () =>
                        handleReset(
                          ["story"],
                          "Reset the invitation message and about/story to the template's default copy?",
                        )
                    : undefined
                }
                resetTitle="Reset invitation and story to template default"
              >
                <Textarea
                  label="Invitation message"
                  value={data.event.invitationMessage ?? ""}
                  onChange={(v) => patchEvent({ invitationMessage: v })}
                />
                <Textarea
                  label="About / story"
                  value={data.event.aboutStory ?? ""}
                  onChange={(v) => patchEvent({ aboutStory: v })}
                />
              </Section>

              <Section title="Venue">
                <Field label="Venue name" value={data.event.venueName ?? ""} onChange={(v) => patchEvent({ venueName: v })} />
                <Field label="Address" value={data.event.venueAddress ?? ""} onChange={(v) => patchEvent({ venueAddress: v })} />
                <Field
                  label="Map link (Google Maps URL)"
                  value={data.event.mapLink ?? ""}
                  onChange={(v) => patchEvent({ mapLink: v })}
                  placeholder="https://maps.google.com/?q=…"
                />
                <Row>
                  <Field
                    label="Latitude"
                    value={data.event.latitude != null ? String(data.event.latitude) : ""}
                    onChange={(v) => patchEvent({ latitude: v ? Number(v) : undefined })}
                    placeholder="24.5854"
                  />
                  <Field
                    label="Longitude"
                    value={data.event.longitude != null ? String(data.event.longitude) : ""}
                    onChange={(v) => patchEvent({ longitude: v ? Number(v) : undefined })}
                    placeholder="73.6818"
                  />
                </Row>
                <p className="text-[11px] opacity-60 leading-snug">
                  Paste a Google Maps link and the map usually pins itself. For an
                  exact pin (or a short maps.app.goo.gl link), open the place in
                  Google Maps, right-click it → copy the lat, long numbers here.
                </p>
              </Section>

              <Section title="RSVP & contact">
                <Field label="Contact name (public)" value={data.event.contactName ?? ""} onChange={(v) => patchEvent({ contactName: v })} />
                <div>
                  <span className="block text-xs opacity-70 mb-2">RSVP type</span>
                  <div className="grid grid-cols-4 gap-1">
                    {(
                      [
                        { key: "url", label: "Link" },
                        { key: "email", label: "Email" },
                        { key: "phone", label: "Phone" },
                        { key: "text", label: "Text" },
                      ] as const
                    ).map((opt) => {
                      const active = (data.event.rsvpType ?? "url") === opt.key;
                      return (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => patchEvent({ rsvpType: opt.key })}
                          className={`text-xs px-2 py-1.5 rounded-md border transition ${
                            active
                              ? "bg-neutral-900 text-white border-neutral-900"
                              : "bg-white border-black/15 hover:border-black/40"
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <Field
                  label={
                    data.event.rsvpType === "email"
                      ? "RSVP email"
                      : data.event.rsvpType === "phone"
                        ? "RSVP phone number"
                        : data.event.rsvpType === "text"
                          ? "RSVP instructions (plain text)"
                          : "RSVP link"
                  }
                  value={data.event.rsvpLinkOrContact ?? ""}
                  onChange={(v) => patchEvent({ rsvpLinkOrContact: v })}
                  placeholder={
                    data.event.rsvpType === "email"
                      ? "rsvp@example.com"
                      : data.event.rsvpType === "phone"
                        ? "+91-98xxxxxxx"
                        : data.event.rsvpType === "text"
                          ? "Call Person at +91-..."
                          : "https://forms.example/rsvp"
                  }
                />
              </Section>

              {uploadEndpoint && (
                <Section title="Photos & gallery">
                  <p className="text-xs opacity-70">
                    Add photos or videos to your gallery — pick several at once and
                    give each a description. You can also click any photo on the page
                    to crop, replace, or edit it.
                  </p>
                  <button
                    onClick={() => setAddingPhotos(true)}
                    className="w-full text-sm px-4 py-2.5 rounded-full bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition"
                  >
                    + Add photos
                  </button>
                </Section>
              )}

              {data.media.length > 0 && (
                <Section title={`Manage media (${data.media.length})`}>
                  <p className="text-xs opacity-70">
                    To <strong>add</strong> or <strong>replace</strong> an image or video,
                    hover any photo on the page itself and click — it&apos;s easier than
                    going through this list. Use this section to rename captions, reorder,
                    toggle video autoplay, or delete.
                  </p>

                  <div className="space-y-2">
                    {data.media.map((m, i) => (
                      <MediaEditor
                        key={`${m.fileName}-${i}`}
                        item={m}
                        index={i}
                        total={data.media.length}
                        onChange={(patch) => patchMedia(i, patch)}
                        onDelete={() => deleteMedia(i)}
                        onMove={(dir) => moveMedia(i, dir)}
                      />
                    ))}
                  </div>
                  <p className="text-[11px] opacity-60 mt-2 leading-snug">
                    Caption / reorder / autoplay changes save with the next Save and publish.
                    Delete is also batched. Uploads happen instantly inline.
                  </p>
                </Section>
              )}

              <Section
                title={`Sub-events (${data.subEvents.length})`}
                onReset={
                  resetEndpoint
                    ? () =>
                        handleReset(
                          ["subEvents"],
                          "Replace ALL sub-events with the template's demo schedule?\n\nAny sub-events you've added or edited will be lost.",
                        )
                    : undefined
                }
                resetTitle="Replace with template demo sub-events"
              >
                {data.subEvents.length === 0 && (
                  <p className="text-xs opacity-60">
                    No sub-events. Add one below, or use Reset to bring back the template demo.
                  </p>
                )}
                <div className="space-y-3">
                  {data.subEvents.map((s, i) => (
                    <SubEventEditor
                      key={`${s.eventCode}-${i}`}
                      sub={s}
                      index={i}
                      total={data.subEvents.length}
                      onChange={(patch) => patchSubEvent(i, patch)}
                      onDelete={() => deleteSubEvent(i)}
                      onMove={(dir) => moveSubEvent(i, dir)}
                    />
                  ))}
                </div>
                <button
                  onClick={addSubEvent}
                  className="mt-3 w-full text-sm px-3 py-2 rounded-lg border border-dashed border-black/20 hover:border-black/40 hover:bg-black/[0.02] transition"
                >
                  + Add sub-event
                </button>
              </Section>

              {templateSwitchEndpoint && eventType && (
                <Section title="Switch template">
                  <p className="text-xs opacity-70">
                    Your content stays. Only the look changes.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {TEMPLATES_META.filter((t) => t.eventTypes.includes(eventType)).map(
                      (t) => {
                        const active = t.id === currentTemplateId;
                        return (
                          <button
                            key={t.id}
                            onClick={() => switchTemplate(t.id)}
                            disabled={active}
                            className={`text-left rounded-lg border overflow-hidden transition ${
                              active
                                ? "border-neutral-900 ring-2 ring-neutral-900/10 cursor-default"
                                : "border-black/10 hover:border-black/40"
                            }`}
                          >
                            <div
                              className="aspect-[4/3] bg-cover bg-center"
                              style={{ backgroundImage: `url('${t.previewImage}')` }}
                            />
                            <div className="px-3 py-2">
                              <p className="text-sm font-medium truncate">{t.name}</p>
                              {active && (
                                <p className="text-[10px] uppercase tracking-widest opacity-60 mt-0.5">
                                  Current
                                </p>
                              )}
                            </div>
                          </button>
                        );
                      },
                    )}
                  </div>
                </Section>
              )}

              <p className="text-[11px] opacity-50 pt-4 border-t border-black/5">
                {saveEndpoint
                  ? "Use Save and publish to push changes to your public site."
                  : "Edits are saved to this browser only. Use Reset to restore the original."}
              </p>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {addingPhotos && <AddPhotosModal onClose={() => setAddingPhotos(false)} />}
    </>
  );
}

function SaveStatusPill({ state }: { state: SaveState }) {
  if (state.kind === "idle") return null;
  if (state.kind === "saving") {
    return (
      <span className="text-[11px] opacity-70">Saving…</span>
    );
  }
  if (state.kind === "ok") {
    return (
      <span
        className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded-full ${
          state.published
            ? "bg-green-100 text-green-800"
            : "bg-blue-100 text-blue-800"
        }`}
      >
        {state.published ? "Published" : "Saved"}
      </span>
    );
  }
  return (
    <span className="text-[11px] text-red-600 max-w-[60%] truncate" title={state.message}>
      {state.message}
    </span>
  );
}

function Section({
  title,
  onReset,
  resetTitle,
  children,
}: {
  title: string;
  onReset?: () => void;
  resetTitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[10px] uppercase tracking-[0.3em] opacity-60">{title}</h3>
        {onReset && (
          <button
            onClick={onReset}
            title={resetTitle ?? "Reset this section to template default"}
            className="text-[10px] uppercase tracking-widest opacity-50 hover:opacity-100 underline decoration-dotted"
          >
            ↺ reset
          </button>
        )}
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-3">{children}</div>;
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="block text-xs opacity-70 mb-1 flex items-center justify-between">
        {label}
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-[10px] underline opacity-60 hover:opacity-100"
          >
            clear
          </button>
        )}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm focus:outline-none focus:border-black/40"
      />
    </label>
  );
}

const PRESETS = [
  "#a3792c", // gold (royal)
  "#111111", // mono (minimal)
  "#7c3aed", // purple (modern)
  "#ff5fa2", // pink (vibrant)
  "#e8a0a0", // pastel (pastel)
  "#22d3ee", // cyan (aurora)
  "#6f7d54", // sage (botanical)
  "#ff2e9a", // neon (fiesta)
  "#3aaed8", // sky (storybook)
];

function ColorField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  // The native color input needs a valid 6-char hex. Fall back to black when
  // the user's typed value isn't a valid hex (yet) so the picker still renders.
  const valid = /^#[0-9a-fA-F]{6}$/.test(value);
  const safe = valid ? value : "#000000";

  return (
    <label className="block">
      <span className="block text-xs opacity-70 mb-1 flex items-center justify-between">
        {label}
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-[10px] underline opacity-60 hover:opacity-100"
          >
            clear
          </button>
        )}
      </span>
      <div className="flex items-center gap-2">
        <div className="relative">
          <input
            type="color"
            value={safe}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            aria-label={`${label} color picker`}
          />
          <div
            className="w-10 h-10 rounded-md border border-black/15"
            style={{ background: valid ? value : "transparent" }}
          />
        </div>
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 rounded-md border border-black/15 bg-white px-3 py-2 text-sm font-mono focus:outline-none focus:border-black/40"
          maxLength={7}
        />
      </div>
      <div className="flex flex-wrap gap-1.5 mt-2">
        {PRESETS.map((hex) => (
          <button
            key={hex}
            type="button"
            onClick={() => onChange(hex)}
            title={hex}
            className={`w-5 h-5 rounded-full border transition ${
              value.toLowerCase() === hex
                ? "border-neutral-900 ring-2 ring-neutral-900/20"
                : "border-black/15 hover:border-black/40"
            }`}
            style={{ background: hex }}
            aria-label={`Use ${hex}`}
          />
        ))}
      </div>
    </label>
  );
}

function Textarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="block text-xs opacity-70 mb-1 flex items-center justify-between">
        {label}
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-[10px] underline opacity-60 hover:opacity-100"
          >
            clear
          </button>
        )}
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm leading-snug focus:outline-none focus:border-black/40"
      />
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 cursor-pointer py-1">
      <span className="text-sm">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-6 rounded-full transition-colors ${
          checked ? "bg-neutral-900" : "bg-neutral-300"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-4" : ""
          }`}
        />
      </button>
    </label>
  );
}

const MEDIA_SECTIONS = ["hero", "gallery", "couple", "about", "videos"] as const;

function MediaEditor({
  item,
  index,
  total,
  onChange,
  onDelete,
  onMove,
}: {
  item: MediaItem;
  index: number;
  total: number;
  onChange: (patch: Partial<MediaItem>) => void;
  onDelete: () => void;
  onMove: (direction: -1 | 1) => void;
}) {
  const [open, setOpen] = useState(false);
  const isVideo = item.mediaType === "video";

  return (
    <div className="rounded-lg border border-black/10 overflow-hidden">
      <div className="flex items-center gap-2 px-2 py-2 bg-black/[0.02]">
        <div className="flex flex-col gap-0.5">
          <button
            onClick={() => onMove(-1)}
            disabled={index === 0}
            title="Move up"
            className="w-5 h-4 rounded hover:bg-black/5 disabled:opacity-30 disabled:cursor-not-allowed text-[10px]"
          >
            ▲
          </button>
          <button
            onClick={() => onMove(1)}
            disabled={index === total - 1}
            title="Move down"
            className="w-5 h-4 rounded hover:bg-black/5 disabled:opacity-30 disabled:cursor-not-allowed text-[10px]"
          >
            ▼
          </button>
        </div>
        {isVideo ? (
          <div className="w-12 h-12 rounded bg-black flex items-center justify-center text-white text-lg flex-none">
            ▶
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.publicUrl}
            alt={item.caption ?? item.fileName}
            className="w-12 h-12 rounded object-cover flex-none"
          />
        )}
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex-1 text-left min-w-0"
        >
          <p className="text-sm font-medium truncate">{item.caption || item.fileName}</p>
          <p className="text-[10px] uppercase tracking-widest opacity-60">
            {item.section} · {item.mediaType}
            {isVideo && item.autoplay ? " · autoplay" : ""}
          </p>
        </button>
        <button
          onClick={onDelete}
          className="text-xs text-red-600 hover:text-red-700 hover:underline flex-none"
          title="Remove from this event (file stays on Drive)"
        >
          Delete
        </button>
      </div>
      {open && (
        <div className="p-3 space-y-3">
          <Field
            label="Caption"
            value={item.caption ?? ""}
            onChange={(v) => onChange({ caption: v })}
            placeholder="First look, mandap, etc."
          />
          <label className="block">
            <span className="block text-xs opacity-70 mb-1">Section</span>
            <select
              value={item.section}
              onChange={(e) => onChange({ section: e.target.value })}
              className="w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm focus:outline-none focus:border-black/40"
            >
              {MEDIA_SECTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          {isVideo && (
            <label className="flex items-center justify-between gap-3 cursor-pointer py-1">
              <span className="text-sm">
                Autoplay (silent, looped)
                <span className="block text-[11px] opacity-60">
                  Off = press-to-play with controls.
                </span>
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={!!item.autoplay}
                onClick={() => onChange({ autoplay: !item.autoplay })}
                className={`relative w-10 h-6 rounded-full transition-colors ${
                  item.autoplay ? "bg-neutral-900" : "bg-neutral-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    item.autoplay ? "translate-x-4" : ""
                  }`}
                />
              </button>
            </label>
          )}
          <p className="text-[11px] opacity-60 break-all">
            <span className="opacity-70">URL:</span> {item.publicUrl}
          </p>
        </div>
      )}
    </div>
  );
}

function SubEventEditor({
  sub,
  index,
  total,
  onChange,
  onDelete,
  onMove,
}: {
  sub: SubEvent;
  index: number;
  total: number;
  onChange: (patch: Partial<SubEvent>) => void;
  onDelete: () => void;
  onMove: (direction: -1 | 1) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-lg border border-black/10 overflow-hidden">
      <div className="flex items-center justify-between px-2 py-1.5 bg-black/[0.02] gap-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onMove(-1)}
            disabled={index === 0}
            title="Move up"
            className="w-6 h-6 rounded hover:bg-black/5 disabled:opacity-30 disabled:cursor-not-allowed text-xs"
          >
            ↑
          </button>
          <button
            onClick={() => onMove(1)}
            disabled={index === total - 1}
            title="Move down"
            className="w-6 h-6 rounded hover:bg-black/5 disabled:opacity-30 disabled:cursor-not-allowed text-xs"
          >
            ↓
          </button>
        </div>
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 text-left flex-1 min-w-0"
        >
          <span className="text-base flex-none">{sub.icon || "•"}</span>
          <span className="font-medium truncate">{sub.name || "(unnamed)"}</span>
          <span className="text-[10px] opacity-50 ml-1 flex-none">{open ? "▲" : "▼"}</span>
        </button>
        <button
          onClick={onDelete}
          className="text-xs text-red-600 hover:text-red-700 hover:underline flex-none"
          title="Delete this sub-event"
        >
          Delete
        </button>
      </div>
      {open && (
        <div className="p-3 space-y-3">
          <Field label="Name" value={sub.name} onChange={(v) => onChange({ name: v })} />
          <Row>
            <Field label="Date" type="date" value={sub.date ?? ""} onChange={(v) => onChange({ date: v })} />
            <Field label="Icon" value={sub.icon ?? ""} onChange={(v) => onChange({ icon: v })} />
          </Row>
          <Row>
            <Field label="Start" type="time" value={sub.startTime ?? ""} onChange={(v) => onChange({ startTime: v })} />
            <Field label="End" type="time" value={sub.endTime ?? ""} onChange={(v) => onChange({ endTime: v })} />
          </Row>
          <Field label="Venue name" value={sub.venueName ?? ""} onChange={(v) => onChange({ venueName: v })} />
          <Field label="Venue address" value={sub.venueAddress ?? ""} onChange={(v) => onChange({ venueAddress: v })} />
          <Field
            label="Map link (Google Maps URL)"
            value={sub.mapLink ?? ""}
            onChange={(v) => onChange({ mapLink: v })}
            placeholder="https://maps.google.com/?q=…"
          />
          <Row>
            <Field
              label="Latitude"
              value={sub.latitude != null ? String(sub.latitude) : ""}
              onChange={(v) => onChange({ latitude: v ? Number(v) : undefined })}
              placeholder="24.5854"
            />
            <Field
              label="Longitude"
              value={sub.longitude != null ? String(sub.longitude) : ""}
              onChange={(v) => onChange({ longitude: v ? Number(v) : undefined })}
              placeholder="73.6818"
            />
          </Row>
          <Field label="Dress code" value={sub.dressCode ?? ""} onChange={(v) => onChange({ dressCode: v })} />
          <Textarea label="Description" value={sub.description ?? ""} onChange={(v) => onChange({ description: v })} />
        </div>
      )}
    </div>
  );
}
