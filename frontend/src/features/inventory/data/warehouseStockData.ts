import type { WarehouseStock } from "../types/warehouseStock";

export const warehouseStockData: WarehouseStock[] = [
  {
    id: "WS-001",

    itemId: "ITEM-001",
    itemName: "Paracetamol 500mg",
    category: "Medicine",
    brand: "Cipla",

    supplierId: "SUP-001",
    supplierName: "Surgical Care Pvt Ltd",

    batchNumber: "PCM-2026-001",
    expiryDate: "2027-06-30",

    quantity: 500,
    availableQuantity: 500,

    unit: "Tablets",

    warehouseId: "WH-001",
    warehouseName: "Main Warehouse",

    grnId: "GRN-001",
    grnNumber: "GRN-2026-001",

    receivedDate: "2026-08-05",

    status: "Available",
  },

  {
    id: "WS-002",

    itemId: "ITEM-002",
    itemName: "Amoxicillin 500mg",
    category: "Medicine",
    brand: "Sun Pharma",

    supplierId: "SUP-002",
    supplierName: "Medico Healthcare",

    batchNumber: "AMX-2026-001",
    expiryDate: "2027-03-31",

    quantity: 250,
    availableQuantity: 250,

    unit: "Capsules",

    warehouseId: "WH-001",
    warehouseName: "Main Warehouse",

    grnId: "GRN-002",
    grnNumber: "GRN-2026-002",

    receivedDate: "2026-08-05",

    status: "Available",
  },

  {
    id: "WS-003",

    itemId: "ITEM-003",
    itemName: "Surgical Gloves",
    category: "Consumables",
    brand: "Nitrile",

    supplierId: "SUP-001",
    supplierName: "Surgical Care Pvt Ltd",

    batchNumber: "GLV-2026-005",
    expiryDate: "2028-01-31",

    quantity: 1000,
    availableQuantity: 1000,

    unit: "Pairs",

    warehouseId: "WH-001",
    warehouseName: "Main Warehouse",

    grnId: "GRN-003",
    grnNumber: "GRN-2026-003",

    receivedDate: "2026-08-05",

    status: "Available",
  },
];