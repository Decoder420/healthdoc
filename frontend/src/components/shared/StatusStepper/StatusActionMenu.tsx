"use client";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import type { ButtonProps } from "@mui/material";

import { meridian } from "@/styles/theme";

export interface StatusAction {
  id: string;
  label: string;
  variant?: ButtonProps["variant"];
  color?: ButtonProps["color"];
  disabled?: boolean;
  icon?: React.ReactNode;
  requiresConfirmation?: boolean;
  requiresReason?: boolean;
}

interface StatusActionMenuProps {
  actions: StatusAction[];
  onAction: (action: StatusAction) => void;
}

/** Matches ExportButton / toast trigger button chrome. */
export const workflowActionButtonSx = {
  textTransform: "none" as const,
  fontWeight: 600,
  letterSpacing: "0.01em",
  borderRadius: "10px",
  px: 1.75,
  minWidth: 110,
  borderColor: "rgb(0 31 84 / 0.18)",
  backgroundColor: meridian.surface,
  boxShadow: "0 1px 2px rgb(0 31 84 / 0.04)",
  "&:hover": {
    backgroundColor: meridian.muted,
    boxShadow: "0 4px 12px rgb(0 31 84 / 0.08)",
  },
};

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
          variant={action.variant ?? "outlined"}
          color={action.color ?? "primary"}
          disabled={action.disabled}
          startIcon={action.icon}
          onClick={() => onAction(action)}
          sx={{
            ...workflowActionButtonSx,
            ...(action.color === "error"
              ? {
                  color: meridian.danger,
                  borderColor: "rgb(185 28 28 / 0.28)",
                  "&:hover": {
                    borderColor: meridian.danger,
                    backgroundColor: "#fef2f2",
                    boxShadow: "0 4px 12px rgb(185 28 28 / 0.1)",
                  },
                }
              : action.color === "warning"
                ? {
                    color: meridian.warning,
                    borderColor: "rgb(180 83 9 / 0.3)",
                    "&:hover": {
                      borderColor: meridian.warning,
                      backgroundColor: "#fffbeb",
                      boxShadow: "0 4px 12px rgb(180 83 9 / 0.1)",
                    },
                  }
                : {
                    color: meridian.brandPrimary,
                    "&:hover": {
                      borderColor: meridian.brandPrimary,
                      backgroundColor: meridian.muted,
                      boxShadow: "0 4px 12px rgb(0 31 84 / 0.08)",
                    },
                  }),
          }}
        >
          {action.label}
        </Button>
      ))}
    </Stack>
  );
}
