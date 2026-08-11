"use client";

import { useMemo, useState } from "react";

import {
  Stack,
  Typography,
} from "@mui/material";

import SearchBar from "./SearchBar";
import VerificationKPICards from "./Stat_cards";
import VerifiedReportsTable from "./VerifiedReportTable";

import { reports } from "./DummyData";

export default function VerificationPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  const filteredReports = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return reports.filter((item) => {
      const matchesSearch =
        item.patient.name
          .toLowerCase()
          .includes(keyword) ||
        item.patient.uhid
          .toLowerCase()
          .includes(keyword) ||
        item.sample.barcode
          .toLowerCase()
          .includes(keyword) ||
        item.report.reportNo
          .toLowerCase()
          .includes(keyword) ||
        item.report.testName
          .toLowerCase()
          .includes(keyword);

      const matchesStatus =
        status === "ALL" ||
        item.report.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  const handleRefresh = () => {
    setSearch("");
    setStatus("ALL");

    // Call API again here when connected to backend
  };

  return (
    <Stack
      spacing={2}
      sx={{
        p: {
          xs: 2,
          md: 3,
        },
      }}
    >
      {/* Page Header */}
      <Stack spacing={0.25}>
        <Typography
          variant="h5"
          fontWeight={700}
        >
          Verification
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
        >
          Review and verify completed pathology reports.
        </Typography>
      </Stack>

      {/* KPI Cards */}
      <VerificationKPICards />

      {/* Search */}
      <SearchBar
        search={search}
        onSearchChange={setSearch}
        onRefresh={handleRefresh}
      />

      {/* Verified Reports */}
      <VerifiedReportsTable
        reports={filteredReports}
      />
    </Stack>
  );
}
