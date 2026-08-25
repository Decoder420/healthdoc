"use client";

import { useState } from "react";

import { addVitals } from "@/features/nurse/api/nursing";
import type { AddVitalsSchema } from "@/features/nurse/components/AddVitalsForm/validation";

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
