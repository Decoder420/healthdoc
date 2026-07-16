"use client";

import { FieldSelect, FieldText, FormSection } from "@/components/ui/mui-field";
import { WebcamCapture } from "@/components/receptionist/opd-workflow/webcam-capture";
import { departments } from "@/features/opd/data/mock-doctors";
import {
  WEEK_DAYS,
  type DoctorFieldErrors,
  type DoctorFormInput,
} from "@/features/doctors/types";
import { cn } from "@/lib/utils/cn";

type DoctorFormProps = {
  value: DoctorFormInput;
  onChange: (value: DoctorFormInput) => void;
  errors?: DoctorFieldErrors;
};

export function DoctorForm({ value, onChange, errors = {} }: DoctorFormProps) {
  function toggleDay(day: string) {
    const days = value.availability.days.includes(day)
      ? value.availability.days.filter((item) => item !== day)
      : [...value.availability.days, day];
    onChange({
      ...value,
      availability: { ...value.availability, days },
    });
  }

  return (
    <div className="space-y-6">
      <FormSection title="Identity" description="Basic doctor profile details.">
        <div className="grid gap-4 md:grid-cols-2">
          <FieldText
            label="Full Name"
            value={value.name}
            onChange={(event) => onChange({ ...value, name: event.target.value })}
            errorText={errors.name}
            placeholder="Dr. Full Name"
          />
          <FieldSelect
            label="Gender"
            value={value.gender}
            onChange={(event) =>
              onChange({
                ...value,
                gender: event.target.value as DoctorFormInput["gender"],
              })
            }
            options={[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
              { value: "other", label: "Other" },
            ]}
            errorText={errors.gender}
          />
          <FieldText
            label="Email"
            type="email"
            value={value.email}
            onChange={(event) => onChange({ ...value, email: event.target.value })}
            errorText={errors.email}
          />
          <FieldText
            label="Mobile"
            value={value.phone}
            onChange={(event) => onChange({ ...value, phone: event.target.value })}
            errorText={errors.phone}
            placeholder="10-digit mobile"
          />
          <FieldText
            label="License Number"
            value={value.licenseNumber}
            onChange={(event) =>
              onChange({ ...value, licenseNumber: event.target.value })
            }
            errorText={errors.licenseNumber}
          />
          <FieldSelect
            label="Status"
            value={value.status}
            onChange={(event) =>
              onChange({
                ...value,
                status: event.target.value as DoctorFormInput["status"],
              })
            }
            options={[
              { value: "active", label: "Active" },
              { value: "on_leave", label: "On Leave" },
              { value: "inactive", label: "Inactive" },
            ]}
            errorText={errors.status}
          />
        </div>
      </FormSection>

      <FormSection title="Clinical" description="Department, specialty, and fees.">
        <div className="grid gap-4 md:grid-cols-2">
          <FieldSelect
            label="Department"
            value={value.departmentId}
            onChange={(event) =>
              onChange({ ...value, departmentId: event.target.value })
            }
            options={[
              { value: "", label: "Select department" },
              ...departments.map((department) => ({
                value: department.id,
                label: `${department.name} (${department.code})`,
              })),
            ]}
            errorText={errors.departmentId}
          />
          <FieldText
            label="Specialization"
            value={value.specialization}
            onChange={(event) =>
              onChange({ ...value, specialization: event.target.value })
            }
            errorText={errors.specialization}
          />
          <FieldText
            label="Qualification"
            value={value.qualification}
            onChange={(event) =>
              onChange({ ...value, qualification: event.target.value })
            }
            errorText={errors.qualification}
            placeholder="MBBS, MD"
          />
          <FieldText
            label="Experience (years)"
            type="number"
            value={value.experienceYears || ""}
            onChange={(event) =>
              onChange({
                ...value,
                experienceYears: Number(event.target.value) || 0,
              })
            }
            errorText={errors.experienceYears}
          />
          <FieldText
            label="Consultation Fee (₹)"
            type="number"
            value={value.consultationFee || ""}
            onChange={(event) =>
              onChange({
                ...value,
                consultationFee: Number(event.target.value) || 0,
              })
            }
            errorText={errors.consultationFee}
          />
          <FieldText
            label="Joining Date"
            type="date"
            value={value.joiningDate}
            onChange={(event) =>
              onChange({ ...value, joiningDate: event.target.value })
            }
            errorText={errors.joiningDate}
            InputLabelProps={{ shrink: true }}
          />
        </div>
      </FormSection>

      <FormSection
        title="Availability"
        description="OPD days and consultation window."
      >
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {WEEK_DAYS.map((day) => {
              const selected = value.availability.days.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={cn(
                    "rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
                    selected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-foreground hover:bg-muted",
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>
          {errors.days && (
            <p className="text-xs text-danger">{errors.days}</p>
          )}
          <div className="grid gap-4 md:grid-cols-2">
            <FieldText
              label="Start Time"
              type="time"
              value={value.availability.startTime}
              onChange={(event) =>
                onChange({
                  ...value,
                  availability: {
                    ...value.availability,
                    startTime: event.target.value,
                  },
                })
              }
              errorText={errors.startTime}
              InputLabelProps={{ shrink: true }}
            />
            <FieldText
              label="End Time"
              type="time"
              value={value.availability.endTime}
              onChange={(event) =>
                onChange({
                  ...value,
                  availability: {
                    ...value.availability,
                    endTime: event.target.value,
                  },
                })
              }
              errorText={errors.endTime}
              InputLabelProps={{ shrink: true }}
            />
          </div>
        </div>
      </FormSection>

      <FormSection title="Contact & Photo">
        <FieldText
          label="Address"
          value={value.address}
          onChange={(event) => onChange({ ...value, address: event.target.value })}
          errorText={errors.address}
          multiline
          minRows={2}
        />
        <WebcamCapture
          photo={value.photo}
          onCapture={(photo) => onChange({ ...value, photo })}
          onClear={() => onChange({ ...value, photo: "" })}
        />
      </FormSection>
    </div>
  );
}
