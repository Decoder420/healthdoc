export interface VitalRecord {
  id: string;
  recordedAt: string;

  temperature: number;
  pulse: number;
  respiratoryRate: number;
  bloodPressure: string;
  oxygenSaturation: number;

  recordedBy: string;
}