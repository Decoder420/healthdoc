export interface ExpiryStockItem {
  item_id: string;
  item_name: string;
  batch_id: string;
  expiry_date: string;
  available_quantity: number;
}

export type ExpiryBucket =
  | "30"
  | "60"
  | "90"
  | "expired"
  | "safe";