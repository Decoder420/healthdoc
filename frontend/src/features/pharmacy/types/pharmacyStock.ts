export type PharmacyStockStatus =
  | "Available"
  | "Low Stock"
  | "Critical";

export interface PharmacyStockItem {
  id: string;

  itemId: string;

  itemName: string;

  category: string;

  batchNumber: string;

  expiryDate: string;

  availableStock: number;

  reorderLevel: number;

  minimumStock: number;

  unit: string;

  supplier: string;

  status: PharmacyStockStatus;
}