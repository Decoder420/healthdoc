"use client";

import { useState } from "react";

import { admitPatient } from "../services/ipd.service";
import type { AddAdmissionSchema } from "@/features/ipd/AdmissionForm/validation";

export function useAddAdmission() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitAdmission = async (data: AddAdmissionSchema) => {
    setIsSubmitting(true);
    try {
      await admitPatient(data);
      return true;
    } catch (err) {
      console.error("Failed to admit patient", err);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitAdmission, isSubmitting };
}