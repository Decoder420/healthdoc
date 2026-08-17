import type { InvoiceWithItems, Payment, Refund } from "@/features/billing/types";
import {
  FACILITY_CODE,
  FACILITY_ID,
  MOCK_CASHIER_USER_ID,
  RECEIPT_PREFIX,
  REFUND_PREFIX,
} from "@/features/billing/constants";
import { recomputeInvoiceTotals, withLineAmount } from "@/features/billing/lib/calculations";
import { DEFAULT_CURRENCY, toMoney } from "@/features/billing/lib/money";

function stamp(iso: string) {
  return { created_at: iso, updated_at: iso };
}

function buildInvoice(
  partial: Omit<InvoiceWithItems, "gross_amount" | "net_amount" | "sensitivity"> & {
    items: InvoiceWithItems["items"];
  },
): InvoiceWithItems {
  const items = partial.items.map((item) => withLineAmount(item));
  const { gross_amount, net_amount } = recomputeInvoiceTotals(
    items,
    partial.discount_amount,
    partial.scheme_adjustment,
  );
  return {
    ...partial,
    items,
    discount_amount: toMoney(
      typeof partial.discount_amount === "number"
        ? partial.discount_amount
        : Number(partial.discount_amount.amount),
    ),
    scheme_adjustment: toMoney(
      typeof partial.scheme_adjustment === "number"
        ? partial.scheme_adjustment
        : Number(partial.scheme_adjustment.amount),
    ),
    gross_amount,
    net_amount,
    sensitivity: "critical",
  };
}

function item(
  id: string,
  invoice_id: string,
  charge_category: InvoiceWithItems["items"][0]["charge_category"],
  description: string,
  unit_price: number,
  opts: {
    quantity?: number;
    reference_type?: string | null;
    reference_id?: string | null;
  } = {},
): InvoiceWithItems["items"][0] {
  return withLineAmount({
    id,
    invoice_id,
    charge_category,
    reference_type: opts.reference_type ?? null,
    reference_id: opts.reference_id ?? null,
    description,
    quantity: opts.quantity ?? 1,
    unit_price: toMoney(unit_price),
  });
}

const t0 = "2026-07-20T08:00:00.000Z";
const t1 = "2026-07-20T09:30:00.000Z";
const t2 = "2026-07-19T11:00:00.000Z";

const INV1 = "10000000-0000-4000-8000-000000000001";
const INV2 = "10000000-0000-4000-8000-000000000002";
const INV3 = "10000000-0000-4000-8000-000000000003";
const INV4 = "10000000-0000-4000-8000-000000000004";

