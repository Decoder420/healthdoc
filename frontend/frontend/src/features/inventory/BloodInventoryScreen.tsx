"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Droplet,
  Search,
  ShieldCheck,
  Snowflake,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldSelect } from "@/components/ui/mui-field";
import { Modal } from "@/components/ui/Modal";
import { toast } from "@/components/ui/toast";
import {
  BLOOD_GROUPS,
  INITIAL_BLOOD_UNITS,
  bloodDaysUntilExpiry,
  sortBloodUnitsByFefo,
  type BloodUnit,
} from "./blood-data";

const componentOptions = [
  "All components",
  "Whole Blood",
  "Packed RBC",
  "Platelets",
  "FFP",
  "Cryoprecipitate",
  "Platelet Concentrate",
];

function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-IN");
}

function expiryBadge(unit: BloodUnit) {
  const days = bloodDaysUntilExpiry(unit.expiryDate);
  if (days < 0) {
    return {
      label: "Expired · Blocked",
      className: "bg-danger-muted text-danger",
    };
  }
  if (days <= 3) {
    return {
      label: days === 0 ? "Expires today" : `${days} day${days === 1 ? "" : "s"}`,
      className: "bg-danger-muted text-danger",
    };
  }
  if (days <= 7) {
    return {
      label: `${days} days`,
      className: "bg-warning-muted text-warning",
    };
  }
  return {
    label: `${days} days`,
    className: "bg-success-muted text-success",
  };
}

