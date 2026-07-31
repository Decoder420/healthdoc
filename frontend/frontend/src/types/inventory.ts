export interface InventoryItem {
  id: number;
  itemName: string;
  category: string;
  brand: string;
  supplier: string;
  quantity: number;
  unit: string;
  minimumStock: number;
  reorderLevel: number;
  batchNumber: string;
  expiryDate: string;
}