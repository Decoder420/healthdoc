"use client";

import { useMemo } from "react";
import { useThemeMode } from "@/providers/theme-provider";

export function useChartTheme() {
  const { theme } = useThemeMode();

  return useMemo(
    () => ({
      isDark: theme === "dark",
      text: theme === "dark" ? "#ffffff" : "#001f54",
      muted: theme === "dark" ? "#a3a3a3" : "#4a6282",
      grid: theme === "dark" ? "#262626" : "#d6dee8",
      border: theme === "dark" ? "#262626" : "#ffffff",
      line: theme === "dark" ? "#5b8fd4" : "#001f54",
      lineFill: theme === "dark" ? "rgba(91, 143, 212, 0.18)" : "rgba(0, 31, 84, 0.12)",
    }),
    [theme]
  );
}
