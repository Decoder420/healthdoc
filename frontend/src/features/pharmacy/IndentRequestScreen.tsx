"use client";

import { useEffect, useState } from "react";

import {
  useAuth,
  useUserRole,
} from "@/providers/auth-provider";

import { ROLES } from "@/config/roles";

import CreateDepartmentIndentDialog from "@/components/dashboard/inventory/departments/indent/CreateIndentDialog";

interface DepartmentIndent {
  id: string;
  requestNumber: string;
  departmentId: string;
  departmentName: string;
  requestedBy: string;
  priority: string;
  status: string;
  items: number;
  totalQuantity: number;
  createdAt: string;
  remarks: string;
  source: string;
  destination: string;
}

interface DepartmentIndentItem {
  id: string;
  itemId: string;
  itemName: string;
  availableStock: number;
  quantity: number;
}

const STORAGE_KEY =
  "hospital_department_indent_requests";

export default function DepartmentIndentRequestScreen() {
  const { user, isLoading } = useAuth();
  const role = useUserRole();

  const [openCreate, setOpenCreate] =
    useState(false);

  const [indents, setIndents] =
    useState<DepartmentIndent[]>([]);

  /*
   * Determine department from authenticated user.
   */
  const department = getDepartmentForUser(
    role,
    user?.departmentId,
    user?.departmentName,
  );

  const isInventoryManager =
    role === ROLES.INVENTORY_MANAGER;

  useEffect(() => {
    if (isLoading) return;

    const stored =
      localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      setIndents([]);
      return;
    }

    try {
      const parsed =
        JSON.parse(stored) as DepartmentIndent[];

      /*
       * Inventory Manager sees ALL requests.
       *
       * Department users see ONLY their
       * own department's requests.
       */
      if (isInventoryManager) {
        setIndents(parsed);
      } else {
        setIndents(
          parsed.filter(
            (indent) =>
              indent.departmentId ===
              department.departmentId,
          ),
        );
      }
    } catch {
      setIndents([]);
    }
  }, [
    isLoading,
    isInventoryManager,
    department.departmentId,
  ]);

  const handleSave = ({
    indent,
    indentItems,
  }: {
    indent: Record<string, unknown>;
    indentItems: DepartmentIndentItem[];
  }) => {
    /*
     * IMPORTANT:
     *
     * Never trust department information
     * coming from the dialog.
     *
     * Force it from the authenticated user.
     */
    const newIndent = {
      ...(indent as unknown as DepartmentIndent),

      departmentId:
        department.departmentId,

      departmentName:
        department.departmentName,

      requestedBy:
        user?.name ?? "Department User",

      source:
        department.departmentName,

      destination:
        "Central Inventory",
    };

    const stored =
      localStorage.getItem(STORAGE_KEY);

    let existing: DepartmentIndent[] = [];

    if (stored) {
      try {
        existing =
          JSON.parse(stored);
      } catch {
        existing = [];
      }
    }

    const updated = [
      ...existing,
      newIndent,
    ];

    /*
     * Save the complete list.
     */
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updated),
    );

    /*
     * Save items for this request.
     */
    localStorage.setItem(
      `${STORAGE_KEY}_items_${newIndent.id}`,
      JSON.stringify(indentItems),
    );

    /*
     * Department screen should only show
     * this department's requests.
     */
    setIndents(
      isInventoryManager
        ? updated
        : updated.filter(
            (item) =>
              item.departmentId ===
              department.departmentId,
          ),
    );

    setOpenCreate(false);
  };

  const pending =
    indents.filter(
      (item) =>
        item.status === "Pending",
    ).length;

  const approved =
    indents.filter(
      (item) =>
        item.status === "Approved",
    ).length;

  const rejected =
    indents.filter(
      (item) =>
        item.status === "Rejected",
    ).length;

  /*
   * Wait for authentication.
   */
  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading user information...
        </p>
      </div>
    );
  }

  /*
   * A normal department user MUST have
   * a department.
   */
  if (
    !isInventoryManager &&
    !department.departmentId
  ) {
    return (
      <div className="w-full p-6">
        <div className="surface-card p-8 text-center">
          <h2 className="text-lg font-semibold text-foreground">
            Department Not Assigned
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Your account is not assigned to a
            department. Please contact the
            administrator.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Indent Requests
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            {isInventoryManager
              ? "Review inventory requests raised by departments."
              : `Requests raised by ${department.departmentName} to Central Inventory.`}
          </p>
        </div>

        {!isInventoryManager && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() =>
              setOpenCreate(true)
            }
          >
            <span>+</span>
            Create Indent Request
          </button>
        )}
      </div>

      {/* Department indicator */}
      {!isInventoryManager && (
        <div className="rounded-xl border border-border bg-muted px-5 py-4">
          <p className="font-mono text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Your Department
          </p>

          <p className="mt-1 text-lg font-semibold text-foreground">
            {department.departmentName}
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Requests"
          value={indents.length}
        />

        <StatCard
          label="Pending"
          value={pending}
        />

        <StatCard
          label="Approved"
          value={approved}
        />

        <StatCard
          label="Rejected"
          value={rejected}
        />
      </div>

      {/* Table */}
      <div className="surface-card overflow-hidden">
        <div className="border-b border-border p-5">
          <h2 className="text-lg font-semibold text-foreground">
            {isInventoryManager
              ? "Department Indent Requests"
              : `${department.departmentName} Indent Requests`}
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {isInventoryManager
              ? "All requests received from hospital departments."
              : "Your department's requests to Central Inventory."}
          </p>
        </div>

        {indents.length === 0 ? (
          <div className="flex min-h-[260px] flex-col items-center justify-center p-8 text-center">
            <p className="font-semibold text-foreground">
              No indent requests
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              {isInventoryManager
                ? "No department has requested inventory items yet."
                : "Your department has not created any indent requests yet."}
            </p>

            {!isInventoryManager && (
              <button
                type="button"
                className="btn btn-primary mt-4"
                onClick={() =>
                  setOpenCreate(true)
                }
              >
                Create Indent Request
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr className="border-b border-border bg-muted">
                  <th className="px-5 py-3 text-left font-mono text-xs uppercase text-muted-foreground">
                    Request No.
                  </th>

                  <th className="px-5 py-3 text-left font-mono text-xs uppercase text-muted-foreground">
                    Department
                  </th>

                  <th className="px-5 py-3 text-left font-mono text-xs uppercase text-muted-foreground">
                    Requested By
                  </th>

                  <th className="px-5 py-3 text-center font-mono text-xs uppercase text-muted-foreground">
                    Items
                  </th>

                  <th className="px-5 py-3 text-center font-mono text-xs uppercase text-muted-foreground">
                    Quantity
                  </th>

                  <th className="px-5 py-3 text-left font-mono text-xs uppercase text-muted-foreground">
                    Priority
                  </th>

                  <th className="px-5 py-3 text-left font-mono text-xs uppercase text-muted-foreground">
                    Status
                  </th>

                  <th className="px-5 py-3 text-left font-mono text-xs uppercase text-muted-foreground">
                    Created
                  </th>
                </tr>
              </thead>

              <tbody>
                {indents.map(
                  (indent) => (
                    <tr
                      key={indent.id}
                      className="border-b border-border last:border-0 hover:bg-muted/50"
                    >
                      <td className="px-5 py-4 font-mono text-sm font-semibold text-primary">
                        {indent.requestNumber}
                      </td>

                      <td className="px-5 py-4 text-sm font-semibold text-foreground">
                        {indent.departmentName}
                      </td>

                      <td className="px-5 py-4 text-sm text-foreground">
                        {indent.requestedBy}
                      </td>

                      <td className="px-5 py-4 text-center text-sm font-semibold">
                        {indent.items}
                      </td>

                      <td className="px-5 py-4 text-center text-sm font-semibold">
                        {indent.totalQuantity}
                      </td>

                      <td className="px-5 py-4">
                        <Badge
                          value={
                            indent.priority
                          }
                        />
                      </td>

                      <td className="px-5 py-4">
                        <Badge
                          value={
                            indent.status
                          }
                        />
                      </td>

                      <td className="px-5 py-4 text-sm text-muted-foreground">
                        {indent.createdAt}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Dialog */}
      {!isInventoryManager && (
        <CreateDepartmentIndentDialog
          open={openCreate}
          onClose={() =>
            setOpenCreate(false)
          }
          onSave={handleSave}
        />
      )}
    </div>
  );
}

/* ----------------------------------------
   Department Resolver
----------------------------------------- */

function getDepartmentForUser(
  role: ReturnType<typeof useUserRole>,
  departmentId?: string,
  departmentName?: string,
) {
  /*
   * If the authenticated user already has
   * department information, ALWAYS use it.
   */
  if (departmentId && departmentName) {
    return {
      departmentId,
      departmentName,
    };
  }

  /*
   * Temporary fallback for your current
   * demo authentication system.
   */
  switch (role) {
    case ROLES.PHARMACIST:
      return {
        departmentId: "PHARMACY",
        departmentName: "Pharmacy",
      };

    case ROLES.LAB_TECHNICIAN:
      return {
        departmentId: "LABORATORY",
        departmentName: "Laboratory",
      };

    case ROLES.DOCTOR:
      return {
        departmentId: "OPD",
        departmentName: "OPD",
      };

    case ROLES.NURSE:
      return {
        departmentId: "WARD",
        departmentName: "Ward",
      };

    case ROLES.RECEPTIONIST:
      return {
        departmentId: "OPD",
        departmentName: "OPD",
      };

    default:
      return {
        departmentId: "",
        departmentName: "",
      };
  }
}

/* ----------------------------------------
   Stat Card
----------------------------------------- */

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="surface-card p-5">
      <p className="font-mono text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>

      <p className="mt-2 text-2xl font-semibold text-foreground">
        {value}
      </p>
    </div>
  );
}

/* ----------------------------------------
   Badge
----------------------------------------- */

function Badge({
  value,
}: {
  value: string;
}) {
  const normalized =
    value.toLowerCase();

  let classes =
    "inline-flex rounded-full border px-2.5 py-1 font-mono text-xs font-semibold";

  if (normalized === "approved") {
    classes +=
      " border-success/20 bg-success-muted text-success";
  } else if (normalized === "pending") {
    classes +=
      " border-warning/20 bg-warning-muted text-warning";
  } else if (normalized === "rejected") {
    classes +=
      " border-danger/20 bg-danger-muted text-danger";
  } else if (normalized === "urgent") {
    classes +=
      " border-warning/20 bg-warning-muted text-warning";
  } else if (normalized === "emergency") {
    classes +=
      " border-danger/20 bg-danger-muted text-danger";
  } else {
    classes +=
      " border-border bg-muted text-muted-foreground";
  }

  return (
    <span className={classes}>
      {value}
    </span>
  );
}