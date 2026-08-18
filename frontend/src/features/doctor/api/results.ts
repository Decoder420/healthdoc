/**
 * Results review and doctor sign-off.
 *
 * Sign-off is a doctor_reviews row (backend app/encounters) — NOT a column on
 * lab_results/radiology_reports, which are append-only and versioned: writing a
 * review onto them would spawn a false result version.
 */
import {
  MOCK_ENCOUNTER_ID_FOR_REVIEWS,
  mockDoctorReviews,
  mockLabResults,
  mockRadiologyReports,
  mockResultsWorklist,
  savedDoctorReviews,
} from "@/lib/mock";
import { MOCK_PROVIDER_NAME, MOCK_PROVIDER_USER_ID } from "../constants";
import type {
  CreateDoctorReviewInput,
  DoctorReview,
  LabResult,
  RadiologyReport,
  ResultWorklistItem,
  UpdateDoctorReviewInput,
} from "../types";

function delay<T>(value: T, ms = 220): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), ms));
}

/** STAT/urgent first, then most recently reported. */
const PRIORITY_RANK = { stat: 0, urgent: 1, routine: 2 } as const;

function sortWorklist(rows: ResultWorklistItem[]): ResultWorklistItem[] {
  return [...rows].sort((a, b) => {
    const byPriority = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
    if (byPriority !== 0) return byPriority;
    return (b.reported_at ?? "").localeCompare(a.reported_at ?? "");
  });
}

/**
 * The doctor's outstanding results. Backed by GET /pathology/order-items and
 * GET /radiology/order-items, joined with each item's current result.
 */
export async function listResultsWorklist(): Promise<ResultWorklistItem[]> {
  return delay(sortWorklist(mockResultsWorklist));
}

/** GET /api/v1/pathology/order-items/{id}/results — all versions, newest first. */
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

function allReviews(): DoctorReview[] {
  return [...mockDoctorReviews, ...savedDoctorReviews];
}

/** GET /api/v1/encounters/{encounter_id}/reviews, filtered to one order item. */
export async function getReviewsForItem(
  itemId: string,
  orderType: "lab" | "radiology",
): Promise<DoctorReview[]> {
  const key = orderType === "lab" ? "lab_order_item_id" : "radiology_order_item_id";
  return delay(allReviews().filter((r) => r[key] === itemId));
}

/**
 * POST /api/v1/encounters/{encounter_id}/reviews — opens the review at
 * `pending`. The server sets reviewed_by from the JWT.
 */
export async function createDoctorReview(
  encounterId: string,
  input: CreateDoctorReviewInput,
): Promise<DoctorReview> {
  const now = new Date().toISOString();
  const review: DoctorReview = {
    id: crypto.randomUUID(),
    encounter_id: encounterId,
    reviewed_by: MOCK_PROVIDER_USER_ID,
    reviewed_by_name: MOCK_PROVIDER_NAME,
    lab_order_item_id: input.lab_order_item_id,
    radiology_order_item_id: input.radiology_order_item_id,
    status: "pending",
    notes: input.notes?.trim() || undefined,
    created_at: now,
    updated_at: now,
  };
  savedDoctorReviews.push(review);
  syncWorklist(review);
  return delay(review);
}

/** PATCH /api/v1/encounters/reviews/{review_id} — pending → reviewed → signed_off. */
export async function updateDoctorReview(
  reviewId: string,
  input: UpdateDoctorReviewInput,
): Promise<DoctorReview | null> {
  const review = allReviews().find((r) => r.id === reviewId);
  if (!review) return delay(null);
  review.status = input.status;
  review.updated_at = new Date().toISOString();
  if (input.notes !== undefined) review.notes = input.notes.trim() || undefined;
  if (input.status === "signed_off") review.signed_off_at = review.updated_at;
  syncWorklist(review);
  return delay(review);
}

/** Keep the worklist row's review_status in step with its review. */
function syncWorklist(review: DoctorReview) {
  const itemId = review.lab_order_item_id ?? review.radiology_order_item_id;
  const row = mockResultsWorklist.find((w) => w.id === itemId);
  if (row) row.review_status = review.status;
}

/**
 * The encounter a review is filed against. Reviews belong to an encounter, so
 * the real screen opens from a consultation; standing alone, we file against a
 * fixed mock encounter.
 */
export const REVIEW_ENCOUNTER_ID = MOCK_ENCOUNTER_ID_FOR_REVIEWS;
