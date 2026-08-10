import type { Admission } from "@/features/ipd/services/ipd.service";

export const MOCK_ADMISSIONS: Admission[] = [
  {
    id: "adm-1",
    visit_id: "visit-1001",
    patient_id: "patient-1001",
    ward_id: "general",
    bed_id: "1", // B-101
    admitted_at: "2026-07-12T10:00:00Z",
    reason: "Observation",
    status: "admitted",
  },
  {
    id: "adm-2",
    visit_id: "visit-1002",
    patient_id: "patient-1002",
    ward_id: "icu",
    bed_id: "3", // I-201
    admitted_at: "2026-07-16T09:00:00Z",
    reason: "Post-op monitoring",
    status: "admitted",
  },
  {
    id: "adm-3",
    visit_id: "visit-1003",
    patient_id: "patient-1003",
    ward_id: "ccu",
    bed_id: "5", // C-301
    admitted_at: "2026-08-01T14:30:00Z",
    reason: "Cardiac monitoring",
    status: "admitted",
  },
];
