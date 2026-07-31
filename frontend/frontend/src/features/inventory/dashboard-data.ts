export type DashboardKpi = {
  label: string;
  value: string;
  emphasis?: string;
};

export type TrendPoint = {
  month: string;
  inbound: number;
  outbound: number;
  closingStock: number;
};

export type LowStockSlice = {
  id: number;
  value: number;
  label: string;
};

export type RecentInventoryRow = {
  id: number;
  item: string;
  supplier: string;
  quantity: number;
  minimumStock: number;
  daysLeft: number;
  fefo: boolean;
};

export type ExpiryRow = {
  product: string;
  batch: string;
  expiry: string;
  quantity: number;
  department: string;
  daysLeft: number;
};

const SUPPLIERS = [
  "Baxter India",
  "GSK",
  "Cipla",
  "Sun Pharma",
  "Agfa Healthcare",
  "GE Healthcare",
  "Fujifilm",
  "Siemens Healthineers",
  "MedSupply Co",
  "Ethicon",
  "B. Braun",
  "BD India",
  "3M Medical",
  "Abbott",
  "Roche Diagnostics",
  "OrthoMed",
  "Dr Reddy's",
  "Pfizer India",
  "Alkem Labs",
  "Hospira",
];

const RECENT_ITEMS = [
  "X-Ray Film 14×17",
  "Contrast Media Omnipaque",
  "Laser Imaging Film",
  "Disposable Syringes 5 ml",
  "Surgical Gloves 7.5",
  "Normal Saline 500 ml",
  "IV Cannula 20G",
  "N95 Masks",
  "Paracetamol 650 mg",
  "Insulin 100 IU/ml",
  "Blood Collection Tubes",
  "ECG Electrodes",
  "Surgical Sutures Vicryl 2-0",
  "Oxygen Mask Adult",
  "Catheter Foley 16 Fr",
  "Gauze Rolls",
  "Betadine Solution 500 ml",
  "Examination Gloves M",
  "Alcohol Swabs",
  "Pulse Oximeter Probe",
  "Infusion Set",
  "Amoxicillin 625 mg",
  "CT Contrast Iohexol",
  "MRI Gadolinium",
  "Lead Apron Cover",
  "Ultrasound Gel 5L",
  "Lab Reagent CBC Pack",
  "Culture Plates",
  "Spinal Needle 25G",
  "Endotracheal Tube 7.5",
  "Nebulizer Kit",
  "Underpads XL",
  "Urine Bags",
  "Surgical Blade 15",
  "Sterile Drapes",
  "Bone Cement",
  "Hip Implant Stem",
  "OT Cap & Mask Kit",
  "Hand Sanitizer 5L",
  "Thermal Paper Rolls",
];

const EXPIRY_PRODUCTS = [
  "Paracetamol 650",
  "Human Insulin",
  "Glucose D50",
  "Vitamin C Injection",
  "Ceftriaxone 1g",
  "Omnipaque 350",
  "Gadolinium",
  "Normal Saline",
  "Ringer Lactate",
  "Heparin 5000 IU",
  "Adrenaline 1 mg",
  "Atropine 0.6 mg",
  "Morphine 10 mg",
  "Tramadol 50 mg",
  "Diclofenac Gel",
  "Azithromycin 500",
  "Metformin 500",
  "Amlodipine 5 mg",
  "Pantoprazole 40",
  "Ondansetron 4 mg",
  "X-Ray Developer",
  "Ultrasound Gel",
  "Blood Culture Bottles",
  "Rapid Malaria Kit",
  "HIV Test Kit",
  "Pregnancy Test Kit",
  "Surgical Glue",
  "Bone Wax",
  "Lidocaine 2%",
  "Bupivacaine 0.5%",
];

