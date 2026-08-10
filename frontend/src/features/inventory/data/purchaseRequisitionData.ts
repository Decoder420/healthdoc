import type { PurchaseRequisition } from "../types/purchaseRequisition";
import {
  getApprovedIndentRequests,
} from "./indentData";

const STORAGE_KEY = "hospital_purchase_requisitions";

const initialPurchaseRequisitions: PurchaseRequisition[] = [
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

    remarks:
      "Required for regular radiology procedures.",

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
];

export const getPurchaseRequisitions =
  (): PurchaseRequisition[] => {
    if (typeof window === "undefined") {
      return initialPurchaseRequisitions;
    }

    const stored =
      localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return initialPurchaseRequisitions;
    }

    try {
      return JSON.parse(stored);
    } catch {
      return initialPurchaseRequisitions;
    }
  };

export const savePurchaseRequisitions = (
  requisitions: PurchaseRequisition[]
) => {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(requisitions)
  );
};

export const getPurchaseRequisitionById = (
  id: string
) => {
  return getPurchaseRequisitions().find(
    (pr) => pr.id === id
  );
};


/*
 * =========================================
 * INDENTS AVAILABLE FOR PR
 * =========================================
 */

export const getIndentsAvailableForPR = () => {
  const approvedIndents =
    getApprovedIndentRequests();

  const existingPRs =
    getPurchaseRequisitions();

  const usedIndentIds =
    existingPRs.map(
      (pr) => pr.indentId
    );

  return approvedIndents.filter(
    (indent) =>
      !usedIndentIds.includes(indent.id)
  );
};