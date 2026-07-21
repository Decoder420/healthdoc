"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import { Button } from "@/components/ui/Button";
import { SearchAutocomplete } from "@/components/ui/SearchAutocomplete";
import { toast } from "@/components/ui/toast";
import { mockIcdCodes, type IcdCode } from "./mockEncounterData";

export interface VitalsData {
  bp_systolic: string;
  bp_diastolic: string;
  pulse: string;
  temp: string;
  spo2: string;
  weight: string;
}

export interface SoapData {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

export interface EncounterFormProps {
  encounterId: string;
  onSave?: (payload: {
    encounter_id: string;
    chief_complaint: string;
    vitals: VitalsData;
    soap: SoapData;
    diagnoses: IcdCode[];
  }) => void;
}

const emptyVitals: VitalsData = { bp_systolic: "", bp_diastolic: "", pulse: "", temp: "", spo2: "", weight: "" };
const emptySoap: SoapData = { subjective: "", objective: "", assessment: "", plan: "" };

export function EncounterForm({ encounterId, onSave }: EncounterFormProps) {
  const [chiefComplaint, setChiefComplaint] = React.useState("");
  const [vitals, setVitals] = React.useState<VitalsData>(emptyVitals);
  const [soap, setSoap] = React.useState<SoapData>(emptySoap);
  const [diagnoses, setDiagnoses] = React.useState<IcdCode[]>([]);
  const [icdPick, setIcdPick] = React.useState<IcdCode | null>(null);
  const [saving, setSaving] = React.useState(false);

  const updateVital = (field: keyof VitalsData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setVitals((v) => ({ ...v, [field]: e.target.value }));
  };

  const updateSoap = (field: keyof SoapData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setSoap((s) => ({ ...s, [field]: e.target.value }));
  };

  const addDiagnosis = (code: IcdCode | null) => {
    if (!code) return;
    if (diagnoses.some((d) => d.code === code.code)) {
      setIcdPick(null);
      return;
    }
    setDiagnoses((d) => [...d, code]);
    setIcdPick(null);
  };

  const removeDiagnosis = (code: string) => {
    setDiagnoses((d) => d.filter((item) => item.code !== code));
  };

  const handleSave = () => {
    setSaving(true);

    // TODO: replace with real API calls once confirmed:
    //   1. POST /encounters (chief_complaint, encounter_type) -> Postgres
    //   2. POST <clinical-notes-endpoint> { encounter_id, vitals, soap } -> Mongo
    //      exact field names unconfirmed — ask dev-b3
    //   3. POST /diagnoses per selected ICD code (icd_code, icd_version)
    const payload = {
      encounter_id: encounterId,
      chief_complaint: chiefComplaint,
      vitals,
      soap,
      diagnoses,
    };

    setTimeout(() => {
      setSaving(false);
      onSave?.(payload);
      toast.success("Encounter saved");
    }, 600);
  };

  return (
    <Paper variant="outlined" sx={{ p: 3, borderRadius: "16px", display: "flex", flexDirection: "column", gap: 3 }}>
      <Typography sx={{ fontSize: "1.0625rem", fontWeight: 700 }}>New Encounter</Typography>

      <TextField
        label="Chief Complaint"
        value={chiefComplaint}
        onChange={(e) => setChiefComplaint(e.target.value)}
        multiline
        minRows={2}
        fullWidth
      />

      <Divider />

      <Box>
        <Typography sx={{ fontSize: "0.8125rem", fontWeight: 600, mb: 1.5 }}>Vitals</Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 2 }}>
          <TextField label="BP Systolic" value={vitals.bp_systolic} onChange={updateVital("bp_systolic")} size="small" />
          <TextField label="BP Diastolic" value={vitals.bp_diastolic} onChange={updateVital("bp_diastolic")} size="small" />
          <TextField label="Pulse" value={vitals.pulse} onChange={updateVital("pulse")} size="small" />
          <TextField label="Temp (°F)" value={vitals.temp} onChange={updateVital("temp")} size="small" />
          <TextField label="SpO2 (%)" value={vitals.spo2} onChange={updateVital("spo2")} size="small" />
          <TextField label="Weight (kg)" value={vitals.weight} onChange={updateVital("weight")} size="small" />
        </Box>
      </Box>

      <Divider />

      <Box>
        <Typography sx={{ fontSize: "0.8125rem", fontWeight: 600, mb: 1.5 }}>SOAP Note</Typography>
        <Stack spacing={2}>
          <TextField label="Subjective" value={soap.subjective} onChange={updateSoap("subjective")} multiline minRows={2} fullWidth />
          <TextField label="Objective" value={soap.objective} onChange={updateSoap("objective")} multiline minRows={2} fullWidth />
          <TextField label="Assessment" value={soap.assessment} onChange={updateSoap("assessment")} multiline minRows={2} fullWidth />
          <TextField label="Plan" value={soap.plan} onChange={updateSoap("plan")} multiline minRows={2} fullWidth />
        </Stack>
      </Box>

      <Divider />

      <Box>
        <Typography sx={{ fontSize: "0.8125rem", fontWeight: 600, mb: 1.5 }}>Diagnosis (ICD-10)</Typography>
        <SearchAutocomplete<IcdCode>
          label="Search diagnosis"
          placeholder="e.g. fever, hypertension"
          options={mockIcdCodes}
          value={icdPick}
          onChange={addDiagnosis}
          getOptionLabel={(d) => d.label}
          getOptionSubtext={(d) => d.code}
          isOptionEqualToValue={(a, b) => a.code === b.code}
        />
        {diagnoses.length > 0 && (
          <Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: "wrap", gap: 1 }}>
            {diagnoses.map((d) => (
              <Chip key={d.code} label={`${d.label} (${d.code})`} onDelete={() => removeDiagnosis(d.code)} size="small" />
            ))}
          </Stack>
        )}
      </Box>

      <Divider />

      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button variant="contained" onClick={handleSave} loading={saving}>
          {saving ? "Saving..." : "Save Encounter"}
        </Button>
      </Stack>
    </Paper>
  );
}