"use client";

import { WebcamCapture } from "@/components/receptionist/opd-workflow/webcam-capture";
import { Button } from "@/components/ui/button";

type ProfilePhotoPanelProps = {
  photo: string;
  onCapture: (photo: string) => void;
  onClear: () => void;
  onSave: () => void;
  onCancel: () => void;
  error?: string;
  success?: string;
};

export function ProfilePhotoPanel({
  photo,
  onCapture,
  onClear,
  onSave,
  onCancel,
  error,
  success,
}: ProfilePhotoPanelProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">Profile Photo</h2>
          <p className="text-xs text-muted-foreground">
            Capture a live photo using webcam for your staff profile.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={onSave}>
            Save Photo
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

      <div className="surface-card p-6">
        <WebcamCapture
          photo={photo}
          onCapture={onCapture}
          onClear={onClear}
        />
      </div>
    </div>
  );
}
