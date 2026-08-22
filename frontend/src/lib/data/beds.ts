import { Bed } from "@/components/BedGrid";
import {
  BED_B101_ID,
  BED_B102_ID,
  BED_C301_ID,
  BED_I201_ID,
  BED_I202_ID,
  CCU_WARD_ID,
  GENERAL_WARD_ID,
  ICU_WARD_ID,
} from "./mockIds";

export const beds: Bed[] = [
  {
    bed_id: BED_B101_ID,
    ward_id: GENERAL_WARD_ID,
    bed_number: "B-101",
    status: "occupied",
    occupant: null,
  },
  {
    bed_id: BED_B102_ID,
    ward_id: GENERAL_WARD_ID,
    bed_number: "B-102",
    status: "vacant",
    occupant: null,
  },
  {
    bed_id: BED_I201_ID,
    ward_id: ICU_WARD_ID,
    bed_number: "I-201",
    status: "occupied",
    occupant: null,
  },
  {
    bed_id: BED_I202_ID,
    ward_id: ICU_WARD_ID,
    bed_number: "I-202",
    status: "vacant",
    occupant: null,
  },
  {
    bed_id: BED_C301_ID,
    ward_id: CCU_WARD_ID,
    bed_number: "C-301",
    status: "occupied",
    occupant: null,
  },
];
