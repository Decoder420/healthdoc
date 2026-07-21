"use client";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { meridian } from "@/styles/theme";
import { SCHEME_OPTIONS } from "../constants";
import type { PmjayEligibilityStatus, SchemeOptionCode } from "../types";

type Props = {
  value: SchemeOptionCode;
  schemeAdjustment: number;
  eligibility: PmjayEligibilityStatus;
  disabled?: boolean;
  onChange: (code: SchemeOptionCode) => void;
  onSchemeAdjustmentChange: (n: number) => void;
};

const eligibilityTone: Record<
  PmjayEligibilityStatus,
  { bg: string; fg: string; border: string; label: string }
> = {
  eligible: {
    bg: "#dcfce7",
    fg: meridian.success,
    border: "rgb(22 101 52 / 0.18)",
    label: "PM-JAY Eligible",
  },
  ineligible: {
    bg: "#fee2e2",
    fg: meridian.danger,
    border: "rgb(185 28 28 / 0.18)",
    label: "PM-JAY Ineligible",
  },
  unknown: {
    bg: "#fef3c7",
    fg: meridian.warning,
    border: "rgb(180 83 9 / 0.2)",
    label: "Eligibility unknown",
  },
};

export function SchemeSelector({
  value,
  schemeAdjustment,
  eligibility,
  disabled,
  onChange,
  onSchemeAdjustmentChange,
}: Props) {
  const tone = eligibilityTone[eligibility];

  return (
    <Box
      sx={{
        borderRadius: "16px",
        border: `1px solid ${meridian.border}`,
        background: `linear-gradient(180deg, ${meridian.surface} 0%, #fbfcfe 100%)`,
        boxShadow: "0 1px 2px rgb(0 31 84 / 0.04), 0 12px 32px rgb(0 31 84 / 0.06)",
        p: 2.5,
      }}
    >
      <Typography
        sx={{
          m: 0,
          mb: 0.5,
          fontSize: "1.0625rem",
          fontWeight: 700,
          color: meridian.textPrimary,
        }}
      >
        Scheme selector
      </Typography>
      <Typography sx={{ m: 0, mb: 2, fontSize: "0.8125rem", color: meridian.textSecondary }}>
        Sets invoices.scheme_code and scheme_adjustment
      </Typography>

      <Stack direction="row" useFlexGap sx={{ gap: 1, flexWrap: "wrap", mb: 2 }}>
        {SCHEME_OPTIONS.map((opt) => {
          const selected = value === opt.code;
          return (
            <Chip
              key={opt.code}
              label={opt.label}
              clickable={!disabled}
              onClick={() => !disabled && onChange(opt.code)}
              sx={{
                height: 32,
                borderRadius: "10px",
                fontWeight: 600,
                border: `1px solid ${selected ? meridian.brandPrimary : meridian.border}`,
                backgroundColor: selected ? "#e8eef5" : meridian.surface,
                color: selected ? meridian.brandPrimary : meridian.textPrimary,
                opacity: disabled ? 0.6 : 1,
              }}
            />
          );
        })}
      </Stack>

      {value === "PM-JAY" ? (
        <Chip
          size="small"
          label={tone.label}
          sx={{
            mb: 2,
            borderRadius: "999px",
            fontWeight: 600,
            backgroundColor: tone.bg,
            color: tone.fg,
            border: `1px solid ${tone.border}`,
          }}
        />
      ) : null}

      <TextField
        type="number"
        size="small"
        label="Scheme adjustment (₹)"
        value={schemeAdjustment}
        disabled={disabled}
        onChange={(e) => onSchemeAdjustmentChange(Number(e.target.value) || 0)}
        slotProps={{ htmlInput: { min: 0, step: 1 } }}
        fullWidth
        helperText="Subtracted from gross along with discount → net_amount"
      />
    </Box>
  );
}
