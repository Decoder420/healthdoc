"use client";

import type { StaffProfile } from "@/features/profile/types";
import { Button } from "@/components/ui/button";

type ProfileHeaderCardProps = {
  profile: StaffProfile;
  onEditPhoto?: () => void;
};

function formatRole(role: string) {
  return role
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function ProfileHeaderCard({ profile, onEditPhoto }: ProfileHeaderCardProps) {
  return (
    <div className="surface-card p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="relative">
          <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-2xl border border-border bg-muted text-3xl font-semibold text-primary">
            {profile.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.photo}
                alt={profile.name}
                className="h-full w-full object-cover"
              />
            ) : (
              profile.name.charAt(0)
            )}
          </div>
          {onEditPhoto && (
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="mt-3 w-full"
              onClick={onEditPhoto}
            >
              Update Photo
            </Button>
          )}
        </div>

        <div className="flex-1 space-y-2">
          <div>
            <p className="text-sm font-medium text-primary">Staff Profile</p>
            <h1 className="text-2xl font-semibold text-foreground">{profile.name}</h1>
            <p className="text-sm text-muted-foreground">
              {profile.designation} · {profile.department}
            </p>
          </div>

          <div className="grid gap-2 text-sm sm:grid-cols-2">
            <p>
              <span className="text-muted-foreground">Employee ID: </span>
              <span className="font-medium text-foreground">{profile.employeeId}</span>
            </p>
            <p>
              <span className="text-muted-foreground">Role: </span>
              <span className="font-medium text-foreground">{formatRole(profile.role)}</span>
            </p>
            <p>
              <span className="text-muted-foreground">Email: </span>
              <span className="text-foreground">{profile.email}</span>
            </p>
            <p>
              <span className="text-muted-foreground">Shift: </span>
              <span className="text-foreground">{profile.shift}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
