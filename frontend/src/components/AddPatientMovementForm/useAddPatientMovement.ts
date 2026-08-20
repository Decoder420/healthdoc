"use client";

import { useState } from "react";

import { addPatientMovement as addPatientMovementRequest } from "@/features/nurse/services/nurse.service";
import type { AddPatientMovementSchema } from "./validation";

export function useAddPatientMovement() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitPatientMovement = async (data: AddPatientMovementSchema) => {
    setIsSubmitting(true);
    try {
      await addPatientMovementRequest(data);
      return true;
    } catch (err) {
      console.error("Failed to record patient movement", err);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitPatientMovement, isSubmitting };
}