"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Table2,
  LayoutGrid,
  Calendar,
  Search,
  SlidersHorizontal,
  Loader2,
  CheckCircle2,
  Clock,
  CircleDashed,
  CircleAlert,
  XCircle,
  ChevronDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

import { useWorkspaceId } from "@/fetures/workspace/hookes/use-workspace-id";
import { useGetMembers } from "@/fetures/members/api/use-get-members";
import { Task, TaskStatus } from "./types";
import { useCurrent } from "@/app/(auth)/api/use-corrent";
import { useGetMyTasks } from "./api/use-getmy-task";
import { useUpdateTask } from "./hookes/use-update-task";
import { KanbanView, TaskUpdatePayload } from "./components/KanbanView";
import { ConfirmDeleteTaskDialog } from "./components/ConfirmDeleteTaskDialog";
import { EditTaskModal } from "./components/EditTaskModal";
import { TableView } from "./components/TableView";
import { CalendarView } from "./components/Calendarview";
import { Skeleton } from "@/components/ui/skeleton";

// ─── Types & Constants ────────────────────────────────────────────────────────
type TabType = "table" | "kanban" | "calendar";

interface Member {
  $id: string;
  name: string;
  email: string;
}

const TABS: { id: TabType; label: string; icon: React.ReactNode }[] = [
  { id: "table", label: "Table", icon: <Table2 className="size-3.5" /> },
  { id: "kanban", label: "Kanban", icon: <LayoutGrid className="size-3.5" /> },
  { id: "calendar", label: "Calendar", icon: <Calendar className="size-3.5" /> },
];

const STATUS_OPTIONS: {
  value: TaskStatus;
  label: string;
  icon: React.ReactNode;
  color: string;
}[] = [
  {
    value: TaskStatus.BACKLOG,
    label: "Backlog",
    icon: <CircleDashed className="size-3.5 text-slate-400" />,
    color: "bg-slate-100 text-slate-600 border-slate-200",
  },
  {
    value: TaskStatus.TODO,
    label: "Todo",
    icon: <CircleDashed className="size-3.5 text-gray-500" />,
    color: "bg-gray-100 text-gray-600 border-gray-200",
  },
  {
    value: TaskStatus.IN_PROGRESS,
    label: "In Progress",
    icon: <Clock className="size-3.5 text-blue-500" />,
    color: "bg-blue-50 text-blue-600 border-blue-200",
  },
  {
    value: TaskStatus.IN_REVIEW,
    label: "In Review",
    icon: <CircleAlert className="size-3.5 text-yellow-500" />,
    color: "bg-yellow-50 text-yellow-600 border-yellow-200",
  },
  {
    value: TaskStatus.DONE,
    label: "Done",
    icon: <CheckCircle2 className="size-3.5 text-green-500" />,
    color: "bg-green-50 text-green-600 border-green-200",
  },
];


