import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono/client";
import { toast } from "sonner";
import { client } from "@/lib/rpc";

// Infer types from your Hono route
type ResponseType = InferResponseType<typeof client.api.email.invite.$post, 200>;
type RequestType = InferRequestType<typeof client.api.email.invite.$post>;

export const useSendInvite = () => {
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const res = await client.api.email.invite.$post({
        json,
      });

      if (!res.ok) {
        throw new Error("Failed to send invite");
      }

      return await res.json();
    },

    onSuccess: () => {
      toast.success("Invite sent successfully 🚀");
    },

    onError: () => {
      toast.error("Failed to send invite ❌");
    },
  });
};