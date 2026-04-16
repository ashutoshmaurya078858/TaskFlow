import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType, InferRequestType } from "hono/client";
import { toast } from "sonner";

// Update the RPC path to target your members API
type ResponseType = InferResponseType<
  (typeof client.api.members)[":memberId"]["$delete"],
  200
>;

type RequestType = InferRequestType<
  (typeof client.api.members)[":memberId"]["$delete"]
>;

export const useDeleteMember = () => {
  const queryClient = useQueryClient(); 

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      // Point the client to the members route
      const response = await client.api.members[":memberId"]["$delete"]({
        param,
      });

      if (!response.ok) {
        throw new Error("Failed to delete member");
      }

      return await response.json();
    },

    onSuccess: () => {
      toast.success("Member removed successfully");
      
      // Invalidate the members query so the UI updates instantly
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },

    onError: () => {
      toast.error("Failed to remove member");
    },
  });
};