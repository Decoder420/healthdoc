"use client";

import { useMemo, useState } from "react";

import {
  Box,
  Paper,
  Typography,
  Divider,
  Button,
} from "@mui/material";

import Header from "./header";
import DashboardStats from "./stats";
import SearchToolBar from "./searchbar";

import TrendChart from "./TrendChart";
import StatusDistributionChart from "./StatusDistributionChart";
import ReportingTimeChart from "./ReportingTimeChart";

import RadiologyTable from "./DeptTable";

import type {
  DepartmentDashboardProps,
  RadiologyCase,
} from "./types";



export default function DepartmentDashboard({

  title,
  subtitle,
  description,
  icon,

  stats,

  trendData,
  statusData,
  reportingData,

  chartConfig,

  rows,

  renderStatus,
  renderActions,

  onVerify,
  onViewReport,

  onRefresh,
  onExport,

  loading = false,

}: DepartmentDashboardProps) {



  const [search,setSearch] = useState("");

  const [status,setStatus] = useState("ALL");


  // Current Date Default

  const [date,setDate] = useState(
    new Date()
    .toISOString()
    .split("T")[0]
  );





  // ============================
  // Filtering
  // ============================


  const filteredRows = useMemo(()=>{


    return rows.filter((row)=>{


      const searchValue =
      search.toLowerCase();



      const searchMatch =

      row.patientName
      .toLowerCase()
      .includes(searchValue)

      ||

      row.uhid
      .toLowerCase()
      .includes(searchValue)

      ||

      row.accessionNo
      .toLowerCase()
      .includes(searchValue);





      const statusMatch =

      status === "ALL"

      ||

      row.status === status;





      const dateMatch =

      !date

      ||

      row.studyDate === date;





      return (

        searchMatch

        &&

        statusMatch

        &&

        dateMatch

      );


    });


  },[
    rows,
    search,
    status,
    date
  ]);








  // ============================
  // Refresh
  // ============================


  const handleRefresh = ()=>{


    setSearch("");

    setStatus("ALL");


    setDate(
      new Date()
      .toISOString()
      .split("T")[0]
    );


    onRefresh?.();


  };









  // ============================
  // Export
  // ============================


 const handleExport = () => {
  onExport?.();

  const headers = [
    "Patient",
    "UHID",
    "Accession No",
    "Study",
    "Status",
    "Date",
  ];

  const csv = [
    headers.join(","),
    ...filteredRows.map((row) =>
      [
        row.patientName,
        row.uhid,
        row.accessionNo,
        row.study,
        row.status,
        row.studyDate,
      ].join(",")
    ),
  ].join("\n");

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${title.replace(/\s+/g, "_")}.csv`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};


  // ============================
  // Default Radiology Actions
  // ============================


const defaultActions = (row: RadiologyCase) => {
  switch (row.status) {
    case "PROCESSING":
      return (
        <Button
          variant="contained"
          size="small"
          onClick={() => onVerify?.(row)}
        >
          Verify
        </Button>
      );

    case "VERIFIED":
      return (
        <Button
          variant="outlined"
          size="small"
          onClick={() => onViewReport?.(row)}
        >
          View Report
        </Button>
      );

    default:
      return null;
  }
};




return (

<>


{/* Header */}

<Box mb={3}>

<Header

title={title}

subtitle={subtitle}

description={description}

icon={icon}

/>

</Box>








{/* KPI */}

<Box mb={3}>

<DashboardStats

stats={stats}

/>

</Box>









{/* Charts */}

<Paper

elevation={0}

sx={{

p:3,

mb:3,

borderRadius:3,

border:"1px solid",

borderColor:"divider"

}}

>



<Typography

variant="h6"

fontWeight={700}

mb={3}

>

{title} Analytics

</Typography>





<Box

sx={{

display:"flex",

gap:3,

flexDirection:{

xs:"column",

lg:"row"

}

}}

>



<Box flex={1}>

<TrendChart

title={
chartConfig?.trendTitle ??
"Study Volume Trend"
}

subtitle={
chartConfig?.trendSubtitle ??
"Today's Studies"
}

data={trendData}

/>

</Box>






<Divider

orientation="vertical"

flexItem

sx={{

display:{

xs:"none",

lg:"block"

}

}}

/>







<Box flex={1}>

<StatusDistributionChart

title={
chartConfig?.statusTitle ??
"Report Status"
}

subtitle={
chartConfig?.statusSubtitle ??
"Current Workflow"
}

data={statusData}

/>

</Box>








<Divider

orientation="vertical"

flexItem

sx={{

display:{

xs:"none",

lg:"block"

}

}}

/>







<Box flex={1}>

<ReportingTimeChart

title={
chartConfig?.reportingTitle ??
"Reporting Time"
}

subtitle={
chartConfig?.reportingSubtitle ??
"Last 7 Days"
}

data={reportingData}

/>

</Box>





</Box>


</Paper>









{/* Search Toolbar */}


<SearchToolBar


search={search}


status={status}


date={date}


onSearchChange={setSearch}


onStatusChange={setStatus}


onDateChange={setDate}


onRefresh={handleRefresh}


onExport={handleExport}


/>









{/* Table */}


<RadiologyTable


rows={filteredRows}


loading={loading}


renderStatus={renderStatus}


renderActions={

renderActions ??

defaultActions

}


/>





</>


);

}