"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import DispenseHeader from "@/components/dashboard/pharmacist/dispense/DispenseHeader";
import PatientInformationCard from "@/components/dashboard/pharmacist/dispense/PatientInformationCard";
import MedicationTable from "@/components/dashboard/pharmacist/dispense/MedicationTable";
import PartialDispenseAlerts from "@/components/dashboard/pharmacist/dispense/PartialDispenseAlerts";
import PharmacistNotes from "@/components/dashboard/pharmacist/dispense/PharmacistNotes";
import DispenseFooter from "@/components/dashboard/pharmacist/dispense/DispenseFooter";

import {
  pharmacyPrescriptions,
} from "@/features/pharmacy/data/prescriptionData";

import {
  selectFEFOBatch,
} from "@/lib/utils/fefo";

import type { DispenseMedicine } from "@/features/pharmacy/types/types";

export function PharmacyDispenseScreen() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const prescriptionId = searchParams.get("prescription");

  const [notes, setNotes] = useState("");
  const [rows, setRows] = useState<DispenseMedicine[]>([]);
  const [isConfirming, setIsConfirming] = useState(false);

  /*
   * Find the selected prescription
   */
  const prescription = useMemo(() => {
    if (!prescriptionId) {
      return null;
    }

    return (
      pharmacyPrescriptions.find(
        (item) => item.id === prescriptionId
      ) ?? null
    );
  }, [prescriptionId]);

  /*
   * Apply FEFO when prescription changes
   */
  const fefoMedicines = useMemo(() => {
    if (!prescription) {
      return [];
    }

    return prescription.medicines.map((medicine) => {
      const fefoBatch = selectFEFOBatch(medicine.batches);

      /*
       * No stock available
       */
      if (!fefoBatch) {
        return {
          ...medicine,
          batchNumber: "",
          expiryDate: "",
          availableStock: 0,
          dispenseQty: 0,
          status: "Out of Stock" as const,
        };
      }

      /*
       * Automatically calculate the initial
       * quantity that can actually be dispensed.
       */
      const initialDispenseQty = Math.min(
        medicine.prescribedQty,
        fefoBatch.availableStock
      );

      return {
        ...medicine,

        // FEFO selected batch
        batchNumber: fefoBatch.batchNumber,
        expiryDate: fefoBatch.expiryDate,
        availableStock: fefoBatch.availableStock,

        // Initial quantity
        dispenseQty: initialDispenseQty,

        status:
          initialDispenseQty < medicine.prescribedQty
            ? ("Partial" as const)
            : ("Available" as const),
      };
    });
  }, [prescription]);

  /*
   * Put FEFO-selected medicines into editable state
   */
  useEffect(() => {
    setRows(fefoMedicines);
  }, [fefoMedicines]);

  /*
   * Cancel
   */
  const handleCancel = () => {
    router.push("/pharmacy/prescription-queue");
  };

  /*
   * Save Draft
   */
  const handleSaveDraft = () => {
    console.log("Draft Saved");

    console.log({
      prescriptionId,
      notes,
      medicines: rows,
    });
  };

  /*
   * Confirm Dispense
   */
  const handleConfirmDispense = async () => {
  if (isConfirming) {
    return;
  }

  setIsConfirming(true);

  try {
    console.log("Confirm Dispense clicked");

    if (!prescription) {
      alert("Prescription not found.");
      return;
    }

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

    const exceedsPrescription = rows.find(
      (medicine) =>
        medicine.dispenseQty > medicine.prescribedQty
    );

    if (exceedsPrescription) {
      alert(
        `${exceedsPrescription.medicineName}: Dispense quantity cannot exceed prescribed quantity.`
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

    const hasIncompleteMedicine = rows.some(
      (medicine) =>
        medicine.dispenseQty < medicine.prescribedQty
    );

    const dispenseType = hasIncompleteMedicine
      ? "Partial"
      : "Full";

    console.log("Dispense Type:", dispenseType);

    /*
     * Transaction creation will be added next.
     */

    alert(
      dispenseType === "Full"
        ? "Medicines fully dispensed successfully."
        : "Medicines partially dispensed successfully."
    );

    router.push(
      `/pharmacy/receipt/preview?prescription=${prescriptionId}`
    );
  } catch (error) {
    console.error("Dispense failed:", error);

    alert("Failed to complete dispense.");
  } finally {
    setIsConfirming(false);
  }
};


      /*
       * Receipt integration will be connected
       * after the dispense record is created.
       */
      

  /*
   * No prescription selected
   */
  if (!prescriptionId) {
    return (
      <div className="space-y-6">
        <DispenseHeader />

        <div className="surface-card rounded-xl p-12 text-center">
          <h2 className="text-2xl font-semibold text-[#001F54]">
            No Prescription Selected
          </h2>

          <p className="mt-3 text-gray-500">
            Select a prescription from the Prescription Queue
            to begin dispensing medicines.
          </p>

          <button
            onClick={() =>
              router.push("/pharmacy/prescription-queue")
            }
            className="btn btn-primary mt-6"
          >
            Go to Prescription Queue
          </button>
        </div>
      </div>
    );
  }

  /*
   * Prescription ID exists but prescription doesn't
   */
  if (!prescription) {
    return (
      <div className="space-y-6">
        <DispenseHeader />

        <div className="surface-card rounded-xl p-12 text-center">
          <h2 className="text-2xl font-semibold text-[#001F54]">
            Prescription Not Found
          </h2>

          <p className="mt-3 text-gray-500">
            The selected prescription could not be found.
          </p>

          <button
            onClick={() =>
              router.push("/pharmacy/prescription-queue")
            }
            className="btn btn-primary mt-6"
          >
            Back to Prescription Queue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DispenseHeader />

      <PatientInformationCard
        patient={prescription.patient}
      />

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
         isConfirming={isConfirming}
      />
    </div>
  );
}