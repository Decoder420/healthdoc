"use client";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import type { ButtonProps } from "@mui/material";

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

/** Explicit fills so Tailwind/Bootstrap cannot strip MUI palette colors. */
const CONTAINED_COLORS: Partial<
  Record<NonNullable<ButtonProps["color"]>, { bg: string; color: string; hover: string }>
> = {
  primary: { bg: "#001f54", color: "#ffffff", hover: "#001536" },
  secondary: { bg: "#4a6282", color: "#ffffff", hover: "#3a4f68" },
  success: { bg: "#166534", color: "#ffffff", hover: "#14532d" },
  error: { bg: "#b91c1c", color: "#ffffff", hover: "#991b1b" },
  warning: { bg: "#b45309", color: "#ffffff", hover: "#92400e" },
  info: { bg: "#1d4ed8", color: "#ffffff", hover: "#1e40af" },
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
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "nowrap",   // Keep buttons in one line
    width: "100%",
    overflowX: "auto",    // Allows horizontal scroll if there isn't enough space
    "&::-webkit-scrollbar": {
      display: "none",
    },
    scrollbarWidth: "none",
  }}
>
      {actions.map((action) => {
        const color = action.color ?? "primary";
        const variant = action.variant ?? "contained";
        const palette = CONTAINED_COLORS[color];

        return (
          <Button
            key={action.id}
            size="small"
            variant={variant}
            color={color}
            disabled={action.disabled}
            startIcon={action.icon}
            onClick={() => onAction(action)}
            sx={{
  minWidth: 70,
  height: 28,
  px: 1,
  py: 0.25,
  fontSize: "0.75rem",
  lineHeight: 1,
  whiteSpace: "nowrap",
  flexShrink: 0,
  borderRadius: "999px",
  textTransform: "none",
  fontWeight: 600,
  ...(variant === "contained" && palette
    ? {
        bgcolor: `${palette.bg} !important`,
        color: `${palette.color} !important`,
        "&:hover": {
          bgcolor: `${palette.hover} !important`,
        },
      }
    : {}),
}}
          >
            {action.label}
          </Button>
        );
      })}
    </Stack>
  );
}
