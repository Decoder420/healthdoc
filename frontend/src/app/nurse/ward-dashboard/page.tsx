"use client";

import { useState } from "react";

import WardSelector, {
  WARDS,
} from "@/features/nurse/components/WardSelector";

import BedGrid from "@/components/BedGrid";
import VitalsTimeline from "@/components/VitalsTimeline";
import VitalsChart from "@/components/VitalsTimeline/vitalsChart";

import EMARTable from "@/components/tables/EMARTable";

import WardStats from "@/features/nurse/components/WardStats";
import PatientDetails from "@/features/nurse/components/PatientDetails";
import AlertsPanel from "@/features/nurse/components/AlertsPanel";
import NursingNotes from "@/features/nurse/components/NursingNotes";

import IntakeOutput from "@/features/nurse/components/IntakeOutput";
import HandoverNotes from "@/features/nurse/components/HandoverNotes";
import PatientMovement from "@/features/nurse/components/PatientMovement";

import AdmissionStatus from "@/features/nurse/components/AdmissionStatus";

import QuickActions from "@/features/nurse/components/QuickActions";

import AddVitalsForm from "@/features/nurse/components/AddVitalsForm";
import { useAddVitals } from "@/features/nurse/hooks/useAddVitals";

import AddHandoverForm from "@/features/nurse/components/AddHandoverForm";
import { useAddHandover } from "@/features/nurse/hooks/useAddHandover";

import AddIntakeOutputForm from "@/features/nurse/components/AddIntakeOutputForm";
import { useAddIntakeOutput } from "@/features/nurse/hooks/useAddIntakeOutput";

import AddPatientMovementForm from "@/features/nurse/components/AddPatientMovementForm";
import { useAddPatientMovement } from "@/features/nurse/hooks/useAddPatientMovement";
import type { AddPatientMovementSchema } from "@/features/nurse/components/AddPatientMovementForm/validation";

import TaskQueue from "@/features/nurse/components/TaskQueue";
import { orders as initialOrders } from "@/lib/data/orders";

import { patients } from "@/lib/data/patients";
import { admissionsByBedId } from "@/lib/data/admissionsByBed";

import { beds } from "@/lib/data/beds";
import { vitals } from "@/lib/data/vitals";
import { medications } from "@/lib/data/medications";

import { NURSING_NOTES } from "@/lib/data/nursingNotes";
import { INTAKE_OUTPUT } from "@/lib/data/intakeOutput";
import { HANDOVER_NOTES } from "@/lib/data/handover";
import { PATIENT_MOVEMENTS } from "@/lib/data/patientMovements";
import { ADMISSION_STATUS } from "@/lib/data/admissionStatus";

import { Bed } from "@/components/BedGrid/BedGrid.types";
import { Patient } from "@/features/nurse/components/PatientDetails/PatientDetails.types";

