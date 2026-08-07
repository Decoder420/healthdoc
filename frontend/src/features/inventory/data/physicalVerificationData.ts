import type {
  PhysicalVerificationItem,
} from "../types/physicalVerification";

const STORAGE_KEY =
  "hospital_physical_verifications";

export const physicalVerificationData: PhysicalVerificationItem[] = [
  {
    id: "PV-001",

    item_id: "ITEM-001",
    item_name: "Paracetamol 500mg",

    batch_id: "BATCH-001",

    system_quantity: 425,
    physical_quantity: 425,

    variance: 0,

    result: "Matched",

    status: "Completed",

    verified_by: "USR-005",
    verified_at: "2026-08-06T10:30:00",

    remarks: "Physical count matched system quantity.",

    created_at: "2026-08-06T10:00:00",
  },

  {
    id: "PV-002",

    item_id: "ITEM-002",
    item_name: "Amoxicillin 500mg",

    batch_id: "BATCH-002",

    system_quantity: 180,
    physical_quantity: 175,

    variance: -5,

    result: "Variance Found",

    status: "Completed",

    verified_by: "USR-005",
    verified_at: "2026-08-06T11:15:00",

    remarks: "Five units missing during physical count.",

    created_at: "2026-08-06T11:00:00",
  },

  {
    id: "PV-003",

    item_id: "ITEM-003",
    item_name: "Insulin",

    batch_id: "BATCH-003",

    system_quantity: 50,
    physical_quantity: null,

    variance: null,

    result: null,

    status: "Pending",

    verified_by: null,
    verified_at: null,

    remarks: null,

    created_at: "2026-08-07T09:00:00",
  },
];

export function getPhysicalVerifications(): PhysicalVerificationItem[] {
  if (typeof window === "undefined") {
    return physicalVerificationData;
  }

  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(physicalVerificationData)
    );

    return physicalVerificationData;
  }

  try {
    return JSON.parse(
      stored
    ) as PhysicalVerificationItem[];
  } catch {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(physicalVerificationData)
    );

    return physicalVerificationData;
  }
}

export function savePhysicalVerifications(
  verifications: PhysicalVerificationItem[]
) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(verifications)
  );
}

export function generatePhysicalVerificationId(): string {
  const verifications =
    getPhysicalVerifications();

  const nextNumber =
    verifications.reduce((max, verification) => {
      const number = Number(
        verification.id.replace("PV-", "")
      );

      return Number.isNaN(number)
        ? max
        : Math.max(max, number);
    }, 0) + 1;

  return `PV-${String(nextNumber).padStart(3, "0")}`;
}