/** Real lab/radiology ordering against the server-owned encounter. */
import { api } from "@/lib/api";
import type {
  CreateLabOrderItemInput,
  CreateOrderInput,
  CreateRadiologyOrderItemInput,
  DraftOrder,
  OrderStatus,
  PlacedOrder,
} from "../types";

interface OrderResponse {
  id: string;
  order_number: string;
  ordered_at: string;
  status: OrderStatus;
  order_type: DraftOrder["order_type"];
  priority: DraftOrder["priority"];
}

interface OrderListResponse {
  items: OrderResponse[];
}

export async function listOrders(encounterId: string): Promise<PlacedOrder[]> {
  const response = await api<OrderListResponse>(
    `/orders?encounter_id=${encodeURIComponent(encounterId)}`,
  );
  return response.items.map((order) => ({
    id: order.id,
    order_number: order.order_number,
    order_type: order.order_type,
    priority: order.priority,
    status: order.status,
    ordered_at: order.ordered_at,
    item_label: `${order.order_type === "lab" ? "Lab" : order.order_type === "radiology" ? "Radiology" : "Clinical"} order`,
    detail_status: "header_only",
  }));
}

export async function createOrder(
  input: CreateOrderInput,
  idempotencyKey: string,
): Promise<OrderResponse> {
  return api<OrderResponse>("/orders", {
    method: "POST",
    body: JSON.stringify(input),
    idempotencyKey,
  });
}

export async function createLabOrderItem(
  input: CreateLabOrderItemInput,
  idempotencyKey: string,
): Promise<{ id: string; accession_number: string }> {
  const { order_id, ...body } = input;
  return api(`/pathology/order-items?order_id=${encodeURIComponent(order_id)}`, {
    method: "POST",
    body: JSON.stringify(body),
    idempotencyKey,
  });
}

export async function createRadiologyOrderItem(
  input: CreateRadiologyOrderItemInput,
  idempotencyKey: string,
): Promise<{ id: string; accession_number: string }> {
  const { order_id, ...body } = input;
  return api(`/radiology/order-items?order_id=${encodeURIComponent(order_id)}`, {
    method: "POST",
    body: JSON.stringify(body),
    idempotencyKey,
  });
}

/**
 * Creates the common header and then its department detail row.
 * A detail failure cannot roll back the committed header, so return the
 * partial state and prevent a blind retry from creating a duplicate order.
 */
export async function placeOrder(
  draft: Omit<DraftOrder, "tempId">,
  context: { encounter_id: string; patient_id: string },
  idempotencyKey: string,
): Promise<PlacedOrder> {
  if (draft.order_type !== "lab" && draft.order_type !== "radiology") {
    throw new Error("Procedure ordering is unavailable until its server contract is implemented.");
  }

  const header = await createOrder(
    {
      encounter_id: context.encounter_id,
      patient_id: context.patient_id,
      order_type: draft.order_type,
      priority: draft.priority,
    },
    idempotencyKey,
  );
  const label =
    draft.order_type === "lab"
      ? draft.test_name?.trim() || "Lab test"
      : draft.scan_type?.trim() || "Radiology study";

  try {
    const detail =
      draft.order_type === "lab"
        ? await createLabOrderItem(
            {
              order_id: header.id,
              test_name: label,
              sample_type: draft.sample_type ?? "",
            },
            `${idempotencyKey}:detail`,
          )
        : await createRadiologyOrderItem(
            {
              order_id: header.id,
              modality: draft.modality ?? "xray",
              scan_type: label,
            },
            `${idempotencyKey}:detail`,
          );

    return {
      id: header.id,
      order_number: header.order_number,
      order_type: draft.order_type,
      priority: draft.priority,
      status: header.status,
      ordered_at: header.ordered_at,
      accession_number: detail.accession_number,
      item_label: label,
      detail_status: "complete",
    };
  } catch (error) {
    return {
      id: header.id,
      order_number: header.order_number,
      order_type: draft.order_type,
      priority: draft.priority,
      status: header.status,
      ordered_at: header.ordered_at,
      item_label: label,
      detail_status: "failed",
      detail_error: error instanceof Error ? error.message : "Department item creation failed",
    };
  }
}
