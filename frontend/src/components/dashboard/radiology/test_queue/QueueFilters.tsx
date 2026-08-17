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
    <div className="surface-card p-3 mb-3">
      <Stack
        direction={{
          xs: "column",
          lg: "row",
        }}
        spacing={1.5}
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
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{
            flex: 1,
            "& .MuiOutlinedInput-root": {
              height: 34,
              fontSize: 13,
            },
          }}
        />

        {/* Modality */}
        <TextField
          select
          size="small"
          value={modality}
          onChange={(e) => onModalityChange(e.target.value)}
          sx={{
            minWidth: 145,
            "& .MuiOutlinedInput-root": {
              height: 34,
              fontSize: 13,
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
          onChange={(e) => onPriorityChange(e.target.value)}
          sx={{
            minWidth: 145,
            "& .MuiOutlinedInput-root": {
              height: 34,
              fontSize: 13,
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
          onChange={(e) => onStatusChange(e.target.value)}
          sx={{
            minWidth: 155,
            "& .MuiOutlinedInput-root": {
              height: 34,
              fontSize: 13,
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
          size="small"
          startIcon={
            <RestartAltRoundedIcon fontSize="small" />
          }
          onClick={onReset}
          sx={{
            minWidth: 100,
            height: 34,
            px: 1.5,
            textTransform: "none",
            whiteSpace: "nowrap",
            borderRadius: 1.5,
            fontSize: 13,
          }}
        >
          Reset
        </Button>
      </Stack>
    </div>
  );
}