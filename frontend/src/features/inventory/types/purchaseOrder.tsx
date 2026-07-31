export type PurchaseOrderStatus =
  | "Draft"
  | "Pending Approval"
  | "Approved"
  | "Sent to Supplier"
  | "Partially Received"
  | "Fully Received"
  | "Cancelled"
  | "Closed";

export interface PurchaseOrderItem {
  id: string;

  itemId: string;
  itemName: string;

  orderedQuantity: number;

  unitRate: number;

  taxPercent?: number;

  discount?: number;

  amount: number;

  receivedQuantity?: number;
}

export interface PurchaseOrder {
  id: string;

  poNumber: string;

  purchaseRequisitionId: string;
  requisitionNumber: string;

  supplierId?: string;
  supplierName: string;

  departmentId: string;
  departmentName: string;

  orderDate: string;

  expectedDeliveryDate?: string;

  status: PurchaseOrderStatus;

  items: number;

  totalQuantity: number;

  subtotal: number;

  taxAmount: number;

  discountAmount: number;

  grandTotal: number;

  paymentTerms?: string;

  deliveryTerms?: string;

  remarks?: string;

  createdBy: string;

  createdAt: string;

  approvedBy?: string;

  approvedAt?: string;

  purchaseOrderItems: PurchaseOrderItem[];
}