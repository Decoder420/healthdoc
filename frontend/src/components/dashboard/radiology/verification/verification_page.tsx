"use client";

import { useMemo, useState } from "react";

import {
  Box,
  Stack,
  Typography,
} from "@mui/material";

import SearchBar from "./SearchBar";
import VerificationKPICards from "./stat_cards";
import VerifiedReportsTable from "./ReportTable";

import {
  reportPatients,
} from "@/components/dashboard/radiology/test_result/dummyReportData";


export default function VerificationPage() {


  const [search, setSearch] = useState("");

  const [status, setStatus] =
    useState<
      "ALL" | "Verified" | "Draft"
    >("ALL");



  const filteredReports = useMemo(() => {


    const keyword =
      search.toLowerCase();



    return reportPatients.filter(
      (item) => {


        const matchesSearch =

          item.patientName
            .toLowerCase()
            .includes(keyword)

          ||

          item.uhid
            .toLowerCase()
            .includes(keyword)

          ||

          item.accessionNumber
            .toLowerCase()
            .includes(keyword)

          ||

          item.orderId
            .toLowerCase()
            .includes(keyword)

          ||

          item.procedure
            .toLowerCase()
            .includes(keyword);



        const matchesStatus =

          status === "ALL"

          ||

          item.studyStatus === status;



        return (
          matchesSearch &&
          matchesStatus
        );

      }
    );


  }, [
    search,
    status,
  ]);




  const handleRefresh = () => {

    setSearch("");

    setStatus("ALL");

  };



  return (

    <Box>

      <Stack spacing={3}>


        <Typography
          variant="h5"
          fontWeight={700}
        >
          Report Verification
        </Typography>



        <VerificationKPICards />



        <SearchBar

          search={search}

          onSearchChange={
            setSearch
          }

          onRefresh={
            handleRefresh
          }

        />



        <VerifiedReportsTable

          reports={
            filteredReports
          }

        />


      </Stack>


    </Box>

  );

}