"use client";

import { departments } from "@/features/opd/data/mock-doctors";
import { getDoctorsByDepartment } from "@/features/opd/services/opd-service";
import type { Patient } from "@/features/patients/types";
import { Button } from "@/components/ui/button";
import {
  FormField,
  InfoCard,
  SelectInput,
} from "@/components/receptionist/opd-workflow/form-controls";

type DoctorSelectionStepProps = {
  patient: Patient;
  opdId: string;
  departmentId: string;
  doctorId: string;
  onDepartmentChange: (departmentId: string) => void;
  onDoctorChange: (doctorId: string) => void;
  onBack: () => void;
  onContinue: () => void;
};

export function DoctorSelectionStep({
  patient,
  opdId,
  departmentId,
  doctorId,
  onDepartmentChange,
  onDoctorChange,
  onBack,
  onContinue,
}: DoctorSelectionStepProps) {
  const availableDoctors = departmentId ? getDoctorsByDepartment(departmentId) : [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">OPD Registration</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          OPD ID has been generated. Select department and consulting doctor.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <InfoCard title="UHID">
          <p className="font-sans text-base font-semibold text-primary">{patient.uhid}</p>
        </InfoCard>
        <InfoCard title="Patient">
          <p className="font-sans text-base font-semibold text-foreground">{patient.name}</p>
        </InfoCard>
        <InfoCard title="OPD ID">
          <p className="font-sans text-base font-semibold text-foreground">{opdId}</p>
        </InfoCard>
      </div>

      <div className="surface-card grid gap-4 p-6 md:grid-cols-2">
        <FormField label="Department">
          <SelectInput
            value={departmentId}
            onChange={(event) => onDepartmentChange(event.target.value)}
          >
            <option value="">Select department</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </SelectInput>
        </FormField>

        <FormField label="Doctor">
          <SelectInput
            value={doctorId}
            onChange={(event) => onDoctorChange(event.target.value)}
            disabled={!departmentId}
          >
            <option value="">Select doctor</option>
            {availableDoctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name}
              </option>
            ))}
          </SelectInput>
        </FormField>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="button" variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button
          type="button"
          onClick={onContinue}
          disabled={!departmentId || !doctorId}
        >
          Generate Token
        </Button>
      </div>
    </div>
  );
}
