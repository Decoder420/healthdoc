/**
 * Mirrors `BedGridOut` from `GET /wards/{ward_id}/beds`.
 *
 * Field names are the wire's, snake_case, matching the per-feature types under
 * `src/features`. No mapping layer: a mapper is where a field quietly stops
 * being copied.
 *
 * The imported version used "Occupied" | "Vacant" | "Reserved" | "Cleaning".
 * The backend's BedStatus enum has no "Cleaning" — it has `maintenance`, which
 * is a bed out of service, not one being turned around. A nurse reading
 * "Cleaning" on a broken bed plans to admit into it in ten minutes.
 */
export type BedStatus = "vacant" | "occupied" | "reserved" | "maintenance";

export const BED_STATUS_LABELS: Record<BedStatus, string> = {
  vacant: "Vacant",
  occupied: "Occupied",
  reserved: "Reserved",
  maintenance: "Out of service",
};

export interface BedOccupant {
  admission_id: string;
  patient_id: string;
  patient_name: string | null;
  uhid: string | null;
  admitted_at: string;
}

export interface Bed {
  bed_id: string;
  bed_number: string;
  status: BedStatus;
  /** null when the bed is not occupied. */
  occupant: BedOccupant | null;
}

export interface BedGridResponse {
  ward_id: string;
  items: Bed[];
}
