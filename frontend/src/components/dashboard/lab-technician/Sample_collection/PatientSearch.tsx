"use client";

import { Autocomplete, Box, TextField, Typography } from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

export interface Patient {
  id: number;
  uhid: string;
  patientName: string;
  age: number;
  gender: string;
  mobile: string;
  doctor: string;
  department: string;
  tests: string[];
}

interface PatientSearchProps {
  value: Patient | null;
  onChange: (patient: Patient | null) => void;
}

const patients: Patient[] = [
  {
    id: 1,
    uhid: "UH10021",
    patientName: "John Doe",
    age: 35,
    gender: "Male",
    mobile: "9876543210",
    doctor: "Dr. Sharma",
    department: "General Medicine",
    tests: ["CBC", "LFT", "Blood Sugar"],
  },
  {
    id: 2,
    uhid: "UH10022",
    patientName: "Aman Singh",
    age: 28,
    gender: "Male",
    mobile: "9876543211",
    doctor: "Dr. Gupta",
    department: "Orthopedics",
    tests: ["KFT", "Vitamin D"],
  },
  {
    id: 3,
    uhid: "UH10023",
    patientName: "Neha Sharma",
    age: 30,
    gender: "Female",
    mobile: "9876543212",
    doctor: "Dr. Mehta",
    department: "Gynecology",
    tests: ["CBC", "Thyroid Profile"],
  },
];

export default function PatientSearch({
  value,
  onChange,
}: PatientSearchProps) {
  return (
    <Box>
      <Typography variant="h6" fontWeight={600} mb={2}>
        Patient Search
      </Typography>

      <Autocomplete
        options={patients}
        value={value}
        onChange={(_, newValue) => onChange(newValue)}
        fullWidth
        getOptionLabel={(option) =>
          `${option.patientName} (${option.uhid})`
        }
        isOptionEqualToValue={(option, value) =>
          option.id === value.id
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search Patient"
            placeholder="Search by UHID, Name or Mobile Number"
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <>
                  <SearchRoundedIcon sx={{ mr: 1, color: "text.secondary" }} />
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

            <Typography variant="body2" color="text.secondary">
              UHID: {option.uhid} • {option.age} Years • {option.gender}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              {option.mobile}
            </Typography>
          </Box>
        )}
      />
    </Box>
  );
}