"use client";

import { useEffect, useMemo, useState } from "react";
import { getPendingIpdRequests } from "@/features/ipd/api";
import { ROLES } from "@/config/roles";
import { useAuth } from "@/providers/auth-provider";
import { ModulePage } from "@/components/shared/module-page";
import { IpdStats } from "@/components/ipd/ipd-stats";
import { IpdTabs, type IpdTabId } from "@/components/ipd/ipd-tabs";
import { IpdRequestInbox } from "@/components/ipd/ipd-request-inbox";
import { IpdResourcesBoard } from "@/components/ipd/ipd-resources-board";
import { RaiseIpdRequestForm } from "@/components/ipd/raise-ipd-request-form";

function defaultTabForRole(
  role: string | undefined,
): IpdTabId {
  if (role === ROLES.DOCTOR) return "raise";
  if (role === ROLES.NURSE) return "nurse";
  return "requests";
}

export function IpdModule() {
  const { user, isLoading } = useAuth();
  const role = user?.role;
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState<IpdTabId>("requests");

  const pendingCount = useMemo(() => {
    void refreshKey;
    return getPendingIpdRequests().length;
  }, [refreshKey]);

  const isDesk = role === ROLES.RECEPTIONIST || role === ROLES.ADMIN;
  const isDoctor = role === ROLES.DOCTOR;
  const isNurse = role === ROLES.NURSE;
  const hasAccess = isDesk || isDoctor || isNurse;

  const tabs = useMemo(() => {
    if (isDoctor) {
      return [
        { id: "raise" as const, label: "Raise Request" },
        { id: "requests" as const, label: "My Requests", badge: pendingCount },
      ];
    }
    if (isNurse) {
      return [
        { id: "nurse" as const, label: "My Assignments" },
        { id: "resources" as const, label: "Beds & Nurses" },
      ];
    }
    if (isDesk) {
      return [
        {
          id: "requests" as const,
          label: "Doctor Requests",
          badge: pendingCount,
        },
        { id: "raise" as const, label: "Raise Request" },
        { id: "resources" as const, label: "Beds & Nurses" },
      ];
    }
    return [];
  }, [isDoctor, isNurse, isDesk, pendingCount]);

  useEffect(() => {
    if (!role) return;
    setActiveTab(defaultTabForRole(role));
  }, [role]);

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
        Loading IPD module...
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <ModulePage
        title="IPD"
        description="You do not have access to inpatient operations."
      />
    );
  }

  function bump() {
    setRefreshKey((value) => value + 1);
  }

  const safeActive = tabs.some((tab) => tab.id === activeTab)
    ? activeTab
    : tabs[0]?.id ?? "requests";

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-primary">IPD Module</p>
        <h1 className="text-2xl font-semibold text-foreground">
          Inpatient Operations
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {isDoctor
            ? "Raise admission and care requests for patients."
            : isNurse
              ? "Manage assigned inpatient care and ward beds."
              : "Receive doctor IPD requests, assign bed and nurse, manage ward resources."}
        </p>
      </div>

      <IpdStats refreshKey={refreshKey} />

      <IpdTabs tabs={tabs} active={safeActive} onChange={setActiveTab} />

      {safeActive === "requests" && (
        <IpdRequestInbox
          refreshKey={refreshKey}
          onChanged={bump}
          doctorIdFilter={isDoctor ? user?.id : undefined}
        />
      )}

      {safeActive === "raise" && (isDesk || isDoctor) && (
        <RaiseIpdRequestForm
          defaultDoctorId={isDoctor ? user?.id : undefined}
          onCreated={() => {
            bump();
            setActiveTab("requests");
          }}
        />
      )}

      {safeActive === "resources" && (isDesk || isNurse) && (
        <IpdResourcesBoard refreshKey={refreshKey} onChanged={bump} />
      )}

      {safeActive === "nurse" && isNurse && (
        <IpdRequestInbox
          refreshKey={refreshKey}
          onChanged={bump}
          nurseIdFilter={user?.id}
        />
      )}
    </div>
  );
}
