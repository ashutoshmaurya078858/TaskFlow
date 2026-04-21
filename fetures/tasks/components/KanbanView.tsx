"use client";

import { useEffect, useState, useCallback } from "react";
import { format, isPast, isToday, isValid } from "date-fns";
import { AlertCircle, Loader2 } from "lucide-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

import { STATUS_COLORS, STATUS_LABELS, Task, TaskStatus } from "../types";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

export interface TaskUpdatePayload {
  $id: string;
  status: TaskStatus;
  position: number;
}

interface KanbanViewProps {
  tasks: Task[];
  isLoading: boolean;
  // Triggered when a task is dropped. Wire this up to your API mutation!
  onChange?: (updates: TaskUpdatePayload[]) => void; 
}

const COLUMN_ORDER: TaskStatus[] = [
  TaskStatus.BACKLOG,
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.IN_REVIEW,
  TaskStatus.DONE,
];

// ============================================================================
// Components
// ============================================================================

function Avatar({ name }: { name?: string }) {
  const initials =
    name?.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() ?? "?";
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold shrink-0">
      {initials}
    </span>
  );
}

// ============================================================================
// Main Kanban Component
// ============================================================================

export function KanbanView({ tasks, isLoading, onChange }: KanbanViewProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [boardData, setBoardData] = useState<Record<TaskStatus, Task[]>>({
    [TaskStatus.BACKLOG]: [],
    [TaskStatus.TODO]: [],
    [TaskStatus.IN_PROGRESS]: [],
    [TaskStatus.IN_REVIEW]: [],
    [TaskStatus.DONE]: [],
  });

  // Hydration fix for Next.js & DnD libraries
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sync incoming server tasks to local state for optimistic updates
  useEffect(() => {
    const newBoard = {
      [TaskStatus.BACKLOG]: [],
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.IN_REVIEW]: [],
      [TaskStatus.DONE]: [],
    } as Record<TaskStatus, Task[]>;

    tasks.forEach((t) => {
      if (newBoard[t.status]) {
        newBoard[t.status].push(t);
      }
    });

    // Sort each column by position
    Object.keys(newBoard).forEach((key) => {
      newBoard[key as TaskStatus].sort((a, b) => a.position - b.position);
    });

    setBoardData(newBoard);
  }, [tasks]);

  const onDragEnd = useCallback(
    (result: DropResult) => {
      const { destination, source, draggableId } = result;

      // Dropped outside the list
      if (!destination) return;

      // Dropped in the exact same spot
      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      ) {
        return;
      }

      const sourceStatus = source.droppableId as TaskStatus;
      const destStatus = destination.droppableId as TaskStatus;

      // Deep copy to mutate safely
      const newBoard = { ...boardData };
      const sourceCol = [...newBoard[sourceStatus]];
      const destCol = sourceStatus === destStatus ? sourceCol : [...newBoard[destStatus]];

      // Remove from source
      const [movedTask] = sourceCol.splice(source.index, 1);

      // --- Calculate New Position ---
      let newPosition = 1000; // Default fallback
      
      if (destCol.length === 0) {
        // Dropping into an empty column
        newPosition = 1000;
      } else if (destination.index === 0) {
        // Dropping at the very top
        newPosition = destCol[0].position - 1000;
      } else if (destination.index === destCol.length) {
        // Dropping at the very bottom
        newPosition = destCol[destCol.length - 1].position + 1000;
      } else {
        // Dropping in the middle of two tasks
        const prevTask = destCol[destination.index - 1];
        const nextTask = destCol[destination.index];
        newPosition = (prevTask.position + nextTask.position) / 2;
      }

      // Update the task data
      movedTask.status = destStatus;
      movedTask.position = newPosition;

      // Insert into destination
      destCol.splice(destination.index, 0, movedTask);

      // Update local state (Optimistic UI update)
      newBoard[sourceStatus] = sourceCol;
      newBoard[destStatus] = destCol;
      setBoardData(newBoard);

      // Fire the change handler so the parent can update the API
      if (onChange) {
        onChange([
          {
            $id: draggableId,
            status: destStatus,
            position: newPosition,
          },
        ]);
      }
    },
    [boardData, onChange]
  );

  // Prevent hydration errors
  if (!isMounted) return null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="size-6 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {COLUMN_ORDER.map((status) => {
            const colTasks = boardData[status];
            const c = STATUS_COLORS[status];

            return (
              <Droppable key={status} droppableId={status}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={cn(
                      "flex flex-col gap-3 min-w-[260px] w-[260px] rounded-xl p-1.5 transition-colors",
                      snapshot.isDraggingOver ? "bg-gray-50" : "bg-transparent"
                    )}
                  >
                    {/* Column Header */}
                    <div className="flex items-center justify-between px-1">
                      <div className="flex items-center gap-2">
                        <span className={cn("w-2.5 h-2.5 rounded-full", c.dot)} />
                        <span className="text-sm font-semibold text-gray-700">
                          {STATUS_LABELS[status]}
                        </span>
                      </div>
                      <span
                        className={cn(
                          "text-xs font-semibold px-2 py-0.5 rounded-full",
                          c.bg,
                          c.text
                        )}
                      >
                        {colTasks.length}
                      </span>
                    </div>

                    {/* Draggable Cards Area */}
                    <div className="flex flex-col gap-2.5 min-h-[150px]">
                      {colTasks.length === 0 && !snapshot.isDraggingOver && (
                        <div className="rounded-xl border-2 border-dashed border-gray-100 py-8 flex items-center justify-center">
                          <p className="text-xs text-gray-300">No tasks</p>
                        </div>
                      )}

                      {colTasks.map((task, index) => (
                        <Draggable
                          key={task.$id}
                          draggableId={task.$id}
                          index={index}
                        >
                          {(provided, snapshot) => {
                            const d = new Date(task.dueDate);
                            const validDate = isValid(d);
                            const overdue = validDate && isPast(d) && !isToday(d);
                            const today = validDate && isToday(d);

                            return (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  ...provided.draggableProps.style,
                                }}
                                className={cn(
                                  "bg-white rounded-xl border p-3.5 flex flex-col gap-2.5 transition-all cursor-grab active:cursor-grabbing group",
                                  snapshot.isDragging
                                    ? "shadow-lg border-indigo-300 rotate-2 scale-105 z-50"
                                    : "border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-100"
                                )}
                              >
                                {/* Task name */}
                                <p className="text-sm font-semibold text-gray-900 leading-snug group-hover:text-indigo-700 transition-colors line-clamp-2">
                                  {task.name}
                                </p>

                                {/* Description */}
                                {task.description && (
                                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                                    {task.description}
                                  </p>
                                )}

                                {/* Project pill */}
                                {task.project && (
                                  <span className="inline-flex items-center self-start px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-xs font-medium">
                                    {task.project.name}
                                  </span>
                                )}

                                {/* Footer row */}
                                <div className="flex items-center justify-between pt-1 border-t border-gray-50">
                                  {/* Assignee */}
                                  {task.assignee ? (
                                    <div className="flex items-center gap-1.5">
                                      <Avatar name={task.assignee.name} />
                                      <span className="text-xs text-gray-500 truncate max-w-[90px]">
                                        {task.assignee.name}
                                      </span>
                                    </div>
                                  ) : (
                                    <span className="text-xs text-gray-300">
                                      Unassigned
                                    </span>
                                  )}

                                  {/* Due date */}
                                  {validDate && (
                                    <span
                                      className={cn(
                                        "text-xs font-medium flex items-center gap-1",
                                        overdue
                                          ? "text-red-500"
                                          : today
                                          ? "text-amber-500"
                                          : "text-gray-400"
                                      )}
                                    >
                                      {overdue && <AlertCircle className="w-3 h-3" />}
                                      {format(d, "MMM d")}
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          }}
                        </Draggable>
                      ))}
                      {/* Required by dnd to manage space when dragging */}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </div>
    </DragDropContext>
  );
}