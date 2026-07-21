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
  AddHandoverFormProps,
} from "./AddHandoverForm.types";

import {
  DEFAULT_VALUES,
  SHIFTS,
} from "./constants";

import {
  addHandoverSchema,
  AddHandoverSchema,
} from "./validation";

export default function AddHandoverForm({
  patientId,
  isSubmitting = false,
  onSubmit,
}: AddHandoverFormProps) {

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: {
      errors,
    },
  } = useForm<AddHandoverSchema>({
    resolver: zodResolver(
      addHandoverSchema
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
    data: AddHandoverSchema
  ) => {

    await onSubmit(data);

    handleReset();

  };

  return (

    <FormSection
      title="Patient Handover"
      description="Record shift handover details."
    >

      <form
        onSubmit={handleSubmit(
          submitHandler
        )}
        className="space-y-6"
      >

        <div className="grid gap-5 md:grid-cols-2">

          <SelectField
            label="From Shift"
            options={SHIFTS.map(
              (shift) => ({
                label: shift,
                value: shift,
              })
            )}
            registration={register("fromShift")}
            error={errors.fromShift}
          />

          <SelectField
            label="To Shift"
            options={SHIFTS.map(
              (shift) => ({
                label: shift,
                value: shift,
              })
            )}
            registration={register("toShift")}
            error={errors.toShift}
          />

          <TextField
            label="Outgoing Nurse"
            placeholder="Nurse Anita"
            registration={register("outgoingNurse")}
            error={errors.outgoingNurse}
          />

          <TextField
            label="Incoming Nurse"
            placeholder="Nurse Rahul"
            registration={register("incomingNurse")}
            error={errors.incomingNurse}
          />

          <DateTimeField
            label="Handover Time"
            registration={register("handedOverAt")}
            error={errors.handedOverAt}
          />
                  </div>

        <TextAreaField
          label="Clinical Summary"
          placeholder="Enter patient condition, vitals trend, treatments given..."
          rows={4}
          registration={register("summary")}
          error={errors.summary}
        />

        <TextAreaField
          label="Pending Tasks"
          placeholder="Medication due, dressing change, investigations..."
          rows={3}
          registration={register("pendingTasks")}
          error={errors.pendingTasks}
        />

        <TextAreaField
          label="Special Instructions"
          placeholder="Isolation precautions, fall risk, diet instructions..."
          rows={3}
          registration={register("specialInstructions")}
          error={errors.specialInstructions}
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