import { api } from "@/lib/api";

import type { LabOrderItem, LabOrderItemList, LabResult, LabResultHistory } from "./types";

export function listLabWork(): Promise<LabOrderItemList> {
  return api<LabOrderItemList>("/pathology/order-items?page=1&page_size=100");
}

export function collectLabSample(itemId: string, barcode: string): Promise<LabOrderItem> {
  return api<LabOrderItem>(`/pathology/order-items/${itemId}/sample-collection`, {
    method: "PUT",
    body: JSON.stringify({ barcode }),
  });
}

export function enterLabResult(
  itemId: string,
  resultData: Record<string, unknown>,
  remarks: string,
): Promise<LabResult> {
  return api<LabResult>(`/pathology/order-items/${itemId}/results`, {
    method: "POST",
    idempotencyKey: null,
    body: JSON.stringify({ result_data: resultData, remarks: remarks.trim() || null }),
  });
}

export function verifyLabResult(itemId: string): Promise<LabResult> {
  return api<LabResult>(`/pathology/order-items/${itemId}/results/verify`, {
    method: "PUT",
    body: JSON.stringify({}),
  });
}

export function getLabResultHistory(itemId: string): Promise<LabResultHistory> {
  return api<LabResultHistory>(`/pathology/order-items/${itemId}/results/history`);
}
