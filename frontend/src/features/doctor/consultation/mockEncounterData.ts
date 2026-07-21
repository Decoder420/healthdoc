/**
 * MOCK DATA — swap for real endpoints once confirmed:
 *  - ICD-10 search: ask dev-b3 (endpoint doesn't exist in docs yet)
 *  - SOAP/vitals save shape: ask dev-b3 (Mongo clinical_notes shape unconfirmed)
 *  - Lab/radiology test catalog: not documented yet, ask when you get there
 */

export interface IcdCode {
  code: string;
  version: "icd10" | "icd11";
  label: string;
}

export const mockIcdCodes: IcdCode[] = [
  { code: "J06.9", version: "icd10", label: "Acute upper respiratory infection" },
  { code: "I10", version: "icd10", label: "Essential (primary) hypertension" },
  { code: "E11.9", version: "icd10", label: "Type 2 diabetes mellitus, without complications" },
  { code: "K21.9", version: "icd10", label: "Gastro-oesophageal reflux disease" },
  { code: "R51", version: "icd10", label: "Headache" },
  { code: "J45.909", version: "icd10", label: "Unspecified asthma, uncomplicated" },
  { code: "M54.5", version: "icd10", label: "Low back pain" },
  { code: "B34.9", version: "icd10", label: "Viral infection, unspecified" },
];

export interface CatalogItem {
  id: string;
  name: string;
}

export const mockLabTests: CatalogItem[] = [
  { id: "lt1", name: "Complete Blood Count (CBC)" },
  { id: "lt2", name: "Fasting Blood Sugar" },
  { id: "lt3", name: "Liver Function Test" },
  { id: "lt4", name: "Kidney Function Test" },
  { id: "lt5", name: "Thyroid Profile (T3, T4, TSH)" },
];

export const mockRadiologyTests: CatalogItem[] = [
  { id: "rt1", name: "Chest X-Ray (PA view)" },
  { id: "rt2", name: "Ultrasound Abdomen" },
  { id: "rt3", name: "CT Scan — Head (plain)" },
];

export const mockProcedures: CatalogItem[] = [
  { id: "pr1", name: "Wound Dressing" },
  { id: "pr2", name: "IV Cannulation" },
  { id: "pr3", name: "Nebulization" },
];

export type OrderType = "lab" | "radiology" | "procedure";
export type OrderPriority = "routine" | "urgent" | "stat";

export interface DraftOrder {
  id: string;
  encounter_id: string;
  order_type: OrderType;
  item_name: string;
  priority: OrderPriority;
  notes?: string;
}