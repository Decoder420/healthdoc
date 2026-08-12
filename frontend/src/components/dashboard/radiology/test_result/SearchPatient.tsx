"use client";

import { useState } from "react";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

import {
  Autocomplete,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { useSearchParams } from "next/navigation";

import type {
  PatientSearchOption,
} from "./types";

interface SearchPatientProps {
  search: string;

  patients: PatientSearchOption[];

  onSearchChange: (
    value: string
  ) => void;

  onSearch: (
    patient: PatientSearchOption
  ) => void;
}

export default function SearchPatient({
  search,
  patients,
  onSearchChange,
  onSearch,
}: SearchPatientProps) {
  const searchParams = useSearchParams();

  const accessionNumber =
    searchParams.get("accessionNumber");

  // Disable manual search when opened from accession URL
  const disabled = Boolean(accessionNumber);

  const [
    selectedPatient,
    setSelectedPatient,
  ] = useState<PatientSearchOption | null>(
    null
  );

  // Show only Processing studies
  const processingPatients =
    patients.filter(
      (patient) =>
        patient.status === "Processing"
    );

  const handleSearch = () => {
    // If user selected from dropdown
    if (selectedPatient) {
      onSearch(selectedPatient);
      return;
    }

    const keyword = search
      .toLowerCase()
      .trim();

    if (!keyword) return;

    const patient =
      processingPatients.find(
        (item) =>
          item.patientName
            .toLowerCase()
            .includes(keyword) ||
          item.uhid
            .toLowerCase()
            .includes(keyword) ||
          item.orderId
            .toLowerCase()
            .includes(keyword) ||
          item.accessionNumber
            .toLowerCase()
            .includes(keyword)
      );

    if (patient) {
      setSelectedPatient(patient);
      onSearch(patient);
    }
  };

  return (
    <Box className="surface-card">
      <Box sx={{ p: 1.75 }}>
        <Typography
          variant="subtitle1"
          fontWeight={700}
          mb={1.25}
        >
          Search Patient
        </Typography>

        <Stack
          direction={{
            xs: "column",
            md: "row",
          }}
          spacing={1.25}
          alignItems={{
            md: "center",
          }}
        >
          <Autocomplete
            fullWidth
            size="small"
            disabled={disabled}
            options={processingPatients}
            value={selectedPatient}
            inputValue={search}
            onChange={(_, value) => {
              setSelectedPatient(value);
            }}
            onInputChange={(_, value) => {
              if (!disabled) {
                onSearchChange(value);
              }
            }}
            getOptionLabel={(option) =>
              `${option.patientName} • ${option.uhid} • ${option.accessionNumber}`
            }
            renderOption={(props, option) => {
              const {
                key,
                ...optionProps
              } = props;

              return (
                <Box
                  key={key}
                  component="li"
                  {...optionProps}
                >
                  <Stack spacing={0.35}>
                    <Typography
                      fontWeight={600}
                      fontSize={13}
                    >
                      {option.patientName}
                    </Typography>

                    <Typography
                      variant="body2"
                      fontSize={12}
                    >
                      UHID: {option.uhid}
                    </Typography>

                    <Typography
                      variant="body2"
                      fontSize={12}
                    >
                      Accession:{" "}
                      {option.accessionNumber}
                    </Typography>

                    <Typography
                      variant="body2"
                      fontSize={12}
                    >
                      Order ID: {option.orderId}
                    </Typography>

                    <Typography
                      variant="body2"
                      fontSize={12}
                      color="primary"
                      fontWeight={600}
                    >
                      Status: {option.status}
                    </Typography>
                  </Stack>
                </Box>
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={
                  disabled
                    ? "Search disabled for opened study"
                    : "Search Patient / UHID / Accession / Order ID"
                }
                InputProps={{
                  ...params.InputProps,
                  readOnly: disabled,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: 34,
                    minHeight: 34,
                    py: 0,
                  },

                  "& .MuiOutlinedInput-input": {
                    py: 0.5,
                    fontSize: 13,
                  },

                  "& .MuiAutocomplete-input": {
                    minHeight: "unset",
                  },

                  "& .MuiInputAdornment-root": {
                    margin: 0,
                  },
                }}
              />
            )}
          />

          <Button
            variant="contained"
            size="small"
            startIcon={
              <SearchRoundedIcon fontSize="small" />
            }
            disabled={disabled}
            onClick={handleSearch}
            sx={{
              minWidth: 110,
              height: 34,
              px: 1.75,
              textTransform: "none",
              whiteSpace: "nowrap",
              borderRadius: 1.5,
              fontSize: 13,
            }}
          >
            Search
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}