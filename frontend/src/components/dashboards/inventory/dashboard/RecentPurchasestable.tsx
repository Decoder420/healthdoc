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

const purchases = [
  {
    id: 1,
    item: "X-Ray Film 14×17",
    supplier: "Agfa Healthcare",
    quantity: 200,
    minimumStock: 50,
    daysLeft: 180,
    fefo: true,
  },
  {
    id: 2,
    item: "Contrast Media",
    supplier: "GE Healthcare",
    quantity: 50,
    minimumStock: 40,
    daysLeft: 18,
    fefo: true,
  },
  {
    id: 3,
    item: "Laser Film",
    supplier: "Fujifilm",
    quantity: 100,
    minimumStock: 120,
    daysLeft: -2,
    fefo: false,
  },
  {
    id: 4,
    item: "Syringes",
    supplier: "MedSupply",
    quantity: 25,
    minimumStock: 50,
    daysLeft: 65,
    fefo: true,
  },
];

export default function RecentInventoryTable() {
  return (
    <div className="table-card">
      <div className="table-header">
        <div>
          <h2 className="table-title">
            Recent Inventory
          </h2>

          <p className="dashboard-subtitle">
            Latest inventory transactions
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
        }}
      >
        <Table>
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
            {purchases.map((purchase) => (
              <TableRow key={purchase.id} hover>
                <TableCell className="quantity-text">
                  {purchase.item}
                </TableCell>

                <TableCell align="center">
                  {purchase.quantity}
                </TableCell>

                <TableCell>
                  {purchase.supplier}
                </TableCell>

                <TableCell align="center">
                  <StockLevelBadge
                    quantity={purchase.quantity}
                    minimumQuantity={purchase.minimumStock}
                  />
                </TableCell>

                <TableCell align="center">
                  <ExpiryChip
                    daysLeft={purchase.daysLeft}
                  />
                </TableCell>

                <TableCell align="center">
                  <FEFOIndicator
                    fefo={purchase.fefo}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}