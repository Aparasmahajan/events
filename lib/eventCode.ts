import { getEventTypeConfig } from "@/config/eventTypes";
import type { EventType } from "@/lib/types";

const SAFE = /^[A-Z0-9-]+$/;

export function generateEventCode(
  eventType: EventType,
  sequence: number,
  year: number = new Date().getFullYear(),
): string {
  const prefix = getEventTypeConfig(eventType).codePrefix;
  const seq = String(sequence).padStart(4, "0");
  const code = `${prefix}-${year}-${seq}`;
  if (!SAFE.test(code)) {
    throw new Error(`Generated unsafe event code: ${code}`);
  }
  return code;
}

export function isValidEventCode(code: string): boolean {
  return SAFE.test(code);
}
