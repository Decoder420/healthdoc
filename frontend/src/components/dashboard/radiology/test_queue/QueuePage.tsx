"use client";

import { useState } from "react";

import { Box } from "@mui/material";
import Grid from "@mui/material/Grid2";

import Header from "./QueueHeader";
import QueueStats from "./QueueStats";
import QueueFilters from "./QueueFilters";
import QueueTable from "./QueueTable";

import { appointmentQueue } from "./DummyData";

export default function RadiologyQueuePage() {
  const [search, setSearch] = useState("");
  const [modality, setModality] = useState("All");
  const [priority, setPriority] = useState("All");
  const [status, setStatus] = useState("All");

  const handleReset = () => {
    setSearch("");
    setModality("All");
    setPriority("All");
    setStatus("All");
  };

  const handleRefresh = () => {
  setSearch("");
  setModality("All");
  setPriority("All");
  setStatus("All");

  // Later replace with API call
  window.location.reload();
};

const handleExport = () => {
  const csv = [
    [
      "Token",
      "Patient",
      "UHID",
      "Modality",
      "Procedure",
      "Time",
      "Priority",
      "Status",
    ],
    ...appointmentQueue.map((row) => [
      row.token,
      row.patientName,
      row.uhid,
      row.modality,
      row.procedure,
      row.appointmentTime,
      row.priority,
      row.status,
    ]),
  ]
    .map((row) => row.join(","))
    .join("\n");

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `Radiology_Queue_${
    new Date().toISOString().split("T")[0]
  }.csv`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

  return (
    <Box>
      {/* Header */}
      <Header
  onRefresh={handleRefresh}
  onExport={handleExport}
/>

      {/* Statistics */}
      <Box mt={3}>
        <QueueStats />
      </Box>

      {/* Filters */}
      <Box mt={3}>
        <QueueFilters
          search={search}
          onSearchChange={setSearch}
          modality={modality}
          onModalityChange={setModality}
          priority={priority}
          onPriorityChange={setPriority}
          status={status}
          onStatusChange={setStatus}
          onReset={handleReset}
        />
      </Box>

      {/* Full Width Queue Table */}
      <Grid
        container
        spacing={3}
        mt={1}
      >
        <Grid size={12}>
          <QueueTable
            search={search}
            modality={modality}
            priority={priority}
            status={status}
          />
        </Grid>
      </Grid>
    </Box>
  );
}