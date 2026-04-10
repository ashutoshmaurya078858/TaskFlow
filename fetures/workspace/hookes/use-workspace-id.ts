import { useParams } from "next/navigation";

export const useWorkspaceId = ( ) => {
const params = useParams();
return params.workspace as string;
};