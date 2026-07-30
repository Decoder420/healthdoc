"use client";

import Button from "@mui/material/Button";
import type { NewPatientInput } from "@/features/patients/types";
import type { PatientFieldErrors } from "@/features/patients/utils/patient-validation";
import {
  formatAadhaar,
  formatAbha,
} from "@/features/patients/utils/patient-validation";
import {
  readFileAsDataUrl,
  validateDocumentFile,
} from "@/lib/utils/file";
import { FieldSelect, FieldText, FormSection } from "@/components/ui/mui-field";
import { WebcamCapture } from "@/components/receptionist/opd-workflow/webcam-capture";
import { CreateAbhaPanel } from "@/components/receptionist/opd-workflow/create-abha-panel";
import { useState } from "react";

type PatientRegistrationFormProps = {
  form: NewPatientInput;
  errors: PatientFieldErrors;
  onChange: (form: NewPatientInput) => void;
  onClearError: (field: keyof PatientFieldErrors) => void;
  onSetError: (field: keyof PatientFieldErrors, message: string) => void;
};

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

const relationOptions = [
  { value: "father", label: "Father" },
  { value: "mother", label: "Mother" },
  { value: "spouse", label: "Spouse" },
  { value: "sibling", label: "Sibling" },
  { value: "guardian", label: "Legal Guardian" },
  { value: "other", label: "Other" },
];

const identityOptions = [
  { value: "aadhaar", label: "Aadhaar" },
  { value: "pan", label: "PAN" },
  { value: "passport", label: "Passport" },
  { value: "voter_id", label: "Voter ID" },
  { value: "driving_license", label: "Driving License" },
  { value: "other", label: "Other" },
];

