import type {
  PatientInfo,
  DispenseMedicine,
  DispenseBatch,
} from "@/features/pharmacy/types/types";

export interface PharmacyPrescription {
  id: string;
  queueNumber: string;
  patient: PatientInfo;
  medicines: DispenseMedicine[];
}

/*
 * Paracetamol batches
 *
 * FEFO should select:
 * PAR230018 → 20 Sep 2026
 */
const paracetamolBatches: DispenseBatch[] = [
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
];

/*
 * Amoxicillin
 *
 * FEFO selects AMX240008.
 * Only 5 available while 15 are prescribed.
 * Therefore this is a PARTIAL dispense.
 */
const amoxicillinBatches: DispenseBatch[] = [
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
];

/*
 * Pantoprazole
 */
const pantoprazoleBatches: DispenseBatch[] = [
  {
    batchNumber: "PAN240003",
    expiryDate: "14 Jan 2027",
    availableStock: 85,
  },
];

/*
 * Vitamin D3
 */
const vitaminD3Batches: DispenseBatch[] = [
  {
    batchNumber: "VIT240012",
    expiryDate: "08 Nov 2026",
    availableStock: 10,
  },
];

/*
 * Pharmacy prescriptions
 */
export const pharmacyPrescriptions: PharmacyPrescription[] = [
  {
    id: "1",
    queueNumber: "Q-101",

    patient: {
      patientName: "Rahul Sharma",
      uhid: "UHID-100245",
      doctor: "Dr. Amit Verma",
      visitType: "OPD",
      prescriptionNumber: "RX-20260001",
    },

    medicines: [
      {
        id: "RX1-M1",
        medicineName: "Paracetamol 500 mg",
        prescribedQty: 10,

        batchNumber: "",
        expiryDate: "",
        availableStock: 0,

        batches: paracetamolBatches,

        dispenseQty: 0,
        status: "Available",
      },

      {
        id: "RX1-M2",
        medicineName: "Amoxicillin 250 mg",
        prescribedQty: 15,

        batchNumber: "",
        expiryDate: "",
        availableStock: 0,

        batches: amoxicillinBatches,

        dispenseQty: 0,
        status: "Available",
      },

      {
        id: "RX1-M3",
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
        id: "RX1-M4",
        medicineName: "Pantoprazole 40 mg",
        prescribedQty: 30,

        batchNumber: "",
        expiryDate: "",
        availableStock: 0,

        batches: pantoprazoleBatches,

        dispenseQty: 0,
        status: "Available",
      },

      {
        id: "RX1-M5",
        medicineName: "Vitamin D3",
        prescribedQty: 10,

        batchNumber: "",
        expiryDate: "",
        availableStock: 0,

        batches: vitaminD3Batches,

        dispenseQty: 0,
        status: "Available",
      },
    ],
  },
];