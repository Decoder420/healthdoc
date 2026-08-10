"use client";

import { useState } from "react";
import {
  emptyDoctorForm,
  type DoctorFieldErrors,
  type DoctorFormInput,
  type DoctorProfile,
} from "@/features/doctors/types";
import { createDoctor, validateDoctorForm } from "@/features/doctors/api";
import { Button } from "@/components/ui/button";
import { DoctorForm } from "@/components/doctors/doctor-form";

type AddDoctorFlowProps = {
  onCancel: () => void;
  onCreated: (doctor: DoctorProfile) => void;
};

export function AddDoctorFlow({ onCancel, onCreated }: AddDoctorFlowProps) {
  const [form, setForm] = useState<DoctorFormInput>({
    ...emptyDoctorForm,
    availability: {
      days: [...emptyDoctorForm.availability.days],
      startTime: emptyDoctorForm.availability.startTime,
      endTime: emptyDoctorForm.availability.endTime,
    },
  });
  const [errors, setErrors] = useState<DoctorFieldErrors>({});
  const [error, setError] = useState("");

  function handleSubmit() {
    const validation = validateDoctorForm(form);
    setErrors(validation.errors);
    if (!validation.valid) {
      setError(validation.firstError ?? "Please fix the highlighted fields.");
      return;
    }

    const result = createDoctor(form);
    if (!result.success) {
      setError(result.error);
      if (result.errors) setErrors(result.errors);
      return;
    }

    onCreated(result.doctor);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Doctors Module</p>
          <h1 className="text-2xl font-semibold text-foreground">Add Doctor</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create a doctor profile with department, schedule, and consultation fee.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit}>
            Save Doctor
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-danger/30 bg-danger-muted/30 p-3 text-sm text-danger">
          {error}
        </div>
      )}

      <div className="surface-card p-5">
        <DoctorForm value={form} onChange={setForm} errors={errors} />
      </div>
    </div>
  );
}
