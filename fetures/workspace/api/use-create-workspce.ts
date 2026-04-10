import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType, InferRequestType } from "hono/client";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  typeof client.api.workspaces["$post"]
>;

type RequestType = InferRequestType<
  typeof client.api.workspaces["$post"]
>["form"];

export const useCreateWorkspace = () => {

  const queryClient = useQueryClient(); // ✅ FIX

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (form) => {
      const response = await client.api.workspaces["$post"]({ form });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      return await response.json();
    },

    onSuccess: () => {
  
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
   
    },
    onError:()=>{
      toast.error("Failed to create workspace")
    }
  });
};