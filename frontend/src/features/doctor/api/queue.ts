import { mockDoctorQueue } from "@/lib/mock";
import { QUEUE_PRIORITY_RANK } from "../constants";
import type { QueuePatient } from "../types";

function delay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), ms));
}

/**
 * Schema sort: priority tier high→low, then longer wait first
 * (proxy for created_at ascending until the API returns timestamps).
 */
function sortQueue(rows: QueuePatient[]): QueuePatient[] {
  return [...rows].sort((a, b) => {
    const byPriority = QUEUE_PRIORITY_RANK[a.priority] - QUEUE_PRIORITY_RANK[b.priority];
    if (byPriority !== 0) return byPriority;
    return b.wait_minutes - a.wait_minutes;
  });
}

/**
 * GET /api/v1/queue/queues/{id}/tokens — one doctor's worklist.
 * Live updates will arrive over wss://.../ws/queue/{department_id} later.
 */
export async function listQueue(): Promise<QueuePatient[]> {
  return delay(sortQueue(mockDoctorQueue));
}

/** Resolve a queue token by id for consultation deep-links. */
export async function getQueueToken(tokenId: string): Promise<QueuePatient | null> {
  const row = mockDoctorQueue.find((p) => p.id === tokenId) ?? null;
  return delay(row ? structuredClone(row) : null);
}
