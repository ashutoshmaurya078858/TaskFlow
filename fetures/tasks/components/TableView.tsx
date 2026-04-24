"use client";

import { useState, useMemo } from "react";
import { format, isPast, isToday, isTomorrow, isValid } from "date-fns";
import {
  AlertCircle,
  Loader2,
  ClipboardList,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { STATUS_COLORS, STATUS_LABELS, Task, TaskStatus } from "../types";
import { cn } from "@/lib/utils";

// ============================================================================
// Types & Constants
// ============================================================================

interface TableViewProps {
  tasks: Task[];
  isLoading: boolean;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  onView?: (task: Task) => void;
}

type SortField = "name" | "status" | "dueDate" | "assignee" | "project";
type SortDir = "asc" | "desc";

const PAGE_SIZE = 10;

const COLUMNS: { key: SortField; label: string }[] = [
  { key: "name", label: "Task" },
  { key: "status", label: "Status" },
  { key: "assignee", label: "Assignee" },
  { key: "project", label: "Project" },
  { key: "dueDate", label: "Due Date" },
];

// ============================================================================
// Safe Helpers
// ============================================================================

function Avatar({ name }: { name?: string }) {
  const initials =
    name
      ?.split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "?";
  const palettes = [
    "bg-violet-100 text-violet-700",
    "bg-blue-100 text-blue-700",
    "bg-emerald-100 text-emerald-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
  ];
  const color = palettes[(name?.charCodeAt(0) ?? 0) % palettes.length];

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold shrink-0",
        color,
      )}
    >
      {initials}
    </span>
  );
}

function StatusBadge({ status }: { status: TaskStatus }) {
  const c = STATUS_COLORS[status];
  return (
    <Badge
      variant="outline"
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border-0",
        c?.bg,
        c?.text,
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", c?.dot)} />
      {STATUS_LABELS[status] || "Unknown"}
    </Badge>
  );
}

function DueDateCell({ date }: { date: string | undefined | null }) {
  if (!date) return <span className="text-gray-400 text-sm">—</span>;

  const d = new Date(date);
  if (!isValid(d))
    return <span className="text-gray-400 text-sm">Invalid Date</span>;

  const isOverdue = isPast(d) && !isToday(d);
  const isDateToday = isToday(d);
  const isDateTomorrow = isTomorrow(d);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-sm font-medium",
        isOverdue && "text-red-500",
        isDateToday && "text-amber-500",
        isDateTomorrow && "text-blue-500",
        !isOverdue && !isDateToday && !isDateTomorrow && "text-gray-600",
      )}
    >
      {isOverdue && <AlertCircle className="w-3.5 h-3.5 shrink-0" />}
      {format(d, "MMM d, yyyy")}
      {isDateToday && (
        <span className="text-[10px] font-semibold bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded-full">
          Today
        </span>
      )}
      {isDateTomorrow && (
        <span className="text-[10px] font-semibold bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full">
          Tomorrow
        </span>
      )}
      {isOverdue && (
        <span className="text-[10px] font-semibold bg-red-100 text-red-500 px-1.5 py-0.5 rounded-full">
          Overdue
        </span>
      )}
    </span>
  );
}

function SortIcon({
  field,
  active,
  dir,
}: {
  field: string;
  active: string;
  dir: SortDir;
}) {
  if (active !== field)
    return <ArrowUpDown className="size-3 text-gray-300 ml-1" />;
  return dir === "asc" ? (
    <ArrowUp className="size-3 text-indigo-500 ml-1" />
  ) : (
    <ArrowDown className="size-3 text-indigo-500 ml-1" />
  );
}

function RowActions({
  task,
  onEdit,
  onDelete,
  onView,
}: {
  task: Task;
  onEdit?: (t: Task) => void;
  onDelete?: (t: Task) => void;
  onView?: (t: Task) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 opacity-0 group-hover:opacity-100 focus:opacity-100 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
        >
          <MoreHorizontal className="size-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44 bg-white">
        {onView && (
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onView(task);
            }}
            className="cursor-pointer text-sm"
          >
            <ClipboardList className="size-3.5 mr-2 text-gray-400" /> View
            details
          </DropdownMenuItem>
        )}
        {onEdit && (
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            className="cursor-pointer text-sm"
          >
            <Pencil className="size-3.5 mr-2 text-gray-400" /> Edit task
          </DropdownMenuItem>
        )}
        {(onView || onEdit) && onDelete && <DropdownMenuSeparator />}
        {onDelete && (
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task);
            }}
            className="cursor-pointer text-sm text-red-600 focus:text-red-600 focus:bg-red-50"
          >
            <Trash2 className="size-3.5 mr-2" /> Delete task
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ============================================================================
// Main Table Component
// ============================================================================

