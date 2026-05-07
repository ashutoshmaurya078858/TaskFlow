import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType, InferRequestType } from "hono/client";
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<
  (typeof client.api.auth.register)["$post"]
>;

type RequestType = InferRequestType<
  (typeof client.api.auth.register)["$post"]
>["json"];

export const useRegister = () => {
  const queryClient = useQueryClient(); // ✅ FIX
  const router = useRouter(); // ✅ FIX

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.auth.register["$post"]({ json });

      if (!response.ok) {
        throw new Error("Register failed");
      }

      return await response.json();
    },

    onSuccess: () => {
      // ✅ update auth state
      queryClient.invalidateQueries({ queryKey: ["current"] });
      // ✅ refresh server components
      router.push("/dashboard");
    },
  });
};
