"use client";

import {
  Box,
  Button,
  MenuItem,
  TextField,
} from "@mui/material";

import type {
  StockTransactionType,
} from "@/features/inventory/types/stockTransaction";

export interface TransactionHistoryFilterValues {
  search: string;
  transactionType: StockTransactionType | "";
  performedBy: string;
  dateFrom: string;
  dateTo: string;
}

interface Props {
  filters: TransactionHistoryFilterValues;
  onChange: (
    filters: TransactionHistoryFilterValues
  ) => void;
  onReset: () => void;
}

const transactionTypes: {
  value: StockTransactionType;
  label: string;
}[] = [
  {
    value: "purchase",
    label: "Purchase",
  },
  {
    value: "issue",
    label: "Issue",
  },
  {
    value: "return",
    label: "Return",
  },
  {
    value: "transfer",
    label: "Transfer",
  },
  {
    value: "consumption",
    label: "Consumption",
  },
  {
    value: "adjustment",
    label: "Adjustment",
  },
  {
    value: "write_off",
    label: "Write-off",
  },
];

export default function TransactionHistoryFilters({
  filters,
  onChange,
  onReset,
}: Props) {
  const updateFilter = <
    K extends keyof TransactionHistoryFilterValues
  >(
    key: K,
    value: TransactionHistoryFilterValues[K]
  ) => {
    onChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <Box
      display="grid"
      gridTemplateColumns={{
        xs: "1fr",
        sm: "repeat(2, 1fr)",
        lg: "2fr 1fr 1fr 1fr 1fr auto",
      }}
      gap={2}
      alignItems="center"
    >
      <TextField
        size="small"
        label="Search"
        placeholder="Item, transaction ID, reference..."
        value={filters.search}
        onChange={(event) =>
          updateFilter(
            "search",
            event.target.value
          )
        }
      />

      <TextField
        select
        size="small"
        label="Transaction Type"
        value={filters.transactionType}
        onChange={(event) =>
          updateFilter(
            "transactionType",
            event.target.value as
              | StockTransactionType
              | ""
          )
        }
      >
        <MenuItem value="">
          All Types
        </MenuItem>

        {transactionTypes.map((type) => (
          <MenuItem
            key={type.value}
            value={type.value}
          >
            {type.label}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        size="small"
        label="Performed By"
        placeholder="User ID"
        value={filters.performedBy}
        onChange={(event) =>
          updateFilter(
            "performedBy",
            event.target.value
          )
        }
      />

      <TextField
        size="small"
        type="date"
        label="From"
        value={filters.dateFrom}
        onChange={(event) =>
          updateFilter(
            "dateFrom",
            event.target.value
          )
        }
        InputLabelProps={{
          shrink: true,
        }}
      />

      <TextField
        size="small"
        type="date"
        label="To"
        value={filters.dateTo}
        onChange={(event) =>
          updateFilter(
            "dateTo",
            event.target.value
          )
        }
        InputLabelProps={{
          shrink: true,
        }}
      />

      <Button
        variant="outlined"
        onClick={onReset}
      >
        Reset
      </Button>
    </Box>
  );
}