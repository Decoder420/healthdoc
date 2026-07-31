"use client";

import Breadcrumbs from "@/components/shared/Breadcrumbs";

import HistoryHeader from "../../components/dashboard/pharmacist/dispense-history/HistoryHeader";
import HistoryStats from "../../components/dashboard/pharmacist/dispense-history/HistoryStats";
import HistoryFilters from "../../components/dashboard/pharmacist/dispense-history/HistoryFilters";
import HistoryTable from "../../components/dashboard/pharmacist/dispense-history/HistoryTable";
import { useState } from "react";
import { dispenseHistoryData } from "@/features/pharmacy/data/dispenseHistoryData";

export function PharmacyDispenseHistoryScreen() {

const [status, setStatus] = useState("All Receipts");
const [search, setSearch] = useState("");
const [date, setDate] = useState("");
const [pharmacist, setPharmacist] = useState("All Pharmacists");

  const handleReset = () => {
    setStatus("All Receipts");
    setSearch("");
    setDate("");
    setPharmacist("All Pharmacists");
  };
console.log("status =", status);
console.log("setStatus:", setStatus);
console.log("typeof setStatus:", typeof setStatus); 

const filteredHistory = dispenseHistoryData.filter((item) => {
  const matchesSearch =
    search === "" ||
    item.patientName.toLowerCase().includes(search.toLowerCase()) ||
    item.receiptNo.toLowerCase().includes(search.toLowerCase()) ||
    item.uhid.toLowerCase().includes(search.toLowerCase());

  const matchesDate =
    date === "" || item.date === date;

  const matchesPharmacist =
    pharmacist === "All Pharmacists" ||
    item.pharmacist === pharmacist;

  const matchesStatus =
    status === "All Receipts" ||
    item.status === status;


 return (
    matchesSearch &&
    matchesDate &&
    matchesPharmacist &&
    matchesStatus
  );
});

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Pharmacy", href: "/pharmacy" },
          { label: "Dispense History" },
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
        setPharmacist={setPharmacist}
        onReset={handleReset}
      />

      <HistoryTable  data={filteredHistory}/>
    </div>
  );
}