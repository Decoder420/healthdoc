import type { ExpiryStockItem } from "../types/expiryTracker";

const STORAGE_KEY = "hospital_expiry_tracker";

function getDateFromToday(days: number): string {
  const date = new Date();

  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + days);

  return date.toISOString().split("T")[0];
}

export const expiryTrackerData: ExpiryStockItem[] = [
  {
    item_id: "ITEM-001",
    item_name: "Paracetamol 500mg",
    batch_id: "BATCH-001",
    expiry_date: getDateFromToday(14),
    available_quantity: 425,
  },

  {
    item_id: "ITEM-002",
    item_name: "Amoxicillin 500mg",
    batch_id: "BATCH-002",
    expiry_date: getDateFromToday(42),
    available_quantity: 180,
  },

  {
    item_id: "ITEM-003",
    item_name: "Insulin",
    batch_id: "BATCH-003",
    expiry_date: getDateFromToday(75),
    available_quantity: 50,
  },

  {
    item_id: "ITEM-004",
    item_name: "Cefixime 200mg",
    batch_id: "BATCH-004",
    expiry_date: getDateFromToday(-10),
    available_quantity: 80,
  },

  {
    item_id: "ITEM-005",
    item_name: "Normal Saline",
    batch_id: "BATCH-005",
    expiry_date: getDateFromToday(180),
    available_quantity: 300,
  },
];

export function getExpiryTracker(): ExpiryStockItem[] {
  if (typeof window === "undefined") {
    return expiryTrackerData;
  }

  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(expiryTrackerData)
    );

    return expiryTrackerData;
  }

  try {
    return JSON.parse(stored) as ExpiryStockItem[];
  } catch {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(expiryTrackerData)
    );

    return expiryTrackerData;
  }
}

export function clearExpiryTrackerData() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
}