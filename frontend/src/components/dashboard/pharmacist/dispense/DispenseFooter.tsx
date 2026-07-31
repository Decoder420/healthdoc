"use client";

interface DispenseFooterProps {
  onCancel?: () => void;
  onSaveDraft?: () => void;
  onConfirm?: () => void;

  isSaving?: boolean;
  isConfirming?: boolean;
}

export default function DispenseFooter({
  onCancel,
  onSaveDraft,
  onConfirm,
  isSaving = false,
  isConfirming = false,
}: DispenseFooterProps) {
  return (
    <div className="surface-card p-6">
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          className="btn btn-outline"
          onClick={onCancel}
        >
          Cancel
        </button>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={onSaveDraft}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Draft"}
        </button>

        <button
          type="button"
          className="btn btn-primary"
          onClick={onConfirm}
          disabled={isConfirming}
        >
          {isConfirming ? "Dispensing..." : "Confirm Dispense"}
        </button>
      </div>
    </div>
  );
}