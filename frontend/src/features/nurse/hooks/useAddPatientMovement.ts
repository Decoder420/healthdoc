"use client";

import { useState } from "react";

import { addPatientMovement } from "@/features/nurse/services/nurse.service";
import type { AddPatientMovementSchema } from "@/features/nurse/components/AddPatientMovementForm/validation";

export function useAddPatientMovement() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitPatientMovement = async (
    data: AddPatientMovementSchema
  ): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      await addPatientMovement(data);
      return true;
    } catch (error) {
      console.error("Failed to record patient movement:", error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitPatientMovement, isSubmitting };
}