import type {
  WarehouseReceipt,
  WarehouseReceiptItem,
} from "../types/warehouse";''

const WAREHOUSE_RECEIPTS_KEY =
  "warehouse_receipts";

export const warehouseReceipts: WarehouseReceipt[] = [
  {
    id: "WR-001",

    grnId: "GRN-001",
    grnNumber: "GRN-2026-001",

    purchaseOrderId: "PO-001",
    purchaseOrderNumber: "PO-2026-001",

    supplierId: "SUP-001",
    supplierName: "Surgical Care Pvt Ltd",

    warehouseId: "WH-001",
    warehouseName: "Main Hospital Store",

    receivedDate: "05/08/2026",

    status: "Pending",

    items: 2,

    totalReceivedQuantity: 1200,
    totalAcceptedQuantity: 0,
    totalRejectedQuantity: 0,

    warehouseItems: [
      {
        id: "WRI-001",

        itemId: "ITEM-001",
        itemName: "Surgical Gloves",

        orderedQuantity: 1000,
        receivedQuantity: 1000,

        acceptedQuantity: 0,
        rejectedQuantity: 0,

        batchNumber: "SG-2026-A01",
        expiryDate: "12/2028",

        unit: "Box",
      },

      {
        id: "WRI-002",

        itemId: "ITEM-002",
        itemName: "Disposable Syringes",

        orderedQuantity: 200,
        receivedQuantity: 200,

        acceptedQuantity: 0,
        rejectedQuantity: 0,

        batchNumber: "DS-2026-B02",
        expiryDate: "10/2029",

        unit: "Box",
      },
    ],
  },
];

export const getStoredWarehouseReceipts =
  (): WarehouseReceipt[] => {
    if (typeof window === "undefined") {
      return [];
    }

    try {
      const stored =
        localStorage.getItem(
          WAREHOUSE_RECEIPTS_KEY
        );

      if (!stored) {
        return warehouseReceipts;
      }

      const parsed = JSON.parse(stored);

      return Array.isArray(parsed)
        ? parsed
        : warehouseReceipts;
    } catch (error) {
      console.error(
        "Failed to load warehouse receipts:",
        error
      );

      return warehouseReceipts;
    }
  };

export const saveWarehouseReceipts = (
  receipts: WarehouseReceipt[]
) => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    WAREHOUSE_RECEIPTS_KEY,
    JSON.stringify(receipts)
  );
};

/**
 * Create a warehouse receipt from
 * a verified GRN.
 */
export const createWarehouseReceiptFromGRN = (
  grn: any
): WarehouseReceipt => {
  const existingReceipts =
    getStoredWarehouseReceipts();

  /*
   * Prevent duplicate warehouse receipts
   * for the same GRN.
   */
  const existing =
    existingReceipts.find(
      (receipt) =>
        receipt.grnId === grn.id
    );

  if (existing) {
    return existing;
  }

  const warehouseItems:
    WarehouseReceiptItem[] =
    grn.grnItems.map(
      (item: any, index: number) => ({
        id:
          `${grn.id}-WRI-${index + 1}`,

        itemId:
          item.itemId,

        itemName:
          item.itemName,

        orderedQuantity:
          item.quantity,

        receivedQuantity:
          item.receivedQuantity ??
          item.quantity,

        acceptedQuantity: 0,

        rejectedQuantity: 0,

        batchNumber:
          item.batchNumber === "PENDING"
            ? ""
            : item.batchNumber,

        expiryDate:
          item.expiryDate === "PENDING"
            ? ""
            : item.expiryDate,

        unit:
          item.unit ?? "Unit",
      })
    );

  const warehouseReceipt:
    WarehouseReceipt = {
      id:
        `WR-${Date.now()}`,

      grnId:
        grn.id,

      grnNumber:
        grn.grnNumber,

      purchaseOrderId:
        grn.purchaseOrderId,

      purchaseOrderNumber:
        grn.poNumber,

      supplierId:
        grn.supplierId,

      supplierName:
        grn.supplierName,

      warehouseId:
        "WH-001",

      warehouseName:
        "Main Hospital Store",

      receivedDate:
        grn.receivedDate,

      status:
        "Pending",

      items:
        warehouseItems.length,

      totalReceivedQuantity:
        warehouseItems.reduce(
          (sum, item) =>
            sum +
            item.receivedQuantity,
          0
        ),

      totalAcceptedQuantity: 0,

      totalRejectedQuantity: 0,

      warehouseItems,
    };

  saveWarehouseReceipts([
    ...existingReceipts,
    warehouseReceipt,
  ]);

  return warehouseReceipt;
};