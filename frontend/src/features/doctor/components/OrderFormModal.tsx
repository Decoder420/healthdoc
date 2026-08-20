"use client";

import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { SearchAutocomplete } from "@/components/ui/SearchAutocomplete";
import { suggestOrderNames } from "../api";
import {
  MODALITY_OPTIONS,
  ORDER_PRIORITY_OPTIONS,
  ORDER_TYPE_OPTIONS,
  PROCEDURE_SETTING_OPTIONS,
  SAMPLE_TYPE_OPTIONS,
} from "../constants";
import { doctorButtonSx } from "../panelSx";
import type { DraftOrder, Modality, OrderPriority, OrderType, ProcedureSetting, SampleType } from "../types";

export interface OrderFormModalProps {
  open: boolean;
  busy: boolean;
  onClose: () => void;
  onAdd: (draft: Omit<DraftOrder, "tempId">) => Promise<boolean> | boolean;
}

export function OrderFormModal({ open, busy, onClose, onAdd }: OrderFormModalProps) {
  const [orderType, setOrderType] = React.useState<OrderType>("lab");
  const [item, setItem] = React.useState<string | null>(null);
  const [priority, setPriority] = React.useState<OrderPriority>("routine");
  const [catalog, setCatalog] = React.useState<string[]>([]);
  // Required on the department detail rows, so the form must ask for them.
  const [sampleType, setSampleType] = React.useState<SampleType>("blood");
  const [modality, setModality] = React.useState<Modality>("xray");
  const [setting, setSetting] = React.useState<ProcedureSetting>("opd_minor");

  // Load the catalogue for the selected order type.
  React.useEffect(() => {
    let live = true;
    void suggestOrderNames(orderType, "").then((r: string[]) => live && setCatalog(r));
    return () => {
      live = false;
    };
  }, [orderType]);

  const reset = () => {
    setOrderType("lab");
    setItem(null);
    setPriority("routine");
    setSampleType("blood");
    setModality("xray");
    setSetting("opd_minor");
  };

  const close = () => {
    reset();
    onClose();
  };

  const handleAdd = async () => {
    if (!item) return;
    const ok = await onAdd({
      order_type: orderType,
      priority,
      ...(orderType === "lab"
        ? { test_name: item, sample_type: sampleType }
        : orderType === "radiology"
          ? { scan_type: item, modality }
          : { procedure_name: item, setting }),
    });
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
          <Button variant="contained" sx={doctorButtonSx} onClick={handleAdd} disabled={!item}>
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
          onChange={(e) => {
            setOrderType(e.target.value as OrderType);
            setItem(null);
          }}
          size="small"
        >
          {ORDER_TYPE_OPTIONS.map((o) => (
            <MenuItem key={o.value} value={o.value}>
              {o.label}
            </MenuItem>
          ))}
        </TextField>

        <SearchAutocomplete<string>
          label={`Search ${orderType} catalogue`}
          options={catalog}
          value={item}
          onChange={setItem}
          onInputChange={(q) => {
            void suggestOrderNames(orderType, q).then(setCatalog);
          }}
          getOptionLabel={(o) => o}
          isOptionEqualToValue={(a, b) => a === b}
        />

        <TextField
          select
          label={
            orderType === "lab"
              ? "Sample type"
              : orderType === "radiology"
                ? "Modality"
                : "Setting"
          }
          value={orderType === "lab" ? sampleType : orderType === "radiology" ? modality : setting}
          onChange={(e) => {
            const v = e.target.value;
            if (orderType === "lab") setSampleType(v as SampleType);
            else if (orderType === "radiology") setModality(v as Modality);
            else setSetting(v as ProcedureSetting);
          }}
          size="small"
          helperText={
            orderType === "procedure"
              ? "Where the procedure is done"
              : "Required on the department order row"
          }
        >
          {(orderType === "lab"
            ? SAMPLE_TYPE_OPTIONS
            : orderType === "radiology"
              ? MODALITY_OPTIONS
              : PROCEDURE_SETTING_OPTIONS
          ).map((o) => (
            <MenuItem key={o.value} value={o.value}>
              {o.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as OrderPriority)}
          size="small"
        >
          {ORDER_PRIORITY_OPTIONS.map((o) => (
            <MenuItem key={o.value} value={o.value}>
              {o.label}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
    </Modal>
  );
}
