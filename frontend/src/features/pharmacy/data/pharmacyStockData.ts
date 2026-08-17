import type { PharmacyStockItem } from "../types/pharmacyStock";

const STORAGE_KEY = "pharmacy_stock";

export const pharmacyStockData: PharmacyStockItem[] = [
  {
    id: "PSTK-001",
    itemId: "ITEM-001",
    itemName: "Paracetamol 500mg",
    category: "Tablet",
    batchNumber: "PCM500-B01",
    expiryDate: "2027-06-30",
    availableStock: 120,
    reorderLevel: 50,
    minimumStock: 20,
    unit: "Strip",
    supplier: "Medico Healthcare",
    status: "Available",
  },
  {
    id: "PSTK-002",
    itemId: "ITEM-002",
    itemName: "Amoxicillin 500mg",
    category: "Capsule",
    batchNumber: "AMX500-B02",
    expiryDate: "2027-03-31",
    availableStock: 35,
    reorderLevel: 50,
    minimumStock: 20,
    unit: "Strip",
    supplier: "Surgical Care Pvt Ltd",
    status: "Low Stock",
  },
  {
    id: "PSTK-003",
    itemId: "ITEM-003",
    itemName: "Azithromycin 500mg",
    category: "Tablet",
    batchNumber: "AZI500-B01",
    expiryDate: "2027-01-31",
    availableStock: 12,
    reorderLevel: 30,
    minimumStock: 10,
    unit: "Strip",
    supplier: "Medico Healthcare",
    status: "Low Stock",
  },
  {
    id: "PSTK-004",
    itemId: "ITEM-004",
    itemName: "Pantoprazole 40mg",
    category: "Tablet",
    batchNumber: "PAN40-B03",
    expiryDate: "2028-02-29",
    availableStock: 85,
    reorderLevel: 40,
    minimumStock: 15,
    unit: "Strip",
    supplier: "HealthPlus Pharma",
    status: "Available",
  },
  {
    id: "PSTK-005",
    itemId: "ITEM-005",
    itemName: "Cetirizine 10mg",
    category: "Tablet",
    batchNumber: "CET10-B01",
    expiryDate: "2027-09-30",
    availableStock: 8,
    reorderLevel: 25,
    minimumStock: 10,
    unit: "Strip",
    supplier: "Medico Healthcare",
    status: "Critical",
  },
  {
    id: "PSTK-006",
    itemId: "ITEM-006",
    itemName: "Insulin Glargine",
    category: "Injection",
    batchNumber: "INS-B04",
    expiryDate: "2026-12-31",
    availableStock: 18,
    reorderLevel: 20,
    minimumStock: 8,
    unit: "Vial",
    supplier: "Surgical Care Pvt Ltd",
    status: "Low Stock",
  },
];

export function getPharmacyStock(): PharmacyStockItem[] {
  if (typeof window === "undefined") {
    return pharmacyStockData;
  }

  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(pharmacyStockData)
    );

    return pharmacyStockData;
  }

  try {
    return JSON.parse(stored) as PharmacyStockItem[];
  } catch {
    return pharmacyStockData;
  }
}

export function savePharmacyStock(
  stock: PharmacyStockItem[]
): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(stock)
  );

  window.dispatchEvent(
    new Event("pharmacy-stock-updated")
  );
}

export function updatePharmacyStock(
  itemId: string,
  quantityChange: number
): PharmacyStockItem | null {
  const stock = getPharmacyStock();

  const index = stock.findIndex(
    (item) => item.itemId === itemId
  );

  if (index === -1) {
    return null;
  }

  const item = stock[index];

  const newQuantity = Math.max(
    0,
    item.availableStock + quantityChange
  );

  let status: PharmacyStockItem["status"];

  if (newQuantity <= item.minimumStock) {
    status = "Critical";
  } else if (newQuantity <= item.reorderLevel) {
    status = "Low Stock";
  } else {
    status = "Available";
  }

  const updatedItem: PharmacyStockItem = {
    ...item,
    availableStock: newQuantity,
    status,
  };

  const updatedStock = [...stock];

  updatedStock[index] = updatedItem;

  savePharmacyStock(updatedStock);

  return updatedItem;
}

export function reducePharmacyStock(
  itemId: string,
  quantity: number
): PharmacyStockItem | null {
  if (quantity <= 0) {
    return null;
  }

  return updatePharmacyStock(
    itemId,
    -quantity
  );
}

export function increasePharmacyStock(
  itemId: string,
  quantity: number
): PharmacyStockItem | null {
  if (quantity <= 0) {
    return null;
  }

  return updatePharmacyStock(
    itemId,
    quantity
  );
}