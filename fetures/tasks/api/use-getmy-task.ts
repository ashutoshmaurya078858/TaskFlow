import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { TaskStatus } from "../types";

interface UseGetMyTasksProps {
  workspaceId: string;
  assigneeId: string; // current user's member $id
  status?: TaskStatus | null;
  projectId?: string | null;
  search?: string | null;
  dueDate?: string | null;
}

export const useGetMyTasks = ({
  workspaceId,
  assigneeId,
  status,
  projectId,
  search,
  dueDate,
}: UseGetMyTasksProps) => {
  return useQuery({
    queryKey: [
      "my-tasks",
      workspaceId,
      assigneeId,
      status,
      projectId,
      search,
      dueDate,
    ],
    enabled: !!workspaceId && !!assigneeId,
    queryFn: async () => {
      const response = await client.api.tasks.$get({
        query: {
          workspaceId,
          assigneeId,
          status: status ?? undefined,
          projectId: projectId ?? undefined,
          search: search ?? undefined,
          dueDate: dueDate ?? undefined,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch your tasks");
      }

      const { data } = await response.json();
      return data;
    },
  });
};