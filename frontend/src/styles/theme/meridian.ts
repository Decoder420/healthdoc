/**
 * Meridian design tokens — aligned with globals.css light/dark variables.
 */
export const meridianLight = {
  brandPrimary: "#001f54",
  brandDeep: "#001536",
  canvas: "#ffffff",
  surface: "#ffffff",
  muted: "#f4f6f9",
  textPrimary: "#001f54",
  textSecondary: "#4a6282",
  textMuted: "#4a6282",
  border: "#d6dee8",
  success: "#166534",
  warning: "#b45309",
  danger: "#b91c1c",
  info: "#001f54",
} as const;

export const meridianDark = {
  brandPrimary: "#001f54",
  brandDeep: "#001536",
  canvas: "#000000",
  surface: "#0a0a0a",
  muted: "#141414",
  textPrimary: "#ffffff",
  textSecondary: "#a3a3a3",
  textMuted: "#a3a3a3",
  border: "#262626",
  success: "#4ade80",
  warning: "#fbbf24",
  danger: "#f87171",
  info: "#93c5fd",
} as const;

/** @deprecated use meridianLight / createAppTheme */
export const meridian = meridianLight;

export type MeridianColor = keyof typeof meridianLight;
