import {
  ButtonProps,
  ChipProps,
  AlertProps,
} from "@mui/material";
import { ReactNode } from "react";

export interface WorkflowAction {
  id: string;

  label: string;

  nextStatus: string;

  variant?: ButtonProps["variant"];

  color?: ButtonProps["color"];

  requiresReason?: boolean;

  requiresConfirmation?: boolean;

  requiresDecision?: boolean;

  reasons?: string[];
}

export interface StatusAlertConfig {
  severity: AlertProps["severity"];

  message: string;
}

export interface StatusStep {
  value: string;

  label: string;

  color?: ChipProps["color"];

  next?: string;

  terminal?: boolean;

  actions?: WorkflowAction[];

  alert?: StatusAlertConfig;
}

export interface StatusChangePayload {
  from: string;

  to: string;

  action?: string;

  reason?: string;

  remarks?: string;
}

export interface WorkflowStatusStepperProps {
  currentStatus: string;

  workflow: StatusStep[];

  onStatusChange: (
    payload: StatusChangePayload
  ) => void;

  disabled?: boolean;

  showButton?: boolean;

  buttonText?: string;

  actions?: ReactNode;
}