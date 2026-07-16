import type { QueueItem } from "@/features/dashboard/types";
import type { QueueEntry } from "@/features/opd/types";

export function formatQueueWaitTime(addedAt: string): string {
  const minutes = Math.max(
    0,
    Math.floor((Date.now() - new Date(addedAt).getTime()) / 60_000),
  );
  if (minutes < 1) return "< 1 min";
  return `${minutes} min`;
}

export function queueEntryToDashboardItem(entry: QueueEntry): QueueItem {
  return {
    id: entry.id,
    token: entry.tokenNumber,
    patientName: entry.patientName,
    patientId: entry.uhid,
    doctorName: entry.doctorName,
    waitTime: formatQueueWaitTime(entry.addedAt),
    priority: entry.priority,
  };
}

export function getWaitingQueueEntries(queue: QueueEntry[]): QueueEntry[] {
  return queue.filter((entry) => entry.status === "waiting");
}
