"use client";

import { useState } from "react";
import type { RaiseIpdRequestInput } from "@/features/ipd/types";
import {
  IPD_REQUEST_TYPE_LABELS,
  type IpdRequestType,
} from "@/features/ipd/types";
import { raiseIpdRequest } from "@/features/ipd/api";
import { getAllPatients } from "@/features/patients/api";
import { getAllDoctors } from "@/features/doctors/api";
import { FieldSelect, FieldText, FormSection } from "@/components/ui/mui-field";
import { Button } from "@/components/ui/button";

type RaiseIpdRequestFormProps = {
  defaultDoctorId?: string;
  onCreated: () => void;
};

export function RaiseIpdRequestForm({
  defaultDoctorId,
  onCreated,
}: RaiseIpdRequestFormProps) {
  const patients = getAllPatients();
  const doctors = getAllDoctors().filter((doctor) => doctor.status === "active");

  const defaultDoctor =
    doctors.find((doctor) => doctor.id === defaultDoctorId) ?? doctors[0];

  const [uhid, setUhid] = useState("");
  const [doctorId, setDoctorId] = useState(defaultDoctor?.id ?? "");
  const [type, setType] = useState<IpdRequestType>("admission");
  const [priority, setPriority] = useState<"normal" | "urgent">("normal");
  const [clinicalNotes, setClinicalNotes] = useState("");
  const [opdId, setOpdId] = useState("");
  const [tokenNumber, setTokenNumber] = useState("");
  const [error, setError] = useState("");

  function handleSubmit() {
    const patient = patients.find((item) => item.uhid === uhid);
    const doctor = doctors.find((item) => item.id === doctorId);

    if (!patient) {
      setError("Select a patient.");
      return;
    }
    if (!doctor) {
      setError("Select a doctor.");
      return;
    }

    const payload: RaiseIpdRequestInput = {
      opdId,
      tokenNumber,
      uhid: patient.uhid,
      patientName: patient.name,
      patientPhone: patient.phone,
      doctorId: doctor.id,
      doctorName: doctor.name,
      department: doctor.department,
      type,
      priority,
      clinicalNotes,
    };

    const result = raiseIpdRequest(payload);
    if (!result.success) {
      setError(result.error);
      return;
    }

    setError("");
    setClinicalNotes("");
    setUhid("");
    setOpdId("");
    setTokenNumber("");
    onCreated();
  }

  return (
    <div className="surface-card space-y-5 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Doctor IPD Request</p>
          <h2 className="text-xl font-semibold text-foreground">
            Raise Admission / Care Request
          </h2>
          <p className="text-sm text-muted-foreground">
            IPD desk will assign ward bed and nurse after this request.
          </p>
        </div>
        <Button type="button" onClick={handleSubmit}>
          Submit Request
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-danger/30 bg-danger-muted/30 p-3 text-sm text-danger">
          {error}
        </div>
      )}

      <FormSection title="Patient & doctor">
        <div className="grid gap-4 md:grid-cols-2">
          <FieldSelect
            label="Patient"
            value={uhid}
            onChange={(event) => setUhid(event.target.value)}
            options={[
              { value: "", label: "Select patient" },
              ...patients.map((patient) => ({
                value: patient.uhid,
                label: `${patient.name} · ${patient.uhid}`,
              })),
            ]}
          />
          <FieldSelect
            label="Requesting Doctor"
            value={doctorId}
            onChange={(event) => setDoctorId(event.target.value)}
            options={[
              { value: "", label: "Select doctor" },
              ...doctors.map((doctor) => ({
                value: doctor.id,
                label: `${doctor.name} · ${doctor.department}`,
              })),
            ]}
          />
          <FieldText
            label="OPD / Reference ID (optional)"
            value={opdId}
            onChange={(event) => setOpdId(event.target.value)}
            placeholder="OPD2025..."
          />
          <FieldText
            label="Token (optional)"
            value={tokenNumber}
            onChange={(event) => setTokenNumber(event.target.value)}
            placeholder="GM-014"
          />
        </div>
      </FormSection>

      <FormSection title="Request details">
        <div className="grid gap-4 md:grid-cols-2">
          <FieldSelect
            label="Request Type"
            value={type}
            onChange={(event) => setType(event.target.value as IpdRequestType)}
            options={(
              Object.entries(IPD_REQUEST_TYPE_LABELS) as [IpdRequestType, string][]
            ).map(([value, label]) => ({ value, label }))}
          />
          <FieldSelect
            label="Priority"
            value={priority}
            onChange={(event) =>
              setPriority(event.target.value as "normal" | "urgent")
            }
            options={[
              { value: "normal", label: "Normal" },
              { value: "urgent", label: "Urgent" },
            ]}
          />
          <div className="md:col-span-2">
            <FieldText
              label="Clinical notes / reason"
              value={clinicalNotes}
              onChange={(event) => setClinicalNotes(event.target.value)}
              multiline
              minRows={3}
              placeholder="e.g. Needs ward admission for IV antibiotics and monitoring"
            />
          </div>
        </div>
      </FormSection>
    </div>
  );
}
