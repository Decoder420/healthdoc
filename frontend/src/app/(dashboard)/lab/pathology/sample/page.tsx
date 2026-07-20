"use client";

import { useState } from "react";

import { Box } from "@mui/material";

import SampleCollectionHeader from "@/components/dashboard/lab-technician/Sample_collection/Header";
import SampleKPICards from "@/components/dashboard/lab-technician/Sample_collection/cards"
import SampleCollectionTable from "@/components/dashboard/lab-technician/Sample_collection/Table";
import CollectSampleDialog from "@/components/dashboard/lab-technician/Sample_collection/SampleDialog"

export default function SampleCollectionPage() {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <Box p={3}>
      <SampleCollectionHeader
        onCollectSample={() => setOpenDialog(true)}
      />

      <SampleKPICards />

      <SampleCollectionTable />

      <CollectSampleDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      />
    </Box>
  );
}