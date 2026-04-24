import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

interface useGetTasksProps {
  workspaceId: string;
  projectId?: string | null;  // 👈 add this
}
export const useGetTask = ({ workspaceId, projectId }: useGetTasksProps) => {
  return useQuery({
    queryKey: ["tasks", workspaceId, projectId],  // 👈 include projectId here
    enabled: !!workspaceId,
    queryFn: async () => {
      const response = await client.api.tasks.$get({
        query: { 
          workspaceId,
          projectId,  // 👈 pass it to the API
        },
      });

      if (!response.ok) {
        throw new Error("failed to fetch Task");
      }

      const { data } = await response.json();
      return data;
    },
  });
};
