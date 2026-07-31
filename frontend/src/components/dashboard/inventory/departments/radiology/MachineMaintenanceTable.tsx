"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const rows = [
  {
    machine: "CT Scanner",
    engineer: "Siemens Healthcare",
    lastService: "01 Jul 2026",
    nextService: "01 Oct 2026",
    status: "Scheduled",
  },
  {
    machine: "MRI Scanner",
    engineer: "GE Healthcare",
    lastService: "15 Jun 2026",
    nextService: "15 Sep 2026",
    status: "Due Soon",
  },
  {
    machine: "Digital X-Ray",
    engineer: "Philips",
    lastService: "10 Jul 2026",
    nextService: "10 Jan 2027",
    status: "Healthy",
  },
  {
    machine: "Portable X-Ray",
    engineer: "Carestream",
    lastService: "20 May 2026",
    nextService: "20 Aug 2026",
    status: "Overdue",
  },
];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Healthy: "bg-success-muted text-success",
    Scheduled: "bg-info-muted text-info",
    "Due Soon": "bg-warning-muted text-warning",
    Overdue: "bg-danger-muted text-danger",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        styles[status] ?? "bg-muted text-foreground"
      }`}
    >
      {status}
    </span>
  );
}

export default function MachineMaintenanceTable() {
  return (
    <div className="surface-card overflow-hidden">
      {/* Header */}
      <div className="border-b border-border p-6">
        <h2 className="text-lg font-semibold text-foreground">
          Machine Maintenance Schedule
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Preventive maintenance and service schedule
        </p>
      </div>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          backgroundColor: "transparent",
          boxShadow: "none",
        }}
      >
        <Table>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "var(--muted)",
              }}
            >
              {[
                "Machine",
                "Engineer",
                "Last Service",
                "Next Service",
                "Status",
              ].map((head) => (
                <TableCell
                  key={head}
                  sx={{
                    fontWeight: 600,
                    color: "var(--muted-foreground)",
                    borderColor: "var(--border)",
                    fontFamily:
                      'var(--font-ibm-plex-mono), "IBM Plex Mono", monospace',
                  }}
                >
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.machine}
                hover
                sx={{
                  "& td": {
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  },
                  "&:hover": {
                    backgroundColor: "var(--muted)",
                  },
                }}
              >
                <TableCell sx={{ fontWeight: 600 }}>
                  {row.machine}
                </TableCell>

                <TableCell>{row.engineer}</TableCell>

                <TableCell>{row.lastService}</TableCell>

                <TableCell>{row.nextService}</TableCell>

                <TableCell>
                  <StatusBadge status={row.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}