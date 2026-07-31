"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import DispenseHeader from "@/components/dashboard/pharmacist/dispense/DispenseHeader";
import PatientInformationCard from "@/components/dashboard/pharmacist/dispense/PatientInformationCard";
import MedicationTable from "@/components/dashboard/pharmacist/dispense/MedicationTable";
import PartialDispenseAlerts from "@/components/dashboard/pharmacist/dispense/PartialDispenseAlerts";
import PharmacistNotes from "@/components/dashboard/pharmacist/dispense/PharmacistNotes";
import DispenseFooter from "@/components/dashboard/pharmacist/dispense/DispenseFooter";

import {
  patient,
  medicines,
} from "@/features/pharmacy/data/dispenseData";

export function PharmacyDispenseScreen() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const prescriptionId = searchParams.get("prescription");

  console.log("URL:", window.location.href);
console.log("Prescription ID:", prescriptionId);

if (!prescriptionId) {
  console.log(">>> EMPTY STATE <<<");
} else {
  console.log(">>> DISPENSE FORM <<<");
}

  

  const [notes, setNotes] = useState("");
  const [rows, setRows] = useState(medicines);

  // Cancel
  const handleCancel = () => {
    window.history.back();
  };

  // Save Draft
  const handleSaveDraft = () => {
    console.log("Draft Saved");
  };

  // Confirm Dispense
  const handleConfirmDispense = async () => {
    console.log("Confirm Dispense clicked");

    const invalidMedicine = rows.find(
      (medicine) =>
        medicine.dispenseQty < 0 ||
        medicine.dispenseQty > medicine.availableStock
    );

    if (invalidMedicine) {
      alert(
        `${invalidMedicine.medicineName}: Dispense quantity cannot exceed available stock.`
      );
      return;
    }

    const totalDispensed = rows.reduce(
      (sum, medicine) => sum + medicine.dispenseQty,
      0
    );

    if (totalDispensed === 0) {
      alert("Please dispense at least one medicine.");
      return;
    }

    console.log("Creating pharmacy_dispenses...");
    console.log("Creating pharmacy_dispense_items...");
    console.log("Updating inventory_batches...");
    console.log("Updating prescription status...");
    console.log("Creating audit log...");

    try {
      alert("Medicines dispensed successfully.");

      router.push("/pharmacy/receipt/preview");
    } catch (error) {
      console.error(error);
      alert("Failed to complete dispense.");
    }
  };

  // ✅ Empty state when no prescription is selected
  if (!prescriptionId) {
    return (
      <div className="space-y-6">
        <DispenseHeader />

        <div className="surface-card rounded-xl p-12 text-center">
          <h2 className="text-2xl font-semibold text-[#001F54]">
            No Prescription Selected
          </h2>

          <p className="mt-3 text-gray-500">
            Select a prescription from the Prescription Queue to begin
            dispensing medicines.
          </p>

          <button
            onClick={() => router.push("/pharmacy/prescription-queue")}
            className="btn btn-primary mt-6"
          >
            Go to Prescription Queue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DispenseHeader />

      <PatientInformationCard patient={patient} />

      <MedicationTable
        medicines={rows}
        setMedicines={setRows}
      />

      <PartialDispenseAlerts medicines={rows} />

      <PharmacistNotes
        notes={notes}
        onNotesChange={setNotes}
      />

      <DispenseFooter
        onCancel={handleCancel}
        onSaveDraft={handleSaveDraft}
        onConfirm={handleConfirmDispense}
      />
    </div>
  );
}