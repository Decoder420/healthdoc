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
  AddProcedureAssistanceFormProps,
} from "./AddProcedureAssistanceForm.types";

import {
  DEFAULT_VALUES,
  PROCEDURE_CATEGORIES,
  PROCEDURE_STATUS,
  CONSENT_OPTIONS,
} from "./constants";

import {
  addProcedureAssistanceSchema,
  AddProcedureAssistanceSchema,
} from "./validation";

export default function AddProcedureAssistanceForm({
  patientId,
  isSubmitting = false,
  onSubmit,
}: AddProcedureAssistanceFormProps) {

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: {
      errors,
    },
  } = useForm<AddProcedureAssistanceSchema>({
    resolver: zodResolver(
      addProcedureAssistanceSchema
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
    data: AddProcedureAssistanceSchema
  ) => {

    await onSubmit(data);

    handleReset();

  };

  return (

    <FormSection
      title="Procedure Assistance"
      description="Record nursing assistance during a clinical procedure."
    >

      <form
        onSubmit={handleSubmit(
          submitHandler
        )}
        className="space-y-6"
      >

        <div className="grid gap-5 md:grid-cols-2">

          <TextField
            label="Procedure Name"
            placeholder="Central Line Insertion"
            registration={register(
              "procedureName"
            )}
            error={errors.procedureName}
          />

          <SelectField
            label="Procedure Category"
            options={PROCEDURE_CATEGORIES.map(
              (category) => ({
                label: category,
                value: category,
              })
            )}
            registration={register(
              "procedureCategory"
            )}
            error={errors.procedureCategory}
          />

          <TextField
            label="Doctor Name"
            placeholder="Dr. Sharma"
            registration={register(
              "doctorName"
            )}
            error={errors.doctorName}
          />

          <TextField
            label="Assisting Nurse"
            placeholder="Nurse Anita"
            registration={register(
              "assistingNurse"
            )}
            error={errors.assistingNurse}
          />

          <DateTimeField
            label="Procedure Time"
            registration={register(
              "procedureTime"
            )}
            error={errors.procedureTime}
          />

          <SelectField
            label="Procedure Status"
            options={PROCEDURE_STATUS.map(
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

        <TextField
          label="Equipment Used"
          placeholder="Central Line Kit"
          registration={register(
            "equipmentUsed"
          )}
          error={errors.equipmentUsed}
        />

        <SelectField
          label="Consent Taken"
          options={CONSENT_OPTIONS.map(
            (option) => ({
              label: option,
              value: option,
            })
          )}
          registration={register(
            "consentTaken"
          )}
          error={errors.consentTaken}
        />

        <TextAreaField
          label="Procedure Notes"
          placeholder="Enter procedure details..."
          rows={4}
          registration={register(
            "notes"
          )}
          error={errors.notes}
        />

        <TextAreaField
          label="Complications"
          placeholder="Enter complications if any..."
          rows={3}
          registration={register(
            "complications"
          )}
          error={errors.complications}
        />

        <FormActions
          isSubmitting={isSubmitting}
          submitLabel="Save Procedure"
          resetLabel="Reset"
          onReset={handleReset}
        />

      </form>

    </FormSection>

  );
}