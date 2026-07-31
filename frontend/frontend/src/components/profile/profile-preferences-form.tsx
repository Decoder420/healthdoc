"use client";

import type { StaffProfile } from "@/features/profile/types";
import { FieldSelect, FormSection } from "@/components/ui/mui-field";
import { Button } from "@/components/ui/button";

type ProfilePreferencesFormProps = {
  preferences: StaffProfile["preferences"];
  error?: string;
  success?: string;
  onChange: (preferences: StaffProfile["preferences"]) => void;
  onSave: () => void;
};

export function ProfilePreferencesForm({
  preferences,
  error,
  success,
  onChange,
  onSave,
}: ProfilePreferencesFormProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">Preferences</h2>
          <p className="text-xs text-muted-foreground">
            Notification and language settings for your account.
          </p>
        </div>
        <Button type="button" onClick={onSave}>
          Save Preferences
        </Button>
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

      <div className="surface-card space-y-6 p-6">
        <FormSection title="Notifications">
          <div className="space-y-3">
            <label className="flex items-center gap-3 text-sm text-foreground">
              <input
                type="checkbox"
                checked={preferences.emailNotifications}
                onChange={(event) =>
                  onChange({
                    ...preferences,
                    emailNotifications: event.target.checked,
                  })
                }
                className="h-4 w-4 accent-[var(--primary)]"
              />
              Email notifications
            </label>
            <label className="flex items-center gap-3 text-sm text-foreground">
              <input
                type="checkbox"
                checked={preferences.smsNotifications}
                onChange={(event) =>
                  onChange({
                    ...preferences,
                    smsNotifications: event.target.checked,
                  })
                }
                className="h-4 w-4 accent-[var(--primary)]"
              />
              SMS notifications
            </label>
          </div>
        </FormSection>

        <FormSection title="Language">
          <div className="max-w-sm">
            <FieldSelect
              label="Preferred Language"
              value={preferences.language}
              onChange={(event) =>
                onChange({
                  ...preferences,
                  language: event.target.value as StaffProfile["preferences"]["language"],
                })
              }
              options={[
                { value: "en", label: "English" },
                { value: "hi", label: "Hindi" },
              ]}
            />
          </div>
        </FormSection>
      </div>
    </div>
  );
}
