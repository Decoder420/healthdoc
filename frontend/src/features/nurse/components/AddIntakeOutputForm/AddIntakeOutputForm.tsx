"use client";

import { useEffect } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import FormSection from "../form/FormSection";
import NumberField from "../form/NumberField";
import SelectField from "../form/SelectField";
import DateTimeField from "../form/DateTimeField";
import TextAreaField from "../form/TextAreaField";
import FormActions from "../form/FormActions";

import {
  AddIntakeOutputFormProps,
} from "./AddIntakeOutputForm.types";

import {
  DEFAULT_VALUES,
  INTAKE_TYPES,
  OUTPUT_TYPES,
} from "./constants";

import {
  addIntakeOutputSchema,
  AddIntakeOutputSchema,
} from "./validation";

export default function AddIntakeOutputForm({
  patientId,
  isSubmitting = false,
  onSubmit,
}: AddIntakeOutputFormProps) {

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: {
      errors,
    },
  } = useForm<AddIntakeOutputSchema>({
    resolver: zodResolver(
      addIntakeOutputSchema
    ),

    defaultValues: {
      ...DEFAULT_VALUES,
      patientId,
    },
  });

  useEffect(() => {

    setValue(
      "patientId",
      patientId
    );

  }, [
    patientId,
    setValue,
  ]);

  const handleReset = () => {

    reset({
      ...DEFAULT_VALUES,
      patientId,
    });

  };

  const submitHandler = async (
    data: AddIntakeOutputSchema
  ) => {

    await onSubmit(data);

    handleReset();

  };

  return (

    <FormSection
      title="Intake / Output Record"
      description="Record patient's fluid intake and output."
    >

      <form
        onSubmit={handleSubmit(
          submitHandler
        )}
        className="space-y-6"
      >

        <div className="grid gap-5 md:grid-cols-2">

          <SelectField
            label="Intake Type"
            options={INTAKE_TYPES.map(
              (type) => ({
                label: type,
                value: type,
              })
            )}
            registration={register(
              "intakeType"
            )}
            error={errors.intakeType}
          />

          <NumberField
            label="Intake Amount (mL)"
            placeholder="500"
            registration={register(
              "intakeAmount",
              {
                valueAsNumber: true,
              }
            )}
            error={errors.intakeAmount}
          />

          <SelectField
            label="Output Type"
            options={OUTPUT_TYPES.map(
              (type) => ({
                label: type,
                value: type,
              })
            )}
            registration={register(
              "outputType"
            )}
            error={errors.outputType}
          />

          <NumberField
            label="Output Amount (mL)"
            placeholder="350"
            registration={register(
              "outputAmount",
              {
                valueAsNumber: true,
              }
            )}
            error={errors.outputAmount}
          />
                    <DateTimeField
            label="Recorded Time"
            registration={register(
              "recordedTime"
            )}
            error={errors.recordedTime}
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
          isSubmitting={isSubmitting}
          submitLabel="Save Record"
          resetLabel="Reset"
          onReset={handleReset}
        />

      </form>

    </FormSection>

  );
}