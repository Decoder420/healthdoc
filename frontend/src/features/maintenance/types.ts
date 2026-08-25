/**
 * Equipment maintenance logs (NABH). Shapes from app/maintenance/schemas.py.
 *
 * `machine_maintenance_logs` had no ORM model and no code at all until #455 —
 * one of the eight tables the schema declared and nothing touched. NABH expects
 * a service record per machine; a schema carrying the table without a way to
 * write to it reads as though the hospital keeps one.
 */

/** MaintenanceType in app/common/enums.py. */
export type MaintenanceType = "preventive" | "breakdown" | "calibration" | "qa_check";

export interface MaintenanceLog {
  id: string;
  /** Free text, not a foreign key — machines are labelled by the department
   *  that owns them (XR-01, CT-01) and there is no equipment register table. */
  machine_id: string;
  department_id: string;
  maintenance_type: string;
  performed_at: string;
  performed_by_vendor: string | null;
  /** Null means not recorded, which is NOT the same as zero downtime. */
  downtime_minutes: number | null;
  notes: string | null;
  created_by: string;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateMaintenanceLogInput {
  machine_id: string;
  department_id: string;
  maintenance_type: MaintenanceType;
  performed_at: string;
  performed_by_vendor: string | null;
  downtime_minutes: number | null;
  notes: string | null;
}
