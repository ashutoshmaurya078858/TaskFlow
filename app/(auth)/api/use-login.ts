import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType, InferRequestType } from "hono/client";
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<
  typeof client.api.auth.login["$post"]
>;

type RequestType = InferRequestType<
  typeof client.api.auth.login["$post"]
>["json"];

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient(); // ✅ FIX

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.auth.login["$post"]({ json });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      return await response.json();
    },

    onSuccess: () => {
      // ✅ correct invalidation
      queryClient.invalidateQueries({ queryKey: ["current"] });
      // optional
      router.refresh();
    },
  });
};