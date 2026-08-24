"use client";
import { useState, useEffect } from "react";

import WardSelector, {
  WARDS,
} from "@/features/nurse/components/WardSelector";

import BedGrid from "@/components/BedGrid";
import VitalsTimeline from "@/components/VitalsTimeline";
import { VitalsChart } from "@/components/VitalsTimeline";

import EMARTable from "@/components/tables/EMARTable";

import WardStats from "@/features/nurse/components/WardStats";
import PatientDetails from "@/features/nurse/components/PatientDetails";

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

import AddPatientMovementForm from "@/components/AddPatientMovementForm";
import { useAddPatientMovement } from "@/components/AddPatientMovementForm/useAddPatientMovement";
import type { AddPatientMovementSchema } from "@/components/AddPatientMovementForm/validation";

import ProcedureAssistance from "@/features/nurse/components/ProcedureAssistance";
import AddProcedureAssistanceForm from "@/features/nurse/components/AddProcedureAssistanceForm";
import { useAddProcedureAssistance } from "@/features/nurse/hooks/useAddProcedureAssistance";
import type { AddProcedureAssistanceSchema } from "@/features/nurse/components/AddProcedureAssistanceForm/validation";
import { procedureContextByBedId } from "@/lib/data/procedureContextByBed";
import { PROCEDURE_RECORDS } from "@/lib/data/procedureAssistance";

import TaskQueue from "@/features/nurse/components/TaskQueue";
import { orders as initialOrders } from "@/lib/data/orders";

import { patients } from "@/lib/data/patients";
import { admissionsByBedId } from "@/lib/data/admissionsByBed";

import { beds } from "@/lib/data/beds";
import { vitals } from "@/lib/data/vitals";
import { medications } from "@/lib/data/medications";
import { MOCK_DISCHARGES } from "@/lib/data/mockDischarges";
import type { WardStat } from "@/features/nurse/components/WardStats/WardStats.types";

import { INTAKE_OUTPUT } from "@/lib/data/intakeOutput";
import { HANDOVER_NOTES } from "@/lib/data/handover";
import { PATIENT_MOVEMENTS } from "@/lib/data/patientMovements";
import { ADMISSION_STATUS } from "@/lib/data/admissionStatus";

import { Bed } from "@/components/BedGrid/BedGrid.types";
import { Patient } from "@/features/nurse/components/PatientDetails/PatientDetails.types";
import { GENERAL_WARD_ID, NURSE_ANITA_ID } from "@/lib/data/mockIds";



// NEW: incident report form
import IncidentReportForm from "@/features/nurse/components/IncidentReportForm";

export default function Page() {
  const [selectedWard, setSelectedWard] = useState(GENERAL_WARD_ID);
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const [selectedAdmissionId, setSelectedAdmissionId] = useState<string | null>(
    null
  );

  const [selectedEncounterId, setSelectedEncounterId] = useState<string | null>(
    null
  );
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null
  );

  const [orders, setOrders] = useState(initialOrders);

  const [handoverNotes, setHandoverNotes] = useState(HANDOVER_NOTES);
  const [intakeOutputRecords, setIntakeOutputRecords] = useState(INTAKE_OUTPUT);
  const [patientMovements, setPatientMovements] = useState(PATIENT_MOVEMENTS);
  const [procedureRecords, setProcedureRecords] = useState(PROCEDURE_RECORDS);

  const CURRENT_NURSE_ID = NURSE_ANITA_ID;

  const [activeAction, setActiveAction] = useState<string | null>(null);

  // Nursing Note ("note") is intentionally blocked here rather than wired to
  // a form — no published clinical_notes API contract exists yet.
  // "doctor" has no backing table/endpoint at all.
  //
  // Medication administration and incident reporting are now wired:
  // - medication: EMARTable above calls POST /nursing/medication-administrations
  // - incident: IncidentReportForm below calls POST /nursing/incidents
  const BLOCKED_ACTION_MESSAGES: Record<string, string> = {
    note:
      "Nursing notes are blocked until a published clinical_notes API contract exists. This action does not submit a note payload.",
    doctor:
      "\"Call Doctor\" isn't wired to any backend feature yet — no table/endpoint exists for this in the schema doc.",
  };

  const handleWardChange = (wardId: string) => {
    setSelectedWard(wardId);
    setSelectedBed(null);
    setSelectedPatient(null);
    setSelectedAdmissionId(null);
    setSelectedEncounterId(null);
    setSelectedPatientId(null);
  };

  const filteredBeds = beds.filter((bed) => bed.ward_id === selectedWard);

  // const today = new Date().toDateString();
  // const dischargesTodayCount = MOCK_DISCHARGES.filter(
  //   (d) => new Date(d.discharged_at).toDateString() === today
  // ).length;

  const [dischargesTodayCount, setDischargesTodayCount] = useState(0);

