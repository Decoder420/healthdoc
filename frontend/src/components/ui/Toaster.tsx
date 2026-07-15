"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { subscribe, getSnapshot, dismiss, type ToastItem } from "./toast";

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
        gap: 1,
        width: 360,
        maxWidth: "calc(100vw - 32px)",
      }}
    >
      {items.map((item) => (
        <Alert
          key={item.id}
          severity={item.severity}
          variant="standard"
          onClose={() => dismiss(item.id)}
          sx={{
            boxShadow: 3,
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          {item.description ? <AlertTitle>{item.message}</AlertTitle> : item.message}
          {item.description}
        </Alert>
      ))}
    </Box>
  );
}