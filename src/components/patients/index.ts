export { PatientsModule } from "./patients-module";
export { PatientStats } from "./patient-stats";
export { PatientFilters } from "./patient-filters";
export type { PatientFilterState } from "./patient-filters";
export { PatientList } from "./patient-list";
export { PatientDetailPanel } from "./patient-detail-panel";
export { RegisterPatientFlow } from "./register-patient-flow";

// Re-export shared patient UI used across OPD + Patients modules
export { PatientRegistrationForm } from "@/components/receptionist/opd-workflow/patient-registration-form";
export { PatientProfileSummary } from "@/components/receptionist/opd-workflow/patient-profile-summary";
export { CreateAbhaPanel } from "@/components/receptionist/opd-workflow/create-abha-panel";
export { WebcamCapture } from "@/components/receptionist/opd-workflow/webcam-capture";
export { SearchPatientStep } from "@/components/receptionist/opd-workflow/steps/search-patient-step";
