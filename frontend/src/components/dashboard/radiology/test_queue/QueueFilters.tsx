"use client";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";

import {
  Button,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  TextField,
} from "@mui/material";

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
  onSearchChange,
  onModalityChange,
  onPriorityChange,
  onStatusChange,
  onReset,
}: Props) {
  return (
    <Paper
      elevation={0}
      sx={{
  px: 2,
  py: 1.5,
  borderRadius: 4,
  border: "1px solid",
  borderColor: "divider",
}}
    >
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
  placeholder="Search Patient / UHID / Token"
  value={search}
  onChange={(e) => onSearchChange(e.target.value)}
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
  onChange={(e) => onModalityChange(e.target.value)}
  sx={{
    minWidth: 160,
    "& .MuiOutlinedInput-root": {
      height: 40,
    },
  }}
>
          {modalities.map((item) => (
            <MenuItem
              key={item}
              value={item}
            >
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
            <MenuItem
              key={item}
              value={item}
            >
              {item}
            </MenuItem>
          ))}
        </TextField>

        <Button
  variant="outlined"
  startIcon={<RestartAltRoundedIcon fontSize="small" />}
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
    </Paper>
  );
}