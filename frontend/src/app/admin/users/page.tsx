"use client";

import Box from "@mui/material/Box";

import { UsersWorkspace } from "@/features/admin";

export default function Page() {
  return (
    <Box sx={{ mx: "auto", maxWidth: 1280, px: { xs: 2, md: 3 }, py: 3 }}>
      <UsersWorkspace />
    </Box>
  );
}
