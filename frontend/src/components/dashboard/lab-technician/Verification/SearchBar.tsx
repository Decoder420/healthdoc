
"use client";

import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";

import {
  Card,
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
    <Card
      elevation={0}
      className="surface-card"
      sx={{
        mb: 2,
        p: 1,
        border: "none",
        borderRadius: 2,
        boxShadow: "none",
        overflow: "hidden",
      }}
    >
      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        spacing={1}
        alignItems={{
          xs: "stretch",
          sm: "center",
        }}
      >
        {/* Search */}
        <TextField
          fullWidth
          size="small"
          placeholder="Search by Order ID / Patient Name / UHID / Barcode / Report No."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon
                  sx={{
                    fontSize: 17,
                    color: "text.secondary",
                  }}
                />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              height: 32,
              borderRadius: 1.25,
              fontSize: "0.8rem",
            },

            "& .MuiInputBase-input": {
              py: 0,
              px: 0.5,
            },

            "& .MuiInputBase-input::placeholder": {
              opacity: 0.7,
            },
          }}
        />

        {/* Refresh */}
        <Button
          variant="outlined"
          size="small"
          startIcon={
            <RefreshIcon
              sx={{
                fontSize: 17,
              }}
            />
          }
          onClick={onRefresh}
          sx={{
            minWidth: 95,
            height: 32,
            px: 1.5,
            borderRadius: 1.25,
            textTransform: "none",
            fontSize: "0.8rem",
            fontWeight: 600,
            whiteSpace: "nowrap",
          }}
        >
          Refresh
        </Button>
      </Stack>
    </Card>
  );
}
