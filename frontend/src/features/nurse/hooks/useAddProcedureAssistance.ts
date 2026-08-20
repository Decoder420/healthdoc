"use client";

import { useState } from "react";

import { addProcedureAssistance } from "@/features/nurse/services/nurse.service";
import type { AddProcedureAssistanceSchema } from "@/features/nurse/components/AddProcedureAssistanceForm/validation";

export function useAddProcedureAssistance() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitProcedureAssistance = async (
    data: AddProcedureAssistanceSchema
  ): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      await addProcedureAssistance(data);
      return true;
    } catch (error) {
      console.error("Failed to add procedure record:", error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitProcedureAssistance, isSubmitting };
}