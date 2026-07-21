// features/nurse/types/nurse.types.ts


export interface AddVitalsPayload {
  patientId: string;

  temperature: number;

  pulse: number;

  respiratoryRate: number;

  bloodPressure: string;

  oxygenSaturation: number;

  recordedAt: string;
}



export interface AddNursingNotePayload {

  patientId: string;

  note: string;

  createdAt: string;

  createdBy: string;

}



export interface AddMedicationAdministrationPayload {

  patientId: string;

  medicationId: string;

  medicationName: string;

  dosage: string;

  route: string;

  administeredAt: string;

  administeredBy: string;

}



export interface AddIntakeOutputPayload {

  patientId: string;

  intakeType: string;

  intakeAmount: number;

  outputType: string;

  outputAmount: number;

  recordedAt: string;

}



export interface AddHandoverPayload {

  patientId: string;

  shift: "Morning" | "Evening" | "Night";

  summary: string;

  handedOverBy: string;

  receivedBy: string;

  createdAt: string;

}