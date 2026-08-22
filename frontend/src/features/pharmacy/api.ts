import { api } from "@/lib/api";

import type {
  ExpiryTrackerResponse,
  MedicineSearchResponse,
  PrescriptionQueueResponse,
} from "./types";

export function listPrescriptionQueue(params: {
  status?: string;
  page?: number;
  page_size?: number;
} = {}): Promise<PrescriptionQueueResponse> {
  const query = new URLSearchParams({
    page: String(params.page ?? 1),
    page_size: String(params.page_size ?? 20),
    ...(params.status ? { status: params.status } : {}),
  });
  return api<PrescriptionQueueResponse>(`/pharmacy/queue?${query}`);
}

export function searchMedicines(term: string): Promise<MedicineSearchResponse> {
  return api<MedicineSearchResponse>(
    `/pharmacy/medicines/search?q=${encodeURIComponent(term)}`,
  );
}

export function expiryTracker(thresholdDays = 90): Promise<ExpiryTrackerResponse> {
  // 90 by default so the screen can bucket 30/60/90 from one request rather
  // than three — the server filters, the client groups.
  return api<ExpiryTrackerResponse>(
    `/pharmacy/expiry-tracker?threshold_days=${thresholdDays}`,
  );
}
