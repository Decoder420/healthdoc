import type { SoapNote } from "@/features/doctor/components/SoapNotePanel";
import type { EncounterType } from "@/features/doctor/types";

export function retryDelayMs(attempt: number, baseMs?: number, maxMs?: number): number;
export function draftFingerprint(draft: {
  encounterType: EncounterType;
  chiefComplaint: string;
  soap: SoapNote;
}): string;
