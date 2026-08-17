"use client";

import { useEffect, useMemo, useState } from "react";

import Breadcrumbs from "@/components/shared/Breadcrumbs";

import HistoryHeader from "../../components/dashboard/pharmacist/dispense-history/HistoryHeader";
import HistoryStats from "../../components/dashboard/pharmacist/dispense-history/HistoryStats";
import HistoryFilters from "../../components/dashboard/pharmacist/dispense-history/HistoryFilters";
import HistoryTable from "../../components/dashboard/pharmacist/dispense-history/HistoryTable";

import { dispenseHistoryData } from "@/features/pharmacy/data/dispenseHistoryData";

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

interface DispenseHistoryItem {
  id: string;
  receiptNo: string;
  patientName: string;
  uhid: string;
  prescriptionNo: string;
  pharmacist: string;
  dispenseDate: string;
  medicines: number;
  status:
    | "Completed"
    | "Partial"
    | "Downloaded"
    | "Printed"
    | "Reprinted";
}

export function PharmacyDispenseHistoryScreen() {
  const [status, setStatus] =
    useState("All Receipts");

  const [search, setSearch] =
    useState("");

  const [date, setDate] =
    useState("");

  const [pharmacist, setPharmacist] =
    useState("All Pharmacists");

  const [
    history,
    setHistory,
  ] = useState<DispenseHistoryRecord[]>(
    []
  );

  /*
   * ----------------------------------------------------------
   * LOAD HISTORY
   * ----------------------------------------------------------
   */

  const loadHistory = () => {
    try {
      const stored =
        localStorage.getItem(
          DISPENSE_HISTORY_KEY
        );

      if (!stored) {
        setHistory([]);
        return;
      }

      const parsed =
        JSON.parse(stored);

      if (Array.isArray(parsed)) {
        setHistory(parsed);
      } else {
        setHistory([]);
      }
    } catch (error) {
      console.error(
        "Failed to load dispense history:",
        error
      );

      setHistory([]);
    }
  };

  useEffect(() => {
    loadHistory();

    const handleUpdate = () => {
      loadHistory();
    };

    window.addEventListener(
      "pharmacy-dispense-updated",
      handleUpdate
    );

    return () => {
      window.removeEventListener(
        "pharmacy-dispense-updated",
        handleUpdate
      );
    };
  }, []);

  /*
   * ----------------------------------------------------------
   * COMBINE STATIC + REAL HISTORY
   * ----------------------------------------------------------
   */

  const combinedHistory = useMemo(() => {
    /*
     * Convert the existing demo history
     * into a compatible structure.
     */
    const demoHistory =
      dispenseHistoryData.map(
        (item) => ({
          ...item,
        })
      );

    /*
     * Real dispenses should appear first.
     */
    return [
      ...history,
      ...demoHistory,
    ];
  }, [history]);

  /*
   * ----------------------------------------------------------
   * FILTER HISTORY
   * ----------------------------------------------------------
   */

  const filteredHistory =
    combinedHistory.filter(
      (item) => {
        const patientName =
          "patientName" in item
            ? item.patientName
            : "";

        const receiptNo =
          "receiptNo" in item
            ? item.receiptNo
            : "";

        const uhid =
          "uhid" in item
            ? item.uhid
            : "";

        const itemPharmacist =
          "pharmacist" in item
            ? item.pharmacist
            : "";

        const itemStatus =
          "status" in item
            ? item.status
            : "";

        const itemDate =
          "date" in item
            ? item.date
            : "";

        /*
         * Search
         */
        const matchesSearch =
          search === "" ||
          patientName
            .toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          receiptNo
            .toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          uhid
            .toLowerCase()
            .includes(
              search.toLowerCase()
            );

        /*
         * Date
         */
        const matchesDate =
          date === "" ||
          itemDate === date;

        /*
         * Pharmacist
         */
        const matchesPharmacist =
          pharmacist ===
            "All Pharmacists" ||
          itemPharmacist ===
            pharmacist;

        /*
         * Status
         */
        const matchesStatus =
          status ===
            "All Receipts" ||
          itemStatus === status;

        return (
          matchesSearch &&
          matchesDate &&
          matchesPharmacist &&
          matchesStatus
        );
      }
    );

  /*
   * ----------------------------------------------------------
   * RESET
   * ----------------------------------------------------------
   */

  const handleReset = () => {
    setStatus("All Receipts");
    setSearch("");
    setDate("");
    setPharmacist(
      "All Pharmacists"
    );
  };

  /*
   * ----------------------------------------------------------
   * STATS
   * ----------------------------------------------------------
   */

  const totalDispenses =
    combinedHistory.length;

  const completedDispenses =
    combinedHistory.filter(
      (item) =>
        "status" in item &&
        item.status ===
          "Completed"
    ).length;

  const partialDispenses =
    combinedHistory.filter(
      (item) =>
        "status" in item &&
        item.status ===
          "Partial"
    ).length;

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          {
            label: "Pharmacy",
            href: "/pharmacy",
          },
          {
            label: "Dispense History",
          },
        ]}
      />

      <HistoryHeader />

      <HistoryStats />

      <HistoryFilters
        status={status}
        setStatus={setStatus}
        search={search}
        setSearch={setSearch}
        date={date}
        setDate={setDate}
        pharmacist={pharmacist}
        setPharmacist={
          setPharmacist
        }
        onReset={handleReset}
      />

      <HistoryTable
        data={filteredHistory.map((item) => {
          if ("prescriptionNo" in item) {
            return item as unknown as any;
          }

          return {
            id: item.id,
            receiptNo: item.receiptNo,
            patientName: item.patientName,
            uhid: item.uhid,
            prescriptionNo: item.prescriptionId,
            pharmacist: item.pharmacist,
            dispenseDate: item.date,
            medicines: item.medicines.length,
            status: item.status,
          } as any;
        })}
      />

      {/*
       * These values are intentionally
       * calculated here so we can later
       * connect them to HistoryStats.
       */}
      <div className="hidden">
        {totalDispenses}
        {completedDispenses}
        {partialDispenses}
      </div>
    </div>
  );
}