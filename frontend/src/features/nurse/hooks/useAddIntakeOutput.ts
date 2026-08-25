"use client";

import { useState } from "react";

import { addIntakeOutput } from "@/features/nurse/api/nursing";
import type { AddIntakeOutputSchema } from "@/features/nurse/components/AddIntakeOutputForm/validation";

export function useAddIntakeOutput() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitIntakeOutput = async (
    data: AddIntakeOutputSchema
  ): Promise<boolean> => {
    setIsSubmitting(true);

    try {
      await addIntakeOutput(data);
      return true;
    } catch (error) {
      console.error("Failed to add intake/output record:", error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitIntakeOutput, isSubmitting };
}