"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  Boxes,
  ClipboardCheck,
  PackageCheck,
  Plus,
  Search,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldText } from "@/components/ui/mui-field";
import { Modal } from "@/components/ui/Modal";
import { toast } from "@/components/ui/toast";

type OtCategory =
  | "Implant"
  | "Sponge"
  | "Suture"
  | "Instrument"
  | "Consumable";

type OtStockItem = {
  id: string;
  itemName: string;
  category: OtCategory;
  batchNumber: string;
  serialNumber?: string;
  quantity: number;
  unit: string;
  storeLocation: string;
  manufacturer: string;
  expiryDate?: string;
  reorderLevel: number;
};

type IssuedItem = {
  itemId: string;
  itemName: string;
  category: OtCategory;
  batchNumber: string;
  serialNumber?: string;
  quantity: number;
};

type ProcedureIssue = {
  id: string;
  otRecordId: string;
  visitId: string;
  patientName: string;
  procedureName: string;
  surgeonName: string;
  issuedAt: string;
  items: IssuedItem[];
};

const INITIAL_OT_STOCK: OtStockItem[] = [
  {
    id: "ot-1",
    itemName: "Titanium Hip Stem",
    category: "Implant",
    batchNumber: "THS-2604-A",
    serialNumber: "SN-THS-009841",
    quantity: 1,
    unit: "implant",
    storeLocation: "OT Store / Implant Safe A",
    manufacturer: "OrthoMed",
    expiryDate: "2031-04-30",
    reorderLevel: 1,
  },
  {
    id: "ot-2",
    itemName: "Locking Compression Plate",
    category: "Implant",
    batchNumber: "LCP-2511-C",
    serialNumber: "SN-LCP-027114",
    quantity: 1,
    unit: "implant",
    storeLocation: "OT Store / Implant Safe B",
    manufacturer: "Synthes",
    expiryDate: "2030-11-20",
    reorderLevel: 1,
  },
  {
    id: "ot-3",
    itemName: "Laparotomy Sponge",
    category: "Sponge",
    batchNumber: "LPS-260701",
    quantity: 240,
    unit: "pieces",
    storeLocation: "OT Store / Rack S-01",
    manufacturer: "SurgiCare",
    expiryDate: "2029-06-30",
    reorderLevel: 100,
  },
  {
    id: "ot-4",
    itemName: "Vicryl 2-0 Suture",
    category: "Suture",
    batchNumber: "VIC-260518",
    quantity: 85,
    unit: "packs",
    storeLocation: "OT Store / Rack S-05",
    manufacturer: "Ethicon",
    expiryDate: "2030-05-17",
    reorderLevel: 40,
  },
  {
    id: "ot-5",
    itemName: "Prolene 3-0 Suture",
    category: "Suture",
    batchNumber: "PRO-260429",
    quantity: 56,
    unit: "packs",
    storeLocation: "OT Store / Rack S-06",
    manufacturer: "Ethicon",
    expiryDate: "2030-04-28",
    reorderLevel: 30,
  },
  {
    id: "ot-6",
    itemName: "Laparoscopic Grasper",
    category: "Instrument",
    batchNumber: "INST-LG-042",
    serialNumber: "INST-SN-44102",
    quantity: 8,
    unit: "instruments",
    storeLocation: "OT Store / Sterile Cabinet 2",
    manufacturer: "Karl Storz",
    reorderLevel: 3,
  },
  {
    id: "ot-7",
    itemName: "Electrosurgical Pencil",
    category: "Consumable",
    batchNumber: "ESP-260622",
    quantity: 32,
    unit: "pieces",
    storeLocation: "OT Store / Rack C-03",
    manufacturer: "Medtronic",
    expiryDate: "2029-06-21",
    reorderLevel: 20,
  },
  ...Array.from({ length: 28 }, (_, index) => {
    const catalog: Array<{
      itemName: string;
      category: OtStockItem["category"];
      unit: string;
      manufacturer: string;
      reorderLevel: number;
    }> = [
      {
        itemName: "Knee Implant Poly Insert",
        category: "Implant",
        unit: "implant",
        manufacturer: "Zimmer",
        reorderLevel: 1,
      },
      {
        itemName: "Silk 1-0 Suture",
        category: "Suture",
        unit: "packs",
        manufacturer: "Ethicon",
        reorderLevel: 25,
      },
      {
        itemName: "Raytec Sponge",
        category: "Sponge",
        unit: "pieces",
        manufacturer: "SurgiCare",
        reorderLevel: 80,
      },
      {
        itemName: "Needle Holder",
        category: "Instrument",
        unit: "instruments",
        manufacturer: "Aesculap",
        reorderLevel: 4,
      },
      {
        itemName: "Skin Stapler",
        category: "Consumable",
        unit: "pieces",
        manufacturer: "Covidien",
        reorderLevel: 15,
      },
      {
        itemName: "Bone Cement",
        category: "Consumable",
        unit: "packs",
        manufacturer: "Stryker",
        reorderLevel: 6,
      },
    ];
    const item = catalog[index % catalog.length];
    const qty = item.category === "Implant" ? 1 + (index % 3) : 10 + ((index * 9) % 180);
    return {
      id: `ot-${index + 8}`,
      itemName: `${item.itemName} #${index + 1}`,
      category: item.category,
      batchNumber: `OT-${260700 + index}`,
      serialNumber:
        item.category === "Implant" || item.category === "Instrument"
          ? `SN-OT-${90000 + index}`
          : undefined,
      quantity: qty,
      unit: item.unit,
      storeLocation: [
        "OT Store / Implant Safe A",
        "OT Store / Rack S-01",
        "OT Store / Sterile Cabinet 2",
        "OT Store / Rack C-03",
      ][index % 4],
      manufacturer: item.manufacturer,
      expiryDate: `203${index % 5}-0${1 + (index % 9)}-${10 + (index % 18)}`,
      reorderLevel: item.reorderLevel,
    } satisfies OtStockItem;
  }),
];

