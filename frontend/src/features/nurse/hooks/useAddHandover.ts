"use client";

import { useState } from "react";

import { addHandover } from "@/features/nurse/services/nurse.service";
import type { AddHandoverSchema } from "@/features/nurse/components/AddHandoverForm/validation";

export function useAddHandover() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitHandover = async (data: AddHandoverSchema) => {
    setIsSubmitting(true);

    try {
      const result = await addHandover(data);
      return result;
    } catch (error) {
      console.error("Failed to add handover note:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitHandover, isSubmitting };
}