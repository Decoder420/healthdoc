"use client";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import StockLevelBadge from "@/components/ui/StockLevelBadge";
import ExpiryChip from "@/components/ui/ExpiryChip";
import FEFOIndicator from "@/components/ui/FEFOindicator";
import { RECENT_INVENTORY } from "@/features/inventory/dashboard-data";

export default function RecentInventoryTable() {
  return (
    <div className="table-card">
      <div className="table-header">
        <div>
          <h2 className="table-title">Recent Inventory</h2>
          <p className="dashboard-subtitle">
            Latest {RECENT_INVENTORY.length} inventory movements (mock load)
          </p>
        </div>
      </div>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: 0,
          boxShadow: "none",
          background: "transparent",
          maxHeight: 420,
        }}
      >
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Product</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Quantity</strong>
              </TableCell>
              <TableCell>
                <strong>Supplier</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Stock</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Expiry</strong>
              </TableCell>
              <TableCell align="center">
                <strong>FEFO</strong>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {RECENT_INVENTORY.map((purchase) => (
              <TableRow key={purchase.id} hover>
                <TableCell className="quantity-text">{purchase.item}</TableCell>
                <TableCell align="center">{purchase.quantity}</TableCell>
                <TableCell>{purchase.supplier}</TableCell>
                <TableCell align="center">
                  <StockLevelBadge
                    quantity={purchase.quantity}
                    minimumQuantity={purchase.minimumStock}
                  />
                </TableCell>
                <TableCell align="center">
                  <ExpiryChip daysLeft={purchase.daysLeft} />
                </TableCell>
                <TableCell align="center">
                  <FEFOIndicator fefo={purchase.fefo} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
