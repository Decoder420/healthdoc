"use client";

import { useMemo, useState } from "react";
import type { NewPatientInput, Patient } from "@/features/patients/types";
import { emptyPatientForm } from "@/features/patients/types";
import type { PatientFieldErrors } from "@/features/patients/utils/patient-validation";
import { getDoctorById } from "@/features/opd/services/opd-service";
import { useOpdQueue } from "@/features/opd/context/opd-queue-context";
import {
  createOpdVisit,
  createPatient,
  createQueueEntry,
  generateOpdId,
  generateReceiptNumber,
  generateTokenNumber,
  getTokenFee,
  searchPatientByType,
} from "@/features/opd/services/opd-service";
import type { OpdVisit, OpdWorkflowStep, PaymentMethod } from "@/features/opd/types";
import type { PatientSearchType } from "@/features/patients/types/search";
import { CreateAbhaPanel } from "@/components/receptionist/opd-workflow/create-abha-panel";
import { StepIndicator } from "@/components/receptionist/opd-workflow/step-indicator";
import { DoctorSelectionStep } from "@/components/receptionist/opd-workflow/steps/doctor-selection-step";
import { PatientStep } from "@/components/receptionist/opd-workflow/steps/patient-step";
import { QueueConfirmationStep } from "@/components/receptionist/opd-workflow/steps/queue-confirmation-step";
import { ReceiptStep } from "@/components/receptionist/opd-workflow/steps/receipt-step";
import { SearchPatientStep } from "@/components/receptionist/opd-workflow/steps/search-patient-step";
import { TokenFeeStep } from "@/components/receptionist/opd-workflow/steps/token-fee-step";

const emptyPatientFormState: NewPatientInput = { ...emptyPatientForm };

function createInitialState() {
  return {
    step: "search" as OpdWorkflowStep,
    searchType: "uhid" as PatientSearchType,
    searchQuery: "",
    patient: null as Patient | null,
    isNewPatient: false,
    patientForm: { ...emptyPatientFormState },
    opdId: "",
    departmentId: "",
    doctorId: "",
    tokenNumber: "",
    tokenFee: getTokenFee(),
    paymentMethod: "cash" as PaymentMethod,
    receiptNumber: "",
    visit: null as OpdVisit | null,
    searchError: "",
    patientError: "",
    fieldErrors: {} as PatientFieldErrors,
    foundPatient: null as Patient | null,
    showCreateAbha: false,
    searchFailed: false,
  };
}

