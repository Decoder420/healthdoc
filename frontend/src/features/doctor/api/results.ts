/**
 * Results review and doctor sign-off.
 *
 * Sign-off is a doctor_reviews row (backend app/encounters) — NOT a column on
 * lab_results/radiology_reports, which are append-only and versioned: writing a
 * review onto them would spawn a false result version.
 */
import { api } from "@/lib/api";
import type {
  CreateDoctorReviewInput,
  DoctorReview,
  LabResult,
  RadiologyReport,
  ResultWorklistItem,
  UpdateDoctorReviewInput,
} from "../types";

/**
 * GET /orders/results-worklist — lab and radiology, ranked together.
 *
 * The fixture claimed this was "backed by GET /pathology/order-items and
 * GET /radiology/order-items, joined with each item's current result". No
 * endpoint performed that join, and the browser could not do it without
 * fetching every order item in the facility. It is now one server-side query.
 *
 * Ordering is the server's — STAT before urgent before routine, then most
 * recently reported, unreported last. Not re-sorted here: the two halves have
 * to rank against each other, which is precisely what a client merge of two
 * paged lists cannot do.
 *
 * Scope is the caller's own orders (admins see the facility), derived from the
 * token — there is no "all doctors" parameter to pass.
 */
export async function listResultsWorklist(): Promise<ResultWorklistItem[]> {
  const response = await api<{ items: ResultWorklistItem[] }>("/orders/results-worklist");
  return response.items;
}

/**
 * GET /pathology/order-items/{id}/results/history — all versions, newest first.
 *
 * The path is `/results/history`, not `/results`: POST `/results` files a
 * result and PUT `/results/amend` supersedes one, so the read lives on its own
 * segment. The fixture's comment named the wrong route.
 *
 * Ordering comes from the server. Not re-sorted here — an amendment chain that
 * the browser reorders is a different clinical story than the one the lab filed.
 */
export async function getLabResults(labOrderItemId: string): Promise<LabResult[]> {
  const response = await api<{ items: LabResult[] }>(
    `/pathology/order-items/${labOrderItemId}/results/history`,
  );
  return response.items;
}

/**
 * GET /radiology/order-items/{id}/reports — all versions, newest first.
 *
 * This endpoint did not exist until it was added alongside this change. A
 * radiologist could draft and sign a report; nothing could read one back except
 * the FHIR bundle, which returns only the current version. Pathology had
 * carried the equivalent since #218.
 *
 * Returns an empty array for a scan that has no report yet — "ordered but not
 * reported" is a real state, and distinct from "no such scan" (404).
 */
export async function getRadiologyReports(
  radiologyOrderItemId: string,
): Promise<RadiologyReport[]> {
  const response = await api<{ items: RadiologyReport[] }>(
    `/radiology/order-items/${radiologyOrderItemId}/reports`,
  );
  return response.items;
}

/**
 * GET /encounters/{encounter_id}/reviews, narrowed to one order item.
 *
 * The endpoint returns every review on the encounter — an encounter can carry
 * several, one per result being signed off — so the item filter happens here.
 * encounterId is now a real parameter: it comes from the worklist row, which
 * carries encounter_id. The fixture had no such field, so it filed every
 * review against one hardcoded encounter.
 */
export async function getReviewsForItem(
  encounterId: string,
  itemId: string,
  orderType: "lab" | "radiology",
): Promise<DoctorReview[]> {
  const reviews = await api<DoctorReview[]>(`/encounters/${encounterId}/reviews`);
  const key = orderType === "lab" ? "lab_order_item_id" : "radiology_order_item_id";
  return reviews.filter((r) => r[key] === itemId);
}


/**
 * POST /encounters/{encounter_id}/reviews — opens the review at `pending`.
 *
 * reviewed_by and created_by are set from the token server-side; the fixture
 * used to stamp MOCK_PROVIDER_USER_ID, which would have attributed every
 * sign-off to the same person.
 */
export async function createDoctorReview(
  encounterId: string,
  input: CreateDoctorReviewInput,
): Promise<DoctorReview> {
  return api<DoctorReview>(`/encounters/${encounterId}/reviews`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}


/**
 * PATCH /encounters/reviews/{review_id} — pending -> reviewed -> signed_off.
 *
 * One step at a time; the server returns 409 on a backward or skipped
 * transition, including re-signing an already signed_off review. That check is
 * deliberately not duplicated here — a sign-off is a clinical act and the
 * server owns whether it is allowed.
 */
export async function updateDoctorReview(
  reviewId: string,
  input: UpdateDoctorReviewInput,
): Promise<DoctorReview> {
  return api<DoctorReview>(`/encounters/reviews/${reviewId}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}


// syncWorklist() and REVIEW_ENCOUNTER_ID are gone. The worklist row's
// review_status now comes from the server's join on doctor_reviews, so there is
// nothing local to keep in step, and the encounter a review is filed against
// comes from the row itself rather than a fixed mock id.
