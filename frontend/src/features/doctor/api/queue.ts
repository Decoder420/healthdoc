import { mockDoctorQueue } from "@/lib/mock";
import type { QueuePatient } from "../types";

function delay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), ms));
}

/**
 * GET /api/v1/queue/queues/{id}/tokens — one doctor's worklist.
 * Live updates will arrive over wss://.../ws/queue/{department_id} later.
 */
export async function listQueue(): Promise<QueuePatient[]> {
  return delay(mockDoctorQueue);
}
