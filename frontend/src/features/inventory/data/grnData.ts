
import { GRN } from "../types/grn";
import { PurchaseOrder } from "../types/purchaseOrder";

/*
|--------------------------------------------------------------------------
| INITIAL GRN DATA
|--------------------------------------------------------------------------
*/

export const grns: GRN[] = [
  {
    id: "GRN-001",

    grnNumber: "GRN-20260803-001",

    purchaseOrderId: "PO-001",
    poNumber: "PO-20260730-001",

    purchaseRequisitionId: "PR-002",
    requisitionNumber: "PR-20260730-002",

    supplierId: "SUP-002",
    supplierName: "Surgical Care Pvt Ltd",

    departmentId: "DEPT-OT-001",
    departmentName: "Operation Theatre",

    receivedDate: "03 August 2026",

    supplierInvoiceNumber: "INV-2026-045",
    supplierInvoiceDate: "03 August 2026",

    deliveryChallanNumber: "DC-2026-021",

    receivedBy: "Store Manager",

    status: "Pending Inspection",

    totalItems: 2,

    totalOrderedQuantity: 80,
    totalReceivedQuantity: 70,

    acceptedQuantity: 0,
    rejectedQuantity: 0,

    inspectionRequired: true,

    remarks:
      "Partial delivery received against purchase order.",

    createdAt: "03 August 2026",

    grnItems: [
      {
        id: "GRN-ITEM-001",

        itemId: "ITEM005",
        itemName: "Surgical Gloves",

        orderedQuantity: 50,
        previouslyReceivedQuantity: 0,
        receivedQuantity: 50,

        acceptedQuantity: 0,
        rejectedQuantity: 0,

        unitRate: 200,
        amount: 10000,

        batchNumber: "SG-2026-001",
        expiryDate: "30 June 2029",
      },

      {
        id: "GRN-ITEM-002",

        itemId: "ITEM006",
        itemName: "Syringes",

        orderedQuantity: 30,
        previouslyReceivedQuantity: 0,
        receivedQuantity: 20,

        acceptedQuantity: 0,
        rejectedQuantity: 0,

        unitRate: 80,
        amount: 1600,

        batchNumber: "SY-2026-045",
        expiryDate: "31 December 2030",
      },
    ],
  },
];

/*
|--------------------------------------------------------------------------
| LOCAL STORAGE
|--------------------------------------------------------------------------
*/

const STORAGE_KEY = "hospital_grns";

/*
|--------------------------------------------------------------------------
| GET GRNs
|--------------------------------------------------------------------------
*/

export function getStoredGRNs(
  fallback: GRN[] = grns
): GRN[] {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const stored = localStorage.getItem(
      STORAGE_KEY
    );

    if (!stored) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(fallback)
      );

      return fallback;
    }

    const parsed: unknown = JSON.parse(stored);

    return Array.isArray(parsed)
      ? (parsed as GRN[])
      : fallback;
  } catch {
    return fallback;
  }
}

/*
|--------------------------------------------------------------------------
| SAVE GRNs
|--------------------------------------------------------------------------
*/

export function saveGRNs(
  purchaseGRNs: GRN[]
): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(purchaseGRNs)
    );
  } catch {
    // Ignore localStorage errors
  }
}

/*
|--------------------------------------------------------------------------
| ADD GRN
|--------------------------------------------------------------------------
*/

export function addGRN(
  grn: GRN
): GRN[] {
  const existing = getStoredGRNs([]);

  const updated = [
    grn,
    ...existing,
  ];

  saveGRNs(updated);

  return updated;
}

/*
|--------------------------------------------------------------------------
| UPDATE GRN
|--------------------------------------------------------------------------
*/

export function updateGRN(
  grn: GRN
): GRN[] {
  const existing = getStoredGRNs([]);

  const updated = existing.map(
    (item) =>
      item.id === grn.id
        ? grn
        : item
  );

  saveGRNs(updated);

  return updated;
}

/*
|--------------------------------------------------------------------------
| CREATE GRN FROM PURCHASE ORDER
|--------------------------------------------------------------------------
*/

export function createGRNFromPurchaseOrder(
  purchaseOrder: PurchaseOrder
): GRN {
  const now = new Date();

  const receivedDate =
    now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  const grnItems =
    purchaseOrder.purchaseOrderItems.map(
      (item) => ({
        id: crypto.randomUUID(),

        itemId: item.itemId,

        itemName: item.itemName,

        orderedQuantity:
          item.orderedQuantity,

        previouslyReceivedQuantity:
          item.receivedQuantity ?? 0,

        receivedQuantity: 0,

        acceptedQuantity: 0,

        rejectedQuantity: 0,

        unitRate:
          item.unitRate,

        amount: 0,

        batchNumber: "",

        expiryDate: "",
      })
    );

  const totalOrderedQuantity =
    grnItems.reduce(
      (sum, item) =>
        sum + item.orderedQuantity,
      0
    );

  return {
    id: crypto.randomUUID(),

    grnNumber:
      `GRN-${Date.now()}`,

    purchaseOrderId:
      purchaseOrder.id ?? "",

    poNumber:
      purchaseOrder.poNumber ?? "",

    purchaseRequisitionId:
      purchaseOrder.purchaseRequisitionId ??
      undefined,

    requisitionNumber:
      purchaseOrder.requisitionNumber ??
      undefined,

    supplierId:
      purchaseOrder.supplierId ?? "",

    supplierName:
      purchaseOrder.supplierName ?? "",

    departmentId:
      purchaseOrder.departmentId ?? "",

    departmentName:
      purchaseOrder.departmentName ?? "",

    receivedDate,

    receivedBy:
      "Inventory Store",

    status:
      "Draft",

    totalItems:
      grnItems.length,

    totalOrderedQuantity,

    totalReceivedQuantity: 0,

    acceptedQuantity: 0,

    rejectedQuantity: 0,

    inspectionRequired: true,

    remarks:
      `GRN generated against ${purchaseOrder.poNumber}.`,

    createdAt:
      receivedDate,

    grnItems,
  };
}

