import { BED_STATUS_CLASSES, BED_STATUS_LABELS } from "./constants";
import type { Bed } from "./BedGrid.types";

type BedGridProps = {
  beds: Bed[];
  onBedClick?: (bed: Bed) => void;
};

export function BedGrid({ beds, onBedClick }: BedGridProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {beds.map((bed) => (
        <button
          key={bed.id}
          type="button"
          onClick={() => onBedClick?.(bed)}
          className={`rounded-xl border p-4 text-left transition hover:shadow-sm ${BED_STATUS_CLASSES[bed.status]}`}
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-sans text-sm font-semibold text-foreground">
                {bed.label}
              </p>
              <p className="text-xs text-muted-foreground">{bed.ward}</p>
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              {BED_STATUS_LABELS[bed.status]}
            </span>
          </div>
          {bed.patientName && (
            <p className="mt-3 text-sm text-foreground">{bed.patientName}</p>
          )}
        </button>
      ))}
    </div>
  );
}

export default BedGrid;
