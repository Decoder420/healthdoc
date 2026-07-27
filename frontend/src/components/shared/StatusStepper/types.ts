import {
  AlertProps,
  ButtonProps,
  ChipProps,
} from "@mui/material";
import { ReactNode } from "react";

/* -------------------------------------------------------------------------- */
/* Workflow Action */
/* -------------------------------------------------------------------------- */

export interface WorkflowAction {
  /** Unique action id */
  id: string;

  /** Button label */
  label: string;

  /** Status after action */
  nextStatus: string;

  /** Optional API action name */
  apiAction?: string;

  /** Button appearance */
  variant?: ButtonProps["variant"];
  color?: ButtonProps["color"];

  /** UI behaviour */
  disabled?: boolean;
  hidden?: boolean;

  /** Confirmation dialog */
  requiresConfirmation?: boolean;

  /** Reason dialog */
  requiresReason?: boolean;

  /** Accept / Reject dialog */
  requiresDecision?: boolean;

  /** Dropdown reasons */
  reasons?: string[];

  /** Optional remarks */
  requiresRemarks?: boolean;

  /** Optional icon */
  icon?: ReactNode;
}

/* -------------------------------------------------------------------------- */
/* Status Alert */
/* -------------------------------------------------------------------------- */

export interface StatusAlertConfig {
  severity: AlertProps["severity"];

  message: string;
}

/* -------------------------------------------------------------------------- */
/* Workflow Step */
/* -------------------------------------------------------------------------- */

export interface StatusStep {
  /** Internal status */
  value: string;

  /** Display name */
  label: string;

  /** Chip color */
  color?: ChipProps["color"];

  /** Default next step */
  next?: string;

  /** Terminal status */
  terminal?: boolean;

  /** Available actions */
  actions?: WorkflowAction[];

  /** Alert */
  alert?: StatusAlertConfig;
}

/* -------------------------------------------------------------------------- */
/* Status Change Payload */
/* -------------------------------------------------------------------------- */

export interface StatusChangePayload {
  from: string;

  to: string;

  /** Action performed */
  action?: string;

  /** Selected reason */
  reason?: string;

  /** Remarks */
  remarks?: string;
}

/* -------------------------------------------------------------------------- */
/* Status Stepper */
/* -------------------------------------------------------------------------- */

export interface WorkflowStatusStepperProps {
  currentStatus: string;

  workflow: StatusStep[];

  disabled?: boolean;

  showButton?: boolean;

  buttonText?: string;

  actions?: ReactNode;

  onStatusChange: (
    payload: StatusChangePayload
  ) => void;
}

/* -------------------------------------------------------------------------- */
/* Action Component */
/* -------------------------------------------------------------------------- */

export interface WorkflowStatusStepperProps {
  currentStatus: string;

  workflow: StatusStep[];

  actions?: ReactNode;
}

/* -------------------------------------------------------------------------- */
/* Status Chip */
/* -------------------------------------------------------------------------- */

export interface StatusChipProps {
  status: string;

  workflow: StatusStep[];

  size?: ChipProps["size"];

  variant?: ChipProps["variant"];
}

/* -------------------------------------------------------------------------- */
/* Status Alert */
/* -------------------------------------------------------------------------- */

export interface StatusAlertProps {
  status: string;

  workflow: StatusStep[];

  reason?: string;
}