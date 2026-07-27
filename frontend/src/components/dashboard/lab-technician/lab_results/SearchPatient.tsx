"use client";

import SearchIcon from "@mui/icons-material/Search";

import {
  Autocomplete,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { PatientSearchOption } from "./types";

interface Props {
  search: string;
  patients: PatientSearchOption[];
  onSearchChange: (value: string) => void;
  onSearch: () => void;
}

export default function SearchPatient({
  search,
  patients,
  onSearchChange,
  onSearch,
}: Props) {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 3,
      }}
    >
      <Typography
        variant="h6"
        fontWeight={600}
        mb={2}
      >
        Search Patient
      </Typography>

      <Stack
        direction={{
          xs: "column",
          md: "row",
        }}
        spacing={2}
      >
       <Autocomplete
  fullWidth
  freeSolo
  size="small"
  options={patients}
  inputValue={search}
  onInputChange={(_, value) =>
    onSearchChange(value)
  }
  getOptionLabel={(option) =>
    typeof option === "string"
      ? option
      : option.name
  }
  filterOptions={(options, state) => {
    const value =
      state.inputValue.toLowerCase();

    return options.filter(
      (patient) =>
        patient.name
          .toLowerCase()
          .includes(value) ||
        patient.uhid
          .toLowerCase()
          .includes(value) ||
        patient.barcode
          .toLowerCase()
          .includes(value)
    );
  }}
  renderOption={(props, option) => (
    <Box component="li" {...props}>
      <Box>
        <Typography fontWeight={600}>
          {option.name}
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
        >
          UHID: {option.uhid}
        </Typography>

        <br />

        <Typography
          variant="caption"
          color="text.secondary"
        >
          Barcode: {option.barcode}
        </Typography>
      </Box>
    </Box>
  )}
  renderInput={(params) => (
    <TextField
      {...params}
      placeholder="Search by Patient Name, UHID or Barcode"
      size="small"
    />
  )}
  sx={{
    "& .MuiOutlinedInput-root": {
      height: 38,
    },
  }}
/>

       <Button
  variant="contained"
  startIcon={<SearchIcon />}
  onClick={onSearch}
  sx={{
    minWidth: 120,
    height: 38,
    px: 2,
    borderRadius: 2,
    textTransform: "none",
    whiteSpace: "nowrap",
    flexShrink: 0,
  }}
>
  Search
</Button>
      </Stack>
    </Paper>
  );
}