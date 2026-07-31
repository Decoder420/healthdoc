export type PurchaseRequisitionStatus =
  | "Draft"
  | "Pending Approval"
  | "Approved"
  | "Rejected"
  | "Sent Back"
  | "Converted to PO"
  | "Cancelled";

export type PurchaseApprovalStatus =
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Sent Back";

export interface PurchaseRequisitionItem {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  estimatedRate?: number;
  estimatedAmount?: number;
}

export interface PurchaseRequisition {
  id: string;

  requisitionNumber: string;

  indentId: string;
  indentNumber: string;

  departmentId: string;
  departmentName: string;

  requestedBy: string;
  priority: string;

  status: PurchaseRequisitionStatus;

  approvalStatus: PurchaseApprovalStatus;

  supplierId?: string;
  supplierName?: string;

  items: number;
  totalQuantity: number;
  estimatedTotal: number;

  createdAt: string;

  remarks?: string;

  approvalComment?: string;
  approvedBy?: string;
  approvedAt?: string;

  rejectionReason?: string;
  sentBackReason?: string;

  requisitionItems: PurchaseRequisitionItem[];
}