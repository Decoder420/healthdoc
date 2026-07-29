// addVitals lives in nurse.service.ts (single source of truth for all
// nurse-module writes). This file only re-exports it, in case anything still
// imports from this path. useAddVitals.ts has been updated to import addVitals
// directly from nurse.service.ts, so this file can be deleted once confirmed
// nothing else references it.

export { addVitals } from "./nurse.service";
export type { Vitals } from "./nurse.service";