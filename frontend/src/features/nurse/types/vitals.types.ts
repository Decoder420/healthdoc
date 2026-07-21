export interface VitalSigns {
  patientId: string;

  temperature: number;

  pulse: number;

  respiratoryRate: number;

  systolicBloodPressure: number;

  diastolicBloodPressure: number;

  oxygenSaturation: number;

  weight?: number;

  height?: number;

  painScore?: number;

  remarks?: string;

  recordedAt?: string;

  recordedBy?: string;
}
export type AddVitalsPayload = VitalSigns;