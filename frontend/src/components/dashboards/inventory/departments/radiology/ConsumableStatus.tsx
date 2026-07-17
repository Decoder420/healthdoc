"use client";

import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import { meridian } from "@/styles/theme";

const consumables = [
  { name: "Gloves", current: 92 },
  { name: "Syringes", current: 78 },
  { name: "Face Masks", current: 55 },
  { name: "IV Sets", current: 66 },
  { name: "Catheters", current: 42 },
  { name: "Cotton Rolls", current: 88 },
];

export default function ConsumablesProgress() {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: "16px",
        border: `1px solid ${meridian.border}`,
        background: `linear-gradient(180deg, ${meridian.surface} 0%, #fbfcfe 100%)`,
        boxShadow:
          "0 1px 2px rgb(0 31 84 / 0.04), 0 12px 32px rgb(0 31 84 / 0.06)",
      }}
    >
      <Typography
        sx={{
          m: 0,
          fontSize: "1.0625rem",
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color: meridian.textPrimary,
        }}
      >
        Consumables Stock
      </Typography>
      <Typography sx={{ m: 0, mt: 0.5, fontSize: "0.8125rem", color: meridian.textSecondary }}>
        Current stock level of frequently used consumables
      </Typography>

      <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2.5 }}>
        {consumables.map((item) => (
          <Box key={item.name}>
            <Box sx={{ mb: 1, display: "flex", justifyContent: "space-between" }}>
              <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: meridian.textPrimary }}>
                {item.name}
              </Typography>
              <Typography sx={{ fontSize: "0.875rem", fontWeight: 700, color: meridian.brandPrimary }}>
                {item.current}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={item.current}
              sx={{
                height: 10,
                borderRadius: 999,
                backgroundColor: meridian.muted,
                "& .MuiLinearProgress-bar": {
                  borderRadius: 999,
                  backgroundColor: meridian.brandPrimary,
                },
              }}
            />
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
