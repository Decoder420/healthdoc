
"use client";

import { useEffect, useState } from "react";
import { getAuthUser } from "@/lib/auth";
import { ROLES } from "@/config/roles";


import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import {
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";

import {
  approveStockAdjustment,
  getStockAdjustments,
  rejectStockAdjustment,
} from "@/features/inventory/data/stockAdjustmentData";

import type {
  StockAdjustment,
} from "@/features/inventory/types/stockAdjustment";

interface Props {
  open: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

export default function StockAdjustmentApproval({
  open,
  onClose,
  onUpdated,
}: Props) {
  const [adjustments, setAdjustments] =
    useState<StockAdjustment[]>([]);

  const [selectedAdjustment, setSelectedAdjustment] =
    useState<StockAdjustment | null>(null);

  const [rejectionReason, setRejectionReason] =
    useState("");

  const [error, setError] = useState("");

  const loadAdjustments = () => {
    setAdjustments(getStockAdjustments());
  };

  useEffect(() => {
    if (open) {
      loadAdjustments();
      setError("");
    }
  }, [open]);

  const pendingAdjustments =
    adjustments.filter(
      (adjustment) =>
        adjustment.status === "Pending Approval" ||
        adjustment.status === "First Approved"
    );

  const handleApprove = (
  adjustment: StockAdjustment
) => {
  setError("");

  try {
    const currentUser = getAuthUser();

    if (!currentUser) {
      setError(
        "You must be logged in to approve a stock adjustment."
      );
      return;
    }

    if (
      currentUser.role !== ROLES.ADMIN &&
      currentUser.role !== ROLES.INVENTORY_MANAGER
    ) {
      setError(
        "You are not authorized to approve stock adjustments."
      );
      return;
    }

    approveStockAdjustment(
      adjustment.id,
      currentUser.id
    );

    loadAdjustments();
    onUpdated();
  } catch (error) {
    setError(
      error instanceof Error
        ? error.message
        : "Unable to approve adjustment."
    );
  }
};

 const handleReject = () => {
  if (!selectedAdjustment) {
    return;
  }

  if (!rejectionReason.trim()) {
    setError("Rejection reason is required.");
    return;
  }

  try {
    const currentUser = getAuthUser();

    if (!currentUser) {
      setError(
        "You must be logged in to reject a stock adjustment."
      );
      return;
    }

    if (
      currentUser.role !== ROLES.ADMIN &&
      currentUser.role !== ROLES.INVENTORY_MANAGER
    ) {
      setError(
        "You are not authorized to reject stock adjustments."
      );
      return;
    }

    rejectStockAdjustment(
      selectedAdjustment.id,
      currentUser.id,
      rejectionReason.trim()
    );

    setSelectedAdjustment(null);
    setRejectionReason("");
    setError("");

    loadAdjustments();
    onUpdated();
  } catch (error) {
    setError(
      error instanceof Error
        ? error.message
        : "Unable to reject adjustment."
    );
  }
};

  const canApproveStockAdjustment = () => {
  const currentUser = getAuthUser();

  if (!currentUser) {
    return false;
  }

  return (
    currentUser.role === ROLES.ADMIN ||
    currentUser.role === ROLES.INVENTORY_MANAGER
  );
};

  const getStage = (
    adjustment: StockAdjustment
  ) => {
    if (
      adjustment.status === "Pending Approval"
    ) {
      return "First Sign-off";
    }

    if (
      adjustment.status === "First Approved"
    ) {
      return "Second Sign-off";
    }

    return "Completed";
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          <Box>
            <Typography
              variant="h6"
              fontWeight={700}
            >
              Stock Adjustment Approval
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              mt={0.5}
            >
              Dual sign-off is required for stock
              adjustments.
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent>
          {error && (
            <Alert
              severity="error"
              sx={{ mb: 2 }}
            >
              {error}
            </Alert>
          )}

          {pendingAdjustments.length === 0 ? (
            <Alert severity="info">
              No stock adjustments are waiting
              for approval.
            </Alert>
          ) : (
            <Box
              display="flex"
              flexDirection="column"
              gap={2}
            >
              {pendingAdjustments.map(
                (adjustment) => (
                  <Paper
                    key={adjustment.id}
                    variant="outlined"
                    sx={{ p: 2 }}
                  >
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      gap={2}
                    >
                      <Box>
                        <Typography
                          fontWeight={700}
                        >
                          {adjustment.id}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          Item ID:{" "}
                          {adjustment.item_id}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          Batch:{" "}
                          {adjustment.batch_id ??
                            "—"}
                        </Typography>
                      </Box>

                      <Chip
                        size="small"
                        icon={
                          <Clock3 size={14} />
                        }
                        label={getStage(
                          adjustment
                        )}
                        color={
                          adjustment.status ===
                          "First Approved"
                            ? "info"
                            : "warning"
                        }
                      />
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box
                      display="grid"
                      gridTemplateColumns={{
                        xs: "1fr 1fr",
                        md: "repeat(4, 1fr)",
                      }}
                      gap={2}
                    >
                      <Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          System
                        </Typography>

                        <Typography fontWeight={700}>
                          {
                            adjustment.system_quantity
                          }
                        </Typography>
                      </Box>

                      <Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          Physical
                        </Typography>

                        <Typography fontWeight={700}>
                          {
                            adjustment.physical_quantity
                          }
                        </Typography>
                      </Box>

                      <Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          Adjustment
                        </Typography>

                        <Typography
                          fontWeight={700}
                          color={
                            adjustment.adjustment_quantity <
                            0
                              ? "error.main"
                              : "success.main"
                          }
                        >
                          {adjustment.adjustment_quantity >
                          0
                            ? "+"
                            : ""}
                          {
                            adjustment.adjustment_quantity
                          }
                        </Typography>
                      </Box>

                      <Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          Requested By
                        </Typography>

                        <Typography fontWeight={700}>
                          {
                            adjustment.requested_by
                          }
                        </Typography>
                      </Box>
                    </Box>

                    <Box mt={2}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Reason
                      </Typography>

                      <Typography>
                        {adjustment.reason}
                      </Typography>
                    </Box>

                    {adjustment.status ===
                      "First Approved" && (
                      <Alert
                        severity="info"
                        sx={{ mt: 2 }}
                      >
                        First sign-off completed by{" "}
                        {
                          adjustment.first_approved_by
                        }
                        . A different authorized
                        user must complete the final
                        sign-off.
                      </Alert>
                    )}

                    <Box
                      mt={2}
                      display="flex"
                      gap={1}
                      justifyContent="flex-end"
                    >
                      <Button
                        color="error"
                        variant="outlined"
                        startIcon={
                          <XCircle size={17} />
                        }
                        onClick={() => {
                          setSelectedAdjustment(
                            adjustment
                          );
                          setRejectionReason("");
                          setError("");
                        }}
                      >
                        Reject
                      </Button>

                      <Button
                        variant="contained"
                        startIcon={
                          <CheckCircle2
                            size={17}
                          />
                        }
                        onClick={() =>
                          handleApprove(
                            adjustment
                          )
                        }
                      >
                        {adjustment.status ===
                        "Pending Approval"
                          ? "First Approve"
                          : "Final Approve"}
                      </Button>
                    </Box>
                  </Paper>
                )
              )}
            </Box>
          )}
        </DialogContent>

        <DialogActions
          sx={{ px: 3, pb: 2 }}
        >
          <Button onClick={onClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={Boolean(selectedAdjustment)}
        onClose={() =>
          setSelectedAdjustment(null)
        }
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Reject Stock Adjustment
        </DialogTitle>

        <DialogContent>
          <Typography
            variant="body2"
            color="text.secondary"
            mb={2}
          >
            Please provide a reason for rejecting
            this stock adjustment.
          </Typography>

          <TextField
            label="Rejection Reason"
            value={rejectionReason}
            onChange={(event) =>
              setRejectionReason(
                event.target.value
              )
            }
            multiline
            minRows={3}
            fullWidth
            required
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              setSelectedAdjustment(null);
              setRejectionReason("");
              setError("");
            }}
          >
            Cancel
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={handleReject}
          >
            Reject Adjustment
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