export function PatientRegistrationForm({
  form,
  errors,
  onChange,
  onClearError,
  onSetError,
}: PatientRegistrationFormProps) {
  const [showCreateAbha, setShowCreateAbha] = useState(false);

  async function handleDocumentChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const error = validateDocumentFile(file);
    if (error) {
      onSetError("identityDocumentFile", error);
      return;
    }

    onClearError("identityDocumentFile");
    const fileData = await readFileAsDataUrl(file);
    onChange({
      ...form,
      identityDocument: {
        ...form.identityDocument,
        fileName: file.name,
        fileData,
      },
    });
  }

  return (
    <div className="surface-card space-y-8 p-6">
      <FormSection
        title="Basic Details"
        description="Required fields for UHID creation."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <FieldText
            required
            label="Full Name"
            value={form.name}
            onChange={(event) => {
              onClearError("name");
              onChange({ ...form, name: event.target.value });
            }}
            errorText={errors.name}
            placeholder="Patient full name"
          />
          <FieldText
            required
            label="Age"
            type="number"
            inputProps={{ min: 1, max: 120 }}
            value={form.age || ""}
            onChange={(event) => {
              onClearError("age");
              onChange({ ...form, age: Number(event.target.value) });
            }}
            errorText={errors.age}
            placeholder="Age"
          />
          <FieldSelect
            required
            label="Gender"
            value={form.gender}
            onChange={(event) => {
              onClearError("gender");
              onChange({
                ...form,
                gender: event.target.value as NewPatientInput["gender"],
              });
            }}
            errorText={errors.gender}
            options={genderOptions}
          />
          <div className="md:col-span-2">
            <FieldText
              required
              label="Address"
              multiline
              minRows={3}
              value={form.address}
              onChange={(event) => {
                onClearError("address");
                onChange({ ...form, address: event.target.value });
              }}
              errorText={errors.address}
              placeholder="Residential address"
            />
          </div>
        </div>
      </FormSection>

      <FormSection title="Contact Details">
        <div className="grid gap-4 md:grid-cols-2">
          <FieldText
            required
            label="Mobile"
            value={form.phone}
            onChange={(event) => {
              onClearError("phone");
              onChange({ ...form, phone: event.target.value });
            }}
            errorText={errors.phone}
            placeholder="+91 XXXXX XXXXX"
          />
          <FieldText
            label="Alternate Mobile (optional)"
            value={form.alternateMobile}
            onChange={(event) => {
              onClearError("alternateMobile");
              onChange({ ...form, alternateMobile: event.target.value });
            }}
            errorText={errors.alternateMobile}
            placeholder="+91 XXXXX XXXXX"
          />
          <div className="md:col-span-2">
            <FieldText
              label="Email (optional)"
              type="email"
              value={form.email}
              onChange={(event) => {
                onClearError("email");
                onChange({ ...form, email: event.target.value });
              }}
              errorText={errors.email}
              placeholder="patient@email.com"
            />
          </div>
        </div>
      </FormSection>

      <FormSection
        title="Identity Details"
        description="All identity fields are optional."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <FieldText
            label="Aadhaar Number (optional)"
            value={formatAadhaar(form.aadhaar)}
            onChange={(event) => {
              onClearError("aadhaar");
              onChange({
                ...form,
                aadhaar: event.target.value.replace(/\D/g, "").slice(0, 12),
              });
            }}
            errorText={errors.aadhaar}
            placeholder="XXXX XXXX XXXX"
          />
          <FieldText
            label="ABHA ID (optional)"
            value={formatAbha(form.abha)}
            onChange={(event) => {
              onClearError("abha");
              onChange({
                ...form,
                abha: event.target.value.replace(/\D/g, "").slice(0, 14),
              });
            }}
            errorText={errors.abha}
            placeholder="XX-XXXX-XXXX-XXXX"
            helperText={
              form.abha
                ? "ABHA linked"
                : "Leave blank if patient does not have ABHA"
            }
          />
          {!form.abha && (
            <div className="md:col-span-2">
              <Button
                variant="outlined"
                onClick={() => setShowCreateAbha((current) => !current)}
              >
                {showCreateAbha ? "Hide Create ABHA" : "Create ABHA for Patient"}
              </Button>
            </div>
          )}
          {showCreateAbha && !form.abha && (
            <div className="md:col-span-2">
              <CreateAbhaPanel
                patientName={form.name}
                initialAadhaar={form.aadhaar}
                initialPhone={form.phone}
                onCancel={() => setShowCreateAbha(false)}
                onCreated={(abha, created) => {
                  onClearError("abha");
                  onChange({
                    ...form,
                    abha: abha.replace(/\D/g, "").slice(0, 14),
                    aadhaar: form.aadhaar || created?.aadhaar || form.aadhaar,
                    phone: form.phone || created?.phone || form.phone,
                  });
                  setShowCreateAbha(false);
                }}
              />
            </div>
          )}
          <FieldSelect
            label="Identity Document Type (optional)"
            value={form.identityDocument.type}
            onChange={(event) =>
              onChange({
                ...form,
                identityDocument: {
                  ...form.identityDocument,
                  type: event.target.value as NewPatientInput["identityDocument"]["type"],
                },
              })
            }
            options={identityOptions}
          />
          <FieldText
            label="Identity Document Number (optional)"
            value={form.identityDocument.documentNumber}
            onChange={(event) => {
              onClearError("identityDocumentNumber");
              onChange({
                ...form,
                identityDocument: {
                  ...form.identityDocument,
                  documentNumber: event.target.value,
                },
              });
            }}
            errorText={errors.identityDocumentNumber}
            placeholder="Document number"
          />
          <div className="md:col-span-2">
            <Button variant="outlined" component="label">
              Upload Identity Document (optional)
              <input
                hidden
                accept="image/*,.pdf"
                type="file"
                onChange={handleDocumentChange}
              />
            </Button>
            {form.identityDocument.fileName && (
              <p className="mt-2 text-xs text-muted-foreground">
                Uploaded: {form.identityDocument.fileName}
              </p>
            )}
            {errors.identityDocumentFile && (
              <p className="mt-1 text-xs text-danger">{errors.identityDocumentFile}</p>
            )}
          </div>
        </div>
      </FormSection>

      <FormSection
        title="Guardian Details"
        description="Optional — fill only if applicable."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <FieldText
            label="Guardian Name (optional)"
            value={form.guardian.name}
            onChange={(event) => {
              onClearError("guardianName");
              onChange({
                ...form,
                guardian: { ...form.guardian, name: event.target.value },
              });
            }}
            errorText={errors.guardianName}
            placeholder="Guardian full name"
          />
          <FieldSelect
            label="Relation (optional)"
            value={form.guardian.relation}
            onChange={(event) =>
              onChange({
                ...form,
                guardian: {
                  ...form.guardian,
                  relation: event.target.value as NewPatientInput["guardian"]["relation"],
                },
              })
            }
            options={relationOptions}
          />
          <FieldText
            label="Guardian Phone (optional)"
            value={form.guardian.phone}
            onChange={(event) => {
              onClearError("guardianPhone");
              onChange({
                ...form,
                guardian: { ...form.guardian, phone: event.target.value },
              });
            }}
            errorText={errors.guardianPhone}
            placeholder="+91 XXXXX XXXXX"
          />
          <FieldText
            label="Guardian Address (optional)"
            value={form.guardian.address}
            onChange={(event) => {
              onClearError("guardianAddress");
              onChange({
                ...form,
                guardian: { ...form.guardian, address: event.target.value },
              });
            }}
            errorText={errors.guardianAddress}
            placeholder="Guardian address"
          />
        </div>
      </FormSection>

      <FormSection
        title="Patient Photo"
        description="Optional — capture a live photo using the webcam."
      >
        <WebcamCapture
          photo={form.photo}
          error={errors.photo}
          onCapture={(photo) => {
            onClearError("photo");
            onChange({ ...form, photo });
          }}
          onClear={() => {
            onClearError("photo");
            onChange({ ...form, photo: "" });
          }}
        />
      </FormSection>
    </div>
  );
}
