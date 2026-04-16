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
  (typeof client.api.members)[":memberId"]["$patch"]
>;

export const useUpdateMember = () => {
  const queryClient = useQueryClient(); 

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param,json }) => {
      // Point the client to the members route
      const response = await client.api.members[":memberId"]["$patch"]({
        param,
        json
      });

      if (!response.ok) {
        throw new Error("Failed to update member");
      }

      return await response.json();
    },

    onSuccess: () => {
      toast.success("Member updated successfully");
      
      // Invalidate the members query so the UI updates instantly
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },

    onError: () => {
      toast.error("Failed to remove member");
    },
  });
};