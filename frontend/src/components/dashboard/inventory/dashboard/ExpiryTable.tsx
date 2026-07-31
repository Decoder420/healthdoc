"use client";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { EXPIRING_PRODUCTS } from "@/features/inventory/dashboard-data";

export default function ExpiryTable() {
  return (
    <div className="table-card">
      <div className="table-header">
        <div>
          <h2 className="table-title">Expiring Products</h2>
          <p className="dashboard-subtitle">
            {EXPIRING_PRODUCTS.length} products nearing expiry (mock load)
          </p>
        </div>
      </div>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: 0,
          boxShadow: "none",
          maxHeight: 420,
        }}
      >
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Product</strong>
              </TableCell>
              <TableCell>
                <strong>Batch</strong>
              </TableCell>
              <TableCell>
                <strong>Department</strong>
              </TableCell>
              <TableCell>
                <strong>Expiry</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Days</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Qty</strong>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {EXPIRING_PRODUCTS.map((row) => (
              <TableRow key={`${row.batch}-${row.product}`} hover>
                <TableCell className="quantity-text">{row.product}</TableCell>
                <TableCell>{row.batch}</TableCell>
                <TableCell>{row.department}</TableCell>
                <TableCell>{row.expiry}</TableCell>
                <TableCell align="right">{row.daysLeft}</TableCell>
                <TableCell align="right" className="quantity-text">
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
