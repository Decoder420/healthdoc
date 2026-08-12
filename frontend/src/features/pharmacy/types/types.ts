export interface PatientInfo {
  patientName: string;
  uhid: string;
  doctor: string;
  visitType: "OPD" | "IPD" | "Emergency";
  prescriptionNumber: string;
}

export interface DispenseBatch {
  batchNumber: string;
  expiryDate: string;
  availableStock: number;
}

export interface DispenseMedicine {
  id: string;
  medicineName: string;
  prescribedQty: number;

  batchNumber: string;
  expiryDate: string;
  availableStock: number;

  batches: DispenseBatch[];

  dispenseQty: number;

  status: "Available" | "Partial" | "Out of Stock";
}

export interface DispenseHistoryItem {
  id: string;
  receiptNo: string;
  patientName: string;
  uhid: string;
  prescriptionNo: string;
  pharmacist: string;
  dispenseDate: string;
  medicines: number;
  status: "Downloaded" | "Printed" | "Reprinted";
}