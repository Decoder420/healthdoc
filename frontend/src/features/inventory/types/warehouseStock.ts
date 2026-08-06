
export interface WarehouseStock {
  id: string;

  itemId: string;
  itemName: string;
  category: string;
  brand?: string;

  supplierId?: string;
  supplierName?: string;

  batchNumber: string;
  expiryDate?: string;

  quantity: number;
  availableQuantity: number;

  unit: string;

  warehouseId: string;
  warehouseName: string;

  location?: string;

  grnId?: string;
  grnNumber?: string;

  receivedDate: string;
  enteredDate?: string;

  status:
    | "Available"
    | "Low Stock"
    | "Out of Stock"
    | "Near Expiry";
}

