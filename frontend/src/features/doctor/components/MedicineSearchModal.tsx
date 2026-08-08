"use client";

import * as React from "react";
import Stack from "@mui/material/Stack";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { SearchAutocomplete } from "@/components/ui/SearchAutocomplete";
import { searchMedicines } from "../api";
import { doctorButtonSx } from "../panelSx";
import type { Medicine } from "../types";

export interface MedicineSearchModalProps {
  open: boolean;
  onClose: () => void;
  onPick: (medicine: Medicine) => void;
}

export function MedicineSearchModal({ open, onClose, onPick }: MedicineSearchModalProps) {
  const [options, setOptions] = React.useState<Medicine[]>([]);
  const [value, setValue] = React.useState<Medicine | null>(null);

  React.useEffect(() => {
    if (!open) return;
    let live = true;
    void searchMedicines("").then((r) => live && setOptions(r));
    return () => {
      live = false;
    };
  }, [open]);

  const close = () => {
    setValue(null);
    onClose();
  };

  const add = () => {
    if (!value) return;
    onPick(value);
    close();
  };

  return (
    <Modal
      open={open}
      onClose={close}
      title="Add medicine"
      actions={
        <>
          <Button sx={doctorButtonSx} onClick={close}>
            Cancel
          </Button>
          <Button variant="contained" sx={doctorButtonSx} onClick={add} disabled={!value}>
            Add medicine
          </Button>
        </>
      }
    >
      <Stack spacing={2}>
        <SearchAutocomplete<Medicine>
          label="Search medicine"
          placeholder="e.g. paracetamol, amox, metformin"
          options={options}
          value={value}
          onChange={setValue}
          onInputChange={(q) => {
            void searchMedicines(q).then(setOptions);
          }}
          getOptionLabel={(m) => m.name}
          getOptionSubtext={(m) =>
            [m.generic_name, m.form, m.is_controlled_drug ? "controlled" : undefined]
              .filter(Boolean)
              .join(" · ")
          }
          isOptionEqualToValue={(a, b) => a.id === b.id}
        />
      </Stack>
    </Modal>
  );
}