export default function Page() {
  const [selectedWard, setSelectedWard] = useState("general");
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const [selectedAdmissionId, setSelectedAdmissionId] = useState<string | null>(
    null
  );

  const [orders, setOrders] = useState(initialOrders);

  // Handover and Intake/Output are now local state (not just imported consts)
  // so a new submission can be appended and show up immediately.
  const [handoverNotes, setHandoverNotes] = useState(HANDOVER_NOTES);
  const [intakeOutputRecords, setIntakeOutputRecords] = useState(INTAKE_OUTPUT);

  // Now admission_id-based, matching patient_movement_log exactly — same
  // rewrite pattern as HandoverNotes/IntakeOutput.
  const [patientMovements, setPatientMovements] = useState(PATIENT_MOVEMENTS);

  // TODO: replace with the logged-in nurse's real user id once auth/session
  // context exists. moved_by is a required field on patient_movement_log
  // (no [Blame] audit mixin here), so this cannot stay hardcoded in production.
  const CURRENT_NURSE_ID = "b3f1a2c4-1111-4a5b-9c1d-000000000001";

  // Quick Actions now drives which form shows below it, instead of every form
  // being permanently inline on the page.
  const [activeAction, setActiveAction] = useState<string | null>(null);

  // Actions with no confirmed backend table/endpoint yet — shown as an honest
  // message instead of a form, so the UI doesn't pretend these work.
  const BLOCKED_ACTION_MESSAGES: Record<string, string> = {
    medication:
      "Medication administration isn't available yet — no per-dose eMAR table exists in the backend schema (only prescription_items.status, which is per-prescription, not per-dose). Flagged for backend confirmation.",
    doctor:
      "\"Call Doctor\" isn't wired to any backend feature yet — no table/endpoint exists for this in the schema doc.",
    history:
      "Patient Timeline was removed (per TL feedback — no timeline table exists). It may be rebuilt later as a UI-only aggregate of vitals/orders/handovers, not as its own data entity.",
    note:
      "Nursing Note's fields (category, priority) aren't confirmed against the schema doc — only nursing_handover_notes exists, and it doesn't have these fields. Flagged for TL/backend confirmation before wiring this up for real.",
  };

  const filteredBeds = beds.filter((bed) => bed.ward_id === selectedWard);

  const handleBedClick = (bed: Bed) => {
    setSelectedBed(bed);

    const patient = patients[bed.id];
    setSelectedPatient(patient ?? null);

    const admissionId = admissionsByBedId[bed.id] ?? null;
    setSelectedAdmissionId(admissionId);
  };

  const handleCheckOff = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status: "completed", completed_at: new Date().toISOString() }
          : o
      )
    );
  };

  const patientNotes = selectedPatient
    ? NURSING_NOTES.filter(
        (note) => note.patientUhid === selectedPatient.uhid
      )
    : [];

  const admissionIntakeOutput = selectedAdmissionId
    ? intakeOutputRecords.filter(
        (record) => record.admission_id === selectedAdmissionId
      )
    : [];

  const admissionHandoverNotes = selectedAdmissionId
    ? handoverNotes.filter((note) => note.admission_id === selectedAdmissionId)
    : [];

  const admissionMovements = selectedAdmissionId
    ? patientMovements.filter(
        (record) => record.admission_id === selectedAdmissionId
      )
    : [];

  const patientAdmissionStatus = selectedPatient
    ? ADMISSION_STATUS.filter(
        (record) => record.patientUhid === selectedPatient.uhid
      )
    : [];

  const { submitVitals, isSubmitting } = useAddVitals();

  const { submitHandover, isSubmitting: isSubmittingHandover } =
    useAddHandover();

  const { submitIntakeOutput, isSubmitting: isSubmittingIntakeOutput } =
    useAddIntakeOutput();

  const {
    submitPatientMovement,
    isSubmitting: isSubmittingPatientMovement,
  } = useAddPatientMovement();

  // TODO: replace with a real refetch once backend confirms the handover
  // endpoint contract. For now, optimistically append a local record so the
  // nurse sees the new entry immediately (same pattern as Task Queue check-off).
  const handleAddHandover = async (
    data: Parameters<typeof submitHandover>[0]
  ) => {
    try {
      await submitHandover(data);
    } catch {
      // backend endpoint isn't confirmed yet — still show it locally below
    }

    setHandoverNotes((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        ...data,
        created_at: new Date().toISOString(),
      },
    ]);
  };

  // TODO: replace with a real refetch once backend confirms the intake/output
  // endpoint contract. Optimistic local append in the meantime.
  const handleAddIntakeOutput = async (
    data: Parameters<typeof submitIntakeOutput>[0]
  ) => {
    const ok = await submitIntakeOutput(data);

    setIntakeOutputRecords((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        ...data,
        notes: data.notes ?? null,
        created_at: new Date().toISOString(),
      },
    ]);

    return ok;
  };

  // TODO: replace with a real refetch once backend confirms the patient
  // movement endpoint contract. Optimistic local append in the meantime.
  const handleAddPatientMovement = async (data: AddPatientMovementSchema) => {
    const ok = await submitPatientMovement(data);

    setPatientMovements((prev) => [
      ...prev,
      { id: crypto.randomUUID(), ...data },
    ]);

    return ok;
  };

  return (
    <main className="mx-auto max-w-screen-2xl space-y-8 px-6 py-8">
      {/* Header */}
      <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">
            Nurse Dashboard
          </h1>

          <p className="mt-2 text-muted-foreground">
            Manage ward beds, patient vitals and medication administration.
          </p>
        </div>

        <div className="surface-card px-4 py-3">
          <p className="text-xs text-muted-foreground">Current Shift</p>
          <p className="mt-1 font-semibold">Morning Shift</p>
        </div>
      </section>

      {/* Ward Selector */}
      <WardSelector
        wards={WARDS}
        selectedWard={selectedWard}
        onChange={setSelectedWard}
      />

      {/* Ward Statistics */}
      <WardStats />

      {/* Task Queue (W4) — ward/shift-level, not tied to the selected patient,
          so it sits with ward-level info rather than between Bed Grid and
          patient-specific sections. */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Task Queue</h2>
          <p className="text-sm text-muted-foreground">
            Pending doctor orders for this shift.
          </p>
        </div>

        <TaskQueue orders={orders} onCheckOff={handleCheckOff} />
      </section>

      {/* Bed Grid */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Ward Overview</h2>
          <p className="text-sm text-muted-foreground">
            Current bed occupancy for the selected ward.
          </p>
        </div>

        <BedGrid
          beds={filteredBeds}
          selectedBedId={selectedBed?.id}
          onBedClick={handleBedClick}
        />
      </section>

      {/* Patient Details */}
      <PatientDetails patient={selectedPatient} />

      {/* Vitals Timeline */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Vitals Timeline</h2>
          <p className="text-sm text-muted-foreground">
            Latest patient vital recordings.
          </p>
        </div>

        <VitalsTimeline records={vitals} />
        <VitalsChart records={vitals} />
      </section>

      {/* Nursing Notes */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Nursing Notes</h2>
          <p className="text-sm text-muted-foreground">
            Nursing observations for the selected patient.
          </p>
        </div>

        <NursingNotes patient={selectedPatient} notes={patientNotes} />
      </section>

      {/* Intake Output */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Intake / Output</h2>
          <p className="text-sm text-muted-foreground">
            Fluid intake and output records for the selected patient.
          </p>
        </div>

        <IntakeOutput
          admissionId={selectedAdmissionId}
          records={admissionIntakeOutput}
        />

        {/* Add form only shows once a bed with a real admission is selected */}
        {selectedAdmissionId && (
          <AddIntakeOutputForm
            admissionId={selectedAdmissionId}
            isSubmitting={isSubmittingIntakeOutput}
            onSubmit={handleAddIntakeOutput}
          />
        )}
      </section>

      {/* Handover Notes */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Handover Notes</h2>
          <p className="text-sm text-muted-foreground">
            Shift handover details for the selected patient.
          </p>
        </div>

        <HandoverNotes
          admissionId={selectedAdmissionId}
          notes={admissionHandoverNotes}
        />

        {selectedAdmissionId && (
          <AddHandoverForm
            admissionId={selectedAdmissionId}
            isSubmitting={isSubmittingHandover}
            onSubmit={handleAddHandover}
          />
        )}
      </section>

      {/* Patient Movement */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Patient Movement</h2>
          <p className="text-sm text-muted-foreground">
            Movement history for the selected patient.
          </p>
        </div>

        <PatientMovement
          admissionId={selectedAdmissionId}
          records={admissionMovements}
          wards={WARDS}
          beds={beds}
        />
        {/* Use "Transfer" in Quick Actions below to record a new movement. */}
      </section>

      {/* Admission Status */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Admission Status</h2>
          <p className="text-sm text-muted-foreground">
            Admission workflow for the selected patient.
          </p>
        </div>

        <AdmissionStatus
          patient={selectedPatient}
          records={patientAdmissionStatus}
        />
      </section>

      {/* Medication */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">
            Medication Administration Record
          </h2>
          <p className="text-sm text-muted-foreground">
            Scheduled and administered medications.
          </p>
        </div>

        <EMARTable medications={medications} />
      </section>

      {/* Quick Actions */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Quick Actions</h2>
          <p className="text-sm text-muted-foreground">
            Frequently used nursing actions.
          </p>
        </div>

        <QuickActions onAction={(actionId) => setActiveAction(actionId)} />

        {activeAction && !selectedAdmissionId && (
          <div className="surface-card p-4 text-sm text-muted-foreground">
            Select a bed/patient first before using this action.
          </div>
        )}

        {activeAction &&
          selectedAdmissionId &&
          BLOCKED_ACTION_MESSAGES[activeAction] && (
            <div className="surface-card p-4 text-sm text-warning">
              {BLOCKED_ACTION_MESSAGES[activeAction]}
            </div>
          )}

        {activeAction === "vitals" && selectedAdmissionId && (
          <AddVitalsForm
            patientId={selectedPatient?.uhid ?? ""}
            isSubmitting={isSubmitting}
            onSubmit={submitVitals}
          />
        )}

        {activeAction === "transfer" && selectedAdmissionId && selectedBed && (
          <AddPatientMovementForm
            admissionId={selectedAdmissionId}
            currentWardId={selectedBed.ward_id}
            currentBedId={selectedBed.id}
            wards={WARDS}
            beds={beds}
            movedBy={CURRENT_NURSE_ID}
            isSubmitting={isSubmittingPatientMovement}
            onSubmit={handleAddPatientMovement}
          />
        )}
      </section>

      {/* Alerts */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Alerts</h2>
          <p className="text-sm text-muted-foreground">
            Critical alerts and notifications.
          </p>
        </div>

        <AlertsPanel />
      </section>
    </main>
  );
}