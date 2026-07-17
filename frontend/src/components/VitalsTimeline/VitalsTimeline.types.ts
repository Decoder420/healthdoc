export type VitalReading = {
  id: string;
  recordedAt: string;
  temperature?: string;
  pulse?: string;
  bloodPressure?: string;
  spo2?: string;
  respiratoryRate?: string;
  recordedBy?: string;
};
