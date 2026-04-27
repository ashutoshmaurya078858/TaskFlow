"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  ArrowLeft,
  Trash2,
  Pencil,
  Calendar,
  User,
  FolderOpen,
  Tag,
  AlignLeft,
  Loader2,
  Check,
  X,
  AlertCircle,
  Clock,
  CircleDashed,
  CheckCircle2,
  ChevronDown,
  TriangleAlert,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

import { useWorkspaceId } from "@/fetures/workspace/hookes/use-workspace-id";
import { useUpdateTask } from "../hookes/use-update-task";
import { useDeleteTask } from "../hookes/use-delete-task";
import { Task, TaskStatus } from "../types";
import { useGetTaskById } from "../hookes/use-get-taskbyId";

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<
  TaskStatus,
  { label: string; icon: React.ReactNode; badge: string; dot: string }
> = {
  [TaskStatus.BACKLOG]: {
    label: "Backlog",
    icon: <CircleDashed className="size-3.5" />,
    badge: "bg-slate-100 text-slate-600 border-slate-200",
    dot: "bg-slate-400",
  },
  [TaskStatus.TODO]: {
    label: "Todo",
    icon: <CircleDashed className="size-3.5" />,
    badge: "bg-gray-100 text-gray-600 border-gray-200",
    dot: "bg-gray-400",
  },
  [TaskStatus.IN_PROGRESS]: {
    label: "In Progress",
    icon: <Clock className="size-3.5" />,
    badge: "bg-blue-50 text-blue-600 border-blue-200",
    dot: "bg-blue-500",
  },
  [TaskStatus.IN_REVIEW]: {
    label: "In Review",
    icon: <AlertCircle className="size-3.5" />,
    badge: "bg-yellow-50 text-yellow-600 border-yellow-200",
    dot: "bg-yellow-500",
  },
  [TaskStatus.DONE]: {
    label: "Done",
    icon: <CheckCircle2 className="size-3.5" />,
    badge: "bg-green-50 text-green-600 border-green-200",
    dot: "bg-green-500",
  },
};

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({
  name,
  size = "md",
}: {
  name?: string;
  size?: "sm" | "md" | "lg";
}) {
  const initials =
    name
      ?.split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "?";

  const sizeClass = {
    sm: "w-6 h-6 text-[10px]",
    md: "w-8 h-8 text-xs",
    lg: "w-10 h-10 text-sm",
  }[size];

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-semibold shrink-0",
        sizeClass
      )}
    >
      {initials}
    </span>
  );
}

// ─── Detail Row ───────────────────────────────────────────────────────────────
function DetailRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 py-3">
      <div className="flex items-center gap-2 w-32 shrink-0">
        <span className="text-gray-400">{icon}</span>
        <span className="text-sm text-gray-500">{label}</span>
      </div>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

