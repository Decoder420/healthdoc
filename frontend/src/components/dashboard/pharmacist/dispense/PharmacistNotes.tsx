"use client";

interface PharmacistNotesProps {
  notes: string;
  onNotesChange: (notes: string) => void;
}

export default function PharmacistNotes({
  notes,
  onNotesChange,
}: PharmacistNotesProps) {
  return (
    <div className="surface-card p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">
          Pharmacist Notes
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Add any remarks related to dispensing, stock shortages, or patient instructions.
        </p>
      </div>

      <textarea
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        placeholder="Enter pharmacist notes..."
        rows={5}
        className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary"
      />
    </div>
  );
}