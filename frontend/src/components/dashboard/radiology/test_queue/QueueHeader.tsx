"use client";

import { useEffect, useState } from "react";

import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";

import {
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Stack,
  Typography,
} from "@mui/material";

interface QueueHeaderProps {
  onRefresh: () => void;
  onExport: () => void;
}

export default function QueueHeader({
  onRefresh,
  onExport,
}: QueueHeaderProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const currentDate = now.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const currentTime = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="surface-card p-6">
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
        spacing={3}
      >
        <Box>
          <Breadcrumbs sx={{ mb: 1, fontSize: 13 }}>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Radiology
            </Typography>

            <Typography
              variant="body2"
              color="primary"
              fontWeight={600}
            >
              Queue
            </Typography>
          </Breadcrumbs>

          <Typography
            variant="h4"
            fontWeight={700}
            lineHeight={1.2}
          >
            Radiology Queue
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            mt={1}
          >
            Manage radiology orders, monitor scan progress,
            review reporting status, and track verified studies.
          </Typography>
        </Box>

        <Stack
          spacing={2}
          alignItems={{ xs: "flex-start", md: "flex-end" }}
        >
          <Stack
            direction="row"
            spacing={1.5}
            flexWrap="wrap"
          >
            <Chip
              icon={<CalendarTodayRoundedIcon />}
              label={currentDate}
              variant="outlined"
              sx={{ fontWeight: 500 }}
            />

            <Chip
              icon={<AccessTimeRoundedIcon />}
              label={currentTime}
              variant="outlined"
              color="primary"
              sx={{
                fontWeight: 600,
                minWidth: 125,
              }}
            />
          </Stack>

          <Stack direction="row" spacing={1.5}>
            <Button
              variant="outlined"
              startIcon={<RefreshRoundedIcon />}
              onClick={onRefresh}
              aria-label="Refresh radiology queue"
              sx={{
                textTransform: "none",
                borderRadius: 2,
              }}
            >
              Refresh
            </Button>

            <Button
              variant="contained"
              startIcon={<FileUploadOutlinedIcon />}
              onClick={onExport}
              aria-label="Export radiology queue"
              sx={{
                textTransform: "none",
                borderRadius: 2,
              }}
            >
              Export Queue
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </div>
  );
}
