"use client";

import { useState } from "react";
import {
  AlertCircle,
  ClipboardCheck,
  Send,
} from "lucide-react";

interface AdjustmentRequest {
  id: string;
  medicine: string;
  batch: string;
  systemQuantity: number;
  observedQuantity: number;
  difference: number;
  reason: string;
  requestedBy: string;
  status: "Pending Inventory Review" | "Reviewed" | "Approved" | "Rejected";
  createdAt: string;
}

const medicines = [
  {
    id: "MED-001",
    name: "Paracetamol 500mg",
    batch: "PCM-2026-01",
    stock: 120,
  },
  {
    id: "MED-002",
    name: "Amoxicillin 500mg",
    batch: "AMX-2026-02",
    stock: 75,
  },
  {
    id: "MED-003",
    name: "Azithromycin 500mg",
    batch: "AZM-2026-01",
    stock: 42,
  },
  {
    id: "MED-004",
    name: "Pantoprazole 40mg",
    batch: "PAN-2026-03",
    stock: 90,
  },
];

const reasons = [
  "Physical stock mismatch",
  "Damaged medicine",
  "Expired medicine",
  "Lost / missing stock",
  "Dispensing error",
  "Other",
];

const STORAGE_KEY = "pharmacy_stock_adjustment_requests";

