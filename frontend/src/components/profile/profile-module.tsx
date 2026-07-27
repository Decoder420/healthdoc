"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { StaffProfile, StaffProfileUpdateInput } from "@/features/profile/types";
import {
  getStaffProfileForAuthUser,
  updateStaffProfile,
} from "@/features/profile/api";
import type { AuthUser } from "@/lib/auth";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { ProfileHeaderCard } from "@/components/profile/profile-header-card";
import { ProfileOverview } from "@/components/profile/profile-overview";
import { ProfileEditForm } from "@/components/profile/profile-edit-form";
import { ProfilePasswordForm } from "@/components/profile/profile-password-form";
import { ProfilePreferencesForm } from "@/components/profile/profile-preferences-form";
import { ProfilePhotoPanel } from "@/components/profile/profile-photo-panel";

type ProfileTab = "overview" | "edit" | "photo" | "password" | "preferences";

function toUpdateInput(profile: StaffProfile): StaffProfileUpdateInput {
  return {
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    alternatePhone: profile.alternatePhone,
    gender: profile.gender,
    department: profile.department,
    designation: profile.designation,
    shift: profile.shift,
    joiningDate: profile.joiningDate,
    address: profile.address,
    emergencyContactName: profile.emergencyContactName,
    emergencyContactPhone: profile.emergencyContactPhone,
    photo: profile.photo,
    preferences: { ...profile.preferences },
  };
}

export function ProfileModule() {
  const router = useRouter();
  const { user, isLoading, updateUser, logout } = useAuth();
  const [tab, setTab] = useState<ProfileTab>("overview");
  const [profile, setProfile] = useState<StaffProfile | null>(null);
  const [editForm, setEditForm] = useState<StaffProfileUpdateInput | null>(null);
  const [photoDraft, setPhotoDraft] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!user) return;
    const loaded = getStaffProfileForAuthUser(user);
    setProfile(loaded);
    setEditForm(toUpdateInput(loaded));
    setPhotoDraft(loaded.photo);
  }, [user]);

  const tabs = useMemo(
    () =>
      [
        { id: "overview" as const, label: "Overview" },
        { id: "edit" as const, label: "Edit Profile" },
        { id: "photo" as const, label: "Photo" },
        { id: "password" as const, label: "Password" },
        { id: "preferences" as const, label: "Preferences" },
      ] as const,
    [],
  );

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-48 flex-col items-center justify-center gap-3 text-sm text-muted-foreground">
        <p>Sign in to view your profile.</p>
        <Button type="button" onClick={() => router.push("/login")}>
          Go to Login
        </Button>
      </div>
    );
  }

  if (!profile || !editForm) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
        Unable to load profile.
      </div>
    );
  }

  function syncAuthUser(next: StaffProfile) {
    const authUser: AuthUser = {
      id: next.id,
      name: next.name,
      email: next.email,
      role: next.role,
    };
    updateUser(authUser);
  }

  function handleSaveProfile() {
    if (!editForm || !user) return;
    setError("");
    setSuccess("");

    const result = updateStaffProfile(user.id, editForm, { role: user.role });
    if (!result.success) {
      setError(result.error);
      return;
    }

    setProfile(result.profile);
    setEditForm(toUpdateInput(result.profile));
    syncAuthUser(result.profile);
    setSuccess("Profile updated successfully.");
    setTab("overview");
  }

  function handleSavePhoto() {
    if (!user || !profile) return;
    setError("");
    setSuccess("");

    const result = updateStaffProfile(
      user.id,
      {
        ...toUpdateInput(profile),
        photo: photoDraft,
      },
      { role: user.role },
    );

    if (!result.success) {
      setError(result.error);
      return;
    }

    setProfile(result.profile);
    setEditForm(toUpdateInput(result.profile));
    syncAuthUser(result.profile);
    setSuccess("Profile photo updated.");
    setTab("overview");
  }

  function handleSavePreferences() {
    if (!user || !editForm) return;
    setError("");
    setSuccess("");

    const result = updateStaffProfile(user.id, editForm, { role: user.role });
    if (!result.success) {
      setError(result.error);
      return;
    }

    setProfile(result.profile);
    setEditForm(toUpdateInput(result.profile));
    setSuccess("Preferences saved.");
  }

  function handleLogout() {
    logout();
    window.location.href = "/login";
  }

  const roleLabel = user.role
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">My Account</p>
          <h1 className="text-2xl font-semibold text-foreground">{roleLabel} Profile</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your {roleLabel.toLowerCase()} account details, photo, password, and preferences.
          </p>
        </div>
        <Button type="button" variant="danger" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <ProfileHeaderCard
        profile={profile}
        onEditPhoto={() => {
          setPhotoDraft(profile.photo);
          setTab("photo");
          setError("");
          setSuccess("");
        }}
      />

      <div className="flex flex-wrap gap-2">
        {tabs.map((item) => (
          <Button
            key={item.id}
            type="button"
            size="sm"
            variant={tab === item.id ? "primary" : "outline"}
            onClick={() => {
              setTab(item.id);
              setError("");
              setSuccess("");
              if (item.id === "edit") setEditForm(toUpdateInput(profile));
              if (item.id === "photo") setPhotoDraft(profile.photo);
              if (item.id === "preferences") setEditForm(toUpdateInput(profile));
            }}
          >
            {item.label}
          </Button>
        ))}
      </div>

      {tab === "overview" && <ProfileOverview profile={profile} />}

      {tab === "edit" && (
        <ProfileEditForm
          profile={profile}
          form={editForm}
          error={error}
          success={success}
          onChange={setEditForm}
          onSave={handleSaveProfile}
          onCancel={() => {
            setEditForm(toUpdateInput(profile));
            setTab("overview");
          }}
        />
      )}

      {tab === "photo" && (
        <ProfilePhotoPanel
          photo={photoDraft}
          error={error}
          success={success}
          onCapture={setPhotoDraft}
          onClear={() => setPhotoDraft("")}
          onSave={handleSavePhoto}
          onCancel={() => {
            setPhotoDraft(profile.photo);
            setTab("overview");
          }}
        />
      )}

      {tab === "password" && <ProfilePasswordForm />}

      {tab === "preferences" && (
        <ProfilePreferencesForm
          preferences={editForm.preferences}
          error={error}
          success={success}
          onChange={(preferences) =>
            setEditForm({ ...editForm, preferences })
          }
          onSave={handleSavePreferences}
        />
      )}

      <div className="surface-muted p-4 text-xs text-muted-foreground">
        Tip: Use the navbar avatar/name area or sidebar <button type="button" className="link-primary" onClick={() => router.push("/profile")}>Profile</button> link anytime to return here.
      </div>
    </div>
  );
}
