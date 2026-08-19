/**
 * Doctor module surface styles — every panel on every doctor screen is the same
 * card, and every doctor page is the same width and padding. Defined once so the
 * queue, consultation, orders, prescription and results screens cannot drift.
 *
 * The literal radii/tints/shadows below are the values these panels already
 * used, lifted out of nine components into one place. They belong in
 * styles/theme/meridian.ts (which today carries only the 13 base colours and no
 * radius or tint scale) — moving them there is the theme owner's call, and once
 * those tokens exist this file becomes a thin re-export.
 *
 * Plain objects rather than `SxProps<Theme>`: callers spread them
 * (`sx={{ ...doctorPanelSx, gap: 2 }}`) to add layout on top of the surface.
 */
import { meridian } from "@/styles/theme";

/** One panel = one job. Rounded, hairline border, soft tint, light shadow. */
export const doctorPanelSx = {
  borderRadius: "16px",
  border: `1px solid ${meridian.border}`,
  background: `linear-gradient(180deg, ${meridian.surface} 0%, #fbfcfe 100%)`,
  boxShadow: "0 1px 2px rgb(0 31 84 / 0.04), 0 12px 32px rgb(0 31 84 / 0.06)",
  p: 3,
} as const;

/** The opening band at the top of a doctor screen (eyebrow + h1 + intro). */
export const doctorPageHeaderSx = {
  position: "relative",
  overflow: "hidden",
  borderRadius: "16px",
  border: `1px solid ${meridian.border}`,
  background: `linear-gradient(110deg, ${meridian.muted} 0%, ${meridian.surface} 45%, #eef4fb 100%)`,
  boxShadow: "0 1px 2px rgb(0 31 84 / 0.04), 0 8px 24px rgb(0 31 84 / 0.05)",
  px: { xs: 2.5, md: 3 },
  py: { xs: 2, md: 2.25 },
} as const;

/** Page shell — shared by every route under /doctor so widths match. */
export const doctorPageSx = {
  mx: "auto",
  maxWidth: 1280,
  px: { xs: 2, md: 3 },
  py: 3,
} as const;

/** Buttons inside doctor panels. */
export const doctorButtonSx = {
  textTransform: "none",
  fontWeight: 600,
  borderRadius: "10px",
} as const;
