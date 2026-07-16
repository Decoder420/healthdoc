"use client";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { ButtonProps } from "@mui/material";

export interface StatusAction {
  id: string;
  label: string;

  variant?: ButtonProps["variant"];
  color?: ButtonProps["color"];

  disabled?: boolean;

  /** Optional icon */
  icon?: React.ReactNode;

  /** Whether confirmation is required */
  requiresConfirmation?: boolean;

  /** Whether reason selection is required */
  requiresReason?: boolean;
}

interface StatusActionMenuProps {
  actions: StatusAction[];
  onAction: (action: StatusAction) => void;
}

export default function StatusActionMenu({
  actions,
  onAction,
}: StatusActionMenuProps) {
  if (actions.length === 0) {
    return null;
  }

  return (
   <Stack
  direction="row"
  spacing={1}
  useFlexGap
  sx={{
    flexWrap: "wrap",
    justifyContent: "center",
  }}
>
      {actions.map((action) => (
        <Button
          key={action.id}
          size="small"
          variant={action.variant ?? "contained"}
          color={action.color ?? "primary"}
          disabled={action.disabled}
          startIcon={action.icon}
          onClick={() => onAction(action)}
          sx={{
            minWidth: 110,
            borderRadius: "999px",
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          {action.label}
        </Button>
      ))}
    </Stack>
  );
}