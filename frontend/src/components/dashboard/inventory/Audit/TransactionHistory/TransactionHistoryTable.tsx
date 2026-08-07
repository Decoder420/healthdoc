"use client";

import {
  Box,
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

import type { StockTransaction } from "@/features/inventory/types/stockTransaction";

interface Props {
  transactions: StockTransaction[];
}

const getTransactionLabel = (
  type: StockTransaction["transaction_type"]
) => {
  switch (type) {
    case "purchase":
      return "Purchase";

    case "issue":
      return "Issue";

    case "return":
      return "Return";

    case "transfer":
      return "Transfer";

    case "consumption":
      return "Consumption";

    case "adjustment":
      return "Adjustment";

    case "write_off":
      return "Write-off";

    default:
      return type;
  }
};

const getTransactionColor = (
  type: StockTransaction["transaction_type"]
) => {
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
};

export default function TransactionHistoryTable({
  transactions,
}: Props) {
  return (
    <TableContainer
      component={Paper}
      variant="outlined"
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <strong>Date & Time</strong>
            </TableCell>

            <TableCell>
              <strong>Transaction ID</strong>
            </TableCell>

            <TableCell>
              <strong>Item</strong>
            </TableCell>

            <TableCell>
              <strong>Batch</strong>
            </TableCell>

            <TableCell>
              <strong>Type</strong>
            </TableCell>

            <TableCell align="right">
              <strong>Quantity</strong>
            </TableCell>

            <TableCell>
              <strong>Reference</strong>
            </TableCell>

            <TableCell>
              <strong>Performed By</strong>
            </TableCell>

            <TableCell>
              <strong>Reason</strong>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={9}
                align="center"
              >
                <Box py={5}>
                  <Typography
                    color="text.secondary"
                  >
                    No transactions found.
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            transactions.map(
              (transaction) => (
                <TableRow
                  key={transaction.id}
                  hover
                >
                  <TableCell>
                    {new Date(
                      transaction.created_at
                    ).toLocaleString()}
                  </TableCell>

                  <TableCell>
                    <Typography
                      fontWeight={700}
                      variant="body2"
                    >
                      {transaction.id}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography
                      fontWeight={600}
                    >
                      {transaction.item_name}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      {transaction.item_id}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    {transaction.batch_id ??
                      "—"}
                  </TableCell>

                  <TableCell>
                    <Chip
                      size="small"
                      label={getTransactionLabel(
                        transaction.transaction_type
                      )}
                      color={
                        getTransactionColor(
                          transaction.transaction_type
                        ) as
                          | "success"
                          | "error"
                          | "info"
                          | "warning"
                          | "default"
                      }
                    />
                  </TableCell>

                  <TableCell align="right">
                    <Typography
                      fontWeight={700}
                      color={
                        transaction.quantity <
                        0
                          ? "error.main"
                          : "success.main"
                      }
                    >
                      {transaction.quantity > 0
                        ? "+"
                        : ""}
                      {transaction.quantity}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2">
                      {transaction.reference_type ??
                        "—"}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      {transaction.reference_id ??
                        "—"}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    {transaction.performed_by}
                  </TableCell>

                  <TableCell>
                    {transaction.reason ??
                      "—"}
                  </TableCell>
                </TableRow>
              )
            )
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}