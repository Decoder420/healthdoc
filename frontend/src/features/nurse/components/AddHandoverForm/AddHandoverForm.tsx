"use client";

import { useEffect } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import FormSection from "../../../../components/forms/FormSection";
import SelectField from "../../../../components/forms/SelectField";
import TextField from "../../../../components/forms/TextField";
import TextAreaField from "../../../../components/forms/TextAreaField";
import FormActions from "../../../../components/forms/FormActions";

import { AddHandoverFormProps } from "./AddHandoverForm.types";

import { DEFAULT_VALUES, SHIFTS } from "./constants";

import { addHandoverSchema, AddHandoverSchema } from "./validation";

export default function AddHandoverForm({
  admissionId,
  isSubmitting = false,
  onSubmit,
}: AddHandoverFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AddHandoverSchema>({
    resolver: zodResolver(addHandoverSchema),

    defaultValues: {
      ...DEFAULT_VALUES,
      admission_id: admissionId,
    },
  });

  useEffect(() => {
    setValue("admission_id", admissionId);
  }, [admissionId, setValue]);

  const handleReset = () => {
    reset({
      ...DEFAULT_VALUES,
      admission_id: admissionId,
    });
  };


  const submitHandler = async (data: AddHandoverSchema) => {
  const success = await onSubmit(data);
  if (success) handleReset();
 };
 
  return (
    <FormSection
      title="Patient Handover"
      description="Record shift handover details (SBAR format)."
    >
      <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
        <div className="grid gap-5 md:grid-cols-2">
          <SelectField
            label="Shift"
            options={SHIFTS.map((shift) => ({
              label: shift.charAt(0).toUpperCase() + shift.slice(1),
              value: shift,
            }))}
            registration={register("shift")}
            error={errors.shift}
          />

          {/* NOTE: this should become a nurse-picker (SelectField) once a nurse
              user-list source is available; kept as a UUID text input for now. */}
          <TextField
            label="Handed Over To (Nurse ID)"
            placeholder="Nurse's user UUID"
            registration={register("handed_over_to")}
            error={errors.handed_over_to}
          />
        </div>

        <TextAreaField
          label="Situation"
          placeholder="Current situation / reason for handover..."
          rows={3}
          registration={register("situation")}
          error={errors.situation}
        />

        <TextAreaField
          label="Background"
          placeholder="Relevant patient background / history..."
          rows={3}
          registration={register("background")}
          error={errors.background}
        />

        <TextAreaField
          label="Assessment"
          placeholder="Current clinical assessment..."
          rows={3}
          registration={register("assessment")}
          error={errors.assessment}
        />

        <TextAreaField
          label="Recommendation"
          placeholder="Recommended next steps / things to watch..."
          rows={3}
          registration={register("recommendation")}
          error={errors.recommendation}
        />

        <FormActions
          isSubmitting={isSubmitting}
          submitLabel="Complete Handover"
          resetLabel="Reset"
          onReset={handleReset}
        />
      </form>
    </FormSection>
  );
}
