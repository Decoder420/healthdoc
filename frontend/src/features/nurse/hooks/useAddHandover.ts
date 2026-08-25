"use client";
 
import { useState } from "react";
 
import { addHandover } from "@/features/nurse/api/nursing";
import type { AddHandoverSchema } from "@/features/nurse/components/AddHandoverForm/validation";
 
export function useAddHandover() {
  const [isSubmitting, setIsSubmitting] = useState(false);
 
  const submitHandover = async (data: AddHandoverSchema) => {
    setIsSubmitting(true);
 
    try {
      await addHandover(data);
      return true;
    } catch (error) {
      console.error("Failed to add handover note:", error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };
 
  return { submitHandover, isSubmitting };
}
 
