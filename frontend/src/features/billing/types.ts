/** Billing DTOs aligned to migration 0014 (snake_case for API fidelity). */

export type InvoiceStatus =
  | "draft"
  | "issued"
  | "partially_paid"
  | "paid"
  | "waived"
  | "cancelled";

export type ChargeCategory =
  | "registration"
  | "consultation"
  | "lab"
  | "radiology"
  | "pharmacy"
  | "procedure"
  | "ipd_stay"
  | "blood"
  | "other";

export type PaymentMode = "cash" | "upi" | "card" | "netbanking";
export type PaymentStatus = "success" | "reversed";

export type Invoice = {
  id: string;
  invoice_number: string;
  visit_id: string;
  patient_id: string;
  facility_id: string;
  status: InvoiceStatus;
  gross_amount: number;
  discount_amount: number;
  scheme_adjustment: number;
  net_amount: number;
  scheme_code: string | null;
  sensitivity: "critical";
  created_at: string;
  updated_at: string;
};

export type InvoiceItem = {
  id: string;
  invoice_id: string;
  charge_category: ChargeCategory;
  reference_type: string | null;
  reference_id: string | null;
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
};

export type InvoiceWithItems = Invoice & {
  items: InvoiceItem[];
  payments?: Payment[];
  patient?: { uhid: string; name: string; age?: number; gender?: string };
  visit?: { visit_type: "OPD" | "IPD" };
};

export type Payment = {
  id: string;
  invoice_id: string;
  receipt_number: string;
  amount: number;
  mode: PaymentMode;
  status: PaymentStatus;
  collected_by: string;
  collected_at: string;
  reference_txn_id?: string | null;
  notes?: string | null;
};

export type Refund = {
  id: string;
  payment_id: string;
  invoice_id: string;
  refund_number: string;
  amount: number;
  reason: string;
  approved_by: string;
  refunded_at: string;
};

export type CollectPaymentInput = {
  amount: number;
  mode: PaymentMode;
  reference_txn_id?: string | null;
  notes?: string | null;
  collected_by?: string;
};

export type CreateRefundInput = {
  amount: number;
  reason: string;
  approved_by?: string;
};

export type PaymentWithRefunds = Payment & {
  refunds: Refund[];
};

export type SchemeOptionCode = "SELF_PAY" | "PM-JAY" | "OTHER";

export type PmjayEligibilityStatus = "eligible" | "ineligible" | "unknown";

export type InvoiceListFilters = {
  query?: string;
  status?: InvoiceStatus | "all";
};

export type AddInvoiceItemInput = {
  charge_category: ChargeCategory;
  description: string;
  quantity: number;
  unit_price: number;
  reference_type?: string | null;
  reference_id?: string | null;
};

export type UpdateInvoiceDraftInput = {
  scheme_code?: string | null;
  discount_amount?: number;
  scheme_adjustment?: number;
  status?: InvoiceStatus;
};
