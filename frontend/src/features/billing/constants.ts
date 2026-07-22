import type {
  ChargeCategory,
  InvoiceStatus,
  PaymentMode,
  PaymentStatus,
  SchemeOptionCode,
} from "./types";

export const FACILITY_CODE = "HOSP1";
export const FACILITY_ID = "fac-0001";
export const FACILITY_DISPLAY_NAME = "HealthDoc Hospital (HOSP1)";

/** Mock user UUIDs for payments.collected_by / refunds.approved_by. */
export const MOCK_CASHIER_USER_ID = "00000000-0000-4000-8000-000000000101";
export const MOCK_SUPERVISOR_USER_ID = "00000000-0000-4000-8000-000000000102";

export const RECEIPT_PREFIX = "RCP";
export const REFUND_PREFIX = "RFD";

export const CHARGE_CATEGORY_LABELS: Record<ChargeCategory, string> = {
  registration: "Registration",
  consultation: "Consultation",
  lab: "Lab",
  radiology: "Radiology",
  pharmacy: "Pharmacy",
  procedure: "Procedure",
  ipd_stay: "IPD Stay",
  blood: "Blood Bank",
  other: "Other",
};

export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  draft: "Draft",
  issued: "Issued",
  partially_paid: "Partially Paid",
  paid: "Paid",
  waived: "Waived",
  cancelled: "Cancelled",
};

export const PAYMENT_MODE_LABELS: Record<PaymentMode, string> = {
  cash: "Cash",
  upi: "UPI",
  card: "Card",
  netbanking: "Net banking",
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  success: "Success",
  reversed: "Reversed",
};

export const SCHEME_OPTIONS: {
  code: SchemeOptionCode;
  label: string;
  scheme_code: string | null;
  description: string;
}[] = [
  {
    code: "SELF_PAY",
    label: "Self-pay / Cash",
    scheme_code: null,
    description: "Patient pays net amount in full",
  },
  {
    code: "PM-JAY",
    label: "PM-JAY",
    scheme_code: "PM-JAY",
    description: "Ayushman Bharat — scheme adjustment applied",
  },
  {
    code: "OTHER",
    label: "Other scheme",
    scheme_code: "OTHER",
    description: "Corporate / state / other coverage",
  },
];
