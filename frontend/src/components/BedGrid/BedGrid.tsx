import { BED_STATUS_STYLES } from "./constants";
import { Bed } from "./BedGrid.types";

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
   // <div className="grid grid-cols-2 gap-4">
   <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {beds.map((bed) => (
        <div
          key={bed.id}
          className="surface-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
          // className="surface-card p-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">
              {bed.bedNumber}
            </h3>

            <span
              className={`rounded-full px-2 py-1 text-xs font-medium ${BED_STATUS_STYLES[bed.status]}`}
            >
              {bed.status}
            </span>
          </div>

          <div className="mt-3">
            <p className="text-sm text-muted-foreground">
              Patient
            </p>

            <p className="mt-1 text-sm font-medium">
              {bed.patientName ??
                "Not Assigned"}
            </p>
          </div>

          {bed.wardName && (
            <div className="mt-3">
              <p className="text-sm text-muted-foreground">
                Ward
              </p>

              <p className="text-sm">
                {bed.wardName}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}