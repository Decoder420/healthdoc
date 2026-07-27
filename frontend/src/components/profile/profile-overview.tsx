"use client";

import type { StaffProfile } from "@/features/profile/types";

type ProfileOverviewProps = {
  profile: StaffProfile;
};

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface-card p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium text-foreground">{value || "—"}</p>
    </div>
  );
}

export function ProfileOverview({ profile }: ProfileOverviewProps) {
  const roleLabel = profile.role
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold text-foreground">Profile Overview</h2>
        <p className="text-xs text-muted-foreground">
          Your account, duty, and contact information for the {roleLabel} dashboard.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <InfoItem label="Full Name" value={profile.name} />
        <InfoItem label="Employee ID" value={profile.employeeId} />
        <InfoItem label="Role" value={roleLabel} />
        <InfoItem label="Gender" value={profile.gender} />
        <InfoItem label="Email" value={profile.email} />
        <InfoItem label="Mobile" value={profile.phone} />
        <InfoItem label="Alternate Mobile" value={profile.alternatePhone} />
        <InfoItem label="Department" value={profile.department} />
        <InfoItem label="Designation" value={profile.designation} />
        <InfoItem label="Shift" value={profile.shift} />
        <InfoItem
          label="Joining Date"
          value={new Date(profile.joiningDate).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        />
        <InfoItem label="Emergency Contact" value={profile.emergencyContactName} />
        <InfoItem label="Emergency Phone" value={profile.emergencyContactPhone} />
        <div className="surface-card p-4 md:col-span-2 xl:col-span-3">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Address
          </p>
          <p className="mt-2 text-sm font-medium text-foreground">
            {profile.address || "—"}
          </p>
        </div>
      </div>
    </div>
  );
}
