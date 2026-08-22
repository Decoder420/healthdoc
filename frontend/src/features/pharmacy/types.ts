/**
 * Mirrors backend/app/pharmacy/schemas.py. Wire names, no mapping layer.
 *
 * Decimal fields arrive as strings over JSON. They are typed `string` here and
 * must stay that way — `parseFloat` on a quantity or an MRP loses paise, and a
 * dispense is a billable, auditable event.
 */

/** GET /pharmacy/queue */
export interface PrescriptionQueueItem {
  prescription_id: string;
  patient_id: string;
  patient_full_name: string;
  uhid: string | null;
  thid: string | null;
  visit_id: string | null;
  encounter_id: string;
  prescribed_at: string;
  item_count: number;
  /** null means nothing has been dispensed against this prescription yet. */
  dispense_status: string | null;
}

export interface PrescriptionQueueResponse {
  items: PrescriptionQueueItem[];
  page: number;
  page_size: number;
  total: number;
}

/** GET /pharmacy/medicines/search */
export interface BatchAvailability {
  batch_id: string;
  batch_number: string;
  expiry_date: string;
  quantity: string;
  stock_location_id: string;
  issue_rate_mrp: string | null;
}

export interface MedicineSearchResult {
  item_id: string;
  name: string;
  generic_name: string | null;
  strength: string | null;
  form: string | null;
  is_controlled_drug: boolean;
  total_available_quantity: string;
  /**
   * FEFO order — earliest expiry first — decided by the server, and the reason
   * the first batch is the one to pick. Do not re-sort this list in the UI: a
   * different order on screen from the order the server considers correct is
   * how expired stock gets dispensed.
   */
  batches: BatchAvailability[];
}

export interface MedicineSearchResponse {
  items: MedicineSearchResult[];
}

/** GET /pharmacy/expiry-tracker?threshold_days=30 */
export interface ExpiringBatch {
  batch_id: string;
  item_id: string;
  item_name: string;
  batch_number: string;
  expiry_date: string;
  days_to_expiry: number;
  quantity: string;
  stock_location_id: string;
  stock_location_name: string;
}

export interface ExpiryTrackerResponse {
  items: ExpiringBatch[];
  threshold_days: number;
}

/**
 * The 30/60/90 buckets #212 asks for.
 *
 * Already-expired stock is split out rather than folded into "30 days": a batch
 * that expired yesterday is not a warning, it is stock that must not leave the
 * counter, and putting it in the same bucket as one expiring next month hides
 * exactly the row a pharmacist has to act on first.
 */
export type ExpiryBucket = "expired" | "30" | "60" | "90";

export function bucketFor(daysToExpiry: number): ExpiryBucket {
  if (daysToExpiry < 0) return "expired";
  if (daysToExpiry <= 30) return "30";
  if (daysToExpiry <= 60) return "60";
  return "90";
}

export const BUCKET_LABELS: Record<ExpiryBucket, string> = {
  expired: "Expired — do not dispense",
  "30": "Within 30 days",
  "60": "31–60 days",
  "90": "61–90 days",
};
