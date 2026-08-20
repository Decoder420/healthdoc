import {
  ADMISSION_1_ID,
  ADMISSION_2_ID,
  ADMISSION_3_ID,
  BED_B101_ID,
  BED_C301_ID,
  BED_I201_ID,
} from "./mockIds";

export const admissionsByBedId: Record<string, string> = {
  [BED_B101_ID]: ADMISSION_1_ID,
  [BED_I201_ID]: ADMISSION_2_ID,
  [BED_C301_ID]: ADMISSION_3_ID,
};
