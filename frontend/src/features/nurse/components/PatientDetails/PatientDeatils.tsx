import { PatientDetailsProps } from "./PatientDetails.types";

export default function PatientDetails({
  patient,
}: PatientDetailsProps) {
  if (!patient) {
    return (
      <section className="surface-card p-6">
        <p className="text-muted-foreground">
          Select a bed to view patient details.
        </p>
      </section>
    );
  }

  return (
    <section className="surface-card p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          Patient Details
        </h2>

        <p className="text-sm text-muted-foreground">
          Selected patient information.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

        <Detail label="Patient Name" value={patient.patientName} />
        <Detail label="UHID" value={patient.uhid} />
        <Detail label="Age" value={`${patient.age} Years`} />
        <Detail label="Gender" value={patient.gender} />
        <Detail label="Diagnosis" value={patient.diagnosis} />
        <Detail label="Consultant" value={patient.consultant} />
        <Detail label="Ward" value={patient.ward} />
        <Detail label="Bed" value={patient.bedNumber} />
        <Detail label="Admission Date" value={patient.admissionDate} />

      </div>
    </section>
  );
}

type DetailProps = {
  label: string;
  value: string;
};

function Detail({
  label,
  value,
}: DetailProps) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 font-medium">
        {value}
      </p>
    </div>
  );
}