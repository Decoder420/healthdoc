import type { GRN } from "../types/grn";

const STORAGE_KEY = "hospital_grns";

export const grnData: GRN[] = [
  {
    id: "GRN-001",

    grnNumber: "GRN-2026-001",

    purchaseOrderId: "PO-001",
    poNumber: "PO-2026-001",

    requisitionNumber: "PR-2026-001",

    supplierId: "SUP-001",
    supplierName: "Surgical Care Pvt Ltd",

    receivedDate: "05/08/2026",

    status: "received",

    grnItems: [
      {
        id: "GRNI-001",
        grnId: "GRN-001",

        itemId: "ITEM-001",
        itemName: "Surgical Gloves",

        batchNumber: "SG-2026-A01",
        expiryDate: "12/2028",

        quantity: 1000,
        receivedQuantity: 1000,

        unitPrice: 250,
        amount: 250000,
      },

      {
        id: "GRNI-002",
        grnId: "GRN-001",

        itemId: "ITEM-002",
        itemName: "Disposable Syringes",

        batchNumber: "DS-2026-B02",
        expiryDate: "10/2029",

        quantity: 200,
        receivedQuantity: 200,

        unitPrice: 15,
        amount: 3000,
      },
    ],

    totalItems: 2,
    totalQuantity: 1200,

    createdAt: "05/08/2026",

    receivedBy: "Store Manager",

    remarks:
      "Received against approved purchase order.",
  },
];

/* =========================================================
   GET GRNs
========================================================= */

export function getStoredGRNs(): GRN[] {
  if (typeof window === "undefined") {
    return grnData;
  }

  try {
    const stored =
      localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      const initialData = [...grnData];

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(initialData)
      );

      return initialData;
    }

    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      const initialData = [...grnData];

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(initialData)
      );

      return initialData;
    }

    return parsed as GRN[];
  } catch (error) {
    console.error(
      "Failed to load GRNs:",
      error
    );

    return [...grnData];
  }
}

/* =========================================================
   SAVE GRNs
========================================================= */

export function saveGRNs(
  grns: GRN[]
): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(grns)
  );
}

/* =========================================================
   CREATE GRN
========================================================= */

export function createGRN(
  grn: GRN
): GRN {
  const grns = getStoredGRNs();

  const updatedGRNs = [
    grn,
    ...grns,
  ];

  saveGRNs(updatedGRNs);

  return grn;
}

/* =========================================================
   UPDATE GRN
========================================================= */

export function updateGRN(
  updatedGRN: GRN
): GRN {
  const grns = getStoredGRNs();

  const updatedGRNs = grns.map(
    (grn) =>
      grn.id === updatedGRN.id
        ? updatedGRN
        : grn
  );

  saveGRNs(updatedGRNs);

  return updatedGRN;
}

/* =========================================================
   DELETE GRN
========================================================= */

export function deleteGRN(
  grnId: string
): void {
  const grns = getStoredGRNs();

  const updatedGRNs = grns.filter(
    (grn) => grn.id !== grnId
  );

  saveGRNs(updatedGRNs);
}