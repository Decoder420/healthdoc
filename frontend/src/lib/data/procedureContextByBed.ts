import {
  BED_B101_ID,
  BED_C301_ID,
  BED_I201_ID,
  ENCOUNTER_1_ID,
  ENCOUNTER_2_ID,
  ENCOUNTER_3_ID,
  PATIENT_1_ID,
  PATIENT_2_ID,
  PATIENT_3_ID,
} from "./mockIds";

export const procedureContextByBedId: Record<
  string,
  { encounterId: string; patientId: string }
> = {
  [BED_B101_ID]: { encounterId: ENCOUNTER_1_ID, patientId: PATIENT_1_ID },
  [BED_I201_ID]: { encounterId: ENCOUNTER_2_ID, patientId: PATIENT_2_ID },
  [BED_C301_ID]: { encounterId: ENCOUNTER_3_ID, patientId: PATIENT_3_ID },
};
