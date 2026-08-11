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

import { LabPatientOrder } from "@/lib/mock/lab_data";

interface Props {
  search: string;
  patients: LabPatientOrder[];
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
}: Props) {
  /*
   * Only COMPLETED patients should appear
   * in the autocomplete.
   */
  const completedPatients = patients.filter(
    (patient) => patient.status === "COMPLETED"
  );

  return (
    <Paper
      elevation={0}
      className="surface-card"
      sx={{
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2.5,
          py: 1.5,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography
          variant="subtitle1"
          fontWeight={700}
          sx={{
            lineHeight: 1.3,
          }}
        >
          Search Patient
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: "block",
            mt: 0.25,
          }}
        >
          Search completed reports using Order ID, patient name,
          UHID, or barcode
        </Typography>
      </Box>

      {/* Search Area */}
      <Box
        sx={{
          px: 2.5,
          py: 2,
        }}
      >
        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={1.25}
          alignItems={{
            xs: "stretch",
            sm: "center",
          }}
        >
          <Autocomplete<LabPatientOrder, false, false, true>
            fullWidth
            freeSolo
            disabled={disabled}
            size="small"
            options={completedPatients}
            inputValue={search}
            onChange={(_, value) => {
              if (disabled) {
                return;
              }

              /*
               * Because freeSolo is enabled, value can be:
               * - LabPatientOrder
               * - string
               * - null
               */
              if (value && typeof value !== "string") {
                onSearchChange(value.order.orderId);

                // Immediately load the selected patient
                // through the normal search handler.
                setTimeout(() => {
                  onSearchChange(value.order.orderId);
                }, 0);
              }
            }}
            onInputChange={(_, value, reason) => {
              if (disabled) {
                return;
              }

              if (
                reason === "input" ||
                reason === "clear"
              ) {
                onSearchChange(value);
              }
            }}
            isOptionEqualToValue={(option, value) => {
              if (typeof value === "string") {
                return false;
              }

              return (
                option.order.orderId ===
                value.order.orderId
              );
            }}
            getOptionLabel={(option) => {
              if (typeof option === "string") {
                return option;
              }

              return `${option.patient.name} - ${option.order.orderId}`;
            }}
            filterOptions={(options, state) => {
              const value = state.inputValue
                .toLowerCase()
                .trim();

              if (!value) {
                return options;
              }

              return options.filter((item) => {
                return (
                  item.order.orderId
                    .toLowerCase()
                    .includes(value) ||
                  item.patient.name
                    .toLowerCase()
                    .includes(value) ||
                  item.patient.uhid
                    .toLowerCase()
                    .includes(value) ||
                  item.sample.barcode
                    .toLowerCase()
                    .includes(value)
                );
              });
            }}
            renderOption={(props, option) => (
              <Box
                component="li"
                {...props}
                sx={{
                  px: 1.5,
                  py: 1,
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    minWidth: 0,
                  }}
                >
                  {/* Patient */}
                  <Typography
                    variant="body2"
                    fontWeight={700}
                    noWrap
                  >
                    {option.patient.name}
                  </Typography>

                  {/* Details */}
                  <Stack
                    direction="row"
                    spacing={1}
                    flexWrap="wrap"
                    sx={{
                      mt: 0.35,
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Order: {option.order.orderId}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.disabled"
                    >
                      •
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      UHID: {option.patient.uhid}
                    </Typography>
                  </Stack>

                  {/* Barcode */}
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      display: "block",
                      mt: 0.2,
                    }}
                  >
                    Barcode: {option.sample.barcode || "-"}
                  </Typography>

                  {/* Status */}
                  <Typography
                    variant="caption"
                    color="success.main"
                    sx={{
                      display: "block",
                      mt: 0.2,
                      fontWeight: 600,
                    }}
                  >
                    Status: COMPLETED
                  </Typography>
                </Box>
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={
                  disabled
                    ? "Patient loaded from Order ID"
                    : "Search Order ID, Name, UHID or Barcode"
                }
                size="small"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <SearchRoundedIcon
                        sx={{
                          ml: 0.5,
                          mr: 0.75,
                          fontSize: 19,
                          color: "text.secondary",
                        }}
                      />

                      {params.InputProps.startAdornment}
                    </>
                  ),
                }}
              />
            )}
            sx={{
              minWidth: 0,

              "& .MuiOutlinedInput-root": {
                minHeight: 38,
                height: 38,
                py: 0,
                fontSize: "0.875rem",
              },

              "& .MuiInputBase-input": {
                py: "8px !important",
              },

              "& .MuiAutocomplete-endAdornment": {
                right: 6,
              },
            }}
          />

          <Button
            variant="contained"
            startIcon={<SearchRoundedIcon />}
            onClick={onSearch}
            disabled={disabled}
            sx={{
              flexShrink: 0,
              minWidth: 105,
              height: 38,
              px: 2,
              borderRadius: 1.5,
              textTransform: "none",
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            Search
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
}
