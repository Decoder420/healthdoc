
import type {
  StockLedgerEntry,
  StockTransactionType,
} from "../types/stockLedger";

import {
  getStockTransactions,
} from "./stockTransactionData";

const STORAGE_KEY =
  "hospital_stock_ledger";

/*
 * ============================================================
 * DEMO LEDGER DATA
 * ============================================================
 */

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
];

/*
 * ============================================================
 * TRANSACTION → LEDGER
 * ============================================================
 */

function transactionToLedgerEntry(
  transaction: {
    id: string;
    item_id: string;
    batch_id?: string | null;
    transaction_type: StockTransactionType;
    quantity: number;
    reference_type?: string | null;
    reference_id?: string | null;
    performed_by: string;
    reason?: string | null;
    created_at: string;
  },
  index: number
): StockLedgerEntry {
  return {
    id: `SL-${String(
      index + 1
    ).padStart(3, "0")}`,

    item_id:
      transaction.item_id,

    batch_id:
      transaction.batch_id ?? null,

    transaction_type:
      transaction.transaction_type,

    quantity:
      transaction.quantity,

    reference_type:
      transaction.reference_type ??
      null,

    reference_id:
      transaction.reference_id ??
      null,

    performed_by:
      transaction.performed_by,

    reason:
      transaction.reason ??
      null,

    created_at:
      transaction.created_at,
  };
}

/*
 * ============================================================
 * GET STOCK LEDGER
 * ============================================================
 *
 * STOCK TRANSACTIONS are the source of truth.
 *
 * Final approval
 *       ↓
 * Transaction
 *       ↓
 * Ledger
 *
 * ============================================================
 */

export function getStockLedger(): StockLedgerEntry[] {
  if (typeof window === "undefined") {
    return stockLedgerData;
  }

  const transactions =
    getStockTransactions();

  if (transactions.length === 0) {
    return stockLedgerData;
  }

  const ledger =
    transactions.map(
      (transaction, index) =>
        transactionToLedgerEntry(
          transaction,
          index
        )
    );

  /*
   * Cache for existing UI.
   */
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(ledger)
  );

  return ledger;
}

/*
 * ============================================================
 * APPEND LEDGER ENTRY
 * ============================================================
 *
 * Kept only for compatibility.
 *
 * DO NOT use this for stock adjustments.
 * ============================================================
 */

export function appendStockLedgerEntry(
  entry: StockLedgerEntry
): StockLedgerEntry[] {
  const currentLedger =
    getStockLedger();

  const alreadyExists =
    currentLedger.some(
      (existing) =>
        existing.reference_type ===
          entry.reference_type &&
        existing.reference_id ===
          entry.reference_id
    );

  if (alreadyExists) {
    return currentLedger;
  }

  const updatedLedger = [
    ...currentLedger,
    entry,
  ];

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedLedger)
  );

  return updatedLedger;
}

/*
 * ============================================================
 * GENERATE LEDGER ID
 * ============================================================
 */

export function generateStockLedgerId(): string {
  const ledger =
    getStockLedger();

  const nextNumber =
    ledger.reduce(
      (max, entry) => {
        const number = Number(
          entry.id.replace(
            "SL-",
            ""
          )
        );

        return Number.isNaN(number)
          ? max
          : Math.max(
              max,
              number
            );
      },
      0
    ) + 1;

  return `SL-${String(
    nextNumber
  ).padStart(3, "0")}`;
}

/*
 * ============================================================
 * CALCULATE STOCK BALANCE
 * ============================================================
 */

export function calculateStockBalance(
  entries: StockLedgerEntry[],
  itemId: string,
  batchId?: string | null
): number {
  return entries
    .filter(
      (entry) =>
        entry.item_id ===
          itemId &&
        (
          batchId === undefined ||
          entry.batch_id ===
            batchId
        )
    )
    .reduce(
      (total, entry) =>
        total + entry.quantity,
      0
    );
}

/*
 * ============================================================
 * TRANSACTION LABEL
 * ============================================================
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
