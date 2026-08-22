import { api, newIdempotencyKey } from "../../../../lib/api";

import type { AddVitalsSchema } from "@/features/nurse/components/AddVitalsForm/validation";
import type { AddPatientMovementSchema } from "@/components/AddPatientMovementForm/validation";
import type { AddHandoverSchema } from "@/features/nurse/components/AddHandoverForm/validation";
import type { AddIntakeOutputSchema } from "@/features/nurse/components/AddIntakeOutputForm/validation";
import type { AddProcedureAssistanceSchema } from "@/features/nurse/components/AddProcedureAssistanceForm/validation";
import type { AddNursingNoteSchema } from "@/features/nurse/components/AddNursingNoteForm/validation";
import type { VitalRecord } from "@/components/VitalsTimeline/VitalsTimeline.types";
import type { MedicationRecord } from "@/components/tables/EMARTable/EMARTable.types";
import type { DischargeSummary } from "@/features/ipd/services/ipd.service";

export interface Vitals {
  id: string;
  patient_id: string;
  encounter_id: string | null;
  admission_id: string | null;
  measured_at: string;
  temp_c: number | null;
  pulse_bpm: number | null;
  resp_rate: number | null;
  bp_systolic: number | null;
  bp_diastolic: number | null;
  spo2_pct: number | null;
  pain_score: number | null;
  bmi: number | null;
  whr: number | null;
}

export interface NursingHandoverNote {
  id: string;
  admission_id: string;
  shift: "morning" | "evening" | "night";
  situation: string;
  background: string;
  assessment: string;
  recommendation: string;
  handed_over_to: string;
  created_by?: string;
  created_at?: string;
}

export interface IntakeOutputRecord {
  id: string;
  admission_id: string;
  recorded_at: string;
  entry_type:
    | "intake_oral"
    | "intake_iv"
    | "output_urine"
    | "output_drain"
    | "output_other";
  volume_ml: number;
  notes: string | null;
  created_by?: string;
  created_at?: string;
}

export interface PatientMovementLog {
  id: string;
  admission_id: string;
  from_ward_id: string | null;
  from_bed_id: string | null;
  to_ward_id: string;
  to_bed_id: string;
  moved_at: string;
  reason: string | null;
  moved_by: string;
}

export interface AdmissionTransferResult {
  id: string;
  visit_id: string;
  patient_id: string;
  ward_id: string;
  bed_id: string;
  admitted_at: string;
  reason: string | null;
  status: string;
}

export interface FluidBalance {
  admission_id: string;
  total_intake_ml: number;
  total_output_ml: number;
  net_ml: number;
}

export interface ProcedureRecord {
  id: string;
  order_id: string | null;
  encounter_id: string;
  patient_id: string;
  procedure_name: string;
  procedure_code: string | null;
  code_system: string | null;
  setting: "opd_minor" | "bedside" | "emergency" | "ot";
  ot_schedule_id: string | null;
  performed_by: string;
  assisted_by: string | null;
  started_at: string;
  ended_at: string | null;
  outcome: string | null;
  complications: string | null;
}

// clinical_notes → Mongo, keyed by encounter_id (per schema doc). URL not
// documented — confirm with backend, same as the other unconfirmed
// endpoints below.
export interface NursingNote {
  id: string;
  encounter_id: string;
  patient_id: string;
  category: string;
  priority: string;
  note: string;
  created_by?: string;
  created_at?: string;
}

export interface NursingTask {
  id: string;
  patient_id: string;
  encounter_id: string | null;
  order_type: string;
  priority: "routine" | "urgent" | "stat";
  status: "placed" | "accepted" | "in_progress" | "completed" | "cancelled";
  ordered_at: string;
  accepted_at: string | null;
  accepted_by: string | null;
  completed_at: string | null;
  completed_by: string | null;
  completion_note: string | null;
}

export class UnsupportedWorkflowError extends Error {
  constructor(workflow: string) {
    super(`${workflow} is disabled until a backend contract is published`);
    this.name = "UnsupportedWorkflowError";
  }
}

export async function getNursingTasks(patientId?: string) {
  if (patientId) {
    return api<NursingTask[]>(
      `/nursing/tasks?patient_id=${encodeURIComponent(patientId)}`,
    );
  }
  return api<NursingTask[]>("/nursing/tasks");
}

export async function getPatientVitals(patientId: string) {
  return api<VitalRecord[]>(`/nursing/patients/${patientId}/vitals`);
}

export async function getAdmissionFluidBalance(admissionId: string) {
  return api<FluidBalance>(`/nursing/admissions/${admissionId}/fluid-balance`);
}

export async function getAdmissionMedicationAdministrations(admissionId: string) {
  return api<MedicationRecord[]>(
    `/nursing/admissions/${admissionId}/medication-administrations`,
  );
}

export async function getAdmissionSummary(admissionId: string) {
  return api<DischargeSummary>(`/admissions/${admissionId}/discharge-summary`);
}

export async function completeNursingTask(orderId: string, note?: string) {
  return api<NursingTask>(`/nursing/tasks/${orderId}/complete`, {
    method: "POST",
    body: JSON.stringify({ note: note ?? null }),
    idempotencyKey: newIdempotencyKey(),
  });
}

export async function addVitals(data: AddVitalsSchema) {
  return api<Vitals>("/nursing/vitals", {
    method: "POST",
    body: JSON.stringify(data),
    idempotencyKey: newIdempotencyKey(),
  });
}

export async function addHandover(data: AddHandoverSchema) {
  void data;
  throw new UnsupportedWorkflowError("Nursing handover entry");
}


export async function addIntakeOutput(data: AddIntakeOutputSchema) {
  return api<IntakeOutputRecord>("/nursing/intake-output", {
    method: "POST",
    body: JSON.stringify(data),
    idempotencyKey: newIdempotencyKey(),
  });
}

export async function addPatientMovement(data: AddPatientMovementSchema) {
  return api<AdmissionTransferResult>(
    `/admissions/${data.admission_id}/transfer`,
    {
    method: "POST",
      body: JSON.stringify({
        to_ward_id: data.to_ward_id,
        to_bed_id: data.to_bed_id,
        reason: data.reason ?? null,
      }),
      idempotencyKey: newIdempotencyKey(),
    },
  );
}

export async function addProcedureAssistance(data: AddProcedureAssistanceSchema) {
  void data;
  throw new UnsupportedWorkflowError("Procedure assistance entry");
}

export async function addNursingNote(data: AddNursingNoteSchema) {
  void data;
  throw new UnsupportedWorkflowError("Nursing note entry");
}
