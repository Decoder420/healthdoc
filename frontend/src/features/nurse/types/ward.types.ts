// ward.types.ts
// Single source of truth for `Ward`. Maps to the `wards` table
// (Schema v3.5 §3, migration 0015): id, name, department_id, facility_id, is_active.
//
// Import this everywhere Ward is needed (BedGrid, WardSelector, WardStats, admission
// form, etc.) instead of redefining it per-component — avoids the mismatch we had
// where bedgrid.types.ts and WardSelector.types.ts each had their own, differently
// shaped `Ward`.
 
export interface Ward {
  id: string;
  name: string;
  department_id: string | null;
  facility_id: string;
  is_active: boolean;
}