export function OpdRegistrationWizard() {
  const { addToQueue } = useOpdQueue();
  const [state, setState] = useState(createInitialState);

  const selectedDoctor = useMemo(
    () => (state.doctorId ? getDoctorById(state.doctorId) : undefined),
    [state.doctorId],
  );

  function handleSearch() {
    const query = state.searchQuery.trim();
    if (!query) {
      setState((current) => ({
        ...current,
        searchError: `Please enter a ${state.searchType.toUpperCase()} to search.`,
        foundPatient: null,
        showCreateAbha: false,
        searchFailed: false,
      }));
      return;
    }

    if (state.searchType === "aadhaar" && query.replace(/\D/g, "").length !== 12) {
      setState((current) => ({
        ...current,
        searchError: "Aadhaar number must be 12 digits.",
        foundPatient: null,
        searchFailed: false,
      }));
      return;
    }

    if (state.searchType === "abha" && query.replace(/\D/g, "").length !== 14) {
      setState((current) => ({
        ...current,
        searchError: "ABHA number must be 14 digits.",
        foundPatient: null,
        searchFailed: false,
      }));
      return;
    }

    if (state.searchType === "mobile") {
      const digits = query.replace(/\D/g, "");
      const mobile =
        digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits;
      if (!/^[6-9]\d{9}$/.test(mobile)) {
        setState((current) => ({
          ...current,
          searchError: "Enter a valid 10-digit mobile number.",
          foundPatient: null,
          searchFailed: false,
        }));
        return;
      }
    }

    const patient = searchPatientByType(state.searchType, query);

    if (patient) {
      setState((current) => ({
        ...current,
        foundPatient: patient,
        searchError: "",
        showCreateAbha: false,
        searchFailed: false,
      }));
      return;
    }

    setState((current) => ({
      ...current,
      foundPatient: null,
      searchError: `No patient found for this ${state.searchType.toUpperCase()}. You can now register a new patient.`,
      showCreateAbha: false,
      searchFailed: true,
    }));
  }

  function handleRegisterNew() {
    if (!state.searchFailed) return;

    const prefill: NewPatientInput = { ...emptyPatientFormState };

    if (state.searchType === "aadhaar") {
      prefill.aadhaar = state.searchQuery.replace(/\D/g, "").slice(0, 12);
    }
    if (state.searchType === "abha") {
      prefill.abha = state.searchQuery.replace(/\D/g, "").slice(0, 14);
    }
    if (state.searchType === "mobile") {
      prefill.phone = state.searchQuery;
    }

    setState((current) => ({
      ...current,
      foundPatient: null,
      step: "patient",
      patient: null,
      isNewPatient: true,
      patientForm: prefill,
      patientError: "",
      searchError: "",
      fieldErrors: {},
      showCreateAbha: false,
      searchFailed: false,
    }));
  }

  function handleContinueWithFound() {
    if (!state.foundPatient) return;

    setState((current) => ({
      ...current,
      step: "patient",
      patient: current.foundPatient,
      isNewPatient: false,
      patientError: "",
      searchError: "",
      showCreateAbha: false,
    }));
  }

  function handlePatientContinue() {
    if (state.isNewPatient) {
      const result = createPatient(state.patientForm);

      if (!result.success) {
        setState((current) => ({
          ...current,
          patientError: result.error,
          fieldErrors: result.errors ?? current.fieldErrors,
          patient: result.existingPatient ?? current.patient,
        }));
        return;
      }

      setState((current) => ({
        ...current,
        patient: result.patient,
        isNewPatient: false,
        patientError: "",
        fieldErrors: {},
        opdId: generateOpdId(),
        step: "doctor",
      }));
      return;
    }

    if (!state.patient) return;

    setState((current) => ({
      ...current,
      patientError: "",
      opdId: generateOpdId(),
      step: "doctor",
    }));
  }

  function handleUseExistingPatient(patient: Patient) {
    setState((current) => ({
      ...current,
      patient,
      isNewPatient: false,
      patientError: "",
      opdId: generateOpdId(),
      step: "doctor",
    }));
  }

  function handleDoctorContinue() {
    if (!selectedDoctor) return;

    setState((current) => ({
      ...current,
      tokenNumber: generateTokenNumber(selectedDoctor.departmentCode),
      step: "fee",
    }));
  }

  function handleCollectFee() {
    if (!state.patient || !state.doctorId) return;

    const receiptNumber = generateReceiptNumber();
    const visit = createOpdVisit({
      patient: state.patient,
      doctorId: state.doctorId,
      departmentId: state.departmentId,
      paymentMethod: state.paymentMethod,
      opdId: state.opdId,
      tokenNumber: state.tokenNumber,
      receiptNumber,
    });

    setState((current) => ({
      ...current,
      receiptNumber,
      visit,
      step: "receipt",
    }));
  }

  function handlePrintReceipt() {
    window.print();
  }

  function handleAddToQueue() {
    if (!state.visit) return;
    addToQueue(createQueueEntry(state.visit));
    setState((current) => ({
      ...current,
      step: "complete",
    }));
  }

  function handleStartNew() {
    setState(createInitialState());
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium text-primary">OPD Registration</p>
          <h1 className="text-2xl font-semibold text-foreground">Reception Workflow</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Search by UHID / Aadhaar / ABHA / Mobile → Register patient → Generate OPD ID → Assign doctor → Collect fee → Print receipt → Add to queue
          </p>
        </div>
        <StepIndicator currentStep={state.step} />
      </div>

      {state.step === "search" && (
        <>
          <SearchPatientStep
            searchType={state.searchType}
            searchQuery={state.searchQuery}
            foundPatient={state.foundPatient}
            searchFailed={state.searchFailed}
            onSearchTypeChange={(searchType) =>
              setState((current) => ({
                ...current,
                searchType,
                searchQuery: "",
                searchError: "",
                foundPatient: null,
                showCreateAbha: false,
                searchFailed: false,
              }))
            }
            onSearchQueryChange={(value) =>
              setState((current) => ({
                ...current,
                searchQuery: value,
                searchError: "",
                foundPatient: null,
                showCreateAbha: false,
                searchFailed: false,
              }))
            }
            onSearch={handleSearch}
            onContinueWithFound={handleContinueWithFound}
            onRegisterNew={handleRegisterNew}
            onCreateAbhaForFound={() =>
              setState((current) => ({ ...current, showCreateAbha: true }))
            }
            error={state.searchError}
          />

          {state.showCreateAbha && state.foundPatient && !state.foundPatient.abha && (
            <CreateAbhaPanel
              patientName={state.foundPatient.name}
              uhid={state.foundPatient.uhid}
              initialAadhaar={state.foundPatient.aadhaar}
              initialPhone={state.foundPatient.phone}
              onCancel={() =>
                setState((current) => ({ ...current, showCreateAbha: false }))
              }
              onCreated={(_abha, updatedPatient) => {
                setState((current) => ({
                  ...current,
                  showCreateAbha: false,
                  foundPatient: updatedPatient ?? current.foundPatient,
                  patient:
                    current.patient?.uhid === updatedPatient?.uhid
                      ? updatedPatient ?? current.patient
                      : current.patient,
                }));
              }}
            />
          )}
        </>
      )}

      {state.step === "patient" && (
        <PatientStep
          patient={state.patient}
          isNewPatient={state.isNewPatient}
          form={state.patientForm}
          errors={state.fieldErrors}
          error={state.patientError}
          onFormChange={(patientForm) =>
            setState((current) => ({
              ...current,
              patientForm,
              patientError: "",
            }))
          }
          onErrorsChange={(fieldErrors) =>
            setState((current) => ({ ...current, fieldErrors }))
          }
          onClearError={(field) =>
            setState((current) => {
              const next = { ...current.fieldErrors };
              delete next[field];
              return { ...current, fieldErrors: next };
            })
          }
          onSetError={(field, message) =>
            setState((current) => ({
              ...current,
              fieldErrors: { ...current.fieldErrors, [field]: message },
            }))
          }
          onBack={() =>
            setState((current) => ({
              ...current,
              step: "search",
              patientError: "",
              fieldErrors: {},
              isNewPatient: false,
              patient: null,
              showCreateAbha: false,
              // Allow register again only if previous search had failed
              searchFailed: current.isNewPatient && !current.foundPatient,
            }))
          }
          onContinue={handlePatientContinue}
          onUseExisting={handleUseExistingPatient}
          onPatientUpdated={(updatedPatient) =>
            setState((current) => ({
              ...current,
              patient: updatedPatient,
              foundPatient:
                current.foundPatient?.uhid === updatedPatient.uhid
                  ? updatedPatient
                  : current.foundPatient,
            }))
          }
        />
      )}

      {state.step === "doctor" && state.patient && (
        <DoctorSelectionStep
          patient={state.patient}
          opdId={state.opdId}
          departmentId={state.departmentId}
          doctorId={state.doctorId}
          onDepartmentChange={(departmentId) =>
            setState((current) => ({
              ...current,
              departmentId,
              doctorId: "",
            }))
          }
          onDoctorChange={(doctorId) =>
            setState((current) => ({ ...current, doctorId }))
          }
          onBack={() => setState((current) => ({ ...current, step: "patient" }))}
          onContinue={handleDoctorContinue}
        />
      )}

      {state.step === "fee" && state.patient && selectedDoctor && (
        <TokenFeeStep
          patient={state.patient}
          opdId={state.opdId}
          tokenNumber={state.tokenNumber}
          tokenFee={state.tokenFee}
          paymentMethod={state.paymentMethod}
          doctorName={selectedDoctor.name}
          department={selectedDoctor.department}
          onPaymentMethodChange={(paymentMethod) =>
            setState((current) => ({ ...current, paymentMethod }))
          }
          onBack={() => setState((current) => ({ ...current, step: "doctor" }))}
          onCollectFee={handleCollectFee}
        />
      )}

      {state.step === "receipt" && state.visit && (
        <ReceiptStep
          visit={state.visit}
          onBack={() => setState((current) => ({ ...current, step: "fee" }))}
          onPrint={handlePrintReceipt}
          onAddToQueue={handleAddToQueue}
        />
      )}

      {state.step === "complete" && state.visit && (
        <QueueConfirmationStep visit={state.visit} onStartNew={handleStartNew} />
      )}
    </div>
  );
}
