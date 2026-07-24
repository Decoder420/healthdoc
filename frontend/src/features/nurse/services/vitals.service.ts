// import { AddVitalsSchema } from "@/features/nurse/validation/vitals.schema";

// class VitalsService {
//   async addVitals(payload: AddVitalsSchema) {
//     // TODO: Replace with actual API endpoint

//     console.log("Add Vitals Payload:", payload);

//     // Example:
//     // return api.post("/nurse/vitals", payload);

//     return Promise.resolve({
//       success: true,
//       message: "Vitals saved successfully.",
//       data: payload,
//     });
//   }
// }

// export const vitalsService = new VitalsService();

// vitals.service.ts
//
// NOTE: this file previously had its own class-based VitalsService with a mocked
// addVitals() (Promise.resolve + console.log). That was a second, divergent
// implementation of the same feature already in nurse.service.ts — two call-sites
// for one feature is exactly what caused the mismatch we flagged earlier.
//
// Keeping this file only as a re-export, in case other modules already import
// `vitalsService` from this path. If nothing imports it yet, prefer deleting this
// file entirely and importing addVitals directly from nurse.service.ts.
 
export { addVitals } from "./nurse.service ";
export type { Vitals } from "./nurse.service ";