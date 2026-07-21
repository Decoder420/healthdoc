"use client";

import { useEffect } from "react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import FormSection from "../form/FormSection";
import NumberField from "../form/NumberField";
import SelectField from "../form/SelectField";
import TextAreaField from "../form/TextAreaField";
import FormActions from "../form/FormActions";

import {
  AddVitalsFormProps,
} from "./AddVitalsForm.types";

import {
  DEFAULT_VALUES,
  PAIN_SCORE_OPTIONS,
} from "./constants";

import {
  addVitalsSchema,
  type AddVitalsSchema,
} from "@/features/nurse/validation/vitals.schema";

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
    formState: {
      errors,
    },
  } = useForm<AddVitalsSchema>({
    resolver: zodResolver(addVitalsSchema),

    defaultValues: {
      ...DEFAULT_VALUES,
      patientId,
    },
  });

//   useEffect(() => {

//     setValue(
//       "patientId",
//       patientId
//     );

//   }, [
//     patientId,
//     setValue,
//   ]);

useEffect(() => {
  if (patientId) {
    setValue("patientId", patientId);
  }
}, [patientId, setValue]);

//   const submitHandler = async (
//     data: AddVitalsSchema
//   ) => {

//     await onSubmit(data);

//     reset({
//       ...DEFAULT_VALUES,
//       patientId,
//     });

//   };
const submitHandler = async (
  data: AddVitalsSchema
) => {
  console.log("Form Data:", data);

  const success = await onSubmit(data);

  console.log("Success:", success);

  if (success) {
    reset({
      ...DEFAULT_VALUES,
      patientId,
    });
  }
};
  const handleReset = () => {

    reset({
      ...DEFAULT_VALUES,
      patientId,
    });

  };

  return (

    <FormSection
      title="Add Patient Vitals"
      description="Record latest vital signs for the selected patient."
    >

      <form
        onSubmit={handleSubmit(
          submitHandler
        )}
        className="space-y-6"
      >

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

          <NumberField
            label="Temperature (°C)"
            placeholder="36.8"
            registration={register(
              "temperature",
              {
                valueAsNumber: true,
              }
            )}
            error={errors.temperature}
          />

          <NumberField
            label="Pulse (bpm)"
            placeholder="72"
            registration={register(
              "pulse",
              {
                valueAsNumber: true,
              }
            )}
            error={errors.pulse}
          />

          <NumberField
            label="Respiratory Rate"
            placeholder="18"
            registration={register(
              "respiratoryRate",
              {
                valueAsNumber: true,
              }
            )}
            error={
              errors.respiratoryRate
            }
          />

          <NumberField
            label="Systolic BP"
            placeholder="120"
            registration={register(
              "systolicBloodPressure",
              {
                valueAsNumber: true,
              }
            )}
            error={
              errors.systolicBloodPressure
            }
          />

          <NumberField
            label="Diastolic BP"
            placeholder="80"
            registration={register(
              "diastolicBloodPressure",
              {
                valueAsNumber: true,
              }
            )}
            error={
              errors.diastolicBloodPressure
            }
          />
                    <NumberField
            label="SpO₂ (%)"
            placeholder="98"
            registration={register(
              "oxygenSaturation",
              {
                valueAsNumber: true,
              }
            )}
            error={
              errors.oxygenSaturation
            }
          />

          <NumberField
            label="Weight (kg)"
            placeholder="65"
            registration={register(
              "weight",
              {
                valueAsNumber: true,
              }
            )}
            error={errors.weight}
          />

          <NumberField
            label="Height (cm)"
            placeholder="170"
            registration={register(
              "height",
              {
                valueAsNumber: true,
              }
            )}
            error={errors.height}
          />

          <SelectField
            label="Pain Score"
            options={PAIN_SCORE_OPTIONS.map(
              (score) => ({
                label: score.toString(),
                value: score,
              })
            )}
            registration={register(
              "painScore",
              {
                valueAsNumber: true,
              }
            )}
            error={errors.painScore}
          />

        </div>

        <TextAreaField
          label="Remarks"
          placeholder="Enter additional observations..."
          rows={4}
          registration={register(
            "remarks"
          )}
          error={errors.remarks}
        />

        <FormActions
          isSubmitting={
            isSubmitting
          }
          submitLabel="Save Vitals"
          resetLabel="Reset"
          onReset={handleReset}
        />

      </form>

    </FormSection>

  );
}