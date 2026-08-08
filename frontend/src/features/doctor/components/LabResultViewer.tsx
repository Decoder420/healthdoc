"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Badge } from "@/components/ui/Badge";
import { meridian } from "@/styles/theme";
import type { AnalyteFlag, LabResult, ResultAnalyte } from "../types";
import { CriticalBadge } from "./CriticalBadge";

const FLAG_TONE: Record<AnalyteFlag, { fg: string; bg: string; label: string }> = {
  normal: { fg: meridian.textPrimary, bg: "transparent", label: "" },
  low: { fg: meridian.warning, bg: "#fef3c7", label: "Low" },
  high: { fg: meridian.warning, bg: "#fef3c7", label: "High" },
  critical_low: { fg: meridian.danger, bg: "#fee2e2", label: "Critical low" },
  critical_high: { fg: meridian.danger, bg: "#fee2e2", label: "Critical high" },
};

const isCritical = (f: AnalyteFlag) => f === "critical_low" || f === "critical_high";

/** "13 – 17 g/dL", or the qualitative reference when there is no numeric range. */
function referenceText(a: ResultAnalyte): string {
  if (a.ref_low !== undefined && a.ref_high !== undefined) {
    return `${a.ref_low} – ${a.ref_high}${a.unit ? ` ${a.unit}` : ""}`;
  }
  if (a.ref_text) return a.ref_text;
  return "—";
}

const headCellSx = {
  fontSize: "0.6875rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: meridian.textSecondary,
  py: 1,
  px: 1.5,
  borderBottom: `1px solid ${meridian.border}`,
  textAlign: "left",
} as const;

const cellSx = {
  fontSize: "0.8125rem",
  py: 1.15,
  px: 1.5,
  borderBottom: `1px solid ${meridian.border}`,
} as const;

export interface LabResultViewerProps {
  result: LabResult;
}

export function LabResultViewer({ result }: LabResultViewerProps) {
  const analytes = result.result_data?.analytes ?? [];
  const criticalCount = analytes.filter((a) => isCritical(a.flag)).length;

  return (
    <Stack spacing={2}>
      {criticalCount > 0 && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 1.5,
            py: 1.25,
            borderRadius: "12px",
            backgroundColor: "#fee2e2",
            border: "1px solid rgb(185 28 28 / 0.22)",
          }}
        >
          <Typography
            sx={{
              fontSize: "0.6875rem",
              fontWeight: 700,
              color: meridian.danger,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            Critical
          </Typography>
          <Typography sx={{ fontSize: "0.8125rem", color: meridian.textPrimary }}>
            {criticalCount} analyte{criticalCount === 1 ? "" : "s"} outside the critical limit —
            review immediately.
          </Typography>
        </Box>
      )}

      <Box sx={{ overflowX: "auto" }}>
        <Box component="table" sx={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}>
          <Box component="thead">
            <Box component="tr">
              <Box component="th" sx={headCellSx}>Analyte</Box>
              <Box component="th" sx={{ ...headCellSx, textAlign: "right" }}>Result</Box>
              <Box component="th" sx={headCellSx}>Unit</Box>
              <Box component="th" sx={headCellSx}>Reference range</Box>
              <Box component="th" sx={headCellSx}>Flag</Box>
            </Box>
          </Box>
          <Box component="tbody">
            {analytes.map((a) => {
              const tone = FLAG_TONE[a.flag];
              const abnormal = a.flag !== "normal";
              return (
                <Box component="tr" key={a.code}>
                  <Box component="td" sx={cellSx}>
                    <Typography sx={{ fontSize: "0.8125rem", fontWeight: 500 }}>{a.name}</Typography>
                    <Typography sx={{ fontSize: "0.6875rem", color: meridian.textSecondary }}>
                      {a.code}
                    </Typography>
                  </Box>
                  <Box
                    component="td"
                    sx={{
                      ...cellSx,
                      textAlign: "right",
                      fontWeight: abnormal ? 700 : 500,
                      color: tone.fg,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {a.value}
                  </Box>
                  <Box component="td" sx={{ ...cellSx, color: meridian.textSecondary }}>
                    {a.unit ?? "—"}
                  </Box>
                  <Box
                    component="td"
                    sx={{ ...cellSx, color: meridian.textSecondary, whiteSpace: "nowrap" }}
                  >
                    {referenceText(a)}
                  </Box>
                  <Box component="td" sx={cellSx}>
                    {a.flag === "normal" ? (
                      <Typography sx={{ fontSize: "0.75rem", color: meridian.textSecondary }}>
                        Normal
                      </Typography>
                    ) : isCritical(a.flag) ? (
                      <CriticalBadge label={tone.label} />
                    ) : (
                      <Badge variant="outline">{tone.label}</Badge>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>

      {result.remarks && (
        <Box
          sx={{
            px: 1.5,
            py: 1.25,
            borderRadius: "12px",
            border: `1px solid ${meridian.border}`,
            backgroundColor: meridian.muted,
          }}
        >
          <Typography
            sx={{
              fontSize: "0.6875rem",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: meridian.textSecondary,
              mb: 0.5,
            }}
          >
            Lab remarks
          </Typography>
          <Typography sx={{ fontSize: "0.8125rem" }}>{result.remarks}</Typography>
        </Box>
      )}
    </Stack>
  );
}
