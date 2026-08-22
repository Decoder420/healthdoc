export interface LabOrderItem {
  id: string;
  order_id: string;
  accession_number: string;
  test_code: string | null;
  test_name: string;
  sample_type: string;
  barcode: string | null;
  collected_at: string | null;
  department_id: string | null;
  status: "placed" | "in_progress" | "completed" | "released" | string;
  estimated_minutes: number | null;
  created_at: string;
}

export interface LabOrderItemList {
  items: LabOrderItem[];
  page: number;
  page_size: number;
  total: number;
}

export interface LabResult {
  id: string;
  lab_order_item_id: string;
  version: number;
  is_current: boolean;
  result_data: Record<string, unknown>;
  remarks: string | null;
  amendment_reason: string | null;
  status: "preliminary" | "final" | "corrected" | string;
  created_by: string;
  created_at: string;
  tat_minutes: number | null;
}

export interface LabResultHistory {
  items: LabResult[];
}

export interface CriticalLabAlert {
  lab_order_item_id: string;
  accession_number: string;
}
