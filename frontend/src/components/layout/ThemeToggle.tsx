"use client";

import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import { useThemeMode } from "@/providers/theme-provider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeMode();

  return (
    <button
      type="button"
      className="btn app-btn-ghost border rounded-circle d-flex align-items-center justify-content-center"
      style={{ width: 40, height: 40 }}
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={theme === "dark" ? "Light mode" : "Dark mode"}
    >
      {theme === "dark" ? (
        <LightModeRoundedIcon fontSize="small" />
      ) : (
        <DarkModeRoundedIcon fontSize="small" />
      )}
    </button>
  );
}
