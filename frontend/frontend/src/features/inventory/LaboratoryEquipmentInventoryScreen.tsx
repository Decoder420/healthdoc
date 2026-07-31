"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  FlaskConical,
  Microscope,
  Search,
  Settings,
  ShieldAlert,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldSelect, FieldText } from "@/components/ui/mui-field";
import { Modal } from "@/components/ui/Modal";
import { toast } from "@/components/ui/toast";
import {
  INITIAL_LABORATORY_EQUIPMENT,
  LABORATORY_EQUIPMENT_CATALOG,
  type LaboratoryEquipment,
  type LaboratoryEquipmentStatus,
} from "./laboratory-equipment-data";

const STATUS_OPTIONS = [
  "All statuses",
  "Operational",
  "Calibration Due",
  "Maintenance Due",
  "Out of Service",
];

function statusClass(status: LaboratoryEquipmentStatus) {
  if (status === "Operational") return "bg-success-muted text-success";
  if (status === "Out of Service") return "bg-danger-muted text-danger";
  return "bg-warning-muted text-warning";
}

function formatDate(value: string | null) {
  if (!value) return "Not required";
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-IN");
}

export function LaboratoryEquipmentInventoryScreen() {
  const [equipment, setEquipment] = useState(INITIAL_LABORATORY_EQUIPMENT);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All categories");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [selected, setSelected] = useState<LaboratoryEquipment | null>(null);
  const [serviceType, setServiceType] = useState("Preventive Maintenance");
  const [serviceNotes, setServiceNotes] = useState("");

  const categories = Object.keys(LABORATORY_EQUIPMENT_CATALOG);
  const filteredEquipment = useMemo(() => {
    const query = search.trim().toLowerCase();
    return equipment.filter((item) => {
      const matchesSearch =
        !query ||
        [
          item.assetId,
          item.name,
          item.category,
          item.location,
          item.status,
        ].some((value) => value.toLowerCase().includes(query));
      return (
        matchesSearch &&
        (categoryFilter === "All categories" ||
          item.category === categoryFilter) &&
        (statusFilter === "All statuses" || item.status === statusFilter)
      );
    });
  }, [categoryFilter, equipment, search, statusFilter]);

  const operationalCount = equipment.filter(
    (item) => item.status === "Operational",
  ).length;
  const calibrationDueCount = equipment.filter(
    (item) => item.status === "Calibration Due",
  ).length;
  const maintenanceDueCount = equipment.filter(
    (item) => item.status === "Maintenance Due",
  ).length;
  const outOfServiceCount = equipment.filter(
    (item) => item.status === "Out of Service",
  ).length;

  function completeService() {
    if (!selected) return;
    if (!serviceNotes.trim()) {
      toast.error("Service notes are required for equipment history.");
      return;
    }
    setEquipment((current) =>
      current.map((item) =>
        item.id === selected.id
          ? {
              ...item,
              status: "Operational",
              calibrationDue:
                serviceType === "Calibration"
                  ? "2027-01-18"
                  : item.calibrationDue,
              maintenanceDue: "2027-01-18",
            }
          : item,
      ),
    );
    toast.success(`${serviceType} completed for ${selected.name}.`);
    setSelected(null);
    setServiceNotes("");
    setServiceType("Preventive Maintenance");
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Inventory / Departments
        </p>
        <h1 className="mt-1 text-2xl font-bold text-foreground">
          Laboratory Equipment Inventory
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Complete equipment registry across collection, testing, storage,
          sterilization, and laboratory IT.
        </p>
      </header>

      <section
        aria-label="Laboratory equipment summary"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5"
      >
        {[
          {
            label: "Equipment records",
            value: equipment.length,
            icon: Microscope,
            color: "text-primary",
          },
          {
            label: "Operational",
            value: operationalCount,
            icon: CheckCircle2,
            color: "text-success",
          },
          {
            label: "Calibration due",
            value: calibrationDueCount,
            icon: ClipboardCheck,
            color: "text-warning",
          },
          {
            label: "Maintenance due",
            value: maintenanceDueCount,
            icon: Wrench,
            color: "text-warning",
          },
          {
            label: "Out of service",
            value: outOfServiceCount,
            icon: ShieldAlert,
            color: "text-danger",
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
          <h2 className="text-base font-semibold">Equipment Categories</h2>
          <p className="text-xs text-muted-foreground">
            Select a category to filter the complete laboratory registry.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          {categories.map((category) => {
            const count = equipment.filter(
              (item) => item.category === category,
            ).length;
            const selectedCategory = categoryFilter === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() =>
                  setCategoryFilter((current) =>
                    current === category ? "All categories" : category,
                  )
                }
                className={`rounded-lg border p-3 text-left transition-colors ${
                  selectedCategory
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background hover:bg-muted"
                }`}
              >
                <FlaskConical size={17} />
                <p className="mt-2 text-xs font-semibold">{category}</p>
                <p
                  className={`mt-1 text-xs ${
                    selectedCategory
                      ? "text-primary-foreground/75"
                      : "text-muted-foreground"
                  }`}
                >
                  {count} item{count === 1 ? "" : "s"}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {(calibrationDueCount > 0 ||
        maintenanceDueCount > 0 ||
        outOfServiceCount > 0) && (
        <section className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          <div className="rounded-lg border border-warning/30 bg-warning-muted p-4">
            <div className="flex items-center gap-2 text-warning">
              <AlertTriangle size={17} />
              <p className="font-semibold">Calibration attention</p>
            </div>
            <p className="mt-2 text-sm text-warning">
              {calibrationDueCount} measurement or analyzer record(s) require
              calibration.
            </p>
          </div>
          <div className="rounded-lg border border-warning/30 bg-warning-muted p-4">
            <div className="flex items-center gap-2 text-warning">
              <Wrench size={17} />
              <p className="font-semibold">Maintenance attention</p>
            </div>
            <p className="mt-2 text-sm text-warning">
              {maintenanceDueCount} equipment record(s) are due for preventive
              service.
            </p>
          </div>
          <div className="rounded-lg border border-danger/30 bg-danger-muted p-4">
            <div className="flex items-center gap-2 text-danger">
              <ShieldAlert size={17} />
              <p className="font-semibold">Unavailable equipment</p>
            </div>
            <p className="mt-2 text-sm text-danger">
              {outOfServiceCount} equipment record(s) are blocked from use.
            </p>
          </div>
        </section>
      )}

      <section className="surface-card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-border p-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-base font-semibold">Equipment Registry</h2>
            <p className="text-xs text-muted-foreground">
              Asset status, quantity, location, calibration, and maintenance.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(250px,1fr)_220px_190px]">
            <label className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <span className="sr-only">Search laboratory equipment</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search equipment or asset ID..."
                className="h-10 w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
            <FieldSelect
              size="small"
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              options={[
                { value: "All categories", label: "All categories" },
                ...categories.map((category) => ({
                  value: category,
                  label: category,
                })),
              ]}
            />
            <FieldSelect
              size="small"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              options={STATUS_OPTIONS.map((status) => ({
                value: status,
                label: status,
              }))}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1250px] text-sm">
            <thead className="bg-muted text-left text-xs text-muted-foreground">
              <tr>
                {[
                  "Asset ID",
                  "Equipment",
                  "Category",
                  "Quantity",
                  "Location",
                  "Status",
                  "Calibration Due",
                  "Maintenance Due",
                  "Action",
                ].map((heading) => (
                  <th key={heading} className="px-4 py-3 font-semibold">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredEquipment.map((item) => (
                <tr key={item.id} className="hover:bg-muted/50">
                  <td className="px-4 py-4 font-mono text-xs font-semibold">
                    {item.assetId}
                  </td>
                  <td className="px-4 py-4 font-semibold">{item.name}</td>
                  <td className="px-4 py-4">{item.category}</td>
                  <td className="px-4 py-4">{item.quantity}</td>
                  <td className="px-4 py-4">{item.location}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusClass(item.status)}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    {formatDate(item.calibrationDue)}
                  </td>
                  <td className="px-4 py-4">
                    {formatDate(item.maintenanceDue)}
                  </td>
                  <td className="px-4 py-4">
                    <Button
                      size="sm"
                      variant={
                        item.status === "Operational" ? "outline" : "primary"
                      }
                      onClick={() => {
                        setSelected(item);
                        setServiceType(
                          item.status === "Calibration Due"
                            ? "Calibration"
                            : "Preventive Maintenance",
                        );
                      }}
                    >
                      <Settings size={14} />
                      Log service
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredEquipment.length === 0 && (
          <p className="p-8 text-center text-sm text-muted-foreground">
            No equipment matches the selected filters.
          </p>
        )}
      </section>

      <Modal
        open={Boolean(selected)}
        onClose={() => {
          setSelected(null);
          setServiceNotes("");
        }}
        title="Log equipment service"
        actions={
          <>
            <Button
              variant="ghost"
              onClick={() => {
                setSelected(null);
                setServiceNotes("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={completeService}>Complete service</Button>
          </>
        }
      >
        <div className="space-y-4 pt-2">
          <div className="rounded-lg bg-muted p-3">
            <p className="text-sm font-semibold">{selected?.name}</p>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              {selected?.assetId} · {selected?.location}
            </p>
          </div>
          <FieldSelect
            label="Service type"
            value={serviceType}
            onChange={(event) => setServiceType(event.target.value)}
            options={[
              {
                value: "Preventive Maintenance",
                label: "Preventive Maintenance",
              },
              { value: "Calibration", label: "Calibration" },
              { value: "Corrective Repair", label: "Corrective Repair" },
              { value: "Safety Inspection", label: "Safety Inspection" },
            ]}
            fullWidth
          />
          <FieldText
            label="Service notes"
            value={serviceNotes}
            onChange={(event) => setServiceNotes(event.target.value)}
            multiline
            minRows={3}
            helperText="Required for equipment service history."
            fullWidth
            required
          />
        </div>
      </Modal>
    </div>
  );
}
