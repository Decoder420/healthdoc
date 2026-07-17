"use client";

import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import StockLevelBadge from "@/components/ui/StockLevelBadge";
import ExpiryChip from "@/components/ui/ExpiryChip";
import FEFOIndicator from "@/components/ui/FEFOindicator";
import { meridian } from "@/styles/theme";

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

const headerSx = {
  backgroundColor: meridian.muted,
  color: meridian.textSecondary,
  fontSize: "0.6875rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase" as const,
  borderBottom: `1px solid ${meridian.border}`,
};

export default function RecentInventoryTable() {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "16px",
        border: `1px solid ${meridian.border}`,
        overflow: "hidden",
        boxShadow:
          "0 1px 2px rgb(0 31 84 / 0.04), 0 12px 32px rgb(0 31 84 / 0.06)",
      }}
    >
      <Box sx={{ px: 3, pt: 2.5, pb: 2 }}>
        <Typography
          sx={{
            m: 0,
            fontSize: "1.0625rem",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: meridian.textPrimary,
          }}
        >
          Recent Inventory
        </Typography>
        <Typography sx={{ m: 0, mt: 0.5, fontSize: "0.8125rem", color: meridian.textSecondary }}>
          Latest inventory transactions
        </Typography>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={headerSx}>Product</TableCell>
              <TableCell align="center" sx={headerSx}>
                Quantity
              </TableCell>
              <TableCell sx={headerSx}>Supplier</TableCell>
              <TableCell align="center" sx={headerSx}>
                Stock
              </TableCell>
              <TableCell align="center" sx={headerSx}>
                Expiry
              </TableCell>
              <TableCell align="center" sx={headerSx}>
                FEFO
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {purchases.map((purchase) => (
              <TableRow
                key={purchase.id}
                hover
                sx={{ "&:hover": { backgroundColor: "rgb(0 31 84 / 0.03)" } }}
              >
                <TableCell sx={{ fontWeight: 600, color: meridian.textPrimary }}>
                  {purchase.item}
                </TableCell>
                <TableCell align="center">{purchase.quantity}</TableCell>
                <TableCell sx={{ color: meridian.textSecondary }}>
                  {purchase.supplier}
                </TableCell>
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
    </Paper>
  );
}
