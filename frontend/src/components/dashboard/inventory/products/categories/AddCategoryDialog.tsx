"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

import { useEffect, useState } from "react";

import type { Category } from "@/features/inventory/types/category";

interface Props {
  open: boolean;

  category?: Category | null;

  onClose: () => void;

  onSave: (
    category: Category
  ) => void;
}

export default function AddCategoryDialog({
  open,
  category,
  onClose,
  onSave,
}: Props) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] =
    useState("");

  useEffect(() => {
    if (category) {
      setCode(category.code);
      setName(category.name);
      setDescription(
        category.description ?? ""
      );
    } else {
      setCode("");
      setName("");
      setDescription("");
    }
  }, [category, open]);

  const handleSave = () => {
    if (!code.trim() || !name.trim()) {
      alert(
        "Category code and name are required."
      );
      return;
    }

    const updatedCategory: Category = {
      id:
        category?.id ??
        `CAT-${Date.now()}`,

      code: code.trim().toUpperCase(),

      name: name.trim(),

      description:
        description.trim(),

      itemCount:
        category?.itemCount ?? 0,

      isActive:
        category?.isActive ?? true,

      createdAt:
        category?.createdAt ??
        new Date().toLocaleDateString(
          "en-GB"
        ),
    };

    onSave(updatedCategory);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        {category
          ? "Edit Category"
          : "Add Category"}
      </DialogTitle>

      <DialogContent dividers>

        <div className="space-y-5 pt-2">

          <TextField
            label="Category Code"
            value={code}
            onChange={(event) =>
              setCode(
                event.target.value
              )
            }
            fullWidth
            size="small"
            placeholder="e.g. MED"
          />

          <TextField
            label="Category Name"
            value={name}
            onChange={(event) =>
              setName(
                event.target.value
              )
            }
            fullWidth
            size="small"
            placeholder="e.g. Medicine"
          />

          <TextField
            label="Description"
            value={description}
            onChange={(event) =>
              setDescription(
                event.target.value
              )
            }
            fullWidth
            multiline
            minRows={3}
            size="small"
          />

        </div>

      </DialogContent>

      <DialogActions>

        <Button
          onClick={onClose}
          color="inherit"
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSave}
        >
          {category
            ? "Update Category"
            : "Add Category"}
        </Button>

      </DialogActions>
    </Dialog>
  );
}