useEffect(() => {
  const today = new Date().toDateString();
  const count = MOCK_DISCHARGES.filter(
    (d) => new Date(d.discharged_at).toDateString() === today
  ).length;
  setDischargesTodayCount(count);
}, []);


  const wardStats: WardStat[] = [
    {
      id: "occupied",
      title: "Occupied Beds",
      value: filteredBeds.filter((b) => b.status === "occupied").length,
      description: "Patients currently admitted",
    },
    {
      id: "available",
      title: "Available Beds",
      value: filteredBeds.filter((b) => b.status === "vacant").length,
      description: "Ready for admission",
    },
    {
      id: "discharge",
      title: "Discharges Today",
      value: dischargesTodayCount,
      description: "Planned discharges",
    },
  ];

  const handleBedClick = (bed: Bed) => {
    setSelectedBed(bed);

    const patient = patients[bed.bed_id];
    setSelectedPatient(patient ?? null);

    const admissionId = admissionsByBedId[bed.bed_id] ?? null;
    setSelectedAdmissionId(admissionId);

    const procedureContext = procedureContextByBedId[bed.bed_id] ?? null;
    setSelectedEncounterId(procedureContext?.encounterId ?? null);
    setSelectedPatientId(procedureContext?.patientId ?? null);
  };

  const handleCheckOff = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId && o.status === "placed"
          ? { ...o, status: "completed" }
          : o
      )
    );
  };

  const handleAccept = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId && o.status === "placed"
          ? { ...o, status: "accepted" }
          : o
      )
    );
  };

  const admissionVitals = selectedAdmissionId
    ? vitals.filter((v) => v.admission_id === selectedAdmissionId)
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

  const patientProcedureRecords = selectedPatientId
    ? procedureRecords.filter(
        (record) => record.patient_id === selectedPatientId
      )
    : [];

  const patientMedications = selectedAdmissionId
    ? medications.filter((m) => m.admission_id === selectedAdmissionId)
    : [];

  const admissionStatusRecord = selectedAdmissionId
    ? ADMISSION_STATUS.find(
        (record) => record.admission_id === selectedAdmissionId
      ) ?? null
    : null;

  const { submitVitals, isSubmitting } = useAddVitals();
  const { submitHandover, isSubmitting: isSubmittingHandover } = useAddHandover();
  const { submitIntakeOutput, isSubmitting: isSubmittingIntakeOutput } =
    useAddIntakeOutput();
  const { submitPatientMovement, isSubmitting: isSubmittingPatientMovement } =
    useAddPatientMovement();
  const { submitProcedureAssistance, isSubmitting: isSubmittingProcedure } =
    useAddProcedureAssistance();

  const handleAddHandover = async (
    data: Parameters<typeof submitHandover>[0]
  ) => {
    const ok = await submitHandover(data);

    setHandoverNotes((prev) => [
      ...prev,
      { id: crypto.randomUUID(), ...data, created_at: new Date().toISOString() },
    ]);

    return ok;
  };

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

  const handleAddPatientMovement = async (data: AddPatientMovementSchema) => {
    const ok = await submitPatientMovement(data);

    setPatientMovements((prev) => [
      ...prev,
      { id: crypto.randomUUID(), ...data, reason: data.reason ?? null },
    ]);

    return ok;
  };

  const handleAddProcedureAssistance = async (
    data: AddProcedureAssistanceSchema
  ) => {
    const ok = await submitProcedureAssistance(data);

    setProcedureRecords((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        ...data,
        order_id: null,
        procedure_code: data.procedure_code ?? null,
        code_system: data.code_system ?? null,
        ot_schedule_id: data.ot_schedule_id ?? null,
        assisted_by: data.assisted_by ?? null,
        ended_at: data.ended_at ?? null,
        outcome: data.outcome ?? null,
        complications: data.complications ?? null,
      },
    ]);

    return ok;
  };

  return (
    <main className="mx-auto max-w-screen-2xl space-y-8 px-6 py-8">
      {/* Header */}
      <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Nurse Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Manage ward beds, patient vitals, and prescription / dispense status.
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
        onChange={handleWardChange}
      />

      {/* Ward Statistics */}
      <WardStats stats={wardStats} />

      {/* Pending doctor orders */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Pending doctor orders</h2>
          <p className="text-sm text-muted-foreground">
            Local preview of pending orders for this shift. Marking completed
            only updates status from placed to completed on this screen.
          </p>
        </div>

        <TaskQueue orders={orders} onCheckOff={handleCheckOff} onAccept={handleAccept} />
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
          selectedBedId={selectedBed?.bed_id}
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

        {!selectedAdmissionId ? (
          <div className="surface-card p-6">
            <p className="text-sm text-muted-foreground">
              Select a bed to view vitals.
            </p>
          </div>
        ) : (
          <>
            <VitalsTimeline records={admissionVitals} />
            <VitalsChart records={admissionVitals} />
          </>
        )}
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
      </section>

      {/* Procedure Assistance */}
      <section className="space-y-4">
        <ProcedureAssistance
          patientId={selectedPatientId}
          records={patientProcedureRecords}
        />

        {selectedEncounterId && selectedPatientId && (
          <AddProcedureAssistanceForm
            encounterId={selectedEncounterId}
            patientId={selectedPatientId}
            assistedBy={CURRENT_NURSE_ID}
            isSubmitting={isSubmittingProcedure}
            onSubmit={handleAddProcedureAssistance}
          />
        )}
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
          admissionId={selectedAdmissionId}
          record={admissionStatusRecord}
        />
      </section>

      {/* Prescription / Dispense Status (eMAR) */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">
            Prescription / Dispense Status
          </h2>
          <p className="text-sm text-muted-foreground">
            Pharmacy prescription item status for the selected patient.
          </p>
        </div>
        {!selectedPatientId || !selectedAdmissionId ? (
          <div className="surface-card p-6">
            <p className="text-sm text-muted-foreground">
              Select a bed to view medications.
            </p>
          </div>
        ) : (
          <EMARTable
            medications={patientMedications}
            admissionId={selectedAdmissionId}
            patientId={selectedPatientId}
          />
        )}
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
            patientId={selectedPatient?.id ?? ""}
            admissionId={selectedAdmissionId}
            isSubmitting={isSubmitting}
            onSubmit={submitVitals}
          />
        )}

        {activeAction === "transfer" && selectedAdmissionId && selectedBed && (
          <AddPatientMovementForm
            admissionId={selectedAdmissionId}
            currentWardId={selectedBed.ward_id ?? null}
            currentBedId={selectedBed.bed_id}
            wards={WARDS}
            beds={beds}
            movedBy={CURRENT_NURSE_ID}
            isSubmitting={isSubmittingPatientMovement}
            onSubmit={handleAddPatientMovement}
          />
        )}

        {/* NEW: incident report form, wired to POST /nursing/incidents */}
        {activeAction === "incident" && selectedAdmissionId && (
          <IncidentReportForm
            patientId={selectedPatientId ?? undefined}
            admissionId={selectedAdmissionId}
            wardId={selectedWard}
            onSuccess={() => setActiveAction(null)}
          />
        )}
      </section>
    </main>
  );
}