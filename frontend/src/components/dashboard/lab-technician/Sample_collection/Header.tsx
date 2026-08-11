"use client";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ScienceRoundedIcon from "@mui/icons-material/ScienceRounded";

import {
  Box,
  Button,
  Card,
  CardContent,
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
    <Card
      elevation={0}
      className="surface-card"
      sx={{
        mb: 3,
        overflow: "hidden",
      }}
    >
      <CardContent
        sx={{
          p: 2.5,
          "&:last-child": {
            pb: 2.5,
          },
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{
            xs: "flex-start",
            md: "center",
          }}
          justifyContent="space-between"
        >
          {/* Left Section */}
          <Stack
            direction="row"
            spacing={1.75}
            alignItems="center"
            minWidth={0}
          >
            {/* Icon */}
            <Box
              sx={{
                width: 46,
                height: 46,
                flexShrink: 0,
                borderRadius: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "primary.main",
                color: "primary.contrastText",
              }}
            >
              <ScienceRoundedIcon fontSize="small" />
            </Box>

            {/* Title */}
            <Box minWidth={0}>
              <Typography
                variant="subtitle1"
                fontWeight={700}
                sx={{
                  lineHeight: 1.3,
                }}
              >
                Sample Collection
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: "block",
                  mt: 0.35,
                  lineHeight: 1.4,
                }}
              >
                Collect laboratory samples, generate barcodes,
                and manage collected specimens.
              </Typography>
            </Box>
          </Stack>

          {/* Right Section */}
          <Button
            variant="contained"
            size="small"
            startIcon={<AddRoundedIcon fontSize="small" />}
            onClick={onCollectSample}
            sx={{
              flexShrink: 0,
              height: 36,
              px: 2,
              borderRadius: 1.5,
              textTransform: "none",
              fontWeight: 600,
              whiteSpace: "nowrap",
              boxShadow: "none",
            }}
          >
            Collect Sample
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
