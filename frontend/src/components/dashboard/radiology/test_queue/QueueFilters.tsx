"use client";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";

import {
  Button,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";

import { QUEUE_STATUS_FILTERS } from "./DummyData";

interface Props {
  search: string;
  modality: string;
  priority: string;
  status: string;

  onSearchChange: (value: string) => void;
  onModalityChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onReset: () => void;
}

const modalities = [
  "All",
  "CT",
  "MRI",
  "X-Ray",
  "USG",
  "Mammography",
  "ECG",
];

const priorities = [
  "All",
  "Emergency",
  "Urgent",
  "Routine",
];

export default function QueueFilters({
  search,
  modality,
  priority,
  status,
  onSearchChange,
  onModalityChange,
  onPriorityChange,
  onStatusChange,
  onReset,
}: Props) {
  return (
    <div className="surface-card px-3 py-3 mb-3">
      <Stack
        direction={{
          xs: "column",
          lg: "row",
        }}
        spacing={2}
        alignItems={{
          lg: "center",
        }}
      >
        {/* Search */}
        <TextField
          fullWidth
          size="small"
          placeholder="Search Patient / UHID / Accession No. / Order ID"
          value={search}
          onChange={(e) =>
            onSearchChange(e.target.value)
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon fontSize="small" />
              </InputAdornment>
            ),
            sx: {
              height: 40,
            },
          }}
        />

        {/* Modality */}
        <TextField
          select
          size="small"
          value={modality}
          onChange={(e) =>
            onModalityChange(e.target.value)
          }
          sx={{
            minWidth: 160,
            "& .MuiOutlinedInput-root": {
              height: 40,
            },
          }}
        >
          {modalities.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </TextField>

        {/* Priority */}
        <TextField
          select
          size="small"
          value={priority}
          onChange={(e) =>
            onPriorityChange(e.target.value)
          }
          sx={{
            minWidth: 160,
            "& .MuiOutlinedInput-root": {
              height: 40,
            },
          }}
        >
          {priorities.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </TextField>

        {/* Status */}
        <TextField
          select
          size="small"
          value={status}
          onChange={(e) =>
            onStatusChange(e.target.value)
          }
          sx={{
            minWidth: 170,
            "& .MuiOutlinedInput-root": {
              height: 40,
            },
          }}
        >
          {QUEUE_STATUS_FILTERS.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </TextField>

        {/* Reset */}
        <Button
          variant="outlined"
          startIcon={
            <RestartAltRoundedIcon fontSize="small" />
          }
          onClick={onReset}
          sx={{
            minWidth: 110,
            height: 40,
            px: 2,
            textTransform: "none",
            whiteSpace: "nowrap",
            borderRadius: 2,
          }}
        >
          Reset
        </Button>
      </Stack>
    </div>
  );
}