export interface InventoryReportRow {
  date: string;
  itemId: string;
  itemName: string;
  category: string;
  brand: string;
  supplier: string;
  warehouse: string;
  batchNumber: string;
  expiryDate: string;
  unit: string;

  openingStock: number;
  receivedQty: number;
  issuedQty: number;
  availableStock: number;
  reorderLevel: number;

  status:
    | "Available"
    | "Low Stock"
    | "Out of Stock"
    | "Near Expiry";

  unitPrice: number;
  stockValue: number;
}