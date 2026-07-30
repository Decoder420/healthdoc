export type MedicineForm =
  | "Tablet"
  | "Capsule"
  | "Injection"
  | "Syrup"
  | "Ointment"
  | "Fluid";

export type PharmacyStock = {
  id: string;
  medicineName: string;
  genericName: string;
  strength: string;
  form: MedicineForm;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  unit: string;
  manufacturer: string;
  purchaseRate: number;
  issueRate: number;
  storeLocation: string;
  reorderLevel: number;
};

export type StockAudit = {
  id: string;
  batchNumber: string;
  medicineName: string;
  action: "Dispense" | "Return" | "Correction";
  quantityChange: number;
  reason: string;
  destination?: "Main Store" | "Ward" | "Emergency";
  performedAt: string;
  performedBy: string;
};

const SEED_MEDICINES: Array<{
  medicineName: string;
  genericName: string;
  strength: string;
  form: MedicineForm;
  unit: string;
  manufacturer: string;
  purchaseRate: number;
  issueRate: number;
  reorderLevel: number;
}> = [
  {
    medicineName: "Augmentin",
    genericName: "Amoxicillin + Clavulanate",
    strength: "625 mg",
    form: "Tablet",
    unit: "tablets",
    manufacturer: "GSK",
    purchaseRate: 14.5,
    issueRate: 18,
    reorderLevel: 40,
  },
  {
    medicineName: "Dolo 650",
    genericName: "Paracetamol",
    strength: "650 mg",
    form: "Tablet",
    unit: "tablets",
    manufacturer: "Micro Labs",
    purchaseRate: 1.45,
    issueRate: 2.1,
    reorderLevel: 100,
  },
  {
    medicineName: "Huminsulin 30/70",
    genericName: "Human Insulin",
    strength: "100 IU/ml",
    form: "Injection",
    unit: "vials",
    manufacturer: "Eli Lilly",
    purchaseRate: 465,
    issueRate: 510,
    reorderLevel: 15,
  },
  {
    medicineName: "Azithral",
    genericName: "Azithromycin",
    strength: "500 mg",
    form: "Tablet",
    unit: "tablets",
    manufacturer: "Alembic",
    purchaseRate: 17,
    issueRate: 21,
    reorderLevel: 30,
  },
  {
    medicineName: "Normal Saline",
    genericName: "Sodium Chloride",
    strength: "0.9% / 500 ml",
    form: "Fluid",
    unit: "bottles",
    manufacturer: "Baxter",
    purchaseRate: 42,
    issueRate: 55,
    reorderLevel: 60,
  },
  {
    medicineName: "Betadine",
    genericName: "Povidone Iodine",
    strength: "5%",
    form: "Ointment",
    unit: "tubes",
    manufacturer: "Win-Medicare",
    purchaseRate: 88,
    issueRate: 105,
    reorderLevel: 20,
  },
  {
    medicineName: "Ceftriaxone",
    genericName: "Ceftriaxone Sodium",
    strength: "1 g",
    form: "Injection",
    unit: "vials",
    manufacturer: "Roche",
    purchaseRate: 62,
    issueRate: 78,
    reorderLevel: 25,
  },
  {
    medicineName: "Pantocid",
    genericName: "Pantoprazole",
    strength: "40 mg",
    form: "Tablet",
    unit: "tablets",
    manufacturer: "Sun Pharma",
    purchaseRate: 6.5,
    issueRate: 9,
    reorderLevel: 50,
  },
  {
    medicineName: "Ondem",
    genericName: "Ondansetron",
    strength: "4 mg",
    form: "Tablet",
    unit: "tablets",
    manufacturer: "Alkem",
    purchaseRate: 5.2,
    issueRate: 7.5,
    reorderLevel: 40,
  },
  {
    medicineName: "Metrogyl",
    genericName: "Metronidazole",
    strength: "400 mg",
    form: "Tablet",
    unit: "tablets",
    manufacturer: "J&J",
    purchaseRate: 2.8,
    issueRate: 4.2,
    reorderLevel: 60,
  },
  {
    medicineName: "Ascoril",
    genericName: "Ambroxol + Guaifenesin",
    strength: "100 ml",
    form: "Syrup",
    unit: "bottles",
    manufacturer: "Glenmark",
    purchaseRate: 95,
    issueRate: 120,
    reorderLevel: 20,
  },
  {
    medicineName: "Heparin",
    genericName: "Heparin Sodium",
    strength: "5000 IU/ml",
    form: "Injection",
    unit: "vials",
    manufacturer: "Gland Pharma",
    purchaseRate: 48,
    issueRate: 62,
    reorderLevel: 18,
  },
  {
    medicineName: "Adrenaline",
    genericName: "Epinephrine",
    strength: "1 mg/ml",
    form: "Injection",
    unit: "amps",
    manufacturer: "Neon",
    purchaseRate: 18,
    issueRate: 25,
    reorderLevel: 30,
  },
  {
    medicineName: "Tramadol",
    genericName: "Tramadol HCl",
    strength: "50 mg",
    form: "Capsule",
    unit: "capsules",
    manufacturer: "Abbott",
    purchaseRate: 4.5,
    issueRate: 6.5,
    reorderLevel: 40,
  },
  {
    medicineName: "RL Infusion",
    genericName: "Ringer Lactate",
    strength: "500 ml",
    form: "Fluid",
    unit: "bottles",
    manufacturer: "Fresenius",
    purchaseRate: 38,
    issueRate: 50,
    reorderLevel: 80,
  },
];

