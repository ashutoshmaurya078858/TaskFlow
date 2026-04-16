import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
interface getmamberProps {
  workspaceId: string;
}
export const useGetMembers = ({ workspaceId }: getmamberProps) => {
  return useQuery({
    queryKey: ["members",workspaceId],
    queryFn: async () => {
      const response = await client.api.members.$get({
        query: { workspaceId },
      });

      if (!response.ok) {
        throw new Error("failed to fetch Members");
      }

      const { data } = await response.json();
      return data;
    },
  });
};