// ─── Summary Card ─────────────────────────────────────────────────────────────
function SummaryCard({ label, count, icon, colorClass, isLoading }: {
  label: string;
  count: number;
  icon: React.ReactNode;
  colorClass: string;
  isLoading?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-3 px-4 py-3 rounded-xl border transition-all", colorClass)}>
      <span className="p-2 bg-white/50 rounded-lg shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase tracking-wider font-bold opacity-60">{label}</p>
        {isLoading ? (
          <Skeleton className="h-7 w-12 bg-current opacity-10 mt-1" />
        ) : (
          <p className="text-2xl font-bold tracking-tight mt-0.5">{count}</p>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function MyTasksView() {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const { data: currentUser } = useCurrent();

  const [activeTab, setActiveTab] = useState<TabType>("table");
  const [search, setSearch] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<TaskStatus[]>([]);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const { data: membersData } = useGetMembers({ workspaceId });
  const members = (membersData?.populateMembers as unknown as Member[]) ?? [];

  const myMember = members.find((m) => m.email === currentUser?.email);
  const myMemberId = myMember?.$id ?? "";

  // ── Query 1: ALL my tasks with no filters → drives the stats cards
  const { data: allTasksData, isLoading: isLoadingAll } = useGetMyTasks({
    workspaceId,
    assigneeId: myMemberId,
  });

  // ── Query 2: filtered tasks → drives the table/kanban/calendar view
  const { data: filteredTasksData, isLoading: isLoadingFiltered } = useGetMyTasks({
    workspaceId,
    assigneeId: myMemberId,
    // Send a single status to the API; multi-status is handled client-side
    status: selectedStatuses.length === 1 ? selectedStatuses[0] : null,
  });

  const allTasks = (allTasksData?.documents as unknown as Task[]) ?? [];
  const fetchedTasks = (filteredTasksData?.documents as unknown as Task[]) ?? [];

  // Client-side: search + multi-status on top of the API result
  const tasks = useMemo(() => {
    let filtered = fetchedTasks;
    if (search.trim()) {
      filtered = filtered.filter((t) =>
        t.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (selectedStatuses.length > 1) {
      filtered = filtered.filter((t) => selectedStatuses.includes(t.status));
    }
    return filtered;
  }, [fetchedTasks, search, selectedStatuses]);

  // Stats always come from the unfiltered query so they never go stale
  const stats = useMemo(
    () => ({
      total: allTasks.length,
      inProgress: allTasks.filter((t) => t.status === TaskStatus.IN_PROGRESS).length,
      done: allTasks.filter((t) => t.status === TaskStatus.DONE).length,
      overdue: allTasks.filter(
        (t) =>
          t.dueDate &&
          new Date(t.dueDate) < new Date() &&
          t.status !== TaskStatus.DONE
      ).length,
    }),
    [allTasks]
  );

  const { mutate: updateTask } = useUpdateTask();

  const handleEdit = (task: Task) => { setSelectedTask(task); setEditOpen(true); };
  const handleDelete = (task: Task) => { setSelectedTask(task); setDeleteOpen(true); };
  const handleOpenTask = (task: Task) => {
    router.push(`/dashboard/workspace/${workspaceId}/tasks/${task.$id}`);
  };
  const handleCloseEdit = (open: boolean) => {
    setEditOpen(open);
    if (!open) setTimeout(() => setSelectedTask(null), 300);
  };
  const handleCloseDelete = (open: boolean) => {
    setDeleteOpen(open);
    if (!open) setTimeout(() => setSelectedTask(null), 300);
  };
  const handleKanbanChange = (updates: TaskUpdatePayload[]) => {
    updates.forEach(({ $id, status, position }) => {
      updateTask({ param: { taskId: $id }, json: { status, position } });
    });
  };
  const toggleStatus = (status: TaskStatus) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  if (!workspaceId) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="size-6 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <>
      <EditTaskModal open={editOpen} onOpenChange={handleCloseEdit} task={selectedTask} members={members} />
      <ConfirmDeleteTaskDialog open={deleteOpen} onOpenChange={handleCloseDelete} task={selectedTask} />

      <div className="flex flex-col gap-5">
        {/* Header */}
        <div>
          <h1 className="text-xl font-semibold text-gray-900">My Tasks</h1>
          <p className="text-sm text-gray-500 mt-0.5">Tasks assigned to you across all projects</p>
        </div>

        {/* Summary Cards — driven by unfiltered allTasks */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <SummaryCard label="Total" count={stats.total}
            icon={<CircleDashed className="size-4 text-slate-500" />}
            colorClass="bg-slate-50 text-slate-700 border-slate-200" isLoading={isLoadingAll} />
          <SummaryCard label="In Progress" count={stats.inProgress}
            icon={<Clock className="size-4 text-blue-500" />}
            colorClass="bg-blue-50 text-blue-700 border-blue-200" isLoading={isLoadingAll} />
          <SummaryCard label="Completed" count={stats.done}
            icon={<CheckCircle2 className="size-4 text-green-500" />}
            colorClass="bg-green-50 text-green-700 border-green-200" isLoading={isLoadingAll} />
          <SummaryCard label="Overdue" count={stats.overdue}
            icon={<CircleAlert className="size-4 text-red-400" />}
            colorClass="bg-red-50 text-red-700 border-red-200" isLoading={isLoadingAll} />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
            {TABS.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                  activeTab === tab.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                )}>
                {tab.icon}{tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
              <Input placeholder="Search tasks..." value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-9 text-sm w-48 border-gray-200 focus-visible:ring-indigo-500" />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm"
                  className="h-9 gap-1.5 border-gray-200 text-sm bg-white hover:bg-gray-50">
                  <SlidersHorizontal className="size-3.5" />
                  Status
                  {selectedStatuses.length > 0 && (
                    <Badge className="ml-1 h-4 px-1.5 text-[10px] bg-indigo-600 text-white border-0">
                      {selectedStatuses.length}
                    </Badge>
                  )}
                  <ChevronDown className="size-3 ml-1 text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              {/* bg-white + border + shadow ensure the dropdown is always white */}
              <DropdownMenuContent align="end" className="w-44 bg-white border border-gray-100 shadow-lg">
                <DropdownMenuLabel className="text-xs text-gray-500">Filter by status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {STATUS_OPTIONS.map((opt) => (
                  <DropdownMenuCheckboxItem key={opt.value}
                    checked={selectedStatuses.includes(opt.value)}
                    onCheckedChange={() => toggleStatus(opt.value)}
                    className="text-sm cursor-pointer">
                    <span className="flex items-center gap-2">
                      {opt.icon}{opt.label}
                    </span>
                  </DropdownMenuCheckboxItem>
                ))}
                {selectedStatuses.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <button onClick={() => setSelectedStatuses([])}
                      className="w-full text-xs text-center py-1.5 text-red-500 hover:text-red-600 transition-colors">
                      Clear filters
                    </button>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Active filter pills */}
        {selectedStatuses.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap -mt-2">
            <span className="text-xs text-gray-400">Filtered by:</span>
            {selectedStatuses.map((s) => {
              const opt = STATUS_OPTIONS.find((o) => o.value === s)!;
              return (
                <button key={s} onClick={() => toggleStatus(s)}
                  className={cn("flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium", opt.color)}>
                  {opt.icon}{opt.label}
                  <XCircle className="size-3 ml-0.5 opacity-60" />
                </button>
              );
            })}
          </div>
        )}

       

        {/* View */}
        {(isLoadingFiltered || tasks.length > 0) && (
          <div className="min-h-64">
            {activeTab === "table" && (
              <TableView tasks={tasks} isLoading={isLoadingFiltered} onEdit={handleEdit} onDelete={handleDelete} onView={handleOpenTask} />
            )}
            {activeTab === "kanban" && (
              <KanbanView tasks={tasks} isLoading={isLoadingFiltered} onChange={handleKanbanChange} />
            )}
            {activeTab === "calendar" && (
              <CalendarView tasks={tasks} isLoading={isLoadingFiltered} />
            )}
          </div>
        )}
      </div>
    </>
  );
}