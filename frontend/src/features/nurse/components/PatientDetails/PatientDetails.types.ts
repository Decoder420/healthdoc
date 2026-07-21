export interface Patient {
  id: string;
 patientName: string;
  uhid: string;
  age: number;
  gender: string;
  diagnosis: string;
  consultant: string;
  ward: string;
  bedNumber: string;
  admissionDate: string;
}

export interface PatientDetailsProps {
  patient: Patient | null;
}