export const MOCK_INVOICES: InvoiceWithItems[] = [
  buildInvoice({
    id: INV1,
    invoice_number: `INV-${FACILITY_CODE}-20260720-00001`,
    visit_id: "20000000-0000-4000-8000-000000000001",
    patient_id: "30000000-0000-4000-8000-000000000001",
    facility_id: FACILITY_ID,
    status: "draft",
    discount_amount: toMoney(0),
    scheme_adjustment: toMoney(0),
    scheme_code: null,
    ...stamp(t0),
    patient: {
      uhid: "UHID-1001",
      full_name: "Ravi Kumar",
      age_years: 42,
      sex: "male",
    },
    visit: { visit_type: "opd" },
    items: [
      item("11000000-0000-4000-8000-000000000001", INV1, "registration", "OPD registration fee", 200),
      item("11000000-0000-4000-8000-000000000002", INV1, "consultation", "General medicine consultation", 500, {
        reference_type: "consultations",
        reference_id: "40000000-0000-4000-8000-000000000501",
      }),
      item("11000000-0000-4000-8000-000000000003", INV1, "lab", "Complete Blood Count (CBC)", 450, {
        reference_type: "lab_order_items",
        reference_id: "40000000-0000-4000-8000-000000000901",
      }),
    ],
  }),
  buildInvoice({
    id: INV2,
    invoice_number: `INV-${FACILITY_CODE}-20260720-00002`,
    visit_id: "20000000-0000-4000-8000-000000000002",
    patient_id: "30000000-0000-4000-8000-000000000002",
    facility_id: FACILITY_ID,
    status: "draft",
    discount_amount: toMoney(50),
    scheme_adjustment: toMoney(920),
    scheme_code: "PM-JAY",
    ...stamp(t1),
    patient: {
      uhid: "UHID-1002",
      full_name: "Sita Devi",
      age_years: 55,
      sex: "female",
    },
    visit: { visit_type: "opd" },
    items: [
      item("11000000-0000-4000-8000-000000000011", INV2, "registration", "OPD registration fee", 200),
      item("11000000-0000-4000-8000-000000000012", INV2, "radiology", "Chest X-Ray PA view", 800, {
        reference_type: "radiology_orders",
        reference_id: "40000000-0000-4000-8000-000000000301",
      }),
      item("11000000-0000-4000-8000-000000000013", INV2, "pharmacy", "Amoxicillin 250mg (strip)", 75, {
        quantity: 2,
        reference_type: "pharmacy_dispense",
        reference_id: "40000000-0000-4000-8000-000000000201",
      }),
    ],
  }),
  buildInvoice({
    id: INV3,
    invoice_number: `INV-${FACILITY_CODE}-20260719-00003`,
    visit_id: "20000000-0000-4000-8000-000000000003",
    patient_id: "30000000-0000-4000-8000-000000000003",
    facility_id: FACILITY_ID,
    status: "partially_paid",
    discount_amount: toMoney(0),
    scheme_adjustment: toMoney(0),
    scheme_code: null,
    ...stamp(t2),
    patient: {
      uhid: "UHID-1003",
      full_name: "Aman Singh",
      age_years: 31,
      sex: "male",
    },
    visit: { visit_type: "ipd" },
    payments: undefined,
    items: [
      item("11000000-0000-4000-8000-000000000021", INV3, "registration", "IPD registration fee", 500),
      item("11000000-0000-4000-8000-000000000022", INV3, "ipd_stay", "General ward bed charges (1 day)", 2500, {
        reference_type: "admissions",
        reference_id: "40000000-0000-4000-8000-000000000101",
      }),
      item("11000000-0000-4000-8000-000000000023", INV3, "procedure", "Wound dressing", 350),
    ],
  }),
  buildInvoice({
    id: INV4,
    invoice_number: `INV-${FACILITY_CODE}-20260720-00004`,
    visit_id: "20000000-0000-4000-8000-000000000004",
    patient_id: "30000000-0000-4000-8000-000000000004",
    facility_id: FACILITY_ID,
    status: "draft",
    discount_amount: toMoney(0),
    scheme_adjustment: toMoney(0),
    scheme_code: null,
    ...stamp(t1),
    patient: {
      uhid: "UHID-1004",
      full_name: "Neha Shah",
      age_years: 28,
      sex: "female",
    },
    visit: { visit_type: "opd" },
    items: [
      item("11000000-0000-4000-8000-000000000031", INV4, "registration", "OPD registration fee", 200),
      item("11000000-0000-4000-8000-000000000032", INV4, "consultation", "Gynecology consultation", 600, {
        reference_type: "consultations",
        reference_id: "40000000-0000-4000-8000-000000000502",
      }),
    ],
  }),
];

const SEED_PAYMENT: Payment = {
  id: "50000000-0000-4000-8000-000000000001",
  invoice_id: INV3,
  receipt_number: `RCP-${FACILITY_CODE}-20260719-00001`,
  amount: toMoney(1500),
  currency: DEFAULT_CURRENCY,
  mode: "upi",
  status: "success",
  collected_by: MOCK_CASHIER_USER_ID,
  collected_at: "2026-07-19T12:15:00.000Z",
  sensitivity: "critical",
};

/** In-memory store mutated by mock API (cloned on read). */
let store: InvoiceWithItems[] = structuredClone(MOCK_INVOICES);
let paymentStore: Payment[] = structuredClone([SEED_PAYMENT]);
let refundStore: Refund[] = [];

let receiptCounter = 2;
let refundCounter = 1;

export function getStore(): InvoiceWithItems[] {
  return store;
}

export function setStore(next: InvoiceWithItems[]) {
  store = next;
}

export function getPaymentStore(): Payment[] {
  return paymentStore;
}

export function setPaymentStore(next: Payment[]) {
  paymentStore = next;
}

export function getRefundStore(): Refund[] {
  return refundStore;
}

export function setRefundStore(next: Refund[]) {
  refundStore = next;
}

export function nextReceiptNumber(): string {
  const n = String(receiptCounter).padStart(5, "0");
  receiptCounter += 1;
  const day = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return `${RECEIPT_PREFIX}-${FACILITY_CODE}-${day}-${n}`;
}

export function nextRefundNumber(): string {
  const n = String(refundCounter).padStart(5, "0");
  refundCounter += 1;
  const day = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return `${REFUND_PREFIX}-${FACILITY_CODE}-${day}-${n}`;
}

export function resetStore() {
  store = structuredClone(MOCK_INVOICES);
  paymentStore = structuredClone([SEED_PAYMENT]);
  refundStore = [];
  receiptCounter = 2;
  refundCounter = 1;
}