function formatDate(date: string) {
  return new Date(date).toLocaleString("en-IN");
}

export function OperationTheatreInventoryScreen() {
  const [stock, setStock] = useState(INITIAL_OT_STOCK);
  const [procedureIssues, setProcedureIssues] = useState<ProcedureIssue[]>([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [otRecordId, setOtRecordId] = useState("");
  const [visitId, setVisitId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [procedureName, setProcedureName] = useState("");
  const [surgeonName, setSurgeonName] = useState("");
  const [issuedQuantities, setIssuedQuantities] = useState<
    Record<string, string>
  >({});

  const filteredStock = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return stock;
    return stock.filter((item) =>
      [
        item.itemName,
        item.category,
        item.batchNumber,
        item.serialNumber ?? "",
        item.storeLocation,
        item.manufacturer,
      ].some((value) => value.toLowerCase().includes(query)),
    );
  }, [search, stock]);

  const implants = stock.filter((item) => item.category === "Implant");
  const lowStock = stock.filter((item) => item.quantity <= item.reorderLevel);
  const procedureItemCount = procedureIssues.reduce(
    (total, issue) =>
      total +
      issue.items.reduce((itemTotal, item) => itemTotal + item.quantity, 0),
    0,
  );

  function resetForm() {
    setOtRecordId("");
    setVisitId("");
    setPatientName("");
    setProcedureName("");
    setSurgeonName("");
    setIssuedQuantities({});
  }

  function closeModal() {
    setModalOpen(false);
    resetForm();
  }

  function recordProcedureIssue() {
    if (
      !otRecordId.trim() ||
      !visitId.trim() ||
      !patientName.trim() ||
      !procedureName.trim() ||
      !surgeonName.trim()
    ) {
      toast.error("OT record, Visit ID, patient, procedure, and surgeon are required.");
      return;
    }

    const issuedItems: IssuedItem[] = [];
    for (const item of stock) {
      const quantity = Number(issuedQuantities[item.id] || 0);
      if (!Number.isInteger(quantity) || quantity < 0) {
        toast.error(`Enter a valid quantity for ${item.itemName}.`);
        return;
      }
      if (quantity > item.quantity) {
        toast.error(`${item.itemName} exceeds available OT store stock.`);
        return;
      }
      if (item.category === "Implant" && quantity > 1) {
        toast.error("Each serialized implant must be issued as an individual unit.");
        return;
      }
      if (quantity > 0) {
        issuedItems.push({
          itemId: item.id,
          itemName: item.itemName,
          category: item.category,
          batchNumber: item.batchNumber,
          serialNumber: item.serialNumber,
          quantity,
        });
      }
    }

    if (issuedItems.length === 0) {
      toast.error("Record at least one consumed or issued item.");
      return;
    }

    setStock((current) =>
      current.map((item) => {
        const issued = issuedItems.find((entry) => entry.itemId === item.id);
        return issued
          ? { ...item, quantity: item.quantity - issued.quantity }
          : item;
      }),
    );
    setProcedureIssues((current) => [
      {
        id: `${Date.now()}`,
        otRecordId: otRecordId.trim(),
        visitId: visitId.trim(),
        patientName: patientName.trim(),
        procedureName: procedureName.trim(),
        surgeonName: surgeonName.trim(),
        issuedAt: new Date().toISOString(),
        items: issuedItems,
      },
      ...current,
    ]);
    toast.success("OT consumption linked to the procedure and Visit ID.");
    closeModal();
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Inventory / Departments
          </p>
          <h1 className="mt-1 text-2xl font-bold text-foreground">
            Operation Theatre Store
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Procedure-linked consumable, instrument, and implant tracking.
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus size={16} />
          Record procedure consumption
        </Button>
      </header>

      <section
        aria-label="OT inventory summary"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {[
          {
            label: "OT stock lines",
            value: stock.length,
            icon: Boxes,
          },
          {
            label: "Serialized implants",
            value: implants.length,
            icon: ShieldCheck,
          },
          {
            label: "Low-stock lines",
            value: lowStock.length,
            icon: Activity,
          },
          {
            label: "Procedure items issued",
            value: procedureItemCount,
            icon: ClipboardCheck,
          },
        ].map((metric) => (
          <article key={metric.label} className="surface-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{metric.label}</p>
              <metric.icon size={18} className="text-primary" />
            </div>
            <p className="mt-3 text-2xl font-bold text-foreground">
              {metric.value}
            </p>
          </article>
        ))}
      </section>

      <section className="surface-card p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-info-muted p-2 text-info">
            <PackageCheck size={20} />
          </div>
          <div>
            <h2 className="text-base font-semibold">OT Store Sub-location</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              All stock below is controlled under the OT Store. Every issue is
              linked to both an OT Record ID and the patient&apos;s Visit ID for
              reconciliation and implant surveillance.
            </p>
          </div>
        </div>
      </section>

      <section className="surface-card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-border p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-base font-semibold">OT Store Stock</h2>
            <p className="text-xs text-muted-foreground">
              Batch and serial-level visibility for implants and instruments.
            </p>
          </div>
          <label className="relative block w-full md:w-80">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <span className="sr-only">Search OT inventory</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search item, batch, serial..."
              className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1150px] text-sm">
            <thead className="bg-muted text-left text-xs text-muted-foreground">
              <tr>
                {[
                  "Item",
                  "Category",
                  "Batch",
                  "Serial Number",
                  "Available",
                  "Manufacturer",
                  "Expiry",
                  "OT Store Location",
                  "Status",
                ].map((heading) => (
                  <th key={heading} className="px-4 py-3 font-semibold">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredStock.map((item) => (
                <tr key={item.id} className="hover:bg-muted/50">
                  <td className="px-4 py-4 font-semibold">{item.itemName}</td>
                  <td className="px-4 py-4">{item.category}</td>
                  <td className="px-4 py-4 font-mono text-xs">
                    {item.batchNumber}
                  </td>
                  <td className="px-4 py-4 font-mono text-xs">
                    {item.serialNumber ?? "—"}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={
                        item.quantity <= item.reorderLevel
                          ? "font-bold text-danger"
                          : "font-semibold"
                      }
                    >
                      {item.quantity} {item.unit}
                    </span>
                  </td>
                  <td className="px-4 py-4">{item.manufacturer}</td>
                  <td className="px-4 py-4">
                    {item.expiryDate
                      ? new Date(
                          `${item.expiryDate}T00:00:00`,
                        ).toLocaleDateString("en-IN")
                      : "Reusable"}
                  </td>
                  <td className="px-4 py-4">{item.storeLocation}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        item.quantity <= item.reorderLevel
                          ? "bg-danger-muted text-danger"
                          : "bg-success-muted text-success"
                      }`}
                    >
                      {item.quantity <= item.reorderLevel
                        ? "Reorder"
                        : "Available"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="surface-card overflow-hidden">
          <div className="border-b border-border p-5">
            <div className="flex items-center gap-2">
              <Stethoscope size={18} className="text-primary" />
              <h2 className="text-base font-semibold">
                Procedure Consumption & Reconciliation
              </h2>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Sponge, suture, instrument, consumable, and implant usage.
            </p>
          </div>
          {procedureIssues.length === 0 ? (
            <p className="p-8 text-center text-sm text-muted-foreground">
              No procedure consumption recorded in this session.
            </p>
          ) : (
            <div className="max-h-[440px] divide-y divide-border overflow-y-auto">
              {procedureIssues.map((issue) => (
                <article key={issue.id} className="p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold">{issue.procedureName}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {issue.patientName} · Visit {issue.visitId}
                      </p>
                    </div>
                    <span className="rounded-full bg-success-muted px-2 py-0.5 text-xs font-medium text-success">
                      Reconciled
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    OT Record {issue.otRecordId} · {issue.surgeonName} ·{" "}
                    {formatDate(issue.issuedAt)}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {issue.items.map((item) => (
                      <span
                        key={item.itemId}
                        className="rounded-md border border-border bg-muted px-2 py-1 text-xs"
                      >
                        {item.itemName} × {item.quantity}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="surface-card overflow-hidden">
          <div className="border-b border-border p-5">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-primary" />
              <h2 className="text-base font-semibold">
                Implant Surveillance Registry
              </h2>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Serial and batch traceability linked to patient visits.
            </p>
          </div>
          <div className="divide-y divide-border">
            {INITIAL_OT_STOCK.filter(
              (item) => item.category === "Implant",
            ).map((implant) => {
              const linkedIssue = procedureIssues.find((issue) =>
                issue.items.some((item) => item.itemId === implant.id),
              );
              return (
                <div key={implant.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{implant.itemName}</p>
                      <p className="mt-1 font-mono text-xs text-muted-foreground">
                        Serial {implant.serialNumber} · Batch{" "}
                        {implant.batchNumber}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        linkedIssue
                          ? "bg-info-muted text-info"
                          : "bg-success-muted text-success"
                      }`}
                    >
                      {linkedIssue ? "Implanted" : "In OT store"}
                    </span>
                  </div>
                  {linkedIssue && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Visit {linkedIssue.visitId} · OT Record{" "}
                      {linkedIssue.otRecordId} · {linkedIssue.patientName}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title="Record OT procedure consumption"
        maxWidth="lg"
        actions={
          <>
            <Button variant="ghost" onClick={closeModal}>
              Cancel
            </Button>
            <Button onClick={recordProcedureIssue}>
              Save and reconcile stock
            </Button>
          </>
        }
      >
        <div className="space-y-5 pt-2">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FieldText
              label="OT Record ID"
              value={otRecordId}
              onChange={(event) => setOtRecordId(event.target.value)}
              placeholder="OT-2026-00184"
              fullWidth
              required
            />
            <FieldText
              label="Patient Visit ID"
              value={visitId}
              onChange={(event) => setVisitId(event.target.value)}
              placeholder="VIS-2026-08341"
              fullWidth
              required
            />
            <FieldText
              label="Patient name"
              value={patientName}
              onChange={(event) => setPatientName(event.target.value)}
              fullWidth
              required
            />
            <FieldText
              label="Procedure"
              value={procedureName}
              onChange={(event) => setProcedureName(event.target.value)}
              placeholder="Total hip replacement"
              fullWidth
              required
            />
            <FieldText
              label="Surgeon"
              value={surgeonName}
              onChange={(event) => setSurgeonName(event.target.value)}
              fullWidth
              required
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold">Items consumed or implanted</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Enter actual quantities for stock reconciliation. Serialized
              implants are limited to one unit per record.
            </p>
            <div className="mt-3 max-h-80 divide-y divide-border overflow-y-auto rounded-lg border border-border">
              {stock.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[minmax(0,1fr)_110px] items-center gap-4 p-3"
                >
                  <div>
                    <p className="text-sm font-medium">{item.itemName}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.category} · Batch {item.batchNumber}
                      {item.serialNumber ? ` · Serial ${item.serialNumber}` : ""}
                      {" · "}Available {item.quantity} {item.unit}
                    </p>
                  </div>
                  <FieldText
                    label="Quantity"
                    type="number"
                    size="small"
                    value={issuedQuantities[item.id] ?? ""}
                    onChange={(event) =>
                      setIssuedQuantities((current) => ({
                        ...current,
                        [item.id]: event.target.value,
                      }))
                    }
                    inputProps={{
                      min: 0,
                      max:
                        item.category === "Implant"
                          ? Math.min(item.quantity, 1)
                          : item.quantity,
                      step: 1,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
