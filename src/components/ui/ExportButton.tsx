"use client";

import { useState } from "react";
import {
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";

export type ExportFormat = "csv" | "excel" | "pdf";

type ExportButtonProps = {
  onExport: (format: ExportFormat) => void;
  formats?: ExportFormat[];
  disabled?: boolean;
};

const FORMAT_LABELS: Record<ExportFormat, string> = {
  csv: "Export CSV",
  excel: "Export Excel",
  pdf: "Export PDF",
};

const FORMAT_ICONS: Record<ExportFormat, string> = {
  csv: "CSV",
  excel: "XLS",
  pdf: "PDF",
};

export function ExportButton({
  onExport,
  formats = ["csv", "excel", "pdf"],
  disabled,
}: ExportButtonProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  return (
    <>
      <button
        type="button"
        className="btn btn-outline btn-sm"
        disabled={disabled}
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        Export
      </button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {formats.map((format) => (
          <MenuItem
            key={format}
            onClick={() => {
              setAnchorEl(null);
              onExport(format);
            }}
          >
            <ListItemIcon>
              <span className="text-xs font-semibold text-muted-foreground">
                {FORMAT_ICONS[format]}
              </span>
            </ListItemIcon>
            <ListItemText>{FORMAT_LABELS[format]}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
