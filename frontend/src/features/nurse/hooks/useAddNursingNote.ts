"use client";

import { useState } from "react";

import { addNursingNote } from "@/features/nurse/services/nurse.service";
import type { AddNursingNoteSchema } from "@/features/nurse/components/AddNursingNoteForm/validation";

export function useAddNursingNote() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitNursingNote = async (data: AddNursingNoteSchema) => {
    setIsSubmitting(true);
    try {
      await addNursingNote(data);
      return true;
    } catch (err) {
      console.error("Failed to save nursing note", err);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitNursingNote, isSubmitting };
}
