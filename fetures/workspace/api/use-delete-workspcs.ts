import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType, InferRequestType } from "hono/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.workspaces)[":workspace"]["$delete"],
  200
>;

type RequestType = InferRequestType<
  (typeof client.api.workspaces)[":workspace"]["$delete"]
>;

export const useDeleteWorkspace = () => {
  const router = useRouter();
  const queryClient = useQueryClient(); // ✅ FIX

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.workspaces[":workspace"]["$delete"]({
        param,
      });

      if (!response.ok) {
        throw new Error("workspace failed to delete");
      }

      return await response.json();
    },

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      // router.push(`/dashboard/workspace/${response.data.$id}`);
    },
    
  });
};
