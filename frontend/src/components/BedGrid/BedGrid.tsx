import { BED_STATUS_STYLES } from "./constants";
import { BedGridProps } from "./BedGrid.types";

const FALLBACK_STATUS_STYLE = "bg-muted text-muted-foreground";

export default function BedGrid({
  beds,
  selectedBedId,
  onBedClick,
}: BedGridProps) {
  if (beds.length === 0) {
    return (
      <div className="surface-card p-6">
        <p className="text-sm text-muted-foreground">No beds available.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {beds.map((bed) => {
        const isSelected = selectedBedId === bed.id;
        const isInteractive = !!onBedClick;

        return (
          <button
            key={bed.id}
            type="button"
            onClick={() => onBedClick?.(bed)}
            disabled={!isInteractive}
            aria-pressed={isInteractive ? isSelected : undefined}
            className={`
              surface-card
              p-4
              text-left
              transition-all
              ${isInteractive ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-md" : "cursor-default"}
              ${isSelected ? "ring-2 ring-primary" : ""}
            `}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold">{bed.bed_number}</h3>

              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${
                  BED_STATUS_STYLES[bed.status] ?? FALLBACK_STATUS_STYLE
                }`}
              >
                {bed.status}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