export function BloodInventoryScreen() {
  const [units, setUnits] = useState(INITIAL_BLOOD_UNITS);
  const [search, setSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState("All groups");
  const [componentFilter, setComponentFilter] = useState("All components");
  const [selectedUnit, setSelectedUnit] = useState<BloodUnit | null>(null);

  const fefoUnits = useMemo(() => sortBloodUnitsByFefo(units), [units]);
  const availableUnits = units.filter(
    (unit) => bloodDaysUntilExpiry(unit.expiryDate) >= 0,
  );
  const expiredUnits = units.filter(
    (unit) => bloodDaysUntilExpiry(unit.expiryDate) < 0,
  );
  const expiringSoon = units.filter((unit) => {
    const days = bloodDaysUntilExpiry(unit.expiryDate);
    return days >= 0 && days <= 7;
  });
  const rareUnits = availableUnits.filter((unit) =>
    ["AB−", "B−", "O−"].includes(unit.bloodGroup),
  );

  const filteredUnits = useMemo(() => {
    const query = search.trim().toLowerCase();
    return fefoUnits.filter((unit) => {
      const matchesSearch =
        !query ||
        [
          unit.bloodGroup,
          unit.componentType,
          unit.bagId,
          unit.source,
          unit.storageLocation,
        ].some((value) => value.toLowerCase().includes(query));
      const matchesGroup =
        groupFilter === "All groups" || unit.bloodGroup === groupFilter;
      const matchesComponent =
        componentFilter === "All components" ||
        unit.componentType === componentFilter;
      return matchesSearch && matchesGroup && matchesComponent;
    });
  }, [componentFilter, fefoUnits, groupFilter, search]);

  function isNextFefoUnit(unit: BloodUnit) {
    const nextUnit = fefoUnits.find(
      (candidate) =>
        candidate.bloodGroup === unit.bloodGroup &&
        candidate.componentType === unit.componentType &&
        bloodDaysUntilExpiry(candidate.expiryDate) >= 0,
    );
    return nextUnit?.id === unit.id;
  }

  function issueUnit() {
    if (!selectedUnit) return;
    if (bloodDaysUntilExpiry(selectedUnit.expiryDate) < 0) {
      toast.error("Expired blood units are blocked and cannot be issued.");
      setSelectedUnit(null);
      return;
    }
    if (!isNextFefoUnit(selectedUnit)) {
      toast.warning("FEFO requires issuing the earliest-expiry unit first.");
      setSelectedUnit(null);
      return;
    }
    setUnits((current) =>
      current.filter((unit) => unit.id !== selectedUnit.id),
    );
    toast.success(`Unit ${selectedUnit.bagId} issued using FEFO.`);
    setSelectedUnit(null);
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Inventory / Departments
          </p>
          <h1 className="mt-1 text-2xl font-bold text-foreground">
            Blood Bank Inventory
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Unit-level blood component tracking with automatic FEFO control.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-success/30 bg-success-muted px-3 py-2 text-sm font-medium text-success">
          <ShieldCheck size={16} />
          FEFO and expiry blocking active
        </div>
      </header>

      <section
        aria-label="Blood bank inventory summary"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {[
          {
            label: "Available units",
            value: availableUnits.length,
            icon: Droplet,
            color: "text-primary",
          },
          {
            label: "Expiring ≤ 7 days",
            value: expiringSoon.length,
            icon: AlertTriangle,
            color: "text-warning",
          },
          {
            label: "Rare group units",
            value: rareUnits.length,
            icon: Activity,
            color: "text-danger",
          },
          {
            label: "Expired / blocked",
            value: expiredUnits.length,
            icon: Snowflake,
            color: "text-muted-foreground",
          },
        ].map((metric) => (
          <article key={metric.label} className="surface-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{metric.label}</p>
              <metric.icon size={18} className={metric.color} />
            </div>
            <p className="mt-3 text-2xl font-bold text-foreground">
              {metric.value}
            </p>
          </article>
        ))}
      </section>

      <section className="surface-card p-5">
        <div className="mb-4">
          <h2 className="text-base font-semibold">Availability by Blood Group</h2>
          <p className="text-xs text-muted-foreground">
            Expired units are excluded from available stock.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-8">
          {BLOOD_GROUPS.map((group) => {
            const count = availableUnits.filter(
              (unit) => unit.bloodGroup === group,
            ).length;
            return (
              <button
                key={group}
                type="button"
                onClick={() =>
                  setGroupFilter((current) =>
                    current === group ? "All groups" : group,
                  )
                }
                className={`rounded-lg border p-3 text-left transition-colors ${
                  groupFilter === group
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background hover:bg-muted"
                }`}
              >
                <p className="text-lg font-bold">{group}</p>
                <p
                  className={`text-xs ${
                    groupFilter === group
                      ? "text-primary-foreground/75"
                      : "text-muted-foreground"
                  }`}
                >
                  {count} unit{count === 1 ? "" : "s"}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="surface-card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-border p-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-base font-semibold">Blood Units & Components</h2>
            <p className="text-xs text-muted-foreground">
              FEFO sorted by expiry date within blood group and component.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <label className="relative block sm:min-w-64">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <span className="sr-only">Search blood inventory</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Bag ID, group, source..."
                className="h-10 w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
            <FieldSelect
              size="small"
              value={groupFilter}
              onChange={(event) => setGroupFilter(event.target.value)}
              options={[
                { value: "All groups", label: "All groups" },
                ...BLOOD_GROUPS.map((group) => ({
                  value: group,
                  label: group,
                })),
              ]}
            />
            <FieldSelect
              size="small"
              value={componentFilter}
              onChange={(event) => setComponentFilter(event.target.value)}
              options={componentOptions.map((component) => ({
                value: component,
                label: component,
              }))}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1150px] text-sm">
            <thead className="bg-muted text-left text-xs text-muted-foreground">
              <tr>
                {[
                  "Blood Group",
                  "Component",
                  "Bag ID / Unit",
                  "Collection",
                  "Expiry",
                  "Source",
                  "Storage",
                  "Status",
                  "Action",
                ].map((heading) => (
                  <th key={heading} className="px-4 py-3 font-semibold">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUnits.map((unit) => {
                const expired = bloodDaysUntilExpiry(unit.expiryDate) < 0;
                const fefoReady = isNextFefoUnit(unit);
                const badge = expiryBadge(unit);
                return (
                  <tr key={unit.id} className="hover:bg-muted/50">
                    <td className="px-4 py-4">
                      <span className="inline-flex h-10 min-w-10 items-center justify-center rounded-full bg-danger-muted px-2 font-bold text-danger">
                        {unit.bloodGroup}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-medium">
                      {unit.componentType}
                    </td>
                    <td className="px-4 py-4 font-mono text-xs">
                      {unit.bagId}
                    </td>
                    <td className="px-4 py-4">
                      {formatDate(unit.collectionDate)}
                    </td>
                    <td className="px-4 py-4">
                      <p>{formatDate(unit.expiryDate)}</p>
                      <span
                        className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-4 py-4">{unit.source}</td>
                    <td className="px-4 py-4">{unit.storageLocation}</td>
                    <td className="px-4 py-4">
                      {expired ? (
                        <span className="font-semibold text-danger">
                          Quarantined
                        </span>
                      ) : fefoReady ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-success">
                          <CheckCircle2 size={14} />
                          FEFO ready
                        </span>
                      ) : (
                        <span className="text-warning">
                          Earlier unit first
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <Button
                        size="sm"
                        disabled={expired || !fefoReady}
                        onClick={() => setSelectedUnit(unit)}
                        title={
                          expired
                            ? "Expired unit is automatically blocked"
                            : !fefoReady
                              ? "Issue the earlier-expiry matching unit first"
                              : "Issue this blood unit"
                        }
                      >
                        Issue unit
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <Modal
        open={Boolean(selectedUnit)}
        onClose={() => setSelectedUnit(null)}
        title="Confirm blood unit issue"
        actions={
          <>
            <Button variant="ghost" onClick={() => setSelectedUnit(null)}>
              Cancel
            </Button>
            <Button onClick={issueUnit}>Confirm FEFO issue</Button>
          </>
        }
      >
        <div className="space-y-3 pt-2 text-sm">
          <div className="rounded-lg bg-muted p-4">
            <p className="font-semibold">
              {selectedUnit?.bloodGroup} · {selectedUnit?.componentType}
            </p>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              {selectedUnit?.bagId}
            </p>
          </div>
          <p>
            This unit is the earliest valid expiry for its blood group and
            component. Issuing it will remove it from available inventory.
          </p>
        </div>
      </Modal>
    </div>
  );
}
