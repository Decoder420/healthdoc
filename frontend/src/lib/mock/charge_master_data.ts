/** Mock charge_master catalogue (migration 0033). Swap to live tariff API when B7 ships CRUD. */

import type { ChargeMaster } from "@/features/billing/types";
import { FACILITY_ID, MOCK_CASHIER_USER_ID } from "@/features/billing/constants";
import { toMoney } from "@/features/billing/lib/money";

const t = "2026-01-01T00:00:00.000Z";

function row(
  id: string,
  charge_code: string,
  description: string,
  charge_category: ChargeMaster["charge_category"],
  unit_price: number,
  scheme_code: string | null = null,
): ChargeMaster {
  return {
    id,
    facility_id: FACILITY_ID,
    charge_code,
    description,
    charge_category,
    unit_price: toMoney(unit_price),
    scheme_code,
    effective_from: "2026-01-01",
    effective_to: null,
    is_active: true,
    created_by: MOCK_CASHIER_USER_ID,
    updated_by: null,
    created_at: t,
    updated_at: t,
  };
}

export const MOCK_CHARGE_MASTER: ChargeMaster[] = [
  row("cm-reg-opd", "REG-OPD", "OPD registration fee", "registration", 200),
  row("cm-reg-ipd", "REG-IPD", "IPD registration fee", "registration", 500),
  row("cm-consult-gm", "CONS-GM", "General medicine consultation", "consultation", 500),
  row("cm-consult-gyn", "CONS-GYN", "Gynecology consultation", "consultation", 600),
  row("cm-lab-cbc", "LAB-CBC", "Complete Blood Count (CBC)", "lab", 450),
  row("cm-rad-cxr", "RAD-CXR", "Chest X-Ray PA view", "radiology", 800),
  row("cm-pharm-amox", "PHARM-AMOX250", "Amoxicillin 250mg (strip)", "pharmacy", 75),
  row("cm-ipd-bed-day", "IPD-BED-GEN", "General ward bed charges (1 day)", "ipd_stay", 2500),
  row("cm-proc-dressing", "PROC-DRESS", "Wound dressing", "procedure", 350),
  // Scheme-specific PM-JAY rate for CBC (wins when invoice.scheme_code = PM-JAY)
  row("cm-lab-cbc-pmjay", "LAB-CBC", "Complete Blood Count (CBC) — PM-JAY", "lab", 300, "PM-JAY"),
];

let chargeStore: ChargeMaster[] = structuredClone(MOCK_CHARGE_MASTER);

export function getChargeMasterStore(): ChargeMaster[] {
  return chargeStore;
}

export function setChargeMasterStore(next: ChargeMaster[]) {
  chargeStore = next;
}

export function resetChargeMasterStore() {
  chargeStore = structuredClone(MOCK_CHARGE_MASTER);
}

/** Resolve active tariff for (charge_code, scheme) as of a date. */
export function lookupChargeMaster(
  charge_code: string,
  scheme_code: string | null,
  asOf = "2026-07-20",
): ChargeMaster | null {
  const rows = chargeStore
    .filter(
      (r) =>
        r.is_active &&
        r.charge_code === charge_code &&
        r.effective_from <= asOf &&
        (r.effective_to === null || r.effective_to > asOf),
    )
    .sort((a, b) => b.effective_from.localeCompare(a.effective_from));

  if (scheme_code) {
    const schemeHit = rows.find((r) => r.scheme_code === scheme_code);
    if (schemeHit) return schemeHit;
  }
  return rows.find((r) => r.scheme_code === null) ?? null;
}
