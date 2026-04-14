import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType, InferRequestType } from "hono/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  typeof client.api.workspaces[":workspace"]["$patch"],200
>;

type RequestType = InferRequestType<
  typeof client.api.workspaces[":workspace"]["$patch"]
>

export const useUpdateWorkspace = () => {
const router = useRouter()
  const queryClient = useQueryClient(); // ✅ FIX

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({form,param}) => {
      const response = await client.api.workspaces[":workspace"]["$patch"]({ form,param });

      if (!response.ok) {
        throw new Error("failed to update");
      }

      return await response.json();
    },

    onSuccess: ({data}) => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspaces",data.$id] });
      // router.push(`/dashboard/workspace/${data.$id}`)
   
    },
    onError:()=>{
      toast.error("Failed to create workspace")
    }
  });
};