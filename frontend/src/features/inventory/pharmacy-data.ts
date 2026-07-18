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

export const INITIAL_PHARMACY_STOCK: PharmacyStock[] = [
  {
    id: "med-1",
    medicineName: "Augmentin",
    genericName: "Amoxicillin + Clavulanate",
    strength: "625 mg",
    form: "Tablet",
    batchNumber: "AUG-25031",
    expiryDate: "2026-08-12",
    quantity: 28,
    unit: "tablets",
    manufacturer: "GSK",
    purchaseRate: 14.5,
    issueRate: 18,
    storeLocation: "Pharmacy / Rack A-03",
    reorderLevel: 40,
  },
  {
    id: "med-2",
    medicineName: "Dolo 650",
    genericName: "Paracetamol",
    strength: "650 mg",
    form: "Tablet",
    batchNumber: "DOL-25118",
    expiryDate: "2027-03-30",
    quantity: 460,
    unit: "tablets",
    manufacturer: "Micro Labs",
    purchaseRate: 1.45,
    issueRate: 2.1,
    storeLocation: "Pharmacy / Rack B-01",
    reorderLevel: 100,
  },
  {
    id: "med-7",
    medicineName: "Dolo 650",
    genericName: "Paracetamol",
    strength: "650 mg",
    form: "Tablet",
    batchNumber: "DOL-25087",
    expiryDate: "2026-11-20",
    quantity: 80,
    unit: "tablets",
    manufacturer: "Micro Labs",
    purchaseRate: 1.4,
    issueRate: 2.1,
    storeLocation: "Pharmacy / Rack B-01",
    reorderLevel: 100,
  },
  {
    id: "med-3",
    medicineName: "Huminsulin 30/70",
    genericName: "Human Insulin",
    strength: "100 IU/ml",
    form: "Injection",
    batchNumber: "INS-24091",
    expiryDate: "2026-07-10",
    quantity: 12,
    unit: "vials",
    manufacturer: "Eli Lilly",
    purchaseRate: 465,
    issueRate: 510,
    storeLocation: "Cold Store / C-02",
    reorderLevel: 15,
  },
  {
    id: "med-4",
    medicineName: "Azithral",
    genericName: "Azithromycin",
    strength: "500 mg",
    form: "Tablet",
    batchNumber: "AZI-25072",
    expiryDate: "2026-09-02",
    quantity: 65,
    unit: "tablets",
    manufacturer: "Alembic",
    purchaseRate: 17,
    issueRate: 21,
    storeLocation: "Pharmacy / Rack A-07",
    reorderLevel: 30,
  },
  {
    id: "med-5",
    medicineName: "Normal Saline",
    genericName: "Sodium Chloride",
    strength: "0.9% / 500 ml",
    form: "Fluid",
    batchNumber: "NS-26014",
    expiryDate: "2028-01-18",
    quantity: 180,
    unit: "bottles",
    manufacturer: "Baxter",
    purchaseRate: 42,
    issueRate: 55,
    storeLocation: "Bulk Store / Bay 04",
    reorderLevel: 60,
  },
  {
    id: "med-6",
    medicineName: "Betadine",
    genericName: "Povidone Iodine",
    strength: "5%",
    form: "Ointment",
    batchNumber: "BET-25141",
    expiryDate: "2027-06-15",
    quantity: 34,
    unit: "tubes",
    manufacturer: "Win-Medicare",
    purchaseRate: 88,
    issueRate: 105,
    storeLocation: "Pharmacy / Rack C-05",
    reorderLevel: 20,
  },
];

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
