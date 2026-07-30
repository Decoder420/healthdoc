import type { InventoryItem } from "@/types/inventory";

export type RadiologyLowStock = {
  item: string;
  current: number;
  minimum: number;
  priority: "High" | "Medium" | "Low";
};

export type RadiologyExpiring = {
  item: string;
  batch: string;
  expiry: string;
  quantity: number;
  daysLeft: number;
};

export type RadiologyPurchaseOrder = {
  po: string;
  supplier: string;
  item: string;
  amount: string;
  status: "Pending" | "Approved" | "Delivered" | "Partially Received";
};

export type RadiologyVendor = {
  name: string;
  onTimePercent: number;
  qualityScore: number;
  openPos: number;
  category: string;
};

export type RadiologyMachine = {
  id: string;
  name: string;
  modality: string;
  status: "Online" | "Offline" | "Maintenance" | "Calibration";
  utilization: number;
  nextService: string;
};

export type RadiologyTechnician = {
  id: string;
  name: string;
  shift: string;
  modality: string;
  assignedMachine: string;
  casesToday: number;
};

const FILM_ITEMS = [
  "X-Ray Film 14×17",
  "X-Ray Film 10×12",
  "Laser Film Blue Base",
  "Dry Imaging Film",
  "Mammography Film",
];

const CONTRAST_ITEMS = [
  "Iohexol 350",
  "Iopamidol 370",
  "Gadolinium Gadovist",
  "Barium Sulfate",
  "Omnipaque 300",
];

const CONSUMABLES = [
  "IV Cannula 18G",
  "IV Cannula 20G",
  "Lead Gloves",
  "Lead Apron Covers",
  "Ultrasound Gel 5L",
  "ECG Electrodes",
  "Biopsy Needles",
  "Sterile Drapes Rad",
  "Injector Syringes",
  "Pressure Tubing",
];

const SUPPLIERS = [
  "Siemens Healthineers",
  "Fujifilm",
  "GE Healthcare",
  "Agfa Healthcare",
  "Carestream",
  "Bayer Radiology",
  "Bracco Imaging",
  "MedSupply Imaging",
];

