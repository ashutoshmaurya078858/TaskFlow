import { Calendar } from "lucide-react";
import { TaskRow, SectionHeader } from "./MyTasksList";
import { Task } from "../tasks/types";

interface UpcomingDeadlinesProps {
  tasks:       Task[];
  workspaceId: string;
  isLoading:   boolean;
}

export function UpcomingDeadlines({ tasks, workspaceId, isLoading }: UpcomingDeadlinesProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <SectionHeader
        icon={<Calendar className="size-3.5" />}
        title="Upcoming deadlines"
        count={isLoading ? undefined : tasks.length}
      />

      {isLoading ? (
        <UpcomingSkeleton />
      ) : tasks.length === 0 ? (
        <div className="py-10 text-center">
          <Calendar className="size-8 text-gray-200 mx-auto mb-2" />
          <p className="text-sm text-gray-400">No deadlines in the next 7 days</p>
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

function UpcomingSkeleton() {
  return (
    <div className="space-y-3 py-1">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 py-2">
          <div className="w-2 h-2 rounded-full bg-gray-200 shrink-0" />
          <div
            className="h-3.5 rounded bg-gray-100 animate-pulse"
            style={{ width: `${50 + (i % 4) * 12}%` }}
          />
          <div className="ml-auto h-5 w-20 rounded-md bg-gray-100 animate-pulse" />
        </div>
      ))}
    </div>
  );
}