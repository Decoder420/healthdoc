export interface PatientInfo {
  patientName: string;
  uhid: string;
  doctor: string;
  visitType: "OPD" | "IPD" | "Emergency";
  prescriptionNumber: string;
}

export interface DispenseMedicine {
  id: string;
  medicineName: string;
  prescribedQty: number;
  batchNumber: string;
  expiryDate: string;
  availableStock: number;
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
