"use client";

import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

import { RotateCcw } from "lucide-react";

export interface PhysicalVerificationFilterValues {
  search: string;
  status: string;
  result: string;
}

interface Props {
  filters: PhysicalVerificationFilterValues;
  onChange: (
    filters: PhysicalVerificationFilterValues
  ) => void;
  onReset: () => void;
}

export default function PhysicalVerificationFilters({
  filters,
  onChange,
  onReset,
}: Props) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          lg: "2fr 1fr 1fr auto",
        },
        gap: 2,
        mb: 3,
      }}
    >
      <TextField
        size="small"
        label="Search"
        placeholder="Item, batch or verification ID..."
        value={filters.search}
        onChange={(event) =>
          onChange({
            ...filters,
            search: event.target.value,
          })
        }
      />

      <FormControl size="small">
        <InputLabel>Status</InputLabel>

        <Select
          label="Status"
          value={filters.status}
          onChange={(event) =>
            onChange({
              ...filters,
              status: event.target.value,
            })
          }
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Pending">
            Pending
          </MenuItem>
          <MenuItem value="In Progress">
            In Progress
          </MenuItem>
          <MenuItem value="Completed">
            Completed
          </MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small">
        <InputLabel>Result</InputLabel>

        <Select
          label="Result"
          value={filters.result}
          onChange={(event) =>
            onChange({
              ...filters,
              result: event.target.value,
            })
          }
        >
          <MenuItem value="">All</MenuItem>

          <MenuItem value="Matched">
            Matched
          </MenuItem>

          <MenuItem value="Variance Found">
            Variance Found
          </MenuItem>
        </Select>
      </FormControl>

      <Button
        variant="outlined"
        startIcon={<RotateCcw size={17} />}
        onClick={onReset}
      >
        Reset
      </Button>
    </Box>
  );
}