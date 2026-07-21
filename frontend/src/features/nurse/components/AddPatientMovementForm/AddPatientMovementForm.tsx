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
  AddPatientMovementFormProps,
} from "./AddPatientMovementForm.types";

import {
  DEFAULT_VALUES,
  MOVEMENT_TYPES,
} from "./constants";

import {
  addPatientMovementSchema,
  AddPatientMovementSchema,
} from "./validation";

export default function AddPatientMovementForm({
  patientId,
  isSubmitting = false,
  onSubmit,
}: AddPatientMovementFormProps) {

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: {
      errors,
    },
  } = useForm<AddPatientMovementSchema>({
    resolver: zodResolver(
      addPatientMovementSchema
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
    data: AddPatientMovementSchema
  ) => {

    await onSubmit(data);

    handleReset();

  };

  return (

    <FormSection
      title="Patient Movement"
      description="Record patient ward or bed transfer."
    >

      <form
        onSubmit={handleSubmit(
          submitHandler
        )}
        className="space-y-6"
      >

        <div className="grid gap-5 md:grid-cols-2">

          <TextField
            label="From Ward"
            placeholder="ICU"
            registration={register(
              "fromWard"
            )}
            error={errors.fromWard}
          />

          <TextField
            label="To Ward"
            placeholder="General Ward"
            registration={register(
              "toWard"
            )}
            error={errors.toWard}
          />

          <TextField
            label="From Bed"
            placeholder="ICU-12"
            registration={register(
              "fromBed"
            )}
            error={errors.fromBed}
          />

          <TextField
            label="To Bed"
            placeholder="GW-105"
            registration={register(
              "toBed"
            )}
            error={errors.toBed}
          />

          <SelectField
            label="Movement Type"
            options={MOVEMENT_TYPES.map(
              (type) => ({
                label: type,
                value: type,
              })
            )}
            registration={register(
              "movementType"
            )}
            error={errors.movementType}
          />

          <DateTimeField
            label="Movement Time"
            registration={register(
              "movementTime"
            )}
            error={errors.movementTime}
          />
                  </div>

        <TextAreaField
          label="Reason for Movement"
          placeholder="Enter reason for patient transfer..."
          rows={4}
          registration={register(
            "reason"
          )}
          error={errors.reason}
        />

        <TextField
          label="Approved By"
          placeholder="Dr. Sharma"
          registration={register(
            "approvedBy"
          )}
          error={errors.approvedBy}
        />

        <TextAreaField
          label="Remarks"
          placeholder="Additional remarks..."
          rows={3}
          registration={register(
            "remarks"
          )}
          error={errors.remarks}
        />

        <FormActions
          isSubmitting={isSubmitting}
          submitLabel="Record Movement"
          resetLabel="Reset"
          onReset={handleReset}
        />

      </form>

    </FormSection>

  );
}