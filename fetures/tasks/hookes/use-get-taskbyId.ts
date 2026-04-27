import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { Task } from "../types";

interface UseGetTaskByIdProps {
  taskId: string;
}

export const useGetTaskById = ({ taskId }: UseGetTaskByIdProps) => {
  return useQuery({
    queryKey: ["task", taskId],
    enabled: !!taskId,
    queryFn: async () => {
      const response = await client.api.tasks[":taskId"].$get({
        param: { taskId },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch task");
      }

      const { data } = await response.json();
      // Cast to Task so populated project/assignee fields are correctly typed
      return data as unknown as Task;
    },
  });
};