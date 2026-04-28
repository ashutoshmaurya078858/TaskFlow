import Link from "next/link";
import { format, isToday, isTomorrow, isPast } from "date-fns";
import { ArrowRight, CheckCircle2, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { STATUS_COLORS, STATUS_LABELS, Task } from "../tasks/types";

// ─── helpers ──────────────────────────────────────────────────────────────────

interface DueMeta { label: string; urgent: boolean }

function getDueMeta(dateStr: string): DueMeta {
  const d = new Date(dateStr);
  if (isPast(d) && !isToday(d)) return { label: "Overdue",       urgent: true  };
  if (isToday(d))               return { label: "Due today",     urgent: true  };
  if (isTomorrow(d))            return { label: "Due tomorrow",  urgent: true  };
  return                               { label: format(d, "MMM d"), urgent: false };
}

// ─── TaskRow ──────────────────────────────────────────────────────────────────

interface TaskRowProps {
  task:        Task;
  workspaceId: string;
}

export function TaskRow({ task, workspaceId }: TaskRowProps) {
  const { bg, text, dot } = STATUS_COLORS[task.status];
  const dueMeta: DueMeta | null = task.dueDate ? getDueMeta(task.dueDate) : null;

  return (
    <Link
      href={`/dashboard/workspace/${workspaceId}/tasks/${task.$id}`}
      className="group flex items-center gap-3 py-3 px-4 -mx-4 rounded-xl hover:bg-gray-50 transition-colors"
    >
      <span className={cn("w-2 h-2 rounded-full shrink-0", dot)} />

      <span className="flex-1 text-sm font-medium text-gray-700 truncate group-hover:text-indigo-600 transition-colors">
        {task.name}
      </span>

      {dueMeta && (
        <span
          className={cn(
            "text-xs font-medium px-2 py-0.5 rounded-md border shrink-0",
            dueMeta.urgent
              ? "bg-red-50 text-red-500 border-red-100"
              : "bg-gray-50 text-gray-500 border-gray-200",
          )}
        >
          {dueMeta.label}
        </span>
      )}

      <span
        className={cn(
          "hidden sm:inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-md border shrink-0",
          bg, text,
        )}
      >
        {STATUS_LABELS[task.status]}
      </span>

      <ArrowRight className="size-3.5 text-gray-300 group-hover:text-indigo-400 transition-colors shrink-0" />
    </Link>
  );
}

// ─── SectionHeader ────────────────────────────────────────────────────────────

interface SectionHeaderProps {
  icon:   React.ReactNode;
  title:  string;
  count?: number;
}

export function SectionHeader({ icon, title, count }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-gray-400">{icon}</span>
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
        {title}
      </h2>
      {count !== undefined && (
        <span className="ml-auto text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
          {count}
        </span>
      )}
    </div>
  );
}

// ─── MyTasksList ──────────────────────────────────────────────────────────────

interface MyTasksListProps {
  tasks:       Task[];
  workspaceId: string;
  isLoading:   boolean;
}

export function MyTasksList({ tasks, workspaceId, isLoading }: MyTasksListProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <SectionHeader
        icon={<User className="size-3.5" />}
        title="My tasks"
        count={isLoading ? undefined : tasks.length}
      />

      {isLoading ? (
        <MyTasksSkeleton />
      ) : tasks.length === 0 ? (
        <div className="py-10 text-center">
          <CheckCircle2 className="size-8 text-green-300 mx-auto mb-2" />
          <p className="text-sm text-gray-400">No open tasks assigned to you</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-50">
          {tasks.map((task) => (
            <TaskRow key={task.$id} task={task} workspaceId={workspaceId} />
          ))}
        </div>
      )}
    </div>
  );
}

function MyTasksSkeleton() {
  return (
    <div className="space-y-3 py-1">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 py-2">
          <div className="w-2 h-2 rounded-full bg-gray-200 shrink-0" />
          <div
            className="h-3.5 rounded bg-gray-100 animate-pulse"
            style={{ width: `${55 + (i % 3) * 15}%` }}
          />
          <div className="ml-auto h-5 w-16 rounded-md bg-gray-100 animate-pulse" />
        </div>
      ))}
    </div>
  );
}