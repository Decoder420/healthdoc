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

import {
  reducePharmacyStock,
} from "@/features/pharmacy/data/pharmacyStock";

import type {
  DispenseMedicine,
} from "@/features/pharmacy/types/types";

const DISPENSE_HISTORY_KEY =
  "pharmacy_dispense_history";

interface DispenseHistoryRecord {
  id: string;
  prescriptionId: string;
  receiptNo: string;
  patientName: string;
  uhid: string;
  pharmacist: string;
  date: string;
  status: "Completed" | "Partial";
  dispenseType: "Full" | "Partial";
  medicines: {
    medicineName: string;
    batchNumber: string;
    quantity: number;
  }[];
  notes: string;
  createdAt: string;
}

export function PharmacyDispenseScreen() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const prescriptionId =
    searchParams.get("prescription");

  const [notes, setNotes] = useState("");
  const [rows, setRows] =
    useState<DispenseMedicine[]>([]);
  const [isConfirming, setIsConfirming] =
    useState(false);

  /*
   * ----------------------------------------------------------
   * FIND PRESCRIPTION
   * ----------------------------------------------------------
   */

  const prescription = useMemo(() => {
    if (!prescriptionId) {
      return null;
    }

    return (
      pharmacyPrescriptions.find(
        (item) =>
          item.id === prescriptionId
      ) ?? null
    );
  }, [prescriptionId]);

  /*
   * ----------------------------------------------------------
   * APPLY FEFO
   * ----------------------------------------------------------
   */

  const fefoMedicines = useMemo(() => {
    if (!prescription) {
      return [];
    }

    return prescription.medicines.map(
      (medicine) => {
        const fefoBatch =
          selectFEFOBatch(
            medicine.batches
          );

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

            status:
              "Out of Stock" as const,
          };
        }

        /*
         * Maximum quantity that can
         * currently be dispensed.
         */
        const initialDispenseQty =
          Math.min(
            medicine.prescribedQty,
            fefoBatch.availableStock
          );

        return {
          ...medicine,

          batchNumber:
            fefoBatch.batchNumber,

          expiryDate:
            fefoBatch.expiryDate,

          availableStock:
            fefoBatch.availableStock,

          dispenseQty:
            initialDispenseQty,

          status:
            initialDispenseQty <
            medicine.prescribedQty
              ? ("Partial" as const)
              : ("Available" as const),
        };
      }
    );
  }, [prescription]);

  /*
   * ----------------------------------------------------------
   * LOAD FEFO MEDICINES
   * ----------------------------------------------------------
   */

  useEffect(() => {
    setRows(fefoMedicines);
  }, [fefoMedicines]);

  /*
   * ----------------------------------------------------------
   * CANCEL
   * ----------------------------------------------------------
   */

  const handleCancel = () => {
    router.push(
      "/pharmacy/prescription-queue"
    );
  };

  /*
   * ----------------------------------------------------------
   * SAVE DRAFT
   * ----------------------------------------------------------
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
   * ----------------------------------------------------------
   * CREATE DISPENSE HISTORY
   * ----------------------------------------------------------
   */

  const saveDispenseHistory = (
    dispenseType: "Full" | "Partial"
  ) => {
    if (!prescription) {
      return;
    }

    const existing: DispenseHistoryRecord[] =
      JSON.parse(
        localStorage.getItem(
          DISPENSE_HISTORY_KEY
        ) || "[]"
      );

    const receiptNo =
      `RCP-${Date.now()}`;

    const record: DispenseHistoryRecord = {
      id:
        `DISP-${Date.now()}`,

      prescriptionId:
        prescription.id,

      receiptNo,

      patientName:
        prescription.patient.patientName,

      uhid:
        prescription.patient.uhid,

      pharmacist:
        "Current Pharmacist",

      date:
        new Date().toLocaleDateString(
          "en-IN"
        ),

      status:
        dispenseType === "Full"
          ? "Completed"
          : "Partial",

      dispenseType,

      medicines:
        rows
          .filter(
            (medicine) =>
              medicine.dispenseQty > 0
          )
          .map(
            (medicine) => ({
              medicineName:
                medicine.medicineName,

              batchNumber:
                medicine.batchNumber,

              quantity:
                medicine.dispenseQty,
            })
          ),

      notes,

      createdAt:
        new Date().toISOString(),
    };

    localStorage.setItem(
      DISPENSE_HISTORY_KEY,
      JSON.stringify([
        record,
        ...existing,
      ])
    );

    /*
     * Notify history screen if it
     * happens to be mounted.
     */
    window.dispatchEvent(
      new Event(
        "pharmacy-dispense-updated"
      )
    );

    return record;
  };

  /*
   * ----------------------------------------------------------
   * CONFIRM DISPENSE
   * ----------------------------------------------------------
   */

  const handleConfirmDispense =
    async () => {
      if (isConfirming) {
        return;
      }

      setIsConfirming(true);

      try {
        /*
         * Prescription validation
         */
        if (!prescription) {
          alert(
            "Prescription not found."
          );

          return;
        }

        /*
         * ------------------------------------------------------
         * VALIDATE QUANTITY
         * ------------------------------------------------------
         */

        const invalidMedicine =
          rows.find(
            (medicine) =>
              medicine.dispenseQty < 0 ||
              medicine.dispenseQty >
                medicine.availableStock
          );

        if (invalidMedicine) {
          alert(
            `${invalidMedicine.medicineName}: Dispense quantity cannot exceed available stock.`
          );

          return;
        }

        /*
         * ------------------------------------------------------
         * VALIDATE PRESCRIPTION
         * ------------------------------------------------------
         */

        const exceedsPrescription =
          rows.find(
            (medicine) =>
              medicine.dispenseQty >
              medicine.prescribedQty
          );

        if (exceedsPrescription) {
          alert(
            `${exceedsPrescription.medicineName}: Dispense quantity cannot exceed prescribed quantity.`
          );

          return;
        }

        /*
         * ------------------------------------------------------
         * CHECK AT LEAST ONE MEDICINE
         * ------------------------------------------------------
         */

        const totalDispensed =
          rows.reduce(
            (sum, medicine) =>
              sum +
              medicine.dispenseQty,
            0
          );

        if (totalDispensed === 0) {
          alert(
            "Please dispense at least one medicine."
          );

          return;
        }

        /*
         * ------------------------------------------------------
         * DETERMINE DISPENSE TYPE
         * ------------------------------------------------------
         */

        const hasIncompleteMedicine =
          rows.some(
            (medicine) =>
              medicine.dispenseQty <
              medicine.prescribedQty
          );

        const dispenseType =
          hasIncompleteMedicine
            ? "Partial"
            : "Full";

        /*
         * ------------------------------------------------------
         * VALIDATE FEFO BATCHES BEFORE
         * CHANGING ANY STOCK
         * ------------------------------------------------------
         */

        const medicinesToDispense =
          rows.filter(
            (medicine) =>
              medicine.dispenseQty > 0
          );

        /*
         * ------------------------------------------------------
         * UPDATE PHARMACY STOCK
         * ------------------------------------------------------
         */

        for (
          const medicine of
            medicinesToDispense
        ) {
          if (
            !medicine.batchNumber
          ) {
            throw new Error(
              `${medicine.medicineName}: No valid batch selected.`
            );
          }

          reducePharmacyStock({
            itemId:
              medicine.id,

            medicineName:
              medicine.medicineName,

            batchNumber:
              medicine.batchNumber,

            quantity:
              medicine.dispenseQty,

            prescriptionId:
              prescription.id,
          });
        }

        /*
         * ------------------------------------------------------
         * SAVE DISPENSE HISTORY
         * ------------------------------------------------------
         */

        const historyRecord =
          saveDispenseHistory(
            dispenseType
          );

        /*
         * ------------------------------------------------------
         * NOTIFY DASHBOARD
         * ------------------------------------------------------
         */

        window.dispatchEvent(
          new Event(
            "pharmacy-stock-updated"
          )
        );

        window.dispatchEvent(
          new Event(
            "pharmacy-dispense-updated"
          )
        );

        console.log(
          "DISPENSE COMPLETED:",
          {
            prescriptionId:
              prescription.id,

            dispenseType,

            medicines:
              medicinesToDispense,

            historyRecord,
          }
        );

        /*
         * ------------------------------------------------------
         * GO TO RECEIPT
         * ------------------------------------------------------
         */

        router.push(
          `/pharmacy/receipt/preview?prescription=${prescriptionId}`
        );
      } catch (error) {
        console.error(
          "Dispense failed:",
          error
        );

        alert(
          error instanceof Error
            ? error.message
            : "Failed to complete dispense."
        );
      } finally {
        setIsConfirming(false);
      }
    };

  /*
   * ----------------------------------------------------------
   * NO PRESCRIPTION
   * ----------------------------------------------------------
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
            Select a prescription from
            the Prescription Queue to
            begin dispensing medicines.
          </p>

          <button
            onClick={() =>
              router.push(
                "/pharmacy/prescription-queue"
              )
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
   * ----------------------------------------------------------
   * PRESCRIPTION NOT FOUND
   * ----------------------------------------------------------
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
            The selected prescription
            could not be found.
          </p>

          <button
            onClick={() =>
              router.push(
                "/pharmacy/prescription-queue"
              )
            }
            className="btn btn-primary mt-6"
          >
            Back to Prescription Queue
          </button>
        </div>
      </div>
    );
  }

  /*
   * ----------------------------------------------------------
   * MAIN SCREEN
   * ----------------------------------------------------------
   */

  return (
    <div className="space-y-6">
      <DispenseHeader />

      <PatientInformationCard
        patient={
          prescription.patient
        }
      />

      <MedicationTable
        medicines={rows}
        setMedicines={setRows}
      />

      <PartialDispenseAlerts
        medicines={rows}
      />

      <PharmacistNotes
        notes={notes}
        onNotesChange={setNotes}
      />

      <DispenseFooter
        onCancel={handleCancel}
        onSaveDraft={handleSaveDraft}
        onConfirm={
          handleConfirmDispense
        }
        isConfirming={
          isConfirming
        }
      />
    </div>
  );
}