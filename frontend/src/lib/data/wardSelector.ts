import { Ward } from "../../features/nurse/components/WardSelector/WardSelector.types";
import {
  CCU_WARD_ID,
  EMERGENCY_WARD_ID,
  FACILITY_ID,
  GENERAL_WARD_ID,
  ICU_WARD_ID,
  NICU_WARD_ID,
  PICU_WARD_ID,
} from "./mockIds";

export const WARDS: Ward[] = [
  {
    id: GENERAL_WARD_ID,
    name: "General Ward",
    department_id: null,
    facility_id: FACILITY_ID,
    is_active: true,
  },
  {
    id: ICU_WARD_ID,
    name: "ICU",
    department_id: null,
    facility_id: FACILITY_ID,
    is_active: true,
  },
  {
    id: CCU_WARD_ID,
    name: "CCU",
    department_id: null,
    facility_id: FACILITY_ID,
    is_active: true,
  },
  {
    id: PICU_WARD_ID,
    name: "PICU",
    department_id: null,
    facility_id: FACILITY_ID,
    is_active: true,
  },
  {
    id: NICU_WARD_ID,
    name: "NICU",
    department_id: null,
    facility_id: FACILITY_ID,
    is_active: true,
  },
  {
    id: EMERGENCY_WARD_ID,
    name: "Emergency",
    department_id: null,
    facility_id: FACILITY_ID,
    is_active: true,
  },
];
