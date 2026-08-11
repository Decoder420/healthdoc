export interface StockTransaction {
  id: string;

  item_id: string;
  item_name: string;

  batch_id?: string | null;

  transaction_type:
    | "purchase"
    | "issue"
    | "transfer"
    | "adjustment"
    | "return"
    | "consumption";

  quantity: number;

  reference_type: string;
  reference_id: string;

  performed_by: string;

  reason?: string;

  created_at: string;
}