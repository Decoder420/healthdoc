/**
 * Maintenance logs. Gated admin / lab_tech / radiology_tech — the people who
 * operate the machines record their service, not a central administrator.
 */
import { api, newIdempotencyKey } from "@/lib/api";

import type { CreateMaintenanceLogInput, MaintenanceLog } from "./types";

export async function listMaintenanceLogs(machineId?: string): Promise<MaintenanceLog[]> {
  const params = new URLSearchParams({ page: "1", page_size: "50" });
  if (machineId) params.set("machine_id", machineId);
  const response = await api<{ items: MaintenanceLog[] }>(
    `/maintenance/logs?${params.toString()}`,
  );
  return response.items;
}

export function createMaintenanceLog(
  input: CreateMaintenanceLogInput,
): Promise<MaintenanceLog> {
  return api<MaintenanceLog>("/maintenance/logs", {
    method: "POST",
    body: JSON.stringify(input),
    idempotencyKey: newIdempotencyKey(),
  });
}
