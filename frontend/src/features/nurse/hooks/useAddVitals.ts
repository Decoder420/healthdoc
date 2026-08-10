import { useState } from "react";

import { addVitals } from "../services/nurse.service";
import type { AddVitalsSchema } from "@/src/features/nurse/components/AddVitalsForm/validation";

export function useAddVitals() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitVitals = async (data: AddVitalsSchema): Promise<boolean> => {
    try {
      setIsSubmitting(true);

      await addVitals(data);

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