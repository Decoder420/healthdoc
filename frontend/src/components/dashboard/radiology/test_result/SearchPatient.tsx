"use client";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

import {
  Autocomplete,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

export interface PatientSearchOption {
  id: string;
  patientName: string;
  uhid: string;
  accessionNumber: string;
  orderId: string;
}

interface SearchPatientProps {
  search: string;
  patients: PatientSearchOption[];
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  disabled?: boolean;
}

export default function SearchPatient({
  search,
  patients,
  onSearchChange,
  onSearch,
  disabled = false,
}: SearchPatientProps) {
  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Stack spacing={2}>
        <Typography variant="h6" fontWeight={600}>
          Search Patient
        </Typography>

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems="stretch"
        >
          <Autocomplete
            fullWidth
            freeSolo
            disabled={disabled}
            options={patients}
            value={null}
            inputValue={search}
            onInputChange={(_, value) => {
              if (!disabled) {
                onSearchChange(value);
              }
            }}
            getOptionLabel={(option) =>
              typeof option === "string"
                ? option
                : `${option.patientName} • ${option.uhid} • ${option.accessionNumber}`
            }
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                <Stack spacing={0.25}>
                  <Typography fontWeight={600}>
                    {option.patientName}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    UHID : {option.uhid}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Accession : {option.accessionNumber}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Order ID : {option.orderId}
                  </Typography>
                </Stack>
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search by Patient Name, UHID, Accession Number or Order ID"
              />
            )}
          />

          <Button
            variant="contained"
            disabled={disabled}
            startIcon={<SearchRoundedIcon />}
            onClick={onSearch}
            sx={{
              minWidth: 140,
            }}
          >
            Search
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}