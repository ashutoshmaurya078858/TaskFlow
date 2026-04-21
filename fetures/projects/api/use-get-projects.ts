import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

interface useGetProjectsProps {
  workspaceId: string;
}

export const useGetProjects = ({ workspaceId }: useGetProjectsProps) => {
  return useQuery({
    queryKey: ["projects", workspaceId],
    // 👇 THIS IS CRITICAL. It tells React Query: "Do not run this fetch 
    // until workspaceId actually has a string value."
    enabled: !!workspaceId, 
    queryFn: async () => {
      const response = await client.api.projects.$get({
        query: { workspaceId },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }

      const { data } = await response.json();
      return data;
    },
  });
};