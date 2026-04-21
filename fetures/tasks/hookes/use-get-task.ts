import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

interface useGetTasksProps {
  workspaceId: string;
}

export const useGetTask = ({ workspaceId }: useGetTasksProps) => {
  return useQuery({
    queryKey: ["tasks", workspaceId],
    enabled: !!workspaceId, // <--- MUST BE HERE, OUTSIDE queryFn
    queryFn: async () => {
      const response = await client.api.tasks.$get({
        query: { workspaceId },
      });

      if (!response.ok) {
        throw new Error("failed to fetch Task");
      }

      const { data } = await response.json();
      return data;
    },
  });
};