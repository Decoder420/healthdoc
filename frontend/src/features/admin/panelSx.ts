import type { SxProps, Theme } from "@mui/material/styles";

import { meridian } from "@/styles/theme";

export const adminPanelSx: SxProps<Theme> = {
  borderRadius: "16px",
  border: `1px solid ${meridian.border}`,
  background: `linear-gradient(180deg, ${meridian.surface} 0%, #fbfcfe 100%)`,
  boxShadow: "0 1px 2px rgb(0 31 84 / 0.04), 0 12px 32px rgb(0 31 84 / 0.06)",
  p: 2.5,
};

/** Sticky footer for Save / Approve actions — always high-contrast. */
export const adminStickyActionsSx: SxProps<Theme> = {
  position: "sticky",
  bottom: 0,
  zIndex: 2,
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 1.5,
  px: 2.5,
  py: 1.75,
  borderTop: `1px solid ${meridian.border}`,
  background: `linear-gradient(180deg, rgb(251 252 254 / 0.92) 0%, ${meridian.muted} 100%)`,
  backdropFilter: "blur(8px)",
};

/** Compact page header strip (lighter than MIS hero). */
export const adminPageStripSx: SxProps<Theme> = {
  position: "relative",
  overflow: "hidden",
  borderRadius: "16px",
  border: `1px solid ${meridian.border}`,
  background: `linear-gradient(110deg, ${meridian.muted} 0%, ${meridian.surface} 45%, #eef4fb 100%)`,
  boxShadow: "0 1px 2px rgb(0 31 84 / 0.04), 0 8px 24px rgb(0 31 84 / 0.05)",
  px: { xs: 2.5, md: 3 },
  py: { xs: 2, md: 2.25 },
};

/** Readable disabled primary CTA (avoids washed navy contained fill). */
export const adminSaveButtonSx = (isDirty: boolean, disabled: boolean): SxProps<Theme> => ({
  textTransform: "none",
  fontWeight: 700,
  borderRadius: "10px",
  minWidth: 128,
  ...(disabled
    ? {
        "&.Mui-disabled": {
          color: meridian.textSecondary,
          borderColor: meridian.border,
          bgcolor: meridian.muted,
          opacity: 1,
        },
      }
    : isDirty
      ? {
          color: "#ffffff",
          bgcolor: meridian.brandPrimary,
          "&:hover": { bgcolor: meridian.brandDeep },
        }
      : {}),
});
