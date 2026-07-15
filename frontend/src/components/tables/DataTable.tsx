import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";

export interface DataTableColumn<T> {
  /** Unique key. If it matches a key on T, sorting works automatically. */
  key: string;
  label: string;
  /** Custom cell renderer. If omitted, falls back to row[key]. */
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  width?: number | string;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  /** Unique id per row, used for React keys — required so partial re-renders don't misplace rows */
  getRowId: (row: T) => string | number;
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;

  /** Pagination — omit all three to render an unpaginated table */
  page?: number;
  rowsPerPage?: number;
  totalCount?: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  rowsPerPageOptions?: number[];
}

/**
 * Shared table for every list screen (doctor queue, order lists, prescription
 * queue, patient search, etc). Supports two modes:
 *
 *  1. Simple: pass `rows` only -> renders everything, no pagination.
 *  2. Paginated: pass `page`, `rowsPerPage`, `totalCount`, `onPageChange` ->
 *     you fetch the correct page from the API yourself; this component
 *     stays presentation-only and never mutates your data.
 *
 * Sorting is client-side over the `rows` you pass in. If you're using
 * server-side pagination, sort on the server and just pass rows in order.
 */
export function DataTable<T>({
  columns,
  rows,
  getRowId,
  loading = false,
  emptyMessage = "No records found.",
  onRowClick,
  page,
  rowsPerPage,
  totalCount,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [10, 25, 50],
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("asc");

  const isPaginated =
    page !== undefined && rowsPerPage !== undefined && totalCount !== undefined;

  const sortedRows = React.useMemo(() => {
    if (!sortKey) return rows;
    const copy = [...rows];
    copy.sort((a, b) => {
      const av = (a as Record<string, unknown>)[sortKey];
      const bv = (b as Record<string, unknown>)[sortKey];
      if (av == null && bv == null) return 0;
      if (av == null) return -1;
      if (bv == null) return 1;

      if (typeof av === "number" && typeof bv === "number") {
        return sortDir === "asc" ? av - bv : bv - av;
      }
      const aStr = String(av);
      const bStr = String(bv);
      const cmp = aStr.localeCompare(bStr);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [rows, sortKey, sortDir]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <Paper variant="outlined" sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 640 }}>
        <Table stickyHeader size="small" aria-label="data table">
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  align={col.align ?? "left"}
                  sx={{ width: col.width }}
                >
                  {col.sortable ? (
                    <TableSortLabel
                      active={sortKey === col.key}
                      direction={sortKey === col.key ? sortDir : "asc"}
                      onClick={() => handleSort(col.key)}
                    >
                      {col.label}
                    </TableSortLabel>
                  ) : (
                    col.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading &&
              Array.from({ length: rowsPerPage ?? 5 }).map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      <Skeleton variant="text" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {!loading && sortedRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    {emptyMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              sortedRows.map((row) => (
                <TableRow
                  key={getRowId(row)}
                  hover={!!onRowClick}
                  onClick={() => onRowClick?.(row)}
                  sx={{ cursor: onRowClick ? "pointer" : "default" }}
                >
                  {columns.map((col) => (
                    <TableCell key={col.key} align={col.align ?? "left"}>
                      {col.render
                        ? col.render(row)
                        : String((row as Record<string, unknown>)[col.key] ?? "—")}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {isPaginated && (
        <Box sx={{ borderTop: "1px solid", borderColor: "divider" }}>
          <TablePagination
            component="div"
            count={totalCount!}
            page={page!}
            rowsPerPage={rowsPerPage!}
            rowsPerPageOptions={rowsPerPageOptions}
            onPageChange={(_, newPage) => onPageChange?.(newPage)}
            onRowsPerPageChange={(e) =>
              onRowsPerPageChange?.(parseInt(e.target.value, 10))
            }
          />
        </Box>
      )}
    </Paper>
  );
}
