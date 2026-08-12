import type {
  PatientInfo,
  DispenseMedicine,
} from "@/features/pharmacy/types/types";

export const patient: PatientInfo = {
  patientName: "Rahul Sharma",
  uhid: "UHID-100245",
  doctor: "Dr. Amit Verma",
  visitType: "OPD",
  prescriptionNumber: "RX-20260001",
};

/*
 * This is now only used as receipt/mock fallback data.
 *
 * The actual dispensing screen uses:
 *
 * prescriptionData.ts
 *
 * and FEFO-selected medicines.
 */
export const medicines: DispenseMedicine[] = [
  {
    id: "1",
    medicineName: "Paracetamol 500 mg",
    prescribedQty: 10,

    batchNumber: "PAR230018",
    expiryDate: "20 Sep 2026",
    availableStock: 25,

    batches: [
      {
        batchNumber: "PAR230018",
        expiryDate: "20 Sep 2026",
        availableStock: 25,
      },
      {
        batchNumber: "PAR240001",
        expiryDate: "12 Dec 2026",
        availableStock: 120,
      },
      {
        batchNumber: "PAR250002",
        expiryDate: "15 Jan 2027",
        availableStock: 80,
      },
    ],

    dispenseQty: 10,
    status: "Available",
  },

  {
    id: "2",
    medicineName: "Amoxicillin 250 mg",
    prescribedQty: 15,

    batchNumber: "AMX240008",
    expiryDate: "20 Aug 2026",
    availableStock: 5,

    batches: [
      {
        batchNumber: "AMX240008",
        expiryDate: "20 Aug 2026",
        availableStock: 5,
      },
      {
        batchNumber: "AMX250001",
        expiryDate: "15 Feb 2027",
        availableStock: 40,
      },
    ],

    dispenseQty: 5,
    status: "Partial",
  },

  {
    id: "3",
    medicineName: "Insulin Injection",
    prescribedQty: 2,

    batchNumber: "",
    expiryDate: "",
    availableStock: 0,

    batches: [],

    dispenseQty: 0,
    status: "Out of Stock",
  },

  {
    id: "4",
    medicineName: "Pantoprazole 40 mg",
    prescribedQty: 30,

    batchNumber: "PAN240003",
    expiryDate: "14 Jan 2027",
    availableStock: 85,

    batches: [
      {
        batchNumber: "PAN240003",
        expiryDate: "14 Jan 2027",
        availableStock: 85,
      },
    ],

    dispenseQty: 30,
    status: "Available",
  },

  {
    id: "5",
    medicineName: "Vitamin D3",
    prescribedQty: 10,

    batchNumber: "VIT240012",
    expiryDate: "08 Nov 2026",
    availableStock: 10,

    batches: [
      {
        batchNumber: "VIT240012",
        expiryDate: "08 Nov 2026",
        availableStock: 10,
      },
    ],

    dispenseQty: 10,
    status: "Available",
  },
];

/*
 * Receipt data.
 *
 * Later this will be generated dynamically
 * from the actual confirmed dispense transaction.
 */
export const dispenseReceiptData = {
  receiptNo: "DSP-20260722-001",

  patient,

  medicines: medicines.filter(
    (medicine) => medicine.dispenseQty > 0
  ),

  pharmacist: "Vanshika",

  dispenseDate: new Date().toLocaleDateString(),
};