"use client";

import {
  Autocomplete,
  Box,
  TextField,
  Typography,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

import { patients } from "@/lib/mock/lab_data";

export interface Patient {
  id: string;
  uhid: string;
  patientName: string;
  age: number;
  gender: string;
  mobile: string;
  doctor: string;
  department: string;
  tests: string[];
}

/** One option per patient — mock data can include multiple visits/orders. */
const patientOptions: Patient[] = patients.map((p) => ({
  id: p.order.orderId,
  uhid: p.patient.uhid,
  patientName: p.patient.name,
  age: p.patient.age,
  gender: p.patient.gender,
  mobile: p.patient.mobile,
  doctor: p.doctor.name,
  department: p.doctor.department,
  tests: p.requestedTests,
}));

interface PatientSearchProps {
  value: Patient | null;
  onChange: (patient: Patient | null) => void;
  disabled?: boolean;
}

export default function PatientSearch({
  value,
  onChange,
  disabled = false,
}: PatientSearchProps) {

  
  return (
    <Box>
      <Typography
        variant="h6"
        fontWeight={600}
        mb={2}
      >
        Patient Search
      </Typography>

      <Autocomplete
  disabled={disabled}
  options={patientOptions}
  value={value}
  onChange={(_, newValue) => onChange(newValue)}
  fullWidth
  filterOptions={(options, { inputValue }) => {
    const query = inputValue.toLowerCase().trim();

    return options.filter(
      (option) =>
        option.patientName.toLowerCase().includes(query) ||
        option.uhid.toLowerCase().includes(query) ||
        option.mobile.includes(query) ||
        option.id.toLowerCase().includes(query)
    );
  }}
  getOptionLabel={(option) => option.patientName}
  isOptionEqualToValue={(option, value) =>
    option.id === value.id
  }
  renderInput={(params) => (
    <TextField
      {...params}
      label="Search Patient"
      placeholder="Search by Order ID, UHID, Name or Mobile"
      InputProps={{
        ...params.InputProps,
        startAdornment: (
          <>
            <SearchRoundedIcon
              sx={{
                mr: 1,
                color: "text.secondary",
              }}
            />
            {params.InputProps.startAdornment}
          </>
        ),
      }}
    />
  )}
  renderOption={(props, option) => (
    <Box
      component="li"
      {...props}
      key={option.id}
      sx={{
        display: "flex",
        flexDirection: "column",
        py: 1,
      }}
    >
      <Typography fontWeight={600}>
        {option.patientName}
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
      >
        UHID: {option.uhid} • Order: {option.id}
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
      >
        {option.age} Years • {option.gender}
      </Typography>

      <Typography
        variant="caption"
        color="text.secondary"
      >
        {option.mobile}
      </Typography>
    </Box>
  )}
/>
    </Box>
  );
}