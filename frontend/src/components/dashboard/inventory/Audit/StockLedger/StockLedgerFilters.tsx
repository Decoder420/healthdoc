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

export interface StockLedgerFilterValues {
  search: string;
  transactionType: string;
  referenceType: string;
  date: string;
}

interface Props {
  filters: StockLedgerFilterValues;
  onChange: (filters: StockLedgerFilterValues) => void;
  onReset: () => void;
}

export default function StockLedgerFilters({
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
          lg: "2fr 1fr 1fr 1fr auto",
        },
        gap: 2,
        mb: 3,
      }}
    >
      <TextField
        size="small"
        label="Search"
        placeholder="Item, batch or reference..."
        value={filters.search}
        onChange={(event) =>
          onChange({
            ...filters,
            search: event.target.value,
          })
        }
      />

      <FormControl size="small">
        <InputLabel>Transaction</InputLabel>

        <Select
          label="Transaction"
          value={filters.transactionType}
          onChange={(event) =>
            onChange({
              ...filters,
              transactionType: event.target.value,
            })
          }
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="purchase">Purchase</MenuItem>
          <MenuItem value="issue">Issue</MenuItem>
          <MenuItem value="return">Return</MenuItem>
          <MenuItem value="transfer">Transfer</MenuItem>
          <MenuItem value="consumption">Consumption</MenuItem>
          <MenuItem value="adjustment">Adjustment</MenuItem>
          <MenuItem value="write_off">Write Off</MenuItem>
        </Select>
      </FormControl>

      <TextField
        size="small"
        label="Reference Type"
        placeholder="e.g. GRN"
        value={filters.referenceType}
        onChange={(event) =>
          onChange({
            ...filters,
            referenceType: event.target.value,
          })
        }
      />

      <TextField
        size="small"
        type="date"
        label="Date"
        InputLabelProps={{ shrink: true }}
        value={filters.date}
        onChange={(event) =>
          onChange({
            ...filters,
            date: event.target.value,
          })
        }
      />

      <Button
        variant="outlined"
        startIcon={<RotateCcw size={17} />}
        onClick={onReset}
        sx={{ minWidth: 110 }}
      >
        Reset
      </Button>
    </Box>
  );
}