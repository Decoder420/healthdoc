"use client";

import type { StaffProfile, StaffProfileUpdateInput } from "@/features/profile/types";
import { FieldSelect, FieldText, FormSection } from "@/components/ui/mui-field";
import { Button } from "@/components/ui/button";

type ProfileEditFormProps = {
  profile: StaffProfile;
  form: StaffProfileUpdateInput;
  error?: string;
  success?: string;
  onChange: (form: StaffProfileUpdateInput) => void;
  onSave: () => void;
  onCancel: () => void;
};

export function ProfileEditForm({
  form,
  error,
  success,
  onChange,
  onSave,
  onCancel,
}: ProfileEditFormProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">Edit Profile</h2>
          <p className="text-xs text-muted-foreground">
            Update your personal and duty details.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={onSave}>
            Save Changes
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-danger/30 bg-danger-muted/30 p-3 text-sm text-danger">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-lg border border-success/30 bg-success-muted/30 p-3 text-sm text-success">
          {success}
        </div>
      )}

      <div className="surface-card space-y-8 p-6">
        <FormSection title="Personal Details">
          <div className="grid gap-4 md:grid-cols-2">
            <FieldText
              required
              label="Full Name"
              value={form.name}
              onChange={(event) => onChange({ ...form, name: event.target.value })}
            />
            <FieldSelect
              label="Gender"
              value={form.gender}
              onChange={(event) =>
                onChange({
                  ...form,
                  gender: event.target.value as StaffProfileUpdateInput["gender"],
                })
              }
              options={[
                { value: "female", label: "Female" },
                { value: "male", label: "Male" },
                { value: "other", label: "Other" },
              ]}
            />
            <FieldText
              required
              label="Email"
              type="email"
              value={form.email}
              onChange={(event) => onChange({ ...form, email: event.target.value })}
            />
            <FieldText
              required
              label="Mobile"
              value={form.phone}
              onChange={(event) => onChange({ ...form, phone: event.target.value })}
            />
            <FieldText
              label="Alternate Mobile"
              value={form.alternatePhone}
              onChange={(event) =>
                onChange({ ...form, alternatePhone: event.target.value })
              }
            />
            <FieldText
              label="Joining Date"
              type="date"
              value={form.joiningDate}
              onChange={(event) =>
                onChange({ ...form, joiningDate: event.target.value })
              }
            />
            <div className="md:col-span-2">
              <FieldText
                label="Address"
                multiline
                minRows={3}
                value={form.address}
                onChange={(event) => onChange({ ...form, address: event.target.value })}
              />
            </div>
          </div>
        </FormSection>

        <FormSection title="Duty Details">
          <div className="grid gap-4 md:grid-cols-2">
            <FieldText
              label="Department"
              value={form.department}
              onChange={(event) =>
                onChange({ ...form, department: event.target.value })
              }
            />
            <FieldText
              label="Designation"
              value={form.designation}
              onChange={(event) =>
                onChange({ ...form, designation: event.target.value })
              }
            />
            <FieldText
              label="Shift"
              value={form.shift}
              onChange={(event) => onChange({ ...form, shift: event.target.value })}
              placeholder="08:00 – 16:00"
            />
          </div>
        </FormSection>

        <FormSection title="Emergency Contact">
          <div className="grid gap-4 md:grid-cols-2">
            <FieldText
              label="Contact Name"
              value={form.emergencyContactName}
              onChange={(event) =>
                onChange({ ...form, emergencyContactName: event.target.value })
              }
            />
            <FieldText
              label="Contact Phone"
              value={form.emergencyContactPhone}
              onChange={(event) =>
                onChange({ ...form, emergencyContactPhone: event.target.value })
              }
            />
          </div>
        </FormSection>
      </div>
    </div>
  );
}
