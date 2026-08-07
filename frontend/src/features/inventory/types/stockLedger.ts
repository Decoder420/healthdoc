export type StockTransactionType =
  | "purchase"
  | "issue"
  | "return"
  | "transfer"
  | "consumption"
  | "adjustment"
  | "write_off";

export interface StockLedgerEntry {
  id: string;

  item_id: string;
  batch_id?: string | null;

  transaction_type: StockTransactionType;

  /**
   * Signed quantity:
   * +ve = stock in
   * -ve = stock out
   */
  quantity: number;

  reference_type?: string | null;
  reference_id?: string | null;

  performed_by: string;
  reason?: string | null;

  created_at: string;
}