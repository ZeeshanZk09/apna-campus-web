"use client";

import { ChevronLeft, ChevronRight, Loader2, Search } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  total?: number;
  page?: number;
  limit?: number;
  isLoading?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  onRowClick?: (row: T) => void;
  actions?: (row: T) => React.ReactNode;
  emptyMessage?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  total = 0,
  page = 1,
  limit = 20,
  isLoading = false,
  searchPlaceholder = "Search...",
  onSearch,
  onPageChange,
  onLimitChange,
  onRowClick,
  actions,
  emptyMessage = "No data found",
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const totalPages = Math.ceil(total / limit);

  const handleSearch = () => {
    onSearch?.(searchQuery);
  };

  return (
    <div className="space-y-4">
      {/* Search & Filters Bar */}
      <div className="flex items-center gap-4">
        {onSearch && (
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-9"
            />
          </div>
        )}
        {onLimitChange && (
          <Select
            value={String(limit)}
            onValueChange={(v) => onLimitChange(Number(v))}
          >
            <SelectTrigger className="w-30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 rows</SelectItem>
              <SelectItem value="20">20 rows</SelectItem>
              <SelectItem value="50">50 rows</SelectItem>
              <SelectItem value="100">100 rows</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key}>{col.label}</TableHead>
              ))}
              {actions && <TableHead className="w-25">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="h-24 text-center"
                >
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="h-24 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, index) => (
                <TableRow
                  key={(row.id as string) || index}
                  className={
                    onRowClick ? "cursor-pointer hover:bg-muted/50" : ""
                  }
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      {col.render
                        ? col.render(row[col.key], row)
                        : String(row[col.key] ?? "")}
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      {actions(row)}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)}{" "}
            of {total} results
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(page - 1)}
              disabled={page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(page + 1)}
              disabled={page >= totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Status badge helper
export function StatusBadge({ status }: { status: string }) {
  const variants: Record<
    string,
    "default" | "secondary" | "destructive" | "outline"
  > = {
    ACTIVE: "default",
    COMPLETED: "secondary",
    PRESENT: "default",
    ABSENT: "destructive",
    LATE: "outline",
    EXCUSED: "secondary",
    PENDING: "outline",
    PAID: "default",
    FAILED: "destructive",
    REFUNDED: "secondary",
    WITHDRAWN: "destructive",
    SUSPENDED: "destructive",
  };

  return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
}
