"use client";

import { useState } from "react";
import type { DoctorFormInput, DoctorProfile } from "@/features/doctors/types";
import { updateDoctor, validateDoctorForm } from "@/features/doctors/api";
import { toDoctorFormInput } from "@/features/doctors/data/mock-doctors";
import type { DoctorFieldErrors } from "@/features/doctors/types";
import { Button } from "@/components/ui/button";
import { DoctorForm } from "@/components/doctors/doctor-form";
import { DoctorProfileSummary } from "@/components/doctors/doctor-profile-summary";

type DoctorDetailPanelProps = {
  doctor: DoctorProfile;
  onClose: () => void;
  onUpdated: (doctor: DoctorProfile) => void;
  canEdit?: boolean;
};

export function DoctorDetailPanel({
  doctor,
  onClose,
  onUpdated,
  canEdit = false,
}: DoctorDetailPanelProps) {
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [form, setForm] = useState<DoctorFormInput>(() => toDoctorFormInput(doctor));
  const [errors, setErrors] = useState<DoctorFieldErrors>({});
  const [error, setError] = useState("");

  function startEdit() {
    if (!canEdit) return;
    setForm(toDoctorFormInput(doctor));
    setErrors({});
    setError("");
    setMode("edit");
  }

  function handleSave() {
    if (!canEdit) return;
    const validation = validateDoctorForm(form);
    setErrors(validation.errors);
    if (!validation.valid) {
      setError(validation.firstError ?? "Please fix the highlighted fields.");
      return;
    }

    const result = updateDoctor(doctor.id, form);
    if (!result.success) {
      setError(result.error);
      if (result.errors) setErrors(result.errors);
      return;
    }

    onUpdated(result.doctor);
    setMode("view");
    setError("");
  }

  return (
    <div className="surface-card space-y-5 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Doctor Profile</p>
          <h2 className="text-xl font-semibold text-foreground">{doctor.name}</h2>
          <p className="text-sm text-muted-foreground">{doctor.employeeId}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {mode === "view" ? (
            <>
              {canEdit && (
                <Button type="button" variant="outline" onClick={startEdit}>
                  Edit Profile
                </Button>
              )}
              <Button type="button" variant="ghost" onClick={onClose}>
                Close
              </Button>
            </>
          ) : (
            <>
              <Button type="button" variant="secondary" onClick={() => setMode("view")}>
                Cancel
              </Button>
              <Button type="button" onClick={handleSave}>
                Save Changes
              </Button>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-danger/30 bg-danger-muted/30 p-3 text-sm text-danger">
          {error}
        </div>
      )}

      {mode === "view" ? (
        <DoctorProfileSummary doctor={doctor} />
      ) : (
        <DoctorForm value={form} onChange={setForm} errors={errors} />
      )}
    </div>
  );
}
