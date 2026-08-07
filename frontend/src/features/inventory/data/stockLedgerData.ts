import type {
  StockLedgerEntry,
  StockTransactionType,
} from "../types/stockLedger";

const STORAGE_KEY = "hospital_stock_ledger";

export const stockLedgerData: StockLedgerEntry[] = [
  {
    id: "SL-001",
    item_id: "ITEM-001",
    batch_id: "BATCH-001",
    transaction_type: "purchase",
    quantity: 500,
    reference_type: "grn",
    reference_id: "GRN-001",
    performed_by: "USR-001",
    reason: "Stock received against GRN",
    created_at: "2026-08-01T09:30:00",
  },
  {
    id: "SL-002",
    item_id: "ITEM-001",
    batch_id: "BATCH-001",
    transaction_type: "issue",
    quantity: -50,
    reference_type: "stock_issue",
    reference_id: "ISS-001",
    performed_by: "USR-002",
    reason: "Issued to Pharmacy",
    created_at: "2026-08-02T11:15:00",
  },
  {
    id: "SL-003",
    item_id: "ITEM-002",
    batch_id: "BATCH-002",
    transaction_type: "purchase",
    quantity: 200,
    reference_type: "grn",
    reference_id: "GRN-002",
    performed_by: "USR-001",
    reason: "Stock received against GRN",
    created_at: "2026-08-03T10:00:00",
  },
  {
    id: "SL-004",
    item_id: "ITEM-001",
    batch_id: "BATCH-001",
    transaction_type: "transfer",
    quantity: -25,
    reference_type: "stock_transfer",
    reference_id: "TRF-001",
    performed_by: "USR-003",
    reason: "Transferred to Emergency Department",
    created_at: "2026-08-04T14:20:00",
  },
  {
    id: "SL-005",
    item_id: "ITEM-002",
    batch_id: "BATCH-002",
    transaction_type: "consumption",
    quantity: -20,
    reference_type: "department_consumption",
    reference_id: "CON-001",
    performed_by: "USR-002",
    reason: "Department consumption",
    created_at: "2026-08-05T12:10:00",
  },
  {
    id: "SL-006",
    item_id: "ITEM-003",
    batch_id: "BATCH-003",
    transaction_type: "return",
    quantity: 10,
    reference_type: "stock_return",
    reference_id: "RET-001",
    performed_by: "USR-004",
    reason: "Unused stock returned from department",
    created_at: "2026-08-05T15:45:00",
  },
  {
    id: "SL-007",
    item_id: "ITEM-003",
    batch_id: "BATCH-003",
    transaction_type: "write_off",
    quantity: -5,
    reference_type: "write_off",
    reference_id: "WO-001",
    performed_by: "USR-003",
    reason: "Damaged stock written off",
    created_at: "2026-08-06T09:20:00",
  },
  {
    id: "SL-008",
    item_id: "ITEM-001",
    batch_id: "BATCH-001",
    transaction_type: "adjustment",
    quantity: -5,
    reference_type: "physical_verification",
    reference_id: "PV-001",
    performed_by: "USR-005",
    reason: "Physical verification shortage",
    created_at: "2026-08-06T11:30:00",
  },
];

/**
 * Returns ledger entries from localStorage.
 * Seeds localStorage with demo data on first load.
 */
export function getStockLedger(): StockLedgerEntry[] {
  if (typeof window === "undefined") {
    return stockLedgerData;
  }

  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stockLedgerData));
    return stockLedgerData;
  }

  try {
    return JSON.parse(stored) as StockLedgerEntry[];
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stockLedgerData));
    return stockLedgerData;
  }
}

/**
 * Append-only operation.
 *
 * Existing ledger entries should never be edited or deleted.
 */
export function appendStockLedgerEntry(
  entry: StockLedgerEntry
): StockLedgerEntry[] {
  const currentLedger = getStockLedger();

  const updatedLedger = [...currentLedger, entry];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLedger));

  return updatedLedger;
}

/**
 * Generate the next ledger ID.
 */
export function generateStockLedgerId(): string {
  const ledger = getStockLedger();

  const nextNumber =
    ledger.reduce((max, entry) => {
      const number = Number(entry.id.replace("SL-", ""));

      return Number.isNaN(number) ? max : Math.max(max, number);
    }, 0) + 1;

  return `SL-${String(nextNumber).padStart(3, "0")}`;
}

/**
 * Calculate running stock balance for an item/batch.
 */
export function calculateStockBalance(
  entries: StockLedgerEntry[],
  itemId: string,
  batchId?: string | null
): number {
  return entries
    .filter(
      (entry) =>
        entry.item_id === itemId &&
        (batchId === undefined || entry.batch_id === batchId)
    )
    .reduce((total, entry) => total + entry.quantity, 0);
}

/**
 * Get a human-readable transaction label.
 */
export function getTransactionLabel(
  type: StockTransactionType
): string {
  switch (type) {
    case "purchase":
      return "Purchase";

    case "issue":
      return "Issue";

    case "return":
      return "Return";

    case "transfer":
      return "Transfer";

    case "consumption":
      return "Consumption";

    case "adjustment":
      return "Adjustment";

    case "write_off":
      return "Write Off";

    default:
      return type;
  }
}