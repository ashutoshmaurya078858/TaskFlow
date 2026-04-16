import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType, InferRequestType } from "hono/client";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.workspaces)[":workspace"]["reset-invite-code"]["$post"],
  200
>;

type RequestType = InferRequestType<
  (typeof client.api.workspaces)[":workspace"]["reset-invite-code"]["$post"]
>;

export const useResetWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response =
        await client.api.workspaces[":workspace"]["reset-invite-code"]["$post"]({
          param,
        });

      if (!response.ok) {
        throw new Error("Failed to reset invite code");
      }

      return await response.json();
    },

    onSuccess: (response) => {
      toast.success("Invite code reset successfully ✅");

      // 🔥 Invalidate all workspaces
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });

      // 🔥 Invalidate specific workspace
      queryClient.invalidateQueries({
        queryKey: ["workspace", response.data.$id],
      });
    },

    onError: () => {
      toast.error("Failed to reset invite code ❌");
    },
  });
};