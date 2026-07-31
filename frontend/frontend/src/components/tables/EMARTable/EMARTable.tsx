"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { StatusChip } from "@/components/ui/StatusChip";
import type { EmarRow } from "./EMARTable.types";

type EMARTableProps = {
  rows: EmarRow[];
  emptyMessage?: string;
};

const STATUS_MAP = {
  due: "pending" as const,
  given: "completed" as const,
  held: "waiting" as const,
  missed: "cancelled" as const,
  refused: "rejected" as const,
};

export function EMARTable({
  rows,
  emptyMessage = "No medications scheduled.",
}: EMARTableProps) {
  return (
    <div className="surface-card overflow-hidden">
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Medication</TableCell>
              <TableCell>Dose</TableCell>
              <TableCell>Route</TableCell>
              <TableCell>Scheduled</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Nurse</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <span className="text-sm text-muted-foreground">
                    {emptyMessage}
                  </span>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.medication}</TableCell>
                  <TableCell>{row.dose}</TableCell>
                  <TableCell>{row.route}</TableCell>
                  <TableCell>{row.scheduledAt}</TableCell>
                  <TableCell>
                    <StatusChip
                      status={STATUS_MAP[row.status]}
                      label={row.status}
                    />
                  </TableCell>
                  <TableCell>{row.nurse ?? "—"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
