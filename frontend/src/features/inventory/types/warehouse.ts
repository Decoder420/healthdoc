export type WarehouseReceiptStatus =
  | "Pending"
  | "Partially Received"
  | "Received"
  | "Stock Entered";

export interface WarehouseReceiptItem {
  id: string;

  itemId: string;
  itemName: string;

  orderedQuantity: number;
  receivedQuantity: number;
  acceptedQuantity: number;
  rejectedQuantity: number;

  batchNumber?: string;
  expiryDate?: string;

  unit?: string;
}

export interface WarehouseReceipt {
  id: string;

  grnId: string;
  grnNumber: string;

  purchaseOrderId: string;
  purchaseOrderNumber: string;

  supplierId?: string;
  supplierName: string;

  warehouseId: string;
  warehouseName: string;

  receivedDate: string;

  status: WarehouseReceiptStatus;

  items: number;
  totalReceivedQuantity: number;
  totalAcceptedQuantity: number;
  totalRejectedQuantity: number;

  warehouseItems: WarehouseReceiptItem[];
}