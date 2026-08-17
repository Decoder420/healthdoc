"use client";

import {
  Stack,
  TextField,
  MenuItem,
  InputAdornment,
  Button,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";

import type { SearchToolbarProps } from "./types";

export default function SearchToolbar({
  search,
  status,
  date,

  onSearchChange,
  onStatusChange,
  onDateChange,

  onRefresh,
  onExport,

  actions,
}: SearchToolbarProps) {
  return (
    <div className="surface-card p-3 mt-2">
      <Stack
        direction={{ xs: "column", lg: "row" }}
        spacing={1.5}
        alignItems={{ xs: "stretch", lg: "center" }}
      >
        {/* Filters */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          flex={1}
          width="100%"
          alignItems={{ xs: "stretch", sm: "center" }}
        >
          {/* Search */}
          <TextField
            size="small"
            placeholder="Search Patient, UHID or Accession No."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{
              flex: 2.5,
              minWidth: {
                xs: "100%",
                sm: 280,
              },
              "& .MuiOutlinedInput-root": {
                height: 34,
                fontSize: 13,
              },
              "& .MuiInputBase-input": {
                py: 0.5,
              },
            }}
          />

          {/* Status */}
          <TextField
            select
            size="small"
            label="Status"
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            sx={{
              width: {
                xs: "100%",
                sm: 170,
              },
              "& .MuiOutlinedInput-root": {
                height: 34,
                fontSize: 13,
              },
              "& .MuiInputLabel-root": {
                fontSize: 13,
              },
            }}
          >
            <MenuItem value="All">All Status</MenuItem>
            <MenuItem value="Processing">Processing</MenuItem>
            <MenuItem value="Verified">Verified</MenuItem>
          </TextField>

          {/* Date */}
          <TextField
            type="date"
            size="small"
            label="Appointment Date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              width: {
                xs: "100%",
                sm: 205,
              },
              "& .MuiOutlinedInput-root": {
                height: 34,
                fontSize: 13,
              },
              "& .MuiInputLabel-root": {
                fontSize: 13,
              },
            }}
          />
        </Stack>

        {/* Actions */}
        <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
          alignItems="center"
        >
          <Button
            variant="outlined"
            size="small"
            startIcon={<RefreshOutlinedIcon fontSize="small" />}
            onClick={onRefresh}
            sx={{
              height: 34,
              borderRadius: 1.5,
              textTransform: "none",
              whiteSpace: "nowrap",
              px: 1.5,
              fontSize: 13,
            }}
          >
            Refresh
          </Button>

          <Button
            variant="contained"
            size="small"
            startIcon={<FileUploadOutlinedIcon fontSize="small" />}
            onClick={onExport}
            sx={{
              height: 34,
              borderRadius: 1.5,
              textTransform: "none",
              whiteSpace: "nowrap",
              px: 1.5,
              fontSize: 13,
            }}
          >
            Export
          </Button>

          {actions}
        </Stack>
      </Stack>
    </div>
  );
}