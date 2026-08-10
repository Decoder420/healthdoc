/** Meridian design tokens — source of truth for HMIS palette */
export const meridian = {
  primary: "#001f54",
  primaryForeground: "#ffffff",
  foreground: "#001f54",
  mutedForeground: "#4a6282",
  background: "#ffffff",
  card: "#ffffff",
  muted: "#f4f6f9",
  border: "#d6dee8",
  accent: "#e8eef5",
  success: "#166534",
  successMuted: "#dcfce7",
  warning: "#b45309",
  warningMuted: "#fef3c7",
  danger: "#b91c1c",
  dangerMuted: "#fee2e2",
  info: "#001f54",
  infoMuted: "#e8eef5",
  dark: {
    primary: "#5b8fd4",
    foreground: "#ffffff",
    mutedForeground: "#a3a3a3",
    background: "#000000",
    card: "#0a0a0a",
    muted: "#141414",
    border: "#262626",
    info: "#93c5fd",
  },
} as const;

export type MeridianTokens = typeof meridian;
