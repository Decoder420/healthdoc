import { useState } from "react";

// import { addVitals } from "../services";
import { vitalsService } from "../services/vitals.service";
import type { AddVitalsSchema } from "../validation";

export function useAddVitals() {
  const [isSubmitting, setIsSubmitting] =
    useState(false);

 const submitVitals = async (
    data: AddVitalsSchema
  ): Promise<boolean> => {
    try {
      setIsSubmitting(true);

      await vitalsService.addVitals(data);

      return true;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitVitals,
    isSubmitting,
  };
}