export function TableView({
  tasks = [],
  isLoading,
  onEdit,
  onDelete,
  onView,
}: TableViewProps) {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("dueDate");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);

  // --- Handlers ---
  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
    setPage(1);
  };

  // --- Data Processing ---
  const filteredTasks = useMemo(() => {
    if (!search) return tasks;
    const query = search.toLowerCase();
    return tasks.filter(
      (t) =>
        t.name?.toLowerCase().includes(query) ||
        t.assignee?.name?.toLowerCase().includes(query) ||
        t.project?.name?.toLowerCase().includes(query),
    );
  }, [tasks, search]);

  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "name":
          comparison = (a.name || "").localeCompare(b.name || "");
          break;
        case "status":
          comparison = (a.status || "").localeCompare(b.status || "");
          break;
        case "dueDate":
          const aTime = a.dueDate ? new Date(a.dueDate).getTime() : 0;
          const bTime = b.dueDate ? new Date(b.dueDate).getTime() : 0;
          comparison = aTime - bTime;
          break;
        case "assignee":
          comparison = (a.assignee?.name || "").localeCompare(
            b.assignee?.name || "",
          );
          break;
        case "project":
          comparison = (a.project?.name || "").localeCompare(
            b.project?.name || "",
          );
          break;
      }
      return sortDir === "asc" ? comparison : -comparison;
    });
  }, [filteredTasks, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sortedTasks.length / PAGE_SIZE));
  const paginatedTasks = sortedTasks.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  // --- Rendering ---
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="size-7 animate-spin text-indigo-400" />
        <p className="text-sm text-gray-400">Loading tasks...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
        <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
          <ClipboardList className="size-6 text-gray-300" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-600">No tasks yet</p>
          <p className="text-xs text-gray-400 mt-0.5">
            Create your first task to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Search Bar & Count */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search tasks..."
            className="w-full pl-8 pr-3 h-9 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all"
          />
        </div>
        <p className="text-xs text-gray-400 shrink-0">
          {filteredTasks.length} of {tasks.length} task
          {tasks.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Main Table Area */}
      <div className="rounded-xl border border-gray-100 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/80 hover:bg-gray-50/80 border-b border-gray-100">
              {COLUMNS.map((col) => (
                <TableHead
                  key={col.key}
                  onClick={() => toggleSort(col.key)}
                  className="cursor-pointer select-none whitespace-nowrap px-4 py-3 h-auto"
                >
                  <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-gray-500 uppercase tracking-wide hover:text-gray-700 transition-colors">
                    {col.label}
                    <SortIcon
                      field={col.key}
                      active={sortField}
                      dir={sortDir}
                    />
                  </span>
                </TableHead>
              ))}
              <TableHead className="w-12 px-2 py-3 h-auto" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedTasks.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-12 text-center text-sm text-gray-400"
                >
                  No tasks match your search.
                </TableCell>
              </TableRow>
            ) : (
              paginatedTasks.map((task) => (
                <TableRow
                  key={task.$id}
                  onClick={() => onView && onView(task)}
                  className="group hover:bg-indigo-50/30 transition-colors cursor-pointer border-b border-gray-50"
                >
                  <TableCell className="px-4 py-3.5 max-w-65">
                    <p className="font-medium text-gray-900 truncate group-hover:text-indigo-700 transition-colors">
                      {task.name}
                    </p>
                    {task.description && (
                      <p className="text-xs text-gray-400 truncate mt-0.5">
                        {task.description}
                      </p>
                    )}
                  </TableCell>

                  <TableCell className="px-4 py-3.5 whitespace-nowrap">
                    <StatusBadge status={task.status} />
                  </TableCell>

                  <TableCell className="px-4 py-3.5 whitespace-nowrap">
                    {task.assignee ? (
                      <div className="flex items-center gap-2">
                        <Avatar name={task.assignee.name} />
                        <span className="text-sm text-gray-700">
                          {task.assignee.name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 italic">
                        Unassigned
                      </span>
                    )}
                  </TableCell>

                  <TableCell className="px-4 py-3.5 whitespace-nowrap">
                    {task.project ? (
                      <span className="inline-flex items-center gap-1.5 text-sm text-gray-700">
                        <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0" />
                        {task.project.name}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </TableCell>

                  <TableCell className="px-4 py-3.5 whitespace-nowrap">
                    <DueDateCell date={task.dueDate} />
                  </TableCell>

                  <TableCell className="px-2 py-3.5 text-right">
                    <RowActions
                      task={task}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onView={onView}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination Footer */}
        <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-400">
            {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""}
            {totalPages > 1 && ` · Page ${page} of ${totalPages}`}
          </p>

          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center justify-center w-7 h-7 rounded-md border border-gray-200 text-gray-500 hover:bg-white hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="size-3.5" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
                )
                .reduce<(number | "...")[]>((acc, p, i, arr) => {
                  if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === "..." ? (
                    <span
                      key={`dots-${i}`}
                      className="text-xs text-gray-400 px-1"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p as number)}
                      className={cn(
                        "w-7 h-7 rounded-md text-xs font-medium transition-colors",
                        page === p
                          ? "bg-indigo-600 text-white"
                          : "text-gray-500 hover:bg-white border border-gray-200 hover:text-gray-700",
                      )}
                    >
                      {p}
                    </button>
                  ),
                )}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex items-center justify-center w-7 h-7 rounded-md border border-gray-200 text-gray-500 hover:bg-white hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="size-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