// ─── Delete Confirm Dialog (custom, no alert-dialog dependency) ───────────────
function DeleteConfirmDialog({
  onConfirm,
  isDeleting,
}: {
  onConfirm: () => void;
  isDeleting: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        disabled={isDeleting}
        className="text-red-400 hover:text-red-600 hover:bg-red-50 gap-1.5 h-8 text-sm"
      >
        {isDeleting ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : (
          <Trash2 className="size-3.5" />
        )}
        Delete
      </Button>

      {open && (
        /* Backdrop */
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => setOpen(false)}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />

          {/* Dialog */}
          <div
            className="relative z-10 bg-white rounded-2xl shadow-2xl shadow-black/10 border border-gray-100 p-6 w-full max-w-sm mx-4 animate-in fade-in-0 zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icon */}
            <div className="flex items-center justify-center w-11 h-11 rounded-full bg-red-50 border border-red-100 mx-auto mb-4">
              <TriangleAlert className="size-5 text-red-500" />
            </div>

            <h3 className="text-base font-bold text-gray-900 text-center mb-2">
              Delete this task?
            </h3>
            <p className="text-sm text-gray-400 text-center leading-relaxed mb-6">
              This action cannot be undone. The task and all its data will be
              permanently removed.
            </p>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 h-9 border-gray-200 text-gray-600 hover:bg-gray-50"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 h-9 bg-red-500 hover:bg-red-600 text-white border-0"
                onClick={() => {
                  setOpen(false);
                  onConfirm();
                }}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="size-3.5 animate-spin mr-1.5" />
                ) : null}
                Delete task
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Status Dropdown ──────────────────────────────────────────────────────────
function StatusDropdown({
  value,
  onChange,
  disabled,
}: {
  value: TaskStatus;
  onChange: (v: TaskStatus) => void;
  disabled: boolean;
}) {
  const current = STATUS_CONFIG[value];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          disabled={disabled}
          className={cn(
            "inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all hover:opacity-80 disabled:opacity-50",
            current.badge
          )}
        >
          {current.icon}
          {current.label}
          <ChevronDown className="size-3 ml-0.5 opacity-60" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-44 bg-white border border-gray-100 shadow-lg rounded-xl p-1"
      >
        <DropdownMenuLabel className="text-[10px] text-gray-400 uppercase tracking-widest px-2 py-1.5">
          Change status
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-50 my-1" />
        {Object.entries(STATUS_CONFIG).map(([key, config]) => (
          <DropdownMenuItem
            key={key}
            onClick={() => onChange(key as TaskStatus)}
            className={cn(
              "flex items-center gap-2.5 text-sm px-2 py-2 rounded-lg cursor-pointer transition-colors",
              value === key
                ? "bg-gray-50 text-gray-900"
                : "text-gray-600 hover:bg-gray-50"
            )}
          >
            <span className={cn("w-2 h-2 rounded-full shrink-0", config.dot)} />
            {config.icon}
            <span>{config.label}</span>
            {value === key && (
              <Check className="size-3 ml-auto text-indigo-500" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function TaskDetailPage() {
  const router = useRouter();
  const params = useParams();
  const workspaceId = useWorkspaceId();
  const taskId = params?.taskId as string;

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedDesc, setEditedDesc] = useState("");

  const { data: task, isLoading } = useGetTaskById({ taskId });
  const { mutate: updateTask, isPending: isUpdating } = useUpdateTask();
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask();

  const handleStatusChange = (value: TaskStatus) => {
    updateTask({ param: { taskId }, json: { status: value } });
  };

  const handleSaveName = () => {
    if (!editedName.trim() || editedName === task?.name) {
      setIsEditingName(false);
      return;
    }
    updateTask(
      { param: { taskId }, json: { name: editedName.trim() } },
      { onSettled: () => setIsEditingName(false) }
    );
  };

  const handleSaveDesc = () => {
    if (editedDesc === (task?.description ?? "")) {
      setIsEditingDesc(false);
      return;
    }
    updateTask(
      { param: { taskId }, json: { description: editedDesc } },
      { onSettled: () => setIsEditingDesc(false) }
    );
  };

  const handleDelete = () => {
    deleteTask(
      { param: { taskId } },
      { onSuccess: () => router.push(`/dashboard/workspace/${workspaceId}`) }
    );
  };

  const startEditName = () => {
    setEditedName(task?.name ?? "");
    setIsEditingName(true);
  };

  const startEditDesc = () => {
    setEditedDesc(task?.description ?? "");
    setIsEditingDesc(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="size-6 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <AlertCircle className="size-8 text-gray-300" />
        <p className="text-gray-500 font-medium">Task not found</p>
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          Go back
        </Button>
      </div>
    );
  }

  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue =
    dueDate && dueDate < new Date() && task.status !== TaskStatus.DONE;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-5">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href={`/dashboard/workspace/${workspaceId}`}
              className="text-gray-400 hover:text-gray-600 text-sm"
            >
              Workspace
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {task.project && (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={`/dashboard/workspace/${workspaceId}/projects/${task.project.$id}`}
                  className="text-gray-400 hover:text-gray-600 text-sm"
                >
                  {task.project.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </>
          )}
          <BreadcrumbItem>
            <BreadcrumbPage className="text-gray-700 text-sm font-medium truncate max-w-[200px]">
              {task.name}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back
          </button>
          <DeleteConfirmDialog onConfirm={handleDelete} isDeleting={isDeleting} />
        </div>

        <Separator className="bg-gray-50" />

        {/* Task name */}
        <div className="group">
          {isEditingName ? (
            <div className="flex items-center gap-2">
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveName();
                  if (e.key === "Escape") setIsEditingName(false);
                }}
                className="text-xl font-bold border-indigo-200 focus-visible:ring-indigo-400"
                autoFocus
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={handleSaveName}
                disabled={isUpdating}
                className="shrink-0 text-green-600 hover:bg-green-50"
              >
                {isUpdating ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Check className="size-4" />
                )}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsEditingName(false)}
                className="shrink-0 text-gray-400 hover:bg-gray-100"
              >
                <X className="size-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-start gap-2">
              <h1 className="text-xl font-bold text-gray-900 leading-snug flex-1">
                {task.name}
              </h1>
              <button
                onClick={startEditName}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"
              >
                <Pencil className="size-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Status row */}
        <div className="flex items-center gap-2 flex-wrap">
          <StatusDropdown
            value={task.status as TaskStatus}
            onChange={handleStatusChange}
            disabled={isUpdating}
          />
          {isOverdue && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-red-500 bg-red-50 border border-red-100 px-2.5 py-1 rounded-lg">
              <AlertCircle className="size-3" />
              Overdue
            </span>
          )}
          {isUpdating && (
            <Loader2 className="size-3.5 animate-spin text-gray-400 ml-1" />
          )}
        </div>
      </div>

      {/* Details card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
        <div className="px-6 py-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            Details
          </h2>
        </div>

        <div className="px-6">
          <DetailRow icon={<Tag className="size-3.5" />} label="Status">
            <StatusDropdown
              value={task.status as TaskStatus}
              onChange={handleStatusChange}
              disabled={isUpdating}
            />
          </DetailRow>
        </div>

        <div className="px-6">
          <DetailRow icon={<User className="size-3.5" />} label="Assignee">
            {task.assignee ? (
              <div className="flex items-center gap-2">
                <Avatar name={task.assignee.name} size="sm" />
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {task.assignee.name}
                  </p>
                  {task.assignee.email && (
                    <p className="text-xs text-gray-400">{task.assignee.email}</p>
                  )}
                </div>
              </div>
            ) : (
              <span className="text-sm text-gray-400">Unassigned</span>
            )}
          </DetailRow>
        </div>

        <div className="px-6">
          <DetailRow icon={<FolderOpen className="size-3.5" />} label="Project">
            {task.project ? (
              <span className="text-sm font-medium text-gray-800">
                {task.project.name}
              </span>
            ) : (
              <span className="text-sm text-gray-400">No project</span>
            )}
          </DetailRow>
        </div>

        <div className="px-6">
          <DetailRow icon={<Calendar className="size-3.5" />} label="Due date">
            {dueDate ? (
              <span
                className={cn(
                  "text-sm font-medium",
                  isOverdue ? "text-red-500" : "text-gray-800"
                )}
              >
                {format(dueDate, "MMM d, yyyy")}
                {isOverdue && (
                  <span className="ml-2 text-xs text-red-400 font-normal">
                    · overdue
                  </span>
                )}
              </span>
            ) : (
              <span className="text-sm text-gray-400">No due date</span>
            )}
          </DetailRow>
        </div>

        <div className="px-6">
          <DetailRow icon={<Clock className="size-3.5" />} label="Created">
            <span className="text-sm text-gray-500">
              {format(new Date(task.$createdAt), "MMM d, yyyy 'at' h:mm a")}
            </span>
          </DetailRow>
        </div>
      </div>

      {/* Description card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlignLeft className="size-3.5 text-gray-400" />
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Description
            </h2>
          </div>
          {!isEditingDesc && (
            <button
              onClick={startEditDesc}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors px-2 py-1 rounded-md hover:bg-gray-100"
            >
              <Pencil className="size-3" />
              Edit
            </button>
          )}
        </div>

        {isEditingDesc ? (
          <div className="space-y-3">
            <Textarea
              value={editedDesc}
              onChange={(e) => setEditedDesc(e.target.value)}
              placeholder="Add a description..."
              className="min-h-[140px] text-sm border-gray-200 focus-visible:ring-indigo-400 resize-none"
              autoFocus
            />
            <div className="flex items-center gap-2 justify-end">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditingDesc(false)}
                className="text-gray-500 h-8"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSaveDesc}
                disabled={isUpdating}
                className="bg-indigo-600 hover:bg-indigo-500 text-white h-8 px-4"
              >
                {isUpdating && (
                  <Loader2 className="size-3.5 animate-spin mr-1.5" />
                )}
                Save
              </Button>
            </div>
          </div>
        ) : task.description ? (
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
            {task.description}
          </p>
        ) : (
          <button
            onClick={startEditDesc}
            className="w-full text-sm text-gray-300 hover:text-gray-400 transition-colors py-8 border-2 border-dashed border-gray-100 rounded-xl text-center hover:border-gray-200"
          >
            Click to add a description...
          </button>
        )}
      </div>
    </div>
  );
}