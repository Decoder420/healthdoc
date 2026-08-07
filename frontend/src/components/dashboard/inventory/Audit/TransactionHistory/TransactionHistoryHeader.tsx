"use client";

import { Box, Typography } from "@mui/material";
import { History } from "lucide-react";

export default function TransactionHistoryHeader() {
  return (
    <Box
      display="flex"
      alignItems="center"
      gap={1.5}
    >
      <History size={28} />

      <Box>
        <Typography
          variant="h5"
          fontWeight={700}
        >
          Transaction History
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
        >
          View the complete audit trail of inventory
          transactions and stock movements.
        </Typography>
      </Box>
    </Box>
  );
}