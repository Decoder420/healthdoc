export type ProcedureSetting = "opd_minor" | "bedside" | "emergency" | "ot";

export interface ProcedureRecord {
  id: string;
  order_id: string | null; 
  encounter_id: string;
  patient_id: string;
  procedure_name: string;
  procedure_code: string | null;
  code_system: string | null;
  setting: ProcedureSetting;
  ot_schedule_id: string | null;
  performed_by: string; 
  assisted_by: string | null; 
  started_at: string;
  ended_at: string | null;
  outcome: string | null;
  complications: string | null;
}

export interface ProcedureAssistanceProps {
  patientId: string | null;
  records: ProcedureRecord[];
}