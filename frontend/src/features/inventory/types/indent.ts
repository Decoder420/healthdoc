export type IndentStatus =
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Issued"
  | "Completed";

export type IndentPriority =
  | "Normal"
  | "Urgent"
  | "Emergency";

export interface IndentItem {
  id: string;
  itemId: string;
  itemName: string;
  availableStock: number;
  quantity: number;
}

export interface IndentRequest {
  id: string;

  requestNumber: string;

  departmentId: string;
  departmentName: string;

  requestedBy: string;

  priority: IndentPriority;

  status: IndentStatus;

  // Summary
  items: number;
  totalQuantity: number;

  createdAt: string;

  remarks?: string;

  // Actual requested inventory items
  indentItems: IndentItem[];

  purchaseRequisitionId?: string;
  purchaseRequisitionNumber?: string;
}