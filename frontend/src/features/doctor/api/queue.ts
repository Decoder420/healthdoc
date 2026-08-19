import { mockDoctorQueue } from "@/lib/mock";
import { QUEUE_PRIORITY_RANK } from "../constants";
import type { QueueToken } from "../types";

function delay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), ms));
}

/**
 * Schema sort: priority tier high→low, then longest wait first
 * (queue_tokens.created_at ascending).
 */
function sortQueue(rows: QueueToken[]): QueueToken[] {
  return [...rows].sort((a, b) => {
    const byPriority = QUEUE_PRIORITY_RANK[a.priority] - QUEUE_PRIORITY_RANK[b.priority];
    if (byPriority !== 0) return byPriority;
    return Date.parse(a.created_at) - Date.parse(b.created_at);
  });
}

/** GET /api/v1/queue/queues/{id}/tokens — one doctor's worklist. */
export async function listQueue(): Promise<QueueToken[]> {
  return delay(sortQueue(mockDoctorQueue));
}

/** Resolve a queue token by id for consultation deep-links. */
export async function getQueueToken(tokenId: string): Promise<QueueToken | null> {
  const row = mockDoctorQueue.find((t) => t.id === tokenId) ?? null;
  return delay(row ? structuredClone(row) : null);
}

/**
 * POST /api/v1/queue/tokens/{id}/call-next — sets status to `called` and stamps
 * called_at. The mock only flips those two fields; the real endpoint also moves
 * queues.now_serving_token_id and publishes to the department display feed.
 */
export async function callNextToken(tokenId: string): Promise<QueueToken | null> {
  const row = mockDoctorQueue.find((t) => t.id === tokenId);
  if (!row) return delay(null);
  row.status = "called";
  row.called_at = new Date().toISOString();
  return delay(structuredClone(row));
}
