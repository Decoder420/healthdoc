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
import DoctorInstructions from "@/features/nurse/components/DoctorInstructions";
import IntakeOutput from "@/features/nurse/components/IntakeOutput";
import HandoverNotes from "@/features/nurse/components/HandoverNotes";
import PatientMovement from "@/features/nurse/components/PatientMovement";
import ProcedureAssistance from "@/features/nurse/components/ProcedureAssistance";
import AdmissionStatus from "@/features/nurse/components/AdmissionStatus";
import PatientTimeline from "@/features/nurse/components/PatientTimeline";
import QuickActions from "@/features/nurse/components/QuickActions";

import AddVitalsForm from "@/features/nurse/components/AddVitalsForm";
import { useAddVitals } from "@/features/nurse/hooks/useAddVitals";

import { patients } from "@/lib/data/patients";

import { beds } from "@/lib/data/beds";
import { vitals } from "@/lib/data/vitals";
import { medications } from "@/lib/data/medications";

import { NURSING_NOTES } from "@/lib/data/nursingNotes";
import { DOCTOR_INSTRUCTIONS } from "@/lib/data/doctorInstruction";
import { INTAKE_OUTPUT } from "@/lib/data/intakeOutput";
import { HANDOVER_NOTES } from "@/lib/data/handover";
import { PATIENT_MOVEMENTS } from "@/lib/data/patientMovements";
import { PROCEDURES } from "@/lib/data/procedureAssistance";
import { ADMISSION_STATUS } from "@/lib/data/admissionStatus";
import { PATIENT_TIMELINE } from "@/lib/data/patientTimelines";

import { Bed } from "@/components/BedGrid/BedGrid.types";
import { Patient } from "@/features/nurse/components/PatientDetails/PatientDetails.types";

export default function Page() {
  const [selectedWard, setSelectedWard] = useState("general");

  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Filter beds by the currently selected ward — core requirement for W2
  // ("bed grid with ward selector"). Without this, the dropdown had no effect.
  const filteredBeds = beds.filter((bed) => bed.ward_id === selectedWard);

  const handleBedClick = (bed: Bed) => {
    setSelectedBed(bed);

    // NOTE: `Bed` (per schema doc) has no `patientName` field — the old check
    // here referenced a field that doesn't exist on the doc-accurate Bed type.
    // The patient lookup itself (by bed id) was already correct.
    const patient = patients[bed.id];
    setSelectedPatient(patient ?? null);
  };

  const patientNotes = selectedPatient
    ? NURSING_NOTES.filter(
        (note) => note.patientUhid === selectedPatient.uhid
      )
    : [];

  const patientInstructions = selectedPatient
    ? DOCTOR_INSTRUCTIONS.filter(
        (instruction) => instruction.patientUhid === selectedPatient.uhid
      )
    : [];

  const patientIntakeOutput = selectedPatient
    ? INTAKE_OUTPUT.filter(
        (record) => record.patientUhid === selectedPatient.uhid
      )
    : [];

  const patientHandoverNotes = selectedPatient
    ? HANDOVER_NOTES.filter(
        (note) => note.patientUhid === selectedPatient.uhid
      )
    : [];

  const patientMovements = selectedPatient
    ? PATIENT_MOVEMENTS.filter(
        (movement) => movement.patientUhid === selectedPatient.uhid
      )
    : [];

  const patientProcedures = selectedPatient
    ? PROCEDURES.filter(
        (procedure) => procedure.patientUhid === selectedPatient.uhid
      )
    : [];

  const patientAdmissionStatus = selectedPatient
    ? ADMISSION_STATUS.filter(
        (record) => record.patientUhid === selectedPatient.uhid
      )
    : [];

  const patientTimeline = selectedPatient
    ? PATIENT_TIMELINE.filter(
        (event) => event.patientUhid === selectedPatient.uhid
      )
    : [];

  const { submitVitals, isSubmitting } = useAddVitals();

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

      {/* Doctor Instructions */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Doctor Instructions</h2>
          <p className="text-sm text-muted-foreground">
            Medical orders for the selected patient.
          </p>
        </div>

        <DoctorInstructions
          patient={selectedPatient}
          instructions={patientInstructions}
        />
      </section>

      {/* Intake Output */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Intake / Output</h2>
          <p className="text-sm text-muted-foreground">
            Fluid intake and output records for the selected patient.
          </p>
        </div>

        <IntakeOutput patient={selectedPatient} records={patientIntakeOutput} />
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
          patient={selectedPatient}
          notes={patientHandoverNotes}
        />
      </section>

      {/* Patient Movement */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Patient Movement</h2>
          <p className="text-sm text-muted-foreground">
            Movement history for the selected patient.
          </p>
        </div>

        <PatientMovement patient={selectedPatient} records={patientMovements} />
      </section>

      {/* Procedure Assistance */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Procedure Assistance</h2>
          <p className="text-sm text-muted-foreground">
            Procedures assigned to the selected patient.
          </p>
        </div>

        <ProcedureAssistance
          patient={selectedPatient}
          procedures={patientProcedures}
        />
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

      {/* Patient Timeline */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Patient Timeline</h2>
          <p className="text-sm text-muted-foreground">
            Timeline of all activities for the selected patient.
          </p>
        </div>

        <PatientTimeline patient={selectedPatient} events={patientTimeline} />
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

        <QuickActions
          onAction={(action) => {
            console.log(action);
          }}
        />
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

      <AddVitalsForm
        patientId={selectedPatient?.uhid ?? ""}
        isSubmitting={isSubmitting}
        onSubmit={submitVitals}
      />
    </main>
  );
}