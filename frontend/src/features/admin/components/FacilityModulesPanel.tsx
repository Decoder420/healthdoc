"use client";

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { meridian } from "@/styles/theme";
import { CORE_ALWAYS_ON_MODULES, MODULE_CODE_LABELS } from "../constants";
import { adminPanelSx } from "../panelSx";
import type { FacilityModule } from "../types";
import { ModuleEnabledChip } from "./ModuleEnabledChip";

type Props = {
  modules: FacilityModule[];
  loading: boolean;
  busyCode: string | null;
  onToggle: (
    id: string,
    is_enabled: boolean,
    disabled_reason?: string | null,
  ) => Promise<void>;
};

function configPreview(config: Record<string, unknown>): string {
  const keys = Object.keys(config);
  if (keys.length === 0) return "No config";
  try {
    const raw = JSON.stringify(config);
    return raw.length > 72 ? `${raw.slice(0, 72)}…` : raw;
  } catch {
    return `${keys.length} key(s)`;
  }
}

function ModuleCard({
  m,
  busy,
  onToggle,
}: {
  m: FacilityModule;
  busy: boolean;
  onToggle: Props["onToggle"];
}) {
  const [reason, setReason] = useState(m.disabled_reason ?? "");

  useEffect(() => {
    setReason(m.disabled_reason ?? "");
  }, [m.disabled_reason, m.module_code]);

  return (
    <Box
      sx={{
        borderRadius: "14px",
        border: `1px solid ${meridian.border}`,
        background: m.is_enabled
          ? `linear-gradient(165deg, ${meridian.surface} 0%, #f8fafc 100%)`
          : `linear-gradient(165deg, ${meridian.muted} 0%, #eef2f6 100%)`,
        px: 2,
        py: 1.75,
        opacity: busy ? 0.72 : 1,
        transition: "opacity 140ms ease, border-color 140ms ease",
        borderLeft: m.is_enabled
          ? `3px solid ${meridian.brandPrimary}`
          : `3px solid ${meridian.border}`,
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        sx={{
          alignItems: { sm: "center" },
          justifyContent: "space-between",
          gap: 1.5,
        }}
      >
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Stack direction="row" useFlexGap sx={{ gap: 1, alignItems: "center", flexWrap: "wrap" }}>
            <Typography
              sx={{ m: 0, fontWeight: 700, fontSize: "0.9375rem", color: meridian.textPrimary }}
            >
              {MODULE_CODE_LABELS[m.module_code]}
            </Typography>
            <ModuleEnabledChip enabled={m.is_enabled} />
          </Stack>
          <Typography
            sx={{
              m: 0,
              mt: 0.5,
              fontSize: "0.75rem",
              fontFamily: "var(--font-ibm-plex-mono), monospace",
              color: meridian.brandPrimary,
              fontWeight: 600,
            }}
          >
            {m.module_code}
          </Typography>
        </Box>

        <Stack direction="row" sx={{ alignItems: "center", gap: 0.5 }}>
          <Typography sx={{ fontSize: "0.75rem", color: meridian.textSecondary, mr: 0.5 }}>
            {m.is_enabled ? "On" : "Off"}
          </Typography>
          <Switch
            checked={m.is_enabled}
            disabled={busy}
            onChange={(_, checked) => {
              // module_code, not m.id — a module with no stored row has no
              // id until somebody disables it for the first time.
              //
              // No "Disabled by admin" fallback: the server rejects a blank
              // reason, and a placeholder is the non-answer that requirement
              // exists to prevent. An empty box now surfaces the 422 instead
              // of quietly writing something meaningless.
              void onToggle(
                m.module_code,
                checked,
                checked ? null : reason.trim() || m.disabled_reason,
              );
            }}
          />
        </Stack>
      </Stack>

      <Box sx={{ mt: 1.5 }}>
        {!m.is_enabled ? (
          <TextField
            size="small"
            fullWidth
            label="Disabled reason"
            value={reason}
            disabled={busy}
            onChange={(e) => setReason(e.target.value)}
            onBlur={() => {
              const next = reason.trim();
              if (next && next !== (m.disabled_reason ?? "")) {
                void onToggle(m.module_code, false, next);
              }
            }}
            helperText="Saved on blur · facility_modules.disabled_reason"
          />
        ) : (
          <Typography sx={{ m: 0, fontSize: "0.75rem", color: meridian.textSecondary }}>
            config: {configPreview(m.config)}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export function FacilityModulesPanel({ modules, loading, busyCode, onToggle }: Props) {
  return (
    <Box sx={adminPanelSx}>
      <Typography
        sx={{ m: 0, fontSize: "1.0625rem", fontWeight: 700, color: meridian.textPrimary }}
      >
        Facility modules
      </Typography>
      <Typography sx={{ m: 0, mt: 0.5, mb: 2, fontSize: "0.8125rem", color: meridian.textSecondary }}>
        facility_modules (0027) — ModuleCode toggles. Core modules below cannot be disabled.
      </Typography>

      <Box
        sx={{
          mb: 2.75,
          p: 1.75,
          borderRadius: "12px",
          border: `1px solid ${meridian.border}`,
          bgcolor: meridian.muted,
        }}
      >
        <Typography
          sx={{
            m: 0,
            mb: 0.5,
            fontSize: "0.6875rem",
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: meridian.textSecondary,
          }}
        >
          Core (always on)
        </Typography>
        <Typography sx={{ m: 0, mb: 1.25, fontSize: "0.75rem", color: meridian.textSecondary }}>
          Display-only legend from schema — not toggleable rows.
        </Typography>
        <Stack direction="row" useFlexGap sx={{ flexWrap: "wrap", gap: 1 }}>
          {CORE_ALWAYS_ON_MODULES.map((name) => (
            <Box
              key={name}
              sx={{
                px: 1.25,
                py: 0.5,
                borderRadius: "8px",
                border: `1px solid ${meridian.border}`,
                bgcolor: meridian.surface,
                fontSize: "0.75rem",
                color: meridian.textSecondary,
                fontWeight: 600,
              }}
            >
              {name}
            </Box>
          ))}
        </Stack>
      </Box>

      <Typography
        sx={{
          m: 0,
          mb: 1.25,
          fontSize: "0.6875rem",
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: meridian.textSecondary,
        }}
      >
        Toggleable ModuleCode
      </Typography>

      {loading ? (
        <Stack spacing={1.25}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton
              key={i}
              variant="rounded"
              height={96}
              sx={{ borderRadius: "14px" }}
            />
          ))}
        </Stack>
      ) : (
        <Stack spacing={1.25}>
          {modules.map((m) => (
            <ModuleCard
              key={m.module_code}
              m={m}
              busy={busyCode === m.module_code}
              onToggle={onToggle}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
}
