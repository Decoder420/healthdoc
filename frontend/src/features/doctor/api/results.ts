import {
  mockAcknowledgements,
  mockLabResults,
  mockRadiologyReports,
  mockResultsWorklist,
  savedAcknowledgements,
} from "@/lib/mock";
import type {
  LabResult,
  RadiologyReport,
  ResultAcknowledgement,
  ResultWorklistItem,
} from "../types";

function delay<T>(value: T, ms = 220): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), ms));
}

/** Critical first, then STAT/urgent, then most recently reported. */
const PRIORITY_RANK = { stat: 0, urgent: 1, routine: 2 } as const;

function sortWorklist(rows: ResultWorklistItem[]): ResultWorklistItem[] {
  return [...rows].sort((a, b) => {
    if (a.has_critical !== b.has_critical) return a.has_critical ? -1 : 1;
    const byPriority = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
    if (byPriority !== 0) return byPriority;
    return (b.reported_at ?? "").localeCompare(a.reported_at ?? "");
  });
}

/**
 * The doctor's results worklist — order items for this provider joined with
 * their current result/report.
 *
 * No single endpoint exists for this yet: §4.4 documents
 * GET /lab/order-items/{id}/results and /radiology/order-items/{id}/reports
 * per item, but nothing that lists a doctor's outstanding results. Raised with
 * B5 — this call stands in for it.
 */
export async function listResultsWorklist(): Promise<ResultWorklistItem[]> {
  return delay(sortWorklist(mockResultsWorklist));
}

/** GET /api/v1/lab/order-items/{id}/results — all versions, newest first. */
export async function getLabResults(labOrderItemId: string): Promise<LabResult[]> {
  const rows = mockLabResults
    .filter((r) => r.lab_order_item_id === labOrderItemId)
    .sort((a, b) => b.version - a.version);
  return delay(rows);
}

/** GET /api/v1/radiology/order-items/{id}/reports — all versions, newest first. */
export async function getRadiologyReports(
  radiologyOrderItemId: string,
): Promise<RadiologyReport[]> {
  const rows = mockRadiologyReports
    .filter((r) => r.radiology_order_item_id === radiologyOrderItemId)
    .sort((a, b) => b.version - a.version);
  return delay(rows);
}

/** Acknowledgements for one result/report (current version). */
export async function getAcknowledgements(
  ref: { lab_result_id?: string; radiology_report_id?: string },
): Promise<ResultAcknowledgement[]> {
  const all = [...mockAcknowledgements, ...savedAcknowledgements];
  const rows = all.filter(
    (a) =>
      (ref.lab_result_id && a.lab_result_id === ref.lab_result_id) ||
      (ref.radiology_report_id && a.radiology_report_id === ref.radiology_report_id),
  );
  return delay(rows);
}

/**
 * Doctor sign-off. NOT YET IMPLEMENTABLE against the backend — schema v3.13 has
 * no table and no endpoint for this (see types.ts ResultAcknowledgement).
 *
 * Kept as a single function so wiring the real call is a one-place change:
 *   POST /api/v1/lab/results/{id}/acknowledge   { note }
 *   POST /api/v1/radiology/reports/{id}/acknowledge { note }
 */
export async function acknowledgeResult(input: {
  lab_result_id?: string;
  radiology_report_id?: string;
  reviewed_by: string;
  reviewed_by_name?: string;
  note?: string;
}): Promise<ResultAcknowledgement> {
  const ack: ResultAcknowledgement = {
    id: crypto.randomUUID(),
    lab_result_id: input.lab_result_id,
    radiology_report_id: input.radiology_report_id,
    reviewed_by: input.reviewed_by,
    reviewed_by_name: input.reviewed_by_name,
    reviewed_at: new Date().toISOString(),
    note: input.note?.trim() || undefined,
  };
  savedAcknowledgements.push(ack);

  const row = mockResultsWorklist.find(
    (w) =>
      mockLabResults.some(
        (r) => r.id === input.lab_result_id && r.lab_order_item_id === w.id,
      ) ||
      mockRadiologyReports.some(
        (r) => r.id === input.radiology_report_id && r.radiology_order_item_id === w.id,
      ),
  );
  if (row) row.acknowledged_at = ack.reviewed_at;

  return delay(ack);
}
