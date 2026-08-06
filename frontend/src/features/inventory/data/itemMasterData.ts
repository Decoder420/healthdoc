
import type { ItemMaster } from "../types/itemMaster";

export const itemMasterData: ItemMaster[] = [
  {
    id: "ITEM-001",
    itemCode: "MED-001",
    itemName: "Paracetamol 500mg",

    category: "Medicine",
    subcategory: "Analgesic",

    brand: "Cipla",

    unit: "Tablet",

    minimumStock: 100,
    reorderLevel: 150,

    supplierId: "SUP-001",
    supplierName: "Surgical Care Pvt Ltd",

    storageLocation: "Rack A-01",

    description:
      "Paracetamol 500mg tablets for pain and fever management.",

    isActive: true,

    createdAt: "2026-08-01",
  },

  {
    id: "ITEM-002",
    itemCode: "MED-002",
    itemName: "Amoxicillin 500mg",

    category: "Medicine",
    subcategory: "Antibiotic",

    brand: "Sun Pharma",

    unit: "Capsule",

    minimumStock: 50,
    reorderLevel: 100,

    supplierId: "SUP-002",
    supplierName: "Medico Healthcare",

    storageLocation: "Rack A-02",

    description:
      "Amoxicillin 500mg capsules.",

    isActive: true,

    createdAt: "2026-08-01",
  },

  {
    id: "ITEM-003",
    itemCode: "CON-001",
    itemName: "Surgical Gloves",

    category: "Consumables",
    subcategory: "Surgical Supplies",

    brand: "Nitrile",

    unit: "Pair",

    minimumStock: 200,
    reorderLevel: 300,

    supplierId: "SUP-001",
    supplierName: "Surgical Care Pvt Ltd",

    storageLocation: "Rack B-01",

    description:
      "Disposable nitrile surgical gloves.",

    isActive: true,

    createdAt: "2026-08-01",
  },

  {
    id: "ITEM-004",
    itemCode: "CON-002",
    itemName: "Syringe 5ml",

    category: "Consumables",
    subcategory: "Injection Supplies",

    brand: "BD",

    unit: "Piece",

    minimumStock: 300,
    reorderLevel: 500,

    supplierId: "SUP-002",
    supplierName: "Medico Healthcare",

    storageLocation: "Rack B-02",

    description:
      "Sterile disposable 5ml syringe.",

    isActive: true,

    createdAt: "2026-08-01",
  },

  {
    id: "ITEM-005",
    itemCode: "LAB-001",
    itemName: "Blood Collection Tube",

    category: "Laboratory",
    subcategory: "Collection Supplies",

    brand: "BD",

    unit: "Piece",

    minimumStock: 100,
    reorderLevel: 200,

    supplierId: "SUP-002",
    supplierName: "Medico Healthcare",

    storageLocation: "Rack C-01",

    description:
      "Vacuum blood collection tube.",

    isActive: true,

    createdAt: "2026-08-01",
  },

  {
    id: "ITEM-006",
    itemCode: "DIA-001",
    itemName: "Digital Thermometer",

    category: "Medical Equipment",
    subcategory: "Monitoring",

    brand: "Dr Trust",

    unit: "Piece",

    minimumStock: 10,
    reorderLevel: 20,

    supplierId: "SUP-001",
    supplierName: "Surgical Care Pvt Ltd",

    storageLocation: "Rack D-01",

    description:
      "Digital clinical thermometer.",

    isActive: true,

    createdAt: "2026-08-01",
  },
];

