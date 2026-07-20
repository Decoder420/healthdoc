"use client";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ScienceRoundedIcon from "@mui/icons-material/ScienceRounded";

import {
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";

interface SampleCollectionHeaderProps {
  onCollectSample: () => void;
}

export default function SampleCollectionHeader({
  onCollectSample,
}: SampleCollectionHeaderProps) {
  return (
    <Box
      sx={{
        mb: 3,
        p: 3,
        borderRadius: 3,
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        alignItems={{ xs: "flex-start", md: "center" }}
        justifyContent="space-between"
      >
        {/* Left Section */}
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "primary.main",
              color: "primary.contrastText",
            }}
          >
            <ScienceRoundedIcon />
          </Box>

          <Box>
            <Typography variant="h5" fontWeight={700}>
              Sample Collection
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Collect laboratory samples, generate barcodes, and
              manage collected specimens.
            </Typography>
          </Box>
        </Stack>

        {/* Right Section */}
        <Button
          variant="contained"
          size="large"
          startIcon={<AddRoundedIcon />}
          onClick={onCollectSample}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1.2,
            textTransform: "none",
            fontWeight: 600,
            minWidth: 190,
          }}
        >
          Collect Sample
        </Button>
      </Stack>
    </Box>
  );
}