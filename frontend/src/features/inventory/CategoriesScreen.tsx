"use client";

import { useMemo, useState } from "react";

import {
  Plus,
  Search,
  RotateCcw,
} from "lucide-react";

import CategoryStats from "@/components/dashboard/inventory/products/categories/CategoryStats";
import CategoryTable from "@/components/dashboard/inventory/products/categories/CategoryTable";
import AddCategoryDialog from "@/components/dashboard/inventory/products/categories/AddCategoryDialog";
import CategoryViewDialog from "@/components/dashboard/inventory/products/categories/CategoryViewDialog";

import type { Category } from "@/features/inventory/types/category";

import {
  categoryData,
  saveCategories,
} from "@/features/inventory/data/categoryData";

export default function CategoriesScreen() {
  const [categories, setCategories] =
    useState<Category[]>(categoryData);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("All");

  const [dialogOpen, setDialogOpen] =
    useState(false);

  const [viewOpen, setViewOpen] =
    useState(false);

  const [selectedCategory, setSelectedCategory] =
    useState<Category | null>(null);

  const filteredCategories =
    useMemo(() => {
      const searchValue =
        search
          .trim()
          .toLowerCase();

      return categories.filter(
        (category) => {
          const matchesSearch =
            !searchValue ||
            category.name
              .toLowerCase()
              .includes(searchValue) ||
            category.code
              .toLowerCase()
              .includes(searchValue) ||
            (
              category.description ??
              ""
            )
              .toLowerCase()
              .includes(searchValue);

          const matchesStatus =
            status === "All" ||
            (status === "Active"
              ? category.isActive
              : !category.isActive);

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );
    }, [
      categories,
      search,
      status,
    ]);

  const handleAdd = () => {
    setSelectedCategory(null);
    setDialogOpen(true);
  };

  const handleEdit = (
    category: Category
  ) => {
    setSelectedCategory(category);
    setDialogOpen(true);
  };

  const handleView = (
    category: Category
  ) => {
    setSelectedCategory(category);
    setViewOpen(true);
  };

  const handleSave = (
    category: Category
  ) => {
    setCategories(
      (currentCategories) => {
        const exists =
          currentCategories.some(
            (item) =>
              item.id === category.id
          );

        const updated =
          exists
            ? currentCategories.map(
                (item) =>
                  item.id ===
                  category.id
                    ? category
                    : item
              )
            : [
                category,
                ...currentCategories,
              ];

        saveCategories(updated);

        return updated;
      }
    );

    setDialogOpen(false);
    setSelectedCategory(null);
  };

  const handleReset = () => {
    setSearch("");
    setStatus("All");
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <p className="text-sm font-medium text-primary">
            Inventory Management
          </p>

          <h1 className="text-2xl font-bold">
            Categories
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage categories used to organize
            hospital inventory items.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          <Plus size={17} />

          Add Category
        </button>

      </div>

      {/* STATS */}

      <CategoryStats
        categories={categories}
      />

      {/* FILTERS */}

      <section className="surface-card p-5">

        <div className="mb-4">
          <h2 className="text-base font-semibold">
            Category Filters
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Search and filter categories.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_220px_auto]">

          <div className="relative">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search category..."
              className="h-10 w-full rounded-lg border border-border bg-background pl-10 pr-3 text-sm outline-none focus:border-primary"
            />

          </div>

          <select
            value={status}
            onChange={(event) =>
              setStatus(
                event.target.value
              )
            }
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"
          >
            <option value="All">
              All Status
            </option>

            <option value="Active">
              Active
            </option>

            <option value="Inactive">
              Inactive
            </option>
          </select>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border px-4 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <RotateCcw size={16} />

            Reset
          </button>

        </div>

        <div className="mt-4 border-t border-border pt-4">

          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-semibold text-foreground">
              {filteredCategories.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-foreground">
              {categories.length}
            </span>{" "}
            categories
          </p>

        </div>

      </section>

      {/* TABLE */}

      <CategoryTable
        categories={filteredCategories}
        onView={handleView}
        onEdit={handleEdit}
      />

      {/* ADD / EDIT */}

      <AddCategoryDialog
        open={dialogOpen}
        category={selectedCategory}
        onClose={() => {
          setDialogOpen(false);
          setSelectedCategory(null);
        }}
        onSave={handleSave}
      />

      {/* VIEW */}

      <CategoryViewDialog
        open={viewOpen}
        category={selectedCategory}
        onClose={() => {
          setViewOpen(false);
          setSelectedCategory(null);
        }}
      />

    </div>
  );
}