function addDays(base: Date, days: number) {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

function formatExpiryLabel(date: Date) {
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const MONTHS_24 = (() => {
  const labels: string[] = [];
  const now = new Date(2026, 6, 1); // Jul 2026
  for (let i = 23; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    labels.push(
      d.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
    );
  }
  return labels;
})();

/** 24-month inbound / outbound / closing stock series for trend charts. */
export const INVENTORY_TREND: TrendPoint[] = MONTHS_24.map((month, index) => {
  const inbound = 1800 + ((index * 97) % 900) + (index % 5) * 40;
  const outbound = 1500 + ((index * 73) % 850) + (index % 7) * 35;
  const closingStock = 4200 + index * 85 + ((index * 41) % 300);
  return { month, inbound, outbound, closingStock };
});

export const LOW_STOCK_BY_CATEGORY: LowStockSlice[] = [
  { id: 0, value: 42, label: "Medicines" },
  { id: 1, value: 28, label: "Consumables" },
  { id: 2, value: 19, label: "Surgical Supplies" },
  { id: 3, value: 15, label: "Laboratory" },
  { id: 4, value: 12, label: "Radiology" },
  { id: 5, value: 9, label: "PPE" },
  { id: 6, value: 7, label: "IV Fluids" },
  { id: 7, value: 6, label: "Equipment Parts" },
  { id: 8, value: 5, label: "OT Implants" },
  { id: 9, value: 4, label: "Ward Furniture" },
];

export const RECENT_INVENTORY: RecentInventoryRow[] = Array.from(
  { length: 48 },
  (_, index) => {
    const quantity = 8 + ((index * 17) % 420);
    const minimumStock = 20 + ((index * 11) % 120);
    const daysLeft = -12 + ((index * 13) % 220);
    return {
      id: index + 1,
      item: RECENT_ITEMS[index % RECENT_ITEMS.length],
      supplier: SUPPLIERS[index % SUPPLIERS.length],
      quantity,
      minimumStock,
      daysLeft,
      fefo: index % 5 !== 0,
    };
  },
);

export const EXPIRING_PRODUCTS: ExpiryRow[] = Array.from(
  { length: 36 },
  (_, index) => {
    const daysLeft = 2 + ((index * 7) % 55);
    const expiryDate = addDays(new Date(2026, 6, 30), daysLeft);
    const departments = [
      "Pharmacy",
      "Radiology",
      "Laboratory",
      "Emergency",
      "OT",
      "ICU",
      "Central Store",
    ];
    return {
      product: EXPIRY_PRODUCTS[index % EXPIRY_PRODUCTS.length],
      batch: `B${2400 + index}-${String.fromCharCode(65 + (index % 26))}`,
      expiry: formatExpiryLabel(expiryDate),
      quantity: 5 + ((index * 9) % 160),
      department: departments[index % departments.length],
      daysLeft,
    };
  },
);

const lowStockTotal = LOW_STOCK_BY_CATEGORY.reduce(
  (sum, slice) => sum + slice.value,
  0,
);

export const INVENTORY_DASHBOARD_KPIS: DashboardKpi[] = [
  { label: "Products", value: "2,486" },
  {
    label: "Low Stock",
    value: String(lowStockTotal),
    emphasis: "text-destructive",
  },
  { label: "Suppliers", value: "128" },
  { label: "Open Orders", value: "86" },
  {
    label: "Expiring (60d)",
    value: String(EXPIRING_PRODUCTS.length),
    emphasis: "text-amber-600",
  },
  { label: "Stock Value", value: "₹6.8M" },
];

export const INVENTORY_ALERT_SUMMARY = {
  criticalLowStock: RECENT_INVENTORY.filter(
    (row) => row.quantity < row.minimumStock * 0.4,
  ).length,
  expiredOrNegative: RECENT_INVENTORY.filter((row) => row.daysLeft < 0).length,
  nearExpiry: EXPIRING_PRODUCTS.filter((row) => row.daysLeft <= 15).length,
  fefoViolations: RECENT_INVENTORY.filter((row) => !row.fefo).length,
};
