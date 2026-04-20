import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType, InferRequestType } from "hono/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<(typeof client.api.projects)["$post"]>;

type RequestType = InferRequestType<
  (typeof client.api.projects)["$post"]
>["form"];

export const useCreateProject = () => {
  const router = useRouter();
  const queryClient = useQueryClient(); // ✅ FIX

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (form) => {
      const response = await client.api.projects["$post"]({ form });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      return await response.json();
    },

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      // router.push(`/dashboard/workspace/${response.data.$id}`)
      toast.success("project created successfully");
    },
    onError: () => {
      toast.error("Failed to create proect");
    },
  });
};
