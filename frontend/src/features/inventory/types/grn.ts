export type GRNStatus =
  | "draft"
  | "received"
  | "verified"
  | "cancelled";

export interface GRNItem {
  id: string;

  grnId: string;

  itemId: string;
  itemName: string;

  batchNumber: string;
  expiryDate: string;

  quantity: number;

  receivedQuantity?: number;

  unitPrice: number;
  amount: number;
}

export interface GRN {
  id: string;

  grnNumber: string;

  purchaseOrderId: string;
  poNumber: string;

  requisitionNumber?: string;

  supplierId: string;
  supplierName: string;

  invoiceNumber?: string;

  receivedDate: string;

  status: GRNStatus;

  grnItems: GRNItem[];

  totalItems: number;
  totalQuantity: number;

  createdAt: string;

  receivedBy: string;

  remarks?: string;
}