function datePlus(days: number) {
  const d = new Date(2026, 6, 30);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Seed stock for radiology inventory table / search / add flows. */
export const INITIAL_RADIOLOGY_INVENTORY: InventoryItem[] = Array.from(
  { length: 56 },
  (_, index) => {
    const pools = [FILM_ITEMS, CONTRAST_ITEMS, CONSUMABLES];
    const pool = pools[index % pools.length];
    const itemName = pool[index % pool.length];
    const quantity = 4 + ((index * 19) % 280);
    const minimumStock = 20 + ((index * 7) % 80);
    return {
      id: index + 1,
      itemName: `${itemName} · Lot ${index + 1}`,
      category:
        index % 3 === 0 ? "Film" : index % 3 === 1 ? "Contrast" : "Consumable",
      brand: SUPPLIERS[index % SUPPLIERS.length].split(" ")[0],
      supplier: SUPPLIERS[index % SUPPLIERS.length],
      quantity,
      unit: index % 3 === 0 ? "sheets" : index % 3 === 1 ? "vials" : "pieces",
      minimumStock,
      reorderLevel: minimumStock + 10,
      batchNumber: `RAD-${2600 + index}-${String.fromCharCode(65 + (index % 12))}`,
      expiryDate: datePlus(10 + ((index * 11) % 400)),
    };
  },
);

export const RADIOLOGY_DASHBOARD_CARDS = [
  { title: "Total Items", value: String(INITIAL_RADIOLOGY_INVENTORY.length) },
  {
    title: "Low Stock",
    value: String(
      INITIAL_RADIOLOGY_INVENTORY.filter((i) => i.quantity < i.minimumStock)
        .length,
    ),
  },
  { title: "Machines", value: "14 / 16" },
  { title: "Technicians", value: "22" },
  { title: "Pending Orders", value: "11" },
  {
    title: "Expiring Items",
    value: String(
      INITIAL_RADIOLOGY_INVENTORY.filter((i) => {
        const days =
          (new Date(i.expiryDate).getTime() - new Date("2026-07-30").getTime()) /
          86_400_000;
        return days <= 45;
      }).length,
    ),
  },
];

export const RADIOLOGY_LOW_STOCK: RadiologyLowStock[] = INITIAL_RADIOLOGY_INVENTORY
  .filter((item) => item.quantity < item.minimumStock)
  .slice(0, 18)
  .map((item, index) => ({
    item: item.itemName,
    current: item.quantity,
    minimum: item.minimumStock,
    priority: (index % 3 === 0
      ? "High"
      : index % 3 === 1
        ? "Medium"
        : "Low") as RadiologyLowStock["priority"],
  }));

export const RADIOLOGY_EXPIRING: RadiologyExpiring[] = INITIAL_RADIOLOGY_INVENTORY
  .map((item) => {
    const daysLeft = Math.ceil(
      (new Date(item.expiryDate).getTime() - new Date("2026-07-30").getTime()) /
        86_400_000,
    );
    return {
      item: item.itemName,
      batch: item.batchNumber,
      expiry: item.expiryDate,
      quantity: item.quantity,
      daysLeft,
    };
  })
  .filter((row) => row.daysLeft <= 60)
  .sort((a, b) => a.daysLeft - b.daysLeft)
  .slice(0, 20);

export const RADIOLOGY_PURCHASE_ORDERS: RadiologyPurchaseOrder[] = Array.from(
  { length: 16 },
  (_, index) => {
    const statuses: RadiologyPurchaseOrder["status"][] = [
      "Pending",
      "Approved",
      "Delivered",
      "Partially Received",
    ];
    const amounts = [
      "₹48,000",
      "₹82,000",
      "₹1,45,000",
      "₹2,10,000",
      "₹67,500",
      "₹3,25,000",
    ];
    return {
      po: `PO-RAD-${1100 + index}`,
      supplier: SUPPLIERS[index % SUPPLIERS.length],
      item: [...FILM_ITEMS, ...CONTRAST_ITEMS, ...CONSUMABLES][
        index % (FILM_ITEMS.length + CONTRAST_ITEMS.length + CONSUMABLES.length)
      ],
      amount: amounts[index % amounts.length],
      status: statuses[index % statuses.length],
    };
  },
);

export const RADIOLOGY_VENDORS: RadiologyVendor[] = SUPPLIERS.map(
  (name, index) => ({
    name,
    onTimePercent: 78 + ((index * 5) % 20),
    qualityScore: 3.6 + (index % 5) * 0.25,
    openPos: (index * 3) % 7,
    category: index % 2 === 0 ? "Imaging Consumables" : "Equipment & Service",
  }),
);

export const RADIOLOGY_MACHINES: RadiologyMachine[] = [
  "CT-01",
  "CT-02",
  "MRI-01",
  "MRI-02",
  "XR-01",
  "XR-02",
  "XR-03",
  "USG-01",
  "USG-02",
  "USG-03",
  "MAMMO-01",
  "ECG-01",
  "ECG-02",
  "FLUORO-01",
  "DXA-01",
  "PET-CT-01",
].map((name, index) => {
  const statuses: RadiologyMachine["status"][] = [
    "Online",
    "Online",
    "Online",
    "Maintenance",
    "Calibration",
    "Offline",
  ];
  return {
    id: `mach-${index + 1}`,
    name,
    modality: name.split("-")[0],
    status: statuses[index % statuses.length],
    utilization: 35 + ((index * 17) % 60),
    nextService: datePlus(5 + index * 9),
  };
});

export const RADIOLOGY_TECHNICIANS: RadiologyTechnician[] = Array.from(
  { length: 22 },
  (_, index) => {
    const names = [
      "Ananya Rao",
      "Vikram Shah",
      "Neha Kulkarni",
      "Rohit Das",
      "Priya Nair",
      "Amit Verma",
      "Sonal Mehta",
      "Karan Joshi",
      "Divya Iyer",
      "Suresh Patil",
      "Meera Kapoor",
      "Arjun Sen",
    ];
    const modalities = ["CT", "MRI", "XRAY", "USG", "MAMMO", "ECG"];
    const machine = RADIOLOGY_MACHINES[index % RADIOLOGY_MACHINES.length];
    return {
      id: `tech-${index + 1}`,
      name: names[index % names.length],
      shift: index % 3 === 0 ? "Morning" : index % 3 === 1 ? "Evening" : "Night",
      modality: modalities[index % modalities.length],
      assignedMachine: machine.name,
      casesToday: 4 + ((index * 3) % 18),
    };
  },
);

export const RADIOLOGY_FILM_STOCK = [
  { label: "14×17", value: 420 },
  { label: "10×12", value: 310 },
  { label: "8×10", value: 190 },
  { label: "Laser", value: 260 },
  { label: "Mammo", value: 95 },
  { label: "Dry View", value: 175 },
];

export const RADIOLOGY_CONTRAST_STOCK = [
  { label: "Iohexol", value: 148 },
  { label: "Iopamidol", value: 96 },
  { label: "Gadolinium", value: 62 },
  { label: "Barium", value: 84 },
  { label: "Omnipaque", value: 110 },
  { label: "Visipaque", value: 54 },
];

export const RADIOLOGY_CONSUMABLE_STATUS = [
  { label: "Cannulas", available: 220, low: 40 },
  { label: "Syringes", available: 180, low: 50 },
  { label: "Gloves", available: 90, low: 60 },
  { label: "Gel", available: 70, low: 30 },
  { label: "Drapes", available: 140, low: 45 },
  { label: "Needles", available: 55, low: 40 },
  { label: "Tubing", available: 48, low: 35 },
  { label: "Electrodes", available: 200, low: 80 },
];
