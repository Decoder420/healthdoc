import type {
  WarehouseReceipt,
} from "../types/warehouse";

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

  {
    id: "WR-002",

    grnId: "GRN-002",
    grnNumber: "GRN-2026-002",

    purchaseOrderId: "PO-002",
    purchaseOrderNumber: "PO-2026-002",

    supplierId: "SUP-002",
    supplierName: "Medico Healthcare",

    warehouseId: "WH-001",
    warehouseName: "Main Hospital Store",

    receivedDate: "04/08/2026",

    status: "Received",

    items: 1,

    totalReceivedQuantity: 500,
    totalAcceptedQuantity: 490,
    totalRejectedQuantity: 10,

    warehouseItems: [
      {
        id: "WRI-003",

        itemId: "ITEM-003",
        itemName: "Paracetamol 500mg",

        orderedQuantity: 500,
        receivedQuantity: 500,

        acceptedQuantity: 490,
        rejectedQuantity: 10,

        batchNumber: "PCM-2026-C01",
        expiryDate: "12/2028",

        unit: "Strip",
      },
    ],
  },
];