export default function PharmacyStockAdjustment() {
  const [medicineId, setMedicineId] = useState("");
  const [observedQuantity, setObservedQuantity] = useState("");
  const [reason, setReason] = useState("");
  const [remarks, setRemarks] = useState("");
  const [success, setSuccess] = useState(false);

  const selectedMedicine = medicines.find(
    (medicine) => medicine.id === medicineId
  );

  const systemQuantity = selectedMedicine?.stock ?? 0;

  const difference =
    selectedMedicine && observedQuantity !== ""
      ? Number(observedQuantity) - systemQuantity
      : 0;

  const canSubmit =
    Boolean(selectedMedicine) &&
    observedQuantity !== "" &&
    Number(observedQuantity) >= 0 &&
    Boolean(reason);

  const handleSubmit = () => {
    if (!canSubmit || !selectedMedicine) return;

    const request: AdjustmentRequest = {
      id: `PH-ADJ-${Date.now()}`,
      medicine: selectedMedicine.name,
      batch: selectedMedicine.batch,
      systemQuantity,
      observedQuantity: Number(observedQuantity),
      difference,
      reason,
      requestedBy: "Pharmacist",
      status: "Pending Inventory Review",
      createdAt: new Date().toISOString(),
    };

    const existing: AdjustmentRequest[] = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    );

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([request, ...existing])
    );

    window.dispatchEvent(
      new Event("pharmacy-stock-adjustment-created")
    );

    setMedicineId("");
    setObservedQuantity("");
    setReason("");
    setRemarks("");
    setSuccess(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}

      <div>
        <h1 className="text-2xl font-bold text-[#001F54]">
          Stock Adjustment Request
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Report a pharmacy stock discrepancy to the Inventory
          Department for verification.
        </p>
      </div>

      {/* Information */}

      <div className="flex gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
        <AlertCircle
          size={20}
          className="mt-0.5 shrink-0 text-[#001F54]"
        />

        <div>
          <p className="font-semibold text-[#001F54]">
            Inventory verification required
          </p>

          <p className="mt-1 text-sm text-gray-600">
            Pharmacy users cannot directly modify stock quantities.
            Submit a request and the Inventory team will perform
            physical verification before making the adjustment.
          </p>
        </div>
      </div>

      {success && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
          Stock adjustment request sent to Inventory successfully.
        </div>
      )}

      {/* Form */}

      <section className="surface-card p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg bg-[#001F54] p-3 text-white">
            <ClipboardCheck size={20} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[#001F54]">
              Report Stock Discrepancy
            </h2>

            <p className="text-sm text-gray-500">
              Provide the actual physical stock available in pharmacy.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Medicine */}

          <label>
            <span className="mb-2 block text-sm font-semibold text-gray-700">
              Medicine
            </span>

            <select
              value={medicineId}
              onChange={(e) => {
                setMedicineId(e.target.value);
                setObservedQuantity("");
              }}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm outline-none focus:border-[#001F54]"
            >
              <option value="">Select medicine</option>

              {medicines.map((medicine) => (
                <option key={medicine.id} value={medicine.id}>
                  {medicine.name}
                </option>
              ))}
            </select>
          </label>

          {/* Batch */}

          <label>
            <span className="mb-2 block text-sm font-semibold text-gray-700">
              Batch
            </span>

            <input
              value={selectedMedicine?.batch ?? ""}
              disabled
              placeholder="Batch will appear here"
              className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-3 text-sm"
            />
          </label>

          {/* System Quantity */}

          <label>
            <span className="mb-2 block text-sm font-semibold text-gray-700">
              System Quantity
            </span>

            <input
              value={selectedMedicine ? systemQuantity : ""}
              disabled
              placeholder="--"
              className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-3 text-sm"
            />
          </label>

          {/* Observed Quantity */}

          <label>
            <span className="mb-2 block text-sm font-semibold text-gray-700">
              Physical / Observed Quantity
            </span>

            <input
              type="number"
              min={0}
              value={observedQuantity}
              onChange={(e) =>
                setObservedQuantity(e.target.value)
              }
              placeholder="Enter physical quantity"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm outline-none focus:border-[#001F54]"
            />
          </label>

          {/* Difference */}

          <div>
            <span className="mb-2 block text-sm font-semibold text-gray-700">
              Difference
            </span>

            <div
              className={`rounded-lg border px-3 py-3 text-sm font-semibold ${
                difference === 0
                  ? "border-gray-300 bg-gray-50 text-gray-600"
                  : difference < 0
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-green-200 bg-green-50 text-green-700"
              }`}
            >
              {selectedMedicine && observedQuantity !== ""
                ? difference > 0
                  ? `+${difference}`
                  : difference
                : "--"}
            </div>
          </div>

          {/* Reason */}

          <label>
            <span className="mb-2 block text-sm font-semibold text-gray-700">
              Reason
            </span>

            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm outline-none focus:border-[#001F54]"
            >
              <option value="">Select reason</option>

              {reasons.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          {/* Remarks */}

          <label className="md:col-span-2">
            <span className="mb-2 block text-sm font-semibold text-gray-700">
              Remarks
            </span>

            <textarea
              rows={4}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add additional details..."
              className="w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm outline-none focus:border-[#001F54]"
            />
          </label>
        </div>

        {/* Submit */}

        <div className="mt-6 flex justify-end border-t border-gray-200 pt-5">
          <button
            type="button"
            disabled={!canSubmit}
            onClick={handleSubmit}
            className="inline-flex items-center gap-2 rounded-lg bg-[#001F54] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send size={17} />
            Notify Inventory
          </button>
        </div>
      </section>

      {/* Workflow */}

      <section className="surface-card p-6">
        <h2 className="mb-4 text-lg font-semibold text-[#001F54]">
          Adjustment Workflow
        </h2>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          {[
            ["1", "Pharmacy Request", "Pharmacist reports discrepancy"],
            ["2", "Inventory Review", "Inventory verifies physical stock"],
            ["3", "Approval", "Authorized users approve adjustment"],
            ["4", "Stock Updated", "Final adjustment is recorded"],
          ].map(([number, title, description]) => (
            <div
              key={number}
              className="rounded-xl border border-gray-200 bg-gray-50 p-4"
            >
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#001F54] text-sm font-bold text-white">
                {number}
              </div>

              <h3 className="font-semibold text-[#001F54]">
                {title}
              </h3>

              <p className="mt-1 text-xs text-gray-500">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}