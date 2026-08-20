/**
 * Ordering is two calls, matching the backend.
 *
 *   1. POST /orders                 → the header (orders). No detail fields.
 *   2. POST /pathology/order-items  → lab detail + accession number
 *      POST /radiology/order-items  → radiology detail + accession number
 *      POST /procedures             → procedure_records
 *
 * There is no catalog table, so nothing here resolves a catalog id: the picker
 * offers name suggestions and the chosen text is written to the detail row.
 */
import {
  labTestNames,
  placedOrderItems,
  placedOrders,
  procedureNames,
  radiologyScanTypes,
} from "@/lib/mock";
import { MOCK_PROVIDER_USER_ID } from "../constants";
import type {
  CreateLabOrderItemInput,
  CreateOrderInput,
  CreateProcedureInput,
  CreateRadiologyOrderItemInput,
  DraftOrder,
  OrderType,
  PlacedOrder,
} from "../types";

function delay<T>(value: T, ms = 220): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), ms));
}

const SUGGESTIONS: Record<OrderType, string[]> = {
  lab: labTestNames,
  radiology: radiologyScanTypes,
  procedure: procedureNames,
  /** Not placed from the OPD doctor panel — schema OrderType includes these. */
  pharmacy: [],
  blood: [],
};

/** Name suggestions only — free text is allowed, because the column is free text. */
export async function suggestOrderNames(type: OrderType, query = ""): Promise<string[]> {
  const q = query.trim().toLowerCase();
  const rows = SUGGESTIONS[type];
  return delay(q ? rows.filter((r) => r.toLowerCase().includes(q)) : rows);
}

const pad = (n: number, w: number) => String(n).padStart(w, "0");
const stamp = () => new Date().toISOString().slice(0, 10).replace(/-/g, "");

/** POST /api/v1/orders — header only. */
export async function createOrder(input: CreateOrderInput): Promise<{
  id: string;
  order_number: string;
  ordered_at: string;
}> {
  placedOrders.push(input);
  return delay({
    id: crypto.randomUUID(),
    order_number: `ORD-${stamp()}-${pad(placedOrders.length, 6)}`,
    ordered_at: new Date().toISOString(),
  });
}

/** POST /api/v1/pathology/order-items — the lab generates the accession number. */
export async function createLabOrderItem(
  input: CreateLabOrderItemInput,
): Promise<{ id: string; accession_number: string }> {
  placedOrderItems.push(input);
  return delay({
    id: crypto.randomUUID(),
    accession_number: `LAB-${stamp()}-${pad(placedOrders.length, 5)}`,
  });
}

/** POST /api/v1/radiology/order-items — radiology generates the accession number. */
export async function createRadiologyOrderItem(
  input: CreateRadiologyOrderItemInput,
): Promise<{ id: string; accession_number: string }> {
  placedOrderItems.push(input);
  return delay({
    id: crypto.randomUUID(),
    accession_number: `RAD-${stamp()}-${pad(placedOrders.length, 5)}`,
  });
}

/** POST /api/v1/procedures — procedure_records carry no accession number. */
export async function createProcedure(
  input: CreateProcedureInput,
): Promise<{ id: string }> {
  placedOrderItems.push(input);
  return delay({ id: crypto.randomUUID() });
}

/**
 * Places one order end to end: header first, then the department detail row.
 * Kept here so callers do not have to know the two-step shape.
 */
export async function placeOrder(
  draft: Omit<DraftOrder, "tempId">,
  context: { encounter_id: string; patient_id: string },
): Promise<PlacedOrder> {
  const header = await createOrder({
    encounter_id: context.encounter_id,
    patient_id: context.patient_id,
    created_by: MOCK_PROVIDER_USER_ID,
    order_type: draft.order_type,
    priority: draft.priority,
  });

  let accession: string | undefined;
  let label: string;

  if (draft.order_type === "lab") {
    label = draft.test_name ?? "Lab test";
    ({ accession_number: accession } = await createLabOrderItem({
      order_id: header.id,
      test_name: label,
      sample_type: draft.sample_type ?? "",
    }));
  } else if (draft.order_type === "radiology") {
    label = draft.scan_type ?? "Study";
    ({ accession_number: accession } = await createRadiologyOrderItem({
      order_id: header.id,
      modality: draft.modality ?? "xray",
      scan_type: label,
    }));
  } else {
    label = draft.procedure_name ?? "Procedure";
    await createProcedure({
      order_id: header.id,
      procedure_name: label,
      setting: draft.setting ?? "opd_minor",
    });
  }

  return {
    id: header.id,
    order_number: header.order_number,
    order_type: draft.order_type,
    priority: draft.priority,
    status: "placed",
    ordered_at: header.ordered_at,
    accession_number: accession,
    item_label: label,
  };
}
