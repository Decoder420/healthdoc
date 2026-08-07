"use client";

import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";

import {
  Box,
  Button,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
}

export default function SearchBar({
  search,
  onSearchChange,
  onRefresh,
}: Props) {
  return (
    <Box mb={3}>
      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        spacing={2}
        alignItems="center"
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Search by Order ID / Patient Name / UHID / Barcode / Report No."
          value={search}
          onChange={(e) =>
            onSearchChange(e.target.value)
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              height: 40,
            },
          }}
        />

        <Button
          variant="outlined"
          size="medium"
          startIcon={<RefreshIcon />}
          onClick={onRefresh}
          sx={{
            minWidth: 120,
            height: 40,
            whiteSpace: "nowrap",
          }}
        >
          Refresh
        </Button>
      </Stack>
    </Box>
  );
}