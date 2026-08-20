"use client";

import { useState } from "react";

import { dischargePatient } from "../services/ipd.service";
import type { AddDischargeSchema } from "@/features/ipd/DischargeForm/validation";

export function useAddDischarge() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitDischarge = async (data: AddDischargeSchema) => {
    setIsSubmitting(true);
    try {
      await dischargePatient(data);
      return true;
    } catch (err) {
      console.error("Failed to discharge patient", err);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitDischarge, isSubmitting };
}