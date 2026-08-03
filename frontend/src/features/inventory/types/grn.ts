
export interface GRNItem {
  id: string;

  itemId: string;
  itemName: string;

  orderedQuantity: number;
  previouslyReceivedQuantity: number;
  receivedQuantity: number;

  // Quality inspection
  acceptedQuantity: number;
  rejectedQuantity: number;

  unitRate: number;
  amount: number;

  batchNumber?: string;
  expiryDate?: string;

  remarks?: string;
}

export interface GRN {
  id: string;

  grnNumber: string;

  // Purchase Order
  purchaseOrderId: string;
  poNumber: string;

  // Purchase Requisition
  purchaseRequisitionId?: string;
  requisitionNumber?: string;

  // Supplier
  supplierId: string;
  supplierName: string;

  // Department
  departmentId: string;
  departmentName: string;

  // Receiving
  receivedDate: string;

  supplierInvoiceNumber?: string;
  supplierInvoiceDate?: string;
  deliveryChallanNumber?: string;

  receivedBy: string;

  // Status
  status: GRNStatus;

  // Summary
  totalItems: number;
  totalOrderedQuantity: number;
  totalReceivedQuantity: number;

  // Quality inspection summary
  acceptedQuantity: number;
  rejectedQuantity: number;

  // Quality Inspection
  inspectionRequired: boolean;

  remarks?: string;

  // Items
  grnItems: GRNItem[];

  // Audit
  createdAt: string;
}

/*
|--------------------------------------------------------------------------
| GRN STATUS
|--------------------------------------------------------------------------
|
| Draft
|   ↓
| Pending Inspection
|   ↓
| QC Passed / QC Failed
|   ↓
| Partially Received / Completed
|
|--------------------------------------------------------------------------
*/

export type GRNStatus =
  | "Draft"
  | "Pending Inspection"
  | "QC Passed"
  | "QC Failed"
  | "Partially Received"
  | "Completed";

