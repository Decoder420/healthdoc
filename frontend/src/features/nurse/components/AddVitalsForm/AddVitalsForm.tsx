"use client";

import { useEffect } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import FormSection from "../../../../components/forms/FormSection";
import NumberField from "../../../../components/forms/NumberField";
import SelectField from "../../../../components/forms/SelectField";
import FormActions from "../../../../components/forms/FormActions";

import { AddVitalsFormProps } from "./Addvitalsform.types";

import { DEFAULT_VALUES, PAIN_SCORE_OPTIONS } from "./constants";

import { addVitalsSchema, type AddVitalsSchema } from "./validation";

export default function AddVitalsForm({
  patientId,
  isSubmitting = false,
  onSubmit,
}: AddVitalsFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AddVitalsSchema>({
    resolver: zodResolver(addVitalsSchema),

    defaultValues: {
      ...DEFAULT_VALUES,
      patient_id: patientId,
    },
  });

  useEffect(() => {
    if (patientId) {
      setValue("patient_id", patientId);
    }
  }, [patientId, setValue]);

  const handleReset = () => {
    reset({
      ...DEFAULT_VALUES,
      patient_id: patientId,
    });
  };

  const submitHandler = async (data: AddVitalsSchema) => {
    const success = await onSubmit(data);

    if (success) {
      handleReset();
    }
  };

  return (
    <FormSection
      title="Add Patient Vitals"
      description="Record latest vital signs for the selected patient."
    >
      <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <NumberField
            label="Temperature (°C)"
            placeholder="36.8"
            registration={register("temp_c", { valueAsNumber: true })}
            error={errors.temp_c}
          />

          <NumberField
            label="Pulse (bpm)"
            placeholder="72"
            registration={register("pulse_bpm", { valueAsNumber: true })}
            error={errors.pulse_bpm}
          />

          <NumberField
            label="Respiratory Rate"
            placeholder="18"
            registration={register("resp_rate", { valueAsNumber: true })}
            error={errors.resp_rate}
          />

          <NumberField
            label="Systolic BP"
            placeholder="120"
            registration={register("bp_systolic", { valueAsNumber: true })}
            error={errors.bp_systolic}
          />

          <NumberField
            label="Diastolic BP"
            placeholder="80"
            registration={register("bp_diastolic", { valueAsNumber: true })}
            error={errors.bp_diastolic}
          />

          <NumberField
            label="SpO₂ (%)"
            placeholder="98"
            registration={register("spo2_pct", { valueAsNumber: true })}
            error={errors.spo2_pct}
          />

          <NumberField
            label="Weight (kg)"
            placeholder="65"
            registration={register("weight_kg", { valueAsNumber: true })}
            error={errors.weight_kg}
          />

          <NumberField
            label="Height (cm)"
            placeholder="170"
            registration={register("height_cm", { valueAsNumber: true })}
            error={errors.height_cm}
          />

          <SelectField
            label="Pain Score"
            options={PAIN_SCORE_OPTIONS.map((score) => ({
              label: score.toString(),
              value: score,
            }))}
            registration={register("pain_score", { valueAsNumber: true })}
            error={errors.pain_score}
          />
        </div>

        <FormActions
          isSubmitting={isSubmitting}
          submitLabel="Save Vitals"
          resetLabel="Reset"
          onReset={handleReset}
        />
      </form>
    </FormSection>
  );
}
