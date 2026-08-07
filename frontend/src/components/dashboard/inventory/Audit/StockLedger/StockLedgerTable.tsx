"use client";

import {
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import type { StockLedgerEntry } from "@/features/inventory/types/stockLedger";
import { getTransactionLabel } from "@/features/inventory/data/stockLedgerData";

interface Props {
  entries: StockLedgerEntry[];
}

function getTransactionColor(type: StockLedgerEntry["transaction_type"]) {
  switch (type) {
    case "purchase":
    case "return":
      return "success";

    case "issue":
    case "consumption":
    case "write_off":
      return "error";

    case "transfer":
      return "info";

    case "adjustment":
      return "warning";

    default:
      return "default";
  }
}

export default function StockLedgerTable({ entries }: Props) {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Item</TableCell>
            <TableCell>Batch</TableCell>
            <TableCell>Transaction</TableCell>
            <TableCell>Reference</TableCell>
            <TableCell align="right">Quantity</TableCell>
            <TableCell>Performed By</TableCell>
            <TableCell>Reason</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {entries.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} align="center">
                <Typography
                  variant="body2"
                  color="text.secondary"
                  py={4}
                >
                  No stock transactions found.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            entries.map((entry) => {
              const quantityIsIn = entry.quantity > 0;

              return (
                <TableRow key={entry.id} hover>
                  <TableCell>
                    {new Date(entry.created_at).toLocaleDateString(
                      "en-IN"
                    )}
                  </TableCell>

                  <TableCell>
                    <Typography fontWeight={600}>
                      {entry.item_id}
                    </Typography>
                  </TableCell>

                  <TableCell>{entry.batch_id ?? "—"}</TableCell>

                  <TableCell>
                    <Chip
                      size="small"
                      label={getTransactionLabel(
                        entry.transaction_type
                      )}
                      color={getTransactionColor(
                        entry.transaction_type
                      )}
                      variant="outlined"
                    />
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2">
                      {entry.reference_type
                        ? `${entry.reference_type} / ${
                            entry.reference_id ?? "—"
                          }`
                        : "—"}
                    </Typography>
                  </TableCell>

                  <TableCell align="right">
                    <Typography
                      fontWeight={700}
                      sx={{
                        color: quantityIsIn
                          ? "success.main"
                          : "error.main",
                      }}
                    >
                      {quantityIsIn ? "+" : ""}
                      {entry.quantity.toFixed(2)}
                    </Typography>
                  </TableCell>

                  <TableCell>{entry.performed_by}</TableCell>

                  <TableCell>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {entry.reason || "—"}
                    </Typography>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}