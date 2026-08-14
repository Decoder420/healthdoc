"use client";

import { useEffect } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import FormSection from "../../../../components/forms/FormSection";
import SelectField from "../../../../components/forms/SelectField";
import TextAreaField from "../../../../components/forms/TextAreaField";
import FormActions from "../../../../components/forms/FormActions";

import { AddNursingNoteFormProps } from "./AddNursingNoteForm.types";

import { DEFAULT_VALUES, NOTE_CATEGORIES, PRIORITIES } from "./constants";

import {
  addNursingNoteSchema,
  type AddNursingNoteSchema,
} from "./validation";

export default function AddNursingNoteForm({
  encounterId,
  patientId,
  isSubmitting = false,
  onSubmit,
}: AddNursingNoteFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AddNursingNoteSchema>({
    resolver: zodResolver(addNursingNoteSchema),

    defaultValues: {
      ...DEFAULT_VALUES,
      encounter_id: encounterId,
      patient_id: patientId,
    },
  });

  useEffect(() => {
    setValue("encounter_id", encounterId);
    setValue("patient_id", patientId);
  }, [encounterId, patientId, setValue]);

  const handleReset = () => {
    reset({
      ...DEFAULT_VALUES,
      encounter_id: encounterId,
      patient_id: patientId,
    });
  };

  const submitHandler = async (data: AddNursingNoteSchema) => {
    const success = await onSubmit(data);

    if (success) {
      handleReset();
    }
  };

  return (
    <FormSection
      title="Add Nursing Note"
      description="Record nursing observations for the selected patient."
    >
      <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
        <div className="grid gap-5 md:grid-cols-2">
          <SelectField
            label="Category"
            options={NOTE_CATEGORIES.map((category) => ({
              label: category,
              value: category,
            }))}
            registration={register("category")}
            error={errors.category}
          />

          <SelectField
            label="Priority"
            options={PRIORITIES.map((priority) => ({
              label: priority,
              value: priority,
            }))}
            registration={register("priority")}
            error={errors.priority}
          />
        </div>

        <TextAreaField
          label="Nursing Note"
          placeholder="Enter nursing observations, interventions, or patient condition..."
          rows={6}
          registration={register("note")}
          error={errors.note}
        />

        <FormActions
          isSubmitting={isSubmitting}
          submitLabel="Save Note"
          resetLabel="Reset"
          onReset={handleReset}
        />
      </form>
    </FormSection>
  );
}
