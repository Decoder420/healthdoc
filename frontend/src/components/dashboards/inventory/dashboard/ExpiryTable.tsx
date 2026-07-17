"use client";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function createData(
  product: string,
  batch: string,
  expiry: string,
  quantity: number
) {
  return { product, batch, expiry, quantity };
}

const rows = [
  createData("Paracetamol", "B101", "15 Jul 2026", 50),
  createData("Insulin", "I205", "22 Jul 2026", 20),
  createData("Glucose", "G310", "30 Jul 2026", 35),
  createData("Vitamin C", "V450", "05 Aug 2026", 60),
];

export default function ExpiryTable() {
  return (
    <div className="table-card">
      <div className="table-header">
        <div>
          <h2 className="table-title">
            Expiring Products
          </h2>

          <p className="dashboard-subtitle">
            Products nearing expiry date
          </p>
        </div>
      </div>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: 0,
          boxShadow: "none",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Product</strong>
              </TableCell>

              <TableCell>
                <strong>Batch</strong>
              </TableCell>

              <TableCell>
                <strong>Expiry</strong>
              </TableCell>

              <TableCell align="right">
                <strong>Qty</strong>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.batch} hover>
                <TableCell className="quantity-text">
                  {row.product}
                </TableCell>

                <TableCell>
                  {row.batch}
                </TableCell>

                <TableCell>
                  {row.expiry}
                </TableCell>

                <TableCell
                  align="right"
                  className="quantity-text"
                >
                  {row.quantity}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}