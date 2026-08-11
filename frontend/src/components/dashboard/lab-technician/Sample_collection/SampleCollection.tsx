"use client";

import {
  Box,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

export interface SampleInformationData {
  sampleType: string;
  container: string;
  priority: string;
  collectionDate: string;
  collectionTime: string;
  collectedBy: string;
}

interface SampleInformationProps {
  value: SampleInformationData;
  onChange: (value: SampleInformationData) => void;
}

export default function SampleInformation({
  value,
  onChange,
}: SampleInformationProps) {
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const now = new Date();

    const date = now.toISOString().split("T")[0];
    const time = now.toTimeString().slice(0, 5);

    setCurrentDate(
      now.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    );

    setCurrentTime(
      now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    );

    onChange({
      ...value,
      collectionDate: date,
      collectionTime: time,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange =
    (field: keyof SampleInformationData) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement
      >
    ) => {
      onChange({
        ...value,
        [field]: event.target.value,
      });
    };

  // Compact input styling
  const fieldSx = {
    "& .MuiInputBase-root": {
      minHeight: 36,
      height: 36,
      fontSize: "0.875rem",
    },

    "& .MuiInputBase-input": {
      padding: "7px 12px",
    },

    "& .MuiInputLabel-root": {
      fontSize: "0.875rem",
    },

    "& .MuiInputLabel-shrink": {
      fontSize: "0.75rem",
    },

    "& .MuiSelect-select": {
      padding: "7px 12px",
      minHeight: "unset",
      display: "flex",
      alignItems: "center",
    },
  };

  return (
    <Paper
      elevation={0}
      className="surface-card"
      sx={{
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2.5,
          py: 1.5,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography
          variant="subtitle1"
          fontWeight={700}
          sx={{
            lineHeight: 1.3,
          }}
        >
          Sample Information
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: "block",
            mt: 0.25,
          }}
        >
          Enter sample details and collection information
        </Typography>
      </Box>

      {/* Form */}
      <Box
        sx={{
          px: 2.5,
          py: 2,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            lg: "repeat(3, minmax(0, 1fr))",
          },
          columnGap: 1.75,
          rowGap: 1.5,
        }}
      >
        <TextField
          select
          size="small"
          label="Sample Type"
          value={value.sampleType}
          onChange={handleChange("sampleType")}
          fullWidth
          sx={fieldSx}
        >
          <MenuItem value="Blood">Blood</MenuItem>
          <MenuItem value="Urine">Urine</MenuItem>
          <MenuItem value="Stool">Stool</MenuItem>
          <MenuItem value="Serum">Serum</MenuItem>
          <MenuItem value="Plasma">Plasma</MenuItem>
        </TextField>

        <TextField
          select
          size="small"
          label="Container"
          value={value.container}
          onChange={handleChange("container")}
          fullWidth
          sx={fieldSx}
        >
          <MenuItem value="EDTA Tube">EDTA Tube</MenuItem>
          <MenuItem value="Plain Tube">Plain Tube</MenuItem>
          <MenuItem value="Fluoride Tube">
            Fluoride Tube
          </MenuItem>
          <MenuItem value="Citrate Tube">
            Citrate Tube
          </MenuItem>
        </TextField>

        <TextField
          select
          size="small"
          label="Priority"
          value={value.priority}
          onChange={handleChange("priority")}
          fullWidth
          sx={fieldSx}
        >
          <MenuItem value="Routine">Routine</MenuItem>
          <MenuItem value="Urgent">Urgent</MenuItem>
          <MenuItem value="STAT">STAT</MenuItem>
        </TextField>

        <TextField
          size="small"
          label="Collection Date"
          value={currentDate}
          InputProps={{
            readOnly: true,
          }}
          fullWidth
          sx={fieldSx}
        />

        <TextField
          size="small"
          label="Collection Time"
          value={currentTime}
          InputProps={{
            readOnly: true,
          }}
          fullWidth
          sx={fieldSx}
        />

        <TextField
          size="small"
          label="Collected By"
          required
          value={value.collectedBy}
          onChange={handleChange("collectedBy")}
          fullWidth
          sx={fieldSx}
        />
      </Box>
    </Paper>
  );
}
