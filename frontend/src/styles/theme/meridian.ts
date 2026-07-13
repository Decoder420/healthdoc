/**
 * Design tokens — gold / dark theme (single source of truth for HMIS UI colors).
 */
export const meridian = {
  brandGold: "#d4af37",
  brandGoldBright: "#f5cc50",
  brandGoldDeep: "#b8962e",
  brandGoldLight: "#fff8e7",
  canvas: "#000000",
  surface: "#0a0a08",
  surfaceElevated: "#0c0c0a",
  textPrimary: "#f5cc50",
  textSecondary: "rgba(220, 215, 200, 0.75)",
  textMuted: "rgba(220, 215, 200, 0.65)",
  success: "#4ade80",
  warning: "#f5cc50",
  danger: "#f87171",
  border: "rgba(212, 175, 55, 0.22)",
} as const;

export type MeridianColor = keyof typeof meridian;
