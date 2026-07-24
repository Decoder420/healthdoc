// WardSelector.types.ts
// Ward maps to the `wards` table — HealthDoc_Database_Schema_v3_5.docx §3, migration 0015.
// Single source of truth for `Ward` — import this everywhere Ward is needed
// (BedGrid, WardStats, admission form, etc.) instead of redefining it per-file.

export interface Ward {
  id: string;
  name: string;
  department_id: string | null;
  facility_id: string;
  is_active: boolean;
}

export interface WardSelectorProps {
  wards: Ward[];
  selectedWard: string;
  onChange: (wardId: string) => void;
}