"use client";

import { useMemo, useState } from "react";

import { Box, Stack, Typography } from "@mui/material";

import SearchBar from "./SearchBar";
import VerificationKPICards from "./Stat_cards";
import VerifiedReportsTable from "./VerifiedReportTable";

import { reports } from "./DummyData";

export default function VerificationPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  const filteredReports = useMemo(() => {
    const keyword = search.toLowerCase();

    return reports.filter((item) => {
      const matchesSearch =
        item.patient.name.toLowerCase().includes(keyword) ||
        item.patient.uhid.toLowerCase().includes(keyword) ||
        item.sample.barcode.toLowerCase().includes(keyword) ||
        item.report.reportNo.toLowerCase().includes(keyword) ||
        item.report.testName.toLowerCase().includes(keyword);

      const matchesStatus =
        status === "ALL" || item.report.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [search, status]);


const handleRefresh = () => {
  setSearch("");
  // Call API again here when connected to backend
};

  return (
    <Box p={3}>
      <Stack spacing={3}>
        <Typography
          variant="h4"
          fontWeight={700}
        >
          Verification
        </Typography>

        <VerificationKPICards />

        <SearchBar
  search={search}
  onSearchChange={setSearch}
  onRefresh={handleRefresh}
/>

       <VerifiedReportsTable reports={filteredReports} />
      </Stack>
    </Box>
  );
}