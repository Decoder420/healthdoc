"use client";

import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import {
  MODALITY_OPTIONS,
  ORDER_PRIORITY_OPTIONS,
  ORDER_TYPE_OPTIONS,
  PROCEDURE_SETTING_OPTIONS,
  SAMPLE_TYPE_OPTIONS,
} from "../constants";
import { doctorButtonSx } from "../panelSx";
import type {
  DraftOrder,
  Modality,
  OrderPriority,
  OrderType,
  ProcedureSetting,
  SampleType,
} from "../types";

export interface OrderFormModalProps {
  open: boolean;
  busy: boolean;
  onClose: () => void;
  onAdd: (
    draft: Omit<DraftOrder, "tempId">,
    idempotencyKey: string,
  ) => Promise<boolean> | boolean;
}

export function OrderFormModal({ open, busy, onClose, onAdd }: OrderFormModalProps) {
  const [orderType, setOrderType] = React.useState<OrderType>("lab");
  const [item, setItem] = React.useState("");
  const [priority, setPriority] = React.useState<OrderPriority>("routine");
  const [sampleType, setSampleType] = React.useState<SampleType>("blood");
  const [modality, setModality] = React.useState<Modality>("xray");
  const [procedureSetting, setProcedureSetting] = React.useState<ProcedureSetting>("opd_minor");
  const [idempotencyKey, setIdempotencyKey] = React.useState(() => crypto.randomUUID());

  const reset = () => {
    setOrderType("lab");
    setItem("");
    setPriority("routine");
    setSampleType("blood");
    setModality("xray");
    setProcedureSetting("opd_minor");
    setIdempotencyKey(crypto.randomUUID());
  };

  const close = () => {
    reset();
    onClose();
  };

  const handleAdd = async () => {
    const label = item.trim();
    if (!label) return;
    const ok = await onAdd(
      {
        order_type: orderType,
        priority,
        ...(orderType === "lab"
          ? { test_name: label, sample_type: sampleType }
          : orderType === "radiology"
            ? { scan_type: label, modality }
            : { procedure_name: label, setting: procedureSetting }),
      },
      idempotencyKey,
    );
    if (ok) close();
  };

  return (
    <Modal
      open={open}
      onClose={close}
      title="Add order"
      loading={busy}
      actions={
        <>
          <Button sx={doctorButtonSx} onClick={close}>
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={doctorButtonSx}
            onClick={handleAdd}
            disabled={!item.trim()}
          >
            Add order
          </Button>
        </>
      }
    >
      <Stack spacing={2}>
        <TextField
          select
          label="Order type"
          value={orderType}
          onChange={(event) => {
            setOrderType(event.target.value as OrderType);
            setItem("");
          }}
          size="small"
        >
          {ORDER_TYPE_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label={
            orderType === "lab"
              ? "Test name"
              : orderType === "radiology"
                ? "Study name"
                : "Procedure name"
          }
          value={item}
          onChange={(event) => setItem(event.target.value)}
          helperText="Enter the department's clinical order text"
          size="small"
          autoFocus
        />

        <TextField
          select
          label={
            orderType === "lab"
              ? "Sample type"
              : orderType === "radiology"
                ? "Modality"
                : "Procedure setting"
          }
          value={
            orderType === "lab"
              ? sampleType
              : orderType === "radiology"
                ? modality
                : procedureSetting
          }
          onChange={(event) => {
            if (orderType === "lab") setSampleType(event.target.value as SampleType);
            else if (orderType === "radiology") setModality(event.target.value as Modality);
            else setProcedureSetting(event.target.value as ProcedureSetting);
          }}
          size="small"
          helperText="Required on the department order row"
        >
          {(orderType === "lab"
            ? SAMPLE_TYPE_OPTIONS
            : orderType === "radiology"
              ? MODALITY_OPTIONS
              : PROCEDURE_SETTING_OPTIONS
          ).map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Priority"
          value={priority}
          onChange={(event) => setPriority(event.target.value as OrderPriority)}
          size="small"
        >
          {ORDER_PRIORITY_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
    </Modal>
  );
}
