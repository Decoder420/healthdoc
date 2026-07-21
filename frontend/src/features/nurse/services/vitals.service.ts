import { AddVitalsSchema } from "@/features/nurse/validation/vitals.schema";

class VitalsService {
  async addVitals(payload: AddVitalsSchema) {
    // TODO: Replace with actual API endpoint

    console.log("Add Vitals Payload:", payload);

    // Example:
    // return api.post("/nurse/vitals", payload);

    return Promise.resolve({
      success: true,
      message: "Vitals saved successfully.",
      data: payload,
    });
  }
}

export const vitalsService = new VitalsService();