/** Billing DTOs aligned to migration 0014 + envelope money (§4.1). */

import type { Money } from "./lib/money";

export type { Money };

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

/** Hard-coded scheme selector options → invoices.scheme_code (no scheme master). */
export type SchemeOptionCode = "SELF_PAY" | "PM-JAY" | "OTHER";

export type Invoice = {
  id: string;
  invoice_number: string;
  visit_id: string;
  patient_id: string;
  facility_id: string;
  status: InvoiceStatus;
  gross_amount: Money;
  discount_amount: Money;
  scheme_adjustment: Money;
  net_amount: Money;
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
  unit_price: Money;
  amount: Money;
};

/** Visit type enum (lowercase) — schema visits.visit_type. */
export type VisitType = "opd" | "ipd" | "emergency" | "day_care";

export type PatientSex = "male" | "female" | "other" | "unknown";

export type InvoiceWithItems = Invoice & {
  items: InvoiceItem[];
  payments?: Payment[];
  /** Read context from patients / visits — not invoice columns. */
  patient?: {
    uhid: string;
    full_name: string;
    age_years?: number;
    sex?: PatientSex;
  };
  visit?: { visit_type: VisitType };
};

export type Paginated<T> = {
  items: T[];
  page: number;
  page_size: number;
  total: number;
};

export type Payment = {
  id: string;
  invoice_id: string;
  receipt_number: string;
  amount: Money;
  currency: string;
  mode: PaymentMode;
  status: PaymentStatus;
  collected_by: string;
  collected_at: string;
  sensitivity: "critical";
};

export type Refund = {
  id: string;
  payment_id: string;
  refund_number: string;
  amount: Money;
  reason: string;
  approved_by: string;
  refunded_at: string;
};

export type CollectPaymentInput = {
  amount: Money | number;
  mode: PaymentMode;
  collected_by?: string;
};

export type CreateRefundInput = {
  amount: Money | number;
  reason: string;
  approved_by?: string;
};

export type PaymentWithRefunds = Payment & {
  refunds: Refund[];
};

export type InvoiceListFilters = {
  query?: string;
  status?: InvoiceStatus | "all";
  page?: number;
  page_size?: number;
};

export type AddInvoiceItemInput = {
  charge_category: ChargeCategory;
  description: string;
  quantity: number;
  unit_price: Money | number;
  reference_type?: string | null;
  reference_id?: string | null;
};

export type UpdateInvoiceDraftInput = {
  scheme_code?: string | null;
  discount_amount?: Money | number;
  scheme_adjustment?: Money | number;
  status?: InvoiceStatus;
};

export type InvoiceBalance = {
  net_amount: Money;
  paid_total: Money;
  refunded_total: Money;
  balance_due: Money;
};
