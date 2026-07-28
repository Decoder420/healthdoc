import { mockLabTests, mockProcedures, mockRadiologyTests, placedOrders } from "@/lib/mock";
import type { CatalogItem, CreateOrderInput, OrderType } from "../types";

function delay<T>(value: T, ms = 220): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), ms));
}

const CATALOG: Record<OrderType, CatalogItem[]> = {
  lab: mockLabTests,
  radiology: mockRadiologyTests,
  procedure: mockProcedures,
};

/** Department catalogue search (lab tests / radiology studies / procedures). */
export async function searchCatalog(type: OrderType, query = ""): Promise<CatalogItem[]> {
  const q = query.trim().toLowerCase();
  const rows = CATALOG[type];
  return delay(q ? rows.filter((r) => r.name.toLowerCase().includes(q)) : rows);
}

/** POST /api/v1/orders — order header (+ department detail row) per order. */
export async function createOrder(input: CreateOrderInput): Promise<{ id: string; order_number: string }> {
  placedOrders.push(input);
  return delay({ id: crypto.randomUUID(), order_number: `ORD-${Date.now().toString().slice(-6)}` });
}
