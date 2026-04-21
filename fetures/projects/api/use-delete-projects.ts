import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType, InferRequestType } from "hono/client";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  typeof client.api.projects[":projectId"]["$delete"]
>;
type RequestType = InferRequestType<
  typeof client.api.projects[":projectId"]["$delete"]
>;

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
 const router = useRouter();
  const params = useParams();
   const workspaceId = params.workspace as string; 

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.projects[":projectId"]["$delete"]({
        param,
      });

      if (!response.ok) throw new Error("Failed to delete project");

      return await response.json();
    },

    onSuccess: () => {
      toast.success("Project deleted");
      
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      router.push(`/dashboard/workspace/${workspaceId}`); // ← redirect here
    },

    onError: () => {
      toast.error("Failed to delete project");
    },
  });
};