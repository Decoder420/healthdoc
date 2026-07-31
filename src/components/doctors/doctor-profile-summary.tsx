"use client";

import type { DoctorProfile, DoctorStatus } from "@/features/doctors/types";

type DoctorProfileSummaryProps = {
  doctor: DoctorProfile;
};

function statusLabel(status: DoctorStatus) {
  if (status === "on_leave") return "On Leave";
  if (status === "inactive") return "Inactive";
  return "Active";
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

export function DoctorProfileSummary({ doctor }: DoctorProfileSummaryProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-start gap-4">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-2xl font-semibold text-primary">
          {doctor.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={doctor.photo}
              alt={doctor.name}
              className="h-full w-full object-cover"
            />
          ) : (
            doctor.name.replace(/^Dr\.\s*/i, "").charAt(0)
          )}
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-foreground">{doctor.name}</h3>
          <p className="text-sm text-muted-foreground">{doctor.employeeId}</p>
          <p className="mt-1 text-sm text-primary">
            {doctor.department} · {doctor.specialization}
          </p>
          <p className="mt-1 text-xs font-medium text-muted-foreground">
            Status: {statusLabel(doctor.status)}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <InfoRow label="Email" value={doctor.email} />
        <InfoRow label="Mobile" value={doctor.phone} />
        <InfoRow label="Gender" value={doctor.gender} />
        <InfoRow label="Qualification" value={doctor.qualification} />
        <InfoRow
          label="Experience"
          value={`${doctor.experienceYears} year${doctor.experienceYears === 1 ? "" : "s"}`}
        />
        <InfoRow label="Consultation Fee" value={`₹${doctor.consultationFee}`} />
        <InfoRow label="License" value={doctor.licenseNumber} />
        <InfoRow
          label="Joined"
          value={new Date(doctor.joiningDate).toLocaleDateString("en-IN")}
        />
        <InfoRow
          label="Availability"
          value={`${doctor.availability.days.join(", ")} · ${doctor.availability.startTime}–${doctor.availability.endTime}`}
        />
        <InfoRow label="Address" value={doctor.address} />
      </div>
    </div>
  );
}
