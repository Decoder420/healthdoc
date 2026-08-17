"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Button } from "@/components/ui/Button";
import { meridian } from "@/styles/theme";
import { useBreakGlass } from "../hooks/useBreakGlass";
import { doctorButtonSx, doctorPanelSx } from "../panelSx";
import type { QueuePatient, RecordAccessBlockedReason } from "../types";
import { BreakGlassBanner } from "./BreakGlassBanner";
import { BreakGlassWarningModal } from "./BreakGlassWarningModal";

const BLOCKED_COPY: Record<RecordAccessBlockedReason, string> = {
  consent_absent: "This patient has not given consent for you to view their record.",
  consent_expired: "This patient's consent has expired.",
  consent_revoked: "This patient has withdrawn their consent.",
};

/**
 * Break-glass is an interception, not a destination: the clinician opens a
 * record and is stopped here. Wrap whatever reads the record; children render
 * only once access is allowed, by consent or by an open grant.
 */
export function BreakGlassGate({
  patient,
  children,
}: {
  patient: QueuePatient | null;
  children: React.ReactNode;
}) {
  const { loading, submitting, allowed, blockedReason, grant, msRemaining, requestAccess, revoke } =
    useBreakGlass(patient?.patient_id ?? null);
  const [modalOpen, setModalOpen] = React.useState(false);

  // Nothing selected — the child owns its own empty state.
  if (!patient) return <>{children}</>;

  if (loading) {
    return (
      <Box sx={{ ...doctorPanelSx, display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress size={22} />
      </Box>
    );
  }

  if (allowed) {
    return (
      <Stack spacing={2}>
        {grant && (
          <BreakGlassBanner
            grant={grant}
            msRemaining={msRemaining}
            busy={submitting}
            onRevoke={revoke}
          />
        )}
        {children}
      </Stack>
    );
  }

  return (
    <>
      <Box sx={{ ...doctorPanelSx, display: "flex", flexDirection: "column", gap: 1.5 }}>
        <Typography sx={{ fontSize: "1.0625rem", fontWeight: 700 }}>Record locked</Typography>
        <Typography sx={{ fontSize: "0.875rem", color: meridian.textSecondary, lineHeight: 1.55 }}>
          {blockedReason ? BLOCKED_COPY[blockedReason] : "You cannot view this record."}
        </Typography>
        <Typography sx={{ fontSize: "0.8125rem", color: meridian.textSecondary, lineHeight: 1.55 }}>
          If this is a clinical emergency you can override the block. You will be asked why, and to
          confirm it is you.
        </Typography>
        <Box>
          <Button
            variant="contained"
            color="error"
            sx={doctorButtonSx}
            onClick={() => setModalOpen(true)}
          >
            Emergency access
          </Button>
        </Box>
      </Box>

      <BreakGlassWarningModal
        open={modalOpen}
        busy={submitting}
        patientName={patient.full_name}
        onClose={() => setModalOpen(false)}
        onConfirm={requestAccess}
      />
    </>
  );
}
