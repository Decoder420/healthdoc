"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { meridian } from "@/styles/theme";
import { subscribe, getSnapshot, dismiss, type ToastItem } from "./toast";

const SEVERITY_TONE: Record<
  ToastItem["severity"],
  { bg: string; border: string; icon: string }
> = {
  success: {
    bg: "#f0fdf4",
    border: "rgb(22 101 52 / 0.2)",
    icon: meridian.success,
  },
  error: {
    bg: "#fef2f2",
    border: "rgb(185 28 28 / 0.2)",
    icon: meridian.danger,
  },
  warning: {
    bg: "#fffbeb",
    border: "rgb(180 83 9 / 0.22)",
    icon: meridian.warning,
  },
  info: {
    bg: "#f4f7fb",
    border: "rgb(0 31 84 / 0.14)",
    icon: meridian.brandPrimary,
  },
};

/**
 * Mounted ONCE, globally, in components/providers.tsx.
 * Do not add another <Toaster /> in individual pages.
 */
export function Toaster() {
  const [items, setItems] = React.useState<ToastItem[]>(getSnapshot());

  React.useEffect(() => subscribe(setItems), []);

  if (items.length === 0) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 16,
        right: 16,
        zIndex: (theme) => theme.zIndex.snackbar,
        display: "flex",
        flexDirection: "column",
        gap: 1.25,
        width: 360,
        maxWidth: "calc(100vw - 32px)",
      }}
    >
      {items.map((item) => {
        const tone = SEVERITY_TONE[item.severity];
        return (
          <Alert
            key={item.id}
            severity={item.severity}
            variant="standard"
            onClose={() => dismiss(item.id)}
            sx={{
              borderRadius: "12px",
              border: `1px solid ${tone.border}`,
              backgroundColor: tone.bg,
              backgroundImage: "none",
              boxShadow: "0 12px 32px rgb(0 31 84 / 0.12)",
              color: meridian.textPrimary,
              alignItems: "flex-start",
              "& .MuiAlert-icon": {
                color: tone.icon,
                pt: 0.35,
              },
              "& .MuiAlert-message": {
                width: "100%",
                py: 0.25,
              },
              "& .MuiAlert-action": {
                pt: 0.15,
                pr: 0.5,
              },
              "& .MuiAlertTitle-root": {
                m: 0,
                mb: item.description ? 0.35 : 0,
                fontWeight: 700,
                fontSize: "0.875rem",
                letterSpacing: "-0.01em",
                color: meridian.textPrimary,
              },
            }}
          >
            {item.description ? (
              <AlertTitle>{item.message}</AlertTitle>
            ) : (
              item.message
            )}
            {item.description ? (
              <Box
                component="span"
                sx={{
                  display: "block",
                  fontSize: "0.8125rem",
                  color: meridian.textSecondary,
                  lineHeight: 1.45,
                }}
              >
                {item.description}
              </Box>
            ) : null}
          </Alert>
        );
      })}
    </Box>
  );
}