const LOCATIONS = [
  "Pharmacy / Rack A-03",
  "Pharmacy / Rack B-01",
  "Pharmacy / Rack A-07",
  "Pharmacy / Rack C-05",
  "Cold Store / C-02",
  "Bulk Store / Bay 04",
  "Emergency Pharmacy / E-01",
  "OT Pharmacy / OT-P2",
];

function expiryOffset(daysFromBase: number) {
  const d = new Date(2026, 6, 30);
  d.setDate(d.getDate() + daysFromBase);
  return d.toISOString().slice(0, 10);
}

/** Multi-batch pharmacy stock (~45 rows) covering low/near-expiry/healthy cases. */
export const INITIAL_PHARMACY_STOCK: PharmacyStock[] = SEED_MEDICINES.flatMap(
  (med, medIndex) => {
    const batchCount = medIndex % 3 === 0 ? 4 : 3;
    return Array.from({ length: batchCount }, (_, batchIndex) => {
      const qtyOptions = [0, 6, 12, 28, 45, 80, 160, 320, 18, 3];
      const quantity =
        qtyOptions[(medIndex * 3 + batchIndex) % qtyOptions.length];
      return {
        id: `med-${medIndex + 1}-${batchIndex + 1}`,
        medicineName: med.medicineName,
        genericName: med.genericName,
        strength: med.strength,
        form: med.form,
        batchNumber: `${med.medicineName.slice(0, 3).toUpperCase()}-${25000 + medIndex * 10 + batchIndex}`,
        expiryDate: expiryOffset(-5 + medIndex * 8 + batchIndex * 21),
        quantity,
        unit: med.unit,
        manufacturer: med.manufacturer,
        purchaseRate: med.purchaseRate,
        issueRate: med.issueRate,
        storeLocation: LOCATIONS[(medIndex + batchIndex) % LOCATIONS.length],
        reorderLevel: med.reorderLevel,
      } satisfies PharmacyStock;
    });
  },
);

export const INITIAL_PHARMACY_AUDITS: StockAudit[] = Array.from(
  { length: 30 },
  (_, index) => {
    const stock = INITIAL_PHARMACY_STOCK[index % INITIAL_PHARMACY_STOCK.length];
    const actions: StockAudit["action"][] = ["Dispense", "Return", "Correction"];
    const action = actions[index % actions.length];
    return {
      id: `audit-${index + 1}`,
      batchNumber: stock.batchNumber,
      medicineName: stock.medicineName,
      action,
      quantityChange:
        action === "Dispense"
          ? -(2 + (index % 12))
          : action === "Return"
            ? 1 + (index % 6)
            : index % 2 === 0
              ? 2
              : -2,
      reason:
        action === "Dispense"
          ? "Ward issue against indent"
          : action === "Return"
            ? "Unused sealed return"
            : "Physical stock reconciliation",
      destination:
        action === "Dispense"
          ? (["Ward", "Emergency", "Main Store"] as const)[index % 3]
          : undefined,
      performedAt: new Date(
        Date.UTC(2026, 6, 30 - (index % 20), 8 + (index % 10), (index * 7) % 60),
      ).toISOString(),
      performedBy: ["Pharmacist", "Store Officer", "Inventory Manager"][
        index % 3
      ],
    };
  },
);

export function daysUntilExpiry(expiryDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(`${expiryDate}T00:00:00`);
  return Math.ceil((expiry.getTime() - today.getTime()) / 86_400_000);
}

export function sortByFefo(items: PharmacyStock[]): PharmacyStock[] {
  return [...items].sort(
    (a, b) =>
      new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime(),
  );
}
