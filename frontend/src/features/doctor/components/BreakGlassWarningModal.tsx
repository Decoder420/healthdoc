"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { meridian } from "@/styles/theme";
import { BREAK_GLASS_JUSTIFICATION_MIN, MFA_CODE_LENGTH } from "../constants";
import { doctorButtonSx } from "../panelSx";

export interface BreakGlassWarningModalProps {
  open: boolean;
  busy: boolean;
  patientName: string;
  onClose: () => void;
  /** Resolves to an error message to show inline, or null on success. */
  onConfirm: (justification: string, code: string) => Promise<string | null>;
}

/**
 * The "breaking" moment: warning → justification → step-up MFA.
 *
 * Every claim this modal makes is one the system actually keeps — the access is
 * logged against the clinician (data_access_log.emergency_access), it expires on
 * its own, and it is reviewable (break_glass_grants.reviewed_by). It does NOT
 * promise that anyone is notified: the architecture describes an HOD/MS
 * notification but no notification path for break-glass exists in the schema,
 * and a warning that overstates the consequences is worse than none.
 */
export function BreakGlassWarningModal({
  open,
  busy,
  patientName,
  onClose,
  onConfirm,
}: BreakGlassWarningModalProps) {
  const [step, setStep] = React.useState<"justify" | "verify">("justify");
  const [justification, setJustification] = React.useState("");
  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open) return;
    setStep("justify");
    setJustification("");
    setCode("");
    setError(null);
  }, [open]);

  const remaining = BREAK_GLASS_JUSTIFICATION_MIN - justification.trim().length;
  const justificationReady = remaining <= 0;

  const submit = async () => {
    const message = await onConfirm(justification.trim(), code);
    if (message) {
      setError(message);
      return;
    }
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Emergency access (break-glass)"
      size="sm"
      disableClose={busy}
      actions={
        step === "justify" ? (
          <>
            <Button variant="outlined" sx={doctorButtonSx} onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              sx={doctorButtonSx}
              disabled={!justificationReady}
              onClick={() => setStep("verify")}
            >
              Continue
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outlined"
              sx={doctorButtonSx}
              disabled={busy}
              onClick={() => {
                setError(null);
                setStep("justify");
              }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="error"
              sx={doctorButtonSx}
              loading={busy}
              disabled={code.trim().length !== MFA_CODE_LENGTH}
              onClick={submit}
            >
              Open emergency access
            </Button>
          </>
        )
      }
    >
      <Stack spacing={2}>
        <Box
          sx={{
            px: 1.75,
            py: 1.5,
            borderRadius: "12px",
            backgroundColor: "#fee2e2",
            border: "1px solid rgb(185 28 28 / 0.22)",
          }}
        >
          <Typography
            sx={{
              fontSize: "0.6875rem",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: meridian.danger,
              mb: 0.5,
            }}
          >
            This is an emergency override
          </Typography>
          <Typography sx={{ fontSize: "0.8125rem", color: meridian.textPrimary, lineHeight: 1.55 }}>
            You are about to open <strong>{patientName}</strong>&apos;s record without a consent
            record. Your name, your reason and every record you open are recorded, the access ends
            by itself, and it is reviewed afterwards.
          </Typography>
        </Box>

        {step === "justify" ? (
          <>
            <TextField
              label="Why do you need this record now?"
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              multiline
              minRows={3}
              fullWidth
              autoFocus
              placeholder="e.g. Unconscious trauma patient, need allergy and current medication history before surgery."
              helperText={
                justificationReady
                  ? "This is stored with the grant and read during review."
                  : `${remaining} more character${remaining === 1 ? "" : "s"} required.`
              }
            />
          </>
        ) : (
          <>
            <Typography sx={{ fontSize: "0.875rem" }}>
              Confirm it is you. Enter the {MFA_CODE_LENGTH}-digit code from your authenticator app.
            </Typography>
            <TextField
              label="Authentication code"
              value={code}
              onChange={(e) => {
                setError(null);
                setCode(e.target.value.replace(/\D/g, "").slice(0, MFA_CODE_LENGTH));
              }}
              fullWidth
              autoFocus
              error={Boolean(error)}
              helperText={error ?? " "}
              slotProps={{
                htmlInput: {
                  inputMode: "numeric",
                  autoComplete: "one-time-code",
                  style: { letterSpacing: "0.4em", fontVariantNumeric: "tabular-nums" },
                },
              }}
            />
          </>
        )}
      </Stack>
    </Modal>
  );
}
