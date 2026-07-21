import { VitalSigns } from "../../types/vitals.types";

export const DEFAULT_VALUES: VitalSigns = {
  patientId: "",

  temperature: 0,

  pulse: 0,

  respiratoryRate: 0,

  systolicBloodPressure: 0,

  diastolicBloodPressure: 0,

  oxygenSaturation: 0,

  weight: 0,

  height: 0,

  painScore: 0,

  remarks: "",
};

export const PAIN_SCORE_OPTIONS = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
];