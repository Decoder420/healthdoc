/**
 * DPDP governance: the data protection officer, grievances, consent managers.
 *
 * These are statutory obligations rather than conveniences. The Act requires a
 * data fiduciary to HAVE a published DPO and a grievance-redressal mechanism —
 * the schema has carried all three tables since migration 0022a, and until now
 * nothing could read or write any of them, so the database looked as though the
 * hospital had a DPO when it had never named one.
 *
 * Shapes from app/dpdp/schemas.py.
 */

/** GrievanceType in app/common/enums.py. */
export type GrievanceType =
  | "access"
  | "correction"
  | "erasure"
  | "consent"
  | "breach"
  | "other";

/** GrievanceStatus. `escalated_dpb` is escalation to the Data Protection Board. */
export type GrievanceStatus =
  | "pending"
  | "under_review"
  | "resolved"
  | "escalated_dpb"
  | "closed";

export interface Dpo {
  id: string;
  facility_id: string;
  user_id: string;
  appointed_at: string;
  /**
   * Whether the contact is published to data principals.
   *
   * The server enforces the pair: contact_published=true REQUIRES
   * published_contact, and a contact without the flag is refused. A DPO whose
   * contact is not published is one a patient cannot reach, which is most of
   * what the obligation is for.
   */
  contact_published: boolean;
  published_contact: string | null;
  is_active: boolean;
  created_by: string;
  updated_by: string | null;
  created_at: string;
}

export interface AppointDpoInput {
  user_id: string;
  /** Set when succeeding a sitting DPO, so the handover is recorded rather
   *  than the previous appointment simply vanishing from the active read. */
  replaces_dpo_id: string | null;
  contact_published: boolean;
  published_contact: string | null;
}

export interface Grievance {
  id: string;
  grievance_number: string;
  patient_id: string;
  facility_id: string;
  grievance_type: GrievanceType;
  description: string;
  status: GrievanceStatus;
  assigned_to: string | null;
  /** The SLA deadline. Supplied at creation — the Act sets response periods
   *  and this system does not invent one. */
  due_at: string;
  resolution: string | null;
}

export interface RaiseGrievanceInput {
  patient_id: string;
  grievance_type: GrievanceType;
  description: string;
  due_at: string;
  assigned_to: string | null;
}

export interface GrievanceTransitionInput {
  status: GrievanceStatus;
  resolution: string | null;
  escalation_reason: string | null;
  assigned_to: string | null;
}

export interface ConsentManager {
  id: string;
  cm_registration_id: string;
  name: string;
  endpoint_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RegisterConsentManagerInput {
  cm_registration_id: string;
  name: string;
  endpoint_url: string | null;
}

export interface UpdateConsentManagerInput {
  name?: string;
  endpoint_url?: string | null;
  is_active?: boolean;
}
