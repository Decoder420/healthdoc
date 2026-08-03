import { PurchaseOrder } from "../types/purchaseOrder";


export const purchaseOrders: PurchaseOrder[] = [
  {
    id: "PO-001",

    poNumber: "PO-20260730-001",

    purchaseRequisitionId: "PR-002",
    requisitionNumber: "PR-20260730-002",

    supplierId: "SUP-002",
    supplierName: "Surgical Care Pvt Ltd",

    departmentId: "DEPT-OT-001",
    departmentName: "Operation Theatre",

    orderDate: "30 July 2026",

    expectedDeliveryDate: "05 August 2026",

    status: "Approved",

    items: 2,

    totalQuantity: 80,

    subtotal: 12400,

    taxAmount: 0,

    discountAmount: 0,

    grandTotal: 12400,

    paymentTerms: "30 Days",

    deliveryTerms: "Delivery at Hospital Store",

    remarks: "Urgent surgical consumables required.",

    createdBy: "Inventory Manager",

    createdAt: "30 July 2026",

    approvedBy: "Inventory Manager",

    approvedAt: "30 July 2026",

    purchaseOrderItems: [
      {
        id: "PO-ITEM-001",

        itemId: "ITEM005",

        itemName: "Surgical Gloves",

        orderedQuantity: 50,

        unitRate: 200,

        taxPercent: 0,

        discount: 0,

        amount: 10000,

        receivedQuantity: 0,
      },

      {
        id: "PO-ITEM-002",

        itemId: "ITEM006",

        itemName: "Syringes",

        orderedQuantity: 30,

        unitRate: 80,

        taxPercent: 0,

        discount: 0,

        amount: 2400,

        receivedQuantity: 0,
      },
    ],
  },
];



const STORAGE_KEY = "hospital_purchase_orders";

export function getStoredPurchaseOrders(
  fallback: PurchaseOrder[]
): PurchaseOrder[] {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(fallback)
      );

      return fallback;
    }

    return JSON.parse(stored);
  } catch {
    return fallback;
  }
}

export function savePurchaseOrders(
  purchaseOrders: PurchaseOrder[]
) {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(purchaseOrders)
  );
}

export function addPurchaseOrder(
  purchaseOrder: PurchaseOrder
) {
  const existing = getStoredPurchaseOrders([]);

  const updated = [
    ...existing,
    purchaseOrder,
  ];

  savePurchaseOrders(updated);

  return updated;
}

export function updatePurchaseOrder(
  purchaseOrder: PurchaseOrder
) {
  const existing = getStoredPurchaseOrders([]);

  const updated = existing.map((po) =>
    po.id === purchaseOrder.id
      ? purchaseOrder
      : po
  );

  savePurchaseOrders(updated);

  return updated;
}