import { useState } from "react";

import { addNursingNote } from "../services";

import type {
  AddNursingNoteSchema,
} from "../validation";

export function useAddNursingNote() {
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const submitNursingNote = async (
    data: AddNursingNoteSchema
  ): Promise<boolean> => {
    try {
      setIsSubmitting(true);

      await addNursingNote(data);

      return true;
    } catch (error) {
      console.error(error);

      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitNursingNote,
    isSubmitting,
  };
}