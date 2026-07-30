import { PurchaseRequisition } from "../types/purchaseRequisition";

export const purchaseRequisitions: PurchaseRequisition[] = [
  {
    id: "PR-001",

    requisitionNumber: "PR-20260730-001",

    indentId: "IND-001",
    indentNumber: "IND-20260729-001",

    departmentId: "DEPT-RAD-001",
    departmentName: "Radiology",

    requestedBy: "Dr. Amit Sharma",

    priority: "Normal",
    status: "Pending Approval",
    approvalStatus: "Pending",

    supplierId: "SUP-001",
    supplierName: "MedTech Supplies",

    items: 2,
    totalQuantity: 50,
    estimatedTotal: 12500,

    createdAt: "30 July 2026",

    remarks: "Required for regular radiology procedures.",

    requisitionItems: [
      {
        id: "PRI-ITEM-001",
        itemId: "ITEM001",
        itemName: "X-Ray Film",
        quantity: 30,
        estimatedRate: 250,
        estimatedAmount: 7500,
      },
      {
        id: "PRI-ITEM-002",
        itemId: "ITEM002",
        itemName: "Contrast Media",
        quantity: 20,
        estimatedRate: 250,
        estimatedAmount: 5000,
      },
    ],
  },

  {
    id: "PR-002",

    requisitionNumber: "PR-20260730-002",

    indentId: "IND-002",
    indentNumber: "IND-20260728-002",

    departmentId: "DEPT-OT-001",
    departmentName: "Operation Theatre",

    requestedBy: "Nurse Manager",

    priority: "Urgent",
    status: "Approved",
    approvalStatus: "Approved",

    supplierId: "SUP-002",
    supplierName: "Surgical Care Pvt Ltd",

    items: 2,
    totalQuantity: 80,
    estimatedTotal: 12400,

    createdAt: "30 July 2026",

    remarks: "Urgent surgical consumables required.",

    requisitionItems: [
      {
        id: "PRI-ITEM-003",
        itemId: "ITEM005",
        itemName: "Surgical Gloves",
        quantity: 50,
        estimatedRate: 200,
        estimatedAmount: 10000,
      },
      {
        id: "PRI-ITEM-004",
        itemId: "ITEM006",
        itemName: "Syringes",
        quantity: 30,
        estimatedRate: 80,
        estimatedAmount: 2400,
      },
    ],
  },

  {
    id: "PR-003",

    requisitionNumber: "PR-20260730-003",

    indentId: "IND-003",
    indentNumber: "IND-20260727-003",

    departmentId: "DEPT-LAB-001",
    departmentName: "Laboratory",

    requestedBy: "Lab Technician",

    priority: "Normal",
    status: "Converted to PO",
    approvalStatus: "Approved",

    supplierId: "SUP-003",
    supplierName: "Lab Diagnostics",

    items: 2,
    totalQuantity: 90,
    estimatedTotal: 7000,

    createdAt: "30 July 2026",

    remarks: "Laboratory consumables required.",

    requisitionItems: [
      {
        id: "PRI-ITEM-005",
        itemId: "ITEM003",
        itemName: "Blood Collection Tube",
        quantity: 50,
        estimatedRate: 100,
        estimatedAmount: 5000,
      },
      {
        id: "PRI-ITEM-006",
        itemId: "ITEM004",
        itemName: "Microscope Slides",
        quantity: 40,
        estimatedRate: 50,
        estimatedAmount: 2000,
      },
    ],
  },
];