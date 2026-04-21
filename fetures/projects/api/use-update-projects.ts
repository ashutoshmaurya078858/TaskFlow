import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType, InferRequestType } from "hono/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


type ResponseType = InferResponseType<
  typeof client.api.projects[":projectId"]["$patch"]
>;

type RequestType = InferRequestType<
  typeof client.api.projects[":projectId"]["$patch"]
>;

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  const router = useRouter()

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, form }) => {
      const response = await client.api.projects[":projectId"]["$patch"]({
        param,
        form,
      });

      if (!response.ok) {
        throw new Error("Failed to update project");
      }

      return await response.json();
    },

    onSuccess: (_, { param }) => {
      toast.success("Project updated");
       router.refresh(); 
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", param.projectId] });
    },

    onError: () => {
      toast.error("Failed to update project");
    },
  });
};