import { BED_STATUS_STYLES } from "./constants";
import { Bed, BED_STATUS_LABELS } from "./BedGrid.types";

type BedGridProps = {
  beds: Bed[];
};

export default function BedGrid({
  beds,
}: BedGridProps) {
  if (beds.length === 0) {
    return (
      <div className="surface-card p-6">
        <p className="text-sm text-muted-foreground">
          No beds available.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {beds.map((bed) => (
        <div
          key={bed.bed_id}
          className="surface-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">
              {bed.bed_number}
            </h3>

            <span
              className={`rounded-full px-2 py-1 text-xs font-medium ${BED_STATUS_STYLES[bed.status]}`}
            >
              {BED_STATUS_LABELS[bed.status]}
            </span>
          </div>

          <div className="mt-3">
            <p className="text-sm text-muted-foreground">
              Patient
            </p>

            <p className="mt-1 text-sm font-medium">
              {bed.occupant?.patient_name ?? "Not assigned"}
            </p>

            {/* UHID, not the name alone: two patients on a ward share a name
                more often than anyone expects, and the bed board is where a
                drug is about to be given to one of them. */}
            {bed.occupant?.uhid && (
              <p className="text-xs text-muted-foreground">
                {bed.occupant.uhid}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}