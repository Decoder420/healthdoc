"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StatusChip } from "@/components/ui/StatusChip";
import { meridian } from "@/styles/theme";
import { formatDateTime } from "../lib/formatters";
import { doctorPanelSx, doctorButtonSx } from "../panelSx";
import type {
  LabResult,
  RadiologyReport,
  ResultAcknowledgement,
  ResultWorklistItem,
} from "../types";
import { CriticalBadge } from "./CriticalBadge";
import { LabResultViewer } from "./LabResultViewer";
import { RadiologyReportViewer } from "./RadiologyReportViewer";
import { ResultSignOffModal } from "./ResultSignOffModal";

export interface ResultDetailPanelProps {
  item: ResultWorklistItem | null;
  loading: boolean;
  labResult: LabResult | null;
  radReport: RadiologyReport | null;
  versions: { version: number; is_current: boolean; status: string; created_at: string }[];
  viewingVersion: number | null;
  onVersionChange: (v: number) => void;
  viewingIsCurrent: boolean;
  acks: ResultAcknowledgement[];
  alreadySigned: boolean;
  signing: boolean;
  onSign: (note?: string) => void;
}

export function ResultDetailPanel({
  item,
  loading,
  labResult,
  radReport,
  versions,
  viewingVersion,
  onVersionChange,
  viewingIsCurrent,
  acks,
  alreadySigned,
  signing,
  onSign,
}: ResultDetailPanelProps) {
  const [signOpen, setSignOpen] = React.useState(false);

  if (!item) {
    return (
      <Box sx={doctorPanelSx}>
        <Typography
          sx={{ color: meridian.textSecondary, fontSize: "0.875rem", textAlign: "center", py: 3 }}
        >
          Select a result from the list to review it.
        </Typography>
      </Box>
    );
  }

  const reported = labResult?.created_at ?? radReport?.created_at;
  const reporter = labResult?.created_by_name ?? radReport?.created_by_name;
  const status = labResult?.status ?? radReport?.status;

  return (
    <Box sx={{ ...doctorPanelSx, display: "flex", flexDirection: "column", gap: 2 }}>
      <Stack direction="row" spacing={2} sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap", gap: 1 }}>
            <Typography sx={{ fontSize: "1.0625rem", fontWeight: 700 }}>{item.test_name}</Typography>
            <Badge variant="outline">
              {item.order_type === "lab" ? "Lab" : (item.modality?.toUpperCase() ?? "Radiology")}
            </Badge>
            {status && <StatusChip status={status} />}
            {item.has_critical && <CriticalBadge />}
          </Stack>
          <Typography sx={{ fontSize: "0.8125rem", color: meridian.textSecondary, mt: 0.5 }}>
            {item.patient_name} · UHID {item.uhid} · {item.accession_number}
          </Typography>
        </Box>
      </Stack>

      {versions.length > 1 && (
        <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap", gap: 1 }}>
          <Typography sx={{ fontSize: "0.75rem", color: meridian.textSecondary, mr: 0.5 }}>
            Versions
          </Typography>
          {versions.map((v) => (
            <Button
              key={v.version}
              size="small"
              variant={viewingVersion === v.version ? "contained" : "outlined"}
              sx={doctorButtonSx}
              onClick={() => onVersionChange(v.version)}
            >
              v{v.version}
              {v.is_current ? " · current" : ""}
            </Button>
          ))}
        </Stack>
      )}

      {!viewingIsCurrent && versions.length > 1 && (
        <Box
          sx={{
            px: 1.5,
            py: 1,
            borderRadius: "12px",
            backgroundColor: meridian.muted,
            border: `1px solid ${meridian.border}`,
          }}
        >
          <Typography sx={{ fontSize: "0.8125rem", color: meridian.textSecondary }}>
            Viewing a superseded version. Corrections create a new version — the previous one is
            never edited.
          </Typography>
        </Box>
      )}

      <Divider />

      {loading ? (
        <Stack sx={{ alignItems: "center", py: 4 }}>
          <CircularProgress size={22} />
        </Stack>
      ) : !item.result_status ? (
        <Typography sx={{ fontSize: "0.875rem", color: meridian.textSecondary, py: 2 }}>
          No result has been reported yet. Current order status:{" "}
          <strong>{item.status.replace(/_/g, " ")}</strong>.
        </Typography>
      ) : labResult ? (
        <LabResultViewer result={labResult} />
      ) : radReport ? (
        <RadiologyReportViewer report={radReport} />
      ) : null}

      {(reported || reporter) && (
        <Typography sx={{ fontSize: "0.75rem", color: meridian.textSecondary }}>
          Reported {reported ? formatDateTime(reported) : "—"}
          {reporter ? ` · ${reporter}` : ""}
        </Typography>
      )}

      {item.result_status && (
        <>
          <Divider />
          <Stack
            direction="row"
            spacing={2}
            sx={{ alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1.5 }}
          >
            {alreadySigned ? (
              <Stack spacing={0.5}>
                {acks.map((a) => (
                  <Box key={a.id}>
                    <Typography sx={{ fontSize: "0.8125rem", color: meridian.success, fontWeight: 600 }}>
                      Signed off by {a.reviewed_by_name ?? a.reviewed_by} ·{" "}
                      {formatDateTime(a.reviewed_at)}
                    </Typography>
                    {a.note && (
                      <Typography sx={{ fontSize: "0.8125rem", color: meridian.textPrimary }}>
                        {a.note}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Stack>
            ) : (
              <Typography sx={{ fontSize: "0.8125rem", color: meridian.warning, fontWeight: 600 }}>
                Awaiting your sign-off
              </Typography>
            )}

            {!alreadySigned && (
              <Button
                variant="contained"
                sx={doctorButtonSx}
                disabled={signing || !viewingIsCurrent}
                onClick={() => setSignOpen(true)}
              >
                Sign off result
              </Button>
            )}
          </Stack>
        </>
      )}

      <ResultSignOffModal
        open={signOpen}
        busy={signing}
        subject={`${item.test_name} · ${item.accession_number}`}
        onClose={() => setSignOpen(false)}
        onConfirm={(note) => {
          onSign(note);
          setSignOpen(false);
        }}
      />
    </Box>
  );
}
