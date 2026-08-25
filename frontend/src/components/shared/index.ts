/**
 * Cross-module shared widgets — StatusStepper, barcode, lab report viewer.
 * Prefer `@/components/ui` for primitives; use this barrel for workflow/report UI.
 */

export { default as BarcodeDisplay } from "./BarcodeDisplay";

export { default as WorkflowStatusStepper } from "./StatusStepper/WorkflowStatusStepper";
export { default as WorkflowStatusAction } from "./StatusStepper/WorkflowStatusAction";
export { default as StatusActionMenu } from "./StatusStepper/StatusActionMenu";
export { default as StatusAlert } from "./StatusStepper/StatusAlert";
export { default as WorkflowStatusChip } from "./StatusStepper/StatusChip";
export { default as ConfirmationDialog } from "./StatusStepper/dialog/ConfirmationDialog";
export { default as FormDialog } from "./StatusStepper/dialog/FormDialog";
export { default as ReasonSelectionDialog } from "./StatusStepper/dialog/ReasonSelectionDialog";
export { default as StatusDecisionDialog } from "./StatusStepper/dialog/StatusDecisionDialog";
export type {
  StatusStep,
  WorkflowAction,
  StatusChangePayload,
  WorkflowStatusStepperProps,
  StatusAlertConfig,
} from "./StatusStepper/types";

export { default as LabReportViewer } from "./labreportviewer/report";
export { default as LabReportDownloadPdfButton } from "./labreportviewer/DownloadPdfButton";
export type { ReportData as LabReportData } from "./labreportviewer/types/report";
