import type { InvoiceWithItems, Payment, PmjayEligibilityStatus, Refund } from "../../types";
import { FACILITY_CODE, FACILITY_ID, RECEIPT_PREFIX, REFUND_PREFIX } from "../../constants";
import { recomputeInvoiceTotals, withLineAmount } from "../calculations";

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
    gross_amount,
    net_amount,
    sensitivity: "critical",
  };
}

const t0 = "2026-07-20T08:00:00.000Z";
const t1 = "2026-07-20T09:30:00.000Z";
const t2 = "2026-07-19T11:00:00.000Z";

export const MOCK_INVOICES: InvoiceWithItems[] = [
  buildInvoice({
    id: "inv-001",
    invoice_number: "INV-HOSP1-20260720-00001",
    visit_id: "vis-1001",
    patient_id: "pat-1001",
    facility_id: FACILITY_ID,
    status: "draft",
    discount_amount: 0,
    scheme_adjustment: 0,
    scheme_code: null,
    ...stamp(t0),
    patient: { uhid: "UHID-1001", name: "Ravi Kumar", age: 42, gender: "Male" },
    visit: { visit_type: "OPD" },
    items: [
      {
        id: "item-001a",
        invoice_id: "inv-001",
        charge_category: "registration",
        reference_type: null,
        reference_id: null,
        description: "OPD registration fee",
        quantity: 1,
        unit_price: 200,
        amount: 200,
      },
      {
        id: "item-001b",
        invoice_id: "inv-001",
        charge_category: "consultation",
        reference_type: "consultations",
        reference_id: "con-501",
        description: "General medicine consultation",
        quantity: 1,
        unit_price: 500,
        amount: 500,
      },
      {
        id: "item-001c",
        invoice_id: "inv-001",
        charge_category: "lab",
        reference_type: "lab_order_items",
        reference_id: "loi-901",
        description: "Complete Blood Count (CBC)",
        quantity: 1,
        unit_price: 450,
        amount: 450,
      },
    ],
  }),
  buildInvoice({
    id: "inv-002",
    invoice_number: "INV-HOSP1-20260720-00002",
    visit_id: "vis-1002",
    patient_id: "pat-1002",
    facility_id: FACILITY_ID,
    status: "draft",
    discount_amount: 50,
    scheme_adjustment: 920,
    scheme_code: "PM-JAY",
    ...stamp(t1),
    patient: { uhid: "UHID-1002", name: "Sita Devi", age: 55, gender: "Female" },
    visit: { visit_type: "OPD" },
    items: [
      {
        id: "item-002a",
        invoice_id: "inv-002",
        charge_category: "registration",
        reference_type: null,
        reference_id: null,
        description: "OPD registration fee",
        quantity: 1,
        unit_price: 200,
        amount: 200,
      },
      {
        id: "item-002b",
        invoice_id: "inv-002",
        charge_category: "radiology",
        reference_type: "radiology_orders",
        reference_id: "rad-301",
        description: "Chest X-Ray PA view",
        quantity: 1,
        unit_price: 800,
        amount: 800,
      },
      {
        id: "item-002c",
        invoice_id: "inv-002",
        charge_category: "pharmacy",
        reference_type: "pharmacy_dispense",
        reference_id: "ph-201",
        description: "Amoxicillin 250mg (strip)",
        quantity: 2,
        unit_price: 75,
        amount: 150,
      },
    ],
  }),
  buildInvoice({
    id: "inv-003",
    invoice_number: "INV-HOSP1-20260719-00003",
    visit_id: "vis-1003",
    patient_id: "pat-1003",
    facility_id: FACILITY_ID,
    status: "partially_paid",
    discount_amount: 0,
    scheme_adjustment: 0,
    scheme_code: null,
    ...stamp(t2),
    patient: { uhid: "UHID-1003", name: "Aman Singh", age: 31, gender: "Male" },
    visit: { visit_type: "IPD" },
    payments: undefined,
    items: [
      {
        id: "item-003a",
        invoice_id: "inv-003",
        charge_category: "registration",
        reference_type: null,
        reference_id: null,
        description: "IPD registration fee",
        quantity: 1,
        unit_price: 500,
        amount: 500,
      },
      {
        id: "item-003b",
        invoice_id: "inv-003",
        charge_category: "ipd_stay",
        reference_type: "admissions",
        reference_id: "adm-101",
        description: "General ward bed charges (1 day)",
        quantity: 1,
        unit_price: 2500,
        amount: 2500,
      },
      {
        id: "item-003c",
        invoice_id: "inv-003",
        charge_category: "procedure",
        reference_type: null,
        reference_id: null,
        description: "Wound dressing",
        quantity: 1,
        unit_price: 350,
        amount: 350,
      },
    ],
  }),
  buildInvoice({
    id: "inv-004",
    invoice_number: "INV-HOSP1-20260720-00004",
    visit_id: "vis-1004",
    patient_id: "pat-1004",
    facility_id: FACILITY_ID,
    status: "draft",
    discount_amount: 0,
    scheme_adjustment: 0,
    scheme_code: null,
    ...stamp(t1),
    patient: { uhid: "UHID-1004", name: "Neha Shah", age: 28, gender: "Female" },
    visit: { visit_type: "OPD" },
    items: [
      {
        id: "item-004a",
        invoice_id: "inv-004",
        charge_category: "registration",
        reference_type: null,
        reference_id: null,
        description: "OPD registration fee",
        quantity: 1,
        unit_price: 200,
        amount: 200,
      },
      {
        id: "item-004b",
        invoice_id: "inv-004",
        charge_category: "consultation",
        reference_type: "consultations",
        reference_id: "con-502",
        description: "Gynecology consultation",
        quantity: 1,
        unit_price: 600,
        amount: 600,
      },
    ],
  }),
];

/** Stub PM-JAY eligibility by UHID */
export const PMJAY_ELIGIBILITY: Record<string, PmjayEligibilityStatus> = {
  "UHID-1001": "unknown",
  "UHID-1002": "eligible",
  "UHID-1003": "ineligible",
  "UHID-1004": "eligible",
};

/** In-memory store mutated by mock API (cloned on read). */
let store: InvoiceWithItems[] = structuredClone(MOCK_INVOICES);

let paymentStore: Payment[] = [
  {
    id: "pay-001",
    invoice_id: "inv-003",
    receipt_number: "RCP-HOSP1-20260719-00001",
    amount: 1500,
    mode: "upi",
    status: "success",
    collected_by: "cashier.dev",
    collected_at: "2026-07-19T12:15:00.000Z",
    reference_txn_id: "UPI-TXN-88421",
    notes: "Partial collection at discharge desk",
  },
];

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
  paymentStore = structuredClone([
    {
      id: "pay-001",
      invoice_id: "inv-003",
      receipt_number: "RCP-HOSP1-20260719-00001",
      amount: 1500,
      mode: "upi" as const,
      status: "success" as const,
      collected_by: "cashier.dev",
      collected_at: "2026-07-19T12:15:00.000Z",
      reference_txn_id: "UPI-TXN-88421",
      notes: "Partial collection at discharge desk",
    },
  ]);
  refundStore = [];
  receiptCounter = 2;
  refundCounter = 1;
}

