"use client";

import { useState } from "react";
import { Table2, LayoutGrid, Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useWorkspaceId } from "@/fetures/workspace/hookes/use-workspace-id";
import { useParams } from "next/navigation";
import { CreateTaskModal } from "./CreateTaskModal";
import { useGetMembers } from "@/fetures/members/api/use-get-members";

type TabType = "table" | "kanban" | "calendar";

const TABS: { id: TabType; label: string; icon: React.ReactNode }[] = [
  { id: "table", label: "Table", icon: <Table2 className="size-3.5" /> },
  { id: "kanban", label: "Kanban", icon: <LayoutGrid className="size-3.5" /> },
  {
    id: "calendar",
    label: "Calendar",
    icon: <Calendar className="size-3.5" />,
  },
];

interface Member {
  $id: string; // Appwrite uses $id
  name: string;
  email: string;
}

const TaskView = () => {
  const [activeTab, setActiveTab] = useState<TabType>("table");
  const [createOpen, setCreateOpen] = useState(false);

  const workspaceId = useWorkspaceId();
  const params = useParams();
  const projectId = params?.projectId as string | undefined;
  const { data } = useGetMembers({ workspaceId });
  const members = (data?.populateMembers as unknown as Member[]) || [];


  return (
    <>
      <CreateTaskModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        workspaceId={workspaceId}
        projectId={projectId}
        members={members}
      />

      <div className="flex flex-col gap-4">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          {/* View Tabs */}
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

          {/* New Task Button */}
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

        {/* Tab Content */}
        <div>
          {activeTab === "table" && (
            <div className="text-sm text-gray-400">
              Table view coming soon...
            </div>
          )}
          {activeTab === "kanban" && (
            <div className="text-sm text-gray-400">
              Kanban view coming soon...
            </div>
          )}
          {activeTab === "calendar" && (
            <div className="text-sm text-gray-400">
              Calendar view coming soon...
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TaskView;
