"use client";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { Badge } from "@/components/ui/Badge";
import { meridian } from "@/styles/theme";
import { FREQUENCIES_WITHOUT_DURATION, FREQUENCY_OPTIONS, ROUTE_OPTIONS } from "../constants";
import type { DraftPrescriptionItem, Frequency, PrescriptionRoute } from "../types";

export interface PrescriptionItemRowProps {
  item: DraftPrescriptionItem;
  onChange: (patch: Partial<DraftPrescriptionItem>) => void;
  onRemove: () => void;
}

export function PrescriptionItemRow({ item, onChange, onRemove }: PrescriptionItemRowProps) {
  const noDuration = FREQUENCIES_WITHOUT_DURATION.includes(item.frequency);

  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: "12px",
        border: `1px solid ${meridian.border}`,
        display: "flex",
        flexDirection: "column",
        gap: 1.25,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
        <Typography sx={{ fontSize: "0.9375rem", fontWeight: 700 }}>{item.medicine_name}</Typography>
        {item.strength && (
          <Typography sx={{ fontSize: "0.75rem", color: meridian.textSecondary }}>{item.strength}</Typography>
        )}
        {item.is_controlled_drug && <Badge variant="destructive">Controlled</Badge>}
        <Box sx={{ flex: 1 }} />
        <IconButton size="small" onClick={onRemove} aria-label="Remove medicine">
          ×
        </IconButton>
      </Stack>

      <Stack direction="row" spacing={1.5} sx={{ flexWrap: "wrap", gap: 1.5 }}>
        <TextField
          label="Dosage"
          placeholder="e.g. 1 tab"
          value={item.dosage}
          onChange={(e) => onChange({ dosage: e.target.value })}
          size="small"
          sx={{ minWidth: 130 }}
        />
        <TextField
          select
          label="Frequency"
          value={item.frequency}
          onChange={(e) => onChange({ frequency: e.target.value as Frequency })}
          size="small"
          sx={{ minWidth: 200 }}
        >
          {FREQUENCY_OPTIONS.map((o) => (
            <MenuItem key={o.value} value={o.value}>
              {o.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Duration"
          type="number"
          value={noDuration ? "" : item.duration_days ?? ""}
          onChange={(e) =>
            onChange({ duration_days: e.target.value === "" ? undefined : Number(e.target.value) })
          }
          size="small"
          disabled={noDuration}
          helperText={noDuration ? "As needed" : "days"}
          sx={{ width: 120 }}
        />
        <TextField
          select
          label="Route"
          value={item.route}
          onChange={(e) => onChange({ route: e.target.value as PrescriptionRoute })}
          size="small"
          sx={{ minWidth: 170 }}
        >
          {ROUTE_OPTIONS.map((o) => (
            <MenuItem key={o.value} value={o.value}>
              {o.label}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      <TextField
        label="Instructions (optional)"
        placeholder="e.g. after food"
        value={item.instructions ?? ""}
        onChange={(e) => onChange({ instructions: e.target.value })}
        size="small"
        fullWidth
      />
    </Box>
  );
}
