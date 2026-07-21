"use client";

import { useEffect } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import FormSection from "../form/FormSection";
import TextField from "../form/TextField";
import SelectField from "../form/SelectField";
import DateTimeField from "../form/DateTimeField";
import TextAreaField from "../form/TextAreaField";
import FormActions from "../form/FormActions";

import {
  AddMedicationAdministrationFormProps,
} from "./AddMedicationAdministrationForm.types";

import {
  DEFAULT_VALUES,
  ROUTES,
  FREQUENCIES,
  STATUS_OPTIONS,
} from "./constants";

import {
  addMedicationAdministrationSchema,
  AddMedicationAdministrationSchema,
} from "./validation";

export default function AddMedicationAdministrationForm({
  patientId,
  isSubmitting = false,
  onSubmit,
}: AddMedicationAdministrationFormProps) {

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: {
      errors,
    },
  } = useForm<AddMedicationAdministrationSchema>({
    resolver: zodResolver(
      addMedicationAdministrationSchema
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
    data: AddMedicationAdministrationSchema
  ) => {

    await onSubmit(data);

    handleReset();

  };

  return (

    <FormSection
      title="Medication Administration"
      description="Record medication administration for the selected patient."
    >

      <form
        onSubmit={handleSubmit(
          submitHandler
        )}
        className="space-y-6"
      >

        <div className="grid gap-5 md:grid-cols-2">

          <TextField
            label="Medication Name"
            placeholder="Paracetamol 500 mg"
            registration={register(
              "medicationName"
            )}
            error={errors.medicationName}
          />

          <TextField
            label="Dosage"
            placeholder="1 Tablet"
            registration={register(
              "dosage"
            )}
            error={errors.dosage}
          />

          <SelectField
            label="Route"
            options={ROUTES.map(
              (route) => ({
                label: route,
                value: route,
              })
            )}
            registration={register(
              "route"
            )}
            error={errors.route}
          />

          <SelectField
            label="Frequency"
            options={FREQUENCIES.map(
              (frequency) => ({
                label: frequency,
                value: frequency,
              })
            )}
            registration={register(
              "frequency"
            )}
            error={errors.frequency}
          />
                    <DateTimeField
            label="Scheduled Time"
            registration={register(
              "scheduledTime"
            )}
            error={errors.scheduledTime}
          />

          <DateTimeField
            label="Administration Time"
            registration={register(
              "administeredTime"
            )}
            error={errors.administeredTime}
          />

          <SelectField
            label="Status"
            options={STATUS_OPTIONS.map(
              (status) => ({
                label: status,
                value: status,
              })
            )}
            registration={register(
              "status"
            )}
            error={errors.status}
          />

        </div>

        <TextAreaField
          label="Remarks"
          placeholder="Enter any additional remarks..."
          rows={4}
          registration={register(
            "remarks"
          )}
          error={errors.remarks}
        />

        <FormActions
          isSubmitting={isSubmitting}
          submitLabel="Save Medication"
          resetLabel="Reset"
          onReset={handleReset}
        />

      </form>

    </FormSection>

  );
}