"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Table2, LayoutGrid, Calendar, Plus, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useWorkspaceId } from "@/fetures/workspace/hookes/use-workspace-id";
import { useGetMembers } from "@/fetures/members/api/use-get-members";
import { useGetTask } from "../hookes/use-get-task";
import { Task } from "../types";

import { CreateTaskModal } from "./CreateTaskModal";
import { EditTaskModal } from "./EditTaskModal";
import { TableView } from "./TableView";
import { KanbanView } from "./KanbanView";
import { CalendarView } from "./Calendarview";
import { ConfirmDeleteTaskDialog } from "./ConfirmDeleteTaskDialog";

// --- Types & Constants ---
type TabType = "table" | "kanban" | "calendar";

interface Member {
  $id: string;
  name: string;
  email: string;
}

const TABS: { id: TabType; label: string; icon: React.ReactNode }[] = [
  { id: "table", label: "Table", icon: <Table2 className="size-3.5" /> },
  { id: "kanban", label: "Kanban", icon: <LayoutGrid className="size-3.5" /> },
  {
    id: "calendar",
    label: "Calendar",
    icon: <Calendar className="size-3.5" />,
  },
];

export default function TaskView() {
  const router = useRouter();
  const params = useParams();
  const workspaceId = useWorkspaceId();
  const projectId = params?.projectId as string | undefined;

  // --- State ---
  const [activeTab, setActiveTab] = useState<TabType>("table");
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // --- Data Fetching ---
  const { data: membersData } = useGetMembers({ workspaceId });
  const { data: tasksData, isLoading: isLoadingTasks } = useGetTask({
    workspaceId,
  });

  // --- Safe Data Fallbacks ---
  const members = (membersData?.populateMembers as unknown as Member[]) ?? [];
  const tasks = (tasksData?.documents as unknown as Task[]) ?? [];

  // --- Handlers ---
  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setEditOpen(true);
  };

  const handleDelete = (task: Task) => {
    setSelectedTask(task);
    setDeleteOpen(true);
  };

  const handleOpenTask = (task: Task) => {
    router.push(`/dashboard/workspace/${workspaceId}/tasks/${task.$id}`);
  };

  // STRICT STATE MANAGEMENT: Clear the selected task when closing modals
  const handleCloseEdit = (open: boolean) => {
    setEditOpen(open);
    if (!open) setTimeout(() => setSelectedTask(null), 300); // Wait for transition
  };

  const handleCloseDelete = (open: boolean) => {
    setDeleteOpen(open);
    if (!open) setTimeout(() => setSelectedTask(null), 300);
  };

  // GUARD: Do not render anything until workspaceId is successfully resolved
  if (!workspaceId) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="size-6 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <>
      <CreateTaskModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        workspaceId={workspaceId}
        projectId={projectId}
        members={members}
      />

      <EditTaskModal
        open={editOpen}
        onOpenChange={handleCloseEdit}
        task={selectedTask}
        members={members}
      />

      <ConfirmDeleteTaskDialog
        open={deleteOpen}
        onOpenChange={handleCloseDelete}
        task={selectedTask}
      />

      <div className="flex flex-col gap-4">
        {/* Header Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                  activeTab === tab.id
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700",
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <Button
            size="sm"
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-1.5 h-9 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg shadow-sm"
          >
            <Plus className="size-4" />
            New Task
          </Button>
        </div>

        <hr className="border-gray-100" />

        {/* View Rendering */}
        <div className="min-h-[400px]">
          {activeTab === "table" && (
            <TableView
              tasks={tasks}
              isLoading={isLoadingTasks}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleOpenTask}
            />
          )}
          {activeTab === "kanban" && (
            <KanbanView tasks={tasks} isLoading={isLoadingTasks} />
          )}
          {activeTab === "calendar" && (
            <CalendarView tasks={tasks} isLoading={isLoadingTasks} />
          )}
        </div>
      </div>
    </>
  );
}
