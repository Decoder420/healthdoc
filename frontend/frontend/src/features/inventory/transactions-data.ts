export type TransactionType =
  | "Purchase Request"
  | "Purchase Order"
  | "GRN"
  | "Stock Issue"
  | "Stock Return"
  | "Stock Transfer"
  | "Consumption"
  | "Adjustment"
  | "Damage/Expiry Write-off";

export type TransactionStatus = "Draft" | "Pending" | "Approved" | "Completed";

export type InventoryTransaction = {
  id: string;
  number: string;
  type: TransactionType;
  date: string;
  itemName: string;
  quantity: number;
  unit: string;
  source: string;
  destination: string;
  reference: string;
  status: TransactionStatus;
  createdBy: string;
  notes: string;
};

export const TRANSACTION_TYPES: TransactionType[] = [
  "Purchase Request",
  "Purchase Order",
  "GRN",
  "Stock Issue",
  "Stock Return",
  "Stock Transfer",
  "Consumption",
  "Adjustment",
  "Damage/Expiry Write-off",
];

const ITEMS = [
  ["Normal Saline 500 ml", "bottles"],
  ["Surgical Gloves 7.5", "pairs"],
  ["Oxygen Mask Adult", "pieces"],
  ["IV Cannula 20G", "pieces"],
  ["Insulin Human 100 IU/ml", "vials"],
  ["Motorized ICU Bed", "beds"],
  ["Paracetamol 650 mg", "tablets"],
  ["X-Ray Film 14×17", "sheets"],
  ["CT Contrast Iohexol", "vials"],
  ["Vicryl 2-0 Suture", "packs"],
  ["N95 Masks", "pieces"],
  ["Blood Collection Tubes", "pieces"],
  ["ECG Electrodes", "packs"],
  ["Ringer Lactate 500 ml", "bottles"],
  ["Lead Apron Cover", "pieces"],
] as const;

const SOURCES = [
  "Baxter India",
  "Central Warehouse",
  "Pharmacy Cold Store",
  "ICU",
  "General Ward",
  "Emergency Store",
  "OT Store",
  "Lab Store",
  "Radiology Store",
  "Procurement",
];

const DESTINATIONS = [
  "Central Warehouse",
  "Operation Theatre",
  "Emergency Store",
  "Quarantine / Disposal",
  "Procurement",
  "ICU",
  "Pharmacy",
  "Radiology",
  "Laboratory",
  "General Ward",
];

const CREATORS = [
  "Inventory Manager",
  "Store Officer",
  "Pharmacy Manager",
  "Ward In-charge",
  "OT Coordinator",
  "Lab Supervisor",
];

const STATUSES: TransactionStatus[] = [
  "Completed",
  "Completed",
  "Approved",
  "Pending",
  "Draft",
];

const TYPE_PREFIX: Record<TransactionType, string> = {
  "Purchase Request": "PR",
  "Purchase Order": "PO",
  GRN: "GRN",
  "Stock Issue": "ISS",
  "Stock Return": "RET",
  "Stock Transfer": "TRF",
  Consumption: "CON",
  Adjustment: "ADJ",
  "Damage/Expiry Write-off": "WO",
};

export { TYPE_PREFIX };

/** Heavy mock transaction ledger for filter/search/create testing. */
export const INITIAL_TRANSACTIONS: InventoryTransaction[] = Array.from(
  { length: 60 },
  (_, index) => {
    const type = TRANSACTION_TYPES[index % TRANSACTION_TYPES.length];
    const [itemName, unit] = ITEMS[index % ITEMS.length];
    const day = 30 - (index % 28);
    const hour = 6 + (index % 12);
    return {
      id: `tx-${index + 1}`,
      number: `${TYPE_PREFIX[type]}-2026-${String(700 + index).padStart(5, "0")}`,
      type,
      date: new Date(Date.UTC(2026, 6, day, hour, (index * 7) % 60)).toISOString(),
      itemName,
      quantity: 2 + ((index * 11) % 240),
      unit,
      source: SOURCES[index % SOURCES.length],
      destination: DESTINATIONS[(index + 3) % DESTINATIONS.length],
      reference: `REF-${2200 + index}`,
      status: STATUSES[index % STATUSES.length],
      createdBy: CREATORS[index % CREATORS.length],
      notes:
        index % 4 === 0
          ? "Routine replenishment."
          : index % 4 === 1
            ? "Quality checked on receipt."
            : index % 4 === 2
              ? "Urgent indent fulfilment."
              : "System generated mock transaction.",
    };
  },
);
