"use client";

import { useState } from "react";
import type { ChangePasswordInput } from "@/features/profile/types";
import { changeStaffPassword, DEMO_STAFF_PASSWORD } from "@/features/profile/api";
import { FieldText, FormSection } from "@/components/ui/mui-field";
import { Button } from "@/components/ui/button";

type ProfilePasswordFormProps = {
  onDone?: () => void;
};

const emptyPasswordForm: ChangePasswordInput = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export function ProfilePasswordForm({ onDone }: ProfilePasswordFormProps) {
  const [form, setForm] = useState<ChangePasswordInput>(emptyPasswordForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleSubmit() {
    setError("");
    setSuccess("");
    const result = changeStaffPassword(form);
    if (!result.success) {
      setError(result.error);
      return;
    }
    setSuccess("Password updated successfully.");
    setForm(emptyPasswordForm);
    onDone?.();
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold text-foreground">Change Password</h2>
        <p className="text-xs text-muted-foreground">
          Keep your account secure. Demo current password: {DEMO_STAFF_PASSWORD}
        </p>
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

      <div className="surface-card p-6">
        <FormSection title="Password">
          <div className="grid max-w-xl gap-4">
            <FieldText
              required
              type="password"
              label="Current Password"
              value={form.currentPassword}
              onChange={(event) =>
                setForm({ ...form, currentPassword: event.target.value })
              }
            />
            <FieldText
              required
              type="password"
              label="New Password"
              value={form.newPassword}
              onChange={(event) =>
                setForm({ ...form, newPassword: event.target.value })
              }
              helperText="Minimum 8 characters"
            />
            <FieldText
              required
              type="password"
              label="Confirm New Password"
              value={form.confirmPassword}
              onChange={(event) =>
                setForm({ ...form, confirmPassword: event.target.value })
              }
            />
            <div>
              <Button type="button" onClick={handleSubmit}>
                Update Password
              </Button>
            </div>
          </div>
        </FormSection>
      </div>
    </div>
  );
}
