"use client";

import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import PlaylistAddCheckCircleRoundedIcon from "@mui/icons-material/PlaylistAddCheckCircleRounded";

import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";

interface EmptyStateProps {
  onRefresh?: () => void;
}

export default function EmptyState({
  onRefresh,
}: EmptyStateProps) {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <CardContent
        sx={{
          py: 8,
          px: 4,
        }}
      >
        <Stack
          spacing={3}
          alignItems="center"
          justifyContent="center"
        >
          {/* Icon */}
          <Box
            sx={{
              width: 88,
              height: 88,
              borderRadius: "50%",
              bgcolor: "#EEF4FF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PlaylistAddCheckCircleRoundedIcon
              sx={{
                fontSize: 46,
                color: "#001F54",
              }}
            />
          </Box>

          {/* Title */}
          <Stack
            spacing={1}
            textAlign="center"
          >
            <Typography
              variant="h5"
              fontWeight={700}
            >
              Queue is Empty
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              maxWidth={450}
            >
              There are currently no patients waiting for
              radiology imaging. New appointments will
              automatically appear here once they are added
              to the queue.
            </Typography>
          </Stack>

          {/* Information Cards */}
          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={2}
            width="100%"
            justifyContent="center"
          >
            <Box
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                px: 3,
                py: 2,
                minWidth: 170,
                textAlign: "center",
              }}
            >
              <Typography
                variant="h5"
                fontWeight={700}
                color="#001F54"
              >
                0
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Waiting Patients
              </Typography>
            </Box>

            <Box
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                px: 3,
                py: 2,
                minWidth: 170,
                textAlign: "center",
              }}
            >
              <Typography
                variant="h5"
                fontWeight={700}
                color="#001F54"
              >
                Ready
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                All Studies Completed
              </Typography>
            </Box>
          </Stack>

          {/* Refresh Button */}
          <Button
            variant="contained"
            startIcon={<RefreshRoundedIcon />}
            onClick={onRefresh}
            sx={{
              mt: 1,
              px: 4,
              py: 1.2,
              borderRadius: 3,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Refresh Queue
          </Button>

          {/* Footer */}
          <Typography
            variant="caption"
            color="text.secondary"
            textAlign="center"
          >
            Last checked just now. New patients will appear
            automatically when registered.
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}