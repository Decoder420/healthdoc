export type BloodGroup =
  | "A+"
  | "A−"
  | "B+"
  | "B−"
  | "AB+"
  | "AB−"
  | "O+"
  | "O−";

export type BloodComponent =
  | "Whole Blood"
  | "Packed RBC"
  | "Platelets"
  | "FFP"
  | "Cryoprecipitate"
  | "Platelet Concentrate";

export type DonationSource =
  | "Voluntary Donor"
  | "Replacement Donor"
  | "Directed Donation"
  | "Autologous";

export type BloodUnit = {
  id: string;
  bloodGroup: BloodGroup;
  componentType: BloodComponent;
  bagId: string;
  collectionDate: string;
  expiryDate: string;
  source: DonationSource;
  storageLocation: string;
};

export const BLOOD_GROUPS: BloodGroup[] = [
  "A+",
  "A−",
  "B+",
  "B−",
  "AB+",
  "AB−",
  "O+",
  "O−",
];

export const INITIAL_BLOOD_UNITS: BloodUnit[] = [
  {
    id: "blood-1",
    bloodGroup: "O+",
    componentType: "Packed RBC",
    bagId: "BB-OP-260718-01",
    collectionDate: "2026-06-22",
    expiryDate: "2026-07-20",
    source: "Voluntary Donor",
    storageLocation: "Blood Bank / RBC Fridge 1",
  },
  {
    id: "blood-2",
    bloodGroup: "O+",
    componentType: "Packed RBC",
    bagId: "BB-OP-260718-02",
    collectionDate: "2026-07-02",
    expiryDate: "2026-08-06",
    source: "Replacement Donor",
    storageLocation: "Blood Bank / RBC Fridge 1",
  },
  {
    id: "blood-3",
    bloodGroup: "A+",
    componentType: "Whole Blood",
    bagId: "BB-AP-260716-03",
    collectionDate: "2026-06-28",
    expiryDate: "2026-08-02",
    source: "Directed Donation",
    storageLocation: "Blood Bank / WB Fridge 2",
  },
  {
    id: "blood-4",
    bloodGroup: "B−",
    componentType: "Platelets",
    bagId: "BB-BN-260715-04",
    collectionDate: "2026-07-14",
    expiryDate: "2026-07-19",
    source: "Voluntary Donor",
    storageLocation: "Blood Bank / Platelet Agitator",
  },
  {
    id: "blood-5",
    bloodGroup: "AB+",
    componentType: "FFP",
    bagId: "BB-ABP-260601-05",
    collectionDate: "2026-06-01",
    expiryDate: "2027-05-31",
    source: "Replacement Donor",
    storageLocation: "Blood Bank / Plasma Freezer 1",
  },
  {
    id: "blood-6",
    bloodGroup: "O−",
    componentType: "Cryoprecipitate",
    bagId: "BB-ON-260630-06",
    collectionDate: "2026-06-30",
    expiryDate: "2027-06-29",
    source: "Voluntary Donor",
    storageLocation: "Blood Bank / Plasma Freezer 2",
  },
  {
    id: "blood-7",
    bloodGroup: "A−",
    componentType: "Platelet Concentrate",
    bagId: "BB-AN-260709-07",
    collectionDate: "2026-07-09",
    expiryDate: "2026-07-14",
    source: "Autologous",
    storageLocation: "Quarantine / Expired Hold",
  },
  {
    id: "blood-8",
    bloodGroup: "B+",
    componentType: "Packed RBC",
    bagId: "BB-BP-260710-08",
    collectionDate: "2026-07-10",
    expiryDate: "2026-08-14",
    source: "Voluntary Donor",
    storageLocation: "Blood Bank / RBC Fridge 2",
  },
];

export function bloodDaysUntilExpiry(expiryDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(`${expiryDate}T00:00:00`);
  return Math.ceil((expiry.getTime() - today.getTime()) / 86_400_000);
}

export function sortBloodUnitsByFefo(units: BloodUnit[]): BloodUnit[] {
  return [...units].sort(
    (a, b) =>
      new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime(),
  );
}
