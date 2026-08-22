import { api, ApiError } from "@/lib/api";
import type { QueueToken } from "../types";

/** Facility-scoped worklist; doctors are additionally restricted to their own queues. */
export async function listQueue(): Promise<QueueToken[]> {
  const response = await api<{ items: QueueToken[] }>("/queue/worklist");
  return response.items;
}

/** Resolve a queue token by id for consultation deep-links. */
export async function getQueueToken(tokenId: string): Promise<QueueToken | null> {
  try {
    return await api<QueueToken>(`/queue/worklist/${tokenId}`);
  } catch (error) {
    if (error instanceof ApiError && error.code === 404) return null;
    throw error;
  }
}
