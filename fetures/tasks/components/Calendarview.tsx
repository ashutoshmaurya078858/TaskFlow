"use client";

import { useMemo, useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
  isSameDay,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  CalendarDays,
  X,
} from "lucide-react";
import { STATUS_COLORS, STATUS_LABELS, Task, TaskStatus } from "../types";
import { cn } from "@/lib/utils";

interface CalendarViewProps {
  tasks: Task[];
  isLoading: boolean;
}

const DAY_HEADERS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// ── Task Pill ─────────────────────────────────────────────────────────────────
function TaskPill({
  task,
  onClick,
}: {
  task: Task;
  onClick: (task: Task) => void;
}) {
  const c = STATUS_COLORS[task.status as TaskStatus];
  return (
    <button
      onClick={() => onClick(task)}
      title={task.name}
      className={cn(
        "w-full text-left truncate text-[11px] px-2 py-0.5 rounded-md font-medium transition-all hover:opacity-90 hover:shadow-sm",
        c.bg,
        c.text,
      )}
    >
      {task.name}
    </button>
  );
}

// ── Task Detail Popover ───────────────────────────────────────────────────────
function TaskDetailPanel({
  task,
  onClose,
}: {
  task: Task;
  onClose: () => void;
}) {
  const c = STATUS_COLORS[task.status];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 bg-white w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Color stripe */}
        <div className={cn("h-1 w-full", c.dot.replace("bg-", "bg-"))} />

        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <h3 className="text-base font-semibold text-gray-900 leading-snug">
              {task.name}
            </h3>
            <button
              onClick={onClose}
              className="shrink-0 p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Fields */}
          <div className="space-y-3">
            {/* Status */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                Status
              </span>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                  c.bg,
                  c.text,
                )}
              >
                <span className={cn("w-1.5 h-1.5 rounded-full", c.dot)} />
                {STATUS_LABELS[task.status]}
              </span>
            </div>

            {/* Due Date */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                Due Date
              </span>
              <span className="text-sm text-gray-700 font-medium">
                {format(new Date(task.dueDate), "MMM d, yyyy")}
              </span>
            </div>

            {/* Assignee */}
            {task.assignee && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                  Assignee
                </span>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold">
                    {task.assignee.name
                      ?.split(" ")
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-700">
                    {task.assignee.name}
                  </span>
                </div>
              </div>
            )}

            {/* Project */}
            {task.project && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                  Project
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm text-gray-700">
                  <span className="w-2 h-2 rounded-full bg-indigo-400" />
                  {task.project.name}
                </span>
              </div>
            )}

            {/* Description */}
            {task.description && (
              <div className="pt-2 border-t border-gray-50">
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wide block mb-1.5">
                  Description
                </span>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {task.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Calendar ─────────────────────────────────────────────────────────────
export function CalendarView({ tasks, isLoading }: CalendarViewProps) {
  const [current, setCurrent] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const days = useMemo(() => {
    const monthStart = startOfMonth(current);
    const monthEnd = endOfMonth(current);
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
    return eachDayOfInterval({ start: gridStart, end: gridEnd });
  }, [current]);

  const tasksByDay = useMemo(() => {
    const map: Record<string, Task[]> = {};
    tasks.forEach((t) => {
      if (!t.dueDate) return;
      const key = format(new Date(t.dueDate), "yyyy-MM-dd");
      if (!map[key]) map[key] = [];
      map[key].push(t);
    });
    return map;
  }, [tasks]);

  // Count tasks this month for the header
  const monthTaskCount = useMemo(() => {
    return tasks.filter((t) => {
      if (!t.dueDate) return false;
      return isSameMonth(new Date(t.dueDate), current);
    }).length;
  }, [tasks, current]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="size-7 animate-spin text-indigo-400" />
        <p className="text-sm text-gray-400">Loading calendar...</p>
      </div>
    );
  }

  return (
    <>
      {/* Task detail panel */}
      {selectedTask && (
        <TaskDetailPanel
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}

      <div className="rounded-xl border border-gray-100 overflow-hidden bg-white shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100">
              <CalendarDays className="size-4 text-indigo-500" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900 leading-tight">
                {format(current, "MMMM yyyy")}
              </h3>
              {monthTaskCount > 0 && (
                <p className="text-xs text-gray-400">
                  {monthTaskCount} task{monthTaskCount !== 1 ? "s" : ""} this
                  month
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrent(subMonths(current, 1))}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              onClick={() => setCurrent(new Date())}
              className="px-3 py-1 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => setCurrent(addMonths(current, 1))}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50/60">
          {DAY_HEADERS.map((d) => (
            <div
              key={d}
              className="py-2.5 text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wider"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 divide-x divide-y divide-gray-50">
          {days.map((day) => {
            const key = format(day, "yyyy-MM-dd");
            const dayTasks = tasksByDay[key] ?? [];
            const inMonth = isSameMonth(day, current);
            const todayDay = isToday(day);
            const MAX_SHOW = 3;

            return (
              <div
                key={key}
                className={cn(
                  "min-h-25 p-2 flex flex-col gap-1 transition-colors",
                  inMonth ? "bg-white hover:bg-gray-50/50" : "bg-gray-50/40",
                  todayDay && "bg-indigo-50/30 hover:bg-indigo-50/50",
                )}
              >
                {/* Day number */}
                <div className="flex justify-end mb-0.5">
                  <span
                    className={cn(
                      "text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full transition-colors",
                      todayDay
                        ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                        : inMonth
                        ? "text-gray-700 hover:bg-gray-100"
                        : "text-gray-300",
                    )}
                  >
                    {format(day, "d")}
                  </span>
                </div>

                {/* Task pills */}
                <div className="flex flex-col gap-0.5">
                  {dayTasks.slice(0, MAX_SHOW).map((t) => (
                    <TaskPill
                      key={t.$id}
                      task={t}
                      onClick={setSelectedTask}
                    />
                  ))}
                  {dayTasks.length > MAX_SHOW && (
                    <button className="text-left text-[11px] text-indigo-500 font-medium px-1.5 py-0.5 hover:text-indigo-700 transition-colors">
                      +{dayTasks.length - MAX_SHOW} more
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 bg-gray-50/60 border-t border-gray-100 flex items-center gap-4">
          {Object.values(TaskStatus).map((status) => {
            const c = STATUS_COLORS[status];
            return (
              <span key={status} className="flex items-center gap-1.5">
                <span className={cn("w-2 h-2 rounded-full", c.dot)} />
                <span className="text-[11px] text-gray-400">
                  {STATUS_LABELS[status]}
                </span>
              </span>
            );
          })}
        </div>
      </div>
    </>
  );
}