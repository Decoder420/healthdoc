"use client";

import { useState } from "react";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import type { Patient } from "@/features/patients/types";
import {
  formatAadhaar,
  formatAbha,
} from "@/features/patients/utils/patient-validation";
import { createAbhaForPatient } from "@/features/opd/services/opd-service";
import { FieldText } from "@/components/ui/mui-field";

type CreateAbhaPanelProps = {
  patientName?: string;
  uhid?: string;
  initialAadhaar?: string;
  initialPhone?: string;
  onCreated: (abha: string, patient?: Patient) => void;
  onCancel?: () => void;
};

export function CreateAbhaPanel({
  patientName,
  uhid,
  initialAadhaar = "",
  initialPhone = "",
  onCreated,
  onCancel,
}: CreateAbhaPanelProps) {
  const [aadhaar, setAadhaar] = useState(initialAadhaar.replace(/\D/g, "").slice(0, 12));
  const [phone, setPhone] = useState(initialPhone);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSendOtp() {
    setError("");
    setSuccess("");

    if (aadhaar.replace(/\D/g, "").length !== 12) {
      setError("Enter a valid 12-digit Aadhaar number.");
      return;
    }

    const digits = phone.replace(/\D/g, "");
    const mobile =
      digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits;
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError("Enter a valid 10-digit mobile number linked to Aadhaar.");
      return;
    }

    setOtpSent(true);
    setSuccess("OTP sent to the registered mobile (demo OTP: 123456).");
  }

  function handleCreateAbha() {
    setError("");
    setSuccess("");

    if (!otpSent) {
      setError("Please send and verify OTP first.");
      return;
    }

    if (otp.trim() !== "123456") {
      setError("Invalid OTP. Use demo OTP 123456.");
      return;
    }

    setLoading(true);
    const result = createAbhaForPatient({
      uhid,
      aadhaar,
      phone,
      name: patientName,
    });
    setLoading(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    setSuccess(`ABHA created successfully: ${formatAbha(result.abha)}`);
    onCreated(result.abha, result.patient);
  }

  return (
    <div className="surface-card space-y-4 border-primary/20 p-5">
      <div>
        <h3 className="text-base font-semibold text-foreground">Create ABHA</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Create Ayushman Bharat Health Account using Aadhaar-linked mobile OTP.
          {patientName ? ` Patient: ${patientName}` : ""}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FieldText
          required
          label="Aadhaar Number"
          value={formatAadhaar(aadhaar)}
          onChange={(event) =>
            setAadhaar(event.target.value.replace(/\D/g, "").slice(0, 12))
          }
          placeholder="XXXX XXXX XXXX"
        />
        <FieldText
          required
          label="Aadhaar-linked Mobile"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="+91 XXXXX XXXXX"
        />
        {otpSent && (
          <FieldText
            required
            label="OTP"
            value={otp}
            onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="Enter 6-digit OTP"
            helperText="Demo OTP: 123456"
          />
        )}
      </div>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <div className="flex flex-wrap gap-2">
        {!otpSent ? (
          <Button variant="contained" onClick={handleSendOtp}>
            Send OTP
          </Button>
        ) : (
          <Button variant="contained" onClick={handleCreateAbha} disabled={loading}>
            {loading ? "Creating..." : "Verify OTP & Create ABHA"}
          </Button>
        )}
        {otpSent && (
          <Button variant="outlined" onClick={handleSendOtp}>
            Resend OTP
          </Button>
        )}
        {onCancel && (
          <Button variant="text" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}
